import dayjs from 'dayjs/esm';
import { ITypes } from 'app/entities/types/types.model';
import { IOwners } from 'app/entities/owners/owners.model';

export interface IPets {
  id: number;
  name?: string | null;
  birthdate?: dayjs.Dayjs | null;
  type?: Pick<ITypes, 'id'> | null;
  owner?: Pick<IOwners, 'id'> | null;
}

export type NewPets = Omit<IPets, 'id'> & { id: null };
