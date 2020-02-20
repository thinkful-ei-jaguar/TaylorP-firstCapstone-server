module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/linus-server',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
}