<?php

namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\Flashscore_lb;
use App\Libraries\Kovo_lb;

class Volleyball extends BaseController
{
    protected $flashscore_lb;
    protected $kovo_lb;

    public function __construct()
    {
        $this->flashscore_lb = new Flashscore_lb();
        $this->kovo_lb  = new Kovo_lb();
    }
    public function league_rank()
    {
        //$data = $this->flashscore_lb->volleyball_league_m_rank();
        $selected_season = $this->request->getPost('selected_season');
        $gender = !empty($this->request->getPost('gender')) ? $this->request->getPost('gender') : 1;
        $division = !empty($this->request->getPost('division')) ? $this->request->getPost('division') : 1;

        $data = $this->kovo_lb->league_rank($selected_season, $gender, $division);
       
        return $this->_setJSON($data);
    }
    public function cup_rank()
    {
        $selected_season = $this->request->getPost('selected_season');
        $gender = !empty($this->request->getPost('gender')) ? $this->request->getPost('gender') : 1;
        $division = !empty($this->request->getPost('division')) ? $this->request->getPost('division') : 212;

        //$data = $this->flashscore_lb->volleyball_cup_m_rank();
        
        $data = $this->kovo_lb->cup_rank($selected_season, $gender, $division);
        return $this->_setJSON($data);    
    }
    
}