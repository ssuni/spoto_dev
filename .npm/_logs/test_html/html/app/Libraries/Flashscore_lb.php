<?php 
namespace App\Libraries;

class Flashscore_lb
{
    public function __construct()
    {

    }
    private function curl($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'x-fsign: SW9D1eZo'
        ));
        $get_curl = curl_exec($ch);
        curl_close($ch);

        return $get_curl;
    }
    private function get_curl_arr($get_curl , $key_arr)
    {
        try{
            $get_curl = preg_replace("(\<(/?[^\>]+)\>|\#)", "*", $get_curl);
            $get_curl = preg_replace("/\s{2,}/", "", $get_curl); 
            $get_curl = preg_replace("/\*\s\*/", "**", $get_curl);     
            $get_curl = str_replace('디비전' ,"*",$get_curl);   
            $get_curl = explode("*********",$get_curl);
            
            foreach($get_curl as $div_idx => $div_val){ 
                $div_val = explode("*******",$div_val);
                
                foreach($div_val as $team_idx => $team_val){                
                    $team_val = explode('**',$team_val );
                    $team_val = preg_replace("/\*{1}/", "", $team_val);
                   
                    if( !empty($key_arr[count($team_val)])){
                        $res[$key_arr['div_key'][$div_idx]][] =  array_combine($key_arr[count($team_val)], $team_val);
                        $count_idx = count($res[$key_arr['div_key'][$div_idx]]) - 1;
                        unset($res[$key_arr['div_key'][$div_idx]][$count_idx]['']);
                    } 
                }
            }
            return $res;
        } catch (\Exception $e) {
            return null;
        }
    }
    private function get_curl_arr_playoff($get_curl, $key_arr)
    {       
        try {
            $get_curl = preg_split('/\<div class="round([^\>]+)\>/',$get_curl);        
            unset($get_curl[0]);        
            foreach($get_curl as $round_idx => $round_val){
                $round_val = preg_split('/\<div id="match([^\>]+)\>/',$round_val);
                $round_val = preg_replace("(\<(/?[^\>]+)\>|\#)", "*", $round_val);            
                $round_val = preg_replace('/-|(\s\*)/' ,"*",$round_val);   
                $round_val = str_replace('&nbsp;' ," ",$round_val);   
                $round_val = preg_replace('/\(|\)/' ,"",$round_val);   
                
                foreach($round_val as $team_idx => $team_val){
                    $team_val = preg_split('/\*{1,}/',$team_val);   
                            
                    if( !empty($key_arr[count($team_val)])){
                        $res[$key_arr['div_key'][$round_idx-1]][$team_idx-1] = array_combine($key_arr[count($team_val)], $team_val);
                        if(!empty($res[$key_arr['div_key'][$round_idx-1]][$team_idx-1]['game_date'])){
                            $res[$key_arr['div_key'][$round_idx-1]][$team_idx-1]['game_date'] = date('d/m',$res[$key_arr['div_key'][$round_idx-1]][$team_idx-1]['game_date']);
                        }
                        unset($res[$key_arr['div_key'][$round_idx-1]][$team_idx-1]['']);
                    } 
                }            
            }
            return $res;
        } catch (\Exception $e) {
            return null;            
        }
    }
    public function mlb_rank()
    {
        $key_arr['div_key'] = ['american','national','atlantic','american_eastern','american_central','american_western' ,'national_eastern','national_central','national_western'];

        $key_arr[14] = ['team_name','','games','W','L','goal_diff','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5','',''];
        $key_arr[10] = ['team_name','','games','W','L','goal_diff','W_rate','recent_1','',''];
        $key_arr[12] = ['team_name','','games','W','L','goal_diff','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5'];
        $key_arr[8] = ['team_name','','games','W','L','goal_diff','W_rate','recent_1'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_rsB2Wj3F_f3uUKla0_table_overall';

        $get_curl = $this->curl($url);

        $res = $this->get_curl_arr($get_curl, $key_arr);
        
        return $res;
    }
    public function mlb_free_rank()
    {
        $key_arr['div_key'] = ['american','national'];

        $key_arr[15] = ['team_name','','games','W','D','L','goal_diff','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5','',''];
        $key_arr[11] = ['team_name','','games','W','D','L','goal_diff','W_rate','recent_1','',''];
        $key_arr[13] = ['team_name','','games','W','D','L','goal_diff','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5'];
        $key_arr[9] = ['team_name','','games','W','D','L','goal_diff','W_rate','recent_1'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_rsB2Wj3F_nZu4KUqf_table_overall';

        $get_curl = $this->curl($url);

        $res = $this->get_curl_arr($get_curl, $key_arr);
        
        return $res;
    }
    public function nba_rank()
    {
        $key_arr['div_key'] = ['western_conference','eastern_conference','atlantic','southeast','central','northwestern' ,'pacific','southwestern'];
        $key_arr[14] = ['team_name','','games','W','L','TP','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5','',''];
        $key_arr[12] = ['team_name','','games','W','L','TP','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_6iGyRrOb_bPyjUVy1_table_overall';
        
        $get_curl = $this->curl($url);
        
        $res = $this->get_curl_arr($get_curl, $key_arr);

        return $res;
    }
    public function volleyball_league_m_rank()
    {
        $key_arr['div_key'] = ['league'];
        $key_arr[14] = ['team_name','','games','W','L','set','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5','',''];
        $key_arr[12] = ['team_name','','games','W','L','set','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_Iyi1GmJa_4r4NwMtg_table_overall';

        $get_curl = $this->curl($url);
        
        $res = $this->get_curl_arr($get_curl, $key_arr);

        return $res;
    }
    public function volleyball_league_w_rank()
    {
        $key_arr['div_key'] = ['league'];
        $key_arr[14] = ['team_name','','games','W','L','set','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5','',''];
        $key_arr[12] = ['team_name','','games','W','L','set','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_00t6F7Y5_UFGvx0B5_table_overall';

        $get_curl = $this->curl($url);
        
        $res = $this->get_curl_arr($get_curl, $key_arr);

        return $res;
    }
    public function volleyball_cup_m_rank()
    {
        $key_arr['div_key'] = ['group_A','group_B'];
        $key_arr[12] = ['team_name','','games','W','L','set','point','recent_1','recent_2','recent_3','',''];
        $key_arr[10] = ['team_name','','games','W','L','set','point','recent_1','recent_2','recent_3'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_boa9ERmC_GzF8yvtI_table_';

        $get_curl = $this->curl($url);
        
        $res['group'] = $this->get_curl_arr($get_curl, $key_arr);
        $res['playoff'] = $this->_volleyball_cup_playoff_m_rank();

        return $res;
    }
    public function volleyball_cup_w_rank()
    {
        $key_arr['div_key'] = ['group_A','group_B'];
        $key_arr[12] = ['team_name','','games','W','L','set','point','recent_1','recent_2','recent_3','',''];
        $key_arr[10] = ['team_name','','games','W','L','set','point','recent_1','recent_2','recent_3'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_h8bDDo3I_C28HZHAU_table_';

        $get_curl = $this->curl($url);
        
        $res['group'] = $this->get_curl_arr($get_curl, $key_arr);
        $res['playoff'] = $this->_volleyball_cup_playoff_w_rank();

        return $res;
    }
    private function _volleyball_cup_playoff_m_rank()
    {
        $key_arr['div_key'] = ['semi_final','final'];
        $key_arr[10] = ['','home_full_name','home_score','away_full_name','away_score','game_date','home_short_name','away_short_name','',''];
        
        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_boa9ERmC_ba4DzbeO_draw_';
        
        $get_curl = $this->curl($url);
        
        $res = $this->get_curl_arr_playoff($get_curl, $key_arr);

        return $res;
    }
    private function _volleyball_cup_playoff_w_rank()
    {
        $key_arr['div_key'] = ['semi_final','final'];
        $key_arr[10] = ['','home_full_name','home_score','away_full_name','away_score','game_date','home_short_name','away_short_name','',''];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_h8bDDo3I_ht8Vf1tt_draw_';

        $get_curl = $this->curl($url);
        
        $res = $this->get_curl_arr_playoff($get_curl, $key_arr);

        return $res;
    }
    public function afootball_league_rank()
    {
        $key_arr['div_key'] = ['american_conference','national_conference','afc_eastern','afc_northern','afc_southern','afc_western' ,'nfc_eastern','nfc_northern','nfc_southern','nfc_western'];
        $key_arr[15] = ['team_name','','games','W','D','L','TP','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5','',''];
        $key_arr[13] = ['team_name','','games','W','D','L','TP','W_rate','recent_1','recent_2','recent_3','recent_4','recent_5'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_69gXStto_pf3FGLke_table_overall';
        
        $get_curl = $this->curl($url);
        
        $res['league'] = $this->get_curl_arr($get_curl, $key_arr);
        $res['playoff'] = $this->_afootball_league_rank_playoff();
        return $res;
    }    
    public function _afootball_league_rank_playoff()
    {
        $key_arr['div_key'] = ['1/16_final','1/8_final','semi_final','final'];
        $key_arr[12] = ['','home_full_name','home_league_rank','home_score','away_full_name','away_league_rank','away_score','game_date','home_short_name','away_short_name','game_result',''];
        $key_arr[4] = ['','home_full_name','home_league_rank',''];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_69gXStto_SIhKFu51_draw_';

        $get_curl = $this->curl($url);
        
        $res = $this->get_curl_arr_playoff($get_curl, $key_arr);

        return $res;
        
    }
    public function hockey_league_rank()
    {
        $key_arr['div_key'] = ['western_conference','eastern_conference','atlantic','central','pacific','metropolitan'];
        $key_arr[16] = ['team_name','','games','W','W_OT','L_OT','L','goal_diff','point','recent_1','recent_2','recent_3','recent_4','recent_5','',''];
        $key_arr[14] = ['team_name','','games','W','W_OT','L_OT','L','goal_diff','point','recent_1','recent_2','recent_3','recent_4','recent_5'];

        $url = 'https://d.flashscore.co.kr/x/feed/ss_1_tjzxlneD_2DvAaQeJ_table_overall';
        
        $get_curl = $this->curl($url);
        
        $res = $this->get_curl_arr($get_curl, $key_arr);

        return $res;
    }    
}