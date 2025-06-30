import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdzunaService {
  private baseUrl = '/api/jobs';
 // https://api.adzuna.com/v1/api/jobs
  private appId = 'b2e8fae6';
  private appKey = '7515444529ef2f1c24d048f6b3bdc56d';

  constructor(private http: HttpClient) {}

  private buildParams(paramsObj: any): HttpParams {
    let params = new HttpParams()
      .set('app_id', this.appId)
      .set('app_key', this.appKey);
    Object.keys(paramsObj).forEach(k => {
      if (paramsObj[k] !== null && paramsObj[k] !== undefined && paramsObj[k] !== '') {
        params = params.set(k, paramsObj[k]);
      }
    });
    return params;
  }

  searchJobs(country: string, page = 1, filters: any = {}): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/${country}/search/${page}`, { params });
  }

  getCategories(country: string): Observable<any> {
    const params = this.buildParams({});
    return this.http.get(`${this.baseUrl}/${country}/categories`, { params });
  }

  getHistogram(country: string, filters: any = {}): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/${country}/histogram`, { params });
  }

  getGeoData(country: string, filters: any = {}): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/${country}/geodata`, { params });
  }

  getTopCompanies(country: string, filters: any = {}): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/${country}/top_companies`, { params });
  }

  getHistory(country: string, filters: any = {}): Observable<any> {
    const params = this.buildParams(filters);
    return this.http.get(`${this.baseUrl}/${country}/history`, { params });
  }
}
