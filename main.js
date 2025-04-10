const Width = 320;
const Height = 480;

const BlockWidth = Width / 10;
const BlockHeight = BlockWidth / 2;
const BlockInfoList = []

const Hero = {
    width: BlockWidth * 2,
    height: BlockHeight * 1.1,
    top: Height - Height / 6,
    left: Width / 2 - BlockWidth * 2 / 2,
    div: null,
};

const ball = {
    size: 10,
    x: Width / 2 - 5,
    y: Height / 2,
    div: null,
    ballspeed: 5,
    dx: 0,
    dy: 3,
}

//console.log(Hero.width)

const init = () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    container.style.position = 'absolute'
    container.style.width = `${Width}px`
    container.style.height = `${Height}px`
    container.style.backgroundColor = '#000'

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 9; x++) {
            const block = document.createElement('div')
            container.appendChild(block)

            px = BlockWidth * x + BlockWidth / 2
            py = BlockHeight * y + 10

            block.style.position = 'absolute'
            block.style.top = `${py}px`
            block.style.left = `${px}px`
            block.style.width = `${BlockWidth}px`
            block.style.height = `${BlockHeight}px`
            block.style.backgroundColor = '#f00'
            block.style.border = '2px solid'
            block.style.boxSizing = 'border-box'

            BlockInfoList.push([px, py])
        }
        Hero.div = document.createElement('div')
        container.appendChild(Hero.div)
        ball.div = document.createElement('div')
        container.appendChild(ball.div)

        let originalX = 0;
        let originalHeroLeft = 0;
        container.onpointerdown = (e) => {
            e.preventDefault()
            originalX = e.pageX
            originalHeroLeft = Hero.left
        }
        container.onpointermove = (e) => {
            e.preventDefault()
            if (originalX) {
                Hero.left = originalX + (e.pageX - originalX) * 2
            }
        }

    }
}


const update = () => {
    Hero.div.style.position = 'absolute'
    Hero.div.style.top = `${Hero.top}px`
    Hero.div.style.left = `${Hero.left}px`
    Hero.div.style.width = `${Hero.width}px`
    Hero.div.style.height = `${Hero.height}px`
    Hero.div.style.backgroundColor = '#fff'
    Hero.div.style.borderRadius = '50% 50% 0 0'

    ball.div.style.position = 'absolute'
    ball.div.style.top = `${ball.y}px`
    ball.div.style.left = `${ball.x}px`
    ball.div.style.width = `${ball.size}px`
    ball.div.style.height = `${ball.size}px`
    ball.div.style.backgroundColor = '#fff'
    ball.div.style.borderRadius = '50%'
}


const collisionCheck = () => {
    bx = ball.x + ball.size / 2
    by = ball.y + ball.size / 2

    if (Hero.left < bx && bx < Hero.left + Hero.width) {
        if (Hero.top < by && by < Hero.top + Hero.height) {
            if (ball.dy > 0) {
                ratio = ((bx - Hero.left) / Hero.width - 0.5) * 2
                rad = 60 * ratio / 180 * Math.PI
                ball.dx = Math.sin(rad) * ball.ballspeed
                ball.dy = Math.cos(rad) * ball.ballspeed * -1
            }
        }
    }

    if (bx < 0 && ball.dx < 0 || bx > Width && ball.dx > 0) {
        ball.dx *= -1
    }
    if (by < 0 && ball.dy < 0 || by > Height && ball.dy > 0) {
        ball.dy *= -1
    }
    
    for ([px, py] of BlockInfoList) {
        //console.log('in')
        
        if (px < bx && bx < px + BlockWidth) {
            if (py < by && by < py + BlockHeight) {
                gl = bx - px
                gr = bx + BlockWidth -px
                gt = by - py
                gb = by + BlockHeight -py
                g = Math.min(gl,gr,gt,gb)
                if (g===gl || g ===gr){
                    ball.dx *= -1
                }
                if (g === gt || g === gb){
                    ball.dy *= -1
                }

            }
        }
    }
}



window.onload = () => {
    init()
    update();
    const tick = () => {
        setTimeout(tick, 16);
        ball.x += ball.dx
        ball.y += ball.dy

        collisionCheck()
        update()
    }
    tick();
}