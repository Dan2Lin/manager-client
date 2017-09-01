import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Headers, Http} from '@angular/http';
import 'rxjs/Rx';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class UserServiceService {
  private loginUrl = '/staff/user/loginConsoleUser';
  private headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
  responseData: any;
  constructor(private http: Http) { }
  login(username , password): any {
     const md5_pwd = Md5.hashStr(password);
     return this.http.post(this.loginUrl, `userName=${username}&password=${md5_pwd}`, {headers: this.headers}).map((response) => {
        return response.json();
     });
  }
}
