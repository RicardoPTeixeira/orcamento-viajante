import './compradinheiro.css'

function CompraDinheiro(infos) {

    return (
      <div className='compraDinheiro'>
        <div>
            <p>{infos.data}</p>
        </div>
        
        <div>
            <p>{infos.valorMoedaComprada} {infos.moedaComprada}</p>
        </div>

        <div>
            <p>{infos.valorBRL} BRL</p> 
        </div>
      </div>
    )
  
}

export default CompraDinheiro
