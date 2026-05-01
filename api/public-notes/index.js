const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const tableName = 'public_notes';

const applyCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
};

const getClient = (authorization) => {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authorization ? { Authorization: authorization } : {},
    },
  });
};

module.exports = async (req, res) => {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const client = getClient(req.headers.authorization);

  if (!client) {
    return res.status(500).json({ error: 'Supabase is not configured' });
  }

  if (req.method === 'POST') {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({ error: 'Authorization is required' });
    }

    const {
      data: { user },
      error: userError,
    } = await client.auth.getUser(authorization.replace(/^Bearer\s+/i, ''));

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid authorization' });
    }

    const { noteId, title, content, updatedAt } = req.body || {};
    if (!noteId) {
      return res.status(400).json({ error: 'noteId is required' });
    }

    const id = req.body.id || noteId;
    const payload = {
      id,
      user_id: user.id,
      note_id: noteId,
      title: title || 'Untitled',
      content: content || '',
      updated_at: updatedAt || new Date().toISOString(),
      revoked: false,
    };

    const { data, error } = await client
      .from(tableName)
      .upsert(payload, { onConflict: 'id' })
      .select('id')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const baseUrl = process.env.PUBLIC_WEB_URL || req.headers.origin || '';
    return res.status(200).json({
      id: data.id,
      url: `${baseUrl}/p/${data.id}`,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
