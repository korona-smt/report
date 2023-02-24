import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import * as db from '../../../lib/database/service';
import { ChakukenTorihikisakiShiharaiRepository as IChakukenTorihikisakiShiharaiRepository, Detail } from '../../../domain/chakukenTorihikisakiShiharai';
import ChakukenTorihikisakiShiharaiRepository from '../../../lib/database/claimAttend/chakukenTorihikisakiShiharaiRepository';
import * as report from '../../../lib/report/chakukenTorihikisakiShiharai';

export type Data = {
  filename: string;
}

type Error = {
  message: string;
}

type ErrorData = {
  error: Error;
}

type RequestParams = {
  type: string;
  dateRangeFrom: string | null; // 日付
  dateRangeTo: string; // 日付
  contents: string[]; // content_codeのリスト
  institutions: string[]; // institution_codeのリスト
}

// @todo delete
const dummy: Detail[] = [
  { contentCode: '90001', contentName: '作品名あたりテキスト', institutionName: '小牧', rakujitsu: new Date(), showingDate: new Date(), invoiceExists: true, billingDestinationShort: 'ﾎｹﾞﾌｶﾞ', billingDestination: '(株)ﾎｹﾞﾌｶﾞ', ticketCount: 10, ticketAmount: 1000, ticketTypeCode: '', dealType: '', dealCondition: '', fee: 100, billableTicketPrintCount: 10, ticketPrintAmount: 1000, amountbilled: 1000, isOffset: true },
  { contentCode: '90002', contentName: '作品名あたりテキスト２', institutionName: '豊川', rakujitsu: new Date(), showingDate: new Date(), invoiceExists: false, billingDestinationShort: 'ﾎｹﾞﾌｶﾞ', billingDestination: '(株)ﾎｹﾞﾌｶﾞ', ticketCount: 20, ticketAmount: 2000, ticketTypeCode: '', dealType: '', dealCondition: '', fee: 200, billableTicketPrintCount: 20, ticketPrintAmount: 2000, amountbilled: 2000, isOffset: false },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: { message: '404 Not Found' } });
  }

  const params: RequestParams = req.body;
  console.log('params', params);

  // @todo パラメータをデータ取得に使用する

  const conn = await db.connection();
  const repository: IChakukenTorihikisakiShiharaiRepository = new ChakukenTorihikisakiShiharaiRepository(conn);
  const projectId = process.env.SMT_PROJECT_ID ?? '';
  const details = await repository.find({ projectId })
    .then(() => dummy); // @todo delete

  const file = await report.generate(details);
  const parsedPath = path.parse(file);

  res.status(200).json({ filename: parsedPath.base });
}
