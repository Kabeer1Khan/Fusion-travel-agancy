import { useState } from 'react';
import { contactService } from '../lib/services';

// Contact page या "Enquire now": <ContactForm tourPackage={pkg?._id} />
export default function ContactForm({ tourPackage }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [state, setState] = useState({ loading: false, error: '', ok: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, error: '', ok: '' });
    try {
      const res = await contactService.send({ ...form, tourPackage });
      setState({ loading: false, error: '', ok: res.message });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setState({ loading: false, error: err.message, ok: '' });
    }
  }

  return (
    <form onSubmit={submit} className="contact-form">
      {state.ok && <p className="form-success" role="status">{state.ok}</p>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <label>Name<input value={form.name} onChange={set('name')} required /></label>
      <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
      <label>Phone<input value={form.phone} onChange={set('phone')} /></label>
      <label>Subject<input value={form.subject} onChange={set('subject')} /></label>
      <label>Message<textarea rows="5" value={form.message} onChange={set('message')} required /></label>
      <button type="submit" disabled={state.loading}>{state.loading ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
