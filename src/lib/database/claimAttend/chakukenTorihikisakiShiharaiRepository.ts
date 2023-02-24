import * as mssql from 'mssql';
import * as db from '../service';
import { ChakukenTorihikisakiShiharaiRepository as IRepository, Detail } from '../../../domain/chakukenTorihikisakiShiharai';

// @todo 正式なSQLに直す
const fetchSql = `select
  a.contents_no_group -- 作品コード
  ,b1.contents_name_group_jp -- 作品名
  ,c.institution_name_short -- 劇場名
  ,b.availability_end_date -- 楽日
  ,d.account_date          -- 上映日
  ,case when e.order_status is null then '-' else null end as claim_mark -- 請求書有無
  ,g.category_name_jp      -- 請求先（省略形）
  ,g.claim_name            -- 請求先
  ,f.ticket_count          -- 枚数
  ,f.ticket_account_price  -- 金額
  ,f.account_detail_code   -- 券種コード
  ,a.deal_type             -- 取引タイプ
  ,a.deal_condition        -- 取引内容
  ,case a.deal_type when 1 then f.ticket_account_price/100*a.deal_condition else f.ticket_account_price end as fee_price -- 手数料
  ,case a.print_flag when 1 then f.ticket_count else 0 end as print_count -- 印刷代対象着券枚数
  ,case a.print_flag when 1 then a.print_price else 0 end as print_price  -- 印刷代
  ,9999 as claim_price -- 差引請求額
  ,a.offset_flag           -- 相殺フラグ
from bm_claim_attend a
  inner join bm_contents_group b1
    on b1.project_id=a.project_id and b1.contents_no_group=a.contents_no_group
  inner join bm_contents_group_eventdate b
    on b.project_id=a.project_id and b.contents_no_group=a.contents_no_group
  left join bm_institution c
    on c.project_id=b.project_id and c.institution_code=b.institution_code
  left join bm_contents_eventdate h
    on h.project_id=b.project_id and h.institution_code=b.institution_code and h.contents_no_group=b.contents_no_group
  left join bm_event d
     on d.project_id=h.project_id and d.contents_no=h.contents_no and d.event_status='EventScheduled'
  left join bi_ticket e
     on e.project_id=d.project_id and e.event_id=d.event_id and e.order_status='OrderDelivered'
  left join bi_ticket_price f
     on f.project_id=e.project_id and f.order_no=e.order_no and f.reservation_id=e.reservation_id and f.account_detail_code=a.account_detail_code
  left join bm_category g
     on g.project_id=a.project_id and g.category_code=a.category_code
-- where a.project_id=@project_id
`;

// @todo 仮
type FetchSelectRow = {
  contents_no_group: string;
  contents_name_group_jp: string;
  institution_name_short: string;
  availability_end_date: Date;
  account_date: Date;
  claim_mark: string | null;
  category_name_jp: string;
  claim_name: string;
  ticket_count: number;
  ticket_account_price: number;
  account_detail_code: string;
  deal_type: string;
  deal_condition: string;
  fee_price: number;
  print_count: number;
  print_price: number;
  claim_price: number;
  offset_flag: boolean;
}

export default class ChakukenTorihikisakiShiharaiRepository implements IRepository {
  private readonly conn: db.Connection;

  constructor(conn: db.Connection) {
    this.conn = conn;
  }

  async find(params: { projectId: string; }): Promise<Detail[]> {
    return this.conn.request()
      .input('project_id', mssql.VarChar, params.projectId)
      .query(fetchSql)
      .then((result) => {
        return result.recordset.map((row: FetchSelectRow) => factory(row));
      });
  }
}

function factory(data: FetchSelectRow): Detail {
  return {
    contentCode: data.contents_no_group,
    contentName: data.contents_name_group_jp,
    institutionName: data.institution_name_short,
    rakujitsu: data.availability_end_date,
    invoiceExists: !!data.claim_mark,
    showingDate: data.account_date,
    billingDestinationShort: data.category_name_jp,
    billingDestination: data.claim_name,
    ticketCount: data.ticket_count,
    ticketAmount: data.ticket_account_price,
    ticketTypeCode: data.account_detail_code,
    dealType: data.deal_type,
    dealCondition: data.deal_condition,
    fee: data.fee_price,
    billableTicketPrintCount: data.print_count,
    ticketPrintAmount: data.print_price,
    amountbilled: data.claim_price,
    isOffset: data.offset_flag,
  };
}
