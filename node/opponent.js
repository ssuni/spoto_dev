const xml2js = require('xml2js');
const moment = require('moment');
const fs = require('fs');
let leagueConfig = fs.readFileSync('league.json');
const analysis = require('./analysis');
const odd = require('./odd');
const schdule = require('./schdule');
const teamInfo = require('./teamInfo');
const player = require('./player');
const cheerio = require('cheerio');
const chalk = require('chalk');
const util = require('util');
const md5 = require('md5');
const timestemp = new Date().getTime();
const today = new Date();
const parser = new xml2js.Parser({
    explicitArray: false
});
const request = require('request');
// const request = require('async-request');
const {Detail_lb} = require('./Detail_lb.js');

const DELAY = 120000;
const BRIDGE = 'ws://localhost:3000/bridgeTest';
const dateFormat = require('dateformat');
const agentkeepalive = require('agentkeepalive');
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
    console.log('===== Opponent 접속 ===== ' + socket.id);

    // var teamList = {
    //     roomid: '/bridgeTest#wbgd5ohjRFMNSNyuAAAE',
    //     home: 6092,
    //     away: 3481,
    //     home_name: 'Universidad de Costa Rica',
    //     away_name: '데포르티보 사프리사',
    //     game_idx: '1828589',
    //     // game_idx: '1721953',
    //     game_date: '2020-06-11'
    // }
    var teamList = {home: 25, away: 28, league_idx: '1766'};
    // var teamList = {home: 48727, away: 11985};
    // var teamList = {home: 4865933, away: 40165}; // 20게임 미만
    // var teamList = {home: 48659, away: 40165}; // 20게임 미만
    // var teamList = {home: 24207, away: 24209};
    // var teamList = {home: 509, away: 4174};
    // var teamList = {home: 449, away: 444};
    // var teamList = {home: 6092, away: 3481};
    // fn.getScheduledMatch(25).then((res) => {
    //     console.log(util.inspect (res, {showHidden: true, depth: null}));
    // })
    // fn.detailedAnalysis(teamList).then((result) => {
    //     // console.log(util.inspect (result, {showHidden: true, depth: null}));
    // });
    // fn.upcomingMatchSchedule(teamList);

    // fn.getOpponentResult(teamList).then((res) => {
    //     console.log(util.inspect(res, {showHidden: true, depth: null}));
    // })

    // async function team(team_idx, division) {
    //     let result
    //     try {
    //         result = await teamInfo.getJson(team_idx,division);
    //     } catch (error) {
    //         console.log(error)
    //     }
    //     return result
    // }
    //
    // Promise.all([team(25)]).then((res)=>{
    //     console.log(res)
    // })

    // odd.parseJs(1720873).then((res)=>{
    //     console.log(res)
    // })

    // var teamDetail = teamInfo.getJson(25);
    var getPlayer = teamInfo.getPlayer(20);
    var getTransfer = teamInfo.getTransfer(20);
    var getPlayerDetail = player.getPlayerDetail(136927);
    // var getPlayerDetail = player.getPlayerDetail(24067);

    Promise.all([ getPlayer, getTransfer]).then((values) => {
        // console.log(values)
        // console.log(values[1])
        // console.log(values[2])
    })


