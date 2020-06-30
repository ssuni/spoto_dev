<h3>회원가입</h3>

<form action="/Register/signup" method="POST" enctype="multipart/form-data">
    <p>프로필 사진</p>
    <img src="<?=base_url('uploads/profile_img/sample/1579671434_b123ca06d69de818d1b0.jpg')?>" class="profilePreview" alt="이미지" width="100">
    <p> <input type="file" name="file[]" class="input_img" multiple /></p>
    <?php if (empty($author['sns_type'])) :?> 
        <p>이메일 : <input type="text" name="author[id]" value="<?= !empty($author['id']) ? $author['id'] : null ?>"></p>
        <p>비밀번호 : <input type="password" name="author[pass]" ></p>
        <p>비밀번호 확인 : <input type="password" name="author[pass_conf]"></p>    
    <?php else : ?>  
        <p>이메일 : <?=$author['id'];?></p>
        <input type="hidden" name="author[id]" value="<?=$author['id'];?>">
        <input type="hidden" name="author[pass]" value="<?=$author['pass'];?>">
        <input type="hidden" name="author[pass_conf]" value="<?=$author['pass'];?>">
    <?php endif; ?>
    <p>이름 : <input type="text" name="author[name]" value="<?= !empty($author['name']) ? $author['name'] : null ?>" maxlength="20"></p>
    <p>나이 : <input type="number" name="author[age]" value="<?= !empty($author['age']) ? $author['age'] : null ?>" min=0 max=150></p>
    <p>성별 : 
        <select name="author[gender]" id="">
            <option value="man">남자</option>
            <option value="women">여자</option>
        </select>
    </p> 
    
    <input type="hidden" name="author[files_folder]">
    <input type="hidden" name="author[profile_img]" >
    <input type="hidden" name="author[sns_type]" value="<?=!empty($author['sns_type']) ? $author['sns_type'] : null ?>">
    
    <input type="submit" value="확인"> 
</form>  

