<div class="boardContents">
    <form action="/articles/boardUpdate" method="POST">
        <?php if (!empty($_SESSION['name']) && $_SESSION['name'] == $board['writer']) : ?>
        <div>
            <input type="button" class="button" onClick="location.href='http://spoto.com/articles/boardUpdate?idx=<?=$board['idx']?>'" value="수정">
            <input type="button"  class="button" onClick="location.href='http://spoto.com/articles/boardDelete?idx=<?=$board['idx']?>'" value="삭제">    
        </div>
        <?php endif; ?>
        <input type="hidden" name="board[idx]" value="<?=$board['idx']?> ">
        <p>제목 : <?=$board['title']?></p>
        <input type="hidden" name="board[title]" value="<?=$board['title']?> ">
        <p>작성자 : <?=$board['writer']?></p>
        <input type="hidden" name="board[writer]" value="<?=$board['writer']?> ">
        <p>작성일 : <?=$board['posting_date']?></p>
        <input type="hidden" name="board[posting_date]" value="<?=$board['posting_date']?> ">
        <p>조회수 : <?=$board['views']?></p>
        <p>내용 </p> 
            <div class="boardMain">
            <?=$board['contents']?>
            </div>
        <input type="hidden" name="board[contents]" value="<?=htmlspecialchars($board['contents'])?> ">
    </form>    
    <div>
        <br/>
        <input type="button"  class="button" onClick="location.href='http://spoto.com/articles/boardContents?idx=<?=$board['idx']?>&type=before'" value="이전글">       
        <input type="button"  class="button" onClick="location.href='http://spoto.com/articles/boardIndex'" value="목록">       
        <input type="button"  class="button" onClick="location.href='http://spoto.com/articles/boardContents?idx=<?=$board['idx']?>&type=after'" value="다음글">    
    </div>
</div> 
<div class="boardComment">
<h3>댓글</h3>
<?php if (!empty($comment)) : ?>
<?php foreach ($comment as $key) : ?>
    <div class="boardCommentList" style="margin-left:<?=(int)$key['comment_depth'] * 40 ?>px;">
         
        <div>
        <?php if ($key['comment_depth'] != 0) : ?>
        <img class="imgIcon" src="/img/arrow_reply.png" alt="">
        <?php endif; ?>

        <p><?=$key['writer']?>
        <?=$key['posting_date']?></p>
        <p><?=$key['comment']?></p>
        <input type="hidden" value="<?=$key['comment_depth']?>">
        </div>
        
        <br/>
        <?php if ($key['comment_depth'] < 2) : ?>
        <div class="reply" >
            <p> 답글 쓰기</p>
            <img class="imgIcon" src="/img/arrow.png">
            <form action="/articles/commentInsert?idx=<?=$key['idx']?>" method="POST" class="replyForm">
                <br/><br/>
                <textarea class="replyEditor" cols="110" rows="5"></textarea>
                <input type="button" class="replySubmit" value="확인">
                <input type="hidden" name="comment[comment]">
                <input type="hidden" name="comment[board_idx]" value="<?=$_GET['idx']?>">
                <input type="hidden" name="comment[parent_idx]" value="<?=$key['idx']?>">
                <input type="hidden" name="comment[comment_depth]" value="<?=$key['comment_depth'] ?>">
                <input type="hidden" name="comment[writer]" value="<?= isset($_SESSION['name']) ? $_SESSION['name'] : null ?>">
                <div class="iconBox">
                    <?php foreach ($icon as $key): ?>
                        <img src="<?= '/img/icon/' . $key?>"  alt="icon">
                    <?php endforeach; ?>
                </div>
            </form>
        </div>        
        <?php endif ; ?>
    </div>
<?php endforeach; ?>
<?php endif; ?>
</div>

<div class="boardComment">
    <form action="/articles/commentInsert?idx=" method="POST" class="commentForm">
        <br/><br/>
        <p>댓글 달기</p>
        <br/>
        <textarea name="comment[comment]" id="" cols="110" rows="5" class="commentEditor"></textarea>
        <input type="button" class="commentSubmit" value="확인">
        <input type="hidden" name="comment[comment]">
        <input type="hidden" name="comment[board_idx]" value="<?= !empty($_GET['idx']) ? $_GET['idx'] : null  ?>">
        <input type="hidden" name="comment[writer]" value="<?= isset($_SESSION['name']) ? $_SESSION['name'] : null?>">
        <input type="hidden" name="comment[comment_depth]" value="0">
        <div class="iconBox">
            <?php foreach ($icon as $key): ?>
                <img src="<?= '/img/icon/' . $key?>"  alt="icon">
            <?php endforeach; ?>
        </div>
    </form>
    
</div>
