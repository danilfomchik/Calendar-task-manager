import CalendarDatePicker from './CalendarDatePicker';
import Container from '@/components/Container';
import Controls from './Controls';

const Header = () => {
    return (
        <header>
            <Container className="flex flex-1 items-center justify-between py-[15px] gap-[20px]">
                <CalendarDatePicker />
                <Controls />
            </Container>
        </header>
    );
};

export default Header;
