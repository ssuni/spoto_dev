<?php namespace App\Controllers;

use App\Libraries\Articles_lb;
use App\Models\Articles_m;
use CodeIgniter\I18n\Time;

class Articles extends BaseController
{
    protected $articles_lb;
    protected $articles_m;
    
    public function __construct()
    {
        $this->articles_lb = new Articles_lb();
        $this->articles_m = new Articles_m();
        helper(['filesystem', 'SimpleHtmlDom']);
    }
    public function test()
    {
        $img = file_get_contents(WRITEPATH.'1.png');

        echo '<img src="'.WRITEPATH .'1.png">';
        
        //echo '<img src="data:image/jpg;base64,' . base64_encode($img).'">';
    }
    public function testVs()
    {
        $data = $this->request->getPost();
        $data['game_idx'] = '1782314';
        $data['type'] = ["dataTeamVersus", "dataOpponent"];
        $url = 'http://www.nowgoal.com/detail/1763618.html';
        $test = file_get_html($url);
        echo$test;
        $test = $test->find('#teamTechDiv_detail');
        foreach ($test as $key) {
            echo $key;
        }
        $test = $test->find('#teamTechDiv_detail');
        foreach ($test as $key) {
            echo $key;
        }
        $test = $test->find('#teamTechDiv_detail');
        foreach ($test as $key) {
            echo $key;
        }
        //$result = $this->articles_lb->dataAnalysis($data);
    }

    public function dataAnalysis()
    {
        $data = $this->request->getPost();
        $url = 'http://www.nowgoal.com/analysis/'.$data['game_idx'].'.html';
        $test = file_get_html($url);
        $result = $this->articles_lb->dataAnalysis($data);
        echo json_encode($result);
    }
    public function dataGameSchedule()
    {
        $type = !empty($this->request->getPost('type')) ?
         $this->request->getPost('type') : null ;
        $date = !empty($this->request->getPost('date')) ?
         $this->request->getPost('date') : null ;
         
        //1 = before day , 2 = after day
        if ($type == 1) {
            $gameDay = $this->articles_lb->formatDate($date, 4);
        } elseif ($type == 2) {
            $gameDay = $this->articles_lb->formatDate($date, 5);
        }
        // today
        else {
            $gameDay = $this->articles_lb->formatDate(date("Y-m-d", time()), 2);
        }

        $url = 'https://spoto.com/livescore/soccer/board_analysis/'. $gameDay ;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $res = curl_exec($ch);
        curl_close($ch);
        $res = json_decode($res);
        
        foreach ($res->data as $key => $value) {
            $leagueIdx = $value->league_config->league_idx;
            
            $analysis[] = [
                'game_idx' => $value->game_idx,
                'league_name' => $value->league_config->short_name,
                'league_idx' => $value->league_config->league_idx,
                'game_href' => 'http://www.nowgoal.com/detail/' . $value->game_idx . '.html',
                'home_name' => $value->home_name,
                'away_name' => $value->away_name,
                'home_href' => 'http://info.nowgoal.com/en/team/summary/' . $value->home_idx . '.html',
                'away_href' => 'http://info.nowgoal.com/en/team/summary/' . $value->away_idx . '.html',
                'game_time' => $this->articles_lb->formatDate($value->year, 1)
            ];
        }
        if ($type == 1 || $type == 2) {
            $analysis['game_day'] = $gameDay;
            echo json_encode($analysis);
        }
        
        return !empty($analysis[0]) ? $analysis : null;
    }
    public function commentInsert()
    {
        $data = $this->request->getPost('comment');
        echo json_encode($data);
        $this->articles_m->insertRow($data, 'board_comments');
    }
    public function filesUpload()
    {
        $files = $this->request->getFiles('files');
        
        $get = $this->request->getGetPost('idx');
        if (!empty($files)) {
            if (!empty($get)) {
                $data = $this->articles_m->selectData($get)[0];
            }
            if (!empty($data['files_folder'])) {
                $data = $this->libraries_lb->filesSave($files, 'board', $data);
            } else {
                $data = $this->libraries_lb->filesSave($files, 'board', $_SESSION);
            }
            var_dump($data);
            exit;
            echo json_encode($data);
        } else {
            echo json_encode($file['uplaods'] = null);
        }
    }
    public function boardIndex()
    {
        $this->libraries_lb->filesReset(1);
        $data = $this->articles_lb->boardIndex();
        viewSet('board', $data);
    }
    public function boardContents()
    {
        $get['idx'] = $this->request->getGetPost('idx');
        $get['type'] = $this->request->getGetPost('type');
        $data = $this->articles_lb->boardContents($get);
        if (empty($data['board']) && empty($get['type'])) {
            alert('페이지가 없습니다', 'articles/boardContents?idx=' . $get['idx']);
        } elseif (!empty($data['board']) && !empty($get['type'])) {
            return redirect()->to('boardContents?idx=' . $data['board'][0]['idx']);
        } elseif (empty($data['board']) && !empty($get['type'])) {
            alert('페이지가 없습니다', 'articles/boardContents?idx=' . $get['idx']);
        } else {
            $data['icon'] = $this->articles_lb->iconFolderList();
            $data['comment'] = $this->articles_lb->commentsAll($get['idx']);
            viewSet('boardContents', $data);
        }
    }
    
