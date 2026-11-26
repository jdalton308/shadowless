/*
  Local-development data, used only when Google credentials are not set and
  NODE_ENV is not production (or USE_SAMPLE_DATA=1). Rows mirror the shape of
  the Price List and Shows tabs in Books. Never shipped to the live site:
  lib/books.js throws in production when credentials are missing.
*/

export const sampleItems = [
  { id: 789, name: 'Golem #148 Crystal', set: 'Skyridge (2003)', section: 'English Slabs', grader: 'Beckett', grade: 9.5, price: 8000, dateAdded: '10/17/2026' },
  { id: 831, name: 'Shining Mewtwo #109 1st Edition', set: 'Neo Discovery (2001)', section: 'English Slabs', grader: 'CGC', grade: 9, price: 6500, dateAdded: '10/20/2026' },
  { id: 747, name: 'Crobat #147 Crystal', set: 'Skyridge (2003)', section: 'English Slabs', grader: 'Beckett', grade: 9.5, price: 5200, dateAdded: '10/12/2026' },
  { id: 751, name: 'Crobat #147 Crystal', set: 'Skyridge (2003)', section: 'English Slabs', grader: 'Beckett', grade: 8.5, price: 3700, dateAdded: '10/12/2026' },
  { id: 748, name: 'Shining Celebi #106 1st Edition', set: 'Neo Destiny (2002)', section: 'English Slabs', grader: 'Beckett', grade: 8.5, price: 3200, dateAdded: '10/12/2026' },
  { id: 726, name: 'Shining Noctowl #110 1st Edition', set: 'Neo Destiny (2002)', section: 'English Slabs', grader: 'Beckett', grade: 9, price: 3000, dateAdded: '10/12/2026' },
  { id: 673, name: 'Shining Magikarp #66 1st Ed', set: 'Neo Revelation (2001)', section: 'English Slabs', grader: 'CGC', grade: 8.5, price: 2800, dateAdded: '10/05/2026' },
  { id: 787, name: 'Ninetales #17 Rev Holo', set: 'Legendary Collection (2002)', section: 'English Slabs', grader: 'CGC', grade: 9, price: 1800, dateAdded: '10/17/2026' },
  { id: 838, name: 'Haunter #46 Rev Holo', set: 'Legendary Collection (2002)', section: 'English Slabs', grader: 'PSA', grade: 8, price: 1500, dateAdded: '10/21/2026' },
  { id: 840, name: 'Alakazam #1 Rev Holo', set: 'Legendary Collection (2002)', section: 'English Slabs', grader: 'PSA', grade: 7, price: 1400, dateAdded: '10/21/2026' },
  { id: 74, name: 'Gym Challenge Booster Pack - 1st Edition', set: 'Sealed Product', section: 'Sealed Products', price: 850, notes: 'Light', dateAdded: '08/17/2026' },
  { id: 230, name: 'Base Set Booster Pack - 4th Print (99-00) Unlimited', set: 'Sealed Product', section: 'Sealed Products', price: 700, notes: 'Light. Charizard art', dateAdded: '08/30/2026' },
  { id: 372, name: "Lt. Surge's Raichu #11", set: 'Gym Challenge (2000)', section: 'English Slabs', grader: 'CGC', grade: 10, price: 600, dateAdded: '09/12/2026' },
  { id: 434, name: 'Gengar #5 1st Ed.', set: 'Fossil (1999)', section: 'English Slabs', grader: 'CGC', grade: 5.5, price: 500, dateAdded: '09/24/2026' },
  { id: 801, name: 'Feraligatr #150 Neo Promo', set: 'JP Neo 1 - Gold, Silver, to a New World (2000)', section: 'Japanese Slabs', grader: 'Beckett', grade: 9.5, price: 250, dateAdded: '10/18/2026' },
  { id: 842, name: 'Nidoking #34 Corocoro', set: 'Promo - Japanese Promo (vintage)', section: 'Japanese Slabs', grader: 'PSA', grade: 6, price: 240, dateAdded: '10/21/2026' },
  { id: 841, name: 'Ponyta', set: 'JP Vending Series (1998)', section: 'Japanese Slabs', grader: 'Beckett', grade: 9.5, price: 220, dateAdded: '10/21/2026' },
  { id: 525, name: 'Grimer (banned)', set: 'JP Rocket Gang (1997)', section: 'Japanese Slabs', grader: 'CGC', grade: 9, price: 180, dateAdded: '09/24/2026' },
  { id: 792, name: "Rocket's Scyther #123", set: "JP Leaders' Stadium (1998)", section: 'Japanese Slabs', grader: 'CGC', grade: 9.5, price: 140, dateAdded: '10/18/2026' },
  { id: 194, name: 'Squirtle #63 1st Edition', set: 'Base Set (1999)', section: 'English Slabs', grader: 'CGC', grade: 7.5, price: 100, dateAdded: '08/29/2026' },
];

const SHOW_HEADERS = ['Start Date', 'End Date', 'Show Name', 'Venue', 'Address', 'City', 'Hours', 'Organizer Instagram', 'Entry', 'Parking', 'Notes'];

export const sampleShows = [
  SHOW_HEADERS,
  ['11/18/2026', '', 'Diamond 9', 'Diamond 9 Sports', '1850 N Placentia Ave', 'Placentia', '3pm–9pm', 'Diamond_9_Sports', 'Free', 'Free', ''],
  ['11/19/2026', '', 'Coastline Exchange', 'Charleston Ballroom', '', 'Fullerton', '4pm–9:30pm', 'CoastlineExchange', 10, 'Free', ''],
  ['11/20/2026', '', 'OC Card Show TCG Night', 'Brookhurst Community Center', '', 'Anaheim', '5pm–10pm', 'OCCardShow', 5, 'Free', ''],
  ['11/21/2026', '11/22/2026', 'San Diego TCG Con', 'Parkway Plaza', '', 'El Cajon', '10am–7pm / 11am–4pm', 'CardsAndMoreTour', 10, 'Free', ''],
  ['11/27/2026', '', 'LA Card Fest', 'Sheraton Hotel', '303 E Valley Blvd', 'San Gabriel', '4pm–10pm', 'LACardFest_', 15, 10, 'Hotel garage, validate at the door'],
  ['11/28/2026', '11/29/2026', 'OC Card Show', 'OC Fair & Event Center', '88 Fair Dr', 'Costa Mesa', '10am–5pm', 'OCCardShow', 10, 12, 'Kids under 12 free'],
  ['12/05/2026', '', 'Sample December show', 'Sample venue', '', 'Anaheim', '10am–4pm', 'OCCardShow', 'Free', 'Free', 'Sample row for local development'],
];
