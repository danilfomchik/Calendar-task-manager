import {RefObject} from 'react';

import {TDayEventsListProps} from '../types';

export type THiddenEventsListProps = {
  eventsRefs: RefObject<HTMLDivElement[]>;
  eventsContainerRef: RefObject<HTMLDivElement>;
} & TDayEventsListProps;
