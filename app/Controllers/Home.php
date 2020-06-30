<?php

namespace App\Controllers;

use CodeIgniter\I18n\Time;
use App\Libraries\View_lb;


class Home extends BaseController
{
    public function __construct()
    {
        $this->view_lb = new View_lb();
        helper('SimpleHtmlDom');
    }

    public function analysis($seq = null)
    {
        if($seq == null){
            return json_encode(array('message' => '잘못된 접근입니다.'));
        }

        $analysis_data = array();

        // Create DOM from URL
        $html = file_get_html('http://www.nowgoal.com/analysis/1830052.html');

        $homeData = array();
        $awayData = array();

        //Standings data
        $homeTable = $html->find('#porletP2 table table table',0);
        $awayTable = $html->find('#porletP2 table table table',1);

        foreach ($homeTable->find('tr') as $tr){
            foreach ($tr->find('td') as $td){
                $text = str_replace("&nbsp;","",$td->innertext);
                $homeData[] = strip_tags($text);
            }
        }

        foreach ($awayTable->find('tr') as $tr){
            foreach ($tr->find('td') as $td){
                $text = str_replace("&nbsp;","",$td->innertext);
                $awayData[] = strip_tags($text);
            }
        }
        $standing_arr = array('home_data' => $homeData,'away_data' => $awayData);

        $analysis_data['standings'] = $standing_arr;
        //Standings data

        //Head to Head Statistics data
        $head_statistics = array();
        $awayTable = $html->find('#table_v3',0);

        foreach ($awayTable->find('tr') as $tr){
            foreach ($tr->find('td') as $td){
                $head_statistics[] = strip_tags($td);
            }
        }


        $head_idx = array('league_cup','date','home','score','ht','corner','away','W/L');

        array_splice($head_statistics, 0, 19);
        array_pop($head_statistics);

        $result = array_chunk($head_statistics,16);
        $arr_head = array();

        foreach ($result  as $row){

            array_splice($row,14,2);
            array_splice($row,7,6);

            $arr = array();
            if(isset($row[1])){
                preg_match('/formatDate\((.+?)\)/m',$row[1],$rowarr);
                $arr_date = explode(',',$rowarr[1]);
                $date = $arr_date[0].'-'.($arr_date[1]+1).'-'.$arr_date[2];
                $date = str_replace("'",'',$date);
                $row[1] = $date;
            }

            for($i=0; $i<count($row); $i++){
                $arr[$head_idx[$i]] = $row[$i];
            }

            $arr_head[] = $arr;
        }
        $analysis_data['headtohead'] = $arr_head;

        //Head to Head Statistics data


        //Previous Scores Statistics data
        $html = file_get_html('http://www.nowgoal.com/analysis/1814821.html');
        $previous_scores_table_home = $html->find('#table_v1',0);
        $previous_scores_table_away = $html->find('#table_v2',0);

        $home = $this->previous_score($previous_scores_table_home,0);
        $away = $this->previous_score($previous_scores_table_away,0);

        $result = array('previous_score_home'=>$home,'previous_score_away'=>$away);

        $analysis_data['previous_scores'] = $result;
        file_put_contents(WRITEPATH . 'uploads/analysis/'.$seq.'.json', json_encode($analysis_data));
        echo json_encode($analysis_data);
        //Previous Scores Statistics data
    }

    public function previous_score($previous_scores_table)
    {
        $previous_scores = array();
        foreach ($previous_scores_table->find('tr') as $tr){
            $previous_scores[] = $tr->index;
            foreach ($tr->find('td') as $td){
                $previous_scores[] = strip_tags($td);
            }
        }

        array_splice($previous_scores, 0, 22);

        $result = array_chunk($previous_scores,17);

        $previous_idx = array('game_idx','league','date','home','score','ht','conner','away','W/L');
        $arr_result = array();

        $last_content = array_pop($result);

        unset($result[count($result)]);

        foreach ($result  as $row){
            array_splice($row,8,6);
            array_splice($row,9,2);
            $arr = array();

            if(isset($row[2])){
                preg_match('/formatDate\((.+?)\)/m',$row[2],$rowarr);

                $arr_date = explode(',',$rowarr[1]);

                $date = $arr_date[0].'-'.($arr_date[1]+1).'-'.$arr_date[2];
                $row[2] = $date;
            }

            for($i=0; $i<count($row); $i++){
                $arr[$previous_idx[$i]] = $row[$i];
            }
            $arr_result[] = $arr;
        }
        $arr_result[] = $last_content[1];
        return $arr_result;
    }

