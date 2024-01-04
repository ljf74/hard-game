/** 
 * Let's define our variables!
 */
const canvas = document.createElement("canvas")
const context = canvas.getContext("2d")

// UNIT is the number of pixels that the width and height of each square will be.
// WIDTH and HEIGHT are scales for units.
var UNIT = 42;
var WIDTH = 22;
var HEIGHT = 14;
var unspeakable = document.getElementById("img"), errorPNG = document.getElementById("error")

// Additional variables are located somewhere.
var PANEL = 60;
var FPS = 60;
var TIME_THEN = 0;
var DT = 0;
var COIN_YELLOW = 0;

var pointer = {
	cursor: false,
	events: []
}
var frameCount = 0;
var shouldMenu = false;
var couldMenu = false;
var DEVELOPER = false; // DEFAULT FALSE 
var WINNER = false;
var FREE_RUN = false;
var PLAYER_TIP = false;
var PLAYER_LOBBY = false; // DEFAULT FALSE 
var PLAYER_INTRO = true; // DEFAULT TRUE 
var PLAYER_INTRO_INDEX = 0;
var PLAYER_INTRO_TIMESTAMP = 0;
var mousePos = {
	x: 0,
	y: 0,
}
var ALTERNATE_SCREEN = 0; // DEFAULT ZERO 

allLevels.absoluteTimeStart = performance.now() / 1000;
var lastAbsoluteTime = "00:00.00"

var theme = {
	walls: "#b2b3fe",
	enemy: "#0000dd",
	grad1: "#adb7f0",
	grad2: "#ddddff",
	tile1: "#f5f8fe",
	tile2: "#dcdefd",
	MOTION_BLUR: true,
}

// Setting our canvas WIDTH and HEIGHT based on the value of UNIT.
var factor = 1;

canvas.width = UNIT * WIDTH;
canvas.height = UNIT * HEIGHT + 2 * PANEL;

var normalWidth = canvas.width;
var normalHeight = canvas.height;

canvas.width *= factor;
canvas.height *= factor;

var scl = factor;

canvas.style.width = `${canvas.width}px`
canvas.style.height = `${canvas.height}px`

context.webkitImageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

var keys = {}, game = {}, globalPlayerAttributes = {
	color: "255, 0, 0",
	colori: 0,
	colora: ["255, 0, 0", "0, 200, 0", "0, 0, 255", "255, 255, 0", "0, 255, 255", null]
}

var extras = {
	WRtimes: {
		Baldi: "new Baldi()",
		NULL: null,
		idk: "idk",
		levelAbsoluteStart: 0,
		times: {
			// WORLD RECORD TIMES NO WAY?????
		}
	},
	trueWRtimes: {"0":1.021,"1":5.179899999976158,"2":4.961599999964237,"3":7.322499999999998,"4":4.9823000000119215,"5":35.339599999964236,"6":16.286199999988078,"7":24.622699999988086,"8":20.767799999952317,"9":21.616399999976167,"10":12.83660000002385,"11":14.191999999999979,"12":22.514900000035766,"13":3.8814999999999884,"14":11.893399999976168,"15":36.75160000002384,"16":21.194900000035773,"17":24.72939999997618,"18":29.891400000035787,"19":106.15099999999995,"20":43.33349999999996,"21":46.577999999999975,"22":36.240699999988124,"23":14.605500000000006,"24":21.49249999999995,"25":8.225700000047595,"26":57.515100000023835,"27":29.55780000001198,"28":36.160499999999956,"29":24.73819999998807,"30":35.55150000000003,"timeActually":"12:54.60"},
	testFlashGameCollisions: false,
	challenges: {
		// DO NOT INCLUDE FROM FOR ACTUAL GAME.
	},
	badsumcounter: 0,
	badsumkey: "3 1 4 1 5 9".split(" "),
	musicPlaying: true,
}

var levelProgressionSound = new Audio("./level.mp3")
levelProgressionSound.preload = "auto"

var enemySound = new Audio("./enemy.mp3")
enemySound.preload = "auto"

// var coinSound = new Audio("./coin.mp3")
// coinSound.preload = "auto"

levelProgressionSound.load()
enemySound.load()
// coinSound.load()

// Get the current global time.
function getCurrentGlobalTime() {
	var dt = (performance.now() / 1000) - allLevels.absoluteTimeStart;

	var min = Math.floor(dt / 60)
	var sec = Math.floor(dt % 60)
	var ms = Math.floor((dt * 100) % 100)

	if (min < 10) min = "0" + min;
	if (sec < 10) sec = "0" + sec;
	if (ms < 10) ms = "0" + ms;

	return `${min}:${sec}.${ms}`
}

/**
 * MISC.
 */
function WRdata() {
	if (allLevels.currentLevel !== 0) {
		extras.WRtimes.times[allLevels.currentLevel - 1] = performance.now() / 1000 - extras.WRtimes.levelAbsoluteStart;
		generateAttemptLogForWR(allLevels.currentLevel - 1)
	}
}

function getColorLevel(x) {
	if (x < 10) {
		return "#00ff00"
	} else if (x < 20) {
		return "#80ff00"
	} else if (x < 30) {
		return "#bfff00"
	} else if (x < 40) {
		return "#ffff00"
	} else if (x < 50) {
		return "#ffdd00"
	} else if (x < 60) {
		return "#ffbb00"
	} else {
		return "#ff0000"
	}
}

function generateAttemptLogForWR(I = null) {
	for (var i = 1; i <= 30; i++) {
		if (I !== null && I !== i) {
			continue;
		}

		var dt = extras.WRtimes.times[i], dt1 = extras.trueWRtimes[i] ?? 0;
		var min = Math.floor(dt / 60)
		
		var sec = Math.floor(dt % 60)
		var ms = Math.floor((dt * 100) % 100)

		if (min < 10) min = "0" + min;
		if (sec < 10) sec = "0" + sec;
		if (ms < 10) ms = "0" + ms;
		
		var j = i.toString()
		
		if (j < 10) j = "0" + j;
		
		console.log(`%cLevel ${j}:%c ${min}:${sec}.${ms} %c${getDeriviationTime(dt, dt1)}%c`, "color: red", `color: ${getColorLevel(Math.floor(dt))}`, "color: #0040ff", "color: default")
	}
}

