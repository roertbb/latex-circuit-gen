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
	line = undefined,
	basic_rotate = false;

	info.width = 660, info.height = 80;

class Entity {
	constructor(x, y, direction, type) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.type = type;
		this.horizontal = (direction === "left" || direction === "right")?true:false;
		this.label = type==="capacitator"?"C":type==="resistor"?"R":"dunno";
		this.flipLabel = false;
	}
}

class Line {
	constructor(x1,y1,x2,y2) {
		this.x = x1<=x2?x1:x2;
		this.y = y1<=y2?y1:y2;
		this.len = x1===x2?Math.abs(y2-y1):Math.abs(x2-x1);
		this.horizontal = (/*x1 === x2 || */y1 === y2);
	}
}

function drawResistor(x, y, direction, label, flip) {
	let xs = [-tile, -tile/2, -tile/2, 0.5*tile, 0.5*tile, -tile/2, -tile/2, 0.5*tile, tile],
		ys = [0, 0, -0.25*tile, -0.25*tile, 0.25*tile, 0.25*tile, 0, 0, 0];

	if (direction === "up" || direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	// if (direction === "left" || direction === "down") {
	// 	xs = xs.map(cord => 2*tile-cord);
	// 	ys = ys.map(cord => 2*tile-cord);
	// }

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

	let label_x, label_y;
	if (flip) {
		label_x = x + (direction==="up"?-tile/2*(1+label.length/2):direction==="down"?tile/2:-tile/4*label.length/2),
		label_y = y + (direction==="left"?-tile/2:direction==="right"?0.75*tile:tile/6);	
	}
	else {
		label_x = x + (direction==="up"?tile/2:direction==="down"?-tile/2*(1+label.length/2):-tile/4*label.length/2),
		label_y = y + (direction==="left"?0.75*tile:direction==="right"?-tile/2:tile/6);
	}
	ctx.fillText(label,label_x,label_y);
}

function drawCapacitator(x, y, direction, label, flip) {
	let xs = [-tile,-0.25*tile,-0.25*tile,-0.25*tile,0.25*tile,0.25*tile,0.25*tile,tile],
		ys = [0,0,-0.35*tile,0.35*tile,-0.35*tile,0.35*tile,0,0];

	if (direction === "up" || direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	// if (direction === "left" || direction === "down") {
	// 	xs = xs.map(cord => 2*tile-cord);
	// 	ys = ys.map(cord => 2*tile-cord);
	// }

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

	let label_x, label_y;
	if (flip) {
		label_x = x + (direction==="up"?-tile/2*(1+label.length/2):direction==="down"?tile/2:-tile/4*label.length/2),
		label_y = y + (direction==="left"?-tile/2:direction==="right"?0.75*tile:tile/6);	
	}
	else {
		label_x = x + (direction==="up"?tile/2:direction==="down"?-tile/2*(1+label.length/2):-tile/4*label.length/2),
		label_y = y + (direction==="left"?0.75*tile:direction==="right"?-tile/2:tile/6);
	}
	
	ctx.fillText(label,label_x,label_y);
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
		
		ctx.strokeStyle = "#345";
		ctx.lineWidth = 7;
		if (dragHandle.type === "resistor") {
			drawResistor(dragHandle.x,dragHandle.y,dragHandle.direction,dragHandle.label);
		}
		else {
			ctx.fillStyle = "#345";
			let border;
			if (dragHandle instanceof Line) {
				border = dragHandle.horizontal?
					{x1:dragHandle.x,y1:dragHandle.y-5,x2:dragHandle.x+dragHandle.len,y2:dragHandle.y+5}:
					{x1:dragHandle.x-5,y1:dragHandle.y,x2:dragHandle.x+5,y2:dragHandle.y+dragHandle.len};
			}
			else {
				border = dragHandle.horizontal? 
					{x1:dragHandle.x-tile,y1:dragHandle.y-0.33*tile,x2:dragHandle.x+tile,y2:dragHandle.y+0.33*tile}:
					{x1:dragHandle.x-0.33*tile,y1:dragHandle.y-tile,x2:dragHandle.x+0.33*tile,y2:dragHandle.y+tile};
			}
			ctx.fillRect(border.x1,border.y1,border.x2-border.x1,border.y2-border.y1);
		}
		ctx.lineWidth = 1;
	}

	//drawing elements and their labels
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "#000";
	ctx.font="16px Arial";
	elements.forEach(element => {
		if (element.type === "capacitator")
			drawCapacitator(element.x, element.y, element.direction, element.label, element.flipLabel);
		else if (element.type === "resistor")
			drawResistor(element.x, element.y, element.direction, element.label, element.flipLabel);
		else if (element instanceof Line) {
			ctx.beginPath();
			ctx.moveTo(element.x,element.y);
			if (element.horizontal)
				ctx.lineTo(element.x+element.len,element.y);
			else
				ctx.lineTo(element.x,element.y+element.len);
			ctx.stroke();
		}
	});

	//drawing temporary components like line and cursor
	if (line !== undefined && component === "line") {
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(line.x,line.y);
		ctx.lineTo(basic_rotate?line.x:cursor.x-tile,basic_rotate?cursor.y:line.y);
		ctx.lineTo(cursor.x-tile,cursor.y);
		ctx.stroke();	
	}

	if (cursor!==undefined) {
		if (cursor.type === "resistor")
			drawResistor(cursor.x,cursor.y,cursor.direction,"R");
		else if (cursor.type === "capacitator")
			drawCapacitator(cursor.x,cursor.y,cursor.direction,"C");
		else if (cursor.type === "line") {
			ctx.fillStyle = "#000";
			ctx.fillRect(cursor.x-tile-4,cursor.y-4,8,8);
		}
	}

	//debugging
	if (dragHandle != undefined) {
		debug({"cur_component":component,"x":dragHandle.x,"y":dragHandle.y,"dir":dragHandle.direction,"horizontal":dragHandle.horizontal, "label":dragHandle.flipLabel})
	}
}

canvas.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	if (line === undefined) {
		component = "mark";
	}
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

				let border;
				if (element instanceof Line) {
					border = element.horizontal?
					{x1:element.x, y1:element.y-5, x2:element.x+element.len, y2:element.y+5}:
					{x1:element.x-5, y1:element.y, x2:element.x+5, y2:element.y+element.len};
				}
				else {
					border = element.horizontal? 
					{x1:element.x-tile,y1:element.y-0.33*tile,x2:element.x+tile,y2:element.y+0.33*tile}:
					{x1:element.x-0.33*tile,y1:element.y-tile,x2:element.x+0.33*tile,y2:element.y+tile};
				}

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
					document.getElementById("label_field").value = dragHandle.label;
					draw();
				}
			});
		}
		else if (!isDragging && component !== "mark" && component !== "line") {
			let e = new Entity(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,cursor.direction,component);
			elements.push(e);
			draw();
		}
		else if (component === "line") {
			if (line === undefined) {
				line = {x: Math.floor((mouse.x+0.5*tile)/tile)*tile, y: Math.floor((mouse.y+tile/2)/tile)*tile};
			}
			else {
				if (cursor.x-tile === line.x || cursor.y === line.y) {
					let l = new Line(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,line.x,line.y);
					elements.push(l);
					line = undefined;
				}
				else {
					let l1 = new Line(line.x,line.y,basic_rotate?line.x:cursor.x-tile,basic_rotate?cursor.y:line.y),
						l2 = new Line(basic_rotate?line.x:cursor.x-tile,basic_rotate?cursor.y:line.y,cursor.x-tile,cursor.y);
					elements.push(l1);
					elements.push(l2);
					line = undefined;
				}
			}
		}
	}
});

