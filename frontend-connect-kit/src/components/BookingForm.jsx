import { useState } from 'react';
import { bookingService } from '../lib/services';
import { useAuth } from '../context/AuthContext';

// <BookingForm pkg={package} />   (pkg = packageService.get() से मिला object)
export default function BookingForm({ pkg, onBooked }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    travelDate: '', numberOfTravelers: 1, specialRequests: '',
  });
  const [state, setState] = useState({ loading: false, error: '', done: null });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const total = (pkg?.price || 0) * Number(form.numberOfTravelers || 0);
  const today = new Date().toISOString().split('T')[0];

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, error: '', done: null });
    try {
      const res = await bookingService.create({
        ...form,
        numberOfTravelers: Number(form.numberOfTravelers),
        tourPackage: pkg._id,
      });
      setState({ loading: false, error: '', done: res });
      onBooked?.(res.data);
    } catch (err) {
      setState({ loading: false, error: err.message, done: null });
    }
  }

  if (state.done) {
    return (
      <div className="booking-success" role="status">
        <h3>Booking received</h3>
        <p>{state.done.message}</p>
        <p>Reference: <b>FT-{String(state.done.data._id).slice(-6).toUpperCase()}</b></p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="booking-form">
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <label>Full name<input value={form.name} onChange={set('name')} required /></label>
      <label>Email<input type="email" value={form.email} onChange={set('email')} /></label>
      <label>Phone<input value={form.phone} onChange={set('phone')} /></label>
      <label>Travel date<input type="date" min={today} value={form.travelDate} onChange={set('travelDate')} required /></label>
      <label>Travellers
        <input type="number" min="1" max={pkg?.maxGroupSize || 20} value={form.numberOfTravelers} onChange={set('numberOfTravelers')} required />
      </label>
      <label>Special requests<textarea rows="3" value={form.specialRequests} onChange={set('specialRequests')} /></label>
      <p className="booking-total">Estimated total: <b>{pkg?.currency || 'USD'} {total.toLocaleString()}</b></p>
      <button type="submit" disabled={state.loading}>{state.loading ? 'Sending…' : 'Book this trip'}</button>
    </form>
  );
}
