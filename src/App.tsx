import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import MainPage from './pages/Main';
import {selectOpenedItems} from './redux/overflow/selectors';

function App() {
    const openedItems = useSelector(selectOpenedItems);

    useEffect(() => {
        if (openedItems > 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [openedItems]);

    return <MainPage />;
}

export default App;
