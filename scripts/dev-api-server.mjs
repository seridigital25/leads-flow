import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outdir = path.join(root, 'node_modules', '.cache', 'api-dev-build');
const PORT = process.env.API_DEV_PORT || 3001;

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/dev-api-server.mjs');
  process.exit(1);
}

const entries = {
  'leads': 'api/leads.ts',
  'leads/[id]': 'api/leads/[id].ts',
  'owner/login': 'api/owner/login.ts',
  'owner/logout': 'api/owner/logout.ts',
  'owner/session': 'api/owner/session.ts',
};

async function buildAll() {
  await esbuild.build({
    entryPoints: Object.values(entries).map((p) => path.join(root, p)),
    outdir,
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    outExtension: { '.js': '.mjs' },
  });
}

function bundledPath(entryFile) {
  const base = entryFile.replace(/^api\//, '').replace(/\.ts$/, '');
  return path.join(outdir, `${base}.mjs`);
}

function matchRoute(pathname) {
  if (pathname === '/api/leads') return { entry: entries['leads'], params: {} };
  const leadIdMatch = pathname.match(/^\/api\/leads\/([^/]+)$/);
  if (leadIdMatch) return { entry: entries['leads/[id]'], params: { id: leadIdMatch[1] } };
  if (pathname === '/api/owner/login') return { entry: entries['owner/login'], params: {} };
  if (pathname === '/api/owner/logout') return { entry: entries['owner/logout'], params: {} };
  if (pathname === '/api/owner/session') return { entry: entries['owner/session'], params: {} };
  return null;
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      if (!data) return resolve(undefined);
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(undefined);
      }
    });
  });
}

function enhanceResponse(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(body));
  };
  return res;
}

await buildAll();
console.log(`API dev functions built to ${outdir}`);

const server = http.createServer(async (req, res) => {
  enhanceResponse(res);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const route = matchRoute(url.pathname);
  if (!route) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  req.query = route.params;
  req.body = await readBody(req);

  try {
    const mod = await import(`${bundledPath(route.entry)}?t=${Date.now()}`);
    await mod.default(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

server.listen(PORT, () => {
  console.log(`Local API dev server running at http://localhost:${PORT} (proxied from Vite at /api)`);
});
