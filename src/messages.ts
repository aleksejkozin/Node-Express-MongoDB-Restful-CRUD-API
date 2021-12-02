import {Router} from 'express'
import {model, Schema} from 'mongoose'

const Message = model(
  'Message',
  new Schema({
    message: {type: String, required: true},
  }),
)

// Simple CRUD route
export const messages = Router()

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

messages.post(
  '/',
  wrap(req => new Message(req.body).save()),
)

messages.get(
  '/',
  wrap(() => Message.find()),
)

messages.get(
  '/:id',
  wrap(req => Message.findById(req.params.id)),
)

messages.put(
  '/:id',
  wrap(req => Message.findByIdAndUpdate(req.params.id, req.body)),
)

messages.delete(
  '/:id',
  wrap(req => Message.findByIdAndDelete(req.params.id)),
)
