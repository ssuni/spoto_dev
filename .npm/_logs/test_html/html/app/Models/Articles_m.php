<?php namespace App\Models;

use CodeIgniter\Model;

class Articles_m extends Model
{
    protected $table = 'board';
    protected $primaryKey = "idx" ;
    protected $allowedFields = array() ;

    public function __construct($tableName = 'board')
    {
        $this->db = \Config\Database::connect();
        $this->table = $tableName;
    }
    private function columnSet()
    {
        $columnList = $this->db->getFieldNames($this->table);
        foreach ($columnList as $column) {
            if ($column != 'idx' && $column != 'login_date') {
                array_push($this->allowedFields, $column);
            }
        }
    }
    public function pageData()
    {
        return [
            'data' => $this->asArray()->orderBy('idx', 'DESC')->paginate(10),
            'pager' => $this->pager
        ];
    }
    public function selectData($get, $whereName = 'idx')
    {
        $data = $this->asArray()->where($whereName, $get)->findAll();
        return $data;
    }
    public function insertRow($data, $tableName)
    {
        $this->table = $tableName;

        !empty($data['parent_idx']) ? $data['comment_depth']  = (Int)$data['comment_depth'] + 1 : null ;
        $this->columnSet();
        $this->insert($data);
    }
    public function updateRow($data, $tableName)
    {
        $this->table($tableName)->replace($data);
    }
    public function deleteRow($data, $tableName, $column = null)
    {
        if ($column == null) {
            $sql = "DELETE FROM " . $tableName . " WHERE idx='" . $data['idx'] . "'";
        } else {
            $sql = "DELETE FROM " . $tableName . " WHERE ".$column."idx='" . $data['idx'] . "'";
        }
        $this->db->query($sql);
    }
    public function whereIdx($tableName, $idx = null)
    {
        $this->table = $tableName;
        return $this->asArray()->find($idx);
    }
    public function contentsView($get, $type = null)
    {
        if ($type == null) {
            $this->db->query('UPDATE board SET views=views+1 WHERE idx="' . $get['idx'] .'"');
            $data['board'] = $this->asArray()->find($get['idx']);
        }
        return $data;
    }
    public function beforeView($get)
    {
        $sql = "SELECT * FROM board WHERE idx < '". $get['idx'] ."' order by idx desc limit 1" ;
        $data['board'] = $this->db->query($sql)->getResultArray();
        return $data;
    }
    public function afterView($get)
    {
        $sql = "SELECT * FROM board WHERE idx > '". $get['idx'] ."' limit 1" ;
        $data['board'] = $this->db->query($sql)->getResultArray();
        return $data;
    }
}
