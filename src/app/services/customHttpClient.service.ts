import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomHttpClient {

  
  private url(requestParameters:Partial<RequestParameters>):string{
    return `${requestParameters.baseUrl ? requestParameters.baseUrl : this.baseUrl}/${requestParameters.controller}
    ${requestParameters.action ? `/${requestParameters.action}`:""}`;
    }

  constructor(private httpClient:HttpClient,@Inject("baseUrl")private baseUrl:string) { 

  }
  // get<T>():Observable<any>{
  //   return this.httpClient.get(this.baseUrl+"/abouts");  
  // }

  get<T>(requestParameters:Partial<RequestParameters>,id?:string):Observable<T[]>{
    let url:string="";
      if(requestParameters.fullEndPoint)
        url=requestParameters.fullEndPoint;
      else{
        url=`${this.url(requestParameters)}${id ? `/${id}`:""}${requestParameters.queryString ? `?${requestParameters.queryString}`:""}`
        url=url.replace("\n","");
        url=url.replaceAll(" ","");
      }

     return this.httpClient.get<T[]>(url)
     //as json ile responseType da ne verirsek verelim bunu json gibi algılayacak. 
  }

  post<T>(requestParameters:Partial<RequestParameters>,body:Partial<T>):Observable<T>{
    let url:string;
    if(requestParameters.fullEndPoint)
      url=requestParameters.fullEndPoint;
    else{
      url=`${this.url(requestParameters)}${requestParameters.queryString ? `?${requestParameters.queryString}`:""}`
      url=url.replace("\n","");
      url=url.replaceAll(" ","");
    }
    return this.httpClient.post<T>(url,body,{headers:requestParameters.headers,responseType:requestParameters.responseType as 'json'})
  }

  put<T>(requestParameters:Partial<RequestParameters>,body:Partial<T>):Observable<T>{
    let url:string;
    if(requestParameters.fullEndPoint)
      url=requestParameters.fullEndPoint;
    else{
      url=`${this.url(requestParameters)}${requestParameters.queryString ? `?${requestParameters.queryString}`:""}`
      url=url.replace("\n","");
      url=url.replaceAll(" ","");
    }
    return this.httpClient.put<T>(url,body,{headers:requestParameters.headers,responseType:requestParameters.responseType as 'json'})
  }

    delete<T>(requestParameters:Partial<RequestParameters>,id:string):Observable<T>{
      let url:string
      if(requestParameters.fullEndPoint)
        url=requestParameters.fullEndPoint;
      else{
        url=`${this.url(requestParameters)}/${id}${requestParameters.queryString ? `?${requestParameters.queryString}`:""}`
        url=url.replace("\n","");
        url=url.replaceAll(" ","");
      }

        return this.httpClient.delete<T>(url,{headers:requestParameters.headers,responseType:requestParameters.responseType as 'json'})

    }

}

export class RequestParameters{
  controller?:string;
  action?:string;
  queryString?:string;
  headers?:HttpHeaders;
  baseUrl?:string;
  fullEndPoint?:string;
  responseType?:string="json";//default hali json dir lakin ezilebilir.
  //Tum istekler icin genel kullanılabilecek yapıları burada yazmıs oldum.
}
