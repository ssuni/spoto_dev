<?php namespace App\Controllers;

use App\Models\Register_m;
use App\Models\Log_m;
use App\Libraries\Register_lb;

class Register extends BaseController
{
    protected $Register_m;
    protected $Register_lb;
    protected $board;
    protected $log_m;

    public function __construct()
    {
        $this->Register_m = new Register_m();
        $this->Register_lb = new Register_lb();

        helper(['form', 'url']);
    }
    public function logCheck($get = null)
    {
        $this->log_m = new Log_m('login_log');
        $data = $this->log_m->logPagination();
        viewSet('logCheck', $data, 1);
    }
    public function logInsert()
    {
        $this->log_m = new Log_m('login_log');
        $data = $this->log_m->logInsert();
    }
    public function login($data = null, $type = null)
    {
        if ($data == null) {
            $data = $this->request->getPost();
        }
        if (empty($data['author'])) {
            $data = $this->Register_lb->snsUrl();
            viewSet('login', $data, 2);
        } else {
            $data['errors'] = $this->Register_lb->loginConf($data['author']);
            if (empty($data['errors']) && $type == null) {
                $data = $this->Register_lb->logInsert($data['author']);
                alert('로그인이 되었습니다.', 'articles/boardIndex');
            } elseif (empty($data['errors']) && $type == 'direct') {
                $data = $this->Register_lb->logInsert($data['author']);
                return;
            } else {
                $data = $this->Register_lb->logInsert($data['author'], false);
                alert('아이디 비밀번호를 확인해주세요.', 'register/login');
                viewSet('login', $data);
            }
        }
    }
    //카카오 로그인 redirect url
    public function kakaoResponse()
    {
        $code = $this->request->getGetPost('code');
        $data = $this->Register_lb->snsCheck($code, 'ka');
        $this->snsResult($data);
    }
    //네이버 로그인 redirect url
    public function naverResponse()
    {
        $state = $this->request->getGetPost('state');
        $data = $this->Register_lb->snsCheck($state, 'na');
        $this->snsResult($data);
    }
    //구글 로그인 redirect url
    public function googleResponse()
    {
        $code = $this->request->getGetPost('code');
        $data = $this->Register_lb->snsCheck($code, 'gl');
        $this->snsResult($data);
    }
    public function snsResult($data)
    {
        if (!empty($data['author']['sns_id'])) {
            alert('가입되지 않은 계정입니다. 회원가입 페이지로 이동합니다.');
            viewSet('signup', $data);
        } else {
            $this->Register_lb->loginConf($data);
            $data = $this->Register_lb->logInsert($data);
            alert('로그인이 되었습니다.', 'articles/boardIndex');
        }
    }
    public function logout()
    {
        $this->session->destroy();
        alert('로그아웃이 되었습니다.', 'register/login');
    }
    public function signup()
    {
        $data = $this->request->getPost();

        if (empty($data['author'])) {
            viewSet('signup', $data, 2);
        } else {
            $file = $this->request->getFileMultiple('file');
            $data['author'] = $this->libraries_lb->filesSave($file, 'profile_img', $data['author']);
            $data['errors'] = $this->Register_lb->signupInsert($data['author']);

            if (empty($data['errors'])) {
                $this->login($data, 'direct');
                alert('회원가입이 완료되었습니다.', 'register/myPage');
            } else {
                $this->libraries_lb->removeDir('profile_img', $data['author']);
                alert($data['errors'][key($data['errors'])]);
                viewSet('signup', $data);
            }
        }
    }
    public function myPage()
    {
        $data = $this->request->getPost();
        $sessionIdx = !empty($this->session->get('idx')) ? $this->session->get('idx') : null;
        if (empty($data) && !empty($sessionIdx)) {
            $data['key'] = $this->Register_lb->modified($this->session->get('idx'));
            viewSet('myPage', $data, 1);
        } elseif (!empty($sessionIdx)) {
            $file = $this->request->getFileMultiple('file');
            $data['author'] = $this->libraries_lb->filesSave($file, 'profile_img', $data['author']);

            $data['errors'] = $this->Register_lb->modifiedConf($data['author']);
            if (empty($data['errors'])) {
                alert('회원정보가 수정되었습니다.', 'register/myPage');
            } else {
                alert($data['errors'][key($data['errors'])], 'register/myPage');
            }
        } else {
            alert('올바른 접근이 아닙니다.', $data, 1);
        }
    }
}
