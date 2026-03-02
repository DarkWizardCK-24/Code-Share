# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPublicSnippets*](#getpublicsnippets)
  - [*GetMySnippets*](#getmysnippets)
- [**Mutations**](#mutations)
  - [*CreateUserSnippet*](#createusersnippet)
  - [*AddCommentToSnippet*](#addcommenttosnippet)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPublicSnippets
You can execute the `GetPublicSnippets` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPublicSnippets(): QueryPromise<GetPublicSnippetsData, undefined>;

interface GetPublicSnippetsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPublicSnippetsData, undefined>;
}
export const getPublicSnippetsRef: GetPublicSnippetsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublicSnippets(dc: DataConnect): QueryPromise<GetPublicSnippetsData, undefined>;

interface GetPublicSnippetsRef {
  ...
  (dc: DataConnect): QueryRef<GetPublicSnippetsData, undefined>;
}
export const getPublicSnippetsRef: GetPublicSnippetsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublicSnippetsRef:
```typescript
const name = getPublicSnippetsRef.operationName;
console.log(name);
```

### Variables
The `GetPublicSnippets` query has no variables.
### Return Type
Recall that executing the `GetPublicSnippets` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublicSnippetsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPublicSnippets`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublicSnippets } from '@dataconnect/generated';


// Call the `getPublicSnippets()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublicSnippets();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublicSnippets(dataConnect);

console.log(data.snippets);

// Or, you can use the `Promise` API.
getPublicSnippets().then((response) => {
  const data = response.data;
  console.log(data.snippets);
});
```

### Using `GetPublicSnippets`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublicSnippetsRef } from '@dataconnect/generated';


// Call the `getPublicSnippetsRef()` function to get a reference to the query.
const ref = getPublicSnippetsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublicSnippetsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.snippets);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.snippets);
});
```

## GetMySnippets
You can execute the `GetMySnippets` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMySnippets(): QueryPromise<GetMySnippetsData, undefined>;

interface GetMySnippetsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMySnippetsData, undefined>;
}
export const getMySnippetsRef: GetMySnippetsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMySnippets(dc: DataConnect): QueryPromise<GetMySnippetsData, undefined>;

interface GetMySnippetsRef {
  ...
  (dc: DataConnect): QueryRef<GetMySnippetsData, undefined>;
}
export const getMySnippetsRef: GetMySnippetsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMySnippetsRef:
```typescript
const name = getMySnippetsRef.operationName;
console.log(name);
```

### Variables
The `GetMySnippets` query has no variables.
### Return Type
Recall that executing the `GetMySnippets` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMySnippetsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMySnippetsData {
  snippets: ({
    id: UUIDString;
    title: string;
    language: string;
    isPublic: boolean;
    updatedAt: TimestampString;
  } & Snippet_Key)[];
}
```
### Using `GetMySnippets`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMySnippets } from '@dataconnect/generated';


// Call the `getMySnippets()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMySnippets();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMySnippets(dataConnect);

console.log(data.snippets);

// Or, you can use the `Promise` API.
getMySnippets().then((response) => {
  const data = response.data;
  console.log(data.snippets);
});
```

### Using `GetMySnippets`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMySnippetsRef } from '@dataconnect/generated';


// Call the `getMySnippetsRef()` function to get a reference to the query.
const ref = getMySnippetsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMySnippetsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.snippets);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.snippets);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUserSnippet
You can execute the `CreateUserSnippet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUserSnippet(vars: CreateUserSnippetVariables): MutationPromise<CreateUserSnippetData, CreateUserSnippetVariables>;

interface CreateUserSnippetRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserSnippetVariables): MutationRef<CreateUserSnippetData, CreateUserSnippetVariables>;
}
export const createUserSnippetRef: CreateUserSnippetRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserSnippet(dc: DataConnect, vars: CreateUserSnippetVariables): MutationPromise<CreateUserSnippetData, CreateUserSnippetVariables>;

interface CreateUserSnippetRef {
  ...
  (dc: DataConnect, vars: CreateUserSnippetVariables): MutationRef<CreateUserSnippetData, CreateUserSnippetVariables>;
}
export const createUserSnippetRef: CreateUserSnippetRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserSnippetRef:
```typescript
const name = createUserSnippetRef.operationName;
console.log(name);
```

### Variables
The `CreateUserSnippet` mutation requires an argument of type `CreateUserSnippetVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserSnippetVariables {
  title: string;
  codeContent: string;
  language: string;
  isPublic: boolean;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateUserSnippet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserSnippetData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserSnippetData {
  snippet_insert: Snippet_Key;
}
```
### Using `CreateUserSnippet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserSnippet, CreateUserSnippetVariables } from '@dataconnect/generated';

