var _soccer_json = null,
    _soccer_result_json = null,
    _detail_eventJson = null,
    _detail_statusJson = null,
    _opponent_json = null,
    _analysis_json = null,
    _team_json = null,
    _team_total_json = null,
    _analysis_number = null,
    _team_number = null,
    _transfer_json = null,
    _player_json = null,
    _league_side_json = null,
    _league_main_json = null,
    _league_main_json2 = null,
    _season_league_name = null,
    _pass_json = null,
    _defen_json = null,
    _summary_json = null,
    _main_odd_json = null,
    _popup_odd_json = null,
    _game_count_json = null,
    _cal_game_json = null,
    _matchcount = null,
    _select_day = null,
    _nation_arr = null,
    _nation_idx_arr = null,
    _league_arr = null,
    _league_idx_arr = null,
    _past_json = null,
    _storage_value = [],
    _top_id_arr = [],
    _top_all_remove = 0,
    _top_all_remove2 = 0,
    transfer_num = 0,
    plus_num = -1,
    tooltip_type = 1,
    _interval = null,
    _Io = null,
    _sever = null,
    _socket = null,
    _analysis_h_idx = null,
    _analysis_a_idx = null,
    _analysis_h_name = null,
    _analysis_a_name = null,
    _analysis_game_idx = null,
    _analysis_game_date = null,
    _analysis_league_idx = null,
    is_action = false,
    l_chart_h = null,
    l_chart_a = null,
    goal_15_detail_chart = null,
    loss_15_detail_chart = null,
    goal_10_detail_chart = null,
    loss_10_detail_chart = null,
    h_formation_d_line_chart = null,
    a_formation_d_line_chart = null,
    h_keeper_e_shoot_chart = null,
    a_keeper_e_shoot_chart = null,
    h_keeper_defense_chart = null,
    a_keeper_defense_chart = null,
    h_defense_rate_chart = null,
    a_defense_rate_chart = null,
    h_formation_pie_chart = null,
    a_formation_pie_chart = null,
    NO_IMG = 'livescore_soccer_null_img.png',
    DOMAIN = 'https://spoto.com',
    LIVESCORE = '/res/livescore/img/',
    LIVESCORE_T = '/res/livescore/img/team/',
    // <img src= "../img/null_18x18.jpg"

    home_c = '#517dc9',
    away_c = '#ffd46e',

    $DOCUMENT = $(document);
const notyf = new Notyf({
    types: [
        {
            type: "success",
            duration: 4000,
            icon: false,
            position: {
                x: "right",
                y: "bottom",
            },
        },
    ],
});
(function ($) {
    $.extend($.datepicker, {

        // Reference the orignal function so we can override it and call it later
        _inlineDatepicker2: $.datepicker._inlineDatepicker,

        // Override the _inlineDatepicker method
        _inlineDatepicker: function (target, inst) {

            // Call the original
            this._inlineDatepicker2(target, inst);

            var beforeShow = $.datepicker._get(inst, 'beforeShow');

            if (beforeShow) {
                beforeShow.apply(target, [target, inst]);
            }
        }
    });
    $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function (inst) {
        $.datepicker._updateDatepicker_original(inst);
        var afterShow = this._get(inst, 'afterShow');
        if (afterShow)
            afterShow.apply((inst.input ? inst.input[0] : null));  // trigger custom callback
    }
}(jQuery));

(function () {
    _Fn = (function () {
        return {
            team_open: function (idx, sort, option) {
                window.open("https://spoto.com/livescore/" + sort + "/" + idx, option, "width=955px, height=1000px");
            },
            cal_percent: function (first, second) {
                var value = (parseInt(first) / parseInt(second)) * 100;
                if (isNaN(value)) {
                    value = 0;
                }
                return value;
            },
            isEmpty: function (val) {
                if (val === "" || val === null || val === undefined || (val !== null && typeof val === "object" && !Object.keys(val).length)) {
                    return true;
                } else {
                    return false;
                }
            },
            notyf_open: function (notyf, team_name, message, color) {
                notyf.open({
                    type: "success",
                    message: team_name + " " + message,
                    background: color,
                });
            },
            /* isDevice: function () {
                if (navigator.userAgent.match(/(iPhone|iPod|iPad)/) != null) {
                    return true;
                } else {
                    return false;
                }
            },
            appleDate: function (fn, time) {
                if (!fn) {
                    var dateParts = time.substring(0, 10).split("-");
                    var timePart = time.substr(11);
                    var result_time = dateParts[1] + "/" + dateParts[2] + "/" + dateParts[0] + "T" + timePart;
                    console.log(dateParts);
                    console.log(timePart);
                    console.log(result_time);
                    return result_time;
                }
            }, */
            sound: function () {
                $("#audio")[0].load();
                window.removeEventListener("touchstart", _Fn.sound);
            },
            game_count: function (json) {
                var count_data = json,
                    week_length = $DOCUMENT.find('.date_popup  > div > table > tbody').children().length,
                    count = Object.keys(count_data).length,
                    key_arr = [],
                    loop_n = 0;
                for (var t = 0; t < count; t++) {
                    key_arr.push(Object.keys(count_data)[t]);
                }
                console.log(key_arr);
                for (var s = 0; s < week_length; s++) {
                    var week_node = $DOCUMENT.find('.date_popup  > div > table > tbody tr:nth-child(' + (s + 1) + ')').children().length;
                    console.log(week_node);
                    for (var a = 0; a < 7; a++) {
                        var day_node = $DOCUMENT.find('.date_popup  > div > table > tbody tr:nth-child(' + (s + 1) + ')').children().eq(a),
                            day_length = day_node.children().length;
                        console.log(day_node);
                        console.log(day_length);
                        if (day_length != 0) {
                            var select_class = day_node.hasClass('ui-state-disabled'),
                                weekend_class = day_node.hasClass('ui-datepicker-week-end'),
                                day_node = $DOCUMENT.find('.date_popup  > div > table > tbody tr:nth-child(' + (s + 1) + ')').children().eq(a);
                            if (select_class == false) {
                                count_node = day_node.find('.count').text(count_data[key_arr[loop_n]]);
                                loop_n++;
                            }
                        }
                    }
                }
            },
            nation_league_unique_value: function (data, name_key, idx_key) {
                var result = {},
                    unique = [],
                    name_key = name_key,
                    idx_key = idx_key;
                console.log(data);
                console.log(name_key);
                console.log(idx_key);
                for (var i = 0; i < data.length; i++) {
                    console.log(data[i]);
                    console.log(name_key);
                    console.log(data[i][name_key]);
                    console.log('dfdfdfdfd');
                    if (unique.indexOf(data[i][name_key]) === -1) {
                        unique.push(data[i][name_key]);
                    }
                }
                var unique_idx = [];
                for (var i = 0; i < data.length; i++) {
                    if (unique_idx.indexOf(data[i][idx_key]) === -1) {
                        unique_idx.push(data[i][idx_key]);
                    }
                }
                console.log(unique);
                console.log(unique_idx);
                result = {unique, unique_idx};
                console.log(result);
                return result;
            },
            analysis_graph_per: function(val, t_val) {
                var value = null;
                //if(val > 1) {
                    if (val != null) {
                        value = ((val / t_val) * 100).toFixed(0) + '%';
                    }
                // }else{
                //     if (val != null) {
                //         value = ((val / t_val) * 100).toFixed(0) + '%';
                //     }
                // }

                return value;
            },
            analysis_graph_yaxes_max: function(val) {
                if(val < 15) {
                    val = 15;
                }else if(val > 15 && val < 20) {
                    val = 20;
                }else if(val > 20 && val < 25) {
                    val = 25;
                }else if(val > 25 && val < 30) {
                    val = 30;
                }else if(val > 30 && val < 35) {
                    val = 35;
                }else if(val > 35 && val < 40) {
                    val = 40;
                }else if(val > 40 && val < 45) {
                    val = 45;
                }else if(val > 45 && val < 50) {
                    val = 50;
                }

                return val;
            },
            array_max_index: function(arr) {
                var lowest = 0;
                for (var i = 1; i < arr.length; i++) {
                    if (arr[i] > arr[lowest]) lowest = i;
                }
                return lowest;

            },
            one_action: function(is_action, play_function) {
                if (is_action === true) { return false; }
                is_action = true;
                play_function;
            }
        };
    })();
    _Soccer = (function () {
        return {
            team_detail: function ($this, idx, select_status, select_event, select_section, select_index) {
                var a_teamName = $this.parent("div").parent().children().eq(5).children(".teamName").text(),
                    h_teamName = $this.parent("div").parent().children().eq(3).children(".teamName").text(),
                    html = "",
                    data = select_section[select_index - 1];
                console.log(a_teamName);
                console.log($this);
                console.log($this.parents("div"));
                console.log($this.parent("div").children().eq(6));
                console.log(data);
                if (select_status != undefined) {
                    var shots = select_status.shots,
                        shots_on_goal = select_status.shots_on_goal,
                        ball_possession = select_status.ball_possession;
                }
                var content = select_event,
                    content_length = select_event.length;
                if (select_status == null || select_status == undefined || select_status == "") {
                    html += '<div id="gameDetail">';
                    html += "<header>";
                    html += "<div>경기요약</div>";
                    console.log(data.append_content);
                    console.log(data.youth_content);
                    if (!data.append_content == false || !data.youth_content == false) {
                        if (data.append_content == "" || data.append_content == null || data.append_content == undefined) {
                            html += '<div class="info_text">' + data.youth_content + "</div>";
                        } else {
                            html += '<div class="info_text">' + data.append_content + "</div>";
                        }
                    }
                    html += "</header>";
                    html += '<section id="detailEvent">';
                    html += '<div calss="eventTitle">';
                    html += "<div>시간</div>";
                    html += "<div>" + h_teamName + "</div>";
                    html += "<div>" + a_teamName + "</div>";
                    html += "</div>";
                    html += '<div calss="eventContent">';
                    html += "</div>";
                    html += "</section>";
                    html += "</div>";

                    $("#divView").empty().append(html);
                } else {
                    if (shots != undefined) {
                        var h_shots = shots[0],
                            a_shots = shots[1];
                    }
                    if (shots_on_goal != undefined) {
                        var h_shots_on_goal = shots_on_goal[0],
                            a_shots_on_goal = shots_on_goal[1];
                    }
                    if (ball_possession != undefined) {
                        var h_ball_possession = ball_possession[0],
                            a_ball_possession = ball_possession[1];
                    }

                    html += '<div id="gameDetail">';
                    html += "<header>";
                    html += "<div>경기요약</div>";
                    console.log(!data.append_content);
                    console.log(!data.youth_content);
                    if (!data.append_content == false || !data.youth_content == false) {
                        if (data.append_content == "" || data.append_content == null || data.append_content == undefined) {
                            html += '<div class="info_text">' + data.youth_content + "</div>";
                        } else {
                            html += '<div class="info_text">' + data.append_content + "</div>";
                        }
                    }
                    html += "</header>";
                    html += '<section id="detailEvent">';
                    html += '<div calss="eventTitle">';
                    html += "<div>시간</div>";
                    html += "<div>" + h_teamName + "</div>";
                    html += "<div>" + a_teamName + "</div>";
                    html += "</div>";
                    html += '<div calss="eventContent">';
                    html += "</div>";
                    html += "</section>";
                    html += '<section id="detailInfo">';
                    html += '<div class="infoTitle">경기 통계</div>';
                    html += '<div class="infoContent">';
                    html += "</div>";
                    html += "</section>";
                    html += "</div>";

                    $("#divView").empty().append(html);
                }

                if (shots == null || shots == undefined || shots == "") {
                    //event.preventDefault();
                } else {
                    var html = "";
                    html += "<div>"; // 여기부터 append 추가해야됨
                    html += "<div>" + h_shots + "</div>";
                    html += "<div>슈팅</div>";
                    html += "<div>" + a_shots + "</div>";
                    html += "</div>";

                    $DOCUMENT.find("#detailInfo .infoContent").prepend(html);
                }
                if (shots_on_goal == null || shots_on_goal == undefined || shots_on_goal == "") {
                    //event.preventDefault();
                } else {
                    var s_text = $DOCUMENT.find("#detailInfo .infoContent").children().first().children().eq(1).text();
                    console.log(s_text);

                    var html = "";
                    html += "<div>";
                    html += "<div>" + h_shots_on_goal + "</div>";
                    html += "<div>유효 슈팅</div>";
                    html += "<div>" + a_shots_on_goal + "</div>";
                    html += "</div>";
                    if (s_text == "슈팅") {
                        $DOCUMENT.find("#detailInfo .infoContent").append(html);
                    } else {
                        $DOCUMENT.find("#detailInfo .infoContent").prepend(html);
                    }
                }
                if (ball_possession == null || ball_possession == undefined || ball_possession == "") {
                    //event.preventDefault();
                } else {
                    var html = "";
                    html += "<div>";
                    html += "<div>" + h_ball_possession + "</div>";
                    html += "<div>볼 점유율</div>";
                    html += "<div>" + a_ball_possession + "</div>";
                    html += "</div>";

                    $DOCUMENT.find("#detailInfo .infoContent").append(html);
                }
                console.log(content_length);
                if (content_length < 1) {
                    event.preventDefault();
                } else {
                    var html = "";
                    for (var i = 0; i < content_length; i++) {
                        if (content[i].home_away == "home") {
                            html += '<div class="event_h">';
                            html += "<div>" + content[i].min + "'</div>";
                            if (content[i].event == 1) {
                                html += '<div><span class="goal"></span>' + content[i].name + "</div>";
                            } else if (content[i].event == 2) {
                                html += '<div><span class="r_card"></span>' + content[i].name + "</div>";
                            } else if (content[i].event == 3) {
                                html += '<div><span class="y_card"></span>' + content[i].name + "</div>";
                            } else if (content[i].event == 4) {
                                html += "<div><span>(4ev?)</span>" + content[i].name + "</div>";
                            } else if (content[i].event == 5) {
                                html += "<div><span>(5ev?)</span>" + content[i].name + "</div>";
                            } else if (content[i].event == 6) {
                                html += "<div><span>(6ev?)</span>" + content[i].name + "</div>";
                            } else if (content[i].event == 7) {
                                html += '<div><span class="pk_goal"></span>' + content[i].name + "</div>";
                            } else if (content[i].event == 8) {
                                html += '<div><span class="own_goal"></span>' + content[i].name + "</div>";
                            } else if (content[i].event == 9) {
                                html += '<div><span class="yyr_card"></span>' + content[i].name + "</div>";
                            } else if (content[i].event == 10) {
                                html += "<div><span>(10ev?)</span>" + content[i].name + "</div>";
                            } else if (content[i].event == 11) {
                                console.log(content[i]);
                                var name = content[i].name;
                                var name_in = name.replace("↑",'<span class="p_change_in"></span>');
                                var name_out = name_in.replace("↓",'<span class="p_change_out"></span>');
                                console.log(name_in);
                                console.log(name_out);
                                //html += '<div><span class="p_change"></span>' + content[i].name + "</div>";
                                html += '<div><span class="p_change"></span>' + name_out + "</div>";
                            }
                            html += "</div>";
                        } else {
                            html += '<div class="event_a">';
                            html += "<div>" + content[i].min + "'</div>";
                            if (content[i].event == 1) {
                                html += "<div>" + content[i].name + '<span class="goal"></span></div>';
                            } else if (content[i].event == 2) {
                                html += "<div>" + content[i].name + '<span class="r_card"></span></div>';
                            } else if (content[i].event == 3) {
                                html += "<div>" + content[i].name + '<span class="y_card"></span></div>';
                            } else if (content[i].event == 4) {
                                html += "<div>" + content[i].name + "<span>(4ev?)</span></div>";
                            } else if (content[i].event == 5) {
                                html += "<div>" + content[i].name + "<span>(5ev?)</span></div>";
                            } else if (content[i].event == 6) {
                                html += "<div>" + content[i].name + "<span>(6ev?)</span></div>";
                            } else if (content[i].event == 7) {
                                html += "<div>" + content[i].name + '<span class="pk_goal"></span></div>';
                            } else if (content[i].event == 8) {
                                html += "<div>" + content[i].name + '<span class="own_goal"></span></div>';
                            } else if (content[i].event == 9) {
                                html += "<div>" + content[i].name + '<span class="yyr_card"></span></div>';
                            } else if (content[i].event == 10) {
                                html += "<div>" + content[i].name + "<span>(10ev?)</span></div>";
                            } else if (content[i].event == 11) {
                                console.log(content[i]);
                                var name = content[i].name;
                                var name_in = name.replace("↑",'<span class="p_change_in"></span>');
                                var name_out = name_in.replace("↓",'<span class="p_change_out"></span>');
                                console.log(name_in);
                                console.log(name_out);
                                // html += "<div>" + content[i].name + '<span class="p_change"></span></div>';
                                html += "<div>" + name_out + '<span class="p_change"></span></div>';
                            }
                            html += "</div>";
                        }
                    }
                    console.log($DOCUMENT.find("#detailEvent > div:nth-child(2)"));
                    $DOCUMENT.find("#detailEvent > div:nth-child(2)").append(html);
                }
                var height = $("article>section>div:not(:first-child)>div:nth-child(5)").offset();
                var point = $this[0].offsetTop;
                var height_content = $DOCUMENT.find("#divView").height();

                var divTop = point + 20; //상단 좌표 위치 안맞을시 e.pageY
                if (height_content < divTop) {
                    divTop = point - height_content - 10;
                }
                var divLeft = height.left - 245; //좌측 좌표 위치 안맞을시 e.pageX
                $("#divView")
                    .css({
                        top: divTop,
                        left: divLeft,
                        position: "absolute",
                    })
                    .show();
            },
            soccer_odds_mouseenter_add_html: function ($this) {
                var html = "",
                    game_idx = $this.parent().parent().data("idx"),
                    game_data = _main_odd_json[game_idx],
                    odds_data = game_data.odds.contents,
                    odds_name = "Bet 365",
                    nodata_class = $this.find("div span").prop("class");
                console.log(game_data);
                if (nodata_class != "no_data") {
                    for (var i = 0; i < odds_data.length; i++) {
                        var change_json = odds_data[i].odds_change,
                            odds_change_length = "";
                        console.log(change_json);
                        if (change_json == null) {
                            odds_change_length = 0;
                        } else {
                            var odds_change_length = change_json.length,
                                last_data = change_json[0],
                                first_data = change_json[odds_change_length - 1];
                        }
                        console.log(change_json);
                        if (odds_data[i].bet_name == odds_name) {
                            html += '<div id="odds_view">';

                            html += '<div class="view_title">국내 배당률 변경 내역</div>';
                            html += '<div class="view_content">';
                            html += '<div class="subTitle">';
                            html += "<div>구분</div>";
                            html += "<div>승</div>";
                            html += "<div>무</div>";
                            html += "<div>패</div>";
                            html += "<div>유형</div>";
                            html += "</div>";
                            html += '<div class="odds_content">';
                            html += '<div class="general_odds">';
                            html += "<div>일반 배당률</div>";
                            html += "<div>";
                            html += "<span>2.24</span>";
                            html += "</div>";
                            html += "<div>";
                            html += "<span>3.37</span>";
                            html += "</div>";
                            html += "<div>";
                            html += "<span>2.60</span>";
                            html += "</div>";
                            html += "<div>";
                            html += "<span>-</span>";
                            html += "</div>";
                            html += "</div>";
                            /* html += '<div class="handi_odds">';
                            html += '<div>핸디캡 배당률</div>';
                            html += '<div>2.55</div>';
                            html += '<div>3.87</div>';
                            html += '<div>2.79</div>';
                            html += '<div>';
                            html += '<div class="handicap">H</div>';
                            html += '<span>-1.0</span>';
                            html += '</div>';
                            html += '</div>'; */
                            html += '<div class="underover_odds">';
                            html += "<div>언오버 배당률</div>";
                            html += "<div>2.55</div>";
                            html += "<div>3.87</div>";
                            html += "<div>2.79</div>";
                            html += "<div>";
                            html += '<div class="underover">U.O</div>';
                            html += "<span>-1.0</span>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";

                            html += '<div class="view_title">해외 배당률 변경 내역</div>';
                            html += '<div class="view_content">';
                            html += '<div class="subTitle">';
                            html += "<div>구분</div>";
                            html += "<div>승</div>";
                            html += "<div>무</div>";
                            html += "<div>패</div>";
                            html += "<div>업데이트 시간</div>";
                            html += "</div>";
                            html += '<div class="odds_content">';

                            html += '<div class="now_odds">';
                            html += "<div>현 배당률</div>";
                            html += "<div>";
                            if (first_data.win_bet > last_data.win_bet) {
                                html += '<span class="down">';
                                html += "<span>" + last_data.win_bet + "</span>";
                                html += "<span></span>";
                            } else if (first_data.win_bet == last_data.win_bet) {
                                html += '<span class="draw">';
                                html += "<span>" + last_data.win_bet + "</span>";
                                html += "<span>-</span>";
                            } else if (first_data.win_bet < last_data.win_bet) {
                                html += '<span class="up">';
                                html += "<span>" + last_data.win_bet + "</span>";
                                html += "<span></span>";
                            }
                            html += "</span></div>";
                            html += "<div>";
                            if (first_data.draw_bet > last_data.draw_bet) {
                                html += '<span class="down">';
                                html += "<span>" + last_data.draw_bet + "</span>";
                                html += "<span></span>";
                            } else if (first_data.draw_bet == last_data.draw_bet) {
                                html += '<span class="draw">';
                                html += "<span>" + last_data.draw_bet + "</span>";
                                html += "<span>-</span>";
                            } else if (first_data.draw_bet < last_data.draw_bet) {
                                html += '<span class="up">';
                                html += "<span>" + last_data.draw_bet + "</span>";
                                html += "<span></span>";
                            }
                            html += "</span></div>";
                            html += "<div>";

                            if (first_data.lose_bet > last_data.lose_bet) {
                                html += '<span class="down">';
                                html += "<span>" + last_data.lose_bet + "</span>";
                                html += "<span></span>";
                            } else if (first_data.lose_bet == last_data.lose_bet) {
                                html += '<span class="draw">';
                                html += "<span>" + last_data.lose_bet + "</span>";
                                html += "<span>-</span>";
                            } else if (first_data.lose_bet < last_data.lose_bet) {
                                html += '<span class="up">';
                                html += "<span>" + last_data.lose_bet + "</span>";
                                html += "<span></span>";
                            }
                            html += "</span></div>";
                            html += "<div><span>" + last_data.update + "</span></div>";
                            html += "</div>";

                            html += '<div class="first_odds">';
                            html += "<div>첫 배당률</div>";
                            html += "<div>" + first_data.win_bet + "</div>";
                            html += "<div>" + first_data.draw_bet + "</div>";
                            html += "<div>" + first_data.lose_bet + "</div>";
                            html += "<div>" + first_data.update + "</div>";
                            html += "</div>";
                            html += '<div class="odds_info">상세한 배당률 변경 내역은 클릭하시면 보실 수 있습니다</div>';
                            html += "</div>";
                            html += "</div>";
                            html += "</div>";
                        }
                    }
                } else {
                    html += '<div id="odds_view">';
                    html += '<div class="view_title">상세 배당률 정보는 클릭하면 볼 수 있습니다</div>';
                    html += "</div>";
                }
                $("#divView").empty().append(html);

                var height = $this.offset();
                var point = $this[0].offsetTop;
                var height_content = $DOCUMENT.find("#divView").height();

                var divTop = point + 20; //상단 좌표 위치 안맞을시 e.pageY
                if (height_content < divTop) {
                    divTop = point - height_content - 10;
                }
                console.log(height);
                var divLeft,
                    all_click = $("#odds_check").is(":checked");
                if (all_click == true) {
                    divLeft = height.left - 199.5; // 전체 배당률 클릭 했을때
                } else {
                    divLeft = height.left - 241; // 개별 배당률 클릭 했을때
                }

                console.log(divLeft);
                $("#divView")
                    .css({
                        top: divTop,
                        left: divLeft,
                        position: "absolute",
                    })
                    .show();
            },
            soccer_bookmark_game_html: function (key, value, select_node) {
                localStorage.clear();

                localStorage.setItem(key, JSON.stringify(value));
                var storage_data = localStorage.getItem("bookmarkGame"),
                    game_arr = JSON.parse(storage_data);

                console.log(game_arr);
                $("#bookmark").removeClass("nonDisplay");
                select_node.find("div:nth-child(9) span").addClass("select_icon");
                $("#bookmark").append(select_node);
            },
            soccer_first_bookmark_load_event: function () {
                var select_node = "";
                (select_class = ""),
                    (today_length = $("#todayGame").length),
                    (tomorrow_length = $("#tomorrowGame").length),
                    (today_result_length = $("#todayResult").length),
                    (key = "bookmarkGame");

                console.log(localStorage.getItem("bookmarkGame"));
                if (localStorage.getItem("bookmarkGame") != null) {
                    var storage_data = localStorage.getItem("bookmarkGame"),
                        storage_json = "";
                    console.log(storage_data);
                    if (storage_data != "" || storage_dat != '""') {
                        storage_json = JSON.parse(storage_data);
                    } else {
                        localStorage.clear();
                    }
                    value = storage_json.length;
                    _storage_value = storage_json;
                }
                console.log(today_length);
                console.log(tomorrow_length);
                console.log(today_result_length);
                if (today_length == 1) {
                    var content_length = $("#todayGame").children().not(":first-child").length;
                    for (var i = 0; i < content_length; i++) {
                        var content_idx = $("#todayGame")
                            .children()
                            .eq(i + 1)
                            .data("idx");
                        for (var s = 0; s < _storage_value.length; s++) {
                            if (content_idx == _storage_value[s]) {
                                select_node = $("#todayGame")
                                    .children()
                                    .eq(i + 1);
                                select_node.addClass("todayGame");
                                _Soccer.soccer_bookmark_game_html(key, _storage_value, select_node);
                                i = i - 1;
                            }
                        }
                    }
                }
                if (tomorrow_length == 1) {
                    var content_length = $("#tomorrowGame").children().not(":first-child").length;
                    for (var i = 0; i < content_length; i++) {
                        var content_idx = $("#tomorrowGame")
                            .children()
                            .eq(i + 1)
                            .data("idx");
                        for (var s = 0; s < _storage_value.length; s++) {
                            if (content_idx == _storage_value[s]) {
                                select_node = $("#tomorrowGame")
                                    .children()
                                    .eq(i + 1);
                                select_node.addClass("tomorrowGame");
                                _Soccer.soccer_bookmark_game_html(key, _storage_value, select_node);
                                i = i - 1;
                            }
                        }
                    }
                }
                if (today_result_length == 1) {
                    var content_length = $("#todayResult").children().not(":first-child").length;
                    for (var i = 0; i < content_length; i++) {
                        var content_idx = $("#todayResult")
                            .children()
                            .eq(i + 1)
                            .data("idx");
                        for (var s = 0; s < _storage_value.length; s++) {
                            if (content_idx == _storage_value[s]) {
                                select_node = $("#todayResult")
                                    .children()
                                    .eq(i + 1);
                                select_node.addClass("todayResult");
                                _Soccer.soccer_bookmark_game_html(key, _storage_value, select_node);
                                i = i - 1;
                            }
                        }
                    }
                }
            },
            soccer_add_bookmark_event: function ($this) {
                var select_node = $this.parent("div").parent("div"),
                    select_id = select_node.parent("section").attr("id"),
                    game_idx = $this.parent("div").parent("div").data("idx"),
                    key = "bookmarkGame",
                    value = [];

                console.log(localStorage.getItem("bookmarkGame"));
                if (localStorage.getItem("bookmarkGame") == null) {
                    value = 0;
                } else {
                    var storage_data = localStorage.getItem("bookmarkGame"),
                        storage_json = JSON.parse(storage_data);
                    value = storage_json.length;
                    _storage_value = storage_json;
                }

                console.log(value);
                console.log(_storage_value.length);
                console.log(_storage_value.indexOf(game_idx));
                if (_storage_value.indexOf(game_idx) == -1) {
                    localStorage.clear();
                    _storage_value[value] = game_idx;
                }

                console.log(game_idx);
                console.log(_storage_value);
                console.log(select_id);
                select_node.addClass(select_id);
                _Soccer.soccer_bookmark_game_html(key, _storage_value, select_node);
            },
            soccer_remove_bookmark_event: function ($this) {
                var select_node_class = $this.parent("div").parent("div").attr("class"),
                    select_node = $this.parent("div").parent("div"),
                    class_arr = select_node_class.split(" "),
                    section_node = class_arr[1],
                    class_node = parseInt(class_arr[0]),
                    content_length = $("#" + section_node)
                        .children()
                        .not(":first-child").length;

                console.log(select_node_class);
                console.log(class_arr);
                console.log(section_node);
                console.log(class_node);
                console.log(content_length);
                for (var i = 0; i < content_length; i++) {
                    var loop_node = $("#" + section_node)
                            .children()
                            .eq(i + 1)
                            .attr("class"),
                        loop_class_arr = loop_node.split(" "),
                        number_class = parseInt(loop_class_arr[0]);
                    console.log(loop_node);
                    console.log(class_node);
                    console.log(content_length);
                    console.log(content_length - class_node);
                    console.log(number_class);

                    if (number_class > class_node) {
                        console.log($("#" + section_node).find("." + number_class));
                        var storage = localStorage.getItem("bookmarkGame"),
                            data_arr = JSON.parse(storage),
                            del_data = select_node.data("idx"),
                            key = "bookmarkGame",
                            new_arr_data = $.grep(data_arr, function (value) {
                                return value != del_data;
                            });

                        localStorage.clear();
                        localStorage.setItem(key, JSON.stringify(new_arr_data));
                        console.log(new_arr_data);
                        select_node.removeClass(section_node);
                        $("#" + section_node)
                            .find("." + number_class)
                            .before(select_node);
                        break;
                    } else if (content_length == 1 && number_class < class_node) {
                        console.log(content_length);
                        console.log($("#" + section_node).find("." + number_class));
                        var storage = localStorage.getItem("bookmarkGame"),
                            data_arr = JSON.parse(storage),
                            del_data = select_node.data("idx"),
                            key = "bookmarkGame",
                            new_arr_data = $.grep(data_arr, function (value) {
                                return value != del_data;
                            });

                        localStorage.clear();
                        localStorage.setItem(key, JSON.stringify(new_arr_data));
                        console.log(new_arr_data);
                        select_node.removeClass(section_node);
                        $("#" + section_node)
                            .find("." + number_class)
                            .after(select_node);
                        break;
                    } else if (class_node - content_length == 1 && number_class < class_node) {
                        console.log(content_length);
                        console.log($("#" + section_node).find("." + number_class));
                        var storage = localStorage.getItem("bookmarkGame"),
                            data_arr = JSON.parse(storage),
                            del_data = select_node.data("idx"),
                            key = "bookmarkGame",
                            new_arr_data = $.grep(data_arr, function (value) {
                                return value != del_data;
                            });

                        localStorage.clear();
                        localStorage.setItem(key, JSON.stringify(new_arr_data));
                        console.log(new_arr_data);
                        select_node.removeClass(section_node);
                        $("#" + section_node).append(select_node);
                        break;
                    }
                }
                if (content_length == 0) {
                    // 섹션에 게임내용 없이 모두 탑에 올라가 있을경우 해제 이벤트
                    console.log(content_length);
                    //console.log($('#' + section_node).find('.' + number_class));
                    var storage = localStorage.getItem("bookmarkGame"),
                        data_arr = JSON.parse(storage),
                        del_data = select_node.data("idx"),
                        key = "bookmarkGame",
                        new_arr_data = $.grep(data_arr, function (value) {
                            return value != del_data;
                        });

                    localStorage.clear();
                    localStorage.setItem(key, JSON.stringify(new_arr_data));
                    console.log(new_arr_data);
                    select_node.removeClass(section_node);
                    $("#" + section_node).append(select_node);
                }
                var bookmark_length = $("#bookmark").children().length;
                console.log(bookmark_length);
                if (bookmark_length == 1) {
                    $("#bookmark").addClass("nonDisplay");
                }
            },
            soccer_all_remove_bookmark_event: function () {
                var top_content_length = $("#bookmark > div:not(:first-child)").length;

                console.log($("#bookmark > div:not(:first-child)"));
                console.log(top_content_length);
                console.log($("#bookmark>div").length);
                for (var i = 0; i < top_content_length; i++) {
                    var loop_class = $("#bookmark")
                            .children()
                            .not(":first-child")
                            .eq(i + _top_all_remove)
                            .attr("class"),
                        select_node = $("#bookmark")
                            .children()
                            .not(":first-child")
                            .eq(i + _top_all_remove),
                        class_arr = loop_class.split(" "),
                        section_node = class_arr[1],
                        class_node = parseInt(class_arr[0]),
                        content_length = $("#" + section_node)
                            .children()
                            .not(":first-child").length;

                    _top_all_remove--;

                    console.log(_top_id_arr);
                    console.log($("#bookmark").children().not(":first-child"));
                    console.log(select_node);
                    console.log(loop_class);
                    console.log(content_length);
                    console.log(class_node);
                    for (var s = 0; s < content_length; s++) {
                        var loop_node2 = $("#" + section_node)
                                .children()
                                .eq(s + 1)
                                .attr("class"),
                            loop_index = $("#" + section_node)
                                .children()
                                .eq(s + 1)
                                .index(),
                            loop_class_arr = loop_node2.split(" "),
                            number_class = parseInt(loop_class_arr[0]);

                        console.log(number_class);
                        console.log(loop_index);

                        select_node.removeClass(section_node);
                        $("#" + section_node).append(select_node);
                        break;
                    }
                    if (content_length == 0) {
                        // 섹션에 게임내용 없이 모두 탑에 올라가 있을경우 해제 이벤트
                        select_node.removeClass(section_node);
                        $("#" + section_node).append(select_node);
                    }
                    var bookmark_length = $("#bookmark").children().length;
                    console.log(bookmark_length);
                    if (bookmark_length == 1) {
                        $("#bookmark").addClass("nonDisplay");
                    }
                }
                var id_arr = ["todayGame", "tomorrowGame", "todayResult"];
                for (var i = 0; i < id_arr.length; i++) {
                    var loop_section = $DOCUMENT.find("#" + id_arr[i]),
                        data_node = loop_section.children().not(":first-child"),
                        section_length = data_node.length;
                    console.log(section_length);
                    console.log(loop_section.length);
                    console.log(loop_section);
                    if (section_length > 1) {
                        for (var s = 0; s < section_length; s++) {
                            loop_section
                                .children()
                                .not(":first-child")
                                .sort(function (a, b) {
                                    return parseInt($(a).attr("class")) > parseInt($(b).attr("class")) ? 1 : -1;
                                })
                                .appendTo(loop_section);
                            console.log(loop_section);
                        }
                    }
                }
                localStorage.clear();
                _top_all_remove = 0;
            },
            soccer_odds_checkbox_change_event: function ($this) {
                var html = "",
                    checkbox_check = $this.is(":checked"),
                    id_arr = ["bookmark", "todayGame", "tomorrowGame", "todayResult"];
                console.log(checkbox_check);
                console.log(id_arr);
                console.log(id_arr.length);
                if (checkbox_check == true) {
                    //$('#todayResult > div > div.dataContainer > div > div:nth-child(3) span').addClass('selected_icon');
                    for (var i = 0; i < id_arr.length; i++) {
                        var loop_section_length = $("#" + id_arr[i]).length,
                            loop_section = $("#" + id_arr[i]);
                        console.log(loop_section_length);
                        console.log(loop_section);
                        if (loop_section_length != 0) {
                            var section_child_length = loop_section.children("div:not(:first-child)").length;
                            console.log(section_child_length);
                            for (var s = 0; s < section_child_length; s++) {
                                var section_child_node = loop_section.children("div:not(:first-child)").eq(s),
                                    add_adr = section_child_node.children().eq(4),
                                    game_idx = section_child_node.data("idx"),
                                    game_data = _main_odd_json[game_idx],
                                    odds_data = game_data.odds.contents,
                                    odds_name = "Bet 365";
                                console.log(game_idx);
                                console.log(odds_data.length);
                                console.log(add_adr);
                                console.log(odds_data);
                                loop_section.find("div:nth-child(8) div div:nth-child(3) span:nth-child(1)").addClass("selected_icon");
                                add_adr.find("span:first-child").attr("class", "nonDisplay");
                                add_adr.css("width", "143px");
                                /* var select_json = $.grep(odds_data, function (n, i) {
                                    return n.bet_name == odds_name;
                                });
                                console.log(select_json); */

                                for (var a = 0; a < odds_data.length; a++) {
                                    if (odds_data[a].bet_name == odds_name) {
                                        var odds_change_length = odds_data[a].odds_change.length,
                                            second_to_last = "";

                                        if (odds_change_length > 1) {
                                            second_to_last = odds_data[a].odds_change[1];
                                        } else {
                                            second_to_last = odds_data[a].odds_change[0];
                                        }
                                        console.log(second_to_last);
                                        html += '<div class="game_odds">';
                                        html += "<div>";
                                        if (second_to_last.win_bet > odds_data[a].last_win_bet) {
                                            html += '<span class="down" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        } else if (second_to_last.win_bet == odds_data[a].last_win_bet) {
                                            html += '<span class="draw" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        } else if (second_to_last.win_bet < odds_data[a].last_win_bet) {
                                            html += '<span class="up" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        }
                                        html += "<span>" + odds_data[a].last_win_bet + "</span>";
                                        if (second_to_last.win_bet == odds_data[a].last_win_bet) {
                                            html += "<span>-</span>";
                                        } else {
                                            html += "<span></span>";
                                        }
                                        html += "</span>";
                                        html += "</div>";
                                        html += "<div>";
                                        if (second_to_last.draw_bet > odds_data[a].last_draw_bet) {
                                            html += '<span class="down" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        } else if (second_to_last.draw_bet == odds_data[a].last_draw_bet) {
                                            html += '<span class="draw" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        } else if (second_to_last.draw_bet < odds_data[a].last_draw_bet) {
                                            html += '<span class="up" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        }
                                        html += "<span>" + odds_data[a].last_draw_bet + "</span>";
                                        if (second_to_last.draw_bet == odds_data[a].last_draw_bet) {
                                            html += "<span>-</span>";
                                        } else {
                                            html += "<span></span>";
                                        }
                                        html += "</span>";
                                        html += "</div>";
                                        html += "<div>";
                                        if (second_to_last.lose_bet > odds_data[a].last_lose_bet) {
                                            html += '<span class="down" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        } else if (second_to_last.lose_bet == odds_data[a].last_lose_bet) {
                                            html += '<span class="draw" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        } else if (second_to_last.lose_bet < odds_data[a].last_lose_bet) {
                                            html += '<span class="up" data-bet_game_idx="' + odds_data[a].bet_game_idx + '">';
                                        }
                                        html += "<span>" + odds_data[a].last_lose_bet + "</span>";
                                        if (second_to_last.lose_bet == odds_data[a].last_lose_bet) {
                                            html += "<span>-</span>";
                                        } else {
                                            html += "<span></span>";
                                        }
                                        html += "</span>";
                                        html += "</div>";
                                        html += "</div>";
                                        add_adr.append(html);
                                        html = "";
                                        break;
                                    } else {
                                        html += '<div class="game_odds">';
                                        for (var z = 0; z < 3; z++) {
                                            html += "<div>";
                                            html += '<span class="no_data">';
                                            html += "<span>-</span>";
                                            html += "<span></span>";
                                            html += "</span>";
                                            html += "</div>";
                                        }
                                        html += "</div>";
                                        add_adr.append(html);
                                        html = "";
                                        break;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    $("#todayResult > div > div.dataContainer > div > div:nth-child(3) span").removeClass("selected_icon");
                    for (var i = 0; i < id_arr.length; i++) {
                        var loop_section_length = $("#" + id_arr[i]).length,
                            loop_section = $("#" + id_arr[i]);
                        console.log(loop_section_length);
                        console.log(loop_section);
                        if (loop_section_length != 0) {
                            var section_child_length = loop_section.children("div:not(:first-child)").length;
                            console.log(section_child_length);
                            for (var s = 0; s < section_child_length; s++) {
                                var section_child_node = loop_section.children("div:not(:first-child)").eq(s),
                                    add_adr = section_child_node.children().eq(4),
                                    del_node = add_adr.children(".game_odds");

                                loop_section.find("div:nth-child(8) div div:nth-child(3) span:nth-child(1)").removeClass("selected_icon");
                                section_child_node.removeClass();
                                add_adr.find("span:first-child").removeClass("nonDisplay");
                                add_adr.removeAttr("style");
                                del_node.remove();
                            }
                        }
                    }
                }
            },
            soccer_match_filter_event: function (select_val, section_arr) {
                if (select_val == "all") {
                    for (var i = 0; i < section_arr.length; i++) {
                        $("#" + section_arr[i]).removeClass("nonDisplay");
                        var content_length = $("#" + section_arr[i]).children("div:not(:first-child)").length;
                        console.log(content_length);

                        for (var s = 0; s < content_length; s++) {
                            var loop_node = $("#" + section_arr[i]).children("div:nth-child(" + (s + 2) + ")");
                            console.log(loop_node);
                            loop_node.removeClass("nonDisplay");
                        }
                    }
                } else if (select_val == "playing") {
                    for (var i = 0; i < section_arr.length; i++) {
                        $("#" + section_arr[i]).removeClass("nonDisplay");
                        var content_length = $("#" + section_arr[i]).children("div:not(:first-child)").length;
                        console.log(content_length);
                        for (var s = 0; s < content_length; s++) {
                            var loop_node = $("#" + section_arr[i]).children("div:nth-child(" + (s + 2) + ")"),
                                state_text = parseInt(loop_node.children().eq(2).text()),
                                no_parseInt_text = loop_node.children().eq(2).text(),
                                text_type = "";
                            console.log(isNaN(state_text));
                            console.log(no_parseInt_text);
                            if (isNaN(state_text) == true) {
                                text_type = "string";
                            } else {
                                text_type = typeof state_text;
                            }
                            console.log(loop_node);
                            console.log(loop_node.children().eq(2));
                            console.log(state_text);
                            console.log(text_type);

                            loop_node.removeClass("nonDisplay");
                            if (text_type == "string" && no_parseInt_text != "HT") {
                                loop_node.addClass("nonDisplay");
                            }
                        }
                    }
                } else if (select_val == "standby") {
                    for (var i = 0; i < section_arr.length; i++) {
                        $("#" + section_arr[i]).removeClass("nonDisplay");
                        var content_length = $("#" + section_arr[i]).children("div:not(:first-child)").length;
                        console.log(content_length);
                        for (var s = 0; s < content_length; s++) {
                            var loop_node = $("#" + section_arr[i]).children("div:nth-child(" + (s + 2) + ")"),
                                state_text = loop_node.children().eq(2).text();
                            console.log(loop_node);
                            console.log(loop_node.children().eq(2));
                            console.log(state_text);
                            loop_node.removeClass("nonDisplay");
                            if (state_text != "") {
                                loop_node.addClass("nonDisplay");
                            }
                        }
                    }
                } else if (select_val == "end") {
                    for (var i = 0; i < section_arr.length; i++) {
                        $("#" + section_arr[i]).removeClass("nonDisplay");
                        $("#todayGame").addClass("nonDisplay");
                        $("#tomorrowGame").addClass("nonDisplay");
                        var content_length = $("#" + section_arr[i]).children("div:not(:first-child)").length;
                        console.log(content_length);
                        for (var s = 0; s < content_length; s++) {
                            var loop_node = $("#" + section_arr[i]).children("div:nth-child(" + (s + 2) + ")");

                            console.log(loop_node);
                            loop_node.removeClass("nonDisplay");
                        }
                    }
                }
            },
            soccer_rate_popup_html: function (_popup_odd_json) {
                var html = "",
                    data = _popup_odd_json;
                //data_length = data.length;

                for (var s = 0; s < 2; s++) {
                    html += '<option value="">배팅회사이름</option>';
                }
                $("#rate_select").append(html);
                html = "";

                for (var i = 0; i < data_length; i++) {
                    html += '<div class="rate_' + (i + 1) + '">';
                    html += "<div>1.66</div>";
                    html += "<div>4.20</div>";
                    html += "<div>4.50</div>";
                    html += "<div>56.69%</div>";
                    html += "<div>22.40%</div>";
                    html += "<div>20.91%</div>";
                    html += "<div>94.11%</div>";
                    html += "<div>03/29 08:12</div>";
                    html += "</div>";
                }
                html += '<div class="footer_text">Copyright © 2003 - 2020 nowgoal. All Rights Reserved. OPYRIGHT © 2018 BEPICK ALL RIGHTS RESERVED</div>';
                $("#rate_detail").append(html);
            },
            soccer_opponent_html: function (result_json, $this) {
                var html = "",
                    data = result_json,
                    home_name = $this.parent("div").children().eq(3).children(".teamName").text(),
                    away_name = $this.parent("div").children().eq(5).children(".teamName").text(),
                    home_idx = $this.parent("div").children().eq(3).data("home_idx"),
                    away_idx = $this.parent("div").children().eq(5).data("away_idx"),
                    home_odd = null,
                    away_odd = null;

                console.log(home_name);
                console.log(away_name);
                console.log(home_idx);
                console.log(away_idx);
                console.log(data);
                if (data.length) {
                    html += '<div id="opponent_container">';
                    html += "<header>";
                    html += "<h1>Crown Odds</h1>";
                    html += "</header>";
                    html += '<section id="oppMenu">';
                    html += "<div>경기</div>";
                    html += "<div>시간</div>";
                    html += "<div>홈팀</div>";
                    html += "<div>스코어</div>";
                    html += "<div>원정팀</div>";
                    html += "<div>전반</div>";
                    html += "<div>Handicap</div>";
                    html += "<div>Odds</div>";
                    html += "<div>W/L</div>";
                    html += "<div>O/U</div>";
                    html += "<div>O/E</div>";
                    html += "</section>";
                    html += '<section id="oppContent">';
                    for (var i = 0; i < data.length; i++) {
                        var data_home_idx = data[i].home_idx,
                            data_away_idx = data[i].away_idx,
                            sum_goal = data[i].home_goal + data[i].away_goal,
                            div_goal = sum_goal % 2;

                        html += "<div>";
                        html += '<div style="background-color:' + data[i].color + '; color: white;">' + data[i].league_name + "</div>";
                        html += "<div>" + data[i].date + "</div>";

                        if (data_home_idx == home_idx) {
                            html += "<div style='color:#880000;'>" + home_name + "</div>";
                        } else {
                            html += "<div>" + away_name + "</div>";
                        }
                        html += '<div style="color: red; font-weight: 1000;">' + data[i].home_goal + "-" + data[i].away_goal + "</div>";

                        if (data_away_idx == away_idx) {
                            html += "<div>" + away_name + "</div>";
                        } else {
                            html += "<div>" + home_name + "</div>";
                        }
                        html += '<div style="color: red;">' + data[i].first_home_goal + "-" + data[i].first_away_goal + "</div>";

                        if (data[i].odd == 0.25) {
                            // handicap 값 계산
                            home_odd = 0;
                            away_odd = 0.5;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else if (data[i].odd == 0.75) {
                            home_odd = 0.5;
                            away_odd = 1;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else if (data[i].odd == 1.25) {
                            home_odd = 1;
                            away_odd = 1.5;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else if (data[i].odd == 1.75) {
                            home_odd = 1.5;
                            away_odd = 2;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else if (data[i].odd == -1.75) {
                            home_odd = -1.5;
                            away_odd = -2;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else if (data[i].odd == -1.25) {
                            home_odd = -1;
                            away_odd = -1.5;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else if (data[i].odd == -0.75) {
                            home_odd = -0.5;
                            away_odd = -1;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else if (data[i].odd == -0.25) {
                            home_odd = 0;
                            away_odd = -0.5;
                            html += "<div><span>" + home_odd + "</span>/<span>" + away_odd + "</span></div>";
                        } else {
                            home_odd = data[i].odd;
                            away_odd = "";
                            html += "<div><span>" + home_odd + "</span><span>" + away_odd + "</span></div>";
                        }

                        if (home_idx == data[i].home_idx) {
                            // Odds 값 계산
                            /* if (Math.sign(data[i].odd) == 1) {
                                var home_score = data[i].home_goal + data[i].odd,
                                    away_score = data[i].away_goal;
                            } else {
                                var home_score = data[i].home_goal,
                                    away_score = data[i].away_goal + data[i].odd;
                            } */
                            var home_score = data[i].home_goal,
                                away_score = data[i].away_goal + data[i].odd;
                            console.log(home_score);
                            console.log(away_score);
                            if (home_score > away_score && home_name) {
                                html += '<div class="red">W</div>';
                            } else if (home_score == away_score) {
                                html += '<div class="green">D</div>';
                            } else if (home_score < away_score) {
                                html += '<div class="blue">L</div>';
                            }
                        } else if (home_idx == data[i].away_idx) {
                            /* if (Math.sign(data[i].odd) == 1) {
                                var home_score = data[i].home_goal,
                                    away_score = data[i].away_goal + data[i].odd;
                            } else {
                                var home_score = data[i].home_goal + data[i].odd,
                                    away_score = data[i].away_goal;
                            } */
                            var home_score = data[i].home_goal,
                                away_score = data[i].away_goal + data[i].odd;
                            console.log(home_score);
                            console.log(away_score);
                            if (home_score < away_score) {
                                html += '<div class="red">W</div>';
                            } else if (home_score == away_score) {
                                html += '<div class="green">D</div>';
                            } else if (home_score > away_score) {
                                html += '<div class="blue">L</div>';
                            }
                        }

                        if (home_idx == data[i].home_idx) {
                            // W/L 값 계산
                            if (data[i].home_goal > data[i].away_goal) {
                                html += '<div class="red">W</div>';
                            } else if (data[i].home_goal == data[i].away_goal) {
                                html += '<div class="green">D</div>';
                            } else if (data[i].home_goal < data[i].away_goal) {
                                html += '<div class="blue">L</div>';
                            }
                        } else if (home_idx == data[i].away_idx) {
                            if (data[i].home_goal < data[i].away_goal) {
                                html += '<div class="red">W</div>';
                            } else if (data[i].home_goal == data[i].away_goal) {
                                html += '<div class="green">D</div>';
                            } else if (data[i].home_goal > data[i].away_goal) {
                                html += '<div class="blue">L</div>';
                            }
                        }
                        //html += "<div>W</div>";
                        if (sum_goal <= 2) {
                            // O/U 값
                            html += '<div class="blue">U</div>';
                        } else {
                            html += '<div class="red">O</div>';
                        }
                        console.log(div_goal);
                        if (div_goal == 0) {
                            // O/E 값
                            html += '<div class="blue">E</div>';
                        } else {
                            html += '<div class="red">O</div>';
                        }
                        html += "</div>";
                    }
                    $DOCUMENT.find("#soccer_list").after(html);
                    var str = "",
                        event_length = $DOCUMENT.find("#opponent_container #oppContent > div").length,
                        odds_count = 0,
                        wl_count = 0,
                        ou_count = 0,
                        oe_count = 0;
                    console.log(event_length);
                    for (var n = 0; n < event_length; n++) {
                        var odds_text = $DOCUMENT.find("#oppContent").children().eq(n).children().eq(7).text(),
                            wl_text = $DOCUMENT.find("#oppContent").children().eq(n).children().eq(8).text(),
                            ou_text = $DOCUMENT.find("#oppContent").children().eq(n).children().eq(9).text(),
                            oe_text = $DOCUMENT.find("#oppContent").children().eq(n).children().eq(10).text();

                        if (odds_text == "W") {
                            odds_count++;
                        } else if (odds_text == "D") {
                            var half_count = 0.5;
                            odds_count = odds_count + half_count;
                        }
                        if (wl_text == "W") {
                            wl_count++;
                        }
                        if (ou_text == "O") {
                            ou_count++;
                        }
                        if (oe_text == "O") {
                            oe_count++;
                        }
                    }
                    var odds_divide = (odds_count / event_length) * 100,
                        wl_divide = (wl_count / event_length) * 100,
                        ou_divide = (ou_count / event_length) * 100,
                        oe_divide = (oe_count / event_length) * 100;

                    str += "</section>";
                    str += '<section id="oppOdds">';
                    str += '<div>Last[<span class="red"> ' + event_length + " </span>]Matches, ";
                    str += 'Win rate : <span class="red">' + Math.round(wl_divide * 10) / 10 + "% </span> ";
                    str += 'Odds win rate: <span class="red">' + Math.round(odds_divide * 10) / 10 + "% </span> ";
                    str += 'Over rate : <span class="red">' + Math.round(ou_divide * 10) / 10 + "% </span> ";
                    str += 'Odd rate: <span class="red">' + Math.round(oe_divide * 10) / 10 + "% </span></div>";
                    str += "</section>";
                    str += "</div>";

                    $DOCUMENT.find("#opponent_container").append(str);

                    var height = $("article>section>div:not(:first-child)>div:nth-child(8)").offset();
                    var point = $this[0].offsetTop;
                    var height_content = $DOCUMENT.find("#opponent_container").height();

                    var divTop = point + 20; //상단 좌표 위치 안맞을시 e.pageY
                    console.log(divTop);
                    if (height_content < divTop) {
                        divTop = point - height_content - 10;
                    }
                    var divLeft = height.left - 710; //좌측 좌표 위치 안맞을시 e.pageX
                    console.log(height);
                    $("#opponent_container").css({
                        top: divTop,
                        left: divLeft,
                        position: "absolute",
                    });
                } else {
                    var tmp = "",
                        league_name = $this.parent("div").children().eq(0).children("div div:nth-child(2)").text();

                    tmp += '<div id="opponent_container">';
                    tmp += '<div class="nomatch">No match stats of ' + league_name + "</div>";
                    tmp += "</div>";

                    $DOCUMENT.find("#soccer_list").after(tmp);

                    var height = $("article>section>div:not(:first-child)>div:nth-child(8)").offset();
                    var point = $this[0].offsetTop;
                    var height_content = $DOCUMENT.find("#opponent_container").height();

                    var divTop = point + 20; //상단 좌표 위치 안맞을시 e.pageY
                    console.log(divTop);
                    var divLeft = height.left - 206; //좌측 좌표 위치 안맞을시 e.pageX
                    var serial = $(this).attr("serial");
                    console.log(height);
                    $("#opponent_container").css({
                        height: "42px",
                        width: "206px",
                        top: divTop,
                        left: divLeft,
                        position: "absolute",
                    });
                }
            },
            /* yesterday_result_html: function (_soccer_result_json) {
                var data = _soccer_result_json,
                    html = "";
                console.log(data);
                html += '<section id="yesterday_result">';

                html += "<div>";
                html += '<div id="listTitle">';

                html += "<div>경기</div>";
                html += "<div>시간</div>";
                html += "<div>상태</div>";
                html += "<div>홈팀</div>";
                html += "<div>스코어</div>";
                html += "<div>원정팀</div>";
                html += "<div>전반</div>";
                html += "<div>C</div>";
                html += "<div>데이터</div>";
                html += "</div>";
                html += "<div>전일 경기 결과</div>";
                html += "</div>";
                for (var i = 0; i < data.length; i++) {
                    var data_league = data[i].league_config,
                        result_text = "";

                    html += '<div data-idx="' + data[i].game_idx + '">';
                    html += '<div>';
                    html += '<div style="background-color:' + data_league.color + '" data-league_idx="' + data_league.league_idx + '"></div>'
                    html += '<div style="color:#222222">' + data_league.short_name + "</div>";
                    html += "</div>";
                    html += "<div>08:00</div>";
                    switch (data[i].game_progress) {
                        case 1:
                            result_text = "전반";
                            break;
                        case 2:
                            result_text = "HT";
                            break;
                        case 3:
                            result_text = "후반";
                            break;
                        case 4:
                            result_text = "Ot";
                            break;
                        case 5:
                            result_text = "Pen";
                            break;
                        case -1:
                            result_text = "<b>FT</b>";
                            break;
                        case -10:
                            result_text = "Cancel";
                            break;
                        case -11:
                            result_text = "Pend";
                            break;
                        case -12:
                            result_text = "And";
                            break;
                        case -13:
                            result_text = "Pause";
                            break;
                        case -14:
                            result_text = "Postp";
                            break;
                        default:
                            result_text = "오류";
                    }
                    if (result_text == 'Cancel' || result_text == 'HT') {
                        html += '<div style="color:#222222">';
                    } else {
                        html += '<div style="color: #ff5e3a">';
                    }
                    html += result_text;
                    html += "</div>";
                    html += '<div data-home_idx="' + data[i].home_idx + '">';
                    if (data[i].home_yellow_card != 0) {
                        html += '<span class="badge badge-warning">' + data[i].home_yellow_card + "</span>";
                    }
                    if (data[i].home_red_card != 0) {
                        html += '<span class="badge badge-danger">' + data[i].home_red_card + "</span>";
                    }
                    html += '<span class="teamName">' + data[i].home_name + "</span>";
                    html += "</div>";
                    html += "<div>";
                    html += '<span class="red">' + data[i].home_goal + "-" + data[i].away_goal + "</span>";
                    html += "</div>";
                    html += '<div data-away_idx="' + data[i].away_idx + '">';
                    html += '<span class="teamName">' + data[i].away_name + "</span>";
                    if (data[i].away_red_card != 0) {
                        html += '<span class="badge badge-danger">' + data[i].away_red_card + "</span>";
                    }
                    if (data[i].away_yellow_card != 0) {
                        html += '<span class="badge badge-warning">' + data[i].away_yellow_card + "</span>";
                    }
                    html += "</div>";
                    html += "<div>";
                    html += '<span class="red">' + data[i].first_home_goal + "-" + data[i].first_away_goal + "</span>";
                    html += "</div>";
                    html += "<div>";
                    html += '<span class="blue">' + data[i].home_c + "-" + data[i].away_c + "</span>";
                    html += "</div>";
                    html += '<div class="dataContainer">';
                    html += '<div style="display: block; width: 92px; " align="left">';
                    html += '<div id="analysis" title="Match analyze"><span></span></div>';
                    html += '<div title="odds"><span></span></div>';
                    html += '<div title="1x2 odds"><span></span></div>';
                    html += '</div>';
                    html += "</div>";
                    html += "</div>";
                }
                html += "</section>";
                $("#soccer_list").append(html);
            }, */
            soccer_analysis_title_html: function (_analysis_json) {
                var html = "",
                    data = _analysis_json.title;
                console.log(data);

                html += '<div class="home_img">';
                html += '<img src="' + data.home_img + '">';
                html += "</div>";
                html += "<div>";
                html += '<div class="league_title">';
                html += '<span class="redname">' + data.league_name + "</span>";
                html += '<span class="play_time">' + data.date + "</span>";
                html += "</div>";
                html += '<div class="game_info">';
                html += '<div class="' + data.home_idx + '">' + data.home_name + "</div>";
                if (data.division == "end") {
                    html += '<div class="redname">' + data.home_score + "</div>";
                    html += '<div class="playing redname">';
                    html += "<div>Finished</div>";
                    html += "<div>(<span>" + data.Score1stHalf + "</span>,<span>" + data.Score2ndHalf + "</span>)</div>";
                    html += "</div>";
                    html += '<div class="not_playing nonDisplay">';
                    html += '<div><span class="redname">VS</span></div>';
                    html += "</div>";
                    html += '<div class="redname">' + data.away_score + "</div>";
                } else if (data.division == "half") {
                    html += '<div class="greenname">' + data.home_score + "</div>";
                    html += '<div class="playing greenname">';
                    html += "<div>Began</div>";
                    html += '<div class="nonDisplay">(<span>' + data.Score1stHalf + "</span>,<span>" + data.Score2ndHalf + "</span>)</div>";
                    html += "</div>";
                    html += '<div class="not_playing nonDisplay">';
                    html += '<div><span class="redname">VS</span></div>';
                    html += "</div>";
                    html += '<div class="greenname">' + data.away_score + "</div>";
                } else if (data.division == "row vs") {
                    html += '<div class=""> </div>';
                    html += '<div class="playing redname nonDisplay">';
                    html += "<div>Finished</div>";
                    html += "<div>(<span>" + data.Score1stHalf + "</span>,<span>" + data.Score2ndHalf + "</span>)</div>";
                    html += "</div>";
                    html += '<div class="not_playing">';
                    html += '<div><span class="redname" style="font-size:24px; font-weight:700;">VS</span></div>';
                    html += "</div>";
                    html += '<div class=""> </div>';
                }
                html += '<div class="' + data.away_idx + '">' + data.away_name + "</div>";
                html += "</div>";
                html += "</div>";
                html += '<div class="away_img">';
                html += '<img src="' + data.away_img + '">';
                html += "</div>";

                $("#analysisTitle div").append(html);
            },
            soccer_analysis_standing_html: function (_analysis_json) {
                var h_html = "",
                    a_html = "",
                    data = _analysis_json,
                    standing = data.standings,
                    standing_home = standing.home_data,
                    standing_away = standing.away_data;

                console.log(standing);
                console.log(standing_home);
                console.log(standing_home.length);
                $("#titleContainer > div.teamName > div:nth-child(1)").text(standing_home[0]);
                h_html += '<div class="home">';
                h_html += '<div class="h_title">';
                h_html += "<div>" + standing_home[1] + "</div>";
                h_html += "<div>" + standing_home[2] + "</div>";
                h_html += "<div>" + standing_home[3] + "</div>";
                h_html += "<div>" + standing_home[4] + "</div>";
                h_html += "<div>" + standing_home[5] + "</div>";
                h_html += "<div>" + standing_home[6] + "</div>";
                h_html += "<div>" + standing_home[7] + "</div>";
                h_html += "<div>" + standing_home[8] + "</div>";
                h_html += "<div>" + standing_home[9] + "</div>";
                h_html += "<div>" + standing_home[10] + "</div>";
                h_html += "</div>";
                h_html += '<div class="h_content">';
                h_html += '<div class="h_total"></div>';
                h_html += "</div>";
                $("#standingContent").append(h_html);
                for (var i = 11; i < 92; i += 10) {
                    var n_h_html = "";
                    n_h_html += "<div>";
                    n_h_html += "<div>" + standing_home[i] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 1] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 2] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 3] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 4] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 5] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 6] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 7] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 8] + "</div>";
                    n_h_html += "<div>" + standing_home[i + 9] + "</div>";
                    n_h_html += "</div>";

                    $DOCUMENT.find("#standingContent .home .h_content .h_total").append(n_h_html);
                }

                $("#titleContainer > div.teamName > div:nth-child(2)").text(standing_away[0]);
                a_html += '<div class="away">';
                a_html += '<div class="a_title">';
                a_html += "<div>" + standing_away[1] + "</div>";
                a_html += "<div>" + standing_away[2] + "</div>";
                a_html += "<div>" + standing_away[3] + "</div>";
                a_html += "<div>" + standing_away[4] + "</div>";
                a_html += "<div>" + standing_away[5] + "</div>";
                a_html += "<div>" + standing_away[6] + "</div>";
                a_html += "<div>" + standing_away[7] + "</div>";
                a_html += "<div>" + standing_away[8] + "</div>";
                a_html += "<div>" + standing_away[9] + "</div>";
                a_html += "<div>" + standing_away[10] + "</div>";
                a_html += "</div>";
                a_html += '<div class="a_content">';
                a_html += '<div class="a_total"></div>';
                a_html += "</div>";
                $("#standingContent").append(a_html);
                for (var s = 11; s < 92; s += 10) {
                    var n_a_html = "";
                    n_a_html += "<div>";
                    n_a_html += "<div>" + standing_away[s] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 1] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 2] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 3] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 4] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 5] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 6] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 7] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 8] + "</div>";
                    n_a_html += "<div>" + standing_away[s + 9] + "</div>";
                    n_a_html += "</div>";

                    $DOCUMENT.find("#standingContent .away .a_content .a_total").append(n_a_html);
                }
            },
            soccer_analysis_HTH_html: function (_analysis_json) {
                var html = "",
                    str = "",
                    data = _analysis_json.headtohead,
                    league = _analysis_json.headtohead_league,
                    home_name = $("#standings #titleContainer .teamName div:nth-child(1)").text(),
                    idx = home_name.indexOf("]"),
                    home = "";

                if (idx == -1) {
                    home = home_name;
                } else {
                    home = home_name.substring(idx + 1);
                }

                html += '<div class="hthOption">';
                html += "<div>";
                html += '<select id="hthSelect">';
                for (var i = 0; i < data.length; i++) {
                    if (i == data.length - 1) {
                        html += '<option value="' + (i + 1) + '" selected>' + (i + 1) + "</option>";
                    } else {
                        html += '<option value="' + (i + 1) + '">' + (i + 1) + "</option>";
                    }
                }
                html += "</select>";
                html += '<label for="same">';
                html += '<input type="checkbox" id="same">';
                html += "</label>";
                html += "<div>H-A Same</div>";
                html += '<select id="league_name">';
                html += '<option value="all" selected="selected">전체선택</option>';
                for (var n = 0; n < league.length; n++) {
                    html += '<option value="' + league[n] + '">' + league[n] + "</opntion>";
                }
                html += "</select>";
                html += "</div>";
                html += "</div>";

                $("#headToHead #titleContainer").append(html);

                str += '<div id="hthContent">';
                for (var s = 0; s < data.length; s++) {
                    str += '<div class = "content_' + (s + 1) + '">';
                    str += '<div class="' + data[s].league_cup + '">' + data[s].league_cup + "</div>";
                    str += "<div>" + data[s].date + "</div>";
                    if (home == data[s].home) {
                        str += '<div class="home green">' + data[s].home + "</div>";
                    } else {
                        str += "<div>" + data[s].home + "</div>";
                    }
                    str += "<div>" + data[s].score + "</div>";
                    str += "<div>" + data[s].ht + "</div>";
                    str += "<div>" + data[s].corner + "</div>";
                    if (home == data[s].away) {
                        str += '<div class="away green">' + data[s].away + "</div>";
                    } else {
                        str += "<div>" + data[s].away + "</div>";
                    }
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    if (data[s].wl == "W") {
                        str += '<div class="red">' + data[s].wl + "</div>";
                    } else if (data[s].wl == "D") {
                        str += '<div class="green">' + data[s].wl + "</div>";
                    } else if (data[s].wl == "L") {
                        str += '<div class="blue">' + data[s].wl + "</div>";
                    }
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "</div>";
                }

                str += "</div>";
                $("#headToHead #contentContainer").append(str);
                if (data.length != 0) {
                    var tmp = "",
                        adr = "#headToHead #contentContainer #hthContent div div:nth-child(14)",
                        win_count = $DOCUMENT.find(adr + ".red").length,
                        draw_count = $DOCUMENT.find(adr + ".green").length,
                        lost_count = $DOCUMENT.find(adr + ".blue").length;
                    console.log(win_count);
                    tmp += '<div id="hthFooter">';
                    tmp += '<div class="total_info">';
                    tmp += '<span>Last <span class="red">' + data.length + "</span> matches, " + win_count + " win, " + draw_count + " draw,";
                    tmp += " " + lost_count + " loss,";
                    tmp += ' Win rate：<span class="red">' + (win_count / data.length) * 100 + '%</span> Odds win rate：<span class="red">-.-%</span> Over';
                    tmp += ' rate：<span class="red">-.-%</span> Odd rate：<span class="red">-%</span></span>';
                    tmp += "</div>";
                    tmp += "</div>";

                    $("#headToHead #contentContainer").append(tmp);
                }
            },
            /* soccer_content_info_html: function (data, idx, node, $this) {
                var html = "";
                data_length = data.length;

                console.log(data);
                for (var i = 0; i < data_length; i++) {
                    if (data[i].home_idx == idx) {
                        if (data[i].append_content == "" || data[i].append_content == null || data[i].append_content == undefined) {
                            html += '<div id="infoContainer">';
                            html += '<div class="info_text">' + data[i].youth_content + "</div>";
                            html += "</div>";
                        } else {
                            html += '<div id="infoContainer">';
                            html += '<div class="info_text">' + data[i].append_content + "</div>";
                            html += "</div>";
                        }
                    }
                }
                $("article").after(html);

                var height = node.offset();
                var point = $this[0].offsetTop;

                var divTop = point + 20; //상단 좌표 위치 안맞을시 e.pageY
                console.log(divTop);
                var divLeft = height.left - 80; //좌측 좌표 위치 안맞을시 e.pageX
                console.log(height);
                $("#infoContainer").css({
                    height: "42px",
                    width: "506px",
                    top: divTop,
                    left: divLeft,
                    position: "absolute"
                });
            }, */
            soccer_analysis_Previous_html: function (data, league, sortation) {
                var html = "",
                    str = "",
                    team_adr = "",
                    default_adr = $("#standings #titleContainer .teamName");
                if (sortation == 1) {
                    team_adr = default_adr.find("div:nth-child(1)").text();
                } else {
                    team_adr = default_adr.find("div:nth-child(2)").text();
                }
                var idx = team_adr.indexOf("]"),
                    team_name = "";
                if (idx == -1) {
                    team_name = team_adr;
                } else {
                    team_name = team_adr.substring(idx + 1);
                }
                console.log(team_name);
                html += '<div class="staOption">';
                html += "<div>";
                html += "<div>" + team_name + "</div>";
                html += '<select id="staSelect">';
                for (var i = 0; i < data.length; i++) {
                    if (i == data.length - 1) {
                        html += '<option value="' + (i + 1) + '" selected="selected">' + (i + 1) + "</option>";
                    } else {
                        html += '<option value="' + (i + 1) + '">' + (i + 1) + "</option>";
                    }
                }
                html += "</select>";
                html += '<label for="same">';
                html += '<input type="checkbox" id="same">';
                html += "</label>";
                html += "<div>H-A Same</div>";
                html += '<select id="league_name">';
                html += '<option value="all" selected="selected">전체선택</option>';
                for (var n = 0; n < league.length; n++) {
                    html += '<option value="' + league[n] + '">' + league[n] + "</opntion>";
                }
                html += "</select>";
                html += "</div>";
                html += "</div>";
                var prev_adr = $("#PreviousScoresStatistics");
                if (sortation == 1) {
                    prev_adr.find("#h_statistics #titleContainer").append(html);
                } else {
                    prev_adr.find("#a_statistics #titleContainer").append(html);
                }

                str += '<div id="staContent">';
                for (var s = 0; s < data.length; s++) {
                    if (sortation == 1) {
                        str += '<div class = "content_' + (s + 1) + '">';
                    } else if (sortation != 1 && team_name != data[s].home) {
                        str += '<div class = "content_' + (s + 1) + '">';
                    } else {
                        str += '<div class = "content_' + (s + 1) + '" style="background-color: #F2F9FD;">';
                    }
                    str += '<div class="' + data[s].league + '">' + data[s].league + "</div>";
                    str += "<div>" + data[s].date + "</div>";
                    if (team_name == data[s].home) {
                        if (data[s].ex == "" || data[s].ex == null || data[s].ex == undefined) {
                            str += '<div class="home green">' + data[s].home + "</div>";
                        } else {
                            str += '<div class="home green"><span class="hp">' + data[s].ex + "</span>" + data[s].home + "</div>";
                        }
                    } else {
                        if (data[s].ex == "" || data[s].ex == null || data[s].ex == undefined) {
                            str += "<div>" + data[s].home + "</div>";
                        } else {
                            str += '<div><span class="hp">' + data[s].ex + "</span>" + data[s].home + "</div>";
                        }
                    }
                    str += "<div>" + data[s].score + "</div>";
                    str += "<div>" + data[s].ht + "</div>";
                    str += "<div>" + data[s].corner + "</div>";
                    if (team_name == data[s].away) {
                        if (data[s].ex == "" || data[s].ex == null || data[s].ex == undefined) {
                            str += '<div class="away green">' + data[s].away + "</div>";
                        } else {
                            str += '<div class="away green"><span class="hp">' + data[s].ex + "</span>" + data[s].away + "</div>";
                        }
                    } else {
                        if (data[s].ex == "" || data[s].ex == null || data[s].ex == undefined) {
                            str += "<div>" + data[s].away + "</div>";
                        } else {
                            str += '<div><span class="hp">' + data[s].ex + "</span>" + data[s].away + "</div>";
                        }
                    }
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    if (data[s].wl == "W") {
                        str += '<div class="red">' + data[s].wl + "</div>";
                    } else if (data[s].wl == "D") {
                        str += '<div class="green">' + data[s].wl + "</div>";
                    } else if (data[s].wl == "L") {
                        str += '<div class="blue">' + data[s].wl + "</div>";
                    }
                    str += "<div>-</div>";
                    str += "<div>-</div>";
                    str += "</div>";
                }

                str += "</div>";
                if (sortation == 1) {
                    prev_adr.find("#h_statistics #contentContainer").append(str);
                } else {
                    prev_adr.find("#a_statistics #contentContainer").append(str);
                }

                if (data.length != 0) {
                    if (sortation == 1) {
                        var tmp = "",
                            h_adr = $DOCUMENT.find("#PreviousScoresStatistics #h_statistics #contentContainer #staContent div");
                        (win_count = h_adr.find("div:nth-child(14).red").length),
                            (draw_count = h_adr.find("div:nth-child(14).green").length),
                            (lost_count = h_adr.find("div:nth-child(14).blue").length);
                        console.log(win_count);
                    } else {
                        var tmp = "",
                            a_adr = $DOCUMENT.find("#PreviousScoresStatistics #a_statistics #contentContainer #staContent div");
                        (win_count = a_adr.find("div:nth-child(14).red").length),
                            (draw_count = a_adr.find("div:nth-child(14).green").length),
                            (lost_count = a_adr.find("div:nth-child(14).blue").length);
                        console.log(win_count);
                    }
                    tmp += '<div id="staFooter">';
                    tmp += '<div class="total_info">';
                    tmp += '<span>Last <span class="red">' + data.length + "</span> matches, " + win_count + " win, " + draw_count + " draw,";
                    tmp += " " + lost_count + " loss,";
                    tmp += ' Win rate：<span class="red">' + (win_count / data.length) * 100 + '%</span> Odds win rate：<span class="red">-.-%</span> Over';
                    tmp += ' rate：<span class="red">-.-%</span> Odd rate：<span class="red">-%</span></span>';
                    tmp += "</div>";
                    tmp += "</div>";

                    if (sortation == 1) {
                        prev_adr.find("#h_statistics #contentContainer").append(tmp);
                    } else {
                        prev_adr.find("#a_statistics #contentContainer").append(tmp);
                    }
                }
            },
            soccer_analysis_selectbox_event: function ($this, content_adr, title_adr) {
                var val = $this.val(),
                    content_length = content_adr.children().length,
                    same_checked = title_adr.find("#same").is(":checked"),
                    league_val = title_adr.find("#league_name").val(),
                    s = 0,
                    home_length = content_adr.children("div").children(".home.green").length;

                $this.find("option:selected").attr("selected", "selected");
                $this.find("option:selected").siblings().attr("selected", false);

                console.log(val);
                console.log(content_length);
                console.log(same_checked);
                console.log(home_length);
                console.log(league_val);

                if (same_checked == false) {
                    if (league_val == "all") {
                        for (var i = 0; i < content_length; i++) {
                            if (i + 1 > val) {
                                content_adr.children().eq(i).addClass("nonDisplay");
                            } else {
                                content_adr.children().eq(i).removeClass("nonDisplay");
                            }
                        }
                    } else {
                        for (var i = 0; i < content_length; i++) {
                            var league_text = content_adr.children().eq(i).children().eq(0).text(),
                                sss = content_adr.children().not(".nonDisplay").eq(i).children().eq(0).text();
                            if (league_val.replace(/ /g, "") == league_text.replace(/ /g, "")) {
                                s++;
                                if (s > val) {
                                    content_adr.children().eq(i).addClass("nonDisplay");
                                } else {
                                    content_adr.children().eq(i).removeClass("nonDisplay");
                                }
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < content_length; i++) {
                        if (val < i + 1) {
                            content_adr.children("div").children(".home.green").eq(i).parent().addClass("nonDisplay");
                        } else {
                            content_adr.children("div").children(".home.green").parent().removeClass("nonDisplay");
                        }
                    }
                }
            },
            soccer_analysis_checkbox_event: function ($this, content_adr, title_adr, hthSelect, home_name) {
                var checked_val = $this.is(":checked"),
                    //home_name = $('#standings #titleContainer .teamName div:nth-child(1)').text(),
                    idx = home_name.indexOf("]"),
                    league_val = title_adr.find("#league_name").val(),
                    home = "",
                    html = "",
                    count = 0,
                    number = 0,
                    content_length = content_adr.children().length,
                    h_team_length = content_adr.children().find("div:nth-child(3).green").length;

                console.log(h_team_length);
                console.log(checked_val);
                console.log(content_length);
                if (idx == -1) {
                    home = home_name;
                } else {
                    home = home_name.substring(idx + 1);
                }
                console.log(home);
                if (checked_val == true) {
                    hthSelect.children().remove();
                    if (league_val == "all") {
                        for (var i = 0; i < content_length; i++) {
                            var team = content_adr.children().eq(i).find("div:nth-child(3)").text(),
                                html = "";

                            if (team != home) {
                                content_adr.children().eq(i).addClass("nonDisplay");
                            } else {
                                content_adr.children().eq(i).removeClass("nonDisplay");
                            }
                        }
                        for (var n = 0; n < h_team_length; n++) {
                            if (n == h_team_length - 1) {
                                html += '<option value="' + (n + 1) + '" selected>' + (n + 1) + "</option>";
                            } else {
                                html += '<option value="' + (n + 1) + '">' + (n + 1) + "</option>";
                            }
                        }
                    } else {
                        for (var n = 0; n < content_length; n++) {
                            var league_name = content_adr.children().eq(n).find("div:nth-child(1)").text(),
                                home_name = content_adr.children().eq(n).find("div:nth-child(3).green").text();

                            if (league_name.replace(/ /g, "") == league_val.replace(/ /g, "") && home_name == home) {
                                number++;
                                content_adr.children().eq(n).removeClass("nonDisplay");
                            } else {
                                content_adr.children().eq(n).addClass("nonDisplay");
                            }
                        }
                        for (var s = 0; s < number; s++) {
                            if (s == number - 1) {
                                html += '<option value="' + (s + 1) + '" selected>' + (s + 1) + "</option>";
                            } else {
                                html += '<option value="' + (s + 1) + '">' + (s + 1) + "</option>";
                            }
                        }
                    }
                    hthSelect.append(html);
                } else {
                    hthSelect.children().remove();
                    if (league_val == "all") {
                        for (var i = 0; i < content_length; i++) {
                            var team = content_adr.children().eq(i).find("div:nth-child(3)").text();
                            console.log(team);
                            if (i == content_length - 1) {
                                html += '<option value="' + (i + 1) + '" selected>' + (i + 1) + "</option>";
                            } else {
                                html += '<option value="' + (i + 1) + '">' + (i + 1) + "</option>";
                            }
                            if (team != home) {
                                content_adr.children().eq(i).removeClass("nonDisplay");
                            }
                        }
                        hthSelect.append(html);
                    } else {
                        content_adr.children().removeClass("nonDisplay");
                        for (var i = 0; i < content_length; i++) {
                            var team = content_adr.children().eq(i).find("div:nth-child(1)").text();

                            console.log(team);
                            console.log(league_val);
                            if (team.replace(/ /g, "") != league_val.replace(/ /g, "")) {
                                console.log("통과");
                                content_adr.children().eq(i).addClass("nonDisplay");
                            }
                            if (team.replace(/ /g, "") == league_val.replace(/ /g, "")) {
                                count++;
                            }
                            console.log(count);
                        }
                        for (var s = 0; s < count; s++) {
                            if (s == count - 1) {
                                html += '<option value="' + (s + 1) + '" selected>' + (s + 1) + "</option>";
                            } else {
                                html += '<option value="' + (s + 1) + '">' + (s + 1) + "</option>";
                            }
                        }
                        hthSelect.append(html);
                    }
                }
            },
            soccer_analysis_league_selectbox_event: function ($this, content_adr, title_adr, hthSelect) {
                var html = "",
                    val = $this.val(),
                    same_checked = title_adr.find("#same").is(":checked"),
                    content_length = content_adr.children().length;
                if (val == "all") {
                    var league_length = content_adr.children().length;
                } else {
                    var league_length = content_adr.children().find("div." + val.substring(0, 3) + "." + val.substring(4) + "").length;
                }
                console.log(content_length);
                console.log(league_length);
                console.log(same_checked);
                $this.find("option:selected").attr("selected", "selected");
                $this.find("option:selected").siblings().attr("selected", false);
                if (same_checked == false) {
                    hthSelect.children().remove();
                    for (var n = 0; n < league_length; n++) {
                        if (n == league_length - 1) {
                            html += '<option value="' + (n + 1) + '" selected>' + (n + 1) + "</option>";
                        } else {
                            html += '<option value="' + (n + 1) + '">' + (n + 1) + "</option>";
                        }
                    }
                    hthSelect.append(html);
                    content_adr.children().removeClass("nonDisplay");
                    for (var i = 0; i < content_length; i++) {
                        var content = content_adr.children().eq(i).children().eq(0).text(),
                            re_val = val.replace(/ /g, ""),
                            re_content = content.replace(/ /g, "");
                        console.log(content.replace(/ /g, ""));
                        console.log(val.replace(/ /g, ""));
                        console.log(val == content);

                        if (re_val != re_content) {
                            content_adr.children().eq(i).addClass("nonDisplay");
                            if (val == "all") {
                                content_adr.children().eq(i).removeClass("nonDisplay");
                            }
                        }
                    }
                } else {
                    content_adr.children().removeClass("nonDisplay");
                    for (var i = 0; i < content_length; i++) {
                        var content = content_adr.children().eq(i).children().eq(0).text(),
                            home_class = content_adr.children().eq(i).children().eq(2).attr("class"),
                            re_val = val.replace(/ /g, ""),
                            re_content = content.replace(/ /g, "");
                        console.log(content.replace(/ /g, ""));
                        console.log(val.replace(/ /g, ""));
                        console.log(val == content);
                        console.log(home_class);

                        if (re_val != re_content || home_class != "home green") {
                            content_adr.children().eq(i).addClass("nonDisplay");
                            if (val == "all") {
                                if (home_class == "home green") {
                                    content_adr.children().eq(i).removeClass("nonDisplay");
                                }
                            }
                        }
                    }
                    hthSelect.children().remove();
                    var not_nonDisplay_length = content_adr.children().not(".nonDisplay").length;

                    console.log(not_nonDisplay_length);
                    for (var s = 0; s < not_nonDisplay_length; s++) {
                        if (s == not_nonDisplay_length - 1) {
                            html += '<option value="' + (s + 1) + '" selected>' + (s + 1) + "</option>";
                        } else {
                            html += '<option value="' + (s + 1) + '">' + (s + 1) + "</option>";
                        }
                    }
                    hthSelect.append(html);
                }
            },
            soccer_team_statistics_html: function (_team_json) {
                var data_team_info = _team_json.team_info_data,
                    data_team_select = _team_json.team_select,
                    data_team_sta = _team_json.team_stats,
                    data_coach = _team_json.team_coach,
                    data_league = _team_json.team_league_result,
                    option_html = "",
                    l_option_html = "",
                    html = "",
                    teamStatistics = $("#teamStatistics > div.staContent > div"),
                    teamInfo = $("#teamTitle>div.team_info");
                console.log(data_team_select);
                for (var i = 0; i < data_team_select.length; i++) {
                    option_html += '<option value="' + data_team_select[i].team_idx + '">' + data_team_select[i].name + "</option>";
                }
                $("#team_select").append(option_html);
                $("#teamTitle .team_img div:nth-child(2)").attr("data-team_idx", data_team_info.team_idx);
                $("#teamTitle .team_img div:nth-child(1) img").attr("src", data_team_info.logo);
                $("#teamTitle .team_img div:nth-child(2)").text(data_team_info.name);
                teamInfo.find("div:nth-child(1) div:nth-child(2)").text(data_team_info.name);
                teamInfo.find("div:nth-child(2) div:nth-child(2)").text(data_team_info.city);
                teamInfo.find("div:nth-child(2) div:nth-child(4)").text(data_team_info.home_stadium);
                teamInfo.find("div:nth-child(3) div:nth-child(2)").text(data_team_info.capacity);
                teamInfo.find("div:nth-child(3) div:nth-child(4)").text(data_team_info.established_date);
                teamInfo.find("div:nth-child(4) div:nth-child(2)").text(data_coach.name);
                teamInfo.find("div:nth-child(4) div:nth-child(4) a").attr("href", data_team_info.website);
                teamInfo.find("div:nth-child(5) div:nth-child(2)").text(data_team_info.adress);

                for (var n = 1; n < data_league.length; n++) {
                    l_option_html += '<option value="' + data_league[n].league_idx + '">' + data_league[n].league_name + "</option>";
                }
                $("#league_select").append(l_option_html);
                var winRate = _Fn.cal_percent(data_league[0].win, parseInt(data_league[0].win) + parseInt(data_league[0].draw) + parseInt(data_league[0].loss));
                console.log(winRate);
                teamStatistics.find("div:nth-child(1)").text(data_league[0].win);
                teamStatistics.find("div:nth-child(2)").text(data_league[0].draw);
                teamStatistics.find("div:nth-child(3)").text(data_league[0].loss);
                teamStatistics.find("div:nth-child(4)").text(Math.round(winRate) + "%");
                teamStatistics.find("div:nth-child(5)").text(data_league[0].fouls);
                teamStatistics.find("div:nth-child(6)").text(data_league[0].yellow_card);
                teamStatistics.find("div:nth-child(7)").text(data_league[0].red_card);
                teamStatistics.find("div:nth-child(8)").text(data_league[0].possession + "%");
                teamStatistics.find("div:nth-child(9)").text(data_league[0].shots + "(" + data_league[0].shots_ot + ")");
                teamStatistics.find("div:nth-child(10)").text(data_league[0].passes + "(" + data_league[0].passes_success + ")");
                var pesses = _Fn.cal_percent(data_league[0].passes_success, data_league[0].passes);
                teamStatistics.find("div:nth-child(11)").text(pesses.toFixed(0) + "%");
                teamStatistics.find("div:nth-child(12)").text(data_league[0].dribbles);
                teamStatistics.find("div:nth-child(13)").text(data_league[0].rating);

                var content_length = 0;
                if (data_team_sta.length < 20) {
                    content_length = data_team_sta.length;
                } else {
                    content_length = 20;
                }
                for (var s = 0; s < content_length; s++) {
                    var data = data_team_sta[s];
                    console.log(data.game_idx);
                    html += '<div class="content ' + data.game_idx + '">';
                    html += '<div style="background-color:' + data.league_color + '; color:#ffffff;">';
                    html += "<span>" + data.league_name + "</span>";
                    html += "</div>";
                    html += "<div><span>" + data.date + "</span></div>";
                    html += '<div class="' + data.home_idx + '"><span>' + data.home_name + "</span></div>";
                    html += "<div><span>" + data.home_goal + "-" + data.away_goal + "</span></div>";
                    html += '<div class="' + data.away_name + '"><span>' + data.away_name + "</span></div>";
                    html += "<div><span>" + data.fouls + "</span></div>";
                    html += "<div><span>" + data.yellow_card + "</span></div>";
                    html += "<div><span>" + data.red_card + "</span></div>";
                    html += "<div><span>" + data.possession + "%</span></div>";
                    html += "<div><span>" + data.shots + "(" + data.ot + ")</span></div>";
                    html += "<div><span>" + data.passes + "(" + data.passes_success + ")</span></div>";
                    var pass_result = "";
                    if (data.passes_success == 0 && data.passes == 0) {
                        pass_result = 0;
                    } else {
                        pass_result = _Fn.cal_percent(data.passes_success, data.passes);
                    }
                    html += "<div><span>" + pass_result.toFixed(0) + "%</span></div>";
                    html += "<div><span>" + data.dribbles + "</span></div>";
                    html += "<div><span>" + data.rating + "</span></div>";
                    html += "</div>";
                }
                if (content_length < 20) {
                    html += '<button id="plus_btn" class="nonDisplay">더보기</button>';
                } else {
                    html += '<button id="plus_btn">더보기</button>';
                }
                $DOCUMENT.find("#league_schedule .schedule_content").append(html);
                html = "";

                /* $DOCUMENT.find('#league_schedule .schedule_content').twbsPagination({
                    totalPages: data_team_sta.length / 20, // 총 페이지 번호 수
                    visiblePages: 10, // 하단에서 한번에 보여지는 페이지 번호 수
                    startPage: 1, // 시작시 표시되는 현재 페이지
                    initiateStartPageClick: false, // 플러그인이 시작시 페이지 버튼 클릭 여부 (default : true)
                    first: "<<", // 페이지네이션 버튼중 처음으로 돌아가는 버튼에 쓰여 있는 텍스트
                    prev: "<", // 이전 페이지 버튼에 쓰여있는 텍스트
                    next: ">", // 다음 페이지 버튼에 쓰여있는 텍스트
                    last: ">>", // 페이지네이션 버튼중 마지막으로 가는 버튼에 쓰여있는 텍스트
                    nextClass: "page-item next", // 이전 페이지 CSS class
                    prevClass: "page-item prev", // 다음 페이지 CSS class
                    lastClass: "page-item last", // 마지막 페이지 CSS calss
                    firstClass: "page-item first", // 첫 페이지 CSS class
                    pageClass: "page-item", // 페이지 버튼의 CSS class
                    activeClass: "active", // 클릭된 페이지 버튼의 CSS class
                    disabledClass: "disabled", // 클릭 안된 페이지 버튼의 CSS class
                    anchorClass: "page-link", //버튼 안의 앵커에 대한 CSS class

                    onPageClick: function (event, page) {
                        //클릭 이벤트
                        console.log("클릭");
                        console.log(event);
                        console.log(page);
                        $DOCUMENT.find('#league_schedule .schedule_content div:not(.pagination)').remove();
                        var page2 = '',
                            num = page;
                        if (page != 1) {
                            page = page * 10;
                            page2 = page + 20;
                        } else {
                            page = page - 1;
                            page2 = 20;
                        }
                        console.log(page);
                        console.log(page2);
                        for (var s = page; s < page2; s++) {
                            console.log(s);
                            html += '<div class="content ' + data_team_sta[s].game_idx + '">';
                            html += '<div style="background-color:' + data_team_sta[s].league_color + '; color:#ffffff;">';
                            html += '<span>' + data_team_sta[s].league_name + '</span>';
                            html += '</div>';
                            html += '<div><span>' + data_team_sta[s].date + '</span></div>';
                            html += '<div class="' + data_team_sta[s].home_idx + '"><span>' + data_team_sta[s].home_name + '</span></div>';
                            html += '<div><span>' + data_team_sta[s].home_goal + '-' + data_team_sta[s].away_goal + '</span></div>';
                            html += '<div class="' + data_team_sta[s].away_name + '"><span>' + data_team_sta[s].away_name + '</span></div>';
                            html += '<div><span>' + data_team_sta[s].fouls + '</span></div>';
                            html += '<div><span>' + data_team_sta[s].yellow_card + '</span></div>';
                            html += '<div><span>' + data_team_sta[s].red_card + '</span></div>';
                            html += '<div><span>' + data_team_sta[s].possession + '</span></div>';
                            html += '<div><span>' + data_team_sta[s].shots + '(' + data_team_sta[s].ot + ')</span></div>';
                            html += '<div><span>' + data_team_sta[s].passes + '(' + data_team_sta[s].passes_success + ')</span></div>';
                            var pass_result = '';
                            if (data_team_sta[s].passes_success == 0 && data_team_sta[s].passes == 0) {
                                pass_result = 0;
                            } else {
                                pass_result = (data_team_sta[s].passes_success / data_team_sta[s].passes) * 100;
                            }
                            html += '<div><span>' + pass_result.toFixed(0) + '%</span></div>';
                            html += '<div><span>' + data_team_sta[s].dribbles + '</span></div>';
                            html += '<div><span>' + data_team_sta[s].rating + '</span></div>';
                            html += '</div>';
                        }
                        $DOCUMENT.find('#league_schedule .schedule_content').prepend(html);
                        html = '';
                    }

                }); */
            },
            soccer_team_statistics_content_html: function (num, num2, html, data_team_sta) {
                for (var s = num; s < num2; s++) {
                    var data = data_team_sta[s];
                    html += '<div class="content ' + data.game_idx + '">';
                    html += '<div style="background-color:' + data.league_color + '; color:#ffffff;">';
                    html += "<span>" + data.league_name + "</span>";
                    html += "</div>";
                    html += "<div><span>" + data.date + "</span></div>";
                    html += '<div class="' + data.home_idx + '"><span>' + data.home_name + "</span></div>";
                    html += "<div><span>" + data.home_goal + "-" + data.away_goal + "</span></div>";
                    html += '<div class="' + data.away_name + '"><span>' + data.away_name + "</span></div>";
                    html += "<div><span>" + data.fouls + "</span></div>";
                    html += "<div><span>" + data.yellow_card + "</span></div>";
                    html += "<div><span>" + data.red_card + "</span></div>";
                    html += "<div><span>" + data.possession + "%</span></div>";
                    html += "<div><span>" + data.shots + "(" + data.ot + ")</span></div>";
                    html += "<div><span>" + data.passes + "(" + data.passes_success + ")</span></div>";
                    var pass_result = "";
                    if (data.passes_success == 0 && data.passes == 0) {
                        pass_result = 0;
                    } else {
                        pass_result = _Fn.cal_percent(data.passes_success, data.passes);
                    }
                    html += "<div><span>" + pass_result.toFixed(0) + "%</span></div>";
                    html += "<div><span>" + data.dribbles + "</span></div>";
                    html += "<div><span>" + data.rating + "</span></div>";
                    html += "</div>";
                }
                $DOCUMENT.find("#league_schedule .schedule_content #plus_btn").before(html);
                html = "";
            },
            soccer_team_statistics_honor_content_html: function (_team_json) {
                var html = "",
                    data = _team_json.team_honor,
                    sub_arr = ["League", "Champion Times", "Champion Season/Year"],
                    select_class = $("#menu_nav").find(".selected").prop("class");
                console.log(select_class);

                console.log(data);
                if (select_class == "league selected" || select_class == "line_up selected") {
                    html += '<section id="honor" class="nonDisplay">';
                } else {
                    html += '<section id="honor">';
                }
                html += '<div class="fullTitle">';
                html += "<div>Team Honor</div>";
                html += "</div>";
                html += '<div class="subTitle">';
                for (var i = 0; i < sub_arr.length; i++) {
                    html += "<div><span>" + sub_arr[i] + "</span></div>";
                }
                html += "</div>";
                html += '<div class="honorContent">';
                for (var n = 0; n < data.length; n++) {
                    var season = data[n].data;
                    html += "<div>";
                    html += "<div>" + data[n].title + "</div>";
                    html += "<div>" + data[n].count + "</div>";
                    html += "<div>";
                    for (var s = 0; s < season.length; s++) {
                        html += "<span>" + season[s] + "</span>";
                    }
                    html += "</div>";
                    html += "</div>";
                }
                html += "</div>";
                html += "</section>";
                $("#league_schedule").after(html);
            },
            soccer_team_statistics_profile_content_html: function (_team_json) {
                var html = "",
                    data = _team_json.team_info_data,
                    select_class = $("#menu_nav").find(".selected").prop("class");
                console.log(select_class);

                console.log(data);
                if (select_class == "league selected" || select_class == "line_up selected") {
                    html += '<section id="teamProfile" class="nonDisplay">';
                } else {
                    html += '<section id="teamProfile">';
                }
                html += '<div class="fullTitle">';
                html += "<div>Team Profile</div>";
                html += "</div>";
                html += '<div class="profileContent">';
                html += "<div><div>" + data.team_introduce + "</div></div>";
                html += "</div>";
                html += "</section>";

                $("#honor").after(html);
            },
            soccer_team_leaguestats_content_html: function (league_data) {
                var html = "",
                    full = ["fullHome", "fullAway"],
                    half = ["halfHome", "halfAway"],
                    home = ["Home", "Away"];
                console.log(league_data);
                if (league_data == "") {
                    html += '<section id="league_nodata" class="nonDisplay">';
                    html += "<div><span>No Data</span></div>";
                    html += "</section>";
                } else {
                    html += '<section id="leagueStatsFull" class="nonDisplay">';
                    html += '<div class="fullTitle">';
                    html += "<div>Rank in full League Match</div></div>";
                    html += '<div class="subTitle">';
                    html += "<div></div><div>P</div><div>W</div><div>D</div><div>L</div><div>Get</div>";
                    html += "<div>Miss</div><div>Net</div><div>W%</div><div>D%</div><div>L%</div><div>Average Get</div>";
                    html += "<div>Average Miss</div><div>Pts</div></div>";
                    html += '<div class="fullContent">';
                    html += '<div class="fullTotal">';
                    html += "<div>Total</div>";
                    var set_w = parseInt(league_data[0].W) + parseInt(league_data[1].W),
                        set_d = parseInt(league_data[0].D) + parseInt(league_data[1].D),
                        set_l = parseInt(league_data[0].L) + parseInt(league_data[1].L),
                        set_p = parseInt(league_data[0].P) + parseInt(league_data[1].P);
                    html += "<div>" + (league_data[0].P + league_data[1].P) + "</div>";
                    html += "<div>" + (league_data[0].W + league_data[1].W) + "</div>";
                    html += "<div>" + (league_data[0].D + league_data[1].D) + "</div>";
                    html += "<div>" + (league_data[0].L + league_data[1].L) + "</div>";
                    html += "<div>" + (league_data[0].Get + league_data[1].Get) + "</div>";
                    html += "<div>" + (league_data[0].Miss + league_data[1].Miss) + "</div>";
                    html += "<div>" + (league_data[0].Net + league_data[1].Net) + "</div>";
                    html += "<div>" + _Fn.cal_percent(set_w, set_p).toFixed(1) + "%</div>";
                    html += "<div>" + _Fn.cal_percent(set_d, set_p).toFixed(1) + "%</div>";
                    html += "<div>" + _Fn.cal_percent(set_l, set_p).toFixed(1) + "%</div>";
                    html += "<div>" + league_data[2].average_get + "</div>";
                    html += "<div>" + league_data[2].average_miss + "</div>";
                    html += "<div>" + league_data[2].pts + "</div>";
                    html += "</div>";
                    for (var i = 0; i < full.length; i++) {
                        html += '<div class="' + full[i] + '">';
                        html += "<div>" + home[i] + "</div>";
                        html += "<div>" + league_data[i].P + "</div>";
                        html += "<div>" + league_data[i].W + "</div>";
                        html += "<div>" + league_data[i].D + "</div>";
                        html += "<div>" + league_data[i].L + "</div>";
                        html += "<div>" + league_data[i].Get + "</div>";
                        html += "<div>" + league_data[i].Miss + "</div>";
                        html += "<div>" + league_data[i].Net + "</div>";
                        html += "<div>" + _Fn.cal_percent(league_data[i].W, league_data[i].P).toFixed(1) + "%</div>";
                        html += "<div>" + _Fn.cal_percent(league_data[i].D, league_data[i].P).toFixed(1) + "%</div>";
                        html += "<div>" + _Fn.cal_percent(league_data[i].L, league_data[i].P).toFixed(1) + "%</div>";
                        html += "<div>" + league_data[i].average_get + "</div>";
                        html += "<div>" + league_data[i].average_miss + "</div>";
                        html += "<div>" + league_data[i].pts + "</div>";
                        html += "</div>";
                    }
                    /* html += '<div class="fullAway">';
                    html += '<div>Away</div>';
                    html += '<div>'+league_data[1].P+'</div>';
                    html += '<div>'+league_data[1].W+'</div>';
                    html += '<div>'+league_data[1].D+'</div>';
                    html += '<div>'+league_data[1].L+'</div>';
                    html += '<div>'+league_data[1].Get+'</div>';
                    html += '<div>'+league_data[1].Miss+'</div>';
                    html += '<div>'+league_data[1].Net+'</div>';
                    html += '<div>'+(league_data[1].W/league_data[0].P)*100+'%</div>';
                    html += '<div>'+(league_data[1].D/league_data[0].P)*100+'%</div>';
                    html += '<div>'+(league_data[1].L/league_data[0].P)*100+'%</div>';
                    html += '<div>'+league_data[1].average_get+'</div>';
                    html += '<div>'+league_data[1].average_miss+'</div>';
                    html += '<div>'+league_data[1].pts+'</div>';
                    html += '</div>'; */
                    html += "</div></section>";
                    html += '<section id="leagueStatsHalf" class="nonDisplay">';
                    html += '<div class="halfTitle">';
                    html += "<div>Rank in half League Match</div></div>";
                    html += '<div class="subTitle">';
                    html += "<div></div><div>P</div><div>W</div><div>D</div><div>L</div><div>Get</div>";
                    html += "<div>Miss</div><div>Net</div><div>W%</div><div>D%</div><div>L%</div><div>Average Get</div>";
                    html += "<div>Average Miss</div><div>Pts</div></div>";
                    html += '<div class="halfContent">';
                    html += '<div class="halfTotal">';
                    html += "<div>Total</div>";
                    var set_w = parseInt(league_data[3].W) + parseInt(league_data[4].W),
                        set_d = parseInt(league_data[3].D) + parseInt(league_data[4].D),
                        set_l = parseInt(league_data[3].L) + parseInt(league_data[4].L),
                        set_p = parseInt(league_data[3].P) + parseInt(league_data[4].P);
                    html += "<div>" + (league_data[3].P + league_data[4].P) + "</div>";
                    html += "<div>" + (league_data[3].W + league_data[4].W) + "</div>";
                    html += "<div>" + (league_data[3].D + league_data[4].D) + "</div>";
                    html += "<div>" + (league_data[3].L + league_data[4].L) + "</div>";
                    html += "<div>" + (league_data[3].Get + league_data[4].Get) + "</div>";
                    html += "<div>" + (league_data[3].Miss + league_data[4].Miss) + "</div>";
                    html += "<div>" + (league_data[3].Net + league_data[4].Net) + "</div>";
                    html += "<div>" + _Fn.cal_percent(set_w, set_p).toFixed(1) + "%</div>";
                    html += "<div>" + _Fn.cal_percent(set_d, set_p).toFixed(1) + "%</div>";
                    html += "<div>" + _Fn.cal_percent(set_l, set_p).toFixed(1) + "%</div>";
                    html += "<div>" + league_data[5].average_get + "</div>";
                    html += "<div>" + league_data[5].average_miss + "</div>";
                    html += "<div>" + league_data[5].pts + "</div>";
                    html += "</div>";
                    for (var n = 0; n < half.length; n++) {
                        html += '<div class="' + half[n] + '">';
                        html += "<div>" + home[n] + "</div>";
                        html += "<div>" + league_data[n + 3].P + "</div>";
                        html += "<div>" + league_data[n + 3].W + "</div>";
                        html += "<div>" + league_data[n + 3].D + "</div>";
                        html += "<div>" + league_data[n + 3].L + "</div>";
                        html += "<div>" + league_data[n + 3].Get + "</div>";
                        html += "<div>" + league_data[n + 3].Miss + "</div>";
                        html += "<div>" + league_data[n + 3].Net + "</div>";
                        html += "<div>" + _Fn.cal_percent(league_data[n + 3].W, league_data[n + 3].P).toFixed(1) + "%</div>";
                        html += "<div>" + _Fn.cal_percent(league_data[n + 3].D, league_data[n + 3].P).toFixed(1) + "%</div>";
                        html += "<div>" + _Fn.cal_percent(league_data[n + 3].L, league_data[n + 3].P).toFixed(1) + "%</div>";
                        html += "<div>" + league_data[n + 3].average_get + "</div>";
                        html += "<div>" + league_data[n + 3].average_miss + "</div>";
                        html += "<div>" + league_data[n + 3].pts + "</div>";
                        html += "</div>";
                    }
                    /* html += '<div class="halfAway">';
                    html += '<div>Away</div>';
                    html += '<div>'+league_data[4].P+'</div>';
                    html += '<div>'+league_data[4].W+'</div>';
                    html += '<div>'+league_data[4].D+'</div>';
                    html += '<div>'+league_data[4].L+'</div>';
                    html += '<div>'+league_data[4].Get+'</div>';
                    html += '<div>'+league_data[4].Miss+'</div>';
                    html += '<div>'+league_data[4].Net+'</div>';
                    html += '<div>'+(league_data[4].W/league_data[4].P)*100+'%</div>';
                    html += '<div>'+(league_data[4].D/league_data[4].P)*100+'%</div>';
                    html += '<div>'+(league_data[4].L/league_data[4].P)*100+'%</div>';
                    html += '<div>'+league_data[4].average_get+'</div>';
                    html += '<div>'+league_data[4].average_miss+'</div>';
                    html += '<div>'+league_data[4].pts+'</div>';
                    html += '</div>'; */
                    html += "</div></section>";
                }
                $("#team_info").append(html);

                var select_class = $("#menu_nav").find(".selected").prop("class");
                console.log(select_class);
                if (select_class == "league selected") {
                    $DOCUMENT.find("#leagueStatsFull").removeClass("nonDisplay");
                    $DOCUMENT.find("#leagueStatsHalf").removeClass("nonDisplay");
                }
            },
            soccer_team_cupstats_content_html: function (cup_data, cup_info_data) {
                var html = "",
                    data = cup_data,
                    title = cup_info_data,
                    id_arr = ["Handi", "Half_handi", "Ou", "Half_ou"],
                    title_arr = ["Handicap Odds", " Half-Match Handicap Odds", "Over/Under Odds", "Half-Match Over/Under Odds"],
                    sub_arr = ["", "Games", "Give handicap", "Void", "Accept handicap", "Win", "Void", "Loss", "Net", "Win%", "Void%", "Loss%", "Rank"],
                    sub_arr2 = ["", "Games", "Over", "Void", "Under", "Over%", "Void%", "Under%", "Rank"],
                    middle_key_arr = [
                        "totalPanlu",
                        "homePanlu",
                        "guestPanlu",
                        "totalHalfPanlu",
                        "homeHalfPanlu",
                        "guestHalfPanlu",
                        "totalBs",
                        "homeBs",
                        "guestBs",
                        "totalBsHalf",
                        "homeBsHalf",
                        "guestBsHalf",
                    ],
                    data_index_arr = ["games", "give_handicap", "void1", "accept_handicap", "win", "void2", "loss", "net", "win_per", "void_per", "loss_per", "rank"],
                    data_index_arr2 = ["games", "over", "void", "under", "over_per", "void_per", "under_per", "rank"],
                    side_title_arr = ["Total", "Home", "Away"],
                    data_length = Object.keys(data).length,
                    key = [];
                /* console.log(data);
                console.log(title);
                console.log(!data.length);
                console.log(data.length);
                console.log(!data_length);
                console.log(Object.keys(data));
                console.log(!Object.keys(data));
                console.log(Object.keys(data[Object.keys(data)[0]]));
                console.log(!Object.keys(data[Object.keys(data)[0]]));
                console.log(!Object.keys(data[Object.keys(data)[0]]).length);
                console.log(key);
                console.log(!key.length); */
                if (!data_length == true) {
                    html += '<section id="cup_nodata" class="nonDisplay">';
                    html += "<div><span>No Data</span></div>";
                    html += "</section>";
                } else {
                    for (var i = 0; i < data_length; i++) {
                        console.log(Object.keys(data)[i]);
                        key.push(Object.keys(data)[i]);
                    }
                    var str = "";
                    for (var k = 0; k < title.length; k++) {
                        str += '<option value="' + title[k].league_idx + '">' + key[k] + "</option>";
                    }
                    $("#cup_league_select").append(str);

                    html += '<section id="cupStats' + id_arr[0] + '" class="nonDisplay">';
                    html += '<div class="fullTitle">';
                    html += "<div>" + title[0].date + "<span>" + key[0] + "</span> " + title_arr[0] + "</div>";
                    html += "</div>";
                    html += '<div class="subTitle">';
                    for (var i = 0; i < sub_arr.length; i++) {
                        html += "<div><span>" + sub_arr[i] + "</span></div>";
                    }
                    html += "</div>";
                    html += '<div class="cupStatsContent">';

                    // console.log(!data[Object.keys(data)[0]].length);
                    // console.log(data[Object.keys(data)[0]].length);
                    // console.log(data[Object.keys(data)[0]]);
                    // console.log(data[Object.keys(data)[0]][middle_key_arr[0]]);
                    // console.log(data[Object.keys(data)[0]][middle_key_arr[0]].length);
                    // console.log(Object.keys(data[Object.keys(data)[0]][middle_key_arr[0]]).length);
                    // console.log(!Object.keys(data[Object.keys(data)[0]][middle_key_arr[0]]).length);
                    //var data_empty_check = !Object.keys(data[Object.keys(data)[0]][middle_key_arr[0]]).length;
                    var data_empty_check = !Object.keys(data[Object.keys(data)[0]]).length;
                    if (data_empty_check == false) {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < data_index_arr.length; n++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[0]];
                            if (n > 7 && n < 11) {
                                html += "<div><span>" + middle_data[data_index_arr[n]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr[n]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < data_index_arr.length; a++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[1]];
                            if (a > 7 && a < 11) {
                                html += "<div><span>" + middle_data[data_index_arr[a]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr[a]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < data_index_arr.length; s++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[2]];
                            if (s > 7 && s < 11) {
                                html += "<div><span>" + middle_data[data_index_arr[s]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr[s]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                    } else {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < sub_arr.length - 1; n++) {
                            if (n > 7 && n < 11) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < sub_arr.length - 1; a++) {
                            if (a > 7 && a < 11) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < sub_arr.length - 1; s++) {
                            if (s > 7 && s < 11) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                    }
                    html += "</div>";
                    html += "</section>";
                    html += '<section id="cupStats' + id_arr[1] + '" class="nonDisplay">';
                    html += '<div class="fullTitle">';
                    html += "<div>" + title[0].date + "<span>" + key[0] + "</span> " + title_arr[1] + "</div>";
                    html += "</div>";
                    html += '<div class="subTitle">';
                    for (var i = 0; i < sub_arr.length; i++) {
                        html += "<div><span>" + sub_arr[i] + "</span></div>";
                    }
                    html += "</div>";
                    html += '<div class="cupStatsContent">';

                    if (data_empty_check == false) {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < data_index_arr.length; n++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[3]];
                            if (n > 7 && n < 11) {
                                html += "<div><span>" + middle_data[data_index_arr[n]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr[n]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < data_index_arr.length; a++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[4]];
                            if (a > 7 && a < 11) {
                                html += "<div><span>" + middle_data[data_index_arr[a]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr[a]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < data_index_arr.length; s++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[5]];
                            if (s > 7 && s < 11) {
                                html += "<div><span>" + middle_data[data_index_arr[s]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr[s]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                    } else {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < sub_arr.length - 1; n++) {
                            if (n > 7 && n < 11) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < sub_arr.length - 1; a++) {
                            if (a > 7 && a < 11) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < sub_arr.length - 1; s++) {
                            if (s > 7 && s < 11) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                    }
                    html += "</div>";
                    html += "</section>";
                    html += '<section id="cupStats' + id_arr[2] + '" class="nonDisplay">';
                    html += '<div class="fullTitle">';
                    html += "<div>" + title[0].date + "<span>" + key[0] + "</span> " + title_arr[2] + "</div>";
                    html += "</div>";
                    html += '<div class="subTitle">';
                    for (var i = 0; i < sub_arr2.length; i++) {
                        html += "<div><span>" + sub_arr2[i] + "</span></div>";
                    }
                    html += "</div>";
                    html += '<div class="cupStatsContent">';

                    if (data_empty_check == false) {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < data_index_arr2.length; n++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[6]];
                            if (n > 3 && n < 7) {
                                html += "<div><span>" + middle_data[data_index_arr2[n]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr2[n]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < data_index_arr2.length; a++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[7]];
                            if (a > 3 && a < 7) {
                                html += "<div><span>" + middle_data[data_index_arr2[a]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr2[a]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < data_index_arr2.length; s++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[8]];
                            if (s > 3 && s < 7) {
                                html += "<div><span>" + middle_data[data_index_arr2[s]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr2[s]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                    } else {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < sub_arr2.length - 1; n++) {
                            if (n > 3 && n < 7) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < sub_arr2.length - 1; a++) {
                            if (a > 3 && a < 7) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < sub_arr2.length - 1; s++) {
                            if (s > 3 && s < 7) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                    }
                    html += "</div>";
                    html += "</section>";
                    html += '<section id="cupStats' + id_arr[3] + '" class="nonDisplay">';
                    html += '<div class="fullTitle">';
                    html += "<div>" + title[0].date + "<span>" + key[0] + "</span> " + title_arr[3] + "</div>";
                    html += "</div>";
                    html += '<div class="subTitle">';
                    for (var i = 0; i < sub_arr2.length; i++) {
                        html += "<div><span>" + sub_arr2[i] + "</span></div>";
                    }
                    html += "</div>";
                    html += '<div class="cupStatsContent">';

                    if (data_empty_check == false) {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < data_index_arr2.length; n++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[9]];
                            if (n > 3 && n < 7) {
                                html += "<div><span>" + middle_data[data_index_arr2[n]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr2[n]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < data_index_arr2.length; a++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[10]];
                            if (a > 3 && a < 7) {
                                html += "<div><span>" + middle_data[data_index_arr2[a]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr2[a]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < data_index_arr2.length; s++) {
                            var first_data = data[Object.keys(data)[0]],
                                middle_data = first_data[middle_key_arr[11]];
                            if (s > 3 && s < 7) {
                                html += "<div><span>" + middle_data[data_index_arr2[s]] + "%</span></div>";
                            } else {
                                html += "<div><span>" + middle_data[data_index_arr2[s]] + "</span></div>";
                            }
                        }
                        html += "</div>";
                    } else {
                        html += "<div>";
                        html += "<div>Total</div>";
                        for (var n = 0; n < sub_arr2.length - 1; n++) {
                            if (n > 3 && n < 7) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Home</div>";
                        for (var a = 0; a < sub_arr2.length - 1; a++) {
                            if (a > 3 && a < 7) {
                                html += "<div><span>%</span></div>";
                            } else {
                                html += "<div><span></span></div>";
                            }
                        }
                        html += "</div>";
                        html += "<div>";
                        html += "<div>Away</div>";
                        for (var s = 0; s < sub_arr2.length - 1; s++) {
                            if (s > 3 && s < 7) {
                                html += "<div><span>0%</span></div>";
                            } else {
                                html += "<div><span>0</span></div>";
                            }
                        }
                        html += "</div>";
                    }
                    html += "</div>";
                    html += "</section>";
                }
                $("#team_info").append(html);

                var select_class = $("#menu_nav").find(".selected").prop("class");
                console.log(select_class);
                if (select_class == "cup selected") {
                    $DOCUMENT.find("#cupStatsHandi").removeClass("nonDisplay");
                    $DOCUMENT.find("#cupStatsHalf_handi").removeClass("nonDisplay");
                    $DOCUMENT.find("#cupStatsOu").removeClass("nonDisplay");
                    $DOCUMENT.find("#cupStatsHalf_ou").removeClass("nonDisplay");
                }
            },
            soccer_cup_click_event: function ($this, _team_total_json) {
                var data = _team_total_json.cup_stats,
                    select_val = $this.find("option:selected").text(),
                    select_data = data[select_val],
                    key = [],
                    i_num1 = "",
                    i_num2 = "",
                    data_length = Object.keys(data).length,
                    id_arr1 = ["cupStatsHandi", "cupStatsHalf_handi"],
                    id_arr2 = ["cupStatsOu", "cupStatsHalf_ou"],
                    data_index_arr = ["games", "give_handicap", "void1", "accept_handicap", "win", "void2", "loss", "net", "win_per", "void_per", "loss_per", "rank"],
                    data_index_arr2 = ["games", "over", "void", "under", "over_per", "void_per", "under_per", "rank"],
                    middle_key_arr = [
                        "totalPanlu",
                        "homePanlu",
                        "guestPanlu",
                        "totalHalfPanlu",
                        "homeHalfPanlu",
                        "guestHalfPanlu",
                        "totalBs",
                        "homeBs",
                        "guestBs",
                        "totalBsHalf",
                        "homeBsHalf",
                        "guestBsHalf",
                    ],
                    select_data_length = Object.keys(select_data).length;

                for (var i = 0; i < data_length; i++) {
                    console.log(Object.keys(data)[i]);
                    key.push(Object.keys(data)[i]);
                }
                $this.find("option:selected").prop("selected", true);
                $this.find("option:selected").siblings().prop("selected", false);
                console.log(key);
                console.log(_team_total_json);
                console.log(select_val);
                console.log(select_data);
                for (var s = 0; s < id_arr1.length; s++) {
                    if (s == 0) {
                        i_num1 = 0;
                        i_num2 = 3;
                    } else {
                        i_num1 = 3;
                        i_num2 = 6;
                    }
                    var r = 0;
                    console.log(Object.keys(select_data));
                    console.log(Object.keys(select_data).length);
                    console.log(!select_data.length);
                    console.log(!select_data.length);
                    if (!select_data_length == false) {
                        for (var i = i_num1; i < i_num2; i++) {
                            for (var n = 0; n < middle_key_arr.length; n++) {
                                var for_data = select_data[middle_key_arr[i]];
                                $("#" + id_arr1[s] + " > div.fullTitle > div > span").text(select_val);
                                if (n > 7 && n < 11) {
                                    $("#" + id_arr1[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ") > span").text(
                                        for_data[data_index_arr[n]] + "%"
                                    );
                                } else {
                                    $("#" + id_arr1[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ")> span").text(
                                        for_data[data_index_arr[n]]
                                    );
                                }
                            }
                            r++;
                        }
                    } else {
                        for (var i = i_num1; i < i_num2; i++) {
                            for (var n = 0; n < middle_key_arr.length; n++) {
                                $("#" + id_arr1[s] + " > div.fullTitle > div > span").text(select_val);
                                if (n > 7 && n < 11) {
                                    $("#" + id_arr1[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ") > span").text("0%");
                                } else {
                                    $("#" + id_arr1[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ")> span").text("0");
                                }
                            }
                            r++;
                        }
                    }
                }
                for (var s = 0; s < id_arr2.length; s++) {
                    if (s == 0) {
                        i_num1 = 6;
                        i_num2 = 9;
                    } else {
                        i_num1 = 9;
                        i_num2 = 12;
                    }
                    var r = 0;
                    if (!select_data_length == false) {
                        for (var i = i_num1; i < i_num2; i++) {
                            for (var n = 0; n < data_index_arr2.length; n++) {
                                var for_data = select_data[middle_key_arr[i]];
                                $("#" + id_arr2[s] + " > div.fullTitle > div > span").text(select_val);
                                if (n > 3 && n < 7) {
                                    $("#" + id_arr2[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ") > span").text(
                                        for_data[data_index_arr2[n]] + "%"
                                    );
                                } else {
                                    $("#" + id_arr2[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ")> span").text(
                                        for_data[data_index_arr2[n]]
                                    );
                                }
                            }
                            r++;
                        }
                    } else {
                        for (var i = i_num1; i < i_num2; i++) {
                            for (var n = 0; n < data_index_arr2.length; n++) {
                                $("#" + id_arr2[s] + " > div.fullTitle > div > span").text(select_val);
                                if (n > 3 && n < 7) {
                                    $("#" + id_arr2[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ") > span").text("0%");
                                } else {
                                    $("#" + id_arr2[s] + " > div.cupStatsContent > div:nth-child(" + (r + 1) + ") > div:nth-child(" + (n + 2) + ")> span").text("0");
                                }
                            }
                            r++;
                        }
                    }
                }
            },
            soccer_team_achievements_content_html: function (ach_data) {
                console.log(ach_data);
                var html = "",
                    data = ach_data,
                    data_length = data.length,
                    sub_arr = ["", "Play", "Win", "Draw", "Loss", "Get", "Miss", "GD", "Win%", "Draw%", "Loss%", "Avg Get", "Avg Miss", "Points"];

                if (data == "") {
                    html += '<section id="ach_nodata" class="nonDisplay">';
                    html += "<div><span>No Data</span></div>";
                    html += "</section>";
                } else {
                    html += '<section id="achievements" class="nonDisplay">';
                    for (var i = 0; i < data_length; i++) {
                        var content_data = data[i].data,
                            content_data_length = Object.keys(content_data).length;
                        console.log(content_data);
                        html += '<div class="list_' + i + '" class="">';
                        html += '<div class="fullTitle">';
                        html += "<div>" + data[i].title + "</div>";
                        html += "</div>";
                        html += '<div class="subTitle">';
                        for (var n = 0; n < sub_arr.length; n++) {
                            html += "<div><span>" + sub_arr[n] + "</span></div>";
                        }
                        html += "</div>";
                        html += '<div class="achContent">';
                        console.log(content_data_length);
                        for (var s = 0; s < content_data_length; s++) {
                            var list_data = content_data[Object.keys(content_data)[s]];
                            console.log(list_data);
                            html += "<div>";
                            for (var g = 0; g < list_data.length; g++) {
                                //if (g > 7 && g < 12) {
                                //    html += '<div><span>' + list_data[g] + '</span>%</div>';
                                //} else {
                                html += "<div><span>" + list_data[g] + "</span></div>"; //계산해서 넣기
                                //}
                            }
                            html += "</div>";
                        }
                        html += "</div>";
                        html += "</div>";
                    }
                    html += "</section>";
                }
                $("#team_info").append(html);
            },
            soccer_team_schedule_content_html: function (sch_data) {
                var html = "",
                    data = sch_data,
                    sub_arr = ["League", "Date", "Home", "Score", "Away", "Half", "Data"];
                console.log(data);
                if (data == "") {
                    html += '<section id="sch_nodata" class="nonDisplay">';
                    html += "<div><span>No Data</span></div>";
                    html += "</section>";
                } else {
                    html += '<section id="schedule" class="nonDisplay">';
                    html += '<div class="fullTitle">';
                    html += "<div><span>Team Matches</span></div>";
                    html += "</div>";
                    html += '<div class="subTitle">';
                    for (var i = 0; i < sub_arr.length; i++) {
                        html += "<div><span>" + sub_arr[i] + "</span></div>";
                    }
                    html += "</div>";
                    html += '<div class="schContent">';
                    for (var n = 0; n < data.length; n++) {
                        html += '<div class="' + data[n].game_idx + '">';
                        html += '<div class="' + data[n].league_idx + '" style="background-color:' + data[n].color + '">';
                        html += "<span>" + data[n].league_short + "</span></div>";
                        html += "<div><span>" + data[n].date + "</span></div>";
                        html += '<div class="' + data[n].home_team_idx + '">';
                        if (data[n].home_red == 0) {
                            html += '<span><a href="https://spoto.com/livescore/soccer/team/' + data[n].home_team_idx + '">' + data[n].home_name + "</a></span></div>";
                        } else {
                            html += '<span class="hp">' + data[n].home_red + "</span>";
                            html += '<span><a href="https://spoto.com/livescore/soccer/team/' + data[n].home_team_idx + '">' + data[n].home_name + "</a></span></div>";
                        }
                        html += "<div><span>" + data[n].score + "</span></div>";
                        html += '<div class="' + data[n].away_team_idx + '">';
                        if (data[n].away_red == 0) {
                            html += '<span><a href="https://spoto.com/livescore/soccer/team/' + data[n].away_team_idx + '">' + data[n].away_name + "</a></span></div>";
                        } else {
                            html += '<span><a href="https://spoto.com/livescore/soccer/team/' + data[n].away_team_idx + '">' + data[n].away_name + "</a></span>";
                            html += '<span class="hp">' + data[n].away_red + "</span></div>";
                        }
                        html += "<div><span>" + data[n].half_score + "</span></div>";
                        html += '<div><span class="' + data[n].game_idx + '"><img src="http://www.nowgoal.com/images/t2.gif"></span></div>';
                        html += "</div>";
                    }
                    html += "</div>";
                    html += "</section>";
                }
                $("#team_info").append(html);
            },
            soccer_team_lineup_content_html: function (line_data) {
                var html = "",
                    data = line_data,
                    sub_arr = ["Num", "Name", "Birthday", "Height", "Weight", "Position", "Country", "Estimated Value", "Contract Expires", "Start/Goals", "Sub/Goals", "Assit"];

                if (data == "") {
                    html += '<section id="line_nodata" class="nonDisplay">';
                    html += "<div><span>No Data</span></div>";
                    html += "</section>";
                } else {
                    html += '<section id="lineup" class="nonDisplay">';
                    html += '<div class="subTitle">';
                    for (var i = 0; i < sub_arr.length; i++) {
                        html += "<div><span>" + sub_arr[i] + "</span></div>";
                    }
                    html += "</div>";
                    html += '<div class="lineContent">';
                    for (var n = 0; n < data.length; n++) {
                        html += '<div class="' + data[n].player_idx + '">';
                        html += "<div><span>" + data[n].player_num + "</span></div>";
                        html += "<div><span>" + data[n].name + "</span></div>";
                        html += "<div><span>" + data[n].birth + "</span></div>";
                        html += "<div><span>" + data[n].height + "</span></div>";
                        if (data[n].weight == "") {
                            html += "<div><span>-</span></div>";
                        } else {
                            html += "<div><span>" + data[n].weight + "</span></div>";
                        }
                        html += "<div><span>" + data[n].position + "</span></div>";
                        html += "<div><span>" + data[n].country + "</span></div>";
                        if (data[n].estimated == 0 || data[n].estimated == "") {
                            html += "<div><span>£-</span></div>";
                        } else {
                            html += "<div><span>£" + data[n].estimated / 100 + "Million</span></div>";
                        }
                        if (data[n].contract_expires == 0 || data[n].contract_expires == "") {
                            html += "<div><span>-</span></div>";
                        } else {
                            html += "<div><span>" + data[n].contract_expires + "</span></div>";
                        }
                        if (data[n].startgoal1 == 0 && data[n].startgoal2 == 0) {
                            html += "<div><span>-</span></div>";
                        } else {
                            html += "<div><span>" + data[n].startgoal1 + "/" + data[n].startgoal2 + "</span></div>";
                        }
                        if (data[n].subgoal1 == 0 && data[n].subgoal2 == 0) {
                            html += "<div><span>-</span></div>";
                        } else {
                            html += "<div><span>" + data[n].subgoal1 + "/" + data[n].subgoal2 + "</span></div>";
                        }
                        if (data[n].assit == 0) {
                            html += "<div><span>-</span></div>";
                        } else {
                            html += "<div><span>" + data[n].assit + "</span></div>";
                        }
                        html += "</div>";
                    }
                    html += "</div>";
                    html += "</section>";
                }
                $("#team_info").append(html);
                var select_class = $("#menu_nav").find(".selected").prop("class");
                console.log(select_class);
                if (select_class == "line_up selected") {
                    $DOCUMENT.find("#lineup").removeClass("nonDisplay");
                }
            },
            soccer_team_player_content_html: function (player_data) {
                var html = "",
                    data = player_data,
                    sub_arr = ["Rank", "Player", "Country", "Goals", "Goals/Win", "Goals/Draw", "Goals/Loss", "Yellow Card", "Red Card"],
                    first_league = Object.keys(data)[0],
                    data_length = Object.keys(data).length;
                console.log(_team_json);
                console.log(_team_total_json);
                console.log(data);
                if (!data_length == true) {
                    html += '<section id="player_nodata" class="nonDisplay">';
                    html += "<div><span>No Data</span></div>";
                    html += "</section>";
                } else {
                    html += '<section id="player" class="nonDisplay">';
                    html += '<div class="subTitle">';
                    for (var i = 0; i < sub_arr.length; i++) {
                        html += "<div><span>" + sub_arr[i] + "</span></div>";
                    }
                    html += "</div>";
                    html += '<div class="playerContent">';
                    console.log(data[first_league]);
                    for (var n = 0; n < data[first_league].length; n++) {
                        var fist_data = data[first_league][n];
                        console.log(data[first_league]);
                        console.log(first_league);
                        html += '<div class="' + fist_data.player.player_idx + '">';
                        html += "<div><span>" + fist_data.rank + "</span></div>";
                        html += "<div><span>" + fist_data.player.name + "</span></div>";
                        html += "<div><span>" + fist_data.country + "</span></div>";
                        html += "<div><span>" + fist_data.goals + "</span></div>";
                        html += "<div><span>" + fist_data.goalwin + "</span></div>";
                        html += "<div><span>" + fist_data.goaldraw + "</span></div>";
                        html += "<div><span>" + fist_data.goalloss + "</span></div>";
                        html += "<div><span>" + fist_data.yellow_card + "</span></div>";
                        html += "<div><span>" + fist_data.red_card + "</span></div>";
                        html += "</div>";
                    }
                    html += "</div>";
                    html += "</section>";
                }
                $("#team_info").append(html);
            },
            soccer_player_select_change_event: function ($this, _team_total_json) {
                var html = "",
                    data = _team_total_json.player_data,
                    select_val = $this.find("option:selected").text(),
                    select_data = data[select_val],
                    ape_adr = $("#player .playerContent");

                console.log(select_val);
                console.log(select_data);
                ape_adr.children().remove();
                for (var i = 0; i < select_data.length; i++) {
                    var player = select_data[i].player,
                        choice = select_data[i];

                    html += '<div class="' + player.player_idx + '">';
                    html += "<div><span>" + choice.rank + "</span></div>";
                    html += "<div><span>" + player.name + "</span></div>";
                    html += "<div><span>" + choice.country + "</span></div>";
                    html += "<div><span>" + choice.goals + "</span></div>";
                    html += "<div><span>" + choice.goalwin + "</span></div>";
                    html += "<div><span>" + choice.goaldraw + "</span></div>";
                    html += "<div><span>" + choice.goalloss + "</span></div>";
                    html += "<div><span>" + choice.yellow_card + "</span></div>";
                    html += "<div><span>" + choice.red_card + "</span></div>";
                    html += "</div>";
                }
                ape_adr.append(html);
            },
            soccer_transfer_html: function (season, transfer) {
                var html = "",
                    str = "",
                    s_data = season,
                    in_data = transfer[Object.keys(transfer)[0]],
                    out_data = transfer[Object.keys(transfer)[1]],
                    class_arr = ["join", "out"],
                    title_arr = ["Join In", "Departure"],
                    j_sub_arr = ["Time", "Player", "Position", "From", "Type"],
                    o_sub_arr = ["Transfer Time", "Player", "Position", "To", "Type"],
                    select_class = $("#menu_nav").find(".selected").prop("class");

                console.log(transfer);
                console.log(s_data);
                console.log(in_data);
                console.log(out_data);
                console.log(select_class);
                if (season != null && transfer != null) {
                    if (select_class != "transfer selected") {
                        str += '<select id="trans" class="nonDisplay">';
                    } else {
                        str += '<select id="trans" class="">';
                    }
                    for (var i = 0; i < s_data.length; i++) {
                        if (i == 0) {
                            str += '<option value="' + s_data[i] + '" selected="selected">' + s_data[i] + "</option>";
                        } else {
                            str += '<option value="' + s_data[i] + '">' + s_data[i] + "</option>";
                        }
                    }
                    str += "</select>";
                    $("#menu_nav").append(str);

                    if (transfer == "") {
                        html += '<section id="trans_nodata" class="nonDisplay">';
                        html += "<div><span>No Data</span></div>";
                        html += "</section>";
                    } else {
                        if (select_class == "transfer selected") {
                            html += '<section id="transfer" class="">';
                        } else {
                            html += '<section id="transfer" class="nonDisplay">';
                        }
                        for (var n = 0; n < class_arr.length; n++) {
                            var data = "",
                                sub_arr = "";
                            if (n == 0) {
                                data = in_data;
                                sub_arr = j_sub_arr;
                            } else {
                                data = out_data;
                                sub_arr = o_sub_arr;
                            }
                            html += '<div class="' + class_arr[n] + '">';
                            html += '<div class="fullTitle">';
                            html += "<div>" + title_arr[n] + "</div>";
                            html += "</div>";
                            html += '<div class="subTitle">';
                            for (var s = 0; s < sub_arr.length; s++) {
                                html += "<div><span>" + sub_arr[s] + "</span></div>";
                            }
                            html += "</div>";
                            html += '<div class="transContent">';
                            for (var a = 0; a < data.length; a++) {
                                html += "<div>";
                                html += "<div><span>" + data[a].time + "</span></div>";
                                html += '<div class="' + data[a].player_idx + '"><span>' + data[a].player + "</span></div>";
                                html += "<div><span>" + data[a].position + "</span></div>";
                                html += '<div class="' + data[a].team_idx + '"><span>' + data[a].from + "</span></div>";
                                html += "<div><span>" + data[a].type + "</span></div>";
                                html += "</div>";
                            }
                            html += "</div>";
                            html += "</div>";
                        }
                        html += "</section>";
                    }
                    $("#team_info").append(html);
                }
            },
            soccer_transfer_select_click_event: function (transfer) {
                var html = "",
                    data_length = Object.keys(transfer).length,
                    join_content_adr = $("#transfer .join .transContent"),
                    out_content_adr = $("#transfer .out .transContent"),
                    data = "",
                    append_adr = "";

                console.log(transfer);
                console.log(data_length);
                console.log(join_content_adr);
                console.log(data_length);
                join_content_adr.children().remove();
                out_content_adr.children().remove();

                for (var a = 0; a < data_length; a++) {
                    if (a == 0) {
                        data = transfer[Object.keys(transfer)[0]];
                        append_adr = join_content_adr;
                    } else {
                        data = transfer[Object.keys(transfer)[1]];
                        append_adr = out_content_adr;
                    }
                    console.log(data);
                    console.log(append_adr);
                    for (var s = 0; s < data.length; s++) {
                        html += "<div>";
                        html += "<div><span>" + data[s].time + "</span></div>";
                        html += '<div class="' + data[s].player_idx + '"><span>' + data[s].player + "</span></div>";
                        html += "<div><span>" + data[s].position + "</span></div>";
                        html += '<div class="' + data[s].team_idx + '"><span>' + data[s].from + "</span></div>";
                        html += "<div><span>" + data[s].type + "</span></div>";
                        html += "</div>";
                    }
                    append_adr.append(html);
                    html = "";
                }
            },
            soccer_player_content_html: function (_player_json) {
                console.log(_player_json);
                var html = "",
                    data = _player_json.data,
                    player_info_data = data.player_info,
                    base_url = player_info_data.config.img_url,
                    info_data = player_info_data.contents,
                    player_img = base_url + info_data.img_name,
                    player_info_adr = $("#player_info > div.playerTitle > div.player_info > div.info_result"),
                    info_data_key = Object.keys(info_data),
                    current_data = data.currently_play.contents,
                    currently_play_adr = $("#player_info > div.currently > div.currentlyContent"),
                    transfer_data = data.transfer_info.contents,
                    transfer_info_adr = $("#player_info > div.transfer_record > div.recordContent"),
                    recent_data = data.recent_statistics.contents,
                    recent_adr = $("#player_info > div.statistics_two > div.sta_twoContent > .total"),
                    honor_data = data.player_honor.contents,
                    honor_adr = $("#player_info > div.player_honor > div.honorContent"),
                    lineup_data = data.side_lineup.contents,
                    keeper_adr = $("#a_side > div > div.goalkeeper > div.keeper_content"),
                    def_adr = $("#a_side > div > div.defender > div.defender_content"),
                    mid_adr = $("#a_side > div > div.mid > div.mid_content"),
                    str_adr = $("#a_side > div > div.striker > div.striker_content");

                console.log(player_img);
                $("#player_info > div.playerTitle > div.player_img > div > img").attr("src", player_img);
                for (var i = 0; i < info_data_key.length; i++) {
                    var key_value = Object.keys(info_data)[i];
                    player_info_adr.find("div:nth-child(" + (i + 1) + ")").text(info_data[key_value]);
                }
                for (var n = 0; n < current_data.length; n++) {
                    html += '<div class="content_' + (n + 1) + '">';
                    html += "<div>" + current_data[n].team + "</div>";
                    if (current_data[n].uniform_number == "") {
                        html += "<div>-</div>";
                    } else {
                        html += "<div>" + current_data[n].uniform_number + "</div>";
                    }
                    html += "<div>" + current_data[n].position + "</div>";
                    html += "</div>";
                }
                currently_play_adr.append(html);
                html = "";

                if (transfer_data != null) {
                    for (var s = 0; s < transfer_data.length; s++) {
                        var expires = "",
                            type = "",
                            from_team_idx = transfer_data[s].from_team_idx.split("."),
                            to_team_idx = transfer_data[s].to_team_idx.split(".");
                        if (transfer_data[s].contract_expires == "") {
                            expires = "-";
                        } else {
                            expires = transfer_data[s].contract_expires;
                        }
                        if (transfer_data[s].type == 1) {
                            type = "Totally Own";
                        } else if (transfer_data[s].type == 2) {
                            type = "Loan";
                        } else if (transfer_data[s].type == 4) {
                            type = "Loan End";
                        }
                        html += '<div class="content_' + (s + 1) + '">';
                        if (transfer_data[s].transfer_season == "") {
                            html += "<div>-</div>";
                        } else {
                            html += "<div>" + transfer_data[s].transfer_season + "</div>";
                        }
                        if (transfer_data[s].transfer_time == "") {
                            html += "<div>-</div>";
                        } else {
                            html += "<div>" + transfer_data[s].transfer_time + "</div>";
                        }
                        html += "<div>" + expires + "</div>";
                        if (transfer_data[s].from_team_name == "") {
                            html += '<div class="no_data">-</div>';
                        } else {
                            html += '<div class="' + from_team_idx[0] + '">' + transfer_data[s].from_team_name + "</div>";
                        }
                        if (transfer_data[s].to_team_name == "") {
                            html += '<div class="no_data">-</div>';
                        } else {
                            html += '<div class="' + to_team_idx[0] + '">' + transfer_data[s].to_team_name + "</div>";
                        }
                        if (transfer_data[s].transfer_fee == "") {
                            html += "<div>-</div>";
                        } else {
                            html += "<div>" + transfer_data[s].transfer_fee + "</div>";
                        }
                        html += "<div>" + type + "</div>";
                        html += "</div>";
                    }
                    transfer_info_adr.append(html);
                    html = "";
                }

                var goals_adr = $("#player_info > div.statistics_two > div.sta_twoContent > div.total > div:nth-child(2)"),
                    pen_adr = $("#player_info > div.statistics_two > div.sta_twoContent > div.total > div:nth-child(3)"),
                    og_adr = $("#player_info > div.statistics_two > div.sta_twoContent > div.total > div:nth-child(4)"),
                    yellow_adr = $("#player_info > div.statistics_two > div.sta_twoContent > div.total > div:nth-child(5)"),
                    red_Adr = $("#player_info > div.statistics_two > div.sta_twoContent > div.total > div:nth-child(6)");

                if (recent_data == null) {
                    goals_adr.text("0");
                    pen_adr.text("0");
                    og_adr.text("0");
                    yellow_adr.text("0");
                    red_Adr.text("0");
                } else {
                    for (var f = 0; f < recent_data.length; f++) {
                        var home_idx = recent_data[f].home_team_idx.split("."),
                            away_idx = recent_data[f].away_team_idx.split(".");

                        html += '<div class="content_' + (f + 1) + '" data-game_idx="' + recent_data[f].game_idx + '">';
                        html += '<div style="background-color:' + recent_data[f].league_bgcolor + '">' + recent_data[f].league_name + "</div>";
                        html += "<div>" + recent_data[f].game_start_time + "</div>";
                        html += '<div class="' + home_idx[0] + '">' + recent_data[f].home_team_name + "</div>";
                        html += "<div>" + recent_data[f].home_goal + "-" + recent_data[f].away_goal + "</div>";
                        html += '<div class="' + away_idx[0] + '">' + recent_data[f].away_team_name + "</div>";
                        html += "<div>" + recent_data[f].goals + "</div>";
                        html += "<div>" + recent_data[f].pen + "</div>";
                        html += "<div>" + recent_data[f].og + "</div>";
                        html += "<div>" + recent_data[f].yellow + "</div>";
                        html += "<div>" + recent_data[f].red + "</div>";
                        html += "</div>";
                    }
                    recent_adr.before(html);
                    html = "";
                    var content_length = $("#player_info .statistics_two .sta_twoContent").children("div:not(:last-child)").length,
                        content_adr = "#player_info .statistics_two .sta_twoContent",
                        total_goals = 0,
                        total_pen = 0,
                        total_og = 0,
                        total_yellow = 0,
                        total_red = 0;
                    console.log(content_length);
                    for (var d = 0; d < content_length; d++) {
                        total_goals += parseInt($DOCUMENT.find(content_adr).children("div:not(:last-child)").eq(d).children("div:nth-child(6)").text());
                        total_pen += parseInt($DOCUMENT.find(content_adr).children().eq(d).children("div:nth-child(7)").text());
                        total_og += parseInt($DOCUMENT.find(content_adr).children().eq(d).children("div:nth-child(8)").text());
                        total_yellow += parseInt($DOCUMENT.find(content_adr).children().eq(d).children("div:nth-child(9)").text());
                        total_red += parseInt($DOCUMENT.find(content_adr).children().eq(d).children("div:nth-child(10)").text());
                    }
                    goals_adr.text(total_goals);
                    pen_adr.text(total_pen);
                    og_adr.text(total_og);
                    yellow_adr.text(total_yellow);
                    red_Adr.text(total_red);
                }
                if (honor_data != null) {
                    console.log(honor_data);
                    for (var x = 0; x < honor_data.length; x++) {
                        var season_arr = $.isArray(honor_data[x].season),
                            season_length = "";
                        if (season_arr == false) {
                            season_length = 1;
                        } else {
                            season_length = honor_data[x].season.length;
                        }
                        html += '<div class="content_' + (x + 1) + '">';
                        html += "<div><span>" + honor_data[x].league + "</span></div>";
                        html += "<div><span>" + season_length + "</span></div>";
                        html += '<div class="season">';
                        console.log($.isArray(honor_data[x].season));
                        console.log(season_length);
                        console.log(honor_data[x].season.length);
                        for (var c = 0; c < season_length; c++) {
                            if (season_arr == false) {
                                html += "<span>" + honor_data[x].season + "</span>";
                            } else {
                                html += "<span>" + honor_data[x].season[c] + "</span>";
                            }
                        }
                        html += "</div>";
                        html += "</div>";
                    }
                } else {
                    html += '<div class="honor_nodata">';
                    html += "<div>No Data now.</div>";
                    html += "</div>";
                }
                honor_adr.append(html);
                html = "";

                var class_arr = ["keeperList", "defenderList", "midList", "strikerList"],
                    lineup_data_length = Object.keys(lineup_data).length;
                for (let s = 0; s < lineup_data_length; s++) {
                    var key = Object.keys(lineup_data)[s];
                    for (let i = 0; i < lineup_data[key].length; i++) {
                        let player_idx = lineup_data[key][i].idx.split(".");
                        html += '<div class="' + class_arr[s] + "_" + (i + 1) + '">';
                        html += "<div>" + lineup_data[key][i].uniform_number + "</div>";
                        html += '<div class="' + player_idx[0] + '">' + lineup_data[key][i].name + "</div>";
                        html += "</div>";
                    }
                    let adr_arr = [keeper_adr, def_adr, mid_adr, str_adr];
                    adr_arr[s].append(html);
                    html = "";
                }
            },
            soccer_league_side_html: function (_league_side_json) {
                var html = "",
                    data = _league_side_json.data,
                    inter = data.intercontinental,
                    inter_key = Object.keys(inter),
                    inter_adr = $("#db_aside div .search_nav .interContainer"),
                    euro = data.european,
                    euro_key = Object.keys(euro),
                    euro_adr = $("#db_aside div .search_nav .europContainer"),
                    america = data.america,
                    america_key = Object.keys(america),
                    america_adr = $("#db_aside div .search_nav .americaContainer"),
                    asian = data.asian,
                    asian_key = Object.keys(asian),
                    asian_adr = $("#db_aside div .search_nav .asianContainer"),
                    oceania = data.oceania,
                    oceania_key = Object.keys(oceania),
                    oceania_adr = $("#db_aside div .search_nav .oceaniaContainer"),
                    africa = data.africa,
                    africa_key = Object.keys(africa),
                    africa_adr = $("#db_aside div .search_nav .africaContainer"),
                    data_arr = [inter, euro, america, asian, oceania, africa],
                    key_arr = [inter_key, euro_key, america_key, asian_key, oceania_key, africa_key],
                    adr_arr = [inter_adr, euro_adr, america_adr, asian_adr, oceania_adr, africa_adr];

                console.log(data);
                for (var s = 0; s < data_arr.length; s++) {
                    for (var i = 0; i < Object.keys(data_arr[s]).length; i++) {
                        if (s == 1) {
                            html += '<div class="second_nav ' + key_arr[s][i] + '">';
                        } else {
                            html += '<div class="second_nav ' + key_arr[s][i] + ' nonDisplay">';
                        }
                        html += "<span>＋</span><span>" + key_arr[s][i] + "</span>";
                        html += "</div>";
                        if (key_arr[s][i] == "England") {
                            html += '<div class="third_nav ' + key_arr[s][i] + '">';
                        } else {
                            html += '<div class="third_nav ' + key_arr[s][i] + ' nonDisplay">';
                        }
                        html += "<ul>";
                        for (var n = 0; n < data_arr[s][key_arr[s][i]].length; n++) {
                            var l_data = data_arr[s][key_arr[s][i]][n];
                            if (l_data.name == "ENG PR") {
                                html += '<li class="red" data-league_division="' + l_data.division + '" data-league_idx="' + l_data.league_idx + '">' + l_data.name + "</li>";
                            } else {
                                html += '<li data-league_division="' + l_data.division + '" data-league_idx="' + l_data.league_idx + '">' + l_data.name + "</li>";
                            }
                        }
                        html += "</ul>";
                        html += "</div>";
                    }
                    adr_arr[s].append(html);
                    html = "";
                }
            },
            soccer_league_main_schedule_html: function (_league_main_json, season, division) {
                var html = "",
                    data = _league_main_json.data,
                    top_data = data.topTitle.mainTitle,
                    season_select = data.seasonSelect,
                    team_select = data.teamSelect,
                    sche_data = data.schedule,
                    total_data = data.totalScore.total,
                    round_data = data.roundScore.total;

                console.log(data);
                console.log(top_data);
                console.log(season_select);
                console.log(team_select);
                console.log(sche_data);
                console.log(total_data);
                console.log(season);
                if (division != "League") {
                    top_data = data.topTitle.subTitle;
                }

                $("#database header .league_title div:nth-child(1) span:nth-child(1) img").attr("src", top_data.image);
                //$("#database header .league_title div:nth-child(1) span:nth-child(2)").text(top_data.title);

                for (var i = 0; i < season_select.length; i++) {
                    if (season == "") {
                        if (i == 0) {
                            html += '<option value="' + season_select[i] + '" selected="selected">' + season_select[i] + "</option>";
                        } else {
                            html += '<option value="' + season_select[i] + '">' + season_select[i] + "</option>";
                        }
                    } else {
                        if (season == season_select[i]) {
                            html += '<option value="' + season_select[i] + '" selected="selected">' + season_select[i] + "</option>";
                        } else {
                            html += '<option value="' + season_select[i] + '">' + season_select[i] + "</option>";
                        }
                    }
                }
                $("#league_season").append(html);
                html = "";

                var selected_season = $DOCUMENT.find("#league_season").val(),
                    league_season = selected_season + " " + top_data.title;
                console.log(selected_season);
                _season_league_name = league_season;
                $("#database header .league_title div:nth-child(1) span:nth-child(2)").text(league_season);

                for (var i = 0; i < team_select.length; i++) {
                    html += '<option value="' + team_select[i].team_idx + '">' + team_select[i].name + "</option>";
                }
                $("#league_team").append(html);
                html = "";

                console.log(round_data);
                console.log(round_data.length);
                console.log(Object.keys(round_data));
                for (var i = 0; i < Object.keys(round_data).length; i++) {
                    html += '<option value="' + (i + 1) + '">' + (i + 1) + "Round</option>";
                }
                $("#ranking_select").append(html);
                html = "";

                html += '<div class="' + top_data.league_idx + '" style="background-color:' + top_data.color + '; color:#ffffff;">';
                html += "<span>" + top_data.league_short + "</span>";
                html += "<span>No." + top_data.this_round + "</span>";
                html += "</div>";
                html += "<div>";
                for (var i = 0; i < top_data.total_round; i++) {
                    if (top_data.this_round == i + 1) {
                        html += '<div class="roundcolor">' + (i + 1) + "</div>";
                    } else {
                        html += "<div>" + (i + 1) + "</div>";
                    }
                }
                html += "</div>";
                $("#league_schedule .league_round").append(html);
                html = "";

                for (var s = 0; s < sche_data[top_data.this_round - 1].length; s++) {
                    console.log(sche_data[top_data.this_round - 1]);
                    var round_data = sche_data[top_data.this_round - 1],
                        date1 = round_data[s].datetime.split(" "),
                        month = date1[0].substring(5, 10),
                        time = date1[1];
                    console.log(date1);
                    console.log(month);
                    console.log(time);
                    html += '<div class="schedule_' + (s + 1) + " " + round_data[s].league_idx + '">';
                    html += '<div calss="' + round_data[s].game_idx + '"><span>' + top_data.this_round + "</span></div>";
                    html += "<div>";
                    html += "<span>" + month + "</span>";
                    html += "<span>" + time + "</span>";
                    html += "</div>";
                    html += '<div class="' + round_data[s].home_idx + '">';
                    if (round_data[s].hone_red != 0) {
                        html += '<span class="hp">' + round_data[s].hone_red + "</span>";
                    }
                    if (round_data[s].home_ranking == "") {
                        html += "<span></span>";
                    } else {
                        html += "<span>[" + round_data[s].home_ranking + "]</span>";
                    }
                    html += "<span>" + round_data[s].home_name + "</span>";
                    html += "</div>";
                    html += "<div><span>" + round_data[s].home_score + "-" + round_data[s].away_score + "</span></div>";
                    html += '<div class="' + round_data[s].away_idx + '">';
                    html += "<span>" + round_data[s].away_name + "</span>";
                    if (round_data[s].away_ranking == "") {
                        html += "<span></span>";
                    } else {
                        html += "<span>[" + round_data[s].away_ranking + "]</span>";
                    }
                    if (round_data[s].away_red != 0) {
                        html += '<span class="hp">' + round_data[s].away_red + "</span>";
                    }
                    html += "</div>";
                    html += "<div>";
                    html += "<span>-</span>";
                    html += "<span>-</span>";
                    html += "<span>-</span>";
                    html += "</div>";
                    html += "<div>";
                    html += "<span>";
                    html += '<img src="http://www.nowgoal.com/images/t2.gif">';
                    html += "</span>";
                    html += "<span>";
                    html += '<img src="http://info.nowgoal.com/images/t1.gif">';
                    html += "</span>";
                    html += "</div>";
                    html += "<div>";
                    html += "<span>" + round_data[s].ht + "</span>";
                    html += "</div>";
                    html += "</div>";
                }
                $("#league_schedule .league_schedule .scheduleContent").append(html);
                html = "";

                for (var f = 0; f < total_data.length; f++) {
                    html += '<div class="rank_' + (f + 1) + '">';
                    if (total_data[f].division == 2) {
                        html += '<div class="UEFA_CL"><span>' + total_data[f].rank + "</span></div>";
                        html += '<div class="UEFA_CL">';
                    } else if (total_data[f].division == 0) {
                        html += '<div class="UEFA_EL"><span>' + total_data[f].rank + "</span></div>";
                        html += '<div class="UEFA_EL">';
                    } else if (total_data[f].division == 1) {
                        html += '<div class="Degrade"><span>' + total_data[f].rank + "</span></div>";
                        html += '<div class="Degrade">';
                    } else if (total_data[f].division == -1) {
                        html += "<div><span>" + total_data[f].rank + "</span></div>";
                        html += "<div>";
                    }
                    html += '<span class="' + total_data[f].team_idx + '">' + total_data[f].team_name + "</span>";
                    if (total_data[f].red_card != 0) {
                        html += '<span class="hp">' + total_data[f].red_card + "</span>";
                    }
                    html += "</div>";
                    var games = total_data[f].games,
                        win = total_data[f].w,
                        draw = total_data[f].d,
                        lose = total_data[f].l,
                        get = total_data[f].get,
                        miss = total_data[f].miss,
                        gd = get - miss,
                        win_per = _Fn.cal_percent(win, games).toFixed(1),
                        draw_per = _Fn.cal_percent(draw, games).toFixed(1),
                        lose_per = _Fn.cal_percent(lose, games).toFixed(1),
                        get_per = (get / games).toFixed(2),
                        miss_per = (miss / games).toFixed(2),
                        pts = win * 3 + draw;
                    html += "<div><span>" + games + "</span></div>";
                    html += "<div><span>" + win + "</span></div>";
                    html += "<div><span>" + draw + "</span></div>";
                    html += "<div><span>" + lose + "</span></div>";
                    html += "<div><span>" + get + "</span></div>";
                    html += "<div><span>" + miss + "</span></div>";
                    html += "<div><span>" + gd + "</span></div>";
                    html += "<div><span>" + win_per + "%</span></div>";
                    html += "<div><span>" + draw_per + "%</span></div>";
                    html += "<div><span>" + lose_per + "%</span></div>";
                    html += "<div><span>" + get_per + "</span></div>";
                    html += "<div><span>" + miss_per + "</span></div>";
                    html += "<div><span>" + pts + "</span></div>";
                    html += "<div>";
                    var recent_arr = [total_data[f].recent1, total_data[f].recent2, total_data[f].recent3, total_data[f].recent4, total_data[f].recent5, total_data[f].recent6];
                    for (var g = 0; g < recent_arr.length; g++) {
                        if (recent_arr[g] == 0) {
                            html += '<span class="red">W</span>';
                        } else if (recent_arr[g] == 1) {
                            html += '<span class="blue">D</span>';
                        } else if (recent_arr[g] == 2) {
                            html += '<span class="green">L</span>';
                        }
                    }
                    html += "</div>";
                    html += "</div>";
                }
                $("#league_schedule .league_ranking .rankingContent").append(html);
                $("#league_schedule .league_ranking .league_color_info span:nth-child(1)").addClass("UEFA_CL1");
                $("#league_schedule .league_ranking .league_color_info span:nth-child(2)").addClass("UEFA_EL1");
                $("#league_schedule .league_ranking .league_color_info span:nth-child(3)").addClass("Degrade1");
                html = "";

                html += "<div>" + top_data.information + "</div>";
                $("#league_schedule .league_info .infoContent").append(html);
            },
            soccer_league_main_round_click_event_html: function (_league_main_json, select_num) {
                console.log(_league_main_json);
                console.log(_league_main_json.data.schedule);
                var html = "",
                    data = _league_main_json.data.schedule[select_num - 1];

                for (var s = 0; s < data.length; s++) {
                    var round_data = data,
                        date1 = round_data[s].datetime.split(" "),
                        month = date1[0].substring(5, 10),
                        time = date1[1];

                    console.log(date1);
                    console.log(month);
                    console.log(time);
                    html += '<div class="schedule_' + (s + 1) + " " + round_data[s].league_idx + '">';
                    html += '<div calss="' + round_data[s].game_idx + '"><span>' + select_num + "</span></div>";
                    html += "<div>";
                    html += "<span>" + month + "</span>";
                    html += "<span>" + time + "</span>";
                    html += "</div>";
                    html += '<div class="' + round_data[s].home_idx + '">';
                    if (round_data[s].hone_red != 0) {
                        html += '<span class="hp">' + round_data[s].hone_red + "</span>";
                    }
                    if (round_data[s].home_ranking == "") {
                        html += "<span></span>";
                    } else {
                        html += "<span>[" + round_data[s].home_ranking + "]</span>";
                    }
                    html += "<span>" + round_data[s].home_name + "</span>";
                    html += "</div>";
                    html += "<div><span>" + round_data[s].home_score + "-" + round_data[s].away_score + "</span></div>";
                    html += '<div class="' + round_data[s].away_idx + '">';
                    html += "<span>" + round_data[s].away_name + "</span>";
                    if (round_data[s].away_ranking == "") {
                        html += "<span></span>";
                    } else {
                        html += "<span>[" + round_data[s].away_ranking + "]</span>";
                    }
                    if (round_data[s].away_red != 0) {
                        html += '<span class="hp">' + round_data[s].away_red + "</span>";
                    }
                    html += "</div>";
                    html += "<div>";
                    html += "<span>-</span>";
                    html += "<span>-</span>";
                    html += "<span>-</span>";
                    html += "</div>";
                    html += "<div>";
                    html += "<span>";
                    html += '<img src="http://www.nowgoal.com/images/t2.gif">';
                    html += "</span>";
                    html += "<span>";
                    html += '<img src="http://info.nowgoal.com/images/t1.gif">';
                    html += "</span>";
                    html += "</div>";
                    html += "<div>";
                    html += "<span>" + round_data[s].ht + "</span>";
                    html += "</div>";
                    html += "</div>";
                }
                $("#league_schedule .league_schedule .scheduleContent").append(html);
            },
            soccer_league_main_ranking_menu_click_event_html: function (data, select_text) {
                var html = "",
                    total_data = "";

                if (select_text == "total") {
                    total_data = data;
                    $("#league_schedule .league_ranking .subTitle div:nth-child(16)").removeClass("nonDisplay");
                } else {
                    total_data = data[0];
                    console.log($("#league_schedule .league_ranking .subTitle div:nth-child(16)"));
                    $("#league_schedule .league_ranking .subTitle div:nth-child(16)").addClass("nonDisplay");
                }

                for (var f = 0; f < total_data.length; f++) {
                    html += '<div class="rank_' + (f + 1) + '">';
                    if (select_text == "total") {
                        if (total_data[f].division == 2) {
                            html += '<div class="UEFA_CL"><span>' + total_data[f].rank + "</span></div>";
                            html += '<div class="UEFA_CL">';
                        } else if (total_data[f].division == 0) {
                            html += '<div class="UEFA_EL"><span>' + total_data[f].rank + "</span></div>";
                            html += '<div class="UEFA_EL">';
                        } else if (total_data[f].division == 1) {
                            html += '<div class="Degrade"><span>' + total_data[f].rank + "</span></div>";
                            html += '<div class="Degrade">';
                        } else if (total_data[f].division == -1) {
                            html += "<div><span>" + total_data[f].rank + "</span></div>";
                            html += "<div>";
                        }
                        html += '<span class="' + total_data[f].team_idx + '">' + total_data[f].team_name + "</span>";
                        if (total_data[f].red_card != 0) {
                            html += '<span class="hp">' + total_data[f].red_card + "</span>";
                        }
                        html += "</div>";
                    } else {
                        html += "<div><span>" + total_data[f].rank + "</span></div>";
                        html += "<div>";
                        html += '<span class="' + total_data[f].team_idx + '">' + total_data[f].team_name + "</span>";
                        html += "</div>";
                    }
                    var games = total_data[f].games,
                        win = total_data[f].w,
                        draw = total_data[f].d,
                        lose = total_data[f].l,
                        get = total_data[f].get,
                        miss = total_data[f].miss,
                        gd = get - miss,
                        win_per = _Fn.cal_percent(win, games).toFixed(1),
                        draw_per = _Fn.cal_percent(draw, games).toFixed(1),
                        lose_per = _Fn.cal_percent(lose, games).toFixed(1),
                        get_per = (get / games).toFixed(2),
                        miss_per = (miss / games).toFixed(2),
                        pts = win * 3 + draw;
                    html += "<div><span>" + games + "</span></div>";
                    html += "<div><span>" + win + "</span></div>";
                    html += "<div><span>" + draw + "</span></div>";
                    html += "<div><span>" + lose + "</span></div>";
                    html += "<div><span>" + get + "</span></div>";
                    html += "<div><span>" + miss + "</span></div>";
                    html += "<div><span>" + gd + "</span></div>";
                    html += "<div><span>" + win_per + "%</span></div>";
                    html += "<div><span>" + draw_per + "%</span></div>";
                    html += "<div><span>" + lose_per + "%</span></div>";
                    html += "<div><span>" + get_per + "</span></div>";
                    html += "<div><span>" + miss_per + "</span></div>";
                    html += "<div><span>" + pts + "</span></div>";
                    if (select_text == "total") {
                        html += "<div>";
                    } else {
                        html += '<div class="nonDisplay">';
                    }
                    var recent_arr = [total_data[f].recent1, total_data[f].recent2, total_data[f].recent3, total_data[f].recent4, total_data[f].recent5, total_data[f].recent6];
                    for (var g = 0; g < recent_arr.length; g++) {
                        if (recent_arr[g] == 0) {
                            html += '<span class="red">W</span>';
                        } else if (recent_arr[g] == 1) {
                            html += '<span class="blue">D</span>';
                        } else if (recent_arr[g] == 2) {
                            html += '<span class="green">L</span>';
                        }
                    }
                    html += "</div>";
                    html += "</div>";
                }
                $("#league_schedule .league_ranking .rankingContent").append(html);
                if (select_text == "total") {
                    $("#league_schedule .league_ranking .league_color_info span:nth-child(1)").addClass("UEFA_CL1");
                    $("#league_schedule .league_ranking .league_color_info span:nth-child(2)").addClass("UEFA_EL1");
                    $("#league_schedule .league_ranking .league_color_info span:nth-child(3)").addClass("Degrade1");
                    html = "";
                }
            },
            soccer_league_main_ranking_select_change_event_html: function (data, select_val) {
                console.log(data);
                var html = "";

                $("#league_schedule .league_ranking .subTitle div:nth-child(16)").addClass("nonDisplay");

                for (var i = 0; i < Object.keys(data).length; i++) {
                    var select_data = data[Object.keys(data)[i]],
                        games = select_data.game,
                        win = select_data.w,
                        draw = select_data.d,
                        lose = select_data.l,
                        get = select_data.get,
                        miss = select_data.miss,
                        gd = get - miss,
                        win_per = _Fn.cal_percent(win, games).toFixed(1),
                        draw_per = _Fn.cal_percent(draw, games).toFixed(1),
                        lose_per = _Fn.cal_percent(lose, games).toFixed(1),
                        get_per = (get / games).toFixed(2),
                        miss_per = (miss / games).toFixed(2),
                        pts = win * 3 + draw;
                    console.log(select_data);
                    html += '<div class="rank_' + (i + 1) + '">';
                    html += "<div><span>" + (i + 1) + "</span></div>";
                    html += '<div><span class="' + select_data.team_idx + '">' + Object.keys(data)[i] + "</span></div>";
                    html += "<div><span>" + games + "</span></div>";
                    html += "<div><span>" + win + "</span></div>";
                    html += "<div><span>" + draw + "</span></div>";
                    html += "<div><span>" + lose + "</span></div>";
                    html += "<div><span>" + get + "</span></div>";
                    html += "<div><span>" + miss + "</span></div>";
                    html += "<div><span>" + gd + "</span></div>";
                    html += "<div><span>" + win_per + "%</span></div>";
                    html += "<div><span>" + draw_per + "%</span></div>";
                    html += "<div><span>" + lose_per + "%</span></div>";
                    html += "<div><span>" + get_per + "</span></div>";
                    html += "<div><span>" + miss_per + "</span></div>";
                    html += "<div><span>" + pts + "</span></div>";
                    html += "</div>";
                }
                $("#league_schedule .league_ranking .rankingContent").append(html);
            },
            soccer_league_main_techstats_html: function (_league_main_json) {
                var html = "",
                    team_data = _league_main_json.data.teamSelect,
                    tech_total = _league_main_json.data.techStats.total;

                console.log(tech_total);
                for (var i = 0; i < team_data.length; i++) {
                    html += '<option value="' + team_data[i].team_idx + '">' + team_data[i].name + "</option>";
                }
                $("#teamSelect_1").append(html);
                $("#teamSelect_2").append(html);
                html = "";

                var content_length = 0;
                if (tech_total.length < 25) {
                    content_length = tech_total.length;
                } else {
                    content_length = 25;
                }
                for (var s = 0; s < content_length; s++) {
                    var info = tech_total[s].info,
                        data = tech_total[s].data,
                        goal_per = (data.notPenaltyGoals / data.shots) * 100;

                    if (isNaN(goal_per) == true) {
                        goal_per = 0;
                    }
                    html += '<div class="' + info.team_idx + '">';
                    html += "<div><span>" + (s + 1) + "</span></div>";
                    html += '<div class="' + data.PlayerID + '"><span>' + info.name + "</span></div>";
                    html += "<div><span>" + info.team_name + "</span></div>";
                    html += "<div><span>" + data.SchSum + "(" + data.BackSum + ")</span></div>";
                    html += "<div><span>" + data.PlayingTime + "</span></div>";
                    if (data.penaltyGoals == "") {
                        html += "<div><span>" + (data.notPenaltyGoals + data.penaltyGoals) + "</span></div>";
                    } else {
                        html += "<div><span>" + (data.notPenaltyGoals + data.penaltyGoals) + "(" + data.penaltyGoals + ")</span></div>";
                    }
                    html += "<div><span>" + data.goalMinute + "</span></div>";
                    html += "<div><span>" + data.shots + "</span></div>";
                    html += "<div><span>" + data.shotsTarget + "</span></div>";
                    html += "<div><span>" + goal_per.toFixed(1) + "%</span></div>";
                    html += "<div><span>" + data.wasFouled + "</span></div>";
                    html += "<div><span>" + data.offside + "</span></div>";
                    html += "<div><span>" + data.bestSum + "</span></div>";
                    html += "<div><span>" + data.rating + "</span></div>";
                    html += "</div>";
                }
                if (content_length < 25) {
                    html += '<button id="plus_btn" class="nonDisplay">더보기</button>';
                } else {
                    html += '<button id="plus_btn">더보기</button>';
                }
                $("#techStats .techstatsConinater .techContent").append(html);
                html = "";

                /* var sort_json = [];
                for (var i = 0; i < tech_total.length; i++) {
                    $.each(tech_total[i].data.pass, function (index, value) {
                        sort_json.push({
                            key: index,
                            value: value
                        });
                    });
                }
                console.log(sort_json);
                sort_json.sort(function (a, b) {
                    return (a.value < b.value) ? -1 : (a.value > b.value) ? 1 : 0;
                });
                console.log(sort_json); */
                /* var pass_json = _league_main_json.data.techStats.total;
                for (var i = 0; i < pass_json.length; i++) {
                    pass_json.sort(function (a, b) {
                        return (a.data.pass > b.data.pass) ? -1 : (a.data.pass < b.data.pass) ? 1 : 0;
                    })
                }
                console.log(tech_total);
                console.log(pass_json); */
                /* var sort_json = $.grep(tech_total, function (n, i) {
                    console.log(n.data.pass);
                    return n.data.pass > n.data.pass;
                });
                console.log(sort_json); */
            },
            soccer_league_main_techstats_add_btn_click_html: function (num, num2, select_data) {
                var html = "",
                    type_val = $("#typeSelect").find("option:selected").val();
                console.log(select_data);
                console.log(num);
                console.log(num2);
                console.log(select_data[num]);
                console.log(select_data[num].info);
                if (type_val == 0) {
                    for (var s = num; s < num2; s++) {
                        var info = select_data[s].info,
                            data = select_data[s].data,
                            goal_per = (data.notPenaltyGoals / data.shots) * 100;
                        console.log(isNaN(goal_per));
                        if (isNaN(goal_per) == true) {
                            goal_per = 0;
                        }
                        html += '<div class="' + info.team_idx + '">';
                        html += "<div><span>" + (s + 1) + "</span></div>";
                        html += '<div class="' + data.PlayerID + '"><span>' + info.name + "</span></div>";
                        html += "<div><span>" + info.team_name + "</span></div>";
                        html += "<div><span>" + data.SchSum + "(" + data.BackSum + ")</span></div>";
                        html += "<div><span>" + data.PlayingTime + "</span></div>";
                        if (data.penaltyGoals == 0) {
                            html += "<div><span>" + (data.notPenaltyGoals + data.penaltyGoals) + "</span></div>";
                        } else {
                            html += "<div><span>" + (data.notPenaltyGoals + data.penaltyGoals) + "(" + data.penaltyGoals + ")</span></div>";
                        }
                        html += "<div><span>" + data.goalMinute + "</span></div>";
                        html += "<div><span>" + data.shots + "</span></div>";
                        html += "<div><span>" + data.shotsTarget + "</span></div>";
                        html += "<div><span>" + goal_per.toFixed(1) + "%</span></div>";
                        html += "<div><span>" + data.wasFouled + "</span></div>";
                        html += "<div><span>" + data.offside + "</span></div>";
                        html += "<div><span>" + data.bestSum + "</span></div>";
                        html += "<div><span>" + data.rating + "</span></div>";
                        html += "</div>";
                    }
                } else if (type_val == 1) {
                    for (var s = num; s < num2; s++) {
                        var info = select_data[s].info,
                            data = select_data[s].data,
                            pass_per = (data.passSuc / data.pass) * 100,
                            min_assist = data.PlayingTime / data.assist,
                            assist_type = min_assist % 1;

                        if (isNaN(assist_type) == true) {
                            min_assist = 0;
                        }
                        $("#techStats .techstatsConinater .subTitle div:nth-child(6)").text("Passes");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(7)").text("Pass Success");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(8)").text("Key Passes");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(9)").text("Assists");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(10)").text("Min/assist");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(11)").text("Long Passes");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(12)").text("Through");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(13)").text("Break Loose");

                        html += '<div class="' + info.team_idx + '">';
                        html += "<div><span>" + (s + 1) + "</span></div>";
                        html += '<div class="' + data.PlayerID + '"><span>' + info.name + "</span></div>";
                        html += "<div><span>" + info.team_name + "</span></div>";
                        html += "<div><span>" + data.SchSum + "(" + data.BackSum + ")</span></div>";
                        html += "<div><span>" + data.PlayingTime + "</span></div>";
                        html += "<div><span>" + data.pass + "</span></div>";
                        html += "<div><span>" + pass_per.toFixed(1) + "%</span></div>";
                        html += "<div><span>" + data.keyPass + "</span></div>";
                        html += "<div><span>" + data.assist + "</span></div>";
                        console.log(min_assist % 1);
                        console.log(min_assist);
                        if (assist_type == 0 || min_assist == 0) {
                            html += "<div><span>" + min_assist + "</span></div>";
                        } else {
                            html += "<div><span>" + min_assist.toFixed(1) + "</span></div>";
                        }
                        html += "<div><span>" + data.longBalls + "</span></div>";
                        html += "<div><span>" + data.throughBall + "</span></div>";
                        html += "<div><span>" + data.dribblesSuc + "</span></div>";
                        html += "<div><span>" + data.rating + "</span></div>";
                        html += "</div>";
                    }
                } else if (type_val == 2) {
                    for (var s = num; s < num2; s++) {
                        var info = select_data[s].info,
                            data = select_data[s].data,
                            pass_per = (data.passSuc / data.pass) * 100,
                            min_assist = data.PlayingTime / data.assist;
                        $("#techStats .techstatsConinater .subTitle div:nth-child(6)").text("Tackles");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(7)").text("Interceptions");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(8)").text("Clearances");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(9)").text("Steal");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(10)").text("Blocked");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(11)").text("Heads");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(12)").text("Fouls");
                        $("#techStats .techstatsConinater .subTitle div:nth-child(13)").text("Cards");

                        html += '<div class="' + info.team_idx + '">';
                        html += "<div><span>" + (s + 1) + "</span></div>";
                        html += '<div class="' + data.PlayerID + '"><span>' + info.name + "</span></div>";
                        html += "<div><span>" + info.team_name + "</span></div>";
                        if (data.BackSum == 0) {
                            html += "<div><span>" + data.SchSum + "</span></div>";
                        } else {
                            html += "<div><span>" + data.SchSum + "(" + data.BackSum + ")</span></div>";
                        }
                        html += "<div><span>" + data.PlayingTime + "</span></div>";
                        html += "<div><span>" + data.tackle + "</span></div>";
                        html += "<div><span>" + data.interception + "</span></div>";
                        html += "<div><span>" + data.clearance + "</span></div>";
                        html += "<div><span>" + data.dispossessed + "</span></div>";
                        html += "<div><span>" + data.shotsBlocked + "</span></div>";
                        html += "<div><span>" + data.aerialSuc + "</span></div>";
                        html += "<div><span>" + data.foul + "</span></div>";
                        html += "<div><span>" + data.red + "/" + data.yellow + "</span></div>";
                        html += "<div><span>" + data.rating + "</span></div>";
                        html += "</div>";
                    }
                }
                $DOCUMENT.find("#techStats .techstatsConinater .techContent #plus_btn").before(html);
            },
            soccer_league_main_teamprofiles_html: function (_league_main_json) {
                var html = "",
                    profile = _league_main_json.data.teamProfiles;

                for (var i = 0; i < profile.length; i++) {
                    var data = profile[i];
                    html += '<div class="' + data.team_idx + '">';
                    html += '<div class="outer">';
                    html += '<img src="' + data.img + '">';
                    html += "<span>" + data.name + "</span>";
                    html += "</div>";
                    html += "</div>";
                }
                $("#teamProfiles > div").append(html);
            },
            soccer_league_main_firstGoal_html: function (_league_main_json) {
                var html = "",
                    first_goal = _league_main_json.data.firstGoalLose;

                for (var i = 0; i < first_goal.length; i++) {
                    var data = first_goal[i],
                        goal_total = data.goal_home + data.goal_away,
                        lost_total = data.lost_home + data.lost_away;
                    html += '<div class="' + data.team_idx + '">';
                    html += "<div><span>" + data.team_name + "</span></div>";
                    html += "<div><span>" + goal_total + "</span></div>";
                    html += "<div><span>" + data.goal_home + "</span></div>";
                    html += "<div><span>" + data.goal_away + "</span></div>";
                    html += "<div><span>" + lost_total + "</span></div>";
                    html += "<div><span>" + data.lost_home + "</span></div>";
                    html += "<div><span>" + data.lost_away + "</span></div>";
                    html += "</div>";
                }
                $("#firstGaollose .fglContainer .fglContent").append(html);
            },
            soccer_league_main_noGoal_html: function (_league_main_json) {
                var html = "",
                    no_goal = _league_main_json.data.noGoalLose;

                for (var i = 0; i < no_goal.length; i++) {
                    var data = no_goal[i];

                    html += '<div class="' + data.team_idx + '">';
                    html += "<div><span>" + data.team_name + "</span></div>";
                    html += "<div><span>" + data.total_p + "</span></div>";
                    html += "<div><span>" + data.total_s_ft + "</span></div>";
                    html += "<div><span>" + data.total_s_1st + "</span></div>";
                    html += "<div><span>" + data.total_s_2st + "</span></div>";
                    html += "<div><span>" + data.total_l_ft + "</span></div>";
                    html += "<div><span>" + data.total_l_1st + "</span></div>";
                    html += "<div><span>" + data.total_l_2st + "</span></div>";
                    html += "<div><span>" + data.home_p + "</span></div>";
                    html += "<div><span>" + data.home_s_ft + "</span></div>";
                    html += "<div><span>" + data.home_s_1st + "</span></div>";
                    html += "<div><span>" + data.home_s_2st + "</span></div>";
                    html += "<div><span>" + data.home_l_ft + "</span></div>";
                    html += "<div><span>" + data.home_l_1st + "</span></div>";
                    html += "<div><span>" + data.home_l_2st + "</span></div>";
                    html += "<div><span>" + data.away_p + "</span></div>";
                    html += "<div><span>" + data.away_s_ft + "</span></div>";
                    html += "<div><span>" + data.away_s_1st + "</span></div>";
                    html += "<div><span>" + data.away_s_2st + "</span></div>";
                    html += "<div><span>" + data.away_l_ft + "</span></div>";
                    html += "<div><span>" + data.away_l_1st + "</span></div>";
                    html += "<div><span>" + data.away_l_2st + "</span></div>";
                    html += "</div>";
                }
                $("#noGaollose .nglContainer .nglContent").append(html);
            },
            soccer_live_event_html: function (res) {
                var html = "",
                    gradient,
                    data = res,
                    event_name = ["GOAL", 'RED CARD', 'YELLOW CARD'],
                    event_color = ["#3c78c6", '#dc3545', '#ffc107'],
                    event_player = ['득점 선수', '퇴장 선수', '경고 선수'],
                    type_name = ['home', 'away'],
                    event_class = ['goal', 'r_card', 'y_card'],
                    key_num = [1, 2, 3],
                    audio_arr = ["Golf", "test1", "test2", "test3"],
                    sound_check = $("#sound_check").is(":checked"),
                    prompt_check = $('#prompt_check').is(':checked');

                console.log(prompt_check);
                console.log(sound_check);
                if (sound_check == true) {
                    var audio = $("#audio").children().attr("src", "//spoto.com/audio/" + audio_arr[0] + ".mp3");

                    $("#audio")[0].muted = false;
                    $("#audio")[0].load();
                    window.removeEventListener("touchstart", _Fn.sound, true);
                    window.addEventListener("touchstart", _Fn.sound, true);
                    $("#audio")[0].play();
                }

                console.log(data);
                for (var s = 0; s < data.length; s++) {
                    var event_data = data[s].detail,
                        id_node = $("#todayGame"),
                        select_node = id_node.find("div[data-idx=" + data[s].game_idx + "]"),
                        idx = data[s].game_idx,
                        progress = data[s].game_progress,
                        home_goal = data[s].home_goal,
                        away_goal = data[s].away_goal,
                        home_half_goal = data[s].half_home_goal,
                        away_half_goal = data[s].half_away_goal,
                        home_red = data[s].home_red,
                        away_red = data[s].away_red,
                        home_yellow = data[s].home_yellow,
                        away_yellow = data[s].away_yellow,
                        f_start_time = data[s].first_start_time,
                        s_start_time = data[s].second_start_time,
                        home_conner = data[s].home_conner,
                        away_conner = data[s].away_conner,
                        home_team_name = select_node.find("div:nth-child(4) .teamName").text(),
                        away_team_name = select_node.find("div:nth-child(6) .teamName").text();
                    console.log(select_node);

                    var page_goal = select_node.find("div:nth-child(5) span").text(),
                        page_goal_arr = page_goal.split("-"),
                        page_home_goal = page_goal_arr[0],
                        page_away_goal = page_goal_arr[1];
                    var page_half_goal = select_node.find("div:nth-child(7) span").text(),
                        page_half_goal_arr = page_half_goal.split("-"),
                        page_home_half_goal,
                        page_away_half_goal;
                    console.log(page_half_goal_arr);
                    console.log(page_half_goal_arr);
                    console.log(_Fn.isEmpty(page_half_goal_arr));
                    if (page_half_goal_arr == "") {
                        page_home_half_goal = 0;
                        page_away_half_goal = 0;
                    } else {
                        page_home_half_goal = page_half_goal_arr[0];
                        page_away_half_goal = page_half_goal_arr[1];
                    }
                    console.log(page_home_half_goal);
                    console.log(page_away_half_goal);
                    var home_page_red = select_node.find("div:nth-child(4) span.badge.badge-danger").text(),
                        home_page_yellow = select_node.find("div:nth-child(4) span.badge.badge-warning").text(),
                        away_page_red = select_node.find("div:nth-child(6) span.badge.badge-danger").text(),
                        away_page_yellow = select_node.find("div:nth-child(6) span.badge.badge-warning").text();
                    console.log(_Fn.isEmpty(home_page_red));
                    if (_Fn.isEmpty(home_page_red)) {
                        home_page_red = 0;
                    }
                    if (_Fn.isEmpty(home_page_yellow)) {
                        home_page_yellow = 0;
                    }
                    if (_Fn.isEmpty(away_page_red)) {
                        away_page_red = 0;
                    }
                    if (_Fn.isEmpty(away_page_yellow)) {
                        away_page_yellow = 0;
                    }
                    console.log(home_page_red);
                    console.log(home_page_yellow);
                    console.log(away_page_red);
                    console.log(away_page_yellow);
                    //_matchcount = 7;
                    _matchcount = id_node.find("div:not(:first-child)").length;
                    console.log(_matchcount);
                    console.log(s_start_time);
                    console.log(f_start_time);
                    console.log(parseInt(s_start_time));
                    console.log(parseInt(f_start_time));
                    var time1 = moment(f_start_time, 'YYYY-MM-DDTHH:mm:ssZ');
                    var time2 = moment(s_start_time, 'YYYY-MM-DDTHH:mm:ssZ');
                    console.log(time1);
                    console.log(time2);
                    var difftime = moment(time1, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment(time2, 'YYYY-MM-DDTHH:mm:ssZ'));
                    // var difftime = moment(time2, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment(time1, 'YYYY-MM-DDTHH:mm:ssZ'));
                    console.log(difftime);


                    _interval = (function (_matchcount, time1, time2, difftime, progress, idx) {
                        setInterval(function () {
                            console.log("소켓 이벤트 setInterval");
                            _Soccer.soccer_setMatchTime(_matchcount, time1, time2, difftime, progress, idx);
                        }, 30000);
                    })(_matchcount, time1, time2, difftime, progress, idx);


                    console.log(event_data);

                    if (page_home_goal < home_goal) {
                        var team_name = home_team_name;

                        select_node.find("div:nth-child(5) span").text(home_goal + "-" + away_goal);
                        select_node.find("div:nth-child(4)").addClass("animate_gradient1");
                        if (prompt_check == true) {
                            _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[0], event_player[0], event_data, type_name[0], event_class[0], key_num[0]), event_name[0], event_color[0]);
                        }
                    } else if (page_away_goal < away_goal) {
                        var team_name = away_team_name;

                        select_node.find("div:nth-child(5) span").text(home_goal + "-" + away_goal);
                        select_node.find("div:nth-child(6)").addClass("animate_gradient2");
                        if (prompt_check == true) {
                            _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[0], event_player[0], event_data, type_name[1], event_class[0], key_num[0]), event_name[0], event_color[0]);
                        }
                    }

                    if (home_half_goal != "" || away_half_goal != "") {
                        if (page_home_half_goal < home_half_goal) {
                            select_node.find("div:nth-child(7) span").text(home_half_goal + "-" + away_half_goal);
                        } else if (page_away_half_goal < away_half_goal) {
                            select_node.find("div:nth-child(7) span").text(home_half_goal + "-" + away_half_goal);
                        }
                    }

                    if (home_page_red < home_red) {
                        if (home_page_red == 0) {
                            var team_name = home_team_name;


                            select_node.find("div:nth-child(4) span.teamName").before('<span class="badge badge-danger">' + home_red + "</span>");
                            select_node.find("div:nth-child(4)").addClass("animate_gradient1");
                            if (prompt_check == true) {
                                _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[1], event_player[1], event_data, type_name[0], event_class[1], key_num[1]), event_name[1], event_color[1]);
                            }
                        } else {
                            var team_name = home_team_name;

                            select_node.find("div:nth-child(4) span.badge.badge-danger").text(home_red);
                            select_node.find("div:nth-child(4)").addClass("animate_gradient1");
                            if (prompt_check == true) {
                                _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[1], event_player[1], event_data, type_name[0], event_class[1], key_num[1]), event_name[1], event_color[1]);
                            }
                        }
                    }
                    if (away_page_red < away_red) {
                        if (away_page_red == 0) {
                            var team_name = away_team_name;

                            select_node.find("div:nth-child(6) span.teamName").after('<span class="badge badge-danger">' + away_red + "</span>");
                            select_node.find("div:nth-child(6)").addClass("animate_gradient2");
                            if (prompt_check == true) {
                                _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[1], event_player[1], event_data, type_name[1], event_class[1], key_num[1]), event_name[1], event_color[1]);
                            }
                        } else {
                            var team_name = away_team_name;

                            select_node.find("div:nth-child(6) span.badge.badge-danger").text(away_red);
                            select_node.find("div:nth-child(6)").addClass("animate_gradient2");
                            if (prompt_check == true) {
                                _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[1], event_player[1], event_data, type_name[1], event_class[1], key_num[1]), event_name[1], event_color[1]);
                            }
                        }
                    }
                    if (home_page_yellow < home_yellow) {
                        if (home_page_yellow == 0) {
                            var red_length = select_node.find("div:nth-child(4) .badge-danger").length;
                            console.log(red_length);
                            if (red_length == 0) {
                                var team_name = home_team_name;

                                select_node.find("div:nth-child(4) span.teamName").before('<span class="badge badge-warning">' + home_yellow + "</span>");
                                select_node.find("div:nth-child(4)").addClass("animate_gradient1");
                                if (prompt_check == true) {
                                    _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[2], event_player[2], event_data, type_name[0], event_class[2], key_num[2]), event_name[2], event_color[2]);
                                }
                            } else {
                                var team_name = home_team_name;

                                select_node.find("div:nth-child(4) .badge-danger").before('<span class="badge badge-warning">' + home_yellow + "</span>");
                                select_node.find("div:nth-child(4)").addClass("animate_gradient1");
                                if (prompt_check == true) {
                                    _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[2], event_player[2], event_data, type_name[0], event_class[2], key_num[2]), event_name[2], event_color[2]);
                                }
                            }
                        } else {
                            var team_name = home_team_name;

                            select_node.find("div:nth-child(4) span.badge.badge-warning").text(home_yellow);
                            select_node.find("div:nth-child(4)").addClass("animate_gradient1");
                            if (prompt_check == true) {
                                _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[2], event_player[2], event_data, type_name[0], event_class[2], key_num[2]), event_name[2], event_color[2]);
                            }
                        }
                    }
                    if (away_page_yellow < away_yellow) {
                        if (away_page_yellow == 0) {
                            var away_red_length = select_node.find("div:nth-child(6) .badge-danger").length;
                            console.log(away_red_length);
                            if (away_red_length == 0) {
                                var team_name = away_team_name;

                                select_node.find("div:nth-child(6) span.teamName").after('<span class="badge badge-warning">' + away_yellow + "</span>");
                                select_node.find("div:nth-child(6)").addClass("animate_gradient2");
                                if (prompt_check == true) {
                                    _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[2], event_player[2], event_data, type_name[1], event_class[2], key_num[2]), event_name[2], event_color[2]);
                                }
                            } else {
                                var team_name = away_team_name;

                                select_node.find("div:nth-child(6) .badge-danger").after('<span class="badge badge-warning">' + away_yellow + "</span>");
                                select_node.find("div:nth-child(6)").addClass("animate_gradient2");
                                if (prompt_check == true) {
                                    _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[2], event_player[2], event_data, type_name[1], event_class[2], key_num[2]), event_name[2], event_color[2]);
                                }
                            }
                        } else {
                            var team_name = away_team_name;

                            select_node.find("div:nth-child(6) span.badge.badge-warning").text(away_yellow);
                            select_node.find("div:nth-child(6)").addClass("animate_gradient2");
                            if (prompt_check == true) {
                                _Fn.notyf_open(notyf, _Soccer.soccer_notyf_content_html(team_name, event_name[2], event_player[2], event_data, type_name[1], event_class[2], key_num[2]), event_name[2], event_color[2]);
                            }
                        }
                    }
                    (function (select_node) {
                        setTimeout(function () {
                            console.log(select_node);
                            console.log("우와와오아와아아아아아아아아");
                            console.log(select_node.find("div:nth-child(4)"));
                            select_node.find("div:nth-child(4)").removeClass("animate_gradient1");
                            select_node.find("div:nth-child(6)").removeClass("animate_gradient2");
                        }, 4500);
                    })(select_node);
                }
            },
            soccer_setMatchTime: function (_matchcount, f_start, s_start, difftime, progress, idx) {
                for (var i = 1; i <= _matchcount; i++) {
                    try {
                        var select_node = $("#todayGame").find("div[data-idx=" + idx + "]");
                        if (progress == "1") {
                            //part 1	전반 (progress)
                            var today = new Date(),
                                goTime = Math.floor((moment(today, 'YYYY-MM-DDTHH:mm:ssZ') - moment(f_start, 'YYYY-MM-DDTHH:mm:ssZ') - difftime) / 60000);
                            var img_node = '<img src="'+(DOMAIN+LIVESCORE)+'in.gif">';
                            var last = '45+';
                            var start = '1';
                            if (goTime > 45) goTime = last;
                            if (goTime < 1) goTime = start;
                            console.log(goTime);
                            var time_result = goTime + img_node;

                            select_node.children("div:nth-child(3)").empty().append(time_result);
                            select_node.children("div:nth-child(3)").css("color", "#ff5e3a");
                        }
                        if (progress == "-1") {
                            var append_node = "<b>FT</b>";
                            select_node.children("div:nth-child(3)").empty().append(append_node);
                            select_node.children("div:nth-child(3)").css("color", "#ff5e3a");
                            var result_node = $("#todayResult");
                            select_node.append(result_node);
                        }
                        if (progress == "2") {
                            var append_node = "<b>HT</b>";
                            select_node.children("div:nth-child(3)").empty().append(append_node);
                            select_node.children("div:nth-child(3)").css("color", "#222222");
                        }
                        if (progress == "3") {
                            //part 2		후반 (progress)
                            var today = new Date();
                            console.log(moment(today, 'YYYY-MM-DDTHH:mm:ssZ'));
                            console.log(moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ'));
                            console.log(Math.floor(moment(today, 'YYYY-MM-DDTHH:mm:ssZ') - moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ')));
                            console.log(difftime);
                            console.log(Math.floor((moment(today, 'YYYY-MM-DDTHH:mm:ssZ') - moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ') - difftime) / 60000));
                            console.log(Math.floor((moment(today, 'YYYY-MM-DDTHH:mm:ssZ') - moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ') - difftime) / 60000) + 46);
                            console.log(Math.floor((moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ') - moment(today, 'YYYY-MM-DDTHH:mm:ssZ') - difftime) / 60000) + 46)

                            var goTime = Math.floor((moment(today, 'YYYY-MM-DDTHH:mm:ssZ') - moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ') - difftime) / 60000) + 46-65;
                            // var goTime = Math.floor((moment(today, 'YYYY-MM-DDTHH:mm:ssZ') - moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ') - difftime) / 60000) + 46;
                            var img_node = '<img src="'+(DOMAIN+LIVESCORE)+'in.gif">';
                            var last = "90+";
                            var start = "46";
                            console.log(goTime);
                            console.log(moment(today, 'YYYY-MM-DDTHH:mm:ssZ'));
                            console.log(moment(s_start, 'YYYY-MM-DDTHH:mm:ssZ'));
                            console.log(difftime);
                            if (goTime > 90) goTime = last;
                            if (goTime < 46) goTime = start;
                            var time_result = goTime + img_node;
                            console.log(time_result);

                            select_node.children("div:nth-child(3)").empty().append(time_result);
                            select_node.children("div:nth-child(3)").css("color", "#ff5e3a");
                        }
                        if (progress == "-14") {
                            var append_node = "Postp";
                            select_node.children("div:nth-child(3)").empty().append(append_node);
                            select_node.children("div:nth-child(3)").css("color", "#ff5e3a");
                            var result_node = $("#todayResult");
                            select_node.append(result_node);
                        }
                    } catch (e) {
                        console.log(e.message);
                    }
                }
                //runtimeTimer = window.setTimeout(_Soccer.soccer_setMatchTime(), 30000);
            },
            soccer_first_loading_event: function (_soccer_json) {
                var today_json = _soccer_json.today,
                    today = moment().format('YYYY.MM.DD');

                console.log(today_json);
                console.log(today);

                $('#main_nav > div.first_nav > div.select_nav > div.calender > span:nth-child(1)').text(today);
                for (var n = 0; n < today_json.length; n++) {
                    var progress = today_json[n].game_progress,
                        game_idx = today_json[n].idx,
                        start_time = moment(today_json[n].game_start_time, 'YYYY-MM-DDTHH:mm:ssZ'),
                        secon_start_time = moment(today_json[n].second_start_time, 'YYYY-MM-DDTHH:mm:ssZ'),
                        diff = moment(start_time, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment(secon_start_time, 'YYYY-MM-DDTHH:mm:ssZ')),
                        // diff = moment(secon_start_time, 'YYYY-MM-DDTHH:mm:ssZ').diff(moment(start_time, 'YYYY-MM-DDTHH:mm:ssZ')),
                        matchcount = $("#todayGame > div:not(:first-child)").length;

                    console.log(navigator.userAgent.match(/(iPhone|iPod|iPad)/) != null);
                    console.log(start_time);
                    console.log(secon_start_time);
                    console.log(diff);
                    console.log(game_idx);
                    console.log(progress);

                    _interval = (function (matchcount, start_time, secon_start_time, diff, progress, game_idx) {
                        setInterval(function () {
                            console.log("실행중 ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ");
                            _Soccer.soccer_setMatchTime(matchcount, start_time, secon_start_time, diff, progress, game_idx);
                        }, 30000);
                    })(matchcount, start_time, secon_start_time, diff, progress, game_idx);
                }
            },
            soccer_notyf_content_html: function (team_name, event_name, event_player, event_data, type_name, event_class, key_num) {
                var html = '';

                html += '<div style="border-radius: 4px" id="gameDetail">';
                html += "<header>";
                html += '<div>' + team_name + ' ' + event_name + '</div>';
                html += "</header>";
                html += '<section id="detailEvent">';
                html += '<div calss="eventTitle">';
                html += "<div>시간</div>";
                html += '<div style="color: #222222">' + event_player + '</div>';
                html += "</div>";
                html += '<div calss="eventContent">';
                for (var i = 0; i < event_data.length; i++) {
                    console.log(event_data[i])
                    var key = event_data[i].event_key,
                        type = event_data[i].team_type,
                        time = event_data[i].time,
                        name = event_data[i].player_name;
                    if (type == type_name && key == key_num) {
                        html += '<div class="event_h">';
                        html += '<div style="color: #222222">' + time + '</div>';
                        html += '<div style="color: #222222"><span class="' + event_class + '"></span>' + name + '</div>';
                        html += "</div>";
                    }
                }
                html += "</div>";
                html += "</section>";
                html += "</div>";

                return html;
            },
            soccer_cal_click_html: function (json, key) {
                var html = '',
                    select_data = json[key],
                    section_length = $('#pastResult').length,
                    today = moment().format('YYYY-MM-DD');

                console.log(json);
                console.log(key);
                console.log(select_data);
                console.log(section_length);
                console.log(select_data.length);
                console.log(today);
                _past_json = select_data; // 전역에 변수 저장
                var name_key = 'continent_name',
                    idx_key = 'continent_idx',
                    league_name_key = "long_name",
                    league_idx_key = 'league_idx',
                    key1 = "unique",
                    key2 = 'unique_idx',
                    unique = _Fn.nation_league_unique_value(select_data, name_key, idx_key);

                console.log(unique);
                _nation_arr = unique[key1];
                _nation_idx_arr = unique[key2];
                console.log(_nation_arr);
                console.log(_league_arr);
                console.log(league_config);

                /* var unique_league = _Fn.nation_league_unique_value(league_config, league_name_key, league_idx_key);
                _league_arr = unique_league[key1];
                _league_idx_arr = unique_league[key2];
                console.log(_league_arr);
                console.log(_league_idx_arr); */
                var l_unique = [];
                for (var i = 0; i < select_data.length; i++) {
                    var league_config = select_data[i].league_config;
                    if (l_unique.indexOf(league_config[league_name_key]) === -1) {
                        l_unique.push(league_config[league_name_key]);
                    }
                }
                var l_unique_idx = [];
                for (var i = 0; i < select_data.length; i++) {
                    var league_config = select_data[i].league_config;
                    if (l_unique_idx.indexOf(league_config[league_idx_key]) === -1) {
                        l_unique_idx.push(league_config[league_idx_key]);
                    }
                }
                _league_arr = l_unique;
                _league_idx_arr = l_unique_idx;
                console.log(_league_arr);
                console.log(_league_idx_arr);
                if (section_length == 1) {
                    $('#pastResult').remove();
                }
                console.log(today != key);
                if (today != key) {
                    if (select_data.length != 0) {
                        $('#soccer_list header').addClass('nonDisplay');
                        $('#bookmark').addClass('nonDisplay');
                        $('#todayGame').addClass('nonDisplay');
                        $('#tomorrowGame').addClass('nonDisplay');
                        $('#todayResult').addClass('nonDisplay');
                        $('#yesterday_result').addClass('nonDisplay');

                        html += '<section id="pastResult" style="margin-top: 10px; border-radius: 4px;">';
                        html += '<div>';
                        html += '<div id="listTitle">';
                        html += '<div>경기</div>';
                        html += '<div>시간</div>';
                        html += '<div>상태</div>';
                        html += '<div>홈팀</div>';
                        html += '<div>스코어</div>';
                        html += '<div>원정팀</div>';
                        html += '<div>전반</div>';
                        html += '<div>C</div>';
                        html += '<div>데이터</div>';
                        html += '</div>';
                        html += '<div>지난(예정) 경기 결과</div>';
                        html += '</div>';
                        for (var i = 0; i < select_data.length; i++) {
                            var data = select_data[i],
                                league = data.league_config,
                                time = data.year.substr(11, 5),
                                progress_text = '';
                            console.log(time);

                            html += '<div data-idx="' + data.game_idx + '" data-nation_idx="' + data.continent_idx + '" data-league_idx="' + league.league_idx + '" class="' + (i + 1) + '">';
                            html += '<div>';
                            html += '<div style="background-color: ' + league.color + '"></div>';
                            html += '<div style="color:#222222" data-league_idx="' + league.league_idx + '">' + league.short_name + '</div>';
                            html += '</div>';
                            html += '<div>' + time + '</div>';
                            switch (data.game_progress) {
                                case 0:
                                    progress_text = "";
                                    break;
                                case 1:
                                    progress_text = "전반";
                                    break;
                                case 2:
                                    progress_text = "HT";
                                    break;
                                case 3:
                                    progress_text = "후반";
                                    break;
                                case 4:
                                    progress_text = "Ot";
                                    break;
                                case 5:
                                    progress_text = "Pen";
                                    break;
                                case -1:
                                    progress_text = "<b>FT</b>";
                                    break;
                                case -10:
                                    progress_text = "Cancel";
                                    break;
                                case -11:
                                    progress_text = "Pend";
                                    break;
                                case -12:
                                    progress_text = "And";
                                    break;
                                case -13:
                                    progress_text = "Pause";
                                    break;
                                case -14:
                                    progress_text = "Postp";
                                    break;
                                default:
                                    progress_text = "오류";
                            }
                            html += '<div style="color: #ff5e3a">' + progress_text + '</div>';
                            html += '<div data-home_idx="' + data.home_idx + '">';
                            html += '<span class="teamName">' + data.home_name + '</span>';
                            html += '</div>';
                            html += '<div>';
                            html += '<span class="red">' + data.home_goal + '-' + data.away_goal + '</span>';
                            html += '</div>';
                            html += '<div data-away_idx="' + data.away_idx + '">';
                            html += '<span class="teamName">' + data.away_name + '</span>';
                            html += '</div>';
                            html += '<div style="cursor: pointer;">';
                            html += '<span style="color: #9a9fbf">' + data.first_home_goal + '-' + data.first_away_goal + '</span>';
                            html += '</div>';
                            html += '<div>';
                            html += '<span class="blue">' + data.home_c + '-' + data.away_c + '</span>';
                            html += '</div>';
                            html += '<div class="dataContainer">';
                            html += '<div style="display: block; width: 92px; " align="left">';
                            html += '<div id="analysis">';
                            html += '<span class="tooltips" tooltip="The top of the element" tooltip-position="top"></span>';
                            html += '</div>';
                            html += '<div>';
                            html += '<span class="tooltips" tooltip="The top of the element" tooltip-position="top"></span>';
                            html += '</div>';
                            html += '<div>';
                            html += '<span class="tooltips" tooltip="The top of the element" tooltip-position="top"></span>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';

                        }
                        html += '</section>';
                        $('#soccer_list').append(html);
                    } else {
                        $('#soccer_list header').addClass('nonDisplay');
                        $('#bookmark').addClass('nonDisplay');
                        $('#todayGame').addClass('nonDisplay');
                        $('#tomorrowGame').addClass('nonDisplay');
                        $('#todayResult').addClass('nonDisplay');
                        $('#yesterday_result').addClass('nonDisplay');

                        html += '<section id="pastResult" style="margin-top: 10px; border-radius: 4px;">';
                        html += '<div>';
                        html += '<div id="listTitle">';
                        html += '<div>경기</div>';
                        html += '<div>시간</div>';
                        html += '<div>상태</div>';
                        html += '<div>홈팀</div>';
                        html += '<div>스코어</div>';
                        html += '<div>원정팀</div>';
                        html += '<div>전반</div>';
                        html += '<div>C</div>';
                        html += '<div>데이터</div>';
                        html += '</div>';
                        html += '<div>지난(예정) 경기가 없습니다</div>';
                        html += '</div>';
                        html += '</section>';

                        $('#soccer_list').append(html);
                    }
                } else {
                    var bookmark_length = $('#bookmark').children().length;
                    console.log(bookmark_length);
                    $('#soccer_list header').removeClass('nonDisplay');
                    if (bookmark_length > 1) {
                        $('#bookmark').removeClass('nonDisplay');
                    }
                    $('#todayGame').removeClass('nonDisplay');
                    $('#tomorrowGame').removeClass('nonDisplay');
                    $('#todayResult').removeClass('nonDisplay');
                    $('#yesterday_result').removeClass('nonDisplay');
                }
            },
            soccer_nation_popup_html: function () {
                var html = '',
                    node = $('#main_nav .first_nav .select_nav .country_popup'),
                    select_day = _select_day,
                    today = moment().format('YYYY-MM-DD'),
                    league_length = $DOCUMENT.find('#main_nav .first_nav .select_nav .league_popup').children().length,
                    flag_data = _soccer_json.flag,
                    json_data = _cal_game_json,
                    data = json_data[select_day],
                    checkbox_length = $('#main_nav .first_nav .select_nav .league_popup .league_body div div label input').length,
                    checked_length = $('#main_nav .first_nav .select_nav .league_popup .league_body div div label input:checked').length;

                if (select_day == null) {
                    data = json_data[today];
                }
                console.log(_nation_arr);
                console.log(select_day);
                console.log(today);

                html += '<div class="nation_header">';
                html += '<div class="nation_title">';
                html += '<span>국가 필터</span>';
                html += '</div>';
                html += '<div class="nation_checkbox">';
                html += '<div class="all_check">';
                // html += '<input type="checkbox" id="nation_all" checked="checked"></input>';
                html += '<label for="nation_all" class="check_nation">전체선택';
                if(league_length == 0) {
                    html += '<input type="checkbox" id="nation_all" checked="checked">';
                }else {
                    if(checkbox_length == checked_length) {
                        html += '<input type="checkbox" id="nation_all" checked="checked">';
                    }else {
                        html += '<input type="checkbox" id="nation_all">';
                    }
                }
                html += '<span class="checkmark"></span>';
                html += '</label>';
                html += '</div>';
                html += '<div class="all_off">';
                // html += '<input type="checkbox" id="nation_all_off"></input>';
                html += '<label for="nation_all_off" class="check_nation">전체해제';
                if(league_length == 0) {
                    html += '<input type="checkbox" id="nation_all_off">';
                }else {
                    console.log(checkbox_length);
                    console.log(checked_length);
                    if(checkbox_length == checked_length) {
                        html += '<input type="checkbox" id="nation_all_off">';
                    }else if(checked_length == 0) {
                        html += '<input type="checkbox" id="nation_all_off" checked="checked">';
                    }else if(checkbox_length != checked_length) {
                        html += '<input type="checkbox" id="nation_all_off">';
                    }
                }
                html += '<span class="checkmark"></span>';
                html += '</label>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="nation_body">';
                html += '<div class="nation_list">';
                for (var i = 0; i < _nation_arr.length; i++) {
                    var nation_count = '',
                        select_flag_data = '',
                        loop_league_idx = '',
                        loop_idx = _nation_idx_arr[i];

                    for (var s = 0; s < flag_data.length; s++) {
                        console.log(_nation_idx_arr[i] == flag_data[s].country_idx);
                        if (_nation_idx_arr[i] == flag_data[s].country_idx) {
                            select_flag_data = flag_data[s];
                            console.log(select_flag_data);
                        }
                    }
                    for (var z = 0; z < data.length; z++) {
                        var select_loop_nation_idx = data[z].continent_idx;
                        if (loop_idx == select_loop_nation_idx) {
                            loop_league_idx = data[z].league_config.league_idx;
                        }
                    }
                    if (today == select_day || select_day == null) {
                        nation_count = $.grep(_soccer_json.today, function (value) {
                            return value.continent_name == _nation_arr[i];
                        });
                    } else {
                        console.log(_past_json);
                        nation_count = $.grep(_past_json, function (value) {
                            return value.continent_name == _nation_arr[i];
                        });
                    }
                    console.log(nation_count);
                    console.log(nation_count.length);
                    html += '<div class="check_list_' + (i + 1) + '">';
                    html += '<label for="nation_' + _nation_idx_arr[i] + '" class="check_nation" data-league_idx="' + loop_league_idx + '">';
                    if (select_flag_data == '') {
                        html += '<span class="nation_img num' + _nation_idx_arr[i] + '"></span>';
                        html += '<span>' + _nation_arr[i] + '</span> <span class="nation_count">(' + nation_count.length + ')</span>';
                    } else {
                        html += '<span class="nation_img2 num' + _nation_idx_arr[i] + '" style="background-position: 0px ' + select_flag_data.position_Y + 'px"></span>';
                        html += '<span>' + select_flag_data.country_name_ko + '</span> <span class="nation_count">(' + nation_count.length + ')</span>';
                    }
                    if (league_length == 0) {
                        html += '<input type="checkbox" id="nation_' + _nation_idx_arr[i] + '" value="' + _nation_idx_arr[i] + '" name="'+loop_league_idx+'" checked="checked"></input>';
                        html += '<span class="checkmark"></span></span>';
                    } else {
                        // var checkbox_length = $DOCUMENT.find('#main_nav .first_nav .select_nav .league_popup .league_body div div label input').length;
                        // console.log(checkbox_length);
//                         for (var h = 0; h < checkbox_length; h++) {
//                             var check_node = $DOCUMENT.find('#main_nav .first_nav .select_nav .league_popup .league_body div div:nth-child(' + (h + 1) + ') label input'),
//                                 un_checked = check_node.is(':checked'),
//                                 check_nation_idx = check_node.parent('label').data('nation_idx'),
//                                 check_val = check_node.val();
// console.log(check_node);
// console.log(un_checked);
// console.log(check_val);
//                             if (un_checked == false) {
//                                 if (check_nation_idx == _nation_idx_arr[i]) {
//                                     console.log('1111111111111');
//                                     html += '<input type="checkbox" id="nation_' + _nation_idx_arr[i] + '" value="' + _nation_idx_arr[i] + '"></input>';
//                                 }
//                             } else {
//                                 if (check_val == loop_league_idx && check_nation_idx != _nation_idx_arr[i]) {
//                                     console.log('2222222222222');
//                                     html += '<input type="checkbox" id="nation_' + _nation_idx_arr[i] + '" value="' + _nation_idx_arr[i] + '" checked="checked"></input>';
//                                 }
//                             }
//                         }
                        var league_label_node = $('#main_nav .first_nav .select_nav .league_popup .league_body .league_list div label'),
                            league_input_length = league_label_node.find('input[name="'+_nation_idx_arr[i]+'"]').length,
                            league_checked_length = league_label_node.find('input[name="'+_nation_idx_arr[i]+'"]:checked').length;
                        console.log(league_label_node);
                        console.log(league_input_length);
                        console.log(league_checked_length);
                        console.log(league_input_length == league_checked_length);
                        console.log(league_input_length > league_checked_length && league_checked_length != 0);
                        console.log(league_input_length > league_checked_length) && (league_checked_length == 0);
                        console.log(league_checked_length != 0);
                        if(league_input_length == league_checked_length){
                            html += '<input type="checkbox" id="nation_' + _nation_idx_arr[i] + '" value="' + _nation_idx_arr[i] + '" name="'+loop_league_idx+'" checked="checked"></input>';
                            html += '<span class="checkmark"></span>';
                        }else if(league_input_length > league_checked_length && league_checked_length != 0){
                            html += '<input type="checkbox" id="nation_' + _nation_idx_arr[i] + '" value="' + _nation_idx_arr[i] + '" name="'+loop_league_idx+'">';
                            html += '<span class="half_check"></span>';
                        }else if((league_input_length > league_checked_length) && (league_checked_length == 0)){
                            html += '<input type="checkbox" id="nation_' + _nation_idx_arr[i] + '" value="' + _nation_idx_arr[i] + '" name="'+loop_league_idx+'">';
                            html += '<span class="checkmark"></span>';
                        }else if(league_checked_length != 0) {
                            html += '<input type="checkbox" id="nation_' + _nation_idx_arr[i] + '" value="' + _nation_idx_arr[i] + '" name="'+loop_league_idx+'">';
                            html += '<span class="checkmark"></span>';
                        }
                    }
                    // html += '<span class="checkmark"></span></span>';
                    html += '</label>';
                    html += '</div>';
                }
                html += '</div>';
                html += '</div>';
                html += '<div class="nation_footer">';
                html += '<div class="complete_btn">선택완료</div>';
                html += '<div class="close_btn">취소</div>';
                html += '</div>';

                node.append(html);
            },
            soccer_league_popup_html: function () {
                var html = '',
                    node = $('#main_nav .first_nav .select_nav .league_popup'),
                    select_day = _select_day,
                    today = moment().format('YYYY-MM-DD'),
                    nation_length = $DOCUMENT.find('#main_nav .first_nav .select_nav .country_popup').children().length,
                    json_data = _cal_game_json,
                    data = json_data[select_day],
                    checkbox_length = $('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input').length,
                    checked_length = $('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input:checked').length;

                if (select_day == null) {
                    data = json_data[today];
                }
                console.log(json_data);
                console.log(data);
                console.log(_league_arr);
                console.log(_league_idx_arr);
                html += '<div class="league_header">';
                html += '<div class="league_title">';
                html += '<span>국가 필터</span>';
                html += '</div>';
                html += '<div class="league_checkbox">';
                html += '<div class="all_check">';
                html += '<label for="league_all" class="check_league">전체선택';
                if(nation_length == 0) {
                    html += '<input type="checkbox" id="league_all" checked="checked">';
                }else {
                    if(checkbox_length == checked_length) {
                        html += '<input type="checkbox" id="league_all" checked="checked">';
                    }else {
                        html += '<input type="checkbox" id="league_all">';
                    }
                }
                html += '<span class="checkmark"></span>';
                html += '</label>';
                html += '</div>';
                html += '<div class="all_off">';
                html += '<label for="league_all_off" class="check_league">전체해제';
                if(nation_length == 0) {
                    html += '<input type="checkbox" id="league_all_off">';
                }else {
                    if(checkbox_length == checked_length){
                        html += '<input type="checkbox" id="league_all_off">';
                    }else if(checked_length == 0) {
                        html += '<input type="checkbox" id="league_all_off" checked="checked">';
                    }else if(checked_length > 0) {
                        html += '<input type="checkbox" id="league_all_off">';
                    }
                }
                html += '<span class="checkmark"></span>';
                html += '</label>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="league_important">';
                html += '<div class="important_title">주요 리그</div>';
                html += '<div class="league_list">';
                for (var i = 0; i < _league_arr.length; i++) {
                    var loop_idx = _league_idx_arr[i];
                    if (loop_idx == 36 || loop_idx == 31 || loop_idx == 8 || loop_idx == 34 || loop_idx == 11 || loop_idx == 1885 || loop_idx == 166) {
                        var league_count = '',
                            loop_nation_idx = '';

                        for (var r = 0; r < data.length; r++) {
                            var select_loop_league_idx = data[r].league_config.league_idx;
                            console.log(select_loop_league_idx);
                            if (loop_idx == select_loop_league_idx) {
                                loop_nation_idx = data[r].continent_idx;
                            }
                        }
                        console.log('3333333333333');
                        if (today == select_day || select_day == null) {
                            league_count = $.grep(_soccer_json.today, function (value) {
                                return value.league_name == _league_arr[i];
                            });
                        } else {
                            console.log(_past_json);
                            league_count = $.grep(_past_json, function (value) {
                                return value.league_config.long_name == _league_arr[i];
                            });
                        }
                        console.log(league_count);
                        console.log(league_count.length);
                        html += '<div class="check_list_' + (i + 1) + '">';
                        html += '<label for="important_league_' + _league_idx_arr[i] + '" class="check_league" data-nation_idx="' + loop_nation_idx + '">';
                        html += '<span class="league_img num' + _league_idx_arr[i] + '"></span>';
                        html += '<span>' + _league_arr[i] + '</span> <span class="league_count">(' + league_count.length + ')</span>';
                        if (nation_length == 0) {
                            html += '<input type="checkbox" id="important_league_' + _league_idx_arr[i] + '" value="' + _league_idx_arr[i] + '" name="'+loop_nation_idx+'" checked="checked">';
                        } else {
                            var checkbox_length = $DOCUMENT.find('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input').length;
                            console.log(checkbox_length);
                            for (var s = 0; s < checkbox_length; s++) {
                                var check_node = $DOCUMENT.find('#main_nav .first_nav .select_nav .country_popup .nation_body div div:nth-child(' + (s + 1) + ') label input'),
                                    un_checked = $DOCUMENT.find('#main_nav .first_nav .select_nav .country_popup .nation_body div div:nth-child(' + (s + 1) + ') label input').is(':checked'),
                                    check_val = check_node.val();

                                console.log(un_checked);
                                console.log(check_val);
                                if (un_checked == false) {
                                    console.log("체크 해제됨");
                                    if (check_val == loop_nation_idx) {
                                        console.log("체크 해제됨 값이 맞음");
                                        html += '<input type="checkbox" id="important_league_' + _league_idx_arr[i] + '" value="' + _league_idx_arr[i] + '" name="'+loop_nation_idx+'">';
                                    }
                                } else {
                                    if (check_val == loop_nation_idx) {
                                        console.log("체크 해제됨 값이 맞음");
                                        html += '<input type="checkbox" id="important_league_' + _league_idx_arr[i] + '" value="' + _league_idx_arr[i] + '" name="'+loop_nation_idx+'" checked="checked">';
                                    }
                                }
                            }
                        }
                        html += '<span class="checkmark"></span>';
                        html += '</label>';
                        html += '</div>';
                    }
                }
                html += '</div>';
                html += '</div>';

                html += '<div class="league_body">';
                html += '<div class="body_title">전체 리그</div>';
                html += '<div class="league_list">';
                for (var v = 0; v < _league_arr.length; v++) {
                    var league_count = '',
                        loop_idx = _league_idx_arr[v];
                    loop_nation_idx = '';

                    for (var r = 0; r < data.length; r++) {
                        var select_loop_league_idx = data[r].league_config.league_idx;
                        console.log(select_loop_league_idx);
                        if (loop_idx == select_loop_league_idx) {
                            loop_nation_idx = data[r].continent_idx;
                        }
                    }


                    if (today == select_day || select_day == null) {
                        league_count = $.grep(_soccer_json.today, function (value) {
                            return value.league_name == _league_arr[v];
                        });
                    } else {
                        console.log(_past_json);
                        league_count = $.grep(_past_json, function (value) {
                            return value.league_config.long_name == _league_arr[v];
                        });
                    }
                    console.log(league_count);
                    console.log(league_count.length);
                    html += '<div class="check_list_' + (v + 1) + '">';
                    html += '<label for="league_' + _league_idx_arr[v] + '" class="check_league" data-nation_idx="' + loop_nation_idx + '">';
                    html += '<span class="league_img num' + _league_idx_arr[v] + '"></span>';
                    html += '<span>' + _league_arr[v] + '</span> <span class="league_count">(' + league_count.length + ')</span>';
                    if (nation_length == 0) {
                        html += '<input type="checkbox" id="league_' + _league_idx_arr[v] + '" value="' + _league_idx_arr[v] + '" name="'+loop_nation_idx+'" checked="checked">';
                        html += '<span class="checkmark"></span>';
                    } else {
                        var checkbox_length = $DOCUMENT.find('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input').length;
                        console.log(checkbox_length);
                        for (var s = 0; s < checkbox_length; s++) {
                            var check_node = $DOCUMENT.find('#main_nav .first_nav .select_nav .country_popup .nation_body div div:nth-child(' + (s + 1) + ') label input'),
                                un_checked = $DOCUMENT.find('#main_nav .first_nav .select_nav .country_popup .nation_body div div:nth-child(' + (s + 1) + ') label input').is(':checked'),
                                check_val = check_node.val();

                            console.log(un_checked);
                            console.log(check_val);
                            if (un_checked == false) {
                                console.log("체크 해제됨");
                                if (check_val == loop_nation_idx) {
                                    console.log("체크 해제됨 값이 맞음");
                                    html += '<input type="checkbox" id="league_' + _league_idx_arr[v] + '" value="' + _league_idx_arr[v] + '" name="'+loop_nation_idx+'">';
                                }
                            } else {
                                if (check_val == loop_nation_idx) {
                                    console.log("체크 해제됨 값이 맞음");
                                    html += '<input type="checkbox" id="league_' + _league_idx_arr[v] + '" value="' + _league_idx_arr[v] + '" name="'+loop_nation_idx+'" checked="checked">';
                                }
                            }
                        }
                        // var nation_label_node = $('#main_nav .first_nav .select_nav .country_popup .nation_body .nation_list div label'),
                        //     nation_input_length = nation_label_node.find('input[name="'+_league_idx_arr[v]+'"]').length,
                        //     nation_checked_length = nation_label_node.find('input[name="'+_league_idx_arr[v]+'"]:checked').length;
                        // console.log(nation_label_node);
                        // console.log(nation_input_length);
                        // console.log(nation_checked_length);
                        // if(nation_input_length == nation_checked_length){
                        //     html += '<input type="checkbox" id="league_' + _league_idx_arr[v] + '" value="' + _league_idx_arr[v] + '" name="'+loop_nation_idx+'" checked="checked">';
                        //     html += '<span class="checkmark"></span>';
                        // }else if(nation_input_length > nation_checked_length && nation_checked_length != 0){
                        //     html += '<input type="checkbox" id="league_' + _league_idx_arr[v] + '" value="' + _league_idx_arr[v] + '" name="'+loop_nation_idx+'">';
                        //     html += '<span class="half_check"></span>';
                        // }else if(nation_checked_length != 0) {
                        //     html += '<input type="checkbox" id="league_' + _league_idx_arr[v] + '" value="' + _league_idx_arr[v] + '" name="'+loop_nation_idx+'">';
                        //     html += '<span class="checkmark"></span>';
                        // }else if(nation_checked_length == 0) {
                        //     html += '<input type="checkbox" id="league_' + _league_idx_arr[v] + '" value="' + _league_idx_arr[v] + '" name="'+loop_nation_idx+'">';
                        //     html += '<span class="checkmark"></span>';
                        // }

                    }
                    html += '<span class="checkmark"></span>';
                    html += '</label>';
                    html += '</div>';
                }
                html += '</div>';
                html += '</div>';
                html += '<div class="league_footer">';
                html += '<div class="complete_btn">선택완료</div>';
                html += '<div class="close_btn">취소</div>';
                html += '</div>';

                node.append(html);
                plus_num = 0;
            }
        };
    })();
    _Soccer_ajax = (function () {
        return {
            soccer_getJson: function () {
                $.get("/livescore/soccer/getdatajson", function (data) {
                    var json_data = data.data,
                        detail = json_data.detail;

                    _soccer_json = json_data;
                    _detail_statusJson = detail.stats;
                    _detail_eventJson = detail.content;
                    _opponent_json = _soccer_json.opponent;
                    _main_odd_json = _soccer_json.odddata;
                    _game_count_json = _soccer_json.cal_count;
                    _cal_game_json = _soccer_json.cal_result;
                    console.log(_opponent_json);
                    console.log(_soccer_json);
                    console.log(detail);
                    console.log(_detail_statusJson);
                    console.log(_detail_eventJson);
                    console.log(_main_odd_json);
                    $('[data-toggle="tooltip"]').tooltip();
                    _Soccer.soccer_first_loading_event(_soccer_json);

                    var today_json = _soccer_json.today,
                        name_key = 'continent_name',
                        idx_key = 'continent_idx',
                        league_name_key = 'league_name',
                        league_idx_key = 'league_idx',
                        key1 = 'unique',
                        key2 = 'unique_idx';

                    var unique_nation = _Fn.nation_league_unique_value(today_json, name_key, idx_key);
                    console.log(unique_nation);
                    _nation_arr = unique_nation[key1];
                    _nation_idx_arr = unique_nation[key2];

                    console.log(_nation_arr);
                    console.log(_league_arr);

                    var unique_league = _Fn.nation_league_unique_value(today_json, league_name_key, league_idx_key);
                    _league_arr = unique_league[key1];
                    _league_idx_arr = unique_league[key2];
                    console.log(_league_arr);
                    console.log(_league_idx_arr);
                }).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("초기 " + text.message);
                });
            },
            soccer_resultJson: function () {
                $.get("/livescore/soccer/getResultJson", function (data) {
                    var json_data = data;
                    _soccer_result_json = json_data.data;
                    console.log(_soccer_result_json);
                    _Soccer.yesterday_result_html(_soccer_result_json);
                }).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("이전 경기 결과 " + text.message);
                });
            },
            /*  soccer_opponent: function () {
                 $.get("/livescore/soccer/getopponentjson", function (res) {
                     console.log(res);
                     var result = res.data;
                     _opponent_json = result;
                 }).fail(function (error) {
                     console.log(error.responseText);
                     var text = error.responseText;
                     alert("상대전적 " + text.message);
                 });
             }, */
            soccer_analysis: function () {
                var adr = location.href,
                    adr_arr = adr.split("/"),
                    select_adr = adr_arr[6];
                console.log(select_adr);
                $.get("/livescore/soccer/getAnalysisJson/" + select_adr + "", function (res) {
                    var result = res;
                    _analysis_json = result.data;
                    console.log(_analysis_json);
                    var data = _analysis_json.previous_scores,
                        h_data = data.previous_score_home,
                        h_league = data.previous_score_home_league,
                        a_data = data.previous_score_away,
                        a_league = data.previous_score_away_league;

                    _Soccer.soccer_analysis_title_html(_analysis_json);
                    _Soccer.soccer_analysis_standing_html(_analysis_json);
                    _Soccer.soccer_analysis_HTH_html(_analysis_json);
                    _Soccer.soccer_analysis_Previous_html(h_data, h_league, 1);
                    _Soccer.soccer_analysis_Previous_html(a_data, a_league, 0);
                }).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("분석페이지(analysis) " + text.message);
                });
            },
            soccer_team: function (_team_number) {
                var adr = location.href,
                    adr_arr = adr.split("/"),
                    select_adr = adr_arr[6];

                //var select_adr = 27;
                if (_team_number != null) {
                    select_adr = _team_number;
                }

                console.log(select_adr);
                $.get("/livescore/soccer/getTeamJson/" + select_adr + "", function (res) {
                    var result = res;
                    _team_json = result.data;
                    console.log(res);
                    console.log(_team_json);
                    _Soccer.soccer_team_statistics_html(_team_json);
                    _Soccer.soccer_team_statistics_honor_content_html(_team_json);
                    _Soccer.soccer_team_statistics_profile_content_html(_team_json);
                    $.get("/livescore/soccer/getTeamTotalJson/" + select_adr + "", function (res) {
                        console.log(res);
                        var result = res,
                            idx = _team_json.team_info_data.team_idx,
                            season = "";

                        _team_total_json = result.data;
                        console.log(_team_total_json);
                        console.log(idx);

                        var league_data = _team_total_json.league_stats,
                            cup_data = _team_total_json.cup_stats,
                            cup_info_data = _team_total_json.cup_info,
                            ach_data = _team_total_json.achievements,
                            sch_data = _team_total_json.schedule,
                            line_data = _team_total_json.lineup,
                            player_data = _team_total_json.player_data;

                        _Soccer.soccer_team_leaguestats_content_html(league_data);
                        _Soccer.soccer_team_cupstats_content_html(cup_data, cup_info_data);
                        _Soccer.soccer_team_achievements_content_html(ach_data);
                        _Soccer.soccer_team_schedule_content_html(sch_data);
                        _Soccer.soccer_team_lineup_content_html(line_data);
                        _Soccer.soccer_team_player_content_html(player_data);
                        _Soccer_ajax.soccer_transfer(idx, season, transfer_num);
                    }).fail(function (error) {
                        console.log(error.responseText);
                        var text = error.responseText;
                        swal("팀 정보(토탈) " + text.message);
                        location.reload();
                    });
                }).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("팀 정보 " + text.message);
                    location.reload();
                });
            },
            soccer_transfer: function (idx, season, transfer_num) {
                $.post(
                    "/livescore/soccer/getTransferJson",
                    {
                        idx: idx,
                        season: season,
                    },
                    function (res) {
                        console.log(res);
                        _transfer_json = res.data;
                        var season = _transfer_json.season,
                            transfer = _transfer_json.transfer;

                        console.log(transfer_num);
                        if (transfer_num == 0) {
                            _Soccer.soccer_transfer_html(season, transfer);
                        } else {
                            _Soccer.soccer_transfer_select_click_event(transfer);
                        }
                    }
                ).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("팀 이적 " + text.message);
                    location.reload();
                });
            },
            soccer_player: function (team_idx, player_idx, sort, option) {
                $.post(
                    "/livescore/soccer/getPlayerJson",
                    {
                        //team_idx: team_idx,
                        player_idx: player_idx,
                    },
                    function (res) {
                        console.log(res);
                        _player_json = res;
                        _Fn.team_open(player_idx, sort, option);
                        var key = "json",
                            value = JSON.stringify(_player_json);
                        localStorage.clear();
                        localStorage.setItem(key, value);
                        //_Soccer.soccer_player_content_html(_player_json);
                    }
                ).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("선수 정보 " + text.message);
                    location.reload();
                });
            },
            soccer_league_side: function () {
                $.post("/livescore/soccer/getLeftSelectJson", function (res) {
                    _league_side_json = res;
                    console.log(_league_side_json);
                    _Soccer.soccer_league_side_html(_league_side_json);
                }).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("리그 사이드 정보 " + text.message);
                    location.reload();
                });
            },
            soccer_league_main: function (season, idx, division) {
                $.post(
                    "/livescore/soccer/getLeaderboardJson",
                    {
                        season: season,
                        idx: idx,
                        division: division,
                    },
                    function (res) {
                        _league_main_json = res;
                        _league_main_json2 = res;
                        console.log(_league_main_json);

                        _Soccer.soccer_league_main_schedule_html(_league_main_json, season, division);
                        _Soccer.soccer_league_main_techstats_html(_league_main_json);
                        _Soccer.soccer_league_main_teamprofiles_html(_league_main_json);
                        _Soccer.soccer_league_main_firstGoal_html(_league_main_json);
                        _Soccer.soccer_league_main_noGoal_html(_league_main_json);
                    }
                ).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("리그 메인 JSON " + text.message);
                    location.reload();
                });
            },
            soccer_select_odds_json: function () {
                var adr = location.href,
                    adr_arr = adr.split("/"),
                    select_adr = adr_arr[6];
                console.log(adr_arr);
                $.post("/livescore/soccer/getoddjson/" + select_adr + "", function (res) {
                    _popup_odd_json = res;
                    console.log(_popup_odd_json);
                    /* _Fn.team_open(bet_game_idx, sort, option);
                        var key = 'odds_json',
                            value = JSON.stringify(_popup_odd_json);
                        localStorage.clear();
                        localStorage.setItem(key, value); */
                }).fail(function (error) {
                    console.log(error.responseText);
                    var text = error.responseText;
                    swal("팝업 배당률 JSON " + text.message);
                    location.reload();
                });
            }
        };
    })();
    _Io = (function () {
        return {
            connect_io: function () {
                console.log("Connecting ...........");
                _sever = "wss://io.spoto.com/bridgeTest";
                _socket = io(_sever, {
                    transports: ["websocket"],
                    reconnection: true,
                    reconnectionAttempts: Infinity,
                    reconectionDelay: 1000,
                    reconnectionDelayMax: 3000,
                    timeout: 5000,
                    autoConnect: false,
                });
                _socket.connect();
                _socket.on("connect", function (res) {
                    console.log("connect");
                    console.log(_socket.connected);
                    console.log(_socket);

                    if ($(location).attr("href").indexOf("analysis") != -1) {
                        var storage_data = localStorage.getItem('analysis_team_idx'),
                            storage_data2 = localStorage.getItem('analysis_team_name'),
                            storage_data3 = localStorage.getItem('analysis_game_idx'),
                            storage_data4 = localStorage.getItem('analysis_game_date'),
                            storage_data5 = localStorage.getItem('analysis_league_idx'),
                            idx_arr = JSON.parse(storage_data),
                            name_arr = JSON.parse(storage_data2),
                            game_idx = storage_data3,
                            game_date = storage_data4,
                            league_idx = storage_data5;
                        console.log(storage_data);
                        if (storage_data !== null) {
                            _analysis_h_idx = idx_arr[0];
                            _analysis_a_idx = idx_arr[1];
                            _analysis_h_name = name_arr[0];
                            _analysis_a_name = name_arr[1];
                            _analysis_game_idx = game_idx;
                            _analysis_game_date = game_date;
                            _analysis_league_idx = league_idx;
                            console.log(_socket.id);
                            _socket.emit('opponent', {
                                roomid: _socket.id,
                                home: _analysis_h_idx,
                                away: _analysis_a_idx,
                                home_name: _analysis_h_name,
                                away_name: _analysis_a_name,
                                game_idx: _analysis_game_idx,
                                game_date: _analysis_game_date,
                                league_idx: _analysis_league_idx
                            });
                            //localStorage.removeItem('analysis_team_idx'); // localstorage 삭제 이벤트
                        }
                    }

                }).on("soccerEvent", function (res) {
                    console.log(res);
                    _Io.receive(res);
                }).on('verification', function (res) {
                    console.log(res);
                    if(res != null){
                        var sto_data = localStorage.getItem('window_open'),
                            option_data = sto_data.split(',');
                        console.log(option_data);
                        _Fn.team_open(option_data[0], option_data[1], option_data[2]);
                    }else{
                        swal('경기 데이터를 생성 중입니다.','잠시 후 다시 시도해 주세요.','warning',{
                           button: "확인"
                        });
                    }
                    localStorage.removeItem('window_open');
                }).on("RECEIVE", function (res) {
                    console.log(res);
                }).on("opponetData", function (res) {
                    console.log(res);


                }).on('opponetDataDetail', function(res) {
                    console.log(res);
                    _analysis_json = res;

                    var key = 'analysis_json';
                    localStorage.setItem(key, JSON.stringify(_analysis_json));
                    if ($(location).attr("href").indexOf("analysis") != -1) {
                        //_Soccer_ajax.soccer_analysis(); // 축구 첫번쨰 아이콘 페이지 JSON 파일 변수 저장
                        console.log($DOCUMENT.find('#analysis_title').children().length);
                        if($DOCUMENT.find('#analysis_title').children().length <= 1) {
                            console.log('계속 뜨면 서버 재부팅이나 재연결임');
                            var json_data = _analysis_json;
                            if(json_data.isset !== null) {
                                _Analysis.analysis_page_html(json_data); //분석페이지 메인화면 추가 이벤트
                                _Analysis.detail_graph_draw();
                                _Analysis.datail_goalkeeper_graph_draw();
                                _Analysis.detail_pie_draw();

                                _Fn.one_action(is_action, _Analysis.graph_draw())

                            }
                        }

                    }
                }).on('test', function (res) {
                    console.log(res);
                }).on("disconnect", function () {
                    console.log("you have been disconnected");
                }).on("reconnect", function () {
                    console.log("you have been reconnected");
                    //location.reload();
                }).on("reconnect_error", function () {
                    console.log("attempt to reconnect has failed");
                }).on("error", function (error) {
                    console.log("socket error occured : " + error);
                });
            },
            receive: function (res) {
                //var data = JOSN.parse(res);
                var data = res;
                //console.log(JSON.stringify(data, null, 4));
                console.log(data);
                _Soccer.soccer_live_event_html(res);
                /* switch (data.cmd) {
                    case 200:
                        console.log(data);
                        _Soccer.soccer_gradient_html(res);
                        break;
                    case 404:
                        console.log(data);
                        break;
                    default:
                } */
            },
        };
    })();
    _Analysis = (function () {
        return {
            graph_draw: function () {
                _analysis_json = localStorage.getItem('analysis_json');
                var storage_data = localStorage.getItem('analysis_team_idx'),
                    _analysis_json = JSON.parse(_analysis_json),
                    json_data = _analysis_json,
                    idx_arr = JSON.parse(storage_data),
                    h_idx = idx_arr[0],
                    a_idx = idx_arr[1],
                    recent_h_data = json_data.recent_matchs.home,
                    recent_a_data = json_data.recent_matchs.away,
                    att_h_data = json_data.attack_analysis.home,
                    att_a_data = json_data.attack_analysis.away,
                    def_h_data = json_data.defense_analysis.home,
                    def_a_data = json_data.defense_analysis.away;
console.log(json_data);
                var h_id = 'h_latest',
                    h_labels = [],
                    h_first_back_c = 'rgba(81, 125, 201, 1)',
                    h_first_border_c = 'rgba(81, 125, 201, 1)',
                    h_first_pointback_c = 'rgba(81, 125, 201, 1)',
                    h_second_back_c = 'rgba(255, 94, 55, 0.03)',
                    h_second_border_c = 'rgba(255, 94, 55, 1)',
                    h_second_pointback_c = 'rgba(255, 94, 55, 1)',
                    h_tool_id = 'h_chartjs-tooltip',
                    h_first_data = [],
                    h_second_data = [];
                var a_id = 'a_latest',
                    a_labels = [],
                    a_first_back_c = 'rgba(81, 125, 201, 1)',
                    a_first_border_c = 'rgba(81, 125, 201, 1)',
                    a_first_pointback_c = 'rgba(81, 125, 201, 1)',
                    a_second_back_c = 'rgba(255, 94, 55, 0.03)',
                    a_second_border_c = 'rgba(255, 94, 55, 1)',
                    a_second_pointback_c = 'rgba(255, 94, 55, 1)',
                    a_tool_id = 'a_chartjs-tooltip',
                    a_first_data = [],
                    a_second_data = [],
                    h_latest_num = 0,
                    a_latest_num = 0;

                // for(var i=recent_h_data.length-1; i>=0; i--){
                //     h_labels[h_latest_num] = recent_h_data[i].division_day.substr(3);
                //     h_first_data[h_latest_num] = recent_h_data[i].home_goal;
                //     h_second_data[h_latest_num] = recent_h_data[i].away_goal;
                //     h_latest_num++;
                // }
                // for(var n=recent_a_data.length-1; n>=0; n--){
                //     a_labels[a_latest_num] = recent_a_data[n].division_day.substr(3);
                //     a_first_data[a_latest_num] = recent_a_data[n].home_goal;
                //     a_second_data[a_latest_num] = recent_a_data[n].away_goal;
                //     a_latest_num++;
                // }
                var h_standard_num = 9;
                if(recent_h_data.length < h_standard_num) {
                    h_standard_num = recent_h_data.length;
                }
                console.log(h_standard_num);
                for(var i = (h_standard_num-1); i >= 0; i--){
                    console.log(i);
                    h_labels[h_latest_num] = recent_h_data[i].division_day.substr(3);
                    if(recent_h_data[i].team_div == 'home') {
                        h_first_data[h_latest_num] = recent_h_data[i].home_goal;
                        h_second_data[h_latest_num] = recent_h_data[i].away_goal;
                    }else if(recent_h_data[i].team_div == 'away'){
                        h_first_data[h_latest_num] = recent_h_data[i].away_goal;
                        h_second_data[h_latest_num] = recent_h_data[i].home_goal;
                    }
                    //h_second_data[h_latest_num] = recent_h_data[i].away_goal;
                    h_latest_num++;
                }
                var a_standard_num = 9;
                if(recent_a_data.length < a_standard_num) {
                    a_standard_num = recent_a_data.length;
                }
                for(var n=(a_standard_num-1); n>=0; n--){
                    a_labels[a_latest_num] = recent_a_data[n].division_day.substr(3);
                    if(recent_a_data[n].team_div == 'home') {
                        a_first_data[a_latest_num] = recent_a_data[n].home_goal;
                        a_second_data[a_latest_num] = recent_a_data[n].away_goal;
                    }else if(recent_a_data[n].team_div == 'away') {
                        a_first_data[a_latest_num] = recent_a_data[n].away_goal;
                        a_second_data[a_latest_num] = recent_a_data[n].home_goal;


                    }
                    //a_second_data[a_latest_num] = recent_a_data[n].away_goal;
                    a_latest_num++;
                }

                var h_team_arr = [
                    h_id,h_labels,h_first_back_c,h_first_border_c,h_first_pointback_c,h_first_data,h_second_back_c,
                    h_second_border_c,h_second_pointback_c,h_second_data,h_tool_id
                ];
                var a_team_arr = [
                    a_id,a_labels,a_first_back_c,a_first_border_c,a_first_pointback_c,a_first_data,a_second_back_c,
                    a_second_border_c,a_second_pointback_c,a_second_data,a_tool_id
                ];
                var latest_arr = [h_team_arr, a_team_arr];
                for(var i=0; i<latest_arr.length; i++) {
                   //console.log(h_team_arr[11]);
                    _Analysis.latest_graph(latest_arr[i]);
                }

                /*****************  라인 바 혼합 그래프 ******************************/
                var h_att_recent = att_h_data.recent,
                    a_att_recent = att_a_data.recent;
                console.log(h_att_recent);
                console.log(a_att_recent);
                var h_att_id = 'h_att_goal_possession';
                var h_att_bar_data = [];
                var h_att_line_data = [];
                var h_att_date = [];
                var h_att_line_max = 100;
                for(var x=0; x<h_att_recent.length; x++) {
                    h_att_bar_data[x] = h_att_recent[x].goal;
                    h_att_line_data[x] = h_att_recent[x].possession;
                    h_att_date[x] = h_att_recent[x].division_day;
                }
                var h_att_bar_max = Math.max.apply(null, h_att_bar_data);
                if(h_att_bar_max < 10) {
                    h_att_bar_max = 10;
                }else {
                    h_att_bar_max = Math.max.apply(null, h_att_bar_data)+5;
                }
                var h_att_bar_back_color = 'rgba(63, 66, 87, 0.8)';
                var h_att_line_back_color = 'rgba(255, 94, 55, 1)';
                var h_att_line_point_color = 'rgba(255, 94, 55, 1)';
                var h_att_line_border_color = 'rgba(255, 94, 55, 1)';
                var a_att_id = 'a_att_goal_possession';
                var a_att_bar_data = [];
                var a_att_line_data = [];
                var a_att_date = [];
                var a_att_line_max = 100;
                for(var y=0; y<a_att_recent.length; y++) {
                    a_att_bar_data[y] = a_att_recent[y].goal;
                    a_att_line_data[y] = a_att_recent[y].possession;
                    a_att_date[y] = a_att_recent[y].division_day;
                }
                var a_att_bar_max = Math.max.apply(null, a_att_bar_data);
                if(a_att_bar_max < 10) {
                    a_att_bar_max = 10;
                }else {
                    a_att_bar_max = Math.max.apply(null, a_att_bar_data)+5;
                }
                var a_att_bar_back_color = 'rgba(63, 66, 87, 0.8)';
                var a_att_line_back_color = 'rgba(255, 94, 55, 1)';
                var a_att_line_point_color = 'rgba(255, 94, 55, 1)';
                var a_att_line_border_color = 'rgba(255, 94, 55, 1)';

                var h_def_recent = def_h_data.recent,
                    a_def_recent = def_a_data.recent;
                console.log(h_def_recent);
                console.log(a_def_recent);
                var h_def_id = 'h_def_goal_possession';
                var h_def_bar_data = [];
                var h_def_line_data = [];
                var h_def_date = [];
                var h_def_line_max = 100;
                for(var d=0; d<h_def_recent.length; d++) {
                    h_def_bar_data[d] = h_def_recent[d].goal;
                    h_def_line_data[d] = h_def_recent[d].possession;
                    h_def_date[d] = h_def_recent[d].division_day;
                }
                var h_def_bar_max = Math.max.apply(null, h_def_bar_data);
                if(h_def_bar_max < 10) {
                    h_def_bar_max = 10;
                }else {
                    h_def_bar_max = Math.max.apply(null, h_def_bar_data)+5;
                }
                var h_def_bar_back_color = 'rgba(63, 66, 87, 0.8)';
                var h_def_line_back_color = 'rgba(255, 94, 55, 1)';
                var h_def_line_point_color = 'rgba(255, 94, 55, 1)';
                var h_def_line_border_color = 'rgba(255, 94, 55, 1)';
                var a_def_id = 'a_def_goal_possession';
                var a_def_bar_data = [];
                var a_def_line_data = [];
                var a_def_date = [];
                var a_def_line_max = 100;
                for(var f=0; f<a_def_recent.length; f++) {
                    a_def_bar_data[f] = a_def_recent[f].goal;
                    a_def_line_data[f] = a_def_recent[f].possession;
                    a_def_date[f] = a_def_recent[f].division_day;
                }
                var a_def_bar_max = Math.max.apply(null, a_def_bar_data);
                if(a_def_bar_max < 10) {
                    a_def_bar_max = 10;
                }else {
                    a_def_bar_max = Math.max.apply(null, a_def_bar_data)+5;
                }
                var a_def_bar_back_color = 'rgba(63, 66, 87, 0.8)';
                var a_def_line_back_color = 'rgba(255, 94, 55, 1)';
                var a_def_line_point_color = 'rgba(255, 94, 55, 1)';
                var a_def_line_border_color = 'rgba(255, 94, 55, 1)';


                var h_def_id2 = 'h_def_foul_ycard';
                var h_def_bar_data2 = [];
                var h_def_line_data2 = [];
                var h_def_date2 = [];
                for(var e=0; e<h_def_recent.length; e++) {
                    h_def_bar_data2[e] = h_def_recent[e].yellow_cards;
                    h_def_line_data2[e] = h_def_recent[e].fouls;
                    h_def_date2[e] = h_def_recent[e].division_day;
                }
                var h_def_line_max2 = Math.max.apply(null, h_def_line_data2);
                var h_def_bar_max2 = Math.max.apply(null, h_def_bar_data2);
                if(h_def_line_max2 < 10) {
                    h_def_line_max2 = 10;
                }else {
                    h_def_line_max2 = Math.max.apply(null, h_def_line_data2)+5;
                }
                if(h_def_bar_max2 < 10) {
                    h_def_bar_max2 = 10;
                }else {
                    h_def_bar_max2 = Math.max.apply(null, h_def_bar_data2)+5;
                }
                var h_def_bar_back_color2 = 'rgba(255, 212, 110, 1)';
                var h_def_line_back_color2 = 'rgba(141, 185, 69, 0.8)';
                var h_def_line_point_color2 = 'rgba(141, 185, 69, 0.8)';
                var h_def_line_border_color2 = 'rgba(141, 185, 69, 0.8)';

                var a_def_id2 = 'a_def_foul_ycard';
                var a_def_bar_data2 = [];
                var a_def_line_data2 = [];
                var a_def_date2 = [];
                var a_def_bar_back_color2 = 'rgba(255, 212, 110, 1)';
                var a_def_line_back_color2 = 'rgba(141, 185, 69, 0.8)';
                var a_def_line_point_color2 = 'rgba(141, 185, 69, 0.8)';
                var a_def_line_border_color2 = 'rgba(141, 185, 69, 0.8)';

                for(var f=0; f<a_def_recent.length; f++) {
                    a_def_bar_data2[f] = a_def_recent[f].yellow_cards;
                    a_def_line_data2[f] = a_def_recent[f].fouls;
                    a_def_date2[f] = a_def_recent[f].division_day;
                }
                var a_def_line_max2 = Math.max.apply(null, a_def_line_data2);
                var a_def_bar_max2 = Math.max.apply(null, a_def_bar_data2);
                if(a_def_line_max2 < 10) {
                    a_def_line_max2 = 10;
                }else {
                    a_def_line_max2 = Math.max.apply(null, a_def_line_data2)+5;
                }
                if(a_def_bar_max2 < 10) {
                    a_def_bar_max2 = 10;
                }else {
                    a_def_bar_max2 = Math.max.apply(null, a_def_bar_data2)+5;
                }

                var h_att_arr = [h_att_id,h_att_bar_data,h_att_line_data,h_att_date,h_att_line_max,h_att_bar_back_color,h_att_line_back_color,h_att_line_point_color,h_att_line_border_color,h_att_bar_max];
                var a_att_arr = [a_att_id,a_att_bar_data,a_att_line_data,a_att_date,a_att_line_max,a_att_bar_back_color,a_att_line_back_color,a_att_line_point_color,a_att_line_border_color,a_att_bar_max];
                var att_arr = [h_att_arr,a_att_arr];
                var h_def_one_arr = [h_def_id,h_def_bar_data,h_def_line_data,h_def_date,h_def_line_max,h_def_bar_back_color,h_def_line_back_color,h_def_line_point_color,h_def_line_border_color,h_def_bar_max];
                var a_def_one_arr = [a_def_id,a_def_bar_data,a_def_line_data,a_def_date,a_def_line_max,a_def_bar_back_color,a_def_line_back_color,a_def_line_point_color,a_def_line_border_color,a_def_bar_max];
                var def1_arr = [h_def_one_arr,a_def_one_arr];
                var h_def_two_arr = [h_def_id2,h_def_bar_data2,h_def_line_data2,h_def_date2,h_def_line_max2,h_def_bar_back_color2,h_def_line_back_color2,h_def_line_point_color2,h_def_line_border_color2,h_def_bar_max2];
                var a_def_two_arr = [a_def_id2,a_def_bar_data2,a_def_line_data2,a_def_date2,a_def_line_max2,a_def_bar_back_color2,a_def_line_back_color2,a_def_line_point_color2,a_def_line_border_color2,a_def_bar_max2];
                var def2_arr = [h_def_two_arr,a_def_two_arr];
                var total_arr = [att_arr, def1_arr, def2_arr];

                for(var i=0; i<total_arr.length; i++) {
                    var select_arr = total_arr[i];
                    for(var s=0; s<select_arr.length; s++) {
                        _Analysis.att_def_line_bar_graph(select_arr[s]);
                    }
                }

                /*****************  라인 라인 그래프 ******************************/
                var h_att_shoot_id = 'h_att_shoot_eshoot';
                var h_att_shoot_data = [];
                var h_att_eshoot_data = [];
                var h_att_shoot_date = [];
                var h_att_shoot_lineColor = 'rgba(81,125,201,1)';
                var h_att_eshoot_lineColor = 'rgba(255,156,49,1)';

                for(var v=0; v<h_att_recent.length; v++){
                    h_att_shoot_data[v] = h_att_recent[v].shots;
                    h_att_eshoot_data[v] = h_att_recent[v].shots_on_goal;
                    h_att_shoot_date[v] = h_att_recent[v].division_day;
                }
                var h_att_shoot_max = Math.max.apply(null, h_att_shoot_data);
                var h_att_eshoot_max = Math.max.apply(null, h_att_eshoot_data);
                var h_att_sh_esh_max = '';
                var h_att_default_shoot_max = 10;
                if(h_att_shoot_max > h_att_eshoot_max){
                    h_att_sh_esh_max = h_att_shoot_max;
                }else if(h_att_shoot_max < h_att_eshoot_max) {
                    h_att_sh_esh_max = h_att_eshoot_max;
                }
                if(h_att_sh_esh_max < h_att_default_shoot_max){
                    h_att_sh_esh_max = h_att_default_shoot_max;
                }else if(h_att_sh_esh_max > h_att_default_shoot_max){
                    h_att_sh_esh_max = _Fn.analysis_graph_yaxes_max(h_att_sh_esh_max);
                }

                var a_att_shoot_id = 'a_att_shoot_eshoot';
                var a_att_shoot_data = [];
                var a_att_eshoot_data = [];
                var a_att_shoot_date = [];
                var a_att_shoot_lineColor = 'rgba(81,125,201,1)';
                var a_att_eshoot_lineColor = 'rgba(255,156,49,1)';
                for(var  b=0; b<a_att_recent.length; b++){
                    a_att_shoot_data[b] = a_att_recent[b].shots;
                    a_att_eshoot_data[b] = a_att_recent[b].shots_on_goal;
                    a_att_shoot_date[b] = a_att_recent[b].division_day;
                }
                var a_att_shoot_max = Math.max.apply(null, a_att_shoot_data);
                var a_att_eshoot_max = Math.max.apply(null, a_att_eshoot_data);
                var a_att_sh_esh_max = '';
                var a_att_default_shoot_max = 10;
                if(a_att_shoot_max > a_att_eshoot_max){
                    a_att_sh_esh_max = a_att_shoot_max;
                }else if(a_att_shoot_max < a_att_eshoot_max) {
                    a_att_sh_esh_max = a_att_eshoot_max;
                }
                if(a_att_sh_esh_max < a_att_default_shoot_max){
                    a_att_sh_esh_max = a_att_default_shoot_max;
                }else if(a_att_sh_esh_max > a_att_default_shoot_max){
                    a_att_sh_esh_max = _Fn.analysis_graph_yaxes_max(a_att_sh_esh_max);
                }


                var h_att_free_id = 'h_att_free_corner';
                var h_att_free_data = [];
                var h_att_corner_data = [];
                var h_att_free_date = [];
                var h_att_free_lineColor = 'rgba(255,0,0,1)';
                var h_att_corner_lineColor = 'rgba(35,177,228,1)';
                for(var t=0; t<h_att_recent.length; t++){
                    h_att_free_data[t] = h_att_recent[t].free_kicks;
                    h_att_corner_data[t] = h_att_recent[t].corner_kicks;
                    h_att_free_date[t] = h_att_recent[t].division_day;
                }
                var h_att_free_max = Math.max.apply(null, h_att_free_data);
                var h_att_corner_max = Math.max.apply(null, h_att_corner_data);
                var h_att_fr_cor_max = '';
                var h_att_default_free_max = 10;
                if(h_att_free_max > h_att_corner_max){
                    h_att_fr_cor_max = h_att_free_max;
                }else if(h_att_free_max < h_att_corner_max) {
                    h_att_fr_cor_max = h_att_corner_max;
                }
                if(h_att_fr_cor_max < h_att_default_free_max){
                    h_att_fr_cor_max = h_att_default_free_max;
                }else if(h_att_fr_cor_max > h_att_default_free_max){
                    h_att_fr_cor_max = _Fn.analysis_graph_yaxes_max(h_att_fr_cor_max);
                }

                var a_att_free_id = 'a_att_free_corner';
                var a_att_free_data = [];
                var a_att_corner_data = [];
                var a_att_free_date = [];
                var a_att_free_lineColor = 'rgba(255,0,0,1)';
                var a_att_corner_lineColor = 'rgba(35,177,228,1)';
                for(var k=0; k<a_att_recent.length; k++){
                    a_att_free_data[k] = a_att_recent[k].free_kicks;
                    a_att_corner_data[k] = a_att_recent[k].corner_kicks;
                    a_att_free_date[k] = a_att_recent[k].division_day;
                }
                var a_att_free_max = Math.max.apply(null, a_att_free_data);
                var a_att_corner_max = Math.max.apply(null, a_att_corner_data);
                var a_att_fr_cor_max = '';
                var a_att_default_free_max = 10;
                if(a_att_free_max > a_att_corner_max){
                    a_att_fr_cor_max = a_att_free_max;
                }else if(a_att_free_max < a_att_corner_max) {
                    a_att_fr_cor_max = a_att_corner_max;
                }
                if(a_att_fr_cor_max < a_att_default_free_max){
                    a_att_fr_cor_max = a_att_default_free_max;
                }else if(a_att_fr_cor_max > a_att_default_free_max){
                    a_att_fr_cor_max = _Fn.analysis_graph_yaxes_max(a_att_fr_cor_max);
                }

                var h_def_shoot_id = 'h_def_shoot_eshoot';
                var h_def_shoot_data = [];
                var h_def_eshoot_data = [];
                var h_def_shoot_date = [];
                var h_def_shoot_lineColor = 'rgba(81,125,201,1)';
                var h_def_eshoot_lineColor = 'rgba(255,156,49,1)';
                for(var  y=0; y<h_att_recent.length; y++){
                    h_def_shoot_data[y] = h_def_recent[y].shots;
                    h_def_eshoot_data[y] = h_def_recent[y].shots_on_goal;
                    h_def_shoot_date[y] = h_def_recent[y].division_day;
                }
                var h_def_shoot_max = Math.max.apply(null, h_def_shoot_data);
                var h_def_eshoot_max = Math.max.apply(null, h_def_eshoot_data);
                var h_def_sh_esh_max = '';
                var h_def_default_shoot_max = 10;
                if(h_def_shoot_max > h_def_eshoot_max){
                    h_def_sh_esh_max = h_def_shoot_max;
                }else if(h_def_shoot_max < h_def_eshoot_max) {
                    h_def_sh_esh_max = h_def_eshoot_max;
                }
                if(h_def_sh_esh_max < h_def_default_shoot_max){
                    h_def_sh_esh_max = h_def_default_shoot_max;
                }else if(h_def_sh_esh_max > h_def_default_shoot_max){
                    h_def_sh_esh_max = _Fn.analysis_graph_yaxes_max(h_def_sh_esh_max);
                }

                var a_def_shoot_id = 'a_def_shoot_eshoot';
                var a_def_shoot_data = [];
                var a_def_eshoot_data = [];
                var a_def_shoot_date = [];
                var a_def_shoot_lineColor = 'rgba(81,125,201,1)';
                var a_def_eshoot_lineColor = 'rgba(255,156,49,1)';
                for(var  u=0; u<a_def_recent.length; u++){
                    a_def_shoot_data[u] = a_def_recent[u].shots;
                    a_def_eshoot_data[u] = a_def_recent[u].shots_on_goal;
                    a_def_shoot_date[u] = a_def_recent[u].division_day;
                }
                var a_def_shoot_max = Math.max.apply(null, a_def_shoot_data);
                var a_def_eshoot_max = Math.max.apply(null, a_def_eshoot_data);
                var a_def_sh_esh_max = '';
                var a_def_default_shoot_max = 10;
                if(a_def_shoot_max > a_def_eshoot_max){
                    a_def_sh_esh_max = a_def_shoot_max;
                }else if(a_def_shoot_max < a_def_eshoot_max) {
                    a_def_sh_esh_max = a_def_eshoot_max;
                }
                if(a_def_sh_esh_max < a_def_default_shoot_max){
                    a_def_sh_esh_max = a_def_default_shoot_max;
                }else if(a_def_sh_esh_max > a_def_default_shoot_max){
                    a_def_sh_esh_max = _Fn.analysis_graph_yaxes_max(a_def_sh_esh_max);
                }

                var h_def_free_id = 'h_def_free_corner';
                var h_def_free_data = [];
                var h_def_corner_data = [];
                var h_def_free_date = [];
                var h_def_free_lineColor = 'rgba(255,0,0,1)';
                var h_def_corner_lineColor = 'rgba(35,177,228,1)';
                for(var d=0; d<h_def_recent.length; d++){
                    h_def_free_data[d] = h_def_recent[d].free_kicks;
                    h_def_corner_data[d] = h_def_recent[d].corner_kicks;
                    h_def_free_date[d] = h_def_recent[d].division_day;
                }
                var h_def_free_max = Math.max.apply(null, h_def_free_data);
                var h_def_corner_max = Math.max.apply(null, h_def_corner_data);
                var h_def_fr_cor_max = '';
                var h_def_default_free_max = 10;
                if(h_def_free_max > h_def_corner_max){
                    h_def_fr_cor_max = h_def_free_max;
                }else if(h_def_free_max < h_def_corner_max) {
                    h_def_fr_cor_max = h_def_corner_max;
                }
                if(h_def_fr_cor_max < h_def_default_free_max){
                    h_def_fr_cor_max = h_def_default_free_max;
                }else if(h_def_fr_cor_max > h_def_default_free_max){
                    h_def_fr_cor_max = _Fn.analysis_graph_yaxes_max(h_def_fr_cor_max);
                }

                var a_def_free_id = 'a_def_free_corner';
                var a_def_free_data = [];
                var a_def_corner_data = [];
                var a_def_free_date = [];
                var a_def_free_lineColor = 'rgba(255,0,0,1)';
                var a_def_corner_lineColor = 'rgba(35,177,228,1)';
                for(var j=0; j<a_def_recent.length; j++){
                    a_def_free_data[j] = a_def_recent[j].free_kicks;
                    a_def_corner_data[j] = a_def_recent[j].corner_kicks;
                    a_def_free_date[j] = a_def_recent[j].division_day;
                }
                var a_def_free_max = Math.max.apply(null, a_def_free_data);
                var a_def_corner_max = Math.max.apply(null, a_def_corner_data);
                var a_def_fr_cor_max = '';
                var a_def_default_free_max = 10;
                if(a_def_free_max > a_def_corner_max){
                    a_def_fr_cor_max = a_def_free_max;
                }else if(a_def_free_max < a_def_corner_max) {
                    a_def_fr_cor_max = a_def_corner_max;
                }
                if(a_def_fr_cor_max < a_def_default_free_max){
                    a_def_fr_cor_max = a_def_default_free_max;
                }else if(a_def_fr_cor_max > a_def_default_free_max){
                    a_def_fr_cor_max = _Fn.analysis_graph_yaxes_max(a_def_fr_cor_max);
                    // if(a_def_fr_cor_max < 15) {
                    //     a_def_fr_cor_max = 15;
                    // }else if(a_def_fr_cor_max > 15 && a_def_fr_cor_max < 20) {
                    //     a_def_fr_cor_max = 20;
                    // }else if(a_def_fr_cor_max > 20 && a_def_fr_cor_max < 25) {
                    //     a_def_fr_cor_max = 25;
                    // }else if(a_def_fr_cor_max > 25 && a_def_fr_cor_max < 30) {
                    //     a_def_fr_cor_max = 30;
                    // }
                }

                var h_att_shoot_arr = [h_att_shoot_id,h_att_shoot_data,h_att_eshoot_data,h_att_shoot_date,h_att_shoot_lineColor,h_att_eshoot_lineColor,h_att_sh_esh_max],
                    a_arr_shoot_arr = [a_att_shoot_id,a_att_shoot_data,a_att_eshoot_data,a_att_shoot_date,a_att_shoot_lineColor,a_att_eshoot_lineColor,a_att_sh_esh_max],
                    att_shoot_arr = [h_att_shoot_arr,a_arr_shoot_arr],
                    h_att_free_arr = [h_att_free_id,h_att_free_data,h_att_corner_data,h_att_free_date,h_att_free_lineColor,h_att_corner_lineColor,h_att_fr_cor_max],
                    a_att_free_arr = [a_att_free_id,a_att_free_data,a_att_corner_data,a_att_free_date,a_att_free_lineColor,a_att_corner_lineColor,a_att_fr_cor_max],
                    att_free_arr = [h_att_free_arr, a_att_free_arr],
                    h_def_shoot_arr = [h_def_shoot_id,h_def_shoot_data,h_def_eshoot_data,h_def_shoot_date,h_def_shoot_lineColor,h_def_eshoot_lineColor,h_def_sh_esh_max],
                    a_def_shoot_arr = [a_def_shoot_id,a_def_shoot_data,a_def_eshoot_data,a_def_shoot_date,a_def_shoot_lineColor,a_def_eshoot_lineColor,a_def_sh_esh_max],
                    def_shoot_arr = [h_def_shoot_arr,a_def_shoot_arr],
                    h_def_free_arr = [h_def_free_id,h_def_free_data,h_def_corner_data,h_def_free_date,h_def_free_lineColor,h_def_corner_lineColor,h_def_fr_cor_max],
                    a_def_free_arr = [a_def_free_id,a_def_free_data,a_def_corner_data,a_def_free_date,a_def_free_lineColor,a_def_corner_lineColor,a_def_fr_cor_max],
                    def_free_arr = [h_def_free_arr, a_def_free_arr],
                    line_total_arr = [att_shoot_arr,att_free_arr,def_shoot_arr,def_free_arr];

                for(var n=0; n<line_total_arr.length; n++) {
                    var click_arr = line_total_arr[n];
                    for(var v=0; v<click_arr.length; v++) {
                        _Analysis.att_def_line_line_graph(click_arr[v]);
                    }
                }
            },
            latest_graph: function (arr) {
                var ctx = document.getElementById(arr[0]).getContext('2d');
                var customTooltips = function (tooltip) {
                    // Tooltip Element
                    var tooltipEl = document.getElementById(arr[10]);

                    // Hide if no tooltip
                    if (tooltip.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }
                    console.log(tooltip);
                    console.log(tooltipEl.id);
                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltip.yAlign) {
                        tooltipEl.classList.add(tooltip.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }
                    // 주소 잡아서 텍스트 변경 하는 조건식
                    var point_index = tooltip.dataPoints[0].index,
                        select_id = '',
                        tooltip_html = '',
                        select_val = '',
                        league_name_val = '',
                        content_length = '',
                        main_team_name = '';
                    if (tooltip.dataPoints.length) {

                        if(arr[0] == 'h_latest'){select_id = 'home_latest'}else{select_id = 'away_latest'};

                        if(tooltipEl.id  == 'h_chartjs-tooltip'){
                            select_val = $('#home_latest #latest_game').val();
                            league_name_val = $('#home_latest #game_league').val();
                            main_team_name = $('#analysis_title .team_info .home_info').data('home_idx');
                        }else{
                            select_val = $('#away_latest #latest_game').val();
                            league_name_val = $('#away_latest #game_league').val();
                            main_team_name = $('#analysis_title .team_info .away_info').data('away_idx');
                        }
                        if(select_val != 0 || league_name_val != 0){
                            content_length = $('#'+select_id+' .game_content').children().not('.nonDisplay').length;
                        }else{
                            content_length = $('#'+select_id+' .game_content').children().length;
                        }

                        /************************************* 조건별 node_num 잡아줘야됨 ***************************************/

                        var node_num = content_length - point_index,
                            //main_adr = $('#'+select_id+' .game_content div:nth-child('+node_num+')'),
                            main_adr = $('#'+select_id+' .game_content').children().not('.nonDisplay').eq(node_num-1),
                            game_time = main_adr.find('div:nth-child(3) span').text(),
                            home_name = main_adr.find('div:nth-child(5)').text(),
                            away_name = main_adr.find('div:nth-child(7)').text(),
                            home_score = main_adr.find('div:nth-child(6) span:nth-child(1)').text(),
                            away_score = main_adr.find('div:nth-child(6) span:nth-child(2)').text(),
                            home_img = main_adr.find('div:nth-child(5) img').attr('src'),
                            away_img = main_adr.find('div:nth-child(7) img').attr('src');

                        console.log(main_adr);
                        tooltip_html += '<div class="tooltip_box">';
                        tooltip_html += '<div>'+game_time+'</div>';
                        tooltip_html += '<div>';
                        tooltip_html += '<div><span id="tooltip_home">' + home_name + '</span><img src="' + home_img + '"></div>';
                        if(home_score > away_score){
                            tooltip_html += '<div><span class="game_win">'+home_score+'</span> : <span>'+away_score+'</span></div>';
                        }else if(home_score < away_score) {
                            tooltip_html += '<div><span>'+home_score+'</span> : <span class="game_win">'+away_score+'</span></div>';
                        }else if(home_score == away_score) {
                            tooltip_html += '<div><span>'+home_score+'</span> : <span>'+away_score+'</span></div>';
                        }
                        tooltip_html += '<div><img src="' + away_img + '"><span>' + away_name + '</span></div>';
                        tooltip_html += '</div>';
                        tooltip_html += '</div>';


                        $('#'+arr[0]+' ').siblings('div').empty().append(tooltip_html);
                        // console.log(ind);
                        // console.log(data.data);
                        // $("#spn-leads").text(data.data[ind]);
                        // $("#spn-meetings").text(data.meetings[ind]);
                        // $("#spn-mails").text(data.mails[ind]);
                        // $("#spn-rate").text(data.rate[ind]);
                    }

                    var positionY = this._chart.canvas.offsetTop;
                    var positionX = this._chart.canvas.offsetLeft;
                    var select_index = tooltip.dataPoints[0].index;

                    tooltipEl.style.opacity = 1;

                    console.log(content_length);
                    console.log(select_index);
                    if (select_index == 0) {
                        tooltipEl.style.left = (positionX + 100) + tooltip.caretX + 'px';
                    } else if (select_index == (content_length-1)) {
                        tooltipEl.style.left = (positionX - 100) + tooltip.caretX + 'px';
                    } else {
                        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    }
                    // if(select_val == 1) {
                    //     if (select_index == 0) {
                    //         tooltipEl.style.left = (positionX + 70) + tooltip.caretX + 'px';
                    //     } else if (select_index == 5) {
                    //         tooltipEl.style.left = (positionX - 100) + tooltip.caretX + 'px';
                    //     } else {
                    //         tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    //     }
                    // }else if(select_val == 2) {
                    //     if (select_index == 0) {
                    //         tooltipEl.style.left = (positionX + 70) + tooltip.caretX + 'px';
                    //     } else if (select_index == 9) {
                    //         tooltipEl.style.left = (positionX - 100) + tooltip.caretX + 'px';
                    //     } else {
                    //         tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    //     }
                    // }else if(select_val == 3){
                    //     if (select_index == 0) {
                    //         tooltipEl.style.left = (positionX + 70) + tooltip.caretX + 'px';
                    //     } else if (select_index == 14) {
                    //         tooltipEl.style.left = (positionX - 100) + tooltip.caretX + 'px';
                    //     } else {
                    //         tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    //     }
                    // }else if(select_val == 4){
                    //     if (select_index == 0) {
                    //         tooltipEl.style.left = (positionX + 70) + tooltip.caretX + 'px';
                    //     } else if (select_index == 19) {
                    //         tooltipEl.style.left = (positionX - 100) + tooltip.caretX + 'px';
                    //     } else {
                    //         tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                    //     }
                    // }
                    tooltipEl.style.top = positionY + (tooltip.caretY - 100) + 'px';
                    tooltipEl.style.fontFamily = tooltip._fontFamily;
                    tooltipEl.style.fontSize = tooltip.fontSize;
                    tooltipEl.style.fontStyle = tooltip._fontStyle;
                    tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
                };
                var label_data = [],
                    goal_data = [],
                    lose_data = [];
                for(var b=0; b<arr[1].length; b++){
                    label_data[b] = arr[1][b];
                    goal_data[b] = arr[5][b];
                    lose_data[b] = arr[9][b];
                }
                var config = {
                    type: 'line',
                    data: {
                        labels: label_data,
                        datasets: [{
                            label: '득점',
                            backgroundColor: arr[2],
                            borderColor: arr[3],
                            pointStyle: 'circle',
                            pointBackgroundColor: arr[4],
                            pointBorderColor: arr[4],
                            pointBorderWidth: 1,
                            pointHitRadius: 1,
                            pointHoverBorderWidth: 6,
                            pointHoverBorderColor: 'rgba(63, 66, 87, 0.16)',
                            pointHoverRadius: 3,
                            borderWidth: 1,
                            //pointDotRadius : 5, // 포인트 크기
                            fill: false,
                            data: goal_data,
                        }, {
                            label: '실점',
                            backgroundColor: arr[6],
                            borderColor: arr[7],
                            pointStyle: 'circle',
                            pointBackgroundColor: arr[8],
                            pointBorderColor: arr[8],
                            pointBorderWidth: 1,
                            pointHitRadius: 1,
                            pointHoverBorderWidth: 6,
                            pointHoverBorderColor: 'rgba(63, 66, 87, 0.16)',
                            pointHoverRadius: 3,
                            borderWidth: 1,
                            //pointDotRadius : 5, // 포인트 크기
                            fill: true,
                            data: lose_data,
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            fontColor: 'rgba(34, 34, 34, 1)',
                            fontSize: 12,
                            fontFamily: 'Nanum Gothic',
                            text: ' ',
                            position: 'top'
                        },
                        legend: {
                            display: false,
                            fontColor : 'rgba(154, 159, 191, 1)',
                            fontSize : 12,
                            fontFamily: 'Nanum Gothic',
                            position: 'top'
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    stepSize : 1,
                                    fontColor : "rgba(154, 159, 191, 1)",
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                    padding: 20,
                                },
                                gridLines:{
                                    color: 'rgba(248, 248, 248, 1)',
                                    lineWidth:1
                                }
                            }],
                            xAxes: [{
                                ticks:{
                                    fontColor : 'rgba(154, 159, 191, 1)',
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                    padding: 10
                                },
                                gridLines:{
                                    color: "rgba(248, 248, 248, 1)",
                                    lineWidth: 1
                                }
                            }]
                        },
                        tooltips: {
                            enabled: false,
                            mode: 'index',
                            position: 'nearest',
                            custom: customTooltips
                        },
                        onHover: function(evt) {
                            var this_canvas = $(this)[0].ctx.canvas;
                            Chart.plugins.register({
                                afterDatasetsDraw: function(this_canvas) {
                                    //console.log(this_canvas);
                                    //var item = l_chart_h.getElementAtEvent(evt);
                                    var canvas_id = this_canvas.ctx.canvas.id;
                                    if(canvas_id === 'h_latest') {
                                        var item = l_chart_h.getElementAtEvent(evt);
                                    }else {
                                        var item = l_chart_a.getElementAtEvent(evt);
                                    }
                                    if (item.length > 0) {
                                        var canvas_id2 = this_canvas.ctx.canvas.id;
                                        if(canvas_id2 === 'h_latest'){
                                            var chart = l_chart_h;
                                        }else {
                                            var chart = l_chart_a;
                                        }
                                        var ctx = chart.ctx;
                                        evt.target.style.cursor = 'pointer';
                                        chart.data.datasets.forEach(function (dataset, i) {
                                            var meta = chart.getDatasetMeta(i);
                                            if (!meta.hidden) {
                                                meta.data.forEach(function (element, index) {
                                                    ctx.fillStyle = 'rgb(255,255,255)';
                                                    var fontSize = 11;
                                                    var fontStyle = 'normal';
                                                    var fontFamily = 'Tahoma';
                                                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);


                                                    // meta.data[index]._chart.data.datasets[0].pointBorderWidth = 10;
                                                    // meta.data[index]._chart.data.datasets[1].pointBorderWidth = 10;
                                                    // meta.data[index]._chart.data.datasets[0].pointBackgroundColor = 'rgb(0,0,0)';
                                                    // meta.data[index]._chart.data.datasets[1].pointBackgroundColor = 'rgb(0,0,0)';

                                                    // Just naively convert to string for now
                                                    var dataString = dataset.data[index].toString();
                                                    // Make sure alignment settings are correct
                                                    ctx.textAlign = 'center';
                                                    //ctx.textBaseline = 'middle';
                                                    ctx.textBaseline = 'bottom';
                                                    var padding = 1;
                                                    var position = element.tooltipPosition();
                                                    var first_data = chart.data.datasets[0].data;
                                                    var second_data = chart.data.datasets[1].data;
                                                    var loop_data = '';
                                                    if (i == 0) {
                                                        if (first_data[index] > second_data[index]) {
                                                            loop_data = first_data[index];
                                                        }
                                                    } else {
                                                        if (second_data[index] > first_data[index]) {
                                                            loop_data = second_data[index];
                                                        }
                                                    }
                                                    if (loop_data == dataString) {
                                                        ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 3);
                                                        //ctx.clearRect(position.x, position.y-(fontSize / 2) - padding + 3, 14, 14);
                                                    } else {
                                                        ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 25);
                                                        //ctx.clearRect(position.x, position.y-(fontSize / 2) - padding + 25, 14, 14);
                                                    }

                                                });
                                            }
                                        });
                                        tooltip_type = 2;
                                    }else {
                                        if(tooltip_type == 2) {
                                            var canvas_id2 = this_canvas.ctx.canvas.id;
                                            if(canvas_id2 === 'h_latest'){
                                                var chart = l_chart_h;
                                            }else {
                                                var chart = l_chart_a;
                                            }
                                            var ctx = chart.ctx;
                                            evt.target.style.cursor = 'default';
                                            chart.data.datasets.forEach(function (dataset, i) {
                                                var meta = chart.getDatasetMeta(i);
                                                if (!meta.hidden) {
                                                    meta.data.forEach(function (element, index) {
                                                        if (i === 0) {
                                                            ctx.fillStyle = 'rgb(81, 125, 201)';
                                                        } else {
                                                            ctx.fillStyle = 'rgb(255,78,100)';
                                                        }

                                                        var fontSize = 11;
                                                        var fontStyle = 'normal';
                                                        var fontFamily = 'Tahoma';
                                                        ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                                                        // Just naively convert to string for now
                                                        var dataString = dataset.data[index].toString();
                                                        // Make sure alignment settings are correct
                                                        ctx.textAlign = 'center';
                                                        //ctx.textBaseline = 'middle';
                                                        ctx.textBaseline = 'bottom';
                                                        var padding = 1;
                                                        var position = element.tooltipPosition();
                                                        var first_data = chart.data.datasets[0].data;
                                                        var second_data = chart.data.datasets[1].data;
                                                        var loop_data = '';
                                                        if (i == 0) {
                                                            if (first_data[index] > second_data[index]) {
                                                                loop_data = first_data[index];
                                                            }
                                                        } else {
                                                            if (second_data[index] > first_data[index]) {
                                                                loop_data = second_data[index];
                                                            }
                                                        }
                                                        if (loop_data == dataString) {
                                                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 3);
                                                        } else {
                                                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 25);
                                                        }

                                                    });
                                                }
                                            });
                                        }
                                        tooltip_type = 1;
                                    }
                                }
                            });
                        }
                    }
                };
                if(arr[0] == 'h_latest') {
                    l_chart_h = new Chart(ctx, config);
                }else {
                    l_chart_a = new Chart(ctx, config);
                }
                Chart.plugins.register({
                    afterDatasetsDraw: function(chart) {
                        var ctx = chart.ctx;
                        chart.data.datasets.forEach(function(dataset, i) {
                            var meta = chart.getDatasetMeta(i);
                            if (!meta.hidden) {
                                meta.data.forEach(function(element, index) {
                                    // Draw the text in black, with the specified font
                                    if(i === 0){
                                        if(dataset.type == "bar"){
                                            if(ctx.canvas.id == 'h_def_foul_ycard' || ctx.canvas.id == 'a_def_foul_ycard'){
                                                ctx.fillStyle = 'rgb(255,212,110)';
                                            }else {
                                                ctx.fillStyle = 'rgb(101,104,121)';
                                            }
                                        }else {
                                            //if((ctx.canvas.id == 'h_def_shoot_eshoot' || ctx.canvas.id == 'a_def_shoot_eshoot') || (ctx.canvas.id == 'h_att_shoot_eshoot' || ctx.canvas.id == 'a_att_shoot_eshoot')) {
                                            if((ctx.canvas.id == 'h_def_shoot_eshoot' || ctx.canvas.id == 'a_def_shoot_eshoot') || (ctx.canvas.id == 'h_att_shoot_eshoot' || ctx.canvas.id == 'a_att_shoot_eshoot')) {
                                                ctx.fillStyle = 'rgb(81,125,201)';
                                            }else if((ctx.canvas.id == 'h_def_free_corner' || ctx.canvas.id == 'a_def_free_corner') || (ctx.canvas.id == 'h_att_free_corner' || ctx.canvas.id == 'a_att_free_corner')){
                                                ctx.fillStyle = 'rgb(255,94,55)';
                                            }else {
                                                //if(ctx.canvas.id !== 'h_formation_pie' || ctx.canvas.id !== 'a_formation_pie')
                                                ctx.fillStyle = 'rgb(81, 125, 201)';
                                            }
                                        }
                                    }else {
                                        if(ctx.canvas.id == 'h_def_foul_ycard' || ctx.canvas.id == 'a_def_foul_ycard'){
                                            ctx.fillStyle = 'rgb(141,185,69)';
                                        }else if((ctx.canvas.id == 'h_def_shoot_eshoot' || ctx.canvas.id == 'a_def_shoot_eshoot') || (ctx.canvas.id == 'h_att_shoot_eshoot' || ctx.canvas.id == 'a_att_shoot_eshoot')) {
                                            ctx.fillStyle = 'rgb(255,156,49)';
                                        }else if((ctx.canvas.id == 'h_def_free_corner' || ctx.canvas.id == 'a_def_free_corner') || (ctx.canvas.id == 'h_att_free_corner' || ctx.canvas.id == 'a_att_free_corner')){
                                            ctx.fillStyle = 'rgb(35,177,228)';
                                        }else {
                                            ctx.fillStyle = 'rgb(255,94,55)';
                                        }
                                    }
                                    // ctx.fillStyle = 'rgb(0, 0, 0)';

                                    var fontSize = 11;
                                    var fontStyle = 'normal';
                                    var fontFamily = 'Tahoma';
                                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                                    // // Just naively convert to string for now
                                    // var dataString = dataset.data[index].toString();
                                    // Make sure alignment settings are correct
                                    ctx.textAlign = 'center';
                                    //ctx.textBaseline = 'middle';
                                    ctx.textBaseline = 'bottom';

                                    // 차트 위 값 표시
                                    if(ctx.canvas.id === 'h_keeper_e_shoot' || ctx.canvas.id === 'a_keeper_e_shoot' || ctx.canvas.id === 'h_keeper_defense' || ctx.canvas.id === 'a_keeper_defense' || ctx.canvas.id === 'h_defense_rate' || ctx.canvas.id === 'a_defense_rate' || ctx.canvas.id === 'h_formation_pie' || ctx.canvas.id === 'a_formation_pie') {
                                        var padding = 1;
                                        var position = element.tooltipPosition();
                                        var first_data = chart.data.datasets[0].data;
                                        if(ctx.canvas.id === 'h_keeper_e_shoot' || ctx.canvas.id === 'a_keeper_e_shoot') {
                                            // Just naively convert to string for now
                                            var dataString = dataset.data[index].toString();
                                            ctx.fillStyle = 'rgba(63, 66, 87, 1)';
                                        }else if(ctx.canvas.id === 'h_keeper_defense' || ctx.canvas.id === 'a_keeper_defense') {
                                            // Just naively convert to string for now
                                            var dataString = dataset.data[index].toString();
                                            ctx.fillStyle = 'rgba(35, 177, 228, 1)';
                                        }else if(ctx.canvas.id === 'h_defense_rate' || ctx.canvas.id === 'a_defense_rate') {
                                            // Just naively convert to string for now
                                            var dataString = dataset.data[index].toString()+'%';
                                            ctx.fillStyle = 'rgba(255, 156, 49, 1)';
                                        }

                                        if (first_data == dataString) {
                                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 3);
                                        } else {
                                            if (dataset.type == "bar") {
                                                ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 5);
                                            } else {
                                                if (ctx.canvas.id == 'h_latest' || ctx.canvas.id == 'a_latest') {
                                                    ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 25);
                                                } else {
                                                    console.log(ctx);
                                                    if(meta.type !== 'pie') {
                                                        ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 3);
                                                    }
                                                }
                                            }
                                        }
                                    }else{
                                        // Just naively convert to string for now
                                        var dataString = dataset.data[index].toString();

                                        var padding = 1;
                                        var position = element.tooltipPosition();
                                        var first_data = chart.data.datasets[0].data;
                                        var second_data = chart.data.datasets[1].data;
                                        var loop_data = '';
                                        if (i == 0) {
                                            if (first_data[index] > second_data[index]) {
                                                loop_data = first_data[index];
                                            }
                                        } else {
                                            if (second_data[index] > first_data[index]) {
                                                loop_data = second_data[index];
                                            }
                                        }
                                        if (loop_data == dataString) {
                                            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 3);
                                        } else {
                                            if (dataset.type == "bar") {
                                                ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 5);
                                            } else {
                                                if (ctx.canvas.id == 'h_latest' || ctx.canvas.id == 'a_latest') {
                                                    ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 25);
                                                } else {
                                                    ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding + 3);
                                                }
                                            }
                                        }
                                    }
                                });
                            }

                        });
                    }
                });
            },
            att_def_line_bar_graph: function (arr) {
                var ctx = document.getElementById(arr[0]).getContext('2d');
                var config = {
                    type: 'bar',
                    data: {
                        //labels: ['10-19','10-22','10-31','11-12','11-18'],
                        datasets: [{
                            type: 'bar',
                            labels:'date',
                            data: [arr[1][0],arr[1][1],arr[1][2],arr[1][3],arr[1][4]],
                            fill: false,
                            backgroundColor: arr[5],
                            yAxisID: 'y-axis-1'
                        },{
                            type:'line',
                            labels: 'goal',
                            data: [arr[2][0],arr[2][1],arr[2][2],arr[2][3],arr[2][4]],
                            fill: false,
                            backgroundColor: arr[6],
                            pointBackgroundColor: arr[7],
                            pointHoverRadius: 3,
                            borderColor: arr[8],
                            borderWidth: 1,
                            fontSize : 11,
                            fontFamily: 'Tahoma',
                            yAxisID: 'y-axis-2',
                            lineTension: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            enabled: false
                        },
                        legend: {
                            display: false
                        },
                        elements: {
                            line: {
                                fill:false
                            }
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                gridLines: {
                                    display: false
                                },
                                labels: [arr[3][0],arr[3][1],arr[3][2],arr[3][3],arr[3][4]],
                                ticks: {
                                    fontColor : 'rgb(154,159,191)',
                                    fontSize : 11,
                                    fontFamily: 'Tahoma'
                                }
                            }],
                            yAxes: [{
                                type: 'linear',
                                display: true,
                                position: 'left',
                                id: 'y-axis-1',
                                gridLines: {
                                    display: true,
                                    color: "rgb(248,248,248)",
                                    lineWidth: 1
                                },
                                labels: {
                                    show:true,
                                },
                                ticks: {
                                    min: 0,
                                    max: arr[9],
                                    fontColor : 'rgb(154,159,191)',
                                    fontSize : 11,
                                    fontFamily: 'Tahoma'
                                }
                            }, {
                                type: "linear",
                                display: false,
                                position: "right",
                                id: "y-axis-2",
                                gridLines:{
                                    display: false
                                },
                                labels: {
                                    show:false,
                                },
                                ticks: {
                                    min: 0,
                                    max: arr[4],
                                }
                            }]
                        }
                    }
                };
                var a_d_chart = new Chart(ctx, config);
            },
            att_def_line_line_graph: function (arr) {
                var ctx = document.getElementById(arr[0]).getContext('2d');
                var config ={
                    type: 'line',
                    data: {
                        labels: [arr[3][0],arr[3][1],arr[3][2],arr[3][3],arr[3][4]],
                        datasets: [{
                            label: 'first_data',
                            data: [arr[1][0],arr[1][1],arr[1][2],arr[1][3],arr[1][4]],
                            fill: false,
                            backgroundColor: arr[4],
                            pointBackgroundColor: arr[4],
                            borderColor: arr[4],
                            pointHoverRadius: 3,
                            borderWidth: 1,
                            fontSize : 11,
                            fontFamily: 'Tahoma',
                            lineTension: 0
                        },{
                            label: 'second_data',
                            data: [arr[2][0],arr[2][1],arr[2][2],arr[2][3],arr[2][4]],
                            fill: false,
                            backgroundColor: arr[5],
                            pointBackgroundColor: arr[5],
                            borderColor: arr[5],
                            pointHoverRadius: 3,
                            borderWidth: 1,
                            fontSize : 11,
                            fontFamily: 'Tahoma',
                            lineTension: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        tooltips: {
                            enabled: false
                        },
                        legend: {
                            display: false
                        },
                        elements: {
                            line: {
                                fill: false
                            }
                        },
                        // title: {
                        //     display: false
                        // },
                        title: {
                            display: true,
                            fontColor: 'rgba(34, 34, 34, 1)',
                            fontSize: 1,
                            fontFamily: 'Nanum Gothic',
                            text: ' ',
                            position: 'top'
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    fontColor : 'rgb(154,159,191)',
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                }
                            }],
                            yAxes: [{
                                gridLines: {
                                    display: true,
                                    color: 'rgb(248,248,248)',
                                    lineWidth: 1
                                },
                                ticks: {
                                    min: 0,
                                    max: arr[6],
                                    stepSize: 5,
                                    fontColor : 'rgb(154,159,191)',
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                    padding: 20
                                }
                            }]
                        }
                    }
                }
                var a_d_line_line_chart = new Chart(ctx, config);
            },
            analysis_page_html: function(json_data) {
                var html = '',
                    data = json_data,
                    title_data = data.header,
                    power_data = data.power_analysis,
                    recent_data = data.recent_matchs,
                    score_data = data.score_division,
                    opp_data = data.opponent_record,
                    att_data = data.attack_analysis,
                    def_data = data.defense_analysis,
                    home_c = '#517dc9',
                    away_c = '#ffd46e';
console.log(json_data);

                /*************************************** 타이틀 부분 시작 ********************************************/
                var title_league = '',
                    home_img = title_data.home.team_img,
                    away_img = title_data.away.team_img,
                    home_name = title_data.home.team_name,
                    away_name = title_data.away.team_name,
                    home_idx = title_data.home.team_idx,
                    away_idx = title_data.away.team_idx,
                    home_name_en = title_data.home.team_name_en,
                    away_name_en = title_data.away.team_name_en,
                    //league_name = title_data.league_name,
                    league_full_name = localStorage.getItem('league_full_name');

                //localStorage.removeItem('league_full_name');
                html += '<div><span>' + league_full_name + '</span></div>';
                html += '<div class="team_info">';
                html += '<div class="home_info" data-home_idx="'+home_idx+'">';
                if(home_img == null){
                    html += '<div><img src="'+(DOMAIN+LIVESCORE+NO_IMG)+'"></div>';
                }else {
                    html += '<div><img src="' +(DOMAIN+LIVESCORE_T+home_img) + '"></div>';
                }
                html += '<div>';
                html += '<div>' + home_name + '</div>';
                html += '<div>' + home_name_en + '</div>';
                html += '</div>';
                html += '</div>';
                html += '<div><span>VS</span></div>';
                html += '<div class="away_info" data-away_idx="'+away_idx+'">';
                html += '<div>';
                html += '<div>' + away_name + '</div>';
                html += '<div>' + away_name_en + '</div>';
                html += '</div>';
                if(away_img == null){
                    html += '<div><img src="' + (DOMAIN+LIVESCORE+NO_IMG)+'"></div>';
                }else {
                    html += '<div><img src="' + (DOMAIN+LIVESCORE_T+away_img) + '"></div>';
                }
                html += '</div>';
                html += '</div>';
                html += '<div class="team_color">';
                html += '<div style="background-color: ' + home_c + ';"></div>';
                html += '<div style="background-color: ' + away_c + ';"></div>';
                html += '</div>';
                html += '<div class="team_result">';

                if(opp_data !== null) {
                    if (opp_data.home.config == 'home') {
                        html += '<div>- 양 팀의 상대 전적은 <span class="team_name">' + home_name + '</span>팀이 <span class="game_result">' + opp_data.home.home + '</span>로 앞서고 있습니다</div>';
                    } else if (opp_data.home.config == 'away') {
                        html += '<div>- 양 팀의 상대 전적은 <span class="team_name">' + away_name + '</span>팀이 <span class="game_result">' + opp_data.away.home + '</span>로 앞서고 있습니다</div>';
                    } else if (opp_data.home.config == 'draw') {
                        html += '<div>- 양 팀의 상대 전적은 <span class="game_result">' + opp_data.home.home + '</span>로 동률 입니다</div>';
                    }
                }else {
                    html += '<div>- 양 팀의 상대 전적이 존재하지 않습니다</div>';
                }

                html += '<div>- 해외 승률: 해외 배당 회사는 <span class="team_name">첼시 FC</span>의 승률을 <span class="game_result">58.56%</span>로 예상하고 있습니다</div>';
                html += '<div>- 국내 승률: 국내 배당 베트맨은 <span class="team_name">리버풀 FC</span>의 승률을 <span class="game_result">66.22%</span>로 예상하고 있습니다</div>';
                html += '</div>';

                $('#analysis_title').append(html);
                html = '';
                /*************************************** 타이틀 부분 끝 ********************************************/

                /*************************************** 시즌 팀 전력 분석 부분 시작 ********************************************/
                var content_class = [
                        'season_goal', 'season_shoot', 'season_eshoot', 'season_mshoot', 'season_bshoot', 'season_possession', 'season_possession_h',
                        'season_corner', 'season_corner_h', 'season_freekick', 'season_attack', 'season_dattack',
                        'season_skeeper', 'season_pass', 'season_spass', 'season_foul', 'season_ycard', 'season_rcard', 'season_assist', 'season_offside',
                        'season_heads', 'season_sheads', 'season_takle', 'season_stakle', 'season_dribbles', 'season_throw', 'season_intercept'
                    ],
                    //content_name = ['득점', '평균 점유율(%)', '패스 성공률(%)', '슈팅', '유효슈팅', '경고', '퇴장', '코너킥', '파울', '오프사이드'],
                    content_name = ['득점', '슈팅', '유효 슈팅', '빗나간 슈팅', '차단된 슈팅', '점유율(%)', '점유율(전반)(%)', '*코너킥', '*코너킥(전반)', '*프리킥', '공격', '위험 공격',
                        '*골키퍼 선방', '패스', '성공한 패스', '***파울', '***경고', '***퇴장', '*어시스트', '***오프사이드', '*헤딩', '*성공한 헤딩', '*태클', '*성공한 태클', '*드리블', '*스로인', '*인터셉트'],
                    content_key = ['goal', 'shots', 'shots_on_goal', 'off_target', 'blocked', 'possession', 'possession_ht', 'corner_kicks',
                        'corner_kicks_ht', 'free_kicks', 'attack', 'dangerous_attack', 'saves', 'pass', 'pass_success', 'fouls', 'yellow_cards', 'red_cards',
                        'assists', 'offsides', 'heads', 'head_success', 'tackles', 'tackle_success', 'dribbles', 'throw_ins', 'intercept'
                    ];

                var home_value_arr = [],
                    away_value_arr = [],
                    home_per_arr = [],
                    away_per_arr = [];

                for (var s = 0; s < content_key.length; s++) {
                    var home_val = power_data.home[content_key[s]],
                        away_val = power_data.away[content_key[s]],
                        total_val = parseFloat(home_val) + parseFloat(away_val),
                        home_per_val = _Fn.analysis_graph_per(home_val, total_val),
                        away_per_val = _Fn.analysis_graph_per(away_val, total_val);
                    if (content_name[s] == '점유율' || content_name[s] == '점유율(전반)') {
                        home_per_val = home_val + '%';
                        away_per_val = away_val + '%';
                    }

                    home_value_arr.push(home_val);
                    away_value_arr.push(away_val);
                    home_per_arr.push(home_per_val);
                    away_per_arr.push(away_per_val);
                }

                html += '<div class="main_title">';
                html += '<div>시즌 팀 전력 분석</div>';
                html += '<div><span class="league_name">' + league_full_name + '</span>의 현재 시즌 기준</div>';
                html += '</div>';
                html += '<div class="team_title2">';
                html += '<div>' + home_name + '</div>';
                html += '<div>|</div>';
                html += '<div>' + away_name + '</div>';
                html += '</div>';
                html += '<div class="analysis_content">';
                for (var i = 0; i < content_class.length; i++) {
                    if ((home_value_arr[i] != null || home_value_arr[i] != undefined) && (away_value_arr[i] != null || away_value_arr[i] != undefined)) {
                        html += '<div class="' + content_class[i] + '">';
                        html += '<div>';
                        // if (content_class[i] == 'season_ycard' || content_class[i] == 'season_corner' || content_class[i] == 'season_corner_h' || content_class[i] == 'season_rcard' ||
                        //     content_class[i] == 'season_freekick' || content_class[i] == 'season_skeeper' || content_class[i] == 'season_foul' || content_class[i] == 'season_assist' ||
                        //     content_class[i] == 'season_offside' || content_class[i] == 'season_heads' || content_class[i] == 'season_sheads' || content_class[i] == 'season_takle' ||
                        //     content_class[i] == 'season_stakle' || content_class[i] == 'season_dribbles' || content_class[i] == 'season_throw' || content_class[i] == 'season_intercept') {
                        if (content_class[i] == 'season_ycard' || content_class[i] == 'season_rcard' || content_class[i] == 'season_foul' || content_class[i] == 'season_offside') {
                            html += '<div class="color_back" style="width: 80px;">';
                        } else {
                            html += '<div class="color_back">';
                        }
                        if (home_value_arr[i] > away_value_arr[i] || home_value_arr[i] == away_value_arr[i]) {
                            html += '<div class="color" style="background-color: ' + home_c + '; width: ' + home_per_arr[i] + ';"></div>';
                        } else if (home_value_arr[i] < away_value_arr[i]) {
                            html += '<div class="color_g" style="width: ' + home_per_arr[i] + ';"></div>';
                        }

                        html += '</div>';
                        html += '</div>';
                        html += '<div>';

                        if (home_value_arr[i] == 0) {
                            html += '<span>-</span>';
                        } else {
                            html += '<span>' + home_value_arr[i] + '</span>';
                        }

                        html += '</div>';
                        html += '<div>|</div>';
                        html += '<div>';
                        html += '<span>' + content_name[i] + '</span>';
                        html += '</div>';
                        html += '<div>|</div>';
                        html += '<div>';

                        if (away_value_arr[i] == 0) {
                            html += '<span>-</span>';
                        } else {
                            html += '<span>' + away_value_arr[i] + '</span>';
                        }

                        html += '</div>';
                        html += '<div>';

                        // if (content_class[i] == 'season_ycard' || content_class[i] == 'season_corner' || content_class[i] == 'season_corner_h' || content_class[i] == 'season_rcard' ||
                        //     content_class[i] == 'season_freekick' || content_class[i] == 'season_skeeper' || content_class[i] == 'season_foul' || content_class[i] == 'season_assist' ||
                        //     content_class[i] == 'season_offside' || content_class[i] == 'season_heads' || content_class[i] == 'season_sheads' || content_class[i] == 'season_takle' ||
                        //     content_class[i] == 'season_stakle' || content_class[i] == 'season_dribbles' || content_class[i] == 'season_throw' || content_class[i] == 'season_intercept') {
                        if (content_class[i] == 'season_ycard' || content_class[i] == 'season_rcard' || content_class[i] == 'season_foul' || content_class[i] == 'season_offside') {
                            html += '<div class="color_back" style="width: 80px;">';
                        } else {
                            html += '<div class="color_back">';
                        }

                        if (away_value_arr[i] > home_value_arr[i] || away_value_arr[i] == home_value_arr[i]) {
                            html += '<div class="color" style="background-color: ' + away_c + '; width: ' + away_per_arr[i] + ';"></div>';
                        } else if (away_value_arr[i] < home_value_arr[i]) {
                            html += '<div class="color_g" style="width: ' + away_per_arr[i] + ';"></div>';
                        }

                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    }
                }
                html += '</div>';

                $('#season_analysis').append(html);
                html = '';
                /*************************************** 시즌 팀 전력 분석 부분 끝 ********************************************/

                /*************************************** 홈팀 / 원정팀 최근 경기 분석 시작 ********************************************/
                var latest_id = ['home_latest', 'away_latest'],
                    latest_home = recent_data.home,
                    latest_away = recent_data.away,
                    team_name_arr = [home_name, away_name];

                var la_data_arr = [latest_home, latest_away];

                for (var k = 0; k < la_data_arr.length; k++) {
                    $('#' + latest_id[k] + ' .graph div:nth-child(3) span').text(team_name_arr[k]); // 홈팀 네임
                    $('#' + latest_id[k] + ' > div.main_title > div > span').text(team_name_arr[k]);
                    var recent_home = la_data_arr[k];
                    var lookup = {},
                        lookup_idx = {},
                        items = recent_home,
                        uni_data = [],
                        uni_idx = [];
                    for (var item, i = 0; item = items[i++];) {
                        var league = item.league_name,
                            idx = item.league_idx;
                        if (!(league in lookup)) {
                            lookup[league] = 1;
                            uni_data.push(league);
                        }
                        if(!(idx in lookup_idx)) {
                            lookup_idx[idx] = 1;
                            uni_idx.push(idx);
                        }
                    }
                    console.log(uni_data);
                    console.log(uni_idx);
                    html += '<select id="latest_game">';
                    if(k == 0){
                        if(latest_home.length <= 5){
                            html += '<option value="1" selected="selected">최근 ' + latest_home.length + '경기</option>';
                        }else if(latest_home.length > 5 && latest_home.length <= 10){
                            html += '<option value="1">최근 5경기</option>';
                            if(latest_home.length == 10) {
                                html += '<option value="2" selected="selected">최근 10경기</option>';
                            }else {
                                html += '<option value="2" selected="selected">최근 ' + latest_home.length + '경기</option>';
                            }
                        }else if (latest_home.length > 10 && latest_home.length <= 15) {
                            html += '<option value="1">최근 5경기</option>';
                            html += '<option value="2" selected="selected">최근 10경기</option>';
                            html += '<option value="3">최근 ' + latest_home.length + '경기</option>';
                        } else if (latest_home.length > 15 && latest_home.length <= 20) {
                            html += '<option value="1">최근 5경기</option>';
                            html += '<option value="2">최근 10경기</option>';
                            html += '<option value="3" selected="selected">최근 15경기</option>';
                            html += '<option value="4">최근 ' + latest_home.length + '경기</option>';
                        } else if (latest_home.length > 20) {
                            html += '<option value="1">최근 5경기</option>';
                            html += '<option value="2" selected="selected">최근 10경기</option>';
                            html += '<option value="3">최근 15경기</option>';
                            html += '<option value="4">최근 20경기</option>';
                            html += '<option value="5">최근 ' + latest_home.length + '경기</option>';
                        }
                    }else if(k ==1){
                        if(latest_away.length <= 5){
                            html += '<option value="1" selected="selected">최근 ' + latest_away.length + '경기</option>';
                        }else if(latest_away.length > 5 && latest_away.length <= 10){
                            html += '<option value="1">최근 5경기</option>';
                            if(latest_away.length == 10) {
                                html += '<option value="2" selected="selected">최근 10경기</option>';
                            }else {
                                html += '<option value="2" selected="selected">최근 ' + latest_away.length + '경기</option>';
                            }
                        }else if (latest_away.length > 10 && latest_away.length <= 15) {
                            html += '<option value="1">최근 5경기</option>';
                            html += '<option value="2" selected="selected">최근 10경기</option>';
                            html += '<option value="3">최근 ' + latest_away.length + '경기</option>';
                        } else if (latest_away.length > 15 && latest_away.length <= 20) {
                            html += '<option value="1">최근 5경기</option>';
                            html += '<option value="2">최근 10경기</option>';
                            html += '<option value="3" selected="selected">최근 15경기</option>';
                            html += '<option value="4">최근 ' + latest_away.length + '경기</option>';
                        } else if (latest_away.length > 20) {
                            html += '<option value="1">최근 5경기</option>';
                            html += '<option value="2" selected="selected">최근 10경기</option>';
                            html += '<option value="3">최근 15경기</option>';
                            html += '<option value="4">최근 20경기</option>';
                            html += '<option value="5">최근 ' + latest_away.length + '경기</option>';
                        }
                    }
                    html += '</select>';
                    html += '<select id="game_league">';
                    html += '<option value="0">전체리그</option>';
                    for (var d = 0; d < uni_data.length; d++) {
                        html += '<option value="' + uni_idx[d] + '">' + uni_data[d] + '</option>';
                    }
                    html += '</select>';
                    html += '<div class="all_game latest_selected">전체</div>';
                    html += '<div class="home_game">홈</div>';
                    html += '<div class="away_game">원정</div>';

                    $('#' + latest_id[k] + ' .filter_nav').append(html);
                    html = '';

                    for (var c = 0; c < recent_home.length; c++) {
                        if(c > 9) {
                            html += '<div class="content_' + (c + 1) + ' nonDisplay">';
                        }else{
                            html += '<div class="content_' + (c + 1) + '">';
                        }

                        html += '<div data-league_idx="'+recent_home[c].league_idx+'">' + recent_home[c].league_name + '</div>';
                        html += '<div>|</div>';
                        html += '<div>' + recent_home[c].division_day + '<span class="nonDisplay">' + recent_home[c].game_start_time + '</span></div>';
                        html += '<div>|</div>';

                        if (recent_home[c].home_goal > recent_home[c].away_goal) {
                            if(recent_home[c].home_img == null) {
                                html += '<div class="win_team" data-home_idx="' + recent_home[c].home_team_idx + '">' + recent_home[c].home_name + '<img src="'+(DOMAIN+LIVESCORE+NO_IMG)+'"></div>';
                            }else {
                                html += '<div class="win_team" data-home_idx="' + recent_home[c].home_team_idx + '">' + recent_home[c].home_name + '<img src="' + (DOMAIN+LIVESCORE_T+recent_home[c].home_img) + '"></div>';
                            }
                        } else {
                            if(recent_home[c].home_img == null){
                                html += '<div data-home_idx="' + recent_home[c].home_team_idx + '">' + recent_home[c].home_name + '<img src="'+(DOMAIN+LIVESCORE+NO_IMG)+'"></div>';
                            }else {
                                html += '<div data-home_idx="' + recent_home[c].home_team_idx + '">' + recent_home[c].home_name + '<img src="' + (DOMAIN+LIVESCORE_T+recent_home[c].home_img) + '"></div>';
                            }
                        }

                        html += '<div><span>' + recent_home[c].home_goal + '</span> : <span>' + recent_home[c].away_goal + '</span></div>';

                        if (recent_home[c].home_goal < recent_home[c].away_goal) {
                            if(recent_home[c].away_img == null){
                                html += '<div class="win_team" data-away_idx="' + recent_home[c].away_team_idx + '"><img src="' + (DOMAIN+LIVESCORE+NO_IMG) + '">' + recent_home[c].away_name + '</div>';
                            }else {
                                html += '<div class="win_team" data-away_idx="' + recent_home[c].away_team_idx + '"><img src="' + (DOMAIN+LIVESCORE_T+recent_home[c].away_img) + '">' + recent_home[c].away_name + '</div>';
                            }
                        } else {
                            if(recent_home[c].away_img == null){
                                html += '<div data-away_idx="' + recent_home[c].away_team_idx + '"><img src="' + (DOMAIN+LIVESCORE+NO_IMG) + '">' + recent_home[c].away_name + '</div>';
                            }else {
                                html += '<div data-away_idx="' + recent_home[c].away_team_idx + '"><img src="' + (DOMAIN+LIVESCORE_T+recent_home[c].away_img) + '">' + recent_home[c].away_name + '</div>';
                            }
                        }

                        html += '<div>|</div>';
                        html += '<div>' + recent_home[c].home_goal_half + ' : ' + recent_home[c].away_goal_half + '</div>';
                        html += '<div>|</div>';

                        if (recent_home[c].team_res == 'W') {
                            html += '<div><div class="win_game">' + recent_home[c].team_res + '</div></div>';
                        } else if (recent_home[c].team_res == 'D') {
                            html += '<div><div class="draw_game">' + recent_home[c].team_res + '</div></div>';
                        } else if (recent_home[c].team_res == 'L') {
                            html += '<div><div class="lose_game">' + recent_home[c].team_res + '</div></div>';
                        }

                        html += '</div>';
                    }
                    $('#' + latest_id[k] + ' > div.game_content').append(html);
                    html = '';
                }
                /*************************************** 홈팀 / 원정팀 최근 경기 분석 끝 ********************************************/

                /****************************************** 상대 전적 분석 시작 ***********************************************/
                if(opp_data == null){
                    $('#relative_record').addClass('nonDisplay');
                }else {
                    var //opp_list = opp_data.list,
                        //opp_config = opp_data.config,
                        opp_home = opp_data.home,
                        opp_away = opp_data.away,
                        opp_home_list = opp_home.list,
                        opp_away_list = opp_away.list,
                        opp_list_arr = [opp_home_list, opp_away_list],
                        opp_list_fs = opp_data.firstsecond.list,
                        opp_home_config = opp_home.config,
                        opp_away_config = opp_away.config,
                        split_home_win = opp_home.home.split('승'),
                        home_win = split_home_win[0],
                        split_home_draw = opp_home.home.substr(3).split('무'),
                        home_draw = split_home_draw[0],
                        split_home_lose = opp_home.home.substr(6).split('패'),
                        home_lose = split_home_lose[0],
                        home_game_count = parseInt(home_win) + parseInt(home_draw) + parseInt(home_lose),
                        home_win_per = (home_win / home_game_count) * 100,
                        home_draw_per = (home_draw / home_game_count) * 100,
                        home_lose_per = (home_lose / home_game_count) * 100,
                        split_away_win = opp_away.home.split('승'),
                        away_win = split_away_win[0],
                        split_away_draw = opp_away.home.substr(3).split('무'),
                        away_draw = split_away_draw[0],
                        split_away_lose = opp_away.home.substr(6).split('패'),
                        away_lose = split_away_lose[0],
                        away_game_count = parseInt(away_win) + parseInt(away_draw) + parseInt(away_lose),
                        away_win_per = (away_win / away_game_count) * 100,
                        away_draw_per = (away_draw / away_game_count) * 100,
                        away_lose_per = (away_lose / away_game_count) * 100,
                        opp_content_name = ['평균 득점', '평균 실점', '전반 평균 득점', '전반 평균 실점', '후반 평균 득점', '후반 평균 실점', '슈팅', '유효 슈팅', '빗나간 슈팅', '차단된 슈팅',
                            '점유율(%)', '코너킥', '오프사이드', '골키퍼 선방', '파울', '패스', '패스 성공', '경고', '퇴장'
                        ],
                        opp_content_class = ['aver_goal', 'aver_lose', 'fh_aver_goal', 'fh_aver_lose', 'sh_aver_goal', 'sh_aver_lose', 'shoots', 'e_shoots', 'm_shoots',
                            'b_shoots', 'poss', 'corner_kick', 'offside', 'keeper_save', 'foul', 'pass', 'pass_s', 'y_card', 'r_card'
                        ],
                        avr_goal = 0, avr_lose = 0, fh_avr_goal = 0, fh_avr_lose = 0, sh_avr_goal = 0, sh_avr_lose = 0,
                        avr_shoots = 0, avr_eshoots = 0, avr_mshoots = 0,
                        avr_bshoots = 0, avr_poss = 0, avr_corner = 0, avr_offside = 0, avr_keep_save = 0, avr_foul = 0,
                        avr_pass = 0, avr_pass_s = 0,
                        avr_ycard = 0, avr_rcard = 0,
                        h_opp_content_val = [avr_goal, avr_lose, fh_avr_goal, fh_avr_lose, sh_avr_goal, sh_avr_lose, avr_shoots, avr_eshoots, avr_mshoots,
                            avr_bshoots, avr_poss, avr_corner, avr_offside, avr_keep_save, avr_foul, avr_pass, avr_pass_s, avr_ycard, avr_rcard
                        ],
                        avr_goal2 = 0, avr_lose2 = 0, fh_avr_goal2 = 0, fh_avr_lose2 = 0, sh_avr_goal2 = 0,
                        sh_avr_lose2 = 0, avr_shoots2 = 0, avr_eshoots2 = 0, avr_mshoots2 = 0,
                        avr_bshoots2 = 0, avr_poss2 = 0, avr_corner2 = 0, avr_offside2 = 0, avr_keep_save2 = 0,
                        avr_foul2 = 0, avr_pass2 = 0, avr_pass_s2 = 0,
                        avr_ycard2 = 0, avr_rcard2 = 0,
                        a_opp_content_val = [avr_goal2, avr_lose2, fh_avr_goal2, fh_avr_lose2, sh_avr_goal2, sh_avr_lose2, avr_shoots2, avr_eshoots2, avr_mshoots2,
                            avr_bshoots2, avr_poss2, avr_corner2, avr_offside2, avr_keep_save2, avr_foul2, avr_pass2, avr_pass_s2, avr_ycard2, avr_rcard2
                        ],
                        opp_val_arr = [h_opp_content_val, a_opp_content_val];

                    var home_team_idx = $('#analysis_title > div.team_info > div.home_info').data('home_idx');

                    for (var s = 0; s < opp_val_arr.length; s++) {
                        // for (var m = 0; m < 10; m++) {
                        for (var m = 0; m < opp_home_list.length; m++) {
                            if (s == 0) {
                                if(home_team_idx == opp_list_arr[s][m].home_idx) {
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].home_goal);
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].away_goal);
                                }else {
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].away_goal);
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].home_goal);
                                }

                                opp_val_arr[s][2] += parseInt(opp_list_fs[m].firstscore.substr(0, 1));
                                opp_val_arr[s][3] += parseInt(opp_list_fs[m].firstscore.substr(2, 1));
                                if(opp_list_fs[m].secondscore != null) {
                                    opp_val_arr[s][4] += parseInt(opp_list_fs[m].secondscore.substr(0, 1));
                                    opp_val_arr[s][5] += parseInt(opp_list_fs[m].secondscore.substr(2, 1));
                                }else {
                                    opp_val_arr[s][4] += 0;
                                    opp_val_arr[s][5] += 0;
                                }
                            } else if (s == 1) {
                                if(home_team_idx != opp_list_arr[s][m].away_idx) {
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].home_goal);
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].away_goal);
                                }else{
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].away_goal);
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].home_goal);
                                }

                                opp_val_arr[s][3] += parseInt(opp_list_fs[m].firstscore.substr(0, 1));
                                opp_val_arr[s][2] += parseInt(opp_list_fs[m].firstscore.substr(2, 1));
                                if(opp_list_fs[m].secondscore != null) {
                                    opp_val_arr[s][5] += parseInt(opp_list_fs[m].secondscore.substr(0, 1));
                                    opp_val_arr[s][4] += parseInt(opp_list_fs[m].secondscore.substr(2, 1));
                                }else {
                                    opp_val_arr[s][5] += 0;
                                    opp_val_arr[s][4] += 0;
                                }
                            }
                            opp_val_arr[s][6] += parseInt(opp_list_arr[s][m].shots);
                            opp_val_arr[s][7] += parseInt(opp_list_arr[s][m].shots_ot);
                            opp_val_arr[s][8] += parseInt(opp_list_arr[s][m].off_target);
                            opp_val_arr[s][9] += parseInt(opp_list_arr[s][m].blocked);
                            opp_val_arr[s][10] += parseInt(opp_list_arr[s][m].possession);
                            //avr_free += parseInt(opp_home_list[m].possession);
                            opp_val_arr[s][11] += parseInt(opp_list_arr[s][m].corner);
                            opp_val_arr[s][12] += parseInt(opp_list_arr[s][m].offsides);
                            opp_val_arr[s][13] += parseInt(opp_list_arr[s][m].saves);
                            opp_val_arr[s][14] += parseInt(opp_list_arr[s][m].fouls);
                            opp_val_arr[s][15] += parseInt(opp_list_arr[s][m].passes);
                            opp_val_arr[s][16] += parseInt(opp_list_arr[s][m].passes_success);
                            opp_val_arr[s][17] += parseInt(opp_list_arr[s][m].yellow_card);
                            opp_val_arr[s][18] += parseInt(opp_list_arr[s][m].red_card);
                        }
                    }
                    console.log(h_opp_content_val);
                    console.log(a_opp_content_val);
                    var opponent_home = opp_home.list;
                    var league_object = {},
                        league_object2 = {},
                        game_data = opponent_home,
                        uni_data_arr = [],
                        uni_data_arr2 = [];
                    for (var item, i = 0; item = game_data[i++];) {
                        var loop_league = item.league_name;
                        if (!(loop_league in league_object)) {
                            league_object[loop_league] = 1;
                            uni_data_arr.push(loop_league);
                        }
                    }
                    for (var item, i = 0; item = game_data[i++];) {
                        var loop_league = item.league_idx;
                        if (!(loop_league in league_object2)) {
                            league_object2[loop_league] = 1;
                            uni_data_arr2.push(loop_league);
                        }
                    }
                    console.log(uni_data_arr2);

                    html += '<div class="main_title">';
                    html += '<div>상대 전적 분석</div>';
                    html += '</div>';
                    html += '<div class="filter_nav">';
                    html += '<select id="latest_game">';
                    if(opp_home_list.length <= 5){
                        html += '<option value="1" selected="selected">최근 ' + opp_home_list.length + '경기</option>';
                    }else if(opp_home_list.length > 5 && opp_home_list.length <= 10){
                        html += '<option value="1">최근 5경기</option>';
                        if(opp_home_list.length == 10) {
                            html += '<option value="2" selected="selected">최근 10경기</option>';
                        }else {
                            html += '<option value="2" selected="selected">최근 ' + opp_home_list.length + '경기</option>';
                        }
                    }else if (opp_home_list.length > 10 && opp_home_list.length <= 15) {
                        html += '<option value="1">최근 5경기</option>';
                        html += '<option value="2">최근 10경기</option>';
                        html += '<option value="3" selected="selected">최근 ' + opp_home_list.length + '경기</option>';
                    } else if (opp_home_list.length > 15 && opp_home_list.length <= 20) {
                        html += '<option value="1">최근 5경기</option>';
                        html += '<option value="2">최근 10경기</option>';
                        html += '<option value="3">최근 15경기</option>';
                        html += '<option value="4" selected="selected">최근 ' + opp_home_list.length + '경기</option>';
                    } else if (opp_home_list.length > 20) {
                        html += '<option value="1">최근 5경기</option>';
                        html += '<option value="2">최근 10경기</option>';
                        html += '<option value="3">최근 15경기</option>';
                        html += '<option value="4">최근 20경기</option>';
                        html += '<option value="5" selected="selected">최근 ' + opp_home_list.length + '경기</option>';
                    }
                    html += '</select>';
                    html += '<select id="game_league">';
                    html += '<option value="0">전체리그</option>';
                    for (var j = 0; j < uni_data_arr.length; j++) {
                        html += '<option value="' + uni_data_arr2[j] + '">' + uni_data_arr[j] + '</option>';
                    }
                    html += '</select>';
                    html += '<div class="all_game latest_selected">전체</div>';
                    html += '<div class="home_away_game">홈/원정 동일</div>';
                    html += '</div>';
                    html += '<div class="team_color">';
                    html += '<div style="background-color: ' + home_c + ';"></div>';
                    html += '<div style="background-color: ' + away_c + ';"></div>';
                    html += '</div>';
                    html += '<div class="graph">';
                    html += '<div class="home_info">';
                    html += '<div>';
                    html += '<div>' + home_name + '</div>';
                    html += '<div><span>' + opp_home.home + '</span></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="graph_content">';
                    html += '<div>';
                    html += '<div>홈팀 승</div>';
                    html += '<div>';
                    html += '<div class="color_back">';
                    html += '<div class="color_g" style="background-color: ' + home_c + '; width: ' + home_win_per + '%;"><span>' + home_win + '</span></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div>' + home_win_per.toFixed(1) + '%</div>';
                    html += '</div>';
                    html += '<div>';
                    html += '<div>무승부</div>';
                    html += '<div class="donut_graph">';
                    html += '<div class="donut_color"><span>' + home_draw + '</span></div>';
                    html += '</div>';
                    html += '<div>' + home_draw_per.toFixed(1) + '%</div>';
                    html += '</div>';
                    html += '<div>';
                    html += '<div>원정팀 승</div>';
                    html += '<div>';
                    html += '<div class="color_back">';
                    html += '<div class="color_g" style="background-color: ' + away_c + '; width: ' + away_win_per + '%;"><span>' + away_win + '</span></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div>' + away_win_per.toFixed(1) + '%</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="away_info">';
                    html += '<div>';
                    html += '<div>' + away_name + '</div>';
                    html += '<div><span>' + opp_home.away + '</span></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="sub_title">';
                    html += '<div>리그</div>';
                    html += '<div>날짜</div>';
                    html += '<div>홈</div>';
                    html += '<div>VS</div>';
                    html += '<div>원정</div>';
                    html += '<div>전반</div>';
                    html += '<div>결과</div>';
                    html += '</div>';
                    html += '<div class="game_content">';

                    //var loop_length = 10;
                    var loop_length = opp_home_list.length;

                    if (opp_home_list.length < 10) {
                        loop_length = opp_home_list.length;
                    }


                    for (var i = 0; i < loop_length; i++) {
                        var list_date = opp_home_list[i].date.substr(2, 8);
                        html += '<div class="content_' + (i + 1) + '" data-game_idx="' + opp_home_list[i].game_idx + '">';
                        html += '<div data-league_idx="' + opp_home_list[i].league_idx + '">' + opp_home_list[i].league_name + '</div>';
                        html += '<div>|</div>';
                        html += '<div>' + list_date + '</div>';
                        html += '<div>|</div>';
                        // if (opp_home_list[i].home_name == home_name) {
                        //     if (opp_home_list[i].home_goal > opp_home_list[i].away_goal) {
                        //         // if(opp_home_list[i].red_card !== 0 && opp_home_list[i].yellow_card !== 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'"><span class="badge badge-warning">' + opp_home_list[i].yellow_card + '</span><span class="badge badge-danger">' + opp_home_list[i].red_card + '</span>' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }else if(opp_home_list[i].red_card !== 0 && opp_home_list[i].yellow_card == 0) {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'"><span class="badge badge-danger">' + opp_home_list[i].red_card + '</span>' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }else if(opp_home_list[i].red_card == 0 && opp_home_list[i].yellow_card !== 0) {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'"><span class="badge badge-warning">' + opp_home_list[i].yellow_card + '</span>' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }else {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'">' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }
                        //         html += '<div class="win_team" data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //     } else {
                        //         html += '<div data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + away_img + '""></div>';
                        //     }
                        // } else {
                        //     if (opp_home_list[i].home_goal > opp_home_list[i].away_goal) {
                        //         // if(opp_home_list[i].red_card !== 0 && opp_home_list[i].yellow_card !== 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'"><span class="badge badge-warning">' + opp_home_list[i].yellow_card + '</span><span class="badge badge-danger">' + opp_home_list[i].red_card + '</span>' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }else if(opp_home_list[i].red_card !== 0 && opp_home_list[i].yellow_card == 0) {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'"><span class="badge badge-danger">' + opp_home_list[i].red_card + '</span>' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }else if(opp_home_list[i].red_card == 0 && opp_home_list[i].yellow_card !== 0) {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'"><span class="badge badge-warning">' + opp_home_list[i].yellow_card + '</span>' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }else {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_home_list[i].home_idx+'">' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //         // }
                        //         html += '<div class="win_team" data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + away_img + '""></div>';
                        //     } else {
                        //         html += '<div data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + home_img + '""></div>';
                        //     }
                        // }
                        console.log(home_team_idx);
                        if (opp_home_list[i].home_goal > opp_home_list[i].away_goal) {
                            if(home_team_idx == opp_home_list[i].home_idx) {
                                if(home_img == null){
                                    html += '<div class="win_team" data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '""></div>';
                                }else {
                                    html += '<div class="win_team" data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE_T + home_img) + '""></div>';
                                }
                            }else {
                                if(away_img == null){
                                    html += '<div class="win_team" data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '""></div>';
                                }else {
                                    html += '<div class="win_team" data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE_T + away_img) + '""></div>';
                                }
                            }
                        } else {
                            if(home_team_idx != opp_home_list[i].home_idx) {
                                if(away_img == null){
                                    html += '<div data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '"></div>';
                                }else {
                                    html += '<div data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE_T + away_img) + '""></div>';
                                }
                            }else{
                                if(home_img == null){
                                    html += '<div data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '"></div>';
                                }else {
                                    html += '<div data-home_idx="' + opp_home_list[i].home_idx + '">' + opp_home_list[i].home_name + '<img src="' + (DOMAIN + LIVESCORE_T + home_img) + '""></div>';
                                }
                            }
                        }

                        html += '<div><span>' + opp_home_list[i].home_goal + '</span> : <span>' + opp_home_list[i].away_goal + '</span></div>';
                        // if (opp_home_list[i].away_name == away_name) {
                        //     if (opp_home_list[i].home_goal < opp_home_list[i].away_goal) {
                        //         // if(opp_away_list[i].red_card !== 0 && opp_away_list[i].yellow_card !== 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '<span class="badge badge-danger">' + opp_away_list[i].red_card + '</span><span class="badge badge-warning">' + opp_away_list[i].yellow_card + '</span></div>';
                        //         // }else if(opp_away_list[i].red_card !== 0 && opp_away_list[i].yellow_card == 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '<span class="badge badge-danger">' + opp_away_list[i].red_card + '</span></div>';
                        //         // }else if(opp_away_list[i].red_card == 0 && opp_away_list[i].yellow_card !== 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '<span class="badge badge-warning">' + opp_away_list[i].yellow_card + '</span></div>';
                        //         // }else {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '</div>';
                        //         // }
                        //         html += '<div class="win_team" data-home_idx="' + opp_away_list[i].away_idx + '"><img src="' + away_img + '">' + opp_home_list[i].away_name + '</div>';
                        //     } else {
                        //         html += '<div data-home_idx="' + opp_away_list[i].away_idx + '"><img src="' + away_img + '">' + opp_home_list[i].away_name + '</div>';
                        //     }
                        // } else {
                        //     if (opp_home_list[i].home_goal < opp_home_list[i].away_goal) {
                        //         // if(opp_away_list[i].red_card !== 0 && opp_away_list[i].yellow_card !== 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '<span class="badge badge-danger">' + opp_away_list[i].red_card + '</span><span class="badge badge-warning">' + opp_away_list[i].yellow_card + '</span></div>';
                        //         // }else if(opp_away_list[i].red_card !== 0 && opp_away_list[i].yellow_card == 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '<span class="badge badge-danger">' + opp_away_list[i].red_card + '</span></div>';
                        //         // }else if(opp_away_list[i].red_card == 0 && opp_away_list[i].yellow_card !== 0){
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '<span class="badge badge-warning">' + opp_away_list[i].yellow_card + '</span></div>';
                        //         // }else {
                        //         //     html += '<div class="win_team" data-home_idx="'+opp_away_list[i].away_idx+'"><img src="' + away_img + '">' + opp_home_list[i].away_name + '</div>';
                        //         // }
                        //         html += '<div class="win_team" data-home_idx="' + opp_away_list[i].away_idx + '"><img src="' + away_img + '">' + opp_home_list[i].away_name + '</div>';
                        //     } else {
                        //         html += '<div data-home_idx="' + opp_away_list[i].away_idx + '"><img src="' + home_img + '">' + opp_home_list[i].away_name + '</div>';
                        //     }
                        // }
                        if (opp_home_list[i].home_goal < opp_home_list[i].away_goal) {
                            if(home_team_idx == opp_home_list[i].home_idx) {
                                if(away_img == null){
                                    html += '<div class="win_team" data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '">' + opp_home_list[i].away_name + '</div>';
                                }else {
                                    html += '<div class="win_team" data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE_T + away_img) + '">' + opp_home_list[i].away_name + '</div>';
                                }
                            }else {
                                if(home_img == null){
                                    html += '<div class="win_team" data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '">' + opp_home_list[i].away_name + '</div>';
                                }else {
                                    html += '<div class="win_team" data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE_T + home_img) + '">' + opp_home_list[i].away_name + '</div>';
                                }
                            }
                        } else {
                            if(home_team_idx != opp_home_list[i].home_idx) {
                                if(home_img == null){
                                    html += '<div data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '">' + opp_home_list[i].away_name + '</div>';
                                }else {
                                    html += '<div data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE_T + home_img) + '">' + opp_home_list[i].away_name + '</div>';
                                }
                            }else{
                                if(away_img == null){
                                    html += '<div data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE + NO_IMG) + '">' + opp_home_list[i].away_name + '</div>';
                                }else {
                                    html += '<div data-away_idx="' + opp_home_list[i].away_idx + '"><img src="' + (DOMAIN + LIVESCORE_T + away_img) + '">' + opp_home_list[i].away_name + '</div>';
                                }
                            }
                        }
                        html += '<div>|</div>';
                        var split_ht_score = opp_list_fs[i].firstscore.split('-');

                        html += '<div>' + split_ht_score[0] + ' : ' + split_ht_score[1] + '</div>';
                        html += '<div>|</div>';
                        if ((opp_home_list[i].home_goal > opp_home_list[i].away_goal) && opp_home_list[i].home_idx == home_team_idx) {
                            html += '<div><div class="win_game">W</div></div>';
                        } else if ((opp_home_list[i].home_goal > opp_home_list[i].away_goal) && opp_home_list[i].home_idx != home_team_idx) {
                            html += '<div><div class="lose_game">L</div></div>';
                        }else if (opp_home_list[i].home_goal == opp_home_list[i].away_goal) {
                            html += '<div><div class="draw_game">D</div></div>';
                        } else if ((opp_home_list[i].home_goal < opp_home_list[i].away_goal) && opp_home_list[i].home_idx == home_team_idx) {
                            html += '<div><div class="lose_game">L</div></div>';
                        } else if ((opp_home_list[i].home_goal < opp_home_list[i].away_goal) && opp_home_list[i].home_idx != home_team_idx) {
                            html += '<div><div class="win_game">W</div></div>';
                        }
                        html += '</div>';
                    }

                    html += '</div>';
                    html += '<div class="second_title">';
                    html += '<div>상대 전적 스탯 분석</div>';
                    html += '</div>';
                    html += '<div class="team_title">';
                    html += '<div style="border-top: 1px solid ' + home_c + ';">' + home_name + '</div>';
                    html += '<div style="border-top: 1px solid ' + away_c + ';">' + away_name + '</div>';
                    html += '</div>';
                    html += '<div class="second_sub_title">';
                    html += '<div>평균</div>';
                    html += '<div>구분</div>';
                    html += '<div>평균</div>';
                    html += '</div>';
                    html += '<div class="opponent_content">';
                    for (var n = 0; n < opp_content_name.length; n++) {
                        var h_data_avr = opp_val_arr[0][n] / opp_home_list.length,
                            a_data_avr = opp_val_arr[1][n] / opp_away_list.length;
                        // var h_data_avr = opp_val_arr[0][n] / 10,
                        //     a_data_avr = opp_val_arr[1][n] / 10;

                        //if ((opp_val_arr[0][n] != null || opp_val_arr[0][n] != undefined) && (opp_val_arr[1][n] != null || opp_val_arr[1][n] != undefined)) {
                        if ((opp_val_arr[0][n] !== 0 && opp_val_arr[1][n] !== 0) && (!isNaN(h_data_avr) == true && !isNaN(a_data_avr) == true)) {
                            html += '<div class="' + opp_content_class[n] + '">';
                            html += '<div>';
                            html += '<div class="color_back">';

                            if (opp_val_arr[0][n] > opp_val_arr[1][n] || opp_val_arr[0][n] == opp_val_arr[1][n]) {
                                html += '<div class="color" style="background-color: ' + home_c + '; width: ' + _Fn.analysis_graph_per(h_data_avr, ((h_data_avr) + (a_data_avr))) + ';"></div>';
                            } else if (opp_val_arr[0][n] < opp_val_arr[1][n]) {
                                html += '<div class="color_g" style="width: ' + _Fn.analysis_graph_per(h_data_avr, ((h_data_avr) + (a_data_avr))) + ';"></div>';
                            }

                            html += '</div>';
                            html += '</div>';
                            html += '<div>';

                            if (h_data_avr % 1 === 0) {
                                html += '<span>' + h_data_avr + '</span>';
                            } else {
                                html += '<span>' + h_data_avr.toFixed(1) + '</span>';
                            }

                            html += '</div>';
                            html += '<div>|</div>';
                            html += '<div>';
                            html += '<span>' + opp_content_name[n] + '</span>';
                            html += '</div>';
                            html += '<div>|</div>';
                            html += '<div>';

                            if (a_data_avr % 1 === 0) {
                                html += '<span>' + a_data_avr + '</span>';
                            } else {
                                html += '<span>' + a_data_avr.toFixed(1) + '</span>';
                            }

                            html += '</div>';
                            html += '<div>';
                            html += '<div class="color_back">';

                            if (opp_val_arr[0][n] < opp_val_arr[1][n] || opp_val_arr[0][n] == opp_val_arr[1][n]) {
                                html += '<div class="color" style="background-color: ' + away_c + '; width: ' + _Fn.analysis_graph_per(a_data_avr, (h_data_avr + a_data_avr)) + ';"></div>';
                            } else if (opp_val_arr[0][n] > opp_val_arr[1][n]) {
                                html += '<div class="color_g" style="width: ' + _Fn.analysis_graph_per(a_data_avr, (h_data_avr + a_data_avr)) + ';"></div>';
                            }
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                        }
                    }
                    $('#relative_record').append(html);
                    var lose_css = away_win_per.toFixed(1),
                        win_css = parseInt(away_win_per.toFixed(1)) + parseInt(home_win_per.toFixed(1)),
                        //val_css = 'conic-gradient(from 20deg, #ffd46e 0% '+lose_css+'%, #517dc9 '+lose_css+'% '+win_css+'%, #9ca0a8 '+win_css+'% 100%)';
                        val_css = 'conic-gradient(#ffd46e 0% ' + lose_css + '%, #517dc9 ' + lose_css + '% ' + win_css + '%, #9ca0a8 ' + win_css + '% 100%)';
                    $DOCUMENT.find('#relative_record > div.graph > div.graph_content > div:nth-child(2) > div.donut_graph > div.donut_color').css({
                        background: val_css
                    });
                    html = '';
                }
                /****************************************** 상대 전적 분석 끝 ***********************************************/

                /****************************************** 득점 분포도 시작 ***********************************************/
                var home_score = score_data.home.game_10,
                    away_score = score_data.away.game_10,
                    data_arr = [home_score, away_score],
                    data_div = ['total','home','away'],
                    name_arr = [home_name, away_name],
                    color_arr = [home_c, away_c],
                    content_class_arr = ['distri_h_content','distri_a_content'];
                var h_t_one=0, h_t_two=0, h_t_three=0, h_t_four=0, h_t_five=0, h_t_six=0, h_t_seven=0, h_t_eight=0, h_t_nine=0;
                var h_h_one=0, h_h_two=0, h_h_three=0, h_h_four=0, h_h_five=0, h_h_six=0, h_h_seven=0, h_h_eight=0, h_h_nine=0;
                var h_a_one=0, h_a_two=0, h_a_three=0, h_a_four=0, h_a_five=0, h_a_six=0, h_a_seven=0, h_a_eight=0, h_a_nine=0;
                var h_total_arr1 = [h_t_one, h_t_two, h_t_three, h_t_four, h_t_five],
                    h_total_arr2 = [h_t_six, h_t_seven, h_t_eight, h_t_nine],
                    h_home_arr1 = [h_h_one,h_h_two,h_h_three,h_h_four,h_h_five],
                    h_home_arr2 = [h_h_six,h_h_seven,h_h_eight,h_h_nine],
                    h_away_arr1 = [h_a_one,h_a_two,h_a_three,h_a_four,h_a_five],
                    h_away_arr2 = [h_a_six,h_a_seven,h_a_eight,h_a_nine],
                    h_score_division1 = [h_total_arr1, h_home_arr1, h_away_arr1],
                    h_score_division2 = [h_total_arr2, h_home_arr2, h_away_arr2];
                var a_t_one=0, a_t_two=0, a_t_three=0, a_t_four=0, a_t_five=0, a_t_six=0, a_t_seven=0, a_t_eight=0, a_t_nine=0;
                var a_h_one=0, a_h_two=0, a_h_three=0, a_h_four=0, a_h_five=0, a_h_six=0, a_h_seven=0, a_h_eight=0, a_h_nine=0;
                var a_a_one=0, a_a_two=0, a_a_three=0, a_a_four=0, a_a_five=0, a_a_six=0, a_a_seven=0, a_a_eight=0, a_a_nine=0;
                var a_total_arr1 = [a_t_one, a_t_two, a_t_three, a_t_four, a_t_five],
                    a_total_arr2 = [a_t_six, a_t_seven, a_t_eight, a_t_nine],
                    a_home_arr1 = [a_h_one,a_h_two,a_h_three,a_h_four,a_h_five],
                    a_home_arr2 = [a_h_six,a_h_seven,a_h_eight,a_h_nine],
                    a_away_arr1 = [a_a_one,a_a_two,a_a_three,a_a_four,a_a_five],
                    a_away_arr2 = [a_a_six,a_a_seven,a_a_eight,a_a_nine],
                    a_score_division1 = [a_total_arr1, a_home_arr1, a_away_arr1],
                    a_score_division2 = [a_total_arr2, a_home_arr2, a_away_arr2];
                var total_arr = [h_score_division1, a_score_division1],
                    total_arr2 = [h_score_division2, a_score_division2],
                    uni_total = [[], []],
                    uni_total_idx = [[],[]];
console.log(score_data);
console.log(home_score);
                for(var h=0; h<data_arr.length; h++) {
                    for(var j=0; j<data_div.length; j++) {
                        var select_data = data_arr[h];

                        var score_home = data_arr[h][data_div[j]];     /***********리그 명 뽑기 시작**********/
                        //console.log(score_home);
                        var lookup_obj = {},
                            lookup_obj2 = {},
                            items2 = score_home,
                            uni_data2 = [],
                            uni_data_idx2 = [];
                        for(var item2, i=0; item2 = items2[i++];){
                            var league2 = item2.league_name,
                                idx2 = item2.league_idx;
                            if(!(league2 in lookup_obj)) {
                                lookup_obj[league2] = 1;
                                uni_data2.push(league2);
                            }
                            if(!(idx2 in lookup_obj2)) {
                                lookup_obj2[idx2] = 1;
                                uni_data_idx2.push(idx2);
                            }
                        }                                             /***********리그 명 뽑기  끝**********/

                        for (var g = 0; g < 5; g++) {
                            var loop_val = select_data[data_div[j]].filter(function (element) {
                                var type = [element.diff >= 2, element.diff == 1, element.diff == 0, element.diff == -1, element.diff <= -2];
                                return type[g];
                            }).length;
                            total_arr[h][j][g] += loop_val;
                        }
                        for(var k=0; k < 4; k++){
                            var loop_val2 = select_data[data_div[j]].filter(function (element) {
                                var type2 = [element.goal == 0, element.goal == 1, element.goal == 2, element.goal >= 3];
                                return type2[k]
                            }).length;
                            total_arr2[h][j][k] += loop_val2;
                        }
                    }
                    uni_total[h].push(uni_data2); /***** 리그명 뽑기 배열에 삽입  *******/
                    uni_total_idx[h].push(uni_data_idx2);
                }
console.log(uni_total);
console.log(uni_total_idx);
                html += '<div class="main_title">';
                html += '<div>득점 분포도</div>';
                html += '</div>';
                html += '<div class="filter_nav">';
                html += '<select id="latest_game">';
                html += '<option value="1">최근 5경기</option>';
                html += '<option value="2" selected="selected">최근 10경기</option>';
                html += '<option value="3">최근 15경기</option>';
                html += '<option value="4">최근 20경기</option>';
                html += '</select>';
                html += '<select id="home_league">';
                html += '<option value="0">홈팀 리그</option>';
                for(var s=0; s<uni_total[0][0].length; s++){
                    html += '<option value="'+uni_total_idx[0][0][s]+'">'+uni_total[0][0][s]+'</option>';
                }
                html += '</select>';
                html += '<select id="away_league">';
                html += '<option value="0">원정팀 리그</option>';
                for(var s=0; s<uni_total[1][0].length; s++){
                    html += '<option value="'+uni_total_idx[1][0][s]+'">'+uni_total[1][0][s]+'</option>';
                }
                html += '</select>';
                //html += '<div class="all_game latest_selected">전체</div>';
                //html += '<div class="home_away_game">홈/원정 동일</div>';
                html += '</div>';
                for(var n=0; n<data_arr.length; n++) {
                    html += '<div class="main_sub_title">';
                    html += '<div style="border-top: 1px solid ' + color_arr[n] + ';">' + name_arr[n] + '</div>';
                    html += '</div>';
                    html += '<div class="distri_sub_title">';
                    html += '<div></div>';
                    html += '<div>2골차 이상 승</div>';
                    html += '<div>1골차 승</div>';
                    html += '<div>무승부</div>';
                    html += '<div>1골차 패</div>';
                    html += '<div>2골차 이상 패</div>';
                    html += '<div>무득점</div>';
                    html += '<div>1골 득점</div>';
                    html += '<div>2골 득점</div>';
                    html += '<div>3골 이상 득점</div>';
                    html += '</div>';
                    html += '<div class="'+content_class_arr[n]+'">';
                    for(var x=0; x<data_div.length; x++) {
                        var title_type = ['전체','홈','원정'];
                        var max_index = total_arr[n][x].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                        var max_index2 = total_arr2[n][x].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                        var loop_data = total_arr[n][x];
                        var loop_data2 = total_arr2[n][x];

                        html += '<div>';
                        html += '<div>'+title_type[x]+'</div>';
                        for(var c=0; c<loop_data.length; c++) {
                            if(c == max_index){
                                html += '<div class="distri_selected">'+loop_data[c]+'<em class="distri_selected_box"></em></div>';
                            }else {
                                html += '<div>' + loop_data[c] + '</div>';
                            }
                        }
                        for(var e=0; e<loop_data2.length; e++) {
                            if(e == max_index2){
                                html += '<div class="distri_selected">'+loop_data2[e]+'<em class="distri_selected_box"></em></div>';
                            }else{
                                html += '<div>' + loop_data2[e] + '</div>';
                            }
                        }

                        html += '</div>';
                    }
                    html += '<div class="distri_result">';
                    html += '<div><span>' + name_arr[n] + '</span>팀은 최근 <span>10</span>경기에서 <span>2골차 이상 패</span>을 가장 많이 기록하였습니다</div>';
                    html += '</div>';

                    html += '</div>';
                }
                $('#distribution_chart').append(html);
                html = '';

                var loop_node, loop_class, max_text, a_loop_node, a_loop_class, a_max_text;


                /************** 득점 분포도 득점 정렬 같은 값이 있을 시 오른쪽 값 선택 시작 ***************/
                for(var b=0; b<3; b++) {
                    for(var t=6; t<10; t++) {
                        loop_node = $('#distribution_chart > div.distri_h_content > div:nth-child(' + (b + 1) + ')').children().eq(t);
                        loop_class = loop_node.attr('class');
                        a_loop_node = $('#distribution_chart > div.distri_a_content > div:nth-child(' + (b + 1) + ')').children().eq(t);
                        a_loop_class = a_loop_node.attr('class');

                        if (loop_class == 'distri_selected') {
                            max_text = loop_node.text();
                        }
                        if (a_loop_class == 'distri_selected') {
                            a_max_text = a_loop_node.text();
                        }

                        for (var v = 6; v < 10; v++) {
                            var loop_node2 = $('#distribution_chart > div.distri_h_content > div:nth-child(' + (b + 1) + ')').children().eq(v),
                                loop_class2 = loop_node2.attr('class');
                            var a_loop_node2 = $('#distribution_chart > div.distri_a_content > div:nth-child(' + (b + 1) + ')').children().eq(v),
                                a_loop_class2 = a_loop_node2.attr('class');

                            if (loop_class2 == 'distri_selected') max_text = loop_node2.text();
                            if (loop_node2.text() == max_text && loop_node2.attr('class') !== 'distri_selected') {
                                loop_node2.addClass('distri_selected');
                                loop_node2.append('<em class="distri_selected_box"></em>');
                            }
                            if (a_loop_class2 == 'distri_selected') a_max_text = a_loop_node2.text();
                            if (a_loop_node2.text() == a_max_text && a_loop_node2.attr('class') !== 'distri_selected') {
                                a_loop_node2.addClass('distri_selected');
                                a_loop_node2.append('<em class="distri_selected_box"></em>');
                            }
                        }
                    }
                }
                var title_text = null;
                var title_text2 = null;
                for(var c=0; c<3; c++) {
                    var insert_class = $('#distribution_chart > div.distri_h_content > div:nth-child(' + (c + 1) + ')').find('.distri_selected_box');
                    var a_insert_class = $('#distribution_chart > div.distri_a_content > div:nth-child(' + (c + 1) + ')').find('.distri_selected_box');
                    var standard_num = 1;
                    var a_standard_num = 1;

                    if(insert_class.length > 2) {
                        for (var v = 0; v < insert_class.length; v++) {
                            if (standard_num !== 1 && standard_num !== insert_class.length) {
                                insert_class.eq(v).parent().removeClass('distri_selected');
                                insert_class.eq(v).remove();
                            }
                            if(c==0) {
                                if (standard_num === insert_class.length) {
                                    var last_val_index = insert_class.eq(v).parent().index();
                                    title_text = $('#distribution_chart > div:nth-child(5) > div:nth-child(' + (last_val_index + 1) + ')').text();
                                }
                            }
                            standard_num++;
                        }
                    }
                    if(a_insert_class.length > 2) {
                        for (var v = 0; v < a_insert_class.length; v++) {
                            if (a_standard_num !== 1 && a_standard_num !== a_insert_class.length) {
                                a_insert_class.eq(v).parent().removeClass('distri_selected');
                                a_insert_class.eq(v).remove();
                            }
                            if(c==0) {
                                if (a_standard_num === a_insert_class.length) {
                                    var a_last_val_index = a_insert_class.eq(v).parent().index();
                                    console.log(a_last_val_index + '   c번값 = ' + c);
                                    title_text2 = $('#distribution_chart > div:nth-child(5) > div:nth-child(' + (a_last_val_index + 1) + ')').text();
                                }
                            }
                            a_standard_num++;
                        }
                    }

                }
                /************** 득점 분포도 득점 정렬 같은 값이 있을 시 오른쪽 값 선택 끝 ***************/


                //var result_text_arr = ['을','을','를','를','를','을','을','을','을'];
                var h_max_val_index = total_arr[0][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                var h_max_val_index2 = total_arr2[0][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                var a_max_val_index = total_arr[1][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                var a_max_val_index2 = total_arr2[1][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                var h_result_text = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (h_max_val_index+2) + ')').text();
                var h_result_text2 = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (5+(h_max_val_index2+2)) + ')').text();
                var a_result_text = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (a_max_val_index+2) + ')').text();
                var a_result_text2 = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (5+(a_max_val_index2+2)) + ')').text();
                console.log(title_text);
                console.log(title_text2);
                console.log(a_result_text);
                console.log(a_result_text2);

                if(title_text == null) {
                    $DOCUMENT.find('#distribution_chart > .distri_h_content .distri_result div span:nth-child(3)').text(h_result_text + ' / ' + h_result_text2);
                }else{
                    $DOCUMENT.find('#distribution_chart > .distri_h_content .distri_result div span:nth-child(3)').text(h_result_text + ' / ' + title_text);
                }
                if(title_text2 == null) {
                    $DOCUMENT.find('#distribution_chart > .distri_a_content .distri_result div span:nth-child(3)').text(a_result_text + ' / ' + a_result_text2);
                }else{
                    $DOCUMENT.find('#distribution_chart > .distri_a_content .distri_result div span:nth-child(3)').text(a_result_text + ' / ' + title_text2);
                }

                /****************************************** 득점 분포도 끝 **************************************************************/

                /****************************************** 최근 5경기 공격력 / 수비력 시작 ***********************************************/

                var att_home = att_data.home,
                    att_away = att_data.away,
                    def_home = def_data.home,
                    def_away = def_data.away;

                var att_home_val_arr = [], att_away_val_arr = [], att_home_per_val_arr = [], att_away_per_val_arr = [];
                var def_home_val_arr = [], def_away_val_arr = [], def_home_per_val_arr = [], def_away_per_val_arr = [];
                var h_set_arr = [],
                    h_val_result = [att_home_val_arr, def_home_val_arr],
                    a_val_result = [att_away_val_arr, def_away_val_arr],
                    h_per_result = [att_home_per_val_arr, def_home_per_val_arr],
                    a_per_result = [att_away_per_val_arr, def_away_per_val_arr],
                    att_def_id_arr = ['att_analysis','def_analysis'],
                    att_def_class_arr = ['att_content','def_content'];


                var att_class = ['att_goal','att_poss','att_shoot','att_eshoot','att_freekick','att_corner'],
                    att_name = ['득점','점유율(%)','슈팅','유효슈팅','프리킥','코너킥'],
                    att_key = ['goal','possession','shots','shots_on_goal','free_kicks','corner_kicks'];

                var def_class = ['def_lose','def_poss','def_shoot','def_eshoot','def_freekick','def_corner','def_fouls','def_ycard'],
                    def_name = ['실점','점유율 허용(%)','슈팅 허용','유효슈팅 허용','프리킥 허용','코너킥 허용','파울 개수','경고 개수'],
                    def_key = ['goal','possession','shots','shots_on_goal','free_kicks','corner_kicks','fouls','yellow_cards'];

                var key_arr = [att_key, def_key],
                    name_arr = [att_name, def_name],
                    class_arr = [att_class, def_class],
                    home_data_arr = [att_home, def_home],
                    away_data_arr = [att_away, def_away];

                $('#att_analysis > div.team_title > div:nth-child(1)').text(home_name);
                $('#att_analysis > div.team_title > div:nth-child(2)').text(away_name);
                $('#def_analysis > div.team_title > div:nth-child(1)').text(home_name);
                $('#def_analysis > div.team_title > div:nth-child(2)').text(away_name);

                for(var s=0; s<key_arr.length; s++) {
                    for (var f = 0; f < key_arr[s].length; f++) {
                        var home_val = home_data_arr[s][key_arr[s][f]],
                            away_val = away_data_arr[s][key_arr[s][f]],
                            total_val = parseFloat(home_val) + parseFloat(away_val),
                            home_per_val = _Fn.analysis_graph_per(home_val, total_val),
                            away_per_val = _Fn.analysis_graph_per(away_val, total_val);

                        if (name_arr[s][f] == '점유율(%)' || name_arr[s][f] == '점유율 허용(%)') {
                            if(s == 0) {
                                home_per_val = home_val + '%';
                                away_per_val = away_val + '%';
                                console.log(home_val);
                                console.log(away_val);
                            }else{
                                home_per_val = away_val + '%';
                                away_per_val = home_val + '%';
                                console.log(home_val);
                                console.log(away_val);
                            }
                        }
                        h_val_result[s].push(home_val);
                        a_val_result[s].push(away_val);
                        h_per_result[s].push(home_per_val);
                        a_per_result[s].push(away_per_val);
                    }
                    h_set_arr[s] = [h_val_result, a_val_result, h_per_result, a_per_result];
                }
                console.log(h_per_result);
                console.log(a_per_result);
                console.log(h_val_result);
                console.log(a_val_result);
                for(var n=0; n<h_val_result.length; n++) {
                    for (var g = 0; g < class_arr[n].length; g++) {
                        if ((h_val_result[n][g] != null || a_val_result[n][g] != undefined)) {

                            html += '<div class="' + class_arr[n][g] + '">';
                            html += '<div>';
                            if (class_arr[n][g] == 'att_corner' || class_arr[n][g] == 'att_freekick' ||
                                class_arr[n][g] == 'def_corner' || class_arr[n][g] == 'def_freekick' ||
                                class_arr[n][g] == 'def_fouls' || class_arr[n][g] == 'def_ycard') {
                                html += '<div class="color_back" style="width: 80px;">';
                            } else {
                                html += '<div class="color_back">';
                            }
                            if ((h_val_result[n][g] > a_val_result[n][g]) || (h_val_result[n][g] == a_val_result[n][g])) {
                                html += '<div class="color_g" style="background-color: ' + home_c + '; width: ' + h_per_result[n][g] + ';"></div>';
                            } else if (h_val_result[n][g] < a_val_result[n][g]) {
                                html += '<div class="color_g" style="width: ' + h_per_result[n][g] + ';"></div>';
                            }
                            html += '</div>';
                            html += '</div>';
                            html += '<div>';
                            if (h_val_result[n][g] == 0) {
                                html += '<span>-</span>';
                            } else {
                                html += '<span>' + h_val_result[n][g] + '</span>';
                            }
                            html += '</div>';
                            html += '<div>|</div>';
                            html += '<div>';
                            html += '<span>' + name_arr[n][g] + '</span>';
                            html += '</div>';
                            html += '<div>|</div>';
                            html += '<div>';
                            if (a_val_result[n][g] == 0) {
                                html += '<span>-</span>';
                            } else {
                                html += '<span>' + a_val_result[n][g] + '</span>';
                            }
                            html += '</div>';
                            html += '<div>';
                            if (class_arr[n][g] == 'att_corner' || class_arr[n][g] == 'att_freekick' ||
                                class_arr[n][g] == 'def_corner' || class_arr[n][g] == 'def_freekick' ||
                                class_arr[n][g] == 'def_fouls' || class_arr[n][g] == 'def_ycard') {
                                html += '<div class="color_back" style="width: 80px;">';
                            } else {
                                html += '<div class="color_back">';
                            }
                            if ((h_val_result[n][g] < a_val_result[n][g]) || (h_val_result[n][g] == a_val_result[n][g])) {
                                html += '<div class="color" style="background-color: ' + away_c + '; width: ' + a_per_result[n][g] + ';"></div>';
                            } else if (h_val_result[n][g] > a_val_result[n][g]) {
                                html += '<div class="color_g" style="width: ' + a_per_result[n][g] + ';"></div>';
                            }
                            html += '</div>';
                            html += '</div>';
                            html += '</div>';
                        }
                    }
                    $('#'+att_def_id_arr[n]+' > div.'+att_def_class_arr[n]+'').append(html);
                    html='';
                }

                /****************************************** 최근 5경기 공격력 / 수비력 끝 ***********************************************/
            },
            relative_record_event: function(_this, latest_game_val, league_val) {
                var html = '',
                    home_idx = $('#analysis_title > div.team_info > div.home_info').data('home_idx'),
                    away_idx = $('#analysis_title > div.team_info > div.away_info').data('away_idx'),
                    all_class = $('#relative_record > div.filter_nav > div:nth-child(3)').attr('class'),
                    home_away_class = $('#relative_record > div.filter_nav > div:nth-child(4)').attr('class'),
                    relative_content_adr = $DOCUMENT.find('#relative_record > div.game_content'),
                    relative_length = relative_content_adr.children().not('.no_game').length,
                    no_game_length = relative_content_adr.children('.no_game').length;


                _this.children('option:selected').attr('selected', true);
                _this.children('option:selected').siblings().attr('selected',false);

                var goal_value = 0, lose_value = 0, goal_arr = [], lose_arr = [], all_arr = [[],[],[]];

                if (parseInt(latest_game_val) == 1) {
                    latest_game_val = 5;
                } else if (parseInt(latest_game_val) == 2) {
                    latest_game_val = 10;
                } else if (parseInt(latest_game_val) == 3) {
                    latest_game_val = 15;
                } else if (parseInt(latest_game_val) == 4) {
                    latest_game_val = 20;
                } else if (parseInt(latest_game_val) == 5) {
                    latest_game_val = relative_content_adr.children().length;
                }
                if(no_game_length != 0){
                    relative_content_adr.find('.no_game').remove();
                }
                for(var g=0; g<relative_length; g++) {
                    if(g < latest_game_val) {
                        relative_content_adr.children('div:nth-child(' + (g + 1) + ')').removeClass('nonDisplay');
                    }else{
                        relative_content_adr.children('div:nth-child(' + (g + 1) + ')').addClass('nonDisplay');
                    }
                }
                var not_nonDisplay_length = relative_content_adr.children().not('.nonDisplay').length;
                for(var s=0; s<not_nonDisplay_length; s++) {
                    var loop_content_adr = relative_content_adr.children('div:nth-child(' + (s + 1) + ')'),
                        loop_league_idx_adr = relative_content_adr.children('div:nth-child(' + (s + 1) + ')').children('div:nth-child(1)'),
                        loop_home_idx_adr = relative_content_adr.children('div:nth-child(' + (s + 1) + ')').children('div:nth-child(5)'),
                        loop_away_idx_adr = relative_content_adr.children('div:nth-child(' + (s + 1) + ')').children('div:nth-child(7)'),
                        loop_league_idx  = loop_league_idx_adr.data('league_idx'),
                        loop_home_idx = loop_home_idx_adr.data('home_idx'),
                        loop_away_idx = loop_away_idx_adr.data('away_idx');

                    if(league_val != 0) {
                        if(all_class == 'all_game latest_selected') {
                            if(loop_league_idx == league_val){
                                if(loop_home_idx == home_idx){
                                    goal_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                                    lose_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                                }else {
                                    goal_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                                    lose_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                                }
                                if(goal_value) {
                                    goal_arr.push(goal_value);
                                    lose_arr.push(lose_value);
                                }
                            }else {
                                loop_content_adr.addClass('nonDisplay');
                            }
                        }else if(home_away_class == 'home_away_game latest_selected') {
                            if(loop_league_idx == league_val){
                                if(loop_home_idx == home_idx){
                                    goal_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                                    lose_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();

                                    if(goal_value) {
                                        goal_arr.push(goal_value);
                                        lose_arr.push(lose_value);
                                    }
                                }else{
                                    loop_content_adr.addClass('nonDisplay');
                                }
                            }else {
                                loop_content_adr.addClass('nonDisplay');
                            }
                        }
                    }else {
                        if(all_class == 'all_game latest_selected') {
                            if(loop_home_idx == home_idx) {
                                goal_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                                lose_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            }else {
                                goal_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                                lose_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            }
                            if(goal_value) {
                                goal_arr.push(goal_value);
                                lose_arr.push(lose_value);
                            }
                        }else if(home_away_class == 'home_away_game latest_selected') {
                            if(loop_home_idx == home_idx){
                                goal_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                                lose_value = loop_home_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();

                                if(goal_value) {
                                    goal_arr.push(goal_value);
                                    lose_arr.push(lose_value);
                                }
                            }else {
                                loop_content_adr.addClass('nonDisplay');
                            }
                        }
                    }
                }
                for(var s=0; s<goal_arr.length; s++){
                    if(goal_arr[s] > lose_arr[s]){
                        all_arr[0].push(1);
                    }else if(goal_arr[s] < lose_arr[s]) {
                        all_arr[2].push(1);
                    }else if(goal_arr[s] == lose_arr[s]) {
                        all_arr[1].push(1);
                    }
                }
                var h_win_game = all_arr[0].length,
                    draw_game = all_arr[1].length,
                    h_lose_game = all_arr[2].length,
                    total_game = h_win_game+draw_game+h_lose_game,
                    h_win_per = _Fn.analysis_graph_per(h_win_game, total_game),
                    draw_per = _Fn.analysis_graph_per(draw_game, total_game),
                    h_lose_per = _Fn.analysis_graph_per(h_lose_game, total_game),
                    lose_css = parseInt(h_lose_per),
                    win_css = parseInt(lose_css) + parseInt(h_win_per),
                    val_css = 'conic-gradient(#ffd46e 0% ' + lose_css + '%, #517dc9 ' + lose_css + '% ' + win_css + '%, #9ca0a8 ' + win_css + '% 100%)';

                $DOCUMENT.find('#relative_record > div.graph > div.graph_content > div:nth-child(2) > div.donut_graph > div.donut_color').css({
                    background: val_css
                });

                $('#relative_record > div.graph > div.home_info > div > div:nth-child(2) > span').text(h_win_game+'승'+draw_game+'무'+h_lose_game+'패');
                $('#relative_record > div.graph > div.away_info > div > div:nth-child(2) > span').text(h_lose_game+'승'+draw_game+'무'+h_win_game+'패');
                $('#relative_record > div.graph > div.graph_content > div:nth-child(1) > div:nth-child(3)').text(((h_win_game/total_game)*100).toFixed(1)+'%');
                $('#relative_record > div.graph > div.graph_content > div:nth-child(2) > div:nth-child(3)').text(((draw_game/total_game)*100).toFixed(1)+'%');
                $('#relative_record > div.graph > div.graph_content > div:nth-child(3) > div:nth-child(3)').text(((h_lose_game/total_game)*100).toFixed(1)+'%');
                $('#relative_record > div.graph > div.graph_content > div:nth-child(1) > div:nth-child(2) > div > div > span').text(h_win_game);
                $('#relative_record > div.graph > div.graph_content > div:nth-child(2) > div.donut_graph > div > span').text(draw_game);
                $('#relative_record > div.graph > div.graph_content > div:nth-child(3) > div:nth-child(2) > div > div > span').text(h_lose_game);
                $('#relative_record > div.graph > div.graph_content > div:nth-child(1) > div:nth-child(2) > div > div').css('width', h_win_per);
                $('#relative_record > div.graph > div.graph_content > div:nth-child(3) > div:nth-child(2) > div > div').css('width', h_lose_per);

                var nonDisplay_length = relative_content_adr.children('div').not('.nonDisplay').length;
                if(nonDisplay_length == 0){
                    // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
                    //     button: "확인",
                    // });
                    html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
                    relative_content_adr.append(html);
                    html = '';
                }
            },
            relative_record_stats_event: function(_this, latest_game_val, league_val, opp_data) {
                var html = '',
                    relative_content_adr = $DOCUMENT.find('#relative_record > div.game_content'),
                    home_c = '#517dc9',
                    away_c = '#ffd46e',
                    opp_home = opp_data.home,
                    opp_away = opp_data.away,
                    opp_home_list = opp_home.list,
                    opp_away_list = opp_away.list,
                    opp_list_arr = [opp_home_list, opp_away_list],
                    opp_list_fs = opp_data.firstsecond.list,
                    opp_home_config = opp_home.config,
                    opp_away_config = opp_away.config,
                    split_home_win = opp_home.home.split('승'),
                    home_win = split_home_win[0],
                    split_home_draw = opp_home.home.substr(3).split('무'),
                    home_draw = split_home_draw[0],
                    split_home_lose = opp_home.home.substr(6).split('패'),
                    home_lose = split_home_lose[0],
                    home_game_count = parseInt(home_win) + parseInt(home_draw) + parseInt(home_lose),
                    home_win_per = (home_win / home_game_count) * 100,
                    home_draw_per = (home_draw / home_game_count) * 100,
                    home_lose_per = (home_lose / home_game_count) * 100,
                    split_away_win = opp_away.home.split('승'),
                    away_win = split_away_win[0],
                    split_away_draw = opp_away.home.substr(3).split('무'),
                    away_draw = split_away_draw[0],
                    split_away_lose = opp_away.home.substr(6).split('패'),
                    away_lose = split_away_lose[0],
                    away_game_count = parseInt(away_win) + parseInt(away_draw) + parseInt(away_lose),
                    away_win_per = (away_win / away_game_count) * 100,
                    away_draw_per = (away_draw / away_game_count) * 100,
                    away_lose_per = (away_lose / away_game_count) * 100,
                    opp_content_name = ['평균 득점', '평균 실점', '전반 평균 득점', '전반 평균 실점', '후반 평균 득점', '후반 평균 실점', '슈팅', '유효 슈팅', '빗나간 슈팅', '차단된 슈팅',
                        '점유율(%)', '코너킥', '오프사이드', '골키퍼 선방', '파울', '패스', '패스 성공', '경고', '퇴장'
                    ],
                    opp_content_class = ['aver_goal', 'aver_lose', 'fh_aver_goal', 'fh_aver_lose', 'sh_aver_goal', 'sh_aver_lose', 'shoots', 'e_shoots', 'm_shoots',
                        'b_shoots', 'poss', 'corner_kick', 'offside', 'keeper_save', 'foul', 'pass', 'pass_s', 'y_card', 'r_card'
                    ],
                    avr_goal = 0, avr_lose = 0, fh_avr_goal = 0, fh_avr_lose = 0, sh_avr_goal = 0, sh_avr_lose = 0,
                    avr_shoots = 0, avr_eshoots = 0, avr_mshoots = 0,
                    avr_bshoots = 0, avr_poss = 0, avr_corner = 0, avr_offside = 0, avr_keep_save = 0, avr_foul = 0,
                    avr_pass = 0, avr_pass_s = 0,
                    avr_ycard = 0, avr_rcard = 0,
                    h_opp_content_val = [avr_goal, avr_lose, fh_avr_goal, fh_avr_lose, sh_avr_goal, sh_avr_lose, avr_shoots, avr_eshoots, avr_mshoots,
                        avr_bshoots, avr_poss, avr_corner, avr_offside, avr_keep_save, avr_foul, avr_pass, avr_pass_s, avr_ycard, avr_rcard
                    ],
                    avr_goal2 = 0, avr_lose2 = 0, fh_avr_goal2 = 0, fh_avr_lose2 = 0, sh_avr_goal2 = 0,
                    sh_avr_lose2 = 0, avr_shoots2 = 0, avr_eshoots2 = 0, avr_mshoots2 = 0,
                    avr_bshoots2 = 0, avr_poss2 = 0, avr_corner2 = 0, avr_offside2 = 0, avr_keep_save2 = 0,
                    avr_foul2 = 0, avr_pass2 = 0, avr_pass_s2 = 0,
                    avr_ycard2 = 0, avr_rcard2 = 0,
                    a_opp_content_val = [avr_goal2, avr_lose2, fh_avr_goal2, fh_avr_lose2, sh_avr_goal2, sh_avr_lose2, avr_shoots2, avr_eshoots2, avr_mshoots2,
                        avr_bshoots2, avr_poss2, avr_corner2, avr_offside2, avr_keep_save2, avr_foul2, avr_pass2, avr_pass_s2, avr_ycard2, avr_rcard2
                    ],
                    opp_val_arr = [h_opp_content_val, a_opp_content_val];

                var home_team_idx = $('#analysis_title > div.team_info > div.home_info').data('home_idx');


                if (parseInt(latest_game_val) == 1) {
                    latest_game_val = 5;
                } else if (parseInt(latest_game_val) == 2) {
                    latest_game_val = 10;
                } else if (parseInt(latest_game_val) == 3) {
                    latest_game_val = 15;
                } else if (parseInt(latest_game_val) == 4) {
                    latest_game_val = 20;
                } else if (parseInt(latest_game_val) == 5) {
                    latest_game_val = relative_content_adr.children().length;
                }
                var not_nonDisplay_length = relative_content_adr.children().not('.nonDisplay').length;

                for (var s = 0; s < opp_val_arr.length; s++) {
                    for (var m = 0; m < opp_home_list.length; m++) {
                        var loop_non_adr = relative_content_adr.find('div:nth-child('+(m+1)+')').hasClass('nonDisplay');

                        if(loop_non_adr == false) {
                            if (s == 0) {
                                if (home_team_idx == opp_list_arr[s][m].home_idx) {
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].home_goal);
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].away_goal);
                                } else {
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].away_goal);
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].home_goal);
                                }

                                opp_val_arr[s][2] += parseInt(opp_list_fs[m].firstscore.substr(0, 1));
                                opp_val_arr[s][3] += parseInt(opp_list_fs[m].firstscore.substr(2, 1));
                                if(opp_list_fs[m].secondscore != null) {
                                    opp_val_arr[s][4] += parseInt(opp_list_fs[m].secondscore.substr(0, 1));
                                    opp_val_arr[s][5] += parseInt(opp_list_fs[m].secondscore.substr(2, 1));
                                }else {
                                    opp_val_arr[s][4] += 0;
                                    opp_val_arr[s][5] += 0;
                                }
                            } else if (s == 1) {
                                if (home_team_idx != opp_list_arr[s][m].home_idx) {
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].away_goal);
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].home_goal);
                                } else {
                                    opp_val_arr[s][1] += parseInt(opp_list_arr[s][m].home_goal);
                                    opp_val_arr[s][0] += parseInt(opp_list_arr[s][m].away_goal);
                                }

                                opp_val_arr[s][3] += parseInt(opp_list_fs[m].firstscore.substr(0, 1));
                                opp_val_arr[s][2] += parseInt(opp_list_fs[m].firstscore.substr(2, 1));
                                if(opp_list_fs[m].secondscore != null) {
                                    opp_val_arr[s][5] += parseInt(opp_list_fs[m].secondscore.substr(0, 1));
                                    opp_val_arr[s][4] += parseInt(opp_list_fs[m].secondscore.substr(2, 1));
                                }else {
                                    opp_val_arr[s][5] += 0;
                                    opp_val_arr[s][4] += 0;
                                }
                            }
                            opp_val_arr[s][6] += parseInt(opp_list_arr[s][m].shots);
                            opp_val_arr[s][7] += parseInt(opp_list_arr[s][m].shots_ot);
                            opp_val_arr[s][8] += parseInt(opp_list_arr[s][m].off_target);
                            opp_val_arr[s][9] += parseInt(opp_list_arr[s][m].blocked);
                            opp_val_arr[s][10] += parseInt(opp_list_arr[s][m].possession);
                            //avr_free += parseInt(opp_home_list[m].possession);
                            opp_val_arr[s][11] += parseInt(opp_list_arr[s][m].corner);
                            opp_val_arr[s][12] += parseInt(opp_list_arr[s][m].offsides);
                            opp_val_arr[s][13] += parseInt(opp_list_arr[s][m].saves);
                            opp_val_arr[s][14] += parseInt(opp_list_arr[s][m].fouls);
                            opp_val_arr[s][15] += parseInt(opp_list_arr[s][m].passes);
                            opp_val_arr[s][16] += parseInt(opp_list_arr[s][m].passes_success);
                            opp_val_arr[s][17] += parseInt(opp_list_arr[s][m].yellow_card);
                            opp_val_arr[s][18] += parseInt(opp_list_arr[s][m].red_card);
                        }
                    }
                }
                for (var n = 0; n < opp_content_name.length; n++) {
                    var h_data_avr = opp_val_arr[0][n] / not_nonDisplay_length,
                        a_data_avr = opp_val_arr[1][n] / not_nonDisplay_length;

                    if ((opp_val_arr[0][n] !== 0) && (opp_val_arr[1][n] !== 0) && (!isNaN(h_data_avr) == true && !isNaN(a_data_avr) == true)) {
                        html += '<div class="' + opp_content_class[n] + '">';
                        html += '<div>';
                        html += '<div class="color_back">';

                        if (opp_val_arr[0][n] > opp_val_arr[1][n] || opp_val_arr[0][n] == opp_val_arr[1][n]) {
                            html += '<div class="color" style="background-color: ' + home_c + '; width: ' + _Fn.analysis_graph_per(h_data_avr, ((h_data_avr) + (a_data_avr))) + ';"></div>';
                        } else if (opp_val_arr[0][n] < opp_val_arr[1][n]) {
                            html += '<div class="color_g" style="width: ' + _Fn.analysis_graph_per(h_data_avr, ((h_data_avr) + (a_data_avr))) + ';"></div>';
                        }

                        html += '</div>';
                        html += '</div>';
                        html += '<div>';

                        if (h_data_avr % 1 === 0) {
                            if(h_data_avr == 0){
                                html += '<span>-</span>';
                            }else {
                                html += '<span>' + h_data_avr + '</span>';
                            }
                        } else {
                            html += '<span>' + h_data_avr.toFixed(1) + '</span>';
                        }

                        html += '</div>';
                        html += '<div>|</div>';
                        html += '<div>';
                        html += '<span>' + opp_content_name[n] + '</span>';
                        html += '</div>';
                        html += '<div>|</div>';
                        html += '<div>';

                        if (a_data_avr % 1 === 0) {
                            if(a_data_avr == 0){
                                html += '<span>-</span>';
                            }else {
                                html += '<span>' + a_data_avr + '</span>';
                            }
                        } else {
                            html += '<span>' + a_data_avr.toFixed(1) + '</span>';
                        }

                        html += '</div>';
                        html += '<div>';
                        html += '<div class="color_back">';

                        if (opp_val_arr[0][n] < opp_val_arr[1][n] || opp_val_arr[0][n] == opp_val_arr[1][n]) {
                            html += '<div class="color" style="background-color: ' + away_c + '; width: ' + _Fn.analysis_graph_per(a_data_avr, (h_data_avr + a_data_avr)) + ';"></div>';
                        } else if (opp_val_arr[0][n] > opp_val_arr[1][n]) {
                            html += '<div class="color_g" style="width: ' + _Fn.analysis_graph_per(a_data_avr, (h_data_avr + a_data_avr)) + ';"></div>';
                        }
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    }
                }
                $('#relative_record .opponent_content').children().remove();
                $('#relative_record .opponent_content').append(html);
            },
            detail_graph_draw: function() {
                var json_data = _analysis_json.detail_page_2,
                    goal_15_h_data = json_data.p2_3.d3.total.div_home,
                    goal_15_a_data = json_data.p2_3.d3.total.div_away,
                    loss_15_h_data = json_data.p2_3.d4.total.div_home,
                    loss_15_a_data = json_data.p2_3.d4.total.div_away,
                    goal_10_h_data = json_data.p2_3.d5.total.div_home,
                    goal_10_a_data = json_data.p2_3.d5.total.div_away,
                    loss_10_h_data = json_data.p2_3.d6.total.div_home,
                    loss_10_a_data = json_data.p2_3.d6.total.div_away,
                    formation_h_data = _analysis_json.detail_page_4.p4_1.d2.div_home.recent,
                    formation_a_data = _analysis_json.detail_page_4.p4_1.d2.div_away.recent;

                var id_arr = ['goal_15_time','loss_15_time','goal_10_time','loss_10_time','h_formation_d_line','a_formation_d_line'],
                    first_data_arr = [goal_15_h_data,loss_15_h_data,goal_10_h_data,loss_10_h_data,formation_h_data,formation_a_data],
                    second_data_arr = [goal_15_a_data,loss_15_a_data,goal_10_a_data,loss_10_a_data,formation_h_data,formation_a_data];
                for(var i=0; i<id_arr.length; i++) {
                    var goal_15_id = id_arr[i],
                        goal_15_labels,
                        goal_15_first_back_c = 'rgba(81, 125, 201, 1)',
                        goal_15_first_border_c = 'rgba(81, 125, 201, 1)',
                        goal_15_first_pointback_c = 'rgba(81, 125, 201, 1)',
                        goal_15_second_back_c = 'rgba(255, 94, 55, 0.03)',
                        goal_15_second_border_c = 'rgba(255, 94, 55, 1)',
                        goal_15_second_pointback_c = 'rgba(255, 94, 55, 1)',
                        goal_15_tool_id = 'h_chartjs-tooltip',
                        goal_15_first_data, goal_15_second_data,
                        graph_type = 'line';

                    if(i === 2 || i === 3){
                        goal_15_first_data = [first_data_arr[i].time_0_10, first_data_arr[i].time_11_20, first_data_arr[i].time_21_30,
                            first_data_arr[i].time_31_40, first_data_arr[i].time_41_50, first_data_arr[i].time_51_60, first_data_arr[i].time_61_70,
                            first_data_arr[i].time_71_80, first_data_arr[i].time_81_90],
                        goal_15_second_data = [second_data_arr[i].time_0_10, second_data_arr[i].time_11_20, second_data_arr[i].time_21_30,
                            second_data_arr[i].time_31_40, second_data_arr[i].time_41_50, second_data_arr[i].time_51_60, second_data_arr[i].time_61_70,
                            second_data_arr[i].time_71_80, second_data_arr[i].time_81_90];
                        goal_15_labels = ['00-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90'];
                    }else if(i === 0 || i === 1){
                        goal_15_first_data = [first_data_arr[i].time_0_15, first_data_arr[i].time_16_30, first_data_arr[i].time_31_45,
                            first_data_arr[i].time_46_60, first_data_arr[i].time_61_75, first_data_arr[i].time_76_90],
                        goal_15_second_data = [second_data_arr[i].time_0_15, second_data_arr[i].time_16_30, second_data_arr[i].time_31_45,
                            second_data_arr[i].time_46_60, second_data_arr[i].time_61_75, second_data_arr[i].time_76_90];
                        goal_15_labels = ['00-15', '16-30', '31-45', '46-60', '61-75', '76-90'];
                    }else if(i === 4 || i === 5){
                        console.log(i);
                        console.log(first_data_arr[i].length);
                        goal_15_first_data = [];
                        goal_15_second_data = [];
                        goal_15_labels = [];
                        if(first_data_arr[i].length === 0){
                            goal_15_first_data = [0,0,0,0,0];
                            goal_15_second_data = [0,0,0,0,0];
                            goal_15_labels = ['00-00','00-00','00-00','00-00','00-00'];
                        }
                        for(var x=0; x<first_data_arr[i].length; x++){
                            console.log(first_data_arr[i]);
                            console.log(first_data_arr[i][x]);
                            console.log(x);

                            goal_15_first_data.push(first_data_arr[i][x].goal);
                            goal_15_second_data.push(second_data_arr[i][x].lose);
                            goal_15_labels.push(first_data_arr[i][x].game_date);
                        }
                    }
                    var graph_type = 'line';
                    var goal_15_arr = [goal_15_id, goal_15_labels, goal_15_first_back_c, goal_15_first_border_c, goal_15_first_pointback_c,
                            goal_15_first_data, goal_15_second_back_c, goal_15_second_border_c, goal_15_second_pointback_c, goal_15_second_data,
                            goal_15_tool_id, graph_type];
                    console.log(goal_15_arr);
                    _Analysis.detail_line_graph(goal_15_arr);
                }
            },
            detail_line_graph: function(arr) {
                var ctx = document.getElementById(arr[0]).getContext('2d');
                var label_data = [],
                    goal_data = [],
                    lose_data = [],
                    y_dis,
                    tension;
                for(var b=0; b<arr[1].length; b++){
                    label_data[b] = arr[1][b];
                    goal_data[b] = arr[5][b];
                    lose_data[b] = arr[9][b];
                }
                if(arr[0] === 'h_formation_d_line' || arr[0] === 'a_formation_d_line'){
                    y_dis = true;
                    tension = 0.4;
                }else {
                    y_dis = false;
                    tension = 0;
                }
                var config = {
                    type: arr[11],
                    data: {
                        labels: label_data,
                        datasets: [{
                            label: '홈팀',
                            backgroundColor: arr[2],
                            borderColor: arr[3],
                            pointStyle: 'circle',
                            pointBackgroundColor: arr[4],
                            pointBorderColor: arr[4],
                            pointBorderWidth: 1,
                            pointHitRadius: 1,
                            pointHoverBorderWidth: 6,
                            pointHoverBorderColor: 'rgba(63, 66, 87, 0.16)',
                            pointHoverRadius: 3,
                            borderWidth: 1,
                            lineTension: tension,
                            //pointDotRadius : 5, // 포인트 크기
                            fill: false,
                            data: goal_data,
                        }, {
                            label: '원정팀',
                            backgroundColor: arr[6],
                            borderColor: arr[7],
                            pointStyle: 'circle',
                            pointBackgroundColor: arr[8],
                            pointBorderColor: arr[8],
                            pointBorderWidth: 1,
                            pointHitRadius: 1,
                            pointHoverBorderWidth: 6,
                            pointHoverBorderColor: 'rgba(63, 66, 87, 0.16)',
                            pointHoverRadius: 3,
                            borderWidth: 1,
                            lineTension: tension,
                            //pointDotRadius : 5, // 포인트 크기
                            fill: false,
                            data: lose_data,
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            fontColor: 'rgba(34, 34, 34, 1)',
                            fontSize: 1,
                            fontFamily: 'Nanum Gothic',
                            text: ' ',
                            position: 'top'
                        },
                        legend: {
                            display: false,
                            fontColor : 'rgba(154, 159, 191, 1)',
                            fontSize : 12,
                            fontFamily: 'Nanum Gothic',
                            position: 'top'
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    display: y_dis,
                                    beginAtZero: true,
                                    stepSize : 1,
                                    fontColor : "rgba(154, 159, 191, 1)",
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                    padding: 0,
                                },
                                gridLines:{
                                    color: 'rgba(248, 248, 248, 1)',
                                    lineWidth:1
                                }
                            }],
                            xAxes: [{
                                ticks:{
                                    fontColor : 'rgba(154, 159, 191, 1)',
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                    padding: 0
                                },
                                gridLines:{
                                    color: "rgba(248, 248, 248, 1)",
                                    lineWidth: 1
                                }
                            }]
                        }

                        // tooltips: {
                        //     enabled: false,
                        //     mode: 'index',
                        //     position: 'nearest',
                        //     custom: customTooltips
                        // }
                    }
                };
                if(arr[0] === 'goal_15_time') {
                    goal_15_detail_chart = new Chart(ctx, config);
                }else if(arr[0] === 'loss_15_time') {
                    loss_15_detail_chart = new Chart(ctx, config);
                }else if(arr[0] === 'goal_10_time') {
                    goal_10_detail_chart = new Chart(ctx, config);
                }else if(arr[0] === 'loss_10_time') {
                    loss_10_detail_chart = new Chart(ctx, config);
                }else if(arr[0] === 'h_formation_d_line') {
                    h_formation_d_line_chart = new Chart(ctx, config);
                }else if(arr[0] === 'a_formation_d_line') {
                    a_formation_d_line_chart = new Chart(ctx, config);
                }
            },
            datail_goalkeeper_graph_draw: function() {
                var json_data = _analysis_json.detail_page_3,
                    data_h = json_data.p3_5.d2.div_home,
                    data_a = json_data.p3_5.d2.div_away;

                var id_arr = ['h_keeper_e_shoot','a_keeper_e_shoot','h_keeper_defense','a_keeper_defense','h_defense_rate','a_defense_rate'],
                    first_data_arr = [data_h.recent,data_a.recent];
                for(var i=0; i<id_arr.length; i++) {
                    var _id = id_arr[i],
                        _labels,
                        _first_back_c,
                        _first_border_c,
                        _first_pointback_c,
                        _tool_id = 'h_chartjs-tooltip',
                        _first_data, _graph_type, key;

                    if(i === 0 || i === 1){
                        key = 'shots_on_permit';
                        _graph_type = 'bar';
                        _first_back_c = 'rgba(63, 66, 87, 1)';
                        _first_border_c = 'rgba(63, 66, 87, 1)';
                        _first_pointback_c = 'rgba(63, 66, 87, 1)';
                    }else if(i === 2 || i === 3){
                        key = 'save';
                        _graph_type = 'line';
                        _first_back_c = 'rgba(35, 177, 228, 1)';
                        _first_border_c = 'rgba(35, 177, 228, 1)';
                        _first_pointback_c = 'rgba(35, 177, 228, 1)';
                    }else if(i === 4 || i === 5){
                        key = 'save_per';
                        _graph_type = 'line';
                        _first_back_c = 'rgba(255, 156, 49, 1)';
                        _first_border_c = 'rgba(255, 156, 49, 1)';
                        _first_pointback_c = 'rgba(255, 156, 49, 1)';
                    }

                    if(i === 0 || i === 2 || i === 4){
                        var loop_data = first_data_arr[0];

                        _first_data = [loop_data[0][key], loop_data[1][key], loop_data[2][key], loop_data[3][key], loop_data[4][key]];
                        _labels = [loop_data[0].game_date, loop_data[1].game_date, loop_data[2].game_date, loop_data[3].game_date,
                            loop_data[4].game_date];
                    }else if(i === 1 || i === 3 || i === 5){
                        var loop_data = first_data_arr[1];

                        _first_data = [loop_data[0][key], loop_data[1][key], loop_data[2][key], loop_data[3][key], loop_data[4][key]];
                        _labels = [loop_data[0].game_date, loop_data[1].game_date, loop_data[2].game_date, loop_data[3].game_date,
                                loop_data[4].game_date];
                    }

                    var _arr = [_id, _labels, _first_back_c, _first_border_c, _first_pointback_c, _first_data, _tool_id, _graph_type];

                    _Analysis.detail_goalkeeper_graph(_arr);
                }
            },
            detail_goalkeeper_graph: function(arr) {
                var ctx = document.getElementById(arr[0]).getContext('2d');
                var label_data = [],
                    goal_data = [];
                for(var b=0; b<arr[1].length; b++){
                    label_data[b] = arr[1][b];
                    goal_data[b] = arr[5][b];
                }
                var config = {
                    type: arr[7],
                    data: {
                        labels: label_data,
                        datasets: [{
                            label: '홈팀',
                            backgroundColor: arr[2],
                            borderColor: arr[3],
                            pointStyle: 'circle',
                            pointBackgroundColor: arr[4],
                            pointBorderColor: arr[4],
                            pointBorderWidth: 1,
                            pointHitRadius: 1,
                            pointHoverBorderWidth: 6,
                            pointHoverBorderColor: 'rgba(63, 66, 87, 0.16)',
                            pointHoverRadius: 3,
                            borderWidth: 1,
                            lineTension: 0,
                            //pointDotRadius : 5, // 포인트 크기
                            fill: false,
                            data: goal_data,
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            fontColor: 'rgba(34, 34, 34, 1)',
                            fontSize: 1,
                            fontFamily: 'Nanum Gothic',
                            text: ' ',
                            position: 'top'
                        },
                        legend: {
                            display: false,
                            fontColor : 'rgba(154, 159, 191, 1)',
                            fontSize : 12,
                            fontFamily: 'Nanum Gothic',
                            position: 'top'
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    display: true,
                                    beginAtZero: true,
                                    fontColor : "rgba(154, 159, 191, 1)",
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                    padding: 0,
                                },
                                gridLines:{
                                    color: 'rgba(248, 248, 248, 1)',
                                    lineWidth:1
                                }
                            }],
                            xAxes: [{
                                ticks:{
                                    fontColor : 'rgba(154, 159, 191, 1)',
                                    fontSize : 11,
                                    fontFamily: 'Tahoma',
                                    padding: 0
                                },
                                gridLines:{
                                    color: "rgba(248, 248, 248, 1)",
                                    lineWidth: 1
                                }
                            }]
                        }

                        // tooltips: {
                        //     enabled: false,
                        //     mode: 'index',
                        //     position: 'nearest',
                        //     custom: customTooltips
                        // }
                    }
                };
                if(arr[0] == 'h_keeper_e_shoot') {
                    h_keeper_e_shoot_chart = new Chart(ctx, config);
                }else if(arr[0] == 'a_keeper_e_shoot') {
                    a_keeper_e_shoot_chart = new Chart(ctx, config);
                }else if(arr[0] == 'h_keeper_defense') {
                    h_keeper_defense_chart = new Chart(ctx, config);
                }else if(arr[0] == 'a_keeper_defense') {
                    a_keeper_defense_chart = new Chart(ctx, config);
                }else if(arr[0] == 'h_defense_rate') {
                    h_defense_rate_chart = new Chart(ctx, config);
                }else if(arr[0] == 'a_defense_rate') {
                    a_defense_rate_chart = new Chart(ctx, config);
                }
            },
            detail_pie_draw: function() {
                var json_data = _analysis_json.detail_page_4,
                    formation_h = json_data.p4_1.d2.div_home,
                    formation_a = json_data.p4_1.d2.div_away;

                var id_arr = ['h_formation_pie','a_formation_pie'],
                    data_arr = [formation_h, formation_a];

                for(var i=0; i<id_arr.length; i++){
                    var chart_id = id_arr[i],
                        chart_labels,
                        chart_first_back_c = ['rgba(106, 165, 199, 1)','rgba(80, 81, 79, 1)','rgba(244, 94, 88, 1)'],
                        //chart_first_border_c = 'rgba(255, 255, 255, 1)',
                        chart_first_border_c = ['rgba(106, 165, 199, 0.15)','rgba(80, 81, 79, 0.15)','rgba(244, 94, 88, 0.15)'],
                        chart_first_pointback_c = 'rgba(81, 125, 201, 1)',
                        chart_tool_id = 'h_chartjs-tooltip',
                        chart_data,
                        graph_type = 'pie';

                    var labels_w = '승 '+data_arr[i].W+'('+data_arr[i].W_per+'%)',
                        labels_d = '무 '+data_arr[i].D+'('+data_arr[i].D_per+'%)',
                        labels_l = '패 '+data_arr[i].L+'('+data_arr[i].L_per+'%)';
                    console.log('패 '+data_arr[i].L+'('+data_arr[i].L_per+'%)');
                    chart_labels = [labels_w,labels_d,labels_l];
                    chart_data = [data_arr[i].W,data_arr[i].D,data_arr[i].L];

                    var chart_arr = [chart_id,chart_labels,chart_first_back_c,chart_first_border_c,chart_first_pointback_c,chart_data,chart_tool_id,
                        graph_type];

                    _Analysis.detail_pie_graph(chart_arr);
                }
            },
            detail_pie_graph: function(arr) {
                var ctx = document.getElementById(arr[0]).getContext('2d');
                var label_data = [],
                    goal_data = [];
                for(var b=0; b<arr[1].length; b++){
                    label_data[b] = arr[1][b];
                    goal_data[b] = arr[5][b];
                }
                var config = {
                    type: arr[7],
                    data: {
                        labels: label_data,
                        datasets: [{
                            label: '홈팀 pie',
                            backgroundColor: arr[2],

                            borderColor: arr[3],
                            // pointStyle: 'circle',
                            // pointBackgroundColor: arr[4],
                            // pointBorderColor: arr[4],
                            // pointBorderWidth: 1,
                            // pointHitRadius: 1,
                            // pointHoverBorderWidth: 6,
                            // pointHoverBorderColor: 'rgba(63, 66, 87, 0.16)',
                            // pointHoverRadius: 3,
                            borderWidth: 2,
                            // lineTension: 0,
                            //pointDotRadius : 5, // 포인트 크기
                            fill: true,
                            data: goal_data,
                        }]
                    },
                    options: {
                        segmentShowStroke : true,
                        //drawOnChartArea: true,
                        responsive: true,
                        maintainAspectRatio: true,
                        //mainPieSize: 0.3,
                        title: {
                            display: false,
                            fontColor: 'rgba(34, 34, 34, 1)',
                            fontSize: 1,
                            fontFamily: 'Nanum Gothic',
                            text: ' ',
                            position: 'top'
                        },
                        legend: {
                            display: true,
                            fontColor : 'rgba(154, 159, 191, 1)',
                            fontSize : 12,
                            fontFamily: 'Nanum Gothic',
                            position: 'right',
                            //align: 'middle',
                            //usePointStyle: true,
                            labels: {
                                fontColor: "black",
                                boxWidth: 7,
                                //boxHeight: 5,
                                padding: 25
                            }
                        },
                        // scales: {
                        //     yAxes: [{
                        //         ticks: {
                        //             display: true,
                        //             beginAtZero: true,
                        //             fontColor : "rgba(154, 159, 191, 1)",
                        //             fontSize : 11,
                        //             fontFamily: 'Tahoma',
                        //             padding: 0,
                        //         },
                        //         gridLines:{
                        //             color: 'rgba(248, 248, 248, 1)',
                        //             lineWidth:1
                        //         }
                        //     }],
                        //     xAxes: [{
                        //         ticks:{
                        //             fontColor : 'rgba(154, 159, 191, 1)',
                        //             fontSize : 11,
                        //             fontFamily: 'Tahoma',
                        //             padding: 0
                        //         },
                        //         gridLines:{
                        //             color: "rgba(248, 248, 248, 1)",
                        //             lineWidth: 1
                        //         }
                        //     }]
                        // }

                        tooltips: {
                            enabled: false,
                            mode: 'index',
                            position: 'nearest',
                            // custom: customTooltips
                        },
                        elements: {
                            arc: {
                                borderWidth: 20,
                                // backgroundColor: colorize.bind(null, false, false),
                                // hoverBackgroundColor: hoverColorize
                            }
                        }
                    }
                };
                if(arr[0] == 'h_formation_pie') {
                    h_formation_pie_chart = new Chart(ctx, config);
                }else if(arr[0] == 'a_formation_pie') {
                    a_formation_pie_chart = new Chart(ctx, config);
                }
            }
        };
    })();
    _Analysis_event = (function () {
        return {
            tooltip_position: function($this, width) {
                var _this_width = $this.children().width();
                console.log(_this_width);
                if (width < 79) {
                    var m_val = ((_this_width / 2) - (width / 2)) * (-1) + 75;
                    $this.children().css('left', m_val + 'px');
                } else if (width > 79) {
                    $this.children().css('left', ((width - _this_width) / 2) + 75);
                }
            },
            first_goal_time_table_filter: function(div_d_key,_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div) {
                for(var i=0; i<2; i++) {
                    var content_class = ['home_content','away_content'];
                    var div_key1 = ['div_home','div_away'];
                    var div_key2 = ['team_name','first_goal_total','time_0_15','time_16_30','time_31_45','time_46_60','time_61_75','time_76_90',
                        'per_first_half','second_half'];
                    var div_key3 = ['team_name','games','first_goal','per_first_goal','W','D','L'];
                    var div_key3_a = ['team_name','games','first_lose','per_first_lose','W','D','L'];
                    var div_key3_t = ['team_name','games','first_lose','per_first_goal','W','D','L'];
                    //var div_key3_arr = [div_key3,div_key3_a];
                    var home_data = json_data[div_d_key][a_h_a_div];
                    if(main_class == 'first_goal_time_table') {
                        for (var n = 0; n < 10; n++) {

                            if (n == 8) {
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).children('div:nth-child(1)').text(home_data[div_key1[i]].per_first_half + '%');
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).children('div:nth-child(2) > div').css('width', home_data[div_key1[i]].per_first_half + '%');
                                if (home_data[div_key1[i]].per_first_half > home_data[div_key1[i]].per_second_half) {
                                    if (sub_class == 'box_1') {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1)').attr('class', 'goal_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2) > div').attr('class', 'goal_time_up_graph');
                                    } else {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1)').attr('class', 'loss_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2) > div').attr('class', 'loss_time_up_graph');
                                    }
                                } else if (home_data[div_key1[i]].per_first_half === home_data[div_key1[i]].per_second_half) {
                                    if (sub_class == 'box_1') {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1)').attr('class', 'goal_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2) > div').attr('class', 'goal_time_up_graph');
                                    } else {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1)').attr('class', 'loss_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2) > div').attr('class', 'loss_time_up_graph');
                                    }
                                } else if (home_data[div_key1[i]].per_first_half < home_data[div_key1[i]].per_second_half) {
                                    if (sub_class == 'box_1') {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1)').attr('class', 'goal_time_down');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2) > div').attr('class', 'goal_time_down_graph');
                                    } else {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1)').attr('class', 'loss_time_down');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2) > div').attr('class', 'loss_time_down_graph');
                                    }
                                }
                            } else if (n == 9) {
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2)').text(home_data[div_key1[i]].per_second_half + '%');
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1) > div').css('width', home_data[div_key1[i]].per_second_half + '%');
                                if (home_data[div_key1[i]].per_first_half < home_data[div_key1[i]].per_second_half) {
                                    if (sub_class == 'box_1') {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2)').attr('class', 'goal_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1) > div').attr('class', 'goal_time_up_graph');
                                    } else {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2)').attr('class', 'loss_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1) > div').attr('class', 'loss_time_up_graph');
                                    }
                                } else if (home_data[div_key1[i]].per_first_half === home_data[div_key1[i]].per_second_half) {
                                    if (sub_class == 'box_1') {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2)').attr('class', 'goal_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1) > div').attr('class', 'goal_time_up_graph');
                                    } else {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2)').attr('class', 'loss_time_up');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1) > div').attr('class', 'loss_time_up_graph');
                                    }
                                } else if (home_data[div_key1[i]].per_first_half > home_data[div_key1[i]].per_second_half) {
                                    if (sub_class == 'box_1') {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2)').attr('class', 'goal_time_down');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1) > div').attr('class', 'goal_time_down_graph');
                                    } else {
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(2)').attr('class', 'loss_time_down');
                                        _this_table_box_adr.find('.' + content_class[i]).children().eq(n).find('div:nth-child(1) > div').attr('class', 'loss_time_down_graph');
                                    }
                                }
                            } else {
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).text(home_data[div_key1[i]][div_key2[n]]);
                            }
                        }
                    }else if(main_class == 'first_goal_game_result') {
                        for (var n = 0; n < 8; n++) {
                            var key_val = '';
                            if(div_d_key === 'd4'){
                                key_val = div_key3;
                            }else if(div_d_key === 'd5'){
                                if(a_h_a_div == 'total'){
                                    key_val = div_key3_t
                                }else {
                                    key_val = div_key3_a;
                                }
                            }
                            if(n === 3){
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).text(home_data[div_key1[i]][key_val[n]]+'%');
                            }else if(n === 7) {
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).children('span:nth-child(1)').text(home_data[div_key1[i]]['goal']);
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).children('span:nth-child(2)').text(home_data[div_key1[i]]['lose']);

                            }else {
                                _this_table_box_adr.find('.' + content_class[i]).children().eq(n).text(home_data[div_key1[i]][key_val[n]]);
                            }
                        }
                    }
                }
            },
            first_goal_time_table_fn: function(_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div) {
                if(main_class == 'first_goal_time_table') {
                    if(sub_class == 'box_1') {
                        var div_d_key = 'd2';
                        _Analysis_event.first_goal_time_table_filter(div_d_key,_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div);
                    }else if(sub_class == 'box_2'){
                        var div_d_key = 'd3';
                        _Analysis_event.first_goal_time_table_filter(div_d_key,_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div);
                    }
                }else if(main_class == 'first_goal_game_result'){
                    if(sub_class == 'box_1') {
                        var div_d_key = 'd4';
                        _Analysis_event.first_goal_time_table_filter(div_d_key,_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div);
                    }else if(sub_class == 'box_2'){
                        var div_d_key = 'd5';
                        _Analysis_event.first_goal_time_table_filter(div_d_key,_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div);
                    }
                }
            },
            lead_goal_lose_filter: function(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type) {
                var key = '';
                if(type === 1){
                    key = ['lead_goal_cnt','lead_goal_avg','lead_goal_per','tie_permit_cnt','tie_permit_avg','tie_permit_per'];
                }else{
                    key = ['lead_permit_cnt','lead_permit_avg','lead_permit_per','tie_goal_cnt','tie_goal_avg','tie_goal_per'];
                }
                for(var i=0; i<2; i++){
                    var lead_data = default_data[a_h_t_div][div_arr[i]];
                    for(var n=0; n<3; n++){
                        var node_adr = content_adr.find(content_class_name[i]).children().eq(n);

                        if(n === 0){
                            node_adr.children('div:nth-child(1)').text(lead_data.team_name);
                            node_adr.children('div:nth-child(2)').text(lead_data.games);
                        }else if(n === 1){
                            node_adr.children('div:nth-child(1)').text(lead_data[key[0]]);
                            node_adr.children('div:nth-child(2)').children('div:nth-child(1)').text(lead_data[key[1]]);
                            node_adr.children('div:nth-child(2)').children('div:nth-child(2)').children('div:nth-child(1)').css('width',lead_data[key[2]]+'%');
                        }else if(n === 2){
                            node_adr.children('div:nth-child(1)').text(lead_data[key[3]]);
                            node_adr.children('div:nth-child(2)').children('div:nth-child(1)').text(lead_data[key[4]]);
                            node_adr.children('div:nth-child(2)').children('div:nth-child(2)').text(lead_data[key[5]]+'%');
                            node_adr.children('div:nth-child(2)').children('div:nth-child(3)').children('div:nth-child(1)').css('width',lead_data[key[5]]+'%');
                        }
                    }
                }
            },
            goal_type_filter: function(json_data,a_h_t_div,div_arr,content_adr,content_class_name) {
                for(var i=0; i<2; i++){
                    var type_data = json_data[a_h_t_div][div_arr[i]];
                    for(var n=0; n<3; n++){
                        var node_adr = content_adr.find(content_class_name[i]).children().eq(n);

                        if(n === 0){
                            node_adr.children('div:nth-child(1)').text(type_data.team_name);
                            node_adr.children('div:nth-child(2)').text(type_data.games);
                        }else if(n === 1){
                            node_adr.children('div:nth-child(1)').children('div:nth-child(1)').text(type_data.tie_goal_cnt);
                            node_adr.children('div:nth-child(1)').children('div:nth-child(2)').text(type_data.tie_goal_per+'%');
                            node_adr.children('div:nth-child(2)').children('div:nth-child(1)').text(type_data.lead_goal_cnt);
                            node_adr.children('div:nth-child(2)').children('div:nth-child(2)').text(type_data.lead_goal_per+'%');
                            node_adr.children('div:nth-child(3)').children('div:nth-child(1)').text(type_data.other_goal_cnt);
                            node_adr.children('div:nth-child(3)').children('div:nth-child(2)').text(type_data.other_goal_per+'%');
                        }else if(n === 2){
                            node_adr.children('div:nth-child(1)').children('div:nth-child(1)').text(type_data.tie_goal_cnt);
                            node_adr.children('div:nth-child(1)').children('div:nth-child(2)').text(type_data.tie_goal_per+'%');
                            node_adr.children('div:nth-child(2)').children('div:nth-child(1)').text(type_data.lead_goal_cnt);
                            node_adr.children('div:nth-child(2)').children('div:nth-child(2)').text(type_data.lead_goal_per+'%');
                            node_adr.children('div:nth-child(3)').children('div:nth-child(1)').text(type_data.other_goal_cnt);
                            node_adr.children('div:nth-child(3)').children('div:nth-child(2)').text(type_data.other_goal_per+'%');
                        }
                    }
                }
            },
            first_performance_filter: function(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type) {
                var key = '';
                if(type === 1){
                    key = ['team_name','first_half_W_cnt','games','first_half_W_per','W','D','L','goal','team_point','team_point_avg'];
                }else{
                    key = ['team_name','first_half_L_cnt','games','first_half_L_per','W','D','L','goal','team_point','team_point_avg'];
                }
                for(var i=0; i<2; i++){
                    var performance_data = default_data[a_h_t_div][div_arr[i]];
                    for(var n=0; n<10; n++){
                        var node_adr = content_adr.find(content_class_name[i]).children().eq(n);

                        if(n === 3){
                            node_adr.text(performance_data[key[n]]+'%');
                        }else if(n === 7){
                            node_adr.text(performance_data[key[n]]+' - '+performance_data.lose);
                        }else{
                            node_adr.text(performance_data[key[n]]);
                        }
                    }
                }
            },
            game_time_average_filter: function(json_data,a_h_t_div,div_arr,content_adr,content_class_name) {
                for(var i=0; i<2; i++){
                    var avg_data = json_data[a_h_t_div][div_arr[i]],
                        key = ['team_name','games','time_W','time_D','time_L'];
                    for(var n=0; n<6; n++){
                        var node_adr = content_adr.find(content_class_name[i]).children().eq(n);

                        if(n === 5){
                            node_adr.children().children('div:nth-child(1)').css('width',avg_data.time_W_per+'%');
                            node_adr.children().children('div:nth-child(2)').css('width',avg_data.time_D_per+'%');
                            node_adr.children().children('div:nth-child(3)').css('width',avg_data.time_L_per+'%');
                        }else{
                            node_adr.text(avg_data[key[n]]);
                        }
                    }
                }
            },
            goal_loss_15_filter: function(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index) {
                // goal_15_detail_chart = new Chart(ctx, config);
                // loss_15_detail_chart = new Chart(ctx, config);
                // goal_10_detail_chart = new Chart(ctx, config);
                // loss_10_detail_chart = new Chart(ctx, config)
                var key1 = ['team_name','time_0_15','time_16_30','time_31_45','time_46_60','time_61_75','time_76_90','first_half','second_half'],
                    key2 = ['team_name','time_0_10','time_11_20','time_21_30','time_31_40','time_41_50','time_51_60','time_61_70','time_71_80',
                        'time_81_90','first_half','second_half'],
                    chart_key1 = ['time_0_15','time_16_30','time_31_45','time_46_60','time_61_75','time_76_90'],
                    chart_key2 = ['time_0_10','time_11_20','time_21_30','time_31_40','time_41_50','time_51_60','time_61_70','time_71_80','time_81_90'],
                    h_data_arr = [], a_data_arr = [], data_arr = [h_data_arr, a_data_arr],
                    loop_key,chart_key,re_chart;

                for(var i=0; i<2; i++){
                    var avg_data = json_data[a_h_t_div][div_arr[i]];

                    if(content_index === 2 || content_index === 3){
                        loop_key = key1;
                        chart_key = chart_key1;
                        if(content_index === 2){
                            re_chart = goal_15_detail_chart;
                        }else if(content_index === 3) {
                            re_chart = loss_15_detail_chart;
                        }
                    }else if(content_index === 4 || content_index === 5){
                        loop_key = key2;
                        chart_key = chart_key2;
                        if(content_index === 4){
                            re_chart = goal_10_detail_chart;
                        }else if(content_index === 5) {
                            re_chart = loss_10_detail_chart;
                        }
                    }
                    for(var n=0; n<loop_key.length; n++){
                        var node_adr = content_adr.find(content_class_name[i]).children().eq(n);

                        node_adr.text(avg_data[loop_key[n]]);
                    }
                    for(var s=0; s<chart_key.length; s++){
                        var update_data = avg_data[chart_key[s]];


                        data_arr[i].push(update_data);
                        console.log(data_arr);
                    }
                }
                console.log(data_arr);
                re_chart.data.datasets[0].data = data_arr[0];
                re_chart.data.datasets[1].data = data_arr[1];
                re_chart.update();
            },
            avg_goal_loss_filter: function(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index) {
                for(var i=0; i<2; i++){
                    var avg_data = json_data[a_h_t_div][div_arr[i]],
                        key = ['goal_4_over','goal_3','goal_2','goal_1','goal_0','goal_avg','team_name','lose_avg','lose_0','lose_1','lose_2','lose_3',
                            'lose_4_over'],
                        key2 = ['second_half_goal','first_half_goal','goal_4_over','goal_2_3','goal_0_1','goal_avg','team_name','lose_avg','lose_0_1','lose_2_3',
                            'lose_4_over','first_half_lose','second_half_lose'],
                        select_key;
                    if(content_index === 1){
                        select_key = key;
                    }else if(content_index === 2){
                        select_key = key2;
                    }
                    for(var n=0; n<select_key.length; n++){
                        var node_adr = content_adr.find(content_class_name[i]).children().eq(n);

                        node_adr.text(avg_data[select_key[n]]);
                    }
                }
            },
            avg_relative_record_filter: function(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index) {
                for(var i=0; i<2; i++){
                    var avg_data = json_data[a_h_t_div][div_arr[i]],
                        key = ['goal_avg','lose_avg','goal'],
                        key2 = ['goal_4_over','goal_3','goal_2','goal_1','goal_0','goal_avg','team_name','lose_avg','lose_0','lose_1','lose_2','lose_3','lose_4_over'],
                        select_key;
                    if(content_index === 0){
                        select_key = key;
                        for(var n=0; n<select_key.length; n++){
                            var num;
                            if(i === 0){
                                num=[0,1];
                            }else if(i ===1){
                                num=[3,4];
                            }
                            for(var s=0; s<num.length; s++) {
                                var node_adr = content_adr.children().eq(n).children().eq(num[s]),
                                    home_avg = json_data[a_h_t_div].div_home,
                                    away_avg = json_data[a_h_t_div].div_away;

                                if (s === 0 && i === 0) {
                                    var avg_val = home_avg[select_key[n]] / (home_avg[select_key[n]] + away_avg[select_key[n]]) * 100;
                                    node_adr.children().children().css('width', avg_val + '%');
                                    if(home_avg[select_key[n]] >= away_avg[select_key[n]]){
                                        node_adr.children().children().css('background-color', '#517dc9');
                                    }else if(home_avg[select_key[n]] < away_avg[select_key[n]]){
                                        node_adr.children().children().css('background-color', '');
                                    }
                                }else if(s ===1 && i === 0){
                                    node_adr.text(home_avg[select_key[n]]);
                                }else if(s === 0 && i === 1){
                                    node_adr.text(away_avg[select_key[n]]);
                                }else if (s === 1 && i === 1) {
                                    var avg_val = away_avg[select_key[n]] / (away_avg[select_key[n]] + home_avg[select_key[n]]) * 100;
                                    node_adr.children().children().css('width', avg_val + '%');
                                    if(home_avg[select_key[n]] <= away_avg[select_key[n]]){
                                        node_adr.children().children().css('background-color', '#ffd46e');
                                    }else if(home_avg[select_key[n]] > away_avg[select_key[n]]) {
                                        node_adr.children().children().css('background-color', '');
                                    }
                                }
                            }
                        }
                    }else if(content_index === 1){
                        select_key = key2;
                        for(var n=0; n<select_key.length; n++){
                            var node_adr = content_adr.find(content_class_name[i]).children().eq(n);

                            node_adr.text(avg_data[select_key[n]]);
                        }
                    }
                }
            },
            goal_loss_margin_filter: function(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index) {
                for(var i=0; i<2; i++){
                    var avg_data = json_data[a_h_t_div][div_arr[i]],
                        key1_1 = ['team_name'],
                        key1_2 = ['goal_diff_1','goal_diff_2','goal_diff_3','goal_diff_4_over'],
                        key1_3 = ['W','D','L'],
                        key1_4 = ['lose_diff_1','lose_diff_2','lose_diff_3','lose_diff_4_over'],
                        key_arr = [key1_1,key1_2,key1_3,key1_4],
                        select_key;

                    for(var n=0; n<key_arr.length; n++){
                        var node_adr = content_adr.find(content_class_name[i]).children().eq(n);
                        if(n === 0) {
                            node_adr.text(avg_data[key_arr[n][0]]);
                        }else if(n === 1){
                            for(var s=0; s<key_arr[n].length; s++){
                                node_adr.children().eq(s).text(avg_data[key_arr[n][s]]);
                            }
                        }else if(n === 2){
                            for(var s=0; s<key_arr[n].length; s++){
                                node_adr.children().eq(s).text(avg_data[key_arr[n][s]]);
                            }
                        }else if(n === 3){
                            for(var s=0; s<key_arr[n].length; s++){
                                node_adr.children().eq(s).text(avg_data[key_arr[n][s]]);
                            }
                        }
                    }
                }
            },
            latest_trend_filter: function(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index,type) {
                for(var i=0; i<2; i++){
                    var avg_data = json_data[a_h_t_div][div_arr[i]],
                        select_key;

                    if(content_index === 0){
                        var key_1 = ['team_name','games','point'],
                            key_2 = ['point_avg_recent','point_avg','point_avg_diff'];
                        select_key = [key_1,key_2];
                    }else if(content_index === 1){
                        var key_1 = ['team_name','games'],
                            key_2 = ['possession_avg_recent','possession_avg','possession_avg_diff'];
                        select_key = [key_1,key_2];
                    }else if(content_index === 2){
                        var key_1 = ['team_name','games'],
                            key_2 = ['goal_avg_recent','goal_avg','goal_avg_diff'],
                            key_3 = ['lose_avg_recent','lose_avg','lose_avg_diff'];
                        select_key = [key_1,key_2,key_3];
                    }else if(content_index === 3) {
                        var key_1 = ['team_name','games'],
                            key_2 = ['shots_avg_recent','shots_avg','shots_avg_diff'],
                            key_3 = ['shots_on_avg_recent','shots_on_avg','shots_on_avg_diff'];
                        select_key = [key_1,key_2,key_3];
                    }
                    if(type === 1) {
                        for (var n = 0; n < select_key.length; n++) {
                            var node_adr = content_adr.find(content_class_name[i]).children().eq(n);
                            if(n === 0) {
                                for(var s=0; s<select_key[n].length; s++) {
                                    node_adr.children().eq(s).text(avg_data[select_key[n][s]]);
                                }
                            }else if(n === 1){
                                for(var s=0; s<select_key[n].length; s++) {
                                    var home_data = json_data[a_h_t_div].div_home,
                                        away_data = json_data[a_h_t_div].div_away,
                                        total_val;
                                    if(content_index === 0) {
                                        total_val = Math.abs(home_data.point_avg_diff) + Math.abs(away_data.point_avg_diff);
                                    }else{
                                        total_val = Math.abs(home_data.possession_avg_diff) + Math.abs(away_data.possession_avg_diff);
                                    }
                                    if(s === 2){
                                        var per_val = (Math.abs(avg_data[select_key[n][s]]) / total_val)*100;

                                        if(avg_data[select_key[n][s]] > 0) {
                                            node_adr.children().eq(s).children().eq(2).children().css('width',per_val + '%');
                                            node_adr.children().eq(s).children().eq(2).children().css('background-color', '#ff5e3a');
                                            node_adr.children().eq(s).children().eq(0).children().css('background-color', '');
                                            node_adr.children().eq(s).children().eq(1).text('+'+avg_data[select_key[n][s]]);
                                        }else {
                                            node_adr.children().eq(s).children().eq(0).children().css('width',per_val + '%');
                                            node_adr.children().eq(s).children().eq(0).children().css('background-color', '#6aa5c7');
                                            node_adr.children().eq(s).children().eq(2).children().css('background-color', '');
                                            node_adr.children().eq(s).children().eq(1).text(avg_data[select_key[n][s]]);
                                        }
                                    }else{
                                        node_adr.children().eq(s).text(avg_data[select_key[n][s]]);
                                    }
                                }
                            }
                        }
                    }else if(type === 2){
                        for (var n = 0; n < select_key.length; n++) {
                            var node_adr = content_adr.find(content_class_name[i]).children().eq(n);
                            if(n === 0) {
                                for(var s=0; s<select_key[n].length; s++) {
                                    node_adr.children().eq(s).text(avg_data[select_key[n][s]]);
                                }
                            }else if(n === 1){
                                for(var s=0; s<select_key[n].length; s++) {
                                    var home_data = json_data[a_h_t_div].div_home,
                                        away_data = json_data[a_h_t_div].div_away,
                                        total_val;
                                    if(content_index === 2) {
                                        if(n === 1){
                                            total_val = Math.abs(home_data.goal_avg_diff) + Math.abs(away_data.goal_avg_diff);
                                        }else if(n === 2) {
                                            total_val = Math.abs(home_data.lose_avg_diff) + Math.abs(away_data.lose_avg_diff);
                                        }
                                    }else if(content_index === 3){
                                        if(n === 1) {
                                            total_val = Math.abs(home_data.shots_avg_diff) + Math.abs(away_data.shots_avg_diff);
                                        }else if(n === 2){
                                            total_val = Math.abs(home_data.shots_on_avg_diff) + Math.abs(away_data.shots_on_avg_diff);
                                        }
                                    }
                                    if(s === 2){
                                        var per_val = (Math.abs(avg_data[select_key[n][s]]) / total_val)*100;
                                        console.log(total_val);
                                        console.log(Math.abs(avg_data[select_key[n][s]]));
                                        if(avg_data[select_key[n][s]] > 0) {
                                            node_adr.children().eq(s).children().eq(2).children().css('width',per_val + '%');
                                            node_adr.children().eq(s).children().eq(2).children().css('background-color', '#ff5e3a');
                                            node_adr.children().eq(s).children().eq(0).children().css('background-color', '');
                                            node_adr.children().eq(s).children().eq(1).text('+'+avg_data[select_key[n][s]]);
                                        }else {
                                            node_adr.children().eq(s).children().eq(0).children().css('width',per_val + '%');
                                            node_adr.children().eq(s).children().eq(0).children().css('background-color', '#6aa5c7');
                                            node_adr.children().eq(s).children().eq(2).children().css('background-color', '');
                                            node_adr.children().eq(s).children().eq(1).text(avg_data[select_key[n][s]]);
                                        }
                                    }else{
                                        node_adr.children().eq(s).text(avg_data[select_key[n][s]]);
                                    }
                                }
                            }else if(n === 2){
                                for(var s=0; s<select_key[n].length; s++) {
                                    var home_data = json_data[a_h_t_div].div_home,
                                        away_data = json_data[a_h_t_div].div_away,
                                        total_val;
                                    if(content_index === 2) {
                                        if(n === 1){
                                            total_val = Math.abs(home_data.goal_avg_diff) + Math.abs(away_data.goal_avg_diff);
                                        }else if(n === 2) {
                                            total_val = Math.abs(home_data.lose_avg_diff) + Math.abs(away_data.lose_avg_diff);
                                        }
                                    }else if(content_index === 3){
                                        if(n === 1) {
                                            total_val = Math.abs(home_data.shots_avg_diff) + Math.abs(away_data.shots_avg_diff);
                                        }else if(n === 2){
                                            total_val = Math.abs(home_data.shots_on_avg_diff) + Math.abs(away_data.shots_on_avg_diff);
                                        }
                                    }
                                    if(s === 2){
                                        var per_val = (Math.abs(avg_data[select_key[n][s]]) / total_val)*100;

                                        if(avg_data[select_key[n][s]] > 0) {
                                            node_adr.children().eq(s).children().eq(2).children().css('width',per_val + '%');
                                            node_adr.children().eq(s).children().eq(2).children().css('background-color', '#ff5e3a');
                                            node_adr.children().eq(s).children().eq(0).children().css('background-color', '');
                                            node_adr.children().eq(s).children().eq(1).text('+'+avg_data[select_key[n][s]]);
                                        }else {
                                            node_adr.children().eq(s).children().eq(0).children().css('width',per_val + '%');
                                            node_adr.children().eq(s).children().eq(0).children().css('background-color', '#6aa5c7');
                                            node_adr.children().eq(s).children().eq(2).children().css('background-color', '');
                                            node_adr.children().eq(s).children().eq(1).text(avg_data[select_key[n][s]]);
                                        }
                                    }else{
                                        node_adr.children().eq(s).text(avg_data[select_key[n][s]]);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            game_result_stats_filter: function(json_data,a_h_t_div,div_arr,content_adr) {
                var avg_data_h = json_data[a_h_t_div][div_arr[0]],
                    avg_data_a = json_data[a_h_t_div][div_arr[1]],
                    key1_1 = ['goal_avg','lose_avg','shots_avg','shots_on_avg','possession_avg','free_kicks_avg','corner_kicks_avg'],
                    key1_2 = ['goal_per','lose_per','shots_per','shots_on_per','possession_per','free_kicks_per','corner_kicks_per'];

                for(var n=0; n<key1_1.length; n++){
                    var node_adr = content_adr.find('.content_result').children().children().eq(n);

                    if(avg_data_h[key1_2[n]] > avg_data_a[key1_2[n]]) {
                        node_adr.children().eq(0).children().children().css({
                            width: avg_data_h[key1_2[n]] + '%',
                            background: '#517dc9'
                        });
                        node_adr.children().eq(4).children().children().css({
                            width: avg_data_a[key1_2[n]] + '%',
                            background: ''
                        });
                    }else {
                        node_adr.children().eq(0).children().children().css({
                            width: avg_data_h[key1_2[n]] + '%',
                            background: ''
                        });
                        node_adr.children().eq(4).children().children().css({
                            width: avg_data_a[key1_2[n]] + '%',
                            background: '#ffd46e'
                        });
                    }
                    node_adr.children().eq(1).text(avg_data_h[key1_1[n]]);
                    node_adr.children().eq(3).text(avg_data_a[key1_1[n]]);
                }
            },
            rest_day_filter: function(json_data,a_h_t_div,div_arr,content_adr) {
                for(var i=0; i<2; i++) {
                    var avg_data = json_data[a_h_t_div][div_arr[i]],
                        gab_key = ['gab_2', 'gab_3', 'gab_4', 'gab_5', 'gab_6_over'],
                        key = ['games','goal_avg', 'lose_avg', 'shots_avg', 'shots_on_avg', 'possession_avg', 'free_kicks_avg', 'corner_kicks_avg'];
                    for(var n=0; n<gab_key.length; n++){

                        for(var s=0; s<key.length; s++){
                            var node_adr = content_adr.children().eq(i).find('.content_result').children().eq(1);
                            //console.log(node_adr);
                            console.log(node_adr.children().eq(s).children().eq(n));
                            console.log(avg_data[gab_key[n]][key[s]]);
                            node_adr.children().eq(s).children().eq(n).text(avg_data[gab_key[n]][key[s]]);
                        }
                    }
                }
            }
        };
    })();
    /********************************************************************************/
    /******************************* 페이지 로드 이벤트 ******************************/
    /********************************************************************************/
    _Io.connect_io(); // 소켓 연결

    if($(location).attr('href') == 'https://spoto.com/livescore/soccer') {
        _Soccer_ajax.soccer_getJson(); //축구 디테일 JSON 파일 변수 저장
        //_Soccer_ajax.soccer_resultJson(); // 축구 경기결과(전날경기 결과) JOSN 파일 변수 저장
        //_Soccer_ajax.soccer_opponent(); // 축구 상대전적 JSON 파일 변수 저장

        //_Soccer.soccer_first_loading_event(_soccer_json);

        /*********게임 종목 nav_bar 게임 개수 입력 *********/
        var bookmark_game_length = $("#soccer_list").find("#bookmark > div:not(:first-child)").length,
            today_game_length = $("#soccer_list").find("#todayGame > div:not(:first-child)").length,
            tomorrow_game_length = $("#soccer_list").find("#tomorrowGame > div:not(:first-child)").length,
            result_game_length = $("#soccer_list").find("#todayResult > div:not(:first-child)").length,
            soccer_game_length = bookmark_game_length + today_game_length + tomorrow_game_length + result_game_length;
        $("#game_nav div:nth-child(2) span:nth-child(3)").text(soccer_game_length);
        /*********게임 종목 nav_bar 게임 개수 입력 *********/
    }

    if ($(location).attr("href").indexOf("team") != -1) {
        _Soccer_ajax.soccer_team(_team_number); // 축구 팀명 클릭 페이지 JSON 파일 변수 저장
    }
    if ($(location).attr("href").indexOf("player") != -1) {
        var storage_data = localStorage.getItem("json");
        _player_json = JSON.parse(storage_data);
        console.log(_player_json);
        _Soccer.soccer_player_content_html(_player_json);
        localStorage.clear();
    }
    if ($(location).attr("href").indexOf("database") != -1) {
        _Soccer_ajax.soccer_league_side(); // 리그 순위표 사이드바 JSON 파일 변수 저장
        var season = "",
            idx = "36",
            division = "League";
        _Soccer_ajax.soccer_league_main(season, idx, division); //리그 순위표 메인 JSON 파일 변수 저장
    }

    _Soccer.soccer_first_bookmark_load_event(); // 페이지 로드시 관심게임 상위 배치 이벤트

    if ($(location).attr("href").indexOf("rate") != -1) {
        /* var storage_data = localStorage.getItem("odds_json");
        _popup_odd_json = JSON.parse(storage_data);
        console.log(_popup_odd_json); */
        //_Soccer.soccer_player_content_html(_player_json);       팝업창 html 작성 함수 만들어서 넣야됨
        //localStorage.clear();
        //_Soccer.soccer_rate_popup_html(_popup_odd_json);
        _Soccer_ajax.soccer_select_odds_json(); // 배당률 팝업 json 저장
    }

    /********************************************************************************/
    /*******************************축구 메인 리스트 이벤트 *******************************/
    /********************************************************************************/
    $("section > div:not(:first-child) > div:nth-child(8) div div span,#yesterday_result>div:not(:first-child)>div:nth-child(9) div div span").on({
        mouseenter: function () {
            // 데이터 아이콘 마우스 오버 이벤트
            var $this = $(this),
                html = "",
                this_index = $this.parent().index();

            if (this_index == 0) {
                $this.append("<span>상대전적</span>");
            } else if (this_index == 1) {
                $this.append("<span>경기분석</span>");
            } else if (this_index == 2) {
                $this.append("<span>배당률</span>");
            }
            $this.addClass("select_icon");
            //$this.after(html);

            //$DOCUMENT.find('.tooltips').append("<span></span>");
            //$DOCUMENT.find('.tooltips:not([tooltip-position])').attr('tooltip-position', 'top');

            /*             $(".tooltips").mouseenter(function(){
                        $(this).find('span').empty().append($(this).attr('tooltip'));
                        }); */
            /* const notyf = new Notyf();
            notyf.success({
                message: 'test',
                duration: 4000,
                position: {
                    x: 'left',
                    t: 'bottom'
                },
                icon: false
            });
            var offset = $('[data-idx="1864345"]').offset();
            console.log(offset);
            console.log($('[data-idx="1864345"]'));
            $this.parents('.dataContainer').siblings('div:nth-child(4)').addClass('animate_gradient'); */
        },
        mouseleave: function () {
            // 데이터 아이콘 마우스 아웃 이벤트
            var $this = $(this);
            $this.removeClass("select_icon");
            $this.children().remove();

            //$this.parents('.dataContainer').siblings('div:nth-child(4)').removeClass('animate_gradient');
        }
    });

    $("#soccer_list").on("click", "section:not(:last-child)>div:not(:first-child)>div:nth-child(1)>div:nth-child(2)", function () {
        var idx = "",
            sort = "soccer/database",
            option = "ranking";

        _Fn.team_open(idx, sort, option);
    }).on('click', '#main_nav .first_nav .select_nav .calender', function () { // 달력 클릭 이벤트
        var $this = $(this),
            max = moment().add(7, 'days').format('YYYY-MM-DD'),
            popup_node = $this.siblings('.date_popup'),
            popup_class = popup_node.attr('class');

        console.log(max);
        console.log($this);
        $this.siblings('.date_popup').removeClass('nonDisplay');
        $this.siblings('.country_popup').addClass('nonDisplay');
        $this.siblings('.league_popup').addClass('nonDisplay');
        if (popup_class == 'date_popup nonDisplay' || popup_class == 'date_popup hasDatepicker nonDisplay') {
            var height = $("#main_nav > div.first_nav > div.select_nav").offset();
            var point = $this[0].offsetTop;
            var divTop = point + 35; //상단 좌표 위치 안맞을시 e.pageY
            var divLeft = 20; //좌측 좌표 위치 안맞을시 e.pageX
            $this.siblings('.date_popup').css({
                position: 'absolute',
                top: divTop,
                left: divLeft
            });
            $this.siblings('.date_popup').datepicker({
                // $this.parents('#soccer_list').siblings('#date').datepicker({
                showOn: "both", // 버튼과 텍스트 필드 모두 캘린더를 보여준다.
                buttonImage: "/application/db/jquery/images/calendar.gif", // 버튼 이미지
                buttonImageOnly: true, // 버튼에 있는 이미지만 표시한다.
                // changeMonth: true, // 월을 바꿀수 있는 셀렉트 박스를 표시한다.
                // changeYear: true, // 년을 바꿀 수 있는 셀렉트 박스를 표시한다.
                // minDate: '-100y', // 현재날짜로부터 100년이전까지 년을 표시한다.
                minDate: -7,
                maxDate: max,
                nextText: '다음 달', // next 아이콘의 툴팁.
                prevText: '이전 달', // prev 아이콘의 툴팁.
                numberOfMonths: [1, 1], // 한번에 얼마나 많은 월을 표시할것인가. [2,3] 일 경우, 2(행) x 3(열) = 6개의 월을 표시한다.
                stepMonths: 1, // next, prev 버튼을 클릭했을때 얼마나 많은 월을 이동하여 표시하는가. 
                // yearRange: 'c-100:c+10', // 년도 선택 셀렉트박스를 현재 년도에서 이전, 이후로 얼마의 범위를 표시할것인가.
                // showButtonPanel: true, // 캘린더 하단에 버튼 패널을 표시한다. 
                // currentText: '오늘 날짜' , // 오늘 날짜로 이동하는 버튼 패널
                // closeText: '닫기',  // 닫기 버튼 패널
                dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식.
                showAnim: "slide", //애니메이션을 적용한다.
                // showMonthAfterYear: true , // 월, 년순의 셀렉트 박스를 년,월 순으로 바꿔준다. 
                dayNamesMin: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], // 요일의 한글 형식.
                monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], // 월의 한글 형식.
                autoHide: true,
                /* beforeShow: function(input, inst) {
                    console.log(input);
                    console.log(inst);

                    setTimeout(function(){
                        $('.ui-datepicker').css('z-index', 99999999999999);
                        //alert(":dfdf");
                        //$('#main_nav > div.first_nav > div.select_nav > div.calender').css('z-index', 99999999999999);
                        // $ ( '#ui-datepicker-div'). css ( 'z-index', 10);
                    }, 500);
                } */
                afterShow: function () {
                    _Fn.game_count(_game_count_json);
                },
                onSelect: function (dateText, input) {
                    event.preventDefault();
                    _select_day = dateText;
                    console.log(_select_day)
                    console.log($(this));
                    var main_text = _select_day.replace(/-/gi, '.'),
                        week_length = $DOCUMENT.find('.date_popup  > div > table > tbody').children().length;

                    $('#main_nav > div.first_nav > div.select_nav > div.calender > span:nth-child(1)').text(main_text);
                    // $(this).addClass('ui-datepicker-today');
                    // $(this).siblings().removeClass('ui-datepicker-today');
                    $('#main_nav > div.first_nav > div.select_nav > div.date_popup').addClass('nonDisplay');

                    for (var i = 0; i < week_length; i++) {
                        var class_name = '  ui-datepicker-current-day',
                            loop_node = $DOCUMENT.find('.date_popup  > div > table > tbody tr:nth-child(' + (i + 1) + ')'),
                            loop_node_length = loop_node.children().length;

                        for (var s = 0; s < loop_node_length; s++) {
                            var day_node = $DOCUMENT.find('.date_popup  > div > table > tbody tr:nth-child(' + (i + 1) + ')').children().eq(s),
                                day_class = day_node.hasClass('ui-datepicker-current-day');
                            console.log(day_class);
                            if (day_class == true) {
                                console.log(day_node);
                                day_node.addClass('select_day');
                                // day_node.siblings().removeClass('ui-datepicker-today');
                            }
                        }
                    }
                    _Soccer.soccer_cal_click_html(_cal_game_json, dateText);
                    $('#main_nav .first_nav .select_nav .country_popup').empty();
                    $('#main_nav .first_nav .select_nav .league_popup').empty();
                }
            });
        } else {
            $this.siblings('.date_popup').addClass('nonDisplay');
        }
    }).on('click', '#main_nav .first_nav .select_nav .country', function () { // 메인 탭 모든나라 클릭 이벤트
        var $this = $(this),
            popup_node = $('#main_nav .first_nav .select_nav .country_popup'),
            popup_class = popup_node.attr('class'),
            popup_length = $('#main_nav .first_nav .select_nav .country_popup').children().length;

        popup_node.removeClass('nonDisplay');
        popup_node.siblings('.date_popup').addClass('nonDisplay');
        popup_node.siblings('.league_popup').addClass('nonDisplay');

        console.log(popup_class);
        // if(popup_class == 'country_popup nonDisplay'){
        if (popup_length == 0) {
            var height = $("#main_nav > div.first_nav > div.select_nav").offset();
            var point = $this[0].offsetTop;
            var divTop = point + 35; //상단 좌표 위치 안맞을시 e.pageY
            var divLeft = 170; //좌측 좌표 위치 안맞을시 e.pageX
            $this.siblings('.country_popup').css({
                position: 'absolute',
                top: divTop,
                left: divLeft
            });
            _Soccer.soccer_nation_popup_html();
        } else {
            if (popup_class == 'country_popup nonDisplay') {
                popup_node.removeClass('nonDisplay');
            } else {
                popup_node.addClass('nonDisplay');
            }
        }
    }).on('click', '#nation_all, #league_all', function () { // 모든나라 모든리그 팝업 전체선택 체크박스 클릭 이벤트
        var $this = $(this),
            check_value = $this.is(':checked'),
            select_id = $this.attr('id'),
            select_class = $this.parent().parent().parent('div:nth-child(2)').attr('class');

        $this.prop('checked', true);
        $this.parents('div').siblings().children('label').children('input').prop('checked', false);
        console.log($this);
        console.log(check_value);
        console.log(select_class);
        if (check_value) {
            if(select_class == 'nation_checkbox'){
                $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', true);
                $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', false);
                var nation_checkbox_label_node = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div'),
                    nation_checkbox_length = nation_checkbox_label_node.children('div').length;
                console.log(nation_checkbox_label_node);
                console.log(nation_checkbox_length);
                for(var b=0; b<nation_checkbox_length; b++){
                    var is_checked = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div > div:nth-child('+(b+1)+') label input').is(':checked');

                    console.log(is_checked);
                    if(is_checked == false){
                        nation_checkbox_label_node.find('span:last-child').attr('class','checkmark');
                    }
                }
            }else {
                $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', true);
                $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', false);
                var nation_checkbox_label_node = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div'),
                    nation_checkbox_length = nation_checkbox_label_node.children('div').length;
                console.log(nation_checkbox_label_node);
                console.log(nation_checkbox_length);
                for(var b=0; b<nation_checkbox_length; b++){
                    var is_checked = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div > div:nth-child('+(b+1)+') label input').is(':checked');

                    console.log(is_checked);
                    if(is_checked == false){
                        nation_checkbox_label_node.find('span:last-child').attr('class','checkmark');
                    }
                }
            }

            $('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .league_popup .league_important div div label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .league_popup .league_body div div label input').prop('checked', true);
        }

    }).on('click', '#nation_all_off, #league_all_off', function () { // 모든나라 모든리그 팝업 전체해제 클릭 이벤트
        var $this = $(this),
            check_value = $this.is(':checked'),
            select_id = $this.attr('id'),
            select_class = $this.parent().parent().parent('div:nth-child(2)').attr('class')

        $this.prop('checked', true);
        $this.parents('div').siblings().children('label').children('input').prop('checked', false);
        console.log($this);
        console.log(check_value);
        console.log(select_class);
        if (check_value) {
            if(select_class == 'nation_checkbox'){
                $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', false);
                $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', true);
                // $('#main_nav .first_nav .select_nav .country_popup .nation_body .league_list div label span:last-child').attr('class','checkmark');
                var nation_checkbox_label_node = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div'),
                    nation_checkbox_length = nation_checkbox_label_node.children('div').length;
                console.log(nation_checkbox_label_node);
                console.log(nation_checkbox_length);
                for(var b=0; b<nation_checkbox_length; b++){
                    var is_checked = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div > div:nth-child('+(b+1)+') label input').is(':checked');

                    console.log(is_checked);
                    if(is_checked == false){
                        nation_checkbox_label_node.find('span:last-child').attr('class','checkmark');
                    }
                }
                $('#main_nav .first_nav .select_nav .league_popup .league_body .league_list div label span:last-child').attr('class','checkmark');
            }else {
                $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', false);
                $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', true);
                // $('#main_nav .first_nav .select_nav .country_popup .nation_body .league_list div label span:last-child').attr('class','checkmark');
                var nation_checkbox_label_node = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div'),
                    nation_checkbox_length = nation_checkbox_label_node.children('div').length;
                console.log(nation_checkbox_label_node);
                console.log(nation_checkbox_length);
                for(var b=0; b<nation_checkbox_length; b++){
                    var is_checked = $('#main_nav > div.first_nav > div.select_nav > div.country_popup > div.nation_body > div > div:nth-child('+(b+1)+') label input').is(':checked');

                    console.log(is_checked);
                    if(is_checked == false){
                        nation_checkbox_label_node.find('span:last-child').attr('class','checkmark');
                    }
                }
            }
            $('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_important div div label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_body div div label input').prop('checked', false);
            // $('#main_nav .first_nav .select_nav .country_popup .nation_body .league_list div label span:last-child').attr('class','checkmark');
        }
    }).on('click', '#main_nav .first_nav .select_nav .country_popup .nation_footer .complete_btn, #main_nav .first_nav .select_nav .league_popup .league_footer .complete_btn', function () { // 모든 나라 팝업 선택완료 클릭 이벤트
        var $this = $(this),
            select_class = $this.parent().attr('class'),
            checked_length = '',
            checkbox_length = '',
            popup_node = '',
            game_length = '',
            today = moment().format('YYYY-MM-DD'),
            node_day = $('#main_nav > div.first_nav > div.select_nav > div.calender > span:nth-child(1)').text(),
            select_day = node_day.replace(/\./gi, '-');

        if (select_class == 'nation_footer') {
            checked_length = $('#main_nav .first_nav .select_nav .country_popup .nation_body > div div label input:checked').length;
            checkbox_length = $('#main_nav .first_nav .select_nav .country_popup .nation_body > div div label input').length;
            popup_node = $('#main_nav .first_nav .select_nav .country_popup');
        } else if (select_class == 'league_footer') {
            checked_length = $('#main_nav .first_nav .select_nav .league_popup .league_body > div div label input:checked').length;
            checkbox_length = $('#main_nav .first_nav .select_nav .league_popup .league_body > div div label input').length;
            popup_node = $('#main_nav .first_nav .select_nav .league_popup');
        }
        console.log(checked_length);
        console.log(checkbox_length);
        console.log(game_length);
        console.log(today);
        console.log(node_day);
        console.log(select_day);
        console.log(typeof select_day);
        if (today != select_day) {
            game_length = $("#soccer_list").find("#pastResult > div:not(:first-child)").length;
        } else {
            game_length = $("#soccer_list").find("#todayGame > div:not(:first-child)").length;
        }
        console.log(game_length);
        for (var i = 0; i < checkbox_length; i++) {
            var checked_val = '',
                un_checked_val = '';

            if (select_class == 'nation_footer') {
                checked_val = $('#main_nav .first_nav .select_nav .country_popup .nation_body > div div:nth-child(' + (i + 1) + ') label input:checked').val(),
                    un_checked_val = $('#main_nav .first_nav .select_nav .country_popup .nation_body > div div:nth-child(' + (i + 1) + ') label input:not(:checked)').val();
            } else if (select_class == 'league_footer') {
                checked_val = $('#main_nav .first_nav .select_nav .league_popup .league_body > div div:nth-child(' + (i + 1) + ') label input:checked').val(),
                    un_checked_val = $('#main_nav .first_nav .select_nav .league_popup .league_body > div div:nth-child(' + (i + 1) + ') label input:not(:checked)').val();
            }
            console.log(checked_val);
            console.log(un_checked_val);
            for (var s = 0; s < game_length; s++) {
                var loop_node = '';

                if (today != select_day) {
                    loop_node = $("#soccer_list").find('#pastResult > div:not(:first-child):nth-child(' + (s + 2) + ')');
                } else {
                    loop_node = $("#soccer_list").find('#todayGame > div:not(:first-child):nth-child(' + (s + 2) + ')');
                }
                var game_nation_idx = '';
                if (select_class == 'nation_footer') {
                    game_nation_idx = loop_node.data('nation_idx');
                } else if (select_class == 'league_footer') {
                    if (today != select_day) {
                        game_nation_idx = loop_node.data('league_idx');
                    } else {
                        game_nation_idx = loop_node.find('div:nth-child(1) div:nth-child(2)').data('league_idx');
                    }

                }

                console.log(s + 1);
                console.log(loop_node);
                console.log(game_nation_idx);
                console.log(checked_val);
                console.log(game_nation_idx != checked_val);
                if (game_nation_idx == checked_val) {
                    loop_node.removeClass('nonDisplay');
                } else if (game_nation_idx == un_checked_val) {
                    loop_node.addClass('nonDisplay');
                }
            }
        }
        popup_node.addClass('nonDisplay');
    }).on('click', '#main_nav .first_nav .select_nav .country_popup .nation_footer .close_btn, #main_nav .first_nav .select_nav .league_popup .league_footer .close_btn', function () { // 모든 나라 모든리그 팝업 취소 클릭 이벤트
        var $this = $(this),
            select_class = $this.parent().attr('class'),
            popup_node = '';
        console.log(select_class);
        if (select_class == 'nation_footer') {
            popup_node = $this.parents('.country_popup');
        } else if (select_class == 'league_footer') {
            popup_node = $this.parents('.league_popup');
        }
        popup_node.addClass('nonDisplay');
    }).on('click', '#main_nav .first_nav .select_nav .league', function () { // 메인 탭 모든리그 클릭 이벤트
        var $this = $(this),
            popup_node = $('#main_nav .first_nav .select_nav .league_popup'),
            popup_class = popup_node.attr('class'),
            popup_length = $('#main_nav .first_nav .select_nav .league_popup').children().length;

        popup_node.removeClass('nonDisplay');
        popup_node.siblings('.date_popup').addClass('nonDisplay');
        popup_node.siblings('.country_popup').addClass('nonDisplay');

        console.log(popup_class);
        if (popup_length == 0) {
            var height = $("#main_nav > div.first_nav > div.select_nav").offset();
            var point = $this[0].offsetTop;
            var divTop = point + 35; //상단 좌표 위치 안맞을시 e.pageY
            var divLeft = 316; //좌측 좌표 위치 안맞을시 e.pageX
            $this.siblings('.league_popup').css({
                position: 'absolute',
                top: divTop,
                left: divLeft
            });
            _Soccer.soccer_league_popup_html();
        } else {
            if (popup_class == 'league_popup nonDisplay') {
                popup_node.removeClass('nonDisplay');
            } else {
                popup_node.addClass('nonDisplay');
            }
        }
    }).on('click', '#main_nav .first_nav .select_nav .country_popup .nation_body div div label input,#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input', function () {
        // 모든 나라 체크박스 클릭 이벤트
        var $this = $(this),
            select_val = $this.val(),
            select_checked = $this.is(':checked'),
            body_node = $('#main_nav .first_nav .select_nav .league_popup .league_body .league_list div label'),
            important_node = $('#main_nav .first_nav .select_nav .league_popup .league_important .league_list div label'),
            league_node = $('#main_nav .first_nav .select_nav .league_popup'),
            league_length = league_node.children().length,
            select_league_idx = $this.parent().data('league_idx'),
            league_is_checked = body_node.find('input[name="' + select_val + '"]').is(':checked'),
            checkbox_length = $('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input').length,
            checked_length = $('#main_nav .first_nav .select_nav .country_popup .nation_body div div label input:checked').length;

        console.log(checkbox_length);
        console.log(checked_length);
        console.log(select_val);
        console.log(league_length);
        console.log(select_league_idx);
        console.log(league_is_checked);
        console.log(body_node.find('input[value="' + select_val + '"]'));
        // if(this_checked == true) {
        //     $this.prop('checked', false);
        // }else {
        //     $this.prop('checked', true);
        // }
        if(checkbox_length == checked_length){
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', false);
        }else if(checkbox_length > checked_length && checked_length > 0){
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', false);
        }else if(checked_length == 0) {
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', true);
        }
        if(league_length > 0) {
            // var input_length = body_node.find('input[name="'+select_val+'"]').length;
            // if(league_is_checked == true){
            //     console.log(body_node.find('input[value="'+select_league_idx+'"]').length);
            //
            //     console.log(input_length+'  if문');
            //     body_node.find('input[name="'+select_val+'"]').each(function() {
            //         this.checked = false;
            //         console.log(this.checked);
            //     });
            //     important_node.find('input[name="' + select_val + '"]').each(function() {
            //         this.checked = false;
            //     });
            // }else {
            //     console.log(input_length+'   else 문');
            //     body_node.find('input[name="'+select_val+'"]').each(function() {
            //         this.checked = true;
            //     });
            //     important_node.find('input[name="' + select_val + '"]').each(function() {
            //         this.checked = true;
            //     });
            // }
            if(select_checked == true) {
                body_node.find('input[name="'+select_val+'"]').prop('checked', true);
                important_node.find('input[name="' + select_val + '"]').prop('checked', true);
            }else {
                body_node.find('input[name="'+select_val+'"]').prop('checked', false);
                important_node.find('input[name="' + select_val + '"]').prop('checked', false);
            }
        }
        var mark_class = $this.siblings('.half_check').hasClass('half_check');
        console.log(mark_class);
        if(mark_class == true){
            $this.siblings('.half_check').attr('class','checkmark');
        }
    }).on('click', '#main_nav .first_nav .select_nav .league_popup .league_important .league_list div label input,#main_nav .first_nav .select_nav .league_popup .league_body .league_list div label input', function () {
        var $this = $(this),
            select_val = $this.val(),
            body_node = $('#main_nav .first_nav .select_nav .league_popup .league_body .league_list div label'),
            important_node = $('#main_nav .first_nav .select_nav .league_popup .league_important .league_list div label'),
            nation_node = $('#main_nav .first_nav .select_nav .country_popup .nation_body div div label'),
            popup_node = $('#main_nav .first_nav .select_nav .country_popup'),
            nation_length = popup_node.children().length,
            select_class = $this.parent().parent().parent().siblings().attr('class'),
            select_nation_idx = $this.parent().data('nation_idx'),
            checkbox_length = $('#main_nav .first_nav .select_nav .league_popup .league_body div div label input').length,
            checked_length = $('#main_nav .first_nav .select_nav .league_popup .league_body div div label input:checked').length;
//모든 리그 체크박스 클릭 이벤트
        console.log(select_class);
        console.log(select_val);
        console.log(nation_node);
        console.log(nation_length);
        console.log(select_nation_idx);
        // if(this_checked == true){
        //     $this.prop('checked', false);
        // }else {
        //     $this.prop('checked', true);
        // }
        console.log(checked_length);
        if(checkbox_length == checked_length){
            console.log('같을떄');
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', false);
        }else if(checkbox_length > checked_length && checked_length > 0){
            console.log('체크가 크고 체크가 0이 아닐떄ㅖ');
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', false);
        }else if(checked_length == 0) {
            console.log('체크가 0일떄');
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_check label input').prop('checked', false);
            $('#main_nav .first_nav .select_nav .country_popup .nation_header .nation_checkbox .all_off label input').prop('checked', true);
            $('#main_nav .first_nav .select_nav .league_popup .league_header .league_checkbox .all_off label input').prop('checked', true);
        }
        if (select_class == 'important_title') {
            var is_checked = body_node.find('input[value="' + select_val + '"]').is(':checked'),
                nation_is_checked = nation_node.find('input[value="' + select_nation_idx + '"]').is(':checked');
            console.log(nation_is_checked);
            if (is_checked == true) {
                body_node.find('input[value="' + select_val + '"]').prop('checked', false);
            } else {
                body_node.find('input[value="' + select_val + '"]').prop('checked', true);
            }
            if (nation_length > 0) {
                if (nation_is_checked == true) {
                    var input_node = body_node.find('input[name="'+select_nation_idx+'"]'),
                        input_length = input_node.length,
                        input_checked_length = body_node.find('input[name="'+select_nation_idx+'"]:checked').length;
                    console.log(input_node);
                    console.log(input_length);
                    console.log(input_checked_length);
                    if(input_checked_length != input_length){
                        console.log('주요리그 체크박스 개수와 체크된 박스 개수가 같을떄');
                        nation_node.find('input[value="' + select_nation_idx + '"]').prop('checked', false);
                    }
                } else {
                    var input_node = body_node.find('input[name="'+select_nation_idx+'"]'),
                        input_length = input_node.length,
                        input_checked_length = body_node.find('input[name="'+select_nation_idx+'"]:checked').length;
                    console.log(input_node);
                    console.log(input_length);
                    console.log(input_checked_length);
                    if(input_checked_length == input_length){
                        nation_node.find('input[value="' + select_nation_idx + '"]').prop('checked', true);
                    }
                }
            }
        } else if (select_class == 'body_title') {
            var is_checked = important_node.find('input[value="' + select_val + '"]').is(':checked'),
                nation_is_checked = nation_node.find('input[value="' + select_nation_idx + '"]').is(':checked');
            console.log(nation_is_checked);
            if (is_checked == true) {
                important_node.find('input[value="' + select_val + '"]').prop('checked', false);
            } else {
                important_node.find('input[value="' + select_val + '"]').prop('checked', true);
            }
            if (nation_length > 0) {
                if (nation_is_checked == true) {
                    var input_node = body_node.find('input[name="'+select_nation_idx+'"]'),
                        input_length = input_node.length,
                        input_checked_length = body_node.find('input[name="'+select_nation_idx+'"]:checked').length;
                    console.log(input_node);
                    console.log(input_length);
                    console.log(input_checked_length);
                    if(input_checked_length != input_length && input_checked_length != 0){
                        nation_node.find('input[value="' + select_nation_idx + '"]').prop('checked', false);
                        nation_node.find('input[value="' + select_nation_idx + '"]').siblings('.checkmark').attr('class','half_check');
                    }else if(input_checked_length == 0) {
                        nation_node.find('input[value="' + select_nation_idx + '"]').prop('checked', false);
                    }
                } else {
                    var input_node = body_node.find('input[name="'+select_nation_idx+'"]'),
                        input_length = input_node.length,
                        input_checked_length = body_node.find('input[name="'+select_nation_idx+'"]:checked').length;
                    console.log(input_node);
                    console.log(input_length);
                    console.log(input_checked_length);
                    if(input_checked_length == input_length){
                        nation_node.find('input[value="' + select_nation_idx + '"]').prop('checked', true);
                        nation_node.find('input[value="' + select_nation_idx + '"]').siblings('.half_check').attr('class','checkmark');
                    }else if(input_checked_length < input_length && input_checked_length != 0) {
                        nation_node.find('input[value="' + select_nation_idx + '"]').siblings('.checkmark').attr('class','half_check');
                    }else if(input_checked_length == 0) {
                        nation_node.find('input[value="' + select_nation_idx + '"]').siblings('.half_check').attr('class','checkmark');
                    }
                }
            }
        }
    }).on("click", "#main_nav .first_nav .radio_nav div div input", function () {
        //필터 nav 경기상황 라디오박스 클릭 이벤트
        var $this = $(this),
            select_val = $this.val(),
            section_arr = ["todayGame", "tomorrowGame", "todayResult"];

        $this.prop("checked", true);
        $this.parent().siblings().children("input").prop("checked", false);
        _Soccer.soccer_match_filter_event(select_val, section_arr);
    }).on("click", "#main_nav .second_nav .click_nav div", function () {
        // 필터 nav 즐겨찾기 필터 클릭 이벤트
        var $this = $(this),
            select_class = $this.prop("class"),
            top_length = $("#bookmark > div:not(:first-child)").length,
            section_arr = ["todayGame", "tomorrowGame", "todayResult"];

        console.log(select_class);
        console.log(top_length);

        if (top_length == 0) {
            swal("등록된 탑 경기가 없습니다.", "탑 경기를 등록해 주세요.", "warning", {
                button: "확인",
            });
        } else {
            $this.addClass("select_view");
            $this.siblings().removeClass("select_view");
            if (select_class == "all_game_view") {
                for (var i = 0; i < section_arr.length; i++) {
                    $("#" + section_arr[i]).removeClass("nonDisplay");
                }
                if (top_length != 0) {
                    $("#bookmark").removeClass("nonDisplay");
                }
            } else if (select_class == "top_game_view") {
                $("#bookmark").removeClass("nonDisplay");
                for (var i = 0; i < section_arr.length; i++) {
                    $("#" + section_arr[i]).addClass("nonDisplay");
                }
            } else if (select_class == "top_game_hidden") {
                $("#bookmark").addClass("nonDisplay");
                for (var i = 0; i < section_arr.length; i++) {
                    $("#" + section_arr[i]).removeClass("nonDisplay");
                }
            }
        }
    }).on("mouseenter", "section:not(:last-child)>div:not(:first-child)>div:nth-child(5)>span:nth-child(1)", function () {
        // 스코어 마우스 오버 이벤트
        var $this = $(this),
            data = _detail_statusJson,
            data2 = _detail_eventJson,
            select_section = $this.parents("section").attr("id"),
            select_index = $this.parent("div").parent("div").index(),
            idx = $this.parent("div").parent("div").data("idx"),
            select_status = data[idx],
            game_idx = data2.game_idx,
            select_event = null;
        console.log(idx);
        console.log($this.parents("div"));
        console.log(select_section);
        console.log($this.parent("div").parent("div").index());
        if (select_section == "todayGame") {
            select_section = _soccer_json.today;
        } else if (select_section == "tomorrowGame") {
            select_section = _soccer_json.tomorrow;
        } else if (select_section == "todayResult") {
            select_section = _soccer_json.result;
        }
        select_event = data2.filter(function (item) {
            return item.game_idx == idx;
        });
        _Soccer.team_detail($this, idx, select_status, select_event, select_section, select_index);
    }).on("mouseleave", "section>div:not(:first-child)>div:nth-child(5)>span:nth-child(1) , section:not(:last-child)>div:not(:first-child)>div:nth-child(5)>.game_odds", function () {
            // 스코어 마우스 리브 이벤트 && 배당률 아무스 리브 이벤트
            $("#divView").empty().hide();
        }
    ).on("mouseenter", "section:not(:last-child)>div:not(:first-child)>div:nth-child(5)>.game_odds", function () {
        // 배당율 마우스 오버 이벤트
        var $this = $(this);

        _Soccer.soccer_odds_mouseenter_add_html($this);
    }).on("click", "section:not(:last-child)>div:not(:first-child)>div:nth-child(5)>.game_odds", function () {
        // 배당률 클릭 이벤트
        var $this = $(this),
            bet_game_idx = $this.find("div .up").data("bet_game_idx"),
            game_idx = $this.parent().parent().data("idx"),
            game_data = _main_odd_json[game_idx],
            odds_data = game_data.odds.contents,
            odds_name = "Bet 365",
            nodata_class = $this.find("div span").prop("class"),
            sort = "soccer/rate",
            option = "rate";

        console.log(bet_game_idx);
        console.log(game_idx);
        console.log(game_data);
        console.log();
        if (bet_game_idx == undefined) {
            bet_game_idx = odds_data[0].bet_game_idx;
        }
        console.log(bet_game_idx);
        if (bet_game_idx == undefined) {
            swal("배당률이 등록 되지 않았습니다", "배당률이 등록된 후에 클릭해 주세요", "warning", {
                button: "확인",
            });
        } else {
            _Fn.team_open(bet_game_idx, sort, option);
        }
    }).on("mouseenter", "section:not(:last-child) > div:not(:first-child) > div:nth-child(7)", function () {
        console.log("상대전적 마우스 오버 이벤트...................");
        console.log(_opponent_json);
        var $this = $(this),
            home_idx = $this.siblings().eq(3).data("home_idx"),
            away_idx = $this.siblings().eq(5).data("away_idx"),
            first_json = $.grep(_opponent_json, function (n, i) {
                return n.home_idx == home_idx || n.away_idx == home_idx;
            });
        console.log(home_idx);
        console.log(away_idx);
        console.log(first_json);
        var result_json = first_json;
        console.log(result_json);
        console.log(_opponent_json);
        _Soccer.soccer_opponent_html(result_json, $this);
    }).on("mouseleave", "section:not(:last-child) > div:not(:first-child) > div:nth-child(7)", function () {
        console.log("상대전적 마우스 리브 이벤트 ..........................");
        $DOCUMENT.find("#opponent_container").remove();
    })
        /* .on("mouseenter", "#todayGame>div:not(:first-child)>div:nth-child(4) .game_info", function () {
                // 오늘게임 느낌표 이벤트
                var $this = $(this),
                    data = _soccer_json.today,
                    idx = $this.parent("div").data("home_idx"),
                    node = $("#todayGame>div:not(:first-child)>div:nth-child(4) .game_info");
                console.log($this.parent("div"));
                console.log(idx);
                _Soccer.soccer_content_info_html(data, idx, node, $this);
            }).on("mouseenter", "#tomorrowGame>div:not(:first-child)>div:nth-child(4) .game_info", function () {
                // 내일게임 느낌표 이벤트
                var $this = $(this),
                    data = _soccer_json.tomorrow,
                    idx = $this.parent("div").data("home_idx"),
                    node = $("#tomorrowGame>div:not(:first-child)>div:nth-child(4) .game_info");
                console.log($this.parent("div"));
                console.log(idx);
                _Soccer.soccer_content_info_html(data, idx, node, $this);
            }).on("mouseenter", "#todayResult>div:not(:first-child)>div:nth-child(4) .game_info", function () {
                // 오늘결과 느낌표 이벤트
                var $this = $(this),
                    data = _soccer_json.result,
                    idx = $this.parent("div").data("home_idx"),
                    node = $("#todayResult>div:not(:first-child)>div:nth-child(4) .game_info");
                console.log($this.parent("div"));
                console.log(idx);
                _Soccer.soccer_content_info_html(data, idx, node, $this);
            }).on("mouseleave", "section>div:not(:first-child)>div:nth-child(4) .game_info", function () {
                $("#infoContainer").remove();
            }) */
        .on("click", "section > div:not(:first-child) > div:nth-child(4) .teamName", function () {
            // 홈(home) 디테일 클릭
            // 홈팀명 클릭 이벤트
            var //team_idx = 17382,
                team_idx = $(this).parent("div").data("home_idx"),
                sort = "soccer/team",
                option = "team";

            _Fn.team_open(team_idx, sort, option);
        }).on("click", "section > div:not(:first-child) > div:nth-child(6) .teamName", function () {
        // 어웨이(away) 디테일 클릭
        // 어웨이 팀명 이벤트
        var team_idx = $(this).parent("div").data("away_idx"),
            sort = "soccer/team",
            option = "team";

        _Fn.team_open(team_idx, sort, option);
    }).on("click", "section > div:not(:first-child) > div:nth-child(8) div div:nth-child(1) span:nth-child(1) , #yesterday_result>div:not(:first-child)>div:nth-child(9) div div:nth-child(1) span:nth-child(1)", function () {
        // 분석 아이콘 클릭 이벤트
        var $this = $(this),

            sort = "soccer/analysis",
            option = "analysis",
            league_full_name = $this.parents(".dataContainer").siblings('div:nth-child(1)').children('div:nth-child(2)').data('league_full'),
            home_idx = $this.parents(".dataContainer").parent("div[data-idx]").children('div[data-home_idx]').data('home_idx'),
            away_idx = $this.parents(".dataContainer").parent("div[data-idx]").children('div[data-away_idx]').data('away_idx'),
            game_idx = $this.parents(".dataContainer").parent("div[data-idx]").data('idx'),
            key = 'analysis_team_idx',
            key2 = 'analysis_team_name',
            key3 = 'analysis_game_idx',
            key4 = 'analysis_game_date',
            key5 = 'window_open',
            key6 = 'analysis_league_idx',
            league_key = 'league_full_name',
            team_idx_arr = [home_idx,away_idx],
            game_date = $this.parents(".dataContainer").parent("div[data-idx]").children('div[data-date]').data('date'),
            home_name = $this.parents(".dataContainer").siblings('div[data-home_idx]').children('span.teamName').text(),
            away_name = $this.parents(".dataContainer").siblings('div[data-away_idx]').children('span.teamName').text(),
            league_idx = $this.parents(".dataContainer").siblings('div:first-child').children('div[data-league_idx]').data('league_idx'),
            team_name_arr = [home_name,away_name],
            idx = $this.parents(".dataContainer").parent("div[data-idx]").data("idx")+'?date='+game_date,
            open_arr = [idx, sort, option];

        console.log($this.parents(".dataContainer").parent("div[data-idx]").data("idx"));
        console.log(home_idx);
        console.log(away_idx);
        console.log(game_idx);
        console.log(game_date);
        console.log(league_idx);

        localStorage.setItem(key, JSON.stringify(team_idx_arr));
        localStorage.setItem(key2, JSON.stringify(team_name_arr));
        localStorage.setItem(key3, game_idx);
        localStorage.setItem(key4, game_date);
        localStorage.setItem(league_key, league_full_name);
        localStorage.setItem(key5, open_arr);
        localStorage.setItem(key6, league_idx);

        // _socket.emit('opponent', {
        //     roomid: _socket.id,
        //     home: home_idx,
        //     away: away_idx,
        //     home_name: home_name,
        //     away_name: away_name,
        //     game_idx: game_idx,
        //     game_date: game_date
        // });

        _socket.emit('verification', {
            roomid: _socket.id,
            home: home_idx,
            away: away_idx,
            home_name: home_name,
            away_name: away_name,
            game_idx: game_idx,
            game_date: game_date,
            league_idx: league_idx
        });

        //_Fn.team_open(idx, sort, option);

    }).on("click", "section > div:not(:first-child) > div:nth-child(8) div div:nth-child(2) span , #yesterday_result>div:not(:first-child)>div:nth-child(9) div div:nth-child(2) span", function () {
        //상대전적 클릭 이벤트
        // var $this = $(this),
        //     idx = $this.parents(".dataContainer").parent("div[data-idx]").data("idx"),
        //     sort = "oddscomp/view",
        //     option = "odds";
        // console.log($this.parents(".dataContainer").parent("div[data-idx]").data("idx"));
        // _Fn.team_open(idx, sort, option);
        _socket.emit('test', {
            roomid: 'ㅋㅋㅋ test ㅋㅋㅋ',

        });

    }).on("click", "section > div:not(:first-child) > div:nth-child(8) div div:nth-child(3) span , #yesterday_result>div:not(:first-child)>div:nth-child(9) div div:nth-child(3) span", function () {
        // odds 아이콘 클릭 이벤트
        var $this = $(this),
            html = "",
            add_adr = $this.parents(".dataContainer").siblings().eq(4),
            this_class = $this.attr("class");
        console.log(this_class);
        if (this_class == "tooltips select_icon" || this_class == "tooltips") {
            var game_idx = $this.parents(".dataContainer").parent().data("idx"),
                game_data = _main_odd_json[game_idx],
                odds_data = game_data.odds.contents,
                config_data = game_data.config,
                odds_name = "Bet 365";

            //event.stopPropagation(); // 같은 곳에 걸려 있는 마우스엔터,마우스리브 이벤트 중지;
            $this.attr("class", "tooltips selected_icon");
            add_adr.find("span:first-child").attr("class", "nonDisplay");
            add_adr.css("width", "143px");
            $this.siblings(".tooltip").remove();

            console.log(game_idx);

            html += '<div class="game_odds">';
            html += "<div>";
            for (var i = 0; i < odds_data.length; i++) {
                if (odds_data[i].bet_name == odds_name) {
                    var odds_change_length = odds_data[i].odds_change.length,
                        second_to_last = "";
                    odds_data[i].odds_change[1];
                    if (odds_change_length > 1) {
                        second_to_last = odds_data[i].odds_change[1];
                    } else {
                        second_to_last = odds_data[i].odds_change[0];
                    }
                    console.log(second_to_last);
                    if (second_to_last.win_bet > odds_data[i].last_win_bet) {
                        html += '<span class="down" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_win_bet + "</span>";
                        html += "<span></span>";
                        html += "</span>";
                        break;
                    } else if (second_to_last.win_bet == odds_data[i].last_win_bet) {
                        html += '<span class="draw" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_win_bet + "</span>";
                        html += "<span>-</span>";
                        html += "</span>";
                        break;
                    } else if (second_to_last.win_bet < odds_data[i].last_win_bet) {
                        html += '<span class="up" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_win_bet + "</span>";
                        html += "<span></span>";
                        html += "</span>";
                        break;
                    }
                } else {
                    html += '<span class="no_data">';
                    html += "<span>-</span>";
                    html += "<span></span>";
                    html += "</span>";
                    break;
                }
            }
            html += "</div>";
            html += "<div>";
            for (var i = 0; i < odds_data.length; i++) {
                if (odds_data[i].bet_name == odds_name) {
                    var odds_change_length = odds_data[i].odds_change.length,
                        second_to_last = "";
                    odds_data[i].odds_change[1];
                    if (odds_change_length > 1) {
                        second_to_last = odds_data[i].odds_change[1];
                    } else {
                        second_to_last = odds_data[i].odds_change[0];
                    }
                    console.log(second_to_last);
                    if (second_to_last.draw_bet > odds_data[i].last_draw_bet) {
                        html += '<span class="down" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_draw_bet + "</span>";
                        html += "<span></span>";
                        html += "</span>";
                        break;
                    } else if (second_to_last.draw_bet == odds_data[i].last_draw_bet) {
                        html += '<span class="draw" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_draw_bet + "</span>";
                        html += "<span>-</span>";
                        html += "</span>";
                        break;
                    } else if (second_to_last.draw_bet < odds_data[i].last_draw_bet) {
                        html += '<span class="up" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_draw_bet + "</span>";
                        html += "<span></span>";
                        html += "</span>";
                        break;
                    }
                } else {
                    html += '<span class="no_data">';
                    html += "<span>-</span>";
                    html += "<span></span>";
                    html += "</span>";
                    break;
                }
            }
            html += "</div>";
            html += "<div>";
            for (var i = 0; i < odds_data.length; i++) {
                if (odds_data[i].bet_name == odds_name) {
                    var odds_change_length = odds_data[i].odds_change.length,
                        second_to_last = "";
                    odds_data[i].odds_change[1];
                    if (odds_change_length > 1) {
                        second_to_last = odds_data[i].odds_change[1];
                    } else {
                        second_to_last = odds_data[i].odds_change[0];
                    }
                    console.log(second_to_last);
                    if (second_to_last.lose_bet > odds_data[i].last_lose_bet) {
                        html += '<span class="down" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_lose_bet + "</span>";
                        html += "<span></span>";
                        html += "</span>";
                        break;
                    } else if (second_to_last.lose_bet == odds_data[i].last_lose_bet) {
                        html += '<span class="draw" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_lose_bet + "</span>";
                        html += "<span>-</span>";
                        html += "</span>";
                        break;
                    } else if (second_to_last.lose_bet < odds_data[i].last_lose_bet) {
                        html += '<span class="up" data-bet_game_idx="' + odds_data[i].bet_game_idx + '">';
                        html += "<span>" + odds_data[i].last_lose_bet + "</span>";
                        html += "<span></span>";
                        html += "</span>";
                        break;
                    }
                } else {
                    html += '<span class="no_data">';
                    html += "<span>-</span>";
                    html += "<span></span>";
                    html += "</span>";
                    break;
                }
            }
            html += "</div>";
            html += "</div>";

            add_adr.append(html);
        } else {
            var del_node = $this.parents(".dataContainer").siblings().eq(4).children(".game_odds");
            $this.removeClass("selected_icon");
            add_adr.find("span:first-child").removeClass("nonDisplay");
            add_adr.removeAttr("style");
            del_node.remove();
        }
    }).on("click", "section:not(#bookmark,#yesterday_result) > div:not(:first-child) > div:nth-child(9) span", function () {
        // 관심게임 등록 이벤트
        var $this = $(this);

        _Soccer.soccer_add_bookmark_event($this);
    }).on("click", "#bookmark div:not(:first-child) div:nth-child(9) span.select_icon", function () {
        // 즐겨찾기 해제 이벤트
        var $this = $(this);

        _Soccer.soccer_remove_bookmark_event($this);
    }).on("click", "#bookmark>div:first-child", function () {
        // 탑경기 (즐겨찾기) 전체내리기 이벤트

        _Soccer.soccer_all_remove_bookmark_event();
    }).on("change", "#main_nav > div.second_nav > div.check_nav #odds_check", function () {
        // 전체 배당률 보이기 숨기기 이벤트
        var $this = $(this);

        _Soccer.soccer_odds_checkbox_change_event($this);
    }).on("click", "#game_nav div", function () {
        // 종목 nav 클릭 이벤트
        var $this = $(this);

        $this.addClass("game_select");
        $this.siblings().removeClass("game_select");
        $this.children("span:last-child").removeClass("nonDisplay");
        //$this.children('span:last-child').addClass('tooltip');
        //$this.siblings().children('span:last-child').addClass('nonDisplay');
        //$this.siblings().children('span:last-child').removeClass('tooltip');
        swal("종목 선택 이벤트 구현해야됨");
    }).on("mouseenter", "#game_nav div", function () {
        // 종목 nov 애니메이션 이벤트
        var $this = $(this);
        $this.find("span:nth-child(3)").addClass("overpointer");
    }).on("mouseleave", "#game_nav div", function () {
        var $this = $(this);
        $this.find("span:nth-child(3)").removeClass("overpointer");
    });

    /*********************************************************************************************************************************/
    /*******************************축구 analysis 페이지 이벤트 시작 *********************************************************************/
    /*********************************************************************************************************************************/
    $('#analysis_popup').on('click', '#tap_menu div', function() {
        // 메인 메뉴바 클릭 이벤트
        var _this = $(this);


        console.log(_this);
        console.log(_this.hasClass('nav_selected'));
        if(_this.hasClass('nav_selected')){
            _this.siblings('div').removeClass('nav_selected');
        }else{
            _this.addClass('nav_selected');
            _this.siblings('div').removeClass('nav_selected');
        }


    }).on('change','#home_latest #latest_game, #away_latest #latest_game', function () {
        // 최근경기 경기수 선택 이벤트(최근 경기)
        var _this = $(this),
            parent_id = _this.parents('section').attr('id'),
            select_val = _this.val(),
            league_val = '',
            all_game_class = '',
            home_game_class = '',
            away_game_class = '',
            team_name = '',
            latest_content_adr = '',
            latest_length = '',
            no_game_length = '',
            latest_data_score_h = [],
            latest_data_score_a = [],
            latest_data_date = [],
            team_idx = '',
            re_chart = '',
            html = '';
        console.log(parent_id);
        if(parent_id == 'home_latest') {
            league_val = $('#home_latest #game_league').val(),
            all_game_class = $('#home_latest .filter_nav div:nth-child(3)').attr('class'),
            home_game_class = $('#home_latest .filter_nav div:nth-child(4)').attr('class'),
            away_game_class = $('#home_latest .filter_nav div:nth-child(5)').attr('class'),
            team_name = $('#home_latest .main_title div span').text(),
            latest_content_adr = $('#home_latest > div.game_content'),
            latest_length = latest_content_adr.children().not('.no_game').length,
            no_game_length = latest_content_adr.children('.no_game').length,
            team_idx = $('#analysis_title .team_info .home_info').data('home_idx'),
            re_chart = l_chart_h;
        }else if(parent_id == 'away_latest'){
            league_val = $('#away_latest #game_league').val(),
            all_game_class = $('#away_latest .filter_nav div:nth-child(3)').attr('class'),
            home_game_class = $('#away_latest .filter_nav div:nth-child(4)').attr('class'),
            away_game_class = $('#away_latest .filter_nav div:nth-child(5)').attr('class'),
            team_name = $('#away_latest .main_title div span').text(),
            latest_content_adr = $('#away_latest > div.game_content'),
            latest_length = latest_content_adr.children().not('.no_game').length,
            no_game_length = latest_content_adr.children('.no_game').length,
            team_idx = $('#analysis_title .team_info .away_info').data('away_idx'),
            re_chart = l_chart_a;
        }

        console.log(select_val);
        console.log(latest_length);
        console.log(league_val);
        console.log(all_game_class);
        console.log(home_game_class);
        console.log(away_game_class);
        _this.children('option:selected').attr('selected', true);
        _this.children('option:selected').siblings().attr('selected',false);
        var latest_score_h,latest_score_a,latest_date;
        if(select_val == 1){
            select_val = 5;

            if(no_game_length != 0){
                latest_content_adr.find('.no_game').remove();
            }
            for(var i=0; i<latest_length; i++) {
                latest_content_adr.children('div:nth-child('+(select_val+i+1)+')').addClass('nonDisplay');

                if(league_val == 0) {
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                        if(team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }else{
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx == team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                                latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                                latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                                latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                                latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }else {
                    var loop_league_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)').data('league_idx');

                    if(loop_league_idx != league_val){
                        latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').addClass('nonDisplay');
                    }
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                        if(team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }else{
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx == team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }
            }
            var nonDisplay_length = latest_content_adr.children('div').not('.nonDisplay').length;
            if(nonDisplay_length == 0){
                // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
                //     button: "확인",
                // });
                html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
                latest_content_adr.append(html);
                html = '';
            }
            re_chart.data.labels = latest_data_date.reverse();
            re_chart.data.datasets[0].data = latest_data_score_h.reverse();
            re_chart.data.datasets[1].data = latest_data_score_a.reverse();
            re_chart.update();
        }else if(select_val == 2){
            select_val = 10;
            if(no_game_length != 0){
                latest_content_adr.find('.no_game').remove();
            }
            for(var s=0; s<select_val; s++){
                latest_content_adr.children('div:nth-child('+(s+1)+')').removeClass('nonDisplay');
            }
            for(var i=0; i<latest_length; i++) {
                latest_content_adr.children('div:nth-child('+(select_val+i+1)+')').addClass('nonDisplay');
                if(league_val == 0) {
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');
                        if(team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }else{
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx == team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }else {
                    var loop_league_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)').data('league_idx');
                    if(loop_league_idx != league_val){
                        latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').addClass('nonDisplay');
                    }
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                        if(team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }else{
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx == team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }
            }
            var nonDisplay_length = latest_content_adr.children('div').not('.nonDisplay').length;
            if(nonDisplay_length == 0){
                // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
                //     button: "확인",
                // });
                html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
                latest_content_adr.append(html);
                html = '';
            }
            re_chart.data.labels = latest_data_date.reverse();
            re_chart.data.datasets[0].data = latest_data_score_h.reverse();
            re_chart.data.datasets[1].data = latest_data_score_a.reverse();
            re_chart.update();
        }else if(select_val == 3){
            select_val = 15;
            if(no_game_length != 0){
                latest_content_adr.find('.no_game').remove();
            }
            for(var s=0; s<select_val; s++){
                latest_content_adr.children('div:nth-child('+(s+1)+')').removeClass('nonDisplay');
            }
            for(var i=0; i<latest_length; i++) {
                latest_content_adr.children('div:nth-child('+(select_val+i+1)+')').addClass('nonDisplay');
                if(league_val == 0) {
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');
                        if(team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }else{
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');
                        if(loop_home_idx == team_idx) {

                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }else {
                    var loop_league_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)').data('league_idx');
                    if(loop_league_idx != league_val){
                        latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').addClass('nonDisplay');
                    }
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                        if(team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }else{
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx == team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }
            }
            var nonDisplay_length = latest_content_adr.children('div').not('.nonDisplay').length;
            if(nonDisplay_length == 0){
                // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
                //     button: "확인",
                // });
                html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
                latest_content_adr.append(html);
                html = '';
            }
            re_chart.data.labels = latest_data_date.reverse();
            re_chart.data.datasets[0].data = latest_data_score_h.reverse();
            re_chart.data.datasets[1].data = latest_data_score_a.reverse();
            re_chart.update();
        }else if(select_val == 4){
            if(no_game_length != 0){
                latest_content_adr.find('.no_game').remove();
            }
            for(var i=0; i<latest_length; i++){
                latest_content_adr.children('div:nth-child('+(i+1)+')').removeClass('nonDisplay');
                if(league_val == 0) {
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');
                        if (team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        } else {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                            latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                            latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');
                        if(loop_home_idx == team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');
                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }else {
                    var loop_league_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)').data('league_idx');
                    if(loop_league_idx != league_val){
                        latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').addClass('nonDisplay');
                    }
                    if(all_game_class == 'all_game latest_selected') {
                        var loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                        if(team_idx == loop_home_idx) {
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }else{
                            latest_score_h = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(2)').text(),
                                latest_score_a = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(6)').children('span:nth-child(1)').text(),
                                latest_date = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(3)').text();
                        }
                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else if(home_game_class == 'home_game latest_selected'){
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx == team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }else if(away_game_class == 'away_game latest_selected') {
                        var loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)'),
                            loop_home_idx = loop_idx_adr.data('home_idx');

                        if(loop_home_idx != team_idx) {
                            var latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        }else{
                            latest_content_adr.children('div:nth-child(' + (i + 1) + ')').addClass('nonDisplay');
                        }
                    }
                }
            }
            var nonDisplay_length = latest_content_adr.children('div').not('.nonDisplay').length;
            if(nonDisplay_length == 0){
                // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
                //     button: "확인",
                // });
                html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
                latest_content_adr.append(html);
                html = '';
            }
            re_chart.data.labels = latest_data_date.reverse();
            re_chart.data.datasets[0].data = latest_data_score_h.reverse();
            re_chart.data.datasets[1].data = latest_data_score_a.reverse();
            re_chart.update();
        }
    }).on('change','#home_latest #game_league, #away_latest #game_league', function() { // 최근경기 리그 선택 이벤트 (최근 경기)
        var _this = $(this),
            parent_id = _this.parents('section').attr('id'),
            select_val = _this.val(),
            game_val = '',
            all_game_class = '',
            home_game_class = '',
            away_game_class = '',
            team_name = '',
            latest_content_adr = '',
            latest_length = '',
            no_game_length = '',
            latest_data_score_h = [],
            latest_data_score_a = [],
            latest_data_date = [],
            team_idx = '',
            re_chart = '',
            html = '';
        console.log(parent_id);
        if(parent_id == 'home_latest') {
            game_val = $('#home_latest #latest_game').val(),
            all_game_class = $('#home_latest .filter_nav div:nth-child(3)').attr('class'),
            home_game_class = $('#home_latest .filter_nav div:nth-child(4)').attr('class'),
            away_game_class = $('#home_latest .filter_nav div:nth-child(5)').attr('class'),
            team_name = $('#home_latest .main_title div span').text(),
            latest_content_adr = $('#home_latest > div.game_content'),
            latest_length = latest_content_adr.children().not('.no_game').length,
            no_game_length = latest_content_adr.children('.no_game').length,
            team_idx = $('#analysis_title .team_info .home_info').data('home_idx'),
            re_chart = l_chart_h;
        }else if(parent_id == 'away_latest'){
            game_val = $('#away_latest #latest_game').val(),
            all_game_class = $('#away_latest .filter_nav div:nth-child(3)').attr('class'),
            home_game_class = $('#away_latest .filter_nav div:nth-child(4)').attr('class'),
            away_game_class = $('#away_latest .filter_nav div:nth-child(5)').attr('class'),
            team_name = $('#away_latest .main_title div span').text(),
            latest_content_adr = $('#away_latest > div.game_content'),
            latest_length = latest_content_adr.children().not('.no_game').length,
            no_game_length = latest_content_adr.children('.no_game').length,
            team_idx = $('#analysis_title .team_info .away_info').data('away_idx'),
            re_chart = l_chart_a;
        }

        console.log(select_val);
        console.log(latest_length);
        console.log(game_val);
        console.log(all_game_class);
        console.log(home_game_class);
        console.log(away_game_class);
        _this.children('option:selected').attr('selected', true);
        _this.children('option:selected').siblings().attr('selected',false);

        var latest_score_h,latest_score_a,latest_date;

        if (parseInt(game_val) == 1) {
            game_val = 5;
        } else if (parseInt(game_val) == 2) {
            game_val = 10;
        } else if (parseInt(game_val) == 3) {
            game_val = 15;
        } else if (parseInt(game_val) == 4) {
            game_val = 20;
        }
        if(no_game_length != 0){
            latest_content_adr.find('.no_game').remove();
        }
        for(var g=0; g<game_val; g++) {
            console.log(latest_content_adr.children('div:nth-child(' + (g + 1) + ')'));
            latest_content_adr.children('div:nth-child(' + (g + 1) + ')').removeClass('nonDisplay');
        }
        if(select_val != 0){
            if(all_game_class == 'all_game latest_selected') {
                for (var i = 0; i < latest_length; i++) {
                    var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                        loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                        league_idx = loop_idx_adr.data('league_idx'),
                        loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                    if (league_idx == select_val) {
                        if (team_idx == loop_home_idx) {
                            latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        } else {
                            latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        }
                        latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    } else {
                        loop_game_adr.addClass('nonDisplay');
                    }

                }
            }else if(home_game_class == 'home_game latest_selected'){
                for (var i = 0; i < latest_length; i++) {
                    var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                        loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                        league_idx = loop_idx_adr.data('league_idx'),
                        loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                    if (league_idx == select_val) {
                        console.log(team_idx);
                        console.log(loop_home_idx);
                        if (team_idx == loop_home_idx) {
                            console.log(loop_idx_adr);
                            var n_loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)');
                            latest_score_h = n_loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = n_loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = n_loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                            console.log(latest_data_score_h);
                            console.log(latest_data_score_a);
                            console.log(latest_data_date);
                        }else{
                            loop_game_adr.addClass('nonDisplay');
                        }
                    } else {
                        loop_game_adr.addClass('nonDisplay');
                    }

                }
            }else if(away_game_class == 'away_game latest_selected'){
                for (var i = 0; i < latest_length; i++) {
                    var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                        loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                        league_idx = loop_idx_adr.data('league_idx'),
                        loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                    if (league_idx == select_val) {
                        console.log(team_idx);
                        console.log(loop_home_idx);
                        if (team_idx != loop_home_idx) {
                            console.log(loop_idx_adr);
                            var n_loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)');
                            latest_score_h = n_loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = n_loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = n_loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                            console.log(latest_data_score_h);
                            console.log(latest_data_score_a);
                            console.log(latest_data_date);
                        }else{
                            loop_game_adr.addClass('nonDisplay');
                        }
                    } else {
                        loop_game_adr.addClass('nonDisplay');
                    }

                }
            }
            var nonDisplay_length = latest_content_adr.children('div').not('.nonDisplay').length;
            if(nonDisplay_length == 0){
                // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
                //     button: "확인",
                // });
                html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
                latest_content_adr.append(html);
                html = '';
            }
        }else{
            if(all_game_class == 'all_game latest_selected') {
                for (var i = 0; i < latest_length; i++) {
                    var loop_game_adr = latest_content_adr.children('div:nth-child(' + (game_val+i + 1) + ')').not('.nonDisplay'),
                        loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                        loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');
                    loop_game_adr.addClass('nonDisplay');
                    if (team_idx == loop_home_idx) {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                    } else {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                    }
                    latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                    if (latest_score_h) {
                        latest_data_score_h.push(latest_score_h);
                        latest_data_score_a.push(latest_score_a);
                        latest_data_date.push(latest_date.substr(3, 5));
                    }
                }
            }else if(home_game_class == 'home_game latest_selected'){
                for (var i = 0; i < latest_length; i++) {
                    var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                        loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                        loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                    if (team_idx == loop_home_idx) {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    } else {
                        loop_game_adr.addClass('nonDisplay');
                    }

                }
            }else if(away_game_class == 'away_game latest_selected'){
                for (var i = 0; i < latest_length; i++) {
                    var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                        loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                        loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                    if (team_idx != loop_home_idx) {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();
                    } else {
                        loop_game_adr.addClass('nonDisplay');
                    }
                    if (latest_score_h) {
                        latest_data_score_h.push(latest_score_h);
                        latest_data_score_a.push(latest_score_a);
                        latest_data_date.push(latest_date.substr(3, 5));
                    }
                }
            }
        }
        var nonDisplay_length = latest_content_adr.children('div').not('.nonDisplay').length;
        if(nonDisplay_length == 0){
            // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
            //     button: "확인",
            // });
            html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
            latest_content_adr.append(html);
            html = '';
        }
        re_chart.data.labels = latest_data_date.reverse();
        re_chart.data.datasets[0].data = latest_data_score_h.reverse();
        re_chart.data.datasets[1].data = latest_data_score_a.reverse();
        re_chart.update();
    }).on('click','#home_latest .filter_nav div, #away_latest .filter_nav div', function() {
        // 최근경기 전체, 홈, 원정 클릭 이벤트 (최근 경기)
        var _this = $(this),
            _this_class = _this.attr('class'),
            parent_id = _this.parents('section').attr('id'),
            league_name_val = '',
            game_val = '',
            all_game_class = '',
            home_game_class = '',
            away_game_class = '',
            team_name = '',
            latest_content_adr = '',
            latest_length = '',
            no_game_length = '',
            latest_data_score_h = [],
            latest_data_score_a = [],
            latest_data_date = [],
            team_idx = '',
            re_chart = '',
            html = '';
        console.log(parent_id);
        if(_this.hasClass('latest_selected')){
            _this.siblings('div').removeClass('latest_selected');
        }else{
            _this.addClass('latest_selected');
            _this.siblings('div').removeClass('latest_selected');
        }
        if(parent_id == 'home_latest') {
            game_val = $('#home_latest #latest_game').val(),
            league_name_val = $('#home_latest #game_league').val(),
            all_game_class = $('#home_latest .filter_nav div:nth-child(3)').attr('class'),
            home_game_class = $('#home_latest .filter_nav div:nth-child(4)').attr('class'),
            away_game_class = $('#home_latest .filter_nav div:nth-child(5)').attr('class'),
            team_name = $('#home_latest .main_title div span').text(),
            latest_content_adr = $('#home_latest > div.game_content'),
            latest_length = latest_content_adr.children().not('.no_game').length,
            no_game_length = latest_content_adr.children('.no_game').length,
            team_idx = $('#analysis_title .team_info .home_info').data('home_idx'),
            re_chart = l_chart_h;
        }else if(parent_id == 'away_latest'){
            game_val = $('#away_latest #latest_game').val(),
            league_name_val = $('#away_latest #game_league').val(),
            all_game_class = $('#away_latest .filter_nav div:nth-child(3)').attr('class'),
            home_game_class = $('#away_latest .filter_nav div:nth-child(4)').attr('class'),
            away_game_class = $('#away_latest .filter_nav div:nth-child(5)').attr('class'),
            team_name = $('#away_latest .main_title div span').text(),
            latest_content_adr = $('#away_latest > div.game_content'),
            latest_length = latest_content_adr.children().not('.no_game').length,
            no_game_length = latest_content_adr.children('.no_game').length,
            team_idx = $('#analysis_title .team_info .away_info').data('away_idx'),
            re_chart = l_chart_a;
        }
        var latest_score_h,latest_score_a,latest_date;
        console.log(_this_class);

        if (parseInt(game_val) == 1) {
            game_val = 5;
        } else if (parseInt(game_val) == 2) {
            game_val = 10;
        } else if (parseInt(game_val) == 3) {
            game_val = 15;
        } else if (parseInt(game_val) == 4) {
            game_val = 20;
        }
        if(no_game_length != 0){
            latest_content_adr.find('.no_game').remove();
        }
        for(var g=0; g<game_val; g++) {
            console.log(latest_content_adr.children('div:nth-child(' + (g + 1) + ')'));
            latest_content_adr.children('div:nth-child(' + (g + 1) + ')').removeClass('nonDisplay');
        }
        console.log(all_game_class);
        console.log(home_game_class);
        console.log(away_game_class);
        if(all_game_class == 'all_game latest_selected'){
            for (var i = 0; i < latest_length; i++) {
                var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                    loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                    league_idx = loop_idx_adr.data('league_idx'),
                    loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                if(league_name_val != 0) {
                    if(league_idx == league_name_val) {
                        if (team_idx == loop_home_idx) {
                            latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();
                        } else {
                            latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();
                        }

                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    }else{
                        loop_game_adr.addClass('nonDisplay');
                    }
                }else{
                    if (team_idx == loop_home_idx) {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();
                    } else {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();
                    }

                    if (latest_score_h) {
                        latest_data_score_h.push(latest_score_h);
                        latest_data_score_a.push(latest_score_a);
                        latest_data_date.push(latest_date.substr(3, 5));
                    }
                }
            }
        }else if(home_game_class == 'home_game latest_selected'){
            for (var i = 0; i < latest_length; i++) {
                var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                    loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                    league_idx = loop_idx_adr.data('league_idx'),
                    loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                if(league_name_val != 0) {
                    if(league_idx == league_name_val) {
                        if (team_idx == loop_home_idx) {
                            latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        } else {
                            loop_game_adr.addClass('nonDisplay');
                        }
                    }else {
                        loop_game_adr.addClass('nonDisplay');
                    }
                }else{
                    if (team_idx == loop_home_idx) {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    } else {
                        loop_game_adr.addClass('nonDisplay');
                    }
                }
            }
        }else if(away_game_class == 'away_game latest_selected'){
            for (var i = 0; i < latest_length; i++) {
                var loop_game_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay'),
                    loop_idx_adr = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(1)'),
                    league_idx = loop_idx_adr.data('league_idx'),
                    loop_home_idx = latest_content_adr.children('div:nth-child(' + (i + 1) + ')').not('.nonDisplay').children('div:nth-child(5)').data('home_idx');

                if(league_name_val != 0) {
                    if(league_idx == league_name_val) {
                        if (team_idx != loop_home_idx) {
                            latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                            latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                            latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                            if (latest_score_h) {
                                latest_data_score_h.push(latest_score_h);
                                latest_data_score_a.push(latest_score_a);
                                latest_data_date.push(latest_date.substr(3, 5));
                            }
                        } else {
                            loop_game_adr.addClass('nonDisplay');
                        }

                    }else {
                        loop_game_adr.addClass('nonDisplay');
                    }
                }else{
                    if (team_idx != loop_home_idx) {
                        latest_score_h = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(2)').text();
                        latest_score_a = loop_idx_adr.siblings('div:nth-child(6)').children('span:nth-child(1)').text();
                        latest_date = loop_idx_adr.siblings('div:nth-child(3)').text();

                        if (latest_score_h) {
                            latest_data_score_h.push(latest_score_h);
                            latest_data_score_a.push(latest_score_a);
                            latest_data_date.push(latest_date.substr(3, 5));
                        }
                    } else {
                        loop_game_adr.addClass('nonDisplay');
                    }

                }
            }
        }
        var nonDisplay_length = latest_content_adr.children('div').not('.nonDisplay').length;
        if(nonDisplay_length == 0){
            // swal("조건에 해당하는 경기가 없습니다.", "조건을 변경해 주세요.", "warning", {
            //     button: "확인",
            // });
            html = '<div class="no_game"><div>조건에 해당하는 경기가 없습니다.</div></div>';
            latest_content_adr.append(html);
            html = '';
        }
        re_chart.data.labels = latest_data_date.reverse();
        re_chart.data.datasets[0].data = latest_data_score_h.reverse();
        re_chart.data.datasets[1].data = latest_data_score_a.reverse();
        re_chart.update();
    }).on('change', '#relative_record #latest_game', function () {
        var _this = $(this),
            latest_game_val = _this.val(),
            league_val = $('#relative_record #game_league').val(),
            json_data = _analysis_json,
            opp_data = json_data.opponent_record;

        _Analysis.relative_record_event(_this, latest_game_val, league_val);
        _Analysis.relative_record_stats_event(_this, latest_game_val, league_val, opp_data);
    }).on('change', '#relative_record #game_league', function() {
        // 상대 전적 상대전적 셀렉트박스 변경 이벤트
        var _this = $(this),
            league_val = _this.val(),
            latest_game_val = $('#relative_record #latest_game').val(),
            json_data = _analysis_json,
            opp_data = json_data.opponent_record;
        console.log(opp_data);
        console.log(json_data);

        _Analysis.relative_record_event(_this, latest_game_val, league_val);
        _Analysis.relative_record_stats_event(_this, latest_game_val, league_val, opp_data);
    }).on('click','#relative_record .filter_nav div', function() {
        // 상대전적 상대 전적 분석 전체 / 홈원정 홈 원정 홈/원정 클릭 이벤트
        var _this = $(this),
            latest_game_val = $('#relative_record #latest_game').val(),
            league_val = $('#relative_record #game_league').val(),
            json_data = _analysis_json,
            opp_data = json_data.opponent_record;

        if(_this.hasClass('latest_selected')){
            _this.siblings('div').removeClass('latest_selected');
        }else{
            _this.addClass('latest_selected');
            _this.siblings('div').removeClass('latest_selected');
        }

        _Analysis.relative_record_event(_this, latest_game_val, league_val);
        _Analysis.relative_record_stats_event(_this, latest_game_val, league_val, opp_data);
    }).on('change','#distribution_chart #latest_game, #distribution_chart #home_league, #distribution_chart #away_league', function() {
        // 득점 분포도 셀렉트 박스 변경 이벤트
        var _this = $(this),
            select_val = _this.val(),
            recent_val = $('#distribution_chart #latest_game').val(),
            _this_id = _this.attr('id'),
            json_data = _analysis_json,
            score_data = json_data.score_division;

        var html = '',

            home_score = '',
            away_score = '',
            data_arr = '',
            data_div = ['total','home','away'],
            home_name = $('#analysis_title > div.team_info > div.home_info > div:nth-child(2) > div:nth-child(1)').text(),
            away_name = $('#analysis_title > div.team_info > div.away_info > div:nth-child(1) > div:nth-child(1)').text(),
            name_arr = [home_name, away_name],
            color_arr = [home_c, away_c],
            content_class_arr = ['distri_h_content','distri_a_content'];
        var h_t_one=0, h_t_two=0, h_t_three=0, h_t_four=0, h_t_five=0, h_t_six=0, h_t_seven=0, h_t_eight=0, h_t_nine=0;
        var h_h_one=0, h_h_two=0, h_h_three=0, h_h_four=0, h_h_five=0, h_h_six=0, h_h_seven=0, h_h_eight=0, h_h_nine=0;
        var h_a_one=0, h_a_two=0, h_a_three=0, h_a_four=0, h_a_five=0, h_a_six=0, h_a_seven=0, h_a_eight=0, h_a_nine=0;
        var h_total_arr1 = [h_t_one, h_t_two, h_t_three, h_t_four, h_t_five],
            h_total_arr2 = [h_t_six, h_t_seven, h_t_eight, h_t_nine],
            h_home_arr1 = [h_h_one,h_h_two,h_h_three,h_h_four,h_h_five],
            h_home_arr2 = [h_h_six,h_h_seven,h_h_eight,h_h_nine],
            h_away_arr1 = [h_a_one,h_a_two,h_a_three,h_a_four,h_a_five],
            h_away_arr2 = [h_a_six,h_a_seven,h_a_eight,h_a_nine],
            h_score_division1 = [h_total_arr1, h_home_arr1, h_away_arr1],
            h_score_division2 = [h_total_arr2, h_home_arr2, h_away_arr2];
        var a_t_one=0, a_t_two=0, a_t_three=0, a_t_four=0, a_t_five=0, a_t_six=0, a_t_seven=0, a_t_eight=0, a_t_nine=0;
        var a_h_one=0, a_h_two=0, a_h_three=0, a_h_four=0, a_h_five=0, a_h_six=0, a_h_seven=0, a_h_eight=0, a_h_nine=0;
        var a_a_one=0, a_a_two=0, a_a_three=0, a_a_four=0, a_a_five=0, a_a_six=0, a_a_seven=0, a_a_eight=0, a_a_nine=0;
        var a_total_arr1 = [a_t_one, a_t_two, a_t_three, a_t_four, a_t_five],
            a_total_arr2 = [a_t_six, a_t_seven, a_t_eight, a_t_nine],
            a_home_arr1 = [a_h_one,a_h_two,a_h_three,a_h_four,a_h_five],
            a_home_arr2 = [a_h_six,a_h_seven,a_h_eight,a_h_nine],
            a_away_arr1 = [a_a_one,a_a_two,a_a_three,a_a_four,a_a_five],
            a_away_arr2 = [a_a_six,a_a_seven,a_a_eight,a_a_nine],
            a_score_division1 = [a_total_arr1, a_home_arr1, a_away_arr1],
            a_score_division2 = [a_total_arr2, a_home_arr2, a_away_arr2];
        var total_arr = [h_score_division1, a_score_division1],
            total_arr2 = [h_score_division2, a_score_division2];

        if (parseInt(recent_val) == 1) {
            recent_val = 5;
            home_score = score_data.home.game_5;
            away_score = score_data.away.game_5;
        } else if (parseInt(recent_val) == 2) {
            recent_val = 10;
            home_score = score_data.home.game_10;
            away_score = score_data.away.game_10;
        } else if (parseInt(recent_val) == 3) {
            recent_val = 15;
            home_score = score_data.home.game_15;
            away_score = score_data.away.game_15;
        } else if (parseInt(recent_val) == 4) {
            recent_val = 20;
            home_score = score_data.home.game_20;
            away_score = score_data.away.game_20;
        }
        data_arr = [home_score, away_score];
        console.log(data_arr.length);

        // if(_this_id == 'latest_game') {
        //     for (var h = 0; h < data_arr.length; h++) {
        //         for (var j = 0; j < data_div.length; j++) {
        //             var select_data = data_arr[h];
        //
        //             for (var g = 0; g < 5; g++) {
        //                 var loop_val = select_data[data_div[j]].filter(function (element) {
        //                     var type = [element.diff >= 2, element.diff == 1, element.diff == 0, element.diff == -1, element.diff <= -2];
        //                     return type[g];
        //                 }).length;
        //                 total_arr[h][j][g] += loop_val;
        //             }
        //             for (var k = 0; k < 4; k++) {
        //                 var loop_val2 = select_data[data_div[j]].filter(function (element) {
        //                     var type2 = [element.goal == 0, element.goal == 1, element.goal == 2, element.goal >= 3];
        //                     return type2[k]
        //                 }).length;
        //                 total_arr2[h][j][k] += loop_val2;
        //             }
        //         }
        //     }
        // }

        for (var h = 0; h < data_arr.length; h++) {
            for (var j = 0; j < data_div.length; j++) {
                var select_data = data_arr[h];
                if(_this_id == 'latest_game') {
                    $('#distribution_chart #away_league').find('option[value=0]').prop('selected', true);
                    $('#distribution_chart #away_league').find('option[value=0]').siblings().prop('selected', false);
                    $('#distribution_chart #home_league').find('option[value=0]').prop('selected', true);
                    $('#distribution_chart #home_league').find('option[value=0]').siblings().prop('selected', false);
                    for (var g = 0; g < 5; g++) {
                        var loop_val = select_data[data_div[j]].filter(function (element) {
                            var type = [element.diff >= 2, element.diff == 1, element.diff == 0, element.diff == -1, element.diff <= -2];
                            return type[g];
                        }).length;
                        total_arr[h][j][g] += loop_val;
                    }
                    for (var k = 0; k < 4; k++) {
                        var loop_val2 = select_data[data_div[j]].filter(function (element) {
                            var type2 = [element.goal == 0, element.goal == 1, element.goal == 2, element.goal >= 3];
                            return type2[k]
                        }).length;
                        total_arr2[h][j][k] += loop_val2;
                    }
                }else if(_this_id == 'home_league') {
                    var league_val = $('#distribution_chart #home_league').val(),
                        a_league_val = $('#distribution_chart #away_league').val();

                    $('#distribution_chart #away_league').find('option[value=0]').prop('selected', true);
                    $('#distribution_chart #away_league').find('option[value=0]').siblings().prop('selected', false);

                    if(league_val != 0) {
                        for (var g = 0; g < 5; g++) {
                            if(h == 1){
                                var loop_val = select_data[data_div[j]].filter(function (element) {
                                    var type = [element.diff >= 2, element.diff == 1, element.diff == 0, element.diff == -1, element.diff <= -2];
                                    return type[g];
                                }).length;
                                total_arr[h][j][g] += loop_val;
                            }else {
                                var loop_val = select_data[data_div[j]].filter(function (element) {
                                    var type = [element.diff >= 2 && element.league_idx == league_val, element.diff == 1 && element.league_idx == league_val,
                                        element.diff == 0 && element.league_idx == league_val, element.diff == -1 && element.league_idx == league_val,
                                        element.diff <= -2 && element.league_idx == league_val
                                    ];
                                    return type[g];
                                }).length;
                                total_arr[h][j][g] += loop_val;
                            }
                        }
                        for (var k = 0; k < 4; k++) {
                            if(h ==1) {
                                var loop_val2 = select_data[data_div[j]].filter(function (element) {
                                    var type2 = [element.goal == 0, element.goal == 1, element.goal == 2, element.goal >= 3];
                                    return type2[k]
                                }).length;
                                total_arr2[h][j][k] += loop_val2;
                            }else{
                                var loop_val2 = select_data[data_div[j]].filter(function (element) {
                                    var type2 = [element.goal == 0 && element.league_idx == league_val, element.goal == 1 && element.league_idx == league_val,
                                        element.goal == 2 && element.league_idx == league_val, element.goal >= 3 && element.league_idx == league_val
                                    ];
                                    return type2[k]
                                }).length;
                                total_arr2[h][j][k] += loop_val2;
                            }
                        }
                    }else {
                        for (var g = 0; g < 5; g++) {
                            var loop_val = select_data[data_div[j]].filter(function (element) {
                                var type = [element.diff >= 2, element.diff == 1, element.diff == 0, element.diff == -1, element.diff <= -2];
                                return type[g];
                            }).length;
                            total_arr[h][j][g] += loop_val;
                        }
                        for (var k = 0; k < 4; k++) {
                            var loop_val2 = select_data[data_div[j]].filter(function (element) {
                                var type2 = [element.goal == 0, element.goal == 1, element.goal == 2, element.goal >= 3];
                                return type2[k]
                            }).length;
                            total_arr2[h][j][k] += loop_val2;
                        }
                    }
                }else if(_this_id == 'away_league') {
                    var league_val = $('#distribution_chart #away_league').val();

                    $('#distribution_chart #home_league').find('option[value=0]').prop('selected', true);
                    $('#distribution_chart #home_league').find('option[value=0]').siblings().prop('selected', false);

                    if(league_val != 0) {
                        for (var g = 0; g < 5; g++) {
                            if(h == 0) {
                                var loop_val = select_data[data_div[j]].filter(function (element) {
                                    var type = [element.diff >= 2, element.diff == 1, element.diff == 0, element.diff == -1, element.diff <= -2];
                                    return type[g];
                                }).length;
                                total_arr[h][j][g] += loop_val;
                            }else {
                                var loop_val = select_data[data_div[j]].filter(function (element) {
                                    var type = [element.diff >= 2 && element.league_idx == league_val, element.diff == 1 && element.league_idx == league_val,
                                        element.diff == 0 && element.league_idx == league_val, element.diff == -1 && element.league_idx == league_val,
                                        element.diff <= -2 && element.league_idx == league_val];
                                    return type[g];
                                }).length;
                                total_arr[h][j][g] += loop_val;
                            }
                        }
                        for (var k = 0; k < 4; k++) {
                            if(h == 0){
                                var loop_val2 = select_data[data_div[j]].filter(function (element) {
                                    var type2 = [element.goal == 0, element.goal == 1, element.goal == 2, element.goal >= 3];
                                    return type2[k]
                                }).length;
                                total_arr2[h][j][k] += loop_val2;
                            }else {
                                var loop_val2 = select_data[data_div[j]].filter(function (element) {
                                    var type2 = [element.goal == 0 && element.league_idx == league_val, element.goal == 1 && element.league_idx == league_val,
                                        element.goal == 2 && element.league_idx == league_val, element.goal >= 3 && element.league_idx == league_val
                                    ];
                                    return type2[k]
                                }).length;
                                total_arr2[h][j][k] += loop_val2;
                            }
                        }
                    }else {
                        for (var g = 0; g < 5; g++) {
                            var loop_val = select_data[data_div[j]].filter(function (element) {
                                var type = [element.diff >= 2, element.diff == 1, element.diff == 0, element.diff == -1, element.diff <= -2];
                                return type[g];
                            }).length;
                            total_arr[h][j][g] += loop_val;
                        }
                        for (var k = 0; k < 4; k++) {
                            var loop_val2 = select_data[data_div[j]].filter(function (element) {
                                var type2 = [element.goal == 0, element.goal == 1, element.goal == 2, element.goal >= 3];
                                return type2[k]
                            }).length;
                            total_arr2[h][j][k] += loop_val2;
                        }
                    }
                }
            }
        }

        var remove_node = new Promise(function(resolve, reject){
            $('#distribution_chart > div:nth-child(4)').nextAll().remove();
            $('#distribution_chart > div:nth-child(4)').remove();
            resolve(1);
        }).then(function() {
            for(var n=0; n<data_arr.length; n++) {
                html += '<div class="main_sub_title">';
                html += '<div style="border-top: 1px solid ' + color_arr[n] + ';">' + name_arr[n] + '</div>';
                html += '</div>';
                html += '<div class="distri_sub_title">';
                html += '<div></div>';
                html += '<div>2골차 이상 승</div>';
                html += '<div>1골차 승</div>';
                html += '<div>무승부</div>';
                html += '<div>1골차 패</div>';
                html += '<div>2골차 이상 패</div>';
                html += '<div>무득점</div>';
                html += '<div>1골 득점</div>';
                html += '<div>2골 득점</div>';
                html += '<div>3골 이상 득점</div>';
                html += '</div>';
                html += '<div class="'+content_class_arr[n]+'">';
                for(var x=0; x<data_div.length; x++) {
                    var title_type = ['전체','홈','원정'];
                    var max_index = total_arr[n][x].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                    var max_index2 = total_arr2[n][x].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                    var loop_data = total_arr[n][x];
                    var loop_data2 = total_arr2[n][x];

                    html += '<div>';
                    html += '<div>'+title_type[x]+'</div>';
                    for(var c=0; c<loop_data.length; c++) {
                        if(c == max_index){
                            html += '<div class="distri_selected">'+loop_data[c]+'<em class="distri_selected_box"></em></div>';
                        }else {
                            html += '<div>' + loop_data[c] + '</div>';
                        }
                    }
                    for(var e=0; e<loop_data2.length; e++) {
                        if(e == max_index2){
                            html += '<div class="distri_selected">'+loop_data2[e]+'<em class="distri_selected_box"></em></div>';
                        }else{
                            html += '<div>' + loop_data2[e] + '</div>';
                        }
                    }

                    html += '</div>';
                }
                html += '<div class="distri_result">';
                html += '<div><span>' + name_arr[n] + '</span>팀은 최근 <span>10</span>경기에서 <span>2골차 이상 패</span>을 가장 많이 기록하였습니다</div>';
                html += '</div>';

                html += '</div>';
            }
            return html;
        }).then(function(html) {
            $('#distribution_chart').append(html);
            html = '';
        }).then(function(){
            var loop_node, loop_class, max_text, a_loop_node, a_loop_class, a_max_text;


            /************** 득점 분포도 득점 정렬 같은 값이 있을 시 오른쪽 값 선택 시작 ***************/
            for(var b=0; b<3; b++) {
                for(var t=6; t<10; t++) {
                    loop_node = $('#distribution_chart > div.distri_h_content > div:nth-child(' + (b + 1) + ')').children().eq(t);
                    loop_class = loop_node.attr('class');
                    a_loop_node = $('#distribution_chart > div.distri_a_content > div:nth-child(' + (b + 1) + ')').children().eq(t);
                    a_loop_class = a_loop_node.attr('class');

                    if (loop_class == 'distri_selected') {
                        max_text = loop_node.text();
                    }
                    if (a_loop_class == 'distri_selected') {
                        a_max_text = a_loop_node.text();
                    }

                    for (var v = 6; v < 10; v++) {
                        var loop_node2 = $('#distribution_chart > div.distri_h_content > div:nth-child(' + (b + 1) + ')').children().eq(v),
                            loop_class2 = loop_node2.attr('class');
                        var a_loop_node2 = $('#distribution_chart > div.distri_a_content > div:nth-child(' + (b + 1) + ')').children().eq(v),
                            a_loop_class2 = a_loop_node2.attr('class');

                        if (loop_class2 == 'distri_selected') max_text = loop_node2.text();
                        if (loop_node2.text() == max_text && loop_node2.attr('class') !== 'distri_selected') {
                            loop_node2.addClass('distri_selected');
                            loop_node2.append('<em class="distri_selected_box"></em>');
                        }
                        if (a_loop_class2 == 'distri_selected') a_max_text = a_loop_node2.text();
                        if (a_loop_node2.text() == a_max_text && a_loop_node2.attr('class') !== 'distri_selected') {
                            a_loop_node2.addClass('distri_selected');
                            a_loop_node2.append('<em class="distri_selected_box"></em>');
                        }
                    }
                }
            }
            var title_text = null;
            var title_text2 = null;
            for(var c=0; c<3; c++) {
                var insert_class = $('#distribution_chart > div.distri_h_content > div:nth-child(' + (c + 1) + ')').find('.distri_selected_box');
                var a_insert_class = $('#distribution_chart > div.distri_a_content > div:nth-child(' + (c + 1) + ')').find('.distri_selected_box');
                var standard_num = 1;
                var a_standard_num = 1;

                if(insert_class.length > 2) {
                    for (var v = 0; v < insert_class.length; v++) {
                        if (standard_num !== 1 && standard_num !== insert_class.length) {
                            insert_class.eq(v).parent().removeClass('distri_selected');
                            insert_class.eq(v).remove();
                        }
                        if(c==0) {
                            if (standard_num === insert_class.length) {
                                var last_val_index = insert_class.eq(v).parent().index();
                                title_text = $('#distribution_chart > div:nth-child(5) > div:nth-child(' + (last_val_index + 1) + ')').text();
                            }
                        }
                        standard_num++;
                    }
                }
                if(a_insert_class.length > 2) {
                    for (var v = 0; v < a_insert_class.length; v++) {
                        if (a_standard_num !== 1 && a_standard_num !== a_insert_class.length) {
                            a_insert_class.eq(v).parent().removeClass('distri_selected');
                            a_insert_class.eq(v).remove();
                        }
                        if(c==0) {
                            if (a_standard_num === a_insert_class.length) {
                                var a_last_val_index = a_insert_class.eq(v).parent().index();
                                console.log(a_last_val_index + '   c번값 = ' + c);
                                title_text2 = $('#distribution_chart > div:nth-child(5) > div:nth-child(' + (a_last_val_index + 1) + ')').text();
                            }
                        }
                        a_standard_num++;
                    }
                }

            }
            /************** 득점 분포도 득점 정렬 같은 값이 있을 시 오른쪽 값 선택 끝 ***************/


                //var result_text_arr = ['을','을','를','를','를','을','을','을','을'];
            var h_max_val_index = total_arr[0][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            var h_max_val_index2 = total_arr2[0][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            var a_max_val_index = total_arr[1][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            var a_max_val_index2 = total_arr2[1][0].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
            var h_result_text = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (h_max_val_index+2) + ')').text();
            var h_result_text2 = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (5+(h_max_val_index2+2)) + ')').text();
            var a_result_text = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (a_max_val_index+2) + ')').text();
            var a_result_text2 = $DOCUMENT.find('#distribution_chart > div:nth-child(5) div:nth-child(' + (5+(a_max_val_index2+2)) + ')').text();
            console.log(title_text);
            console.log(title_text2);
            console.log(a_result_text);
            console.log(a_result_text2);

            if(title_text == null) {
                $DOCUMENT.find('#distribution_chart > .distri_h_content .distri_result div span:nth-child(3)').text(h_result_text + ' / ' + h_result_text2);
            }else{
                $DOCUMENT.find('#distribution_chart > .distri_h_content .distri_result div span:nth-child(3)').text(h_result_text + ' / ' + title_text);
            }
            if(title_text2 == null) {
                $DOCUMENT.find('#distribution_chart > .distri_a_content .distri_result div span:nth-child(3)').text(a_result_text + ' / ' + a_result_text2);
            }else{
                $DOCUMENT.find('#distribution_chart > .distri_a_content .distri_result div span:nth-child(3)').text(a_result_text + ' / ' + title_text2);
            }
        }).catch(function(err){
            console.log(err);
        });

    }).on('click','#first_score_loss .filter_button div', function() {
        // 선제득점 / 선제실점 (선제 득점 선제 실점) 필터 클릭 이벤트
        var _this = $(this),
            _this_table_box_adr = _this.parents().siblings('.table_box'),
            sub_class = _this.parent().parent().parent().attr('class'),
            main_class = _this.parent().parent().parent().parent().attr('class'),
            json_data = _analysis_json.detail_page_1.p1_3,
            a_h_a_div = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        console.log(main_class);
        console.log(sub_class);
        if(_this.hasClass('home_game') === true){
            a_h_a_div = 'home';
            _Analysis_event.first_goal_time_table_fn(_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div);
        }else if(_this.hasClass('away_game') === true) {
            a_h_a_div = 'away';
            _Analysis_event.first_goal_time_table_fn(_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div);
        }else if(_this.hasClass('all_game') === true) {
            a_h_a_div = 'total';
            _Analysis_event.first_goal_time_table_fn(_this_table_box_adr,json_data,_this,sub_class,main_class,a_h_a_div);
        }
    }).on('click','#lead_goal .filter_button div', function() {
        //리드골 등적 리드골 허용 필터 클릭 이벤트
        var _this = $(this),
            main_class = _this.parent().parent().parent().attr('class'),
            content_adr = _this.parent().parent().siblings('.lead_content'),
            content_class_name = ['.home_content','.away_content'],
            json_data = _analysis_json.detail_page_1.p1_4,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '',
            default_data = '',
            type = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(main_class === 'lead_win_result'){
            default_data = json_data.d1;
            type = 1;
            if(_this.hasClass('home_game') === true){
                a_h_t_div = 'home';
                _Analysis_event.lead_goal_lose_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('away_game') === true){
                a_h_t_div = 'away';
                _Analysis_event.lead_goal_lose_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('all_game') === true){
                a_h_t_div = 'total';
                _Analysis_event.lead_goal_lose_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }
        }else if(main_class === 'lead_lose_result'){
            default_data = json_data.d2;
            type = 2;
            if(_this.hasClass('home_game') === true){
                a_h_t_div = 'home';
                _Analysis_event.lead_goal_lose_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('away_game') === true){
                a_h_t_div = 'away';
                _Analysis_event.lead_goal_lose_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('all_game') === true){
                a_h_t_div = 'total';
                _Analysis_event.lead_goal_lose_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }
        }
    }).on('click','#goal_type_statistics .filter_button div', function() {
        // 골 유형 통계 필터 클릭 이벤트
        var _this = $(this),
            content_adr = _this.parent().parent().siblings('.type_content'),
            content_class_name = ['.home_content','.away_content'],
            json_data = _analysis_json.detail_page_1.p1_5.d1,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.goal_type_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.goal_type_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.goal_type_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name);
        }
    }).on('click','#first_performance .filter_button div', function() {
        //전반 경기력 필터 클릭 이벤트
        var _this = $(this),
            main_index = _this.parent().parent().parent().index(),
            content_adr = _this.parent().parent().siblings('.content_box'),
            content_class_name = ['.home_content','.away_content'],
            json_data = _analysis_json.detail_page_2.p2_2,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '',
            default_data = '',
            type = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(main_index === 0){
            default_data = json_data.d1;
            type = 1;
            if(_this.hasClass('home_game') === true){
                a_h_t_div = 'home';
                _Analysis_event.first_performance_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('away_game') === true){
                a_h_t_div = 'away';
                _Analysis_event.first_performance_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('all_game') === true){
                a_h_t_div = 'total';
                _Analysis_event.first_performance_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }
        }else if(main_index === 1){
            default_data = json_data.d2;
            type = 2;
            if(_this.hasClass('home_game') === true){
                a_h_t_div = 'home';
                _Analysis_event.first_performance_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('away_game') === true){
                a_h_t_div = 'away';
                _Analysis_event.first_performance_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }else if(_this.hasClass('all_game') === true){
                a_h_t_div = 'total';
                _Analysis_event.first_performance_filter(default_data,a_h_t_div,div_arr,content_adr,content_class_name,type);
            }
        }

    }).on('click','#goal_loss_time .content_container div:nth-child(2) .filter_button div', function() {
        // 득점시간 실점 시간 득점/실점 시간 경기 평균 시간 통계 필터 이벤트
        var _this = $(this),
            content_adr = _this.parent().parent().siblings('.content_box').children('.content_result'),
            content_class_name = ['.home_content','.away_content'],
            json_data = _analysis_json.detail_page_2.p2_3.d2,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.game_time_average_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.game_time_average_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.game_time_average_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name);
        }
    }).on('click','#goal_loss_time .content_container div:nth-child(3) .filter_button div,#goal_loss_time .content_container div:nth-child(4) .filter_button div,#goal_loss_time .content_container div:nth-child(5) .filter_button div,#goal_loss_time .content_container div:nth-child(6) .filter_button div', function() {
        // 득점시간 실점 시간 득점/실점 시간 15분 단위 득점 / 15분 단위 실점 필터 이벤트
        var _this = $(this),
            content_index =_this.parent().parent().parent().index(),
            content_adr = _this.parent().parent().siblings('.content_box').children('.content_result'),
            content_class_name = ['.home_content','.away_content'],
            json_data,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(content_index === 2){
            json_data = _analysis_json.detail_page_2.p2_3.d3;
        }else if(content_index === 3) {
            json_data = _analysis_json.detail_page_2.p2_3.d4;
        }else if(content_index === 4) {
            json_data = _analysis_json.detail_page_2.p2_3.d5;
        }else if(content_index === 5) {
            json_data = _analysis_json.detail_page_2.p2_3.d6;
        }
        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.goal_loss_15_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.goal_loss_15_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.goal_loss_15_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }
    }).on('mouseenter','#first_score_loss .tooltips, #goal_loss_time .tooltips', function() {
        var $this = $(this),
            section_id = $this.parents('section').attr('id'),
            json_data,
            this_index = $this.index(),
            parent_index = $this.parent().parent().parent().index(),
            default_data;

        if(section_id === 'first_score_loss') {
            json_data = _analysis_json.detail_page_1.p1_3.d1;

            if(parent_index === 2){
                default_data = json_data.div_home;
            }else if(parent_index === 3){
                default_data = json_data.div_away;
            }

            var home_data = default_data.home,
                away_data = default_data.away,
                per_data = default_data.percent,
                width = $this.width();
            console.log(width);
            if (this_index === 0) {
                $this.append('<span>' + (home_data.first_goal + away_data.first_goal) + ' (' + per_data.per_first_goal + '%)</span>');
                _Analysis_event.tooltip_position($this, width);
            } else if (this_index === 1) {
                $this.append('<span>' + (home_data.no_score + away_data.no_score) + ' (' + per_data.no_score + '%)</span>');
                _Analysis_event.tooltip_position($this, width);
            } else if (this_index === 2) {
                $this.append('<span>' + (home_data.first_lose + away_data.first_lose) + ' (' + per_data.per_first_lose + '%)</span>');
                _Analysis_event.tooltip_position($this, width);
            }
        }else if(section_id === 'goal_loss_time') {
            var filter_val = $this.parents('.content_box').siblings('.content_title').find('.time_selected').index(),
                filter_data;
            json_data = _analysis_json.detail_page_2.p2_3.d2;

            if(filter_val === 0){
                filter_data = json_data.total;
            }else if(filter_val === 1){
                filter_data = json_data.home;
            }else if(filter_val === 2){
                filter_data = json_data.away;
            }

            if(parent_index === 0){
                default_data = filter_data.div_home;
                console.log(default_data);
            }else if(parent_index === 1){
                default_data = filter_data.div_away;
            }

            var width = $this.width();

            if(this_index === 0){
                $this.append('<span>' + default_data.time_W + ' (' + default_data.time_W_per + '%)</span>');
                _Analysis_event.tooltip_position($this, width);
            } else if(this_index === 1){
                $this.append('<span>' + default_data.time_D + ' (' + default_data.time_D_per + '%)</span>');
                _Analysis_event.tooltip_position($this, width);
            } else if(this_index === 2){
                $this.append('<span>' + default_data.time_L + ' (' + default_data.time_L_per + '%)</span>');
                _Analysis_event.tooltip_position($this, width);
            }
        }
        $this.addClass("select_icon");
    }).on('mouseleave','#first_score_loss .tooltips, #goal_loss_time .tooltips', function() {
        var $this = $(this);
        $this.removeClass("select_icon");
        $this.children().remove();
    }).on('click','#avg_goal_loss .main_content div:nth-child(2) .filter_button div, #avg_goal_loss .main_content div:nth-child(3) .filter_button div', function() {
        //평균 득실점 필터 이벤트
        var _this = $(this),
            content_index =_this.parent().parent().parent().index(),
            content_adr = _this.parent().parent().siblings('.content_box').children('.content_result'),
            content_class_name = ['.home_content','.away_content'],
            json_data,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(content_index === 1){
            json_data = _analysis_json.detail_page_3.p3_1.d2;
        }else if(content_index === 2) {
            json_data = _analysis_json.detail_page_3.p3_1.d3;
        }

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.avg_goal_loss_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.avg_goal_loss_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.avg_goal_loss_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }
    }).on('click','#avg_relative_record .main_content div:nth-child(1) .filter_button div,#avg_relative_record .main_content div:nth-child(2) .filter_button div', function() {
        // 평균 득실점 상대전적 필터 이벤트
        var _this = $(this),
            content_index =_this.parent().parent().parent().index(),
            content_adr,
            content_class_name = ['.home_content','.away_content'],
            json_data,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(content_index === 0){
            json_data = _analysis_json.detail_page_3.p3_2.d1;
            content_adr = _this.parent().parent().siblings('.content_box').find('.all_content')
        }else if(content_index === 1) {
            json_data = _analysis_json.detail_page_3.p3_2.d2;
            content_adr = _this.parent().parent().siblings('.content_box').find('.content_result')
        }

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.avg_relative_record_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.avg_relative_record_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.avg_relative_record_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }
    }).on('click','#goal_loss_margin .main_content div:nth-child(1) .filter_button div,#goal_loss_margin .main_content div:nth-child(2) .filter_button div',function() {
        // 득실점 마진 필터 이벤트
        var _this = $(this),
            content_index =_this.parent().parent().parent().index(),
            content_adr = _this.parent().parent().siblings('.table_content'),
            content_class_name = ['.home_content','.away_content'],
            json_data,
            div_arr = ['div_home','div_away'],
            a_h_t_div = '';

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(content_index === 0){
            json_data = _analysis_json.detail_page_3.p3_3.d1;
        }else if(content_index === 1) {
            json_data = _analysis_json.detail_page_3.p3_3.d2;
        }

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.goal_loss_margin_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.goal_loss_margin_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.goal_loss_margin_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index);
        }
    }).on('click','#latest_trend .main_content div:nth-child(1) .filter_button div,#latest_trend .main_content div:nth-child(2) .filter_button div,#latest_trend .main_content div:nth-child(3) .filter_button div,#latest_trend .main_content div:nth-child(4) .filter_button div', function() {
        // 최근 추세 필터 클릭 이벤트
        var _this = $(this),
            content_index =_this.parent().parent().parent().index(),
            content_adr = _this.parent().parent().siblings('.table_content'),
            content_class_name = ['.home_content','.away_content'],
            json_data,
            div_arr = ['div_home','div_away'],
            a_h_t_div,
            type;

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(content_index === 0){
            json_data = _analysis_json.detail_page_3.p3_4.d1;
            type = 1;
        }else if(content_index === 1) {
            json_data = _analysis_json.detail_page_3.p3_4.d2;
            type = 1;
        }else if(content_index === 2) {
            json_data = _analysis_json.detail_page_3.p3_4.d3;
            type = 2;
        }else if(content_index === 3) {
            json_data = _analysis_json.detail_page_3.p3_4.d4;
            type = 2;
        }

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.latest_trend_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index,type);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.latest_trend_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index,type);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.latest_trend_filter(json_data,a_h_t_div,div_arr,content_adr,content_class_name,content_index, type);
        }
    }).on('click','#game_result_stats .main_content div:nth-child(1) .filter_button div,#game_result_stats .main_content div:nth-child(2) .filter_button div,#game_result_stats .main_content div:nth-child(3) .filter_button div', function() {
        // 양팀 경기 결과별 성적 비교 필터 클릭 이벤트
        var _this = $(this),
            content_index =_this.parent().parent().parent().index(),
            content_adr = _this.parent().parent().siblings('.content_box'),
            json_data,
            div_arr = ['div_home','div_away'],
            a_h_t_div;

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(content_index === 0){
            json_data = _analysis_json.detail_page_4.p4_4.d1;
        }else if(content_index === 1) {
            json_data = _analysis_json.detail_page_4.p4_4.d2;
        }else if(content_index === 2) {
            json_data = _analysis_json.detail_page_4.p4_4.d3;
        }

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.game_result_stats_filter(json_data,a_h_t_div,div_arr,content_adr);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.game_result_stats_filter(json_data,a_h_t_div,div_arr,content_adr);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.game_result_stats_filter(json_data,a_h_t_div,div_arr,content_adr);
        }
    }).on('click','#rest_day .main_content .filter_button div', function() {
        //휴식일별 성적 비교 필터 클릭 이벤트
        var _this = $(this),
            content_adr = _this.parent().parent().siblings('.content_box'),
            json_data= _analysis_json.detail_page_4.p4_5.d1,
            div_arr = ['div_home','div_away'],
            a_h_t_div;

        _this.addClass('time_selected');
        _this.siblings().removeClass('time_selected');

        if(_this.hasClass('home_game') === true){
            a_h_t_div = 'home';
            _Analysis_event.rest_day_filter(json_data,a_h_t_div,div_arr,content_adr);
        }else if(_this.hasClass('away_game') === true){
            a_h_t_div = 'away';
            _Analysis_event.rest_day_filter(json_data,a_h_t_div,div_arr,content_adr);
        }else if(_this.hasClass('all_game') === true){
            a_h_t_div = 'total';
            _Analysis_event.rest_day_filter(json_data,a_h_t_div,div_arr,content_adr);
        }
    });

    /*********************************************************************************************************************************/
    /*******************************축구 analysis 페이지 이벤트  끝 *********************************************************************/
    /*********************************************************************************************************************************/






    /*********************************************************************************************************************************/
    /*******************************축구 analysis 페이지 이벤트 시작 *********************************************************************/
    /*********************************************************************************************************************************/
    // /********************************* 순위 이벤트 *********************************************/
    //
    // $("#headToHead").on("change", "#hthSelect", function () {
    //     // head to head select box 변경 이벤트
    //     var $this = $(this),
    //         content_adr = $("#headToHead #hthContent"),
    //         title_adr = $("#headToHead #titleContainer");
    //
    //     _Soccer.soccer_analysis_selectbox_event($this, content_adr, title_adr);
    // }).on("change", "#same", function () {
    //     // head to head H-A same 클릭이벤트
    //     var $this = $(this),
    //         content_adr = $("#headToHead #hthContent"),
    //         title_adr = $("#headToHead #titleContainer"),
    //         hthSelect = $("#hthSelect"),
    //         home_name = $("#standings #titleContainer .teamName div:nth-child(1)").text();
    //
    //     _Soccer.soccer_analysis_checkbox_event($this, content_adr, title_adr, hthSelect, home_name);
    // }).on("change", "#league_name", function () {
    //     // league select 선택 이벤트 (리그 선택 이벤트)
    //     var $this = $(this),
    //         content_adr = $("#headToHead #hthContent"),
    //         title_adr = $("#headToHead #titleContainer"),
    //         hthSelect = $("#hthSelect");
    //
    //     _Soccer.soccer_analysis_league_selectbox_event($this, content_adr, title_adr, hthSelect);
    // });
    //
    // /*****************************맞대결 이벤트 *****************************************/
    //
    // $("#PreviousScoresStatistics").on("change", "#h_statistics #staSelect", function () {
    //     // 홈팀 selectBox 변경 이벤트
    //     var $this = $(this),
    //         content_adr = $("#PreviousScoresStatistics #h_statistics #staContent"),
    //         title_adr = $("#PreviousScoresStatistics #titleContainer");
    //
    //     _Soccer.soccer_analysis_selectbox_event($this, content_adr, title_adr);
    // }).on("change", "#a_statistics #staSelect", function () {
    //     // 어웨이팀 selectBox 변경 이벤트
    //     var $this = $(this),
    //         content_adr = $("#PreviousScoresStatistics #a_statistics #staContent"),
    //         title_adr = $("#PreviousScoresStatistics #titleContainer");
    //
    //     _Soccer.soccer_analysis_selectbox_event($this, content_adr, title_adr);
    // }).on("change", "#h_statistics #same", function () {
    //     //홈팀 홈 체크박스 이벤트
    //     var $this = $(this),
    //         content_adr = $("#PreviousScoresStatistics #h_statistics #staContent"),
    //         title_adr = $("#PreviousScoresStatistics #titleContainer"),
    //         hthSelect = $("#staSelect"),
    //         home_name = $("#standings #titleContainer .teamName div:nth-child(1)").text();
    //
    //     _Soccer.soccer_analysis_checkbox_event($this, content_adr, title_adr, hthSelect, home_name);
    // }).on("change", "#a_statistics #same", function () {
    //     //어웨이 홈 체크박스 이벤트
    //     var $this = $(this),
    //         content_adr = $("#PreviousScoresStatistics #a_statistics #staContent"),
    //         title_adr = $("#PreviousScoresStatistics #a_statistics #titleContainer"),
    //         hthSelect = $("#PreviousScoresStatistics #a_statistics #staSelect"),
    //         home_name = $("#standings #titleContainer .teamName div:nth-child(2)").text();
    //
    //     _Soccer.soccer_analysis_checkbox_event($this, content_adr, title_adr, hthSelect, home_name);
    // }).on("change", "#h_statistics #league_name", function () {
    //     // 홈팀 league selectBox 이벤트
    //     var $this = $(this),
    //         content_adr = $("#PreviousScoresStatistics #h_statistics #staContent"),
    //         title_adr = $("#PreviousScoresStatistics #titleContainer"),
    //         hthSelect = $("#staSelect");
    //
    //     _Soccer.soccer_analysis_league_selectbox_event($this, content_adr, title_adr, hthSelect);
    // }).on("change", "#a_statistics #league_name", function () {
    //     // 어웨이 league selectBox 이벤트
    //     var $this = $(this),
    //         content_adr = $("#PreviousScoresStatistics #a_statistics #staContent"),
    //         title_adr = $("#PreviousScoresStatistics #a_statistics #titleContainer"),
    //         hthSelect = $("#PreviousScoresStatistics #a_statistics #staSelect");
    //
    //     _Soccer.soccer_analysis_league_selectbox_event($this, content_adr, title_adr, hthSelect);
    // });
    //
    // /*****************************************************************************************/
    // /*******************************축구 team info 페이지 이벤트 *******************************/
    // /*****************************************************************************************/
    //
    // $("#team_info").on("click", "#league_schedule #plus_btn", function () {
    //     // 더보기 클릭 이벤트
    //     //alert("gg");
    //     var html = "",
    //         data_team_sta = _team_json.team_stats,
    //         content_length = $("#league_schedule .schedule_content").children().not("#plus_btn").length,
    //         num = "",
    //         num2 = "",
    //         select_league_idx = $("#league_select").val();
    //     var first_json = $.grep(data_team_sta, function (n, i) {
    //         return n.league_idx == select_league_idx;
    //     });
    //
    //     console.log(first_json);
    //     if (select_league_idx == "all") {
    //         data_team_sta = _team_json.team_stats;
    //     } else {
    //         data_team_sta = first_json;
    //     }
    //     num = content_length;
    //     num2 = content_length + 20;
    //     if (content_length + 20 > data_team_sta.length) {
    //         num2 = content_length + (data_team_sta.length - content_length);
    //         $("#plus_btn").addClass("nonDisplay");
    //     }
    //     console.log(content_length);
    //     console.log(num);
    //     console.log(num2);
    //     _Soccer.soccer_team_statistics_content_html(num, num2, html, data_team_sta);
    // }).on("change", "#teamStatistics #league_select", function () {
    //     // 팀통계 리그 selectbox 변경 이벤트
    //     var $this = $(this),
    //         remove_adr = "#league_schedule .schedule_content div:not(#plus_btn)";
    //
    //     $this.find("option:selected").attr("selected", "selected");
    //     $this.find("option:selected").siblings().attr("selected", false);
    //     $DOCUMENT.find(remove_adr).remove();
    //
    //     var html = "",
    //         data_team_sta = _team_json.team_stats,
    //         data_league = _team_json.team_league_result,
    //         content_length = $("#league_schedule .schedule_content").children().not("#plus_btn").length,
    //         num = "",
    //         num2 = "",
    //         select_league_idx = $("#league_select").val();
    //     var first_json = $.grep(data_team_sta, function (n, i) {
    //         return n.league_idx == select_league_idx;
    //     });
    //     var league_json = $.grep(data_league, function (n, i) {
    //         return n.league_idx == select_league_idx;
    //     });
    //     console.log(league_json);
    //     if (select_league_idx == "all") {
    //         league_json = data_league;
    //     }
    //     var winRate = _Fn.cal_percent(league_json[0].win, parseInt(league_json[0].win) + parseInt(league_json[0].draw) + parseInt(league_json[0].loss)),
    //         staContent = $("#teamStatistics > div.staContent > div"),
    //         league_val = league_json[0];
    //     console.log(winRate);
    //     console.log(league_json[0].win);
    //     staContent.find("div:nth-child(1)").text(league_val.win);
    //     staContent.find("div:nth-child(2)").text(league_val.draw);
    //     staContent.find("div:nth-child(3)").text(league_val.loss);
    //     staContent.find("div:nth-child(4)").text(Math.round(winRate) + "%");
    //     staContent.find("div:nth-child(5)").text(league_val.fouls);
    //     staContent.find("div:nth-child(6)").text(league_val.yellow_card);
    //     staContent.find("div:nth-child(7)").text(league_val.red_card);
    //     staContent.find("div:nth-child(8)").text(league_val.possession + "%");
    //     staContent.find("div:nth-child(9)").text(league_val.shots + "(" + league_val.shots_ot + ")");
    //     staContent.find("div:nth-child(10)").text(league_val.passes + "(" + league_val.passes_success + ")");
    //     if (league_val.passes_success == 0 && league_val.passes == 0) {
    //         var pesses = 0;
    //     } else {
    //         var pesses = _Fn.cal_percent(league_val.passes_success, league_val.passes);
    //     }
    //     console.log(league_val.passes_success);
    //     console.log(league_val.passes);
    //     $("#teamStatistics > div.staContent > div > div:nth-child(11)").text(pesses.toFixed(0) + "%");
    //     $("#teamStatistics > div.staContent > div > div:nth-child(12)").text(league_val.dribbles);
    //     $("#teamStatistics > div.staContent > div > div:nth-child(13)").text(league_val.rating);
    //
    //     console.log(first_json);
    //     if (select_league_idx == "all") {
    //         data_team_sta = _team_json.team_stats;
    //     } else {
    //         data_team_sta = first_json;
    //     }
    //     num = content_length;
    //     num2 = content_length + 20;
    //     if (content_length + 20 > data_team_sta.length) {
    //         num2 = content_length + (data_team_sta.length - content_length);
    //         $("#plus_btn").addClass("nonDisplay");
    //     } else {
    //         $("#plus_btn").removeClass("nonDisplay");
    //     }
    //     console.log(content_length);
    //     console.log(num);
    //     console.log(num2);
    //     _Soccer.soccer_team_statistics_content_html(num, num2, html, data_team_sta);
    // }).on("change", "#team_select", function () {
    //     // team select 선택 이벤트
    //     var select_val = $("#team_select").val();
    //
    //     _team_number = select_val;
    //     console.log(select_val);
    //     //location.href = 'https://spoto.com/livescore/soccer/team/' + select_val;
    //     $("#league_schedule > div.schedule_content").children().remove();
    //     $("#honor").remove();
    //     $("#teamProfile").remove();
    //     $("#leagueStatsFull").remove();
    //     $("#leagueStatsHalf").remove();
    //     $("#cupStatsHandi").remove();
    //     $("#cupStatsHalf_handi").remove();
    //     $("#cupStatsOu").remove();
    //     $("#cupStatsHalf_ou").remove();
    //     $("#achievements").remove();
    //     $("#schedule").remove();
    //     $("#lineup").remove();
    //     $("#player").remove();
    //
    //     $("#team_select").children().not(":first-child").remove();
    //     $("#league_select").children().not(":first-child").remove();
    //     $("#cup_league_select").children().remove();
    //
    //     _Soccer_ajax.soccer_team(_team_number);
    //     $("#team_select").find("option:eq(0)").prop("selected", true);
    //     $("#team_select").find("option:eq(0)").siblings().prop("selected", false);
    // }).on("click", "#teamStatistics .staTitle .right_btn span", function () {
    //     // 공격시 수비시 클릭 이빈트(중지함)
    //     var $this = $(this);
    //     console.log($this);
    //     $this.addClass("on");
    //     $this.siblings().removeClass("on");
    // }).on("change", "#cup_league_select", function () {
    //     // cup 통계  league select 선택 이벤트
    //     var $this = $(this),
    //         select_class = $("#menu_nav").find(".selected").prop("class");
    //
    //     console.log(select_class);
    //     if (select_class == "cup selected") {
    //         _Soccer.soccer_cup_click_event($this, _team_total_json);
    //     } else if (select_class == "player selected") {
    //         _Soccer.soccer_player_select_change_event($this, _team_total_json);
    //     }
    // }).on("click", "#menu_nav .stats", function () {
    //     // 팀통계 클릭 이벤트
    //     var $this = $(this);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //     $("#teamStatistics").removeClass("nonDisplay");
    //     $("#league_schedule").removeClass("nonDisplay");
    //     $("#honor").removeClass("nonDisplay");
    //     $("#teamProfile").removeClass("nonDisplay");
    //     $("#leagueStatsFull").addClass("nonDisplay");
    //     $("#leagueStatsHalf").addClass("nonDisplay");
    //     $("#cupStatsHandi").addClass("nonDisplay");
    //     $("#cupStatsHalf_handi").addClass("nonDisplay");
    //     $("#cupStatsOu").addClass("nonDisplay");
    //     $("#cupStatsHalf_ou").addClass("nonDisplay");
    //     $("#achievements").addClass("nonDisplay");
    //     $("#schedule").addClass("nonDisplay");
    //     $("#lineup").addClass("nonDisplay");
    //     $("#player").addClass("nonDisplay");
    //     $("#transfer").addClass("nonDisplay");
    //
    //     $("#league_nodata").addClass("nonDisplay");
    //     $("#cup_nodata").addClass("nonDisplay");
    //     $("#ach_nodata").addClass("nonDisplay");
    //     $("#sch_nodata").addClass("nonDisplay");
    //     $("#line_nodata").addClass("nonDisplay");
    //     $("#player_nodata").addClass("nonDisplay");
    //     $("#trans_nodata").addClass("nonDisplay");
    //
    //     $("#team_select").removeClass("nonDisplay");
    //     $("#cup_league_select").addClass("nonDisplay");
    //     $("#trans").addClass("nonDisplay");
    // }).on("click", "#menu_nav .league", function () {
    //     // 리그 통계 클릭 이벤트
    //     var $this = $(this);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //     $("#teamStatistics").addClass("nonDisplay");
    //     $("#league_schedule").addClass("nonDisplay");
    //     $("#honor").addClass("nonDisplay");
    //     $("#teamProfile").addClass("nonDisplay");
    //     $("#leagueStatsFull").removeClass("nonDisplay");
    //     $("#leagueStatsHalf").removeClass("nonDisplay");
    //     $("#cupStatsHandi").addClass("nonDisplay");
    //     $("#cupStatsHalf_handi").addClass("nonDisplay");
    //     $("#cupStatsOu").addClass("nonDisplay");
    //     $("#cupStatsHalf_ou").addClass("nonDisplay");
    //     $("#achievements").addClass("nonDisplay");
    //     $("#schedule").addClass("nonDisplay");
    //     $("#lineup").addClass("nonDisplay");
    //     $("#player").addClass("nonDisplay");
    //     $("#transfer").addClass("nonDisplay");
    //
    //     $("#league_nodata").removeClass("nonDisplay");
    //     $("#cup_nodata").addClass("nonDisplay");
    //     $("#ach_nodata").addClass("nonDisplay");
    //     $("#sch_nodata").addClass("nonDisplay");
    //     $("#line_nodata").addClass("nonDisplay");
    //     $("#player_nodata").addClass("nonDisplay");
    //     $("#trans_nodata").addClass("nonDisplay");
    //
    //     $("#team_select").removeClass("nonDisplay");
    //     $("#cup_league_select").addClass("nonDisplay");
    //     $("#trans").addClass("nonDisplay");
    // }).on("click", "#menu_nav .cup", function () {
    //     //컵 통계 클릭 이벤트
    //     var $this = $(this);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //     $("#teamStatistics").addClass("nonDisplay");
    //     $("#league_schedule").addClass("nonDisplay");
    //     $("#honor").addClass("nonDisplay");
    //     $("#teamProfile").addClass("nonDisplay");
    //     $("#leagueStatsFull").addClass("nonDisplay");
    //     $("#leagueStatsHalf").addClass("nonDisplay");
    //     $("#cupStatsHandi").removeClass("nonDisplay");
    //     $("#cupStatsHalf_handi").removeClass("nonDisplay");
    //     $("#cupStatsOu").removeClass("nonDisplay");
    //     $("#cupStatsHalf_ou").removeClass("nonDisplay");
    //     $("#achievements").addClass("nonDisplay");
    //     $("#schedule").addClass("nonDisplay");
    //     $("#lineup").addClass("nonDisplay");
    //     $("#player").addClass("nonDisplay");
    //     $("#transfer").addClass("nonDisplay");
    //
    //     $("#league_nodata").addClass("nonDisplay");
    //     $("#cup_nodata").removeClass("nonDisplay");
    //     $("#ach_nodata").addClass("nonDisplay");
    //     $("#sch_nodata").addClass("nonDisplay");
    //     $("#line_nodata").addClass("nonDisplay");
    //     $("#player_nodata").addClass("nonDisplay");
    //     $("#trans_nodata").addClass("nonDisplay");
    //
    //     $("#team_select").addClass("nonDisplay");
    //     console.log($("#cup_nodata").length);
    //     if ($("#cup_nodata").length == 1) {
    //         $("#cup_league_select").addClass("nonDisplay");
    //     } else {
    //         $("#cup_league_select").removeClass("nonDisplay");
    //     }
    //     $("#trans").addClass("nonDisplay");
    // }).on("click", "#menu_nav .achievement", function () {
    //     // 업적 클릭 이벤트
    //     var $this = $(this);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //     $("#teamStatistics").addClass("nonDisplay");
    //     $("#league_schedule").addClass("nonDisplay");
    //     $("#honor").addClass("nonDisplay");
    //     $("#teamProfile").addClass("nonDisplay");
    //     $("#leagueStatsFull").addClass("nonDisplay");
    //     $("#leagueStatsHalf").addClass("nonDisplay");
    //     $("#cupStatsHandi").addClass("nonDisplay");
    //     $("#cupStatsHalf_handi").addClass("nonDisplay");
    //     $("#cupStatsOu").addClass("nonDisplay");
    //     $("#cupStatsHalf_ou").addClass("nonDisplay");
    //     $("#achievements").removeClass("nonDisplay");
    //     $("#schedule").addClass("nonDisplay");
    //     $("#lineup").addClass("nonDisplay");
    //     $("#player").addClass("nonDisplay");
    //     $("#transfer").addClass("nonDisplay");
    //
    //     $("#league_nodata").addClass("nonDisplay");
    //     $("#cup_nodata").addClass("nonDisplay");
    //     $("#ach_nodata").removeClass("nonDisplay");
    //     $("#sch_nodata").addClass("nonDisplay");
    //     $("#line_nodata").addClass("nonDisplay");
    //     $("#player_nodata").addClass("nonDisplay");
    //     $("#trans_nodata").addClass("nonDisplay");
    //
    //     $("#team_select").addClass("nonDisplay");
    //     $("#cup_league_select").addClass("nonDisplay");
    //     $("#trans").addClass("nonDisplay");
    // }).on("click", "#menu_nav .schedule", function () {
    //     // 일정 클릭 이벤트
    //     var $this = $(this);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //     $("#teamStatistics").addClass("nonDisplay");
    //     $("#league_schedule").addClass("nonDisplay");
    //     $("#honor").addClass("nonDisplay");
    //     $("#teamProfile").addClass("nonDisplay");
    //     $("#leagueStatsFull").addClass("nonDisplay");
    //     $("#leagueStatsHalf").addClass("nonDisplay");
    //     $("#cupStatsHandi").addClass("nonDisplay");
    //     $("#cupStatsHalf_handi").addClass("nonDisplay");
    //     $("#cupStatsOu").addClass("nonDisplay");
    //     $("#cupStatsHalf_ou").addClass("nonDisplay");
    //     $("#achievements").addClass("nonDisplay");
    //     $("#schedule").removeClass("nonDisplay");
    //     $("#lineup").addClass("nonDisplay");
    //     $("#player").addClass("nonDisplay");
    //     $("#transfer").addClass("nonDisplay");
    //
    //     $("#league_nodata").addClass("nonDisplay");
    //     $("#cup_nodata").addClass("nonDisplay");
    //     $("#ach_nodata").addClass("nonDisplay");
    //     $("#sch_nodata").removeClass("nonDisplay");
    //     $("#line_nodata").addClass("nonDisplay");
    //     $("#player_nodata").addClass("nonDisplay");
    //     $("#trans_nodata").addClass("nonDisplay");
    //
    //     $("#team_select").addClass("nonDisplay");
    //     $("#cup_league_select").addClass("nonDisplay");
    //     $("#trans").addClass("nonDisplay");
    // }).on("click", "#schedule .schContent div div:nth-child(7) span", function () {
    //     // 일정 분석페이지 아이콘 클릭 이벤트
    //     var $this = $(this),
    //         select_idx = $this.attr("class"),
    //         sort = "soccer/analysis",
    //         option = "sch_analysis";
    //     console.log(select_idx);
    //     _Fn.team_open(select_idx, sort, option);
    // }).on("click", "#menu_nav .line_up", function () {
    //     // 라인업 클릭 이벤트
    //     var $this = $(this);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //
    //     $("#teamStatistics").addClass("nonDisplay");
    //     $("#league_schedule").addClass("nonDisplay");
    //     $("#honor").addClass("nonDisplay");
    //     $("#teamProfile").addClass("nonDisplay");
    //     $("#leagueStatsFull").addClass("nonDisplay");
    //     $("#leagueStatsHalf").addClass("nonDisplay");
    //     $("#cupStatsHandi").addClass("nonDisplay");
    //     $("#cupStatsHalf_handi").addClass("nonDisplay");
    //     $("#cupStatsOu").addClass("nonDisplay");
    //     $("#cupStatsHalf_ou").addClass("nonDisplay");
    //     $("#achievements").addClass("nonDisplay");
    //     $("#schedule").addClass("nonDisplay");
    //     $("#lineup").removeClass("nonDisplay");
    //     $("#player").addClass("nonDisplay");
    //     $("#transfer").addClass("nonDisplay");
    //
    //     $("#league_nodata").addClass("nonDisplay");
    //     $("#cup_nodata").addClass("nonDisplay");
    //     $("#ach_nodata").addClass("nonDisplay");
    //     $("#sch_nodata").addClass("nonDisplay");
    //     $("#line_nodata").removeClass("nonDisplay");
    //     $("#player_nodata").addClass("nonDisplay");
    //     $("#trans_nodata").addClass("nonDisplay");
    //
    //     $("#team_select").removeClass("nonDisplay");
    //     $("#cup_league_select").addClass("nonDisplay");
    //     $("#trans").addClass("nonDisplay");
    // }).on("click", "#lineup .lineContent div div:nth-child(2) span", function () {
    //     // 라인업 선수명 클릭 이벤트
    //     var $this = $(this),
    //         player_idx = $this.parent().parent().attr("class"),
    //         sort = "soccer/player",
    //         option = "player",
    //         team_idx = $("#teamTitle > div.team_img > div:nth-child(2)").data("team_idx");
    //
    //     console.log(player_idx);
    //     console.log(team_idx);
    //     //_Fn.team_open(player_idx, sort, option);
    //     _Soccer_ajax.soccer_player(team_idx, player_idx, sort, option);
    // }).on("click", "#menu_nav .player", function () {
    //     // 플레이어 클릭 이벤트
    //     var $this = $(this),
    //         str = "",
    //         player_data = _team_total_json.player_data,
    //         data = player_data,
    //         data_length = Object.keys(data).length,
    //         key = [];
    //
    //     for (var t = 0; t < data_length; t++) {
    //         console.log(Object.keys(data)[t]);
    //         key.push(Object.keys(data)[t]);
    //     }
    //     console.log(key);
    //     console.log(data_length);
    //     $("#cup_league_select").children().remove();
    //     for (var e = 0; e < data_length; e++) {
    //         str += '<option value="' + key[e] + '">' + key[e] + "</option>";
    //     }
    //     $("#cup_league_select").append(str);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //
    //     $("#teamStatistics").addClass("nonDisplay");
    //     $("#league_schedule").addClass("nonDisplay");
    //     $("#honor").addClass("nonDisplay");
    //     $("#teamProfile").addClass("nonDisplay");
    //     $("#leagueStatsFull").addClass("nonDisplay");
    //     $("#leagueStatsHalf").addClass("nonDisplay");
    //     $("#cupStatsHandi").addClass("nonDisplay");
    //     $("#cupStatsHalf_handi").addClass("nonDisplay");
    //     $("#cupStatsOu").addClass("nonDisplay");
    //     $("#cupStatsHalf_ou").addClass("nonDisplay");
    //     $("#achievements").addClass("nonDisplay");
    //     $("#schedule").addClass("nonDisplay");
    //     $("#lineup").addClass("nonDisplay");
    //     $("#player").removeClass("nonDisplay");
    //     $("#transfer").addClass("nonDisplay");
    //
    //     $("#league_nodata").addClass("nonDisplay");
    //     $("#cup_nodata").addClass("nonDisplay");
    //     $("#ach_nodata").addClass("nonDisplay");
    //     $("#sch_nodata").addClass("nonDisplay");
    //     $("#line_nodata").addClass("nonDisplay");
    //     $("#player_nodata").removeClass("nonDisplay");
    //     $("#trans_nodata").addClass("nonDisplay");
    //
    //     $("#team_select").addClass("nonDisplay");
    //     $("#cup_league_select").removeClass("nonDisplay");
    //     $("#trans").addClass("nonDisplay");
    // }).on("click", "#player .playerContent div div:nth-child(2) span", function () {
    //     // 플레이어 선수명 클릭 이벤트
    //     var $this = $(this),
    //         player_idx = $this.parent().parent().attr("class"),
    //         sort = "soccer/player",
    //         option = "player",
    //         team_idx = $("#teamTitle > div.team_img > div:nth-child(2)").data("team_idx");
    //
    //     console.log(player_idx);
    //     console.log(team_idx);
    //     //_Fn.team_open(player_idx, sort, option);
    //     _Soccer_ajax.soccer_player(team_idx, player_idx, sort, option);
    // }).on("click", "#menu_nav .transfer", function () {
    //     // 이적 클릭 이벤트
    //     var $this = $(this);
    //
    //     $this.addClass("selected");
    //     $this.siblings().removeClass("selected");
    //
    //     $("#teamStatistics").addClass("nonDisplay");
    //     $("#league_schedule").addClass("nonDisplay");
    //     $("#honor").addClass("nonDisplay");
    //     $("#teamProfile").addClass("nonDisplay");
    //     $("#leagueStatsFull").addClass("nonDisplay");
    //     $("#leagueStatsHalf").addClass("nonDisplay");
    //     $("#cupStatsHandi").addClass("nonDisplay");
    //     $("#cupStatsHalf_handi").addClass("nonDisplay");
    //     $("#cupStatsOu").addClass("nonDisplay");
    //     $("#cupStatsHalf_ou").addClass("nonDisplay");
    //     $("#achievements").addClass("nonDisplay");
    //     $("#schedule").addClass("nonDisplay");
    //     $("#lineup").addClass("nonDisplay");
    //     $("#player").addClass("nonDisplay");
    //     $("#transfer").removeClass("nonDisplay");
    //
    //     $("#league_nodata").addClass("nonDisplay");
    //     $("#cup_nodata").addClass("nonDisplay");
    //     $("#ach_nodata").addClass("nonDisplay");
    //     $("#sch_nodata").addClass("nonDisplay");
    //     $("#line_nodata").addClass("nonDisplay");
    //     $("#player_nodata").addClass("nonDisplay");
    //     $("#trans_nodata").removeClass("nonDisplay");
    //
    //     $("#team_select").addClass("nonDisplay");
    //     $("#cup_league_select").addClass("nonDisplay");
    //     if ($("#trans").children().length < 1) {
    //         $("#trans").addClass("nonDisplay");
    //     } else {
    //         $("#trans").removeClass("nonDisplay");
    //     }
    // }).on("click", "#transfer .join .transContent div div:nth-child(2) span", function () {
    //     // 이적 선수명 클릭 이벤트(영입)
    //     var $this = $(this),
    //         team_idx1 = $("#teamTitle > div.team_img > div:nth-child(2)").data("team_idx"),
    //         team_idx = String(team_idx1),
    //         player_idx = $this.parent().attr("class"),
    //         sort = "soccer/player",
    //         option = "player";
    //
    //     console.log(player_idx);
    //     console.log(team_idx);
    //     _Soccer_ajax.soccer_player(team_idx, player_idx, sort, option);
    // }).on("click", "#transfer .out .transContent div div:nth-child(2) span", function () {
    //     var $this = $(this),
    //         team_idx = $this.parent().siblings("div:nth-child(4)").attr("class"),
    //         player_idx = $this.parent().attr("class"),
    //         sort = "soccer/player",
    //         option = "player";
    //
    //     console.log(player_idx);
    //     console.log(team_idx);
    //     _Soccer_ajax.soccer_player(team_idx, player_idx, sort, option);
    // }).on("click", "#transfer div .transContent div div:nth-child(4) span", function () {
    //     // 이적페이지 팀명 클릭 이벤트
    //     var $this = $(this),
    //         team_idx = $this.parent().attr("class"),
    //         sort = "soccer/team",
    //         option = "click_team";
    //
    //     console.log(team_idx);
    //     _Fn.team_open(team_idx, sort, option);
    // }).on("change", "#trans", function () {
    //     // 이적 시즌 select 선택 이벤트
    //     var $this = $(this),
    //         season = $this.val(),
    //         idx = $("#teamTitle .team_img div:nth-child(2)").data("team_idx");
    //     console.log(season);
    //     console.log(idx);
    //     transfer_num = 1;
    //     $this.find("option:selected").attr("selected", true);
    //     $this.find("option:selected").siblings().attr("selected", false);
    //     _Soccer_ajax.soccer_transfer(idx, season, transfer_num);
    //     transfer_num = 0;
    // });

    /*****************************************************************************************/
    /************************** 축구 team info player 페이지 이벤트 ***************************/
    /*****************************************************************************************/

    // $("#player_info").on("click", ".transfer_record .recordContent div div:nth-child(4)", function () {
    //     //player 페이지 Transfer Record from team 클릭 이벤트
    //     var $this = $(this),
    //         select_idx = $this.attr("class"),
    //         sort = "soccer/team",
    //         option = "player_form_team";
    //
    //     _Fn.team_open(select_idx, sort, option);
    // }).on("click", ".transfer_record .recordContent div div:nth-child(5)", function () {
    //     //player 페이지 Transfer Record to team 클릭 이벤트
    //     var $this = $(this),
    //         select_idx = $this.attr("class"),
    //         sort = "soccer/team",
    //         option = "player_to_team";
    //
    //     _Fn.team_open(select_idx, sort, option);
    // }).on("click", ".statistics_two .sta_twoContent div div:nth-child(3)", function () {
    //     //player 페이지 Statistics for recent two years home team 클릭 이벤트
    //     var $this = $(this),
    //         select_idx = $this.attr("class"),
    //         sort = "soccer/team",
    //         option = "player_home_team";
    //
    //     _Fn.team_open(select_idx, sort, option);
    // }).on("click", ".statistics_two .sta_twoContent div div:nth-child(5)", function () {
    //     //player 페이지 Statistics for recent two years away team 클릭 이벤트
    //     var $this = $(this),
    //         select_idx = $this.attr("class"),
    //         sort = "soccer/team",
    //         option = "player_away_team";
    //
    //     _Fn.team_open(select_idx, sort, option);
    // });
    //
    // $("#a_side").on("click", ".lineup_nav div div:nth-child(2) div div:nth-child(2)", function () {
    //     //player 페이지 a_side 선수 클릭 이벤트
    //     var $this = $(this),
    //         team_idx = "",
    //         player_idx = $this.attr("class"),
    //         sort = "soccer/player",
    //         option = "aside_player";
    //
    //     console.log(player_idx);
    //     console.log(team_idx);
    //     _Soccer_ajax.soccer_player(team_idx, player_idx, sort, option);
    // });
    // /*****************************************************************************************/
    // /****************************** 축구 리그순위표 페이지 이벤트 *******************************/
    // /*****************************************************************************************/
    //
    // $("#database header .league_nav").on("click", "div", function () {
    //     // 리그 최상단 메뉴 클릭 이벤트
    //     var $this = $(this),
    //         select_index = $this.index(),
    //         techStats = _league_main_json.data.techStats,
    //         teamProfiles = _league_main_json.data.teamProfiles,
    //         firstGoalLose = _league_main_json.data.firstGoalLose,
    //         noGoalLose = _league_main_json.data.noGoalLose;
    //
    //     console.log(techStats);
    //     console.log(teamProfiles);
    //     console.log(firstGoalLose);
    //     console.log(noGoalLose);
    //     console.log(select_index);
    //     $this.addClass("redback");
    //     $this.siblings().removeClass("redback");
    //
    //     if (select_index == 0) {
    //         var add_name = "";
    //         $("#league_schedule").removeClass("nonDisplay");
    //         $("#techStats").addClass("nonDisplay");
    //         $("#teamProfiles").addClass("nonDisplay");
    //         $("#firstGaollose").addClass("nonDisplay");
    //         $("#noGaollose").addClass("nonDisplay");
    //         $("#league_season").removeClass("nonDisplay");
    //         $("#league_team").removeClass("nonDisplay");
    //         $("#database header .league_title div:nth-child(1) span:nth-child(2)").text(_season_league_name + add_name);
    //     } else if (select_index == 1) {
    //         var add_name = " Techology Statistic";
    //         $("#league_schedule").addClass("nonDisplay");
    //         $("#techStats").removeClass("nonDisplay");
    //         $("#teamProfiles").addClass("nonDisplay");
    //         $("#firstGaollose").addClass("nonDisplay");
    //         $("#noGaollose").addClass("nonDisplay");
    //         $("#league_season").removeClass("nonDisplay");
    //         $("#league_team").addClass("nonDisplay");
    //         $("#database header .league_title div:nth-child(1) span:nth-child(2)").text(_season_league_name + add_name);
    //     } else if (select_index == 2) {
    //     } else if (select_index == 3) {
    //         var add_name = " Team Information";
    //         $("#league_schedule").addClass("nonDisplay");
    //         $("#techStats").addClass("nonDisplay");
    //         $("#teamProfiles").removeClass("nonDisplay");
    //         $("#firstGaollose").addClass("nonDisplay");
    //         $("#noGaollose").addClass("nonDisplay");
    //         $("#league_season").addClass("nonDisplay");
    //         $("#league_team").addClass("nonDisplay");
    //         $("#database header .league_title div:nth-child(1) span:nth-child(2)").text(_season_league_name + add_name);
    //     } else if (select_index == 4) {
    //         var add_name = " First Goal/Lost Stat.";
    //         $("#league_schedule").addClass("nonDisplay");
    //         $("#techStats").addClass("nonDisplay");
    //         $("#teamProfiles").addClass("nonDisplay");
    //         $("#firstGaollose").removeClass("nonDisplay");
    //         $("#noGaollose").addClass("nonDisplay");
    //         $("#league_season").removeClass("nonDisplay");
    //         $("#league_team").addClass("nonDisplay");
    //         $("#database header .league_title div:nth-child(1) span:nth-child(2)").text(_season_league_name + add_name);
    //     } else if (select_index == 5) {
    //         var add_name = " No Goal/Loss";
    //         $("#league_schedule").addClass("nonDisplay");
    //         $("#techStats").addClass("nonDisplay");
    //         $("#teamProfiles").addClass("nonDisplay");
    //         $("#firstGaollose").addClass("nonDisplay");
    //         $("#noGaollose").removeClass("nonDisplay");
    //         $("#league_season").removeClass("nonDisplay");
    //         $("#league_team").addClass("nonDisplay");
    //         $("#database header .league_title div:nth-child(1) span:nth-child(2)").text(_season_league_name + add_name);
    //     } else if (select_index == 6) {
    //     }
    // });
    //
    // $("#database").on("click", "#league_schedule .league_round div:nth-child(2) div", function () {
    //     // 리그 round 선택 이벤트
    //     var $this = $(this),
    //         round_num = $this.text();
    //     console.log(round_num);
    //     $this.addClass("roundcolor");
    //     $this.siblings().removeClass("roundcolor");
    //
    //     $("#league_schedule .league_schedule .scheduleContent").children().remove();
    //     _Soccer.soccer_league_main_round_click_event_html(_league_main_json, round_num);
    // }).on("change", "#league_season", function () {
    //     // 리그 시즌 select 변경 이벤트
    //     var $this = $(this),
    //         select_season = $this.val(),
    //         idx = $("#db_aside div .search_nav div .third_nav ul .red").data("league_idx"),
    //         division = $("#db_aside div .search_nav div .third_nav ul .red").data("league_division");
    //
    //     console.log(select_season);
    //     console.log(idx);
    //     console.log(division);
    //     $("#league_schedule .league_round").find("div").remove();
    //     $("#league_schedule .league_schedule .scheduleContent").find("div").remove();
    //     $("#league_schedule .league_ranking .rankingContent").find("div").remove();
    //     $("#league_schedule .league_info .infoContent").find("div").remove();
    //     $("#league_season").find("option").remove();
    //     console.log($("#league_team").find("option").not("option[value=all]"));
    //     $("#league_team").find("option").not("option[value=all]").remove();
    //
    //     $("#techStats .techstatsConinater .techContent").children().remove();
    //     $("#teamSelect_1").find("option").not("option[value=all]").remove();
    //     $("#teamSelect_2").find("option").not("option[value=all]").remove();
    //     $("#teamProfiles div").children().remove();
    //     $("#firstGaollose div .fglContent").children().remove();
    //     $("#noGaollose div .nglContent").children().remove();
    //     _Soccer_ajax.soccer_league_main(select_season, idx, division);
    // }).on("click", "#league_schedule .league_ranking .ranking_nav div", function () {
    //     //리그 순위표 메뉴 클릭 이벤트
    //     var $this = $(this),
    //         select_text = $this.text(),
    //         select_val = $("#ranking_select").val();
    //     $this.addClass("redback");
    //     $this.siblings().removeClass("redback");
    //     switch (select_text) {
    //         case "Total":
    //             select_text = "total";
    //             break;
    //         case "Home":
    //             select_text = "home";
    //             break;
    //         case "Away":
    //             select_text = "away";
    //             break;
    //         case "HT Total":
    //             select_text = "ht_total";
    //             break;
    //         case "HT Home":
    //             select_text = "ht_home";
    //             break;
    //         case "HT Away":
    //             select_text = "ht_away";
    //             break;
    //         default:
    //             select_text = select_text;
    //     }
    //     var sche_data = _league_main_json.data.totalScore,
    //         data = sche_data[select_text];
    //
    //     console.log(data);
    //     console.log(select_val);
    //     $("#league_schedule .league_ranking .rankingContent").find("div").remove();
    //     if (select_text == "total") {
    //         $("#league_schedule .league_ranking .league_color_info").removeClass("nonDisplay");
    //     } else {
    //         $("#league_schedule .league_ranking .league_color_info").addClass("nonDisplay");
    //     }
    //     if (select_val == 0) {
    //         _Soccer.soccer_league_main_ranking_menu_click_event_html(data, select_text);
    //     } else {
    //         swal("json 파일 데이터가 작업중이라 작업후 변경해야됨");
    //     }
    // }).on("change", "#ranking_select", function () {
    //     // 리그 순위표 라운드 select 변경 이벤트
    //     var $this = $(this),
    //         select_val = $this.val(),
    //         round_data = _league_main_json.data.roundScore.total,
    //         data = round_data[select_val];
    //     console.log(round_data);
    //     console.log(data);
    //
    //     $this.find("option:selected").attr("selected", true);
    //     $this.find("option:selected").siblings().attr("selected", false);
    //     $("#league_schedule .league_ranking .ranking_nav div:nth-child(1)").addClass("redback");
    //     $("#league_schedule .league_ranking .ranking_nav div:nth-child(1)").siblings().removeClass("redback");
    //
    //     if (select_val == 0) {
    //         var sche_data = _league_main_json.data.totalScore,
    //             select_text = "total",
    //             data = sche_data[select_text];
    //
    //         console.log(data);
    //         $("#league_schedule .league_ranking .rankingContent").find("div").remove();
    //         if (select_val == 0) {
    //             $("#league_schedule .league_ranking .league_color_info").removeClass("nonDisplay");
    //         } else {
    //             $("#league_schedule .league_ranking .league_color_info").addClass("nonDisplay");
    //         }
    //         _Soccer.soccer_league_main_ranking_menu_click_event_html(data, select_text);
    //     } else {
    //         $("#league_schedule .league_ranking .rankingContent").find("div").remove();
    //         if (select_val == 0) {
    //             $("#league_schedule .league_ranking .league_color_info").removeClass("nonDisplay");
    //         } else {
    //             $("#league_schedule .league_ranking .league_color_info").addClass("nonDisplay");
    //         }
    //         _Soccer.soccer_league_main_ranking_select_change_event_html(data, select_val);
    //     }
    // }).on("click", "#plus_btn", function () {
    //     // tech stats 더보기 글릭 이벤트
    //     var select_index = $("#techStats .navContainer .tech_nav").children(".blueback").index(),
    //         content_length = $("#techStats .techstatsConinater .techContent").children().not("#plus_btn").length,
    //         num = "",
    //         num2 = "",
    //         select_data = "";
    //
    //     console.log(select_index);
    //     console.log(content_length);
    //     if (select_index == 0) {
    //         select_data = _league_main_json.data.techStats.total;
    //     } else if (select_index == 1) {
    //         select_data = _league_main_json.data.techStats.home;
    //     } else if (select_index == 2) {
    //         select_data = _league_main_json.data.techStats.away;
    //     }
    //     num = content_length;
    //     num2 = content_length + 25;
    //     if (content_length + 25 > select_data.length) {
    //         num2 = content_length + (select_data.length - content_length);
    //         $("#plus_btn").addClass("nonDisplay");
    //     }
    //     _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, select_data);
    // }).on("click", "#techStats .navContainer .tech_nav div", function () {
    //     // tech_stats nav 클릭 이벤트
    //     var $this = $(this),
    //         select_index = $this.index(),
    //         select_data = "",
    //         num = 0,
    //         num2 = 25,
    //         selected_val = $("#typeSelect").find("option:selected").val();
    //
    //     $this.addClass("blueback");
    //     $this.siblings().removeClass("blueback");
    //     console.log(select_index);
    //     console.log(selected_val);
    //     console.log(_league_main_json2);
    //     $("#techStats .techstatsConinater .techContent").children().not("#plus_btn").remove();
    //     $("#plus_btn").removeClass("nonDisplay");
    //     if (selected_val == 0) {
    //         console.log(_league_main_json2);
    //         if (select_index == 0) {
    //             select_data = _league_main_json2.data.techStats.total;
    //         } else if (select_index == 1) {
    //             select_data = _league_main_json2.data.techStats.home;
    //         } else if (select_index == 2) {
    //             select_data = _league_main_json2.data.techStats.away;
    //         }
    //         for (var i = 0; i < select_data.length; i++) {
    //             select_data.sort(function (a, b) {
    //                 return a.data.notPenaltyGoals + a.data.penaltyGoals > b.data.notPenaltyGoals + b.data.penaltyGoals
    //                     ? -1
    //                     : a.data.notPenaltyGoals + a.data.penaltyGoals < b.data.notPenaltyGoals + b.data.penaltyGoals
    //                         ? 1
    //                         : 0;
    //             });
    //         }
    //         console.log(_league_main_json);
    //         console.log(select_data);
    //         _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, select_data);
    //         select_data = "";
    //     } else if (selected_val == 1) {
    //         if (select_index == 0) {
    //             _pass_json = _league_main_json.data.techStats.total;
    //         } else if (select_index == 1) {
    //             _pass_json = _league_main_json.data.techStats.home;
    //         } else if (select_index == 2) {
    //             _pass_json = _league_main_json.data.techStats.away;
    //         }
    //         for (var i = 0; i < _pass_json.length; i++) {
    //             _pass_json.sort(function (a, b) {
    //                 return a.data.pass > b.data.pass ? -1 : a.data.pass < b.data.pass ? 1 : 0;
    //             });
    //         }
    //         _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, _pass_json);
    //         _pass_json = "";
    //     } else if (selected_val == 2) {
    //         if (select_index == 0) {
    //             _defen_json = _league_main_json.data.techStats.total;
    //         } else if (select_index == 1) {
    //             _defen_json = _league_main_json.data.techStats.home;
    //         } else if (select_index == 2) {
    //             _defen_json = _league_main_json.data.techStats.away;
    //         }
    //         for (var i = 0; i < _defen_json.length; i++) {
    //             _defen_json.sort(function (a, b) {
    //                 return a.data.tackle > b.data.tackle ? -1 : a.data.tackle < b.data.tackle ? 1 : 0;
    //             });
    //         }
    //         _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, _defen_json);
    //         _defen_json = "";
    //     } else if (selected_val == 3) {
    //         if (select_index == 0) {
    //             select_data = _league_main_json.data.techStats.total;
    //         } else if (select_index == 1) {
    //             select_data = _league_main_json.data.techStats.home;
    //         } else if (select_index == 2) {
    //             select_data = _league_main_json.data.techStats.away;
    //         }
    //         for (var i = 0; i < select_data.length; i++) {
    //             select_data.sort(function (a, b) {
    //                 return a.data.tackle > b.data.tackle ? -1 : a.data.tackle < b.data.tackle ? 1 : 0;
    //             });
    //         }
    //         _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, select_data);
    //         select_data = "";
    //     }
    //     //_Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, select_data);
    // }).on("change", "#typeSelect", function () {
    //     // tech stats typeselect 변경 이벤트
    //     var $this = $(this),
    //         selected_val = $this.find("option:selected").val(),
    //         num = 0,
    //         num2 = 25,
    //         nav_index = $("#techStats .navContainer .tech_nav").children(".blueback").index(),
    //         _pass_json = null,
    //         _defen_json = null,
    //         _summary_json = null,
    //         title_class_adr = $("#techStats .techstatsConinater .subTitle").attr("class");
    //
    //     console.log(title_class_adr);
    //     if (title_class_adr == "subTitle nonDisplay") {
    //         $("#techStats .techstatsConinater .subTitle").removeClass("nonDisplay");
    //         $("#techStats .techstatsConinater .techContent").removeClass("nonDisplay");
    //         $("#techStats .techstatsConinater .serchTitle").addClass("nonDisplay");
    //         $("#techStats .techstatsConinater .serchContent").addClass("nonDisplay");
    //     }
    //     $this.find("option:selected").attr("selected", true);
    //     $this.find("option:selected").siblings().attr("selected", false);
    //     console.log(selected_val);
    //     $("#techStats .techstatsConinater .techContent").children().not("#plus_btn").remove();
    //     if (selected_val == 0) {
    //         var offen_json = _league_main_json.data.techStats.total;
    //         if (nav_index == 0) {
    //             offen_json = _league_main_json.data.techStats.total;
    //         } else if (nav_index == 1) {
    //             offen_json = _league_main_json.data.techStats.home;
    //         } else if (nav_index == 2) {
    //             offen_json = _league_main_json.data.techStats.away;
    //         }
    //         for (var i = 0; i < offen_json.length; i++) {
    //             offen_json.sort(function (a, b) {
    //                 return a.data.notPenaltyGoals + a.data.penaltyGoals > b.data.notPenaltyGoals + b.data.penaltyGoals
    //                     ? -1
    //                     : a.data.notPenaltyGoals + a.data.penaltyGoals < b.data.notPenaltyGoals + b.data.penaltyGoals
    //                         ? 1
    //                         : 0;
    //             });
    //         }
    //         if (offen_json.length < 25) {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").addClass("nonDisplay");
    //         } else {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").removeClass("nonDisplay");
    //         }
    //         _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, offen_json);
    //         offen_json = "";
    //     } else if (selected_val == 1) {
    //         if (nav_index == 0) {
    //             _pass_json = _league_main_json.data.techStats.total;
    //         } else if (nav_index == 1) {
    //             _pass_json = _league_main_json.data.techStats.home;
    //         } else if (nav_index == 2) {
    //             _pass_json = _league_main_json.data.techStats.away;
    //         }
    //         for (var i = 0; i < _pass_json.length; i++) {
    //             _pass_json.sort(function (a, b) {
    //                 return a.data.pass > b.data.pass ? -1 : a.data.pass < b.data.pass ? 1 : 0;
    //             });
    //         }
    //         console.log(_pass_json);
    //         if (_pass_json.length < 25) {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").addClass("nonDisplay");
    //         } else {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").removeClass("nonDisplay");
    //         }
    //         _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, _pass_json);
    //         _pass_json = "";
    //     } else if (selected_val == 2) {
    //         if (nav_index == 0) {
    //             _defen_json = _league_main_json.data.techStats.total;
    //         } else if (nav_index == 1) {
    //             _defen_json = _league_main_json.data.techStats.home;
    //         } else if (nav_index == 2) {
    //             _defen_json = _league_main_json.data.techStats.away;
    //         }
    //         for (var i = 0; i < _defen_json.length; i++) {
    //             _defen_json.sort(function (a, b) {
    //                 return a.data.tackle > b.data.tackle ? -1 : a.data.tackle < b.data.tackle ? 1 : 0;
    //             });
    //         }
    //         console.log(_defen_json);
    //         if (_defen_json.length < 25) {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").addClass("nonDisplay");
    //         } else {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").removeClass("nonDisplay");
    //         }
    //         _Soccer.soccer_league_main_techstats_add_btn_click_html(num, num2, _defen_json);
    //         _defen_json = "";
    //     } else if (selected_val == 3) {
    //         if (nav_index == 0) {
    //             _summary_json = _league_main_json.data.techStats.total;
    //         } else if (nav_index == 1) {
    //             _summary_json = _league_main_json.data.techStats.home;
    //         } else if (nav_index == 2) {
    //             _summary_json = _league_main_json.data.techStats.away;
    //         }
    //         for (var i = 0; i < _summary_json.length; i++) {
    //             /* _summary_json.sort(function (a, b) {
    //             return (a.data.pass > b.data.pass) ? -1 : (a.data.pass < b.data.pass) ? 1 : 0;
    //         }) */
    //         }
    //         console.log(_summary_json);
    //         if (_summary_json.length < 25) {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").addClass("nonDisplay");
    //         } else {
    //             $("#techStats .techstatsConinater .techContent #plus_btn").removeClass("nonDisplay");
    //         }
    //     }
    // }).on("change", "#teamSelect_1", function () {
    //     // tech stats 선수 선택 이벤트
    //     var $this = $(this),
    //         html = "",
    //         player_json = _league_main_json.data.techStats.player,
    //         selected_team = $this.find("option:selected").val(),
    //         data = player_json[selected_team];
    //
    //     console.log(selected_team);
    //     $this.find("option:selected").attr("selected", true);
    //     $this.find("option:selected").siblings().attr("selected", false);
    //     if (selected_team == "all") {
    //         $DOCUMENT.find("#playerSelect_1").children().not('option[value="none"]').remove();
    //     } else {
    //         $DOCUMENT.find("#playerSelect_1").children().not('option[value="none"]').remove();
    //         for (var i = 0; i < player_json[selected_team].length; i++) {
    //             html += '<option value="' + data[i].player_idx + '">' + data[i].name + "</option>";
    //         }
    //         $DOCUMENT.find("#playerSelect_1").append(html);
    //     }
    // }).on("change", "#teamSelect_2", function () {
    //     // tech stats 선수 선택 이벤트
    //     var $this = $(this),
    //         html = "",
    //         player_json = _league_main_json.data.techStats.player,
    //         selected_team = $this.find("option:selected").val(),
    //         data = player_json[selected_team];
    //
    //     console.log(selected_team);
    //     $this.find("option:selected").attr("selected", true);
    //     $this.find("option:selected").siblings().attr("selected", false);
    //     if (selected_team == "all") {
    //         $DOCUMENT.find("#playerSelect_2").children().not('option[value="none"]').remove();
    //     } else {
    //         $DOCUMENT.find("#playerSelect_2").children().not('option[value="none"]').remove();
    //         for (var i = 0; i < player_json[selected_team].length; i++) {
    //             html += '<option value="' + data[i].player_idx + '">' + data[i].name + "</option>";
    //         }
    //         $DOCUMENT.find("#playerSelect_2").append(html);
    //     }
    // }).on("click", "#compareBth", function () {
    //     // tech stats 선수비교 버큰 클릭 이벤트
    //     var first_team = $("#teamSelect_1").val(),
    //         second_team = $("#teamSelect_2").val(),
    //         first_player = $("#playerSelect_1").val(),
    //         second_player = $("#playerSelect_2").val(),
    //         json_data = _league_main_json.data.techStats.total;
    //
    //     $("#techStats .techstatsConinater .subTitle").addClass("nonDisplay");
    //     $("#techStats .techstatsConinater .techContent").addClass("nonDisplay");
    //     $("#techStats .techstatsConinater .serchTitle").removeClass("nonDisplay");
    //     $("#techStats .techstatsConinater .serchContent").removeClass("nonDisplay");
    //
    //     if (first_team != "all" && first_player != "none" && second_team != "all" && second_player != "none") {
    //         var first_json = $.grep(json_data, function (n, i) {
    //             return n.data.PlayerID == first_player;
    //         });
    //         var second_json = $.grep(json_data, function (n, i) {
    //             return n.data.PlayerID == second_player;
    //         });
    //         var json_arr = [first_json[0], second_json[0]];
    //
    //         for (var i = 0; i < json_arr.length; i++) {
    //             var title_adr;
    //             if (i == 0) {
    //                 title_adr = $("#techStats .techstatsConinater .serchTitle div:nth-child(1)");
    //             } else {
    //                 title_adr = $("#techStats .techstatsConinater .serchTitle div:nth-child(3)");
    //             }
    //             var team = json_arr[i].info.team_name,
    //                 team_idx = json_arr[i].info.team_idx,
    //                 player_name = json_arr[i].info.name,
    //                 player_idx = json_arr[i].data.PlayerID;
    //             title_adr.find("p span:nth-child(1)").text("(" + team + ")");
    //             title_adr.find("p span:nth-child(2)").text(player_name);
    //             console.log(team_idx);
    //             console.log(player_idx);
    //             console.log(title_adr.find("p span:nth-child(1)"));
    //             console.log(title_adr.find("p span:nth-child(2)"));
    //             title_adr.find("p span:nth-child(1)").attr("class", team_idx);
    //             title_adr.find("p span:nth-child(2)").attr("class", player_idx);
    //
    //             var play;
    //             if (json_arr[i].data.BackSum == 0) {
    //                 play = json_arr[i].data.SchSum;
    //             } else {
    //                 play = json_arr[i].data.SchSum + "(" + json_arr[i].data.BackSum + ")";
    //             }
    //
    //             var mins = json_arr[i].data.PlayingTime;
    //
    //             var goal;
    //             if (json_arr[i].data.penaltyGoals == 0) {
    //                 goal = json_arr[i].data.notPenaltyGoals;
    //             } else {
    //                 goal = json_arr[i].data.notPenaltyGoals + json_arr[i].data.penaltyGoals + "(" + json_arr[i].data.penaltyGoals + ")";
    //             }
    //
    //             var min_g,
    //                 min_goal = mins / json_arr[i].data.notPenaltyGoals,
    //                 min_goal_type = min_goal % 1;
    //             if (isNaN(min_goal_type) == true) {
    //                 min_goal = 0;
    //             }
    //             if (min_goal_type == 0 || min_goal == 0) {
    //                 min_g = min_goal;
    //             } else {
    //                 min_g = min_goal.toFixed(1);
    //             }
    //
    //             var shots = json_arr[i].data.shots,
    //                 shot_ot = json_arr[i].data.shotsTarget;
    //
    //             var goal_per,
    //                 goal_c = ((json_arr[i].data.notPenaltyGoals / json_arr[i].data.shots) * 100).toFixed(1),
    //                 goal_per = goal_c + "%";
    //
    //             var foul = json_arr[i].data.wasFouled,
    //                 offside = json_arr[i].data.offside,
    //                 best = json_arr[i].data.bestSum,
    //                 rate = json_arr[i].data.rating,
    //                 pass = json_arr[i].data.pass;
    //
    //             var pass_per,
    //                 pass_data = (json_arr[i].data.passSuc / json_arr[i].data.pass) * 100;
    //             pass_per = pass_data.toFixed(1) + "%";
    //
    //             var key_pass = json_arr[i].data.keyPass,
    //                 assists = json_arr[i].data.assist;
    //
    //             var min_assist,
    //                 assist_data = mins / assists,
    //                 assist_type = assist_data % 1;
    //             if (isNaN(assist_type) == true) {
    //                 assist_data = 0;
    //             }
    //             if (assist_type == 0 || assist_data == 0) {
    //                 min_assist = assist_data;
    //             } else {
    //                 min_assist = assist_data.toFixed(1);
    //             }
    //
    //             var long_pass = json_arr[i].data.longBalls,
    //                 through = json_arr[i].data.throughBall,
    //                 break_loose = json_arr[i].data.dribblesSuc,
    //                 tackles = json_arr[i].data.tackle,
    //                 intercept = json_arr[i].data.interception,
    //                 clear = json_arr[i].data.clearance,
    //                 steal = json_arr[i].data.dispossessed,
    //                 block = json_arr[i].data.shotsBlocked,
    //                 head = json_arr[i].data.aerialSuc,
    //                 fouls = json_arr[i].data.foul,
    //                 card = json_arr[i].data.red + "/" + json_arr[i].data.yellow;
    //
    //             var data_arr = [play, mins, goal, min_g, shots, shot_ot, goal_per, foul, offside, best, rate, pass, pass_per, key_pass, assists, min_assist, long_pass, through, break_loose, tackles, intercept, clear, steal, block, head, fouls, card];
    //
    //             for (var s = 0; s < 27; s++) {
    //                 var adr;
    //                 if (i == 0) {
    //                     adr = $("#techStats .techstatsConinater .serchContent div:nth-child(" + (s + 1) + ") div:nth-child(1)");
    //                 } else {
    //                     adr = $("#techStats .techstatsConinater .serchContent div:nth-child(" + (s + 1) + ") div:nth-child(3)");
    //                 }
    //                 adr.find("p").text(data_arr[s]);
    //             }
    //         }
    //     } else {
    //         swal("선수를 선택해 주세요.");
    //     }
    // });
    //
    // $("#db_aside").on("click", "div .search_nav > div .first_nav", function () {
    //     // 메뉴바 대륙별 클릭 이벤트
    //     var $this = $(this),
    //         non_second = $this.siblings(".second_nav.nonDisplay");
    //
    //     if (non_second.length == 0) {
    //         $this.siblings("div").addClass("nonDisplay");
    //     } else {
    //         $("#db_aside div .search_nav > div div:not(.first_nav)").addClass("nonDisplay");
    //         $this.siblings(".second_nav").removeClass("nonDisplay");
    //     }
    // }).on("click", "div .search_nav > div .second_nav", function () {
    //     // 메뉴바 나라별 클릭 이벤트
    //     var $this = $(this),
    //         select_class = $this.attr("class"),
    //         name = select_class.substring(11),
    //         non_third = $this.siblings(".third_nav." + name + ".nonDisplay");
    //
    //     if (non_third.length == 0) {
    //         $this.siblings(".third_nav." + name + "").addClass("nonDisplay");
    //     } else {
    //         $this.siblings(".third_nav." + name + "").removeClass("nonDisplay");
    //     }
    // }).on("click", "div .search_nav > div .third_nav ul li", function () {
    //     // 메뉴바 리그명 클릭 이벤트
    //     var $this = $(this),
    //         season = $("#league_season").find("option:selected").val(),
    //         idx = $this.data("league_idx"),
    //         division = $this.data("league_division");
    //
    //     console.log(season);
    //     console.log(idx);
    //     console.log(division);
    //
    //     $this.siblings().removeClass("red");
    //     console.log($this.parents(".third_nav").parent("div").siblings().find(".third_nav ul li"));
    //     $this.parents(".third_nav").parent("div").siblings().find(".third_nav ul li").removeClass("red");
    //     $this.parents(".third_nav").parent("div").find(".third_nav ul li").removeClass("red");
    //     $this.addClass("red");
    //
    //     $("#league_schedule .league_round").children().remove();
    //     $("#league_schedule .league_schedule .scheduleContent").children().remove();
    //     $("#league_schedule .league_ranking .rankingContent").children().remove();
    //     $("#league_schedule .league_info .infoContent").children().remove();
    //
    //     _Soccer_ajax.soccer_league_main(season, idx, division);
    // });
})();
