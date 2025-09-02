import Input from '../../components/Input'
import Button from '../../components/Button'
import './login.css'

function Login() {

  return (
    <section className='section login'>
      <label htmlFor="email">E-mail</label>
      <Input tipoInput='email' idInput='email' nameInput='Email' />
      <label htmlFor="password">Senha</label>
      <Input tipoInput='password' idInput='password' nameInput='Password' />
      <div className='botoes'>
        <Button texto='Login'/>
        <Button texto='Cadastre-se'/>
      </div>
    </section>
  )
}

export default Login
