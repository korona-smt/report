import { FC, ReactNode, useState, useEffect } from 'react';
import { GetServerSidePropsResult } from 'next';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Layout from '../../../components/layouts/admin/layout';
import Button from '../../../components/atoms/button';
import Confirm from '../../../components/pages/chakuken/torihikisaki-shiharai/index/confirm';
import SelectContentForm from '../../../components/pages/chakuken/torihikisaki-shiharai/index/selectContentForm';
import SelectDateRangeForm from '../../../components/pages/chakuken/torihikisaki-shiharai/index/selectDateRangeForm';
import SelectInstitutionForm from '../../../components/pages/chakuken/torihikisaki-shiharai/index/selectInstitutionForm';
import Stepper from '../../../components/pages/chakuken/torihikisaki-shiharai/index/stepper';
import { AggregateType } from '../../../domain/chakukenTorihikisakiShiharai';
import { ContentCode, Contents } from '../../../domain/content';
import { Institutions, Institution, InstitutionCode } from '../../../domain/institution';
import { fetchContents } from '../../../lib/api/contents';
import { createChakukenTorihikisakiShiharaiReport } from '../../../lib/api/chakuken/torihikisakiShiharai';
import * as db from '../../../lib/database/service';
import InstitutionRepository from '../../../lib/database/institution/institutionRepository';
import { InstitutionRepository as IInstitutionRepository } from '../../../domain/institution';
import * as date from '../../../lib/date';

const reportTypes = new Map<AggregateType, string>([
  [AggregateType.DATE_RANGE, '期間指定検索'],
  [AggregateType.RAKUJITSU, '楽日検索'],
]);

export type SelectDateRangeFormValues = {
  type: AggregateType;
  dateRangeFrom: Date;
  dateRangeTo: Date;
}
export type SelectContentFormValues = {
  contents: ContentCode[];
}
export type SelectInstitutionFormValues = {
  institutions: InstitutionCode[];
}
export type Values = SelectDateRangeFormValues & SelectContentFormValues & SelectInstitutionFormValues;

const stepNumbers = [0, 1, 2, 3] as const;
type StepNumber = typeof stepNumbers[number];
function isStepNumber(n: number): n is StepNumber {
  return (stepNumbers as readonly number[]).includes(n);
}
const steps: Map<StepNumber, string> = new Map([
  [0, '期間選択'],
  [1, '作品選択'],
  [2, '店舗選択'],
  [3, '確認'],
]);

type ServerSideProps = {
  institutions: Institution[];
  serviceLaunchDateStr: string;
};

export async function getServerSideProps(): Promise<GetServerSidePropsResult<ServerSideProps>> {
  const conn = await db.connection();
  const projectId = process.env.SMT_PROJECT_ID ?? '';
  const repository: IInstitutionRepository = new InstitutionRepository(conn);
  const institutions = await repository.find({ projectId });

  const serviceLaunchDate: Date = date.parseDate(process.env.SMT_SERVICE_LAUNCH_DATE ?? '');

  return {
    props: {
      institutions: Array.from(institutions).map(([_code, institution]) => institution),
      serviceLaunchDateStr: date.formatDate(serviceLaunchDate),
    },
  };
}

type Props = ServerSideProps;

/**
 * 着券取引先支払
 */
