

/**
 * regular har header(v 1.2)
 */
module.exports.regularHeader = function (host, cookie) {
    return [{
        "name": "Host",
        "value": host
    },
        {
            "name": "User-Agent",
            "value": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"
        },
        {
            "name": "Accept",
            "value": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        },
        {
            "name": "Accept-Encoding",
            "value": "gzip, deflate"
        },
        {
            "name": "Content-Type",
            "value": "application/x-www-form-urlencoded"
        },
        {
            "name": "Upgrade-Insecure-Requests",
            "value": "1"
        },
        {
            "name": "Accept-Language",
            "value": "zh-CN,zh;q=0.8"
        },
        {
            "name": "Cookie",
            "value": cookie
        }
    ]
}
/**
 * Fetch all email dress from a string. Return an array
 */
module.exports.fetchAllMailAddress = function (str) {
    // var matched = str.match(/(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/ig);
    // if(matched[0].length > 30) {
    //     return null;
    // }
    // return matched;
    return str.match(/(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/ig);
}

/**
 * Fetch all .com email dress from a string. Return an array
 */
module.exports.fetchAllComMailAddress = function (str) {
    var matched = str.match(/(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+com)/ig);
}

/**
 * @param size count of numbers
 * @return fetched number
 * fetch number from string
 */
module.exports.fetchNumbersFromString = function (str, size) {
    var regexp = '\\d{' + size + '}';
    return str.match(regexp) ? str.match(regexp)[0] : null;
}


/**
 * Get a random string via length provided
 */
module.exports.randomStr = function (len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

/** get cookies string by resp */
module.exports.getSessions = function (resp) {
    var cookies = [];
    var fullArr = resp.headers['set-cookie'];
    for (var i in fullArr) {
        cookies.push(fullArr[i].split(';')[0]);
    }

    return cookies.join("; ");
}