const {closeConnection} = require('../db_connection.js');
const app = require('../app.js');

// const deleteAllData = async () => {
//   await deleteAllDBData();
// };

// const closeApp = () =>
//   new Promise((resolve, reject) => {
//     app.close((err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });

// beforeAll(deleteAllData);
// afterAll(async () => {
//   await closeConnection();
//   await closeApp();
// });

//Current
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