function getDeriviationTime(run, normal) {
	// If run > normal, put + time.
	// Round to the tenth decimal place. (Not actually the tenth.) +5.5, -17.5, etc.

	var dt = Math.round((run - normal) * 10) / 10;
	var dt1 = Math.abs(dt)

	return (dt > 0) ? ("+" + dt1) : ("-" + dt1)
}

function loadSpecialLevel(level) {
	allLevels.currentLevel = allLevels.specialLevelIndex;
	allLevels.levels[allLevels.specialLevelIndex - 1] = level;
}

function unloadSpecialLevel() {
	delete allLevels.levels[allLevels.specialLevelIndex - 1]
	allLevels.levels = allLevels.levels.filter(a => !!a)
	allLevels.currentLevel = 1;
}

/**
 * The main game logic here, divided into functions.
 */
function collisions(x, y, w, h) {
	var p = game.player;

	var a = p.x + p.w - x * UNIT; // Distance that player should move to the left.
	var b = x * UNIT + w * UNIT - p.x; // [SAME] right.
	var c = p.y + p.h - y * UNIT; // [SAME] up.
	var d = y * UNIT + h * UNIT - p.y; // [SAME] down.

	if ((a > 0) && (b > 0) && (c > 0) && (d > 0)) {
		var X = a < b ? -a : b;
		var Y = c < d ? -c : d;

		if (Math.abs(X) < Math.abs(Y))
			return { x: X, y: 0 }
		else 
			return { x: 0, y: Y }
	} else {
		return { x: 0, y: 0 }
	}
}

function collides(x, y, w, h) {
	var p = game.player;

	var a = p.x + p.w - x * UNIT; // Distance that player should move to the left.
	var b = x * UNIT + w * UNIT - p.x; // [SAME] right.
	var c = p.y + p.h - y * UNIT; // [SAME] up.
	var d = y * UNIT + h * UNIT - p.y; // [SAME] down.

	return (a > 0) && (b > 0) && (c > 0) && (d > 0)
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val))
}

function collidesCircle(x, y, r) {
	var p = game.player;

	var X = x * UNIT;
	var Y = y * UNIT;
	var R = r * UNIT;

	var cx = clamp(X, p.x, p.x + p.w)
	var cy = clamp(Y, p.y, p.y + p.h)

	var dx = X - cx;
	var dy = Y - cy;

	var ds = (dx ** 2) + (dy ** 2)

	return ds < (R ** 2)
}

function collidesEnemy(x, y, r) {
	/**
	 * You may be asking - why did I make this function? It's to test the ORIGINAL hitbox of TWHG contrast to the modern one. Have lots of fun!!!
	 * 
	 * Setting the extras.testFlashGameCollisions to TRUE will make it revert to the ORIGINAL GAME COLLISIONS.
	 * This makes levels uncomfortably easy, like Level 10 (tested) and Level 26 (untested) like 10x easier.
	 * It even makes you stand under enemies if you're positioned just right, like in level 14 (stand to the slight left of the first enemy).
	 * It can make unstandable gaps standable again.
	 * If you want to feel the true bugginess of the old Flash Player, then do it.
	 */
	if (extras.testFlashGameCollisions) {
		var p = game.player;

		var X = x * UNIT;
		var Y = y * UNIT;
		var R = r * UNIT;

		var x1 = p.x;
		var x2 = p.x + p.w / 2;
		var x3 = p.x + p.w;
		var y1 = p.y;
		var y2 = p.y + p.h / 2;
		var y3 = p.y + p.h;

		// Point coordinates: [dx1, p.y]
		// Circle coordinates: [X, Y]
		var d1 = (x1 - X) ** 2 + (y2 - Y) ** 2;
		var d2 = (x3 - X) ** 2 + (y2 - Y) ** 2;
		var d3 = (x2 - X) ** 2 + (y1 - Y) ** 2;
		var d4 = (x2 - X) ** 2 + (y3 - Y) ** 2;
		var R1 = R ** 2;

		return (d1 < R1) || (d2 < R1) || (d3 < R1) || (d4 < R1)
	} else {
		return collidesCircle(x, y, r)
	}
}

function clearCanvas() {
	context.clearRect(0, 0, normalWidth, normalHeight)
}

function checkpoint(levelProgression = false) {
	game.player.x = game.player.c.x;
	game.player.y = game.player.c.y;

	if (!levelProgression) allLevels.fails += 1;

	game.player.opacity = 0.875;

	for (var area of game.moneyAreas) {
		if (!area.done) {
			area.collected = false;
		}
	}
}

function update1() {
	frameCount ++

	for (var other of game.elements) {
		if (other.role === "checkpoint") {
			if (collides(other.x - 2 / UNIT, other.y - 2 / UNIT, other.w + 4 / UNIT, other.h + 4 / UNIT)) {
				if (game.player.id1 !== other.id) {
					game.player.c.x = other.x * UNIT + (other.w * UNIT - game.player.w) / 2;
					game.player.c.y = other.y * UNIT + (other.h * UNIT - game.player.h) / 2;

					game.player.id1 = other.id;
					game.elements.map(a => (a.id === other.id) && (a.oof = 0.75))

					for (var area of game.moneyAreas) {
						if (area.collected) area.done = true;
					}
				}

				if (!other.full && other.type === "end" && game.coins >= game.moneyAreas.length) {
					other.full = true;
					progressLevels()
				}
			}
			
			if (other.oof < 1) {
				other.oof += 0.0075;
			}
		}
	}

	for (var enemy of game.enemies) {
		if ((frameCount % 2 < 5) && (enemy.anchor !== -1)) {
			var g = game.anchors[enemy.anchor].act(game.time, enemy.delay ?? 0, enemy.specials ?? {})

			enemy.x = enemy.xs + g.x;
			enemy.y = enemy.ys + g.y;
		}

		if (!FREE_RUN && (game.player.roundedX - 2 < enemy.x) && (game.player.roundedX + 2 > enemy.x) && collidesEnemy(enemy.x, enemy.y, 0.16)) {
			enemySound.play()
			//checkpoint()
		}
	}

	for (var area of game.moneyAreas) {
		if (!area.collected) {
			if (collides(area.x - 0.2, area.y - 0.2, 0.4, 0.4)) {
				COIN_YELLOW = 0.8;
				new Audio("./coin.mp3").play()
				area.collected = true;
			}
		}
	}

	if (game.coins >= game.moneyAreas.length) {
		COIN_YELLOW = 1;
	} else {
		if (COIN_YELLOW > 0) {
			COIN_YELLOW -= 2 * DT;
		}
	}

	game.coins = game.moneyAreas.filter(a => a.collected).length;
}

