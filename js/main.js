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
 * Node of the obstacles line.
 */
let nodeObstacles = document.getElementById('obstacles')

/**
 * Collection of clouds nodes.
 */
let obstacles = document.getElementsByClassName('obstacle')

/**
 * Collection of birds nodes.
 */
let birds = document.getElementsByClassName('bird-1')

/**
 * Time for the interval.
 */
let speed

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
let intervalDinoAnimation, intervalScores, intervalJump, intervalSquat, intervalGround, intervalSky, intervalBirds

/**
 * If < 1 then draws a rock.
 */
 let skipRock = 0

/**
 * If < 1 then spawns a bump.
 */
let skipBump = 0

/**
 * If < 1 then spawns a cloud.
 */
let skipCloud = 0

/**
 * If < 1 then spawns an obstacle.
 */
let skipObstacle = 0


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
    
    skipRock = skipCloud = skipBump = skipObstacle = 0
    speed = 6
    // speed = 20
    nodeDino.classList.add('dino-1')
    intervalDinoAnimation = setInterval(animateDino, 100)
    intervalScores = setInterval(runScore, 100)
    intervalGround = setInterval(runGround, speed)
    intervalSky = setInterval(runSky, 30)
    intervalBirds = setInterval(animateBirds, 350)
}

/**
 * Ends the game.
 */
function endGame() {
    clearInterval(intervalDinoAnimation)
    clearInterval(intervalScores)
    clearInterval(intervalJump)
    clearInterval(intervalSquat)
    clearInterval(intervalGround)
    clearInterval(intervalSky)
    clearInterval(intervalBirds)
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
    if (isInJump) return
    isInJump = true

    let dinoPosition = -18
    let movingUp = true

    intervalJump = setInterval(() => {
        if (movingUp && dinoPosition < 120) return nodeDino.style.bottom = `${dinoPosition += 9}px`
        if (movingUp && dinoPosition < 168) return nodeDino.style.bottom = `${dinoPosition += 6}px`
        if (movingUp && dinoPosition < 174) return nodeDino.style.bottom = `${dinoPosition += 2}px`
        if (movingUp && dinoPosition < 180) return nodeDino.style.bottom = `${dinoPosition++}px`
        movingUp = false
        // if (pause) return pause--
        if (dinoPosition > 168) return nodeDino.style.bottom = `${dinoPosition -= 2}px`
        if (dinoPosition > 120) return nodeDino.style.bottom = `${dinoPosition -= 6}px`
        if (dinoPosition > -18) return nodeDino.style.bottom = `${dinoPosition -= 9}px`
        if (dinoPosition <= -18) {
            nodeDino.style.bottom = `-18px`
            isInJump = false
            clearInterval(intervalJump)
        } 
    }, 10)
}

/**
 * Makes Dino squat.
 */
function squat() {

    if (isInJump) {
        isInJump = false
        clearInterval(intervalJump)

        let dinoPosition = nodeDino.style.bottom.slice(0, -2)
    
        intervalSquat = setInterval(() => {
            if (dinoPosition <= -9) {
                nodeDino.style.bottom = `-50px`
                isSquating = true
                nodeDino.classList.add('dino-down-1')
                return clearInterval(intervalSquat)
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
    // If not static, we need to decrease the initial distanse because the right margin grows when moving. 
    let distanceRocks = isStatic ? 5 : 2
    let distanceBumps = isStatic ? 350 : 200

    // Minimum 5 + 1 to distanceRocks
    skipRock = skipRock == 0 ? getRandom(distanceRocks) + 5 : --skipRock
    // Minimum 150 + 1 to distanceBumps
    skipBump = skipBump == 0 ? getRandom(distanceBumps) + 100 : --skipBump
    // Minimum 100 + 1 to 200
    skipObstacle = skipObstacle == 0 ? getRandom(200) + 100 : --skipObstacle

    if (skipRock && skipBump && skipObstacle) return

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

    if (!skipBump) {
        newGroundNode.style.top = `0`
        newGroundNode.style.height = `3px`
        newGroundNode.classList.add('bump')
        let variant = getRandom(2)
        newGroundNode.classList.add(`bump-${variant}`)
    }

    if (!skipObstacle && !isStatic) {
        newGroundNode.style.height = `0`
        newGroundNode.style.width = `0`
        newGroundNode.classList.add('obstacle')

        let isBird = getRandom(5)
        // if (score > 300 && isBird > 3) {
        if (isBird > 3) {
            let variant = getRandom(2)
            newGroundNode.style.top = variant > 1 ? `-171px` : `-111px`
            newGroundNode.classList.add(`bird-1`)
            // newGroundNode.animation = setInterval(() => {
            //     animateBird(newGroundNode)
            // }, 6000)
        }
        else {
            newGroundNode.style.top = `0`
            let variant = getRandom(6)
            newGroundNode.classList.add(`cactus-${variant}`)
        }

        // newGroundNode.watcher = setInterval(watchObstacle, speed)
    }

    nodeGround.appendChild(newGroundNode)

}

/**
 * Increases the last rock's margin-right so it moves to the left.
 * @param {Element} rock The rock to increase margin. 
 */
function moveRock(rock) {
    let newMargin = parseInt(getComputedStyle(rock)['margin-right'].slice(0, -2)) + 4
    rock.style['margin-right'] = `${newMargin}px`
}

/**
 * Removes the first rock if it has run out of the screen.
 * @param {Element} rock The rock to be removed. 
 */
function removeRock(rock) {
    let left = parseInt(rock.getBoundingClientRect().left)
    if (left < -200) nodeGround.removeChild(rock)
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
    // If not static, we need to decrease the initial distanse because the right margin grows when moving. 
    let distance = isStatic ? 200 : 100

    // Minimum 40 + 1 to distance
    skipCloud = skipCloud == 0 ? getRandom(distance) + 40 : --skipCloud

    if (skipCloud) return

    // One of the four different lines.
    let cloudTop = getRandom(4) * 20
    // Minimum 200 + 1 to 400
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
    if (left < -100) nodeSky.removeChild(cloud)
}

// ***=== END OF SKY ===***

// *****=====*****

// ***=== START OF OBSTACLES ===***

/**
 * Animates all birds.
 */
function animateBirds() {
    if (!birds.length) return

    for (let i = 0; i < birds.length; i++) {
        birds[i].classList.toggle('bird-2')
    }
}

// ***=== END OF OBSTACLES ===***

// *****=====*****


drawStaticWorld()