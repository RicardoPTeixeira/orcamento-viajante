import { useState } from 'react'
import { useSearchParams } from 'react-router-dom';

import MenuSquare from '../../components/MenuSquare'
import BreadCrumbs from '../../components/BreadCrumbs';

import './menu.css'

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idViagem = searchParams.get('idTravel');

  return (
    <>
      <BreadCrumbs isMenu={true} />
      <section className='section menu'>
        <MenuSquare texto='Cotações e dinheiro fisico' link='cotacoes-dinheiro' idViagem={idViagem}/>
        <MenuSquare texto='Resgistro de gastos' link='gastos' idViagem={idViagem}/>
        <MenuSquare texto='Relatórios' link='relatorios' idViagem={idViagem}/>
        <MenuSquare texto='Configuração de limite' link='limites' idViagem={idViagem}/>
      </section>
    </>
  )
}

export default Menu