function progressLevels(progression = true) {
	if (Object.keys(allLevels.tips).includes((1 + allLevels.currentLevel).toString())) {
		levelProgressionSound.play()
		allLevels.currentLevel += 1;
		PLAYER_TIP = true;
		if (allLevels.currentLevel >= 30) {
			changeTheme(4)
		} else if (allLevels.currentLevel >= 20) {
			changeTheme(2)
		}
		return;
	}

	checkpoint(true)
	levelProgressionSound.play()
	if (progression) {
		allLevels.currentLevel += 1;
	}

	if (allLevels.currentLevel > allLevels.levels.length) {
		WRdata()
		WINNER = true;
		return;
	}
	
	start()
}

function cheat(a = allLevels.currentLevel + 1) {
	allLevels.currentLevel = a - 1;
	levelProgressionSound.play()

	allLevels.absoluteTimeStart = performance.now() / 1000;
	PLAYER_LOBBY = false;
	FREE_RUN = false;
	start()
	progressLevels()
}

function drawAfterAll() {
	if (allLevels.currentLevel === 2) {
		context.fillStyle = "rgba(0, 0, 0, 0.5)"
		context.font = "700 32px Arial"
		context.textAlign = "middle"

		context.fillText("You have to collect all the coins.", normalWidth / 2, 2.5 * UNIT)
	} else if (allLevels.currentLevel === allLevels.specialLevelIndex) {
		context.fillStyle = "rgba(0, 0, 0, 0.5)"
		context.font = "700 32px Arial"
		context.textAlign = "middle"

		context.fillText("secret", normalWidth / 2, 0.75 * UNIT)
	}
}

function draw() {
	drawGrid()
	drawElementals()
	drawWalls()
	drawEnemies()
	drawPlayer()
	drawAfterAll()
}

function drawPanel(gradient_only = false) {
	var grad = context.createLinearGradient(0, 0, 0, normalHeight)
	grad.addColorStop(0, theme.grad1)
	grad.addColorStop(0.75, theme.grad2)

	context.fillStyle = grad;
	context.fillRect(0, 0, normalWidth, normalHeight)

	if (gradient_only) return;

	context.textAlign = "center"
	context.fillStyle = "black"
	context.font = "45px arial black"
	context.baseline = "middle"

	var a = game.intro.split("\n")
	for (var i = 0; i < a.length; i++) {
		context.fillText(a[i], normalWidth / 2, normalHeight / 2 + (50 * i), normalWidth / 1.2)
	}

	if (allLevels.currentLevel === 28) {
		context.drawImage(unspeakable, normalWidth / 2 - 150, normalHeight / 2)
	}

	context.baseline = "start"
}

function drawPlayer() {
	globalPlayerAttributes.color = globalPlayerAttributes.colora[globalPlayerAttributes.colori]
	var fun = "rgba"

	if (!globalPlayerAttributes.color) {
		fun = "hsla"
		globalPlayerAttributes.color = `${((performance.now() / 5) % 360)}, 100%, 50%`
	}

	if (game.player.opacity < -0.2) {
		game.player.x0 = game.player.x;
		game.player.y0 = game.player.y;
		game.player.opacity = 1;
	} else {
		if (game.player.opacity < 0.9) {
			game.player.opacity -= 2 * DT;
		} else {
			game.player.x0 = game.player.x;
			game.player.y0 = game.player.y;
		}
	}

	game.player.roundedX = Math.floor(game.player.x / UNIT)
	game.player.roundedY = Math.floor(game.player.y / UNIT)

	if (theme.MOTION_BLUR) {
		if (!game.player.p) game.player.p = [
			{ x: game.player.x, y: game.player.y },
			{ x: game.player.x, y: game.player.y },
		]

		if (game.player.opacity === 1) {
			for (var i = 0; i < game.player.p.length; i++) {
				context.globalAlpha = 0.4;
				context.fillStyle = `rgba(0, 0, 0, ${game.player.opacity})`
				context.fillRect(game.player.p[i].x, game.player.p[i].y, game.player.w, game.player.h)
				context.fillStyle = `${fun}(${globalPlayerAttributes.color}, ${game.player.opacity})`
				context.fillRect(game.player.p[i].x + 5, game.player.p[i].y + 5, game.player.w - 10, game.player.h - 10)
				context.globalAlpha = 1;
			}
		}
	}
	
	context.fillStyle = `rgba(0, 0, 0, ${game.player.opacity})`
	context.fillRect(game.player.x0, game.player.y0, game.player.w, game.player.h)
	context.fillStyle = `${fun}(${globalPlayerAttributes.color}, ${game.player.opacity})`
	context.fillRect(game.player.x0 + 5, game.player.y0 + 5, game.player.w - 10, game.player.h - 10)

	if (theme.MOTION_BLUR && (frameCount % 2 === 0)) {
		game.player.p.shift()
		game.player.p.push({ x: game.player.x, y: game.player.y })
	}
}

