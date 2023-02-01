import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOwners } from '../owners.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../owners.test-samples';

import { OwnersService } from './owners.service';

const requireRestSample: IOwners = {
  ...sampleWithRequiredData,
};

describe('Owners Service', () => {
  let service: OwnersService;
  let httpMock: HttpTestingController;
  let expectedResult: IOwners | IOwners[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OwnersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Owners', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const owners = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(owners).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Owners', () => {
      const owners = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(owners).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Owners', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Owners', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Owners', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOwnersToCollectionIfMissing', () => {
      it('should add a Owners to an empty array', () => {
        const owners: IOwners = sampleWithRequiredData;
        expectedResult = service.addOwnersToCollectionIfMissing([], owners);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(owners);
      });

      it('should not add a Owners to an array that contains it', () => {
        const owners: IOwners = sampleWithRequiredData;
        const ownersCollection: IOwners[] = [
          {
            ...owners,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, owners);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Owners to an array that doesn't contain it", () => {
        const owners: IOwners = sampleWithRequiredData;
        const ownersCollection: IOwners[] = [sampleWithPartialData];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, owners);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(owners);
      });

      it('should add only unique Owners to an array', () => {
        const ownersArray: IOwners[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ownersCollection: IOwners[] = [sampleWithRequiredData];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, ...ownersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const owners: IOwners = sampleWithRequiredData;
        const owners2: IOwners = sampleWithPartialData;
        expectedResult = service.addOwnersToCollectionIfMissing([], owners, owners2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(owners);
        expect(expectedResult).toContain(owners2);
      });

      it('should accept null and undefined values', () => {
        const owners: IOwners = sampleWithRequiredData;
        expectedResult = service.addOwnersToCollectionIfMissing([], null, owners, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(owners);
      });

      it('should return initial array if no Owners is added', () => {
        const ownersCollection: IOwners[] = [sampleWithRequiredData];
        expectedResult = service.addOwnersToCollectionIfMissing(ownersCollection, undefined, null);
        expect(expectedResult).toEqual(ownersCollection);
      });
    });

    describe('compareOwners', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOwners(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOwners(entity1, entity2);
        const compareResult2 = service.compareOwners(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOwners(entity1, entity2);
        const compareResult2 = service.compareOwners(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOwners(entity1, entity2);
        const compareResult2 = service.compareOwners(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
