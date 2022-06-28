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
  selectedTypeRequest: string = '';
  url: string = '';
  theme = 'vs-dark';
  dependencies: string[] = [
    '@types/node',
    '@ngstack/translate', 
    '@ngstack/code-editor'
  ];
  codeModel: CodeModel = {
    language: 'json',
    uri: 'main.json',
    value: '{ "test": true }',
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

  constructor() {}

  ngOnInit(): void {}

  onCodeChanged(value: any) {
    console.log('CODE', value);
  }

  sendRequest() {
    console.log( `bodyContent:, RequestType: ${this.selectedTypeRequest}, 
      URL: ${this.url}` );
  }

}
