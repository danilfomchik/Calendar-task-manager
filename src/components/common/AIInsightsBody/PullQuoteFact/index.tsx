import {TPullQuoteFactProps} from './types';

// The Holiday popover's fact: a display-font pull-quote under a hairline, led by a green sparkle
const PullQuoteFact = ({fact}: TPullQuoteFactProps) => (
  <p className="border-t border-line pt-3 text-para-l text-text">
    <span aria-hidden className="mr-1 text-action">
      ✦
    </span>
    {fact}
  </p>
);

export default PullQuoteFact;
