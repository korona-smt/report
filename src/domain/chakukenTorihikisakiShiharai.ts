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
  showingDate: Date;
  invoiceExists: boolean;
  billingDestinationShort: string;
  billingDestination: string;
  ticketCount: number;
  ticketAmount: number;
  ticketTypeCode: string;
  dealType: string;
  dealCondition: string;
  fee: number;
  billableTicketPrintCount: number;
  ticketPrintAmount: number;
  amountbilled: number;
  isOffset: boolean;
}

export interface ChakukenTorihikisakiShiharaiRepository {
  find(params: { projectId: string }): Promise<Detail[]>;
}
