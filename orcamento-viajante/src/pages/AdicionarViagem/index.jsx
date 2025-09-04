import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase"

import Input from '../../components/Input'
import DataList from '../../components/DataList'
import Button from '../../components/Button'

import './adicionar-viagem.css'

function AdicionarViagem() {
  const [duracao, setDuracao] = useState(0);
  const [pais, setPais] = useState('');
  const [cidade, setCidade] = useState('');
  const [moedas, setMoedas] = useState([]);

  const [paisesOptions, setPaisesOptions] = useState([]);
  const [cidadesOptions, setCidadesOptions] = useState([]);
  const [moedasOptions, setMoedasOptions] = useState([]);
  const [paisSelecionado, setPaisSelecionado] = useState('');

  const [selectMoedasAberto, setSelectMoedasAberto] = useState(false);

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

  function getOptionsCidade(codigoPais) {
    const url = `http://api.geonames.org/searchJSON?country=${codigoPais}&featureClass=P&maxRows=1000&username=ricardopetepo`;

    fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Erro na requisição: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          const cities = data.geonames;

          if (cities && cities.length > 0) {
              setCidadesOptions(cities)
          } else {
              console.log("Nenhuma cidade encontrada.");
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

  function getMoedaPaisSelecionado() {
    paisesOptions.forEach(element => {
      if(pais == element.countryName) {
        const moeda = []
        moeda.push(element.currencyCode)
        setMoedas(moeda)
      }
    });
  }

  function getCodePaisSelecionado() {
    paisesOptions.forEach(element => {
      if(pais == element.countryName) {
        setPaisSelecionado(element.countryCode)
      }
    });
  }

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setMoedas([...moedas, value]);
    } else {
      setMoedas(moedas.filter((item) => item !== value));
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const auth = getAuth();
  const usuarioLogado = auth.currentUser;

  async function salvarViagemNoBanco() {
    const usuario = usuarioLogado.email
    const idViagem = "viagem-"+searchParams.get('idNewTravel');
    const dados = {
      duracao: duracao,
      cidade: cidade,
      pais: pais,
      moedas: moedas
    }

    try {
      const viagemRef = doc(db, 'orcamento-viajante', usuario, 'viagens', idViagem);

      // 2. Define o documento com os dados fornecidos
      await setDoc(viagemRef, dados);
      window.location.href ='/menu?idTravel='+idViagem

    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  }

  useEffect(() => {
    getOptionsPaises();
  }, []);

  useEffect(() => {
    getMoedas();
  }, [paisesOptions]);

  useEffect(() => {
    getCodePaisSelecionado();
  }, [pais]);

  useEffect(() => {
    getOptionsCidade(paisSelecionado);
    getMoedaPaisSelecionado()
  }, [paisSelecionado]);

  return (
    <section className='section adicionarViagem'>
      <div className='inputs'>
        <label htmlFor="duracao">Duração em dias da viagem</label>
        <Input
          tipoInput='number'
          idInput='duracao'
          nameInput='Duracao'
          valor={duracao}
          onChange={(e) => setDuracao(e.target.value)}
        />

        <label htmlFor="pais">Selecione um país</label>
        <DataList
          listName="listaPaises"
          tipo="paises"
          idInput="pais"
          nameInput="Pais"
          dadosLista={paisesOptions}
          valor={pais}
          onChange={(e) => setPais(e.target.value)}
        />
  
        <label htmlFor="cidade">Selecione uma cidade</label>
        <DataList
          listName="listaCidades"
          tipo="cidades"
          idInput="cidade"
          nameInput="Cidade"
          dadosLista={cidadesOptions}
          valor={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />

        <p>Selecione uma nova moeda</p>
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

      <div className='moedas'>
        {moedas.map((e) => {
          return <p>{e}</p>
        })}
      </div>

      <Button texto="Adicionar" onClick={salvarViagemNoBanco}/>
    </section>
  )
}

export default AdicionarViagem
