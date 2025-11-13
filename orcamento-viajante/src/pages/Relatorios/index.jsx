import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';

import { db, auth } from '../../firebase';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import Loading from '../../components/Loading'
import BreadCrumbs from '../../components/BreadCrumbs'
import TableGastos from '../../components/TableGastos';

import './relatorios.css'

ChartJS.register(ArcElement, Tooltip, Legend);

function Relatorios() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idTravel = searchParams.get('idTravel')
  const [loading, setLoading] = useState(true);

  const [dataGastos, setDataGastos] = useState([]);
  const [dataGrafico, setDataGrafico] = useState([]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDataGastos()
    }, 2000);
  }, []);

  useEffect(() => {
    if(dataGastos.length != 0) {
      var totalPassagem = 0
      var totalHospedagem = 0
      var totalAlimentacao = 0
      var totalPasseios = 0
      var totalTransporte = 0
      var totalSouvenirs = 0

      for (let i = 0; i < dataGastos.length; i++) {
        const element = dataGastos[i];
        const valorBRL = parseFloat(element.valorBRL)
       
        if(element.categoria == "Passagens") {
          totalPassagem+=valorBRL
        }

        if(element.categoria == "Hospedagem") {
          totalHospedagem+=valorBRL
        }

        if(element.categoria == "Alimentação") {
          totalAlimentacao+=valorBRL
        }

        if(element.categoria == "Passeios") {
          totalPasseios+=valorBRL
        }

        if(element.categoria == "Transporte") {
          totalTransporte+=valorBRL
        }

        if(element.categoria == "Souvenirs") {
          totalSouvenirs+=valorBRL
        }
      }

      const dadosBrutos = [
        {categoria: "Passagens", valor: totalPassagem, color: '#01003dff'},
        {categoria: "Hospedagem", valor: totalHospedagem, color: '#fe0000ff'},
        {categoria: "Alimentação", valor: totalAlimentacao, color: '#00fe00ff'},
        {categoria: "Passeios", valor: totalPasseios, color: '#fe00f1ff'},
        {categoria: "Transporte", valor: totalTransporte, color: '#fefa00ff'},
        {categoria: "Souvenirs", valor: totalSouvenirs, color: '#00fee9ff'},
      ]

      const dadosFiltrados = dadosBrutos.filter(dado => dado.valor > 0)

      const labels = dadosFiltrados.map(dado => dado.categoria)
      const dataValues = dadosFiltrados.map(dado => dado.valor)
      const backgroundColors = dadosFiltrados.map(dado => dado.color);

      const formattedChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Gasto (R$)',
            data: dataValues,
            backgroundColor: backgroundColors,
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      };

      setDataGrafico(formattedChartData)
      setLoading(false)
    }

  }, [dataGastos]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    }
  };

  if (loading) { return <Loading />; }

  return (
    <>
      <BreadCrumbs pagAtual="Relatórios" />
      <section className='section relatorios'>
        <div className='grafico'>
          <h3>Gastos por categoria</h3>
          <Pie data={dataGrafico} options={options} />
        </div>
        <div className='gastos'>
          <h3>Gastos</h3>
          <TableGastos gastos={dataGastos} />
        </div>
      </section>
    </>
  )
}

export default Relatorios