function drawGrid() {
	var a = theme.tile1;
	var b = theme.tile2;

	for (var i = 0; i < WIDTH; i++) {
		for (var j = 0; j < HEIGHT; j++) {
			context.fillStyle = [a, b][(i + j) % 2]
			context.fillRect(i * UNIT, j * UNIT, UNIT, UNIT)
		}
	}
}

function drawWalls() {
	context.fillStyle = "black"

	for (var i = 0; i < WIDTH; i++) {
		for (var j = 0; j < HEIGHT; j++) {
			if (game.wall[j * WIDTH + i] == 1) {
				context.fillRect(i * UNIT - 4, j * UNIT - 4, UNIT + 8, UNIT + 8)
			}
		}
	}

	context.fillStyle = theme.walls;

	for (var i = 0; i < WIDTH; i++) {
		for (var j = 0; j < HEIGHT; j++) {
			if (game.wall[j * WIDTH + i] == 1) {
				context.fillRect(i * UNIT, j * UNIT, UNIT, UNIT)
			}
		}
	}
}

function drawElementals() {
	for (var element of game.elements) {
		if (element.role === "checkpoint") {
			var a = 83 * element.oof;
			var b = 245 * element.oof;
			var c = 99 * element.oof;

			context.fillStyle = `rgb(${a}, ${b}, ${c})`
			context.fillRect(element.x * UNIT, element.y * UNIT, element.w * UNIT, element.h * UNIT)
		}
	}

	for (var area of game.moneyAreas) {
		if (!area.collected) {
			context.fillStyle = "black"
			context.beginPath()
			context.arc(area.x * UNIT, area.y * UNIT, 0.25 * UNIT, 0, 2 * Math.PI)
			context.fill()

			context.fillStyle = "#fdcd05"
			context.beginPath()
			context.arc(area.x * UNIT, area.y * UNIT, 0.15 * UNIT, 0, 2 * Math.PI)
			context.fill()
		}
	}
}

function drawEnemies() {
	for (var enemy of game.enemies) {
		if (theme.MOTION_BLUR) {
			if (!enemy.p) enemy.p = [
				{ x: enemy.x, y: enemy.y },
				{ x: enemy.x, y: enemy.y },
			]

			for (var i = 0; i < enemy.p.length; i++) {
				context.globalAlpha = 0.4;
				context.beginPath()
				context.arc(enemy.p[i].x * UNIT, enemy.p[i].y * UNIT, 0.25 * UNIT, 0, 2 * Math.PI)
				context.fill()

				context.fillStyle = theme.enemy;
				context.beginPath()
				context.arc(enemy.p[i].x * UNIT, enemy.p[i].y * UNIT, 0.15 * UNIT, 0, 2 * Math.PI)
				context.fill()
				context.globalAlpha = 1;
			}
		}

		context.fillStyle = "black"
		context.beginPath()
		context.arc(enemy.x * UNIT, enemy.y * UNIT, 0.25 * UNIT, 0, 2 * Math.PI)
		context.fill()

		context.fillStyle = theme.enemy;
		context.beginPath()
		context.arc(enemy.x * UNIT, enemy.y * UNIT, 0.15 * UNIT, 0, 2 * Math.PI)
		context.fill()

		if (theme.MOTION_BLUR && (frameCount % 2 === 0)) {
			enemy.p.shift()
			enemy.p.push({ x: enemy.x, y: enemy.y })
		}
	}
}

function input() {
	if (game.player.opacity < 0.9) return;

	var W = !!keys.w || !!keys.ArrowUp;
	var A = !!keys.a || !!keys.ArrowLeft;
	var S = !!keys.s || !!keys.ArrowDown;
	var D = !!keys.d || !!keys.ArrowRight;

	if (!document.hasFocus()) {
		// Fixes that bug that makes people glitch through walls.
		keys.w = false;
		keys.a = false;
		keys.s = false;
		keys.d = false;
		keys.ArrowUp = false;
		keys.ArrowLeft = false;
		keys.ArrowDown = false;
		keys.ArrowRight = false;
		W = false;
		A = false;
		S = false;
		D = false;
	}

	if (W) game.player.y -= game.player.v;
	if (S) game.player.y += game.player.v;
	if (A) game.player.x -= game.player.v;
	if (D) game.player.x += game.player.v;

	var i, j;

	for (var p = 0; p < WIDTH; p++) {
		for (var l = 0; l < HEIGHT; l++) {
			if (A) {
				i = WIDTH - p - 1;
			} else {
				i = p;
			}

			if (W) {
				j = HEIGHT - l - 1;
			} else {
				j = l;
			}
			
			if ((game.player.roundedX - 2 < i) && (game.player.roundedX + 2 > i) && (game.player.roundedY - 2 < j) && (game.player.roundedY + 2 > j) && (game.wall[j * WIDTH + i] === 1)) {
				var XY = collisions(i, j, 1, 1)

				game.player.x += XY.x;
				game.player.y += XY.y;
			}
		}
	}
}

