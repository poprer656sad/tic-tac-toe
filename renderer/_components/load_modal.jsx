import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function LoadModal(props){
    let [savedGames, setSavedGames] = useState([]);

    function loadGame(game_name){
        window.ipc.send("GAME:LOAD", game_name+".json");
        props.setOpenLoadModal(false);
    }

    useEffect(()=>{
        window.ipc.on("UPDATE:SAVED_GAMES", (game_files)=>{
            let game_names = game_files.map(game_name => game_name.slice(0,-5));
            console.log(game_names);
            setSavedGames(game_names);
        })
    },[]);

    return (
        <div className="w-full h-screen bg-blur overflow-hidden">
            <div className='m-4 w-4 h-4 rounded-full bg-gray-900 text-red-600' onClick={()=>{props.setOpenLoadModal(false)}}>
                X
            </div>
            <div className='w-full h-full mt-4 overflow-y-scroll'>
            {
                savedGames.map((saved_game_name) =>{
                    return <div className='h-4' key={saved_game_name} onClick={()=>{loadGame(saved_game_name)}}>
                        {saved_game_name}
                    </div>
                })
            }
            </div>
        </div>
    )
}
