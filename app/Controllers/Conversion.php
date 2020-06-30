<?php namespace App\Controllers;

use App\Libraries\Articles_lb;
use App\Libraries\Conversion_lb;

class Conversion extends BaseController
{
    protected $response;
    protected $conversion_lb;


    public function __construct()
    {
        $this->conversion_lb = new Conversion_lb();

        //helper(['SimpleHtmlDom']);
    }
    private function _setJSON($data)
    {
        if ($data == true) {
            $respond = $this->res(200, 'success', $data);
        } elseif ($data == false || empty($data)) {
            $respond = $this->res(404, '데이터가 없습니다.');
        }
        return $this->response->setJSON($respond);
    }
    public function test()
    {
        $data = $this->conversion_lb->league_round('36');
        
        //return $this->_setJSON($data);
    }
    //$league_idx, $season, $round: 라운드수; $game_time: full,half; $game_stadium: total,home,away; $round_type: full,last
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
    public function league_ranking()
    {
        $league_idx = !empty($this->request->getPost('league_idx')) ? $this->request->getPost('league_idx') : '36';
        $data = $this->conversion_lb->league_ranking($league_idx);
        return $this->_setJSON($data);
    }
    public function league()
    {
        $data = $this->conversion_lb->league_all();
        return $this->_setJSON($data);
    }
    //$filter 0: player_info, 1: currently_play, 2: transfer_info, 3: recent_statistics, 4: player_honor, 5: side_lineup, 6: last_update
    public function player()
    {
        $team_idx = $this->request->getPost('team_idx');
        $player_idx = $this->request->getPost('player_idx');
        $filter = $this->request->getGetPost('filter');
        
        $data = $this->conversion_lb->player($player_idx='101940');

        
        return $this->_setJSON($data);
    }
    //$filter 0 : game_versus, 1: game_event, 2: line_up, 3:tech_statistics
    public function game_results_detail($game_idx = '1763618', $filter = null)
    {
        $data = $this->conversion_lb->detail($game_idx, $filter);

        return $this->_setJSON($data);
    }
}
