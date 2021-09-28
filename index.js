// require your server and launch it here
const server = require('./api/server')

server.listen(3333, () => {
    console.log('listening on 3333')
})