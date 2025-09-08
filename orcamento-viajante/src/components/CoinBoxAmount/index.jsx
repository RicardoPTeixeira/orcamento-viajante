import './coinBoxAmount.css'

function CoinBoxAmount(infos) {
  

  return (
    <div className='coinBoxAmount'>
      <span className='imagem'></span>
      <p>{infos.nome}</p>
      <p className='quantidade'>{infos.total}</p>
    </div>
  )
}

export default CoinBoxAmount
