import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription, catchError, tap, throwError } from 'rxjs';
import { CreateFaqPayload, FAQDatum, FAQModel } from './faq_data';
import { environment } from 'src/environments/environment';



const BASE_API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})



export class FaqsService implements OnDestroy {
  private plansSubject = new ReplaySubject<FAQModel>(1);
  plans$: Observable<FAQModel> = this.plansSubject.asObservable();
  private localSubscription: Subscription = new Subscription();
  private editingFaq: FAQDatum | null = null;

  constructor(
      public router: Router,
      private http: HttpClient,
  ) {}

  getFaqs(page?: number, pageSize?: number, isActive?: boolean): Observable<FAQModel> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
       
      });

      const params: any = {};
      if (page !== undefined) {
          params.page = page;
      }
      if (pageSize !== undefined) {
          params.page_size = pageSize;
      }
      if (isActive !== undefined) {
          params.is_active = isActive;
      }

      return this.http
          .get<FAQModel>(`${BASE_API_URL}/get-all-faqs`, {
              headers,
              params,
          })
          .pipe(
              tap((res: FAQModel) => {
                  this.plansSubject.next(res);
              }),
              catchError((error: any) => {
                  // Return the error along with the resolved data
                  this.plansSubject.error(error);
                  return throwError(error);
              })
          );
  }

  createFaq(payload: CreateFaqPayload): Observable<unknown> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
      });

      return this.http.post(`${BASE_API_URL}/create-faq`, payload, {
          headers,
      });
  }

  deleteFaq(id: number): Observable<unknown> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
      });

      return this.http.delete(`${BASE_API_URL}/delete-faq/${id}`, {
          headers,
      });
  }

  updateFaq(id: number, payload: CreateFaqPayload): Observable<unknown> {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
      });

      return this.http.put(`${BASE_API_URL}/update-faq/${id}`, payload, {
          headers,
      });
  }

  setEditingFaq(faq: FAQDatum | null): void {
      this.editingFaq = faq;
  }

  getEditingFaq(): FAQDatum | null {
      return this.editingFaq;
  }




 

  ngOnDestroy(): void {
      if (this.localSubscription) {
          this.localSubscription.unsubscribe();
      }
  }
}



