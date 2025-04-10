// スクリーンの幅
// 構造体にした方が見通しがいい，一斉置換で出来るはず
const Width = 320;
const Height = 480;

// ブロックの幅と，それぞれのブロックの pos, 壊れてないかのリスト
// これも構造体にした方が見通しがいい
const BlockWidth = Width / 10;
const BlockHeight = BlockWidth / 2;
const BlockInfoList = []
let BlockCount = 0
// 構造体っぽくした
// 最初は即時クロージャで実装していたが，getter の実装がめんどくさく断念
// 構造体の中身から，中身の要素を参照できないので，マジックナンバーが増えた
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

let gameover = false
// html 要素とマウス操作のリスナーの準備
const init = () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    container.style.position = 'absolute'
    container.style.width = `${Width}px`
    container.style.height = `${Height}px`
    container.style.backgroundColor = '#000'

    for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 9; x++) {
            // ここ，blockdiv とかにした方がきっとわかりやすい
            const block = document.createElement('div')
            container.appendChild(block)
            BlockCount++;

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

            BlockInfoList.push({ px: px, py: py, available: true, element: block })
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
    messegeDiv = document.createElement('div')
    container.appendChild(messegeDiv)
    messegeDiv.style.position = 'absolute'
    messegeDiv.style.top = '0px'
    messegeDiv.style.left = '0px'
    messegeDiv.style.right = '0px'
    messegeDiv.style.bottom = '0px'
    messegeDiv.style.display = 'flex'
    messegeDiv.style.alignItems = 'center'
    messegeDiv.style.justifyContent = 'center'
    messegeDiv.style.color = '#fff'
    messegeDiv.style.fontSize = '100px'
    messegeDiv.style.fontFamily = 'sans-serif'
}

// 動く可能性がある要素の css をフレームごとに書き換える
const update = () => {
    if (gameover) {
        return
    }
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
    // 弾を点として扱っているので，ブロックの隙間に挟まりがち
    // 弾の半径を考え出すと，衝突判定の際に半径の±が挟まると思うけど，
    // そいつらを一括してうまく扱える美しいアルゴリズムはないんだろうか
    bx = ball.x + ball.size / 2
    by = ball.y + ball.size / 2

    // プレイヤーと弾の当たり判定
    // 当たる場所によって跳ね返る方向を変えられるような実装にしている
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

    // 壁と弾の当たり判定
    if (bx < 0 && ball.dx < 0 || bx > Width && ball.dx > 0) {
        ball.dx *= -1
    }
    if (by < 0 && ball.dy < 0) {
        ball.dy *= -1
    }


    // ブロックと弾の当たり判定
    // まずいずれかのブロックに当たったかどうかを判定
    // もし当たっていたなら，そのブロックの横縦どちらに当たったかを判定
    for (blockInfo of BlockInfoList) {
        //console.log('in')
        const { px, py, available, element } = blockInfo
        if (!available) continue
        if (px < bx && bx < px + BlockWidth) {
            if (py < by && by < py + BlockHeight) {
                BlockCount--;
                gl = bx - px
                gr = bx + BlockWidth - px
                gt = by - py
                gb = by + BlockHeight - py
                g = Math.min(gl, gr, gt, gb)
                if (g === gl || g === gr) {
                    ball.dx *= -1
                }
                if (g === gt || g === gb) {
                    ball.dy *= -1
                }
                blockInfo.available = false
                element.style.display = 'none'
            }
        }
    }

    if (by > Height) {
        gameover = true
        messegeDiv.textContent = 'You Lose'
        messegeDiv.style.color = '#800'
    }
    if (BlockCount == 0) {
        gameover = true
        messegeDiv.textContent = 'You Win !'
        messegeDiv.style.color = '#080'
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
        if (gameover) {
            return
        }
        console.log(gameover)

    }
    tick();
}