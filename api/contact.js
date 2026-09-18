// YEAP Event İletişim Formu API Endpoint
// Rate limiting ile spam önleme dahil

const SUPABASE_URL = 'https://zcjackbzythtefkukxno.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjamFja2J6eXRodGVma3VreG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDEwNjIsImV4cCI6MjA3ODE3NzA2Mn0.xSR9meaeu-J--jImwh0BDNbm2u9UMA65nbI8vYZS2z0';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// IP adresini al
function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           'unknown';
}

// Rate limiting kontrolü
async function checkRateLimit(ipAddress) {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Bugünkü rate limit kaydını kontrol et
        const checkResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/rate_limiting?ip_address=eq.${ipAddress}&reset_date=eq.${today}&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        
        const records = await checkResponse.json();
        
        if (records && records.length > 0) {
            const record = records[0];
            
            // 10 isteği geçtiyse engelle
            if (record.request_count >= 10) {
                return { allowed: false, remaining: 0 };
            }
            
            // Sayacı artır
            await fetch(
                `${SUPABASE_URL}/rest/v1/rate_limiting?id=eq.${record.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        request_count: record.request_count + 1,
                        last_request: new Date().toISOString()
                    })
                }
            );
            
            return { allowed: true, remaining: 10 - record.request_count - 1 };
        } else {
            // Yeni kayıt oluştur
            await fetch(
                `${SUPABASE_URL}/rest/v1/rate_limiting`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        ip_address: ipAddress,
                        request_count: 1,
                        reset_date: today
                    })
                }
            );
            
            return { allowed: true, remaining: 9 };
        }
    } catch (error) {
        console.error('Rate limit error:', error);
        // Hata durumunda izin ver (kullanıcıyı cezalandırma)
        return { allowed: true, remaining: 10 };
    }
}

// Ana handler fonksiyonu
export default async function handler(req, res) {
    // CORS headers'ı HER ZAMAN ekle (preflight dahil)
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });
    
    // CORS preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Sadece POST metoduna izin ver
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Sadece POST metodu destekleniyor' 
        });
    }
    
    try {
        const { name, email, message } = req.body;
        
        // Validasyon
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm alanları doldurun'
            });
        }
        
        // Email format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir e-posta adresi girin'
            });
        }
        
        // Uzunluk kontrolleri
        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'İsim çok uzun (maksimum 100 karakter)'
            });
        }
        
        if (message.length > 2000) {
            return res.status(400).json({
                success: false,
                message: 'Mesaj çok uzun (maksimum 2000 karakter)'
            });
        }
        
        // IP adresini al
        const ipAddress = getClientIp(req);
        
        // Rate limiting kontrolü
        const rateLimitCheck = await checkRateLimit(ipAddress);
        
        if (!rateLimitCheck.allowed) {
            return res.status(429).json({
                success: false,
                message: 'Çok fazla istek gönderdiniz. Lütfen yarın tekrar deneyin.',
                remaining: 0
            });
        }
        
        // User agent bilgisi
        const userAgent = req.headers['user-agent'] || 'unknown';
        
        // Supabase'e kaydet
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/contact_submissions`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    message: message.trim(),
                    ip_address: ipAddress,
                    user_agent: userAgent
                })
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Supabase error:', errorData);
            throw new Error('Veritabanı hatası');
        }
        
        const data = await response.json();
        
        return res.status(200).json({
            success: true,
            message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
            remaining: rateLimitCheck.remaining
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            success: false,
            message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        });
    }
}

