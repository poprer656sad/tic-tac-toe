import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function LoadModal(props){
    let [savedGames, setSavedGames] = useState([]);

    function loadGame(game_name){
        window.ipc.send("GAME:LOAD", game_name);
        props.setOpenLoadModal(false);
    }

    useEffect(()=>{
        window.ipc.on("UPDATE:SAVED_GAMES", (game_files)=>{
            setSavedGames(game_files);
        })
    },[]);

    return (
        <div className="w-screen h-screen z-20 bg-blur relative">
            <div className='absolute top-0 left-0 p-2 w-4 h-4 rounded-full border-2 bg-gray-900' onClick={()=>{props.setOpenLoadModal(false)}}>
                X
            </div>
            <div className='w-3/4 h-3/4 overflow-y-scroll'>
                {
                    savedGames.map((saved_game_name) =>{
                        <div className='w-full h-1/6' key={saved_game_name} onClick={()=>{loadGame(saved_game_name)}}>
                            {saved_game_name}
                        </div>
                    })
                }
            </div>
        </div>
    )
}
