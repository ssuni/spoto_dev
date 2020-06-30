const xml2js = require('xml2js');
const moment = require('moment');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const util = require('util');
const md5 = require('md5');
const {Detail_lb} = require('./Detail_lb.js');

const parser = new xml2js.Parser({     
    explicitArray: false
});

const BRIDGE = 'ws://localhost:3000/bridgeTest';

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
    console.log('Parse 연결!!!');
    // fn.getData();
}).on('parse', function (res,roomid) {
    //console.log(res)
    fn.getData(res,roomid);
}).on('reconnect', function () {
    console.log('reconnect - Parse socket');
}).on('disconnect', function () {
    STATE = false;
    console.log('Parse 종료');
});

const fn = (function () {
    return {
        getData: function (idxArr,roomid) {
            // console.log(idxArr);
            new Detail().detailReq(idxArr).then(function (val) {
                // console.log(val);
                //promise 비동기 작업 끝나고 data return
                //console.log(util.inspect(val, { showHidden: true, depth: null }));
                console.log(roomid);
                if(roomid == 'test'){
                    socket.emit('receiveTest',val,roomid);
                }else{
                    socket.emit('opponetDataDetail',val,roomid);
                }

                // return val;
            });
        }
    }
})();

var idxArr = {
    homeTeamIdx: '33',
    awayTeamIdx: '26',
    idxArr: {
        homeArr: ['1823687', '1721955', '1840994', '1721951', '1721936', '1823605', '1721925', '1838174', '1721921', '1830779', '1721912', '1721902', '1828211', '1721892', '1822075', '1721881', '1721870', '1721862', '1721851', '1721843'],
        awayArr: ['1721960', '1840993', '1837653', '1823604', '1721938', '1721929', '1721921', '1828350', '1830021', '1721908', '1721898', '1721884', '1823890', '1822071', '1721878', '1721868', '1721863', '1721848', '1811722', '1721834']
    }
}
// idxArr = {
//     homeTeamIdx: '33',
//     awayTeamIdx: '26',
//     idxArr: {
//         homeArr : ['1823687', '1721955'],
//         awayArr : ['1721960', '1840993', '1837653']
//     }
// }
// var idxArr = {
//     homeTeamIdx: '2436',
//     awayTeamIdx:'24441',
//     idxArr : {
//         homeArr: [1861159, 1861148, 1865697, 1861144, 1861131, 1861129, 1865695, 1861114, 1861113, 1861100],
//         awayArr: [1685034, 1682022, 1517279, 136900, 1228043, 1110472]
//     }
// }
class DetailPage {
    constructor(){
        this.reqCnt = 0;
        this.reqLen = 0;
        this.scheduleRes = {};
        this.idxArr = {
            homeArr : [],
            awayArr : []
        }

        this.detail_analysis = {
            home : [],
            away : []
        }
    }

