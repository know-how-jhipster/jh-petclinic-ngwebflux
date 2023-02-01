import { ISpecialties } from 'app/entities/specialties/specialties.model';

export interface IVets {
  id: number;
  firstname?: string | null;
  lastname?: string | null;
  specialties?: Pick<ISpecialties, 'id'>[] | null;
}

export type NewVets = Omit<IVets, 'id'> & { id: null };