function drawUp() {
	var dx = 15;
	var dy = 4.5;

	context.textBaseline = "alphabetical"

	context.fillStyle = "black"
	context.fillRect(0, 0, normalWidth, PANEL)
	context.fillRect(0, normalHeight - PANEL, normalWidth, PANEL)

	context.fillStyle = "white"
	context.font = "40px arial"
	context.textAlign = "center"

	context.fillText(allLevels.currentLevel >= allLevels.specialLevelIndex ? (allLevels.levels[allLevels.currentLevel - 1].name || "[SPECIAL]") : `${allLevels.currentLevel}/${allLevels.levels.length}`, normalWidth / 2, PANEL / 2 + dx)

	context.textAlign = "right"
	context.fillText(DEVELOPER ? "WALKTHROUGH" : `FAILS: ${allLevels.fails}`, normalWidth - 10, PANEL / 2 + dx)
	
	context.fillStyle = `rgba(${COIN_YELLOW === 1 ? 0 : 255}, 255, ${255 * (1 - COIN_YELLOW)})`
	context.fillText(`${game.coins} / ${game.moneyAreas.length}`, normalWidth - 10, normalHeight - PANEL / dy)
	context.fillStyle = "white"

	context.textAlign = "left"
	if (couldMenu) {
		context.fillStyle = "red"
		pointer.cursor = true;
		pointer.events.push("menu")
	}
	context.fillText("MENU", 10, PANEL / 2 + dx)
	context.fillStyle = "white"
	context.fillText(`FPS: ${FPS} ${FPS <= 65 ? (FPS <= 45 ? "(LAGGY)" : "(LOW)") : (FPS >= 85 ? "(HIGH)" : "")}`, 10, normalHeight - PANEL / dy)

	var a = getCurrentGlobalTime()
	lastAbsoluteTime = a;

	if (FREE_RUN) {
		a = (game.time % 2 < 1) ? "FREE RUN" : "INVINCIBLE"
		context.fillStyle = "red"
	}

	context.textAlign = "center"
	context.fillText(a, normalWidth / 2, normalHeight - PANEL / dy)

	if (shouldMenu) {
		drawMenu()
	}	
}

function isHovering(x, y, w, h) {
	return mousePos.x > x && mousePos.x < x + w && mousePos.y > y && mousePos.y < y + h;
}

function doForMouseMovements() {
	var pointer = false;

	context.font = "40px arial"
	context.textAlign = "center"

	couldMenu = isHovering(10, 10, 150, 50)

	if (shouldMenu) {
		context.font = "bold 32px sans-serif"
	}
}

function doForClicks() {
	context.font = "40px arial"
	context.textAlign = "center"

	context.textAlign = "center"
	context.font = "bold 32px sans-serif"

	if ((PLAYER_INTRO_INDEX === 0) && PLAYER_INTRO && (mousePos.x > (normalWidth / 2 - 90)) && (mousePos.y > (normalWidth / 2 - 160)) && (mousePos.x < (normalWidth / 2 + 90)) && (mousePos.y < (normalWidth / 2 - 116))) {
		PLAYER_INTRO_TIMESTAMP = performance.now() / 1000;
		PLAYER_INTRO_INDEX = 1;
	}

	if (PLAYER_TIP) {
		progressLevels(false)
		PLAYER_TIP = false;
	}

	if (pointer.events.includes("menu")) {
		shouldMenu = !shouldMenu;
	}

	if (shouldMenu) {
		if (isHovering(normalWidth / 2 - 250, 150, 500, 64)) {
			globalPlayerAttributes.colori = (1 + globalPlayerAttributes.colori) % globalPlayerAttributes.colora.length;
		}

		if (isHovering(normalWidth / 2 - 250, 250, 500, 64)) {
			var sound = document.querySelector("#audio1")
			if (extras.musicPlaying) {
				sound.pause()
			} else {
				sound.play()
			}
			extras.musicPlaying = !extras.musicPlaying;
		}

		if (isHovering(normalWidth / 2 - 250, 350, 500, 64)) {
			theme.MOTION_BLUR = !theme.MOTION_BLUR;
		}

		if (isHovering(normalWidth / 2 - 250, 450, 500, 64)) {
			allLevels.absoluteTimeStart = performance.now() / 1000;
			lastAbsoluteTime = "00:00.00"
			PLAYER_LOBBY = true;
			shouldMenu = false;
			couldMenu = false;
			changeTheme(1)
			PLAYER_INTRO = false;
			ALTERNATE_SCREEN = 0;
			PLAYER_INTRO_INDEX = 0;
			PLAYER_INTRO_TIMESTAMP = 0;
			extras.WRtimes.levelAbsoluteStart = 0;
		}
	}

	if (ALTERNATE_SCREEN === 3) {
		var levelDesigns = {
			1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
			2: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
			4: [30]
		}

		var wh = 90;
		var st = 36;

		for (var key of Object.keys(levelDesigns)) {
			for (var level of levelDesigns[key]) {
				var xl = (level - 1) % 7;
				var yl = (level - 1 - xl) / 7;
				if (isHovering(st + (wh + st) * xl, st + (wh + st) * yl, wh, wh)) {
					ALTERNATE_SCREEN = 0;
					cheat(level)
				}
			}
		}
	}
}

function onhover(x, y, w, h) {
	return mousePos.x > x && mousePos.x < x + w && mousePos.y > y && mousePos.y < y + h;
}

function drawMenu() {
	context.fillStyle = "rgba(0, 0, 0, 0.71)"
	context.fillRect(0, 0, normalWidth, normalHeight)

	context.fillStyle = "white"
	context.textAlign = "center"
	context.textBaseline = "alphabetic"
	context.font = "bold 32px sans-serif"
	context.fillText("Change Player Color", normalWidth / 2, 200)
	context.fillText(`Toggle Music (${extras.musicPlaying ? "Enabled" : "Disabled"})`, normalWidth / 2, 300)
	context.fillText(`Toggle Motion Blur (${theme.MOTION_BLUR ? "Enabled" : "Disabled"})`, normalWidth / 2, 400)
	context.fillText(`Back to Menu`, normalWidth / 2, 500)
}

function drawPlayerTip() {
	drawPanel(true)

	context.textAlign = "left"
	context.font = "600 56px Arial"
	context.fillStyle = "black"
	context.fillText("TIP:", 22, 75)

	var tips = allLevels.tips[allLevels.currentLevel].split("\n")

	context.font = "500 35px Arial"
	context.textBaseline = "start"

	for (var i = 0; i < tips.length; i++) {
		context.fillText(tips[i], (i === 0) ? 150 : 25, 75 + i * 42)
	}

	context.strokeStyle = "black"
	context.fillStyle = "red"
	context.lineWidth = 8;
	context.font = "600 72px Arial"
	context.textAlign = "center"
	context.letterSpacing = "5px"

	context.strokeText("GO", normalWidth / 2, normalHeight - 100)
	context.fillText("GO", normalWidth / 2, normalHeight - 100)

	context.letterSpacing = "0px"
}

