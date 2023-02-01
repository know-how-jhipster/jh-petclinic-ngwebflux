import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVets, NewVets } from '../vets.model';

export type PartialUpdateVets = Partial<IVets> & Pick<IVets, 'id'>;

export type EntityResponseType = HttpResponse<IVets>;
export type EntityArrayResponseType = HttpResponse<IVets[]>;

@Injectable({ providedIn: 'root' })
export class VetsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vets: NewVets): Observable<EntityResponseType> {
    return this.http.post<IVets>(this.resourceUrl, vets, { observe: 'response' });
  }

  update(vets: IVets): Observable<EntityResponseType> {
    return this.http.put<IVets>(`${this.resourceUrl}/${this.getVetsIdentifier(vets)}`, vets, { observe: 'response' });
  }

  partialUpdate(vets: PartialUpdateVets): Observable<EntityResponseType> {
    return this.http.patch<IVets>(`${this.resourceUrl}/${this.getVetsIdentifier(vets)}`, vets, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVets>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVets[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVetsIdentifier(vets: Pick<IVets, 'id'>): number {
    return vets.id;
  }

  compareVets(o1: Pick<IVets, 'id'> | null, o2: Pick<IVets, 'id'> | null): boolean {
    return o1 && o2 ? this.getVetsIdentifier(o1) === this.getVetsIdentifier(o2) : o1 === o2;
  }

  addVetsToCollectionIfMissing<Type extends Pick<IVets, 'id'>>(
    vetsCollection: Type[],
    ...vetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vets: Type[] = vetsToCheck.filter(isPresent);
    if (vets.length > 0) {
      const vetsCollectionIdentifiers = vetsCollection.map(vetsItem => this.getVetsIdentifier(vetsItem)!);
      const vetsToAdd = vets.filter(vetsItem => {
        const vetsIdentifier = this.getVetsIdentifier(vetsItem);
        if (vetsCollectionIdentifiers.includes(vetsIdentifier)) {
          return false;
        }
        vetsCollectionIdentifiers.push(vetsIdentifier);
        return true;
      });
      return [...vetsToAdd, ...vetsCollection];
    }
    return vetsCollection;
  }
}
