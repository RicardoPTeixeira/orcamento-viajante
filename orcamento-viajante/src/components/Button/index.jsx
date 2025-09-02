import './button.css'

function Button(infos) {

  return (
    <button className='button' onClick={infos.onClick}>{infos.texto}</button>
  )
}

export default Button
