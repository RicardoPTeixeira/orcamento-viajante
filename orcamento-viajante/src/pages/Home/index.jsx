import { useState, useEffect } from 'react'
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Usuário está logado
        window.location.href ='/escolha-viagem'
      } else {
        setIsAuthenticated(false); // Usuário não está logado
        window.location.href ='/login'
      }
    });


    return () => unsubscribe(); // Limpa o listener ao desmontar
  }, []);

  return (
    <>
      {isAuthenticated ? "true" : "false"}
    </>
  )
}

export default Home
