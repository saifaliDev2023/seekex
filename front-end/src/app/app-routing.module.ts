import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BucketComponent } from './components/bucket/bucket.component';
import { HomeComponent } from './components/home/home.component';
import { BallComponent } from './components/ball/ball.component';
import { AddBucketComponent } from './components/add-bucket/add-bucket.component';
import { AddBallComponent } from './components/add-ball/add-ball.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bucket', component: BucketComponent },
  { path: 'ball', component: BallComponent },
  { path: 'addBucket', component: AddBucketComponent },
  { path: 'addBall', component: AddBallComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
