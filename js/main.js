/**
 * Main node.
 */
 let nodeMain = document.getElementById('main')

 document.addEventListener('keydown', event => {
     if (isGameStarted) {
        if (event.code == "ArrowUp" || event.code == "Space") jump()
        if (event.code == "ArrowDown") squat()
     } else if (event.code == "ArrowUp" || event.code == "Space") startNewGame()

 })

 document.addEventListener('keyup', event => {
     if (isGameStarted && event.code == "ArrowDown") unsquat()
 })
 
 /**
 * Node of the dino itself.
 */
let nodeDino = document.getElementById('dino')

/**
 * Node of the current score.
 */
let nodeCurrentScore = document.getElementById('current-score')

/**
 * Time for the interval.
 */
let speedInterval = 100

/**
 * True if the game is started.
 */
 let isGameStarted = false

/**
 * True if the dino is in jump.
 */
 let isInJump = false

/**
 * True if the dino is squating.
 */
let isSquating = false

/**
 * Score in the current game.
 */
let score = 0

/**
 * Intervals.
 */
let intervalDinoAnimation, intervalScores, jumpInterval, squatInterval

/**
 * Starts a new game.
 */
function startNewGame() {
    isGameStarted = true
    nodeDino.classList.add('dino-1')
    intervalDinoAnimation = setInterval(animateDino, 100)
    intervalScores = setInterval(runScore, 100)
}

function animateDino() {
    if (isSquating) return nodeDino.classList.toggle('dino-down-2')
    nodeDino.classList.toggle('dino-2')

}

function runScore() {
    let fullScore = ++score
    while (fullScore.toString().length < 5) {
        fullScore = "0" + fullScore
    }
    nodeCurrentScore.innerHTML = fullScore
}

function jump() {
    if (isInJump) return
    isInJump = true

    let dinoPosition = -40
    let pause = 20
    let movingUp = true

    jumpInterval = setInterval(() => {
        if (movingUp && dinoPosition < 128) return nodeDino.style.bottom = `${dinoPosition += 8}px`
        if (movingUp && dinoPosition < 148) return nodeDino.style.bottom = `${dinoPosition += 4}px`
        if (movingUp && dinoPosition < 160) return nodeDino.style.bottom = `${dinoPosition += 2}px`
        movingUp = false
        // if (pause) return pause--
        if (dinoPosition > 148) return nodeDino.style.bottom = `${dinoPosition -= 2}px`
        if (dinoPosition > 128) return nodeDino.style.bottom = `${dinoPosition -= 4}px`
        if (dinoPosition > -40) return nodeDino.style.bottom = `${dinoPosition -= 8}px`
        if (dinoPosition == -40) {
            isInJump = false
            clearInterval(jumpInterval)
        } 
    }, 10)
}

function squat() {

    if (isInJump) {
        isInJump = false
        clearInterval(jumpInterval)

        let dinoPosition = nodeDino.style.bottom.slice(0, -2)
    
        squatInterval = setInterval(() => {
            if (dinoPosition <= -12) {
                nodeDino.style.bottom = `-72px`
                isSquating = true
                nodeDino.classList.add('dino-down-1')
                return clearInterval(squatInterval)
            }
            nodeDino.style.bottom = `${dinoPosition -= 12}px`
        }, 10)

    } else {
        isSquating = true
        nodeDino.style.bottom = `-72px`
        nodeDino.classList.add('dino-down-1')
    }

}

function unsquat() {
    isSquating = false
    nodeDino.classList.remove('dino-down-1')
    nodeDino.classList.remove('dino-down-2')
    nodeDino.style.bottom = `-40px`
    
}

function endGame() {
    clearInterval(intervalDinoAnimation)
    clearInterval(intervalScores)
}