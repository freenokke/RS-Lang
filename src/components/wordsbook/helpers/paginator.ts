import { lastPage } from '../config';

const getPaginator = (currentPage: number) => {
  const res = ['1'];
  if (currentPage < 5) {
    const arr = [...Array(4).keys()].map((x) => (x + 2).toString());
    res.push(...arr, null, lastPage.toString());
  } else if (currentPage >= 5 && currentPage <= lastPage - 3) {
    res.push(null);
    res.push(
      ...[currentPage - 1, currentPage, currentPage + 1].map((x) =>
        x.toString()
      )
    );
    res.push(null);
    res.push(lastPage.toString());
  } else {
    res.push(null);
    const arr = [...Array(4).keys()].map((x) => (x + lastPage - 3).toString());
    res.push(...arr);
  }
  return res;
};

export default getPaginator;