    setScheduleParse(teamIdx){

        this.homeIdx = teamIdx.homeIdx;
        this.awayIdx = teamIdx.awayIdx;

        var keyArr = ['game_idx', 'league_idx', 'league_color', 'date', 'home_idx', 'away_idx', 'score', 'half_score', '', '', 'league_name', '','','home_name','','','away_name'];

        return new Promise((resolve, reject) => {
            for(var divTeam in teamIdx){
                this.scheduleRes[teamIdx[divTeam]] = [];
                for(var i = 1; i < 3; i++) {
                    this.scheduleRes[teamIdx[divTeam]][i] = [];
                    request('http://info.nowgoal.com/ajax/TeamScheAjax?TeamID=' + teamIdx[divTeam] + '&pageNo='+i+'&flesh=0.738924370726846', (error, response, body) => {
                        var pageNum = Number(response.request.uri.path.split('&')[1].split('=')[1]) - 1;
                        var teamIdx = Number(response.request.uri.query.split('&')[0].split('=')[1]);
                        if(!body.hasOwnProperty('split')) {

                            body = body.split('var teamPageData = [[')[1];
                            body = body.split(']];')[0];
                            body = body.replace(/\'/g, "");
                            body = body.split('],[');

                            var resArr = [];
                            for (var trIdx in body) {
                                //console.log(trIdx);
                                if (trIdx < 30) {
                                    var val = body[trIdx].split(',');
                                    var resVal = {};
                                    for (var key in val) {
                                        resVal[keyArr[key]] = val[key];
                                        if (keyArr[key] == 'score' && val[key].indexOf('-') != -1) {
                                            var score = val[key].split('-');
                                            resVal.home_goal = score[0];
                                            resVal.away_goal = score[1];
                                        }
                                    }
                                    //console.log(body[trIdx].split(','));
                                }
                                if (resVal.score.indexOf('-') != -1) {
                                    delete resVal[''];
                                    delete resVal[undefined];
                                    resArr.push(resVal);
                                }
                            }
                            this.scheduleRes[teamIdx][pageNum] = resArr;

                        }else {
                            //this.scheduleRes[teamIdx][pageNum] = [[]];
                        }

                        var homeIdx = this.homeIdx;
                        var awayIdx = this.awayIdx;

                        if (this.scheduleRes[homeIdx][0] != undefined && this.scheduleRes[homeIdx][1] != undefined && this.scheduleRes[awayIdx][0] != undefined && this.scheduleRes[awayIdx][1] != undefined) {
                            if (this.scheduleRes[homeIdx][0][0] != undefined && this.scheduleRes[homeIdx][1][0] != undefined && this.scheduleRes[awayIdx][0][0] != undefined && this.scheduleRes[awayIdx][1][0] != undefined) {
                                if (this.scheduleRes[homeIdx][1][0].game_idx != this.scheduleRes[homeIdx][0][0].game_idx ) {
                                    var resHome = this.scheduleRes[homeIdx][0].concat(this.scheduleRes[homeIdx][1]);
                                    resHome = resHome.slice(0, 20);
                                } else {
                                    var resHome = this.scheduleRes[homeIdx][0];
                                    resHome = resHome.slice(0, 20);
                                }
                                if (this.scheduleRes[awayIdx][1][0].game_idx != this.scheduleRes[awayIdx][0][0].game_idx) {
                                    var resAway = this.scheduleRes[awayIdx][0].concat(this.scheduleRes[awayIdx][1]);
                                    resAway = resAway.slice(0, 20);
                                } else {
                                    var resAway = this.scheduleRes[awayIdx][0];
                                    resAway = resAway.slice(0, 20);
                                }

                                var homeIdxArr = [];
                                var awayIdxArr = [];
                                for (var idx in resHome) {
                                    if(resHome[idx].length != 0) {
                                        homeIdxArr.push(resHome[idx].game_idx);
                                    }
                                }
                                for (var idx in resAway) {
                                    if(resAway[idx].length != 0) {
                                        awayIdxArr.push(resAway[idx].game_idx);
                                    }
                                }

                                var res = {
                                    list: {
                                        homeArr: resHome,
                                        awayArr: resAway
                                    },
                                    idxArr: {
                                        homeArr: homeIdxArr,
                                        awayArr: awayIdxArr,
                                    }
                                }

                                resolve(res);
                            }
                        }
                    });
                }
            }
        })
    }

    detailReq(data ,type = 0) {
        this.newDate = new Date();
        console.log('requset start ');
        console.log(this.newDate);
        var idxArr = {
            homeArr: data.idxArr.homeArr != null ? (data.idxArr.homeArr.map(val => Number(val))) : [],
            awayArr: data.idxArr.awayArr != null ? (data.idxArr.awayArr.map(val => Number(val))) : []
        }

        return new Promise((resolve, reject) => {
            this.reqLen = idxArr.homeArr.length + idxArr.awayArr.length;

            if (this.reqLen == 0) {
                resolve('array');
            }
            for (var idxArrObj in idxArr) {
                for (var idx = 0; idx < idxArr[idxArrObj].length; idx++) {
                    console.log(idx);
                    request('http://www.nowgoal.com/detail/' + idxArr[idxArrObj][idx] + '.html', (error, response, body) => {
                        this.reqCnt = this.reqCnt + 1;
                        var header = response.req._header.split('.')[0];
                        this.gameIdx = header.split('/')[2];
                        body = JSON.stringify(body).replace(/\\n| {2,}|\\r/g, '');
                        body = JSON.parse(body);
                        this.$ = cheerio.load(body);
                        //console.log(this.reqCnt);
                        //console.log(this.gameIdx);
                        var detail_lb = new Detail_lb();
                        detail_lb.setOriginParse(response, body);
                        this.basic_analysis = detail_lb.getOriginParse();

                        //console.log(resData);
                        var homeIdxOf = idxArr.homeArr.indexOf(Number(this.gameIdx));
                        var awayIdxOf = idxArr.awayArr.indexOf(Number(this.gameIdx));
                        //console.log(this.basic_analysis.recent_matchs.home[homeIdxOf]);

                        //&& this.basic_analysis.recent_matchs.home[homeIdxOf] === undefined
                        if (homeIdxOf != -1 && this.detail_analysis.home[homeIdxOf] === undefined ) {
                            var matchData = data.list.homeArr[homeIdxOf];
                            detail_lb.setDetailPageOne(data.homeTeamIdx );
                            this.detail_analysis.home[homeIdxOf] = detail_lb.getDetailPageOne();
                        }else if (awayIdxOf != -1  && this.detail_analysis.away[awayIdxOf] === undefined) {
                            var matchData = data.list.awayArr[awayIdxOf];
                            detail_lb.setDetailPageOne(data.awayTeamIdx );
                            this.detail_analysis.away[awayIdxOf] = detail_lb.getDetailPageOne();
                        }

                        if (this.reqLen == this.reqCnt) {
                            var detail_lb_avg = new Detail_lb();
                            detail_lb_avg.setDetailPageAll(this.detail_analysis );
                            var res = getDetailPageOne.getTest();
                            //console.log(this.res.data.home);
                            console.log('requst end');
                            console.log(this.newDate);
                            //console.log(test);
                            resolve(res);
                        }
                    })
                }
            }
        })
    }
}


class Detail {
    constructor() {
        this.reqCnt = 0;
        this.reqLen = 0;
        this.res = {
            data: {
                home : [],
                away : []
            }
        };
        this.basic_analysis = {
            a1 : new Date(),
            a2home : '',
            a3away : '',
            isset : true,
            game_idx : '',
            game_date : '',
            header : {
                home : {},
                away : {}
            },
            power_analysis : {},
            recent_matchs : {
                home : [],
                away : []
            },
            opponent_record : {},
            score_division : {
                home : {
                    total : [],
                    home : [],
                    away : []
                },
                away : {
                    total : [],
                    home : [],
                    away : []
                },
            },
            attack_analysis : {},
            defense_analysis : {},
            tech_arr : {
                home: {},
                away: {}
            },
            detail_arr : {
                page_1 : {
                    home: {},
                    away: {}
                },
                page_2 : {
                    home: {},
                    away: {}
                },
                page_3 : {
                    home: {},
                    away: {}
                },
                page_4 : {
                    home: {},
                    away: {}
                },
                page_5 : {
                    home: {},
                    away: {}
                }
            },
            detail_page_1 : {},
            detail_page_2 : {},
            detail_page_3 : {},
            detail_page_4 : {},
            detail_page_5 : {},
        };

        this.eventName = {
            '1' : 'Goal',
            '2' : 'Red Card',
            '3' : 'Yellow Card',
            '4' : 'Sub in',
            '5' : 'Sub out',
            '7' : 'Penalty scored',
            '8' : 'Own goal',
            '9' : 'Second Yellow Card',
            '11' : 'Sub',
            '12' : 'Assit',
            '13' : 'Penalty missed',
            '14' : 'Penalty saved',
            '15' : 'Shot on post',
            '16' : 'Man of the match',
            '17' : 'Error lead to goal',
            '18' : 'Last man tackle',
            '19' : 'Clearence off the Line',
            '20' : 'Foul lead to penalty',
            '55' : 'Mark',
        }
    }

