<?php
if (!function_exists('_response')) {

}

if (!function_exists('_yoil')) {
    function _yoil($date = null, $day = null)
    {
        if ($day !== null) {

            if (date('w', strtotime(date('Y-m-d'))) + $day == 7) {
                return yoil[0];
            }
            return yoil[date('w', strtotime(date('Y-m-d'))) + $day];
        } else {
            return yoil[date('w', strtotime($date))];
        }
    }
}

if (!function_exists('_timeFormat')) {
    function _timeFormat($time, $type = null)
    {
        return date($type, strtotime($time));
    }
}
if (!function_exists('_createDateRange')) {
    function _createDateRange($startDate, $endDate, $format = "Y-m-d")
    {
        $begin = new DateTime($startDate);
        $end = new DateTime($endDate);

        $interval = new DateInterval('P1D'); // 1 Day
        $dateRange = new DatePeriod($begin, $interval, $end);

        $range = [];
        foreach ($dateRange as $date) {
            $range[] = $date->format($format);
        }
        return $range;
    }
}

if (!function_exists('_gmae_progress')) {
    function _game_progress($gameStart, $secondStart, $progress)
    {
        $dt = new DateTime($gameStart);
        $sdt = new DateTime($secondStart);
        $time = \CodeIgniter\I18n\Time::instance($dt);
        $time2 = \CodeIgniter\I18n\Time::instance($sdt);
        switch ($progress) {
            case 0:
                $gap = "<div></div>";
                break;
            case 1:
                $game_start_time = $time;
                $diff = $game_start_time->difference(nowdatetime);
                $min_gap = $diff->getMinutes();
                if ($min_gap > 45) {
                    $gap = '<div style="color: #ff5e3a">45+</div>';
                } else {
                    $gap = '<div style="color: #ff5e3a">'.$min_gap . '<img src="https://spoto.com/img/in.gif"></div>';
                }
                break;
            case 2:
                $gap = '<div style="color: #ff5e3a"><b>HT</b></div>';
                break;
            case 3:
                $game_start_time = $time;
                $diff = $time2->difference(nowdatetime);
                $min_gap = $diff->getMinutes();

                if (45 + $min_gap > 90) {
                    $gap = '<div style="color: #ff5e3a">90+</div>';
                } else {
                    $gap = '<div style="color: #ff5e3a">'. (45+$min_gap) . '<img src="https://spoto.com/img/in.gif"></div>';;
                }
                break;
            case 4:
                $gap = '<div style="color: #ff5e3a">Ot</div>';
                break;
            case 5:
                $gap = '<div  style="color: #ff5e3a">Pen</div>';
                break;
            case -1:
                $gap = '<div style="color: #ff5e3a"><b>FT</b></div>';
                break;
            case -10:
                $gap = '<div style="color: #222222">Cancel</div>';
                break;
            case -11:
                $gap = '<div style="color: #ff5e3a">Pend.</div>';
                break;
            case -12:
                $gap = '<div style="color: #ff5e3a">Abd</div>';
                break;
            case -13:
                $gap = '<div style="color: #ff5e3a">Pause.</div>';
                break;
            case -14:
                $gap = '<div style="color: #ff5e3a">Postp.</div>';
                break;
            default:
                $gap = "";
                break;
        }
        return $gap;
    }
}

