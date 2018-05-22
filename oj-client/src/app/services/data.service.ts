import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { Problem } from '../models/problem.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _problemSource = new BehaviorSubject<Problem[]>([]);
  
  constructor(private httpClient: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    this.httpClient.get('/codegether/api/v1/problems')
      .toPromise()
      .then((res: any) => {
        this._problemSource.next(res);
      })
      .catch(this.handleError);
      return this._problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.httpClient.get(`/codegether/api/v1/problems/${id}`)
           .toPromise()
           .then((res: any) => res)
           .catch(this.handleError);
  }

  addProblem(problem: Problem) {
    const options = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.httpClient.post('/codegether/api/v1/problems', problem, options)
           .toPromise()
           .then((res: any) => {
             this.getProblems();
             return res;
           })
           .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.body || error);
  }

   buildAndRun(data: any): Promise<Object> {
       const options = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
       return this.httpClient.post('/codegether/api/v1/problems/results', data, options)
            .toPromise()
           .then((res: any) => {
               console.log('in client side build and run ');
                return res;
            })
            .catch(this.handleError);
    }
}


