import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ball',
  templateUrl: './add-ball.component.html',
  styles: [],
})
export class AddBallComponent {
  formData: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  submitForm() {
    this.http
      .post(`http://localhost:3030/api/addBall`, this.formData)
      .subscribe((response) => {
        console.log('response:', response);
        this.router.navigate(['/ball']);
      });
  }
}
