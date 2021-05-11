/**
 * Main node.
 */
let nodeMain = document.getElementById('main')

/**
 * Body node.
 */
let nodeBody = document.getElementById('body')

/**
 * Gameover node.
 */
let nodeGameover = document.getElementById('gameover')

/**
 * If true, it takes one more space to make it go.
 */
let isGameover = false

 document.addEventListener('keydown', event => {
     if (isGameStarted) {
        if (event.code == "ArrowUp" || event.code == "Space") jump()
        if (event.code == "ArrowDown") squat()
     } else if (event.code == "ArrowUp" || event.code == "Space") {
        if (isGameover) return isGameover = false
        startNewGame()
     }

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
 * Node of the highscore.
 */
 let nodeHighScore = document.getElementById('score_high')

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
 * Speed of the current game. Actually the size of margin-right of the last rock.
 */
let speed = 4

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
 * The highscore.
 */
let highScore = localStorage.getItem('highscore') ? localStorage.getItem('highscore') : 0


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
    nodeGameover.style.visibility = 'hidden'
    obstacles[0] && nodeGround.removeChild(obstacles[0])
    nodeDino.style.bottom = `-18px`
    toggleNight(false)

    isGameStarted = true
    score = 0
    isInJump = false
    isSquating = false
    currentRockLength = 0
    
    skipRock = skipCloud = skipBump = skipObstacle = 0
    speed = 4
    nodeDino.classList.add('dino-1')
    intervalDinoAnimation = setInterval(animateDino, 100)
    intervalScores = setInterval(runScore, 100)
    intervalGround = setInterval(runGround, 6)
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

    isGameStarted = false
    nodeGameover.style.visibility = 'visible'
    isGameover = true
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
    writeFullScore(++score, nodeCurrentScore)
      
    if (!(score % 700)) toggleNight(true)
    if (!((score - 200) % 700)) toggleNight(false)

    if (score > highScore) {
        highScore = score
        localStorage.setItem('highscore', highScore)
        writeFullScore(highScore, nodeHighScore)
    }

    /**
     * Positions that the speed changes at.
     */
    let speedShifts = [150, 300, 450, 600]

    if (speedShifts.includes(score)) speed++
}

/**
 * Writes the given score to the given node with nulls.
 * 5 ==> 00005
 * @param {number} score The given score (e.g. 5).
 * @param {Element} node The node to put the score in.
 * @returns {string} The score with nulls (e.g. 00005).
 */
function writeFullScore(score, node) {
    while (score.toString().length < 5) {
        score = "0" + score
    }
    node.innerHTML = score
}

function drawStaticWorld() {
    let rocks = nodeMain.offsetWidth / 3
    for (let i = 0; i < rocks; i++) {
        spawnRandomGround(true)
        spawnRandomSky(true)
    }
}

/**
 * Toggles night.
 * @param {boolean} night Is night.
 */
function toggleNight(night) {
    if (night) {
        nodeBody.style.filter = 'grayscale(1) invert(1)'
        nodeBody.style.background = '#060606'
    }
    if (!night) {
        nodeBody.style.filter = 'grayscale(0) invert(0)'
        nodeBody.style.background = '#f9f9f9'
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
    checkObstacles()

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
    // Minimum distance between rocks, decreases when speed increases.
    let distanceRocksMin = 9 - speed
    let distanceBumps = isStatic ? 350 : 200

    // Minimum 5 + 1 to distanceRocks
    skipRock = skipRock == 0 ? getRandom(distanceRocks) + distanceRocksMin : --skipRock
    // Minimum 150 + 1 to distanceBumps
    skipBump = skipBump == 0 ? getRandom(distanceBumps) + 100 : --skipBump

    let distanceObstacle = speed > 7 ? 80 : 110
    // Minimum 100 + 1 to 200
    skipObstacle = skipObstacle == 0 ? getRandom(distanceObstacle * 2) + distanceObstacle : --skipObstacle

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
        if (score > 300 && isBird > 3) {
            let variant = getRandom(2)
            newGroundNode.style.top = variant > 1 ? `-171px` : `-111px`
            newGroundNode.classList.add(`bird-1`)
        }
        else {
            newGroundNode.style.top = `0`
            let variant = getRandom(6)
            newGroundNode.classList.add(`cactus-${variant}`)
        }
    }

    nodeGround.appendChild(newGroundNode)

}

/**
 * Increases the last rock's margin-right so it moves to the left.
 * @param {Element} rock The rock to increase margin. 
 */
function moveRock(rock) {
    // Speed is set in startNewGame() and increases during the game so the speed increases.
    let newMargin = parseInt(getComputedStyle(rock)['margin-right'].slice(0, -2)) + speed
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

    for (let i = 0; i < birds.length; i++) birds[i].classList.toggle('bird-2')
}

/**
 * Checks ***all*** obstacles for touching Dino.
 */
function checkObstacles() {
    if (!obstacles.length) return

    for (let i = 0; i < obstacles.length; i++) {
        checkTouch(obstacles[i])
    }
}

/**
 * Checks ***the given*** obstacle for touching Dino.
 * @param {Element} obstacle The given obstacle to check touch.
 */
function checkTouch(obstacle) {
    // Ground level if -18px from sky.
    let isCactus = obstacle.className.includes('cactus')
    let isBird = obstacle.className.includes('bird')

    let dinoLeft = 50
    let dinoRight = 133
    let dinoBottom = parseInt(getComputedStyle(nodeDino).bottom.slice(0, -2))
    let dinoTop = isSquating ? dinoBottom + 54 : dinoBottom + 88

    // This is kind of magic, you better don't touch it. - 150 and -60 because the Dino moves during the calculations.
    let obstacleLeft = parseInt(obstacle.offsetLeft) - 150
    let obstacleRight = parseInt(getComputedStyle(obstacle, "::after").width.slice(0, -2)) + obstacleLeft - 60
    let obstacleTop = 0
    let obstacleBottom = 0

    if (isCactus) obstacleTop = parseInt(getComputedStyle(obstacle, "::after").height.slice(0, -2)) - 18
    if (isBird) {
        let birdHeight = obstacle.className.includes('bird-2') ? 65 : 57
        obstacleTop = -parseInt(obstacle.offsetTop) - 50
        obstacleBottom = -parseInt(obstacle.offsetTop) - birdHeight
        obstacleRight -= 50
    }

    // If Dino and the obstacle meet horizontal.
    let isTouchingHorizontal = obstacleLeft <= dinoRight && obstacleRight > dinoLeft ? true : false

    let isTouchingVertical = false

    if (isTouchingHorizontal) {
        if (isCactus) { 
            isTouchingVertical = obstacleTop > dinoBottom
            // It's ok if empty edges meet.
            if (dinoRight - obstacleLeft < 20 || obstacleRight - dinoLeft < 30) {
                isTouchingVertical = obstacleTop - 40 > dinoBottom + 30
            }
        }
        if (isBird) {
            isTouchingVertical = dinoTop > obstacleBottom && obstacleTop > dinoBottom ? true : false
            // It's ok if empty edges meet.
            if (dinoTop - obstacleBottom < 30 && obstacleRight - dinoLeft < 30) isTouchingVertical = false
        }
    }

    let isTouching = isTouchingHorizontal && isTouchingVertical
    if (isTouching) return endGame()
}

// ***=== END OF OBSTACLES ===***

// *****=====*****


drawStaticWorld()
writeFullScore(highScore, nodeHighScore)

window.oncontextmenu = function () {
    return false
}