export default function linebreaksbr(value) {
  // Converts all newlines in a piece of plain text to HTML line breaks
  return value.replace(new RegExp(/\n/, 'g'), '<br />');
}
