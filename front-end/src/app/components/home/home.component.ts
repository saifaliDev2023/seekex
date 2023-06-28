import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface ApiResponse {
  data: any;
  message: string;
  // Define other properties of the API response as needed
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [],
})
export class HomeComponent {
  url = 'http://localhost:3030';
  bucketsData = [];
  errorData: any;
  ngOnInit(): void {
    this.fetchData();
  }

  ballData: any;
  formData: any = {};

  constructor(private http: HttpClient, private router: Router) {}

  fetchData() {
    this.http.get(`${this.url}/api/retrieveAllBalls`).subscribe((response) => {
      console.log('response:', response);
      this.ballData = response; // Store the fetched data in the variable
    });
  }

  submitForm() {
    // Set default values of 0 for any properties without a value
    for (const item of this.ballData.data) {
      if (!(item.id in this.formData)) {
        this.formData[item.id] = 0;
      }
    }
    // console.log('formData:', this.formData);

    this.http
      .post<ApiResponse>(`${this.url}/api/placeBalls`, this.formData)
      .subscribe(
        (response: ApiResponse) => {
          this.bucketsData = response.data;
          console.log('bucketsData:', this.bucketsData);

          this.ballData = response; // Store the fetched data in the variable
          this.router.navigate(['.']);
        },
        (error) => {
          // Error handling
          console.error('error:', error);
          this.errorData = error;
          console.log('errorData:', this.errorData.error);
        }
      );
  }

  reload() {
    window.location.reload();
  }
}
