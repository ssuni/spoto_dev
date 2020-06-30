const util = require('util');
const moment = require('moment');
const request = require('request');
const {Detail_lb} = require('./Detail_lb.js');
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
const cheerio = require('cheerio');

var analysis = {};

analysis.monthlyGrade = async function (list, idx, count) {

    let arr = [];
    for (var i = 0; i < count; i++) {
        arr[i] = [];
    }

    if (list.length > 0) {

        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < count; j++) {
                let thisDate = moment(new Date());
                if (moment(list[i].date).format('YYYY-MM') == thisDate.add(-j, 'month').format('YYYY-MM')) {

                    var detail = await analysis.detail(list[i].game_idx)

                    if(detail !== null) {
                        if (list[i].home_idx == idx) {
                            Object.assign(list[i], detail.home)
                        } else {
                            Object.assign(list[i], detail.away)
                        }
                        arr[j].push(list[i]);
                    }else{
                        arr[j].push(list[i]);
                    }
                }
            }
        }
        return arr;
    } else {
        return null;
    }
}

analysis.monthlyAnalysis = function (monthlyList, idx) {

    let dateArr = [];
    for (var i = 0; i < 5; i++) {
        let thisDate = moment(new Date());
        dateArr.push(thisDate.add(-i, 'month').format('YYYY-MM'));
    }

    let obj = {};
    obj.division = {}
    obj.total = {}
    obj.home = {}
    obj.away = {}

    let totalGame = [];
    let homeGame = [];
    let awayGame = [];

    let totalGoal = [];
    let homeGoal = [];
    let awayGoal = [];

    let totalLostGoal = [];
    let homeLostGoal = [];
    let awayLostGoal = [];

    let totalShots = [];
    let homeShots = [];
    let awayShots = [];

    let totalShotOnGoal = [];
    let homeShotOnGoal = [];
    let awayShotOnGoal = [];

    let totalPossession = [];
    let homePossession = [];
    let awayPossession = [];

    let totalFreeKick = [];
    let homeFreeKick = [];
    let awayFreeKick = [];

    let totalCornerKick = [];
    let homeCornerKick = [];
    let awayCornerKick = [];

    if (monthlyList !== null) {
        for (var i = 0; i < monthlyList.length; i++) {

            var hcount = 0
                , acount = 0
                , hgoal = 0
                , agoal = 0
                , hLostGoal = 0
                , aLostGoal = 0
                , hshots = 0
                , ashots = 0
                , hshotOnGoal = 0
                , ashotOnGoal = 0
                , hpossession = 0
                , apossession = 0
                , hFreeKick = 0
                , aFreeKick = 0
                , hCornerKick = 0
                , aCornerKick = 0

                , totalGoalAvg = 0
                , homeGoalAvg = 0
                , awayGoalAvg = 0
                , totalLostGoalAvg = 0
                , homeLostGoalAvg = 0
                , awayLostGoalAvg = 0
                , totalShotsAvg = 0
                , homeShotsAvg = 0
                , awayShotsAvg = 0
                , totalShotOnGoalAvg = 0
                , homeShotOnGoalAvg = 0
                , awayShotOnGoalAvg = 0
                , totalPossessionAvg = 0
                , homePossessionAvg = 0
                , awayPossessionAvg = 0
                , totalFreeKickAvg = 0
                , homeFreeKickAvg = 0
                , awayFreeKickAvg = 0
                , totalCornerKickAvg = 0
                , homeCornerKickAvg = 0
                , awayCornerKickAvg = 0;

            if (monthlyList[i].length !== 0) {
                for (var j = 0; j < monthlyList[i].length; j++) {

                    if (monthlyList[i][j].home_idx == idx) {
                        hgoal = hgoal + monthlyList[i][j].home_goal
                        hLostGoal = hLostGoal + monthlyList[i][j].away_goal
                        hcount = hcount + 1;
                        if (monthlyList[i][j].shots) {
                            hshots = hshots + parseInt(monthlyList[i][j].shots);
                        }
                        if (monthlyList[i][j].shots_on_goal) {
                            hshotOnGoal = hshotOnGoal + parseInt(monthlyList[i][j].shots_on_goal);
                        }
                        if (monthlyList[i][j].possession) {
                            hpossession = hpossession + parseInt(monthlyList[i][j].possession);
                        }
                        if (monthlyList[i][j].free_kicks) {
                            hFreeKick = hFreeKick + parseInt(monthlyList[i][j].free_kicks);
                        }
                        if (monthlyList[i][j].corner_kicks) {
                            hCornerKick = hCornerKick + parseInt(monthlyList[i][j].corner_kicks);
                        }
                    } else {
                        agoal = agoal + monthlyList[i][j].away_goal
                        aLostGoal = aLostGoal + monthlyList[i][j].home_goal
                        acount = acount + 1;
                        if (monthlyList[i][j].shots) {
                            ashots = ashots + parseInt(monthlyList[i][j].shots);
                        }
                        if (monthlyList[i][j].shots_on_goal) {
                            ashotOnGoal = ashotOnGoal + parseInt(monthlyList[i][j].shots_on_goal);
                        }
                        if (monthlyList[i][j].possession) {
                            apossession = apossession + parseInt(monthlyList[i][j].possession);
                        }
                        if (monthlyList[i][j].free_kicks) {
                            aFreeKick = aFreeKick + parseInt(monthlyList[i][j].free_kicks);
                        }
                        if (monthlyList[i][j].corner_kicks) {
                            aCornerKick = aCornerKick + parseInt(monthlyList[i][j].corner_kicks);
                        }
                    }
                }

                totalGoalAvg = (hgoal + agoal) / monthlyList[i].length;
                homeGoalAvg = (hcount == 0) ? 0 : (hgoal) / hcount;
                awayGoalAvg = (acount == 0) ? 0 : (agoal) / acount;

                totalLostGoalAvg = (hLostGoal + aLostGoal) / monthlyList[i].length;
                homeLostGoalAvg = (hcount == 0) ? 0 : (hLostGoal) / hcount;
                awayLostGoalAvg = (acount == 0) ? 0 : (aLostGoal) / acount;

                totalShotsAvg = (hshots + ashots) / monthlyList[i].length;
                homeShotsAvg = (hcount == 0) ? 0 : (hshots) / hcount;
                awayShotsAvg = (acount == 0) ? 0 : (ashots) / acount;

                totalShotOnGoalAvg = (hshotOnGoal + ashotOnGoal) / monthlyList[i].length;
                homeShotOnGoalAvg = (hcount == 0) ? 0 : (hshotOnGoal) / hcount;
                awayShotOnGoalAvg = (acount == 0) ? 0 : (ashotOnGoal) / acount;

                totalPossessionAvg = (hpossession + apossession) / monthlyList[i].length;
                homePossessionAvg = (hcount == 0) ? 0 : (hpossession) / hcount;
                awayPossessionAvg = (acount == 0) ? 0 : (apossession) / acount;

                totalFreeKickAvg = (hFreeKick + aFreeKick) / monthlyList[i].length;
                homeFreeKickAvg = (hcount == 0) ? 0 : (hFreeKick) / hcount;
                awayFreeKickAvg = (acount == 0) ? 0 : (aFreeKick) / acount;

                totalCornerKickAvg = (hCornerKick + aCornerKick) / monthlyList[i].length;
                homeCornerKickAvg = (hcount == 0) ? 0 : (hCornerKick) / hcount;
                awayCornerKickAvg = (acount == 0) ? 0 : (aCornerKick) / acount;
            }

            totalGame.push(monthlyList[i].length);
            homeGame.push(hcount);
            awayGame.push(acount);

            totalGoal.push((totalGoalAvg == 0) ? totalGoalAvg : totalGoalAvg.toFixed(2));
            homeGoal.push((homeGoalAvg == 0) ? homeGoalAvg : homeGoalAvg.toFixed(2));
            awayGoal.push((awayGoalAvg == 0) ? awayGoalAvg : awayGoalAvg.toFixed(2));

            totalLostGoal.push((totalLostGoalAvg == 0) ? totalLostGoalAvg : totalLostGoalAvg.toFixed(2));
            homeLostGoal.push((homeLostGoalAvg == 0) ? homeLostGoalAvg : homeLostGoalAvg.toFixed(2));
            awayLostGoal.push((awayLostGoalAvg == 0) ? awayLostGoalAvg : awayLostGoalAvg.toFixed(2));

            totalShots.push((totalShotsAvg == 0) ? totalShotsAvg : totalShotsAvg.toFixed(2))
            homeShots.push((homeShotsAvg == 0) ? homeShotsAvg : homeShotsAvg.toFixed(2));
            awayShots.push((awayShotsAvg == 0) ? awayShotsAvg : awayShotsAvg.toFixed(2));

            totalShotOnGoal.push((totalShotOnGoalAvg == 0) ? totalShotOnGoalAvg : totalShotOnGoalAvg.toFixed(2))
            homeShotOnGoal.push((homeShotOnGoalAvg == 0) ? homeShotOnGoalAvg : homeShotOnGoalAvg.toFixed(2));
            awayShotOnGoal.push((awayShotOnGoalAvg == 0) ? awayShotOnGoalAvg : awayShotOnGoalAvg.toFixed(2));

            totalPossession.push((totalPossessionAvg == 0) ? totalPossessionAvg : totalPossessionAvg.toFixed(2))
            homePossession.push((homePossessionAvg == 0) ? homePossessionAvg : homePossessionAvg.toFixed(2));
            awayPossession.push((awayPossessionAvg == 0) ? awayPossessionAvg : awayPossessionAvg.toFixed(2));

            totalFreeKick.push((totalFreeKickAvg == 0) ? totalFreeKickAvg : totalFreeKickAvg.toFixed(2))
            homeFreeKick.push((homeFreeKickAvg == 0) ? homeFreeKickAvg : homeFreeKickAvg.toFixed(2));
            awayFreeKick.push((awayFreeKickAvg == 0) ? awayFreeKickAvg : awayFreeKickAvg.toFixed(2));

            totalCornerKick.push((totalCornerKickAvg == 0) ? totalCornerKickAvg : totalCornerKickAvg.toFixed(2))
            homeCornerKick.push((homeCornerKickAvg == 0) ? homeCornerKickAvg : homeCornerKickAvg.toFixed(2));
            awayCornerKick.push((awayCornerKickAvg == 0) ? awayCornerKickAvg : awayCornerKickAvg.toFixed(2));
        }

        obj.division = dateArr.reverse();
        obj.total.count = totalGame.reverse();
        obj.total.goal = totalGoal.reverse();
        obj.total.lostGoal = totalLostGoal.reverse();
        obj.total.shots = totalShots.reverse();
        obj.total.shotOnGoal = totalShotOnGoal.reverse();
        obj.total.possession = totalPossession.reverse();
        obj.total.freeKick = totalFreeKick.reverse();
        obj.total.cornerKick = totalCornerKick.reverse();

        obj.home.count = homeGame.reverse();
        obj.home.goal = homeGoal.reverse();
        obj.home.lostGoal = homeLostGoal.reverse();
        obj.home.shots = homeShots.reverse();
        obj.home.shotOnGoal = homeShotOnGoal.reverse();
        obj.home.possession = homePossession.reverse();
        obj.home.freeKick = homeFreeKick.reverse();
        obj.home.cornerKick = homeCornerKick.reverse();

        obj.away.count = awayGame.reverse();
        obj.away.goal = awayGoal.reverse();
        obj.away.lostGoal = awayLostGoal.reverse();
        obj.away.shots = awayShots.reverse();
        obj.away.shotOnGoal = awayShotOnGoal.reverse();
        obj.away.possession = awayPossession.reverse();
        obj.away.freeKick = awayFreeKick.reverse();
        obj.away.cornerKick = awayCornerKick.reverse();

        return obj;
    }
}

