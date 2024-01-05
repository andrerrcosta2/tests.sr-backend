import { DatabaseProperties } from "./properties/database.properties";

export interface DatabaseConfig {
    getProperties(): DatabaseProperties;
}