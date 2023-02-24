import * as mssql from 'mssql';
import * as db from '../service';
import { InstitutionRepository as IInstitutionRepository, Institutions } from '../../../domain/institution';

const fetchSql = `SELECT
  [institution_code],
  [institution_name_short],
  [institution_name]
FROM [bm_institution]
WHERE [project_id]=@project_id
ORDER BY [institution_code]`;

type FetchSelectRow = {
  institution_code: string;
  institution_name_short: string;
  institution_name: string;
}

export default class InstitutionRepository implements IInstitutionRepository {
  private readonly conn: db.Connection;

  constructor(conn: db.Connection) {
    this.conn = conn;
  }

  async find(params: { projectId: string; }): Promise<Institutions> {
    return this.conn.request()
      .input('project_id', mssql.VarChar, params.projectId)
      .query(fetchSql)
      .then((result) => {
        const institutions = new Map();
        result.recordset.forEach((row: FetchSelectRow) => {
          institutions.set(row.institution_code, {
            code: row.institution_code,
            name: row.institution_name,
          });
        });
        return institutions;
      });
  }
}
