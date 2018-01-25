var express = require('express');
var app = express();
var https = require('https');
var requestIp = require('request-ip');
var readConfig = require('read-config'),
    config = readConfig('./config.json');
app.use(express.static('public'));

app.get("/data", function (request, response) {
    //console.log(config);
    var path = String(config.path);
    var clientIp = requestIp.getClientIp(request);
    console.log(clientIp);
    getData(path, function (data) {
        var dataConvert = data.replace(config.token, '');
       var dataConvert1 = dataConvert.replace(config.token, '');
        var dataJson = JSON.parse(dataConvert1);

        response.send(dataJson);
    });
});

app.get('/next', function (req, res) {
    var pa = config.feed;
    var th = req.url.replace('/next', '');
    var path = pa.concat(th).concat(config.token);

    getData(path, function (data) {
        var dataConvert = data.replace(config.token, '');
        dataConvert = dataConvert.replace(config.token, '');
        var dataConvert1 = dataConvert.replace(config.token, '');

        res.send(dataConvert1);
    })
});

function getData(path, callbackData) {
    var str = '';

    var options = {
        host: 'graph.facebook.com',
        path: path,
        method: 'GET'
    }

    callback = function (response) {
        response.on('data', function (chunk) {
            str += chunk;

        });
        response.on('end', function () {
            //console.log(str);
            callbackData(str);
        });

        return str;
    }

    var req = https.request(options, callback).end();
}

var listener = app.listen(config.port, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
