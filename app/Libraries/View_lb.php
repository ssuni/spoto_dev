<?php
namespace App\Libraries;

class View_lb
{
    public function __construct()
    {

    }

    public function setView($view,$data = array())
    {
        echo view('/inc/header_v',$data);
        echo view($view);
        echo view('/inc/footer_v');
    }
}