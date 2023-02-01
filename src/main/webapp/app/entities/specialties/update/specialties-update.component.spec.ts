import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SpecialtiesFormService } from './specialties-form.service';
import { SpecialtiesService } from '../service/specialties.service';
import { ISpecialties } from '../specialties.model';
import { IVets } from 'app/entities/vets/vets.model';
import { VetsService } from 'app/entities/vets/service/vets.service';

import { SpecialtiesUpdateComponent } from './specialties-update.component';

describe('Specialties Management Update Component', () => {
  let comp: SpecialtiesUpdateComponent;
  let fixture: ComponentFixture<SpecialtiesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let specialtiesFormService: SpecialtiesFormService;
  let specialtiesService: SpecialtiesService;
  let vetsService: VetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SpecialtiesUpdateComponent],
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
      .overrideTemplate(SpecialtiesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpecialtiesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    specialtiesFormService = TestBed.inject(SpecialtiesFormService);
    specialtiesService = TestBed.inject(SpecialtiesService);
    vetsService = TestBed.inject(VetsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Vets query and add missing value', () => {
      const specialties: ISpecialties = { id: 456 };
      const vets: IVets[] = [{ id: 67269 }];
      specialties.vets = vets;

      const vetsCollection: IVets[] = [{ id: 62972 }];
      jest.spyOn(vetsService, 'query').mockReturnValue(of(new HttpResponse({ body: vetsCollection })));
      const additionalVets = [...vets];
      const expectedCollection: IVets[] = [...additionalVets, ...vetsCollection];
      jest.spyOn(vetsService, 'addVetsToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      expect(vetsService.query).toHaveBeenCalled();
      expect(vetsService.addVetsToCollectionIfMissing).toHaveBeenCalledWith(vetsCollection, ...additionalVets.map(expect.objectContaining));
      expect(comp.vetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const specialties: ISpecialties = { id: 456 };
      const vet: IVets = { id: 90600 };
      specialties.vets = [vet];

      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      expect(comp.vetsSharedCollection).toContain(vet);
      expect(comp.specialties).toEqual(specialties);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpecialties>>();
      const specialties = { id: 123 };
      jest.spyOn(specialtiesFormService, 'getSpecialties').mockReturnValue(specialties);
      jest.spyOn(specialtiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: specialties }));
      saveSubject.complete();

      // THEN
      expect(specialtiesFormService.getSpecialties).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(specialtiesService.update).toHaveBeenCalledWith(expect.objectContaining(specialties));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpecialties>>();
      const specialties = { id: 123 };
      jest.spyOn(specialtiesFormService, 'getSpecialties').mockReturnValue({ id: null });
      jest.spyOn(specialtiesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialties: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: specialties }));
      saveSubject.complete();

      // THEN
      expect(specialtiesFormService.getSpecialties).toHaveBeenCalled();
      expect(specialtiesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpecialties>>();
      const specialties = { id: 123 };
      jest.spyOn(specialtiesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ specialties });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(specialtiesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVets', () => {
      it('Should forward to vetsService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vetsService, 'compareVets');
        comp.compareVets(entity, entity2);
        expect(vetsService.compareVets).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
