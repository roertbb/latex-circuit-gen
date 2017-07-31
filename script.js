let canvas = document.querySelector("canvas"),
	ctx = canvas.getContext("2d"),
	width = canvas.width = 660,
	height = canvas.height = 480,
	tile = 30;

function drawResistor(x, y direction) {
	ctx.strokeStyle = "#000";
	ctx.beginPath();
	ctx.moveTo(x,y-tile);
	ctx.lineTo(x+tile/2,y-tile);
	ctx.lineTo(x+tile/2,y-tile/2);
	ctx.lineTo(x+3/2*tile,y-tile*3/2);
	ctx.lineTo(x+tile/2,y-tile*3/2);
	ctx.lineTo(x+tile/2,y-tile);
	ctx.moveTo(x+tile*3/2,y+tile);
	ctx.moveTo(x+tile*2,y+tile);
	ctx.stroke();

}

function draw() {
	ctx.clearRect(0,0,width,height);
	ctx.fillStyle = "#f7f7f7";
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

	drawResistor(tile,tile);
}

function update() {

	draw();

	requestAnimationFrame(update);
}
update();