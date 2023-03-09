import { ContentCode } from '../../../domain/content';
import { InstitutionCode } from '../../../domain/institution';

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
  dateRangeFrom: string | null;
  dateRangeTo: string;
  contents: string[];
  institutions: string[];
}
// @todo Reciveの方から差分だけオーバーライドしたい
export type CreateReportSendParams = {
  type: string;
  dateRangeFrom: Date | null;
  dateRangeTo: Date;
  contents: ContentCode[];
  institutions: InstitutionCode[];
}

export async function createChakukenTorihikisakiShiharaiReport(
  params: CreateReportSendParams
): Promise<CreateReportResponseData> {
  return fetch('/api/chakuken/torihikisaki-shiharai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
      })
      .then(data => data.json());
}
