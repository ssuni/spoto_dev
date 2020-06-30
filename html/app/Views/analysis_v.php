

<article id="analysis_popup">
    <h1 style="display: none;">축구경기 분석</h1>
    <div id="listTitle" style="display: none;"></div>
    <header id="analysis_title">
        <div><span class="main_logo"></span><span>Livescore</span></div>
    </header>
    <nav id="tap_menu">
        <div class="live_menu"><span>실시간중계</span></div>
        <div class="basic_menu nav_selected"><span>기본분석</span></div>
        <div class="detail_menu"><span>상세분석</span></div>
        <div class="odd_menu"><span>배당률</span></div>
    </nav>
    <?php if($data['isset'] !== null):?>
    <section id="season_analysis">
        <h2 style="display: none;">시즌 팀 전력 분석</h2>
    </section>
    <section id="home_latest">
        <h2 style="display: none">홈팀 최근 경기 분석</h2>
        <div class="main_title">
            <div><span></span> 최근 경기 분석</div>
        </div>
        <div class="filter_nav"></div>
        <div class="graph">
            <div><span class="goal_img"><span></span></span>득점</div>
            <div><span class="lose_img"><span></span></span>실점</div>
            <div><span></span>팀의 득,실점 그래프</div>
            <div style="width: 784px; height: 171px;">
                <canvas id="h_latest"></canvas>
                <div id="h_chartjs-tooltip" class="center bottom"></div>
            </div>
        </div>
        <div class="sub_title">
            <div>리그</div>
            <div>날짜</div>
            <div>홈</div>
            <div>VS</div>
            <div>원정</div>
            <div>전반</div>
            <div>결과</div>
        </div>
        <div class="game_content"></div>
    </section>
    <section id="away_latest">
        <h2 style="display: none">원정팀 최근경기 분석</h2>
        <div class="main_title">
            <div><span></span> 최근 경기 분석</div>
        </div>
        <div class="filter_nav"></div>
        <div class="graph">
            <div><span class="goal_img"><span></span></span>득점</div>
            <div><span class="lose_img"><span></span></span>실점</div>
            <div><span></span>팀의 득,실점 그래프</div>
            <div style="width: 784px; height: 171px;">
                <canvas id="a_latest"></canvas>
                <div id="a_chartjs-tooltip" class="center bottom"></div>
            </div>
        </div>
        <div class="sub_title">
            <div>리그</div>
            <div>날짜</div>
            <div>홈</div>
            <div>VS</div>
            <div>원정</div>
            <div>전반</div>
            <div>결과</div>
        </div>
        <div class="game_content"></div>
    </section>
    <section id="relative_record">
        <h2 style="display: none">상대 전적 분석</h2>




