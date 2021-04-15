(function() {
	"use strict";

	/* Pure functions */
	const insideRect = (x, y, rect) => (x >= rect.x && x <= rect.x + rect.width) && (y >= rect.y && y <= rect.y + rect.height);
	const random = (min, max) => Math.floor(Math.random() * max + min);

	/* Constants and variables */
	// Canvas and content
	const canvas = document.getElementById("mainCanvas");
	const ctx = canvas.getContext("2d");

	// State-related
	const stateEnum = Object.freeze({"settings":1, "game":2});
	let gameState = stateEnum.settings;

	// Timer-related
	let isTimerOn = true;
	let minutes = 0;
	let seconds = 0;

	// Events-related
	let mouseX, mouseY;

	// Settings-related
	let dialogRect = {
		x: 450,
		y: 100,
		width: 400,
		height: 300,
		border: 2,
		color: "#aaa"
	};

	let dialogCBMulti = {
		x: dialogRect.x + 5,
		y: dialogRect.y + 5,
		width: dialogRect.width - 10,
		height: 30,
		color: "#bbb",
		text: "Add new box every 10th score?",
		checkbox: true
	};

	let dialogCBRandom = {
		x: dialogRect.x + 5,
		y: dialogRect.y + 5 + 30 + 2,
		width: dialogRect.width - 10,
		height: 30,
		color: "#bbb",
		text: "Randomize box size?",
		checkbox: true
	};

	let dialogCBRandomMove = {
		x: dialogRect.x + 5,
		y: dialogRect.y + 5 + 30 + 2 + 30 + 2,
		width: dialogRect.width - 10,
		height: 30,
		color: "#bbb",
		text: "Randomize box movement?",
		checkbox: true
	};

	let dialogCBSquare = {
		x: dialogRect.x + 5,
		y: dialogRect.y + 5 + 30 + 2 + 30 + 2 + 30 + 2,
		width: dialogRect.width - 10,
		height: 30,
		color: "#bbb",
		text: "Make boxes square?",
		checkbox: true
	};

	let dialogStart = {
		x: dialogRect.x + 5,
		y: dialogRect.y + dialogRect.height - 55,
		width: dialogRect.width - 10,
		height: 50,
		color: "#aea",
		text: "Start"
	};

	// Game-related
	let score = 0;

	let boxes = [
		{
			x: random(0, 320), y: random(0, 320),
			dx: 1, dy: 1,
			width: 60,
			height: 60,
			color: "red"
		}
	];

	// Colors
	let colors = ["orange", "yellow", "pink", "white", "brown", "blue", "red"];

	/* Main functions */
	function events(e) {
		mouseX = e.clientX - canvas.getBoundingClientRect().left;
		mouseY = e.clientY - canvas.getBoundingClientRect().top;

		switch (gameState) {
			case stateEnum.settings:
			events_settings(e);
			break;
			case stateEnum.game:
			events_game(e);
			break;
		}
	}

	canvas.addEventListener("click", events);
	canvas.addEventListener("mousedown", events);
	canvas.addEventListener("mouseup", events);

	function loop() {
		canvas.width = (window.innerWidth > 320) ? window.innerWidth : 320;
		canvas.height = (window.innerHeight > 320) ? window.innerHeight : 320;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw_game(); // We want game to be drawn behind the settings menu

		switch (gameState) {
			case stateEnum.settings:
			loop_settings();
			draw_settings();
			break;
			case stateEnum.game:
			loop_game();
			break;
		}
	}
	setInterval(loop, 10);

	function timer() {
		if (isTimerOn && gameState == stateEnum.game) {
			seconds++;
			if (seconds >= 60) {
				minutes++;
				seconds = 0;
			}
		}
	}
	setInterval(timer, 1000);

	/* Settings state functions */
	function events_settings(e) {
		if (insideRect(mouseX, mouseY, dialogCBMulti)) {
			dialogCBMulti.checkbox = (dialogCBMulti.checkbox) ? false : true;
		}
		if (insideRect(mouseX, mouseY, dialogCBRandom)) {
			dialogCBRandom.checkbox = (dialogCBRandom.checkbox) ? false : true;
		}
		if (insideRect(mouseX, mouseY, dialogCBRandomMove)) {
			dialogCBRandomMove.checkbox = (dialogCBRandomMove.checkbox) ? false : true;
		}
		if (insideRect(mouseX, mouseY, dialogCBSquare)) {
			dialogCBSquare.checkbox = (dialogCBSquare.checkbox) ? false : true;
		}
		if (insideRect(mouseX, mouseY, dialogStart)) {
			gameState = stateEnum.game;
		}
	}

	function loop_settings() {
	}

	function draw_settings() {
		Div.drawRect(dialogRect);
		Div.drawButton(dialogCBMulti);
		Div.drawButton(dialogCBRandom);
		Div.drawButton(dialogCBRandomMove);
		Div.drawButton(dialogCBSquare);
		Div.drawButton(dialogStart);
	}

	/* Game state functions */
	function events_game(event) {
		boxes.forEach((box) => {
			if (insideRect(mouseX, mouseY, box)) {
				// Increase score
				score += 1;

				// Change clicked box' position & size
				box.x = random(1, canvas.width - box.width - 5);
				box.y = random(1, canvas.height - box.height - 5);

				if (dialogCBRandom.checkbox) {
					box.width = random(40, 80);
					box.height = random(40, 80);
				} else {
					box.width = 100;
					box.height = 100;
				}

				if (dialogCBSquare.checkbox == true) {
					box.width = box.height;
				}

				// Change clicked box' speed (dx and dy)
				box.dx = random(1+score/10, score/10);
				box.dy = random(1+score/10, score/10);

				// Create new box (if user also wants it)
				if (score % 10 == 0 && dialogCBMulti.checkbox == true) {
					let tempWidth = 60;
					let tempHeight = 60;

					if (dialogCBRandom.checkbox) {
						tempWidth = random(40, 80);
						tempHeight = random(40, 80);
					}

					if (dialogCBSquare) {
						tempWidth = tempHeight;
					}

					boxes.push({
						x: random(1, 320), y: random(1, 320),
						dx: random(1 + score/10, score/10), dy: random(1 + score/10, score/10),
						width: tempWidth,
						height: tempHeight,
						color: colors[random(0, colors.length - 1)],
					});
				}
			}
		});
	}

	function loop_game() {
		boxes.forEach((box) => {
			// Move the box
			box.x += box.dx;
			box.y += box.dy;

			// Check & handle wall collision
			if (box.x <= 0 || box.x + box.width >= canvas.width) {
				box.x = (box.x <= 0) ? 0 : canvas.width - box.width;
				box.dx = -box.dx;
			}
			if (box.y <= 0 || box.y + box.height >= canvas.height) {
				box.y = (box.y <= 0) ? 0 : canvas.height - box.height;
				box.dy = -box.dy;
			}
		});
	}

	function draw_game() {
		boxes.forEach((box) => Div.drawRect(box));
		Div.drawText("Score " + score, 5, 30);
		Div.drawText("Total time " + minutes + ":" + seconds, 5, 65);
	}
}());
