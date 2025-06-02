//2P 변수
var concan;
var y1 = 290,
    y2 = 290; //bar y
var h = 675,
    w = 1200; // ground size
var keys = {};

var brickrow = 4,
    brickcol = 3; // brick 개수
var brickh = 80,
    brickw = 60; //brick 크기
var barh = 80,
    barw = 60; //bar h,w
var brx = 0,
    bry = 0; //brick x,y
var bx = 200,
    by = 250; //ball x,y
var ballr = 20;

var score1 = 0,
    score2 = 0;

var bricks = [];
var bricks1 = [];

var touch = 0;
var crash1 = 0,
    crash2 = 0;
var sstart = 0;
var vc = 0,
    vceff = 1; //sound
var countdowninterval, playloop;
var countnum = 2;
var level = 1;
var winner = 0;
var speed = 3.5;
var gamemode = 1;
var endscore = 3;
var skipClicked = false;
var open;
var backaud;
var backvolume = true;

function main() {
    brickset();
}

function volumecheck() {
    if (vc == 0)
        $('#volume').attr('src', 'volmute.png');
    else $('#volume').attr('src', 'vol.png');
}


function showMainScreen() {

    $("#story").css("display", "none");
    $('#volume').attr('src', 'vol.png');
    $('#background').css({ display: 'none' });
    $('#mode').css({ display: 'block' });
    $('canvas').css({ 'background-image': 'main2.png' });
    $("#back").css("display", "none").text("BACK");
}

$(function () {
    radiocheck();
    concan = document.getElementById('canvas').getContext('2d');
    open = document.getElementById('opening');
    backaud = document.getElementById('backaudio');
    $('#background').click(function () {
        if (sstart == 0) {
            sstart = 1;
            $("#background").attr("src", "storypage.png");
            $('#click').css({ display: 'none' });

            open.volume = 0.4;
            open.play();

            function changeStory(text, delay) {
                setTimeout(function () {
                    if (!skipClicked) {
                        $("#story").fadeOut(1000, function () {
                            $("#story").html(text);
                            if (!skipClicked)
                                $("#story").fadeIn(1000);
                        });
                    }
                }, delay);
            }

            changeStory("2024 아시안컵.<br>한국은 요르단에 무참히 무너지고<br>준결승에 그치고 만다.", 0);

            setTimeout(function () {
                if (!skipClicked) {
                    $("#back").css("display", "block").text("SKIP");
                }
            }, 5000);

            changeStory("한국의 이런 결과를 본 축구협회는<br>새로운 트레이닝 방법이 필요하다.<br>무언가 보여줘여만 한다!", 5000);
            changeStory("축구협회가 연구, 개발한 새로운 트레이닝 방법!<br>블록깨기와 축구의 융합!", 10000);
            changeStory("자기 스스로와의 싸움을 통해 전진패스 실력 향상!<br>연습을 마쳤다면 이젠 경쟁이다!", 15000);
            changeStory("여러 수비벽을 뚫고 3개의 골을 먼저 넣어라!<br>그럼 지금부터 바로 실전 돌입이다!", 20000);

            setTimeout(function () {
                if (!skipClicked) {
                    open.muted = true;
                    backaud.muted = false;
                    backaud.play();
                    vc = 1;
                    backaud.volume = 0.1;
                    showMainScreen();
                }
            }, 27000);
        }

    });


    $('#double').click(function () {
        gamemode = 2;
        gamereset();
        clearInterval(countdowninterval);
        $('#mode').css({ display: 'none' });
        $('#setting-page').css({ display: 'block' });
        $('#background').attr('src', 'main2.png').css({ display: 'block' });
        $('#back, #start').css({ display: 'block' });
        $('#start').text('START');
        volumecheck();
    });

    $('#rule').click(function () {
        $('#mode').css({ display: 'none' });
        $('#background').attr('src', 'rulepage.png').css({ display: 'block' });
        $('#back').css({ display: 'block' });
    });
    $('#settings').click(function () {
        volumecheck();
        $('#mode').css({ display: 'none' });
        $('#setting-page').css({ display: 'block' });
        $('#background').attr('src', 'main2.png').css({ display: 'block' });
        $('#back').css({ display: 'block' });
        $('#start').css({ display: 'none' });

        if (vc == 1) {
            $("#volume")
        }
    });
    $('#madeby').click(function () {
        $('#mode').css({ display: 'none' });
        $('#background').attr('src', 'madebypage.png').css({ display: 'block' });
        $('#back').css({ display: 'block' });
    });
    $('#back').click(function () {
        volumecheck();
        if ($("#back").text() == "SKIP") {
            open.muted = true;
            backaud.muted = false;
            backaud.play();
            backaud.volume = 0.1;
            vc = 1;
        }
        showMainScreen();
        skipClicked = true;
        $('#mode').css({ display: 'block' });
        $('#background').css({ display: 'block' }).attr('src', 'main2.png');
        $('#back').css({ display: 'none' });
        $('#story').css({ display: 'none' });
        $('#start').css({ display: 'none' });
        $('#count').css({ display: 'none' });
        $('#setting-page').css({ display: 'none' });
        $('#topboard').css({ display: 'none' });
        $('#gold, #lasttext').css('display', 'none');

        concan.clearRect(0, 0, w, h);
    });

    $('#start').click(function () {
        countnum = 3;
        if (gamemode == 2) {
            gamereset();
            $('#score2').css('display', 'block');
            $('#brick2').css('display', 'block');
            $('#brick1').css('display', 'block');
            $('#p2').css('display', 'block');
            $('#count').css('display', 'block');
            $('canvas').css({ 'background-image': 'url(main2.png)' });
            clearInterval(countdowninterval);
            clearInterval(playloop);
            countdowninterval = setInterval(countdown_2p, 1000);
        }
    });

    $('#volume').click(function () {
        var aud = document.getElementById('backaudio');
        if (vc == 1) {
            $('#volume').attr('src', 'volmute.png');
            aud.muted = true;
            vc = 0;
        } else if (vc == 0) {
            $('#volume').attr('src', 'vol.png');
            vc = 1;
            aud.muted = false;
            aud.play();
        }
    });

    $('#volumeeff').click(function () {
        var aud = document.getElementsByClassName('eff');
        if (vceff == 1) {
            $('#volumeeff').attr('src', 'volmute.png');
            for (var i = 0; i < aud.length; i++) aud[i].muted = true;
            vceff = 0;
        } else if (vceff == 0) {
            $('#volumeeff').attr('src', 'vol.png');
            vceff = 1;
        }
    });

    $('input[name="1"]').change(radiocheck);
});

