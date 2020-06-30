<?php
$now = \CodeIgniter\I18n\Time::now();
//$yesterday = \CodeIgniter\I18n\Time::yesterday();
//$tomorrow = \CodeIgniter\I18n\Time::tomorrow();
var_dump(date("Y/m/d H:i:s", strtotime('+9 hour')));

?>

<div class="wrap">

<!--    <div>-->
<!--        <div style="position: absolute; left:100px; top:100px; width: 200px; height: 250px;">-->
<!--            <img src="--><?php //echo base_url('/img/test.png');?><!--" width="100%">-->
<!--        </div>-->
<!--        <div>-->
<!--            <video autoplay="" loop="" muted="" style="width:100%;"><source src="--><?php //echo base_url('/img/test.mp4')?><!--" type="video/mp4"></video>-->
<!--        </div>-->
<!--    </div>-->


    <table border="1" id="list">
        <tr>
            <th>경기</th>
            <th>시간</th>
            <th>지위</th>
            <th>홈팀</th>
            <th width="50px">스코어</th>
            <th>원정팀</th>
            <th>경기</th>
            <th width="50px">전반</th>
            <th width="100px">데이터</th>
        </tr>

        <!-- today game -->
        <?php if (isset($today) && !empty($today)) {
            $yoil = array("일", "월", "화", "수", "목", "금", "토"); ?>
            <tr bgcolor="#dadada">
                <td colspan="9">
                    <?php echo date('Y-m-d');
                    echo '<span style="font-weight: bold"> (' . ($yoil[date('w', strtotime(date('Y-m-d')))]) . '요일)</span>'; ?>
                </td>
            </tr>
        <?php } ?>

        <?php
        if (isset($today)) {
            foreach ($today as $to) {
                $dt = new DateTime($to['game_start_time']);
                $sdt = new DateTime($to['second_start_time']);
                $time = \CodeIgniter\I18n\Time::instance($dt);
                $time2 = \CodeIgniter\I18n\Time::instance($sdt);
                switch ($to['game_progress']) {
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
                            $gap = 45 + $min_gap;
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
                    default :
                        $gap = "";
                        break;
                }
                ?>
                <tr>
                    <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                        <td style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                        <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                        </span>
                        </td>
                    <?php } ?>
                    <td>
                        <?php echo(date('H:i', strtotime($to['game_start_time']))); ?>
                    </td>
                    <td>
                        <?php echo $gap; ?>
                    </td>
                    <td>
                        <?php if ($to['home_yellow_card'] !== 0) { ?>
                            <span class="badge badge-warning"><?php echo $to['home_yellow_card']; ?></span>
                        <?php } ?>
                        <?php if ($to['home_red_card'] !== 0) { ?>
                            <span class="badge badge-danger"><?php echo $to['home_red_card']; ?></span>
                        <?php } ?>

                        <a href="javascript:void(0);" class="teamName"
                           onclick="team(<?php echo $to['home_idx']; ?>)"><?php echo $to['home_name']; ?></a>
                    </td>
                    <td>
                        <?php if ($to['game_progress'] == 0 || $to['game_progress'] == -11 || $to['game_progress'] == -14) {
                            echo '-';
                        } else {
                            if ($to['game_progress'] !== -1) {
                                echo '<span class="blue">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            } else {
                                echo '<span class="red">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            }
                        } ?>
                    </td>
                    <td>
                        <a href="javascript:void(0);" class="teamName"
                           onclick="team(<?php echo $to['away_idx']; ?>)"><?php echo $to['away_name']; ?></a>
                        <?php if ($to['away_red_card'] !== 0) { ?>
                            <span class="badge badge-danger"><?php echo $to['away_red_card']; ?></span>
                        <?php } ?>
                        <?php if ($to['away_yellow_card'] !== 0) { ?>
                            <span class="badge badge-warning"><?php echo $to['away_yellow_card']; ?></span>
                        <?php } ?>
                    </td>
                    <td>
                        -
                    </td>
                    <td>
                        <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                    </td>
                    <td>
                        <div style="display: block; width: 100px; padding-left: 5px;" align="left">
                            <a href="/livescore/soccer/analysis/<?php echo $to['idx']?>" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>
                            <a href="/oddscomp/view/'+v.idx+'" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t1.gif" style="padding-right: 5px"></a>
                            <a href="#"><img src="http://www.nowgoal.com/images/t4.gif" style="padding-right: 5px;"></a>
                            <?php if ($to['odds_3in1'] == 'True') { ?>
                                <?php if ($to['game_progress'] == 1 || $to['game_progress'] == 2 || $to['game_progress'] == 3) { ?>
                                    <a href="#"><img src="http://www.nowgoal.com/images/t32.png"></a>
                                <?php } else { ?>
                                    <a href="#"><img src="http://www.nowgoal.com/images/t3.png"></a>
                                <?php } ?>
                            <?php } ?>
                            <?php if ($to['odds_live'] == 'True') { ?>
                                <?php if ($to['game_progress'] !== 1 && $to['game_progress'] !== 2 && $to['game_progress'] !== 3) { ?>
                                    <a href="#" style="padding-right: 5px;"><img
                                                src="http://www.nowgoal.com/images/oc.gif"></a>
                                <?php } ?>
                            <?php } ?>
                        </div>
                    </td>
                </tr>
                <?php if ($to['append_content']) { ?>
                    <tr bgcolor="#FFFFE8">
                        <td colspan="9" style="color: green"><?php echo $to['append_content']; ?></td>
                    </tr>
                    <tr>
                    </tr>
                <?php } ?>
                <?php
            } //end foreach
        }
        ?>
        <!-- today game -->

        <!-- tomorrow game -->
        <?php if (isset($tomorrow) && !empty($tomorrow)) {
            $yoil = array("일", "월", "화", "수", "목", "금", "토");
            $timestamp = strtotime("+1 days");
            ?>
            <tr bgcolor="#dadada">
                <td colspan="9">
                    <?php echo date("Y-m-d", $timestamp);
                    echo '<span style="font-weight: bold"> (' . ($yoil[date('w', strtotime(date("Y-m-d", $timestamp)))]) . '요일)</span>'; ?>
                </td>
            </tr>
        <?php } ?>

        <?php
        if (isset($tomorrow)) {
            foreach ($tomorrow as $to) {
                $dt = new DateTime($to['game_start_time']);
                $sdt = new DateTime($to['second_start_time']);
                $time = \CodeIgniter\I18n\Time::instance($dt);
                $time2 = \CodeIgniter\I18n\Time::instance($sdt);
                switch ($to['game_progress']) {
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
                            $gap = 45 + $min_gap;
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
                    default :
                        $gap = "";
                        break;
                }
                ?>
                <tr>
                    <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                        <td style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                        <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                        </span>
                        </td>
                    <?php } ?>
                    <td>
                        <?php echo(date('H:i', strtotime($to['game_start_time']))); ?>
                    </td>
                    <td>
                        <?php echo $gap; ?>
                    </td>
                    <td>
                        <?php if ($to['home_yellow_card'] !== 0) { ?>
                            <span class="badge badge-warning"><?php echo $to['home_yellow_card']; ?></span>
                        <?php } ?>
                        <?php if ($to['home_red_card'] !== 0) { ?>
                            <span class="badge badge-danger"><?php echo $to['home_red_card']; ?></span>
                        <?php } ?>

                        <a href="javascript:void(0);" class="teamName"
                           onclick="team(<?php echo $to['home_idx']; ?>)"><?php echo $to['home_name']; ?></a>
                    </td>
                    <td>
                        <?php if ($to['game_progress'] == 0 || $to['game_progress'] == -11 || $to['game_progress'] == -14) {
                            echo '-';
                        } else {
                            if ($to['game_progress'] !== -1) {
                                echo '<span class="blue">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            } else {
                                echo '<span class="red">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            }
                        } ?>
                    </td>
                    <td>
                        <a href="javascript:void(0);" class="teamName"
                           onclick="team(<?php echo $to['away_idx']; ?>)"><?php echo $to['away_name']; ?></a>
                        <?php if ($to['away_red_card'] !== 0) { ?>
                            <span class="badge badge-danger"><?php echo $to['away_red_card']; ?></span>
                        <?php } ?>
                        <?php if ($to['away_yellow_card'] !== 0) { ?>
                            <span class="badge badge-warning"><?php echo $to['away_yellow_card']; ?></span>
                        <?php } ?>
                    </td>
                    <td>
                        -
                    </td>
                    <td>
                        <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                    </td>
                    <td>
                        <div style="display: block; width: 100px; padding-left: 5px;" align="left">
                            <a href="/livescore/soccer/analysis/<?php echo $to['idx']?>" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>
                            <a href="/oddscomp/view/'+v.idx+'" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t1.gif" style="padding-right: 5px"></a>
                            <a href="#"><img src="http://www.nowgoal.com/images/t4.gif" style="padding-right: 5px;"></a>
                            <?php if ($to['odds_3in1'] == 'True') { ?>
                                <?php if ($to['game_progress'] == 1 || $to['game_progress'] == 2 || $to['game_progress'] == 3) { ?>
                                    <a href="#"><img src="http://www.nowgoal.com/images/t32.png"></a>
                                <?php } else { ?>
                                    <a href="#"><img src="http://www.nowgoal.com/images/t3.png"></a>
                                <?php } ?>
                            <?php } ?>
                            <?php if ($to['odds_live'] == 'True') { ?>
                                <?php if ($to['game_progress'] !== 1 && $to['game_progress'] !== 2 && $to['game_progress'] !== 3) { ?>
                                    <a href="#" style="padding-right: 5px;"><img
                                                src="http://www.nowgoal.com/images/oc.gif"></a>
                                <?php } ?>
                            <?php } ?>
                        </div>
                    </td>
                </tr>
                <?php if ($to['append_content']) { ?>
                    <tr bgcolor="#FFFFE8">
                        <td colspan="9" style="color: green"><?php echo $to['append_content']; ?></td>
                    </tr>
                    <tr>
                    </tr>
                <?php } ?>
                <?php
            } //end foreach
        }
        ?>
        <!-- tomorrow game -->

        <!-- result game -->
        <?php if (isset($result) && !empty($result)) { ?>
            <tr bgcolor="#FFFFE8">
                <td colspan="9">
                    <span style="font-weight: bold">결과</span>
                </td>
            </tr>
        <?php } ?>

        <?php
        if (isset($result)) {
            foreach ($result as $to) {
                $dt = new DateTime($to['game_start_time']);
                $sdt = new DateTime($to['second_start_time']);
                $time = \CodeIgniter\I18n\Time::instance($dt);
                $time2 = \CodeIgniter\I18n\Time::instance($sdt);
                switch ($to['game_progress']) {
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
                            $gap = 45 + $min_gap;
                        }
                        break;
                    case 5:
                        $gap = 'Pen';
                        break;
                    case -1:
                        $gap = 'FT';
                        break;
                    case -11:
                        $gap = 'Pend.';
                        break;
                    case -12:
                        $gap = 'Abd.';
                        break;
                    case -13:
                        $gap = 'Pause.';
                        break;
                    case -14:
                        $gap = 'Postp.';
                        break;
                    default :
                        $gap = "";
                        break;
                }
                ?>
                <tr>
                    <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                        <td style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                        <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                        </span>
                        </td>
                    <?php } ?>
                    <td>
                        <?php echo(date('H:i', strtotime($to['game_start_time']))); ?>
                    </td>
                    <td>
                        <?php echo $gap; ?>
                    </td>
                    <td>
                        <?php if ($to['home_yellow_card'] !== 0) { ?>
                            <span class="badge badge-warning"><?php echo $to['home_yellow_card']; ?></span>
                        <?php } ?>
                        <?php if ($to['home_red_card'] !== 0) { ?>
                            <span class="badge badge-danger"><?php echo $to['home_red_card']; ?></span>
                        <?php } ?>

                        <a href="javascript:void(0);" class="teamName"
                           onclick="team(<?php echo $to['home_idx']; ?>)"><?php echo $to['home_name']; ?></a>
                    </td>
                    <td>
                        <?php if ($to['game_progress'] == 0 || $to['game_progress'] == -11 || $to['game_progress'] == -14) {
                            echo '-';
                        } else {
                            if ($to['game_progress'] !== -1) {
                                echo '<span class="blue">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            } else {
                                echo '<span class="red">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            }
                        } ?>
                    </td>
                    <td>
                        <a href="javascript:void(0);" class="teamName"
                           onclick="team(<?php echo $to['away_idx']; ?>)"><?php echo $to['away_name']; ?></a>
                        <?php if ($to['away_red_card'] !== 0) { ?>
                            <span class="badge badge-danger"><?php echo $to['away_red_card']; ?></span>
                        <?php } ?>
                        <?php if ($to['away_yellow_card'] !== 0) { ?>
                            <span class="badge badge-warning"><?php echo $to['away_yellow_card']; ?></span>
                        <?php } ?>
                    </td>
                    <td>
                        -
                    </td>
                    <td>
                        <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                    </td>
                    <td>
                        <div style="display: block; width: 100px; padding-left: 5px;" align="left">
                            <a href="/livescore/soccer/analysis/<?php echo $to['idx']?>" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>
                            <a href="/oddscomp/view/'+v.idx+'" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t1.gif" style="padding-right: 5px"></a>
                            <a href="#"><img src="http://www.nowgoal.com/images/t4.gif" style="padding-right: 5px;"></a>
                            <?php if ($to['odds_3in1'] == 'True') { ?>
                                <?php if ($to['game_progress'] == 1 || $to['game_progress'] == 2 || $to['game_progress'] == 3) { ?>
                                    <a href="#"><img src="http://www.nowgoal.com/images/t32.png"></a>
                                <?php } else { ?>
                                    <a href="#"><img src="http://www.nowgoal.com/images/t3.png"></a>
                                <?php } ?>
                            <?php } ?>
                            <?php if ($to['odds_live'] == 'True') { ?>
                                <?php if ($to['game_progress'] !== 1 && $to['game_progress'] !== 2 && $to['game_progress'] !== 3) { ?>
                                    <a href="#" style="padding-right: 5px;"><img
                                                src="http://www.nowgoal.com/images/oc.gif"></a>
                                <?php } ?>
                            <?php } ?>
                        </div>
                    </td>
                </tr>
                <?php if ($to['append_content']) { ?>
                    <tr bgcolor="#FFFFE8">
                        <td colspan="9" style="color: green"><?php echo $to['append_content']; ?></td>
                    </tr>
                    <tr>
                    </tr>
                <?php } ?>
                <?php
            } //end foreach
        }
        ?>
        <!-- result game -->

    </table>

