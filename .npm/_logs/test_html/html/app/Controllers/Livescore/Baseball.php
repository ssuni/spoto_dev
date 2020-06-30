<?php

namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\View_lb;
use App\Libraries\Baseball_lb;
use App\Libraries\Flashscore_lb;

class Baseball extends BaseController
{
    protected $baseball_lb;
    protected $view_lb;
    protected $flashscore_lb;

    public function __construct()
    {
        $this->baseball_lb = new Baseball_lb();
        $this->flashscore_lb = new Flashscore_lb();
        $this->view_lb = new view_lb();
    }
    public function test()
    {
        echo view('test_v');
    }
    public function kbo_rank()
    {       
        $season = !empty($this->request->getPost('season')) ? $this->request->getPost('season') : null ;
        $series = !empty($this->request->getPost('series')) ? $this->request->getPost('series') : '0';
        $data = $this->baseball_lb->kbo_rank($season, $series);

        return $this->_setJSON($data);  
        
    }
    public function futures_rank()
    {
        $season = !empty($this->request->getPost('season')) ? $this->request->getPost('season') : null ;
        $data = $this->baseball_lb->futures_rank($season);

        return $this->_setJSON($data);          
    }
    public function mlb_rank()
    {
        $data = $this->flashscore_lb->mlb_rank();
        
        return $this->_setJSON($data); 
    }
    public function mlb_free_rank()
    {
        $data = $this->flashscore_lb->mlb_free_rank();
        
        return $this->_setJSON($data); 
    }
}
