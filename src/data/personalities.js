// ─────────────────────────────────────────────────────────────
// LEGACY — single source of truth for every legend on the site.
//
// To add a new person: copy one object below and fill it in.
//
// PHOTOS: drop a picture into /public/portraits/ named after the
// person's slug — e.g. marie-curie.jpg (jpg, jpeg, png or webp all
// work). It is picked up automatically; until then a styled
// monogram card is shown. `image` can also point to a file directly.
// ─────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'SCIENTISTS',
  'INNOVATORS',
  'ENTERTAINMENT',
  'ARTISTS',
  'LEADERS',
  'SPORTS',
]

export const CATEGORY_LABELS = {
  SCIENTISTS: 'Scientists',
  INNOVATORS: 'Innovators',
  ENTERTAINMENT: 'Entertainment',
  ARTISTS: 'Artists',
  LEADERS: 'Leaders',
  SPORTS: 'Sports',
}

export const CATEGORY_COLORS = {
  SCIENTISTS: '#79aeb6',
  INNOVATORS: '#9db58a',
  ENTERTAINMENT: '#d39a6a',
  ARTISTS: '#b896c4',
  LEADERS: '#c9b27a',
  SPORTS: '#93a6d6',
}

export const personalities = [
  {
    name: 'Albert Einstein',
    role: 'The Physicist',
    born: 1879,
    died: 1955,
    category: 'SCIENTISTS',
    color: '#ffffff',
    image: '/portraits/einstein.jpg',
    title: 'The mind that redefined physics',
    description:
      'Albert Einstein was a theoretical physicist who transformed our understanding of space, time, gravity and the universe.',
    bornDate: 'March 14, 1879',
    birthplace: 'Ulm, Germany',
    coords: [48.4, 9.99], // birthplace latitude, longitude
    profession: 'Theoretical Physicist',
    achievement: 'Nobel Prize in Physics, 1921',
    earlyLife:
      'Einstein showed an early curiosity about mathematics and science. His fascination with the natural world began during childhood and shaped his future discoveries.',
    legacy:
      'His theory of relativity changed modern physics and continues to influence scientific research around the world.',
    timeline: [
      { year: '1879', event: 'Born in Ulm, Germany.' },
      { year: '1905', event: 'Published groundbreaking papers, including special relativity.' },
      { year: '1915', event: 'Completed his general theory of relativity.' },
      { year: '1921', event: 'Awarded the Nobel Prize in Physics.' },
      { year: '1955', event: 'Passed away in Princeton, New Jersey.' },
    ],
    clues: [
      'My most famous equation links mass and energy.',
      'I worked in a Swiss patent office before becoming famous.',
    ],
  },
  {
    name: 'Nikola Tesla',
    role: 'The Inventor',
    born: 1856,
    died: 1943,
    category: 'INNOVATORS',
    color: '#579bff',
    image: '/portraits/tesla.webp',
    title: 'The inventor who powered the world',
    description:
      'Nikola Tesla was an inventor and electrical engineer whose innovations helped shape modern electricity.',
    bornDate: 'July 10, 1856',
    birthplace: 'Smiljan, Austrian Empire',
    coords: [44.56, 15.32], // birthplace latitude, longitude
    profession: 'Inventor and Engineer',
    achievement: 'Alternating Current (AC) technology',
    earlyLife:
      'Tesla demonstrated an extraordinary ability in mathematics and engineering from a young age. His imagination and curiosity drove his inventions.',
    legacy:
      'His contributions to alternating current electricity helped transform how the modern world generates and distributes power.',
    timeline: [
      { year: '1856', event: 'Born in Smiljan, in the Austrian Empire.' },
      { year: '1884', event: 'Arrived in New York and briefly worked for Thomas Edison.' },
      { year: '1888', event: 'His AC motor patents were licensed to Westinghouse.' },
      { year: '1893', event: 'AC power lit up the World’s Columbian Exposition in Chicago.' },
      { year: '1943', event: 'Passed away in New York City.' },
    ],
    clues: [
      'The SI unit of magnetic flux density is named after me.',
      'I fought the “War of the Currents” on the side of AC.',
    ],
  },
  {
    name: 'Michael Jackson',
    role: 'The King of Pop',
    born: 1958,
    died: 2009,
    category: 'ENTERTAINMENT',
    color: '#ffb65c',
    image: '/portraits/michael-jackson.jpg',
    title: 'The King of Pop',
    description:
      'Michael Jackson was an American singer, songwriter and dancer who became one of the most influential entertainers in music history.',
    bornDate: 'August 29, 1958',
    birthplace: 'Gary, Indiana, USA',
    coords: [41.59, -87.35], // birthplace latitude, longitude
    profession: 'Singer and Performer',
    achievement: 'Thriller — one of the best-selling albums of all time',
    earlyLife:
      'Michael began performing as a child with the Jackson 5. His extraordinary talent quickly made him a global music sensation.',
    legacy:
      'His music, dance performances and artistic influence transformed pop culture and inspired generations of performers.',
    timeline: [
      { year: '1958', event: 'Born in Gary, Indiana.' },
      { year: '1964', event: 'Began performing with his brothers in the Jackson 5.' },
      { year: '1982', event: 'Released Thriller.' },
      { year: '1987', event: 'Released Bad and began his first solo world tour.' },
      { year: '2009', event: 'Passed away in Los Angeles.' },
    ],
    clues: [
      'I made the moonwalk famous around the world.',
      'I started out as the youngest lead singer of a family band.',
    ],
  },
  {
    name: 'Leonardo da Vinci',
    role: 'The Visionary',
    born: 1452,
    died: 1519,
    category: 'ARTISTS',
    color: '#b8a17c',
    image: '/portraits/davinci.webp',
    title: 'The ultimate Renaissance mind',
    description:
      'Leonardo da Vinci was an Italian artist, scientist, engineer and inventor whose curiosity crossed countless disciplines.',
    bornDate: 'April 15, 1452',
    birthplace: 'Vinci, Italy',
    coords: [43.79, 10.93], // birthplace latitude, longitude
    profession: 'Artist and Inventor',
    achievement: 'Mona Lisa and The Last Supper',
    earlyLife:
      'Leonardo grew up in Renaissance Italy and developed remarkable interests in painting, anatomy, architecture and engineering.',
    legacy:
      'His artworks and notebooks remain extraordinary examples of creativity, observation and scientific curiosity.',
    timeline: [
      { year: '1452', event: 'Born in Vinci, near Florence.' },
      { year: '1466', event: 'Apprenticed to the artist Verrocchio in Florence (c. 1466).' },
      { year: '1498', event: 'Completed The Last Supper in Milan.' },
      { year: '1503', event: 'Began painting the Mona Lisa.' },
      { year: '1519', event: 'Passed away in Amboise, France.' },
    ],
    clues: [
      'I wrote many of my notebooks in mirror writing.',
      'I sketched flying machines centuries before aeroplanes.',
    ],
  },
  {
    name: 'Nelson Mandela',
    role: 'The Leader',
    born: 1918,
    died: 2013,
    category: 'LEADERS',
    color: '#61c9a5',
    image: '/portraits/mandela.webp',
    title: 'The symbol of freedom',
    description:
      'Nelson Mandela was a South African anti-apartheid revolutionary and the first Black president of South Africa.',
    bornDate: 'July 18, 1918',
    birthplace: 'Mvezo, South Africa',
    coords: [-31.83, 28.62], // birthplace latitude, longitude
    profession: 'Political Leader',
    achievement: 'Nobel Peace Prize, 1993',
    earlyLife:
      'Mandela studied law and became involved in the struggle against racial segregation and apartheid in South Africa.',
    legacy:
      'His dedication to equality, democracy and reconciliation made him an international symbol of freedom and justice.',
    timeline: [
      { year: '1918', event: 'Born in Mvezo, South Africa.' },
      { year: '1964', event: 'Sentenced to life imprisonment at the Rivonia Trial.' },
      { year: '1990', event: 'Released after 27 years in prison.' },
      { year: '1994', event: 'Became South Africa’s first Black president.' },
      { year: '2013', event: 'Passed away in Johannesburg.' },
    ],
    clues: [
      'I spent 27 years in prison before leading my country.',
      'My birthday, July 18, is now an international day of service.',
    ],
  },
  {
    name: 'Steve Jobs',
    role: 'The Innovator',
    born: 1955,
    died: 2011,
    category: 'INNOVATORS',
    color: '#e4e4e4',
    image: '/portraits/steve-jobs.jpg',
    title: 'The man who changed technology',
    description:
      'Steve Jobs was an American entrepreneur and co-founder of Apple, known for transforming personal technology.',
    bornDate: 'February 24, 1955',
    birthplace: 'San Francisco, California, USA',
    coords: [37.77, -122.42], // birthplace latitude, longitude
    profession: 'Entrepreneur',
    achievement: 'Co-founded Apple and helped introduce the iPhone',
    earlyLife:
      'Jobs developed an interest in electronics and technology during his youth. His passion for innovation eventually led him to co-found Apple.',
    legacy:
      'His vision helped reshape personal computers, smartphones, digital music and modern product design.',
    timeline: [
      { year: '1955', event: 'Born in San Francisco, California.' },
      { year: '1976', event: 'Co-founded Apple in a family garage.' },
      { year: '1984', event: 'Launched the Macintosh.' },
      { year: '1997', event: 'Returned to lead Apple.' },
      { year: '2007', event: 'Introduced the iPhone.' },
      { year: '2011', event: 'Passed away in Palo Alto, California.' },
    ],
    clues: [
      'I introduced a phone, an iPod and an internet device — all in one.',
      'I also helped build the animation studio Pixar.',
    ],
  },

  // ───────────── NEW LEGENDS ─────────────
  {
    name: 'Marie Curie',
    role: 'The Pioneer',
    born: 1867,
    died: 1934,
    category: 'SCIENTISTS',
    color: '#7ef0d8',
    title: 'The first woman to win a Nobel Prize',
    description:
      'Marie Curie was a physicist and chemist whose research on radioactivity opened a new era in science.',
    bornDate: 'November 7, 1867',
    birthplace: 'Warsaw, Poland',
    coords: [52.23, 21.01], // birthplace latitude, longitude
    profession: 'Physicist and Chemist',
    achievement: 'Nobel Prizes in Physics (1903) and Chemistry (1911)',
    earlyLife:
      'Born in Warsaw, she studied in secret because women could not attend university there, then moved to Paris to study at the Sorbonne.',
    legacy:
      'She remains the only person to win Nobel Prizes in two different sciences, and her work laid the foundation for radiation therapy.',
    timeline: [
      { year: '1867', event: 'Born in Warsaw, Poland.' },
      { year: '1891', event: 'Moved to Paris to study at the Sorbonne.' },
      { year: '1898', event: 'Discovered polonium and radium with Pierre Curie.' },
      { year: '1903', event: 'Shared the Nobel Prize in Physics.' },
      { year: '1911', event: 'Won the Nobel Prize in Chemistry.' },
      { year: '1934', event: 'Passed away in France.' },
    ],
    clues: [
      'I won Nobel Prizes in two different sciences.',
      'I discovered two elements, one named after my homeland.',
    ],
  },
  {
    name: 'Isaac Newton',
    role: 'The Natural Philosopher',
    born: 1643,
    died: 1727,
    category: 'SCIENTISTS',
    color: '#9fd3ff',
    title: 'The man who explained gravity',
    description:
      'Isaac Newton was an English mathematician and physicist whose laws of motion and gravitation shaped science for centuries.',
    bornDate: 'January 4, 1643',
    birthplace: 'Woolsthorpe, England',
    coords: [52.81, -0.63], // birthplace latitude, longitude
    profession: 'Mathematician and Physicist',
    achievement: 'Principia Mathematica — laws of motion and universal gravitation',
    earlyLife:
      'Newton grew up on a farm in Lincolnshire. While Cambridge was closed by plague, he developed key ideas on calculus, optics and gravity.',
    legacy:
      'His laws of motion are still taught in every physics class, and he co-invented calculus.',
    timeline: [
      { year: '1643', event: 'Born in Woolsthorpe, England.' },
      { year: '1665', event: 'Began his breakthrough work on calculus, optics and gravity.' },
      { year: '1687', event: 'Published the Principia.' },
      { year: '1705', event: 'Knighted by Queen Anne.' },
      { year: '1727', event: 'Passed away in London.' },
    ],
    clues: [
      'A falling apple is part of my most famous story.',
      'I described three laws of motion.',
    ],
  },
  {
    name: 'A.P.J. Abdul Kalam',
    slug: 'abdul-kalam',
    role: 'The Missile Man',
    born: 1931,
    died: 2015,
    category: 'SCIENTISTS',
    color: '#ffd166',
    title: 'The People’s President',
    description:
      'A.P.J. Abdul Kalam was an Indian aerospace scientist who led key space and missile programmes and later became President of India.',
    bornDate: 'October 15, 1931',
    birthplace: 'Rameswaram, Tamil Nadu, India',
    coords: [9.29, 79.31], // birthplace latitude, longitude
    profession: 'Aerospace Scientist',
    achievement: 'Led India’s SLV-III satellite launch; 11th President of India',
    earlyLife:
      'Growing up in Rameswaram, he sold newspapers to support his family and later studied aeronautical engineering in Madras.',
    legacy:
      'Known as the “Missile Man of India”, he inspired millions of students with his books and talks about dreams and science.',
    timeline: [
      { year: '1931', event: 'Born in Rameswaram, Tamil Nadu.' },
      { year: '1980', event: 'SLV-III, the project he directed, placed Rohini in orbit.' },
      { year: '1997', event: 'Awarded the Bharat Ratna.' },
      { year: '2002', event: 'Became the 11th President of India.' },
      { year: '2015', event: 'Passed away while giving a lecture in Shillong.' },
    ],
    clues: [
      'I am called the “Missile Man” of my country.',
      'My autobiography is titled Wings of Fire.',
    ],
  },
  {
    name: 'Srinivasa Ramanujan',
    role: 'The Mathematician',
    born: 1887,
    died: 1920,
    category: 'SCIENTISTS',
    color: '#ff9f80',
    title: 'The man who knew infinity',
    description:
      'Srinivasa Ramanujan was a self-taught Indian mathematician who made extraordinary contributions to number theory and infinite series.',
    bornDate: 'December 22, 1887',
    birthplace: 'Erode, Tamil Nadu, India',
    coords: [11.34, 77.72], // birthplace latitude, longitude
    profession: 'Mathematician',
    achievement: 'Fellow of the Royal Society; thousands of original results',
    earlyLife:
      'With almost no formal training, he filled notebooks with original formulas before writing to G. H. Hardy at Cambridge.',
    legacy:
      'Mathematicians are still proving and applying results from his notebooks more than a century later.',
    timeline: [
      { year: '1887', event: 'Born in Erode, Tamil Nadu.' },
      { year: '1913', event: 'Wrote to G. H. Hardy at Cambridge.' },
      { year: '1914', event: 'Travelled to England to work with Hardy.' },
      { year: '1918', event: 'Elected a Fellow of the Royal Society.' },
      { year: '1920', event: 'Passed away in Kumbakonam, India.' },
    ],
    clues: [
      '1729 is known as my “taxicab number”.',
      'I collaborated with G. H. Hardy at Cambridge.',
    ],
  },
  {
    name: 'Ada Lovelace',
    role: 'The First Programmer',
    born: 1815,
    died: 1852,
    category: 'INNOVATORS',
    color: '#d7a6ff',
    title: 'The enchantress of numbers',
    description:
      'Ada Lovelace was an English mathematician known for her work on Charles Babbage’s Analytical Engine.',
    bornDate: 'December 10, 1815',
    birthplace: 'London, England',
    coords: [51.51, -0.13], // birthplace latitude, longitude
    profession: 'Mathematician and Writer',
    achievement: 'Published what is considered the first computer algorithm',
    earlyLife:
      'Encouraged by her mother to study mathematics and science, she met Charles Babbage at the age of 17.',
    legacy:
      'She imagined computers doing more than calculation, and Ada Lovelace Day now celebrates women in science and technology.',
    timeline: [
      { year: '1815', event: 'Born in London.' },
      { year: '1833', event: 'Met Charles Babbage.' },
      { year: '1843', event: 'Published her notes on the Analytical Engine.' },
      { year: '1852', event: 'Passed away in London.' },
    ],
    clues: [
      'I wrote an algorithm for a machine that was never fully built.',
      'My father was the poet Lord Byron.',
    ],
  },
  {
    name: 'Thomas Edison',
    role: 'The Wizard of Menlo Park',
    born: 1847,
    died: 1931,
    category: 'INNOVATORS',
    color: '#ffe08a',
    title: 'The inventor of the modern age',
    description:
      'Thomas Edison was an American inventor and businessman who held more than a thousand patents.',
    bornDate: 'February 11, 1847',
    birthplace: 'Milan, Ohio, USA',
    coords: [41.3, -82.6], // birthplace latitude, longitude
    profession: 'Inventor and Businessman',
    achievement: 'Phonograph and a practical electric light bulb',
    earlyLife:
      'Edison had little formal schooling. He worked as a telegraph operator as a young man, which sparked his interest in electricity.',
    legacy:
      'His research lab at Menlo Park became a model for modern industrial research.',
    timeline: [
      { year: '1847', event: 'Born in Milan, Ohio.' },
      { year: '1876', event: 'Opened his laboratory at Menlo Park, New Jersey.' },
      { year: '1877', event: 'Invented the phonograph.' },
      { year: '1879', event: 'Demonstrated a long-lasting incandescent light bulb.' },
      { year: '1931', event: 'Passed away in West Orange, New Jersey.' },
    ],
    clues: [
      'I invented a machine that could record and play back sound.',
      'I was called the “Wizard of Menlo Park”.',
    ],
  },
  {
    name: 'Vincent van Gogh',
    role: 'The Post-Impressionist',
    born: 1853,
    died: 1890,
    category: 'ARTISTS',
    color: '#f5c542',
    title: 'The painter of starry nights',
    description:
      'Vincent van Gogh was a Dutch painter whose bold colours and expressive brushwork changed modern art.',
    bornDate: 'March 30, 1853',
    birthplace: 'Zundert, Netherlands',
    coords: [51.47, 4.66], // birthplace latitude, longitude
    profession: 'Painter',
    achievement: 'The Starry Night and the Sunflowers series',
    earlyLife:
      'He worked as an art dealer and a preacher before deciding, at 27, to become an artist.',
    legacy:
      'Barely known in his lifetime, he is now one of the most famous and influential painters in history.',
    timeline: [
      { year: '1853', event: 'Born in Zundert, Netherlands.' },
      { year: '1880', event: 'Decided to become an artist.' },
      { year: '1888', event: 'Moved to Arles and painted his Sunflowers.' },
      { year: '1889', event: 'Painted The Starry Night.' },
      { year: '1890', event: 'Passed away in Auvers-sur-Oise, France.' },
    ],
    clues: [
      'I painted a swirling night sky over a small village.',
      'My brother Theo supported me throughout my career.',
    ],
  },
  {
    name: 'Frida Kahlo',
    role: 'The Self-Portraitist',
    born: 1907,
    died: 1954,
    category: 'ARTISTS',
    color: '#ff6b8b',
    title: 'The artist who painted her own reality',
    description:
      'Frida Kahlo was a Mexican painter famous for her vivid self-portraits and images inspired by Mexican culture.',
    bornDate: 'July 6, 1907',
    birthplace: 'Coyoacán, Mexico City',
    coords: [19.35, -99.16], // birthplace latitude, longitude
    profession: 'Painter',
    achievement: 'Her painting The Frame was acquired by the Louvre in 1939',
    earlyLife:
      'After a serious bus accident at 18, she began painting during her long recovery.',
    legacy:
      'Her art and her strength made her a global icon of Mexican identity and personal expression.',
    timeline: [
      { year: '1907', event: 'Born in Coyoacán, Mexico City.' },
      { year: '1925', event: 'Began painting while recovering from a bus accident.' },
      { year: '1929', event: 'Married the muralist Diego Rivera.' },
      { year: '1939', event: 'The Louvre acquired her painting The Frame.' },
      { year: '1954', event: 'Passed away in Coyoacán.' },
    ],
    clues: [
      'Around a third of my paintings are self-portraits.',
      'My home, the Blue House, is now a museum.',
    ],
  },
  {
    name: 'Charlie Chaplin',
    role: 'The Little Tramp',
    born: 1889,
    died: 1977,
    category: 'ENTERTAINMENT',
    color: '#d0d0d0',
    title: 'The genius of silent film',
    description:
      'Charlie Chaplin was an English comic actor and filmmaker who became a worldwide star of the silent film era.',
    bornDate: 'April 16, 1889',
    birthplace: 'London, England',
    coords: [51.49, -0.1], // birthplace latitude, longitude
    profession: 'Actor and Filmmaker',
    achievement: 'Created the “Little Tramp”; Modern Times and The Great Dictator',
    earlyLife:
      'He grew up in poverty in London and was performing on stage as a child before moving to America.',
    legacy:
      'His blend of comedy and emotion still influences filmmakers and comedians today.',
    timeline: [
      { year: '1889', event: 'Born in London.' },
      { year: '1914', event: 'Introduced his “Little Tramp” character.' },
      { year: '1936', event: 'Released Modern Times.' },
      { year: '1940', event: 'Released The Great Dictator.' },
      { year: '1972', event: 'Received an honorary Academy Award.' },
      { year: '1977', event: 'Passed away in Switzerland.' },
    ],
    clues: [
      'My character wore a bowler hat and carried a cane.',
      'I starred in silent films without saying a word.',
    ],
  },
  {
    name: 'Lata Mangeshkar',
    role: 'The Nightingale of India',
    born: 1929,
    died: 2022,
    category: 'ENTERTAINMENT',
    color: '#ffc3e1',
    title: 'The voice of a nation',
    description:
      'Lata Mangeshkar was an Indian playback singer whose voice defined Indian film music for more than seven decades.',
    bornDate: 'September 28, 1929',
    birthplace: 'Indore, India',
    coords: [22.72, 75.86], // birthplace latitude, longitude
    profession: 'Playback Singer',
    achievement: 'Bharat Ratna, 2001',
    earlyLife:
      'She began singing professionally as a young teenager to support her family after her father’s death.',
    legacy:
      'She recorded thousands of songs in more than 30 languages and remains one of India’s most loved voices.',
    timeline: [
      { year: '1929', event: 'Born in Indore.' },
      { year: '1942', event: 'Began her professional singing career.' },
      { year: '1963', event: 'Sang “Aye Mere Watan Ke Logon”.' },
      { year: '2001', event: 'Awarded the Bharat Ratna.' },
      { year: '2022', event: 'Passed away in Mumbai.' },
    ],
    clues: [
      'I am known as the “Nightingale of India”.',
      'I sang in more than 30 languages over seven decades.',
    ],
  },
  {
    name: 'Mahatma Gandhi',
    role: 'The Father of the Nation',
    born: 1869,
    died: 1948,
    category: 'LEADERS',
    color: '#ffffff',
    title: 'The power of non-violence',
    description:
      'Mahatma Gandhi led India’s independence movement through non-violent resistance.',
    bornDate: 'October 2, 1869',
    birthplace: 'Porbandar, Gujarat, India',
    coords: [21.64, 69.61], // birthplace latitude, longitude
    profession: 'Lawyer and Freedom Leader',
    achievement: 'Led India’s non-violent struggle for independence',
    earlyLife:
      'He studied law in London and developed his ideas of non-violent protest while working in South Africa.',
    legacy:
      'His philosophy of non-violence inspired civil rights movements around the world.',
    timeline: [
      { year: '1869', event: 'Born in Porbandar, Gujarat.' },
      { year: '1893', event: 'Went to South Africa, where he began his activism.' },
      { year: '1930', event: 'Led the Salt March to Dandi.' },
      { year: '1942', event: 'Launched the Quit India Movement.' },
      { year: '1947', event: 'India gained independence.' },
      { year: '1948', event: 'Assassinated in New Delhi.' },
    ],
    clues: [
      'I led a 240-mile march to make salt from the sea.',
      'My birthday is celebrated as the International Day of Non-Violence.',
    ],
  },
  {
    name: 'Martin Luther King Jr.',
    slug: 'martin-luther-king',
    role: 'The Dreamer',
    born: 1929,
    died: 1968,
    category: 'LEADERS',
    color: '#8fd3ff',
    title: 'The voice of civil rights',
    description:
      'Martin Luther King Jr. was an American minister and leader of the civil rights movement.',
    bornDate: 'January 15, 1929',
    birthplace: 'Atlanta, Georgia, USA',
    coords: [33.75, -84.39], // birthplace latitude, longitude
    profession: 'Minister and Activist',
    achievement: 'Nobel Peace Prize, 1964',
    earlyLife:
      'The son of a pastor, he studied theology and was deeply influenced by Gandhi’s ideas of non-violence.',
    legacy:
      'His leadership helped end legal segregation in the United States, and his words still inspire movements for equality.',
    timeline: [
      { year: '1929', event: 'Born in Atlanta, Georgia.' },
      { year: '1955', event: 'Led the Montgomery bus boycott.' },
      { year: '1963', event: 'Delivered “I Have a Dream” in Washington, D.C.' },
      { year: '1964', event: 'Awarded the Nobel Peace Prize.' },
      { year: '1968', event: 'Assassinated in Memphis, Tennessee.' },
    ],
    clues: [
      'I told a crowd of 250,000 people about my dream.',
      'I led a year-long bus boycott in Montgomery.',
    ],
  },
  {
    name: 'Abraham Lincoln',
    role: 'The Great Emancipator',
    born: 1809,
    died: 1865,
    category: 'LEADERS',
    color: '#c9b79c',
    title: 'The president who preserved a nation',
    description:
      'Abraham Lincoln was the 16th President of the United States and led the country through the Civil War.',
    bornDate: 'February 12, 1809',
    birthplace: 'Kentucky, USA',
    coords: [37.57, -85.74], // birthplace latitude, longitude
    profession: 'Lawyer and President',
    achievement: 'Emancipation Proclamation, 1863',
    earlyLife:
      'Born in a log cabin, he was largely self-educated and taught himself law.',
    legacy:
      'He kept the United States together and moved the nation toward ending slavery.',
    timeline: [
      { year: '1809', event: 'Born in a log cabin in Kentucky.' },
      { year: '1861', event: 'Became the 16th President of the United States.' },
      { year: '1863', event: 'Issued the Emancipation Proclamation and gave the Gettysburg Address.' },
      { year: '1865', event: 'Assassinated in Washington, D.C.' },
    ],
    clues: [
      'I gave a famous short speech at Gettysburg.',
      'I was the 16th President of my country.',
    ],
  },
  // ───────────── SPORTS LEGENDS ─────────────
  {
    name: 'Sachin Tendulkar',
    role: 'The Master Blaster',
    born: 1973,
    died: null,
    category: 'SPORTS',
    color: '#5fb3ff',
    title: 'The god of cricket',
    description:
      'Sachin Tendulkar is an Indian cricketer widely regarded as one of the greatest batters in the history of the game.',
    bornDate: 'April 24, 1973',
    birthplace: 'Mumbai, India',
    coords: [19.08, 72.88], // birthplace latitude, longitude
    profession: 'Cricketer',
    achievement: '100 international centuries — the only player to reach the mark',
    earlyLife:
      'He trained under coach Ramakant Achrekar at Shivaji Park in Mumbai and made his Test debut at just 16.',
    legacy:
      'He holds the records for the most runs in both Test and ODI cricket and inspired a generation of Indian cricketers.',
    timeline: [
      { year: '1973', event: 'Born in Mumbai.' },
      { year: '1989', event: 'Made his Test debut against Pakistan at 16.' },
      { year: '2010', event: 'Scored the first double century in men’s ODI cricket.' },
      { year: '2011', event: 'Won the Cricket World Cup with India.' },
      { year: '2013', event: 'Retired from international cricket after his 200th Test.' },
      { year: '2014', event: 'Awarded the Bharat Ratna.' },
    ],
    clues: [
      'I scored 100 international centuries.',
      'I played 200 Test matches over 24 years.',
    ],
  },
  {
    name: 'MS Dhoni',
    role: 'Captain Cool',
    born: 1981,
    died: null,
    category: 'SPORTS',
    color: '#ffd23f',
    title: 'The calmest captain in cricket',
    description:
      'MS Dhoni is an Indian cricketer and former captain who led India to every major ICC limited-overs trophy.',
    bornDate: 'July 7, 1981',
    birthplace: 'Ranchi, Jharkhand, India',
    coords: [23.34, 85.31], // birthplace latitude, longitude
    profession: 'Cricketer',
    achievement: 'Captained India to the T20 World Cup, ODI World Cup and Champions Trophy',
    earlyLife:
      'He grew up in Ranchi, played football as a goalkeeper, and worked as a railway ticket collector before breaking into the Indian team.',
    legacy:
      'Famous for staying calm under pressure, he also led Chennai Super Kings to five IPL titles.',
    timeline: [
      { year: '1981', event: 'Born in Ranchi.' },
      { year: '2004', event: 'Made his ODI debut for India.' },
      { year: '2007', event: 'Captained India to the first T20 World Cup title.' },
      { year: '2011', event: 'Hit the winning six in the Cricket World Cup final.' },
      { year: '2013', event: 'Won the ICC Champions Trophy as captain.' },
      { year: '2020', event: 'Retired from international cricket.' },
      { year: '2026', event: 'Ended his IPL playing career and became CSK’s mentor.' },
    ],
    clues: [
      'I finished the 2011 World Cup final with a six.',
      'Fans call me “Captain Cool” and “Thala”.',
    ],
  },
  {
    name: 'Virat Kohli',
    role: 'The Chase Master',
    born: 1988,
    died: null,
    category: 'SPORTS',
    color: '#ff4f5e',
    title: 'The king of run chases',
    description:
      'Virat Kohli is an Indian cricketer and former captain known for his consistency, fitness and record-breaking batting.',
    bornDate: 'November 5, 1988',
    birthplace: 'Delhi, India',
    coords: [28.61, 77.21], // birthplace latitude, longitude
    profession: 'Cricketer',
    achievement: 'Most centuries in ODI cricket history',
    earlyLife:
      'He captained India to the Under-19 World Cup title in 2008 and made his ODI debut later that year.',
    legacy:
      'His intensity and fitness standards changed Indian cricket culture, and he is one of the greatest chasers the game has seen.',
    timeline: [
      { year: '1988', event: 'Born in Delhi.' },
      { year: '2008', event: 'Won the Under-19 World Cup as captain and made his ODI debut.' },
      { year: '2011', event: 'Won the Cricket World Cup with India.' },
      { year: '2023', event: 'Scored his record 50th ODI century.' },
      { year: '2024', event: 'Won the T20 World Cup and retired from T20 internationals.' },
      { year: '2025', event: 'Retired from Test cricket to focus on ODIs.' },
    ],
    clues: [
      'I broke the record for the most ODI centuries.',
      'I led India to the Under-19 World Cup title in 2008.',
    ],
  },
  {
    name: 'Neeraj Chopra',
    role: 'The Golden Arm',
    born: 1997,
    died: null,
    category: 'SPORTS',
    color: '#f7b733',
    title: 'India’s Olympic champion',
    description:
      'Neeraj Chopra is an Indian javelin thrower who won India’s first Olympic gold medal in athletics.',
    bornDate: 'December 24, 1997',
    birthplace: 'Khandra, Haryana, India',
    coords: [29.39, 76.97], // birthplace latitude, longitude
    profession: 'Javelin Thrower',
    achievement: 'Olympic gold (2020 Tokyo Games) and World Champion (2023)',
    earlyLife:
      'He took up sport to get fit as a teenager and discovered javelin at a stadium in Panipat.',
    legacy:
      'His Olympic gold made athletics popular across India and inspired a new wave of javelin throwers.',
    timeline: [
      { year: '1997', event: 'Born in Khandra, Haryana.' },
      { year: '2018', event: 'Won gold at the Asian Games and Commonwealth Games.' },
      { year: '2021', event: 'Won Olympic gold in Tokyo.' },
      { year: '2023', event: 'Became India’s first world champion in athletics.' },
      { year: '2024', event: 'Won Olympic silver in Paris.' },
      { year: '2025', event: 'Threw beyond 90 metres for the first time.' },
    ],
    clues: [
      'I won India’s first Olympic gold in track and field.',
      'My event is the javelin throw.',
    ],
  },
  {
    name: 'Sunil Chhetri',
    role: 'Captain Fantastic',
    born: 1984,
    died: null,
    category: 'SPORTS',
    color: '#4da3ff',
    title: 'The face of Indian football',
    description:
      'Sunil Chhetri is an Indian footballer and India’s most-capped player and all-time top scorer.',
    bornDate: 'August 3, 1984',
    birthplace: 'Secunderabad, Telangana, India',
    coords: [17.44, 78.5], // birthplace latitude, longitude
    profession: 'Footballer',
    achievement: 'Retired as one of the top international goal-scorers in football history',
    earlyLife:
      'Born to an army family, he began his professional career with Mohun Bagan in 2002.',
    legacy:
      'He led India to several SAFF Championship titles and gave Indian football a global face.',
    timeline: [
      { year: '1984', event: 'Born in Secunderabad.' },
      { year: '2002', event: 'Began his professional career with Mohun Bagan.' },
      { year: '2005', event: 'Made his debut for India.' },
      { year: '2021', event: 'Received the Khel Ratna, India’s highest sporting honour.' },
      { year: '2024', event: 'Retired from international football in Kolkata.' },
    ],
    clues: [
      'Only Ronaldo and Messi had more international goals among active players when I retired.',
      'I wore the No. 11 shirt as India’s football captain.',
    ],
  },
  {
    name: 'Lionel Messi',
    role: 'The Maestro',
    born: 1987,
    died: null,
    category: 'SPORTS',
    color: '#75c9ff',
    title: 'The greatest of his generation',
    description:
      'Lionel Messi is an Argentine footballer considered one of the greatest players of all time.',
    bornDate: 'June 24, 1987',
    birthplace: 'Rosario, Argentina',
    coords: [-32.95, -60.65], // birthplace latitude, longitude
    profession: 'Footballer',
    achievement: 'FIFA World Cup winner (2022) and eight Ballon d’Or awards',
    earlyLife:
      'He moved to Barcelona at 13, where the club helped pay for his growth hormone treatment.',
    legacy:
      'His dribbling, vision and goal-scoring set new standards and made him a global icon.',
    timeline: [
      { year: '1987', event: 'Born in Rosario, Argentina.' },
      { year: '2004', event: 'Made his first-team debut for Barcelona.' },
      { year: '2009', event: 'Won his first Ballon d’Or.' },
      { year: '2021', event: 'Won the Copa América with Argentina.' },
      { year: '2022', event: 'Won the FIFA World Cup as captain.' },
      { year: '2023', event: 'Joined Inter Miami in the USA.' },
    ],
    clues: [
      'I have won the Ballon d’Or eight times.',
      'I lifted the World Cup in Qatar in 2022.',
    ],
  },
  {
    name: 'Cristiano Ronaldo',
    role: 'CR7',
    born: 1985,
    died: null,
    category: 'SPORTS',
    color: '#ff6b6b',
    title: 'The ultimate goal machine',
    description:
      'Cristiano Ronaldo is a Portuguese footballer known for his athleticism, work ethic and record-breaking goal-scoring.',
    bornDate: 'February 5, 1985',
    birthplace: 'Funchal, Madeira, Portugal',
    coords: [32.65, -16.91], // birthplace latitude, longitude
    profession: 'Footballer',
    achievement: 'Most international goals in men’s football and five Ballon d’Or awards',
    earlyLife:
      'He grew up on the island of Madeira and joined Sporting CP’s academy in Lisbon at 12.',
    legacy:
      'He won titles in England, Spain and Italy and set records for goals in the Champions League and international football.',
    timeline: [
      { year: '1985', event: 'Born in Funchal, Madeira.' },
      { year: '2003', event: 'Joined Manchester United.' },
      { year: '2008', event: 'Won his first Ballon d’Or.' },
      { year: '2009', event: 'Moved to Real Madrid.' },
      { year: '2016', event: 'Won the European Championship with Portugal.' },
      { year: '2026', event: 'Became the first player to score in six World Cups.' },
    ],
    clues: [
      'My famous nickname is CR7.',
      'I have scored the most international goals in men’s football.',
    ],
  },
  {
    name: 'Usain Bolt',
    role: 'The Lightning Bolt',
    born: 1986,
    died: null,
    category: 'SPORTS',
    color: '#ffe14d',
    title: 'The fastest man in history',
    description:
      'Usain Bolt is a retired Jamaican sprinter who holds the world records in the 100 m and 200 m.',
    bornDate: 'August 21, 1986',
    birthplace: 'Sherwood Content, Jamaica',
    coords: [18.41, -77.64], // birthplace latitude, longitude
    profession: 'Sprinter',
    achievement: 'World records: 9.58 s (100 m) and 19.19 s (200 m)',
    earlyLife:
      'He played cricket and football as a child before his school coach steered him toward sprinting.',
    legacy:
      'He won the 100 m and 200 m at three straight Olympics and made sprinting a global spectacle.',
    timeline: [
      { year: '1986', event: 'Born in Sherwood Content, Jamaica.' },
      { year: '2008', event: 'Won Olympic 100 m and 200 m gold in Beijing.' },
      { year: '2009', event: 'Set the 100 m and 200 m world records in Berlin.' },
      { year: '2012', event: 'Defended both titles in London.' },
      { year: '2016', event: 'Completed the “triple-double” in Rio.' },
      { year: '2017', event: 'Retired from athletics.' },
    ],
    clues: [
      'I ran 100 metres in 9.58 seconds.',
      'My celebration pose looks like a lightning strike.',
    ],
  },
  {
    name: 'Serena Williams',
    role: 'The Champion',
    born: 1981,
    died: null,
    category: 'SPORTS',
    color: '#d38bff',
    title: 'The queen of the court',
    description:
      'Serena Williams is a retired American tennis player and one of the greatest athletes of all time.',
    bornDate: 'September 26, 1981',
    birthplace: 'Saginaw, Michigan, USA',
    coords: [43.42, -83.95], // birthplace latitude, longitude
    profession: 'Tennis Player',
    achievement: '23 Grand Slam singles titles — the Open Era record',
    earlyLife:
      'Coached by her father from a young age, she trained alongside her sister Venus on public courts in California.',
    legacy:
      'Her power and dominance changed women’s tennis and inspired athletes far beyond the sport.',
    timeline: [
      { year: '1981', event: 'Born in Saginaw, Michigan.' },
      { year: '1999', event: 'Won her first Grand Slam title at the US Open.' },
      { year: '2012', event: 'Won Olympic singles gold in London.' },
      { year: '2017', event: 'Won her 23rd Grand Slam title while pregnant.' },
      { year: '2022', event: 'Retired from professional tennis.' },
    ],
    clues: [
      'I won 23 Grand Slam singles titles.',
      'My sister Venus was also a world No. 1.',
    ],
  },

  // ───────────── LIVING LEGENDS ─────────────
  {
    name: 'A.R. Rahman',
    slug: 'ar-rahman',
    role: 'The Mozart of Madras',
    born: 1967,
    died: null,
    category: 'ENTERTAINMENT',
    color: '#9d8cff',
    title: 'The sound of modern India',
    description:
      'A.R. Rahman is an Indian composer whose music blends Indian classical, electronic and world sounds.',
    bornDate: 'January 6, 1967',
    birthplace: 'Chennai, India',
    coords: [13.08, 80.27], // birthplace latitude, longitude
    profession: 'Composer and Musician',
    achievement: 'Two Academy Awards for Slumdog Millionaire (2009)',
    earlyLife:
      'He started working as a keyboard player as a child to support his family after his father’s death.',
    legacy:
      'His film music changed the sound of Indian cinema and reached audiences around the world.',
    timeline: [
      { year: '1967', event: 'Born in Chennai.' },
      { year: '1992', event: 'Composed his first film score for Roja.' },
      { year: '2009', event: 'Won two Oscars for Slumdog Millionaire.' },
      { year: '2010', event: 'Won two Grammy Awards and the Padma Bhushan.' },
    ],
    clues: [
      'I won two Oscars, including one for “Jai Ho”.',
      'My first film score was for Roja.',
    ],
  },
  {
    name: 'Malala Yousafzai',
    role: 'The Advocate',
    born: 1997,
    died: null,
    category: 'LEADERS',
    color: '#ff8fb1',
    title: 'The voice for girls’ education',
    description:
      'Malala Yousafzai is a Pakistani activist for girls’ education and the youngest Nobel Prize laureate.',
    bornDate: 'July 12, 1997',
    birthplace: 'Mingora, Swat Valley, Pakistan',
    coords: [34.77, 72.36], // birthplace latitude, longitude
    profession: 'Education Activist',
    achievement: 'Nobel Peace Prize, 2014 — at just 17',
    earlyLife:
      'As a schoolgirl, she spoke out publicly for the right of girls to go to school in the Swat Valley.',
    legacy:
      'Through the Malala Fund, she campaigns for every girl to receive 12 years of free, quality education.',
    timeline: [
      { year: '1997', event: 'Born in Mingora, Pakistan.' },
      { year: '2009', event: 'Began writing about girls’ education for BBC Urdu.' },
      { year: '2012', event: 'Survived an attack by the Taliban.' },
      { year: '2013', event: 'Spoke at the United Nations and co-founded the Malala Fund.' },
      { year: '2014', event: 'Became the youngest Nobel Peace Prize laureate.' },
      { year: '2020', event: 'Graduated from the University of Oxford.' },
    ],
    clues: [
      'I am the youngest person ever to win a Nobel Prize.',
      'The UN declared my birthday, July 12, as a day in my name.',
    ],
  },
  {
    name: 'Sundar Pichai',
    role: 'The CEO',
    born: 1972,
    died: null,
    category: 'INNOVATORS',
    color: '#6ab7ff',
    title: 'From Chennai to Silicon Valley',
    description:
      'Sundar Pichai is an Indian-born American business executive and the CEO of Google and its parent company Alphabet.',
    bornDate: 'June 10, 1972',
    birthplace: 'Madurai, Tamil Nadu, India',
    coords: [9.93, 78.12], // birthplace latitude, longitude
    profession: 'Technology Executive',
    achievement: 'CEO of Google (since 2015) and Alphabet (since 2019)',
    earlyLife:
      'He grew up in Chennai and studied metallurgical engineering at IIT Kharagpur before moving to the USA.',
    legacy:
      'He led the development of Google Chrome and now steers one of the world’s largest technology companies.',
    timeline: [
      { year: '1972', event: 'Born in Madurai, Tamil Nadu.' },
      { year: '2004', event: 'Joined Google.' },
      { year: '2008', event: 'Helped launch Google Chrome.' },
      { year: '2015', event: 'Became CEO of Google.' },
      { year: '2019', event: 'Became CEO of Alphabet.' },
      { year: '2022', event: 'Received the Padma Bhushan.' },
    ],
    clues: [
      'I led the team that built the Chrome browser.',
      'I studied at IIT Kharagpur before becoming a tech CEO.',
    ],
  },
  {
    name: 'N.R. Narayana Murthy',
    slug: 'narayana-murthy',
    role: 'The Founder',
    born: 1946,
    died: null,
    category: 'INNOVATORS',
    color: '#5ad1c9',
    title: 'The father of Indian IT',
    description:
      'N.R. Narayana Murthy is an Indian entrepreneur who co-founded Infosys, one of India’s largest IT companies.',
    bornDate: 'August 20, 1946',
    birthplace: 'Sidlaghatta, Karnataka, India',
    coords: [13.39, 77.86], // birthplace latitude, longitude
    profession: 'Entrepreneur',
    achievement: 'Co-founded Infosys in 1981',
    earlyLife:
      'An engineer from IIT Kanpur, he started Infosys with six colleagues using money borrowed from his wife, Sudha Murty.',
    legacy:
      'Infosys helped put India on the global software map and showed that ethical business can succeed.',
    timeline: [
      { year: '1946', event: 'Born in Sidlaghatta, Karnataka.' },
      { year: '1981', event: 'Co-founded Infosys in Pune.' },
      { year: '1999', event: 'Infosys became the first Indian company listed on NASDAQ.' },
      { year: '2008', event: 'Received the Padma Vibhushan.' },
    ],
    clues: [
      'I co-founded one of India’s biggest IT companies.',
      'My wife Sudha lent me the money to start my company.',
    ],
  },

]

