<?php


namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\View_lb;
use App\Libraries\Baseball_lb;
use App\Libraries\Conversion_lb;
use CodeIgniter\I18n\Time;

class Baseball extends BaseController
{
    public function __construct()
    {
        $this->view_lb = new View_lb();
        $this->baseball_lb = new Baseball_lb();


        helper('livescore');
    }

    public function getStandingJson()
    {
        $data = $this->baseball_lb->kboStanding();
        $data = $this->baseball_lb->mlbStanding();

        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);
        exit;

        $respond = $this->res(200, 'success', $data);
        return $this->response->setJSON($respond);

    }
}