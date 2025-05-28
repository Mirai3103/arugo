import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from '@repo/trpc';
import { auth } from '@repo/auth/server';
import { cors } from 'hono/cors';
const app = new Hono();

app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['*'],
  allowHeaders: ['*'],
}))


app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})
app.use(
  '/api/trpc/*',
  trpcServer({
    endpoint: '/api/trpc', 
    router: appRouter,
  })
);
export type AppType = typeof app;
export default { port: 8080, fetch: app.fetch };