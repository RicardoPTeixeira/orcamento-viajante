import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';

import Input from '../../components/Input'
import Button from '../../components/Button'
import GastoCard from '../../components/GastoCard'

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
  const [valorGasto, setValorGasto] = useState('')
  const [moedaGasto, setMoedaGasto] = useState('')

  // Pegar gastos
  const [dataGastos, setDataGastos] = useState([]);

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
      moeda: moedaGasto,
    };

    const idGasto = "gasto-"+(dataGastos.length+1)

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

  if (loading) { return <div>Carregando...</div>; }

  return (
    <>
      <section className='section gastos'>
        <div className='cardsSections'>
          {dataGastos.map((e) => {
            return <GastoCard titulo={e.titulo} categoria={e.categoria} data={e.data} tipo={e.metodo} valorMoeda1={e.valor} moeda1={e.moeda} valorMoeda2="60" moeda2="BRL" />
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
                <Input
                  tipoInput='text'
                  idInput='metodoGasto'
                  nameInput='Metodo Gasto'
                  valor={metodoGasto}
                  onChange={(e) => setMetodoGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="categoriaGasto">Categoria</label>
                <Input
                  tipoInput='text'
                  idInput='categoriaGasto'
                  nameInput='Categoria Gasto'
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
                <label htmlFor="valorGasto">Valor</label>
                <Input
                  tipoInput='text'
                  idInput='valorGasto'
                  nameInput='Valor Gasto'
                  valor={valorGasto}
                  onChange={(e) => setValorGasto(e.target.value)}
                />
              </div>

              <div className='formInputDiv'>
                <label htmlFor="moedaGasto">Moeda</label>
                <Input
                  tipoInput='text'
                  idInput='moedaGasto'
                  nameInput='Moeda Gasto'
                  valor={moedaGasto}
                  onChange={(e) => setMoedaGasto(e.target.value)}
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
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.243 7.75736C16.6335 8.14788 16.6335 8.78104 16.243 9.17157L13.4146 12L16.243 14.8284C16.6335 15.2189 16.6335 15.8521 16.243 16.2426C15.8525 16.6332 15.2193 16.6332 14.8288 16.2426L12.0004 13.4142L9.17195 16.2426C8.78143 16.6332 8.14826 16.6332 7.75774 16.2426C7.36721 15.8521 7.36721 15.2189 7.75774 14.8284L10.5862 12L7.75774 9.17157C7.36721 8.78105 7.36721 8.14788 7.75774 7.75736C8.14826 7.36683 8.78143 7.36683 9.17195 7.75736L12.0004 10.5858L14.8288 7.75736C15.2193 7.36683 15.8525 7.36683 16.243 7.75736Z" fill="white"/>
              </svg>
            </span>
          </div>

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
                <Input
                  tipoInput='text'
                  idInput='metodoGasto'
                  nameInput='Metodo Gasto'
                  valor={metodoGasto}
                  onChange={(e) => setMetodoGasto(e.target.value)}
                />
              </div>
            </div>

            <div className='formRow'>
              <div className='formInputDiv'>
                <label htmlFor="categoriaGasto">Categoria</label>
                <Input
                  tipoInput='text'
                  idInput='categoriaGasto'
                  nameInput='Categoria Gasto'
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
                <label htmlFor="valorGasto">Valor</label>
                <Input
                  tipoInput='text'
                  idInput='valorGasto'
                  nameInput='Valor Gasto'
                  valor={valorGasto}
                  onChange={(e) => setValorGasto(e.target.value)}
                />
              </div>

              <div className='formInputDiv'>
                <label htmlFor="moedaGasto">Moeda</label>
                <Input
                  tipoInput='text'
                  idInput='moedaGasto'
                  nameInput='Moeda Gasto'
                  valor={moedaGasto}
                  onChange={(e) => setMoedaGasto(e.target.value)}
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