export default function ChakukenTorihikisakiShiharai({ institutions, serviceLaunchDateStr }: Props) {
  const institutionsMap: Institutions = new Map(institutions.map(i => [i.code, i]));
  const sericeLaunchDate: Date = new Date(serviceLaunchDateStr);

  const [activeStep, setActiveStep] = useState<StepNumber>(0);
  const handleActiveStep = (newStep: number) => {
    if (isStepNumber(newStep)) {
      return setActiveStep(newStep);
    }
    throw new Error(`Invalid step ${newStep}.`);
  }

  const [selectDateRangeFormValues, setSelectDateRangeFormValues] = useState<SelectDateRangeFormValues>({
    type: AggregateType.DATE_RANGE,
    dateRangeFrom: sericeLaunchDate,
    dateRangeTo: new Date(),
  });

  const handleSelectDateRangeFormValues = (values: SelectDateRangeFormValues) => {
    setSelectDateRangeFormValues({ ...values });
  };

  const [contents, setContents] = useState<Contents>(new Map());

  const [selectContentFormValues, setSelectContentFormValues] = useState<SelectContentFormValues>({ contents: [] });
  const handleSelectContentFormValues = (values: SelectContentFormValues) => {
    setSelectContentFormValues({ ...values });
  }

  const [selectInstitutionFormValues, setSelectInstitutionFormValues] = useState<SelectInstitutionFormValues>({ institutions: Array.from(institutionsMap.keys()) });
  const handleSelectInstitutionFormValues = (values: SelectInstitutionFormValues) => {
    setSelectInstitutionFormValues({ ...values });
  }

  useEffect(() => {
    fetchContents().then((contents) => {
      setContents(contents);
      const defaultSelectedContents = Array.from(contents.keys());
      setSelectContentFormValues({
        ...selectContentFormValues,
        contents: defaultSelectedContents,
      });
    });
    // selectContentFormValuesがDependencyListに無いのでlintでwarningが出てしまう
    // 入れると無限ループなので、ひとまず無効にして回避する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectDateRangeFormValues]);

  const stepContents = new Map<StepNumber, ReactNode>();
  stepContents.set(0, (<SelectDateRangeForm
    reportTypes={reportTypes}
    values={selectDateRangeFormValues}
    onChangeValues={handleSelectDateRangeFormValues}
  />));
  stepContents.set(1, (<SelectContentForm
    contents={contents}
    values={selectContentFormValues}
    onChangeValues={handleSelectContentFormValues}
  />));
  stepContents.set(2, (<SelectInstitutionForm
    institutions={institutionsMap}
    values={selectInstitutionFormValues}
    onChangeValues={handleSelectInstitutionFormValues}
  />));

  const formValues: Values = { ...selectDateRangeFormValues, ...selectContentFormValues, ...selectInstitutionFormValues };
  stepContents.set(3, (<Confirm
    reportTypes={reportTypes}
    contents={contents}
    institutions={institutionsMap}
    values={formValues}
  />));

  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadFile, setDownloadFile] = useState<string>('');
  const handlerDownload = async () => {
    setDownloadFile('');
    setDownloading(true);
    await createChakukenTorihikisakiShiharaiReport(formValues)
      .then((data) => {
        setDownloadFile(data.filename);
      })
      .catch((response) => {
        console.log('download error', response);
        setDownloading(false);
        alert('エラーが発生しました。');
      });
  }

  useEffect(() => {
    if (downloadFile !== '') {
      // 非同期通信後にwindow.openするとポップアップブロックされるため、処理を分ける
      window.open('/chakuken/torihikisaki-shiharai/download?filename=' + downloadFile ,'_blank');
      setDownloading(false);
    }
  }, [downloadFile]);

  return (
    <Layout title="着券取引支払先" current="chakuken-torihikisaki-shiharai">
      <Paper variant="outlined" sx={{ my: 6, p: 3 }}>
        <Stepper
          labels={Array.from(steps.values())}
          activeStep={activeStep} />
        {stepContents.get(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {activeStep !== 0 && (
            <BackButton clickHandler={() => handleActiveStep(activeStep - 1)} />
          )}
          {activeStep === (steps.size - 1) ? (
            <DownloadButton donwloading={downloading} clickHandler={handlerDownload} />
          ) : (
            <NextButton clickHandler={() => handleActiveStep(activeStep + 1)} />
          )}
        </Box>
      </Paper>
    </Layout>
  )
}

const NextButton: FC<{ clickHandler: () => void }> = ({ clickHandler }) => {
  return (
    <Button
      variant="contained"
      onClick={() => clickHandler()}
    >
      次へ
    </Button>
  )
}

const DownloadButton: FC<{ donwloading: boolean, clickHandler: () => void }> = ({ donwloading, clickHandler }) => {
  return (
    <Button
      disabled={donwloading}
      variant="contained"
      onClick={() => clickHandler()}
    >
      {donwloading ? "ダウンロード中..." : "ダウンロード"}
    </Button>
  )
}

const BackButton: FC<{ clickHandler: () => void }> = ({ clickHandler }) => {
  return (
    <Button onClick={() => clickHandler()} >
      戻る
    </Button>
  )
}
