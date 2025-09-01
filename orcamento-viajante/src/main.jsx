import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter, RouterProvider
} from "react-router-dom";

import './index.css'

import Home from "./pages/home"
import Login from "./pages/login"
import AdicionarViagem from "./pages/adicionar-viagem"
import CotacoesDinheiro from "./pages/cotacoes-dinheiro"
import EscolhaViagem from "./pages/escolha-viagem"
import Gastos from "./pages/gastos"
import Limites from "./pages/limites"
import Menu from "./pages/menu"
import PlanejamentoGastos from "./pages/planejamento-gastos"
import Relatorios from "./pages/relatorios"
import Header from "./components/Header"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/adicionar-viagem",
    element: <AdicionarViagem />,
  },
  {
    path: "/cotacoes-dinheiro",
    element: <CotacoesDinheiro />,
  },
  {
    path: "/escolha-viagem",
    element: <EscolhaViagem />,
  },
  {
    path: "/gastos",
    element: <Gastos />,
  },
  {
    path: "/limites",
    element: <Limites />,
  },
  {
    path: "/menu",
    element: <Menu />,
  },
  {
    path: "/planejamento-gastos",
    element: <PlanejamentoGastos />,
  },
  {
    path: "/relatorios",
    element: <Relatorios />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <RouterProvider router={router} />
  </StrictMode>,
)
