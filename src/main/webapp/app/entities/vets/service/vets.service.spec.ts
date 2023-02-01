import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVets } from '../vets.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vets.test-samples';

import { VetsService } from './vets.service';

const requireRestSample: IVets = {
  ...sampleWithRequiredData,
};

describe('Vets Service', () => {
  let service: VetsService;
  let httpMock: HttpTestingController;
  let expectedResult: IVets | IVets[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VetsService);
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

    it('should create a Vets', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vets = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vets).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vets', () => {
      const vets = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vets).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vets', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vets', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vets', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVetsToCollectionIfMissing', () => {
      it('should add a Vets to an empty array', () => {
        const vets: IVets = sampleWithRequiredData;
        expectedResult = service.addVetsToCollectionIfMissing([], vets);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vets);
      });

      it('should not add a Vets to an array that contains it', () => {
        const vets: IVets = sampleWithRequiredData;
        const vetsCollection: IVets[] = [
          {
            ...vets,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, vets);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vets to an array that doesn't contain it", () => {
        const vets: IVets = sampleWithRequiredData;
        const vetsCollection: IVets[] = [sampleWithPartialData];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, vets);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vets);
      });

      it('should add only unique Vets to an array', () => {
        const vetsArray: IVets[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vetsCollection: IVets[] = [sampleWithRequiredData];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, ...vetsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vets: IVets = sampleWithRequiredData;
        const vets2: IVets = sampleWithPartialData;
        expectedResult = service.addVetsToCollectionIfMissing([], vets, vets2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vets);
        expect(expectedResult).toContain(vets2);
      });

      it('should accept null and undefined values', () => {
        const vets: IVets = sampleWithRequiredData;
        expectedResult = service.addVetsToCollectionIfMissing([], null, vets, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vets);
      });

      it('should return initial array if no Vets is added', () => {
        const vetsCollection: IVets[] = [sampleWithRequiredData];
        expectedResult = service.addVetsToCollectionIfMissing(vetsCollection, undefined, null);
        expect(expectedResult).toEqual(vetsCollection);
      });
    });

    describe('compareVets', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVets(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVets(entity1, entity2);
        const compareResult2 = service.compareVets(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVets(entity1, entity2);
        const compareResult2 = service.compareVets(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVets(entity1, entity2);
        const compareResult2 = service.compareVets(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
