// src/server.ts
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server'
import { createRouter } from './router'
console.log('Creating server handler...')
export default createStartHandler({
  createRouter,
})(defaultStreamHandler)