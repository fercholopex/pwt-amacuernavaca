import type { NextPage } from 'next';
import { useEffect, useState, useRef } from 'react';
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    sendPasswordResetEmail
} from "firebase/auth";
import Head from 'next/head';
import { auth } from '../components/firebase';
import { useAuth } from '@/components/AuthContext';
interface LoginFormData {
    email: string;
    password: string;
}
const Home: NextPage = () => {
    // Estados
    const { user, isAdmin } = useAuth(); // Usar el contexto de autenticación
    const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [recoveryEmail, setRecoveryEmail] = useState<string>('');
    const modalRef = useRef<HTMLDivElement>(null);
    // Efectos
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar') as HTMLElement;
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        };
        // Redirigir si el usuario está autenticado
        if (user) {
            if (isAdmin) {
                window.location.href = '/catalogos';
            } else {
                window.location.href = '/servicios';
            }
        }
        // Efecto para cerrar el menú al hacer clic fuera
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && !(event.target as Element).closest('.menu-toggle') && 
                !(event.target as Element).closest('.nav-links')) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen, user, isAdmin]);
    // Efecto para manejar el escape en el modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeLoginModal();
            }
        };
        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, []);
    // Manejadores
    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            window.location.href = '/servicios';
        } catch (error: any) {
            setError('Error durante el inicio de sesión: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            window.location.href = '/servicios';
        } catch (error: any) {
            setError('Credenciales inválidas. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };
    const handlePasswordRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await sendPasswordResetEmail(auth, recoveryEmail);
            setSuccess('Se ha enviado un correo de recuperación.');
            setTimeout(() => setIsRecoveryMode(false), 3000);
        } catch (error: any) {
            setError('Error al enviar el correo de recuperación.');
        } finally {
            setLoading(false);
        }
    };
    const showLoginModal = () => {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('login-show');
                if (modalRef.current) {
                    modalRef.current.style.opacity = '1';
                    modalRef.current.style.transform = 'translateY(0)';
                }
            }, 10);
        }
    };
    const closeLoginModal = () => {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('login-show');
            if (modalRef.current) {
                modalRef.current.style.opacity = '0';
                modalRef.current.style.transform = 'translateY(30px)';
            }
            setTimeout(() => {
                modal.style.display = 'none';
                setIsRecoveryMode(false);
                setError(null);
                setSuccess(null);
            }, 300);
        }
    };
    // Cerrar modal al hacer clic fuera del contenido
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeLoginModal();
        }
    };
    return (
        <div className="home-container">
            <Head>
                <title>AMA Cuernavaca</title>
                <link rel="icon" href="/img/ico2.ico" type="image/x-icon" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="AMA Cuernavaca - Asociación Morelos Automovilística" />
            </Head>
            {/* Navbar */}
            <nav className="navbar">
                <a className="navbar-brand" href="#">
                    <img src="/img/logo.png" alt="Logo AMA" />
                </a>
                <div 
                    className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {user && isAdmin && <li><a href="/catalogos">Catálogos</a></li>}
                    <li><a href="#" onClick={() => {showLoginModal(); setIsMenuOpen(false);}}>Iniciar Sesión</a></li>
                </ul>
            </nav>
            {/* Header Principal */}
            <div className="page-header">
                <div className="filter"></div>
                <div className="header-content">
                    <h1 className="presentation-title">AMA Cuernavaca</h1>
                    <h2 className="presentation-subtitle">Asociación Morelos Automovilística S.A. de C.V.</h2>
                </div>
            </div>
            {/* Modal de Login */}
            <div className="login-modal" id="loginModal" onClick={handleModalClick}>
                <div className="login-modal-content" ref={modalRef}>
                    <button className="login-close-btn" onClick={closeLoginModal}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="login-header">
                        <div className="logo-container">
                            <img src="/img/logo.png" alt="Logo AMA" className="modal-logo" />
                        </div>
                        <h2>{isRecoveryMode ? 'Recuperar Contraseña' : 'Bienvenido'}</h2>
                        <p className="login-subtitle">
                            {isRecoveryMode ? 'Ingresa tu correo electrónico' : 'Ingresa a tu cuenta'}
                        </p>
                    </div>
                    {error && <div className="alert alert-error">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    {isRecoveryMode ? (
                        <form onSubmit={handlePasswordRecovery} className="login-form">
                            <div className="input-group">
                                <input 
                                    type="email" 
                                    placeholder="Correo electrónico"
                                    value={recoveryEmail}
                                    onChange={(e) => setRecoveryEmail(e.target.value)}
                                    required 
                                    className="form-control"
                                />
                                <i className="far fa-envelope"></i>
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
                            </button>
                            <p className="recovery-toggle">
                                <a href="#" onClick={(e) => {e.preventDefault(); setIsRecoveryMode(false);}}>
                                    Volver al inicio de sesión
                                </a>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="input-group">
                                <input 
                                    type="email" 
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required 
                                    className="form-control"
                                />
                                <i className="far fa-user"></i>
                            </div>
                            <div className="input-group">
                                <input 
                                    type="password" 
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required 
                                    className="form-control"
                                />
                                <i className="fas fa-key"></i>
                            </div>
                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                            <p className="recovery-toggle">
                                <a href="#" onClick={(e) => {e.preventDefault(); setIsRecoveryMode(true);}}>
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </p>
                        </form>
                    )}
                    <div className="divider">
                        <span>o continúa con</span>
                    </div>
                    <button className="google-btn" onClick={handleGoogleLogin} disabled={loading}>
                        <i className="fab fa-google"></i>
                        <span>Google</span>
                    </button>
                </div>
            </div>
            {/* Contenido Principal */}
            <main className="main-content">
                <section className="info-section">
                    <div className="services-grid">
                        <div className="service-card">
                            <h2><i className="fas fa-users"></i> Quiénes Somos</h2>
                            <p>
                                En AMA Cuernavaca somos una empresa comprometida con la seguridad vial 
                                y el servicio automotriz integral. Con más de 20 años de experiencia, 
                                brindamos soluciones confiables como escuela de manejo, talleres mecánicos, 
                                y servicio de grúas 24/7.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="info-section">
                    <div className="services-grid">
                        <div className="service-card">
                            <h2><i className="fas fa-bullseye"></i> Misión</h2>
                            <p>
                                Ofrecer servicios automovilísticos profesionales, seguros y accesibles, 
                                que contribuyan a la formación de conductores responsables y al 
                                mantenimiento óptimo de los vehículos de nuestros clientes.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="info-section">
                    <div className="services-grid">
                        <div className="service-card">
                            <h2><i className="fas fa-eye"></i> Visión</h2>
                            <p>
                                Ser la empresa líder en servicios automotrices y de capacitación vial 
                                en Morelos, reconocida por su excelencia, innovación y compromiso con 
                                la seguridad y el desarrollo social.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="info-section">
                    <div className="services-grid">
                        <div className="service-card">
                            <h2><i className="fas fa-truck"></i> Servicio 24/7</h2>
                            <p>Asistencia vial disponible las 24 horas para emergencias y traslados.</p>
                        </div>
                        <div className="service-card">
                            <h2><i className="fas fa-shipping-fast"></i> Grúas</h2>
                            <p>Servicio de grúas tipo plataforma y arrastre para todo tipo de vehículos.</p>
                        </div>
                    </div>
                </section>
            </main>
            {/* Footer */}
            <footer className="site-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Contacto</h3>
                        <p><i className="fas fa-phone"></i> 5643683888</p>
                        <p><i className="fas fa-envelope"></i> amacuernavaca25@gmail.com</p>
                        <p><i className="fas fa-map-marker-alt"></i> Av.Cuernavaca, Morelos</p>
                    </div>
                    <div className="footer-section">
                        <h3>Horario de Atención</h3>
                        <p><i className="far fa-clock"></i> Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                        <p><i className="far fa-clock"></i> Sábados: 9:00 AM - 2:00 PM</p>
                        <p><i className="fas fa-exclamation-circle"></i> Servicio de grúas 24/7</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AMA Cuernavaca.</p>
                </div>
            </footer>
        </div>
    );
};
export default Home;