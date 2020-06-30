<?php

namespace App\Libraries;

//use App\Libraries\Config_lb;

class Baseball_lb extends Config_lb
{
    public function __construct()
    {
    }
    public function test()
    {
        $url = 'https://spoto.com/livescore/soccer/getTeamJson/25';
        $get_curl = $this->curl($url);
        $get_curl = json_decode($get_curl);
        foreach($get_curl->data->team_league_result as $key => $val){
            //echo var_dump($val);
            $league_win[$key] = $val->win;
            $league_idx[$key] = $val->league_idx;
        }

        array_multisort( $league_idx, SORT_DESC, $league_win, SORT_ASC, $get_curl->data->team_league_result );

        foreach($get_curl->data->team_league_result as $key => $val){
            echo $val->league_idx;
            echo '<hr/>';
            echo $val->win;
            echo '<hr/>';
        }
    }
    private function kbo_curl($url, $data)
    {

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0); // 헤더 출력 여부
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); // TimeOut 값
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $get_curl = curl_exec($ch);
        curl_close($ch);

        return $get_curl;
    }
    private function get_curl_arr($get_curl)
    {
        $key_arr = ['','rank','team_name','games','W','L','D','W_rate','game_diff','last_10matches','streak','home_result','away_result'];

        $get_curl = explode('tbody', $get_curl)[1];
        $get_curl = preg_replace('/\<\/[^\>]+\>|\<\//', '',$get_curl);
        $get_curl = preg_replace('/\s{1,}/', '',$get_curl);
        $get_curl = explode('<tr>', $get_curl);
        array_shift($get_curl);

        foreach($get_curl as $key => $value){
            $value = explode('<td>', $value);
            $res_contents[$key] = array_combine($key_arr, $value);     
            unset($res_contents[$key]['']);
        }        
        $res = $res_contents;

        return $res;
    }
    public function official_page_mlb_rank()
    {
        $records_key['standard'] = ['E','WCGB','lastTen','STRK','RS','RA','DIFF','XWL','home','away','winners','next_game'];
        $records_key['advanced'] = ['extraInning','oneRun','day','night','grass','turf','right','left'];
       
        $url = 'https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2019&date=2019-09-29&standingsTypes=regularSeason,springTraining,firstHalf,secondHalf&hydrate=division,conference,sport,league,team(nextSchedule(team,gameType=[R,F,D,L,W,C],inclusive=false),previousSchedule(team,gameType=[R,F,D,L,W,C],inclusive=true))';

        //$url = 'https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2019&date=2019-09-29';

        $get_curl = $this->curl($url);
        $get_curl = json_decode($get_curl);
        //$team_res[$team_idx][''] = $team_val->;
        foreach($get_curl->records as $div_idx => $div_val){
            foreach($div_val->teamRecords as $team_idx => $team_val){                
                $team_res[$team_idx]['team_idx'] = $team_val->team->id;
                $team_res[$team_idx]['team_full_name'] = $team_val->team->name;
                $team_res[$team_idx]['team_short_name'] = !empty($team_val->team->shortName) ? $team_val->team->shortName : null;
                $team_res[$team_idx]['clinch_mark'] = !empty($team_val->clinchIndicator) ? $team_val->clinchIndicator : null;
                $team_res[$team_idx]['W'] = $team_val->wins;
                $team_res[$team_idx]['L'] = $team_val->losses;
                $team_res[$team_idx]['PCT'] = $team_val->winningPercentage;
                $team_res[$team_idx]['GB'] = $team_val->gamesBack;

                $team_res[$team_idx]['standard'] = array_flip($records_key['standard']);
                $team_res[$team_idx]['advanced'] = array_flip($records_key['advanced']);

                $team_res[$team_idx]['standard']['E'] = $team_val->eliminationNumber;                            
                $team_res[$team_idx]['standard']['WCGB'] = $team_val->wildCardGamesBack;  
                $team_res[$team_idx]['standard']['STRK'] = $team_val->streak->streakCode;  
                $team_res[$team_idx]['standard']['RS'] = $team_val->runsScored;
                $team_res[$team_idx]['standard']['RA'] = $team_val->runsAllowed;
                $team_res[$team_idx]['standard']['DIFF'] = $team_val->runDifferential;
                $team_res[$team_idx]['standard']['XWL'] = $team_val->wins .'-'. $team_val->losses;
                $team_res[$team_idx]['standard']['next_game'] = null;
                
                foreach($team_val->records->splitRecords as $rec_idx => $rec_val){
                    if(in_array($rec_val->type,$records_key['standard'])){
                        $team_res[$team_idx]['standard'][$rec_val->type] = $rec_val->wins .'-'. $rec_val->losses ; 
                    } else if(in_array($rec_val->type,$records_key['advanced'])){
                        $team_res[$team_idx]['advanced'][$rec_val->type] = $rec_val->wins .'-'. $rec_val->losses ;                       
                    }
                }
                
                //$team_res[$team_idx]['standard'] = $team_standard; 
            }
            $div_res[$div_idx] = $team_res;
        }

        var_dump($div_res);

        //var_dump($get_curl->records[1]->teamRecords);

    }
    public function kbo_rank($season, $series)
    {                        
        $data = $season == null ? null : array('ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ScriptManager' => 'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$udpRecord|ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear' ,
        '__EVENTTARGET' => 'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear',
        '__VIEWSTATEGENERATOR' => '93092036',
        'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear' => $season,
        'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlSeries' => $series,
        'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchYear' => '2018',
        'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchDate' => '20191231',
        'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchSeries' => '0',
        '__VIEWSTATE' => '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dGggc2NvcGU9ImNvbCI+S0lBPGJyIC8+KOyKuS3tjKgt66y0KTwvdGg+PHRoIHNjb3BlPSJjb2wiPuyCvOyEsTxiciAvPijsirkt7YyoLeustCk8L3RoPjx0aCBzY29wZT0iY29sIj7tlZztmZQ8YnIgLz4o7Iq5Le2MqC3rrLQpPC90aD48dGggc2NvcGU9ImNvbCI+66Gv642wPGJyIC8+KOyKuS3tjKgt66y0KTwvdGg+PHRoIHNjb3BlPSJjb2wiPu2VqeqzhDwvdGg+PC90cj5kAgUPFgIfAQW9EDx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+65GQ7IKwPC90ZD48dGQ+4pagPC90ZD48dGQ+Ny05LTA8L3RkPjx0ZD45LTctMDwvdGQ+PHRkPjEwLTYtMDwvdGQ+PHRkPjgtNy0xPC90ZD48dGQ+Ny05LTA8L3RkPjx0ZD4xMy0zLTA8L3RkPjx0ZD4xMy0zLTA8L3RkPjx0ZD4xMC02LTA8L3RkPjx0ZD4xMS01LTA8L3RkPjx0ZCB0aXRsZT0i7ZWp6rOEIj44OC01NS0xPC90ZD48L3RyPjx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+7YKk7JuAPC90ZD48dGQ+OS03LTA8L3RkPjx0ZD7ilqA8L3RkPjx0ZD44LTgtMDwvdGQ+PHRkPjktNy0wPC90ZD48dGQ+MTAtNi0wPC90ZD48dGQ+OS03LTA8L3RkPjx0ZD4xMC01LTE8L3RkPjx0ZD4xMC02LTA8L3RkPjx0ZD44LTgtMDwvdGQ+PHRkPjEzLTMtMDwvdGQ+PHRkIHRpdGxlPSLtlanqs4QiPjg2LTU3LTE8L3RkPjwvdHI+PHRyPjx0ZCB0aXRsZT0i7YyA66qFIj5TSzwvdGQ+PHRkPjctOS0wPC90ZD48dGQ+OC04LTA8L3RkPjx0ZD7ilqA8L3RkPjx0ZD4xMC02LTA8L3RkPjx0ZD45LTctMDwvdGQ+PHRkPjEwLTYtMDwvdGQ+PHRkPjctOC0xPC90ZD48dGQ+MTItNC0wPC90ZD48dGQ+MTItNC0wPC90ZD48dGQ+MTMtMy0wPC90ZD48dGQgdGl0bGU9Iu2VqeqzhCI+ODgtNTUtMTwvdGQ+PC90cj48dHI+PHRkIHRpdGxlPSLtjIDrqoUiPkxHPC90ZD48dGQ+Ni0xMC0wPC90ZD48dGQ+Ny05LTA8L3RkPjx0ZD42LTEwLTA8L3RkPjx0ZD7ilqA8L3RkPjx0ZD44LTgtMDwvdGQ+PHRkPjEzLTMtMDwvdGQ+PHRkPjEwLTYtMDwvdGQ+PHRkPjEwLTYtMDwvdGQ+PHRkPjktNy0wPC90ZD48dGQ+MTAtNS0xPC90ZD48dGQgdGl0bGU9Iu2VqeqzhCI+NzktNjQtMTwvdGQ+PC90cj48dHI+PHRkIHRpdGxlPSLtjIDrqoUiPk5DPC90ZD48dGQ+Ny04LTE8L3RkPjx0ZD42LTEwLTA8L3RkPjx0ZD43LTktMDwvdGQ+PHRkPjgtOC0wPC90ZD48dGQ+4pagPC90ZD48dGQ+MTAtNi0wPC90ZD48dGQ+OS03LTA8L3RkPjx0ZD42LTktMTwvdGQ+PHRkPjktNy0wPC90ZD48dGQ+MTEtNS0wPC90ZD48dGQgdGl0bGU9Iu2VqeqzhCI+NzMtNjktMjwvdGQ+PC90cj48dHI+PHRkIHRpdGxlPSLtjIDrqoUiPktUPC90ZD48dGQ+OS03LTA8L3RkPjx0ZD43LTktMDwvdGQ+PHRkPjYtMTAtMDwvdGQ+PHRkPjMtMTMtMDwvdGQ+PHRkPjYtMTAtMDwvdGQ+PHRkPuKWoDwvdGQ+PHRkPjEyLTQtMDwvdGQ+PHRkPjktNy0wPC90ZD48dGQ+OC04LTA8L3RkPjx0ZD4xMS0zLTI8L3RkPjx0ZCB0aXRsZT0i7ZWp6rOEIj43MS03MS0yPC90ZD48L3RyPjx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+S0lBPC90ZD48dGQ+My0xMy0wPC90ZD48dGQ+NS0xMC0xPC90ZD48dGQ+OC03LTE8L3RkPjx0ZD42LTEwLTA8L3RkPjx0ZD43LTktMDwvdGQ+PHRkPjQtMTItMDwvdGQ+PHRkPuKWoDwvdGQ+PHRkPjgtOC0wPC90ZD48dGQ+MTItNC0wPC90ZD48dGQ+OS03LTA8L3RkPjx0ZCB0aXRsZT0i7ZWp6rOEIj42Mi04MC0yPC90ZD48L3RyPjx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+7IK87ISxPC90ZD48dGQ+My0xMy0wPC90ZD48dGQ+Ni0xMC0wPC90ZD48dGQ+NC0xMi0wPC90ZD48dGQ+Ni0xMC0wPC90ZD48dGQ+OS02LTE8L3RkPjx0ZD43LTktMDwvdGQ+PHRkPjgtOC0wPC90ZD48dGQ+4pagPC90ZD48dGQ+MTAtNi0wPC90ZD48dGQ+Ny05LTA8L3RkPjx0ZCB0aXRsZT0i7ZWp6rOEIj42MC04My0xPC90ZD48L3RyPjx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+7ZWc7ZmUPC90ZD48dGQ+Ni0xMC0wPC90ZD48dGQ+OC04LTA8L3RkPjx0ZD40LTEyLTA8L3RkPjx0ZD43LTktMDwvdGQ+PHRkPjctOS0wPC90ZD48dGQ+OC04LTA8L3RkPjx0ZD40LTEyLTA8L3RkPjx0ZD42LTEwLTA8L3RkPjx0ZD7ilqA8L3RkPjx0ZD44LTgtMDwvdGQ+PHRkIHRpdGxlPSLtlanqs4QiPjU4LTg2LTA8L3RkPjwvdHI+PHRyPjx0ZCB0aXRsZT0i7YyA66qFIj7roa/rjbA8L3RkPjx0ZD41LTExLTA8L3RkPjx0ZD4zLTEzLTA8L3RkPjx0ZD4zLTEzLTA8L3RkPjx0ZD41LTEwLTE8L3RkPjx0ZD41LTExLTA8L3RkPjx0ZD4zLTExLTI8L3RkPjx0ZD43LTktMDwvdGQ+PHRkPjktNy0wPC90ZD48dGQ+OC04LTA8L3RkPjx0ZD7ilqA8L3RkPjx0ZCB0aXRsZT0i7ZWp6rOEIj40OC05My0zPC90ZD48L3RyPmRkNZBRZBVpLFaj6zBtKdb4yWi8FfPsZ6Zo1LK5sqkp2ak=',
        '__EVENTVALIDATION' => '/wEdAC/+fmtTwxgWWc9A14jZmtLhFp7a/Svk45RiYA1mxXjsDLEtoxrbGT4lwJcpy7TNYpJM8LQsKXcRVrn3pV13kTREEl5Iri3zsPwSUPLnZZDirn/6XtO6FBkwYpvvQnvF0tIilwXapBl+EpROB0fFw6PA+G/yY18rLQyjpZIW9mI1Rp53+gA9UQJon9Y0KkhIQwGRHIdiZW8lx0j/4Tf4hL7QaAYXtsVVA8KoSuR6ZxKOlio+jP+oxBlkwFnJujqpO+UUSzFGPQLI1yc3PZmUKbwba1YfL/u/owf85e3CM0dOsqCLAWnnm8aocTdbmYWwgU/FgczXoEvEz6JI4ViCYg1rlRr8G8epzRCZ0qzlzJGwpcMBnAaaXc3mu+LhVbtCqC/BJCH7VNSgHg600Smto72fMpyZUZ/eKsC97S8ox0jKGIpEvwRCyBMiDR27xO/1A/xJuoHdLbjJlH+s/bCAweVBgkDtRRX/2gI405n4HwgQrDTRxCTbLNOBHRsIkY8l2AhhqBAUMmCRzIrInkAVHsK6h5wJ82NdZiX5ID5/nPCllPtR6kc4ZSoDgo5rEzWwGpWm+KT+eJaWj7yYwv/RBphJXfQR8uMdoxZvIDpKQ/JDVsrzpk57POfZEyzshdBpheRcxDDLSfxz3bgXBI1I8ZyytDMlvHeD1eYgSYmKSUfk/pDqEGHBpVzMoLG5An+h9kJSf7Na/Y4UR/Rnc3LBsZyTvnGTcHbZgyAzbUBLJO+u53bRNlFGQ4DDbuMdFcPKU41NI7mtCr0rzv4t3ULFFJEFV/qimP+ttmOzV/xJUSNViQkcue2s2gA22eX9/4pfT/wy55t7LFI3TLkVGh5BlzvrNNzyM1atMEeJhb8sA01KzPBX4qnL3wdayqwaBRFwd44MBIoOvLRL/QomPcAL2DnkmDUtWqM8n9hxdBpp3K+03R7Q6lB+HFHkWZTaN8Qeemq50nOXRZ/xR9alWCUgh5QX0+3SNFh3Hpdaa49BEvunoCgrfMLR5i2vqlBFhBkkywPuDvK+um+g7nXIBR/E9fuQ' 
        );        

        try{
            $url = 'https://www.koreabaseball.com/TeamRank/TeamRank.aspx';
            
            $get_curl = $this->kbo_curl($url, $data);
            preg_match("/<option[^>]*selected=\"selected\" value=[\"']?([^>\"']+)[\"']?[^>]*>/", $get_curl, $res_match) ;

            $res['kbo_main']['config']['season'] = $res_match[1];
            $res['kbo_main']['config']['series'] = $series == 0 ? '정규시즌' : '시범경기';
            $res['kbo_main']['contents'] = $this->get_curl_arr($get_curl);             

            return $res;
        } catch (\Exception $e) {
            return null;
        }              
    }
    public function futures_rank($season)
    {
        try{
            $res['north'] = $this->_futures_north_rank($season);
            $res['south'] = $this->_futures_south_rank($season);

            return $res;
        } catch (\Exception $e) {
            return null;
        }        
    }
    private function _futures_north_rank($season)
    {        

        $data = $season == null ? null :['ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ScriptManager' => 'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$udpRecord|ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear',
          '__EVENTTARGET' => 'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear',
          '__VIEWSTATEGENERATOR' => '12FA3579',
          'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear' => $season,
          'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchYear' => '2018',
        'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchDate' => '20191231',
          '__ASYNCPOST' => true,
          '__VIEWSTATE' => '/wEPDwULLTE1MDU0MzQ0MjQPZBYCZg9kFgJmD2QWAmYPZBYCAgEPZBYCZg9kFgICAQ9kFgICAQ9kFgICBw9kFgJmD2QWEGYPDxYCHgdWaXNpYmxlaGRkAgEPDxYCHgRUZXh0BQcyMDE564WEZGQCAg8PFgIfAGhkZAIDDw8WAh8AaGRkAgQPEGQQFQoHMjAxOeuFhAcyMDE464WEBzIwMTfrhYQHMjAxNuuFhAcyMDE164WEBzIwMTTrhYQHMjAxM+uFhAcyMDEy64WEBzIwMTHrhYQHMjAxMOuFhBUKBDIwMTkEMjAxOAQyMDE3BDIwMTYEMjAxNQQyMDE0BDIwMTMEMjAxMgQyMDExBDIwMTAUKwMKZ2dnZ2dnZ2dnZxYBZmQCBQ8WAh4LXyFJdGVtQ291bnQCBRYKZg9kFgJmDxUSATEG7ZWc7ZmUAjkwAjUxAjMxATgFMC42MjIBMAE2ATMBMQQy7Iq5AjI2AjE1ATMCMjUCMTYBNWQCAQ9kFgJmDxUSATICTEcCODgCMzkCMzYCMTMFMC41MjADOC41ATQBNAEyBDLsirkCMjICMTQBNwIxNwIyMgE2ZAICD2QWAmYPFRIBMwbrkZDsgrACODgCMzcCMzgCMTMFMC40OTMEMTAuNQE2ATIBMgQx7Iq5AjIzAjE2ATYCMTQCMjIBN2QCAw9kFgJmDxUSATQG6rOg7JaRAjkxAjQxAjQzATcFMC40ODgCMTEBNQE1ATAEMuyKuQIyMwIyMQEyAjE4AjIyATVkAgQPZBYCZg8VEgE1AlNLAjkwAjM4AjQ1ATcFMC40NTgEMTMuNQEyATcBMQQx7YyoAjIxAjIxATQCMTcCMjQBM2QCBg8WAh8BBboCPHRyPjx0aCBzY29wZT0iY29sIj7tjIDrqoU8L3RoPjx0aCBzY29wZT0iY29sIj5MRzwvdGg+PHRoIHNjb3BlPSJjb2wiPuuRkOyCsDwvdGg+PHRoIHNjb3BlPSJjb2wiPuqzoOyWkTwvdGg+PHRoIHNjb3BlPSJjb2wiPlNLPC90aD48dGggc2NvcGU9ImNvbCI+7ZWc7ZmUPC90aD48dGggc2NvcGU9ImNvbCI+7IOB66y0PC90aD48dGggc2NvcGU9ImNvbCI+S1Q8L3RoPjx0aCBzY29wZT0iY29sIj5LSUE8L3RoPjx0aCBzY29wZT0iY29sIj7roa/rjbA8L3RoPjx0aCBzY29wZT0iY29sIj7sgrzshLE8L3RoPjx0aCBzY29wZT0iY29sIj5OQzwvdGg+PC90cj5kAgcPFgIfAQW3Bzx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+TEc8L3RkPjx0ZD7ilqA8L3RkPjx0ZD42LTMtMjwvdGQ+PHRkPjktNS0wPC90ZD48dGQ+NS02LTI8L3RkPjx0ZD42LTUtMzwvdGQ+PHRkPjItMy0xPC90ZD48dGQ+My0yLTE8L3RkPjx0ZD40LTEtMTwvdGQ+PHRkPjEtNS0wPC90ZD48dGQ+MC01LTE8L3RkPjx0ZD4zLTEtMjwvdGQ+PC90cj48dHI+PHRkIHRpdGxlPSLtjIDrqoUiPuuRkOyCsDwvdGQ+PHRkPjMtNi0yPC90ZD48dGQ+4pagPC90ZD48dGQ+OC00LTI8L3RkPjx0ZD4xMC00LTA8L3RkPjx0ZD4yLTExLTE8L3RkPjx0ZD4yLTMtMDwvdGQ+PHRkPjItMy0xPC90ZD48dGQ+MC0zLTM8L3RkPjx0ZD4yLTItMjwvdGQ+PHRkPjQtMS0xPC90ZD48dGQ+NC0xLTE8L3RkPjwvdHI+PHRyPjx0ZCB0aXRsZT0i7YyA66qFIj7qs6DslpE8L3RkPjx0ZD41LTktMDwvdGQ+PHRkPjQtOC0yPC90ZD48dGQ+4pagPC90ZD48dGQ+Ny01LTI8L3RkPjx0ZD4zLTktMTwvdGQ+PHRkPjUtMS0wPC90ZD48dGQ+Mi00LTA8L3RkPjx0ZD4yLTMtMTwvdGQ+PHRkPjYtMC0wPC90ZD48dGQ+NC0yLTA8L3RkPjx0ZD4zLTItMTwvdGQ+PC90cj48dHI+PHRkIHRpdGxlPSLtjIDrqoUiPlNLPC90ZD48dGQ+Ni01LTI8L3RkPjx0ZD40LTEwLTA8L3RkPjx0ZD41LTctMjwvdGQ+PHRkPuKWoDwvdGQ+PHRkPjYtOC0wPC90ZD48dGQ+MS0yLTI8L3RkPjx0ZD4zLTMtMDwvdGQ+PHRkPjQtMS0xPC90ZD48dGQ+Mi00LTA8L3RkPjx0ZD4zLTMtMDwvdGQ+PHRkPjQtMi0wPC90ZD48L3RyPjx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+7ZWc7ZmUPC90ZD48dGQ+NS02LTM8L3RkPjx0ZD4xMS0yLTE8L3RkPjx0ZD45LTMtMTwvdGQ+PHRkPjgtNi0wPC90ZD48dGQ+4pagPC90ZD48dGQ+MC00LTE8L3RkPjx0ZD40LTItMDwvdGQ+PHRkPjItNC0wPC90ZD48dGQ+Mi00LTA8L3RkPjx0ZD42LTAtMDwvdGQ+PHRkPjQtMC0yPC90ZD48L3RyPmRkrJVUvpZe3i7lJamIvnM4M4iR8N2rqtiPWB3UC8QHLFE=',          
          '__EVENTVALIDATION' => '/wEdAA/zPC64kbMYcboXyNl3RBw4Fp7a/Svk45RiYA1mxXjsDLEtoxrbGT4lwJcpy7TNYpJM8LQsKXcRVrn3pV13kTREEl5Iri3zsPwSUPLnZZDirn/6XtO6FBkwYpvvQnvF0tIilwXapBl+EpROB0fFw6PA+G/yY18rLQyjpZIW9mI1Rp53+gA9UQJon9Y0KkhIQwGRHIdiZW8lx0j/4Tf4hL7QaAYXtsVVA8KoSuR6ZxKOlio+jP+oxBlkwFnJujqpO+WYNS1aozyf2HF0Gmncr7TdHtDqUH4cUeRZlNo3xB56atPt0jRYdx6XWmuPQRL7p6D1F62vv/eqlOy1g0EOmneO0k5C6nSX2nSCEe/jtw5rFw=='
        ];

        $url = 'https://www.koreabaseball.com/Futures/TeamRank/North.aspx';
        
        $get_curl = $this->kbo_curl($url, $data);

        preg_match("/<option[^>]*selected=\"selected\" value=[\"']?([^>\"']+)[\"']?[^>]*>/", $get_curl, $res_match) ;

        $res['config']['season'] = $res_match[1];
        $res['contents'] = $this->get_curl_arr($get_curl);

        return $res;
    }
    private function _futures_south_rank($season)
    {        
        $data = $season == null ? null :['ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ScriptManager' => 'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$udpRecord|ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear',
          '__EVENTTARGET' => 'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear',
          '__VIEWSTATEGENERATOR' => '5B95B075',
          'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$ddlYear' => $season,
          'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchYear' => '2018',
        'ctl00$ctl00$ctl00$cphContents$cphContents$cphContents$hfSearchDate' => '20191231',
          '__ASYNCPOST' => true,
          '__VIEWSTATE' => '/wEPDwULLTE1MDU0MzQ0MjQPZBYCZg9kFgJmD2QWAmYPZBYCAgEPZBYCZg9kFgICAQ9kFgICAQ9kFgICBw9kFgJmD2QWEGYPDxYCHgdWaXNpYmxlaGRkAgEPDxYCHgRUZXh0BQcyMDE564WEZGQCAg8PFgIfAGhkZAIDDw8WAh8AaGRkAgQPEGQQFQoHMjAxOeuFhAcyMDE464WEBzIwMTfrhYQHMjAxNuuFhAcyMDE164WEBzIwMTTrhYQHMjAxM+uFhAcyMDEy64WEBzIwMTHrhYQHMjAxMOuFhBUKBDIwMTkEMjAxOAQyMDE3BDIwMTYEMjAxNQQyMDE0BDIwMTMEMjAxMgQyMDExBDIwMTAUKwMKZ2dnZ2dnZ2dnZxYBZmQCBQ8WAh4LXyFJdGVtQ291bnQCBhYMZg9kFgJmDxUSATEG7IOB66y0Ajk2AjU4AjI5ATkFMC42NjcBMAE2ATMBMQQz7Iq5AjMyAjEzATICMjYCMTYBN2QCAQ9kFgJmDxUSATICS1QCOTgCNDcCNDQBNwUwLjUxNgIxMwEyATYBMgQz7YyoAjIyAjI1ATICMjUCMTkBNWQCAg9kFgJmDxUSATMDS0lBAjk1AjQwAjQyAjEzBTAuNDg4BDE1LjUBMwE2ATEEMeyKuQIxNQIyMwIxMAIyNQIxOQEzZAIDD2QWAmYPFRIBNAbroa/rjbACOTgCNDMCNDYBOQUwLjQ4MwIxNgE0ATUBMQQy7YyoAjE5AjI0ATUCMjQCMjIBNGQCBA9kFgJmDxUSATUG7IK87ISxAjk5AjQwAjU0ATUFMC40MjYEMjEuNQE4ATIBMAQ07Iq5AjIxAjI2ATICMTkCMjgBM2QCBQ9kFgJmDxUSATYCTkMCOTUCMjgCNTQCMTMFMC4zNDEEMjcuNQExATgBMQQx7Iq5AjExAjI5ATkCMTcCMjUBNGQCBg8WAh8BBboCPHRyPjx0aCBzY29wZT0iY29sIj7tjIDrqoU8L3RoPjx0aCBzY29wZT0iY29sIj5MRzwvdGg+PHRoIHNjb3BlPSJjb2wiPuuRkOyCsDwvdGg+PHRoIHNjb3BlPSJjb2wiPuqzoOyWkTwvdGg+PHRoIHNjb3BlPSJjb2wiPlNLPC90aD48dGggc2NvcGU9ImNvbCI+7ZWc7ZmUPC90aD48dGggc2NvcGU9ImNvbCI+7IOB66y0PC90aD48dGggc2NvcGU9ImNvbCI+S1Q8L3RoPjx0aCBzY29wZT0iY29sIj5LSUE8L3RoPjx0aCBzY29wZT0iY29sIj7roa/rjbA8L3RoPjx0aCBzY29wZT0iY29sIj7sgrzshLE8L3RoPjx0aCBzY29wZT0iY29sIj5OQzwvdGg+PC90cj5kAgcPFgIfAQXxCDx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+7IOB66y0PC90ZD48dGQ+My0yLTE8L3RkPjx0ZD4zLTItMDwvdGQ+PHRkPjEtNS0wPC90ZD48dGQ+Mi0xLTI8L3RkPjx0ZD40LTAtMTwvdGQ+PHRkPuKWoDwvdGQ+PHRkPjgtNi0wPC90ZD48dGQ+MTItMC0yPC90ZD48dGQ+Ny01LTI8L3RkPjx0ZD45LTUtMDwvdGQ+PHRkPjktMy0xPC90ZD48L3RyPjx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+S1Q8L3RkPjx0ZD4yLTMtMTwvdGQ+PHRkPjMtMi0xPC90ZD48dGQ+NC0yLTA8L3RkPjx0ZD4zLTMtMDwvdGQ+PHRkPjItNC0wPC90ZD48dGQ+Ni04LTA8L3RkPjx0ZD7ilqA8L3RkPjx0ZD41LTYtMjwvdGQ+PHRkPjYtNi0xPC90ZD48dGQ+Ny02LTE8L3RkPjx0ZD45LTQtMTwvdGQ+PC90cj48dHI+PHRkIHRpdGxlPSLtjIDrqoUiPktJQTwvdGQ+PHRkPjEtNC0xPC90ZD48dGQ+My0wLTM8L3RkPjx0ZD4zLTItMTwvdGQ+PHRkPjEtNC0xPC90ZD48dGQ+NC0yLTA8L3RkPjx0ZD4wLTEyLTI8L3RkPjx0ZD42LTUtMjwvdGQ+PHRkPuKWoDwvdGQ+PHRkPjctNS0xPC90ZD48dGQ+OS01LTA8L3RkPjx0ZD42LTMtMjwvdGQ+PC90cj48dHI+PHRkIHRpdGxlPSLtjIDrqoUiPuuhr+uNsDwvdGQ+PHRkPjUtMS0wPC90ZD48dGQ+Mi0yLTI8L3RkPjx0ZD4wLTYtMDwvdGQ+PHRkPjQtMi0wPC90ZD48dGQ+NC0yLTA8L3RkPjx0ZD41LTctMjwvdGQ+PHRkPjYtNi0xPC90ZD48dGQ+NS03LTE8L3RkPjx0ZD7ilqA8L3RkPjx0ZD42LTctMTwvdGQ+PHRkPjYtNi0yPC90ZD48L3RyPjx0cj48dGQgdGl0bGU9Iu2MgOuqhSI+7IK87ISxPC90ZD48dGQ+NS0wLTE8L3RkPjx0ZD4xLTQtMTwvdGQ+PHRkPjItNC0wPC90ZD48dGQ+My0zLTA8L3RkPjx0ZD4wLTYtMDwvdGQ+PHRkPjUtOS0wPC90ZD48dGQ+Ni03LTE8L3RkPjx0ZD41LTktMDwvdGQ+PHRkPjctNi0xPC90ZD48dGQ+4pagPC90ZD48dGQ+Ni02LTE8L3RkPjwvdHI+PHRyPjx0ZCB0aXRsZT0i7YyA66qFIj5OQzwvdGQ+PHRkPjEtMy0yPC90ZD48dGQ+MS00LTE8L3RkPjx0ZD4yLTMtMTwvdGQ+PHRkPjItNC0wPC90ZD48dGQ+MC00LTI8L3RkPjx0ZD4zLTktMTwvdGQ+PHRkPjQtOS0xPC90ZD48dGQ+My02LTI8L3RkPjx0ZD42LTYtMjwvdGQ+PHRkPjYtNi0xPC90ZD48dGQ+4pagPC90ZD48L3RyPmRk/bdAyqT/3A9TOoVDVUbQwD/8pBp2G4haceuLa3JXKqU=',          
          '__EVENTVALIDATION' => '/wEdAA/mu+Z4Hb/I//MeINHAb1x4Fp7a/Svk45RiYA1mxXjsDLEtoxrbGT4lwJcpy7TNYpJM8LQsKXcRVrn3pV13kTREEl5Iri3zsPwSUPLnZZDirn/6XtO6FBkwYpvvQnvF0tIilwXapBl+EpROB0fFw6PA+G/yY18rLQyjpZIW9mI1Rp53+gA9UQJon9Y0KkhIQwGRHIdiZW8lx0j/4Tf4hL7QaAYXtsVVA8KoSuR6ZxKOlio+jP+oxBlkwFnJujqpO+WYNS1aozyf2HF0Gmncr7TdHtDqUH4cUeRZlNo3xB56atPt0jRYdx6XWmuPQRL7p6D5DytSEjW2tg0yZPb4pZKOodD5mIzVSbNjy+w8doms1Q=='
        ];

        $url = 'https://www.koreabaseball.com/Futures/TeamRank/South.aspx';
        
        $get_curl = $this->kbo_curl($url, $data);

        preg_match("/<option[^>]*selected=\"selected\" value=[\"']?([^>\"']+)[\"']?[^>]*>/", $get_curl, $res_match) ;

        $res['config']['season'] = $res_match[1];
        $res['contents'] = $this->get_curl_arr($get_curl); ;

        return $res;
    }
    /**
     * 메인 순위표
     * @return array
     */
   
    public function kboStanding()
    {
        $url = 'https://www.koreabaseball.com/ws/Main.asmx/GetTeamRank';
        $res = parent::curl($url);
        $json = json_decode($res, true);

        $regular_League = $this->standing_func($json['rows']);

        $url = 'https://www.koreabaseball.com/ws/Futures.asmx/GetTeamRank';
        $res = parent::curl($url);
        $json = json_decode($res, true);

        $northJson = json_decode($json['tableNorth'], true);
        $southJson = json_decode($json['tableSouth'], true);

        $north_league = $this->standing_func($northJson['rows']);
        $south_league = $this->standing_func($southJson['rows']);


        $arr_append = array('regular' => $regular_League, 'futures' => array('north' => $north_league, 'south' => $south_league));

        return $arr_append;
    }

    private function standing_func($data)
    {
        $standing_idx = array('rank', 'name', 'game', 'W', 'L', 'D', 'odds', 'difference', 'continuity');

        $_arr = array();
        foreach ($data as $row) {
            foreach ($row['row'] as $row2) {
                $_arr[] = $row2['Text'];
            }
        }
        $_arr = array_chunk($_arr, 9);

        $arrStanding = array();
        foreach ($_arr as $row) {
            $_arr = array();
            for ($i = 0; $i < count($row); $i++) {
                if ($i == 1) {
                    $_arr[$standing_idx[$i]] = strip_tags($row[$i]);
                } else {
                    $_arr[$standing_idx[$i]] = $row[$i];
                }
            }
            $arrStanding[] = $_arr;
        }
        return $arrStanding;
    }

    public function mlbStanding()
    {
        $url = 'https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=2019&standingsTypes=regularSeason';
        $res = parent::curl($url);
        $json = json_decode($res, true);

//        var_dump(count($json["records"]));

        foreach ($json['records'] as $row) {
            var_dump($row);
            echo '<hr>';
        }
        exit;
    }
}
