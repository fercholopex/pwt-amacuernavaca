import '@/styles/variables.css';  
import '@/styles/globals.css';    
import '@/styles/animations.css';
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
