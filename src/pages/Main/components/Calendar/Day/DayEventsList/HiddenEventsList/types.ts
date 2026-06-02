import {RefObject} from 'react';

import {TDayEventsListProps} from '../types';

export type THiddenEventsListProps = {
  eventsRefs: RefObject<HTMLButtonElement[]>;
  eventsContainerRef: RefObject<HTMLDivElement>;
} & TDayEventsListProps;
