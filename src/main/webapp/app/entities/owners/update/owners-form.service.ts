import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IOwners, NewOwners } from '../owners.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOwners for edit and NewOwnersFormGroupInput for create.
 */
type OwnersFormGroupInput = IOwners | PartialWithRequiredKeyOf<NewOwners>;

type OwnersFormDefaults = Pick<NewOwners, 'id'>;

type OwnersFormGroupContent = {
  id: FormControl<IOwners['id'] | NewOwners['id']>;
  firstname: FormControl<IOwners['firstname']>;
  lastname: FormControl<IOwners['lastname']>;
  address: FormControl<IOwners['address']>;
  city: FormControl<IOwners['city']>;
  telephone: FormControl<IOwners['telephone']>;
};

export type OwnersFormGroup = FormGroup<OwnersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OwnersFormService {
  createOwnersFormGroup(owners: OwnersFormGroupInput = { id: null }): OwnersFormGroup {
    const ownersRawValue = {
      ...this.getFormDefaults(),
      ...owners,
    };
    return new FormGroup<OwnersFormGroupContent>({
      id: new FormControl(
        { value: ownersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstname: new FormControl(ownersRawValue.firstname, {
        validators: [Validators.required, Validators.maxLength(32)],
      }),
      lastname: new FormControl(ownersRawValue.lastname, {
        validators: [Validators.required, Validators.maxLength(32)],
      }),
      address: new FormControl(ownersRawValue.address, {
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      city: new FormControl(ownersRawValue.city, {
        validators: [Validators.maxLength(32)],
      }),
      telephone: new FormControl(ownersRawValue.telephone, {
        validators: [Validators.required, Validators.maxLength(20)],
      }),
    });
  }

  getOwners(form: OwnersFormGroup): IOwners | NewOwners {
    return form.getRawValue() as IOwners | NewOwners;
  }

  resetForm(form: OwnersFormGroup, owners: OwnersFormGroupInput): void {
    const ownersRawValue = { ...this.getFormDefaults(), ...owners };
    form.reset(
      {
        ...ownersRawValue,
        id: { value: ownersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): OwnersFormDefaults {
    return {
      id: null,
    };
  }
}
