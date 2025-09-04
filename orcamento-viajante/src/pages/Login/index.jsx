import { useState, useEffect } from 'react'

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { db } from "../../firebase"
import { doc, setDoc } from "firebase/firestore";

import Input from '../../components/Input'
import Button from '../../components/Button'
import './login.css'

function Login() {
  const auth = getAuth();
  const [isLogin, setIslogin] = useState(true);
  const [email, setEmail] = useState('');
  const [passsword, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (isLogin) {
      login(email, passsword);
    } else {
      criarUsuario(email, passsword);
    }
  }

  function changeLoginCadastro() {
    if(isLogin) {
      setIslogin(false)
    } else {
      setIslogin(true)
    }
  }

  async function criarUsuarioBanco(email) {
    try {
      // 1. Constrói a referência para o documento 'usuario1'
      const usuarioRef = doc(db, 'orcamento-viajante', email);

      await setDoc(usuarioRef, {});
      window.location.href ='/'

    } catch (e) {
      console.error("Erro ao criar documento: ", e);
    }
  }

  function criarUsuario(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Usuário criado e logado com sucesso
        const user = userCredential.user;
        console.log("Usuário criado:", user);
        criarUsuarioBanco(email)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Erro ao criar usuário:", errorCode, errorMessage);
      });
  }

  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login realizado com sucesso
        const user = userCredential.user;
        console.log("Login realizado:", user);
        window.location.href ='/'
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Erro ao fazer login:", errorCode, errorMessage);
      });
  }

  return (
    <section className='section login'>
      <label htmlFor="email">E-mail</label>
      <Input
        tipoInput='email'
        idInput='email'
        nameInput='Email'
        valor={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <label htmlFor="password">Senha</label>
      <Input
        tipoInput='password'
        idInput='password'
        nameInput='Password'
        valor={passsword}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className='botoes'>
        <Button texto={isLogin ? 'Login' : 'Cadastrar'} onClick={handleSubmit}/>
        <Button texto={isLogin ? 'Cadastre-se' : 'Logar'} onClick={changeLoginCadastro}/>
      </div>
    </section>
  )
}

export default Login
