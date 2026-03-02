import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'codeshare',
  location: 'us-east4'
};

export const createUserSnippetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserSnippet', inputVars);
}
createUserSnippetRef.operationName = 'CreateUserSnippet';

export function createUserSnippet(dcOrVars, vars) {
  return executeMutation(createUserSnippetRef(dcOrVars, vars));
}

export const getPublicSnippetsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicSnippets');
}
getPublicSnippetsRef.operationName = 'GetPublicSnippets';

export function getPublicSnippets(dc) {
  return executeQuery(getPublicSnippetsRef(dc));
}

export const getMySnippetsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMySnippets');
}
getMySnippetsRef.operationName = 'GetMySnippets';

export function getMySnippets(dc) {
  return executeQuery(getMySnippetsRef(dc));
}

export const addCommentToSnippetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToSnippet', inputVars);
}
addCommentToSnippetRef.operationName = 'AddCommentToSnippet';

export function addCommentToSnippet(dcOrVars, vars) {
  return executeMutation(addCommentToSnippetRef(dcOrVars, vars));
}

