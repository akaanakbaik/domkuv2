const API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;
const ZONE_ID = import.meta.env.VITE_CLOUDFLARE_ZONE_ID;
const BASE_URL = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`;

export const createDNSRecord = async (name, type, content, ttl = 1) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      name,
      content,
      ttl,
      proxied: false
    })
  });
  return response.json();
};

export const deleteDNSRecord = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};

export const listDNSRecords = async () => {
  const response = await fetch(BASE_URL, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}',
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
