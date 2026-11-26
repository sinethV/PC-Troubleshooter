import React, { useState } from 'react';
import {
  Network,
  Copy,
  CheckCircle,
  Activity,
  Globe,
  Wifi,
  Radio,
  Server,
  Zap,
  ShieldCheck
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import Toast from '../components/common/Toast';
import { copyToClipboard } from '../utils/copyToClipboard';

const networkTools = [
  {
    id: 'ipconfig-all',
    title: 'Full TCP/IP Configuration',
    tag: 'Triage Discovery',
    command: 'ipconfig /all',
    risk: 'SAFE',
    permission: 'Standard User',
    description: 'Displays full IP address, Subnet Mask, Default Gateway, DNS servers, DHCP lease dates, and Physical MAC addresses for all network adapters.',
    whenToUse: 'First diagnostic step when an endpoint reports "No Internet" or "Limited Connectivity".',
    verification: 'Check if IPv4 address begins with 169.254.x.x (indicates failure to obtain DHCP lease from router).'
  },
  {
    id: 'flush-dns',
    title: 'Flush DNS Resolver Cache',
    tag: 'Name Resolution',
    command: 'ipconfig /flushdns',
    risk: 'SAFE',
    permission: 'Administrator',
    description: 'Flushes and resets the contents of the DNS client resolver cache.',
    whenToUse: 'When websites fail to resolve by name, or after changing DNS server settings.',
    verification: 'Returns "Successfully flushed the DNS Resolver Cache." Follow up with nslookup google.com.'
  },
  {
    id: 'dhcp-renew',
    title: 'Release & Renew DHCP Lease',
    tag: 'DHCP Addressing',
    command: 'ipconfig /release && ipconfig /renew',
    risk: 'SAFE',
    permission: 'Standard User',
    description: 'Releases the current DHCP lease and queries the network DHCP server for a fresh IP lease.',
    whenToUse: 'When client holds an invalid or duplicate IP address or was moved to another subnet.',
    verification: 'Displays the renewed IPv4 address and subnet mask assigned by the local DHCP router.'
  },
  {
    id: 'net-test',
    title: 'PowerShell Socket Connection Probe',
    tag: 'Port Diagnostics',
    command: 'Test-NetConnection -ComputerName 8.8.8.8 -Port 53 -InformationLevel Detailed',
    risk: 'SAFE',
    permission: 'Standard User',
    description: 'Performs ICMP ping, DNS resolution, and TCP port handshake to Google Public DNS in a single cmdlet.',
    whenToUse: 'When standard ping works but a specific service (HTTP/DNS/RDP/Email) fails to connect.',
    verification: 'Look for "TcpTestSucceeded : True" and "PingSucceeded : True".'
  },
  {
    id: 'traceroute',
    title: 'Hop-by-Hop Trace Route',
    tag: 'Path Latency',
    command: 'tracert -d 8.8.8.8',
    risk: 'SAFE',
    permission: 'Standard User',
    description: 'Determines the exact routing path to destination without resolving DNS (faster).',
    whenToUse: 'To pinpoint which router or ISP gateway hop is dropping packets or adding massive latency.',
    verification: 'The hop that displays "* * * Request timed out" is the router failing or blocking ICMP.'
  },
  {
    id: 'netsh-reset',
    title: 'TCP/IP Stack & Winsock Reset',
    tag: 'Protocol Repair',
    command: 'netsh int ip reset && netsh winsock reset',
    risk: 'MODERATE',
    permission: 'Administrator',
    description: 'Resets TCP/IP stack configuration and clears corrupted Winsock Layered Service Providers (LSP).',
    whenToUse: 'When adapter has a valid IP address and gateway, but browsers and applications cannot connect.',
    verification: 'Requires PC reboot. Verifies complete restoration of standard Windows TCP/IP networking.'
  },
  {
    id: 'wifi-diagnostics',
    title: 'Inspect Wi-Fi Adapter & Signal Strength',
    tag: 'Wireless Triage',
    command: 'netsh wlan show interfaces',
    risk: 'SAFE',
    permission: 'Standard User',
    description: 'Shows active Wi-Fi SSID, BSSID, Radio type (802.11ax/ac/n), Channel, Receive/Transmit rates, and Signal strength percentage.',
    whenToUse: 'When a laptop suffers from slow Wi-Fi, poor reception, or frequent roaming disconnects.',
    verification: 'Ensure Signal is above 75% and Rx/Tx rates match expected access point capabilities.'
  },
  {
    id: 'netstat-listeners',
    title: 'Inspect Open Listening Ports & PIDs',
    tag: 'Socket Inspection',
    command: 'netstat -ano | findstr /i "LISTENING"',
    risk: 'SAFE',
    permission: 'Standard User',
    description: 'Lists all TCP ports currently listening on the local machine alongside their owning Process ID (PID).',
    whenToUse: 'When resolving port conflicts (e.g. port 80, 443, 8080 already in use by another app).',
    verification: 'Cross-reference PID with Task Manager or "tasklist /FI \"PID eq <number>\"" to find the app.'
  }
];

export default function NetworkTools() {
  const [toast, setToast] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (cmd, id) => {
    const success = await copyToClipboard(cmd);
    if (success) {
      setCopiedId(id);
      setToast({
        type: 'success',
        message: 'Network command copied to clipboard!',
      });
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Network className="w-6 h-6 text-emerald-600" />
            Network Diagnostic & Connectivity Toolkit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Certified network diagnostics for IP addressing, DNS resolution, DHCP leases, gateway testing, and TCP/IP stack restoration.
          </p>
        </div>
      </div>

      {/* Structured 4-Step Network Isolation Workflow */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl shadow-md border border-slate-800">
        <h2 className="text-base font-bold flex items-center gap-2 mb-2 text-white">
          <Zap className="w-5 h-5 text-emerald-400" />
          The 4-Step Network Layer Isolation Strategy
        </h2>
        <p className="text-xs text-slate-300 mb-4 max-w-3xl leading-relaxed">
          Never guess network issues. Methodically test outward from local hardware up to external DNS:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Level 1: Local Stack
            </span>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
              ping 127.0.0.1
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Verifies local network interface card (NIC) driver.</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">
              Level 2: Default Gateway
            </span>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
              ping &lt;Gateway_IP&gt;
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Verifies switch, patch cable, and router link.</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Level 3: Public Internet IP
            </span>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
              ping 8.8.8.8
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Verifies WAN ISP connectivity independent of DNS.</p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
              Level 4: DNS Name Query
            </span>
            <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2 rounded border border-slate-800 truncate">
              nslookup google.com
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">Verifies nameserver IP configuration and resolution.</p>
          </div>
        </div>
      </div>

      {/* Network Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {networkTools.map((tool) => (
          <div
            key={tool.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-sm transition space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {tool.tag}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-500">{tool.permission}</span>
              </div>
              <RiskBadge level={tool.risk} />
            </div>

            <h3 className="text-sm font-bold text-slate-900">{tool.title}</h3>

            {/* Command Syntax Box */}
            <div className="relative">
              <div className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                <code>{tool.command}</code>
              </div>
              <button
                onClick={() => handleCopy(tool.command, tool.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition shadow"
                title="Copy command"
              >
                {copiedId === tool.id ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <div>
                <strong className="text-slate-700">When to use: </strong>
                <span className="text-slate-600">{tool.whenToUse}</span>
              </div>
              <div>
                <strong className="text-slate-700">Verification: </strong>
                <span className="text-slate-600">{tool.verification}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
