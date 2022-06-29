import { Component, OnInit } from '@angular/core';
import { CodeModel } from '@ngstack/code-editor';


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
  theme = 'vs-dark';
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

  responseStatus: string = '';
  responseSize: string = '';
  responseTime: string = '';
  responseSuccess: boolean = false;
  
  bodyValue: string = '';
  bodyJson: any = undefined;

  constructor() {}

  ngOnInit(): void {}

  onCodeChanged(value: any) {
    console.log('CODE', value);
    this.bodyValue = value;
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
      console.time('timer:');
      const startTime = window.performance.now();
      fetch(this.url, {
        method: this.selectedTypeRequest
      })
        .then( res => {
          const endTime = window.performance.now();
          this.responseTime = (endTime - startTime).toFixed(2) + 'ms';
          this.responseStatus = `${res.status}`;
          this.responseSize = `${res.headers.get("content-length")} Bytes`;
          this.responseSuccess = res.status >= 200 && res.status < 300 ? true : false;

          console.log(`STATUS CODE: ${res.status}, SIZE ${res.headers.get("content-length")}`);
          return res.json();
        })
        .catch(error => {
          this.responseStatus = 'ERROR';
          this.responseSize = '0B';
          this.responseTime = '0ms'
          this.responseSuccess = false;
        })
        .then( res => {
          console.log(res);
          console.timeEnd('timer:');
        });
        
  }

}
