<?php

namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\View_lb;
use App\Libraries\Soccer_lb;
use App\Libraries\Conversion_lb;
use CodeIgniter\I18n\Time;
use http\Exception\RuntimeException;

class Soccer extends BaseController
{
    public function __construct()
    {
        $this->view_lb = new View_lb();
        $this->soccer_lb = new Soccer_lb();
        $this->conversion_lb = new Conversion_lb();
        helper('livescore');
    }

    public function index()
    {
        $this->data();
    }

    public function curl($url = null)
    {
        if ($url == null) {
            return false;
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0); // 헤더 출력 여부
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        curl_close($ch);

        return $res;
    }

    public function test()
    {
        $url = 'http://www.nowgoal.com/GetScheduleWithTimeZone.aspx?date=' . date("Y-m-d", strtotime("-1 day")) . '&order=time&timezone=9';
        $res = $this->curl($url);

        preg_match_all('/A\[(.+?)\]=\[(.+)\]/m', $res, $A);

        $_idx = array();
        foreach ($A[2] as $row) {
            $json = '[' . $row . ']';
            $json = str_replace("'", '"', $json);
            $arr = json_decode($json, true);
            $_idx[] = $arr[0];
        }

        var_dump($_idx);

//        return $this->response->setJSON($_result);

    }

    /**
     * 메인 정보 데이터
     */
    public function data()
    {
        $json = file_get_contents(WRITEPATH . 'uploads/maindata1.json');
        $jsonResult = file_get_contents(WRITEPATH . 'uploads/result/' . date("Y-m-d", strtotime("-1 day")) . '.json');
        $jsonOpponent = file_get_contents(WRITEPATH . 'uploads/opponent.json');

        $json = json_decode($json, true);
        $jsonResult = json_decode($jsonResult, true);
        $jsonOpperent = json_decode($jsonOpponent, true);

        $data['B'] = $json['B']; //league data
        $data['today'] = $json['today'];
        $data['tomorrow'] = $json['tomorrow'];
        $data['result'] = $json['result'];
        $data['matchYesterday'] = $jsonResult;
        $data['opponent'] = $jsonOpperent;

        echo $this->view_lb->setView('main_v', $data);
    }

    public function main_left()
    {
        $data = $this->soccer_lb->mainLeft();
        return $this->response->setJSON($data);
    }

    public function byRegion($idx)
    {
        $data = $this->soccer_lb->byRegion($idx);

        return $this->response->setJSON($data);
    }

    public function team($seq)
    {
        echo $this->view_lb->setView('team_v');
    }

    public function player($seq)
    {
        echo $this->view_lb->setView('player_v');
    }

    public function database($seq = null)
    {
        echo $this->view_lb->setView('database_v');
    }

    public function team_database()
    {
        $data['list'] = $this->soccer_lb->teamDatabase();
        echo $this->view_lb->setView('teamDatabase_v', $data);
    }

    /**
     * 이전 경기 결과
     */
    public function getResultJson()
    {
//        $this->soccer_lb->game_result();
        if (file_exists('/home/spoto/html/writable/uploads/result/' . date("Y-m-d", strtotime("-1 day")) . '.json')) {
            $data = file_get_contents('/home/spoto/html/writable/uploads/result/' . date("Y-m-d", strtotime("-1 day")) . '.json');
            $respond = $this->res(200, 'success', json_decode($data, true));
        } else {
            $respond = $this->res(404, '데이터가 없습니다.');
        }
        return $this->response->setJSON($respond);
    }

    public function getKeyEventJson()
    {
        try {
            $data = $this->conversion_lb->realtime_detail();
            if ($data) {
                $respond = $data;
            } else {
                $respond = $data;
            }
        } catch (\Exception $e) {
            $respond = $this->res(500, 'fail', $e->getMessage());
        }

        return $this->response->setJSON($respond);
    }

    public function getMatchNumAnalysis()
    {
        $data = file_get_contents(WRITEPATH . 'uploads/maindata1.json');

        $result = $this->soccer_lb->matchAnalysis(json_decode($data));

        return $this->response->setJSON($result);
    }

    /**
     * 메인 상대전적
     */
    public function opponent()
    {
        $data = $this->soccer_lb->opponent();
        echo json_encode($data);
    }

    public function getMainStandingJson()
    {
        if (file_exists(WRITEPATH . 'uploads/mainstanding.json')) {
            $data = file_get_contents(WRITEPATH . 'uploads/mainstanding.json');
            $respond = $this->res(200, 'success', json_decode($data));
        } else {
            $data = $this->soccer_lb->mainStanding();
            $respond = $this->res(200, 'success', $data);
        }
        
        return $this->response->setJSON($respond);
    }

    /**
     * 메인 실시간 이벤트 xml
     */
    public function realTimeXml()
    {
        $data = $this->soccer_lb->realTimeXml();
        echo json_encode($data);
    }

