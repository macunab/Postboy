import { Injectable } from '@angular/core';
import { Pair } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  // return content Type json/form/xml. Form dont add content-type
  defContentType(type: string): Pair | null{
    return (type == 'json') ? {'key': 'Content-Type', 'value': 'application/json'} : 
      (type == 'xml') ? {'key':'Content-Type', 'value':'application/xml'} : null;
  }

  //return formated url
  urlFormatting(url:string, querys: Pair[]): string {
    
    let formatedUrl = '';
    let urlQuerys = '';
    if(!(url.startsWith('http://') || url.startsWith('https://'))) {
      formatedUrl = 'http://' + url;
    } else {
      formatedUrl = url;
    }
    querys.forEach( (item, i) => {
      if(item.key && item.value) {
        if(i>0) {
          urlQuerys += `&${item.key}=${item.value}`;
        } else {
          urlQuerys += `${item.key}=${item.value}`;
        }}
    })

    return (querys.length ? `${formatedUrl}?${urlQuerys}` : formatedUrl);
  }
}
