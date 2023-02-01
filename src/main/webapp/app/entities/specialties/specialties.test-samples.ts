import { ISpecialties, NewSpecialties } from './specialties.model';

export const sampleWithRequiredData: ISpecialties = {
  id: 54351,
  name: 'orange Mississippi copying',
};

export const sampleWithPartialData: ISpecialties = {
  id: 29102,
  name: 'systemic',
};

export const sampleWithFullData: ISpecialties = {
  id: 59265,
  name: 'International Consultant',
};

export const sampleWithNewData: NewSpecialties = {
  name: 'Bedfordshire',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
