
import { injectable } from 'tsyringe';
import { DatabaseProperties } from './properties/database.properties';
import { DatabaseConfig } from './database.config';
import { ConfigurationError } from '../model/error/configuration.error';


@injectable()
export class MySqlConfig implements DatabaseConfig {

  constructor() {
  }

  public getProperties(): DatabaseProperties {

    if (typeof process.env.DB_HOST !== "string") {
      throw new ConfigurationError("Database 'host' must be declared");
    }
    if (typeof process.env.DB_SCHEMA !== "string") {
      throw new ConfigurationError("Database 'database' must be declared");
    }
    if (typeof process.env.DB_PORT !== "string") {
      throw new ConfigurationError("Database 'port' must be declared");
    }
    if (typeof process.env.DB_DIALECT !== "string") {
      throw new ConfigurationError("Database 'dialect' must be declared");
    }

    var output: DatabaseProperties = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT
    }
    return output;
  };
}