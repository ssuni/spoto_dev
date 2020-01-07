<?php


namespace App\Controllers;


class Oddscomp extends BaseController
{
    public function __construct()
    {

    }

    public function view($arg)
    {
        echo $arg;
        return view('oddscomp_v');
    }
}