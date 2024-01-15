import * as PIXI from "pixi.js";

let app = new PIXI.Application({
	width: 800,
	height: 600,
	backgroundColor: "#234234",
});

let gravity = 1;
const gravityStep = 0.1;
let rate = 1000;
let intervalID;

document.getElementById("game-canvas").appendChild(app.view);
document.getElementById("game-canvas").style = document.getElementById(
	"game-canvas"
).style =
	"margin: auto; display: flex; justify-content: center; align-items: center; margin-top: 50px;";
const gravityPlus = document.getElementById("increase-gravity");
const gravityMinus = document.getElementById("decrease-gravity");
const gravityValue = document.getElementById("gravity-value");

const ratePlus = document.getElementById("increase-rate");
const rateMinus = document.getElementById("decrease-rate");
const rateValue = document.getElementById("rate-value");

const shapesNo = document.getElementById("numberOfShapes");

gravityValue.textContent = Math.floor(gravity * 10);
rateValue.textContent = rate;
let shapes = [];

const addRandomShapeListener = (event) => {
	const element = app.view.getBoundingClientRect();
	const x = event.clientX - element.left;
	const y = event.clientY - element.top;

	generateRandomShape(x, y);
};

class Shape extends PIXI.Graphics {
	constructor(x, y, width, height) {
		super();
		this.x = x;
		this.y = y;
		this.velocityY = 0;
		this.width = width;
		this.height = height;
		let color = Math.random() * 0xffffff;
		this.beginFill(color);
		this.drawRect(0, 0, width, height);
		this.endFill();
		this.interactive = true;
		this.buttonMode = true;
		this.on("pointerdown", this.onShapeClick);
	}

	onShapeClick(event) {
		app.stage.removeChild(this);
	}

	update() {
		this.y += this.velocityY;
	}
}

app.view.addEventListener("click", addRandomShapeListener);

function generateRandomShape(x = Math.random() * app.screen.width, y = 0) {
	let width = Math.random() * 100 + 50;
	let height = Math.random() * 100 + 50;
	let rect = new Shape(x, y - height, width, height);
	shapes.push(rect);
	app.stage.addChild(rect);
}

app.ticker.add(() => {
	shapesNo.textContent = shapes.length;
	shapes.forEach((rect) => {
		rect.velocityY = gravity;
		rect.update();
		if (rect.y > app.screen.height) {
			app.stage.removeChild(rect);
			shapes.splice(shapes.indexOf(rect), 1);
		}
	});
});

app.view.addEventListener("click", () => {
	generateRandomShape();
});

// gravity controls
gravityPlus.addEventListener("click", () => {
	if (gravity < 3) {
		gravity = gravity + gravityStep;
		gravityValue.textContent = Math.floor(gravity * 10);
	}
});

gravityMinus.addEventListener("click", () => {
	if (gravity > 0.1) {
		gravity -= gravityStep;
		gravityValue.textContent = Math.floor(gravity * 10);
	}
});

// spawn rate speed controls
ratePlus.addEventListener("click", () => {
	if (rate < 2000) {
		rate += 100;
		setShapeInterval(rate);
		rateValue.textContent = rate;
	}
});

rateMinus.addEventListener("click", () => {
	if (rate > 100) {
		rate -= 100;
		setShapeInterval(rate);
		rateValue.textContent = rate;
	}
});

// set first interval for shape spawn
intervalID = setInterval(() => {
	generateRandomShape();
}, rate);

// update the interval
const setShapeInterval = (interval) => {
	clearInterval(intervalID);
	intervalID = setInterval(() => {
		generateRandomShape();
	}, interval);
};
