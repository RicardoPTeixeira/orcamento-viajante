import { useState, useEffect } from 'react'

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

  function getCodePaisSelecionado() {
    paisesOptions.forEach(element => {
      if(pais == element.countryName) {
        setPaisSelecionado(element.countryCode)
      }
    });
  }

  useEffect(() => {
    getOptionsPaises();
  }, []);

  useEffect(() => {
    getCodePaisSelecionado();
  }, [pais]);

  useEffect(() => {
    getOptionsCidade(paisSelecionado);
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
      </div>

      <div className='moedas'>
        moedasss
      </div>
    </section>
  )
}

export default AdicionarViagem
