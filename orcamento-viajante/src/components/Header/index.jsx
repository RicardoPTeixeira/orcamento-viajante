import { useState } from 'react'
import './header.css'
import logo from '../../assets/logo.png'

function Header() {

  return (
    <section className='header'>
      <section className='section'>
        <img src={logo} alt="Logo Orçamento Viajante" />
        <h1>Orçamento Viajante</h1>
      </section>
    </section>
  )
}

export default Header
