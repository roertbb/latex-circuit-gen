function drawResistor(e) {
	let xs = [-tile, -tile/2, -tile/2, 0.5*tile, 0.5*tile, -tile/2, -tile/2, 0.5*tile, tile],
		ys = [0, 0, -0.25*tile, -0.25*tile, 0.25*tile, 0.25*tile, 0, 0, 0];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0], e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1], e.y+e.dy+ys[1]);
	ctx.lineTo(e.x+e.dx+xs[2], e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3], e.y+e.dy+ys[3]);
	ctx.lineTo(e.x+e.dx+xs[4], e.y+e.dy+ys[4]);
	ctx.lineTo(e.x+e.dx+xs[5], e.y+e.dy+ys[5]);
	ctx.lineTo(e.x+e.dx+xs[6], e.y+e.dy+ys[6]);
	ctx.moveTo(e.x+e.dx+xs[7], e.y+e.dy+ys[7]);
	ctx.lineTo(e.x+e.dx+xs[8], e.y+e.dy+ys[8]);
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawCapacitator(e) {
	let xs = [-tile,-0.25*tile,-0.25*tile,-0.25*tile,0.25*tile,0.25*tile,0.25*tile,tile],
		ys = [0,0,-0.35*tile,0.35*tile,-0.35*tile,0.35*tile,0,0];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	ctx.moveTo(e.x+e.dx+xs[2],e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3],e.y+e.dy+ys[3]);
	ctx.moveTo(e.x+e.dx+xs[4],e.y+e.dy+ys[4]);
	ctx.lineTo(e.x+e.dx+xs[5],e.y+e.dy+ys[5]);
	ctx.moveTo(e.x+e.dx+xs[6],e.y+e.dy+ys[6]);
	ctx.lineTo(e.x+e.dx+xs[7],e.y+e.dy+ys[7]);
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawInductor(e) {
	let xs = [-tile,-0.66*tile,-tile/3,0,tile/3,0.66*tile,tile],
		ys = [0,0,0,0,0,0,0],
		angle = [Math.PI,Math.PI/4,0.75*Math.PI,Math.PI/4,0.75*Math.PI,0]

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	
	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	if (e.dir === "down" || e.dir === "left") {
		if (e.dir === "left") {
			angle = angle.map( a => { return a-Math.PI/2 });	
		}
		ctx.arc(e.x+e.dx+xs[2],e.y+e.dy+ys[2],tile/3,angle[0]+Math.PI/2,angle[1],true);
		ctx.arc(e.x+e.dx+xs[3],e.y+e.dy+ys[3],tile/3,angle[2]+Math.PI,angle[3],true);
		ctx.arc(e.x+e.dx+xs[4],e.y+e.dy+ys[4],tile/3,angle[4]+Math.PI,angle[5]+Math.PI/2,true);
	}
	else {
		if (e.dir === "up") {
			angle = angle.map( a => { return a+Math.PI/2 });
		}
		ctx.arc(e.x+e.dx+xs[2],e.y+e.dy+ys[2],tile/3,angle[0],angle[1],false);
		ctx.arc(e.x+e.dx+xs[3],e.y+e.dy+ys[3],tile/3,angle[2],angle[3],false);
		ctx.arc(e.x+e.dx+xs[4],e.y+e.dy+ys[4],tile/3,angle[4],angle[5],false);	
	}
	ctx.lineTo(e.x+e.dx+xs[5],e.y+e.dy+ys[5]);
	ctx.lineTo(e.x+e.dx+xs[6],e.y+e.dy+ys[6]);
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawDiode(e) {
	let xs = [-tile,-0.33*tile,-0.33*tile,0.33*tile,-0.33*tile,-0.33*tile,0.33*tile,0.33*tile,0.33*tile,tile],
		ys = [0,0,-0.33*tile,0,0.33*tile,0,-0.33*tile,0.33*tile,0,0];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.dir === "left" || e.dir === "up") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	ctx.lineTo(e.x+e.dx+xs[2],e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3],e.y+e.dy+ys[3]);
	ctx.lineTo(e.x+e.dx+xs[4],e.y+e.dy+ys[4]);
	ctx.lineTo(e.x+e.dx+xs[5],e.y+e.dy+ys[5]);
	ctx.moveTo(e.x+e.dx+xs[6],e.y+e.dy+ys[6]);
	ctx.lineTo(e.x+e.dx+xs[7],e.y+e.dy+ys[7]);
	ctx.moveTo(e.x+e.dx+xs[8],e.y+e.dy+ys[8]);
	ctx.lineTo(e.x+e.dx+xs[9],e.y+e.dy+ys[9]);
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawLed(e) {
	let xs = [-tile,-0.33*tile,-0.33*tile,0.33*tile,-0.33*tile,-0.33*tile,0.33*tile,0.33*tile,0.33*tile,tile,-tile/6,tile/6,0,tile/6,tile/6,tile/6,tile/2,tile/3,tile/2,tile/2],
		ys = [0,0,-0.33*tile,0,0.33*tile,0,-0.33*tile,0.33*tile,0,0,-tile/2,-5*tile/6,-5*tile/6,-5*tile/6,-2*tile/3,-tile/2,-5*tile/6,-5*tile/6,-5*tile/6,-2*tile/3];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.dir === "left" || e.dir === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	ctx.lineTo(e.x+e.dx+xs[2],e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3],e.y+e.dy+ys[3]);
	ctx.lineTo(e.x+e.dx+xs[4],e.y+e.dy+ys[4]);
	ctx.lineTo(e.x+e.dx+xs[5],e.y+e.dy+ys[5]);
	ctx.moveTo(e.x+e.dx+xs[6],e.y+e.dy+ys[6]);
	ctx.lineTo(e.x+e.dx+xs[7],e.y+e.dy+ys[7]);
	ctx.moveTo(e.x+e.dx+xs[8],e.y+e.dy+ys[8]);
	ctx.lineTo(e.x+e.dx+xs[9],e.y+e.dy+ys[9]);

	ctx.moveTo(e.x+e.dx+xs[10],e.y+e.dy+ys[10]);
	ctx.lineTo(e.x+e.dx+xs[11],e.y+e.dy+ys[11]);
	ctx.lineTo(e.x+e.dx+xs[12],e.y+e.dy+ys[12]);
	ctx.moveTo(e.x+e.dx+xs[13],e.y+e.dy+ys[13]);
	ctx.lineTo(e.x+e.dx+xs[14],e.y+e.dy+ys[14]);

	ctx.moveTo(e.x+e.dx+xs[15],e.y+e.dy+ys[15]);
	ctx.lineTo(e.x+e.dx+xs[16],e.y+e.dy+ys[16]);
	ctx.lineTo(e.x+e.dx+xs[17],e.y+e.dy+ys[17]);
	ctx.moveTo(e.x+e.dx+xs[18],e.y+e.dy+ys[18]);
	ctx.lineTo(e.x+e.dx+xs[19],e.y+e.dy+ys[19]);

	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawSource(e) {
	let xs = [-tile,-tile/2,tile/2,tile,-tile/4,-tile/4,tile/5,tile/5,tile/12,tile/3],
		ys = [0,0,0,0,-tile/6,tile/6,-tile/6,tile/6,0,0];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.dir === "left" || e.dir === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x+e.dx,e.y+e.dy,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[2],e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3],e.y+e.dy+ys[3]);
	ctx.moveTo(e.x+e.dx+xs[4],e.y+e.dy+ys[4]);
	ctx.lineTo(e.x+e.dx+xs[5],e.y+e.dy+ys[5]);
	ctx.moveTo(e.x+e.dx+xs[6],e.y+e.dy+ys[6]);
	ctx.lineTo(e.x+e.dx+xs[7],e.y+e.dy+ys[7]);
	ctx.moveTo(e.x+e.dx+xs[8],e.y+e.dy+ys[8]);
	ctx.lineTo(e.x+e.dx+xs[9],e.y+e.dy+ys[9]);
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawSine(e) {
	let xs = [-tile,-tile/2,tile/2,tile,0,0],
		ys = [0,0,0,0,-tile/6,tile/6];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x+e.dx,e.y+e.dy,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[2],e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3],e.y+e.dy+ys[3]);
	ctx.stroke();

	let angle = [Math.PI,0,Math.PI,2*Math.PI];

	ctx.beginPath();
	if (e.dir === "left" || e.dir === "right") {
		angle = angle.map( a => {	return a-Math.PI/2; });
		ctx.arc(e.x+e.dx+xs[5],e.y+e.dy+ys[5],tile/6,angle[2],angle[3],false);
		ctx.arc(e.x+e.dx+xs[4],e.y+e.dy+ys[4],tile/6,angle[0],angle[1],true);
	}
	else {
		ctx.arc(e.x+e.dx+xs[4],e.y+e.dy+ys[4],tile/6,angle[0],angle[1],false);
		ctx.arc(e.x+e.dx+xs[5],e.y+e.dy+ys[5],tile/6,angle[2],angle[3],true);
	}
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawVoltmeter(e) {
	let xs = [-tile,-tile/2,tile/2,tile,-tile/6,0,tile/6,-tile/2,tile/2,tile/3,tile/2,tile/2],
		ys = [0,0,0,0,-tile/6,tile/6,-tile/6,tile/2,-tile/2,-tile/2,-tile/2,-tile/3];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	if (e.dir === "left" || e.dir === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}
	if (e.dir === "up" || e.dir === "down") 
		ys = ys.map(cord => -cord);

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x+e.dx,e.y+e.dy,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[2],e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3],e.y+e.dy+ys[3]);
	ctx.moveTo(e.x+e.dx+xs[4],e.y+e.dy+ys[4]);
	ctx.lineTo(e.x+e.dx+xs[5],e.y+e.dy+ys[5]);
	ctx.lineTo(e.x+e.dx+xs[6],e.y+e.dy+ys[6]);
	ctx.moveTo(e.x+e.dx+xs[7],e.y+e.dy+ys[7]);
	ctx.lineTo(e.x+e.dx+xs[8],e.y+e.dy+ys[8]);
	ctx.lineTo(e.x+e.dx+xs[9],e.y+e.dy+ys[9]);
	ctx.moveTo(e.x+e.dx+xs[10],e.y+e.dy+ys[10]);
	ctx.lineTo(e.x+e.dx+xs[11],e.y+e.dy+ys[11]);
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawAmmeter(e) {
	let xs = [-tile,-tile/2,tile/2,tile,tile/6,0,-tile/6,-tile/12,tile/12,-tile/2,tile/2,tile/3,tile/2,tile/2],
		ys = [0,0,0,0,tile/6,-tile/6,tile/6,tile/12,tile/12,tile/2,-tile/2,-tile/2,-tile/2,-tile/3];

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}

	if (e.dir === "left" || e.dir === "down") {
		xs = xs.map(cord => -cord);
		ys = ys.map(cord => -cord);
	}
	if (e.dir === "up" || e.dir === "down") 
		ys = ys.map(cord => -cord);

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[0],e.y+e.dy+ys[0]);
	ctx.lineTo(e.x+e.dx+xs[1],e.y+e.dy+ys[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(e.x+e.dx,e.y+e.dy,tile/2,0,Math.PI*2,false);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(e.x+e.dx+xs[2],e.y+e.dy+ys[2]);
	ctx.lineTo(e.x+e.dx+xs[3],e.y+e.dy+ys[3]);
	ctx.moveTo(e.x+e.dx+xs[4],e.y+e.dy+ys[4]);
	ctx.lineTo(e.x+e.dx+xs[5],e.y+e.dy+ys[5]);
	ctx.lineTo(e.x+e.dx+xs[6],e.y+e.dy+ys[6]);
	ctx.moveTo(e.x+e.dx+xs[7],e.y+e.dy+ys[7]);
	ctx.lineTo(e.x+e.dx+xs[8],e.y+e.dy+ys[8]);
	ctx.moveTo(e.x+e.dx+xs[9],e.y+e.dy+ys[9]);
	ctx.lineTo(e.x+e.dx+xs[10],e.y+e.dy+ys[10]);
	ctx.lineTo(e.x+e.dx+xs[11],e.y+e.dy+ys[11]);
	ctx.moveTo(e.x+e.dx+xs[12],e.y+e.dy+ys[12]);
	ctx.lineTo(e.x+e.dx+xs[13],e.y+e.dy+ys[13]);
	ctx.stroke();

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawLine(e) {
	ctx.beginPath();
	ctx.moveTo(e.x+e.dx,e.y+e.dy);
	if (e.horizontal)
		ctx.lineTo(e.x+e.dx+e.len,e.y+e.dy);
	else
		ctx.lineTo(e.x+e.dx,e.y+e.dy+e.len);
	ctx.stroke();
}

function drawCurrent(e) {
	let xs = [e.len/2,e.len/2,e.len/2],
		ys = [-tile/12,0,tile/12],
		arrow = [-tile/12,tile/12,-tile/12]

	if (e.dir === "up" || e.dir === "down") {
		let temp = ys; ys = xs; xs = temp;
	}
	if (e.dir === "down" || e.dir === "left") {
		arrow = arrow.map(cord => -cord);
	}

	ctx.beginPath();
	ctx.moveTo(e.x+e.dx,e.y+e.dy);
	if (e.horizontal)
		ctx.lineTo(e.x+e.dx+e.len,e.y+e.dy);
	else
		ctx.lineTo(e.x+e.dx,e.y+e.dy+e.len);
	ctx.moveTo(e.x+e.dx+xs[0]+(e.horizontal?arrow[0]:0),e.y+e.dy+ys[0]+(e.horizontal?0:arrow[0]));
	ctx.lineTo(e.x+e.dx+xs[1]+(e.horizontal?arrow[1]:0),e.y+e.dy+ys[1]+(e.horizontal?0:arrow[1]));
	ctx.lineTo(e.x+e.dx+xs[2]+(e.horizontal?arrow[2]:0),e.y+e.dy+ys[2]+(e.horizontal?0:arrow[2]));
	ctx.stroke();

	if (e.horizontal)
		drawLabel(e,e.x+e.dx+e.len/2,e.y+e.dy);
	else
		drawLabel(e,e.x+e.dx,e.y+e.dy+e.len/2);
}

function drawNode(e, type) {
	if (type === "label") 
		ctx.fillStyle = "#833";
	else
		ctx.fillStyle = "#000";

	ctx.beginPath();
	ctx.arc(e.x+e.dx,e.y+e.dy,tile/12,0,Math.PI*2,false);
	ctx.stroke();
	if (type === "filled" || type === "label")
		ctx.fill();

	ctx.fillStyle = "#000";

	drawLabel(e,e.x+e.dx,e.y+e.dy);
}

function drawMarkMore(e) {
	ctx.strokeStyle = "#388";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(e.x1,e.y1);
	ctx.lineTo(e.x1,e.y2);
	ctx.lineTo(e.x2,e.y2);
	ctx.lineTo(e.x2,e.y1);
	ctx.lineTo(e.x1,e.y1);
	ctx.stroke();
	ctx.lineWidth = 1;
}

function drawLabel(e,x,y) {
	let label_x, label_y;
	if (e.flipLabel) {
		label_x = x + (e.dir==="up"?-2*tile/3*(1+e.label.length/3):e.dir==="down"?2*tile/3:-tile/4*e.label.length/2),
		label_y = y + (e.dir==="left"?-2*tile/3:e.dir==="right"?tile:tile/6);	
	}
	else {
		label_x = x + (e.dir==="up"?2*tile/3:e.dir==="down"?-2*tile/3*(1+e.label.length/3):-tile/4*e.label.length/2),
		label_y = y + (e.dir==="left"?tile:e.dir==="right"?-2*tile/3:tile/6);
	}
	
	ctx.fillText(e.label,label_x,label_y);
}