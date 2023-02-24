import type { NextApiRequest, NextApiResponse } from 'next';
import type { Content } from '../../domain/content';
import * as db from '../../lib/database/service';
import ContentRepository from '../../lib/database/content/contentRepository';
import { ContentRepository as IContentRepository} from '../../domain/content';

export type Data = {
  contents: Content[];
};

type Error = {
  message: string;
}

type ErrorData = {
  error: Error;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method !== 'GET') {
    return res.status(404).json({ error: { message: '404 Not Found' } });
  }

  const conn = await db.connection();
  const repository: IContentRepository = new ContentRepository(conn);

  const projectId = process.env.SMT_PROJECT_ID ?? '';
  const contents: Content[] = await repository.find({projectId})
    .then((contents) => (Array.from(contents.values())));

  res.status(200).json({
    contents,
  });
}