    public function index()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/bf_kr.js?' . time());
        $res = $response->getBody();
        preg_match_all('/A\[(.+?)\]=\[(.+?)\]/is', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);
        preg_match_all('/C\[(.+?)\]=\[(.+?)\]/is', $res, $C);

        $_tmp = array();
        foreach ($A[2] as $row) {

            $_idx = array('idx', 'league_idx', 'home_idx', 'away_idx', 'home_name', 'away_name', 'game_start_time', 'second_start_time', 'game_progress', 'home_goal', 'away_goal',
                'home_1stHalf_goal', 'away_1stHalf_goal', 'home_red_card', 'away_red_card', 'home_yellow_card', 'away_yellow_card', 'home_current_rank', 'away_current_rank',
                'check1', 'odds_3in1', 'check2', 'append_content', 'continent_idx', '24', '25', 'odds_live', 'home_conner_kick', 'away_conner_kick', '29', 'league_check', '31', 'referee', 'temperature', 'division_day');

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
                        $_t = $division_day = str_replace("'", '', $arr[$i]);
                        $time = Time::parse($_t);
                        $_time = $time->addHours(9);
                        $_arr2[$_idx[$i]] = $_time;

                        $_arr2[$_idx[34]] = $_time->toDateString();
var_dump( $_idx[34]);
                    }
                    if ($i == 24) {
                        $_append = $arr[$i];
                        $_append = str_replace('|', '', $_append);
                        $_append = str_replace(';', ',', $_append);
                        $_append = str_replace(',', '","', $_append);
                        $_append = substr_replace($_append, '"', strlen($_append), 1);
                        $_append = substr_replace($_append, '"', 1, 0);
                        $arr_append = json_decode("[$_append]", true);
//                        var_dump($arr_append);

                        if (isset($arr_append[1])) {
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
                        $last_arr = count($arr_append) - 1;
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

            $day = date('Y-m-d');
            $yesterday = date("Y-m-d", strtotime("+1 day", strtotime($day)));


            if ($_arr2['division_day'] == $day && $_arr2['game_progress'] !== -1 && $_arr2['game_progress'] !== -11 && $_arr2['game_progress'] !== -13 && $_arr2['game_progress'] !== -14) {
                $_tmp['today'] = $_arr2;
            }

            $_tmp[] = $_arr2;
        }//foreach end

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

        $data['C'] = $_tmpC;
//        $this->test2();
        $json = file_get_contents(WRITEPATH . 'uploads/maindata1.json');
        $json = json_decode($json, true);
        $data['A'] = $json['A'];
        $data['B'] = $json['B'];
        $data['today'] = $json['today'];
        $data['tomorrow'] = $json['tomorrow'];
        $data['result'] = $json['result'];

        $this->view_lb->setView('welcome_message',$data);
    }

    public function main()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/bf_kr.js?' . time());
        $res = $response->getBody();
        preg_match_all('/A\[(.+?)\]=\[(.+?)\]/is', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);
        preg_match_all('/C\[(.+?)\]=\[(.+?)\]/is', $res, $C);

