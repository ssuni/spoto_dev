<?php echo 'database_view'; ?>
<article id="database">
    <h1 style="display: none">축구리그 정보</h1>
    <header class="mainTitle">
        <div class="league_title">
            <div>
                <span><img src="#"></span>
                <span>리그명</span>
            </div>
            <div class="selectContainer">
                <select id="league_season"></select>
                <select id="league_team">
                    <option value="all" selected="selected">Select Team</option>
                </select>
                <select id="league_round" class="nonDisplay">
                    <option value="all" selected="selected">Please Select</option>
                </select>
            </div>
        </div>
        <div class="league_nav">
            <div class="redback"><span>Schedule</span></div>
            <div><span>Tech Stats</span></div>
            <div><span>Top Team</span></div>
            <div><span>Team Profiles</span></div>
            <div><span>1st Goal/lose</span></div>
            <div><span>No Goal/Lose</span></div>
            <div><span>Odds Comparison</span></div>
        </div>
    </header>
    <section id="db_aside">
        <div>
            <div class="search">
                <div class="mainTitle">
                    <div>
                        <img src="http://info.nowgoal.com/images/info_search.gif">
                    </div>
                </div>
                <div class="searchContent">
                    <div>
                        <input type="text" id="searchInput">
                        <div>
                            <label for="search_player">
                                <input type="radio" id="search_player" value="player">Player
                            </label>
                            <label for="search_team">
                                <input type="radio" id="search_team" value="team">Team
                            </label>
                        </div>
                    </div>
                    <div>
                        <button>Search</button>
                    </div>
                </div>
            </div>
            <div class="search_nav">
                <div class="interContainer">
                    <div class="first_nav">
                        <span>Intercontinental</span><span>▶</span>
                    </div>
                </div>
                <div class="europContainer">
                    <div class="first_nav">
                        <span>European</span><span>▶</span>
                    </div>
                </div>
                <div class="americaContainer">
                    <div class="first_nav">
                        <span>America</span><span>▶</span>
                    </div>
                </div>
                <div class="asianContainer">
                    <div class="first_nav">
                        <span>Asian</span><span>▶</span>
                    </div>
                </div>
                <div class="oceaniaContainer">
                    <div class="first_nav">
                        <span>Oceania</span><span>▶</span>
                    </div>
                </div>
                <div class="africaContainer">
                    <div class="first_nav">
                        <span>Africa</span><span>▶</span>
                    </div>
            </div>
        </div>
    </section>
    <section id="league_schedule">
        <div class="league_round"></div>
        <div class="league_schedule">
            <div class="subTitle">
                <div><span>No.</span></div>
                <div><span>Date</span></div>
                <div><span>Home</span></div>
                <div><span>Score</span></div>
                <div><span>Away</div></span>
                <div>
                    <div>
                        <label for="awayHome">
                            <input type="radio" value="AH" id="awayHome">
                            AH
                        </label>
                        <label for="overUnder">
                            <input type="radio" value="O/U" id="overUnder">
                            O/U
                        </label>
                        <label for="oneXtwo">
                            <input type="radio" value="1X2" id="oneXtwo">
                            1X2
                        </label>
                    </div>
                    <div>
                        <label for="odds_select">
                            First Odds: 
                            <select id="odds_select">
                                <option value="crown" selected="selected">Crown</option>
                            </select>
                        </label>
                    </div>
                </div>
                <div><span>Data</span></div>
                <div><span>HT</span></div>
            </div>
            <div class="scheduleContent"></div>
        </div>
        <div class="league_ranking">
            <div class="ranking_nav">
                <div class="redback"><span>Total</span></div>
                <div class=""><span>Home</span></div>
                <div class=""><span>Away</span></div>
                <div class=""><span>HT Total</span></div>
                <div class=""><span>HT Home</span></div>
                <div class=""><span>HT Away</span></div>
                <label for="ranking_select">
                    <select id="ranking_select">
                        <option value="0" selected="selected">Total</option>
                    </select>
                </label>
            </div>
            <div class="subTitle">
                <div><span>R</span></div>
                <div><span>Team</span></div>
                <div><span>Games</span></div>
                <div><span>W</span></div>
                <div><span>D</span></div>
                <div><span>L</span></div>
                <div><span>Get</span></div>
                <div><span>Miss</span></div>
                <div><span>GD</span></div>
                <div><span>W%</span></div>
                <div><span>D%</span></div>
                <div><span>L%</span></div>
                <div>
                    <span>Avg</span>
                    <span>Get</span>
                </div>
                <div>
                    <span>Avg</span>
                    <span>Lose</span>
                </div>
                <div><span>Pts</span></div>
                <div><span>Recent 6</span></div>
            </div>
            <div class="rankingContent"></div>
            <div class="league_color_info">
                <span>■</span>UEFA CL qualifying <span>■</span>UEFA EL qualifying <span>■</span>Degrade Team
            </div>
        </div>
        <div class="league_info">
            <div class="mainTitle">Information</div>
            <div class="infoContent"></div>
        </div>
    </section>
    <section id="techStats" class="nonDisplay">
        <div class="selectContainer">
            <div>
                <select id="typeSelect">
                    <option value="0">Offensive</option>
                    <option value="1">Passing</option>
                    <option value="2">Defensive</option>
                    <option value="3">Summary</option>
                </select>
            </div>
            <div class="right_select">
                <div class="firstSelect">
                    <select id="teamSelect_1">
                        <option value="all">Select Team</option>
                    </select>
                    <select id="playerSelect_1">
                        <option value="none">Select Player</option>
                    </select>
                </div>
                <div><span>VS</span></div>
                <div class="secondSelect">
                    <select id="teamSelect_2">
                        <option value="all">Select Team</option>
                    </select>
                    <select id="playerSelect_2">
                        <option value="none">Select Player</option>
                    </select>
                </div>
                <button id="compareBth">Compare</button>
            </div>
        </div>
        <div class="navContainer">
            <div class="tech_nav">
                <div class="blueback">Total</div>
                <div>Home</div>
                <div>Away</div>
            </div>
            <div class="tech_select_radio">
                <label for="total">
                    <input type="radio" id="total" checked="checked">Total
                </label>
                <label for="average">
                    <input type="radio" id="average">Average
                </label>
            </div>
        </div>
        <div class="techstatsConinater">
            <div class="subTitle">
                <div><span>R</span></div>
                <div><span>Player</span></div>
                <div><span>Team</span></div>
                <div>
                    <span>Play</span>
                    <span>(Sub)</span>
                </div>
                <div><span>Mins</span></div>
                <div><span>Goals(P)</span></div>
                <div><span>Min/Goal</span></div>
                <div><span>Shots</span></div>
                <div>
                    <span>shots</span>
                    <span>OT</span>
                </div>
                <div><span>Conversion</span></div>
                <div><span>Fouled</span></div>
                <div><span>Offsides</span></div>
                <div><span>Best</span></div>
                <div><span>Rating</span></div>
            </div>
            <div class="serchTitle nonDisplay">
                <div class="firstPlayer"><p><span></span><span></span></p></div>
                <div><p>Team Compare</p></div>
                <div class="secondPlayer"><p><span></span><span></span></p></div>
            </div>
            <div class="techContent"></div>
            <div class="serchContent nonDisplay">
                <div>
                    <div><p></p></div>
                    <div><p>Play(Sub)</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Mins</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Goals(P)</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Min/Goal</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Shots</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Shots OT</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Conversion</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Fouled</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Offsides</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Best</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Rating</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Passes</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Pass Success</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Key Passes</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Assists</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Min/assist</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Long Passes</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Through</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Break Loose</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Tackles</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Interceptions</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Clearances</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Steal</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Blocked</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Heads</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Fouls</p></div>
                    <div><p></p></div>
                </div>
                <div>
                    <div><p></p></div>
                    <div><p>Cards</p></div>
                    <div><p></p></div>
                </div>
            </div>
        </div>
    </section>
    <section id="teamProfiles" class="nonDisplay">
        <div class="profilesContent"></div>
    </section>
    <section id="firstGaollose" class="nonDisplay">
        <div class="fglContainer">
            <div class="subTitle">
                <div><span>Team</span></div>
                <div>
                    <div><span>First Goal Stat.</span></div>
                    <div>
                        <div><span>Total</span></div>
                        <div><span>Home</span></div>
                        <div><span>Away</span></div>
                    </div>
                </div>
                <div>
                    <div><span>First lost Stat.</span></div>
                    <div>
                        <div><span>Total</span></div>
                        <div><span>Home</span></div>
                        <div><span>Away</span></div>
                    </div>
                </div>
            </div>
            <div class="fglContent"></div>
        </div>
    </section>
    <section id="noGaollose" class="nonDisplay">
        <div class="nglContainer">
            <div class="subTitle">
                <div><span>Team</span></div>
                <div>
                    <div><span>Total</span></div>
                    <div>
                        <div><span>P</span></div>
                        <div>
                            <div><span>No Score</span></div>
                            <div>
                                <div><span>FT</span></div>
                                <div><span>1st</span></div>
                                <div><span>2nd</span></div>
                            </div>
                        </div>
                        <div>
                            <div><span>No Loss</span></div>
                            <div>
                                <div><span>FT</span></div>
                                <div><span>1st</span></div>
                                <div><span>2nd</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div><span>Home</span></div>
                    <div>
                        <div><span>P</span></div>
                        <div>
                            <div><span>No Score</span></div>
                            <div>
                                <div><span>FT</span></div>
                                <div><span>1st</span></div>
                                <div><span>2nd</span></div>
                            </div>
                        </div>
                        <div>
                            <div><span>No Loss</span></div>
                            <div>
                                <div><span>FT</span></div>
                                <div><span>1st</span></div>
                                <div><span>2nd</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div><span>Away</span></div>
                    <div>
                        <div><span>P</span></div>
                        <div>
                            <div><span>No Score</span></div>
                            <div>
                                <div><span>FT</span></div>
                                <div><span>1st</span></div>
                                <div><span>2nd</span></div>
                            </div>
                        </div>
                        <div>
                            <div><span>No Loss</span></div>
                            <div>
                                <div><span>FT</span></div>
                                <div><span>1st</span></div>
                                <div><span>2nd</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="nglContent"></div>
        </div>
    </section>
</article>
