import {PropsWithChildren, useRef} from 'react';

import {CalendarContext} from '@/context/calendar-context';

const CalendarProvider = ({children}: PropsWithChildren) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return <CalendarContext.Provider value={containerRef}>{children}</CalendarContext.Provider>;
};

export default CalendarProvider;
