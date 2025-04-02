import Container from '@/components/Container';

import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';

const MainPage = () => {
    return (
        <div className="flex flex-col">
            <Header />

            <Container className="w-full file:flex flex-row gap-10">
                <KanbanBoard />
            </Container>
        </div>
    );
};

export default MainPage;
