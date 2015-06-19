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
drawBoard();
calculateValidPlays();

//Initialization

//Draw the board
function drawBoard(){
	for (var i = 0; i < n - 1; i++) {
		var pos = pieceSize * (i + 1);
		ctx.beginPath();
		ctx.moveTo(pos, 0);
		ctx.lineTo(pos, length);
		ctx.moveTo(0, pos);
		ctx.lineTo(length, pos);
		ctx.stroke();
		ctx.closePath();
	}
}

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

function setPieceColor(){
	if (turn==0){
		ctx.fillStyle="#FFFFFF";
	}
	if (turn==1){
		ctx.fillStyle="#000000";
	}
}

function play(x,y) {
	var newPlay = jQuery.extend(true,{}, pieces);
	newPlay[x][y] = equivalent(turn);
	setPieceColor();
	// Check if this play is valid
	if (canPlay(newPlay)){
		pieces[y][x] = equivalent(turn);
		turn = (turn +1) % 2;
		calculateValidPlays();
		drawPiece(x,y);
	}
}


function calculateValidPlays(){
	validPlays = [];
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			if ((turn==0 && pieces[i][j]=="w") || (turn==1 && pieces[i][j]=="b")){
				callNavigate(i,j);
			}
		}
	}
}

function inverse(flag){
	if (flag==0)
		return "b";
	if (flag==1)
		return "w";
}

function equivalent(flag){
	if (flag==0)
		return "w";
	if (flag==1)
		return "b";
}

function callNavigate(x,y){
	navigate(x,y,"u",false);
	navigate(x,y,"d",false);
	navigate(x,y,"l",false);
	navigate(x,y,"r",false);
	navigate(x,y,"ur",false);
	navigate(x,y,"ul",false);
	navigate(x,y,"dr",false);
	navigate(x,y,"dl",false);
}

function navigate(x,y,dir,flag){
	switch (dir){
		case "u" :
			if (y!=0){
				y=y-1;
				navigateChoice(x,y,dir,flag);
			}
			break;
		case "d":
			if (y!=n-1){
				y=y+1;
				navigateChoice(x,y,dir,flag);
			}
			break;
		case "l":
			if (x!=0){
				x= x-1;
				navigateChoice(x,y,dir,flag);
			}
			break;
	case "r":
		if (x!=n-1){
			x=x+1;
			navigateChoice(x,y,dir,flag);
		}
		break;
	case "ur":
		if ((x!=n-1) && (y!=0)){
			x=x+1;
			y=y-1;
			navigateChoice(x,y,dir,flag);
		}
		break;
	case "ul":
		if ((x!=0) && (y!=0)){
			x=x-1;
			y=y-1;
			navigateChoice(x,y,dir,flag);
		}
		break;
	case "dr":
		if ((x!=n-1) && (y!=n-1)){
			x=x+1;
			y=y+1;
			navigateChoice(x,y,dir,flag);
		}
		break;
	case "dl":
		if ((x!=0) && (y!=n-1)){
			x=x-1;
			y=y+1;
			navigateChoice(x,y,dir,flag);
		}
		break;
	}
}

function navigateChoice(x,y,dir,flag){
	if ((pieces[x][y]=="e") && flag){
		addValidPlay(x,y);
	}
	else if (pieces[x][y] == inverse(turn)){
		navigate(x,y,dir,true);
	}
	else if (pieces[x][y] == equivalent(turn)){
		navigate(x,y,dir,flag);
	} else{}
}

function addValidPlay(x,y){
	 var currentBoard = jQuery.extend(true,{}, pieces);
	currentBoard[x][y] = equivalent(turn);
	validPlays.push(currentBoard);
}

function initBoard(){
	var pieces = new Array(n);
	for (var k = 0; k < n; k++) {
		pieces[k] = new Array(n);
	}
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			pieces[i][j]="e";
		}
	}
	//Draw the initial pieces
	drawPiece(3,4);
	drawPiece(4,3);
	ctx.fillStyle="#FFFFFF";
	drawPiece(3,3);
	drawPiece(4,4);
	//Set the initial pieces on the pieces array
	pieces[3][4] = "b";
	pieces[4][3] = "b";
	pieces[3][3] = "w";
	pieces[4][4] = "w";
	return pieces;
}

//Events

function makeMovement(event){
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
	var col = Math.floor(y / pieceSize) ;
	var row = Math.floor(x / pieceSize) ;
	play(row,col);
}

function canPlay (play){
	for (var i=0; i< validPlays.length; i++){
		if (arrayComp(play,validPlays[i])){
			return true;
		}
	}
	return false;
}

function arrayComp(array1,array2){
	for (var i=0; i<n; i++){
		if (array1[i].toString()!=array2[i].toString())
			return false;
	}
	return true;
}

Array.prototype.equals = function (array) {
	// if the other array is a falsy value, return
	if (!array)
			return false;

	// compare lengths - can save a lot of time 
	if (this.length != array.length)
			return false;

	for (var i = 0, l=this.length; i < l; i++) {
			// Check if we have nested arrays
			if (this[i] instanceof Array && array[i] instanceof Array) {
					// recurse into the nested arrays
					if (!this[i].equals(array[i]))
							return false;       
			}           
			else if (this[i] != array[i]) { 
					// Warning - two different object instances will never be equal: {x:20} != {x:20}
					return false;   
			}           
	}       
	return true;
}