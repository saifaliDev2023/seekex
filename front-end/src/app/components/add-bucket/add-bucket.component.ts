import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-bucket',
  templateUrl: './add-bucket.component.html',
  styles: [],
})
export class AddBucketComponent {
  formData: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  submitForm() {
    console.log(this.formData);

    this.http
      .post('http://localhost:3030/api/addBucket', this.formData)
      .subscribe((response) => {
        console.log('response:', response);
        this.router.navigate(['/bucket']);
      });
  }
}
