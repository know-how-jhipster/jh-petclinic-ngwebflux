export interface IOwners {
  id: number;
  firstname?: string | null;
  lastname?: string | null;
  address?: string | null;
  city?: string | null;
  telephone?: string | null;
}

export type NewOwners = Omit<IOwners, 'id'> & { id: null };
