-- =============================================================================
-- TechFix Pro: Seed Data
-- Version: 1.0.0
-- Description: Realistic initial dataset for IT technician diagnostics
-- =============================================================================

-- 1. ROLES
INSERT INTO roles (name, description) VALUES
('ROLE_TECH', 'Standard IT field/helpdesk technician with diagnosis and ticket management rights'),
('ROLE_LEAD', 'Senior IT technician with approval and guide authoring rights'),
('ROLE_ADMIN', 'System administrator with full configuration and security access')
ON CONFLICT (name) DO NOTHING;

-- 2. INITIAL TECHNICIAN USER (Default password hash for TechFixAdmin!2026)
INSERT INTO users (username, email, password_hash, full_name, role_id, is_active) VALUES
('tech_lead', 'lead@techfixpro.local', '$2a$12$e8iVp5WzQkZkV6R/Wf2YnOOa.VjH22g0Q6C89j.9q0U2Q0r9Z47z.', 'Alex Mercer', 2, TRUE),
('tech_john', 'john.doe@techfixpro.local', '$2a$12$e8iVp5WzQkZkV6R/Wf2YnOOa.VjH22g0Q6C89j.9q0U2Q0r9Z47z.', 'John Doe', 1, TRUE)
ON CONFLICT (username) DO NOTHING;

-- 3. CATEGORIES
INSERT INTO categories (name, slug, icon_name, description, sort_order) VALUES
('Windows Troubleshooting', 'windows', 'Monitor', 'Diagnostics for Windows boot, BSOD, updates, drivers, performance, and services', 1),
('Network Diagnostics', 'networking', 'Network', 'IP configuration, DNS resolution, DHCP, ping, traceroute, and adapter checks', 2),
('Hardware Diagnostics', 'hardware', 'Cpu', 'CPU, memory, storage SMART health, GPU, and thermal sensors inspection', 3),
('Security & Maintenance', 'security', 'ShieldCheck', 'Defender status, Windows firewall, malware cleanup, and system hardening', 4),
('Disk Management', 'disk-management', 'HardDrive', 'Check disk integrity, partition inspection, storage spaces, and TRIM', 5),
('System Administration', 'system-admin', 'Settings', 'Event viewer queries, services, background tasks, and component store servicing', 6),
('PowerShell & Automation', 'powershell', 'Terminal', 'Modern administrative automation and deep WMI/CIM queries', 7),
('Windows Server & AD', 'windows-server', 'Server', 'Active Directory, domain join, group policies, and DNS/DHCP server operations', 8),
('Linux Administration', 'linux', 'TerminalSquare', 'Linux terminal essentials, systemd services, SSH connectivity, and syslog analysis', 9),
('Printer Support', 'printers', 'Printer', 'Print Spooler recovery, queue purge, port redirection, and driver troubleshooting', 10)
ON CONFLICT (slug) DO NOTHING;

-- 4. COMMANDS
-- Windows Commands
INSERT INTO commands (category_id, name, command_syntax, explanation, purpose, when_to_use, required_permissions, risk_level, expected_output, verification_instructions, is_featured)
VALUES
(1, 'System File Checker (SFC Scan)', 'sfc /scannow', 'Scans the integrity of all protected system files and replaces incorrect, corrupted, changed, or damaged versions with correct versions.', 'Repair corrupted operating system binaries and DLLs.', 'Run whenever Windows experiences random crashes, BSODs, missing DLL errors, or unstable behavior.', 'Administrator', 'SAFE', 'Verification 100% complete. Windows Resource Protection did not find any integrity violations (or found corrupt files and successfully repaired them).', 'Check the %windir%\Logs\CBS\CBS.log file if unrepairable files are reported.', TRUE),

(1, 'DISM Component Store Repair', 'DISM /Online /Cleanup-Image /RestoreHealth', 'Uses Windows Update to provide files required to fix corruptions in the Windows Component Store image.', 'Fix the local servicing store so SFC and Windows Updates can operate reliably.', 'Execute before SFC when SFC fails to repair files or when Windows Update yields 0x800f081f errors.', 'Administrator', 'SAFE', '[==========================100.0%==========================] The restore operation completed successfully.', 'Re-run sfc /scannow immediately after this command finishes.', TRUE),

