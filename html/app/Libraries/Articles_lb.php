<?php namespace App\Libraries;

use App\Controllers\BaseController;
use App\Models\Articles_m;

class Articles_lb extends BaseController
{
    protected $articles_m;
    //protected $pager;

    public function __construct()
    {
        $this->articles_m = new Articles_m();
        //$this->pager = \Config\Services::pager();
    }
    public function formatDate($date, $type = null)
    {
        if ($type == 4 || $type == 5 || $type == 2) {
            $date = explode('-', $date); 
            $year = $date[0];
            $month = $date[1];
            $day = $date[2];
        } else {
            $date = explode(',', $date);

            var_dump($date);
            $year = $date[0];
            $month = $date[1];
            $day = $date[2];
            $hour = $date[3];
            $minute = $date[4];
            $second = $date[5];
        }

        if ($type == 1) {
            return $hour . ':' . $minute;
        } elseif ($type == 2) {
            $timestamp  = mktime(0, 0, 0, $month, $day-1, $year);
            $result = date('Y-m-d', $timestamp);
            return $result;
        } elseif ($type == 3) {
            $month = $month + 1 ;
            $hour = $hour + 8 ;
            $timestamp  = mktime($hour, $minute, $second, $month, $day, $year);
            $result = date('Y-m-d', $timestamp);
            return $result ;
        } elseif ($type == 4) {
            $day = $day - 1;
            $timestamp  = mktime(0, 0, 0, $month, $day, $year);
            $result = date('Y-m-d', $timestamp);
            return $result;
        } elseif ($type == 5) {
            $day = $day + 1;
            $timestamp  = mktime(0, 0, 0, $month, $day, $year);
            $result = date('Y-m-d', $timestamp);
            return $result;
        }
    }
    public function dataLeagueFilter()
    {
    }
    public function dataAnalysis($data)
    {
        $url = 'http://www.nowgoal.com/analysis/'.$data['game_idx'].'.html';
        $getHtml = file_get_html($url);
        foreach ($data['type'] as $key) {
            $result[$key] = $this->$key($getHtml);
        }
        $result['game_idx'] = $data['game_idx'];
        return $result;
    }
    //팀 VS 이미지
    public function dataTeamVersus($getHtml)
    {
        $homeImg = $getHtml->find("#homeImg > img");
        $result = [];
        foreach ($homeImg as $key) {
            $result[0]['sclassImg'] = (string)($key) ;
        }
        $guestImg = $getHtml->find("#guestImg > img");
        foreach ($guestImg as $key) {
            $result[1]['sclassImg'] = (string)($key);
        }
        $sclassName = $getHtml->find("#headVs td span.sclassName > a");
        foreach ($sclassName as $key => $value) {
            $result[$key]['sclassName'] = (string)($value);
        }
        return $result;
    }
    //상대전적 테이블
    public function dataOpponent($getHtml)
    {
        $table = $getHtml->find('#table_v3');
        $result = '<table>';
        $tableTr = $table[0]->find('tr');

        foreach ($tableTr as $tr => $value) {
            if ($tr != 0 && $tr != 2 && $tr != 13 && count($tableTr)-1 > $tr) {
                $result .= '<tr>';
                foreach ($value->find('td') as $td => $item) {
                    if ($td == 1 && $tr != 1) {
                        $table = (string)$item->find('script')[0]->innertext;
                        $table = explode("('", $table);
                        $table[1] = substr($table[1], 0, -1);
                        $dateValue = explode("',", $table[1]);
                        $result .= '<td>' . $this->formatDate($dateValue[0], $dateValue[1]) . '</td>';
                    } elseif ($tr != 1 && ($td == 2 || $td == 6)) {
                        $table = $item->find('a')[0]->href;
                        $table = explode("(", $table);
                        $teamIdx = substr($table[1], 0, -1);
                        $src = 'http://info.nowgoal.com/en/team/summary/' .$teamIdx. '.html';
                        $result .= '<td><a href="' . $src . '">'.$item->plaintext.'</a></td>';
                    } elseif ($td < 7) {
                        $result .= '<td>' . $item->innertext . '</td>';
                    }
                }
                $result .= '</tr>';
            }
        }
        $result .= '</table>';
        return $result;
    }
    public function boardIndex()
    {
        $data = $this->articles_m->pageData();
        return $data;
    }
    public function boardInsert($data, $tableName)
    {
        $this->articles_m->insertRow($data, $tableName);
        if (!empty($_SESSION['files_folder'])) {
            unset($_SESSION['files_folder']);
        }
    }
    public function boardContents($get)
    {
        if ($get['type'] == 'before') {
            $data = $this->articles_m->beforeView($get);
        } elseif ($get['type'] == 'after') {
            $data = $this->articles_m->afterView($get);
        } else {
            $data = $this->articles_m->contentsView($get);
            $data['board']['contents'] = $this->boardContentsImg($data['board']['contents']);
            $_SESSION['files_folder'] = $data['board']['files_folder'];
        }
        return $data;
    }
    public function boardContentsImg($data)
    {
        $data_contents = explode('<img src="uploads/board/', $data);
        array_splice($data_contents, 0, 1);
        foreach ($data_contents as $key =>$value) {
            $res = explode('"', $value);
            $img_replace = file_get_contents(WRITEPATH.'uploads/board/'.$res[0]);
            $data = str_replace('uploads/board/'.$res[0], 'data:image/jpg;base64,' .base64_encode($img_replace), $data);
        }
        return $data;
    }
    public function boardPermission($get)
    {
        $boardData = $this->articles_m->whereIdx('board', $get['idx']);
        $sessionName = !empty($_SESSION['name']) ? $_SESSION['name'] : false;
        if ($sessionName == $boardData['writer']) {
            $data['board'] = $this->articles_m->whereIdx('board', $get['idx']);

            $data['board']['contents'] = $this->boardContentsImg($data['board']['contents']);
            $data['icon'] = $this->iconFolderList();
        }
        return !empty($data) ? $data : null;
    }
    public function iconFolderList()
    {
        $filesList = get_dir_file_info(ROOTPATH . '/public/img/icon/');
        $result = [];
        foreach ($filesList as $key) {
            $result[] = $key['name'];
        }
        return $result;
    }
    public function commentsAll($get)
    {
        $articles_m = new Articles_m('board_comments');
        $data = $articles_m->selectData($get, 'board_idx');
        if (!empty($data)) {
            $data = $this->commentReply($data);
            $data = $this->replySort($data);
            return $data;
        } else {
            return null;
        }
    }
    public function replySort($data)
    {
        foreach ($data as $key) {
            $result[] = array_diff_key($key, array('reply'=>""));
            if (!empty($key['reply'])) {
                $result = array_merge($result, $this->replySort($key['reply']));
            }
        }
        return $result;
    }
    public function commentReply($data, $depth = -1, $resultDepth =[], $keyIdx = null)
    {
        ++$depth;
        $depthCheck = false;
        if ($depth == 3) {
            return false ;
        }
        foreach ($data as $key) {
            if ($key['comment_depth'] == $depth && $keyIdx == $key['parent_idx']) {
                if ($depth == 0) {
                    $resultDepth[$key['idx']] = $key ;
                    $resultReturn = $this->commentReply($data, $depth, $resultDepth, $key['idx']);

                    $result[$key['idx']] = $key ;
                    $result[$key['idx']]['reply'] = $resultReturn;
                } else {
                    $resultDepth[$key['idx']] = $key;
                    $resultReturn = $this->commentReply($data, $depth, $resultDepth, $key['idx']);

                    if ($resultReturn == false) {
                        $result[$key['idx']] = $key;
                    } elseif (!empty($resultReturn)) {
                        $result[$key['idx']] = $key;
                        $result[$key['idx']]['reply'] = $resultReturn;
                    }
                }
                $depthCheck = true;
            }
        }
        if (!$depthCheck) {
            return false;
        } else {
            return $result;
        }
    }
}
