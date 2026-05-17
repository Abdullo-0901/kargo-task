export class DateUtils {
  static getDate(date: Date): string {
    const parsedDate = Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);

    const today = Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date());

    return parsedDate === today ? "Today" : parsedDate;
  }

  static getTime(date: Date): string {
    return Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
}
