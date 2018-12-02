'use strict';

// 导入http模块:
const http = require('http');
const fs = require('fs');
// https://github.com/agnat/node_wake_on_lan
var wol = require('wake_on_lan');

const ipFile = 'root/projects/server/cpc/currentip';
// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {

    fs.readFile(ipFile, function (err, data) {
        if (err) {
            response.end(err);
        } else {
            let ip = data.toString();
            console.log('current ip:', ip);

            wol.wake('4c:cc:6a:fb:2d:b0', {address: ip, port:3389}, function (error) {
                if (error) {
                    response.end(error);
                } else {
                    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    // 将HTTP响应的HTML内容写入response:
                    response.end(`<h1>${ip} is waking up.</h1>`);
                }
            });
        }
    });
});

server.listen(31113);
