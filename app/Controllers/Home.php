<?php

namespace App\Controllers;

use CodeIgniter\I18n\Time;

class Home extends BaseController
{
    public function __construct()
    {
        helper('date');
    }

    public function index()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/bf_kr.js?'.time());
        $res = $response->getBody();
        preg_match_all('/A\[(.+?)\]=\[(.+?)\]/is', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);
        preg_match_all('/C\[(.+?)\]=\[(.+?)\]/is', $res, $C);

        $_tmp = array();
        foreach ($A[2] as $row) {

//            var_dump($row);
//            [1813701,31,7886,2639,'Alianza Petrolera','데포르티보 칼리','2019-11-11 00:30:00','2019-11-11 01:36:37',3,3,2,2,1,0,1,5,2,'(c)-7','(c)-4',1,'True',0,'',63,'',2.25,'True',2,8,1,2101,'13','Jhon Alexander Hinestroza Romana','15℃～16℃'];
            $_idx = array('idx', 'league_idx', 'home_idx', 'away_idx', 'home_name', 'away_name', 'game_start_time', 'second_start_time', 'game_progress', 'home_goal', 'away_goal',
                'home_1stHalf_goal', 'away_1stHalf_goal', 'home_red_card', 'away_red_card', 'home_yellow_card', 'away_yellow_card', 'home_current_rank', 'away_current_rank',
                'check1', 'odds_3in1', 'check2', 'append_content', 'continent_idx', '24', '25', 'odds_live', 'home_conner_kick', 'away_conner_kick', '29', 'league_check', '31', 'referee', 'temperature', );

            $json = "[{$row}]";
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            if ($arr) {
                for ($i = 0; $i < count($arr); ++$i) {
                    $_arr2[$_idx[$i]] = $arr[$i];
                    if ($i == 4) {
                        $_arr2[$_idx[$i]] = strip_tags($arr[$i]);
                    }
                    if ($i == 6 || $i == 7) {
                        $_t = $insert = str_replace("'", '', $arr[$i]);
                        $time = Time::parse($_t);
                        $_time = $time->addHours(9);
                        $_arr2[$_idx[$i]] = $_time;
                    }
                    if($i == 24){
                        $_append = $arr[$i];
                        $_append = str_replace('|','',$_append);
                        $_append = str_replace(';',',',$_append);
                        $_append = str_replace(',','","',$_append);
                        $_append = substr_replace($_append,'"',strlen($_append),1);
                        $_append = substr_replace($_append,'"',1,0);
                        $arr_append = json_decode("[$_append]", true);
//                        var_dump($arr_append);

                        if(isset($arr_append[1])) {
                            if ($arr_append[1] !== "") {
                                if ($arr_append[1] == "1") {
                                    $text = 'kick-off(' . $arr[4] . ')';
                                } else {
                                    $text = 'kick-off' . $arr[5] . ')';
                                }
                            }

                            if ($arr_append[1] !== "") {
                                if ($arr_append[6] == "") {
                                    $text = $arr_append[3] . 'Min[' . $arr_append[4] . '],Pen[' . $arr_append[7] . ']';
                                } else {
                                    if ($arr_append[8]) {
                                        $text = $arr_append[3] . 'Min[' . $arr_append[4] . '],120Min[' . $arr_append[7] . '],Pen[' . $arr_append[8] . ']';
                                    } else {
                                        $text = $arr_append[3] . 'Min[' . $arr_append[4] . '],120Min[' . $arr_append[7] . ']';
                                    }

                                }
                            }
                        }
                        $last_arr = count($arr_append) -1;
                            $text = "";
                            if ($arr_append[$last_arr] !== "") {
                                if ($arr_append[$last_arr] == "1") {
                                    $text = $text . $arr[4] . ' Win';
                                } else {
                                    $text = $text . $arr[5] . ' Win';
                                }
                                $_arr2[$_idx[$i]] = $text;
                            }

                    }
                }
            }
            $_tmp[] = $_arr2;
        }

        $_tmpB = array();
        $j = 0; //B data 인덱스 값이 A 데이터의 필드값 매칭
        foreach ($B[2] as $row) {
            $_idx = array('check1', 'league_short', 'league_name', 'color', '5', 'url', '7', 'league_ranking', 'league_idx');

            $json = "[{$row}]";
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            if ($arr) {
                for ($i = 0; $i <= count($arr); ++$i) {
                    if ($i == 8) {
                        $_arr2[$_idx[$i]] = $B[1][$j];
                    } else {
                        $_arr2[$_idx[$i]] = $arr[$i];
                    }
                }
            }
            $_tmpB[] = $_arr2;
            ++$j;
        }

