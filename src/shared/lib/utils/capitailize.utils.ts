export class StringUtils {
  static capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
