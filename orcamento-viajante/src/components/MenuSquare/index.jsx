import './menuSquare.css'

function MenuSquare(infos) {
  const url = infos.link+"?idTravel="+infos.idViagem

  function handleClick() {
    window.location.href = url
  }

  return (
    <div className='menuSquare' onClick={handleClick}>
      <span className='imagem'></span>
      <p>{infos.texto}</p>
    </div>
  )
}

export default MenuSquare
