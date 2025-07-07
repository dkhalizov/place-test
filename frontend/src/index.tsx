import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, ConfigContext } from './ConfigProvider';
import AppRoutes from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

const App = () => {
    return (
        <ConfigProvider>
            <ConfigContext.Consumer>
                {(config) => (
                    <BrowserRouter>
                        <AppRoutes authEnabled={config?.authEnabled ?? false} />
                    </BrowserRouter>
                )}
            </ConfigContext.Consumer>
        </ConfigProvider>
    );
};

root.render(<App />);