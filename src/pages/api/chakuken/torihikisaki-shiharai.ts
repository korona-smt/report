import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import * as db from '../../../lib/database/service';
import { ChakukenTorihikisakiShiharaiRepository as IChakukenTorihikisakiShiharaiRepository, FindParams, isAggregateType } from '../../../domain/chakukenTorihikisakiShiharai';
import ChakukenTorihikisakiShiharaiRepository from '../../../lib/database/claimAttend/chakukenTorihikisakiShiharaiRepository';
import * as report from '../../../lib/report/chakukenTorihikisakiShiharai';
import { CreateReportReciveParams, CreateReportResponseData, ErrorResponseData } from '../../../lib/api/chakuken/torihikisakiShiharai';
import * as date from '../../../lib/date';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateReportResponseData | ErrorResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(404).json({ error: { message: '404 Not Found' } });
  }

  // @todo バリデーション
  const params: CreateReportReciveParams = req.body;
  console.log('params', params);

  const conn = await db.connection();
  const repository = createRepository(conn);

  const projectId = process.env.SMT_PROJECT_ID ?? '';
  const findParams = factoryFindParams(params, projectId);
  console.log('findParams', findParams);

  const details = await repository.find(findParams);
  console.log('details', details);

  const file = await report.generate(details);
  const parsedPath = path.parse(file);

  res.status(200).json({ filename: parsedPath.base });
}

function createRepository(conn: db.Connection): IChakukenTorihikisakiShiharaiRepository {
  return new ChakukenTorihikisakiShiharaiRepository(conn);
}

function factoryFindParams(params: CreateReportReciveParams, projectId: string): FindParams {
  if (!isAggregateType(params.type)) {
    throw new Error('Invalid type.');
  }
  return {
    projectId,
    type: params.type,
    institutions: params.institutions,
    contents: params.contents,
    dateRangeFrom: date.parseDate(params.dateRangeFrom),
    dateRangeTo: date.parseDate(params.dateRangeTo),
  };
}
