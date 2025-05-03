import moment from 'moment';

moment.updateLocale('uk', {
    week: {
        dow: 1, // week starts on Monday
    },
});

moment.locale('uk');
