import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {

    // make new game an event

    let [currentBoard, setCurrentBoard] = useState([]);

    let [playerPiece, setPlayerPiece] = useState("");

    let [won, setWinner] = useState(false);

    function playerChoosePiece(value){
        setPlayerPiece(value);
        window.ipc.send("player_value", value)
    }

    function makeMove(position_index){
        console.log("position clicked: ", position_index);
        window.ipc.send("player_move", position_index)
    };

    useEffect(()=>{
        window.ipc.on("update_positions", (pos_in)=>{
            console.log("recieved update", pos_in);
            setCurrentBoard(pos_in);
        });

        window.ipc.on("won", (winner)=>{
            console.log("recieved winner", winner);
            setWinner(winner);
        });

        window.ipc.on("load_game", (game_in)=>{
            console.log("load_game", game_in);
            let game_obj = JSON.parse(fin);

            setPlayerPiece(game_obj.player_piece);
        });

        window.ipc.send("get_positions")

    },[])

    return (
        <div className="grid grid-col text-2xl w-screen h-screen">
            {
                playerPiece == "" ? 
                <div className='z-20 w-screen h-screen bg-blur grid grid-col place-content-center'>
                    <button onClick={()=>{playerChoosePiece("x")}}>X</button>
                    <button onClick={()=>{playerChoosePiece("o")}}>O</button>
                </div>: <></>
            }
            <div className='z-20 grid grid-rows-3 w-[600px] h-[600px] overflow-y-hidden'>
                <div className='grid grid-cols-3 w-full border-2'>
                {
                        currentBoard.slice(0,3).map((pos, ind) =>{
                            return <div className="h-full border-2" key={ind} onClick={pos == "" ? ()=>{makeMove(ind)} : ()=>{}}>
                                {pos}
                            </div>
                        })
                    }
                </div>
                <div className='grid grid-cols-3 w-full'>
                {
                        currentBoard.slice(3,6).map((pos, ind) =>{
                            return <div className="h-full border-2" key={ind+3} onClick={pos == "" ? ()=>{makeMove(ind+3)} : ()=>{}}>
                                {pos}
                            </div>
                        })
                    }
                </div>
                <div className='grid grid-cols-3 w-full'>
                    {
                        currentBoard.slice(6,9).map((pos, ind) =>{
                            return <div className="h-full border-2" key={ind+6} onClick={pos == "" ? ()=>{makeMove(ind+6)} : ()=>{}}>
                                {pos}
                            </div>
                        })
                    }
                </div>
            </div>
            

            <div className='flex flex-row w-full h-[200px] gap-2'>
                <div className='' onClick={()=>{window.ipc.send("save_game")}}>
                    SAVE
                </div>
                {
                    winner && winner.length == 0 ? <div className='pl-12 text-xl'>
                        WINNER IS {winner}
                        </div>:
                        <div className='pl-12 text-xl'>
                          TIE
                        </div>
                }
            </div>
        </div>
    )
}
