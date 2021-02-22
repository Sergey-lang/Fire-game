let canvas = document.getElementById('game')
let context = canvas.getContext('2d')

let stone = []
let shot = []
let expl = []
let timer = 0
let ship = {x: 300, y: 300}

//load img
let stoneImage = new Image();
stoneImage.src = 'stone.png'

let playerImage = new Image();
playerImage.src = 'player.png'

let shotImage = new Image();
shotImage.src = 'shot.png'

let bombImg = new Image();
bombImg.src = 'bomb.png'

let bgImage = new Image();
bgImage.src = 'background.jpg'

//get cursor position
canvas.addEventListener('mousemove', (event) => {
    ship.x = event.offsetX - 25
    ship.y = event.offsetY - 13
})

bombImg.onload = function () {
    game()
}

//game loop
function game() {
    update()
    render()
    requestAnimationFrame(game)
}

function update() {
    timer++
    //stone generator
    if (timer % 2 === 0) {
        stone.push({
            x: Math.random() * 600,
            y: -50,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 + 2,
            del: 0
        })
    }

    //shot generator
    if (timer % 5 === 0) {
        shot.push({x: ship.x + 10, y: ship.y, speedX: 0, speedY: -5.2})
        // shot.push({x: ship.x + 10, y: ship.y, speedX: 0.5, speedY: -5})
        // shot.push({x: ship.x + 10, y: ship.y, speedX: -0.5, speedY: -5})
    }

    //explosion anim
    for (i in expl) {
        expl[i].animX = expl[i].animX + 0.3
        if (expl[i].animX > 7) {
            expl[i].animY++;
            expl[i].animX = 0
        }

        if (expl[i].animY > 7) {
            expl.splice(i, 1)
        }
    }

    //stone moving
    for (i in stone) {
        stone[i].x = stone[i].x + stone[i].speedX
        stone[i].y = stone[i].y + stone[i].speedY

        //border
        if (stone[i].x < 0 || stone[i].x > 550) stone[i].speedX = -stone[i].speedX
        if (stone[i].y >= 600) stone.splice(i, 1)

        //check crash
        for (j in shot) {
            if (Math.abs(stone[i].x + 25 - shot[j].x - 15) < 50 && Math.abs(stone[i].y - shot[j].y) < 25) {
                //add crash
                expl.push({x: stone[i].x - 25, y: stone[i].y - 25, animX: 0, animY: 0})

                //mark remove stone
                stone[i].del = 1
                shot.splice(j, 1);
                break
            }
        }
        //delete mark stone
        if (stone[i].del === 1) stone.splice(i, 1)
    }

    //shot moving
    for (i in shot) {
        shot[i].x = shot[i].x + shot[i].speedX
        shot[i].y = shot[i].y + shot[i].speedY

        if (shot[i].y < -30) shot.splice(i, 1)
    }
}

function render() {
    context.drawImage(bgImage, 0, 0, 800, 600)
    context.drawImage(playerImage, ship.x, ship.y, 70, 70)
    for (i in shot) context.drawImage(shotImage, shot[i].x, shot[i].y, 30, 30)

    for (i in stone) context.drawImage(stoneImage, stone[i].x, stone[i].y, 50, 50)

    for (i in expl) {
        context.drawImage(bombImg, 100 * Math.floor(expl[i].animX), 100 * Math.floor(expl[i].animY), 100, 100, expl[i].x, expl[i].y, 50, 50)
    }
}

//for another browser
let requestAnimFrame = (function () {
    return window.requestAnimFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 20)
        }
})()
