//전역함수 set




function jqueryAjax(url, data = null, type = null) {
    this.url = url;
    this.data = data;
    this.type = type;
    this.ajax = function () {
        return $.ajax({
            url: this.url,
            type: "POST",
            data: this.data,
            dataType: "json",
            processData: this.type == null ? true : false,
            contentType: this.type == null ? "application/x-www-form-urlencoded; charset=UTF-8" : false
        });
    };
}

if ((typeof $("#editor")[0] != "undefined")) {
    console.log('editor');
}
// ckeditor 생성 function
function ckeditor(selectDom, type = 0) {
    this.selectDom = selectDom;
    if (typeof selectDom != "undefined") {
        if (type == 0) {
            editorSet = {};
        } else if (type == 1) {
            editorSet = {
                toolbar: []
            };
        }
        ClassicEditor.create(selectDom, editorSet).then(editor => {
            this.getData = function () {
                return editor.getData();
            };
            this.setData = function (data) {
                let editorData = editor.getData();
                editorData += data;
                editor.setData(editorData, "text/html");
            };
            //ckeditor 파괴
            this.destroy = function () {
                editor.destroy();
            };
            //키다운 막기
            this.keyDownPrevent = function () {
                editor.editing.view.document.on(
                    "keydown",
                    (evt, data) => {
                        evt.stop();
                        data.preventDefault();
                        data.stopPropagation();
                    }, {
                        priority: "highest"
                    }
                );
            };
            this.test = function () {
                console.log(editor.model.clone());
            };
            //게시글수정 초기 ckeditor 내용셋팅
            if (type == 0) {
                let data = $(this.selectDom)
                    .siblings('input[name="board[contents]"]')
                    .val();
                editor.setData(data);

                editor.model.document.on("change:data", () => {
                    getData = editor.getData();
                    $(this.selectDom)
                        .siblings('input[name="board[contents]"]')
                        .val(getData);
                });
            } else if (type == 1) {
                editor.model.document.on("change:data", () => {
                    getData = editor.getData();
                    $(this.selectDom)
                        .siblings('input[name="comment[comment]"]')
                        .val(getData);
                });
            }
        });
    }
}

//댓글 eventListener
function boardEvent(ckeditor, className) {
    this.ckeditor = ckeditor;
    this.className = "." + className;

    //이모티콘 클릭
    $(this.className + "Form > .iconBox > img")
        .unbind("click")
        .bind("click", e => {
            this.ckeditor.setData('<img src="' + e.target.src + '">');
            getData = this.ckeditor.getData();
            $(e.target)
                .parent()
                .siblings('input[name="comment[comment]"]')
                .val(getData);
        });
    //댓글 ajax 전송
    $(this.className + "Submit")
        .unbind("click")
        .bind("click", e => {
            getData = this.ckeditor.getData();
            $(e.target)
                .siblings('input[name="comment[comment]"]')
                .val(getData);
            formData = $(e.target)
                .parent(this.className + "Form")
                .serialize();
            let url = "/articles/commentInsert";
            let replyAjax = new jqueryAjax(url, formData);
            replyAjax.ajax().then(function () {
                location.reload();
            });
        });
}