function radiocheck() {
    $('.levelimg').css('opacity', 0.5);

    if ($('#levelradio1').is(':checked')) {
        $('#level1').css('opacity', 1);
        level = 1;
    } else if ($('#levelradio2').is(':checked')) {
        $('#level2').css('opacity', 1);
        level = 2;
    } else if ($('#levelradio3').is(':checked')) {
        $('#level3').css('opacity', 1);
        level = 3;
    }
}

function loop() {
    var aud = document.getElementById('backaudio');

    switch (level) {
        case 1:
            brickcol = 1;
            break;
        case 2:
            brickcol = 2;
            break;
        case 3:
            brickcol = 3;
            break;
    }

    concan.clearRect(0, 0, w, h);
    ball();
    movePlayer_2p();
    crash_2p();
    printbrick_2p();
    movebrick_2p();
}

function gamereset() {
    brickset();
    countnum = 3;
    score1 = 0;
    score2 = 0;
    crash1 = 0;
    crash2 = 0;
    touch = 0;
    winner = 0;
    y1 = 290;
    y2 = 290;
}

//key 조작
window.addEventListener('keydown', function (event) {
    keys[event.key] = true;
});
window.addEventListener('keyup', function (event) {
    delete keys[event.key];
});

function movePlayer_2p() {
    var leftBarImg = new Image();
    leftBarImg.src = 'player1.png';

    var rightBarImg = new Image();
    rightBarImg.src = 'player2.png';

    if ((keys['w'] && y1 > 0) || (keys['ㅈ'] && y1 > 0)) {
        y1 -= 5;
    }
    if ((keys['s'] && y1 < h - barh) || (keys['ㄴ'] && y1 < h - barh)) {
        y1 += 5;
    }
    if (keys['ArrowUp'] && y2 > 0) {
        y2 -= 5;
    }
    if (keys['ArrowDown'] && y2 < h - barh) {
        y2 += 5;
    }

    concan.beginPath();

    concan.drawImage(leftBarImg, 30, y1, barw, barh);
    concan.drawImage(rightBarImg, w - barw - 30, y2, barw, barh);

    concan.fillStyle = 'blue';
    concan.fill();
}

bx = 600;
by = 337;

var ran = Math.floor(Math.random() * 3) + 1;
if ((Math.floor(Math.random() * 2) + 1) % 2) ran = -ran;
var vx = ran,
    vy = 3;

