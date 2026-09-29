import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import WorldMap from '../../components/WorldMap';
import SearchBar from '../../components/SearchBar';
import MallCard from '../../components/MallCard';
import Loading from '../../components/Loading';
import ErrorState from '../../components/ErrorState';
import { useMalls } from '../../hooks/useMalls';
import { useMallStatuses } from '../../hooks/useMallStatus';
import EmptyState from '../../components/EmptyState';
import './Home.css';

export default function Home() {
  const { countries, malls, loading, error, reload } = useMalls();
  const items = useMallStatuses(malls);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedMallId, setSelectedMallId] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [toast, setToast] = useState(null);
  const [emptyCountry, setEmptyCountry] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(({ mall, status }) => {
      if (!mall) return false;
      const matchesQuery = !q || `${mall.name || ''} ${mall.city || ''} ${mall.country || ''}`.toLowerCase().includes(q);
      const matchesFilter = filter === 'ALL' || status?.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [items, query, filter]);

  const openCount = useMemo(() => items.filter((i) => i.status.isOpen).length, [items]);

  const selectMall = useCallback(
    (id) => {
      setSelectedMallId(id);
      setEmptyCountry(null);
      const mall = malls.find((m) => m?.id === id);
      if (mall && mall.countryId) setSelectedCountryId(mall.countryId);
    },
    [malls]
  );

  const selectCountry = useCallback((id) => {
    setSelectedCountryId(id);
    setEmptyCountry(null); // also runs on "World view", which calls this with null
  }, []);
  const closeMall = useCallback((id) => setSelectedMallId((cur) => (cur === id ? null : cur)), []);
  const notify = useCallback((msg) => setToast(msg), []);

  return (
    <div className="home">
      <Header total={items.length} openCount={openCount} />

      {loading && <Loading />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && (
        <div className="home__body">
          <aside className="home__sidebar">
            <SearchBar query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />
            <div className="home__list">
              {visible.length === 0 ? (
                items.length === 0 ? (
                  <EmptyState title="No Phoenix Malls available." message="Please check back later." />
                ) : (
                  <EmptyState title="No malls match your search." message="Try a different name or filter." icon="🔍" />
                )
              ) : (
                visible.map(({ mall, status }, index) => (
                  <MallCard
                    key={mall?.id || `mall-${index}`}
                    mall={mall}
                    status={status}
                    selected={mall?.id === selectedMallId}
                    onSelect={selectMall}
                  />
                ))
              )}
            </div>
          </aside>

          <main className="home__map">
            <WorldMap
              items={visible}
              countries={countries}
              selectedCountryId={selectedCountryId}
              selectedMallId={selectedMallId}
              onSelectMall={selectMall}
              onCloseMall={closeMall}
              onNotify={notify}
              onSelectCountry={selectCountry}
              onEmptyCountry={setEmptyCountry}
            />
            {emptyCountry && (
              <EmptyState
                floating
                title="No Phoenix Malls available in this country."
                message={`${emptyCountry} doesn't have a Phoenix Mall yet.`}
                onDismiss={() => setEmptyCountry(null)}
              />
            )}
            {toast && <div className="home__toast" role="status">{toast}</div>}
          </main>
        </div>
      )}
    </div>
  );
}