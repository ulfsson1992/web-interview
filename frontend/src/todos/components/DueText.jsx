import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const DueText = ({ dueDate }) => {
  if (!dueDate) return null;

  const time = dayjs(dueDate);
  const now = dayjs();

  return <span>Due {now.to(time)}</span>;
};

export default DueText;