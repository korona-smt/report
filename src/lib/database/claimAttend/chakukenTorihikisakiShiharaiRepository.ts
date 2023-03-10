import * as mssql from 'mssql';
import * as db from '../service';
import { ChakukenTorihikisakiShiharaiRepository as IRepository, FindParams, Detail, AggregateType } from '../../../domain/chakukenTorihikisakiShiharai';

// @todo b.availability_end_dateのエラー
// @todo 作品と施設の条件
const fetchSql = `
select
  temp.contents_no_group                               -- 作品コード
  ,max(temp.contents_name_group_jp) contents_name_group -- 作品名
  ,max(temp.institution_name_short) as institution_name -- 劇場名
--  ,b.availability_end_date -- 楽日(楽日指定)
  , '2023-03-01' as availability_end_date -- エラーが出るので仮
  ,max(temp.account_date) as account_date        -- 楽日(期間指定)
  ,case isnull(sum(temp.amount),0) when 0 then '-' else null end as claim_mark -- 請求書有無
  ,max(temp.category_name_jp) as category_name   -- 請求先（省略形）
  ,max(temp.claim_name) as claim_name            -- 請求先
  ,sum(temp.ticket_count) as ticket_count        -- 枚数
  ,sum(temp.amount) as amount  -- 金額
  ,max(temp.deal_condition) as deal_condition -- 取引内容
  ,case max(temp.deal_type) when 1 then round(sum(temp.amount)*(max(temp.deal_condition)/100),0) else max(temp.deal_condition)*sum(temp.ticket_count) end as fee_price -- 手数料
  ,case max(temp.print_flag) when 1 then sum(temp.ticket_count) else 0 end as print_count -- 印刷代対象着券枚数
  ,case max(temp.print_flag) when 1 then sum(temp.ticket_count)*max(print_price) else 0 end as print_price  -- 印刷代
  ,sum(temp.amount)
    - (case max(temp.deal_type) when 1 then round(sum(temp.amount)*(max(temp.deal_condition)/100),0) else max(temp.deal_condition)*sum(temp.ticket_count) end)
    + (case max(temp.print_flag) when 1 then sum(temp.ticket_count)*max(print_price) else 0 end)
    as claim_price -- 差引請求額
  ,max(temp.offset_flag) as offset_flag    -- 相殺フラグ
from (
  select
    a.contents_no_group -- 作品コード
    ,b1.contents_name_group_jp -- 作品名
    ,b.institution_code       -- 劇場コード
    ,c.institution_name_short -- 劇場名
    ,b.availability_end_date -- 楽日
    ,e.account_date          -- 上映日
    ,g.category_name_jp      -- 請求先（省略形）
    ,g.claim_name            -- 請求先
    ,e.ticket_count          -- 枚数
    ,e.ticket_count*e.ticket_account_price as amount  -- 金額
    ,e.account_detail_code   -- 券種コード
    ,a.deal_type             -- 取引タイプ
    ,a.deal_condition        -- 取引内容
    ,a.print_flag            -- プリントフラグ
    ,a.print_price           -- 印刷代
    ,a.offset_flag           -- 相殺フラグ
  from bm_claim_attend a
    inner join bm_contents_group b1
      on b1.project_id=a.project_id and b1.contents_no_group=a.contents_no_group
    inner join bm_contents_group_eventdate b
      on b.project_id=a.project_id and b.contents_no_group=a.contents_no_group
    left join bm_institution c
      on c.project_id=b.project_id and c.institution_code=b.institution_code
    left join (select distinct project_id,contents_no_group,contents_no_seiseki from bm_contents_version) d
      on d.project_id=a.project_id and d.contents_no_group=a.contents_no_group
    left join wk_result_summary e
      on e.project_id=d.project_id and e.contents_no_version=d.contents_no_seiseki and e.account_detail_code=a.account_detail_code and e.institution_code=b.institution_code
    left join bm_category g
      on g.project_id=a.project_id and g.category_code=a.category_code
    where a.project_id=@project_id
--      and b.institution_code in(@institutions)
--      and a.contents_no_group in(@contents)
      and e.account_date>=dateadd(hour,-9,@account_date_from)
      and e.account_date<=dateadd(hour,-9,@account_date_to)
) temp
group by
    temp.contents_no_group
   ,temp.institution_code
order by
    temp.contents_no_group
   ,temp.institution_code
`;

// @todo 仮
type FetchSelectRow = {
  contents_no_group: string;
  contents_name_group: string;
  institution_name: string;
  availability_end_date: Date;
  account_date: Date;
  claim_mark: string | null;
  category_name_jp: string;
  claim_name: string;
  ticket_count: number;
  amount: number;
  deal_condition: string;
  fee_price: number;
  print_count: number;
  print_price: number;
  claim_price: number;
  offset_flag: string;
}

export default class ChakukenTorihikisakiShiharaiRepository implements IRepository {
  private readonly conn: db.Connection;

  constructor(conn: db.Connection) {
    this.conn = conn;
  }

  async find(params: FindParams): Promise<Detail[]> {
    return this.conn.request()
      .input('project_id', mssql.VarChar, params.projectId)
      .input('account_date_from', mssql.DateTime, params.dateRangeFrom)
      .input('account_date_to', mssql.DateTime, params.dateRangeTo)
      .query(fetchSql)
      .then((result: mssql.IResult<FetchSelectRow>) => {
        return result.recordset.map((row) => factory(row, params.type));
      });
  }
}

function factory(data: FetchSelectRow, type: AggregateType): Detail {
  return {
    contentCode: data.contents_no_group,
    contentName: data.contents_name_group,
    institutionName: data.institution_name,
    rakujitsu: type === AggregateType.RAKUJITSU ? data.availability_end_date : data.account_date,
    invoiceExists: data.claim_mark || '',
    billingDestinationShort: data.category_name_jp,
    billingDestination: data.claim_name,
    ticketCount: data.ticket_count,
    ticketAmount: data.amount,
    dealCondition: data.deal_condition,
    fee: data.fee_price,
    billableTicketPrintCount: data.print_count,
    ticketPrintAmount: data.print_price,
    amountbilled: data.claim_price,
    isOffset: data.offset_flag,
  };
}
