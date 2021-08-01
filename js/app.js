document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const displaySquares = document.querySelectorAll('.previous-grid div')
    const lineDisplay = document.querySelector('.line-display')
    const scoreDisplay = document.querySelector('.score-display')
    let squares = Array.from(grid.querySelectorAll('div'))
    const width = 10;
    const height = 20
    let currentPosition = 4;
    let timerId;
    const startBtn = document.querySelector('#start')
    let score = 0;
    let lines = 0
    let currentIndex;


    function control(e) {
        if (e.keyCode === 39)
            moveRight()
        if (e.keyCode === 38)
            rotate()
        if (e.keyCode === 37)
            moveLeft()
        if (e.keyCode === 40)
            moveDown()
    }
    document.addEventListener('keyup', control)

    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [

        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [

        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [

        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let currentRotation = 0;
    let current = theTetrominoes[random][currentRotation]
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block')
        })
    }
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block')
        })
    }
    function moveDown() {
        undraw()
        currentPosition += width;
        draw()
        freeze()
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge)
            currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('block2')))
            currentPosition -= 1
        draw()
    }
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge)
            currentPosition -= 1
        if (current.some(index => squares[currentPosition + index].classList.contains('block2')))
            currentPosition += 1
        draw()
    }

    function rotate() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtLeftEdge && !isAtRightEdge) {
            currentRotation++
            if (currentRotation === current.length)
                currentRotation = 0
            current = theTetrominoes[random][currentRotation]

        }
        draw()

    }




    const displayWidth = 4
    const displayIndex = 0
    let nextRandom = random;
    const smallTetromino = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth + 2],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],


    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('block')

        })
        smallTetromino[nextRandom].forEach(index => {
            displaySquares[index + displayIndex].classList.add('block')
        })
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index].classList.contains('block3') ||
            squares[currentPosition + index].classList.contains('block2'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('block2'))


            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4;
            draw()
            displayShape()
            gameOver()
            addScore()
        }
    }

    displayShape()


    document.addEventListener('click', () => {
        if (timerId) {
            timerId = null
            clearInterval(timerId)


            squares.forEach(index => {
                index.classList.remove('block2')
                index.classList.remove('block')
            })
            currentPosition = 4
            currentRotation = 0

        }
        else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })


    function gameOver() {
        if (current.some(index => {
            squares[currentPosition + index].classList.contains('block2')

        })) {
            scoreDisplay.textContent = "END"
            clearInterval(timerId)
        }
    }


    function addScore() {
        for (currentIndex = 0; currentIndex < 199; currentIndex += width) {
            const rows = [currentIndex, currentIndex + 1, currentIndex + 2, currentIndex + 3, currentIndex + 4, currentIndex + 5, currentIndex + 6,
                currentIndex + 7, currentIndex + 8, currentIndex + 9]

            if (rows.every(index =>
                squares[index].classList.contains('block2')
            )) {

                score += 10;
                lines += 1;
                scoreDisplay.textContent = score
                lineDisplay.textContent = lines

                rows.forEach(item => {
                    if (squares[item].classList.contains('block2'))
                        squares[item].classList.remove('block2')
                    if (squares[item].classList.contains('block'))
                        squares[item].classList.remove('block')
                })
                const squaresRemoved = squares.splice(currentIndex, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }

    }

})