cnvs = document.getElementById("cnvs")
ctx = cnvs.getContext("2d")

cnvs.addEventListener("mousedown", mouseDown, false)

function mouseDown(e){
	if (e.offsetY > height - buttonHeight) {	//clicked on button
		if (running){	//if was running simulation
			console.log("was running, switching")
			clearInterval(interval)
			running = false
            drawCurrentState()
		} else {		//if wasN'T running simulation
			console.log("wasnt running, switching")
			interval = setInterval(update, refreshRate)
			running = true
		}
	} else if (running == false){
		if (makingBall){
			console.log("beggining initial radii drag", makingBall)
			balls.push({
				x: e.offsetX,
				y: e.offsetY,
                r: 0.1 //minimum radii
			})
			window.addEventListener("mousemove", mouseMove, false);
			window.addEventListener("mouseup", mouseUp, false);
		}
	}
}
function mouseUp(e) {
	var ball = balls[balls.length-1]
	if (makingBall){
		console.log("release radii drag", makingBall)
		makingBall = false
	} else {
		console.log("released velocity point", makingBall)
		makingBall = true
		window.removeEventListener("mouseup", mouseUp, false);
		window.removeEventListener("mousemove", mouseMove, false);
	}
}

function mouseMove(e){
	var ball = balls[balls.length-1]
	if (makingBall) {
		ball.r = Math.sqrt(Math.pow(e.offsetX - ball.x, 2) + Math.pow(e.offsetY - ball.y, 2))
	} else {
		ball.vx = (e.offsetX - ball.x) / arrowScale
		ball.vy = (e.offsetY - ball.y) / arrowScale
	}
    drawCurrentState()
}


window.addEventListener("resize", resize)

function resize(){
	cnvs.width = width = innerWidth
	cnvs.height = height = innerHeight
}

resize()

var balls = []

//variables
refreshRate = 10
var clear = true
var makingBall = true
var buttonHeight = 50
var running = false
var arrowScale = 100
var interval = 0
var gConstant = 10000

drawButton()
startUp()

function startUp(){
    lines = ["Welcome to my Gravity Simulation","",
    "The simulation is entirely controlled",
    "with your mouse.",
    "To create a ball, drag from the center",
    "to the circumference. Then click to set",
    "its velocity.",
    'Then hit the red "run" button to start',
    "the simulation."]
    ctx.textAlign = "left"
    ctx.font = "20px monospace"
    for (var l = 0; l < lines.length; l++){
        ctx.fillText(lines[l], width/2 - 200, 200 + l * 20)
    }
}

function drawCurrentState(){
	clearScreen()
	for (b = 0 ; b < balls.length ; b ++){
		ball = balls[b]
		drawCircle(ball.x, ball.y, ball.r, "FFFFFF")// ball.c)
		drawArrow(ball.x, ball.y, ball.x + ball.vx * arrowScale, ball.y + ball.vy * arrowScale, 22, 10)
	}
	drawButton()
}

function update(){
	//ballMerges()
	applyGravity()
	updateBallPositions()
	if (clear) clearScreen()
	drawBalls()
	drawButton()
}

function drawArrow(x1, y1, x2, y2, theta, l){
	ctx.strokeStyle = "white"
	ctx.strokeStyle = "white"
	ctx.fillStyle = ctx.strokeStyle
	ctx.lineWidth = 2

	var alpha = theta - Math.atan2(x2-x1, y2-y1) * (180/Math.PI)
	var beta = theta + Math.atan2(x2-x1, y2-y1) * (180/Math.PI)
	var gamma = Math.atan2(x2-x1, y2-y1) * (180 / Math.PI)
	
	ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2 - l * Math.cos(theta*(Math.PI/180)) * Math.sin(gamma*(Math.PI/180)),
	y2 - l * Math.cos(theta*(Math.PI/180)) * Math.cos(gamma*(Math.PI/180)))
	ctx.stroke()
	ctx.moveTo(x2 + l * Math.sin(alpha*(Math.PI/180)), y2 - l * Math.cos(alpha*(Math.PI/180)))
	ctx.lineTo(x2, y2)
	ctx.lineTo(x2 - l * Math.sin(beta*(Math.PI/180)), y2 - l * Math.cos(beta*(Math.PI/180)))
	ctx.fill()
	
	ctx.lineWidth = 1
}

function randNum(min, max){					//returns random integer including min, excluding max
	return Math.random() * (max - min) + min
}

function overlap(x1, y1, x2, y2, r1, r2){
	distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
	if (distance < r1 + r2){
		return true
	}
	return false
}

function momentum(u1, u2, m1, m2){
	v1 = (u1 * (m1 - m2) + (2 * m2 * u2))/(m1 + m2)
	v2 = (u2 * (m2 - m1) + (2 * m1 * u1))/(m1 + m2)
	return [v1, v2]
}

