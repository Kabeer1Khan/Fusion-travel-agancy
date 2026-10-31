# Frontend (React) को Backend से जोड़ना

इस folder की `src/` फ़ाइलें अपने React project की `src/` में कॉपी कर दो (Vite मानकर लिखा है)।

## 1. Environment variable

Project की root में `.env` बनाओ (`.env.example` देखो):

```
VITE_API_URL=http://localhost:5000/api
```

Vercel पर: Project → Settings → Environment Variables → `VITE_API_URL` = `https://YOUR-BACKEND.onrender.com/api`, फिर **Redeploy**।
(Create React App हो तो `src/lib/api.js` में `process.env.REACT_APP_API_URL` लिखो और variable का नाम `REACT_APP_API_URL` रखो।)

## 2. App को AuthProvider में लपेटो

`src/main.jsx` में `main.example.jsx` जैसा।

## 3. इस्तेमाल

| ज़रूरत | क्या use करो |
|---|---|
| Home पर featured tours | `packageService.featured()` |
| Tours page (search, filter, pagination) | `<PackagesList onSelect={...} />` |
| Tour detail page | `packageService.get(slug)` + `<BookingForm pkg={pkg} />` |
| Contact / Enquiry | `<ContactForm />` |
| Footer newsletter | `<NewsletterForm />` |
| Login / Signup | `<LoginForm mode="login" />` / `mode="register"` |
| User की bookings | `<MyBookings />` |
| Logged-in user | `const { user, isLoggedIn, isAdmin, logout } = useAuth()` |

उदाहरण (detail page):

```jsx
import { useParams } from 'react-router-dom';
import { packageService } from '../lib/services';
import { useFetch } from '../hooks/useFetch';
import BookingForm from '../components/BookingForm';

export default function PackageDetail() {
  const { slug } = useParams();
  const { data: pkg, loading, error } = useFetch(() => packageService.get(slug), [slug]);
  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  return (<><h1>{pkg.title}</h1><p>{pkg.description}</p><BookingForm pkg={pkg} /></>);
}
```

Components में सिर्फ बहुत हल्की `className`s हैं (`booking-form`, `package-card`...). Styling अपने CSS से कर लो।

## 4. Backend की तरफ़ ज़रूरी

- Backend `.env` में `CLIENT_URL` में अपनी frontend URL डालो (comma से अलग करके, बिना आख़िरी `/` के)। Production में सिर्फ यही URLs allowed हैं, वरना browser में CORS error आएगा।
- Response shapes: list endpoints `{ success, data, total, page, pages }` देते हैं, अकेला item `{ success, data }`, auth `{ success, token, user }`। Error हमेशा `{ success: false, message }`। `api.js` message को `Error` में बदल देता है।

## 5. Guest booking

Booking के लिए login ज़रूरी नहीं। Login हो तो booking account से जुड़ जाती है और `MyBookings` में दिखती है।
