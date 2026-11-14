import DayNote from '@/components/common/DayNote';

import AIInsights from '../blocks/AIInsights';
import Conditions from '../blocks/Conditions';
import Upcoming from '../blocks/Upcoming';
import {DayContextBlock} from '../blocks/types';
import {TDayContextBlocksProps} from './types';

// Spec order. Each block owns its file under ./blocks, so a ticket fills its slot without touching this list.
// The Day note is the shared input row (also in Home's Agenda panel and Bottom sheet), so one module owns autosave.
const BLOCKS: DayContextBlock[] = [AIInsights, Conditions, Upcoming, DayNote];

const DayContextBlocks = ({date}: TDayContextBlocksProps) => (
  <div className="flex flex-col gap-3 *:shrink-0">
    {BLOCKS.map((Block, index) => (
      // static list, so the index is a stable key
      <Block key={index} date={date} />
    ))}
  </div>
);

export default DayContextBlocks;
