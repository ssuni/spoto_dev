<?php namespace App\Models;

use CodeIgniter\Model;
use App\Libraries\Libraries_lb;

class Register_m extends Model
{
    protected $table = 'users';
    protected $primaryKey = "idx";
    protected $allowedFields = ['id', 'name', 'pass', 'second_pass', 'files_folder', 'profile_img', 'age', 'gender', 'login_ip', 'signup_ip', 'login_date', 'signup_date', 'member_level', 'member_type', 'point', 'admin', 'sns_type'];
    protected $returnType = 'array';

    protected $db;
    protected $request;
    protected $libraries_lb;
    protected $session;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->request = \Config\Services::request();
        $this->libraries_lb = new Libraries_lb();
        $this->session = \Config\Services::session();

        helper('text');
    }

    public function test()
    {
        $sql = "SELECT COLUMN_NAME, COLUMN_COMMENT FROM information_schema.COLUMNS WHERE `TABLE_NAME` = 'login_log'; ";
        $test = $this->db->query($sql)->getResult();
        var_dump($test);
        //echo var_dump($this->db->getFieldData('users'));
    }
    public function selectRow($data, $whereName = 'idx')
    {
        $query = $this->db->query('SELECT * FROM users WHERE '.$whereName.' ="' . $data . '"');
        $result = $query->getResultArray();
        return empty($result) ? null : $result[0];
    }
    public function updateRow($data)
    {
        $this->update($data['idx'], $data);
    }
    public function signupInsert($data)
    {
        $this->insert($data);
    }
}
