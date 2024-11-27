export class FormatterAdapter {
  static capitalize(text: string) {
    if (!text) return text;

    return text[0].toLocaleUpperCase() + text.slice(1);
  }
}	