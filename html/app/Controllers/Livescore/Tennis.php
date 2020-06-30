<?php

namespace App\Controllers\Livescore;

use App\Controllers\BaseController;
use App\Libraries\Flashscore_lb;

class Tennis extends BaseController
{
    protected $flashscore_lb;

    public function __construct()
    {
        $this->flashscore_lb = new Flashscore_lb();
    }

}