    detailReq(data ,type = 0) {
        console.log(data.upcomingMatches);
        this.newDate = new Date();
        this.basic_analysis.game_idx = data.game_idx;
        this.basic_analysis.game_date = data.game_date;

        console.log('requset start ');
        console.log(this.newDate);
        console.log(data.game_idx);

        var idxArr ={
            homeArr : Object.keys(data.idxArr.homeArr).length !== 0 ? (data.idxArr.homeArr.map(val => Number(val) )) : [],
            awayArr : Object.keys(data.idxArr.awayArr).length !== 0 ? (data.idxArr.awayArr.map(val => Number(val)) ) : []
        }

        return new Promise((resolve, reject) => {
            this.reqLen = idxArr.homeArr.length + idxArr.awayArr.length;
            //console.log(this.reqLen);
            if (this.reqLen == 0 ){
                console.log('reqLen 0 ');
                // this.basic_analysis.game_idx = data.game_idx;
                // this.basic_analysis.game_date = data.game_date
                // this.basic_analysis.header.home.team_idx = data.homeTeamIdx;
                // this.basic_analysis.header.home.team_name = data.homeTeamName;
                // this.basic_analysis.header.away.team_idx = data.awayTeamIdx;
                // this.basic_analysis.header.away.team_name = data.awayTeamName;
                // this.basic_analysis.isset = null;

                var empty = {
                    game_idx : data.game_idx,
                    game_date : data.game_date,
                    header : {
                        home : {
                            tema_idx : data.homeTeamIdx,
                            team_name : data.name.home_name,
                        },
                        away : {
                            tema_idx : data.awayTeamIdx,
                            team_name : data.name.away_name,
                        }
                    },
                    isset : null
                }
                console.log(empty);
                resolve(empty);
            }
            for(var idxArrObj in idxArr){
                for (var idx = 0; idx < idxArr[idxArrObj].length; idx++) {
                    request('http://www.nowgoal.com/detail/' + idxArr[idxArrObj][idx] + '.html', (error, response, body) => {
                        this.reqCnt = this.reqCnt + 1;

                        if(response === undefined){
                            console.log('req X');
                            console.log(body);
                            console.log(data.game_idx);
                            console.log(error);
                            return ;
                        }
                        var header = response.req._header.split('.')[0];
                        this.gameIdx = header.split('/')[2];
                        body = JSON.stringify(body).replace(/\\n| {2,}|\\r/g, '');
                        body = JSON.parse(body);
                        this.$ = cheerio.load(body);

                        if(type == 0){
                            //var resData = this.tablesConf(getTables);
                            //console.log(resData);
                            var homeIdxOf = idxArr.homeArr.indexOf(Number(this.gameIdx));
                            var awayIdxOf = idxArr.awayArr.indexOf(Number(this.gameIdx));
                            //console.log(this.basic_analysis.recent_matchs.home[homeIdxOf]);
                            if (homeIdxOf != -1 && this.basic_analysis.recent_matchs.home[homeIdxOf] === undefined) {
                                var matchData = data.list.homeArr[homeIdxOf];
                                var detail_lb = new Detail_lb();
                                detail_lb.setOriginParse(response, body, matchData, data.homeTeamIdx, data.name.home_name);
                                detail_lb.setDetailPageEach(data.homeTeamIdx);
                                var resData = detail_lb.getOriginParse();
                                var detailArr = detail_lb.getDetailArrAll();
                                this.basic_analysis.detail_arr.page_1.home[homeIdxOf] = detailArr.pageOne;
                                this.basic_analysis.detail_arr.page_2.home[homeIdxOf] = detailArr.pageTwo;
                                this.basic_analysis.detail_arr.page_3.home[homeIdxOf] = detailArr.pageThree;
                                this.basic_analysis.detail_arr.page_4.home[homeIdxOf] = detailArr.pageFour;
                                this.basic_analysis.detail_arr.page_5.home[homeIdxOf] = detailArr.pageFive;


                                this.res.data.home[homeIdxOf] = resData;
                                if(resData.config.home_team_idx == data.homeTeamIdx){
                                    data.name.home_name_en = resData.config.home_name_en;
                                }else {
                                    data.name.home_name_en = resData.config.away_name_en;
                                }
                                var basicAnalysisHome = this._basicAnalysis(resData.config, matchData, data.homeTeamIdx ,data.homeImg, data.name.home_name, data.name.home_name_en);
                                this.basic_analysis.recent_matchs.home[homeIdxOf] = basicAnalysisHome.recentMatchs;
                                this.basic_analysis.score_division.home.home[homeIdxOf] = basicAnalysisHome.scoreDivision.home;
                                this.basic_analysis.score_division.home.away[homeIdxOf] = basicAnalysisHome.scoreDivision.away;
                                this.basic_analysis.score_division.home.total[homeIdxOf] = basicAnalysisHome.scoreDivision.total;

                                if(Object.keys(this.basic_analysis.header.home).length == 0 || this.basic_analysis.header.home.team_img == '' ){
                                    this.basic_analysis.header.home = basicAnalysisHome.header;
                                }
                                //ko name set


                            }else if (awayIdxOf != -1 && this.basic_analysis.recent_matchs.away[awayIdxOf] === undefined) {
                                var matchData = data.list.awayArr[awayIdxOf];
                                var detail_lb = new Detail_lb();
                                detail_lb.setOriginParse(response, body, matchData, data.awayTeamIdx,data.name.away_name);
                                detail_lb.setDetailPageEach(data.awayTeamIdx );
                                var resData = detail_lb.getOriginParse();
                                var detailArr = detail_lb.getDetailArrAll();
                                this.basic_analysis.detail_arr.page_1.away[awayIdxOf] = detailArr.pageOne;
                                this.basic_analysis.detail_arr.page_2.away[awayIdxOf] = detailArr.pageTwo;
                                this.basic_analysis.detail_arr.page_3.away[awayIdxOf] = detailArr.pageThree;
                                this.basic_analysis.detail_arr.page_4.away[awayIdxOf] = detailArr.pageFour;
                                this.basic_analysis.detail_arr.page_5.away[awayIdxOf] = detailArr.pageFive;

                                this.res.data.away[awayIdxOf] = resData;

                                if(resData.config.home_team_idx == data.awayTeamIdx){
                                    data.name.away_name_en = resData.config.home_name_en;
                                }else {
                                    data.name.away_name_en = resData.config.away_name_en;
                                }
                                var basicAnalysisAway = this._basicAnalysis(resData.config, matchData, data.awayTeamIdx, data.awayImg, data.name.away_name, data.name.away_name_en);
                                this.basic_analysis.recent_matchs.away[awayIdxOf] = basicAnalysisAway.recentMatchs;
                                this.basic_analysis.score_division.away.home[awayIdxOf] = basicAnalysisAway.scoreDivision.home;
                                this.basic_analysis.score_division.away.away[awayIdxOf] = basicAnalysisAway.scoreDivision.away;
                                this.basic_analysis.score_division.away.total[awayIdxOf] = basicAnalysisAway.scoreDivision.total;

                                if(Object.keys(this.basic_analysis.header.away).length == 0 || this.basic_analysis.header.away.team_img == '' ){
                                    this.basic_analysis.header.away = basicAnalysisAway.header;
                                }
                            }


                            if (this.reqLen == this.reqCnt) {
                                this.basic_analysis.header.home.hasOwnProperty('team_img') ? null : this.basic_analysis.header.home.team_img = '';
                                this.basic_analysis.header.home.team_idx = data.homeTeamIdx;
                                this.basic_analysis.header.away.team_idx = data.awayTeamIdx;
                                this.basic_analysis.header.away.hasOwnProperty('team_img') ? null : this.basic_analysis.header.away.team_img = '';
                                var scoreData = this.basic_analysis.score_division ;

                                var promiseArr = [];
                                this.basic_analysis.score_division = {
                                    home: {},
                                    away : {}
                                };

                                for(var divName in this.basic_analysis.recent_matchs){
                                    this.basic_analysis.score_division[divName].game_5 = {};
                                    this.basic_analysis.score_division[divName].game_10 = {};
                                    this.basic_analysis.score_division[divName].game_15 = {};
                                    this.basic_analysis.score_division[divName].game_20 = {};

                                    for(var scoreKey in scoreData[divName]){
                                        this.basic_analysis.score_division[divName].game_5[scoreKey] = scoreData[divName][scoreKey].slice(0,5) ;
                                        this.basic_analysis.score_division[divName].game_10[scoreKey] = scoreData[divName][scoreKey].slice(0,10) ;
                                        this.basic_analysis.score_division[divName].game_15[scoreKey] = scoreData[divName][scoreKey].slice(0,15) ;
                                        this.basic_analysis.score_division[divName].game_20[scoreKey] = scoreData[divName][scoreKey].slice(0,20) ;
                                    }

                                    for(var recentKey in this.basic_analysis.recent_matchs[divName]){
                                        var homeImgMd5 = md5(this.basic_analysis.recent_matchs[divName][recentKey].home_team_idx) + '.png' ;
                                        var awayImgMd5 = md5(this.basic_analysis.recent_matchs[divName][recentKey].away_team_idx) + '.png' ;
                                        promiseArr.push(this._imgFile({type:0 ,'divName' : divName, 'recentKey' : Number(recentKey), 'teamImgMd5' : homeImgMd5, 'teamDiv' : 'home' }));
                                        promiseArr.push(this._imgFile({type:0 , 'divName' : divName, 'recentKey' : Number(recentKey), 'teamImgMd5' : awayImgMd5, 'teamDiv' : 'away'}));
                                    }
                                }
                                var headHomeImgMd5 =  md5(Number(data.homeTeamIdx)) + '.png';
                                var headAwayImgMd5 =  md5(Number(data.awayTeamIdx)) + '.png';

                                promiseArr.push(this._imgFile({type:1, 'teamImgMd5' : headHomeImgMd5, 'teamDiv' : 'home' }));
                                promiseArr.push(this._imgFile({type:1, 'teamImgMd5' : headAwayImgMd5, 'teamDiv' : 'away' }));

                                Promise.all(promiseArr).then((values) => {
                                    var detail_lb_all = new Detail_lb();
                                    detail_lb_all.setDetailPageAll(this.basic_analysis.detail_arr, data.opponentdata);
                                    var detailAll = detail_lb_all.getDetailPageAll();
                                    this.basic_analysis.detail_page_1 = detailAll.detail_page_1;
                                    this.basic_analysis.detail_page_2 = detailAll.detail_page_2;
                                    this.basic_analysis.detail_page_3 = detailAll.detail_page_3;
                                    this.basic_analysis.detail_page_4 = detailAll.detail_page_4;
                                    this.basic_analysis.detail_page_5 = detailAll.detail_page_5;
                                    this.basic_analysis.detail_page_5.p5_1.d1 = data.monthlyGrade;
                                    this.basic_analysis.detail_page_5.p5_6.d1 = data.upcomingMatches;

                                    var fiveAnalysis = this._basicAnalysisTech(this.res.data, data);
                                    this.basic_analysis.attack_analysis = fiveAnalysis.attack;
                                    this.basic_analysis.defense_analysis = fiveAnalysis.defense;
                                    this.basic_analysis.power_analysis = this._powerMatchs(this.res.data, data);
                                    this.basic_analysis.opponent_record = data.opponentdata;
                                    console.log('requst end');

                                    console.log(this.newDate);
                                    console.log(new Date());
                                    this.basic_analysis.a2home =  this.basic_analysis.header.home.team_name;
                                    this.basic_analysis.a3away =  this.basic_analysis.header.away.team_name;
                                    this.basic_analysis.test_data = data;
                                    this.basic_analysis.origin_data = this.res;

                                    //console.log(this.basic_analysis.detail_page_1.p1_1.d1);

                                    resolve(this.basic_analysis);
                                });
                            }
                        }
                        else if(type == 1){
                            var resData = this.tablesConf(getTables);
                            //console.log(resData);
                            var homeIdxOf = idxArr.homeArr.indexOf(Number(this.gameIdx));
                            var awayIdxOf = idxArr.awayArr.indexOf(Number(this.gameIdx));


                            if (homeIdxOf != -1) {
                                this.res.data.home[homeIdxOf] = resData;
                            }
                            if (awayIdxOf != -1) {
                                this.res.data.away[awayIdxOf] = resData;
                            }

                            if (this.reqLen == this.reqCnt) {
                                resolve(this.res);
                            }
                        }
                    })
                }
            }
        });
    }