//     fn.getOpponentData(teamList).then((res) => {
//         let game_idx = teamList.game_idx;
//         let home_idx = teamList.home;
//         let away_idx = teamList.away;
//         let home_name = teamList.home_name;
//         let away_name = teamList.away_name;
//         let game_date = teamList.game_date;
//
//         var recentMatches = {};
//         recentMatches['home'] = {};
//         recentMatches['home'][teamList.home] = {};
//         recentMatches['home'][teamList.home].idx = {};
//         recentMatches['home'][teamList.home].list = {};
//
//         recentMatches['away'] = {};
//         recentMatches['away'][teamList.away] = {};
//         recentMatches['away'][teamList.away].idx = {};
//         recentMatches['away'][teamList.away].list = {};
//
//         // let monthlyGrade = {};
//         // monthlyGrade['home'] = {};
//         // monthlyGrade['home'][teamList.home] = {};
//         // monthlyGrade['home'][teamList.home].idx = {};
//         // monthlyGrade['home'][teamList.home].list = {};
//
//         if (res['home'][teamList.home].idx !== null) {
//             recentMatches['home'][teamList.home].idx = res['home'][teamList.home].idx.slice(0, 20);
//             recentMatches['home'][teamList.home].list = res['home'][teamList.home].list.slice(0, 20);
//         }
//         if (res['away'][teamList.away].idx !== null) {
//             recentMatches['away'][teamList.away].idx = res['away'][teamList.away].idx.slice(0, 20);
//             recentMatches['away'][teamList.away].list = res['away'][teamList.away].list.slice(0, 20);
//         }
//         // console.log(util.inspect(monthlyGrade, { showHidden: true, depth: null }));
//
//         if (res['home'][teamList.home].idx !== null && res['away'][teamList.away].idx !== null) {
//             var opponentRecord = new Promise((resolve, reject) => {
//                 fn.getOpponentRecord2(teamList, res).then((res) => {
//                     // return resolve(res)
//                     var idxFirstSecond = [];
//
//                     if (res['home'].list !== null) {
//                         for (var i = 0; i < res['home'].list.length; i++) {
//                             idxFirstSecond.push(res['home'].list[i].game_idx)
//                         }
//
//                         fn.getFirstSecond(idxFirstSecond).then((resFirstSecond) => {
//                             // console.log(resFirstSecond)
//                             res.firstsecond = resFirstSecond;
//                             return resolve(res)
//                         }).catch(error => {
//                             console.log('getFirstSecond ' + error.message)
//                         });
//                     } else {
//                         res.firstsecond = null;
//                         return resolve(res)
//                     }
//                 }).catch(error => {
//                     console.log('getOpponentRecord2 ' + error.message)
//                 });
//             });
//         } else {
//             var obj = {}
//             obj.home = {};
//             obj.away = {};
//             obj.home.list = [];
//             obj.away.list = [];
//
//             var opponentRecord = new Promise((resolve, reject) => {
//                 return resolve(obj)
//             });
//         }
//
//         var formation = new Promise((resolve, reject) => {
//             var homeList = recentMatches.home[home_idx].list;
//             var awwayList = recentMatches.away[away_idx].list
//
//             // var homeList = analysis.formationList(homeList, home_idx);
//             // var awwayList = analysis.formationList(awwayList, away_idx);
//             //
//             // var homedetail = analysis.formationDetail(homeList)
//             // var awaydetail = analysis.formationDetail(awwayList)
//
//             // Promise.all([homedetail, awaydetail]).then((values) => {
//             // console.log(values);
//             // console.log(util.inspect(values, { showHidden: true, depth: null }));
//             // })
//         });
//
//
//         var homeList = res['home'][teamList.home].list;
//         var awayList = res['away'][teamList.away].list;
//
//         // var homeMonth = analysis.monthlyGrade(homeList.slice(0, 50), home_idx, 5);
//         // var awayMonth = analysis.monthlyGrade(awayList.slice(0, 50), away_idx, 5);
//
//         var homeUpcomingMatches = fn.getScheduledMatch(home_idx);
//         var awayUpcomingMatches = fn.getScheduledMatch(away_idx);
//
// //         var leagueDivision = fn.setJsonLeague(teamList.league_idx);
// //         // // var leagueDivision = fn.setJsonLeague(452);
// //         // var leagueDivision = fn.setJsonLeague();
// // console.log(leagueDivision[0][1])
// //         var test = fn.getLeagueImg(leagueDivision)
//
//         Promise.all([opponentRecord]).then((values) => {
//
//             let idxArr = {};
//             let idx = {};
//             idxArr.idxArr = {};
//             idxArr.list = {};
//             idxArr.name = {};
//             let homeTeamIdx = Object.keys(recentMatches.home)[0];
//             let awayTeamIdx = Object.keys(recentMatches.away)[0];
//             let homeImg = recentMatches.homeImg;
//             let awayImg = recentMatches.awayImg;
//
//             idxArr.game_idx = game_idx;
//             idxArr.homeTeamIdx = homeTeamIdx;
//             idxArr.homeImg = homeImg;
//             idxArr.awayTeamIdx = awayTeamIdx;
//             idxArr.awayImg = awayImg;
//             idxArr.game_date = game_date;
//
//             // idxArr.idxArr.homeArr = recentMatches.home[homeTeamIdx].idx;
//             // idxArr.idxArr.awayArr = recentMatches.away[awayTeamIdx].idx;
//             //
//             // idxArr.list.homeArr = recentMatches.home[homeTeamIdx].list;
//             // idxArr.list.awayArr = recentMatches.away[awayTeamIdx].list;
//             //
//             // idxArr.name.home_name = home_name
//             // idxArr.name.away_name = away_name
//
//             idxArr.opponentdata = values[0];
//
//             // analysis.monthlyAnalysis(values[1],home_idx)
//             // analysis.monthlyAnalysis(values[2],away_idx)
//             //
//             // idxArr.monthlyGrade = {'home':values[1],'away':values[2]}
//             // console.log(idxArr.monthlyGrade)
//             // console.log('KeyEvent Req ' + game_idx)
//             // socket.emit('keyEvent', idxArr, room);
//         });
//     })


}).on('reconnect', function () {
    console.log('============= reconnect - socket =============');
}).on('disconnect', function () {
    STATE = false;
    console.log('============= Opponent 종료 ====================');
}).on('opponent', function (teamList, room) {
    fn.getOpponentData(teamList).then((res) => {
        let game_idx = teamList.game_idx;
        let home_idx = teamList.home;
        let away_idx = teamList.away;
        let home_name = teamList.home_name;
        let away_name = teamList.away_name;
        let game_date = teamList.game_date;

        let leagueDivision = fn.setJsonLeague(teamList.league_idx)
        if (leagueDivision.length > 0) {
            var standing = leagueDivision
        } else {
            var standing = null
        }

        let recentMatches = {};
        recentMatches['home'] = {};
        recentMatches['home'][teamList.home] = {};
        recentMatches['home'][teamList.home].idx = {};
        recentMatches['home'][teamList.home].list = {};

        recentMatches['away'] = {};
        recentMatches['away'][teamList.away] = {};
        recentMatches['away'][teamList.away].idx = {};
        recentMatches['away'][teamList.away].list = {};

        if (res['home'][teamList.home].idx !== null) {
            recentMatches['home'][teamList.home].idx = res['home'][teamList.home].idx.slice(0, 20);
            recentMatches['home'][teamList.home].list = res['home'][teamList.home].list.slice(0, 20);
            recentMatches['homeImg'] = res['homeImg'];
            // monthlyGrade['home'][teamList.home].idx = res['home'][teamList.home].idx.slice(0, 50);
            // monthlyGrade['home'][teamList.home].list = res['home'][teamList.home].list.slice(0, 50);
        }
        if (res['away'][teamList.away].idx !== null) {
            recentMatches['away'][teamList.away].idx = res['away'][teamList.away].idx.slice(0, 20);
            recentMatches['away'][teamList.away].list = res['away'][teamList.away].list.slice(0, 20);
            recentMatches['awayImg'] = res['awayImg'];
            // monthlyGrade['away'][teamList.away].idx = res['away'][teamList.away].idx.slice(0, 50);
            // monthlyGrade['away'][teamList.away].list = res['away'][teamList.away].list.slice(0, 50);
        }
        if (res['home'][teamList.home].idx !== null && res['away'][teamList.away].idx !== null) {
            var opponentRecord = new Promise((resolve, reject) => {
                fn.getOpponentRecord2(teamList, res).then((res) => {
                    // return resolve(res)
                    var idxFirstSecond = [];

                    // if (res['home'].list !== null) {
                    if (res['home'].list.length > 0) {
                        for (var i = 0; i < res['home'].list.length; i++) {
                            idxFirstSecond.push(res['home'].list[i].game_idx)
                        }

                        fn.getFirstSecond(idxFirstSecond).then((resFirstSecond) => {
                            // console.log(resFirstSecond)
                            res.firstsecond = {'list': resFirstSecond};
                            return resolve(res)
                        }).catch(error => {
                            console.log('getFirstSecond ' + error.message)
                        });
                    } else {
                        res = null;
                        console.log(res)
                        return resolve(res)
                    }
                }).catch(error => {
                    console.log('getOpponentRecord2 ' + error.message)
                });
            });
        } else {
            var obj = null
            // obj.home = {};
            // obj.away = {};
            // obj.home.list = null;
            // obj.away.list = null;
            var opponentRecord = new Promise((resolve, reject) => {
                return resolve(obj)
            });
        } // if end 상대 전적 Data Function

        // var formation = new Promise((resolve, reject) => {
        //     fn.getFormation(game_idx).then((res) => {
        //         console.log(res)
        //     });
        // });

        var homeList = res['home'][teamList.home].list;
        var awayList = res['away'][teamList.away].list;

        var homeMonth = analysis.monthlyGrade(homeList.slice(0, 50), home_idx, 5);
        var awayMonth = analysis.monthlyGrade(awayList.slice(0, 50), away_idx, 5);

        var homeUpcomingMatches = fn.getScheduledMatch(home_idx);
        var awayUpcomingMatches = fn.getScheduledMatch(away_idx);

        var oddList = odd.parseJs(game_idx)

        Promise.all([opponentRecord, homeMonth, awayMonth, homeUpcomingMatches, awayUpcomingMatches, oddList]).then((values) => {
            let idxArr = {};
            let idx = {};

            idxArr.idxArr = {};
            idxArr.list = {};
            idxArr.name = {};
            let homeTeamIdx = Object.keys(recentMatches.home)[0];
            let awayTeamIdx = Object.keys(recentMatches.away)[0];
            let homeImg = recentMatches.homeImg;
            let awayImg = recentMatches.awayImg;

            idxArr.game_idx = game_idx;
            idxArr.homeTeamIdx = homeTeamIdx;
            idxArr.homeImg = homeImg;
            idxArr.awayTeamIdx = awayTeamIdx;
            idxArr.awayImg = awayImg;
            idxArr.game_date = game_date;

            idxArr.idxArr.homeArr = recentMatches.home[homeTeamIdx].idx;
            idxArr.idxArr.awayArr = recentMatches.away[awayTeamIdx].idx;

            idxArr.list.homeArr = recentMatches.home[homeTeamIdx].list;
            idxArr.list.awayArr = recentMatches.away[awayTeamIdx].list;

            idxArr.name.home_name = home_name
            idxArr.name.away_name = away_name

            idxArr.opponentdata = values[0];

            homeMonth = analysis.monthlyAnalysis(values[1], home_idx)
            awayMonth = analysis.monthlyAnalysis(values[2], away_idx)

            idxArr.monthlyGrade = {'home': homeMonth, 'away': awayMonth}
            idxArr.upcomingMatches = [values[3], values[4]]
            idxArr.division = standing;
            idxArr.odd = values[5];

            // console.log(idxArr.odd)
            // console.log(idxArr)
            console.log('KeyEvent Req ' + game_idx)
            socket.emit('keyEvent', idxArr, room);
        });
    })

}).on('opponentRecord', function (res) {
    console.log('============ opponentRecord ===================');
});

