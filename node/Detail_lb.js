const cheerio = require('cheerio');
const util = require('util');


class Detail_lb {
    constructor(response, body) {
        this.origin_parse = {};
        this.detail_page_1 = {};
        this.detail_page_2 = {};
        this.detail_page_3 = {};
        this.detail_arr = {};

    }

    setOriginParse(response, body, matchData, teamIdx, teamName) {
        var originParse = new OriginParse(response, body, matchData, teamIdx, teamName).getParse();
        this.origin_parse = originParse;
    }

    setDetailPageEach(divTeamIdx) {
        var originParse = this.getOriginParse();
        var detailPageOne = new DetailPageOne(originParse, divTeamIdx);
        var detailPageTwo = new DetailPageTwo(originParse, divTeamIdx);
        var detailPageThree = new DetailPageThree(originParse, divTeamIdx);
        var detailPageFour = new DetailPageFour(originParse, divTeamIdx);
        var detailPageFive = new DetailPageFive(originParse, divTeamIdx);

        this.detail_arr.pageOne = detailPageOne.getDetailPageOne();
        this.detail_arr.pageTwo = detailPageTwo.getDetailPageTwo();
        this.detail_arr.pageThree = detailPageThree.getDetailPageThree();
        this.detail_arr.pageFour = detailPageFour.getDetailPageFour();
        this.detail_arr.pageFive = detailPageFive.getDetailPageFive();
        //console.log(this.origin_parse.pageOne);
    }

    setDetailPageAll(resData, opponentData) {
        var teamInfo = this._setTeamInfo(resData.page_1);
        var oppoData = new Opponent(opponentData, teamInfo).getOppoRes;

        this.detail_page_1 = new DetailPageOneSum(resData.page_1, teamInfo);
        this.detail_page_2 = new DetailPageTwoSum(resData.page_2, teamInfo);
        this.detail_page_3 = new DetailPageThreeSum(resData.page_3, teamInfo, oppoData);
        this.detail_page_4 = new DetailPageFourSum(resData.page_4, teamInfo);
        this.detail_page_5 = new DetailPageFiveSum(resData.page_5, teamInfo);

        for (var divName in resData.page_1) {
            var oneData = resData.page_1[divName];
            var twoData = resData.page_2[divName];
            var threeData = resData.page_3[divName];
            var fourData = resData.page_4[divName];
            var fiveData = resData.page_5[divName];

            for (var pageDataKey in oneData) {
                this.detail_page_1.setResDataPart_1(oneData, pageDataKey, divName);
                this.detail_page_2.setResDataPart_1(twoData, pageDataKey, divName);
                this.detail_page_3.setResDataPart_1(threeData, pageDataKey, divName);
                this.detail_page_4.setResDataPart_1(fourData, pageDataKey, divName);
                this.detail_page_5.setResDataPart_1(fiveData, pageDataKey, divName);
            }
        }
        this.detail_page_1.setResDataPart_2();
        this.detail_page_2.setResDataPart_2();
        this.detail_page_3.setResDataPart_2();
        this.detail_page_4.setResDataPart_2();
        this.detail_page_5.setResDataPart_2();

        var avgKey = this.getAvgKey();

        for (var divName in avgKey) {
            this.detail_page_2.setResDataPart_3(divName);
            this.detail_page_3.setResDataPart_3(divName);
            this.detail_page_4.setResDataPart_3(divName);
            this.detail_page_5.setResDataPart_3(divName);
            for (var name in avgKey[divName]) {
                this.detail_page_1.setResDataPart_4(divName, name);
                this.detail_page_2.setResDataPart_4(divName, name);
                this.detail_page_3.setResDataPart_4(divName, name);
                this.detail_page_4.setResDataPart_4(divName, name);
                this.detail_page_5.setResDataPart_4(divName, name);
            }
        }

        this.detail_page_3.setResDataPart_7();

        var totalKey = this.getTotalKey()

        for (var divName in totalKey) {
            this.detail_page_1.setResDataPart_3(divName);

            for (var name in totalKey[divName]) {
                this.detail_page_3.setResDataPart_5(divName, name);
                this.detail_page_4.setResDataPart_5(divName, name);
                this.detail_page_5.setResDataPart_5(divName, name);
            }
        }

        for (var divName in totalKey) {
            this.detail_page_4.setResDataPart_6(divName);

            for (var name in totalKey[divName]) {
                this.detail_page_3.setResDataPart_6(name);
                this.detail_page_4.setResDataPart_7(divName,name);
                this.detail_page_5.setResDataPart_6(divName, name);
            }
        }

        this.detail_page_2.setResDataPart_5(divName, name);
    }

    getOriginParse() {
        return this.origin_parse;
    }

    getDetailArrAll() {
        return this.detail_arr;
    }

    getDetailPageAll() {
        //console.log(this.detail_page_1.res.p1_1.d1);
        return {
            detail_page_1: this.detail_page_1.res,
            detail_page_2: this.detail_page_2.getRes(),
            detail_page_3: this.detail_page_3.getRes(),
            detail_page_4: this.detail_page_4.getRes(),
            detail_page_5: this.detail_page_5.getRes(),
        }
    }

    getDetailPageOne() {
        //console.log(this.detail_page_1.res.p1_3);

        return this.detail_page_1.res;
    }

    setOpponent() {

    }

    getTotalKey() {
        return {
            div_home: {
                home: {},
                away: {},
                total: {}
            },
            div_away: {
                home: {},
                away: {},
                total: {}
            }
        }
    }

    getAvgKey() {
        return {
            div_home: {
                home: {},
                away: {},
            },
            div_away: {
                home: {},
                away: {},
            }
        }
    }

    _setTeamInfo(resData) {
        var teamInfo = {};
        if (resData.home[0] != undefined && resData.home[0].hasOwnProperty('p1_1_HA_analysis')) {
            teamInfo.div_home_idx = resData.home[0].p1_1_HA_analysis.team_idx;
            teamInfo.div_home_name = resData.home[0].p1_1_HA_analysis.team_name;
        }
        if (resData.away[0] != undefined && resData.away[0].hasOwnProperty('p1_1_HA_analysis')) {
            teamInfo.div_away_idx = resData.away[0].p1_1_HA_analysis.team_idx;
            teamInfo.div_away_name = resData.away[0].p1_1_HA_analysis.team_name;
        }
        return teamInfo;
    }
}

class Opponent {
    constructor(oppoData, teamInfo) {
        this.res = {};
        this.setOppoSum = { oppoData : oppoData, teamInfo :teamInfo};
    }

    set setOppoSum(data) {
        var getKey = this._ReverseKey();
        var res = this._ReverseTotalKey();
        var keyName = ['games', 'goal', 'goal_avg', 'lose', 'lose_avg', 'goal_0', 'goal_1', 'goal_2', 'goal_3', 'goal_4_over', 'lose_0', 'lose_1', 'lose_2', 'lose_3', 'lose_4_over', 'goal_diff_1', 'goal_diff_2', 'goal_diff_3', 'goal_diff_4_over', 'lose_diff_1', 'lose_diff_2', 'lose_diff_3', 'lose_diff_4_over', 'W', 'D', 'L' ];
        var oppoData = data.oppoData;
        var teamInfo = data.teamInfo;

        if(oppoData == null){
            console.log('obj');
            console.log(oppoData);
            this.res =  null;
            return ;
        }

        var oppoHome = oppoData.home.list;
        var oppoAway = oppoData.away.list;

        if(oppoHome == null){
            this.res =  null;
            return ;
        }

        for (var name in getKey) {
            var divVal = getKey[name];
            for (var divName in divVal) {
                res[name][divName] = {
                    team_idx: teamInfo[divName + '_idx'],
                    team_name: teamInfo[divName + '_name'],
                    team_div: name,
                }
                for(var keyVal of keyName){
                    res[name][divName][keyVal] = 0;
                }
            }
        }

        for (var name in getKey) {
            var divVal = getKey[name];
            for (var divName in divVal) {
                //console.log(divName);
                for (var oppoData of oppoHome) {
                    //console.log(oppoData);
                    if (teamInfo[divName + '_idx'] == oppoData[name + '_idx']) {
                        var subName = name == 'home' ? 'away' : 'home';
                        res[name][divName].games = res[name][divName].games + 1;
                        res[name][divName].goal = res[name][divName].goal + oppoData[name+'_goal'];
                        //res[name][divName].goal_avg = res[name][divName].goal_avg + oppoData;
                        res[name][divName].lose = res[name][divName].lose + oppoData[subName+'_goal'];
                        //res[name][divName].lose_avg = res[name][divName].lose_avg +;
                        var goalCnt = this._numberCnt(oppoData[name+'_goal']);
                        var loseCnt = this._numberCnt(oppoData[subName+'_goal']);
                        var goalDiff = oppoData[name+'_goal'] - oppoData[subName+'_goal'];
                        var diffCnt = this._numberCnt(goalDiff);
                        var teamRes = this._teamResData(oppoData, {main: name , sub : subName});

                        res[name][divName].goal_0 = res[name][divName].goal_0 + goalCnt.num_0;
                        res[name][divName].goal_1 = res[name][divName].goal_1 + goalCnt.num_1;
                        res[name][divName].goal_2 = res[name][divName].goal_2 + goalCnt.num_2;
                        res[name][divName].goal_3 = res[name][divName].goal_3 + goalCnt.num_3;
                        res[name][divName].goal_4_over = res[name][divName].goal_4_over + goalCnt.num_4_over;
                        res[name][divName].lose_0 = res[name][divName].lose_0 + loseCnt.num_0;
                        res[name][divName].lose_1 = res[name][divName].lose_1 + loseCnt.num_1;
                        res[name][divName].lose_2 = res[name][divName].lose_2 + loseCnt.num_2;
                        res[name][divName].lose_3 = res[name][divName].lose_3 + loseCnt.num_3;
                        res[name][divName].lose_4_over = res[name][divName].lose_4_over + loseCnt.num_4_over;
                        res[name][divName].goal_diff_1 = res[name][divName].goal_diff_1 + diffCnt.num_1;
                        res[name][divName].goal_diff_2 = res[name][divName].goal_diff_2 + diffCnt.num_2;
                        res[name][divName].goal_diff_3 = res[name][divName].goal_diff_3 + diffCnt.num_3;
                        res[name][divName].goal_diff_4_over = res[name][divName].goal_diff_4_over + diffCnt.num_4_over;
                        res[name][divName].lose_diff_1 = res[name][divName].lose_diff_1 + diffCnt.num__1;
                        res[name][divName].lose_diff_2 = res[name][divName].lose_diff_2 + diffCnt.num__2;
                        res[name][divName].lose_diff_3 = res[name][divName].lose_diff_3 + diffCnt.num__3;
                        res[name][divName].lose_diff_4_over = res[name][divName].lose_diff_4_over + diffCnt.num__4_over;
                        res[name][divName].W = res[name][divName].W + teamRes.W;
                        res[name][divName].D = res[name][divName].D + teamRes.D;
                        res[name][divName].L = res[name][divName].L + teamRes.L;
                    }
                }
                res[name][divName].goal_avg = this._okRound(res[name][divName].goal, res[name][divName].games, 2);
                res[name][divName].lose_avg = this._okRound(res[name][divName].lose, res[name][divName].games, 2);
            }
        }

        var divVal = ['div_home','div_away'];
        for (var divName of divVal) {
            var H = res.home[divName] ;
            var A = res.away[divName] ;
            res.total[divName].team_idx = H.team_idx;
            res.total[divName].team_name = H.team_name;

            for(var keyVal of keyName){
                res.total[divName][keyVal] = H[keyVal] + A[keyVal];
            }
            res.total[divName].goal_avg = this._okRound(res.total[divName].goal, res.total[divName].games, 2);
            res.total[divName].lose_avg = this._okRound(res.total[divName].lose, res.total[divName].games, 2);
        }

        this.res = res;
    }

    get getOppoRes(){
        return this.res;
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

    _teamResData(originData, teamDiv) {
        var data = originData;
        var team_diff = null;
        var W = 0;
        var D = 0;
        var L = 0;
        var team_point = null;
        var goal = Number(data[teamDiv.main + '_goal']);
        var lose = Number(data[teamDiv.sub + '_goal']);

        if (goal !== '' && lose !== '') {
            team_diff = goal - lose;

            if (goal < lose) {
                L = 1;
                team_point = 0;
            } else if (goal > lose) {
                W = 1;
                team_point = 3;
            } else if (goal == lose) {
                D = 1;
                team_point = 1;
            }
        }

        return {
            team_diff: team_diff,
            W: W,
            D: D,
            L: L,
            team_point: team_point,
        }
    }

    _numberCnt(num){
        var res = {
            num__4_over : num <= -4 ? 1 : 0,
            num__3 : num === -3 ? 1 : 0,
            num__2 : num === -2 ? 1 : 0,
            num__1 : num === -1 ? 1 : 0,
            num_0: num === 0 ? 1 : 0,
            num_1: num === 1 ? 1 : 0,
            num_2: num === 2 ? 1 : 0,
            num_3: num === 3 ? 1 : 0,
            num_4_over: num >= 4 ? 1 : 0,
        }
        return res;
    }

    _ReverseTotalKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            },
            total: {
                div_home: {},
                div_away: {}
            }
        };
    }

    _ReverseKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            }
        };
    }
}

class DetailPageFiveSum {
    constructor(resData, teamInfo){
        this.teamInfo = teamInfo;
        this.sumRes = this._sumResKey;
        this.res = this._resKey;
    }

    getRes(){
        return this.res ;
    }

    setResDataPart_1(divData, pageData, divName){
        var pageData = divData[pageData];
        this.sumP5_2 = {pageData : pageData.p5_2_section_over_under, divName : divName};
        this.sumP5_3 = {pageData : pageData.p5_3_goal_stats, divName : divName};
        this.sumP5_4 = {pageData : pageData.p5_4_goal_section_stats, divName : divName};
    }

    setResDataPart_2(){
        //console.log(this.sumRes.p4_2);
    }

    setResDataPart_3(divName){
        this.totalP5_2 = divName;
        this.totalP5_3 = divName;
        this.totalP5_4 = divName;
    }

    setResDataPart_4(divName, name){
        this.perP5_2 = {divName : divName, name : name};
        this.perP5_3 = {divName : divName, name : name};
        this.perP5_4 = {divName : divName, name : name};
    }

    setResDataPart_5(divName, name){
        if(divName == 'div_home') {
            this.divTeamPerP5_3 = {divName: divName, name: name};
            this.divTeamPerP5_4 = {divName: divName, name: name};
        }
    }

    setResDataPart_6(divName, name){
        this.resP5_2_d1 = {divName: divName, name: name};

        this.resP5_3_d1 = {divName: divName, name: name};
        this.resP5_3_d2 = {divName: divName, name: name};

        this.resP5_4_d1 = {divName: divName, name: name};
        this.resP5_4_d2 = {divName: divName, name: name};
    }

    set sumP5_2(D){
        var sumData = this.sumRes.p5_2[D.pageData.team_div]['div_' + D.divName];
        var keyArr = ['games','goal','lose','both_team_goal','no_goal','no_goal_L','no_lose','no_lose_W'];

        if(Object.keys(sumData).length === 0){
            sumData = {
                team_idx: D.pageData.team_idx,
                team_name: D.pageData.team_name,
                goalArr : [],
                loseArr : [],
                gameIdxArr : [],
            }
            for(var keyVal of keyArr){
                sumData[keyVal] = 0;
            }
        }

        sumData.goalArr.push(D.pageData.goal);
        sumData.loseArr.push(D.pageData.lose);
        sumData.gameIdxArr.push(D.pageData.game_idx);

        for(var keyVal of keyArr){
            if(keyVal == 'games'){
                sumData.games += 1 ;
            }else {
                sumData[keyVal] += D.pageData[keyVal] ;
            }
        }

        this.sumRes.p5_2[D.pageData.team_div]['div_' + D.divName] = sumData;
    }
    set totalP5_2(divName){
        var keyArr = ['games','goal','lose','both_team_goal','no_goal','no_goal_L','no_lose','no_lose_W'];
        var divKey = ['home','away'];

        for(var div of divKey){
            if(Object.keys(this.sumRes.p5_2[div][divName]).length === 0){
                this.sumRes.p5_2[div][divName] = {
                    team_idx: this.teamInfo[divName + '_idx'],
                    team_name: this.teamInfo[divName + '_name'],
                }
                for(var keyVal of keyArr){
                    this.sumRes.p5_2[div][divName][keyVal] = 0;
                }
            }
        }

        var H = this.sumRes.p5_2.home[divName];
        var A = this.sumRes.p5_2.away[divName];

        var res = {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
        }

        for(var keyVal of keyArr){
            res[keyVal] = 0;
        }

        for(var keyVal of keyArr){
            res[keyVal] = H[keyVal] + A[keyVal];
        }
        for(var keyVal of keyArr){
            if(keyVal != 'goal' && keyVal != 'lose' && keyVal != 'games') {
                res[keyVal + '_per'] = this._okRound(res[keyVal], res.games, 0, '%');
            }
        }

        this.sumRes.p5_2.total[divName] = res;
    }
    set perP5_2(D){
        var sumData = this.sumRes.p5_2[D.name][D.divName];
        var keyArr = ['games','goal','lose','both_team_goal','no_goal','no_goal_L','no_lose','no_lose_W'];

        for(var keyVal of keyArr){
            if(keyVal != 'goal' && keyVal != 'lose' && keyVal != 'games') {
                sumData[keyVal + '_per'] = this._okRound(sumData[keyVal], sumData.games, 0, '%');
            }
        }

        this.sumRes.p5_2[D.name][D.divName] = sumData;
    }
    set resP5_2_d1(D){
        var sumData = this.sumRes.p5_2[D.name][D.divName] ;

        this.res.p5_2.d1[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games: sumData.games,
            both_team_goal: sumData.both_team_goal,
            no_goal: sumData.no_goal,
            no_goal_L: sumData.no_goal_L,
            no_lose: sumData.no_lose,
            no_lose_W: sumData.no_lose_W,
            both_team_goal_per: sumData.both_team_goal_per,
            no_goal_per: sumData.no_goal_per,
            no_goal_L_per: sumData.no_goal_L_per,
            no_lose_per: sumData.no_lose_per,
            no_lose_W_per: sumData.no_lose_W_per,
        }
    }

    set sumP5_3(D){
        var sumData = this.sumRes.p5_3[D.pageData.team_div]['div_' + D.divName];
        var keyArr = ['games','goal','goal_0','goal_1','goal_2','goal_3','goal_4','goal_5','goal_6','goal_7_over','half_goal','half_goal_0','half_goal_1','half_goal_2','half_goal_3','half_goal_4','half_goal_5','half_goal_6','half_goal_7_over'];
        if(Object.keys(sumData).length === 0){
            sumData = {
                team_idx: D.pageData.team_idx,
                team_name: D.pageData.team_name,
                goalArr : [],
                goalHalfArr : [],
                gameIdxArr : [],
            }
            for(var keyVal of keyArr){
                sumData[keyVal] = 0;
            }
        }

        sumData.goalArr.push(D.pageData.goal);
        sumData.goalHalfArr.push(D.pageData.half_goal);
        sumData.gameIdxArr.push(D.pageData.game_idx);

        for(var keyVal of keyArr){
            if(keyVal == 'games'){
                sumData.games += 1 ;
            }else {
                sumData[keyVal] += D.pageData[keyVal] ;
            }
        }

        this.sumRes.p5_3[D.pageData.team_div]['div_' + D.divName] = sumData;
    }
    set totalP5_3(divName){
        var keyArr = ['games','goal','goal_0','goal_1','goal_2','goal_3','goal_4','goal_5','goal_6','goal_7_over','half_goal','half_goal_0','half_goal_1','half_goal_2','half_goal_3','half_goal_4','half_goal_5','half_goal_6','half_goal_7_over'];
        var divKey = ['home','away'];

        for(var div of divKey){
            if(Object.keys(this.sumRes.p5_3[div][divName]).length === 0){
                this.sumRes.p5_3[div][divName] = {
                    team_idx: this.teamInfo[divName + '_idx'],
                    team_name: this.teamInfo[divName + '_name'],
                }
                for(var keyVal of keyArr){
                    this.sumRes.p5_3[div][divName][keyVal] = 0;
                }
            }
        }

        var H = this.sumRes.p5_3.home[divName];
        var A = this.sumRes.p5_3.away[divName];

        var res = {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
        }

        for(var keyVal of keyArr){
            res[keyVal] = 0;
        }

        for(var keyVal of keyArr){
            res[keyVal] = H[keyVal] + A[keyVal];
        }
        for(var keyVal of keyArr){
            if(keyVal != 'goal' && keyVal != 'games' && keyVal != 'half_goal') {
                res[keyVal + '_per'] = this._okRound(res[keyVal], res.games, 0, '%');
            }
        }

        this.sumRes.p5_3.total[divName] = res;
    }
    set perP5_3(D){
        var sumData = this.sumRes.p5_3[D.name][D.divName];
        var keyArr = ['games','goal','goal_0','goal_1','goal_2','goal_3','goal_4','goal_5','goal_6','goal_7_over','half_goal','half_goal_0','half_goal_1','half_goal_2','half_goal_3','half_goal_4','half_goal_5','half_goal_6','half_goal_7_over'];

        for(var keyVal of keyArr){
            if(keyVal != 'goal' && keyVal != 'lose' && keyVal != 'games') {
                sumData[keyVal + '_per'] = this._okRound(sumData[keyVal], sumData.games, 0, '%');
            }
        }

        this.sumRes.p5_3[D.name][D.divName] = sumData;
    }
    set divTeamPerP5_3(D){
        var divHome = this.sumRes.p5_3[D.name].div_home;
        var divAway = this.sumRes.p5_3[D.name].div_away;

        divHome.goal_avg = this._okRound(divHome.goal , divHome.games, 2);
        divAway.goal_avg = this._okRound(divAway.goal , divAway.games, 2);
        divHome.goal_half_avg = this._okRound(divHome.half_goal , divHome.games, 2);
        divAway.goal_half_avg = this._okRound(divAway.half_goal , divAway.games, 2);

        var divGoalLen = divHome.goal_avg + divAway.goal_avg;
        var divGoalHalfLen = divHome.goal_half_avg + divAway.goal_half_avg;

        divHome.goal_avg_per = this._okRound(divHome.goal_avg , divGoalLen, 0, '%');
        divAway.goal_avg_per = this._okRound(divAway.goal_avg , divGoalLen, 0, '%');
        divHome.goal_half_avg_per = this._okRound(divHome.goal_half_avg , divGoalHalfLen, 0, '%');
        divAway.goal_half_avg_per = this._okRound(divAway.goal_half_avg , divGoalHalfLen, 0, '%');

        this.sumRes.p5_3[D.name].div_home = divHome;
        this.sumRes.p5_3[D.name].div_away = divAway;
    }
    set resP5_3_d1(D){
        var sumData = this.sumRes.p5_3[D.name][D.divName] ;

        this.res.p5_3.d1[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games: sumData.games,
            goal_avg: sumData.goal_avg,
            goal_avg_per: sumData.goal_avg_per,
            goal_0: sumData.goal_0,
            goal_1: sumData.goal_1,
            goal_2: sumData.goal_2,
            goal_3: sumData.goal_3,
            goal_4: sumData.goal_4,
            goal_5: sumData.goal_5,
            goal_6: sumData.goal_6,
            goal_7_over: sumData.goal_7_over,
            goal_0_per: sumData.goal_0_per,
            goal_1_per: sumData.goal_1_per,
            goal_2_per: sumData.goal_2_per,
            goal_3_per: sumData.goal_3_per,
            goal_4_per: sumData.goal_4_per,
            goal_5_per: sumData.goal_5_per,
            goal_6_per: sumData.goal_6_per,
            goal_7_over_per: sumData.goal_7_over_per,
        }
    }
    set resP5_3_d2(D){
        var sumData = this.sumRes.p5_3[D.name][D.divName] ;

        this.res.p5_3.d2[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games: sumData.games,
            goal_half_avg: sumData.goal_half_avg,
            goal_half_avg_per: sumData.goal_half_avg_per,
            half_goal_0: sumData.half_goal_0,
            half_goal_1: sumData.half_goal_1,
            half_goal_2: sumData.half_goal_2,
            half_goal_3: sumData.half_goal_3,
            half_goal_4: sumData.half_goal_4,
            half_goal_5: sumData.half_goal_5,
            half_goal_6: sumData.half_goal_6,
            half_goal_7_over: sumData.half_goal_7_over,
            half_goal_0_per: sumData.half_goal_0_per,
            half_goal_1_per: sumData.half_goal_1_per,
            half_goal_2_per: sumData.half_goal_2_per,
            half_goal_3_per: sumData.half_goal_3_per,
            half_goal_4_per: sumData.half_goal_4_per,
            half_goal_5_per: sumData.half_goal_5_per,
            half_goal_6_per: sumData.half_goal_6_per,
            half_goal_7_over_per: sumData.half_goal_7_over_per,
        }
    }

    set sumP5_4(D){
        var sumData = this.sumRes.p5_4[D.pageData.team_div]['div_' + D.divName];
        var keyArr = ['games','goal','goal_0_1','goal_2_3','goal_4_5','goal_6_over','half_goal','half_goal_0_1','half_goal_2_3','half_goal_4_5','half_goal_6_over'];
        if(Object.keys(sumData).length === 0){
            sumData = {
                team_idx: D.pageData.team_idx,
                team_name: D.pageData.team_name,
                goalArr : [],
                goalHalfArr : [],
                gameIdxArr : [],
            }
            for(var keyVal of keyArr){
                sumData[keyVal] = 0;
            }
        }

        sumData.goalArr.push(D.pageData.goal);
        sumData.goalHalfArr.push(D.pageData.half_goal);
        sumData.gameIdxArr.push(D.pageData.game_idx);

        for(var keyVal of keyArr){
            if(keyVal == 'games'){
                sumData.games += 1 ;
            }else {
                sumData[keyVal] += D.pageData[keyVal] ;
            }
        }

        this.sumRes.p5_4[D.pageData.team_div]['div_' + D.divName] = sumData;
    }
    set totalP5_4(divName){
        var keyArr = ['games','goal','goal_0_1','goal_2_3','goal_4_5','goal_6_over','half_goal','half_goal_0_1','half_goal_2_3','half_goal_4_5','half_goal_6_over'];
        var divKey = ['home','away'];

        for(var div of divKey){
            if(Object.keys(this.sumRes.p5_4[div][divName]).length === 0){
                this.sumRes.p5_4[div][divName] = {
                    team_idx: this.teamInfo[divName + '_idx'],
                    team_name: this.teamInfo[divName + '_name'],
                }
                for(var keyVal of keyArr){
                    this.sumRes.p5_4[div][divName][keyVal] = 0;
                }
            }
        }

        var H = this.sumRes.p5_4.home[divName];
        var A = this.sumRes.p5_4.away[divName];

        var res = {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
        }

        for(var keyVal of keyArr){
            res[keyVal] = 0;
        }

        for(var keyVal of keyArr){
            res[keyVal] = H[keyVal] + A[keyVal];
        }
        for(var keyVal of keyArr){
            if(keyVal != 'goal' && keyVal != 'games' && keyVal != 'half_goal') {
                res[keyVal + '_per'] = this._okRound(res[keyVal], res.games, 0, '%');
            }
        }

        this.sumRes.p5_4.total[divName] = res;
    }
    set perP5_4(D){
        var sumData = this.sumRes.p5_4[D.name][D.divName];
        var keyArr = ['games','goal','goal_0_1','goal_2_3','goal_4_5','goal_6_over','half_goal','half_goal_0_1','half_goal_2_3','half_goal_4_5','half_goal_6_over'];

        for(var keyVal of keyArr){
            if(keyVal != 'goal' && keyVal != 'lose' && keyVal != 'games') {
                sumData[keyVal + '_per'] = this._okRound(sumData[keyVal], sumData.games, 0, '%');
            }
        }

        this.sumRes.p5_4[D.name][D.divName] = sumData;
    }
    set divTeamPerP5_4(D){
        var divHome = this.sumRes.p5_4[D.name].div_home;
        var divAway = this.sumRes.p5_4[D.name].div_away;

        divHome.goal_avg = this._okRound(divHome.goal , divHome.games, 2);
        divAway.goal_avg = this._okRound(divAway.goal , divAway.games, 2);
        divHome.goal_half_avg = this._okRound(divHome.half_goal , divHome.games, 2);
        divAway.goal_half_avg = this._okRound(divAway.half_goal , divAway.games, 2);

        var divGoalLen = divHome.goal_avg + divAway.goal_avg;
        var divGoalHalfLen = divHome.goal_half_avg + divAway.goal_half_avg;

        divHome.goal_avg_per = this._okRound(divHome.goal_avg , divGoalLen, 0, '%');
        divAway.goal_avg_per = this._okRound(divAway.goal_avg , divGoalLen, 0, '%');
        divHome.goal_half_avg_per = this._okRound(divHome.goal_half_avg , divGoalHalfLen, 0, '%');
        divAway.goal_half_avg_per = this._okRound(divAway.goal_half_avg , divGoalHalfLen, 0, '%');

        this.sumRes.p5_4[D.name].div_home = divHome;
        this.sumRes.p5_4[D.name].div_away = divAway;
    }
    set resP5_4_d1(D){
        var sumData = this.sumRes.p5_4[D.name][D.divName] ;

        this.res.p5_4.d1[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games: sumData.games,
            goal_avg: sumData.goal_avg,
            goal_avg_per: sumData.goal_avg_per,
            goal_0_1: sumData.goal_0_1,
            goal_2_3: sumData.goal_2_3,
            goal_4_5: sumData.goal_4_5,
            goal_6_over: sumData.goal_6_over,
            goal_0_1_per: sumData.goal_0_1_per,
            goal_2_3_per: sumData.goal_2_3_per,
            goal_4_5_per: sumData.goal_4_5_per,
            goal_6_over_per: sumData.goal_6_over_per,
        }
    }
    set resP5_4_d2(D){
        var sumData = this.sumRes.p5_4[D.name][D.divName] ;

        this.res.p5_4.d2[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games: sumData.games,
            goal_half_avg: sumData.goal_half_avg,
            goal_half_avg_per: sumData.goal_half_avg_per,
            half_goal_0_1: sumData.half_goal_0_1,
            half_goal_2_3: sumData.half_goal_2_3,
            half_goal_4_5: sumData.half_goal_4_5,
            half_goal_6_over: sumData.half_goal_6_over,
            half_goal_0_1_per: sumData.half_goal_0_1_per,
            half_goal_2_3_per: sumData.half_goal_2_3_per,
            half_goal_4_5_per: sumData.half_goal_4_5_per,
            half_goal_6_over_per: sumData.half_goal_6_over_per,
        }
    }

    get _sumResKey() {
        return {
            p5_1: this._reverseTotalKey,
            p5_2: this._reverseTotalKey,
            p5_3: this._reverseTotalKey,
            p5_4: this._reverseTotalKey,
            p5_5: {},
            p5_6: this._divKey,
        }
    }

    get _resKey() {
        return {
            p5_1: {
                d1: this._reverseTotalKey,
            },
            p5_2: {
                d1: this._reverseTotalKey,
            },
            p5_3: {
                d1: this._reverseTotalKey,
                d2: this._reverseTotalKey,
            },
            p5_4: {
                d1: this._reverseTotalKey,
                d2: this._reverseTotalKey,
            },
            p5_5: {
                d1: {},
            },
            p5_6: {
                d1: this._divKey,
            },
        }
    }

