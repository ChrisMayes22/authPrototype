/** Script used to empty and reset the Database.
 *  This script should be run once after initial installation
 * 
 *  For usage, see documentation for inquirer at 
 *  https://www.npmjs.com/package/inquirer
 */

import { DB } from '../db/db.js';
import inquirer from 'inquirer';

const db = new DB('../clients.db');

inquirer
  .prompt([
    {
        type: 'list', 
        name: 'response', 
        message: 'WARNING, this script will EMPTY ANY EXISTING DATABASE. Continue?',
        default: 'no',
        choices: ['no', 'yes']
    }
  ])
  .then((answers) => {
    if(answers['response'] === 'yes'){
        db.resetDB();
    }
    return;
  })
  .catch((err) => {
    return console.error(err);
});