<div id="log_view">
    <div class="log_row">
        <div class="log_data">No</div>
        <div class="log_data">카테고리</div>
        <div class="log_data">제목</div>
        <div class="log_data">글쓴이</div>
        <div class="log_data">작성시각</div>
        <div class="log_data">조회수</div>
    </div>
    <?php foreach ($data as $key) : ?> 
        <div class="log_row">
            <div class="log_data"><?=$key['idx']?></div>
            <div class="log_data"><?=$key['category']?></div>
            <div class="log_data"><a href="/articles/boardContents?idx=<?=$key['idx']?>"><?=$key['title']?></a></div>
            <div class="log_data"><?=$key['writer']?></div>
            <div class="log_data"><?=$key['posting_date']?></div>
            <div class="log_data"><?=$key['views']?></div>   
        </div>
    <?php endforeach; ?>
</div>
<br/>
<form action="" method="GET">
    <input type="text" name="search">
    <input type="submit" value="검색">
    <input type="button"  onClick="location.href='http://spoto.com/articles/boardInsert'" value="글작성">
</form>



<?= $pager->links() ?>