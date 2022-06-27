import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [
  ]
})
export class MainComponent implements OnInit {

  codeMirrorOptions: any = {
    theme: 'idea',
    mode: 'application/ld+json',
    lineNumbers: true,
    lineWrapping: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true
  };
  data = '';
  json = {
    "title": "Type",
    "description": "A type of product",
    "type": "object"
  };

  typeRequest: string[] = ['POST','GET', 'PUT', 'PATH', 'DELETE'];
  selectedTypeRequest: string = '';
  content: string = `function(index) {}`;

  constructor() { }

  ngOnInit(): void {
    this.data = JSON.stringify(this.json, null, ' ');
  }

  setEditorContent(event: any) {
    console.log(event);
  }

}
