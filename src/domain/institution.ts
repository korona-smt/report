export type InstitutionCode = string;
export type Institution = {
  code: InstitutionCode;
  name: string;
}
export type Institutions = Map<InstitutionCode, Institution>;

export interface InstitutionRepository {
  find(params: { projectId: string }): Promise<Institutions>;
}
