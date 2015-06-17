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
 calculateValidPlays();

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
	if (turn==0){
		ctx.fillStyle="#FFFFFF";
	}
	if (turn==1){
		ctx.fillStyle="#000000";
	}
	turn = (turn +1) % 2;
	drawPiece(x,y);
}


function calculateValidPlays(){
	//esvaziar o vetor de validPlays
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			if ((turn==0 && pieces[i][j]=="white") || (turn==1 && pieces[i][j]=="black")){
				callNavigate(i,j,pieces);
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
	navigate(x,y,"u",true);
	navigate(x,y,"d",false);
	navigate(x,y,"l",false);
	navigate(x,y,"r",false);
	navigate(x,y,"ur",false);
	navigate(x,y,"ul",false);
	navigate(x,y,"dr",false);
	navigate(x,y,"dl",false);
}

function navigate(x,y,dir,flag){
	var currentBoard = pieces;
	if (dir=="u"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if (y!=0)
				if (currentBoard[x][y-1] == inverse(turn))
					navigate(x,y-1,dir,true);
	}
	if (dir=="d"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if (y!=8)
				if (currentBoard[x][y+1]==inverse(turn))
					navigate(x,y+1,dir,true);
	}
	if (dir=="l"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if (x!=0)
				if (currentBoard[x-1][y]==inverse(turn))
					navigate(x-1,y,dir,true);
	}
	if (dir=="r"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if (x!=8)
				if (currentBoard[x+1][y]==inverse(turn))
					navigate(x+1,y,dir,true);
	}
	if (dir=="ur"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if ((x!=8) && (y!=0))
				if (currentBoard[x+1][y-1]==inverse(turn))
					navigate(x+1,y-1,dir,true);
	}
	if (dir=="ul"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if ((x!=0) && (y!=0))
				if (currentBoard[x-1][y-1]==inverse(turn))
					navigate(x-1,y-1,dir.true);
	}
	if (dir=="dr"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if ((x!=8) && (y!=8))
				if (currentBoard[x+1][y+1]==inverse(turn))
					navigate(x+1,y+1,dir,true);
	}
	if (dir=="dl"){
		if ((currentBoard[x][y]=="empty") && flag)
			addValidPlay(x,y,currentBoard);
		else
			if ((x!=0) && (y!=8))
				if (currentBoard[x-1][y+1]==inverse(turn))
					navigate(x-1,y+1,dir,true);
	}
}

function addValidPlay(x,y,currentBoard){
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
	var col = Math.ceil(y / pieceSize)-1 ;
	var row = Math.ceil(x / pieceSize)-1 ;
	play(row,col);
}