const request = require('supertest');
const app = require('../app');
const { query } = require('../db_connection');

describe('emails', () => {
  const picture = {
    name: "Honda_civic_9.jpg",
    description: "Best car in the world",
    dimension: 4000
  };

  beforeAll(async () => {
    const sql = "TRUNCATE Email";
    await query(sql, picture);
  });

  it('GETs /api/emails and should return status 200', async () => {
    await request(app)
      .get('/api/emails')
      .expect(200);
    // expect(parseInt(res.body.length, 10)).toEqual(0);
  });

//   it('POSTs /api/pictures and should return {name: "Honda_civic_9.jpg",description: "Best car in the world", dimension: 4000}', async () => {
//     const res = await request(app)
//       .post('/api/pictures')
//       .send(picture)
//       .expect(201);
//     expect(res.body.id).toBe(1);
//     expect(res.body.name).toEqual("Honda_civic_9.jpg");
//   });

//   it('GETs /api/pictures and should return an array containing one element', async () => {
//     const res = await request(app)
//       .get('/api/pictures')
//       .expect(200);
//     expect(parseInt(res.body.length, 10)).toEqual(1);
//   });

//   it('PUTs /api/pictures/1 and should return {id: 1, name: "Mercedes.jpg",description: "Best car in the world", dimension: 4000}', async () => {
//     const res = await request(app)
//       .put('/api/pictures/1')
//       .send({ name: "Mercedes.jpg" })
//       .expect(200);
//     expect(res.body.id).toBe(1);
//     expect(res.body.name).toEqual("Mercedes.jpg");
//   });

//   it('DELETEs /api/pictures/1 should return status 204', async () => {
//     await request(app)
//       .delete('/api/pictures/1')
//       .expect(204);
//   });

//   it('DELETEs /api/pictures/2 should return status 400 and {errorMessage: "Picture with id 2 not found."}', async () => {
//     const res = await request(app)
//       .delete('/api/pictures/2')
//       .expect(400);
//     expect(res.body.errorMessage).toEqual("Picture with id 2 not found.");
//   });
});