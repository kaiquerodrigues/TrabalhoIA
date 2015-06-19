function verifyWinner(){
    var totalPieces = 0;
    for(var i=0; i<n; i++){
        for (var j=0; j<n; j++){
            if (pieces[i][j] == equivalent(0))
                totalPieces++;
            else
                totalPieces--;
        }   
    }
    if (totalPieces != 0)
        message = "The winner is " + equivalent(totalPieces+1);
    else
        message = "The game ended with a draw";
    document.getElementById("current-player").setAttribute("value",message);
}