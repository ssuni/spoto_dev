<?php


namespace App\Controllers;


class Team extends BaseController
{
    public function index()
    {
    }

    public function detail($team)
    {
        $client = \Config\Services::curlrequest();

        $response = $client->request('GET', 'http://info.nowgoal.com/jsData/teamInfo/teamDetail/tdl'.$team.'_en.js');
        $res = $response->getBody();
        $pattern = array(
            'var teamDetail = ', 'var rearguard = ','var vanguard = ','var goalkeeper = ','var midfielder = ','var coach = '
        ,'var lineupDetail=','var leagueData = ',' var cupData = ','var countSum = ', 'var teamCount = '
        ,'var teamHonor = ','var teamCharacter = ', 'var teamLastUpdateTime = '
        );
        $tmp = explode("\n", $res);
        $stats = array();
        $i=0;
        foreach($tmp as $row)
        {
            if(isset($pattern[$i])) {
                $res = str_replace($pattern[$i],'',$row);

                $res = substr($res,0,(strlen($res)-1));
                $json = str_replace("'",'"',$res);

                if($i == 0){
                    $bom = pack('H*','EFBBBF');
                    $json = preg_replace("/^$bom/", '', $json);
                }
                $arr= json_decode($json, true);

//                print_r($arr);
//                echo "<hr>";
                $i++;
            }
            $stats[] = $arr;
        }

        $data['stats'] = $stats;

        /*
        foreach($tmp as $row)
        {
            print_r($row);
            echo "<hr>";
        }
        */
        echo view('inc/header_v');
        return view('teamstats_v',$data);


        exit;
        $res = "var teamDetail = [1268,'','Monterrey','Monterrey','images/20130923104421.jpg','蒙特瑞','蒙特瑞','Monterrey','TECNOLOGICO','TECNOLOGICO','Tecnológico','32662','1945','http://www.rayados.com','','Club de Fútbol Monterrey Av. Madero #3542 esp. Gonzálitos Col. Mitrs Sur Monterrey, Nuevo León Mexico'];";
        $res = str_replace("var teamDetail = ",'',$res);
        $res = substr($res,0,(strlen($res)-1));
        $json = str_replace("'",'"',$res);
        $arr = json_decode($json, true);
        print_r($arr);

        exit;
//        $res = "var rearguard = [['846725','98','','','Michel Humberto Lopez Elenes',0],['821104','','','','Valent&#237;n Arredondo Castro',0],['865532','','','','Gerardo Zavala Gallardo',0]];";
//
//
//        $_arr = explode('=',$res);
//        $_arr = str_replace(';','',$_arr[1]);
//        var_dump(json_decode(json_encode($_arr),true));
        //var rearguard = [['890522','3','','','Cesar Jasib Montes Castro',0],['12435','4','','','Nicolas Gabriel Sanchez',0],['866658','6','','','Edson Guti&#233;rrez',0],['12221','11','','','Leonel Jesus Vangioni',0],['15425','15','','','Jose Maria Basanta Pavone',0],['01579','19','','','Miguel Arturo Layun Prado',0],['861118','23','','','Johan Vasquez',0],['887036','33','','','John Stefan Medina Ramirez',0]];
        preg_match_all('/(var\s?rearguard\s?=\s?(?(?=\[\])(?:\[(.?)\])|(?:\[\[(.+?)\]\])))/m', $res , $json);

        print_r($json[3][0]);

        echo '<hr>';


//        var_dump($json[3][0]);

        $_arr = explode('],[',$json[3][0]);

        print_r($_arr);

//        foreach ($json[1] as $row)
//        {
//            echo $row;
//            echo '<br>';
//        }
//        echo '<hr>';

    }
}
