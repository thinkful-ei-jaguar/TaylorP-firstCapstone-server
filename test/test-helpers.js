const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user1',
      password: 'testPassword1',
      nickname: 'TU1'
    },
    {
      id: 2,
      user_name: 'test-user2',
      password: 'testPassword2',
      nickname: 'TU2'
    },
    {
      id: 3,
      user_name: 'test-user3',
      password: 'testPassword3',
      nickname: 'TU3'
    }
  ]
}

function makeSpiritsArray(users, spiritType) {
  return [
    {
      id: 1,
      spirit_name: 'Test Spirit 1',
      spirit_id: spiritType[2].id,
      user_id: users[0].id
    },
    {
      id: 2,
      spirit_name: 'Test Spirit 2',
      spirit_id: spiritType[2].id,
      user_id: users[0].id
    },
    {
      id: 3,
      spirit_name: 'Test Spirit 3',
      spirit_id: spiritType[0].id,
      user_id: users[1].id
    },
    {
      id: 4,
      spirit_name: 'Test Spirit 4',
      spirit_id: spiritType[1].id,
      user_id: users[1].id
    },
    {
      id: 5,
      spirit_name: 'Test Spirit 5',
      spirit_id: spiritType[0].id,
      user_id: users[2].id
    }
  ]
}

function makeSpiritTypeArray() {
  return [
    {
      id: 1,
      spirit_cat: 'firstSpirit'
    },
    {
      id: 2,
      spirit_cat: 'secondSpirit'
    },
    {
      id: 3,
      spirit_cat: 'thirdSpirit'
    }
  ]
}

function makeFavoritesArray(users, recipes) {
  return [
    {
      id: 1,
      recipe_id: recipes[0].id,
      user_id: users[0].id
    },
    {
      id: 2,
      recipe_id: recipes[1].id,
      user_id: users[0].id
    },
    {
      id: 3,
      recipe_id: recipes[2].id,
      user_id: users[2].id
    },
    {
      id: 4,
      recipe_id: recipes[1].id,
      user_id: users[1].id
    },
  ]
}

function makeRecipesArray(spiritType) {
  return [
    {
      id: 1,
      recipe_name: 'First Test Recipe',
      recipe_img: 'img',
      recipe_ingredients: 'test ingredient1,test ingredient2',
      recipe_prep: 'make the test, test it',
      spirit_id: spiritType[2].id,
      tags: null
    },
    {
      id: 2,
      recipe_name: 'Second Test Recipe',
      recipe_img: 'img',
      recipe_ingredients: 'test ingredient1,test ingredient2',
      recipe_prep: 'make the test, test it',
      spirit_id: spiritType[0].id,
      tags: null
    },
    {
      id: 3,
      recipe_name: 'Third Test Recipe',
      recipe_img: 'img',
      recipe_ingredients: 'test ingredient1,test ingredient2',
      recipe_prep: 'make the test, test it',
      spirit_id: spiritType[1].id,
      tags: null
    }
  ]
}

function makeFixtures() {
  const testUsers = makeUsersArray()
  const testSpiritType = makeSpiritTypeArray()
  const testSpirits = makeSpiritsArray(testUsers, testSpiritType)
  const testRecipes = makeRecipesArray(testSpiritType)
  const testFavorites = makeFavoritesArray(testUsers, testRecipes)

  return { testUsers, testSpiritType, testSpirits, testRecipes, testFavorites }
}

function makeExpectedRecipes(spirit_type, recipes) {
  const spirit_cat = spirit_type.find(type => type.id === recipes.spirit_id)

  return {
    id: recipes.id,
    recipe_name: recipes.recipe_name,
    recipe_img: recipes.recipe_img,
    recipe_ingredients: recipes.recipe_ingredients,
    recipe_prep: recipes.recipe_prep,
    spirit_cat: spirit_cat.spirit_cat
  }
}

function makeExpectedSpirits(spirit, spirit_type) {
  const spirit_cat = spirit_type.find(type => type.id === spirit.spirit_id)


  return {
    id: spirit.id,
    spirit_name: spirit.spirit_name,
    spirit_cat: spirit_cat.spirit_cat,
    user_id: spirit.user_id,
    spirit_id: spirit.spirit_id
  }
}

function makeExpectedFavorites(favorite, recipes) {
  const recipe = recipes.find(r => r.id === favorite.recipe_id)
  const recipeName = recipe.recipe_name
  const spirit_id = recipe.spirit_id
  return {
    favorite_id: favorite.id,
    id: favorite.recipe_id,
    user_id: favorite.user_id,
    recipe_name: recipeName,
    spirit_id,
  }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      recipes,
      spirits,
      spirit_type,
      linus_user,
      favorites
      restart identity cascade`
  )
}

function seedUsersTable( db, users) {
  const preppedUsers = users.map(user=>({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('linus_user').insert(preppedUsers)
  .then((()=>
    db.raw(`SELECT setval('linus_user_id_seq', ?)`, [users[users.length -1].id])
  ))
}

function seedOtherTables( db, recipes, spirits, spiritType, users, favorites) {
  return db.transaction(async trx => {
    await seedUsersTable(trx, users)
    await trx.into('spirit_type').insert(spiritType)
    await trx.raw(`SELECT setval('spirit_type_id_seq', ?)`, [spiritType[spiritType.length -1].id])
    await trx.into('spirits').insert(spirits)
    await trx.raw(`SELECT setval('spirits_id_seq', ?)`, [spirits[spirits.length -1].id])
    await trx.into('recipes').insert(recipes)
    await trx.raw(`SELECT setval('recipes_id_seq', ?)`, [recipes[recipes.length -1].id])
    await trx.into('favorites').insert(favorites)
    await trx.raw(`SELECT setval('favorites_id_seq', ?)`, [favorites[favorites.length -1].id])
  })
}

function seedMaliciousSpiirt(db, users, spirit) {
  return seedUsersTable(db, users)
    .then(()=>
    db.into('spirits')
      .insert(spirit)
    )
}

function makeAuthHeader(user, secret=process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id}, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeSpiritsArray,
  makeSpiritTypeArray,
  makeRecipesArray,
  makeFavoritesArray,
  makeAuthHeader,
  makeFixtures,
  makeExpectedRecipes,
  makeExpectedSpirits,
  makeExpectedFavorites,

  cleanTables,
  seedUsersTable,
  seedOtherTables,
  seedMaliciousSpiirt
}