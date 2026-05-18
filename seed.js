require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "moviestream";

const genres = [
  { genre_id: 1, name: "Action" },
  { genre_id: 2, name: "Comedy" },
  { genre_id: 3, name: "Drama" },
  { genre_id: 4, name: "Thriller" },
  { genre_id: 5, name: "Sci-Fi" },
];

const movies = [
  {
    movie_id: 1001, title: "The Dark Knight", year: 2008, runtime: "152 min",
    studio: "Warner Bros", summary: "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos.",
    image_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    list_price: 3.99, views: 4820000, budget: "185000000", gross: "1004558444",
    genres: [{ genre_id: 1, name: "Action" }, { genre_id: 4, name: "Thriller" }],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    crew: { director: "Christopher Nolan", writer: "Jonathan Nolan" },
    awards: { wins: 2, nominations: 8 }, main_subject: "Crime",
    opening_date: new Date("2008-07-18"), wiki_article: "https://en.wikipedia.org/wiki/The_Dark_Knight"
  },
  {
    movie_id: 1002, title: "Inception", year: 2010, runtime: "148 min",
    studio: "Warner Bros", summary: "A thief who steals corporate secrets through dream-sharing technology.",
    image_url: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    list_price: 3.99, views: 3900000, budget: "160000000", gross: "836848102",
    genres: [{ genre_id: 5, name: "Sci-Fi" }, { genre_id: 4, name: "Thriller" }],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    crew: { director: "Christopher Nolan", writer: "Christopher Nolan" },
    awards: { wins: 4, nominations: 8 }, main_subject: "Dreams",
    opening_date: new Date("2010-07-16"), wiki_article: "https://en.wikipedia.org/wiki/Inception"
  },
  {
    movie_id: 1003, title: "Parasite", year: 2019, runtime: "132 min",
    studio: "CJ Entertainment", summary: "A poor family schemes to infiltrate a wealthy household.",
    image_url: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    list_price: 2.99, views: 2100000, budget: "11400000", gross: "263113811",
    genres: [{ genre_id: 3, name: "Drama" }, { genre_id: 4, name: "Thriller" }],
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    crew: { director: "Bong Joon-ho", writer: "Bong Joon-ho" },
    awards: { wins: 4, nominations: 9 }, main_subject: "Class inequality",
    opening_date: new Date("2019-11-08"), wiki_article: "https://en.wikipedia.org/wiki/Parasite_(2019_film)"
  },
  {
    movie_id: 1004, title: "The Grand Budapest Hotel", year: 2014, runtime: "99 min",
    studio: "Fox Searchlight", summary: "A concierge and his protégé become embroiled in a theft and murder mystery.",
    image_url: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    list_price: 2.99, views: 1850000, budget: "25000000", gross: "174782250",
    genres: [{ genre_id: 2, name: "Comedy" }, { genre_id: 3, name: "Drama" }],
    cast: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"],
    crew: { director: "Wes Anderson", writer: "Wes Anderson" },
    awards: { wins: 4, nominations: 9 }, main_subject: "Hotel",
    opening_date: new Date("2014-03-28"), wiki_article: "https://en.wikipedia.org/wiki/The_Grand_Budapest_Hotel"
  },
  {
    movie_id: 1005, title: "Interstellar", year: 2014, runtime: "169 min",
    studio: "Paramount Pictures", summary: "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
    image_url: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    list_price: 3.99, views: 3200000, budget: "165000000", gross: "677471339",
    genres: [{ genre_id: 5, name: "Sci-Fi" }, { genre_id: 3, name: "Drama" }],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    crew: { director: "Christopher Nolan", writer: "Jonathan Nolan" },
    awards: { wins: 1, nominations: 5 }, main_subject: "Space",
    opening_date: new Date("2014-11-07"), wiki_article: "https://en.wikipedia.org/wiki/Interstellar_(film)"
  },
  {
    movie_id: 1006, title: "Get Out", year: 2017, runtime: "104 min",
    studio: "Universal Pictures", summary: "A young Black man uncovers disturbing secrets when meeting his white girlfriend's family.",
    image_url: "https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg",
    list_price: 2.99, views: 2700000, budget: "4500000", gross: "255657400",
    genres: [{ genre_id: 4, name: "Thriller" }],
    cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford"],
    crew: { director: "Jordan Peele", writer: "Jordan Peele" },
    awards: { wins: 1, nominations: 4 }, main_subject: "Race",
    opening_date: new Date("2017-02-24"), wiki_article: "https://en.wikipedia.org/wiki/Get_Out"
  },
  {
    movie_id: 1007, title: "Everything Everywhere All at Once", year: 2022, runtime: "139 min",
    studio: "A24", summary: "A middle-aged Chinese immigrant discovers she must connect with parallel universe versions of herself.",
    image_url: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    list_price: 3.99, views: 1950000, budget: "14300000", gross: "72000000",
    genres: [{ genre_id: 1, name: "Action" }, { genre_id: 5, name: "Sci-Fi" }, { genre_id: 2, name: "Comedy" }],
    cast: ["Michelle Yeoh", "Ke Huy Quan", "Jamie Lee Curtis"],
    crew: { director: "Daniel Kwan", writer: "Daniel Kwan" },
    awards: { wins: 7, nominations: 11 }, main_subject: "Multiverse",
    opening_date: new Date("2022-03-25"), wiki_article: "https://en.wikipedia.org/wiki/Everything_Everywhere_All_at_Once"
  },
  {
    movie_id: 1008, title: "Mad Max: Fury Road", year: 2015, runtime: "120 min",
    studio: "Warner Bros", summary: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.",
    image_url: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
    list_price: 2.99, views: 3100000, budget: "150000000", gross: "375436231",
    genres: [{ genre_id: 1, name: "Action" }, { genre_id: 5, name: "Sci-Fi" }],
    cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
    crew: { director: "George Miller", writer: "George Miller" },
    awards: { wins: 6, nominations: 10 }, main_subject: "Survival",
    opening_date: new Date("2015-05-15"), wiki_article: "https://en.wikipedia.org/wiki/Mad_Max:_Fury_Road"
  },
  {
    movie_id: 1009, title: "The Social Network", year: 2010, runtime: "120 min",
    studio: "Columbia Pictures", summary: "The founding of Facebook and the lawsuits that followed.",
    image_url: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
    list_price: 2.99, views: 2400000, budget: "40000000", gross: "224920315",
    genres: [{ genre_id: 3, name: "Drama" }],
    cast: ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake"],
    crew: { director: "David Fincher", writer: "Aaron Sorkin" },
    awards: { wins: 3, nominations: 8 }, main_subject: "Tech startup",
    opening_date: new Date("2010-10-01"), wiki_article: "https://en.wikipedia.org/wiki/The_Social_Network"
  },
  {
    movie_id: 1010, title: "Knives Out", year: 2019, runtime: "130 min",
    studio: "Lionsgate", summary: "A detective investigates the death of a wealthy crime novelist.",
    image_url: "https://image.tmdb.org/t/p/w500/pThyQovXQrws2hmharmonEWxZO1.jpg",
    list_price: 2.99, views: 2000000, budget: "40000000", gross: "311396000",
    genres: [{ genre_id: 4, name: "Thriller" }, { genre_id: 2, name: "Comedy" }],
    cast: ["Daniel Craig", "Chris Evans", "Ana de Armas"],
    crew: { director: "Rian Johnson", writer: "Rian Johnson" },
    awards: { wins: 1, nominations: 4 }, main_subject: "Murder mystery",
    opening_date: new Date("2019-11-27"), wiki_article: "https://en.wikipedia.org/wiki/Knives_Out"
  },
  {
    movie_id: 1011, title: "Whiplash", year: 2014, runtime: "107 min",
    studio: "Sony Pictures Classics", summary: "A drumming student and his ruthless instructor push the boundaries of talent and sanity.",
    image_url: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    list_price: 2.99, views: 1700000, budget: "3300000", gross: "49000000",
    genres: [{ genre_id: 3, name: "Drama" }],
    cast: ["Miles Teller", "J.K. Simmons", "Paul Reiser"],
    crew: { director: "Damien Chazelle", writer: "Damien Chazelle" },
    awards: { wins: 3, nominations: 5 }, main_subject: "Music",
    opening_date: new Date("2014-10-10"), wiki_article: "https://en.wikipedia.org/wiki/Whiplash_(2014_film)"
  },
  {
    movie_id: 1012, title: "La La Land", year: 2016, runtime: "128 min",
    studio: "Lionsgate", summary: "A jazz musician and an aspiring actress fall in love in Los Angeles.",
    image_url: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
    list_price: 2.99, views: 2200000, budget: "30000000", gross: "446092357",
    genres: [{ genre_id: 3, name: "Drama" }, { genre_id: 2, name: "Comedy" }],
    cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
    crew: { director: "Damien Chazelle", writer: "Damien Chazelle" },
    awards: { wins: 6, nominations: 14 }, main_subject: "Romance",
    opening_date: new Date("2016-12-09"), wiki_article: "https://en.wikipedia.org/wiki/La_La_Land"
  },
  {
    movie_id: 1013, title: "Oppenheimer", year: 2023, runtime: "180 min",
    studio: "Universal Pictures", summary: "The story of J. Robert Oppenheimer and the development of the atomic bomb.",
    image_url: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    list_price: 4.99, views: 4100000, budget: "100000000", gross: "952000000",
    genres: [{ genre_id: 3, name: "Drama" }, { genre_id: 4, name: "Thriller" }],
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon"],
    crew: { director: "Christopher Nolan", writer: "Christopher Nolan" },
    awards: { wins: 7, nominations: 13 }, main_subject: "History",
    opening_date: new Date("2023-07-21"), wiki_article: "https://en.wikipedia.org/wiki/Oppenheimer_(film)"
  },
  {
    movie_id: 1014, title: "Dune", year: 2021, runtime: "155 min",
    studio: "Warner Bros", summary: "A noble family becomes embroiled in a war over control of the galaxy's most valuable asset.",
    image_url: "https://image.tmdb.org/t/p/w500/d5NXSklpcvzeV6Wgj2vA0y3dXx4.jpg",
    list_price: 3.99, views: 3500000, budget: "165000000", gross: "401800000",
    genres: [{ genre_id: 5, name: "Sci-Fi" }, { genre_id: 1, name: "Action" }],
    cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac"],
    crew: { director: "Denis Villeneuve", writer: "Eric Roth" },
    awards: { wins: 6, nominations: 10 }, main_subject: "Space empire",
    opening_date: new Date("2021-10-22"), wiki_article: "https://en.wikipedia.org/wiki/Dune_(2021_film)"
  },
  {
    movie_id: 1015, title: "The Lighthouse", year: 2019, runtime: "109 min",
    studio: "A24", summary: "Two lighthouse keepers try to maintain their sanity while stranded on an island.",
    image_url: "https://image.tmdb.org/t/p/w500/3nGPALxMPcHzWWs8NUFr5LUbzND.jpg",
    list_price: 2.99, views: 980000, budget: "4000000", gross: "11300000",
    genres: [{ genre_id: 4, name: "Thriller" }, { genre_id: 3, name: "Drama" }],
    cast: ["Willem Dafoe", "Robert Pattinson"],
    crew: { director: "Robert Eggers", writer: "Robert Eggers" },
    awards: { wins: 0, nominations: 4 }, main_subject: "Isolation",
    opening_date: new Date("2019-11-01"), wiki_article: "https://en.wikipedia.org/wiki/The_Lighthouse_(2019_film)"
  },
  {
    movie_id: 1016, title: "Spirited Away", year: 2001, runtime: "125 min",
    studio: "Studio Ghibli", summary: "During her family's move, a sullen girl enters a world ruled by gods and spirits.",
    image_url: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    list_price: 3.99, views: 3800000, budget: "19000000", gross: "395802979",
    genres: [{ genre_id: 5, name: "Sci-Fi" }, { genre_id: 2, name: "Comedy" }],
    cast: ["Daveigh Chase", "Suzanne Pleshette", "Miyu Irino"],
    crew: { director: "Hayao Miyazaki", writer: "Hayao Miyazaki" },
    awards: { wins: 1, nominations: 3 }, main_subject: "Fantasy",
    opening_date: new Date("2003-03-28"), wiki_article: "https://en.wikipedia.org/wiki/Spirited_Away"
  },
  {
    movie_id: 1017, title: "No Country for Old Men", year: 2007, runtime: "122 min",
    studio: "Miramax", summary: "A hunter stumbles upon a drug deal gone wrong and must evade a relentless killer.",
    image_url: "https://image.tmdb.org/t/p/w500/6d5XOczc0bDmBDi03oMNsNBvEIv.jpg",
    list_price: 2.99, views: 2600000, budget: "25000000", gross: "171627166",
    genres: [{ genre_id: 4, name: "Thriller" }, { genre_id: 3, name: "Drama" }],
    cast: ["Tommy Lee Jones", "Javier Bardem", "Josh Brolin"],
    crew: { director: "Joel Coen", writer: "Joel Coen" },
    awards: { wins: 4, nominations: 8 }, main_subject: "Crime",
    opening_date: new Date("2007-11-09"), wiki_article: "https://en.wikipedia.org/wiki/No_Country_for_Old_Men"
  },
  {
    movie_id: 1018, title: "Superbad", year: 2007, runtime: "113 min",
    studio: "Columbia Pictures", summary: "Two co-dependent high school seniors attempt to buy alcohol for a party.",
    image_url: "https://image.tmdb.org/t/p/w500/ek8e8txUyUwd2BNqj6lFEekayCB.jpg",
    list_price: 1.99, views: 2900000, budget: "20000000", gross: "171417900",
    genres: [{ genre_id: 2, name: "Comedy" }],
    cast: ["Jonah Hill", "Michael Cera", "Christopher Mintz-Plasse"],
    crew: { director: "Greg Mottola", writer: "Seth Rogen" },
    awards: { wins: 0, nominations: 2 }, main_subject: "Teenagers",
    opening_date: new Date("2007-08-17"), wiki_article: "https://en.wikipedia.org/wiki/Superbad"
  },
  {
    movie_id: 1019, title: "Tenet", year: 2020, runtime: "150 min",
    studio: "Warner Bros", summary: "A secret agent manipulates the flow of time to prevent World War III.",
    image_url: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijPlayground.jpg",
    list_price: 3.99, views: 1600000, budget: "200000000", gross: "363700000",
    genres: [{ genre_id: 1, name: "Action" }, { genre_id: 5, name: "Sci-Fi" }],
    cast: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki"],
    crew: { director: "Christopher Nolan", writer: "Christopher Nolan" },
    awards: { wins: 1, nominations: 4 }, main_subject: "Time",
    opening_date: new Date("2020-09-03"), wiki_article: "https://en.wikipedia.org/wiki/Tenet_(film)"
  },
  {
    movie_id: 1020, title: "The Favourite", year: 2018, runtime: "119 min",
    studio: "Element Pictures", summary: "In early 18th century England, a new servant fights for the queen's affections.",
    image_url: "https://image.tmdb.org/t/p/w500/5uxr9BKaHBN2Hcj4r9qbkYrXu0B.jpg",
    list_price: 2.99, views: 1300000, budget: "15000000", gross: "96591000",
    genres: [{ genre_id: 3, name: "Drama" }, { genre_id: 2, name: "Comedy" }],
    cast: ["Olivia Colman", "Emma Stone", "Rachel Weisz"],
    crew: { director: "Yorgos Lanthimos", writer: "Deborah Davis" },
    awards: { wins: 1, nominations: 10 }, main_subject: "Royalty",
    opening_date: new Date("2018-11-23"), wiki_article: "https://en.wikipedia.org/wiki/The_Favourite"
  },
];

