<?php 
namespace App\Libraries;

class Kovo_lb
{
    public function __construct()
    {
        helper(['SimpleHtmlDom']);
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
    private function _kovo_league_season_list($selected_season = null)
    {
        $url = 'https://www.kovo.co.kr/game/v-league/11210_team-ranking.asp';
        
        $get_html = file_get_html($url);
        $selected_season = !empty($selected_season) ? $selected_season : $get_html->find('form',1)->find('div',0)->find('option',0)->innertext;        
        $get_html = $get_html->find('form',1)->find('div',0)->find('option');
        sort($get_html);
        foreach($get_html as $key => $value){
            $res['season_list'][$key] = $value->innertext;
            if($selected_season == '2005' && $key == 0){
                $res['selected_season_key'] = '001';
                $res['selected_season'] = $value->innertext;                
            }else if(strpos($value->outertext, $selected_season) && $selected_season != '2005'){
                $res['selected_season_key'] = strlen($key+1) == 1 ? '00' . ($key+1) : '0' . ($key+1);
                $res['selected_season'] = $value->innertext;
            }
        }

        return $res;
    }
    private function _kovo_cup_season_list($selected_season = null, $gender)
    {
        $url = 'https://www.kovo.co.kr/game/kovocup/13200_team-ranking.asp';
        
        $get_html = file_get_html($url);
        $selected_season = !empty($selected_season) ? $selected_season : $get_html->find('form',1)->find('div',0)->find('option',0)->innertext;        
        $get_html = $get_html->find('form',1)->find('div',0)->find('option');
        sort($get_html);

        foreach($get_html as $key => $value){
            $res['season_list'][$key] = $value->innertext;
            if(strpos($value->outertext, $selected_season)){
                if(!empty($res['selected_season_key']) && $gender == 1){
                    $res['selected_season_key'] = strlen($key+3) == 1 ? '80' . ($key+3) : '8' . ($key+3);
                    $res['selected_season'] = $value->innertext;
                } else if (empty($res['selected_season_key'])){
                    $res['selected_season_key'] = strlen($key+3) == 1 ? '80' . ($key+3) : '8' . ($key+3);
                    $res['selected_season'] = $value->innertext;
                }
            }
        }

        return $res;
    }
    private function _league_rank_cofig($gender,$division){
        if($gender == 1){
            $res['selected_gender'] = '남자부';
        }else if($gender == 2){
            $res['selected_gender'] = '여자부';
        }
        if($division == 1){
            $res['selected_div'] = '정규리그';
        } else if($division == 2){
            $res['selected_div'] = '플레이오프';
        } else if($division == 3){
            $res['selected_div'] = '챔피언결정전';
        }else if($division == 4){
            $res['selected_div'] = '준플레이오프';
        }
        return $res;
    }
    private function _cup_rank_cofig($gender,$division){
        if($gender == 1){
            $res['selected_gender'] = '남자부';
        }else if($gender == 2){
            $res['selected_gender'] = '여자부';
        }
        
        if($division == 212){
            $res['selected_div'] = '조별리그';
        } else if($division == 214){
            $res['selected_div'] = '결승전';
        } 
        return $res;
    }
    public function league_rank($selected_season, $gender, $division)
    {        
        $key_arr = ['rank','team_name','games','point','W','L','set_gl_rate','score_gl_rate'];
        $key_arr[3] = ($division != 1) ?  'W_rate' : 'point';

        $season = $this->_kovo_league_season_list($selected_season);
        
        try{           
            $url = 'https://www.kovo.co.kr/game/v-league/11210_team-ranking.asp?s_part=' . $gender . '&season=' . $season['selected_season_key'] . '&g_part=20' . $division;

            $res['config'] = array_merge($season, $this->_league_rank_cofig($gender, $division));
             
            $get_html = file_get_html($url);
            $get_html = $get_html->find('tbody' , 0);        
            $get_html = $get_html->find('tr');            
            
            foreach($get_html as $key => $value){
                $value = $value->find('td'); 
                
                foreach($value as $idx => $item){                     
                    $item = preg_replace('/\s{1,}/','',$item->innertext);
                    $res['contents'][$key][$key_arr[$idx]] = trim($item);
                }            
            }

            return !empty($res['contents']) ? $res : null;            
        } catch (\Exception $e){
            return null;
        }
    }
    public function cup_rank($selected_season, $gender, $division)
    {        
        $key_arr = ['rank','team_name','W','L','set_gl_rate','score_gl_rate'];
        $key_arr_ver2 = ['rank','team_name','games','W','L','point','score_gl_rate','set_gl_rate'];

        $key_arr[3] = $division != 1 ?  'W_rate' : 'point';

        $season = $this->_kovo_cup_season_list($selected_season, $gender);
       
        try{
            $url = 'https://www.kovo.co.kr/game/kovocup/13200_team-ranking.asp?s_part='.$gender.'&season='.$season['selected_season_key'].'&g_part='.$division;

            $res['config'] = array_merge($season, $this->_cup_rank_cofig($gender, $division));
            $get_html = file_get_html($url);
            $get_group = $get_html->find('h4');
            array_pop($get_group);

            foreach ($get_group as $key => $value){
                $res['config']['group_list'][] = $value->innertext;
            }
            $get_key_cnt = count($get_html->find('thead',0)->find('th'));
            $get_html = $get_html->find('tbody');
            array_pop($get_html);            

            foreach ($get_html as $group_idx => $group_val){
                $division = $group_val->find('tr');
                foreach($division as $div_idx => $div_val){
                    $div_val = $div_val->find('td');
                    foreach($div_val as $team_idx => $team_val){ 
                        if(count($div_val) == 6){                            
                            $res['contents'][$group_idx][$div_idx][$key_arr[$team_idx]] = trim($team_val->innertext);
                        }else if(count($div_val) == 8){
                            $res['contents'][$group_idx][$div_idx][$key_arr_ver2[$team_idx]] = trim($team_val->innertext);
                        }
                    }            
                }
            }

            return !empty($res) ? $res : null;            
        } catch (\Exception $e){
            return null;
        }
    }
}