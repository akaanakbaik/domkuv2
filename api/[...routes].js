import { supabase } from '../../src/utils/supabaseClient';
import { createDNSRecord } from '../../src/utils/cloudflareApi';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, type, content } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization header' });
  }

  const apiKey = authHeader.substring(7);
  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('api_key', apiKey)
    .single();

  if (error || !user) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  const {  userSubs, count } = await supabase
    .from('subdomains')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  if (count >= 30) {
    return res.status(429).json({ message: 'Max subdomains reached (30)' });
  }

  try {
    const cfRes = await createDNSRecord(`${name}.domku.my.id`, type, content);
    if (cfRes.success) {
      await supabase.from('subdomains').insert([{ user_id: user.id, name: `${name}.domku.my.id`, type, content, cf_id: cfRes.result.id }]);
      res.status(200).json({
        "author": "Aka",
        "email_author": "akaanakbaik17@proton.me",
        "message": "Subdomain created successfully",
        "result": cfRes.result
      });
    } else {
      res.status(500).json({ message: 'Failed to create DNS record', error: cfRes.errors });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
    }
