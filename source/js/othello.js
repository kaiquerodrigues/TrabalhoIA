//tags HTML
MESSAGE = "message";
CURRENT_PLAYER = "current-player";
WHITE_SCORE = "white-score";
BLACK_SCORE = "black-score";

//Global Variables
var canvas = document.getElementById("othello-canvas"); 
var ctx = canvas.getContext("2d"); 
//Its not necessary to get height because the canvas is n x n.
var length = canvas.width;
//Defines the board division: 4x4, 8x8...
var n =8;
var pieceSize = length / n;
// 0 - white starts
// 1 - black starts
var turn = 0;
var validPlays = [];
var pieces = initBoard();
var currentPlay;
var scoreBoard;
var endGame = false;

MINMAX_DEPTH = 3;
INIT_MINMAX_FLAG = 0;

drawBoard();
validPlays = calculateValidPlays(pieces);
IAvsIA();

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
	scoreBoard = [2,2];

	//Init html informations
	updateGUI();

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

function currentPlayer(flag){
	if (flag==0)
		return "White";
	if (flag==1)
		return "Black";
}

function updateMenu(id, text){
	document.getElementById(id).innerHTML = text;
}

//Check mouse event and calls a play
function makeMovement(event){
	var x = event.clientX - canvas.offsetLeft;
	var y = event.clientY - canvas.offsetTop;
	var col = Math.floor(y / pieceSize) ;
	var row = Math.floor(x / pieceSize) ;
	// Check if it's turn of IA or Player;
	if (turn==1){
		play(row,col);
	}
	if (turn==0){
		var pos = minMax(MINMAX_DEPTH,INIT_MINMAX_FLAG,pieces,validPlays);
		play(pos[0],pos[1]);
	}
}

function updateGUI(){
	updateMenu(CURRENT_PLAYER, currentPlayer(turn));
	updateMenu(WHITE_SCORE,scoreBoard[0]);
	updateMenu(BLACK_SCORE,scoreBoard[1]);
}

function checkGameOver(){
	endGame = (validPlays.length==0);
	if (endGame){
		updateMenu(MESSAGE, "Player "+currentPlayer(turn)+" lost turn");
		turn = (turn + 1) % 2;
		updateMenu(CURRENT_PLAYER,currentPlayer(turn));
		validPlays = calculateValidPlays(pieces);
		if (validPlays.length == 0){
			updateMenu(MESSAGE, gameOver());
		}
		else{
			endGame = false;		
			updateMenu(MESSAGE,"");
		}
	}
	updateGUI();
}

function gameOver(){
	updateMenu(CURRENT_PLAYER, "-");
	if (scoreBoard[0] > scoreBoard[1])
		return "The White player wins!";
	else if (scoreBoard[0] < scoreBoard[1])
		return "The Black player wins!";
	else 
		return "The game ends with a draw!";
}

//Makes a play
function play(x,y) {
	// Check if this play is valid
	if (pieces[x][y] == "e"){
		var board = canPlay(x,y);
		if (board != -1){
			pieces = jQuery.extend(true,{}, board);
			scoreBoard = calculateScoreBoard(pieces);
			turn = (turn +1) % 2;
			validPlays = calculateValidPlays(pieces);
			//update gameboard		
			drawPlay(board);	
		}
	}
	checkGameOver();
	updateGUI();
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
function calculateValidPlays(board){
	var plays = [];
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			if ((turn==0 && board[i][j]=="w") || (turn==1 && board[i][j]=="b")){
				callNavigate(i,j,board,plays);
			}
		}
	}
	return plays;
}

//Possible directions to move
function callNavigate(x,y,board,plays){
	currentPlay = [x,y];
	navigate(x,y,"u",false,board,plays);
	navigate(x,y,"d",false,board,plays);
	navigate(x,y,"l",false,board,plays);
	navigate(x,y,"r",false,board,plays);
	navigate(x,y,"ur",false,board,plays);
	navigate(x,y,"ul",false,board,plays);
	navigate(x,y,"dr",false,board,plays);
	navigate(x,y,"dl",false,board,plays);
}

