import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';

import Input from '../../components/Input'
import Button from '../../components/Button'
import GastoCard from '../../components/GastoCard'
import DataList from '../../components/DataList'
import Loading from '../../components/Loading'
import BreadCrumbs from '../../components/BreadCrumbs';

import './gastos.css'

function Gastos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idTravel = searchParams.get('idTravel')
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false)

  const [tituloGasto, setTituloGasto] = useState('')
  const [dataGasto, setDataGasto] = useState('')
  const [metodoGasto, setMetodoGasto] = useState('')
  const [categoriaGasto, setCategoriaGasto] = useState('')
  const [descricaoGasto, setDescricaoGasto] = useState('')
  const [moedaGasto, setMoedaGasto] = useState('')
  const [valorGasto, setValorGasto] = useState('')
  const [valorGastoBRL, setValorGastoBRL] = useState('')
  const [liberarValor, setLiberarValor] = useState(true)

  const [moedas, setMoedas] = useState([]);
  const [allCotacoes, setAllCotacoes] = useState([]);
  const [cotacoesUser, setCotacoesUser] = useState([]);

  // Pegar gastos
  const [dataGastos, setDataGastos] = useState([]);

  function getCotaoes() {
    const apiKey = "cur_live_OWwhPwURgNjvydtwmlQqCtW5R2RhAxGPR8ld7gHQ"; // Pegue sua chave no site do currencyapi
    const baseCurrency = "BRL";

    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${baseCurrency}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na requisição: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // Acessa os dados de cotação
        const rates = data.data;
        setAllCotacoes(rates)
      })
      .catch(error => {
        console.error("Ocorreu um erro:", error);
      });
  }

  function getCotacoesUser() {
    moedas.map((e) => {
      const novaCotacao = {
        moeda: e,
        valorEmReal: 1 / allCotacoes[e].value
      };
      setCotacoesUser(prevCotacoes => {
          const itemExistente = prevCotacoes.find(
              (item) => item.moeda === novaCotacao.moeda
          );
          if (!itemExistente) {
              return [...prevCotacoes, novaCotacao];
          }
          return prevCotacoes;
      });
    })
  }

  function resetCampos() {
    setTituloGasto('')
    setDataGasto('')
    setMetodoGasto('')
    setCategoriaGasto('')
    setDescricaoGasto('')
    setValorGasto('')
    setMoedaGasto('')
  }

  async function criarOuAtualizarDocumento(viagemId) {
    const dadosGasto = {
      titulo: tituloGasto,
      data: dataGasto,
      metodo: metodoGasto,
      categoria: categoriaGasto,
      descricao: descricaoGasto,
      valor: valorGasto,
      valorBRL: valorGastoBRL,
      moeda: moedaGasto,
    };

    const idGasto = dataGastos.length < 9 ? "gasto-0"+(dataGastos.length+1) : "gasto-"+(dataGastos.length+1)

    try {
      const usuarioLogado = auth.currentUser.email;
      const viagemRef = doc(db, 'orcamento-viajante', usuarioLogado, 'viagens', viagemId, 'gastos', idGasto);

      await setDoc(viagemRef, dadosGasto);
      handleClickModal()
      resetCampos()
      fetchDataGastos()
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
      setLoading(false)
    } catch (e) {
      console.error("Erro ao buscar gastos:", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataGastos()
    }, 2000);
  }, []);

  function handleAdicionar(e) {
    e.preventDefault();
    criarOuAtualizarDocumento(idTravel)
  }

  function handleClickModal() {
    if(!modal) {
      setModal(true)
    } else {
      setModal(false)
    }
  }

  useEffect(() => {
    const fetchDataMoedas = async (usuarioLogado) => {
      try {
        const viagemRef = doc(db, 'orcamento-viajante', usuarioLogado, 'viagens', idTravel);
        const docSnap = await getDoc(viagemRef);

        if (docSnap.exists()) {
          setMoedas(docSnap.data().moedas);
        } else {
          console.log("Nenhum documento encontrado!");
          return null;
        }
      } catch (e) {
        console.error("Erro ao buscar documento:", e);
      }
      
    };

    const timer = setTimeout(() => {
      const usuarioLogado = auth.currentUser.email;
      fetchDataMoedas(usuarioLogado);
    }, 2000);
  }, []);

  useEffect(() => {
    getCotaoes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getCotacoesUser();
    }, 2000);
  }, [moedas]);

  useEffect(() => {
    if(moedaGasto != '') {
      setLiberarValor(false)
    } else {
      setLiberarValor(true)
    }
  }, [moedaGasto]);

  useEffect(() => {
    if(valorGasto != '') {
      var objetoMoeda = cotacoesUser.find(item => item.moeda === moedaGasto);
      var valorEmBRL = (valorGasto*objetoMoeda.valorEmReal).toFixed(2)
      setValorGastoBRL(valorEmBRL)
    }
  }, [valorGasto]);

  if (loading) { return <Loading />; }

  return (
    <>
      <BreadCrumbs pagAtual="Gastos" />
      <section className='section gastos'>
        <div className='cardsSections'>
          {dataGastos.map((e) => {
            return <GastoCard titulo={e.titulo} categoria={e.categoria} data={e.data} tipo={e.metodo} valorMoeda1={e.valor} moeda1={e.moeda} valorMoeda2={e.valorBRL} moeda2="BRL" />
          })}
        </div>
        <Button texto="Adicionar" onClick={handleClickModal} />
        <div className='formDesk'>
          <div className='form'>
            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="tituloGasto">Titulo</label>
                <Input
                  tipoInput='text'
                  idInput='tituloGasto'
                  nameInput='Titulo Gasto'
                  valor={tituloGasto}
                  onChange={(e) => setTituloGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="dataGasto">Data</label>
                <Input
                  tipoInput='date'
                  idInput='dataGasto'
                  nameInput='Data Gasto'
                  valor={dataGasto}
                  onChange={(e) => setDataGasto(e.target.value)}
                />
              </div>

              <div className='formInputDiv'>
                <label htmlFor="metodoGasto">Metodo</label>
                <DataList
                  listName="listaMetodos"
                  tipo=""
                  idInput="metodoGasto"
                  nameInput="Metodo Gasto"
                  dadosLista={["Dinheiro", "Cartao"]}
                  valor={metodoGasto}
                  onChange={(e) => setMetodoGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="categoriaGasto">Categoria</label>
                <DataList
                  listName="listaCategorias"
                  tipo=""
                  idInput="categoriaGasto"
                  nameInput="Categoria Gasto"
                  dadosLista={["Alimentação", "Hospedagem", "Passagens", "Passeios", "Souvenirs", "Transporte"]}
                  valor={categoriaGasto}
                  onChange={(e) => setCategoriaGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="descricaoGasto">Descrição</label>
                <Input
                  tipoInput='text'
                  idInput='descricaoGasto'
                  nameInput='Descrição Gasto'
                  valor={descricaoGasto}
                  onChange={(e) => setDescricaoGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="moedaGasto">Moeda</label>
                <DataList
                  listName="listaMoedas"
                  tipo="moedasGasto"
                  idInput='moedaGasto'
                  nameInput='Moeda Gasto'
                  dadosLista={cotacoesUser}
                  valor={moedaGasto}
                  onChange={(e) => setMoedaGasto(e.target.value)}
                />
              </div>

              <div className='formInputDiv'>
                <label htmlFor="valorGasto">Valor</label>
                <Input
                  tipoInput='number'
                  idInput='valorGasto'
                  nameInput='Valor Gasto'
                  valor={valorGasto}
                  onChange={(e) => setValorGasto(e.target.value)}
                  isDisabled={liberarValor}
                />
              </div>
            </div>

            <Button texto="Adicionar" onClick={handleAdicionar} />
          </div>
        </div>
      </section>

      <div className={modal ? 'modalBackdrop modalBackdropActive' : 'modalBackdrop'}>
        <div className='modalGastos'>
          <div className='firstLine'>
            <p>Adicionar gasto</p>
            <span onClick={handleClickModal} >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="#015C91"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M16.243 7.75736C16.6335 8.14788 16.6335 8.78104 16.243 9.17157L13.4146 12L16.243 14.8284C16.6335 15.2189 16.6335 15.8521 16.243 16.2426C15.8525 16.6332 15.2193 16.6332 14.8288 16.2426L12.0004 13.4142L9.17195 16.2426C8.78143 16.6332 8.14826 16.6332 7.75774 16.2426C7.36721 15.8521 7.36721 15.2189 7.75774 14.8284L10.5862 12L7.75774 9.17157C7.36721 8.78105 7.36721 8.14788 7.75774 7.75736C8.14826 7.36683 8.78143 7.36683 9.17195 7.75736L12.0004 10.5858L14.8288 7.75736C15.2193 7.36683 15.8525 7.36683 16.243 7.75736Z" fill="white"/>
              </svg>
            </span>
          </div>

          <div className='form'>
            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="tituloGastoo">Titulo</label>
                <Input
                  tipoInput='text'
                  idInput='tituloGastoo'
                  nameInput='Titulo Gasto'
                  valor={tituloGasto}
                  onChange={(e) => setTituloGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="dataGastoo">Data</label>
                <Input
                  tipoInput='date'
                  idInput='dataGastoo'
                  nameInput='Data Gasto'
                  valor={dataGasto}
                  onChange={(e) => setDataGasto(e.target.value)}
                />
              </div>

              <div className='formInputDiv'>
                <label htmlFor="metodoGastoo">Metodo</label>
                <DataList
                  listName="listaMetodos"
                  tipo=""
                  idInput="metodoGastoo"
                  nameInput="Metodo Gasto"
                  dadosLista={["Dinheiro", "Cartao"]}
                  valor={metodoGasto}
                  onChange={(e) => setMetodoGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="categoriaGastoo">Categoria</label>
                <DataList
                  listName="listaCategorias"
                  tipo=""
                  idInput="categoriaGastoo"
                  nameInput="Categoria Gasto"
                  dadosLista={["Alimentação", "Hospedagem", "Passagens", "Passeios", "Souvenirs", "Transporte"]}
                  valor={categoriaGasto}
                  onChange={(e) => setCategoriaGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="descricaoGastoo">Descrição</label>
                <Input
                  tipoInput='text'
                  idInput='descricaoGastoo'
                  nameInput='Descrição Gasto'
                  valor={descricaoGasto}
                  onChange={(e) => setDescricaoGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="moedaGastoo">Moeda</label>
                <DataList
                  listName="listaMoedas"
                  tipo="moedasGasto"
                  idInput='moedaGastoo'
                  nameInput='Moeda Gasto'
                  dadosLista={cotacoesUser}
                  valor={moedaGasto}
                  onChange={(e) => setMoedaGasto(e.target.value)}
                />
              </div>

              <div className='formInputDiv'>
                <label htmlFor="valorGastoo">Valor</label>
                <Input
                  tipoInput='number'
                  idInput='valorGastoo'
                  nameInput='Valor Gasto'
                  valor={valorGasto}
                  onChange={(e) => setValorGasto(e.target.value)}
                  isDisabled={liberarValor}
                />
              </div>
            </div>

            <Button texto="Adicionar" onClick={handleAdicionar} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Gastos
