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

  const id = (req.query.id || req.url.split('/').pop() || '').split('?')[0];

  if (req.method === 'GET') {
    let query = client
      .from(tableName)
      .select('id,title,content,updated_at,revoked')
      .eq('revoked', false)
      .or(`id.eq.${id},note_id.eq.${id}`)
      .limit(1);

    let { data, error } = await query.maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      const fallback = await client
        .from(tableName)
        .select('id,title,content,updated_at,revoked')
        .or(`id.eq.${id},note_id.eq.${id}`)
        .limit(1)
        .maybeSingle();
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.revoked) {
      return res.status(404).json({ error: 'Public note not found' });
    }

    return res.status(200).json({
      id: data.id,
      title: data.title,
      content: data.content,
      updatedAt: data.updated_at,
    });
  }

  if (req.method === 'DELETE') {
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

    const { data, error } = await client
      .from(tableName)
      .update({ revoked: true })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Public note not found' });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
