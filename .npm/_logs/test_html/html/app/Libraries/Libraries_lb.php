<?php namespace App\Libraries;

use App\Controllers\BaseController;
use CodeIgniter\I18n\Time;

class Libraries_lb extends BaseController
{
    protected $session;

    public function __construct()
    {
        $this->session = session();

        helper('text');
        helper('date');
        helper('filesystem');
    }
    public function logInsert()
    {
    }
    // 서버에 파일저장
    public function filesSave($files, $folderName, $data = null)
    {
        if (!empty($files)) {
            $fileName = [];
            foreach ($files as $key) {
                if ($key->getName()) {
                    $randName = $key->getRandomName();
                    $fileName[] = $randName;
                    $mdFolder = empty($data['files_folder']) ? random_string('md5') : $data['files_folder'];

                    $this->mkdirCheck($folderName, $mdFolder);

                    $key->move(WRITEPATH . 'uploads/'. $folderName .'/'. $mdFolder .'/', $randName);

                    $data['files_folder'] = $mdFolder;
                }
            }
            $data['profile_img'] = $fileName;

            if ($folderName == 'board') {
                $_SESSION['files_folder'] = $data['files_folder'] ;
                $data = [
                    'files_folder' => $data['files_folder'],
                    'files_name' => $fileName
                ];
            }
        }
        return $data;
    }
    //type 0:게시판 insert화면 초기셋팅   1:게시판 글생성 후 초기화
    public function filesReset($type = 0)
    {
        if (!empty($_SESSION['files_folder']) && $type == 0) {
            $this->removeDir('board', $_SESSION);
            unset($_SESSION['files_folder']);
        } elseif (!empty($_SESSION['files_folder']) && $type == 1) {
            unset($_SESSION['files_folder']);
        }
    }
    //디렉토리 존재여부 확인후 생성
    public function mkdirCheck($folderName, $mdFolder)
    {
        $path = WRITEPATH . 'uploads/' . $folderName . '/' . $mdFolder ;

        if (!is_dir($path)) {
            mkdir($path);
        }
    }
    //디렉토리 삭제
    public function removeDir($folderName, $mdFolder)
    {
        if (is_dir(WRITEPATH . 'uploads/'.$folderName .'/'. $mdFolder['files_folder']) && !empty($mdFolder['files_folder'])) {
            delete_files(WRITEPATH . 'uploads/' .$folderName. '/' . $mdFolder['files_folder'], true);
            rmdir(WRITEPATH . 'uploads/'.$folderName.'/' . $mdFolder['files_folder']);
        }
    }
    //세션,파일 제거
    public function sessionRemove()
    {
        $files = $this->session->get('files');
        $this->session->remove('files');
        if (!empty($files['folder_name'])) {
            delete_files(WRITEPATH . 'uploads/board/'. $files['folder_name'], true);
            if (is_dir(WRITEPATH . 'uploads/board/'. $files['folder_name'])) {
                rmdir(WRITEPATH . 'uploads/board/'. $files['folder_name']);
            }
        }
    }
}
