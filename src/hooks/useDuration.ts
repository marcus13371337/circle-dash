import moment from 'moment';
import { useEffect, useState } from 'react';

const formatDuration = (duration: moment.Duration) => {
  let parts: string[] = [];

  if (!duration || duration.toISOString() === 'P0D') return;

  if (duration.years() >= 1) {
    const years = Math.floor(duration.years());
    parts.push(`${years}y`);
  }

  if (duration.months() >= 1) {
    const months = Math.floor(duration.months());
    parts.push(`${months}m`);
  }

  if (duration.days() >= 1) {
    const days = Math.floor(duration.days());
    parts.push(`${days}d`);
  }

  if (duration.hours() >= 1) {
    const hours = Math.floor(duration.hours());
    parts.push(`${hours}h`);
  }

  if (duration.minutes() >= 1) {
    const minutes = Math.floor(duration.minutes());
    parts.push(`${minutes}m`);
  }

  if (duration.seconds() >= 1) {
    const seconds = Math.floor(duration.seconds());
    parts.push(`${seconds}s`);
  }

  const final = parts.join(' ');

  return final === '' ? '0s' : final;
};

const calculateDuration = (from: string, to?: string) => {
  const startedAt = moment(from);

  const stoppedAt = moment(to);

  return moment.duration(stoppedAt.diff(startedAt));
};

export const useDuration = (from: string, to?: string) => {
  const [text, setText] = useState(() =>
    formatDuration(calculateDuration(from, to))
  );

  useEffect(() => {
    if (!to) {
      const interval = setInterval(() => {
        setText(formatDuration(calculateDuration(from, to)));
      }, 500);

      return () => clearInterval(interval);
    }
  }, [from, to]);

  return text;
};
