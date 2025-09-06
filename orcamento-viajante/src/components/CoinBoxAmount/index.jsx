import './coinBoxAmount.css'

function CoinBoxAmount(infos) {
  

  return (
    <div className='coinBoxAmount'>
      <span className='imagem'></span>
      {infos.nome}
    </div>
  )
}

export default CoinBoxAmount
