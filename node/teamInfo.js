const util = require('util');
const moment = require('moment');
const request = require('request');
const schdule = require('./schdule');
const cheerio = require('cheerio');
const agentkeepalive = require('agentkeepalive');
const agent = new agentkeepalive({
    maxSockets: 1,
    keepAliveMsecs: 3000,
    freeSocketTieout: 3000,
    timeout: 3000,
    freeSocketTimeout: 3000,
    maxFreeSockets: 3000
});
const axios = require("axios").create({
    httpAgent: agent,
    withCredentials: true
});

var teamInfo = {};

teamInfo.getJson = function (team_idx) {
    return new Promise(function (resolve, reject) {
        let url = 'http://info.nowgoal.group/jsdata/teamInfo/teamdetail/tdl' + team_idx + '_en.js'
        axios.get(url).then((result) => {
            let obj = {};
            let regexDetail = /var teamDetail = (.+?);/gm;
            let detailJson = regexDetail.exec(result.data)[1]

            detailJson = detailJson.replace(/\[/gi, '');
            detailJson = detailJson.replace(/\]/gi, '');
            detailJson = detailJson.replace(/\\'/gi, ' ');
            detailJson = detailJson.replace(/, /gi, ' ');
            detailJson = detailJson.replace(/'/gi, '"');
            detailJson = detailJson.replace(/([0-9a-zA-Z])(,+?)([0-9a-zA-Z])/gi, '$1$3');
            detailJson = '[' + detailJson + ']';
            detailJson = JSON.parse(detailJson);

            obj.detail = teamInfo.setKey(detailJson, 'detail');

            let regexCoach = /var coach = (.+?);/gm;
            let coachJson = regexCoach.exec(result.data)[1]
            coachJson = coachJson.replace(/'/gi, '"');
            coachJson = JSON.parse(coachJson);
            coachJson.length > 0 ? coachJson = coachJson[0] : null;

            obj.coach = teamInfo.setKey(coachJson, 'coach');

            let regexCountSum = /countSum = (.+?);/gm;
            let countSumJson = regexCountSum.exec(result.data)[1]
            countSumJson = countSumJson.replace(/'/gi, '"');
            countSumJson = JSON.parse(countSumJson);

            for (var i = 0; i < countSumJson.length; i++) {
                countSumJson[i] = teamInfo.setKey(countSumJson[i], 'countSum')
            }

            let regexTeamCount = /teamCount = (.+?);/gm;
            let teamCountJson = regexTeamCount.exec(result.data)[1]
            teamCountJson = teamCountJson.replace(/'/gi, '"');
            teamCountJson = JSON.parse(teamCountJson);

            for (var i = 0; i < teamCountJson.length; i++) {
            // for (var i = 0; i < 2; i++) {
                teamCountJson[i] = teamInfo.setKey(teamCountJson[i], 'teamCount')
                // console.log(teamCountJson[i])
            }



            let regexLineUp = /var lineupDetail=(.+?)];/gm;
            let lineUpJson = regexLineUp.exec(result.data)[1]
            lineUpJson = lineUpJson.replace(/'/gi, '"');
            lineUpJson = lineUpJson.replace('&#173;', ' ');
            lineUpJson = lineUpJson + ']';
            lineUpJson = JSON.parse(lineUpJson);

            for (var i = 0; i < lineUpJson.length; i++) {
                lineUpJson[i] = teamInfo.setKey(lineUpJson[i], 'lineup')
            }
            obj.lineup = lineUpJson;

            let regexCupData = /var cupData = (.+?);/gm;
            let cupDataJson = regexCupData.exec(result.data)[1]
            cupDataJson = cupDataJson.replace(/'/gi, '"');
            cupDataJson = JSON.parse(cupDataJson);

            for (var i = 0; i < cupDataJson.length; i++) {
                cupDataJson[i] = teamInfo.setKey(cupDataJson[i], 'cupdata');
            }
            obj.cupdata = cupDataJson;

            resolve(obj);
        })
    });
}
teamInfo.getPlayerConfig = function (team_idx) {
    return new Promise(function (resolve, reject) {
        let url = 'http://info.nowgoal.group/en/team/playerdata/' + team_idx + '.html';

        axios.get(url).then((result) => {
            let obj = {};
            let regexSeason = /selectSeason = (.+?);/gm;
            let regexSclassID = /sclassID = (.+?);/gm;

            let season = regexSeason.exec(result.data)[1]
            let sclassID = regexSclassID.exec(result.data)[1]

            var $ = cheerio.load(result.data);
            var select = $('#teamSclass > option');

            var league_idx = $(select).attr('value');
            var league_name = $(select).text();

            var cupdata = [{'league_idx': league_idx, 'league_name': league_name, 'season': season.replace(/'/gi, '')}];

            obj.season = season.replace(/'/gi, '');
            obj.sclassID = sclassID;
            obj.cupdata = cupdata;

            resolve(obj)
        }).catch(error => {
            console.log(team_idx + ' teamInfo getPlayerConfig ' + error.message)
            resolve(null);
        });
    });
}
teamInfo.getPlayer = async function (team_idx) {
    let config = await teamInfo.getPlayerConfig(team_idx);
    let detail = await teamInfo.getJson(team_idx);

    var select = config.cupdata.concat(detail.cupdata);

    var arr = {};
    for (var i = 0; i < select.length; i++) {
        arr[select[i].league_idx] = await teamInfo.playerAxio(select[i].league_idx, select[i].season, team_idx);
    }

    var result = {'detail': detail, 'player': arr};

    return result;
}

teamInfo.playerAxio = function (league_idx, season, team_idx) {
    return new Promise(function (resolve, reject) {
        let url = 'http://info.nowgoal.group/team/PlayerDataAjax?SclassID=' + league_idx + '&matchSeason=' + season + '&teamID=' + team_idx + '&flesh=0.6470326736757235'
        axios.get(url).then((result) => {
            var $ = cheerio.load(result.data);
            var tr = $('.tdlink > tbody').find('tr');

            var arrTr = [];
            tr.each((i, e) => {
                arrTr[i] = [];
                var td = $(e).find('td');
                var arrTd = []
                td.each((i, e) => {
                    if (i == 1) {
                        var player_idx = $(e).find('a').attr('href').replace('/en/team/player/', '').replace('.html', '');
                        arrTd.push(player_idx);
                    }
                    arrTd.push($(e).text())
                })
                arrTd.shift();
                arrTd = teamInfo.setKey(arrTd, 'player');
                arrTr[i] = arrTd;
            })
            arrTr.shift();
            resolve(arrTr);

        }).catch(error => {
            console.log(team_idx + ' teamInfo getPlayer Cheerio ' + error.message)
            resolve(null);
        });
    });
}

teamInfo.getTransferConfig = function (team_idx) {
    return new Promise(function (resolve, reject) {
        let url = 'http://info.nowgoal.group/en/team/playerzh/' + team_idx + '.html';

        var arr = [];
        axios.get(url).then((result) => {
            var $ = cheerio.load(result.data);
            var select = $('#teamSclass > option');
            select.each((i, e) => {
                arr.push($(e).attr('value'));
            })
            resolve(arr)
        }).catch(error => {
            console.log(team_idx + ' teamInfo getTransferConfig select year ' + error.message)
            resolve(null);
        });
    });
}

teamInfo.getTransfer = async function (team_idx) {
    let config = await teamInfo.getTransferConfig(team_idx);
    var arr = [];
    if (config !== null) {
        for (var i = 0; i < config.length; i++) {
            arr[i] = {};
            var season = config[i].replace(/'/gi, '');
            var url = 'http://info.nowgoal.group/team/PlayerZhAjax?matchSeason=' + season + '&teamID=' + team_idx + '&flesh=0.4201720925983641';
            arr[i].season = season;
            arr[i].list = await teamInfo.transferAxio(url);
        }
        return {'transfer': arr};
    } else {
        return {'transfer': null};
    }
}

teamInfo.transferAxio = function (url) {
    return new Promise((resolve, reject) => {
        axios.get(url).then((result) => {
            var $ = cheerio.load(result.data);
            var title = $('.main_title');
            var table = $('.tdlink > tbody');

            var arr = [];
            for (var j = 0; j < $(title).length; j++) {
                arr[j] = {};
                if ($(table[j])) {

                    var tr = $(table[j]).find('tr');
                    var arrTr = [];
                    tr.each((i, e) => {
                        arrTr[i] = [];
                        var td = $(e).find('td');
                        var arrTd = []
                        td.each((i, e) => {
                            var hrefPlayer = $(td[1]).find('a').attr('href').replace('/en/team/player/', '')
                            var playerNum = hrefPlayer.replace('.html', '');

                            var hrefTeam = $(td[3]).find('a').attr('href').replace('/en/team/summary/', '')
                            var teamNum = hrefTeam.replace('.html', '');
                            arrTd.push($(e).text())
                            if (i == 1) {
                                arrTd.push(playerNum)
                            }
                            if (i == 3) {
                                arrTd.push(teamNum)
                            }
                        })
                        arrTr[i] = arrTd;
                    })
                    arrTr.shift();
                    var key = $(title[j]).text().toLowerCase().replace(/ /g, '');
                    arr[j][key] = arrTr;
                }
            }
            resolve(arr)
        }).catch(error => {
            console.log(url + ' teamInfo getTransfer Cheerio ' + error.message)
            resolve(null);
        });
    })
}

teamInfo.setKey = function (data, division) {
    var result;
    switch (division) {
        case 'detail':
            result = {
                'team_idx': data[0],
                'team_name': data[1],
                'city': data[7],
                'home_stadium': data[10],
                'capacity': data[11],
                'establishedDate': data[12],
                'website': data[13],
                'address': data[15]
            }
            break;
        case 'coach':
            result = {
                'player_idx': data[0],
                'name': data[4]
            }
            break;
        case 'lineup':
            result = {
                'player_idx': data[0],
                'num': (data[1].replace(/ /g, '') !== '') ? parseInt(data[1].replace(/ /g, '')) : null,
                'name': data[2],
                'birthday': data[5],
                'height': (data[6] !== "") ? parseInt(data[6]) : 0,
                'weigth': (data[7] !== "") ? parseInt(data[7]) : 0,
                'position': data[8],
                'country': data[9],
                'estimatedValue': (data[11] !== '') ? '£' + (data[11] / 100) + ' Million' : '-',
                'contractExpires': data[12],
                'start': parseInt(data[13]),
                'startGoal': parseInt(data[14]),
                'sub': parseInt(data[15]),
                'subGoal': parseInt(data[16]),
                'assists': parseInt(data[17])
            }
            break;
        case 'cupdata':
            result = {
                'league_idx': data[0],
                'league_name': data[3],
                'season': data[4]
            }
            break;
        case 'player':
            result = {
                'player_idx': data[0],
                'name': data[1],
                'county': data[2],
                'goals': parseInt(data[3]),
                'goalsWin': parseInt(data[4]),
                'goalsDraw': parseInt(data[5]),
                'goalsLoss': parseInt(data[6]),
                'yellowCard': parseInt(data[7]),
                'redCard': parseInt(data[8])
            }
            break;
        case 'countSum':
            result = {
                'league_idx': data[0],
                'league_name': data[1],
                'win': parseInt(data[2]),
                'draw': parseInt(data[3]),
                'loss': parseInt(data[4]),
                'winRate': (parseInt(data[2])/(parseInt(data[2])+parseInt(data[3])+parseInt(data[4]))*100).toFixed(2),
                'fouls': parseInt(data[5]),
                'yellowcard': parseInt(data[6]),
                'redcard': parseInt(data[7]),
                'possession': parseInt(data[8]),
                'shot_ot1': parseInt(data[9]),
                'shot_ot2': parseInt(data[10]),
                'pass_success1': parseInt(data[11]),
                'pass_success2': parseInt(data[12]),
                'pass_success3': (parseFloat(data[13])*100).toFixed(2),
                'dribbles' : parseInt(data[14]),
                'rating' : parseFloat(data[24]).toFixed(2),
                'corners' : parseInt(data[15]),
                'offsides' : parseInt(data[16]),
                'heads1' : parseInt(data[17]),
                'heads2' : parseInt(data[18]),
                'saves' : parseInt(data[19]),
                'tackles' : parseInt(data[20]),
                'offtarget' : parseInt(data[21]),
                'blocked' : parseInt(data[22]),
                'throws' : parseInt(data[23]),

            }
            break;
        case 'teamCount':
            result = {
                'league_idx':data[4],
                'league_name':data[5],
                'color':data[6],
                'game_idx': data[0],
                'time': data[3],
                'home_idx': data[1],
                'home_name': data[7],
                'score' : data[9]+'-'+data[10],
                'away_idx': data[2],
                'away_name': data[8],
                'fouls': data[11],
                'yellowcard':data[12],
                'redcard':data[13],
                'possession':data[14],
                'shot_ot1':data[15],
                'shot_ot2':data[16],
                'pass_success1':data[17],
                'pass_success2':data[18],
                'pass_success3':(parseFloat(data[19])*100).toFixed(2),
                'dribbles':data[20],
                'corners':data[21],
                'offsides':data[22],
                'head_success1':data[24],
                'head_success2':data[25],
                'saves':data[26],
                'tackles':data[27],
                'offtarget':data[28],
                'blocked':data[29],
                'throws':data[30],
                'rating':data[31],
            }
            break;

    }
    return result;
}

module.exports = teamInfo;