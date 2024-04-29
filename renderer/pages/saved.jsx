import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'

export default function SavedPage() {
    
    let [savedGames, setSavedGames] = useState("");

    function loadInGame (arg) {
        window.ipc.send("load_game", arg)
    }

    useEffect(()=>{
        window.ipc.on("saved_games", (game_names)=>{
            setSavedGames(game_names)
        });

        window.ipc.send("get_saved_games")

    },[])

    return (
        <div className="flex flex-col text-2xl w-screen h-screen overflow-y-scroll">
            {
                savedGames.map((game_name) => {
                    return <div
                    key={game_name}
                    className='w-full text-xl h-12'
                    onClick={()=>{loadInGame(game_name)}}
                    >
                        <Link href="/play">
                            {game_name}
                        </Link>
                    </div>
                })
            }
        </div>
    )
}
