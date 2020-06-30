<article id="soccer_list">
    <div id="game_nav">
        <div><span></span><span>라이브</span><span class="tooltip"></span></div>
        <div class="game_select"><span></span><span>축구</span><span class="tooltip"></span></div>
        <div><span></span><span>야구</span><span class="tooltip"></span></div>
        <div><span></span><span>농구</span><span class="tooltip"></span></div>
        <div><span></span><span>배구</span><span class="tooltip"></span></div>
        <div><span></span><span>하키</span><span class="tooltip"></span></div>
        <div><span></span><span>미식축구</span><span class="tooltip"></span></div>
        <div><span></span><span>롤</span><span class="tooltip"></span></div>
        <div><span></span><span>스타</span><span class="tooltip"></span></div>
    </div>
    <div id="main_nav">
        <div class="first_nav">
            <div class="select_nav">
                <div class="calender">
                    <span>2020.03.01</span><span></span>
                </div>
                <div class="date_popup nonDisplay"></div>
                <div class="country">
                    <span>모든 나라</span><span></span>
                </div>
                <div class="country_popup nonDisplay"></div>
                <div class="league">
                    <span>모든 리그</span><span></span>
                </div>
                <div class="league_popup nonDisplay"></div>
            </div>
            <div class="radio_nav">
                <div>
                    <div class="all_game">
                        <input type="radio" value="all" id="all_check" checked="checked">
                        <label for="all_check">모든경기</label>
                    </div>
                    <div class="playing_game">
                        <input type="radio" value="playing" id="playing_check">
                        <label for="playing_check">경기중</label>
                    </div>
                    <div class="standby_game">
                        <input type="radio" value="standby" id="standby_check">
                        <label for="standby_check">대기경기</label>
                    </div>
                    <div class="end_game">
                        <input type="radio" value="end" id="end_check">
                        <label for="end_check">끝난경기</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="second_nav">
            <div class="click_nav">
                <div class="all_game_view select_view">
                    <span>전체 경기 보기</span>
                </div>
                <div class="top_game_view">
                    <span>탑 경기만 보기</span>
                </div>
                <div class="top_game_hidden">
                    <span>탑 경기만 숨김</span>
                </div>
            </div>
            <div class="check_nav">
                <div>
                    <div class="odds_checkbox">
                        <input type="checkbox" id="odds_check">
                        <label class="odds_label" for="odds_check"><span class="odds_view"></span></label>
                        배당률
                    </div>
                    <div class="prompt_checkbox">
                        <input type="checkbox" id="prompt_check">
                        <label class="odds_label" for="prompt_check"><span class="prompt_view"></span></label>
                        프롬프트
                    </div>
                    <div class="sound_checkbox">
                        <input type="checkbox" id="sound_check">
                        <label class="odds_label" for="sound_check"><span class="sound_view"></span></label>
                        사운드
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="league_rank">리그 순위표</div> -->
        <!-- <div class="betting">
                    <select id="bet_select"></select>
                </div> -->
    </div>
    <h1 style="display: none">축구경기 리스트</h1>
    <header id="listTitle">
        <div>리그</div>
        <div>시간</div>
        <div>상태</div>
        <div>홈</div>
        <div>VS</div>
        <div>원정</div>
        <div>전반</div>
        <div>데이터</div>
        <div>탑</div>
    </header>

    <!-- bookmark game -->
    <section id="bookmark" class="nonDisplay">
        <div style="font-weight: bold">관심경기(전체내리기)</div>
    </section>
    <!-- bookmark game -->

    <?php if(empty($today) && empty($tomorrow) && empty($result)):?>
        <section id="todayResult">
            <div class="no_data"> 금일 예정된 경기가 없습니다.</div>
        </section>
    <?php else: ?>
    <!-- today game -->
    <?php if (isset($today) && !empty($today)) : ?>
        <section id="todayGame">
            <div>
                <?php
                echo nowdate;
                echo '<span style="font-weight: bold"> (' . (_yoil(date('Y-m-d'))) . '요일)</span>';
                ?>
            </div>
            <?php
            if (isset($today)) {
                $i = 1;
                foreach ($today as $to) {
                    $gap = _game_progress($to['game_start_time'], $to['second_start_time'], $to['game_progress']); ?>
                    <div data-idx="<?php echo $to['idx']; ?>" data-nation_idx="<?php echo $to['continent_idx']; ?>"
                         class="<?php echo $i++; ?>">
                        <?php if ($to['league_key'] == $B[$to['league_key'] - 1]['league_key']) { ?>
                            <div>
                                <div style="background-color: <?php echo $B[$to['league_key'] - 1]['color']; ?>"></div>
                                <div style="color:#222222" data-league_full="<?php echo $to['league_name']; ?>"
                                     data-league_idx="<?php echo $to['league_idx']; ?>"><?php echo $B[$to['league_key'] - 1]['league_short']; ?>
                                </div>
                            </div>
                        <?php } ?>
                        <div data-date="<?php echo $to['division_day'];?>"><?php echo _timeFormat($to['game_start_time'], 'H:i'); ?></div>
                        <?php echo $gap; ?>
                        <div data-home_idx="<?php echo $to['home_idx']; ?>">
                            <?php if ($to['home_current_rank'] !== '') { ?>
                                <span id="horder_<?php echo $to['idx']; ?>">
                                        <font color="#9a9fbf">[<?php echo $to['home_current_rank']; ?>]</font>
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
                                echo '<span>-</span>';
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
                                    <font color="#9a9fbf">[<?php echo $to['away_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                        </div>
                        <div style="cursor: pointer;">
                            <?php echo '<span style="color: #9a9fbf">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div class="dataContainer">
                            <div style="display: block; width: 92px; " align="left">
                                <div id="analysis"><span class="tooltips" tooltip="The top of the element"
                                                         tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                            </div>
                        </div>
                        <div><span></span></div>
                    </div>
                    <?php
                } //end foreach
            } ?>
        </section>
        <?php endif;?>
    <!-- today game -->

    <!-- tomorrow game -->
    <?php if (isset($tomorrow) && !empty($tomorrow)) : ?>
        <section id="tomorrowGame">
            <div>
                <?php echo date('Y-m-d', strtotime("+1 days"));
                echo '<span style="font-weight: bold"> (' . (_yoil(date('Y-m-d'), 1)) . '요일)</span>';
                ?>
            </div>
            <?php
            if (isset($tomorrow)) {
                $i = 1;
                foreach ($tomorrow as $to) {
                    $gap = _game_progress($to['game_start_time'], $to['second_start_time'], $to['game_progress']); ?>
                    <div data-idx="<?php echo $to['idx']; ?>" data-nation_idx="<?php echo $to['continent_idx']; ?>"
                         class="<?php echo $i++; ?>">

                        <?php if ($to['league_key'] == $B[$to['league_key'] - 1]['league_key']) { ?>
                            <div>
                                <div style="background-color: <?php echo $B[$to['league_key'] - 1]['color']; ?>"></div>
                                <div style="color:#222222" data-league_full="<?php echo $to['league_name']; ?>"
                                     data-league_idx="<?php echo $to['league_idx']; ?>"><?php echo $B[$to['league_key'] - 1]['league_short']; ?>
                                </div>
                            </div>
                        <?php } ?>
                        <div data-date="<?php echo $to['division_day'];?>"><?php echo _timeFormat($to['game_start_time'], 'H:i'); ?></div>
                        <?php echo $gap; ?>
                        <div data-home_idx="<?php echo $to['home_idx']; ?>">
                            <?php if ($to['home_current_rank'] !== '') { ?>
                                <span id="horder_<?php echo $to['idx']; ?>">
                                    <font color="#9a9fbf">[<?php echo $to['home_current_rank']; ?>]</font>
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
                                echo '<span>-</span>';
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
                                    <font color="#9a9fbf">[<?php echo $to['away_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                        </div>
                        <div style="cursor: pointer;">
                            <?php echo '<span style="color: #9a9fbf">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div class="dataContainer">
                            <div style="display: block; width: 92px; " align="left">
                                <div id="analysis"><span class="tooltips" tooltip="The top of the element"
                                                         tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                            </div>
                        </div>
                        <div><span></span></div>
                    </div>
                    <?php
                } //end foreach
            } ?>
        </section>
        <?php endif; ?>
    <!-- tomorrow game -->

    <!-- result game -->
    <?php if (isset($result) && !empty($result)) : ?>
        <section id="todayResult">
            <div>
                <span style="font-weight: bold">결과</span>
            </div>
            <?php
            if (isset($result)) {
                $i = 1;
                foreach ($result as $to) :
                    $gap = _game_progress($to['game_start_time'], $to['second_start_time'], $to['game_progress']); ?>
                    <div data-idx="<?php echo $to['idx']; ?>" data-nation_idx="<?php echo $to['continent_idx']; ?>"
                         class="<?php echo $i++; ?>">

                        <?php if ($to['league_key'] == $B[$to['league_key'] - 1]['league_key']) { ?>
                            <div>
                                <div style="background-color: <?php echo $B[$to['league_key'] - 1]['color']; ?>"></div>
                                <div style="color:#222222" data-league_full="<?php echo $to['league_name']; ?>"
                                     data-league_idx="<?php echo $to['league_idx']; ?>"><?php echo $B[$to['league_key'] - 1]['league_short']; ?>
                                </div>
                            </div>
                        <?php } ?>
                        <div data-date="<?php echo $to['division_day'];?>"><?php echo _timeFormat($to['game_start_time'], 'H:i'); ?></div>
                        <?php echo $gap; ?>
                        <div data-home_idx="<?php echo $to['home_idx']; ?>">
                            <?php if ($to['home_current_rank'] !== '') { ?>
                                <span id="horder_<?php echo $to['idx']; ?>">
                                    <font color="#9a9fbf">[<?php echo $to['home_current_rank']; ?>]</font>
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
                                echo '<span>-</span>';
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
                                    <font color="#9a9fbf">[<?php echo $to['away_current_rank']; ?>]</font>
                                </span>
                            <?php } ?>
                        </div>
                        <div style="cursor: pointer;">
                            <?php echo '<span style="color: #9a9fbf">' . $to['home_1stHalf_goal'] . '-' . $to['away_1stHalf_goal'] . '</span>' ?>
                        </div>
                        <div class="dataContainer">
                            <div style="display: block; width: 92px; " align="left">
                                <div id="analysis"><span class="tooltips" tooltip="The top of the element"
                                                         tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                            </div>
                        </div>
                        <div><span></span></div>
                    </div>
                    <?php
                endforeach; //end foreach
            }
            ?>
        </section>
    <?php endif ?>
    <!-- result game -->
    <?php endif?>
    <!-- yesterday game -->
    <?php if (isset($matchYesterday) && !empty($matchYesterday)) { ?>
        <section id="yesterday_result">
            <div>
                <div id="listTitle">
                    <div>경기</div>
                    <div>시간</div>
                    <div>상태</div>
                    <div>홈팀</div>
                    <div>스코어</div>
                    <div>원정팀</div>
                    <div>전반</div>
                    <div>C</div>
                    <div>데이터</div>
                </div>
                <div>전일 경기 결과</div>
            </div>
            <?php
            if (isset($matchYesterday)) {
                foreach ($matchYesterday as $to) {
                    $gap = _game_progress(null, null, $to['game_progress']); ?>
                    <div data-idx="<?php echo $to['game_idx']; ?>">


                        <div>
                            <div style="background-color: <?php echo $to['league_config']['color']; ?>"></div>
                            <div style="color:#222222" data-league_full="<?php echo $to['league_name']; ?>"
                                 data-league_idx="<?php echo $to['league_idx']; ?>"><?php echo $to['league_config']['short_name']; ?>
                            </div>
                        </div>

                        <div data-date="<?php echo $to['division_day'];?>"><?php ?></div>
                        <?php echo $gap; ?>
                        <div data-home_idx="<?php echo $to['home_idx']; ?>">


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

                        </div>
                        <div style="cursor: pointer;">
                            <?php echo '<span style="color: #9a9fbf">' . $to['first_home_goal'] . '-' . $to['first_away_goal'] . '</span>' ?>
                        </div>
                        <div>
                            <span class="blue"><?php echo $to['home_c'] . '-' . $to['away_c']; ?></span>
                        </div>
                        <div class="dataContainer">
                            <div style="display: block; width: 92px; " align="left">
                                <div id="analysis"><span class="tooltips" tooltip="The top of the element"
                                                         tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                                <div><span class="tooltips" tooltip="The top of the element"
                                           tooltip-position="top"></span></div>
                            </div>
                        </div>
                    </div>
                    <?php
                } //end foreach
            }
            ?>
        </section>
    <?php } ?>
    <!-- yesterday game -->

</article>
<div id="divView">
</div>
<audio id="audio" autoplay>
    <source src="" type="audio/mpeg">
</audio>

<!-- <video id="sound" preload="none" src=""></video> -->
<!-- <video autoplay="" name="media">
<source src="" type="audio/mpeg">
</video>
<iframe src="" allow="autoplay" id="audio" style="display:none" sandbox></iframe> -->


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
