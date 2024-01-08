import { Sequelize, Transaction } from 'sequelize';
import { container } from 'tsyringe';
import { SequelizeConfig } from '../../../_cfg/sequelize.config';
import { dbg } from '../../../util/log/debug.log';
import retry, { RetryOptions } from '../../util/retry.util';

export function transactional(options: TransactionalOptions = {}): MethodDecorator {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (...args: any[]) {
      let transaction: Transaction | null = null;
      const retries = options.retries || 0;
      const delayMs = options.delayMs || 0;

      const retryOptions: RetryOptions = {
        maxAttempts: retries + 1,
        delayBetweenAttemptsMs: delayMs
      };

      try {
        const config: SequelizeConfig = container.resolve('sequelize-config');
        const database: Sequelize = config.getOrm();

        return await retry(async () => {
          transaction = await database.transaction();
          dbg("initializing transaction from", `${target.constructor.name}::${String(propertyKey)}`, transaction !== null);
          const result = await originalMethod.apply(this, [...args, transaction]);
          dbg("commiting transaction from", `${target.constructor.name}::${String(propertyKey)}`, transaction !== null);
          await transaction.commit();
          dbg("returning original method", result);
          return result;

        }, retryOptions);
      } catch (error: unknown) {
        dbg("catching error", typeof error, error);
        if (transaction !== null) {
          dbg("rolling back transaction from", `${target.constructor.name}::${String(propertyKey)}`, transaction !== null);
          await (transaction as Transaction).rollback();
        }
        throw error;
      }
    };

    return descriptor;
  };
}


interface TransactionalOptions {
  retries?: number;
  delayMs?: number;
}
