//Global Variables

var canvas = document.getElementById("othello-canvas"); 
var ctx = canvas.getContext("2d"); 
//Its not necessary to get height because the canvas is n x n.
var length = canvas.width;
//Defines the board division: 4x4, 8x8...
var n = 8;
var pieceSize = length / n;
var turn =1;
var validPlays = [];
var pieces = initBoard();
var currentPlay;

drawBoard();
calculateValidPlays();

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

//Initialization
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

//Change Piece Color
function setPieceColor(piece){
	if (piece=="w"){
		ctx.fillStyle="#FFFFFF";
	}
	if (piece=="b"){
		ctx.fillStyle="#000000";
	}
}


//Add listeners
canvas.addEventListener("mouseup", makeMovement, false);

//Functions

//Check which player the current turn/flag represents
//0 - white
//1 - black
function equivalent(flag){
	if (flag==0)
		return "w";
	if (flag==1)
		return "b";
}

//white turn returns black
//black turn returns white
function inverse(flag){
	if (flag==0)
		return "b";
	if (flag==1)
		return "w";
}

//Check mouse event and calls a play
function makeMovement(event){
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
	var col = Math.floor(y / pieceSize) ;
	var row = Math.floor(x / pieceSize) ;
	play(row,col);
}

//Makes a play
function play(x,y) {
	// Check if this play is valid
	if (pieces[x][y] == "e"){
		var board = canPlay(x,y);
		if (board != -1){
			pieces = jQuery.extend(true,{}, board);
			turn = (turn +1) % 2;
			calculateValidPlays();
			//update gameboard		
			drawPlay(board);
		}
	}
}

//Draw board with new pieces
function drawPlay(board){
	for (var i = 0; i<n; i++) {
		for (var j = 0; j<n; j++) {
			if (board[i][j] != "e"){
				setPieceColor(board[i][j]);
				drawPiece(i,j);
			}
		}
	}
}

//Calculate Valid Plays
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

//Possible directions to move
function callNavigate(x,y){
	currentPlay = [x,y];
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

//Which direction represents the movement
function navigateChoice(x,y,dir,flag){
	if ((pieces[x][y]=="e") && flag){
		preparePlay(x,y,dir);
	}
	else if (pieces[x][y] == inverse(turn)){
		navigate(x,y,dir,true);

	}
	//else if (pieces[x][y] == equivalent(turn)){
	//	navigate(x,y,dir,flag);
	//} else{}
}

//Add a valid play to array
function preparePlay(x,y,dir){
	var currentBoard = jQuery.extend(true,{}, pieces);
	currentBoard[x][y] = equivalent(turn);
	updateColors(currentBoard,x,y,dir);
	addValidPlay(currentBoard,x,y);
}

function addValidPlay(currentBoard,x,y){
	for (var k=0; k< validPlays.length; k++){
		if (validPlays[k][x][y] != "e"){
			for (var i=0; i<n; i++){
				for (var j=0; j<n; j++){
					if (validPlays[k][i][j] != currentBoard[i][j]){
						validPlays[k][i][j] = equivalent(turn);
					}
				}
			}
		return 1;
		}
	}
	validPlays.push(currentBoard);
	return 0;
}
//Update currentBoard to valid Play
function updateColors(currentBoard,x,y,dir){
	if ((currentPlay[0] != x) || (currentPlay[1] != y)){
		currentBoard[x][y] = equivalent(turn);
		switch (dir){
			case "u" :
					y=y+1;
					break;
			case "d":
					y=y-1;
					break;
			case "l":
					x= x+1;
					break;
			case "r":
					x=x-1;
					break;
			case "ur":
					x=x-1;
					y=y+1;
					break;
			case "ul":
					x=x+1;
					y=y+1;
					break;
			case "dr":
					x=x-1;
					y=y-1;
					break;
			case "dl":
					x=x+1;
					y=y-1;
					break;
		}
		updateColors(currentBoard,x,y,dir);
	}
} 

//Check if a play is valid
function canPlay (x,y){
	for (var i=0; i< validPlays.length; i++){
		if (validPlays[i][x][y] != "e"){
			return validPlays[i];
		}
	}
	return -1;
} 