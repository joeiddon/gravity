cnvs = document.getElementById("cnvs")
ctx = cnvs.getContext("2d")

cnvs.addEventListener("mousedown", mouseDown, false)

function mouseDown(e){
	if (e.offsetY > height - buttonHeight) {	//clicked on button
		if (running){	//if was running simulation
			console.log("was running, switching")
			clearInterval(interval)
			interval = setInterval(initUpdate, 10)
			running = false
		} else {		//if wasN'T running simulation
			console.log("wasnt running, switching")
			clearInterval(interval)
			interval = setInterval(update, refreshRate)
			running = true
		}
	} else if (running == false){
		if (makingBall){
			console.log("beggining initial radii drag", makingBall)
			balls.push({
				x: e.offsetX,
				y: e.offsetY
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
}


window.addEventListener("resize", resize)

function resize(){
	cnvs.width = width = innerWidth
	cnvs.height = height = innerHeight
}

resize()

//initialising array
var balls = []

//variables
refreshRate = 10
var clear = true
var makingBall = true
var buttonHeight = 50
var running = false
var arrowScale = 100
var interval = setInterval(initUpdate, 10)
var gConstant = 10000

/*
var noBalls = +urlVariables[1]
var radius = {min: +urlVariables[2], max: +urlVariables[3]} 			//min, max
var velocity = {min: -urlVariables[4], max: +urlVariables[4]}
var gConstant = +urlVariables[0]				//global gravity
var clear = (urlVariables[6] == "0")
var merging = (urlVariables[5] == "1")
var spawn = {x: radius.max, y: radius.max,  w: width - radius.max, h: height - radius.max}	//limits for ball to spawn inside
*/

function initUpdate(){
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

function randCol(){
	colors = ['800000', '8B0000', 'B22222', 'FF0000', 'FA8072', 'FF6347', 'FF7F50', 'FF4500', 'D2691E', 'F4A460', 'FF8C00', 'FFA500', 'B8860B', 'DAA520', 'FFD700', '808000', 'FFFF00', '9ACD32', 'ADFF2F', '7FFF00', '7CFC00', '008000', '00FF00', '32CD32', '00FF7F', '00FA9A', '40E0D0', '20B2AA', '8D1CC"', '008080', '008B8B', '00FFFF', '00FFFF', '00CED1', '00BFFF', '1E90FF', '4169E1', '000080', '00008B', '0000CD', '0000FF', '8A2BE2', '9932CC', '9400D3', '800080', '8B008B', 'FF00FF', 'FF00FF', 'C71585', 'FF1493', 'F69B4"', 'DC143C', 'A52A2A', 'CD5C5C', 'BC8F8F', 'F08080', 'FFFAFA', 'FFE4E1', 'E9967A', 'FFA07A', 'A0522D', 'FFF5EE', '8B4513', 'FFDAB9', 'CD853F', 'FAF0E6', 'FFE4C4', 'DEB887', 'D2B48C', 'FAEBD7', 'FFDEAD', 'FFEBCD', 'FFEFD5', 'FFE4B5', 'F5DEB3', 'FDF5E6', 'FFFAF0', 'FFF8DC', 'F0E68C', 'FFFACD', 'EEE8AA', 'BDB76B', 'F5F5DC', 'FAFAD2', 'FFFFE0', 'FFFFF0', '6B8E23', '556B2F', '8FBC8F', '006400', '228B22', '90EE90', '98FB98', 'F0FFF0', '2E8B57', '3CB371', 'F5FFFA', '66CDAA', '7FFFD4', '2F4F4F', 'AFEEEE', 'E0FFFF', 'F0FFFF', '5F9EA0', 'B0E0E6', 'ADD8E6', '87CEEB', '87CEFA', '4682B4', 'F0F8FF', '708090', '778899', 'B0C4DE', '6495ED', 'E6E6FA', 'F8F8FF', '191970', '6A5ACD', '483D8B', '7B68EE', '9370DB', '4B0082', 'BA55D3', 'DDA0DD', 'EE82EE', 'D8BFD8', 'DA70D6', 'FFF0F5', 'DB7093', 'FFC0CB', 'FFB6C1', '000000', '696969', '808080', 'A9A9A9', 'C0C0C0', 'D3D3D3', 'DCDCDC', 'F5F5F5', 'FFFFFF']
	return colors[parseInt(randNum(0, colors.length))]
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

