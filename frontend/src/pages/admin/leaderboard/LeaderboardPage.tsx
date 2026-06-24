import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Trophy,
  Medal,
  Star,
  Search,
  BarChart2,
  Calendar,
  ChevronDown,
  Check,
} from 'lucide-react';
import { competitionsApi } from '../../../api/competitions';
import { leaderboardApi } from '../../../api/leaderboard';
import type {
  CompetitionLeaderboardDto,
  CompetitionDayLeaderboardDto,
  CompetitionRankingDto,
  CompetitionDayRankingDto,
  CompetitionListDto,
} from '../../../types';

// ── Custom dropdown ───────────────────────────────────────────────────────────
interface DropdownOption { id: number; label: string; sub?: string }

function CustomDropdown({
  options,
  value,
  placeholder,
  onChange,
}: {
  options: DropdownOption[];
  value: number | null;
  placeholder: string;
  onChange: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.id === value);

  return (
    <div className="lb-dropdown" ref={ref}>
      <button
        type="button"
        className={`lb-dropdown-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen((p) => !p)}
      >
        <span className="lb-dropdown-value">
          {selected ? (
            <>
              <span className="lb-dropdown-selected-dot" />
              {selected.label}
            </>
          ) : (
            <span className="lb-dropdown-placeholder">{placeholder}</span>
          )}
        </span>
        <ChevronDown size={16} className={`lb-dropdown-chevron${open ? ' rotated' : ''}`} />
      </button>

      {open && (
        <div className="lb-dropdown-menu animate-scale-in">
          {options.map((opt) => {
            const active = opt.id === value;
            return (
              <button
                key={opt.id}
                type="button"
                className={`lb-dropdown-item${active ? ' active' : ''}`}
                onClick={() => { onChange(opt.id); setOpen(false); }}
              >
                <span className="lb-dropdown-item-label">
                  {opt.label}
                  {opt.sub && <span className="lb-dropdown-item-sub">{opt.sub}</span>}
                </span>
                {active && <Check size={14} className="lb-dropdown-check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Rank badge ────────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="lb-rank lb-rank--gold"><Trophy size={14} />1</span>;
  if (rank === 2) return <span className="lb-rank lb-rank--silver"><Medal size={14} />2</span>;
  if (rank === 3) return <span className="lb-rank lb-rank--bronze"><Star size={14} />3</span>;
  return <span className="lb-rank lb-rank--default">{rank}</span>;
}

function ScoreBar({ pct }: { pct: number }) {
  return (
    <div className="lb-bar-track">
      <div className="lb-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

// ── Competition-wide table ────────────────────────────────────────────────────
function CompetitionTable({ data, search }: { data: CompetitionLeaderboardDto; search: string }) {
  // Only show the search-empty state when user has actually typed something
  const hasSearch = search.trim().length > 0;
  const rows = data.rankings.filter((r) =>
    r.userName.toLowerCase().includes(search.toLowerCase())
  );

  if (rows.length === 0 && hasSearch)
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <div className="empty-state-icon"><Search size={24} /></div>
        <p>No contestants match "<strong>{search}</strong>".</p>
      </div>
    );

  // No rankings at all (search is empty) → parent handles the empty state
  if (rows.length === 0) return null;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>Rank</th>
            <th>Contestant</th>
            <th style={{ width: 120 }}>Total Score</th>
            <th style={{ width: 200 }}>Progress</th>
            <th style={{ width: 90, textAlign: 'right' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: CompetitionRankingDto) => (
            <tr key={r.userId} className={r.rank <= 3 ? 'lb-top-row' : ''}>
              <td><RankBadge rank={r.rank} /></td>
              <td>
                <div className="lb-user">
                  <div className="lb-avatar">{r.userName.slice(0, 2).toUpperCase()}</div>
                  <span className="lb-username">{r.userName}</span>
                </div>
              </td>
              <td><span className="lb-score">{r.totalScore}</span></td>
              <td><ScoreBar pct={Number(r.percentage)} /></td>
              <td style={{ textAlign: 'right' }}>
                <span className="lb-pct">{Number(r.percentage).toFixed(1)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Per-day table ─────────────────────────────────────────────────────────────
function DayTable({ data, search }: { data: CompetitionDayLeaderboardDto; search: string }) {
  const hasSearch = search.trim().length > 0;
  const rows = data.rankings.filter((r) =>
    r.userName.toLowerCase().includes(search.toLowerCase())
  );

  if (rows.length === 0 && hasSearch)
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <div className="empty-state-icon"><Search size={24} /></div>
        <p>No contestants match "<strong>{search}</strong>".</p>
      </div>
    );

  if (rows.length === 0) return null;

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>Rank</th>
            <th>Contestant</th>
            <th style={{ width: 100 }}>Score</th>
            <th style={{ width: 200 }}>Progress</th>
            <th style={{ width: 90, textAlign: 'right' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r: CompetitionDayRankingDto) => (
            <tr key={r.userId} className={r.rank <= 3 ? 'lb-top-row' : ''}>
              <td><RankBadge rank={r.rank} /></td>
              <td>
                <div className="lb-user">
                  <div className="lb-avatar">{r.userName.slice(0, 2).toUpperCase()}</div>
                  <span className="lb-username">{r.userName}</span>
                </div>
              </td>
              <td><span className="lb-score">{r.score}</span></td>
              <td><ScoreBar pct={Number(r.percentage)} /></td>
              <td style={{ textAlign: 'right' }}>
                <span className="lb-pct">{Number(r.percentage).toFixed(1)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number | null>(null);
  const [view, setView] = useState<'competition' | 'day'>('competition');
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const { data: compPage, isLoading: loadingComps } = useQuery({
    queryKey: ['competitions'],
    queryFn: () => competitionsApi.getAll(),
  });
  const competitions: CompetitionListDto[] = compPage?.items ?? [];

  const { data: compDetail } = useQuery({
    queryKey: ['competition', selectedCompetitionId],
    queryFn: () => competitionsApi.getById(selectedCompetitionId!),
    enabled: !!selectedCompetitionId,
  });

  const { data: competitionLb, isLoading: loadingCompLb } = useQuery({
    queryKey: ['leaderboard', 'competition', selectedCompetitionId],
    queryFn: () => leaderboardApi.getByCompetition(selectedCompetitionId!),
    enabled: !!selectedCompetitionId && view === 'competition',
  });

  const { data: dayLb, isLoading: loadingDayLb } = useQuery({
    queryKey: ['leaderboard', 'day', selectedDayId],
    queryFn: () => leaderboardApi.getByDay(selectedDayId!),
    enabled: !!selectedDayId && view === 'day',
  });

  const days = compDetail?.days ?? [];
  const isLoading = view === 'competition' ? loadingCompLb : loadingDayLb;

  function handleCompetitionChange(id: number) {
    setSelectedCompetitionId(id);
    setSelectedDayId(null);
    setView('competition');
    setSearch('');
  }

  function handleViewSwitch(v: 'competition' | 'day') {
    setView(v);
    setSearch('');
    if (v === 'day' && days.length > 0 && !selectedDayId) {
      setSelectedDayId(days[0].id);
    }
  }

  // Derived empty-state flags
  const compNoRankings =
    !loadingCompLb && !!competitionLb && competitionLb.rankings.length === 0;
  const dayNoRankings =
    !loadingDayLb && !!dayLb && dayLb.rankings.length === 0;

  const compDropdownOptions: DropdownOption[] = competitions.map((c) => ({
    id: c.id,
    label: c.title,
    sub: `${c.daysCount} day${c.daysCount !== 1 ? 's' : ''}`,
  }));

  const dayDropdownOptions: DropdownOption[] = days.map((d) => ({
    id: d.id,
    label: `Day ${d.dayNum}`,
    sub: d.title,
  }));

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--warning), #fb923c)',
              borderRadius: 'var(--radius)',
              padding: '0.375rem 0.625rem',
              display: 'inline-flex',
            }}>
              <Trophy size={22} color="#fff" />
            </span>
            Leaderboard
          </h1>
          <p className="page-subtitle">View rankings for competitions and individual days.</p>
        </div>
      </div>

      {/* Controls card */}
      <div className="card lb-controls">
        {/* Competition picker */}
        <div className="form-group" style={{ flex: 1, minWidth: 220 }}>
          <label className="form-label">Competition</label>
          {loadingComps ? (
            <div className="spinner" />
          ) : (
            <CustomDropdown
              options={compDropdownOptions}
              value={selectedCompetitionId}
              placeholder="Select a competition…"
              onChange={handleCompetitionChange}
            />
          )}
        </div>

        {/* View toggle */}
        {selectedCompetitionId && (
          <div className="form-group">
            <label className="form-label">View</label>
            <div className="lb-toggle">
              <button
                className={`lb-toggle-btn${view === 'competition' ? ' active' : ''}`}
                onClick={() => handleViewSwitch('competition')}
              >
                <BarChart2 size={15} /> Overall
              </button>
              <button
                className={`lb-toggle-btn${view === 'day' ? ' active' : ''}`}
                onClick={() => handleViewSwitch('day')}
                disabled={days.length === 0}
              >
                <Calendar size={15} /> By Day
              </button>
            </div>
          </div>
        )}

        {/* Day picker */}
        {selectedCompetitionId && view === 'day' && days.length > 0 && (
          <div className="form-group" style={{ minWidth: 180 }}>
            <label className="form-label">Day</label>
            <CustomDropdown
              options={dayDropdownOptions}
              value={selectedDayId}
              placeholder="Select a day…"
              onChange={(id) => { setSelectedDayId(id); setSearch(''); }}
            />
          </div>
        )}

        {/* Search */}
        {selectedCompetitionId && (
          <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
            <label className="form-label">Search</label>
            <div style={{ position: 'relative' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-subtle)', pointerEvents: 'none',
                }}
              />
              <input
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Filter by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {!selectedCompetitionId && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon"><Trophy size={28} /></div>
          <h3>Select a competition</h3>
          <p>Choose a competition above to view its leaderboard.</p>
        </div>
      )}

      {selectedCompetitionId && isLoading && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="spinner spinner-lg" />
          <p style={{ marginTop: '1rem' }}>Loading rankings…</p>
        </div>
      )}

      {/* Competition-wide */}
      {selectedCompetitionId && view === 'competition' && competitionLb && !loadingCompLb && (
        <div style={{ marginTop: '1.5rem' }} className="animate-fade-up">
          <div className="lb-table-header">
            <div>
              <h2 style={{ fontSize: '1.125rem' }}>{competitionLb.competitionTitle}</h2>
              <p style={{ fontSize: '0.875rem', marginTop: '0.125rem' }}>
                {competitionLb.rankings.length} contestant{competitionLb.rankings.length !== 1 ? 's' : ''} ranked
              </p>
            </div>
            <span className="badge badge-warning">Overall Rankings</span>
          </div>

          {compNoRankings ? (
            <div className="empty-state" style={{ marginTop: '0.5rem' }}>
              <div className="empty-state-icon"><Trophy size={24} /></div>
              <h3>No rankings yet</h3>
              <p>No submissions have been scored for this competition yet.</p>
            </div>
          ) : (
            <CompetitionTable data={competitionLb} search={search} />
          )}
        </div>
      )}

      {/* Day */}
      {selectedCompetitionId && view === 'day' && dayLb && !loadingDayLb && (
        <div style={{ marginTop: '1.5rem' }} className="animate-fade-up">
          <div className="lb-table-header">
            <div>
              <h2 style={{ fontSize: '1.125rem' }}>Day {dayLb.dayNum} Rankings</h2>
              <p style={{ fontSize: '0.875rem', marginTop: '0.125rem' }}>
                {dayLb.rankings.length} contestant{dayLb.rankings.length !== 1 ? 's' : ''} ranked
              </p>
            </div>
            <span className="badge badge-info">Day {dayLb.dayNum}</span>
          </div>

          {dayNoRankings ? (
            <div className="empty-state" style={{ marginTop: '0.5rem' }}>
              <div className="empty-state-icon"><Calendar size={24} /></div>
              <h3>No rankings yet</h3>
              <p>No submissions have been scored for this day yet.</p>
            </div>
          ) : (
            <DayTable data={dayLb} search={search} />
          )}
        </div>
      )}

      {/* No days in competition */}
      {selectedCompetitionId && view === 'day' && !loadingDayLb && days.length === 0 && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <div className="empty-state-icon"><Calendar size={24} /></div>
          <h3>No days found</h3>
          <p>This competition has no days configured yet.</p>
        </div>
      )}
    </div>
  );
}
