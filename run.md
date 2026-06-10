# 🚀 Projeyi Çalıştırma

> Önce [kurulum.md](./kurulum.md) adımlarının tamamlandığından emin olun.

---

## 1. Backend'i Başlat

```bash
cd backend
npm run dev
```

Başarılı çıktı:

```
🔥 Deeplyy Dating API running on port 3000
   └── Health: http://localhost:3000/api/health
🌱 Seed data loaded
```

| Script         | Açıklama                      |
|----------------|-------------------------------|
| `npm run dev`  | Geliştirme modu (hot-reload)  |
| `npm run build`| TypeScript → JavaScript derle |
| `npm start`    | Production modu (`dist/`)     |

---

## 2. Frontend'i Başlat

Yeni bir terminal aç:

```bash
cd frontend
npx expo start
```

Expo Metro Bundler başlayacak ve terminalde bir **QR kod** görünecektir.

### Cihazda Test Etme

| Platform | Yöntem                                                  |
|----------|---------------------------------------------------------|
| Android  | Expo Go uygulamasını aç → QR kodu tara                 |
| iOS      | Kamera uygulaması ile QR kodu tara → Expo Go'da açılır |
| Web      | Terminalde `w` tuşuna bas                               |

### Diğer Expo Komutları

| Komut                        | Açıklama              |
|------------------------------|-----------------------|
| `npx expo start --android`  | Sadece Android emülatör |
| `npx expo start --ios`      | Sadece iOS simülatör    |
| `npx expo start --web`      | Web tarayıcıda aç      |

---

## ⚠️ Sık Karşılaşılan Sorunlar

### Backend bağlantı hatası
PostgreSQL servisinin çalıştığından ve `backend/.env` içindeki veritabanı bilgilerinin doğru olduğundan emin olun.

### Fiziksel cihazda API'ye ulaşamıyor
`frontend/src/services/api.ts` dosyasındaki `API_BASE_URL`'i bilgisayarınızın yerel IP adresiyle güncelleyin:

```ts
const API_BASE_URL = 'http://192.168.1.X:3000/api';
```

### Metro Bundler cache sorunu
```bash
npx expo start --clear
```
