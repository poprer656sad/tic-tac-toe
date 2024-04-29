export default function PieceModal(props){
    return <div>
            <div className='z-20 w-screen h-screen bg-blur grid grid-col place-content-center flex flex-row gap-6'>
                <button onClick={()=>{props.playerChoosePiece("x")}}>X</button>
                <button onClick={()=>{props.playerChoosePiece("o")}}>O</button>
            </div>
    </div>
}