require('dotenv').config();
const mysql = require('mysql2');

let config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

if (process.env.NODE_ENV === 'test') {
  config = {
    host: process.env.DB_HOST_TEST,
    port: process.env.DB_PORT_TEST,
    user: process.env.DB_USER_TEST,
    password: process.env.DB_PASS_TEST,
    database: process.env.DB_NAME_TEST
  };
}

const connection = mysql.createPool(config);

const query = (...args) => {
  return new Promise((resolve, reject) => {
    connection.query(...args, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

const closeConnection = () => {
  return new Promise((resolve, reject) => {
    if (connection) {
      connection.end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
};

const deleteAllDBData = async () => {
  const tableNames = (await query(
    `SELECT table_name FROM information_schema.tables where LOWER(table_schema) = '${process.env.DB_NAME_TEST || 'contact_api_database_test'
    }' AND table_name != 'migrations'`
  )
  ).map((row) => row.table_name || row.TABLE_NAME);

  if (process.env.NODE_ENV === 'test') {
    await query("SET FOREIGN_KEY_CHECKS=0;");
    tableNames.forEach(async (name) => {
      await query(`DELETE FROM ${name};`);
      await query(`ALTER TABLE ${name} AUTO_INCREMENT=1;`);
      await query(`TRUNCATE ${name};`);
    });
    await query("SET FOREIGN_KEY_CHECKS=1;");
  }
};

// const deleteAllDBData = async () => {
//   const tableNames = (await query(
//     `SELECT table_name FROM information_schema.tables where LOWER(table_schema) = '${process.env.DB_NAME_TEST || 'contact_api_database_test'
//     }' AND table_name != 'migrations'`
//   )
//   ).map((row) => row.table_name || row.TABLE_NAME);

//   if (process.env.NODE_ENV === 'test') {
//     await query("SET FOREIGN_KEY_CHECKS=0;");
//     tableNames.forEach(async (name) => {
//       await query(`TRUNCATE ${name};`);
//     });
//     await query("SET FOREIGN_KEY_CHECKS=1;");
//   }
// };

module.exports = {
  connection,
  closeConnection,
  query,
  deleteAllDBData
};