</div>
<div id="divView" style="width: 450px;">
</div>

</body>
<script
    src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
    crossorigin="anonymous"></script>
<script>
    $(function () {
        $.get('/livescore/soccer/getAnalysisJson/1721884', function (data) {
            console.log(data)
        })
        // $.get('/home/test2', function (res) {
        // })
        // $.get('/home/getDataJson', function (data) {
        //     console.log(JSON.parse(data))
        // })
        $.get('/livescore/soccer/getLeftSelectJson/15', function (data) {
            console.log(data)
        })

        $.get('/conversion/game_results_detail', function (data) {
            console.log('test')
            console.log(data)
        })


        $.get('/livescore/soccer/getStandingJson?idx=36', function (data) {
            console.log(data)
        })

        $.post('/livescore/soccer/getPlayerJson',{'player_idx':'140016' ,'team_idx':'27'}, function (data) {
            console.log(data)
        })
        // $.get('/home/detail', function (data) {
        //     console.log(JSON.parse(data))
        // })
        // $.get('/home/panlu', function (data) {
        //     console.log(JSON.parse(data))
        // })
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
                '<table style="width: 100%;" border="1">' +
                '<tr><th colspan="3">HandiCap</th></tr>' +

                '<tr><th colspan="3">Match stats</th></tr>' +
                '<tr>' +
                '<td width="30%">' + result['tc'][10] + '</td>' +
                '<td width="40%">Shots</td>' +
                '<td width="30%">' + result['tc'][11] + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td width="30%">' + result['tc'][13] + '</td>' +
                '<td width="40%">Shots on Goal</td>' +
                '<td width="30%">' + result['tc'][14] + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td width="30%">' + result['tc'][19] + '</td>' +
                '<td width="40%">Ball Possession</td>' +
                '<td width="30%">' + result['tc'][20] + '</td>' +
                '</tr>' +
                '</table>'
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

        socket.on('toclient', function (data) {
            console.log(data.msg);
        });

        socket.on('connect', function (data) {
            console.log('front conn')
        });
        socket.emit('fromclient', {msg: 'fromclient'});
        //

        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', {my: 'data'});
        });

        socket.emit('test', {test: 'test'});
    })
</script>
</html>
