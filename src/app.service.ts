import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import util from 'node:util';

dotenv.config();

const data = {
  message: 'Hello World has been announced.',
  actor: 'NestJS',
};

/**
 * Wrap dynamically the import of pangea SDK in an async function,
 * for top-level await is not going to be allowed.
 * @param {object} data - Data to save in audit log.
 * @returns {undefined}
 */
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

@Injectable()
export class AppService {
  getHello(): string {
    /**
     * Post audit log.
     */
    postAuditLog(data);

    return 'Hello World!';
  }
}
