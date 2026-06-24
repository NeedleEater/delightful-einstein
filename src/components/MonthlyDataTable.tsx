import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState
} from '@tanstack/react-table';
import type { OrganicMonthlySummary } from '../data/caseStudyData';
import { Download, Search, FileText, ArrowUpDown } from 'lucide-react';

interface MonthlyDataTableProps {
  data: OrganicMonthlySummary[];
}

export const MonthlyDataTable: React.FC<MonthlyDataTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'month', desc: false }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('All');

  // Highlight rows list
  const highlightMonths = ['2024-09', '2025-05', '2025-10', '2026-02', '2026-05'];

  // Filter data by year
  const filteredData = useMemo(() => {
    if (yearFilter === 'All') return data;
    return data.filter((d) => d.year.toString() === yearFilter);
  }, [data, yearFilter]);

  // CSV Export function
  const handleExportCSV = () => {
    const headers = [
      'Month',
      'Organic Sessions',
      'Engaged Sessions',
      'Engagement Rate (%)',
      'Avg. Engagement Time',
      'Appointment Requests',
      'Click to Call',
      'Total Lead Actions',
      'Session Key Event Rate (%)',
      'Source PDF'
    ];

    const rows = filteredData.map((d) => [
      d.month_label,
      d.organic_sessions,
      d.organic_engaged_sessions,
      d.organic_engagement_rate_pct,
      d.organic_avg_engagement_time,
      d.organic_appointment_requests,
      d.organic_click_to_call,
      d.organic_lead_actions,
      d.organic_session_key_event_rate_pct,
      d.source_pdf
    ]);

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(r => r.map(val => `"${val !== undefined && val !== null ? String(val).replace(/"/g, '""') : ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ntea_organic_monthly_data_${yearFilter === 'All' ? 'all' : yearFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo<ColumnDef<OrganicMonthlySummary>[]>(
    () => [
      {
        accessorKey: 'month',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 hover:text-dq-dark font-semibold"
          >
            Month <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        ),
        cell: (info) => {
          const row = info.row.original;
          return <span className="font-semibold text-slate-800">{row.month_label}</span>;
        }
      },
      {
        accessorKey: 'organic_sessions',
        header: 'Organic Sessions',
        cell: (info) => (info.getValue() as number).toLocaleString()
      },
      {
        accessorKey: 'organic_engaged_sessions',
        header: 'Engaged Sessions',
        cell: (info) => (info.getValue() as number).toLocaleString()
      },
      {
        accessorKey: 'organic_engagement_rate_pct',
        header: 'Engagement Rate',
        cell: (info) => `${(info.getValue() as number).toFixed(1)}%`
      },
      {
        accessorKey: 'organic_avg_engagement_time',
        header: 'Avg. Engagement Time',
        cell: (info) => info.getValue() as string
      },
      {
        accessorKey: 'organic_appointment_requests',
        header: 'Appointment Requests',
        cell: (info) => (info.getValue() as number).toLocaleString()
      },
      {
        accessorKey: 'organic_click_to_call',
        header: 'Click to Call',
        cell: (info) => (info.getValue() as number).toLocaleString()
      },
      {
        accessorKey: 'organic_lead_actions',
        header: 'Lead Actions',
        cell: (info) => (info.getValue() as number).toLocaleString()
      },
      {
        accessorKey: 'organic_session_key_event_rate_pct',
        header: 'Key Event Rate',
        cell: (info) => `${(info.getValue() as number).toFixed(1)}%`
      },
      {
        accessorKey: 'source_pdf',
        header: 'Source PDF',
        cell: (info) => {
          const pdf = info.getValue() as string;
          return (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <FileText className="w-3.5 h-3.5" /> {pdf}
            </span>
          );
        }
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
      {/* Table header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Explore the Monthly Organic Performance Data</h2>
          <p className="text-sm text-slate-400 mt-0.5">Filter, search, and sort the historical monthly SEO performance dataset</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search table..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:border-dq-accent focus:bg-white transition-all w-[180px] md:w-[220px]"
            />
          </div>

          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-xl px-3 py-2.5 outline-none focus:border-dq-accent focus:bg-white transition-all cursor-pointer"
          >
            <option value="All">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-dq-dark hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-100">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-4 font-semibold text-slate-500 uppercase tracking-wider">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const isHighlighted = highlightMonths.includes(row.original.month);
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isHighlighted
                        ? 'bg-dq-accent/10 border-l-[3px] border-l-dq-accent font-medium'
                        : ''
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4 text-slate-600">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-400 font-medium">
                  No records found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Highlight legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-dq-accent/25 border-l-2 border-l-dq-accent rounded-sm" />
          <span>Highlighted rows indicate key milestone months referenced in the case study</span>
        </div>
      </div>
    </div>
  );
};
