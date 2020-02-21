const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', ()=>{
  let db

  const { testUsers } = helpers.makeFixtures()
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

  describe('POST /auth/login', ()=>{
    beforeEach('insert users', ()=>
    helpers.seedUsersTable(db, testUsers)
    )
    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password
      }
      it(`Responds with 400 required error when '${field}' is missing`, ()=>{
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/auth/login')
          .send(loginAttemptBody)
          .expect(400, {error: `Missing '${field}' in request body`})
      })
    })
    it(`Responds 400 'Invalid user_name or password' when bad user_name`, ()=>{
      const userInvalidUsername = {
        user_name: 'user_not',
        password: 'existy'
      }
      return supertest(app)
        .post('/auth/login')
        .send(userInvalidUsername)
        .expect(400, { error: `Incorrect Username or Password` })
    })
    it(`Responds 400 'Invalid user_name or password' when bad password`, ()=>{
      const userInvalidPassword = {
        user_name: testUser.user_name,
        password: 'existy'
      }
      return supertest(app)
        .post('/auth/login')
        .send(userInvalidPassword)
        .expect(400, { error: `Incorrect Username or Password` })
    })
    it('Responds 200 and JWT auth Token and user ID using secret when valid', ()=>{
      const userValid = {
        user_name: testUser.user_name,
        password: testUser.password
      }
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          algorithm: 'HS256',
        }
      )
      const expectedID = testUser.id
      
      return supertest(app)
        .post('/auth/login')
        .send(userValid)
        .expect(200, {
          authToken: expectedToken,
          user_id: expectedID
        })
    })
  })
})