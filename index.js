const http = require('http')
const fs = require('fs')
const url = require('url')
const db = require('./db/consultas')

http
  .createServer(async(req, res) => {
    if(req.url == '/' && req.method == 'GET') {
      fs.readFile('./view/index.html',(error,file) =>{
        if(error) console.error(error)
        res.writeHead(200, {'Content-Type':'text/html'})
        res.end(file)
      })
    }
    if(req.url === '/post' && req.method === 'POST') {
      let body
      req.on('data', datos => body = JSON.parse(datos))
      req.on('end', async () => {
        const datos = await newPost(body)
        res.writeHeader(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(datos))
      })
    }
    if(req.url.startsWith('/post?id') && req.method === 'PUT') {
      const { id } = url.parse(req.url, true).query
      await updatePost(id)
      res.writeHeader(200, {'Content-Type': 'application/json'})
      res.end()
    }
    if(req.url === '/posts' && req.method === 'GET') {
      const posts = await indexPosts()
      res.writeHeader(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify(posts))
    }
  })
  .listen(3000, () => console.log('servidor 3000 funcionando'))