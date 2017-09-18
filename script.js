let canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	width = canvas.width = 660,
	height = canvas.height = 480,
	tile = 30,
	current = "mark", //current component indicated by button
	elements = [], //array of elements
	cursor = undefined, //cursor element
	marked = [], //array of marked elements
	dir = "right", //indicating the rotation of component
	dnd; //drag-and-drop helper to store mouse coordinates

let componentTable = {
		resistor: function(e) { drawResistor(e); },
		capacitator: function(e) { drawCapacitator(e); },
		inductor: function(e) { drawInductor(e); },
		diode: function(e) { drawDiode(e); },
		led: function(e) { drawLed(e); },
		source: function(e) { drawSource(e); },
		sine: function(e) { drawSine(e); },
		voltmeter: function(e) { drawVoltmeter(e); },
		ammeter: function(e) { drawAmmeter(e); },

		line: function(e) { drawLine(e); },
		current: function(e) { drawCurrent(e); },

		markmore: function(e) { drawMarkMore(e); }
	},
	directions = ["right","down","left","up"];

class Entity {
	constructor(x, y, dir, type) {
		this.x = x;
		this.y = y;
		this.dx = 0;
		this.dy = 0;
		this.dir = dir;
		this.type = type
		this.horizontal = (dir === "left" || dir === "right")?true:false;
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
		else if (type === "node" || type === "filledNode" || type === "label") 
			this.label = "node";
		else
			this.label = "dunno";
		this.flipLabel = false;
	}
}

class Line {
	constructor(x1,y1,x2,y2,type) {
		this.type = type;
		this.dir;
		this.x = x1<=x2?x1:x2;
		this.y = y1<=y2?y1:y2;
		this.dx = 0;
		this.dy = 0;
		this.len = x1===x2?Math.abs(y2-y1):Math.abs(x2-x1);
		this.horizontal = (y1 === y2);
		if (x1<x2)
			this.dir = "right";
		else if (x2<x1)
			this.dir = "left";
		if (y1<y2)
			this.dir = "up";
		else if (y2<y1)
			this.dir = "down";
		this.label = type === "current"?"I":"";
		this.ends = "--";
	}
}

function draw() {
	//clear canvas
	ctx.clearRect(0,0,width,height);
	ctx.fillStyle = "#f7f7f7";
	// ctx.fillStyle = "#fff";
	ctx.fillRect(0,0,width,height);

	//draw lines
	ctx.strokeStyle = "#ddd";
	ctx.beginPath()
	for (let i=1; i<height/tile; i++) {
		ctx.moveTo(tile,i*tile);
		ctx.lineTo(width-tile,i*tile);
	}
	for (let i=1; i<width/tile; i++) {
		ctx.moveTo(i*tile,tile);
		ctx.lineTo(i*tile,height-tile);
	}
	ctx.stroke();

	ctx.font="16px Arial";
	//draw cursor
	ctx.fillStyle = "#353535";
	ctx.strokeStyle = "#353535";
	if (cursor !== undefined) {
		if (cursor.type === "line" || cursor.type === "current") {
			//draw dot
			ctx.fillRect(cursor.x-4,cursor.y-4,8,8);
			if (cursor.line !== undefined) {
				//draw lines
				let horizontal = (dir === "left" || dir === "right");
				ctx.beginPath();
				ctx.moveTo(cursor.line.x,cursor.line.y);
				ctx.lineTo(horizontal?cursor.line.x:cursor.x,horizontal?cursor.y:cursor.line.y);
				ctx.lineTo(cursor.x,cursor.y);
				ctx.stroke();
			}
		}
		else
			componentTable[cursor.type](cursor);
	}

	//draw grabbed
	ctx.strokeStyle = "#388"
	ctx.lineWidth = 7;
	marked.forEach(element => {
		//draw element
		componentTable[element.type](element);
	});

	//draw all elements
	ctx.strokeStyle = "#000";
	ctx.lineWidth = 1;
	elements.forEach(element => {
		//drawElement
		componentTable[element.type](element);
	});
}

//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------

