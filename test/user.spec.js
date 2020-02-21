const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', ()=>{
  let db

  const { testUsers } = helpers.makeFixtures()
  const testUser = testUsers[0]

  before('make knex instance', ()=>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after('disconnect from server', ()=> db.destroy())

  before('cleanup', ()=> helpers.cleanTables(db))

  afterEach('cleanup', ()=> helpers.cleanTables(db))

  describe('POST /user', ()=>{
    context('User Validation', ()=>{
      beforeEach('insert user', ()=>
        helpers.seedUsersTable(db, testUsers)
      )

      const requiredFields = ['user_name', 'password', 'nickname']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          password: 'test password',
          nickname: 'test nickname'
        }

        it(`Responds with 400 required error when ${field} is missing`, ()=>{
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/user')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })
      it(`Responds 400 'Password must be longer than 8 characters' when empty password`, ()=>{
        const userShortPassword = {
          user_name: 'test user',
          password: 'Test1',
          nickname: 'testy'
        }

        return supertest(app)
          .post('/user')
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters`})
      })
      it(`Responds 400 'Password must be shorter than 72 characters' when long password`, ()=>{
        const userLongPassword = {
          user_name: 'test user',
          password: '*'.repeat(73),
          nickname: 'testy'
        }

        return supertest(app)
          .post('/user')
          .send(userLongPassword)
          .expect(400, { error: 'Password must be shorter than 72 characters' })
      })
      it(`Responds 400 when password starts with spaces`, ()=>{
        const userPasswordStartsSpaces = {
          user_name: 'test user',
          password: ' testPassword',
          nickname: 'testy'
        }

        return supertest(app)
          .post('/user')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: 'Password must not start or end with empty spaces'})
      })
      it(`Responds 400 when password ends with spaces`, ()=>{
        const userPasswordStartsSpaces = {
          user_name: 'test user',
          password: 'testPassword ',
          nickname: 'testy'
        }

        return supertest(app)
          .post('/user')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: 'Password must not start or end with empty spaces'})
      })
      it(`Responds 400 when password isn't complex enough`, ()=>{
        const userSimplePassword = {
          user_name: 'test name',
          password: 'passwords',
          nickname: 'testy'
        }

        return supertest(app)
          .post('/user')
          .send(userSimplePassword)
          .expect(400, { error: 'Password must contain an uppercase, lowercase, and number'})
      })
      it(`Responds 400 'Username already taken`, ()=>{
        const duplicateUser = {
          user_name: testUser.user_name,
          password: 'Password2',
          nickname: 'testy'
        }
        return supertest(app)
          .post('/user')
          .send(duplicateUser)
          .expect(400, { error: 'Username taken'})
      })
    })
    context('Happy path', ()=>{
      it(`Responds 201, serialized User, storing bcryped password`, ()=>{
        const newUser = {
          user_name: 'test user_name',
          password: 'Passwordtest3',
          nickname: 'test nickname'
        }

        return supertest(app)
          .post('/user')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.user_name).to.eql(newUser.user_name)
            expect(res.body).to.have.property('password')
            expect(res.body.nickname).to.eql(newUser.nickname)
          })
          .expect(res => {
            db
              .from('linus_user')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name)
                expect(row.nickname).to.eql(newUser.nickname)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          })
      })
    })
  })
})