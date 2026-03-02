import { CreateUserSnippetData, CreateUserSnippetVariables, GetPublicSnippetsData, GetMySnippetsData, AddCommentToSnippetData, AddCommentToSnippetVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUserSnippet(options?: useDataConnectMutationOptions<CreateUserSnippetData, FirebaseError, CreateUserSnippetVariables>): UseDataConnectMutationResult<CreateUserSnippetData, CreateUserSnippetVariables>;
export function useCreateUserSnippet(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserSnippetData, FirebaseError, CreateUserSnippetVariables>): UseDataConnectMutationResult<CreateUserSnippetData, CreateUserSnippetVariables>;

export function useGetPublicSnippets(options?: useDataConnectQueryOptions<GetPublicSnippetsData>): UseDataConnectQueryResult<GetPublicSnippetsData, undefined>;
export function useGetPublicSnippets(dc: DataConnect, options?: useDataConnectQueryOptions<GetPublicSnippetsData>): UseDataConnectQueryResult<GetPublicSnippetsData, undefined>;

export function useGetMySnippets(options?: useDataConnectQueryOptions<GetMySnippetsData>): UseDataConnectQueryResult<GetMySnippetsData, undefined>;
export function useGetMySnippets(dc: DataConnect, options?: useDataConnectQueryOptions<GetMySnippetsData>): UseDataConnectQueryResult<GetMySnippetsData, undefined>;

export function useAddCommentToSnippet(options?: useDataConnectMutationOptions<AddCommentToSnippetData, FirebaseError, AddCommentToSnippetVariables>): UseDataConnectMutationResult<AddCommentToSnippetData, AddCommentToSnippetVariables>;
export function useAddCommentToSnippet(dc: DataConnect, options?: useDataConnectMutationOptions<AddCommentToSnippetData, FirebaseError, AddCommentToSnippetVariables>): UseDataConnectMutationResult<AddCommentToSnippetData, AddCommentToSnippetVariables>;