        $_tmpC = array();

        foreach ($C[2] as $row) {
            $_idx = array('check1', 'location_name', 'check2');

            $json = "[{$row}]";
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            if ($arr) {
                for ($i = 0; $i < count($arr); ++$i) {
                    $_arr2[$_idx[$i]] = $arr[$i];
                }
            }

            $_tmpC[] = $_arr2;
        }

//        $data['A'] = $_tmp;
//        $data['B'] = $_tmpB;
        $data['C'] = $_tmpC;

        $json = file_get_contents(WRITEPATH.'maindata.json');
        $json = json_decode($json,true);
        $data['A'] = $json['A'];
        $data['B'] = $json['B'];

        echo view('inc/header_v');
        echo view('welcome_message', $data);
    }

    public function main()
    {
        echo view('main_v');
    }

    /**
     * @return mixed
     */
    public function kr7m()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://ctc.live.7m.com.cn/datafile/fkr.js');
        $res = $response->getBody();

        preg_match_all('/sDt\[(.+?)\]=\[(.+?)\]/is', $res, $A);

        $_tmp = array();

        foreach ($A[2] as $row) {
            $_idx = array('league_name', '2', 'home_team_name', 'away_team_name', '4', '5', '6', '7', '8', 'home_team_idx',
                'away_team_idx', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', );

            $json = "[{$row}]";
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            for ($i = 0; $i < count($arr); ++$i) {
                $_arr2[$_idx[$i]] = $arr[$i];
            }

            $_tmp[] = $_arr2;
        }

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($_tmp);

        return view('welcome_message');
    }

    public function test()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/bf_kr.js');
        $res = $response->getBody();
        preg_match_all('/A\[(.+?)\]=\[(.+)\]/m', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);
        preg_match_all('/C\[(.+?)\]=\[(.+?)\]/is', $res, $C);

        $_tmp = array();

        foreach ($A[2] as $row) {
            $_idx = array('idx', 'league_idx', 'home_idx', 'away_idx', 'home_name', 'away_name', 'game_start_time', 'second_start_time', 'game_progress', 'home_goal',
                'away_goal', 'home_1stHalf_goal', 'away_1stHalf_goal', 'home_red_card', 'away_red_card', 'home_yellow_card', 'away_yellow_card', 'home_current_rank', 'away_current_rank','check1',
                'odds_3in1', 'check2', 'check3', 'continent_idx', 'append_content', '25', 'odds_live', 'home_conner_kick', 'away_conner_kick', '29',
                'league_check', '31', 'referee', 'temperature', );

            $json = "[{$row}]";

            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

//            $_tmp[] = $arr;
            // /,{2}/gi
            $_arr2 = array();
            if ($arr) {
                for ($i = 0; $i < count($arr); ++$i) {
                    $text = "";
                    $_arr2[$_idx[$i]] = $arr[$i];
                    if ($i == 4) {
                        $_arr2[$_idx[$i]] = strip_tags($arr[$i]);
                    }
                    if ($i == 6 || $i == 7) {
                        $_t = $insert = str_replace("'", '', $arr[$i]);
                        $time = Time::parse($_t);
                        $_time = $time->addHours(9);
                        $_arr2[$_idx[$i]] = $_time->toDateTimeString();
                    }
                    if($i == 24) {
                        $_append = $arr[$i];
                        $_append = str_replace('|', '', $_append);
                        $_append = str_replace(';', ',', $_append);
                        $_append = str_replace(',', '","', $_append);
                        $_append = substr_replace($_append, '"', strlen($_append), 1);
                        $_append = substr_replace($_append, '"', 1, 0);
                        $arr_append = json_decode("[$_append]", true);

                        if (count($arr_append) > 1) {


                                if ($arr_append[1] !== null) {
                                    if ($arr_append[1] == "1") {
                                        $text = 'kick-off(' . $arr[4] . ')';
                                    } else if ($arr_append[1] == "2") {
                                        $text = 'kick-off' . $arr[5] . ')';
                                    } else {
                                        $text = "";
                                    }
                                }

                            if ($arr_append[3] !== null) {
                                if ($arr_append[6] == "") {
                                    if ($arr_append[4] !== "") {
                                        $text = $arr_append[3] . 'Min[' . $arr_append[4] . '],Pen[' . $arr_append[7] . ']';
                                    }
                                } else {
                                    if ($arr_append[8]) {
                                        $text = $arr_append[3] . 'Min[' . $arr_append[4] . '],120Min[' . $arr_append[7] . '],Pen[' . $arr_append[8] . ']';
                                    } else {
                                        $text = $arr_append[3] . 'Min[' . $arr_append[4] . '],120Min[' . $arr_append[7] . ']';
                                    }

                                }
                            }

                            $last_arr = count($arr_append) - 1;
                            
                            if (isset($arr_append[$last_arr])) {
                                if ($arr_append[$last_arr] !== "") {
                                    if ($arr_append[$last_arr] == "1") {
                                        $text = $text . $arr[4] . ' Win';
                                    } else {
                                        $text = $text . $arr[5] . ' Win';
                                    }
                                }
                                $_arr2[$_idx[$i]] = $text;
                            }
                        }
                    }
                }
            }
            $_tmp[] = $_arr2;
        }

        $_tmpB = array();
        $j = 0; //B data 인덱스 값이 A 데이터의 필드값 매칭
        foreach ($B[2] as $row) {
            $_idx = array('check1', 'league_short', 'league_name', 'color', '5', 'url', '7', 'league_ranking', 'league_idx');

            $json = "[{$row}]";
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            if ($arr) {
                for ($i = 0; $i <= count($arr); ++$i) {
                    if ($i == 8) {
                        $_arr2[$_idx[$i]] = $B[1][$j];
                    } else {
                        $_arr2[$_idx[$i]] = $arr[$i];
                    }
                }
            }
            $_tmpB[] = $_arr2;
            ++$j;
        }

        $data = array('A' => $_tmp, 'B' => $_tmpB);
        file_put_contents(WRITEPATH.'maindata.json',json_encode($data));
        return json_encode($data);
    }

    public function detail()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/detail.js?'.time());
        $res = $response->getBody();

        preg_match_all('/rq\[(.+?)\]=\"(.+?)\"/is', $res, $rq);
        preg_match_all('/tc\[(.+?)\]=\"(.+?)\"/is', $res, $tc);

        $_idx_rq = array('game_idx', 'home_away', '2', 'min', 'name', '5', '6','7');
        $_idx_tc = array(
            '46' => 'ball_possession',
            '45' => 'test45',
            '44' => 'test44',
            '43' => 'test43',
            '42' => 'test42',
            '41' => 'test41',
            '40' => 'test40',
            '39' => 'test39',
            '38' => 'test38',
            '37' => 'test37',
            '36' => 'test36',
            '35' => 'test35',
            '34' => 'test34',
            '23' => 'test23',
            '20' => 'test20',
            '19' => 'test19',
            '16' => 'test16',
            '15' => 'test15',
            '14' => 'test14',
            '13' => 'test13',
            '11' => 'test11',
            '9' => 'test9',
            '8' => 'test8',
            '6' => 'shots_on_goal',
            '5' => 'test5',
            '4' => 'test4',
            '3' => 'shots',
            '0' => 'test0',
        );
        $arr_rq = array();
        $arr_tc = array();

        foreach ($rq[2] as $row){
            $arr = explode('^',$row);

            $arr_index = array();
            for($i = 0; $i < count($arr); $i++){

                if($i == 1){
                    $arr_index[$_idx_rq[$i]] = ($arr[$i] == 1)?'home':'away';
                }else{
                    $arr_index[$_idx_rq[$i]] = $arr[$i];
                }
            }

            $arr_rq[] = $arr_index;
        }
        foreach ($tc[2] as $row){
            $arr = explode('^',$row);
//            $arr2 = str_replace(';',',',$arr[1]);
            $arr2 = explode(';',$arr[1]);


            $key_arr = array();
            foreach ($arr2 as $a2)
            {
                $exp = explode(',',$a2);

                $key_arr[$_idx_tc[$exp[0]]] = array_splice($exp, 1, 2);

            }
            $arr_tc[$arr[0]] = $key_arr;
            $content = array();
            for($i = 0; $i < count($arr_rq); $i++){
                if($arr[0] == $arr_rq[$i]['game_idx']){
//                    $arr_tc[$arr[0]]['content'] = $arr_rq[$i];
                    array_push($content , $arr_rq[$i]);
                }
            }

            $arr_tc[$arr[0]]['content'] = $content; //

        }

        $arr_append = $arr_tc;
        file_put_contents(WRITEPATH.'detaildata.json',json_encode($arr_append));
        echo json_encode($arr_append);
    }

    public function getDataJson()
    {
        $data = file_get_contents(WRITEPATH.'maindata.json');
        return $data;
    }

    public function getDetailJson()
    {
        $data = file_get_contents(WRITEPATH.'detaildata.json');
        return $data;
    }

}
