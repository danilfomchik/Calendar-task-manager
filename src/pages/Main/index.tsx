import Container from '@/components/Container';
import CalendarProvider from '@/providers/calendar-provider';

import Calendar from './components/Calendar';
import Header from './components/Header';

const MainPage = () => {
    return (
        <div className="flex flex-col h-full">
            <Header />

            <Container className="w-full file:flex flex-row gap-10">
                <CalendarProvider>
                    <Calendar />
                </CalendarProvider>
            </Container>
        </div>
    );
};

export default MainPage;
