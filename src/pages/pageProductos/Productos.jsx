import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Productos.css";

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        stock: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const apiURL = "http://localhost:3000/productos";

    const fetchProductos = async () => {
        try {
            const response = await axios.get(apiURL);
            setProductos(response.data);
            setFilteredProductos(response.data); // Set filtered list on fetch
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            setError("No se pudieron cargar los productos.");
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddOrUpdate = async () => {
        if (!formData.nombre || formData.precio <= 0 || formData.stock < 0) {
            setError("Todos los campos son obligatorios y deben tener valores válidos.");
            return;
        }
        try {
            const payload = {
                nombre: formData.nombre,
                precio: parseFloat(formData.precio),
                stock: parseInt(formData.stock),
            };

            if (editing) {
                await axios.put(`${apiURL}/${currentId}`, payload);
            } else {
                await axios.post(apiURL, payload);
            }

            fetchProductos();
            resetForm();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            setError("Hubo un problema al guardar el producto.");
        }
    };

    const handleEdit = (producto) => {
        setFormData({
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
        });
        setCurrentId(producto.id_producto);
        setEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
        try {
            await axios.delete(`${apiURL}/${id}`);
            fetchProductos();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            setError("No se pudo eliminar el producto.");
        }
    };

    const resetForm = () => {
        setFormData({ nombre: "", precio: "", stock: "" });
        setCurrentId(null);
        setError("");
        setEditing(false);
        document.getElementById("closeModal").click();
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        filterProductos(e.target.value);
    };

    const filterProductos = (searchTerm) => {
        const filtered = productos.filter((producto) => 
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            producto.precio.toString().includes(searchTerm) ||
            producto.stock.toString().includes(searchTerm)
        );
        setFilteredProductos(filtered);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Gestión de Productos</h1>

            <Link to="/inicio" className="btn btn-secondary mb-3">
                Volver al Inicio
            </Link>

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <button
                className="btn btn-primary mb-3"
                data-bs-toggle="modal"
                data-bs-target="#productoModal"
            >
                {editing ? "Editar Producto" : "Agregar Producto"}
            </button>

            {error && <div className="alert alert-danger">{error}</div>}

            <div
                className="modal fade"
                id="productoModal"
                tabIndex="-1"
                aria-labelledby="productoModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productoModalLabel">
                                {editing ? "Editar Producto" : "Agregar Producto"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={resetForm}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Precio</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                id="closeModal"
                                onClick={resetForm}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className={editing ? "btn btn-warning" : "btn btn-primary"}
                                onClick={handleAddOrUpdate}
                            >
                                {editing ? "Actualizar" : "Agregar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProductos.map((producto) => (
                            <tr key={producto.id_producto}>
                                <td>{producto.id_producto}</td>
                                <td>{producto.nombre}</td>
                                <td>S/.{producto.precio.toFixed(2)}</td>
                                <td>{producto.stock}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(producto)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#productoModal"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(producto.id_producto)}
                                    >
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Productos;
