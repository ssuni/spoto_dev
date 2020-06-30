<?php namespace App\Libraries;

use App\Controllers\BaseController;
use App\Models\UsersRegister_m;
use App\Models\Log_m;
use Google_Client;
use Google_Service_Oauth2;

class UsersRegister_lb extends BaseController
{
    protected $usersRegister_m;
    protected $log_m;
    protected $validation;
    protected $session;

    public function __construct()
    {
        $this->validation = \Config\Services::validation();
        $this->encrypter = \Config\Services::encrypter();
        $this->session = \Config\Services::session();
        $this->usersRegister_m = new UsersRegister_m();
       
        helper('filesystem');
    }
    //회원가입 유효성 검사
    public function usersValid()
    {
        return [
            'id' => 'required|min_length[5]|valid_email|is_unique[users.id]',
            'pass' => 'required|min_length[3]',
            'pass_conf' => 'required|matches[pass]',
            'name' => 'required|min_length[2]|max_length[10]|is_unique[users.name]',
            'age' => 'required|max_length[3]',
            'gender' => 'required',
        ];
    }
    //로그인 유효성 검사
    public function loginValid()
    {
        return [
            'id' => 'required|is_not_unique[users.id]',
            'pass' => 'required'
        ];
    }
    //회원정보수정 유효성 검사
    public function modifiedValid($data)
    {
        return [
            'name' => 'required|min_length[2]|max_length[10]|is_unique[users.name,users.name,' . $data['name'] . ']',
            'pass' => 'required|min_length[3]|max_length[20]',
            'pass_conf' => 'required|matches[pass]',
            'second_pass' => 'max_length[6]',
            'second_pass_conf' => 'matches[second_pass]',
            'age' => 'required|max_length[3]',
            'gender' => 'required',
        ];
    }
    public function logInsert($data, $success = true)
    {
        $this->log_m = new Log_m('login_log');
        if ($success == true) {
            $data['login_success'] = 0; //0 = 로그인 성공
        } else {
            $data['login_success'] = 1; //1 = 로그인 실패
        }
        $this->log_m->logInsert($data);
    }
    //회원가입 유효성 검사 set
    public function signupValidConf($data)
    {
        $valid = $this->usersValid();
        if (empty($data['sns_type'])) {
            $this->validation->setRules($valid);
        } else {
            $valid['id'] = 'required|min_length[5]|is_unique[users.id]';
            $this->validation->setRules($valid);
        }
        $this->validation->run($data);

        return $this->validation->getErrors();
    }
    //로그인 유효성 검사 set
    public function loginValidConf($data)
    {
        $this->validation->setRules($this->loginValid($data['id']));
        $this->validation->run($data);
        return $this->validation->getErrors();
    }
    //회원정보수정 유효성 검사 set
    public function modifiedValidConf($data, $result)
    {
        $this->validation->setRules($this->modifiedValid($result));
        $this->validation->run($data);
        return $this->validation->getErrors();
    }
    public function loginConf($data)
    {
        $data['errors'] = $this->loginValidConf($data);
        if (empty($data['errors'])) {
            $result = $this->usersRegister_m->selectRow($data['id'], 'id');
            $result['pass'] = $this->decrypt($result['pass']);
            if ($data['pass'] == $result['pass']) {
                $this->sessionSet($result);
                return;
            } else {
                $data['errors']['pass'] = '비밀번호가 틀렸습니다.';
            }
        }
        return $data['errors'];
    }
    //sns회원가입 여부
    public function snsCheck($code, $snsName)
    {
        $snsNameRoute = $snsName . 'Login';
        $result = $this->$snsNameRoute($code);
        $id = $snsName . '@' . $result->id;
        $resultUser = $this->usersRegister_m->selectRow($id, 'id');

        if (empty($resultUser)) {
            $data['author']['sns_id'] = $result->id;
            $data['author']['id'] = $id;
            $data['author']['pass'] = $result->id;
            $data['author']['sns_type'] = $this->usersRegister_lb->snsType($snsName);
            return $data;
        } else {
            $resultUser['pass'] = $this->decrypt($resultUser['pass']);
            $resultUser['pass_conf'] = $resultUser['pass'];
            return $resultUser;
        }
    }
    public function modified($idx)
    {
        $result = $this->usersRegister_m->selectRow($idx);
        $result['pass'] = $this->decrypt($result['pass']);
        if (!empty($result['second_pass'])) {
            $result['second_pass'] = $this->decrypt($result['second_pass']);
        }
        if ($result['profile_img'] == null) {
            $result['img_path'] = 'uploads/profile_img/sample/1579671434_b123ca06d69de818d1b0.jpg';
        } else {
            $result['img_path'] = 'uploads/profile_img/' . $result['files_folder'] . '/' . $result['profile_img'];
        }
        return $result;
    }
    public function modifiedConf($data)
    {
        $result = $this->usersRegister_m->selectRow($data['idx']);
        $result['errors'] = $this->modifiedValidConf($data, $result);

        unset($data['pass_conf']);
        unset($data['second_pass_conf']);
        unset($data['img_name']);
        unset($data['folder_name']);

        if (empty($result['errors'])) {
            $data['pass'] = $this->encrypt($data['pass']);
            if (!empty($data['second_pass'])) {
                $data['second_pass'] = $this->encrypt($data['second_pass']);
            }
            $this->usersRegister_m->updateRow($data);
        } else {
            return $result['errors'];
        }
    }
    //비밀번호 암호화
    public function encrypt($password)
    {
        return base64_encode($this->encrypter->encrypt($password));
    }
    //비밀번호 복호화
    public function decrypt($password)
    {
        return $this->encrypter->decrypt(base64_decode($password));
    }
    //로그인 성공시 회원정보 세션저장
    public function sessionSet($result)
    {
        $result = [
            'idx' => $result['idx'],
            'id' => $result['id'],
            'name' => $result['name'],
            'pass' => $this->encrypt($result['pass']),
            'idx' => $result['idx'],
            'admin' => $result['admin'],
            'files_folder' => $result['files_folder']
        ];
        $this->session->set($result);
    }
    //sns로그인 뷰페이지 url
    public function snsUrl()
    {
        $snsUrl['kakaoUrl'] = $this->kakaoUrl();
        $snsUrl['naverUrl'] = $this->naverUrl();
        $snsUrl['googleUrl'] = $this->googleUrl();

        return $snsUrl;
    }

