import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISpecialties } from '../specialties.model';
import { SpecialtiesService } from '../service/specialties.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './specialties-delete-dialog.component.html',
})
export class SpecialtiesDeleteDialogComponent {
  specialties?: ISpecialties;

  constructor(protected specialtiesService: SpecialtiesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.specialtiesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