        $_tmp = array();
        foreach ($A[2] as $row) {
            $_idx = array('idx', 'league_idx', 'home_idx', 'away_idx', 'home_name', 'away_name', 'game_start_time', 'second_start_time', 'game_progress', 'home_goal', 'away_goal',
                'home_1stHalf_goal', 'away_1stHalf_goal', 'home_red_card', 'away_red_card', 'home_yellow_card', 'away_yellow_card', 'home_current_rank', 'away_current_rank',
                'check1', 'odds_3in1', 'check2', 'append_content', 'continent_idx', '24', '25', 'odds_live', 'home_conner_kick', 'away_conner_kick', '29', 'league_check', '31', 'referee', 'temperature',);

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
                        $_t = $division_day = str_replace("'", '', $arr[$i]);

                        $time = Time::parse($_t);
                        $_time = $time->addHours(9);
                        $_arr2[$_idx[$i]] = $_time;
                    }
                    if ($i == 24) {
                        $_append = $arr[$i];
                        $_append = str_replace('|', '', $_append);
                        $_append = str_replace(';', ',', $_append);
                        $_append = str_replace(',', '","', $_append);
                        $_append = substr_replace($_append, '"', strlen($_append), 1);
                        $_append = substr_replace($_append, '"', 1, 0);
                        $arr_append = json_decode("[$_append]", true);
//                        var_dump($arr_append);

                        if (isset($arr_append[1])) {
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
                        $last_arr = count($arr_append) - 1;
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

        $data['C'] = $_tmpC;
        $this->test2();
        $this->opponent();
        $json = file_get_contents(WRITEPATH . 'uploads/maindata1.json');
        $json = json_decode($json, true);
        $data['A'] = $json['A'];
        $data['B'] = $json['B'];
        $data['today'] = $json['today'];
        $data['tomorrow'] = $json['tomorrow'];
        $data['result'] = $json['result'];

        echo view('inc/header_v');
        echo view('main2_v', $data);
        echo view('inc/footer_v');
    }


    public function test2()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/bf_kr.js');
        $res = $response->getBody();
        preg_match_all('/A\[(.+?)\]=\[(.+)\]/m', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);
        preg_match_all('/C\[(.+?)\]=\[(.+?)\]/is', $res, $C);

        $_tmp = array();
        $_today = array();
        $_tomorrow = array();
        $_result = array();

        $_idx = array('idx', 'league_idx', 'home_idx', 'away_idx', 'home_name', 'away_name', 'game_start_time', 'second_start_time', 'game_progress', 'home_goal',
            'away_goal', 'home_1stHalf_goal', 'away_1stHalf_goal', 'home_red_card', 'away_red_card', 'home_yellow_card', 'away_yellow_card', 'home_current_rank', 'away_current_rank', 'check1',
            'odds_3in1', 'check2', 'youth_content', 'continent_idx', 'append_content', '25', 'odds_live', 'home_conner_kick', 'away_conner_kick', '29',
            'league_check', '31', 'referee', 'temperature', 'division_day');

        foreach ($A[2] as $row) {
            $json = '[' . $row . ']';

            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            if ($arr) {
                for ($i = 0; $i < count($arr); ++$i) {
                    $text = "";
                    $_arr2[$_idx[$i]] = $arr[$i];
                    if ($i == 4) {
                        $_arr2[$_idx[$i]] = strip_tags($arr[$i]);
                    }
                    if ($i == 6 || $i == 7) {
                        $_t = $division_day = str_replace("'", '', $arr[$i]);
                        $_time = date("Y-m-d H:i:s", strtotime($_t . '+9 hour'));
                        $_arr2[$_idx[$i]] = $_time;
                        $_arr2[$_idx[34]] = date('Y-m-d', strtotime($_time));
                    }
                    if ($i == 24) {
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
                    }else if ($i == 22){
                        $_arr2[$_idx[$i]] = $arr[$i];
                    }
                }
            }
            $day = date('Y-m-d');
            $tomorrow = date("Y-m-d", strtotime("+1 day", strtotime($day)));


            if ($_arr2['division_day'] == $day && $_arr2['game_progress'] !== -1 && $_arr2['game_progress'] !== -11 && $_arr2['game_progress'] !== -12 && $_arr2['game_progress'] !== -13 && $_arr2['game_progress'] !== -14) {
                $_today[] = $_arr2;
            }

            if ($_arr2['division_day'] == $tomorrow && $_arr2['game_progress'] !== -14) {
                $_tomorrow[] = $_arr2;
            }

            if ($_arr2['game_progress'] == -1 || $_arr2['game_progress'] == -10 || $_arr2['game_progress'] == -11 || $_arr2['game_progress'] == -12 || $_arr2['game_progress'] == -13 || $_arr2['game_progress'] == -14) {
                $_result[] = $_arr2;
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

        //////////////////////////////////////
        /////////////// detail ///////////////
        //////////////////////////////////////
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/detail.js?' . time());
        $res = $response->getBody();

        preg_match_all('/rq\[(.+?)\]=\"(.+?)\"/is', $res, $rq);
        preg_match_all('/tc\[(.+?)\]=\"(.+?)\"/is', $res, $tc);

        /*
         * event (1:골 2:퇴장 3:옐로우카드 4: 5: 6: 7:(녹색공)페널티킥 8:(빨간공)자책골 9:경고누적퇴장 10: 11:선수교체)
         */
        $_idx_rq = array('game_idx', 'home_away', 'event', 'min', 'name', 'goalplayer', '6', 'assistplayer');
        $_idx_tc = array(
            '46' => 'test46', '45' => 'test45', '44' => 'test44', '43' => 'test43', '42' => 'test42', '41' => 'test41', '40' => 'test40',
            '39' => 'test39', '38' => 'test38', '37' => 'test37', '36' => 'test36', '35' => 'test35', '34' => 'test34', '23' => 'test23', '20' => 'test20',
            '19' => 'test19', '16' => 'test16', '15' => 'test15', '14' => 'ball_possession', '13' => 'test13' , '12' => 'test12' , '11' => 'test11', '9' => 'test9', '8' => 'test8','7' => 'test7',
            '6' => 'test6', '5' => 'test5', '4' => 'shots_on_goal', '3' => 'shots', '0' => 'test0'
        );
        $arr_rq = array();
        $arr_tc = array();

        // 경기 rq 내용 정렬
        foreach ($rq[2] as $row) {
            $arr = explode('^', $row);

            $arr_index = array();
            for ($i = 0; $i < count($arr); $i++) {
                if ($i == 1) {
                    $arr_index[$_idx_rq[$i]] = ($arr[$i] == 1) ? 'home' : 'away';
                } else {
                    $arr_index[$_idx_rq[$i]] = $arr[$i];
                }
            }
            $arr_rq[] = $arr_index;
        }

        foreach ($tc[2] as $row) {
            $arr = explode('^', $row);
            $arr2 = explode(';', $arr[1]);

            $key_arr = array();
            foreach ($arr2 as $a2) {
                $exp = explode(',', $a2);
                    $key_arr[$_idx_tc[$exp[0]]] = array_splice($exp, 1, 2);
            }
            $arr_tc[$arr[0]] = $key_arr;
            $content = array();

            // 경기 rq 내용 추가
            for ($i = 0; $i < count($arr_rq); $i++) {
                if ($arr[0] == $arr_rq[$i]['game_idx']) {
                    array_push($content, $arr_rq[$i]);
                }
            }
//            $arr_tc[$arr[0]]['content'] = $content; //
        }

        $arr_append = array('stats'=> $arr_tc,'content'=>$arr_rq);
        $data = array('A' => $_tmp, 'B' => $_tmpB, 'today' => $_today, 'tomorrow' => $_tomorrow, 'result' => $_result, 'detail' => $arr_append);
        file_put_contents(WRITEPATH . 'uploads/maindata1.json', json_encode($data));

        return json_encode($data);
    }

    public function detail()
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://www.nowgoal.com/gf/data/detail.js?'.time());
        $res = $response->getBody();

        preg_match_all('/rq\[(.+?)\]=\"(.+?)\"/is', $res, $rq);
        preg_match_all('/tc\[(.+?)\]=\"(.+?)\"/is', $res, $tc);

        //event (1:골 7:자책골)
        $_idx_rq = array('game_idx', 'home_away', 'event', 'min', 'name', '5', '6','7');
        $_idx_tc = array(
            '46' => 'test46', '45' => 'test45', '44' => 'test44', '43' => 'test43', '42' => 'test42', '41' => 'test41', '40' => 'test40',
            '39' => 'test39', '38' => 'test38', '37' => 'test37', '36' => 'test36', '35' => 'test35', '34' => 'test34', '23' => 'test23', '20' => 'test20',
            '19' => 'test19', '16' => 'test16', '15' => 'test15', '14' => 'ball_possession', '13' => 'test13', '11' => 'test11', '9' => 'test9', '8' => 'test8',
        '7' => 'test8','6' => 'test6', '5' => 'test5', '4' => 'shots_on_goal', '3' => 'shots', '0' => 'test0'
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
        file_put_contents(WRITEPATH.'uploads/detaildata.json',json_encode($arr_append));
        echo json_encode($arr_append);
    }


    public function game_result($date = null)
    {
        if($date == null){
            $date = date("Y-m-d", strtotime("-1 day"));
        }

        $ch = curl_init();

        $url = 'http://www.nowgoal.com/GetScheduleWithTimeZone.aspx?date='.$date.'&order=time&timezone=9';

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0); // 헤더 출력 여부
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        curl_close($ch);

        preg_match_all('/A\[(.+?)\]=\[(.+)\]/m', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);

        $_idx = array('game_idx','league_idx','home_idx','away_idx','home_name','away_name','year','game_progress',
                    'home_goal','away_goal','first_home_goal','first_away_goal','home_red_card','away_red_card',
                    'home_yellow_card','away_yellow_card','16','17','18','19','20','21','22','home_c','away_c');

        $_league = array('league_idx','short_name','long_name','color','4');

        $_result_league = array();
        $_league_idx = array();
        foreach ($B[2] as $row) {
            $arr = explode(',',$row);
            unset($arr[5]);

            for($i=0; $i<count($arr); $i++){
                $_league_idx[$_league[$i]] = $arr[$i];
            }
            $_result_league[] = $_league_idx;
        }

        $_result = array();
        $arr_idx = array();
        foreach ($A[2] as $row){
            $json = '['.$row.']';
            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true);

            for ($i=0; $i<count($arr); $i++) {
                $arr_idx[$_idx[$i]] = $arr[$i];
                if($_idx[$i] == 'league_idx') {
                    $arr_idx['league_config'] = $_result_league[$arr[$i]-1];
                    }
            }
            $_result[] = $arr_idx;
        }
        if(file_exists('/home/spoto/html/writable/uploads/'.$date.'.json')){
        }else {
            file_put_contents('/home/spoto/html/writable/uploads/' . $date . '.json', json_encode($_result));
        }
        return json_encode($_result);
    }

