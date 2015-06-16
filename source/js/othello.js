var dimension = 8;
var pieces = initBoard();
var turn =0;
var validPlays = [];

function play(element) {
    validPlays = calculateValidPlays();
    if (turn==0){
        element.className = "white";
    }
    if (turn==1){
        element.className = "black";
    }
    turn = (turn +1) % 2;
}

function calculateValidPlays(){
    //esvaziar o vetor de validplays
    for (var i=0; i<dimension; i++){
        for (var j=0; j<dimension; j++){
            if ((turn==0 && pieces[i][j]=="white") || (turn==1 && pieces[i][j]=="black")){
                callNavigate(x,y,pieces);
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

function callNavigate(x,y,currentBoard){
    navigate(x,y,"u",currentBoard);
    navigate(x,y,"d",currentBoard);
    navigate(x,y,"l",currentBoard);
    navigate(x,y,"r",currentBoard);
    navigate(x,y,"ur",currentBoard);
    navigate(x,y,"ul",currentBoard);
    navigate(x,y,"dr",currentBoard);
    navigate(x,y,"dl",currentBoard);
}
function navigate(x,y,dir,currentBoard){
    if (dir=="u"){
        if (currentBoard(x,j)=="empty"){
                currentBoard(x,j) = "white";
        }
    }
    if (dir=="d"){

    }
    if (dir=="l"){

    }
    if (dir=="r"){

    }
    if (dir=="ur"){

    }
    if (dir=="ul"){

    }
    if (dir=="dr"){

    }
    if (dir=="dl"){

    }
}

function initBoard(){
    var pieces = new Array(dimension);
    for (var k = 0; k < dimension; k++) {
      pieces[k] = new Array(dimension);
    }
    for (var i=0; i<dimension; i++){
        for (var j=0; j<dimension; j++){
            pieces[i][j]="empty";
        }
    }
    pieces[4][5] = "black";
    pieces[5][4] = "black";
    pieces[4][4] = "white";
    pieces[5][5] = "white";
    return pieces;
}