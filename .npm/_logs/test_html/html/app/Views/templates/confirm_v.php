<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <script>
        let result = confirm("<?=$message ?>");
        <?php if (!empty($path)) : ?>
                window.location.href = window.location.origin +"/<?=$path?>&result="+result ;
        <?php elseif (!empty($back) && $back == true) : ?>
            history.back();
        <?php endif; ?>
    </script>
</body>
</html>