(1, 'Windows Update Service Reset', 'net stop wuauserv && net stop bits && ren %systemroot%\SoftwareDistribution SoftwareDistribution.bak && net start wuauserv && net start bits', 'Halts the Windows Update and BITS services, resets the downloaded updates cache folder, and restarts the services.', 'Resolve stuck Windows Update downloads and persistent update failure codes.', 'When Windows Update hangs indefinitely at downloading or returns installation error loops.', 'Administrator', 'MODERATE', 'The Windows Update service was stopped successfully. The Windows Update service was started successfully.', 'Open Settings > Windows Update and click Check for updates to trigger fresh downloads.', FALSE),

-- Network Commands
(2, 'Detailed IP Configuration', 'ipconfig /all', 'Displays all current TCP/IP network configuration values, DHCP lease timestamps, physical MAC addresses, and DNS server addresses for all adapters.', 'Inspect adapter addressing, default gateway, and DHCP status.', 'Use as the first diagnostic step whenever an endpoint reports No Internet or Limited Connectivity.', 'Standard User', 'SAFE', 'Comprehensive list of Ethernet and Wi-Fi adapters with IPv4, Subnet Mask, Default Gateway, DHCP Server, and DNS Servers.', 'Verify that IPv4 address does NOT start with 169.254.x.x (APIPA indicator of DHCP failure).', TRUE),

(2, 'Flush DNS Resolver Cache', 'ipconfig /flushdns', 'Clears and resets the contents of the client DNS resolver cache on Windows.', 'Remove stale or poisoned DNS records causing host unreachable errors.', 'Use after changing network settings, modifying DNS servers, or when domains resolve to wrong IPs.', 'Administrator', 'SAFE', 'Successfully flushed the DNS Resolver Cache.', 'Execute "nslookup <domain>" to verify the system fetches fresh DNS query records.', TRUE),

(2, 'TCP/IP Stack & Winsock Reset', 'netsh int ip reset && netsh winsock reset', 'Resets the TCP/IP stack to default configuration and restores Winsock catalog to a clean operational state.', 'Heal corrupted network stack protocols, third-party LSP interference, and total loss of IP connectivity.', 'Use when IP configuration is valid but browser and sockets cannot send or receive TCP packets.', 'Administrator', 'MODERATE', 'Resetting Global, Interface, Subnet... OK! You must restart the computer in order to complete the reset.', 'Restart the computer and verify IP connectivity using ping to the local gateway.', TRUE),

(2, 'PowerShell Network Connection Test', 'Test-NetConnection -ComputerName 8.8.8.8 -Port 53 -InformationLevel Detailed', 'Performs ICMP ping, DNS name resolution, and TCP port handshake probe with route diagnostics in one cmdlet.', 'Diagnose socket reachability and pinpoint if firewall or routing blocks a specific port.', 'Run when standard ping succeeds but a specific service (HTTP/DNS/RDP/Email) is unreachable.', 'Standard User', 'SAFE', 'TcpTestSucceeded : True with SourceAddress, PingSucceeded : True, and RemoteAddress.', 'If TcpTestSucceeded is False while Ping is True, inspect the target port firewall rules.', TRUE),

(2, 'Trace Route to Host', 'tracert -d 8.8.8.8', 'Determines the path taken to a destination by sending ICMP echo packets with varying Time To Live (TTL) values. -d disables DNS lookups for faster results.', 'Identify which network router or internet gateway hop drops traffic or introduces high latency.', 'Use when diagnosing slow internet speeds, intermittent disconnects, or upstream carrier outages.', 'Standard User', 'SAFE', 'Hop list 1 through destination with response times in milliseconds (e.g. 1 <1 ms 192.168.1.1).', 'A line of asterisks (* * * Request timed out) identifies the exact hop failing to forward packets.', FALSE),

(2, 'Active Network Connections and PIDs', 'netstat -ano | findstr /i "LISTENING ESTABLISHED"', 'Displays all active TCP connections and listening ports along with the corresponding Process Identifier (PID).', 'Discover rogue listening ports, socket conflicts, malware connections, or port hogs.', 'Use when troubleshooting port conflicts (e.g., port 80/443/8080 already in use) or suspecting unauthorized outbound connections.', 'Standard User', 'SAFE', 'TCP  0.0.0.0:80  0.0.0.0:0  LISTENING  4512 (where 4512 is the Process ID).', 'Use "tasklist /FI \"PID eq 4512\"" in CMD to identify the process name holding the port.', FALSE),

