import {createRoot} from 'react-dom/client';

import App from './App';
import './index.css';
import './moment.config';
import ReduxProvider from './providers/redux-provider';

createRoot(document.getElementById('root')!).render(
    <ReduxProvider>
        <App />
    </ReduxProvider>,
);