    private function kakaoUrl()
    {
        $url = 'https://kauth.kakao.com/oauth/authorize';
        $clientId = '?client_id=ecc6bb4d32e16a1dac0b1a7e7b9125d7';
        $redirectUrl = '&redirect_uri=https://spoto.com/UsersRegister/kakaoResponse';
        $response = '&response_type=code';

        return $url . $clientId . $redirectUrl . $response;
    }

    private function naverUrl()
    {
        $state = md5(microtime() . mt_rand());

        $url = 'https://nid.naver.com/oauth2.0/authorize';
        $clientId = '?client_id=JMBf7aT7oPXz3ULnEdxn';
        $redirectUrl = '&redirect_uri=https://spoto.com/UsersRegister/naverResponse';
        $response = '&response_type=code';
        $state = '&state=' . $state;

        return $url . $clientId . $redirectUrl . $response . $state;
    }

    private function googleUrl()
    {
        $url = 'https://accounts.google.com/o/oauth2/v2/auth';
        $clientId = '?client_id=39219976976-vjhpcbhkbulgqs9cdlj7q5a7q4vd3421.apps.googleusercontent.com';
        $redirectUrl = '&redirect_uri=https://spoto.com/UsersRegister/googleResponse';
        $response = '&response_type=code';
        $scope = '&scope=email%20profile';
        $state = '&state=%2Fprofile';
        $approval_prompt = '&approval_prompt=force';

        return $url . $clientId . $redirectUrl . $response . $scope . $state . $approval_prompt;
    }
    //sns type 설정
    public function snsType($data)
    {
        switch ($data) {
            case 'ka':
                $data = 1;
                break ;
            case 'na':
                $data = 2;
                break ;
            case 'gl':
                $data = 3;
                break ;
            $data = null ;
        }
        return $data ;
    }
    //카카오로그인 성공시 회원고유 id값 받아오기
    public function kaLogin($code)
    {
        $app_key = '5093f115f5ddad453b971548da8f09f8';
        $redirect_uri = 'https://spoto.com/UsersRegister/kakaoResponse';
        $api_url = 'https://kauth.kakao.com/oauth/token';
        $params = sprintf('grant_type=authorization_code&client_id=%s&redirect_uri=%s&code=%s', $app_key, $redirect_uri, $code);
        $result = $this->curlSet($api_url, true, null, $params);

        if (!empty($result->access_token)) {
            $_SESSION['kakao_token'] = $result->access_token;
            $api_url = 'https://kapi.kakao.com/v2/user/me';
            $header = array("Authorization: Bearer " . $result->access_token);
            $result = $this->curlSet($api_url, true, $header);
            return $result;
        }
    }
    //네이버로그인 성공시 회원고유 id값 받아오기
    public function naLogin($state)
    {
        if (!empty($state)) {
            $_SESSION['naver_state'] = $state;

            $url = 'https://nid.naver.com/oauth2.0/token';
            $clientId = '?client_id=JMBf7aT7oPXz3ULnEdxn';
            $clientSecret = '&client_secret=XTX47Mj7JL';
            $redirectUri = '&redirect_uri=https://spoto.com//UsersRegister/naverResponse';
            $grantType = '&grant_type=authorization_code';

            $naver_curl = $url . $clientId . $clientSecret . $redirectUri . $grantType . '&code=' . $_GET['code'] . "&state=" . $_GET['state'];

            $response = $this->curlSet($naver_curl, false);

            if (!empty($response->access_token)) {
                $token = $response->access_token;
                $header = "Bearer " . $token;
                $url = "https://openapi.naver.com/v1/nid/me";
                $headers = array();
                $headers[] = "Authorization: " . $header;

                $response = $this->curlSet($url, false, $headers);

                if ($response->message == 'success') {
                    return $response->response;
                } else {
                    echo "Error 내용:" . $response;
                }
            }
        } else {
            $response = json_decode($response, true);
        }
    }
    //구글로그인 성공시 회원고유 id값 받아오기
    public function glLogin($code)
    {
        $client = new Google_Client();

        $client->setClientId('39219976976-vjhpcbhkbulgqs9cdlj7q5a7q4vd3421.apps.googleusercontent.com');
        $client->setClientSecret('nVG7q_Rm7c2Dt9IEwph0KyNq');
        $client->setRedirectUri('https://spoto.com/UsersRegister/googleResponse');

        $objOAuthService = new Google_Service_Oauth2($client);

        if (isset($code)) {
            $client->authenticate($code);
        }

        if ($client->getAccessToken()) {
            $userData = $objOAuthService->userinfo->get();
        }
        return $userData;
    }
    public function curlSet($apiUrl, $isPost, $header = null, $params = null)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, $isPost);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        $header != null ? curl_setopt($ch, CURLOPT_HTTPHEADER, $header) : null;

        $response = json_decode(curl_exec($ch));
        curl_close($ch);

        return $response;
    }
}
