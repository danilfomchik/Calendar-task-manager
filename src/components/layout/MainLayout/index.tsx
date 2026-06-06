import {Suspense, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {Outlet} from 'react-router';

import Loading from '@/components/ui/Loading';
import {selectOpenedItems} from '@/redux/overflow/selectors';

import Aside from '../Aside';
import DataInitWrapper from '../DataInitWrapper';

// separate branches TODO
// refactor event form opening
// add ability to open/close sidebar (jira reference)
// replace react.context for calendar (check right side of the body instead) -> add custom hook and use in tooltip and popover
// popover for event details for desktop
// Firebase integration for events storage and sign in/up (google, email)
// add correct selectedDate handling (on refresh) - on separate branch
// replace momentjs with date-fns or dayjs
// d&d for events list
// update ci/cd pipelne to call lint, prettier, build after merge to develop/main and before deploy
// layout switch
// theme switch (https://chatgpt.com/share/699c086a-5894-800e-b965-4532a24a7fc5)

const MainLayout = () => {
  const openedItems = useSelector(selectOpenedItems);

  useEffect(() => {
    if (openedItems > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openedItems]);

  return (
    <>
      <DataInitWrapper />

      <Aside />
      <main className="h-full flex-1 overflow-y-auto">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};

export default MainLayout;
