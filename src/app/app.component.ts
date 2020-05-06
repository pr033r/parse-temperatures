import { Component, ViewChild } from '@angular/core';
import { FirstTypeDataLoggerService } from './dataLoggerServices/first-type.service';
import { TemperaturesViewModel } from './models/temperaturesView.model';
import { SecondTypeDataLoggerService } from './dataLoggerServices/second-type.service';
import { ThirdTypeDataLoggerService } from './dataLoggerServices/third-type.service';
import { version } from '../../package.json';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('csvReader', { static: false }) csvReader: any;

  public vmData: TemperaturesViewModel = null;
  public delimiterType: number = 1;
  public dataLoggerType: number = 1;
  public version: string = version;
  public currentYear = moment().format('YYYY');

  constructor(
    private firstTypeDataLogger: FirstTypeDataLoggerService,
    private secondTypeDataLogger: SecondTypeDataLoggerService,
    private thirdTypeDataLogger: ThirdTypeDataLoggerService
  ) { }

  ngOnInit() {
    this.vmData = this.firstTypeDataLogger.vm;
  }

  public changeDelimiterType(changedValue: number): void {
    this.delimiterType = changedValue;
  }

  public changeDataLoggerType(changedValue: number): void {
    this.dataLoggerType = changedValue;
  }

  public fileReset(): void {
    this.csvReader.nativeElement.value = "";
    this.firstTypeDataLogger.fileReset();
    this.secondTypeDataLogger.fileReset();
    this.thirdTypeDataLogger.fileReset();
    this.vmData = this.firstTypeDataLogger.vm;
  }

  public uploadListener($event: any): void {
    const files = $event.srcElement.files;
    const isFileValidCSV = files[0].name.endsWith(".csv");

    if (isFileValidCSV) {
      this.readFileAndCalculateData($event);
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  private readFileAndCalculateData($event: any) {
    const input = $event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = () => {
      this.calculateData(reader);
    };
    reader.onerror = function () {
      console.error('error occured while reading file!');
    };
  }

  private calculateData(reader: FileReader) {
    const csvData = reader.result;
    const csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
    const choosenDelimiterType = this.delimiterType == 1 ? ';' : ',';

    switch (this.dataLoggerType) {
      case 1:
        this.firstTypeDataLogger.fetchDataRecordsFromCSVFile(csvRecordsArray, choosenDelimiterType);
        this.vmData = this.firstTypeDataLogger.vm;
        break;
      case 2:
        this.secondTypeDataLogger.fetchDataRecordsFromCSVFile(csvRecordsArray, choosenDelimiterType);
        this.vmData = this.secondTypeDataLogger.vm;
        break;
      case 3:
        this.thirdTypeDataLogger.fetchDataRecordsFromCSVFile(csvRecordsArray, choosenDelimiterType);
        this.vmData = this.thirdTypeDataLogger.vm;
        break;
      default:
        break;
    }
  }
}