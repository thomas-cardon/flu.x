module.exports = {
  "port": process.env.PORT || 8920,
  "host": "0.0.0.0",
  "db_url": "mongodb://manaflux:2v4R8bKCwcRB69s@ds115613.mlab.com:15613/manaflux-server",
  "password": "SAzPgU4x3d",
  "env": process.argv.includes('--dev') ? 'development' : 'production'
}
