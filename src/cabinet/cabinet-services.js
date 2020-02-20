const xss = require('xss')

const CabinetService = {
  getAllSpiritsInCabinet(db, id) {
    return db
      .select(
        'spirits.id',
        'spirits.spirit_name',
        'spirits.user_id',
        'spirits.spirit_id',
        'spirit_type.spirit_cat'
      )
      .from('spirits')
      .join(
        'spirit_type',
        'spirits.spirit_id',
        'spirit_type.id'
        )
      .where('user_id', id)
  },

  addSpirit(db, newSpirit) {
    return db
      .insert(newSpirit)
      .into('spirits')
      .returning('*')
      .then(([spirit]) => spirit)
  },

  deleteSpirit(db, spirit_id) {
    return db('spirits')
      .where('id', spirit_id)
      .delete()
  },

  serializeSpirit(spirit) {
    return {
      id: spirit.id,
      spirit_name: xss(spirit.spirit_name),
      spirit_id: spirit.spirit_id,
      spirit_img: spirit.spirit_img || null,
      user_id: spirit.user_id
    }
  }
}

module.exports = CabinetService