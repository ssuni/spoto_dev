const moment = require('moment');
const agentkeepalive = require('agentkeepalive');
const today = new Date();
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

var schdule = {};

schdule.getSchdule = function (teamList, count = 21, type = 1) {

    let obj = {};
    let totalCount = count;
    let pageNo = 1;
    let list = [];
    return new Promise(function (resolve, reject) {

        let url = 'http://info.nowgoal.group/ajax/TeamScheAjax?TeamID=' + teamList + '&pageNo=' + pageNo;

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
                                    let arr = schdule.dataSet(json[i]);

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
                            let arr = schdule.dataSet(json[i], type);

                            arrIdx.push(json[i][0]);
                            list.push(arr);
                            obj[team_idx] = {'idx': arrIdx, 'list': list};

                            if (i == count) {
                                resolve(obj);
                            }
                        }
                    }

                    if (type == 3) {

                        let arr = schdule.dataSet(json[i], type);

                        arrIdx.push(json[i][0]);
                        list.push(arr);
                        obj[team_idx] = {'idx': arrIdx, 'list': list};

                        count = count + 1;

                        if (i == count) {
                            resolve(obj);
                        }

                    }
                } // for

                if (Object.keys(obj).length == 0) {
                    appendCount = totalCount;

                    if (page > 1) {
                        schdule.appendList(team_idx, appendCount, page).then((res) => {

                            resolve(res)
                        });
                    } else {
                        obj[team_idx] = {'idx': null, 'list': null};
                        resolve(obj)
                    }
                } else {
                    if (obj[team_idx].idx.length < totalCount && page > 1) {
                        appendCount = totalCount - obj[team_idx].idx.length;

                        schdule.appendList(team_idx, appendCount, page).then((res) => {
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
}
schdule.appendList = function (teamList, appendCount, page) {

    return new Promise(function (resolve, reject) {

        let obj = {};
        let list = [];
        let arrIdx = [];
        let preDate;

        for (var j = 2; j <= page; j++) {

            (function (j) {
                setTimeout(function () {

                    nextPageNo = j;
                    var url = 'http://info.nowgoal.group/ajax/TeamScheAjax?TeamID=' + teamList + '&pageNo=' + nextPageNo;

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
                                        let arr = schdule.dataSet(json[k]);

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

schdule.dataSet = function (arr, type = 1) {
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

module.exports = schdule;