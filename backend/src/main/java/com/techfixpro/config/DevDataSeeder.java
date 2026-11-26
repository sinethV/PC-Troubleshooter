package com.techfixpro.config;

import com.techfixpro.entity.Category;
import com.techfixpro.entity.Command;
import com.techfixpro.entity.Customer;
import com.techfixpro.entity.GuideStep;
import com.techfixpro.entity.TroubleshootingGuide;
import com.techfixpro.repository.CategoryRepository;
import com.techfixpro.repository.CommandRepository;
import com.techfixpro.repository.CustomerRepository;
import com.techfixpro.repository.TroubleshootingGuideRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Seeds a compact, realistic dataset for the in-memory dev profile.
 * The production PostgreSQL path still uses Flyway V1/V2 and ignores this class.
 */
@Component
@Profile({"dev", "render"})
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);

    private final CategoryRepository categoryRepository;
    private final CommandRepository commandRepository;
    private final TroubleshootingGuideRepository guideRepository;
    private final CustomerRepository customerRepository;

    public DevDataSeeder(CategoryRepository categoryRepository,
                         CommandRepository commandRepository,
                         TroubleshootingGuideRepository guideRepository,
                         CustomerRepository customerRepository) {
        this.categoryRepository = categoryRepository;
        this.commandRepository = commandRepository;
        this.guideRepository = guideRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        Map<String, Category> categories = new LinkedHashMap<>();
        categories.put("windows", category("Windows Troubleshooting", "windows", "Monitor",
                "Diagnostics for Windows boot, BSOD, updates, drivers, performance, and services", 1));
        categories.put("networking", category("Network Diagnostics", "networking", "Network",
                "IP configuration, DNS resolution, DHCP, ping, traceroute, and adapter checks", 2));
        categories.put("hardware", category("Hardware Diagnostics", "hardware", "Cpu",
                "CPU, memory, storage SMART health, GPU, and thermal sensors inspection", 3));
        categories.put("security", category("Security & Maintenance", "security", "ShieldCheck",
                "Defender status, Windows firewall, malware cleanup, and system hardening", 4));
        categories.put("disk-management", category("Disk Management", "disk-management", "HardDrive",
                "Check disk integrity, partition inspection, storage spaces, and TRIM", 5));
        categories.put("system-admin", category("System Administration", "system-admin", "Settings",
                "Event viewer queries, services, background tasks, and component store servicing", 6));
        categories.put("powershell", category("PowerShell & Automation", "powershell", "Terminal",
                "Modern administrative automation and deep WMI/CIM queries", 7));
        categories.put("windows-server", category("Windows Server & AD", "windows-server", "Server",
                "Active Directory, domain join, group policies, and DNS/DHCP server operations", 8));
        categories.put("linux", category("Linux Administration", "linux", "TerminalSquare",
                "Linux terminal essentials, systemd services, SSH connectivity, and syslog analysis", 9));
        categories.put("printers", category("Printer Support", "printers", "Printer",
                "Print Spooler recovery, queue purge, port redirection, and driver troubleshooting", 10));

        categories.values().forEach(categoryRepository::save);

        List<Command> commands = new ArrayList<>();
        commands.add(command(categories.get("windows"), "System File Checker (SFC)", "sfc /scannow",
                "Scans every protected Windows system file and replaces corrupted copies from the component cache.",
                "Repair corrupted Windows binaries and DLLs",
                "After blue screens, explorer crashes, missing DLL errors or unexplained system instability.",
                "Administrator", "SAFE", true,
                "Windows Resource Protection did not find any integrity violations.",
                "Wait for 100% completion. If files were repaired, run DISM afterwards and reboot."));

        commands.add(command(categories.get("windows"), "DISM Component Store Repair",
                "DISM /Online /Cleanup-Image /RestoreHealth",
                "Repairs the Windows component store image using Windows Update as the repair source.",
                "Fix a corrupted servicing stack that SFC cannot repair",
                "Run before SFC when SFC reports unrepaired files, or after Windows Update error 0x800f081f.",
                "Administrator", "SAFE", true,
                "The restore operation completed successfully.",
                "Re-run SFC afterwards to confirm the repair."));

        commands.add(command(categories.get("networking"), "Flush DNS Resolver Cache", "ipconfig /flushdns",
                "Clears the local DNS cache so stale or poisoned records are resolved again from the server.",
                "Resolve stale DNS records and name resolution failures",
                "Websites fail to load while ping to an IP address still works, or a site moved to a new host.",
                "Administrator", "SAFE", true,
                "Successfully flushed the DNS Resolver Cache.",
                "Retry the failing site, then test with nslookup to confirm the new record."));

        commands.add(command(categories.get("networking"), "Renew DHCP Lease",
                "ipconfig /release && ipconfig /renew",
                "Releases the current DHCP lease and requests a new address from the DHCP server.",
                "Recover from APIPA (169.254.x.x) addresses or stale leases",
                "The adapter shows 169.254.x.x, a duplicate IP warning, or the network changed.",
                "Administrator", "MODERATE", false,
                "The adapter receives a valid address in the subnet range.",
                "Confirm the default gateway is reachable with ping afterwards."));

        commands.add(command(categories.get("hardware"), "SSD / NVMe SMART Health",
                "Get-PhysicalDisk | Select-Object FriendlyName, MediaType, HealthStatus, OperationalStatus",
                "Reads the storage stack health state for every physical disk without writing to the device.",
                "Confirm whether a slow or failing disk is reporting a healthy status",
                "Random freezes, disk timeouts in Event Viewer, or before replacing storage.",
                "Administrator", "SAFE", false,
                "HealthStatus shows Healthy for the system disk.",
                "For deeper SMART attributes use the vendor tool; this query is a fast triage."));

        commands.add(command(categories.get("security"), "Update Defender Signatures", "Update-MpSignature",
                "Forces Microsoft Defender to download the latest antivirus definitions.",
                "Ensure malware scanning uses current signatures",
                "After a malware alert, before an offline scan, or when definitions are out of date.",
                "Administrator", "SAFE", false,
                "Signature version and last update time are current.",
                "Check Get-MpComputerStatus for AntivirusSignatureLastUpdated."));

        commands.add(command(categories.get("windows-server"), "Force Group Policy Update", "gpupdate /force",
                "Reapplies every computer and user policy from the domain controllers immediately.",
                "Apply new domain policy without waiting for the refresh interval",
                "A policy change is not taking effect on a domain-joined machine.",
                "Domain Admin", "MODERATE", false,
                "Computer and User policy update completed successfully.",
                "Run gpresult /r to confirm which policies applied."));

        commands.add(command(categories.get("linux"), "Restart a systemd Service",
                "sudo systemctl restart <service> && systemctl status <service> --no-pager",
                "Restarts a service and prints its current unit state and recent log lines.",
                "Recover a failed or wedged daemon",
                "A service is inactive, failed, or not responding after a configuration change.",
                "root / sudo", "MODERATE", false,
                "Active: active (running) in the status output.",
                "Check journalctl -u <service> -n 50 if it fails again."));

        commands.add(command(categories.get("printers"), "Restart Print Spooler",
                "Restart-Service -Name Spooler -Force",
                "Stops and restarts the Windows print spooler, clearing a wedged queue.",
                "Recover a stuck print queue or unresponsive printer",
                "Jobs stay in 'Deleting' state or the queue stops responding.",
                "Administrator", "MODERATE", true,
                "The Spooler service returns to Running.",
                "If jobs reappear, stop the spooler and clear C:\\Windows\\System32\\spool\\PRINTERS."));

        commands.add(command(categories.get("disk-management"), "Check Disk Read-Only Scan", "chkdsk C: /scan",
                "Scans the NTFS volume for file system errors without taking it offline or making changes.",
                "Detect file system corruption safely",
                "Event ID 55, unexpected free space changes, or before a repair run.",
                "Administrator", "SAFE", false,
                "Windows has scanned the file system and found no problems.",
                "If errors are found, schedule chkdsk /f at the next reboot."));

        commands.add(command(categories.get("disk-management"), "Free Up Disk Space (WinSxS Cleanup)",
                "Dism /Online /Cleanup-Image /StartComponentCleanup",
                "Removes superseded components from the Windows component store to reclaim disk space.",
                "Free up space on a full system drive",
                "The system drive is almost full, or Windows Update cleanup is needed.",
                "Administrator", "SAFE", false,
                "The operation completed successfully and WinSxS is smaller.",
                "Add /ResetBase only when you no longer need to uninstall installed updates."));

        commands.add(command(categories.get("system-admin"), "Query Critical System Events",
                "Get-WinEvent -FilterHashtable @{LogName='System'; Level=1,2} -MaxEvents 15 | Select-Object TimeCreated, Id, ProviderName, Message | Format-Table -Wrap",
                "Returns the most recent critical and error events from the System log.",
                "Find the cause behind reboots, crashes and device failures",
                "Unexplained restarts, hardware errors, or after a BSOD.",
                "Administrator", "SAFE", false,
                "A short table of recent critical/error events with timestamps.",
                "Look for repeated event IDs; a single occurrence is often benign."));

        commands.add(command(categories.get("powershell"), "Top Memory Processes",
                "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Name, Id, @{N='RAM_MB';E={[math]::Round($_.WorkingSet64/1MB,1)}}",
                "Lists the ten processes using the most physical memory right now.",
                "Identify what is consuming RAM during a slowdown",
                "High memory pressure, swapping, or fans running constantly.",
                "Standard User", "SAFE", false,
                "A table of process names with their memory usage in MB.",
                "Investigate unfamiliar names before ending any process."));

        commandRepository.saveAll(commands);

        seedWifiGuide(categories.get("networking"), commands);
        seedUpdateGuide(categories.get("windows"), commands);

        Customer customer = new Customer();
        customer.setFullName("Sample Customer");
        customer.setCompanyName("Demo Workshop");
        customer.setEmail("customer@example.com");
        customer.setPhone("+1 555 0100");
        customer.setNotes("Seeded by the dev profile for UI demonstration.");
        customerRepository.save(customer);

        log.info("Dev dataset ready: {} categories, {} commands, {} guides",
                categoryRepository.count(), commandRepository.count(), guideRepository.count());
    }

    private void seedWifiGuide(Category category, List<Command> commands) {
        TroubleshootingGuide guide = new TroubleshootingGuide();
        guide.setCategory(category);
        guide.setTitle("Wi-Fi connects but there is no internet");
        guide.setDescription("Isolate whether the fault is DNS, DHCP or the upstream router, then restore connectivity.");
        guide.setSymptoms("wifi keeps disconnecting, drops randomly, connected but no internet, pages do not load");
        guide.setTargetOs("Windows 11 / Windows 10");
        guide.setDifficulty("INTERMEDIATE");
        guide.setEstimatedTimeMinutes(20);

        guide.getSteps().add(step(guide, 1, "Confirm the scope",
                "Ping 8.8.8.8. If it replies, the link is fine and DNS is the likely suspect. If it fails, check the router and DHCP.",
                null, null, "A reply means IP connectivity works."));
        guide.getSteps().add(step(guide, 2, "Flush the DNS cache",
                "Clear stale resolver entries, then retry the failing site.",
                find(commands, "Flush DNS Resolver Cache"), null, "Successfully flushed the DNS Resolver Cache."));
        guide.getSteps().add(step(guide, 3, "Renew the DHCP lease",
                "If the adapter holds a 169.254.x.x address, release and renew the lease.",
                find(commands, "Renew DHCP Lease"), "Briefly drops the network connection.",
                "A valid address in the expected subnet."));
        guide.getSteps().add(step(guide, 4, "Verify name resolution",
                "Run nslookup for the failing host and compare it with the router DNS. Change the DNS server if it returns the wrong record.",
                null, null, "The resolved address matches the expected host."));

        guideRepository.save(guide);
    }

    private void seedUpdateGuide(Category category, List<Command> commands) {
        TroubleshootingGuide guide = new TroubleshootingGuide();
        guide.setCategory(category);
        guide.setTitle("Windows Update stuck at 0%");
        guide.setDescription("Repair the component store and the update cache before retrying the download.");
        guide.setSymptoms("update stuck at 0 percent, error 0x80070002, update download loop");
        guide.setTargetOs("Windows 11 / Windows 10");
        guide.setDifficulty("ADVANCED");
        guide.setEstimatedTimeMinutes(45);

        guide.getSteps().add(step(guide, 1, "Repair the component store",
                "Run DISM with RestoreHealth so Windows Update has a healthy servicing image.",
                find(commands, "DISM Component Store Repair"), null,
                "The restore operation completed successfully."));
        guide.getSteps().add(step(guide, 2, "Verify system files",
                "Run SFC after DISM to replace any remaining corrupted binaries.",
                find(commands, "System File Checker (SFC)"), null,
                "No integrity violations reported."));
        guide.getSteps().add(step(guide, 3, "Retry the update",
                "Return to Settings, Windows Update, and check for updates again. Reboot if prompted.",
                null, null, "The update progresses past 0%."));

        guideRepository.save(guide);
    }

    private GuideStep step(TroubleshootingGuide guide, int number, String title, String instruction,
                           Command command, String warning, String expected) {
        GuideStep step = new GuideStep();
        step.setGuide(guide);
        step.setStepNumber(number);
        step.setTitle(title);
        step.setInstruction(instruction);
        step.setCommand(command);
        step.setWarningNote(warning);
        step.setExpectedResult(expected);
        return step;
    }

    private Command find(List<Command> commands, String name) {
        return commands.stream().filter(c -> c.getName().equals(name)).findFirst().orElse(null);
    }

    private Category category(String name, String slug, String icon, String description, int order) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setIconName(icon);
        category.setDescription(description);
        category.setSortOrder(order);
        return category;
    }

    private Command command(Category category, String name, String syntax, String explanation,
                            String purpose, String whenToUse, String permissions, String risk,
                            boolean featured, String expectedOutput, String verification) {
        Command command = new Command();
        command.setCategory(category);
        command.setName(name);
        command.setCommandSyntax(syntax);
        command.setExplanation(explanation);
        command.setPurpose(purpose);
        command.setWhenToUse(whenToUse);
        command.setRequiredPermissions(permissions);
        command.setRiskLevel(risk);
        command.setFeatured(featured);
        command.setExpectedOutput(expectedOutput);
        command.setVerificationInstructions(verification);
        return command;
    }
}
