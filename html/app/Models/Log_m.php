<?php namespace App\Models;

use CodeIgniter\Model;

class Log_m extends Model
{
    protected $table ;
    protected $primaryKey = "idx" ;
    protected $allowedFields = array() ;
    protected $returnType = 'object';

    protected $db;
    protected $request;

    public function __construct($tableName)
    {
        $this->db = \Config\Database::connect();
        $this->request = \Config\Services::request();
        $this->table = $tableName;
        $this->columnSet();
    }
    public function logInsert($data)
    {
        $data['useragent'] = $this->request->getUserAgent()->getBrowser();
        $data['login_ip'] = $this->request->getIPAddress();
        $this->insert($data);
    }
    public function logPagination()
    {
        $data = [
            'log' => $this->asArray()->orderBy('idx', 'DESC')->paginate(10),
            'pager' => $this->pager,
            'comment' => $this->columnCommentSet()
        ];
        return $data;
    }
    //table에 column들을 $this->allowedFields에 저장해줍니다.
    private function columnSet()
    {
        $columnList = $this->db->getFieldNames($this->table);
        foreach ($columnList as $column) {
            if ($column != 'idx' && $column != 'login_date') {
                array_push($this->allowedFields, $column);
            }
        }
    }
    //column에 comment값을 가져옵니다.
    private function columnCommentSet()
    {
        $sql = "SELECT COLUMN_NAME, COLUMN_COMMENT FROM information_schema.COLUMNS WHERE `TABLE_NAME` = '" . $this->table . "'";
        $comments = $this->db->query($sql)->getResult();
        foreach ($comments as $key) {
            $result[] = $key->COLUMN_COMMENT;
        }
        return $result;
    }
}
