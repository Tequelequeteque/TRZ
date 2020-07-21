import { createConnection } from 'typeorm';
import config from './db.config';

createConnection(config);
