import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Http} from '@angular/http';
import 'rxjs/Rx';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class UserServiceService {
  private loginUrl = '/staff/user/loginConsoleUser';
  responseData: any;
  constructor(private http: Http) { }
  login(username , password): any {
     console.log(Md5.hashStr(password));
     this.http.post(this.loginUrl, {
       'userName' : username,
       'password' : Md5.hashStr(password)
     }).map((response) => response.json())
       .subscribe((data) => this.responseData = data);
        console.log(this.responseData);
  }
}
