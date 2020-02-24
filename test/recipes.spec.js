const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Recipes Endpoints', ()=> {
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
      beforeEach('insert data', ()=> 
      helpers.seedUsersTable(
        db,
        testUsers
      )
    )
      it(`Responds 200 and an empty array`, () => {
        return supertest(app)
          .get('/recipes')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, [])
      })
    })
    context('Given there are recipes', () => {
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
    it('Responds with 200 and all the Recipes', () => {
      const expectedRecipes = testRecipes.map(recipe => helpers.makeExpectedRecipes(testSpiritType, recipe))
      return supertest(app)
        .get('/recipes')
        .query({keyword: '', filter: 'All'})
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, expectedRecipes)
    })
    it('Responds with 200 and Recipe when filter by spirit', ()=>{
      const expectedSpiritRecipe = testRecipes.map(recipe => helpers.makeExpectedRecipes(testSpiritType, recipe))
      const querySpirit = testSpirit.spirit_cat

      return supertest(app)
        .get('/recipes')
        .query({keyword: '', filter: querySpirit})
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, [expectedSpiritRecipe[1]])
    })
    it('Responds with 200 and Recipe when keyword filter by name', ()=>{
      const expectedSpiritRecipe = testRecipes.map(recipe => helpers.makeExpectedRecipes(testSpiritType, recipe))
      const queryKeyword = testRecipes[0].recipe_name

      return supertest(app)
        .get('/recipes')
        .query({keyword: queryKeyword, filter: 'All'})
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, [expectedSpiritRecipe[0]])
    })
    it('Responds with 200 and Recipe when keyword and filter', ()=>{
      const expectedSpiritRecipe = testRecipes.map(recipe => helpers.makeExpectedRecipes(testSpiritType, recipe))
      const queryKeyword = testRecipes[1].recipe_name
      const querySpirit = testSpirit.spirit_cat

      return supertest(app)
        .get('/recipes')
        .query({keyword: queryKeyword, filter: querySpirit})
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200, [expectedSpiritRecipe[1]])
    })
    })
  })
  describe('GET /recipes/:id', () => {
    context('Given no recipes', () => {
      beforeEach('seed users table', () =>
        helpers.seedUsersTable(db, testUsers)
      )
      it('Responds 404 with error "Recipe Not Found"', () => {
        const recipeId = 123456

        return supertest(app)
          .get(`/recipes/${recipeId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(404, { error: 'Recipe Not Found' })
      })
    })
    context('Given there are recipes', () => {
      beforeEach('insert data', () => 
        helpers.seedOtherTables(
          db,
          testRecipes,
          testSpirits,
          testSpiritType,
          testUsers,
          testFavorites
        )
      )
      it('Responds 200 with recipe', () => {
        const recipeId = 2
        const expectedRecipe = testRecipes[1]
        //testRecipes.map(recipe => helpers.makeExpectedRecipes(testSpiritType, recipe))

        return supertest(app)
          .get(`/recipes/${recipeId}`)
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, expectedRecipe)
      })
    })
  })
})