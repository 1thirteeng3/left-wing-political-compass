import DATA from './data/correntes.json';

export const config = { runtime: 'edge' };

export default function handler() {
  return new Response(JSON.stringify(DATA, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public,max-age=3600',
    },
  });
}
