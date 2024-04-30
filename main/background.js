import path from "path";
import { app, ipcMain } from "electron";
import { createWindow } from "./helpers";
import Orchestrator from "./orchestrator";
import ComputerPlayer from "./game_logic";
import * as fs from "fs";

const code_key = {
  0: "",
  1: "x",
  4: "o"
};


(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1200,
    height: 980,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })


  const port = process.argv[2]
  await mainWindow.loadURL(`http://localhost:${port}/home`)
})()

let orchestrator = new Orchestrator();
let computer_player = new ComputerPlayer(orchestrator);

var player_piece = "";

ipcMain.on("BOARD:PLAYER_MOVE", (event, arg) => {
  console.log("UPDATE PLAYER POSITION:", arg);
  if(orchestrator.won){
    event.reply("UPDATE:OVER", code_key[orchestrator.CheckWin()]);
    return
  }
  orchestrator.PlaceMove(arg, player_piece);
  event.reply("UPDATE:POSITIONS", orchestrator.state.map(val => code_key[val]));

  orchestrator.checkTie() || orchestrator.CheckWin();
  if (orchestrator.won){
    event.reply("UPDATE:OVER", code_key[orchestrator.CheckWin()]);
    return;
  }
  
  let computer_move = computer_player.Turn(arg);
  console.log("UPDATE COMPUTER POSITION:", computer_move);
  // orchestrator.PlaceMove(computer_move, computer_player.piece);

  event.reply("UPDATE:POSITIONS", orchestrator.state.map(val => code_key[val]));
  orchestrator.checkTie() || orchestrator.CheckWin();
  if (orchestrator.won){
    event.reply("UPDATE:OVER", code_key[orchestrator.CheckWin()]);
    return;
  }
})

ipcMain.on("BOARD:GET_POS", (event, arg) => {
  console.log("ORCHESTRATOR POSITION: ", orchestrator.state)
  event.reply("UPDATE:POSITIONS", orchestrator.state.map(val => code_key[val]));
})

ipcMain.on("GAME:PLAYER_PIECE", (event, arg) => {
  console.log("SETTING USER PIECE:", arg);
  player_piece = arg;
  let computer_piece = arg == "x" ? "o" : "x";
  computer_player.setPiece(computer_piece);
  
});

ipcMain.on("GAME:GET_SAVED", (event, arg) => {
  event.reply("UPDATE:SAVED_GAMES", fs.readdirSync(__dirname + "\\saved"));
})

ipcMain.on("GAME:LOAD", (event, arg) => {
  setTimeout(()=>{
    let fin = fs.readFileSync(__dirname + `\\saved\\${arg}`, 'utf8');
    let game_obj = JSON.parse(fin);
    event.reply("UPDATE:LOAD", fin);
  
    computer_player.setPiece(game_obj.computer_piece);
    orchestrator.state = game_obj.positions;
    player_piece = game_obj.player_piece;
    orchestrator.id = game_obj.id;
    orchestrator.won = game_obj.won;

    event.reply("UPDATE:POSITIONS", orchestrator.state.map(val => code_key[val]));

    if(orchestrator.won){
      event.reply("UPDATE:OVER", code_key[orchestrator.CheckWin()])
    }
  },1000)
  
})

ipcMain.on("GAME:SAVE", (event, arg) => {
  fs.writeFileSync(__dirname + `\\saved\\saved_${orchestrator.id}.json`,
    JSON.stringify({
        id: orchestrator.id,
        player_piece: player_piece,
        computer_piece: computer_player.piece,
        positions: orchestrator.state,
        won: orchestrator.won
    }
  ))
})

ipcMain.on("GAME:RESET", (event, arg) => {
  orchestrator = new Orchestrator();
  computer_player = new ComputerPlayer(orchestrator);
})
