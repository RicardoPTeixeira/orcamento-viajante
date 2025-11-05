import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import Input from '../../components/Input'
import Button from '../../components/Button'

import './planejamentoGastos.css'

function PlanejamentoGastos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idTravel = searchParams.get('idTravel')
  const [loading, setLoading] = useState(true);

  const [passagens, setPassagens] = useState(0);
  const [hospedagem, setHospedagem] = useState(0);
  const [alimentacao, setAlimentacao] = useState(0);
  const [passeios, setPasseios] = useState(0);
  const [transporte, setTransporte] = useState(0);
  const [souvenirs, setSouvenirs] = useState(0);
  const [planejamentoTotal, setPlanejamentoTotal] = useState(0);

  async function criarOuAtualizarDocumento(viagemId, total) {
    const dadosPlanejados = {
      passagens: passagens,
      hospedagem: hospedagem,
      alimentacao: alimentacao,
      passeios: passeios,
      transporte: transporte,
      souvenirs: souvenirs,
      planejamentoTotal: total,
    };

    try {
      const usuarioLogado = auth.currentUser.email;
      const viagemRef = doc(db, 'orcamento-viajante', usuarioLogado, 'viagens', viagemId, 'gastos-planejados', 'gastos-planejados');

      await setDoc(viagemRef, dadosPlanejados, { merge: true });
      console.log("Documento atualizado ou criado com sucesso!");
      window.location.href = '/menu?idTravel='+idTravel
    } catch (e) {
      console.error("Erro ao processar documento:", e);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const soma = Number(passagens) + Number(hospedagem) + Number(alimentacao) + Number(passeios) + Number(transporte) + Number(souvenirs)
    setPlanejamentoTotal(soma)
    criarOuAtualizarDocumento(idTravel, soma)
  }

  useEffect(() => {
    const fetchDataGastosPlanejados = async (userId, viagemId) => {
      try {
        const viagemRef = doc(db, 'orcamento-viajante', userId, 'viagens', viagemId, 'gastos-planejados', 'gastos-planejados');
        const docSnap = await getDoc(viagemRef);

        if (docSnap.exists()) {
          const dadosDaViagem = docSnap.data();
          setPassagens(dadosDaViagem.passagens)
          setHospedagem(dadosDaViagem.hospedagem)
          setAlimentacao(dadosDaViagem.alimentacao)
          setPasseios(dadosDaViagem.passeios)
          setTransporte(dadosDaViagem.transporte)
          setSouvenirs(dadosDaViagem.souvenirs)
          setPlanejamentoTotal(dadosDaViagem.planejamentoTotal)

          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Erro ao buscar o documento:", e);
      }
    }

    const timer = setTimeout(() => {
      const usuarioLogado = auth.currentUser.email;
      fetchDataGastosPlanejados(usuarioLogado, idTravel)
    }, 2000);
  }, []);

  if (loading) { return <div>Carregando...</div>; }

  return (
    <section className='section limite-gastos'>
      <div className='inputs'>
        <label htmlFor="gastoTotal">Gasto Total</label>
        <Input
          tipoInput='number'
          idInput='gastoTotal'
          nameInput='gastoTotal'
          valor={planejamentoTotal}
          isDisabled={true}
          onChange={(e) => setPlanejamentoTotal(Number(e.target.value))}
        />

        <label htmlFor="passagens">Passagens</label>
        <Input
          tipoInput='number'
          idInput='passagens'
          nameInput='passagens'
          valor={passagens}
          onChange={(e) => setPassagens(Number(e.target.value))}
        />

        <label htmlFor="hospedagem">Hospedagem</label>
        <Input
          tipoInput='number'
          idInput='hospedagem'
          nameInput='hospedagem'
          valor={hospedagem}
          onChange={(e) => setHospedagem(Number(e.target.value))}
        />

        <label htmlFor="alimentacao">Alimentação</label>
        <Input
          tipoInput='number'
          idInput='alimentacao'
          nameInput='alimentacao'
          valor={alimentacao}
          onChange={(e) => setAlimentacao(Number(e.target.value))}
        />

        <label htmlFor="passeios">Passeios</label>
        <Input
          tipoInput='number'
          idInput='passeios'
          nameInput='passeios'
          valor={passeios}
          onChange={(e) => setPasseios(Number(e.target.value))}
        />

        <label htmlFor="transporte">Transporte</label>
        <Input
          tipoInput='number'
          idInput='transporte'
          nameInput='transporte'
          valor={transporte}
          onChange={(e) => setTransporte(Number(e.target.value))}
        />

        <label htmlFor="souvenirs">Souvenirs</label>
        <Input
          tipoInput='number'
          idInput='souvenirs'
          nameInput='souvenirs'
          valor={souvenirs}
          onChange={(e) => setSouvenirs(Number(e.target.value))}
        />
      </div>

      <Button texto='Salvar' onClick={handleSave}/>
      
    </section>
  )
}

export default PlanejamentoGastos
