import { Content, Contents } from '../../domain/content';

export type ErrorData = {
  message: string;
}
export type ErrorResponseData = {
  error: ErrorData;
}
export type FetchResponseData = {
  contents: Content[];
};

export async function fetchContents(): Promise<Contents> {
  return fetch('/api/contents')
    .then((res) => res.json())
    .then((data: FetchResponseData) => {
      const contents: Contents = new Map();
      data.contents.forEach((content: Content) => {
        contents.set(content.code, content);
      });
      return contents;
    });
}
