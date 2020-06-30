

<div class="sclass"></div>
<br/>

<button class="gameSchedule">경기정보 가져오기</button>

    <!-- 팝업뜰때 배경 -->
<div id="mask"></div>

<!--Popup Start -->
<div id="layerbox" class="layerpop"
    style="width: 700px; height: 1000px;">
    <article class="layerpop_area">
    <div class="title">경기 결과</div>
    <a href="#" class="layerpop_close"
        id="layerbox_close">x</a><br>
    <div class="content" >
        <label class="leagueFilter">
        ENG PR<input type="checkbox" value="36" checked>
        </label>
        <label class="leagueFilter">
         SPA D1<input  type="checkbox" value="31" checked>
        </label>
        <label class="leagueFilter">
         GER D1<input type="checkbox" value="8" checked>
        </label>
        <label class="leagueFilter">
         FRA D1<input type="checkbox" value="11" checked>
        </label>
        <label class="leagueFilter">
         ITA D1<input type="checkbox" value="34" checked>
        </label>
        <label class="leagueFilter">
         SELECT ALL<input type="checkbox" value="0">
        </label>
        
        <h4>
        <br/>
        <a href="#" id="beforeGames">< </a>
        <span><?=$today?></span>
        <a href="#" id="afterGames"> ></a>
        </h4>
        
        <p style="display:none;">
            <span></span>
            <span></span>
            <a href="" onclick="window.open(this.href, '_blank', 'width=1200px,height=1200px,toolbars=no,scrollbars=no'); return false;"></a>
            <a href="" onclick="window.open(this.href, '_blank', 'width=1200px,height=1200px,toolbars=no,scrollbars=no'); return false;">VS</a>
            <a href=""onclick="window.open(this.href, '_blank', 'width=1200px,height=1200px,toolbars=no,scrollbars=no'); return false;"></a>       
            <button type="button" value="" class="tableButton"> 
            분석정보 가져오기
            </button>
            <input type="hidden" name="leagueIdx" value="">
        </p>
        
    <?php if ($analysis): ?> 
    <div>
    <?php foreach ($analysis as $key) : ?>
        <?php if ($key['league_idx'] == 8 || $key['league_idx'] == 11 || $key['league_idx'] == 31 || $key['league_idx'] == 34 || $key['league_idx'] == 36) : ?>
        <p>
        <?php else: ?>
        <p style="display:none;">
        <?php endif; ?>
            <span><?=$key['game_time']?></span>
            <span><?=$key['league_name']?></span>
            <a href="<?=$key['home_href']?>" onclick="window.open(this.href, '_blank', 'width=1200px,height=1200px,toolbars=no,scrollbars=no'); return false;"><?=$key['home_name']?></a>
            <a href="<?=$key['game_href']?>" onclick="window.open(this.href, '_blank', 'width=1200px,height=1200px,toolbars=no,scrollbars=no'); return false;">VS</a>
            <a href="<?=$key['away_href']?>"onclick="window.open(this.href, '_blank', 'width=1200px,height=1200px,toolbars=no,scrollbars=no'); return false;"><?=$key['away_name']?></a>       
            <button type="button" value="<?=$key['game_idx']?>" class="tableButton"> 
            분석정보 가져오기
            </button>
            <input type="hidden" name="leagueIdx" value="<?=$key['league_idx']?>">
        </p>
        
    <?php endforeach; ?>
    </div>
    <?php endif; ?>
    
    </div>
    </article>
</div>



<form action="/articles/boardInsert" id="editorForm" method="POST" >
    <p>제목 : <input type="text" name="board[title]" placeholder ="제목을 입력해주세요." value="제목없음"></p>
    <p>내용 : </p>
    <textarea name="board[contents]" id="editor" cols="110" rows="40" class="editor"></textarea>
    <br/>
    <div class="iconBox">
        <?php foreach ($icon as $key): ?>
        <img src="<?= '/img/icon/' . $key?>"  alt="icon">
        <?php endforeach; ?>
    </div> 
    <p><input type="button" id="filesSubmit" value="글작성"></p>
    <input type="hidden" name="board[category]" value='category'>
    <input type="hidden" name="board[contents]">
    <input type="hidden" name="board[files_folder]">
    <input type="hidden" name="board[writer]" value="<?=$_SESSION['name']?>">
        
    <br/>
    <button id="btnTest" type="submit">버튼</button>  
    


    <div class="dim-layer">   
        <div class="dimBg"></div>
        <div id="layer2" class="pop-layer">
            <div class="pop-container">
                <div class="pop-conts">
                    <!--content //-->
                    <p class="ctxt mb20">
                        <input type="file" class="inputFile" name="files[]" multiple accept=".gif, .jpg "><br>
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

</form>


