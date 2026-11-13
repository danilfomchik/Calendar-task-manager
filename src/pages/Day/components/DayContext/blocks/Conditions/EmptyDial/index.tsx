import Dial from '../Dial';
import SkyScene from '../SkyScene';

// A Dial with nothing measured yet: an empty ring over the night sky and a blank temperature
const EmptyDial = () => (
  <div aria-hidden>
    <Dial rainChance={null} windDirection={null} face={<SkyScene kind="night" />}>
      <span className="font-display text-2xl font-extrabold text-white">–°</span>
    </Dial>
  </div>
);

export default EmptyDial;
