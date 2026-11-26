// TechFix Pro - Universal Computer Model & Diagnostic Troubleshooting Database
// Covers major PC brands, hardware specifications, recovery hotkeys, and known issue remediations

export const brandDossiers = {
  ASUS: {
    name: 'ASUS / ROG',
    fullName: 'ASUSTeK Computer Inc.',
    badgeColor: 'from-blue-600 to-indigo-600',
    biosKey: 'F2 or Delete at power on',
    bootMenu: 'Escape or F8',
    recoveryPartition: 'F9 (ASUS System Recovery) or MyASUS in WinRE',
    diagnosticTool: 'MyASUS Hardware Diagnostic (built into UEFI)',
    supportUrl: 'https://www.asus.com/support/',
    description: 'Leader in gaming (ROG/TUF) and ultraportable ZenBook/Vivobook laptops. Known for Armoury Crate utility, AniMe Matrix displays, and high-performance dual-fan cooling.',
    topTips: [
      'To enter UEFI BIOS fast: Hold F2 while powering on the laptop.',
      'If fans stay at 100% or battery drains fast: Restart Armoury Crate Control Interface service or use open-source G-Helper.',
      'For MediaTek Wi-Fi dropouts: Disable PCIe Link State Power Management in powercfg.'
    ]
  },
  DELL: {
    name: 'Dell / Alienware',
    fullName: 'Dell Technologies',
    badgeColor: 'from-sky-600 to-blue-700',
    biosKey: 'F2 repeatedly when Dell logo appears',
    bootMenu: 'F12 (One-Time Boot Menu)',
    recoveryPartition: 'F12 > Select "SupportAssist OS Recovery"',
    diagnosticTool: 'F12 > Select "Diagnostics" (ePSA Hardware Diagnostic sweep)',
    supportUrl: 'https://www.dell.com/support/',
    description: 'Industry standard for enterprise (Latitude/OptiPlex) and creator flagships (XPS). Features built-in ePSA hardware test in every motherboard firmware.',
    topTips: [
      'Built-in ePSA: Press F12 at power-on to run memory, thermal sensor, and drive health checks without loading Windows.',
      'Amber blinking power LED indicates hardware diagnostic blink codes (e.g., 2 amber 4 white = RAM fault).',
      'For Thunderbolt dock display drops: Cycle dock AC power and reinstall Intel Thunderbolt Controller drivers.'
    ]
  },
  LENOVO: {
    name: 'Lenovo / ThinkPad',
    fullName: 'Lenovo Group Ltd.',
    badgeColor: 'from-red-600 to-rose-700',
    biosKey: 'Enter key at ThinkPad logo > then press F1',
    bootMenu: 'Enter key at ThinkPad logo > then press F12',
    recoveryPartition: 'F11 or Novo Button (recessed pinhole on side/bottom)',
    diagnosticTool: 'Enter key at boot > press F10 for Lenovo UEFI Diagnostics',
    supportUrl: 'https://pcsupport.lenovo.com/',
    description: 'Renowned for ThinkPad durability, TrackPoint pointing stick, and Legion gaming thermals. Includes Lenovo Vantage suite and emergency reset pinhole on base.',
    topTips: [
      'If laptop refuses to power on: Press the emergency reset pinhole button on the bottom chassis for 10 seconds using a paperclip.',
      'Battery stops charging at 60% or 80%: "Battery Charge Threshold" is active in Lenovo Commercial Vantage.',
      'Fn / Ctrl key swap can be toggled either in UEFI BIOS or inside Lenovo Vantage.'
    ]
  },
  HP: {
    name: 'HP / OMEN',
    fullName: 'HP Inc.',
    badgeColor: 'from-cyan-600 to-teal-700',
    biosKey: 'F10 (or press Escape repeatedly to open Startup Menu)',
    bootMenu: 'F9 (Boot Device Options)',
    recoveryPartition: 'F11 for HP System Recovery / Sure Recover',
    diagnosticTool: 'F2 at startup for HP PC Hardware Diagnostics UEFI',
    supportUrl: 'https://support.hp.com/',
    description: 'Global PC leader across Spectre convertibles, EliteBook enterprise laptops, and OMEN gaming desktops. Protected by HP Wolf Security and Sure Start BIOS protection.',
    topTips: [
      'Press Escape repeatedly immediately after pressing power button to display HP Startup Menu (F1 System Info, F2 Diagnostic, F9 Boot, F10 BIOS).',
      'If HP Sure Start warns of unauthorized BIOS change: allow 3 minutes for automated hardware rollback.',
      'Use HP Support Assistant or HP Image Assistant (HPIA) for clean enterprise driver staging.'
    ]
  },
  APPLE: {
    name: 'Apple Mac',
    fullName: 'Apple Inc.',
    badgeColor: 'from-slate-600 to-zinc-800',
    biosKey: 'Press and hold Power (Touch ID) button until "Loading startup options" appears',
    bootMenu: 'Hold Option/Alt at chime (Intel Macs) or hold Power button (Apple Silicon M1/M2/M3/M4)',
    recoveryPartition: 'Hold Command + R at boot (Intel) or Startup Options > Options (Apple Silicon)',
    diagnosticTool: 'Hold "D" key during startup to launch Apple Diagnostics (hardware error codes like ADP000)',
    supportUrl: 'https://support.apple.com/',
    description: 'High-efficiency Apple Silicon systems (M1/M2/M3/M4 series). Uniform unified memory architecture, Liquid Retina XDR displays, and hardware-level Secure Enclave encryption.',
    topTips: [
      'Apple Silicon hardware test: Turn off Mac, press and hold Power button until startup options appear, then press Command + D.',
      'DFU Mode Recovery: Can revive unbootable M-series Macs using Apple Configurator 2 connected via Thunderbolt.',
      'Battery Cycle count check: Apple Menu > About This Mac > System Report > Power > Health Information.'
    ]
  },
  MICROSOFT: {
    name: 'Microsoft Surface',
    fullName: 'Microsoft Corporation',
    badgeColor: 'from-blue-500 to-cyan-600',
    biosKey: 'Press and hold Volume Up (+) button, then press and release Power button',
    bootMenu: 'Press and hold Volume Down (-) button, then press and release Power button',
    recoveryPartition: 'Surface Recovery USB Image from official Microsoft portal',
    diagnosticTool: 'Surface Diagnostic Toolkit for Business (SDT) command-line or app',
    supportUrl: 'https://support.microsoft.com/surface',
    description: 'Pioneer of 2-in-1 touch computing with Surface Pro, Surface Laptop, and Copilot+ ARM/Intel architecture. Controlled via Surface UEFI firmware.',
    topTips: [
      'Force hard restart / two-button reset: Hold Power button for 20-30 seconds until Windows logo flashes twice.',
      'Boot to USB: Hold Volume Down (-) while pressing Power button, release Volume Down when Surface logo appears.',
      'Run Surface Diagnostic Toolkit to check touchscreen digitizer, battery wear, and Type Cover connectors.'
    ]
  },
  RAZER: {
    name: 'Razer Blade',
    fullName: 'Razer Inc.',
    badgeColor: 'from-emerald-600 to-green-700',
    biosKey: 'F1 or Delete key at Razer logo',
    bootMenu: 'F12 key at boot',
    recoveryPartition: 'F9 for Razer System Recovery',
    diagnosticTool: 'Razer Synapse Performance Profiler & Windows Memory Diagnostic',
    supportUrl: 'https://support.razer.com/',
    description: 'Premium CNC aluminum unibody gaming laptops with vapor chamber cooling, high-refresh OLED panels, and Razer Synapse Chroma integration.',
    topTips: [
      'If battery starts warping or trackpad becomes stiff to click: Immediately inspect for battery swelling (common in hot climates).',
      'For Synapse high CPU usage: Disable Razer Chroma Broadcast and Game Sync in Synapse Connect tab.',
      'To calibrate battery: Charge to 100%, discharge to 5%, charge continuously to 100% on AC.'
    ]
  },
  MSI: {
    name: 'MSI',
    fullName: 'Micro-Star International',
    badgeColor: 'from-red-700 to-amber-700',
    biosKey: 'Delete key repeatedly at MSI dragon logo',
    bootMenu: 'F11 for Boot Option Menu',
    recoveryPartition: 'F3 at boot for MSI Factory Recovery Partition',
    diagnosticTool: 'Hidden BIOS Advanced Menu: Right Shift + Right Ctrl + Left Alt + F2',
    supportUrl: 'https://www.msi.com/support/',
    description: 'High-performance gaming laptops and motherboards known for Cooler Boost aggressive fan profiles and unlocked UEFI capabilities.',
    topTips: [
      'Access hidden technician BIOS menu: Enter BIOS with Delete, then press Right Shift + Right Ctrl + Left Alt + F2.',
      'EC (Embedded Controller) Reset: Unplug AC, press and hold power button for 30 seconds until power LED flashes.',
      'MSI Center infinite loading: Reinstall MSI Central Service using the official MSI Clean Center tool.'
    ]
  },
  ACER: {
    name: 'Acer / Predator',
    fullName: 'Acer Inc.',
    badgeColor: 'from-lime-600 to-emerald-700',
    biosKey: 'F2 at Acer logo',
    bootMenu: 'F12 (Must be enabled inside BIOS first)',
    recoveryPartition: 'Alt + F10 at startup for Acer eRecovery Management',
    diagnosticTool: 'Acer Care Center Hardware Diagnostics',
    supportUrl: 'https://www.acer.com/support/',
    description: 'Broad lineup from Predator and Nitro gaming machines to ultra-light Swift Go and budget-friendly Aspire series.',
    topTips: [
      'F12 boot menu is disabled by default: Enter BIOS with F2, go to Main tab, enable "F12 Boot Menu", press F10.',
      'Battery reset pinhole: Many Acer laptops have a pinhole on the bottom cover to disconnect battery power for 5 seconds.',
      'If PredatorSense does not launch: Verify Acer Predator Service is running in services.msc.'
    ]
  },
  SAMSUNG: {
    name: 'Samsung Galaxy Book',
    fullName: 'Samsung Electronics',
    badgeColor: 'from-indigo-600 to-blue-800',
    biosKey: 'F2 at Samsung logo',
    bootMenu: 'F10 key at boot',
    recoveryPartition: 'F4 key at startup for Samsung Recovery',
    diagnosticTool: 'Samsung Update & Samsung Device Care app',
    supportUrl: 'https://www.samsung.com/support/',
    description: 'Ultra-thin Dynamic AMOLED 2X laptops with seamless Samsung Galaxy ecosystem connectivity (Quick Share, Second Screen, Multi Control).',
    topTips: [
      'Press F4 at boot to launch Samsung Recovery for factory reset or user data backup.',
      'Auto Booting feature (turns on when lid opens): Can be toggled in Samsung Settings app > Battery & Performance.',
      'Use Samsung Update utility from Microsoft Store for firmware and Intel graphics drivers.'
    ]
  }
};

