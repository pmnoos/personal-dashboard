// ===== WORLD CLOCK =====
const worldClockTimeZones = [
  { label: "Local", zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: "London", zone: "Europe/London" },
  { label: "Brisbane", zone: "Australia/Brisbane" },
  { label: "Sweden", zone: "Europe/Stockholm" },
  { label: "Christchurch", zone: "Pacific/Auckland" },
];

function formatClockTime(timeZone) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    }).format(new Date());
  } catch {
    return "Invalid zone";
  }
}

function renderWorldClock() {
  const content = document.getElementById("world-clock-content");
  if (!content) return;

  const rows = worldClockTimeZones
    .map(
      (location) => `
        <div class="clock-row">
            <span class="clock-label">${location.label}</span>
            <span class="clock-time" data-zone="${location.zone}">${formatClockTime(location.zone)}</span>
        </div>
      `,
    )
    .join("");

  content.innerHTML = `
    <div class="clock-list">
      ${rows}
    </div>
  `;

  setInterval(() => {
    const timeElements = content.querySelectorAll(".clock-time");
    timeElements.forEach((timeElement) => {
      const zone = timeElement.getAttribute("data-zone");
      if (!zone) return;
      timeElement.textContent = formatClockTime(zone);
    });
  }, 1000);
}

renderWorldClock();