    _imgFile(objData){
        if(objData.type == 0) {
            //recent img
            return new Promise((resolve, reject) => {
                fs.stat('../html/public/res/livescore/img/team/' + objData.teamImgMd5, (err) => {
                    if (!err) {
                        this.basic_analysis.recent_matchs[objData.divName][objData.recentKey][objData.teamDiv + '_img'] = objData.teamImgMd5
                        resolve();
                    } else if (err.code === 'ENOENT') {
                        //console.log('no isfile err');
                        this.basic_analysis.recent_matchs[objData.divName][objData.recentKey][objData.teamDiv + '_img'] = null;
                        resolve();
                    }
                });
            })
        }else {
            //header img
            return new Promise((resolve, reject) => {
                fs.stat('../html/public/res/livescore/img/team/' + objData.teamImgMd5, (err) => {
                    if (!err) {
                        this.basic_analysis.header[objData.teamDiv].team_img  = objData.teamImgMd5
                        resolve();
                    } else if (err.code === 'ENOENT') {
                        //console.log('type 1');
                        //console.log('no isfile err');
                        this.basic_analysis.header[objData.teamDiv].team_img = null
                        resolve();
                    }
                });
            })
        }
    }

    _req(objData){
        return new Promise((resolve, reject) => {
            request('http://info.nowgoal.com/jsdata/teamInfo/teamdetail/tdl' +objData.teamIdx+ '_en.js', (error, response, body) => {
                var body = body.split('];')[0];
                body = body.split('[')[1];
                var teamImg = body.split(',')[4].replace(/\'/g , '');

                teamImg = teamImg.indexOf('http://info.nowgoal.com/Image/team/') == -1 ? 'http://info.nowgoal.com/Image/team/' + teamImg : teamImg;

                this.basic_analysis.recent_matchs[objData.divName][objData.recentKey][objData.teamDiv+'_img'] = teamImg;

                resolve();
            })
        })
    }
    //테이블 확인, 리
    tablesConf(getTables, type = 0) {
        var table_name = [];
        var goals = undefined;

        if (getTables.length == 1 && getTables[0].children.length != 0) {
            table_name[0] = getTables[0].children[0].children[0].children[0].data;
        } else if (getTables.length == 2 && getTables[0].children.length != 0 &&  getTables[1].children.length != 0) {
            table_name[0] = getTables[0].children[0].children[0].children[0].data;
            table_name[1] = getTables[1].children[0].children[0].children[0].data;
        }

        if(type == 0 ){
            var res = {
                config: {},
                key_event: [],
                tech_statistics: []
            };

            for (var i = 0; i < table_name.length; i++) {
                if (table_name[i] == 'Key Events') {
                    var keyEventTable = getTables[i];
                    res.key_event = this._keyEvent(keyEventTable).main;
                    goals = this._keyEvent(keyEventTable).goals;

                } else if (table_name[i] == 'Tech Statistics') {
                    var techStatTable = getTables[i];
                    res.tech_statistics = this._techStat(techStatTable);
                    //console.log(resTech);
                    //console.log(techStatTable.children[0].children.length);
                }
            }
        }else if ( type == 1){
            var res = {
                config: {},
                key_event: [],
            };

            for (var i = 0; i < table_name.length; i++) {
                if (table_name[i] == 'Key Events') {
                    var keyEventTable = getTables[i];
                    res.key_event = this._keyEvent(keyEventTable).main;
                    goals = this._keyEvent(keyEventTable).goals;

                }
            }
        }
        res.config = this._config(this.$, goals);
        return res;
    }

    _powerMatchs(data, teamIdx){
        var res = {};
        var keyArr = ['goal','shots','shots_on_goal','off_target','blocked','possession','possession_ht','corner_kicks',
            'corner_kicks_ht','free_kicks','attack','dangerous_attack','saves','pass','pass_success','fouls','yellow_cards','red_cards',
            'assists','offsides','heads','head_success','tackles','tackle_success','dribbles','throw_ins','intercept'];

        var keyIsNull = {};
        var divRes = {
            home : {},
            away : {}
        };
        for(var div in data){
            var gameArr = data[div] ;
            //console.log(data[div]);
            var gameArrLen = gameArr.length ;
            var divIdx = div == 'home' ? teamIdx.homeTeamIdx : teamIdx.awayTeamIdx ;

            var gameRes = {};
            for(var i = 0; i < keyArr.length; i++){
                gameRes[keyArr[i]] = [];
            }
            //console.log(gameArrLen);
            //recent 제작
            for(var gameIdx = 0; gameIdx< gameArrLen; gameIdx++) {
                //console.log(gameArr[gameIdx].tech_statistics.home);
                var teamDiv = gameArr[gameIdx].config.team_div;
                var gameIdxCon = gameArr[gameIdx].config.game_idx;
                var divisionDay = gameArr[gameIdx].config.division_day;
                var teamDivMain = teamDiv == 'home' ? gameArr[gameIdx].tech_statistics.home : gameArr[gameIdx].tech_statistics.away;
                var teamDivSub = teamDiv == 'home' ? gameArr[gameIdx].tech_statistics.away : gameArr[gameIdx].tech_statistics.home;
                var teamMainGoal = teamDiv == 'home' ? gameArr[gameIdx].config.home_goal : gameArr[gameIdx].config.away_goal;
                var teamSubGoal = teamDiv == 'home' ? gameArr[gameIdx].config.away_goal : gameArr[gameIdx].config.home_goal;
                var keyNameVer ;

                for (var keyName in teamDivMain){
                    keyNameVer = keyName.replace('(', '_');
                    keyNameVer = keyNameVer.replace(')', '');

                    if(keyArr.includes(keyNameVer) && teamDivMain[keyName] != null){
                        gameRes[keyNameVer].push(teamDivMain[keyName].replace('%', ''));
                    }
                }
                String(teamMainGoal) == '' ? null : gameRes.goal.push(Number(teamMainGoal));
            }

            for(var keyName in gameRes){
                var keySum = 0;
                var keyVal = gameRes[keyName];
                var keyLen = gameRes[keyName].length;

                this.basic_analysis.tech_arr[div][keyName]= gameRes[keyName];
                if( keyLen != 0) {
                    for (var i = 0; i < keyLen; i++) {
                        keySum = Number(keyVal[i]) + Number(keySum);
                    }

                    var keyRes = (Math.round((keySum / keyLen) * 10) / 10).toFixed(1);
                    gameRes[keyName] = keyRes;
                }else {
                    gameRes[keyName] = null;
                }
            }

            //console.log(gameRes);
            if(div == 'home') {
                divRes.home = gameRes;
            }else if(div == 'away') {
                divRes.away = gameRes;
            }
        }

        for(var keyName in divRes.home) {
            if(divRes.home[keyName] != null){
                if(divRes.away[keyName] == null){
                    divRes.away[keyName] = 0;
                }
            }
            if(divRes.away[keyName] != null){
                if(divRes.home[keyName] == null){
                    divRes.home[keyName] = 0;
                }
            }
        }

        return divRes;
    }

    _basicAnalysisTech(data , teamIdx){
        var res = {};
        var avgAttKey = ['corner_kicks','shots','shots_on_goal','free_kicks','possession','goal'];
        var avgDefKey = ['corner_kicks','yellow_cards','shots','shots_on_goal','free_kicks','possession','goal','fouls'];
        for(var div in data){
            var gameArr = data[div] ;
            var gameArrLen = gameArr.length < 5 ? gameArr : 5 ;
            var divIdx = div == 'home' ? teamIdx.homeTeamIdx : teamIdx.awayTeamIdx ;
            var divAttRes = [];
            var divDefRes = [];

            //recent 제작
            for(var gameIdx = 0; gameIdx< gameArrLen; gameIdx++) {
                var teamDiv = gameArr[gameIdx].config.team_div;
                var gameIdxCon = gameArr[gameIdx].config.game_idx;
                var divisionDay = gameArr[gameIdx].config.division_day;
                var teamDivMain = teamDiv == 'home' ? gameArr[gameIdx].tech_statistics.home : gameArr[gameIdx].tech_statistics.away;
                var teamDivSub = teamDiv == 'home' ? gameArr[gameIdx].tech_statistics.away : gameArr[gameIdx].tech_statistics.home;
                var teamMainGoal = teamDiv == 'home' ? gameArr[gameIdx].config.home_goal : gameArr[gameIdx].config.away_goal;
                var teamSubGoal = teamDiv == 'home' ? gameArr[gameIdx].config.away_goal : gameArr[gameIdx].config.home_goal;
                var gmaeAttRes = {};
                var gmaeDefRes = {};

                gmaeAttRes.possession = null;
                gmaeAttRes.corner_kicks = null;
                gmaeAttRes.shots = null;
                gmaeAttRes.shots_on_goal = null;
                gmaeAttRes.free_kicks = null;
                gmaeAttRes.goal = null;

                gmaeDefRes.possession = null;
                gmaeDefRes.corner_kicks = null;
                gmaeDefRes.shots = null;
                gmaeDefRes.shots_on_goal = null;
                gmaeDefRes.free_kicks = null;
                gmaeDefRes.goal = null;
                gmaeDefRes.fouls = null;
                gmaeDefRes.yellow_cards = null;

                for (var keyName in teamDivMain){
                    if(keyName == 'goal' || keyName == 'possession' || keyName == 'shots' || keyName == 'shots_on_goal' || keyName == 'free_kicks' || keyName == 'corner_kicks' ) {
                        if(teamDivMain[keyName] != null){
                            gmaeAttRes[keyName] = teamDivMain[keyName].replace('%', '');
                        }
                    }
                }
                gmaeAttRes.goal = teamMainGoal == '' ? 0 : teamMainGoal ;
                gmaeAttRes.game_idx = gameIdxCon;
                gmaeAttRes.division_day = divisionDay;

                for (var keyName in teamDivSub){
                    if(keyName == 'goal' ||  keyName == 'shots' || keyName == 'shots_on_goal' || keyName == 'free_kicks' || keyName == 'corner_kicks' ){
                        if(teamDivSub[keyName] != null){
                            gmaeDefRes[keyName] =  teamDivSub[keyName].replace('%', '');
                        }
                    }else if (keyName == 'possession' || keyName == 'fouls' || keyName == 'yellow_cards' ){
                        if(teamDivSub[keyName] != null){
                            gmaeDefRes[keyName] =  teamDivMain[keyName].replace('%', '');
                        }
                    }
                }

                gmaeDefRes.goal = teamSubGoal == '' ? 0 : teamSubGoal ;
                gmaeDefRes.game_idx = gameIdxCon;
                gmaeDefRes.division_day = divisionDay;


                //console.log(gmaeAttRes);
                // console.log(gmaeDefRes);


                divAttRes.push(gmaeAttRes);
                divDefRes.push(gmaeDefRes);
            }



            //5경기 평균값
            var res = {
                avgRes : {
                    attack : {
                        home : {},
                        away : {}
                    },
                    defense : {
                        home : {},
                        away : {}
                    },
                }
            };
            var avgAtt = {};
            var avgDef = {};



            for(var recentIdx =0; recentIdx < divAttRes.length; recentIdx++){

                //console.log(divAttRes[recentIdx]);
                for(var keyName in divAttRes[recentIdx]){
                    //공격스탯 배열
                    if(keyName == 'goal' || keyName == 'possession' || keyName == 'shots' || keyName == 'shots_on_goal' || keyName == 'free_kicks' || keyName == 'corner_kicks' ){
                        if(typeof avgAtt[keyName] === 'undefined'){
                            avgAtt[keyName] = [];
                            //console.log(keyName);
                        }

                        if(divAttRes[recentIdx][keyName] !== null){
                            avgAtt[keyName].push(divAttRes[recentIdx][keyName]);
                        }else {
                            divAttRes[recentIdx][keyName] = 0;
                        }
                    }
                    //console.log(keyName);
                }
                for(var keyName in divDefRes[recentIdx]){
                    //수비스탯 배열
                    if(keyName == 'goal' || keyName == 'possession' || keyName == 'shots' || keyName == 'shots_on_goal' || keyName == 'free_kicks' || keyName == 'corner_kicks' || keyName == 'yellow_cards' || keyName == 'fouls'){
                        if(typeof avgDef[keyName] === 'undefined'){
                            avgDef[keyName] = [];
                            //console.log(keyName);
                        }
                        if(divDefRes[recentIdx][keyName] !== null){
                            avgDef[keyName].push(divDefRes[recentIdx][keyName]);
                        }else {
                            divDefRes[recentIdx][keyName] = 0;
                        }
                    }
                    //console.log(keyName);
                }
            }

            for(var keyName of avgAttKey){
                if(avgDef[keyName] !== undefined && avgAtt[keyName].length != 0 ) {
                    var keyLen = avgAtt[keyName].length;
                    var keySum = 0;

                    avgAtt[keyName].map((val) => {
                        keySum = Number(keySum) + Number(val);
                    })
                    var keyRes = (Math.round((keySum / keyLen) * 10) / 10).toFixed(1);
                }else {
                    var keyRes = null;
                }
                avgAtt[keyName] = keyRes;
            }


            for(var keyName of avgDefKey){
                if(avgDef[keyName] !== undefined && avgDef[keyName].length != 0 ) {
                    var keyLen = avgDef[keyName].length;
                    var keySum = 0;

                    avgDef[keyName].map((val) => {
                        keySum = Number(keySum) + Number(val);
                    })
                    var keyRes = (Math.round((keySum / keyLen) * 10) / 10).toFixed(1);
                }else {
                    var keyRes = null;
                }
                avgDef[keyName] = keyRes;
            }
            var revAttRes = [];
            var revDefRes = [];

            for(var i = divAttRes.length; i > 0; i--){
                revAttRes.push(divAttRes[i-1]);
            }
            for(var i = divDefRes.length; i > 0; i--){
                revDefRes.push(divDefRes[i-1]);
            }

            avgAtt.recent = revAttRes ;
            avgDef.recent = revDefRes ;


            if(div == 'home'){
                var attackHome = avgAtt ;
                var defenseHome = avgDef ;
            }else if(div == 'away'){
                var attackAway = avgAtt ;
                var defenseAway = avgDef ;
            }


            //console.log(avgRes.defense.recent);
        }

        for(var keyName in attackHome){
            if(keyName != 'recent') {
                if(attackHome[keyName] == null && attackAway[keyName] != null){
                    attackHome[keyName] = 0;
                }
                if(attackHome[keyName] != null && attackAway[keyName] == null){
                    attackAway[keyName] = 0;
                }
            }
        }

        for(var keyName in defenseHome){
            if(keyName != 'recent') {
                if(defenseHome[keyName] == null && defenseAway[keyName] != null){
                    defenseHome[keyName] = 0;
                }
                if(defenseHome[keyName] != null && defenseAway[keyName] == null){
                    defenseAway[keyName] = 0;
                }
            }
        }



        res =  {
            attack : {
                home: attackHome,
                away: attackAway
            },
            defense : {
                home: defenseHome,
                away: defenseAway
            }
        }

        return res;
    }
    //config null 값 data.list랑 매칭
    _basicAnalysisMatch(config, matchData ,teamIdx,  teamImg, teamName){
        //console.log(config);
        //console.log(config);

        if(config.home_goal !== undefined && config.home_goal !== null && config.home_goal.length == 0){
            config.home_goal = matchData.home_goal != null ? Number(matchData.home_goal) : undefined;
        }

        if(config.away_goal !== undefined && config.away_goal !== null && config.away_goal.length == 0){
            config.away_goal = matchData.away_goal != null ? Number(matchData.away_goal) : undefined;
        }

        if(config.home_name === undefined || config.away_name === undefined){
            config.home_name = matchData.home_name;
            config.away_name = matchData.away_name;
        }

        if(matchData.hasOwnProperty('half_score') && matchData.half_score != ''  && matchData.half_score != null && matchData.half_score.indexOf('-') != -1){
            config.home_goal_half = matchData.half_score.split('-')[0];
            config.away_goal_half = matchData.half_score.split('-')[1];
        }

        if(config.home_team_idx == teamIdx && (config.home_img == ''  || config.home_img == '/images/noPic.jpg') && teamImg != '' && teamImg != null ){
            config.home_img = teamImg.indexOf('http://info.nowgoal.com/Image/team/') == -1 ? 'http://info.nowgoal.com/Image/team/' + teamImg : teamImg;
        }

        if(config.away_team_idx == teamIdx && (config.away_img == ''  || config.away_img == '/images/noPic.jpg') && teamImg != '' && teamImg != null ){
            config.away_img = teamImg.indexOf('http://info.nowgoal.com/Image/team/') == -1 ? 'http://info.nowgoal.com/Image/team/' + teamImg : teamImg;
        }

        if(config.home_team_idx == teamIdx){
            config.home_name = teamName;
            config.home_name_en = matchData.home_name;
        }else {
            config.home_name = matchData.home_name;
            config.home_name_en = matchData.home_name;
        }

        if(config.away_team_idx == teamIdx ){
            config.away_name = teamName;
            config.away_name_en = matchData.home_name;
        }else {
            config.away_name = matchData.away_name;
            config.away_name_en = matchData.away_name;
        }


        config.league_idx = matchData.league_idx;
        config.league_name = matchData.league_name;
        config.home_team_idx = matchData.home_idx;
        config.away_team_idx = matchData.away_idx;

        if(matchData.date !== undefined && matchData.date !== null) {
            config.game_start_time = matchData.date;
            var date = matchData.date.split('-');
            var dateY = date[0].substring(2,4);
            var dateM = date[1];
            var dateD = date[2];
            config.division_day = dateY + '-' + dateM + '-' + dateD;
        }

        return config;
    }

    _basicAnalysis(config, matchData, teamIdx, teamImg, teamName, teamNameEn){

        var res = {
            header : {},
            recentMatchs : {},
            scoreDivision : {
                total : {},
                home : {},
                away : {}
            }
        };

        config = this._basicAnalysisMatch(config, matchData ,teamIdx, teamImg, teamName, teamNameEn);

        res.recentMatchs = config;
        //console.log(res);
        var homeGoal = Number(config.home_goal) ;
        var awayGoal = Number(config.away_goal);

        if(config.home_team_idx == teamIdx){
            //console.log(config.home_goal) ;
            //console.log(config.away_goal) ;
            //console.log(teamIdx);
            res.header.team_name = config.home_name;
            res.header.team_name_en = teamNameEn;
            res.header.team_img = config.home_img;
            res.header.team_idx = config.home_team_idx;

            res.recentMatchs.team_div = 'home';
            if(homeGoal == awayGoal ){
                res.recentMatchs.team_res = 'D';
            }else if (homeGoal > awayGoal ){
                res.recentMatchs.team_res = 'W';
            }else if(homeGoal < awayGoal){
                res.recentMatchs.team_res = 'L';
            }
            res.scoreDivision.home.goal = homeGoal;
            res.scoreDivision.home.diff = homeGoal - awayGoal;
            res.scoreDivision.total.goal = homeGoal;
            res.scoreDivision.total.diff = homeGoal - awayGoal;
            res.scoreDivision.away.goal = null;
            res.scoreDivision.away.diff = null;
            res.scoreDivision.home.league_idx = matchData.league_idx;
            res.scoreDivision.home.league_name = matchData.league_name;
            res.scoreDivision.total.league_idx = matchData.league_idx;
            res.scoreDivision.total.league_name = matchData.league_name;
            res.scoreDivision.away.league_idx = matchData.league_idx;
            res.scoreDivision.away.league_name = matchData.league_name;

        }else if(config.away_team_idx == teamIdx){
            //console.log(config);
            res.header.team_name = config.away_name;
            res.header.team_name_en = teamNameEn;
            res.header.team_img = config.away_img;
            res.header.team_idx = config.away_team_idx;


            res.recentMatchs.team_div = 'away';
            if(homeGoal == awayGoal ){
                res.recentMatchs.team_res = 'D';
            }else if (homeGoal > awayGoal ){
                res.recentMatchs.team_res = 'L';
            }else if(homeGoal < awayGoal){
                res.recentMatchs.team_res = 'W';
            }

            res.scoreDivision.away.goal = awayGoal;
            res.scoreDivision.away.diff = awayGoal - homeGoal;
            res.scoreDivision.total.goal = awayGoal;
            res.scoreDivision.total.diff = awayGoal - homeGoal;
            res.scoreDivision.home.goal = null;
            res.scoreDivision.home.diff = null;
            res.scoreDivision.home.league_idx = matchData.league_idx;
            res.scoreDivision.home.league_name = matchData.league_name;
            res.scoreDivision.total.league_idx = matchData.league_idx;
            res.scoreDivision.total.league_name = matchData.league_name;
            res.scoreDivision.away.league_idx = matchData.league_idx;
            res.scoreDivision.away.league_name = matchData.league_name;
        }

        //console.log(res);
        return res;
    }

    _config($, goals) {
        var res = {
            game_idx: Number(this.gameIdx),
            game_start_time : '',
            division_day: '',
            home_name: '',
            away_name: '',
            home_img: '',
            away_img: '',
            home_goal: '',
            away_goal: '',
            home_forma: '',
            away_forma: '',
            home_team_idx: '',
            away_team_idx: '',
            home_goal_half: '-',
            away_goal_half: '-'
        }
        if ($('.sclassName').length == 2) {
            res.home_name = $('.sclassName')[0].children[0].children[0].data;
            res.away_name = $('.sclassName')[1].children[0].children[0].data;
        } else if ($('.name').length >= 3 && $('.name')[0].children.length != 0 && $('.name')[1].children.length != 0) {
            res.home_name = $('.name')[0].children[0].hasOwnProperty('data') ? $('.name')[0].children[0].data : null;
            res.away_name = $('.name')[1].children[0].hasOwnProperty('data') ? $('.name')[1].children[0].data : null;
        }
        //console.log($('#homeImg > img')[0].attribs.src);
        if ($('#homeImg > img').length == 1) {
            res.home_img = $('#homeImg > img')[0].attribs.src;
            res.away_img = $('#guestImg > img')[0].attribs.src;
        } else if ($('#home > img').length == 1) {
            res.home_img = $('#home > img')[0].attribs.src;
            res.away_img = $('#guest > img')[0].attribs.src;
        }

        if(goals !== undefined){
            res.home_goal = goals.home ;
            res.away_goal = goals.away ;
            res.home_goal_half = goals.halfHome;
            res.away_goal_half = goals.halfAway;
        }

        if($('#matchBox').length == 1){
            res.home_forma = $('#matchBox')[0].children[0].children[0].children[1].data.trim();
            res.away_forma = $('#matchBox')[0].children[0].children[1].children[1].data.trim();
        }

        if(this.$('.row > script').length != 0) {
            var date = (this.$('.row > script')[0].children[0].data.match(/[0-9|\,|^\)]+/))[0] ;
            var formatDate = this._formatDateSet(date);
            res.game_start_time = formatDate.game_start_time;
            res.division_day = formatDate.division_day;
        }else if(this.$('span > script').length != 0){
            //console.log(this.$('span > script')[0].children[0].data.match(/[0-9|\,|^\)]+/)[0]);
            var date = this.$('span > script')[0].children[0].data.match(/[0-9|\,|^\)]+/)[0] ;
            var formatDate = this._formatDateSet(date);
            res.game_start_time = formatDate.game_start_time;
            res.division_day = formatDate.division_day;
        }