function drawPlayerLobby() {
	var time = performance.now() / 1000;

	drawPanel(true)
	
	// var g1 = context.createLinearGradient(0, 0, 200, 0)
	// g1.addColorStop("0", "rgba(255, 0, 0, 0.3)")
	// g1.addColorStop("1", "rgba(0, 0, 0, 0)")
	// context.fillStyle = g1;
	// context.fillRect(0, 0, 200, normalHeight)

	var grad = context.createLinearGradient(0, 0, normalWidth, 0)
	grad.addColorStop("0", "#FF0000")
	grad.addColorStop("0.17", "#FF7F00")
	grad.addColorStop("0.33", "#FFFF00")
	grad.addColorStop("0.5", "#00FF00")
	grad.addColorStop("0.67", "#0000FF")
	grad.addColorStop("0.83", "#4B0082")
	grad.addColorStop("1", "#9400D3")

	context.textAlign = "left"
	context.font = "600 66px Consolas"
	context.fillStyle = grad;
	context.textAlign = "center"
	context.strokeStyle = "black"
	context.lineWidth = 4;
	context.lineJoin = "round"
	context.strokeText("THE WORLD'S HARDEST GAME", normalWidth / 2, 75)
	context.fillText("THE WORLD'S HARDEST GAME", normalWidth / 2, 75)
	context.fillText("________________________", normalWidth / 2, 80)

	context.font = "700 32px Arial"
	context.strokeStyle = "white"
	context.fillStyle = "black"
	context.textAlign = "left"

	var b1 = "This is the World's Hardest Game. This game takes no"
	// context.strokeText(b1, 50, 130)
	context.fillText(b1, 50, 140)

	var b2 = "responsibility for any rage induced, and all desks and"
	// context.strokeText(b2, 50, 170)
	context.fillText(b2, 50, 175)

	var b3 = "keyboards punched will not be taken responsibility of."
	// context.strokeText(b3, 50, 210)
	context.fillText(b3, 50, 210)

	var b4 = "Made by @tovtovim for Replit!"
	context.fillStyle = "rgba(0,0,0,0.5)"
	context.fillText(b4, 20, canvas.height - 32)

	// var a1 = "This game is impossible."
	// context.font = "700 32px Arial"
	// context.fillStyle = "black"
	// context.fillText(a1, normalWidth / 2 - 1, 119)
	// context.fillStyle = "white"
	// context.fillText(a1, normalWidth / 2, 120)

	context.font = "700 50px Arial"
	context.strokeStyle = "black"
	context.fillStyle = "red"
	context.textAlign = "center"
	context.strokeText("(P)LAY LEVELS", normalWidth / 4, 300)
	context.fillText("(P)LAY LEVELS", normalWidth / 4, 300)

	context.strokeText("(F)REE RUN", normalWidth / 4, 375)
	context.fillText("(F)REE RUN", normalWidth / 4, 375)

	context.strokeText("(L)EVEL SELECT", normalWidth / 4, 450)
	context.fillText("(L)EVEL SELECT", normalWidth / 4, 450)
}

function drawWinner() {
	context.fillStyle = "white"
	context.fillRect(0, 0, normalWidth, normalHeight)
	
	context.font = "32px Comic Sans MS"
	context.fillStyle = "black"
	context.textAlign = "center"
	context.textBaseline = "middle"

	if (!FREE_RUN) {
		context.fillText("congrats you won... but at what cost?", normalWidth / 2, normalHeight / 2)
		context.fillText(`final time: ` + lastAbsoluteTime, normalWidth / 2, normalHeight / 2 + 42)
		context.fillText(`final fails: ` + allLevels.fails, normalWidth / 2, normalHeight / 2 + 84)
	} else {
		context.fillText("you thought you could get away with using FREE RUN MODE", normalWidth / 2, normalHeight / 2)
	}
}

function updateAlternate() {
	/**
	 *                                     {{{{{{UPDATEALTERNATE}}}}}}
	 * Some function for completely alternate game screens. Only the winner and higher-than-update screens 
	 * have higher priority than the update alternate screens. Should have thought of this when developing.
	 * 
	 * Code refactoring soon? Complete code remake and revamp soon?
	 */

	//  !BADSUM!
	if (ALTERNATE_SCREEN === 1) {
		// Alternate screen upon load.
		document.querySelector("#audio1").pause()
		document.querySelector("#audio2").play()
		window.win.title = "BADSUM"
		ALTERNATE_SCREEN = 2;
		setTimeout(() => {
			window.win.close(true)
		}, 4500)
	} else if (ALTERNATE_SCREEN === 2) {
		context.drawImage(error, 0, 0, canvas.width, canvas.height)
		canvas.style.cursor = "none"
		document.body.style.cursor = "none"
	}
	//  !BADSUM!

	//  !LEVELSELECT!
	if (ALTERNATE_SCREEN === 3) {
		drawPanel(true)

		var levelDesigns = {
			1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
			2: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
			4: [30]
		}

		var wh = 90;
		var st = 36;

		for (var key of Object.keys(levelDesigns)) {
			changeTheme(parseInt(key))

			for (var level of levelDesigns[key]) {
				var xl = (level - 1) % 7;
				var yl = (level - 1 - xl) / 7;
				context.fillStyle = "black"
				context.fillRect(st + (wh + st) * xl, st + (wh + st) * yl, wh, wh)
				context.fillStyle = theme.walls;
				context.fillRect(st + 2 + (wh + st) * xl, st + 2 + (wh + st) * yl, wh - 4, wh - 4)

				context.font = "48px arial"
				context.fillStyle = "black"
				context.fillText(level.toString(), st + (wh + st) * xl + 0.5 * wh, st + (wh + st) * yl + 0.5 * wh + 17)
			}
		}

		// Back to normal :)
		changeTheme(1)

		context.fillText("(B)ACK", canvas.width / 2, canvas.height - 64)
	}
	//  !LEVELSELECT!
}

