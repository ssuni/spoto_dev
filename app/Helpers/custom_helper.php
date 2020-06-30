<?php

if (!function_exists('viewSet')) {
    function viewSet($viewName, $data = null, $type = null)
    {
        $urlString = uri_string();
        $urlResult = explode('/', $urlString);
        $_class = !empty($urlResult[0]) ? $urlResult[0] : 'board' ;
        //$_method = $urlResult[1];

        $data['userVerification'] = userVerification();
        
        echo view('templates/header_v', $data);

        if ($type == null) {
            echo view($_class .'/'. $viewName . '_v');
        } elseif ($type == 1 && $data['userVerification']) {
            echo view($_class .'/'. $viewName . '_v');
        } elseif ($type == 1 && !$data['userVerification']) {
            $data['message'] = '로그인을 해주세요.';
            $data['back'] = true;
            echo view('templates/alert_v', $data);
        } elseif ($type == 2 && $data['userVerification']) {
            $data['message'] = '올바른 접근이 아닙니다.';
            $data['back'] = true;
            echo view('templates/alert_v', $data);
        } elseif ($type == 2 && !$data['userVerification']) {
            echo view($_class .'/'. $viewName . '_v');
        } elseif ($type == 3) {
            echo view('logCheck/logCheckHeader_v');
            echo view('logCheck/'. $viewName . '_v');
        }

        echo view('templates/footer_v');
    }
}

if (!function_exists('alert')) {
    function alert($message, $path = null, $type = null)
    {
        $data['userVerification'] = userVerification();
        
        if ($type == null) {
            $data['message'] = $message ;
            $data['path'] = $path ;
        } elseif ($type == 1 && $data['userVerification']) {
            $data['message'] = $message ;
            $data['path'] = $path ;
        } elseif ($type == 1 && !$data['userVerification']) {
            $data['message'] = '로그인을 해주세요.';
            $data['back'] = true;
        }
        echo view('templates/alert_v', $data);
    }
}

if (!function_exists('confirm')) {
    function confirm($message, $path = null, $type = null)
    {
        $data['userVerification'] = userVerification();
        if ($type == null) {
            $data['message'] = $message ;
            $data['path'] = $path ;
        } elseif ($type == 1 && $data['userVerification']) {
            $data['message'] = $message ;
            $data['path'] = $path ;
        } elseif ($type == 1 && $data['userVerification']) {
            $data['message'] = '로그인을 해주세요.';
            $data['back'] = true;
        }
        echo view('templates/confirm_v', $data);
    }
}

if (!function_exists('userVerification')) {
    function userVerification()
    {
        if (isset($_SESSION['pass'])) {
            $data['userVerification'] = true;
        } else {
            $data['userVerification'] = false;
        }
        return $data['userVerification'];
    }
}

if (!function_exists('userVerification')) {
    function userVerification()
    {
        if (isset($_SESSION['pass'])) {
            $data['userVerification'] = true;
        } else {
            $data['userVerification'] = false;
        }
        return $data['userVerification'];
    }
}
