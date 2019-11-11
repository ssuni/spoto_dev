<div class="wrap">

    <table border="1">
        <tr>
            <td rowspan='5' colspan="4"></td>
            <td colspan="2">Name:</td>
            <td colspan="3" id="name"></td>
            <td colspan="2"></td>
            <td colspan="3"></td>

        </tr>
        <tr>
            <td colspan="2">City:</td>
            <td colspan="3" id="city"></td>
            <td colspan="2">Home Stadium:</td>
            <td colspan="3" id="home_stadium"></td>
        </tr>
        <tr>
            <td colspan="2">Capacity:</td>
            <td colspan="3" id="capacity"></td>
            <td colspan="2">Established Date:</td>
            <td colspan="3" id="establishedDate"></td>
        </tr>
        <tr>
            <td colspan="2">Coach:</td>
            <td colspan="3" id="coach"></td>
            <td colspan="2">Website:</td>
            <td colspan="3" id="website"></td>
        </tr>
        <tr>
            <td colspan="2">Address:</td>
            <td colspan="12"></td>
        </tr>
        <tr>
            <td colspan="4">
                <select id="selectSclass">
                </select>
            </td>
            <td colspan="6">Team Statistics</td>
            <td colspan="4">
                <ul class="nav nav-pills " id="pills-tab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" onclick="techType();"  role="tab" aria-controls="pills-home" aria-selected="true">Offensive</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" onclick="techType();" role="tab" aria-controls="pills-profile" aria-selected="false">Defensive</a>
                    </li>
                </ul>
            </td>
        </tr>

<!--offense-->
        <tr>
            <th>Win</th>
            <th>Draw</th>
            <th>Loss</th>
            <th>Win Rate</th>
            <th>Fouls</th>
            <th>Yellow Card</th>
            <th>Red Card</th>
            <th>Possession</th>
            <th>Shots(OT)</th>
            <th>Passes(Success)</th>
            <th>Pass Success%</th>
            <th colspan="2">Dribbles</th>
            <th>Rating</th>
        </tr>

        <tr id="team_statistics">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colspan="2"></td>
            <td></td>
        </tr>

        <tr id="league_stats">
            <th>League</th>
            <th>Time</th>
            <th>Home</th>
            <th>Score</th>
            <th>Away</th>
            <th>Fouls</th>
            <th>Yellow Card</th>
            <th>Red Card</th>
            <th>Possession</th>
            <th>Shots (OT)</th>
            <th>Passes(Success)</th>
            <th>Pass Success%</th>
            <th>Dribbles</th>
            <th>Rating</th>
        </tr>

<!--offense-->
    </table>

</div>

</body>

<script>
    $(function(){
        var teamDetail = [] = <?php echo json_encode($stats[0]);?>;;
        var rearguard = [] = <?php echo json_encode($stats[1]);?>;
        var vanguard = [] = <?php echo json_encode($stats[2]);?>;
        var goalkeeper = [] = <?php echo json_encode($stats[3]);?>;
        var midfielder = [] = <?php echo json_encode($stats[4]);?>;
        var coach = [] = <?php echo json_encode($stats[5]);?>;
        var lineupDetail = [] = <?php echo json_encode($stats[6]);?>;
        var leagueData = [] = <?php echo json_encode($stats[7]);?>;
        var cupData = [] = <?php echo json_encode($stats[8]);?>;
        var countSum = [] = <?php echo json_encode($stats[9]);?>;
        var teamCount = [] = <?php echo json_encode($stats[10]);?>;
        var teamHonor = [] = <?php echo json_encode($stats[11]);?>;
        var teamCharacter = [] = <?php echo json_encode($stats[12]);?>;
        var teamLastUpdateTime = [] = <?php echo json_encode($stats[13]);?>;

        $("#name").html(teamDetail[2]);
        $("#city").html(teamDetail[7]);
        $("#home_stadium").html(teamDetail[8]);
        $("#capacity").html(teamDetail[11]);
        $("#establishedDate").html(teamDetail[12]);
        $("#website").html(teamDetail[13]);
        $("#coach").html(coach[0][4]);

        var option = "";
        for(var i=0; i<countSum.length; i++ ){
            option += '<option value="'+countSum[i][0]+'">'+countSum[i][1]+'</option>';
        }

        $("#selectSclass").html(option);

        //All LIST
        const regex = /(.*).(.+?)/gm;
        var leagueIdx = $("#selectSclass").val();
        for(var i=0; i<countSum.length; i++){
            if(leagueIdx == countSum[i][0]){
                var winpercent = Number(countSum[i][2])/(Number(countSum[i][2])+Number(countSum[i][3])+Number(countSum[i][4]))*100;
                var winRate=winpercent.toFixed(1);
                if(regex.exec(winRate)[2] == 0) {
                    winRate = winpercent.toFixed(0);
                }
                $("#team_statistics >td").eq(0).html(countSum[i][2])
                $("#team_statistics >td").eq(1).html(countSum[i][3])
                $("#team_statistics >td").eq(2).html(countSum[i][4])
                $("#team_statistics >td").eq(3).html(winRate+'%')
                $("#team_statistics >td").eq(4).html(countSum[i][5])
                $("#team_statistics >td").eq(5).html(countSum[i][6])
                $("#team_statistics >td").eq(6).html(countSum[i][7])
                $("#team_statistics >td").eq(7).html(countSum[i][8]+'%')
                $("#team_statistics >td").eq(8).html(countSum[i][9]+'('+countSum[i][10]+')')
                $("#team_statistics >td").eq(9).html(countSum[i][11]+'('+countSum[i][12]+')')
                $("#team_statistics >td").eq(10).html(countSum[i][13]+'%')
                $("#team_statistics >td").eq(11).html(countSum[i][14])
                $("#team_statistics >td").eq(12).html(countSum[i][24])
            }
        }

        //리그변경 셀렉트
        $("#selectSclass").on('change',function(){
            const regex = /(.*).(.+?)/gm;
            var leagueIdx = $("#selectSclass").val();
            for(var i=0; i<countSum.length; i++){
                if(leagueIdx == countSum[i][0]){
                    var winpercent = Number(countSum[i][2])/(Number(countSum[i][2])+Number(countSum[i][3])+Number(countSum[i][4]))*100;
                    var winRate=winpercent.toFixed(1);
                    // console.log(regex.exec(winRate)[2]);
                    if(regex.exec(winRate)[2] == 0){
                        winRate = winpercent.toFixed(0);
                    }
                    $("#team_statistics >td").eq(0).html(countSum[i][2])
                    $("#team_statistics >td").eq(1).html(countSum[i][3])
                    $("#team_statistics >td").eq(2).html(countSum[i][4])
                    $("#team_statistics >td").eq(3).html(winRate+'%')
                    $("#team_statistics >td").eq(4).html(countSum[i][5])
                    $("#team_statistics >td").eq(5).html(countSum[i][6])
                    $("#team_statistics >td").eq(6).html(countSum[i][7])
                    $("#team_statistics >td").eq(7).html(countSum[i][8]+'%')
                    $("#team_statistics >td").eq(8).html(countSum[i][9]+'('+countSum[i][10]+')')
                    $("#team_statistics >td").eq(9).html(countSum[i][10])
                    $("#team_statistics >td").eq(11).html(countSum[i][11])
                }
            }
        })

        //기본 데이터

    })
    function techType(){
        console.log(this.data)
    }

    function setSclass()
    {

    }
</script>
</html>