canvas.addEventListener("mousemove", cursorIcon);
canvas.addEventListener("wheel", rotate);
canvas.addEventListener("contextmenu", discard, false);
canvas.addEventListener("mousedown", onMouseDown);

function onMouseDown(event) {
	if (event.button === 0) {
		let mouse = getMouse(event);

		if (current === "mark") {
			//check if some elements are marked, if yes, make drag and drop
			if (marked.length !== 0) {
				let mark = false;

				marked.forEach(element => {
					let border = getBorder(element);
					if (inRect(mouse, border)) {
						//start drag-and-drop
						canvas.removeEventListener("mousemove", cursorIcon);
						cursor = undefined;
						canvas.addEventListener("mousemove", onMouseMove);
						canvas.addEventListener("mouseup", onMouseUp);
						dnd = {x: Math.floor((mouse.x+tile/2)/tile)*tile, y: Math.floor((mouse.y+tile/2)/tile)*tile};
						draw();
						mark = true;
					}
				});
				if (!mark) {
					marked = [];
					elements.forEach(element => {
						let border = getBorder(element);
						if (inRect(mouse,border)) {
							marked = [element];
							document.getElementById("label_field").value = marked[0].label;
							if (marked[0] instanceof Line) 
								document.getElementById("line_type").disabled = false;
						}
					});
					if (marked.length === 0) {
						document.getElementById("label_field").value = "" ;
						document.getElementById("line_type").disabled = true;
					}
				}
			}
			else {
				//try mark one element
				elements.forEach(element => {
					let border = getBorder(element);
					if (inRect(mouse, border)) {
						marked = [element];
						canvas.removeEventListener("mousemove", cursorIcon);
						cursor = undefined;
						canvas.addEventListener("mousemove", onMouseMove);
						canvas.addEventListener("mouseup", onMouseUp);
						//store mouse coordinate
						dnd = {x: Math.floor((mouse.x+tile/2)/tile)*tile, y: Math.floor((mouse.y+tile/2)/tile)*tile};
						document.getElementById("label_field").value = marked[0].label;
						if (marked[0] instanceof Line)
							document.getElementById("line_type").disabled = false;
						draw();
					}
	 			});
				//if not start marking more elements
				if (marked.length === 0) {
					cursor = {type: "markmore", x1: mouse.x, y1: mouse.y};
					canvas.addEventListener("mouseup", markElements);
					canvas.addEventListener("mousemove", markRect);
					canvas.removeEventListener("mousemove",cursorIcon);
				}
			}
		}
		else if (current !== "mark" && current !== "line" && current !== "current") {
			//create new element
			let e = new Entity(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,dir,current);
			elements.push(e);
			draw();

		}
		else if (current === "line" || current === "current") {
			//begin drawing lines - fill cursor.mouse
			if (cursor !== undefined && cursor.line === undefined) {
				cursor.line = {x: Math.floor((mouse.x+tile/2)/tile)*tile, y: Math.floor((mouse.y+tile/2)/tile)*tile};
			}
			else {
			//else create line or lines if necessary
				if (cursor.line.x === cursor.x || cursor.line.y === cursor.y) {
					//create single line
					let l = new Line(cursor.line.x,cursor.line.y,Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,current);
					elements.push(l);
					cursor.line = undefined;
				}
				else {
					// create 2 lines
					let horizontal = (dir === "left" || dir === "right")
					let l1 = new Line(cursor.line.x,cursor.line.y,horizontal?cursor.line.x:cursor.x,horizontal?cursor.y:cursor.line.y,current),
						l2 = new Line(horizontal?cursor.line.x:cursor.x,horizontal?cursor.y:cursor.line.y,cursor.x,cursor.y,current);
					elements.push(l1);
					elements.push(l2);
					cursor.line = undefined;
				}
			}
		}
	}
}

