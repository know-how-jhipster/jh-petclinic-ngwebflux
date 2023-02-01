import { IOwners, NewOwners } from './owners.model';

export const sampleWithRequiredData: IOwners = {
  id: 23402,
  firstname: 'Keyboard Assistant',
  lastname: 'optimizing',
  address: 'parse Buckinghamshire Kids',
  telephone: '(870) 202-8336',
};

export const sampleWithPartialData: IOwners = {
  id: 87952,
  firstname: 'Toys',
  lastname: 'Bacon structure content',
  address: 'Security',
  city: 'Hestershire',
  telephone: '1-476-661-9378',
};

export const sampleWithFullData: IOwners = {
  id: 53434,
  firstname: 'Representative Table',
  lastname: 'Future Account',
  address: 'Account Computer',
  city: 'Sierra Vista',
  telephone: '(533) 855-6030',
};

export const sampleWithNewData: NewOwners = {
  firstname: 'visionary violet',
  lastname: 'protocol synergy',
  address: 'Massachusetts',
  telephone: '708.531.0761 x315',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
