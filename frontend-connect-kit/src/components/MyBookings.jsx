import { bookingService } from '../lib/services';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';

// Logged-in user की अपनी bookings + cancel बटन
export default function MyBookings() {
  const { isLoggedIn } = useAuth();
  const { data, loading, error, reload } = useFetch(() => (isLoggedIn ? bookingService.mine() : Promise.resolve([])), [isLoggedIn]);

  async function cancel(id) {
    if (!window.confirm('Cancel this booking?')) return;
    try { await bookingService.cancel(id); reload(); } catch (err) { window.alert(err.message); }
  }

  if (!isLoggedIn) return <p>Please log in to see your bookings.</p>;
  if (loading) return <p>Loading…</p>;
  if (error) return <p className="form-error">{error}</p>;
  if (!data?.length) return <p>You have no bookings yet.</p>;

  return (
    <ul className="my-bookings">
      {data.map((b) => (
        <li key={b._id}>
          <b>{b.tourPackage?.title || b.packageTitle}</b>
          <span> · {b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'Date to be confirmed'}</span>
          <span> · {b.numberOfTravelers} traveller(s) · {b.status} · {b.paymentStatus}</span>
          {['pending', 'confirmed'].includes(b.status) && <button onClick={() => cancel(b._id)}>Cancel</button>}
        </li>
      ))}
    </ul>
  );
}
