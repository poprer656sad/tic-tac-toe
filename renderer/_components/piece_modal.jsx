export default function PieceModal(props){
    return <div>
            <div className='w-screen h-screen grid grid-rows-2 items-center'>
                <div className="w-4" onClick={()=>{props.playerChoosePiece("x")}}>X</div>
                <div className="w-4" onClick={()=>{props.playerChoosePiece("o")}}>O</div>
            </div>
    </div>
}