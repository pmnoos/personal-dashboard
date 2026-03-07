// ===== PODCASTS =====
const podcasts = [
  {
    name: "Jo Whiley",
    show: "Evening Show",
    station: "BBC Radio 2",
    description: "Mon-Thu 7pm-9pm — Music, chat and good vibes",
    icon: "🎵",
    url: "https://www.bbc.co.uk/programmes/p0gdtmmy/episodes/guide",
    colour: "#8ec5fc",
  },
  {
    name: "Dotun Adebayo",
    show: "Up All Night",
    station: "BBC Radio 2",
    description: "Mon-Fri 1am-5am — News, sport and conversation",
    icon: "🌙",
    url: "https://www.bbc.co.uk/sounds/brand/p002vsmz",
    colour: "#e0c3fc",
  },
  {
    name: "Jenny Eclair & Judith Holder",
    show: "Older and Wider",
    station: "Podbean",
    description:
      "Weekly — Insight, gossip and news from the menopausal front and beyond",
    icon: "🎙️",
    url: "https://www.podbean.com/podcast-detail/ctjtx-7e57a/Older-and-Wider-Podcast",
    colour: "#f9c784",
  },
  {
    name: "BBC Radio London",
    show: "Live Stream",
    station: "BBC Sounds",
    description: "Live — London's local BBC radio station",
    icon: "📻",
    url: "https://www.bbc.co.uk/sounds/play/live/bbc_london",
    colour: "#ff9a9e",
  },
];

const PRIVADO_APP_URL = "PrivadoVPN://";
const VPN_SETTINGS_URL = "ms-settings:network-vpn";

function renderPodcasts() {
  const content = document.getElementById("podcast-content");

  const html = podcasts
    .map(
      (podcast, index) => `
        <div class="accordion-item">
            <button class="accordion-header" onclick="toggleAccordion(${index})"
                style="border-left: 3px solid ${podcast.colour};">
                <div class="accordion-left">
                    <span class="podcast-icon">${podcast.icon}</span>
                    <span class="accordion-name" style="color: ${podcast.colour};">${podcast.name}</span>
                </div>
                <i class="fas fa-chevron-down accordion-chevron" id="chevron-${index}"></i>
            </button>
            <div class="accordion-body" id="accordion-body-${index}">
                <div class="accordion-content">
                    <p class="podcast-show">${podcast.show} · ${podcast.station}</p>
                    <p class="podcast-desc">${podcast.description}</p>
                    <a href="${podcast.url}" target="_blank" rel="noopener noreferrer" class="podcast-link"
                        style="border-color: ${podcast.colour}; color: ${podcast.colour};">
                        <i class="fas fa-external-link-alt"></i> Open ${podcast.station}
                    </a>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  content.innerHTML = `
        <p class="podcast-subtitle">Click to expand</p>
        <div class="accordion">
            ${html}
        </div>
      <p class="vpn-hint">BBC listener? Open Privado and connect to a London server first.</p>
      <a href="${PRIVADO_APP_URL}" target="_blank" rel="noopener noreferrer" class="vpn-btn">
        <i class="fas fa-shield-alt"></i> Open Privado VPN
      </a>
      <a href="${VPN_SETTINGS_URL}" class="bbc-sounds-btn">
        <i class="fas fa-gear"></i> VPN Settings
      </a>
        <a href="https://www.bbc.co.uk/sounds" target="_blank" rel="noopener noreferrer" class="bbc-sounds-btn">
            <i class="fas fa-broadcast-tower"></i> Open BBC Sounds
        </a>
    `;
}

window.toggleAccordion = function (index) {
  const body = document.getElementById(`accordion-body-${index}`);
  const chevron = document.getElementById(`chevron-${index}`);
  const isOpen = body.style.maxHeight && body.style.maxHeight !== "0px";

  // Close all
  podcasts.forEach((_, i) => {
    const accordionBody = document.getElementById(`accordion-body-${i}`);
    accordionBody.style.maxHeight = "0px";
    accordionBody.classList.remove("open");
    document.getElementById(`chevron-${i}`).style.transform = "rotate(0deg)";
  });

  // Open clicked if it was closed
  if (!isOpen) {
    body.style.maxHeight = `${body.scrollHeight}px`;
    body.classList.add("open");
    chevron.style.transform = "rotate(180deg)";
  }
};

renderPodcasts();
