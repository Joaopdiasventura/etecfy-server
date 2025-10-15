import { bootstrap } from '../dist/main.js';

export default async function handler(req, res) {
  const server = await bootstrap();
  return server(req, res);
}
