import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { db } from '../../firebase'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../firebase';

import Button from "../../components/Button"
import Input from "../../components/Input"
import DataList from "../../components/DataList"
import CoinBox from "../../components/CoinBox"
import CoinBoxAmount from "../../components/CoinBoxAmount"

import "./cotacoesDinheiro.css"

function CotacoesDinheiro() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idTravel = searchParams.get('idTravel')
  const [modalCotacao, setModalCotacao] = useState(false)
  const [modalDinheiro, setModalDinheiro] = useState(false)
  const [mudancas, setMudancas] = useState(0);

  // Nova compra moeda
  const [dataCompra, setDataCompra] = useState('');
  const [moeda1Compra, setMoeda1Compra] = useState('BRL');
  const [valor1Compra, setValor1Compra] = useState(0);
  const [moeda2Compra, setMoeda2Compra] = useState('');
  const [valor2Compra, setValor2Compra] = useState(0);
  // --

  const [selectMoedasAberto, setSelectMoedasAberto] = useState(false);
  const [moedas, setMoedas] = useState([]);
  const [allCotacoes, setAllCotacoes] = useState([]);
  const [cotacoesUser, setCotacoesUser] = useState([]);

  const [paisesOptions, setPaisesOptions] = useState([]);
  const [moedasOptions, setMoedasOptions] = useState([]);

  const [loading, setLoading] = useState(true);

  function getOptionsPaises() {
    const url = "http://api.geonames.org/countryInfoJSON?username=ricardopetepo ";

    fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro na requisição: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          const countries = data.geonames;
          
          if (countries) {
              setPaisesOptions(countries)
          } else {
              console.log("Nenhum país encontrado.");
          }
      })
      .catch(error => {
          console.error("Ocorreu um erro:", error);
      });
  }

  function getMoedas() {
    const allCurrencies = paisesOptions.map(country => country.currencyCode);
    const uniqueCurrencies = [...new Set(allCurrencies)];
    uniqueCurrencies.sort()
    setMoedasOptions(uniqueCurrencies)
  }

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

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setMoedas([...moedas, value]);
    } else {
      setMoedas(moedas.filter((item) => item !== value));
    }
    setMudancas(mudancas + 1);
  };

  function handleClickCotacoes() {
    if(!modalCotacao) {
      setModalCotacao(true)
    } else {
      setModalCotacao(false)
    }
  }

  function handleClickDinheiro() {
    if(!modalDinheiro) {
      setModalDinheiro(true)
    } else {
      setModalDinheiro(false)
    }
  }

  async function createCompraDinheiro() {
    const newDinheiro = {
      data: dataCompra,
      valorBRL: valor1Compra,
      moedaComprada: moeda2Compra,
      valorMoedaComprada: valor2Compra
    }

    // TODO: fazer ser dinamico
    const idCompra = "compra-1"

    const usuarioLogado = auth.currentUser.email;
    console.log(usuarioLogado)
    try {
      const compraRef = doc( db, 'orcamento-viajante', usuarioLogado, 'viagens', idTravel, 'dinheiro-fisico', idCompra);
      await setDoc(compraRef, newDinheiro);
      setModalDinheiro(false)
      
    } catch (e) {
      console.error("Erro ao adicionar documento:", e);
    }
  }

  async function atualizarMoedasBanco(usuarioLogado, novasMoedas) {
    try {
      const viagemRef = doc(db, 'orcamento-viajante', usuarioLogado, 'viagens', idTravel);

      await updateDoc(viagemRef, {
        moedas: novasMoedas
      });
      
    } catch (e) {
      console.error("Erro ao atualizar documento:", e);
    }
  }

  useEffect(() => {
    const fetchDataMoedas = async (usuarioLogado) => {
      try {
        const viagemRef = doc(db, 'orcamento-viajante', usuarioLogado, 'viagens', idTravel);
        const docSnap = await getDoc(viagemRef);

        if (docSnap.exists()) {
          setMoedas(docSnap.data().moedas);
          setLoading(false)
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
    getOptionsPaises();
    getCotaoes();
  }, []);

  useEffect(() => {
    getMoedas();
  }, [paisesOptions]);

  useEffect(() => {
    if(mudancas >= 1){
      const timer = setTimeout(() => {
        const usuarioLogado = auth.currentUser.email;
        atualizarMoedasBanco(usuarioLogado, moedas);
      }, 2000);
    }
    
  }, [mudancas]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getCotacoesUser();
    }, 2000);
  }, [moedas]);

  if (loading) { return <div>Carregando...</div>; }
  return (
    <>
      <section className='section cotacoesDinheiro'>
        <div className='square'>
          <div className='infos'>
            <p>Cotações:</p>

            <div className='moedas'>
              {cotacoesUser.map((e) => {
                return <CoinBox nome={e.moeda} value={e.valorEmReal} />
              })}
            </div>
          </div>

          <Button texto="Adicionar nova moeda" onClick={handleClickCotacoes} />
        </div>

        <div className='square'>
          <div className='infos'>
            <p>Dinheiro fisico:</p>

            <div className='moedas'>
              {moedas.map((e) => {
                return <CoinBoxAmount nome={e}  />
              })}
            </div>
          </div>

          <Button texto="Adicionar nova compra de dinheiro" onClick={handleClickDinheiro} />
        </div>

        
      </section>

      <div className={(modalCotacao || modalDinheiro) ? 'modalBackdrop modalBackdropActive' : 'modalBackdrop'}>
        <div className={modalCotacao ? 'modalCotacao modalCotacaoActive' : 'modalCotacao'}>
          <div className='firstLine'>
            <p>Adicionar cotação</p>
            <span onClick={handleClickCotacoes} >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="#015C91"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.243 7.75736C16.6335 8.14788 16.6335 8.78104 16.243 9.17157L13.4146 12L16.243 14.8284C16.6335 15.2189 16.6335 15.8521 16.243 16.2426C15.8525 16.6332 15.2193 16.6332 14.8288 16.2426L12.0004 13.4142L9.17195 16.2426C8.78143 16.6332 8.14826 16.6332 7.75774 16.2426C7.36721 15.8521 7.36721 15.2189 7.75774 14.8284L10.5862 12L7.75774 9.17157C7.36721 8.78105 7.36721 8.14788 7.75774 7.75736C8.14826 7.36683 8.78143 7.36683 9.17195 7.75736L12.0004 10.5858L14.8288 7.75736C15.2193 7.36683 15.8525 7.36683 16.243 7.75736Z" fill="white"/>
              </svg>
            </span>
          </div>

          <div className="listaMoedasSection"
            onClick={() => {
              if(!selectMoedasAberto) {
                setSelectMoedasAberto(true)
              } else {
                setSelectMoedasAberto(false)
              }
            }}
          >
            <div className={selectMoedasAberto ? "listaMoedas listaMoedasActive" : "listaMoedas" }>
              {moedasOptions.map((e) => (
                <label key={e}>
                  <input
                    type="checkbox"
                    name="pais"
                    className='invisible'
                    value={e}
                    checked={moedas.includes(e)}
                    onChange={handleCheckboxChange}
                  />
                  <span>{e}</span>
                  {/* fazer logica do pin de check */}
                  <span>
                    {moedas.includes(e) ?
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0096 0.75789C13.4001 1.14841 13.4001 1.78158 13.0096 2.1721L5.93962 9.2421C5.75208 9.42964 5.49773 9.535 5.23251 9.535C4.96729 9.535 4.71294 9.42964 4.5254 9.2421L0.990403 5.7071C0.599879 5.31658 0.599879 4.68341 0.990403 4.29289C1.38093 3.90237 2.01409 3.90237 2.40462 4.29289L5.23251 7.12078L11.5954 0.75789C11.9859 0.367365 12.6191 0.367365 13.0096 0.75789Z" fill="white"/>
                      </svg>

                    :
                      ''
                    }
                  </span>
                </label>
              ))}
            </div>
          </div>
          
        </div>

        <div className={modalDinheiro ? 'modalDinheiro modalDinheiroActive' : 'modalDinheiro'}>
          <div className='firstLine'>
            <p>Adicionar compra de dinheiro</p>
            <span onClick={handleClickDinheiro} >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="#015C91"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.243 7.75736C16.6335 8.14788 16.6335 8.78104 16.243 9.17157L13.4146 12L16.243 14.8284C16.6335 15.2189 16.6335 15.8521 16.243 16.2426C15.8525 16.6332 15.2193 16.6332 14.8288 16.2426L12.0004 13.4142L9.17195 16.2426C8.78143 16.6332 8.14826 16.6332 7.75774 16.2426C7.36721 15.8521 7.36721 15.2189 7.75774 14.8284L10.5862 12L7.75774 9.17157C7.36721 8.78105 7.36721 8.14788 7.75774 7.75736C8.14826 7.36683 8.78143 7.36683 9.17195 7.75736L12.0004 10.5858L14.8288 7.75736C15.2193 7.36683 15.8525 7.36683 16.243 7.75736Z" fill="white"/>
              </svg>
            </span>
          </div>

          <div className='form'>
              <div className='formRow'>
                <div className='formInputDiv'>
                  <label htmlFor="dataCompra">Data da compra</label>
                  <Input
                    tipoInput='date'
                    idInput='dataCompra'
                    nameInput='Data'
                    valor={dataCompra}
                    onChange={(e) => setDataCompra(e.target.value)}
                  />
                </div>
              </div>

              <div className='formRow'>
                <div className='formInputDiv'>
                  <label htmlFor="moeda1Compra">Moeda</label>
                  <Input
                    tipoInput='text'
                    idInput='moeda1Compra'
                    nameInput='Moeda 1'
                    valor={moeda1Compra}
                    onChange={(e) => setMoeda1Compra(e.target.value)}
                    isDisabled={true}
                  />
                </div>
                <div className='formInputDiv'>
                  <label htmlFor="moeda2Compra">Moeda</label>
                  <DataList
                    listName="listaMoedas"
                    tipo="moedas"
                    idInput="moeda2Compra"
                    nameInput="Moedas"
                    dadosLista={moedas}
                    valor={moeda2Compra}
                    onChange={(e) => setMoeda2Compra(e.target.value)}
                  />
                </div>
              </div>

              <div className='formRow'>
                <div className='formInputDiv'>
                  <label htmlFor="valor1Compra">Valor</label>
                  <Input
                    tipoInput='number'
                    idInput='valor1Compra'
                    nameInput='Valor 1'
                    valor={valor1Compra}
                    onChange={(e) => setValor1Compra(e.target.value)}
                  />
                </div>
                <div className='formInputDiv'>
                  <label htmlFor="valor2Compra">Valor</label>
                  <Input
                    tipoInput='number'
                    idInput='valor2Compra'
                    nameInput='Valor 2'
                    valor={valor2Compra}
                    onChange={(e) => setValor2Compra(e.target.value)}
                  />
                </div>
              </div>
          </div>

          <Button texto="Adicionar" onClick={createCompraDinheiro} />
        </div>
      </div>
      
    </>
  )
}

export default CotacoesDinheiro
