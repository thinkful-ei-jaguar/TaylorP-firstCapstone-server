const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Favorites Endpoints', () => {
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

  describe('GET /favorites/:id', () => {
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
    it('Responds 200 with array of Favorites', () => {
      const user_id = testUser.id
      const Favorites = testFavorites.map(f => helpers.makeExpectedFavorites(f, testRecipes))
      const expectedFavorites = Favorites.filter(f => f.user_id === user_id)
    
      return supertest(app)
        .get(`/favorites/${user_id}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, expectedFavorites)
    })
  })
  describe('POST /favorites', () => {
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
    it('Responds 201 with favorite card added', () => {
      const user_id = testUser.id
      const newfave = {
        user_id,
        recipe_id: testRecipes[0].id
      }

      return supertest(app)
        .post('/favorites')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newfave)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('favorite_id')
          expect(res.body.user_id).to.eql(newfave.user_id)
          expect(res.body.id).to.eql(newfave.recipe_id)
        })
    })
  })
  describe('DELETE /favorites', () => {
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
    it('Responds 204', () => {
      const user_id = testUser.id
      const recipe_id = testRecipes[0].id
      const expectedFavoritesList = testFavorites.filter(fave => fave.id === recipe_id)

      const favoriteToRemove = { user_id, recipe_id }
      return supertest(app)
        .delete('/favorites')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(favoriteToRemove)
        .expect(204)
        .then(res => {
          supertest(app)
            .get('/favorites')
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(expectedFavoritesList)
        })
    })
  })
})