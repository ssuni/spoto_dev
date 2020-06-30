
 <form action="/articles/boardUpdate?idx=<?=$board['idx']?>" id="editorForm" method="POST" >
    <p>제목 : <input type="text" name="board[title]" placeholder ="제목을 입력해주세요." value="<?=$board['title']?>"></p>
    <p>내용 : </p>
    <textarea name="board[contents]" id="editor" cols="110" rows="40" class="editor"></textarea>
    <br/>
    <div class="iconBox">
        <?php foreach ($icon as $key): ?>
        <img src="<?= '/img/icon/' . $key?>"  alt="icon">
        <?php endforeach; ?>
    </div> 
    <p><input type="button" id="filesSubmit" value="글수정"></p>
    <input type="hidden" name="board[idx]" value="<?=$board['idx']?>">
    <input type="hidden" name="board[category]" value="<?=$board['category']?>"">
    <input type="hidden" name="board[contents]" value="<?=(htmlspecialchars($board['contents']))?>">
    <input type="hidden" name="board[files_folder]" value="<?=$board['files_folder']?>">
    <input type="hidden" name="board[writer]" value="<?=$_SESSION['name']?>">
</form>



<div class="dim-layer">   
    <div class="dimBg"></div>
    <div id="layer2" class="pop-layer">
        <div class="pop-container">
            <div class="pop-conts">
                <!--content //-->
                <p class="ctxt mb20">
                    <input type="file" class="inputFile" name="file[]" multiple accept=".gif, .jpg "><br>
                </p>
                <img src="" alt="">
                <br/>
                <div class="fileInsertImg">
                </div>
                <div class="btn-r">
                    <a href="#" class="btn-layerClose btn-layerSubmit imgSubmit">Submit</a>
                    <a href="#" class="btn-layerClose"> Close </a>
                </div>
                <!--// content-->
            </div>
        </div>
    </div>
</div>

