
<h3>회원정보수정</h3>
 
      <form action="/UsersRegister/myPage" method="POST" enctype="multipart/form-data">
    
    
       <input type="hidden" name="author[idx]" value="<?=$key['idx']?>">
       <p>아이디 : <?=$key['id']?></p>
       <input type="hidden" name="author[id]" value="<?=$key['id']?>">
        <p>프로필 사진</p>  
        <img class="profilePreview" src="<?php echo base_url($key['img_path'])?>" alt="이미지" width="100">
        <p> <input type="file" name="file[]" class="input_img" multiple /></p>  
         
        <p>나이 : <?=$key['age']?>
        <input type="hidden" name="author[age]" value="<?=$key['age']?>"></p> 
        <p>성별 : <?=$key['gender']?> 
        <input type="hidden" name="author[gender]" value="<?=$key['gender']?>"></p>
        <p>이름 : 
            <input type="text" name="author[name]" value="<?=$key['name']?>" maxlength="20"></p>
        <?php if (empty($key['sns_type'])) : ?>
            <p>비밀번호 : 
            <input type="password" name="author[pass]" value="<?=$key['pass']?>"></p>
            <p>비밀번호 확인 : 
             <input type="password" name="author[pass_conf]" value="<?=$key['pass']?>"></p>
            <p>2차 비밀번호 : 
            <input type="password" name="author[second_pass]" value="<?=$key['second_pass']?>"  minlength="6" maxlength="6"></p>
            <p>2차 비밀번호 확인 : 
             <input type="password" name="author[second_pass_conf]" value="<?=$key['second_pass']?>"  minlength="6" maxlength="6"></p>
        <?php else : ?>      
            <input type="hidden" name="author[pass]" value="<?=$key['pass']?>">        
             <input type="hidden" name="author[pass_conf]" value="<?=$key['pass']?>">
            <input type="hidden" name="author[second_pass]" value="<?=$key['second_pass']?>"  minlength="6" maxlength="6">
             <input type="hidden" name="author[second_pass_conf]" value="<?=$key['second_pass']?>"  minlength="6" maxlength="6">
        <?php endif; ?>
        <p>회원가입 날짜 : 
            <?=$key['signup_date']?></p>
        <p>회원 레벨 : <?=$key['member_level']?>
            <input type="hidden" name="author[member_level]" value="<?=$key['member_level']?>"></p>
        <p>포인트 : <?=$key['point']?> </p>

        <input type="hidden" name="author[img_name]" value="<?=$key['profile_img']?>">
        <input type="hidden" name="author[files_folder]" value="<?=$key['files_folder'] ?>" >

        <input type="submit" value="확인">
       
    </form>
    
