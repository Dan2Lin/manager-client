import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserServiceService} from '../service/user-service.service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formModel: FormGroup;
  resultData: any;

  constructor(private fb: FormBuilder , private userService: UserServiceService, private router: Router) {
    this.formModel = this.fb.group({
      username: [(''), Validators.required],
      password: [(''), Validators.required]
    });
  }
  ngOnInit() {
  }
  onSubmit() {
    /* 验证通过,进行下一步处理 */
    if (this.formModel.valid) {
     // console.log(this.formModel.value);
      const username = this.formModel.value.username;
      const password = this.formModel.value.password;
      const responseData = this.userService.login(username, password)
        .subscribe(data => {
          console.log('----------------------------------');
          console.log(data);
          if (data && data.code === 0 ) {
            // 用户登录通过
            this.router.navigate(['/home']);
          }
        });
    }
  }
}
