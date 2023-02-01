import { IVets } from 'app/entities/vets/vets.model';

export interface ISpecialties {
  id: number;
  name?: string | null;
  vets?: Pick<IVets, 'id'>[] | null;
}

export type NewSpecialties = Omit<ISpecialties, 'id'> & { id: null };
