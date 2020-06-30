<?php

namespace App\Libraries;

use CodeIgniter\Config\Config;
use App\Libraries\Conversion_lb;
use Config\Paths;
use mysql_xdevapi\Exception;
use App\Libraries\Config_lb;
use function GuzzleHttp\Psr7\_caseless_remove;
use function GuzzleHttp\Psr7\str;

class Soccer_lb
{
    public function __construct()
    {
        helper('SimpleHtmlDom');
        $this->config_lb = new Config_lb();
        $this->conversion_lb = new Conversion_lb();
    }

    function get_http_response_code($url)
    {
        $headers = get_headers($url);
        return substr($headers[0], 9, 3);
    }

    public function curl($url = null)
    {
        if ($url == null) {
            return false;
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 1); // 헤더 출력 여부
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // TimeOut 값
        curl_setopt($ch, CURLOPT_SSLVERSION, 1); // TimeOut 값
        $res = curl_exec($ch);
        curl_close($ch);

        return $res;
    }

    public function curl_easy($url = null)
    {
//        $request = new \cURL\Request($url);
//        $request->getOptions()
//            ->set(CURLOPT_TIMEOUT, 5)
//            ->set(CURLOPT_RETURNTRANSFER, true);
//        $response = $request->send();
//        return $response->getContent();
        $request = new \cURL\Request($url);
        $request->getOptions()
            ->set(CURLOPT_TIMEOUT, 5)
            ->set(CURLOPT_RETURNTRANSFER, true);
        $request->addListener('complete', function (\cURL\Event $event) {
            $response = $event->response;
            return $response->getContent();
        });

        while ($request->socketPerform()) {
            usleep(1000);
            echo '*';
        }


    }
    public function betman()
    {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://betman.co.kr/gameSchedule.so?method=basic&gameId=G101&gameRound=200022");
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // TimeOut 값
        curl_setopt($ch, CURLOPT_SSLVERSION, 1); // TimeOut 값
        $headers = [
            'Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:28.0) Gecko/20100101 Firefox/28.0',
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $server_output = curl_exec($ch);

        curl_close($ch);

        $server_output = iconv("EUC-KR", "UTF-8", $server_output);
        $html = str_get_html($server_output);

        $table = $html->find('#tblSort', 0);

        $oddData = array();
        foreach ($table->find('tr') as $tr) {

            $_arr = array();
            $_data = array();
            $i = 0;
            foreach ($tr->find('td') as $td) {
                if ($i == 2) {
                    $img = $td->find('img', 0)->src;

                    switch (true) {
                        case strpos($img, "basketball") > 0:
                            $event = 'basketball';
                            break;
                        case strpos($img, "soccer") > 0:
                            $event = 'soccer';
                            break;
                        case strpos($img, "volleyball") > 0:
                            $event = 'volleyball';
                            break;
                        case strpos($img, "baseball") > 0:
                            $event = 'baseball';
                            break;
                        default :
                            $event = "";
                            break;
                    }
                    $_data[] = $event;
                } else {
                    if ($i !== 0 && $i !== 5 && $i !== 7 && $i !== 12 && $i !== 13) {
                        $text = trim($td->innertext);
                        $text = str_replace("\t", "", $text);

                        switch ($i) {
                            case 4 :
                                $text = str_replace("<br />", ",", $text);
                                $text = preg_replace("/\s+/", "", $text);
                                $_arr_text = explode(',', $text);
                                $text = $_arr_text[0];
                                break;
                            case 6 :
                                $text = $td->find('a', 0)->innertext;
                                break;
                            case 8 :
                                $text = $td->find('a', 0)->innertext;
                                break;
                            case 9 :
                                $text = strip_tags($text);
                                $text = preg_replace("/\s+/", ",", $text);
                                break;
                        }

                        $_data[] = $text;
                    }
                }
                $_arr[] = $_data;
                $i++;
            }
            $oddData[] = $_data;
        }
        array_splice($oddData, 0, 1);

        return $oddData;
    }

    public function matchAnalysis($home_idx, $away_idx)
    {
        $_idx = array($home_idx, $away_idx);
//        $_idx = array($home_idx);

        $team_stats_data = array();

        foreach ($_idx as $idx) {
            $url = 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl' . $idx . '_en.js?' . time();
            $res = $this->curl($url);

            if ($res !== null) {
                preg_match_all('/teamCount = \[(.*?)\];/is', $res, $_arrTeamStats);
                if (isset($_arrTeamStats[1][0])) {
                    $json = '[' . $_arrTeamStats[1][0] . ']';
                    $json = str_replace("'", '"', $json);
                    $arr = json_decode($json, true);

                    $team_idx = array('game_idx', 'home_idx', 'away_idx', 'date', 'league_idx', 'league_name', 'league_color', 'home_name', 'away_name', 'home_goal',
                        'away_goal', 'fouls', 'yellow_card', 'red_card', 'possession', 'shots', 'ot', 'passes', 'passes_success', 'dribbles',
                        'corners');

                    $game_data = array();
                    $opponent_record = array();

                    foreach ($arr as $row) {    //상대전적
                        array_splice($row, 20, 1);
                        array_splice($row, 21, 11);
                        if ($idx == $_idx[0]) {
                            if (($home_idx == $row[1] && $away_idx == $row[2]) || ($away_idx == $row[1] && $home_idx == $row[2])) {

                                for ($i = 0; $i < count($row); $i++) {
                                    $opponent_record[$team_idx[$i]] = $row[$i];
                                }

                                $team_stats_data['opponent_record'][] = $opponent_record;
                            }
                        }
                    }

                    $count = count($arr);
                    if($count>=10){
                        $count = 10;
                    }else if($count < 10){
                        $count = $count;
                    }

                    for ($i = 0; $i < $count; $i++) {   //최근 20경기 리스트
                        array_splice($arr[$i], 20, 1);
                        array_splice($arr[$i], 21, 11);

                        for ($k = 0; $k < count($arr[$i]); $k++) {
                            $game_data[$team_idx[$k]] = $arr[$i][$k];
                        }
                        $team_stats_data[$idx][] = $game_data;
                    }
                }
            }
        }

//        return  $team_stats_data;
//        $detail_data = $this->conversion_lb->detail_record('1622033');
//        return $detail_data;
        //TEST

        $_arr_detail = array();
        foreach ($team_stats_data as $key => $value) {

            if (count($value) < 10) {
                $count = count($value);
            } else if (count($value) > 10) {
                $count = 10;
            } else {
                $count = count($value);
            }
            for ($i = 0; $i < $count; $i++) {
//                var_dump($value[$i]['game_idx']);
                try {
                    $detail_data = $this->conversion_lb->detail_record($value[$i]['game_idx']);
                    $_arr_detail[$key][] = $detail_data;
                } catch (\exception $e) {
                    echo $e->getMessage();
                }
            }
        }
        return $_arr_detail;
    }

    public function matchDetail($game_idx = 1622033)
    {
        $detail_data = $this->conversion_lb->detail_record($game_idx);
        return $detail_data;


        $url = 'http://www.nowgoal.com/detail/' . $game_idx . '.html';

        $get_html = $this->curl($url);

        preg_match("!\r\n(?:Location|URI): *(.*?) *\r\n!", $get_html, $matches);

        if ($matches) {
            $get_html = $this->curl($matches[1]);
        }

        return $get_html;

//var_dump($this->get_http_response_code($url));
//        if ($this->get_http_response_code($url) != "200") {
//            $url = 'http://data.nowgoal.com/detail/'.$game_idx.'.html';
//            $get_html = $this->curl($url);
//            return $get_html;
//        }else{
//            $get_html = $this->curl($url);
//            $get_header = explode('html', $get_html) ;
//            $get_header = explode(' ',$get_header[0]);
//            return $get_html;
//        }
    }

    /**
     * 메인 사이드 국가메뉴
     * @return array
     */
    public function mainLeft()
    {
        $url = 'http://www.nowgoal.com/korea/index.htm';
        $html = file_get_html($url);

        $left_idx = array('International', 'Europe', 'America', 'Asia', 'Africa', 'Oceania');

        $result = array();
        for ($i = 1; $i <= 6; $i++) {
            $ul = $html->find('ul[class=leftnav]', $i);
            $_arr = array();
            foreach ($ul->find('li') as $li) {
                $arr = explode('_', $li->id);
                foreach ($li->find('span') as $span) {
                    $_arr[] = array('idx' => $arr[1],
                        'name' => $span->innertext
                    );
                }
            }
            $result[$left_idx[$i - 1]] = $_arr;
        }

        return $result;
    }

    public function mainStanding()
    {
        $select_league_name = array('EPL', '분데스리가', '라리가', '세리에', '리그1', '에레디비지에');
        $select_league_idx = array('36', '8', '31', '34', '11', '16');
        $select_league_division = array('League', 'League', 'League', 'League', 'League', 'SubLeague');

        $_arr = array();
        for ($i = 0; $i < count($select_league_name); $i++) {
            $seasonSelect = $this->seasonSelect($select_league_idx[$i]);
            $season = $seasonSelect[0];

            $url = 'http://info.nowgoal.com/en/' . $select_league_division[$i] . '/' . $select_league_idx[$i] . '.html';
            $res = $this->curl($url);
            preg_match_all('/src="\/jsData\/matchResult\/(.+?)\?/', $res, $geturl);
            $url = 'http://info.nowgoal.com/jsData/matchResult/' . $geturl[1][0];
            $res = $this->curl($url);

            $teamSelect = $this->teamSelect($res);

            $_arr[$select_league_name[$i]] = $this->totalScore($res, $teamSelect, $select_league_division[$i], 'main');
        }
        file_put_contents('/home/spoto/html/writable/uploads/mainstanding.json', json_encode($_arr));
        return $_arr;
    }

    /**
     * 지역별 경기일정
     * @param $idx
     * @return array|mixed
     */
    public function byRegion($idx)
    {
        $url = 'http://data.nowgoal.com/MatchByCountry.aspx?infoid=' . $idx;
        $res = $this->curl($url);
        preg_match_all('/A\[(.+?)\]=\[(.+)\]/m', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);

        $arr_leagueInfo = array();
        foreach ($B[2] as $key => $value) {
            $_idx = array('region_idx', 'league_short', 'league_name', 'color', '5', 'url');

            $json = "[{$value}]";
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr2 = array();
            for ($j = 0; $j < count($arr); $j++) {
                $_arr2[$_idx[$j]] = $arr[$j];
            }
            $_arr2['league_idx'] = $key;
            $arr_leagueInfo[] = $_arr2;
        }

        $_tmp = array();
        $_today = array();
        $_tomorrow = array();
        $_result = array();

        $_idx = array('idx', 'league_idx', 'home_idx', 'away_idx', 'home_name', 'away_name', 'game_start_time',
            'game_progress', 'home_goal', 'away_goal', 'home_1stHalf_goal', 'away_1stHalf_goal', 12, 13, 14, 15,
            'home_current_rank', 'away_current_rank', 18, 19,
            'region_idx', 'append_content', 22, 23, 24, 25, 'division_day'
        );

        foreach ($A[2] as $row) {
            $json = '[' . $row . ']';
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,,,', ',"","","","",', $json);
            $json = str_replace(',,,,', ',"","","",', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $arr = json_decode($json, true);

            $_arr = array();

            if (!empty($arr)) {
                for ($i = 0; $i < count($arr); ++$i) {
                    $_arr[$_idx[$i]] = $arr[$i];
                    if ($i == 6) {
                        $arrTime = explode(',', $arr[$i]);
                        $str_time = $arrTime[0] . '-' . ($arrTime[1] + 1) . '-' . $arrTime[2] . ' ' . $arrTime[3] . ':' . $arrTime[4] . ':' . $arrTime[5];
                        $_time = date("Y-m-d H:i:s", strtotime($str_time . '+9 hour'));
                        $_arr[$_idx[$i]] = $_time;
                        $_arr[$_idx[26]] = date('Y-m-d', strtotime($_time));
                    }
                    if ($i == 21) {
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
                                $_arr[$_idx[$i]] = $text;
                            }
                        }
                    }
                }//for

                foreach ($arr_leagueInfo as $row) {
                    if ($row['league_idx'] == $_arr['league_idx']) {
                        $_arr['league_info'] = $row;
                    }
                }

                $day = date('Y-m-d');
                $tomorrow = date("Y-m-d", strtotime("+1 day", strtotime($day)));


                if ($_arr['division_day'] == $day && $_arr['game_progress'] !== -1 && $_arr['game_progress'] !== -11 && $_arr['game_progress'] !== -12 && $_arr['game_progress'] !== -13 && $_arr['game_progress'] !== -14) {
                    $_today[] = $_arr;
                }

                if ($_arr['division_day'] == $tomorrow && $_arr['game_progress'] !== -14) {
                    $_tomorrow[] = $_arr;
                }

                if ($_arr['game_progress'] == -1 || $_arr['game_progress'] == -10 || $_arr['game_progress'] == -11 || $_arr['game_progress'] == -12 || $_arr['game_progress'] == -13 || $_arr['game_progress'] == -14) {
                    $_result[] = $_arr;
                }

                $_tmp[] = $_arr;
            }//empty if
        }//foreach

        $arr_append = array('today' => $_today, 'tomorrow' => $_tomorrow);

        return $arr_append;
    }

