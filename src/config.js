module.exports = {
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/linus-server'
}