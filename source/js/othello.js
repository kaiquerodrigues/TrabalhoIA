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

function play(x,y) {
	calculateValidPlays();
	if (turn==0){
		ctx.fillStyle="#FFFFFF";
	}
	if (turn==1){
		ctx.fillStyle="#000000";
	}
	 // Check if this play is valid before doing it
	pieces[y][x] = equivalent(turn); // <-- gambiarra
	turn = (turn +1) % 2;
	drawPiece(x,y);
	//
}


function calculateValidPlays(){
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			if ((turn==0 && pieces[i][j]=="white") || (turn==1 && pieces[i][j]=="black")){
				callNavigate(i,j);
			}
		}
	}
}

function inverse(flag){
	if (flag==0)
		return "black";
	if (flag==1)
		return "white";
}

function equivalent(flag){
	if (flag==0)
		return "white";
	if (flag==1)
		return "black";
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
	if ((pieces[x][y]=="empty") && flag){
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
	var col = Math.floor(y / pieceSize) ;
	var row = Math.floor(x / pieceSize) ;
	play(row,col);
}