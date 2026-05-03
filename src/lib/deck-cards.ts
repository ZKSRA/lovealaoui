export type DeckCharacter = "Mochi" | "Mallow" | "Mochi & Mallow";

export interface DeckCard {
  id: number;
  mode: string;
  character: DeckCharacter;
  question: string;
  followUp: string;
  closingAction: string;
}

const modes = [
  "Gentle start",
  "Date night",
  "Weekly check-in",
  "Reset",
  "Future us",
  "Playful spark",
  "Long distance",
  "Repair",
  "Appreciation",
  "Everyday closeness",
  "Deep cut",
  "Tiny promise",
];

const questions = [
  [
    "What helped you feel most cared for by me this week?",
    "What made today feel a little easier because we were in it together?",
    "Where did you feel me trying, even if it was small?",
    "What is one thing you want more of from us this week?",
    "What part of our relationship has felt soft lately?",
    "When did you feel most like we were on the same team?",
    "What is one ordinary moment with me that stayed with you?",
    "What do you want me to understand about your week?",
    "Where could I make life feel lighter for you right now?",
    "What would feel good to hear from me more often?",
  ],
  [
    "What is one question you wish I asked you more on nights like this?",
    "What made you first feel drawn to me?",
    "What is a tiny date-night ritual we should protect?",
    "What part of us still feels exciting to you?",
    "What memory of us do you want to revisit tonight?",
    "What kind of attention makes you feel wanted by me?",
    "What is one thing we could do tonight that would feel like us?",
    "What do you still get curious about when you look at me?",
    "What is a little flirtation we should bring back?",
    "What would make this evening feel more intentional?",
  ],
  [
    "What felt good between us this week?",
    "What felt harder than we said out loud?",
    "Where did we miss each other this week?",
    "What is one thing we handled better than before?",
    "What should we make more room for next week?",
    "Where do you need more patience from me?",
    "What did you appreciate but forget to say?",
    "What felt too heavy to carry alone this week?",
    "What is one small win we should actually celebrate?",
    "What would help next week feel less rushed?",
  ],
  [
    "What are we carrying into tonight that we do not need to keep carrying?",
    "What tension between us needs a softer landing?",
    "What did we each mean well in, even if it came out wrong?",
    "What would help us restart this conversation gently?",
    "Where did we protect ourselves instead of reaching for each other?",
    "What is one thing we can let be smaller tonight?",
    "What apology or reassurance would help the mood shift?",
    "What should we stop trying to solve for one evening?",
    "Where can we choose closeness over being right?",
    "What would make repair feel possible right now?",
  ],
  [
    "What would make next week feel a little more us?",
    "What are we quietly building together?",
    "What kind of couple do you want us to become this year?",
    "What future version of us would be proud of this season?",
    "What habit would make our relationship feel safer?",
    "What is one dream you want me to hold with more care?",
    "What do you want us to protect from the noise around us?",
    "What would make home feel more like us?",
    "What should we practice before life gets busier?",
    "What is one tiny promise our future selves would thank us for?",
  ],
  [
    "What is one silly thing I do that secretly makes you happy?",
    "What is our most underrated inside joke?",
    "What would our relationship be called if it were a playlist?",
    "What is something tiny I do that feels attractive to you?",
    "What would be a very us way to waste an afternoon?",
    "What is one compliment you think but do not say enough?",
    "What is a harmless little dare we should try this week?",
    "What version of me makes you smile before I say anything?",
    "What is one playful rule we should invent for date night?",
    "What would make us laugh together before the night ends?",
  ],
  [
    "What helps you feel close to me when we are apart?",
    "What part of distance has been harder than you expected?",
    "What small message from me would make your day softer?",
    "What do you miss most about being near me?",
    "What ritual would make distance feel less lonely?",
    "Where do you need more reassurance when we are apart?",
    "What is one thing we can look forward to together?",
    "What should I know about your life there right now?",
    "What makes you feel remembered by me from far away?",
    "What would make our next hello feel sweeter?",
  ],
  [
    "What hurt more than I realized?",
    "What do you need me to hear without defending myself?",
    "Where did we both want connection but choose protection?",
    "What would a better version of this conflict look like next time?",
    "What reassurance would help your body relax with me?",
    "What part of this can we own together?",
    "What is one sentence you wish I had said sooner?",
    "What does repair look like to you after a hard moment?",
    "Where can I be more careful with you?",
    "What would help us end this with more tenderness than we started?",
  ],
  [
    "What do you appreciate about me that has become normal to you?",
    "What is one way I love you that you never want me to stop?",
    "What did I do recently that made you feel chosen?",
    "What strength do you see in me lately?",
    "What is one thing you are proud of in us?",
    "What part of my effort do you want to name out loud?",
    "What is something I bring to your life that you value deeply?",
    "What do you trust me with more now than before?",
    "What small kindness from me mattered more than I knew?",
    "What should we thank each other for tonight?",
  ],
  [
    "What ordinary routine could feel more connected?",
    "What is one tiny check-in we could make part of the week?",
    "Where do you want more eye contact, touch, or attention?",
    "What makes a normal night feel special with me?",
    "What is one small way we can make mornings easier?",
    "What household thing feels more loving when we do it together?",
    "What would make our phones less loud in our relationship?",
    "What is a small transition ritual we need after work?",
    "What is one habit that would make us feel more like a team?",
    "What should we make simpler so there is more room for us?",
  ],
  [
    "What fear do you rarely say out loud in relationships?",
    "What kind of love feels safest to you?",
    "What part of being known by me still feels tender?",
    "What did you learn about love before you met me?",
    "What do you need when you are overwhelmed but still want closeness?",
    "What is one old story you are trying not to bring into us?",
    "What does commitment feel like in your body?",
    "Where do you want me to be more curious and less certain?",
    "What part of your inner world do you want to share slowly?",
    "What does being loved well mean to you right now?",
  ],
  [
    "What is one small promise we can keep before tomorrow night?",
    "What can I do this week that would make love feel practical?",
    "What should we protect for just ten minutes each day?",
    "What is one tiny way to make our next goodbye softer?",
    "What should we do before bed that would help us feel close?",
    "What is one thing we can put on the calendar for us?",
    "What can we stop doing for one week to make room for care?",
    "What is a simple promise you would actually enjoy keeping?",
    "What should we repair with action, not more talking?",
    "What small thing would make tomorrow feel like we chose each other?",
  ],
];

