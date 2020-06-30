const xml2js = require('xml2js');
const util = require('util');
const moment = require('moment');
const cheerio = require('cheerio');
const timestemp = new Date().getTime();
const fs = require('fs');
const odd = require('./odd');
const schdule = require('./schdule');
const parser = new xml2js.Parser({
    explicitArray: false
});
let STATE = false;
var request = require('request');
var oldData = [];
var oldData2 = [];
const DELAY = 12000;
const PARSEDELAY = 60000;
const ODDPARSEDELAY = 120000;
const BRIDGE = 'ws://localhost:3000/bridgeTest';

const URL = {
    change: 'http://www.nowgoal.com/gf/data/change_en.xml',
    keyevent: 'https://spoto.com/livescore/soccer/getKeyEventJson'
}
const dateFormat = require('dateformat');
const agentkeepalive = require('agentkeepalive');
const exec = require('child_process').exec;
const child = require('child_process');
const agent = new agentkeepalive({
    maxSockets: 1,
    keepAliveMsecs: 3000,
    freeSocketTimeout: 3000,
    timeout: 3000,
    freeSocketTimeout: 3000,
    maxFreeSockets: 3000
});
const axios = require("axios").create({
    httpAgent: agent,
    withCredentials: true
});
const socket = require("socket.io-client")(BRIDGE, {
    transports: ["websocket"],
    reconnection: true
}).on('connect', function () {
    STATE = true;
    fn.getData();
    fn.parseStart();
    fn.oddParseStart();
    fn.teamParseStart();
    console.log('사용자 접속');
}).on('reconnect', function () {
    console.log('reconnect - socket');
}).on('disconnect', function () {
    STATE = false;
    console.log('사용자 종료');
});
const fn = (function () {
    return {
        getData: function () {

            if (STATE === false) return false;

            axios
                .get(
                    URL['change']
                )
                .then(function (response) {
                    parser.parseString(response.data, function (err, result) {
                        // if (typeof result.c.h !== 'undefined') {
                        //     // console.log(result.c.h)
                        // }
                        // var result = {
                        //     c: {
                        //         '$': {refresh: '0'},
                        //         h: [
                        //             '1865636^3^1^0^^^1^0^1^1^2020-04-07 08:00:00^2020-04-07 09:30:00^^^^^0^2^1^',
                        //             '1865638^3^0^0^^^1^0^1^0^2020-04-07 08:20:00^2020-04-07 08:20:00^^^^^0^0^0^'
                        //         ]
                        //     }
                        // };
                        var result = {
                            c: {
                                '$': {refresh: '0'},
                                h:
                                    '1865636^-1^1^2^^^1^2^4^3^2020-04-07 08:00:00^2020-04-07 09:30:00^^^^^0^2^1^'
                            }
                        };
                        // var result = {
                        //     c: {
                        //         '$': {refresh: '0'}
                        //     }
                        // };

                        if (typeof result.c.h !== 'undefined') {
                            const json = JSON.stringify(result.c.h);
                            // if (oldData !== json) {
                            try {
                                let data = fn.parserNewData(result.c.h);
                                startArr = [];
                                ftArr = [];
                                eventArr = [];

                                fn.getKeyEvent().then((res) => { //detail key event json
                                    if (data.length !== 1) {
                                        data.forEach(function (v, i) {
                                            switch (data[i]['game_progress']) {
                                                case '-1' :
                                                    ftArr.push(data[i])
                                                    break;
                                                default :
                                                    data[i]['detail'] = res[data[i]['game_idx']]
                                                    eventArr.push(data[i])
                                                    break;
                                            }
                                        })
                                        socket.emit('ft', ftArr);
                                        socket.emit('fx', eventArr);
                                    } else {
                                        switch (data[0]['game_progress']) {
                                            case '-1' :
                                                console.log('ft')
                                                socket.emit('ft', data);
                                                break;
                                            default :
                                                console.log('event')
                                                socket.emit('fx', data);
                                                break;
                                        }
                                    }
                                }).catch((e) => {
                                    console.log(e);
                                });
                            } catch (e) {
                                console.log(e);
                            }
                            oldData = json;
                            // }
                            // else {
                            //     console.log('일치')
                            // }
                        } else {
                            console.log('nodata');
                        }
                    });

                    if (STATE === true) {
                        setTimeout(function () {
                            fn.getData();
                        }, DELAY);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    // exec("pm2 restart fx", function (error, stdout, stderr) {
                    //     console.log('stdout: ' + stdout);
                    //     console.log('stderr: ' + stderr);
                    //     if (error !== null) {
                    //         console.log('exec error: ' + error);
                    //     }
                    // });
                });
        },
        getKeyEvent: function () {
            return new Promise(function (resolve, rej) {
                setTimeout(() => {
                    axios.get(URL['keyevent']).then((result) => {
                        return resolve(result.data);
                    });
                }, 100);
            });
        },
        parserNewData: function (data) {
            let type = typeof data;
            let arrResult = [];
            if (type == 'string') {// 단일이벤트
                let arr = data.split('^');
                let result = fn.eventSet(arr);
                arrResult.push(result);
                return arrResult;
            } else { // 다중이벤트
                for (var i = 0; i < data.length; i++) {
                    let arr = data[i].split('^');
                    let result = fn.eventSet(arr);
                    arrResult.push(result);
                }
                return arrResult;
            }
        },
        eventSet: function (arr) {

            fdate = new Date(arr[10]);
            fdate = moment(fdate.getTime()).add("+9", "h").format("YYYY-MM-DD HH:mm:ss")
            sdate = new Date(arr[11]);
            sdate = moment(sdate.getTime()).add("+9", "h").format("YYYY-MM-DD HH:mm:ss")

            let result = {
                'game_idx': arr[0],
                'game_progress': arr[1],
                'home_goal': arr[2],
                'away_goal': arr[3],
                'half_home_goal': arr[4],
                'half_away_goal': arr[5],
                'home_red': arr[6],
                'away_red': arr[7],
                'home_yellow': arr[8],
                'away_yellow': arr[9],
                'first_start_time': fdate,
                'second_start_time': sdate,
                'home_conner': arr[16],
                'away_conner': arr[17]
            };
            return result;
        },
        parseStart: function () {
            console.log('Parse Heart!! ' + moment(new Date()).format('H:mm'))
            if (STATE === false) return false;
            // '13:02'
            let time1 = '7:21';
            let time2 = '11:35';
            let time3 = '12:00';
            let time4 = '17:39';
            let time5 = '22:00';
            let time6 = '8:07';
            let today = [time1, time2, time3, time4, time5, time6];
            let yesterday = [time1, time2, time3, time4, time5, time6];
            let tommorow = [time1, time2, time3, time4, time5, time6];

            for (var t = 0; t < yesterday.length; t++) {
                if (yesterday[t] == moment(new Date()).format('H:mm')) {
                    console.log('Yesterday Parsing Start!!')
                    socket.emit('yesterday');
                }
            }

            for (var t = 0; t < today.length; t++) {
                if (today[t] == moment(new Date()).format('H:mm')) {
                    console.log('Today Parsing Start!!')
                    socket.emit('today');
                }
            }

            // for (var t = 0; t < tommorow.length; t++) {
            //     if (tommorow[t] == moment(new Date()).format('H:mm')) {
            //         console.log('Tommorow Parsing Start!!')
            //         socket.emit('tommorow');
            //     }
            // }

            if (STATE === true) {
                setTimeout(function () {
                    fn.parseStart();
                }, PARSEDELAY);
            }
        },
        oddParseStart: function () {
            if (STATE === false) return false;
            fs.readFile('../html/writable/uploads/maindata1.json', function (err, data) {
                if (err) throw err;
                var arr = JSON.parse(data);
                var json = arr.A;
                for (var i = 0; i < json.length; i++) {
                    (function (i) {
                        odd.parseJs(json[i].idx).then((res) => {

                            let arrDate = json[i].division_day.split('-');
                            let dirPath = "../html/writable/uploads/game/odd/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2];
                            const isExists = fs.existsSync(dirPath);
                            if (!isExists) {
                                fs.mkdirSync(dirPath, {recursive: true});
                            }
                            let filePath = "../html/writable/uploads/game/odd/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + json[i].idx + ".json";
                            fs.stat(filePath, function (err) {
                                if (err) console.log(err.message);
                                fs.writeFile("../html/writable/uploads/game/odd/" + arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2] + "/" + json[i].idx + ".json", JSON.stringify(res), function (err) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    // console.log(json[i].idx + "  Odd The file was saved!");
                                });

                            });

                        })
                    }(i));
                }
                // let today = moment(new Date()).format('YYYY-MM-DD');
            });
            if (STATE === true) {
                setTimeout(function () {
                    fn.oddParseStart();
                }, ODDPARSEDELAY);
            }
        },
        teamParseStart: function () {
            if (STATE === false) return false;

            var schduleData = schdule.getSchdule(25, 1000, 3).then((res) => {
                return res;
            });

            Promise.all([schduleData]).then((values)=>{
                console.log(values)
                // console.log(util.inspect(values, { showHidden: true, depth: null }));
            })

            if (STATE === true) {
                setTimeout(function () {
                    fn.oddParseStart();
                }, ODDPARSEDELAY);
            }
        }
    };
})();