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
 * Node of the sky.
 */
let nodeSky = document.getElementById('sky')

/**
 * Collection of clouds nodes.
 */
 let clouds = document.getElementsByClassName('cloud')

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
let intervalDinoAnimation, intervalScores, jumpInterval, squatInterval, groundInterval, skyInterval

/**
 * If < 1 then draws a bump.
 */
 let groundCounter = 0

 /**
  * If < 1 then spawns a cloud.
  */
 let skyCounter = 0


// *****=====*****

// ***=== START OF GAME START AND END ===***

/**
 * Starts a new game.
 */
function startNewGame() {
    isGameStarted = true
    isInJump = false
    isSquating = false
    currentRockLength = 0
    
    groundCounter = 0
    skyCounter = 0
    intervalSpeed = 6
    // intervalSpeed = 20
    nodeDino.classList.add('dino-1')
    intervalDinoAnimation = setInterval(animateDino, 100)
    intervalScores = setInterval(runScore, 100)
    groundScores = setInterval(runGround, intervalSpeed)
    skyInterval = setInterval(runSky, intervalSpeed*5)
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
    clearInterval(skyInterval)
}

// ***=== END OF GAME START AND END ===***

// *****=====*****

// ***=== START OF SERVICE FUNCTIONS ===***

/**
 * Returns random integer value from 1 to *max*.
 * @param {number} max Max random value. 
 * @returns {number} Random value.
 */
function getRandom(max) {
    return Math.floor(Math.random() * max) + 1
}

function animateDino() {
    if (isInJump) {
        nodeDino.classList.add('dino-still')
    } else {
        nodeDino.classList.remove('dino-still')
    }
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

    //TODO: Increase speed on hundreds.
    //TODO: Night theme at 700 for next 200.
}

function drawStaticWorld() {
    let rocks = nodeMain.offsetWidth / 3
    for (let i = 0; i < rocks; i++) {
        spawnRandomGround(true)
        spawnRandomSky(true)
    }
}

// ***=== END OF SERVICE FUNCTIONS ===***

// *****=====*****

// ***=== START OF JUMP AND SQUAT ===***
/**
 * Makes Dino jump.
 */
function jump() {
    //FIXME: Fix jump speed.
    if (isInJump) return
    isInJump = true

    let dinoPosition = -18
    let movingUp = true

    jumpInterval = setInterval(() => {
        if (movingUp && dinoPosition < 126) return nodeDino.style.bottom = `${dinoPosition += 9}px`
        if (movingUp && dinoPosition < 144) return nodeDino.style.bottom = `${dinoPosition += 3}px`
        if (movingUp && dinoPosition < 158) return nodeDino.style.bottom = `${dinoPosition += 2}px`
        if (movingUp && dinoPosition < 162) return nodeDino.style.bottom = `${dinoPosition++}px`
        movingUp = false
        // if (pause) return pause--
        // if (dinoPosition > 148) return nodeDino.style.bottom = `${dinoPosition -= 2}px`
        if (dinoPosition > 126) return nodeDino.style.bottom = `${dinoPosition -= 3}px`
        if (dinoPosition > -18) return nodeDino.style.bottom = `${dinoPosition -= 9}px`
        if (dinoPosition <= -18) {
            nodeDino.style.bottom = `-18px`
            isInJump = false
            clearInterval(jumpInterval)
        } 
    }, 5)
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
            if (dinoPosition <= -9) {
                nodeDino.style.bottom = `-50px`
                isSquating = true
                nodeDino.classList.add('dino-down-1')
                return clearInterval(squatInterval)
            }
            nodeDino.style.bottom = `${dinoPosition -= 9}px`
        }, 10)

    } else {
        isSquating = true
        nodeDino.style.bottom = `-50px`
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
    nodeDino.style.bottom = `-18px`
    
}

// ***=== END OF JUMP AND SQUAT ===***

// *****=====*****

// ***=== START OF GROUND ===***

/**
 * Moves the ground under Dino.
 * Being called with an interval.
 */
