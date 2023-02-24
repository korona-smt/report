import * as mssql from 'mssql';
import * as db from '../service';
import { ContentRepository as IContentRepository, Contents } from '../../../domain/content';

// @todo 正式なSQLに直す
const fetchSql = `select
  a.[contents_no_group]
 ,max(a.[contents_name_group_jp]) as contents_name_group_jp
from [bm_contents_group] a
left join [bm_contents_group_eventdate] b
 on b.[project_id]=a.[project_id] and b.[contents_no_group]=a.[contents_no_group]
where a.[project_id]=@project_id
group by
  a.[contents_no_group]
`;

type FetchSelectRow = {
  contents_no_group: string;
  contents_name_group_jp: string;
}

export default class ContentRepository implements IContentRepository {
  private readonly conn: db.Connection;

  constructor(conn: db.Connection) {
    this.conn = conn;
  }

  async find(params: { projectId: string; }): Promise<Contents> {
    return this.conn.request()
      .input('project_id', mssql.VarChar, params.projectId)
      .query(fetchSql)
      .then((result) => {
        const contents = new Map();
        result.recordset.forEach((row: FetchSelectRow) => {
          contents.set(row.contents_no_group, {
            code: row.contents_no_group,
            name: row.contents_name_group_jp,
          });
        });
        return contents;
      });
  }
}