const fn = (function () {
        return {
            getFormation: function (res) {
                return new Promise(function (resolve, reject) {
                    resolve(res);
                })
            },
            //양팀분
            detailedAnalysis: function (res) {
                return new Promise(function (resolve, reject) {
                    let home = res.home;
                    let away = res.away;
                    let count = 1;
                    let teamArr = [home, away];

                    let arr = [];

                    for (var i = 0; i < teamArr.length; i++) {
                        arr.push(
                            new Promise((resolve, reject) => {
                                fn.getSchdule(teamArr[i], count).then((res) => {
                                    fn.getKeyEvent(res[Object.keys(res)[0]].idx).then((res) => {
                                        // fn.getKeyEvent(test).then((res) => {
                                        return resolve(res);
                                    }).catch(error => {
                                        console.log(error.message)
                                    });
                                })
                            })
                        )
                    }

                    Promise.all(arr).then((values) => {
                        console.log(util.inspect(values, {showHidden: true, depth: null}));
                        return values;
                    }).catch(error => {
                        console.log('detailedAnalysis  ' + error.message)
                    });
                });
            },
            setDateDiff: function (teamIdx, res) {  // 경기 휴식일 갭
                let arrIdx = res[teamIdx].idx;
                let arrList = res[teamIdx].list;
                for (var i = 0; i < arrList.length; i++) {
                    if (i < arrList.length - 1) {
                        let gab = moment(arrList[i].date).diff(arrList[i + 1].date, 'days');
                        arrList[i].gab = gab;
                    } else {
                        arrList[i].gab = null;
                    }
                }
                // arrIdx.pop()
                // arrList.pop()

                let obj = {};
                obj[teamIdx] = {'idx': arrIdx, 'list': arrList};

                return obj;
            },
            getOpponentData: function (teamList) {
                return new Promise(function (resolve, reject) {
                    let homeidx = teamList.home;
                    let awayidx = teamList.away;

                    const promiseHome = new Promise((resolve, reject) => {
                        fn.getTeamData(homeidx).then((res) => {

                            if (res[homeidx].idx !== null) {
                                fn.downLoadImg(homeidx, awayidx, res)
                                let obj = fn.setDateDiff(homeidx, res);
                                return resolve(obj);
                            } else {
                                return resolve(res);
                            }
                        }).catch(error => {
                            console.log('getTeamData 오류 ' + error.message)
                        });
                    });
                    const promiseHomeImg = new Promise((resolve, reject) => {
                        fn.getTeamImg(homeidx).then((res) => {
                            // return resolve(res);
                            fn.getTitleImg(res, homeidx)
                            return resolve(md5(homeidx) + '.png');
                        }).catch(error => {
                            console.log(error.message)
                        });
                    });
                    const promiseAway = new Promise((resolve, reject) => {
                        fn.getTeamData(awayidx).then((res) => {

                            if (res[awayidx].idx !== null) {
                                fn.downLoadImg(awayidx, homeidx, res)
                                let obj = fn.setDateDiff(awayidx, res);
                                return resolve(obj);
                            } else {
                                return resolve(res);
                            }

                        }).catch(error => {
                            console.log('getTeamData 오류 ' + error.message)
                        });
                    });
                    const promiseAwayImg = new Promise((resolve, reject) => {
                        fn.getTeamImg(awayidx).then((res) => {
                            fn.getTitleImg(res, awayidx)
                            return resolve(md5(awayidx) + '.png');
                        }).catch(error => {
                            console.log(error.message)
                        });
                    });
                    Promise.all([promiseHome, promiseAway, promiseHomeImg, promiseAwayImg]).then((values) => {
                        let result = {};
                        result.home = values[0];
                        result.away = values[1];
                        result.homeImg = values[2];
                        result.awayImg = values[3];
                        // console.log(result)
                        return resolve(result);
                    }).catch(error => {
                        console.log('getOpponentData Promise ' + error.message)
                    });
                });
            },
            getTeamImg: function (teamIdx) {
                return new Promise(function (resolve, reject) {
                    let url = 'http://info.nowgoal.com/jsdata/teamInfo/teamdetail/tdl' + teamIdx + '_en.js';
                    axios.get(url).then((result) => {
                        // const regex = /teamDetail = (.*?)];/gm;
                        const regex = /images\/(.*?)\',/gm;
                        let m = regex.exec(result.data);

                        if (m !== null) {
                            let strData = m[1].replace(/'/g, '"');
                            // let json = JSON.parse(strData + ']');
                            if (strData) {
                                return resolve('images/' + strData);
                            } else {
                                console.log('images/' + strData)
                                return resolve(null);
                            }
                        } else {
                            return resolve(null);
                        }

                    }).catch(error => {
                        console.log(teamIdx + ' Img axios ' + error.message)
                        return resolve(null);
                    });
                });
            },
            getLeagueImg: function (data) {
                return new Promise(function (resolve, reject) {
                    var download = function (uri, filename, callback) {
                        request.head(uri, function (err, res, body) {
                            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                            return filename;
                        });
                    };
                    for (var i = 0; i < data.length; i++) {
                        var url = "http://info.nowgoal.group/en/" + data[i][1];

                        (function (i) {
                            axios.get(url).then((result) => {
                                var regex = /src='\/jsData\/matchResult\/(.+?)\?/gm;
                                var m = regex.exec(result.data);

                                if (m !== null) {
                                    axios.get('http://info.nowgoal.group/jsData/matchResult/' + m[1]).then((res) => {
                                        if (data[i][2] == 'CupMatch') {
                                            var regex = /arrCup = \[(.+?)\];/gm;
                                        } else {
                                            var regex = /arrLeague = \[(.+?)\];/gm;
                                        }
                                        var json = regex.exec(res.data);
                                        json = '[' + json[1] + ']';
                                        json = JSON.parse(json.replace(/'/gi, '"'));
                                        if (data[i][2] == 'CupMatch') {
                                            var imgUrl = json[8];
                                        } else {
                                            var imgUrl = json[6];
                                        }
                                        var md5Name = md5(data[i][0]) + '.png';
                                        var uploadPath = '../html/public/res/livescore/img/league/' + md5Name;
                                        fs.stat(uploadPath, function (err) {
                                            if (!err) {
                                                return resolve(md5Name);
                                                // console.log(md5Name + ' Team IMG file exists');
                                            } else {
                                                if (imgUrl !== null) {
                                                    let filePath = imgUrl;
                                                    download('http://info.nowgoal.group/Image/' + filePath, uploadPath, function () {
                                                        console.log(uploadPath + '  done');
                                                        return resolve(md5Name);
                                                    });
                                                }
                                            }
                                        });
                                    }).catch(error => {
                                        console.log('League IMG download ' + error.message)
                                        return resolve(null);
                                    });
                                } else {
                                    return resolve(null);
                                }
                            }).catch(error => {
                                console.log('League IMG JS Url ' + error.message)
                                return resolve(null);
                            });
                        }(i));
                    }
                });
            },
            getOpponentResult: function (teamIdx) {

                return new Promise(function (resolve, reject) {
                        let awayIdx = {};
                        awayIdx.home = teamIdx.away;
                        awayIdx.away = teamIdx.home;

                        let result = {};

                        const promiseHome = new Promise((resolve, reject) => {
                            fn.getOpponentRecord(teamIdx).then((res) => {
                                result.home = res;
                                resolve(result);
                            }).catch(error => {
                                console.log('Home Record ' + error.message)
                            });
                        });
                        const promiseAway = new Promise((resolve, reject) => {
                            fn.getOpponentRecord(awayIdx).then((res) => {
                                result.away = res;
                                resolve(result);
                            }).catch(error => {
                                console.log('away Record ' + error.message)
                            });
                        });

                        Promise.all([promiseHome, promiseAway]).then((values) => {
                            let idx = [];

                            // console.log(values[0]['home'].list)

                            if (values[0]['home'].list !== null) {
                                for (var i = 0; i < values[0]['home'].list.length; i++) {
                                    idx.push(values[0]['home'].list[i].game_idx)
                                }
                                fn.getFirstSecond(idx).then((res) => {
                                    values[0].firstsecond = res;
                                    resolve(values[0])
                                }).catch(error => {
                                    console.log('getFirstSecond ' + error.message)
                                });
                            } else {
                                values[0].firstsecond = null;
                                resolve(values[0])
                            }

                        }).catch(error => {
                            console.log('getOpponentResult Promise All ' + error.message)
                        });
                    }
                );
            },
            getOpponentRecord2: function (teamList, res) {
                let awayList = {home: teamList.away, away: teamList.home};
                let count = 10;
                return new Promise(function (resolve, reject) {
                    var homeGameLengh = res.home[teamList['home']].list.length;
                    var homeGameList = res.home[teamList['home']].list;
                    let arr = [];
                    let list = [];
                    for (var i = 0; i < homeGameLengh; i++) {
                        if ((homeGameList[i].home_idx == teamList.home && homeGameList[i].away_idx == teamList.away) || (homeGameList[i].home_idx == teamList.away && homeGameList[i].away_idx == teamList.home)) {
                            delete homeGameList[i].gab;
                            if (list.length < count) {
                                arr.push(
                                    new Promise((resolve, reject) => {
                                        try {
                                            request('http://www.nowgoal.com/detail/' + homeGameList[i].game_idx + '.html', (error, response, body) => {
                                                var detail_lb = new Detail_lb(response, body);
                                                detail_lb.setOriginParse(response, body);
                                                var resData = detail_lb.getOriginParse();
                                                if(resData.tech_statistics == null){
                                                    data = resData.tech_statistics = null;
                                                }else{
                                                    data = resData.tech_statistics
                                                }
                                                return resolve(data);
                                            })
                                        } catch (e) {
                                            console.log(e.message)
                                            return resolve(data = null);
                                        }
                                    })
                                )
                                list.push(homeGameList[i]);
                            }
                        }
                    }
                    Promise.all(arr).then((values) => {
                        for (var z = 0; z < values.length; z++) {
                            //         console.log(list[z])
                            if (teamList.home == list[z].home_idx) {
                                if (Object.keys(values[z]).length > 0) {
                                    Object.assign(list[z], values[z].home);
                                }
                                // list[z].tech = values[z].home;
                            } else {
                                if (Object.keys(values[z]).length > 0) {
                                    Object.assign(list[z], values[z].away);
                                }
                                // list[z].tech = values[z].away;
                            }
                        }
                        let home = fn.setOpponentWDL(teamList, list);
                        let away = fn.setOpponentWDL(awayList, list)

                        let obj = {};
                        obj.home = home;
                        obj.away = away;

                        return resolve(obj)
                    });

                });
            },
            setOpponentWDL: function (teamList, list) {
                let obj = {};
                let w = 0;
                let d = 0;
                let l = 0;
                for (var j = 0; j < list.length; j++) {
                    if (list[j].home_idx == teamList.home) {
                        if (list[j].home_goal > list[j].away_goal) {
                            w = w + 1;
                        } else if (list[j].home_goal == list[j].away_goal) {
                            d = d + 1;
                        } else {
                            l = l + 1;
                        }
                    } else {
                        if (list[j].home_goal < list[j].away_goal) {
                            w = w + 1;
                        } else if (list[j].home_goal == list[j].away_goal) {
                            d = d + 1;
                        } else {
                            l = l + 1;
                        }
                    }
                    if (w > l) {
                        obj.config = 'home'
                    } else if (l > w) {
                        obj.config = 'away'
                    } else if (w == l) {
                        obj.config = 'draw'
                    }
                    obj.home = w + '승 ' + d + '무 ' + l + '패';
                    obj.away = l + '승 ' + d + '무 ' + w + '패';
                }
                obj.list = list;
                // resolve(obj);
                return obj;
            },
            getOpponentRecord: function (teamIdx) {

                return new Promise(function (resolve, reject) {
                    let obj = {};

                    fn.getSchdule(teamIdx.home, 1000).then((res) => {

                        if (res[teamIdx.home].list !== null) {
                            let json = res[teamIdx.home].list;
                            let list = [];
                            if (json.length > 0) {

                                let arr = [];
                                for (var i = 0; i < json.length; i++) {

                                    if ((json[i].home_idx == teamIdx.home && json[i].away_idx == teamIdx.away) || (json[i].home_idx == teamIdx.away && json[i].away_idx == teamIdx.home)) {

                                        arr.push(
                                            new Promise((resolve, reject) => {
                                                request('http://www.nowgoal.com/detail/' + json[i].game_idx + '.html', (error, response, body) => {
                                                    var detail_lb = new Detail_lb(response, body);
                                                    detail_lb.setOriginParse(response, body);
                                                    var resData = detail_lb.getOriginParse();
                                                    data = resData.tech_statistics;
                                                    return resolve(data);
                                                })
                                            })
                                        )
                                        list.push(json[i]);
                                    }
                                }

                                Promise.all(arr).then((values) => {
                                    for (var z = 0; z < values.length; z++) {
                                        //         console.log(list[z])
                                        if (teamIdx.home == list[z].home_idx) {
                                            if (Object.keys(values[z]).length > 0) {
                                                Object.assign(list[z], values[z].home);
                                            }
                                            // list[z].tech = values[z].home;
                                        } else {
                                            if (Object.keys(values[z]).length > 0) {
                                                Object.assign(list[z], values[z].away);
                                            }
                                            // list[z].tech = values[z].away;
                                        }
                                    }

                                    let w = 0;
                                    let d = 0;
                                    let l = 0;
                                    for (var j = 0; j < list.length; j++) {
                                        if (list[j].home_idx == teamIdx.home) {
                                            if (list[j].home_goal > list[j].away_goal) {
                                                w = w + 1;
                                            } else if (list[j].home_goal == list[j].away_goal) {
                                                d = d + 1;
                                            } else {
                                                l = l + 1;
                                            }
                                        } else {
                                            if (list[j].home_goal < list[j].away_goal) {
                                                w = w + 1;
                                            } else if (list[j].home_goal == list[j].away_goal) {
                                                d = d + 1;
                                            } else {
                                                l = l + 1;
                                            }
                                        }
                                        if (w > l) {
                                            obj.config = 'home'
                                        } else if (l > w) {
                                            obj.config = 'away'
                                        } else if (w == l) {
                                            obj.config = 'draw'
                                        }
                                        obj.home = w + '승 ' + d + '무 ' + l + '패';
                                        obj.away = l + '승 ' + d + '무 ' + w + '패';
                                    }
                                    obj.list = list;
                                    resolve(obj);
                                    // list.push(values[1]);
                                })
                            } else {
                                obj.list = null;
                                obj.config = null;
                                obj.home = null;
                                obj.away = null;
                                resolve(obj);
                            }
                        } else {
                            obj.list = null;
                            obj.config = null;
                            obj.home = null;
                            obj.away = null;
                            resolve(obj);
                        }
                    })
                });
            }
            ,
            getFirstSecond: function (gameIdx) {
                return new Promise(function (resolve, reject) {

                    let obj = {};
                    let list = [];

                    let arr = [];

                    for (var c = 0; c < gameIdx.length; c++) {
                        let data = {};

                        let url = 'http://www.nowgoal.com/Ajax.aspx?type=25&id=' + gameIdx[c];
                        // let url = 'http://www.nowgoal.com/detail/' + gameIdx[c] + '.html';
                        data.game_idx = gameIdx[c];
                        arr.push(
                            new Promise((resolve, reject) => {
                                axios({
                                    method: 'get',
                                    url: url,
                                    responseType: 'json',
                                }).then((result, c) => {
                                    var $ = cheerio.load(result.data);
                                    var header = $('.row');
                                    var score = $(header).find('span');

                                    score.each((i, e) => {
                                        if (i == 0) {
                                            if ($(e).text() == null || $(e).text() == "") {
                                                data.firstscore = null;
                                            } else {
                                                data.firstscore = $(e).text();
                                            }
                                        } else {
                                            if ($(e).text() == null || $(e).text() == "") {
                                                data.secondscore = null;
                                            } else {
                                                data.secondscore = $(e).text();
                                            }
                                        }
                                    });   //each
                                    return resolve(data);
                                }).catch(function (error) {
                                    if (error.response) {
                                        // console.log(error.response.data);
                                        console.log('getFirstSecond ' + error.response.status);
                                        // console.log(error.response.headers);
                                    }
                                });
                            }) //promise
                        )
                    }   //for
                    Promise.all(arr).then((values) => {
                        return resolve(values)
                    });
                });
            }
            ,

            getTeamData: function (teamList) {
                return new Promise(function (resolve, reject) {
                    fn.getSchdule(teamList, 1000).then((res) => {
                        return resolve(res);
                    }).catch(error => {
                        console.log(error.message)
                    });
                });
            }
            ,
            getTeam: function (idx) {
                return new Promise(function (resolve, reject) {
                    fn.getSchduleJs(idx).then((res) => {
                        return resolve(res);
                    }).catch(error => {
                        console.log(error.message)
                    });
                });
            }
            ,
            getSchduleJs: function (idx, count = 10) {
                let obj = {};
                let totalCount = count;

                return new Promise(function (resolve, reject) {
                    let url = 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl' + idx + '_en.js?' + timestemp;
                    let team_idx = idx;
                    axios.get(url).then((result) => {
                        const regex = /teamCount = (.*?)];/gm;
                        let m = regex.exec(result.data);
                        let strData = m[1].replace(/'/g, '"');
                        let json = JSON.parse(strData + ']');
                        let count = 0;
                        let arrIdx = [];
                        let list = [];

                        if (json.length > 0) {
                            for (var i = 0; i < json.length; i++) {

                                let ndate = moment(new Date(json[i][3]));

                                if (ndate.isBefore(today)) {
                                    if (count + 1 <= totalCount) {
                                        let arr = fn.dataSetJs(json[i]);
                                        arrIdx.push(json[i][0]);
                                        list.push(arr);
                                        obj[team_idx] = {'idx': arrIdx, 'list': list};
                                    }
                                    count = count + 1;
                                }
                            }
                        } else {
                            obj[team_idx] = {'idx': [], 'list': []};
                        }
                        resolve(obj)

                    }).catch(error => {
                        console.log(error.message)
                    });
                });
            }
            ,
            imgCheck: function (url) {
                fs.stat(url, function (err) {
                    if (!err) {
                        return true;
                    } else {
                        return false;
                    }
                });
            },
            getScheduledMatch: function (idx) {
                return new Promise(function (resolve, reject) {
                    fn.getSchdule(idx, null, 2).then((res) => {
                        if (res[idx].idx) {
                            if (res[idx].idx.length > 0) {
                                var setIdx = res[idx].idx.reverse().slice(0, 3)
                                var setList = res[idx].list.reverse().slice(0, 3)

                                for (var i = 0; i < setIdx.length; i++) {

                                    var home_img = md5(setList[i].home_idx) + '.png';
                                    var away_img = md5(setList[i].away_idx) + '.png';

                                    var homefilePath = '../html/public/res/livescore/img/team/' + home_img;
                                    try {
                                        fs.statSync(homefilePath);
                                        var home_img = home_img;
                                        setList[i].home_img = home_img;
                                    } catch (err) {
                                        if (err.code === 'ENOENT') {
                                            setList[i].home_img = null
                                        }
                                    }

                                    var awayfilePath = '../html/public/res/livescore/img/team/' + away_img;
                                    try {
                                        fs.statSync(awayfilePath);
                                        var away_img = away_img;
                                        setList[i].away_img = away_img;
                                    } catch (err) {
                                        if (err.code === 'ENOENT') {
                                            setList[i].away_img = null
                                        }
                                    }
                                }

                                res[idx].idx = setIdx;
                                res[idx].list = setList;
                                resolve(res)
                            } else {
                                resolve(null)
                            }
                        } else {
                            resolve(null)
                        }
                    });
                })
            },
// type ( 1 : 20경기 스케쥴 , 2 : 예정 경기 스케쥴)
            getSchdule: function (teamList, count = 21, type = 1) {

                let obj = {};
                let totalCount = count;
                let pageNo = 1;
                let list = [];
                return new Promise(function (resolve, reject) {

                    let url = 'http://info.nowgoal.com/ajax/TeamScheAjax?TeamID=' + teamList + '&pageNo=' + pageNo;

                    let team_idx = teamList;

                    axios.get(url).then((result) => {
                        const reginfo = /teamPageInfo = (.*?);/gm;
                        let info = reginfo.exec(result.data);
                        let page = JSON.parse(info[1])[0];
                        const regex = /teamPageData = (.*?)];/gm;
                        let m;
                        while ((m = regex.exec(result.data)) !== null) {
                            let strData = m[1].replace(/'/g, '"');
                            let json = JSON.parse(strData + ']');
                            let count = 0;
                            let arrIdx = [];

                            for (var i = 0; i < json.length; i++) {
                                let ndate = moment(new Date(json[i][3]));
                                let score = json[i][6];

                                if (type == 1) {
                                    if (ndate.isBefore(today)) {
                                        if (score !== '推迟' && score !== "" && score !== '取消') {
                                            if (count + 1 <= totalCount) {
                                                let arr = fn.dataSet(json[i]);

                                                arrIdx.push(json[i][0]);
                                                list.push(arr);
                                                obj[team_idx] = {'idx': arrIdx, 'list': list};
                                            }
                                            count = count + 1;
                                        }
                                    }
                                }

                                if (type == 2) {
                                    if (ndate.isAfter(today)) {
                                        let arr = fn.dataSet(json[i], type);

                                        arrIdx.push(json[i][0]);
                                        list.push(arr);
                                        obj[team_idx] = {'idx': arrIdx, 'list': list};

                                        if (i == count) {
                                            resolve(obj);
                                        }
                                    }
                                }

                            } // for

                            if (Object.keys(obj).length == 0) {
                                appendCount = totalCount;
                                if (page > 1) {
                                    fn.appendList(team_idx, appendCount, page).then((res) => {

                                        resolve(res)
                                    });
                                } else {
                                    obj[team_idx] = {'idx': null, 'list': null};
                                    resolve(obj)
                                }
                            } else {
                                if (obj[team_idx].idx.length < totalCount && page > 1) {
                                    appendCount = totalCount - obj[team_idx].idx.length;

                                    fn.appendList(team_idx, appendCount, page).then((res) => {
                                        for (var z = 0; z < res[team_idx].idx.length; z++) {
                                            obj[teamList].idx.push(res[team_idx].idx[z]);
                                            obj[teamList].list.push(res[team_idx].list[z]);
                                        }
                                        resolve(obj)
                                    }).catch((e) => {
                                        console.log('appendList then ' + e.message)
                                    });
                                } else {
                                    resolve(obj)
                                }
                            }

                        } //while
                    }).catch((e) => {
                        console.log('getSchdule ' + e.message);
                        obj[team_idx] = {'idx': null, 'list': null};
                        resolve(obj)
                    });
                });
            },
            appendList: function (teamList, appendCount, page) {

                return new Promise(function (resolve, reject) {

                    let obj = {};
                    let list = [];
                    let arrIdx = [];
                    let preDate;

                    for (var j = 2; j <= page; j++) {

                        (function (j) {
                            setTimeout(function () {

                                nextPageNo = j;
                                var url = 'http://info.nowgoal.com/ajax/TeamScheAjax?TeamID=' + teamList + '&pageNo=' + nextPageNo;

                                const reginfo = /teamPageInfo = (.*?);/gm;
                                const regex = /teamPageData = (.*?)];/gm;

                                axios.get(url).then((result) => {

                                    var nextpage;

                                    while ((m = regex.exec(result.data)) !== null) {
                                        let strData = m[1].replace(/'/g, '"');
                                        let json = JSON.parse(strData + ']');
                                        let info = reginfo.exec(result.data);

                                        nextpage = JSON.parse(info[1])[1];

                                        // let json = JSON.parse(strData);
                                        for (var k = 0; k < json.length; k++) {
                                            let ndate = moment(new Date(json[k][3]));
                                            let score = json[k][6];
                                            if (ndate.isBefore(today)) {
                                                if (score !== '推迟' && score !== "" && score !== '取消') {
                                                    let arr = fn.dataSet(json[k]);

                                                    if (json.length < appendCount && nextpage == page) {
                                                        arrIdx.push(json[k][0]);
                                                        list.push(arr);
                                                        obj[teamList] = {'idx': arrIdx, 'list': list}
                                                        resolve(obj)
                                                    } else {
                                                        if (arrIdx.length < appendCount) {
                                                            arrIdx.push(json[k][0]);
                                                            list.push(arr);
                                                        } else if (arrIdx.length == appendCount || nextpage == page) {
                                                            obj[teamList] = {'idx': arrIdx, 'list': list}
                                                            resolve(obj)
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }).catch((e) => {
                                    console.log('appendList ' + e.message)
                                    console.log(e)
                                    obj[teamList] = {'idx': null, 'list': null};
                                    resolve(obj)
                                });

                            }, 100 * j);
                        }(j));

                    }
                });
            }
            ,
            getKeyEvent: function (teamList) {
                // console.log(teamList)
                const regex = /team\/(.*?)\.html/m;
                let obj = {};
                let list = [];
                return new Promise(function (resolve, reject) {
                    for (var c = 0; c < teamList.length; c++) {

                        let data = {};
                        let url = 'http://www.nowgoal.com/detail/' + teamList[c] + '.html';

                        axios({
                            method: 'get',
                            url: url,
                            responseType: 'json'
                        }).then((result) => {
                            var $ = cheerio.load(result.data);
                            var table = $('#teamEventDiv_detail tbody tr');
                            var headVs = $('#headVs');
                            var matchDIV = $('#matchDIV');

                            if (headVs.length > 0) {
                                var header = $('#headVs tbody tr');
                                var homeTeamIdx = regex.exec($(header.find("td")[0]).find("span").find("a").attr("href"))[1];
                                var awayTeamIdx = regex.exec($(header.find("td")[2]).find("span").find("a").attr("href"))[1];
                                var homeTeamName = $(header.find("td")[0]).find("span").text().replace(/ |\n/g, '');
                                var awayTeamName = $(header.find("td")[2]).find("span").text().replace(/ |\n/g, '');
                            } else {
                                // console.log(result.data)
                                const regex = /(en\/team\/Summary\/|football\/en\/team\/)(.*?)\.html/gm;
                                // const regex = /Summary\/(.*?)\.html/m;
                                var home = $("#home");
                                var away = $("#guest");
                                // console.log(regex.exec($(home).find("a").attr("href"))[1])
                                var homeTeamIdx = regex.exec($(home).find("a").attr("href"))[2];
                                var homeTeamName = regex.exec($(home).find("a").text());
                                // console.log(homeTeamIdx)
                                var awayTeamIdx = regex.exec($(away).find("a").attr("href"))[2];
                                var awayTeamName = regex.exec($(away).find("a").text());

                            }

                            if (table.length > 0) {
                                table = $('#teamEventDiv_detail tbody tr');
                            } else {
                                const regex = /Summary\/(.*?)\.html/m;
                                table = $('#ad2').next().find('table tbody tr');
                            }

                            data[homeTeamIdx] = [];
                            data[awayTeamIdx] = [];

                            data[homeTeamIdx].teamidx = homeTeamIdx;
                            data[homeTeamIdx].position = 'home';
                            data[homeTeamIdx].name = homeTeamName;
                            data[awayTeamIdx].teamidx = awayTeamIdx;
                            data[awayTeamIdx].position = 'away';
                            data[awayTeamIdx].name = awayTeamName;

                            table.splice(0, 1);

                            let arr = [];

                            // 홈, 원정 골 SET
                            data[homeTeamIdx].fieldgoal = 0;
                            data[homeTeamIdx].penaltygoal = 0;
                            data[homeTeamIdx].yellowcard = 0;
                            data[awayTeamIdx].fieldgoal = 0;
                            data[awayTeamIdx].penaltygoal = 0;
                            data[awayTeamIdx].yellowcard = 0;

                            // 홈, 원정 골 section10 SET
                            data[homeTeamIdx].sectionGoal10 = [];
                            for (var h = 0; h < 9; h++) {
                                data[homeTeamIdx].sectionGoal10[h] = 0;
                            }
                            data[awayTeamIdx].sectionGoal10 = [];
                            for (var a = 0; a < 9; a++) {
                                data[awayTeamIdx].sectionGoal10[a] = 0;
                            }

                            // 홈, 원정 골 section15 SET
                            data[homeTeamIdx].sectionGoal15 = [];
                            for (var h = 0; h < 6; h++) {
                                data[homeTeamIdx].sectionGoal15[h] = 0;
                            }
                            data[awayTeamIdx].sectionGoal15 = [];
                            for (var a = 0; a < 6; a++) {
                                data[awayTeamIdx].sectionGoal15[a] = 0;
                            }

                            table.each((i, e) => {
                                switch (i) {
                                    case 0 :
                                        data[homeTeamIdx].totalgoal = parseInt($($(e).find("td")[0]).text());
                                        data[awayTeamIdx].totalgoal = parseInt($($(e).find("td")[2]).text());
                                        break;
                                    default :
                                        var idx = i - 1;
                                        arr[idx] = [];
                                        arr[idx]['status'] = [];
                                        arr[idx]['time'] = parseInt($($(e).find("td")[2]).text().replace(/'/g, ''));

                                        //홈팀
                                        if ($($(e).find("td")[1]).children().length == 1) {
                                            var status = fn.status($($(e).find("td")[1]).find("img").attr("src"));
                                            if (status == 'goal') {
                                                data[homeTeamIdx].fieldgoal = data[homeTeamIdx].fieldgoal + 1;
                                            }
                                            if (status == 'penaltygoal') {
                                                data[homeTeamIdx].penaltygoal = data[homeTeamIdx].penaltygoal + 1;
                                            }


                                            // 이벤트 선수 이름
                                            if ($($(e).find("td")[0]).children().length > 1) {
                                                arr[idx]['h_player'] = $($(e).find("a")).eq(0).attr("title") + $($(e).find("a")).eq(1).attr("title");
                                            } else {
                                                arr[idx]['h_player'] = $($(e).find("td")[0]).text();
                                            }

                                            console.log(arr[idx]['h_player'])

                                            var k = 1;
                                            for (z = 1; z < 10; z++) {
                                                j = z * 10;
                                                if (k <= arr[idx]['time'] && arr[idx]['time'] <= j) {
                                                    switch (status) {
                                                        case 'goal' :
                                                        case 'penaltygoal' :
                                                            data[homeTeamIdx].sectionGoal10[z - 1] = data[homeTeamIdx].sectionGoal10[z - 1] + 1;
                                                            break;
                                                        case 'substitute':

                                                            break;
                                                    }
                                                }
                                                k = j + 1;
                                            }
                                            // 0~15 , 16~30 , 31~45 , 46~60 , 61~75 , 76~ 90
                                            var k = 1;
                                            for (z = 1; z <= 6; z++) {
                                                j = z * 15;
                                                if (k <= arr[idx]['time'] && arr[idx]['time'] <= j) {
                                                    switch (status) {
                                                        case 'goal' :
                                                        case 'penaltygoal' :
                                                            data[homeTeamIdx].sectionGoal15[z - 1] = data[homeTeamIdx].sectionGoal15[z - 1] + 1;
                                                            break;
                                                    }
                                                }
                                                k = j + 1;
                                            }

                                            if (status == 'yellowcard') {
                                                data[homeTeamIdx].yellowcard = data[homeTeamIdx].yellowcard + 1;
                                            }

                                            arr[idx]['status']['home'] = status;
                                        } else {
                                            arr[idx]['status']['home'] = null;
                                        }

                                        // 원정팀
                                        if ($($(e).find("td")[3]).children().length == 1) {
                                            var status = fn.status($($(e).find("td")[3]).find("img").attr("src"));
                                            if (status == 'goal') {
                                                data[awayTeamIdx].fieldgoal = data[awayTeamIdx].fieldgoal + 1;
                                            }
                                            if (status == 'penaltygoal') {
                                                data[awayTeamIdx].penaltygoal = data[awayTeamIdx].penaltygoal + 1;
                                            }


                                            if (status == 'yellowcard') {
                                                data[awayTeamIdx].yellowcard = data[awayTeamIdx].yellowcard + 1;
                                            }

                                            //이벤트 선수 이름
                                            if ($($(e).find("td")[4]).children().length > 1) {
                                                arr[idx]['a_player'] = $($(e).find("a")).eq(0).attr("title") + $($(e).find("a")).eq(1).attr("title");
                                            } else {
                                                arr[idx]['a_player'] = $($(e).find("td")[4]).text();
                                            }
                                            arr[idx]['status']['away'] = status;
                                        } else {
                                            arr[idx]['status']['away'] = "";
                                        }
                                        break;
                                }
                            });   // each

                            list.push(data);
                            obj.list = list;

                            if (list.length == teamList.length) {
                                return resolve(obj);
                            }
                        }).catch(error => {
                            console.log('getKeyEvent ' + error.message)
                        });
                    } //for
                });
            }
            ,
            opponentTeamList: function (homeidx, awayidx, list) {
                let resList = list;
                let arrlist = [];
                for (let i = 0; i < resList.length; i++) {
                    let arr = {};
                    if (resList[i].home_idx == homeidx) {
                        arr.index = i;
                        arr.teamIdx = resList[i].away_idx;
                        arrlist.push(arr)
                    } else {
                        arr.index = i;
                        arr.teamIdx = resList[i].home_idx;
                        arrlist.push(arr)
                    }
                }

                // console.log(arrlist)
                return arrlist;
            }
            ,
            downLoadImg: function (homeidx, awayidx, list) {
                // return new Promise(function (resolve, reject) {
                var download = function (uri, filename, callback) {
                    request.head(uri, function (err, res, body) {
                        // console.log('content-type:', res.headers['content-type']);
                        // console.log('content-length:', res.headers['content-length']);
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                };

                let arrlist = fn.opponentTeamList(homeidx, awayidx, list[homeidx].list);

                let arr = [];
                for (let i = 0; i < arrlist.length; i++) {
                    arr.push(
                        new Promise((resolve, reject) => {
                            var md5Name = md5(arrlist[i].teamIdx) + '.png';
                            var uploadPath = '../html/public/res/livescore/img/team/' + md5Name;
                            fs.stat(uploadPath, function (err) {
                                if (!err) {
                                    // console.log(md5Name + ' Team IMG file exists');
                                } else {
                                    fn.getTeamImg(arrlist[i].teamIdx).then((res) => {

                                        if (res !== null) {
                                            let filePath = res;

                                            let fileArr = res.split('/');
                                            let fullname = fileArr[1];
                                            let filename = arrlist[i].teamIdx;
                                            let mineType = fullname.split('.')[1];
                                            let md5Name = md5(filename) + '.png';
                                            let uploadPath = '../html/public/res/livescore/img/team/' + md5Name;
                                            download('http://info.nowgoal.group/Image/team/' + filePath, uploadPath, function () {
                                                console.log(uploadPath + '  done');
                                                return resolve(md5Name);
                                            });
                                        }
                                    }).catch(error => {
                                        console.log('getTeamImg 오류 ' + error.message)
                                    });
                                }
                            });
                        })
                    )
                }

                Promise.all(arr).then((values) => {
                    // console.log(values)
                    return homeidx;
                });
                // });
            },
            getTitleImg: function (res, idx) {
                return new Promise(function (resolve, reject) {
                    if (res !== null) {
                        var download = function (uri, filename, callback) {
                            request.head(uri, function (err, res, body) {
                                // console.log('content-type:', res.headers['content-type']);
                                // console.log('content-length:', res.headers['content-length']);
                                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                                return filename;
                            });
                        };
                        var md5Name = md5(idx) + '.png';
                        var uploadPath = '../html/public/res/livescore/img/team/' + md5Name;
                        fs.stat(uploadPath, function (err) {
                            if (!err) {
                                return resolve(md5Name);
                                // console.log(md5Name + ' Team IMG file exists');
                            } else {
                                if (res !== null) {
                                    let filePath = res;
                                    download('http://info.nowgoal.group/Image/team/' + filePath, uploadPath, function () {
                                        console.log(uploadPath + '  done');
                                        return resolve(md5Name);
                                    });
                                }
                            }
                        });
                    }
                });
            },
            setJsonLeague: function (league_idx) {
                let leagueJson = JSON.parse(leagueConfig);
                let leagueJsonLen = Object.keys(leagueJson).length;

                let arr = [];
                for (var i = 0; i < leagueJsonLen; i++) {
                    var continent = Object.keys(leagueJson)[i]
                    var arrContinent = leagueJson[continent]
                    var country = Object.keys(arrContinent)

                    for (var j = 0; j < country.length; j++) {
                        for (var z = 0; z < arrContinent[country[j]].length; z++) {
                            arr.push(arrContinent[country[j]][z])
                        }
                    }
                }

                let data = [];
                for (var i = 0; i < arr.length; i++) {
                    // console.log(idx)
                    var idx = arr[i].league_idx;
                    var url = arr[i].division + '/' + arr[i].league_idx + '.html';
                    var division = arr[i].division;

                    if (league_idx) {
                        if (arr[i].league_idx == league_idx) {
                            data.push([idx, url, division, md5(idx) + '.png'])
                            return data;
                        }
                    } else {
                        data.push([idx, url, division])
                    }
                }
                return data;
            },
            dataSet: function (arr, type = 1) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == 0) {
                        arr[i] = null;
                    }
                }

                var date = moment(arr[3].replace(/\//gi, '-')).format('YYYY-MM-DD hh:mm');
                var date = moment(arr[3].replace(/\//gi, '-')).format('YYYY-MM-DD');

                // let index = ['game_idx', 'league_idx', 'league_color', 'year', 'home_idx', 'away_idx', 'score', 'half_score', 8, 9, 'league_name', 11, 12, 'home_name', 14, 15,
                //     'away_name', 'home_red', 'away_red', 19, 20, 21, 22, 23];
                if (type == 1) {
                    var score = arr[6].split("-");
                    var home_goal = parseInt(score[0]);
                    var away_goal = parseInt(score[1]);
                } else {
                    var score = arr[6];
                    var home_goal = null;
                    var away_goal = null;
                }

                let result = {
                    'game_idx': arr[0],
                    'league_idx': arr[1],
                    'league_color': arr[2],
                    'date': date,
                    'home_idx': arr[4],
                    'away_idx': arr[5],
                    'score': arr[6],
                    'home_goal': home_goal,
                    'away_goal': away_goal,
                    'half_score': arr[7],
                    'league_name': arr[10],
                    'home_name': arr[13],
                    'away_name': arr[16],
                    'home_red': arr[17],
                    'away_red': arr[18],
                };
                return result;
            }
            ,
            dataSetJs: function (arr) {
                // for(var i = 0; i <arr.length; i++){
                //     if(i )
                //         if (arr[i] == 0) {
                //             arr[i] = null;
                //         }
                //
                // }
                let result = {
                    'game_idx': arr[0],
                    'home_idx': arr[1],
                    'away_idx': arr[2],
                    'date': arr[3],

                    'league_idx': arr[4],
                    'league_name': arr[5],
                    'league_color': arr[6],

                    'home_name': arr[7],
                    'away_name': arr[8],

                    'home_goal': arr[9],
                    'away_goal': arr[10],

                    'fouls': arr[11],
                    'yellow_card': arr[12],
                    'red_card': arr[13],

                    'possession': arr[14],
                    'shots': arr[15],
                    'shots_ot': arr[16],

                    'passes': arr[17],
                    'passes_success': arr[18],
                    'dribbles': arr[19],
                    'off_rating': arr[20],

                    'corner': arr[21],
                    'offsides': arr[22],

                    '1': arr[23],
                    '2': arr[24],
                    '3': arr[25],

                    'saves': arr[26],
                    'takles': arr[27],
                    'off_target': arr[28],
                    'blocked': arr[29],
                    'throws': arr[30],
                    'def_rating': arr[31],
                };
                return result;
            }
            ,
            status: function (text) {
                switch (text) {
                    case "/images/bf_img/1.png" :
                        status = 'goal';
                        break;
                    case "/images/bf_img/3.png" :
                        status = 'yellowcard';
                        break;
                    case "/images/bf_img/7.png" :
                        status = 'penaltygoal';
                        break;
                    case "/images/bf_img/8.png" :
                        status = 'owngoal';
                        break;
                    case "/images/bf_img/11.png" :
                        status = 'substitute';
                        break;
                    default:
                        status = "";
                        break;
                }
                return status;
            }
        }
    }
)
();
