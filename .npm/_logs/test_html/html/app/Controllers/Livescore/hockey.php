<?php

namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\Flashscore_lb;

class Hockey extends BaseController
{
    protected $flashscore_lb;

    public function __construct()
    {
        $this->flashscore_lb = new Flashscore_lb();
    }
    public function nhl_league_rank()
    {
        $data = $this->flashscore_lb->hockey_league_rank();
        
        return $this->_setJSON($data);    
    }

}