import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import PieceModal from '_components/piece_modal';
import LoadModal from '_components/load_modal';

export default function HomePage() {

    // make new game an event

    let [currentBoard, setCurrentBoard] = useState([]);

    let [playerPiece, setPlayerPiece] = useState("");

    let [winner, setWinner] = useState(false);

    let [openLoadModal, setOpenLoadModal] = useState(false);
    let [pieceModal, setPieceModal] = useState(false);

    function replay(){
      window.ipc.send("GAME:RESET");
      setPlayerPiece("");
      setWinner(false);
      setCurrentBoard([]);
      window.ipc.send("BOARD:GET_POS");
    }

    function playerChoosePiece(value){
        setPlayerPiece(value);
        setPieceModal(false);
        window.ipc.send("GAME:PLAYER_PIECE", value);
        
    }

    function openLoadModalFunc(){
        setOpenLoadModal(true);
        window.ipc.send("GAME:GET_SAVED");
    }

    function makeMove(position_index){
        console.log("MAKING PLAYER MOVE: ", position_index);
        window.ipc.send("BOARD:PLAYER_MOVE", position_index)
    };

    function saveGame(){
        window.ipc.send("GAME:SAVE");
    }

    useEffect(()=>{

        window.ipc.on("UPDATE:POSITIONS", (pos_in)=>{
            console.log("UPDATING BOARD POSITIONS: ", pos_in);
            setCurrentBoard(pos_in);
        });

        window.ipc.on("UPDATE:OVER", (winner_in)=>{
            console.log("GAME WON", winner_in);
            setWinner(winner_in.toUpperCase());
        });

        window.ipc.on("UPDATE:LOAD", (game_in)=>{
            let game_obj = JSON.parse(game_in);

            setPlayerPiece(game_obj.player_piece);

        });

        window.ipc.send("BOARD:GET_POS");

    },[])

    return (
        <div className="relative grid grid-col text-2xl w-screen h-screen z-0 pt-8 px-12 relative overflow-hidden">
            {pieceModal && <PieceModal playerChoosePiece={playerChoosePiece}/>}
            {openLoadModal && <LoadModal setOpenLoadModal = {setOpenLoadModal}/>}

          <div className='h-20 w-[600px] flex flex-col items-center text-center'>
            {
                (typeof winner == "string") ?
                <div>
                    {
                        winner.length == 1 ?
                        <div className='text-xxl'>
                            WINNER IS {winner}
                        </div>:
                        <div className='text-xxl'>
                            TIE
                        </div>
                    }
                    <div className="border-2 w-40" onClick={()=>{replay()}}>
                        Replay Game
                    </div>
                </div>:
                <></>
            }
          </div>
            <div className='z-20 grid grid-rows-3 w-[600px] h-[600px] overflow-y-hidden'>
                <div className='grid grid-cols-3 w-full border-2'>
                {
                        currentBoard.slice(0,3).map((pos, ind) =>{
                            return <div className="h-full border-2" key={ind} onClick={((playerPiece != "") && (pos == "")) ? ()=>{makeMove(ind)} : ()=>{}}>
                                {pos}
                            </div>
                        })
                    }
                </div>
                <div className='grid grid-cols-3 w-full'>
                {
                        currentBoard.slice(3,6).map((pos, ind) =>{
                            return <div className="h-full border-2" key={ind+3} onClick={((playerPiece != "") && (pos == "")) ? ()=>{makeMove(ind+3)} : ()=>{}}>
                                {pos}
                            </div>
                        })
                    }
                </div>
                <div className='grid grid-cols-3 w-full'>
                    {
                        currentBoard.slice(6,9).map((pos, ind) =>{
                            return <div className="h-full border-2" key={ind+6} onClick={((playerPiece != "") && (pos == "")) ? ()=>{makeMove(ind+6)} : ()=>{}}>
                                {pos}
                            </div>
                        })
                    }
                </div>
            </div>
            

            <div className='flex flex-row w-[600px] h-[200px] gap-2 px-8 my-8'>
                {
                    playerPiece.length == 0 ? 
                    <div className='text-center h-10 w-20 border-2' onClick={()=>{setPieceModal(true)}}>Play</div>:
                    <div className='text-center h-10 w-20 border-2' onClick={()=>{saveGame()}}>SAVE</div>
                }
                <div className='flex-grow'></div>
                <div className='text-center h-10 w-20 border-2' onClick={()=>{openLoadModalFunc()}}>LOAD</div>
            </div>
        </div>
    )
}
