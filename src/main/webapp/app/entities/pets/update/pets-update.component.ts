import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PetsFormService, PetsFormGroup } from './pets-form.service';
import { IPets } from '../pets.model';
import { PetsService } from '../service/pets.service';
import { ITypes } from 'app/entities/types/types.model';
import { TypesService } from 'app/entities/types/service/types.service';
import { IOwners } from 'app/entities/owners/owners.model';
import { OwnersService } from 'app/entities/owners/service/owners.service';

@Component({
  selector: 'jhi-pets-update',
  templateUrl: './pets-update.component.html',
})
export class PetsUpdateComponent implements OnInit {
  isSaving = false;
  pets: IPets | null = null;

  typesSharedCollection: ITypes[] = [];
  ownersSharedCollection: IOwners[] = [];

  editForm: PetsFormGroup = this.petsFormService.createPetsFormGroup();

  constructor(
    protected petsService: PetsService,
    protected petsFormService: PetsFormService,
    protected typesService: TypesService,
    protected ownersService: OwnersService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTypes = (o1: ITypes | null, o2: ITypes | null): boolean => this.typesService.compareTypes(o1, o2);

  compareOwners = (o1: IOwners | null, o2: IOwners | null): boolean => this.ownersService.compareOwners(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pets }) => {
      this.pets = pets;
      if (pets) {
        this.updateForm(pets);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pets = this.petsFormService.getPets(this.editForm);
    if (pets.id !== null) {
      this.subscribeToSaveResponse(this.petsService.update(pets));
    } else {
      this.subscribeToSaveResponse(this.petsService.create(pets));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPets>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pets: IPets): void {
    this.pets = pets;
    this.petsFormService.resetForm(this.editForm, pets);

    this.typesSharedCollection = this.typesService.addTypesToCollectionIfMissing<ITypes>(this.typesSharedCollection, pets.type);
    this.ownersSharedCollection = this.ownersService.addOwnersToCollectionIfMissing<IOwners>(this.ownersSharedCollection, pets.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.typesService
      .query()
      .pipe(map((res: HttpResponse<ITypes[]>) => res.body ?? []))
      .pipe(map((types: ITypes[]) => this.typesService.addTypesToCollectionIfMissing<ITypes>(types, this.pets?.type)))
      .subscribe((types: ITypes[]) => (this.typesSharedCollection = types));

    this.ownersService
      .query()
      .pipe(map((res: HttpResponse<IOwners[]>) => res.body ?? []))
      .pipe(map((owners: IOwners[]) => this.ownersService.addOwnersToCollectionIfMissing<IOwners>(owners, this.pets?.owner)))
      .subscribe((owners: IOwners[]) => (this.ownersSharedCollection = owners));
  }
}
