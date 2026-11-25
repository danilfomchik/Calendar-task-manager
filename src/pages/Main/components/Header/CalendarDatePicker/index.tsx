import moment from 'moment';
import {KeyboardEvent, useCallback, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';

import Button from '@/components/common/Button';
import Dropdown from '@/components/common/inputs/Dropdown';
import ArrowLeft from '@/components/ui/icons/ArrowLeft';
import ArrowRight from '@/components/ui/icons/ArrowRight';
import EmptyMonthNote from '@/pages/Main/components/EmptyMonthNote';
import {setFullDate} from '@/redux/date/dateSlice';
import {selectFullDate, selectMonth, selectYear} from '@/redux/date/selectors';
import {useAppDispatch} from '@/redux/store';
import {formatDate, getMonthsOptions} from '@/services/dateUtils';
import {gridArrowSteps} from '@/services/gridKeyboard';
import {cx} from '@/services/utils';

const renderMonthTitle = (value: string) => {
  const [monthName, yearValue] = value.split(' ');

  return (
    <>
      {monthName} <span className="font-medium opacity-60">{yearValue}</span>
    </>
  );
};

// Month cells' arrow-key steps in the 3-column grid; Home / End go to January / December
const MONTH_ARROW_STEPS = gridArrowSteps(3);

const YEAR_SWITCH_CLASS =
  'size-11 md:size-8 p-0 rounded-none border-none bg-transparent text-text-muted hover:bg-surface-raised hover:text-text';

const CalendarDatePicker = () => {
  const dispatch = useAppDispatch();
  const currentFullDate = useSelector(selectFullDate);
  const year = useSelector(selectYear);
  const month = useSelector(selectMonth);

  const monthsOptions = useMemo(() => getMonthsOptions(), []);
  const today = moment();
  const isCurrentYear = Number(year) === today.year();
  const visibleMonthIndex = Math.max(monthsOptions.indexOf(month ?? ''), 0);

  // Roving tabindex: the month grid is one tab stop, on the month the arrow keys last reached (until the visible
  // month changes), else the visible month
  const [roving, setRoving] = useState<{index: number; anchor: string} | null>(null);
  const tabStopIndex = roving?.anchor === currentFullDate ? roving.index : visibleMonthIndex;

  const onMonthChange = useCallback(
    (newMonthIndex: number) => {
      // moment clamps the day (31 January → 28 February), so the visible date always exists
      const changedFullDate = formatDate(moment(currentFullDate).month(newMonthIndex), 'YYYY-MM-DD');

      dispatch(setFullDate(changedFullDate));
    },
    [currentFullDate, dispatch],
  );

  const onYearChange = useCallback(
    (newYear: number) => {
      const changedDate = moment(currentFullDate).year(newYear);
      const changedFullDate = formatDate(changedDate, 'YYYY-MM-DD');

      dispatch(setFullDate(changedFullDate));
    },
    [currentFullDate, dispatch],
  );

  // TODO: move type into global one
  const handleYearSwitch = (type: 'prev' | 'next') => {
    if (!year) return;

    const yearToNum = Number(year);
    const newYear = type === 'prev' ? yearToNum - 1 : yearToNum + 1;

    onYearChange(newYear);
  };

  const handleMonthKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = MONTH_ARROW_STEPS[e.key];
    const isEdgeKey = e.key === 'Home' || e.key === 'End';

    if (!step && !isEdgeKey) return;

    e.preventDefault();

    // step from the month that has focus (the dialog focuses the visible month on open, whatever the tab stop)
    const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
    const focused = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const from = focused === -1 ? tabStopIndex : focused;
    const target = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : from + step;
    const next = Math.min(Math.max(target, 0), buttons.length - 1);

    setRoving({index: next, anchor: currentFullDate});
    buttons[next]?.focus();
  };

  // TODO: investigate how to position Dropdown with left-1/2 -translate-x-1/2 because now it is overflowing by aside (fixed)
  return (
    <div className="flex min-w-0 items-center relative">
      {/* The page's h1. The visible month is the picker's trigger button, and a heading can't hold the picker's popover,
          so the heading itself is for screen readers */}
      <h1 className="sr-only">
        {month} {year}
      </h1>
      <Dropdown
        selectedOption={`${month} ${year}`}
        options={[]}
        placeholder="Pick month"
        dialogLabel="Choose month and year"
        // font-display: the popup sits inside the title's wrapper and would otherwise inherit the Headline face
        className="left-0 max-md:fixed max-md:left-3 max-md:right-3 w-auto md:w-[max(100%,300px)] max-h-none mt-3 max-md:mt-2.5 rounded-none border-line-strong bg-surface-raised shadow-dropdown font-display"
        // The month title is the Headline face (text-title, which scales down below md so "September 2026" fits
        // beside ‹ Today ›); past that it truncates rather than pushing the controls off screen. The chevron never
        // shrinks.
        wrapperClassName="font-headline text-title static"
        // the month heavy, the year a step back in a lighter weight of the same face (opacity, so it follows the
        // trigger's colour when the picker is open)
        customOption={renderMonthTitle}
        triggerClassName="bg-transparent border-none p-0 max-md:min-h-11 [&_div]:font-[inherit] [&_span]:shrink-0">
        {({close}) => (
          <div className="p-4 md:p-5">
            {/* The year arrows move the visible month by a year at once (the grid behind follows), so the picker always
                shows where the calendar is */}
            <div className="flex items-center justify-between mb-4 border border-line-strong bg-surface-overlay p-1">
              <Button
                startIcon={<ArrowLeft size="size-4" aria-hidden />}
                aria-label={`Previous year, ${Number(year) - 1}`}
                className={YEAR_SWITCH_CLASS}
                onClick={() => handleYearSwitch('prev')}
              />
              <p className="flex flex-1 items-center justify-center text-center text-h4 tabular-nums text-text">
                {year}
              </p>
              <Button
                endIcon={<ArrowRight size="size-4" aria-hidden />}
                aria-label={`Next year, ${Number(year) + 1}`}
                className={YEAR_SWITCH_CLASS}
                onClick={() => handleYearSwitch('next')}
              />
            </div>
            <div
              role="group"
              aria-label={`Months of ${year}`}
              className="grid grid-cols-3 gap-2"
              onKeyDown={handleMonthKeyDown}>
              {monthsOptions.map((option, index) => {
                const isVisibleMonth = index === visibleMonthIndex;
                const isTodayMonth = isCurrentYear && index === today.month();

                return (
                  <button
                    key={option}
                    type="button"
                    tabIndex={index === tabStopIndex ? 0 : -1}
                    aria-label={`${option} ${year}${isTodayMonth ? ', this month' : ''}`}
                    aria-pressed={isVisibleMonth}
                    aria-current={isTodayMonth ? 'date' : undefined}
                    // the dialog's first focus: the month shown
                    data-autofocus={isVisibleMonth || undefined}
                    onClick={() => {
                      if (!isVisibleMonth) onMonthChange(index);

                      // a pick closes the picker; focus goes back to the title (Dropdown)
                      close();
                    }}
                    className={cx(
                      // The Month grid's marks: the visible month is the 2px green frame (selection), today's month the
                      // blue fill on its label (today's numeral), so the visible month this month is frame plus fill
                      'flex min-h-11 cursor-pointer items-center justify-center border border-line-strong bg-surface-overlay px-2 text-para-s text-text-muted transition-colors duration-150 hover:border-text-muted hover:text-text md:min-h-10',
                      {
                        'border-transparent font-semibold text-text ring-2 ring-inset ring-action hover:border-transparent':
                          isVisibleMonth,
                      },
                    )}>
                    <span
                      aria-hidden
                      className={cx('px-1', {
                        'bg-info font-semibold text-info-ink': isTodayMonth,
                      })}>
                      {option.substring(0, 3)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Dropdown>
      {/* From md, an empty Visible month says so under its title, hanging in the header's lower padding so the title
          never moves (leading-none keeps it inside that padding); below md it sits in the Month grid */}
      <EmptyMonthNote className="absolute top-full left-0 mt-0.5 max-w-full truncate leading-none max-md:hidden" />
    </div>
  );
};

export default CalendarDatePicker;
