const xml2js = require('xml2js');
const moment = require('moment');
const cheerio = require('cheerio');
const chalk = require('chalk');
const util = require('util');
const timestemp = new Date().getTime();
const today = new Date();
const parser = new xml2js.Parser({
    explicitArray: false
});
const request = require('request');

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
    fn.getData();
    console.log('============= Detail 접속 ===================');
}).on('reconnect', function () {
    console.log('============= Detail - socket =============');
}).on('disconnect', function () {
    STATE = false;
    console.log('============= Detail 종료 ====================');
});

const fn = (function () {
    return {
        getData : function(){

        }
    }
});