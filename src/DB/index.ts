import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/exporter.js';

import dotenv from 'dotenv';

dotenv.config();

export const db = drizzle(process.env.DATABASE_URL!, { schema });
