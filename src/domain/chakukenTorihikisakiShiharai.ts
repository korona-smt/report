export const AggregateType = {
  DATE_RANGE: 'date-range',
  RAKUJITSU: 'rakujitsu',
} as const;
export type AggregateType = typeof AggregateType[keyof typeof AggregateType];
export function isAggregateType(value: string): value is AggregateType {
  return Object.values(AggregateType).includes(value as AggregateType);
}

export type Detail = {
  contentCode: string;
  contentName: string;
  institutionName: string;
  rakujitsu: Date;
  invoiceExists: string;
  billingDestinationShort: string;
  billingDestination: string;
  ticketCount: number;
  ticketAmount: number;
  dealCondition: string;
  fee: number;
  billableTicketPrintCount: number;
  ticketPrintAmount: number;
  amountbilled: number;
  isOffset: string;
}

export type FindParams = {
  projectId: string;
  type: AggregateType;
  institutions: string[],
  contents: string[],
  dateRangeFrom: Date;
  dateRangeTo: Date;
};

export interface ChakukenTorihikisakiShiharaiRepository {
  find(params: FindParams): Promise<Detail[]>;
}
