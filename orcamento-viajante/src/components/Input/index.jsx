import './input.css'

function Input(infos) {

  if(infos.isDisabled) {
    return (
      <input disabled className='input' type={infos.tipoInput} id={infos.idInput} name={infos.nameInput} value={infos.valor} onChange={infos.onChange}/>
    )
  } else {
    return (
      <input className='input' type={infos.tipoInput} id={infos.idInput} name={infos.nameInput} value={infos.valor} onChange={infos.onChange}/>
    )
  }
  
}

export default Input
