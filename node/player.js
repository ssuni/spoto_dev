const util = require('util');
const request = require('request');
const schdule = require('./schdule');
const cheerio = require('cheerio');
const fs = require('fs');
const md5 = require('md5');
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

var player = {};

player.getConfig = function (player_idx) {
    return new Promise(function (resolve, reject) {
        let url = 'http://info.nowgoal.group/en/team/player/' + player_idx + '.html';

        axios.get(url).then((result) => {
            var $ = cheerio.load(result.data);
            var tr = $('#mainTitle > table > tbody').find('tr');

            var arr = [];
            tr.each((i, e) => {
                var td = $(e).find('td');

                switch (i) {
                    case 0 :
                        arr.push($(e).find('img').attr('src'));
                        arr.push($(td[3]).text());
                        break;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        arr.push($(td[1]).text());
                        break;
                }
            });
            var title = player.setKey(arr, 'title')
            // console.log(title);
            resolve(title)
        }).catch(error => {
            console.log(player_idx + ' player getPlayerConfig ' + error.message)
            resolve(null);
        });
    });
}

player.getPlayerJs = function (player_idx) {
    return new Promise(function (resolve, reject) {
        let url = 'http://info.nowgoal.group/jsdata/playerInfo/player' + player_idx + '_en.js';
        let obj = {};
        axios.get(url).then((result) => {

            var currentlyPlayJson = player.setData(/nowTeamInfo = (.*?);\n/gm, result.data, 'current');

            var transferRecordJson = player.setData(/transferInfo = (.*?);\n/gm, result.data, 'transfer');

            var twoYearJson = player.setData(/twoYear = (.*?);\n/gm, result.data, 'twoYear');

            var totalJson = player.setData(/playerTotal = (.*?);\n/gm, result.data, 'total');

            var honorJson = player.setData(/playerHonor = (.*?);\n/gm, result.data, 'honor');

            obj.currentlyPlay = currentlyPlayJson;
            obj.transferRecord = transferRecordJson;
            obj.twoYear = twoYearJson;
            obj.total = totalJson;
            obj.honor = honorJson;

            resolve(obj);

        }).catch(error => {
            console.log(player_idx + ' player getPlayerJs ' + error.message)
            resolve(null);
        });
    });
}

player.setData = function (regex, data, division) {
    var regex = regex;
    var json = regex.exec(data)[1];
    json = json.replace(/'/gi, '"');
    json = JSON.parse(json);

    for (var i = 0; i < json.length; i++) {
        if (division == 'honor') {
            json[i][1] = json[i][1].split(',');
            json[i][2] = json[i][1].length;
            json[i] = player.setKey(json[i], division);
        } else if(division == 'total'){
            json = player.setKey(json, division)
        } else {
            json[i] = player.setKey(json[i], division);
        }
    }
    return json;
}

player.getPlayerDetail = async function (player_idx) {
    var config = await player.getConfig(player_idx);
    var playerJs = await player.getPlayerJs(player_idx);

    // console.log(playerJs)
}

player.setKey = function (data, division) {
    // console.log(data)
    var result;
    switch (division) {
        case 'title' :
            result = {
                'playerImgUrl': data[0],
                'name': data[1],
                'country': data[2],
                'weight': data[3],
                'height': data[4],
                'birthday': data[5],
                'preferredFoot': data[6],
                'estimatedValue': data[7]
            }
            break;
        case 'current' :
            result = {
                'currentlyPlay': data[6],
                'jerseyNumber': parseInt(data[1]),
                'position': data[5]
            }
            break;
        case 'transfer' :
            var type = data[10];
            switch (type) {
                case 1 :
                    type = 'OwnedWholly';
                    break;
                case 2 :
                    type = 'Loan';
                    break;
                case 3 :
                    type = 'FreeTransfer';
                    break;
                case 4 :
                    type = 'EndLoan';
                    break;
                case 5 :
                    type = 'Common';
                    break;
            }
            result = {
                'season': data[0],
                'time': data[3],
                'expires': data[4],
                'from': data[1],
                'fromName': data[11],
                'to': data[2],
                'toName': data[12],
                'transferFee': (data[9] !== '') ? '£' + (data[9] / 100) + ' Million' : '-',
                'type': type
            }
            break;
        case 'twoYear' :
            result = {
                'game_idx': data[0],
                'match': data[3],
                'color': data[9],
                'date': data[4],
                'home_idx': data[5],
                'away_idx': data[6],
                'home_goal': data[7],
                'away_goal': data[8],
                'home_name': data[12],
                'away_name': data[15],
                'goals': data[18],
                'pen': data[19],
                'og': data[20],
                'yellow': data[17],
                'red': data[16]
            }
            break;
        case 'total' :
            result = {
                'goals': data[0],
                'pen': data[1],
                'og': data[2],
                'yellow': data[3],
                'red': data[4]
            }
            break;
        case 'honor' :
            result = {
                'league': data[0],
                'times': data[2],
                'seasonYear': data[1]
            }
            break;
    }
    return result;
}

player.getImg  = function(path,player_idx){
    return new Promise(function (resolve, reject) {
        if (path !== null) {
            var download = function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    return filename;
                });
            };
            var md5Name = md5(player_idx) + '.png';
            var uploadPath = '../html/public/res/livescore/img/player/' + md5Name;
            fs.stat(uploadPath, function (err) {
                if (!err) {
                    return resolve(md5Name);
                    // console.log(md5Name + ' Team IMG file exists');
                } else {
                    if (path !== null) {
                        let filePath = path;
                        download('http://info.nowgoal.group/image/player/images/' + filePath, uploadPath, function () {
                            console.log(uploadPath + '  done');
                            return resolve(md5Name);
                        });
                    }
                }
            });
        }
    });
}

module.exports = player;