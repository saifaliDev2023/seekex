import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BucketComponent } from './components/bucket/bucket.component';
import { BallComponent } from './components/ball/ball.component';
import { HomeComponent } from './components/home/home.component';
import { AddBallComponent } from './components/add-ball/add-ball.component';
import { AddBucketComponent } from './components/add-bucket/add-bucket.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BucketComponent,
    BallComponent,
    HomeComponent,
    AddBallComponent,
    AddBucketComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