function ball() {
    var ballimg = new Image();
    ballimg.src = 'ball.png';

    if (by < 0) by += 10;
    if (by > h) by -= 10;
    if (bx - ballr <= 0) {
        score2++;
        reball_2p(1);
    }
    if (bx >= w - ballr) {
        score1++;
        reball_2p(2);
    }

    if (isNaN(bx) && isNaN(by)) reball_2p(0);
    if (by > h - ballr || by < ballr) vy = -vy;
    if (bx > w - ballr || bx < ballr) vx = -vx;

    $('#score1').text('Score: ' + score1);
    $('#score2').text('Score: ' + score2);

    $('#brick1').text('Crash: ' + crash1);
    $('#brick2').text('Crash: ' + crash2);

    //bounce

    if (bx > 30 && bx < 30 + barw && by >= y1 - ballr && by <= y1 + barh + ballr) {
        touch = 1;
        velocity(30, y1);
    }

    if (bx < w - 30 && bx > w - 30 - barw && by >= y2 - ballr && by <= y2 + barh + ballr) {
        touch = 2;
        velocity(w - 30, y2);
    }

    bx += vx;
    by += vy;

    concan.beginPath();
    concan.drawImage(ballimg, bx, by, ballr, ballr);
    concan.fillStyle = 'red';
    concan.fill();
}

function velocity(x, y) {
    var rely = by - (y + barh / 2); // 패들에서 공이 맞은 위치 계산
    var normy = rely / (barh / 2); // 이 값을 -1에서 1 사이로 정규화
    var angle = normy * (Math.PI / 4); // 최대 튕기는 각도를 45도로 설정

    if (touch == winner) {
        speed = 5;
    } else speed = 3.5;

    if (crash1 == brickrow * brickcol && crash2 == brickrow * brickcol && normy < 0.1 && normy > -0.1) {
        speed = 10;
        console.log('power');
    }

    if (x > w / 2) {
        vx = -speed * Math.cos(angle);
    } else {
        vx = speed * Math.cos(angle);
    }
    vy = speed * Math.sin(angle);
}

function brickset() {
    bricks = [];
    bricks1 = [];
    for (var i = 0; i < brickrow; i++) {
        bricks[i] = [];
        for (var j = 0; j < brickcol; j++) {
            brx = w / 2 + 130 * (j + 1);
            bry = 15 + (brickh + 100) * i;
            bricks[i][j] = { x: brx, y: bry };
        }
    }

    for (var i = 0; i < brickrow; i++) {
        bricks1[i] = [];
        for (var j = 0; j < brickcol; j++) {
            brx = w / 2 - 130 * (j + 1) - brickw;
            bry = 15 + (brickh + 100) * i;
            bricks1[i][j] = { x: brx, y: bry };
        }
    }
}

function movebrick_2p() {
    for (var i = 0; i < brickrow; i++) {
        for (var j = 0; j < brickcol; j++) {
            if (j % 2 == 0) {
                bricks[i][j].y += 1;
                if (bricks[i][j].y > 675) bricks[i][j].y = 0;
            } else {
                bricks[i][j].y -= 1;
                if (bricks[i][j].y < 0) bricks[i][j].y = 675;
            }
        }
    }

    for (var i = 0; i < brickrow; i++) {
        for (var j = 0; j < brickcol; j++) {
            if (j % 2 == 0) {
                bricks1[i][j].y += 1;
                if (bricks1[i][j].y > 675) bricks1[i][j].y = 0;
            } else {
                bricks1[i][j].y -= 1;
                if (bricks1[i][j].y < 0) bricks1[i][j].y = 675;
            }
        }
    }
}

function printbrick_2p() {
    var rightImg = new Image();
    rightImg.src = 'player2.png';
    var leftImg = new Image();
    leftImg.src = 'player1.png';

    for (var i = 0; i < brickrow; i++) {
        for (var j = 0; j < brickcol; j++) {
            var bbx = bricks[i][j].x;
            var bby = bricks[i][j].y;
            concan.beginPath();
            concan.drawImage(rightImg, bbx, bby, brickw, brickh);
        }
    }

    for (var i = 0; i < brickrow; i++) {
        for (var j = 0; j < brickcol; j++) {
            var bbx = bricks1[i][j].x;
            var bby = bricks1[i][j].y;
            concan.beginPath();
            concan.drawImage(leftImg, bbx, bby, brickw, brickh);
        }
    }
}
var c1 = 0,
    c2 = 0;
