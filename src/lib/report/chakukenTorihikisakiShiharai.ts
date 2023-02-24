import fs from "fs";
import os from "os";
import path from "path";
import ExcelJS from "exceljs";
import { v4 as uuidv4 } from 'uuid';
import { Detail } from '../../domain/chakukenTorihikisakiShiharai';

// @todo 後々リファクタリングする

type RowData = {
  primaryCode: string;
  secondaryCode: string;
  movieName: string;
  theaterName: string;
  rakujitsu: Date;
  invoice: string;
  billingDestinationShort: string;
  billingDestination: string;
  count: number;
  amount: number;
  feePercent: string;
  fee: number;
  printCostTargetCount: number;
  printCost: number;
  amountbilled: number;
  offset: string;
  depositDate: string;
  transferFee: number;
  remarks: string;
}

type Column = Partial<ExcelJS.Column> & {
  key: keyof RowData;
}

export const tempDir = path.join(os.tmpdir(), "app", "report");
const templateFile = './resources/reports/chakuken-torihikisaki-shiharai.xlsx';
const sheetName = '着券取引先支払';
const columns: Column[] = [
  { key: 'primaryCode' },
  { key: 'secondaryCode' },
  { key: 'movieName' },
  { key: 'theaterName' },
  { key: 'rakujitsu' },
  { key: 'invoice' },
  { key: 'billingDestinationShort' },
  { key: 'billingDestination' },
  { key: 'count' },
  { key: 'amount' },
  { key: 'feePercent' },
  { key: 'fee' },
  { key: 'printCostTargetCount' },
  { key: 'printCost' },
  { key: 'amountbilled' },
  { key: 'offset' },
  { key: 'depositDate' },
  { key: 'transferFee' },
  { key: 'remarks' },
];

export async function generate(details: Detail[]) {
  const wb = await readXlsx(templateFile);
  const ws = wb.getWorksheet(sheetName);
  ws.columns = columns;

  details.forEach(detail => {
    ws.addRow(factoryRow(detail), "i+");
  });

  ws.spliceRows(2, 1); // スタイルテンプレート行を削除

  const filename = uuidv4() + '.xlsx';

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const file = path.join(tempDir, filename);

  await wb.xlsx.writeFile(file);

  return file;
}

async function readXlsx(file: string) {
  const wb = new ExcelJS.Workbook();
  return wb.xlsx.readFile(file);
}

function factoryRow(detail: Detail): RowData {
  return {
    primaryCode: detail.contentCode,
    secondaryCode: '0',
    movieName: detail.contentName,
    theaterName: detail.institutionName,
    rakujitsu: detail.rakujitsu,
    invoice: detail.invoiceExists ? 'Y' : 'n',
    billingDestinationShort: detail.billingDestinationShort,
    billingDestination: detail.billingDestination,
    count: detail.ticketCount,
    amount: detail.ticketAmount,
    feePercent: '-',
    fee: detail.fee,
    printCostTargetCount: detail.ticketCount,
    printCost: detail.ticketAmount,
    amountbilled: detail.amountbilled,
    offset: detail.isOffset ? 'Y' : 'n',
    depositDate: '',
    transferFee: 0,
    remarks: '',
  }
}
