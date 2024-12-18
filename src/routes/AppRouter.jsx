import { Routes, Route } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import Login from "../pages/pageLogin/Login";
import Inicio from "../pages/pageInicio/Inicio";
import Pedidos from "../pages/pagePedidos/Pedidos";
import Clientes from "../pages/pageClientes/Clientes";
import Productos from "../pages/pageProductos/Productos";

function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/inicio" element={<PrivateRouter><Inicio/></PrivateRouter>} />
        <Route path="/pedidos" element={<PrivateRouter><Pedidos/></PrivateRouter>} />
        <Route path="/clientes" element={<PrivateRouter><Clientes/></PrivateRouter>} />
        <Route path="/productos" element={<PrivateRouter><Productos/></PrivateRouter>}/>
    </Routes>
  );
}

export default AppRouter;