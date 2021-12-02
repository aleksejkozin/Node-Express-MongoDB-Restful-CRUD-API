import express from 'express'
import bodyParser from 'body-parser'
import {connect} from 'mongoose'
import {messages} from './messages'

connect('...secrets...')
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.log('Could not connect to the database. Error...', err))

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.get('/', (req, res) => res.json({message: 'Server is running :D'}))
app.use('/messages', messages)

// Centralize error handling. Each route should call .catch(next) tho in order for it to work
// Will be much simpler in express 5.0.0, but now you need to call next() on an exception
app.use((err, req, res, next) => res.status(500).json({error: err.message}))

const PORT = 8080
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
