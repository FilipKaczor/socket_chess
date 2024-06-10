import './Figure.css'

function Figure(props) {
    if(props.number % 2 === 0) {
        return (
            <div className='figure color-box'>
                {props.image && <div className='chesspiece' style={{backgroundImage: `url(${props.image})`}}></div>}
            </div>
        )
    } else {
        return (
            <div className='figure white-box'>
                {props.image && <div className='chesspiece' style={{backgroundImage: `url(${props.image})`}}></div>}
            </div>
        )
    }
}

export default Figure;