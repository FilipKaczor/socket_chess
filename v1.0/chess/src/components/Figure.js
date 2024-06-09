import './Figure.css'

function Figure(props) {
    if(props.number % 2 === 0) {
        return <div className='figure color-box'><img src={props.image} /></div>
    } else {
        return <div className='figure white-box'><img src={props.image} /></div>
    }
}

export default Figure;