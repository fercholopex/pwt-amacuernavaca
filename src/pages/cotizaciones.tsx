import { useEffect, useState, useRef } from 'react';
import { getAuth } from "firebase/auth";
import Head from 'next/head';
import { useAuth } from '../components/AuthContext';
import app from '../components/firebase';
import Link from 'next/link';
//import Modal from './_modalcotizaciones';
const auth = getAuth(app);
const Cotizaciones = () => {
    const { user } = useAuth();
    const [cotizaciones, setCotizaciones] = useState([]);
    const [cotizacionesFiltradas, setCotizacionesFiltradas] = useState([]);
    const [operadores, setOperadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); 
    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
    
    // Estados para búsqueda y filtros
    const [busqueda, setBusqueda] = useState('');
    const [filtroActivo, setFiltroActivo] = useState('todos');
    const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
    const [filtros, setFiltros] = useState({
        id_servicio: '',
        cliente: '',
        tipo_convenio: '',
        tipo_servicio: '',
        estado: '',
        operador: '',
        fecha_desde: '',
        fecha_hasta: ''
    });
    
    // Estados para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [elementosPorPagina, setElementosPorPagina] = useState(50);
    const [totalPaginas, setTotalPaginas] = useState(1);
    
    // Estado para alertas personalizadas
    const [alerta, setAlerta] = useState({
        visible: false,
        tipo: '', // success, error, warning, info
        titulo: '',
        mensaje: '',
        duracion: 5000
    });
    
    // Ref para el temporizador de alertas
    const alertaTimerRef = useRef(null);
    const fetchCotizaciones = async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/cotizaciones');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error en el servidor');
            }
            const data = await response.json();
            // Ordenar por fecha de modificación (más reciente primero)
            const ordenadas = data.sort((a, b) => {
                return new Date(b.fecha_modificacion || b.fecha_cotizacion) - 
                       new Date(a.fecha_modificacion || a.fecha_cotizacion);
            });
            setCotizaciones(ordenadas);
            setCotizacionesFiltradas(ordenadas);
            calcularTotalPaginas(ordenadas.length);
        } catch (error) {
            console.error('Error detallado:', error);
            setError(error.message);
            mostrarAlerta('error', 'Error', error.message);
        } finally {
            setLoading(false);
        }
    };
    const cargarOperadores = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/catalogos/operadores');
            if (!response.ok) {
                throw new Error('Error al cargar operadores');
            }
            const data = await response.json();
            setOperadores(data.map(op => ({
                ...op,
                telefono: op.telefono?.trim()
            })));
        } catch (error) {
            console.error('Error al cargar operadores:', error);
            setError('Error al cargar operadores');
            mostrarAlerta('error', 'Error', 'No se pudieron cargar los operadores');
        }
    };
    useEffect(() => {
        fetchCotizaciones();
        cargarOperadores();
        
        // Actualizar cada 90 segundos (1 minuto y 30 segundos)
        const interval = setInterval(() => {
            fetchCotizaciones();
        }, 90000);
        
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
            // Limpiar el temporizador de alerta si existe
            if (alertaTimerRef.current) {
                clearTimeout(alertaTimerRef.current);
            }
        };
    }, []);
    // Función para calcular el total de páginas
    const calcularTotalPaginas = (totalElementos) => {
        setTotalPaginas(Math.ceil(totalElementos / elementosPorPagina));
        // Si la página actual es mayor que el total de páginas, ajustarla
        if (paginaActual > Math.ceil(totalElementos / elementosPorPagina)) {
            setPaginaActual(1);
        }
    };
    // Efecto para recalcular páginas cuando cambian los elementos filtrados
    useEffect(() => {
        calcularTotalPaginas(cotizacionesFiltradas.length);
    }, [cotizacionesFiltradas, elementosPorPagina]);
    // Función para aplicar filtros avanzados
    const aplicarFiltros = () => {
        let resultados = [...cotizaciones];
        
        // Filtrar por ID de servicio
        if (filtros.id_servicio) {
            resultados = resultados.filter(cotizacion => 
                cotizacion.id_servicio?.toString().includes(filtros.id_servicio)
            );
        }
        
        // Filtrar por cliente
        if (filtros.cliente) {
            resultados = resultados.filter(cotizacion => 
                cotizacion.nombre_cliente?.toLowerCase().includes(filtros.cliente.toLowerCase())
            );
        }
        
        // Filtrar por tipo de convenio
        if (filtros.tipo_convenio) {
            resultados = resultados.filter(cotizacion => 
                cotizacion.tipo_convenio?.toLowerCase().includes(filtros.tipo_convenio.toLowerCase())
            );
        }
        
        // Filtrar por tipo de servicio
        if (filtros.tipo_servicio) {
            resultados = resultados.filter(cotizacion => 
                cotizacion.tipo_servicio?.toLowerCase().includes(filtros.tipo_servicio.toLowerCase())
            );
        }
        
        // Filtrar por estado
        if (filtros.estado) {
            resultados = resultados.filter(cotizacion => 
                cotizacion.estado?.toLowerCase() === filtros.estado.toLowerCase()
            );
        }
        
        // Filtrar por operador
        if (filtros.operador) {
            resultados = resultados.filter(cotizacion => 
                cotizacion.nombre_operador?.toLowerCase().includes(filtros.operador.toLowerCase())
            );
        }
        
        // Filtrar por fecha desde
        if (filtros.fecha_desde) {
            const fechaDesde = new Date(filtros.fecha_desde);
            resultados = resultados.filter(cotizacion => {
                if (!cotizacion.fecha_cotizacion) return false;
                return new Date(cotizacion.fecha_cotizacion) >= fechaDesde;
            });
        }
        
        // Filtrar por fecha hasta
        if (filtros.fecha_hasta) {
            const fechaHasta = new Date(filtros.fecha_hasta);
            fechaHasta.setHours(23, 59, 59, 999); // Final del día
            resultados = resultados.filter(cotizacion => {
                if (!cotizacion.fecha_cotizacion) return false;
                return new Date(cotizacion.fecha_cotizacion) <= fechaHasta;
            });
        }
        
        setCotizacionesFiltradas(resultados);
        setPaginaActual(1); // Volver a la primera página al aplicar filtros
        mostrarAlerta('info', 'Filtros aplicados', `Se encontraron ${resultados.length} resultados`);
    };
    // Función para filtrado rápido
    const handleBusquedaRapida = (e) => {
        const valor = e.target.value.toLowerCase();
        setBusqueda(valor);
        
        if (!valor.trim()) {
            setCotizacionesFiltradas(cotizaciones);
            return;
        }
        
        const resultados = cotizaciones.filter(cotizacion => 
            cotizacion.id_servicio?.toString().includes(valor) ||
            cotizacion.nombre_cliente?.toLowerCase().includes(valor) ||
            cotizacion.tipo_convenio?.toLowerCase().includes(valor) ||
            cotizacion.tipo_servicio?.toLowerCase().includes(valor) ||
            cotizacion.detalle_servicio?.toLowerCase().includes(valor) ||
            cotizacion.estado?.toLowerCase().includes(valor) ||
            cotizacion.nombre_operador?.toLowerCase().includes(valor)
        );
        
        setCotizacionesFiltradas(resultados);
        setPaginaActual(1); // Volver a la primera página al buscar
    };
    // Función para cambiar filtro activo
    const cambiarFiltroActivo = (filtro) => {
        setFiltroActivo(filtro);
        
        if (filtro === 'todos') {
            setCotizacionesFiltradas(cotizaciones);
            return;
        }
        
        const resultados = cotizaciones.filter(cotizacion => 
            cotizacion.estado?.toLowerCase() === filtro.toLowerCase()
        );
        
        setCotizacionesFiltradas(resultados);
        setPaginaActual(1); // Volver a la primera página al cambiar filtro
    };
    // Función para limpiar todos los filtros
    const limpiarFiltros = () => {
        setFiltros({
            id_servicio: '',
            cliente: '',
            tipo_convenio: '',
            tipo_servicio: '',
            estado: '',
            operador: '',
            fecha_desde: '',
            fecha_hasta: ''
        });
        setBusqueda('');
        setFiltroActivo('todos');
        setCotizacionesFiltradas(cotizaciones);
        setPaginaActual(1); // Volver a la primera página al limpiar filtros
        mostrarAlerta('info', 'Filtros limpiados', 'Se han restablecido todos los filtros');
    };
    // Función para mostrar alerta personalizada
    const mostrarAlerta = (tipo, titulo, mensaje, duracion = 5000) => {
        // Limpiar cualquier temporizador existente
        if (alertaTimerRef.current) {
            clearTimeout(alertaTimerRef.current);
        }
        
        setAlerta({
            visible: true,
            tipo,
            titulo,
            mensaje,
            duracion
        });
        
        // Configurar temporizador para ocultar la alerta
        alertaTimerRef.current = setTimeout(() => {
            setAlerta(prev => ({ ...prev, visible: false }));
        }, duracion);
    };
    // Función para cerrar alerta manualmente
    const cerrarAlerta = () => {
        if (alertaTimerRef.current) {
            clearTimeout(alertaTimerRef.current);
        }
        setAlerta(prev => ({ ...prev, visible: false }));
    };
    // Resto de funciones de manejo de cotizaciones
    const handleAcciones = (cotizacion) => {
        setCotizacionSeleccionada(cotizacion);
        setModalOpen(true);
    };
    const handleAsignarOperador = async (operadorId) => {
        if (!operadorId || !cotizacionSeleccionada) {
            mostrarAlerta('warning', 'Advertencia', 'Por favor seleccione un operador');
            return;
        }
        
        try {
            const response = await fetch(
                `http://localhost:5000/api/cotizaciones/${cotizacionSeleccionada.id_cotizacion}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        estado: 'Asignado',
                        id_operador: operadorId
                    })
                }
            );
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const data = await response.json();
            if (data.success) {
                mostrarAlerta('success', 'Éxito', 'Operador asignado correctamente');
                await fetchCotizaciones();
                setModalOpen(false);
            } else {
                throw new Error(data.message || 'Error al asignar operador');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('error', 'Error', 'Error al asignar operador: ' + error.message);
        }
    };
    const handleCambiarEstado = async (nuevoEstado) => {
        if (!cotizacionSeleccionada) return;
        
        try {
            const response = await fetch(
                `http://localhost:5000/api/cotizaciones/${cotizacionSeleccionada.id_cotizacion}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        estado: nuevoEstado,
                        id_operador: cotizacionSeleccionada.id_operador
                    })
                }
            );
            
            const data = await response.json();
            if (data.success) {
                await fetchCotizaciones();
                setCotizacionSeleccionada(prev => ({...prev, estado: nuevoEstado}));
                mostrarAlerta('success', 'Estado actualizado', `Estado cambiado a: ${nuevoEstado}`);
            } else {
                throw new Error(data.message || 'Error al cambiar el estado');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarAlerta('error', 'Error', `Error al cambiar el estado: ${error.message}`);
        }
    };
    const handleIniciarServicio = async (telefonoOperador) => {
        if (!cotizacionSeleccionada) {
            mostrarAlerta('warning', 'Advertencia', 'No hay cotización seleccionada');
            return;
        }
        
        try {
            await handleCambiarEstado('En Progreso');
            const datosServicio = {
                idServicio: cotizacionSeleccionada.id_servicio,
                nombre: cotizacionSeleccionada.cliente_nombre || 'Cliente',
                origen: cotizacionSeleccionada.direccion_origen || 'Origen no especificado',
                destino: cotizacionSeleccionada.direccion_destino || 'Destino no especificado',
                tipo_servicio: cotizacionSeleccionada.tipo_servicio,
                detalle_servicio: cotizacionSeleccionada.detalle_servicio
            };
            
            if (telefonoOperador) {
                try {
                    const response = await fetch('http://localhost:5000/api/enviar-notificacion', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            telefono: telefonoOperador,
                            datos: datosServicio
                        })
                    });
                    
                    const resultado = await response.json();
                    if (resultado.success) {
                        mostrarAlerta('success', 'Servicio iniciado', 'Servicio iniciado y notificación enviada correctamente');
                    } else {
                        throw new Error(resultado.message);
                    }
                } catch (notificationError) {
                    // console.error('Error al enviar notificación:', notificationError);
                    // mostrarAlerta('warning', 'Advertencia', 'El servicio se inició pero hubo un error al enviar la notificación');
                }
            } else {
               // mostrarAlerta('warning', 'Advertencia', 'No se pudo enviar la notificación: Teléfono no disponible');
            }
            
            await fetchCotizaciones();
        } catch (error) {
            console.error('Error completo:', error);
            mostrarAlerta('error', 'Error', `Error: ${error.message}`);
        }
    };
    const handleCompletar = async () => {
        try {
            await handleCambiarEstado('Completado');
            mostrarAlerta('success', 'Servicio completado', 'Servicio marcado como completado exitosamente');
            setModalOpen(false);
        } catch (error) {
            console.error('Error al completar el servicio:', error);
            mostrarAlerta('error', 'Error', 'Error al completar el servicio');
        }
    };
    // Obtener elementos de la página actual
    const elementosPaginaActual = cotizacionesFiltradas.slice(
        (paginaActual - 1) * elementosPorPagina,
        paginaActual * elementosPorPagina
    );
    // Función para cambiar de página
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Función para generar botones de paginación
    const generarBotonesPaginacion = () => {
        const botones = [];
        const maxBotonesVisibles = 5; // Número máximo de botones de página a mostrar
        
        // Siempre mostrar botón "Anterior"
        botones.push(
            <button 
                key="prev" 
                className={`pagination-btn ${paginaActual === 1 ? 'disabled' : ''}`}
                onClick={() => paginaActual > 1 && cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
            >
                <i className="fas fa-chevron-left"></i>
            </button>
        );
        
        // Lógica para mostrar un número limitado de botones con elipsis
        if (totalPaginas <= maxBotonesVisibles) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPaginas; i++) {
                botones.push(
                    <button 
                        key={i} 
                        className={`pagination-btn ${paginaActual === i ? 'active' : ''}`}
                        onClick={() => cambiarPagina(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Si hay muchas páginas, mostrar algunas con elipsis
            let startPage = Math.max(1, paginaActual - Math.floor(maxBotonesVisibles / 2));
            let endPage = Math.min(totalPaginas, startPage + maxBotonesVisibles - 1);
            
            // Ajustar si estamos cerca del final
            if (endPage - startPage < maxBotonesVisibles - 1) {
                startPage = Math.max(1, endPage - maxBotonesVisibles + 1);
            }
            
            // Primera página
            if (startPage > 1) {
                botones.push(
                    <button 
                        key={1} 
                        className="pagination-btn"
                        onClick={() => cambiarPagina(1)}
                    >
                        1
                    </button>
                );
                
                // Elipsis si no estamos mostrando la segunda página
                if (startPage > 2) {
                    botones.push(
                        <span key="ellipsis1" className="pagination-btn disabled">...</span>
                    );
                }
            }
            
            // Páginas centrales
            for (let i = startPage; i <= endPage; i++) {
                botones.push(
                    <button 
                        key={i} 
                        className={`pagination-btn ${paginaActual === i ? 'active' : ''}`}
                        onClick={() => cambiarPagina(i)}
                    >
                        {i}
                    </button>
                );
            }
            
            // Última página
            if (endPage < totalPaginas) {
                // Elipsis si no estamos mostrando la penúltima página
                if (endPage < totalPaginas - 1) {
                    botones.push(
                        <span key="ellipsis2" className="pagination-btn disabled">...</span>
                    );
                }
                
                botones.push(
                    <button 
                        key={totalPaginas} 
                        className="pagination-btn"
                        onClick={() => cambiarPagina(totalPaginas)}
                    >
                        {totalPaginas}
                    </button>
                );
            }
        }
        
        // Siempre mostrar botón "Siguiente"
        botones.push(
            <button 
                key="next" 
                className={`pagination-btn ${paginaActual === totalPaginas ? 'disabled' : ''}`}
                onClick={() => paginaActual < totalPaginas && cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        );
        
        return botones;
    };
    return (
        <div>
            <Head>
                <title>Cotizaciones - AMA Cuernavaca</title>
                <link rel="icon" href="/img/ico2.ico" type="image/x-icon" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            </Head>
            
            {/* Alerta personalizada */}
            {alerta.visible && (
                <div className={`custom-alert ${alerta.tipo} show`}>
                    <div className="alert-icon">
                        {alerta.tipo === 'success' && <i className="fas fa-check-circle"></i>}
                        {alerta.tipo === 'error' && <i className="fas fa-exclamation-circle"></i>}
                        {alerta.tipo === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
                        {alerta.tipo === 'info' && <i className="fas fa-info-circle"></i>}
                    </div>
                    <div className="alert-content">
                        <h4 className="alert-title">{alerta.titulo}</h4>
                        <p className="alert-message">{alerta.mensaje}</p>
                    </div>
                    <button className="alert-close" onClick={cerrarAlerta}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="alert-progress" style={{
                        animation: `shrink ${alerta.duracion / 1000}s linear forwards`
                    }}></div>
                </div>
            )}
            
            <nav className="navbar">
                <a className="navbar-brand" href="#">
                    <img src="/img/logo.png" alt="Logo AMA" className="modal-logo" />
                </a>
                <div 
                    className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <Link href="/servicios/">Servicios</Link>
                </ul>
            </nav>
            
            <div className="page-header">
                <div className="background-image"></div>
                <div className="filter"></div>
                <div className="header-content">
                    <h1 className="presentation-title animated-title">
                        Cotizaciones
                    </h1>
                </div>
            </div>
            
            <div className="content-wrapper">
                {/* Sección de búsqueda y filtros */}
                <div className="search-filters-container">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Buscar en todas las cotizaciones..." 
                            value={busqueda}
                            onChange={handleBusquedaRapida}
                        />
                        <button className="search-btn">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                    
                    <div className="filter-buttons">
                        <button 
                            className={`filter-btn ${filtroActivo === 'todos' ? 'active' : ''}`}
                            onClick={() => cambiarFiltroActivo('todos')}
                        >
                            Todos
                        </button>
                        <button 
                            className={`filter-btn ${filtroActivo === 'pendiente' ? 'active' : ''}`}
                            onClick={() => cambiarFiltroActivo('pendiente')}
                        >
                            Pendientes
                        </button>
                        <button 
                            className={`filter-btn ${filtroActivo === 'asignado' ? 'active' : ''}`}
                            onClick={() => cambiarFiltroActivo('asignado')}
                        >
                            Asignados
                        </button>
                        <button 
                            className={`filter-btn ${filtroActivo === 'en progreso' ? 'active' : ''}`}
                            onClick={() => cambiarFiltroActivo('en progreso')}
                        >
                            En Progreso
                        </button>
                        <button 
                            className={`filter-btn ${filtroActivo === 'completado' ? 'active' : ''}`}
                            onClick={() => cambiarFiltroActivo('completado')}
                        >
                            Completados
                        </button>
                        <button 
                            className={`filter-btn ${filtroActivo === 'cancelado' ? 'active' : ''}`}
                            onClick={() => cambiarFiltroActivo('cancelado')}
                        >
                            Cancelados
                        </button>
                    </div>
                    
                    <div className="advanced-filters-toggle">
                        <button 
                            className={`toggle-btn ${mostrarFiltrosAvanzados ? 'active' : ''}`}
                            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                        >
                            {mostrarFiltrosAvanzados ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'} 
                            <i className={`fas fa-chevron-${mostrarFiltrosAvanzados ? 'up' : 'down'}`}></i>
                        </button>
                    </div>
                    
                    {mostrarFiltrosAvanzados && (
                        <div className="advanced-filters">
                            <div className="filter-row">
                                <div className="filter-field">
                                    <label>ID Servicio</label>
                                    <input 
                                        type="text" 
                                        value={filtros.id_servicio}
                                        onChange={(e) => setFiltros({...filtros, id_servicio: e.target.value})}
                                        placeholder="Buscar por ID"
                                    />
                                </div>
                                <div className="filter-field">
                                    <label>Cliente</label>
                                    <input 
                                        type="text" 
                                        value={filtros.cliente}
                                        onChange={(e) => setFiltros({...filtros, cliente: e.target.value})}
                                        placeholder="Nombre del cliente"
                                    />
                                </div>
                                <div className="filter-field">
                                    <label>Tipo de Convenio</label>
                                    <input 
                                        type="text" 
                                        value={filtros.tipo_convenio}
                                        onChange={(e) => setFiltros({...filtros, tipo_convenio: e.target.value})}
                                        placeholder="Tipo de convenio"
                                    />
                                </div>
                            </div>
                            
                            <div className="filter-row">
                                <div className="filter-field">
                                    <label>Tipo de Servicio</label>
                                    <input 
                                        type="text" 
                                        value={filtros.tipo_servicio}
                                        onChange={(e) => setFiltros({...filtros, tipo_servicio: e.target.value})}
                                        placeholder="Tipo de servicio"
                                    />
                                </div>
                                <div className="filter-field">
                                    <label>Estado</label>
                                    <select 
                                        value={filtros.estado}
                                        onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Asignado">Asignado</option>
                                        <option value="En Progreso">En Progreso</option>
                                        <option value="Completado">Completado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                                <div className="filter-field">
                                    <label>Operador</label>
                                    <input 
                                        type="text" 
                                        value={filtros.operador}
                                        onChange={(e) => setFiltros({...filtros, operador: e.target.value})}
                                        placeholder="Nombre del operador"
                                    />
                                </div>
                            </div>
                            
                            <div className="filter-row">
                                <div className="filter-field">
                                    <label>Fecha Desde</label>
                                    <input 
                                        type="date" 
                                        value={filtros.fecha_desde}
                                        onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
                                    />
                                </div>
                                <div className="filter-field">
                                    <label>Fecha Hasta</label>
                                    <input 
                                        type="date" 
                                        value={filtros.fecha_hasta}
                                        onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
                                    />
                                </div>
                                <div className="filter-actions">
                                    <button 
                                        className="apply-filters-btn"
                                        onClick={aplicarFiltros}
                                    >
                                        <i className="fas fa-filter"></i> Aplicar Filtros
                                    </button>
                                    <button 
                                        className="clear-filters-btn"
                                        onClick={limpiarFiltros}
                                    >
                                        <i className="fas fa-times"></i> Limpiar Filtros
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                          
                {/* Separador visual entre buscador y tabla */}
                <div className="section-divider"></div>
                
                <div className="table-container">
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                            <button onClick={fetchCotizaciones} className="retry-button">
                                <i className="fas fa-redo"></i> Reintentar
                            </button>
                        </div>
                    )}
                    
                    {loading ? (
                        <div className="loading">
                            <i className="fas fa-spinner fa-spin"></i> Cargando cotizaciones...
                        </div>
                    ) : cotizacionesFiltradas.length === 0 ? (
                        <div className="no-data">
                            No hay cotizaciones que coincidan con los criterios de búsqueda
                        </div>
                    ) : (
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID servicio</th>
                                        <th>Cliente</th>
                                        <th>Tipo de convenio</th>
                                        <th>Tipo de Servicio</th>
                                        <th>Detalle</th>
                                        <th>Estatus</th>
                                        <th>Fecha Cotización</th>
                                        <th>Fecha Modificación</th>
                                        <th>Operador</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from(new Set(elementosPaginaActual.map(cotizacion => cotizacion.id_servicio)))
                                        .map(id_servicio => {
                                            const cotizacion = elementosPaginaActual.find(cot => cot.id_servicio === id_servicio);
                                            return (
                                                <tr key={cotizacion.id_servicio}>
                                                    <td>{cotizacion.id_servicio}</td>
                                                    <td>{cotizacion.nombre_cliente || 'No disponible'}</td>
                                                    <td>{cotizacion.tipo_convenio || 'No especificado'}</td>
                                                    <td>{cotizacion.tipo_servicio || 'No especificado'}</td>
                                                    <td>{cotizacion.detalle_servicio || 'Sin detalle'}</td>
                                                    <td className={`status-${(cotizacion.estado || 'pendiente').toLowerCase()}`}>
                                                        {cotizacion.estado || 'Pendiente'}
                                                    </td>
                                                    <td>
                                                        {cotizacion.fecha_cotizacion
                                                            ? new Date(cotizacion.fecha_cotizacion).toLocaleString()
                                                            : 'Fecha no disponible'}
                                                    </td>
                                                    <td>
                                                        {cotizacion.fecha_modificacion
                                                            ? new Date(cotizacion.fecha_modificacion).toLocaleString()
                                                            : 'Fecha no disponible'}
                                                    </td>
                                                    <td>{cotizacion.nombre_operador || 'No asignado'}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleAcciones(cotizacion)}
                                                            className="btn-acciones"
                                                        >
                                                            <i className="fas fa-cog"></i> Acciones
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                            
                            {/* Paginación */}
                            <div className="pagination">
                                {generarBotonesPaginacion()}
                            </div>
                            
                            <div className="pagination-info">
                                Página {paginaActual} de {totalPaginas}
                            </div>
                        </>
                    )}
                </div>
            </div>
            
            {modalOpen && cotizacionSeleccionada && (
                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    cotizacion={cotizacionSeleccionada}
                    operadores={operadores}
                    onAsignar={handleAsignarOperador}
                    onIniciar={handleIniciarServicio}
                    onCancelar={() => handleCambiarEstado('Cancelado')}
                    onCompletar={handleCompletar}
                    onReasignarOperador={(nuevoOperadorId) => handleAsignarOperador(nuevoOperadorId)}
                    onRecordarOperador={() => handleReenviarMensaje()}
                />
            )}
            
            <footer className="footer">
                {user && (
                    <div className="footer-content">
                        <p className="user-info">
                            <i className="fas fa-user"></i> {user.displayName || 'Nombre no disponible'}
                        </p>
                        <p className="user-email">
                            <i className="fas fa-envelope"></i> {user.email}
                        </p>
                    </div>
                )}
            </footer>
        </div>
    );
};
export default Cotizaciones;