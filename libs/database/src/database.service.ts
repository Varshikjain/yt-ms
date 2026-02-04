import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConsoleLogWriter } from 'drizzle-orm';

@Injectable()
export class DatabaseService {
    private pool:Pool;
    public db: NodePgDatabase<typeof schema>

    //'postgresql://eventflow:eventflow_password@locahost:5432/eventflowdb?schema=public
    constructor() {
        // const connectionString = process.env.DATABASE_URL!;
        const connectionString = 'postgresql://eventflow:eventflow_password@locahost:5432/eventflowdb?schema=public';

        this.pool = new Pool({ connectionString});
        this.db = drizzle(this.pool, { schema });

       console.log("Database connected successfully");
    }

    async onModuleDestroy() {
        await this.pool.end();
    }

    getSchema() {
        return schema;
    }
}
