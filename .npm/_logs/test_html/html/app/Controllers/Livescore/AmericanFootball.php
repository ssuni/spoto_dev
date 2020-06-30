<?php

namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\Flashscore_lb;

class AmericanFootball extends BaseController
{
    protected $flashscore_lb;

    public function __construct()
    {
        $this->flashscore_lb = new Flashscore_lb();
    }
    public function nfl_league_rank()
    {
        $data = $this->flashscore_lb->afootball_league_rank();
        
        return $this->_setJSON($data);    
    }
}