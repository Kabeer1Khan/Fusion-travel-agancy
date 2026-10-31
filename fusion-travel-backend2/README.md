# Fusion Travel Agency: Backend (Node.js + Express + MongoDB)

यह REST API तुम्हारे React frontend (`https://fusion-travel-agancy.vercel.app`) के लिए बनाई गई है।

## 1. पहले ये चीज़ें install करो (सिर्फ एक बार)

| चीज़ | कहाँ से | Check करने का command |
|------|---------|----------------------|
| Node.js (LTS version) | https://nodejs.org | `node -v` |
| Git | https://git-scm.com | `git --version` |
| MongoDB Atlas account (free) | https://www.mongodb.com/atlas | (browser में) |

## 2. MongoDB Atlas setup (Database)

1. Atlas पर account बनाओ -> **Create a cluster** -> **Free (M0)** चुनो।
2. **Database Access** -> *Add New Database User* -> username और password बनाओ (याद रखना)।
3. **Network Access** -> *Add IP Address* -> **Allow access from anywhere** (`0.0.0.0/0`)। यह Render पर deploy करने के लिए भी चाहिए।
4. Cluster पर **Connect** -> **Drivers** -> connection string कॉपी करो। यह ऐसी दिखेगी:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. `.net/` के बाद database का नाम जोड़ दो: `.net/fusion_travel?retryWrites=...`
6. अगर password में `@ # / :` जैसे special characters हैं तो उन्हें URL-encode करो (या सिर्फ अक्षर और अंकों वाला password रखो)।

## 3. Project चलाओ

```bash
# project folder के अंदर terminal खोलो
npm install                 # सारी libraries (node_modules) download होंगी
cp .env.example .env        # Windows CMD पर: copy .env.example .env
```

अब `.env` फ़ाइल खोलकर `MONGO_URI` और `JWT_SECRET` भरो। JWT_SECRET बनाने के लिए:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

```bash
npm run seed    # admin user + 6 sample packages बनेंगे
npm run dev     # server चालू. file save करते ही अपने-आप restart होगा
```

Terminal में `MongoDB connected` और `Server running on port 5000` दिखे तो सब सही है।
Browser में `http://localhost:5000` खोलो तो JSON message दिखेगा।

## 3b. Admin Dashboard

Server चालू होने के बाद browser में खोलो: **http://localhost:5000/dashboard**
Login: `.env` वाला `ADMIN_EMAIL` / `ADMIN_PASSWORD` (पहले `npm run seed` चलाना होगा)।

Dashboard backend के साथ ही चलता है (`dashboard/` folder), इसलिए अलग deploy या CORS setting की ज़रूरत नहीं।
Online होने पर: `https://YOUR-BACKEND.onrender.com/dashboard`

## 4. Folder structure (कौन सी फ़ाइल क्या करती है)

```
server.js                  # entry point: DB connect करके server चालू करता है
src/
  app.js                   # Express setup: cors, helmet, json parser, routes
  config/db.js             # MongoDB connection
  models/                  # Database की tables (schemas)
    User.js  TourPackage.js  Booking.js  Inquiry.js  Review.js
  controllers/             # असली logic (क्या करना है)
  routes/                  # URL -> controller को जोड़ते हैं
  middleware/
    auth.js                # protect (login check) और adminOnly
    error.js               # सारे errors का एक जैसा JSON response
  utils/                   # छोटे helper functions
  seed.js                  # sample data भरने की script
dashboard/                 # Admin dashboard (index.html, styles.css, app.js), /dashboard पर serve होता है
```

**Request का सफ़र:** Frontend -> `routes` -> `middleware` (login check) -> `controller` -> `model` -> MongoDB -> JSON response वापस।

## 5. API Endpoints

`Auth` = header में `Authorization: Bearer <token>` चाहिए। `Admin` = सिर्फ admin।

| Method | URL | Access | काम |
|--------|-----|--------|-----|
| POST | `/api/auth/register` | Public | नया account |
| POST | `/api/auth/login` | Public | Login, token मिलेगा |
| GET | `/api/auth/me` | Auth | अपनी profile |
| PUT | `/api/auth/me` | Auth | name/phone बदलना |
| GET | `/api/packages` | Public | List. Filters: `search, category, minPrice, maxPrice, featured, sort, page, limit` |
| GET | `/api/packages/:idOrSlug` | Public | एक package |
| POST | `/api/packages` | Admin | नया package |
| PUT | `/api/packages/:id` | Admin | Package edit |
| DELETE | `/api/packages/:id` | Admin | Package delete |
| GET | `/api/packages/:id/reviews` | Public | Reviews |
| POST | `/api/packages/:id/reviews` | Auth | Review देना (rating 1-5) |
| DELETE | `/api/reviews/:id` | Auth/Admin | Review हटाना |
| POST | `/api/bookings` | Auth | Booking बनाना |
| GET | `/api/bookings/my` | Auth | मेरी bookings |
| GET | `/api/bookings` | Admin | सारी bookings. Filters: `status, paymentStatus, search, page, limit` |
| GET | `/api/bookings/:id` | Auth | एक booking (मालिक/admin) |
| PATCH | `/api/bookings/:id/cancel` | Auth | Booking cancel |
| PATCH | `/api/bookings/:id/status` | Admin | status / paymentStatus बदलना |
| GET | `/api/packages?all=true` | Admin | Inactive (hidden) packages भी दिखाओ |
| POST | `/api/inquiries` | Public | Contact / Enquiry form (aliases: `/api/contact`, `/api/enquiries`) |
| POST | `/api/subscribe` | Public | Newsletter |
| GET | `/api/testimonials` | Public | Home page के लिए latest reviews |
| GET | `/api/admin/stats` | Admin | Dashboard के सारे numbers, charts, top packages |
| GET | `/api/admin/reviews` | Admin | सारे reviews (package + customer के साथ) |
| GET | `/api/admin/users` | Admin | Registered customers |
| GET | `/api/admin/subscribers` | Admin | Newsletter list |
| GET | `/api/inquiries` | Admin | सारी inquiries |
| PATCH | `/api/inquiries/:id/status` | Admin | `new/contacted/closed` |