    public function opponent()
    {
        $ch = curl_init();

        $url = 'http://www.nowgoal.com/gf/data/panlu_en.js?' . time();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0); // 헤더 출력 여부
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        curl_close($ch);

        preg_match_all('/P\[(.+?)\]=\[(.+?)\]/is', $res, $P);

        $_idx = array('league_name','color','date','home_idx','away_idx','home_goal','away_goal','first_home_goal','first_away_goal','odd');

        $_result = array();
        $opponent = array();
        foreach ($P[2] as $row){
            $json = '['.$row.']';
            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true);

            for ($i=0; $i<count($arr); $i++) {
                $opponent[$_idx[$i]] = $arr[$i];
            }

            $_result[] = $opponent;
        }
        file_put_contents('/home/spoto/html/writable/uploads/opponent.json', json_encode($_result));
        return json_encode($_result);
    }

    public function realTimeXml()
    {
        $ch = curl_init();

        $url = 'http://www.nowgoal.com/gf/data/change_en.xml?' . time();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0); // 헤더 출력 여부
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        curl_close($ch);

        //test data
/*        $res = '<?xml  version="1.0" encoding="utf-8"?><c refresh="0"><h><![CDATA[1828723^1^1^0^^^0^0^0^0^2020-01-09 06:15:00^2020-01-09 06:16:06^^^^^1^0^1^]]></h></c>';*/

        $xml = simplexml_load_string($res, null, LIBXML_NOCDATA) or die("Error: Cannot create object");

        $_idx = array('game_idx', 'gameprogress', 'home_goal', 'away_goal', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18');

        $opponent = (string)$xml->h[0];

        if($opponent !== "") {
            $opponent = explode('^', $opponent);
            unset($opponent[19]);

            $i = 0;
            $arr = array();
            foreach ($opponent as $op) {
                $arr[$_idx[$i]] = $op;
                $i++;
            }
            echo json_encode($arr);
        }else{
            echo 'noData';
        }
    }

    public function getDataJson()
    {
        $data = file_get_contents(WRITEPATH . 'uploads/maindata1.json');
        return $data;
    }

    public function getDetailJson()
    {
        $data = file_get_contents(WRITEPATH . 'uploads/detaildata1.json');
        return $data;
    }

}
