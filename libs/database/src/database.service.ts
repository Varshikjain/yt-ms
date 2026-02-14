import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConsoleLogWriter } from 'drizzle-orm';

@Injectable()
export class DatabaseService {
    private pool:Pool;
    public db: NodePgDatabase<typeof schema>

    //'postgresql://eventflow:eventflow_password@localhost:5432/eventflowdb?schema=public
    //{
    // "message": "User registered successfully",
    // "userId": "7b6a9159-4867-45a9-baf1-36e28fc0aaa9"
// }
    constructor() {
        // const connectionString = process.env.DATABASE_URL!;
        const connectionString = 'postgresql://eventflow:eventflow_password@localhost:5432/eventflowdb?schema=public';

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
