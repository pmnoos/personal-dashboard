const quotes = [
    "Through simplicity, we find meaning.",
    "Write your life as if it matters — because it does.",
    "Small moments create great memories.",
    "The best stories are lived, not just written.",
    "Be kind to your future self.",
    "Chaos is often the birthplace of clarity."
];

function loadDailyQuote() {
    const quoteElement = document.getElementById("quote-text");

    // Rotate quote based on day of year (so it changes daily)
    const dayIndex = new Date().getDay();
    quoteElement.innerText = quotes[dayIndex % quotes.length];
}

loadDailyQuote();