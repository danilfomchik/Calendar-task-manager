import {TSkyKind} from '../weatherCode';

export type TSkySceneProps = {
  kind: TSkyKind;
  // names the scene for screen readers; without it the scene is decorative
  label?: string;
  className?: string;
};
