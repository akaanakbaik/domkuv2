// api/[...routes].js
import { createClient } from '@supabase/supabase-js';
import { createDNSRecord } from '../../src/utils/cloudflareApi';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Ambil path setelah /api
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = pathname.split('/').filter(Boolean);

  if (pathParts[0] === 'subdomain' && req.method === 'POST') {
    return handleCreateSubdomain(req, res);
  }

  // Jika tidak cocok, kembalikan 404
  res.status(404).json({ message: 'Route not found' });
}

async function handleCreateSubdomain(req, res) {
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

  // Cek jumlah subdomain yang sudah dibuat oleh user ini
  const { count } = await supabase
    .from('subdomains')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id);

  if (count >= 30) {
    return res.status(429).json({ message: 'Max subdomains reached (30)' });
  }

  try {
    const cfRes = await createDNSRecord(`${name}.domku.my.id`, type, content);
    if (cfRes.success) {
      // Simpan ke database Supabase
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

// Konfigurasi untuk Vercel
export const config = {
  api: {
    bodyParser: true,
  },
};
