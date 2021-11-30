import {Router} from 'express'
import {model, Schema} from 'mongoose'

const Message = model(
  'Message',
  new Schema({
    message: {type: String, required: true},
  }),
)

// Simple CRUD route
export const message = Router()

// This wrap will return 404 on an empty result
// Or will call next() for exception
const wrap = handler => {
  return async (req, res, next) => {
    try {
      const result = await handler.call(this, req, res, next)
      result ? res.send(result) : res.status(404).send('Not found')
    } catch (e) {
      next(e)
    }
  }
}

message.post(
  '/',
  wrap(req => new Message(req.body).save()),
)

message.get(
  '/',
  wrap(() => Message.find()),
)

message.get(
  '/:id',
  wrap(req => Message.findById(req.params.id)),
)

message.put(
  '/:id',
  wrap(req => Message.findByIdAndUpdate(req.params.id, req.body)),
)

message.delete(
  '/:id',
  wrap(req => Message.findByIdAndDelete(req.params.id)),
)
