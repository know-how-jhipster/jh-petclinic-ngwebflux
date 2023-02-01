import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VetsFormService, VetsFormGroup } from './vets-form.service';
import { IVets } from '../vets.model';
import { VetsService } from '../service/vets.service';

@Component({
  selector: 'jhi-vets-update',
  templateUrl: './vets-update.component.html',
})
export class VetsUpdateComponent implements OnInit {
  isSaving = false;
  vets: IVets | null = null;

  editForm: VetsFormGroup = this.vetsFormService.createVetsFormGroup();

  constructor(protected vetsService: VetsService, protected vetsFormService: VetsFormService, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vets }) => {
      this.vets = vets;
      if (vets) {
        this.updateForm(vets);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vets = this.vetsFormService.getVets(this.editForm);
    if (vets.id !== null) {
      this.subscribeToSaveResponse(this.vetsService.update(vets));
    } else {
      this.subscribeToSaveResponse(this.vetsService.create(vets));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVets>>): void {
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

  protected updateForm(vets: IVets): void {
    this.vets = vets;
    this.vetsFormService.resetForm(this.editForm, vets);
  }
}