const followUps = [
  "What would make that easier to repeat?",
  "When did you first notice that feeling?",
  "What part of that matters most to you?",
  "What would help me understand it better?",
  "What is the smallest version of that we can try?",
  "How did that land in your body?",
  "What do you need from me after saying that?",
  "What would make this feel lighter?",
  "What should I remember about this?",
  "What is one gentle follow-up I should ask?",
];

const closingActions = [
  "Choose one sentence to carry into tomorrow.",
  "Hold hands for ten quiet seconds before moving on.",
  "Thank each other for one specific thing.",
  "Make one tiny promise you can keep this week.",
  "Send a short message later that repeats the feeling.",
  "Pick one moment this week to protect for each other.",
  "End with a hug, a joke, or a small reassurance.",
  "Name one thing you are leaving behind tonight.",
  "Choose one action that would make tomorrow softer.",
  "Let the answer be enough, then do something ordinary together.",
];

const characters: DeckCharacter[] = ["Mochi", "Mallow", "Mochi & Mallow"];

export const DECK_CARDS: DeckCard[] = modes.flatMap((mode, modeIndex) =>
  questions[modeIndex].map((question, promptIndex) => ({
    id: modeIndex * 10 + promptIndex + 1,
    mode,
    character: characters[(modeIndex + promptIndex) % characters.length],
    question,
    followUp: followUps[(modeIndex + promptIndex) % followUps.length],
    closingAction: closingActions[(modeIndex * 2 + promptIndex) % closingActions.length],
  })),
);

export const PREVIEW_DECK_CARDS = DECK_CARDS.slice(0, 3);
