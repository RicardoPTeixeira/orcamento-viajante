import './input.css'

function Input(infos) {

  return (
    <input class='input' type={infos.tipoInput} id={infos.idInput} name={infos.nameInput}/>
  )
}

export default Input
