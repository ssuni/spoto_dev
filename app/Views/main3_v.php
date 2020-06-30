<div id="g_main">
    <div id="g_navi">
        <div>경기골라보기</div>
        <div>득점&승률2in1</div>
        <div>간이판</div>
        <div>플레이 있음</div>
        <div>내게임<span>()</span></div>
    </div>
    <div id="g_infoTitle">
        <div class="g_game">경기</div>
        <div class="g_time">시간</div>
        <div class="g_state">상태</div>
        <div class="g_home">홈팀</div>
        <div class="g_away">원정팀</div>
        <div class="g_a_game">경기</div>
        <div class="g_half">전반</div>
        <div class="g_data">데이터</div>
    </div>
</div>


<article>
    <h1 style="display: none">축구경기 리스트</h1>
        <haeder id="listTitle">
            <div></div>
            <div>경기</div>
            <div>시간</div>
            <div>상태</div>
            <div>홈팀</div>
            <div>원정팀</div>
            <div>경기</div>
            <div>전반</div>
            <div>데이터</div>
        </haeder>
        <?php
        if (isset($A)) {
            $now = \CodeIgniter\I18n\Time::now();
            $yesterday = \CodeIgniter\I18n\Time::yesterday(); ?>
            <?php if (count($A) > 0) { ?>
                <?php
                $arridx = array();
                $arridx_yester = array();
                $arrprog = array();
                $yoil = array("일", "월", "화", "수", "목", "금", "토");
                foreach ($A as $a) {
                    $dt = new DateTime($a['game_start_time']);
                    $sdt = new DateTime($a['second_start_time']);
                    $time = \CodeIgniter\I18n\Time::instance($dt);
                    $time2 = \CodeIgniter\I18n\Time::instance($sdt);
                    if ($now->getDay() == $time->getDay()) {
                        array_push($arridx, $a['idx']);
                    }
                    if ($now->getDay() + 1 == $time->getDay()) {
                        array_push($arridx_yester, $a['idx']);
                    }
                    if ($a['game_progress'] == -1) {
                        array_push($arrprog, $a['idx']);
                    } ?>
                    <?php if ($arridx) { ?>
                        <?php if ($arridx[0] == $a['idx']) { ?>
                            <div id="todayGame">
                                
                                <div>
                                    <?php echo date_format($time, 'Y-m-d');
                                    echo '<span style="font-weight: bold"> (' . ($yoil[date('w', strtotime($time))]) . '요일)</span>'; ?>
                                </div>
                            </div>
                        <?php } ?>
                    <?php } ?>
                    <?php if ($arridx_yester) { ?>
                        <?php if ($arridx_yester[0] == $a['idx']) { ?>
                            <div id="tomorrowGame">
                                <div>
                                    <?php echo date_format($time, 'Y-m-d');
                                    echo '<span style="font-weight: bold"> (' . ($yoil[date('w', strtotime($time))]) . '요일)</span>'; ?>
                                </div>
                            </div>
                        <?php } ?>
                    <?php } ?>
                    <?php if ($arrprog) { ?>
                        <?php if ($arrprog[0] == $a['idx']) { ?>
                            <div id="todayResult">
                                <div>
                                    <span style="font-weight: bold">결과</span>
                                </div>
                            </div>
                        <?php } ?>
                    <?php } ?>

                    <div data-idx="<?php echo $a['idx']; ?>" class="g_game">
                        <div class="g_addgame">+</div>
                        <?php if (isset($B)) { ?>
                            <?php if ($B) { ?>
                                <?php if ($a['league_idx'] == $B[$a['league_idx'] - 1]['league_idx']) { ?>
                                    <div style="background-color: <?php echo $B[$a['league_idx'] - 1]['color']; ?>"><span
                                                style="color:white"><?php echo $B[$a['league_idx'] - 1]['league_short']; ?></span>
                                    </div>
                                <?php } ?>
                            <?php } ?>
                        <?php } ?>
                        <div><?php echo date_format($time, "H:i"); ?></div>
                        <?php
                        switch ($a['game_progress']) {
                            case 1:
                                $game_start_time = $time;
                                $diff = $game_start_time->difference($now);
                                $min_gap = $diff->getMinutes();
                                if ($min_gap > 45) {
                                    $gap = '45+';
                                } else {
                                    $gap = $min_gap;
                                }
                                break;
                            case 2:
                                $gap = 'HT';
                                break;
                            case 3:
                                $game_start_time = $time;
                                $diff = $time2->difference($now);
                                $min_gap = $diff->getMinutes();

                                if (45 + $min_gap > 90) {
                                    $gap = '90+';
                                } else {
                                    $gap =  45 + $min_gap;
                                }
                                break;
                            case -1:
                                $gap = 'FT';
                                break;
                            case -11:
                                $gap = 'Pend.';
                                break;
                            case -13:
                                $gap = 'Pause.';
                                break;
                            case -14:
                                $gap = 'Postp.';
                                break;
                            default:
                                $gap = "";
                                break;
                        } ?>
                        <div><?php echo $gap; ?></div>
                        <div>
                            <?php if ($a['home_yellow_card'] !== 0) { ?>
                                <span class="badge badge-warning"><?php echo $a['home_yellow_card']; ?></span>
                            <?php } ?>
                            <?php if ($a['home_red_card'] !== 0) { ?>
                                <span class="badge badge-danger"><?php echo $a['home_red_card']; ?></span>
                            <?php } ?>

                            <a href="javascript:void(0);" class="teamName"
                               onclick="team(<?php echo $a['home_idx']; ?>)"><?php echo $a['home_name']; ?></a>
                        </div>
                        <div>
                            <?php if ($a['game_progress'] == 0 || $a['game_progress'] == -11 || $a['game_progress'] == -14) {
                            echo '-';
                        } else {
                            if ($a['game_progress'] !== -1) {
                                echo '<span class="blue">' . $a['home_goal'] . '-' . $a['away_goal'] . '</span>';
                            } else {
                                echo '<span class="red">' . $a['home_goal'] . '-' . $a['away_goal'] . '</span>';
                            }
                        } ?>
                        </div>

                        <div>
                            <a href="javascript:void(0);" class="teamName"
                               onclick="team(<?php echo $a['away_idx']; ?>)"><?php echo $a['away_name']; ?></a>
                            <?php if ($a['away_red_card'] !== 0) { ?>
                                <span class="badge badge-danger"><?php echo $a['away_red_card']; ?></span>
                            <?php } ?>
                            <?php if ($a['away_yellow_card'] !== 0) { ?>
                                <span class="badge badge-warning"><?php echo $a['away_yellow_card']; ?></span>
                            <?php } ?>
                        </div>
                        <!-- <div>-</div> -->
                        <div><?php echo '<span style="color: red">'.$a['home_1stHalf_goal'] . '-' . $a['away_1stHalf_goal'].'</span>' ?></div>
                        <div>
                            <div style="display: block; width: 100px; padding-left: 5px;" align="left">
                                <a href="/analysis/view/'+v.idx+'" target="_blank"><img
                                            src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>
                                <a href="/oddscomp/view/'+v.idx+'" target="_blank"><img
                                            src="http://www.nowgoal.com/images/t1.gif" style="padding-right: 5px"></a>
                                <a href="#"><img src="http://www.nowgoal.com/images/t4.gif" style="padding-right: 5px;"></a>
                                <?php if ($a['odds_3in1'] == 'True') { ?>
                                    <?php if ($a['game_progress'] == 1 || $a['game_progress'] == 2 || $a['game_progress'] == 3) { ?>
                                        <a href="#"><img src="http://www.nowgoal.com/images/t32.png"></a>
                                    <?php } else { ?>
                                        <a href="#"><img src="http://www.nowgoal.com/images/t3.png"></a>
                                    <?php } ?>
                                <?php } ?>
                                <?php if ($a['odds_live'] == 'True') { ?>
                                    <?php if ($a['game_progress'] !== 1 && $a['game_progress'] !== 2 && $a['game_progress'] !== 3) { ?>
                                        <a href="#" style="padding-right: 5px;"><img
                                                    src="http://www.nowgoal.com/images/oc.gif"></a>
                                    <?php } ?>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                    <?php if ($a['append_content']) { ?>
                        <div data-idx="other <?php echo $a['idx'];?>" bgcolor="#FFFFE8">
                            <div style="color: green"><?php echo $a['append_content']; ?></div>
                        </div>
                        <!-- <div>
                        </div> -->
                    <?php } ?>
                <?php
                } ?>
            <?php } ?>
        <?php
        } ?>
    </div>

    </article>
<div id="divView" style="width: 450px;">
</div>

</body>
<script>
    $(function () {
        // $.get('/home/test', function (res) {
        //     var result = JSON.parse(res)
        //     // console.log(result)
        //
        //     var html = ""
        //     html += '<tr bgcolor="#dadada"><td colspan="9">' + moment(result['A'][0]['game_start_time']).format('YYYY-MM-DD dddd') + '</td></tr>';
        //     var arridx = [];
        //     var arrtime = [];
        //     var arrprog = [];
        //     $.each(result['A'], function (i, v) {
        //
        //         if (moment(v.game_start_time).format('YYYY-MM-DD') > moment(result['A'][0]['game_start_time']).format('YYYY-MM-DD')) {
        //             arridx.push(v.idx);
        //             arrtime.push(v.game_start_time);
        //         }
        //
        //         html += '<tr id="tr_' + v.idx + '">';
        //         html += '<td class="' + v.league_idx + '">';
        //         html += '</td>';
        //         html += '<td>' + moment(v.game_start_time).format('HH:mm') + '</td>';
        //
        //         if (v.game_progress == 1) {
        //             var now = new Date();
        //             var oldtime = new Date(v.game_start_time)
        //             var gap = now.getTime() - oldtime.getTime();
        //             var min_gap = gap / 1000 / 60;
        //             html += '<td>' + Math.floor(min_gap) + '</td>';
        //         } else if (v.game_progress == 2) {
        //             html += '<td>HT</td>';
        //         } else if (v.game_progress == 3) {
        //             var now = new Date();
        //             var oldtime = new Date(v.second_start_time)
        //             var gap = now.getTime() - oldtime.getTime();
        //             var min_gap = gap / 1000 / 60;
        //             if (Math.floor(45 + min_gap) > 90) {
        //                 html += '<td>90+</td>';
        //             } else {
        //                 html += '<td>' + Math.floor(min_gap) + '</td>';
        //             }
        //
        //         } else if (v.game_progress == -1) {
        //             arrprog.push(v.idx);
        //             html += '<td>FT</td>';
        //         } else if (v.game_progress == -14) {
        //             arrprog.push(v.idx);
        //             html += '<td>Postp.</td>';
        //         } else if (v.game_progress == -11) {
        //             arrprog.push(v.idx);
        //             html += '<td>Pend.</td>';
        //         } else {
        //             html += '<td></td>';
        //         }
        //         html += '<td>'
        //         if (v.home_yellow_card !== 0) {
        //             html += '<span class="badge badge-warning">' + v.home_yellow_card + '</span>';
        //         }
        //         if (v.home_red_card !== 0) {
        //             html += '<span class="badge badge-danger">' + v.home_red_card + '</span>';
        //         }
        //         html += '<a href="javascript:void(0);" onclick="team(\'' + v.home_idx + '\')">' + v.home_name + '</a>';
        //         html += '</td>';
        //         if (v.game_progress == 0 || v.game_progress == -11 || v.game_progress == -14) {
        //             html += '<td>-</td>';
        //         } else {
        //             html += '<td onmouseover="layershow(event,' + v.idx + ',this)" onmouseout="layerhide(event)" style="cursor: pointer;">' + v.home_goal + '-' + v.away_goal + '</td>';
        //         }
        //         html += '<td><a href="javacript:void(0);" onclick="team(\'' + v.away_idx + '\')">' + v.away_name + '</a>';
        //         if (v.away_red_card !== 0) {
        //             html += '<span class="badge badge-danger">' + v.away_red_card + '</span>';
        //         }
        //         if (v.away_yellow_card !== 0) {
        //             html += '<span class="badge badge-warning">' + v.away_yellow_card + '</span>';
        //         }
        //
        //         html += '</td>';
        //         html += '<td></td>';
        //
        //         if (v.game_progress !== 1 && v.game_progress !== 0) {
        //             html += '<td>' + v.home_1stHalf_goal + '-' + v.away_1stHalf_goal + '</td>';
        //         } else {
        //             html += '<td></td>';
        //         }
        //
        //         html += '<td>'
        //         html += '<div style="display: block; width: 100px; padding-left: 5px;" align="left">'
        //
        //         html += '<a href="/analysis/view/' + v.idx + '" target="_blank"><img src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>'
        //         html += '<a href="/oddscomp/view/' + v.idx + '" target="_blank"><img src="http://www.nowgoal.com/images/t1.gif" style="padding-right: 5px"></a>'
        //         html += '<a href="#"><img src="http://www.nowgoal.com/images/t4.gif" style="padding-right: 5px;"></a>'
        //         if (v.odds_3in1 == 'True') {
        //             if (v.game_progress == 1 || v.game_progress == 2 || v.game_progress == 3) {
        //                 html += '<a href="#"><img src="http://www.nowgoal.com/images/t32.png"></a>'
        //             } else {
        //                 html += '<a href="#"><img src="http://www.nowgoal.com/images/t3.png"></a>'
        //             }
        //
        //         }
        //         if (v.odds_live == 'True') {
        //             if (v.game_progress !== 1 && v.game_progress !== 2 && v.game_progress !== 3) {
        //                 html += '<a href="#" style="padding-right: 5px;"><img src="http://www.nowgoal.com/images/oc.gif"></a>'
        //             }
        //         }
        //
        //         html += '</div>';
        //         html += '</td>';
        //         html += '</tr>'
        //
        //         if (v.append_content) {
        //             html += '<tr bgcolor="#FFFFE8"><td colspan="9" style="color: green">' + v.append_content + '</td></tr>';
        //         }
        //     })
        //
        //     // $("#list").append(html)
        //     $.each(result['B'], function (i, v) {
        //         $("." + v.league_idx).html('<span style="color:white">' + v.league_short + '</span>')
        //         $("." + v.league_idx).css('background-color', v.color)
        //     })
        //
        //     // $("#tr_" + arridx[0]).before('<tr bgcolor="#dadada"><td colspan="9">' + moment(arrtime[0]).format('YYYY-MM-DD dddd') + '</td></tr>');
        //     // $("#tr_" + arrprog[0]).before('<tr bgcolor="yellow"><td colspan="9">결과 </td></tr>>');
        // })
        $.get('/home/test', function (res) {})

        $.get('/home/getDataJson', function (data) {
            console.log(JSON.parse(data))
        })

        $.get('/home/detail', function (res) {
            var result = JSON.parse(res)
            console.log(result)
        });


    })


    function team(idx) {
        window.open("https://spoto.com/team/detail/" + idx, '_blank');
    }

    function layershow(e, idx, _this) {
        var height = $(_this)[0].offsetTop;

        var divTop = height + 140; //상단 좌표 위치 안맞을시 e.pageY
        var divLeft = '27%'; //좌측 좌표 위치 안맞을시 e.pageX
        var serial = $(this).attr("serial");

        $.get('/home/detail', {'idx': idx}, function (res) {
            var result = JSON.parse(res);
            console.log(result)
            $('#divView').empty().append(
                '<div style="width: 100%;" border="1">' +
                '<div><div colspan="3">HandiCap</div></div>' +

                '<div><div colspan="3">Match stats</div></div>' +
                '<div>' +
                '<div width="30%">' + result['tc'][10] + '</div>' +
                '<div width="40%">Shots</div>' +
                '<div width="30%">' + result['tc'][11] + '</div>' +
                '</div>' +
                '<div>' +
                '<div width="30%">' + result['tc'][13] + '</div>' +
                '<div width="40%">Shots on Goal</div>' +
                '<div width="30%">' + result['tc'][14] + '</div>' +
                '</div>' +
                '<div>' +
                '<div width="30%">' + result['tc'][19] + '</div>' +
                '<div width="40%">Ball Possession</div>' +
                '<div width="30%">' + result['tc'][20] + '</div>' +
                '</div>' +
                '</div>'
            );
        })
        $('#divView').css({"top": divTop, "left": divLeft, "position": "absolute"}).show();
    }

    function layerhide(e) {
        $('#divView').css("display", "none");
    }
</script>
<script>
    $(function () {
        var socket = io.connect("wss://spoto.com:18981/", {
            transports: ["websocket"],
            forceNew: true

        });

        socket.on('toclient',function(data) {
            console.log(data.msg);
        });

        socket.on('connect', function (data) {
            console.log('front conn')
        });
        socket.emit('fromclient',{msg:'fromclient'});
        //

        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
        });

        socket.emit('test', { test: 'test' });
    })
</script>
</html>