    /**
     * 해당 경기분석
     * seq = 경기 고유번호
     * @param null $seq
     */
    public function analysis($seq = null)
    {
        $date = $this->request->getGetPost('date');
        $year = date("Y", strtotime($date));
        $month = date("m", strtotime($date));
        $day = date("d", strtotime($date));
        try {
            $gameData = file_get_contents(WRITEPATH . 'uploads/game/' . $year . '/' . $month . '/' . $day . '/' . $seq . '.json');
            $array = json_decode('[' . $gameData . ']', true);

            $data['data'] = $array[0];
        }catch (\Exception $e){
            $data['data'] = null;
    }


//        $data['basic_h'] = $data['detail_page_1']['p1_1']['d1']['div_home'];
//        $data['basic_a'] = $data['detail_page_1']['p1_1']['d1']['div_away'];
//        $data['basic_arr'] = [$data['basic_h'], $data['basic_a']];
//        $data['basic_title'] = ['기준', '게임', '승', '무', '패', '득점', '실점', '마진', '승점'];
//        $data['basic_length'] = count($data['basic_title']);
//        $data['basic_team_color'] = ['#517dc9', '#ffd46e'];
//        $data['basic_class'] = ['home_content', 'away_content'];
//        $data['basic_home_key'] = ['home', 'away'];
//        $data['basic_home_away'] = ['홈', '원정'];

//        $data = $this->soccer_lb->analysis($seq);
        echo $this->view_lb->setView('analysis_v', $data);

    }

    /**
     * 해당 경기분석
     * seq = 경기 고유번호
     * @param null $seq
     */
    public function rate($bet_game_idx = null)
    {
        $data = $this->conversion_lb->odds_list($bet_game_idx);
        echo $this->view_lb->setView('rate_v', $data);
    }

    /**
     * 해당 경기내용
     * @param null $seq
     */
    public function detail($seq = null)
    {
        $data['json'] = $this->soccer_lb->detail($seq);
        echo $this->view_lb->setView('detail_v', $data);
    }

    public function team_data($team_idx = null)
    {
        $data = $this->soccer_lb->teamData($team_idx);
        if ($data == null) {
            $respond = $this->res(404, '데이터가 없습니다.');
        } else {
            $respond = $this->res(200, 'success', json_decode($data, true));
        }
        return $this->response->setJSON($respond);
    }

    /**
     * 메인 경기 리스트
     * @return json data
     * @return false|string
     */
    public function getDataJson()
    {
        if (file_exists(WRITEPATH . 'uploads/maindata1.json')) {
            $data = file_get_contents(WRITEPATH . 'uploads/maindata1.json');
            $jsonResult = file_get_contents(WRITEPATH . 'uploads/result/' . date("Y-m-d", strtotime("-1 day")) . '.json');
            $jsonOpponent = file_get_contents(WRITEPATH . 'uploads/opponent.json');

            $mergeJSON = json_decode($data, true);
            $mergeJSON['matchYesterday'] = json_decode($jsonResult, true);
            $mergeJSON['opponent'] = json_decode($jsonOpponent, true);
            $resultJSON = json_encode($mergeJSON);

            $respond = $this->res(200, 'success', json_decode($resultJSON, true));
        } else {
            $respond = $this->res(404, '데이터가 없습니다.');
        }
        return $this->response->setJSON($respond);
    }

