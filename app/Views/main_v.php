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
    <?php if (isset($today) && !empty($today)) { ?>
        <section id="todayGame">
            <div>
                <?php
                echo nowdate;
                echo '<span style="font-weight: bold"> (' . (_yoil(date('Y-m-d'))) . '요일)</span>';
                ?>
            </div>
            <?php
            if (isset($today)) {
                foreach ($today as $to) {
                    $gap = _game_progress($to['game_start_time'], $to['second_start_time'], $to['game_progress']); ?>
                    <div data-idx="<?php echo $to['idx']; ?>">
                        <button>+</button>
                        <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                            <div style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                                    <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                                    </span>
                            </div>
                        <?php } ?>
                        <div><?php echo _timeFormat($to['game_start_time'], 'H:i'); ?></div>
                        <div><?php echo $gap; ?></div>
                        <div data-home_idx="<?php echo $to['home_idx']; ?>">
                            <?php if ($to['append_content'] || $to['youth_content']) { ?>
                                <span class="game_info"><img src="https://www.freeiconspng.com/uploads/alert-icon-red-11.png"
                                style="width:16px; height:16px; float:left;"></span>
                            <?php } ?>
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
                            <span class="teamName"><?php echo $to['home_name']; ?></span>
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
                        <div data-away_idx="<?php echo $to['away_idx']; ?>">
                            <span class="teamName"><?php echo $to['away_name']; ?></span>

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
                        <div style="cursor: pointer;">
                            <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div class="dataContainer">
                            <div style="width: 80px; padding-left: 5px; float:left;" align="left">
                                <button id="analysis" title="Match analyze"><img
                                            src="http://www.nowgoal.com/images/t2.gif"></button>
                                <button id="odds" title="odds"><img
                                            src="http://www.nowgoal.com/images/t1.gif"></button>
                                <button title="1x2 odds"><img src="http://www.nowgoal.com/images/t4.gif"></button>
                                <?php if ($to['odds_3in1'] == 'True') { ?>
                                    <?php if ($to['game_progress'] == 1 || $to['game_progress'] == 2 || $to['game_progress'] == 3) { ?>
                                        <button title="3in1 odds"><img src="http://www.nowgoal.com/images/t32.png"></button>
                                    <?php } else { ?>
                                        <button title="3in1 odds"><img src="http://www.nowgoal.com/images/t3.png"></button>
                                    <?php } ?>
                                <?php } ?>
                                <?php if ($to['odds_live'] == 'True') { ?>
                                    <?php if ($to['game_progress'] !== 1 && $to['game_progress'] !== 2 && $to['game_progress'] !== 3) { ?>
                                        <button id="oc"><img
                                                    src="http://www.nowgoal.com/images/oc.gif"></button>
                                    <?php } ?>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                    <!-- <?php if ($to['append_content']) { ?>
                        <div data-idx="other <?php echo $to['idx']; ?>">
                            <div style="color: green"><?php echo $to['append_content']; ?></div>
                        </div>
                    <?php } ?> -->
                    <?php
                } //end foreach
            } ?>
        </section>
        <?php
    } ?>
    <!-- today game -->

    <!-- tomorrow game -->
    <?php if (isset($tomorrow) && !empty($tomorrow)) { ?>
        <section id="tomorrowGame">
            <div>
                <?php echo date('Y-m-d', strtotime("+1 days"));
                echo '<span style="font-weight: bold"> (' . (_yoil(date('Y-m-d'), 1)) . '요일)</span>';
                ?>
            </div>
            <?php
            if (isset($tomorrow)) {
                foreach ($tomorrow as $to) {
                    $gap = _game_progress($to['game_start_time'], $to['second_start_time'], $to['game_progress']); ?>
                    <div data-idx="<?php echo $to['idx']; ?>">
                        <button>+</button>
                        <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                            <div style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                                <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                                </span>
                            </div>
                        <?php } ?>
                        <div><?php echo _timeFormat($to['game_start_time'], 'H:i'); ?></div>
                        <div><?php echo $gap; ?></div>
                        <div data-home_idx="<?php echo $to['home_idx']; ?>">
                            <?php if ($to['append_content'] || $to['youth_content']) { ?>
                                <span class="game_info"><img src="https://www.freeiconspng.com/uploads/alert-icon-red-11.png"
                                style="width:16px; height:16px; float:left;"></span>
                            <?php } ?>
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

                            <span class="teamName"><?php echo $to['home_name']; ?></span>
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
                        <div data-away_idx="<?php echo $to['away_idx']; ?>">
                            <span class="teamName"><?php echo $to['away_name']; ?></span>

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
                        <div style="cursor: pointer;">
                            <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div class="dataContainer">
                            <div style="display: block; width: 80px; padding-left: 5px;" align="left">
                                <button id="analysis" title="Match analyze"><img
                                            src="http://www.nowgoal.com/images/t2.gif"></button>
                                <button title="odds"><img
                                            src="http://www.nowgoal.com/images/t1.gif"></button>
                                <button title="1x2 odds"><img src="http://www.nowgoal.com/images/t4.gif"></button>
                                <?php if ($to['odds_3in1'] == 'True') { ?>
                                    <?php if ($to['game_progress'] == 1 || $to['game_progress'] == 2 || $to['game_progress'] == 3) { ?>
                                        <button title="3in1 odds"><img src="http://www.nowgoal.com/images/t32.png"></button>
                                    <?php } else { ?>
                                        <button title="3in1 odds"><img src="http://www.nowgoal.com/images/t3.png"></button>
                                    <?php } ?>
                                <?php } ?>
                                <?php if ($to['odds_live'] == 'True') { ?>
                                    <?php if ($to['game_progress'] !== 1 && $to['game_progress'] !== 2 && $to['game_progress'] !== 3) { ?>
                                        <button id="oc"><img
                                                    src="http://www.nowgoal.com/images/oc.gif"></button>
                                    <?php } ?>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                    <!-- <?php if ($to['append_content']) { ?>
                        <div data-idx="other <?php echo $to['idx']; ?>">
                            <div style="color: green"><?php echo $to['append_content']; ?></div>
                        </div>
                    <?php } elseif ($to['youth_content']) { ?>
                        <div data-idx="other <?php echo $to['idx'];?>">
                            <div style="color: green"><?php echo $to['youth_content']; ?></div>
                        </div>
                    <?php } ?> -->
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
                    $gap = _game_progress($to['game_start_time'], $to['second_start_time'], $to['game_progress']); ?>
                    <div data-idx="<?php echo $to['idx']; ?>">
                        <button>+</button>
                        <?php if ($to['league_idx'] == $B[$to['league_idx'] - 1]['league_idx']) { ?>
                            <div style="background-color: <?php echo $B[$to['league_idx'] - 1]['color']; ?>">
                                <span style="color:white"><?php echo $B[$to['league_idx'] - 1]['league_short']; ?>
                                </span>
                            </div>
                        <?php } ?>
                        <div><?php echo _timeFormat($to['game_start_time'], 'H:i'); ?></div>
                        <div><?php echo $gap; ?></div>
                        <div data-home_idx="<?php echo $to['home_idx']; ?>">
                            <?php if ($to['append_content'] || $to['youth_content']) { ?>
                                <span class="game_info"><img src="https://www.freeiconspng.com/uploads/alert-icon-red-11.png"
                                style="width:16px; height:16px; float:left;"></span>
                            <?php } ?>
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

                            <span class="teamName"><?php echo $to['home_name']; ?></span>
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
                        <div data-away_idx="<?php echo $to['away_idx']; ?>">
                            <span class="teamName"><?php echo $to['away_name']; ?></span>

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
                        <div style="cursor: pointer;">
                            <!-- <div onmouseover="layershow(event,<?php echo $to['idx']; ?>,this)" onmouseout="layerhide(event)" style="cursor: pointer;"> -->
                            <?php echo '<span style="color: red">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div class="dataContainer">
                            <div style="display: block; width: 80px; padding-left: 5px;" align="left">
                                <button id="analysis" title="Match analyze"><img
                                            src="http://www.nowgoal.com/images/t2.gif"></button>
                                <button title="odds"><img
                                            src="http://www.nowgoal.com/images/t1.gif"></button>
                                <button title="1x2 odds"><img src="http://www.nowgoal.com/images/t4.gif"></button>
                                <?php if ($to['odds_3in1'] == 'True') { ?>
                                    <?php if ($to['game_progress'] == 1 || $to['game_progress'] == 2 || $to['game_progress'] == 3) { ?>
                                        <button title="3in1 odds"><img src="http://www.nowgoal.com/images/t32.png"></button>
                                    <?php } else { ?>
                                        <button title="3in1 odds"><img src="http://www.nowgoal.com/images/t3.png"></button>
                                    <?php } ?>
                                <?php } ?>
                                <?php if ($to['odds_live'] == 'True') { ?>
                                    <?php if ($to['game_progress'] !== 1 && $to['game_progress'] !== 2 && $to['game_progress'] !== 3) { ?>
                                        <button id="oc"><img
                                                    src="http://www.nowgoal.com/images/oc.gif"></button>
                                    <?php } ?>
                                <?php } ?>
                            </div>
                        </div>
                    </div>
                    <!-- <?php if ($to['append_content']) { ?>
                        <div data-idx="other <?php echo $to['idx']; ?>">
                            <div colspan="9" style="color: green"><?php echo $to['append_content']; ?></div>
                        </div>
                    <?php } elseif ($to['youth_content']) { ?>
                        <div data-idx="other <?php echo $to['idx'];?>">
                            <div style="color: green"><?php echo $to['youth_content']; ?></div>
                        </div>
                    <?php } ?> -->
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
    }) */
</script>
</html>
