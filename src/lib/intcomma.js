export default function intcomma(x) {
  // Converts a number to a string containing commas every three digits.
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
