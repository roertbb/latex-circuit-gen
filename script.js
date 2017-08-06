let canvas = document.querySelector("canvas"),
	ctx = canvas.getContext("2d"),
	width = canvas.width = 660,
	height = canvas.height = 480,
	tile = 30,
	component = "mark", //var indicationg which button has been pressed last time/action doing right now
	elements = [],
	markedElements = [],
	offset = {}, // cursor offset
	isDragging = false, //flag, if any object is dragged
	dragHandle = undefined, // indicating dragged object(s)
	cursor = undefined,
	line = undefined,
	basic_rotate = false;

class Entity {
	constructor(x, y, direction, type) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.type = type;
		this.horizontal = (direction === "left" || direction === "right")?true:false;
		this.label;
		if (type === "capacitator")
			this.label = "C";
		else if (type === "resistor")
			this.label = "R";
		else if (type === "diode" || type === "led")
			this.label = "D";
		else if (type === "inductor")
			this.label = "L";
		else if (type === "source" || type === "sine")
			this.label = "V";
		else if (type === "voltmeter" || type === "ammeter")
			this.label = "";
		else
			this.label = "dunno";
		this.flipLabel = false;
	}
}

class Line {
	constructor(x1,y1,x2,y2,type) {
		this.type = type;
		this.direction;
		this.x = x1<=x2?x1:x2;
		this.y = y1<=y2?y1:y2;
		this.len = x1===x2?Math.abs(y2-y1):Math.abs(x2-x1);
		this.horizontal = (y1 === y2);
		if (x1<x2)
			this.direction = "right";
		else if (x2<x1)
			this.direction = "left";
		if (y1<y2)
			this.direction = "up";
		else if (y2<y1)
			this.direction = "down";
		this.label = type === "current"?"I":"";
	}
}

