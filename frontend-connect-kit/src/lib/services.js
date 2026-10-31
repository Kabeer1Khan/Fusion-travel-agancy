// हर backend endpoint के लिए एक function। Components में सीधे fetch मत लिखो, इन्हें call करो।
import { api, tokenStore } from './api';

export const authService = {
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    tokenStore.set(data.token);
    return data.user;
  },
  async register({ name, email, password, phone }) {
    const data = await api.post('/auth/register', { name, email, password, phone });
    tokenStore.set(data.token);
    return data.user;
  },
  me: () => api.get('/auth/me').then((d) => d.user),
  updateMe: (body) => api.put('/auth/me', body).then((d) => d.user),
  logout: () => tokenStore.clear(),
};

export const packageService = {
  // params: { search, category, destination, minPrice, maxPrice, featured: true, sort: 'price' | '-price' | 'newest' | 'rating' | 'duration', page, limit }
  list: (params = {}, signal) => api.get('/packages', params, signal),   // -> { data, total, page, pages }
  get: (idOrSlug) => api.get(`/packages/${idOrSlug}`).then((d) => d.data),
  featured: (limit = 6) => api.get('/packages', { featured: true, limit }).then((d) => d.data),
  reviews: (id) => api.get(`/packages/${id}/reviews`).then((d) => d.data),
  addReview: (id, { rating, comment }) => api.post(`/packages/${id}/reviews`, { rating, comment }).then((d) => d.data),
};

export const bookingService = {
  // login ज़रूरी नहीं: guest भी booking कर सकता है (name + email या phone चाहिए)
  create: (payload) => api.post('/bookings', payload),   // { tourPackage, name, email, phone, travelDate, numberOfTravelers, specialRequests }
  mine: () => api.get('/bookings/my').then((d) => d.data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`).then((d) => d.data),
};

export const contactService = {
  send: ({ name, email, phone, subject, message, tourPackage }) =>
    api.post('/inquiries', { name, email, phone, subject, message, tourPackage }),
};

export const newsletterService = {
  subscribe: (email) => api.post('/subscribe', { email }),
};

export const testimonialService = {
  list: () => api.get('/testimonials').then((d) => d.data),
};
