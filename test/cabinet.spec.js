const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Cabinet Endpoints', () => {
  let db

  const { testUsers, testSpirits, testSpiritType, testRecipes, testFavorites } = helpers.makeFixtures()
  const testUser = testUsers[0]
  const testSpirit = testSpiritType[0]

  before('make Knex instance', ()=>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })
  after('disconnect from db', ()=>db.destroy())
  before('cleanup tables', ()=>helpers.cleanTables(db))
  afterEach('cleanup tables', ()=>helpers.cleanTables(db))

  describe('GET /cabinet/:id', () => {
    beforeEach('Insert data', () => 
    helpers.seedOtherTables(
      db,
      testRecipes,
      testSpirits,
      testSpiritType,
      testUsers,
      testFavorites
    )
    )
    it('Responds 200 with spirits', () => {
      const userId = testUser.id
      const expectedSpirits = testSpirits.map(s => helpers.makeExpectedSpirits(s, testSpiritType))
      return supertest(app)
        .get(`/cabinet/${userId}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, [expectedSpirits[1], expectedSpirits[0]])
    })
  })
  describe('POST /cabinet/:id', () => {
    beforeEach('Insert data', () => 
      helpers.seedOtherTables(
        db,
        testRecipes,
        testSpirits,
        testSpiritType,
        testUsers,
        testFavorites
      )
    )
    it('Creates a spirit card, responding 201', () => {
      const newSpirit = {
        spirit_name: 'new spirit',
        spirit_id: 1,
        user_id: testUser.id
      }
      const user_id = testUser.id

      return supertest(app)
        .post(`/cabinet/${user_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newSpirit)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.spirit_name).to.eql(newSpirit.spirit_name)
          expect(res.body.spirit_id).to.eql(newSpirit.spirit_id)
          expect(res.body.user_id).to.eql(newSpirit.user_id)
        })
    })
    it('Responds 400 when Spirit Name is missing', () => {
      const newSpirit = {
        spirit_name: null,
        spirit_id: 1,
        user_id: testUser.id
      }
      const user_id = testUser.id

      return supertest(app)
        .post(`/cabinet/${user_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newSpirit)
        .expect(400, { error: `Missing 'Spirit Name' in request body` })
    })
  })
  describe('DELETE /cabinet/:id', () => {
    beforeEach('Insert data', () => 
      helpers.seedOtherTables(
        db,
        testRecipes,
        testSpirits,
        testSpiritType,
        testUsers,
        testFavorites
      )
    )
    it('Responds 204 when spirit deleted', () => {
      const user_id = testUser.id
      const spiritToBeDeleted = {id: 1}
      const spiritList = testSpirits.map(s => helpers.makeExpectedSpirits(s, testSpiritType))
      const expectedSpiritList = spiritList.filter(spirit => spirit.id === spiritToBeDeleted)
      return supertest(app)
        .delete(`/cabinet/${user_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(spiritToBeDeleted)
        .expect(204)
        .then( res => {
          supertest(app)
            .get(`/cabinet/${user_id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(expectedSpiritList)
        })
    })
  })
})