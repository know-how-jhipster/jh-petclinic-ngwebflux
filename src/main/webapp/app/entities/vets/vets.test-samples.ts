import { IVets, NewVets } from './vets.model';

export const sampleWithRequiredData: IVets = {
  id: 87194,
  firstname: 'action-items Metal',
  lastname: '24 Central Massachusetts',
};

export const sampleWithPartialData: IVets = {
  id: 81459,
  firstname: 'Trail Shoes',
  lastname: 'engage networks Loan',
};

export const sampleWithFullData: IVets = {
  id: 96927,
  firstname: 'blue channels Bedfordshire',
  lastname: 'navigate',
};

export const sampleWithNewData: NewVets = {
  firstname: 'Meadow Reverse-engineered Music',
  lastname: 'Borders intuitive Malaysia',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
