import { Injectable } from '@angular/core';
import { TemperatureDataModel } from '../models/temperatureData.model';
import { CalculatedSummaryModel } from '../models/calculatedSummary.model';
import { CalculatedDataModel } from '../models/calculatedData.model';
import { TemperaturesViewModel } from '../models/temperaturesView.model';
import { HtmlForCalculatedResults } from '../htmlForCalculatedResults.constant';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ThirdTypeDataLoggerService {

  private recordsFromCSV: Array<TemperatureDataModel> = [];
  private calculatedSummary: CalculatedSummaryModel = new CalculatedSummaryModel();
  private calculatedData: Array<CalculatedDataModel> = [];

  constructor() {
    this.initCalculatedData();
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
  }

  public fetchDataRecordsFromCSVFile(csvRecordsArray: Array<any>, delimiter: string = ';'): void {

    this.fileReset();

    csvRecordsArray.forEach(value => {
      const currentRecord = (<string>value).split(delimiter);
      const csvRecord: TemperatureDataModel = new TemperatureDataModel();

      csvRecord.date = currentRecord[0]
        ? moment(currentRecord[0].trim(), "DD-mm-YY hh:mm:ss").format("DD-MM-YYYY")
        : null;
      csvRecord.time = currentRecord[0]
        ? moment(currentRecord[0].trim(), "DD-mm-YY hh:mm:ss").format("hh:mm:ss")
        : null;
      csvRecord.temperature = currentRecord[1]
        ? parseFloat(currentRecord[1].trim())
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
      const difference = Math.abs(secondValue - firstValue);
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
}
