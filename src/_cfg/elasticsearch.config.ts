import { Client } from '@elastic/elasticsearch';
import { singleton } from 'tsyringe';
import retry, { RetryOptions } from '../shared/util/retry.util';
import { appProperties } from './environment.config';


@singleton()
export class ElasticSearchService {
    public readonly client: Client;

    constructor() {
        this.client = new Client({
            node: appProperties.dataStore ? `http://${appProperties.dataStore.host}:${appProperties.dataStore.port}` :
                'http://localhost:9200',
        });

        this.checkConnection();
    }

    private async checkConnection() {
        const options: RetryOptions = {
            maxAttempts: 5,
            delayBetweenAttemptsMs: 5000
        };

        try {
            await retry(() => this.client.ping(), options);
            console.log('Connected to Elasticsearch');
        } catch (error) {
            console.error('Failed to connect to Elasticsearch after retries:', error);
        }
    }
}