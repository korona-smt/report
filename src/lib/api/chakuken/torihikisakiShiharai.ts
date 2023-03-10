import { ContentCode } from '../../../domain/content';
import { InstitutionCode } from '../../../domain/institution';
import * as date from '../../date';

export type ErrorData = {
  message: string;
}
export type ErrorResponseData = {
  error: ErrorData;
}
export type CreateReportResponseData = {
  filename: string;
};
export type CreateReportReciveParams = {
  type: string;
  dateRangeFrom: string;
  dateRangeTo: string;
  contents: string[];
  institutions: string[];
}
// @todo Reciveの方から差分だけオーバーライドしたい
export type CreateReportSendParams = {
  type: string;
  dateRangeFrom: Date;
  dateRangeTo: Date;
  contents: ContentCode[];
  institutions: InstitutionCode[];
}

export async function createChakukenTorihikisakiShiharaiReport(
  params: CreateReportSendParams
): Promise<CreateReportResponseData> {
  const body = {
    ...params,
    dateRangeFrom: date.formatDate(params.dateRangeFrom),
    dateRangeTo: date.formatDate(params.dateRangeTo),
  }
  return fetch('/api/chakuken/torihikisaki-shiharai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      })
      .then(data => data.json());
}
