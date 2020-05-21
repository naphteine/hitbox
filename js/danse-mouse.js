// TODO: Major clean-up
// TODO: Make it more humane and make it get harder better -faster stronger-
let canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

const size = {
	big: 100,
	gap: 2
};

let box = {
	x: 20, y: 20,
	dxm: 1, dym: 1,
	width: 20, height: 20
};

let score = 0;

box.width = box.height = (Math.floor(Math.random() * (size.big - score*2)) + ((size.big - size.gap) - score*2));

function main() {
	// Updating
	canvas.width = (window.innerWidth > 800) ? window.innerWidth : 800;
	canvas.height = (window.innerHeight > 500) ? window.innerHeight : 500;

	box.x += box.dxm * (Math.random() * (score + 1) + 1);
	box.y += box.dym * (Math.random() * (score + 1) + 1);

	if (box.x <= 0 || box.x + box.width >= canvas.width) {
		if (box.x <= 0) box.x = 0;
		else if (box.x + box.width >= canvas.width) box.x = canvas.width - box.width;
		box.dxm = -box.dxm;
	}

	if (box.y <= 0 || box.y + box.height >= canvas.height) {
		if (box.y <= 0) box.y = 0;
		else if (box.y + box.height >= canvas.height) box.y = canvas.height - box.height;
		box.dym = -box.dym;
	}

	// Event handling
	canvas.addEventListener("click", function(event) {
		mouseX = event.clientX - canvas.getBoundingClientRect().left;
		mouseY = event.clientY - canvas.getBoundingClientRect().top;

		if (mouseX >= box.x && mouseX <= box.x + box.width &&
			mouseY >= box.y && mouseY <= box.y + box.height) {
			score++;
			box.x = (Math.random() * (canvas.width - box.width - 5) + 1);
			box.y = (Math.random() * (canvas.height - box.height - 5) + 1);
			box.width = box.height = (Math.floor(Math.random() * (size.big - score*2)) + ((size.big - size.gap) - score*2));
		}
	})

	// Drawing
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.fillRect(box.x, box.y, box.width, box.height);
	ctx.stroke();

	ctx.font = "24px serif";
	ctx.strokeText(score + " Points", 5, 30);
}
setInterval(main, 10);
