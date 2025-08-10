import '../styles/inicio.css';
import '../styles/_modalcotizaciones.css';
import '../styles/catalogos.css';
import '../styles/cotizaciones.css';
import '../styles/precotizaciones.css';
import '../styles/servicios.css';

import { AppProps } from 'next/app';
import { AuthProvider } from '../components/AuthContext';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <div className="app-container">
                <Component {...pageProps} />
            </div>
        </AuthProvider>
    );
}

export default MyApp;