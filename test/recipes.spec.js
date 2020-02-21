const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Recipes Endpoints', ()=> {
  let db

  const { testUsers, testSpirits, testSpiritType, testRecipes, testFavorites } = helpers.makeFixtures()
  const testUser = testUsers[0]

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

  describe('GET protected Endpoints', () => {
    beforeEach('insert data', ()=> 
      helpers.seedOtherTables(
        db,
        testRecipes,
        testSpirits,
        testSpiritType,
        testUsers,
        testFavorites
      )
    )
    const protectedEndpoints = [
      {
        name: 'GET /recipes',
        path: '/recipes'
      },
      {
        name: 'GET /recipes/:id',
        path: '/recipes/1'
      }
    ]

    protectedEndpoints.forEach(endpoint => {
      describe(endpoint.name, ()=>{
        it(`Responds with 401 'Missing bearer token' when no bearer token`, ()=>{
          return supertest(app)
            .get(endpoint.path)
            .expect(401, { error: 'Missing Bearer Token' })
        })
        it(`Responds 401 'Unauthorized request' when invalid JWT secret`, ()=>{
          const validUser = testUser
          const invalidSecret = 'bad-secret'
          return supertest(app)
            .get(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
            .expect(401, { error: 'Unauthorized request'})
        })
        it(`Responds 401 'Unauthorized request' when invalid sub in payload`, ()=> {
          const invalidUser = { user_name:'user-not', id: 1 }
          return supertest(app)
            .get(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(invalidUser))
            .expect(401, { error: 'Unauthorized request'})
        })
      })
    })
  })
  describe('GET /recipes', () => {
    context('Given no recipes', () => {
      it(`Responds 200 and an empty array`, () => {
        return supertest(app)
          .get('/recipes')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, [])
      })
    })
  })
})