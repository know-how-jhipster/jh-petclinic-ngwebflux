import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../specialties.test-samples';

import { SpecialtiesFormService } from './specialties-form.service';

describe('Specialties Form Service', () => {
  let service: SpecialtiesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpecialtiesFormService);
  });

  describe('Service methods', () => {
    describe('createSpecialtiesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSpecialtiesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            vets: expect.any(Object),
          })
        );
      });

      it('passing ISpecialties should create a new form with FormGroup', () => {
        const formGroup = service.createSpecialtiesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            vets: expect.any(Object),
          })
        );
      });
    });

    describe('getSpecialties', () => {
      it('should return NewSpecialties for default Specialties initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSpecialtiesFormGroup(sampleWithNewData);

        const specialties = service.getSpecialties(formGroup) as any;

        expect(specialties).toMatchObject(sampleWithNewData);
      });

      it('should return NewSpecialties for empty Specialties initial value', () => {
        const formGroup = service.createSpecialtiesFormGroup();

        const specialties = service.getSpecialties(formGroup) as any;

        expect(specialties).toMatchObject({});
      });

      it('should return ISpecialties', () => {
        const formGroup = service.createSpecialtiesFormGroup(sampleWithRequiredData);

        const specialties = service.getSpecialties(formGroup) as any;

        expect(specialties).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISpecialties should not enable id FormControl', () => {
        const formGroup = service.createSpecialtiesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSpecialties should disable id FormControl', () => {
        const formGroup = service.createSpecialtiesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