-- Hardware & Disk Commands
(5, 'Check Disk File System Integrity', 'chkdsk C: /f /r', 'Scans the specified drive for file system logical errors (/f) and locates bad physical sectors to recover readable information (/r).', 'Repair disk corruption, bad sectors, and file system anomalies causing read errors or freezes.', 'Use when disk read errors occur, event ID 55 appears in Event Viewer, or Windows boots into Automatic Repair.', 'Administrator', 'HIGH', 'Prompt to schedule scan at next system reboot. Upon reboot, 5-stage disk repair progress is shown.', 'Check Event Viewer under Windows Logs > Application for "Wininit" event logs post-reboot.', TRUE),

(3, 'Query Physical Disk Health via PowerShell', 'Get-PhysicalDisk | Select-Object DeviceId, FriendlyName, MediaType, HealthStatus, OperationalStatus, Size', 'Queries Windows Storage Management CIM provider to report physical drive health and media type.', 'Quickly distinguish between NVMe SSD, SATA SSD, and HDD, and verify hardware SMART operational status.', 'Standard User', 'SAFE', 'Table showing FriendlyName (e.g. Samsung 980 Pro), MediaType (SSD), HealthStatus (Healthy), OperationalStatus (OK).', 'If HealthStatus displays "Warning" or "Unhealthy", immediately backup data and schedule disk replacement.', TRUE),

-- Printer Support Commands
(10, 'Force Restart Print Spooler & Clear Spool Queue', 'net stop spooler && del /Q /F /S "%systemroot%\System32\Spool\Printers\*.*" && net start spooler', 'Stops the Windows Print Spooler service, deletes stuck print jobs in the queue folder, and restarts the spooler.', 'Fix stuck print queues that block all subsequent print jobs or crash the printer service.', 'Run when documents remain stuck on "Deleting" or "Printing" indefinitely and the printer is unresponsive.', 'Administrator', 'MODERATE', 'The Print Spooler service was stopped successfully. Deleted stuck files. The Print Spooler service was started successfully.', 'Open Print Management or Settings > Printers and verify queue count is 0 and status is Ready.', TRUE),

-- Security Commands
(4, 'Windows Defender Threat & Signature Status', 'Get-MpComputerStatus | Select-Object AMServiceEnabled, AntispywareEnabled, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated, QuickScanAge', 'Fetches current state of Microsoft Defender real-time engine, definition timestamps, and scan history.', 'Verify that antivirus protection is active and signatures are up to date.', 'Administrator', 'SAFE', 'Table confirming AMServiceEnabled: True, RealTimeProtectionEnabled: True, and recent signature update date.', 'Ensure AntivirusSignatureLastUpdated is within the last 48 hours.', FALSE)
ON CONFLICT DO NOTHING;

-- 5. TROUBLESHOOTING GUIDES
INSERT INTO troubleshooting_guides (category_id, title, description, symptoms, target_os, difficulty, estimated_time_minutes)
VALUES
(1, 'Windows 11 / 10 Corrupted System Files & Random Crashes', 'Comprehensive diagnostic workflow to detect and repair operating system component corruption, missing system libraries, and spontaneous Blue Screen (BSOD) stop errors.', 'Random application crashes, BSOD stop codes (e.g., CRITICAL_PROCESS_DIED, SYSTEM_SERVICE_EXCEPTION), Windows Explorer restarts, slow boot times.', 'Windows 11 / Windows 10', 'BEGINNER', 20),

(2, 'Complete Network & DNS Resolution Diagnostics', 'Structured procedure to diagnose local adapter configuration, gateway reachability, DNS resolver responsiveness, and socket integrity.', 'Endpoint displays "No Internet Access" yellow warning, websites cannot be reached by name, API timeouts, default gateway ping failure.', 'Windows 11 / 10 / Server', 'BEGINNER', 15),

