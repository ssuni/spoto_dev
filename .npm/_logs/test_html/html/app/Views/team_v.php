<?php

echo 'Team_v';
?>

<article id="team_info">
    <h1 style="display:none">팀 정보 리스트</h1>
    <header id="menu_nav">
        <ul>
            <li class="stats selected">팀 통계</li>
            <li class="league">리그 통계</li>
            <li class="cup">컵 통계</li>
            <li class="achievement">업적</li>
            <li class="schedule">일정</li>
            <li class="line_up">라인업</li>
            <li class="player">플레이어</li>
            <li class="transfer">이적</li>
        </ul>
        <select id="team_select">
            <option value="selectTeam" selected="selected">Select Team</option>
        </select>
        <select id="cup_league_select" class="nonDisplay"></select>
    </header>
    <div class="sortationBox"></div>
    <section id="teamTitle">
        <div class="team_img">
            <div>
                <img src="">
            </div>
            <div>클럽명</div>
        </div>
        <div class="team_info">
            <div>
                <div>클럽명: </div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div>
                <div>지역: </div>
                <div></div>
                <div>홈구장: </div>
                <div></div>
            </div>
            <div>
                <div>수용인원: </div>
                <div></div>
                <div>설립일: </div>
                <div></div>
            </div>
            <div>
                <div>감독: </div>
                <div></div>
                <div>웹사이트: </div>
                <div><a href="">enter</a></div>
            </div>
            <div>
                <div>주소: </div>
                <div>주소내용</div>
            </div>
        </div>
    </section>
    <section id="teamStatistics">
        <div class="staTitle">
            <select id="league_select">
                <option value="all" selected="selected">All</option>
            </select>
            팀 통계
            <div class="right_btn">
                <span class="off on">공격시</span>
                <span class="def">수비시</span>
            </div>
        </div>
        <div class="sub_title">
            <div>
                <div>승</div>
                <div>무</div>
                <div>패</div>
                <div>승률</div>
                <div>파울</div>
                <div>열로우 카드</div>
                <div>레드 카드</div>
                <div>점유율</div>
                <div>슈팅(유효)</div>
                <div>패스시도(성공)</div>
                <div>패스 성공률%</div>
                <div>드리블</div>
                <div>Rating</div>
            </div>
        </div>
        <div class="staContent">
            <div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </section>
    <section id="league_schedule">
        <div class="schedule_title">
            <div><span>리그</span></div>
            <div><span>날짜</span></div>
            <div><span>홈팀</span></div>
            <div><span>점수</span></div>
            <div><span>원정팀</span></div>
            <div><span>파울</span></div>
            <div><span>열로우<br>카드</span></div>
            <div><span>레드<br>카드</span></div>
            <div><span>점유율</span></div>
            <div><span>슈팅시도<br>(유효)</span></div>
            <div><span>패스시도<br>(성공)</span></div>
            <div><span>패스<br>성공률%</span></div>
            <div><span>드리블</span></div>
            <div><span>Rating</span></div>
        </div>
        <div class="schedule_content"></div>
    </section>
</article>