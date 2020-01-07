<!doctype html>
<html>
<head>
    <title>TEAM STATS</title>
    <link rel="shortcut icon" type="image/png" href="/favicon.ico"/>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="<?php echo base_url('css/default.css');?>"/>

    <script src="https://code.jquery.com/jquery-3.4.1.js" integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/ko.js"></script>
    <script src="<?php echo base_url('js/socket.io.js');?>"></script>

</head>
<body>
<style {csp-style-nonce}>
    body {
        height: 100%;
        background: #fafafa;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: #777;
        font-weight: 300;
    }
    h1 {
        font-weight: lighter;
        letter-spacing: 0.8rem;
        font-size: 3rem;
        margin-top: 145px;
        margin-bottom: 0;
        color: #222;
        position: relative;
        z-index: 1;
    }
    .wrap {
        max-width: 1200px;
        margin: 5rem auto;
        padding: 2rem;
        background: #fff;
        text-align: center;
        border: 1px solid #efefef;
        border-radius: 0.5rem;
        position: relative;
    }
    pre {
        white-space: normal;
        margin-top: 1.5rem;
    }
    code {
        background: #fafafa;
        border: 1px solid #efefef;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        display: block;
    }
    p {
        margin-top: 1.5rem;
    }
    .footer {
        margin-top: 2rem;
        border-top: 1px solid #efefef;
        padding: 1em 2em 0 2em;
        font-size: 85%;
        color: #999;
    }
    a:active,
    a:link,
    a:visited {
        color: #dd4814;
    }

    table {
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }
</style>