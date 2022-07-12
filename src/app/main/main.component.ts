import { Component, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { Pair } from '../interface/interface';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [
  ]
})
export class MainComponent implements OnInit  {

  typeRequest: string[] = ['POST','GET', 'PUT', 'PATH', 'DELETE'];
  selectedTypeRequest: string = 'POST';
  url: string = '';


  // Code editor conf
  codeModelXml: CodeModel = {
    language: 'xml',
    uri: 'main.xml',
    value: '',
    dependencies: [
      '@types/node',
      '@ngstack/translate', 
      '@ngstack/code-editor'
    ]
  }

  theme = 'vs';
  codeModel: CodeModel = {
    language: 'json',
    uri: 'main.json',
    value: '{\n\t\n}',
    dependencies: [
      '@types/node',
      '@ngstack/translate', 
      '@ngstack/code-editor'
    ]
  };

  options = {
    automaticLayout: true,
    lineNumbers: true,
    minimap: {
      enabled: false
    }
  };

  responseData!: string;
  responseStatus: string = '';
  responseSize: string = '';
  responseTime: string = '';
  responseSuccess: boolean = false;
  responseHeaders: Pair[] = [];
  loading: boolean = false;
  
  bodyValue: string = 'json';
  bodyJson: any = undefined;

  // Content type depend of body type (json/xml/text/form)
  headerList: Pair[] = [{'key': 'Accept', 'value': '*/*'}];
  queryParameters: Pair[] = [];
  bodyForm: Pair[] = [];

  constructor(private util: UtilService) {}

  ngOnInit(): void {}

  /**
   * Code editor change event - Request
   * @param value 
   */
  onCodeChanged(value: any) {
    this.bodyJson = value;
  }

  /**
   * Add item to headerList or queryParameters
   * @param isHeader 
   * @returns 
   */
  addItem(typeForm: string) {
    (typeForm == 'header') ? this.headerList.push({ 'key':'', 'value':'' }) : (typeForm == 'query') ?
      this.queryParameters.push({ 'key':'', 'value':'' }) : this.bodyForm.push({ 'key':'', 'value':'' });
  }

  /**
   * Remove item from headerList or queryParameters
   * @param index 
   * @param isHeader 
   * @returns 
   */
  removeItem(index: number, typeForm: string) {
    (typeForm == 'header') ? this.headerList.splice(index, 1) : (typeForm == 'query') ?
      this.queryParameters.splice(index, 1) : this.bodyForm.splice(index, 1);
  }

  /**
   * Transform array to json - Headers/Query Parameters
   * @param array 
   * @returns 
   */
  arrayToJson(array: Pair[]) {
    let headers = [ ...array];
    if(this.selectedTypeRequest == 'POST') {
      // here def Content-Type
      if(this.bodyValue != 'form')
        headers.push(this.util.defContentType(this.bodyValue)!);
    }
    const obj = headers.reduce((acc, { key, value}) => ({ ...acc, [key]: value}), {});
    return obj;
  }

  /**
   * Set response info from request
   * @param time 
   * @param size 
   * @param status 
   * @param success 
   */
  setResponseInfo(time: string, size: string, status: string, success: boolean) {
    this.responseTime = time;
    this.responseStatus = status;
    this.responseSize = size;
    this.responseSuccess = success;
  }

  // Investigar como obtener los headers, si no solo muestro los basicos y a la bosta
  getResponseHeaderList(res: Response) {
    res.headers.forEach((value, key) => {
      this.responseHeaders.push({ 'key': key, 'value': value});
    });
  }

  /**
   * si el body es de tipo form field se setea el body content como formData
   * @param value 
   */
  setBody(value: string) {
    this.bodyValue = value;
  }

  sendRequest() {
    if(this.bodyValue == 'form') {
      let formData = new FormData();
      this.bodyForm.forEach(value => {
        formData.append(value.key, value.value);
      });
      this.bodyJson = formData;
    }
    this.responseHeaders = [];
      this.loading = true;
      const startTime = window.performance.now();

      fetch(this.util.urlFormatting(this.url, this.queryParameters), {
        method: this.selectedTypeRequest,
        mode: 'cors',
        body: (this.selectedTypeRequest == 'POST') ? this.bodyJson : null,
        headers: this.arrayToJson(this.headerList)
      })
        .then( res => {
          const endTime = window.performance.now();
          this.setResponseInfo(`${(endTime - startTime).toFixed(2)} ms`, `${res.headers.get("content-length")} Bytes`, `${res.status}`,
          res.status >= 200 && res.status < 300 ? true : false);
          this.getResponseHeaderList(res);
          console.log(`COOKIES ${res.headers.get('set-cookie')}`);
          return res.json();
        })
        .catch(error => {
          this.setResponseInfo('0ms', '0 Bytes', 'ERROR', false);
        })
        .then( res => {
          this.loading = false;
          this.responseData = res;
        });
  }

}
