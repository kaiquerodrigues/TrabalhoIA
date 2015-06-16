//Global Variables

var canvas = document.getElementById("othello-canvas"); 
var ctx = canvas.getContext("2d"); 
//Its not necessary to get height because the canvas is n x n.
var length = canvas.width;
//Defines the board division: 4x4, 8x8...
var n = 8;
var pieceSize = length / n;

//Initialization

//Draw the board
for (var i = 0; i < n - 1; i++) {
	var pos = pieceSize * (i + 1);
	ctx.beginPath();
	ctx.moveTo(pos, 0);
	ctx.lineTo(pos, length);
	ctx.moveTo(0, pos);
	ctx.lineTo(length, pos);
	ctx.stroke();
	ctx.closePath();
};
//Add listeners
canvas.addEventListener("mouseup", makeMovement, false);

//Functions

function move(element) {
    element.className = "dark";
}

//Draw a piece
function drawPiece(col, row){
	var x = (col - 0.5) * pieceSize;
	var y = (row - 0.5) * pieceSize;
	var pos = pieceSize / 2;
	ctx.beginPath();
	ctx.arc(x, y, pos * 0.75, Math.PI * 2, false);
	ctx.fill();
	ctx.closePath();
}

//Events

function makeMovement(event){
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
	var col = Math.ceil(x / pieceSize);
	var row = Math.ceil(y / pieceSize);
	drawPiece(col, row);
}