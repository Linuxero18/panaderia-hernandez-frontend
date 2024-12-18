import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Pedidos.css';

const Pedido = () => {
  // Initial form state
  const initialFormState = {
    id_cliente: null,
    nombre_cliente: '',
    descripcion: '',
    precio: '',
    cantidad: '',
    total: '',
    telefono: '',
    fecha_entrega: '',
    estado: 1  // Numeric state
  };

  // State variables
  const [formData, setFormData] = useState(initialFormState);
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch pedidos and clientes on component mount
  useEffect(() => {
    fetchPedidos();
    fetchClientes();
  }, []);

  // Fetch pedidos from backend
  const fetchPedidos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/pedidos');
      setPedidos(response.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los pedidos. Intente nuevamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clientes from backend
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clientes');
      setClientes(response.data);
    } catch (err) {
      setError('No se pudieron cargar los clientes.');
      console.error(err);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validation rules
    const validationRules = {
      precio: /^\d*\.?\d{0,2}$/, 
      cantidad: /^\d*$/, 
      telefono: /^\d{0,9}$/, 
      nombre_cliente: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{0,50}$/, 
      descripcion: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{0,70}$/ 
    };

    // Skip validation for estado and fecha_entrega
    if (validationRules[name] && !validationRules[name].test(value)) {
      return;
    }

    // Special handling for client selection
    if (name === 'nombre_cliente') {
      const selectedCliente = clientes.find(cliente => cliente.nombre === value);
      setFormData(prev => ({
        ...prev,
        nombre_cliente: value,
        id_cliente: selectedCliente ? selectedCliente.id_cliente : null,
        telefono: selectedCliente ? selectedCliente.telefono : prev.telefono
      }));
    } else {
      // Calculate total for precio and cantidad
      setFormData(prev => {
        const updatedForm = { ...prev, [name]: value };
        
        if (name === 'precio' || name === 'cantidad') {
          const cantidad = parseFloat(updatedForm.cantidad) || 0;
          const precio = parseFloat(updatedForm.precio) || 0;
          updatedForm.total = (cantidad * precio).toFixed(2);
        }

        // Directly handle estado
        if (name === 'estado') {
          updatedForm.estado = parseInt(value, 10);
        }

        return updatedForm;
      });
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const requiredFields = [
      'nombre_cliente', 'descripcion', 'precio', 
      'cantidad', 'telefono', 'fecha_entrega'
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        alert(`Por favor, complete el campo: ${field.replace('_', ' ')}`);
        return false;
      }
    }

    return true;
  };

  // Add or update pedido
  const handleAddOrUpdatePedido = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        id_cliente: formData.id_cliente || null,
        estado: formData.estado
      };

      if (editandoId) {
        // Update existing pedido
        await axios.put(`http://localhost:3000/pedidos/${editandoId}`, submissionData);
        alert('Pedido actualizado correctamente');
      } else {
        // Add new pedido
        await axios.post('http://localhost:3000/pedidos', submissionData);
        alert('Pedido agregado correctamente');
      }

      // Refresh pedidos and reset form
      fetchPedidos();
      setFormData(initialFormState);
      setEditandoId(null);
    } catch (err) {
      setError('Error al procesar el pedido. Verifique los datos.');
      console.error(err);
      alert('Error al procesar el pedido. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit existing pedido
  const handleEditPedido = (pedido) => {
    setFormData({
      ...pedido,
      nombre_cliente: pedido.nombre,
      estado: pedido.estado,
      fecha_entrega: pedido.fecha_entrega 
        ? new Date(pedido.fecha_entrega).toISOString().slice(0, 16) 
        : ''
    });
    setEditandoId(pedido.id_pedido);
  };

  // Delete pedido
  const handleDeletePedido = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este pedido?")) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/pedidos/${id}`);
      alert('Pedido eliminado correctamente');
      fetchPedidos();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear form
  const handleClearForm = () => {
    setFormData(initialFormState);
    setEditandoId(null);
  };

  // Format date for display
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Map estado to readable text
  const mapearEstado = (estado) => {
    const estadoMap = {
      1: 'NO INICIADO',
      2: 'EN PROCESO',
      3: 'COMPLETADO'
    };
    return estadoMap[estado] || estado;
  };

  const obtenerEstadoTexto = (estado) => {
    const estados = {
      true: 'activo',
      false: 'inactivo',
      1: 'NO INICIADO',
      2: 'EN PROCESO',
      3: 'COMPLETADO'
    };
    return estados[estado] || estado.toString();
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    return Object.entries(pedido).some(([key, value]) => {
      if (!value) return false;
      if (key === 'estado') {
        const estadoTexto = obtenerEstadoTexto(value);
        return estadoTexto.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  return (
    <div className="container-fluid p-4">
      <div className="row mb">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h1 className="display-6">Panadería Pastelería Hernandez</h1>
          <Link to='/inicio'>
            <button className="btn btn-danger">SALIR</button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="h4 mb">Formulario de Pedidos</h2>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                  {/* Cliente Select */}
                  <div className="col-md-12 mb-3">
                    <select
                      className="form-control"
                      name="nombre_cliente"
                      value={formData.nombre_cliente}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione un cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id_cliente} value={cliente.nombre}>
                          {cliente.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Descripción */}
                  <div className="col-md-12 mb">
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Descripción del pedido"
                      required
                    ></textarea>
                  </div>
                  {/* Precio */}
                  <div className="col-md-12 mb">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      placeholder="Precio unitario"
                      required
                    />
                  </div>
                  {/* Cantidad */}
                  <div className="col-md-12 mb">
                    <input
                      type="number"
                      className="form-control"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleInputChange}
                      placeholder="Cantidad"
                      required
                    />
                  </div>
                  {/* Total */}
                  <div className="col-md-12 mb">
                    <label htmlFor="total" className="form-label">Total</label>
                    <input
                      type="text"
                      className="form-control"
                      name="total"
                      value={formData.total}
                      readOnly
                    />
                  </div>
                  {/* Teléfono */}
                  <div className="col-md-12 mb">
                    <input
                      type="tel"
                      className="form-control"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      maxLength="9"
                      placeholder="Teléfono de contacto"
                      readOnly
                    />
                  </div>
                  {/* Fecha de Entrega */}
                  <div className="col-md-12 mb">
                    <label htmlFor="fecha-entrega" className="form-label">Fecha de Entrega</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      name="fecha_entrega"
                      value={formData.fecha_entrega}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  {/* Estado */}
                  <div className="col-md-12 mb">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select
                      className="form-control"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="1">NO INICIADO</option>
                      <option value="2">EN PROCESO</option>
                      <option value="3">COMPLETADO</option>
                    </select>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddOrUpdatePedido}
                    disabled={isLoading}
                  >
                    {editandoId ? 'Actualizar' : 'Agregar'} Pedido
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClearForm}
                  >
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">Pedidos</h2>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar pedidos"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="table-container-pedidos">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                    <th>Fecha de entrega</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPedidos.map((pedido) => (
                    <tr key={pedido.id_pedido}>
                      <td>{pedido.id_pedido}</td>
                      <td>{pedido.nombre}</td>
                      <td>{pedido.telefono}</td>
                      <td>{pedido.descripcion}</td>
                      <td>{pedido.precio}</td>
                      <td>{pedido.cantidad}</td>
                      <td>{pedido.total}</td>
                      <td>{formatearFecha(pedido.fecha_entrega)}</td>
                      <td>
                        <span
                          className={`badge ${
                            mapearEstado(pedido.estado) === 'NO INICIADO' ? 'bg-secondary' :
                            mapearEstado(pedido.estado) === 'EN PROCESO' ? 'bg-warning' : 'bg-success'
                          }`}
                        >
                          {mapearEstado(pedido.estado)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleEditPedido(pedido)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleDeletePedido(pedido.id_pedido)}
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
  );
};

export default Pedido;