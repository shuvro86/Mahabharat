// 50 Epic Mahabharat Characters with detailed biographies, avatars, and high-quality artwork images

export interface CharacterSeedItem {
  name: string;
  alliance: string;
  role: string;
  description: string;
  keyAttributes: string[];
  weapons: string[];
  avatar: string;
  image: string;
}

const rawSeedCharacterData: CharacterSeedItem[] = [
  {
    name: "Arjuna",
    alliance: "Pandavas",
    role: "The Peerless Archer Prince",
    description: "The third Pandava prince, son of Kunti and King Indra. Known as Savyasachi (ambidextrous archer), Phalguna, and Dhananjaya. He is Lord Krishna's close friend and the direct recipient of the divine Bhagavad Gita on the field of Kurukshetra. Possesses the celestial bow Gandiva and vanquished legendary commanders across the 18 days of epic war.",
    keyAttributes: ["Focused attention", "Chivalrous", "Dharmic seeker", "Ambidextrous mastery"],
    weapons: ["Gandiva Bow", "Pashupatastra", "Varunastra", "Agneyastra"],
    avatar: "🏹",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Krishna",
    alliance: "Divine (Yadavas)",
    role: "The Supreme Cosmic Guide",
    description: "King of Dwarka and eighth avatar of Lord Vishnu. Serving as Arjuna's unarmed charioteer (Parthasarathi), He provided supreme strategic intellect to the Pandavas, revealed the cosmic truths of the Bhagavad Gita, and unveiled His terrifying Vishvarupa (Universal Form).",
    keyAttributes: ["Omniscient", "Strategic Mastermind", "Cosmic Playfulness", "Absolute Refuge"],
    weapons: ["Sudarshana Chakra", "Kaumodaki Mace", "Nandaka Sword", "Panchajanya Conch"],
    avatar: "🦚",
    image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Karna",
    alliance: "Kauravas",
    role: "The Generous Tragic Sun-Son",
    description: "Eldest son of Kunti, born of Surya (the Sun-god) before her marriage. Gifted at birth with impenetrable golden armor (Kavacha) and divine earrings (Kundala). Rejected due to chariot-caste upbringing, he became King of Anga, a titan of unmatched generosity (Dana-veera), and Duryodhana's ultimate loyal warrior.",
    keyAttributes: ["Infinite Generosity (Dana-veera)", "Unwavering Loyalty", "Fierce Pride", "Invincible Archery"],
    weapons: ["Vijaya Bow", "Vasavi Shakti", "Brahmastra", "Bhargavastra"],
    avatar: "☀️",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bhishma",
    alliance: "Kauravas (Grand Patriarch)",
    role: "The Grand Patriarch of Kurus",
    description: "Originally named Devavrata, son of Shantanu and Goddess Ganga. Took a terrifying vow of lifelong celibacy and absolute allegiance to Hastinapur. Gifted with Iccha-mrityu (boon of choosing his own moment of death), he commanded the Kaurava armies for the first 10 days of war.",
    keyAttributes: ["Terrible vow keeper", "Invincible patriarch", "Profound wisdom", "Iccha-mrityu boon"],
    weapons: ["Celestial Bow", "Praswapana Astra", "Grand Spear"],
    avatar: "🛡️",
    image: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Yudhishthira",
    alliance: "Pandavas",
    role: "The King of Righteousness (Dharmaraja)",
    description: "The eldest Pandava brother, born to Kunti by Yama (Dharmaraja, the god of cosmic justice). Known across the three worlds for absolute truthfulness, moral fortitude, and composure. Led the Pandavas through 13 years of exile and war, eventually ascending to heaven in his mortal body.",
    keyAttributes: ["Uncompromised Truthfulness", "Patience", "Impartiality", "Equanimity"],
    weapons: ["Spear of Truth", "Heavy Mace", "Divine Bow"],
    avatar: "⚖️",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bheema",
    alliance: "Pandavas",
    role: "The Mighty Mace Colossus (Vrikodara)",
    description: "Second Pandava prince, son of Kunti and Vayu (the wind god). Possessed the strength of ten thousand elephants, an insatiable appetite, and terrifying mace prowess. Swore and fulfilled sacred oaths to slay all hundred Kaurava brothers, smash Duryodhana's thighs, and avenge Draupadi.",
    keyAttributes: ["Gigantic Strength", "Insatiable Appetite", "Fierce Vow Keeper", "Protector of Family"],
    weapons: ["Heavy Iron Mace (Gada)", "Thunderous Fists", "Battle Axe"],
    avatar: "💪",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Nakula",
    alliance: "Pandavas",
    role: "Master of Horsemanship & Swordplay",
    description: "Fourth Pandava, twin brother of Sahadeva, born to Madri via the Ashwini Kumaras (physician gods). Renowned as the most handsome prince of his era, an incomparable master of equestrian tactics, sword combat, and veterinary science.",
    keyAttributes: ["Peerless Sword Master", "Equine Expertise", "Chivalric Elegance", "Medicinal Knowledge"],
    weapons: ["Twin Curved Swords", "Ashtasiddhi Bow", "Shield"],
    avatar: "⚔️",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Sahadeva",
    alliance: "Pandavas",
    role: "Master Astrologer & Strategist",
    description: "Youngest Pandava twin born to Madri via the Ashwini Kumaras. Possessed profound astrological foresight and wisdom. Knew the outcome of the Kurukshetra war in advance but was bound by a sacred vow to speak only when asked. Slew Shakuni on the 18th day of war.",
    keyAttributes: ["Astrological Foresight", "Silent Wisdom", "Master Swordsman", "Absolute Duty"],
    weapons: ["Sword & Shield", "Spear", "Celestial Bow"],
    avatar: "🔮",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Draupadi",
    alliance: "Pandavas (Fire-Born)",
    role: "Fiery Princess of Panchala & Queen",
    description: "Emerged fully grown from the sacred sacrificial fire (Yajna) of King Drupada. Common queen of the five Pandavas whose public humiliation in the Hastinapur assembly hall served as the core moral catalyst that doomed the Kaurava dynasty. A heroine of majestic dignity and unbending resolve.",
    keyAttributes: ["Fiery Resolve", "Sacred Devotion", "Uncompromising Integrity", "Resolute Memory"],
    weapons: ["Words of Cosmic Truth", "Divine Aura of Chastity"],
    avatar: "🔥",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Duryodhana",
    alliance: "Kauravas",
    role: "Crown Prince of Hastinapur",
    description: "Eldest of the hundred Kaurava brothers, son of Dhritarashtra and Gandhari. Master mace-fighter trained by Balarama. Driven by intense jealousy, imperial ambition, and unyielding conviction in his sovereign right to Hastinapur, leading his clan into total war.",
    keyAttributes: ["Ambitious Imperial Pride", "Mace-Fighting Master", "Unyielding Will", "Generous Friend to Karna"],
    weapons: ["Adamantine Iron Mace", "Heavy Shield"],
    avatar: "⚒️",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dushasana",
    alliance: "Kauravas",
    role: "Second Kaurava Prince & Executioner",
    description: "Second son of Dhritarashtra and loyal lieutenant to Duryodhana. Infamously dragged Draupadi into the Hastinapur royal court by her hair. Met his violent end on the 16th day of war against Bheema in fulfillment of Bheema's sacred vow.",
    keyAttributes: ["Ruthless Executioner", "Blind Loyalty to Duryodhana", "Aggressive Warrior"],
    weapons: ["Heavy Mace", "Scimitar", "War Bow"],
    avatar: "🩸",
    image: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Gandhari",
    alliance: "Kauravas (Queen Mother)",
    role: "The Blindfolded Ascetic Queen",
    description: "Princess of Gandhara and blindfolded queen mother of Hastinapur. Voluntarily blindfolded herself for life upon marrying the blind King Dhritarashtra. Accumulated immense spiritual tapas (ascetic heat) through decades of self-restraint.",
    keyAttributes: ["Voluntary Blindness", "Immense Spiritual Tapas", "Righteous Moral Counsel", "Maternal Sorrow"],
    weapons: ["Gaze of Spiritual Power", "Maternal Blessing"],
    avatar: "👁️‍🗨️",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dhritarashtra",
    alliance: "Kauravas",
    role: "Blind Sovereign King of Hastinapur",
    description: "Eldest Kuru prince born blind. Father of the hundred Kauravas. Though possessing colossal physical strength capable of crushing iron statues, his emotional blindness and tragic favoritism toward Duryodhana undermined justice and facilitated kingdom collapse.",
    keyAttributes: ["Physical Blindness", "Tragic Paternal Attachment", "Iron Grip Strength"],
    weapons: ["Crushing Embrace", "Iron Statue Shatterer"],
    avatar: "👑",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kunti",
    alliance: "Pandavas (Matriarch)",
    role: "Resilient Matriarch of the Pandavas",
    description: "Princess of Yadavas, adoptive daughter of King Kuntibhoja, and mother of Karna and the three elder Pandavas. Blessed in youth by Sage Durvasa with a divine invocation mantra. Kept Karna's birth secret to preserve societal honor, enduring lifelong silent sacrifice.",
    keyAttributes: ["Resilient Endurance", "Maternal Fortitude", "Divine Mantra Secret", "Dharmic Wisdom"],
    weapons: ["Durvasa Invocational Mantras", "Maternal Blessings"],
    avatar: "🌸",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Drona",
    alliance: "Kauravas (Royal Preceptor)",
    role: "The Master of Royal Martial Arts",
    description: "Brahmin sage and master instructor who trained both Pandava and Kaurava princes in archery, astras, and military strategy. Born in a pitcher (Drona), he commanded unmatched celestial weaponry. Served as Kaurava Commander-in-Chief after Bhishma's fall.",
    keyAttributes: ["Supreme Military Educator", "Master of All Astras", "Complex Devotion to Duty", "Tragic Paternal Weakness"],
    weapons: ["Brahmashira Astra", "Brahmastra", "Celestial Bow"],
    avatar: "📜",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ashwatthama",
    alliance: "Kauravas",
    role: "The Immortal Vengeful Warrior",
    description: "Formidable son of Drona born with a divine forehead gem (Mani) protecting him from hunger, disease, and weapon attacks. One of the Chiranjivis (immortals). Consumed by vengeful rage over his father's death, he executed a nocturnal raid on the Pandava camp and was cursed by Krishna.",
    keyAttributes: ["Forehead Gem Protection", "Unbridled Fierce Valour", "Chiranjivi Immortality", "Cosmic Wrath"],
    weapons: ["Brahmashira Astra", "Divine Sword", "Narayanastra"],
    avatar: "💎",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Shakuni",
    alliance: "Kauravas",
    role: "King of Gandhara & Master Strategist",
    description: "Brother of Queen Gandhari and maternal uncle to Duryodhana. Master strategist who orchestrated the fateful game of dice using loaded dice carved from his father's bones. Driven by hidden revenge against the Kuru royal house for past imprisonment.",
    keyAttributes: ["Psychological Genius", "Loaded Dice Mastery", "Vengeful Patience", "Unflinching Cunning"],
    weapons: ["Loaded Ivory Dice", "Intrigues & Schemes", "Dagger"],
    avatar: "🎲",
    image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Vyasa",
    alliance: "Neutral (Divine Sage)",
    role: "The Eternal Chronicler & Compiler",
    description: "Revered immortal sage who compiled the four Vedas, 18 Puranas, and composed the Mahabharat epic itself. Grandfather to both Pandavas and Kauravas via Niyoga. Granted Sanjaya divine vision to report the war to Dhritarashtra.",
    keyAttributes: ["Omniscient Compiler", "Spiritual Radiance", "Absolute Detachment", "Cosmic Vision"],
    weapons: ["Pen of Truth", "Divya-Drishti Blessing", "Prophetic Words"],
    avatar: "✍️",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Abhimanyu",
    alliance: "Pandavas (Young Warrior)",
    role: "The Hero of the Chakravyuha",
    description: "Heroic son of Arjuna and Subhadra (Krishna's sister). Learned the secret of breaching the Chakravyuha formation while in his mother's womb. At age sixteen, he single-handedly breached Drona's formation and fought seven Kaurava maharathis simultaneously before his heroic death.",
    keyAttributes: ["Precocious Heroism", "Fearless Valour", "Mastery of Archery", "Eternal Legacy of Courage"],
    weapons: ["Raudra Bow", "Chariot Wheel (improvised)", "Sword & Shield"],
    avatar: "⚙️",
    image: "https://images.unsplash.com/photo-1544924405-b174b1e98d90?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ghatotkacha",
    alliance: "Pandavas (Demonic Ally)",
    role: "Mighty Rakshasa Prince",
    description: "Son of Bheema and the Rakshasi Hidimbi. Possessed colossal shape-shifting powers, flight, and magical illusions (Maya). Fought fiercely for the Pandavas at night, forcing Karna to expend his divine Vasavi Shakti dart reserved for Arjuna.",
    keyAttributes: ["Illusionary Warfare (Maya)", "Colossal Size Alteration", "Filial Devotion", "Night Combat Supremacy"],
    weapons: ["Spiked Iron Club", "Meteorite Bow", "Rakshasa Illusion Magic"],
    avatar: "👹",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Iravan",
    alliance: "Pandavas (Naga Ally)",
    role: "Heroic Naga Prince",
    description: "Son of Arjuna and the Naga princess Ulupi. Master of Naga illusionary magic and aquatic combat. Sacrificed himself selflessly prior to the battle of Kurukshetra to guarantee Pandava victory, revered widely as a deity in South Indian traditions (Koothandavar).",
    keyAttributes: ["Naga Magic", "Selfless Sacrifice", "Heroic Combat", "Devotion to Victory"],
    weapons: ["Naga Spear", "Curved Scimitar", "Illusionary Serpent Forms"],
    avatar: "🐍",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Subhadra",
    alliance: "Divine (Yadavas)",
    role: "Yadava Princess & Mother of Abhimanyu",
    description: "Sister of Krishna and Balarama, wife of Arjuna, and mother of Abhimanyu. A personification of grace, sweetness, and emotional fortitude who anchored the Pandava family lineage through her grandson Parikshit.",
    keyAttributes: ["Graceful Bearing", "Devotion", "Lineage Anchor", "Yadava Royalty"],
    weapons: ["Charitable Grace", "Royal Status"],
    avatar: "🕊️",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Balarama",
    alliance: "Neutral (Yadavas)",
    role: "Lord of the Plough & Master of Mace",
    description: "Elder brother of Lord Krishna, avatar of Sheshanaga. Guru of both Bheema and Duryodhana in mace warfare. Maintaining strict neutrality in the Kurukshetra war, he embarked on a pilgrimage along the Saraswati river, returning to witness the final mace duel.",
    keyAttributes: ["Immense Physical Might", "Master Mace Instructor", "Strict Neutrality", "Unbending Integrity"],
    weapons: ["Divine Plough (Hala)", "Heavy Mace (Gada)", "Musala Club"],
    avatar: "🌾",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Satyaki (Yuyudhana)",
    alliance: "Pandavas (Yadavas)",
    role: "Chief Commander of Vrishni Forces",
    description: "Fierce Yadava warrior, disciple of Arjuna in archery, and devoted ally of Lord Krishna. Commanded a division of the Pandava army, slaying numerous Kaurava generals including Bhurisravas during intense battle.",
    keyAttributes: ["Unflinching Devotion to Krishna", "Exceptional Archer", "Relentless Battle Drive"],
    weapons: ["Celestial Bow", "Scimitar", "Chariot Warfare Weapons"],
    avatar: "🏹",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kripacharya",
    alliance: "Kauravas",
    role: "Immortal Preceptor of Hastinapur",
    description: "Brother-in-law of Drona and royal guru of the Kuru court. Born miraculously in reeds, he is one of the seven Chiranjivis (immortals). Fought for the Kauravas out of loyalty to Hastinapur and survived the war to mentor Parikshit.",
    keyAttributes: ["Impartial Educator", "Chiranjivi Immortality", "Strict Adherence to Duty", "Compassionate Heart"],
    weapons: ["Divine Bow", "Astras", "Sacred Sword"],
    avatar: "📜",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Vidura",
    alliance: "Neutral (Royal Minister)",
    role: "Prime Minister of Righteous Counsel",
    description: "Half-brother of Dhritarashtra and Pandu, born to a palace maid via Sage Vyasa. Incarnation of Lord Dharma (Yama) cursed to earthly birth. Prime Minister of Hastinapur whose counsel (Vidura Niti) stands as a monument of ethical governance.",
    keyAttributes: ["Incarnation of Dharma", "Flawless Ethical Counsel", "Unbiased Wisdom", "Protector of Innocents"],
    weapons: ["Vidura Niti (Wisdom)", "Bow of Dharma"],
    avatar: "🏛️",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Sanjaya",
    alliance: "Neutral",
    role: "Visionary Charioteer & Narrator",
    description: "Charioteer and advisor to King Dhritarashtra. Blessed by Sage Vyasa with divine vision (Divya-drishti) enabling him to view events across distant battlefields in real time. Narrated the entirety of the Bhagavad Gita and Kurukshetra war with absolute honesty.",
    keyAttributes: ["Divya-drishti Vision", "Unfiltered Truthfulness", "Devoted Counselor"],
    weapons: ["Divine Vision", "Truthful Speech"],
    avatar: "👁️",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dhrishtadyumna",
    alliance: "Pandavas (Fire-Born)",
    role: "Commander-in-Chief of Pandava Army",
    description: "Fire-born brother of Draupadi who emerged from King Drupada's sacrificial fire destined to slay Drona. Served as the Supreme Commander (Senapati) of the 7 Akshauhinis of the Pandava army, fulfilling his destiny on the 15th day of war.",
    keyAttributes: ["Fire-Born Destiny", "Strategic Command", "Unbending Fortitude"],
    weapons: ["Divine Sword", "War Bow", "Spear"],
    avatar: "🔥",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Shikhandi",
    alliance: "Pandavas",
    role: "Reincarnation of Amba & Key to Victory",
    description: "Born as a princess of Panchala and later transforming into a male warrior. Reincarnation of Princess Amba, who undertook extreme penance to avenge her honor against Bhishma. Stood before Arjuna's chariot, causing Bhishma to lower his bow.",
    keyAttributes: ["Reincarnated Vengeance", "Determined Resolve", "Catalyst of Destiny"],
    weapons: ["Bow and Arrow", "Scimitar", "Chariot Warfare"],
    avatar: "🏹",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ekalavya",
    alliance: "Neutral (Master Archer)",
    role: "Legendary Nishada Archer",
    description: "Prince of the Nishada tribe who achieved archery mastery by practicing before a clay statue of Drona. When asked for Guru Dakshina, he unhesitatingly severed his right thumb, embodying the supreme apex of devotion and self-sacrifice.",
    keyAttributes: ["Unmatched Self-Taught Archery", "Ultimate Guru Devotion", "Quiet Dignity"],
    weapons: ["Custom Bow", "Four-Finger Archery Technique"],
    avatar: "🎯",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Barbarika (Khatu Shyam)",
    alliance: "Neutral (Mystic Warrior)",
    role: "Invincible Prince with Three Arrows",
    description: "Grandson of Bheema and son of Ghatotkacha. Blessed by Goddess Kamakhya with three infallible arrows (Teen Baan) capable of ending the entire war in seconds. Sacrificed his head to Lord Krishna to maintain cosmic balance, watching the war from a hilltop.",
    keyAttributes: ["Three Infallible Arrows", "Absolute Devotion", "Universal Sacrifice"],
    weapons: ["Teen Baan (Three Cosmic Arrows)", "Divine Bow"],
    avatar: "🏹",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Shalya",
    alliance: "Kauravas",
    role: "King of Madra & Charioteer of Karna",
    description: "Ruler of Madra kingdom and maternal uncle to Nakula and Sahadeva. Tricked into fighting for Duryodhana by grand hospitality. Served as Karna's charioteer, subtly demoralizing him, and commanded the Kaurava forces on the final 18th day.",
    keyAttributes: ["Supreme Chariot Mastery", "Mace & Spear Expert", "Complex Loyalty"],
    weapons: ["Heavy Battle Spear", "Mace", "War Bow"],
    avatar: "🛡️",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Jarasandha",
    alliance: "Kauravas (Enemy of Krishna)",
    role: "Formidable Ruler of Magadha",
    description: "Mighty king of Magadha born in two halves joined by the demoness Jara. Imprisoned 86 kings to sacrifice to Lord Shiva. Challenged by Bheema in a duel of 27 days, eventually defeated when Bheema tore his body in two and threw the halves in opposite directions.",
    keyAttributes: ["Rejoined Body Invulnerability", "Colossal Wrestling Strength", "Imperial Ambition"],
    weapons: ["Wrestling Fists", "Heavy Iron Mace"],
    avatar: "🥊",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Yuyutsu",
    alliance: "Pandavas",
    role: "The Righteous Kaurava Prince",
    description: "Son of Dhritarashtra by a Vaishya maid (Sughada). The only son of Dhritarashtra who openly spoke against the assembly hall injustice and defected to Yudhishthira's side before the first arrow was shot. Survived to become administrator of Hastinapur.",
    keyAttributes: ["Moral Courage", "Defection to Dharma", "Administrative Integrity"],
    weapons: ["Bow and Arrow", "Sword & Shield"],
    avatar: "⚖️",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kuntibhoja",
    alliance: "Pandavas",
    role: "King of Kunti Kingdom",
    description: "Ruler of the Kunti kingdom and adoptive father of Queen Kunti. Provided major military divisions to the Pandava army during the Kurukshetra war and fought valiantly on the frontlines against Kuru maharathis.",
    keyAttributes: ["Paternal Patronage", "Vrishni Loyalty", "Valiant Commander"],
    weapons: ["Battle Spear", "War Bow"],
    avatar: "🛡️",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Virata",
    alliance: "Pandavas",
    role: "King of Matsya Kingdom",
    description: "Ruler of Matsya where the Pandavas spent their 13th year of exile in disguise (Agyatavas). Provided his entire military force to the Pandava alliance. Slain on the battlefields of Kurukshetra alongside his sons.",
    keyAttributes: ["Generous Host", "Royal Dignity", "Matsya Military Might"],
    weapons: ["Royal Bow", "Mace"],
    avatar: "👑",
    image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Uttara (Matsya Prince)",
    alliance: "Pandavas (Young Warrior)",
    role: "Prince of Matsya",
    description: "Son of King Virata who faced the Kaurava army during the cattle raid of Matsya, with Arjuna disguised as Brihannala serving as his charioteer. Fought heroically on Day 1 of the war before being slain by King Shalya.",
    keyAttributes: ["Initial Hesitation turned Bravery", "Youthful Spirit", "Loyalty"],
    weapons: ["War Bow", "Chariot Spear"],
    avatar: "⚔️",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Uttaraa (Matsya Princess)",
    alliance: "Pandavas",
    role: "Princess of Matsya & Mother of Parikshit",
    description: "Daughter of King Virata, trained in dance by Arjuna during exile. Married Abhimanyu and protected her unborn child (Parikshit) in her womb from Ashwatthama's Brahmashira weapon through Lord Krishna's divine intervention.",
    keyAttributes: ["Resilience under Tragedy", "Maternal Protection", "Devotion to Krishna"],
    weapons: ["Faith in Lord Krishna"],
    avatar: "🌸",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Parikshit",
    alliance: "Pandavas",
    role: "The Savior King of Kuru Dynasty",
    description: "Son of Abhimanyu and Uttaraa. Saved from death in the womb by Krishna's grace. Ascended the throne of Hastinapur after Yudhishthira, ruling justly during the dawn of Kali Yuga and listening to the Shreemad Bhagavatam from Sukadeva Gosvami.",
    keyAttributes: ["Righteous Ruler", "Divine Protection", "Preserver of Kuru Dynasty"],
    weapons: ["Royal Sword", "Dharmic Scepter"],
    avatar: "👑",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Janamejaya",
    alliance: "Pandavas",
    role: "King of Hastinapur & Host of Mahabharata",
    description: "Son of King Parikshit. Conducted the grand Sarpa Satra (snake sacrifice) to avenge his father's death by the serpent Takshaka. Listened to the complete recitation of the Mahabharata narrated by Sage Vaisampayana at the sacrifice.",
    keyAttributes: ["Filial Vengeance", "Patron of Sacred Epic Recitation", "Imperial Sovereign"],
    weapons: ["Sacrificial Fire Rituals", "Imperial Bow"],
    avatar: "📜",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Kichaka",
    alliance: "Neutral (Antagonist)",
    role: "Commander of Matsya Kingdom",
    description: "Powerful commander-in-chief of Matsya army and brother-in-law to King Virata. Harassed Draupadi during her disguise as Sairandhri in the 13th year of exile. Secretly met and slain by Bheema in the dark dance hall.",
    keyAttributes: ["Arrogant Physical Power", "Military Dictator of Matsya"],
    weapons: ["Heavy Mace", "Wrestling Might"],
    avatar: "💪",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Hidimbi",
    alliance: "Pandavas",
    role: "Rakshasi Queen & Mother of Ghatotkacha",
    description: "Sister of the demon Hidimba. Fell in love with Bheema and married him after he defeated her brother. Raised Ghatotkacha in the forest with noble dharmic virtues, instilling in him selfless sacrifice for the Pandavas.",
    keyAttributes: ["Noble Forest Heart", "Maternal Wisdom", "Shape-Shifting Magic"],
    weapons: ["Forest Illusion Magic"],
    avatar: "🌲",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ulupi",
    alliance: "Pandavas",
    role: "Naga Princess & Consort of Arjuna",
    description: "Naga princess who abducted Arjuna into the underwater realm of Nagaloka and married him. Mother of Iravan. Blessed Arjuna with immunity against water weapons and later revived him using the divine Sanjeevani gem during a clash with Babruvahana.",
    keyAttributes: ["Naga Mystic Knowledge", "Sanjeevani Gem Healing", "Devoted Consort"],
    weapons: ["Sanjeevani Mani (Revival Gem)", "Naga Mysticism"],
    avatar: "🐍",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Chitrangada (Manipura)",
    alliance: "Pandavas",
    role: "Warrior Princess of Manipura",
    description: "Daughter of King Chitravahana of Manipura. Raised as a male prince and skilled warrior. Married Arjuna during his pilgrimage, retaining her sovereign right to rule Manipura and raising their son Babruvahana as ruler.",
    keyAttributes: ["Warrior Princess", "Sovereign Administrator", "Independent Dignity"],
    weapons: ["Royal Sword", "Archery Bow"],
    avatar: "🏹",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Babruvahana",
    alliance: "Pandavas",
    role: "Ruler of Manipura",
    description: "Son of Arjuna and Chitrangada, ruler of Manipura. Unaware of his father's identity during the Ashvamedha Yajna horse tour, he challenged Arjuna in battle and struck him down, before reviving him with Ulupi's divine gem.",
    keyAttributes: ["Peerless Archery Valour", "Independent Sovereign", "Filial Devotion"],
    weapons: ["Divine Arrows", "Celestial Scimitar"],
    avatar: "🎯",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Jayadratha",
    alliance: "Kauravas",
    role: "King of Sindhu",
    description: "King of Sindhu and brother-in-law to Duryodhana (husband of Dushala). Granted a boon by Lord Shiva to hold back four Pandavas for one day, which resulted in Abhimanyu's isolation in the Chakravyuha. Slain by Arjuna before sunset.",
    keyAttributes: ["Shiva Boon Holder", "Key Obstacle in Chakravyuha", "Strategic Defense"],
    weapons: ["Shield of Shiva Boon", "War Bow", "Spear"],
    avatar: "🛡️",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Amba",
    alliance: "Neutral",
    role: "Princess of Kashi",
    description: "Eldest princess of Kashi abducted by Bhishma during her Swayamvara along with her sisters. Rejected by her suitor Salwa, she performed severe austerities to destroy Bhishma, eventually immolating herself to be reborn as Shikhandi.",
    keyAttributes: ["Unrelenting Vow of Vengeance", "Fierce Tapas", "Catalyst of Bhishma's Fall"],
    weapons: ["Ascetic Penance (Tapas)", "Sacred Vow"],
    avatar: "🔥",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Ambika & Ambalika",
    alliance: "Neutral (Kurus)",
    role: "Queens of Hastinapur",
    description: "Princesses of Kashi and widows of King Vichitravirya. Through the practice of Niyoga with Sage Vyasa, Ambika gave birth to Dhritarashtra (closing her eyes in fear) and Ambalika gave birth to Pandu (turning pale with anxiety).",
    keyAttributes: ["Ancestral Queens", "Matriarchs of Kuru Bloodlines"],
    weapons: ["Royal Matriarchal Dignity"],
    avatar: "👑",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Pandu",
    alliance: "Pandavas (Kurus)",
    role: "King of Hastinapur & Father of Pandavas",
    description: "Pale prince of Hastinapur and crowned King who expanded the Kuru empire through great military conquest. Accidentally cursed by Sage Kindama, leading him to renounce his kingdom for forest penance where his sons were born via divine invocation.",
    keyAttributes: ["Imperial Conquest Master", "Ascetic Penance", "Devoted Husband"],
    weapons: ["Imperial Bow", "Royal Mace"],
    avatar: "🏹",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Madri",
    alliance: "Pandavas",
    role: "Second Queen of Pandu",
    description: "Princess of Madra kingdom, second wife of King Pandu, and mother of the twin Pandavas Nakula and Sahadeva (invoked via Kunti's mantra). Showed profound maternal devotion by entrusting her twins to Kunti.",
    keyAttributes: ["Beauty & Devotion", "Entrustment of Twins", "Loyalty"],
    weapons: ["Maternal Trust & Grace"],
    avatar: "🌸",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
  }
];

export const seedCharacterData: CharacterSeedItem[] = rawSeedCharacterData.map(item => ({
  ...item,
  image: "/assets/characters/" + item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".jpg"
}));