    get _divKey(){
        return {
            div_home: {},
            div_away: {}
        }
    }

    get _totalKey() {
        return {
            div_home: {
                home: {},
                away: {},
                total: {}
            },
            div_away: {
                home: {},
                away: {},
                total: {}
            }
        }
    }

    get _reverseTotalKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            },
            total: {
                div_home: {},
                div_away: {}
            }
        };
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

}

class DetailPageFive {
    constructor(originData, divTeamIdx) {
        this.res = {
            p5_1_monthly_record : {},
            p5_2_section_over_under : {},
            p5_3_goal_stats : {},
            p5_4_goal_section_stats : {},
            p5_5_league_standing : {},
            p5_6_team_schedule : {},
        }

        this.configData = {};
        this.techStats = {};
        this.keyEvent = {};

        if (originData.config.home_team_idx == divTeamIdx) {
            var teamDiv = {main: 'home', sub: 'away'};
        } else if (originData.config.away_team_idx == divTeamIdx) {
            var teamDiv = {main: 'away', sub: 'home'};
        }

        this.setConfigData(originData, teamDiv);
        if (originData.key_event.length != 0 && originData.key_event.length !== undefined) {
            this.setKeyEvent(originData, teamDiv);
        }
        if (originData.tech_statistics !== undefined && Object.keys(originData.tech_statistics).length != 0) {
            this.setTechStats(originData, teamDiv);
        }

        this.res = this.getPageData;
        //console.log(this.res.p5_4_goal_section_stats);
    }

    get getPageData(){
        return {
            p5_1_monthly_record : this.getP5_1,
            p5_2_section_over_under : this.getP5_2,
            p5_3_goal_stats : this.getP5_3,
            p5_4_goal_section_stats : this.getP5_4,
            p5_5_league_standing : this.getP5_5,
            p5_6_team_schedule : this.getP5_6,
        }
    }
    get getP5_1(){
        return {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal : this.configData.goal,
            lose : this.configData.lose,
            shots: this.techStats.shots,
            shots_on: this.techStats.shots_on,
            possession : this.techStats.possession,
            free_kicks: this.techStats.free_kicks,
            corner_kicks: this.techStats.corner_kicks,
            month : this.configData.month,
        }
    }
    get getP5_2(){
        return {
            game_idx : this.configData.game_idx,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal : this.configData.goal,
            lose : this.configData.lose,
            both_team_goal : this.configData.both_team_goal,
            no_goal : this.configData.no_goal,
            no_goal_L : this.configData.no_goal_L,
            no_lose : this.configData.no_lose,
            no_lose_W : this.configData.no_lose_W,
        }
    }
    get getP5_3(){
        return {
            game_idx : this.configData.game_idx,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal : this.configData.goal,
            goal_0 : this.configData.goal_0,
            goal_1 : this.configData.goal_1,
            goal_2 : this.configData.goal_2,
            goal_3 : this.configData.goal_3,
            goal_4 : this.configData.goal_4,
            goal_5 : this.configData.goal_5,
            goal_6 : this.configData.goal_6,
            goal_7_over : this.configData.goal_7_over,
            half_goal : this.keyEvent.half_goal,
            half_goal_0 : this.keyEvent.half_goal_0,
            half_goal_1 : this.keyEvent.half_goal_1,
            half_goal_2 : this.keyEvent.half_goal_2,
            half_goal_3 : this.keyEvent.half_goal_3,
            half_goal_4 : this.keyEvent.half_goal_4,
            half_goal_5 : this.keyEvent.half_goal_5,
            half_goal_6 : this.keyEvent.half_goal_6,
            half_goal_7_over : this.keyEvent.half_goal_7_over,
        }
    }
    get getP5_4(){
        return {
            game_idx : this.configData.game_idx,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal : this.configData.goal,
            goal_0_1 : this.configData.goal_0_1,
            goal_2_3 : this.configData.goal_2_3,
            goal_4_5 : this.configData.goal_4_5,
            goal_6_over : this.configData.goal_6_over,
            half_goal : this.keyEvent.half_goal,
            half_goal_0_1 : this.keyEvent.half_goal_0_1,
            half_goal_2_3 : this.keyEvent.half_goal_2_3,
            half_goal_4_5 : this.keyEvent.half_goal_4_5,
            half_goal_6_over : this.keyEvent.half_goal_6_over,
        }
    }
    get getP5_5(){
        return {}
    }
    get getP5_6(){
        return {}
    }

    setConfigData(originData, teamDiv) {
        var config = originData.config;
        var teamResData = this._teamResData(originData, teamDiv);
        var goal = config[teamDiv.main + '_goal'] != '' ? config[teamDiv.main + '_goal'] : null;
        var lose = config[teamDiv.sub + '_goal'] != '' ? config[teamDiv.sub + '_goal'] : null;
        var overUnder = this._overUnder(goal,lose);
        var goalStats = this._goalStats(goal);

        this.configData = {
            game_idx: config.game_idx,
            game_start_time : config.game_date,
            team_div: teamDiv.main,
            team_name: config[teamDiv.main + '_name'],
            team_idx: config[teamDiv.main + '_team_idx'],
            league_idx: config.league_idx,
            league_name: config.league_name,
            league_color: config.league_color,
            goal: Number(goal),
            lose: Number(lose),
            month : config.month,
            both_team_goal : overUnder.bothTeamGoal,
            no_goal : overUnder.noGoal,
            no_goal_L : overUnder.noGoalL,
            no_lose : overUnder.noLose,
            no_lose_W : overUnder.noLoseW,
            goal_0 : goalStats.goal_0,
            goal_1 : goalStats.goal_1,
            goal_2 : goalStats.goal_2,
            goal_3 : goalStats.goal_3,
            goal_4 : goalStats.goal_4,
            goal_5 : goalStats.goal_5,
            goal_6 : goalStats.goal_6,
            goal_7_over : goalStats.goal_7_over,
            goal_0_1 : goalStats.goal_0_1,
            goal_2_3 : goalStats.goal_2_3,
            goal_4_5 : goalStats.goal_4_5,
            goal_6_over : goalStats.goal_6_over,
        }
    }

    setKeyEvent(originData, teamDiv) {
        var keyEvent = originData.key_event;
        var halfFullGoal = {
            firstHalfGoal: 0,
            firstHalfLose: 0,
            secondHalfGoal: 0,
            secondHalfLose: 0,
        }

        for (var event of keyEvent) {
            if (event.event_name == 'Goal' || event.event_name == 'Penalty scored' || event.event_name == 'Own goal') {
                var resHalfGoal = this._halfFullGoal(event, teamDiv, halfFullGoal);
                halfFullGoal.firstHalfGoal = resHalfGoal.firstHalfGoal + halfFullGoal.firstHalfGoal;
                halfFullGoal.firstHalfLose = resHalfGoal.firstHalfLose + halfFullGoal.firstHalfLose;
                halfFullGoal.secondHalfGoal = resHalfGoal.secondHalfGoal + halfFullGoal.secondHalfGoal;
                halfFullGoal.secondHalfLose = resHalfGoal.secondHalfLose + halfFullGoal.secondHalfLose;
            }
        }
        var goalStats = this._goalStats(halfFullGoal.firstHalfGoal);

        this.keyEvent = {
            half_goal : halfFullGoal.firstHalfGoal,
            half_goal_0 : goalStats.goal_0,
            half_goal_1 : goalStats.goal_1,
            half_goal_2 : goalStats.goal_2,
            half_goal_3 : goalStats.goal_3,
            half_goal_4 : goalStats.goal_4,
            half_goal_5 : goalStats.goal_5,
            half_goal_6 : goalStats.goal_6,
            half_goal_7_over : goalStats.goal_7_over,
            half_goal_0_1 : goalStats.goal_0_1,
            half_goal_2_3 : goalStats.goal_2_3,
            half_goal_4_5 : goalStats.goal_4_5,
            half_goal_6_over : goalStats.goal_6_over,
        }
    }

    setTechStats(originData, teamDiv) {
        var techMain = originData.tech_statistics[teamDiv.main];
        var possession = techMain.possession !== null ? techMain.possession.split('%')[0] : null;

        this.techStats = {
            possession: possession,
            shots: techMain.shots,
            shots_on: techMain.shots_on_goal,
            free_kicks : techMain.free_kicks,
            corner_kicks : techMain.corner_kicks,
        }
    }

    getDetailPageFive(){
        return this.res;
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

    _teamResData(originData, teamDiv) {
        var data = originData.config;
        var team_diff = null;
        var W = 0;
        var D = 0;
        var L = 0;
        var team_point = null;
        var team_res = null;

        if (data[teamDiv.main + '_goal'] !== '' && data[teamDiv.sub + '_goal'] !== '') {
            team_diff = Number(data[teamDiv.main + '_goal']) - Number(data[teamDiv.sub + '_goal']);

            if (data[teamDiv.main + '_goal'] < data[teamDiv.sub + '_goal']) {
                L = 1;
                team_point = 0;
                team_res = 'L';
            } else if (data[teamDiv.main + '_goal'] > data[teamDiv.sub + '_goal']) {
                W = 1;
                team_point = 3;
                team_res = 'W';
            } else if (data[teamDiv.main + '_goal'] == data[teamDiv.sub + '_goal']) {
                D = 1;
                team_point  = 1;
                team_res = 'D';
            }
        }
        return {
            team_diff: team_diff,
            W: W,
            D: D,
            L: L,
            team_point : team_point,
            team_res : team_res,
        }
    }

    _overUnder(goal, lose){
        var res = {
            bothTeamGoal : 0,
            noGoal : 0,
            noGoalL : 0,
            noLose : 0,
            noLoseW : 0,
        }
        var goal = Number(goal);
        var lose = Number(lose);

        if(goal === 0){
            res.noGoal = 1;
            if(lose > 0){
                res.noGoalL = 1;
            }
        }
        if(lose === 0){
            res.noLose = 1;
            if(goal > 0){
                res.noLoseW = 1;
            }
        }
        if(goal > 0 && lose > 0){
            res.bothTeamGoal = 1;
        }

        return res;
    }

    _goalStats(goal){
        var goal = Number(goal);
        var res = {
            goal_0 : 0,
            goal_1 : 0,
            goal_2 : 0,
            goal_3 : 0,
            goal_4 : 0,
            goal_5 : 0,
            goal_6 : 0,
            goal_7_over : 0,
            goal_0_1 : 0,
            goal_2_3 : 0,
            goal_4_5 : 0,
            goal_6_over : 0,
        }

        if(goal === 0 || goal === 1){
            res.goal_0_1 = 1;
        }else if(goal === 2 || goal === 3){
            res.goal_2_3 = 1;
        }else if(goal === 4 || goal === 5){
            res.goal_4_5 = 1;
        }else if(goal > 5){
            res.goal_6_over = 1;
        }

        if(goal < 7){
            res['goal_'+goal] = 1;
        }else {
            res.goal_7_over = 1;
        }

        return res;
    }

    _halfFullGoal(event, teamDiv) {
        var firstHalfGoal = 0;
        var firstHalfLose = 0;
        var secondHalfGoal = 0;
        var secondHalfLose = 0;

        if (event.team_div == teamDiv.main) {
            if (event.time <= 45) {
                firstHalfGoal = 1;
            } else if (event.time > 45) {
                secondHalfGoal = 1;
            }
        } else if (event.team_div == teamDiv.sub) {
            if (event.time <= 45) {
                firstHalfLose = 1;
            } else if (event.time > 45) {
                secondHalfLose = 1;
            }
        }

        return {
            firstHalfGoal: firstHalfGoal,
            firstHalfLose: firstHalfLose,
            secondHalfGoal: secondHalfGoal,
            secondHalfLose: secondHalfLose,
        }
    }
}

class DetailPageFourSum {
    constructor(resData, teamInfo){
        this.teamInfo = teamInfo;
        this.sumRes = this._sumResKey;
        this.res = this._resKey;

        this.setP4_1 = {resData:resData, teamInfo:teamInfo};
    }

    getRes(){
        return this.res ;
    }

    setResDataPart_1(divData, pageData, divName){
        var pageData = divData[pageData];
        this.setP4_2 = {pageData : pageData.p4_2_player_change, divName : divName};
        this.setP4_3 = {pageData : pageData.p4_3_card_count, divName : divName};
        this.setP4_4 = {pageData : pageData.p4_4_result_diff, divName : divName};
        this.setP4_5 = {pageData : pageData.p4_5_rest_day_diff, divName : divName};
    }

    setResDataPart_2(){
        //console.log(this.sumRes.p4_2);
    }

    setResDataPart_3(divName){
        this.setP4_2_avg_per = divName;
        this.setP4_3_avg = divName;
        this.setP4_4_total = divName;
        this.setP4_5_total = divName;
    }

    setResDataPart_4(divName, name){
        this.setP4_4_avg = {divName : divName, name : name};
        this.setP4_5_avg = {divName : divName, name : name};
    }

    setResDataPart_5(divName, name){
        this.setP4_4_per = name ;
    }
    setResDataPart_6(divName){
        this.resP4_1_d1 = {divName : divName };
        this.resP4_1_d2 = {divName : divName };

        this.resP4_2_d1 = {divName : divName };
        this.resP4_2_d2 = {divName : divName };

        this.resP4_3_d1 = {divName : divName };
    }
    setResDataPart_7(divName, name){
        this.resP4_4_d1 = {divName : divName , name : name};
        this.resP4_4_d2 = {divName : divName , name : name};
        this.resP4_4_d3 = {divName : divName , name : name};

        this.resP4_5_d1 = {divName : divName , name : name};
    }

    set setP4_1(D){
        var resData = D.resData;
        var teamInfo = D.teamInfo;
        var sumKey = ['goal','lose','W','D','L'];
        var recentForma = {
            div_home : {
                formation : null,
            },
            div_away : {
                formation : null,

            },
        };

        for(var divName in resData){
            var divVal = resData[divName];

            for(var divArr in divVal){
                var formaVal = divVal[divArr].p4_1_formation
                if(recentForma['div_'+divName].formation === null) {
                    recentForma['div_'+divName].formation = formaVal.formation;
                    recentForma['div_'+divName].formation_division = formaVal.formation_division;
                    recentForma['div_'+divName].formation_sub = formaVal.formation_sub;
                }
            }
        }

        recentForma.div_home.formation_opposition = recentForma.div_away.formation ;
        recentForma.div_away.formation_opposition = recentForma.div_home.formation ;

        for(var divName in resData){
            var divVal = resData[divName];
            var divNameSub = divName === 'home' ? 'away' : 'home';
            recentForma['div_'+divName].recent = [];
            var recentSum = {
                goal : [],
                lose : [],
                W : [],
                D : [],
                L : [],
            };
            //console.log(divName);

            for(var divArr in divVal){
                //console.log(this.recentForma['div_'+divNameSub+'_oppo']);
                var formaVal = divVal[divArr].p4_1_formation ;
                if(formaVal.formation_opposition === recentForma['div_'+divNameSub].formation && formaVal.formation === recentForma['div_'+divName].formation && recentForma['div_'+divName].recent.length < 5 && recentForma['div_'+divName].formation !== null){
                    recentForma['div_'+divName].recent.push({
                        game_idx : formaVal.game_idx,
                        game_date : formaVal.game_date,
                        goal : formaVal.goal,
                        lose : formaVal.lose,
                    });
                    for(var sumkeyName of sumKey) {
                        recentSum[sumkeyName].push(formaVal[sumkeyName]);
                    }
                }
            }
            recentForma['div_'+divName].recent.reverse();

            for(var sumKeyName of sumKey) {
                var keyVal = recentSum[sumKeyName];
                var keyLen = recentSum[sumKeyName].length ;
                var keySum = 0 ;

                for(var recentVal of keyVal){
                    keySum = recentVal + keySum;
                }
                if(sumKeyName === 'goal' || sumKeyName === 'lose') {
                    recentSum[sumKeyName] = this._okRound(keySum, keyLen, 2);
                }else {
                    recentSum[sumKeyName+'_per'] = this._okRound(keySum, keyLen, 0, '%');
                    recentSum[sumKeyName] = keySum;
                }

            }
            recentForma['div_'+divName].recentSum = recentSum;
        }

        recentForma.div_home.team_idx = teamInfo.div_home_idx ;
        recentForma.div_home.team_name = teamInfo.div_home_name ;
        recentForma.div_away.team_idx = teamInfo.div_away_idx ;
        recentForma.div_away.team_name = teamInfo.div_away_name ;

        this.sumRes.p4_1 = recentForma;
    }
    set resP4_1_d1(D){
        var sumData = this.sumRes.p4_1[D.divName] ;

        this.res.p4_1.d1[D.divName]= {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            formation : sumData.formation,
            formation_division :sumData.formation_division,
            formation_sub : sumData.formation_sub,
        }
    }
    set resP4_1_d2(D){
        var sumData = this.sumRes.p4_1[D.divName] ;

        this.res.p4_1.d2[D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            formation : sumData.formation,
            formation_opposition : sumData.formation_opposition,
            goal_avg : sumData.recentSum.goal,
            lose_avg : sumData.recentSum.lose,
            W : sumData.recentSum.W,
            D : sumData.recentSum.D,
            L : sumData.recentSum.L,
            W_per : sumData.recentSum.W_per,
            D_per : sumData.recentSum.D_per,
            L_per : sumData.recentSum.L_per,
            recent : sumData.recent,
        }
    }

    set setP4_2(D){
        var sumData = this.sumRes.p4_2['div_' + D.divName];
        //console.log(D.pageData);
        //console.log(Object.keys(sumData).length);
        if(Object.keys(sumData).length === 0){
            sumData = {
                team_idx: D.pageData.team_idx,
                team_name: D.pageData.team_name,
                sub_time_1 : [],
                sub_time_2 : [],
                sub_time_3 : [],
                sub_goal_1 : 0,
                sub_goal_2 : 0,
                sub_goal_3 : 0,
                sub_lose_1 : 0,
                sub_lose_2 : 0,
                sub_lose_3 : 0,
                sub_len_1 : 0,
                sub_len_2 : 0,
                sub_len_3 : 0,
                sub_cnt : [],
            }
        }

        var pageGoal_1 = D.pageData.sub_goal_1 !== undefined ? D.pageData.sub_goal_1 : 0;
        var pageGoal_2 = D.pageData.sub_goal_2 !== undefined ? D.pageData.sub_goal_2 : 0;
        var pageGoal_3 = D.pageData.sub_goal_3 !== undefined ? D.pageData.sub_goal_3 : 0;
        var pageLose_1 = D.pageData.sub_lose_1 !== undefined ? D.pageData.sub_lose_1 : 0;
        var pageLose_2 = D.pageData.sub_lose_2 !== undefined ? D.pageData.sub_lose_2 : 0;
        var pageLose_3 = D.pageData.sub_lose_3 !== undefined ? D.pageData.sub_lose_3 : 0;

        //console.log(D.pageData);
        D.pageData.sub_time_1 !== undefined ? sumData.sub_time_1.push(D.pageData.sub_time_1) : null;
        D.pageData.sub_time_2 !== undefined ? sumData.sub_time_2.push(D.pageData.sub_time_2) : null;
        D.pageData.sub_time_3 !== undefined ? sumData.sub_time_3.push(D.pageData.sub_time_3) : null;
        sumData.sub_goal_1 += pageGoal_1;
        sumData.sub_goal_2 += pageGoal_2;
        sumData.sub_goal_3 += pageGoal_3;
        sumData.sub_lose_1 += pageLose_1;
        sumData.sub_lose_2 += pageLose_2;
        sumData.sub_lose_3 += pageLose_3;
        sumData.sub_len_1 += (pageGoal_1 + pageLose_1);
        sumData.sub_len_2 += (pageGoal_2 + pageLose_2);
        sumData.sub_len_3 += (pageGoal_3 + pageLose_3);
        D.pageData.sub_cnt !== undefined ? sumData.sub_cnt.push(D.pageData.sub_cnt) : null;

        this.sumRes.p4_2['div_' + D.divName] = sumData;
    }
    set setP4_2_avg_per(divName){
        var sumData = this.sumRes.p4_2[divName];

        for(var sumDataKey in sumData){
            if(typeof sumData[sumDataKey] == 'object') {
                sumData[sumDataKey] = sumData[sumDataKey].filter(function (item) {
                    return item !== null;
                });
                var len = sumData[sumDataKey].length ;
                var val = 0;
                for(var i of sumData[sumDataKey]){
                    val += Number(i);
                }
                if(sumDataKey == 'sub_cnt'){
                    sumData[sumDataKey+'_avg'] = this._okRound(val, len , 2);
                }else {
                    var subTime = new Date(this._okRound(val*60000, len , 2));
                    var subHours = subTime.getHours() - 9;
                    var subMinutes = subTime.getMinutes();
                    var subSeconds = String(subTime.getSeconds()).length == 2 ? subTime.getSeconds() : '0' + subTime.getSeconds();
                    var fullMinutes = (subHours * 60) + subMinutes ;
                    fullMinutes = String(fullMinutes).length == 2 ? fullMinutes :  '0' + fullMinutes ;
                    var subTimeRes = fullMinutes + ':' + subSeconds;
                    sumData[sumDataKey+'_avg'] = subTimeRes;
                }
            }
        }

        for(var i =1; i<4 ; i++){
            sumData['sub_goal_' + i + '_per'] = this._okRound(sumData['sub_goal_' + i], sumData['sub_len_' + i], 0, '%');
            sumData['sub_lose_' + i + '_per'] = this._okRound(sumData['sub_lose_' + i], sumData['sub_len_' + i], 0, '%');
        }

        this.sumRes.p4_2[divName] = sumData;
    }
    set resP4_2_d1(D){
        var sumData = this.sumRes.p4_2[D.divName] ;

        this.res.p4_2.d1[D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            sub_time_avg_1 : sumData.sub_time_1_avg,
            sub_time_avg_2 : sumData.sub_time_2_avg,
            sub_time_avg_3 : sumData.sub_time_3_avg,
            sub_cnt_avg : sumData.sub_cnt_avg,
        }
    }
    set resP4_2_d2(D){
        var sumData = this.sumRes.p4_2[D.divName] ;
        this.res.p4_2.d2[D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            sub_goal_per_1 : sumData.sub_goal_1_per ,
            sub_goal_per_2 : sumData.sub_goal_2_per ,
            sub_goal_per_3 : sumData.sub_goal_3_per ,
            sub_lose_per_1 : sumData.sub_lose_1_per ,
            sub_lose_per_2 : sumData.sub_lose_2_per ,
            sub_lose_per_3 : sumData.sub_lose_3_per ,
        }
    }

    set setP4_3(D){
        var sumData = this.sumRes.p4_3['div_' + D.divName];

        if(Object.keys(sumData).length === 0){
            sumData = {
                team_idx: D.pageData.team_idx,
                team_name: D.pageData.team_name,
                red : [],
                red_permit : [],
                yellow : [],
                yellow_permit : [],
            }
        }

        sumData.red.push(D.pageData.red);
        sumData.red_permit.push(D.pageData.red_permit);
        sumData.yellow.push(D.pageData.yellow);
        sumData.yellow_permit.push(D.pageData.yellow_permit);

        this.sumRes.p4_3['div_' + D.divName] = sumData;
    }
    set setP4_3_avg(divName){
        var sumData = this.sumRes.p4_3[divName];

        for(var sumDataKey in sumData){
            if(typeof sumData[sumDataKey] == 'object'){
                var len = sumData[sumDataKey].length;
                var sum = 0;
                for(var val of sumData[sumDataKey]){
                    sum += val ;
                }
                sumData[sumDataKey+'_avg'] = this._okRound(sum, len, 2);
            }
        }

        this.sumRes.p4_3[divName] = sumData;
    }
    set resP4_3_d1(D){
        var sumData = this.sumRes.p4_3[D.divName] ;

        this.res.p4_3.d1[D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            red_avg : sumData.red_avg,
            red_permit_avg : sumData.red_permit_avg,
            yellow_avg : sumData.yellow_avg,
            yellow_permit_avg : sumData.yellow_permit_avg,
        }
    }

    set setP4_4(D){
        var sumData = this.sumRes.p4_4[D.pageData.team_div]['div_' + D.divName];

        if(Object.keys(sumData).length === 0){
            var keyObj = {
                team_idx: D.pageData.team_idx,
                team_name: D.pageData.team_name,
                game_idx_arr : [],
                goal: [],
                lose: [],
                shots: [],
                shots_on: [],
                possession: [],
                free_kicks: [],
                corner_kicks: []
            };
            sumData = {
                W : JSON.parse(JSON.stringify(keyObj)),
                D : JSON.parse(JSON.stringify(keyObj)),
                L : JSON.parse(JSON.stringify(keyObj)),
            }
        }
        var goal = D.pageData.goal !== undefined ? D.pageData.goal : null;
        var lose = D.pageData.lose !== undefined ? D.pageData.lose : null;
        var shots = D.pageData.shots !== undefined ? D.pageData.shots : null;
        var shotsOn = D.pageData.shots_on !== undefined ? D.pageData.shots_on : null;
        var possession = D.pageData.possession !== undefined ? D.pageData.possession : null;
        var freeKicks = D.pageData.free_kicks !== undefined ? D.pageData.free_kicks : null;
        var cornerKicks = D.pageData.corner_kicks !== undefined ? D.pageData.corner_kicks : null;

        sumData[D.pageData.team_res].goal.push(goal);
        sumData[D.pageData.team_res].lose.push(lose);
        sumData[D.pageData.team_res].shots.push(shots);
        sumData[D.pageData.team_res].shots_on.push(shotsOn);
        sumData[D.pageData.team_res].possession.push(possession);
        sumData[D.pageData.team_res].free_kicks.push(freeKicks);
        sumData[D.pageData.team_res].corner_kicks.push(cornerKicks);

        this.sumRes.p4_4[D.pageData.team_div]['div_' + D.divName] = sumData;
    }
    set setP4_4_avg(D){
        var sumData = this.sumRes.p4_4[D.name][D.divName];
        //console.log(sumData);
        var resKey = ['W','D','L'];
        var res = {};
        for(var resVal of resKey) {
            res[resVal] = {
                team_idx: sumData[resVal].team_idx !== undefined ? sumData[resVal].team_idx : sumData[resVal].team_idx,
                team_name: sumData[resVal].team_name !== undefined ? sumData[resVal].team_name : sumData[resVal].team_name,
                goal: sumData[resVal].goal,
                lose: sumData[resVal].lose,
                shots: sumData[resVal].shots,
                shots_on: sumData[resVal].shots_on,
                possession: sumData[resVal].possession,
                free_kicks: sumData[resVal].free_kicks,
                corner_kicks: sumData[resVal].corner_kicks
            }
        }

        for(var resVal of resKey){
            for(var techKey in sumData[resVal]){
                if(typeof sumData[resVal][techKey] == 'object'){
                    sumData[resVal][techKey] = sumData[resVal][techKey].filter(function (item) {
                        return item !== null;
                    });
                    var len = sumData[resVal][techKey].length;
                    var sum = 0;
                    for(var val of sumData[resVal][techKey]){
                        sum += Number(val) ;
                    }
                    res[resVal][techKey+'_avg'] = this._okRound(sum, len, 2);
                }
            }
        }

        this.sumRes.p4_4[D.name][D.divName] = res;
    }
    set setP4_4_total(divName){
        var divKey = ['home','away'];
        var resKey = ['W','D','L'];

        for(var div of divKey){
            if(Object.keys(this.sumRes.p4_4[div][divName]).length === 0){
                for(var resVal of resKey) {
                    this.sumRes.p4_4[div][divName][resVal] = {
                        team_idx: this.teamInfo[divName + '_idx'],
                        team_name: this.teamInfo[divName + '_name'],
                        goal: [],
                        lose: [],
                        shots: [],
                        shots_on: [],
                        possession: [],
                        free_kicks: [],
                        corner_kicks: []
                    }
                }
            }
        }

        var H = this.sumRes.p4_4.home[divName];
        var A = this.sumRes.p4_4.away[divName];

        var res = {};

        for(var resVal of resKey) {
            res[resVal] = {
                team_idx: H[resVal].team_idx !== undefined ? H[resVal].team_idx : A[resVal].team_idx,
                team_name: H[resVal].team_name !== undefined ? H[resVal].team_name : A[resVal].team_name,
                goal: [],
                lose: [],
                shots: [],
                shots_on: [],
                possession: [],
                free_kicks: [],
                corner_kicks: []
            }
        }

        for(var resVal of resKey){
            for(var techKey in H[resVal]){
                if(typeof res[resVal][techKey] == 'object'){
                    res[resVal][techKey] = H[resVal][techKey].concat(A[resVal][techKey]);
                }
            }
        }

        for(var resVal of resKey){
            for(var techKey in res[resVal]){
                if(typeof res[resVal][techKey] == 'object'){
                    res[resVal][techKey] = res[resVal][techKey].filter(function (item) {
                        return item !== null;
                    });
                    var len = res[resVal][techKey].length;
                    var sum = 0;
                    for(var val of res[resVal][techKey]){
                        sum += Number(val) ;
                    }
                    res[resVal][techKey+'_avg'] = this._okRound(sum, len, 2);
                }
            }
        }

        this.sumRes.p4_4.total[divName] = res;
    }
    set setP4_4_per(name){
        var divHome = this.sumRes.p4_4[name].div_home;
        var divAway = this.sumRes.p4_4[name].div_away;
        var resKey = ['W','D','L'];

        for(var resVal of resKey){
            for(var techKey in divHome[resVal]){
                if(techKey == 'goal_avg' || techKey == 'lose_avg' || techKey == 'shots_avg' || techKey == 'shots_on_avg' || techKey == 'possession_avg' || techKey == 'free_kicks_avg' || techKey == 'corner_kicks_avg') {
                    var perName = techKey.substr(-0, techKey.length-3) + 'per';
                    divHome[resVal][perName] = this._okRound(divHome[resVal][techKey], divHome[resVal][techKey] + divAway[resVal][techKey], 0, '%');
                    divAway[resVal][perName] = this._okRound(divAway[resVal][techKey], divHome[resVal][techKey] + divAway[resVal][techKey], 0, '%');
                }
            }
        }

        this.sumRes.p4_4[name].div_home = divHome;
        this.sumRes.p4_4[name].div_away = divAway;
    }
    set resP4_4_d1(D){
        var sumData = this.sumRes.p4_4[D.name][D.divName] ;

        this.res.p4_4.d1[D.name][D.divName] = {
            team_idx : sumData.W.team_idx,
            team_name : sumData.W.team_name,
            goal_avg : sumData.W.goal_avg ,
            lose_avg : sumData.W.lose_avg ,
            shots_avg : sumData.W.shots_avg ,
            shots_on_avg : sumData.W.shots_on_avg ,
            possession_avg : sumData.W.possession_avg ,
            free_kicks_avg : sumData.W.free_kicks_avg ,
            corner_kicks_avg : sumData.W.corner_kicks_avg ,
            goal_per : sumData.W.goal_per ,
            lose_per : sumData.W.lose_per ,
            shots_per : sumData.W.shots_per ,
            shots_on_per : sumData.W.shots_on_per ,
            possession_per : sumData.W.possession_per ,
            free_kicks_per : sumData.W.free_kicks_per ,
            corner_kicks_per : sumData.W.corner_kicks_per ,
        }
    }

