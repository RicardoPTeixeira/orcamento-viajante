import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import Input from '../../components/Input'
import Button from '../../components/Button'

import './limites.css'

function Limites() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idTravel = searchParams.get('idTravel')
  const [loading, setLoading] = useState(true);

  const [passagens, setPassagens] = useState(0);
  const [hospedagem, setHospedagem] = useState(0);
  const [alimentacao, setAlimentacao] = useState(0);
  const [passeios, setPasseios] = useState(0);
  const [transporte, setTransporte] = useState(0);
  const [souvenirs, setSouvenirs] = useState(0);
  const [limiteTotal, setLimiteTotal] = useState(0);

  const [totalGasto, setTotalGasto] = useState(0);
  const [statusGasto, setStatusGasto] = useState('normal')

  async function criarOuAtualizarDocumento(viagemId, total) {
    const dadosLimites = {
      passagens: passagens,
      hospedagem: hospedagem,
      alimentacao: alimentacao,
      passeios: passeios,
      transporte: transporte,
      souvenirs: souvenirs,
      limiteTotal: total,
    };

    try {
      const usuarioLogado = auth.currentUser.email;
      const viagemRef = doc(db, 'orcamento-viajante', usuarioLogado, 'viagens', viagemId, 'limites', 'limites');

      await setDoc(viagemRef, dadosLimites, { merge: true });
      console.log("Documento atualizado ou criado com sucesso!");
    } catch (e) {
      console.error("Erro ao processar documento:", e);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const soma = Number(passagens) + Number(hospedagem) + Number(alimentacao) + Number(passeios) + Number(transporte) + Number(souvenirs)
    setLimiteTotal(soma)
    criarOuAtualizarDocumento(idTravel, soma)

    if(totalGasto <= (soma/2)) {
      setStatusGasto('normal')
    } else if(totalGasto > (soma/2) && totalGasto < soma) {
      setStatusGasto('warning')
    } else {
      setStatusGasto('limit')
    }
  }

  useEffect(() => {
    const fetchDataLimites = async (userId, viagemId) => {
      try {
        const viagemRef = doc(db, 'orcamento-viajante', userId, 'viagens', viagemId, 'limites', 'limites');
        const docSnap = await getDoc(viagemRef);

        if (docSnap.exists()) {
          const dadosDaViagem = docSnap.data();
          setPassagens(dadosDaViagem.passagens)
          setHospedagem(dadosDaViagem.hospedagem)
          setAlimentacao(dadosDaViagem.alimentacao)
          setPasseios(dadosDaViagem.passeios)
          setTransporte(dadosDaViagem.transporte)
          setSouvenirs(dadosDaViagem.souvenirs)
          setLimiteTotal(dadosDaViagem.limiteTotal)

          if(totalGasto <= (dadosDaViagem.limiteTotal/2)) {
            setStatusGasto('normal')
          } else if(totalGasto > (dadosDaViagem.limiteTotal/2) && totalGasto < dadosDaViagem.limiteTotal) {
            setStatusGasto('warning')
          } else {
            setStatusGasto('limit')
          }

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
      fetchDataLimites(usuarioLogado, idTravel)
    }, 2000);
  }, []);

  if (loading) { return <div>Carregando...</div>; }

  return (
    <section className='section limites'>
      <div className='numbers'>
        <div className={'gasto ' + statusGasto}>
          <p>Total gasto</p>
          <div className='value'>
            <p>R$</p>
            <p>{totalGasto}</p>
          </div>
        </div>

        <div className='limiteTotal'>
          <p>Limite total</p>
          <div className='value'>
            <p>R$</p>
            <p>{limiteTotal}</p>
          </div>
        </div>
      </div>

      <div className='inputs'>
        <div></div>
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

export default Limites
