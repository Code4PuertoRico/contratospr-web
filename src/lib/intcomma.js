export default function intcomma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