    set resP4_4_d2(D){
        var sumData = this.sumRes.p4_4[D.name][D.divName] ;

        this.res.p4_4.d2[D.name][D.divName] = {
            team_idx : sumData.D.team_idx,
            team_name : sumData.D.team_name,
            goal_avg : sumData.D.goal_avg ,
            lose_avg : sumData.D.lose_avg ,
            shots_avg : sumData.D.shots_avg ,
            shots_on_avg : sumData.D.shots_on_avg ,
            possession_avg : sumData.D.possession_avg ,
            free_kicks_avg : sumData.D.free_kicks_avg ,
            corner_kicks_avg : sumData.D.corner_kicks_avg ,
            goal_per : sumData.D.goal_per ,
            lose_per : sumData.D.lose_per ,
            shots_per : sumData.D.shots_per ,
            shots_on_per : sumData.D.shots_on_per ,
            possession_per : sumData.D.possession_per ,
            free_kicks_per : sumData.D.free_kicks_per ,
            corner_kicks_per : sumData.D.corner_kicks_per ,
        }
    }
    set resP4_4_d3(D){
        var sumData = this.sumRes.p4_4[D.name][D.divName] ;

        this.res.p4_4.d3[D.name][D.divName]=  {
            team_idx : sumData.L.team_idx,
            team_name : sumData.L.team_name,
            goal_avg : sumData.L.goal_avg ,
            lose_avg : sumData.L.lose_avg ,
            shots_avg : sumData.L.shots_avg ,
            shots_on_avg : sumData.L.shots_on_avg ,
            possession_avg : sumData.L.possession_avg ,
            free_kicks_avg : sumData.L.free_kicks_avg ,
            corner_kicks_avg : sumData.L.corner_kicks_avg ,
            goal_per : sumData.L.goal_per ,
            lose_per : sumData.L.lose_per ,
            shots_per : sumData.L.shots_per ,
            shots_on_per : sumData.L.shots_on_per ,
            possession_per : sumData.L.possession_per ,
            free_kicks_per : sumData.L.free_kicks_per ,
            corner_kicks_per : sumData.L.corner_kicks_per ,
        }
    }

    set setP4_5(D){
        var sumData = this.sumRes.p4_5[D.pageData.team_div]['div_' + D.divName];

        if(Object.keys(sumData).length === 0){
            var keyObj = {
                team_idx: D.pageData.team_idx,
                team_name: D.pageData.team_name,
                games : 0,
                goal: [],
                lose: [],
                shots: [],
                shots_on: [],
                possession: [],
                free_kicks: [],
                corner_kicks: [],
                game_idx_arr : [],
            };

            sumData = {
                gab_0 : JSON.parse(JSON.stringify(keyObj)),
                gab_1 : JSON.parse(JSON.stringify(keyObj)),
                gab_2 : JSON.parse(JSON.stringify(keyObj)),
                gab_3 : JSON.parse(JSON.stringify(keyObj)),
                gab_4 : JSON.parse(JSON.stringify(keyObj)),
                gab_5 : JSON.parse(JSON.stringify(keyObj)),
                gab_6_over : JSON.parse(JSON.stringify(keyObj)),
            }
        }

        var gab = D.pageData.gab === undefined ? 0 : Number(D.pageData.gab);
        var gab = gab > 5 ? '6_over' : gab ;


        sumData['gab_'+gab].games += 1;
        sumData['gab_'+gab].goal.push(D.pageData.goal);
        sumData['gab_'+gab].lose.push(D.pageData.lose);
        sumData['gab_'+gab].shots.push(D.pageData.shots);
        sumData['gab_'+gab].shots_on.push(D.pageData.shots_on);
        sumData['gab_'+gab].possession.push(D.pageData.possession);
        sumData['gab_'+gab].free_kicks.push(D.pageData.free_kicks);
        sumData['gab_'+gab].corner_kicks.push(D.pageData.corner_kicks);
        sumData['gab_'+gab].game_idx_arr.push(D.pageData.game_idx);

        this.sumRes.p4_5[D.pageData.team_div]['div_' + D.divName] = sumData;
    }
    set setP4_5_total(divName){
        var divKey = ['home','away'];
        var gabKey = ['gab_0','gab_1','gab_2','gab_3','gab_4','gab_5','gab_6_over'];

        for(var div of divKey){
            if(Object.keys(this.sumRes.p4_5[div][divName]).length === 0){
                for(var gabVal of gabKey) {
                    this.sumRes.p4_5[div][divName][gabVal] = {
                        team_idx: this.teamInfo[divName + '_idx'],
                        team_name: this.teamInfo[divName + '_name'],
                        games : 0,
                        goal: [],
                        lose: [],
                        shots: [],
                        shots_on: [],
                        possession: [],
                        free_kicks: [],
                        corner_kicks: []
                    }
                }
            }
        }

        var H = this.sumRes.p4_5.home[divName];
        var A = this.sumRes.p4_5.away[divName];
        var res = {};
        for(var gabVal of gabKey) {
            res[gabVal] = {
                team_idx: H[gabVal].team_idx !== undefined ? H[gabVal].team_idx : A[gabVal].team_idx,
                team_name: H[gabVal].team_name !== undefined ? H[gabVal].team_name : A[gabVal].team_name,
                games : H[gabVal].games + A[gabVal].games,
                goal: [],
                lose: [],
                shots: [],
                shots_on: [],
                possession: [],
                free_kicks: [],
                corner_kicks: []
            }
        }
        for(var gabVal in res){
            for(var techKey in H[gabVal]){
                if(typeof res[gabVal][techKey] == 'object'){
                    res[gabVal][techKey] = H[gabVal][techKey].concat(A[gabVal][techKey]);
                }
            }
        }


        for(var gabVal of gabKey){
            for(var techKey in res[gabVal]){
                if(typeof res[gabVal][techKey] == 'object'){
                    res[gabVal][techKey] = res[gabVal][techKey].filter(function (item) {
                        return item !== null;
                    });
                    var len = res[gabVal][techKey].length;
                    var sum = 0;
                    for(var val of res[gabVal][techKey]){
                        sum += Number(val) ;
                    }
                    res[gabVal][techKey+'_avg'] = this._okRound(sum, len, 2);
                }
            }
        }

        this.sumRes.p4_5.total[divName] = res;
    }
    set setP4_5_avg(D){
        var sumData = this.sumRes.p4_5[D.name][D.divName];
        //console.log(sumData);
        var gabKey = ['gab_0','gab_1','gab_2','gab_3','gab_4','gab_5','gab_6_over'];
        var res = {};
        for(var gabVal of gabKey) {
            res[gabVal] = {
                team_idx: sumData[gabVal].team_idx !== undefined ? sumData[gabVal].team_idx : sumData[gabVal].team_idx,
                team_name: sumData[gabVal].team_name !== undefined ? sumData[gabVal].team_name : sumData[gabVal].team_name,
                games : sumData[gabVal].games,
                goal: sumData[gabVal].goal,
                lose: sumData[gabVal].lose,
                shots: sumData[gabVal].shots,
                shots_on: sumData[gabVal].shots_on,
                possession: sumData[gabVal].possession,
                free_kicks: sumData[gabVal].free_kicks,
                corner_kicks: sumData[gabVal].corner_kicks
            }
        }

        for(var gabVal of gabKey){
            for(var techKey in sumData[gabVal]){
                if(typeof sumData[gabVal][techKey] == 'object' && techKey != 'game_idx_arr'){
                    sumData[gabVal][techKey] = sumData[gabVal][techKey].filter(function (item) {
                        return item !== null;
                    });
                    var len = sumData[gabVal][techKey].length;
                    var sum = 0;
                    for(var val of sumData[gabVal][techKey]){
                        sum += Number(val) ;
                    }
                    res[gabVal][techKey+'_avg'] = this._okRound(sum, len, 2);
                }
            }
        }

        this.sumRes.p4_5[D.name][D.divName] = res;
    }
    set resP4_5_d1(D){
        var sumData = this.sumRes.p4_5[D.name][D.divName] ;
        var resKey = ['team_idx','team_name','games','goal_avg','lose_avg','shots_avg','shots_on_avg','possession_avg','free_kicks_avg','corner_kicks_avg'];

        for(var gabKey in sumData){
            if(gabKey != 'gab_0' && gabKey != 'gab_1') {
                this.res.p4_5.d1[D.name][D.divName][gabKey] = {};
                for (var resVal of resKey) {
                    this.res.p4_5.d1[D.name][D.divName][gabKey][resVal] = sumData[gabKey][resVal];
                }
            }
        }
    }

    get _sumResKey() {
        return {
            p4_1: this._divKey,
            p4_2: this._divKey,
            p4_3: this._divKey,
            p4_4: this._reverseTotalKey,
            p4_5: this._reverseTotalKey,
        }
    }

    get _resKey() {
        return {
            p4_1: {
                d1: this._divKey,
                d2: this._divKey,
            },
            p4_2: {
                d1: this._divKey,
                d2: this._divKey,
            },
            p4_3: {
                d1: this._divKey,
            },
            p4_4: {
                d1: this._reverseTotalKey,
                d2: this._reverseTotalKey,
                d3: this._reverseTotalKey,
            },
            p4_5: {
                d1: this._reverseTotalKey,
            },
        }
    }

    get _divKey(){
        return {
            div_home: {},
            div_away: {}
        }
    }

    get _totalKey() {
        return {
            div_home: {
                home: {},
                away: {},
                total: {}
            },
            div_away: {
                home: {},
                away: {},
                total: {}
            }
        }
    }

    get _reverseTotalKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            },
            total: {
                div_home: {},
                div_away: {}
            }
        };
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }
}

class DetailPageFour {
    constructor(originData, divTeamIdx) {
        this.res = {
            p4_1_formation : {},
            p4_2_player_change : {},
            p4_3_card_count : {},
            p4_4_result_diff : {},
            p4_5_rest_day_diff : {}
        }

        this.configData = {};
        this.techStats = {};
        this.keyEvent = {};
        this.lineUp = {};

        if (originData.config.home_team_idx == divTeamIdx) {
            var teamDiv = {main: 'home', sub: 'away'};
        } else if (originData.config.away_team_idx == divTeamIdx) {
            var teamDiv = {main: 'away', sub: 'home'};
        }

        this.setConfigData(originData, teamDiv);
        if (originData.key_event.length != 0 && originData.key_event.length !== undefined) {
            this.setKeyEvent(originData, teamDiv);
            this.setlineUp(originData, teamDiv);
        }
        if (originData.tech_statistics !== undefined && Object.keys(originData.tech_statistics).length != 0) {
            this.setTechStats(originData, teamDiv);
        }

        this.res = this.getPageData;
        //console.log(this.res.p4_2_player_change)
    }

    get getPageData(){
        return {
            p4_1_formation : this.getP4_1,
            p4_2_player_change : this.getP4_2,
            p4_3_card_count : this.getP4_3,
            p4_4_result_diff : this.getP4_4,
            p4_5_rest_day_diff : this.getP4_5,
        }
    }
    get getP4_1(){
        return {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            goal : this.configData.goal,
            lose : this.configData.lose,
            formation : this.configData.formation ,
            formation_opposition : this.configData.formation_opposition,
            formation_division : this.lineUp.main !== undefined ? this.lineUp.main : [],
            formation_sub : this.lineUp.sub,
            W : this.configData.W,
            D : this.configData.D,
            L : this.configData.L,
        }
    }
    get getP4_2(){
        return {
            game_idx : this.configData.game_idx,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            sub_goal_1 : this.keyEvent.sub_goal_1,
            sub_goal_2 : this.keyEvent.sub_goal_2,
            sub_goal_3 : this.keyEvent.sub_goal_3,
            sub_cnt : this.keyEvent.sub_cnt,
            sub_lose_1 : this.keyEvent.sub_lose_1,
            sub_lose_2 : this.keyEvent.sub_lose_2,
            sub_lose_3 : this.keyEvent.sub_lose_3,
            sub_time_1 : this.keyEvent.sub_time_1,
            sub_time_2 : this.keyEvent.sub_time_2,
            sub_time_3 : this.keyEvent.sub_time_3,
            no_sub : this.keyEvent.no_sub,
        }
    }
    get getP4_3(){
        return {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            red : this.keyEvent.red !== undefined ? this.keyEvent.red : null,
            red_permit : this.keyEvent.red_permit !== undefined ? this.keyEvent.red_permit : null,
            yellow : this.keyEvent.yellow !== undefined ? this.keyEvent.yellow : null,
            yellow_permit : this.keyEvent.yellow_permit !== undefined ? this.keyEvent.yellow_permit : null,
        }
    }
    get getP4_4(){
        return {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal : this.configData.goal,
            lose : this.configData.lose,
            shots: this.techStats.shots,
            shots_on: this.techStats.shots_on,
            possession : this.techStats.possession,
            free_kicks: this.techStats.free_kicks,
            corner_kicks: this.techStats.corner_kicks,
            team_res : this.configData.team_res,
        }
    }
    get getP4_5(){
        return {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal : this.configData.goal,
            lose : this.configData.lose,
            shots: this.techStats.shots,
            shots_on: this.techStats.shots_on,
            possession : this.techStats.possession,
            free_kicks: this.techStats.free_kicks,
            corner_kicks: this.techStats.corner_kicks,
            gab : this.configData.gab,
        }
    }

    setConfigData(originData, teamDiv) {
        var config = originData.config;
        var teamResData = this._teamResData(originData, teamDiv);
        var goal = config[teamDiv.main + '_goal'] != '' ? config[teamDiv.main + '_goal'] : null;
        var lose = config[teamDiv.sub + '_goal'] != '' ? config[teamDiv.sub + '_goal'] : null;

        this.configData = {
            game_idx: config.game_idx,
            game_start_time : config.game_date.substr(5,8),
            division_day : config.game_date.substr(5,8),
            team_div: teamDiv.main,
            team_name: config[teamDiv.main + '_name'],
            team_idx: config[teamDiv.main + '_team_idx'],
            league_idx: config.league_idx,
            league_name: config.league_name,
            league_color: config.league_color,
            goal: Number(goal),
            lose: Number(lose),
            goal_half: config[teamDiv.main + '_goal_half'] !== '' ? config[teamDiv.main + '_goal_half'] : null,
            lose_half: config[teamDiv.sub + '_goal_half'] !== '' ? config[teamDiv.sub + '_goal_half'] : null,
            score: config.home_goal + '-' + config.away_goal,
            goal_diff: teamResData.team_diff,
            W: teamResData.W,
            D: teamResData.D,
            L: teamResData.L,
            formation : config[teamDiv.main + '_forma'] !== '' ? config[teamDiv.main + '_forma'] : null,
            formation_opposition : config[teamDiv.sub + '_forma'] !== '' ? config[teamDiv.sub + '_forma'] : null,
            gab : config.gab,

            team_res : teamResData.team_res ,
            team_point : teamResData.team_point ,
        }
    }

    setKeyEvent(originData, teamDiv) {
        var keyEvent = originData.key_event;
        var mainPlayerSub = [];
        var subPlayerSub = [];
        var subTime = [];
        var subResult = {
            goal: {},
            lose: {}
        }
        var subArr = [];
        var cards ={
            yellow : 0,
            yellow_permit : 0,
            red : 0 ,
            red_permit : 0,
        }

        for(var keyData of keyEvent){
            if(keyData.event_name === 'Sub' ){
                if(keyData.team_div == teamDiv.main) {
                    subTime.push({ sub : keyData.time });
                    subArr.push(keyData.time);
                }
            }
            if(keyData.event_name === 'Goal' || keyData.event_name === 'Penalty scored' || keyData.event_name === 'Own goal' ){
                if(keyData.team_div == teamDiv.main) {
                    subTime.push({ goal : keyData.time});
                }else {
                    subTime.push({ lose : keyData.time});
                }
            }
            if(keyData.event_name === 'Yellow Card'){
                if(keyData.team_div == teamDiv.main) {
                    cards.yellow = cards.yellow + 1;
                }else {
                    cards.yellow_permit = cards.yellow_permit + 1;
                }
            }
            if(keyData.event_name === 'Red Card'){
                if(keyData.team_div == teamDiv.main) {
                    cards.red = cards.red + 1;
                }else {
                    cards.red_permit = cards.red_permit + 1;
                }
            }

        }

        for(var subKey in subTime){
            if(subTime[subKey].hasOwnProperty('sub')){
                var arrClone = subTime.slice(subKey, subTime.length);
                var goalObj = [];
                var loseObj = [];

                for(var cloneVal of arrClone){
                    if(cloneVal.hasOwnProperty('goal') ){
                        goalObj.push(cloneVal.goal);
                    }else if(cloneVal.hasOwnProperty('lose')) {
                        loseObj.push(cloneVal.lose);
                    }
                }

                var goalNum =  Object.keys(subResult.goal).length + 1;
                var loseNum =  Object.keys(subResult.lose).length + 1;
                subResult.goal['sub_' + goalNum] = goalObj.slice();
                subResult.lose['sub_' + loseNum] = loseObj.slice();
            }
        }

        this.keyEvent = {
            sub_goal_1 : subResult.goal.sub_1 !== undefined ? subResult.goal.sub_1.length : null,
            sub_goal_2 : subResult.goal.sub_2 !== undefined ? subResult.goal.sub_2.length : null,
            sub_goal_3 : subResult.goal.sub_3 !== undefined ? subResult.goal.sub_3.length : null,
            sub_cnt : Object.keys(subResult.goal).length,
            sub_lose_1 : subResult.lose.sub_1 !== undefined ? subResult.lose.sub_1.length : null,
            sub_lose_2 : subResult.lose.sub_2 !== undefined ? subResult.lose.sub_2.length : null,
            sub_lose_3 : subResult.lose.sub_3 !== undefined ? subResult.lose.sub_3.length : null,
            sub_time_1 : subArr[0] !== undefined ? Number(subArr[0]) : null,
            sub_time_2 : subArr[1] !== undefined ? Number(subArr[1]) : null,
            sub_time_3 : subArr[2] !== undefined ? Number(subArr[2]) : null,
            no_sub : Object.keys(subResult.goal).length === 0 ? true : false,
            yellow : cards.yellow,
            yellow_permit : cards.yellow_permit,
            red : cards.red,
            red_permit : cards.red_permit,

        }
    }

    setlineUp(originData, teamDiv){
        var lineUp = originData.line_up;

        if(lineUp !== undefined){
            this.lineUp = {
                main : lineUp.match[teamDiv.main],
                sub : lineUp.sub[teamDiv.main],
                opposition : lineUp.match[teamDiv.sub],
                match : {
                    home : lineUp.match.home,
                    away : lineUp.match.away,
                },
                match_sub : {
                    home : lineUp.sub.home,
                    away : lineUp.sub.away,
                },
            }
        }
    }

    setTechStats(originData, teamDiv) {
        var techMain = originData.tech_statistics[teamDiv.main];
        var possession = techMain.possession !== null ? techMain.possession.split('%')[0] : null;

        this.techStats = {
            possession: possession,
            shots: techMain.shots,
            shots_on: techMain.shots_on_goal,
            free_kicks : techMain.free_kicks,
            corner_kicks : techMain.corner_kicks,
        }
    }

    getDetailPageFour(){
        return this.res;
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

    _teamResData(originData, teamDiv) {
        var data = originData.config;
        var team_diff = null;
        var W = 0;
        var D = 0;
        var L = 0;
        var team_point = null;
        var team_res = null;

        if (data[teamDiv.main + '_goal'] !== '' && data[teamDiv.sub + '_goal'] !== '') {
            team_diff = Number(data[teamDiv.main + '_goal']) - Number(data[teamDiv.sub + '_goal']);

            if (data[teamDiv.main + '_goal'] < data[teamDiv.sub + '_goal']) {
                L = 1;
                team_point = 0;
                team_res = 'L';
            } else if (data[teamDiv.main + '_goal'] > data[teamDiv.sub + '_goal']) {
                W = 1;
                team_point = 3;
                team_res = 'W';
            } else if (data[teamDiv.main + '_goal'] == data[teamDiv.sub + '_goal']) {
                D = 1;
                team_point  = 1;
                team_res = 'D';
            }
        }
        return {
            team_diff: team_diff,
            W: W,
            D: D,
            L: L,
            team_point : team_point,
            team_res : team_res,
        }
    }

    _halfFullGoal(event, teamDiv) {
        var firstHalfGoal = 0;
        var firstHalfLose = 0;
        var secondHalfGoal = 0;
        var secondHalfLose = 0;

        if (event.team_div == teamDiv.main) {
            if (event.time <= 45) {
                firstHalfGoal = 1;
            } else if (event.time > 45) {
                secondHalfGoal = 1;
            }
        } else if (event.team_div == teamDiv.sub) {
            if (event.time <= 45) {
                firstHalfLose = 1;
            } else if (event.time > 45) {
                secondHalfLose = 1;
            }
        }

        return {
            firstHalfGoal: firstHalfGoal,
            firstHalfLose: firstHalfLose,
            secondHalfGoal: secondHalfGoal,
            secondHalfLose: secondHalfLose,
        }
    }
}

class DetailPageThreeSum {
    constructor(resData, teamInfo, oppoData){
        this.teamInfo = teamInfo;
        this.resData = resData;
        this.oppoData = oppoData;
        this.sumRes = this._sumResKey;
        this.res = this._resKey;

        //console.log(this.sumRes);
    }

    setResDataPart_1(divData, pageData, divName){
        var pageData = divData[pageData];
        this.setP3_1 = {pageData : pageData.p3_1_avg_goal_diff, divName : divName};
        this.setP3_2 = this.oppoData;
        this.setP3_3 = {pageData : pageData.p3_3_goal_diff_margin, divName : divName};
        this.setP3_4 = {pageData : pageData.p3_4_recent_trend, divName : divName};
        this.setP3_5 = {pageData : pageData.p3_5_goalkeeper_record, divName : divName};
    }

    setResDataPart_2(pageData){
        //console.log(this.sumRes.p3_1);
        //console.log(this.sumRes.p3_3);
        this.setP3_4_recent = this.resData;
        //console.log(this.recent);

        //console.log(this.sumRes.p3_1);
    }

    setResDataPart_3(divName){
        this.setP3_1_total = divName;
        this.setP3_3_total = divName;
        this.setP3_4_total = divName;
        this.setP3_5_total = divName;
    }

    setResDataPart_4(divName, name){
        this.setP3_1_avg = {divName : divName, name : name};
        this.setP3_3_avg = {divName : divName, name : name};
        this.setP3_4_avg = {divName : divName, name : name};

    }

    setResDataPart_5(divName, name){
        this.resP3_1_d1 = {divName : divName , name : name};
        this.resP3_1_d2 = {divName : divName , name : name};
        this.resP3_1_d3 = {divName : divName , name : name};

        this.resP3_2_d1 = {divName : divName , name : name};
        this.resP3_2_d2 = {divName : divName , name : name};

        this.resP3_3_d1 = {divName : divName , name : name};
        this.resP3_3_d2 = {divName : divName , name : name};

        this.resP3_4_d1 = {divName : divName , name : name};
        this.resP3_4_d2 = {divName : divName , name : name};
        this.resP3_4_d3 = {divName : divName , name : name};
        this.resP3_4_d4 = {divName : divName , name : name};

        this.resP3_5_d1 = {divName : divName , name : name};
        this.resP3_5_d2 = {divName : divName , name : name};
    }

    setResDataPart_6(name) {
        this.resP3_4_d3_per = name;
        this.resP3_4_d4_per = name;
    }
    setResDataPart_7(){
        this.setP3_5_per = '';
    }

    set resP3_4_d3_per(name){
        var divHome = this.res.p3_4.d3[name].div_home;
        var divAway = this.res.p3_4.d3[name].div_away;
        var goalLen = Math.abs(divHome.goal_avg_diff) + Math.abs(divAway.goal_avg_diff) ;
        var loseLen = Math.abs(divHome.lose_avg_diff) + Math.abs(divAway.lose_avg_diff) ;

        this.res.p3_4.d3[name].div_home.goal_avg_per = this._okRound(Math.abs(divHome.goal_avg_diff).toFixed(3), goalLen, 0, '%');
        this.res.p3_4.d3[name].div_away.goal_avg_per = this._okRound(Math.abs(divAway.goal_avg_diff).toFixed(3), goalLen, 0, '%');
        this.res.p3_4.d3[name].div_home.lose_avg_per = this._okRound(Math.abs(divHome.lose_avg_diff).toFixed(3), loseLen, 0, '%');
        this.res.p3_4.d3[name].div_away.lose_avg_per = this._okRound(Math.abs(divAway.lose_avg_diff).toFixed(3), loseLen, 0, '%');
    }

    set resP3_4_d4_per(name){
        var divHome = this.res.p3_4.d4[name].div_home;
        var divAway = this.res.p3_4.d4[name].div_away;
        var shotsLen = Math.abs(divHome.shots_avg_diff) + Math.abs(divAway.shots_avg_diff) ;
        var shotsOnLen = Math.abs(divHome.shots_on_avg_diff) + Math.abs(divAway.shots_on_avg_diff) ;

        this.res.p3_4.d4[name].div_home.shots_avg_per = this._okRound(Math.abs(divHome.shots_avg_diff).toFixed(3), shotsLen, 0, '%');
        this.res.p3_4.d4[name].div_away.shots_avg_per = this._okRound(Math.abs(divAway.shots_avg_diff).toFixed(3), shotsLen, 0, '%');
        this.res.p3_4.d4[name].div_home.shots_on_avg_per = this._okRound(Math.abs(divHome.shots_on_avg_diff).toFixed(3), shotsOnLen, 0, '%');
        this.res.p3_4.d4[name].div_away.shots_on_avg_per = this._okRound(Math.abs(divAway.shots_on_avg_diff).toFixed(3), shotsOnLen, 0, '%');
    }
    getRes(){
        return this.res ;
    }

    set setP3_1(D){
        var sumData = this.sumRes.p3_1[D.pageData.team_div]['div_' + D.divName];
        //console.log(sumData);
        var res = {
            team_idx: D.pageData.team_idx,
            team_name: D.pageData.team_name,
            team_div: D.pageData.team_div,
        };

        if(Object.keys(sumData).length == 0){
            sumData.games = 0;
            sumData.goal = 0;
            sumData.goalArr = [];
            sumData.lose = 0;
            sumData.loseArr = [];
            sumData.goal_diff = 0;
            sumData.first_half_goal = 0;
            sumData.first_half_lose = 0;
            sumData.second_half_goal = 0;
            sumData.second_half_lose = 0;
        }
        sumData.goalArr.push(Number(D.pageData.goal));
        sumData.loseArr.push(Number(D.pageData.lose));

        res.games = 1 + sumData.games;
        res.goal = Number(D.pageData.goal) + sumData.goal;
        res.goalArr = sumData.goalArr;
        res.lose = Number(D.pageData.lose) + sumData.lose;
        res.loseArr = sumData.loseArr;
        res.goal_diff = Number(D.pageData.goal_diff) + sumData.goal_diff;
        res.first_half_goal = Number(D.pageData.first_half_goal) + sumData.first_half_goal;
        res.first_half_lose = Number(D.pageData.first_half_lose) + sumData.first_half_lose;
        res.second_half_goal = Number(D.pageData.second_half_goal) + sumData.second_half_goal;
        res.second_half_lose = Number(D.pageData.second_half_lose) + sumData.second_half_lose;

        this.sumRes.p3_1[D.pageData.team_div]['div_' + D.divName] = res;
    }
    set setP3_1_total(divName){
        var H = this.sumRes.p3_1.home[divName];
        var A = this.sumRes.p3_1.away[divName];
        for(var teamKey of ['home','away']){
            if(Object.keys(this.sumRes.p3_1[teamKey][divName]).length === 0){
                this.sumRes.p3_1[teamKey][divName] = {
                    team_idx: this.teamInfo[divName+'_idx'],
                    team_name: this.teamInfo[divName+'_name'],
                    team_div: teamKey,
                    games: 0,
                    goal: 0,
                    goalArr: [],
                    lose: 0,
                    loseArr: [],
                    goal_diff: 0,
                    first_half_goal: 0,
                    first_half_lose: 0,
                    second_half_goal: 0,
                    second_half_lose: 0,
                }
            }
        }


        var homeGames = H.games !== undefined ? Number(H.games) : 0;
        var awayGames = A.games !== undefined ? Number(A.games) : 0;
        var games = homeGames + awayGames;
        var homeGoal = H.goal !== undefined ? Number(H.goal) : 0;
        var awayGoal = A.goal !== undefined ? Number(A.goal) : 0;
        var goal = homeGoal + awayGoal;
        var homeLose = H.lose !== undefined ? Number(H.lose) : 0;
        var awayLose = A.lose !== undefined ? Number(A.lose) : 0;
        var lose = homeLose + awayLose;
        var homeDiff = H.goal_diff !== undefined ? Number(H.goal_diff) : 0;
        var awayDiff = A.goal_diff !== undefined ? Number(A.goal_diff) : 0;
        var goalDiff = homeDiff + awayDiff;
        var homeGoalArr = H.goalArr === undefined ? [] : H.goalArr;
        var homeLoseArr = H.loseArr === undefined ? [] : H.loseArr;
        var awayGoalArr = A.goalArr === undefined ? [] : A.goalArr;
        var awayLoseArr = A.loseArr === undefined ? [] : A.loseArr;
        var goalLoseArr = {
            goalCnt : homeGoalArr.concat(awayGoalArr),
            loseCnt : homeLoseArr.concat(awayLoseArr),
        }
        var goalArr = homeGoalArr.concat(awayGoalArr) ;
        var loseArr = homeLoseArr.concat(awayLoseArr) ;
        var keyArr = ['goal', 'lose'];
        var numKeyArr = ['num_0','num_1','num_2','num_3','num_4_over','num_0_1','num_2_3'];
        var cnt = {goalCnt : {}, loseCnt : {}} ;
        for(var val in cnt){
            for(var numKey of numKeyArr){
                cnt[val][numKey] = 0;
            }
        }

        for(var keyVal in cnt) {
            for (var numVal of goalLoseArr[keyVal]) {
                var num = this._numberCnt(numVal);
                for(var numKey of numKeyArr){
                    if(numKey == 'num_0_1'){
                        cnt[keyVal][numKey] = num.num_0 + num.num_1 + cnt[keyVal][numKey];
                    }else if(numKey == 'num_2_3'){
                        cnt[keyVal][numKey] = num.num_2 + num.num_3 + cnt[keyVal][numKey];
                    }else {
                        cnt[keyVal][numKey] = num[numKey] + cnt[keyVal][numKey];
                    }
                }
            }
        }
        var res = {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
            games : games,
            goal : goal,
            goal_avg : this._okRound(Number(goal), Number(games), 2),
            goalArr : homeGoalArr.concat(awayGoalArr),
            lose : lose,
            lose_avg : this._okRound(Number(lose), Number(games), 2),
            loseArr : homeLoseArr.concat(awayLoseArr),
            goal_diff : homeDiff + awayDiff,
            goal_diff_avg : this._okRound(Number(goalDiff), Number(games), 2),
            first_half_goal : this._is_undef(H.first_half_goal) + this._is_undef(A.first_half_goal),
            first_half_lose : this._is_undef(H.first_half_lose) + this._is_undef(A.first_half_lose),
            second_half_goal : this._is_undef(H.second_half_goal) + this._is_undef(A.second_half_goal),
            second_half_lose : this._is_undef(H.second_half_lose) + this._is_undef(A.second_half_lose),
        }

        res = Object.assign(res, cnt);

        this.sumRes.p3_1.total[divName] = res;
    }

