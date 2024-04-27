import React, { useEffect, useState } from 'react'

import '../styles/globals.css'


function MyApp({ Component, pageProps }) {

  useEffect(()=>{
    window.ipc.on("characters", async (event, arg) => {
      
    })

    window.ipc.send("items");
    
  },[])

  return(
    <Component {...pageProps} />
  )
}

export default MyApp
