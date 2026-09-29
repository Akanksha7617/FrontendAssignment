import { memo } from 'react';
import './SearchBar.css';

const FILTERS = [
  { id: 'ALL', label: 'All' },
  { id: 'OPEN', label: 'Open' },
  { id: 'CLOSED', label: 'Closed' },
];

function SearchBar({ query, onQuery, filter, onFilter }) {
  return (
    <div className="search">
      <input
        type="search"
        placeholder="Search mall or city…"
        aria-label="Search malls by name or city"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />
      <div className="search__chips" role="group" aria-label="Filter malls by status">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={filter === f.id ? 'chip chip--active' : 'chip'}
            aria-pressed={filter === f.id}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(SearchBar);