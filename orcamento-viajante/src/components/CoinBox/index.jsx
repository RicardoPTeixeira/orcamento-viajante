import './coinBox.css'

function CoinBox(infos) {
  

  return (
    <div className='coinBox'>
      <span className='imagem'></span>

      <p className='nomeMoeda'>{infos.nome}</p>

      <div className='cotacoes'>
        1 {infos.nome} = {infos.value.toFixed(2)} BRL
      </div>
      
    </div>
  )
}

export default CoinBox
