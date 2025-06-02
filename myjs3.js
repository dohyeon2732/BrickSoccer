var can, con;
var h = 675,
    w = 1200; // ground size

var difficulty = 2; //난이도 선택에 따른 값 설정 easy=1 normal=2 hard=3
var gameInterval; //이전에 실행한 게임을 clearInterval 하기위한 변수

var ballRadius = 20;
var x1p = w / 2;
var y1p = h - 30 - paddleHeight;
var dx = 2;
var dy = -2;
var paddleHeight = 40;
var paddleWidth = 120;
var paddleX = (w - paddleWidth) / 2;

var brickRowCount = 3;
var brickColumnCount = 17;
var brickWidth = 60;
var brickHeight = 80;
var brickPadding = 10;

var brickOffsetTop = 200;
var brickOffsetLeft = 0;
var score = 0;

var bricks1p = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks1p[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        if (level == 3) {
            var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;

            bricks1p[c][r] = { x1p: brickX, y1p: brickY, status: 1 };
        } else {
            bricks1p[c][r] = { x1p: 0, y1p: 0, status: 1 };
        }
    }
}

$(function () {
    can = document.getElementById('canvas');
    con = can.getContext('2d');
    $('#single').click(function () {
        volumecheck();
        gamemode = 1;
        $('#mode').css({ display: 'none' });
        $('#setting-page').css({ display: 'block' });
        $('#background').attr('src', 'main2.png').css({ display: 'block' });
        $('#back, #start').css({ display: 'block' });
        $('#start').text('START');
    });

    $('#start').click(function () {
        startgame();
    });

    function startgame() {
        brickreset1p();
        gamereset();

        $('#setting-page').css({ display: 'none' });
        $('#third').css({ display: 'none' });
        $('#mode').css({ display: 'none' });
        $('canvas').css({ 'background-image': 'main2.png' });
        $('#menu').css({ display: 'none' });
        $('#topboard').css({ display: 'block' });
        $('#background').css({ display: 'none' });
        if (gamemode == 1) {
            $('#brick1, #brick2').css('display', 'none');
            console.log(level);
            $('canvas').css({ 'background-image': 'url(1pground.png)' });
            // Page_load();
            if (level == 1) play1p_easy();
            else if (level == 2) play1p_normal();
            else if (level == 3) play1p_hard();
        }
    }

    // 1p 플레이 함수
    document.addEventListener('mousemove', mouseMoveHandler, false);

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - can.offsetLeft;
        if (relativeX > 0 && relativeX < can.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function brickreset1p() {
        for (var i = 0; i < brickColumnCount; i++) {
            for (var j = 0; j < brickRowCount; j++) {
                bricks1p[i][j].status = 1;
                bricks1p[i][j].x1p = i * (brickWidth + brickPadding) + brickOffsetLeft;
                bricks1p[i][j].y1p = j * (brickHeight + brickPadding) + brickOffsetTop;
            }
        }
    }

    function collisionDetection() {
        var totalBricks = brickRowCount * brickColumnCount;

        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks1p[c][r];
                if (b.status == 1) {
                    if (x1p > b.x1p && x1p < b.x1p + brickWidth && y1p > b.y1p && y1p < b.y1p + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                    }
                }
            }
        }
        if (score == totalBricks) {
            clearInterval(gameInterval);
            $('#lasttext').text('YOU WIN!').css({ display: 'block', top: '480px' });
            $('#back').css('display', 'block');
            $('#start').text('RESTART');
            $('#third').css('display', 'block');
            $('#gold').css('display', 'block');
        }
    }

    function drawBall() {
        //공 그리기
        var ballimg = new Image();
        ballimg.src = 'ball.png';
        con.beginPath();
        con.drawImage(ballimg, x1p, y1p, ballRadius, ballRadius);
        con.closePath();
    }

    function drawPaddle() {
        var ballimg = new Image();
        ballimg.src = 'shoe.png';
        con.beginPath();
        con.drawImage(ballimg, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        con.closePath();
    }
    function drawBricks() {
        var brickImage = new Image();
        brickImage.src = 'player1.png';
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks1p[c][r].status == 1) {
                    if (level != 3) {
                        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                        bricks1p[c][r].x1p = brickX;
                        bricks1p[c][r].y1p = brickY;
                    }
                    con.drawImage(brickImage, bricks1p[c][r].x1p, bricks1p[c][r].y1p, brickWidth, brickHeight);
                }
            }
        }
    }

    function movebrick() {
        console.log('movebrick');
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks1p[c][r].status == 1) {
                    if (r % 2 == 0) {
                        bricks1p[c][r].x1p += 2;
                        if (bricks1p[c][r].x1p > w) bricks1p[c][r].x1p = 0;
                    } else {
                        bricks1p[c][r].x1p -= 2;
                        if (bricks1p[c][r].x1p <= 0) bricks1p[c][r].x1p = w;
                    }
                }
            }
        }
    }

    function drawScore() {
        $('#p2').css('display', 'none');
        $('#score2').css('display', 'none');
        $('#brick2').css('display', 'none');
        $('#score1').text('Score: ' + score);
    }
    function draw() {
        con.clearRect(0, 0, can.width, can.height);
        if (level == 3) movebrick();
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        collisionDetection();

        if (x1p + dx > can.width - ballRadius || x1p + dx < ballRadius) {
            dx = -dx;
        }

        if (y1p + dy < ballRadius) {
            dy = -dy;
        }
        if (y1p > can.height - ballRadius) {
            $('#count').text('GAME OVER').css('display', 'block');
            $('#back').css('display', 'block');
            $('#start').text('RESTART');
            $('#third').css('display', 'block');
            clearInterval(gameInterval);
        }

        if (x1p > paddleX && x1p < paddleX + paddleWidth && y1p > h - paddleHeight) {
            velocity1p(paddleX, canvas.height - paddleHeight);
            console.log('bounce');
        }

        x1p += dx;
        y1p += dy;
    }

    function velocity1p(x, y) {
        var paddleCenter = paddleX + paddleWidth / 2;
        var ballRelativePosition = (x1p - paddleCenter) / (paddleWidth / 2);
        var angle = ballRelativePosition * (Math.PI / 4);

        var speed = Math.sqrt(dx * dx + dy * dy);

        dy = -speed * Math.cos(angle);
        dx = speed * Math.sin(angle);
    }

    function play1p_easy() {
        brickRowCount = 2;
        brickColumnCount = 17;
        brickWidth = 90;
        brickHeight = 120;
        gameInterval = setInterval(draw, 10);
    }
    function play1p_normal() {
        brickRowCount = 3;
        brickColumnCount = 17;
        brickWidth = 60;
        brickHeight = 80;

        gameInterval = setInterval(draw, 10);
    }
    function play1p_hard() {
        //alert("updating");
        brickRowCount = 2;
        brickColumnCount = 10;
        brickWidth = 60;
        brickHeight = 80;
        brickPadding = 20;
        difficulty = 3;
        gameInterval = setInterval(draw, 10);
    }

    function gamereset() {
        clearInterval(gameInterval);
        $('#lasttext').css('display', 'none');
        x1p = w / 2;
        y1p = h - 30;
        dy = -2;
        score = 0;

        if (level == 1) dx = Math.floor(Math.random() * 2 + 1);
        else if (level == 2 || level == 3) {
            dx = Math.floor(Math.random() * 3 + 1);
            dy = -3;
        }
        if (Math.floor(Math.random() * 2) % 2 == 0) dx = -dx;
    }

    $('#start').click(function () {
        startgame();
    });
});
