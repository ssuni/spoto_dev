<?php namespace App\Libraries;

use App\Controllers\BaseController;

class Conversion_lb extends BaseController
{
    protected $team_idx;
    protected $team_href = 'http://info.nowgoal.com/en/team/Summary/';
    protected $team_img_url = 'http://info.nowgoal.com/Image/team/';
    protected $league_href;
    protected $league_img_url = 'http://info.nowgoal.com/Image/';
    protected $detail_href = 'http://www.nowgoal.com/detail/';
    protected $analysis_href = 'http://www.nowgoal.com/analysis/';
    protected $oddscomp_href = 'http://data.nowgoal.com/OddsComp/';
    protected $time_diff = 9;

    public function __construct()
    {
        helper(['SimpleHtmlDom']);
    }

    public function test()
    {
        for ($i = 1; $i < 31; $i++) {
            $url = 'http://data.nowgoal.com/MatchByCountry.aspx?date=2020-03-' . $i . '&orderby=time&type=2';
            $get_curl = $this->curl($url);

            echo $i;

            $get_curl = explode('A=Array', $get_curl)[1];
            $get_curl = explode(');', $get_curl)[0];

            var_dump($get_curl);
            echo '<hr/>';
        }
    }

    private function is_empty($data, $res = null)
    {
        if (!empty($data)) {
            return $data;
        } else {
            return $res;
        }
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
            $timestamp = mktime(0, 0, 0, $month, $day - 1, $year);
            $result = date('Y-m-d', $timestamp);
            return $result;
        } elseif ($type == 3) {
            $month = $month + 1;
            $hour = $hour + 9;
            $timestamp = mktime($hour, $minute, $second, $month, $day, $year);
            $result = date('Y-m-d H:i:s', $timestamp);
            return $result;
        } elseif ($type == 4) {
            $day = $day - 1;
            $timestamp = mktime(0, 0, 0, $month, $day, $year);
            $result = date('Y-m-d', $timestamp);
            return $result;
        } elseif ($type == 5) {
            $day = $day + 1;
            $timestamp = mktime(0, 0, 0, $month, $day, $year);
            $result = date('Y-m-d', $timestamp);
            return $result;
        }
    }

    private function curl($url, $header = 0)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, $header);
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
                            if (substr($item, strlen($item) - 1, 1) == ']') {
                                $item = substr($item, 0, -1);
                            }
                            if ($type == 0) {
                                if ($name == 'playerHonor') {
                                    $item = explode("',", $item);
                                } else {
                                    $item = explode(",", $item);
                                }
                            } //side_lineup
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

                                    $key_name = $key_set[$name][$key_index];
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
                                            $result[$name][$index][$key_name] = trim($res);
                                        }
                                    }
                                } else {
                                    $res = trim($res, "'");
                                    $result[$name][$index][] = trim($res);
                                }
                            }
                        }
                        //1차원 배열
                    } else {
                        $arr = trim($arr[1]);
                        $arr = substr($arr, 1);
                        $arr = substr($arr, 0, -2);
                        $arr = explode('],[', $arr);
                        $arr = explode(',', trim($arr[0]));
                        foreach ($arr as $key_index => $item) {
                            if (!empty($key_set[$name])) {
                                $key_name = $key_set[$name][$key_index];
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
        $key_set['transferInfo'] = ['transfer_season', 'from_team_idx', 'to_team_idx', 'transfer_time', 'contract_expires', '', '', '', '', 'transfer_fee', 'type', 'from_team_name', 'to_team_name'];
        $key_set['nowTeamInfo'] = ['', 'uniform_number', '', '', '', 'position', 'team'];
        $key_set['twoYear'] = ['game_idx', '', '', 'league_name', 'game_start_time', 'home_team_idx', 'away_team_idx', 'home_goal', 'away_goal', 'league_bgcolor', '', '', 'home_team_name', '', '', 'away_team_name', 'red', 'yellow', 'goals', 'pen', 'og', '', '', '', ''];
        $key_set['playerTotal'] = ['goals', 'pen', 'og', 'yellow', 'red'];
        $key_set['playerHonor'] = ['league', 'season'];

        $key_set['lineupDetail'] = ['idx', 'uniform_number', 'name', '', '', 'birth', 'height', 'weight', 'position', 'country', '', 'value', '', '', '', '', '', '', '', '', ''];

        $key_set['rearguard'] = ['', 'uniform_number', '', '', 'name', ''];
        $key_set['vanguard'] = ['', 'uniform_number', '', '', 'name', ''];
        $key_set['goalkeeper'] = ['', 'uniform_number', '', '', 'name', ''];
        $key_set['midfielder'] = ['', 'uniform_number', '', '', 'name', ''];

        $key_set['lastUpdateTime'] = ['date'];

        return $key_set;
    }

    public function filter_test()
    {
        $url = 'http://data.nowgoal.com/MatchByCountry.aspx?date=2020-1-10&orderby=time&type=2';

        $get_curl = $this->curl($url);

        $a_key = ['game_idx', 'b_arr', 'home_idx', 'away_idx', 'home_team_name', 'away_team_name', 'game_date', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $a_y_key = ['game_idx', 'b_arr', 'home_idx', 'away_idx', 'home_team_name', 'away_team_name', 'game_date', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
        $b_key = ['league_idx', 'league_name', 'league_full_name', 'league_color', 'sub_league', ''];

        $get_curl = str_replace('];', '', $get_curl);

        $get_curl_c = explode('C[', $get_curl);
        $get_curl_b = explode('B[', $get_curl_c[0]);
        $get_curl_a = explode('B[', $get_curl_b[0]);
        unset($get_curl_c[0]);
        unset($get_curl_b[0]);
        unset($get_curl_a[1]);
        $get_curl_a = explode(']=[', $get_curl_a[0]);
        unset($get_curl_a[0]);

        foreach ($get_curl_b as $key => $value) {
            $value = explode(']=[', $value)[1];
            $value = explode(',', $value);
            $res_b[$key] = array_combine($b_key, $value);
            unset($res_b[$key]['']);
        }

        foreach ($get_curl_a as $key => $value) {
            $value = explode(',', $value);
            if (count($value) == '31') {
                $res_a[$key] = array_combine($a_key, $value);
            } elseif (count($value) == '33') {
                $res_a[$key] = array_combine($a_y_key, $value);
            } else {
                break;
            }
            $res_b_idx = $res_a[$key]['b_arr'];
            $res_a[$key]['b_arr_list'] = $res_b[$res_b_idx];
            unset($res_a[$key]['']);
        }

        var_dump($res_a);
    }

    public function odds($game_idx)
    {
        $odds_key = ['bet_idx', 'bet_game_idx', 'bet_name', 'first_win_bet', 'first_draw_bet', 'first_lose_bet', 'first_win_ratio', 'first_draw_ratio', 'first_lose_ratio', 'first_return', 'last_win_bet', 'last_draw_bet', 'last_lose_bet', 'last_win_ratio', 'last_draw_ratio', 'last_lose_ratio', 'last_return', 'kelly_criterion_1', 'kelly_criterion_2', 'kelly_criterion_3', 'last_update', '', 'hot_type', 'exchange_type'];

        $odds_detail_key = ['win_bet', 'draw_bet', 'lose_bet', 'update', 'kelly_criterion_1', 'kelly_criterion_2', 'kelly_criterion_3'];
        $last_null_key = ['win_bet', 'draw_bet', 'lose_bet', 'win_ratio', 'draw_ratio', 'lose_ratio', 'return'];

        $url = 'http://1x2.nowgoal.com/' . $game_idx . '.js';

        try {
            $get_curl = $this->curl($url);
            $odds = explode('game=Array("', $get_curl);
            $odds_config = $odds[0];
            $odds = explode('");', $odds[1]);
            $odds_detail = explode('Array("', $odds[1]);
            $odds = explode('","', $odds[0]);

            $odds_detail = explode('","', $odds_detail[1]);

            foreach ($odds_detail as $key => $value) {
                $value = explode('^', $value);
                $value[1] = explode(';', $value[1]);
                array_pop($value[1]);
                foreach ($value[1] as $index => $item) {
                    $item = explode('|', $item);
                    $odds_detail_list[$value[0]][$index] = array_combine($odds_detail_key, $item);
                    unset($odds_detail_list[$value[0]][$index]['']);
                }
            }

            foreach ($odds as $key => $value) {
                $value = explode('|', $value);
                $res[$key] = array_combine($odds_key, $value);
                $res[$key]['last_update'] = $this->_odds_date($res[$key]['last_update']);
                $res[$key]['odds_change'] = $odds_detail_list[$res[$key]['bet_game_idx']];
                unset($res[$key]['']);

                if ($res[$key]['last_win_bet'] == "") {
                    foreach ($last_null_key as $index => $item) {
                        $res[$key]['last_' . $item] = $res[$key]['first_' . $item];
                    }
                }
            }
            $result['odds']['config'] = $this->_odds_config($odds_config);
            $result['odds']['contents'] = $res;

            return $result;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function _odds_config($data)
    {
        $config_key = ['league_name', '', '', '', '', 'game_date', 'game_idx', 'home_team_name', 'away_team_name', '', '', '', '', '', '', '', '', 'home_team_idx', 'away_team_idx', 'home_team_img', 'away_team_img', '', '', '', 'season', 'league_idx', '', '', 'weather_type', 'temperature', 'stadium'];

        $data = preg_replace('/"|;/', '', $data);
        $data = explode('var', $data);
        array_shift($data);
        array_pop($data);

        foreach ($data as $key => $value) {
            $value = explode('=', $value);
            $res[$key] = trim($value[1]);
        }
        $res = array_combine($config_key, $res);
        $res['game_date'] = $this->_odds_date($res['game_date'], 1);
        $res['team_href'] = $this->team_href;
        $res['team_img_url'] = $this->team_img_url;

        unset($res['']);

        return $res;
    }

    private function _odds_date($data, $type = 0)
    {
        $last_update = explode(',', $data);
        $last_update[1] = substr($last_update[1], 0, -1);
        $last_update = $last_update[0] . '-' . $last_update[1] . $last_update[2] . ' ' . $last_update[3] . ':' . $last_update[4];

        $last_update = strtotime($last_update . '+' . $this->time_diff . ' hours');

        if ($type == 0) {
            $res = date("m-d H:i", $last_update);
        } elseif ($type == 1) {
            $res = date("n/d/Y H:i l", $last_update);
        }

        return $res;
    }

    public function odds_list($bet_game_idx = null)
    {
        $game_bet_key = ['bet_win', 'bet_win_color', 'bet_draw', 'bet_draw_color', 'bet_lose', 'bet_lose_color', 'win_ratio', 'draw_ratio', 'lose_ratio', 'return', '', '', '', 'change_time'];

        try {
            //$url = 'http://1x2.nowgoal.com/' . $game_idx . '.js';
            /* if (!empty($game_idx)) {
                $get_curl = $this->curl($url);
                $odds = explode('game=Array("', $get_curl) ;
                $odds_config = $odds[0];
                $odds = explode('");', $odds[1]);
                $odds_detail = explode('Array("', $odds[1]);
                $odds = explode('","', $odds[0]);

                $odds_detail = explode('","', $odds_detail[1]);

                $odds_bet_list = $this->_odds_list_bet($odds);

                $game_bet_idx = $odds_bet_list[$bet_idx]['bet_game_idx'];
            } */
            $url = 'http://data.nowgoal.com/1x2/OddsHistory.aspx?id=' . $bet_game_idx;

            $get_html = file_get_html($url);
            $get_html = $get_html->find('tr');
            array_shift($get_html);
            foreach ($get_html as $key => $value) {
                $value = $value->find('td');
                foreach ($value as $index => $item) {
                    if (strpos($item->innertext, 'font')) {
                        $res_val[] = $item->find('font', 0)->innertext;
                        $res_val[] = !empty($item->find('font', 0)->color) ? $item->find('font', 0)->color : 'black';
                    } elseif (strpos($item->innertext, 'script')) {
                        $res_val[] = $this->_odds_list_date($item->innertext);
                    } else {
                        $res_val[] =
                            preg_replace('/<b>|<\/b>|<script>|<\/script>/', '', $item->innertext);
                    }
                }
                $res[$key] = array_combine($game_bet_key, $res_val);
                unset($res[$key]['']);
                $res_val = [];
            }

            //$result['odds_list']['config'] = $this->_odds_config($odds_config);
            $result['odds_list']['contents'] = $res;

            return $result;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function _odds_list_date($data)
    {
        $data = explode('(', $data);
        $data = explode(')', $data[1])[0];
        $data = explode(',', $data);

        $data = $data[0] . '-' . $data[1] . '-' . $data[2] . ' ' . $data[3] . ':' . $data[4];
        $data = strtotime($data . '+1 month +' . $this->time_diff . ' hour');

        return date('m/d H:i', $data);
    }

    private function _odds_list_bet($data)
    {
        $odds_key = ['bet_idx', 'bet_game_idx', 'bet_name', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

        foreach ($data as $key => $value) {
            $value = explode('|', $value);
            $res[$value[0]] = array_combine($odds_key, $value);

            unset($res[$key]['']);
        }

        return $res;
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
                $result[$key]['game_contents'][$index]['game_idx'] = $res_sec_arr[0];
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
        $url = 'http://info.nowgoal.com/jsData/LeagueSeason/sea' . $league_idx . '.js';

        $get_curl = $this->curl($url);

        $get_curl = explode('arrSeason = [', $get_curl);
        $get_curl = str_replace("'", "", $get_curl[1]);
        $get_curl = substr($get_curl, 0, -3);
        $get_curl = explode(',', $get_curl);

        return $get_curl;
    }

    public function cup($league_idx = '103', $season = null)
    {
        try {
            $season_arr = $this->_season_list($league_idx);
            $select_season = !empty($season) ? $season : $season_arr[0];

            $url = 'http://info.nowgoal.com/jsData/matchResult/' . $select_season . '/c' . $league_idx . '_en.js?version=' . date('YmdH', time());

            $get_curl = $this->curl($url);
            $get_curl = explode('var arr', $get_curl);
            $get_curl[0] = explode('];', $get_curl[1])[0];

            $cup_info = $this->_cup_info($get_curl[0]);
            $round_games = $this->_cup_round_games($get_curl[1]);
            $round_list = $this->_cup_round_list($get_curl[2]);
            $team_list = $this->_cup_team_list($get_curl[3]);

            foreach ($round_list as $round_idx => $round_val) {
                $round_games_for = [];
                $round_games_for = $round_games['games'][$round_val['round_idx']];
                foreach ($round_games_for as $game_idx => $game_val) {
                    if (array_key_exists('home_team_idx', $game_val)) {
                        $round_games_res[$game_idx] = $game_val;
                        $round_games_res[$game_idx]['home_team_name'] = $team_list[$game_val['home_team_idx']]['team_name'];
                        $round_games_res[$game_idx]['away_team_name'] = $team_list[$game_val['away_team_idx']]['team_name'];
                    } elseif (strpos($game_idx, 'group') !== false) {
                        foreach ($game_val as $group_idx => $group_val) {
                            $round_games_res[$game_idx][$group_idx] = $group_val;
                            $round_games_res[$game_idx][$group_idx]['home_team_name'] = $team_list[$group_val['home_team_idx']]['team_name'];
                            $round_games_res[$game_idx][$group_idx]['away_team_name'] = $team_list[$group_val['away_team_idx']]['team_name'];
                        }
                    }
                }
                if ($round_val['group_type'] == 0 && $round_val['group_num'] != 0) {
                    $round_group_rank = $round_games['rank'][$round_val['round_idx']];

                    foreach ($round_group_rank as $group_idx => $group_val) {
                        foreach ($group_val as $stats_idx => $stats_val) {
                            $group_val_res[$stats_idx] = $stats_val;
                            $group_val_res[$stats_idx]['team_name'] = $team_list[$stats_val['team_idx']]['team_name'];
                        }
                        $round_rank_res[$group_idx] = $group_val_res;
                    }
                    $res_contents[$round_val['round_name']]['rank'] = $round_rank_res;
                }

                $res_contents[$round_val['round_name']]['games'] = $round_games_res;
                $round_games_res = [];
            }
            $cup_info['league_season'] = $select_season;
            $cup_info['season_list'] = $season_arr;
            $cup_info['round_list'] = $round_list;
            $res['cup']['config'] = $cup_info;
            $res['cup']['contents'] = $res_contents;

            return $res;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function _cup_info($data)
    {
        $cup_info_key = ['league_idx', '', '', 'league_name', '', '', 'league_short_name', 'league_season', 'league_image', 'league_bgcolor', ''];

        $cup_info = explode('];', $data);
        $cup_info = explode('[', $cup_info[0])[1];
        $cup_info = str_replace("'", '', $cup_info);
        $cup_info = explode(',', $cup_info);

        $cup_info = array_combine($cup_info_key, $cup_info);
        unset($cup_info['']);

        $cup_info['league_img_url'] = $this->league_img_url;
        $cup_info['team_href'] = $this->team_href;
        $cup_info['detail_href'] = $this->detail_href;
        $cup_info['analysis_href'] = $this->analysis_href;
        $cup_info['oddscomp_href'] = $this->oddscomp_href;

        return $cup_info;
    }

    private function _cup_round_games($data)
    {
        $game_key = ['game_idx', 'league_idx', '', 'game_date', 'home_team_idx', 'away_team_idx', 'full_score', 'half_score', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'home_league_name', 'away_league_name'];
        $game_key_ver2 = ['game_idx', 'league_idx', '', 'game_date', 'home_team_idx', 'away_team_idx', 'full_score', 'half_score', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'home_league_name', 'away_league_name'];
        $game_key_overtime = ['game_idx', 'league_idx', '', 'game_date', 'home_team_idx', 'away_team_idx', 'full_score', 'half_score', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '90min', 'two_round', '', '120min', 'penalty_kick', 'winning_team', '', 'home_league_name', 'away_league_name'];
        $overtime_key = ['90min', 'two_round', '120min', 'penalty_kick', 'winning_team'];
        $game_result_key = ['home_team_idx', 'away_team_idx', 'home_goal', 'away_goal'];
        $group_rank_key = ['ranking', 'team_idx', 'games', 'win', 'draw', 'lose', 'get', 'miss', 'goal_diff', 'score', ''];

        $data = str_replace('推迟|推遲|Delay', 'delay', $data);
        $data = str_replace('jh["', '', $data);
        $data = str_replace("'", '', $data);
        $round_games = explode(']];', $data);
        $round_games[0] = explode('];', $round_games[0])[1];
        array_pop($round_games);

        foreach ($round_games as $key => $value) {
            $value = explode('"] = [[', $value);
            $value[0] = trim($value[0]);

            if (substr($value[0], 0, 1) == 'G') {
                $value[0] = substr($value[0], 1);

                if (preg_match('/[a-zA-Z]/', $value[0], $group_name)) {
                    $value[0] = substr($value[0], 0, -1);
                    $games_val = explode('],[', $value[1]);
                    foreach ($games_val as $index => $item) {
                        $item = explode(',', $item);
                        $res['games'][$value[0]]['group_' . $group_name[0]][$index] = array_combine($game_key, $item);
                        unset($res['games'][$value[0]]['group_' . $group_name[0]][$index]['']);
                    }
                } else {
                    $value[1] = str_replace(']', '', $value[1]);
                    $games_val = explode(',[', $value[1]);

                    foreach ($games_val as $index => $item) {
                        $item = str_replace(';', ',', $item);
                        $item = explode(',', $item);
                        if (count($item) == 4) {
                            $res['games'][$value[0]][$index] = array_combine($game_result_key, $item);
                        } elseif (count($item) == 26) {
                            $res['games'][$value[0]][$index] = array_combine($game_key, $item);
                            unset($res['games'][$value[0]][$index]['']);
                        } elseif (count($item) == 33) {
                            $res['games'][$value[0]][$index] = array_combine($game_key_ver2, $item);
                            unset($res['games'][$value[0]][$index]['']);
                        } elseif (count($item) == 35) {
                            $res['games'][$value[0]][$index] = array_combine($game_key_overtime, $item);
                            unset($res['games'][$value[0]][$index]['']);
                            foreach ($overtime_key as $over_idx => $over_val) {
                                $res['games'][$value[0]][$index]['overtime'][$over_val] = $res['games'][$value[0]][$index][$over_val];
                                unset($res['games'][$value[0]][$index][$over_val]);
                            }
                        }
                    }
                }
            } elseif (substr($value[0], 0, 1) == 'S') {
                $value[0] = substr($value[0], 1);
                $group_idx = substr($value[0], 0, -1);
                $group_name = 'group_' . substr($value[0], -1);
                $group_arr = explode('],[', $value[1]);
                foreach ($group_arr as $index => $item) {
                    $item = explode(',', $item);
                    $res['rank'][$group_idx][$group_name][$index] = array_combine($group_rank_key, $item);
                    unset($res['rank'][$group_idx][$group_name][$index]['']);
                }
            }
        }
        return $res;
    }

    private function _cup_round_list($data)
    {
        $cupkind_key = ['round_idx', '', '', '', 'round_name', 'group_num', '', 'group_type'];
        $cupkind_key_default = ['round_idx', '', '', '', 'round_name', 'group_num', 'games_type', 'group_type'];

        $data = explode('=', $data);
        $data = preg_replace('/[]]{2}|[[]{2}|[;]|[\']/', '', $data[1]);
        $data = trim($data);

        if (strpos($data, '],[', 0)) {
            $cupkind = explode('],[', $data);
            foreach ($cupkind as $key => $value) {
                $cupkind_val = explode(',', $value);
                $res[$key] = array_combine($cupkind_key, $cupkind_val);
                unset($res[$key]['']);
            }
        } else {
            $cupkind_val = explode(',', $data);
            $res[] = array_combine($cupkind_key, $cupkind_val);
            unset($res['']);
        }

        return $res;
    }

    private function _cup_team_list($data)
    {
        $team_key = ['team_idx', '', '', 'team_name', ''];

        $team_list = explode('[[', $data);
        $team_list = explode(']]', $team_list[1])[0];
        $team_list = str_replace("'", '', $team_list);
        $team_list = explode('],[', $team_list);

        foreach ($team_list as $key => $value) {
            $team_val = explode(',', $value);
            $res[$team_val[0]] = array_combine($team_key, $team_val);
            unset($res[$team_val[0]]['']);
        }

        return $res;
    }

    //$league_idx, $season, $round: 라운드수; $game_time: full,half; $game_stadium: total,home,away; $round_type: full,last
    public function league_round($league_idx = '36', $season = null, $round = 1, $game_time = 'full', $game_stadium = 'total', $round_type = 'last')
    {
        try {
            $res_key = ['', '', '', '', 'home_team_idx', 'away_team_idx', 'full_score', 'half_score'];
            $game_time = $this->_filter($game_time, ['full', 'half']);
            $game_stadium = $this->_filter($game_stadium, ['total', 'home', 'away']);

            $season = $season == null ? $this->_season_list($league_idx)[0] : $season;

            $league_idx = $this->_league_subleague_confirm($league_idx);

            $url = 'http://info.nowgoal.com/jsData/matchResult/' . $season . '/s' . $league_idx . '_en.js?version=' . date('YmdH', time());

            $get_curl = $this->curl($url);

            $league_teamlist = explode('totalScore = [[', $get_curl);
            $league_teamlist = explode('arrTeam', $league_teamlist[0]);
            $get_data = str_replace('var arrSubLeague', '', $get_curl);
            $get_data = explode('var', $get_data);
            $get_data = str_replace("'", "", $get_data[2]);
            $get_data = explode('R_', $get_data);
            array_shift($get_data);
            foreach ($get_data as $r_index => $value) {
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
            if ($round > count($get_data)) {
                return '최대 라운드는 ' . count($get_data) . ' 라운드 입니다.';
            }
            if ($round_type == 'last') {
                $result['round_ranking'] = $this->_league_round_cal($data, $game_time, $game_stadium)[$round - 1];
            } elseif ($round_type == 'full') {
                $result['round_ranking'] = $this->_league_round_cal($data, $game_time, $game_stadium);
            }
            $result['round_ranking']['config'] = $this->_league_ranking_config($get_curl, $league_idx);

            return $result;
        } catch (\Exception $e) {
            return null;
        }
    }

    //라운드별 스텟더하기
    private function _league_round_cal($data, $game_time)
    {
        $contents_arr = ['get', 'miss', 'score', 'games', 'win', 'draw', 'lose', 'goal_diff'];
        foreach ($data as $value) {
            foreach ($value as $team) {
                $res['config'] = $team['config'];
                foreach ($team['contents'] as $time => $time) {
                    $team_idx = $team['contents'][$time]['team_idx'];
                    foreach ($contents_arr as $contents) {
                        if (!empty($res['contents'][$time][$team_idx][$contents])) {
                            $$contents = $res['contents'][$time][$team_idx][$contents];
                        } else {
                            $$contents = 0;
                        }
                        $res['contents'][$time][$team_idx][$contents] = (int)$team['contents'][$time][$contents] + (int)$$contents;
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
        $compare_name = ['score', 'goal_diff', 'get', 'team_idx'];
        $compare_name = array_reverse($compare_name);

        foreach ($data['contents'] as $data_key => $data_val) {
            foreach ($compare_name as $com_idx => $com_name) {
                foreach ($data_val as $key => $value) {
                    $sort[$com_name][$key] = $value[$com_name];
                }
                $com_name == 'team_idx' ? asort($sort[$com_name]) : arsort($sort[$com_name]);
                $sort_overlap = array_count_values($sort[$com_name]);
                if ($com_idx < (count($compare_name) - 1)) {
                    foreach ($sort[$com_name] as $sort_idx => $sort_val) {
                        if (count($sort_overlap) != count($sort[$com_name])) {
                            foreach ($sort_overlap as $over_idx => $over_val) {
                                foreach ($sort_res[$com_idx - 1] as $res_idx => $res_val) {
                                    if ($res_val == $over_idx) {
                                        $sort_res[$com_idx][$res_idx] = $data_val[$res_idx][$compare_name[$com_idx + 1]];
                                    }
                                }
                            }
                        } else {
                            $sort_res[$com_idx][$sort_idx] = $data_val[$sort_idx][$compare_name[$com_idx + 1]];
                        }
                    }
                } else {
                    foreach ($sort_overlap as $over_idx => $over_val) {
                        foreach ($sort_res[$com_idx - 1] as $res_idx => $res_val) {
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
        $res['win_per'] = $data['win'] == 0 ? 0 : round(($data['win'] / $data['games']) * 100, 1);
        $res['draw_per'] = $data['draw'] == 0 ? 0 : round(($data['draw'] / $data['games']) * 100, 1);
        $res['lose_per'] = $data['lose'] == 0 ? 0 : round(($data['lose'] / $data['games']) * 100, 1);
        $res['avg_get'] = $data['get'] == 0 ? 0 : round(($data['get'] / $data['games']), 2);
        $res['avg_miss'] = $data['miss'] == 0 ? 0 : round(($data['miss'] / $data['games']), 2);

        return $res;
    }

    //팀별 득점,실점,골득실,승무패,승점 셋팅
    private function _league_round_value($round_info, $league_teamlist, $game_time, $game_stadium)
    {
        $team_list = $this->_league_ranking_teamlist($league_teamlist);
        $stadium_arr = ['home', 'away'];

        foreach ($stadium_arr as $stadium_val) {
            foreach ($game_time as $time_name) {
                foreach ($game_stadium as $stadium_name) {
                    $config['team_href'] = 'http://info.nowgoal.com/en/team/Summary/';
                    $time = $time_name . '_' . $stadium_name;
                    $team_idx = $round_info[$stadium_val . '_team_idx'];
                    $contents[$time]['team_idx'] = $team_list[$team_idx]['team_idx'];
                    $contents[$time]['team_name'] = $team_list[$team_idx]['team_name'];

                    if (strpos($round_info['full_score'], '-')) {
                        $score = explode('-', $round_info[$time_name . '_score']);
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
            $res_key = array('tournament', 'ranking', 'team_idx', 'red_card', 'games', 'win', 'draw', 'lose', 'get', 'miss', 'goal_diff', 'win_per', 'draw_per', 'lose_per', 'avg_get', 'avg_lose', 'score', '', '', 'recent', 'recent', 'recent', 'recent', 'recent', 'recent', '');

            //subleague 있는지 확인
            $idx_value = $this->_league_subleague_confirm($idx_value);

            $url = 'http://info.nowgoal.com/jsData/matchResult/2019-2020/s' . $idx_value . '_en.js?version=' . date('YmdH', time());

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
                    $res_config = $this->_league_ranking_config($league_teamlist[0], $idx_value);
                } else {
                    $res_config = $this->_league_ranking_config($league_teamlist[0], $idx_value);
                }

                $team_list = $this->_league_ranking_teamlist($league_teamlist[1]);
                $tournament_list = $this->_league_ranking_tournament($get_curl[0]);

                foreach ($league_ranking as $key => $value) {
                    $res_value = explode(',', $value);
                    for ($i = 19; $i < 25; $i++) {
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
                $data['league_ranking'] = [
                    'config' => $res_config,
                    'contents' => $res
                ];
                return $data;
            } else {
                return false;
            }
        }
    }

    private function _league_subleague_confirm($league_idx)
    {
        if (empty(strpos($league_idx, '_', 0))) {
            $url = 'http://info.nowgoal.com/en/League/' . $league_idx . '.html';
            $get_html = file_get_html($url);
            if (strpos($get_html, 'SubSclassID', 0)) {
                $sub_idx = explode('SubSclassID = ', $get_html);
                $sub_idx = explode(';', $sub_idx[1]);
                if ($sub_idx[0] == 0) {
                    return $league_idx;
                } else {
                    return $league_idx . '_' . $sub_idx[0];
                }
            }
        } else {
            return $league_idx;
        }
    }

    //$type = 0: league, 1: subLeague
    private function _league_ranking_config($get_curl, $league_idx)
    {
        $arr_league = explode('[', $get_curl);
        $arr_league = str_replace("'", '', $arr_league[1]);
        $arr_league = explode(',', $arr_league);


        if (empty(strpos($get_curl, 'arrSubLeague', 0))) {
            $res_key = ['league_idx', '', '', 'league_full_name', 'league_season', 'league_bgcolor', 'league_img', 'total_round', 'current_round', '', '', 'league_short_name'];
            $arr_league = array_splice($arr_league, 0, 12);
            $arr_league = array_combine($res_key, $arr_league);
        } else {
            $res_key = ['league_idx', '', '', 'league_full_name', 'league_season', 'league_bgcolor', 'league_img', '', '', 'league_short_name'];
            $sub_key = ['league_sub_idx', '', '', 'league_sub_name', '', 'total_round', 'current_round', ''];

            $arr_sub = explode('var arrSubLeague', $get_curl)[1];
            if (empty(strpos($arr_sub, '],[', 0))) {
                $arr_sub = str_replace("'", ' ', $arr_sub);
                $arr_sub = explode('[[', $arr_sub)[1];
                $arr_sub = explode(']]', $arr_sub)[0];
                $arr_sub = explode(',', $arr_sub);
                $arr_sub = array_combine($sub_key, $arr_sub);
                unset($arr_sub[""]);
                foreach ($arr_sub as $key => $value) {
                    $arr_sub[$key] = trim($value, ' ');
                }
            } else {
                $sub_idx = explode('_', $league_idx)[1];
                $arr_sub = str_replace("'", ' ', $arr_sub);
                $arr_sub = explode('[[', $arr_sub)[1];
                $arr_sub = explode(']]', $arr_sub)[0];
                $arr_sub = explode('],[', $arr_sub);

                foreach ($arr_sub as $key => $value) {
                    $tmp_arr = explode(',', $value);

                    $arr_sub[$tmp_arr[0]] = array_combine($sub_key, $tmp_arr);
                    $arr_sub[$tmp_arr[0]] = array_map(function ($item) {
                        return trim($item, ' ');
                    }, $arr_sub[$tmp_arr[0]]);
                    unset($arr_sub[$key]);
                }
                $arr_sub = $arr_sub[$sub_idx];
            }
            $arr_league = array_splice($arr_league, 0, 10);
            $arr_league = array_combine($res_key, $arr_league);
            $arr_league = array_merge($arr_league, $arr_sub);
        }
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
        $res_key = ['team_idx', '', '', 'team_name', '', 'team_img', ''];

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

        $res = array_map(function ($item) {
            return preg_replace('/\s{2,}/', ' ', $item);
        }, $res);

        return $res;
    }

    private function _league_ranking_tournament($get_curl)
    {
        $res_key = ['entry_bgcolor', '', '', 'entry_name'];

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
        $url = 'http://info.nowgoal.com/jsData/playerInfo/player' . $player_idx . '_en.js?version=' . date('YmdH', time());
        $get_curl = $this->curl($url);

        $headers = get_headers($url);

        if (substr($headers[0], 9, 3) == '302') {
            $url = 'http://info.nowgoal.com/en/team/player/' . $player_idx . '.html';
            $this->curl($url);
            $url = 'http://info.nowgoal.com/jsData/playerInfo/player' . $player_idx . '_en.js?version=' . date('YmdH', time());
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
            $result['currently_play']['contents'] = !empty($get_curl['nowTeamInfo'][0]) ? $get_curl['nowTeamInfo'] : null;
        }
        if ($filter == null || in_array(2, $filter)) {
            $result['transfer_info']['config']['team_href'] = 'http://info.nowgoal.com/en/team/Summary/';
            $result['transfer_info']['contents'] = $get_curl['transferInfo'];

            if (!empty($get_curl['transferInfo'][0])) {
                foreach ($result['transfer_info']['contents'] as $key => $value) {
                    //임시로 team_idx 뒤에 .html
                    $result['transfer_info']['contents'][$key]['from_team_idx'] = $value['from_team_idx'] . '.html';
                    $result['transfer_info']['contents'][$key]['to_team_idx'] = $value['to_team_idx'] . '.html';
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
                    $result['recent_statistics']['contents'][$key]['home_team_idx'] = $value['home_team_idx'] . '.html';
                    $result['recent_statistics']['contents'][$key]['away_team_idx'] = $value['away_team_idx'] . '.html';
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
        $url = 'http://info.nowgoal.com/en/team/player/' . $player_idx . '.html';
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
        $url = 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl' . $team_idx . '_en.js?version=' . date('YmdH', time());

        $filter = 'rearguard,vanguard,goalkeeper,midfielder,lineupDetail';
        $filter = $this->_filter($filter);
        $get_curl = $this->curl($url);
        $get_curl = $this->curl_array($get_curl, $filter, $type = 1);

        $side_lineup['config'] = [
            'player_href' => 'http://info.nowgoal.com/en/team/player/'
        ];
        foreach ($get_curl['lineupDetail'] as $key) {
            foreach ($get_curl['vanguard'] as $value) {
                if ($key['name'] == $value['name']) {
                    $key['idx'] = $key['idx'] . '.html';
                    $side_lineup['contents']['striker'][] = $key;
                    break;
                }
            }
            foreach ($get_curl['rearguard'] as $value) {
                if ($key['name'] == $value['name']) {
                    //player_idx 뒤에 .html 임시로 붙이기
                    $key['idx'] = $key['idx'] . '.html';
                    $side_lineup['contents']['defender'][] = $key;
                    break;
                }
            }

            foreach ($get_curl['goalkeeper'] as $value) {
                if ($key['name'] == $value['name']) {
                    $key['idx'] = $key['idx'] . '.html';
                    $side_lineup['contents']['goalkeeper'][] = $key;
                    break;
                }
            }
            foreach ($get_curl['midfielder'] as $value) {
                if ($key['name'] == $value['name']) {
                    $key['idx'] = $key['idx'] . '.html';
                    $side_lineup['contents']['midfielder'][] = $key;
                    break;
                }
            }
        }
        return $side_lineup;
    }

    public function realtime_test()
    {
        $key_arr = ['event_key', 'time', 'team_idx', '', '', 'team_type', 'player_name', 'player_name_sub'];

        $url = 'http://www.nowgoal.com/gf/data/detailIn.js?' . time() . '000';

        $get_curl = $this->curl($url);

        $get_curl = explode('var', $get_curl);
        foreach ($get_curl as $key => $value) {
            if ($key == 1) {
                $event = explode(';', $value);
                array_shift($event);
                array_pop($event);

                foreach ($event as $evt_idx => $evt_val) {
                    $tmp_event = explode('=', $evt_val);
                    preg_match("/\[(.*?)\].*/s", $tmp_event[0], $res_game_idx);
                    $event_arr = $tmp_event[1];
                    $event_arr = explode('],[', $event_arr);
                    foreach ($event_arr as $sta_idx => $sta_val) {
                        $sta_val = preg_replace("/\[|\]|'/", '', $sta_val);
                        $sta_val = explode(',', $sta_val);
                        $res[$res_game_idx[1]][$sta_idx] = array_combine($key_arr, $sta_val);
                        if ($res[$res_game_idx[1]][$sta_idx]['team_type'] == 1) {
                            $res[$res_game_idx[1]][$sta_idx]['team_type'] == 'home';
                        } elseif ($res[$res_game_idx[1]][$sta_idx]['team_type'] == 1) {
                            $res[$res_game_idx[1]][$sta_idx]['team_type'] == 'away';
                        }
                    }
                }
            }
        }

        $res = !empty($res) ? $res : null;
        return $res;
    }

    public function realtime_detail()
    {
        $key_arr = ['event_key', 'time', 'team_idx', '', '', 'team_type', 'player_name', 'player_name_sub'];

        $url = 'http://www.nowgoal.com/gf/data/detailIn.js?' . time() . '000';

        $get_curl = $this->curl($url);

        try {
            $get_curl = explode('var', $get_curl);
            foreach ($get_curl as $key => $value) {
                if ($key == 1) {
                    $event = explode(';', $value);
                    array_shift($event);
                    array_pop($event);

                    foreach ($event as $evt_idx => $evt_val) {
                        $tmp_event = explode('=', $evt_val);
                        preg_match("/\[(.*?)\].*/s", $tmp_event[0], $res_game_idx);
                        $event_arr = $tmp_event[1];
                        $event_arr = explode('],[', $event_arr);
                        foreach ($event_arr as $sta_idx => $sta_val) {
                            $sta_val = preg_replace("/\[|\]|'/", '', $sta_val);
                            $sta_val = explode(',', $sta_val);
                            $res[$res_game_idx[1]][$sta_idx] = array_combine($key_arr, $sta_val);
                            if ($res[$res_game_idx[1]][$sta_idx]['team_type'] == 1) {
                                $res[$res_game_idx[1]][$sta_idx]['team_type'] == 'home';
                            } elseif ($res[$res_game_idx[1]][$sta_idx]['team_type'] == 1) {
                                $res[$res_game_idx[1]][$sta_idx]['team_type'] == 'away';
                            }
                        }
                    }
                }
            }

            $res = [
                "1865636" => [
                    [
                        "event_key" => "1",
                        "time" => "3",
                        "team_idx" => "25446",
                        "team_type" => 'home',
                        "player_name" => "Munoz",
                        "player_name_sub" => ""
                    ],
                    [
                        "event_key" => "2",
                        "time" => "8",
                        "team_idx" => "25446",
                        "team_type" => 'home',
                        "player_name" => "Nino",
                        "player_name_sub" => ""
                    ],
                    [
                        "event_key" => "1",
                        "time" => "70",
                        "team_idx" => "25446",
                        "team_type" => 'home',
                        "player_name" => "Garcia",
                        "player_name_sub" => ""
                    ],
                    [
                        "event_key" => "1",
                        "time" => "83",
                        "team_idx" => "25446",
                        "team_type" => 'home',
                        "player_name" => "Villalpando",
                        "player_name_sub" => ""
                    ]

                ],
                "1864355" => [
                    [
                        "event_key" => "1",
                        "time" => "44",
                        "team_idx" => "19323",
                        "team_type" => 'away',
                        "player_name" => "Kettler",
                        "player_name_sub" => ""
                    ],
                    [
                        "event_key" => "1",
                        "time" => "77",
                        "team_idx" => "19323",
                        "team_type" => 'away',
                        "player_name" => "Persson",
                        "player_name_sub" => ""
                    ]
                ]
            ];


            return $res;

        } catch (\Exception $e) {
            return null;
        }
    }

    public function test_detail($ajax_html)
    {
        $game_idx = '1721918';
        $url = 'http://www.nowgoal.com/detail/' . $game_idx . '.html';

        $res_icon = [
            '1' => 'Goal',
            '2' => 'Red Card',
            '3' => 'Yellow Card',
            '4' => 'Sub in',
            '5' => 'Sub out',
            '7' => 'Penalty scored',
            '8' => 'Own goal',
            '9' => 'Second Yellow Card',
            '11' => 'Sub',
            '12' => 'Assist',
            '13' => 'Penalty missed',
            '14' => 'Penalty saved',
            '15' => 'Shot on post',
            '16' => 'Man of the match',
            '17' => 'Error lead to goal',
            '18' => 'Last man tackle',
            '19' => 'Clearance off the Line',
            '20' => 'Foul lead to penalty',
            '55' => 'Mark',
        ];

//        $get_html = $this->curl($url,1);
//
//        preg_match("!\r\n(?:Location|URI): *(.*?) *\r\n!", $get_html, $matches);
//        if($matches){
//            $get_html = $this->curl($matches[1],1);
//        }

        $get_html = str_get_html($ajax_html);

        $get_icon = !empty($get_html->find('#icons', 0)) ? $get_html->find('#icons', 0)->children() : null;

        if ($get_icon != null) {
            foreach ($get_icon as $key => $value) {
                $icon_key = explode('.', explode('/', $value->children(0)->src)[3])[0];
                $value->children(0)->remove();
                $res_icon[$icon_key] = $value->innertext;
            }
            ksort($res_icon);
        }

        $res_config = $this->_detail_record_config($get_html, $game_idx);
        $res_keyevent = $this->_detail_record_keyevent($get_html, $res_icon);
        if(!empty($res_config) && !empty($res_keyevent['config'])) {
            $res['config'] = array_merge($res_config, $res_keyevent['config']);
        }else {
            $res['config']['game_idx'] = $game_idx;
        }
        $res['key_event'] = !empty($res_keyevent['contents']) ? $res_keyevent['contents'] : null;
        $res['tech_statistics'] = $this->_detail_record_tech($get_html);

        return $res;

    }

    public function detail_record($game_idx)
    {
        $url = 'http://www.nowgoal.com/detail/' . $game_idx . '.html';

        $res_icon = [
            '1' => 'Goal',
            '2' => 'Red Card',
            '3' => 'Yellow Card',
            '4' => 'Sub in',
            '5' => 'Sub out',
            '7' => 'Penalty scored',
            '8' => 'Own goal',
            '9' => 'Second Yellow Card',
            '11' => 'Sub',
            '12' => 'Assist',
            '13' => 'Penalty missed',
            '14' => 'Penalty saved',
            '15' => 'Shot on post',
            '16' => 'Man of the match',
            '17' => 'Error lead to goal',
            '18' => 'Last man tackle',
            '19' => 'Clearance off the Line',
            '20' => 'Foul lead to penalty',
            '55' => 'Mark',
        ];
        $get_html = $this->curl($url,1);
        preg_match("!\r\n(?:Location|URI): *(.*?) *\r\n!", $get_html, $matches);

        if($matches){
            $get_html = $this->curl($matches[1],1);
        }

        $get_html = str_get_html($get_html);

        try{
        $res_config = $this->_detail_record_config($get_html, $game_idx);
        $res_keyevent = $this->_detail_record_keyevent($get_html, $res_icon);
         if(!empty($res_config) && !empty($res_keyevent['config'])) {
             $res['config'] = array_merge($res_config, $res_keyevent['config']);
         }else {
             $res['config']['game_idx'] = $game_idx;
         }
        $res['key_event'] = !empty($res_keyevent['contents']) ? $res_keyevent['contents'] : null;
        $res['tech_statistics'] = $this->_detail_record_tech($get_html);

        return $res;
        }catch (\Exception $e) {
            return null;
        }
    }

    private function _detail_record_config($get_html, $game_idx)
    {
        $data = !empty($get_html->find('.fbheader', 0)) ? $get_html->find('.fbheader', 0) : null;

        try {
        if ($data != null) {
            $data_goal = !empty($get_html->find('#teamEventDiv_detail tr', 1)) ? $get_html->find('#teamEventDiv_detail tr', 1) : $get_html->find('table', 1)->find('tr', 1);
            $data_row = !empty($data->find('.vs')) ? $data->find('.vs > .row') : null;
            if(empty($data_goal)) {return ;}

            $data_date = !empty($data_row[0]->find('script', 0)) ? $data_row[0]->find('script', 0)->innertext : null;
            if (!empty($data_date)) {
                $res_config['game_start_time'] = $this->is_empty($this->formatDate($data_date, 3));
                $res_config['division_day'] = $this->is_empty(substr($this->formatDate($data_date, 3), 0, -9));
            }
            $data_sclass_name = $data->find('.sclassName');

            $res_config['game_idx'] = $this->is_empty($game_idx);

            $res_config['home_goal'] = $this->is_empty($data_goal->find('span', 0)->innertext, 0);
            $res_config['away_goal'] = $this->is_empty($data_goal->find('span', 1)->innertext, 0);
            $res_config['home_team_idx'] = $this->is_empty(preg_split('/\/|\./', $data_sclass_name[0]->find('a', 0)->href)[8]);
            $res_config['home_name'] = $this->is_empty($data_sclass_name[0]->find('a', 0)->innertext);
            $res_config['away_team_idx'] = $this->is_empty(preg_split('/\/|\./', $data_sclass_name[1]->find('a', 0)->href)[8]);
            $res_config['away_name'] = $this->is_empty($data_sclass_name[1]->find('a', 0)->innertext);
            !empty($get_html->find('div[class="teamNames"]', 0)->find('a', 0)) ? $get_html->find('div[class="teamNames"]', 0)->find('a', 0)->remove() : null;
            $res_config['home_forma'] = $this->is_empty(trim($get_html->find('div[class="teamNames"]', 0)->children(0)->innertext));
            !empty($get_html->find('div[class="teamNames"]', 0)->find('a', 0)) ? $get_html->find('div[class="teamNames"]', 0)->find('a', 0)->remove() : null;
            $res_config['away_forma'] = $this->is_empty(trim($get_html->find('div[class="teamNames"]', 0)->children(1)->innertext));
            $res_config['home_img'] = $this->is_empty($data->find('div[id="homeImg"]', 0)->children(0)->src);
            $res_config['away_img'] = $this->is_empty($data->find('div[id="guestImg"]', 0)->children(0)->src);

        } else {
            $data = !empty($get_html->find('#matchDIV', 0)) ? $get_html->find('#matchDIV', 0) : null;

            if ($data != null) {
                $data_goal = !empty($get_html->find('table', 0)) ? $get_html->find('table', 0)->find('tr', 1) : null;
                if(empty($data_goal)) {return;}
                $data_row = !empty($data->find('.vs')) ? $data->find('.vs > .row') : null;

                if (!empty($data_row)) {
                    $data_date = !empty($data_row[0]->find('script', 0)) ? $data_row[0]->find('script', 0)->innertext : null;
                    $res_config['game_start_time'] = $this->is_empty($this->formatDate($data_date, 3));
                    $res_config['division_day'] = $this->is_empty(substr($this->formatDate($data_date, 3), 0, -9));
                }
                $data_sclass_home = $data->find('#home', 0);
                $data_sclass_away = $data->find('#guest', 0);

                $res_config['game_idx'] = $this->is_empty($game_idx);

                $res_config['home_goal'] = $this->is_empty($data_goal->find('span', 0)->innertext, 0);
                $res_config['away_goal'] = $this->is_empty($data_goal->find('span', 1)->innertext, 0);
                $res_config['home_team_idx'] = $this->is_empty(preg_split('/\/|\./', $data_sclass_home->find('a', 0)->href)[8]);
                $res_config['home_name'] = $this->is_empty($data_sclass_home->find('a', 0)->children(0)->innertext);
                $res_config['away_team_idx'] = $this->is_empty(preg_split('/\/|\./', $data_sclass_away->find('a', 0)->href)[8]);
                $res_config['away_name'] = $this->is_empty($data_sclass_away->find('a', 0)->children(0)->innertext);
                if(!empty($get_html->find('div[class="teamNames"]', 0))) {
                    !empty($get_html->find('div[class="teamNames"]', 0)->find('a', 0)) ? $get_html->find('div[class="teamNames"]', 0)->find('a', 0)->remove() : null;
                    $res_config['home_forma'] = $this->is_empty(trim($get_html->find('div[class="teamNames"]', 0)->children(0)->innertext));
                    !empty($get_html->find('div[class="teamNames"]', 0)->find('a', 0)) ? $get_html->find('div[class="teamNames"]', 0)->find('a', 0)->remove() : null;
                    $res_config['away_forma'] = $this->is_empty(trim($get_html->find('div[class="teamNames"]', 0)->children(1)->innertext));
                }
            }
        }
        return $res_config;
        }catch (\Exception $e) {
            return null;
        }
    }

    private function _detail_record_keyevent($get_html, $res_icon = null)
    {
        $key_event = null;

        if(!empty($get_html->find('#teamEventDiv_detail', 0))) {
            $key_event = $get_html->find('#teamEventDiv_detail', 0) ;
        }else if(empty($get_html->find('#teamEventDiv_detail', 0))) {
            foreach($get_html->find('.bhTable') as $idx => $val){
                if(trim($val->find('tr',0)->children(0)->innertext) == 'Key Events'){
                    $key_event = $get_html->find('.bhTable',$idx) ;
                }
            }
        }else {
            $key_event = null;
        }

        if ($key_event == null) {
            if (trim(!empty($get_html->find('table', 0)) && $get_html->find('table', 0)->children(0)->children(0)->innertext) == "Key Events") {
                $key_event = $get_html->find('table', 0);
            } else if (!empty($get_html->find('table', 1)) && trim($get_html->find('table', 1)->children(0)->children(0)->innertext) == 'Key Events') {
                $key_event = $get_html->find('table', 1);
            }
        }

        if($key_event == null) {return;}
        //echo $key_event;
        $key_event_tr = $key_event->find('tr');
        array_splice($key_event_tr, 0, 2);
        $sum_score = [];
        foreach ($key_event_tr as $tr_idx => $tr_val) {
            //echo $tr_val->find('td');
            foreach ($tr_val->find('td') as $td_idx => $td_val) {
                if (!empty($td_val->innertext)) {
                    if ($td_idx == 0) {
                        if (!empty($td_val->find('img', 1)->src)) {
                            $res_key_event[$tr_idx]['in_player_name'] = !empty($td_val->find('a', 0)) ? $td_val->find('a', 0)->innertext : trim($td_val->innertext);
                            //$res_key_event[$tr_idx]['in_player_idx'] = preg_split('/\/|\./',$td_val->find('a',0)->href)[8];
                            $res_key_event[$tr_idx]['out_player_name'] = !empty($td_val->find('a', 1)) ? $td_val->find('a', 1)->innertext : trim($td_val->innertext);
                            //$res_key_event[$tr_idx]['out_player_idx'] = preg_split('/\/|\./',$td_val->find('a',1)->href)[8];
                        } else {
                            $res_key_event[$tr_idx]['player_name'] = !empty($td_val->find('a', 0)) ? $td_val->find('a', 0)->innertext : trim($td_val->innertext);
                            //$res_key_event[$tr_idx]['player_idx'] = preg_split('/\/|\./',$td_val->find('a',0)->href)[8];
                        }
                    } else if ($td_idx == 1 && !empty($td_val->children(0)->src)) {
                        $icon_key = explode('.', explode('/', $td_val->children(0)->src)[3])[0];
                        $res_key_event[$tr_idx]['event_name'] = $res_icon[$icon_key];
                        $res_key_event[$tr_idx]['event_key'] = $icon_key;
                        $res_key_event[$tr_idx]['team_div'] = 'home';
                        if ($icon_key == 1 || $icon_key == 7 || $icon_key == 8) {
                            $sum_score = $this->_detail_record_goaltype($sum_score, 'home');
                        }
                    } else if ($td_idx == 2) {
                        $res_key_event[$tr_idx]['time'] = trim(trim($td_val->innertext),"'");
                    } else if ($td_idx == 3 && !empty($td_val->children(0)->src)) {
                        $icon_key = explode('.', explode('/', $td_val->children(0)->src)[3])[0];
                        $res_key_event[$tr_idx]['event_name'] = $res_icon[$icon_key];
                        $res_key_event[$tr_idx]['event_key'] = $icon_key;
                        $res_key_event[$tr_idx]['team_div'] = 'away';
                        if ($icon_key == '1' || $icon_key == '7' || $icon_key == '8') {
                            $sum_score = $this->_detail_record_goaltype($sum_score, 'away');
                        }
                    } else if ($td_idx == 4) {
                        if (!empty($td_val->find('img', 1)->src)) {
                            $res_key_event[$tr_idx]['in_player_name'] = !empty($td_val->find('a', 0)) ? $td_val->find('a', 0)->innertext : trim($td_val->innertext);
                            //$res_key_event[$tr_idx]['in_player_idx'] = preg_split('/\/|\./',$td_val->find('a',0)->href)[8];
                            $res_key_event[$tr_idx]['out_player_name'] = !empty($td_val->find('a', 1)) ? $td_val->find('a', 1)->innertext : trim($td_val->innertext);
                            //$res_key_event[$tr_idx]['out_player_idx'] = preg_split('/\/|\./',$td_val->find('a',1)->href)[8];
                        } else {
                            $res_key_event[$tr_idx]['player_name'] = !empty($td_val->find('a', 0)) ? $td_val->find('a', 0)->innertext : trim($td_val->innertext);
                            //$res_key_event[$tr_idx]['player_idx'] = preg_split('/\/|\./',$td_val->find('a',0)->href)[8];
                        }
                    }
                    ksort($res_key_event[$tr_idx]);
                }
            }
        }
        $res['config']['sum_score'] = $sum_score;
        $res['contents'] = !empty($res_key_event) ? $res_key_event : null;
        return $res;
    }

    private function _detail_record_goaltype($sum_score, $type)
    {
        if (empty($sum_score)) {
            if ($type == 'home') {
                $sum_score['home']['read_goal'] = 1;
                $sum_score['away']['read_goal_lose'] = 1;
                $sum_score['home']['score'] = 1;
                $sum_score['home']['first_goal'] = 1;
                $sum_score['away']['score'] = 0;
            } else if ($type == 'away') {
                $sum_score['away']['read_goal'] = 1;
                $sum_score['home']['read_goal_lose'] = 1;
                $sum_score['home']['score'] = 0;
                $sum_score['away']['score'] = 1;
                $sum_score['away']['first_goal'] = 1;
            }
        } else if ($type == 'home') {
            if (($sum_score['home']['score'] + 1) == $sum_score['away']['score']) {
                $sum_score['home']['tie_goal'] = empty($sum_score['home']['tie_goal']) ? 1 : ++$sum_score['home']['tie_goal'];
                $sum_score['away']['tie_goal_lose'] = empty($sum_score['away']['tie_goal_lose']) ? 1 : ++$sum_score['away']['tie_goal_lose'];

            } else if ($sum_score['home']['score'] == $sum_score['away']['score'] && ($sum_score['home']['score'] + 1) > $sum_score['away']['score']) {
                $sum_score['home']['read_goal'] = empty($sum_score['home']['read_goal']) ? 1 : ++$sum_score['home']['read_goal'];
                $sum_score['away']['read_goal_lose'] = empty($sum_score['away']['read_goal_lose']) ? 1 : ++$sum_score['away']['read_goal_lose'];
            }
            $sum_score['home']['score'] = ++$sum_score['home']['score'];
        } else if ($type == 'away') {
            if (($sum_score['away']['score'] + 1) == $sum_score['home']['score']) {
                $sum_score['away']['tie_goal'] = empty($sum_score['away']['tie_goal']) ? 1 : ++$sum_score['away']['tie_goal'];
                $sum_score['home']['tie_goal_lose'] = empty($sum_score['home']['tie_goal_lose']) ? 1 : ++$sum_score['home']['tie_goal_lose'];

            } else if ($sum_score['away']['score'] == $sum_score['home']['score'] && ($sum_score['away']['score'] + 1) > $sum_score['home']['score']) {
                $sum_score['away']['read_goal'] = empty($sum_score['away']['read_goal']) ? 1 : ++$sum_score['away']['read_goal'];
                $sum_score['home']['read_goal_lose'] = empty($sum_score['home']['read_goal_lose']) ? 1 : ++$sum_score['home']['read_goal_lose'];
            }
            $sum_score['away']['score'] = ++$sum_score['away']['score'];
        }
        ksort($sum_score['home']);
        ksort($sum_score['away']);
        return $sum_score;
    }

    private function _detail_record_tech($get_html)
    {
        $tech_table = !empty($get_html->find('#teamTechDiv_detail > table', 0)) ? $get_html->find('#teamTechDiv_detail > table', 0) : null;
        $special_key = ['Kick-off','First Yellow Card','Last Yellow Card','First Substitution','Last Substitution'];
        if ($tech_table == null) {
            if (!empty($get_html->find('table', 1)) && trim($get_html->find('table', 1)->children(0)->children(0)->innertext) == "Tech Statistics") {
                $tech_table = $get_html->find('table', 1);
            } else if (!empty($get_html->find('table', 2)) && trim($get_html->find('table', 2)->children(0)->children(0)->innertext) == 'Tech Statistics') {
                $tech_table = $get_html->find('table', 2);
            }
        }
        if($tech_table == null) {return;}

        $tech_table = strip_tags($tech_table, '<tr>,<td>,<img>');
        $tech_table = str_get_html($tech_table);
        $tech_table_tr = $tech_table->find('tr');
        array_shift($tech_table_tr);
        foreach ($tech_table_tr as $tr_idx => $tr_val) {
            foreach ($tr_val->find('td') as $td_idx => $td_val) {
                if ($td_idx == 1) {
                    $res_tech_home[trim($tr_val->find('td', 2)->innertext)] = trim($td_val->innertext);
                } else if ($td_idx == 3) {
                    $res_tech_away[trim($tr_val->find('td', 2)->innertext)] = trim($td_val->innertext);
                }
            }
            foreach($special_key as $key => $val){

                if (!empty($res_tech_home[$val])) {
                    $res_tech_home[$val] = 1;
                } else if (!empty($res_tech_away[$val])) {
                    $res_tech_away[$val] = 1;
                }
            }

        }

        $res['tech_statistics']['home'] = !empty($res_tech_home) ? $res_tech_home : null;
        $res['tech_statistics']['away'] = !empty($res_tech_away) ? $res_tech_away : null;

        return $res['tech_statistics'];
    }

    public function detail($game_idx, $filter = null)
    {
        $url = 'http://www.nowgoal.com/detail/' . $game_idx . '.html';
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
                    $stadium_info[] = $key;
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
            return false;
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

            $data_icon = $data->find('#icons', 0)->children();
            foreach ($data_icon as $key => $value) {
                $result['game_lineup']['config']['notes_icon'][$key]['img_name'] = $value->children(0)->src;
                $value->children(0)->remove();
                $result['game_lineup']['config']['notes_icon'][$key]['img_url'] = $value->innertext;
            }

            $data_board = $data->find('#matchBox', 0);

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
            $result['game_lineup']['contents'] = null;
            return $result;
        }
    }

    private function _lineup_team_info($getHtml)
    {
        $result['name'] = $getHtml->children(0)->innertext;
        $result['href'] = $getHtml->children(0)->href;
        $getHtml->children(0)->remove();
        $result['formation'] = $getHtml->innertext;
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
        return $result;
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
                        'away_value' => $away_value,
                        'away_percent' => $percent_value[1],
                    ];
                } elseif ($key != 0 && $value->find('td', 2)->innertext == 'Kick-off') {
                    $url = 'http://www.nowgoal.com';
                    $home_value = !empty($value->find('td', 1)->children(0)->src) ? $url . $value->find('td', 1)->children(0)->src : null;
                    $away_value = !empty($value->find('td', 3)->children(0)->src) ? $url . $value->find('td', 3)->children(0)->src : null;
                    $result['game_tech']['contents'][] = [
                        'home_percent' => null,
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
            return $percent_value = [$home_value, $away_value];
        } else {
            $sum = $home_value + $away_value;
            $home_value = round($home_value / $sum * 100);
            $away_value = round($away_value / $sum * 100);
            return $percent_value = [$home_value, $away_value];
        }
    }
}
