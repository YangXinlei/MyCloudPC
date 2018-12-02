'use strict';

// 导入http模块:
const http = require('http');
const fs = require('fs');
// npm install nodemailer --save
const nodemailer  = require('nodemailer');

const ipFile = '/root/projects/server/cpc/currentip';
// 创建http server，并传入回调函数:
var server = http.createServer(function (request, response) {
    // 回调函数接收request和response对象,
    // 获得HTTP请求的method和url:

    let ip = getClientIP(request);
    if (!ip) {
        return response.end();
    }
    console.log('got ip:', ip);

    fs.readFile(ipFile, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let prevIp = data.toString();
            console.log('prevIp:', prevIp);
            if (prevIp !== ip) {
                reportDDNS(ip);
		// may replace with a system environment variable

                fs.writeFile(ipFile, ip, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });

    // 将HTTP响应200写入response, 同时设置Content-Type: text/html:
    response.writeHead(200, {'Content-Type': 'text/html'});
    // 将HTTP响应的HTML内容写入response:
    response.end('<h1>Hello world!</h1>');
});

server.listen(31112);

function getClientIP(req) {
    console.log('x-f-f:  ', req.headers['x-forwarded-for']);

    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};


// =============mail===================
let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'QQ', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: '1019158142@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: 'xxx', // replease with pass code
  }
});

let reportDDNS = (ip) => {

    let mailOptions = {
        from: '"Daniel" <1019158142@qq.com>', // sender address
        to: 'yangxinlei007@live.com', // list of receivers
        subject: 'ddns update', // Subject line
        // 发送text或者html格式
        html: `<p>new address: ${ip}</p>` // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
}