function update() {
	requestAnimationFrame(update)
	if (!shouldMenu) {
		game.time = performance.now() / 1000 - game.start;
		DT = game.time - TIME_THEN;
		TIME_THEN = game.time;
	} else {
		game.start = performance.now() / 1000 - TIME_THEN;
	}

	FPS = Math.round(1 / DT / 5) * 5;

	clearCanvas()

	pointer.cursor = false;
	pointer.events = []

	if (!!extras.badsumkey[extras.badsumcounter] && keys[extras.badsumkey[extras.badsumcounter]] && ALTERNATE_SCREEN === 0) {
		if (++extras.badsumcounter >= extras.badsumkey.length) {
			ALTERNATE_SCREEN = 1;
		}
	}

	if (!WINNER) {
		if (ALTERNATE_SCREEN === 0) {
			if (PLAYER_INTRO) {
				intro()
			} else if (PLAYER_LOBBY) {
				drawPlayerLobby()
			} else if (PLAYER_TIP) {
				drawPlayerTip()
			} else if ((DEVELOPER && game.time > 0.1) || (game.time > 1.5)) {
				var vel = 3.9;
				game.player.v = vel * UNIT * DT;
				context.translate(0, PANEL)
				if (!shouldMenu) input()
				update1()
				draw()

				context.translate(0, -PANEL)
				drawUp()
			} else {
				drawPanel()
			}
			canvas.style.cursor = pointer.cursor ? "pointer" : "default"
		} else {
			updateAlternate()
		}
	} else {
		drawWinner()
	}
}

function intro() {
	context.fillStyle = "black"
	context.fillRect(0, 0, normalWidth, normalHeight)

	if (PLAYER_INTRO_INDEX === 0) {
		context.fillStyle = "white"
		context.font = "24px arial"
		context.textAlign = "center"
		context.fillText("WARNING: You are about to ", normalWidth / 2, normalHeight / 2 + 25)
		context.fillText("play the World's Hardest Game.", normalWidth / 2, normalHeight / 2 + 50)

		var a = "white"

		if ((mousePos.x > (normalWidth / 2 - 90)) && (mousePos.y > (normalWidth / 2 - 160)) && (mousePos.x < (normalWidth / 2 + 90)) && (mousePos.y < (normalWidth / 2 - 116))) {
			a = "red"
		}

		context.strokeStyle = a;
		context.lineWidth = 2;
		context.strokeRect(normalWidth / 2 - 90, normalWidth / 2 - 160, 180, 44)

		context.font = "22px arial"
		context.textBaseline = "alphabetical"
		context.fillStyle = a;
		context.fillText("PLAY", normalWidth / 2, normalHeight / 2 - 23)
	} else if (PLAYER_INTRO_INDEX === 1) {
		var sec = (performance.now() / 1000) - PLAYER_INTRO_TIMESTAMP;
		context.font = "32px arial"
		context.textBaseline = "alphabetical"
		context.fillStyle = `rgba(255, 0, 0, ${Math.min(1, (sec) / 4)}`
		context.fillText("42flowermaster presents...", normalWidth / 2, normalHeight / 2 - 23)
		context.fillStyle = `rgba(0, 255, 0, ${Math.min(1, (sec - 4) / 6)}`
		context.fillText("THE WORLD'S HARDEST GAME", normalWidth / 2, normalHeight / 2 + 12)

		context.fillStyle = "white"
		context.fillText("(Press S to skip)", normalWidth / 2, normalHeight - 10)

		if (sec > 13) {
			document.querySelector("#audio1").play()
			PLAYER_INTRO_TIMESTAMP = performance.now() / 1000;
			PLAYER_INTRO_INDEX = 2;
		}
	} else if (PLAYER_INTRO_INDEX === 2) {
		var sec = (performance.now() / 1000) - PLAYER_INTRO_TIMESTAMP;
		context.font = "32px arial"
		context.textBaseline = "alphabetical"
		context.fillStyle = "rgb(255, 0, 0)"
		context.fillText("42flowermaster presents...", normalWidth / 2, normalHeight / 2 - 23)
		context.fillStyle = "rgb(0, 255, 0"
		context.fillText("THE WORLD'S HARDEST GAME", normalWidth / 2, normalHeight / 2 + 12)

		if (sec > 2) {
			PLAYER_INTRO = false;
			PLAYER_LOBBY = true;
		}
	} else if (PLAYER_INTRO_INDEX === 3) {
			PLAYER_INTRO = false;
		PLAYER_LOBBY = true;
	}
}

function changeTheme(number) {
	/**
	 * Changes the theme of everything based on the level difficulty.
	 */
	if (number === 5) {
		theme.walls = "#777777"
		theme.enemy = "#555555"
		theme.grad1 = "#aaaaaa"
		theme.grad2 = "#888888"
		theme.tile1 = "#f2f2f2"
		theme.tile2 = "#dadada"
	} else if (number === 4) {
		theme.walls = "#fc565b"
		theme.enemy = "#ee0000"
		theme.grad1 = "#fab4af"
		theme.grad2 = "#f2f2f2"
		theme.tile1 = "#f2f0f9"
		theme.tile2 = "#f5dcde"
	} else if (number === 2) {
		theme.walls = "#d2bef0"
		theme.enemy = "#5638c5"
		theme.grad1 = "#d2bef0"
		theme.grad2 = "#e5d8e8"
		theme.tile1 = "#f1f0f9"
		theme.tile2 = "#e1d5e7"
	} else if (number === 1) {
		theme.walls = "#b2b3fe"
		theme.enemy = "#0000dd"
		theme.grad1 = "#adb7f0"
		theme.grad2 = "#ddddff"
		theme.tile1 = "#f5f8fe"
		theme.tile2 = "#dcdefd"
	}
}

