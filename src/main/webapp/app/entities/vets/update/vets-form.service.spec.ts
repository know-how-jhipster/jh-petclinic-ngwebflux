import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vets.test-samples';

import { VetsFormService } from './vets-form.service';

describe('Vets Form Service', () => {
  let service: VetsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VetsFormService);
  });

  describe('Service methods', () => {
    describe('createVetsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVetsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstname: expect.any(Object),
            lastname: expect.any(Object),
            specialties: expect.any(Object),
          })
        );
      });

      it('passing IVets should create a new form with FormGroup', () => {
        const formGroup = service.createVetsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstname: expect.any(Object),
            lastname: expect.any(Object),
            specialties: expect.any(Object),
          })
        );
      });
    });

    describe('getVets', () => {
      it('should return NewVets for default Vets initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVetsFormGroup(sampleWithNewData);

        const vets = service.getVets(formGroup) as any;

        expect(vets).toMatchObject(sampleWithNewData);
      });

      it('should return NewVets for empty Vets initial value', () => {
        const formGroup = service.createVetsFormGroup();

        const vets = service.getVets(formGroup) as any;

        expect(vets).toMatchObject({});
      });

      it('should return IVets', () => {
        const formGroup = service.createVetsFormGroup(sampleWithRequiredData);

        const vets = service.getVets(formGroup) as any;

        expect(vets).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVets should not enable id FormControl', () => {
        const formGroup = service.createVetsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVets should disable id FormControl', () => {
        const formGroup = service.createVetsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
