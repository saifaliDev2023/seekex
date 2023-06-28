import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styles: [],
})
export class BucketComponent implements OnInit {
  ngOnInit(): void {
    this.fetchData();
  }

  bucketData: any;

  constructor(private http: HttpClient, private router: Router) {}

  fetchData() {
    this.http
      .get('http://localhost:3030/api/retrieveAllBuckets')
      .subscribe((response) => {
        console.log('response:', response);
        this.bucketData = response; // Store the fetched data in the variable
      });
  }

  deleteBucket(bucketId: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (confirmed) {
      this.http
        .delete(`http://localhost:3030/api/deleteBucket/${bucketId}`)
        .subscribe((response) => {
          console.log('response:', response);
          window.location.reload();
        });
    }
  }

  reset() {
    this.http
      .put(`http://localhost:3030/api/reset`, {})
      .subscribe((response) => {
        console.log('response:', response);
        window.location.reload();
        // this.router.navigate(['/']);
      });
  }
}
