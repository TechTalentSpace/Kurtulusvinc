// YEAP Event Admin Paneli - Form Gönderimlerini Görüntüleme API
// Basit auth ile korunmuş endpoint

const SUPABASE_URL = 'https://zcjackbzythtefkukxno.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjamFja2J6eXRodGVma3VreG5vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjYwMTA2MiwiZXhwIjoyMDc4MTc3MDYyfQ.E-VbU-cPQHtQ0O8HIoU6xfJ3NGQKgZYaoh-4h9v737c';

// Admin kimlik bilgileri
const ADMIN_USERNAME = 'yeap';
const ADMIN_PASSWORD = 'yeapadmin123';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// Basit auth kontrolü
function checkAuth(req) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return false;
    }
    
    try {
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');
        
        return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    } catch (error) {
        return false;
    }
}

export default async function handler(req, res) {
    // CORS headers'ı HER ZAMAN ekle (preflight dahil)
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    
    // CORS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Auth kontrolü
    if (!checkAuth(req)) {
        res.setHeader('WWW-Authenticate', 'Basic realm="YEAP Admin Panel"');
        return res.status(401).json({
            success: false,
            message: 'Yetkilendirme gerekli'
        });
    }
    
    try {
        // GET: Tüm gönderileri getir
        if (req.method === 'GET') {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/contact_submissions?select=*&order=created_at.desc`,
                {
                    headers: {
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Supabase fetch failed');
            }
            
            const data = await response.json();
            
            return res.status(200).json({
                success: true,
                data: data
            });
        }
        
        // PATCH: Okundu olarak işaretle
        if (req.method === 'PATCH') {
            const { id, read } = req.body;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'ID gerekli'
                });
            }
            
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/contact_submissions?id=eq.${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({ read: read !== false })
                }
            );
            
            if (!response.ok) {
                throw new Error('Supabase update failed');
            }
            
            const data = await response.json();
            
            return res.status(200).json({
                success: true,
                message: 'Güncellendi',
                data: data
            });
        }
        
        // POST: Login kontrolü (session-based olabilir ama basit tutalım)
        if (req.method === 'POST') {
            const { action } = req.body;
            
            if (action === 'login') {
                return res.status(200).json({
                    success: true,
                    message: 'Giriş başarılı'
                });
            }
            
            // İstatistikler
            if (action === 'stats') {
                const response = await fetch(
                    `${SUPABASE_URL}/rest/v1/contact_submissions?select=id,read,created_at`,
                    {
                        headers: {
                            'apikey': SUPABASE_SERVICE_KEY,
                            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                
                if (!response.ok) {
                    throw new Error('Supabase fetch failed');
                }
                
                const data = await response.json();
                
                const stats = {
                    total: data.length,
                    unread: data.filter(item => !item.read).length,
                    read: data.filter(item => item.read).length,
                    today: data.filter(item => {
                        const today = new Date().toISOString().split('T')[0];
                        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
                        return itemDate === today;
                    }).length
                };
                
                return res.status(200).json({
                    success: true,
                    stats: stats
                });
            }
        }
        
        return res.status(405).json({
            success: false,
            message: 'Metod desteklenmiyor'
        });
        
    } catch (error) {
        console.error('Admin API error:', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
}

