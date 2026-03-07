// ===== CLOCK & DATE =====
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.getElementById("current-time").textContent = time;
  const date = now.toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("current-date").textContent = date;
}
setInterval(updateClock, 1000);
updateClock();

// ===== CALENDAR =====
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem("dashboard-events")) || {};
let journals = JSON.parse(localStorage.getItem("dashboard-journals")) || {};

function saveEvents() {
  localStorage.setItem("dashboard-events", JSON.stringify(events));
}

function saveJournals() {
  localStorage.setItem("dashboard-journals", JSON.stringify(journals));
}

function getEventKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const moods = [
  { emoji: "😄", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😔", label: "Low" },
  { emoji: "😫", label: "Rough" },
];

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  let html = `
        <div class="calendar-nav">
            <button onclick="changeMonth(-1)"><i class="fas fa-chevron-left"></i></button>
            <span>${monthNames[month]} ${year}</span>
            <button onclick="changeMonth(1)"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day-name">Sun</div>
            <div class="calendar-day-name">Mon</div>
            <div class="calendar-day-name">Tue</div>
            <div class="calendar-day-name">Wed</div>
            <div class="calendar-day-name">Thu</div>
            <div class="calendar-day-name">Fri</div>
            <div class="calendar-day-name">Sat</div>
    `;

  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const key = getEventKey(year, month, day);
    const hasEvents = events[key] && events[key].length > 0;
    const hasJournal = journals[key] && journals[key].entry;
    const mood =
      journals[key] && journals[key].mood ? journals[key].mood : null;

    html += `
                <div class="calendar-day ${isToday ? "today" : ""} ${hasEvents ? "has-events" : ""}"
                    onclick="openEventModal(${year}, ${month}, ${day})"
                    title="${hasJournal ? "Has journal entry" : isToday ? "Today's Diary" : "Click to add events or journal"}">
                ${day}
                <div class="day-indicators">
                    ${hasEvents ? '<span class="event-dot"></span>' : ""}
                    ${mood ? `<span class="mood-indicator">${mood}</span>` : ""}
                </div>
            </div>
        `;
  }

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const remainingCells = totalCells - (firstDay + daysInMonth);
  for (let i = 1; i <= remainingCells; i++) {
    html += `<div class="calendar-day other-month">${i}</div>`;
  }

  html += `</div>`;
  document.getElementById("calendar-content").innerHTML = html;
}

function changeMonth(direction) {
  currentDate.setMonth(currentDate.getMonth() + direction);
  renderCalendar();
}

