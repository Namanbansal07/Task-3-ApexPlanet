const COUNTRY_API = "https://countriesnow.space/api/v0.1/countries/info";
const COUNTRY_FIELDS = "currency,capital,flag,unicodeFlag";

export function initCountrySearch() {
  const form = document.querySelector("#country-search-form");
  const input = document.querySelector("#country-query");
  const searchButton = document.querySelector("#country-search-button");
  const status = document.querySelector("#country-status");
  const results = document.querySelector("#country-results");
  const retryButton = document.querySelector("#country-retry");
  if (!form || !input || !searchButton || !status || !results || !retryButton) {
    console.error("Country search could not be initialized because required page elements are missing.");
    return;
  }

  let lastQuery = "";
  let isLoading = false;

  function setStatus(message, type = "") {
    status.textContent = message;
    status.className = `api-status${type ? ` is-${type}` : ""}`;
  }

  function displayValue(value) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value) && value.length > 0) {
      const entries = value.filter((entry) => typeof entry === "string" && entry.trim());
      return entries.length > 0 ? entries.join(", ") : "Not provided by this source";
    }
    return "Not provided by this source";
  }

  function renderCountry(country) {
    const card = document.createElement("article");
    card.className = "country-card";
    const visual = document.createElement("div");
    visual.className = "country-visual";
    if (typeof country.flag === "string" && isHttpsUrl(country.flag)) {
      const flag = document.createElement("img");
      flag.className = "country-flag";
      flag.alt = `${country.name} flag`;
      flag.loading = "lazy";
      flag.src = country.flag;
      flag.addEventListener("error", () => {
        flag.remove();
        visual.classList.add("flag-unavailable");
        visual.textContent = country.unicodeFlag || "Flag image unavailable";
      }, { once: true });
      visual.append(flag);
    } else {
      const flag = document.createElement("span");
      flag.className = "flag-emoji";
      flag.textContent = typeof country.unicodeFlag === "string" && country.unicodeFlag
        ? country.unicodeFlag
        : "🏳";
      flag.setAttribute("role", "img");
      flag.setAttribute("aria-label", `${country.name} flag`);
      visual.append(flag);
    }

    const content = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = country.name;
    const details = document.createElement("div");
    details.className = "country-details";
    const fields = [
      ["Capital", displayValue(country.capital)],
      ["Region", "Not provided by this source"],
      ["Population", "Not provided by this source"],
      ["Currency", displayValue(country.currency)],
      ["Languages", "Not provided by this source"]
    ];

    fields.forEach(([label, value]) => {
      const detail = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      detail.append(strong, document.createTextNode(value));
      details.append(detail);
    });
    content.append(name, details);
    card.append(visual, content);
    return card;
  }

  function isHttpsUrl(value) {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }

  async function searchCountry(query) {
    if (isLoading) return;
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      results.textContent = "";
      retryButton.hidden = true;
      setStatus("Enter a country name before searching.", "error");
      input.focus();
      return;
    }

    lastQuery = normalizedQuery;
    isLoading = true;
    searchButton.disabled = true;
    retryButton.hidden = true;
    results.textContent = "";
    setStatus("Looking around the world…", "loading");

    try {
      const url = new URL(COUNTRY_API);
      url.searchParams.set("returns", COUNTRY_FIELDS);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`The country service returned HTTP ${response.status}.`);
      }
      const payload = await response.json();
      if (!payload || payload.error !== false || !Array.isArray(payload.data)) {
        throw new Error("The country service returned data in an unexpected format.");
      }
      const records = payload.data.filter((country) => country && typeof country === "object" && !Array.isArray(country));
      if (payload.data.length > 0 && records.length > 0 && !records.some((country) => typeof country.name === "string")) {
        throw new Error("The country service response did not include country names.");
      }
      const normalizedNeedle = normalizedQuery.toLocaleLowerCase();
      const usableCountries = records.filter((country) =>
        country && typeof country.name === "string" && country.name.toLocaleLowerCase().includes(normalizedNeedle)
      );
      if (usableCountries.length === 0) {
        setStatus(`No countries matched “${normalizedQuery}”. Try another spelling.`);
        return;
      }
      usableCountries.slice(0, 12).forEach((country) => results.append(renderCountry(country)));
      const total = `${usableCountries.length} ${usableCountries.length === 1 ? "country" : "countries"} found.`;
      setStatus(usableCountries.length > 12 ? `${total} Showing the first 12 matches.` : total);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "An unexpected error occurred.";
      setStatus(`We couldn’t load country information. ${detail} Check your connection and try again.`, "error");
      retryButton.hidden = false;
    } finally {
      isLoading = false;
      searchButton.disabled = false;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    searchCountry(input.value);
  });
  retryButton.addEventListener("click", () => searchCountry(lastQuery));
}
