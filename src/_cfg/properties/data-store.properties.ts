export interface DataStoreProperties {
    host: string;
    port: number;

    // Authentication and Security
    username?: string;
    password?: string;
    apiKey?: string;

    // Connection Pool Settings
    maxRetries?: number;
    requestTimeout?: number;
    sniffOnStart?: boolean;
    sniffInterval?: number;
    
    // Indexing and Document Settings
    indexPrefix?: string;
    shards?: number;
    replicas?: number;
    refreshInterval?: string;

    // Logging and Debugging
    logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    logPath?: string;
    enableDebugLogs?: boolean;

    // SSL/TLS Settings (if using HTTPS)
    ssl?: {
        enabled: boolean; // Whether to use SSL/TLS
        caCertPath?: string; // Path to CA certificate file (if required)
        clientCertPath?: string; // Path to client certificate file (if required)
        clientKeyPath?: string; // Path to client key file (if required)
    };
}
