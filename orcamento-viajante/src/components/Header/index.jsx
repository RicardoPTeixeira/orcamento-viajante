import { useState, useEffect } from 'react'
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import './header.css'
import logo from '../../assets/logo.png'

function Header() {
  const auth = getAuth();

  function signOutUser() {
    signOut(auth).then(() => {
      console.log("Usuário deslogado com sucesso!");
      window.location.href ='/'
    }).catch((error) => {
      // Ocorreu um erro
      console.error("Erro ao fazer logout:", error);
    });
  }

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Usuário está logado
      } else {
        setIsAuthenticated(false); // Usuário não está logado
      }
    });


    return () => unsubscribe(); // Limpa o listener ao desmontar
  }, []);

  return (
    <section className='header'>
      <section className='section'>
        <img src={logo} alt="Logo Orçamento Viajante" />
        <h1>Orçamento Viajante</h1>
        {isAuthenticated ?
          <button className='close' onClick={signOutUser} >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 18C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#FFE39A"/>
            </svg>
          </button>
        :
          <></>
        }
      </section>
    </section>
  )
}

export default Header
