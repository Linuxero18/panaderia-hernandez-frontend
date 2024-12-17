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

  return (
    <div className="inicio-container">
      <div className="inicio-header">
        <h1>Bienvenido, {(userData && userData.toUpperCase()) || 'Usuario'}</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      <div className="inicio-content">
        
      </div>
    </div>
  );
};

export default Inicio;
