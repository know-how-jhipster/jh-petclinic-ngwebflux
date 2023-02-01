import dayjs from 'dayjs/esm';

import { IPets, NewPets } from './pets.model';

export const sampleWithRequiredData: IPets = {
  id: 82218,
  name: 'AGP Quality',
  birthdate: dayjs('2023-01-31'),
};

export const sampleWithPartialData: IPets = {
  id: 24693,
  name: 'transmit',
  birthdate: dayjs('2023-01-31'),
};

export const sampleWithFullData: IPets = {
  id: 67210,
  name: 'Rubber circuit user-centric',
  birthdate: dayjs('2023-01-31'),
};

export const sampleWithNewData: NewPets = {
  name: 'moratorium',
  birthdate: dayjs('2023-01-31'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