    _is_undef(data){
        if(data === undefined){
            return 0 ;
        }else {
            return data;
        }
    }

    set setP3_1_avg(D){
        var sumData = this.sumRes.p3_1[D.name][D.divName];
        var keyArr = ['goal', 'lose'];
        var numKeyArr = ['num_0','num_1','num_2','num_3','num_4_over','num_0_1','num_2_3'];
        var cnt = {} ;
        for(var val of keyArr){
            cnt[val+'Cnt'] = {};
            for(var numKey of numKeyArr){
                cnt[val+'Cnt'][numKey] =  0;
            }
        }

        for(var keyVal of keyArr) {
            var keyValName = keyVal + 'Cnt';
            sumData[keyVal+'Arr'] = sumData[keyVal+'Arr'] === undefined ? [] : sumData[keyVal+'Arr'];
            for (var numVal of sumData[keyVal+'Arr']) {
                var num = this._numberCnt(numVal);
                for(var numKey of numKeyArr){
                    if(numKey == 'num_0_1'){
                        cnt[keyValName][numKey] = num.num_0 + num.num_1 + cnt[keyValName][numKey];
                    }else if(numKey == 'num_2_3'){
                        cnt[keyValName][numKey] = num.num_2 + num.num_3 + cnt[keyValName][numKey];
                    }else {
                        cnt[keyValName][numKey] = num[numKey] + cnt[keyValName][numKey];
                    }
                }
            }
        }

        var dataAvg = {
            goal_avg : this._okRound(sumData.goal, sumData.games, 2),
            lose_avg : this._okRound(sumData.lose, sumData.games, 2),
            goal_diff_avg : this._okRound(sumData.goal_diff, sumData.games, 2),
        }

        var res = Object.assign(sumData, cnt);
        var res = Object.assign(res, dataAvg);

        this.sumRes.p3_1[D.name][D.divName] = res;
    }
    set resP3_1_d1(D){
        var sumData = this.sumRes.p3_1[D.name][D.divName] ;

        this.res.p3_1.d1[D.divName][D.name] = {
            team_idx : this.teamInfo[D.divName+'_idx'],
            team_name : this.teamInfo[D.divName+'_name'],
            goal_avg : Number(sumData.goal_avg),
            lose_avg : Number(sumData.lose_avg),
            goal_diff_avg : Number(sumData.goal_diff_avg),
        }
    }
    set resP3_1_d2(D){
        var sumData = this.sumRes.p3_1[D.name][D.divName] ;

        this.res.p3_1.d2[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            goal_avg : sumData.goal_avg,
            goal_0 : sumData.goalCnt.num_0,
            goal_1 : sumData.goalCnt.num_1,
            goal_2 : sumData.goalCnt.num_2,
            goal_3 : sumData.goalCnt.num_3,
            goal_4_over : sumData.goalCnt.num_4_over,
            lose_avg : sumData.lose_avg,
            lose_0 : sumData.loseCnt.num_0,
            lose_1 : sumData.loseCnt.num_1,
            lose_2 : sumData.loseCnt.num_2,
            lose_3 : sumData.loseCnt.num_3,
            lose_4_over : sumData.loseCnt.num_4_over,
        }
    }
    set resP3_1_d3(D){
        var sumData = this.sumRes.p3_1[D.name][D.divName] ;

        this.res.p3_1.d3[D.name][D.divName]= {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            goal_avg : sumData.goal_avg,
            goal_0_1 : sumData.goalCnt.num_0_1,
            goal_2_3 : sumData.goalCnt.num_2_3,
            goal_4_over : sumData.goalCnt.num_4_over,
            first_half_goal : sumData.first_half_goal,
            second_half_goal : sumData.second_half_goal,
            lose_avg : sumData.lose_avg,
            lose_0_1 : sumData.loseCnt.num_0_1,
            lose_2_3 : sumData.loseCnt.num_2_3,
            lose_4_over : sumData.loseCnt.num_4_over,
            first_half_lose : sumData.first_half_lose,
            second_half_lose : sumData.second_half_lose,
        }
    }

    set setP3_2(D){
        this.sumRes.p3_2 = D;
    }
    set setP3_2_total(D){

    }
    set resP3_2_d1(D){
        if(this.sumRes.p3_2 !== null) {
            var sumData = this.sumRes.p3_2[D.name][D.divName];

            this.res.p3_2.d1[D.name][D.divName] = {
                team_idx: sumData.team_idx,
                team_name: sumData.team_name,
                goal: sumData.goal,
                goal_avg: sumData.goal_avg,
                lose_avg: sumData.lose_avg,
            }
        }else {
            this.res.p3_2.d1[D.name][D.divName] = {
                team_idx: null,
                team_name: null,
                goal: null,
                goal_avg: null,
                lose_avg: null,
            }
        }
    }
    set resP3_2_d2(D){
        if(this.sumRes.p3_2 !== null) {
            var sumData = this.sumRes.p3_2[D.name][D.divName];

            this.res.p3_2.d2[D.name][D.divName] = {
                team_idx: sumData.team_idx,
                team_name: sumData.team_name,
                goal_avg: sumData.goal_avg,
                lose_avg: sumData.lose_avg,
                goal_0: sumData.goal_0,
                goal_1: sumData.goal_1,
                goal_2: sumData.goal_2,
                goal_3: sumData.goal_3,
                goal_4_over: sumData.goal_4_over,
                lose_avg: sumData.lose_avg,
                lose_0: sumData.lose_0,
                lose_1: sumData.lose_1,
                lose_2: sumData.lose_2,
                lose_3: sumData.lose_3,
                lose_4_over: sumData.lose_4_over,
            }
        }else {
            this.res.p3_2.d2[D.name][D.divName] = {
                team_idx: null,
                team_name: null,
                goal_avg: null,
                lose_avg: null,
                goal_0: null,
                goal_1: null,
                goal_2: null,
                goal_3: null,
                goal_4_over: null,
                lose_avg: null,
                lose_0: null,
                lose_1: null,
                lose_2: null,
                lose_3: null,
                lose_4_over: null,
            }
        }
    }

    set setP3_3(D){
        var sumData = this.sumRes.p3_3[D.pageData.team_div]['div_' + D.divName];

        var res = {
            team_idx: D.pageData.team_idx,
            team_name: D.pageData.team_name,
        };

        if(Object.keys(sumData).length == 0){
            sumData.goal_diff = [];
            sumData.W = 0;
            sumData.D = 0;
            sumData.L = 0;
        }

        sumData.goal_diff.push(D.pageData.goal_diff);

        res.goal_diff = sumData.goal_diff;
        res.W = Number(D.pageData.W) + sumData.W;
        res.D = Number(D.pageData.D) + sumData.D;
        res.L = Number(D.pageData.L) + sumData.L;

        this.sumRes.p3_3[D.pageData.team_div]['div_' + D.divName] = res;
    }
    set setP3_3_total(divName){
        for(var teamKey of ['home','away']){
            if(Object.keys(this.sumRes.p3_3[teamKey][divName]).length === 0){
                this.sumRes.p3_3[teamKey][divName] = this.getP3_3_default;
                this.sumRes.p3_3[teamKey][divName].team_idx = this.teamInfo[divName+'_idx'];
                this.sumRes.p3_3[teamKey][divName].team_name = this.teamInfo[divName+'_name'];
                this.sumRes.p3_3[teamKey][divName].team_div = teamKey;
            }
        }
        var H = this.sumRes.p3_3.home[divName];
        var A = this.sumRes.p3_3.away[divName];
        var homeDiffArr = H.goal_diff === undefined ? [] : H.goal_diff;
        var awayDiffArr = A.goal_diff === undefined ? [] : A.goal_diff;
        var goalDiffArr = homeDiffArr.concat(awayDiffArr);
        var goalDiffCnt = {
            diff_1 : 0,
            diff_2 : 0,
            diff_3 : 0,
            diff_4_over : 0,
            diff__1 : 0,
            diff__2 : 0,
            diff__3 : 0,
            diff__4_over : 0,
        };
        var res = {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
            goal_diff_arr : goalDiffArr,
            W : H.W + A.W ,
            D : H.D + A.D ,
            L : H.L + A.L,
        };

        for(var diffNum of goalDiffArr){
            var num = this._numberCnt(diffNum);
            goalDiffCnt.diff_1 = num.num_1 + goalDiffCnt.diff_1;
            goalDiffCnt.diff_2 = num.num_2 + goalDiffCnt.diff_2;
            goalDiffCnt.diff_3 = num.num_3 + goalDiffCnt.diff_3;
            goalDiffCnt.diff_4_over = num.num_4_over + goalDiffCnt.diff_4_over;
            goalDiffCnt.diff__1 = num.num__1 + goalDiffCnt.diff__1;
            goalDiffCnt.diff__2 = num.num__2 + goalDiffCnt.diff__2;
            goalDiffCnt.diff__3 = num.num__3 + goalDiffCnt.diff__3;
            goalDiffCnt.diff__4_over = num.num__4_over + goalDiffCnt.diff__4_over;
        }
        res = Object.assign(res, goalDiffCnt);

        this.sumRes.p3_3.total[divName] = res;
    }
    get getP3_3_default(){
        return {
            goal_diff : [],
            W : 0,
            D : 0,
            L : 0,
        }
    }
    set setP3_3_avg(D){
        var sumData = this.sumRes.p3_3[D.name][D.divName];
        var goalDiffCnt = {
            diff_1 : 0,
            diff_2 : 0,
            diff_3 : 0,
            diff_4_over : 0,
            diff__1 : 0,
            diff__2 : 0,
            diff__3 : 0,
            diff__4_over : 0,
        };

        sumData.goal_diff = sumData.goal_diff === undefined ? [] : sumData.goal_diff;
        for(var diffNum of sumData.goal_diff){
            var num = this._numberCnt(diffNum);
            goalDiffCnt.diff_1 = num.num_1 + goalDiffCnt.diff_1;
            goalDiffCnt.diff_2 = num.num_2 + goalDiffCnt.diff_2;
            goalDiffCnt.diff_3 = num.num_3 + goalDiffCnt.diff_3;
            goalDiffCnt.diff_4_over = num.num_4_over + goalDiffCnt.diff_4_over;
            goalDiffCnt.diff__1 = num.num__1 + goalDiffCnt.diff__1;
            goalDiffCnt.diff__2 = num.num__2 + goalDiffCnt.diff__2;
            goalDiffCnt.diff__3 = num.num__3 + goalDiffCnt.diff__3;
            goalDiffCnt.diff__4_over = num.num__4_over + goalDiffCnt.diff__4_over;
        }

        var res = Object.assign(sumData, goalDiffCnt);

        this.sumRes.p3_3[D.name][D.divName] = res;
    }
    set resP3_3_d1(D){
        var sumData = this.sumRes.p3_3[D.name][D.divName] ;

        this.res.p3_3.d1[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            W : sumData.W,
            D : sumData.D,
            L : sumData.L,
            goal_diff_1 : sumData.diff_1,
            goal_diff_2 : sumData.diff_2,
            goal_diff_3 : sumData.diff_3,
            goal_diff_4_over : sumData.diff_4_over,
            lose_diff_1 : sumData.diff__1,
            lose_diff_2 : sumData.diff__2,
            lose_diff_3 : sumData.diff__3,
            lose_diff_4_over : sumData.diff__4_over,
        }
    }
    set resP3_3_d2(D){
        if(this.oppoData !== null) {
            var oppoData = this.oppoData[D.name][D.divName];

            this.res.p3_3.d2[D.name][D.divName] = {
                team_idx: oppoData.team_idx,
                team_name: oppoData.team_name,
                W: oppoData.W,
                D: oppoData.D,
                L: oppoData.L,
                goal_diff_1: oppoData.goal_diff_1,
                goal_diff_2: oppoData.goal_diff_2,
                goal_diff_3: oppoData.goal_diff_3,
                goal_diff_4_over: oppoData.goal_diff_4_over,
                lose_diff_1: oppoData.lose_diff_1,
                lose_diff_2: oppoData.lose_diff_2,
                lose_diff_3: oppoData.lose_diff_3,
                lose_diff_4_over: oppoData.lose_diff_4_over,
            }
        }else {
            this.res.p3_3.d2[D.name][D.divName] = {
                team_idx: null,
                team_name: null,
                W: null,
                D: null,
                L: null,
                goal_diff_1: null,
                goal_diff_2: null,
                goal_diff_3: null,
                goal_diff_4_over: null,
                lose_diff_1: null,
                lose_diff_2: null,
                lose_diff_3: null,
                lose_diff_4_over: null,
            }
        }
    }

    set setP3_4(D){
        var sumData = this.sumRes.p3_4[D.pageData.team_div]['div_' + D.divName];

        var res = {
            game_idx: D.pageData.game_idx,
            game_date: D.pageData.game_date,
            team_idx: D.pageData.team_idx,
            team_name: D.pageData.team_name,
            team_div: D.pageData.team_div,
        };

        if(Object.keys(sumData).length == 0){
            sumData.games = 0;
            sumData.goal_diff = 0;
            sumData.goal = 0;
            sumData.lose = 0;
            sumData.point = 0;
            sumData.possession = 0;
            sumData.possession_games = 0;
            sumData.shots = 0;
            sumData.shots_games = 0;
            sumData.shots_on = 0;
            sumData.shots_on_games = 0;
        }

        res.games = 1 + sumData.games;
        res.goal_diff = Number(D.pageData.goal_diff) + sumData.goal_diff;
        res.goal = Number(D.pageData.goal) + sumData.goal;
        res.lose = Number(D.pageData.lose) + sumData.lose;
        res.point = Number(D.pageData.point) + sumData.point;
        res.possession = Number(D.pageData.possession) + sumData.possession;
        res.possession_games = Number(D.pageData.possession_games) + sumData.possession_games;
        res.shots = Number(D.pageData.shots) + sumData.shots;
        res.shots_games = Number(D.pageData.shots_game) + sumData.shots_games;
        res.shots_on = Number(D.pageData.shots_on) + sumData.shots_on;
        res.shots_on_games = Number(D.pageData.shots_on_game) + sumData.shots_on_games;

        this.sumRes.p3_4[D.pageData.team_div]['div_' + D.divName] = res;
    }
    set setP3_4_total(divName){
        for(var teamKey of ['home','away']){
            if(Object.keys(this.sumRes.p3_4[teamKey][divName]).length === 0){
                this.sumRes.p3_4[teamKey][divName] = this.getP3_4_default;
                this.sumRes.p3_4[teamKey][divName].team_idx = this.teamInfo[divName+'_idx'];
                this.sumRes.p3_4[teamKey][divName].team_name = this.teamInfo[divName+'_name'];
                this.sumRes.p3_4[teamKey][divName].team_div = teamKey;
            }
        }
        var H = this.sumRes.p3_4.home[divName];
        var A = this.sumRes.p3_4.away[divName];
        var recent = this.recent.total[divName];
        var games = H.games + A.games;
        var goal = H.goal + A.goal;
        var lose = H.lose + A.lose;
        var point = H.point + A.point;
        var pointAvg = this._okRound(point, games, 2);
        var possessionGames = H.possession_games + A.possession_games;
        var possession = H.possession + A.possession;
        var possessionAvg = this._okRound(possession, possessionGames, 2);
        var goalAvg = this._okRound(goal, games, 2);
        var loseAvg = this._okRound(lose, games, 2);
        var shots = H.shots + A.shots ;
        var shotsGames = H.shots_games + A.shots_games ;
        var shotsAvg = this._okRound(shots, shotsGames, 2);
        var shotsOn = H.shots_on + A.shots_on ;
        var shotsOnGames = H.shots_on_games + A.shots_on_games ;
        var shotsOnAvg = this._okRound(shotsOn, shotsGames, 2);

        //console.log(recent);
        var res = {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
            games : games,
            point : point,
            point_avg : pointAvg,
            point_avg_recent : recent.point_avg ,
            point_avg_diff : Number((Number(pointAvg) - Number(recent.point_avg)).toFixed(2)) ,
            possession : possession,
            possession_games : possessionGames,
            possession_avg : possessionAvg,
            possession_avg_recent : recent.possession_avg,
            possession_avg_diff : Number((Number(possessionAvg) - Number(recent.possession_avg)).toFixed(2)),
            goal_avg : goalAvg,
            goal_avg_recent : recent.goal_avg,
            goal_avg_diff : Number((Number(goalAvg) - Number(recent.goal_avg)).toFixed(2)),
            lose_avg : loseAvg,
            lose_avg_recent : recent.lose_avg,
            lose_avg_diff : Number((Number(loseAvg) - Number(recent.lose_avg)).toFixed(2)),
            shots_games : shotsGames,
            shots : shots,
            shots_on : shotsOn,
            shots_avg : shotsAvg,
            shots_avg_recent : recent.shots_avg,
            shots_avg_diff : Number((Number(shotsAvg) - Number(recent.shots_avg)).toFixed(2)),
            shots_on_avg : shotsOnAvg,
            shots_on_avg_recent : recent.shots_on_avg,
            shots_on_avg_diff : Number((Number(shotsOnAvg) - Number(recent.shots_on_avg)).toFixed(2)),
        };

        this.sumRes.p3_4.total[divName] = res;
    }
    set setP3_4_recent(resData){
        var res = this._reverseTotalKey;
        var resArr = {
            home : {
                div_home : [],
                div_away : []
            },
            away : {
                div_home : [],
                div_away : [],
            },
            total : {
                div_home : [],
                div_away : []
            }
        }
        for(var divName in resData){
            for(var pName in resData[divName]){
                var pData = Object.assign({},resData[divName][pName].p3_4_recent_trend);
                if(resArr[pData.team_div]['div_'+divName].length == 0){
                    res[pData.team_div]['div_'+divName] = pData;
                    res[pData.team_div]['div_'+divName].games = 1;
                    resArr[pData.team_div]['div_'+divName].push(pData)
                    //console.log(res[pData.team_div]['div_'+divName]);
                }else if(resArr[pData.team_div]['div_'+divName].length < 5){
                    resArr[pData.team_div]['div_'+divName].push(pData);
                    var sumData = Object.assign({},res[pData.team_div]['div_'+divName]);
                    res[pData.team_div]['div_'+divName].games = sumData.games + 1;
                    res[pData.team_div]['div_'+divName].goal_diff = Number(sumData.goal_diff) + Number(pData.goal_diff);
                    res[pData.team_div]['div_'+divName].goal = Number(sumData.goal) + Number(pData.goal);
                    res[pData.team_div]['div_'+divName].lose = Number(sumData.lose) + Number(pData.lose);
                    res[pData.team_div]['div_'+divName].point = Number(sumData.point) + Number(pData.point);
                    res[pData.team_div]['div_'+divName].possession = Number(sumData.possession) + Number(pData.possession);
                    res[pData.team_div]['div_'+divName].possession_games = Number(sumData.possession_games) + Number(pData.possession_games);
                    res[pData.team_div]['div_'+divName].shots = Number(sumData.shots) + Number(pData.shots);
                    res[pData.team_div]['div_'+divName].shots_game = Number(sumData.shots_game) + Number(pData.shots_game);
                    res[pData.team_div]['div_'+divName].shots_on = Number(sumData.shots_on) + Number(pData.shots_on);
                    res[pData.team_div]['div_'+divName].shots_on_game = Number(sumData.shots_on_game) + Number(pData.shots_on_game);
                }

                var pData = Object.assign({},resData[divName][pName].p3_4_recent_trend);

                if(resArr.total['div_'+divName].length == 0){
                    res.total['div_'+divName] = pData;
                    res.total['div_'+divName].games = 1;
                    resArr.total['div_'+divName].push(pData);
                }else if(resArr.total['div_'+divName].length < 5){
                    resArr.total['div_'+divName].push(pData);
                    var sumData = Object.assign({},res.total['div_'+divName]);
                    res.total['div_'+divName].games = sumData.games + 1;
                    res.total['div_'+divName].goal_diff = Number(sumData.goal_diff) + Number(pData.goal_diff);
                    res.total['div_'+divName].goal = Number(sumData.goal) + Number(pData.goal);
                    res.total['div_'+divName].lose = Number(sumData.lose) + Number(pData.lose);
                    res.total['div_'+divName].point = Number(sumData.point) + Number(pData.point);
                    res.total['div_'+divName].possession = Number(sumData.possession) + Number(pData.possession);
                    res.total['div_'+divName].possession_games = Number(sumData.possession_games) + Number(pData.possession_games);
                    res.total['div_'+divName].shots = Number(sumData.shots) + Number(pData.shots);
                    res.total['div_'+divName].shots_game = Number(sumData.shots_game) + Number(pData.shots_game);
                    res.total['div_'+divName].shots_on = Number(sumData.shots_on) + Number(pData.shots_on);
                    res.total['div_'+divName].shots_on_game = Number(sumData.shots_on_game) + Number(pData.shots_on_game);
                }
            }
        }

        //평균값
        for(var name in res ){
            for(var divName in res[name]){
                if(Object.keys(res[name][divName]).length === 0){
                    res[name][divName] = this.getP3_4_default;
                    res[name][divName].team_idx = this.teamInfo[divName+'_idx'];
                    res[name][divName].team_name = this.teamInfo[divName+'_name'];
                    res[name][divName].team_div = name;
                }

                var resVal = res[name][divName];
                var pointAvg = this._okRound(resVal.point, resVal.games, 2);
                res[name][divName].goal_avg = this._okRound(resVal.goal, resVal.games, 2);
                res[name][divName].lose_avg = this._okRound(resVal.lose, resVal.games, 2);
                res[name][divName].point_avg = this._okRound(resVal.point, resVal.games, 2);
                res[name][divName].possession_avg = this._okRound(resVal.possession, resVal.possession_games, 2);
                res[name][divName].shots_avg = this._okRound(resVal.shots, resVal.shots_game, 2);
                res[name][divName].shots_on_avg = this._okRound(resVal.shots_on, resVal.shots_game, 2);
            }
        }

        this.recent = res;
    }
    set setP3_4_avg(D){
        var sumData = this.sumRes.p3_4[D.name][D.divName];
        sumData.shots_games = sumData.shots_games !== undefined ? sumData.shots_games : 0;
        var recent = this.recent[D.name][D.divName];
        var pointAvg = this._okRound(sumData.point, sumData.games, 2);
        var possessionAvg = this._okRound(sumData.possession, sumData.possession_games, 2);
        var goalAvg = this._okRound(sumData.goal, sumData.games, 2);
        var loseAvg = this._okRound(sumData.lose, sumData.games, 2);
        var shotsAvg = this._okRound(sumData.shots, sumData.shots_games, 2);
        var shotsOnAvg = this._okRound(sumData.shots_on, sumData.shots_games, 2);

        var res = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games : sumData.games,
            point : sumData.point,
            point_avg : pointAvg,
            point_avg_recent : recent.point_avg ,
            point_avg_diff : Number((Number(pointAvg) - Number(recent.point_avg)).toFixed(2)) ,
            possession : sumData.possession,
            possession_games : sumData.possession_games,
            possession_avg : possessionAvg,
            possession_avg_recent : recent.possession_avg,
            possession_avg_diff : Number((Number(possessionAvg) - Number(recent.possession_avg)).toFixed(2)),
            goal_avg : goalAvg,
            goal_avg_recent : recent.goal_avg,
            goal_avg_diff : Number((Number(goalAvg) - Number(recent.goal_avg)).toFixed(2)),
            lose_avg : loseAvg,
            lose_avg_recent : recent.lose_avg,
            lose_avg_diff : Number((Number(loseAvg) - Number(recent.lose_avg)).toFixed(2)),
            shots_games : sumData.shots_games,
            shots : sumData.shots,
            shots_on : sumData.shots_on,
            shots_avg : shotsAvg,
            shots_avg_recent : recent.shots_avg,
            shots_avg_diff : Number((Number(shotsAvg) - Number(recent.shots_avg)).toFixed(2)),
            shots_on_avg : shotsOnAvg,
            shots_on_avg_recent : recent.shots_on_avg,
            shots_on_avg_diff : Number((Number(shotsOnAvg) - Number(recent.shots_on_avg)).toFixed(2)),
        };

        this.sumRes.p3_4[D.name][D.divName] = res;
    }
    get getP3_4_default(){
        return {
            game_idx : null,
            game_date : null,
            games: 0,
            goal_diff: 0,
            goal: 0,
            lose: 0,
            point: 0,
            possession: 0,
            possession_games: 0,
            shots: 0,
            shots_game: 0,
            shots_games: 0,
            shots_on: 0,
            shots_on_game: 0,
        }
    }
    set resP3_4_d1(D){
        var sumData = this.sumRes.p3_4[D.name][D.divName] ;

        this.res.p3_4.d1[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games : sumData.games,
            point : sumData.point,
            point_avg : sumData.point_avg,
            point_avg_recent : sumData.point_avg_recent,
            point_avg_diff : sumData.point_avg_diff,
        }
    }
    set resP3_4_d2(D){
        var sumData = this.sumRes.p3_4[D.name][D.divName] ;

        this.res.p3_4.d2[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games : sumData.possession_games,
            possession_avg : sumData.possession_avg,
            possession_avg_recent : sumData.possession_avg_recent,
            possession_avg_diff : sumData.possession_avg_diff,
        }
    }
    set resP3_4_d3(D){
        var sumData = this.sumRes.p3_4[D.name][D.divName] ;

        this.res.p3_4.d3[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games : sumData.games,
            goal_avg : sumData.goal_avg,
            goal_avg_recent : sumData.goal_avg_recent,
            goal_avg_diff : sumData.goal_avg_diff,
            lose_avg : sumData.lose_avg,
            lose_avg_recent : sumData.lose_avg_recent,
            lose_avg_diff : sumData.lose_avg_diff,

        }
    }
    set resP3_4_d4(D){
        var sumData = this.sumRes.p3_4[D.name][D.divName] ;
        //console.log(sumData);
        this.res.p3_4.d4[D.name][D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            games : sumData.shots_games,
            shots_avg : sumData.shots_avg,
            shots_avg_recent : sumData.shots_avg_recent,
            shots_avg_diff : sumData.shots_avg_diff,
            shots_on_avg : sumData.shots_on_avg,
            shots_on_avg_recent : sumData.shots_on_avg_recent,
            shots_on_avg_diff : sumData.shots_on_avg_diff,
        }
    }

    set setP3_5(D){
        var sumData = this.sumRes.p3_5['div_' + D.divName];
        //console.log(D.pageData);
        var res = {
            team_idx: D.pageData.team_idx,
            team_name: D.pageData.team_name,
        };

        if(Object.keys(sumData).length == 0){
            sumData.game_idx = [];
            sumData.game_date = [];
            sumData.shots_on_permit = [];
            sumData.save = [];
            sumData.save_per = [];
        }
        if(D.pageData.shots_on_permit !== 0 && D.pageData.save !== 0) {
            var shotsOnPermit = D.pageData.shots_on_permit;
            var save = D.pageData.save;
        }else {
            var shotsOnPermit = 0;
            var save = 0;
        }

        sumData.game_idx.push(D.pageData.game_idx);
        sumData.game_date.push(D.pageData.game_date);
        sumData.shots_on_permit.push(shotsOnPermit);
        sumData.save.push(save) ;
        sumData.save_per.push(D.pageData.save_per) ;
        res.game_idx = sumData.game_idx;
        res.game_date = sumData.game_date;
        res.shots_on_permit = sumData.shots_on_permit;
        res.save = sumData.save;
        res.save_per = sumData.save_per;

        this.sumRes.p3_5['div_' + D.divName] = res;
    }
    set setP3_5_total(divName){
        var sumData = this.sumRes.p3_5[divName];

        var keyArr = ['shots_on_permit', 'save'];
        var res = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            shots_on_permit : 0,
            save : 0,
            save_per : 0,
            recent : [],
        };

        var filterData = {};
        var shotsOnArr = [];
        var saveArr = [];

        for(var arrKey in sumData.shots_on_permit){
            var shotsOnVal = sumData.shots_on_permit[arrKey] ;
            var saveVal = sumData.save[arrKey] ;
            if(shotsOnVal !== null && saveVal !== null){
                shotsOnArr.push(Number(shotsOnVal));
                saveArr.push(Number(saveVal));
                res.shots_on_permit = Number(res.shots_on_permit) + Number(shotsOnVal);
                res.save = Number(res.save) + Number(saveVal);
            }
        }

        var arrLen = shotsOnArr.length;

        for(var arrKey in arrLen){
            res.shots_on_permit += shotsOnArr[arrKey];
            res.save += saveArr[arrKey] ;
        }
        res.save_per = this._okRound(res.save, Number(res.shots_on_permit), 0, '%');
        res.shots_on_permit = this._okRound(res.shots_on_permit, arrLen, 2);
        res.save = this._okRound(res.save, arrLen, 2) ;

        var recent = {
            game_idx : '',
            game_date : '',
            shots_on_permit : '',
            save : '',
            save_per : '',
        }

        sumData.game_idx = sumData.game_idx === undefined ? [] : sumData.game_idx;
        for(var i =0; i< sumData.game_idx.length ; i++) {
            var recentVal = {};
            if(i < 5) {
                for (var recentKey in recent) {
                    if (recentKey == 'game_date') {
                        var gameDate = sumData[recentKey][i] === undefined ? null : sumData[recentKey][i].substring(5,10);
                        recentVal[recentKey] = gameDate;
                    } else {
                        recentVal[recentKey] = sumData[recentKey][i] === undefined ? null : sumData[recentKey][i];
                    }
                }
                res.recent.push(recentVal);
            }
        }

        res.recent =  res.recent.reverse();

        this.sumRes.p3_5[divName] = res;
    }
    set setP3_5_per(D){
        var H = this.sumRes.p3_5.div_home;
        var A = this.sumRes.p3_5.div_away;
        var shotsOnLen = H.shots_on_permit + A.shots_on_permit;
        var saveLen = H.save + A.save;
        var savePerLen = H.save_per + A.save_per;

        this.sumRes.p3_5.div_home.shots_on_permit_per = this._okRound(H.shots_on_permit, shotsOnLen, 0, '%');
        this.sumRes.p3_5.div_away.shots_on_permit_per = this._okRound(A.shots_on_permit, shotsOnLen, 0, '%');
        this.sumRes.p3_5.div_home.save_avg_per = this._okRound(H.save, saveLen, 0, '%');
        this.sumRes.p3_5.div_away.save_avg_per = this._okRound(A.save, saveLen, 0, '%');
        this.sumRes.p3_5.div_home.save_per_per = this._okRound(H.save_per, savePerLen, 0, '%');
        this.sumRes.p3_5.div_away.save_per_per = this._okRound(A.save_per, savePerLen, 0, '%');
    }
    set resP3_5_d1(D){
        var sumData = this.sumRes.p3_5[D.divName] ;

        this.res.p3_5.d1[D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            shots_on_permit : sumData.shots_on_permit,
            shots_on_permit_per : sumData.shots_on_permit_per,
            save : sumData.save,
            save_per : sumData.save_per,
            save_avg_per : sumData.save_avg_per,
        }
    }
    set resP3_5_d2(D){
        var sumData = this.sumRes.p3_5[D.divName] ;
        var recentRes = [];

        for(var recentVal of sumData.recent){
            var recentObj = {
                game_idx : recentVal.game_idx,
                game_date : recentVal.game_date,
                shots_on_permit : recentVal.shots_on_permit,
                save : recentVal.save,
                save_per : recentVal.save_per,
            };
            recentRes.push(recentObj);
        }

        this.res.p3_5.d2[D.divName] = {
            team_idx : sumData.team_idx,
            team_name : sumData.team_name,
            recent : recentRes
        }
    }


    _numberCnt(num){
        var res = {
            num__4_over : num <= -4 ? 1 : 0,
            num__3 : num === -3 ? 1 : 0,
            num__2 : num === -2 ? 1 : 0,
            num__1 : num === -1 ? 1 : 0,
            num_0: num === 0 ? 1 : 0,
            num_1: num === 1 ? 1 : 0,
            num_2: num === 2 ? 1 : 0,
            num_3: num === 3 ? 1 : 0,
            num_4_over: num >= 4 ? 1 : 0,
        }
        return res;
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

    get _sumResKey() {
        return {
            p3_1: this._reverseTotalKey,
            p3_2: {},
            p3_3: this._reverseTotalKey,
            p3_4: this._reverseTotalKey,
            p3_5: {
                div_home : {},
                div_away : {},
            },
        }
    }

    get _resKey() {
        return {
            p3_1: {
                d1: this._totalKey,
                d2: this._reverseTotalKey,
                d3: this._reverseTotalKey,
            },
            p3_2: {
                d1: this._reverseTotalKey,
                d2: this._reverseTotalKey,
            },
            p3_3: {
                d1: this._reverseTotalKey,
                d2: this._reverseTotalKey,
            },
            p3_4: {
                d1: this._reverseTotalKey,
                d2: this._reverseTotalKey,
                d3: this._reverseTotalKey,
                d4: this._reverseTotalKey,
            },
            p3_5: {
                d1: this._totalKey,
                d2: this._totalKey,
            },
        }
    }

    get _totalKey() {
        return {
            div_home: {
                home: {},
                away: {},
                total: {}
            },
            div_away: {
                home: {},
                away: {},
                total: {}
            }
        }
    }

    get _reverseTotalKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            },
            total: {
                div_home: {},
                div_away: {}
            }
        };
    }

}