//action after releasing mouse button
function markElements(event) {
	let mouse = getMouse(event);
	// marked = [];
	if (cursor.x2 < cursor.x1) {
		let temp = cursor.x1;
		cursor.x1 = cursor.x2;
		cursor.x2 = temp;
	}
	if (cursor.y2 < cursor.y1) {
		let temp = cursor.y1;
		cursor.y1 = cursor.y2;
		cursor.y2 = temp;
	}

	elements.forEach(element => {
		let point1, point2;
		if (element instanceof Line) {
			point1 = {x: element.x, y: element.y};
			if (element.horizontal)
				point2 = {x: element.x+element.len, y: element.y};
			else
				point2 = {x: element.x, y: element.y+element.len};
		}
		else {
			if (element.horizontal) {
				point1 = {x: element.x-tile, y: element.y};
				point2 = {x: element.x+tile, y: element.y};
			}
			else {
				point1 = {x: element.x, y: element.y-tile};
				point2 = {x: element.x, y: element.y+tile};
			}
		}

		if (inRect(point1,cursor) && inRect(point2,cursor)) {
			marked.push(element);
		}
	});

	if (marked.length === 1) {
		document.getElementById("label_field").value = marked[0].label;
		if (marked[0] instanceof Line)
			document.getElementById("line_type").disabled = false;
	}

	canvas.removeEventListener("mouseup", markElements);
	canvas.removeEventListener("mousemove", markRect);
	canvas.addEventListener("mousemove", cursorIcon);
}

//drawing rect while mouse moving
function markRect(event) {
	let mouse = getMouse(event);
	cursor.x2 = mouse.x;
	cursor.y2 = mouse.y
}

//drag-and-drop mouse movement
function onMouseMove(event) {
	let mouse = getMouse(event);
	//calc mouse diff and apply to objects from marked 
	let dx = Math.floor((mouse.x+tile/2)/tile)*tile - dnd.x,
		dy = Math.floor((mouse.y+tile/2)/tile)*tile - dnd.y;

	//to change position of dx and dy
	marked.forEach(element => {
		element.dx = dx;
		element.dy = dy;
	});

	draw();
}

//end drag-and-drop event 
function onMouseUp(event) {
	//recalc cords of every item
	marked.forEach(element => {
		element.x += element.dx;
		element.y += element.dy;
		element.dx = 0;
		element.dy = 0;
	})

	canvas.removeEventListener("mousemove", onMouseMove);
	canvas.removeEventListener("mouseup", onMouseUp);
	canvas.addEventListener("mousemove", cursorIcon);
	draw();
}

//rmb click event
function discard(event) {
	event.preventDefault();
	if (cursor !== undefined && cursor.line === undefined) {
		current = "mark";
	}
	marked = [];
	cursor = undefined;
	document.getElementById("label_field").value = "";
	document.getElementById("line_type").disabled = true;
	draw();
	return false;
}

//scroll event
function rotate(event) {
	if (cursor !== undefined)
		cursor.dir = dir = directions[(directions.indexOf(dir)+1)%directions.length];
	else if (marked.length === 1) {
		dir = marked[0].dir;
		marked[0].dir = dir = directions[(directions.indexOf(dir)+1)%directions.length];
		marked[0].horizontal = (marked[0].dir === "left" || marked[0].dir === "right")?true:false;
	}
	event.preventDefault();
}

function cursorIcon(event) {
	if (current !== "mark") {
		let mouse = getMouse(event);
		if (cursor === undefined) {
			if (current === "line" || current === "current")
				cursor = {x: Math.floor((mouse.x+tile/2)/tile)*tile, y:Math.floor((mouse.y+tile/2)/tile)*tile, type: current, line: undefined};
			else
				cursor = new Entity(Math.floor((mouse.x+tile/2)/tile)*tile,Math.floor((mouse.y+tile/2)/tile)*tile,dir,current)
		}
		else {
			cursor.x = Math.floor((mouse.x+tile/2)/tile)*tile;
			cursor.y = Math.floor((mouse.y+tile/2)/tile)*tile;
		}
	}
	else
		cursor = undefined;
}

function getBorder(element) {
	let p = tile/5;
	if (element instanceof Line) {
		return element.horizontal?
		{x1: element.x, y1: element.y-p, x2: element.x+element.len, y2: element.y+p}:
		{x1: element.x-p, y1: element.y, x2: element.x+p, y2: element.y+element.len};
	}
	else {
		return element.horizontal?
		{x1: element.x-tile, y1:element.y-p, x2: element.x+tile, y2: element.y+p}:
		{x1: element.x-p, y1:element.y-tile, x2: element.x+p, y2: element.y+tile};
	}
}

