<?php

//--------------------------------------------------------------------
// App Namespace
//--------------------------------------------------------------------
// This defines the default Namespace that is used throughout
// CodeIgniter to refer to the Application directory. Change
// this constant to change the namespace that all application
// classes should use.
//
// NOTE: changing this will require manually modifying the
// existing namespaces of App\* namespaced-classes.
//
defined('APP_NAMESPACE') || define('APP_NAMESPACE', 'App');

/*
|--------------------------------------------------------------------------
| Composer Path
|--------------------------------------------------------------------------
|
| The path that Composer's autoload file is expected to live. By default,
| the vendor folder is in the Root directory, but you can customize that here.
*/
defined('COMPOSER_PATH') || define('COMPOSER_PATH', ROOTPATH . 'vendor/autoload.php');

/*
|--------------------------------------------------------------------------
| Timing Constants
|--------------------------------------------------------------------------
|
| Provide simple ways to work with the myriad of PHP functions that
| require information to be in seconds.
*/
defined('SECOND') || define('SECOND', 1);
defined('MINUTE') || define('MINUTE', 60);
defined('HOUR')   || define('HOUR', 3600);
defined('DAY')    || define('DAY', 86400);
defined('WEEK')   || define('WEEK', 604800);
defined('MONTH')  || define('MONTH', 2592000);
defined('YEAR')   || define('YEAR', 31536000);
defined('DECADE') || define('DECADE', 315360000);

/*
|--------------------------------------------------------------------------
| Exit Status Codes
|--------------------------------------------------------------------------
|
| Used to indicate the conditions under which the script is exit()ing.
| While there is no universal standard for error codes, there are some
| broad conventions.  Three such conventions are mentioned below, for
| those who wish to make use of them.  The CodeIgniter defaults were
| chosen for the least overlap with these conventions, while still
| leaving room for others to be defined in future versions and user
| applications.
|
| The three main conventions used for determining exit status codes
| are as follows:
|
|    Standard C/C++ Library (stdlibc):
|       http://www.gnu.org/software/libc/manual/html_node/Exit-Status.html
|       (This link also contains other GNU-specific conventions)
|    BSD sysexits.h:
|       http://www.gsp.com/cgi-bin/man.cgi?section=3&topic=sysexits
|    Bash scripting:
|       http://tldp.org/LDP/abs/html/exitcodes.html
|
*/
defined('EXIT_SUCCESS')        || define('EXIT_SUCCESS', 0); // no errors
defined('EXIT_ERROR')          || define('EXIT_ERROR', 1); // generic error
defined('EXIT_CONFIG')         || define('EXIT_CONFIG', 3); // configuration error
defined('EXIT_UNKNOWN_FILE')   || define('EXIT_UNKNOWN_FILE', 4); // file not found
defined('EXIT_UNKNOWN_CLASS')  || define('EXIT_UNKNOWN_CLASS', 5); // unknown class
defined('EXIT_UNKNOWN_METHOD') || define('EXIT_UNKNOWN_METHOD', 6); // unknown class member
defined('EXIT_USER_INPUT')     || define('EXIT_USER_INPUT', 7); // invalid user input
defined('EXIT_DATABASE')       || define('EXIT_DATABASE', 8); // database error
defined('EXIT__AUTO_MIN')      || define('EXIT__AUTO_MIN', 9); // lowest automatically-assigned error code
defined('EXIT__AUTO_MAX')      || define('EXIT__AUTO_MAX', 125); // highest automatically-assigned error code

define('nowdate',date("Y-m-d"));
define('nowdatetime',date("Y-m-d H:i:s"));
define('yoil',array("일", "월", "화", "수", "목", "금", "토"));

define('cache','?'.time());
define('team',array(
    9094 => 'Canberra United (w)',
    20718 => 'WS Wanderers (w)',
    25968 => '	Melbourne City (w)'
));