//게시판 eventListener
(function board() {
    if (typeof $("#editor")[0] != "undefined") {
        var board = new ckeditor($("#editor")[0]);

        function dataFilter(value, index) {
            contentSelect = $("#layerbox .content div").append("<p></p>");
            layerSelect = $("#layerbox .content div p");
            contentSelect.children("p:last-child").html(domSet[0].innerHTML);
            layerSelect[index].children[0].innerHTML = value.game_time;
            layerSelect[index].children[1].innerHTML = value.league_name;
            layerSelect[index].children[2].innerHTML = value.home_name;
            layerSelect[index].children[2].href = value.home_href;
            layerSelect[index].children[3].href = value.game_href;
            layerSelect[index].children[4].innerHTML = value.away_name;
            layerSelect[index].children[4].href = value.away_href;
            layerSelect[index].children[5].value = value.game_idx;
            layerSelect[index].children[6].value = value.league_idx;
            if (value.league_idx != 8 && value.league_idx != 11 && value.league_idx != 31 && value.league_idx != 34 && value.league_idx != 36) {
                contentSelect.children("p:last-child").css('display', 'none');
            }
        };
        //test VS
        $(document).on("click", ".tableButton", function (e) {
            url = "https://spoto.com/articles/dataAnalysis";

            data = {
                game_idx: $(this).val(),
                type: ["dataTeamVersus", "dataOpponent"]
            };
            console.log(data);
            ajax = new jqueryAjax(url, data);

            ajax.ajax().then(function (data) {
                console.log(data);
                $.each(data.dataTeamVersus, function (index, item) {
                    console.log(item);
                    if (index == 0) {
                        board.setData(item.sclassImg);
                        board.setData(item.sclassName);
                        board.setData('<a href="http://www.nowgoal.com/analysis/' + data.game_idx + '.html"> vs </a>');
                    } else if (index == 1) {
                        board.setData(item.sclassName);
                        board.setData(item.sclassImg);
                    }
                });
                board.setData(data.dataOpponent);
            });
        });
        $(document).on("click", "#beforeGames", function () {
            url = "https://spoto.com/articles/dataGameSchedule";
            data = {
                type: 1,
                date: $("#layerbox .content h4 span")
                    .eq(0)
                    .html()
            };
            ajax = new jqueryAjax(url, data);
            ajax.ajax().then(function (data) {
                domSet = $("#layerbox .content p");
                $("#layerbox .content p")
                    .not(":first")
                    .remove();
                $("#layerbox .content h4 span")
                    .eq(0)
                    .html(data.game_day);
                $.each(data, function (index, value) {
                    if (data[index].game_idx != undefined) {
                        dataFilter(value, index);
                    }
                });
            });
        });
        $(document).on("click", "#afterGames", function () {
            url = "https://spoto.com/articles/dataGameSchedule";
            data = {
                type: 2,
                date: $("#layerbox .content h4 span")
                    .eq(0)
                    .html()
            };
            ajax = new jqueryAjax(url, data);
            ajax.ajax().then(function (data) {
                domSet = $("#layerbox .content p");
                $("#layerbox .content p")
                    .not(":first")
                    .remove();
                $("#layerbox .content h4 span")
                    .eq(0)
                    .html(data.game_day);
                $.each(data, function (index, value) {
                    if (data[index].game_idx != undefined) {
                        dataFilter(value, index);
                    }
                });
            });
        });

        $(document).on("click", "#editorForm .iconBox > img", function (e) {
            board.setData('<img src="' + e.target.src + '">');
        });
        $(document).on("change", ".inputFile", function (e) {
            readURL(this, 2);
        });
        $(document).on("click", "#btnTest", function (e) {});
        //popup submit
        $(".imgSubmit").on("click", function () {
            imgSrc = $(".fileInsertImg > div > div:odd > img");
            let imgResult = "";
            $.each(imgSrc, function (index, item) {
                imgResult += item.outerHTML;
            });
            board.setData(imgResult);
            $('input[name="board[contents]"]').val(board.getData());

            //console.log(board.getData());
        });

        //리그 필터 checkbox
        $(document).on("click", ".leagueFilter", function (e) {
            if (e.target.value == 0) {
                leagueSchedule = $("#layerbox .content div p");
                if ($(e.target).is(":checked") == true) {
                    $('#layerbox .content input[type="checkbox"]').prop("checked", true);
                    leagueSchedule.css("display", "block");
                } else if ($(e.target).is(":checked") == false) {
                    $('#layerbox .content input[type="checkbox"]').prop("checked", false);
                    leagueSchedule.css("display", "none");
                }
            } else if (e.target.value != undefined) {
                leagueSchedule = $("#layerbox .content div p");
                $.each(leagueSchedule, function (index, item) {
                    inputVal = $(item).children("input[name='leagueIdx']");
                    if (e.target.value == inputVal.val() && $(item).css("display") == "none") {
                        console.log($(item).css("display"));
                        $(item).css("display", "block");
                    } else if (e.target.value == inputVal.val() && $(item).css("display") == "block") {
                        $(item).css("display", "none");
                    }
                });
            }
        });

        //글작성 submit
        $("#filesSubmit").on("click", function () {
            getFilesIndex = new Array();
            $.each($.parseHTML(board.getData()), function (index, item) {
                console.log(item.firstChild.src);
                if (item.tagName == "FIGURE" && item.firstChild.src != undefined && item.firstChild.src.startsWith("data:image")) {
                    $.each(filesSet, function (fileIndex, key) {
                        if (item.firstChild.src == key) {
                            getFilesIndex.push(fileIndex);
                            //ckeditor 순서대로 저장
                        }
                    });
                }
            });
            console.log(getFilesIndex);
            $('input[name="board[contents]"]').val(board.getData());
            data = new FormData();
            //console.log($(".inputFile")[0].files);
            console.log($(".inputFile" [0].files));
            if ($(".inputFile" [0].files != undefined)) {
                $.each(getFilesIndex, function (key, value) {
                    $.each($(".inputFile")[0].files, function (index, item) {
                        if (index == value) {
                            data.append(index, item);
                            imgSrc = $(".fileInsertImg > div > div:odd > img")[index];
                        }
                    });
                });
                if ($('input[name="board[idx]"]').val() != undefined) {
                    ajaxIdx = "?idx=" + $('input[name="board[idx]"]').val();
                } else {
                    ajaxIdx = "";
                }
                url = "https://spoto.com/articles/filesUpload" + ajaxIdx;
                ajaxTest = new jqueryAjax(url, data, 1);
                ajaxTest.ajax().then(function (data) {
                    if (data != null) {
                        htmlToString(data.files_name, data.files_folder);
                        $('input[name="board[files_folder]"]').val(data.files_folder);
                    }
                    $("#editorForm")[0].submit();
                });
            }
        });
    }
})();

