// this is a test to draw ink!

loadtest = function() {
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


inkTo = function(x1, y1, x2, y2, r, g, b, ctx) {
    
    // set line color
    ctx.beginPath();
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+',1)';
    
    // thin line from 1 to 2
    ctx.moveTo(x1, y1);
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // slightly thicker line from 1 to 2, less opaque
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+', 0.8)';
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // third, thicker, less opaque line
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba('+r+','+g+','+b+', 0.4)';
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // small, mostly opaque small line, jittering over first line
    // thicker, less opaque line that varies in thickness from 1 to 2
};

// create a jittery line
jitter = function(x1, y1, x2, y2, r, g, b, d, ctx) {
    var prevC = [x1, x2];
};

// draw a line with varying stroke width
bleedingLine = function(x1, y1, x2, y2, len, ctx) {
    var t = 0;
    var newC = [x1, y1];
    var max = 10;
    ctx.beginPath();
    ctx.lineCap = 'round';
    while(t < distanceFormula(x1, y1, x2, y2)) {
	ctx.beginPath();
	ctx.lineWidth = Math.floor((Math.random()*10)+1);
	ctx.moveTo(newC[0], newC[1]);
	t += len;
	newC = pointAlong(x1, y1, x2, y2, t);
	ctx.lineTo(newC[0], newC[1]);
	ctx.stroke();
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