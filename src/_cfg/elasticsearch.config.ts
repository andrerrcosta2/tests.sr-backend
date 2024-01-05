import { Client } from '@elastic/elasticsearch';
import { singleton } from 'tsyringe';
import { RetryOptions } from '../util/retry.util';
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
            await this.retryWithDelay(() => this.client.ping(), options);
            console.log('Connected to Elasticsearch');
        } catch (error) {
            console.error('Failed to connect to Elasticsearch after retries:', error);
        }
    }

    private async retryWithDelay<T>(operation: () => Promise<T>, options: RetryOptions): Promise<T> {
        let attempts = 0;
        while (attempts < options.maxAttempts) {
            try {
                return await operation();
            } catch (error) {
                attempts++;
                if (attempts === options.maxAttempts) {
                    throw new Error(`Max retry attempts reached (${options.maxAttempts}). Last error: ${error}`);
                }
                // Delay before next attempt
                await new Promise((resolve) => setTimeout(resolve, options.delayBetweenAttemptsMs));
            }
        }
        throw new Error(`Unexpected error in retry function.`);
    }
}