function htmlToString(fileName, folderName) {
    parseData = $('input[name="board[contents]"]').val();
    parseData = $($.parseHTML(parseData));
    result = "";
    $.each(parseData, function (index, item) {
        //console.log(item.src);
        if (item.tagName == "FIGURE" && item.children[0].src.startsWith("data:image")) {
            parseData[index].children[0].src = "uploads/board/" + folderName + "/" + fileName[0];
            fileName.shift();
        }
        result += parseData[index].outerHTML;
    });
    $('input[name="board[contents]"]').val(result);
}

//업로드된 file을 ckeditor 순서대로 check
function uploadFielsCheck() {
    console.log($(".inputFile").val());
}
//게시판 댓글
(function boardComment() {
    if (typeof $(".commentEditor")[0] != "undefined") {
        var commentCkeditor = new ckeditor($(".commentEditor")[0], 1);
        new boardEvent(commentCkeditor, "comment");
    }
})();

//게시판 답글
(function boardReply(e) {
    if (typeof e != "undefined") {
        if (typeof replyCkeditor != "undefined") {
            replyCkeditor.destroy();
        }
        var replyCkeditor = new ckeditor(e, 1);
        new boardEvent(replyCkeditor, "reply");
    }
    //'답글쓰기' 클릭
    $(".reply>p, #imgIcon")
        .unbind("click")
        .bind("click", function () {
            let thisForm = $(this).siblings("form");
            if (thisForm.css("display") == "none") {
                $(".replyForm").css("display", " none");
                thisForm.css("display", "block");
                if (thisForm.children(".ck-editor").length == 0) {
                    boardReply(thisForm.children("textarea.replyEditor")[0]);
                }
            } else if (thisForm.css("display") == "block") {
                thisForm.css("display", "none");
            }
        });
})();
//file insertImg
function readURL(input, type) {
    $(".fileInsertImg").empty();
    if (input.files.length < 9) {
        filesSet = new Array();
        $.each(input.files, function (index, file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (type == 1) {
                    console.log(e.target.result);
                    board.setData(e.target.result);
                } else if (type == 2) {
                    let textareaImg = "<div>";
                    textareaImg += '<div class="icon_x">';
                    textareaImg += '<img src="/img/icon_x.png" alt="아이콘_x">';
                    textareaImg += "</div>";
                    textareaImg += '<div>';
                    textareaImg += '<img src="' + e.target.result + '"alt="">';
                    textareaImg += "</div> ";
                    textareaImg += "</div>";
                    $(".fileInsertImg").append(textareaImg);
                    filesSet.push(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        });
        console.log(filesSet);
    } else {
        console.log(navigator.userAgent.toLowerCase());
        console.log($(".inputFile").val());
        $(".inputFile").val("");
        alert("업로드 파일 개수 초과입니다.(최대 8개)");
    }
}

//이미지 icon_x 클릭시 삭제
$(function () {
    //jquery dragAndDrop
    $(".fileInsertImg").sortable();

    $(document).on("click", ".icon_x", function (e) {
        console.log(
            $(this)
            .parent()
            .index()
        );
        icon_x_index = $(this)
            .parent()
            .index();
        e.target.parentNode.parentNode.remove();
    });

    $(".fileInsertImg").bind("mouseover", function (e) {
        if (e.toElement.tagName == "IMG") {
            let icon_x = e.target.parentNode.parentNode.querySelector(".icon_x");
            let img = e.target.parentNode.parentNode;
            icon_x.style.display = "inline-block";
        }
    });

    $(".fileInsertImg").mouseout(function (e) {
        e.target.parentNode.parentNode.querySelector(".icon_x").style.display = "none";
    });
});
$(function () {
    //$(".ck-content").sortable();
});

//경기일정 레이어팝업
$(function () {
    function wrapWindowByMask() {
        //화면의 높이와 너비를 구한다.
        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        //문서영역의 크기
        //console.log("document 사이즈:" + $(document).width() + "*" + $(document).height());
        //브라우저에서 문서가 보여지는 영역의 크기
        //console.log("window 사이즈:" + $(window).width() + "*" + $(window).height());

        //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
        $("#mask").css({
            width: maskWidth,
            height: maskHeight
        });

        //애니메이션 효과
        //$('#mask').fadeIn(1000);
        $("#mask").fadeTo("slow", 0.5);
    }

    function popupOpen() {
        $(".layerpop").css("position", "absolute");
        //영역 가운에데 레이어를 뛰우기 위해 위치 계산
        //$(".layerpop").css("top", ($(window).height() - $(".layerpop").outerHeight()) / 2 + $(window).scrollTop());
        $(".layerpop").css("top", 100);
        $(".layerpop").css("left", ($(window).width() - $(".layerpop").outerWidth()) / 2 + $(window).scrollLeft());
        $(".layerpop").draggable();
        $("#layerbox").show();
    }

    function popupClose() {
        $("#layerbox").hide();
        $("#mask").hide();
    }

    function goDetail() {
        /*팝업 오픈전 별도의 작업이 있을경우 구현*/

        popupOpen(); //레이어 팝업창 오픈
        wrapWindowByMask(); //화면 마스크 효과
    }
    $(document).on("click", ".gameSchedule", function () {
        goDetail();
    });
    $(document).on("click", ".layerpop_close", function () {
        popupClose();
    });
});

//레이어 팝업 버튼
$(document).on("click", ".ck-file-dialog-button input", function (e) {
    e.preventDefault();
    layer_popup("#layer2");
});

//레이어 팝업
function layer_popup(el) {
    var $el = $(el); //레이어의 id를 $el 변수에 저장
    var isDim = $el.prev().hasClass("dimBg"); //dimmed 레이어를 감지하기 위한 boolean 변수
    isDim ? $(".dim-layer").fadeIn() : $el.fadeIn();

    var $elWidth = ~~$el.outerWidth(),
        $elHeight = ~~$el.outerHeight(),
        docWidth = $(document).width(),
        docHeight = $(document).height();
    // 화면의 중앙에 레이어를 띄운다.
    if ($elHeight < docHeight || $elWidth < docWidth) {
        $el.css({
            marginTop: -$elHeight / 2,
            marginLeft: -$elWidth / 2
        });
    } else {
        $el.css({
            top: 0,
            left: 0
        });
    }
    $el.find("a.btn-layerSubmit").click(function () {
        isDim ? $(".dim-layer").fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
        return false;
    });
    $el.find("a.btn-layerClose").click(function () {
        isDim ? $(".dim-layer").fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
        return false;
    });
    $(".layer .dimBg").click(function () {
        $(".dim-layer").fadeOut();
        return false;
    });
}