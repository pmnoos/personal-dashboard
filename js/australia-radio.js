// ===== AUSTRALIA RADIO =====
const australiaStations = [
  {
    name: "4BH",
    url: "https://play.listnr.com/station/4bh",
    description: "Brisbane talk and music",
  },
  {
    name: "River 949",
    url: "https://www.iheart.com/live/river-949-9287/",
    description: "Brisbane and Ipswich local radio",
  },
  {
    name: "ABC Classic",
    url: "https://www.abc.net.au/listen/live/classic?tz=nsw",
    description: "Classical music from ABC Listen",
  },
];

function withAutoplay(url) {
  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.set("autoplay", "1");
    parsedUrl.searchParams.set("autoPlay", "true");
    return parsedUrl.toString();
  } catch {
    return url;
  }
}

function renderAustraliaRadio() {
  const content = document.getElementById("australia-radio-content");
  if (!content) return;

  const stationLinks = australiaStations
    .map(
      (station, index) => `
        <button class="radio-station-link radio-station-btn" data-station-index="${index}">
            <span class="radio-station-name">${station.name}</span>
            <span class="radio-station-desc">${station.description}</span>
        </button>
      `,
    )
    .join("");

  content.innerHTML = `
    <p class="radio-subtitle">Click a station to open and play</p>
    <div class="radio-station-list">
      ${stationLinks}
    </div>
    <div class="radio-player-wrap" id="radio-player-wrap">
      <p class="radio-player-placeholder">No in-widget app popups. Stations open in a new tab.</p>
    </div>
  `;

  const stationButtons = content.querySelectorAll(".radio-station-btn");
  const playerWrap = document.getElementById("radio-player-wrap");

  stationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const stationIndex = Number(button.getAttribute("data-station-index"));
      const station = australiaStations[stationIndex];
      if (!station) return;
      const stationUrl = withAutoplay(station.url);

      stationButtons.forEach((item, index) => {
        item.classList.toggle("active", index === stationIndex);
      });

      const popupWindow = window.open(stationUrl, "_blank", "noopener,noreferrer");
      const popupBlocked =
        !popupWindow || popupWindow.closed || typeof popupWindow.closed === "undefined";

      if (playerWrap) {
        if (popupBlocked) {
          playerWrap.innerHTML = `
            <p class="radio-now-playing radio-popup-warning">
              Popup blocked for ${station.name}. Allow popups for this dashboard, then click again.
            </p>
            <a href="${stationUrl}" target="_blank" rel="noopener noreferrer" class="radio-open-link">
              Open ${station.name} manually
            </a>
          `;
          return;
        }

        playerWrap.innerHTML = `
          <p class="radio-now-playing">Opening ${station.name}...</p>
          <a href="${stationUrl}" target="_blank" rel="noopener noreferrer" class="radio-open-link">
            If it didn't open, click here
          </a>
        `;
      }

      popupWindow.focus();
    });
  });
}

renderAustraliaRadio();
