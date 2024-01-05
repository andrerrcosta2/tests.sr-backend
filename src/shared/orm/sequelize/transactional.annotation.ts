import { Sequelize, Transaction } from 'sequelize';
import { container } from 'tsyringe';
import { SequelizeConfig } from '../../../_cfg/sequelize.config';
import { dbg } from '../../../util/log/debug.log';

export function transactional(options: TransactionalOptions = {}): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let transaction: Transaction | null = null;
      let retries = options.retries || 0;
      const delayMs = options.delayMs || 0;

      while (retries >= 0) {
        try {
          const config: SequelizeConfig = container.resolve('sequelize-config');
          const database: Sequelize = config.getOrm();
          transaction = await database.transaction();
          dbg("initializing transaction from", `${target.constructor.name}::${String(propertyKey)}`, transaction !== null)

          const result = await originalMethod.apply(this, [...args, transaction]);
          dbg("commiting transaction from", `${target.constructor.name}::${String(propertyKey)}`, transaction !== null)
          await transaction.commit();
          dbg("returning original method", result);
          return result;
        } catch (error: unknown) {
          dbg("catching error", typeof error, error);
          if (transaction) {
            dbg("rolling back transaction from", `${target.constructor.name}::${String(propertyKey)}`, transaction !== null);
            await transaction.rollback();
          }

          retries--;
          if (retries >= 0 && delayMs > 0) {

            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
          if (retries < 0) {
            throw error;
          }
        }
      }
    };

    return descriptor;
  };
}


interface TransactionalOptions {
  retries?: number;
  delayMs?: number;
}
