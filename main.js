const Width = 320;
const Height = 480;

const BlockWidth = Width / 10;
const BlockHeight = BlockWidth / 2;

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
            py = BlockHeight * y

            block.style.position = 'absolute'
            block.style.top = `${py}px`
            block.style.left = `${px}px`
            block.style.width = `${BlockWidth}px`
            block.style.height = `${BlockHeight}px`
            block.style.backgroundColor = '#f00'
            block.style.border = 'solid'
        }
    }
}

init()