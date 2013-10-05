// this is a test to draw ink!

function loadtest() {
	cvs = document.getElementById("canvas");
	ctx = cvs.getContext("2d");
	
	// draw a normal line
	ctx.beginPath();
	ctx.moveTo(100, 100);
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.lineTo(100, 300);
	ctx.stroke();

	// draw the ink line
	inkTo(200, 100, 200, 300, 0, 0, 0, ctx);

	// draw the dotted line
	ctx.lineCap = 'butt';
	dottedLine(300, 100, 300, 300, 10, 10, ctx);

	// draw the bleeding line
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	bleedingLine(350, 100, 350, 300, 2, ctx);
};

// given a line defined by two points,
// returns points in d pixels from the ends of the
// line.
function alongLine(x1, y1, x2, y2, d) {
	var Delta_x = Math.abs(x2 - x1);
	var Delta_y = Math.abs(y2 - y1);

	var theta = Math.atan(Delta_y/Delta_x);
	var dy = d * Math.sin(theta);
	var dx = d * Math.cos(theta);

	// adjust for +/-
	if (x1 > x2) dx = -dx;
	if (y1 > y2) dy = -dy;
	var in_x1 = x1 + dx;
	var in_x2 = x2 - dx;
	var in_y1 = y1 + dy;
	var in_y2 = y2 - dy;

	var pts = [in_x1, in_y1, in_x2, in_y2];
	return pts;
};

// a thin pen line
function penTo(x1, y1, x2, y2, r, g, b, ctx) {

    ctx.lineCap = 'round';
    
    // thin line from 1 to 2
    ctx.beginPath();
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+',1)';
    ctx.moveTo(x1, y1);
    ctx.lineWidth = 1;
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // slightly thicker line from >1 to <2, less opaque	
	var pts = alongLine(x1, y1, x2, y2, 6);
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+', 0.9)';
    ctx.lineTo(pts[2], pts[3]);
    ctx.stroke();

    // third, thicker, less opaque line
	var pts2 = alongLine(x1, y1, x2, y2, 12);
    ctx.beginPath();
    ctx.moveTo(pts2[0], pts2[1]);
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+', 0.6)';
    ctx.lineTo(pts2[2], pts2[3]);
    ctx.stroke();

};

// an ink brush line
function inkTo(x1, y1, x2, y2, r, g, b, ctx) {

	var pts = alongLine(x1, y1, x2, y2, 10);
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+', 1)';
	bleedingLine(pts[0], pts[1], pts[2], pts[3], 2, .5, ctx); 

	var pts2 = alongLine(x1, y1, x2, y2, 15);
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+', .9)';
	bleedingLine(pts2[0], pts2[1], pts2[2], pts2[3], 2, 1, ctx); 

	var pts3 = alongLine(x1, y1, x2, y2, 25);
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+', .5)';
	bleedingLine(pts2[0], pts2[1], pts2[2], pts2[3], 3, 5, ctx); 
};

// a pencil line
function pencilTo(x1, y1, x2, y2, r, g, b, ctx) {
	ctx.lineCap = 'round';

	var points = jitteryLinePoints(x1, y1, x2, y2, 2, 4, ctx);
	ctx.lineWidth = 1.5;

	for (var i = 0; i < (points.length - 1); i++) {
		ctx.strokeStyle = 'rgba(65, 65, 65,' + (.2 + Math.random()*.3) +')';
		ctx.beginPath();
		//		ctx.lineWidth = 3 + (Math.random()*2);
		ctx.moveTo(points[i][0], points[i][1]);
		ctx.lineTo(points[i + 1][0], points[i + 1][1]);
		ctx.stroke();
	}
};

function bleedingPenTo(x1, y1, x2, y2, r, g, b, ctx) {
	ctx.lineCap = 'round';

	var points = jitteryLinePoints(x1, y1, x2, y2, 2, 4, ctx);
	var strokes = [];

	// draw the base line
	ctx.beginPath();
	ctx.strokeStyle = 'rgba(65, 65, 65, 1)';
	for (var i = 0; i < (points.length - 1); i++) {
		var width = 2 + (Math.random());
		ctx.lineWidth = width;
		strokes.push(width);
		ctx.moveTo(points[i][0], points[i][1]);
		ctx.lineTo(points[i + 1][0], points[i + 1][1]);
	}
	ctx.stroke();

	// draw another on top, building off old widths
	
};

