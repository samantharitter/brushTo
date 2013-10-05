// some setup for the ink test.

var cvs;
var ctx;

var cvs_w;
var cvs_h;

function load_page() {

	// set up global contexts and stuff
	cvs = document.getElementById("canvas");
	ctx = cvs.getContext("2d");
	cvs_w = cvs.width; 
	cvs_h = cvs.height;

	// add buttons
	$('#toolBox').html("<h3>Test things</h3><br/>");	
	$('#toolBox').append("<button class='btn' id='penBtn'>Straight Pen Line</button><br/><br/>");
	$('#toolBox').append("<button class='btn' id='inkBtn'>Fat Ink Pen</button><br/><br/>");
	$('#toolBox').append("<button class='btn' id='fountainPenBtn'>Fountain Pen</button><br/><br/>");
	$('#toolBox').append("<button class='btn' id='bleedingPenBtn'>Bleeding Ink Pen</button><br/><br/>");
	$('#toolBox').append("<button class='btn' id='pencilBtn'>Pencil</button><br/><br/>");
	$('#toolBox').append("<button class='btn' id='clearBtn'>Clear</button>");

	// handler for pen btn
	$('#penBtn').on('click', function() {
			var x1 = cvs_w * Math.random();
			var x2 = cvs_w * Math.random();
			var y1 = cvs_h * Math.random();
			var y2 = cvs_h * Math.random();			
			penTo(x1, y1, x2, y2, 0, 0, 0, ctx);
		});

	// handler for ink pen btn
	$('#fountainPenBtn').on('click', function() {
			var x1 = cvs_w * Math.random();
			var x2 = cvs_w * Math.random();
			var y1 = cvs_h * Math.random();
			var y2 = cvs_h * Math.random();			
			fountainPenTo(x1, y1, x2, y2, 0, 0, 0, ctx);
		});

	// handler for ink pen btn
	$('#pencilBtn').on('click', function() {
			var x1 = cvs_w * Math.random();
			var x2 = cvs_w * Math.random();
			var y1 = cvs_h * Math.random();
			var y2 = cvs_h * Math.random();			
			pencilTo(x1, y1, x2, y2, 0, 0, 0, ctx);
			//$('pencil1').Play();
			playSound("pencil1.wav");
		});

	// handler for ink brush btn
	$('#inkBtn').on('click', function() {
			var x1 = cvs_w * Math.random();
			var x2 = cvs_w * Math.random();
			var y1 = cvs_h * Math.random();
			var y2 = cvs_h * Math.random();			
			inkTo(x1, y1, x2, y2, 0, 0, 0, ctx);
		});

	// handler for the clear btn
	$('#clearBtn').on('click', function() {
			ctx.clearRect(0, 0, cvs_w, cvs_h);

			// load paper image background
			var img = new Image();
			img.onload = function() {
				ctx.drawImage(img, 0, 0, cvs_w, cvs_h);
			};
			img.src = "http://lakeshorechurch.org.au/wp-content/uploads/2013/02/rough-beige-paper-texture.jpg";
		});

	$('#clearBtn').click();
}

function playSound(soundfile) {
	$('#dummyDiv').html("<embed src=\""+soundfile+"\" hidden=\"true\" autostart=\"true\" loop=\"false\" />");
}