class DetailPageThree {
    constructor(originData, divTeamIdx) {
        this.res = {
            p3_1_avg_goal_diff: {},
            p3_2_avg_opponent: {},
            p3_3_goal_diff_margin: {},
            p3_4_recent_trend: {},
            p3_5_goalkeeper_record: {},
        };
        this.configData = {};
        this.techStats = {
            possession: null,
            possession_game: null,
            shots: null,
            shots_game: null,
            shots_on: null,
            shots_on_game: null,
            shots_on_permit: 0,
            save: 0,
            save_per: 0
        };
        this.keyEvent = {
            first_half_goal: null,
            first_half_lose: null,
            second_half_goal: null,
            second_half_lose: null
        };

        if (originData.config.home_team_idx == divTeamIdx) {
            var teamDiv = {main: 'home', sub: 'away'};
        } else if (originData.config.away_team_idx == divTeamIdx) {
            var teamDiv = {main: 'away', sub: 'home'};
        }
        //console.log(originData.tech_statistics)
        this.setConfigData(originData, teamDiv);
        if (originData.key_event.length != 0 && originData.key_event.length !== undefined) {
            this.setKeyEvent(originData, teamDiv);
        }
        if (originData.tech_statistics !== undefined && Object.keys(originData.tech_statistics).length != 0) {
            this.setTechStats(originData, teamDiv);
        }

        this.setRes();
    }

    setRes(){
        this.setP3_1();
        this.setP3_2();
        this.setP3_3();
        this.setP3_4();
        this.setP3_5();
    }

    setP3_1(){
        this.res.p3_1_avg_goal_diff = {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal : this.configData.goal,
            lose : this.configData.lose,
            goal_diff : this.configData.goal_diff,
            first_half_goal: this.keyEvent.first_half_goal ,
            first_half_lose: this.keyEvent.first_half_lose ,
            second_half_goal: this.keyEvent.second_half_goal ,
            second_half_lose: this.keyEvent.second_half_lose ,
            goalArr : [],
            loseArr : [],
        }
    }
    setP3_2(){
        this.res.p3_2_avg_opponent = {
            //opponent
        }
    }
    setP3_3(){
        this.res.p3_3_goal_diff_margin = {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal_diff : this.configData.goal_diff,
            W : this.configData.W,
            D : this.configData.D,
            L : this.configData.L,
        }
    }
    setP3_4(){
        this.res.p3_4_recent_trend = {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            goal_diff : this.configData.goal_diff,
            goal : this.configData.goal,
            lose : this.configData.lose,
            point : this.configData.team_point,
            possession : this.techStats.possession,
            possession_games : this.techStats.possession_game,
            shots: this.techStats.shots,
            shots_game: this.techStats.shots_game,
            shots_on: this.techStats.shots_on,
            shots_on_game: this.techStats.shots_on_game,
        }
    }
    setP3_5(){
        this.res.p3_5_goalkeeper_record = {
            game_idx : this.configData.game_idx,
            game_date : this.configData.game_start_time,
            team_idx : this.configData.team_idx,
            team_name : this.configData.team_name,
            team_div : this.configData.team_div,
            shots_on_permit: this.techStats.shots_on_permit,
            save: this.techStats.save,
            save_per: this.techStats.save_per
        }
    }

    setConfigData(originData, teamDiv) {
        var config = originData.config;
        var teamResData = this._teamResData(originData, teamDiv);
        var goal = config[teamDiv.main + '_goal'] != '' ? config[teamDiv.main + '_goal'] : null;
        var lose = config[teamDiv.sub + '_goal'] != '' ? config[teamDiv.sub + '_goal'] : null;

        this.configData = {
            game_idx: config.game_idx,
            game_start_time : config.game_date,
            division_day : config.game_date.substr(5,8),
            team_div: teamDiv.main,
            team_name: config[teamDiv.main + '_name'],
            team_idx: config[teamDiv.main + '_team_idx'],
            league_idx: config.league_idx,
            league_name: config.league_name,
            league_color: config.league_color,
            goal: Number(goal),
            lose: Number(lose),
            goal_half: config[teamDiv.main + '_goal_half'] != '' ? config[teamDiv.main + '_goal_half'] : null,
            lose_half: config[teamDiv.sub + '_goal_half'] != '' ? config[teamDiv.sub + '_goal_half'] : null,
            score: config.home_goal + '-' + config.away_goal,
            goal_diff: teamResData.team_diff,
            W: teamResData.W,
            D: teamResData.D,
            L: teamResData.L,

            //team_res : teamResData.team_res ,
            team_point : teamResData.team_point ,
        }
    }

    setKeyEvent(originData, teamDiv) {
        var keyEvent = originData.key_event;
        var halfFullGoal = {
            firstHalfGoal: 0,
            firstHalfLose: 0,
            secondHalfGoal: 0,
            secondHalfLose: 0,
        }

        for (var event of keyEvent) {
            if (event.event_name == 'Goal' || event.event_name == 'Penalty scored' || event.event_name == 'Own goal') {
                var resHalfGoal = this._halfFullGoal(event, teamDiv, halfFullGoal);
                halfFullGoal.firstHalfGoal = resHalfGoal.firstHalfGoal + halfFullGoal.firstHalfGoal;
                halfFullGoal.firstHalfLose = resHalfGoal.firstHalfLose + halfFullGoal.firstHalfLose;
                halfFullGoal.secondHalfGoal = resHalfGoal.secondHalfGoal + halfFullGoal.secondHalfGoal;
                halfFullGoal.secondHalfLose = resHalfGoal.secondHalfLose + halfFullGoal.secondHalfLose;
            }
        }

        this.keyEvent = {
            first_half_goal: halfFullGoal.firstHalfGoal,
            first_half_lose: halfFullGoal.firstHalfLose,
            second_half_goal: halfFullGoal.secondHalfGoal,
            second_half_lose: halfFullGoal.secondHalfLose,
        }
    }

    setTechStats(originData, teamDiv) {
        var techMain = originData.tech_statistics[teamDiv.main];
        var techSub = originData.tech_statistics[teamDiv.sub];
        //console.log(techMain);
        var possession = techMain.possession !== null ? techMain.possession.split('%')[0] : null;
        var shots = techMain.shots !== null ? techMain.shots : null;
        var shotsOn = techMain.shots_on_goal !== null ? techMain.shots_on_goal : null;
        var shotsOnPermit = techSub.shots_on_goal !== null ? techSub.shots_on_goal : 0;
        var save = techMain.saves !== null ? techMain.saves : 0;
        var save_per = 0;
        var shotsGame = 0;
        var shotsOnGame = shotsOn !== null ? 1 : 0;

        if (save !== null && shotsOnPermit !== null) {
            save_per = this._okRound(save, shotsOnPermit, 0, '%');
        }
        if(shots !== null && shotsOn !== null){
            shotsGame = 1;
        }else {
            shots = 0;
            shotsOn = 0;
        }

        this.techStats = {
            possession: possession,
            possession_game: possession !== null ? 1 : 0,
            shots: shots,
            shots_game: shotsGame,
            shots_on: shotsOn,
            shots_on_game: shotsOnGame,
            shots_on_permit: shotsOnPermit,
            save: save,
            save_per: save_per,
        }
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

    _teamResData(originData, teamDiv) {
        var data = originData.config;
        var team_diff = null;
        var W = 0;
        var D = 0;
        var L = 0;
        var team_point = null;

        if (data[teamDiv.main + '_goal'] !== '' && data[teamDiv.sub + '_goal'] !== '') {
            team_diff = Number(data[teamDiv.main + '_goal']) - Number(data[teamDiv.sub + '_goal']);

            if (data[teamDiv.main + '_goal'] < data[teamDiv.sub + '_goal']) {
                L = 1;
                team_point = 0;
            } else if (data[teamDiv.main + '_goal'] > data[teamDiv.sub + '_goal']) {
                W = 1;
                team_point = 3;
            } else if (data[teamDiv.main + '_goal'] == data[teamDiv.sub + '_goal']) {
                D = 1;
                team_point  = 1;
            }
        }
        return {
            team_diff: team_diff,
            W: W,
            D: D,
            L: L,
            team_point : team_point,
        }
    }

    _halfFullGoal(event, teamDiv) {
        var firstHalfGoal = 0;
        var firstHalfLose = 0;
        var secondHalfGoal = 0;
        var secondHalfLose = 0;

        if (event.team_div == teamDiv.main) {
            if (event.time <= 45) {
                firstHalfGoal = 1;
            } else if (event.time > 45) {
                secondHalfGoal = 1;
            }
        } else if (event.team_div == teamDiv.sub) {
            if (event.time <= 45) {
                firstHalfLose = 1;
            } else if (event.time > 45) {
                secondHalfLose = 1;
            }
        }

        return {
            firstHalfGoal: firstHalfGoal,
            firstHalfLose: firstHalfLose,
            secondHalfGoal: secondHalfGoal,
            secondHalfLose: secondHalfLose,
        }
    }

    getDetailPageThree() {
        return this.res;
    }
}

class DetailPageTwoSum {
    constructor(resData, teamInfo) {
        this.teamInfo = teamInfo;

        this.sumRes = this.getResKey();
        this.divKey = this.getDivKey();

        this.res = this.getResKey();

        //this.setKeyDefault();


        //this.setResKey();
        this.setResDataKey();

    }

    getDivKey() {
        return {
            p2_1: {
                d1: [],
                d2: [],
                d3: [],
                d4: []
            },
            p2_2: {
                d1: ['W', 'D', 'L', 'first_half_W_cnt', 'first_half_W_per', 'games', 'goal', 'lose', 'team_idx', 'team_name'],
                d2: ['W', 'D', 'L', 'first_half_L_cnt', 'first_half_L_per', 'games', 'goal', 'lose', 'team_idx', 'team_name'],
            },
            p2_3: {
                d1: [],
                d2: [],
                d3: [],
                d4: [],
                d5: [],
                d6: []
            }
        }
    }

    getResKey() {
        return {
            p2_1: {
                d1: this.getTotalKey(),
                d2: this.getTotalKey(),
                d3: this.getTotalKey(),
                d4: this.getTotalKey(),
            },
            p2_2: {
                d1: this.getReverseTotalKey(),
                d2: this.getReverseTotalKey(),
            },
            p2_3: {
                d1: this.getTotalKey(),
                d2: this.getReverseTotalKey(),
                d3: this.getReverseTotalKey(),
                d4: this.getReverseTotalKey(),
                d5: this.getReverseTotalKey(),
                d6: this.getReverseTotalKey()
            }
        }
    }

    setResKey() {
        var resKey = this.getResKey();
        var divKey = this.getDivKey();

        //console.log(resKey);
        for (var pKey in resKey) {
            var pVal = resKey[pKey];
            for (var dKey in pVal) {
                //console.log(pVal[dKey]);
                var dVal = pVal[dKey];
                for (var partKey_1 in dVal) {
                    var partVal_1 = dVal[partKey_1];
                    for (var partKey_2 in partVal_1) {
                        for (var dArr of divKey[pKey][dKey]) {
                            this.res[pKey][dKey][partKey_1][[partKey_2]][dArr] = 0;
                            console.log(this.sumRes[pKey][dKey][partKey_1][[partKey_2]]);
                        }
                    }
                }
            }
        }
    }

    setResDataPart_1(divData, pageData, divName) {
        this.setP2_1(divData[pageData].p2_1_no_goal_lose, divName);
        this.setP2_2(divData[pageData].p2_2_half_Performance, divName);
        this.setP2_3(divData[pageData].p2_3_time_goal_lose, divName);
    }

    setResDataPart_2() {
        //console.log(this.sumRes.p2_1);
        //this.setResKey();
        //console.log(this.sumRes.p2_3.d1);
    }

    setResDataPart_3(divName) {
        this.sumRes.p2_1[divName].total = this.getP2_1_total(divName);
        this.sumRes.p2_2.d1.total[divName] = this.getP2_2_d1_total(divName);
        this.sumRes.p2_2.d2.total[divName] = this.getP2_2_d2_total(divName);
        this.sumRes.p2_3.d1[divName] = this.getP2_3_d1_avg(divName);

        this.sumRes.p2_3.d2.total[divName] = this.getP2_3_d2_total(divName);
        this.sumRes.p2_3.d3.total[divName] = this.getP2_3_d3_total(divName);
        this.sumRes.p2_3.d4.total[divName] = this.getP2_3_d4_total(divName);
        this.sumRes.p2_3.d5.total[divName] = this.getP2_3_d5_total(divName);
        this.sumRes.p2_3.d6.total[divName] = this.getP2_3_d6_total(divName);
        //console.log(this.sumRes.p2_1);
    }

    setResDataPart_4(divName, name) {
        this.sumRes.p2_1[divName][name] = this.getP2_1_per(divName, name);
        //console.log(this.sumRes.p2_2.d1[name][divName]);
        this.sumRes.p2_2.d1[name][divName] = this.getP2_2_d1_per(divName, name);
        this.sumRes.p2_2.d2[name][divName] = this.getP2_2_d2_per(divName, name);
        this.sumRes.p2_3.d2[name][divName] = this.getP2_3_d2_per(divName, name);

    }

    setResDataPart_5() {
        this.res = this.getSumRes();
        this.res.p2_1.d1 = this.getTotalKey();
        this.res.p2_1.d2 = this.getTotalKey();
        this.res.p2_1.d3 = this.getTotalKey();
        this.res.p2_1.d4 = this.getTotalKey();

        var getTotalKey = this.getTotalKey();
        for (var divName in getTotalKey) {
            for (var name in getTotalKey[divName]) {
                this.res.p2_1.d1[divName][name] = this.getP2_1_d1(divName, name);
                this.res.p2_1.d2[divName][name] = this.getP2_1_d2(divName, name);
                this.res.p2_1.d3[divName][name] = this.getP2_1_d3(divName, name);
                this.res.p2_1.d4[divName][name] = this.getP2_1_d4(divName, name);
            }
        }
        delete this.sumRes.p2_1.div_home;
        delete this.sumRes.p2_1.div_away;
    }

    getSumRes() {
        return this.sumRes;
    }

    getRes() {
        return this.res;
    }

    setP2_1(pageData, divName) {
        var sumData = this.sumRes.p2_1['div_' + divName][pageData.team_div];

        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            games: 1,
            no_goal_game: pageData.no_goal_game,
            no_lose_game: pageData.no_lose_game,
            both_goal_game: pageData.both_goal_game,
            all_half_goal_cnt: pageData.all_half_goal_cnt == null ? 0 : pageData.all_half_goal_cnt,
            all_half_goal_games: pageData.all_half_goal_cnt == null ? 0 : 1
        }

        if (Object.keys(sumData).length != 0) {
            res.games = res.games + sumData.games;
            res.no_goal_game = pageData.no_goal_game + sumData.no_goal_game;
            res.no_lose_game = pageData.no_lose_game + sumData.no_lose_game;
            res.both_goal_game = pageData.both_goal_game + sumData.both_goal_game;
            res.all_half_goal_cnt = res.all_half_goal_cnt + sumData.all_half_goal_cnt;
            res.all_half_goal_games = res.all_half_goal_games + sumData.all_half_goal_games;
        }

        this.sumRes.p2_1['div_' + divName][pageData.team_div] = res;
    }

    setP2_2(pageData, divName) {
        if (Object.keys(pageData).length == 0) {
            return;
        }
        this.sumRes.p2_2.d1[pageData.team_div]['div_' + divName] = this.getP2_2_d1(pageData, divName);
        this.sumRes.p2_2.d2[pageData.team_div]['div_' + divName] = this.getP2_2_d2(pageData, divName);
    }

    setP2_3(pageData, divName) {
        if (Object.keys(pageData).length == 0) {
            return;
        }
        //console.log(pageData);
        this.sumRes.p2_3.d1['div_' + divName][pageData.team_div] = this.getP2_3_d1(pageData, divName);
        this.sumRes.p2_3.d2[pageData.team_div]['div_' + divName] = this.getP2_3_d2(pageData, divName);
        this.sumRes.p2_3.d3[pageData.team_div]['div_' + divName] = this.getP2_3_d3(pageData, divName);
        this.sumRes.p2_3.d4[pageData.team_div]['div_' + divName] = this.getP2_3_d4(pageData, divName);
        this.sumRes.p2_3.d5[pageData.team_div]['div_' + divName] = this.getP2_3_d5(pageData, divName);
        this.sumRes.p2_3.d6[pageData.team_div]['div_' + divName] = this.getP2_3_d6(pageData, divName);
    }

    getP2_1_total(divName) {
        var H = this.sumRes.p2_1[divName].home;
        var A = this.sumRes.p2_1[divName].away;
        var games = this._isUndef(H.games) + this._isUndef(A.games);
        var no_goal_game = this._isUndef(H.no_goal_game) + this._isUndef(A.no_goal_game);
        var no_lose_game = this._isUndef(H.no_lose_game) + this._isUndef(A.no_lose_game);
        var both_goal_game = this._isUndef(H.both_goal_game) + this._isUndef(A.both_goal_game);
        var all_half_goal_cnt = this._isUndef(H.all_half_goal_cnt) + this._isUndef(A.all_half_goal_cnt);
        var all_half_goal_games = this._isUndef(H.all_half_goal_games) + this._isUndef(A.all_half_goal_games);

        return {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
            games: games,
            no_goal_game: no_goal_game,
            no_goal_game_per: this._okRound(no_goal_game, games, 0, '%'),
            no_lose_game: no_lose_game,
            no_lose_game_per: this._okRound(no_lose_game, games, 0, '%'),
            both_goal_game: both_goal_game,
            both_goal_game_per: this._okRound(both_goal_game, games, 0, '%'),
            all_half_goal_games: all_half_goal_games,
            all_half_goal_cnt: all_half_goal_cnt,
            all_half_goal_cnt_per: this._okRound(all_half_goal_cnt, all_half_goal_games, 0, '%'),
        }
    }

    _isUndef(data){
        data = data === undefined ? 0 : data;
        return data;
    }

    getP2_1_per(divName, name) {
        var resData = this.sumRes.p2_1[divName][name];
        var games = resData.games;
        var no_goal_game = resData.no_goal_game;
        var no_lose_game = resData.no_lose_game;
        var both_goal_game = resData.both_goal_game;
        var all_half_goal_cnt = resData.all_half_goal_cnt;
        var all_half_goal_games = resData.all_half_goal_games;

        var res = {
            team_idx: this.teamInfo[divName + '_idx'],
            team_name: this.teamInfo[divName + '_name'],
            games: 0,
            no_goal_game: 0,
            no_goal_game_per: 0,
            no_lose_game: 0,
            no_lose_game_per: 0,
            both_goal_game: 0,
            both_goal_game_per: 0,
            all_half_goal_games: 0,
            all_half_goal_cnt: 0,
            all_half_goal_cnt_per: 0,
        }

        if (Object.keys(resData).length != 0) {
            res = {
                team_idx: resData.team_idx,
                team_name: resData.team_name,
                games: games,
                no_goal_game: no_goal_game,
                no_goal_game_per: this._okRound(no_goal_game, games, 0, '%'),
                no_lose_game: no_lose_game,
                no_lose_game_per: this._okRound(no_lose_game, games, 0, '%'),
                both_goal_game: both_goal_game,
                both_goal_game_per: this._okRound(both_goal_game, games, 0, '%'),
                all_half_goal_games: all_half_goal_games,
                all_half_goal_cnt: all_half_goal_cnt,
                all_half_goal_cnt_per: this._okRound(all_half_goal_cnt, all_half_goal_games, 0, '%'),
            }
        }

        return res;
    }

    getP2_1_d1(divName, name) {
        var resData = this.sumRes.p2_1[divName][name];

        return {
            team_idx: resData.team_idx,
            team_name: resData.team_name,
            games: resData.games,
            no_goal_game: resData.no_goal_game,
            no_goal_game_per: resData.no_goal_game_per
        }
    }

    getP2_1_d2(divName, name) {
        var resData = this.sumRes.p2_1[divName][name];

        return {
            team_idx: resData.team_idx,
            team_name: resData.team_name,
            games: resData.games,
            no_lose_game: resData.no_lose_game,
            no_lose_game_per: resData.no_lose_game_per
        }
    }

    getP2_1_d3(divName, name) {
        var resData = this.sumRes.p2_1[divName][name];

        return {
            team_idx: resData.team_idx,
            team_name: resData.team_name,
            games: resData.games,
            both_goal_game: resData.both_goal_game,
            both_goal_game_per: resData.both_goal_game_per
        }
    }

    getP2_1_d4(divName, name) {
        var resData = this.sumRes.p2_1[divName][name];

        return {
            team_idx: resData.team_idx,
            team_name: resData.team_name,
            all_half_goal_games: resData.all_half_goal_games,
            all_half_goal_cnt: resData.all_half_goal_cnt,
            all_half_goal_cnt_per: resData.all_half_goal_cnt_per
        }
    }

    getP2_2_d1(pageData, divName) {
        var sumData = this.sumRes.p2_2.d1[pageData.team_div]['div_' + divName];

        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            games: 1,
            goal: 0,
            lose: 0,
            W: 0,
            D: 0,
            L: 0,
            first_half_W_cnt: 0,
            team_point : 0
        }

        if (pageData.first_half_W_cnt == 1) {
            res.goal = Number(pageData.goal);
            res.lose = Number(pageData.lose);
            res.W = pageData.W;
            res.D = pageData.D;
            res.L = pageData.L;
            res.first_half_W_cnt = 1;
            res.team_point = pageData.team_point;
        }

        if (Object.keys(sumData).length != 0) {
            res.games = res.games + sumData.games;
            res.goal = res.goal + sumData.goal;
            res.lose = res.lose + sumData.lose;
            res.W = res.W + sumData.W;
            res.D = res.D + sumData.D;
            res.L = res.L + sumData.L;
            res.first_half_W_cnt = res.first_half_W_cnt + sumData.first_half_W_cnt;
            res.team_point = Number(res.team_point) + Number(sumData.team_point);
        }