(10, 'Print Spooler Crash & Stuck Queue Recovery', 'Resolve hung printer queues, unresponsive Print Spooler service, and printer offline statuses caused by corrupted spool documents or driver deadlocks.', 'Print jobs stuck on "Printing" or "Deleting" forever, printer status shows "Error - Printing", Print Spooler service stops automatically.', 'Windows 11 / 10 / Windows Server', 'BEGINNER', 10)
ON CONFLICT DO NOTHING;

-- 6. GUIDE STEPS
INSERT INTO guide_steps (guide_id, step_number, title, instruction, command_id, warning_note, expected_result)
VALUES
(1, 1, 'Repair Windows Component Store with DISM', 'Open PowerShell or Command Prompt as Administrator. Execute DISM RestoreHealth to verify that the local staging files are pristine before scanning individual system files.', 2, 'Ensure active internet access so DISM can download original files from Microsoft Update servers if local cache is corrupted.', 'DISM completes with "[==========================100.0%==========================] The restore operation completed successfully."'),
(1, 2, 'Execute System File Checker (SFC)', 'Run the SFC command to scan protected files and replace damaged or missing DLLs and system executables.', 1, 'Do not close the console window until verification reaches 100%.', 'Output indicates: "Windows Resource Protection found corrupt files and successfully repaired them."'),
(1, 3, 'Perform Disk File System Integrity Verification', 'Schedule a full disk check on drive C: to rule out underlying NTFS file system corruption or failing hardware sectors.', 8, 'This operation requires a computer restart and may take 15 to 45 minutes depending on disk speed and size.', 'System reboots, checks drive during boot phase, and repairs orphaned clusters.'),
(1, 4, 'Verify Stability and Inspect Event Logs', 'Reboot the machine into Windows normally. Open Event Viewer (eventvwr.msc) and check Windows Logs > System for critical Kernel-Power or Disk errors.', NULL, 'If crashes persist after SFC and DISM, proceed to RAM memory diagnostic (mdsched.exe) and hardware health tests.', 'System boots smoothly without spontaneous crash dialogs.'),

(2, 1, 'Inspect Adapter IP & Gateway Configuration', 'Execute ipconfig /all to verify that the endpoint received a valid IPv4 address, default gateway, and DNS servers from DHCP.', 4, 'If the IP begins with 169.254.x.x, the endpoint is not receiving DHCP leases from the router/switch.', 'Valid IP address in subnet (e.g. 192.168.1.50) with reachable Default Gateway (e.g. 192.168.1.1).'),
(2, 2, 'Flush Stale DNS Resolver Cache', 'Purge outdated DNS host name cache entries to ensure the endpoint queries the current nameserver directly.', 5, NULL, '"Successfully flushed the DNS Resolver Cache."'),
(2, 3, 'Test Gateway and DNS Port Connectivity', 'Use PowerShell Test-NetConnection to probe Google Public DNS (8.8.8.8) on port 53 to confirm outbound UDP/TCP routing.', 7, 'If this fails, the local router, switch, or firewall is blocking outbound traffic or gateway is down.', 'TcpTestSucceeded : True.'),
(2, 4, 'Full TCP/IP Stack & Winsock Reset (If Required)', 'If the network adapter has an IP address but cannot transmit sockets, reset the network stack and reboot.', 6, 'Requires system restart immediately following execution.', 'Successful reset confirmation messages for interfaces and catalog.'),

(3, 1, 'Stop Spooler and Purge Spool Directory', 'Run the combined command to safely stop the Print Spooler service, remove all corrupted .SPL and .SHD files from the spool directory, and restart the service.', 10, 'Any unsent documents currently waiting in the queue will be discarded and must be reprinted by the user.', 'All print spool queues are cleared and Print Spooler status transitions to Running.'),
(3, 2, 'Verify Printer Status in Control Panel', 'Open Printers & Scanners in Windows Settings. Confirm the target printer displays status "Ready" or "Idle" instead of "Offline" or "Error".', NULL, 'If printer remains offline, verify network IP connectivity or USB cable integrity.', 'Printer icon shows Ready state and prints a test page successfully.');

