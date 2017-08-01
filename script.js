let canvas = document.querySelector("canvas"),
	ctx = canvas.getContext("2d"),
	width = canvas.width = 660,
	height = canvas.height = 480,
	info = document.getElementById("info"),
	ictx = info.getContext("2d"),
	tile = 30,
	component = "mark", //var indicationg which button has been pressed last time/action doing right now
	elements = [],
	offset = {}, // cursor offset
	isDragging = false, //flag, if any object is dragged
	dragHandle = undefined, // indicating dragged object(s)
	cursor = undefined,
	line = undefined;

	info.width = 660, info.height = 80;

class Entity {
	constructor(x, y, direction, type) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.type = type;
		this.horizontal = (direction === "left" || direction === "right")?true:false;
	}
}

class Line {
	constructor(x1,y1,x2,y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
}

function drawResistor(x, y, direction) {
	let xs = [0, tile/2, tile/2, 1.5*tile, 1.5*tile, tile/2, tile/2, 1.5*tile, 2*tile],
		ys = [0, 0, -0.25*tile, -0.25*tile, 0.25*tile, 0.25*tile, 0, 0, 0];

	if (direction === "up" || direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	// if (direction === "left" || direction === "down") {
	// 	xs = xs.map(cord => 2*tile-cord);
	// 	ys = ys.map(cord => 2*tile-cord);
	// }

	ctx.strokeStyle = "#000";
	ctx.beginPath();
	ctx.moveTo(x+xs[0], y+ys[0]);
	ctx.lineTo(x+xs[1], y+ys[1]);
	ctx.lineTo(x+xs[2], y+ys[2]);
	ctx.lineTo(x+xs[3], y+ys[3]);
	ctx.lineTo(x+xs[4], y+ys[4]);
	ctx.lineTo(x+xs[5], y+ys[5]);
	ctx.lineTo(x+xs[6], y+ys[6]);
	ctx.moveTo(x+xs[7], y+ys[7]);
	ctx.lineTo(x+xs[8], y+ys[8]);
	ctx.stroke();
}

function drawCapacitator(x, y, direction) {
	let xs = [0,0.75*tile,0.75*tile,0.75*tile,1.25*tile,1.25*tile,1.25*tile,2*tile],
		ys = [0,0,-0.35*tile,0.35*tile,-0.35*tile,0.35*tile,0,0];

	if (direction === "up" || direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	// if (direction === "left" || direction === "down") {
	// 	xs = xs.map(cord => 2*tile-cord);
	// 	ys = ys.map(cord => 2*tile-cord);
	// }

	ctx.strokeStyle = "#000";
	ctx.beginPath();
	ctx.moveTo(x+xs[0],y+ys[0]);
	ctx.lineTo(x+xs[1],y+ys[1]);
	ctx.moveTo(x+xs[2],y+ys[2]);
	ctx.lineTo(x+xs[3],y+ys[3]);
	ctx.moveTo(x+xs[4],y+ys[4]);
	ctx.lineTo(x+xs[5],y+ys[5]);
	ctx.moveTo(x+xs[6],y+ys[6]);
	ctx.lineTo(x+xs[7],y+ys[7]);
	ctx.stroke();
}

function draw() {
	ctx.clearRect(0,0,width,height);
	// ctx.fillStyle = "#f7f7f7";
	ctx.fillStyle = "#fff";
	ctx.fillRect(0,0,width,height);

	ictx.clearRect(0,0,660,200);
	ictx.fillStyle = "#fff";
	ictx.fillRect(0,0,660,200);

	//draw grid
	ctx.strokeStyle = "#ddd";
	ctx.beginPath();
	for (let i=tile; i<height; i+=tile) {
		ctx.moveTo(tile,i);
		ctx.lineTo(width-tile,i);
	}
	for (let i=tile; i<width; i+=tile) {
		ctx.moveTo(i,tile);
		ctx.lineTo(i,height-tile);
	}
	ctx.stroke();

	//draw outline to clicked/draggable object
	if (dragHandle !== undefined) {
		ctx.fillStyle = "#345";
		let border = dragHandle.direction === "left" || dragHandle.direction === "right" ? 
			{x1:dragHandle.x,y1:dragHandle.y-0.33*tile,x2:dragHandle.x+2*tile,y2:dragHandle.y+0.33*tile}:
			{x1:dragHandle.x-0.33*tile,y1:dragHandle.y,x2:dragHandle.x+0.33*tile,y2:dragHandle.y+2*tile};
		ctx.fillRect(border.x1,border.y1,border.x2-border.x1,border.y2-border.y1);
	}

	elements.forEach(element => {
		if (element.type === "capacitator")
			drawCapacitator(element.x, element.y, element.direction);
		else if (element.type === "resistor")
			drawResistor(element.x, element.y, element.direction);
		else if (element instanceof Line) {
			ctx.strokeStyle = "#000";
			ctx.beginPath();
			ctx.moveTo(element.x1,element.y1);
			ctx.lineTo(element.x2,element.y2);
			ctx.stroke();
		}
	});

	if (line !== undefined && component === "line") {
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(line.x1,line.y1);
		ctx.lineTo(cursor.x,cursor.y);
		ctx.stroke();	
	}

	if (cursor!==undefined) {
		if (cursor.type === "resistor")
			drawResistor(cursor.x,cursor.y,cursor.direction);
		else if (cursor.type === "capacitator")
			drawCapacitator(cursor.x,cursor.y,cursor.direction);
		else if (cursor.type === "line") {
			ctx.fillStyle = "#000";
			ctx.fillRect(cursor.x-4,cursor.y-4,8,8);
		}
	}

	if (dragHandle != undefined) {
		debug({"cur_component":component,"x":dragHandle.x,"y":dragHandle.y,"dir":dragHandle.direction,"horizontal":dragHandle.horizontal})
	}
}

canvas.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	component = "mark";
	dragHandle = undefined;
	cursor = undefined;
	line = undefined;
	draw();
	return false;
}, false);

canvas.addEventListener("mousedown", event => {
	if (event.button === 0) {
		let mouse = getMouse(event);

		if (component === "mark") {
			elements.forEach(element => {

				let border = element.direction === "left" || element.direction === "right" ? 
					{x1:element.x,y1:element.y-0.33*tile,x2:element.x+2*tile,y2:element.y+0.33*tile}:
					{x1:element.x-0.33*tile,y1:element.y,x2:element.x+0.33*tile,y2:element.y+2*tile};

				if (mouse.x >= border.x1 && mouse.x <= border.x2 && mouse.y >= border.y1 && mouse.y <= border.y2) {
					isDragging = true;
					dragHandle = element;
					canvas.removeEventListener("mousemove", tempIcon);
					cursor = undefined
					canvas.addEventListener("mousemove", onMouseMove);
					canvas.addEventListener("mouseup", onMouseUp);
					// dragHandle.push(element);
					offset.x = mouse.x - element.x;
					offset.y = mouse.y - element.y;
					draw();
				}
			});
		}
		else if (!isDragging && component !== "mark" && component !== "line") {
			let e = new Entity(Math.floor((mouse.x-tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,"left",component);
			elements.push(e);
			draw();
		}
		else if (component === "line") {
			if (line === undefined) {
				line = {x1: Math.floor((mouse.x+tile/2)/tile)*tile, y1: Math.floor((mouse.y+tile/2)/tile)*tile};
				canvas.addEventListener("mousemove", drawLine);
			}
			else {
				let l = new Line(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,line.x1,line.y1);
				elements.push(l);
				line = undefined;
				canvas.removeEventListener("mousemove", drawLine);
			}
		}
	}
});

canvas.addEventListener("mousemove", tempIcon);
canvas.addEventListener("mousemove", drawLine);

function drawLine(event) {
	let mouse = getMouse(event);
	// line.mousex = Math.floor((mouse.x+tile/2)/tile)*tile;
	// line.mousey = Math.floor((mouse.y+tile/2)/tile)*tile;
	draw();
}

function onMouseMove(event) {
	let mouse = getMouse(event);
	dragHandle.x = Math.floor((mouse.x+(dragHandle.horizontal?-tile/2:tile/2)/* - offset.x*/)/tile)*tile;
	dragHandle.y = Math.floor((mouse.y+(dragHandle.horizontal?tile/2:-tile/2)/* - offset.y*/)/tile)*tile;
	draw(); // to get/get rid of outline
}

function onMouseUp(event) {
	canvas.removeEventListener("mousemove", onMouseMove);
	canvas.removeEventListener("mouseup", onMouseUp);
	canvas.addEventListener("mousemove", tempIcon);
	isDragging = false;
	draw(); // to get/get rid of outline
}

function tempIcon(event) {
	let mouse = getMouse(event);
	if (component !== "mark") {
		cursor = new Entity(Math.floor((mouse.x-tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,"left",component)
		if (cursor.type === "line") {
			cursor.x += tile;
		}
	}
	else
		cursor = undefined;
}

function getMouse(event) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX-rect.left,
		y: event.clientY-rect.top
	}
}

function changeComponent(arg) {
	component = arg;
	cursor = undefined;
	dragHandle = undefined;
	draw();
}

function del() {
	elements.splice(elements.indexOf(dragHandle),1);
	draw();
}

function rotate() {
	if (dragHandle.direction === "left") 
		dragHandle.direction = "up";
	else if (dragHandle.direction === "up")
		dragHandle.direction = "right";
	else if (dragHandle.direction === "right")
		dragHandle.direction = "down";
	else
		dragHandle.direction = "left";

	dragHandle.horizontal = (dragHandle.direction === "left" || dragHandle.direction === "right")?true:false;

	if (dragHandle.horizontal) {
		dragHandle.x-=tile;
		dragHandle.y+=tile;
	}
	else {
		dragHandle.x+=tile;
		dragHandle.y-=tile;
	}
}

function update() {
	draw();
	requestAnimationFrame(update);
}
update();

function debug(obj) {
	ictx.fillStyle = "#000";
	ctx.font = '14px arial';
	let x = 10, y = 10;
	for (o in obj) {
		ictx.fillText(o+":"+obj[o],x,y);
		y+=20;
		if (y>=90) {
			y = 10, x+=150;
		}
	}
}

// let res1 = new Entity(tile,tile,"down","capacitator");
// let res2 = new Entity(4*tile,5*tile,"left","capacitator");
// elements.push(res1);
// elements.push(res2);