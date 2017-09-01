import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './aside/aside.component';
import { MainContentComponent } from './main-content/main-content.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http';
import {UserServiceService} from './service/user-service.service';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';

export const ROUTES: Routes = [
  { path: '', component: LoginComponent},
  { path: 'home', component: HomeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AsideComponent,
    MainContentComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [UserServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
