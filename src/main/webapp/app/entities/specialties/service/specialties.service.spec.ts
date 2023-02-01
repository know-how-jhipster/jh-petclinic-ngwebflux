import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISpecialties } from '../specialties.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../specialties.test-samples';

import { SpecialtiesService } from './specialties.service';

const requireRestSample: ISpecialties = {
  ...sampleWithRequiredData,
};

describe('Specialties Service', () => {
  let service: SpecialtiesService;
  let httpMock: HttpTestingController;
  let expectedResult: ISpecialties | ISpecialties[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SpecialtiesService);
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

    it('should create a Specialties', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const specialties = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(specialties).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Specialties', () => {
      const specialties = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(specialties).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Specialties', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Specialties', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Specialties', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSpecialtiesToCollectionIfMissing', () => {
      it('should add a Specialties to an empty array', () => {
        const specialties: ISpecialties = sampleWithRequiredData;
        expectedResult = service.addSpecialtiesToCollectionIfMissing([], specialties);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(specialties);
      });

      it('should not add a Specialties to an array that contains it', () => {
        const specialties: ISpecialties = sampleWithRequiredData;
        const specialtiesCollection: ISpecialties[] = [
          {
            ...specialties,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, specialties);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Specialties to an array that doesn't contain it", () => {
        const specialties: ISpecialties = sampleWithRequiredData;
        const specialtiesCollection: ISpecialties[] = [sampleWithPartialData];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, specialties);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(specialties);
      });

      it('should add only unique Specialties to an array', () => {
        const specialtiesArray: ISpecialties[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const specialtiesCollection: ISpecialties[] = [sampleWithRequiredData];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, ...specialtiesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const specialties: ISpecialties = sampleWithRequiredData;
        const specialties2: ISpecialties = sampleWithPartialData;
        expectedResult = service.addSpecialtiesToCollectionIfMissing([], specialties, specialties2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(specialties);
        expect(expectedResult).toContain(specialties2);
      });

      it('should accept null and undefined values', () => {
        const specialties: ISpecialties = sampleWithRequiredData;
        expectedResult = service.addSpecialtiesToCollectionIfMissing([], null, specialties, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(specialties);
      });

      it('should return initial array if no Specialties is added', () => {
        const specialtiesCollection: ISpecialties[] = [sampleWithRequiredData];
        expectedResult = service.addSpecialtiesToCollectionIfMissing(specialtiesCollection, undefined, null);
        expect(expectedResult).toEqual(specialtiesCollection);
      });
    });

    describe('compareSpecialties', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSpecialties(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSpecialties(entity1, entity2);
        const compareResult2 = service.compareSpecialties(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSpecialties(entity1, entity2);
        const compareResult2 = service.compareSpecialties(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSpecialties(entity1, entity2);
        const compareResult2 = service.compareSpecialties(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
