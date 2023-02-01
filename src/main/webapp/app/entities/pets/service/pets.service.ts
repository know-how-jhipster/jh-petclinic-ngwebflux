import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPets, NewPets } from '../pets.model';

export type PartialUpdatePets = Partial<IPets> & Pick<IPets, 'id'>;

type RestOf<T extends IPets | NewPets> = Omit<T, 'birthdate'> & {
  birthdate?: string | null;
};

export type RestPets = RestOf<IPets>;

export type NewRestPets = RestOf<NewPets>;

export type PartialUpdateRestPets = RestOf<PartialUpdatePets>;

export type EntityResponseType = HttpResponse<IPets>;
export type EntityArrayResponseType = HttpResponse<IPets[]>;

@Injectable({ providedIn: 'root' })
export class PetsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pets');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pets: NewPets): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pets);
    return this.http.post<RestPets>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pets: IPets): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pets);
    return this.http
      .put<RestPets>(`${this.resourceUrl}/${this.getPetsIdentifier(pets)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pets: PartialUpdatePets): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pets);
    return this.http
      .patch<RestPets>(`${this.resourceUrl}/${this.getPetsIdentifier(pets)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPets>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPets[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPetsIdentifier(pets: Pick<IPets, 'id'>): number {
    return pets.id;
  }

  comparePets(o1: Pick<IPets, 'id'> | null, o2: Pick<IPets, 'id'> | null): boolean {
    return o1 && o2 ? this.getPetsIdentifier(o1) === this.getPetsIdentifier(o2) : o1 === o2;
  }

  addPetsToCollectionIfMissing<Type extends Pick<IPets, 'id'>>(
    petsCollection: Type[],
    ...petsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pets: Type[] = petsToCheck.filter(isPresent);
    if (pets.length > 0) {
      const petsCollectionIdentifiers = petsCollection.map(petsItem => this.getPetsIdentifier(petsItem)!);
      const petsToAdd = pets.filter(petsItem => {
        const petsIdentifier = this.getPetsIdentifier(petsItem);
        if (petsCollectionIdentifiers.includes(petsIdentifier)) {
          return false;
        }
        petsCollectionIdentifiers.push(petsIdentifier);
        return true;
      });
      return [...petsToAdd, ...petsCollection];
    }
    return petsCollection;
  }

  protected convertDateFromClient<T extends IPets | NewPets | PartialUpdatePets>(pets: T): RestOf<T> {
    return {
      ...pets,
      birthdate: pets.birthdate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPets: RestPets): IPets {
    return {
      ...restPets,
      birthdate: restPets.birthdate ? dayjs(restPets.birthdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPets>): HttpResponse<IPets> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPets[]>): HttpResponse<IPets[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