        return res;
    }

    getP2_2_d1_total(divName) {
        var H = this.sumRes.p2_2.d1.home[divName];
        var A = this.sumRes.p2_2.d1.away[divName];
        var games = H.games + A.games;
        var firstHalfWin = H.first_half_W_cnt + A.first_half_W_cnt;
        var point = Number(H.team_point) + Number(A.team_point);

        return {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
            games: games,
            goal: H.goal + A.goal,
            lose: H.lose + A.lose,
            W: H.W + A.W,
            D: H.D + A.D,
            L: H.L + A.L,
            first_half_W_cnt: firstHalfWin,
            first_half_W_per: this._okRound(firstHalfWin, games, 0, '%'),
            team_point : H.team_point + A.team_point,
            team_point_avg : this._okRound(point, firstHalfWin, 2)
        }
    }

    getP2_2_d1_per(divName, name) {
        var resData = this.sumRes.p2_2.d1[name][divName];

        if (Object.keys(resData).length != 0) {
            resData.first_half_W_per = this._okRound(resData.first_half_W_cnt, resData.games, 0, '%');
            resData.team_point_avg = this._okRound(resData.team_point, resData.first_half_W_cnt, 2);
        } else {
            resData = {
                team_idx: this.teamInfo[divName + '_idx'],
                team_name: this.teamInfo[divName + '_name'],
                games: 0,
                goal: 0,
                lose: 0,
                W: 0,
                D: 0,
                L: 0,
                first_half_W_cnt: 0,
                first_half_W_per: 0,
                team_point : 0,
                team_point_avg : 0,
            }
        }

        return resData;
    }

    getP2_2_d2(pageData, divName) {
        var sumData = this.sumRes.p2_2.d2[pageData.team_div]['div_' + divName];

        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            games: 1,
            goal: 0,
            lose: 0,
            W: 0,
            D: 0,
            L: 0,
            first_half_L_cnt: 0,
            team_point : 0
        }

        if (pageData.first_half_L_cnt == 1) {
            res.goal = Number(pageData.goal);
            res.lose = Number(pageData.lose);
            res.W = pageData.W;
            res.D = pageData.D;
            res.L = pageData.L;
            res.first_half_L_cnt = 1;
            res.team_point = pageData.team_point;
        }

        if (Object.keys(sumData).length != 0) {
            res.games = res.games + sumData.games;
            res.goal = res.goal + sumData.goal;
            res.lose = res.lose + sumData.lose;
            res.W = res.W + sumData.W;
            res.D = res.D + sumData.D;
            res.L = res.L + sumData.L;
            res.first_half_L_cnt = res.first_half_L_cnt + sumData.first_half_L_cnt;
            res.team_point = Number(res.team_point) + Number(sumData.team_point);
        }

        return res;
    }

    getP2_2_d2_total(divName) {
        var H = this.sumRes.p2_2.d2.home[divName];
        var A = this.sumRes.p2_2.d2.away[divName];
        var games = H.games + A.games;
        var firstHalfLose = H.first_half_L_cnt + A.first_half_L_cnt;
        var point = Number(H.team_point) + Number(A.team_point);

        return {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
            games: games,
            goal: H.goal + A.goal,
            lose: H.lose + A.lose,
            W: H.W + A.W,
            D: H.D + A.D,
            L: H.L + A.L,
            first_half_L_cnt: firstHalfLose,
            first_half_L_per: this._okRound(firstHalfLose, games, 0, '%'),
            team_point : point,
            team_point_avg : this._okRound(point, firstHalfLose, 2),
        }
    }

    getP2_2_d2_per(divName, name) {
        var resData = this.sumRes.p2_2.d2[name][divName];

        if (Object.keys(resData).length != 0) {
            resData.first_half_L_per = this._okRound(resData.first_half_L_cnt, resData.games, 0, '%');
            resData.team_point_avg = this._okRound(resData.team_point, resData.first_half_L_cnt, 2);
        } else {
            resData = {
                team_idx: this.teamInfo[divName + '_idx'],
                team_name: this.teamInfo[divName + '_name'],
                games: 0,
                goal: 0,
                lose: 0,
                W: 0,
                D: 0,
                L: 0,
                first_half_L_cnt: 0,
                first_half_L_per: 0,
                team_point : 0 ,
                team_point_avg : 0,
            }
        }

        return resData;
    }

    getP2_3_d1(pageData, divName) {
        var sumData = this.sumRes.p2_3.d1['div_' + divName][pageData.team_div];
        var firstHalfGoal = 0;
        var secondHalfGoal = 0;
        for (var i in pageData.goalArr) {
            firstHalfGoal = this._timeCntReturn(pageData.goalArr[i], 15).first_half + firstHalfGoal;
            secondHalfGoal = this._timeCntReturn(pageData.goalArr[i], 15).second_half + secondHalfGoal;
        }
        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            total_goal: pageData.goalArr.length,
            first_half_goal: firstHalfGoal,
            second_half_goal: secondHalfGoal,
            goal_arr: pageData.goalArr,
        }

        if (Object.keys(sumData).length != 0) {
            res.total_goal = res.total_goal + sumData.total_goal;
            res.first_half_goal = res.first_half_goal + sumData.first_half_goal;
            res.second_half_goal = res.second_half_goal + sumData.second_half_goal;
            res.goal_arr = sumData.goal_arr.concat(res.goal_arr);
        }

        return res;
    }

    getP2_3_d1_avg(divName) {
        var H = this.sumRes.p2_3.d1[divName].home;
        var A = this.sumRes.p2_3.d1[divName].away;

        var keySet = [H, A];
        for (var key in keySet) {
            if (Object.keys(keySet[key]).length == 0 && key == 0) {
                H = {
                    team_idx: this.teamInfo[divName + '_idx'],
                    team_name: this.teamInfo[divName + '_name'],
                    total_goal: 0,
                    first_half_goal: 0,
                    second_half_goal: 0,
                    goal_arr: []
                }
            } else if (Object.keys(keySet[key]).length == 0 && key == 1) {
                A = {
                    team_idx: this.teamInfo[divName + '_idx'],
                    team_name: this.teamInfo[divName + '_name'],
                    total_goal: 0,
                    first_half_goal: 0,
                    second_half_goal: 0,
                    goal_arr: []
                }
            }
        }

        var totalGoal = H.total_goal + A.total_goal;
        var firstGoal = H.first_half_goal + A.first_half_goal;
        var secondGoal = H.second_half_goal + A.second_half_goal;
        var goalTime = 0;

        if (typeof H.goal_arr == 'object') {
            for (var i of H.goal_arr) {
                goalTime = goalTime + Number(i);
            }
        }
        if (typeof A.goal_arr == 'object') {
            for (var i of A.goal_arr) {
                goalTime = goalTime + Number(i);
            }
        }

        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            goals: totalGoal,
            first_goal: firstGoal,
            first_half: this._okRound(firstGoal, totalGoal, 1, '%'),
            second_goal: secondGoal,
            second_half: this._okRound(secondGoal, totalGoal, 1, '%'),
            time_avg: this._okRound(goalTime, totalGoal, 1),
        }
    }

    getP2_3_d2(pageData, divName) {
        var sumData = this.sumRes.p2_3.d2[pageData.team_div]['div_' + divName];
        // console.log(pageData);
        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            games: 1,
            time_W: pageData.time_W,
            time_D: pageData.time_D,
            time_L: pageData.time_L,
        }

        if (Object.keys(sumData).length != 0) {
            res.games = res.games + sumData.games;
            res.time_W = res.time_W + sumData.time_W;
            res.time_D = res.time_D + sumData.time_D;
            res.time_L = res.time_L + sumData.time_L;
        }

        return res;
    }
    getP2_3_d2_per(divName, name){
        var sumData = this.sumRes.p2_3.d2[name][divName];

        var games = sumData.games ;
        var timeObj = {
            timeW : Number(sumData.time_W),
            timeD : Number(sumData.time_D),
            timeL : Number(sumData.time_L),
        }
        var timeLen = timeObj.timeW + timeObj.timeD + timeObj.timeL;
        var timeRes = {};

        for(var timeKey in timeObj) {
            var subTime = new Date(this._okRound(timeObj[timeKey] * 60000, games, 2));
            var subHours = subTime.getHours() - 9;
            var subMinutes = subTime.getMinutes();
            var subSeconds = String(subTime.getSeconds()).length == 2 ? subTime.getSeconds() : '0' + subTime.getSeconds();
            var fullMinutes = (subHours * 60) + subMinutes ;
            fullMinutes = String(fullMinutes).length == 2 ? fullMinutes :  '0' + fullMinutes ;
            timeRes[timeKey] = fullMinutes + ':' + subSeconds;
        }

        return {
            team_idx: sumData.team_idx,
            team_name: sumData.team_name,
            games: games,
            time_W: timeRes.timeW,
            time_D: timeRes.timeD,
            time_L: timeRes.timeL,
            time_W_per: this._okRound(timeObj.timeW, timeLen, 0, 'G'),
            time_D_per: this._okRound(timeObj.timeD, timeLen, 0, 'G'),
            time_L_per: this._okRound(timeObj.timeL, timeLen, 0, 'G'),
        }

    }

    getP2_3_d2_total(divName) {
        var H = this.sumRes.p2_3.d2.home[divName];
        var A = this.sumRes.p2_3.d2.away[divName];

        if (Object.keys(H).length == 0) {
            H = {
                team_idx: this.teamInfo[divName + '_idx'],
                team_name: this.teamInfo[divName + '_name'],
                games: 0,
                time_W: 0,
                time_D: 0,
                time_L: 0,
            }
            this.sumRes.p2_3.d2.home[divName] = H;
        }

        if (Object.keys(A).length == 0) {
            A = {
                team_idx: this.teamInfo[divName + '_idx'],
                team_name: this.teamInfo[divName + '_name'],
                games: 0,
                time_W: 0,
                time_D: 0,
                time_L: 0,
            }
            this.sumRes.p2_3.d2.away[divName] = A;
        }

        var games = H.games + A.games;
        var timeW = Number(H.time_W) + Number(A.time_W);
        var timeD = Number(H.time_D) + Number(A.time_D);
        var timeL = Number(H.time_L) + Number(A.time_L);
        var timeLen = timeW + timeD + timeL;

        return {
            team_idx: H.team_idx !== undefined ? H.team_idx : A.team_idx,
            team_name: H.team_name !== undefined ? H.team_name : A.team_name,
            games: games,
            time_W: this._okRound(timeW, games, 1),
            time_D: this._okRound(timeD, games, 1),
            time_L: this._okRound(timeL, games, 1),
            time_W_per: this._okRound(timeW, timeLen, 0, 'G'),
            time_D_per: this._okRound(timeD, timeLen, 0, 'G'),
            time_L_per: this._okRound(timeL, timeLen, 0, 'G'),
        }
    }

    getP2_3_d3(pageData, divName) {
        var sumData = this.sumRes.p2_3.d3[pageData.team_div]['div_' + divName];
        var resKey = ['time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90', 'first_half', 'second_half'];
        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
        };

        for (var i of resKey) {
            res[i] = 0;
        }

        for (var i in pageData.goalArr) {
            var timeCntReturn = this._timeCntReturn(pageData.goalArr[i], 15)
            for (var resVal of resKey) {
                res[resVal] = timeCntReturn[resVal] + res[resVal];
            }
        }

        if (Object.keys(sumData).length != 0) {
            for (var resVal of resKey) {
                res[resVal] = res[resVal] + sumData[resVal];
            }
        }

        return res;
    }

    getP2_3_d3_total(divName) {
        var H = this.sumRes.p2_3.d3.home[divName];
        var A = this.sumRes.p2_3.d3.away[divName];
        var resKey = ['time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90', 'first_half', 'second_half'];
        var res = {
            team_idx: this.teamInfo[divName + '_idx'],
            team_name: this.teamInfo[divName + '_name'],
        };

        if (Object.keys(H).length == 0) {
            for (var i of resKey) {
                H[i] = 0;
            }
            this.sumRes.p2_3.d3.home[divName] = H;
            this.sumRes.p2_3.d3.home[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d3.home[divName].team_name = this.teamInfo[divName + '_name'];
        }

        if (Object.keys(A).length == 0) {
            for (var i of resKey) {
                A[i] = 0;
            }
            this.sumRes.p2_3.d3.away[divName] = A;
            this.sumRes.p2_3.d3.away[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d3.away[divName].team_name = this.teamInfo[divName + '_name'];
        }

        for (var i of resKey) {
            res[i] = H[i] + A[i]
        }

        return res;
    }

    getP2_3_d4(pageData, divName) {
        var sumData = this.sumRes.p2_3.d4[pageData.team_div]['div_' + divName];
        var resKey = ['time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90', 'first_half', 'second_half'];
        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
        };

        for (var i of resKey) {
            res[i] = 0;
        }

        for (var i in pageData.loseArr) {
            var timeCntReturn = this._timeCntReturn(pageData.loseArr[i], 15)
            for (var resVal of resKey) {
                res[resVal] = timeCntReturn[resVal] + res[resVal];
            }
        }

        if (Object.keys(sumData).length != 0) {
            for (var resVal of resKey) {
                res[resVal] = res[resVal] + sumData[resVal];
            }
        }

        return res;
    }

    getP2_3_d4_total(divName) {
        var H = this.sumRes.p2_3.d4.home[divName];
        var A = this.sumRes.p2_3.d4.away[divName];
        var resKey = ['time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90', 'first_half', 'second_half'];
        var res = {
            team_idx: this.teamInfo[divName + '_idx'],
            team_name: this.teamInfo[divName + '_name'],
        };

        if (Object.keys(H).length == 0) {
            for (var i of resKey) {
                H[i] = 0;
            }
            this.sumRes.p2_3.d4.home[divName] = H;
            this.sumRes.p2_3.d4.home[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d4.home[divName].team_name = this.teamInfo[divName + '_name'];
        }

        if (Object.keys(A).length == 0) {
            for (var i of resKey) {
                A[i] = 0;
            }
            this.sumRes.p2_3.d4.away[divName] = A;
            this.sumRes.p2_3.d4.away[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d4.away[divName].team_name = this.teamInfo[divName + '_name'];
        }


        for (var i of resKey) {
            res[i] = H[i] + A[i]
        }

        return res;
    }

    getP2_3_d5(pageData, divName) {
        var sumData = this.sumRes.p2_3.d5[pageData.team_div]['div_' + divName];
        var resKey = ['time_0_10', 'time_11_20', 'time_21_30', 'time_31_40', 'time_41_50', 'time_51_60', 'time_61_70', 'time_71_80', 'time_81_90', 'first_half', 'second_half'];
        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
        };

        for (var i of resKey) {
            res[i] = 0;
        }

        for (var i in pageData.goalArr) {
            var timeCntReturn = this._timeCntReturn(pageData.goalArr[i], 10)
            for (var resVal of resKey) {
                res[resVal] = timeCntReturn[resVal] + res[resVal];
            }
        }

        if (Object.keys(sumData).length != 0) {
            for (var resVal of resKey) {
                res[resVal] = res[resVal] + sumData[resVal];
            }
        }

        return res;
    }

    getP2_3_d5_total(divName) {
        var H = this.sumRes.p2_3.d5.home[divName];
        var A = this.sumRes.p2_3.d5.away[divName];
        var resKey = ['time_0_10', 'time_11_20', 'time_21_30', 'time_31_40', 'time_41_50', 'time_51_60', 'time_61_70', 'time_71_80', 'time_81_90', 'first_half', 'second_half'];
        var res = {
            team_idx: this.teamInfo[divName + '_idx'],
            team_name: this.teamInfo[divName + '_name'],
        };

        if (Object.keys(H).length == 0) {
            for (var i of resKey) {
                H[i] = 0;
            }
            this.sumRes.p2_3.d5.home[divName] = H;
            this.sumRes.p2_3.d5.home[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d5.home[divName].team_name = this.teamInfo[divName + '_name'];
        }

        if (Object.keys(A).length == 0) {
            for (var i of resKey) {
                A[i] = 0;
            }
            this.sumRes.p2_3.d5.away[divName] = A;
            this.sumRes.p2_3.d5.away[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d5.away[divName].team_name = this.teamInfo[divName + '_name'];
        }

        for (var i of resKey) {
            res[i] = H[i] + A[i]
        }

        return res;
    }

    getP2_3_d6(pageData, divName) {
        var sumData = this.sumRes.p2_3.d6[pageData.team_div]['div_' + divName];
        var resKey = ['time_0_10', 'time_11_20', 'time_21_30', 'time_31_40', 'time_41_50', 'time_51_60', 'time_61_70', 'time_71_80', 'time_81_90', 'first_half', 'second_half'];
        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
        };

        for (var i of resKey) {
            res[i] = 0;
        }

        for (var i in pageData.loseArr) {
            var timeCntReturn = this._timeCntReturn(pageData.loseArr[i], 10)
            for (var resVal of resKey) {
                res[resVal] = timeCntReturn[resVal] + res[resVal];
            }
        }

        if (Object.keys(sumData).length != 0) {
            for (var resVal of resKey) {
                res[resVal] = res[resVal] + sumData[resVal];
            }
        }
        return res;
    }

    getP2_3_d6_total(divName) {
        var H = this.sumRes.p2_3.d6.home[divName];
        var A = this.sumRes.p2_3.d6.away[divName];
        var resKey = ['time_0_10', 'time_11_20', 'time_21_30', 'time_31_40', 'time_41_50', 'time_51_60', 'time_61_70', 'time_71_80', 'time_81_90', 'first_half', 'second_half'];
        var res = {
            team_idx: this.teamInfo[divName + '_idx'],
            team_name: this.teamInfo[divName + '_name'],
        };

        if (Object.keys(H).length == 0) {
            for (var i of resKey) {
                H[i] = 0;
            }
            this.sumRes.p2_3.d6.home[divName] = H;
            this.sumRes.p2_3.d6.home[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d6.home[divName].team_name = this.teamInfo[divName + '_name'];
        }

        if (Object.keys(A).length == 0) {
            for (var i of resKey) {
                A[i] = 0;
            }
            this.sumRes.p2_3.d6.away[divName] = A;
            this.sumRes.p2_3.d6.away[divName].team_idx = this.teamInfo[divName + '_idx'];
            this.sumRes.p2_3.d6.away[divName].team_name = this.teamInfo[divName + '_name'];
        }

        for (var i of resKey) {
            res[i] = H[i] + A[i]
        }

        return res;
    }

    _timeCntReturn(time, standard) {
        var len = 90 / standard;
        var timeEnd = -1;
        var res = {};
        var time = time == null ? undefined : time;

        for (var i = 0; i < len; i++) {
            var timeStart = timeEnd + 1;
            var timeEnd = timeStart == 0 ? standard + timeStart : standard + timeStart - 1;

            if (timeStart <= time && time <= timeEnd) {
                res['time_' + timeStart + '_' + timeEnd] = 1;
            } else {
                res['time_' + timeStart + '_' + timeEnd] = 0;
            }
        }

        if (time < 46) {
            res.first_half = 1;
            res.second_half = 0;
            res.game_cnt = 1;
        } else if (time > 45) {
            res.first_half = 0;
            res.second_half = 1;
            res.game_cnt = 1;
        } else {
            res.first_half = 0;
            res.second_half = 0;
            res.game_cnt = 0;
        }
        return res;
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

    setResDataKey() {
        this.sumRes.p2_1 = this.getTotalKey();
        this.sumRes.p2_2.d1 = this.getReverseTotalKey();
        this.sumRes.p2_2.d2 = this.getReverseTotalKey();
        this.sumRes.p2_3.d1 = this.getAvgKey();
        this.sumRes.p2_3.d2 = this.getReverseTotalKey();
        this.sumRes.p2_3.d3 = this.getReverseTotalKey();
        this.sumRes.p2_3.d4 = this.getReverseTotalKey();
        this.sumRes.p2_3.d5 = this.getReverseTotalKey();
        this.sumRes.p2_3.d6 = this.getReverseTotalKey();
    }

    setKeyDefault() {
        //key default 0 set
        for (var pageKey in this.sumRes) {
            for (var divKey in this.sumRes[pageKey]) {
                this.sumRes[pageKey][divKey] = this.getAvgKey();
                for (var divName in this.sumRes[pageKey][divKey]) {
                    for (var name in this.sumRes[pageKey][divKey][divName]) {
                        for (var divKeyName of this.divKey[pageKey][divKey]) {
                            this.sumRes[pageKey][divKey][divName][name][divKeyName] = 0;
                            if (divKeyName == 'team_name') {
                                //keyName set
                            }
                        }
                    }
                }
            }
        }
    }


    getAvgKey() {
        return {
            div_home: {
                home: {},
                away: {},
            },
            div_away: {
                home: {},
                away: {},
            }
        }
    }

    getReverseKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            }
        };
    }

    getTotalKey() {
        return {
            div_home: {
                home: {},
                away: {},
                total: {}
            },
            div_away: {
                home: {},
                away: {},
                total: {}
            }
        }
    }

    getReverseTotalKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            },
            total: {
                div_home: {},
                div_away: {}
            }
        };
    }

}

class DetailPageTwo {
    constructor(originData, divTeamIdx) {
        this.res = {
            p2_1_no_goal_lose: {},
            p2_2_half_Performance: {},
            p2_3_time_goal_lose: {}
        }

        if (originData.config.home_team_idx == divTeamIdx) {
            var teamDiv = {main: 'home', sub: 'away'};
        } else if (originData.config.away_team_idx == divTeamIdx) {
            var teamDiv = {main: 'away', sub: 'home'};
        }

        this.setConfigData(originData, teamDiv);
        if (originData.key_event.length != 0 && originData.key_event.length !== undefined) {
            this.setKeyEventData(originData, teamDiv);
        }else if(Number(this.configData.goal) === 0 && Number(this.configData.lose) === 0 ){
            this.setKeyEventData(originData, teamDiv);
        }
        //console.log(originData.key_event);

        //console.log(this.keyEventData);

        this.setDetailPageTwo(originData, teamDiv);
        //console.log(this.keyEventData);
        //console.log(this.res.p2_1_no_goal_lose);
        //console.log(this.res.p2_2_half_Performance);
    }

    setDetailPageTwo(originData, teamDiv) {
        if (Object.keys(originData.config).length != 0 && Object.keys(originData.config).length !== undefined) {
            this.res.p2_1_no_goal_lose = this.getNoGoalLose();

            if (originData.key_event.length != 0 && originData.key_event.length !== undefined) {
                this.res.p2_1_no_goal_lose = Object.assign(this.res.p2_1_no_goal_lose, this.getNoGoalLoseAssign());
                this.res.p2_2_half_Performance = this.getHalfPerformance();
                this.res.p2_3_time_goal_lose = this.getTimeGoalLose();
            }
        }
        if (originData.key_event.length != 0 && originData.key_event.length !== undefined) {

        }else if(Number(this.configData.goal) === 0 && Number(this.configData.lose) === 0 ){
            this.res.p2_1_no_goal_lose = Object.assign(this.res.p2_1_no_goal_lose, this.getNoGoalLoseAssign());
            this.res.p2_2_half_Performance = this.getHalfPerformance();
            this.res.p2_3_time_goal_lose = this.getTimeGoalLose();
        }
        if (originData.tech_statistics.length != 0 && originData.tech_statistics.length !== undefined) {
            //console.log('tech');
        }
    }

    setConfigData(originData, teamDiv) {
        var config = originData.config;
        var teamResData = this._teamResData(originData, teamDiv);
        var goal = config[teamDiv.main + '_goal'] !== '' ? config[teamDiv.main + '_goal'] : null;
        var lose = config[teamDiv.sub + '_goal'] !== '' ? config[teamDiv.sub + '_goal'] : null;
        var noGoalLose = this._noGoalLose(goal, lose);

        this.configData = {
            game_idx: config.game_idx,
            team_div: teamDiv.main,
            team_name: config[teamDiv.main + '_name'],
            team_idx: config[teamDiv.main + '_team_idx'],
            league_idx: config.league_idx,
            league_name: config.league_name,
            league_color: config.league_color,
            goal: goal,
            lose: lose,
            goal_half: config[teamDiv.main + '_goal_half'] != '' ? config[teamDiv.main + '_goal_half'] : null,
            lose_half: config[teamDiv.sub + '_goal_half'] != '' ? config[teamDiv.sub + '_goal_half'] : null,
            score: config.home_goal + '-' + config.away_goal,
            team_diff: teamResData.team_diff,
            W: teamResData.W,
            D: teamResData.D,
            L: teamResData.L,
            no_goal_game: noGoalLose.noGoalGame,
            no_lose_game: noGoalLose.noLoseGame,
            both_goal_game: noGoalLose.bothGoalGame,
            //team_res : teamResData.team_res ,
            team_point : teamResData.team_point ,
        }
    }

    setKeyEventData(originData, teamDiv) {
        var config = originData.config;
        var keyEvent = originData.key_event;
        //console.log(config);
        var halfFullGoal = {
            firstHalfGoal: 0,
            firstHalfLose: 0,
            secondHalfGoal: 0,
            secondHalfLose: 0,
        }
        var winLoseTime = {
            goal: [],
            lose: [],
            timeW: 0,
            timeD: 90,
            timeL: 0,
        }
        var allHalfGoal = 0;
        var goal = [];

        for (var event of keyEvent) {
            if (event.event_name == 'Goal' || event.event_name == 'Penalty scored' || event.event_name == 'Own goal') {
                var resHalfGoal = this._halfFullGoal(event, teamDiv, halfFullGoal);
                halfFullGoal.firstHalfGoal = resHalfGoal.firstHalfGoal + halfFullGoal.firstHalfGoal;
                halfFullGoal.firstHalfLose = resHalfGoal.firstHalfLose + halfFullGoal.firstHalfLose;
                halfFullGoal.secondHalfGoal = resHalfGoal.secondHalfGoal + halfFullGoal.secondHalfGoal;
                halfFullGoal.secondHalfLose = resHalfGoal.secondHalfLose + halfFullGoal.secondHalfLose;

                winLoseTime = this._winLoseTime(event, teamDiv, winLoseTime);
            }
        }

        if (halfFullGoal.firstHalfGoal != 0 && halfFullGoal.secondHalfGoal != 0) {
            var allHalfGoal = 1;
        }

        var halfRes = this._halfPerformance(halfFullGoal);

        this.keyEventData = {
            goal: winLoseTime.goal,
            lose: winLoseTime.lose,
            all_half_goal_cnt: allHalfGoal,
            first_half_W_cnt: halfRes.firstHalfWin,
            first_half_L_cnt: halfRes.firstHalfLose,
            half_goal_first: halfFullGoal.firstHalfGoal,
            half_goal_second: halfFullGoal.secondHalfGoal,
            time_W: winLoseTime.timeW,
            time_D: winLoseTime.timeD,
            time_L: winLoseTime.timeL,
        }
    }

    getDetailPageTwo() {
        return this.res;
    }

    getNoGoalLose() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_name: this.configData.team_name,
            team_idx: this.configData.team_idx,
            league_idx: this.configData.league_idx,
            league_name: this.configData.league_name,
            league_color: this.configData.league_color,
            goal: this.configData.goal,
            lose: this.configData.lose,
            no_goal_game: this.configData.no_goal_game,
            no_lose_game: this.configData.no_lose_game,
            both_goal_game: this.configData.both_goal_game,
            all_half_goal_cnt: null,
            goalArr: null,
            loseArr: null
        }
    }

    getNoGoalLoseAssign() {
        return {
            all_half_goal_cnt: this.keyEventData.all_half_goal_cnt,
            goalArr: this.keyEventData.goal,
            loseArr: this.keyEventData.lose,
        }
    }

    getHalfPerformance() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_name: this.configData.team_name,
            team_idx: this.configData.team_idx,
            league_idx: this.configData.league_idx,
            league_name: this.configData.league_name,
            league_color: this.configData.league_color,
            goal: this.configData.goal,
            lose: this.configData.lose,
            W: this.configData.W,
            D: this.configData.D,
            L: this.configData.L,
            team_point : this.configData.team_point,
            first_half_W_cnt: this.keyEventData.first_half_W_cnt,
            first_half_L_cnt: this.keyEventData.first_half_L_cnt,
            goalArr: this.keyEventData.goal,
            loseArr: this.keyEventData.lose,
        }
    }

    getTimeGoalLose() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_name: this.configData.team_name,
            team_idx: this.configData.team_idx,
            league_idx: this.configData.league_idx,
            league_name: this.configData.league_name,
            league_color: this.configData.league_color,
            goalArr: this.keyEventData.goal,
            loseArr: this.keyEventData.lose,
            time_W: this.keyEventData.time_W,
            time_D: this.keyEventData.time_D,
            time_L: this.keyEventData.time_L,
        }
    }

    _winLoseTime(event, teamDiv, winLoseTime) {
        //console.log(winLoseTime);
        var goal = winLoseTime.goal.length;
        var lose = winLoseTime.lose.length;

        if (event.team_div == teamDiv.main) {
            winLoseTime.goal.push(event.time);
            if (goal == 0 && lose == 0) {
                winLoseTime.timeD = Number(event.time);
                winLoseTime.timeW = 90 - Number(event.time);
            } else {
                if (goal == lose) {
                    goal = goal + 1;
                    if (goal > lose) {
                        winLoseTime.timeD = winLoseTime.timeD - (90 - Number(event.time));
                        winLoseTime.timeW = 90 - Number(event.time) + winLoseTime.timeW;
                    }
                } else if (goal < lose) {
                    goal = goal + 1;
                    if (goal == lose) {
                        winLoseTime.timeL = Number(event.time) - (90 - winLoseTime.timeL);
                        winLoseTime.timeD = 90 - Number(event.time) + winLoseTime.timeD;
                    }
                }
            }
        } else if (event.team_div == teamDiv.sub) {
            winLoseTime.lose.push(event.time);
            if (goal == 0 && lose == 0) {
                winLoseTime.timeD = Number(event.time);
                winLoseTime.timeL = 90 - Number(event.time);
            } else {
                if (goal == lose) {
                    lose = lose + 1;
                    if (goal < lose) {
                        winLoseTime.timeD = winLoseTime.timeD - (90 - Number(event.time));
                        winLoseTime.timeL = 90 - Number(event.time) + winLoseTime.timeL;
                    }
                } else if (goal > lose) {
                    lose = lose + 1;
                    if (goal == lose) {
                        winLoseTime.timeW = Number(event.time) - (90 - winLoseTime.timeW);
                        winLoseTime.timeD = 90 - Number(event.time) + winLoseTime.timeD;
                    }
                }
            }
        }

        return winLoseTime;
    }

    _halfPerformance(halfFullGoal) {
        var firstHalfWin = 0;
        var firstHalfLose = 0;
        if (halfFullGoal.firstHalfGoal > halfFullGoal.firstHalfLose) {
            firstHalfWin = 1;
        } else if (halfFullGoal.firstHalfGoal < halfFullGoal.firstHalfLose) {
            firstHalfLose = 1;
        }

        return {
            firstHalfWin: firstHalfWin,
            firstHalfLose: firstHalfLose,
        }
    }

    _noGoalLose(goal, lose) {
        var noGoalGame = 0;
        var noLoseGame = 0;
        var bothGoalGame = 0;

        if (goal != null) {
            if (goal == 0) {
                noGoalGame = 1;
            }
            if (lose == 0) {
                noLoseGame = 1;
            }
            if (goal != 0 && lose != 0) {
                var bothGoalGame = 1;
            }
        }
        return {
            noGoalGame: noGoalGame,
            noLoseGame: noLoseGame,
            bothGoalGame: bothGoalGame,
        }
    }

    _halfFullGoal(event, teamDiv) {
        var firstHalfGoal = 0;
        var firstHalfLose = 0;
        var secondHalfGoal = 0;
        var secondHalfLose = 0;

        if (event.team_div == teamDiv.main) {
            if (event.time <= 45) {
                firstHalfGoal = 1;
            } else if (event.time > 45) {
                secondHalfGoal = 1;
            }
        } else if (event.team_div == teamDiv.sub) {
            if (event.time <= 45) {
                firstHalfLose = 1;
            } else if (event.time > 45) {
                secondHalfLose = 1;
            }
        }

        return {
            firstHalfGoal: firstHalfGoal,
            firstHalfLose: firstHalfLose,
            secondHalfGoal: secondHalfGoal,
            secondHalfLose: secondHalfLose,
        }
    }

    _teamResData(originData, teamDiv) {
        var data = originData.config;
        var team_diff = null;
        var W = 0;
        var D = 0;
        var L = 0;
        var team_point = null;

        if (data[teamDiv.main + '_goal'] !== '' && data[teamDiv.sub + '_goal'] !== '') {
            team_diff = Number(data[teamDiv.main + '_goal']) - Number(data[teamDiv.sub + '_goal']);

            if (data[teamDiv.main + '_goal'] < data[teamDiv.sub + '_goal']) {
                L = 1;
                team_point = '0';
            } else if (data[teamDiv.main + '_goal'] > data[teamDiv.sub + '_goal']) {
                W = 1;
                team_point = '3';
            } else if (data[teamDiv.main + '_goal'] == data[teamDiv.sub + '_goal']) {
                D = 1;
                team_point  = '1';
            }
        }
        return {
            team_diff: team_diff,
            W: W,
            D: D,
            L: L,
            team_point : team_point,
        }
    }

}

class DetailPageOneSum {
    constructor(resData, teamInfo) {
        this.teamInfo = teamInfo;

        this.sumRes = this.getResKey();
        this.divKey = {
            p1_1: {
                d1: ['team_name', 'team_idx', 'game', 'W', 'D', 'L', 'goal', 'lose', 'diff', 'point'],
                d2: ['team_name', 'team_idx', 'game', 'goal', 'lose', 'point'],
                d3: ['game_idx', 'team_name', 'team_idx', 'game', 'goal', 'lose', 'point'],
            },
            p1_2: {
                d1: []
            },
            p1_3: {
                d1: ['team_name', 'team_idx', 'first_goal', 'first_lose', 'no_score'],
                d2: ['first_goal_total', 'first_half', 'per_first_half', 'per_second_half', 'second_half', 'team_idx', 'team_name', 'time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90'],
                d3: ['first_lose_total', 'first_half', 'per_first_half', 'per_second_half', 'second_half', 'team_idx', 'team_name', 'time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90'],
                d4: ['D', 'L', 'W', 'first_goal', 'games', 'goal', 'lose', 'per_first_goal', 'team_idx', 'team_name'],
                d5: ['D', 'L', 'W', 'first_lose', 'games', 'goal', 'lose', 'per_first_lose', 'team_idx', 'team_name'],
            },
            p1_4: {
                d1: [],
                d2: []
            },
            p1_5: {
                d1: []
            },
        }

        this.res = this.getResKey();

        this.setKeyDefault();

        this.setResDataKey();
    }

    setKeyDefault() {
        //key default 0 set
        for (var pageKey in this.sumRes) {
            for (var divKey in this.sumRes[pageKey]) {
                this.sumRes[pageKey][divKey] = this.getAvgKey();
                for (var divName in this.sumRes[pageKey][divKey]) {
                    for (var name in this.sumRes[pageKey][divKey][divName]) {
                        for (var divKeyName of this.divKey[pageKey][divKey]) {
                            this.sumRes[pageKey][divKey][divName][name][divKeyName] = null;
                            if (divKeyName == 'team_name') {
                                //keyName set
                            }
                        }
                    }
                }
            }
        }
    }


    getResKey() {
        return {
            p1_1: {
                d1: {},
                d2: {},
                d3: {}
            },
            p1_2: {
                d1: {}
            },
            p1_3: {
                d1: {},
                d2: {},
                d3: {},
                d4: {},
                d5: {}
            },
            p1_4: {
                d1: {},
                d2: {}
            },
            p1_5: {
                d1: {}
            },
        }
    }

    getAvgKey() {
        return {
            div_home: {
                home: {},
                away: {},
            },
            div_away: {
                home: {},
                away: {},
            }
        }
    }

    getReverseKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            }
        };
    }

    getReverseTotalKey() {
        return {
            home: {
                div_home: {},
                div_away: {}
            },
            away: {
                div_home: {},
                div_away: {}
            },
            total: {
                div_home: {},
                div_away: {}
            }
        };
    }

    setResDataPart_1(divData, pageData, divName) {
        this.setP1_1(divData[pageData].p1_1_HA_analysis, divName);
        this.setP1_2(divData[pageData].p1_2_score_stats, divName);
        this.setP1_3(divData[pageData].p1_3_first_goal_lose, divName);
        this.setP1_4(divData[pageData].p1_4_lead_goal_permit, divName);
        this.setP1_5(divData[pageData].p1_5_goal_type_stats, divName);
    }

    setResDataPart_2() {
        this.setP1_2_d1_sort();
        this.res.p1_3.d2 = this.getReverseTotalKey();
        this.res.p1_3.d3 = this.getReverseTotalKey();
        this.res.p1_3.d4 = this.getReverseTotalKey();
        this.res.p1_3.d5 = this.getReverseTotalKey();
        this.res.p1_4.d1 = this.getReverseTotalKey();
        this.res.p1_4.d2 = this.getReverseTotalKey();
        this.res.p1_5.d1 = this.getReverseTotalKey();
    }

    setResDataPart_3(divName) {
        this.setP1_1_avg(divName);
        this.sumRes.p1_3.d1[divName].percent = this.getP1_3_d1_per(divName);
        this.res.p1_3.d1[divName] = this.sumRes.p1_3.d1[divName];
        this.res.p1_3.d2.total[divName] = this.getP1_3_d2_total(divName);
        this.res.p1_3.d3.total[divName] = this.getP1_3_d3_total(divName);
        this.res.p1_3.d4.total[divName] = this.getP1_3_d4_total(divName);
        this.res.p1_3.d5.total[divName] = this.getP1_3_d5_total(divName);
        this.res.p1_4.d1.total[divName] = this.getP1_4_d1_total(divName);
        this.res.p1_4.d2.total[divName] = this.getP1_4_d2_total(divName);
        this.res.p1_5.d1.total[divName] = this.getP1_5_d1_total(divName);
    }

    setResDataPart_4(divName, name) {
        this.setResDataKeyDefault(divName, name);

        Object.assign(this.sumRes.p1_3.d2[name][divName], this.getP1_3_d2_per(divName, name));
        Object.assign(this.sumRes.p1_3.d3[name][divName], this.getP1_3_d3_per(divName, name));
        Object.assign(this.sumRes.p1_3.d4[name][divName], this.getP1_3_d4_per(divName, name));
        Object.assign(this.sumRes.p1_3.d5[name][divName], this.getP1_3_d5_per(divName, name));


        this.res.p1_3.d2[name][divName] = this.sumRes.p1_3.d2[name][divName];
        this.res.p1_3.d3[name][divName] = this.sumRes.p1_3.d3[name][divName];
        this.res.p1_3.d4[name][divName] = this.sumRes.p1_3.d4[name][divName];
        this.res.p1_3.d5[name][divName] = this.sumRes.p1_3.d5[name][divName];
        this.res.p1_4.d1[name][divName] = this.getP1_4_d1(divName, name);
        this.res.p1_4.d2[name][divName] = this.getP1_4_d2(divName, name);
        this.res.p1_5.d1[name][divName] = this.getP1_5_d1(divName, name);
    }

    setResDataKey() {
        this.sumRes.p1_3.d2 = this.getReverseKey();
        this.sumRes.p1_3.d3 = this.getReverseKey();
        this.sumRes.p1_3.d4 = this.getReverseKey();
        this.sumRes.p1_3.d5 = this.getReverseKey();
        this.sumRes.p1_4 = this.getReverseKey();
        this.sumRes.p1_5 = this.getReverseKey();
    }

    setResDataKeyDefault(divName, name) {
        var keyArrP1_3 = ['2', '3', '4', '5'];
        var keyArrP1_4 = ['1', '2'];
        var keyDefault = this.getSumResDefaultValue(divName);

        for (var index of keyArrP1_3) {
            if (Object.keys(this.sumRes.p1_3['d' + index][name][divName]).length == 0) {
                this.sumRes.p1_3['d' + index][name][divName] = keyDefault['p1_3_d' + index];
            }
        }
    }

    getSumResDefaultValue(divName) {
        var resList = {
            p1_3_d2: {},
            p1_3_d3: {},
            p1_3_d4: {},
            p1_3_d5: {},
        }
        var key = {
            p1_3_d2: ['first_goal_total', 'first_half', 'second_half', 'team_idx', 'team_name', 'time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90'],
            p1_3_d3: ['first_lose_total', 'first_half', 'second_half', 'team_idx', 'team_name', 'time_0_15', 'time_16_30', 'time_31_45', 'time_46_60', 'time_61_75', 'time_76_90'],
            p1_3_d4: ['W', 'D', 'L', 'first_goal', 'games', 'goal', 'lose', 'per_first_goal', 'team_idx', 'team_name'],
            p1_3_d5: ['W', 'D', 'L', 'first_lose', 'games', 'goal', 'lose', 'per_first_lose', 'team_idx', 'team_name'],
            p1_5_d1: ['games', 'lead_goal_cnt', 'lead_goal_per', 'lead_permit_cnt', 'lead_permit_per', 'other_goal_cnt', 'other_goal_per', 'other_permit_cnt', 'other_permit_per', 'team_idx', 'team_name', 'tie_goal_cnt', 'tie_goal_per', 'tie_permit_cnt', 'tie_permit_per'],
        }
        var res = {
            p1_3_d2: {},
            p1_3_d3: {},
            p1_3_d4: {},
            p1_3_d5: {},
        }
        for (var resKey in resList) {
            var keyArr = key[resKey];
            for (var keyVal of keyArr) {
                if (keyVal == 'team_idx') {
                    res[resKey][keyVal] = this.teamInfo[divName + '_idx'];
                } else if (keyVal == 'team_name') {
                    res[resKey][keyVal] = this.teamInfo[divName + '_name'];
                } else {
                    res[resKey][keyVal] = 0;
                }
            }
        }

        return res;
    }

    setP1_1(pageData, divName) {
        this.sumRes.p1_1.d1['div_' + divName][pageData.team_div] = this.getP1_1_d1(pageData, divName);
        this.sumRes.p1_1.d2['div_' + divName][pageData.team_div] = this.getP1_1_d2_sum(pageData, divName);
        this.sumRes.p1_1.d3['div_' + divName][pageData.team_div] = this.getP1_1_d3_sum(pageData, divName);
    }

    setP1_1_avg(divName) {
        this.res.p1_1.d1 = this.sumRes.p1_1.d1;
        this.res.p1_1.d2[divName] = this.getP1_1_d2_avg(divName);
        this.res.p1_1.d3[divName] = this.getP1_1_d3_avg(divName);
    }

    setP1_2(pageData, divName) {
        var dataCnt = this.sumRes.p1_2.d1['div_' + divName][pageData.team_div];
        var score = pageData.score;

        if (!dataCnt.hasOwnProperty(score)) {
            this.sumRes.p1_2.d1['div_' + divName][pageData.team_div][score] = 1;
        } else {
            this.sumRes.p1_2.d1['div_' + divName][pageData.team_div][score] = dataCnt[score] + 1;
        }
    }

    setP1_2_d1_sort(pageData) {
        var res = this.getAvgKey();
        var resSort = this.getAvgKey();
        var resTmp = this.getAvgKey();

        for (var divName in this.sumRes.p1_2.d1) {
            for (var name in this.sumRes.p1_2.d1[divName]) {
                resSort[divName][name] = [];
                res[divName][name] = [];
                resTmp[divName][name] = [];
                for (var scoreVal in this.sumRes.p1_2.d1[divName][name]) {
                    resSort[divName][name].push(this.sumRes.p1_2.d1[divName][name][scoreVal]);
                }

                //console.log(resSort[divName][name].length);

                if (resSort[divName][name].length != 0) {
                    var perLen = resSort[divName][name].reduce((a, b) => a + b);
                } else {
                    var perLen = 1;
                }


                resSort[divName][name] = Array.from(new Set(resSort[divName][name]));
                resSort[divName][name] = resSort[divName][name].sort(function (a, b) {
                    return b - a;
                });
                var resLen = 0;


                for (var sortVal of resSort[divName][name]) {
                    //count sort
                    resTmp[divName][name] = [];
                    for (var scoreVal in this.sumRes.p1_2.d1[divName][name]) {
                        if (this.sumRes.p1_2.d1[divName][name][scoreVal] == sortVal) {
                            resLen = this.sumRes.p1_2.d1[divName][name][scoreVal] + resLen;
                            var pushHomeGoal = Number(scoreVal.split('-')[0]);
                            var pushAwayGoal = Number(scoreVal.split('-')[1]);
                            if (name == 'home') {
                                var goalDiff = pushHomeGoal - pushAwayGoal;
                            } else if (name == 'away') {
                                var goalDiff = pushAwayGoal - pushHomeGoal;
                            }

                            var pushData = {
                                'score': scoreVal,
                                'count': this.sumRes.p1_2.d1[divName][name][scoreVal],
                                'percent': Math.round((this.sumRes.p1_2.d1[divName][name][scoreVal] / perLen) * 100),
                                'goal_diff': goalDiff
                            };

                            resTmp[divName][name].push(pushData);
                        }
                    }
                    //goalDiff sort
                    var goalDiffArr = [];
                    for (var countKey of resTmp[divName][name]) {
                        //console.log(countKey.count);
                        if (countKey.count == sortVal) {
                            goalDiffArr.push(countKey.goal_diff);
                        }
                    }
                    goalDiffArr = Array.from(new Set(goalDiffArr));
                    goalDiffArr = goalDiffArr.sort(function (a, b) {
                        return b - a;
                    });

                    var goalDiffRes = resTmp[divName][name];
                    //console.log(goalDiffArr);
                    //console.log(res[divName][name]);
                    for (var arrVal of goalDiffArr) {
                        for (var resVal of goalDiffRes) {
                            if (arrVal == resVal.goal_diff) {
                                res[divName][name].push(resVal);
                            }
                        }
                    }
                }

            }
            Object.assign(res[divName], {
                'team_idx': this.teamInfo[divName + '_idx'],
                'team_name': this.teamInfo[divName + '_name']
            });
        }
        //console.log(res.div_home);

        this.res.p1_2.d1 = res;
    }

    setP1_3(pageData, divName) {
        if (Object.keys(pageData).length == 0) {
            return;
        }
        this.sumRes.p1_3.d1['div_' + divName][pageData.team_div] = this.getP1_3_d1(pageData, divName);
        this.sumRes.p1_3.d2[pageData.team_div]['div_' + divName] = this.getP1_3_d2(pageData, divName);
        this.sumRes.p1_3.d3[pageData.team_div]['div_' + divName] = this.getP1_3_d3(pageData, divName);
        this.sumRes.p1_3.d4[pageData.team_div]['div_' + divName] = this.getP1_3_d4(pageData, divName);
        this.sumRes.p1_3.d5[pageData.team_div]['div_' + divName] = this.getP1_3_d5(pageData, divName);
    }

    setP1_4(pageData, divName) {
        if (Object.keys(pageData).length == 0) {
            return;
        }

        var dataCnt = this.sumRes.p1_4[pageData.team_div]['div_' + divName];

        if (Object.keys(dataCnt).length == 0) {
            this.sumRes.p1_4[pageData.team_div]['div_' + divName] = {
                team_idx: pageData.team_idx,
                team_name: pageData.team_name,
                games: 1,
                lead_goal: pageData.lead_goal,
                lead_goal_permit: pageData.lead_goal_permit,
                tie_goal: pageData.tie_goal,
                tie_goal_permit: pageData.tie_goal_permit,
                other_goal: pageData.other_goal,
                other_goal_permit: pageData.other_goal_permit,
            };
        } else {
            this.sumRes.p1_4[pageData.team_div]['div_' + divName] = {
                team_idx: pageData.team_idx,
                team_name: pageData.team_name,
                games: dataCnt.games + 1,
                lead_goal: pageData.lead_goal + dataCnt.lead_goal,
                lead_goal_permit: pageData.lead_goal_permit + dataCnt.lead_goal_permit,
                tie_goal: pageData.tie_goal + dataCnt.tie_goal,
                tie_goal_permit: pageData.tie_goal_permit + dataCnt.tie_goal_permit,
                other_goal: pageData.other_goal + dataCnt.other_goal,
                other_goal_permit: pageData.other_goal_permit + dataCnt.other_goal_permit,
            };
        }
    }

    setP1_5(pageData, divName) {
        if (Object.keys(pageData).length == 0) {
            return;
        }

        var dataCnt = this.sumRes.p1_5[pageData.team_div]['div_' + divName];

        if (Object.keys(dataCnt).length == 0) {
            this.sumRes.p1_5[pageData.team_div]['div_' + divName] = {
                team_idx: pageData.team_idx,
                team_name: pageData.team_name,
                games: 1,
                tie_goal: pageData.tie_goal,
                tie_goal_permit: pageData.tie_goal_permit,
                lead_goal: pageData.lead_goal,
                lead_goal_permit: pageData.lead_goal_permit,
                other_goal: pageData.other_goal,
                other_goal_permit: pageData.other_goal_permit,
            }
        } else {
            this.sumRes.p1_5[pageData.team_div]['div_' + divName] = {
                team_idx: pageData.team_idx,
                team_name: pageData.team_name,
                games: dataCnt.games + 1,
                lead_goal: pageData.lead_goal + dataCnt.lead_goal,
                lead_goal_permit: pageData.lead_goal_permit + dataCnt.lead_goal_permit,
                tie_goal: pageData.tie_goal + dataCnt.tie_goal,
                tie_goal_permit: pageData.tie_goal_permit + dataCnt.tie_goal_permit,
                other_goal: pageData.other_goal + dataCnt.other_goal,
                other_goal_permit: pageData.other_goal_permit + dataCnt.other_goal_permit,
            }
        }
    }

    getP1_5_d1(divName, name) {
        var data = this.sumRes.p1_5[name][divName];
        var games = data.games;
        var leadGoalCnt = data.lead_goal;
        var leadPermitCnt = data.lead_goal_permit;
        var tieGoalCnt = data.tie_goal;
        var tiePermitCnt = data.tie_goal_permit;
        var otherGoalCnt = data.other_goal;
        var otherPermitCnt = data.other_goal_permit;
        var goalTypeLen = data.lead_goal + data.tie_goal + data.other_goal ;
        var permitTypeLen = data.lead_goal_permit + data.tie_goal_permit + data.other_goal_permit ;

        if (Object.keys(data).length == 0) {
            var res = {
                team_idx: this.teamInfo[divName + '_idx'],
                team_name: this.teamInfo[divName + '_name'],
                games: 0,
                lead_goal_cnt: 0,
                lead_goal_per: 0,
                lead_permit_cnt: 0,
                lead_permit_per: 0,
                tie_goal_cnt: 0,
                tie_goal_per: 0,
                tie_permit_cnt: 0,
                tie_permit_per: 0,
                other_goal_cnt: 0,
                other_goal_per: 0,
                other_permit_cnt: 0,
                other_permit_per: 0,
            }
        } else {
            var res = {
                team_idx: data.team_idx,
                team_name: data.team_name,
                games: games,
                lead_goal_cnt: leadGoalCnt,
                lead_goal_per: this._okRound(leadGoalCnt, goalTypeLen, 1, '%'),
                lead_permit_cnt: leadPermitCnt,
                lead_permit_per: this._okRound(leadPermitCnt, permitTypeLen, 1, '%'),
                tie_goal_cnt: tieGoalCnt,
                tie_goal_per: this._okRound(tieGoalCnt, goalTypeLen, 1, '%'),
                tie_permit_cnt: tiePermitCnt,
                tie_permit_per: this._okRound(tiePermitCnt, permitTypeLen, 1, '%'),
                other_goal_cnt: otherGoalCnt,
                other_goal_per: this._okRound(otherGoalCnt, goalTypeLen, 1, '%'),
                other_permit_cnt: otherPermitCnt,
                other_permit_per: this._okRound(otherPermitCnt, permitTypeLen, 1, '%'),
            }
        }
        return res;
    }

    getP1_5_d1_total(divName) {
        var H = this.res.p1_5.d1.home[divName];
        var A = this.res.p1_5.d1.away[divName];
        var games = H.games + A.games;
        var leadGoalCnt = H.lead_goal_cnt + A.lead_goal_cnt;
        var leadPermitCnt = H.lead_permit_cnt + A.lead_permit_cnt;
        var tieGoalCnt = H.tie_goal_cnt + A.tie_goal_cnt;
        var tiePermitCnt = H.tie_permit_cnt + A.tie_permit_cnt;
        var otherGoalCnt = H.other_goal_cnt + A.other_goal_cnt;
        var otherPermitCnt = H.other_permit_cnt + A.other_permit_cnt;
        var goalTypeLen = leadGoalCnt + tieGoalCnt + otherGoalCnt ;
        var permitTypeLen = leadPermitCnt + tiePermitCnt + otherPermitCnt ;

        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            games: games,
            lead_goal_cnt: leadGoalCnt,
            lead_goal_per: this._okRound(leadGoalCnt, goalTypeLen, 1, '%'),
            lead_permit_cnt: leadPermitCnt,
            lead_permit_per: this._okRound(leadPermitCnt, permitTypeLen, 1, '%'),
            tie_goal_cnt: tieGoalCnt,
            tie_goal_per: this._okRound(tieGoalCnt, goalTypeLen, 1, '%'),
            tie_permit_cnt: tiePermitCnt,
            tie_permit_per: this._okRound(tiePermitCnt, permitTypeLen, 1, '%'),
            other_goal_cnt: otherGoalCnt,
            other_goal_per: this._okRound(otherGoalCnt, goalTypeLen, 1, '%'),
            other_permit_cnt: otherPermitCnt,
            other_permit_per: this._okRound(otherPermitCnt, permitTypeLen, 1, '%'),
        }
    }

    getP1_4_d1(divName, name) {
        var data = this.sumRes.p1_4[name][divName];
        var games = data.games;
        var leadGoalCnt = data.lead_goal;
        var tiePermitCnt = data.tie_goal_permit;

        if (Object.keys(data).length == 0) {
            var res = {
                team_idx: this.teamInfo[divName + '_idx'],
                team_name: this.teamInfo[divName + '_name'],
                games: 0,
                lead_goal_cnt: 0,
                lead_goal_per: 0,
                lead_goal_avg: 0,
                tie_permit_cnt: 0,
                tie_permit_per: 0,
                tie_permit_avg: 0,
            }
        } else {
            var res = {
                team_idx: data.team_idx,
                team_name: data.team_name,
                games: games,
                lead_goal_cnt: leadGoalCnt,
                lead_goal_per: this._okRound(leadGoalCnt, games, 1, '%'),
                lead_goal_avg: this._okRound(leadGoalCnt, games, 2),
                tie_permit_cnt: tiePermitCnt,
                tie_permit_per: this._okRound(tiePermitCnt, leadGoalCnt, 1, '%'),
                tie_permit_avg: this._okRound(tiePermitCnt, leadGoalCnt, 2),
            }
        }
        return res;
    }

    getP1_4_d1_total(divName) {
        var H = this.res.p1_4.d1.home[divName];
        var A = this.res.p1_4.d1.away[divName];
        var games = H.games + A.games;
        var leadGoalCnt = H.lead_goal_cnt + A.lead_goal_cnt;
        var tiePermitCnt = H.tie_permit_cnt + A.tie_permit_cnt;

        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            games: games,
            lead_goal_cnt: leadGoalCnt,
            lead_goal_per: this._okRound(leadGoalCnt, games, 1, '%'),
            lead_goal_avg: this._okRound(leadGoalCnt, games, 2),
            tie_permit_cnt: tiePermitCnt,
            tie_permit_per: this._okRound(tiePermitCnt, leadGoalCnt, 1, '%'),
            tie_permit_avg: this._okRound(tiePermitCnt, leadGoalCnt, 2),
        }
    }

    getP1_4_d2(divName, name) {
        var data = this.sumRes.p1_4[name][divName];
        var games = data.games;
        var leadPermitCnt = data.lead_goal_permit;
        var tieGoalCnt = data.tie_goal;

        if (Object.keys(data).length == 0) {
            var res = {
                team_idx: this.teamInfo[divName + '_idx'],
                team_name: this.teamInfo[divName + '_name'],
                games: 0,
                lead_permit_cnt: 0,
                lead_permit_per: 0,
                lead_permit_avg: 0,
                tie_goal_cnt: 0,
                tie_goal_per: 0,
                tie_goal_avg: 0
            }
        } else {
            var res = {
                team_idx: data.team_idx,
                team_name: data.team_name,
                games: games,
                lead_permit_cnt: leadPermitCnt,
                lead_permit_per: this._okRound(leadPermitCnt, games, 1, '%'),
                lead_permit_avg: this._okRound(leadPermitCnt, games, 2),
                tie_goal_cnt: tieGoalCnt,
                tie_goal_per: this._okRound(tieGoalCnt, leadPermitCnt, 1, '%'),
                tie_goal_avg: this._okRound(tieGoalCnt, leadPermitCnt, 2)
            }
        }
        return res;
    }

    getP1_4_d2_total(divName) {
        var H = this.res.p1_4.d2.home[divName];
        var A = this.res.p1_4.d2.away[divName];
        var games = H.games + A.games;
        var leadPermitCnt = H.lead_permit_cnt + A.lead_permit_cnt;
        var tieGoalCnt = H.tie_goal_cnt + A.tie_goal_cnt;


        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            games: games,
            lead_permit_cnt: leadPermitCnt,
            lead_permit_per: this._okRound(leadPermitCnt, games, 1, '%'),
            lead_permit_avg: this._okRound(leadPermitCnt, games, 2),
            tie_goal_cnt: tieGoalCnt,
            tie_goal_per: this._okRound(tieGoalCnt, leadPermitCnt, 1, '%'),
            tie_goal_avg: this._okRound(tieGoalCnt, leadPermitCnt, 2)
        }
    }

    getP1_3_d1(pageData, divName) {
        var dataCnt = this.sumRes.p1_3.d1['div_' + divName][pageData.team_div];
        var firstGoalCnt = Number(Boolean(pageData.first_goal_time));
        var firstLoseCnt = Number(Boolean(pageData.first_lose_time));
        var noScoreCnt = Number(Boolean(pageData.no_score));

        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            first_goal: firstGoalCnt,
            first_lose: firstLoseCnt,
            no_score: noScoreCnt,
        }

        if (Object.keys(dataCnt).length != 0) {
            res.first_goal = res.first_goal + dataCnt.first_goal
            res.first_lose = res.first_lose + dataCnt.first_lose
            res.no_score = res.no_score + dataCnt.no_score
        }

        return res;
    }

    getP1_3_d1_per(divName) {
        var H = this.sumRes.p1_3.d1[divName].home;
        var A = this.sumRes.p1_3.d1[divName].away;
        var firstGoal = H.first_goal + A.first_goal;
        var firstLose = H.first_lose + A.first_lose;
        var noScore = H.no_score + A.no_score;
        var totalLen = firstGoal + firstLose + noScore;

        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            per_first_goal: this._okRound(firstGoal, totalLen, 2, '%'),
            per_first_lose: this._okRound(firstLose, totalLen, 2, '%'),
            no_score: this._okRound(noScore, totalLen, 2, '%'),
        }
    }

    getP1_3_d2(pageData, divName) {
        var dataCnt = this.sumRes.p1_3.d2[pageData.team_div]['div_' + divName];
        var T = pageData.first_goal_time;
        var timeCnt = this._timeCntReturn(T, 15);

        var res = {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            first_goal_total: Number(timeCnt.game_cnt),
            time_0_15: Number(timeCnt.time_0_15),
            time_16_30: Number(timeCnt.time_16_30),
            time_31_45: Number(timeCnt.time_31_45),
            time_46_60: Number(timeCnt.time_46_60),
            time_61_75: Number(timeCnt.time_61_75),
            time_76_90: Number(timeCnt.time_76_90),
            first_half: Number(timeCnt.first_half),
            second_half: Number(timeCnt.second_half),
        }

        if (Object.keys(dataCnt).length != 0) {
            res.first_goal_total = timeCnt.game_cnt + dataCnt.first_goal_total;
            res.time_0_15 = res.time_0_15 + dataCnt.time_0_15;
            res.time_16_30 = res.time_16_30 + dataCnt.time_16_30;
            res.time_31_45 = res.time_31_45 + dataCnt.time_31_45;
            res.time_46_60 = res.time_46_60 + dataCnt.time_46_60;
            res.time_61_75 = res.time_61_75 + dataCnt.time_61_75;
            res.time_76_90 = res.time_76_90 + dataCnt.time_76_90;
            res.first_half = res.first_half + dataCnt.first_half;
            res.second_half = res.second_half + dataCnt.second_half;
        }

        return res;
    }

    getP1_3_d3(pageData, divName) {
        var dataCnt = this.sumRes.p1_3.d3[pageData.team_div]['div_' + divName];
        var T = pageData.first_lose_time;
        var timeCnt = this._timeCntReturn(T, 15);

        return {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            first_lose_total: dataCnt.hasOwnProperty('first_lose_total') ? timeCnt.game_cnt + dataCnt.first_lose_total : timeCnt.game_cnt,
            time_0_15: dataCnt.hasOwnProperty('time_0_15') ? timeCnt.time_0_15 + dataCnt.time_0_15 : timeCnt.time_0_15,
            time_16_30: dataCnt.hasOwnProperty('time_16_30') ? timeCnt.time_16_30 + dataCnt.time_16_30 : timeCnt.time_16_30,
            time_31_45: dataCnt.hasOwnProperty('time_31_45') ? timeCnt.time_31_45 + dataCnt.time_31_45 : timeCnt.time_31_45,
            time_46_60: dataCnt.hasOwnProperty('time_46_60') ? timeCnt.time_46_60 + dataCnt.time_46_60 : timeCnt.time_46_60,
            time_61_75: dataCnt.hasOwnProperty('time_61_75') ? timeCnt.time_61_75 + dataCnt.time_61_75 : timeCnt.time_61_75,
            time_76_90: dataCnt.hasOwnProperty('time_76_90') ? timeCnt.time_76_90 + dataCnt.time_76_90 : timeCnt.time_76_90,
            first_half: dataCnt.hasOwnProperty('first_half') ? timeCnt.first_half + dataCnt.first_half : timeCnt.first_half,
            second_half: dataCnt.hasOwnProperty('second_half') ? timeCnt.second_half + dataCnt.second_half : timeCnt.second_half,
        }
    }

    getP1_3_d4(pageData, divName) {
        var dataCnt = this.sumRes.p1_3.d4[pageData.team_div]['div_' + divName];
        var firstGoalCnt = pageData.first_goal_time != null ? 1 : 0;
        if (firstGoalCnt == 0) {
            var W = 0;
            var D = 0;
            var L = 0;
            var goal = 0;
            var lose = 0;
        } else {
            var W = pageData.W;
            var D = pageData.D;
            var L = pageData.L;
            var goal = pageData.goal;
            var lose = pageData.lose;
        }

        return {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            games: dataCnt.hasOwnProperty('games') ? dataCnt.games + 1 : 1,
            first_goal: dataCnt.hasOwnProperty('first_goal') ? dataCnt.first_goal + firstGoalCnt : firstGoalCnt,
            W: dataCnt.hasOwnProperty('W') ? dataCnt.W + W : W,
            D: dataCnt.hasOwnProperty('D') ? dataCnt.D + D : D,
            L: dataCnt.hasOwnProperty('L') ? dataCnt.L + L : L,
            goal: dataCnt.hasOwnProperty('goal') ? dataCnt.goal + goal : goal,
            lose: dataCnt.hasOwnProperty('lose') ? dataCnt.lose + lose : lose,
        }
    }

    getP1_3_d5(pageData, divName) {
        var dataCnt = this.sumRes.p1_3.d5[pageData.team_div]['div_' + divName];
        var firstLoseCnt = pageData.first_lose_time != null ? 1 : 0;
        if (firstLoseCnt == 0) {
            var W = 0;
            var D = 0;
            var L = 0;
            var goal = 0;
            var lose = 0;
        } else {
            var W = pageData.W;
            var D = pageData.D;
            var L = pageData.L;
            var goal = pageData.goal;
            var lose = pageData.lose;
        }

        return {
            team_idx: pageData.team_idx,
            team_name: pageData.team_name,
            games: dataCnt.hasOwnProperty('games') ? dataCnt.games + 1 : 1,
            first_lose: dataCnt.hasOwnProperty('first_lose') ? dataCnt.first_lose + firstLoseCnt : firstLoseCnt,
            W: dataCnt.hasOwnProperty('W') ? dataCnt.W + W : W,
            D: dataCnt.hasOwnProperty('D') ? dataCnt.D + D : D,
            L: dataCnt.hasOwnProperty('L') ? dataCnt.L + L : L,
            goal: dataCnt.hasOwnProperty('goal') ? dataCnt.goal + goal : goal,
            lose: dataCnt.hasOwnProperty('lose') ? dataCnt.lose + lose : lose,
        }
    }

    getP1_3_d2_total(divName) {
        var H = this.sumRes.p1_3.d2.home[divName];
        var A = this.sumRes.p1_3.d2.away[divName];
        var firstHalf = H.first_half + A.first_half;
        var secondHalf = H.second_half + A.second_half;
        var halfLen = firstHalf + secondHalf;

        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            first_goal_total: Number(H.first_goal_total + A.first_goal_total),
            time_0_15: Number(H.time_0_15) + Number(A.time_0_15),
            time_16_30: Number(H.time_16_30) + Number(A.time_16_30),
            time_31_45: Number(H.time_31_45) + Number(A.time_31_45),
            time_46_60: Number(H.time_46_60) + Number(A.time_46_60),
            time_61_75: Number(H.time_61_75) + Number(A.time_61_75),
            time_76_90: Number(H.time_76_90) + Number(A.time_76_90),
            first_half: Number(firstHalf),
            second_half: Number(secondHalf),
            per_first_half: Number(this._okRound(firstHalf, halfLen, 0, '%')),
            per_second_half: Number(this._okRound(secondHalf, halfLen, 0, '%')),
        }
    }

    getP1_3_d3_total(divName) {
        var H = this.sumRes.p1_3.d3.home[divName];
        var A = this.sumRes.p1_3.d3.away[divName];
        var firstHalf = H.first_half + A.first_half;
        var secondHalf = H.second_half + A.second_half;
        var halfLen = firstHalf + secondHalf;

        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            first_lose_total: Number(H.first_lose_total + A.first_lose_total),
            time_0_15: Number(H.time_0_15 + A.time_0_15),
            time_16_30: Number(H.time_16_30 + A.time_16_30),
            time_31_45: Number(H.time_31_45 + A.time_31_45),
            time_46_60: Number(H.time_46_60 + A.time_46_60),
            time_61_75: Number(H.time_61_75 + A.time_61_75),
            time_76_90: Number(H.time_76_90 + A.time_76_90),
            first_half: Number(firstHalf),
            second_half: Number(secondHalf),
            per_first_half: this._okRound(firstHalf, halfLen, 0, '%'),
            per_second_half: this._okRound(secondHalf, halfLen, 0, '%'),
        }
    }

    getP1_3_d4_total(divName) {
        var H = this.sumRes.p1_3.d4.home[divName];
        var A = this.sumRes.p1_3.d4.away[divName];
        var games = H.games + A.games;
        var firstGoal = H.first_goal + A.first_goal;
        // console.log('tete');
        // console.log(H);
        // console.log(A);
        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            games: games,
            first_goal: firstGoal,
            W: H.W + A.W,
            D: H.D + A.D,
            L: H.L + A.L,
            goal: H.goal + A.goal,
            lose: H.lose + A.lose,
            per_first_goal: this._okRound(firstGoal, games, 0, '%'),
        }
    }

    getP1_3_d5_total(divName) {
        var H = this.sumRes.p1_3.d5.home[divName];
        var A = this.sumRes.p1_3.d5.away[divName];
        var games = H.games + A.games;
        var firstLose = H.first_lose + A.first_lose;

        return {
            team_idx: H.team_idx,
            team_name: H.team_name,
            games: games,
            first_lose: firstLose,
            W: H.W + A.W,
            D: H.D + A.D,
            L: H.L + A.L,
            goal: H.goal + A.goal,
            lose: H.lose + A.lose,
            per_first_goal: this._okRound(firstLose, games, 0, '%'),
        }
    }

    getP1_3_d2_per(divName, name) {
        var H = this.sumRes.p1_3.d2[name][divName];
        var firstHalf = H.first_half;
        var secondHalf = H.second_half;
        var halfLen = firstHalf + secondHalf;

        return {
            per_first_half: this._okRound(firstHalf, halfLen, 0, '%'),
            per_second_half: this._okRound(secondHalf, halfLen, 0, '%'),
        }
    }

    getP1_3_d3_per(divName, name) {
        var H = this.sumRes.p1_3.d3[name][divName];
        var firstHalf = H.first_half;
        var secondHalf = H.second_half;
        var halfLen = firstHalf + secondHalf;

        return {
            per_first_half: this._okRound(firstHalf, halfLen, 0, '%'),
            per_second_half: this._okRound(secondHalf, halfLen, 0, '%'),
        }
    }

    getP1_3_d4_per(divName, name) {
        var data = this.sumRes.p1_3.d4[name][divName];
        return {
            per_first_goal: this._okRound(data.first_goal, data.games, 0, '%'),
        }
    }

    getP1_3_d5_per(divName, name) {
        var data = this.sumRes.p1_3.d5[name][divName];
        return {
            per_first_lose: this._okRound(data.first_lose, data.games, 0, '%'),
        }
    }

    getP1_1_d1(pageData, divName) {
        var dataCnt = this.sumRes.p1_1.d1['div_' + divName][pageData.team_div];
        //console.log(pageData);
        return {
            team_name: pageData.team_name.length != 0 ? pageData.team_name : dataCnt.team_name,
            team_idx: pageData.team_idx.length != 0 ? pageData.team_idx : dataCnt.team_idx,
            game: ++dataCnt.game,
            W: dataCnt.W + pageData.W,
            D: dataCnt.D + pageData.D,
            L: dataCnt.L + pageData.L,
            goal: dataCnt.goal + Number(pageData.goal),
            lose: dataCnt.lose + Number(pageData.lose),
            diff: dataCnt.diff + Number(pageData.team_diff),
            point: dataCnt.point + Number(pageData.team_point)
        }
    }

    getP1_1_d2_sum(pageData, divName) {
        var dataCnt = this.sumRes.p1_1.d2['div_' + divName][pageData.team_div];

        return {
            team_name: pageData.team_name,
            team_idx: pageData.team_idx,
            game: ++dataCnt.game,
            point: dataCnt.point + Number(pageData.team_point),
        }
    }

    getP1_1_d3_sum(pageData, divName) {
        var dataCnt = this.sumRes.p1_1.d3['div_' + divName][pageData.team_div];

        return {
            team_name: pageData.team_name,
            team_idx: pageData.team_idx,
            game: ++dataCnt.game,
            goal: dataCnt.goal + Number(pageData.goal),
            lose: dataCnt.lose + Number(pageData.lose),
            point: dataCnt.point + Number(pageData.team_point)
        }
    }

    getP1_1_d2_avg(divName) {
        var sumData = this.sumRes.p1_1.d2[divName];
        var homeAvgPoint = Number((Math.round((Number(sumData.home.point) / Number(sumData.home.game)) * 100) / 100));
        var awayAvgPoint = Number((Math.round((Number(sumData.away.point) / Number(sumData.away.game)) * 100) / 100));
        homeAvgPoint = isNaN(homeAvgPoint) ? 0 : Number(homeAvgPoint);
        awayAvgPoint = isNaN(awayAvgPoint) ? 0 : Number(awayAvgPoint);
        var avgPointDiff = (Number(homeAvgPoint) - Number(awayAvgPoint)).toFixed(2);
        avgPointDiff = Math.sign(avgPointDiff) == 1 ? '+' + avgPointDiff : avgPointDiff;
        var teamName = this.teamInfo[divName + '_name'];
        var teamIdx = this.teamInfo[divName + '_idx'];

        return {
            team_idx: teamIdx,
            team_name: teamName,
            home_games: Number(sumData.home.game),
            away_games: Number(sumData.away.game),
            point: Number(sumData.home.point) + Number(sumData.away.point),
            home_avg_point: homeAvgPoint,
            away_avg_point: awayAvgPoint,
            avg_point_diff: avgPointDiff
        }
    }

    getP1_1_d3_avg(divName) {
        var sumData = this.sumRes.p1_1.d3[divName];
        var games = Number(sumData.home.game) + Number(sumData.away.game);
        var homePoint = isNaN(sumData.home.point) ? 0 : Number(sumData.home.point);
        var awayPoint = isNaN(sumData.away.point) ? 0 : Number(sumData.away.point);

        var point = this._avgPer(homePoint, awayPoint);
        var goal = this._avgPer(sumData.home.goal, sumData.away.goal);
        var lose = this._avgPer(sumData.home.lose, sumData.away.lose);

        return {
            team_idx: sumData.home.team_idx,
            team_name: sumData.home.team_name,
            games: sumData.home.game + sumData.away.game,
            point_per_home: point.home,
            point_per_away: point.away,
            goal_per_home: goal.home,
            goal_per_away: goal.away,
            lose_per_home: lose.home,
            lose_per_away: lose.away
        }
    }

    _timeCntReturn(time, standard) {
        var len = 90 / standard;
        var timeEnd = -1;
        var res = {};
        var time = time == null ? undefined : time;

        for (var i = 0; i < len; i++) {
            var timeStart = timeEnd + 1;
            var timeEnd = timeStart == 0 ? standard + timeStart : standard + timeStart - 1;

            if (timeStart <= time && time <= timeEnd) {
                res['time_' + timeStart + '_' + timeEnd] = 1;
            } else {
                res['time_' + timeStart + '_' + timeEnd] = 0;
            }
        }

        if (time < 46) {
            res.first_half = 1;
            res.second_half = 0;
            res.game_cnt = 1;
        } else if (time > 45) {
            res.first_half = 0;
            res.second_half = 1;
            res.game_cnt = 1;
        } else {
            res.first_half = 0;
            res.second_half = 0;
            res.game_cnt = 0;
        }
        return res;
    }

    _okRound(sun, mom, point, per = null) {
        if (mom == 0) {
            return 0;
        }
        var dot = '1';
        for (var i = 0; i < Number(point); i++) {
            dot = dot + '0';
        }

        if (per == null) {
            var res = (Math.round((sun / mom) * Number(dot)) / Number(dot));
        } else if (per == '%') {
            var res = ((Math.round((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        } else if(per == 'G'){
            var res = ((Math.floor((sun / mom) * Number(dot + '00')) / Number(dot + '00')) * 100);
        }

        if (res == 0 || res == 100) {
            res = Number(res.toFixed(0));
        } else {
            res = Number(res.toFixed(point));
        }

        return res;
    }

    _avgPer(a, b) {
        var len = a + b;
        if (len == 0) {
            return {
                'home': '0%',
                'away': '0%'
            }
        }

        return {
            'home': Math.round((a / len) * 100) + '%',
            'away': Math.round((b / len) * 100) + '%'
        }
    }
}

class DetailPageOne {
    constructor(originData, divTeamIdx) {
        this.res = {
            p1_1_HA_analysis: {},
            p1_2_score_stats: {},
            p1_3_first_goal_lose: {},
            p1_4_lead_goal_permit: {},
            p1_5_goal_type_stats: {}
        }

        if (originData.config.home_team_idx == divTeamIdx) {
            var teamDiv = {main: 'home', sub: 'away'};
        } else if (originData.config.away_team_idx == divTeamIdx) {
            var teamDiv = {main: 'away', sub: 'home'};
        }

        this.setConfigData(originData, teamDiv);
        this.setKeyEventData(originData, teamDiv);
        this.setDetailPageOne(originData, teamDiv);
    }

    setDetailPageOne(originData, teamDiv) {
        if (Object.keys(originData.config).length != 0 && Object.keys(originData.config).length !== undefined) {
            this.res.p1_1_HA_analysis = this.getHomeAwayAnalysis();
            this.res.p1_2_score_stats = this.getScoreStats();
        }
        if (originData.key_event.length != 0 && originData.key_event.length !== undefined) {
            this.res.p1_3_first_goal_lose = this.getFirstGoalLose();
            this.res.p1_4_lead_goal_permit = this.getLeadGoalPermit();
            this.res.p1_5_goal_type_stats = this.getGoalTypeState();
        }else if(Number(originData.config.home_goal) === 0 &&  Number(originData.config.away_goal) === 0){
            this.res.p1_3_first_goal_lose = this.getFirstGoalLose();
            this.res.p1_4_lead_goal_permit = this.getLeadGoalPermit();
            this.res.p1_5_goal_type_stats = this.getGoalTypeState();
        }
        if (originData.tech_statistics.length != 0 && originData.tech_statistics.length !== undefined) {
            //console.log('tech');
        }
        //console.log(this.res);
    }

    getDetailPageOne() {
        return this.res;
    }

    setConfigData(originData, teamDiv) {
        var config = originData.config;
        var teamResData = this._teamResData(originData, teamDiv);

        this.configData = {
            game_idx: config.game_idx,
            team_div: teamDiv.main,
            team_name: config[teamDiv.main + '_name'],
            team_idx: config[teamDiv.main + '_team_idx'],
            goal: config[teamDiv.main + '_goal'] !== '' ? Number(config[teamDiv.main + '_goal']) : null,
            lose: config[teamDiv.sub + '_goal'] !== '' ? Number(config[teamDiv.sub + '_goal']) : null,
            score: config.home_goal + '-' + config.away_goal,
            team_diff: teamResData.team_diff,
            W: teamResData.W,
            D: teamResData.D,
            L: teamResData.L,
            team_point: teamResData.team_point,
        }
    }

    setKeyEventData(originData, teamDiv) {
        var keyEvent = originData.key_event;
        var firstGoalLose = {
            firstGoalTime: null,
            firstLoseTime: null
        };
        var leadGoalPermit = {
            goal: 0,
            lose: 0,
            lead_goal: 0,
            lead_goal_permit: 0,
            tie_goal: 0,
            tie_goal_permit: 0,
            other_goal: 0,
            other_goal_permit: 0,
        }

        for (var event of keyEvent) {
            if (event.event_name == 'Goal' || event.event_name == 'Penalty scored' || event.event_name == 'Own goal') {
                if (firstGoalLose.firstGoalTime == null && firstGoalLose.firstLoseTime == null) {
                    firstGoalLose = this._firstGoalLose(event, teamDiv);
                }
                leadGoalPermit = this._leadGoalPermit(event, teamDiv, leadGoalPermit);
            }
        }

        this.keyEventData = {
            first_goal_time: firstGoalLose.firstGoalTime,
            first_lose_time: firstGoalLose.firstLoseTime,
            no_score: (firstGoalLose.firstGoalTime == null && firstGoalLose.firstLoseTime == null) ? true : null,
            lead_goal: leadGoalPermit.lead_goal,
            lead_goal_permit: leadGoalPermit.lead_goal_permit,
            tie_goal: leadGoalPermit.tie_goal,
            tie_goal_permit: leadGoalPermit.tie_goal_permit,
            other_goal: leadGoalPermit.other_goal,
            other_goal_permit: leadGoalPermit.other_goal_permit,
        }
    }

    getHomeAwayAnalysis() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_name: this.configData.team_name,
            team_idx: this.configData.team_idx,
            goal: this.configData.goal,
            lose: this.configData.lose,
            team_diff: this.configData.team_diff,
            W: this.configData.W,
            D: this.configData.D,
            L: this.configData.L,
            team_point: this.configData.team_point,
        }
    }

    getScoreStats() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_name: this.configData.team_name,
            team_idx: this.configData.team_idx,
            score: this.configData.score,
        };
    }

    getFirstGoalLose() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_idx: this.configData.team_idx,
            team_name: this.configData.team_name,
            first_goal_time: this.keyEventData.first_goal_time,
            first_lose_time: this.keyEventData.first_lose_time,
            no_score: this.keyEventData.no_score,
            W: this.configData.W,
            D: this.configData.D,
            L: this.configData.L,
            goal: this.configData.goal,
            lose: this.configData.lose,
            point: this.configData.team_point,
        }
    }

    getLeadGoalPermit() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_idx: this.configData.team_idx,
            team_name: this.configData.team_name,
            lead_goal: this.keyEventData.lead_goal,
            lead_goal_permit: this.keyEventData.lead_goal_permit,
            tie_goal: this.keyEventData.tie_goal,
            tie_goal_permit: this.keyEventData.tie_goal_permit,
            other_goal: this.keyEventData.other_goal,
            other_goal_permit: this.keyEventData.other_goal_permit,
        }
    }

    getGoalTypeState() {
        return {
            game_idx: this.configData.game_idx,
            team_div: this.configData.team_div,
            team_idx: this.configData.team_idx,
            team_name: this.configData.team_name,
            lead_goal: this.keyEventData.lead_goal,
            lead_goal_permit: this.keyEventData.lead_goal_permit,
            tie_goal: this.keyEventData.tie_goal,
            tie_goal_permit: this.keyEventData.tie_goal_permit,
            other_goal: this.keyEventData.other_goal,
            other_goal_permit: this.keyEventData.other_goal_permit,
        }
    }

    _leadGoalPermit(event, teamDiv, leadGoalPermit) {
        if (event.team_div == teamDiv.main) {
            if (leadGoalPermit.goal == leadGoalPermit.lose) {
                leadGoalPermit.goal++;
                leadGoalPermit.lead_goal++;
            } else if (leadGoalPermit.goal < leadGoalPermit.lose) {
                leadGoalPermit.goal++;

                if (leadGoalPermit.goal == leadGoalPermit.lose) {
                    leadGoalPermit.tie_goal++;
                } else {
                    leadGoalPermit.other_goal++;
                }
            } else {
                leadGoalPermit.goal++;
                leadGoalPermit.other_goal++;
            }
        } else if (event.team_div != teamDiv.main) {
            if (leadGoalPermit.goal == leadGoalPermit.lose) {
                leadGoalPermit.lose++;
                leadGoalPermit.lead_goal_permit++;
            } else if (leadGoalPermit.goal > leadGoalPermit.lose) {
                leadGoalPermit.lose++;

                if (leadGoalPermit.goal == leadGoalPermit.lose) {
                    leadGoalPermit.tie_goal_permit++;
                } else {
                    leadGoalPermit.other_goal_permit++;
                }
            } else {
                leadGoalPermit.lose++;
                leadGoalPermit.other_goal_permit++;
            }
        }
        return leadGoalPermit;
    }

    _firstGoalLose(event, teamDiv) {
        var firstGoalTime = null;
        var firstLoseTime = null;

        if (event.team_div == teamDiv.main) {
            firstGoalTime = event.time;
        } else if (event.team_div == teamDiv.sub) {
            firstLoseTime = event.time;
        }

        return {
            firstGoalTime: firstGoalTime,
            firstLoseTime: firstLoseTime,
        }
    }

    _teamResData(originData, teamDiv) {
        var data = originData.config;
        var team_diff = null;
        var W = 0;
        var D = 0;
        var L = 0;
        var team_point = null;
        var goal = Number(data[teamDiv.main + '_goal']);
        var lose = Number(data[teamDiv.sub + '_goal']);

        if (goal !== '' && lose !== '') {
            team_diff = goal - lose;

            if (goal < lose) {
                L = 1;
                team_point = 0;
            } else if (goal > lose) {
                W = 1;
                team_point = 3;
            } else if (goal == lose) {
                D = 1;
                team_point = 1;
            }
        }
        return {
            team_diff: team_diff,
            W: W,
            D: D,
            L: L,
            team_point: team_point,
        }
    }
}

