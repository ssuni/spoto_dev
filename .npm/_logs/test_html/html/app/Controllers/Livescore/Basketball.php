<?php

namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\View_lb;
use App\Libraries\Flashscore_lb;
use CodeIgniter\I18n\Time;

class Basketball extends BaseController
{
    protected $flashscore_lb;
    protected $view_lb;

    public function __construct()
    {
        $this->flashscore_lb = new Flashscore_lb();
        $this->view_lb = new view_lb();
    }
    public function test()
    {
        $this->flashscore_lb->test();
    }
    public function nba_rank()
    {       
        $data = $this->flashscore_lb->nba_rank();
        
        return $this->_setJSON($data);
    }
}
