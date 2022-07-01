import { Component, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';
import { Pair } from '../interface/interface';


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
    lineNumbers: true,
    minimap: {
      enabled: false
    }
  };

  responseData: string = '';
  responseStatus: string = '';
  responseSize: string = '';
  responseTime: string = '';
  responseSuccess: boolean = false;
  responseHeaders: Pair[] = [];
  loading: boolean = false;
  
  bodyValue: string = '';
  bodyJson: any = undefined;

  // Content type depend of body type (json/xml/text/form)
  headerList: Pair[] = [{'key': 'Accept', 'value': '*/*'}, {'key': 'Content-Type', 'value': 'application/json'}];
  queryParameters: Pair[] = [];

  constructor() {}

  ngOnInit(): void {}

  /**
   * Code editor change event - Request
   * @param value 
   */
  onCodeChanged(value: any) {
    this.bodyValue = value;
    this.bodyJson = value;
  }

  /**
   * Add item to headerList or queryParameters
   * @param isHeader 
   * @returns 
   */
  addItem(isHeader: boolean) {
    if(isHeader) {
      this.headerList.push({'key':'','value':''});
      return;
    }
    this.queryParameters.push({'key':'','value':''});
  }

  /**
   * Remove item from headerList or queryParameters
   * @param index 
   * @param isHeader 
   * @returns 
   */
  removeItem(index: number, isHeader: boolean) {
    if(isHeader) {
      this.headerList.splice(index, 1);
      return;
    }
    this.queryParameters.splice(index, 1);
  }

  /**
   * Transform array to json - Headers/Query Parameters
   * @param array 
   * @returns 
   */
  arrayToJson(array: Pair[]) {
    const obj = array.reduce((acc, { key, value}) => ({ ...acc, [key]: value}), {});
    return obj;
  }

  /**
   * @array objects to string ?key=value...&...
   */
  queryParameterManagement(): string {
    let urlQuerys = '';
    this.queryParameters.forEach( (item, i) => {
      if(item.key && item.value) {
        if(i>0) {
          urlQuerys += `&${item.key}=${item.value}`;
        } else {
          urlQuerys += `${item.key}=${item.value}`;
        }}
    })
    console.log(`${this.url}?${urlQuerys}`);
    return urlQuerys;
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
    this.responseHeaders.push({ 'key': 'server', 'value': `${res.headers.get('server')}`});
    console.log(res.headers.get('server'));
  }

  sendRequest() {
    
    /*console.log( `bodyJSON: ${ JSON.parse(this.bodyValue)}, RequestType: ${this.selectedTypeRequest}, 
      URL: ${this.url}` );
      if(this.url) {
        try {
          console.log(`${this.url} --- ${this.selectedTypeRequest}`)
          fetch(this.url, { 
            method: this.selectedTypeRequest,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function(response) {
            console.log(JSON.stringify(response));
            return response;
          }).then(function(data) {
          })
        }catch(error) {
          console.log(error);
        }
      } */
      this.loading = true;
      const startTime = window.performance.now();
      fetch((this.queryParameters.length ? `${this.url}?${this.queryParameterManagement()}` : this.url), {
        method: this.selectedTypeRequest,
        mode: 'cors',
        credentials: 'same-origin',
        body: (this.selectedTypeRequest == 'POST') ? this.bodyJson : null,
        headers: this.arrayToJson(this.headerList)
      })
        .then( res => {
          const endTime = window.performance.now();
          this.setResponseInfo(`${(endTime - startTime).toFixed(2)} ms`, `${res.headers.get("content-length")} Bytes`, `${res.status}`,
          res.status >= 200 && res.status < 300 ? true : false);
          res.headers.forEach((value, key) => {
            console.log(`KEY: ${key} - VALUE: ${value}`);
          });
          this.getResponseHeaderList(res);
          return res.json();
        })
        .catch(error => {
          console.log(error);
          this.setResponseInfo('0ms', '0 Bytes', 'ERROR', false);
        })
        .then( res => {
          this.loading = false;
          this.responseData = res;
        });
        console.log(this.headerList);
        
        
  }

}
