<!doctype html>
<html>
<head>
        <title>User Management</title>
        <link rel="stylesheet" href="/css/index.css">
        <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"><!--dragAndDrop CDN-->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script><!--제이쿼리 CDN-->
        <script src="https://cdn.ckeditor.com/ckeditor5/16.0.0/classic/ckeditor.js"></script><!--ckeditor CDN-->
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script><!--dargAndDrop-->
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script><!--dargAndDrop-->       
</head>
<body>
        <div id = "header">
                <ul>
                        <li><a href="/board/index">홈</a></li>
                        <li><a href="/articles/boardIndex">게시판</a></li>
                <?php if ($userVerification):?>
                        <!--<li><a href="/newsTest/myNews/<?=$_SESSION['idx']?>"><?=$_SESSION['name']?>님의 news</a></li>-->
                        
                        <?php if ($_SESSION['admin'] == 1):?>
                                <li><a href="/membership/index">회원관리</a></li>
                                <li><a href="/Register/logCheck">로그관리</a></li>
                        <?php endif;?>
                        <li><a href="/Register/myPage">마이페이지</a></li>
                        <li><a href="/Register/logout">로그아웃</a></li>
                <?php else: ?>
                        
                        <li><a href="/Register/login">로그인</a></li>
                        <li><a href="/Register/signup">회원가입</a></li>
                <?php endif; ?>
                        
                </ul>
        </div>
<br/>
<article>