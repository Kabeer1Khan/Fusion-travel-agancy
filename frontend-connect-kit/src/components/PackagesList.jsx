import { useState } from 'react';
import { packageService } from '../lib/services';
import { useFetch } from '../hooks/useFetch';

const CATEGORIES = ['Adventure', 'Beach', 'Cultural', 'Honeymoon', 'Family', 'Luxury', 'Religious', 'City'];

// Filters + pagination के साथ packages। Card का design अपने project के हिसाब से बदल लो।
// onSelect(pkg) में अपनी detail page पर navigate करो, जैसे navigate(`/packages/${pkg.slug}`)
export default function PackagesList({ onSelect, pageSize = 9 }) {
  const [filters, setFilters] = useState({ search: '', category: '', sort: 'newest' });
  const [page, setPage] = useState(1);

  const { data, loading, error, reload } = useFetch(
    (signal) => packageService.list({ ...filters, page, limit: pageSize }, signal),
    [filters.search, filters.category, filters.sort, page],
  );

  const update = (k) => (e) => { setPage(1); setFilters((f) => ({ ...f, [k]: e.target.value })); };

  return (
    <section>
      <div className="package-filters">
        <input type="search" placeholder="Search destination or tour" value={filters.search} onChange={update('search')} aria-label="Search packages" />
        <select value={filters.category} onChange={update('category')} aria-label="Category">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={filters.sort} onChange={update('sort')} aria-label="Sort by">
          <option value="newest">Newest</option>
          <option value="price">Price: low to high</option>
          <option value="-price">Price: high to low</option>
          <option value="rating">Top rated</option>
          <option value="duration">Shortest trip</option>
        </select>
      </div>

      {loading && <p>Loading packages…</p>}
      {error && <p className="form-error">{error} <button onClick={reload}>Try again</button></p>}
      {data && !data.data.length && <p>No packages match your search.</p>}

      <div className="package-grid">
        {data?.data.map((p) => (
          <article key={p._id} className="package-card" onClick={() => onSelect?.(p)}>
            {p.images?.[0] && <img src={p.images[0]} alt={p.title} loading="lazy" />}
            <h3>{p.title}</h3>
            <p>{p.destination}{p.country ? `, ${p.country}` : ''} · {p.durationDays} days</p>
            <p><b>{p.currency} {p.price.toLocaleString()}</b>{p.ratingsCount ? ` · ★ ${p.ratingsAverage} (${p.ratingsCount})` : ''}</p>
          </article>
        ))}
      </div>

      {data && data.pages > 1 && (
        <nav className="pagination" aria-label="Pages">
          <button disabled={page <= 1} onClick={() => setPage((n) => n - 1)}>Previous</button>
          <span>Page {data.page} of {data.pages}</span>
          <button disabled={page >= data.pages} onClick={() => setPage((n) => n + 1)}>Next</button>
        </nav>
      )}
    </section>
  );
}
