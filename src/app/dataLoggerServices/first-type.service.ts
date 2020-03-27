import { Injectable } from '@angular/core';
import { CalculatedDataModel } from '../calculatedData.model';
import { TemperatureDataModel } from '../temperatureData.model';
import { CalculatedSummaryModel } from '../calculatedSummary.model';
import { HtmlForCalculatedResults } from '../htmlForCalculatedResults.constant';
import * as moment from 'moment';
import { TemperaturesViewModel } from '../temperaturesView.model';

@Injectable({
  providedIn: 'root'
})
export class FirstTypeDataLoggerService {

  private recordsFromCSV: Array<TemperatureDataModel> = [];
  private calculatedSummary: CalculatedSummaryModel = null;
  private calculatedData: Array<CalculatedDataModel> = [];

  constructor() {
    this.initCalculatedData();
    this.initCalculatedSummary();
  }

  public get vm(): TemperaturesViewModel {
    return {
      calculatedData: this.calculatedData,
      calculatedSummary: this.calculatedSummary
    };
  }

  public fileReset(): void {
    this.recordsFromCSV = [];
    this.calculatedSummary.resetSummary();
    this.initCalculatedData();
    this.initCalculatedSummary();
  }

  public fetchDataRecordsFromCSVFile(csvRecordsArray: Array<any>, delimiter: string = ';'): void {

    this.fileReset();

    csvRecordsArray.forEach(value => {
      const currentRecord = (<string>value).split(delimiter);
      const csvRecord: TemperatureDataModel = new TemperatureDataModel();

      csvRecord.date = currentRecord[0]
        ? moment(currentRecord[0].trim(), "DD-mm-YY").format("DD-MM-YYYY")
        : null;
      csvRecord.time = currentRecord[1]
        ? currentRecord[1].trim()
        : null;
      csvRecord.temperature = currentRecord[2]
        ? parseFloat(currentRecord[2].trim())
        : 0;
      this.recordsFromCSV.push(csvRecord);
    });

    this.calculateScenarioData();
    this.calculateSumScenario();
  }

  private calculateScenarioData(): void {
    if (this.recordsFromCSV.length > 2) {
      const firstValue = parseInt(moment(this.recordsFromCSV[0].time, 'HH:mm:ss').format('mm'));
      const secondValue = parseInt(moment(this.recordsFromCSV[1].time, 'HH:mm:ss').format('mm'));
      const difference = secondValue - firstValue;
      this.initCalculatedData(difference);
    }

    this.recordsFromCSV.forEach(o => {
      if (o.temperature >= 15.0 && o.temperature <= 25.0) {
        this.calculatedData[0].increaseMinutes();
      }
      if (o.temperature < 15.0) {
        this.calculatedData[1].increaseMinutes();
      }
      if (o.temperature > 25.0 && o.temperature <= 30.0) {
        this.calculatedData[2].increaseMinutes();
      }
      if (o.temperature > 30 && o.temperature <= 40) {
        this.calculatedData[3].increaseMinutes();
      }
      if (o.temperature > 40) {
        this.calculatedData[4].increaseMinutes();
      }
    });
  }

  private calculateSumScenario(): void {
    this.calculatedData.forEach(o => {
      this.calculatedSummary.increaseDay(o.Days);
      this.calculatedSummary.increaseHour(o.Hours);
      this.calculatedSummary.increaseMinutes(o.Minutes);
    });
  }

  private initCalculatedData(difference: number = 10): void {
    this.calculatedData = new Array<CalculatedDataModel>();
    HtmlForCalculatedResults.forEach(o => {
      this.calculatedData.push(new CalculatedDataModel(o, difference));
    });
  }

  private initCalculatedSummary(): void {
    this.calculatedSummary = new CalculatedSummaryModel();
    this.calculatedSummary.days = 0;
    this.calculatedSummary.hours = 0;
    this.calculatedSummary.minutes = 0;
  }
}
