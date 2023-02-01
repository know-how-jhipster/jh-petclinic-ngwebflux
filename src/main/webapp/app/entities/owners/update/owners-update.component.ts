import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { OwnersFormService, OwnersFormGroup } from './owners-form.service';
import { IOwners } from '../owners.model';
import { OwnersService } from '../service/owners.service';

@Component({
  selector: 'jhi-owners-update',
  templateUrl: './owners-update.component.html',
})
export class OwnersUpdateComponent implements OnInit {
  isSaving = false;
  owners: IOwners | null = null;

  editForm: OwnersFormGroup = this.ownersFormService.createOwnersFormGroup();

  constructor(
    protected ownersService: OwnersService,
    protected ownersFormService: OwnersFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ owners }) => {
      this.owners = owners;
      if (owners) {
        this.updateForm(owners);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const owners = this.ownersFormService.getOwners(this.editForm);
    if (owners.id !== null) {
      this.subscribeToSaveResponse(this.ownersService.update(owners));
    } else {
      this.subscribeToSaveResponse(this.ownersService.create(owners));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOwners>>): void {
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

  protected updateForm(owners: IOwners): void {
    this.owners = owners;
    this.ownersFormService.resetForm(this.editForm, owners);
  }
}
