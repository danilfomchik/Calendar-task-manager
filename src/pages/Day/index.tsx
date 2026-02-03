import {useParams} from 'react-router';

import Container from '@/components/Container';

const DayPage = () => {
  const {date} = useParams<{date: string}>();

  return <Container className="w-full file:flex flex-row gap-10">{date}</Container>;
};

export default DayPage;
