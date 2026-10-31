import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// mode="login" या mode="register"
export default function LoginForm({ mode = 'login', onSuccess }) {
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [state, setState] = useState({ loading: false, error: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState({ loading: true, error: '' });
    try {
      const user = mode === 'login' ? await login(form.email, form.password) : await register(form);
      setState({ loading: false, error: '' });
      onSuccess?.(user); // admin हो तो चाहो तो window.location = '<backend>/dashboard' पर भेज दो
    } catch (err) {
      setState({ loading: false, error: err.message });
    }
  }

  return (
    <form onSubmit={submit} className="auth-form">
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {mode === 'register' && <label>Name<input value={form.name} onChange={set('name')} required /></label>}
      <label>Email<input type="email" value={form.email} onChange={set('email')} autoComplete="username" required /></label>
      {mode === 'register' && <label>Phone<input value={form.phone} onChange={set('phone')} /></label>}
      <label>Password<input type="password" minLength={6} value={form.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>
      <button type="submit" disabled={state.loading}>{state.loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
    </form>
  );
}
