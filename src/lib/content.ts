// ---------------------------------------------------------------------------
// FOR SAMIYA 💕 — Central content file
// All text that appears in the experience lives here so it can be edited
// in one place without touching component code.
// ---------------------------------------------------------------------------

export const SITE = {
  name: "For Samiya 💕",
  tagline: "A Little Universe Made Just For You",
  creator: "Yousuf",
  description:
    "A little universe made just for you. A beautiful birthday surprise created with love.",
};

// SCREEN 01 — The Magical Welcome ------------------------------------------
export const WELCOME = {
  eyebrow: "A LITTLE SOMETHING FOR YOU",
  heading: "Hey, My Samiya...",
  // the heading is rendered in three parts so her name can carry the foil
  headingLead: "Hey, My",
  headingName: "Samiya",
  headingTail: "...",
  supporting:
    "I made a little universe just for you. Are you ready to discover it?",
  button: "Open Your Surprise",
  hint: "tap the envelope",
  // what the little card inside says
  cardTo: "For My Samiya",
  cardNote: "with all my love",
  cardSignature: "Yousuf",
};

// SCREEN 02 — The Grand Birthday Reveal ------------------------------------
export const REVEAL = {
  eyebrow: "THE WORLD IS CELEBRATING YOU",
  headingTop: "HAPPY BIRTHDAY, MY BEAUTIFUL",
  headingName: "SAMIYA",
  headingTail: "💖",
  supporting:
    "Some people make the world brighter just by being in it. And today, the world has another reason to celebrate.",
  cakePrompt:
    "Close your eyes, make a wish, and blow out your candles...",
  blowHint: "touch the cake to blow out the candles",
  micButton: "Enable Microphone",
  micListening: "Listening… blow when ready",
  micError:
    "Microphone unavailable — just tap a candle to blow it out instead 💕",
  blowAll: "Blow All Candles 💨",
  wishMessage: "May all your beautiful wishes come true, Samiya! ✨",
  continue: "Continue Your Surprise 💕",
};

// SCREEN 03 — A Letter From My Heart ---------------------------------------
export const LETTER = {
  heading: "A Few Words From My Heart",
  paragraphs: [
    "My Dearest Samiya,",
    "Happy Birthday, my love.",
    "I wish I could find words beautiful enough to explain how special you are to me. But somehow, every time I try, words feel too small.",
    "Today is your day, and I hope you receive all the happiness, peace, and beautiful moments your heart deserves.",
    "I want you to keep smiling, keep dreaming, and never forget how precious you are.",
    "You have a way of making ordinary moments feel unforgettable. And if there is one thing I wish for today, it is that life gives you countless reasons to smile.",
    "I may not be able to give you the entire world, but I promise to keep finding little ways to make your world more beautiful.",
    "Happy Birthday, my favourite person.",
    "With all my love,",
  ],
  signature: "Yousuf",
  continue: "There's More Waiting For You ✨",
};

// SCREEN 04 — A Bouquet For Her --------------------------------------------
export const BOUQUET = {
  eyebrow: "A BOUQUET, JUST FOR YOU",
  heading: "For The Girl Who Makes My World Beautiful",
  // The poem Yousuf wrote for Samiya — kept exactly as given.
  poem: [
    "Yun toh tumhare saath har mamooli din bhi khaas lagta hai,",
    "Par un khaas dinon mein aaj ka din sabse haseen lagta hai.",
    "Kyunki aaj hi ke din chaand sa ek chehra is duniya mein aaya tha,",
    "Jiske hone se meri har dua ko ek khoobsurat matlab mila tha.",
    "Aur tumhari khoobsurati ka kya hi kehna,",
    "Tumhe dekhoon toh bas dekhta hi rehna.",
    "Tumhari muskurahat mein ek alag sa sukoon hai,",
    "Jaise meri har khushi ka pata sirf tumse hi shuru hai.",
    "Tumhari aankhon mein ek alag si gehraai hai,",
    "Tumhari har ada mein jaise khuda ki likhi khoobsurati samaayi hai.",
    "Sach kahun toh chaand se tumhari misaal kya doon,",
    "Chaand ko bhi dekhoon toh tumhara khayal aata hai.",
  ],
  signature: "With love, Yousuf",
  button: "Accept These Flowers? 🌹",
  accepted: "Every petal says what my heart feels 🌹",
};