function crash_2p() {
    var aud = document.getElementById('ho');
    var hit = document.getElementById('hit');
    hit.volume = 0.3;
    for (var i = 0; i < brickrow; i++) {
        for (var j = 0; j < brickcol; j++) {
            var b = bricks[i][j];
            if (bx > b.x && bx < b.x + brickw && by + ballr > b.y && by - ballr < b.y + brickh && touch == 1) {
                vx = -vx;
                b.x = 3000;
                hit.play();
                if (touch == 1) crash1++;
                else if (touch == 2) crash2++;
                touch = 0;
            }
        }
    }

    for (var i = 0; i < brickrow; i++) {
        for (var j = 0; j < brickcol; j++) {
            var b = bricks1[i][j];
            if (bx > b.x && bx < b.x + brickw && by + ballr > b.y && by - ballr < b.y + brickh && touch == 2) {
                vx = -vx;
                b.x = 3000;
                hit.play();
                if (touch == 1) crash1++;
                else if (touch == 2) crash2++;
                touch = 0;
            }
        }
    }

    if (crash1 == brickrow * brickcol) {
        if (winner == 0) winner = 1;
    }
    if (crash2 == brickrow * brickcol) {
        if (winner == 0) winner = 2;
    }

    if (score1 == endscore) {
        clearInterval(playloop);

        if (level == 3) gold(1);
        else {
            $('#count').text('Player1 win!');
            $('#count').css('display', 'block');
            aud.play();
            setTimeout(function () {
                $('#third').css('display', 'block');
                $('#count').text('Next Round!');
                $('#back').css('display', 'block');
                $('#start').css('display', 'block').text('START');
                level++;
                brickcol++;
            }, 3000);
        }
    }
    if (score2 == endscore) {
        clearInterval(playloop);
        if (level == 3) gold(2);
        else {
            $('#count').text('Player2 win!');
            $('#count').css('display', 'block');
            aud.play();
            setTimeout(function () {
                $('#third').css('display', 'block');
                $('#count').text('Next Round!');
                $('#back').css('display', 'block');
                $('#start').css('display', 'block').text('START');
                level++;
                brickcol++;
            }, 3000);
        }
    }
}

function gold(rank) {
    var dugu = document.getElementById('dugu');
    var congra = document.getElementById('congra');
    var aud = document.getElementById('backaudio');

    concan.clearRect(0, 0, w, h);
    $('#topboard').css('display', 'none');
    $('#lasttext').text('Brick Soccer의 승자는...').css({ display: 'block' });
    aud.muted = true;
    dugu.volume = 0.3;
    congra.volume = 0.3;
    dugu.play();
    setTimeout(function () {
        congra.play();
        if (rank == 1) $('#lasttext').html('Player1!<br>축하합니다!').css({ display: 'block', top: '480px' });
        else if (rank == 2) $('#lasttext').html('Player2!<br>축하합니다!').css({ display: 'block', top: '480px' });
        $('#gold').css('display', 'block');
    }, 5000);
    setTimeout(function () {
        congra.muted = true;
        $('#third').css('display', 'block');
        $('#back').css('display', 'block');
        $('#start').css('display', 'none');
    }, 19000);
}

function reball_2p(n) {
    var aud = document.getElementById("ho");
    aud.play();
    clearInterval(playloop);
    countnum = 3;
    countdowninterval = setInterval(countdown_2p, 1000);
    touch = 0;
    if (n == 0) {
        var rw = Math.floor(Math.random() * 500 + 100);
        var rh = Math.floor(Math.random() * 500 + 50);
        if (rw % 2 == 0) bx = rw;
        else bx = -rw;
        by = rh;
    }

    if (n == 1) {
        touch = 1;
        bx = 115;
        by = h / 2 - 11;
        if (vx < 0) vx = -vx;
    }
    if (n == 2) {
        touch = 2;
        bx = w - 115 - ballr;
        by = h / 2 - 11;
        if (vx > 0) vx = -vx;
    }
    y1 = h / 2 - 50;
    y2 = h / 2 - 50;
}

function countdown_2p() {
    if (score1 != endscore && score2 != endscore) {
        var aud = document.getElementById('ho');
        aud.muted = false;
        if (countnum < 0) clearInterval(countdowninterval);
        if (countnum == 0) {
            speed = 3.5;
            $('#count').css({ display: 'none' });
            if (vceff == 1) aud.play();
            clearInterval(countdowninterval);
            playloop = setInterval(loop, 10);
        } else {
            $('#count').css({ display: 'block' });
            $('#count').text(countnum);
        }
        countnum--;
    }
}
