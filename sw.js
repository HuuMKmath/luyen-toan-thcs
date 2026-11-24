/* Bộ nhớ đệm cho ứng dụng Luyện toán THCS (PWA).
   - Trang và tệp của website: luôn lấy bản mới trên mạng trước, mất mạng mới dùng bản đã lưu.
     Nhờ vậy mỗi lần cập nhật bài, học sinh mở app là thấy ngay bản mới.
   - Phông chữ Google: dùng bản đã lưu cho nhanh.
   - Google Sheet (gửi kết quả, kiểm tra mã) và mọi yêu cầu khác: không bao giờ lưu. */
const CACHE = 'luyentoan-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('luyentoan-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin && url.pathname.startsWith(new URL(self.registration.scope).pathname)) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || offline()))
    );
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
});

function offline() {
  return new Response(
    '<!DOCTYPE html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Chưa có mạng</title><body style="font-family:system-ui,sans-serif;background:#FFF7EC;color:#1E2238;padding:32px;line-height:1.5">' +
    '<h1 style="color:#2F5BEA">Chưa có mạng</h1><p>Trang này chưa được lưu trên máy. Em hãy kết nối mạng rồi mở lại nhé.</p>' +
    '<p>Các bài em đã mở trước đó vẫn vào được khi mất mạng, nhưng cần có mạng để gửi kết quả cho thầy cô.</p></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