    /**
     * 상대전적
     * @return array
     */
    public function opponent()
    {
        $url = 'http://www.nowgoal.com/gf/data/panlu_en.js?' . time();

        $res = $this->curl($url);

        preg_match_all('/P\[(.+?)\]=\[(.+?)\]/is', $res, $P);

        $_idx = array('league_name', 'color', 'date', 'home_idx', 'away_idx', 'home_goal', 'away_goal', 'first_home_goal', 'first_away_goal', 'odd');

        $_result = array();
        $opponent = array();
        foreach ($P[2] as $row) {
            $json = '[' . $row . ']';

            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true);

            for ($i = 0; $i < count($arr); $i++) {
                $opponent[$_idx[$i]] = $arr[$i];
            }
            $_result[] = $opponent;
        }
        file_put_contents('/home/spoto/html/writable/uploads/opponent.json', json_encode($_result));
        return $_result;
    }

    /**
     * 해당 경기 내용
     * @param int|null $seq
     * @return array
     */
    public function detail(int $seq = null)
    {
        $url = 'http://www.nowgoal.com/gf/data/detailIn.js?' . time();

        $res = $this->curl($url);

        $arr = explode(';', $res);

        $arr = str_replace('\r\n', '', $arr);


        $_df = array();
        for ($i = 0; $i < count($arr); $i++) {
            preg_match_all('/d_f\[' . $seq . '\]=(.+)/m', $arr[$i], $df);
            if (isset($df[1][0])) {
                $_df = $df[1];
            }
        }

        $arr_idx = array('event_idx', 'time', 'team_idx', 'player', 'asist_player', 'home_away', 'name', 'aname');
        if (isset($_df[0])) {
            $json = str_replace("'", '"', $_df[0]);
            $arr = json_decode($json, true);

            $arr_event = array();
            $_arr = array();
            foreach ($arr as $row) {
                for ($i = 0; $i < count($row); $i++) {
                    $_arr[$arr_idx[$i]] = $row[$i];
                }
                $arr_event[] = $_arr;
            }
        } else {
            echo 'false';
        }

        //종료경기 key events 테이블 데이터
        $html = file_get_html('http://www.nowgoal.com/detail/' . $seq . '.html');
        $html = preg_replace("!<script(.*?)<\/script>!is", '', $html);
        $html = str_get_html($html);

        $eventTable = $html->find('#teamEventDiv_detail table', 0);
        $eventData = array();
        foreach ($eventTable->find('tr') as $tr) {
            foreach ($tr->find('td') as $td) {
                $text = str_replace("&nbsp;", "", $td->innertext);
                foreach ($td->find('img') as $element) {
                    $text = $element->src;
                    switch ($text) {
                        case '/images/bf_img/1.png' :
                            $text = 1; //골
                            break;
                        case '/images/bf_img/7.png' :
                            $text = 7; //패널티킥
                            break;
                        case '/images/bf_img/9.png' :
                            $text = 9; //엘로우레
                            break;
                        case '/images/bf_img/2.png' :
                            $text = 2; //레드카드
                            break;
                        case '/images/bf_img/3.png' :
                            $text = 3; //엘로우카드
                            break;
                        case '/images/bf_img/11.png' :
                            $text = 11; //선수교체
                            break;
                    }
                }
                $eventData[] = strip_tags($text);
            }
        }
        //종료경기 key events 테이블 데이터

        //종료경기 Tech statistics 테이블 데이터
        $tech_table = $html->find('#teamTechDiv_detail table', 0);
        $tech_table = strip_tags($tech_table, '<tr>,<td>');
        $tech_table = str_get_html($tech_table);

        $_arr = array();
        foreach ($tech_table->find('tr') as $tr) {
            foreach ($tr->find('td') as $td) {
                if ($td->innertext !== "") {
                    $_arr[] = $td->innertext;
                }
            }
        }
        $_arr = array_chunk($_arr, 3);

        $tech_data = array();
        for ($i = 0; $i < count($_arr); $i++) {
            $_key = strtolower(preg_replace("/\s+/", "", $_arr[$i][1]));
            $_key = str_replace('(', '', $_key);
            $key = str_replace(')', '', $_key);
            unset($_arr[$i][1]);
            $tech_data[$key] = array('home' => $_arr[$i][0], 'away' => $_arr[$i][2]);
        }
        return $tech_data;
        //종료경기 Tech statistics 테이블 데이터
    }

    /**
     * 분석페이지
     * @param null $seq 게임번호
     * @return array|false|string
     */
    public function analysis($seq = null)
    {
        $_array = array();
        $score_html = file_get_html('http://www.nowgoal.com/Ajax.aspx?type=25&id=' . $seq);
//        http://data.nowgoal.com/analysis/1496576.html
        $html = file_get_html('http://www.nowgoal.com/analysis/' . $seq . '.html');

        if ($html->find('#match_time', 0)) {
            preg_match_all("/formatDate\((.+?)\)/m", $html->find('#match_time', 0), $arrTime);

        } else {
            $html = file_get_html('http://data.nowgoal.com/analysis/' . $seq . '.html');
            preg_match_all("/formatDate\((.+?)\)/m", $html, $arrTime);
        }//특정 경기에 따라 url 변동됨

        $arr = str_replace("'", '', $arrTime[1][0]);
        $arr = explode(',', $arr);

        $date = $arr[0] . '-' . ($arr[1] + 1) . '-' . $arr[2] . ' ' . $arr[3] . ':' . $arr[4] . ":" . $arr[5];
        $_time = date("Y-m-d H:i:s", strtotime($date . '+9 hour'));

        if ($score_html->find('div', 0)) {

            $firstDiv = $score_html->find('div', 0);
            $division = $firstDiv->class;

            $_array['division'] = $division;

            if ($html->find('.LName', 0)) {
                $_array['league_name'] = strip_tags($html->find('.LName', 0)->innertext);
            }
            if ($score_html->find('.score', 0) !== null) {
                $homeDiv = $score_html->find('.score', 0)->innertext;
                $awayDiv = $score_html->find('.score', 1)->innertext;
                $_array['home_score'] = $homeDiv;
                $_array['away_score'] = $awayDiv;
            }

            if ($division == 'end') {
                $rowSpan = $score_html->find('.row', 1);
                foreach ($rowSpan->find('span') as $span) {
                    $_array[str_replace(' ', '', $span->title)] = $span->innertext;
                }
            } else {
                $_array['Score1stHalf'] = "";
                $_array['Score2ndHalf'] = "";
            }
        } else {
            $_array['division'] = 'Pend';
        }

        if ($score_html->find('span', 0))
            if ($score_html->find('span', 0)->innertext == 'Postp') {
                $_array['division'] = 'Postp';
            }

        if ($html->find('#homeImg', 0)) {
            $_array['home_img'] = $html->find('#homeImg', 0)->find('img', 0)->src;
        } else {
            $_array['home_img'] = $html->find('.home', 0)->find('img', 0)->src;
        }
        if ($html->find('.sclassName', 0)) {
            $_array['home_name'] = $html->find('.sclassName', 0)->find('a', 0)->innertext;
        }
        if ($html->find('#guestImg', 0)) {
            $_array['away_img'] = $html->find('#guestImg', 0)->find('img', 0)->src;
        } else {
            $_array['away_img'] = $html->find('.guest', 0)->find('img', 0)->src;
        }
        if ($html->find('.sclassName', 1)) {
            $_array['away_name'] = $html->find('.sclassName', 1)->find('a', 0)->innertext;
        }

        if ($html->find('.sclassName', 0)) {
            $home_arr = explode('/', $html->find('.sclassName', 0)->find('a', 0)->href);
            $home_arr = explode('.', $home_arr[6]);

            $_array['home_idx'] = $home_arr[0];

            $away_arr = explode('/', $html->find('.sclassName', 1)->find('a', 0)->href);
            $away_arr = explode('.', $away_arr[6]);
            $_array['away_idx'] = $away_arr[0];
            $_array['date'] = $_time . ' ' . _yoil($_time);
        }
        $analysis_data = array();
        if ($seq == null) {
            return json_encode(array('message' => '잘못된 접근입니다.'));
        }

        //해당경기
        $url = 'http://www.nowgoal.com/Ajax.aspx?type=25&id=' . $seq;
        $res = $this->curl($url);
        $title = htmlentities($res);
        $analysis_data['title'] = $_array;

        // Create DOM from URL
        // $html = file_get_html('http://www.nowgoal.com/analysis/' . $seq . '.html');

        $homeData = array();
        $awayData = array();

        //Standings data
        $homeTable = $html->find('#porletP2 table table table', 0);
        $awayTable = $html->find('#porletP2 table table table', 1);

        foreach ($homeTable->find('tr') as $tr) {
            foreach ($tr->find('td') as $td) {
                $text = str_replace("&nbsp;", "", $td->innertext);
                $homeData[] = strip_tags($text);
            }
        }

        foreach ($awayTable->find('tr') as $tr) {
            foreach ($tr->find('td') as $td) {
                $text = str_replace("&nbsp;", "", $td->innertext);
                $awayData[] = strip_tags($text);
            }
        }
        $standing_arr = array('home_data' => $homeData, 'away_data' => $awayData);

        $analysis_data['standings'] = $standing_arr;
        //Standings data

        //Head to Head Statistics data
        $head_statistics = array();
        $awayTable = $html->find('#table_v3', 0);

        foreach ($awayTable->find('tr') as $tr) {
            foreach ($tr->find('td') as $td) {
                $td = trim(strip_tags($td));
                $head_statistics[] = strip_tags($td);
            }
        }
        $league_arr = explode('&nbsp;&nbsp;', $head_statistics[0]);

        array_splice($league_arr, 0, 2);

        $head_idx = array('league_cup', 'date', 'home', 'score', 'ht', 'corner', 'away', 'wl');

        array_splice($head_statistics, 0, 19);
        array_pop($head_statistics);

        $result = array_chunk($head_statistics, 16);
        $arr_head = array();

        foreach ($result as $row) {

            array_splice($row, 14, 2);
            array_splice($row, 7, 6);

            $arr = array();
            if (isset($row[1])) {
                preg_match('/formatDate\((.+?)\)/m', $row[1], $rowarr);
                $arr_date = explode(',', $rowarr[1]);
                $date = $arr_date[0] . '-' . ($arr_date[1] + 1) . '-' . $arr_date[2];
                $date = str_replace("'", '', $date);
                $row[1] = $date;
            }
            for ($i = 0; $i < count($row); $i++) {
                $arr[$head_idx[$i]] = $row[$i];
            }
            $arr_head[] = $arr;
        }
        $analysis_data['headtohead_league'] = $league_arr;
        $analysis_data['headtohead'] = $arr_head;
        //Head to Head Statistics data


        //Previous Scores Statistics data
        $html = file_get_html('http://www.nowgoal.com/analysis/' . $seq . '.html');
        $previous_scores_table_home = $html->find('#table_v1', 0);
        $previous_scores_table_away = $html->find('#table_v2', 0);

        $home = $this->previous_score($previous_scores_table_home, 0);
        $home_league = $this->previous_league($previous_scores_table_home, 0);
        $away = $this->previous_score($previous_scores_table_away, 0);
        $away_league = $this->previous_league($previous_scores_table_away, 0);

        $result = array(
            'previous_score_home' => $home,
            'previous_score_home_league' => $home_league,
            'previous_score_away' => $away,
            'previous_score_away_league' => $away_league);
        $analysis_data['previous_scores'] = $result;
        //Previous Scores Statistics data

        file_put_contents('/home/spoto/html/writable/uploads/analysis/' . $seq . '.json', json_encode($analysis_data));
        return $analysis_data;
    }

    public function odd($seq = null)
    {
        $_idx = array('');
        $url = 'http://1x2.nowgoal.com/' . $seq . '.js';

        if ($this->get_http_response_code($url) != "200") {
            $team_select = array();
        } else {
            $res = $this->curl($url);
            $oddData = explode('var ', $res);

            preg_match_all('/game=Array\((.+?)\);/m', $oddData[32], $game);

            $json = '[' . $game[1][0] . ']';
            $arrBettingSite = json_decode($json, true);

            foreach ($arrBettingSite as $bs) {
                $configData = explode('|', $bs);
                var_dump($configData);
                echo ' <hr>';
            }
        }
        exit;

        return $res;
    }

    /**
     * 분석페이지 테이블별  이전 점수 통계
     * @param $previous_scores_table
     * @return array
     */
    public function previous_league($previous_scores_table)
    {
        $previous_scores = array();
        foreach ($previous_scores_table->find('tr') as $tr) {
            $previous_scores[] = $tr->index;
            foreach ($tr->find('td') as $td) {
                $previous_scores[] = strip_tags($td);
            }
        }

        $league_arr = explode('&nbsp;&nbsp;', $previous_scores[1]);
        array_splice($league_arr, 0, 3);

        return $league_arr;
    }

    public function previous_score($previous_scores_table)
    {
        $previous_scores = array();
        foreach ($previous_scores_table->find('tr') as $tr) {
            $previous_scores[] = $tr->index;
            foreach ($tr->find('td') as $td) {
                $previous_scores[] = strip_tags($td);
            }
        }

        $league_arr = explode('&nbsp;&nbsp;', $previous_scores[1]);
        array_splice($league_arr, 0, 3);

        array_splice($previous_scores, 0, 22);

        $result = array_chunk($previous_scores, 17);

        $previous_idx = array('game_idx', 'league', 'date', 'home', 'score', 'ht', 'corner', 'away', 'wl', 'ex');
        $arr_result = array();

        $last_content = array_pop($result);

        unset($result[count($result)]);

        foreach ($result as $row) {
            array_splice($row, 8, 6);
            array_splice($row, 9, 2);
            $arr = array();

            if (isset($row[2])) {
                preg_match('/formatDate\((.+?)\)/m', $row[2], $rowarr);
                $rowarr[1] = str_replace("'", '', $rowarr[1]);
                $arr_date = explode(',', $rowarr[1]);

                $date = $arr_date[0] . '-' . ($arr_date[1] + 1) . '-' . $arr_date[2];
                $row[2] = $date;
            }
            if (isset($row[3])) {
                $re = '/^([0-9]{1})?(.*)/';
                $str = $row[3];

                preg_match($re, $str, $matches);
                $row[3] = $matches[2];
                $row[9] = $matches[1];
            }

            for ($i = 0; $i < count($row); $i++) {
                $arr[$previous_idx[$i]] = $row[$i];

            }
            $arr_result[] = $arr;
        }
        return $arr_result;
    }

    /**
     * 메인 실시간 변경 xml
     * @return array|bool
     */
    public function realTimeXml()
    {
        return 'dsf';

        $url = 'http://www.nowgoal.com/gf/data/change_en.xml?' . time();
        $res = $this->curl($url);

        $xml = simplexml_load_string($res, null, LIBXML_NOCDATA) or die("Error: Cannot create object");

        $_idx = array('game_idx', 'gameprogress', 'home_goal', 'away_goal', '4', '5', '6', '7', '8', '9', '10',
            '11', '12', '13', '14', '15', '16', '17', '18');

        $opponent = (string)$xml->h[0];

        if ($opponent !== "") {
            $opponent = explode('^', $opponent);
            unset($opponent[19]);

            $i = 0;
            $arr = array();
            foreach ($opponent as $op) {
                $arr[$_idx[$i]] = $op;
                $i++;
            }
            return $arr;
        } else {
            return false;
        }
    }

    public function calendar($date)
    {
        $monthLastDay = date('t', strtotime($date)); // 말일
        $prev_date = date("Y-m-d", strtotime($date . '-1 week'));
        $end_date = date("Y-m-d", strtotime($date . '+1 week'));

        $date = _createDateRange($prev_date, $end_date);

        $_arr_date = $date;
        $_calendar = array();
        foreach ($_arr_date as $date) {
            $url = 'http://www.nowgoal.com/GetScheduleWithTimeZone.aspx?date=' . $date . '&order=time&timezone=9';
//            $url = 'http://data.nowgoal.com/MatchByCountry.aspx?date='.$date.'&orderby=time&type=2';
            $res = $this->curl($url);

            preg_match_all('/A\[(.+?)\]=\[(.+)\]/m', $res, $A);
            preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);

            $_idx = array('game_idx', 'league_key', 'home_idx', 'away_idx', 'home_name', 'away_name', 'year', 'game_progress',
                'home_goal', 'away_goal', 'first_home_goal', 'first_away_goal', 'home_red_card', 'away_red_card',
                'home_yellow_card', 'away_yellow_card', '16', '17', '18', 'append_content', '20', '21', '22', 'home_c', 'away_c', '25');

            $_league = array('league_idx', 'short_name', 'long_name', 'color', '4');

            $_result_league = array();
            $_league_idx = array();
            foreach ($B[2] as $row) {
                $arr = explode(',', $row);
                unset($arr[5]);
                unset($arr[6]);

                for ($i = 0; $i < count($arr); $i++) {
                    $_league_idx[$_league[$i]] = str_replace("'", "", $arr[$i]);
                }
                $_result_league[] = $_league_idx;
            }

            if (!empty($A[2])) {
                $_result = array();
                $arr_idx = array();
                foreach ($A[2] as $row) {

                    $json = '[' . $row . ']';
                    $json = str_replace("'", '"', $json);
                    $json = str_replace(",,,", ',"","",', $json);
                    $json = str_replace(",,", ',"",', $json);
                    $arr = json_decode($json, true);

                    if ($arr) {
                        for ($i = 0; $i < count($arr); $i++) {

                            if ($i == 6) {
                                $_time = explode(',', $arr[$i]);
                                $_time = $_time[0] . '-' . ($_time[1] + 1) . '-' . $_time[2] . ' ' . $_time[3] . ':' . $_time[4] . ':' . $_time[5];
                                $_time = date("Y-m-d H:i:s", strtotime($_time . '+9 hour'));

                                $arr_idx[$_idx[$i]] = $_time;
                            } else {
                                try {
                                    $arr_idx[$_idx[$i]] = $arr[$i];
                                } catch (\Exception $e) {
                                    echo $e->getMessage();
                                }
                            }

                            if ($_idx[$i] == 'league_key') {
                                $arr_idx['league_config'] = $_result_league[$arr[$i] - 1];
                            }
                        }
                        $_result[] = $arr_idx;
                    }
                }// data foreach

                foreach ($_result as $row) {
                    $division_date = date("Y-m-d", strtotime($row['year']));
                    if ($date == $division_date) {
                        $_calendar[$date][] = $row;
                    } else {
                        $_calendar[$division_date][] = $row;
                    }
                }
            } else {
                $_calendar[$date] = array();
            }

        }// date foreach

        $count = array();
        foreach ($_calendar as $key => $value) {
            $count[$key] = count($value);
        }

        $arr_append = array('cal_count' => $count, 'result' => $_calendar);