analysis.detail = function (game_idx) {
    return new Promise(function (resolve, reject) {
        try {
            request('http://www.nowgoal.com/detail/' + game_idx + '.html', (error, response, body) => {
                var detail_lb = new Detail_lb(response, body);
                detail_lb.setOriginParse(response, body);
                var resData = detail_lb.getOriginParse();
                if(resData.tech_statistics !== null){
                    data = resData.tech_statistics;
                }else{
                    data = null;
                }

                resolve(data);
            })
        } catch (e) {
            console.log('detail_lb request ' + e.message)
            return data = null;
        }
    });
}

analysis.formationList = function (list, idx) {

    let result = [];
    let wdl = '';
    for (var i = 0; i < list.length; i++) {
        if (idx == list[i].home_idx) {
            if (list[i].home_goal == list[i].away_goal) {
                wdl = 'd';
            } else if (list[i].home_goal > list[i].away_goal) {
                wdl = 'w';
            } else {
                wdl = 'l';
            }
            var score = list[i].home_goal;
            var lostPoint = list[i].away_goal;
            arr = [list[i].game_idx, 1, wdl, score, lostPoint]
            result.push(arr)
        } else {
            if (list[i].home_goal == list[i].away_goal) {
                wdl = 'd';
            } else if (list[i].away_goal > list[i].home_goal) {
                wdl = 'w';
            } else {
                wdl = 'l';
            }

            var score = list[i].away_goal;
            var lostPoint = list[i].home_goal;
            arr = [list[i].game_idx, 2, wdl, score, lostPoint]
            result.push(arr)
        }
    }
    return result;
}