export const CURRENT_YEAR = new Date().getFullYear()
export const isLiving = (p) => p.died == null
export const formatYears = (p) =>
  isLiving(p) ? `Born ${p.born}` : `${p.born}–${p.died}`

// ── Portrait photos: detected automatically in /public/portraits ──
const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

export const getSlug = (person) =>
  person.slug ||
  person.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const foundPhotos = new Map() // person name -> photo url that loaded
const listeners = new Set()
let photosVersion = 0
let detectionStarted = false

// Ask the server whether a photo exists without downloading it.
// (A dev server answers missing files with the HTML page, so check the type too.)
async function photoExists(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return res.ok && (res.headers.get('content-type') || '').startsWith('image/')
  } catch {
    return false
  }
}

async function findPhoto(person) {
  const candidates = person.image
    ? [person.image]
    : EXTENSIONS.map((ext) => `/portraits/${getSlug(person)}.${ext}`)
  for (const url of candidates) {
    if (await photoExists(url)) return url
  }
  return null
}

// Call once on start-up: checks which portrait files exist
export function detectPortraits() {
  if (detectionStarted || typeof window === 'undefined') return
  detectionStarted = true
  personalities.forEach(async (person) => {
    const url = await findPhoto(person)
    if (!url) return
    foundPhotos.set(person.name, url)
    photosVersion += 1
    listeners.forEach((notify) => notify())
  })
}

