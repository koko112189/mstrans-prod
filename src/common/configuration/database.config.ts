import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require('dotenv').config();

class DatabaseConfig {

    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }
    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return {
            type: 'postgres',

            host: this.getValue('PGHOST'),
            port: parseInt(this.getValue('PGPORT')),
            username: this.getValue('PGUSER'),
            password: this.getValue('PGPASSWORD'),
            database: this.getValue('PGDATABASE'),

            entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],

            migrationsTableName: 'migration',

            migrations: [`${__dirname}/../../migration/*.ts`],

            ssl: this.isProduction(),
            synchronize: true,
            logging: !this.isProduction(),
        };
    }


}

const configService = new DatabaseConfig(process.env)
    .ensureValues([
        'PGHOST',
        'PGPORT',
        'PGUSER',
        'PGPASSWORD',
        'PGDATABASE'
    ]);

export { configService };