analysis.formationDetail = function (list) {
    return new Promise(function (resolve, reject) {
        let arr = [];

        for (var i = 0; i < list.length; i++) {
            let url = 'http://www.nowgoal.com/detail/' + list[i][0] + '.html';
            let game_idx = list[i][0];
            let division = list[i][1];
            let wdl = list[i][2];
            let score = list[i][3];
            let lostPoint = list[i][4];

            arr.push(
                new Promise((resolve, reject) => {
                    axios({
                        method: 'get',
                        url: url,
                        responseType: 'json'
                    }).then((result) => {
                        var res = {};
                        var $ = cheerio.load(result.data);
                        var teamNames = $('.teamNames');
                        var playsone = $('#matchBox > div.plays.one');

                        if (playsone.length == 0) {
                            if (division == 1) {
                                var position = 'home';
                                var formationDiv = $('.teamNames > div.home');
                                var mainDiv = $('#matchBox > div.plays > div.home');
                            } else {
                                var position = 'away';
                                var formationDiv = $('.teamNames > div.guest');
                                var mainDiv = $('#matchBox > div.plays > div.guest');
                            }
                            var formation = formationDiv.text().split(' ')[1];
                            var plays = mainDiv.find('.playBox');

                            res.game_idx = game_idx;
                            res.wdl = wdl;
                            res.position = position;
                            res.formation = formation;
                            res.score = score;
                            res.lostPoint = lostPoint;

                            var arrPlays = []
                            for (var j = 0; j < plays.length; j++) {
                                var play = $(plays[j]).find('.play');
                                arrPlays[j] = [];
                                for (var k = 0; k < play.length; k++) {
                                    var playerIdx = $(play[k]).find('div').first().attr('id').split('_')[1];
                                    var arrName = $(play[k]).find('a').text().split(' ');
                                    var number = arrName[0];
                                    var name = arrName[1] + ' ' + arrName[2];
                                    player = {'playIdx': playerIdx, 'number': number, 'name': name}
                                    arrPlays[j].push(player)
                                }
                            }
                            res.player = arrPlays;
                            return resolve(res);
                        } else {
                            res.game_idx = game_idx;
                            res.wdl = wdl;
                            res.position = null;
                            res.formation = null;
                            res.score = score;
                            res.lostPoint = lostPoint;
                            res.player = null;
                            return resolve(res);
                        }
                    });
                }) // promise
            )
        }
        Promise.all(arr).then((values) => {
            let res = {};
            let obj = {};
            for (var i = 0; i < values.length; i++) {
                if (obj[values[i].formation] == undefined) {
                    obj[values[i].formation] = 1;
                } else {
                    obj[values[i].formation] = obj[values[i].formation] + 1;
                }
            }
            var keysSorted = Object.keys(obj).sort(function (a, b) {
                return obj[b] - obj[a]
            })
            let frequentUse = keysSorted[0];
            res.frequentUse = frequentUse;
            res.list = values
            resolve(res);
            // return values;
        }).catch(error => {
            console.log('formationDetail  ' + error.message)
        });
    });
}

module.exports = analysis;