const customers = [
  { cust_id: 501, first_name: "Ana", last_name: "Martínez", email: "ana.martinez@example.com", city: "Monterrey", country: "Mexico", age: 29, gender: "F", income_level: "Middle", segment: { segment_id: 2, name: "Young Professionals", short_name: "YP" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2024-01-15"), fecha_fin: null } },
  { cust_id: 502, first_name: "Carlos", last_name: "Rodríguez", email: "carlos.rodriguez@example.com", city: "Ciudad de México", country: "Mexico", age: 35, gender: "M", income_level: "High", segment: { segment_id: 1, name: "Affluent", short_name: "AFF" }, subscription: { plan_id: 2, plan_name: "Básico", fecha_inicio: new Date("2023-06-01"), fecha_fin: null } },
  { cust_id: 503, first_name: "María", last_name: "López", email: "maria.lopez@example.com", city: "Guadalajara", country: "Mexico", age: 42, gender: "F", income_level: "Middle", segment: { segment_id: 3, name: "Families", short_name: "FAM" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2023-09-10"), fecha_fin: null } },
  { cust_id: 504, first_name: "Jorge", last_name: "Hernández", email: "jorge.hernandez@example.com", city: "Monterrey", country: "Mexico", age: 24, gender: "M", income_level: "Low", segment: { segment_id: 4, name: "Students", short_name: "STU" }, subscription: { plan_id: 3, plan_name: "Estudiante", fecha_inicio: new Date("2024-02-01"), fecha_fin: null } },
  { cust_id: 505, first_name: "Laura", last_name: "García", email: "laura.garcia@example.com", city: "Tijuana", country: "Mexico", age: 31, gender: "F", income_level: "Middle", segment: { segment_id: 2, name: "Young Professionals", short_name: "YP" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2023-11-20"), fecha_fin: null } },
  { cust_id: 506, first_name: "Roberto", last_name: "Sánchez", email: "roberto.sanchez@example.com", city: "Puebla", country: "Mexico", age: 48, gender: "M", income_level: "High", segment: { segment_id: 1, name: "Affluent", short_name: "AFF" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2022-12-05"), fecha_fin: null } },
  { cust_id: 507, first_name: "Sofía", last_name: "Torres", email: "sofia.torres@example.com", city: "León", country: "Mexico", age: 27, gender: "F", income_level: "Middle", segment: { segment_id: 2, name: "Young Professionals", short_name: "YP" }, subscription: { plan_id: 2, plan_name: "Básico", fecha_inicio: new Date("2024-03-01"), fecha_fin: null } },
  { cust_id: 508, first_name: "Diego", last_name: "Ramírez", email: "diego.ramirez@example.com", city: "Querétaro", country: "Mexico", age: 39, gender: "M", income_level: "Middle", segment: { segment_id: 3, name: "Families", short_name: "FAM" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2023-07-15"), fecha_fin: null } },
  { cust_id: 509, first_name: "Isabella", last_name: "Vargas", email: "isabella.vargas@example.com", city: "Mérida", country: "Mexico", age: 22, gender: "F", income_level: "Low", segment: { segment_id: 4, name: "Students", short_name: "STU" }, subscription: { plan_id: 3, plan_name: "Estudiante", fecha_inicio: new Date("2024-01-08"), fecha_fin: null } },
  { cust_id: 510, first_name: "Andrés", last_name: "Morales", email: "andres.morales@example.com", city: "Toluca", country: "Mexico", age: 33, gender: "M", income_level: "Middle", segment: { segment_id: 2, name: "Young Professionals", short_name: "YP" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2023-05-22"), fecha_fin: null } },
  { cust_id: 511, first_name: "Valentina", last_name: "Cruz", email: "valentina.cruz@example.com", city: "Hermosillo", country: "Mexico", age: 44, gender: "F", income_level: "High", segment: { segment_id: 1, name: "Affluent", short_name: "AFF" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2022-08-10"), fecha_fin: null } },
  { cust_id: 512, first_name: "Sebastián", last_name: "Flores", email: "sebastian.flores@example.com", city: "Veracruz", country: "Mexico", age: 19, gender: "M", income_level: "Low", segment: { segment_id: 4, name: "Students", short_name: "STU" }, subscription: { plan_id: 3, plan_name: "Estudiante", fecha_inicio: new Date("2024-02-14"), fecha_fin: null } },
  { cust_id: 513, first_name: "Camila", last_name: "Jiménez", email: "camila.jimenez@example.com", city: "San Luis Potosí", country: "Mexico", age: 36, gender: "F", income_level: "Middle", segment: { segment_id: 3, name: "Families", short_name: "FAM" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2023-10-01"), fecha_fin: null } },
  { cust_id: 514, first_name: "Miguel", last_name: "Díaz", email: "miguel.diaz@example.com", city: "Aguascalientes", country: "Mexico", age: 28, gender: "M", income_level: "Middle", segment: { segment_id: 2, name: "Young Professionals", short_name: "YP" }, subscription: { plan_id: 2, plan_name: "Básico", fecha_inicio: new Date("2024-01-25"), fecha_fin: null } },
  { cust_id: 515, first_name: "Lucía", last_name: "Reyes", email: "lucia.reyes@example.com", city: "Cancún", country: "Mexico", age: 52, gender: "F", income_level: "High", segment: { segment_id: 1, name: "Affluent", short_name: "AFF" }, subscription: { plan_id: 1, plan_name: "Premium", fecha_inicio: new Date("2022-03-18"), fecha_fin: null } },
];

const interactions = [
  { day_id: new Date("2024-03-15"), cust_id: 501, movie_id: 1001, genre_id: 1, app: "web", device: "desktop", os: "Windows", payment_method: "credit_card", list_price: 3.99, discount_type: "promo", discount_percent: 10, actual_price: 3.59 },
  { day_id: new Date("2024-03-16"), cust_id: 501, movie_id: 1002, genre_id: 5, app: "web", device: "desktop", os: "Windows", payment_method: "credit_card", list_price: 3.99, discount_type: null, discount_percent: 0, actual_price: 3.99 },
  { day_id: new Date("2024-03-18"), cust_id: 502, movie_id: 1013, genre_id: 3, app: "mobile", device: "phone", os: "iOS", payment_method: "paypal", list_price: 4.99, discount_type: null, discount_percent: 0, actual_price: 4.99 },
  { day_id: new Date("2024-03-19"), cust_id: 503, movie_id: 1007, genre_id: 1, app: "tv", device: "smart_tv", os: "Android", payment_method: "credit_card", list_price: 3.99, discount_type: "loyalty", discount_percent: 15, actual_price: 3.39 },
  { day_id: new Date("2024-03-20"), cust_id: 504, movie_id: 1009, genre_id: 3, app: "web", device: "laptop", os: "macOS", payment_method: "debit_card", list_price: 2.99, discount_type: "student", discount_percent: 20, actual_price: 2.39 },
  { day_id: new Date("2024-03-21"), cust_id: 505, movie_id: 1003, genre_id: 3, app: "mobile", device: "tablet", os: "Android", payment_method: "credit_card", list_price: 2.99, discount_type: null, discount_percent: 0, actual_price: 2.99 },
  { day_id: new Date("2024-03-22"), cust_id: 506, movie_id: 1014, genre_id: 5, app: "web", device: "desktop", os: "Windows", payment_method: "credit_card", list_price: 3.99, discount_type: null, discount_percent: 0, actual_price: 3.99 },
  { day_id: new Date("2024-03-23"), cust_id: 507, movie_id: 1004, genre_id: 2, app: "mobile", device: "phone", os: "iOS", payment_method: "apple_pay", list_price: 2.99, discount_type: "promo", discount_percent: 5, actual_price: 2.84 },
  { day_id: new Date("2024-03-24"), cust_id: 508, movie_id: 1006, genre_id: 4, app: "tv", device: "smart_tv", os: "webOS", payment_method: "credit_card", list_price: 2.99, discount_type: null, discount_percent: 0, actual_price: 2.99 },
  { day_id: new Date("2024-03-25"), cust_id: 509, movie_id: 1016, genre_id: 5, app: "web", device: "laptop", os: "macOS", payment_method: "debit_card", list_price: 3.99, discount_type: "student", discount_percent: 25, actual_price: 2.99 },
  { day_id: new Date("2024-03-26"), cust_id: 510, movie_id: 1017, genre_id: 4, app: "mobile", device: "phone", os: "Android", payment_method: "google_pay", list_price: 2.99, discount_type: null, discount_percent: 0, actual_price: 2.99 },
  { day_id: new Date("2024-03-27"), cust_id: 511, movie_id: 1013, genre_id: 3, app: "web", device: "desktop", os: "Windows", payment_method: "credit_card", list_price: 4.99, discount_type: "loyalty", discount_percent: 10, actual_price: 4.49 },
  { day_id: new Date("2024-03-28"), cust_id: 512, movie_id: 1011, genre_id: 3, app: "mobile", device: "phone", os: "Android", payment_method: "debit_card", list_price: 2.99, discount_type: "student", discount_percent: 20, actual_price: 2.39 },
  { day_id: new Date("2024-03-29"), cust_id: 513, movie_id: 1005, genre_id: 5, app: "tv", device: "smart_tv", os: "Android", payment_method: "credit_card", list_price: 3.99, discount_type: null, discount_percent: 0, actual_price: 3.99 },
  { day_id: new Date("2024-03-30"), cust_id: 514, movie_id: 1010, genre_id: 4, app: "web", device: "laptop", os: "Linux", payment_method: "paypal", list_price: 2.99, discount_type: null, discount_percent: 0, actual_price: 2.99 },
  { day_id: new Date("2024-04-01"), cust_id: 515, movie_id: 1019, genre_id: 1, app: "web", device: "desktop", os: "macOS", payment_method: "credit_card", list_price: 3.99, discount_type: "loyalty", discount_percent: 15, actual_price: 3.39 },
  { day_id: new Date("2024-04-02"), cust_id: 501, movie_id: 1020, genre_id: 3, app: "mobile", device: "phone", os: "iOS", payment_method: "apple_pay", list_price: 2.99, discount_type: null, discount_percent: 0, actual_price: 2.99 },
  { day_id: new Date("2024-04-03"), cust_id: 502, movie_id: 1008, genre_id: 1, app: "tv", device: "smart_tv", os: "Android", payment_method: "credit_card", list_price: 2.99, discount_type: null, discount_percent: 0, actual_price: 2.99 },
  { day_id: new Date("2024-04-04"), cust_id: 503, movie_id: 1012, genre_id: 3, app: "web", device: "laptop", os: "Windows", payment_method: "debit_card", list_price: 2.99, discount_type: "promo", discount_percent: 10, actual_price: 2.69 },
  { day_id: new Date("2024-04-05"), cust_id: 506, movie_id: 1015, genre_id: 4, app: "web", device: "desktop", os: "Windows", payment_method: "credit_card", list_price: 2.99, discount_type: null, discount_percent: 0, actual_price: 2.99 },
  { day_id: new Date("2024-04-06"), cust_id: 510, movie_id: 1001, genre_id: 1, app: "mobile", device: "phone", os: "Android", payment_method: "google_pay", list_price: 3.99, discount_type: null, discount_percent: 0, actual_price: 3.99 },
  { day_id: new Date("2024-04-07"), cust_id: 515, movie_id: 1018, genre_id: 2, app: "tv", device: "smart_tv", os: "Roku", payment_method: "credit_card", list_price: 1.99, discount_type: null, discount_percent: 0, actual_price: 1.99 },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    const db = client.db(DB_NAME);

    // Drop existing collections
    for (const col of ["genres", "movies", "customers", "interactions"]) {
      await db.collection(col).drop().catch(() => {});
      console.log(`🗑  Dropped collection: ${col}`);
    }

    // Insert
    await db.collection("genres").insertMany(genres);
    console.log(`🎭 Inserted ${genres.length} genres`);

    await db.collection("movies").insertMany(movies);
    console.log(`🎬 Inserted ${movies.length} movies`);

    await db.collection("customers").insertMany(customers);
    console.log(`👤 Inserted ${customers.length} customers`);

    await db.collection("interactions").insertMany(interactions);
    console.log(`📊 Inserted ${interactions.length} interactions`);

    // Indexes
    await db.collection("movies").createIndex({ movie_id: 1 }, { unique: true });
    await db.collection("movies").createIndex({ "genres.genre_id": 1 });
    await db.collection("movies").createIndex({ title: "text" });
    await db.collection("customers").createIndex({ cust_id: 1 }, { unique: true });
    await db.collection("customers").createIndex({ email: 1 }, { unique: true });
    await db.collection("genres").createIndex({ genre_id: 1 }, { unique: true });
    await db.collection("interactions").createIndex({ cust_id: 1 });
    await db.collection("interactions").createIndex({ movie_id: 1 });
    console.log("📑 Indexes created");

    console.log("\n🎉 Seed complete! Database: moviestream");
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
