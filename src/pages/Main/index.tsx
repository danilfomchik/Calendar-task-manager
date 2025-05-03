import Container from '@/components/Container';

import Calendar from './components/Calendar';
import Header from './components/Header';

const MainPage = () => {
    return (
        <div className="flex flex-col h-full">
            <Header />

            <Container className="w-full file:flex flex-row gap-10">
                <Calendar />
            </Container>
        </div>
    );
};

export default MainPage;
