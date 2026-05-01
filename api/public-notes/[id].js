const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const tableName = 'public_notes';

const getClient = (authorization) => {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: authorization ? { Authorization: authorization } : {},
    },
  });
};

module.exports = async (req, res) => {
  const client = getClient(req.headers.authorization);

  if (!client) {
    return res.status(500).json({ error: 'Supabase is not configured' });
  }

  const id = req.query.id || req.url.split('/').pop();

  if (req.method === 'GET') {
    const { data, error } = await client
      .from(tableName)
      .select('id,title,content,updated_at,revoked')
      .eq('id', id)
      .eq('revoked', false)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
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
