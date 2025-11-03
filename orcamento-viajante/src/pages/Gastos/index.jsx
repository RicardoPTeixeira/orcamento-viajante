import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import Input from '../../components/Input'
import Button from '../../components/Button'

import './gastos.css'

function Gastos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idTravel = searchParams.get('idTravel')
  const [loading, setLoading] = useState(true);

  // Pegar gastos
  const [dataGastos, setDataGastos] = useState([]);

  async function criarOuAtualizarDocumento(viagemId) {
    const dadosGasto = {
      titulo: titulo,
      data: data,
      metodo: metodo,
      categoria: categoria,
      descricao: descricao,
      valor: valor,
      moeda: moeda,
    };

    const idGasto = "gasto-"+(dataComprasDinheiro.length+1)

    try {
      const usuarioLogado = auth.currentUser.email;
      const viagemRef = doc(db, 'orcamento-viajante', usuarioLogado, 'viagens', viagemId, 'gastos', idGasto);

      await setDoc(viagemRef, dadosGasto);
      console.log("Documento atualizado ou criado com sucesso!");
    } catch (e) {
      console.error("Erro ao processar documento:", e);
    }
  }

  const fetchDataGastos = async () => {
      try {
        const gastosRef  = collection(db, 'orcamento-viajante', auth.currentUser.email, 'viagens', idTravel, 'gastos');
        const querySnapshot = await getDocs(gastosRef);
  
        const gastos = [];
        querySnapshot.forEach((doc) => {
          gastos.push({ id: doc.id, ...doc.data() });
        });
        setDataGastos(gastos)
      } catch (e) {
        console.error("Erro ao buscar gastos:", e);
      }
    };

  function handleAdicionar(e) {
    e.preventDefault();
    criarOuAtualizarDocumento(idTravel)
  }

  return (
    <>
      Gastos
    </>
  )
}

export default Gastos
