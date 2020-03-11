import { Component, ViewChild } from '@angular/core';
import { TemperatureDataStructure } from './temperaturesDataStructure';
import { CalculatedDataStructure } from './calculatedDataStructure';
import { CalculatedSummary } from './calculatedSummary';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('csvReader', { static: false }) csvReader: any;

  private recordsFromCSV: Array<TemperatureDataStructure> = [];

  public calculatedData: Array<CalculatedDataStructure> = [
    new CalculatedDataStructure('<b>15</b>&#8451; - <b>25</b>&#8451;'),
    new CalculatedDataStructure('&#60;<b>15</b>&#8451;'),
    new CalculatedDataStructure('&#62;<b>25</b>&#8451; &nbsp; &le;<b>30</b>&#8451;'),
    new CalculatedDataStructure('&#62;<b>30</b>&#8451; &nbsp; &le;<b>40</b>&#8451;'),
    new CalculatedDataStructure('&#62;<b>40</b>&#8451;')
  ];

  public calculationSummary: CalculatedSummary = new CalculatedSummary();

  public fileReset(): void {
    this.csvReader.nativeElement.value = "";
    this.recordsFromCSV = [];
    this.calculationSummary.days = 0;
    this.calculationSummary.hours = 0;
    this.calculationSummary.minutes = 0;
    this.calculatedData = [
      new CalculatedDataStructure('<b>15</b>&#8451; - <b>25</b>&#8451;'),
      new CalculatedDataStructure('&#60;<b>15</b>&#8451;'),
      new CalculatedDataStructure('&#62;<b>25</b>&#8451; &nbsp; &le;<b>30</b>&#8451;'),
      new CalculatedDataStructure('&#62;<b>30</b>&#8451; &nbsp; &le;<b>40</b>&#8451;'),
      new CalculatedDataStructure('&#62;<b>40</b>&#8451;')
    ];
  }
  
  public uploadListener($event: any): void {

    const files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        this.fetchDataRecordsFromCSVFile(csvRecordsArray);

        this.calculateScenarioData();
        this.calculateSumScenario();
      };

      reader.onerror = function () {
        console.error('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  private calculateScenarioData(): void {
    if (this.recordsFromCSV.length > 2) {
      const firstValue = parseInt(moment(this.recordsFromCSV[0].time, 'HH:mm:ss').format('mm'));
      const secondValue = parseInt(moment(this.recordsFromCSV[1].time, 'HH:mm:ss').format('mm'));
      const difference = secondValue - firstValue;
      this.calculatedData = [
        new CalculatedDataStructure('<b>15</b>&#8451; - <b>25</b>&#8451;', difference),
        new CalculatedDataStructure('&#60;<b>15</b>&#8451;', difference),
        new CalculatedDataStructure('&#62;<b>25</b>&#8451; &nbsp; &le;<b>30</b>&#8451;', difference),
        new CalculatedDataStructure('&#62;<b>30</b>&#8451; &nbsp; &le;<b>40</b>&#8451;', difference),
        new CalculatedDataStructure('&#62;<b>40</b>&#8451;', difference)
      ];
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

  private calculateSumScenario() {
    this.calculatedData.forEach(o => {
      this.calculationSummary.days += o.Days;
      this.calculationSummary.hours += o.Hours;
      this.calculationSummary.minutes += o.Minutes;
    });
  }

  private fetchDataRecordsFromCSVFile(csvRecordsArray: Array<any>): void {

    csvRecordsArray.forEach(value => {
      const currentRecord = (<string>value).split(';');
      const csvRecord: TemperatureDataStructure = new TemperatureDataStructure();

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
  }

  private isValidCSVFile(file: any): boolean {
    return file.name.endsWith(".csv");
  }
}