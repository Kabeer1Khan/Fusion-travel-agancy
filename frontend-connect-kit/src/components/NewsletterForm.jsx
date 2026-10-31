import { useState } from 'react';
import { newsletterService } from '../lib/services';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ loading: false, msg: '', error: false });

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, msg: '', error: false });
    try {
      const res = await newsletterService.subscribe(email);
      setState({ loading: false, msg: res.message, error: false });
      setEmail('');
    } catch (err) {
      setState({ loading: false, msg: err.message, error: true });
    }
  }

  return (
    <form onSubmit={submit} className="newsletter-form">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" aria-label="Email address" required />
      <button type="submit" disabled={state.loading}>{state.loading ? 'Joining…' : 'Subscribe'}</button>
      {state.msg && <p role="status" className={state.error ? 'form-error' : 'form-success'}>{state.msg}</p>}
    </form>
  );
}
