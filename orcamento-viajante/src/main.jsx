import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter, RouterProvider
} from "react-router-dom";

import './index.css'

import Home from "./pages/Home"
import Login from "./pages/Login"
import AdicionarViagem from "./pages/AdicionarViagem"
import CotacoesDinheiro from "./pages/CotacoesDinheiro"
import EscolhaViagem from "./pages/EscolhaViagem"
import Gastos from "./pages/Gastos"
import Limites from "./pages/Limites"
import Menu from "./pages/Menu"
import PlanejamentoGastos from "./pages/PlanejamentoGastos"
import Relatorios from "./pages/Relatorios"
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