    public function boardInsert()
    {
        $data = $this->request->getPost('board');
        
        $analysis = $this->dataGameSchedule();
        $gameIdx = [];
        if ($data == null) {
            $this->libraries_lb->filesReset();
            $data['icon'] = $this->articles_lb->iconFolderList();
            $data['gameIdx'] = $gameIdx;
            $data['analysis'] = $analysis;
            $data['today'] =  $this->articles_lb->formatDate(date("Y-m-d", time()), 2);
            ;
            viewSet('boardInsert', $data, 1);
        } else {
            $data = $this->request->getPost('board');
            $files = $this->request->getFiles('files');
            $this->articles_lb->boardInsert($data, 'board');
            $this->libraries_lb->filesReset(1);
            alert('게시글이 작성되었습니다.', 'articles/boardIndex');
        }
    }
    public function boardUpdate()
    {
        $get['idx'] = $this->request->getGetPost('idx');
        $data['board'] = $this->request->getPost('board');
        
        if (empty($data['board'])) {
            $data = $this->articles_lb->boardPermission($get);
            if (!empty($data)) {
                viewSet('boardUpdate', $data);
            } else {
                alert('권한이 없습니다.', 'articles/boardContents?idx=' . $get['idx'], 1);
            }
        } else {
            $this->articles_m->updateRow($data['board'], 'board');
            $this->libraries_lb->filesReset(1);
            alert('게시글이 수정되었습니다.', 'articles/boardContents?idx=' . $get['idx'], 1);
        }
    }
    public function boardDelete()
    {
        $get['idx'] = $this->request->getGetPost('idx');
        $boardData = $this->articles_m->whereIdx('board', $get['idx']);

        if ($_SESSION['name'] == $boardData['writer']) {
            $get['result'] = $this->request->getGetPost('result');
            if (empty($get['result'])) {
                confirm('게시글을 삭제하시겠습니다?', 'articles/boardDelete?idx='.$get['idx'], 1);
            } elseif ($get['result'] == 'true') {
                $this->articles_m->deleteRow($get, 'board');
                $this->articles_m->deleteRow($get, 'board_comments', 'board_');
                $this->libraries_lb->removeDir('board', $_SESSION);
                alert('게시글이 삭제되었습니다.', 'articles/boardIndex');
            } else {
                return redirect()->to('boardContents?idx='. $get['idx']);
            }
        } else {
            alert('권한이 없습니다.');
            $this->boardIndex();
        }
    }
}
