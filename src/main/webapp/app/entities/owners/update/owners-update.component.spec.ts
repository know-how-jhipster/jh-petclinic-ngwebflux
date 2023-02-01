import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OwnersFormService } from './owners-form.service';
import { OwnersService } from '../service/owners.service';
import { IOwners } from '../owners.model';

import { OwnersUpdateComponent } from './owners-update.component';

describe('Owners Management Update Component', () => {
  let comp: OwnersUpdateComponent;
  let fixture: ComponentFixture<OwnersUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ownersFormService: OwnersFormService;
  let ownersService: OwnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OwnersUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OwnersUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OwnersUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ownersFormService = TestBed.inject(OwnersFormService);
    ownersService = TestBed.inject(OwnersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const owners: IOwners = { id: 456 };

      activatedRoute.data = of({ owners });
      comp.ngOnInit();

      expect(comp.owners).toEqual(owners);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOwners>>();
      const owners = { id: 123 };
      jest.spyOn(ownersFormService, 'getOwners').mockReturnValue(owners);
      jest.spyOn(ownersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ owners });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: owners }));
      saveSubject.complete();

      // THEN
      expect(ownersFormService.getOwners).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ownersService.update).toHaveBeenCalledWith(expect.objectContaining(owners));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOwners>>();
      const owners = { id: 123 };
      jest.spyOn(ownersFormService, 'getOwners').mockReturnValue({ id: null });
      jest.spyOn(ownersService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ owners: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: owners }));
      saveSubject.complete();

      // THEN
      expect(ownersFormService.getOwners).toHaveBeenCalled();
      expect(ownersService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOwners>>();
      const owners = { id: 123 };
      jest.spyOn(ownersService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ owners });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ownersService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