<!--        <div class="main_title">-->
<!--            <div>상대 전적 분석</div>-->
<!--        </div>-->
<!--        <div class="filter_nav">-->
<!--            <select id="latest_game">-->
<!--                <option value="1">최근 5경기</option>-->
<!--                <option value="2" selected="selected">최근 10경기</option>-->
<!--                <option value="3">최근 15경기</option>-->
<!--                <option value="4">최근 20경기</option>-->
<!--            </select>-->
<!--            <select id="game_league">-->
<!--                <option value="0">전체리그</option>-->
<!--            </select>-->
<!--            <div class="all_game latest_selected">전체</div>-->
<!--            <div class="home_away_game">홈/원정 동일</div>-->
<!--        </div>-->
<!--        <div class="team_color">-->
<!--            <div style="background-color: #517dc9;"></div>-->
<!--            <div style="background-color: #ffd46e;"></div>-->
<!--        </div>-->
<!--        <div class="graph">-->
<!--            <div class="home_info">-->
<!--                <div>-->
<!--                    <div>첼시 FC</div>-->
<!--                    <div><span>6</span>승<span>1</span>무<span>8</span>패</div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="graph_content">-->
<!--                <div>-->
<!--                    <div>홈팀 승</div>-->
<!--                    <div>-->
<!--                        <div class="color_back">-->
<!--                            <div class="color_g" style="background-color: #517dc9; width: 40%;"><span>6</span></div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div>40.0%</div>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <div>무승부</div>-->
<!--                    <div class="donut_graph">-->
<!--                        <div class="donut_color"><span>1</span></div>-->
<!--                    </div>-->
<!--                    <div>6.7%</div>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <div>원정팀 승</div>-->
<!--                    <div>-->
<!--                        <div class="color_back">-->
<!--                            <div class="color_g" style="background-color: #ffd46e; width: 53.3%;"><span>8</span></div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                    <div>53.3%</div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="away_info">-->
<!--                <div>-->
<!--                    <div>리버풀 FC</div>-->
<!--                    <div><span>8</span>승<span>1</span>무<span>6</span>패</div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="sub_title">-->
<!--            <div>리그</div>-->
<!--            <div>날짜</div>-->
<!--            <div>홈</div>-->
<!--            <div>VS</div>-->
<!--            <div>원정</div>-->
<!--            <div>전반</div>-->
<!--            <div>결과</div>-->
<!--        </div>-->
<!--        <div class="game_content">-->
<!--            <div class="content_1">-->
<!--                <div>프리미어리그</div>-->
<!--                <div>|</div>-->
<!--                <div>20-01-24</div>-->
<!--                <div>|</div>-->
<!--                <div>리버풀 FC<img src="http://info.nowgoal.com/Image/team/images/2013121220925.png" alt="리버풀 FC"></div>-->
<!--                <div><span>2</span> : <span>2</span></div>-->
<!--                <div><img src="http://info.nowgoal.com/Image/team/images/2013124174836.png" alt="첼시 FC">첼시 FC</div>-->
<!--                <div>|</div>-->
<!--                <div>0 : 1</div>-->
<!--                <div>|</div>-->
<!--                <div><div class="draw_game">D</div></div>-->
<!--            </div>-->
<!--            <div class="content_2">-->
<!--                <div>프리미어리그</div>-->
<!--                <div>|</div>-->
<!--                <div>19-10-07</div>-->
<!--                <div>|</div>-->
<!--                <div>첼시 FC<img src="http://info.nowgoal.com/Image/team/images/2013124174836.png" alt="첼시 FC"></div>-->
<!--                <div><span>1</span> : <span class="game_win">3</span></div>-->
<!--                <div class="win_team"><img src="http://info.nowgoal.com/Image/team/images/2013121220925.png" alt="리버풀 FC">리버풀 FC</div>-->
<!--                <div>|</div>-->
<!--                <div>0 : 2</div>-->
<!--                <div>|</div>-->
<!--                <div><div class="lose_game">W</div></div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="second_title">-->
<!--            <div>상대 전적 스탯 분석</div>-->
<!--        </div>-->
<!--        <div class="team_title">-->
<!--            <div style="border-top: 1px solid #517dc9;">첼시 FC</div>-->
<!--            <div style="border-top: 1px solid #ffd46e;">리버풀 FC</div>-->
<!--        </div>-->
<!--        <div class="second_sub_title">-->
<!--            <div>평균</div>-->
<!--            <div>구분</div>-->
<!--            <div>평균</div>-->
<!--        </div>-->
<!--        <div class="opponent_content">-->
<!--            <div class="aver_goal">-->
<!--                <div>-->
<!--                    <div class="color_back">-->
<!--                        <div class="color_g" style="width: 36%;"></div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span>36</span>-->
<!--                </div>-->
<!--                <div>|</div>-->
<!--                <div>-->
<!--                    <span>평균 득점</span>-->
<!--                </div>-->
<!--                <div>|</div>-->
<!--                <div>-->
<!--                    <span>64</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <div class="color_back">-->
<!--                        <div class="color" style="background-color: #ffd46e; width: 64%;"></div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="aver_losing_p">-->
<!--                <div>-->
<!--                    <div class="color_back">-->
<!--                        <div class="color_g" style="width: 75.5%;"></div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <span>75.5</span>-->
<!--                </div>-->
<!--                <div>|</div>-->
<!--                <div>-->
<!--                    <span>평균 실점</span>-->
<!--                </div>-->
<!--                <div>|</div>-->
<!--                <div>-->
<!--                    <span>81.8</span>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <div class="color_back">-->
<!--                        <div class="color" style="background-color: #ffd46e; width: 81.8%;"></div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->




    </section>
    <section id="distribution_chart">
        <h2 style="display: none">득점 분포도</h2>
    </section>
    <section id="att_analysis">
        <h2 style="display: none;">최근 5경기 공격력 분석</h2>
        <div class="main_title">
            <div>최근 5경기 공격력 분석</div>
        </div>
        <div class="team_title">
            <div style="border-top: 1px solid #517dc9;"></div>
            <div style="border-top: 1px solid #ffd46e;"></div>
        </div>
        <div class="second_sub_title">
            <div>평균</div>
            <div>구분</div>
            <div>평균</div>
        </div>
        <div class="att_content"></div>
        <div class="second_title">
            <div>공격력 상세 그래프</div>
        </div>
        <div class="second_sub_title">
            <div>그래프</div>
            <div>구분</div>
            <div>그래프</div>
        </div>
        <div class="att_graph">
            <div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="h_att_goal_possession"></canvas>
                    </div>
                </div>
                <div>
                    <div><span class="att_goal"><span></span></span>득점</div>
                    <div><span class="att_possession"><span></span></span>점유율(%)</div>
                </div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="a_att_goal_possession"></canvas>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="h_att_shoot_eshoot"></canvas>
                    </div>
                </div>
                <div>
                    <div><span class="att_shoot"><span></span></span>슈팅</div>
                    <div><span class="att_e_shoot"><span></span></span>유효슈팅</div>
                </div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="a_att_shoot_eshoot"></canvas>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="h_att_free_corner"></canvas>
                    </div>
                </div>
                <div>
                    <div><span class="att_free"><span></span></span>프리킥</div>
                    <div><span class="att_corner"><span></span></span>코너킥</div>
                </div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="a_att_free_corner"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="def_analysis">
        <h2 style="display: none;">최근 5경기 수비력 분석</h2>
        <div class="main_title">
            <div>최근 5경기 수비력 분석</div>
        </div>
        <div class="team_title">
            <div style="border-top: 1px solid #517dc9;"></div>
            <div style="border-top: 1px solid #ffd46e;"></div>
        </div>
        <div class="second_sub_title">
            <div>평균</div>
            <div>구분</div>
            <div>평균</div>
        </div>
        <div class="def_content"></div>
        <div class="second_title">
            <div>수비력 상세 그래프</div>
        </div>
        <div class="second_sub_title">
            <div>그래프</div>
            <div>구분</div>
            <div>그래프</div>
        </div>
        <div class="def_graph">
            <div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="h_def_goal_possession"></canvas>
                    </div>
                </div>
                <div>
                    <div><span class="def_goal"><span></span></span>실점</div>
                    <div><span class="def_possession"><span></span></span>점유율(%)</div>
                </div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="a_def_goal_possession"></canvas>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="h_def_shoot_eshoot"></canvas>
                    </div>
                </div>
                <div>
                    <div><span class="def_shoot"><span></span></span>슈팅 허용</div>
                    <div><span class="def_e_shoot"><span></span></span>유효슈팅 허용</div>
                </div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="a_def_shoot_eshoot"></canvas>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="h_def_free_corner"></canvas>
                    </div>
                </div>
                <div>
                    <div><span class="def_free"><span></span></span>프리킥 허용</div>
                    <div><span class="def_corner"><span></span></span>코너킥 허용</div>
                </div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="a_def_free_corner"></canvas>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="h_def_foul_ycard"></canvas>
                    </div>
                </div>
                <div>
                    <div><span class="def_foul"><span></span></span>파울 개수</div>
                    <div><span class="def_y_card"><span></span></span>경고 개수</div>
                </div>
                <div>
                    <div style="width: 289px; height: 137px;">
                        <canvas id="a_def_foul_ycard"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php endif;?>
    <!---------------------------------------------------------------------------------------------------------------->
    <!----------------------------------------- 상세 분석 페이지 시작 ---------------------------------------------------->
    <!---------------------------------------------------------------------------------------------------------------->
    <?php if($data['isset'] !== null):?>
    <!------ 홈/원정 분석 시작 ------>
    <?php
    $basic_h = $data['detail_page_1']['p1_1']['d1']['div_home'];
    $basic_a = $data['detail_page_1']['p1_1']['d1']['div_away'];
    $basic_arr = [$basic_h,$basic_a];
    $basic_title = ['기준','게임','승','무','패','득점','실점','마진','승점'];
    $basic_length = count($basic_title);
    $basic_team_color = ['#517dc9','#ffd46e'];
    $basic_class = ['home_content','away_content'];
    $basic_home_key = ['home','away'];
    $basic_home_away = ['홈','원정'];

    $avr_point_h = $data['detail_page_1']['p1_1']['d2']['div_home'];
    $avr_point_a = $data['detail_page_1']['p1_1']['d2']['div_away'];
    $avr_point_arr = [$avr_point_h,$avr_point_a];

    $avr_comparison_h = $data['detail_page_1']['p1_1']['d3']['div_home'];
    $avr_comparison_a = $data['detail_page_1']['p1_1']['d3']['div_away'];
    $avr_com_arr = [$avr_comparison_h,$avr_comparison_a];
    $avr_com_key_h = ['point_per_home','goal_per_home','lose_per_home'];
    $avr_com_key_a = ['point_per_away','goal_per_away','lose_per_away'];
    ?>
    <!------ 홈/원정 분석 끝 ------>

    <!------ 스코어 분포 통계 시작 ------>
    <?php
    $stats_h = $data['detail_page_1']['p1_2']['d1']['div_home'];
    $stats_a = $data['detail_page_1']['p1_2']['d1']['div_away'];
    $stats_arr = [$stats_h, $stats_a];
    $stats_data_key = ['home','away'];
    $stats_graph_color = ['#ff5e3a','#6aa5c7'];
    $length_arr = [count($stats_h['home']),count($stats_h['away']),count($stats_a['home']),count($stats_a['away'])];
    $max_length = max($length_arr);
    $stats_title = ['점수','횟수','그래프','점수','횟수','그래프'];
    ?>
    <!------ 스코어 분포 통계 끝 ------>

    <!------ 선제 득점 / 선제 실점 시작 ------>
    <?php
    $first_h = $data['detail_page_1']['p1_3']['d1']['div_home'];
    $first_a = $data['detail_page_1']['p1_3']['d1']['div_away'];
    $first_key = ['home','away'];
    $first_arr = [$first_h,$first_a];
    $first_class = ['home_content','away_content'];

    $time_d_key = ['d2','d3'];
    $time_h_a_key = ['home','away'];
    $time_div_key = ['div_home','div_away'];
    $time_content_key = ['team_name','first_goal_total','time_0_15','time_16_30','time_31_45','time_46_60','time_61_75','time_76_90'];
    $time_content_key1 = ['team_name','first_lose_total','time_0_15','time_16_30','time_31_45','time_46_60','time_61_75','time_76_90'];
    $time_content_arr = [$time_content_key, $time_content_key1];
    $time_title = ['선제 득점 타임 테이블','선제 실점 타임 테이블'];
    $time_table_title = ['팀명','전체','0-15','16-30','31-45','46-60','61-75','76-90','전반','후반'];
    $time_content_class = ['home_content','away_content'];

    $result_d_key = ['d4','d5'];
    $result_h_a_key = ['home','away'];
    $result_div_key = ['div_home','div_away'];
    $result_title_class = ['goal_time_table_result','loss_time_table_result'];
    $result_content_class = ['home_content','away_content'];
    $result_title = ['선제 득점 비율 및 승무패 결과','선제 실점 비율 및 승무패 결과'];
    $result_table_title = ['팀명','전체경기','선득점','비율','승','무','패','득-실점'];
    $result_table_title1 = ['팀명','전체경기','선실점','비율','승','무','패','득-실점'];
    $result_table_arr = [$result_table_title,$result_table_title1];
    $result_content_key = ['team_name','games','first_goal','per_first_goal','W','D','L'];
    $result_content_key1 = ['team_name','games','first_lose','per_first_goal','W','D','L'];
    $result_content_arr = [$result_content_key, $result_content_key1];
    ?>
    <!------ 선제 득점 / 선제 실점 끝 ------>

    <!------ 리드골 득점 / 리드골 허용 시작 ------>
    <?php
    $lead_d_key = ['d1','d2'];
    $lead_div_key = ['div_home','div_away'];
    $lead_title = ['선제 득점 비율 및 승무패 결과','선제 실점 비율 및 승무패 결과'];
    $lead_class = ['lead_win_result','lead_lose_result'];
    $sub_title = ['리드골 득점','동점골 허용'];
    $sub_title1 = ['리드골 허용','동점골 득점'];
    $sub_title_arr = [$sub_title,$sub_title1];
    $lead_content_title = ['팀명','전체경기'];
    $lead_content_title1 = ['횟수','경기당 평균'];
    $lead_content_title2 = ['횟수','경기당 평균'];
    $lead_content_arr = [$lead_content_title,$lead_content_title1,$lead_content_title2];
    $lead_content_class = ['home_content','away_content'];
    $lead_team_c = ['#a9c8da','#f39884'];
    ?>
    <!------ 리드골 득점 / 리드골 허용 끝 ------>

    <!------ 공 유형 통계 시작 ------>
    <?php
    $type_h = $data['detail_page_1']['p1_5']['d1']['total']['div_home'];
    $type_a = $data['detail_page_1']['p1_5']['d1']['total']['div_away'];
    $type_arr = [$type_h, $type_a];
    $type_tie_cnt = ['tie_goal_cnt','tie_permit_cnt'];
    $type_tie_per = ['tie_goal_per','tie_permit_per'];
    $type_lead_cnt = ['lead_goal_cnt','lead_permit_cnt'];
    $type_lead_per = ['lead_goal_per','lead_permit_per'];
    $type_other_cnt = ['other_goal_cnt','other_permit_cnt'];
    $type_other_per = ['other_goal_per','other_permit_per'];
    ?>
    <!------ 공 유형 통계 끝 ------>

    <!------ 무득점 / 무실점 시작 ------>
    <?php
    $no_d_arr = ['d1','d2'];
    $no_t_arr = ['total','home','away'];
    $no_title_class = ['no_goal','no_point'];
    $no_small_title = ['무득점 경기 통계','무실점 경기 통계'];
    $no_title_sub = ['경기','횟수','비율'];
    $no_home_away = ['home_content','away_content'];
    $no_goal_key = ['no_goal_game','no_lose_game'];
    $no_per_key = ['no_goal_game_per','no_lose_game_per'];
    $no_table_title = ['-','전체','홈','원정'];

    $all_d_arr = ['d3','d4'];
    $all_title_class = ['all_team_goal','first_second_all_goal'];
    $all_small_title = ['양팀 모두 득점한 경기 통계','전후반 모두 득점한 경기 통계'];
    $all_game_key = ['games','all_half_goal_games'];
    $all_goal_key = ['both_goal_game','all_half_goal_cnt'];
    $all_per_key = ['both_goal_game_per','all_half_goal_cnt_per'];
    ?>
    <!------ 무득점 / 무실점 끝 ------>

    <!------ 전반 경기력 시작 ------>
    <?php
    $perfor_sub_title = ['팀명','해당경기','전체경기','비율','승','무','패','득-실점','승점','평균승점'];
    $perfor_key = ['team_name','first_half_W_cnt','games','first_half_W_per','W','D','L','goal','team_point','team_point_avg'];
    $perfor_key1 = ['team_name','first_half_L_cnt','games','first_half_L_per','W','D','L','goal','team_point','team_point_avg'];
    $per_key_arr = [$perfor_key, $perfor_key1];
    $perfor_title = ['전반 종료시 앞서는 경기 횟수 및 결과','전반 종료시 뒤지는 경기 횟수 및 결과'];
    ?>
    <!------ 전반 경기력 끝 ------>

    <!------ 득점/실점 시간 시작 ------>
    <?php
    $goal_title = ['전체득점','전반','후반','평균시간'];
    $goal_key = ['goals','first_half','second_half','time_avg'];

    $avg_title = ['팀명','전체경기','앞서는 시간','비기는 시간','뒤쳐지는 시간','그래프'];
    $avg_key = ['team_name','games','time_W','time_D','time_L'];

    $goal_15_main_title = ['15분 단위 득점','15분 단위 실점'];
    $goal_15_title = ['팀명','0-15','16-30','31-45','46-60','61-75','76-90','전반','후반','그래프'];
    $goal_15_key = ['team_name','time_0_15','time_16_30','time_31_45','time_46_60','time_61_75','time_76_90','first_half','second_half'];
    $goal_15_id = ['goal_15_time','loss_15_time'];

    $goal_d_arr = ['d5','d6'];
    $goal_10_main_title = ['10분 단위 득점','10분 단위 실점'];
    $goal_10_title = ['팀명','0-10','11-20','21-30','31-40','41-50','51-60','61-70','71-80','81-90','전반','후반','그래프'];
    $goal_10_key = ['team_name','time_0_10','time_11_20','time_21_30','time_31_40','time_41_50','time_51_60','time_61_70','time_71_80','time_81_90','first_half','second_half'];
    $goal_10_id = ['goal_10_time','loss_10_time'];
    ?>
    <!------ 득점/실점 시간 끝 ------>

    <!------ 평균 득실점 시작 ------>
    <?php
    $avg_goal_loss_h = $data['detail_page_3']['p3_1']['d1']['div_home'];
    $avg_goal_loss_a = $data['detail_page_3']['p3_1']['d1']['div_away'];
    $avg_goal_loss_arr = [$avg_goal_loss_h,$avg_goal_loss_a];
    $avg_data_div_key = ['total','home','away'];
    $avg_goal_loss_key = ['goal_avg','lose_avg','goal_diff_avg'];
    $avg_table_title = ['-','전체 득실점 평균','홈 득실점 평균','원정 득실점 평균'];
    $avg_table_title_sub = ['득점','실점','득실점'];

    $section_data_key = ['goal_4_over','goal_3','goal_2','goal_1','goal_0','goal_avg','team_name','lose_avg','lose_0','lose_1','lose_2','lose_3','lose_4_over'];
    $section_data_key1 = ['second_half_goal','first_half_goal','goal_4_over','goal_2_3','goal_0_1','goal_avg','team_name','lose_avg','lose_0_1','lose_2_3',
        'lose_4_over','first_half_lose','second_half_lose'];
    $section_key_arr = [$section_data_key,$section_data_key1];
    $section_sub_title_h = ['4+','3','2','1','0','평균득점'];
    $section_sub_title_h1 = ['후반','전반','4+','2~3','0~1','평균득점'];
    $section_sub_title_a = ['평균실점','0','1','2','3','4+'];
    $section_sub_title_a1 = ['평균실점','0~1','2~3','4+','전반','후반'];
    $section_sub_title_h_arr = [$section_sub_title_h,$section_sub_title_h1];
    $section_sub_title_a_arr = [$section_sub_title_a,$section_sub_title_a1];
    ?>
    <!------ 평균 득실점 끝 ------>

    <!------ 평균 득실점 상대전적 시작 ------>
    <?php
    $avg_relative_h = $data['detail_page_3']['p3_2']['d1']['total']['div_home'];
    $avg_relative_a = $data['detail_page_3']['p3_2']['d1']['total']['div_away'];
    $avg_relative_content = ['득점','실점','총 골수'];
    $avg_relative_key = ['goal_avg','lose_avg','goal'];

    $avg_relative_sec_h = $data['detail_page_3']['p3_2']['d2']['total']['div_home'];
    $avg_relative_sec_a = $data['detail_page_3']['p3_2']['d2']['total']['div_away'];
    $avg_sec_arr = [$avg_relative_sec_h,$avg_relative_sec_a];
    $avg_relative_sec_title_h = ['4+','3','2','1','0','평균득점'];
    $avg_relative_sec_title_a = ['평균실점','0','1','2','3','4+'];
    $avg_sec_key = ['goal_4_over','goal_3','goal_2','goal_1','goal_0','goal_avg','team_name','lose_avg','lose_0','lose_1','lose_2','lose_3','lose_4_over'];
    ?>
    <!------ 평균 득실점 상대전적 끝 ------>

    <!------ 득실점 마진 시작 ------>
    <?php
    $margin_main_title = ['전체 경기 득실점 마진','득실점 마진 상대전적'];
    $margin_content_title = ['-','득점 마진','경기 결과','실점 마진'];
    $margin_sub_title = ['1','2','3','4+'];
    $margin_sub_title1 = ['승','무','패'];
    ?>
    <!------ 득실점 마진 끝 ------>

    <!------ 최근 추세 시작 ------>
    <?php
    $trend_point_h = $data['detail_page_3']['p3_4']['d1']['total']['div_home'];
    $trend_point_a = $data['detail_page_3']['p3_4']['d1']['total']['div_away'];
    $trend_point_arr = [$trend_point_h,$trend_point_a];
    $trend_point_sub_title = ['팀명','전체경기','승점'];
    $trend_point_sub_title1 = ['최근 5경기','전체경기','평균 승점 비교'];
    $trend_point_sub_arr = [$trend_point_sub_title,$trend_point_sub_title1];
    if($trend_point_a['point_avg_diff'] !== null) {
        $trend_point_h_per = abs($trend_point_h['point_avg_diff']) / (abs($trend_point_h['point_avg_diff']) + abs($trend_point_a['point_avg_diff'])) * 100;
        $trend_point_a_per = abs($trend_point_a['point_avg_diff']) / (abs($trend_point_h['point_avg_diff']) + abs($trend_point_a['point_avg_diff'])) * 100;
        $trend_point_per_arr = [$trend_point_h_per, $trend_point_a_per];
    }else {
        $trend_point_h_per = 0;
        $trend_point_a_per = 0;
        $trend_point_per_arr = [$trend_point_h_per, $trend_point_a_per];
    }

    $trend_share_h = $data['detail_page_3']['p3_4']['d2']['total']['div_home'];
    $trend_share_a = $data['detail_page_3']['p3_4']['d2']['total']['div_away'];
    $trend_share_arr = [$trend_share_h,$trend_share_a];
    $trend_share_sub_title1 = ['최근 5경기','전체경기','평균 점유율 비교'];
    if($trend_share_h['possession_avg_diff'] !== 0) {
        $trend_share_h_per = abs($trend_share_h['possession_avg_diff']) / (abs($trend_share_h['possession_avg_diff']) + abs($trend_share_a['possession_avg_diff'])) * 100;
        $trend_share_a_per = abs($trend_share_a['possession_avg_diff']) / (abs($trend_share_h['possession_avg_diff']) + abs($trend_share_a['possession_avg_diff'])) * 100;
    }else {
        $trend_share_h_per = 0;
        $trend_share_a_per = 0;
    }
    $trend_share_per_arr = [$trend_share_h_per,$trend_share_a_per];

    $trend_four_title = ['평균 득점 / 실점 최근 추세','평균 슈팅 / 유효슈팅 최근 추세'];
    $trend_four_table_title = ['-','평균 득점','평균 실점'];
    $trend_four_table_title1 = ['-','평균 슈팅','평균 유효슈팅'];
    $trend_sour_table_arr = [$trend_four_table_title,$trend_four_table_title1];
    $trend_four_sub_title = ['팀명','전체경기'];
    $trend_four_sub_title1 = ['최근 5경기','전체경기','전체경기-최근5경기'];
    $trend_four_sub_arr = [$trend_four_sub_title,$trend_four_sub_title1,$trend_four_sub_title1];

    $trend_key_f = ['goal_avg_recent','shots_avg_recent'];
    $trend_key_f_1 = ['goal_avg','shots_avg'];
    $trend_key_f_2 = ['goal_avg_diff','shots_avg_diff'];
    $trend_key_s = ['lose_avg_recent','shots_on_avg_recent'];
    $trend_key_s_1 = ['lose_avg','shots_on_avg'];
    $trend_key_s_2 = ['lose_avg_diff','shots_on_avg_diff'];

    $trend_per_key = ['goal_avg_per','shots_avg_per'];
    $trend_per_key1 = ['lose_avg_per','shots_on_avg_per'];

    ?>
    <!------ 최근 추세 끝 ------>

    <!------ 골키퍼 성적 시작 ------>
    <?php
    $keeper_h = $data['detail_page_3']['p3_5']['d1']['div_home'];
    $keeper_a = $data['detail_page_3']['p3_5']['d1']['div_away'];
    $keeper_key = ['shots_on_permit','save','save_per'];
    $keeper_content = ['유효 슈팅 허용','선방','방어율'];
    if($keeper_h['save'] === 0 || $keeper_a['save'] === 0){
        $keeper_h_permit_per = 0;
        $keeper_h_save_per = 0;
        $keeper_h_save_per_per = $keeper_h['save_per'];
        $keeper_h_per_arr = [$keeper_h_permit_per, $keeper_h_save_per, $keeper_h_save_per_per];
        $keeper_a_permit_per = 0;
        $keeper_a_save_per = 0;
        $keeper_a_save_per_per = $keeper_a['save_per'];
        $keeper_a_per_arr = [$keeper_a_permit_per, $keeper_a_save_per, $keeper_a_save_per_per];
    }else {
        $keeper_h_permit_per = $keeper_h['shots_on_permit'] / ($keeper_h['shots_on_permit'] + $keeper_a['shots_on_permit']) * 100;
        $keeper_h_save_per = $keeper_h['save'] / ($keeper_h['save'] + $keeper_a['save']) * 100;
        $keeper_h_save_per_per = $keeper_h['save_per'];
        $keeper_h_per_arr = [$keeper_h_permit_per, $keeper_h_save_per, $keeper_h_save_per_per];
        $keeper_a_permit_per = $keeper_a['shots_on_permit'] / ($keeper_h['shots_on_permit'] + $keeper_a['shots_on_permit']) * 100;
        $keeper_a_save_per = $keeper_a['save'] / ($keeper_h['save'] + $keeper_a['save']) * 100;
        $keeper_a_save_per_per = $keeper_a['save_per'];
        $keeper_a_per_arr = [$keeper_a_permit_per, $keeper_a_save_per, $keeper_a_save_per_per];
    }

    $keeper_graph_title = ['유효 슈팅 허용','선방','방어율'];
    $keeper_graph_h_id = ['h_keeper_e_shoot','h_keeper_defense','h_defense_rate'];
    $keeper_graph_a_id = ['a_keeper_e_shoot','a_keeper_defense','a_defense_rate'];
    ?>
    <!------ 골키퍼 성적 끝 ------>

    <!------ 예상 포메이션 분석 시작 ------>
    <?php
    $formation_h = $data['detail_page_4']['p4_1']['d1']['div_home'];
    $formation_a = $data['detail_page_4']['p4_1']['d1']['div_away'];
    ?>
    <!------ 예상 포메이션 분석 끝 ------>

    <!------ 최근 5경기 예상 포메이션 상대 전적 시작 ------>
    <?php
    $formation_recent_h = $data['detail_page_4']['p4_1']['d2']['div_home'];
    $formation_recent_a = $data['detail_page_4']['p4_1']['d2']['div_away'];
    $foramtion_arr = [$formation_recent_h, $formation_recent_a];
    $formation_pie_id = ['h_formation_pie','a_formation_pie'];
    $formation_line_id = ['h_formation_d_line','a_formation_d_line'];
    ?>
    <!------ 최근 5경기 예상 포메이션 상대 전적 끝 ------>

    <!------ 선수 교체 분석 시작 ------>
    <?php
    $p_avg_change_h = $data['detail_page_4']['p4_2']['d1']['div_home'];
    $p_avg_change_a = $data['detail_page_4']['p4_2']['d1']['div_away'];
    $p_avg_change_arr = [$p_avg_change_h,$p_avg_change_a];
    $p_avg_change_key = ['team_name','sub_time_avg_1','sub_time_avg_2','sub_time_avg_3','sub_cnt_avg'];
    $p_change_title = ['팀명','첫번째 교체 발생 시간 평균','두번째 교체 발생 시간 평균','세번째 교체 발생 시간 평균','경기당 평균 교체 횟수'];
    ?>
    <!------ 선수 교체 분석 끝 ------>

    <!------ 경고 및 퇴장 횟수 시작 ------>
    <?php
    $y_r_card_cnt_h = $data['detail_page_4']['p4_3']['d1']['div_home'];
    $y_r_card_cnt_a = $data['detail_page_4']['p4_3']['d1']['div_away'];
    $y_r_card_cnt_arr = [$y_r_card_cnt_h,$y_r_card_cnt_a];
    $y_r_card_cnt_key = ['team_name','yellow_avg','yellow_permit_avg','red_avg','red_permit_avg'];
    $y_r_card_cnt_title = ['팀명','받은 옐로카드 평균','상대팀이 받은 옐로카드 평균','받은 레드카드 평균','상대팀이 받은 레드카드 평균'];
    ?>
    <!------ 경고 및 퇴장 횟수 끝 ------>

    <!------ 양 팀 경기 결과별 성적 비교 시작 ------>
    <?php
    $result_stats_div_key = ['d1','d2','d3'];
    $result_stats_title = ['승리한 경기 스탯 비교','무승부한 경기 스탯 비교','패배한 경기 스탯 비교'];
    $result_stats_key = ['goal_avg','lose_avg','shots_avg','shots_on_avg','possession_avg','free_kicks_avg','corner_kicks_avg'];
    $result_stats_per_key = ['goal_per','lose_per','shots_per','shots_on_per','possession_per','free_kicks_per','corner_kicks_per'];
    $result_stats_name = ['평균 득점','평균 실점','슈팅','유효 슈팅','평균 점유율','프리킥','코너킥'];
    ?>
    <!------ 양 팀 경기 결과별 성적 비교 끝 ------>

    <!------ 휴식일별 성적 비교 시작 ------>
    <?php
    $rest_day_h = $data['detail_page_4']['p4_5']['d1']['total']['div_home'];
    $rest_day_a = $data['detail_page_4']['p4_5']['d1']['total']['div_away'];
    $rest_day_arr = [$rest_day_h,$rest_day_a];
    $rest_day_sub_title = ['2','3','4','5','6+'];
    $rest_day_content_title = ['경기수','평균 득점','평균 실점','평균 슈팅','평균 유효 슈팅','평균 점유율','평균 프리킥','평균 코너킥'];
    $rest_day_mid_key = ['gab_2','gab_3','gab_4','gab_5','gab_6_over'];
    $rest_day_key = ['games','goal_avg','lose_avg','shots_avg','shots_on_avg','possession_avg','free_kicks_avg','corner_kicks_avg'];
    ?>
    <!------ 휴식일별 성적 비교 끝 ------>

    <section id="detail_h_a_analysis">
        <div class="basic_analysis">
            <div class="main_title">
                <div>홈 / 원정 분석</div>
                <div>양팀의 최근 20경기 분석 데이터</div>
            </div>
        <?php for($s=0; $s<2; $s++):?>
            <div class="analysis_detail" style="border-top: 1px solid <?php echo $basic_team_color[$s];?>">
                <div class="main_sub_title">
                    <div style="border-top: 1px solid <?php echo $basic_team_color[$s];?>;"><?php echo $basic_arr[$s]['home']['team_name'];?></div>
                </div>
                <div class="table_title">
                <?php for($i=0; $i<$basic_length; $i++): ?>
                    <div><?php echo $basic_title[$i];?></div>
                <?php endfor;?>
                </div>
                <?php for($i=0; $i<2; $i++): ?>
                <div class="<?php echo $basic_class[$i];?>">
                    <div class="bin"><?php echo $basic_home_away[$i];?></div>
                    <div class="bin"><?php echo $basic_arr[$s][$basic_home_key[$i]]['game'];?></div>
                    <div class="bin"><?php echo $basic_arr[$s][$basic_home_key[$i]]['W'];?></div>
                    <div class="bin"><?php echo $basic_arr[$s][$basic_home_key[$i]]['D'];?></div>
                    <div class="bin"><?php echo $basic_arr[$s][$basic_home_key[$i]]['L'];?></div>
                    <div class="bin"><?php echo $basic_arr[$s][$basic_home_key[$i]]['goal'];?></div>
                    <div class="bin"><?php echo $basic_arr[$s][$basic_home_key[$i]]['lose'];?></div>
                    <div class="bin"><?php echo $basic_arr[$s][$basic_home_key[$i]]['diff'];?></div>
                    <div><?php echo $basic_arr[$s][$basic_home_key[$i]]['point'];?></div>
                </div>
                <?php endfor; ?>
            </div>
        <?php endfor; ?>
        </div>
        <div class="avr_points">
            <div class="avr_title">경기별 평균 승점</div>
            <div class="avr_contents">
                <div class="table_title">
                    <div>-</div>
                    <div>홈 / 원정 게임</div>
                    <div>평균 승점</div>
                    <div>홈 / 원정 평균 승점 비교</div>
                </div>
                <div class="table_title_sub">
                    <div>팀명</div>
                    <div>
                        <div>홈</div>
                        <div>원정</div>
                        <div>승점</div>
                    </div>
                    <div>
                        <div>홈</div>
                        <div>원정</div>
                    </div>
                    <div>홈 평균 승점 · 원정 평균 승점</div>
                </div>
                <?php for($i=0; $i<2; $i++):?>
                <div class="<?php echo $basic_class[$i];?>">
                    <div class="bin"><?php echo $avr_point_arr[$i]['team_name'];?></div>
                    <div>
                        <div class="bin"><?php echo $avr_point_arr[$i]['home_games'];?></div>
                        <div class="bin"><?php echo $avr_point_arr[$i]['away_games'];?></div>
                        <div class="bin"><?php echo $avr_point_arr[$i]['point'];?></div>
                    </div>
                    <div>
                        <div class="bin"><?php echo $avr_point_arr[$i]['home_avg_point'];?></div>
                        <div class="bin"><?php echo $avr_point_arr[$i]['away_avg_point'];?></div>
                    </div>
                    <div>
                        <?php if((double)$avr_point_arr[$i]['avg_point_diff'] < 0):?>
                        <?php
                            $avr_point = abs((double)$avr_point_arr[$i]['avg_point_diff']);
                            $per_point = ($avr_point/(double)3)*(double)100;
                        ?>
                        <div class="minus"><div class="m_color" style="background-color: #6aa5c7; width: <?php echo round($per_point,1);?>%;"></div></div>
                        <div><?php echo $avr_point_arr[$i]['avg_point_diff'];?></div>
                        <div class="plus"><div class="p_color"></div></div>
                        <?php else:?>
                        <?php
                            $per_point = ($avr_point_arr[$i]['avg_point_diff']/3)*100;
                        ?>
                        <div class="minus"><div class="m_color"></div></div>
                        <div><?php echo $avr_point_arr[$i]['avg_point_diff'];?></div>
                        <div class="plus"><div class="p_color" style="background-color: #ff5e3a; width: <?php echo round($per_point,1);?>%;"></div></div>
                        <?php endif;?>
                    </div>
                </div>
                <?php endfor;?>
            </div>
        </div>
        <div class="avr_comparison">
            <div class="avr_title">승점,득점,실점 비교</div>
            <div class="avr_contents">
                <div class="table_title">
                    <div>-</div>
                    <div>승점</div>
                    <div>득점</div>
                    <div>실점</div>
                </div>
                <div class="table_title_sub">
                    <div>
                        <div>팀명</div>
                        <div>경기</div>
                    </div>
                    <div>
                        <div>홈</div>
                        <div>원정</div>
                    </div>
                    <div>
                        <div>홈</div>
                        <div>원정</div>
                    </div>
                    <div>
                        <div>홈</div>
                        <div>원정</div>
                    </div>
                </div>
                <?php for($i=0; $i<2; $i++):?>
                <div class="<?php echo $basic_class[$i];?>">
                    <div class="bin">
                        <div class="bin"><?php echo $avr_com_arr[$i]['team_name'];?></div>
                        <div><?php echo $avr_com_arr[$i]['games'];?></div>
                    </div>
                    <?php for($n=0; $n<3; $n++):?>
                    <div class="bin">
                        <?php
                            $avr_point_per_h = str_replace('%','',$avr_com_arr[$i][$avr_com_key_h[$n]]);
                            $avr_point_per_a = str_replace('%','',$avr_com_arr[$i][$avr_com_key_a[$n]]);
                        ?>
                        <?php if($avr_point_per_h > $avr_point_per_a):?>
                            <div class="bin com_win"><?php echo $avr_com_arr[$i][$avr_com_key_h[$n]];?></div>
                        <?php else:?>
                            <div class="bin"><?php echo $avr_com_arr[$i][$avr_com_key_h[$n]];?></div>
                        <?php endif;?>
                        <?php if($avr_point_per_h < $avr_point_per_a):?>
                            <div class="com_win"><?php echo $avr_com_arr[$i][$avr_com_key_a[$n]];?></div>
                        <?php else:?>
                            <div><?php echo $avr_com_arr[$i][$avr_com_key_a[$n]];?></div>
                        <?php endif;?>
                    </div>
                    <?php endfor;?>
                </div>
                <?php endfor;?>
            </div>
        </div>
    </section>
    <section id="detail_score_stats">
        <div class="main_title">
            <div>스코어 분포 통계</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="stats_contents">
            <?php for($i=0; $i<2; $i++):?>
                <div style="border-top: 1px solid <?php echo $basic_team_color[$i];?>;">
                    <div class="main_sub_title">
                        <div style="border-top: 1px solid <?php echo $basic_team_color[$i]?>;"><?php echo $stats_arr[$i]['team_name'];?></div>
                    </div>
                    <div class="home_away_title">
                        <div>홈</div>
                        <div>원정</div>
                    </div>
                    <div class="table_title">
                        <?php for($v=0; $v<6; $v++):?>
                            <div><?php echo $stats_title[$v];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="contents_list">
                        <?php for($n=0; $n<$max_length; $n++):?>
                            <div class="content_<?php echo $n+1;?>">
                                <?php for($s=0; $s<2; $s++):?>
                                    <?php if(isset($stats_arr[$i][$stats_data_key[$s]][$n])):?>
                                        <?php if($n == 0):?>
                                            <div class="bin stats_score_top"><?php echo $stats_arr[$i][$stats_data_key[$s]][$n]['score'];?></div>
                                            <div class="bin stats_count_top"><?php echo $stats_arr[$i][$stats_data_key[$s]][$n]['count'];?></div>
                                        <?php else:?>
                                            <div class="bin"><?php echo $stats_arr[$i][$stats_data_key[$s]][$n]['score'];?></div>
                                            <div class="bin"><?php echo $stats_arr[$i][$stats_data_key[$s]][$n]['count'];?></div>
                                        <?php endif;?>
                                        <div>
                                            <div class="color_back">
                                                <div class="color_g" style="background-color: <?php echo $stats_graph_color[$s];?>; width: <?php echo $stats_arr[$i][$stats_data_key[$s]][$n]['percent'];?>%;"></div>
                                            </div>
                                        </div>
                                    <?php else:?>
                                        <div></div>
                                        <div></div>
                                        <div>
                                            <div></div>
                                        </div>
                                    <?php endif;?>
                                <?php endfor;?>
                            </div>
                        <?php endfor;?>
                    </div>
                </div>
            <?php endfor;?>
        </div>
    </section>
    <section id="first_score_loss">
        <h2 class="nonDisplay"><span><?php echo $first_h['home']['team_name'];?></span><span><?php echo $first_a['home']['team_name'];?></span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>선제 득점 / 선제 실점</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="basic_score_loss_total">
            <div class="total_detail">
                <div class="table_title">
                    <div>-</div>
                    <div>홈</div>
                    <div>원정</div>
                    <div>홈/원정 비율</div>
                </div>
            </div>
            <div class="table_title_sub">
                <div>팀명</div>
                <div>
                    <div>선제골</div>
                    <div>무득점</div>
                    <div>선실점</div>
                </div>
                <div>
                    <div>선제골</div>
                    <div>무득점</div>
                    <div>선실점</div>
                </div>
                <div>선제골%/무득점%/선실점%</div>
            </div>
            <?php for($i=0; $i<2; $i++):?>
                <div class="<?php echo $first_class[$i];?>">
                    <div class="bin"><?php echo $first_arr[$i]['home']['team_name'];?></div>
                    <?php for($n=0; $n<2; $n++):?>
                        <div>
                            <div class="bin"><?php echo $first_arr[$i][$first_key[$n]]['first_goal'];?></div>
                            <div class="bin"><?php echo $first_arr[$i][$first_key[$n]]['no_score'];?></div>
                            <div class="bin"><?php echo $first_arr[$i][$first_key[$n]]['first_lose'];?></div>
                        </div>
                    <?php endfor;?>
                    <div>
                        <div class="graph_bar">
                            <div class="win_goal_c tooltips" tooltip="The top of the element" tooltip-position="top" style="background-color: #6aa5c7; width: <?php echo $first_arr[$i]['percent']['per_first_goal'];?>%;"></div>
                            <div class="draw_goal_c tooltips" tooltip="The top of the element" tooltip-position="top" style="background-color: #ededed; width: <?php echo $first_arr[$i]['percent']['no_score'];?>%;"></div>
                            <div class="loss_goal_c tooltips" tooltip="The top of the element" tooltip-position="top" style="background-color: #ff5e3a; width: <?php echo $first_arr[$i]['percent']['per_first_lose'];?>%;"></div>
                        </div>
                    </div>
                </div>
            <?php endfor;?>
        </div>
        <div class="first_goal_time_table">
        <?php for($i=0; $i<2; $i++):?>
            <div class="box_<?php echo $i+1;?>">
                <div class="time_table_title">
                    <div><?php echo $time_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="table_box">
                    <div class="goal_time_table">
                        <div class="time_table_content">
                            <div class="table_title">
                                <?php for($x=0; $x<10; $x++):?>
                                    <div><?php echo $time_table_title[$x];?></div>
                                <?php endfor;?>
                            </div>
                            <?php for($s=0; $s<2; $s++):?>
                                <?php
                                    $time_data = $data['detail_page_1']['p1_3'][$time_d_key[$i]]['total'][$time_div_key[$s]];
                                    $first_half = $time_data['per_first_half'];
                                    $second_half = $time_data['per_second_half'];
                                ?>
                                <div class="<?php echo $time_content_class[$s];?>">
                                    <?php for($m=0; $m<8; $m++):?>
                                        <div class="bin"><?php echo $time_data[$time_content_arr[$i][$m]];?></div>
                                    <?php endfor;?>
                                    <?php if($i ==0):?>
                                        <div>
                                            <?php if($time_data['per_first_half'] > $time_data['per_second_half']):?>
                                                <div class="goal_time_up"><?php echo $time_data['per_first_half'];?>%</div>
                                                <div>
                                                    <div class="goal_time_up_graph" style="width: <?php echo $time_data['per_first_half'];?>%;"></div>
                                                </div>
                                            <?php elseif($time_data['per_first_half'] == $time_data['per_second_half']):?>
                                                <div class="goal_time_up"><?php echo $time_data['per_first_half'];?>%</div>
                                                <div>
                                                    <div class="goal_time_up_graph" style="width: <?php echo $time_data['per_first_half'];?>%;"></div>
                                                </div>
                                            <?php elseif($time_data['per_first_half'] < $time_data['per_second_half']):?>
                                                <div class="goal_time_down"><?php echo $time_data['per_first_half'];?>%</div>
                                                <div>
                                                    <div class="goal_time_down_graph" style="width: <?php echo $time_data['per_first_half'];?>%;"></div>
                                                </div>
                                            <?php endif;?>
                                        </div>
                                        <div>
                                            <?php if($time_data['per_first_half'] > $time_data['per_second_half']):?>
                                                <div>
                                                    <div class="goal_time_down_graph" style="width: <?php echo $time_data['per_second_half'];?>%;"></div>
                                                </div>
                                                <div class="goal_time_down"><?php echo $time_data['per_second_half'];?>%</div>
                                            <?php elseif($time_data['per_first_half'] == $time_data['per_second_half']):?>
                                                <div>
                                                    <div class="goal_time_up_graph" style="width: <?php echo $time_data['per_second_half'];?>%;"></div>
                                                </div>
                                                <div class="goal_time_up"><?php echo $time_data['per_second_half'];?>%</div>
                                            <?php elseif($time_data['per_first_half'] < $time_data['per_second_half']):?>
                                                <div>
                                                    <div class="goal_time_up_graph" style="width: <?php echo $time_data['per_second_half'];?>%;"></div>
                                                </div>
                                                <div class="goal_time_up"><?php echo $time_data['per_second_half'];?>%</div>
                                            <?php endif;?>
                                        </div>
                                    <?php else:?>
                                        <div>
                                            <?php if($time_data['per_first_half'] > $time_data['per_second_half']):?>
                                                <div class="loss_time_up"><?php echo $time_data['per_first_half'];?>%</div>
                                                <div>
                                                    <div class="loss_time_up_graph" style="width: <?php echo $time_data['per_first_half'];?>%;"></div>
                                                </div>
                                            <?php elseif($time_data['per_first_half'] == $time_data['per_second_half']):?>
                                                <div class="loss_time_up"><?php echo $time_data['per_first_half'];?>%</div>
                                                <div>
                                                    <div class="loss_time_up_graph" style="width: <?php echo $time_data['per_first_half'];?>%;"></div>
                                                </div>
                                            <?php elseif($time_data['per_first_half'] < $time_data['per_second_half']):?>
                                                <div class="loss_time_down"><?php echo $time_data['per_first_half'];?>%</div>
                                                <div>
                                                    <div class="loss_time_down_graph" style="width: <?php echo $time_data['per_first_half'];?>%;"></div>
                                                </div>
                                            <?php endif;?>
                                        </div>
                                        <div>
                                            <?php if($time_data['per_first_half'] > $time_data['per_second_half']):?>
                                                <div>
                                                    <div class="loss_time_down_graph" style="width: <?php echo $time_data['per_second_half'];?>%;"></div>
                                                </div>
                                                <div class="loss_time_down"><?php echo $time_data['per_second_half'];?>%</div>
                                            <?php elseif($time_data['per_first_half'] == $time_data['per_second_half']):?>
                                                <div>
                                                    <div class="loss_time_up_graph" style="width: <?php echo $time_data['per_second_half'];?>%;"></div>
                                                </div>
                                                <div class="loss_time_up"><?php echo $time_data['per_second_half'];?>%</div>
                                            <?php elseif($time_data['per_first_half'] < $time_data['per_second_half']):?>
                                                <div>
                                                    <div class="loss_time_up_graph" style="width: <?php echo $time_data['per_second_half'];?>%;"></div>
                                                </div>
                                                <div class="loss_time_up"><?php echo $time_data['per_second_half'];?>%</div>
                                            <?php endif;?>
                                        </div>
                                    <?php endif;?>
                                </div>
                            <?php endfor;?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endfor;?>
        </div>
        <div class="first_goal_game_result">
        <?php for($i=0; $i<2; $i++):?>
            <div class="box_<?php echo $i+1;?>">
                <div class="time_table_title">
                    <div><?php echo $result_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="table_box">
                    <div class="<?php echo $result_title_class[$i];?>">
                        <div class="time_table_content">
                            <div class="table_title">
                                <?php for($m=0; $m<8; $m++):?>
                                    <div><?php echo $result_table_arr[$i][$m];?></div>
                                <?php endfor;?>
                            </div>
                            <?php for($n=0; $n<2; $n++):?>
                                <?php
                                    $result_data = $data['detail_page_1']['p1_3'][$result_d_key[$i]]['total'][$time_div_key[$n]];
                                ?>
                                <div class="<?php echo $result_content_class[$n];?>">
                                    <?php for($s=0; $s<7; $s++):?>
                                        <?php if($s == 3):?>
                                            <div class="bin"><?php echo $result_data[$result_content_arr[$i][$s]];?>%</div>
                                        <?php else:?>
                                            <div class="bin"><?php echo $result_data[$result_content_arr[$i][$s]];?></div>
                                        <?php endif;?>
                                    <?php endfor;?>
                                    <div><span><?php echo $result_data['goal'];?></span> - <span><?php echo $result_data['lose'];?></span></div>
                                </div>
                            <?php endfor;?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endfor;?>
        </div>
    </section>
    <section id="lead_goal">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>리드골 득점 / 리드골 허용</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <?php for($i=0; $i<2; $i++):?>
            <div class="<?php echo $lead_class[$i];?>">
                <div class="lead_title">
                    <div><?php echo $lead_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="lead_content">
                    <div class="lead_sub_title">
                        <div>-</div>
                        <?php for($q=0; $q<2; $q++):?>
                            <div><?php echo $sub_title_arr[$i][$q];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="lead_content_title">
                        <?php for($q=0; $q<3; $q++):?>
                            <div>
                                <?php for($w=0; $w<2; $w++):?>
                                    <div><?php echo $lead_content_arr[$q][$w];?></div>
                                <?php endfor;?>
                            </div>
                        <?php endfor;?>
                    </div>
                    <?php for($s=0; $s<2; $s++):?>
                        <?php
                            $lead_data = $data['detail_page_1']['p1_4'][$lead_d_key[$i]]['total'][$lead_div_key[$s]];
                            $lead_d2_key = ['lead_goal_cnt','lead_permit_cnt'];
                            $lead_d2_key1 = ['lead_goal_avg','lead_permit_avg'];
                            $lead_d2_key2 = ['lead_goal_per','lead_permit_per'];
                            $lead_d2_key3 = ['tie_permit_cnt','tie_goal_cnt'];
                            $lead_d2_key4 = ['tie_permit_avg','tie_goal_avg'];
                            $lead_d2_key5 = ['tie_permit_per','tie_goal_per'];
                        ?>
                        <div class="<?php echo $lead_content_class[$s];?>">
                            <div>
                                <div class="bin"><?php echo $lead_data['team_name'];?></div>
                                <div><?php echo $lead_data['games'];?></div>
                            </div>
                            <div>
                                <div class="bin"><?php echo $lead_data[$lead_d2_key[$i]];?></div>
                                <div>
                                    <div><?php echo $lead_data[$lead_d2_key1[$i]];?></div>
                                    <div>
                                        <div style="background-color: <?php echo $lead_team_c[$i];?>; width: <?php echo $lead_data[$lead_d2_key2[$i]];?>%;"></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="bin"><?php echo $lead_data[$lead_d2_key3[$i]];?></div>
                                <div>
                                    <div><?php echo $lead_data[$lead_d2_key4[$i]];?></div>
                                    <div><?php echo $lead_data[$lead_d2_key5[$i]];?>%</div>
                                    <div>
                                        <div style="background-color: #ededed; width: <?php echo $lead_data[$lead_d2_key5[$i]];?>%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endfor;?>
                </div>
            </div>
        <?php endfor;?>
    </section>
    <section id="goal_type_statistics">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>골 유형 통계</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="goal_type_result">
            <div class="type_title">
                <div>선제 득점 비율 및 승무패 결과</div>
                <div class="filter_button">
                    <div class="all_game time_selected">전체</div>
                    <div class="home_game">홈</div>
                    <div class="away_game">원정</div>
                </div>
            </div>
            <div class="type_content">
                <div class="type_sub_title">
                    <div>-</div>
                    <div>득점 유형</div>
                    <div>실점 유형</div>
                </div>
                <div class="type_content_title">
                    <div><div>팀명</div><div>경기</div></div>
                    <div><div>동점골</div><div>리드골</div><div>기타</div></div>
                    <div><div>동점골 허용</div><div>리드골 허용</div><div>기타골 허용</div></div>
                </div>
                <?php for($i=0; $i<2; $i++):?>
                    <div class="<?php echo $basic_class[$i];?>">
                        <div>
                            <div class="bin"><?php echo $type_arr[$i]['team_name'];?></div>
                            <div><?php echo $type_arr[$i]['games'];?></div>
                        </div>
                        <?php for($n=0; $n<2; $n++):?>
                            <div>
                                <div>
                                    <div class="bin"><?php echo $type_arr[$i][$type_tie_cnt[$n]];?></div>
                                    <div class="bin"><?php echo $type_arr[$i][$type_tie_per[$n]];?>%</div>
                                </div>
                                <div>
                                    <div class="bin"><?php echo $type_arr[$i][$type_lead_cnt[$n]];?></div>
                                    <div class="bin"><?php echo $type_arr[$i][$type_lead_per[$n]];?>%</div>
                                </div>
                                <div>
                                    <div class="bin"><?php echo $type_arr[$i][$type_other_cnt[$n]];?></div>
                                    <div><?php echo $type_arr[$i][$type_other_per[$n]];?>%</div>
                                </div>
                            </div>
                        <?php endfor;?>
                    </div>
                <?php endfor;?>
            </div>
        </div>
    </section>
    
    <!-----------2페이지 --------------->
    
    <section id="no_goal_no_point">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>무득점/무실점</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <?php for($i=0; $i<2; $i++):?>
                <div class="<?php echo $no_title_class[$i];?>">
                    <div class="small_title"><?php echo $no_small_title[$i];?></div>
                    <div class="table_content">
                        <div class="table_title">
                            <?php for($z=0; $z<4; $z++):?>
                                <div><?php echo $no_table_title[$z];?></div>
                            <?php endfor;?>
                        </div>
                        <div class="table_title_sub">
                            <div>
                                <div>팀명</div>
                            </div>
                            <?php for($c=0; $c<3; $c++):?>
                                <div>
                                    <?php for($v=0; $v<3; $v++):?>
                                        <div><?php echo $no_title_sub[$v];?></div>
                                    <?php endfor;?>
                                </div>
                            <?php endfor;?>
                        </div>
                        <?php for($n=0; $n<2; $n++):?>
                            <div class="<?php echo $no_home_away[$n];?>">
                                <?php
                                    $no_fix_h = $data['detail_page_2']['p2_1'][$no_d_arr[$i]]['div_home']['total'];
                                    $no_fix_a = $data['detail_page_2']['p2_1'][$no_d_arr[$i]]['div_away']['total'];
                                    $no_fic_arr = [$no_fix_h,$no_fix_a];
                                ?>
                                <div class="bin"><?php echo $no_fic_arr[$n]['team_name'];?></div>
                                <?php for($m=0; $m<3; $m++):?>
                                    <?php
                                        $no_h = $data['detail_page_2']['p2_1'][$no_d_arr[$i]]['div_home'][$no_t_arr[$m]];
                                        $no_a = $data['detail_page_2']['p2_1'][$no_d_arr[$i]]['div_away'][$no_t_arr[$m]];
                                        $no_arr = [$no_h,$no_a];
                                    ?>
                                    <div>
                                        <div class="bin"><?php echo $no_arr[$n]['games'];?></div>
                                        <div class="bin"><?php echo $no_arr[$n][$no_goal_key[$i]];?></div>
                                        <div class="bin">
                                            <div>
                                                <div class="graph_bar">
                                                    <div style="background-color: <?php echo $basic_team_color[$n];?>; width: <?php echo $no_arr[$n][$no_per_key[$i]];?>%;"></div>
                                                </div>
                                            </div>
                                            <div><?php echo $no_arr[$n][$no_per_key[$i]];?>%</div>
                                        </div>
                                    </div>
                                <?php endfor;?>
                            </div>
                        <?php endfor;?>
                    </div>
                </div>
            <?php endfor;?>

            <?php for($i=0; $i<2; $i++):?>
                <div class="<?php echo $all_title_class[$i];?>">
                    <div class="small_title"><?php echo $all_small_title[$i];?></div>
                    <div class="table_content">
                        <div class="table_title">
                            <?php for($z=0; $z<4; $z++):?>
                                <div><?php echo $no_table_title[$z];?></div>
                            <?php endfor;?>
                        </div>
                        <div class="table_title_sub">
                            <div>
                                <div>팀명</div>
                            </div>
                            <?php for($c=0; $c<3; $c++):?>
                                <div>
                                    <?php for($v=0; $v<3; $v++):?>
                                        <div><?php echo $no_title_sub[$v];?></div>
                                    <?php endfor;?>
                                </div>
                            <?php endfor;?>
                        </div>
                        <?php for($n=0; $n<2; $n++):?>
                            <div class="<?php echo $no_home_away[$n];?>">
                                <?php
                                    $all_fix_h = $data['detail_page_2']['p2_1'][$all_d_arr[$i]]['div_home']['total'];
                                    $all_fix_a = $data['detail_page_2']['p2_1'][$all_d_arr[$i]]['div_away']['total'];
                                    $all_fic_arr = [$all_fix_h,$all_fix_a];
                                ?>
                                <div class="bin"><?php echo $all_fic_arr[$n]['team_name'];?></div>
                                <?php for($m=0; $m<3; $m++):?>
                                    <?php
                                        $all_h = $data['detail_page_2']['p2_1'][$all_d_arr[$i]]['div_home'][$no_t_arr[$m]];
                                        $all_a = $data['detail_page_2']['p2_1'][$all_d_arr[$i]]['div_away'][$no_t_arr[$m]];
                                        $all_arr = [$all_h,$all_a];
                                    ?>
                                    <div>
                                        <div class="bin"><?php echo $all_arr[$n][$all_game_key[$i]];?></div>
                                        <div class="bin"><?php echo $all_arr[$n][$all_goal_key[$i]];?></div>
                                        <div class="bin">
                                            <div>
                                                <div class="graph_bar">
                                                    <div style="background-color: <?php echo $basic_team_color[$n];?>; width: <?php echo $all_arr[$n][$all_per_key[$i]];?>%;"></div>
                                                </div>
                                            </div>
                                            <div><?php echo $all_arr[$n][$all_per_key[$i]];?>%</div>
                                        </div>
                                    </div>
                                <?php endfor;?>
                            </div>
                        <?php endfor;?>
                    </div>
                </div>
            <?php endfor;?>
        </div>
    </section>
    <section id="first_performance">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>전반 경기력</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="content_container">
            <?php for($i=0; $i<2; $i++):?>
                <div>
                    <div class="content_title">
                        <div><?php echo $perfor_title[$i];?></div>
                        <div class="filter_button">
                            <div class="all_game time_selected">전체</div>
                            <div class="home_game">홈</div>
                            <div class="away_game">원정</div>
                        </div>
                    </div>
                    <div class="content_box">
                        <div class="content_sub_title">
                            <?php for($c=0; $c<10; $c++):?>
                                <div><?php echo $perfor_sub_title[$c];?></div>
                            <?php endfor;?>
                        </div>
                        <div class="content_result">
                            <?php for($n=0; $n<2; $n++):?>
                                <?php
                                $per_data = $data['detail_page_2']['p2_2'][$lead_d_key[$i]]['total'][$lead_div_key[$n]];
                                ?>
                                <div class="<?php echo $basic_class[$n];?>">
                                    <?php for($s=0; $s<10; $s++):?>
                                        <?php if($s == 3):?>
                                            <div class="bin"><?php echo $per_data[$per_key_arr[$i][$s]];?>%</div>
                                        <?php elseif($s == 7):?>
                                            <div class="bin"><?php echo $per_data[$per_key_arr[$i][$s]];?> - <?php echo $per_data['lose'];?></div>
                                        <?php elseif($s == 9):?>
                                            <div><?php echo $per_data[$per_key_arr[$i][$s]];?></div>
                                        <?php else:?>
                                            <div class="bin"><?php echo $per_data[$per_key_arr[$i][$s]];?></div>
                                        <?php endif;?>
                                    <?php endfor;?>
                                </div>
                            <?php endfor;?>
                        </div>
                    </div>
                </div>
            <?php endfor;?>
        </div>
    </section>
    <section id="goal_loss_time">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>득점/실점 시간</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="content_container">
            <div>
                <div class="content_title">
                    <div>전반 / 후반 득점 비율</div>
                </div>
                    <?php for($i=0; $i<2; $i++):?>
                        <?php
                            $goal_data = $data['detail_page_2']['p2_3']['d1'][$time_div_key[$i]];
                        ?>
                        <div class="goal_loss_per_time" style="border-top: 1px solid <?php echo $basic_team_color[$i];?>;">
                            <div class="main_sub_title">
                                <div style="border-top: 1px solid <?php echo $basic_team_color[$i];?>;"><?php echo $goal_data['team_name'];?></div>
                            </div>
                            <div class="table_title">
                                <?php for($a=0; $a<4; $a++):?>
                                    <div><?php echo $goal_title[$a];?></div>
                                <?php endfor;?>
                            </div>
                            <div class="home_content">
                                <?php for($b=0; $b<4; $b++):?>
                                    <?php if($b == 1):?>
                                        <?php if($goal_data['first_half'] > $goal_data['second_half']):?>
                                            <div class="f_bold"><?php echo $goal_data[$goal_key[$b]];?>%</div>
                                        <?php else:?>
                                            <div><?php echo $goal_data[$goal_key[$b]];?>%</div>
                                        <?php endif;?>
                                    <?php elseif($b == 2):?>
                                        <?php if($goal_data['first_half'] < $goal_data['second_half']):?>
                                            <div class="f_bold"><?php echo $goal_data[$goal_key[$b]];?>%</div>
                                        <?php else:?>
                                            <div><?php echo $goal_data[$goal_key[$b]];?>%</div>
                                        <?php endif;?>
                                    <?php else:?>
                                        <div><?php echo $goal_data[$goal_key[$b]];?></div>
                                    <?php endif;?>
                                <?php endfor;?>
                            </div>
                        </div>
                    <?php endfor;?>
            </div>
            <div>
                <div class="content_title">
                    <div>경기 평균 시간 통계</div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <div class="content_sub_title">
                        <?php for($p=0; $p<6; $p++):?>
                        <div><?php echo $avg_title[$p];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="content_result">
                        <?php for($i=0; $i<2; $i++):?>
                        <?php
                        $avg_data = $data['detail_page_2']['p2_3']['d2']['total'][$time_div_key[$i]];
                        ?>
                        <div class="<?php echo $basic_class[$i];?>">
                            <?php for($s=0; $s<5; $s++):?>
                            <div class="bin"><?php echo $avg_data[$avg_key[$s]];?></div>
                            <?php endfor;?>
                            <div>
                                <div>
                                    <div class="tooltips" tooltip="The top of the element" tooltip-position="top" style="background-color: #6aa5c7; width:<?php echo $avg_data['time_W_per'];?>%;"></div>
                                    <div class="tooltips" tooltip="The top of the element" tooltip-position="top" style="background-color: #ededed; width:<?php echo $avg_data['time_D_per'];?>%;"></div>
                                    <div class="tooltips" tooltip="The top of the element" tooltip-position="top" style="background-color: #ff5e3a; width:<?php echo $avg_data['time_L_per'];?>%;"></div>
                                </div>
                            </div>
                        </div>
                        <?php endfor;?>
                    </div>
                </div>
            </div>
            <?php for($i=0; $i<2; $i++):?>
            <div>
                <div class="content_title">
                    <div><?php echo $goal_15_main_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <div class="content_sub_title">
                        <?php for($z=0; $z<10; $z++):?>
                        <div><?php echo $goal_15_title[$z];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="content_result">
                        <div class="home_away">
                            <?php for($n=0; $n<2; $n++):?>
                            <?php
                            $goal_15_data = $data['detail_page_2']['p2_3'][$all_d_arr[$i]]['total'][$time_div_key[$n]];
                            ?>
                            <div class="<?php echo $basic_class[$n];?>">
                                <?php for($y=0; $y<9; $y++):?>
                                    <?php if($y == 0 || $y == 8):?>
                                    <div><?php echo $goal_15_data[$goal_15_key[$y]];?></div>
                                    <?php else:?>
                                    <div class="bin2"><?php echo $goal_15_data[$goal_15_key[$y]];?></div>
                                    <?php endif;?>
                                <?php endfor;?>
                            </div>
                            <?php endfor;?>
                        </div>
                        <div class="content_graph">
                            <div style="width: 294px; height:114px;">
                                <canvas id="<?php echo $goal_15_id[$i];?>"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php endfor;?>
            <?php for($i=0; $i<2; $i++):?>
            <div>
                <div class="content_title">
                    <div><?php echo $goal_10_main_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <div class="content_sub_title">
                        <?php for($z=0; $z<13; $z++):?>
                            <div><?php echo $goal_10_title[$z];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="content_result">
                        <div class="home_away">
                            <?php for($n=0; $n<2; $n++):?>
                            <?php
                            $goal_10_data = $data['detail_page_2']['p2_3'][$goal_d_arr[$i]]['total'][$time_div_key[$n]];
                            ?>
                            <div class="<?php echo $basic_class[$n];?>">
                                <?php for($y=0; $y<12; $y++):?>
                                    <?php if($y == 0 || $y == 11):?>
                                        <div><?php echo $goal_10_data[$goal_10_key[$y]];?></div>
                                    <?php else:?>
                                        <div class="bin2"><?php echo $goal_10_data[$goal_10_key[$y]];?></div>
                                    <?php endif;?>
                                <?php endfor;?>
                            </div>
                            <?php endfor;?>
                        </div>
                        <div class="content_graph">
                            <div style="width: 284px; height:114px;">
                                <canvas id="<?php echo $goal_10_id[$i];?>"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php endfor;?>
        </div>
    </section>
    <!-----------2페이지 끝--------------->


    <!-----------3페이지 시작-------------->

    <section id="avg_goal_loss">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>평균 득실점</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <div>
                <div class="content_title">
                    <div>평균 득점/실점</div>
                </div>
                <div class="table_content">
                    <div class="table_title">
                        <?php for($m=0; $m<4; $m++):?>
                        <div><?php echo $avg_table_title[$m];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="table_title_sub">
                        <div><div>팀명</div></div>
                        <?php for($l=0; $l<3; $l++):?>
                        <div>
                            <?php for($k=0; $k<3; $k++):?>
                            <div><?php echo $avg_table_title_sub[$k];?></div>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                    <?php for($n=0; $n<2; $n++):?>
                    <div class="<?php echo $basic_class[$n];?>">
                        <div class="bin"><?php echo $avg_goal_loss_arr[$n]['total']['team_name'];?></div>
                        <?php for($s=0; $s<3; $s++):?>
                        <div>
                            <?php for($h=0; $h<3; $h++):?>
                            <div class="bin"><?php echo $avg_goal_loss_arr[$n][$avg_data_div_key[$s]][$avg_goal_loss_key[$h]];?></div>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                    <?php endfor;?>
                </div>
            </div>
            <?php for($i=0; $i<2; $i++):?>
            <div>
                <div class="content_title">
                    <div>구간별 평균 득점 / 실점</div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <?php if($i === 1):?>
                    <div class="sub_title_main">전체경기</div>
                    <?php endif;?>
                    <div class="sub_title_container">
                        <div>
                            <div>득점</div>
                            <div>
                                <?php for($a=0; $a<6; $a++):?>
                                <div><?php echo $section_sub_title_h_arr[$i][$a];?></div>
                                <?php endfor;?>
                            </div>
                        </div>
                        <div>팀명</div>
                        <div>
                            <div>실점</div>
                            <div>
                                <?php for($a=0; $a<6; $a++):?>
                                <div><?php echo $section_sub_title_a_arr[$i][$a];?></div>
                                <?php endfor;?>
                            </div>
                        </div>
                    </div>
                    <div class="content_result">
                        <?php for($n=0; $n<2; $n++):?>
                            <?php
                            $section_h = $data['detail_page_3']['p3_1'][$time_d_key[$i]]['total'][$time_div_key[$n]];
                            $section_a = $data['detail_page_3']['p3_1'][$time_d_key[$i]]['total']['div_away'];
                            $section_arr = [$section_h,$section_a];
                            ?>
                        <div class="<?php echo $basic_class[$n];?>">
                            <?php for($v=0; $v<13; $v++):?>
                            <div class="bin"><?php echo $section_h[$section_key_arr[$i][$v]];?></div>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                </div>
            </div>
            <?php endfor;?>
        </div>
    </section>
    <?php if($avg_relative_h['team_name'] !== null):?>
    <section id="avg_relative_record">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>평균 득실점 상대전적</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <div>
                <div class="content_title">
                    <div>득점/실점 상대전적</div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <div class="sub_title_team">
                        <div><?php echo $avg_relative_h['team_name'];?></div>
                        <div><?php echo $avg_relative_a['team_name'];?></div>
                    </div>
                    <div class="content_result">
                        <div class="all_content">
                            <?php for($i=0; $i<3; $i++):?>
                            <?php
                            $relative_home = $avg_relative_h[$avg_relative_key[$i]];
                            $relative_away = $avg_relative_a[$avg_relative_key[$i]];
                            $relative_total = $relative_home + $relative_away;
                            if($relative_home !== 0 && $relative_total !== 0) {
                                $relative_home_per = ($relative_home / $relative_total) * 100;
                                $relative_away_per = ($relative_away / $relative_total) * 100;
                            }else {
                                $relative_home_per = 0;
                                $relative_away_per = 0;
                            }
                            ?>
                            <div>
                                <div>
                                    <div class="color_back">
                                        <?php if($relative_home > $relative_away):?>
                                        <div class="color_g" style="background-color: #517dc9; width: <?php echo $relative_home_per;?>%;"></div>
                                        <?php elseif($relative_home == $relative_away):?>
                                        <div class="color_g" style="background-color: #517dc9; width: <?php echo $relative_home_per;?>%;"></div>
                                        <?php else:?>
                                        <div class="color_g" style="width: <?php echo $relative_home_per;?>%;"></div>
                                        <?php endif;?>
                                    </div>
                                </div>
                                <div class="bin"><span><?php echo $relative_home;?></span></div>
                                <div class="bin"><span><?php echo $avg_relative_content[$i];?></span></div>
                                <div><span><?php echo $relative_away;?></span></div>
                                <div>
                                    <div class="color_back">
                                        <?php if($relative_home < $relative_away):?>
                                        <div class="color_g" style="background-color: #ffd46e; width: <?php echo $relative_away_per;?>%;"></div>
                                        <?php elseif($relative_home == $relative_away):?>
                                        <div class="color_g" style="background-color: #ffd46e; width: <?php echo $relative_away_per;?>%;"></div>
                                        <?php else:?>
                                        <div class="color_g" style="width: <?php echo $relative_away_per;?>%;"></div>
                                        <?php endif;?>
                                    </div>
                                </div>
                            </div>
                            <?php endfor;?>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div class="content_title">
                    <div>구간별 평균 득점/실점 상대전적</div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <div class="sub_title_container">
                        <div>
                            <div>득점</div>
                            <div>
                                <?php for($a=0; $a<6; $a++):?>
                                <div><?php echo $avg_relative_sec_title_h[$a];?></div>
                                <?php endfor;?>
                            </div>
                        </div>
                        <div>팀명</div>
                        <div>
                            <div>실점</div>
                            <div>
                                <?php for($a=0; $a<6; $a++):?>
                                <div><?php echo $avg_relative_sec_title_a[$a];?></div>
                                <?php endfor;?>
                            </div>
                        </div>
                    </div>
                    <div class="content_result">
                        <?php for($i=0; $i<2; $i++):?>
                        <div class="<?php echo $basic_class[$i];?>">
                            <?php for($n=0; $n<13; $n++):?>
                            <div class="bin"><?php echo $avg_sec_arr[$i][$avg_sec_key[$n]];?></div>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php endif;?>
    <?php if($data['detail_page_3']['p3_3']['d2']['total']['div_home']['team_name'] !== null):?>
    <section id="goal_loss_margin">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>득실점 마진</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <?php for($i=0; $i<2; $i++):?>
            <div>
                <div class="content_title">
                    <div><?php echo $margin_main_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="table_content">
                    <div class="table_title">
                        <?php for($v=0; $v<4; $v++):?>
                        <div><?php echo $margin_content_title[$v];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="table_title_sub">
                        <div>
                            <div>팀명</div>
                        </div>
                        <div>
                            <?php for($v=0; $v<4; $v++):?>
                            <div><?php echo $margin_sub_title[$v];?></div>
                            <?php endfor;?>
                        </div>
                        <div>
                            <?php for($v=0; $v<3; $v++):?>
                            <div><?php echo $margin_sub_title1[$v];?></div>
                            <?php endfor;?>
                        </div>
                        <div>
                            <?php for($v=0; $v<4; $v++):?>
                            <div><?php echo $margin_sub_title[$v];?></div>
                            <?php endfor;?>
                        </div>
                    </div>
                    <?php for($n=0; $n<2; $n++):?>
                    <?php
                    $margin_h = $data['detail_page_3']['p3_3'][$lead_d_key[$i]]['total']['div_home'];
                    $margin_a = $data['detail_page_3']['p3_3'][$lead_d_key[$i]]['total']['div_away'];
                    $margin_arr = [$margin_h,$margin_a];
                    ?>
                    <div class="<?php echo $basic_class[$n];?>">
                        <div class="bin"><?php echo $margin_arr[$n]['team_name'];?></div>
                        <div>
                            <div class="bin"><?php echo $margin_arr[$n]['goal_diff_1'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['goal_diff_2'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['goal_diff_3'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['goal_diff_4_over'];?></div>
                        </div>
                        <div>
                            <div class="bin"><?php echo $margin_arr[$n]['W'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['D'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['L'];?></div>
                        </div>
                        <div>
                            <div class="bin"><?php echo $margin_arr[$n]['lose_diff_1'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['lose_diff_2'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['lose_diff_3'];?></div>
                            <div class="bin"><?php echo $margin_arr[$n]['lose_diff_4_over'];?></div>
                        </div>
                    </div>
                    <?php endfor;?>
                </div>
            </div>

            <?php endfor;?>
        </div>
    </section>
    <?php endif;?>
    <section id="latest_trend">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>최근 추세</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <div>
                <div class="content_title">
                    <div>평균 승점 최근 추세</div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="table_content">
                    <div class="table_title">
                        <div>-</div>
                        <div>평균 승점</div>
                    </div>
                    <div class="table_title_sub">
                        <?php for($c=0; $c<2; $c++):?>
                        <div>
                            <?php for($v=0; $v<3; $v++):?>
                            <div><?php echo $trend_point_sub_arr[$c][$v];?></div>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                    <?php for($i=0; $i<2; $i++):?>
                    <div class="<?php echo $basic_class[$i];?>">
                        <div>
                            <div class="bin"><?php echo $trend_point_arr[$i]['team_name'];?></div>
                            <div class="bin"><?php echo $trend_point_arr[$i]['games'];?></div>
                            <div class="bin"><?php echo $trend_point_arr[$i]['point'];?></div>
                        </div>
                        <div>
                            <div class="bin"><?php echo $trend_point_arr[$i]['point_avg_recent'];?></div>
                            <div class="bin"><?php echo $trend_point_arr[$i]['point_avg'];?></div>
                            <div>
                                <?php if($trend_point_arr[$i]['point_avg_diff'] > 0):?>
                                <div class="minus">
                                    <div class="m_color"></div>
                                </div>
                                <?php elseif($trend_point_arr[$i]['point_avg_diff'] < 0):?>
                                <div class="minus">
                                    <div class="m_color" style="background-color: #6aa5c7; width: <?php echo $trend_point_per_arr[$i];?>%;"></div>
                                </div>
                                <?php endif;?>
                                <?php if($trend_point_arr[$i]['point_avg_diff'] > 0):?>
                                <div>+<?php echo $trend_point_arr[$i]['point_avg_diff'];?></div>
                                <?php elseif($trend_point_arr[$i]['point_avg_diff'] < 0):?>
                                <div><?php echo $trend_point_arr[$i]['point_avg_diff'];?></div>
                                <?php endif;?>
                                <?php if($trend_point_arr[$i]['point_avg_diff'] > 0):?>
                                <div class="plus">
                                    <div class="p_color" style="background-color: #ff5e3a; width: <?php echo $trend_point_per_arr[$i];?>%;"></div>
                                </div>
                                <?php elseif($trend_point_arr[$i]['point_avg_diff'] < 0):?>
                                <div class="plus">
                                    <div class="p_color"></div>
                                </div>
                                <?php endif;?>
                            </div>
                        </div>
                    </div>
                    <?php endfor;?>
                </div>
            </div>
            <div>
                <div class="content_title">
                    <div>평균 점유율 최근 추세</div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="table_content">
                    <div class="table_title">
                        <div>-</div>
                        <div>평균 점유율</div>
                    </div>
                    <div class="table_title_sub">
                        <div>
                            <div>팀명</div>
                            <div>전체경기</div>
                        </div>
                        <div>
                            <?php for($c=0; $c<3; $c++):?>
                            <div><?php echo $trend_share_sub_title1[$c];?></div>
                            <?php endfor;?>
                        </div>
                    </div>
                    <?php for($i=0; $i<2; $i++):?>
                    <div class="<?php echo $basic_class[$i];?>">
                        <div>
                            <div class="bin"><?php echo $trend_share_arr[$i]['team_name'];?></div>
                            <div class="bin"><?php echo $trend_share_arr[$i]['games'];?></div>
                        </div>
                        <div>
                            <div class="bin"><?php echo $trend_share_arr[$i]['possession_avg_recent'];?>%</div>
                            <div class="bin"><?php echo $trend_share_arr[$i]['possession_avg'];?>%</div>
                            <div>
                                <?php if($trend_share_arr[$i]['possession_avg_diff'] > 0):?>
                                <div class="minus">
                                    <div class="m_color"></div>
                                </div>
                                <?php elseif($trend_share_arr[$i]['possession_avg_diff'] < 0):?>
                                <div class="minus">
                                    <div class="m_color" style="background-color: #6aa5c7; width: <?php echo $trend_share_per_arr[$i];?>%;"></div>
                                </div>
                                <?php endif;?>
                                <?php if($trend_share_arr[$i]['possession_avg_diff'] > 0):?>
                                <div>+<?php echo $trend_share_arr[$i]['possession_avg_diff'];?></div>
                                <?php elseif($trend_share_arr[$i]['possession_avg_diff'] < 0):?>
                                <div><?php echo $trend_share_arr[$i]['possession_avg_diff'];?></div>
                                <?php endif;?>
                                <?php if($trend_share_arr[$i]['possession_avg_diff'] > 0):?>
                                <div class="plus">
                                    <div class="p_color" style="background-color: #ff5e3a; width: <?php echo $trend_share_per_arr[$i];?>%;"></div>
                                </div>
                                <?php elseif($trend_share_arr[$i]['possession_avg_diff'] < 0):?>
                                <div class="plus">
                                    <div class="p_color"></div>
                                </div>
                                <?php endif;?>
                            </div>
                        </div>
                    </div>
                    <?php endfor;?>
                </div>
            </div>
            <?php for($i=0; $i<2; $i++):?>
            <div>
                <div class="content_title">
                    <div><?php echo $trend_four_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="table_content">
                    <div class="table_title">
                        <?php for($a=0; $a<3; $a++):?>
                        <div><?php echo $trend_sour_table_arr[$i][$a];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="table_title_sub">
                        <div>
                            <div>팀명</div>
                            <div>전체경기</div>
                        </div>
                        <?php for($c=0; $c<2; $c++):?>
                        <div>
                            <?php for($x=0; $x<3; $x++):?>
                            <div><?php echo $trend_four_sub_title1[$x];?></div>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                    <?php for($n=0; $n<2; $n++):?>
                    <?php
                    $trend_four = $data['detail_page_3']['p3_4'][$all_d_arr[$i]]['total'][$time_div_key[$n]];
                    ?>
                    <div class="<?php echo $basic_class[$n];?>">
                        <div>
                            <div class="bin"><?php echo $trend_four['team_name'];?></div>
                            <div class="bin"><?php echo $trend_four['games'];?></div>
                        </div>
                        <div>
                            <div class="bin"><?php echo $trend_four[$trend_key_f[$i]];?></div>
                            <div class="bin"><?php echo $trend_four[$trend_key_f_1[$i]];?></div>
                            <div class="bin">
                                <?php if($trend_four[$trend_key_f_2[$i]] > 0):?>
                                <div class="minus"><div class="m_color"></div></div>
                                <?php elseif($trend_four[$trend_key_f_2[$i]] < 0):?>
                                <div class="minus">
                                    <div class="m_color" style="background-color: #6aa5c7; width: <?php echo $trend_four[$trend_per_key[$i]];?>%;"></div>
                                </div>
                                <?php endif;?>
                                <?php if($trend_four[$trend_key_f_2[$i]] > 0):?>
                                <div>+<?php echo $trend_four[$trend_key_f_2[$i]];?></div>
                                <?php elseif($trend_four[$trend_key_f_2[$i]] <= 0):?>
                                <div><?php echo $trend_four[$trend_key_f_2[$i]];?></div>
                                <?php endif;?>
                                <?php if($trend_four[$trend_key_f_2[$i]] > 0):?>
                                <div class="plus">
                                    <div class="p_color" style="background-color: #ff5e3a; width: <?php echo $trend_four[$trend_per_key[$i]];?>%;"></div>
                                </div>
                                <?php elseif($trend_four[$trend_key_f_2[$i]] < 0):?>
                                <div class="plus"><div class="p_color"></div></div>
                                <?php endif;?>
                            </div>
                        </div>
                        <div>
                            <div class="bin"><?php echo $trend_four[$trend_key_s[$i]];?></div>
                            <div class="bin"><?php echo $trend_four[$trend_key_s_1[$i]];?></div>
                            <div class="bin">
                                <?php if($trend_four[$trend_key_s_2[$i]] > 0):?>
                                <div class="minus"><div class="m_color"></div></div>
                                <?php elseif($trend_four[$trend_key_s_2[$i]] < 0):?>
                                <div class="minus">
                                    <div class="m_color" style="background-color: #6aa5c7; width: <?php echo $trend_four[$trend_per_key1[$i]];?>%;"></div>
                                </div>
                                <?php endif;?>
                                <?php if($trend_four[$trend_key_s_2[$i]] > 0):?>
                                <div>+<?php echo $trend_four[$trend_key_s_2[$i]];?></div>
                                <?php elseif($trend_four[$trend_key_f_2[$i]] <= 0):?>
                                <div><?php echo $trend_four[$trend_key_s_2[$i]];?></div>
                                <?php endif;?>
                                <?php if($trend_four[$trend_key_s_2[$i]] > 0):?>
                                <div class="plus">
                                    <div class="p_color" style="background-color: #ff5e3a; width: <?php echo $trend_four[$trend_per_key1[$i]];?>%;"></div>
                                </div>
                                <?php elseif($trend_four[$trend_key_s_2[$i]] < 0):?>
                                <div class="plus"><div class="p_color"></div></div>
                                <?php endif;?>
                            </div>
                        </div>
                    </div>
                    <?php endfor;?>
                </div>
            </div>
            <?php endfor;?>
        </div>
    </section>
    <section id="goalkeeper_record">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>골키퍼 성적</div>
            <div>양팀의 최근 5경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <div>
                <div class="content_title">
                    <div>평균 성적 비교</div>
                </div>
                <div class="content_box">
                    <div class="team_title">
                        <div style="border-top: 1px solid #517dc9;"><?php echo $keeper_h['team_name'];?></div>
                        <div style="border-top: 1px solid #ffd46e;"><?php echo $keeper_a['team_name'];?></div>
                    </div>
                    <div class="second_sub_title">
                        <div>평균</div>
                        <div>구분</div>
                        <div>평균</div>
                    </div>
                    <div class="keeper_content">
                        <?php for($i=0; $i<3; $i++):?>
                        <div>
                            <div>
                                <div class="color_back">
                                    <?php if($i == 0):?>
                                    <?php if($keeper_h[$keeper_key[$i]] <= $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="background-color: #517dc9; width: <?php echo $keeper_h_per_arr[$i];?>%;"></div>
                                    <?php elseif($keeper_h[$keeper_key[$i]] > $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="width: <?php echo $keeper_h_per_arr[$i];?>%;"></div>
                                    <?php endif;?>
                                    <?php else:?>
                                    <?php if($keeper_h[$keeper_key[$i]] >= $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="background-color: #517dc9; width: <?php echo $keeper_h_per_arr[$i];?>%;"></div>
                                    <?php elseif($keeper_h[$keeper_key[$i]] < $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="width: <?php echo $keeper_h_per_arr[$i];?>%;"></div>
                                    <?php endif;?>
                                    <?php endif;?>
                                </div>
                            </div>
                            <div class="bin">
                                <span><?php echo $keeper_h[$keeper_key[$i]];?></span>
                            </div>
                            <div class="bin">
                                <span><?php echo $keeper_content[$i];?></span>
                            </div>
                            <div>
                                <span><?php echo $keeper_a[$keeper_key[$i]];?></span>
                            </div>
                            <div>
                                <div class="color_back">
                                    <?php if($i == 0):?>
                                    <?php if($keeper_h[$keeper_key[$i]] >= $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="background-color: #ffd46e; width: <?php echo $keeper_a_per_arr[$i];?>%;"></div>
                                    <?php elseif($keeper_h[$keeper_key[$i]] < $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="width: <?php echo $keeper_a_per_arr[$i];?>%;"></div>
                                    <?php endif;?>
                                    <?php else:?>
                                    <?php if($keeper_h[$keeper_key[$i]] <= $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="background-color: #ffd46e; width: <?php echo $keeper_a_per_arr[$i];?>%;"></div>
                                    <?php elseif($keeper_h[$keeper_key[$i]] > $keeper_a[$keeper_key[$i]]):?>
                                    <div class="color_g" style="width: <?php echo $keeper_a_per_arr[$i];?>%;"></div>
                                    <?php endif;?>
                                    <?php endif;?>
                                </div>
                            </div>
                        </div>
                        <?php endfor;?>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <div class="content_title">
                        <div>골키퍼 성적 상세 그래프</div>
                    </div>
                </div>
                <div class="graph_content">
                    <div class="second_sub_title">
                        <div>그래프</div>
                        <div>구분</div>
                        <div>그래프</div>
                    </div>
                    <div class="goalkeeper_graph">
                        <?php for($i=0; $i<3; $i++):?>
                        <div>
                            <div>
                                <div style="width: 289px; height: 115px;">
                                    <canvas id="<?php echo $keeper_graph_h_id[$i];?>"></canvas>
                                </div>
                            </div>
                            <div>
                                <div><?php echo $keeper_graph_title[$i];?></div>
                            </div>
                            <div>
                                <div style="width: 289px; height: 115px;">
                                    <canvas id="<?php echo $keeper_graph_a_id[$i];?>"></canvas>
                                </div>
                            </div>
                        </div>
                        <?php endfor;?>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-----------3페이지 끝--------------->
    <!-----------4페이지 시작--------------->
    <section id="line_up">
            <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
            <div class="main_title">
                <div>예상 포메이션 분석</div>
                <div>양팀의 최근 20경기 분석 데이터</div>
            </div>
            <div class="main_content">
                <div>
                    <div class="content_title">
                        <div>양팀의 예상 포메이션</div>
                    </div>
                    <div class="content_box">
                        <div class="team_title">
                            <div style="border-top: 1px solid #517dc9;"><?php echo $formation_h['team_name'];?></div>
                            <div style="border-top: 1px solid #ffd46e;"><?php echo $formation_a['team_name'];?></div>
                        </div>
                        <div class="second_sub_title">
                            <div><?php echo $formation_h['formation'];?></div>
                            <div>포메이션</div>
                            <div><?php echo $formation_a['formation'];?></div>
                        </div>
                        <div class="formation_content">
                            <div style="width: 940px; height: 481px;">
                                <canvas id="stadium"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="content_title">
                        <div>최근 5경기 예상 포메이션 상대 전적</div>
                    </div>
                    <?php for($i=0; $i<2; $i++):?>
                    <div class="content_box">
                        <div class="div_title">
                            <div><?php echo $foramtion_arr[$i]['team_name'];?> 예상 포메이션</div>
                            <div>상대 팀 예상 포메이션</div>
                        </div>
                        <div class="second_sub_title">
                            <div><?php echo $foramtion_arr[$i]['formation'];?></div>
                            <div><?php echo $foramtion_arr[$i]['formation_opposition'];?></div>
                        </div>
                        <div class="content_result">
                            <div><span><span><?php echo $foramtion_arr[$i]['W'];?></span>승 <span><?php echo $foramtion_arr[$i]['D'];?></span>무 <span><?php echo $foramtion_arr[$i]['L'];?></span>패</span> - 경기당 평균 득점 : <span><?php echo $foramtion_arr[$i]['goal_avg'];?></span>  /  평균 실점 : <span><?php echo $foramtion_arr[$i]['lose_avg'];?></span></div>
                            <div class="graph">

                                <div class="pie_graph">
                                    <div style="width: 312px; height:149px;">
                                        <canvas id="<?php echo $formation_pie_id[$i];?>"></canvas>
                                    </div>
                                </div>
                                <div class="d_line_graph">
                                    <div style="width: 526px; height:149px;">
                                        <canvas id="<?php echo $formation_line_id[$i];?>"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php endfor;?>
                </div>
            </div>
    </section>
    <section id="player_change">
        <h2 class="nonDisplay"><span>홈팀명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>선수 교체 분석</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="content_container">
            <div>
                <div class="content_title">
                    <div>평균 교체 시간</div>
                </div>
                <div class="content_box">
                    <div class="content_sub_main_title">
                        <div>-</div>
                        <div>교체 시간</div>
                    </div>
                    <div class="content_sub_title">
                        <?php for($v=0; $v<5; $v++):?>
                        <div><?php echo $p_change_title[$v];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="content_result">
                        <?php for($i=0; $i<2; $i++):?>
                        <div class="<?php echo $basic_class[$i];?>">
                            <?php for($n=0; $n<5; $n++):?>
                            <?php if($n === 0 || $n === 4):?>
                            <div><?php echo $p_avg_change_arr[$i][$p_avg_change_key[$n]];?></div>
                            <?php else:?>
                            <div class="bin"><?php echo $p_avg_change_arr[$i][$p_avg_change_key[$n]];?></div>
                            <?php endif;?>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                </div>
            </div>
            <div>
                <div class="content_title">
                    <div>교체 후 팀별 득점 / 실점</div>
                </div>
                <div class="content_box">
                    <div class="content_sub_main_title">
                        <div>-</div>
                        <div>첫번째 교체 후 결과</div>
                        <div>두번째 교체 후 결과</div>
                        <div>세번째 교체 후 결과</div>
                    </div>
                    <div class="content_sub_title">
                        <div>팀명</div>
                        <div>득점 / 실점 비율</div>
                        <div>득점 / 실점 비율</div>
                        <div>득점 / 실점 비율</div>
                    </div>
                    <div class="content_result">
                        <div class="home_content">
                            <div>홈팀명</div>
                            <div>
                                <div style="width: 240px; height: 130px;">
                                    <canvas id="h_first_pie"></canvas>
                                </div>
                            </div>
                            <div>
                                <div style="width: 240px; height: 130px;">
                                    <canvas id="h_second_pie"></canvas>
                                </div>
                            </div>
                            <div>
                                <div style="width: 240px; height: 130px;">
                                    <canvas id="h_third_pie"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="away_content">
                            <div>원정팀명</div>
                            <div>
                                <div style="width: 240px; height: 130px;">
                                    <canvas id="a_first_pie"></canvas>
                                </div>
                            </div>
                            <div>
                                <div style="width: 240px; height: 130px;">
                                    <canvas id="a_second_pie"></canvas>
                                </div>
                            </div>
                            <div>
                                <div style="width: 240px; height: 130px;">
                                    <canvas id="a_third_pie"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="y_r_card_count">
        <h2 class="nonDisplay"><span>홈팀명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>경고 및 퇴장 횟수</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="content_container">
            <div>
                <div class="content_title">
                    <div>평균 경고 및 퇴장</div>
                </div>
                <div class="content_box">
                    <div class="content_sub_main_title">
                        <div>-</div>
                        <div>평균 경고 및 퇴장 횟수</div>
                    </div>
                    <div class="content_sub_title">
                        <?php for($v=0; $v<5; $v++):?>
                        <div><?php echo $y_r_card_cnt_title[$v];?></div>
                        <?php endfor;?>
                    </div>
                    <div class="content_result">
                        <?php for($i=0; $i<2; $i++):?>
                        <div class="<?php echo $basic_class[$i];?>">
                            <?php for($n=0; $n<5; $n++):?>
                                <?php
                                $cnt_data_h = $data['detail_page_4']['p4_3']['d1']['div_home'][$y_r_card_cnt_key[$n]];
                                $cnt_data_a = $data['detail_page_4']['p4_3']['d1']['div_away'][$y_r_card_cnt_key[$n]];
                                ?>
                                <?php if($n === 0 || $n === 4):?>
                                    <?php if($n === 4):?>
                                        <?php if($i === 0):?>
                                            <?php if($y_r_card_cnt_h['red_permit_avg'] > $y_r_card_cnt_a['red_permit_avg']):?>
                                                <div class="y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_permit_avg'] === $y_r_card_cnt_a['red_permit_avg']):?>
                                                <div class="y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_permit_avg'] < $y_r_card_cnt_a['red_permit_avg']):?>
                                                <div class="y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php elseif($i === 1):?>
                                            <?php if($y_r_card_cnt_h['red_permit_avg'] < $y_r_card_cnt_a['red_permit_avg']):?>
                                                <div class="y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_permit_avg'] === $y_r_card_cnt_a['red_permit_avg']):?>
                                                <div class="y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_permit_avg'] > $y_r_card_cnt_a['red_permit_avg']):?>
                                                <div class="y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php endif;?>
                                    <?php elseif($n === 0):?>
                                        <div><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                    <?php endif;?>
                                <?php else:?>
                                    <?php if($n === 1):?>
                                        <?php if($i === 0):?>
                                            <?php if($y_r_card_cnt_h['yellow_avg'] > $y_r_card_cnt_a['yellow_avg']):?>
                                                <div class="bin y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_avg'] === $y_r_card_cnt_a['yellow_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_avg'] < $y_r_card_cnt_a['yellow_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php elseif($i === 1):?>
                                            <?php if($y_r_card_cnt_h['yellow_avg'] < $y_r_card_cnt_a['yellow_avg']):?>
                                                <div class="bin y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_avg'] === $y_r_card_cnt_a['yellow_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_avg'] > $y_r_card_cnt_a['yellow_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php endif;?>
                                    <?php elseif($n === 2):?>
                                        <?php if($i === 0):?>
                                            <?php if($y_r_card_cnt_h['yellow_permit_avg'] > $y_r_card_cnt_a['yellow_permit_avg']):?>
                                                <div class="bin y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_permit_avg'] === $y_r_card_cnt_a['yellow_permit_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_permit_avg'] < $y_r_card_cnt_a['yellow_permit_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php elseif($i === 1):?>
                                            <?php if($y_r_card_cnt_h['yellow_permit_avg'] < $y_r_card_cnt_a['yellow_permit_avg']):?>
                                                <div class="bin y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_permit_avg'] === $y_r_card_cnt_a['yellow_permit_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['yellow_permit_avg'] > $y_r_card_cnt_a['yellow_permit_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php endif;?>
                                    <?php elseif($n === 3):?>
                                        <?php if($i === 0):?>
                                            <?php if($y_r_card_cnt_h['red_avg'] > $y_r_card_cnt_a['red_avg']):?>
                                                <div class="bin y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_avg'] === $y_r_card_cnt_a['red_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_avg'] < $y_r_card_cnt_a['red_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php elseif($i === 1):?>
                                            <?php if($y_r_card_cnt_h['red_avg'] < $y_r_card_cnt_a['red_avg']):?>
                                                <div class="bin y_r_cnt_win"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_avg'] === $y_r_card_cnt_a['red_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php elseif($y_r_card_cnt_h['red_avg'] > $y_r_card_cnt_a['red_avg']):?>
                                                <div class="bin y_r_cnt_lose"><?php echo $y_r_card_cnt_arr[$i][$y_r_card_cnt_key[$n]];?></div>
                                            <?php endif;?>
                                        <?php endif;?>
                                    <?php endif;?>
                                <?php endif;?>
                            <?php endfor;?>
                        </div>
                        <?php endfor;?>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section id="game_result_stats">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>양 팀 경기 결과별 성적 비교</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <?php for($i=0; $i<3; $i++):?>
            <?php
                $result_stats_h = $data['detail_page_4']['p4_4'][$result_stats_div_key[$i]]['total']['div_home'];
                $result_stats_a = $data['detail_page_4']['p4_4'][$result_stats_div_key[$i]]['total']['div_away'];
            ?>
            <div>
                <div class="content_title">
                    <div><?php echo $result_stats_title[$i];?></div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <div class="sub_title_team">
                        <div><?php echo $result_stats_h['team_name'];?></div>
                        <div><?php echo $result_stats_a['team_name'];?></div>
                    </div>
                    <div class="content_result">
                        <div>
                            <?php for($n=0; $n<7; $n++):?>
                            <?php if($result_stats_h[$result_stats_key[$n]] !== null || $result_stats_a[$result_stats_key[$n]] !== null):?>
                            <div>
                                <div>
                                    <div class="color_back">
                                        <?php if($result_stats_h[$result_stats_key[$n]] >= $result_stats_a[$result_stats_key[$n]]):?>
                                        <div class="color_g" style="background-color: #517dc9; width: <?php echo $result_stats_h[$result_stats_per_key[$n]];?>%;"></div>
                                        <?php elseif($result_stats_h[$result_stats_key[$n]] < $result_stats_a[$result_stats_key[$n]]):?>
                                        <div class="color_g" style="width: <?php echo $result_stats_h[$result_stats_per_key[$n]];?>%;"></div>
                                        <?php endif;?>
                                    </div>
                                </div>
                                <div class="bin"><span><?php echo $result_stats_h[$result_stats_key[$n]];?></span></div>
                                <div class="bin"><span><?php echo $result_stats_name[$n];?></span></div>
                                <div><span><?php echo $result_stats_a[$result_stats_key[$n]];?></span></div>
                                <div>
                                    <div class="color_back">
                                        <?php if($result_stats_h[$result_stats_key[$n]] <= $result_stats_a[$result_stats_key[$n]]):?>
                                        <div class="color_g" style="background-color: #ffd46e; width: <?php echo $result_stats_a[$result_stats_per_key[$n]];?>%;"></div>
                                        <?php elseif($result_stats_h[$result_stats_key[$n]] > $result_stats_a[$result_stats_key[$n]]):?>
                                        <div class="color_g" style="width: <?php echo $result_stats_a[$result_stats_per_key[$n]];?>%;"></div>
                                        <?php endif;?>
                                    </div>
                                </div>
                            </div>
                            <?php endif;?>
                            <?php endfor;?>
                        </div>
                    </div>
                </div>
            </div>
            <?php endfor;?>
        </div>
    </section>
    <section id="rest_day">
        <h2 class="nonDisplay"><span>홈팅명</span><span>원정팀명</span><span>경기날짜</span></h2>
        <div class="main_title">
            <div>휴식일별 성적 비교</div>
            <div>양팀의 최근 20경기 분석 데이터</div>
        </div>
        <div class="main_content">
            <div>
                <div class="content_title">
                    <div>휴식일별 경기 평균 스텟 분석</div>
                    <div class="filter_button">
                        <div class="all_game time_selected">전체</div>
                        <div class="home_game">홈</div>
                        <div class="away_game">원정</div>
                    </div>
                </div>
                <div class="content_box">
                    <?php for($i=0; $i<2; $i++):?>
                    <div>
                        <?php if($i === 0):?>
                        <div class="content_sub_main_title">
                            <div>-</div>
                            <div>휴식일</div>
                        </div>
                        <?php endif;?>
                        <div class="content_sub_title">
                            <div>
                                <div>팀명</div>
                                <div>구분</div>
                            </div>
                            <div>
                                <?php for($c=0; $c<5; $c++):?>
                                <div><?php echo $rest_day_sub_title[$c];?></div>
                                <?php endfor;?>
                            </div>
                        </div>
                        <div class="content_result">
                            <div>
                                <div><?php echo $rest_day_arr[$i]['gab_2']['team_name'];?></div>
                                <div>
                                    <?php for($x=0; $x<8; $x++):?>
                                    <div><?php echo $rest_day_content_title[$x];?></div>
                                    <?php endfor;?>
                                </div>
                            </div>
                            <div>
                                <?php for($n=0; $n<8; $n++):?>
                                <div>
                                    <?php for($s=0; $s<5; $s++):?>
                                    <?php if($rest_day_arr[$i][$rest_day_mid_key[$s]][$rest_day_key[$n]] === null):?>
                                    <div class="bin">-</div>
                                    <?php else:?>
                                    <div class="bin"><?php echo $rest_day_arr[$i][$rest_day_mid_key[$s]][$rest_day_key[$n]];?></div>
                                    <?php endif;?>
                                    <?php endfor;?>
                                </div>
                                <?php endfor;?>
                            </div>
                        </div>
                    </div>
                    <?php endfor;?>
                </div>
            </div>
        </div>
    </section>
    <!-----------4페이지 끝--------------->
    <!----------------------------------------- 상세 분석 페이지 끝 ------------------------------------------------------>
    <?php else:?>
        <div>경기 데이터가 존재하지 않습니다.</div>
    <?php endif;?>
    <footer>
        <div>베픽은 분석 커뮤니티 입니다. 배팅 사이트가 아닙니다</div>
        <div>베픽 프리미엄분석 서비스는 저작권법의 보호를 받으며, 무단 전재·복사·배포를 금합니다</div>
        <div>COPYRIGHT © 2018 BEPICK ALL RIGHTS RESERVED</div>
    </footer>
</article>
<div id="detail_view"></div>
<!--<article id="analysis">-->
<!--    <div id="listTitle" style="display: none;"></div>-->
<!--    <section id="analysisTitle">-->
<!--        <div></div>-->
<!--    </section>-->
<!--    <section id="standings">-->
<!--        <div id="titleContainer">-->
<!--            <div class="standingsTitle"><a href="#">Standings</a></div>-->
<!--            <div class="teamName">-->
<!--                <div>홈팀명</div>-->
<!--                <div>원정팀명</div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div id="standingContent">-->
<!--        </div>-->
<!--    </section>-->
<!--    <section id="headToHead">-->
<!--        <div id="titleContainer">-->
<!--            <div class="hthTitle">Head to Head Statistics</div>-->
<!--        </div>-->
<!--        <div id="contentContainer">-->
<!--            <div id="hthContentTitle">-->
<!--                <div>League/Cup</div>-->
<!--                <div>Date</div>-->
<!--                <div>Home</div>-->
<!--                <div>Score</div>-->
<!--                <div>H T</div>-->
<!--                <div>Corner</div>-->
<!--                <div>Away</div>-->
<!--                <div>-->
<!--                    <div class="first_rate">-->
<!--                        <select id="rate_crown">-->
<!--                            <option value="test">test</option>-->
<!--                        </select>-->
<!--                        <select id="rate_odds">-->
<!--                            <option value="first">First Odds</option>-->
<!--                            <option value="final">Final Odds</option>-->
<!--                        </select>-->
<!--                    </div>-->
<!--                    <div>HW</div>-->
<!--                    <div>D</div>-->
<!--                    <div>AW</div>-->
<!--                </div>-->
<!--                <div>-->
<!--                    <div class="second_rate">-->
<!--                    <select id="odds_crown">-->
<!--                            <option value="test">test</option>-->
<!--                        </select>-->
<!--                        <select id="odds_odds">-->
<!--                            <option value="first">First Odds</option>-->
<!--                            <option value="final">Final Odds</option>-->
<!--                        </select>-->
<!--                    </div>-->
<!--                    <div>H</div>-->
<!--                    <div>Odds</div>-->
<!--                    <div>A</div>-->
<!--                </div>-->
<!--                <div>W/L</div>-->
<!--                <div>Odds</div>-->
<!--                <div>O/U</div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </section>-->
<!--    <section id="PreviousScoresStatistics">-->
<!--        <div id="h_statistics">-->
<!--            <div id="titleContainer">-->
<!--                <div class="staTitle">Previous Scores Statistics</div>-->
<!--            </div>-->
<!--            <div id="contentContainer">-->
<!--                <div id="staContentTitle">-->
<!--                    <div>League/Cup</div>-->
<!--                    <div>Date</div>-->
<!--                    <div>Home</div>-->
<!--                    <div>Score</div>-->
<!--                    <div>H T</div>-->
<!--                    <div>Corner</div>-->
<!--                    <div>Away</div>-->
<!--                    <div>-->
<!--                        <div class="first_rate">-->
<!--                            <select id="rate_crown">-->
<!--                                <option value="test">test</option>-->
<!--                            </select>-->
<!--                            <select id="rate_odds">-->
<!--                                <option value="first">First Odds</option>-->
<!--                                <option value="final">Final Odds</option>-->
<!--                            </select>-->
<!--                        </div>-->
<!--                        <div>HW</div>-->
<!--                        <div>D</div>-->
<!--                        <div>AW</div>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                        <div class="second_rate">-->
<!--                        <select id="odds_crown">-->
<!--                                <option value="test">test</option>-->
<!--                            </select>-->
<!--                            <select id="odds_odds">-->
<!--                                <option value="first">First Odds</option>-->
<!--                                <option value="final">Final Odds</option>-->
<!--                            </select>-->
<!--                        </div>-->
<!--                        <div>H</div>-->
<!--                        <div>Odds</div>-->
<!--                        <div>A</div>-->
<!--                    </div>-->
<!--                    <div>W/L</div>-->
<!--                    <div>Odds</div>-->
<!--                    <div>O/U</div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div id="a_statistics">-->
<!--            <div id="titleContainer">-->
<!--            </div>-->
<!--            <div id="contentContainer">-->
<!--                <div id="staContentTitle">-->
<!--                    <div>League/Cup</div>-->
<!--                    <div>Date</div>-->
<!--                    <div>Home</div>-->
<!--                    <div>Score</div>-->
<!--                    <div>H T</div>-->
<!--                    <div>Corner</div>-->
<!--                    <div>Away</div>-->
<!--                    <div>-->
<!--                        <div class="first_rate">-->
<!--                            <select id="rate_crown">-->
<!--                                <option value="test">test</option>-->
<!--                            </select>-->
<!--                            <select id="rate_odds">-->
<!--                                <option value="first">First Odds</option>-->
<!--                                <option value="final">Final Odds</option>-->
<!--                            </select>-->
<!--                        </div>-->
<!--                        <div>HW</div>-->
<!--                        <div>D</div>-->
<!--                        <div>AW</div>-->
<!--                    </div>-->
<!--                    <div>-->
<!--                        <div class="second_rate">-->
<!--                        <select id="odds_crown">-->
<!--                                <option value="test">test</option>-->
<!--                            </select>-->
<!--                            <select id="odds_odds">-->
<!--                                <option value="first">First Odds</option>-->
<!--                                <option value="final">Final Odds</option>-->
<!--                            </select>-->
<!--                        </div>-->
<!--                        <div>H</div>-->
<!--                        <div>Odds</div>-->
<!--                        <div>A</div>-->
<!--                    </div>-->
<!--                    <div>W/L</div>-->
<!--                    <div>Odds</div>-->
<!--                    <div>O/U</div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </section>-->
<!--</article>-->