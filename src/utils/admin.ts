export function getDiff(a: number, b: number) {
  const diffFromYesterday = a - b;
  const isIncreased = diffFromYesterday > 0;
  const isSame = diffFromYesterday === 0;

  const text = isIncreased ? "증가" : isSame ? "동일" : "감소";

  return {
    diff: Math.abs(a - b),
    text
  }
}