import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [editando, setEditando] = useState(false);
  const [idCliente, setIdCliente] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al obtener los clientes', error);
    }
  };

  const manejarCrear = async (e) => {
    e.preventDefault();
    try {
      const nuevoCliente = { nombre, telefono, email };
      await axios.post('http://localhost:3000/clientes', nuevoCliente);
      setNombre('');
      setTelefono('');
      setEmail('');
      obtenerClientes();
    } catch (error) {
      console.error('Error al crear el cliente', error);
    }
  };

  const manejarEditar = async (e) => {
    e.preventDefault();
    try {
      const clienteEditado = { nombre, telefono, email };
      await axios.put(`http://localhost:3000/clientes/${idCliente}`, clienteEditado);
      setEditando(false);
      setIdCliente(null);
      setNombre('');
      setTelefono('');
      setEmail('');
      obtenerClientes();
    } catch (error) {
      console.error('Error al editar el cliente', error);
    }
  };

  const manejarEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/clientes/${id}`);
      obtenerClientes();
    } catch (error) {
      console.error('Error al eliminar el cliente', error);
    }
  };

  const manejarFormularioEdicion = (cliente) => {
    setEditando(true);
    setIdCliente(cliente.id_cliente);
    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);
    setEmail(cliente.email);
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.id_cliente.toString().includes(filtro) ||
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.telefono.toLowerCase().includes(filtro.toLowerCase()) ||
    cliente.email.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="clientes-body">
      <Link to='/inicio'>
        <button className='btn-inicio'>Volver a inicio</button>
      </Link>
      <div className="clientes-container">
        <div className="clientes-box">
          <h2 className="clientes-title">Gestión de Clientes</h2>
          <div className='buscador'>
            <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Buscar clientes"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
          </div>
          <div className="row">
            <div className="col-md-4">
              <form onSubmit={editando ? manejarEditar : manejarCrear}>
                <div className="input-group-clientes">
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                  />
                </div>
                <div className="input-group-clientes">
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Teléfono"
                    required
                  />
                </div>
                <div className="input-group-clientes">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <button type="submit" className="btn-clientes">
                  {editando ? 'Actualizar' : 'Crear'} Cliente
                </button>
              </form>
            </div>
            <div className="col-md-8">
              <div className="table-responsive">
                <table className="table table-clientes">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Email</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id_cliente}>
                        <td>{cliente.id_cliente}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.email}</td>
                        <td>
                          <button
                            className="btn-acciones btn-info"
                            onClick={() => manejarFormularioEdicion(cliente)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-acciones btn-danger"
                            onClick={() => manejarEliminar(cliente.id_cliente)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clientes;