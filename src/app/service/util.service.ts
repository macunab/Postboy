import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  // return bodyContent base type json/form/text
  defBodyContent(type: string) {

    return '';
  }
}