        if(this.$('#home').length == 1){
            var homeIdx = this.$('#home')[0].children[1].attribs.href.split('/')[6];
            var awayIdx = this.$('#guest')[0].children[1].attribs.href.split('/')[6];

            res.home_team_idx = homeIdx !== undefined ? homeIdx.split('.')[0] : null;
            res.away_team_idx = awayIdx !== undefined ? awayIdx.split('.')[0] : null;
        }else if(this.$('#headVs').length == 1){
            var homeIdx = this.$('#headVs a')[0].attribs.href.split('/')[6];
            var awayIdx = this.$('#headVs a')[1].attribs.href.split('/')[6];
            res.home_team_idx = homeIdx.split('.')[0];
            res.away_team_idx = awayIdx.split('.')[0];
        }

        if (res.home_img.trim() == '/images/noPic.jpg' || res.home_img.trim() ==  'http://info.win007.com/Image/team/Images/nopic.gif') {
            res.home_img = '';
        }

        if (res.away_img.trim() == '/images/noPic.jpg' || res.away_img.trim() ==  'http://info.win007.com/Image/team/Images/nopic.gif' ) {
            res.away_img = '';
        }
        return res;
    }

    _formatDateSet(date) {
        var res={};
        var date = date.split(',');
        var getYear = date[0];
        var getMonth = date[1];
        var getDay = date[2];
        var getHours = date[3] ;
        var getMinutes = date[4];
        var getSeconds = date[5];

        date = new Date(getYear, getMonth, getDay, getHours , getMinutes, getSeconds).getTime() ;
        date = new Date(date  + 32400000 );
        getMonth = this._formatDateLength(String(date.getMonth()+1)) ;

        var division_day = date.getFullYear().toString() +'-' + this._formatDateLength(String(date.getMonth()+1)) + '-' + this._formatDateLength(date.getDate().toString());
        var game_start_time = division_day + ' ' +  this._formatDateLength(date.getHours().toString()) +':' + this._formatDateLength(date.getMinutes().toString());
        res.division_day = division_day.substr(2,8);
        res.game_start_time = game_start_time;

        return res;
    }

