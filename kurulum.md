# 🔧 Kurulum Rehberi

## Gereksinimler

| Araç         | Versiyon  | Açıklama                        |
|--------------|-----------|--------------------------------|
| Node.js      | ≥ 18.x    | Backend & Frontend çalıştırma  |
| npm          | ≥ 9.x     | Paket yöneticisi               |
| PostgreSQL   | ≥ 14.x    | Veritabanı                     |
| Expo Go      | Son sürüm | Mobil cihazda test (App Store / Play Store) |

---

## 1. Projeyi Klonla

```bash
git clone <repo-url>
cd dateapptest
```

---

## 2. Veritabanı Kurulumu

PostgreSQL üzerinde veritabanını oluştur ve şemayı yükle:

```bash
# PostgreSQL'e bağlan
psql -U postgres

# Veritabanını oluştur
CREATE DATABASE flame_dating;

# Bağlantıyı kapat
\q

# Şemayı yükle
psql -U postgres -d flame_dating -f backend/sql/schema.sql

# (Opsiyonel) Örnek verileri yükle
psql -U postgres -d flame_dating -f backend/sql/seed.sql
```

---

## 3. Backend Kurulumu

```bash
cd backend
npm install
```

### Ortam Değişkenleri

`backend/.env` dosyasını kendi ortamınıza göre düzenleyin:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<şifreniz>
DB_NAME=flame_dating
JWT_SECRET=<güçlü-bir-secret>
JWT_REFRESH_SECRET=<güçlü-bir-refresh-secret>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:8081
```

---

## 4. Frontend Kurulumu

```bash
cd frontend
npm install
```

> **Not:** Frontend, `src/services/api.ts` dosyasındaki `API_BASE_URL` değeri üzerinden backend'e bağlanır. Varsayılan olarak `http://localhost:3000/api` şeklindedir. Fiziksel cihazda test ediyorsanız bunu bilgisayarınızın yerel IP adresiyle değiştirmeniz gerekebilir (ör. `http://192.168.1.x:3000/api`).

---

## ✅ Kurulum Tamamlandı

Projeyi çalıştırmak için [run.md](./run.md) dosyasına bakın.