    public function getOddJson($game_idx = null)
    {
        $data = $this->conversion_lb->odds($game_idx);
        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    public function getOddListJson($bet_game_idx = null)
    {
        $data = $this->conversion_lb->odds_list($bet_game_idx);
        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    /**
     * 상대전적
     * @return \CodeIgniter\HTTP\Response
     */
//    public function getOpponentJson()
//    {
//
//        if (file_exists(WRITEPATH . 'uploads/opponent.json')) {
//            $data = file_get_contents(WRITEPATH . 'uploads/opponent.json');
//            $respond = $this->res(200, 'success', json_decode($data, true));
//        } else {
//            $respond = $this->res(404, '데이터가 없습니다.');
//        }
//        return $this->response->setJSON($respond);
//    }

    /**
     * 선수정보
     * @return \CodeIgniter\HTTP\Response
     */
    public function getPlayerJson()
    {
        $player_idx = $this->request->getGetPost('player_idx');
        $filter = $this->request->getGetPost('filter');

        $data = $this->conversion_lb->player($player_idx, $filter = null);
        if ($data) {
            $respond = $this->res(200, 'success', $data);
        } else {
            $respond = $this->res(404, '데이터가 없습니다.');
        }
        return $this->response->setJSON($respond);
    }

    /**
     * 팀정보
     * seq = 팀 고유번호
     * @param null $seq
     * @return \CodeIgniter\HTTP\Response
     */
    public function getTeamJson($seq = null)
    {
        $data = $this->soccer_lb->teamDataInit($seq);
        if (file_exists(WRITEPATH . 'uploads/team/' . $seq . '.json')) {
            $data = file_get_contents(WRITEPATH . 'uploads/team/' . $seq . '.json');
            $respond = $this->res(200, 'success', json_decode($data, true));
        } else {
            $data = $this->soccer_lb->teamDataInit($seq);
            $respond = $this->res(200, 'success init', $data);
            if ($data) {
                $respond = $this->res(200, 'success init', $data);
            } else {
                $respond = $this->res(404, '데이터가 없습니다.');
            }
        }
        return $this->response->setJSON($respond);
    }

    /**
     * 팀페이지 전체정보
     * seq = 팀 고유번호
     * @param null $seq
     * @return \CodeIgniter\HTTP\Response
     */
    public function getTeamTotalJson($seq = null)
    {
        $data = $this->soccer_lb->teamData($seq);
        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    /**
     * 선수이적
     * @return \CodeIgniter\HTTP\Response
     */
    public function getTransferJson()
    {
        $idx = $this->request->getGetPost('idx');
        $season = $this->request->getGetPost('season');

        $data = $this->soccer_lb->transfer($idx, $season);

        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    /**
     * 경기 분석 팝업
     * @param null $seq
     * @return \CodeIgniter\HTTP\Response
     */
    public function getAnalysisJson($seq = null)
    {
        $this->soccer_lb->analysis($seq);
        if (file_exists(WRITEPATH . 'uploads/analysis/' . $seq . '.json')) {
            $data = file_get_contents(WRITEPATH . 'uploads/analysis/' . $seq . '.json');
            $respond = $this->res(200, 'success', json_decode($data, true));
        } else {
            $respond = $this->res(404, '데이터가 없습니다.');
        }
        return $this->response->setJSON($respond);
    }

    /**
     * 메인 업체별 배당률
     * @return \CodeIgniter\HTTP\Response
     */
    public function getMainOddJson($seq = null)
    {
        $data = $this->conversion_lb->odds($seq);

        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    /**
     * 순위표 사이드 메뉴
     * @return \CodeIgniter\HTTP\Response
     */
    public function getLeftSelectJson()
    {
        $data = $this->soccer_lb->left_select();
        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    /**
     * 순위표 리그/서브리그/컵 기본 데이터 GET
     * @return \CodeIgniter\HTTP\Response
     */
    public function getSeasonSelect()
    {
        $idx = $this->request->getGetPost('idx');
        $season = $this->soccer_lb->seasonSelect($idx);
        return $this->response->setJSON($season);
    }

    /**
     * 순위표 메인 데이터
     * idx = 리그 구분값
     * season = 년도별 구분값
     * division = League,SubLeague,CupMatch
     * subclass = 해당리그 상단 구분값
     * @return \CodeIgniter\HTTP\Response
     */
    public function getLeaderboardJson()
    {
        $idx = $this->request->getGetPost('idx');
        $season = $this->request->getGetpost('season');
        $division = $this->request->getGetpost('division'); //League,SubLeague,CupMatch
        $subclass = $this->request->getGetpost('subclass');

        $data = $this->soccer_lb->leaderboardData($idx, $season, $division, $subclass);

        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    /**
     * 대륙별 리그 정보
     * @return \CodeIgniter\HTTP\Response
     */
    public function getTeamDatabaseJson()
    {
        $data = $this->soccer_lb->teamDatabase();
        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

    /**
     * 게시판 분석글 정보
     * @param null $date
     * @return \CodeIgniter\HTTP\Response
     */
    public function board_analysis($date = null)
    {
        if ($date == null) {
            $jsonResult = file_get_contents(WRITEPATH . 'uploads/result/' . date("Y-m-d", strtotime("-1 day")) . '.json');
        } else {
            $jsonResult = file_get_contents(WRITEPATH . 'uploads/result/' . $date . '.json');
        }

        $respond = $this->res(200, 'success', json_decode($jsonResult, true));
        return $this->response->setJSON($respond);
    }

    /**
     * 경기 디테일
     * $filter 0 : game_versus, 1: game_event, 2: line_up, 3:tech_statistics
     * @return \CodeIgniter\HTTP\Response
     */
    public function game_results_detail($game_idx = null, $filter = null)
    {
//        $game_idx = $this->request->getGetPost('game_idx');
//        $filter = $this->request->getGetPost('filter');

        $data = $this->conversion_lb->detail($game_idx, $filter);

        return $this->_setJSON($data);
    }

    public function league_ranking()
    {
        $league_idx = !empty($this->request->getPost('league_idx')) ? $this->request->getPost('league_idx') : '40';
        $data = $this->conversion_lb->league_ranking($league_idx);
        return $this->_setJSON($data);
    }

    /**
     * $round: 라운드수; $game_time: full,half; $game_stadium: total,home,away; $round_type: full,last
     * @return \CodeIgniter\HTTP\Response
     */
    public function league_round()
    {
        $league_idx = $this->request->getPost('league_idx');
        $season = $this->request->getPost('season');
        $round = $this->request->getPost('round');
        $game_time = $this->request->getPost('time');
        $game_stadium = $this->request->getPost('stadium');
        $round_type = $this->request->getPost('round_type');

        $data = $this->conversion_lb->league_round($league_idx, $season, $round, $game_time, $game_stadium, $round_type);

        return $this->_setJSON($data);
    }

    /**
     * 파싱 이미지
     * @return \CodeIgniter\HTTP\Response
     */
    public function imgtest()
    {
        $url = $this->request->getGetPost('url');
        $division = $this->request->getGetPost('division');

        $data = $this->soccer_lb->imgDownload_func($url, $division);
        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
    }

}