define('flag', array( 
    array(
        "country_idx" => "1",
        "position_Y" => "-480",
        "country_name_ko" => "영국",
        "country_name_en" => "england"
    ), array(
        "country_idx" => "2",
        "position_Y" => "-168",
        "country_name_ko" => "이탈리아",
        "country_name_en" => "italy"
    ), array(
        "country_idx" => "3",
        "position_Y" => "-1128",
        "country_name_ko" => "스페인",
        "country_name_en" => "spain"
    ), array(
        "country_idx" => "4",
        "position_Y" => "-624",
        "country_name_ko" => "독일",
        "country_name_en" => "germany"
    ), array(
        "country_idx" => "5",
        "position_Y" => "-144",
        "country_name_ko" => "프랑스",
        "country_name_en" => "france"
    ), array(
        "country_idx" => "6",
        "position_Y" => "-1056",
        "country_name_ko" => "포르투갈",
        "country_name_en" => "portugal"
    ), array(
        "country_idx" => "7",
        "position_Y" => "-1104",
        "country_name_ko" => "스코틀랜드",
        "country_name_en" => "scotland"
    ), array(
        "country_idx" => "8",
        "position_Y" => "-1032",
        "country_name_ko" => "네덜란드",
        "country_name_en" => "netherlands"
    ), array(
        "country_idx" => "9",
        "position_Y" => "-888",
        "country_name_ko" => "벨기에",
        "country_name_en" => "belgium"
    ), array(
        "country_idx" => "10",
        "position_Y" => "-336",
        "country_name_ko" => "스웨덴",
        "country_name_en" => "sweden"
    ), array(
        "country_idx" => "14",
        "position_Y" => "-264",
        "country_name_ko" => "오스트리아",
        "country_name_en" => "austria"
    ), array(
        "country_idx" => "36",
        "position_Y" => "-192",
        "country_name_ko" => "키프로스",
        "country_name_en" => "cyprus"
    ), array(
        "country_idx" => "13",
        "position_Y" => "-528",
        "country_name_ko" => "덴마크",
        "country_name_en" => "denmark"
    ), array(
        "country_idx" => "11",
        "position_Y" => "-936",
        "country_name_ko" => "핀란드",
        "country_name_en" => "finland"
    ), array(
        "country_idx" => "22",
        "position_Y" => "-288",
        "country_name_ko" => "그리스",
        "country_name_en" => "greece"
    ), array(
        "country_idx" => "25",
        "position_Y" => "-960",
        "country_name_ko" => "아이슬란드",
        "country_name_en" => "iceland"
    ), array(
        "country_idx" => "16",
        "position_Y" => "-552",
        "country_name_ko" => "아일랜드",
        "country_name_en" => "ireland"
    ), array(
        "country_idx" => "12",
        "position_Y" => "0",
        "country_name_ko" => "노르웨이",
        "country_name_en" => "norway"
    ), array(
        "country_idx" => "15",
        "position_Y" => "-745",
        "country_name_ko" => "스위스",
        "country_name_en" => "switzerland"
    ), array(
        "country_idx" => "32",
        "position_Y" => "-1152",
        "country_name_ko" => "터키",
        "country_name_en" => "turkey"
    ), array(
        "country_idx" => "28",
        "position_Y" => "-96",
        "country_name_ko" => "벨라루스",
        "country_name_en" => "belarus"
    ), array(
        "country_idx" => "34",
        "position_Y" => "-504",
        "country_name_ko" => "불가리아",
        "country_name_en" => "bulgaria"
    ), array(
        "country_idx" => "33",
        "position_Y" => "-912",
        "country_name_ko" => "크로아티아",
        "country_name_en" => "croatia"
    ), array(
        "country_idx" => "21",
        "position_Y" => "-120",
        "country_name_ko" => "체코",
        "country_name_en" => "czech repoublic"
    ), array(
        "country_idx" => "89",
        "position_Y" => "-1512",
        "country_name_ko" => "에스토니아",
        "country_name_en" => "estonia"
    ), array(
        "country_idx" => "31",
        "position_Y" => "-216",
        "country_name_ko" => "헝가리",
        "country_name_en" => "hungary"
    ), array(
        "country_idx" => "19",
        "position_Y" => "-648",
        "country_name_ko" => "폴란드",
        "country_name_en" => "poland"
    ), array(
        "country_idx" => "23",
        "position_Y" => "-672",
        "country_name_ko" => "루마니아",
        "country_name_en" => "romania"
    ), array(
        "country_idx" => "18",
        "position_Y" => "-1080",
        "country_name_ko" => "러시아",
        "country_name_en" => "russia"
    ), array(
        "country_idx" => "24",
        "position_Y" => "-312",
        "country_name_ko" => "슬로바키아",
        "country_name_en" => "slovakia"
    ), array(
        "country_idx" => "20",
        "position_Y" => "-360",
        "country_name_ko" => "우크라이나",
        "country_name_en" => "ukraine"
    ), array(
        "country_idx" => "41",
        "position_Y" => "-456",
        "country_name_ko" => "미국",
        "country_name_en" => "united states"
    ), array(
        "country_idx" => "79",
        "position_Y" => "-1368",
        "country_name_ko" => "캐나다",
        "country_name_en" => "canadian"
    ), array(
        "country_idx" => "38",
        "position_Y" => "-408",
        "country_name_ko" => "아르헨티나",
        "country_name_en" => "argentina"
    ), array(
        "country_idx" => "39",
        "position_Y" => "-816",
        "country_name_ko" => "브라질",
        "country_name_en" => "brazil"
    ), array(
        "country_idx" => "43",
        "position_Y" => "-432",
        "country_name_ko" => "멕시코",
        "country_name_en" => "mexico"
    ), array(
        "country_idx" => "42",
        "position_Y" => "-24",
        "country_name_ko" => "칠레",
        "country_name_en" => "chile"
    ), array(
        "country_idx" => "63",
        "position_Y" => "-1344",
        "country_name_ko" => "콜롬비아",
        "country_name_en" => "colombia"
    ), array(
        "country_idx" => "27",
        "position_Y" => "-840",
        "country_name_ko" => "페루",
        "country_name_en" => "peru"
    ), array(
        "country_idx" => "45",
        "position_Y" => "-1392",
        "country_name_ko" => "중국",
        "country_name_en" => "china"
    ), array(
        "country_idx" => "46",
        "position_Y" => "-864",
        "country_name_ko" => "일본",
        "country_name_en" => "japan"
    ), array(
        "country_idx" => "47",
        "position_Y" => "-2640",
        "country_name_ko" => "한국",
        "country_name_en" => "korea republic"
    ), array(
        "country_idx" => "48",
        "position_Y" => "-792",
        "country_name_ko" => "싱가포르",
        "country_name_en" => "singapore"
    ), array(
        "country_idx" => "100",
        "position_Y" => "-2448",
        "country_name_ko" => "태국",
        "country_name_en" => "thailand"
    ), array(
        "country_idx" => "102",
        "position_Y" => "-2736",
        "country_name_ko" => "베트남",
        "country_name_en" => "vietnam"
    ), array(
        "country_idx" => "64",
        "position_Y" => "-1920",
        "country_name_ko" => "말레이시아",
        "country_name_en" => "malaysia"
    ), array(
        "country_idx" => "70",
        "position_Y" => "-1704",
        "country_name_ko" => "이집트",
        "country_name_en" => "egypt"
    ), array(
        "country_idx" => "99",
        "position_Y" => "-1656",
        "country_name_ko" => "남아프리카 공화국",
        "country_name_en" => "south africa"
    ), array(
        "country_idx" => "49",
        "position_Y" => "-1176",
        "country_name_ko" => "오스트레일리아",
        "country_name_en" => "australia"
    ), array(
        "country_idx" => "65",
        "position_Y" => "-2976",
        "country_name_ko" => "뉴질랜드",
        "country_name_en" => "new zealand"
    ), array(
        "country_idx" => "52",
        "position_Y" => "-1200",
        "country_name_ko" => "intercontinental",
        "country_name_en" => "intercontinental"
    ), array(
        "country_idx" => "53",
        "position_Y" => "-1200",
        "country_name_ko" => "intercontinental",
        "country_name_en" => "intercontinental"
    ), array(
        "country_idx" => "54",
        "position_Y" => "-1200",
        "country_name_ko" => "intercontinental",
        "country_name_en" => "intercontinental"
    ), array(
        "country_idx" => "56",
        "position_Y" => "-1200",
        "country_name_ko" => "intercontinental",
        "country_name_en" => "intercontinental"
    ), array(
        "country_idx" => "55",
        "position_Y" => "-1200",
        "country_name_ko" => "intercontinental",
        "country_name_en" => "intercontinental"
    ), array(
        "country_idx" => "97",
        "position_Y" => "-1200",
        "country_name_ko" => "intercontinental",
        "country_name_en" => "intercontinental"
    )     
));