//        file_put_contents('/home/spoto/html/writable/uploads/calendar/' . nowdate . '.json', json_encode($arr_append));
        return $arr_append;
    }

    /**
     * 경기 결과 데이터
     * @param null $date
     * @return false|string
     */
    public function game_result($date = null)
    {
        if ($date == null) {
            $date = date("Y-m-d", strtotime("-1 day")); //기본 전일 데이터
        }

        $url = 'http://www.nowgoal.com/GetScheduleWithTimeZone.aspx?date=' . $date . '&order=time&timezone=9';

        $res = $this->curl($url);

        preg_match_all('/A\[(.+?)\]=\[(.+)\]/m', $res, $A);
        preg_match_all('/B\[(.+?)\]=\[(.+?)\]/is', $res, $B);
        preg_match_all('/C\[(.+?)\]=\[(.+)\]/m', $res, $C);

        $_idx = array('game_idx', 'league_key', 'home_idx', 'away_idx', 'home_name', 'away_name', 'year', 'game_progress',
            'home_goal', 'away_goal', 'first_home_goal', 'first_away_goal', 'home_red_card', 'away_red_card',
            'home_yellow_card', 'away_yellow_card', '16', '17', '18', 'append_content', '20', '21', '22', 'home_c', 'away_c');

        $_league = array('league_idx', 'short_name', 'long_name', 'color', '4');

        $_result_league = array();
        $_league_idx = array();
        foreach ($B[2] as $row) {
            $arr = explode(',', $row);
            unset($arr[5]);
            unset($arr[6]);

            for ($i = 0; $i < count($arr); $i++) {
                $_league_idx[$_league[$i]] = str_replace("'", "", $arr[$i]);
            }
            $_result_league[] = $_league_idx;
        }

        $_result = array();
        $arr_idx = array();
        foreach ($A[2] as $row) {

            $json = '[' . $row . ']';
            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true);

            for ($i = 0; $i < count($arr); $i++) {

                if ($i == 6) {
                    $_time = explode(',', $arr[$i]);
                    $_time = $_time[0] . '-' . ($_time[1] + 1) . '-' . $_time[2] . ' ' . $_time[3] . ':' . $_time[4] . ':' . $_time[5];
                    $_time = date("Y-m-d H:i:s", strtotime($_time . '+9 hour'));

                    $arr_idx[$_idx[$i]] = $_time;
                } else {
                    $arr_idx[$_idx[$i]] = $arr[$i];
                }

                if ($_idx[$i] == 'league_key') {
                    $arr_idx['league_config'] = $_result_league[$arr[$i] - 1];
                }
            }
            $_result[] = $arr_idx;
        }
        return json_encode($_result);
        //전일 결과 생성 , 날짜별 생성은 추가해야함
        file_put_contents('/home/spoto/html/writable/uploads/result/' . $date . '.json', json_encode($_result));
        if (file_exists('/home/spoto/html/writable/uploads/result/' . $date . '.json')) {
            return file_get_contents('/home/spoto/html/writable/uploads/result/' . $date . '.json');
        } else {
            file_put_contents('/home/spoto/html/writable/uploads/result/' . $date . '.json', json_encode($_result));
        }
    }

    /**
     * 팀별 데이터
     * @param null $idx
     * @return false|string
     */
    public function test($idx = null)
    {
        $html = file_get_html('http://info.nowgoal.com/en/team/summary/' . $idx . '.html');
        preg_match_all('/SclassID = (.+?);/', $html, $class_id);

        $url = 'http://info.nowgoal.com/jsData/teamInfo/team' . $class_id[1][0] . '.js?' . time();
        $res = $this->curl($url);

        preg_match_all('/arrTeam = (.+?);/', $res, $team);

        if (isset($team[1][0]) && !empty($team[1][0])) {
            $json = str_replace("'", '"', $team[1][0]);
            $arr = json_decode($json, true);

            $arr_idx = array('team_idx', 'name', 'image');
            $team_select = array();

            foreach ($arr as $row) {
                array_splice($row, 1, 2);
                array_splice($row, 2, 1);

                $_arr = array();
                for ($i = 0; $i < count($row); $i++) {
                    $_arr[$arr_idx[$i]] = $row[$i];
                }
                $team_select[] = $_arr;
            }
            var_dump($team_select);
            exit;
        }

    }

    /**
     * 팀 기록 기본뷰 정보
     * @param null $idx
     * @return array|false|string
     */
    public function teamDataInit($idx = null)
    {
        if ($idx == null) {
            return json_encode(array('message' => '잘못된 접근입니다.'));
        }

        //teamSelect start
        if ($this->get_http_response_code('http://info.nowgoal.com/en/team/TeamNearYear/' . $idx . '.html') != "200") {
            $team_select = array();
        } else {
            $html = file_get_html('http://info.nowgoal.com/en/team/summary/' . $idx . '.html');
            preg_match_all('/SclassID = (.+?);/', $html, $class_id);

            $url = 'http://info.nowgoal.com/jsData/teamInfo/team' . $class_id[1][0] . '.js?' . time();
            $res = $this->curl($url);

            preg_match_all('/arrTeam = (.+?);/', $res, $team);

            if (isset($team[1][0]) && !empty($team[1][0])) {
                $json = str_replace("'", '"', $team[1][0]);
                $arr = json_decode($json, true);

                $arr_idx = array('team_idx', 'name', 'image');
                $team_select = array();

                foreach ($arr as $row) {
                    array_splice($row, 1, 2);
                    array_splice($row, 2, 1);

                    $_arr = array();
                    for ($i = 0; $i < count($row); $i++) {
                        $_arr[$arr_idx[$i]] = $row[$i];
                    }
                    $team_select[] = $_arr;
                }
            }
        }
        //teamSelect end

        //team_stats start
        $url = 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl' . $idx . '_en.js?' . time();
        $res = $this->curl($url);
        $team_stats_data = array();
        $team_info_data = array();
        $team_coach = array();
        $team_league_result = array();
        $team_honor = array();

        if ($res !== null) {
            preg_match_all('/teamCount = \[(.*?)\];/is', $res, $_arrTeamStats);
            preg_match_all('/teamDetail = (.+?);/', $res, $_arrTeamDetail);
            preg_match_all('/lineupDetail=\[(.+?),\[/', $res, $_arrCoach);
            preg_match_all('/countSum = (.+?);/', $res, $_arrLeagueResult);
            preg_match_all('/teamHonor = (.+?);/', $res, $_arrTeamHonor);

            //팀정보
            if (isset($_arrTeamDetail[1][0])) {
                $team_info_idx = array('team_idx', 'name', 'logo', 'city', 'home_stadium', 'capacity', 'established_date', 'website', 'team_introduce', 'adress');
                $json = str_replace('"', '', $_arrTeamDetail[1][0]);
                $json = str_replace("'", '"', $json);
                $arr = json_decode($json, true);

                array_splice($arr, 1, 1);
                array_splice($arr, 2, 1);
                array_splice($arr, 3, 2);
                array_splice($arr, 4, 2);

                $_arr = array();
                $i = 0;
                foreach ($arr as $row) {
                    if ($i == 2) {
                        $_arr[$team_info_idx[$i]] = 'http://info.nowgoal.com/Image/team/' . $row;
                    } else {
                        $_arr[$team_info_idx[$i]] = $row;
                    }
                    $i++;
                }
                $team_info_data = $_arr;
            }
            //팀정보

            //코치정보
            if (isset($_arrCoach[1][0])) {
                $json = str_replace("'", '"', $_arrCoach[1][0]);
                $arr = json_decode($json, true);
                array_splice($arr, 1, 1);
                array_splice($arr, 2, 2);
                array_splice($arr, 7, 2);
                array_splice($arr, 8, 5);

                $team_coach_idx = array('coach_idx', 'name', 'birth', 'height', 'weight', 'position', 'country', 'date');
                $_arr = array();
                $i = 0;
                foreach ($arr as $row) {
                    $_arr[$team_coach_idx[$i]] = $row;
                    $team_coach[$i] = $_arr;
                    $i++;
                }
                $team_coach = $_arr;
            }
            //코치정보

            //리그별 기록
            if (isset($_arrLeagueResult[1][0])) {

                $team_league_idx = array('league_idx', 'league_name', 'win', 'draw', 'loss', 'fouls', 'yellow_card', 'red_card', 'possession', 'shots', 'shots_ot', 'passes',
                    'passes_success', 'pass_success', 'dribbles', 'corners', 'offsides', 'heads', 'heads_ot', 'saves', 'tackles', 'off_target', 'blocked', 'throws', 'rating');

                $json = str_replace("'", '"', $_arrLeagueResult[1][0]);
                $arr = json_decode($json, true);

                $team_league_result = array();
                $_arr = array();

                foreach ($arr as $row) {
                    for ($i = 0; $i < count($row); $i++) {
                        $_arr[$team_league_idx[$i]] = $row[$i];
                    }
                    $team_league_result[] = $_arr;
                }
            }
            //리그별 기록

            //경기기록
            if (isset($_arrTeamStats[1][0])) {
                $json = '[' . $_arrTeamStats[1][0] . ']';
                $json = str_replace("'", '"', $json);
                $arr = json_decode($json, true);

                $team_idx = array('game_idx', 'home_idx', 'away_idx', 'date', 'league_idx', 'league_name', 'league_color', 'home_name', 'away_name', 'home_goal',
                    'away_goal', 'fouls', 'yellow_card', 'red_card', 'possession', 'shots', 'ot', 'passes', 'passes_success', 'dribbles',
                    '21', 'corners', '23', '24', '25', '26', '27', '28', 'off_target', '29', '30', 'rating', '32');

                $game_data = array();
                foreach ($arr as $row) {
                    for ($i = 0; $i < count($row); $i++) {
                        $game_data[$team_idx[$i]] = $row[$i];
                    }
                    $team_stats_data[] = $game_data;
                }
            }
            //경기기록

            //우승기록
            if (isset($_arrTeamHonor[1][0])) {
                $json = str_replace("'", '"', $_arrTeamHonor[1][0]);
                $arr = json_decode($json, true);

                $honor_idx = array('title', 'data', '2');

                $team_honor = array();
                foreach ($arr as $row) {
                    $_arr = array();
                    for ($i = 0; $i < count($row); $i++) {
                        if ($i == 1) {
                            $_arrData = explode(',', $row[$i]);
                            $_arr[$honor_idx[$i]] = $_arrData;
                            $_arr['count'] = count($_arrData);
                        } else {
                            $_arr[$honor_idx[$i]] = $row[$i];
                        }
                    }
                    $team_honor[] = $_arr;
                }
            }
            //우승기록
        }
        $arr_append = array('team_info_data' => $team_info_data, 'team_coach' => $team_coach, 'team_select' => $team_select, 'team_league_result' => $team_league_result, 'team_stats' => $team_stats_data,
            'team_honor' => $team_honor);
        file_put_contents(WRITEPATH . 'uploads/team/' . $idx . '.json', json_encode($arr_append));
        return $arr_append;
        //team_stats end

    }

    /**
     * 팀 기록 전체 정보
     * @param null $idx
     * @return false|string
     */
    public function teamData($idx = null)
    {
        if ($idx == null) {
            return json_encode(array('message' => '잘못된 접근입니다.'));
        }
        $url = 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl' . $idx . '_en.js?' . time();
        $res = $this->curl($url);

        //team_stats start
        preg_match_all('/teamCount = \[(.*?)\];/is', $res, $_arrTeamStats);
        $team_stats_data = array();
        if (isset($_arrTeamStats[1][0])) {
            $json = '[' . $_arrTeamStats[1][0] . ']';
            $json = str_replace("'", '"', $json);
            $json = json_decode($json, true);

            $team_idx = array('game_idx', 'home_idx', 'away_idx', 'date', 'league_idx', 'league_name', 'league_color', 'home_name', 'away_name', 'home_goal',
                'away_goal', 'fouls', 'yellow_card', 'red_card', 'possession', 'shots', 'ot', 'passes', 'passes_success', 'dribbles',
                'rating', 'corners', '23', '24', '25', '26', '27', '28', 'off_target', '29', '30', '31', '32');
            $game_data = array();

            foreach ($json as $row) {
                for ($i = 0; $i < count($row); $i++) {
                    $game_data[$team_idx[$i]] = $row[$i];
                }
                $team_stats_data[] = $game_data;
            }
        }

        //우승기록
        preg_match_all('/teamHonor = (.+?);/', $res, $_arrTeamHonor);
        $json = str_replace("'", '"', $_arrTeamHonor[1][0]);
        $arr = json_decode($json, true);

        $honor_idx = array('title', 'data', '2');

        $team_honor = array();
        foreach ($arr as $row) {
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                if ($i == 1) {
                    $_arrData = explode(',', $row[$i]);
                    $_arr[$honor_idx[$i]] = $_arrData;
                    $_arr['count'] = count($_arrData);
                } else {
                    $_arr[$honor_idx[$i]] = $row[$i];
                }
            }
            $team_honor[] = $_arr;
        }

        //league_stats start
        preg_match_all('/leagueData = (.+?);/is', $res, $_arrLeague);

        $league_stats_data = array();
        if (isset($_arrLeague[1][0]) && $_arrLeague[1][0] !== '[]') {

            preg_match_all('/\[\[(.+?)\],0]/m', $_arrLeague[1][0], $_arrLeagueStats);

            $json = '[[' . $_arrLeagueStats[1][0] . ']]';
            $json = str_replace("'", '"', $json);
            $_arrLeagueStats = json_decode($json, true);

            $league_idx = array('P', 'W', 'D', 'L', 'Get', 'Miss', 'Net', 'Wp', 'Dp', 'Lp', 'average_get', 'average_miss', 'pts');
            $league_stats_data = array();
            $league_data = array();

            if ($_arrLeagueStats !== null) {
                foreach ($_arrLeagueStats as $row) {

                    for ($i = 0; $i < count($row); $i++) {
                        $league_data[$league_idx[$i]] = $row[$i];
                    }
                    $league_stats_data[] = $league_data;
                }
            }
        }

        //cup_stats start
        preg_match_all('/cupData = (.+?);/is', $res, $_arrCupData);
        $cup_info = array();
        $cup_stats = array();
        if (isset($_arrCupData[1][0]) && $_arrCupData[1][0] !== '[]') {
            $json = $_arrCupData[1][0];
            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true); //CUP info JSON

            //cup info
            $league_info_arr = array('league_idx', 'name', 'date');

            foreach ($arr as $row) {
                array_splice($row, 1, 2);
                $_arr = array();
                for ($i = 0; $i < count($row); $i++) {
                    $row[$i] = str_replace(' ', '', $row[$i]);
                    $_arr[$league_info_arr[$i]] = $row[$i];
                }
                $cup_info[] = $_arr;
            }
            //cup info

            if ($arr !== null) {
                $cup_stats = array(); //cup data
                $arr_cup = array();
                for ($i = 0; $i < count($arr); $i++) {
                    $cup_num = $arr[$i][0];
                    $cup_name = $arr[$i][3];
                    $cup_season = $arr[$i][4];

                    $url = 'http://info.nowgoal.com/jsData/letGoal/' . $cup_season . '/l' . $cup_num . '.js?' . time();
                    $res = $this->curl($url);

                    if ($res !== null) {
                        $handcap_idx = array('rank', 'idx', 'games', 'give_handicap', 'void1', 'accept_handicap', 'win',
                            'void2', 'loss', 'net', 'win_per', 'void_per', 'loss_per');
                        preg_match_all('/TotalPanLu = \[(.+?)\];/m', $res, $_totalPanlu);
                        preg_match_all('/HomePanLu = \[(.+?)\];/m', $res, $_homePanlu);
                        preg_match_all('/GuestPanLu = \[(.+?)\];/m', $res, $_guestPanlu);

                        preg_match_all('/TotalHalfPanLu = \[(.+?)\];/m', $res, $_totalHalfPanlu);
                        preg_match_all('/HomeHalfPanLu = \[(.+?)\];/m', $res, $_homeHalfPanlu);
                        preg_match_all('/GuestHalfPanLu = \[(.+?)\];/m', $res, $_guestHalfPanlu);


                        if (!empty($_totalPanlu[1]) && !empty($_homePanlu[1]) && !empty($_guestPanlu[1]) && !empty($_totalHalfPanlu[1]) && !empty($_homeHalfPanlu[1]) && !empty($_guestHalfPanlu[1])) {
                            $jsonPanlu = '[' . $_totalPanlu[1][0] . ']';
                            $jsonHome = '[' . $_homePanlu[1][0] . ']';
                            $jsonGuest = '[' . $_guestPanlu[1][0] . ']';

                            $arrPanlu = json_decode($jsonPanlu, true);
                            $arrHome = json_decode($jsonHome, true);
                            $arrGuest = json_decode($jsonGuest, true);

                            $jsonHalfPanlu = '[' . $_totalHalfPanlu[1][0] . ']';
                            $jsonHalfHome = '[' . $_homeHalfPanlu[1][0] . ']';
                            $jsonHalfGuest = '[' . $_guestHalfPanlu[1][0] . ']';

                            $arrHalfPanlu = json_decode($jsonHalfPanlu, true);
                            $arrHalfHome = json_decode($jsonHalfHome, true);
                            $arrHalfGuest = json_decode($jsonHalfGuest, true);

                            foreach ($arrPanlu as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$handcap_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['totalPanlu'] = $_arr;
                                }
                            }
                            foreach ($arrHome as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$handcap_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['homePanlu'] = $_arr;
                                }
                            }
                            foreach ($arrGuest as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$handcap_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['guestPanlu'] = $_arr;
                                }
                            }
                            foreach ($arrHalfPanlu as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$handcap_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['totalHalfPanlu'] = $_arr;
                                }
                            }
                            foreach ($arrHalfHome as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$handcap_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['homeHalfPanlu'] = $_arr;
                                }
                            }
                            foreach ($arrHalfGuest as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$handcap_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['guestHalfPanlu'] = $_arr;
                                }
                            }
                        }
                    }

                    $url = 'http://info.nowgoal.com/jsData/bigSmall/' . $cup_season . '/bs' . $cup_num . '.js?' . time();
                    $res = $this->curl($url);

                    if ($res !== null) {
                        //over,under data
                        $overUnder_idx = array('rank', 'team_idx', 'games', 'over', 'void', 'under', 'over_per', 'void_per', 'under_per');
                        preg_match_all('/TotalBs = \[(.+?)\];/m', $res, $_totalBs);
                        preg_match_all('/HomeBs = \[(.+?)\];/m', $res, $_homeBs);
                        preg_match_all('/GuestBs = \[(.+?)\];/m', $res, $_guestBs);

                        preg_match_all('/TotalBsHalf = \[(.+?)\];/m', $res, $_totalBsHalf);
                        preg_match_all('/HomeBsHalf = \[(.+?)\];/m', $res, $_homeBsHalf);
                        preg_match_all('/GuestBsHalf = \[(.+?)\];/m', $res, $_guestBsHalf);

                        if (!empty($_totalBs[1]) && !empty($_homeBs[1]) && !empty($_guestBs[1]) && !empty($_totalBsHalf[1]) && !empty($_homeBsHalf[1]) && !empty($_guestBsHalf[1])) {
                            $jsonTotalBs = '[' . $_totalBs[1][0] . ']';
                            $jsonHomeBs = '[' . $_homeBs[1][0] . ']';
                            $jsonGuestBs = '[' . $_guestBs[1][0] . ']';

                            $arrTotalBs = json_decode($jsonTotalBs, true);
                            $arrHomeBs = json_decode($jsonHomeBs, true);
                            $arrGuestBs = json_decode($jsonGuestBs, true);

                            $jsonTotalBsHalf = '[' . $_totalBsHalf[1][0] . ']';
                            $jsonHomeBsHalf = '[' . $_homeBsHalf[1][0] . ']';
                            $jsonGuestBsHalf = '[' . $_guestBsHalf[1][0] . ']';

                            $arrTotalBsHalf = json_decode($jsonTotalBsHalf, true);
                            $arrHomeBsHalf = json_decode($jsonHomeBsHalf, true);
                            $arrGuestBsHalf = json_decode($jsonGuestBsHalf, true);

                            foreach ($arrTotalBs as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$overUnder_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['totalBs'] = $_arr;
                                }
                            }
                            foreach ($arrHomeBs as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$overUnder_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['homeBs'] = $_arr;
                                }
                            }
                            foreach ($arrGuestBs as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$overUnder_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['guestBs'] = $_arr;
                                }
                            }
                            foreach ($arrTotalBsHalf as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$overUnder_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['totalBsHalf'] = $_arr;
                                }
                            }
                            foreach ($arrHomeBsHalf as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$overUnder_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['homeBsHalf'] = $_arr;
                                }
                            }
                            foreach ($arrGuestBsHalf as $row) {
                                if ($idx == $row[1]) {
                                    $_arr = array();
                                    for ($j = 0; $j < count($row); $j++) {
                                        $_arr[$overUnder_idx[$j]] = $row[$j];
                                    }
                                    $arr_cup['guestBsHalf'] = $_arr;
                                }
                            }
                        }
                    }
                    $cup_stats[$cup_name] = $arr_cup;
                }
            }
        }
        //cup_stats end

        //achievements start
        if ($this->get_http_response_code('http://info.nowgoal.com/en/team/TeamNearYear/' . $idx . '.html') != "200") {
            $achievements = array();
        } else {
            $html = file_get_html('http://info.nowgoal.com/en/team/TeamNearYear/' . $idx . '.html');
            $achievements = array();
            foreach ($html->find('#div_Table2') as $div) {
                $title = $div->find('.main_title ');
                $table = $div->find('table');

                for ($i = 0; $i < count($table); $i++) {
                    $achievements[$i]['title'] = $title[$i]->innertext;
                    $_arr = array();

                    foreach ($table[$i]->find('tr') as $tr) {
                        foreach ($tr->find('td') as $td) {
                            $text = str_replace("&nbsp;", "", $td->innertext);
                            $text = str_replace(" ", "", $text);
                            $_arr[] = $text;
                            $arr = array_chunk($_arr, 14);
                        }
                    }
                    $achievements[$i]['data']['total'] = $arr[1];
                    $achievements[$i]['data']['home'] = $arr[2];
                    $achievements[$i]['data']['away'] = $arr[3];
                }
            }
        }

        //schedule start
        $url = 'http://info.nowgoal.com/en/team/TeamScheAjax.aspx?TeamID=' . $idx . '&pageNo=1';
        $res = $this->curl($url);

        preg_match_all('/teamPageData = \[(.+?)\];/m', $res, $team_schedule);

        if (isset($team_schedule[1][0])) {
            $team_schedule_idx = array('game_idx', 'league_idx', 'color', 'date', 'home_team_idx', 'away_team_idx', 'score', 'half_score', 'league_short',
                'home_name', 'away_name', 'home_red', 'away_red');

            $json = '[' . $team_schedule[1][0] . ']';
            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true);

            $schedule = array();
            $_arr = array();
            foreach ($arr as $row) {
                array_splice($row, 8, 2);
                array_splice($row, 9, 2);
                array_splice($row, 10, 2);
                array_splice($row, 13, 5);

                if ($row[6] == '推迟') {
                    $row[6] = 'Delay';
                }

                for ($i = 0; $i < count($row); $i++) {
                    $_arr[$team_schedule_idx[$i]] = $row[$i];
                }
                $schedule[] = $_arr;
            }
        }

        //lineup start
        $url = 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl' . $idx . '_en.js?' . time();
        $res = $this->curl($url);

        preg_match_all('/lineupDetail=\[(.+?)\];/m', $res, $team_lineup);
        $lineup = array();
        if (isset($team_lineup[1][0]) && $team_lineup[1][0] !== null) {
            $json = '[' . $team_lineup[1][0] . ']';
            $json = str_replace("'", '"', $json);
            $json = str_replace(" ", "", $json);
            $arr = json_decode($json, true);

            $lineup_idx = array('player_idx', 'player_num', 'name', 'birth', 'height', 'weight', 'position', 'country',
                'estimated', 'contract_expires', 'startgoal1', 'startgoal2', 'subgoal1', 'subgoal2', 'assit'
            );

            $_arr = array();

            foreach ($arr as $row) {
                array_splice($row, 3, 2);
                array_splice($row, 8, 1);

                for ($i = 0; $i < count($row); $i++) {
                    $_arr[$lineup_idx[$i]] = $row[$i];
                }
                $lineup[] = $_arr;
            }
        }

        //player_data start

        if ($this->get_http_response_code('http://info.nowgoal.com/en/team/PlayerData/' . $idx . '.html') != "200") {
            $test = array();
        } else {
            $html = file_get_html('http://info.nowgoal.com/en/team/PlayerData/' . $idx . '.html');

            preg_match_all("/currMatchSeason = (.+?);/", $html, $currMatchSeason);

            $select = $html->find('select', 0)->find('option[selected=selected]', 0);

            $first_league['league_idx'] = (int)$select->value;
            $first_league['league_name'] = $select->innertext;
            $first_league['year'] = $currMatchSeason[1][0];

            preg_match_all('/cupData = \[(.+?)\];/m', $res, $team_player_data);

            $league_arr = array();
            $league_arr[] = $first_league;

            $player_data = array();
            if (isset($team_player_data[1][0]) && $team_player_data !== null) {
                $json = '[' . $team_player_data[1][0] . ']';
                $json = str_replace("'", '"', $json);
                $arr = json_decode($json, true);

                $_arr = array();
                foreach ($arr as $row) {
                    array_splice($row, 1, 2);

                    $_arr['league_idx'] = $row[0];
                    $_arr['league_name'] = $row[1];
                    $_arr['year'] = $row[2];
                    $league_arr[] = $_arr;
                }

                $player_idx = array('rank', 'player', 'country', 'goals', 'goalwin', 'goaldraw', 'goalloss', 'yellow_card', 'red_card');
                for ($i = 0; $i < count($league_arr); $i++) {

                    if ($this->get_http_response_code('http://info.nowgoal.com/en/team/PlayerDataAjax.aspx?SclassID=' . $league_arr[$i]['league_idx'] . '&matchSeason=' . $league_arr[$i]['year'] . '&teamID=' . $idx) != "200") {
                        $test = array();
                    } else {
                        $html = file_get_html('http://info.nowgoal.com/en/team/PlayerDataAjax.aspx?SclassID=' . $league_arr[$i]['league_idx'] . '&matchSeason=' . $league_arr[$i]['year'] . '&teamID=' . $idx);
                        $table = $html->find('table', 0);

                        $_arr = array();
                        foreach ($table->find('tr') as $tr) {
                            foreach ($tr->find('td') as $td) {
                                $item = str_replace(' ', '', strip_tags($td->innertext));
                                foreach ($td->find('a') as $a) {
                                    $href = explode('/', $a->href);
                                    $player_arr = explode('.', $href[4]);
                                    $item = array('player_idx' => $player_arr[0],
                                        'name' => str_replace(' ', '', strip_tags($td->innertext))
                                    );
                                }
                                $_arr[] = $item;
                            }
                        }
                        array_splice($_arr, 0, 9);
                        $arr_chunk = array_chunk($_arr, 9);

                        $_arr = array();
                        $_arr_result = array();
                        foreach ($arr_chunk as $row) {
                            for ($j = 0; $j < count($row); $j++) {
                                $_arr[$player_idx[$j]] = $row[$j];
                            }
                            $_arr_result[] = $_arr;
                        }
                        $player_data[$league_arr[$i]['league_name']] = $_arr_result;
                    }
                }//league for
            }
        }

        //player_data end

        //Transfer start
        $html = file_get_html('http://info.nowgoal.com/en/team/PlayerData/' . $idx . '.html');
        preg_match_all("/currMatchSeason = (.+?);/", $html, $currMatchSeason);

        $season = $currMatchSeason[1][0];

        $html = file_get_html('http://info.nowgoal.com/en/team/PlayerZhAjax.aspx?matchSeason=' . $season . '&teamID=' . $idx);

        $tableCount = count($html->find('table'));

        $transfer_table = array('Join In', 'Departure');
        $transfer_idx = array('time', 'player', 'position', 'from', 'type');
        $transfer_data = array();
        for ($i = 0; $i < $tableCount; $i++) {
            $_arr = array();
            foreach ($html->find('table', $i)->find('tr') as $tr) {
                foreach ($tr->find('td') as $td) {
                    $_arr[] = strip_tags($td->innertext);
                }
            }
            array_splice($_arr, 0, 5);
            $arr_chunk = array_chunk($_arr, 5);
            $_arr = array();
            $_arr_result = array();
            foreach ($arr_chunk as $row) {
                for ($j = 0; $j < count($row); $j++) {
                    $_arr[$transfer_idx[$j]] = trim($row[$j]);
                }
                $_arr_result[] = $_arr;
            }
            $transfer_data[$transfer_table[$i]] = $_arr_result;
        }


        //Transfer end
        $arr_append = array('team_stats' => $team_stats_data, 'team_honor' => $team_honor, 'cup_info' => $cup_info, 'league_stats' => $league_stats_data, 'cup_stats' => $cup_stats,
            'achievements' => $achievements, 'schedule' => $schedule, 'lineup' => $lineup, 'player_data' => $player_data);
        file_put_contents(WRITEPATH . 'uploads/team/' . $idx . '.json', json_encode($arr_append));

        return $arr_append;
    }

    /**
     * 팀별 이적 선수정보
     * @param $idx
     * @param null $season
     * @return array
     */
    public function transfer($idx, $season = null)
    {
        //Season select
        $html = file_get_html('http://info.nowgoal.com/en/team/PlayerZh/' . $idx . '.html');

        $select = $html->find('select', 0);

        $seasonOption = array();
        if ($select !== null) {
            $seasonOption = array();
            foreach ($select->find('option') as $option) {
                $seasonOption[] = trim($option->innertext);
            }
        }
        //Transfer start
        $html = file_get_html('http://info.nowgoal.com/en/team/PlayerData/' . $idx . '.html');
        preg_match_all("/currMatchSeason = (.+?);/", $html, $currMatchSeason);

        if ($season == null) {
            $season = $currMatchSeason[1][0];
        }

        $html = file_get_html('http://info.nowgoal.com/en/team/PlayerZhAjax.aspx?matchSeason=' . $season . '&teamID=' . $idx . '&flesh=0.701041995316626');
        $tableCount = count($html->find('table'));

        $transfer_table = array('Join In', 'Departure');
        $transfer_idx = array('time', 'player_idx', 'player', 'position', 'team_idx', 'from', 'type');
        $transfer_data = array();
        for ($i = 0; $i < $tableCount; $i++) {
            $_arr = array();
            foreach ($html->find('table', $i)->find('tr') as $tr) {
                foreach ($tr->find('td') as $td) {
                    foreach ($td->find('a') as $a) {
                        $_a = explode('/', $a->href);
                        $_arr_idx = explode('.', $_a[4]);
                        $_player_idx = $_arr_idx[0];
                        $_arr[] = $_player_idx;
                    }
                    $_arr[] = strip_tags($td->innertext);
                }
            }

            array_splice($_arr, 0, 5);
            $arr_chunk = array_chunk($_arr, 7);
            $_arr = array();
            $_arr_result = array();
            foreach ($arr_chunk as $row) {
                for ($j = 0; $j < count($row); $j++) {
                    $_arr[$transfer_idx[$j]] = trim($row[$j]);
                }
                $_arr_result[] = $_arr;
            }
            $transfer_data[$transfer_table[$i]] = $_arr_result;
        }

        $arr_append = array('season' => $seasonOption, 'transfer' => $transfer_data);

        return $arr_append;
        //Transfer end
    }

    public function teamDatabase()
    {
        $url = 'http://info.nowgoal.com/jsData/infoHeaderEn.js';
        $res = $this->curl($url);

        preg_match_all('/arr\[(.+?)\] = (.+?);/m', $res, $arrTeam);

        $_arrEuro = array();
        $_arrAmerica = array();
        $_arrAsia = array();
        $_arrOceania = array();
        $_arrAfrica = array();
        foreach ($arrTeam[2] as $row) {
            $arr = json_decode($row, true);

            switch ($arr[3]) {
                case '1' :
                    $_arrEuro[$arr[1]] = array('img' => $arr[2], 'data' => $this->teamData_func($arr));
                    break;
                case '2' :
                    $_arrAmerica[$arr[1]] = array('img' => $arr[2], 'data' => $this->teamData_func($arr));
                    break;
                case '3' :
                    $_arrAsia[$arr[1]] = array('img' => $arr[2], 'data' => $this->teamData_func($arr));
                    break;
                case '4' :
                    $_arrOceania[$arr[1]] = array('img' => $arr[2], 'data' => $this->teamData_func($arr));
                    break;
                case '5' :
                    $_arrAfrica[$arr[1]] = array('img' => $arr[2], 'data' => $this->teamData_func($arr));
                    break;
            }
        }
        $arr_append = array('Euro' => $_arrEuro, 'America' => $_arrAmerica, 'Asia' => $_arrAsia, 'Oceania' => $_arrOceania, 'Africa' => $_arrAfrica);

        return $arr_append;

    }

    /**
     * 리그 순위표 사이드 메뉴
     * @return false|string
     */
    public function left_select()
    {
        $url = 'http://info.nowgoal.com/jsData/leftData/leftData.js';
        $res = $this->curl($url);

        $res = str_replace("'", '"', $res);

        preg_match_all('/arrArea\[(.+?)\] = (.+?);/', $res, $continent);

        $arr_idx = array('league_idx', 'name', 'division');
        $continent_idx = array('intercontinental', 'european', 'america', 'asian', 'oceania', 'africa');

        $result = array();
        $z = 0;
        foreach ($continent[2] as $row) {
            $arr_continent = array();
            $arr = json_decode($row, true);
            $count = count($arr);
            for ($i = 0; $i < $count; $i++) {

                $continent_name = $arr[$i][2];

                $continent_league = $arr[$i][4];
                $league_count = count($continent_league);

                $continent_league2 = $arr[$i][5];
                $league_count2 = count($continent_league2);

                if (!empty($continent_league)) {
                    for ($j = 0; $j < $league_count; $j++) {
                        array_splice($continent_league[$j], 1, 2);
                        $_arr = array();
                        for ($k = 0; $k < count($continent_league[$j]); $k++) {
                            switch ($continent_league[$j][2]) {
                                case '1' :
                                    $continent_league[$j][2] = 'League';
                                    break;
                                case '0' :
                                    $continent_league[$j][2] = 'SubLeague';
                                    break;
                                case '2':
                                    $continent_league[$j][2] = 'CupMatch';
                                    break;
                                default :
                                    $continent_league[$j][2] = $continent_league[$j][2];
                                    break;
                            }
                            $_arr[$arr_idx[$k]] = $continent_league[$j][$k];
                        }
                        $arr_continent[$continent_name][] = $_arr;
                    }
                }
                if (!empty($continent_league2)) {
                    for ($j = 0; $j < $league_count2; $j++) {
                        array_splice($continent_league2[$j], 1, 2);
                        $_arr = array();
                        for ($k = 0; $k < count($continent_league2[$j]); $k++) {
                            switch ($continent_league2[$j][2]) {
                                case '1' :
                                    $continent_league2[$j][2] = 'League';
                                    break;
                                case '0' :
                                    $continent_league2[$j][2] = 'SubLeague';
                                    break;
                                case '2':
                                    $continent_league2[$j][2] = 'CupMatch';
                                    break;
                                default :
                                    $continent_league2[$j][2] = $continent_league2[$j][2];
                                    break;
                            }
                            $_arr[$arr_idx[$k]] = $continent_league2[$j][$k];
                        }
                        $arr_continent[$continent_name][] = $_arr;
                    }
                }
            }//for
            $result[$continent_idx[$z]] = $arr_continent;
            $z++;
        }//foreach
        file_put_contents('/home/spoto/html/writable/uploads/config/league.json', json_encode($result));
        return $result;
    }

    /**
     * 리그 순위표 메인 (리그 / 서브리그 / 컵매치)
     * subClass = (league / off / final...)
     * @param null $idx
     * @param null $season
     * @param null $division
     * @param null $subClass
     * @return array|bool|mixed
     */
    public function leaderboardData($idx = null, $season = null, $division = null, $subClass = null)
    {
        if ($idx == null || $division == null) {
            return false;
        }

        if ($division !== 'League' && $division !== 'SubLeague' && $division !== 'CupMatch') {
            return false;
        }

        if ($season == null) {
            $url = 'http://info.nowgoal.com/en/' . $division . '/' . $idx . '.html';
        } else {
            if ($subClass == null) {
                $url = 'http://info.nowgoal.com/en/' . $division . '/' . $season . '/' . $idx . '.html';
            } else {
                $url = 'http://info.nowgoal.com/en/' . $division . '/' . $season . '/' . $idx . '/' . $subClass . '.html';
            }
        }
        $res = $this->curl($url);

        preg_match_all('/src="\/jsData\/matchResult\/(.+?)\?/', $res, $geturl);

        $_jsonUrl = explode('/', $geturl[1][0]);

        if ($season == null) {
            $url = 'http://info.nowgoal.com/jsData/matchResult/' . $geturl[1][0];
        } else {
            $url = 'http://info.nowgoal.com/jsData/matchResult/' . $season . '/' . $_jsonUrl[1];
        }
        $res = $this->curl($url);

        switch ($division) {
            case 'League' :
                $data = $this->leagueDatabase($res, $idx, $season);
                break;
            case 'SubLeague' :
                $data = $this->subleagueDatabase($res, $idx, $_jsonUrl[1], $subClass, $season);
                break;
            case 'CupMatch' :
                $data = $this->cupDatabase($res, $idx);
                break;
            default :
                $data = $this->roundScore($res, $idx, $season, 27);
                break;
        }
        return $data;
    }

    /**
     * 리그 순위표 메인리그 데이터
     * @param $res
     * @param $idx
     * @param $season
     * @return array
     */
    private function leagueDatabase($res, $idx, $season)
    {
        $seasonSelect = $this->seasonSelect($idx);

        if ($season == null) {
            $season = $seasonSelect[0];
        } else {
            $season = $season;
        }

        //Team Select
        $teamSelect = $this->teamSelect($res);

        //Top Title
        $topTitle = $this->topTitle($res);

        //Schedule
        $totalRound = $topTitle['mainTitle']['total_round'];
        $thisRound = $topTitle['mainTitle']['this_round'];
        $schedule = $this->schedule($res, $totalRound, $teamSelect, 'League');

        //Total Score
        $totalScore = $this->totalScore($res, $teamSelect, 'League');

        //Round Score
        $roundScore = $this->roundScore($res, $teamSelect, 'League', $topTitle['mainTitle']['this_round']);

        $homeScore = $this->homeScore($res, $teamSelect, 'League', $topTitle['mainTitle']['this_round']);

        //Tech Stats
        $techStats = $this->techStats($idx, $season);

        //Team profiles
        $teamProfiles = $this->teamProfiles($idx);

        //First goal/lose
        $firstGoalLose = $this->firstGoalLose($idx, $season, $teamSelect);

        //No goal/lose
        $noGoalLose = $this->noGoalLose($idx, $season, $teamSelect);

        $arr_append = array('techStats' => $techStats, 'roundScore' => $roundScore, 'teamSelect' => $teamSelect, 'seasonSelect' => $seasonSelect, 'topTitle' => $topTitle, 'schedule' => $schedule, 'totalScore' => $totalScore,
            'teamProfiles' => $teamProfiles, 'firstGoalLose' => $firstGoalLose, 'noGoalLose' => $noGoalLose
        );

        return $arr_append;
    }

    /**
     * 리그 순위표 서브리그 데이터
     * @param $res
     * @param $idx
     * @param $url
     * @param $season
     * @return array
     */
    private function subLeagueDatabase($res, $idx, $url, $subClass, $season)
    {
        $arrUrl = explode('_', $url);
        $subClass = $arrUrl[1];

        $seasonSelect = $this->seasonSelect($idx);

        if ($season == null) {
            $season = $seasonSelect[0];
        } else {
            $season = $season;
        }

        //Team Select
        $teamSelect = $this->teamSelect($res);

        //Top Nav
//        $topNav = $this->topNav($res);

        //Top Title
        $topTitle = $this->topTitle($res, 'SubLeague');

        foreach ($topTitle['subTitle'] as $row) {
            if ($row['league_idx'] == $subClass) {
                $topTitle['subTitle'] = $row;
            }
            $topTitle['nav'][] = $row;
        }

        $subClass = $topTitle['subTitle']['title'];

        //Schedule
        $totalRound = $topTitle['subTitle']['total_round'];
        $thisRound = $topTitle['subTitle']['this_round'];
        $schedule = $this->schedule($res, $totalRound, $teamSelect, $subClass);

        //Total Score
        if ($topTitle['subTitle']['title'] == 'League') {
            $totalScore = $this->totalScore($res, $teamSelect, 'SubLeague');
        } else {
            $totalScore = array();
        }

        //Round Score
        $roundScore = $this->roundScore($res, $teamSelect, 'SubLeague', $topTitle['subTitle']['this_round']);

        //Tech Stats
        $techStats = $this->techStats($idx, $season);

        //Team profiles
        $teamProfiles = $this->teamProfiles($idx);

        //First goal/lose
        $firstGoalLose = $this->firstGoalLose($idx, $season, $teamSelect);

        //No goal/lose
        $noGoalLose = $this->noGoalLose($idx, $season, $teamSelect);

        $arr_append = array('roundScore' => $roundScore, 'teamSelect' => $teamSelect, 'seasonSelect' => $seasonSelect, 'topTitle' => $topTitle, 'schedule' => $schedule, 'totalScore' => $totalScore,
            'techStats' => $techStats, 'teamProfiles' => $teamProfiles, 'firstGoalLose' => $firstGoalLose, 'noGoalLose' => $noGoalLose
        );

        return $arr_append;
    }

    /**
     * 리그 순위표 컵 데이터
     * @param $res
     * @param $idx
     * @return array|mixed
     */
    private function cupDatabase($res, $idx)
    {
        preg_match_all('/arrCup = (.+?);/', $res, $strTitle);
        preg_match_all('/arrCupKind = (.+?);/', $res, $strCupKind);
        preg_match_all('/arrTeam = (.+?);/', $res, $strTeam);
        preg_match_all('/jh\[(.+?)\] = \[(.+?)\];/m', $res, $strJh);

        $seasonSelect = $this->seasonSelect($idx);

        $group_idx = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J');
        $title_idx = array('cup_idx', 'check1', 'check2', 'name', 'check4', 'check5', 'short_name', 'year', 'img', 'color', 'check10');
        $team_idx = array('team_idx', 1, 2, 'name', 4);
        $cupkind_idx = array('cupkind_idx', 'check1', 'name', 'count', 5, 6);
        $game_idx = array('game_idx', 'league_idx', 'game_progress', 'date', 'home_team_idx', 'away_team_idx', 'score', 'ht_score', 8, 9,
            'handicap_ft', 'handicap_ht', 'over_under_ft', 'over_under_ht', 14, 15,
            16, 17, 18, 19, 20, 21, 'append_content', 23, 'home_rank', 'away_rank');
        $rank_idx = array('rank', 'team_idx', 'total', 'win', 'draw', 'loas', 'get', 'miss', 'net', 'pts', 10);

        $jsonTitle = str_replace("'", '"', $strTitle[1][0]);
        $jsonTeam = str_replace("'", '"', $strTeam[1][0]);
        $jsonCupKind = str_replace("'", '"', $strCupKind[1][0]);

        $arrTitle = json_decode($jsonTitle, true);
        $arrTeam = json_decode($jsonTeam, true);
        $arrCupKind = json_decode($jsonCupKind, true);

        $_arrTeam = array();
        foreach ($arrTeam as $row) {
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                $_arr[$team_idx[$i]] = $row[$i];
            }
            $_arrTeam[] = $_arr;
        }

        $_arrTitle = array();
        for ($i = 0; $i < count($arrTitle); $i++) {
            $_arrTitle[$title_idx[$i]] = $arrTitle[$i]; //타이틀
        }

        $_arrCupKind = array();
        foreach ($arrCupKind as $row) {
            array_splice($row, 2, 2);
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                $_arr[$cupkind_idx[$i]] = $row[$i]; //상단구분
            }
            $key = str_replace(' ', '', $_arr['name']);
            $_arrCupKind[$key] = $_arr;
        }

        $_arrGroupRank = array();
        $_arrGroupGame = array();
        if (array_key_exists('Groups', $_arrCupKind)) {
            $countGroup = $_arrCupKind['Groups']['count'];
            $_arrGroupGame = array();
            for ($i = 0; $i < $countGroup; $i++) {
                preg_match_all('/jh\["G' . $_arrCupKind['Groups']['cupkind_idx'] . $group_idx[$i] . '"\] = \[(.+?)\];/m', $res, $strJh);
                $json = '[' . $strJh[1][0] . ']';
                $json = str_replace("'", '"', $json);
                $json = str_replace(',,,', ',"","",', $json);
                $json = str_replace(',,', ',"",', $json);
                $json = str_replace('|90,', '|90;', $json);
                $arr = json_decode($json, true);

                $_arrGroup = array();
                foreach ($arr as $row) {
                    $_arr = array();

                    for ($j = 0; $j < count($row); $j++) {
                        $_arr[$game_idx[$j]] = $row[$j];

                        if ($j == 4) {
                            foreach ($_arrTeam as $_at) {
                                if ($_arr['home_team_idx'] == $_at['team_idx']) {
                                    $_arr['home_team_name'] = str_replace('   ', ' ', $_at['name']);
                                }
                            }
                        }

                        if ($j == 5) {
                            foreach ($_arrTeam as $_at) {
                                if ($_arr['away_team_idx'] == $_at['team_idx']) {
                                    $_arr['away_team_name'] = str_replace('   ', ' ', $_at['name']);
                                }
                            }
                        }

                        if ($j == 22) {
                            $_append = $row[$j];
                            $_append = str_replace('|', '', $_append);
                            $_append = str_replace(';', ',', $_append);
                            $_append = str_replace(',', '","', $_append);
                            $arr_append = json_decode('["' . $_append . '"]', true);
                            if (count($arr_append) > 1) {
                                $str = "";
                                if ($arr_append[3]) {
                                    $str .= $arr_append[3] . 'Min' . '[' . $arr_append[4] . ']';
                                }
                                if ($arr_append[7]) {
                                    $str .= ',Conners[' . $arr_append[7] . ']';
                                }
                                if ($arr_append[8] !== "") {
                                    if ($arr_append[8] == 1) {
                                        $str .= ',' . $_arr['home_team_name'] . 'Win';
                                    } else {
                                        $str .= ',' . $_arr['away_team_name'] . 'Win';
                                    }
                                }
                                $_arr[$game_idx[$j]] = $str;
                            }
                        }
                    }// Group for
                    $_arrGroup[$group_idx[$i]][] = $_arr;
                } // Group foreach
                $_arrGroupGame[] = $_arrGroup;
            }

            for ($i = 0; $i < $countGroup; $i++) {
                preg_match_all('/jh\["S' . $_arrCupKind['Groups']['cupkind_idx'] . $group_idx[$i] . '"\] = \[(.+?)\];/m', $res, $strJh);

                $_arrGroup = array();
                $json = '[' . $strJh[1][0] . ']';
                $arr = json_decode($json, true);

                foreach ($arr as $row) {
                    $_arr = array();
                    for ($j = 0; $j < count($row); $j++) {
                        $_arr[$rank_idx[$j]] = $row[$j];
                        if ($j == 1) {
                            foreach ($_arrTeam as $_at) {
                                if ($_arr['team_idx'] == $_at['team_idx']) {
                                    $_arr['team_name'] = str_replace('   ', ' ', $_at['name']);
                                }
                            }
                        }
                    }
                    $_arrGroup[$group_idx[$i]][] = $_arr;
                }
                $_arrGroupRank[] = $_arrGroup;
            }
        }
        $arr_append = array('cup_kind' => $_arrCupKind, 'league_rank' => $_arrGroupRank, 'league_game' => $_arrGroupGame);

        $_arrOtherKind = array();
        foreach ($arrCupKind as $row) {
            if ($row[1] !== 1) {
                $_arrOtherKind[] = $row;
            }
        }

        $_arrOtherKindGame = array();
        $game_idx = array('game_idx', 'league_idx', 'game_progress', 'date', 'home_team_idx', 'away_team_idx', 'score', 'ht_score', 8, 9,
            'handicap_ft', 'handicap_ht', 'over_under_ft', 'over_under_ht', 14, 15,
            16, 17, 18, 19, 20, 'append_content1', 'append_content2', 23, 'home_rank', 'away_rank');
        for ($i = 0; $i < count($_arrOtherKind); $i++) {
            preg_match_all('/jh\["G' . $_arrOtherKind[$i][0] . '"\] = \[(.+?)\];/m', $res, $strJh);
            $json = '[' . $strJh[1][0] . ']';
            $json = str_replace("'", '"', $json);
            $json = str_replace(',,,', ',"","",', $json);
            $json = str_replace(',,', ',"",', $json);
            $json = str_replace('|90,', '|90;', $json);
            $arr = json_decode($json, true);
            $_arrGroup = array();
            foreach ($arr as $row) {
                $_arr = array();

                for ($j = 0; $j < count($row); $j++) {
                    $_arr[$game_idx[$j]] = $row[$j];

                    if ($j == 4) {
                        foreach ($_arrTeam as $_at) {
                            if ($_arr['home_team_idx'] == $_at['team_idx']) {
                                $_arr['home_team_name'] = str_replace('   ', ' ', $_at['name']);
                            }
                        }
                    }

                    if ($j == 5) {
                        foreach ($_arrTeam as $_at) {
                            if ($_arr['away_team_idx'] == $_at['team_idx']) {
                                $_arr['away_team_name'] = str_replace('   ', ' ', $_at['name']);
                            }
                        }
                    }
                    if ($j == 21) {
                        $_arr[$game_idx[$j + 1]] = $row[$j];
                    }

                    if ($j == 22) {
                        $_append = $row[$j];
                        $_append = str_replace('|', '', $_append);
                        $_append = str_replace(';', ',', $_append);
                        $_append = str_replace(',', '","', $_append);
                        $_arr_append = json_decode('["' . $_append . '"]', true);
                        if (count($_arr_append) > 1) {
                            $str = "";
                            if ($_arr_append[3]) {
                                $str .= $_arr_append[3] . 'Min' . '[' . $_arr_append[4] . ']';
                            }
                            if ($_arr_append[7]) {
                                $str .= ',Conners[' . $_arr_append[7] . ']';
                            }
                            if ($_arr_append[8] !== "") {
                                if ($_arr_append[8] == 1) {
                                    $str .= ',' . $_arr['home_team_name'] . 'Win';
                                } else {
                                    $str .= ',' . $_arr['away_team_name'] . 'Win';
                                }
                            }
                            $_arr[$game_idx[$j]] = $str;
                        }
                    }
                }// Group for
                $_arrGroup[] = $_arr;
            } // Group foreach
            $key = str_replace(' ', '', $_arrOtherKind[$i][4]);
            $_arrOtherKindGame[$key] = $_arrGroup;
        }

        return $arr_append + $_arrOtherKindGame;
    }

    public function seasonSelect($idx)
    {
        $seasonSelectUrl = 'http://info.nowgoal.com/jsData/LeagueSeason/sea' . $idx . '.js';
        $res = $this->curl($seasonSelectUrl);

        preg_match_all('/arrSeason = (.+?);/', $res, $seasonSelect);

        $json = str_replace("'", '"', $seasonSelect[1][0]);
        $seasonSelect = json_decode($json, true);

        return $seasonSelect;
    }

    private function teamSelect($res)
    {
        preg_match_all('/arrTeam = (.+?);/', $res, $getTeam);
        $json = str_replace("'", '"', $getTeam[1][0]);
        $arrTeam = json_decode($json, true);

        $arrTeam_idx = array('team_idx', 'name', 'logo');

        $team_arr = array();
        foreach ($arrTeam as $row) {
            array_splice($row, 1, 2);
            array_splice($row, 2, 1);
            array_splice($row, 3, 1);
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                $_arr[$arrTeam_idx[$i]] = $row[$i];
            }
            $team_arr[] = $_arr; // 해당 리그 팀 배열
        }
        return $team_arr;
    }

    private function topTitle($res, $division = null)
    {
        preg_match_all('/arrLeague = \[(.+?)\];/', $res, $getLeague);
        $json = '[' . $getLeague[1][0] . ']';
        $json = str_replace("'", '"', $json);
        $arr = json_decode($json, true);

        $topTitle_arr = array('league_idx', '1', '2', 'title', 'season', 'color', 'image', 'total_round', 'this_round', '9', '10', 'league_short', 'information');

        $mainbar = array();
        $i = 0;
        foreach ($arr as $row) {
            if ($i == 6) {
                $mainbar[$topTitle_arr[$i]] = 'http://info.nowgoal.com/Image/' . $row;
            } else {
                $mainbar[$topTitle_arr[$i]] = $row;
            }
            $i++;
        }
        $titlebar['mainTitle'] = $mainbar;

        if ($division == 'SubLeague') {

            $subLeague_idx = array('league_idx', '1', '2', 'title', '4', 'total_round', 'this_round', '7');
            preg_match_all('/arrSubLeague = \[(.+?)\];/', $res, $getLeague);
            $json = '[' . $getLeague[1][0] . ']';
            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true);
            $subbar = array();
            $_arrSubLeague = array();
            foreach ($arr as $row) {
                for ($i = 0; $i < count($row); $i++) {
                    $_arrSubLeague[$subLeague_idx[$i]] = $row[$i];
                }
                $subbar[] = $_arrSubLeague;
            }
            $titlebar['subTitle'] = $subbar;
        }
        return $titlebar;
    }

    private function schedule($res, $totalRound, $teamSelect, $subClass)
    {
        $round_idx = array('game_idx', 'league_idx', 'progress', 'datetime', 'home_idx', 'away_idx', 'score', 'ht', 'hone_red', 'away_red', 'home_ranking', 'away_ranking');
        $schedule = array();
        $getround = array();
        for ($i = 1; $i <= $totalRound; $i++) {

            if ($subClass == 'League') {
                preg_match_all('/jh\[\"R_' . $i . '\"\] =(.+?);/m', $res, $getround[$i]);
            } else {
                preg_match_all('/jh\[\"R_' . $i . '\"] =(.+?);\s/m', $res, $getround[$i]);
            }


            $json = str_replace("'", '"', $getround[$i][1][0]);
            $json = str_replace(',,,', ',"","",', $json);
            $json = preg_replace('/\"90(.+?)"/i', '""', $json);
            $json = str_replace(',,', ',"",', $json);

            $arr = json_decode($json, true);

            $arr_round = array();
            $_arr = array();
            for ($j = 0; $j < count($arr); $j++) {

                array_splice($arr[$j], 8, 10);
                array_splice($arr[$j], 10, 1);


                for ($k = 0; $k < count($arr[$j]); $k++) {

                    switch ($k) {
                        case 4 : //홈팀 이름 추가
                            for ($z = 0; $z < count($teamSelect); $z++) {
                                if ($teamSelect[$z]['team_idx'] == $arr[$j][$k]) {
                                    $_arr[$round_idx[$k]] = $arr[$j][$k];
                                    $_arr['home_name'] = $teamSelect[$z]['name'];
                                }
                            }
                            break;
                        case 5 : //원정팀 이름 추가
                            for ($z = 0; $z < count($teamSelect); $z++) {
                                if ($teamSelect[$z]['team_idx'] == $arr[$j][$k]) {
                                    $_arr[$round_idx[$k]] = $arr[$j][$k];
                                    $_arr['away_name'] = $teamSelect[$z]['name'];
                                }
                            }
                            break;
                        case 6 : //스코어 홈,어웨이 구분
                            if ($arr[$j][$k] !== "" && mb_strlen($arr[$j][6], 'utf-8') < 5) {
                                $score = explode('-', $arr[$j][$k]);
                                $_arr['home_score'] = $score[0];
                                $_arr['away_score'] = $score[1];
                            } else {
                                $_arr['home_score'] = "";
                                $_arr['away_score'] = "";
                            }
                            break;
                        default :
                            $_arr[$round_idx[$k]] = $arr[$j][$k];
                            break;
                    }
                }//for
                $arr_round[] = $_arr;
            }//for
            $schedule[] = $arr_round;
        }
        return $schedule;
    }

    private function totalScore($res, $teamSelect, $division, $position = null)
    {
        preg_match_all('/totalScore = (.+?);/', $res, $getstanding);

        if (!empty($getstanding[1])) {
            $json = str_replace("'", '"', $getstanding[1][0]);
            $arr = json_decode($json, true);

            $standing_total = array();
            $standing_total_idx = array('division', 'rank', 'team_idx', 'red_card', 'games', 'w', 'd', 'l', 'get', 'miss', 'gd', 'w_per', 'd_per', 'l_per', 'avg_get', 'avg_lose', 'pts',
                'recent1', 'recent2', 'recent3', 'recent4', 'recent5', 'recent6');
            foreach ($arr as $row) {

                array_splice($row, 17, 2);
                array_splice($row, 23, 1);

                if ($division) {
                    array_splice($row, 23, 1);
                }
                $_arr = array();
                for ($i = 0; $i < count($row); $i++) {
                    $_arr[$standing_total_idx[$i]] = $row[$i];
                    if ($i == 2) {
                        for ($j = 0; $j < count($teamSelect); $j++) {
                            if ($teamSelect[$j]['team_idx'] == $row[2]) {
                                $_arr['team_name'] = $teamSelect[$j]['name'];
                            }
                        }
                    }
                }
                $standing_total[] = $_arr;
            }
        }

        if ($position == 'main') {
            return $standing_total; // 메인 리그 순위표 리턴
        }

        // [home away halfTotal halfHome halfAway score]
        if (!empty($getstanding[1])) {
            $standing_home[] = $this->standing_func($res, $teamSelect, '/homeScore = (.+?);/');
            $standing_away[] = $this->standing_func($res, $teamSelect, '/guestScore = (.+?);/');
            $standing_half[] = $this->standing_func($res, $teamSelect, '/halfScore = (.+?);/');
            $standing_homeHalf[] = $this->standing_func($res, $teamSelect, '/homeHalfScore = (.+?);/');
            $standing_guestHalf[] = $this->standing_func($res, $teamSelect, '/guestHalfScore = (.+?);/');
        }
        // [home away halfTotal halfHome halfAway score]

        return $standing_score = array(
            'total' => $standing_total,
            'home' => $standing_home,
            'away' => $standing_away,
            'ht_total' => $standing_half,
            'ht_home' => $standing_homeHalf,
            'ht_away' => $standing_guestHalf,
        );
    }

    private function homeScore($res, $teamSelect, $division, $thisRound)
    {
        $getround = array();
        $_home_array = array();

        $_round_array = array();
        for ($i = 1; $i < $thisRound; $i++) {
            if ($division == 'League') {
                preg_match_all('/jh\[\"R_' . $i . '\"\] =(.+?);/m', $res, $getround[$i]);
            } else {
                preg_match_all('/jh\[\"R_' . $i . '\"] =(.+?);\s/m', $res, $getround[$i]);
            }

            $json = str_replace("'", '"', $getround[$i][1][0]);
            $json = str_replace(',,,', ',"","",', $json);
            $json = preg_replace('/\"90(.+?)"/i', '""', $json);
            $json = str_replace(',,', ',"",', $json);

            $arr = json_decode($json, true);

//            var_dump($arr);
        }
    }

    private function roundScore($res, $teamSelect, $division, $thisRound)
    {
        $getround = array();
        $_total_array = array();

        $_round_array = array();
        for ($i = 1; $i < $thisRound; $i++) {
            if ($division == 'League') {
                preg_match_all('/jh\[\"R_' . $i . '\"\] =(.+?);/m', $res, $getround[$i]);
            } else {
                preg_match_all('/jh\[\"R_' . $i . '\"] =(.+?);\s/m', $res, $getround[$i]);
            }

            $json = str_replace("'", '"', $getround[$i][1][0]);
            $json = str_replace(',,,', ',"","",', $json);
            $json = preg_replace('/\"90(.+?)"/i', '""', $json);
            $json = str_replace(',,', ',"",', $json);

            $arr = json_decode($json, true);

            foreach ($arr as $row) {
                array_splice($row, 0, 4);
                array_splice($row, 4, 16);

                if ($row[2] !== '推迟|推遲|Delay' && $row[2] !== '取消|取消|Cancel') {//推迟|推遲|Delay 예외처리

                    $tScore = explode('-', $row[2]);
                    $hScore = explode('-', $row[3]);

                    foreach ($teamSelect as $ts) {
                        if ($ts['team_idx'] == $row[0]) {
                            $row[0] = $ts['name'];
                            $_total_array[$row[0]]['team_idx'] = $ts['team_idx'];
                        }
                        if ($ts['team_idx'] == $row[1]) {
                            $row[1] = $ts['name'];
                            $_total_array[$row[1]]['team_idx'] = $ts['team_idx'];
                        }
                    }

                    if (!empty($_total_array[$row[0]]['game'])) {
                        $_total_array[$row[0]]['game'] = $_total_array[$row[0]]['game'] + 1;
                    } else {
                        $_total_array[$row[0]]['game'] = 1;
                    }

                    if (!empty($_total_array[$row[1]]['game'])) {
                        $_total_array[$row[1]]['game'] = $_total_array[$row[1]]['game'] + 1;
                    } else {
                        $_total_array[$row[1]]['game'] = 1;
                    }

                    if ($tScore[0] > $tScore[1]) {
                        if (!empty($_total_array[$row[0]]['w'])) {
                            $_total_array[$row[0]]['w'] = $_total_array[$row[0]]['w'] + 1;
                        } else {
                            $_total_array[$row[0]]['w'] = 1;
                        }


                    } else if ($tScore[0] == $tScore[1]) {
                        if (!empty($_total_array[$row[0]]['d'])) {
                            $_total_array[$row[0]]['d'] = $_total_array[$row[0]]['d'] + 1;
                        } else {
                            $_total_array[$row[0]]['d'] = 1;
                        }

                    } else {
                        if (!empty($_total_array[$row[0]]['l'])) {
                            $_total_array[$row[0]]['l'] = $_total_array[$row[0]]['l'] + 1;
                        } else {
                            $_total_array[$row[0]]['l'] = 1;
                        }

                    }

                    if ($tScore[0] < $tScore[1]) {
                        if (!empty($_total_array[$row[1]]['w'])) {
                            $_total_array[$row[1]]['w'] = $_total_array[$row[1]]['w'] + 1;
                        } else {
                            $_total_array[$row[1]]['w'] = 1;
                        }
                    } else if ($tScore[0] == $tScore[1]) {
                        if (!empty($_total_array[$row[1]]['d'])) {
                            $_total_array[$row[1]]['d'] = $_total_array[$row[1]]['d'] + 1;
                        } else {
                            $_total_array[$row[1]]['d'] = 1;
                        }
                    } else {
                        if (!empty($_total_array[$row[1]]['l'])) {
                            $_total_array[$row[1]]['l'] = $_total_array[$row[1]]['l'] + 1;
                        } else {
                            $_total_array[$row[1]]['l'] = 1;
                        }
                    }


                    if (empty($_total_array[$row[0]]['w'])) {
                        $_total_array[$row[0]]['w'] = 0;
                    }
                    if (empty($_total_array[$row[0]]['w'])) {
                        $_total_array[$row[0]]['w'] = 0;
                    }

                    if (empty($_total_array[$row[1]]['w'])) {
                        $_total_array[$row[1]]['w'] = 0;
                    }

                    if (empty($_total_array[$row[0]]['d'])) {
                        $_total_array[$row[0]]['d'] = 0;
                    }
                    if (empty($_total_array[$row[1]]['d'])) {
                        $_total_array[$row[1]]['d'] = 0;
                    }
                    if (empty($_total_array[$row[0]]['l'])) {
                        $_total_array[$row[0]]['l'] = 0;
                    }
                    if (empty($_total_array[$row[1]]['l'])) {
                        $_total_array[$row[1]]['l'] = 0;
                    }


                    if (!empty($_total_array[$row[0]]['get'])) {
                        $_total_array[$row[0]]['get'] = $_total_array[$row[0]]['get'] + $tScore[0];
                    } else {
                        $_total_array[$row[0]]['get'] = $tScore[0];
                    }

                    if (!empty($_total_array[$row[1]]['get'])) {
                        $_total_array[$row[1]]['get'] = $_total_array[$row[1]]['get'] + $tScore[1];
                    } else {
                        $_total_array[$row[1]]['get'] = $tScore[1];
                    }

                    if (!empty($_total_array[$row[0]]['miss'])) {
                        $_total_array[$row[0]]['miss'] = $_total_array[$row[0]]['miss'] + $tScore[1];
                    } else {
                        $_total_array[$row[0]]['miss'] = $tScore[1];
                    }

                    if (!empty($_total_array[$row[1]]['miss'])) {
                        $_total_array[$row[1]]['miss'] = $_total_array[$row[1]]['miss'] + $tScore[0];
                    } else {
                        $_total_array[$row[1]]['miss'] = $tScore[0];
                    }

                    $_total_array[$row[0]]['gd'] = $_total_array[$row[0]]['get'] - $_total_array[$row[0]]['miss'];
                    $_total_array[$row[1]]['gd'] = $_total_array[$row[1]]['get'] - $_total_array[$row[1]]['miss'];

                    $_total_array[$row[0]]['w_per'] = round(($_total_array[$row[0]]['w'] / $_total_array[$row[0]]['game']) * 100, 1);
                    $_total_array[$row[1]]['w_per'] = round(($_total_array[$row[1]]['w'] / $_total_array[$row[1]]['game']) * 100, 1);

                    $_total_array[$row[0]]['d_per'] = round(($_total_array[$row[0]]['d'] / $_total_array[$row[0]]['game']) * 100, 1);
                    $_total_array[$row[1]]['d_per'] = round(($_total_array[$row[1]]['d'] / $_total_array[$row[1]]['game']) * 100, 1);

                    $_total_array[$row[0]]['l_per'] = round(($_total_array[$row[0]]['l'] / $_total_array[$row[0]]['game']) * 100, 1);
                    $_total_array[$row[1]]['l_per'] = round(($_total_array[$row[1]]['l'] / $_total_array[$row[1]]['game']) * 100, 1);

                    $_total_array[$row[0]]['avg_get'] = round(($_total_array[$row[0]]['get'] / $_total_array[$row[0]]['game']), 2);
                    $_total_array[$row[1]]['avg_get'] = round(($_total_array[$row[1]]['get'] / $_total_array[$row[1]]['game']), 2);

                    $_total_array[$row[0]]['avg_miss'] = round(($_total_array[$row[0]]['miss'] / $_total_array[$row[0]]['game']), 2);
                    $_total_array[$row[1]]['avg_miss'] = round(($_total_array[$row[1]]['miss'] / $_total_array[$row[1]]['game']), 2);

                    if (!empty($_total_array[$row[0]]['w'])) {
                        $_total_array[$row[0]]['score'] = $_total_array[$row[0]]['w'] * 3;
                    } else {
                        $_total_array[$row[0]]['score'] = 0;
                    }

                    if (!empty($_total_array[$row[1]]['w'])) {
                        $_total_array[$row[1]]['score'] = $_total_array[$row[1]]['w'] * 3;
                    } else {
                        $_total_array[$row[1]]['score'] = 0;
                    }

                    if (!empty($_total_array[$row[0]]['d'])) {
                        $_total_array[$row[0]]['score'] = $_total_array[$row[0]]['score'] + $_total_array[$row[0]]['d'] * 1;
                    } else {
                        $_total_array[$row[0]]['score'] = $_total_array[$row[0]]['score'];
                    }

                    if (!empty($_total_array[$row[1]]['d'])) {
                        $_total_array[$row[1]]['score'] = $_total_array[$row[1]]['score'] + $_total_array[$row[1]]['d'] * 1;
                    } else {
                        $_total_array[$row[1]]['score'] = $_total_array[$row[1]]['score'];
                    }
                }

            }//row foreach

            foreach ($_total_array as $key => $value) {
                $sort_score[$key] = $value['score'];
                $sort_avg_get[$key] = $value['avg_get'];
                $sort_gd[$key] = $value['gd'];
                $sort_idx[$key] = $value['team_idx'];
            }
            array_multisort(
                $sort_score, SORT_DESC,
                $sort_gd, SORT_DESC,
                $sort_avg_get, SORT_DESC,
                $sort_idx, SORT_ASC,
                $_total_array
            );
            $_round_array['total'][$i] = $_total_array;
        }
        return $_round_array;
    }

    private function techConfig($idx, $season)
    {
        $this_season = $season;

        $url = 'http://info.nowgoal.com/jsData/Count/' . $this_season . '/playerTech_' . $idx . '.js';
        $res = $this->curl($url);

        preg_match_all('/techCout_Player=\{(.+?)};/m', $res, $pid);
        $json = '{' . $pid[1][0] . '}';
        $arr = json_decode($json, true);

        return $arr;
    }

    private function techStats($idx, $season)
    {
        $arr = $this->techConfig($idx, $season);

        $_techTeam_arr = array();
        $tech_player = array();
        foreach ($arr['Tid'] as $key => $value) {
            $_techTeam_arr[$key] = $value[2];
            $_arr[$key] = array();
            foreach ($arr['Pid'] as $key2 => $value2) {
                if ($key == $value2[1]) {
                    $array = array(
                        'name' => $value2[0][2],
                        'player_idx' => $key2,
                        'team_idx' => $value2[1],
                        'team_name' => $_techTeam_arr[$value2[1]],
                    );
                    $_arr[$key][] = $array;
                }
                $tech_player = $_arr;
            }
        }

        asort($_techTeam_arr);
        $tech_team = $_techTeam_arr;

        $_techPlayer_arr = array();
        foreach ($arr['Pid'] as $key => $value) {
            $array = array(
                'name' => $value[0][2],
                'team_idx' => $value[1],
                'team_name' => $_techTeam_arr[$value[1]],
            );
            $_techPlayer_arr[$key] = $array;
        }

        $tech_total = $this->tech_func($arr, $_techPlayer_arr, 'Total');
        $tech_home = $this->tech_func($arr, $_techPlayer_arr, 'Home');
        $tech_away = $this->tech_func($arr, $_techPlayer_arr, 'guest');

        $tech_stats = array('player' => $tech_player, 'team' => $tech_team, 'total' => $tech_total, 'home' => $tech_home, 'away' => $tech_away);

        return $tech_stats;
    }

    private function teamProfiles($idx)
    {
        $url = 'http://info.nowgoal.com/jsData/teamInfo/team' . $idx . '.js';
        $res = $this->curl($url);

        preg_match_all('/arrTeam = (.+?);/m', $res, $arrTeamProfiles);

        $json = str_replace("'", '"', $arrTeamProfiles[1][0]);
        $arr = json_decode($json, true);

        $team_idx = array('team_idx', 'name', 'img');

        $team_profiles = array();
        $_arr = array();
        foreach ($arr as $row) {
            array_splice($row, 1, 2);
            array_splice($row, 2, 1);
            for ($i = 0; $i < count($row); $i++) {
                if ($i == 2) {
                    $_arr[$team_idx[$i]] = 'http://info.nowgoal.com/Image/team/' . $row[$i];
                } else {
                    $_arr[$team_idx[$i]] = $row[$i];
                }
            }
            $team_profiles[] = $_arr;
        }

        return $team_profiles;
    }

    private function firstGoalLose($idx, $season, $teamSelect)
    {
        $url = 'http://info.nowgoal.com/jsData/firGetLose/' . $season . '/fgl' . $idx . '.js';
        $res = $this->curl($url);

        preg_match_all('/arrData = (.+?);/', $res, $arrFirstGoalLose);
        $json = str_replace("'", '"', $arrFirstGoalLose[1][0]);
        $arr = json_decode($json, true);

        $firstGoalLose_idx = array('team_idx', 'goal_total', 'goal_home', 'goal_away', 'lost_total', 'lost_home', 'lost_away');

        $result = array();
        foreach ($arr as $row) {
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                $_arr[$firstGoalLose_idx[$i]] = $row[$i];
                if ($i == 0) {
                    for ($j = 0; $j < count($teamSelect); $j++) {
                        if ($teamSelect[$j]['team_idx'] == $row[0]) {
                            $_arr['team_name'] = $teamSelect[$j]['name'];
                        }
                    }
                }
            }
            $result[] = $_arr;
        }

        return $result;
    }

    private function noGoalLose($idx, $season, $teamSelect)
    {
        $url = 'http://info.nowgoal.com/jsData/nogetlose/' . $season . '/ngl' . $idx . '.js';
        $res = $this->curl($url);

        preg_match_all('/arrData = (.+?);/', $res, $arrFirstGoalLose);
        $json = str_replace("'", '"', $arrFirstGoalLose[1][0]);
        $arr = json_decode($json, true);

        $noGoalLose_idx = array('team_idx',
            'total_p', 'total_s_ft', 'total_s_1st', 'total_s_2st', 'total_l_ft', 'total_l_1st', 'total_l_2st',
            'home_p', 'home_s_ft', 'home_s_1st', 'home_s_2st', 'home_l_ft', 'home_l_1st', 'home_l_2st',
            'away_p', 'away_s_ft', 'away_s_1st', 'away_s_2st', 'away_l_ft', 'away_l_1st', 'away_l_2st',
        );

        $result = array();
        foreach ($arr as $row) {
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                $_arr[$noGoalLose_idx[$i]] = $row[$i];
                if ($i == 0) {
                    for ($j = 0; $j < count($teamSelect); $j++) {
                        if ($teamSelect[$j]['team_idx'] == $row[0]) {
                            $_arr['team_name'] = $teamSelect[$j]['name'];
                        }
                    }
                }
            }
            $result[] = $_arr;
        }
        return $result;
    }

    public function standing_func($res, $teamSelect, $regx)
    {
        $standing_basic_idx = array('rank', 'team_idx', 'games', 'w', 'd', 'l', 'get', 'miss', 'gd', 'w_per', 'd_per', 'l_per', 'avg_get', 'avg_miss', 'score');

        preg_match_all($regx, $res, $getstanding);
        $json = str_replace("'", '"', $getstanding[1][0]);
        $arr = json_decode($json, true);

        $result = array();
        foreach ($arr as $row) {
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                $_arr[$standing_basic_idx[$i]] = $row[$i];
                if ($i == 1) {
                    for ($j = 0; $j < count($teamSelect); $j++) {
                        if ($teamSelect[$j]['team_idx'] == $row[1]) {
                            $_arr['team_name'] = $teamSelect[$j]['name'];
                        }
                    }
                }
            }
            $result[] = $_arr;
        }
        return $result;
    }

    public function tech_func($arr, $_techPlayer_arr, $type)
    {
        $_arrKey = array();
        foreach ($arr[$type]['key'] as $key => $value) {
            $_arrKey[] = $key;
        }

        $_arrData = array();
        foreach ($arr[$type]['value'] as $row) {
            $_arr = array();
            if ($row[0] !== 133853 && $row[0] !== 183239 && $row[0] !== 150975 && $row[0] !== 90815) { // 133853 선수정보 누락으로 오류 예외처리
                for ($i = 0; $i < count($row); $i++) {
                    $_arr[$_arrKey[$i]] = $row[$i];
                }
                $_arrData[] = array('info' => $_techPlayer_arr[$_arr['PlayerID']], 'data' => $_arr);
            }
        }
        return $_arrData;
    }

    public function teamData_func($arr)
    {
        $result = array();

        foreach ($arr[4] as $row) {
            $arrrow = explode(',', $row);

            $_arr = array();
            for ($i = 0; $i < count($arrrow); $i++) {
                switch ($i) {
                    case 0 :
                        $_arr['league_idx'] = $arrrow[0];
                        break;
                    case 1 :
                        $_arr['name'] = $arrrow[1];
                        break;
                    case 2 :
                        $_arr['continent_num'] = $arrrow[2];
                        break;
                    case 3 :
                        $_arr['division'] = $arrrow[2];
                        break;
                    default :
                        $_arr['season'][] = $arrrow[$i];
                        break;
                }
            }
            $result[] = $_arr;
        }

        return $result;
    }

    public function imgDownload_func($url, $division)
    {
        $arrUrl = explode('/', $url);
        switch ($division) {
            case 'team' :
            case 'analysis' :
                $addUrl = 'http://info.nowgoal.com/Image/team/';
                $filename = $arrUrl[1];
                break;
            case 'info' :

                $addUrl = 'http://info.nowgoal.com/Image/info/';
                $filename = $arrUrl[1];
                break;
            case 'schedule' :
                $addUrl = 'http://info.nowgoal.com/Image/league_match/';
                $filename = $arrUrl[2];
                break;
        }

        $img = file_get_contents(WRITEPATH . '1.png');

        echo '<img src="data:image/jpg;base64,' . base64_encode($img) . '">';
        exit;

        copy($addUrl . $url, ROOTPATH . "public/uploads/team_logo/" . $filename);

        $file = '/uploads/team_logo/' . $filename;
        echo '<img src="' . $file . '">';
        exit;

        $file = '/uploads/team_logo/' . $arrUrl[1];

        return $url;

        echo '<img src="' . $file . '">';
        exit;
    }
}