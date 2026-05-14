import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  ExternalLink,
  Gamepad2,
  Mail,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sun,
  Trophy,
  Info,
  X
} from "lucide-react";
import { type ComponentType, type KeyboardEvent, type MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { aggregateHardware, type SortKey } from "./lib/aggregate";
import { getBrandForProduct, type BrandInfo } from "./lib/brands";
import { categories, getCategoryByRoute } from "./lib/categories";
import { getCountryDisplay } from "./lib/countries";
import { cs2TeamRankingSnapshot } from "./lib/teamRankings";
import { getNextTheme, resolveInitialTheme, themeStorageKey, type ThemeMode } from "./lib/theme";
import type { GameSnapshot, HardwareSlot, RankingMode } from "./types";

const siteName = "Esport Pro Stuff";
const siteOrigin = "https://hadriang.github.io";
const contactEmail = "hmmm.vid@gmail.com";
const proSettingsListsUrl = "https://prosettings.net/lists/";
const amazonAssociateTag = "esportprostuf-20";
const amazonSearchBaseUrl = "https://www.amazon.com/s";
const amazonAssociateDisclosure = "As an Amazon Associate I earn from qualifying purchases.";
const rightsHolderDisclosure =
  `If you represent a rights holder and want a logo, name, or reference reviewed, contact ${contactEmail}.`;
const referralDisclosure =
  "Product links are Amazon.com referral links. If you buy through them, I may earn a small commission from any sale through that link at no extra cost to you. Thanks for supporting the site ❤️";
const sourceDisclosure =
  "Stats are parsed from public ProSettings.net list pages and data snapshots; they may lag source updates or include source inaccuracies.";
const independenceDisclosure =
  "Esport Pro Stuff is independent and is not affiliated with ProSettings.net, Amazon, game publishers, teams, or listed hardware brands.";
const appBasePath = normalizeBasePath(import.meta.env.BASE_URL);

interface GameNavItem {
  slug: string;
  name: string;
  shortName: string;
  status: string;
  available: boolean;
  icon?: ComponentType<{ size?: number; strokeWidth?: number }>;
  imageSrc?: string;
  maskSrc?: string;
}

type LegalPageSlug = "privacy" | "terms" | "disclosure";

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageContent {
  slug: LegalPageSlug;
  title: string;
  eyebrow: string;
  lede: string;
  updated: string;
  sections: LegalSection[];
}

const games: GameNavItem[] = [
  { slug: "cs2", name: "CS2", shortName: "CS2", status: "Ready", available: true, imageSrc: "game-icons/cs2.png" },
  { slug: "valorant", name: "VALORANT", shortName: "VAL", status: "Ready", available: true, imageSrc: "game-icons/valorant.png" },
  { slug: "apex-legends", name: "Apex Legends", shortName: "Apex", status: "Ready", available: true, maskSrc: "game-icons/apex-legends.svg" },
  { slug: "fortnite", name: "Fortnite", shortName: "FN", status: "Ready", available: true, maskSrc: "game-icons/fortnite.svg" }
];

const legalPages: Record<LegalPageSlug, LegalPageContent> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Site policy",
    lede: "A plain-English summary of what this site stores, what third parties may receive, and how to reach me.",
    updated: "May 14, 2026",
    sections: [
      {
        heading: "Information I Collect",
        body: [
          "Esport Pro Stuff does not have user accounts, comments, checkout, or a contact form. If you email me, I use your email address and message only to reply.",
          "The site stores your theme preference in your browser using localStorage so dark or light mode can persist between visits."
        ]
      },
      {
        heading: "Third-Party Services",
        body: [
          "Orbitron font files are served from this site. No Google Fonts request is made by the live site.",
          "When you click an Amazon link, you leave Esport Pro Stuff and Amazon may receive information about that visit under its own policies.",
          "Your hosting provider may process routine technical logs such as IP address, user agent, requested URL, and time of request to keep the site reliable and secure."
        ]
      },
      {
        heading: "Cookies And Tracking",
        body: [
          "I do not run analytics, advertising pixels, or non-essential tracking cookies on Esport Pro Stuff.",
          "If I add analytics or advertising tools later, I will update this policy before those tools go live."
        ]
      },
      {
        heading: "Contact",
        body: [
          `For privacy questions or deletion requests related to emails you sent me, contact ${contactEmail}.`
        ]
      }
    ]
  },
  terms: {
    slug: "terms",
    title: "Terms of Use",
    eyebrow: "Site terms",
    lede: "The short version: use the site respectfully, verify anything important at the source, and understand that product links leave this site.",
    updated: "May 14, 2026",
    sections: [
      {
        heading: "Use Of The Site",
        body: [
          "You may use Esport Pro Stuff for personal research, comparison, and reference. Do not scrape, overload, reverse engineer, or interfere with the site or its data endpoints."
        ]
      },
      {
        heading: "Accuracy",
        body: [
          "Gear stats are parsed from public source pages and may be delayed, incomplete, grouped differently, or affected by source inaccuracies.",
          "Always verify important buying decisions with the player, team, manufacturer, retailer, or original source."
        ]
      },
      {
        heading: "External Links",
        body: [
          "Links to ProSettings.net, Amazon, manufacturers, or other third-party sites are provided for convenience. Those sites are controlled by their own owners and policies."
        ]
      },
      {
        heading: "No Warranty",
        body: [
          "The site is provided as-is, without warranties of availability, accuracy, fitness for a particular purpose, or uninterrupted operation."
        ]
      },
      {
        heading: "Changes",
        body: [
          "These terms may be updated as the site evolves. Continued use of the site after changes means you accept the updated terms."
        ]
      }
    ]
  },
  disclosure: {
    slug: "disclosure",
    title: "Disclosure And Sources",
    eyebrow: "Transparency",
    lede: "How the site gets its data, how affiliate links work, and what belongs to third parties.",
    updated: "May 14, 2026",
    sections: [
      {
        heading: "Affiliate Links",
        body: [
          referralDisclosure,
          amazonAssociateDisclosure
        ]
      },
      {
        heading: "Data Sources",
        body: [
          sourceDisclosure,
          "The site does not copy source product images or source affiliate links."
        ]
      },
      {
        heading: "Independence",
        body: [
          independenceDisclosure,
          "Game names, product names, team names, player names, brand names, and logos are used only for identification.",
          rightsHolderDisclosure
        ]
      },
      {
        heading: "Font Licenses",
        body: [
          "Orbitron is self-hosted on this site and is available under the SIL Open Font License 1.1.",
          "The base UI stack uses Inter only as a local/system fallback. Inter is a free and open source typeface released under the SIL Open Font License 1.1."
        ]
      }
    ]
  }
};

