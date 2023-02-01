import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VetsFormService } from './vets-form.service';
import { VetsService } from '../service/vets.service';
import { IVets } from '../vets.model';

import { VetsUpdateComponent } from './vets-update.component';

describe('Vets Management Update Component', () => {
  let comp: VetsUpdateComponent;
  let fixture: ComponentFixture<VetsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vetsFormService: VetsFormService;
  let vetsService: VetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VetsUpdateComponent],
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
      .overrideTemplate(VetsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VetsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vetsFormService = TestBed.inject(VetsFormService);
    vetsService = TestBed.inject(VetsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const vets: IVets = { id: 456 };

      activatedRoute.data = of({ vets });
      comp.ngOnInit();

      expect(comp.vets).toEqual(vets);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVets>>();
      const vets = { id: 123 };
      jest.spyOn(vetsFormService, 'getVets').mockReturnValue(vets);
      jest.spyOn(vetsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vets });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vets }));
      saveSubject.complete();

      // THEN
      expect(vetsFormService.getVets).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vetsService.update).toHaveBeenCalledWith(expect.objectContaining(vets));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVets>>();
      const vets = { id: 123 };
      jest.spyOn(vetsFormService, 'getVets').mockReturnValue({ id: null });
      jest.spyOn(vetsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vets: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vets }));
      saveSubject.complete();

      // THEN
      expect(vetsFormService.getVets).toHaveBeenCalled();
      expect(vetsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVets>>();
      const vets = { id: 123 };
      jest.spyOn(vetsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vets });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vetsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
