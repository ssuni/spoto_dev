<?php
namespace App\Libraries;

class View_lb
{
    public function __construct()
    {
        $this->uri = current_url(true);
        $this->segments = $this->uri->getSegments();
    }

    public function setView($view,$data = array())
    {
        echo view('/inc/header_v',$data);
       
        if(count($this->segments) >= 2) {
            if ($this->uri->getSegment(3) !== 'analysis') {
                echo view('/inc/nav_v', $data);
                echo view('/inc/left_v', $data);
            }
        }
        echo view($view,$data);
        echo view('/inc/footer_v');
    }
}