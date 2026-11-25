import {MotionConfig} from 'motion/react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router';

import './index.css';
import './moment.config';
import ReduxProvider from './providers/redux-provider';
import {router} from './routes/router';
import {assertCalendarColorsAreDistinct} from './services/colorDistance';
import {defaultCalendars} from './services/constants';

if (import.meta.env.DEV) assertCalendarColorsAreDistinct(defaultCalendars);

createRoot(document.getElementById('root')!).render(
  <ReduxProvider>
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </ReduxProvider>,
);
