process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}`);
});
const origins = ['https://spoto.com'];
const util = require('util');
let room = null;
const moment = require('moment');
const today = new Date();
const PORT = 3000;
const fs = require('fs');
const dateFormat = require("dateformat");
const zlib = require('zlib');
const redis = require('socket.io-redis');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    // below are engine.IO options
    transports: ['websocket'],
    pingInterval: 10000,
    pingTimeout: 5000
}).set("authorization", (handshake, next) => {
    if (handshake.headers['host'] == 'localhost:3000') next(null, 1);
    else if (origins.includes(handshake.headers['origin'])) next(null, 1);
    else next(null, 0);
});
io.adapter(redis({
    host: 'localhost',
    port: 6379
}));

var bridgeTest = io
    .of('/bridgeTest')
    .on('connection', (socket) => {
        // console.log('연결! 접속 소켓 ID : ' + socket.id)
        room = socket.id;
        // let rooms = Object.keys(socket.rooms);

        socket.join(room, () => {
            console.log('JOIN  == ' + room);
            let today = moment(new Date()).format('YYYY-MM-DD');
        });

        socket.on('fx', (res) => {
            console.log('FX');
            let d = new Date();
            bridgeTest.to(room).emit('soccerEvent', res);
        });
        socket.on('ft', (res) => {

            bridgeTest.to(room).emit('ftEvent', res);
        });

        socket.on('today', (res) => {
            fs.readFile('../html/writable/uploads/maindata1.json', function (err, data) {
                if (err) throw err;
                var arr = JSON.parse(data);
                var json = arr.today;
                console.log(json)
                let today = moment(new Date()).format('YYYY-MM-DD');
                setInfo(json, 'Works! ', 'today');
            });
        });
        socket.on('yesterday', (res) => {
            let yesterday = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD')
            fs.readFile('../html/writable/uploads/result/' + yesterday + '.json', function (err, data) {
                if (err) throw err;
                var json = JSON.parse(data);
                // yesterday = moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD')
                console.log(json)
                setInfo(json, 'Yesterday Works! ', 'yesterday');

            });
        });
        socket.on('tommorow', (res) => {
            let tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
            fs.readFile('../html/writable/uploads/result/' + tomorrow + '.json', function (err, data) {
                if (err) throw err;
                var json = JSON.parse(data);
                tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
                setInfo(json, 'Tomorrow Works! ', 'tomorrow');
            });
        });
        socket.on('receiveTest', (res, room) => {
            console.log('receiveTest');
            fs.writeFile("../html/writable/uploads/game/" + res.game_idx + ".json", JSON.stringify(res), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log(res.game_idx + " The file was saved!");
            });
            socket.broadcast.emit('test', res, 'test');
        })

        socket.on('verification', (res) => {
            let roomid = res['roomid'];
            let game_date = res['game_date'];
            let arrDate = game_date.split('-');
            // socket.broadcast.emit('opponent', res, roomid);
            fs.readFile('../html/writable/uploads/game/' + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + res.game_idx + '.json', function (err, data) {
                console.log('../html/writable/uploads/game/' + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + res.game_idx + '.json')
                if (err) {
                    if (err.errno == -2) {
                        console.log(err)
                        console.log(res)
                        socket.broadcast.emit('opponent', res, roomid);
                        bridgeTest.to(roomid).emit('verification', null);
                    }
                } else {
                    socket.broadcast.emit('opponent', res, roomid);
                    bridgeTest.to(roomid).emit('verification', 'success');
                }
            });
        })
        socket.on('opponent', (res) => {
            console.log(res)
            let roomid = res['roomid'];
            let game_date = res['game_date'];
            let arrDate = game_date.split('-');
            let oddFilePath = "../html/writable/uploads/game/odd/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + res.game_idx + ".json";

            var oddData;
            try {
                oddData = JSON.parse(fs.readFileSync(oddFilePath, 'utf8'));
            } catch (e) {
                oddData = null;
            }

            fs.readFile('../html/writable/uploads/game/' + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + res.game_idx + '.json', function (err, data) {
                if (err) {
                    if (err.errno == -2) {
                        socket.broadcast.emit('opponent', res, roomid);
                    }
                } else {
                    var json = JSON.parse(data);
                    json.odd = oddData
                    bridgeTest.to(roomid).emit('opponetDataDetail', json);
                }
                // if (err) throw socket.broadcast.emit('opponent', res, roomid);
            });
        });
        socket.on('opponetData', (res) => {
            socket.broadcast.emit('opponetData', res);
            // console.log(util.inspect(res.home, { showHidden: true, depth: null }));
        });
        socket.on('opponetDataDetail', (res, room) => {
            if (res !== 'empty') {
                let game_date = res.game_date;
                let arrDate = game_date.split('-');

                // let dirPath = "../html/writable/uploads/game/"+res.game_date;
                let dirPath = "../html/writable/uploads/game/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2];
                const isExists = fs.existsSync(dirPath);
                if (!isExists) {
                    fs.mkdirSync(dirPath, {recursive: true});
                }
                let filePath = "../html/writable/uploads/game/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + res.game_idx + ".json";

                fs.stat(filePath, function (err) {

                    if (!err) {
                        console.log(res.game_idx + ' file or directory exists');
                        fs.writeFile("../html/writable/uploads/game/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + res.game_idx + ".json", JSON.stringify(res), function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log(res.game_idx + "  opponetDataDetail The file was saved!");
                        });
                    } else if (err.code === 'ENOENT') {
                        fs.writeFile("../html/writable/uploads/game/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + res.game_idx + ".json", JSON.stringify(res), function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log(res.game_idx + "  opponetDataDetail The file was saved!");
                        });
                    }
                });

                console.log('opponetDataDetail   ' + room)
                // console.log(util.inspect(res, { showHidden: true, depth: null }));
                // let filePath = "../html/writable/uploads/game/odd/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + json[i].idx + ".json";
                // fs.readFile('../html/writable/uploads/maindata1.json', function (err, data) {
                //
                // });
                bridgeTest.to(room).emit('opponetDataDetail', res);
            } else {
                bridgeTest.to(room).emit('verification', 'empty');
                // bridgeTest.to(room).emit('opponetDataDetail', 'empty');
            }
        });
        socket.on('keyEvent', (res, roomid) => {
            console.log('Parse emit')
            socket.broadcast.emit('parse', res, roomid);
        });
        socket.on('disconnect', () => {
            console.log('서버 연결종료');
            socket.join(room);
        });

        const setInfo = function (json, message, division) {
            var len = json.length;
            let obj = {};
            let today = moment(new Date()).format('YYYY-MM-DD');
            for (var i = 0; i < len; i++) {
                (function (i) {
                    setTimeout(function () {
                        if (division !== 'today') {
                            var game_idx = json[i].game_idx;
                        } else {
                            var game_idx = json[i].idx;
                        }
                        var home = json[i].home_idx;
                        var home_name = json[i].home_name;
                        var away = json[i].away_idx;
                        var away_name = json[i].away_name;
                        obj.league_idx = json[i].league_idx;
                        obj.game_idx = game_idx;
                        obj.game_date = json[i].division_day;
                        obj.home = home;
                        obj.away = away;
                        obj.home_name = home_name;
                        obj.away_name = away_name;

                        let arrDate = obj.game_date.split('-');
                        let filePath = "../html/writable/uploads/game/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + obj.game_idx + ".json";

                        fs.stat(filePath, function (err, stats) {
                            if (!err) {
                                // console.log('file stat file or directory exists')
                                console.log(division + game_idx + ' emit')
                                socket.broadcast.emit('opponent', obj, division);
                            } else {
                                // console.log(message + game_idx);
                                // console.log(filePath)
                                socket.broadcast.emit('opponent', obj, division);

                            }
                        });
                        if (len == i + 1) {
                            console.log('========== Parse End ==========')
                        }
                    }, 5000 * i);
                }(i));
            }
        }
    });

server.listen(PORT, () => {
    console.log('LISTEN SERVER START - PORT %d', PORT);
});


