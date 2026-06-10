# 🔥 Deeplyy Dating App

Modern bir tanışma uygulaması — React Native (Expo) frontend ve Express.js backend ile geliştirilmiştir.

---

## 📁 Proje Yapısı

```
dateapptest/
├── backend/           # Express.js API sunucusu
│   ├── src/           # Kaynak kod (routes, middleware, socket, config)
│   ├── sql/           # Veritabanı şema ve seed dosyaları
│   ├── .env           # Ortam değişkenleri
│   └── package.json
├── frontend/          # Expo React Native mobil uygulama
│   ├── src/           # Kaynak kod (screens, components, services, store)
│   ├── assets/        # İkonlar ve görseller
│   ├── App.tsx        # Ana uygulama bileşeni
│   └── package.json
├── kurulum.md         # Kurulum rehberi
└── run.md             # Çalıştırma rehberi
```

---

## 🛠 Teknoloji Yığını

### Backend
| Teknoloji    | Kullanım              |
|--------------|-----------------------|
| Express.js   | REST API              |
| PostgreSQL   | Veritabanı            |
| Socket.io    | Gerçek zamanlı mesajlaşma |
| JWT          | Kimlik doğrulama      |
| bcryptjs     | Şifre hashleme        |
| TypeScript   | Tip güvenliği         |

### Frontend
| Teknoloji          | Kullanım              |
|--------------------|-----------------------|
| React Native       | Mobil UI              |
| Expo               | Geliştirme platformu  |
| React Navigation   | Sayfa yönlendirme     |
| Zustand            | State yönetimi        |
| Axios              | HTTP istekleri        |
| Socket.io Client   | Gerçek zamanlı iletişim |
| TypeScript         | Tip güvenliği         |

---

## ✨ Özellikler

- 👤 Kayıt / Giriş / Profil düzenleme
- 💕 Swipe ile eşleşme (Tinder tarzı)
- 💬 Gerçek zamanlı mesajlaşma (Socket.io)
- 🔍 Keşif filtreleri
- ❤️ Beni beğenenler listesi
- 🚫 Kullanıcı engelleme / engel kaldırma
- ⭐ Premium üyelik sistemi
- 🔒 JWT tabanlı güvenli kimlik doğrulama

---

## 🚀 Hızlı Başlangıç

```bash
# 1. Backend
cd backend && npm install && npm run dev

# 2. Frontend (yeni terminal)
cd frontend && npm install && npx expo start
```

Detaylı talimatlar için:
- 📖 [Kurulum Rehberi](./kurulum.md)
- 🏃 [Çalıştırma Rehberi](./run.md)

---

## 📄 Lisans

Bu proje özel kullanım içindir.
