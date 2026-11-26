import moment from 'moment';

// English names and formats with weeks starting on Monday (weekday headers Mo..Su, startOf('week') is a Monday).
// doy: 6 is moment's English default (week 1 contains 1 January), kept so week() output is unchanged.
moment.updateLocale('en', {
  week: {
    dow: 1,
    doy: 6,
  },
});

moment.locale('en');
