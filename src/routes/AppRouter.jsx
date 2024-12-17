import { Routes, Route } from "react-router-dom";
import PrivateRouter from "./PrivateRouter";
import Login from "../pages/pageLogin/Login";
import Inicio from "../pages/pageInicio/Inicio";

function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/inicio" element={<PrivateRouter><Inicio/></PrivateRouter>} />
    </Routes>
  );
}

export default AppRouter;