function runGround() {
    spawnRandomGround()

    let firstRock = rocks[0]
    let lastRock = rocks[rocks.length - 1]

    if (lastRock) moveRock(lastRock)
    if (firstRock) removeRock(firstRock)
}

/**
 * Spawns a random rock on the ground.
 * @param {boolean} isStatic Is the ground static so in makes margin-right.
 */
function spawnRandomGround(isStatic) {

    let probabilityMain = getRandom(20)
    if (probabilityMain > 5) return

    let rockWidth = getRandom(10)
    let rockHeight = getRandom(3)
    let rockTop = getRandom(18)
    let marginRight = getRandom(50)
    let newGroundNode = document.createElement('div')
    newGroundNode.classList.add('rock')
    newGroundNode.style.width = `${rockWidth}px`
    newGroundNode.style.height = `${rockHeight}px`
    newGroundNode.style.top = `${rockTop}px`
    if (isStatic) newGroundNode.style.marginRight = `${marginRight}px`

    groundCounter = groundCounter > 100 ? 0 : ++groundCounter

    let probability1 = groundCounter == 1 || groundCounter == 80
    let probability2 = getRandom(10) < 9

    if (probability1 && probability2) {
        newGroundNode.style.top = `0`
        newGroundNode.style.height = `3px`
        newGroundNode.style.visibility = 'visible'
        newGroundNode.classList.add('bump')
        let variant = getRandom(2)
        newGroundNode.classList.add(`bump-${variant}`)
    }

    //TODO: A separate interval for bumps would be cool.

    nodeGround.appendChild(newGroundNode)

}

/**
 * Increases the last rock's margin-right so it moves to the left.
 * @param {Element} rock The rock to increase margin. 
 */
function moveRock(rock) {
    let newMargin = parseInt(getComputedStyle(rock)['margin-right'].slice(0, -2)) + 5
    rock.style['margin-right'] = `${newMargin}px`
}

/**
 * Removes the first rock if it has run out of the screen.
 * @param {Element} rock The rock to be removed. 
 */
function removeRock(rock) {
    let left = parseInt(rock.getBoundingClientRect().left)
    if (left < -80) nodeGround.removeChild(rock)
}

// ***=== END OF GROUND ===***

// *****=====*****

// ***=== START OF SKY ===***

/**
 * Moves the sky under Dino.
 * Being called with an interval.
 */
function runSky() {
    spawnRandomSky()

    let firstCloud = clouds[0]
    let lastCloud = clouds[clouds.length - 1]

    if (lastCloud) moveCloud(lastCloud)
    if (firstCloud) removeCloud(firstCloud)
}

/**
 * Spawns a random cloud in the sky.
 * @param {boolean} isStatic Is the sky static so in makes margin-right.
 */
function spawnRandomSky(isStatic) {
    skyCounter = skyCounter > 200 ? 0 : ++skyCounter

    let probability1 = skyCounter != 1 && skyCounter != 30 && skyCounter != 100 && skyCounter != 180
    let probability2 = getRandom(10) > 4

    if (probability1 || probability2) return

    let cloudTop = getRandom(4) * 20
    let marginRight = getRandom(400) + 200

    let newSkyNode = document.createElement('div')
    newSkyNode.classList.add('cloud')
    newSkyNode.style.top = `${cloudTop}px`
    if (isStatic) newSkyNode.style.marginRight = `${marginRight}px`

    nodeSky.appendChild(newSkyNode)

}

/**
 * Increases the last cloud's margin-right so it moves to the left.
 * @param {Element} cloud The cloud to increase margin. 
 */
function moveCloud(cloud) {
    let newMargin = parseInt(getComputedStyle(cloud)['margin-right'].slice(0, -2)) + 5
    cloud.style.marginRight = `${newMargin}px`
}

/**
 * Moves the given cloud to the left in the sky.
 * @param {Element} cloud A cloud to remove. 
 */
function removeCloud(cloud) {
    let left = parseInt(cloud.getBoundingClientRect().left)
    if (left < -120) nodeSky.removeChild(cloud)
}

// ***=== END OF SKY ===***

// *****=====*****




drawStaticWorld()