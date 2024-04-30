export default class Orchestrator {
    constructor() {
        this.wincons = [
            [0, 4, 8],
            [6, 4, 2],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];

        this.state = new Array(9).fill(0);
        this.id = (new Date()).getTime();
        this.won = false;
    }

    PlaceMove(p, move) {
        if (this.state[p] !== 0) {
            console.log("invalid move: ", this.state[p], move);
            return false;
        }
        switch (move) {
            case 'x':
                this.state[p] = 1;
                break;
            case 'o':
                this.state[p] = 4;
                break;
        }
        return true;
    }

    CheckWin() {
        for (const condition of this.wincons) {
            let sum = 0;
            for (const index of condition) {
                sum += this.state[index];
            }
            switch (sum) {
                case 3:
                    this.won = true;
                    return 1; // x won
                case 12:
                    this.won = true;
                    return 4; // o won
            }
        }
        return 0; // no winner
    }

    checkTie() {
        for (const val of this.state) {
            if (val == 0) {
                return false;
            }
        }
        this.won = true;
        return true;
    }

    AvailableMoves() {
        const retarr = [];
        for (let ind = 0; ind < 9; ind++) {
            if (this.state[ind] === 0) {
                retarr.push(ind);
            }
        }
        return retarr;
    }

    PlacedMovesOpponent(x) {
        const retarr = [];
        const filter = x === 'x' ? 1 : 4;
        for (let ind = 0; ind < 9; ind++) {
            if (this.state[ind] === filter) {
                retarr.push(ind);
            }
        }
        return retarr;
    }

    ClearBoard() {
        this.state = new Array(9).fill(0);
    }

    printBoard() {
        let ret = "";
        for (let f = 0; f < 9; f++) {
            ret += this.state[f] + "\t";
            if ((f + 1) % 3 === 0) {
                ret += "\n";
            }
        }
        return ret;
    }
}
