let canvas = document.querySelector("canvas"),
	ctx = canvas.getContext("2d"),
	width = canvas.width = 640,
	height = canvas.height = 480;

function update() {

	ctx.clearRect(0,0,width,height);
	ctx.fillStyle = "#ddd";
	ctx.fillRect(0,0,width,height);

	requestAnimationFrame(update);
}
update();