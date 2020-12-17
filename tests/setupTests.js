const { closeConnection } = require('../db_connection.js');
const app = require('../app.js');

const closeApp = () =>
  new Promise((resolve, reject) => {
    app.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });


afterAll(async () => {
  await closeConnection();
  await closeApp();
});
