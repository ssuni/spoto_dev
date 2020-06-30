<?php

namespace App\Libraries;

//use App\Libraries\Config_lb;

class Baseball_lb extends Config_lb
{
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
        $json = json_decode($res , true);

//        var_dump(count($json["records"]));

        foreach ($json['records'] as $row){
            var_dump($row);
            echo '<hr>';
        }
      exit;
    }
}