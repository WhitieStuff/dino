/**
 * Main node.
 */
 let nodeMain = document.getElementById('main')

 document.addEventListener('keydown', event => {
     if (isGameStarted) {
        if (event.code == "ArrowUp" || event.code == "Space") jump()
     } else if (event.code == "ArrowUp" || event.code == "Space") startNewGame()

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
 * Score in the current game.
 */
let score = 0

/**
 * Intervals.
 */
let intervalDinoAnimation, intervalScores

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

    let dinoPosition = -16
    let pause = 20
    let movingUp = true

    let jumpInterval = setInterval(() => {
        if (movingUp && dinoPosition < 128) return nodeDino.style.bottom = `${dinoPosition = dinoPosition + 8}px`
        if (movingUp && dinoPosition < 148) return nodeDino.style.bottom = `${dinoPosition = dinoPosition + 4}px`
        if (movingUp && dinoPosition < 160) return nodeDino.style.bottom = `${dinoPosition = dinoPosition + 2}px`
        movingUp = false
        // if (pause) return pause--
        if (dinoPosition > 148) return nodeDino.style.bottom = `${dinoPosition = dinoPosition - 2}px`
        if (dinoPosition > 128) return nodeDino.style.bottom = `${dinoPosition = dinoPosition - 4}px`
        if (dinoPosition > -16) return nodeDino.style.bottom = `${dinoPosition = dinoPosition - 8}px`
        if (dinoPosition == -16) {
            isInJump = false
            clearInterval(jumpInterval)
        } 
    }, 10)
}

function endGame() {
    clearInterval(intervalDinoAnimation)
    clearInterval(intervalScores)
}