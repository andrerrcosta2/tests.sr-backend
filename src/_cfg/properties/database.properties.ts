
export interface DatabaseProperties {
    host: string;
    user?: string;
    password?: string;
    database: string;
    port: string;
    dialect: string;
    logging?: boolean;
    pool?: {
        max?: number;
        min?: number;
        acquire?: number;
        iddle?: number;
        logging?: boolean;
    };
    def?: {
        timestamps?: boolean;
        version?: boolean;
        underscored?: boolean;
    };
}