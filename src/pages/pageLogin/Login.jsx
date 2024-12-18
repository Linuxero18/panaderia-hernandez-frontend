import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Enviando solicitud de inicio de sesión...');
    try {
      const response = await axios.post('http://localhost:3000/usuarios/login', {
        usuario: user,
        password,
      });

      if (response.status === 200) {
        const { token, id_usuario, usuario} = response.data;

        console.log('Login successful:', response.data);
        // Almacenar el token y los datos del usuario en localStorage para usarlos más tarde
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userID', id_usuario);
        localStorage.setItem('user', JSON.stringify(usuario));
        localStorage.setItem('authToken', token);

        // Redirigir a la página de inicio o dashboard
        navigate('/inicio');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Error en el servidor. Verifique sus credenciales.');
      } else {
        setError('Error de conexión. Intente más tarde.');
      }
      console.error(error);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="input-group-login">
              <input
                type="text"
                className="form-control"
                placeholder="Ingrese su usuario"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>
            <div className="input-group-login">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="form-control"
                placeholder="Introduzca su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-login">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
