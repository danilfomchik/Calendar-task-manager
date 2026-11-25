import {TUpcomingLimits} from '@/services/upcomingDays';

// Enough days to fill the desktop Agenda column under the Next event without scrolling at 900px tall; each day shows
// two events and "+N more"
export const AFTER_THAT_LIMITS: TUpcomingLimits = {
  scanDays: 30,
  maxDays: 5,
  maxEventsPerDay: 2,
  maxEvents: 8,
};
