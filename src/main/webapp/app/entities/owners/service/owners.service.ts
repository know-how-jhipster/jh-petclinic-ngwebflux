import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOwners, NewOwners } from '../owners.model';

export type PartialUpdateOwners = Partial<IOwners> & Pick<IOwners, 'id'>;

export type EntityResponseType = HttpResponse<IOwners>;
export type EntityArrayResponseType = HttpResponse<IOwners[]>;

@Injectable({ providedIn: 'root' })
export class OwnersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/owners');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(owners: NewOwners): Observable<EntityResponseType> {
    return this.http.post<IOwners>(this.resourceUrl, owners, { observe: 'response' });
  }

  update(owners: IOwners): Observable<EntityResponseType> {
    return this.http.put<IOwners>(`${this.resourceUrl}/${this.getOwnersIdentifier(owners)}`, owners, { observe: 'response' });
  }

  partialUpdate(owners: PartialUpdateOwners): Observable<EntityResponseType> {
    return this.http.patch<IOwners>(`${this.resourceUrl}/${this.getOwnersIdentifier(owners)}`, owners, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOwners>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOwners[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOwnersIdentifier(owners: Pick<IOwners, 'id'>): number {
    return owners.id;
  }

  compareOwners(o1: Pick<IOwners, 'id'> | null, o2: Pick<IOwners, 'id'> | null): boolean {
    return o1 && o2 ? this.getOwnersIdentifier(o1) === this.getOwnersIdentifier(o2) : o1 === o2;
  }

  addOwnersToCollectionIfMissing<Type extends Pick<IOwners, 'id'>>(
    ownersCollection: Type[],
    ...ownersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const owners: Type[] = ownersToCheck.filter(isPresent);
    if (owners.length > 0) {
      const ownersCollectionIdentifiers = ownersCollection.map(ownersItem => this.getOwnersIdentifier(ownersItem)!);
      const ownersToAdd = owners.filter(ownersItem => {
        const ownersIdentifier = this.getOwnersIdentifier(ownersItem);
        if (ownersCollectionIdentifiers.includes(ownersIdentifier)) {
          return false;
        }
        ownersCollectionIdentifiers.push(ownersIdentifier);
        return true;
      });
      return [...ownersToAdd, ...ownersCollection];
    }
    return ownersCollection;
  }
}
