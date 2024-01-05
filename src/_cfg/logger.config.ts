import winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';
import { Discover } from '../util/discover.util';
import { ElasticSearchService } from './elasticsearch.config';
import { isProduction } from './environment.config';

const customLevels = {
  levels: {
    error: 0,
    warning: 1,
    info: 2,
    debug: 3,
    unexpected: 4,
    serverError: 5
  },
  colors: {
    error: 'red',
    warning: 'yellow',
    info: 'green',
    debug: 'blue',
    unexpected: 'magenta',
    serverError: 'orange'
  },
};



let transports: winston.transport[] = [
  new winston.transports.Console(),
];

if (isProduction) {
  const elasticSearchService = new ElasticSearchService();
  const esTransportOpts = {
    level: 'info',
    index: 'logs',
    type: 'logs',
    client: elasticSearchService.client,
  };

  transports.push(new ElasticsearchTransport(esTransportOpts));
} else {
  transports.push(new winston.transports.File({ filename: 'combined.log' }));
}

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.json(),
  defaultMeta: { service: 'global' },
  transports: transports,
});


export const loggerWrapper = {
  error: (...message: any[]) => {
    const filename = Discover.functionCaller(1);
    const formattedMessage = message.join(' ::: ');
    const msg = `\n\n[${filename}]:\n${formattedMessage}\n\n`;
    logger.log('error', msg, { service: filename });
  },

  warning: (...message: any[]) => {
    const filename = Discover.functionCaller(1);
    const formattedMessage = message.join(':::');
    const msg = `\n\n[${filename}]:\n${formattedMessage}\n\n`;
    logger.log('warning', msg, { service: filename });
  },

  info: (...message: any[]) => {
    const filename = Discover.functionCaller(1);
    const formattedMessage = message.join(':::');
    const msg = `\n\n[${filename}]:\n${formattedMessage}\n\n`;
    logger.log('info', msg, { service: filename });
  },

  debug: (...message: any[]) => {
    const filename = Discover.functionCaller(1);
    const formattedMessage = message.join(':::');
    const msg = `\n\n[${filename}]:\n${formattedMessage}\n\n`;
    logger.log('debug', msg, { service: filename });
  },

  unexpected: (...message: any[]) => {
    const filename = Discover.functionCaller(1);
    const formattedMessage = message.join(':::');
    const msg = `\n\n[${filename}]:\n${formattedMessage}\n\n`;
    logger.log('unexpected', msg, { service: filename });
  },

  serverError: (...message: any[]) => {
    const filename = Discover.functionCaller(1);
    const formattedMessage = message.join(':::');
    const msg = `\n\n[${filename}]:\n${formattedMessage}\n\n`;
    logger.log('serverError', msg, { service: filename });
  }

};

export { loggerWrapper as winston };
