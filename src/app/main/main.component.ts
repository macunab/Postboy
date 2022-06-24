import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [
  ]
})
export class MainComponent implements OnInit {

  typeRequest: string[] = ['POST','GET', 'PUT', 'PATH', 'DELETE'];
  selectedTypeRequest: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
