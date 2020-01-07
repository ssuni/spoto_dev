<?php


namespace App\Controllers;


class Analysis extends BaseController
{
    public function __construct()
    {
        
    }

    public function view($arg)
    {
        echo $arg;
        return view('analysis_v');
    }
}