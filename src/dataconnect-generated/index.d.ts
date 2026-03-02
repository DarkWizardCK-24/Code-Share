import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddCommentToSnippetData {
  comment_insert: Comment_Key;
}

export interface AddCommentToSnippetVariables {
  snippetId: UUIDString;
  content: string;
}

export interface Comment_Key {
  id: UUIDString;
  __typename?: 'Comment_Key';
}

export interface CreateUserSnippetData {
  snippet_insert: Snippet_Key;
}

export interface CreateUserSnippetVariables {
  title: string;
  codeContent: string;
  language: string;
  isPublic: boolean;
  description?: string | null;
}

export interface GetMySnippetsData {
  snippets: ({
    id: UUIDString;
    title: string;
    language: string;
    isPublic: boolean;
    updatedAt: TimestampString;
  } & Snippet_Key)[];
}

export interface GetPublicSnippetsData {
  snippets: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    language: string;
    createdAt: TimestampString;
    author?: {
      id: UUIDString;
      username: string;
      displayName?: string | null;
    } & User_Key;
  } & Snippet_Key)[];
}

export interface SnippetTag_Key {
  snippetId: UUIDString;
  tagId: UUIDString;
  __typename?: 'SnippetTag_Key';
}

export interface Snippet_Key {
  id: UUIDString;
  __typename?: 'Snippet_Key';
}

export interface Tag_Key {
  id: UUIDString;
  __typename?: 'Tag_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserSnippetRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserSnippetVariables): MutationRef<CreateUserSnippetData, CreateUserSnippetVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserSnippetVariables): MutationRef<CreateUserSnippetData, CreateUserSnippetVariables>;
  operationName: string;
}
export const createUserSnippetRef: CreateUserSnippetRef;

export function createUserSnippet(vars: CreateUserSnippetVariables): MutationPromise<CreateUserSnippetData, CreateUserSnippetVariables>;
export function createUserSnippet(dc: DataConnect, vars: CreateUserSnippetVariables): MutationPromise<CreateUserSnippetData, CreateUserSnippetVariables>;

interface GetPublicSnippetsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPublicSnippetsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPublicSnippetsData, undefined>;
  operationName: string;
}
export const getPublicSnippetsRef: GetPublicSnippetsRef;

export function getPublicSnippets(): QueryPromise<GetPublicSnippetsData, undefined>;
export function getPublicSnippets(dc: DataConnect): QueryPromise<GetPublicSnippetsData, undefined>;

interface GetMySnippetsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMySnippetsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMySnippetsData, undefined>;
  operationName: string;
}
export const getMySnippetsRef: GetMySnippetsRef;

export function getMySnippets(): QueryPromise<GetMySnippetsData, undefined>;
export function getMySnippets(dc: DataConnect): QueryPromise<GetMySnippetsData, undefined>;

interface AddCommentToSnippetRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToSnippetVariables): MutationRef<AddCommentToSnippetData, AddCommentToSnippetVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCommentToSnippetVariables): MutationRef<AddCommentToSnippetData, AddCommentToSnippetVariables>;
  operationName: string;
}
export const addCommentToSnippetRef: AddCommentToSnippetRef;

export function addCommentToSnippet(vars: AddCommentToSnippetVariables): MutationPromise<AddCommentToSnippetData, AddCommentToSnippetVariables>;
export function addCommentToSnippet(dc: DataConnect, vars: AddCommentToSnippetVariables): MutationPromise<AddCommentToSnippetData, AddCommentToSnippetVariables>;

