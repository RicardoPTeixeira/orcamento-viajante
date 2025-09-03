import './dataList.css'

function DataList(infos) {
  return (
    <>
      <input list={infos.listName} id={infos.idInput} name={infos.nameInput} className='dataList' value={infos.valor} onChange={infos.onChange} />

      <datalist id={infos.listName}>
        {infos.dadosLista.map((e) => {
          return <option value={e.countryName}></option>
        })}
      </datalist>
    </>
  )
}

export default DataList
