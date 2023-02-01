import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVets, NewVets } from '../vets.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVets for edit and NewVetsFormGroupInput for create.
 */
type VetsFormGroupInput = IVets | PartialWithRequiredKeyOf<NewVets>;

type VetsFormDefaults = Pick<NewVets, 'id' | 'specialties'>;

type VetsFormGroupContent = {
  id: FormControl<IVets['id'] | NewVets['id']>;
  firstname: FormControl<IVets['firstname']>;
  lastname: FormControl<IVets['lastname']>;
  specialties: FormControl<IVets['specialties']>;
};

export type VetsFormGroup = FormGroup<VetsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VetsFormService {
  createVetsFormGroup(vets: VetsFormGroupInput = { id: null }): VetsFormGroup {
    const vetsRawValue = {
      ...this.getFormDefaults(),
      ...vets,
    };
    return new FormGroup<VetsFormGroupContent>({
      id: new FormControl(
        { value: vetsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstname: new FormControl(vetsRawValue.firstname, {
        validators: [Validators.required, Validators.maxLength(32)],
      }),
      lastname: new FormControl(vetsRawValue.lastname, {
        validators: [Validators.required, Validators.maxLength(32)],
      }),
      specialties: new FormControl(vetsRawValue.specialties ?? []),
    });
  }

  getVets(form: VetsFormGroup): IVets | NewVets {
    return form.getRawValue() as IVets | NewVets;
  }

  resetForm(form: VetsFormGroup, vets: VetsFormGroupInput): void {
    const vetsRawValue = { ...this.getFormDefaults(), ...vets };
    form.reset(
      {
        ...vetsRawValue,
        id: { value: vetsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VetsFormDefaults {
    return {
      id: null,
      specialties: [],
    };
  }
}