## 6. Test कैसे करें (curl)

```bash
# Packages देखो
curl http://localhost:5000/api/packages

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@test.com","password":"123456"}'

# Login (response में "token" मिलेगा)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ali@test.com","password":"123456"}'

# Booking (TOKEN और PACKAGE_ID बदलो)
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" \
  -d '{"tourPackage":"PACKAGE_ID","travelDate":"2027-03-15","numberOfTravelers":2}'
```

curl मुश्किल लगे तो **Postman** या VS Code का **Thunder Client** extension इस्तेमाल करो।
Admin login के लिए `.env` वाले `ADMIN_EMAIL` / `ADMIN_PASSWORD` use करो।

## 7. Frontend (React) से जोड़ना

```bash
npm install axios      # frontend project में
```

```js
// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Vite
  // CRA:  process.env.REACT_APP_API_URL     Next.js: process.env.NEXT_PUBLIC_API_URL
});

// हर request में token अपने-आप जुड़ जाएगा
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// इस्तेमाल:
// const { data } = await api.get('/packages?featured=true');
// const { data } = await api.post('/auth/login', { email, password });  -> localStorage.setItem('token', data.token)
```

## 8. GitHub पर push करना

पहले GitHub पर नया **खाली** repository बनाओ (README या .gitignore मत जोड़ना), फिर:

```bash
git config --global user.name  "Tumhara Naam"          # सिर्फ पहली बार
git config --global user.email "tumhari@email.com"     # सिर्फ पहली बार

git init                                   # इस folder को Git repo बनाओ
git add .                                  # सारी फ़ाइलें staging में
git status                                 # CHECK: .env और node_modules नहीं दिखने चाहिए!
git commit -m "Initial commit: travel agency backend"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

बाद में कोई बदलाव करो तो बस ये 3 commands:

```bash
git add .
git commit -m "क्या बदला उसका छोटा description"
git push
```

> ⚠️ `.env` कभी GitHub पर नहीं जाना चाहिए (उसमें password और secret हैं)। यह `.gitignore` में पहले से है।
> Push के समय password माँगे तो GitHub का normal password नहीं चलता। browser वाला login या **Personal Access Token** इस्तेमाल करो
> (GitHub -> Settings -> Developer settings -> Personal access tokens)।

## 9. Deploy (online करना)

Frontend Vercel पर है। यह backend **Render** (render.com) पर free में चल सकता है:

1. Render -> **New Web Service** -> अपना GitHub repo चुनो।
2. Build Command: `npm install`  |  Start Command: `npm start`
3. **Environment** में `.env` वाली सारी values डालो। `NODE_ENV=production` और `CLIENT_URL` में अपनी Vercel वाली URL।
4. Deploy होने पर एक URL मिलेगा, जैसे `https://fusion-travel-api.onrender.com`।
5. Vercel में frontend project की environment variable `VITE_API_URL` = `https://fusion-travel-api.onrender.com/api` रखो और frontend दोबारा deploy करो।

(Render की free service कुछ देर इस्तेमाल न हो तो सो जाती है, पहली request धीमी होगी।)

## 10. आम errors और हल

| Error | मतलब / हल |
|-------|-----------|
| `Missing environment variable: MONGO_URI` | `.env` फ़ाइल नहीं बनी या खाली है |
| `MongoDB connection failed ... bad auth` | Atlas का username/password गलत है |
| `MongoDB connection failed ... ENOTFOUND / timeout` | Atlas में Network Access (`0.0.0.0/0`) जोड़ो |
| `EADDRINUSE: port 5000` | पोर्ट पहले से चालू है। `.env` में `PORT=5001` कर दो |
| Browser में CORS error | `.env` के `CLIENT_URL` में frontend की सही URL डालो, server restart करो |
| `401 Not logged in` | header में `Authorization: Bearer <token>` भेजो |
| `403 Admin access only` | admin account से login करो |

## 11. आगे क्या जोड़ सकते हो

- Image upload (Cloudinary + multer)
- Online payment (Stripe / JazzCash / Easypaisa)
- Booking पर email confirmation (Nodemailer)
- Forgot password
- Input validation और भी सख़्त (express-validator या zod)
