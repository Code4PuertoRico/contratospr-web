const MILLNAMES = ['', 'k', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];

export default function millify(n) {
  // Convert long numbers into a human-readable format, e.g. 25000 to '25K'
  let significantPart = Math.floor(Math.log10(Math.abs(n)) / 3);
  let millidx = Math.max(0, Math.min(MILLNAMES.length - 1, significantPart));
  let pretty = n / Math.pow(10, 3 * millidx);
  let decimal = pretty % 1 === 0 ? 2 : 3;
  return parseFloat(pretty.toPrecision(decimal)) + '' + MILLNAMES[millidx];
}
