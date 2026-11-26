import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Terminal, Shield, RefreshCw, AlertCircle } from 'lucide-react';
import CommandCard from '../components/commands/CommandCard';
import CommandDetailsModal from '../components/commands/CommandDetailsModal';
import Toast from '../components/common/Toast';
import { commandApi } from '../api/commandApi';
import { categoryApi } from '../api/categoryApi';

export default function CommandLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [commands, setCommands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [selectedCommand, setSelectedCommand] = useState(null);
  const [toast, setToast] = useState(null);

  // Load Categories
  useEffect(() => {
    categoryApi.getAll()
      .then((res) => {
        if (res?.data) setCategories(res.data);
      })
      .catch((err) => {
        console.warn('Could not load categories:', err);
      });
  }, []);

  // Fetch Commands
  const fetchCommands = async () => {
    try {
      setLoading(true);
      const res = await commandApi.search({
        categoryId: selectedCategory || undefined,
        riskLevel: selectedRisk !== 'ALL' ? selectedRisk : undefined,
        query: searchQuery || undefined,
        page,
        size: 12,
      });

      if (res?.data) {
        setCommands(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.warn('Using local fallback command dataset:', err);
      // Fallback commands list if API is starting up
      const mockCommands = [
        {
          id: 1,
          name: 'System File Checker (SFC Scan)',
          commandSyntax: 'sfc /scannow',
          explanation: 'Scans the integrity of all protected system files and replaces damaged versions.',
          purpose: 'Repair corrupted OS binaries and DLLs',
          whenToUse: 'BSODs, crashes, missing DLLs',
          requiredPermissions: 'Administrator',
          riskLevel: 'SAFE',
          categoryName: 'Windows Troubleshooting'
        },
        {
          id: 2,
          name: 'DISM Component Store Repair',
          commandSyntax: 'DISM /Online /Cleanup-Image /RestoreHealth',
          explanation: 'Uses Windows Update to fix corruptions in the Windows Component Store image.',
          purpose: 'Fix local servicing store before running SFC',
          whenToUse: 'When SFC fails or Windows Update errors out',
          requiredPermissions: 'Administrator',
          riskLevel: 'SAFE',
          categoryName: 'Windows Troubleshooting'
        },
        {
          id: 4,
          name: 'Detailed IP Configuration',
          commandSyntax: 'ipconfig /all',
          explanation: 'Displays TCP/IP network configuration, DHCP lease times, and MAC addresses.',
          purpose: 'Inspect adapter addressing, gateway, and DHCP status',
          whenToUse: 'First step for network connection loss',
          requiredPermissions: 'Standard User',
          riskLevel: 'SAFE',
          categoryName: 'Network Diagnostics'
        },
        {
          id: 5,
          name: 'Flush DNS Resolver Cache',
          commandSyntax: 'ipconfig /flushdns',
          explanation: 'Clears and resets the contents of the client DNS resolver cache on Windows.',
          purpose: 'Remove stale or poisoned DNS records causing host unreachable errors',
          whenToUse: 'Domain resolution failure or web server moves',
          requiredPermissions: 'Administrator',
          riskLevel: 'SAFE',
          categoryName: 'Network Diagnostics'
        },
        {
          id: 6,
          name: 'TCP/IP Stack & Winsock Reset',
          commandSyntax: 'netsh int ip reset && netsh winsock reset',
          explanation: 'Resets the TCP/IP stack to default and restores Winsock catalog.',
          purpose: 'Heal corrupted network stack protocols and LSP conflicts',
          whenToUse: 'Loss of web connectivity despite having IP address',
          requiredPermissions: 'Administrator',
          riskLevel: 'MODERATE',
          categoryName: 'Network Diagnostics'
        },
        {
          id: 8,
          name: 'Check Disk File System Integrity',
          commandSyntax: 'chkdsk C: /f /r',
          explanation: 'Scans drive for file system logical errors and bad physical sectors.',
          purpose: 'Repair disk corruption causing read errors or freezes',
          whenToUse: 'Event ID 55, system freezes, drive errors',
          requiredPermissions: 'Administrator',
          riskLevel: 'HIGH',
          categoryName: 'Disk Management'
        },
        {
          id: 10,
          name: 'Print Spooler Reset & Queue Purge',
          commandSyntax: 'net stop spooler && del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*" && net start spooler',
          explanation: 'Stops print spooler, deletes hung spool documents, and starts service.',
          purpose: 'Clear stubborn stuck print queues',
          whenToUse: 'Printer stuck on Printing or Deleting',
          requiredPermissions: 'Administrator',
          riskLevel: 'MODERATE',
          categoryName: 'Printer Support'
        }
      ];

      let filtered = mockCommands;
      if (selectedRisk !== 'ALL') {
        filtered = filtered.filter(c => c.riskLevel === selectedRisk);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(q) ||
          c.commandSyntax.toLowerCase().includes(q) ||
          c.explanation.toLowerCase().includes(q)
        );
      }
      setCommands(filtered);
      setTotalElements(filtered.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, [selectedCategory, selectedRisk, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCommands();
  };

  const handleCommandCopy = (cmd) => {
    setToast({
      type: 'success',
      message: `Copied "${cmd.name}" syntax to clipboard!`,
    });
    commandApi.recordUsage(cmd.id, 'Command Library').catch(() => {});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-blue-600" />
            Technician Command Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified CMD, PowerShell, and utility commands with risk assessments and verification guidance.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
          Showing <span className="font-bold text-slate-800">{totalElements}</span> commands
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          {/* Text search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by command syntax, tool name, or problem keyword..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(0);
            }}
            className="w-full md:w-56 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => {
              setSelectedRisk(e.target.value);
              setPage(0);
            }}
            className="w-full md:w-40 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 font-medium"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="SAFE">Safe</option>
            <option value="MODERATE">Moderate</option>
            <option value="HIGH">High Risk</option>
            <option value="DANGEROUS">Dangerous</option>
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Commands Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">Loading command library...</span>
        </div>
      ) : commands.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No commands found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or removing risk filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commands.map((cmd) => (
            <CommandCard
              key={cmd.id}
              command={cmd}
              onViewDetails={setSelectedCommand}
              onCopy={handleCommandCopy}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 font-medium px-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Details Modal */}
      <CommandDetailsModal
        command={selectedCommand}
        onClose={() => setSelectedCommand(null)}
        onCopy={handleCommandCopy}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
