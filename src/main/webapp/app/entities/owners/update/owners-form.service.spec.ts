import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../owners.test-samples';

import { OwnersFormService } from './owners-form.service';

describe('Owners Form Service', () => {
  let service: OwnersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnersFormService);
  });

  describe('Service methods', () => {
    describe('createOwnersFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOwnersFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstname: expect.any(Object),
            lastname: expect.any(Object),
            address: expect.any(Object),
            city: expect.any(Object),
            telephone: expect.any(Object),
          })
        );
      });

      it('passing IOwners should create a new form with FormGroup', () => {
        const formGroup = service.createOwnersFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstname: expect.any(Object),
            lastname: expect.any(Object),
            address: expect.any(Object),
            city: expect.any(Object),
            telephone: expect.any(Object),
          })
        );
      });
    });

    describe('getOwners', () => {
      it('should return NewOwners for default Owners initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createOwnersFormGroup(sampleWithNewData);

        const owners = service.getOwners(formGroup) as any;

        expect(owners).toMatchObject(sampleWithNewData);
      });

      it('should return NewOwners for empty Owners initial value', () => {
        const formGroup = service.createOwnersFormGroup();

        const owners = service.getOwners(formGroup) as any;

        expect(owners).toMatchObject({});
      });

      it('should return IOwners', () => {
        const formGroup = service.createOwnersFormGroup(sampleWithRequiredData);

        const owners = service.getOwners(formGroup) as any;

        expect(owners).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOwners should not enable id FormControl', () => {
        const formGroup = service.createOwnersFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOwners should disable id FormControl', () => {
        const formGroup = service.createOwnersFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