// SCREEN 05 — Our Little Memories -------------------------------------------
export const MEMORIES = {
  heading: "Little Moments, Beautiful Memories",
  emptyTitle: "Your beautiful moments will live here",
  emptyBody:
    "Add up to 10 photographs and they'll shine in their own little frames. They never leave this device — your memories stay yours.",
  addButton: "Add a Photograph",
  fullHint: "You've added all 10 frames — each one a little piece of forever 💕",
  captions: [
    "Your smile, my favourite view.",
    "Some moments deserve to stay forever.",
    "Every little memory means something.",
    "Beautiful memories, beautiful you.",
  ],
  continue: "There's Still More 💕",
};

// SCREEN 06 — Ten Notes, Each With Its Own Flower ---------------------------
// Five Roman Urdu notes, then five Banglish ones — kept exactly as written.
export const REASONS = {
  eyebrow: "PETAL BY PETAL",
  heading: "10 Little Things I Adore About You",
  hint: "touch the garden and a flower will bloom",
  counter: "flowers bloomed",
  items: [
    {
      lang: "Roman Urdu",
      flower: "rose",
      lines: [
        "Tumhari muskurahat mein kuch toh baat hai,",
        "Jo mere dil ko har roz tumse milne ki wajah deti hai.",
      ],
    },
    {
      lang: "Roman Urdu",
      flower: "jasmine",
      lines: [
        "Na chaand ki khwahish, na sitaaron ki talab hai,",
        "Mujhe toh bas tumhara saath chahiye, kyunki tum hi meri sabse khoobsurat talab ho.",
      ],
    },
    {
      lang: "Roman Urdu",
      flower: "tulip",
      lines: [
        "Tumse baat ho toh waqt tham sa jaata hai,",
        "Aur tum na ho toh har lamha kuch adhoora reh jaata hai.",
      ],
    },
    {
      lang: "Roman Urdu",
      flower: "lily",
      lines: [
        "Tumhari saadgi mein bhi kisi ghazal se kam nahi,",
        "Tum jaisi ho, waisi hi tumse behtar koi nahi.",
      ],
    },
    {
      lang: "Roman Urdu",
      flower: "gold",
      lines: [
        "Meri har dua mein sirf tumhara naam rehta hai,",
        "Tum na ho to jindazi main sab kuch adhura lagta hai.",
      ],
    },
    {
      lang: "Banglish",
      flower: "peony",
      lines: [
        "Tomar hashi dekhe amar moner shob klanti hariye jay,",
        "Mone hoy prithibir shob shukh jeno tomar majhei khuje pai.",
      ],
    },
    {
      lang: "Banglish",
      flower: "daisy",
      lines: [
        "Tumi pashe thakle shomoy tao Kemon jeno theme jay,",
        "Ar dure thakle protita muhurto tomakei khuje beray.",
      ],
    },
    {
      lang: "Banglish",
      flower: "camellia",
      lines: [
        "Tomar majhe emon kichu ache ja bhashay bujhano jay na,",
        "Shudhu etuku jani, tomake chara amar golpota shompurno hoy na.",
      ],
    },
    {
      lang: "Banglish",
      flower: "orchid",
      lines: [
        "Shoto manusher bhireo amar chokh sudhu tomakei khuje,",
        "Hoyto etakei bhalobasha bole, jokhon mon ekjonkei bujhe.",
      ],
    },
    {
      lang: "Banglish",
      flower: "blush-rose",
      lines: [
        "Tumi kono kobita naw, tobu tomake niye likhte ichhe kore,",
        "Tumi kono shopno naw, tobu tomakei dekhte icche kore.",
      ],
    },
  ],
  finale: "Ten flowers, ten notes — and still not enough words for you. ❤️",
  continue: "One Last Surprise Awaits 🌟",
};

// SCREEN 07 — The Final Birthday Surprise -----------------------------------
export const FINALE = {
  eyebrow: "ONE LAST THING",
  heading: "One Last Thing, My Samiya...",
  lines: [
    "Even if I could create a thousand beautiful websites, I would still choose to dedicate every single one of them to you.",
    "Because you deserve to feel special, not just today, but every day.",
    "I hope this new chapter of your life brings you endless happiness, beautiful memories, success and everything your heart wishes for.",
  ],
  grandHeading: "HAPPY BIRTHDAY, MY LOVE! ❤️",
  signatureLine: "Forever With Love,",
  signature: "Yousuf",
  replay: "Replay Our Little Story 💕",
};

export const SCREEN_TITLES = [
  "The Magical Welcome",
  "The Birthday Reveal",
  "A Letter From My Heart",
  "A Bouquet For Her",
  "Our Little Memories",
  "Why You Are Special",
  "The Final Surprise",
];
