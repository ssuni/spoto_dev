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

var odd = {};

odd.parseJs = function (game_idx) {

    return new Promise(function (resolve, reject) {
        let url = 'http://1x2.nowgoal.group/' + game_idx + '.js';
        axios.get(url).then((res) => {

            const regexGame = /var game=(.*?)\r\n/gm;
            let game = regexGame.exec(res.data);

            const regexGameDetail = /var gameDetail=(.*?)\r\n/gm;
            let gameDetail = regexGameDetail.exec(res.data);

            var gameJson = game[1].replace('Array(', '[');
            gameJson = gameJson.replace(');', ']');
            gameJson = JSON.parse(gameJson)


            var gameDetailJson = gameDetail[1].replace('Array(', '[');
            gameDetailJson = gameDetailJson.replace(');', ']');
            gameDetailJson = JSON.parse(gameDetailJson)


            var obj = {};
            for (var i = 0; i < gameDetailJson.length; i++) {
                var detailConfig = gameDetailJson[i].split('^')
                var key = detailConfig[0]
                var data = detailConfig[1].split(';')
                data.pop();
                var arr = [];
                for (var j = 0; j < data.length; j++) {
                    var item = data[j].split('|');
                    item = odd.setGameDetail(item);
                    arr.push(item);

                }
                obj[key] = arr;
            }

            var result = [];
            for (var i = 0; i < gameJson.length; i++) {
                var arr = gameJson[i].split('|');
                arrGame = odd.setGame(arr);

                for(var j =0; j<Object.keys(obj).length; j++){
                    if(arrGame.detail_num == Object.keys(obj)[j]){
                        arrGame.list = obj[Object.keys(obj)[j]];
                        result.push(arrGame)
                    }
                }
            }
            resolve(result)

        }).catch(error => {
            resolve(null)
            console.log('Odd parse Js ' + error.message)
        });
    });
}

odd.setGame = function (data) {
    let result = {
        'company_num': data[0],
        'company_name': data[2],
        'detail_num': data[1],
        'firstHW': parseFloat(data[3]).toFixed(2),
        'firstDW': parseFloat(data[4]).toFixed(2),
        'firstAW': parseFloat(data[5]).toFixed(2),
        'lastHW': parseFloat(data[10]).toFixed(2),
        'lastDW': parseFloat(data[11]).toFixed(2),
        'lastAW': parseFloat(data[12]).toFixed(2),
    }
    // console.log(data)
    return result;
}
odd.setGameDetail = function (data) {
    let result = {
        'HW': data[0],
        'DW': data[2],
        'AW': data[1],
        'date': data[3],
        // 'kelly_criterion1': data[4],
        // 'kelly_criterion2': data[5],
        // 'kelly_criterion3': data[6],
    }
    // console.log(data)
    return result;
}

module.exports = odd;