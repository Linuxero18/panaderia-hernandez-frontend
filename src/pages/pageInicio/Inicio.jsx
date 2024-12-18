import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Inicio.css';

const Inicio = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login'); // Redirigir al login si no está autenticado
      return;
    }

    // Obtener los datos del usuario del localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    setUserData(user);
  }, [navigate]);

  const handleLogout = () => {
    // Limpiar localStorage y redirigir al login
    localStorage.clear();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="body-inicio">
      <div className="sidebar-inicio">
        <h3 className="text-center mb-4">Menú</h3>
        <ul className="nav flex-column">
          <li className="nav-item-inicio mb-3">
            <button className="btn btn-link text-white w-100 text-start" onClick={() => handleNavigation('/clientes')}>
              Clientes
            </button>
          </li>
          <li className="nav-item-inicio mb-3">
            <button className="btn btn-link text-white w-100 text-start" onClick={() => handleNavigation('/pedidos')}>
              Pedidos
            </button>
          </li>
          <li className="nav-item-inicio mb-3">
            <button className="btn btn-link text-white w-100 text-start" onClick={() => handleNavigation('/productos')}>
              Productos
            </button>
          </li>
        </ul>
        <button className="btn btn-danger-inicio mt-4 w-100" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      <div className="content-inicio flex-grow-1 p-4">
        <div className="inicio-header mb-4">
          <h1 className="mb-0">Bienvenido, {(userData && userData.toUpperCase()) || 'Usuario'}</h1>
          <p className="text-secondary">Es hora de chambear!</p>
        </div>
        <div className="inicio-content-inicio bg-light p-5 rounded shadow">
          <h2>Panel de Control</h2>
          <p>Aquí puedes gestionar usuarios, clientes, productos, insumos y más.</p>
        </div>
        <div>
          <img className='imagen-inicio' src='/src/assets/img.inicio.jpeg' alt="Imagen de inicio"/>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
