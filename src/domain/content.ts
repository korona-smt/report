export type ContentCode = string;

export type Content = {
  code: ContentCode;
  name: string;
}

export type Contents = Map<ContentCode, Content>;

export interface ContentRepository {
  find(params: { projectId: string }): Promise<Contents>;
}
