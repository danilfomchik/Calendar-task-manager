import {createRoot} from 'react-dom/client';

import App from './App';
import './index.css';
import ReduxProvider from './redux/redux-provider';

createRoot(document.getElementById('root')!).render(
    <ReduxProvider>
        <App />
    </ReduxProvider>,
);
