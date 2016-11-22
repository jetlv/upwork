/// <reference path="include.d.ts" />

var rp = require('request-promise');
var Promise = require('bluebird');
var cheerio = require('cheerio');
var fs = require('fs');
var stringTool = require('../../toolkits/stringtool');

// rp = rp.defaults({proxy: 'http://43.241.225.182:20225'});


var timeout = 3000;

/** compose url by yourself */
var urls = ['https://www.upwork.com/ab/account-security/login'];
var postForm = {
    "login[_token]": "GTPQbNRspNzTNrbZ9WFx5s9BuIi3pXD8TsBnl19em6o",
    "login[iovation]": "04003hQUMXGB0poNf94lis1zttBaVgjxlOd9G5mKV1GZGzZSop9ypcPEXI5oXH2S9TyVNt+dt8oFkemEzbpe+buO7ZwSX/4nfMUVFpGdpVdVZ9NIwoY8ye2u0nVLKa5eUqvJ5dzgojLfFGvNZhMeU+JzHlw3tzDaNpDqrrPWq+zbyhIM9YLJcLTb+jC3o7rRuIcS8IRMeMsIc8YoDvlKqcW/vgHzj486sjgyHfk2EOMYpr7TlD/AIVpzs+Xc3j97JsdBAgvBZwn30pqwFi2E19zadruaeaVR4SX95HUE0e+H+jBrRjLkmcdik1VFUOOvucAndQZWgQkSNPrOAp8SCqgzbLisC4nKfrLQe6fMDAkemg8/k/0y9m2vknfEF80+AcQH85Fx7fbLVb78nhBcxQ4RV2/hQM3S1GNcJ4+sWKcnyf7/clEyAjJUoEJI4/wX97IAaVmZqTD7tyd0W8+tYgTFPnzCN+9Xb1wJQnlZ32x/SWcpQs/EGzmZL7O11B19W0IbAbfFkp40PJDQ9koruUTYDv6a+9aA+etaS4rU3Z12opsxbi/CbxnsHJaxtx3NMDAkhCiebBE66IKYqVPGPgk+TlUCyP57qu9lCwRx8Ob0XCf+7s6WY27c+etgBx26wisOyAfUMZ5LKFpm2SGEcGZ2Ivba3OXvlsoR0Qwy19nvsAmdXzdsR3OVekTL8G+kNjwLy/ZGi/OZc1PWD1Ek94E2J53ZxfaATtBLfSXgXYvSH1AB84+POrI4Mh35NhDjGKa+f2B4Tpv0TfQ1gG7+dJK6MAX8iYyy5jvS7oc5h1YbsSgr/EeSBGPj0zvstEzHvLPqxKZFk5ZzIub+Z3QwtujFTklKRgk1OUYQDU5zSEzhL/4BfavMsy+lNCtAenspO+JHDJCD/ANhrraUo/lWxYnJd3eCe+Z3K2noD9YkNacPLny0nl7cLgzK3tgYE5EeCjvkDQSoXA0OuiTnOIhuIkXMvNciPTQaFQzm4jfKK15NCWEFDe65Bsc23SOKsxUcLg6bNt1jVKkjpCXGATDmzUKf0dqbmXBkPuwzhx1MFFPHZWl+8vRDzLpcBx36TZP6hkkqzrG6kR5GyLOAtDF4RzD1t9XvRVCDGXSauFu7aW9La2GotDcUkFOHzGMWq5Zdb096+AiToXz/as6w+jHzfHEMCAY8LH6JnK1hHZ0+syjTah6vqtcIVAzJLAfY/+MBGfJuOaPmVsolAAw3G66dqZCo2JMQlIo+SVsKKWr7XG4AjC0EA7Lg3ddqG8MtjEUMifpAxIuD77iOxab0yPv27eOLVSyJhseIHK93TCDnu8NeOt0BlbU3+E7+M4c4k7T//snH6oVt1yYtXWjGdMm7nqH1wn3EPopga4/Zw9GuUwrHZ8b4xPDcpR57NJ0hOUnEE0AZBesMEnAumSZO1Tp84e7/tyPmpbUtvuM3zQF5DkPI0MUtbx6LYLljwdfFm9xXcIheT0Q6qx26kzRwYH8q1qjDQbKxGp8Rq1i71fhZd6bXze2V4UWDdKfC+AaRs9qV4RFT8wt2uuV7JpjevEVGM4qkK5VPfVKB9sZJtX6SI6KD58uEAPzYL6ZTXQARQSOMbsanT8AuUOaYQjhYdrAVc0l0nTmQvNI6z/dvc0CA+UvacqlVQXB7goC+Ng==",
    "login[password]": "smita123456",
    "login[redir]": "/home",
    "login[username]": "smitachopadekar@gmail.com"
}



Promise.all(Promise.map(urls, singleRequest, {concurrency: 3})).then();


/** Single Req */
function singleRequest(url) {
    var options = {
        method: 'POST',
        uri: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0"
        },
        form: postForm,
        gzip: true,
        resolveWithFullResponse: true,
        followRedirect: true,
        simple: false
    };
    return rp(options)
        .then(function (response) {
            var cookies = stringTool.getSessions(response)
            console.log(cookies);
            return new Promise(function (res, rej) {
                setTimeout(function () {
                    res(cookies);
                }, timeout);
            });

        }).then(function (cookies) {
            console.log('Cookies fetched');
            var options = {
                method: 'GET',
                uri: 'https://www.upwork.com/jobs/?spellcheck=1&highlight=1&sortBy=s_ctime+desc&cn1%5B%5D=Web%2C+Mobile+%26+Software+Dev&cn2%5B%5D=Web+Development&cn2%5B%5D=Other+-+Software+Development&cn2%5B%5D=Desktop+Software+Development&cn2%5B%5D=Scripts+%26+Utilities&exp%5B%5D=2&exp%5B%5D=3&amount%5B%5D=Min&amount%5B%5D=1k',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:49.0) Gecko/20100101 Firefox/49.0",
                    "Cookie": cookies
                },
                gzip: true
            };
            return rp(options)
                .then(function (body) {
                    var $ = cheerio.load(body);
                    var linkArray = [];
                    var jobs = $('.job-tile');
                    jobs.each(function (index, element) {
                        var dataKey = $(this).attr('data-key');
                        var link = 'https://www.upwork.com/jobs/' + dataKey;
                        linkArray.push(link);
                    });
                    return {linkArray: linkArray, cookies: cookies};
                });

        }).then(function (context) {
            var linkArray = context.linkArray;
            var cookies = context.cookies;

            return Promise.map(linkArray, function (link) {
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
                        // var info = $('#layout .row').eq(1).find('.col-md-9 .air-card-group').eq(0).find('.air-card').eq(1).find('.col-md-6').eq(1).text().trim();
                        var bottoms = $('.m-md-bottom');
                        var targetDiv = null;
                        bottoms.each(function (index, element) {
                            if ($(this).text() === 'Activity on this Job') {
                                targetDiv = $(this).parent('div');
                            }
                        });
                        if (targetDiv) {
                            var info = targetDiv.text().trim();
                            fs.appendFileSync('Info.txt', info + '\r\n');
                        }
                        return 0;
                    });
            }, {concurrency: 3});


        }).catch(function (err) {
            //handle errors
            console.log(err.message);
        });
}
