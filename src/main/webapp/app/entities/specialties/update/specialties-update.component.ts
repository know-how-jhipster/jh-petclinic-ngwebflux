import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SpecialtiesFormService, SpecialtiesFormGroup } from './specialties-form.service';
import { ISpecialties } from '../specialties.model';
import { SpecialtiesService } from '../service/specialties.service';
import { IVets } from 'app/entities/vets/vets.model';
import { VetsService } from 'app/entities/vets/service/vets.service';

@Component({
  selector: 'jhi-specialties-update',
  templateUrl: './specialties-update.component.html',
})
export class SpecialtiesUpdateComponent implements OnInit {
  isSaving = false;
  specialties: ISpecialties | null = null;

  vetsSharedCollection: IVets[] = [];

  editForm: SpecialtiesFormGroup = this.specialtiesFormService.createSpecialtiesFormGroup();

  constructor(
    protected specialtiesService: SpecialtiesService,
    protected specialtiesFormService: SpecialtiesFormService,
    protected vetsService: VetsService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVets = (o1: IVets | null, o2: IVets | null): boolean => this.vetsService.compareVets(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ specialties }) => {
      this.specialties = specialties;
      if (specialties) {
        this.updateForm(specialties);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const specialties = this.specialtiesFormService.getSpecialties(this.editForm);
    if (specialties.id !== null) {
      this.subscribeToSaveResponse(this.specialtiesService.update(specialties));
    } else {
      this.subscribeToSaveResponse(this.specialtiesService.create(specialties));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpecialties>>): void {
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

  protected updateForm(specialties: ISpecialties): void {
    this.specialties = specialties;
    this.specialtiesFormService.resetForm(this.editForm, specialties);

    this.vetsSharedCollection = this.vetsService.addVetsToCollectionIfMissing<IVets>(
      this.vetsSharedCollection,
      ...(specialties.vets ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vetsService
      .query()
      .pipe(map((res: HttpResponse<IVets[]>) => res.body ?? []))
      .pipe(map((vets: IVets[]) => this.vetsService.addVetsToCollectionIfMissing<IVets>(vets, ...(this.specialties?.vets ?? []))))
      .subscribe((vets: IVets[]) => (this.vetsSharedCollection = vets));
  }
}
