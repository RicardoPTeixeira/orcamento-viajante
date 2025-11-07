import { useState } from 'react'
import Loading from '../../components/Loading'
import BreadCrumbs from '../../components/BreadCrumbs'

function Relatorios() {

  return (
    <>
      <BreadCrumbs pagAtual="Relatórios" />
      <Loading />
    </>
  )
}

export default Relatorios
