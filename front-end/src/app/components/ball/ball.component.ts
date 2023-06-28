import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styles: [],
})
export class BallComponent {
  url = 'http://localhost:3030';
  ngOnInit(): void {
    this.fetchData();
  }

  ballData: any;

  constructor(private http: HttpClient, private router: Router) {}

  fetchData() {
    this.http.get(`${this.url}/api/retrieveAllBalls`).subscribe((response) => {
      console.log('response:', response);
      this.ballData = response; // Store the fetched data in the variable
    });
  }

  deleteBall(ballId: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmed) {
      this.http
        .delete(`${this.url}/api/deleteBall/${ballId}`)
        .subscribe((response) => {
          console.log('response:', response);
          window.location.reload();
        });
    }
  }
}