// The `CreateUserSnippet` mutation requires an argument of type `CreateUserSnippetVariables`:
const createUserSnippetVars: CreateUserSnippetVariables = {
  title: ..., 
  codeContent: ..., 
  language: ..., 
  isPublic: ..., 
  description: ..., // optional
};

// Call the `createUserSnippet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserSnippet(createUserSnippetVars);
// Variables can be defined inline as well.
const { data } = await createUserSnippet({ title: ..., codeContent: ..., language: ..., isPublic: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserSnippet(dataConnect, createUserSnippetVars);

console.log(data.snippet_insert);

// Or, you can use the `Promise` API.
createUserSnippet(createUserSnippetVars).then((response) => {
  const data = response.data;
  console.log(data.snippet_insert);
});
```

### Using `CreateUserSnippet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserSnippetRef, CreateUserSnippetVariables } from '@dataconnect/generated';

// The `CreateUserSnippet` mutation requires an argument of type `CreateUserSnippetVariables`:
const createUserSnippetVars: CreateUserSnippetVariables = {
  title: ..., 
  codeContent: ..., 
  language: ..., 
  isPublic: ..., 
  description: ..., // optional
};

// Call the `createUserSnippetRef()` function to get a reference to the mutation.
const ref = createUserSnippetRef(createUserSnippetVars);
// Variables can be defined inline as well.
const ref = createUserSnippetRef({ title: ..., codeContent: ..., language: ..., isPublic: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserSnippetRef(dataConnect, createUserSnippetVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.snippet_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.snippet_insert);
});
```

## AddCommentToSnippet
You can execute the `AddCommentToSnippet` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addCommentToSnippet(vars: AddCommentToSnippetVariables): MutationPromise<AddCommentToSnippetData, AddCommentToSnippetVariables>;

interface AddCommentToSnippetRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToSnippetVariables): MutationRef<AddCommentToSnippetData, AddCommentToSnippetVariables>;
}
export const addCommentToSnippetRef: AddCommentToSnippetRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCommentToSnippet(dc: DataConnect, vars: AddCommentToSnippetVariables): MutationPromise<AddCommentToSnippetData, AddCommentToSnippetVariables>;

interface AddCommentToSnippetRef {
  ...
  (dc: DataConnect, vars: AddCommentToSnippetVariables): MutationRef<AddCommentToSnippetData, AddCommentToSnippetVariables>;
}
export const addCommentToSnippetRef: AddCommentToSnippetRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCommentToSnippetRef:
```typescript
const name = addCommentToSnippetRef.operationName;
console.log(name);
```

### Variables
The `AddCommentToSnippet` mutation requires an argument of type `AddCommentToSnippetVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCommentToSnippetVariables {
  snippetId: UUIDString;
  content: string;
}
```
### Return Type
Recall that executing the `AddCommentToSnippet` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCommentToSnippetData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCommentToSnippetData {
  comment_insert: Comment_Key;
}
```
### Using `AddCommentToSnippet`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCommentToSnippet, AddCommentToSnippetVariables } from '@dataconnect/generated';

// The `AddCommentToSnippet` mutation requires an argument of type `AddCommentToSnippetVariables`:
const addCommentToSnippetVars: AddCommentToSnippetVariables = {
  snippetId: ..., 
  content: ..., 
};

// Call the `addCommentToSnippet()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCommentToSnippet(addCommentToSnippetVars);
// Variables can be defined inline as well.
const { data } = await addCommentToSnippet({ snippetId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCommentToSnippet(dataConnect, addCommentToSnippetVars);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
addCommentToSnippet(addCommentToSnippetVars).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

### Using `AddCommentToSnippet`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCommentToSnippetRef, AddCommentToSnippetVariables } from '@dataconnect/generated';

// The `AddCommentToSnippet` mutation requires an argument of type `AddCommentToSnippetVariables`:
const addCommentToSnippetVars: AddCommentToSnippetVariables = {
  snippetId: ..., 
  content: ..., 
};

// Call the `addCommentToSnippetRef()` function to get a reference to the mutation.
const ref = addCommentToSnippetRef(addCommentToSnippetVars);
// Variables can be defined inline as well.
const ref = addCommentToSnippetRef({ snippetId: ..., content: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCommentToSnippetRef(dataConnect, addCommentToSnippetVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.comment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.comment_insert);
});
```

