export function getSeasonForDate(dateStr: string): 'peak' | 'mid' | 'off' {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const inRange = (start: [number, number], end: [number, number]) => {
    const dateNum = month * 100 + day;
    return dateNum >= (start[0] * 100 + start[1]) && dateNum <= (end[0] * 100 + end[1]);
  };

  if (inRange([6, 1], [9, 14])) return 'peak';
  if (inRange([9, 15], [10, 31]) || inRange([3, 1], [5, 31])) return 'mid';
  return 'off';
}
