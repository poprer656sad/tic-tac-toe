export default class ComputerPlayer {
    constructor(instance) {
        this.orchInst = instance;
        this.nextmove = -1;
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
        this.updateOpponentMoves(pair);
        let move = this.checkImmediateWin();
        if (move != -1){
            return move
        }
        this.checkNearDeath(pair);
        move = this.makeMove();
        this.updateSelfMoves(move);
        return move;
    }

    updateOpponentMoves(pair) {
        const newWinCon = [];
        let counter = 0;
        for (const con of this.compWinCons) {
            let canUse = true;
            for (const point of con) {
                if (!canUse) continue;
                if (point === pair) {
                    canUse = false;
                    continue;
                }
            }
            if (canUse) {
                newWinCon[counter++] = [...con];
            }
        }
        this.compWinCons = newWinCon;

        for (const con of this.compWinCons) {
            console.log("post update comp win cons: " + con.length);
        }
    }

    updateSelfMoves(pair) {
        const newWinCon = [];
        let counter = 0;
        for (const con of this.playerWinCons) {
            let canUse = true;
            for (const point of con) {
                if (!canUse) continue;
                if (point === pair) {
                    canUse = false;
                    continue;
                }
            }
            if (canUse) {
                newWinCon[counter++] = [...con];
            }
        }
        this.playerWinCons = newWinCon;
    }

    checkNearDeath(playerMove) {
        const opponentMoves = this.orchInst.PlacedMovesOpponent(this.piece);
        for (const con of this.playerWinCons) {
            for (let n = 0; n < 3; n++) {
                const pair = con[n];
                if (pair === playerMove) {
                    for (const move of opponentMoves) {
                        if (move === con[(n + 1) % 3]) {
                            if (this.orchInst.state[con[(n + 2) % 3]] !== this.pieceVal) {
                                this.nextmove = con[(n + 2) % 3];
                                return;
                            }
                        }
                        if (move === con[(n + 2) % 3]) {
                            if (this.orchInst.state[con[(n + 1) % 3]] !== this.pieceVal) {
                                this.nextmove = con[(n + 1) % 3];
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    checkImmediateWin(){
        const availMoves = this.orchInst.AvailableMoves();
        if (availMoves.length === 0) {
            return -1;
        }

        for (const con of this.compWinCons) {
            if (con.length === 1) {
                if(this.orchInst.PlaceMove(con[0], this.piece)){
                    return con[0];
                }else{
                    this.updateOpponentMoves(con[0]);
                };
            }
        }

        return -1
    }

    makeMove() {
        const availMoves = this.orchInst.AvailableMoves();
        if (availMoves.length === 0) {
            return -1;
        }

        if (this.nextmove >= 0) {
            const move = this.nextmove;
            if(this.orchInst.PlaceMove(move, this.piece)){
                this.nextmove = -1;
                return move;
            }else{
                this.updateOpponentMoves(con[0]);
            };
            this.nextmove = -1;
        }

        const scores = new Array(availMoves.length).fill(0);

        for (let g = 0; g < availMoves.length; g++) {
            const move = availMoves[g];
            for (let f = 0; f < this.compWinCons.length; f++) {
                const con = this.compWinCons[f];
                for (const point of con) {
                    if (point === move) {
                        scores[g]++;
                    }
                }
            }
        }

        let maxAt = 0;
        for (let i = 0; i < scores.length; i++) {
            maxAt = scores[i] > scores[maxAt] ? i : maxAt;
        }

        this.orchInst.PlaceMove(availMoves[maxAt], this.piece);

        const newWinCons = [];
        let newWinConCounter = 0;
        for (let f = 0; f < this.compWinCons.length; f++) {
            const wincon = this.compWinCons[f];
            const temp = [];
            let counter = 0;
            for (const point of wincon) {
                if (point !== availMoves[maxAt]) {
                    temp[counter++] = point;
                }
            }
            newWinCons[newWinConCounter++] = temp;
        }

        this.compWinCons = newWinCons;

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

        this.nextmove = -1;
    }
}
