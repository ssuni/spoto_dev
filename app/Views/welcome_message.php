	<div class="wrap" style="text-align: center">

			<table border="1" id="list" >
                <tr>
                <th>경기</th>
                <th>시간</th>
                <th>지위</th>
                <th>홈팀</th>
                <th width="50px">스코어 </th>
                <th>원정팀</th>
                <th>경기</th>
                <th width="50px">반</th>
                <th width="90px">데이터</th>
                </tr>

            </table>

		</div>

	</body>
<script>
    $(function(){
        console.log('ready');
        $.get('/home/test',function(res){
            var result = JSON.parse(res)
            console.log(result)


            var html = ""
            html += '<tr bgcolor="#dadada"><td colspan="9">'+moment(result['A'][0]['game_start_time']).format('YYYY-MM-DD dddd')+'</td></tr>';
            var arridx = [];
            var arrtime = [];
            var arrprog = [];
            $.each(result['A'],function(i,v){

                if(moment(v.game_start_time).format('YYYY-MM-DD') > moment(result['A'][0]['game_start_time']).format('YYYY-MM-DD') ){
                    arridx.push(v.idx);
                    arrtime.push(v.game_start_time);
                }

                html += '<tr id="tr_'+v.idx+'">';
                html += '<td class="'+v.league_idx+'">';
                html += '</td>';
                html += '<td>'+moment(v.game_start_time).format('HH:mm')+'</td>';

                if(v.game_progress == 1){
                    var now = new Date();
                    var oldtime = new Date(v.game_start_time)
                    var gap =now.getTime()-oldtime.getTime();
                    var min_gap = gap/1000/60;
                    html += '<td>'+Math.floor(min_gap)+'</td>';
                }else if(v.game_progress == 2) {
                    html += '<td>HT</td>';
                }else if(v.game_progress == 3) {
                    var now = new Date();
                    var oldtime = new Date(v.second_start_time)
                    var gap =now.getTime()-oldtime.getTime();
                    var min_gap = gap/1000/60;
                    html += '<td>'+Math.floor(45+min_gap)+'</td>';

                }else if(v.game_progress == -1){
                    arrprog.push(v.idx);
                    html += '<td>FT</td>';
                }else{
                    html += '<td></td>';
                }
                html += '<td>'+v.home_yellow_card+'<a href="javascript:void(0);" onclick="team(\''+v.home_idx+'\')">'+v.home_name+'</a></td>';
                if(v.game_progress == 0){
                    html += '<td>-</td>';
                }else {
                    html += '<td>' + v.home_goal + '-' + v.away_goal + '</td>';
                }
                html += '<td><a href="javacript:void(0);" onclick="team(\''+v.away_idx+'\')">'+v.away_name+'</a></td>';
                html += '<td></td>';

                if(v.game_progress !== 1 && v.game_progress !== 0) {
                    html += '<td>' + v.home_1stHalf_goal + '-' + v.away_1stHalf_goal + '</td>';
                }else{
                    html += '<td></td>';
                }

                html += '<td></td>';
                html += '</tr>'
            })

            $("#list").append(html)
            $.each(result['B'],function(i,v){
                $("."+v.league_idx).html(v.league_short)
            })

            $("#tr_"+arridx[0]).before('<tr bgcolor="#dadada"><td colspan="9">'+moment(arrtime[0]).format('YYYY-MM-DD dddd') +'</td></tr>>');
            $("#tr_"+arrprog[0]).before('<tr bgcolor="yellow"><td colspan="9">결과 </td></tr>>');
        })

    })
    function team(idx) {
        window.open("https://spoto.com/team/detail/"+idx, '_blank');
    }
</script>
</html>