class OriginParse {
    constructor(response, body, matchData, teamIdx, teamName) {
        this.config = {};
        this.key_event = {};
        this.tech_statistics = {};
        this.matchData = matchData;
        this.teamIdx = teamIdx;
        this.teamName = teamName;

        this.resDetail = {};

        this.eventName = {
            '1': 'Goal',
            '2': 'Red Card',
            '3': 'Yellow Card',
            '4': 'Sub in',
            '5': 'Sub out',
            '7': 'Penalty scored',
            '8': 'Own goal',
            '9': 'Second Yellow Card',
            '11': 'Sub',
            '12': 'Assit',
            '13': 'Penalty missed',
            '14': 'Penalty saved',
            '15': 'Shot on post',
            '16': 'Man of the match',
            '17': 'Error lead to goal',
            '18': 'Last man tackle',
            '19': 'Clearence off the Line',
            '20': 'Foul lead to penalty',
            '55': 'Mark',
        }

        try {
            this.setParse(response, body);
        }catch(e){
            console.log('detail parse err');
            console.log(e);
        }
    }

    setParse(response, body) {
        if(response === undefined){
            console.log('req X');
            return ;
        }
        var header = response.req._header.split('.')[0];
        this.gameIdx = header.split('/')[2];
        body = JSON.stringify(body).replace(/\\n| {2,}|\\r/g, '');
        body = JSON.parse(body);
        //console.log(this.gameIdx);

        this.$ = cheerio.load(body);

        this.resDetail.origin_parse = this._tablesConf();
        //this._detailDiv(this.resDetail.origin_parse);

        this.res = this.resDetail;
    }

    getParse() {
        return this.res.origin_parse;
    }

    _tablesConf(type = 0) {
        var table_name = [];
        var goals = undefined;

        if (this.$('#teamEventDiv_detail')[0] !== undefined || this.$('#teamTechDiv_detail')[0] !== undefined) {
            var getTables = [];

            if (this.$('#teamEventDiv_detail')[0].attribs.style != 'display:none;' && this.$('#teamEventDiv_detail tbody')) {
                getTables.push(this.$('#teamEventDiv_detail tbody')[0]);
            }
            if (this.$('#teamTechDiv_detail')[0].attribs.style != 'display:none;' && this.$('#teamTechDiv_detail tbody')) {
                getTables.push(this.$('#teamTechDiv_detail tbody')[0]);
            }
        } else if (this.$('#matchData > .content > .content > .bhTable > tbody').length != 0) {
            var getTablesFor = this.$('#matchData > .content > .content > .bhTable > tbody');
            var getTables = [];

            for (var i = 0; i < getTablesFor.length; i++) {
                if (getTablesFor[i].children[0].children[0].children[0].data == 'Key Events') {
                    getTables.push(getTablesFor[i]);
                } else if (getTablesFor[i].children[0].children[0].children[0].data == 'Tech Statistics') {
                    getTables.push(getTablesFor[i]);
                }
            }
        } else if (this.$('#main > .content > .bhTable > tbody').length != 0) {
            var getTablesFor = this.$('#main > .content > .bhTable > tbody');
            var getTables = [];

            for (var i = 0; i < getTablesFor.length; i++) {
                if (getTablesFor[i].children[0].children[0].children[0].data == 'Key Events') {
                    getTables.push(getTablesFor[i]);
                } else if (getTablesFor[i].children[0].children[0].children[0].data == 'Tech Statistics') {
                    getTables.push(getTablesFor[i]);
                }
            }
        } else if (this.$('#matchData > .content > .bhTable > tbody').length != 0) {
            var getTablesFor = this.$('#main > .content > .bhTable > tbody');
            var getTables = [];
            for (var i = 0; i < getTablesFor.length; i++) {
                if (getTablesFor[i].children[0].children[0].children[0].data == 'Key Events') {
                    getTables.push(getTablesFor[i]);
                } else if (getTablesFor[i].children[0].children[0].children[0].data == 'Tech Statistics') {
                    getTables.push(getTablesFor[i]);
                }
            }
        } else {
            var getTables = this.$('#main > .content > .bhTable > tbody');
            getTables = this.$('#main > .content');
        }

        if (getTables.length == 1) {
            table_name[0] = getTables[0].children[0].children[0].children[0].data;
        } else if (getTables.length == 2 && getTables[0].children[0] !== undefined && getTables[1].children[0] !== undefined) {
            table_name[0] = getTables[0].children[0].children[0].children[0].data;
            table_name[1] = getTables[1].children[0].children[0].children[0].data;
        } else if (getTables.length == 2 && getTables[0].children[0] !== undefined) {
            table_name[0] = getTables[0].children[0].children[0].children[0].data;
        } else if (getTables.length == 2 && getTables[1].children[0] !== undefined) {
            table_name[0] = getTables[1].children[0].children[0].children[0].data;
        }

        if (type == 0) {
            var res = {
                config: {},
                key_event: [],
                line_up : {},
                tech_statistics: []
            };
            for (var i = 0; i < table_name.length; i++) {
                if (table_name[i] == 'Key Events') {
                    var keyEventTable = getTables[i];
                    var keyEvent = this._keyEventParse(keyEventTable);
                    res.key_event = keyEvent.main;
                    res.line_up = this._matchBoxParse(keyEventTable);
                    goals = keyEvent.goals;
                } else if (table_name[i] == 'Tech Statistics') {
                    var techStatTable = getTables[i];
                    res.tech_statistics = this._techStat(techStatTable);
                    //console.log(resTech);
                    //console.log(techStatTable.children[0].children.length);
                }
            }
        } else if (type == 1) {
            var res = {
                config: {},
                key_event: [],
                line_up : {},
            };

            for (var i = 0; i < table_name.length; i++) {
                if (table_name[i] == 'Key Events') {
                    var keyEventTable = getTables[i];
                    var keyEvent = this._keyEventParse(keyEventTable);
                    res.line_up = this._matchBoxParse(keyEventTable);
                    res.key_event = keyEvent.main;
                    goals = keyEvent.goals;
                }
            }
        }
        res.config = this._config(this.$, goals);

        return res;
    }

    _config($, goals) {
        var res = {
            game_idx: this.gameIdx,
            game_start_time: '',
            game_date : '',
            division_day: '',
            home_name: '',
            home_name_en: '',
            away_name: '',
            away_name_en: '',
            home_img: '',
            away_img: '',
            home_goal: '',
            away_goal: '',
            home_forma: '',
            away_forma: '',
            home_team_idx: '',
            away_team_idx: '',
            home_goal_half: '-',
            away_goal_half: '-',
            home_red : '',
            away_red : '',
            gab : '',
            month : '',
        }

        if(this.matchData !== undefined) {
            var date = this.matchData.date.split(' ')[0];
            date = date.replace(/\//g, '-');

            res.home_name = this.matchData.home_name;
            res.home_name_en = this.matchData.home_name;
            res.away_name = this.matchData.away_name;
            res.away_name_en = this.matchData.away_name;
            res.league_idx = this.matchData.league_idx != null && this.matchData.league_idx != undefined ? this.matchData.league_idx : null;
            res.league_name = this.matchData.league_name != null && this.matchData.league_name != undefined ? this.matchData.league_name : null;
            res.league_color = this.matchData.league_color != null && this.matchData.league_color != undefined ? this.matchData.league_color : null;
            res.game_date = date;
            res.home_goal = this.matchData.home_goal;
            res.away_goal = this.matchData.away_goal;
            res.home_red = Number(this.matchData.home_red);
            res.away_red = Number(this.matchData.away_red);
            res.gab = this.matchData.gab;

            if (this.matchData.half_score != null) {
                var halfScore = this.matchData.half_score.split('-');
                res.home_goal_half = halfScore[0];
                res.away_goal_half = halfScore[1];
            }

            res.home_team_idx = this.matchData.home_idx;
            res.away_team_idx = this.matchData.away_idx;

            if (res.home_team_idx == this.teamIdx) {
                res.home_name = this.teamName;
            }

            if (res.away_team_idx == this.teamIdx) {
                res.away_name = this.teamName;
            }
        }

        if ($('#matchBox').length == 1) {
            res.home_forma = $('#matchBox')[0].children[0].children[0].children[1].data.trim();
            res.away_forma = $('#matchBox')[0].children[0].children[1].children[1].data.trim();
        }
        return res;
    }

    _matchBoxParse(keyEventTable){
        try{
            var matchBoxParent = keyEventTable.parent.parent.next.next.children[0];
            if (matchBoxParent.attribs.id == 'matchBox') {
                var res = {
                    match: {
                        home : [],
                        away : [],
                    },
                    sub: {
                        home : [],
                        away : [],
                    },
                };
                if (matchBoxParent.children[0].children[0].children[1].data !== ' ') {
                    if (matchBoxParent.children[1] !== undefined) {
                        var match = {
                            home: matchBoxParent.children[1].children[0].children,
                            away: matchBoxParent.children[1].children[1].children,
                        }
                        var sub = {
                            home: matchBoxParent.children[2].children[0].children,
                            away: matchBoxParent.children[2].children[2].children,
                        }
                        var playerObj = {};

                        for (var teamKey in match) {
                            res.match[teamKey] = [];
                            for (var teamVal of match[teamKey]) {
                                var playerArr = [];

                                for (var playerVal of teamVal.children) {
                                    var playerData = playerVal.children[0].children[1].children[0];
                                    var ulData = playerVal.children[0].children[2];
                                    if (playerData === undefined) {
                                        console.log(playerData);
                                    }
                                    var playerIdx = playerData.attribs.href.split('/')[6].split('.')[0];
                                    var playerName = playerData.children[0].data.match(/\s.*/)[0].trim();
                                    var playerBackNum = playerData.children[0].data.split(' ')[0];

                                    if(ulData !== undefined ) {
                                        if (ulData.children[0].children[0].attribs.src.split('/').length === 7) {
                                            var playerImg = ulData.children[0].children[0].attribs.src.split('/')[6];
                                        } else {
                                            var playerImg = null;
                                        }
                                        var playerBirth = ulData.children[3].children[0].data.split('：')[1];
                                        var playerHeight = ulData.children[4].children[0].data.split('：')[1];
                                        var playerValue = ulData.children[5].children[0].data.split('：')[1];
                                        var playerCountry = ulData.children[6].children[0].data.split('：')[1];
                                    }

                                    playerObj = {
                                        player_idx: playerIdx,
                                        player_name: playerName,
                                        player_backNum: playerBackNum,
                                        player_img: playerImg,
                                        player_birth: playerBirth,
                                        player_height: playerHeight,
                                        player_value: playerValue,
                                        player_country: playerCountry,
                                    };
                                    playerArr.push(playerObj);
                                }
                                res.match[teamKey].push(playerArr);
                            }
                        }

                        if (res.match.away !== undefined) {
                            res.match.away.reverse();
                        }

                        for (var teamKey in sub) {
                            res.sub[teamKey] = [];
                            var playerArr = [];
                            for (var playerVal of sub[teamKey]) {
                                var playerData = playerVal.children[0].children[1].children[0];
                                var ulData = playerVal.children[0].children[2];
                                if (playerData.attribs !== undefined) {
                                    var playerIdx = playerData.attribs.href.split('/')[6].split('.')[0];
                                    var playerName = playerData.children[0].data.match(/\s.*/)[0].trim();
                                } else {
                                    var playerIdx = null;
                                    var playerName = null;
                                }
                                if (playerData.hasOwnProperty('children') && playerData.children.length !== 0) {
                                    var playerBackNum = playerData.children[0].data.split(' ')[0];
                                } else {
                                    var playerBackNum = playerData.data;
                                }
                                if(ulData !== undefined) {
                                    if (ulData.children[0].children[0] !== undefined && ulData.children[0].children[0].attribs.src.split('/').length === 7) {
                                        var playerImg = ulData.children[0].children[0].attribs.src.split('/')[6];
                                    } else {
                                        var playerImg = null;
                                    }
                                    var playerBirth = ulData.children[3].children[0].data.split('：')[1];
                                    var playerHeight = ulData.children[4].children[0].data.split('：')[1];
                                    var playerValue = ulData.children[5].children[0].data.split('：')[1];
                                    var playerCountry = ulData.children[6].children[0].data.split('：')[1];
                                }

                                playerObj = {
                                    player_idx: playerIdx,
                                    player_name: playerName,
                                    player_backNum: playerBackNum,
                                    player_img: playerImg,
                                    player_birth: playerBirth,
                                    player_height: playerHeight,
                                    player_value: playerValue,
                                    player_country: playerCountry,
                                };
                                res.sub[teamKey].push(playerObj);
                            }
                        }
                    }
                }
            }
            return res;
        }catch(e){
            console.log('match err');
            console.log(this.gameIdx);
            console.log(e);
        }
    }

    _keyEventParse(keyEventTable) {
        var table_tr = keyEventTable.children;
        var res = {
            goals: {
                home: '',
                away: '',
                halfHome: 0,
                halfAway: 0,
            },
            main: [],
        };

        for (var tr_idx = 0; tr_idx < table_tr.length; tr_idx++) {
            var res_tr = {};
            // if(tr_idx == 1){
            //     res.goals.home = table_tr[tr_idx].children[0].children[0].children[0].data;
            //     res.goals.away = table_tr[tr_idx].children[2].children[0].children[0].data;
            // }
            if (table_tr[tr_idx].children[0].name == 'td' && table_tr[tr_idx].children.length > 3) {
                var table_td = table_tr[tr_idx].children;
                //플레이 이름이 없을때
                if (table_td[0].children.length == 0) {
                    var testname = undefined;
                    res_tr.player_name = null;
                    //플레이어 이름은 있지만 a태그 없을때
                } else if ((table_td[0].children.length == 1 || table_td[0].children.length == 2) && table_td[0].children[0].type == 'text' && !table_td[0].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[0].children[0].data;
                    //플레이어 이름이랑 a태그 있을때
                } else if ((table_td[0].children.length == 1 || table_td[0].children.length == 2) && table_td[0].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[0].children[0].children[0].data;

                } else if (table_td[0].children.length == 4 && table_td[0].children[1].data == '(Assist:') {
                    res_tr.player_name = table_td[0].children[0].children[0].data;
                    //플레이어 교체
                } else if (table_td[0].children.length == 4) {
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
                    if (res_tr.time.indexOf('+') != -1) {
                        res_tr.time = res_tr.time.split('+')[0];
                    }
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
                    res_tr.player_name = null;
                    //플레이어 이름은 있지만 a태그 없을때
                } else if ((table_td[4].children.length == 1 || table_td[4].children.length == 2) && table_td[4].children[0].type == 'text' && !table_td[4].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[4].children[0].data;
                    //플레이어 이름이랑 a태그 있을때
                } else if ((table_td[4].children.length == 1 || table_td[4].children.length == 2) && table_td[4].children[0].hasOwnProperty('children')) {
                    res_tr.player_name = table_td[4].children[0].children[0].data;

                } else if (table_td[4].children.length == 4 && table_td[4].children[1].data == '(Assist:') {
                    res_tr.player_name = table_td[4].children[0].children[0].data;
                    //플레이어 교체
                } else if (table_td[4].children.length == 4) {
                    res_tr.in_player_name = table_td[4].children[1].children[0].data;
                    res_tr.out_player_name = table_td[4].children[3].children[0].data;
                }
                //console.log(res_tr);
                res.main.push(res_tr);
            }
        }

        for (var i = 0; i < res.main.length; i++) {
            if (Number(res.main[i].time) < 46 && Number(res.main[i].event_key) == 1) {
                if (res.main[i].team_div == 'home') {
                    res.goals.halfHome = res.goals.halfHome + 1;
                } else if (res.main[i].team_div == 'away') {
                    res.goals.halfAway = res.goals.halfAway + 1;
                }
            }
        }
        return res;
    }

    _techStat(techStatTable) {
        var table_tr = techStatTable.children;
        table_tr.shift();
        var keyArr = ['shots','shots_on_goal','off_target','blocked','possession','possession_ht','corner_kicks',
            'corner_kicks_ht','free_kicks','attack','dangerous_attack','saves','pass','pass_success','fouls','yellow_cards','red_cards',
            'assists','offsides','heads','head_success','tackles','tackle_success','dribbles','throw_ins','intercept'];

        var res = {
            home: {},
            away: {}
        };

        for(var divName in res){
            for(var keyVal of keyArr){
                res[divName][keyVal] = null;
            }
        }

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
                if(tr_name == 'corner_kicks(ht)'){
                    res.home.corner_kicks_ht = table_tr[tr_idx].children[1].children[0].data;
                    res.away.corner_kicks_ht = table_tr[tr_idx].children[3].children[0].data;
                }else if (tr_name == 'possession(ht)' ){
                    res.home.possession_ht = table_tr[tr_idx].children[1].children[0].data;
                    res.away.possession_ht = table_tr[tr_idx].children[3].children[0].data;
                } else {
                    res.home[tr_name] = table_tr[tr_idx].children[1].children[0].data;
                    res.away[tr_name] = table_tr[tr_idx].children[3].children[0].data;
                }
            }
        }
        // console.log('res');
        //console.log(res);
        return res;
    }

    _formatDateSet(date) {
        var res = {};
        var date = date.split(',');
        var getYear = date[0];
        var getMonth = date[1];
        var getDay = date[2];
        var getHours = date[3];
        var getMinutes = date[4];
        var getSeconds = date[5];

        date = new Date(getYear, getMonth, getDay, getHours, getMinutes, getSeconds).getTime();
        date = new Date(date + 32400000);
        getMonth = this._formatDateLength(String(date.getMonth() + 1));

        var division_day = date.getFullYear().toString() + '-' + this._formatDateLength(String(date.getMonth() + 1)) + '-' + this._formatDateLength(date.getDate().toString());
        var game_start_time = division_day + ' ' + this._formatDateLength(date.getHours().toString()) + ':' + this._formatDateLength(date.getMinutes().toString());
        res.division_day = division_day.substr(2, 8);
        res.game_start_time = game_start_time;

        return res;
    }

    _formatDateLength(date) {
        if (date.length == 1) {
            date = '0' + date;
        }
        return date;
    }
}


module.exports = {Detail_lb}
