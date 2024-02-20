# Exmaple of Using Pangea Node.js SDK in a NestJS Application

## Installation 

All the same, all the same:

```sh
npm install
```

## Running

```sh
npm run start:dev
```

For further details on running a NestJS application, please consult the official README included in this project in [README.NestJS.md](README.NestJS.md)

## Providing Pangea API Credentials

Provide Pangea credentials and references in a `.env` file, example of which can be found in [.env.example](.env.example)

## Loading Pangea SDK

Currently, the Pangea JavaScript SDK can only be imported as a [native JavaScript module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), but a default installation of NestJS project attempts to load it using using the Node.js [CommonJS modules](https://nodejs.org/api/esm.html#enabling) system.

As a result, if you try to import the SDK as an ES module, you may receive an error. For example:

```typescript
import { PangeaConfig, AuditService } from 'pangea-node-sdk';
```

```bash
src/app.service.ts:4:44 - error TS1479: The current file is a CommonJS module whose imports will produce 'require' calls; however, the referenced file is an ECMAScript module and cannot be imported with 'require'. Consider writing a dynamic 'import("pangea-node-sdk")' call instead.
  To convert this file to an ECMAScript module, change its file extension to '.mts', or add the field `"type": "module"` to '/Users/<path>/pangea-nest/package.json'.

4 import { PangeaConfig, AuditService } from 'pangea-node-sdk';
```

One way to get around this error is to import the SDK dynamically, example of which is provided in [src/app.service.ts](src/app.service.ts):

```typescript
// ...

const postAuditLog = async (data) => {
  const Pangea = await import('pangea-node-sdk');
  const PangeaConfig = Pangea.PangeaConfig;
  const AuditService = Pangea.AuditService;

  const auditConfig = new PangeaConfig({
    domain: process.env.PANGEA_AUDIT_DOMAIN,
    configID: process.env.PANGEA_AUDIT_CONFIG_ID,
  });

  const auditService = new AuditService(
    process.env.PANGEA_AUDIT_TOKEN,
    auditConfig,
  );

  auditService
    .log(data, {
      verbose: true,
    })
    .then((response) => {
      console.log('auditService response:', util.inspect(response.result));
    });
};

// ...
```

You might also need to experiment with the "module" value in [tsconfig.json](tsconfig.json) to prevent down-leveling the dynamic import to the `require` syntax in built application. In this example, the "module" value is changed from the default "commonjs" to "nodenext". Acceptable values could be found in the [TypeScript docs](https://www.typescriptlang.org/tsconfig#module). 