export const commonSymptomsList = [
  { id: 'wifi', label: 'Wi-Fi & Bluetooth Drops', icon: 'Wifi', count: 18 },
  { id: 'thermal', label: 'Overheating & Loud Fans', icon: 'Flame', count: 15 },
  { id: 'screen', label: 'Black Screen & MUX Switch', icon: 'Monitor', count: 14 },
  { id: 'battery', label: 'Battery Drain & Sleep Issues', icon: 'BatteryCharging', count: 12 },
  { id: 'bsod', label: 'Blue Screen (BSOD) & Crashes', icon: 'AlertTriangle', count: 16 },
  { id: 'bitlocker', label: 'BitLocker & TPM Prompts', icon: 'Lock', count: 9 },
  { id: 'input', label: 'Trackpad & Keyboard Glitches', icon: 'Keyboard', count: 11 },
  { id: 'dock', label: 'USB-C Dock & External Displays', icon: 'Tv', count: 8 }
];

export const computerModels = [
  // ==========================================
  // ASUS MODELS
  // ==========================================
  {
    id: 'asus-rog-g14',
    brand: 'ASUS',
    model: 'ROG Zephyrus G14 (GA402 / GA403)',
    series: 'ROG Zephyrus Gaming',
    category: 'Gaming Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'AMD Ryzen 9 7940HS / Ryzen 9 8945HS (8 Cores, 16 Threads, up to 5.2 GHz with Ryzen AI)',
      gpu: 'NVIDIA GeForce RTX 4060 / 4070 / 4080 Laptop GPU (Up to 125W TGP with ROG Boost)',
      ram: '16GB / 32GB LPDDR5X-6400 or DDR5-4800 (Up to 48GB total expansion)',
      storage: '1TB / 2TB PCIe 4.0 NVMe M.2 2280 SSD (Single M.2 Slot)',
      display: '14" 3K OLED 120Hz / ROG Nebula Display QHD+ 165Hz (2560 x 1600), 500 nits, 100% DCI-P3',
      battery: '73WHr / 76WHr 4-cell Li-ion (Supports 240W DC in + 100W USB-C PD 3.0)',
      wifi: 'Wi-Fi 6E (802.11ax) Dual band 2*2 + Bluetooth 5.3 (MediaTek MT7922 or Intel AX210)'
    },
    recoveryKeys: {
      biosKey: 'F2 or Delete at boot',
      bootMenu: 'Escape or F8 at power-on',
      recoveryPartition: 'F9 at startup (ASUS System Recovery)',
      diagnosticTest: 'ASUS Cloud Recovery inside UEFI BIOS (EZ Flash Utility)'
    },
    commonIssues: [
      {
        id: 'asus-g14-prob-1',
        title: 'Mediatek Wi-Fi Card Random Disconnections & High Ping',
        symptoms: 'Wi-Fi adapter suddenly disappears from Device Manager or drops connection every 15-30 minutes under load.',
        cause: 'MediaTek MT7922 driver power-saving bug and aggressive PCIe Link State sleep timeouts in Windows 11.',
        solution: 'Disable PCIe Link State Power Management in power scheme and update to driver v23.032 or swap to Intel AX210.',
        command: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS 0012ee47-9041-4b5d-9b77-535fba8b1442 0 && powercfg -setactive SCHEME_CURRENT'
      },
      {
        id: 'asus-g14-prob-2',
        title: 'Armoury Crate High CPU / Battery Drain & Fan Stutter',
        symptoms: 'Fans ramp to 100% while idle, battery lasts less than 2.5 hours, ArmouryCrate.UserSessionHelper uses 15% CPU.',
        cause: 'ASUS Optimization service deadlocks with Windows 11 23H2 core isolation and background update loop.',
        solution: 'Restart ASUS services cleanly, clear the Asus Update cache, or switch to lightweight open-source G-Helper.',
        command: 'net stop "ArmouryCrateControlInterface" && net stop "AsusAppService" && net start "AsusAppService"'
      },
      {
        id: 'asus-g14-prob-3',
        title: 'Modern Standby (S0) Sleep Drain & Black Screen on Wake',
        symptoms: 'Laptop becomes very hot inside backpack while lid is closed and refuses to turn on screen without hard reboot.',
        cause: 'Modern Standby (S0) network connectivity prevents deep sleep states when USB peripherals or Bluetooth are connected.',
        solution: 'Configure network disconnected in Modern Standby and enable Hibernate on lid close.',
        command: 'powercfg /setdcvalueindex scheme_current sub_none F15ADD04-1877-4569-99B7-234B0302E1B4 0'
      }
    ]
  },

  {
    id: 'asus-zenbook-14',
    brand: 'ASUS',
    model: 'ZenBook 14 OLED (UX3405 / UX3402)',
    series: 'ZenBook Premium',
    category: 'Ultrabook',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core Ultra 7 155H / Ultra 9 185H (16 Cores, Intel AI Boost NPU)',
      gpu: 'Intel Arc Graphics (Integrated 8 Xe-Cores)',
      ram: '16GB or 32GB LPDDR5X-7467MHz (Soldered Dual-Channel, Non-upgradeable)',
      storage: '512GB / 1TB M.2 NVMe PCIe 4.0 SSD (Standard 2280 Slot)',
      display: '14.0" 3K (2880 x 1800) OLED 120Hz 16:10, 0.2ms response, 600 nits HDR',
      battery: '75WHr, 4-cell Li-ion (Supports 65W USB-C Fast Charging)',
      wifi: 'Intel Wi-Fi 6E (802.11ax) + Bluetooth 5.3'
    },
    recoveryKeys: {
      biosKey: 'F2 at startup',
      bootMenu: 'Escape key repeatedly at power-on',
      recoveryPartition: 'Hold Shift while clicking Restart > Troubleshoot > Reset this PC',
      diagnosticTest: 'MyASUS in WinRE / UEFI Diagnostic Tool'
    },
    commonIssues: [
      {
        id: 'asus-zen-prob-1',
        title: 'OLED Display Flickering at Low Brightness Levels',
        symptoms: 'Subtle horizontal flickering or graininess visible when screen brightness is set under 30% in dark environments.',
        cause: 'PWM dimming frequency conflicting with Intel Graphics display power saving technology (DPST).',
        solution: 'Disable Intel Display Power Saving Technology (DPST) via registry and lock refresh rate to 120Hz.',
        command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e968-e325-11ce-bfc1-08002be10318}\\0000" /v FeatureTestControl /t REG_DWORD /d 0x9240 /f'
      },
      {
        id: 'asus-zen-prob-2',
        title: 'NumberPad 2.0 (Touchpad Calculator) Unresponsive',
        symptoms: 'Touching top-right corner of the trackpad fails to illuminate LED number pad calculator grid.',
        cause: 'ASUS Precision Touchpad Filter driver disabled during Windows Update or corrupted I2C HID device.',
        solution: 'Re-enable the Asus HID filter driver in Device Manager and restart I2C ACPI service.',
        command: 'pnputil /restart-device "ACPI\\ASUE1200"'
      }
    ]
  },

  {
    id: 'asus-tuf-a15',
    brand: 'ASUS',
    model: 'ASUS TUF Gaming A15 / F15 (FA507 / FX507)',
    series: 'TUF Gaming',
    category: 'Gaming Laptop',
    year: '2022 - 2024',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'AMD Ryzen 7 7735HS / Intel Core i7-13620H (8 to 14 Cores)',
      gpu: 'NVIDIA GeForce RTX 4050 / 4060 Laptop GPU (140W Max TGP with MUX Switch)',
      ram: '16GB DDR5-4800MHz (2x SO-DIMM Slots, Upgradable to 64GB)',
      storage: '512GB / 1TB NVMe PCIe 4.0 SSD (Has 2x M.2 2280 NVMe Slots for dual storage)',
      display: '15.6" FHD (1920x1080) 144Hz IPS-level Display, G-Sync support',
      battery: '90WHr 4-cell Li-ion with 240W AC power adapter',
      wifi: 'Wi-Fi 6 (802.11ax) + Realtek Gigabit LAN (RJ-45 port)'
    },
    recoveryKeys: {
      biosKey: 'F2 at power on',
      bootMenu: 'F8 or Esc key',
      recoveryPartition: 'F9 key at boot',
      diagnosticTest: 'MyASUS Hardware Diagnostic in UEFI'
    },
    commonIssues: [
      {
        id: 'tuf-prob-1',
        title: 'Realtek Gigabit Ethernet Dropouts & 100Mbps Speed Cap',
        symptoms: 'LAN cable connected shows 100 Mbps instead of 1 Gbps, or disconnects completely during large game downloads.',
        cause: 'Energy Efficient Ethernet (EEE) power throttling by Realtek PCIe GBE family driver.',
        solution: 'Disable Energy Efficient Ethernet and Advanced EEE in the network adapter properties.',
        command: 'powershell "Set-NetAdapterAdvancedProperty -Name * -DisplayName \'Energy Efficient Ethernet\' -DisplayValue \'Disabled\' -ErrorAction SilentlyContinue"'
      },
      {
        id: 'tuf-prob-2',
        title: 'NVIDIA MUX Switch Black Screen on Display Mode Change',
        symptoms: 'Laptop screen turns completely black when switching from Hybrid/Optimus to dGPU Discrete GPU mode.',
        cause: 'Advanced Optimus driver state conflict with Windows DWM dynamic refresh rate.',
        solution: 'Press Win + Ctrl + Shift + B to restart graphic driver, then set GPU mode to Standard in Armoury Crate.',
        command: 'dism /Online /Cleanup-Image /RestoreHealth'
      }
    ]
  },

  {
    id: 'asus-vivobook-16',
    brand: 'ASUS',
    model: 'ASUS Vivobook 15 / 16 (X1504 / X1605 / M1605)',
    series: 'Vivobook Everyday',
    category: 'Budget Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i5-1335U / AMD Ryzen 5 7530U (Up to 10 Cores)',
      gpu: 'Intel Iris Xe Graphics / AMD Radeon Graphics',
      ram: '8GB / 16GB DDR4-3200 (8GB Onboard + 1x SODIMM Slot, Upgradable to 24GB)',
      storage: '512GB M.2 NVMe PCIe 3.0 / 4.0 SSD',
      display: '16.0" WUXGA (1920x1200) 16:10 IPS Anti-glare 300 nits display',
      battery: '42WHr / 50WHr 3-cell Li-ion with 45W / 65W AC Adapter',
      wifi: 'Wi-Fi 6E (802.11ax) + Bluetooth 5.3'
    },
    recoveryKeys: {
      biosKey: 'F2 at startup',
      bootMenu: 'Escape key repeatedly at power-on',
      recoveryPartition: 'F9 key or Shift + Restart',
      diagnosticTest: 'MyASUS Hardware Diagnostic in UEFI'
    },
    commonIssues: [
      {
        id: 'asus-vivo-prob-1',
        title: 'Touchpad Gestures Stop Responding After Windows Update',
        symptoms: 'Two-finger scrolling and pinch-to-zoom fail completely; only basic single-tap mouse clicks work.',
        cause: 'ASUS Precision Touchpad I2C driver overwritten by generic Microsoft PS/2 mouse driver.',
        solution: 'Re-register ASUS Pointing Device HID I2C driver package and clear driver cache.',
        command: 'pnputil /restart-device "HID\\VID_0B05&PID_19B5"'
      },
      {
        id: 'asus-vivo-prob-2',
        title: 'Battery Slow Charging / "Weak Charging State" Warning',
        symptoms: 'Windows displays warning popup: "Your PC is charging slowly. Use the charger that came with your device".',
        cause: 'Using sub-45W USB-C phone chargers or disabled ASUS Battery Health Charging 100% profile.',
        solution: 'Switch battery profile in MyASUS app to Full Capacity Mode and use official 65W charger.',
        command: 'powercfg /batteryreport /output C:\\battery-report.html'
      }
    ]
  },

  {
    id: 'asus-rog-strix-scar',
    brand: 'ASUS',
    model: 'ASUS ROG Strix SCAR 16 / 18 (G634 / G834)',
    series: 'ROG Strix Flagship',
    category: 'Gaming Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i9-13980HX / i9-14900HX (24 Cores, 32 Threads, up to 5.8 GHz, Conductonaut Extreme Liquid Metal)',
      gpu: 'NVIDIA GeForce RTX 4080 / 4090 Laptop GPU 16GB GDDR6 (175W Max TGP)',
      ram: '32GB / 64GB DDR5-5600MHz (2x SODIMM Slots, Up to 64GB)',
      storage: '1TB to 4TB PCIe 4.0 NVMe SSD in RAID 0 (Dual M.2 Slots)',
      display: '16" or 18" ROG Nebula HDR QHD+ (2560x1600) 240Hz Mini LED, 1100 nits, 100% DCI-P3',
      battery: '90WHr 4-cell Li-ion with 330W AC Power Brick',
      wifi: 'Intel Wi-Fi 6E AX211 + 2.5G LAN RJ-45 port'
    },
    recoveryKeys: {
      biosKey: 'Delete or F2 key at startup',
      bootMenu: 'Escape or F8 at power-on',
      recoveryPartition: 'F9 at boot',
      diagnosticTest: 'MyASUS UEFI Diagnostic with fan speed calibration'
    },
    commonIssues: [
      {
        id: 'asus-scar-prob-1',
        title: 'Core i9 Overheating & Thermal Throttling to 2.2 GHz',
        symptoms: 'CPU reaches 98°C instantly under game loading and downclocks, accompanied by loud coil whine.',
        cause: 'Liquid metal dry-spot barrier displacement on the CPU die from vertical backpack transport.',
        solution: 'Perform manual EC reset and apply -50mV CPU undervolt offset in UEFI BIOS Advanced Tweaker.',
        command: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61'
      },
      {
        id: 'asus-scar-prob-2',
        title: 'Mini LED Backlight Zone Bleed & HDR Bloom',
        symptoms: 'Bright halos surround white mouse cursor and subtitle text on pure black backgrounds.',
        cause: 'Single-zone backlight mode enabled instead of Multi-Zone local dimming in Armoury Crate.',
        solution: 'Toggle Mini LED mode from Single-Zone to Multi-Zone in Armoury Crate / G-Helper display settings.',
        command: 'dism /Online /Cleanup-Image /CheckHealth'
      }
    ]
  },

  // ==========================================
  // DELL MODELS
  // ==========================================
  {
    id: 'dell-xps-15',
    brand: 'DELL',
    model: 'Dell XPS 15 (9530 / 9520)',
    series: 'XPS Premium',
    category: 'Workstation / Creator',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: '13th Gen Intel Core i7-13700H / i9-13900H (14 Cores / 20 Threads)',
      gpu: 'Intel Iris Xe + NVIDIA GeForce RTX 4050 / 4060 / 4070 (50W TGP)',
      ram: '16GB / 32GB / 64GB DDR5-4800MHz (2x User-Accessible SODIMM Slots)',
      storage: '512GB to 4TB (2x M.2 2280 PCIe Gen 4x4 Slots)',
      display: '15.6" 3.5K (3456x2160) OLED Touch or 15.6" FHD+ (1920x1200) InfinityEdge',
      battery: '86WHr 6-cell Lithium-ion (130W USB-C AC Adapter)',
      wifi: 'Intel Killer Wi-Fi 6E 1675 (AX211) + Bluetooth 5.3'
    },
    recoveryKeys: {
      biosKey: 'F2 repeatedly when Dell logo appears',
      bootMenu: 'F12 for One-Time Boot Menu',
      recoveryPartition: 'Hold F12 > Select SupportAssist OS Recovery',
      diagnosticTest: 'Hold F12 at power-on > Select "Diagnostics" (ePSA Hardware Test)'
    },
    commonIssues: [
      {
        id: 'dell-xps-prob-1',
        title: 'Dell SupportAssist Boot Loop / "No Bootable Devices Found"',
        symptoms: 'Laptop reboots directly into Dell SupportAssist pre-boot diagnostic instead of loading Windows 11.',
        cause: 'BIOS SATA/NVMe Operation switched from AHCI/NVMe to RAID On (Intel RST) after Windows or BIOS update.',
        solution: 'Enter BIOS with F2 > System Configuration > Storage > Change SATA Operation from RAID On to AHCI/NVMe.',
        command: 'bcdedit /set {current} safeboot minimal'
      },
      {
        id: 'dell-xps-prob-2',
        title: 'Waves MaxxAudio Pro High CPU & Audio Jack Not Detecting Headset',
        symptoms: 'Plugging in headphones does not switch audio from speakers, WavesSysSvc64.exe consumes 20% CPU.',
        cause: 'Realtek Waves audio endpoint service communication deadlock in Windows 11.',
        solution: 'Restart Waves Audio service and set WavesSysSvc to Delayed Automatic start.',
        command: 'net stop "WavesSysSvc" && net start "WavesSysSvc"'
      },
      {
        id: 'dell-xps-prob-3',
        title: 'Thermal Throttling & Fan Whine at 100°C Under Heavy Load',
        symptoms: 'CPU clock drops from 4.8 GHz down to 1.2 GHz after 5 minutes of export or gaming, chassis extremely hot.',
        cause: 'Dust accumulation in dual vapor chamber or dried OEM thermal paste.',
        solution: 'Clean exhaust fins, set thermal profile to "Cool" or "Optimized" in Dell Command | Power Manager.',
        command: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61'
      }
    ]
  },

  {
    id: 'dell-latitude-5440',
    brand: 'DELL',
    model: 'Dell Latitude 5440 / 5540 Enterprise',
    series: 'Latitude Commercial',
    category: 'Business Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: '13th Gen Intel Core i5-1335U / i7-1365U vPro Enterprise',
      gpu: 'Intel Iris Xe Graphics',
      ram: '8GB / 16GB / 32GB DDR4 or DDR5 (2x SODIMM Slots, Max 64GB)',
      storage: '256GB / 512GB M.2 2230 / 2280 PCIe 4.0 SSD',
      display: '14.0" FHD (1920x1080) Non-Touch Anti-Glare, 250 or 400 nits',
      battery: '42WHr or 54WHr ExpressCharge capable (65W or 100W USB-C)',
      wifi: 'Intel Wi-Fi 6E AX211 + Optional 4G LTE / 5G Snapdragon Modem'
    },
    recoveryKeys: {
      biosKey: 'F2 at power on',
      bootMenu: 'F12 One-Time Boot Menu',
      recoveryPartition: 'F12 > SupportAssist OS Recovery',
      diagnosticTest: 'F12 > Diagnostics (Runs full RAM, CPU, Fan, and SSD SMART sweep)'
    },
    commonIssues: [
      {
        id: 'dell-lat-prob-1',
        title: 'USB-C Thunderbolt Dock (WD19 / WD22TB) External Monitors Not Detected',
        symptoms: 'Laptop charges via dock, but HDMI/DisplayPort external monitors stay black or say No Signal.',
        cause: 'Thunderbolt PCIe tunneling handshake failure or outdated Synaptics MST hub firmware on dock.',
        solution: 'Power cycle dock (unplug power brick 30 sec), reinstall Intel Thunderbolt Controller driver.',
        command: 'net stop "ThunderboltService" && net start "ThunderboltService"'
      },
      {
        id: 'dell-lat-prob-2',
        title: 'BitLocker Recovery Screen Prompt Every Boot',
        symptoms: 'Blue screen asking for 48-digit BitLocker recovery key after corporate dock docking or firmware updates.',
        cause: 'PCR 7 platform measurement validation failed due to changed Thunderbolt dock security authorization level.',
        solution: 'Suspend BitLocker protection for 1 reboot cycle to allow TPM to re-seal the new hardware hash.',
        command: 'manage-bde -protectors -disable C: -rebootcount 1'
      }
    ]
  },

  {
    id: 'dell-optiplex-7090',
    brand: 'DELL',
    model: 'Dell OptiPlex 7090 / 7010 Micro & Small Form Factor',
    series: 'OptiPlex Desktop',
    category: 'Business Desktop',
    year: '2021 - 2024',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i5-11500 / i7-11700 / i5-13500 (6 to 14 Cores)',
      gpu: 'Intel UHD Graphics 750 / Optional AMD Radeon RX 640 LP',
      ram: '8GB to 64GB DDR4-3200MHz (2x or 4x DIMM Slots)',
      storage: '1x M.2 2280 NVMe SSD + 1x 2.5" SATA SSD/HDD bay',
      display: 'Supports up to 4 DisplayPort 1.4 / HDMI 2.0 monitors',
      battery: 'Desktop AC (180W Internal 80 PLUS Bronze or 90W External Brick for Micro)',
      wifi: 'Intel Wi-Fi 6 AX201 + Gigabit Ethernet RJ45'
    },
    recoveryKeys: {
      biosKey: 'F2 at startup',
      bootMenu: 'F12 One-Time Boot Menu',
      recoveryPartition: 'F12 > SupportAssist OS Recovery',
      diagnosticTest: 'F12 > ePSA Diagnostics (Built-in hardware checker)'
    },
    commonIssues: [
      {
        id: 'dell-opt-prob-1',
        title: 'Amber Power LED Blinking 2, 4 (Memory Error)',
        symptoms: 'Computer powers on, fans spin, but no video display and power button blinks 2 amber then 4 white flashes.',
        cause: 'DIMM memory contact oxidation or unseated RAM module in slot 1.',
        solution: 'Unplug power cord, hold power button 15 sec, reseat RAM sticks into primary slots (Slot 2 and 4).',
        command: 'wmic memorychip get banklabel, capacity, memorytype, speed'
      }
    ]
  },

  {
    id: 'dell-inspiron-15',
    brand: 'DELL',
    model: 'Dell Inspiron 15 (3520 / 3530)',
    series: 'Inspiron Consumer',
    category: 'Budget Laptop',
    year: '2022 - 2024',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i3-1215U / i5-1335U / AMD Ryzen 5 7530U',
      gpu: 'Intel Iris Xe / AMD Radeon Graphics',
      ram: '8GB / 16GB DDR4-3200 (2x SODIMM Slots, Max 32GB)',
      storage: '256GB / 512GB M.2 2230/2280 NVMe SSD',
      display: '15.6" FHD (1920x1080) 120Hz Anti-Glare LED Display',
      battery: '41WHr or 54WHr 3-cell Li-ion with 65W barrel charger',
      wifi: 'Realtek Wi-Fi 5/6 + Bluetooth 5.0'
    },
    recoveryKeys: {
      biosKey: 'F2 at boot',
      bootMenu: 'F12 at boot',
      recoveryPartition: 'F12 > SupportAssist Recovery',
      diagnosticTest: 'F12 > Diagnostics (ePSA)'
    },
    commonIssues: [
      {
        id: 'dell-insp-prob-1',
        title: '"The AC power adapter wattage and type cannot be determined"',
        symptoms: 'BIOS alert at boot: Laptop refuses to charge battery, CPU throttles to minimum clock speed (0.79 GHz).',
        cause: 'Damaged center data pin in the Dell barrel plug or worn DC-in power jack harness.',
        solution: 'Inspect DC jack pin, blow out debris, replace the modular DC-in harness cable ($12 part).',
        command: 'powercfg /batteryreport'
      }
    ]
  },

  // ==========================================
  // LENOVO MODELS
  // ==========================================
  {
    id: 'lenovo-thinkpad-x1',
    brand: 'LENOVO',
    model: 'Lenovo ThinkPad X1 Carbon Gen 10 / 11 / 12',
    series: 'ThinkPad Flagship',
    category: 'Business Laptop',
    year: '2022 - 2024',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i7-1365U / Core Ultra 7 155H vPro (14-16 Cores)',
      gpu: 'Intel Iris Xe / Intel Arc Graphics',
      ram: '16GB / 32GB / 64GB LPDDR5-6000MHz (Soldered Dual-Channel)',
      storage: '512GB / 1TB / 2TB M.2 2280 PCIe 4.0 NVMe SSD',
      display: '14.0" 2.8K (2880 x 1800) OLED 120Hz or WUXGA (1920x1200) Low Power IPS',
      battery: '57WHr 4-cell with 65W USB-C RapidCharge (80% in 60 min)',
      wifi: 'Intel Wi-Fi 6E AX211 + Bluetooth 5.3 + Optional Fibocom 5G Sub-6'
    },
    recoveryKeys: {
      biosKey: 'Enter key at ThinkPad logo > then press F1',
      bootMenu: 'Enter key at ThinkPad logo > then press F12',
      recoveryPartition: 'F11 at ThinkPad logo (Lenovo Recovery)',
      diagnosticTest: 'Enter key > press F10 for Lenovo Diagnostics UEFI'
    },
    commonIssues: [
      {
        id: 'lenovo-x1-prob-1',
        title: 'Lenovo Commercial Vantage Battery Stuck at 60% or 80%',
        symptoms: 'Battery reaches 60% or 80% and says "Plugged in, not charging" even when left on AC adapter overnight.',
        cause: 'Battery Charge Threshold feature in Lenovo Vantage is enabled to preserve battery chemistry.',
        solution: 'Open Lenovo Vantage > Device > Power > Toggle off "Battery Charge Threshold" or adjust target to 100%.',
        command: 'Get-WmiObject -Namespace root\\wmi -Class Lenovo_Battery'
      },
      {
        id: 'lenovo-x1-prob-2',
        title: 'TrackPoint Red Dot Cursor Drifts Across Screen by Itself',
        symptoms: 'Mouse pointer slowly slides across screen without touching the red TrackPoint cap or trackpad.',
        cause: 'Thermal expansion and automatic strain-gauge recalibration in the keyboard TrackPoint sensor.',
        solution: 'Release finger completely from TrackPoint for 3-5 seconds to allow sensor auto-zero recalibration.',
        command: 'powershell "Restart-Service -Name SynTP -ErrorAction SilentlyContinue"'
      },
      {
        id: 'lenovo-x1-prob-3',
        title: 'No Sound from Built-in Dolby Atmos Quad Speakers',
        symptoms: 'Windows volume slider moves, but speakers emit no sound; headphones work normally.',
        cause: 'Lenovo Audio Processing Object (APO) driver service disabled during Windows audio update.',
        solution: 'Restart Windows Audio and Windows Audio Endpoint Builder services.',
        command: 'net stop "Audiosrv" && net stop "AudioEndpointBuilder" && net start "AudioEndpointBuilder" && net start "Audiosrv"'
      }
    ]
  },

  {
    id: 'lenovo-thinkpad-t14',
    brand: 'LENOVO',
    model: 'Lenovo ThinkPad T14 / P14s Gen 4 / Gen 5',
    series: 'ThinkPad Enterprise Workhorse',
    category: 'Business Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'AMD Ryzen 7 PRO 7840U / Intel Core i7-1365U vPro (Up to 8 Cores / 16 Threads)',
      gpu: 'AMD Radeon 780M / Intel Iris Xe Graphics',
      ram: '16GB / 32GB / 64GB LPDDR5X or DDR5 (Up to 64GB)',
      storage: '512GB / 1TB / 2TB M.2 2280 PCIe 4.0 SSD',
      display: '14.0" WUXGA (1920x1200) 16:10 Low Power IPS 400 nits',
      battery: '39.3WHr or 52.5WHr Li-Polymer with RapidCharge',
      wifi: 'Qualcomm NFA725A Wi-Fi 6E / Intel AX211 + RJ45 Gigabit LAN'
    },
    recoveryKeys: {
      biosKey: 'Enter key at boot > F1',
      bootMenu: 'Enter key at boot > F12',
      recoveryPartition: 'F11 at ThinkPad logo',
      diagnosticTest: 'Enter key > F10 for UEFI Diagnostics'
    },
    commonIssues: [
      {
        id: 'lenovo-t14-prob-1',
        title: 'Emergency Reset: Laptop Will Not Power On (Completely Dead)',
        symptoms: 'Power button LED does not illuminate even with known good 65W USB-C charger connected.',
        cause: 'Embedded Controller (EC) latch lockup state caused by static surge or dock disconnect.',
        solution: 'Locate emergency reset pinhole on bottom case, insert paperclip for 10 seconds, reconnect AC adapter.',
        command: 'powershell "Get-CimInstance Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus"'
      },
      {
        id: 'lenovo-t14-prob-2',
        title: 'Qualcomm Wi-Fi 6E Slow Roaming Between Office Access Points',
        symptoms: 'Walking between conference rooms results in "No Internet, Secured" for 45 seconds.',
        cause: 'Aggressive Roaming Disconnect threshold set too low in Qualcomm driver settings.',
        solution: 'Change "Roaming Aggressiveness" property to Medium-High in Device Manager.',
        command: 'netsh wlan show interfaces'
      }
    ]
  },

  {
    id: 'lenovo-legion-pro-5',
    brand: 'LENOVO',
    model: 'Lenovo Legion Pro 5 Gen 8 / 9',
    series: 'Legion Gaming',
    category: 'Gaming Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'AMD Ryzen 7 7745HX / Intel Core i7-14700HX (20 Cores, up to 5.5 GHz)',
      gpu: 'NVIDIA GeForce RTX 4070 Laptop GPU 8GB GDDR6 (140W TGP)',
      ram: '16GB / 32GB DDR5-5600MHz (2x SODIMM Slots, Max 64GB)',
      storage: '1TB M.2 2280 NVMe PCIe 4.0 SSD (Has 2x M.2 2280 SSD Slots)',
      display: '16" WQXGA (2560 x 1600) 240Hz IPS, 500 nits, DisplayHDR 400',
      battery: '80WHr 4-cell with 300W Slim Tip AC Adapter + 140W USB-C PD',
      wifi: 'Wi-Fi 6E (802.11ax) 2x2 + Realtek 2.5 Gigabit Ethernet RJ45'
    },
    recoveryKeys: {
      biosKey: 'F2 at boot or Novo Button on right side with pin',
      bootMenu: 'F12 at startup',
      recoveryPartition: 'Novo Button menu > System Recovery',
      diagnosticTest: 'F10 key for Lenovo Diagnostics'
    },
    commonIssues: [
      {
        id: 'legion-prob-1',
        title: 'Legion Vantage Overclocking Profile Game Crashes',
        symptoms: 'DirectX 12 games crash with DXGI_ERROR_DEVICE_REMOVED or crash straight to desktop within 10 minutes.',
        cause: 'Aggressive factory GPU core VRAM overclock profile in Vantage Performance Mode unstable on certain games.',
        solution: 'Switch Legion thermal profile to "Balance Mode" (Fn + Q) or disable GPU Overclock in Vantage.',
        command: 'sfc /scannow'
      }
    ]
  },

  // ==========================================
  // HP MODELS
  // ==========================================
  {
    id: 'hp-spectre-x360',
    brand: 'HP',
    model: 'HP Spectre x360 14 / 16 (2-in-1)',
    series: 'Spectre Convertible',
    category: '2-in-1 Touch',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core Ultra 7 155H / 13th Gen Core i7-13700H',
      gpu: 'Intel Arc Graphics / Optional NVIDIA RTX 4050',
      ram: '16GB / 32GB LPDDR5x-6400MHz (Soldered)',
      storage: '1TB / 2TB PCIe 4.0 NVMe M.2 SSD',
      display: '14.0" 2.8K (2880 x 1800) OLED 120Hz Touch, MPP 2.0 Stylus Support',
      battery: '68WHr 4-cell Li-ion polymer with 65W or 100W USB-C',
      wifi: 'Intel Wi-Fi 7 BE200 or Wi-Fi 6E AX211 + Bluetooth 5.4'
    },
    recoveryKeys: {
      biosKey: 'F10 at HP logo (or press Esc to open Startup Menu)',
      bootMenu: 'F9 for Boot Device Options',
      recoveryPartition: 'F11 for HP System Recovery',
      diagnosticTest: 'F2 for HP PC Hardware Diagnostics UEFI'
    },
    commonIssues: [
      {
        id: 'hp-spec-prob-1',
        title: '"HP Sure Start detected an unauthorized change to the BIOS"',
        symptoms: 'Boot displays black alert screen: "HP Sure Start has recovered your BIOS from a previous corrupt version".',
        cause: 'Windows Update pushed a firmware update that collided with HP Wolf Security TPM measurements.',
        solution: 'Let HP Sure Start complete automatic rollback (takes 3 min), then install BIOS update manually via HP Assistant.',
        command: 'powershell "Get-WmiObject -Namespace root\\hp\\instrumentedbios -Class HP_BIOSEvent -ErrorAction SilentlyContinue"'
      },
      {
        id: 'hp-spec-prob-2',
        title: 'Auto-Rotate Sensor Disabled (Screen Will Not Flip in Tablet Mode)',
        symptoms: 'Rotating laptop 360 degrees into tablet mode does not rotate screen orientation or disable physical keyboard.',
        cause: 'Intel Integrated Sensor Hub (ISH) driver disabled or Windows Sensor Monitoring service stopped.',
        solution: 'Restart Sensor Monitoring Service and re-calibrate accelerometer.',
        command: 'net stop "SensrSvc" && net start "SensrSvc"'
      }
    ]
  },

  {
    id: 'hp-elitebook-840',
    brand: 'HP',
    model: 'HP EliteBook 840 G9 / G10 Enterprise',
    series: 'EliteBook Commercial',
    category: 'Business Laptop',
    year: '2022 - 2024',
    image: 'https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i5-1335U / i7-1365U vPro (10 Cores)',
      gpu: 'Intel Iris Xe Graphics',
      ram: '16GB / 32GB DDR5-5200MHz (2x SODIMM Slots, Up to 64GB)',
      storage: '512GB / 1TB PCIe 4.0 NVMe M.2 2280 SSD',
      display: '14.0" WUXGA (1920x1200) IPS Anti-Glare 400 nits Low Power',
      battery: '51WHr Long Life 3-cell Li-ion with HP Fast Charge',
      wifi: 'Intel Wi-Fi 6E AX211 + Bluetooth 5.3 + NFC'
    },
    recoveryKeys: {
      biosKey: 'F10 (or Esc to display Startup Menu)',
      bootMenu: 'F9 for Boot Device Options',
      recoveryPartition: 'F11 for HP Sure Recover',
      diagnosticTest: 'F2 at startup for HP PC Hardware Diagnostics'
    },
    commonIssues: [
      {
        id: 'hp-elite-prob-1',
        title: 'HP Smart Audio / Bang & Olufsen App Missing After Reinstall',
        symptoms: 'Audio sounds hollow and quiet; the HP Audio Control app says "Service not available".',
        cause: 'Missing Realtek High Definition Audio Software Component and Conexant APO service.',
        solution: 'Install HP Audio Control DCH package from Microsoft Store and update Realtek I2S driver.',
        command: 'dism /online /get-drivers /format:table'
      }
    ]
  },

  {
    id: 'hp-omen-16',
    brand: 'HP',
    model: 'HP OMEN 16 (wf0000 / xf0000)',
    series: 'OMEN Gaming',
    category: 'Gaming Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i7-13700HX / AMD Ryzen 7 7840HS (Up to 16 Cores)',
      gpu: 'NVIDIA GeForce RTX 4060 / 4070 (140W Max TGP)',
      ram: '16GB / 32GB DDR5-5600 (2x SODIMM Slots, Max 64GB)',
      storage: '1TB M.2 NVMe PCIe 4.0 (Dual M.2 SSD Slots)',
      display: '16.1" QHD (2560x1440) 240Hz 3ms IPS 300 nits',
      battery: '83WHr 6-cell with 280W Smart AC adapter',
      wifi: 'Intel Wi-Fi 6E AX211 + Gigabit Ethernet'
    },
    recoveryKeys: {
      biosKey: 'F10 or Escape key',
      bootMenu: 'F9 Boot Device Options',
      recoveryPartition: 'F11 HP Recovery',
      diagnosticTest: 'F2 at boot for HP Diagnostics'
    },
    commonIssues: [
      {
        id: 'hp-omen-prob-1',
        title: 'Black Screen Hall-Effect Sensor Issue (Lid Sensor Stuck)',
        symptoms: 'Laptop turns on (keyboard lights up, fans spin) but screen remains completely off as if lid is closed.',
        cause: 'Hall effect magnetic lid sensor cable runs too close to rear heatsink causing thermal desoldering/grounding.',
        solution: 'Technician fix: disconnect the hall sensor daughter ribbon cable or insulate the sensor cable harness.',
        command: 'shutdown /r /fw /t 0'
      }
    ]
  },

  // ==========================================
  // APPLE MAC (Silicon & Intel)
  // ==========================================
  {
    id: 'apple-macbook-pro-14-16',
    brand: 'APPLE',
    model: 'Apple MacBook Pro 14" / 16" (M2 / M3 / M4 Pro & Max)',
    series: 'MacBook Pro Flagship',
    category: 'Workstation / Creator',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Apple M3 Pro (12-core CPU) / M3 Max (16-core CPU) with 16-core Neural Engine',
      gpu: 'Apple 18-core to 40-core GPU with Hardware-accelerated Ray Tracing and Dynamic Caching',
      ram: '18GB / 36GB / 48GB / 64GB / 128GB Unified Memory (Unified Architecture, Soldered)',
      storage: '512GB to 8TB PCIe SSD (Soldered Apple Controller)',
      display: '14.2" / 16.2" Liquid Retina XDR (3024x1964 or 3456x2234), 120Hz ProMotion, 1600 nits Peak',
      battery: '70WHr / 100WHr Li-Polymer (Up to 22 hours battery life, MagSafe 3 96W-140W)',
      wifi: 'Wi-Fi 6E (802.11ax) + Bluetooth 5.3 + 3x Thunderbolt 4 / HDMI / SDXC slot'
    },
    recoveryKeys: {
      biosKey: 'Hold Power (Touch ID) button until "Loading startup options" appears',
      bootMenu: 'Hold Power button down from cold boot until Startup Options gear icon displays',
      recoveryPartition: 'Select Options > Continue in Startup Options (macOS Recovery)',
      diagnosticTest: 'Hold "D" key while turning on (or press Command + D in Startup Options)'
    },
    commonIssues: [
      {
        id: 'apple-mbp-prob-1',
        title: 'Stage Manager / External Display Window Arrangement Reset',
        symptoms: 'Connecting via CalDigit or Belkin Thunderbolt dock scrambles desktop spaces and window positions.',
        cause: 'macOS windowserver display UUID cache conflict after waking from sleep.',
        solution: 'Delete windowserver display preferences plist file in ~/Library/Preferences/ByHost and log out.',
        command: 'rm ~/Library/Preferences/ByHost/com.apple.windowserver*.plist && killall Dock'
      },
      {
        id: 'apple-mbp-prob-2',
        title: 'Kernel Panic "SOCD report detected: AP watchdog expired"',
        symptoms: 'MacBook Pro spontaneously reboots overnight with pink screen flash or "Your computer restarted because of a problem".',
        cause: 'Audio driver extension (kext) or VPN virtual interface conflicting with Apple Silicon low power sleep state.',
        solution: 'Run Apple Diagnostics (Hold Command+D at boot) and remove third-party kernel audio virtual devices.',
        command: 'pmset -g assertions'
      }
    ]
  },

  {
    id: 'apple-macbook-air-13-15',
    brand: 'APPLE',
    model: 'Apple MacBook Air 13" / 15" (M2 / M3)',
    series: 'MacBook Air Ultraportable',
    category: 'Ultrabook',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Apple M2 / M3 chip (8-core CPU with 4 performance cores and 4 efficiency cores)',
      gpu: '8-core or 10-core GPU, 16-core Neural Engine',
      ram: '8GB / 16GB / 24GB Unified Memory',
      storage: '256GB / 512GB / 1TB / 2TB SSD',
      display: '13.6" / 15.3" Liquid Retina display (2560x1664 / 2880x1864), 500 nits, P3 wide color',
      battery: '52.6WHr / 66.5WHr (Completely fanless zero-noise passive cooling design)',
      wifi: 'Wi-Fi 6E (802.11ax) + Bluetooth 5.3 + MagSafe 3 + 2x Thunderbolt / USB 4'
    },
    recoveryKeys: {
      biosKey: 'Hold Touch ID / Power button until "Loading startup options" displays',
      bootMenu: 'Hold Power button at cold boot',
      recoveryPartition: 'Options > macOS Recovery',
      diagnosticTest: 'Hold Command + D inside Startup Options'
    },
    commonIssues: [
      {
        id: 'apple-air-prob-1',
        title: 'Base 256GB Model SSD Slower Read/Write Speed (Single NAND Chip)',
        symptoms: 'File transfers and video export take longer than M1 predecessor; heavy swapping causes stutter.',
        cause: 'Apple configured base 256GB models with single 256GB NAND chip instead of dual 128GB chips in parallel.',
        solution: 'Use external Thunderbolt NVMe enclosure for high-bandwidth video editing caches.',
        command: 'diskutil list'
      }
    ]
  },

  // ==========================================
  // MICROSOFT SURFACE
  // ==========================================
  {
    id: 'ms-surface-pro-9-10',
    brand: 'MICROSOFT',
    model: 'Microsoft Surface Pro 9 / 10 / 11 (Copilot+ PC)',
    series: 'Surface Pro 2-in-1',
    category: '2-in-1 Touch',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Snapdragon X Elite / Intel Core Ultra 7 165U / Core i7-1255U (Qualcomm NPU 45 TOPS)',
      gpu: 'Qualcomm Adreno GPU / Intel Iris Xe Graphics',
      ram: '8GB / 16GB / 32GB LPDDR5X (Soldered)',
      storage: '256GB / 512GB / 1TB Removable M.2 2230 PCIe 4.0 SSD (User Accessible via kickstand hatch!)',
      display: '13.0" PixelSense Flow OLED or LCD (2880 x 1920) 120Hz Dynamic Refresh, 3:2 aspect ratio',
      battery: '47.7WHr 4-cell with 65W Surface Connect or USB-C PD',
      wifi: 'Wi-Fi 7 / Wi-Fi 6E + Bluetooth 5.4 + Optional 5G eSIM'
    },
    recoveryKeys: {
      biosKey: 'Press and hold Volume Up (+) while pressing and releasing Power button',
      bootMenu: 'Press and hold Volume Down (-) while pressing and releasing Power button (Boots to USB)',
      recoveryPartition: 'Hold Volume Down (-) with official Surface Recovery USB Drive inserted',
      diagnosticTest: 'Surface Diagnostic Toolkit for Windows'
    },
    commonIssues: [
      {
        id: 'surf-prob-1',
        title: 'Surface Pro Type Cover Keyboard Stops Working Completely',
        symptoms: 'Physical keyboard keys and trackpad do not respond; keyboard backlight does not illuminate.',
        cause: 'Surface Type Cover Filter Device driver disabled in Device Manager or dirty magnetic pogo pins.',
        solution: 'Clean gold pogo pins with 90% Isopropyl alcohol, perform two-button hard shutdown (Power + Vol Up for 20s).',
        command: 'pnputil /restart-device "ACPI\\MSHW0098"'
      },
      {
        id: 'surf-prob-2',
        title: 'Surface UEFI Battery Limit Mode Stuck at 50%',
        symptoms: 'Battery icon says "Plugged in, not charging" at exactly 50% charge.',
        cause: 'Kiosk / Battery Limit mode was enabled inside Surface UEFI settings for continuous kiosk AC power.',
        solution: 'Boot to Surface UEFI (Vol Up + Power) > Kiosk / Battery tab > Turn off "Enable Battery Limit".',
        command: 'powercfg /batteryreport'
      }
    ]
  },

  {
    id: 'ms-surface-laptop-5-6',
    brand: 'MICROSOFT',
    model: 'Microsoft Surface Laptop 5 / 6 / 7 (Copilot+ PC)',
    series: 'Surface Laptop',
    category: 'Ultrabook',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Snapdragon X Elite (12 Cores) / Intel Core Ultra 7 165H',
      gpu: 'Qualcomm Adreno / Intel Arc Graphics',
      ram: '16GB / 32GB / 64GB LPDDR5X (Soldered)',
      storage: '256GB / 512GB / 1TB Removable M.2 2230 Gen 4 SSD',
      display: '13.8" or 15.0" PixelSense Flow Touch (2304x1536 / 2496x1664) 120Hz HDR',
      battery: '54WHr / 66WHr with fast charging (up to 20 hours battery life)',
      wifi: 'Wi-Fi 7 + Bluetooth 5.4 + USB 4 / Thunderbolt 4'
    },
    recoveryKeys: {
      biosKey: 'Hold Volume Up (+) and tap Power button',
      bootMenu: 'Hold Volume Down (-) and tap Power button',
      recoveryPartition: 'Surface Recovery Media USB',
      diagnosticTest: 'Surface Diagnostic Toolkit'
    },
    commonIssues: [
      {
        id: 'surf-lap-prob-1',
        title: 'Touchscreen Phantom Touches ("Ghost Touches") in Corner',
        symptoms: 'Circles flash on screen as if touched, causing windows to minimize or cursor to jump erratically.',
        cause: 'Electrostatic charge buildup on glass digitizer or faulty grounding from third-party charger.',
        solution: 'Unplug third-party charger, run Surface Diagnostic Toolkit Touch Calibration test.',
        command: 'powershell "Get-PnpDevice -FriendlyName \'*Touch Screen*\' | Enable-PnpDevice -Confirm:$false"'
      }
    ]
  },

  // ==========================================
  // RAZER BLADE
  // ==========================================
  {
    id: 'razer-blade-16',
    brand: 'RAZER',
    model: 'Razer Blade 16 (2023 / 2024)',
    series: 'Blade Flagship',
    category: 'Gaming Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: '13th / 14th Gen Intel Core i9-13950HX / i9-14900HX (24 Cores, 32 Threads, 5.8 GHz)',
      gpu: 'NVIDIA GeForce RTX 4070 / 4080 / 4090 16GB GDDR6 (175W Full TGP)',
      ram: '32GB / 64GB DDR5-5600MHz (2x SODIMM Slots, Max 96GB)',
      storage: '1TB / 2TB NVMe PCIe 4.0 M.2 SSD (Has 2x M.2 2280 NVMe Slots, Up to 8TB)',
      display: '16.0" Dual-Mode Mini-LED (UHD+ 120Hz & FHD+ 240Hz switchable) or 240Hz OLED',
      battery: '95.2WHr 4-cell with 280W / 330W GaN Power Adapter',
      wifi: 'Wi-Fi 7 (Qualcomm FastConnect 7800) or Intel Wi-Fi 6E AX211'
    },
    recoveryKeys: {
      biosKey: 'F1 or Delete key at startup',
      bootMenu: 'F12 key at boot',
      recoveryPartition: 'F9 for Razer System Recovery',
      diagnosticTest: 'Windows Memory Diagnostic & Razer Synapse Performance Profiler'
    },
    commonIssues: [
      {
        id: 'razer-prob-1',
        title: 'Chassis Battery Swelling (Trackpad Stiff / Hard to Click)',
        symptoms: 'Glass trackpad fails to click down mechanically, or laptop wobbles because rubber feet no longer touch table evenly.',
        cause: 'Lithium polymer battery pouch swelling caused by prolonged sustained high temperatures (85°C+ chassis heat).',
        solution: 'Technician urgency: Immediately unscrew bottom panel and safely remove swollen battery pouch; replace battery.',
        command: 'powercfg /batteryreport'
      },
      {
        id: 'razer-prob-2',
        title: 'Razer Synapse 3 High CPU & Memory Leak',
        symptoms: 'Razer Central and Razer Synapse Service consume 15-25% CPU continuously while gaming.',
        cause: 'Chroma Connect game sync polling registry continuously for RGB-compatible lighting titles.',
        solution: 'Disable "Chroma Connect" and "Chroma Visualizer" tabs inside Razer Synapse settings.',
        command: 'net stop "Razer Central Service" && net start "Razer Central Service"'
      }
    ]
  },

  // ==========================================
  // MSI MODELS
  // ==========================================
  {
    id: 'msi-stealth-16',
    brand: 'MSI',
    model: 'MSI Stealth 16 Studio (A13V / AI Studio)',
    series: 'Stealth Series',
    category: 'Creator & Gaming',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: '13th Gen Intel Core i7-13700H / Core Ultra 9 185H (Up to 16 Cores)',
      gpu: 'NVIDIA GeForce RTX 4070 8GB GDDR6 (105W TGP with Dynamic Boost)',
      ram: '32GB DDR5-5200MHz (2x SODIMM Slots, Max 64GB)',
      storage: '1TB / 2TB NVMe PCIe Gen 4x4 SSD (2x M.2 Slots)',
      display: '16.0" QHD+ 240Hz 16:10 DCI-P3 100% IPS Display',
      battery: '99.9WHr (Maximum legal airline capacity) with 240W adapter',
      wifi: 'Intel Killer Wi-Fi 6E AX1675 + 2.5Gbps LAN'
    },
    recoveryKeys: {
      biosKey: 'Delete key repeatedly at MSI dragon logo',
      bootMenu: 'F11 for Boot Option Menu',
      recoveryPartition: 'F3 at boot for MSI Factory Recovery',
      diagnosticTest: 'BIOS Hidden Advanced Menu: Right Shift + Right Ctrl + Left Alt + F2'
    },
    commonIssues: [
      {
        id: 'msi-prob-1',
        title: 'MSI Center Software Infinite "Waiting for SDK Initialization"',
        symptoms: 'MSI Center app opens but remains stuck on loading circle forever, preventing fan speed or RGB control.',
        cause: 'MSI Central Service permissions broken by Windows Defender SmartScreen update.',
        solution: 'Restart MSI Central Service and run MSI Clean Center Uninstaller utility.',
        command: 'net stop "MSI_Central_Service" && net start "MSI_Central_Service"'
      },
      {
        id: 'msi-prob-2',
        title: 'Right Hinge Cracking or Clicking Noise on Lid Open',
        symptoms: 'Lid opening produces a loud pop/snap noise and corner of bezel pulls apart near the hinge mount.',
        cause: 'Factory hinge tension torqued too tightly into plastic threaded chassis standoffs.',
        solution: 'Loosen hinge locknut by 1/4 turn with needle-nose pliers and reinforce mounting standoffs with epoxy.',
        command: 'wmic bios get serialnumber, smbiosbiosversion'
      }
    ]
  },

  {
    id: 'msi-katana-15',
    brand: 'MSI',
    model: 'MSI Katana 15 / GF63 Thin (B13V / B12V)',
    series: 'Katana Value Gaming',
    category: 'Gaming Laptop',
    year: '2022 - 2024',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i7-13620H / i5-12450H (10 Cores, 16 Threads)',
      gpu: 'NVIDIA GeForce RTX 4050 / 4060 Laptop GPU (105W Max TGP)',
      ram: '16GB DDR5-5200 (2x SODIMM Slots, Max 64GB)',
      storage: '512GB / 1TB PCIe 4.0 NVMe SSD (Has 2x M.2 Slots on Katana 15)',
      display: '15.6" FHD (1920x1080) 144Hz IPS-level display',
      battery: '53.5WHr 3-cell Li-ion with 200W Power Brick',
      wifi: 'Wi-Fi 6 (802.11ax) + Gigabit LAN RJ45'
    },
    recoveryKeys: {
      biosKey: 'Delete key at MSI logo',
      bootMenu: 'F11 Boot Menu',
      recoveryPartition: 'F3 at boot',
      diagnosticTest: 'Right Shift + Right Ctrl + Left Alt + F2 inside BIOS'
    },
    commonIssues: [
      {
        id: 'msi-kat-prob-1',
        title: 'CPU Thermal Throttling to 100°C Under Light Gaming',
        symptoms: 'Cooler Boost 5 fans run at deafening speeds, yet games drop from 120 FPS down to 35 FPS periodically.',
        cause: 'Shared heatpipe design between CPU and GPU saturates under simultaneous thermal load.',
        solution: 'Elevate laptop rear by 1 inch for airflow and cap Maximum Processor State to 99% in power options.',
        command: 'powercfg -setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 99 && powercfg -setactive SCHEME_CURRENT'
      }
    ]
  },

  // ==========================================
  // ACER MODELS
  // ==========================================
  {
    id: 'acer-predator-helios',
    brand: 'ACER',
    model: 'Acer Predator Helios 16 (PH16-71)',
    series: 'Predator Gaming',
    category: 'Gaming Laptop',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core i7-13700HX / i9-13900HX (24 Cores)',
      gpu: 'NVIDIA GeForce RTX 4080 12GB (175W Max TGP)',
      ram: '16GB or 32GB DDR5-4800 / 5600MHz (2x Slots, Max 64GB)',
      storage: '1TB / 2TB NVMe PCIe Gen 4 in RAID 0 support',
      display: '16.0" WQXGA (2560 x 1600) 240Hz 500 nits Mini LED or IPS',
      battery: '90WHr 4-cell with 330W Power Adapter',
      wifi: 'Killer Wi-Fi 6E AX1675i + Killer E2600 Gigabit Ethernet'
    },
    recoveryKeys: {
      biosKey: 'F2 at Acer logo',
      bootMenu: 'F12 (Must be enabled in BIOS under "F12 Boot Menu: Enabled")',
      recoveryPartition: 'Alt + F10 at startup for Acer eRecovery Management',
      diagnosticTest: 'Acer Care Center Hardware Check'
    },
    commonIssues: [
      {
        id: 'acer-prob-1',
        title: 'F12 Boot Menu Key Not Responding at Startup',
        symptoms: 'Pressing F12 at power-on does nothing and computer boots straight to Windows without showing boot menu.',
        cause: 'Acer factory disables F12 Boot Menu by default inside UEFI BIOS settings.',
        solution: 'Press F2 to enter BIOS > Main Tab > Change "F12 Boot Menu" from Disabled to Enabled > Press F10 to Save & Exit.',
        command: 'shutdown /r /fw /t 0'
      },
      {
        id: 'acer-prob-2',
        title: 'PredatorSense GPU Overclock Causes Instant BSOD MEMORY_MANAGEMENT',
        symptoms: 'Clicking "Turbo" button causes screen freeze followed by blue screen crash.',
        cause: 'VBIOS power limit spike exceeds factory voltage curve on early firmware versions.',
        solution: 'Update BIOS to v1.12 or newer from Acer Support page, which addresses Turbo mode voltage thresholds.',
        command: 'sfc /scannow'
      }
    ]
  },

  {
    id: 'acer-swift-go-14',
    brand: 'ACER',
    model: 'Acer Swift Go 14 / Aspire 5 (SFG14-71 / A515)',
    series: 'Swift Ultraportable',
    category: 'Ultrabook',
    year: '2023 - 2024',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core Ultra 7 155H / 13th Gen Core i5-13500H / AMD Ryzen 7 7730U',
      gpu: 'Intel Arc Graphics / Intel Iris Xe',
      ram: '16GB LPDDR5-4800 / 6400MHz (Soldered)',
      storage: '512GB / 1TB PCIe 4.0 NVMe SSD (Dual M.2 Slots!)',
      display: '14.0" 2.8K (2880 x 1800) OLED 90Hz / 120Hz 100% DCI-P3 500 nits',
      battery: '65WHr 3-cell Li-ion with 100W USB-C Fast Charger',
      wifi: 'Killer Wi-Fi 6E AX1675i + Bluetooth 5.3 + Dual USB-C Thunderbolt 4'
    },
    recoveryKeys: {
      biosKey: 'F2 at Acer logo',
      bootMenu: 'F12 (Enable in BIOS first)',
      recoveryPartition: 'Alt + F10 at boot',
      diagnosticTest: 'Acer Care Center > Tune-up & Diagnostics'
    },
    commonIssues: [
      {
        id: 'acer-swift-prob-1',
        title: 'Battery Disconnect Pinhole Reset (Laptop Not Turning On)',
        symptoms: 'Power LED does not light up and pressing power button has zero response.',
        cause: 'Acer motherboard static safety cutoff triggered by electrostatic discharge.',
        solution: 'Use a paperclip to press the battery reset pinhole on the bottom cover for 5 seconds, wait 5 minutes, plug in charger.',
        command: 'powercfg /batteryreport'
      }
    ]
  },

  // ==========================================
  // SAMSUNG GALAXY BOOK
  // ==========================================
  {
    id: 'samsung-galaxy-book-4',
    brand: 'SAMSUNG',
    model: 'Samsung Galaxy Book 4 Ultra / Pro 360',
    series: 'Galaxy Book Flagship',
    category: 'Workstation / Creator',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    specs: {
      cpu: 'Intel Core Ultra 7 155H / Ultra 9 185H (with Intel AI Boost NPU)',
      gpu: 'NVIDIA GeForce RTX 4070 Laptop GPU 8GB / Intel Arc Graphics',
      ram: '16GB / 32GB / 64GB LPDDR5X-7467 (Soldered)',
      storage: '512GB to 2TB PCIe 4.0 NVMe SSD (Has 2x M.2 2280 NVMe Slots for easy expansion)',
      display: '16.0" Dynamic AMOLED 2X 3K (2880x1800) 120Hz, Anti-Reflective, Vision Booster, Touch with S Pen',
      battery: '76WHr 4-cell with 140W USB-C Ultra-Compact Charger',
      wifi: 'Intel Wi-Fi 6E AX211 + Bluetooth 5.3 + Galaxy Connected Experience'
    },
    recoveryKeys: {
      biosKey: 'F2 at Samsung logo',
      bootMenu: 'F10 key at boot',
      recoveryPartition: 'F4 key at startup for Samsung Recovery',
      diagnosticTest: 'Samsung Device Care & Samsung Settings Diagnostic'
    },
    commonIssues: [
      {
        id: 'sam-prob-1',
        title: 'Samsung Multi Control / Second Screen Disconnecting Randomly',
        symptoms: 'Using Galaxy Tab as second monitor drops connection after 10 minutes or lags severely.',
        cause: 'Wi-Fi Direct channel congestion and Windows Defender firewall blocking Samsung Continuity service.',
        solution: 'Allow SamsungContinuityService.exe through Windows Firewall and ensure both devices use 5GHz Wi-Fi.',
        command: 'netsh advfirewall firewall add rule name="SamsungContinuity" dir=in action=allow program="C:\\Program Files\\Samsung\\SamsungContinuityService\\SamsungContinuityService.exe" enable=yes'
      },
      {
        id: 'sam-prob-2',
        title: 'Auto Booting on Lid Open Cannot Be Disabled in Windows',
        symptoms: 'Whenever screen is opened, laptop turns on immediately even when user only wants to clean the keyboard.',
        cause: 'Samsung Auto Booting is governed by Samsung firmware, not Windows power plan.',
        solution: 'Open Samsung Settings app > Battery & Performance > Toggle "Auto Booting" to OFF.',
        command: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61'
      }
    ]
  }
];