function drawCircle(x, y, radius, color){
	ctx.beginPath(x, y)
	ctx.arc(x, y, radius, 0, Math.PI * 2)
	ctx.strokeStyle = "black"
	ctx.stroke()
	ctx.fillStyle = "#" + color
	ctx.fill()
}

function clearScreen(){
	ctx.clearRect(0, 0, width, height)
}

function drawBalls(){
	for (b = 0 ; b < balls.length ; b ++){
		ball = balls[b]
		drawCircle(ball.x, ball.y, ball.r, "FFFFFF")
	}
}

function updateBallPositions(){
	for (b = 0 ; b < balls.length ; b ++){
		ball = balls[b]
		ball.x += ball.vx
		ball.y += ball.vy
	}
}

function wallCollisions(){
	for (b = 0 ; b < noBalls ; b ++){
		ball = balls[b]
		if ((ball.x + ball.vx) - ball.r < 0 || (ball.x + ball.vx) + ball.r > width){
			ball.vx *= -1
		}
		if (ball.y + ball.vy - ball.r < 0 || ball.y + ball.vy + ball.r > height){
			ball.vy *= -1
		}
	}
}

function ballMerges(){
	for (b1 = 0 ; b1 < noBalls ; b1 ++ ){
		for (b2 = b1 + 1 ; b2 < noBalls ; b2 ++){
			if (overlap(balls[b1].x + balls[b1].vx, balls[b1].y + balls[b1].vy, balls[b2].x + balls[b2].vx, balls[b2].y + balls[b2].vy, balls[b1].r, balls[b2].r)){
				if (merging) merge(b1, b2)
			    /*
				else {
					balls.splice(b1, 1)
					balls.splice(b2, 1)
					noBalls -= 2
			    }*/				
			}
		}
	}
}

function merge(b1, b2){
	balls[b1].x += (balls[b2].x - balls[b1].x) / 2
	balls[b1].y += (balls[b2].y - balls[b1].y) / 2
	balls[b1].vx += balls[b2].vx
	balls[b1].vy += balls[b2].vy
	balls[b1].r += balls[b2].r
	balls.splice(b2, 1)
	noBalls --
}

function gravitationalAccel(m1, m2, r){
	force = gConstant * ((m1 * m2) / Math.pow(r,2))
	a1 = force / m1	
	a2 = force / m2
	return {a1: a1, a2: a2}
}

function applyGravity(){
	for (b1 = 0 ; b1 < balls.length ; b1 ++ ){
		for (b2 = b1 + 1 ; b2 < balls.length ; b2 ++){
			distanceBetween = Math.sqrt((balls[b2].x - balls[b1].x) * (balls[b2].x - balls[b1].x) + (balls[b2].y - balls[b1].y) * (balls[b2].y - balls[b1].y))
			xDistance = Math.abs(balls[b2].x - balls[b1].x)
			yDistance = Math.abs(balls[b2].y - balls[b1].y)
			secondsElapsed = refreshRate / 1000
			diagAcc = gravitationalAccel(balls[b1].r, balls[b2].r, distanceBetween)
			
			if (balls[b1].x < balls[b2].x){	//b1 left of b2
				balls[b1].vx += diagAcc.a1 * (xDistance / distanceBetween) * secondsElapsed
				balls[b2].vx += diagAcc.a2 * (xDistance / distanceBetween) * secondsElapsed * -1
			} else {						//b1 right of b2
				balls[b1].vx += diagAcc.a1 * (xDistance / distanceBetween) * secondsElapsed * -1
				balls[b2].vx += diagAcc.a2 * (xDistance / distanceBetween) * secondsElapsed
			}
			
			if (balls[b1].y < balls[b2].y){	//b1 above b2
				balls[b1].vy += diagAcc.a1 * (yDistance / distanceBetween) * secondsElapsed
				balls[b2].vy += diagAcc.a2 * (yDistance / distanceBetween) * secondsElapsed * -1
			} else {						//b1 below b2
				balls[b1].vy += diagAcc.a1 * (yDistance / distanceBetween) * secondsElapsed * -1
				balls[b2].vy += diagAcc.a2 * (yDistance / distanceBetween) * secondsElapsed
			}
		}
	}
}

function drawButton(){
	ctx.fillStyle = "rgba(255,50,60,0.5)"
	ctx.fillRect(0, height - buttonHeight, width, height)
	ctx.fillStyle = "rgba(255,255,255,0.5)"
	ctx.font = "50px monospace"
	ctx.textAlign = "center"
	ctx.fillText(running ? "stop" : "run", width/2, height-(buttonHeight/2) + 12.5)
}

