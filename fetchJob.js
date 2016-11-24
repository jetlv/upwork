/// <reference path="include.d.ts" />

/**
 *  1)About Promise, google it directly. Do you know async.js? They are doing similar things but by different way. Promise is a new feature of ECMAScript 6.
 *  You can have a basic understanding - http://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call/14220323#14220323
 *  Here I am using blubird - http://bluebirdjs.com/docs/getting-started.html
 *  Bluebird is a wrapper of Promise, it's easier than original Promise api.
 *
 *  2)request-promise - https://github.com/request/request-promise
 *  A kind of promisfied framwork of request module.
 */
var rp = require('request-promise');
var Promise = require('bluebird');
var cheerio = require('cheerio');
var fs = require('fs');
var stringTool = require('./stringtool');
var getCookie = require('./webdriverHelper').getCookie;

/**
 * Here you can configure proxies if needed
 */
// rp = rp.defaults({proxy: 'http://43.241.225.182:20225'});
rp = rp.defaults({proxy: 'http://test2.qypac.net:56139'});

/**
 *  Configure usr/pass by yourself
 */
var email = 'smitachopadekar@gmail.com';
var password = 'smita123456';

var timeout = 3000;


/** compose url by yourself */
var urls = ['https://www.upwork.com/ab/account-security/login'];
// Promise.all(Promise.map(urls, singleRequest, {concurrency: 3})).then();

require('./webdriverHelper').allProcess(email, password);


/** Single Req */
function singleRequest(url) {
    var entity = {};
    var jobsHtml = [];
    var applicants = [];
    entity.jobsHtml = jobsHtml;
    entity.applicants = applicants;

    return getCookie(email, password).then(function (cookies) {
        console.log('Cookies fetched');
        var options = {
            method: 'GET',
            uri: 'https://www.upwork.com/jobs/?spellcheck=1&highlight=1&sortBy=s_ctime+desc&cn1%5B%5D=Web%2C+Mobile+%26+Software+Dev&cn2%5B%5D=Web+Development&cn2%5B%5D=Other+-+Software+Development&cn2%5B%5D=Desktop+Software+Development&cn2%5B%5D=Scripts+%26+Utilities&exp%5B%5D=2&exp%5B%5D=3&amount%5B%5D=Min&amount%5B%5D=1k',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0"
                // "Cookie": cookies
            },
            gzip: true,
            followRedirect: true
        };
        return rp(options)
            .then(function (body) {
                var bodyStr = body.toString();
                var phpVar = bodyStr.match(/var phpVars =(.*);/)[1];
                var phpVarJson = JSON.parse(phpVar);
                entity.jobs = phpVarJson;
                var linkArray = [];
                phpVarJson.jobs.forEach(function(job, index, array) {
                    var dataKey = job.ciphertext;
                    var link = 'https://www.upwork.com/jobs/' + dataKey;
                    linkArray.push(link);
                });
                return {linkArray: linkArray, cookies: cookies};
            });

    }).then(function (context) {
        /**
         * Start handling job html
         */
        console.log('start working on job html');
        var linkArray = context.linkArray;
        var cookies = context.cookies;
        linkArray = linkArray.slice(0, 1);
        return Promise.map(linkArray, function (link) {
            console.log('start working on job ' + link);
            var options = {
                method: 'GET',
                uri: link,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0",
                    "Cookie": cookies
                },
                gzip: true
            };

            return rp(options)
                .then(function (body) {
                    // fs.appendFileSync('body_detail.html', body);
                    var $ = cheerio.load(body);
                    var bodyStr = body.toString();
                    entity.jobsHtml.push(bodyStr)
                    return context;
                }).catch(function (err) {
                    console.log(link + ' - ' + err.message);
                });
        }, {concurrency: 3}).then(function () {
            return context;
        });


    }).then(function (context) {
        /**
         * start handling applicants
         */
        console.log('start working on applicants');
        var linkArray = context.linkArray;
        var cookies = context.cookies;
        linkArray = linkArray.slice(0, 1);
        return Promise.map(linkArray, function (link) {
            console.log('start working on applicants ' + link + '/applicants');
            var options = {
                method: 'GET',
                uri: link + '/applicants',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0",
                    "Cookie": cookies
                },
                gzip: true,
                json: true
            };

            return rp(options)
                .then(function (body) {
                    fs.writeFileSync('applicants.txt', body);
                    entity.applicants.push(body);
                    return context;
                }).catch(function (err) {
                    console.log(link + ' - ' + err.message);
                });
            ;
        }, {concurrency: 3}).then(function () {
            var folderName = Date.now().toString();
            fs.mkdirSync(folderName);
            fs.writeFileSync(folderName + '/' + 'result.json', JSON.stringify(entity));
        });
    }).catch(function (err) {
        //handle errors by yourself
        console.log(err.message);
    });
}