export function subscribePortraits(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export const getPortraitsVersion = () => photosVersion

// ── Generated monogram portrait for legends without a photo ──
const portraitCache = new Map()

export function getPortrait(person) {
  if (foundPhotos.has(person.name)) return foundPhotos.get(person.name)
  if (portraitCache.has(person.name)) return portraitCache.get(person.name)
  if (typeof document === 'undefined') return ''

  const w = 700
  const h = 800
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const accent = CATEGORY_COLORS[person.category] || '#c6a15b'

  // background
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#1a1d27')
  bg.addColorStop(1, '#0f1117')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // glow
  const glow = ctx.createRadialGradient(w / 2, h * 0.42, 20, w / 2, h * 0.42, w * 0.6)
  glow.addColorStop(0, accent + '55')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  // rings
  ctx.strokeStyle = accent + '66'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.42, 210, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = accent + '33'
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.42, 250, 0, Math.PI * 2)
  ctx.stroke()

  // initials
  const words = person.name.replace(/\./g, ' ').split(/\s+/).filter(Boolean)
  const initials = (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase()
  ctx.fillStyle = '#ece6d9'
  ctx.font = '600 200px "Cormorant Garamond", Georgia, serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = accent
  ctx.shadowBlur = 0
  ctx.fillText(initials, w / 2, h * 0.42)
  ctx.shadowBlur = 0

  // category + years
  ctx.fillStyle = accent
  ctx.font = '600 26px Manrope, "Segoe UI", sans-serif'
  ctx.fillText(CATEGORY_LABELS[person.category] || '', w / 2, h * 0.8)
  ctx.fillStyle = '#9999a7'
  ctx.font = '500 24px "Segoe UI", sans-serif'
  ctx.fillText(formatYears(person), w / 2, h * 0.86)

  // frame
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.strokeRect(14, 14, w - 28, h - 28)

  const url = canvas.toDataURL('image/png')
  portraitCache.set(person.name, url)
  return url
}

// ── Quotes ───────────────────────────────────────────────────
// Only words each person is on record as saying or writing, with
// where they come from. Leave someone out rather than guess: many
// famous lines online are misattributed.
const QUOTES = {
  'Albert Einstein': { text: 'Imagination is more important than knowledge.', source: 'Interview in The Saturday Evening Post, 1929' },
  'Nikola Tesla': { text: 'The progressive development of man is vitally dependent on invention.', source: 'My Inventions, 1919' },
  'Leonardo da Vinci': { text: 'Just as iron rusts from disuse, even so does inaction spoil the intellect.', source: 'His notebooks' },
  'Nelson Mandela': { text: 'To be free is not merely to cast off one’s chains, but to live in a way that respects and enhances the freedom of others.', source: 'Long Walk to Freedom, 1994' },
  'Steve Jobs': { text: 'Your time is limited, so don’t waste it living someone else’s life.', source: 'Stanford commencement address, 2005' },
  'Marie Curie': { text: 'One never notices what has been done; one can only see what remains to be done.', source: 'Letter to her brother, 1894' },
  'Isaac Newton': { text: 'If I have seen further it is by standing on the shoulders of Giants.', source: 'Letter to Robert Hooke, 1675' },
  'A.P.J. Abdul Kalam': { text: 'Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.', source: 'Ignited Minds, 2002' },
  'Srinivasa Ramanujan': { text: 'An equation for me has no meaning unless it expresses a thought of God.', source: 'As remembered by a friend' },
  'Ada Lovelace': { text: 'The Analytical Engine weaves algebraical patterns just as the Jacquard-loom weaves flowers and leaves.', source: 'Notes on the Analytical Engine, 1843' },
  'Thomas Edison': { text: 'Genius is one per cent inspiration and ninety-nine per cent perspiration.', source: 'Quoted in Harper’s Monthly, 1932' },
  'Vincent van Gogh': { text: 'Great things are done by a series of small things brought together.', source: 'Letter to his brother Theo, 1882' },
  'Frida Kahlo': { text: 'Feet, what do I need you for when I have wings to fly?', source: 'Her diary, 1953' },
  'Mahatma Gandhi': { text: 'My life is my message.', source: 'Written for a visitor, 1947' },
  'Martin Luther King Jr.': { text: 'Injustice anywhere is a threat to justice everywhere.', source: 'Letter from Birmingham Jail, 1963' },
  'Abraham Lincoln': { text: 'Government of the people, by the people, for the people, shall not perish from the earth.', source: 'Gettysburg Address, 1863' },
  'A.R. Rahman': { text: 'All my life I had a choice of hate and love. I chose love, and I’m here.', source: 'Oscar acceptance speech, 2009' },
  'Malala Yousafzai': { text: 'One child, one teacher, one book and one pen can change the world.', source: 'Speech at the United Nations, 2013' },
  'N.R. Narayana Murthy': { text: 'In God we trust, everybody else brings data to the table.', source: 'A saying he often repeats' },
  'Charlie Chaplin': { text: 'You, the people, have the power to make this life free and beautiful, to make this life a wonderful adventure.', source: 'Closing speech of The Great Dictator, 1940' },
  'Lata Mangeshkar': { text: 'There is no retirement for an artist.', source: 'Interview with Arab News, 2020' },
  'Sachin Tendulkar': { text: 'Chase your dreams, but make sure you do not find shortcuts.', source: 'His father’s advice, recalled in his farewell speech, 2013' },
  'Virat Kohli': { text: 'Tendulkar has carried the burden of the nation for 21 years. It was time we carried him.', source: 'After winning the World Cup, 2011' },
  'Neeraj Chopra': { text: 'It feels unbelievable. It is a proud moment for me and my country.', source: 'After winning Olympic gold in Tokyo, 2021' },
  'Sunil Chhetri': { text: 'Abuse us, criticise us, but please come to watch the Indian national team play.', source: 'Video appeal to fans, 2018' },
  'Lionel Messi': { text: 'I achieved everything with the national team, as I always dreamed of.', source: 'Radio interview after the 2022 World Cup (translated from Spanish)' },
  'Cristiano Ronaldo': { text: 'Talent without work is nothing, and work without talent is nothing.', source: 'Podcast interview, 2024' },
  'Usain Bolt': { text: 'I’m now a living legend. Bask in my glory.', source: 'After his second Olympic sprint double, London 2012' },
  'Serena Williams': { text: 'Maybe the best word to describe what I’m up to is evolution.', source: 'Her essay in Vogue, 2022' },
  'Sundar Pichai': { text: 'Be open … be impatient … be hopeful.', source: '“You Will Prevail” speech to the Class of 2020' },
}

personalities.forEach((person) => {
  if (QUOTES[person.name]) person.quote = QUOTES[person.name]
})

// ── Photo histories ──────────────────────────────────────────
// Shown when someone clicks a portrait. Only facts we could check:
// archive and museum records, or the date the camera stored inside
// the photo file. Anything unknown is simply left out, and the page
// says so instead of guessing.
//   taken  – when (and where, if known)
//   by     – photographer or artist, with licence when one applies
//   story  – the moment the picture captures
const PHOTOS = {
  'Albert Einstein': { taken: '1947, Princeton, New Jersey', by: 'Oren Jack Turner', story: 'Made when Einstein was 68 and living in Princeton, where he worked at the Institute for Advanced Study. It became one of the best-known images of him.' },
  'Nikola Tesla': { taken: 'Around 1890, New York', by: 'Napoleon Sarony', story: 'Sarony was one of New York’s most celebrated portrait photographers. Tesla was about 34, two years after his AC motor patents were licensed to Westinghouse.' },
  'Leonardo da Vinci': { taken: 'Painted long after his death', by: 'Artist not known for certain', story: 'No colour portrait of Leonardo painted in his lifetime is known to survive. Later portraits like this were based largely on a red-chalk drawing of about 1510, traditionally believed to be his self-portrait.' },
  'Nelson Mandela': { taken: '4 October 1994', by: 'John Mathew Smith (CC BY-SA 2.0)', story: 'Taken five months after he became South Africa’s first democratically elected president in May 1994.' },
  'Steve Jobs': { taken: '11 June 2007, San Francisco', by: 'Ben Stanfield (CC BY-SA 2.0)', story: 'On stage at Apple’s Worldwide Developers Conference keynote, the same month the first iPhone went on sale.' },
  'Marie Curie': { taken: 'Around 1920', story: 'Taken when she was in her early fifties. The following year she toured the United States, where women raised the money to give her a gram of radium for her research.' },
  'Isaac Newton': { taken: '1689', by: 'Godfrey Kneller (oil painting)', story: 'Painted two years after Newton published the Principia, when he was 46. Kneller was the leading portrait painter in England at the time.' },
  'Srinivasa Ramanujan': { story: 'The exact date is not known. The original photograph belongs to Trinity College, Cambridge, where Ramanujan studied and worked from 1914 to 1919.' },
  'Ada Lovelace': { taken: 'Around 1843, London (some records say 1850)', by: 'Antoine Claudet', story: 'A daguerreotype, one of the earliest kinds of photograph, made on a silvered copper plate. 1843 is also the year she published her famous notes on the Analytical Engine.' },
  'Thomas Edison': { taken: 'Around 1922', by: 'Louis Bachrach, Bachrach Studios', story: 'Edison was in his mid-seventies and still running his laboratory in West Orange, New Jersey.' },
  'Vincent van Gogh': { taken: 'Spring 1887, Paris', by: 'Vincent van Gogh himself (oil painting)', story: 'Painted in Paris, where he was trying out the dotted brushwork of the pointillists. He painted more than 35 self-portraits, partly because he could not afford to pay models. It now hangs in the Art Institute of Chicago.' },
  'Frida Kahlo': { taken: '16 October 1932', by: 'Guillermo Kahlo, her father', story: 'Her father was a professional photographer who photographed her many times. She was 25 here.' },
  'Charlie Chaplin': { taken: 'Around 1920 (estimated)', story: 'Chaplin out of costume, without the Tramp’s moustache and bowler hat. The exact date and photographer are not confirmed.' },
  'Mahatma Gandhi': { taken: '1931, London', by: 'Elliott & Fry studio', story: 'Taken in London during his visit for the Second Round Table Conference on India’s future, in the autumn of 1931.' },
  'Martin Luther King Jr.': { taken: '18 March 1966, the White House', by: 'Yoichi Okamoto, White House photographer', story: 'Okamoto was President Lyndon B. Johnson’s official photographer and captured King during a visit to the White House.' },
  'Abraham Lincoln': { taken: '8 November 1863, Washington, D.C.', by: 'Alexander Gardner', story: 'Taken eleven days before he gave the Gettysburg Address.' },
  'Sachin Tendulkar': { taken: '4 February 2014, Rashtrapati Bhavan, New Delhi', story: 'Receiving the Bharat Ratna, India’s highest civilian award, from President Pranab Mukherjee. He was the first sportsperson ever given it.' },
  'MS Dhoni': { taken: '14 February 2008 (date stored by the camera)', story: 'A few months after he captained India to victory in the first T20 World Cup, in September 2007.' },
  'Virat Kohli': { taken: '9 March 2023 (date stored by the camera)', story: 'Most likely the first day of the fourth Test against Australia in Ahmedabad, where he went on to score 186, his first Test century in more than three years.' },
  'Neeraj Chopra': { taken: '2021, after the Tokyo Olympics', story: 'Wearing the javelin gold medal he won on 7 August 2021, India’s first Olympic gold in athletics.' },
  'Lionel Messi': { taken: '26 October 2005 (date stored by the camera)', story: 'Aged 18, in his second season in Barcelona’s first team.' },
  'Cristiano Ronaldo': { taken: '29 April 2006, Stamford Bridge, London (date stored by the camera)', story: 'Playing for Manchester United at Chelsea. Chelsea won 3–0 that day and clinched the Premier League title.' },
  'Usain Bolt': { taken: '2009, Berlin (judging by the blue track and race bib)', story: 'This appears to be the 2009 World Championships, where he set the 100 m and 200 m world records of 9.58 and 19.19 seconds that still stand.' },
  'Sundar Pichai': { story: 'Taken in front of the flag of the European Union. The date and occasion are not confirmed.' },
}

personalities.forEach((person) => {
  if (PHOTOS[person.name]) person.photo = PHOTOS[person.name]
})
