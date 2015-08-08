var express = require('express')
var serveStatic = require('serve-static')

var app = express()

app.use("/DSTWebManager", serveStatic(__dirname + '/DSTWebManager'))
app.listen(8003)