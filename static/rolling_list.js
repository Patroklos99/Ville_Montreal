const restaurants = [
    "ELIE OR CAFE",
    "3 AMIGOS  RESTO/BAR",
    "9142-9563 QUEBEC INC. (NOUVEAU MAISON KAM)",
    "9160-2458 QUEBEC INC. (MC BAY RESTAURANT)",
    "A.M.R. FRUITERIE",
    "ADAMS GOURMET",
    "ALIMENTS EDUARDO",
    "AQUA LUNCH",
    "B & M",
    "BAGEL DE L'OUEST",
    "BAGEL EXPRESSIONS (BEAVER HALL)",
    "BEIJING NOUILLES EXPRESS",
    "BIONETTE",
    "BONANZA LALUMIERE",
    "BONIZZA PIZZERIA BONIZZA",
    "BOUCHER ALKHAIR",
    "BOUCHERIE ET GRILLADES SABRAH",
    "BOUCHERIE-CHARCUTERIE-FROMAGERIE FRUIT ET LEGUMES TAMBASCO",
    "BOUL.ET PATISSERIE SAN VINCENZO ENR.",
    "BOULANGERIE BAGELS ON GREENE",
    "BOULANGERIE BRUNO ET FRERES",
    "BOULANGERIE CASTEL",
    "BOULANGERIE DU GRAND MAGHREB",
    "BOULANGERIE DU SOLEIL D.D.O.",
    "BOULANGERIE ELMONT",
    "BOULANGERIE ET PATISSERIE FRIANDS 1",
    "BOULANGERIE KASCHER DE MONTREAL LTEE",
    "BOULANGERIE L'EPI D'OR",
    "BOULANGERIE LES CO'PAINS D'ABORD",
    "BOULANGERIE PATISSERIE C CHAUD",
    "BOULANGERIE PATISSERIE SERRIR",
    "BOULANGERIE SAMI",
    "BOULANGERIE SERAPHIN",
    "BOULANGERIE VAN HORNE BAGEL",
    "BRASSERIE LE COURTIER",
    "BUFFALO BILL #6",
    "BUFFET CHINOIS FU LAM",
    "BUFFET DA ENRICO",
    "BUFFET DELICE ORIENTAL",
    "BUFFET INDIENNE MAHARAJA",
    "BUFFET ORIENTAL",
    "CAFE 5 JUILLET",
    "CAFE DIZINGOFF",
    "CAFE DU SOLEIL",
    "CAFE LI WAH",
    "CAFE SUPREME",
    "CAFE TUNIS",
    "CALIFORNIA PIZZA",
    "CASSE-CROUTE DELICE ANTILLAIS",
    "CASSE-CROUTE MONT-CARMEL INC.",
    "CASSE-CROUTE PAM-PI-BON",
    "CAVALLARO",
    "CHARCUTERIE ABSOLUT PLUS",
    "CHEZ MILIE CASSE-CROUTE",
    "CINEMA MEGA PLEX MARCHE CENTRAL",
    "CLUB SANTE FIT FOR LIFE INC.",
    "CUISINE BANGKOK",
    "DELI PLUS RESTAURANT",
    "DELICES D'ORIENT",
    "DEPANNEUR ST-CUTHBERT",
    "DORVAL BAR + GRILL (LES ALIMENTS MEL GOURMET)",
    "EGGSPECTATION",
    "ENTREPRISE VIEUX MONTREAL POOL ROOM",
    "EPICERIE A LAM KEE",
    "EPICERIE MARCHE D'OR MJ INC.",
    "ESPOSITO",
    "ESTIATORIO LA PORTE GRECQUE",
    "EURO CACHERE",
    "EURO-MARCHE ST-MICHEL ENR.",
    "EXCEPTION 2 MK INC.",
    "FOLIE EN VRAC",
    "FRUITERIE LEGUMES ET EPICERIE AMERICA",
    "FRUITS MONKLAND",
    "GOLDEN STONE",
    "GOURMET D'ASIE",
    "HAMZA FRUITS",
    "HAPPY LAMB HOT POT",
    "JARDIN TIKI INC.",
    "KOSMOS SNACK BAR (COSMO)",
    "KYOTO SUSHI BAR-GRILLADES",
    "L'ESCALIER SHIMSHA",
    "L'EUROMARCHE LATINA (1980)",
    "LA BELLE PROVINCE DECARIE",
    "LA BELLE PROVINCE L'AUTHENTIQUE",
    "LA BELLE PROVINCE",
    "LA BELLE VIETNAMIENNE PLUS",
    "LA CAVERNE GRECQUE",
    "LA GROTTE DES FROMAGES",
    "LA MAISON DU KEBAB",
    "LA MAISON GRECQUE",
    "LA STREGA DU VILLAGE",
    "LAITUE & GO",
    "LE BALADI",
    "LE BISTRO GOURMET",
    "LE CARILLON TROPICAL",
    "LE CLAFOUTI",
    "LE COMME CHEZ SOI INC.",
    "LE JARDIN DE LIN CHING",
    "LE MANDARIN",
    "LE MARCHE HAITIEN",
    "LE MUFFINS PLUS",
    "LE RESTAURANT MARVEN",
    "LE ROI DU TACO",
    "LES ALIMENTS ARES",
    "LES ALIMENTS KIM PHAT (GOYER)",
    "LES ALIMENTS WAH HOA",
    "LES GRILLADES JARRY EXPRESS",
    "LES VIANDES MAMMOLA",
    "LUNA PIZZERIA",
    "MAGIC IDEA (RESTAURANT)",
    "MARCHE AL MIZAN",
    "MARCHE AL-HAAJ",
    "MARCHE B.K.",
    "MARCHE BADRE",
    "MARCHE BLAIR",
    "MARCHE CARNAVAL DES ANTILLES",
    "MARCHE CHOLAN",
    "MARCHE CORDOBA",
    "MARCHE D'AFRIQUE",
    "MARCHE GLORIE",
    "MARCHE JAFFNA FRUITS",
    "MARCHE JOLEE",
    "MARCHE KIM HOUR",
    "MARCHE KIM PO",
    "MARCHE KUSHIYARA",
    "MARCHE LES BEAUX TEMPS",
    "MARCHE MACCA",
    "MARCHE SIX JOURS",
    "MARCHE SWADESH",
    "MARCHE VICTORIA ORIENTAL MONTREAL ENR.",
    "MARCHE YASMINE ET FRERES INC.",
    "MCKIBBIN'S IRISH PUB",
    "MONSIEUR PATATES FRITES( ROYAL POULET FRIT ET PIZZA)",
    "NEW DYNASTY RESTAURANT",
    "NIGIRI SUSHI (CATHEDRALE)",
    "NOUILLES ETC",
    "NOUVEAU DICKSON POULET",
    "O.-C.-N. IMPORT",
    "PATISSERIE BOULANGERIE CAFE VINH HING",
    "PATISSERIE DE LA GARE",
    "PATISSERIE INTERNATIONALE",
    "PATISSERIE L'IRREDUCTIBLE",
    "PATISSERIE MAHROUSE",
    "PATISSERIE MAISON MOTTAS",
    "PATISSERIE ROCOCO",
    "PAVILLON WONG INC.",
    "PETRO CANADA #13388",
    "PIZZA DE EXPRESSO",
    "PIZZA DELI NIKOS",
    "PIZZA FOREST",
    "PIZZA MC GILL",
    "PIZZA MIA",
    "PIZZA NEW YORK",
    "PIZZA PINO",
    "PIZZA PITA",
    "PLANETE-PAIN",
    "POISSONNERIE GIDNEY'S LOBSTER",
    "PUSHAP",
    "REAL BAGEL",
    "RESTAURANT 414",
    "RESTAURANT A LA FINE POINTE",
    "RESTAURANT A QUINTA",
    "RESTAURANT AL IMAN",
    "RESTAURANT ALLO INDE",
    "RESTAURANT AMIR",
    "RESTAURANT ASA",
    "RESTAURANT AU BON GOUT THAI",
    "RESTAURANT BAR FASTE FOU",
    "RESTAURANT BARBIE'S",
    "RESTAURANT BASHA 08 INC.",
    "RESTAURANT BEIJING INC.",
    "RESTAURANT BLANCHE NEIGE",
    "RESTAURANT BUFFET LA STANZA",
    "RESTAURANT CALLIA",
    "RESTAURANT CASTEL",
    "RESTAURANT CHAN",
    "RESTAURANT CHATEAU KABAB",
    "RESTAURANT CHEZ DANG",
    "RESTAURANT CHEZ ENNIO",
    "RESTAURANT CHEZ LIEN PLUS",
    "RESTAURANT CHEZ MAMIE",
    "RESTAURANT CHUAN XIANG QING",
    "RESTAURANT CINQ EPICES",
    "RESTAURANT CUISINE CANTONAISE",
    "RESTAURANT DIVINO",
    "RESTAURANT EGGCETERA",
    "RESTAURANT EL COMAL",
    "RESTAURANT ETOILE DE MER",
    "RESTAURANT ETOILES DES INDES ENR.",
    "RESTAURANT FAY WONG",
    "RESTAURANT FIORE",
    "RESTAURANT FUNG SHING",
    "RESTAURANT HOAI HUONG",
    "RESTAURANT JADE QUARTIER CHINOIS",
    "RESTAURANT JAPONAIS ODAKI",
    "RESTAURANT JOJO PIZZERIA",
    "RESTAURANT JONAS",
    "RESTAURANT KALOHIN",
    "RESTAURANT KAM-DO",
    "RESTAURANT KAZU",
    "RESTAURANT LA BELLE PROVINCE",
    "RESTAURANT LA CARRETA",
    "RESTAURANT LA ESTACION",
    "RESTAURANT LA MAISON CHUNG MEI",
    "RESTAURANT LA MER JAUNE",
    "RESTAURANT LA PERLE BLEUE",
    "RESTAURANT LA PORTE ORIENTALE",
    "RESTAURANT LA ROULOTTE",
    "RESTAURANT LAHORE KARAHI",
    "RESTAURANT LE JARRY 2006 INC.",
    "RESTAURANT LUN HONG",
    "RESTAURANT MAISON SHING DO",
    "RESTAURANT MIKE'S",
    "RESTAURANT MIRASOL",
    "RESTAURANT NGUN SHING",
    "RESTAURANT NHU Y",
    "RESTAURANT NIU KEE",
    "RESTAURANT NOUR",
    "RESTAURANT O'CANTINHO",
    "RESTAURANT PACINI",
    "RESTAURANT PALAIS IMPERIAL",
    "RESTAURANT PHAYATHAI",
    "RESTAURANT PHO BAC INC.",
    "RESTAURANT PHO BANG NEW YORK",
    "RESTAURANT PHO HIN",
    "RESTAURANT PHO NGUYEN",
    "RESTAURANT PHO THAO NGUYEN",
    "RESTAURANT PHO-MAISONNEUVE",
    "RESTAURANT PIZZA TIME",
    "RESTAURANT PLACE ROMAINE",
    "RESTAURANT PLACE THIMENS",
    "RESTAURANT PUSHAP",
    "RESTAURANT QUEEN MARY",
    "RESTAURANT RIO",
    "RESTAURANT RIZ ET NOUILLES",
    "RESTAURANT RUBIS ROUGE",
    "RESTAURANT SADY'S",
    "RESTAURANT SAIGON VIP",
    "RESTAURANT SAIGON",
    "RESTAURANT SAMIRAMISS",
    "RESTAURANT SHISH TAOUK EXPRESS",
    "RESTAURANT SORGHO ROUGE",
    "RESTAURANT TANDOORI BELLEVUE",
    "RESTAURANT TIKKA II (CASE POSTALE 786)",
    "RESTAURANT TOMBOUCTOU",
    "RESTAURANT TONG POR",
    "RESTAURANT TOPAZE DE LACHINE",
    "RESTAURANT VIP 2010",
    "RESTAURANT WAH DO",
    "RESTAURANT YOY CAFE ET SUSHI BAR",
    "RESTAURANT ZHENGQINGQIAO",
    "RESTO FLAP FLAP",
    "ROCKLAND SOUVLAKI ATHEMAN",
    "ROTISSERIE ROMADOS",
    "S.T.R. VIANDES EN GROS",
    "SAMI FRUITS",
    "SANDWICH VIETNAMIEN HOANG OANH",
    "SHAWARMA  EXPRESS",
    "SOLEIL DE SAIGON",
    "SOLLY THE BAKER",
    "SOUPE BOL",
    "SUBWAY",
    "SUCRERIE SHAHLIMAR",
    "SUPER MARCHE B.K.",
    "SUPER MARCHE S.P.S.",
    "SUPERMARCHE P.A.",
    "TACO BRAVO",
    "TACO SUPREME",
    "TAI EXPRESS VILLA MADINA",
    "TAI NATURE RESTAURANT",
    "TAVERNE CAPRI",
    "TERIYAKI À LA JAPONAISE",
    "THAI AND PHO",
    "THAI JAPON",
    "TIKI MING",
    "TIKI-MING",
    "TIM HORTONS",
    "TOMATO LA BOITE A PIZZA",
    "TRAITEUR TRADITION MK",
    "TUTTI FRUTTI DEJEUNERS  (SAINT-LAURENT)",
    "VANELLI'S",
    "VEGGIERAMA (CULTURES)",
    "VICROSSANO",
    "VIE & NAM",
    "WINGS BUFFALO BILL",
    "WOK CAFE",
    "ZUSHI",
];

const restList = document.getElementById("restaurant-list");

restaurants.forEach((restaurant) => {
    debugger
    const option = document.createElement("option");
    option.value = restaurant;
    option.textContent = restaurant;
    restList.appendChild(option);
});


