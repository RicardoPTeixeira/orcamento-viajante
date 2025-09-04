import { useState, useEffect } from 'react'
import { db } from '../../firebase'
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../../firebase';
import './escolha-viagem.css'
import TravelSquare from '../../components/TravelSquare'

function EscolhaViagem() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const fetchData = async () => {
      // TODO fazer o email ser relativo com qual usuario esta logado
      const querySnapshot = await getDocs(collection(db, "orcamento-viajante", "libra1ponciano@gmail.com", "viagens"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(items);
      setLoading(false);
    };

    fetchData();
  }, []);

  function createNewTravel() {
    window.location.href ='/adicionar-viagem?idTravel='+(data.length+1)
  }

  if (loading) { return <div>Carregando...</div>; }
  return (
    <section className='section escolhaViagem'>
      Bem vindo {auth.currentUser.email}
      {data.map((dado) => <TravelSquare cidade={dado.cidade} pais={dado.pais}/>)}

      <div className='addNewTravel' onClick={createNewTravel}>
        <span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10ZM10 6C10.5523 6 11 6.44772 11 7V9H13C13.5523 9 14 9.44771 14 10C14 10.5523 13.5523 11 13 11H11V13C11 13.5523 10.5523 14 10 14C9.44771 14 9 13.5523 9 13V11H7C6.44772 11 6 10.5523 6 10C6 9.44771 6.44772 9 7 9H9V7C9 6.44772 9.44771 6 10 6Z" fill="#2C82B5"/>
          </svg>
        </span>
        <p>Adicionar nova viagem</p>
      </div>
    </section>
  )
}

export default EscolhaViagem
