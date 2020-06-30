<?php
if (! function_exists('_response')) {

}

if (! function_exists('_yoil')) {
    function _yoil($date = null , $day = null)
    {
        if($day !== null){

            if(date('w', strtotime(date('Y-m-d')))+ $day == 7){
                return yoil[0];
            }
            return yoil[date('w', strtotime(date('Y-m-d')))+ $day];
        }else{
            return yoil[date('w', strtotime($date))];
        }
    }
}

if (! function_exists('_timeFormat')) {
    function _timeFormat($time , $type = null){
        return date($type, strtotime($time));
    }
}

if (! function_exists('_gmae_progress')) {
    function _game_progress($gameStart , $secondStart , $progress){
        $dt = new DateTime($gameStart);
        $sdt = new DateTime($secondStart);
        $time = \CodeIgniter\I18n\Time::instance($dt);
        $time2 = \CodeIgniter\I18n\Time::instance($sdt);
        switch ($progress) {
            case 1:
                $game_start_time = $time;
                $diff = $game_start_time->difference(nowdatetime);
                $min_gap = $diff->getMinutes();
                if ($min_gap > 45) {
                    $gap = '45+';
                } else {
                    $gap = $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                }
                break;
            case 2:
                $gap = '<b>HT</b>';
                break;
            case 3:
                $game_start_time = $time;
                $diff = $time2->difference(nowdatetime);
                $min_gap = $diff->getMinutes();

                if (45 + $min_gap > 90) {
                    $gap = '90+';
                } else {
                    $gap = 45 + $min_gap.'<img src="http://www.nowgoal.com/images/in.gif">';
                    ;
                }
                break;
            case 4:
                $gap = 'Ot';
                break;
            case 5:
                $gap = 'Pen';
                break;
            case -1:
                $gap = '<b>FT</b>';
                break;
            case -10:
                $gap = 'Cancel';
                break;
            case -11:
                $gap = 'Pend.';
                break;
            case -12:
                $gap = 'Abd';
                break;
            case -13:
                $gap = 'Pause.';
                break;
            case -14:
                $gap = 'Postp.';
                break;
            default:
                $gap = "";
                break;
        }
        return $gap;
    }
}

