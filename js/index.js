window.requestAnimFrame = (function() {
	return (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		}
	);
})();

var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"),
	canvasWidth = window.innerWidth,
	canvasHeight = window.innerHeight,
	// the cols list will hold all columns
	// of glyphs that will be created
	cols = [],
	timerTick = 0;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

function random(min, max) {
	return (Math.random() * (max - min) + min);
}

function Glyph() {
	this.lightness = 0;
	this.lightnessDecrementer;
	this.lifespan = 0;
	this.drawn = false;
	this.x;
	this.y;
	this.index;
	this.glyphy = String.fromCharCode(random(20000, 25000));
	this.flipper = Math.floor(random(0, 160));
	this.drawn = false;
}

function GlyphColumn() {
	this.column = [];
	this.x = random(0, canvasWidth);
	this.pulser = Math.floor(random(150, 400));
	this.drawable = true;
	this.length = Math.floor(random(25, 75));
	this.lifespan = 0;
	this.lightnessDecrementer = random(0.1, 0.5);
	this.startingY = Math.floor(random(0, canvasHeight / 10));
	this.drawStart = Math.floor(random(0, 100));
	for (var i = 0; i < this.length; i++) {
		this.column.push(new Glyph());
		this.column[i].x = this.x;
		this.column[i].y = this.startingY;
		this.column[i].index = i;
		this.column[i].lightnessDecrementer = this.lightnessDecrementer;
		this.startingY += 15;
	}
	pulseThruCol(this.column);
}

Glyph.prototype.update = function() {
	if (this.drawn) {
		if (timerTick % this.flipper == 0) {
			this.glyphy = String.fromCharCode(random(20000, 25000));
		}
	}
	this.lifespan++;
};

Glyph.prototype.draw = function() {
	if (this.lightness > 50) {
		this.lightness -= 15;
	}
	if (this.drawn) {
		this.lightness -= this.lightnessDecrementer;
		ctx.font = "15px Georgia";
		ctx.fillStyle = "hsl(122, 100%, " + this.lightness + "%)";
		ctx.fillText(this.glyphy, this.x, this.y);
	}
};

GlyphColumn.prototype.update = function() {
	if (this.lifespan >= 750) {
		this.drawable = false;
	}
	if (this.drawable) {
		if (timerTick % this.pulser == 0) {
			pulseThruCol(this.column);
		}
		for (var i = 0; i < this.length; i++) {
			this.column[i].drawn = true;
			this.column[i].draw();
			this.column[i].update();
			this.column[i].lifespan++;
		}
	this.lifespan++;
	}
};

function pulseThruCol(col) {
	for (var i = 0; i < col.length; i++) {
		(function(i) {
			setTimeout(function() {
				col[i].lightness = 100;
			}, 45 * i);
		})(i);
	}
}

function generateCol() {
	cols.push(new GlyphColumn());
}

function loop() {
	// this function will run endlessly with requestAnimationFrame
	requestAnimFrame(loop);
	ctx.globalCompositeOperation = "destination-out";
	ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.globalCompositeOperation = "lighter";

	var i = cols.length;

	while (i--) {
		cols[i].update();
	}

	if (timerTick % Math.floor(random(15, 25)) == 0) {
		generateCol();
	}
	timerTick++;
}

window.onload = loop;
