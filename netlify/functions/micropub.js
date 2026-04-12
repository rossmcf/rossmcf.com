// Micropub endpoint — receives posts from IndieWeb clients, commits Hugo
// content files to GitHub, triggering a Netlify deploy.
//
// Required environment variables (set in Netlify dashboard):
//   GITHUB_TOKEN  — fine-grained PAT with Contents: write on this repo
//
// Optional:
//   SITE_URL      — canonical site URL (default: https://www.rossmcf.com)
//   GITHUB_REPO   — owner/repo (default: rossmcf/rossmcf.com)

const SITE_URL   = (process.env.SITE_URL   || 'https://www.rossmcf.com').replace(/\/$/, '');
const GITHUB_REPO = process.env.GITHUB_REPO || 'rossmcf/rossmcf.com';

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // GET — client discovery queries
  if (event.httpMethod === 'GET') {
    const q = (event.queryStringParameters || {}).q;
    if (q === 'config' || q === 'syndicate-to') {
      return json(200, {});
    }
    return error(400, 'invalid_request', 'Unknown query parameter');
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  // Verify Bearer token
  const authHeader = event.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) {
    return error(401, 'unauthorized', 'Missing Bearer token');
  }
  const token = authHeader.slice(7);

  const me = await verifyToken(token);
  if (!me) {
    return error(403, 'forbidden', 'Token verification failed');
  }
  if (normalise(me) !== normalise(SITE_URL)) {
    return error(403, 'forbidden', 'Token is not valid for this site');
  }

  // Parse body (JSON or form-encoded)
  const contentType = event.headers['content-type'] || '';
  let props;
  try {
    props = parseBody(event.body, contentType);
  } catch (e) {
    return error(400, 'invalid_request', e.message);
  }

  const content = scalar(props.content);
  const name    = scalar(props.name);

  if (!content) {
    return error(400, 'invalid_request', 'content is required');
  }
  if (name) {
    return error(400, 'invalid_request',
      'Article posts (with a title/name) are not supported here — omit the title to post a note');
  }

  // Build Hugo file
  const now      = new Date();
  const pad      = n => String(n).padStart(2, '0');
  const year     = now.getUTCFullYear();
  const month    = pad(now.getUTCMonth() + 1);
  const day      = pad(now.getUTCDate());
  const timeSlug = `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}`;

  const filePath    = `content/micro/${year}-${month}-${day}-${timeSlug}.md`;
  const fileContent = `+++\ndate = ${now.toISOString()}\nslug = "${timeSlug}"\n+++\n\n${content}\n`;

  try {
    await commitFile(filePath, fileContent);
  } catch (e) {
    console.error('GitHub API error:', e.message);
    return error(500, 'server_error', 'Failed to commit post to repository');
  }

  const postUrl = `${SITE_URL}/micro/${year}/${month}/${day}/${timeSlug}/`;

  return { statusCode: 201, headers: { ...CORS, Location: postUrl }, body: '' };
};

// --- helpers ---

async function verifyToken(token) {
  const res = await fetch('https://tokens.indieauth.com/token', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.me || null;
}

function parseBody(body, contentType) {
  if (contentType.includes('application/json')) {
    const data = JSON.parse(body);
    // JSON syntax: { type: ['h-entry'], properties: { content: ['...'] } }
    return data.properties || {};
  }
  // Form-encoded syntax: h=entry&content=...
  const params = new URLSearchParams(body);
  const props  = {};
  for (const [key, value] of params) {
    const k = key.replace(/\[\]$/, '');
    props[k] = k in props ? [].concat(props[k], value) : value;
  }
  return props;
}

function scalar(val) {
  if (!val) return null;
  if (Array.isArray(val)) val = val[0];
  if (val && typeof val === 'object') return val.html || val.value || null;
  return val || null;
}

async function commitFile(path, content) {
  const [owner, repo] = GITHUB_REPO.split('/');
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization:  `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent':   'rossmcf.com-micropub',
      },
      body: JSON.stringify({
        message: 'Add note via Micropub',
        content: Buffer.from(content).toString('base64'),
      }),
    }
  );
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

function json(status, data) {
  return {
    statusCode: status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
}

function error(status, code, description) {
  return {
    statusCode: status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: code, error_description: description }),
  };
}

function normalise(url) {
  return url.replace(/\/$/, '').toLowerCase();
}
