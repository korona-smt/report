import fs from "fs";
import path from "path";
import contentDisposition from "content-disposition";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import * as report from '../../../lib/report/chakukenTorihikisakiShiharai';

type Props = {};

export async function getServerSideProps({ query, res }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  // @todo 仮のファイル名
  const dlFilename = "着券取引先支払_yyyymmddhhiiss.xlsx";

  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", contentDisposition(dlFilename));

  const baseDir = report.tempDir;
  const filename = query.filename as string;
  const file = path.join(baseDir, filename);

  const readStream = fs.createReadStream(file);
  await new Promise((resolve) => {
    readStream.pipe(res);
    readStream.on("end", resolve);
  })

  return {
    props: {},
  };
}

export default function Download() {}
