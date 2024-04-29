import path from "path";
import { app, ipcMain } from "electron";
import { createWindow } from "./helpers";
import Orchestrator from "./orchestrator";
import ComputerPlayer from "./game_logic";
import * as fs from "fs";


(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1520,
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

ipcMain.on("player_move", (event, arg) => {
  if(orchestrator.won){
    var winner;
    switch(orchestrator.CheckWin()){
      case 0:
        winner = "";
        break;
      case 1:
        winner = "x";
        break;
      case 4:
        winner = "o";
        break;
    };
    event.reply("won", winner)
    return
  }
  orchestrator.PlaceMove(arg, player_piece);
  event.reply("update_positions", orchestrator.state.map(val => {
    switch(val){
      case 0:
        return ""
      case 1:
        return "x"
      case 4:
        return "o"
    }
  }));
  if (orchestrator.CheckWin() || orchestrator.checkTie()){
    var winner;
    switch(orchestrator.CheckWin()){
      case 0:
        winner = "";
        break;
      case 1:
        winner = "x";
        break;
      case 4:
        winner = "o";
        break;
    };
    event.reply("won", winner)
    return;
  }
  let computer_move = computer_player.Turn(arg);
  orchestrator.PlaceMove(computer_move, computer_player.piece);

  event.reply("update_positions", orchestrator.state.map(val => {
    switch(val){
      case 0:
        return ""
      case 1:
        return "x"
      case 4:
        return "o"
    }
  }));

  if (orchestrator.CheckWin() || orchestrator.checkTie()){
    var winner;
    switch(orchestrator.CheckWin()){
      case 0:
        winner = "";
        break;
      case 1:
        winner = "x";
        break;
      case 4:
        winner = "o";
        break;
    };
    event.reply("won", winner)
    return;
  }
})

ipcMain.on("get_positions", (event, arg) => {
  event.reply("update_positions", orchestrator.state.map(val => {
    switch(val){
      case 0:
        return ""
      case 1:
        return "x"
      case 4:
        return "o"
    }
  }));
})

ipcMain.on("player_value", (event, arg) => {
  console.log("player piece: ", arg);
  player_piece = arg;
  let computer_piece = arg == "x" ? "o" : "x";
  computer_player.setPiece(computer_piece);
  
});

ipcMain.on("get_saved_games", (event, arg) => {
  event.reply("saved_games", fs.readdirSync(__dirname + "\\saved"));
})

ipcMain.on("load_game", (event, arg) => {
  setTimeout(()=>{
    let fin = fs.readFileSync(__dirname + `\\saved\\${arg}`, 'utf8');
    let game_obj = JSON.parse(fin);
    event.reply("load_game", fin);
  
    computer_player.setPiece(game_obj.computer_piece);
    orchestrator.state = game_obj.positions;
    player_piece = game_obj.player_piece;
    orchestrator.id = game_obj.id;
    orchestrator.won = game_obj.won;

    if(orchestrator.won){
      event.reply("won", fin)
    }
  },1000)
  
})

ipcMain.on("save_game", (event, arg) => {
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
