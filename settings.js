module.exports = {
  "port": process.env.PORT || 8920,
  "host": "0.0.0.0",
  "db_url": process.env.DB_URL,
  "password": process.env.PASSWORD,
  "env": process.argv.includes('dev') ? 'development' : 'production'
}
