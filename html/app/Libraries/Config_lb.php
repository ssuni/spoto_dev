<?php


namespace App\Libraries;


class Config_lb
{
    public function __construct()
    {
        helper('SimpleHtmlDom');
    }

    function get_http_response_code($url)
    {
        $headers = get_headers($url);
        return substr($headers[0], 9, 3);
    }

    public function curl($url = null)
    {
        if ($url == null) {
            return false;
        }
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0); // 헤더 출력 여부
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        curl_close($ch);

        return $res;
    }
}