function inRect(point, border) {
	return (point.x > border.x1 && point.x < border.x2 && point.y > border.y1 && point.y < border.y2)
}

function getMouse(event) {
	let rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX-rect.left,
		y: event.clientY-rect.top
	}
}

function changeComponent(comp) {
	current = comp;
	cursor = undefined;
	marked = [];
	document.getElementById("label_field").value = "";
	document.getElementById("line_type").disabled = true;
	draw();
}

function del() {
	marked.forEach(element => {
		elements.splice(elements.indexOf(element),1);
		delete element;
	})
	marked = [];
	document.getElementById("label_field").value = "";
	document.getElementById("line_type").disabled = true;
}

function setLabel() {
	if (marked.length === 1) {
		marked[0].label = document.getElementById("label_field").value;
		if (marked[0] instanceof Line) {
			let e = document.getElementById("line_type");
			marked[0].ends = e.options[e.selectedIndex].text;
		}
	}
	draw();
}

function flipLabel() {
	if (marked.length === 1)
		marked[0].flipLabel = !marked[0].flipLabel;
	draw();
}

function update() {
	draw();
	requestAnimationFrame(update);
}
update();

//--------------------------------------------------
//--------------------------------------------------
//--------------------------------------------------

function gen() {
	let grid = [];
	for (let i=0; i<height/tile; i++) {
		grid[i]=[];
		for (let j=0; j<width/tile; j++) {
			grid[i][j] = [];
		}
	}

	//fill grid array with elements and find lowest left element
	let begin = {x: width, y: 0}
	elements.forEach(element => {
		let obj1, obj2;
		if (element.type === "line" || element.type === "current") {
			if (element.horizontal) {
				obj1 = {x: Math.floor(element.x/tile), y: Math.floor(element.y/tile)}
				obj2 = {x: Math.floor((element.x+element.len)/tile), y: Math.floor(element.y/tile)};
			}
			else {
				obj1 = {x: Math.floor(element.x/tile), y: Math.floor(element.y/tile)};
				obj2 = {x: Math.floor(element.x/tile), y: Math.floor((element.y+element.len)/tile)};
			}
		}
		else {
			if (element.horizontal) {
				obj1 = {x: Math.floor((element.x-tile)/tile), y: Math.floor(element.y/tile)};
				obj2 = {x: Math.floor((element.x+tile)/tile), y: Math.floor(element.y/tile)};
			}
			else {
				obj1 = {x: Math.floor(element.x/tile), y: Math.floor((element.y-tile)/tile)};
				obj2 = {x: Math.floor(element.x/tile), y: Math.floor((element.y+tile)/tile)};
			}
		}
		grid[obj1.y][obj1.x].push(element);
		if (obj2 !== undefined) 
			grid[obj2.y][obj2.x].push(element);

		if (obj1.x < begin.x)
			begin.x = obj1.x;
		if (obj1.y > begin.y)
			begin.y = obj1.y;
		if (obj2 !== undefined) {
			if (obj2.x < begin.x)
				begin.x = obj2.x;
			if (obj2.y > begin.y)
				begin.y = obj2.y;
		}
	});

	function findElem() {
		for (let i=0; i<height/tile; i++) {
			for (let j=0; j<width/tile; j++) {
				if (grid[i][j].length!==0)
					return grid[i][j][0];
			}
		}
	}

	function findPoints(element) {
		if (element instanceof Line) {
			if (element.horizontal) {
				return [{x: Math.floor(element.x/tile), y: Math.floor(element.y/tile)},
						{x: Math.floor((element.x+element.len)/tile), y: Math.floor(element.y/tile)}]
			}
			else {
				return [{x: Math.floor(element.x/tile), y: Math.floor(element.y/tile)},
						{x: Math.floor(element.x/tile), y: Math.floor((element.y+element.len)/tile)}]
			}
		}
		else {
			if (element.horizontal) {
				return [{x:Math.floor((element.x+tile)/tile), y:Math.floor(element.y/tile)},
						{x:Math.floor((element.x-tile)/tile), y:Math.floor(element.y/tile)}];
			}
			else {
				return [{x:Math.floor(element.x/tile), y:Math.floor((element.y+tile)/tile)},
						{x:Math.floor(element.x/tile), y:Math.floor((element.y-tile)/tile)}];
			}
		}
	}

	function findNext(last) {
		let search = true;
		let elems = [];
		while(search) {
			let pts = findPoints(grid[last.y][last.x][0]);
			let found = grid[last.y][last.x][0];
			elems.push(found);
			if (pts[0].x === last.x && pts[0].y === last.y)
				last = {x: pts[1].x, y: pts[1].y};
			else
				last = {x: pts[0].x, y: pts[0].y};
			grid[pts[0].y][pts[0].x].splice(grid[pts[0].y][pts[0].x].indexOf(found),1);
			grid[pts[1].y][pts[1].x].splice(grid[pts[1].y][pts[1].x].indexOf(found),1);
			elems.push({x: last.x-begin.x, y: begin.y-last.y});
			if (grid[last.y][last.x].length===0)
				search = false;
		}
		return elems;
	}

	let result = [];

	let found;
	while ((found = findElem())!==undefined) {

		let points = findPoints(found);
		grid[points[0].y][points[0].x].splice(grid[points[0].y][points[0].x].indexOf(found),1);
		grid[points[1].y][points[1].x].splice(grid[points[1].y][points[1].x].indexOf(found),1);

		let next = [], prev = [];
		if (grid[points[1].y][points[1].x].length >= 1) {
			next = findNext({x: points[1].x, y: points[1].y});
		}
		if (grid[points[0].y][points[0].x].length >= 1) {
			prev = findNext({x: points[0].x, y: points[0].y});
		}
		let output = ((prev.reverse()).concat([{x: points[0].x-begin.x, y: begin.y-points[0].y},found,{x: points[1].x-begin.x, y: begin.y-points[1].y}])).concat(next);
		result.push(output);
	}

	function parseElement(elementArray, element) {
		let prevElement = elementArray[elementArray.indexOf(element)-1],
			nextElement = elementArray[elementArray.indexOf(element)+1],
			elementDir;
		
		if (prevElement.x === nextElement.x)
			elementDir = (prevElement.y<nextElement.y)?"up":"down";
		else
			elementDir = (prevElement.x<nextElement.x)?"right":"left";
		
		let labelMirrored = (elementDir===element.dir)?element.flipLabel:!element.flipLabel,
			elementInverted = (elementDir!==element.dir)?true:false,
			elementLabel = (element.label==="")?"":`,l${labelMirrored?"_":""}=$${element.label}$`;

		let elemMap = {
			"resistor": "R",
			"capacitator": "C",
			"inductor": "L",
			"diode": "Do",
			"led": "leDo",
			"source": "V",
			"sine": "sI",
			"voltmeter": "voltmeter",
			"ammeter": "ammeter"
		}

		let elemToString;
		if (['line','current'].indexOf(element.type) !== -1) {
			let ends = (element.ends === "--")?"":(elementInverted?","+element.ends.split('').reverse().join(""):","+element.ends); 
			if (elementLabel !== "" && element.type === "current")
				elementLabel = elementLabel.substr(0,1)+"i"+elementLabel.substr(2);
			elemToString = `to[short${ends}${elementLabel}]`;
		}
		//invert and mirror unnecessary
		else if (['resistor','capacitator'].indexOf(element.type) !== -1)
			elemToString = `to[${elemMap[element.type]}${elementLabel}]`;
		else 
			elemToString = `to[${elemMap[element.type]}${elementLabel}${elementInverted?",invert,mirror":""}]`;

		return elemToString;
	}

	result = result.map(elemArray => {
		return "\\draw " + elemArray.map(element=> {
			if (element.type === undefined)
				return `(${element.x},${element.y})`;
			else
				return parseElement(elemArray,element);
		}).join(" ") + ";";
	}).join("\n\n");
	
	console.log(result);
}