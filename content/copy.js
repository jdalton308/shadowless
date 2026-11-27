/*
  All site copy lives here. Components import from this file; none hard-code
  user-facing text. Repeated labels (CTAs, nav) are defined once and reused.

  Strings that need values are functions, e.g. copy.inventory.showing(3, 40).
*/

// TODO(owner): replace with the real handle and address before launch.
export const site = {
  name: 'Shadowless Card Co.',
  shortName: 'Shadowless',
  description:
    'Graded vintage Pokémon cards from 1996 to 2003. Find our table at card shows across Southern California.',
  tagline: 'Vintage Pokémon · 1996–2003',
  region: 'Southern California',
  instagramHandle: 'ShadowlessCardCo',
  email: 'Joe@ShadowlessCards.com',
};

export const links = {
  instagram: `https://instagram.com/${site.instagramHandle}`,
  instagramDm: `https://ig.me/m/${site.instagramHandle}`,
  email: `mailto:${site.email}`,
  organizerInstagram: (handle) => `https://instagram.com/${handle.replace(/^@/, '')}`,
  directions: (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
};

export const nav = {
  home: 'Home',
  inventory: 'Inventory',
  shows: 'Shows',
  instagram: 'Instagram',
  mainLabel: 'Main',
  footerLabel: 'Footer',
};

export const cta = {
  browseInventory: 'Browse inventory',
  seeShowDates: 'See show dates',
  seeFullCalendar: 'See the full calendar →',
  browseAll: (count) => `Browse all ${count} cards →`,
  viewAll: 'View all →',
  follow: 'Follow →',
  followOnInstagram: 'Follow on Instagram',
  dmOnInstagram: 'DM us on Instagram',
  dmToBuy: 'DM to buy on Instagram',
  email: `Email ${site.email}`,
  emailAboutCard: 'Email about this card',
  directions: 'Directions',
  addToCalendar: 'Add to calendar',
  organizerInstagram: (handle) => `@${handle.replace(/^@/, '')} on Instagram ↗`,
  seeUpcomingShows: 'See upcoming shows',
  clearAllFilters: 'Clear all filters',
  clearAll: 'Clear all',
  showCards: (count) => `Show ${count} ${count === 1 ? 'card' : 'cards'}`,
  backToInventory: '← Back to inventory',
  backToTop: 'Back to top ↑',
  filter: 'Filter',
  sort: 'Sort',
  close: 'Close',
  selectAll: 'Select all',
  clear: 'Clear',
  showAllSets: (count) => `Show all ${count} sets ▾`,
  showFewerSets: 'Show fewer sets ▴',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  backToMonth: (month) => `← Back to ${month}`,
  dmUs: 'DM us',
};

export const common = {
  updated: (date) => `Updated ${date}`,
  cardsCount: (n) => `${n} ${n === 1 ? 'card' : 'cards'}`,
  photoComing: 'Photo coming',
  sealed: 'Sealed',
  lookingForSomething: 'Looking for something specific?',
  keepAnEyeOut: "and we'll keep an eye out.",
};

export const home = {
  hero: {
    eyebrow: `Pre-2003 · ${site.region}`,
    titleLines: ['All Vintage Pokémon.'],
    body:
      'Graded Pokémon cards and sealed packs from 1996 to 2003, English and Japanese. Browse our inventory here and contact us with any questions, or come find us in person at card shows across Southern California (Or sometimes the US).',
  },
  shows: {
    eyebrow: 'Shows',
    title: 'Upcoming shows',
    empty: 'No shows posted yet. New dates are announced on Instagram first.',
  },
  inCase: {
    eyebrow: 'Updated Daily',
    title: 'Current Inventory',
    countLabel: 'cards available',
  },
  buying: {
    eyebrow: 'Buying',
    title: 'Selling vintage? We buy.',
    body: 'We buy graded cards and sealed vintage product. Send photos for an offer, or ask a question.',
    rows: [
      { label: 'Graded cards', detail: 'PSA · CGC · BGS · TAG' },
      { label: 'Sealed vintage', detail: 'Packs · Boxes · Decks' },
    ],
  },
  instagram: {
    title: 'Latest on Instagram',
    empty: 'New pickups, show recaps and what just sold.',
    postAlt: 'Instagram post',
  },
};

export const inventory = {
  eyebrow: 'Inventory',
  title: 'In the case today',
  body: 'Graded slabs and sealed vintage product. Everything listed here is in stock as of yesterday, though they move quickly so don\'t hesitate to contact us if you\'re interested in something specific. Or come find us at a show to see a card in person.',
  showing: (shown, total) => `Showing ${shown} of ${total}`,
  allShown: (n) => `All ${n} cards shown`,
  filtersTitle: 'Filters',
  filtersLabel: 'Filter cards',
  sortLabel: 'Sort cards',
  sortTitle: 'Sort by',
  sortGroups: [
    { label: 'Price', options: [['price-desc', 'Price: high to low'], ['price-asc', 'Price: low to high']] },
    { label: 'Date added', options: [['new-desc', 'Newest first'], ['new-asc', 'Oldest first']] },
    { label: 'Set', options: [['set-asc', 'Set: oldest release first'], ['set-desc', 'Set: newest release first']] },
    { label: 'Grade', options: [['grade-desc', 'Grade: high to low'], ['grade-asc', 'Grade: low to high']] },
  ],
  filters: {
    name: 'Card name',
    namePlaceholder: 'Search a Pokémon, e.g. Charizard',
    nameHelp: 'Matches any part of the card name.',
    price: 'Price',
    min: 'Min',
    max: 'Max',
    type: 'Type',
    typeHelp: 'Pick one or both. Neither picked shows everything.',
    types: { graded: 'Graded cards', sealed: 'Sealed product' },
    language: 'Language',
    languages: { all: 'All', english: 'English', japanese: 'Japanese' },
    grader: 'Grading company',
    grade: 'Grade',
    gradeHelp: 'Half grades included. Only applies to graded cards.',
    sets: 'Sets',
    setsSearch: 'Search sets',
    setGroups: { english: 'English', japanese: 'Japanese', sealed: 'Sealed' },
  },
  chips: {
    name: (q) => `“${q}”`,
    price: (min, max) => `$${min.toLocaleString('en-US')}–$${max.toLocaleString('en-US')}`,
    grade: (min, max) => `Grade ${min}–${max}`,
    removeLabel: (label) => `Remove filter ${label}`,
  },
  noMatch: {
    title: 'No cards match these filters',
    body: 'Try removing a filter. Here’s what each one would bring back:',
    remove: 'Remove',
    wouldShow: (n) => `→ ${n} ${n === 1 ? 'card' : 'cards'}`,
  },
  empty: {
    count: '0 cards listed',
    titleLines: ['The case is', 'restocking'],
    body: 'Everything listed has sold. New cards go up here after the next restock. Come by a show to see what’s on the table, or follow along for new arrivals.',
    nextShow: 'Next show',
  },
  detail: {
    item: (id) => `Item #${id}`,
    front: 'Front',
    back: 'Back',
    set: 'Set',
    grade: 'Grade',
    language: 'Language',
    notes: 'Notes',
    dmHelp: (id, name) => `Copies “Hi, I’d like item #${id}, ${name}” and opens a chat with @${site.instagramHandle}. Paste it to send.`,
    copied: 'Message copied. Paste it in the chat.',
    dmMessage: (id, name) => `Hi, I’d like item #${id}, ${name}.`,
    emailSubject: (id, name) => `Item #${id}: ${name}`,
    emailBody: (id, name, url) => `Hi, I’m interested in item #${id}, ${name}.\n\n${url}`,
    seeInPerson: 'See it in person',
    moreFrom: (set) => `More from ${set}`,
    notFound: 'This card has sold or is no longer listed.',
  },
};

export const shows = {
  eyebrow: `Shows · ${site.region}`,
  title: 'Find our table',
  body: 'Every show we’re set up at. We buy graded cards and sealed vintage product at each one.',
  weekdaysShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  weekdaysLong: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  legend: { show: 'Show', upcoming: 'Upcoming', past: 'Past', today: 'Today' },
  today: 'Today',
  upcomingThisMonth: 'Upcoming this month',
  allShowsIn: (month) => `All shows · ${month}`,
  tags: { next: 'Next', past: 'Past', days: (n) => `${n} days` },
  dayOf: (i, n) => `Day ${i} of ${n}`,
  allPast: 'No more shows this month. Pick a dimmed date to see past shows, or check next month →',
  noShows: {
    title: 'No shows posted yet',
    body: 'Dates go up as organizers confirm tables. New shows are announced on Instagram first.',
  },
  details: { hours: 'Hours', entry: 'Entry', parking: 'Parking', free: 'Free' },
  calendarDescription: (name) => `Shadowless Card Co. is set up at ${name}.`,
};

export const meta = {
  homeTitle: `${site.name} · Vintage Pokémon`,
  inventoryTitle: 'Inventory',
  showsTitle: 'Shows',
  notFoundTitle: 'Not found',
};

export const notFound = {
  title: 'Not here',
  body: 'That page doesn’t exist, or the card has sold.',
};
