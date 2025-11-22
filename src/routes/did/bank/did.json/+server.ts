import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  // Vite cho phép import JSON; nếu cần, bật "resolveJsonModule" trong tsconfig
  const mod = await import('$lib/did/bank/did.json');
  const body = JSON.stringify(mod.default ?? mod, null, 2);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="did.json"',
      'Cache-Control': 'no-store'
    }
  });
};
