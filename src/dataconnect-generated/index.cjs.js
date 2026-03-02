const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'codeshare',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createUserSnippetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserSnippet', inputVars);
}
createUserSnippetRef.operationName = 'CreateUserSnippet';
exports.createUserSnippetRef = createUserSnippetRef;

exports.createUserSnippet = function createUserSnippet(dcOrVars, vars) {
  return executeMutation(createUserSnippetRef(dcOrVars, vars));
};

const getPublicSnippetsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublicSnippets');
}
getPublicSnippetsRef.operationName = 'GetPublicSnippets';
exports.getPublicSnippetsRef = getPublicSnippetsRef;

exports.getPublicSnippets = function getPublicSnippets(dc) {
  return executeQuery(getPublicSnippetsRef(dc));
};

const getMySnippetsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMySnippets');
}
getMySnippetsRef.operationName = 'GetMySnippets';
exports.getMySnippetsRef = getMySnippetsRef;

exports.getMySnippets = function getMySnippets(dc) {
  return executeQuery(getMySnippetsRef(dc));
};

const addCommentToSnippetRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToSnippet', inputVars);
}
addCommentToSnippetRef.operationName = 'AddCommentToSnippet';
exports.addCommentToSnippetRef = addCommentToSnippetRef;

exports.addCommentToSnippet = function addCommentToSnippet(dcOrVars, vars) {
  return executeMutation(addCommentToSnippetRef(dcOrVars, vars));
};
