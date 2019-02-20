export default function linebreaksbr(value) {
  return value.replace(new RegExp(/\n/, 'g'), '<br />');
}
