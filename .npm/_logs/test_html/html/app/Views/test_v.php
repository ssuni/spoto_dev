<html>
<head>
    <title></title>
    <script
            src="https://code.jquery.com/jquery-3.4.1.min.js"
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
            crossorigin="anonymous"></script>
    <script src="/js/socket.io.js"></script>
</head>
<body>
<!--<textarea rows="20" cols="60" id="chat"></textarea> <br>-->
<!--<input type="text" id="user">-->
<br/>
<input type="button" value="msg submit" onclick="myOnClick()">
<br/><br/><br/>
</body>


<script>
    function myOnClick(){
        var socket = io.connect('wss://spoto.com/bridgeTest') ;
        socket.emit('msg', {commment : 'test1'});

        socket.on('recMsg', function(data){
            console.log(data);
        })
    }
    // var idxArr = ['1721962','1721953','1866763','1866762','1866761','1865755','1867408','1867309','1867310','1867410','1866836','1866839','1867409','1867419','1866833','1866834','1867412','1867411','1867420','1867421','1866837','1861142'];
    // for(var i =0; i<20; i++){
    //     console.log(i);
    //     var teamIdx = idxArr[i];
    //     $.ajax({
    //
    //         url: 'http://www.nowgoal.com/detail/' + teamIdx + '.html',
    //         type: "GET",
    //
    //         cache: false,
    //
    //         data: '',
    //
    //         success: function (data) {
    //
    // 			$.ajax({
    //
    // 				url: 'https://spoto.com/conversion/test_ajax',
    // 				type: "POST",
    //
    // 				cache: false,
    //
    // 				data: {
    // 					'get_html' : data
    // 				},
    //
    // 				success: function (getData) {
    //
    // 					console.log(getData);
    // 					test = '<hr/><div>' + JSON.stringify(getData.data.config.home_name) + '</div>';
    // 					$('body').append(test);
    //
    // 				},
    //
    // 				error: function (request, status, error) {
    //
    //
    // 				}
    //
    // 			});
    //
    //         },
    //
    //         error: function (request, status, error) {
    //
    //
    //         }
    //
    //     });
    // }

</script>
</html>
