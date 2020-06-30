<form action="https://spoto.com/Register
/login" method="POST">
<h4>로그인화면</h4>
<br/>
<p>아이디 : <input type="text" name="author[id]"></p>
<p><?= !empty($errors['id']) ? $errors['id'] : null ?></p>
<p>비밀번호 : <input type="password" name="author[pass]">
</p>
<p><?= !empty($errors['pass']) ? $errors['pass'] : null ?>
</p>
<br/>
<p>
    <input type="submit" value="로그인"> 

    <input type="button" value="회원가입" onClick="location.href='https://spoto.com/Register/signup'">
</p>
</form>    
<br/><br/>  
<h4>sns 로그인</h4> 
<br/> 
<div class="sns_btn"> 
    <a href="<?=$kakaoUrl?>" >
    <img src="/img/kakao_btn.png" alt="">
    </a> 
</div>
<div class="sns_btn">
    <a href="<?=$naverUrl?>">
    <img src="/img/naver_btn.png" alt="">
    </a>
 </div>

 <div class="sns_btn">
    <a href="<?=$googleUrl?>">
    <img src="/img/google_btn.png" alt="">
    </a>
 </div>
<!-- 
<div class="sns_btn">
    <a href="">
    <img src="/img/facebook_btn.png" alt="">
    </a>
 </div> -->