function navigate(x,y,dir,flag,board,plays){
	switch (dir){
		case "u" :
			if (y!=0){
				y=y-1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
		case "d":
			if (y!=n-1){
				y=y+1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
		case "l":
			if (x!=0){
				x= x-1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
		case "r":
			if (x!=n-1){
				x=x+1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
		case "ur":
			if ((x!=n-1) && (y!=0)){
				x=x+1;
				y=y-1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
		case "ul":
			if ((x!=0) && (y!=0)){
				x=x-1;
				y=y-1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
		case "dr":
			if ((x!=n-1) && (y!=n-1)){
				x=x+1;
				y=y+1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
		case "dl":
			if ((x!=0) && (y!=n-1)){
				x=x-1;
				y=y+1;
				navigateChoice(x,y,dir,flag,board,plays);
			}
			break;
	}
}

//Which direction represents the movement
function navigateChoice(x,y,dir,flag,board,plays){
	if ((board[x][y]=="e") && flag){
		preparePlay(x,y,dir,plays);
	}
	else if (board[x][y] == inverse(turn)){
		navigate(x,y,dir,true,board,plays);
	}
}

//Add a valid play to array
function preparePlay(x,y,dir,plays){
	var currentBoard = jQuery.extend(true,{}, pieces);
	currentBoard[x][y] = equivalent(turn);
	updateColors(currentBoard,x,y,dir);
	addValidPlay(currentBoard,x,y,plays);
}

function addValidPlay(currentBoard,x,y,plays){
	for (var k=0; k< plays.length; k++){
		if (plays[k][x][y] != "e"){
			for (var i=0; i<n; i++){
				for (var j=0; j<n; j++){
					if (plays[k][i][j] != currentBoard[i][j]){
						plays[k][i][j] = equivalent(turn);
					}
				}
			}
		return 1;
		}
	}
	plays.push(currentBoard);
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

function calculateScoreBoard(board){
	var score = [0,0];
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			if (board[i][j]=="w")
				score[0] ++;
			if (board[i][j]=="b")
				score[1] ++;	
		}
	}
	return score;
}

function calculateDistanceFromEdges(play){
	var value = 0;
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			if (play[i][j]==equivalent(turn)){
				value += n-1 - (Math.min(i,n-1-i) + Math.min(j,n-1-j));
			}
		}
	}
	return value;
}

//Evaluate with the number of pieces of a valid play
function evaluateIA1(flagMinMax, plays){
	var minmax = [0,n*n];
	var index = [-1,-1];
	for (var i = 0; i < plays.length; i++) {
		var value = calculateScoreBoard(plays[i])[turn];
		if (minmax[0] < value){
			index[0] = i;
			minmax[0] = value;
		}
		if (minmax[1] > value){
			index[1] = i;
			minmax[1] = value;
		}
	}
	var flag = index[flagMinMax];
	for (i=0; i<n; i++){
		for (j=0; j<n; j++){
			if (plays[flag][i][j]==equivalent(turn) && (pieces[i][j]=="e"))
				return [i,j,minmax[flagMinMax]];
		}
	}
	return -1;
}

function evaluateIA2(flagMinMax, plays){
	var minmax = [0,calculateMaxBoardValue()];
	var index = [-1,-1];
	for (var i=0; i<plays.length; i++){
		var value = calculateDistanceFromEdges(plays[i]);
		if (minmax[0] < value){
			index[0] = i;
			minmax[0] = value;
		}
		if (minmax[1] > value){
			index[1] = i;
			minmax[1] = value;
		}
	}
	var flag = index[flagMinMax];
	for (i=0; i<n; i++){
		for (j=0; j<n; j++){
			if (plays[flag][i][j]==equivalent(turn) && (pieces[i][j]=="e"))
				return [i,j,minmax[flagMinMax]];
		}
	}

	return -1;
}

function IAvsIA (){
	var currentTurn = turn;
	while(validPlays.length != 0){
		if (turn!=currentTurn){
			var pos = minMax(MINMAX_DEPTH,INIT_MINMAX_FLAG,pieces,validPlays);
			play(pos[0],pos[1]);
		}else{
			var pos = minMax(MINMAX_DEPTH,INIT_MINMAX_FLAG,pieces,validPlays);
			play(pos[0],pos[1]);
		}
		alert("");
	}
}

function calculateMaxBoardValue(){
	var value =0;
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			value += n-1 - (Math.min(i,n-1-i) + Math.min(j,n-1-j));
		}
	}
	return value;
}

function minMax(depth, flagMinMax, board, possiblePlays){
	var currentValue;
	if (depth>0){
		if (possiblePlays.length==0){
			var pos = checkPos(board);
			var value;
			if (flagMinMax == 0){
				value = 0;
			}
			else{
				value = calculateMaxBoardValue();
			}
			currentValue = [pos[0],pos[1],value];
		}
		else{
			currentValue = evaluateIA2(flagMinMax,[possiblePlays[0]]);
		}
		var index=0;
		var board;
		for (var i=0; i<possiblePlays.length; i++){
			board = jQuery.extend(true,{}, possiblePlays[i]);
			newValue = minMax(depth-1, (flagMinMax+1)%2, board, calculateValidPlays(board));
			if (flagMinMax==0){
				if (currentValue[2]<=newValue[2]){
					currentValue[2] = newValue[2];
					index =i;
				}
			}
			if (flagMinMax==1){
				if (currentValue[2]>=newValue[2]){
					currentValue[2] = newValue[2];
					index=i;
				}
			}
		}
		if (possiblePlays.length!=0){
			for (i=0; i<n; i++){
				for (j=0; j<n; j++){
					if (possiblePlays[index][i][j]==equivalent(turn) && (pieces[i][j]=="e")){
						currentValue[0] = i;
						currentValue[1] = j;
					}
				}
			}
		}
	}
	else
	{
		if (possiblePlays.length==0){
			var pos = checkPos(board);
			var value;
			if (flagMinMax == 0){
				value = 0;
			}
			else{
				value = calculateMaxBoardValue();
			}
			currentValue = [pos[0],pos[1],value];
		}
		else{
			var currentValue = evaluateIA2(flagMinMax,possiblePlays);
		}
	}
	return currentValue;
}

function checkPos(board){
	for (var i=0; i<n; i++){
		for (var j=0; j<n; j++){
			if (board[i][j]==equivalent(turn) && (pieces[i][j]=="e"))
				return [i,j];
		}
	}
	return -1;
}