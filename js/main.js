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
 * Node of Dino itself.
 */
let nodeDino = document.getElementById('dino')

/**
 * Node of the current score.
 */
 let nodeCurrentScore = document.getElementById('score_current')

/**
 * Node of the ground.
 */
let nodeGround = document.getElementById('ground')

/**
 * Collection of rocks nodes.
 */
 let rocks = document.getElementsByClassName('rock')

/**
 * Time for the interval.
 */
let intervalSpeed

/**
 * True if the game is started.
 */
 let isGameStarted

/**
 * True if Dino is in jump.
 */
 let isInJump

/**
 * True if Dino is squating.
 */
let isSquating

/**
 * Score in the current game.
 */
let score = 0

/**
 * Intervals.
 */
let intervalDinoAnimation, intervalScores, jumpInterval, squatInterval, groundInterval

/**
 * If > 0 then spawns a bump-filler instead.
 */
let intervalPause

/**
 * Starts a new game.
 */
function startNewGame() {
    isGameStarted = true
    isInJump = false
    isSquating = false
    currentRockLength = 0
    
    intervalPause = 0
    intervalSpeed = 6
    // intervalSpeed = 20
    nodeDino.classList.add('dino-1')
    intervalDinoAnimation = setInterval(animateDino, 100)
    intervalScores = setInterval(runScore, 100)
    groundScores = setInterval(runGround, intervalSpeed)
}

function animateDino() {
    if (isSquating) return nodeDino.classList.toggle('dino-down-2')
    nodeDino.classList.toggle('dino-2')

}

/**
 * Runs the score counter.
 */
function runScore() {
    let fullScore = ++score
    while (fullScore.toString().length < 5) {
        fullScore = "0" + fullScore
    }
    nodeCurrentScore.innerHTML = fullScore
}

/**
 * Makes Dino jump.
 */
function jump() {
    if (isInJump) return
    isInJump = true

    let dinoPosition = -40
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


/**
 * Makes Dino squat.
 */
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

/**
 * Makes Dino unsquat.
 */
function unsquat() {
    isSquating = false
    nodeDino.classList.remove('dino-down-1')
    nodeDino.classList.remove('dino-down-2')
    nodeDino.style.bottom = `-40px`
    
}

/**
 * Moves the ground under Dino.
 * Being called with an interval.
 */
function runGround() {
    spawnRandomGround()
    for (let i = 0; i < rocks.length; i++) removeRock(rocks[i])
}

/**
 * Spawns a random rock on the ground.
 */
function spawnRandomGround() {

    let rockWidth = getRandom(10)
    let rockHeight = getRandom(3)
    let rockTop = getRandom(18) + 2
    let newGroundNode = document.createElement('div')
    newGroundNode.classList.add('rock')
    newGroundNode.style.width = `${rockWidth}px`
    newGroundNode.style.height = `${rockHeight}px`
    newGroundNode.style.top = `${rockTop}px`
    let invisibility = getRandom(20)
    if (invisibility > 3) newGroundNode.style.visibility = 'hidden'

    if (--intervalPause < 1) {
        newGroundNode.style.top = `0`
        newGroundNode.style.height = `3px`
        newGroundNode.style.visibility = 'visible'
        newGroundNode.classList.add('bump')
        let variant = getRandom(2)
        newGroundNode.classList.add(`bump-${variant}`)
        intervalPause = getRandom(80) + 100
    }

    nodeGround.appendChild(newGroundNode)

}

/**
 * Moves the given rock to the left on the ground.
 * @param {Element} rock A rock to move left. 
 */
function removeRock(rock) {
    let left = parseInt(rock.getBoundingClientRect().left)
    if (left < -80) nodeGround.removeChild(rock)
}

/**
 * Returns random integer value from 1 to *max*.
 * @param {number} max Max random value. 
 * @returns {number} Random value.
 */
function getRandom(max) {
    return Math.floor(Math.random() * max) + 1
}


/**
 * Ends the game.
 */
function endGame() {
    clearInterval(intervalDinoAnimation)
    clearInterval(intervalScores)
    clearInterval(jumpInterval)
    clearInterval(squatInterval)
    clearInterval(groundInterval)
}