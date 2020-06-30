<?php
$now = \CodeIgniter\I18n\Time::now();
echo 'Main2';
?>
<article>
    <h1 style="display: none">축구경기 리스트</h1>
    <header id="listTitle">
        <div></div>
        <div>경기</div>
        <div>시간</div>
        <div>상태</div>
        <div>홈팀</div>
        <div>스코어</div>
        <div>원정팀</div>
        <div>전반</div>
        <div>데이터</div>
    </header>

    <!-- today game -->
    <?php if (isset($today) && !empty($today)) {
    $yoil = array("일", "월", "화", "수", "목", "금", "토"); ?>
            <section id="todayGame">
                <div>
                    <?php echo date('Y-m-d');
    echo '<span style="font-weight: bold"> (' . ($yoil[date('w', strtotime(date('Y-m-d')))]) . '요일)</span>'; ?>
                </div>
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
                                    $gap = $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                                }
                                break;
                            case 2:
                                $gap = '<b>HT</b>';
                                break;
                            case 3:
                                $game_start_time = $time;
                                $diff = $time2->difference($now);
                                $min_gap = $diff->getMinutes();

                                if (45 + $min_gap > 90) {
                                    $gap = '90+';
                                } else {
                                    $gap = 45 + $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                                    ;
                                }
                                break;
                            case -1:
                                $gap = '<b>FT</b>';
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
                        <div data-idx="<?php echo $to['idx']; ?>">
                            <button>+</button>
                            <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                                <div style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                                    <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                                    </span>
                                </div>
                            <?php } ?>
                            <div>
                                <?php echo(date('H:i', strtotime($to['game_start_time']))); ?>
                            </div>
                            <div>
                                <?php echo $gap; ?>
                            </div>
                            <div>
                                <?php if ($to['home_current_rank'] !== '') { ?>
                                    <span id="horder_<?php echo $to['idx']; ?>">
                                        <font color="#880000">[<?php echo $to['home_current_rank']; ?>]</font>
                                    </span>
                                <?php } ?>
                                <?php if ($to['home_yellow_card'] !== 0) { ?>
                                    <span class="badge badge-warning"><?php echo $to['home_yellow_card']; ?></span>
                                <?php } ?>
                                <?php if ($to['home_red_card'] !== 0) { ?>
                                    <span class="badge badge-danger"><?php echo $to['home_red_card']; ?></span>
                                <?php } ?>
                                <a href="javascript:void(0);" class="teamName" onclick="_Fx.team_open(<?php echo $to['home_idx']; ?>)"><?php echo $to['home_name']; ?></a>
                            </div>
                            <div>
                                <?php if ($to['game_progress'] == 0 || $to['game_progress'] == -11 || $to['game_progress'] == -14) {
                            echo '-';
                        } else {
                            if ($to['game_progress'] !== -1) {
                                echo '<span class="blue">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            } else {
                                echo '<span class="red">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                            }
                        } ?>
                            </div>
                            <div>
                                <a href="javascript:void(0);" class="teamName" onclick="_Fx.team_open(<?php echo $to['away_idx']; ?>)"><?php echo $to['away_name']; ?></a>
                                
                                <?php if ($to['away_red_card'] !== 0) { ?>
                                    <span class="badge badge-danger"><?php echo $to['away_red_card']; ?></span>
                                <?php } ?>
                                <?php if ($to['away_yellow_card'] !== 0) { ?>
                                    <span class="badge badge-warning"><?php echo $to['away_yellow_card']; ?></span>
                                <?php } ?>
                                <?php if ($to['away_current_rank'] !== '') { ?>
                                <span id="gorder_<?php echo $to['idx']; ?>">
                                    <font color="#880000">[<?php echo $to['away_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                            </div>
                            <!-- <div>
                                -
                            </div> -->
                            <div style="cursor: pointer;">
                                <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                            </div>
                            <div>
                                <div style="display: block; width: 100px; padding-left: 5px;" align="left">
                                    <a href="/analysis/view/<?php echo $to['idx']; ?>" target="_blank"><img
                                            src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>
                                    <a href="/oddscomp/view/<?php echo $to['idx']; ?>" target="_blank"><img
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
                            </div>
                        </div>
                        <?php if ($to['append_content']) { ?>
                            <div data-idx="other <?php echo $to['idx'];?>">
                                <div style="color: green"><?php echo $to['append_content']; ?></div>
                            </div>
                            <!-- <div>
                            </div> -->
                        <?php } ?>
                        <?php
                    } //end foreach
                } ?>
            </section>
        <?php
} ?>


    <!-- today game -->

    <!-- tomorrow game -->
    <?php if (isset($tomorrow) && !empty($tomorrow)) {
                    $yoil = array("일", "월", "화", "수", "목", "금", "토"); ?>
        <section id="tomorrowGame">
            <div>
                <?php echo date('Y-m-d', strtotime("+1 days"));
                    echo '<span style="font-weight: bold"> (' . ($yoil[date('w', strtotime(date('Y-m-d')))+1]) . '요일)</span>'; ?>
            </div>
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
                                $gap = $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                            }
                            break;
                        case 2:
                            $gap = '<b>HT</b>';
                            break;
                        case 3:
                            $game_start_time = $time;
                            $diff = $time2->difference($now);
                            $min_gap = $diff->getMinutes();

                            if (45 + $min_gap > 90) {
                                $gap = '90+';
                            } else {
                                $gap = 45 + $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                                ;
                            }
                            break;
                        case -1:
                            $gap = '<b>FT</b>';
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
                    <div data-idx="<?php echo $to['idx']; ?>">
                        <button>+</button>
                        <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                            <div style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                                <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                                </span>
                            </div>
                        <?php } ?>
                        <div>
                            <?php echo(date('H:i', strtotime($to['game_start_time']))); ?>
                        </div>
                        <div>
                            <?php echo $gap; ?>
                        </div>
                        <div>
                            <?php if ($to['home_current_rank'] !== '') { ?>
                                <span id="horder_<?php echo $to['idx']; ?>">
                                    <font color="#880000">[<?php echo $to['home_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                            <?php if ($to['home_yellow_card'] !== 0) { ?>
                                <span class="badge badge-warning"><?php echo $to['home_yellow_card']; ?></span>
                            <?php } ?>
                            <?php if ($to['home_red_card'] !== 0) { ?>
                                <span class="badge badge-danger"><?php echo $to['home_red_card']; ?></span>
                            <?php } ?>
                            
                            <a href="javascript:void(0);" class="teamName" onclick="_Fx.team_open(<?php echo $to['home_idx']; ?>)"><?php echo $to['home_name']; ?></a>
                        </div>
                        <div>
                            <?php if ($to['game_progress'] == 0 || $to['game_progress'] == -11 || $to['game_progress'] == -14) {
                        echo '-';
                    } else {
                        if ($to['game_progress'] !== -1) {
                            echo '<span class="blue">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                        } else {
                            echo '<span class="red">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                        }
                    } ?>
                        </div>
                        <div>
                            <a href="javascript:void(0);" class="teamName" onclick="_Fx.team_open(<?php echo $to['away_idx']; ?>)"><?php echo $to['away_name']; ?></a>
                            
                            <?php if ($to['away_red_card'] !== 0) { ?>
                                <span class="badge badge-danger"><?php echo $to['away_red_card']; ?></span>
                            <?php } ?>
                            <?php if ($to['away_yellow_card'] !== 0) { ?>
                                <span class="badge badge-warning"><?php echo $to['away_yellow_card']; ?></span>
                            <?php } ?>
                            <?php if ($to['away_current_rank'] !== '') { ?>
                                <span id="gorder_<?php echo $to['idx']; ?>">
                                    <font color="#880000">[<?php echo $to['away_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                        </div>
                        <!-- <div>
                            -
                        </div> -->
                        <div style="cursor: pointer;">
                            <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div>
                            <div style="display: block; width: 100px; padding-left: 5px;" align="left">
                                <a href="/analysis/view/<?php echo $to['idx']; ?>" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>
                                <a href="/oddscomp/view/<?php echo $to['idx']; ?>" target="_blank"><img
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
                        </div>
                    </div>
                    <?php if ($to['append_content']) { ?>
                        <div data-idx="other <?php echo $to['idx'];?>">
                            <div style="color: green"><?php echo $to['append_content']; ?></div>
                        </div>
                        <!-- <div>
                        </div> -->
                    <?php } ?>
                    <?php
                } //end foreach
            } ?>
        </section>
    <?php
                } ?>

    
    <!-- tomorrow game -->

    <!-- result game -->
    <?php if (isset($result) && !empty($result)) { ?>
        <section id="todayResult">
            <div>
                <span style="font-weight: bold">결과</span>
            </div>
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
                                $gap = $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                            }
                            break;
                        case 2:
                            $gap = '<b>HT</b>';
                            break;
                        case 3:
                            $game_start_time = $time;
                            $diff = $time2->difference($now);
                            $min_gap = $diff->getMinutes();

                            if (45 + $min_gap > 90) {
                                $gap = '90+';
                            } else {
                                $gap = 45 + $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                            }
                            break;
                        case -1:
                            $gap = '<b>FT</b>';
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
                    <div data-idx="<?php echo $to['idx']; ?>">
                        <button>+</button>
                        <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                            <div style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                                <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                                </span>
                            </div>
                        <?php } ?>
                        <div>
                            <?php echo(date('H:i', strtotime($to['game_start_time']))); ?>
                        </div>
                        <div>
                            <?php echo $gap; ?>
                        </div>
                        <div>
                            <?php if ($to['home_current_rank'] !== '') { ?>
                                <span id="horder_<?php echo $to['idx']; ?>">
                                    <font color="#880000">[<?php echo $to['home_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                            <?php if ($to['home_yellow_card'] !== 0) { ?>
                                <span class="badge badge-warning"><?php echo $to['home_yellow_card']; ?></span>
                            <?php } ?>
                            <?php if ($to['home_red_card'] !== 0) { ?>
                                <span class="badge badge-danger"><?php echo $to['home_red_card']; ?></span>
                            <?php } ?>
                            
                            <a href="javascript:void(0);" class="teamName" onclick="_Fx.team_open(<?php echo $to['home_idx']; ?>)"><?php echo $to['home_name']; ?></a>
                        </div>
                        <div>
                            <?php if ($to['game_progress'] == 0 || $to['game_progress'] == -11 || $to['game_progress'] == -14) {
                        echo '-';
                    } else {
                        if ($to['game_progress'] !== -1) {
                            echo '<span class="blue">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                        } else {
                            echo '<span class="red">' . $to['home_goal'] . '-' . $to['away_goal'] . '</span>';
                        }
                    } ?>
                        </div>
                        <div>
                            <a href="javascript:void(0);" class="teamName" onclick="_Fx.team_open(<?php echo $to['away_idx']; ?>)"><?php echo $to['away_name']; ?></a>
                            
                            <?php if ($to['away_red_card'] !== 0) { ?>
                                <span class="badge badge-danger"><?php echo $to['away_red_card']; ?></span>
                            <?php } ?>
                            <?php if ($to['away_yellow_card'] !== 0) { ?>
                                <span class="badge badge-warning"><?php echo $to['away_yellow_card']; ?></span>
                            <?php } ?>
                            <?php if ($to['away_current_rank'] !== '') { ?>
                                <span id="gorder_<?php echo $to['idx']; ?>">
                                    <font color="#880000">[<?php echo $to['away_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                        </div>
                        <!-- <div>
                            -
                        </div> -->
                        <div style="cursor: pointer;">
                        <!-- <div onmouseover="layershow(event,<?php echo $to['idx']; ?>,this)" onmouseout="layerhide(event)" style="cursor: pointer;"> -->
                            <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div>
                            <div style="display: block; width: 100px; padding-left: 5px;" align="left">
                                <a href="/analysis/view/<?php echo $to['idx']; ?>" target="_blank"><img
                                        src="http://www.nowgoal.com/images/t2.gif" style="padding-right: 5px"></a>
                                <a href="/oddscomp/view/<?php echo $to['idx']; ?>" target="_blank"><img
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
                        </div>
                    </div>
                    <?php if ($to['append_content']) { ?>
                        <div data-idx="other <?php echo $to['idx'];?>">
                            <div colspan="9" style="color: green"><?php echo $to['append_content']; ?></div>
                        </div>
                        <!-- <div>
                        </div> -->
                    <?php } ?>
                    <?php
                } //end foreach
            }
            ?>
        </section>
    <?php } ?>

    
    <!-- result game -->

</article>
<div id="divView">
</div>

</body>
<script>
    /* $(function () {
        $.get('/home/test2', function (res) {
        })

        $.get('/home/getDataJson', function (data) {
            console.log(JSON.parse(data))
        })

        $.get('/home/detail', function (res) {
            var result = JSON.parse(res)
            console.log(result)
        });


    }) */


    /* function team(idx) {
        window.open("https://spoto.com/team/detail/" + idx, '_blank');
    } */

    function layershow(e, idx, _this) {
        var height = $(_this)[0].offsetTop;

        var divTop = height+20; //상단 좌표 위치 안맞을시 e.pageY
        var divLeft = '27%'; //좌측 좌표 위치 안맞을시 e.pageX
        var serial = $(this).attr("serial");
        console.log(idx);
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
