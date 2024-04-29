export default class ComputerPlayer {
    constructor(instance) {
        this.orchInst = instance;
        this.compWinCons = [
            [0, 4, 8],
            [6, 4, 2],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];

        this.playerWinCons = [
            [0, 4, 8],
            [6, 4, 2],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];
    }

    setPiece(inChar) {
        this.piece = inChar;
        this.pieceVal = (inChar == 'x') ? 1 : 4;
    }

    Turn(pair) {
        let move = -1;
        this.updateOpponentMoves(pair);
        if (this.orchInst.AvailableMoves().length == 0){
            return -1
        }
        move = this.checkImmediateWin();
        if (move != -1){
            return move
        }
        move = this.checkNearDeath(pair);
        if (move != -1){
            return move
        }
        
        move = this.makeMove();
        return move;
    }

    updateOpponentMoves(pair) {
        // update computer win cons

        for (let wincon of this.playerWinCons) {
            if (wincon.includes(pair)){
                wincon.splice(wincon.indexOf(pair), 1);
            }
        }

        // update player win cons
        for (let player_ind = this.compWinCons.length; player_ind > 0; player_ind--) {
            if (wincon.includes(pair)){
                this.compWinCons.splice(player_ind, 1);
            }
        }
    }

    checkNearDeath() {
        // const opponentMoves = this.orchInst.PlacedMovesOpponent(this.piece);
        let move = -1;

        for (const con of this.playerWinCons) {
            if(con.length == 1){
                move =  con[0]
            }
        }

        if(move == -1){
            return move
        }

        this.orchInst.PlaceMove(move, this.piece);

        // update computer win cons

        for (let wincon of this.compWinCons) {
            if (wincon.includes(move)){
                wincon.splice(wincon.indexOf(move), 1);
            }
        }

        // update player win cons
        for (let player_ind = this.playerWinCons.length; player_ind > 0; player_ind--) {
            if (wincon.includes(move)){
                this.playerWinCons.splice(player_ind, 1);
            }
        }

        return move
    }

    checkImmediateWin(){
        let move = -1;
        for (const con of this.compWinCons) {
            if (con.length === 1) {
                move = con[0];
            }
        }

        if(move == -1){
            return move
        }

        this.orchInst.PlaceMove(move, this.piece);

        // update computer win cons

        for (let wincon of this.compWinCons) {
            if (wincon.includes(move)){
                wincon.splice(wincon.indexOf(move), 1);
            }
        }

        // update player win cons
        for (let player_ind = this.playerWinCons.length; player_ind > 0; player_ind--) {
            if (wincon.includes(move)){
                this.playerWinCons.splice(player_ind, 1);
            }
        }

        return move
    }

    // minimax algo

    makeMove() {
        const availMoves = this.orchInst.AvailableMoves();
        if (availMoves.length === 0) {
            return -1;
        }

        const scores = new Array(availMoves.length).fill(0);

        for (let move_ind = 0; move_ind < availMoves.length; move_ind++){
            let move = availMoves[move_ind];
            for (let con of this.compWinCons) {
                if(con.includes(move)){
                    scores[move_ind]++;
                }
            }
        }

        let maxAt = 0;
        for (let i = 0; i < scores.length; i++) {
            maxAt = scores[i] > scores[maxAt] ? i : maxAt;
        }

        this.orchInst.PlaceMove(availMoves[maxAt], this.piece);

        // update computer win cons

        for (let wincon of this.compWinCons) {
            if (wincon.includes(availMoves[maxAt])){
                wincon.splice(wincon.indexOf(availMoves[maxAt]), 1);
            }
        }

        // update player win cons
        for (let player_ind = this.playerWinCons.length; player_ind > 0; player_ind--) {
            if (wincon.includes(availMoves[maxAt])){
                this.playerWinCons.splice(player_ind, 1);
            }
        }

        return availMoves[maxAt];
    }

    newGame() {
        this.compWinCons = [
            [0, 4, 8],
            [6, 4, 2],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];

        this.playerWinCons = [
            [0, 4, 8],
            [6, 4, 2],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];
    }
}
