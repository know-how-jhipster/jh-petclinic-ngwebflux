import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISpecialties } from '../specialties.model';
import { SpecialtiesService } from '../service/specialties.service';

@Injectable({ providedIn: 'root' })
export class SpecialtiesRoutingResolveService implements Resolve<ISpecialties | null> {
  constructor(protected service: SpecialtiesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISpecialties | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((specialties: HttpResponse<ISpecialties>) => {
          if (specialties.body) {
            return of(specialties.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