canvas.addEventListener("mousemove", tempIcon);

canvas.addEventListener("wheel", event => { 
	basic_rotate=!basic_rotate; 
	let obj = [dragHandle, cursor];
	obj.forEach(o => {
		if (o !== undefined) {
			if (o.direction === "left") 
				o.direction = "up";
			else if (o.direction === "up")
				o.direction = "right";
			else if (o.direction === "right")
				o.direction = "down";
			else
				o.direction = "left";

			o.horizontal = (o.direction === "left" || o.direction === "right")?true:false;
		}
	})	
})

function onMouseMove(event) {
	let mouse = getMouse(event);
	dragHandle.x = Math.floor((mouse.x+(dragHandle.horizontal?tile/2:tile/2) - offset.x)/tile)*tile;
	dragHandle.y = Math.floor((mouse.y+(dragHandle.horizontal?tile/2:tile/2) - offset.y)/tile)*tile;
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
		cursor = new Entity(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,basic_rotate?"left":"up",component)
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
	delete dragHandle;
	dragHandle = undefined;
	draw();
}

function setLabel() {
	dragHandle.label = document.getElementById("label_field").value;
	draw();
}

function flipLabel() {
	dragHandle.flipLabel = !dragHandle.flipLabel;
	draw();
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
		if (obj[o]!==undefined) {
			ictx.fillText(o+":"+obj[o],x,y);
			y+=20;
			if (y>=90) {
				y = 10, x+=150;
			}
		}
	}
}

// let res1 = new Entity(tile,tile,"down","capacitator");
// let res2 = new Entity(4*tile,5*tile,"left","capacitator");
// elements.push(res1);
// elements.push(res2);