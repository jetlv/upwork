var webdriver = require('selenium-webdriver');
var by = webdriver.By;
var fs = require('fs');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36';
//'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0'

var getCookie = function (usr, psw) {
    var caps = webdriver.Capabilities.phantomjs();
    caps.set("browserConnectionEnabled", true);
    caps.set("handlesAlerts", true);
    caps.set("databaseEnabled", true);
    caps.set("locationContextEnabled", true);
    caps.set("applicationCacheEnabled", true);
    caps.set("webStorageEnabled", true);
    caps.set("acceptSslCerts", true);
    caps.set("phantomjs.page.settings.userAgent", userAgent);
    var driver = new webdriver.Builder().withCapabilities(caps).build();

    return driver.get('https://www.upwork.com/ab/account-security/login').then(function () {
        driver.getPageSource().then(function (source) {
            fs.writeFileSync('source_0.html', source);
        });
        return driver.findElement(by.id('login_username')).sendKeys(usr);
    }).then(function () {
        return driver.findElement(by.id('login_password')).sendKeys(psw);
    }).then(function () {
        driver.getPageSource().then(function (source) {
            fs.writeFileSync('source.html', source);
        });
        return driver.wait(function () {
            return driver.findElement(by.css('.m-md-top .btn-primary')).isDisplayed();
        }, 10000);
    }).then(function () {
        return driver.findElement(by.css('.m-md-top .btn-primary')).click();
    }).then(function () {
        return driver.manage().getCookies().then(function (cookies) {
            var cookieStr = '';
            cookies.forEach(function (cookie, index, array) {
                cookieStr += cookie.name + '=' + cookie.value + '; ';
            });
            driver.quit();
            return cookieStr;
        });
    });
}

var allProcess = function (usr, psw) {
    var entity = {};
    var jobsHtml = [];
    var applicants = [];
    entity.jobsHtml = jobsHtml;
    entity.applicants = applicants;
    var caps = webdriver.Capabilities.phantomjs();
    caps.set("browserConnectionEnabled", true);
    caps.set("handlesAlerts", true);
    caps.set("databaseEnabled", true);
    caps.set("locationContextEnabled", true);
    caps.set("applicationCacheEnabled", true);
    caps.set("webStorageEnabled", true);
    caps.set("acceptSslCerts", true);
    caps.set("phantomjs.page.settings.userAgent", userAgent);
    var driver = new webdriver.Builder().withCapabilities(caps).build();

    return driver.get('https://www.upwork.com/ab/account-security/login').then(function () {
        driver.getPageSource().then(function (source) {
            fs.writeFileSync('source_0.html', source);
        });
        return driver.findElement(by.id('login_username')).sendKeys(usr);
    }).then(function () {
        return driver.findElement(by.id('login_password')).sendKeys(psw);
    }).then(function () {
        driver.getPageSource().then(function (source) {
            fs.writeFileSync('source.html', source);
        });
        return driver.wait(function () {
            return driver.findElement(by.css('.m-md-top .btn-primary')).isDisplayed();
        }, 10000);
    }).then(function () {
        return driver.findElement(by.css('.m-md-top .btn-primary')).click();
    }).then(function () {
        return driver.get('https://www.upwork.com/jobs/?spellcheck=1&highlight=1&sortBy=s_ctime+desc&cn1%5B%5D=Web%2C+Mobile+%26+Software+Dev&cn2%5B%5D=Web+Development&cn2%5B%5D=Other+-+Software+Development&cn2%5B%5D=Desktop+Software+Development&cn2%5B%5D=Scripts+%26+Utilities&exp%5B%5D=2&exp%5B%5D=3&amount%5B%5D=Min&amount%5B%5D=1k');
    }).then(function () {
        return driver.getPageSource();
    }).then(function (source) {
        var phpVar = source.match(/var phpVars =(.*);/)[1];
        var phpVarJson = JSON.parse(phpVar);
        entity.jobs = phpVarJson;
        var linkArray = [];
        phpVarJson.jobs.forEach(function (job, index, array) {
            var dataKey = job.ciphertext;
            var link = 'https://www.upwork.com/jobs/' + dataKey;
            linkArray.push(link);
        });
        var context = {linkArray: linkArray};
        return context;
    }).then(function (context) {
        var link = context.linkArray[0];
        return driver.get(link).then(function () {
            return context;
        })
    }).then(function (context) {
        console.log('start working on job html');
        return driver.getPageSource().then(function (source) {
            entity.jobsHtml.push(source)
            return context;
        });
    }).then(function (context) {
        console.log('start working on applicants');
        var applicantsLink = context.linkArray[0] + '/applicants';
        return driver.get(applicantsLink).then(function () {
            return driver.getPageSource().then(function (source) {
                // console.log(source);
                var $ = cheerio.load(source);
                var jsonStr = $('pre').text();
                var applicants = JSON.parse(jsonStr);
                entity.applicants.push(applicants);
                return 0;
            });
        });
    }).then(function () {
        var folderName = Date.now().toString();
        fs.mkdirSync(folderName);
        fs.writeFileSync(folderName + '/' + 'result.json', JSON.stringify(entity));
    });
}


module.exports = {
    getCookie: getCookie,
    allProcess: allProcess
}