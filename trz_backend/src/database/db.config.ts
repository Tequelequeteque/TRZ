/* eslint-disable @typescript-eslint/no-var-requires */
import 'dotenv/config';
import 'reflect-metadata';
import { ConnectionOptions } from 'typeorm';

import { resolve } from 'path';

interface IProcessEnv {
  [key: string]: string | undefined;
}

const env = process.env as IProcessEnv;

if (!env.SET_ENV) throw new Error('You need set environment');

const migrationsDir = resolve(__dirname, 'migrations');
const entitiesDir = resolve(__dirname, '..', 'models');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const configExtras: any = {
  dev: {
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
  },
  test: {
    database: './src/database/db.test.sql',
    type: 'sqlite',
    dropSchema: true,
  },
};

const config = {
  ...configExtras[env.SET_ENV],
  name: 'default',
  entities: [`${entitiesDir}/*ts`],
  migrations: [`${migrationsDir}/*ts`],
  cli: { migrationsDir, entitiesDir },
  migrationsRun: true,
} as ConnectionOptions;

export default config;
