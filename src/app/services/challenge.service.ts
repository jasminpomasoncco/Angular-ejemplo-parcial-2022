import { Injectable } from '@angular/core';
import{HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";
import {Challenge} from "../model/challenges";

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  basePath = 'http://localhost:3000/api/v1';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Default error handling
      console.log(`An error occurred: ${error.error.message}`);
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return Observable with Error Message to Client
    return throwError(() => new Error('Something happened with request, please try again later'));
  }

  // Create Challenge
    create(item: any): Observable<Challenge> {
    return this.http.post<Challenge>(
      `${this.basePath}/challenges`,
      item,
      this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  // Get Student by id
  getById(id: any): Observable<Challenge> {
    return this.http.get<Challenge>(
      `${this.basePath}/${id}`,
      this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError));
  }

  // Get All Challenge
  getAll(): Observable<Challenge> {
    return this.http.get<Challenge>(`${this.basePath}/challenges`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));

  }

  // Delete Challenge
  delete(id: any) {
    return this.http.delete(`${this.basePath}/challenges/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Update Challenge
  update(id: any, item: any): Observable<Challenge> {
    return this.http.put<Challenge>(`${this.basePath}/challenges/${id}`,
      JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
