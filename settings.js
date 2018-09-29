module.exports = {
  "port": process.env.PORT || 8920,
  "host": "0.0.0.0",
  "password": "[REDACTED]",
  "env": process.argv.includes('dev') ? 'development' : 'production'
}
