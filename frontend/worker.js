// Cloudflare Worker entry point for the TechFix Pro frontend.
//
// Static files come from the Vite build in ./dist. Requests under /api/ are
// proxied server-side to the Render-hosted Spring Boot API, so the browser only
// talks to this Worker's origin and no CORS configuration is needed.
//
// The app stays online with the user's PC closed: both the static assets and
// the API live in the cloud.

const RENDER_ORIGIN = 'https://pc-troubleshooter-api.onrender.com';

async function proxy(request) {
  const incoming = new URL(request.url);
  const target = RENDER_ORIGIN + incoming.pathname + incoming.search;

  const headers = new Headers(request.headers);
  // Let fetch set the correct host and strip hop-by-hop / client metadata.
  for (const name of [
    'host',
    'origin',
    'referer',
    'cf-connecting-ip',
    'cf-ipcountry',
    'cf-ray',
    'cf-visitor',
    'x-forwarded-proto',
    'x-real-ip',
  ]) {
    headers.delete(name);
  }

  // Render free tier can take ~50s to wake from sleep. Allow enough time.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 75000);

  try {
    const init = {
      method: request.method,
      headers,
      redirect: 'manual',
      signal: controller.signal,
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      init.body = await request.arrayBuffer();
    }
    return await fetch(target, init);
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      try {
        return await proxy(request);
      } catch (_) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'API unavailable. Please try again in a moment.',
          }),
          {
            status: 503,
            headers: {
              'content-type': 'application/json',
              'access-control-allow-origin': '*',
            },
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
