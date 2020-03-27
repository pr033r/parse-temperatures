export class CalculatedDataModel {
  private minutesDifference: number = 10;
  private htmlText: string;

  private days: number = 0;
  private hours: number = 0;
  private minutes: number = 0;

  constructor(htmlText: string = '', minutesDifference: number = 10) {
    this.htmlText = htmlText;
    this.minutesDifference = minutesDifference;
  }

  private increaseDay(): void {
    this.days++;
  }

  private increaseHour(): void {
    this.hours++;
    if (this.hours >= 24) {
      this.increaseDay();
      this.hours = 0;
    }
  }

  public increaseMinutes(): void {
    this.minutes += this.minutesDifference;
    if (this.minutes >= 60) {
      this.increaseHour();
      this.minutes = 0;
    }
  }

  public get Days(): number {
    return this.days;
  }

  public get Hours(): number {
    return this.hours;
  }

  public get Minutes(): number {
    return this.minutes;
  }
  
  public get HtmlText() : string {
    return this.htmlText;
  }
}