type SnapshotMap = Partial<Record<string, GameSnapshot>>;

const snapshotUrls: Record<string, string> = {
  "apex-legends": "data/apex-legends.json",
  cs2: "data/cs2.json",
  fortnite: "data/fortnite.json",
  valorant: "data/valorant.json"
};

const snapshotCache = new Map<string, Promise<GameSnapshot>>();

function normalizeBasePath(value: string): string {
  if (!value || value === "./") {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function stripBasePath(pathname: string): string {
  if (appBasePath === "/" || !pathname.startsWith(appBasePath)) {
    return pathname;
  }

  return `/${pathname.slice(appBasePath.length)}`;
}

function toAppPath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (appBasePath === "/") {
    return normalizedPath;
  }

  return `${appBasePath.slice(0, -1)}${normalizedPath}`;
}

function publicAssetUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${appBasePath}${normalizedPath}`;
}

function readInitialRoute(): { gameSlug?: string; hardwareRoute?: string } {
  const params = new URLSearchParams(window.location.search);
  const restoredRoute = params.get("gh_route");

  if (restoredRoute) {
    const nextPath = restoredRoute.startsWith("/") ? restoredRoute : `/${restoredRoute}`;
    window.history.replaceState({}, "", toAppPath(nextPath));
    return parseRoute(window.location.pathname);
  }

  return parseRoute(window.location.pathname);
}

function parseRoute(pathname: string): { gameSlug?: string; hardwareRoute?: string } {
  const routePath = stripBasePath(pathname);
  const [gameSlug, hardwareRoute] = routePath.split("/").filter(Boolean);
  return { gameSlug, hardwareRoute };
}

function navigate(path: string): void {
  window.history.pushState({}, "", toAppPath(path));
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function handleInternalLink(event: MouseEvent<HTMLAnchorElement>, path: string): void {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  navigate(path);
}

export default function App() {
  const [route, setRoute] = useState(() => readInitialRoute());
  const [theme, setTheme] = useState<ThemeMode>(() => resolveInitialTheme(readStoredTheme(), systemPrefersDark()));
  const [snapshots, setSnapshots] = useState<SnapshotMap>({});
  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  const legalPage = getLegalPage(route.gameSlug);
  const isStatsRoute = Boolean(!legalPage && route.gameSlug && snapshotUrls[route.gameSlug]);
  const snapshot = route.gameSlug && isStatsRoute ? snapshots[route.gameSlug] : undefined;
  const activeCategory = isStatsRoute ? getCategoryByRoute(route.hardwareRoute) : undefined;
  const activeGameName = snapshot?.metadata.gameName ?? games.find((game) => game.slug === route.gameSlug)?.name;

  const setLoadedSnapshot = useCallback((slug: string, loadedSnapshot: GameSnapshot) => {
    setSnapshots((currentSnapshots) => {
      if (currentSnapshots[slug] === loadedSnapshot) {
        return currentSnapshots;
      }

      return {
        ...currentSnapshots,
        [slug]: loadedSnapshot
      };
    });
  }, []);

  useEffect(() => {
    const handlePop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const slug = route.gameSlug;
    if (!slug || !snapshotUrls[slug] || snapshots[slug]) {
      return;
    }

    let cancelled = false;
    setSnapshotError(null);

    loadSnapshot(slug)
      .then((loadedSnapshot) => {
        if (!cancelled) {
          setLoadedSnapshot(slug, loadedSnapshot);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setSnapshotError(getErrorMessage(error));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [route.gameSlug, setLoadedSnapshot, snapshots]);

  useEffect(() => {
    document.title = legalPage
      ? `${legalPage.title} | ${siteName}`
      : isStatsRoute && activeCategory && activeGameName
      ? `${activeGameName} ${activeCategory.label} Usage | ${siteName}`
      : `${siteName} | Pro Player Gear Stats`;
  }, [activeCategory, activeGameName, isStatsRoute, legalPage]);

  useEffect(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = `${siteOrigin}${window.location.pathname}`;
    }
  }, [route]);

  function toggleTheme(): void {
    const nextTheme = getNextTheme(theme);
    setTheme(nextTheme);
    writeStoredTheme(nextTheme);
  }

  return (
    <main className={`app-shell ${isStatsRoute ? "stats-shell" : "home-shell"}`}>
      <GlobalTopbar
        activeGameSlug={isStatsRoute ? route.gameSlug : undefined}
        activeHardwareRoute={activeCategory?.route}
      />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {legalPage ? (
        <LegalPage page={legalPage} />
      ) : isStatsRoute && activeCategory ? (
        snapshot ? (
          <HardwarePage snapshot={snapshot} activeSlot={activeCategory.slot} />
        ) : snapshotError ? (
          <DataState title="Data failed to load" message={snapshotError} />
        ) : (
          <DataState title={`Loading ${activeGameName ?? "game"} ${activeCategory.label}`} message="Fetching the latest local data snapshot." />
        )
      ) : (
        <GamePicker snapshots={snapshots} onSnapshotLoaded={setLoadedSnapshot} />
      )}
      <AppFooter snapshot={snapshot} />
    </main>
  );
}

function getLegalPage(slug?: string): LegalPageContent | undefined {
  if (!slug || !(slug in legalPages)) {
    return undefined;
  }

  return legalPages[slug as LegalPageSlug];
}

async function loadSnapshot(slug: string): Promise<GameSnapshot> {
  const url = snapshotUrls[slug];
  if (!url) {
    throw new Error(`Unknown game data: ${slug}`);
  }

  const cachedSnapshot = snapshotCache.get(slug);
  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  const request = fetch(publicAssetUrl(url))
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${url}: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as GameSnapshot;
    })
    .catch((error) => {
      snapshotCache.delete(slug);
      throw error;
    });

  snapshotCache.set(slug, request);
  return request;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The data snapshot could not be loaded.";
}

function GlobalTopbar({
  activeGameSlug,
  activeHardwareRoute
}: {
  activeGameSlug?: string;
  activeHardwareRoute?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCategory = getCategoryByRoute(activeHardwareRoute);
  const targetGame = activeGameSlug ?? "cs2";

  function go(path: string): void {
    navigate(path);
    setMenuOpen(false);
  }

  return (
    <header className="global-topbar">
      <div className="topbar-left">
        <button className="brand-lockup" type="button" onClick={() => go("/")}>
          <span>{siteName}</span>
        </button>
        <nav className="game-nav desktop-nav" aria-label="Games">
          {games.map((game) => (
            <GameButton
              key={game.slug}
              game={game}
              active={game.slug === activeGameSlug}
              onClick={() => go(`/${game.slug}/${activeHardwareRoute ?? "mouse"}`)}
            />
          ))}
        </nav>
      </div>

      <nav className="hardware-nav desktop-nav" aria-label="Hardware categories">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeGameSlug ? category.route === activeHardwareRoute : false;
          return (
            <button
              key={category.slot}
              className={isActive ? "is-active" : ""}
              type="button"
              onClick={() => go(`/${targetGame}/${category.route}`)}
            >
              <Icon size={16} />
              <span>{category.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-panel"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
        <span>Menu</span>
      </button>

      {menuOpen ? (
        <div className="mobile-nav-panel" id="mobile-nav-panel">
          <section>
            <h2>Games</h2>
            <div className="mobile-nav-grid">
              {games.map((game) => (
                <GameButton
                  key={game.slug}
                  game={game}
                  active={game.slug === activeGameSlug}
                  onClick={() => go(`/${game.slug}/${activeHardwareRoute ?? "mouse"}`)}
                />
              ))}
            </div>
          </section>
          <section>
            <h2>Hardware</h2>
            <div className="mobile-nav-grid">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeGameSlug ? category.route === activeHardwareRoute : false;
                return (
                  <button
                    key={category.slot}
                    className={`mobile-nav-button ${isActive ? "is-active" : ""}`}
                    type="button"
                    onClick={() => go(`/${targetGame}/${category.route}`)}
                  >
                    <Icon size={16} />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </header>
  );
}

function GameButton({ game, active, onClick }: { game: GameNavItem; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`game-pill ${active ? "is-active" : ""}`}
      type="button"
      disabled={!game.available}
      title={game.available ? game.name : `${game.name} (${game.status})`}
      onClick={onClick}
    >
      <GameIcon game={game} size={17} />
      <span>{game.shortName}</span>
    </button>
  );
}

function GameIcon({ game, size }: { game: GameNavItem; size: number }) {
  if (game.maskSrc) {
    return (
      <span
        className="game-icon-mask"
        style={{ "--game-icon-src": `url("${publicAssetUrl(game.maskSrc)}")`, "--game-icon-size": `${size}px` } as React.CSSProperties}
        aria-hidden="true"
      />
    );
  }

  if (game.imageSrc) {
    return <img className="game-icon" src={publicAssetUrl(game.imageSrc)} alt="" width={size} height={size} aria-hidden="true" />;
  }

  const Icon = game.icon ?? Gamepad2;
  return <Icon size={size} />;
}

function ThemeToggle({ theme, onToggle }: { theme: ThemeMode; onToggle: () => void }) {
  const nextTheme = getNextTheme(theme);
  return (
    <button className="theme-toggle" type="button" aria-label={`Switch to ${nextTheme} mode`} onClick={onToggle}>
      {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}

function StatusStrip({ snapshot }: { snapshot: GameSnapshot }) {
  const isCs2 = snapshot.metadata.gameSlug === "cs2";

  return (
    <section className="status-strip" aria-label="Snapshot status">
      <span>
        <Clock3 size={15} />
        Updated {formatDate(snapshot.metadata.scrapedAt)}
      </span>
      <a href={snapshot.metadata.sourceUrl} target="_blank" rel="noopener noreferrer">
        <ExternalLink size={15} />
        ProSettings source
      </a>
      {isCs2 ? (
        <a href={cs2TeamRankingSnapshot.sourceUrl} target="_blank" rel="noopener noreferrer">
          <Trophy size={15} />
          Player order: {cs2TeamRankingSnapshot.label}
        </a>
      ) : (
        <span>
          <Trophy size={15} />
          Player order: source list
        </span>
      )}
    </section>
  );
}

function GamePicker({
  snapshots,
  onSnapshotLoaded
}: {
  snapshots: SnapshotMap;
  onSnapshotLoaded: (slug: string, loadedSnapshot: GameSnapshot) => void;
}) {
  const [homeError, setHomeError] = useState<string | null>(null);
  const availableGames = useMemo(() => games.filter((game) => game.available), []);
  const allSnapshots = availableGames
    .map((game) => snapshots[game.slug])
    .filter((snapshot): snapshot is GameSnapshot => Boolean(snapshot));
  const totalRows = allSnapshots.reduce((total, snapshot) => total + snapshot.metadata.rowCount, 0);
  const latestSnapshot = allSnapshots.reduce<GameSnapshot | undefined>((latest, snapshot) => {
    if (!latest) {
      return snapshot;
    }

    return new Date(snapshot.metadata.scrapedAt) > new Date(latest.metadata.scrapedAt) ? snapshot : latest;
  }, undefined);
  const categoryCoverage = categories.map((category) => ({
    ...category,
    known: allSnapshots.reduce(
      (total, snapshot) => total + snapshot.players.filter((player) => Boolean(player.gear[category.slot]?.name)).length,
      0
    )
  }));

  useEffect(() => {
    const missingGames = availableGames.filter((game) => snapshotUrls[game.slug] && !snapshots[game.slug]);
    if (missingGames.length === 0) {
      return;
    }

    let cancelled = false;
    setHomeError(null);

    Promise.all(
      missingGames.map((game) =>
        loadSnapshot(game.slug).then((loadedSnapshot) => {
          if (!cancelled) {
            onSnapshotLoaded(game.slug, loadedSnapshot);
          }
        })
      )
    ).catch((error) => {
      if (!cancelled) {
        setHomeError(getErrorMessage(error));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [availableGames, onSnapshotLoaded, snapshots]);

  return (
    <>
      <section className="home-hero">
        <div>
          <p className="eyebrow">Pro gear database</p>
          <h1>{siteName}</h1>
          <p className="lede">
            Compare pro player gear choices across CS2, VALORANT, Apex Legends, and Fortnite.
          </p>
        </div>
        <div className="snapshot-strip">
          <Metric label="Players" value={allSnapshots.length === 0 ? "Loading" : totalRows.toLocaleString()} hint="Total player rows across all current data snapshots." />
          <Metric label="Gear Types" value={categories.length.toString()} hint="Hardware categories tracked across the site." />
          <Metric label="Updated" value={latestSnapshot ? formatDate(latestSnapshot.metadata.scrapedAt) : "Loading"} hint="Most recent data snapshot date." />
        </div>
      </section>

      <section className="game-grid" aria-label="Game picker">
        {games.map((game) => {
          return (
            <button
              key={game.slug}
              className={`game-tile ${game.available ? "is-ready" : "is-disabled"}`}
              type="button"
              disabled={!game.available}
              onClick={() => navigate(`/${game.slug}/mouse`)}
            >
              <span>
                <span className="game-name">
                  <GameIcon game={game} size={18} />
                  {game.name}
                </span>
                <span className="game-meta">{getGameStatus(game, snapshots)}</span>
              </span>
              {game.available ? <ChevronRight size={18} /> : <Clock3 size={16} />}
            </button>
          );
        })}
      </section>

      {homeError ? <DataState title="Some data could not load" message={homeError} /> : null}

      <section className="coverage-band" aria-label="Snapshot coverage by hardware category">
        <div className="section-title">
          <h2>Gear Coverage</h2>
          <span>
            {allSnapshots.length === availableGames.length
              ? `${availableGames.length} games`
              : `${allSnapshots.length}/${availableGames.length} loaded`}
          </span>
        </div>
        <div className="coverage-list">
          {categoryCoverage.map((category) => {
            const Icon = category.icon;
            const percent = totalRows === 0 ? 0 : (category.known / totalRows) * 100;
            return (
              <button
                key={category.slot}
                className="coverage-row"
                type="button"
                onClick={() => navigate(`/cs2/${category.route}`)}
              >
                <span className="coverage-label">
                  <Icon size={18} />
                  {category.label}
                </span>
                <span className="coverage-bar" aria-hidden="true">
                  <span style={{ width: `${percent}%` }} />
                </span>
                <span className="coverage-count">{category.known.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function getGameStatus(game: GameNavItem, snapshots: SnapshotMap): string {
  const snapshot = snapshots[game.slug];
  return snapshot ? `${snapshot.metadata.rowCount.toLocaleString()} rows` : "Loading data";
}

function DataState({ title, message }: { title: string; message: string }) {
  return (
    <section className="data-state" role="status">
      <BarChart3 size={22} />
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </section>
  );
}

function LegalPage({ page }: { page: LegalPageContent }) {
  return (
    <section className="legal-page" aria-labelledby={`${page.slug}-title`}>
      <div className="legal-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 id={`${page.slug}-title`}>{page.title}</h1>
        <p className="lede">{page.lede}</p>
        <span>Last updated {page.updated}</span>
      </div>

      <div className="legal-sections">
        {page.sections.map((section) => (
          <section key={section.heading} className="legal-section">
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}

function HardwarePage({ snapshot, activeSlot }: { snapshot: GameSnapshot; activeSlot: HardwareSlot }) {
  const [mode, setMode] = useState<RankingMode>("grouped");
  const [sort, setSort] = useState<SortKey>("count");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const activeCategory = getCategoryByRoute(categories.find((category) => category.slot === activeSlot)?.route);

  useEffect(() => {
    setExpanded(null);
    setSearch("");
  }, [activeSlot]);

  const aggregation = useMemo(
    () => aggregateHardware(snapshot, activeSlot, mode, search, sort),
    [activeSlot, mode, search, snapshot, sort]
  );

  return (
    <>
      <section className="stats-header">
        <div>
          <h1>{activeCategory.label} Usage</h1>
          <p className="lede">
            {aggregation.summary.knownPlayers.toLocaleString()} known entries from{" "}
            {snapshot.metadata.rowCount.toLocaleString()} listed players.
          </p>
          <StatusStrip snapshot={snapshot} />
        </div>
        <div className="snapshot-strip compact">
          <Metric label="Known" value={aggregation.summary.knownPlayers.toLocaleString()} hint="Players with a listed item for this hardware category." />
          <Metric label="Unique" value={aggregation.summary.uniqueProducts.toLocaleString()} hint="Different products after the current product display is applied." />
          <Metric label="Missing" value={aggregation.summary.unknownPlayers.toLocaleString()} hint="Players without a listed item for this hardware category." />
        </div>
      </section>

      <section className="control-row" aria-label="Ranking controls">
        <label className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${activeCategory.label.toLowerCase()}, players, teams`}
          />
        </label>
        <div className="control-group">
          <span className="control-label">Models</span>
          <div className="segmented" aria-label="Product display">
            <button
              className={mode === "grouped" ? "is-active" : ""}
              type="button"
              title="Combine colorways and close variants into one product family."
              onClick={() => setMode("grouped")}
            >
              Grouped
            </button>
            <button
              className={mode === "exact" ? "is-active" : ""}
              type="button"
              title="Show every listed product name exactly as it appears in the source."
              onClick={() => setMode("exact")}
            >
              Exact
            </button>
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">Sort</span>
          <div className="segmented" aria-label="Sort rankings">
            <button className={sort === "count" ? "is-active" : ""} type="button" onClick={() => setSort("count")}>
              Popularity
            </button>
            <button className={sort === "name" ? "is-active" : ""} type="button" onClick={() => setSort("name")}>
              A to Z
            </button>
          </div>
        </div>
      </section>

      <section className="rank-table" aria-label={`${activeCategory.label} rankings`}>
        <div className="table-head">
          <span>Rank</span>
          <span>Brand</span>
          <span>Product</span>
          <span className="price-head">Check Price</span>
          <span>Usage</span>
          <span>Share</span>
          <span>Players</span>
        </div>

        {aggregation.rankings.map((ranking) => {
          const isExpanded = expanded === ranking.name;
          const tooltipId = `amazon-referral-${ranking.rank}`;
          const playerTableId = `players-${snapshot.metadata.gameSlug}-${activeSlot}-${ranking.rank}`;
          const toggleExpanded = () => setExpanded(isExpanded ? null : ranking.name);
          const handleSummaryClick = (event: MouseEvent<HTMLDivElement>) => {
            if (event.target instanceof Element && event.target.closest("a")) {
              return;
            }

            toggleExpanded();
          };
          const handleSummaryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) {
              return;
            }

            event.preventDefault();
            toggleExpanded();
          };

          return (
            <article className="ranking-row" key={ranking.name}>
              <div
                className="ranking-summary"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-controls={playerTableId}
                onClick={handleSummaryClick}
                onKeyDown={handleSummaryKeyDown}
              >
                <span className="rank-number">#{ranking.rank}</span>
                <span className="brand-cell">
                  <BrandMark brand={getBrandForProduct(ranking.name)} />
                </span>
                <span className="product-name">
                  {ranking.name}
                  {mode === "grouped" && ranking.exactNames.length > 1 ? (
                    <small>{ranking.exactNames.slice(0, 3).join(", ")}</small>
                  ) : null}
                </span>
                <a
                  className="amazon-link"
                  href={getAmazonReferralUrl(ranking.name)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Check price for ${ranking.name}`}
                  aria-describedby={tooltipId}
                >
                  <ShoppingCart size={15} />
                  <span className="amazon-tooltip" id={tooltipId} role="tooltip">
                    {referralDisclosure}
                  </span>
                </a>
                <span className="usage-count">{ranking.count.toLocaleString()}</span>
                <span className="share-cell">
                  <span className="share-bar" aria-hidden="true">
                    <span style={{ width: `${ranking.percent}%` }} />
                  </span>
                  {formatPercent(ranking.percent)}
                </span>
                <span
                  className="player-preview expand-toggle"
                >
                  {ranking.players.slice(0, 3).map((usage) => usage.player.player).join(", ")}
                  {ranking.players.length > 3 ? ` +${ranking.players.length - 3}` : ""}
                  <ChevronDown className={isExpanded ? "rotated" : ""} size={16} />
                </span>
              </div>

              {isExpanded ? (
                <div className="player-table" id={playerTableId}>
                  <div className="player-table-head" style={{ "--context-columns": activeCategory.contextColumns.length } as React.CSSProperties}>
                    <span>Player</span>
                    {activeCategory.contextColumns.map((column) => (
                      <span key={column.label}>{column.label}</span>
                    ))}
                  </div>
                  {ranking.players.map((usage) => (
                    <div
                      className="player-row"
                      key={`${usage.player.id}-${usage.exactName}`}
                      style={{ "--context-columns": activeCategory.contextColumns.length } as React.CSSProperties}
                    >
                      <PlayerName player={usage.player.player} country={usage.player.country} />
                      {activeCategory.contextColumns.map((column) => (
                        <span key={column.label}>{column.getValue(usage.player) || "-"}</span>
                      ))}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}

        {aggregation.rankings.length === 0 ? (
          <div className="empty-state">
            <BarChart3 size={22} />
            No matching hardware entries.
          </div>
        ) : null}
      </section>
    </>
  );
}

function AppFooter({ snapshot }: { snapshot?: GameSnapshot }) {
  return (
    <footer className="app-footer" aria-label="Site information">
      <div className="footer-topline">
        <div className="footer-title-group">
          <a className="footer-brand" href={toAppPath("/")} onClick={(event) => handleInternalLink(event, "/")}>
            {siteName}
          </a>
          <p>Stats about most popular hardware amongst pro players</p>
        </div>

        <nav className="footer-links" aria-label="Footer links">
          <a href={`mailto:${contactEmail}`}>
            <Mail size={15} />
            {contactEmail}
          </a>
          {snapshot ? (
            <a href={snapshot.metadata.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={15} />
              Source
            </a>
          ) : (
            <a href={proSettingsListsUrl} target="_blank" rel="noopener noreferrer">
              <Database size={15} />
              ProSettings data
            </a>
          )}
          <a href={toAppPath("/privacy")} onClick={(event) => handleInternalLink(event, "/privacy")}>Privacy</a>
          <a href={toAppPath("/terms")} onClick={(event) => handleInternalLink(event, "/terms")}>Terms</a>
          <a href={toAppPath("/disclosure")} onClick={(event) => handleInternalLink(event, "/disclosure")}>Disclosure</a>
        </nav>
      </div>

      <div className="footer-fineprint" role="table" aria-label="Disclosure notes">
        <span>{amazonAssociateDisclosure}</span>
        <span>{referralDisclosure}</span>
        <span>{sourceDisclosure}</span>
        <span>{independenceDisclosure}</span>
        <span>{rightsHolderDisclosure}</span>
      </div>
    </footer>
  );
}

function getAmazonReferralUrl(productName: string): string {
  const url = new URL(amazonSearchBaseUrl);
  url.searchParams.set("k", productName);
  url.searchParams.set("tag", amazonAssociateTag);
  return url.toString();
}

function BrandMark({ brand }: { brand: BrandInfo }) {
  return (
    <span className={`brand-mark ${brand.logoSrc ? "has-logo" : "is-fallback"}`} title={brand.name} aria-label={brand.name}>
      {brand.logoSrc ? (
        <span
          className="brand-logo-mask"
          style={{ "--brand-logo-src": `url("${publicAssetUrl(brand.logoSrc)}")` } as React.CSSProperties}
          aria-hidden="true"
        />
      ) : (
        <span>{brand.initials}</span>
      )}
    </span>
  );
}

function PlayerName({ player, country }: { player: string; country?: string }) {
  const countryDisplay = getCountryDisplay(country);

  return (
    <span className="player-name">
      {countryDisplay ? (
        <span
          className={`country-flag ${countryDisplay.code ? "" : "is-fallback"}`}
          title={countryDisplay.label}
          aria-label={countryDisplay.label}
        >
          {countryDisplay.flag}
        </span>
      ) : null}
      {player}
    </span>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="metric">
      <span className="metric-label">
        {label}
        {hint ? (
          <span className="metric-info" title={hint} aria-label={hint}>
            <Info size={12} />
          </span>
        ) : null}
      </span>
      <strong>{value}</strong>
    </div>
  );
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getFullYear() === 1970) {
    return "Not scraped";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatPercent(value: number): string {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

function readStoredTheme(): string | null {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
}

function writeStoredTheme(theme: ThemeMode): void {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme still applies for this session if storage is unavailable.
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
}
