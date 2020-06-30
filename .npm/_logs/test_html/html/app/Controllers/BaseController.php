<?php

namespace App\Controllers;

/**
 * Class BaseController
 *
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 * Extend this class in any new controllers:
 *     class Home extends BaseController
 *
 * For security be sure to declare any new methods as protected or private.
 *
 * @package CodeIgniter
 */

use CodeIgniter\Controller;
use App\Libraries\Libraries_lb;

class BaseController extends Controller
{

    /**
     * An array of helpers to be loaded automatically upon
     * class instantiation. These helpers will be available
     * to all other controllers that extend BaseController.
     *
     * @var array
     */
    protected $helpers = ['custom'];
    protected $libraries_lb;
    protected $request;
    protected $session;

    /**
     * Constructor.
     */
    public function initController(\CodeIgniter\HTTP\RequestInterface $request, \CodeIgniter\HTTP\ResponseInterface $response, \Psr\Log\LoggerInterface $logger)
    {
        // Do Not Edit This Line
        parent::initController($request, $response, $logger);

        //--------------------------------------------------------------------
        // Preload any models, libraries, etc, here.
        //--------------------------------------------------------------------
        // E.g.:
        // $this->session = \Config\Services::session();
        $this->libraries_lb = new Libraries_lb();
        $this->request = \Config\Services::request();
        $this->session = \Config\Services::session();

//        if($_SERVER['REMOTE_ADDR'] !== '220.75.195.225' && $_SERVER['REMOTE_ADDR'] !== '49.173.15.113' && $_SERVER['REMOTE_ADDR'] !==  '14.53.22.94'){
//            echo 'Working~';
//            die();
//        }
    }

    public function _setJSON($data)
    {
        if ($data == true) {
            $respond = $this->res(200, 'success', $data);
        } elseif ($data == false || empty($data)) {
            $respond = $this->res(404, '데이터가 없습니다.');
        }
        return $this->response->setJSON($respond);
    }

    public function res($code, $message, $data = array())
    {
        switch ($code) {
            case 400 :
                $this->response->setStatusCode(400);
                break;
            case 403 :
                $this->response->setStatusCode(403);
                break;
            case 404 :
                $this->response->setStatusCode(404);
                break;
            case 406 :
                $this->response->setStatusCode(406);
                break;
            case 409 :
                $this->response->setStatusCode(409);
                break;
            case 500 :
                $this->response->setStatusCode(500);
                break;
        }
        $res = array(
            'code' => (int)$code,
            'message' => $message,
            'data' => $data
        );
        return $res;
    }

}