function start() {
	WRdata()

	game = deepCopy(allLevels.levels[allLevels.currentLevel - 1])

	extras.WRtimes.levelAbsoluteStart = performance.now() / 1000;

	// tile1 #f5f8fe   
	// tile2 #dcdefd  
	var cl = allLevels.currentLevel;

	if (!!game.wallColors) cl = -1;

	if (game.wallColors === 5) {
		changeTheme(5)
	} else if ((cl >= 30) || (game.wallColors === 4)) {
		changeTheme(4)
	} else if ((cl >= 20) || (game.wallColors === 2)) {
		changeTheme(2)
	} else if ((cl >= 0) || (game.wallColors === 1)) {
		changeTheme(1)
	}

	game.player = {
		w: 0.74 * UNIT,
		h: 0.74 * UNIT,
		x: 0,
		y: 0,
		x0: 0,
		y0: 0,
		v: 0.05 * UNIT,
		c: {
			x: 0,
			y: 0,
		},
		id1: -1,
		opacity: 1,
	}

	game.coins = 0;

	var id1 = 0;

	for (var element of game.elements) {
		if (element.role === "checkpoint") {
			if (element.type === "start") {
				game.player.c.x = element.x * UNIT + (element.w * UNIT - game.player.w) / 2;
				game.player.c.y = element.y * UNIT + (element.h * UNIT - game.player.h) / 2;

				game.player.x = game.player.c.x;
				game.player.y = game.player.c.y;
			}
		}

		element.oof = 1;
		
		if (element.special === "start") {
			element.id = game.elements.filter(a => a.type === "start")[0].id;
		} else {
			if (element.type !== "dnc") {
				element.id = id1++
			} else {
				element.id = id1 - 1;
			}
		}
	}

	for (var enemy of game.enemies) {
		enemy.x += 0.5;
		enemy.y += 0.5;

		enemy.xs = enemy.x;
		enemy.ys = enemy.y;
	}

	game.moneyAreas = game.moneyAreas === "" ? [] : game.moneyAreas.split(" ").map(a => {
		var [x, y] = a.split(",").map(b => parseFloat(b))

		return {
			x: x + 0.5,
			y: y + 0.5,
			done: false,
			collected: false,
		}
	})

	game.start = performance.now() / 1000;
}

if (!PLAYER_INTRO && !PLAYER_LOBBY) {
	allLevels.absoluteTimeStart = performance.now() / 1000;
	start()
}

update()

document.addEventListener("keydown", function (e) {
	if ((PLAYER_INTRO_INDEX === 1) && e.key === "s") {
		document.querySelector("#audio1").play()
		PLAYER_INTRO_INDEX = 3;
	}

	if (!PLAYER_INTRO && PLAYER_LOBBY && ALTERNATE_SCREEN === 0) {
		if (e.key === "p") {
			levelProgressionSound.play()

			allLevels.absoluteTimeStart = performance.now() / 1000;
			PLAYER_LOBBY = false;
			FREE_RUN = false;
			start()
		}

		if (e.key === "f") {
			levelProgressionSound.play()

			allLevels.absoluteTimeStart = performance.now() / 1000;
			PLAYER_LOBBY = false;
			FREE_RUN = true;
			start()
		}

		if (e.key === "l") {
			enemySound.currentTime = 0;
			enemySound.play()
			ALTERNATE_SCREEN = 3;
		}
	} else if (!PLAYER_INTRO && !PLAYER_LOBBY && !keys[e.key] && e.key === "r") {
		enemySound.currentTime = 0;
		enemySound.play()
		//checkpoint()
	}

	if (ALTERNATE_SCREEN === 3 && e.key === "b") {
		enemySound.currentTime = 0;
		ALTERNATE_SCREEN = 0;
		enemySound.play()
	}

	keys[e.key] = true;
})

document.addEventListener("keyup", function (e) {
	keys[e.key] = false;
})

window.addEventListener("resize", function(e) {
	resizeCanvas()
}, true)

document.addEventListener("contextmenu", event => event.preventDefault()) /// May be annoying for some users...

/**
 * SourceVisualCanvasUpdateLoop Asparagus Watermelon Healthy Foods at the Grocery Store 
 */
var canvasV = document.querySelector("#canvas")
var contextV = canvasV.getContext("2d")
var factorV = 1;

contextV.webkitImageSmoothingEnabled = false;
contextV.mozImageSmoothingEnabled = false;
contextV.imageSmoothingEnabled = false;

canvasV.width = UNIT * WIDTH;
canvasV.height = UNIT * HEIGHT + 2 * PANEL;

var nw = canvasV.width;
var nh = canvasV.height;

canvasV.style.width = `${canvasV.width}px`
canvasV.style.height = `${canvasV.height}px`

resizeCanvas()

function visualCanvasUpdateLoop() {
	requestAnimationFrame(visualCanvasUpdateLoop)
	contextV.clearRect(0, 0, canvasV.width, canvasV.height)
	contextV.drawImage(canvas, 0, 0)
	canvasV.style.cursor = canvas.style.cursor;
}

requestAnimationFrame(visualCanvasUpdateLoop)

canvasV.addEventListener("mousemove", function (e) {
	var rect = canvasV.getBoundingClientRect()
	mousePos.x = (e.clientX - rect.left) / factorV;
	mousePos.y = (e.clientY - rect.top) / factorV;

	doForMouseMovements()
})

canvasV.addEventListener("click", function (e) {
	doForClicks()
})

function resizeCanvas() {
	factorV = Math.min(parseInt(window.getComputedStyle(document.body).height) / 708, parseInt(window.getComputedStyle(document.body).width) / 924)

	canvasV.width = nw * factorV;
	canvasV.height = nh * factorV;
	contextV.transform(factorV, 0, 0, factorV, 0, 0)

	canvasV.style.width = `${canvasV.width}px`
	canvasV.style.height = `${canvasV.height}px`

	contextV.webkitImageSmoothingEnabled = false;
	contextV.mozImageSmoothingEnabled = false;
	contextV.imageSmoothingEnabled = false;
}