// ===== EVENT & JOURNAL MODAL =====
function openEventModal(year, month, day) {
  const key = getEventKey(year, month, day);
  const dayEvents = events[key] || [];
  const journalData = journals[key] || { mood: null, entry: "" };
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const existingModal = document.getElementById("event-modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "event-modal";
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;

  const moodSelectorHTML = moods
    .map(
      (m) => `
        <button onclick="selectMood('${key}', '${m.emoji}')"
            title="${m.label}"
            style="
                background: ${journalData.mood === m.emoji ? "rgba(142, 197, 252, 0.3)" : "rgba(255,255,255,0.05)"};
                border: 1px solid ${journalData.mood === m.emoji ? "#8ec5fc" : "rgba(255,255,255,0.1)"};
                border-radius: 8px;
                padding: 6px 8px;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.2s;
            ">
            ${m.emoji}
        </button>
    `,
    )
    .join("");

  modal.innerHTML = `
        <div id="modal-inner" style="
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 24px;
            width: 90%;
            max-width: 480px;
            color: white;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            max-height: 90vh;
            overflow-y: auto;
        ">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.1);">
                <h3 style="font-size:1.1rem; font-weight:600; color:#8ec5fc;">${monthNames[month]} ${day}, ${year}</h3>
                <button onclick="closeEventModal()" style="background:none; border:none; color:rgba(255,255,255,0.4); cursor:pointer; font-size:1rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Events Section -->
            <div style="margin-bottom:20px;">
                <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:10px;">
                    <i class="fas fa-calendar-check" style="margin-right:6px;"></i>Events
                </p>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <input type="text" id="event-input" placeholder="Add an event or note..." style="
                        flex:1;
                        background: rgba(255,255,255,0.08);
                        border: 1px solid rgba(255,255,255,0.15);
                        border-radius: 10px;
                        padding: 10px 14px;
                        color: white;
                        font-size: 0.9rem;
                        outline: none;
                    " />
                    <button onclick="addEvent('${key}')" style="
                        background: linear-gradient(135deg, #8ec5fc, #e0c3fc);
                        border: none;
                        border-radius: 10px;
                        width: 40px;
                        height: 40px;
                        color: #1a1a2e;
                        font-size: 1rem;
                        cursor: pointer;
                    ">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;" id="event-list">
                    ${dayEvents
                      .map(
                        (event, index) => `
                        <li style="display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); border-radius:10px; padding:10px 14px;">
                            <i class="fas fa-circle" style="font-size:0.4rem; color:#8ec5fc;"></i>
                            <span style="flex:1; font-size:0.9rem;">${event}</span>
                            <button onclick="deleteEvent('${key}', ${index})" style="background:none; border:none; color:rgba(255,255,255,0.2); cursor:pointer;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </li>
                    `,
                      )
                      .join("")}
                </ul>
                ${dayEvents.length === 0 ? '<p style="text-align:center; color:rgba(255,255,255,0.3); font-size:0.85rem; padding:8px 0;">No events for this day</p>' : ""}
            </div>

            <!-- Divider -->
            <div style="border-top:1px solid rgba(255,255,255,0.1); margin-bottom:20px;"></div>

            <!-- Journal Section -->
            <div>
                <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:10px;">
                    <i class="fas fa-book" style="margin-right:6px;"></i>Journal
                </p>

                <!-- Mood Selector -->
                <p style="font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:8px;">How are you feeling?</p>
                <div style="display:flex; gap:8px; margin-bottom:16px;">
                    ${moodSelectorHTML}
                </div>

                <!-- Journal Entry -->
                <textarea id="journal-entry" placeholder="Write about your day..." style="
                    width: 100%;
                    min-height: 120px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.15);
                    border-radius: 10px;
                    padding: 12px 14px;
                    color: white;
                    font-size: 0.9rem;
                    outline: none;
                    resize: vertical;
                    font-family: inherit;
                    line-height: 1.5;
                ">${journalData.entry || ""}</textarea>

                <!-- Save Button -->
                <button onclick="saveJournalEntry('${key}')" style="
                    width: 100%;
                    margin-top: 10px;
                    background: linear-gradient(135deg, #8ec5fc, #e0c3fc);
                    border: none;
                    border-radius: 10px;
                    padding: 10px;
                    color: #1a1a2e;
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.2s;
                ">
                    <i class="fas fa-save" style="margin-right:6px;"></i>Save Journal Entry
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeEventModal();
  });

  setTimeout(() => document.getElementById("event-input").focus(), 100);

  document.getElementById("event-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addEvent(key);
  });
}

function closeEventModal() {
  const modal = document.getElementById("event-modal");
  if (modal) modal.remove();
}

window.selectMood = function (key, emoji) {
  if (!journals[key]) journals[key] = { mood: null, entry: "" };
  journals[key].mood = emoji;
  saveJournals();
  renderCalendar();
  const [year, month, day] = key.split("-").map(Number);
  openEventModal(year, month - 1, day);
};

window.saveJournalEntry = function (key) {
  const entry = document.getElementById("journal-entry").value.trim();
  if (!journals[key]) journals[key] = { mood: null, entry: "" };
  journals[key].entry = entry;
  saveJournals();
  renderCalendar();

  // Show saved confirmation
  const btn = document.querySelector("#modal-inner button:last-child");
  if (btn) {
    btn.innerHTML =
      '<i class="fas fa-check" style="margin-right:6px;"></i>Saved!';
    btn.style.background = "linear-gradient(135deg, #6fcf97, #27ae60)";
    setTimeout(() => {
      btn.innerHTML =
        '<i class="fas fa-save" style="margin-right:6px;"></i>Save Journal Entry';
      btn.style.background = "linear-gradient(135deg, #8ec5fc, #e0c3fc)";
    }, 2000);
  }
};

window.addEvent = function (key) {
  const input = document.getElementById("event-input");
  const text = input.value.trim();
  if (!text) return;
  if (!events[key]) events[key] = [];
  events[key].push(text);
  saveEvents();
  renderCalendar();
  const [year, month, day] = key.split("-").map(Number);
  openEventModal(year, month - 1, day);
};

window.deleteEvent = function (key, index) {
  events[key].splice(index, 1);
  if (events[key].length === 0) delete events[key];
  saveEvents();
  renderCalendar();
  const [year, month, day] = key.split("-").map(Number);
  openEventModal(year, month - 1, day);
};

window.openEventModal = openEventModal;
window.changeMonth = changeMonth;
window.closeEventModal = closeEventModal;

renderCalendar();
