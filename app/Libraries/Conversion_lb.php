<?php namespace App\Libraries;

use App\Controllers\BaseController;

class Conversion_lb extends BaseController
{
    protected $team_idx;
    protected $team_href = 'http://info.nowgoal.com/';
    protected $team_img_url = 'http://info.nowgoal.com/Image/team/';
    protected $league_href;
    protected $league_img_url = 'http://info.nowgoal.com/Image/';

    public function __construct()
    {
        helper(['SimpleHtmlDom']);
    }
    public function formatDate($date, $type = null)
    {
        if ($type == 4 || $type == 5 || $type == 2) {
            $date = explode('-', $date);
            $year = $date[0];
            $month = $date[1];
            $day = $date[2];
        } else {
            $date = explode("'", $date)[1];
            $date = explode(',', $date);
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
            $hour = $hour + 9 ;
            $timestamp  = mktime($hour, $minute, $second, $month, $day, $year);
            $result = date('Y-m-d H:i:s', $timestamp);
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
    private function curl($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $get_curl = curl_exec($ch);
        curl_close($ch);

        return $get_curl;
    }
    private function curl_array($get_curl, $filter = false, $type = 0)
    {
        $info = explode('var ', $get_curl);
        $key_set = $this->_array_key_set();
       
        foreach ($info as $key => $value) {
            $arr = explode('=', $value);
            $name = trim($arr[0]);
            if (!$filter || in_array($name, $filter)) {
                if ($name != 'playerCount') {
                    //2차원 배열
                    if (strpos($arr[1], '[[') !== false) {
                        $arr = trim($arr[1]);
                        $arr = substr($arr, 2);
                        $arr = substr($arr, 0, -2);
                        $arr = explode('],', $arr);
                        
                        foreach ($arr as $index => $item) {
                            if (substr($item, 0, 1) == '[') {
                                $item = substr($item, 1);
                            }
                            if (substr($item, strlen($item)-1, 1) == ']') {
                                $item = substr($item, 0, -1);
                            }
                            if ($type == 0) {
                                if ($name == 'playerHonor') {
                                    $item = explode("',", $item);
                                } else {
                                    $item = explode(",", $item);
                                }
                            }
                            //side_lineup
                            elseif ($type == 1) {
                                $itemDefault = explode(",", $item);
                                $itemUnique = explode("',", $item);
                                if (count($itemDefault) == count($itemUnique) || $name == 'lineupDetail') {
                                    $item = explode(",", $item);
                                } else {
                                    $item = explode("',", $item);
                                }
                            }
                            foreach ($item as $key_index => $res) {
                                if (!empty($key_set[$name])) {
                                    //echo var_dump($key_set[$name]);
                                   
                                    $key_name =  $key_set[$name][$key_index];
                                    if ($key_name != '') {
                                        if ($name == 'playerHonor') {
                                            if (strpos($res, ',') == true) {
                                                $res_arr = explode(",", $res);
                                               
                                                foreach ($res_arr as $res_arr_key) {
                                                    $result[$name][$index][$key_name][] = trim($res_arr_key, "'");
                                                }
                                            } else {
                                                $res = trim($res, "'");
                                                $result[$name][$index][$key_name] = trim($res);
                                            }
                                        } else {
                                            $res = trim($res, "'");
                                            $result[$name][$index][$key_name] = trim($res) ;
                                        }
                                    }
                                } else {
                                    $res = trim($res, "'");
                                    $result[$name][$index][] = trim($res) ;
                                }
                            }
                        }
                        //1차원 배열
                    } else {
                        $arr = trim($arr[1]);
                        $arr = substr($arr, 1);
                        $arr = substr($arr, 0, -2);
                        $arr = explode('],[', $arr);
                        $arr = explode(',', trim($arr[0])) ;
                        foreach ($arr as $key_index => $item) {
                            if (!empty($key_set[$name])) {
                                $key_name =  $key_set[$name][$key_index];
                                if ($key_name != '') {
                                    $item = trim($item);
                                    $result[$name][$key_name] = trim($item, "'");
                                }
                            } else {
                                $item = trim($item);
                                $result[$name][] = trim($item, "'");
                            }
                        }
                    }
                }
            }
        }
        return !empty($result) ? $result : false;
    }
    private function _array_key_set()
    {
        $key_set['transferInfo'] = ['transfer_season','from_team_idx','to_team_idx','transfer_time','contract_expires','','','','','transfer_fee','type','from_team_name','to_team_name'];
        $key_set['nowTeamInfo'] = ['','uniform_number','','','','position','team'];
        $key_set['twoYear'] = ['game_idx','','','league_name','game_start_time','home_team_idx','away_team_idx','home_goal','away_goal','league_bgcolor','','','home_team_name','','','away_team_name','red','yellow','goals','pen','og','','','',''];
        $key_set['playerTotal']=['goals','pen','og','yellow','red'];
        $key_set['playerHonor']=['league','season'];

        $key_set['lineupDetail']=['idx','uniform_number','name','','','birth','height','weight','position','country','','value','','','','','','','','',''];

        $key_set['rearguard']=['','uniform_number','','','name',''];
        $key_set['vanguard']=['','uniform_number','','','name',''];
        $key_set['goalkeeper']=['','uniform_number','','','name',''];
        $key_set['midfielder']=['','uniform_number','','','name',''];

        $key_set['lastUpdateTime'] = ['date'];

        return $key_set;
    }
    public function league_all()
    {
        $url = 'http://info.nowgoal.com/jsData/infoHeaderEn.js';
        $get_curl = $this->curl($url);
        $get_curl = explode('arr', $get_curl);
        $get_curl = array_splice($get_curl, 2, count($get_curl));
        foreach ($get_curl as $key => $value) {
            $res = explode('",["', $value);
            $res[1] = substr($res[1], 0, -5);
            $res_fir = explode(',', $res[0]);
            $res_sec = explode('","', $res[1]);
            $result[$key]['info_id'] = trim(explode('_', $res_fir[0])[1], '"');
            $result[$key]['country_name'] = trim($res_fir[1], '"');
            $result[$key]['img_name'] = trim($res_fir[2], '"');
            $result[$key]['continent_idx'] = trim($res_fir[3], '"');
            
            foreach ($res_sec as $index => $value) {
                $res_sec_arr = explode(',', $value);
                $result[$key]['game_contents'][$index]['game_idx'] = $res_sec_arr[0] ;
                $result[$key]['game_contents'][$index]['game_name'] = $res_sec_arr[1];
                if ($res_sec_arr[2] == 1 && $res_sec_arr[3] == 0) {
                    $result[$key]['game_contents'][$index]['game_type'] = 'League';
                } elseif ($res_sec_arr[2] == 1 && $res_sec_arr[3] == 1) {
                    $result[$key]['game_contents'][$index]['game_type'] = 'SubLeague';
                } elseif ($res_sec_arr[2] == 2) {
                    $result[$key]['game_contents'][$index]['game_type'] = 'CupMatch';
                } else {
                    $result[$key]['game_contents'][$index]['game_type'] = null;
                }
                $res_sec_season = array_splice($res_sec_arr, 4, count($res_sec_arr));
                $result[$key]['game_contents'][$index]['game_season '] = $res_sec_season;
            }
        }

        $data['config'] = [
            'img_url' => 'http://info.nowgoal.com/Image/info/',
            'game_href' => 'http://info.nowgoal.com/en/',
        ];
        $data['contents'] = !empty($result) ? $result : null;
        return $data;
    }

    private function _season_list($league_idx)
    {
        $url = 'http://info.nowgoal.com/jsData/LeagueSeason/sea'.$league_idx.'.js';

        $get_curl = $this->curl($url);
        
        $get_curl = explode('arrSeason = [', $get_curl);
        $get_curl = str_replace("'", "", $get_curl[1]);
        $get_curl = substr($get_curl, 0, -3);
        $get_curl = explode(',', $get_curl);

        return $get_curl;
    }
    //$league_idx, $season, $round: 라운드수; $game_time: full,half; $game_stadium: total,home,away; $round_type: full,last
    public function league_round($league_idx = '36', $season = null, $round = 1, $game_time = 'full', $game_stadium = 'total', $round_type = 'last')
    {
        /* $round = 3;
        $game_time = 'full';
        $game_stadium = 'home';
        $round_type = 'last'; */
        try {
            $res_key = ['','','','','home_team_idx','away_team_idx','full_score','half_score'];
            $game_time = $this->_filter($game_time, ['full','half']);
            $game_stadium = $this->_filter($game_stadium, ['total','home','away']);

            $season = $season == null ? $this->_season_list($league_idx)[0] : $season;
            
            $league_idx = $this->_subleague_confirm($league_idx);

            $url = 'http://info.nowgoal.com/jsData/matchResult/'.$season.'/s' . $league_idx . '_en.js?version='.date('YmdH', time());
            
            $get_curl = $this->curl($url);
            
            $league_teamlist = explode('totalScore = [[', $get_curl);
            $league_teamlist = explode('arrTeam', $league_teamlist[0]);
            $get_curl = str_replace('var arrSubLeague', '', $get_curl);
            $get_curl = explode('var', $get_curl);
            $get_curl = str_replace("'", "", $get_curl[2]);
            $get_curl = explode('R_', $get_curl);
            array_shift($get_curl);

            foreach ($get_curl as $r_index => $value) {
                $res_arr = explode('],[', $value);
                
                if ($r_index < $round) {
                    foreach ($res_arr as $index => $item) {
                        $res_item = explode(',', $item);
                        array_splice($res_item, 8, count($res_item));
                        $res[$r_index][$index] = array_combine($res_key, $res_item);
                        unset($res[$r_index][$index][""]);
                        if (!empty($data[$r_index])) {
                            $data[$r_index] = array_merge($data[$r_index], $this->_league_round_value($res[$r_index][$index], $league_teamlist[1], $game_time, $game_stadium));
                        } else {
                            $data[$r_index] = $this->_league_round_value($res[$r_index][$index], $league_teamlist[1], $game_time, $game_stadium);
                        }
                    }
                }
            }
            if ($round > count($get_curl)) {
                return '최대 라운드는 ' . count($get_curl) . ' 라운드 입니다.';
            }

            if ($round_type == 'last') {
                $result['round_ranking'] = $this->_league_round_cal($data, $game_time, $game_stadium)[$round-1];
            } elseif ($round_type == 'full') {
                $result['round_ranking'] = $this->_league_round_cal($data, $game_time, $game_stadium);
            }

            return $result;
        } catch (\Exception $e) {
            return null;
        }
    }
    //라운드별 스텟더하기
    private function _league_round_cal($data, $game_time)
    {
        $contents_arr = ['get','miss','score','games','win','draw','lose','goal_diff'];
        foreach ($data as  $value) {
            foreach ($value as  $team) {
                $res['config'] = $team['config'];
                foreach ($team['contents'] as $time => $time) {
                    $team_idx = $team['contents'][$time]['team_idx'];
                    foreach ($contents_arr as $contents) {
                        if (!empty($res['contents'][$time][$team_idx][$contents])) {
                            $$contents = $res['contents'][$time][$team_idx][$contents];
                        } else {
                            $$contents = 0;
                        }
                        $res['contents'][$time][$team_idx][$contents]= (int)$team['contents'][$time][$contents] + (int)$$contents;
                    }
                    array_splice($team['contents'][$time], 2);
                    $res['contents'][$time][$team_idx] = array_merge($team['contents'][$time], $res['contents'][$time][$team_idx]);
                    $res['contents'][$time][$team_idx] = array_merge($res['contents'][$time][$team_idx], $this->_league_round_avg($res['contents'][$time][$team_idx]));
                }
            }
            $result[] = $this->_league_round_ranking($res);
        }
        return $result;
    }
    //라운드별 순위매기기
    private function _league_round_ranking($data)
    {
        $compare_name = ['score','goal_diff','get','team_idx'];
        $compare_name = array_reverse($compare_name);

        foreach ($data['contents'] as $data_key => $data_val) {
            foreach ($compare_name as $com_idx => $com_name) {
                foreach ($data_val as $key => $value) {
                    $sort[$com_name][$key] = $value[$com_name];
                }
                $com_name == 'team_idx' ? asort($sort[$com_name]) : arsort($sort[$com_name]);
                $sort_overlap = array_count_values($sort[$com_name]);
                if ($com_idx < (count($compare_name)-1)) {
                    foreach ($sort[$com_name] as $sort_idx => $sort_val) {
                        if (count($sort_overlap) != count($sort[$com_name])) {
                            foreach ($sort_overlap as $over_idx => $over_val) {
                                foreach ($sort_res[$com_idx-1] as $res_idx => $res_val) {
                                    if ($res_val == $over_idx) {
                                        $sort_res[$com_idx][$res_idx] = $data_val[$res_idx][$compare_name[$com_idx+1]];
                                    }
                                }
                            }
                        } else {
                            $sort_res[$com_idx][$sort_idx] = $data_val[$sort_idx][$compare_name[$com_idx+1]];
                        }
                    }
                } else {
                    foreach ($sort_overlap as $over_idx => $over_val) {
                        foreach ($sort_res[$com_idx-1] as $res_idx => $res_val) {
                            if ($res_val == $over_idx) {
                                $result[] = $data_val[$res_idx];
                            }
                        }
                    }
                }
            }
            $data['contents'][$data_key] = $result;
            $sort_res = [];
            $result = [];
        }
        return $data;
    }
    //세부스텟 계산
    private function _league_round_avg($data)
    {
        $res['win_per'] = $data['win'] == 0 ? 0  : round(($data['win'] / $data['games']) * 100, 1)  ;
        $res['draw_per'] = $data['draw'] == 0 ? 0 : round(($data['draw'] / $data['games']) * 100, 1)  ;
        $res['lose_per'] = $data['lose'] == 0 ? 0  : round(($data['lose'] / $data['games']) * 100, 1)  ;
        $res['avg_get'] =  $data['get'] == 0 ? 0  : round(($data['get'] / $data['games']), 2) ;
        $res['avg_miss'] =  $data['miss'] == 0 ? 0  : round(($data['miss'] / $data['games']), 2);
        
        return $res;
    }
    //팀별 득점,실점,골득실,승무패,승점 셋팅
    private function _league_round_value($round_info, $league_teamlist, $game_time, $game_stadium)
    {
        $team_list = $this->_league_ranking_teamlist($league_teamlist);
        $stadium_arr = ['home','away'];
        
        foreach ($stadium_arr as $stadium_val) {
            foreach ($game_time as $time_name) {
                foreach ($game_stadium as $stadium_name) {
                    $config['team_href'] = 'http://info.nowgoal.com/en/team/Summary/';
                    $time = $time_name .'_'. $stadium_name ;
                    $team_idx = $round_info[$stadium_val.'_team_idx'];
                    $contents[$time]['team_idx'] = $team_list[$team_idx]['team_idx'];
                    $contents[$time]['team_name'] = $team_list[$team_idx]['team_name'];

                    if (strpos($round_info['full_score'], '-')) {
                        $score = explode('-', $round_info[$time_name.'_score']);
                        if (($stadium_name == 'home' && $stadium_val == 'away') || ($stadium_name == 'away' && $stadium_val == 'home')) {
                            $score[0] = 0;
                            $score[1] = 0;
                        }
                        
                        $contents[$time]['games'] = 1;
                        if ($stadium_val == 'home') {
                            $contents[$time]['get'] = $score[0];
                            $contents[$time]['miss'] = $score[1];
                            $contents[$time]['goal_diff'] = $score[0] - $score[1];
                        } elseif ($stadium_val == 'away') {
                            $contents[$time]['get'] = $score[1];
                            $contents[$time]['miss'] = $score[0];
                            $contents[$time]['goal_diff'] = $score[1] - $score[0];
                        }
                        $contents[$time]['win'] = 0;
                        $contents[$time]['draw'] = 0;
                        $contents[$time]['lose'] = 0;

                        if ($contents[$time]['get'] > $contents[$time]['miss']) {
                            $contents[$time]['score'] = 3;
                            $contents[$time]['win'] = 1;
                        } elseif ($contents[$time]['get'] == $contents[$time]['miss']) {
                            $contents[$time]['score'] = 1;
                            $contents[$time]['draw'] = 1;
                        } elseif ($contents[$time]['get'] < $contents[$time]['miss']) {
                            $contents[$time]['score'] = 0;
                            $contents[$time]['lose'] = 1;
                        }

                        if (($stadium_name == 'home' && $stadium_val == 'away') || ($stadium_name == 'away' && $stadium_val == 'home')) {
                            $contents[$time]['score'] = 0;
                            $contents[$time]['draw'] = 0;
                            $contents[$time]['games'] = 0;
                        }
                    } else {
                        $contents[$time]['games'] = 0;
                        $contents[$time]['get'] = 0;
                        $contents[$time]['miss'] = 0;
                        $contents[$time]['goal_diff'] = 0;
                        $contents[$time]['win'] = 0;
                        $contents[$time]['draw'] = 0;
                        $contents[$time]['lose'] = 0;
                        $contents[$time]['score'] = 0;
                    }
                    $res[$team_idx]['config'] = $config;
                    $res[$team_idx]['contents'] = $contents;
                }
            }
        }
        return $res;
    }
    public function league_ranking($league_idx)
    {
        $league_idx = $this->_filter($league_idx);

        foreach ($league_idx as $idx_value) {
            $res_key = array('tournament','ranking','team_idx','red_card','games','win','draw','lose','get','miss','goal_difference','win_per','draw_per','lose_per','avg_get','avg_lose','score','','','recent','recent','recent','recent','recent','recent','');
            
            //subleague 있는지 확인
            $idx_value = $this->_subleague_confirm($idx_value);

            $url = 'http://info.nowgoal.com/jsData/matchResult/2019-2020/s'.$idx_value.'_en.js?version='.date('YmdH', time());

            $get_curl = $this->curl($url);
            if (!empty(strpos($get_curl, 'totalScore', 0))) {
                $get_curl = explode('totalScore = [[', $get_curl);
                $league_teamlist = explode('arrTeam', $get_curl[0]);
                $league_name = $this->_league_ranking_league($get_curl[0]);
                $league_ranking = explode('var', $get_curl[1]);
                $league_ranking = substr($league_ranking[0], 0, -4);
                $league_ranking = str_replace("''", '""', $league_ranking);
                $league_ranking = str_replace("'", '', $league_ranking);
                $league_ranking = explode('],[', $league_ranking);
        
                //subleague set
                if (!empty(strpos($league_teamlist[0], 'arrSubLeague', 0))) {
                    array_push($res_key, '');
                    $res_config = $this->_league_ranking_config($league_teamlist[0], 1);
                } else {
                    $res_config = $this->_league_ranking_config($league_teamlist[0]);
                }

                $team_list = $this->_league_ranking_teamlist($league_teamlist[1]);
                $tournament_list = $this->_league_ranking_tournament($get_curl[0]);

                foreach ($league_ranking as $key => $value) {
                    $res_value = explode(',', $value);
                    for ($i = 19; $i <25; $i++) {
                        //recent 값 변경
                        if ($res_value[$i] == 0) {
                            $res_recent[$key][] = 'W';
                        } elseif ($res_value[$i] == 1) {
                            $res_recent[$key][] = 'D';
                        } elseif ($res_value[$i] == 2) {
                            $res_recent[$key][] = 'L';
                        }
                    }
                    $res[$key] = array_combine($res_key, $res_value);
                    $res_tournament = $tournament_list[$res[$key]['tournament']];
                    $res[$key]['recent'] = $res_recent[$key];
                    $res[$key] = array_merge($res_tournament, $res[$key]);
                    $res[$key] = array_merge($team_list[$res_value[2]], $res[$key]);
                    unset($res[$key][""]);
                }
                //$leage_name = str_replace(' ', '_', $res_config['league_short_name']);
                $data['league_ranking'][$idx_value] =[
                'config' => $res_config,
                'contents' => $res
            ];
                return $data;
            } else {
                return false;
            }
        }
    }
    public function _subleague_confirm($league_idx)
    {
        if (empty(strpos($league_idx, '_', 0))) {
            $url = 'http://info.nowgoal.com/en/League/'.$league_idx.'.html';
            $get_html = file_get_html($url);
            if (strpos($get_html, 'SubSclassID', 0)) {
                $sub_idx = explode('SubSclassID = ', $get_html);
                $sub_idx = explode(';', $sub_idx[1]);
                if ($sub_idx[0] == 0) {
                    return $league_idx;
                } else {
                    return $league_idx .'_'. $sub_idx[0] ;
                }
            }
        } else {
            return $league_idx;
        }
    }
   
    //$type = 0: league, 1: subLeague
    private function _league_ranking_config($get_curl, $type = 0)
    {
        $arr_league = explode('[', $get_curl);
        $arr_league = str_replace("'", '', $arr_league[1]);
        $arr_league = explode(',', $arr_league);

        if ($type == 0) {
            $res_key = ['league_idx','','','league_full_name','league_season','league_bgcolor','league_img','total_round','current_round','','','league_short_name'];
            $arr_league = array_splice($arr_league, 0, 12);
        } elseif ($type == 1) {
            $res_key = ['league_idx','','','league_full_name','league_season','league_bgcolor','league_img','','','league_short_name'];
            $arr_aub = explode('var arrSubLeague', $get_curl)[0];
            $arr_league = array_splice($arr_league, 0, 10);
        }
        
        $arr_league = array_combine($res_key, $arr_league);
        unset($arr_league[""]);
        $arr_league['league_img_url'] = $this->league_img_url;
        $arr_league['team_img_url'] = $this->team_img_url;
        $arr_league['team_href'] = $this->team_href;

        return $arr_league;
    }
    private function _league_ranking_league($get_curl)
    {
        $get_curl = explode('= [', $get_curl);
        $get_curl = explode(',', $get_curl[1]);
        $league_name = !empty($get_curl[11]) ? trim($get_curl[11], "'") : trim($get_curl[9], "'");
        $league_name = str_replace(" ", '_', $league_name);

        return $league_name;
    }
    private function _league_ranking_teamlist($get_curl)
    {
        $res_key = ['team_idx','','','team_name','','team_img',''];

        $get_curl = explode('=', $get_curl);
        $get_curl = substr($get_curl[1], 0, -14);
        $get_curl = substr($get_curl, 3);
        $get_curl = explode('],[', $get_curl);
        $get_curl = str_replace("'", '', $get_curl);
        foreach ($get_curl as $key => $value) {
            $get_curl = explode(',', $value);
            $res_combine[$key] = array_combine($res_key, $get_curl);
            unset($res_combine[$key][""]);
            $res[$res_combine[$key]['team_idx']] = $res_combine[$key];
        }
        return $res;
    }
    private function _league_ranking_tournament($get_curl)
    {
        $res_key = ['entry_bgcolor','','','entry_name'];
        
        if (!empty(strpos($get_curl, 'scoreColor', 0))) {
            $entry_color = explode('scoreColor = [', $get_curl);
            $entry_color = explode('];', $entry_color[1]);
            $entry_color = str_replace("'", '', $entry_color[0]);
            $entry_color = explode(',', $entry_color);
            
            foreach ($entry_color as $key => $value) {
                $res[$key] = array_combine($res_key, explode('|', $value));
                unset($res[$key][""]);
            }
            $res[-1]['entry_bgcolor'] = '#ffffff';
            $res[-1]['entry_name'] = 'Residue';
            return $res;
        } else {
            return null;
        }
    }
    
    public function player($player_idx, $filter = null)
    {
        $url = 'http://info.nowgoal.com/jsData/playerInfo/player'.$player_idx.'_en.js?version='. date('YmdH', time());
        $get_curl = $this->curl($url);

        $headers = get_headers($url);

        if (substr($headers[0], 9, 3) == '302') {
            $url = 'http://info.nowgoal.com/en/team/player/'.$player_idx.'.html';
            $this->curl($url);
            $url = 'http://info.nowgoal.com/jsData/playerInfo/player'.$player_idx.'_en.js?version='. date('YmdH', time());
            $get_curl = $this->curl($url);
        }

        $curl_filter = 'transferInfo,nowTeamInfo,twoYear,playerHonor,playerTotal,lastUpdateTime';
        $curl_filter = $this->_filter($curl_filter);
        $get_curl = $this->curl_array($get_curl, $curl_filter);

        if (!$get_curl) {
            return;
        }
        $filter = $this->_filter($filter);

        if ($filter == null || in_array(0, $filter)) {
            $result['player_info'] = $this->_player_info($player_idx);
        }
        if ($filter == null || in_array(1, $filter)) {
            $result['currently_play']['contents'] =  !empty($get_curl['nowTeamInfo'][0]) ? $get_curl['nowTeamInfo'] : null;
        }
        if ($filter == null || in_array(2, $filter)) {
            $result['transfer_info']['config']['team_href'] = 'http://info.nowgoal.com/en/team/Summary/';
            $result['transfer_info']['contents'] = $get_curl['transferInfo'];

            if (!empty($get_curl['transferInfo'][0])) {
                foreach ($result['transfer_info']['contents'] as $key => $value) {
                    //임시로 team_idx 뒤에 .html
                    $result['transfer_info']['contents'][$key]['from_team_idx'] = $value['from_team_idx']  . '.html';
                    $result['transfer_info']['contents'][$key]['to_team_idx'] = $value['to_team_idx']  . '.html';
                }
            } else {
                $result['transfer_info']['contents'] = null;
            }
        }
        if ($filter == null || in_array(3, $filter)) {
            $result['recent_statistics']['config']['team_href'] = 'http://info.nowgoal.com/en/team/Summary/';
            $result['recent_statistics']['contents'] = $get_curl['twoYear'];
            $result['recent_statistics']['total'] = $get_curl['playerTotal'];

            if (!empty($get_curl['twoYear'][0])) {
                foreach ($result['recent_statistics']['contents'] as $key => $value) {
                    $result['recent_statistics']['contents'][$key]['home_team_idx'] = $value['home_team_idx']  . '.html';
                    $result['recent_statistics']['contents'][$key]['away_team_idx'] = $value['away_team_idx']  . '.html';
                }
            } else {
                $result['recent_statistics']['contents'] = null;
            }
        }
        if ($filter == null || in_array(4, $filter)) {
            $result['player_honor']['contents'] = !empty($get_curl['playerHonor'][0]) ? $get_curl['playerHonor'] : null;
        }
        if ($filter == null || in_array(5, $filter)) {
            $result['side_lineup'] = $this->_player_side_lineup($this->team_idx);
        }
        if ($filter == null || in_array(6, $filter)) {
            $result['last_update'] = $get_curl['lastUpdateTime'];
        }
        if (!empty($filter) && empty($result)) {
            return false;
        }
        return $result;
    }
    
    
    
    public function _player_info($player_idx)
    {
        $url = 'http://info.nowgoal.com/en/team/player/'.$player_idx.'.html';
        $getHtml = file_get_html($url);
        $getHtml->find('td > img', 0)->src;
        //get team_idx
        foreach ($getHtml->find('script') as $key) {
            if (strpos($key->innertext, 'selectTeamID')) {
                $res = explode('selectTeamID =', $key->innertext);
                $res = explode(';', $res[1]);
                $this->team_idx = trim($res[0]);
            }
        }
        $get_tr = $getHtml->find('.tdlink > tr');
        $player_info['config'] = [
            'img_url' => 'http://info.nowgoal.com'
        ];
        $player_info['contents'] = [
            'name' => $get_tr[0]->find('strong ', 0)->innertext,
            'country' => $get_tr[1]->find('strong ', 0)->innertext,
            'weight' => $get_tr[2]->find('strong ', 0)->innertext,
            'height' => $get_tr[3]->find('strong ', 0)->innertext,
            'birthday' => $get_tr[4]->find('strong ', 0)->children(0)->children(0)->innertext,
            'preferred_foot' => $get_tr[5]->find('strong ', 0)->children(0)->children(0)->innertext,
            'value' => $get_tr[6]->find('strong ', 0)->children(0)->children(0)->innertext,
            'img_name' => $getHtml->find('td > img', 0)->src
        ];
        return $player_info;
    }
    public function _player_side_lineup($team_idx)
    {
        $url = 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl'.$team_idx.'_en.js?version='. date('YmdH', time());

        $filter = 'rearguard,vanguard,goalkeeper,midfielder,lineupDetail';
        $filter = $this->_filter($filter);
        $get_curl = $this->curl($url);
        $get_curl = $this->curl_array($get_curl, $filter, $type = 1);
            
        $side_lineup['config'] = [
            'player_href' => 'http://info.nowgoal.com/en/team/player/'
        ];
        foreach ($get_curl['lineupDetail'] as $key) {
            foreach ($get_curl['vanguard'] as $value) {
                if ($key['name'] ==  $value['name']) {
                    $key['idx'] = $key['idx'] .'.html';
                    $side_lineup['contents']['striker'][] = $key;
                    break;
                }
            }
            foreach ($get_curl['rearguard'] as $value) {
                if ($key['name'] ==  $value['name']) {
                    //player_idx 뒤에 .html 임시로 붙이기
                    $key['idx'] = $key['idx'] .'.html';
                    $side_lineup['contents']['defender'][] = $key;
                    break;
                }
            }
            
            foreach ($get_curl['goalkeeper'] as $value) {
                if ($key['name'] ==  $value['name']) {
                    $key['idx'] = $key['idx'] .'.html';
                    $side_lineup['contents']['goalkeeper'][] = $key;
                    break;
                }
            }
            foreach ($get_curl['midfielder'] as $value) {
                if ($key['name'] ==  $value['name']) {
                    $key['idx'] = $key['idx'] .'.html';
                    $side_lineup['contents']['midfielder'][] = $key;
                    break;
                }
            }
        }
        return  $side_lineup;
    }
   
    public function detail($game_idx, $filter = null)
    {
        $url = 'http://www.nowgoal.com/detail/'. $game_idx .'.html';
        $getHtml = file_get_html($url);
        
        $filter = $this->_filter($filter);
        
        if (!empty($getHtml)) {
            if ($filter == null || in_array(0, $filter)) {
                $data['game_versus'] = $this->detail_game_versus($getHtml, $game_idx)['game_versus'];
            }
            if ($filter == null || in_array(1, $filter)) {
                $data['game_event'] = $this->detail_game_event($getHtml)['game_event'];
            }
            if ($filter == null || in_array(2, $filter)) {
                $data['game_lineup'] = $this->detail_game_lineup($getHtml)['game_lineup'];
            }
            if ($filter == null || in_array(3, $filter)) {
                $data['game_tech'] = $this->detail_game_tech($getHtml)['game_tech'];
            }
            if (!empty($filter) && empty($data)) {
                return false;
            }
        } else {
            return false;
        }
        return $data;
    }
    private function _filter($filter = null, $arr_confirm = null)
    {
        if ($filter != null) {
            $filter = explode(',', $filter);
        }
        //var_dump($arr_confirm);
        if ($arr_confirm != null) {
            foreach ($filter as $value) {
                if (!in_array($value, $arr_confirm)) {
                    $filter = null;
                }
            }
        }
        return $filter;
    }
    public function detail_game_versus($getHtml, $game_idx)
    {
        if (!empty($getHtml->find('.fbheader')[0])) {
            $data = $getHtml->find('.fbheader')[0];
            $data_goal = $getHtml->find('#teamEventDiv_detail tr', 1);
            $data_row = $data->find('.vs > .row');
            $data_date = $data_row[0]->find('script', 0)->innertext;
            $data_sclass_name = $data->find('.sclassName');

            $data_stadium_info = $data_row[2]->innertext;
            $data_stadium_info = explode('&nbsp;', $data_stadium_info);
            foreach ($data_stadium_info as $key) {
                if ($key != "") {
                    $key = trim($key);
                    $stadium_info[] =  $key ;
                }
            }
            $result['game_versus']['config'] = [
                'league_href' => 'http://info.nowgoal.com/leagueinfo/',
                'team_href' => 'http://info.nowgoal.com/football/en/team/',
                'logo_url' => 'http://info.nowgoal.com/Image/team/images/'
            ];
        
            $result['game_versus']['contents'] = [
                'game_idx' => $game_idx,
                'game_start_time' => $this->formatDate($data_date, 3),
                'division_day' => substr($this->formatDate($data_date, 3), 0, -9),
                'home_stadium' => !empty($stadium_info[0]) ? $stadium_info[0] : null,
                'home_goal' => $data_goal->find('span', 0)->innertext,
                'away_goal' => $data_goal->find('span', 1)->innertext,
                'league_url' => explode('/', $data_row[0]->find('.LName > a')[0]->href)[4],
                'league_name' => $data_row[0]->find('.LName > a')[0]->innertext,
                'home_team_idx' => explode('/', $data_sclass_name[0]->find('a', 0)->href)[6],
                'home_name' => $data_sclass_name[0]->find('a', 0)->innertext,
                'home_logo_name' => !empty(explode('/', $data->find('#homeImg > img', 0)->src)[6]) ? explode('/', $data->find('#homeImg > img', 0)->src)[6] : null,
                'away_team_idx' => explode('/', $data_sclass_name[1]->find('a', 0)->href)[6],
                'away_name' => $data_sclass_name[1]->find('a', 0)->innertext,
                'away_logo_name' => !empty(explode('/', $data->find('#guestImg > img', 0)->src)[6]) ? explode('/', $data->find('#guestImg > img', 0)->src)[6] : null,
                'weather' => !empty($stadium_info[1]) ? $stadium_info[1] : null,
                'temperature' => !empty($stadium_info[2]) ? $stadium_info[2] : null,
            ];
            return $result;
        } else {
            return false ;
        }
    }
    public function detail_game_event($getHtml)
    {
        $data = $getHtml->find('#teamEventDiv_detail', 0);

        if (!empty($data) && $data->style != 'display:none;') {
            $data_tr = $data->find('tr');
            $result = [];
            foreach ($data_tr as $key => $value) {
                if ($key > 1) {
                    $item_result = [];
                    foreach ($value->find('td') as $index => $item) {
                        if ($item->innertext != "" && ($index == 0 || $index == 4)) {
                            if (!empty($item->childNodes(0))) {
                                if (!empty($item->childNodes(0)->find('img', 0))) {
                                    $item_result[] = [
                                        'icon_in' => (string)$item->childNodes(0)->src,
                                        'player_name_in' => (string)$item->childNodes(1)->innertext,
                                        'player_href_in' => substr(explode('/', $item->childNodes(1)->href)[6], 0, -5),
                                        'icon_out' => (string)$item->childNodes(2)->src,
                                        'player_name_out' => (string)$item->childNodes(3)->innertext,
                                        'player_href_out' => substr(explode('/', $item->childNodes(3)->href)[6], 0, -5),
                                    ];
                                } else {
                                    $href = explode('/', $item->childNodes(0)->href)[6];
                                    $href = substr($href, 0, -5);
                                    $item_result[] = [
                                        'player_idx' => $href,
                                        'player_name' => (string)$item->childNodes(0)->innertext,
                                    ];
                                }
                            } else {
                                $item_result[] = [
                                    'player_idx' => null,
                                    'player_name' => (string)$item->innertext,
                                ];
                            }
                        } elseif ($item->innertext != "" && ($index == 1 || $index == 3)) {
                            $item_result[] = (string)$item->childNodes(0)->src;
                        } else {
                            $item_result[] = (string)$item->innertext;
                        }
                    }
                    $result['game_event']['config'] = [
                        'player_href' => 'http://info.nowgoal.com/en/team/player/',
                        'icon_url' => 'http://www.nowgoal.com'
                    ];
                    $result['game_event']['contents'][] = [
                    'home_player' => $item_result[0],
                    'home_icon' => $item_result[1],
                    'game_min' => $item_result[2],
                    'away_icon' => $item_result[3],
                    'away_player' => $item_result[4],
                ];
                } elseif ($key == 1) {
                    $result['game_score'] = [
                    'home_goal' => $value->find('span', 0)->innertext,
                    'away_goal' => $value->find('span', 1)->innertext,
                ];
                }
            }
            return $result;
        } else {
            $result['game_event']['contents'] = null;
            return $result;
        }
    }
   
    public function detail_game_lineup($getHtml)
    {
        $data = $getHtml->find('#matchData > .content > .content', 3);

        if (!empty($data) && $data->style != 'display:none;') {
            $data_info = $data->find('.teamNames', 0)->children(0);
            $home_info = $this->_lineup_team_info($data->find('.teamNames', 0)->children(0));
            $away_info = $this->_lineup_team_info($data->find('.teamNames', 0)->children(1));

            $result['game_lineup']['config'] = [
                'home_name' => $home_info['name'],
                'home_idx' => explode('teamid=', $home_info['href'])[1],
                'home_formation' => trim($home_info['formation']),
                'away_name' => $away_info['name'],
                'away_idx' => explode('teamid=', $away_info['href'])[1],
                'away_formation' => trim($away_info['formation']),
                'team_href' => 'http://info.nowgoal.com/en/team/Summary.aspx?teamid=',
                'player_href' => 'http://info.nowgoal.com/en/team/player/',
                'player_img_url' => 'http://info.nowgoal.com/Image/player/images/',
                'icon_url' => 'http://www.nowgoal.com',
                'back_img_url' => 'http://www.nowgoal.com/images/bf_img/tj_28.jpg',
                'lineup_data' => true
            ];

            $data_icon =  $data->find('#icons', 0)->children();
            foreach ($data_icon as $key => $value) {
                $result['game_lineup']['config']['notes_icon'][$key]['img_name'] = $value->children(0)->src;
                $value->children(0)->remove();
                $result['game_lineup']['config']['notes_icon'][$key]['img_url'] = $value->innertext;
            }

            $data_board =  $data->find('#matchBox', 0);

            $data_lineup_home = $data_board->find('.plays > .home', 0);
            $data_lineup_away = $data_board->find('.plays > .guest', 0);
            $data_backup_home = $data_board->find('.backupPlay > .home', 0);
            $data_backup_away = $data_board->find('.backupPlay > .guest', 0);

            
            $result['game_lineup']['contents']['home'] = $this->_lineup_player_info($data_lineup_home);
            $result['game_lineup']['contents']['away'] = $this->_lineup_player_info($data_lineup_away);
            $result['game_lineup']['subs']['home'] = $this->_lineup_player_info($data_backup_home, 1);
            $result['game_lineup']['subs']['away'] = $this->_lineup_player_info($data_backup_away, 1);
        
            return $result;
        } else {
            $result['game_lineup']['contents'] =  null;
            return $result;
        }
    }
    private function _lineup_team_info($getHtml)
    {
        $result['name'] = $getHtml->children(0)->innertext;
        $result['href'] = $getHtml->children(0)->href;
        $getHtml->children(0)->remove();
        $result['formation'] =  $getHtml->innertext;
        return $result;
    }
    private function _lineup_player_info($getHtml, $type = null)
    {
        foreach ($getHtml->children() as $key => $value) {
            foreach ($value->children() as $item) {
                if ($type == null) {
                    $item_event = $item->children(0)->children(0);
                    $item_a = $item->children(0)->children(1);
                    $item_ul = $item->children(0)->children(2);
                } else {
                    $item_event = $item->children(0);
                    $item_a = $item->children(1);
                    $item_ul = $item->children(2);
                }

                if (!empty($item_event->innertext)) {
                    $event = [];
                    foreach ($item_event->children() as $contents) {
                        //echo $contents->src;
                        $event[] = [
                            'img_url' => $contents->src,
                            'minutes' => $contents->title,
                        ];
                    }
                }

                if ($type == null) {
                    $result[$key][] = [
                        'player_idx' => explode('_', $item_event->id)[1],
                        'name' => $item_a->children(0)->innertext,
                        'birthday' => $item_ul->children(2)->innertext,
                        'height' => $item_ul->children(3)->innertext,
                        'value' => $item_ul->children(4)->innertext,
                        'country' => $item_ul->children(5)->innertext,
                        'img_name' => !empty(explode('/', $item_ul->children(0)->children(0)->src)[6]) ? explode('/', $item_ul->children(0)->children(0)->src)[6] : null,
                        'event' => !empty($event) ? $event : null
                    ];
                } else {
                    $result[] = [
                        'player_idx' => explode('_', $item_event->id)[1],
                        'name' => $item_a->children(0)->innertext,
                        'birthday' => $item_ul->children(2)->innertext,
                        'height' => $item_ul->children(3)->innertext,
                        'value' => $item_ul->children(4)->innertext,
                        'country' => $item_ul->children(5)->innertext,
                        'img_name' => !empty(explode('/', $item_ul->children(0)->children(0)->src)[6]) ? explode('/', $item_ul->children(0)->children(0)->src)[6] : null,
                        'event' => !empty($event) ? $event : null
                    ];
                }
            }
        }
        return $result ;
    }
    public function detail_game_tech($getHtml)
    {
        $tech_table = $getHtml->find('#teamTechDiv_detail > table', 0);
        $tech_table = strip_tags($tech_table, '<tr>,<td>,<img>');
        $tech_table = str_get_html($tech_table);
        $tech_table_tr = $tech_table->find('tr');

        if (count($tech_table_tr) > 1) {
            foreach ($tech_table_tr as $key => $value) {
                if ($key != 0 && $value->find('td', 2)->innertext != 'Kick-off') {
                    $home_value = !empty($value->find('td', 1)->innertext) ? $value->find('td', 1)->innertext : "0";
                    $away_value = !empty($value->find('td', 3)->innertext) ? $value->find('td', 3)->innertext : "0";
                    $percent_value = $this->_tech_percent($home_value, $away_value);
                    $result['game_tech']['contents'][] = [
                    'home_percent' => $percent_value[0],
                    'home_value' => $home_value,
                    'value_name' => !empty($value->find('td', 2)->innertext) ? $value->find('td', 2)->innertext : "0",
                    'away_value' => $away_value ,
                    'away_percent' => $percent_value[1],
                ];
                } elseif ($key != 0 && $value->find('td', 2)->innertext == 'Kick-off') {
                    $url = 'http://www.nowgoal.com';
                    $home_value = !empty($value->find('td', 1)->children(0)->src) ?  $url .$value->find('td', 1)->children(0)->src : null;
                    $away_value = !empty($value->find('td', 3)->children(0)->src) ? $url .  $value->find('td', 3)->children(0)->src : null;
                    $result['game_tech']['contents'][] = [
                        'home_percent' => null ,
                        'home_value' => $home_value,
                        'value_name' => !empty($value->find('td', 2)->innertext) ? $value->find('td', 2)->innertext : null,
                        'away_value' => $away_value,
                        'away_percent' => null
                    ];
                }
            }
            return $result;
        } else {
            $result['game_tech']['contents'] = null;
            return $result;
        }
    }
    private function _tech_percent($home_value, $away_value)
    {
        if (!empty(strpos($home_value, '%'))) {
            $home_value = substr($home_value, 0, -1);
            $away_value = substr($away_value, 0, -1);
            return $percent_value = [$home_value,$away_value];
        } else {
            $sum = $home_value + $away_value ;
            $home_value = round($home_value / $sum * 100) ;
            $away_value = round($away_value / $sum * 100) ;
            return $percent_value = [$home_value,$away_value];
        }
    }
}
