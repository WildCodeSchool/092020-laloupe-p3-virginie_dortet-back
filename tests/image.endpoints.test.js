const request = require('supertest');
const app = require('../app');
const { query } = require('../db_connection');

describe('Test routes', () => {
    const testImage = {
        "Name": "Les aventures de Kala 1",
        "Alt": "CouvKala1",
        "Atelier": 0,
        "Description": "Couverture Kala 1",
        "Device": "Mobile",
    };

    beforeAll(async () => {
        const sql = "TRUNCATE Image";
        await query(sql);
        const sql2 = "INSERT INTO Image SET ?";
        await query(sql2, testImage);
    });

    // Write your tests HERE!
    it('GET /api/images/:id sends a 404 status if the id does not exist', (done) => {
        request(app)
        .get('/api/images/2')
        .expect(404)
        .then(response => {
            const expected = { error: 'User not found' };
            expect(response.body).toEqual(expected);
            done();
        })
    });
    it('GET /api/images/:id sends a 200 status if the id does exist', (done) => {
        request(app)
        .get('/api/images/1')
        .expect(200)
        .then(response => {
            expect(response.body.id).toEqual(1);
            expect(response.body.Name).toEqual("Les aventures de Kala 1");
            done();
    })
    });


  it('GET /api/images sends a 200 status if there are images in the DB', (done) => {
    request(app)
      .get('/api/images')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).toEqual(1);
        done();
      });
  });

  const postImage = {
    "Name": "Les aventures de Kala 2",
    "Alt": "CouvKala2",
    "Atelier": 0,
    "Description": "Couverture Kala 2",
    "Device": "Desktop",
    };

  it('POST /api/images send a status 201 and create a new image ', (done) => {
    request(app)
      .post('/api/images')
      .send(postImage)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.id).toEqual(2);
        expect(response.body.Name).toEqual("Les aventures de Kala 2");
        done();
      });
  });

    const updatedImage = {
        "Name": "Les aventures extraordinaires de Kala 1",
        "Alt": "CouvKala1",
        "Atelier": 0,
        "Description": "Couverture Kala 1",
        "Device": "Mobile",
    };

    it('PUT /api/images/:id send a status 201 and modify an existing image ', (done) => {
    request(app)
        .put('/api/images/1')
        .send(updatedImage)
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
        expect(response.body.id).toEqual(1);
        expect(response.body.Name).toEqual(updatedImage.Name);
        done();
        });
    });

    it('DELETE /api/images/:id send a status 200 and delete a selected image ', (done) => {
        request(app)
            .delete('/api/images/1')
            .expect(200)
            done();
        });
});