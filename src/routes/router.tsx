import moment from 'moment';
import {createBrowserRouter} from 'react-router';

import Error from '@/components/Error';
import MainLayout from '@/components/MainLayout';
import {DayPage, MainPage} from '@/pages';
import NotFound from '@/pages/NotFound';
import {RouterPaths} from '@/services/types';

export const router = createBrowserRouter([
  {
    path: RouterPaths.home,
    element: <MainLayout />,
    children: [
      {index: true, element: <MainPage />, errorElement: <Error />},
      {
        path: RouterPaths.day,
        element: <DayPage />,
        loader: ({params}) => {
          const {date} = params;

          const isValidDate = date ? moment(date, 'YYYY-MM-DD', true).isValid() : false;

          if (!date || !isValidDate) {
            throw new Response('Invalid date', {status: 404, statusText: 'Invalid date'});
          }

          return {date};
        },
        errorElement: <Error />,
      },
    ],
  },
  {
    path: RouterPaths.notFound,
    element: <NotFound />,
  },
]);
