'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { useListPropertiesQuery } from '../features/properties/propertyApi';
import { getApiErrorMessage } from '../lib/apiError';

export default function HomeClient({ initialData }) {
  // Server gives initial listings so the first page has content before JavaScript loads.
  const [filters, setFilters] = useState({ sort: 'newest', limit: 8 });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCursors, setPageCursors] = useState([undefined]);
  const [searchText, setSearchText] = useState('');
  // Remove empty values before sending query params to the backend.
  const query = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')), [filters]);
  const { data: queriedData, isFetching, isError, error } = useListPropertiesQuery(query);
  const data = queriedData || initialData;

  useEffect(() => {
    // Debounce search so typing "delhi" does not call API for every character.
    const timeout = setTimeout(() => {
      setFilters((current) => {
        if ((current.q || '') === searchText) return current;
        setPageIndex(0);
        setPageCursors([undefined]);
        return { ...current, q: searchText, cursor: undefined };
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText]);

  function update(event) {
    // Reset cursor when filters change so search starts from page one.
    setPageIndex(0);
    setPageCursors([undefined]);
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value, cursor: undefined }));
  }

  function updateSearch(event) {
    // Search is debounced; other filters use update() and apply immediately.
    setSearchText(event.target.value);
  }

  function goToPreviousPage() {
    const previousIndex = pageIndex - 1;
    setPageIndex(previousIndex);
    setFilters((current) => ({ ...current, cursor: pageCursors[previousIndex] }));
  }

  function goToNextPage() {
    const nextIndex = pageIndex + 1;
    setPageIndex(nextIndex);
    setPageCursors((current) => [...current.slice(0, nextIndex), data.nextCursor]);
    setFilters((current) => ({ ...current, cursor: data.nextCursor }));
  }

  return (
    <section className="mx-auto flex h-full max-w-7xl flex-col px-3 sm:px-4">
      <div className="shrink-0 grid gap-3 border-b border-line py-3 sm:gap-4 sm:py-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Find verified properties faster</h1>
          <p className="mt-1 hidden max-w-2xl text-sm text-ink/65 sm:mt-2 sm:block sm:text-base">Search listings with indexed filters, cursor pagination, owner inquiries, and similar property recommendations.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 rounded-md border border-line bg-white p-2 shadow-soft sm:gap-3 sm:p-3 md:grid-cols-4 lg:min-w-[760px]">
          <label className="relative col-span-2 md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/45" size={17} />
            <input className="field-leading-icon" name="q" placeholder="City, location, title" aria-label="Search by city, location, or title" value={searchText} onChange={updateSearch} />
          </label>
          <select className="field" name="propertyType" aria-label="Property type" onChange={update}>
            <option value="">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="independent-house">House</option>
            <option value="commercial">Commercial</option>
          </select>
          <select className="field" name="sort" value={filters.sort} aria-label="Sort properties" onChange={update}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price low</option>
            <option value="price_desc">Price high</option>
            <option value="area_desc">Largest</option>
          </select>
          <input className="field" name="minBudget" type="number" placeholder="Min budget" aria-label="Minimum budget" onChange={update} />
          <input className="field" name="maxBudget" type="number" placeholder="Max budget" aria-label="Maximum budget" onChange={update} />
          <input className="field" name="bedrooms" type="number" placeholder="Bedrooms" aria-label="Bedrooms" onChange={update} />
          <div className="hidden items-center gap-2 text-sm font-semibold text-ink/60 md:flex"><SlidersHorizontal size={16} /> Filters</div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto py-3 pr-1 sm:py-5 sm:pr-2">
        {isError && <p className="mb-4 rounded-md border border-coral/40 bg-coral/10 p-4 text-coral">{getApiErrorMessage(error, 'Could not load properties.')}</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(data?.items || []).map((property, index) => <PropertyCard key={property.id} property={property} priority={index === 0} />)}
        </div>
        {!isFetching && !data?.items?.length && <p className="rounded-md border border-line bg-white p-6 text-center text-ink/60">No listings match these filters.</p>}
      </div>

      <div className="shrink-0 border-t border-line bg-mist/70 py-2 sm:py-3">
        <div className="flex items-center justify-center gap-3">
          <button className="btn-ghost px-3 sm:px-4" onClick={goToPreviousPage} disabled={isFetching || pageIndex === 0}>
            Previous
          </button>
          <span className="min-w-16 text-center text-sm font-semibold text-ink/60">Page {pageIndex + 1}</span>
          <button className="btn-ghost px-3 sm:px-4" onClick={goToNextPage} disabled={isFetching || !data?.nextCursor}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
