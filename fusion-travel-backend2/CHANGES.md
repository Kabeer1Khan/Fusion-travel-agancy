# क्या ठीक किया गया (Backend)

## Bugs जो मिले और fix हुए
1. **Dashboard server से serve ही नहीं होता था.** `src/dashboard` बनी थी पर Express में कहीं जुड़ी नहीं थी। अब `/dashboard` पर चलता है।
2. **Dashboard में API address `localhost:5000` लिखा था**, online जाते ही टूट जाता। अब same-origin (`/api`) है।
3. **Dashboard के बटन `onclick="..."` से बने थे.** `helmet` की security policy इन्हें block कर देती है, इसलिए बटन चलते नहीं। नया dashboard बिना inline handlers के है।
4. **Revenue और "pending" गलत गिने जाते थे:** सिर्फ 5 latest bookings से। अब `/api/admin/stats` पूरी database से निकालता है। Revenue सिर्फ *paid* bookings की है।
5. **Admin को hidden (inactive) packages दिखती ही नहीं थीं**, इसलिए edit/वापस चालू करना नामुमकिन था। अब `?all=true` (सिर्फ admin token के साथ)।
6. **Reviews page सिर्फ 20 testimonials दिखाता था** और package का नाम नहीं। नया `/api/admin/reviews` (pagination + package + customer)।
7. **CORS production में भी सबको allow करता था** (`return callback(null, true)` दोनों जगह)। अब production में सिर्फ `CLIENT_URL` वाले origins।
8. **JWT secret का hard-coded default** (`fusion_travel_default_jwt_secret_key_2026`) कोई भी जानता। अब production में `JWT_SECRET` न हो तो server चालू ही नहीं होता।
9. **Booking बिना नाम/संपर्क/package के बन जाती थी**, और पुरानी travel date भी चलती थी। अब validation है।
10. **Rating validation नहीं थी** (string/decimal जा सकता था) और inquiry status का check नहीं था। जोड़ा।
11. **Newsletter email unique नहीं था** (duplicate rows)। अब `models/Subscriber.js` में unique index।
12. **Database जुड़ा न हो तो हर request ~10 सेकंड हैंग होती थी.** अब तुरंत `503` + साफ़ message।
13. **गलत JSON भेजने पर `500` आता था.** अब `400 Invalid JSON`।
14. **Duplicate files:** `src/server.js` और `src/.env` (असली entry `server.js` और `.env` root में हैं) हटाईं ताकि भ्रम न रहे।

## नया
- `dashboard/`: पूरा नया admin panel (Overview, Bookings, Packages, Inquiries, Reviews, Customers)।
- `src/controllers/admin.controller.js` + `src/routes/admin.routes.js`
- Bookings में `search` और `paymentStatus` filter।
- `GET /api/health`।

## Round 2 fixes
15. **Production में dashboard का login/save "CORS blocked" देता था:** browser same-origin POST पर भी `Origin` भेजता है। अब अपना ही host allow है (`src/app.js`).
16. Atlas न मिलने पर 30 सेकंड इंतज़ार की जगह 10 सेकंड में साफ error (`src/config/db.js`).
17. Frontend `LoginForm`: सफल login के बाद बटन "Please wait…" पर अटका रहता था। ठीक किया।