function drawResistor(e) {
	let xs = [-tile, -tile/2, -tile/2, 0.5*tile, 0.5*tile, -tile/2, -tile/2, 0.5*tile, tile],
		ys = [0, 0, -0.25*tile, -0.25*tile, 0.25*tile, 0.25*tile, 0, 0, 0];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0], e.y+ys[0]);
	ctx.lineTo(e.x+xs[1], e.y+ys[1]);
	ctx.lineTo(e.x+xs[2], e.y+ys[2]);
	ctx.lineTo(e.x+xs[3], e.y+ys[3]);
	ctx.lineTo(e.x+xs[4], e.y+ys[4]);
	ctx.lineTo(e.x+xs[5], e.y+ys[5]);
	ctx.lineTo(e.x+xs[6], e.y+ys[6]);
	ctx.moveTo(e.x+xs[7], e.y+ys[7]);
	ctx.lineTo(e.x+xs[8], e.y+ys[8]);
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawInductor(e) {
	let xs = [-tile,-0.66*tile,-tile/3,0,tile/3,0.66*tile,tile],
		ys = [0,0,0,0,0,0,0],
		angle = [Math.PI,Math.PI/4,0.75*Math.PI,Math.PI/4,0.75*Math.PI,0]

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	
	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	if (e.direction === "down" || e.direction === "left") {
		if (e.direction === "left") {
			angle = angle.map( a => { return a-Math.PI/2 });	
		}
		ctx.arc(e.x+xs[2],e.y+ys[2],tile/3,angle[0]+Math.PI/2,angle[1],true);
		ctx.arc(e.x+xs[3],e.y+ys[3],tile/3,angle[2]+Math.PI,angle[3],true);
		ctx.arc(e.x+xs[4],e.y+ys[4],tile/3,angle[4]+Math.PI,angle[5]+Math.PI/2,true);
	}
	else {
		if (e.direction === "up") {
			angle = angle.map( a => { return a+Math.PI/2 });
		}
		ctx.arc(e.x+xs[2],e.y+ys[2],tile/3,angle[0],angle[1],false);
		ctx.arc(e.x+xs[3],e.y+ys[3],tile/3,angle[2],angle[3],false);
		ctx.arc(e.x+xs[4],e.y+ys[4],tile/3,angle[4],angle[5],false);	
	}
	ctx.lineTo(e.x+xs[5],e.y+ys[5]);
	ctx.lineTo(e.x+xs[6],e.y+ys[6]);
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawDiode(e) {
	let xs = [-tile,-0.33*tile,-0.33*tile,0.33*tile,-0.33*tile,-0.33*tile,0.33*tile,0.33*tile,0.33*tile,tile],
		ys = [0,0,-0.33*tile,0,0.33*tile,0,-0.33*tile,0.33*tile,0,0];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.direction === "left" || e.direction === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	ctx.lineTo(e.x+xs[2],e.y+ys[2]);
	ctx.lineTo(e.x+xs[3],e.y+ys[3]);
	ctx.lineTo(e.x+xs[4],e.y+ys[4]);
	ctx.lineTo(e.x+xs[5],e.y+ys[5]);
	ctx.moveTo(e.x+xs[6],e.y+ys[6]);
	ctx.lineTo(e.x+xs[7],e.y+ys[7]);
	ctx.moveTo(e.x+xs[8],e.y+ys[8]);
	ctx.lineTo(e.x+xs[9],e.y+ys[9]);
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawLed(e) {
	let xs = [-tile,-0.33*tile,-0.33*tile,0.33*tile,-0.33*tile,-0.33*tile,0.33*tile,0.33*tile,0.33*tile,tile,-tile/6,tile/6,0,tile/6,tile/6,tile/6,tile/2,tile/3,tile/2,tile/2],
		ys = [0,0,-0.33*tile,0,0.33*tile,0,-0.33*tile,0.33*tile,0,0,-tile/2,-5*tile/6,-5*tile/6,-5*tile/6,-2*tile/3,-tile/2,-5*tile/6,-5*tile/6,-5*tile/6,-2*tile/3];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.direction === "left" || e.direction === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	ctx.lineTo(e.x+xs[2],e.y+ys[2]);
	ctx.lineTo(e.x+xs[3],e.y+ys[3]);
	ctx.lineTo(e.x+xs[4],e.y+ys[4]);
	ctx.lineTo(e.x+xs[5],e.y+ys[5]);
	ctx.moveTo(e.x+xs[6],e.y+ys[6]);
	ctx.lineTo(e.x+xs[7],e.y+ys[7]);
	ctx.moveTo(e.x+xs[8],e.y+ys[8]);
	ctx.lineTo(e.x+xs[9],e.y+ys[9]);

	ctx.moveTo(e.x+xs[10],e.y+ys[10]);
	ctx.lineTo(e.x+xs[11],e.y+ys[11]);
	ctx.lineTo(e.x+xs[12],e.y+ys[12]);
	ctx.moveTo(e.x+xs[13],e.y+ys[13]);
	ctx.lineTo(e.x+xs[14],e.y+ys[14]);

	ctx.moveTo(e.x+xs[15],e.y+ys[15]);
	ctx.lineTo(e.x+xs[16],e.y+ys[16]);
	ctx.lineTo(e.x+xs[17],e.y+ys[17]);
	ctx.moveTo(e.x+xs[18],e.y+ys[18]);
	ctx.lineTo(e.x+xs[19],e.y+ys[19]);

	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawCapacitator(e) {
	let xs = [-tile,-0.25*tile,-0.25*tile,-0.25*tile,0.25*tile,0.25*tile,0.25*tile,tile],
		ys = [0,0,-0.35*tile,0.35*tile,-0.35*tile,0.35*tile,0,0];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	ctx.moveTo(e.x+xs[2],e.y+ys[2]);
	ctx.lineTo(e.x+xs[3],e.y+ys[3]);
	ctx.moveTo(e.x+xs[4],e.y+ys[4]);
	ctx.lineTo(e.x+xs[5],e.y+ys[5]);
	ctx.moveTo(e.x+xs[6],e.y+ys[6]);
	ctx.lineTo(e.x+xs[7],e.y+ys[7]);
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawSource(e) {
	let xs = [-tile,-tile/2,tile/2,tile,-tile/4,-tile/4,tile/5,tile/5,tile/12,tile/3],
		ys = [0,0,0,0,-tile/6,tile/6,-tile/6,tile/6,0,0];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.direction === "left" || e.direction === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x,e.y,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+xs[2],e.y+ys[2]);
	ctx.lineTo(e.x+xs[3],e.y+ys[3]);
	ctx.moveTo(e.x+xs[4],e.y+ys[4]);
	ctx.lineTo(e.x+xs[5],e.y+ys[5]);
	ctx.moveTo(e.x+xs[6],e.y+ys[6]);
	ctx.lineTo(e.x+xs[7],e.y+ys[7]);
	ctx.moveTo(e.x+xs[8],e.y+ys[8]);
	ctx.lineTo(e.x+xs[9],e.y+ys[9]);
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawSine(e) {
	let xs = [-tile,-tile/2,tile/2,tile,0,0],
		ys = [0,0,0,0,-tile/6,tile/6];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x,e.y,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+xs[2],e.y+ys[2]);
	ctx.lineTo(e.x+xs[3],e.y+ys[3]);
	ctx.stroke();

	let angle = [Math.PI,0,Math.PI,2*Math.PI];

	ctx.beginPath();
	if (e.direction === "left" || e.direction === "right") {
		angle = angle.map( a => {	return a-Math.PI/2; });
		ctx.arc(e.x+xs[5],e.y+ys[5],tile/6,angle[2],angle[3],false);
		ctx.arc(e.x+xs[4],e.y+ys[4],tile/6,angle[0],angle[1],true);
	}
	else {
		ctx.arc(e.x+xs[4],e.y+ys[4],tile/6,angle[0],angle[1],false);
		ctx.arc(e.x+xs[5],e.y+ys[5],tile/6,angle[2],angle[3],true);
	}
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawVoltmeter(e) {
	let xs = [-tile,-tile/2,tile/2,tile,-tile/6,0,tile/6,-tile/2,tile/2,tile/3,tile/2,tile/2],
		ys = [0,0,0,0,-tile/6,tile/6,-tile/6,tile/2,-tile/2,-tile/2,-tile/2,-tile/3];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	if (e.direction === "left" || e.direction === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}
	if (e.direction === "up" || e.direction === "down") 
		ys = ys.map(cord => -cord);

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x,e.y,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+xs[2],e.y+ys[2]);
	ctx.lineTo(e.x+xs[3],e.y+ys[3]);
	ctx.moveTo(e.x+xs[4],e.y+ys[4]);
	ctx.lineTo(e.x+xs[5],e.y+ys[5]);
	ctx.lineTo(e.x+xs[6],e.y+ys[6]);
	ctx.moveTo(e.x+xs[7],e.y+ys[7]);
	ctx.lineTo(e.x+xs[8],e.y+ys[8]);
	ctx.lineTo(e.x+xs[9],e.y+ys[9]);
	ctx.moveTo(e.x+xs[10],e.y+ys[10]);
	ctx.lineTo(e.x+xs[11],e.y+ys[11]);
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawAmmeter(e) {
	let xs = [-tile,-tile/2,tile/2,tile,tile/6,0,-tile/6,-tile/12,tile/12,-tile/2,tile/2,tile/3,tile/2,tile/2],
		ys = [0,0,0,0,tile/6,-tile/6,tile/6,tile/12,tile/12,tile/2,-tile/2,-tile/2,-tile/2,-tile/3];

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	if (e.direction === "left" || e.direction === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}
	if (e.direction === "up" || e.direction === "down") 
		ys = ys.map(cord => -cord);

	ctx.beginPath();
	ctx.moveTo(e.x+xs[0],e.y+ys[0]);
	ctx.lineTo(e.x+xs[1],e.y+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x,e.y,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+xs[2],e.y+ys[2]);
	ctx.lineTo(e.x+xs[3],e.y+ys[3]);
	ctx.moveTo(e.x+xs[4],e.y+ys[4]);
	ctx.lineTo(e.x+xs[5],e.y+ys[5]);
	ctx.lineTo(e.x+xs[6],e.y+ys[6]);
	ctx.moveTo(e.x+xs[7],e.y+ys[7]);
	ctx.lineTo(e.x+xs[8],e.y+ys[8]);
	ctx.moveTo(e.x+xs[9],e.y+ys[9]);
	ctx.lineTo(e.x+xs[10],e.y+ys[10]);
	ctx.lineTo(e.x+xs[11],e.y+ys[11]);
	ctx.moveTo(e.x+xs[12],e.y+ys[12]);
	ctx.lineTo(e.x+xs[13],e.y+ys[13]);
	ctx.stroke();

	drawLabel(e,e.x,e.y);
}

function drawLine(e) {
	ctx.beginPath();
	ctx.moveTo(e.x,e.y);
	if (e.horizontal)
		ctx.lineTo(e.x+e.len,e.y);
	else
		ctx.lineTo(e.x,e.y+e.len);
	ctx.stroke();
}

function drawCurrent(e) {
	let xs = [e.len/2,e.len/2,e.len/2],
		ys = [-tile/12,0,tile/12],
		arrow = [-tile/12,tile/12,-tile/12]

	if (e.direction === "up" || e.direction === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.direction === "down" || e.direction === "left") {
		arrow = arrow.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x,e.y);
	if (e.horizontal)
		ctx.lineTo(e.x+e.len,e.y);
	else
		ctx.lineTo(e.x,e.y+e.len);
	ctx.moveTo(e.x+xs[0]+(e.horizontal?arrow[0]:0),e.y+ys[0]+(e.horizontal?0:arrow[0]));
	ctx.lineTo(e.x+xs[1]+(e.horizontal?arrow[1]:0),e.y+ys[1]+(e.horizontal?0:arrow[1]));
	ctx.lineTo(e.x+xs[2]+(e.horizontal?arrow[2]:0),e.y+ys[2]+(e.horizontal?0:arrow[2]));
	ctx.stroke();

	if (e.horizontal)
		drawLabel(e,e.x+e.len/2,e.y);
	else
		drawLabel(e,e.x,e.y+e.len/2);
}

function drawLabel(e,x,y) {
	let label_x, label_y;
	if (e.flipLabel) {
		label_x = x + (e.direction==="up"?-2*tile/3*(e.label.length/2):e.direction==="down"?2*tile/3:-tile/4*e.label.length/2),
		label_y = y + (e.direction==="left"?-2*tile/3:e.direction==="right"?tile:tile/6);	
	}
	else {
		label_x = x + (e.direction==="up"?2*tile/3:e.direction==="down"?-2*tile/3*(1+e.label.length/3):-tile/4*e.label.length/2),
		label_y = y + (e.direction==="left"?tile:e.direction==="right"?-2*tile/3:tile/6);
	}
	
	ctx.fillText(e.label,label_x,label_y);
}

//components to do:
// -transistor
// -opamp
// -node with text/some label
// -white and black points

function draw() {
	ctx.clearRect(0,0,width,height);
	// ctx.fillStyle = "#f7f7f7";
	ctx.fillStyle = "#fff";
	ctx.fillRect(0,0,width,height);

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

	let component_table = {
		resistor: function(e) { drawResistor(e); },
		capacitator: function(e) { drawCapacitator(e); },
		inductor: function(e) { drawInductor(e); },
		diode: function(e) { drawDiode(e); },
		led: function(e) { drawLed(e); },
		line: function(e) { drawLine(e); },
		source: function(e) { drawSource(e); },
		sine: function(e) { drawSine(e); },
		voltmeter: function(e) { drawVoltmeter(e); },
		ammeter: function(e) { drawAmmeter(e); },
		current: function(e) { drawCurrent(e); },
		markmore: function() {
			ctx.strokeStyle = "#388";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(dragHandle.x1,dragHandle.y1);
			ctx.lineTo(dragHandle.x1,dragHandle.y2);
			ctx.lineTo(dragHandle.x2,dragHandle.y2);
			ctx.lineTo(dragHandle.x2,dragHandle.y1);
			ctx.lineTo(dragHandle.x1,dragHandle.y1);
			ctx.stroke();
			ctx.lineWidth = 1;
		}
	}

	//draw outline to clicked/draggable object
	ctx.strokeStyle = "#345";
	ctx.lineWidth = 7;
	if (dragHandle !== undefined) {
		component_table[dragHandle.type](dragHandle);
	}
	ctx.lineWidth = 1;

	ctx.strokeStyle = "#383";
	ctx.lineWidth = 7;	
	markedElements.forEach(element => {
		component_table[element.type](element);
	});
	ctx.lineWidth = 1;

	//drawing elements and their labels
	ctx.fillStyle = "#000";
	ctx.strokeStyle = "#000";
	ctx.font="16px Arial";
	elements.forEach(element => {
		component_table[element.type](element);
	});

	//drawing temporary components like line and cursor
	if (line !== undefined) {
		ctx.strokeStyle = (component==="current"?"#388":"#000");
		ctx.beginPath();
		ctx.moveTo(line.x,line.y);
		ctx.lineTo(basic_rotate?line.x:cursor.x-tile,basic_rotate?cursor.y:line.y);
		ctx.lineTo(cursor.x-tile,cursor.y);
		ctx.stroke();
	}

	//drawing temporary component as cursor
	if (cursor!==undefined) {
		if (cursor.type === "line" || cursor.type === "current") {
			ctx.fillStyle = "#000";
			ctx.fillRect(cursor.x-tile-4,cursor.y-4,8,8);
		}
		else
			component_table[cursor.type](cursor);
	}

	//debugging
	// if (dragHandle != undefined) {
	// 	debug({"cur_component":component,"x":dragHandle.x,"y":dragHandle.y,"dir":dragHandle.direction,"horizontal":dragHandle.horizontal, "label":dragHandle.flipLabel})
	// }
}

canvas.addEventListener("contextmenu", (event) => {
	event.preventDefault();
	if (line === undefined) {
		component = "mark";
	}
	dragHandle = undefined;
	cursor = undefined;
	line = undefined;
	markedElements = [];
	document.getElementById("label_field").value = "";
	draw();
	return false;
}, false);

canvas.addEventListener("mousedown", event => {
	if (event.button === 0) {
		let mouse = getMouse(event);

		if (component === "mark") {

			//if (markedElements.length!==0) //TODO

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
					markedElements = [];
					canvas.addEventListener("mousemove", onMouseMove);
					canvas.addEventListener("mouseup", onMouseUp);
					offset.x = mouse.x - element.x;
					offset.y = mouse.y - element.y;
					document.getElementById("label_field").value = dragHandle.label;
					draw();
				}
			});
			if (dragHandle === undefined) {
				console.log("dunno");
				//add eventlistener to draw rectangle made by marking
				dragHandle = {type:"markmore",x1:mouse.x, y1:mouse.y};
				canvas.addEventListener("mouseup", markElements);
				canvas.addEventListener("mousemove", markRect);
				//here to mark more than one item
			}
		}
		else if (!isDragging && component !== "mark" && component !== "line" && component !== "current") {
			let e = new Entity(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,cursor.direction,component);
			elements.push(e);
			draw();
		}
		else if (component === "line" || component === "current") {
			if (line === undefined) {
				line = {x: Math.floor((mouse.x+0.5*tile)/tile)*tile, y: Math.floor((mouse.y+tile/2)/tile)*tile};
			}
			else {
				if (cursor.x-tile === line.x || cursor.y === line.y) {
					let l = new Line(line.x,line.y,Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,component);
					elements.push(l);
					line = undefined;
				}
				else {
					let l1 = new Line(line.x,line.y,basic_rotate?line.x:cursor.x-tile,basic_rotate?cursor.y:line.y, component),
						l2 = new Line(basic_rotate?line.x:cursor.x-tile,basic_rotate?cursor.y:line.y,cursor.x-tile,cursor.y, component);
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
	});
});

function markElements(event) {
	let mouse = getMouse(event);
	markedElements = [];
	if (dragHandle.x2 < dragHandle.x1) {
		let temp = dragHandle.x1;
		dragHandle.x1 = dragHandle.x2;
		dragHandle.x2 = temp;
	}
	if (dragHandle.y2 < dragHandle.y1) {
		let temp = dragHandle.y1;
		dragHandle.y1 = dragHandle.y2;
		dragHandle.y2 = temp;
	}

	elements.forEach(element => {
		let point1, point2;
		if (element instanceof Line) {
			point1 = {x:element.x, y:element.y};
			if (element.horizontal) 
				point2 = {x:element.x+element.len,y:element.y};
			else
				point2 = {x:element.x, y:element.y+element.len};
		}
		else {
			if (element.horizontal) {
				point1 = {x:element.x-tile, y:element.y};
				point2 = {x:element.x+tile, y:element.y};
			}
			else {
				point1 = {x:element.x, y:element.y-tile};
				point2 = {x:element.x, y:element.y+tile};
			}
		}

		if (inRect(point1,dragHandle) && inRect(point2,dragHandle)) {
			markedElements.push(element);
		}
	});

	dragHandle = undefined;
	canvas.removeEventListener("mouseup", markElements);
	canvas.removeEventListener("mousemove", markRect);
}

function inRect(point, border) {
	return (point.x > border.x1 && point.x < border.x2 && point.y > border.y1 && point.y < border.y2)
}

function markRect(event) {
	let mouse = getMouse(event);
	dragHandle.x2 = mouse.x;
	dragHandle.y2 = mouse.y;
}

function onMouseMove(event) {
	let mouse = getMouse(event);
	dragHandle.x = Math.floor((mouse.x+(dragHandle.horizontal?tile/2:tile/2) - offset.x)/tile)*tile;
	dragHandle.y = Math.floor((mouse.y+(dragHandle.horizontal?tile/2:tile/2) - offset.y)/tile)*tile;
	draw();
}

function onMouseUp(event) {
	canvas.removeEventListener("mousemove", onMouseMove);
	canvas.removeEventListener("mouseup", onMouseUp);
	canvas.addEventListener("mousemove", tempIcon);
	isDragging = false;
	draw();
}

function tempIcon(event) {
	let mouse = getMouse(event);
	if (component !== "mark") {
		cursor = new Entity(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,basic_rotate?"left":"up",component)
		if (cursor.type === "line" || cursor.type === "current") {
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
	document.getElementById("label_field").value = "";
	draw();
}

function del() {
	if (markedElements.length !== 0) {
		markedElements.forEach(element => {
			elements.splice(elements.indexOf(element),1);
			delete element;
		});
		markedElements = [];
		document.getElementById("label_field").value = "";
	}
	else if (dragHandle !== undefined) {
		elements.splice(elements.indexOf(dragHandle),1);
		delete dragHandle;
		dragHandle = undefined;
		document.getElementById("label_field").value = "";
	}
	draw();
}

function setLabel() {
	if (dragHandle!==undefined)
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