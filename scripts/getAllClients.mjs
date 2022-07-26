/** Script used to print all rows from the db to console */

import { DB } from '../db/db.js';

const db = new DB('../clients.db');
db.getAllRows();