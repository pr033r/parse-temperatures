export class CalculatedSummary {
  public days: number = 0;
  public hours: number = 0;
  public minutes: number = 0;

  public resetSummary(): void {
    this.days = this.hours = this.minutes = 0;
  }

  public increaseDay(offset: number): void {
    this.days += offset;
  }

  public increaseHour(offset: number): void {
    this.hours += offset;
    if (this.hours >= 24) {
      this.increaseDay(1);
      this.hours -= 24;
      this.increaseHour(0);
    }
  }

  public increaseMinutes(offset: number): void {
    this.increaseHour(0);
    this.minutes += offset;
    if (this.minutes >= 60) {
      this.increaseHour(1);
      this.minutes -= 60;
      this.increaseMinutes(0);
    }
  }
}