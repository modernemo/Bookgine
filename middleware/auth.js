import express from 'express';
const app = express()

app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})