// like a calligraphy pen?
function fountainPenTo(x1, y1, x2, y2, r, g, b, ctx) {

    ctx.strokeStyle = 'rgba(84, 84, 84, 1)';
	var points = jitteryLinePoints(x1, y1, x2, y2, 10, 20, ctx);

	ctx.lineCap = 'square';
	for (var i = 0; i < (points.length - 1); i++) {
		ctx.beginPath();
		ctx.lineWidth = 2 + (Math.random());
		ctx.moveTo(points[i][0], points[i][1]);
		ctx.lineTo(points[i + 1][0], points[i + 1][1]);
		ctx.stroke();
	}
};

// jitter
// dev is the deviation
// j is how jittery the line is
function jitteryLineTo(x1, y1, x2, y2, dev, j, ctx) {
	var points = jitteryLinePoints(x1, y1, x2, y2, dev, j, ctx);

	ctx.beginPath();
	for (var i = 0; i < (points.length - 1); i++) {
		ctx.moveTo(points[i][0], points[i][1]);
		ctx.lineTo(points[i + 1][0], points[i + 1][1]);
		ctx.stroke();
	}
}

// just generates jittery coordinates, and returns them
// in a big array of little arrays.
function jitteryLinePoints(x1, y1, x2, y2, dev, j, ctx) {
	var points = [];
	var step = j;
	var t = step;
	var Delta_x = Math.abs(x2 - x1);
	var Delta_y = Math.abs(y2 - y1);
	var theta = Math.atan(Delta_y/Delta_x);
	var line_length = distanceFormula(x1, y1, x2, y2);

	points.push([x1, y1]);

	// for each pt' along the way, get a small, random d
	while ((t + step) < line_length) {
		var pts = alongLine(x1, y1, x2, y2, t);
		var x_prime = pts[0];
		var y_prime = pts[1];
		var d = Math.random() * dev; 
		var new_y = y_prime - (d * Math.cos(theta));
		var new_x = x_prime + (d * Math.sin(theta));
		points.push([new_x, new_y]);
		t += step;
	}
	points.push([x2, y2]);
	return points;
}

// divides up line into small segments step
// pixels apart
function stepLine(x1, y1, x2, y2, step) {
	var points = [];
    var t = step;
	var line_length = distanceFormula(x1, y1, x2, y2);

	points.push([x1, y1]);

    while(t < line_length) {
		var pts = alongLine(x1, y1, x2, y2, t);
		points.push([pts[0], pts[1]]);
		t += len;
    }
	points.push([x2, y2]);
	return points;
}  

// draw a line with varying stroke width
// base width of w, change of diff
function bleedingLine(x1, y1, x2, y2, w, diff, ctx) {
	var len = 3; // how often do we change it up
    var t = len;
	var line_length = distanceFormula(x1, y1, x2, y2);

	var pt = [x1, y1];
    ctx.lineCap = 'round';

    while(t < line_length) {
		ctx.beginPath();
		ctx.lineWidth = ((Math.random() * diff) + w);
		ctx.moveTo(pt[0], pt[1]);
		var pts = alongLine(x1, y1, x2, y2, t);
		ctx.lineTo(pts[0], pts[1]);
		ctx.stroke();

		pt[0] = pts[0];
		pt[1] = pts[1];
		t += len;
    }
};

// from 1 to 2, draw a dashed line with dashes
// of 'dash' len and 'space' spaces in between
// set stroke style first
dottedLine = function(x1, y1, x2, y2, dash, space, ctx) {
    var t = dash + space;
    var d = distanceFormula(x1, y1, x2, y2);
    var prevC = [x1, y1];
    var newC;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    while (t <= d) {
	newC = pointAlong(prevC[0], prevC[1], x2, y2, dash);
	ctx.lineTo(newC[0], newC[1]);
	prevC = newC;
	newC = pointAlong(prevC[0], prevC[1], x2, y2, space);
	ctx.moveTo(newC[0], newC[1]);
	prevC = newC;
	t += space;
	t += dash;
    }
    ctx.stroke();
};

// this function gives the coordinates of a point
// d pixels along the line from 1 to 2.
// returns a tuple with the coordinates.
pointAlong = function(x1, y1, x2, y2, d) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var distance = distanceFormula(x1, x2, y1, y2);
    var ratio = d / distance;
    return [x1 + dx * ratio, y1 + dy * ratio];
};

distanceFormula = function(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2));
};