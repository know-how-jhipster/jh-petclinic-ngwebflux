import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpecialties, NewSpecialties } from '../specialties.model';

export type PartialUpdateSpecialties = Partial<ISpecialties> & Pick<ISpecialties, 'id'>;

export type EntityResponseType = HttpResponse<ISpecialties>;
export type EntityArrayResponseType = HttpResponse<ISpecialties[]>;

@Injectable({ providedIn: 'root' })
export class SpecialtiesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/specialties');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(specialties: NewSpecialties): Observable<EntityResponseType> {
    return this.http.post<ISpecialties>(this.resourceUrl, specialties, { observe: 'response' });
  }

  update(specialties: ISpecialties): Observable<EntityResponseType> {
    return this.http.put<ISpecialties>(`${this.resourceUrl}/${this.getSpecialtiesIdentifier(specialties)}`, specialties, {
      observe: 'response',
    });
  }

  partialUpdate(specialties: PartialUpdateSpecialties): Observable<EntityResponseType> {
    return this.http.patch<ISpecialties>(`${this.resourceUrl}/${this.getSpecialtiesIdentifier(specialties)}`, specialties, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpecialties>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpecialties[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpecialtiesIdentifier(specialties: Pick<ISpecialties, 'id'>): number {
    return specialties.id;
  }

  compareSpecialties(o1: Pick<ISpecialties, 'id'> | null, o2: Pick<ISpecialties, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpecialtiesIdentifier(o1) === this.getSpecialtiesIdentifier(o2) : o1 === o2;
  }

  addSpecialtiesToCollectionIfMissing<Type extends Pick<ISpecialties, 'id'>>(
    specialtiesCollection: Type[],
    ...specialtiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const specialties: Type[] = specialtiesToCheck.filter(isPresent);
    if (specialties.length > 0) {
      const specialtiesCollectionIdentifiers = specialtiesCollection.map(
        specialtiesItem => this.getSpecialtiesIdentifier(specialtiesItem)!
      );
      const specialtiesToAdd = specialties.filter(specialtiesItem => {
        const specialtiesIdentifier = this.getSpecialtiesIdentifier(specialtiesItem);
        if (specialtiesCollectionIdentifiers.includes(specialtiesIdentifier)) {
          return false;
        }
        specialtiesCollectionIdentifiers.push(specialtiesIdentifier);
        return true;
      });
      return [...specialtiesToAdd, ...specialtiesCollection];
    }
    return specialtiesCollection;
  }
}
