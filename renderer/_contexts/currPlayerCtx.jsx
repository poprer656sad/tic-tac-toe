const { createContext } = require("react");

const PlayerCtx = createContext({
    player: {},
    setPlayer: () => {}
})

export default PlayerCtx;