-- 7. CUSTOMERS
INSERT INTO customers (full_name, company_name, email, phone, address, notes)
VALUES
('Sarah Jenkins', 'Apex Logistics LLC', 'sjenkins@apexlogistics.com', '+1 (555) 234-5678', '450 Harbor Blvd, Suite 200, Seattle, WA', 'Key account. 25 workstations under managed support agreement.'),
('Marcus Vance', 'Vance Accounting Services', 'marcus@vancecpa.com', '+1 (555) 876-5432', '120 Pine Street, Floor 4, Portland, OR', 'Critical tax season support. Prefers on-site morning maintenance.');

-- 8. DEVICES
INSERT INTO devices (customer_id, device_name, device_type, os_version, serial_number, ip_address, mac_address, notes)
VALUES
(1, 'APEX-WS-04', 'DESKTOP', 'Windows 11 Pro 23H2', 'SN-APX-98214', '192.168.10.45', '00:1A:2B:3C:4D:5E', 'Dell OptiPlex 7090, 32GB RAM, 1TB NVMe'),
(1, 'APEX-PRN-01', 'PRINTER', 'Embedded Firmware 4.2', 'SN-HPLJ-404DN', '192.168.10.200', '00:1E:C9:AA:BB:CC', 'HP LaserJet Pro M404dn in main dispatch office'),
(2, 'VANCE-LT-01', 'LAPTOP', 'Windows 11 Pro 23H2', 'SN-LEN-X1C9-44', '192.168.1.112', 'F4:8E:38:11:22:33', 'Lenovo ThinkPad X1 Carbon Gen 9, Executive laptop');

-- 9. SUPPORT TICKETS
INSERT INTO support_tickets (ticket_number, customer_id, device_id, assigned_user_id, title, description, priority, status, resolution_summary)
VALUES
('TICK-2026-001', 1, 1, 1, 'Windows 11 BSOD on Startup (CRITICAL_PROCESS_DIED)', 'Workstation crashes into blue screen approximately 3 minutes after Windows login. User noticed slow disk access prior to crashes.', 'HIGH', 'RESOLVED', 'Executed DISM and SFC scan which repaired corrupt shell components. Ran chkdsk which cleared 2 orphaned clusters. Workstation stable after 48h observation.'),
('TICK-2026-002', 1, 2, 2, 'Main Dispatch Printer Offline and Queue Stalled', 'HP LaserJet M404dn shows offline in Windows. Technicians unable to print shipping manifests.', 'MEDIUM', 'RESOLVED', 'Purged corrupted print spooler queue directory and restarted Spooler service. Re-registered printer IP port.'),
('TICK-2026-003', 2, 3, 1, 'Intermittent Wi-Fi Disconnection & DNS Failure', 'Executive laptop drops connection every 20 minutes when roaming between office access points. DNS names fail to resolve.', 'HIGH', 'IN_PROGRESS', NULL);

-- 10. REPAIR HISTORY
INSERT INTO repair_history (ticket_id, technician_user_id, action_taken, commands_executed, parts_replaced, notes, completed_at)
VALUES
(1, 1, 'Scanned and repaired operating system image corruption and verified NTFS file system integrity.', 'DISM /Online /Cleanup-Image /RestoreHealth; sfc /scannow; chkdsk C: /f', 'None (Software remediation)', 'Advised user to keep 20% free space on C: drive for system staging.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 2, 'Cleared stuck spooler files and reset print service queue.', 'net stop spooler && del /Q /F /S "%systemroot%\System32\Spool\Printers\*.*" && net start spooler', 'None', 'Instructed dispatch staff not to power off printer mid-print job.', CURRENT_TIMESTAMP - INTERVAL '1 day');

-- 11. TOOL USAGE
INSERT INTO tool_usage (command_id, user_id, tool_name, execution_context, executed_at)
VALUES
(1, 1, 'sfc /scannow', 'Troubleshooting Ticket TICK-2026-001', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(2, 1, 'DISM /Online /Cleanup-Image /RestoreHealth', 'Troubleshooting Ticket TICK-2026-001', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(10, 2, 'Print Spooler Reset', 'Troubleshooting Ticket TICK-2026-002', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(4, 1, 'ipconfig /all', 'Initial Triage TICK-2026-003', CURRENT_TIMESTAMP - INTERVAL '3 hours');
