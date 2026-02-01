import {pgTable, uuid, varchar, timestamp, pgEnum} from 'drizzle-orm/pg-core';
import { emit } from 'process';

//enum for user table
export const roleEnum = pgEnum('role', ['USER', 'ORGANIZER' ,'ADMIN']);

//USERS TABLE
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', {length: 256}).notNull().unique(),
    password: varchar('password', {length: 256}).notNull(),
    name: varchar('name', {length: 256}).notNull(),
    role: roleEnum('role').default('USER').notNull().default('USER'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;