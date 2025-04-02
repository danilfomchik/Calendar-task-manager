import {SVGProps} from 'react';

export type TIconsSizes = `size-${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`;
export type IconProps = {size: TIconsSizes} & SVGProps<SVGSVGElement>;
