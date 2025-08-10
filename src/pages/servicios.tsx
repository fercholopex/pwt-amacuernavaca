import { useEffect, useState, useCallback } from 'react';
import { signOut } from "firebase/auth";
import Head from 'next/head';
import { useAuth } from '../components/AuthContext';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import { auth } from '../components/firebase';
import { motion, AnimatePresence } from 'framer-motion';
const today = new Date().toISOString().split("T")[0];
const initialFormState = {
  id_cliente: '',
  n_folio: '',
  as_nombre: '',
  ap_paterno: '',
  ap_materno: '',
  as_rfc: '',
  as_telefono: '',
  marca: '',
  modelo: '',
  color: '',
  placas: '',
  fecha: today,
  direccion_origen: '',
  direccion_destino: ''
};
const Servicios = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [mapCenter, setMapCenter] = useState({ lat: 18.9242, lng: -99.2216 });
  const [directions, setDirections] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [routeInfo, setRouteInfo] = useState({ distanceInKm: 0, durationInMin: 0 });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [predictions, setPredictions] = useState({
    origen: [],
    destino: []
  });
  const [activeStep, setActiveStep] = useState(1);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/catalogos/clientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          if (response.status === 500) {
            console.error('Error interno del servidor al obtener clientes');
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
            showNotification(`Error interno del servidor: ${errorData.message || 'Por favor contacte al administrador del sistema'}`, 'error');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          showNotification('Error de conexión: Verifica que el servidor esté ejecutándose', 'error');
        } else {
          showNotification('Error al obtener clientes. Por favor intente nuevamente más tarde.', 'error');
        }
      }
    };
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
    fetchClientes();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps) {
        setIsMapLoaded(true);
      } else {
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };
    if (typeof window !== 'undefined') {
      checkGoogleMapsLoaded();
    }
    return () => {
      clearTimeout(checkGoogleMapsLoaded);
    };
  }, []);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      showNotification('Error al cerrar sesión: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePlaceSearch = (input, type) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn('Google Maps Places API not loaded yet');
      return;
    }
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    if (input) {
      autocompleteService.getPlacePredictions(
        { 
          input, 
          componentRestrictions: { country: 'MX' } 
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setPredictions(prev => ({
              ...prev,
              [type]: predictions
            }));
          } else {
            setPredictions(prev => ({
              ...prev,
              [type]: []
            }));
          }
        }
      );
    } else {
      setPredictions(prev => ({
        ...prev,
        [type]: []
      }));
    }
  };
  const handleSelectPlace = (prediction, type) => {
    if (!window.google || !window.google.maps) {
      showNotification('Google Maps API no está cargado completamente', 'warning');
      return;
    }
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );
    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'geometry']
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          setFormData({
            ...formData, 
            [type === 'origen' ? 'direccion_origen' : 'direccion_destino']: place.formatted_address
          });
          if (place.geometry && place.geometry.location) {
            setMapCenter({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            });
          }
        } else {
          setFormData({
            ...formData, 
            [type === 'origen' ? 'direccion_origen' : 'direccion_destino']: prediction.description
          });
        }
        setPredictions(prev => ({...prev, [type]: []}));
      }
    );
  };
  const calculateRoute = () => {
    if (formData.direccion_origen && formData.direccion_destino) {
      if (!window.google || !window.google.maps) {
        showNotification('Google Maps API no está cargado completamente. Por favor, espere un momento.', 'warning');
        return;
      }
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: formData.direccion_origen,
          destination: formData.direccion_destino,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
          avoidTolls: false
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            setSelectedRoute(0);
            const routesInfo = result.routes.map(route => {
              const leg = route.legs[0];
              return {
                distanceInKm: leg.distance.value / 1000,
                durationInMin: leg.duration.value / 60,
                hasTolls: route.warnings.some(warning => warning.includes('peaje'))
              };
            });
            setRouteInfo(routesInfo[0]);
            setMapCenter(result.routes[0].legs[0].end_location);
            showNotification('¡Ruta calculada exitosamente!', 'success');
          } else {
            console.error(`Error al obtener direcciones: ${status}`);
            showNotification('No se pudo obtener la ruta. Verifica las direcciones.', 'error');
          }
        }
      );
    } else {
      showNotification('Por favor, ingresa las direcciones de origen y destino.', 'warning');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      usuario: user.email,
      km: routeInfo.distanceInKm,
      minutos: routeInfo.durationInMin
    };
    try {
      const response = await fetch('http://localhost:5000/api/servicios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error desconocido al registrar el servicio');
      }
      const data = await response.json();
      const queryParams = {
        id_cliente: formData.id_cliente,
        n_folio: formData.n_folio,
        as_nombre: formData.as_nombre,
        ap_paterno: formData.ap_paterno,
        ap_materno: formData.ap_materno,
        as_rfc: formData.as_rfc,
        km: routeInfo.distanceInKm.toFixed(2),
        minutos: Math.round(routeInfo.durationInMin)
      };
      const pdfUrl = `http://localhost:5000/api/servicios/pdf/${data.id_servicio}`;
      const pdfResponse = await fetch(pdfUrl, { method: 'GET' });
      if (!pdfResponse.ok) {
        const errorText = await pdfResponse.text();
        console.error('Error al obtener el PDF:', errorText);
        throw new Error('Error al obtener el PDF');
      }
      const pdfBlob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `acuse_${formData.id_cliente}.pdf`);
      document.body.appendChild(link);
      link.onclick = function() {
        setTimeout(() => {
          console.log("Intentando redirigir a precotizaciones...");
          window.location.href = `/precotizaciones?${new URLSearchParams(queryParams).toString()}`;
        }, 500);
      };
      link.click();
      document.body.removeChild(link);
      showNotification(data.message, 'success');
    } catch (error) {
      console.error('Error al registrar el servicio:', error);
      showNotification('Error al registrar el servicio: ' + (error instanceof Error ? error.message : 'Error desconocido'), 'error');
    }
  };
  const handleClienteSearch = (searchText) => {
    setBusquedaCliente(searchText);
    if (!searchText.trim()) {
      setClientesFiltrados([]);
      return;
    }
    const filtrados = clientes.filter(cliente => {
      const searchLower = searchText.toLowerCase();
      const nombreCompleto = `${cliente.nombre_cliente}`.toLowerCase();
      const idCliente = cliente.id_cliente.toString();
      const tipoConvenio = cliente.tipo_convenio?.toLowerCase() || '';
      return nombreCompleto.includes(searchLower) ||
             idCliente.includes(searchLower) ||
             tipoConvenio.includes(searchLower);
    });
    setClientesFiltrados(filtrados.slice(0, 10));
  };
  const handleSelectCliente = (cliente) => {
    setFormData({
      ...formData,
      id_cliente: cliente.id_cliente,
    });
    setClienteSeleccionado(cliente);
    setBusquedaCliente(`${cliente.id_cliente} - ${cliente.nombre_cliente}`);
    setClientesFiltrados([]);
    setActiveStep(2);
  };
  const nextStep = () => {
    setActiveStep(prev => prev + 1);
  };
  const prevStep = () => {
    setActiveStep(prev => prev - 1);
  };
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 5000);
  }, []);
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return !!clienteSeleccionado;
      case 2:
        return formData.n_folio && 
               formData.as_nombre && 
               formData.ap_paterno && 
               formData.as_rfc && 
               formData.as_telefono && 
               formData.marca && 
               formData.modelo && 
               formData.color && 
               formData.placas;
      case 3:
        return formData.direccion_origen && 
               formData.direccion_destino && 
               selectedRoute !== null;
      default:
        return true;
    }
  };
  return (
    <div>
      <Head>
        <title>Servicios - AMA cuernavaca</title>
        <link rel="icon" href="/img/ico2.ico" type="image/x-icon" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
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
          <li><a href="/cotizaciones">Cotizaciones</a></li>
          <li><a href="#" onClick={handleSignOut}>Salir</a></li>
        </ul>
      </nav>
      <div className="page-header">
        <div className="background-image"></div>
        <div className="filter"></div>
        <div className="header-content">
          <h1 className="presentation-title animated-title">
            Servicios
          </h1>
        </div>
      </div>
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="notification-content">
              <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : notification.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle'}`}></i>
              <p>{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <section>
        <div className="form-container">
          <div className="steps-indicator">
            <div 
              className={`step ${activeStep >= 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}
              onClick={() => activeStep > 1 && setActiveStep(1)}
            >
              <div className="step-number">1</div>
              <div className="step-title">Cliente</div>
            </div>
            <div className="step-connector"></div>
            <div 
              className={`step ${activeStep >= 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}
              onClick={() => activeStep > 2 && setActiveStep(2)}
            >
              <div className="step-number">2</div>
              <div className="step-title">Datos</div>
            </div>
            <div className="step-connector"></div>
            <div 
              className={`step ${activeStep >= 3 ? 'active' : ''} ${activeStep > 3 ? 'completed' : ''}`}
              onClick={() => activeStep > 3 && setActiveStep(3)}
            >
              <div className="step-number">3</div>
              <div className="step-title">Ruta</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${activeStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-title">Confirmar</div>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {activeStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="form-step"
                >
                  <h2 className="step-heading">
                    <i className="fas fa-user-circle"></i> Selección de Cliente
                  </h2>
                  <div className="form-group">
                    <label htmlFor="busqueda_cliente">Buscar Cliente</label>
                    <div className="search-container">
                      <div className="input-with-icon">
                        <i className="fas fa-search"></i>
                        <input 
                          type="text"
                          id="busqueda_cliente"
                          placeholder="Buscar por ID, nombre o tipo de convenio..."
                          value={busquedaCliente}
                          onChange={(e) => handleClienteSearch(e.target.value)}
                          className="search-input"
                          autoComplete="off"
                        />
                      </div>
                      {clientesFiltrados.length > 0 && (
                        <div className="predictions-container cliente-search">
                          {clientesFiltrados.map((cliente) => (
                            <motion.div 
                              key={cliente.id_cliente} 
                              className="prediction-item"
                              onClick={() => handleSelectCliente(cliente)}
                              whileHover={{ backgroundColor: "#f5f5f5", x: 5 }}
                            >
                              <div className="cliente-item">
                                <span className="cliente-id">#{cliente.id_cliente}</span>
                                <span className="cliente-nombre">{cliente.nombre_cliente}</span>
                                <span className="cliente-convenio">{cliente.tipo_convenio}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                    {clienteSeleccionado && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="cliente-seleccionado"
                      >
                        <div className="cliente-card">
                          <div className="cliente-header">
                            <i className="fas fa-user-check"></i>
                            <h3>Cliente Seleccionado</h3>
                          </div>
                          <div className="cliente-details">
                            <p><strong>ID:  </strong> {clienteSeleccionado.id_cliente}</p>
                            <p><strong>Nombre:  </strong> {clienteSeleccionado.nombre_cliente}</p>
                            <p><strong>Convenio:  </strong> {clienteSeleccionado.tipo_convenio}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="form-navigation">
                    <motion.button 
                      type="button" 
                      className="next-button"
                      onClick={nextStep}
                      disabled={!validateStep(1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Siguiente <i className="fas fa-arrow-right"></i>
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {activeStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="form-step"
                >
                  <h2 className="step-heading">
                    <i className="fas fa-info-circle"></i> Información del Servicio
                  </h2>
                  <div className="form-columns">
                    <div className="form-column">
                      <h3 className="column-title">Datos del Solicitante</h3>
                      <div className="form-group">
                        <label htmlFor="n_folio">Número de folio</label>
                        <div className="input-with-icon">
                          <i className="fas fa-hashtag"></i>
                          <input 
                            type="text" 
                            id="n_folio" 
                            name="n_folio" 
                            value={formData.n_folio} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="as_nombre">Nombre del Solicitante</label>
                        <div className="input-with-icon">
                          <i className="fas fa-user"></i>
                          <input 
                            type="text" 
                            id="as_nombre" 
                            name="as_nombre" 
                            value={formData.as_nombre} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="ap_paterno">Apellido Paterno</label>
                          <input 
                            type="text" 
                            id="ap_paterno" 
                            name="ap_paterno" 
                            value={formData.ap_paterno} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                        <div className="form-group half">
                          <label htmlFor="ap_materno">Apellido Materno</label>
                          <input 
                            type="text" 
                            id="ap_materno" 
                            name="ap_materno" 
                            value={formData.ap_materno} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="as_rfc">RFC</label>
                          <div className="input-with-icon">
                            <i className="fas fa-id-card"></i>
                            <input 
                              type="text" 
                              id="as_rfc" 
                              name="as_rfc" 
                              value={formData.as_rfc} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>
                        </div>
                        <div className="form-group half">
                          <label htmlFor="as_telefono">Teléfono</label>
                          <div className="input-with-icon">
                            <i className="fas fa-phone"></i>
                            <input 
                              type="text" 
                              id="as_telefono" 
                              name="as_telefono" 
                              value={formData.as_telefono} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-column">
                      <h3 className="column-title">Datos del Vehículo</h3>
                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="marca">Marca</label>
                          <div className="input-with-icon">
                            <i className="fas fa-car"></i>
                            <input 
                              type="text" 
                              id="marca" 
                              name="marca" 
                              value={formData.marca} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>
                        </div>
                        <div className="form-group half">
                          <label htmlFor="modelo">Modelo</label>
                          <input 
                            type="text" 
                            id="modelo" 
                            name="modelo" 
                            value={formData.modelo} 
                            onChange={handleChange} 
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="color">Color</label>
                          <div className="input-with-icon">
                            <i className="fas fa-palette"></i>
                            <input 
                              type="text" 
                              id="color" 
                              name="color" 
                              value={formData.color} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>
                        </div>
                        <div className="form-group half">
                          <label htmlFor="placas">Placas</label>
                          <div className="input-with-icon">
                            <i className="fas fa-clipboard"></i>
                            <input 
                              type="text" 
                              id="placas" 
                              name="placas" 
                              value={formData.placas} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="fecha">Fecha del Servicio</label>
                        <div className="input-with-icon">
                          <i className="fas fa-calendar"></i>
                          <input 
                            type="date" 
                            id="fecha" 
                            name="fecha" 
                            value={formData.fecha} 
                            onChange={handleChange} 
                                                min={today}
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-navigation">
                    <motion.button 
                      type="button" 
                      className="back-button"
                      onClick={prevStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-arrow-left"></i> Anterior
                    </motion.button>
                    <motion.button 
                      type="button" 
                      className="next-button"
                      onClick={nextStep}
                      disabled={!validateStep(2)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Siguiente <i className="fas fa-arrow-right"></i>
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {activeStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="form-step"
                >
                  <h2 className="step-heading">
                    <i className="fas fa-map-marked-alt"></i> Selección de Ruta
                  </h2>
                  <div className="location-inputs">
                    <div className="form-group">
                      <label htmlFor="direccion_origen">Dirección Origen</label>
                      <div className="input-with-icon">
                        <i className="fas fa-map-marker-alt"></i>
                        <input 
                          type="text" 
                          id="direccion_origen" 
                          name="direccion_origen" 
                          value={formData.direccion_origen} 
                          onChange={(e) => {
                            handleChange(e);
                            handlePlaceSearch(e.target.value, 'origen');
                          }} 
                          required 
                          placeholder="Ingrese dirección de origen"
                        />
                      </div>
                      <div className="predictions-container">
                        {predictions.origen.map((prediction, index) => (
                          <motion.div 
                            key={index} 
                            className="prediction-item"
                            whileHover={{ backgroundColor: "#f5f5f5", x: 5 }}
                            onClick={() => handleSelectPlace(prediction, 'origen')}
                          >
                            <i className="fas fa-map-pin"></i> {prediction.description}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="direccion_destino">Dirección Destino</label>
                      <div className="input-with-icon">
                        <i className="fas fa-flag-checkered"></i>
                        <input 
                          type="text" 
                          id="direccion_destino" 
                          name="direccion_destino" 
                          value={formData.direccion_destino} 
                          onChange={(e) => {
                            handleChange(e);
                            handlePlaceSearch(e.target.value, 'destino');
                          }} 
                          required 
                          placeholder="Ingrese dirección de destino"
                        />
                      </div>
                      <div className="predictions-container">
                        {predictions.destino.map((prediction, index) => (
                          <motion.div 
                            key={index} 
                            className="prediction-item"
                            whileHover={{ backgroundColor: "#f5f5f5", x: 5 }}
                            onClick={() => handleSelectPlace(prediction, 'destino')}
                          >
                            <i className="fas fa-map-pin"></i> {prediction.description}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <motion.button 
                      type="button" 
                      className="calculate-button"
                      onClick={calculateRoute}
                      disabled={!formData.direccion_origen || !formData.direccion_destino}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-route"></i> Calcular Ruta
                    </motion.button>
                  </div>
                  <div className="map-container">
                    <LoadScript 
                      googleMapsApiKey="AIzaSyCbZugvRs4fqITo75XougFZaDPz7mEfcDo"
                      libraries={["places"]}
                      onLoad={() => setIsMapLoaded(true)}
                      loadingElement={
                        <div className="map-loading">
                          <div className="spinner"></div>
                          <p>Cargando Google Maps...</p>
                        </div>
                      }
                    >
                      <GoogleMap
                        mapContainerClassName="google-map"
                        center={mapCenter}
                        zoom={10}
                        options={{
                          fullscreenControl: true,
                          mapTypeControl: true,
                          streetViewControl: true,
                          zoomControl: true
                        }}
                      >
                        {directions && (
                          <DirectionsRenderer 
                            directions={directions}
                            routeIndex={selectedRoute}
                            options={{
                              polylineOptions: {
                                strokeColor: "#f39c12",
                                strokeWeight: 5
                              }
                            }}
                          />
                        )}
                      </GoogleMap>
                    </LoadScript>
                    {!isMapLoaded && (
                      <div className="map-loading">
                        <div className="spinner"></div>
                        <p>Cargando mapa...</p>
                      </div>
                    )}
                  </div>
                  {!directions && formData.direccion_origen && formData.direccion_destino && (
                    <div className="similar-routes">
                      <h3>Rutas similares:</h3>
                      <p>Escriba las direcciones completas y presione "Calcular Ruta" para ver las opciones disponibles.</p>
                    </div>
                  )}
                  {directions && directions.routes && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="routes-container"
                    >
                      <h3>
                        <i className="fas fa-route"></i> Rutas disponibles:
                      </h3>
                      <div className="routes-grid">
                        {directions.routes.map((route, index) => (
                          <motion.div 
                            key={index}
                            className={`route-option ${selectedRoute === index ? 'selected' : ''}`}
                            whileHover={{ scale: 1.02, boxShadow: "0 8px 15px rgba(0,0,0,0.1)" }}
                            onClick={() => {
                              setSelectedRoute(index);
                              setRouteInfo({
                                distanceInKm: route.legs[0].distance.value / 1000,
                                durationInMin: route.legs[0].duration.value / 60,
                                hasTolls: route.warnings.some(warning => warning.includes('peaje'))
                              });
                            }}
                          >
                            <div className="route-header">
                              <h4>Ruta {index + 1}</h4>
                              {selectedRoute === index && (
                                <span className="selected-badge">
                                  <i className="fas fa-check-circle"></i> Seleccionada
                                </span>
                              )}
                            </div>
                            <div className="route-details">
                              <div className="route-detail">
                                <i className="fas fa-road"></i>
                                <span>Distancia: {(route.legs[0].distance.value / 1000).toFixed(2)} km</span>
                              </div>
                              <div className="route-detail">
                                <i className="fas fa-clock"></i>
                                <span>Tiempo estimado: {Math.round(route.legs[0].duration.value / 60)} minutos</span>
                              </div>
                              <div className="route-detail toll-info">
                                <i className={`fas ${route.warnings.some(warning => warning.includes('peaje')) ? 'fa-money-bill' : 'fa-check'}`}></i>
                                <span>
                                  {route.warnings.some(warning => warning.includes('peaje')) 
                                    ? 'Ruta con peaje' 
                                    : 'Ruta sin peaje'}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div className="form-navigation">
                    <motion.button 
                      type="button" 
                      className="back-button"
                      onClick={prevStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-arrow-left"></i> Anterior
                    </motion.button>
                    <motion.button 
                      type="button" 
                      className="next-button"
                      onClick={nextStep}
                      disabled={selectedRoute === null}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Siguiente <i className="fas fa-arrow-right"></i>
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {activeStep === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="form-step"
                >
                  <h2 className="step-heading">
                    <i className="fas fa-clipboard-check"></i> Confirmación del Servicio
                  </h2>
                  <div className="confirmation-container">
                    <div className="confirmation-section">
                      <h3>
                        <i className="fas fa-user-circle"></i> Información del Cliente
                      </h3>
                      <div className="confirmation-details">
                        <div className="confirmation-item">
                          <span className="label">ID Cliente: </span>
                          <span className="value">{formData.id_cliente}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Nombre: </span>
                          <span className="value">{clienteSeleccionado?.nombre_cliente}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Convenio: </span>
                          <span className="value">{clienteSeleccionado?.tipo_convenio}</span>
                        </div>
                      </div>
                    </div>
                    <div className="confirmation-section">
                      <h3>
                        <i className="fas fa-user"></i> Información del Solicitante
                      </h3>
                      <div className="confirmation-details">
                        <div className="confirmation-item">
                          <span className="label">Nombre:  </span>
                          <span className="value">{`${formData.as_nombre} ${formData.ap_paterno} ${formData.ap_materno}`}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">RFC:  </span>
                          <span className="value">{formData.as_rfc}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Teléfono:  </span>
                          <span className="value">{formData.as_telefono}</span>
                        </div>
                      </div>
                    </div>
                    <div className="confirmation-section">
                      <h3>
                        <i className="fas fa-car"></i> Información del Vehículo
                      </h3>
                      <div className="confirmation-details">
                        <div className="confirmation-item">
                          <span className="label">Marca:  </span>
                          <span className="value">{formData.marca}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Modelo:  </span>
                          <span className="value">{formData.modelo}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Color:  </span>
                          <span className="value">{formData.color}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Placas:  </span>
                          <span className="value">{formData.placas}</span>
                        </div>
                      </div>
                    </div>
                    <div className="confirmation-section">
                      <h3>
                        <i className="fas fa-map-marked-alt"></i> Información de la Ruta
                      </h3>
                      <div className="confirmation-details">
                        <div className="confirmation-item">
                          <span className="label">Origen:  </span>
                          <span className="value">{formData.direccion_origen}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Destino:  </span>
                          <span className="value">{formData.direccion_destino}</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Distancia:  </span>
                          <span className="value">{routeInfo.distanceInKm.toFixed(2)} km</span>
                        </div>
                        <div className="confirmation-item">
                          <span className="label">Tiempo estimado:  </span>
                          <span className="value">{Math.round(routeInfo.durationInMin)} minutos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-navigation">
                    <motion.button 
                      type="button" 
                      className="back-button"
                      onClick={prevStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-arrow-left"></i> Anterior
                    </motion.button>
                    <motion.button 
                      type="submit" 
                      className="submit-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fas fa-check-circle"></i> Registrar Servicio
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>
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
export default Servicios;