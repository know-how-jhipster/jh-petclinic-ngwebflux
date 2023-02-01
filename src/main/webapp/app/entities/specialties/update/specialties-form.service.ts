import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISpecialties, NewSpecialties } from '../specialties.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISpecialties for edit and NewSpecialtiesFormGroupInput for create.
 */
type SpecialtiesFormGroupInput = ISpecialties | PartialWithRequiredKeyOf<NewSpecialties>;

type SpecialtiesFormDefaults = Pick<NewSpecialties, 'id' | 'vets'>;

type SpecialtiesFormGroupContent = {
  id: FormControl<ISpecialties['id'] | NewSpecialties['id']>;
  name: FormControl<ISpecialties['name']>;
  vets: FormControl<ISpecialties['vets']>;
};

export type SpecialtiesFormGroup = FormGroup<SpecialtiesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SpecialtiesFormService {
  createSpecialtiesFormGroup(specialties: SpecialtiesFormGroupInput = { id: null }): SpecialtiesFormGroup {
    const specialtiesRawValue = {
      ...this.getFormDefaults(),
      ...specialties,
    };
    return new FormGroup<SpecialtiesFormGroupContent>({
      id: new FormControl(
        { value: specialtiesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(specialtiesRawValue.name, {
        validators: [Validators.required, Validators.maxLength(32)],
      }),
      vets: new FormControl(specialtiesRawValue.vets ?? []),
    });
  }

  getSpecialties(form: SpecialtiesFormGroup): ISpecialties | NewSpecialties {
    return form.getRawValue() as ISpecialties | NewSpecialties;
  }

  resetForm(form: SpecialtiesFormGroup, specialties: SpecialtiesFormGroupInput): void {
    const specialtiesRawValue = { ...this.getFormDefaults(), ...specialties };
    form.reset(
      {
        ...specialtiesRawValue,
        id: { value: specialtiesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SpecialtiesFormDefaults {
    return {
      id: null,
      vets: [],
    };
  }
}
