const request = require('request');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({
    explicitArray: false
});

const fs = require('fs');
var privateKey = fs.readFileSync('../ssl/star.spoto.com.key', 'utf8');
var certificate = fs.readFileSync('../ssl/star.spoto.com.crt', 'utf8');
var ca = fs.readFileSync('../ssl/star.spoto.com.pem').toString();
var socket_ids = [];
var count = 0;

let server = require('https').createServer(
    {
        key: privateKey, cert: certificate, ca: ca, secure: true,
        agent: false,
        rejectUnauthorized: false
    }
);
let io = require('socket.io')(server);

server.listen(8443, function () {
    console.log('listening on *:8443');
});


io.on('connection', function (socket) {
    console.log('server connect');
    const sessionID = socket.id;
    // console.log(socket)

    socket.emit('toclient', {msg: 'Welcome !'});
    socket.on('test', function (data) {
        console.log(data);
    });
    socket.on('toclient', function (data) {
        // console.log(data);

        // socket.emit('RECEIVE', 'game')
    });

    io.emit('test', {msg: 'test !'});
    socket.emit('news', {hello: 'world'});

    socket.on('event', function (data) {
        var options = {
            encoding: "utf-8",
            method : 'get',
            url : 'http://www.nowgoal.com/gf/data/change_en.xml',
        }
        request(options, function(err, res, html) {
            parser.parseString(html, function(err, result) {
                if(typeof result.c.h !== 'undefined') {
                    const json = JSON.stringify(result.c.h);
                    console.log(json);
                    socket.emit('xml', json);
                }
            });
        });
    });

    socket.on('fromclient', function (data) {

        console.log('Message from client :' + data.msg);

    })
});

function registerUser(socket, nickname) {
    // socket_id와 nickname 테이블을 셋업
    socket.get('nickname', function (err, pre_nick) {
        if (pre_nick != undefined) delete socket_ids[pre_nick];
        socket_ids[nickname] = socket.id
        socket.set('nickname', nickname, function () {
            io.sockets.emit('userlist', {users: Object.keys(socket_ids)});
        });
    });
}


