import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SpecialtiesService } from '../service/specialties.service';

import { SpecialtiesComponent } from './specialties.component';

describe('Specialties Management Component', () => {
  let comp: SpecialtiesComponent;
  let fixture: ComponentFixture<SpecialtiesComponent>;
  let service: SpecialtiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'specialties', component: SpecialtiesComponent }]), HttpClientTestingModule],
      declarations: [SpecialtiesComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SpecialtiesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpecialtiesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SpecialtiesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.specialties?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to specialtiesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSpecialtiesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSpecialtiesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