    _formatDateLength(date){
        if(date.length == 1){
            date = '0' + date;
        }
        return date;
    }

    _keyEvent(keyEventTable) {
        var table_tr = keyEventTable.children;
        var res = {
            goals : {
                home : '',
                away : '',
                halfHome : 0,
                halfAway : 0,
            },
            main : []
        };
        for (var tr_idx = 0; tr_idx < table_tr.length; tr_idx++) {
            var res_tr = {};
            if(tr_idx == 1){
                res.goals.home = table_tr[tr_idx].children[0].children[0].children[0] !== undefined ? table_tr[tr_idx].children[0].children[0].children[0].data : '' ;
                res.goals.away = table_tr[tr_idx].children[2].children[0].children[0] !== undefined ? table_tr[tr_idx].children[2].children[0].children[0].data : '' ;
            }
            if (table_tr[tr_idx].children[0].name == 'td' && table_tr[tr_idx].children.length > 3) {
                var table_td = table_tr[tr_idx].children;
                //플레이 이름이 없을때
                if (table_td[0].children.length == 0) {
                    var testname = undefined;
                    //플레이어 이름은 있지만 a태그 없을때
                } else if ((table_td[0].children.length == 1 || table_td[0].children.length == 2) && table_td[0].children[0].type == 'text' && !table_td[0].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[0].children[0].data;
                    //플레이어 이름이랑 a태그 있을때
                } else if ((table_td[0].children.length == 1 || table_td[0].children.length == 2) && table_td[0].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[0].children[0].children[0].data;

                } else if (table_td[0].children.length == 4 && table_td[0].children[1].data == '(Assist:' ) {
                    res_tr.player_name = table_td[0].children[0].children[0].data;
                    //플레이어 교체
                }else if (table_td[0].children.length == 4) {
                    res_tr.in_player_name = table_td[0].children[1].children[0].data;
                    res_tr.out_player_name = table_td[0].children[3].children[0].data;
                }

                //이벤트 이
                if (table_td[1].children[0] !== undefined) {
                    var icon_src = table_td[1].children[0].attribs.src;
                    var icon_key = icon_src.split('/')[3].split('.')[0];
                    res_tr.event_key = icon_key;
                    res_tr.event_name = this.eventName[icon_key];
                    res_tr.team_div = 'home';
                }

                //경기시간
                if (table_td[2].children[0] !== undefined) {
                    res_tr.time = table_td[2].children[0].data.replace(/\'/, '');
                }

                //이벤트 이름
                if (table_td[3].children[0] !== undefined) {
                    var icon_src = table_td[3].children[0].attribs.src;
                    var icon_key = icon_src.split('/')[3].split('.')[0];
                    res_tr.event_key = icon_key;
                    res_tr.event_name = this.eventName[icon_key];
                    res_tr.team_div = 'away';
                }

                //플레이 이름이 없을때
                if (table_td[4].children.length == 0) {
                    var testname = undefined;
                    //플레이어 이름은 있지만 a태그 없을때
                } else if ((table_td[4].children.length == 1 || table_td[4].children.length == 2) && table_td[4].children[0].type == 'text' && !table_td[4].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[4].children[0].data !== undefined ? table_td[4].children[0].data : null;
                    //플레이어 이름이랑 a태그 있을때
                } else if ((table_td[4].children.length == 1 || table_td[4].children.length == 2) && table_td[4].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[4].children[0].children[0].data !== undefined ? table_td[4].children[0].children[0].data : null;

                } else if (table_td[4].children.length == 4 && table_td[4].children[1].data == '(Assist:' ) {
                    res_tr.player_name = table_td[4].children[0].children[0].data !== undefined ? table_td[4].children[0].children[0].data : null;
                    //플레이어 교체
                } else if (table_td[4].children.length == 4) {
                    res_tr.in_player_name = table_td[4].children[1].children[0].data !== undefined ? table_td[4].children[1].children[0].data : null;
                    res_tr.out_player_name = table_td[4].children[3].children[0].data !== undefined ? table_td[4].children[3].children[0].data : null;
                }
                //console.log(res_tr);
                res.main.push(res_tr);
            }
        }

        for(var i = 0; i < res.main.length; i++){
            if(Number(res.main[i].time) < 46 && Number(res.main[i].event_key) == 1){
                if(res.main[i].team_div == 'home'){
                    res.goals.halfHome = res.goals.halfHome + 1;
                }else if (res.main[i].team_div == 'away'){
                    res.goals.halfAway = res.goals.halfAway + 1;
                }
            }
        }
        return res;
    }

    _techStat(techStatTable) {
        var table_tr = techStatTable.children;
        table_tr.shift();
        var res = {
            home: {},
            away: {}
        };

        for (var tr_idx = 0; tr_idx < table_tr.length; tr_idx++) {
            var tr_name = table_tr[tr_idx].children[2].children[0].data.toLowerCase().replace(/\s/g, '_');
            var key_name = {};
            var key_sum = '';
            var home = {};
            var away = {};
            var res_tr = {};
            //특이사항값 ex)kick-off
            if (table_tr[tr_idx].children[1].children[0] !== undefined && table_tr[tr_idx].children[1].children[0].hasOwnProperty('attribs')) {
                var test = table_tr[tr_idx].children[1].children[0].attribs.src;
                //console.log(test);
                //tech_Stat
            } else if (table_tr[tr_idx].children[1].children[0] !== undefined) {
                res.home[tr_name] = table_tr[tr_idx].children[1].children[0].data;
                res.away[tr_name] = table_tr[tr_idx].children[3].children[0].data;
            }
        }
        // console.log('res');
        // console.log(res);
        return res;
    }
}