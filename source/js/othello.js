//Global Variables

var canvas = document.getElementById("othello-canvas"); 
var ctx = canvas.getContext("2d"); 
//Its not necessary to get height because the canvas is n x n.
var length = canvas.width;
//Defines the board division: 4x4, 8x8...
var n = 8;
var pieceSize = length / n;
 var turn =0;
 var validPlays = [];
 var pieces = initBoard();

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

//Draw a piece
function drawPiece(row,col){
	var x = (row + 0.5) * pieceSize;
	var y = (col + 0.5) * pieceSize;
	var pos = pieceSize / 2;
	ctx.beginPath();
	ctx.arc(x, y, pos * 0.75, Math.PI * 2, false);
	ctx.fill();
	ctx.closePath();
}

function play(x,y) {
	//validPlays = calculateValidPlays();
	if (turn==0){
		ctx.fillStyle="#FFFFFF";
	}
	if (turn==1){
		ctx.fillStyle="#000000";
	}
	turn = (turn +1) % 2;
	drawPiece(x,y);
}


// function calculateValidPlays(){
// 	//esvaziar o vetor de validplays
// 	for (var i=0; i<dimension; i++){
// 		for (var j=0; j<dimension; j++){
// 			if ((turn==0 && pieces[i][j]=="white") || (turn==1 && pieces[i][j]=="black")){
// 				callNavigate(x,y,pieces);
// 			}
// 		}
// 	}
// }

// function inverse(flag){
// 	if (flag==0)
// 		return "black";
// 	if (flag==1)
// 		return "white";
// }

// function equivalent(flag){
// 	if (flag==0)
// 		return "white";
// 	if (flag==1)
// 		return "black";
// }

// function callNavigate(x,y,currentBoard){
// 	navigate(x,y,"u",currentBoard);
// 	navigate(x,y,"d",currentBoard);
// 	navigate(x,y,"l",currentBoard);
// 	navigate(x,y,"r",currentBoard);
// 	navigate(x,y,"ur",currentBoard);
// 	navigate(x,y,"ul",currentBoard);
// 	navigate(x,y,"dr",currentBoard);
// 	navigate(x,y,"dl",currentBoard);
// }
// function navigate(x,y,dir,currentBoard){
// 	if (dir=="u"){
// 		if (currentBoard(x,j)=="empty"){
// 				currentBoard(x,j) = "white";
// 		}
// 	}
// 	if (dir=="d"){

// 	}
// 	if (dir=="l"){

// 	}
// 	if (dir=="r"){

// 	}
// 	if (dir=="ur"){

// 	}
// 	if (dir=="ul"){

// 	}
// 	if (dir=="dr"){

// 	}
// 	if (dir=="dl"){

// 	}
// }

function initBoard(){
	var pieces = new Array(n);
	for (var k = 0; k < n; k++) {
		pieces[k] = new Array(n);
	}
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			pieces[i][j]="empty";
		}
	}
	//Draw the initial pieces
	drawPiece(3,4);
	drawPiece(4,3);
	ctx.fillStyle="#FFFFFF";
	drawPiece(3,3);
	drawPiece(4,4);
	//Set the initial pieces on the pieces array
	pieces[3][4] = "black";
	pieces[4][3] = "black";
	pieces[3][3] = "white";
	pieces[4][4] = "white";
	return pieces;
}

//Events

function makeMovement(event){
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
	var col = Math.ceil(y / pieceSize)-1 ;
	var row = Math.ceil(x / pieceSize)-1 ;
	play(row,col);
}