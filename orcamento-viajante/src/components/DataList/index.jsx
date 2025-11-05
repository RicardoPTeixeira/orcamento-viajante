import './dataList.css'

function DataList(infos) {
  return (
    <>
      <input list={infos.listName} id={infos.idInput} name={infos.nameInput} className='dataList' value={infos.valor} onChange={infos.onChange} />

      <datalist id={infos.listName}>
        {infos.dadosLista.map((e) => {
          if(infos.tipo == 'paises') {
            return <option value={e.countryName}></option>
          } else if (infos.tipo == 'cidades'){
            return <option value={e.name}></option>
          } else if(infos.tipo == 'moedasGasto') {
            return <option value={e.moeda}></option>
          } else {
            return <option value={e}></option>
          }
          
        })}
      </datalist>
    </>
  )
}

export default DataList
