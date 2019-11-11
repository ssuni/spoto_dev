<?php namespace App\Controllers;

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
        preg_match_all('/A\[(.+?)\]=\[(.+)\]/is', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);
        preg_match_all('/C\[(.+?)\]=\[(.+?)\]/is', $res, $C);

        $_tmp = array();
        foreach($A[2] as $row) {

            var_dump($row);
            [1813701,31,7886,2639,'Alianza Petrolera','데포르티보 칼리','2019-11-11 00:30:00','2019-11-11 01:36:37',3,3,2,2,1,0,1,5,2,'(c)-7','(c)-4',1,'True',0,'',63,'',2.25,'True',2,8,1,2101,'13','Jhon Alexander Hinestroza Romana','15℃～16℃'];
            $_idx = array('idx','league_idx','home_idx','away_idx','home_name','away_name','game_start_time','second_start_time','game_progress','home_goal','away_goal',
                'home_1stHalf_goal','away_1stHalf_goal','home_red_card','away_red_card','home_yellow_card','away_yellow_card','home_current_rank','away_current_rank',
                'check1','odds_3in1','check2','check3','continent_idx','24','25','odds_3in1_image','home_conner_kick','away_conner_kick','29','league_check','31','referee','temperature');

            $json = "[{$row}]";
            $json = str_replace("'",'"',$json);
            $json = str_replace(",,,,,",',"","","","",',$json);
            $json = str_replace(",,,,",',"","","",',$json);
            $json = str_replace(",,,",',"","",',$json);
            $json = str_replace(",,",',"",',$json);
            $arr = json_decode($json, true);

//            $_tmp[] = $arr;
            // /,{2}/gi
            $_arr2 = array();
            if($arr) {
                for ($i = 0; $i < count($arr); $i++) {
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
                }
            }
            $_tmp[] = $_arr2;

        }

        $_tmpB = array();
        $j = 0;//B data 인덱스 값이 A 데이터의 필드값 매칭
        foreach($B[2] as $row){

            $_idx = array('check1','league_short','league_name','color','5','url','7','league_ranking','league_idx');

            $json = "[{$row}]";
            $json = str_replace("'",'"',$json);
            $json = str_replace(",,,,,",',"","","","",',$json);
            $json = str_replace(",,,,",',"","","",',$json);
            $json = str_replace(",,,",',"","",',$json);
            $json = str_replace(",,",',"",',$json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            if($arr) {
                for ($i = 0; $i <= count($arr); $i++) {
                    if ($i == 8) {
                        $_arr2[$_idx[$i]] = $B[1][$j];
                    } else {
                        $_arr2[$_idx[$i]] = $arr[$i];
                    }
                }
            }
            $_tmpB[] = $_arr2;
            $j++;
        }

        $_tmpC = array();

        foreach ($C[2] as $row) {

            $_idx = array('check1','location_name','check2');

            $json = "[{$row}]";
            $json = str_replace("'",'"',$json);
            $json = str_replace(",,,,,",',"","","","",',$json);
            $json = str_replace(",,,,",',"","","",',$json);
            $json = str_replace(",,,",',"","",',$json);
            $json = str_replace(",,",',"",',$json);
            $arr = json_decode($json, true);


            $_arr2 = array();
            if($arr) {
                for ($i = 0; $i < count($arr); $i++) {
                    $_arr2[$_idx[$i]] = $arr[$i];
                }
            }

            $_tmpC[] = $_arr2;
        }

        $data['A'] = $_tmp;
        $data['B'] = $_tmpB;
        $data['C'] = $_tmpC;

        echo view('inc/header_v');
        echo view('welcome_message' ,$data);
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

            $_idx = array('league_name','2','home_team_name','away_team_name','4','5','6','7','8','home_team_idx',
                'away_team_idx','11','12','13','14','15','16','17','18','19','20');

            $json = "[{$row}]";
            $json = str_replace("'",'"',$json);
            $json = str_replace(",,,,,",',"","","","",',$json);
            $json = str_replace(",,,,",',"","","",',$json);
            $json = str_replace(",,,",',"","",',$json);
            $json = str_replace(",,",',"",',$json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            for($i=0; $i<count($arr); $i++)
            {
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

        foreach($A[2] as $row) {

            $_idx = array('idx','league_idx','home_idx','away_idx','home_name','away_name','game_start_time','second_start_time','game_progress','home_goal','away_goal',
                'home_1stHalf_goal','away_1stHalf_goal','home_red_card','home_yellow_card','away_red_card','away_yellow_card','home_current_rank','away_current_rank',
                'check1','odds_3in1','check2','check3','continent_idx','24','25','odds_3in1_image','home_conner_kick','away_conner_kick','29','league_check','31','referee','temperature');

            $json = "[{$row}]";

            $json = str_replace("'",'"',$json);
            $json = str_replace(",,,,,",',"","","","",',$json);
            $json = str_replace(",,,,",',"","","",',$json);
            $json = str_replace(",,,",',"","",',$json);
            $json = str_replace(",,",',"",',$json);
            $arr = json_decode($json, true);

//            $_tmp[] = $arr;
            // /,{2}/gi
            $_arr2 = array();
            if($arr) {
                for ($i = 0; $i < count($arr); $i++) {
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
                }
            }
            $_tmp[] = $_arr2;

        }

        $_tmpB = array();
        $j = 0;//B data 인덱스 값이 A 데이터의 필드값 매칭
        foreach($B[2] as $row){

            $_idx = array('check1','league_short','league_name','color','5','url','7','league_ranking','league_idx');

            $json = "[{$row}]";
            $json = str_replace("'",'"',$json);
            $json = str_replace(",,,,,",',"","","","",',$json);
            $json = str_replace(",,,,",',"","","",',$json);
            $json = str_replace(",,,",',"","",',$json);
            $json = str_replace(",,",',"",',$json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            if($arr) {
                for ($i = 0; $i <= count($arr); $i++) {
                    if ($i == 8) {
                        $_arr2[$_idx[$i]] = $B[1][$j];
                    } else {
                        $_arr2[$_idx[$i]] = $arr[$i];
                    }
                }
            }
            $_tmpB[] = $_arr2;
            $j++;
        }
        $data = array('A'=>$_tmp,'B'=>$_tmpB);
        return json_encode($data);
    }
}
