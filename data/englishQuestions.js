const englishQuestions = [
  {
    text: "Which sentence is grammatically correct?",
    options: [
      { text: "Neither the students nor the teacher were late.", isCorrect: false },
      { text: "Neither the students nor the teacher was late.", isCorrect: true },
      { text: "Neither the students or the teacher was late.", isCorrect: false },
      { text: "Neither students nor teacher were late.", isCorrect: false },
    ],
  },
  {
    text: "Which of the following words is **not** a synonym of 'ambiguous'?",
    options: [
      { text: "Unclear", isCorrect: false },
      { text: "Vague", isCorrect: false },
      { text: "Explicit", isCorrect: true },
      { text: "Obscure", isCorrect: false },
    ],
  },
  {
    text: "Which sentence demonstrates the **subjunctive mood**?",
    options: [
      { text: "If I were you, I would study harder.", isCorrect: true },
      { text: "If she is late, we will start without her.", isCorrect: false },
      { text: "He was going to the library.", isCorrect: false },
      { text: "She works hard every day.", isCorrect: false },
    ],
  },
  {
    text: "Identify the **compound-complex sentence**:",
    options: [
      { text: "She studied for the test, and she passed it.", isCorrect: false },
      { text: "Although she was tired, she finished her essay, and she submitted it on time.", isCorrect: true },
      { text: "He ran quickly.", isCorrect: false },
      { text: "Before the meeting started, she arrived.", isCorrect: false },
    ],
  },
  {
    text: "What is the function of the word *'whom'* in the sentence: 'To whom did you give the book?'",
    options: [
      { text: "Subject", isCorrect: false },
      { text: "Direct object", isCorrect: false },
      { text: "Indirect object", isCorrect: true },
      { text: "Possessive adjective", isCorrect: false },
    ],
  },
  {
    text: "Which sentence uses **parallel structure** correctly?",
    options: [
      { text: "She enjoys reading, to swim, and biking.", isCorrect: false },
      { text: "She enjoys reading, swimming, and biking.", isCorrect: true },
      { text: "She enjoys to read, swimming, and biking.", isCorrect: false },
      { text: "She enjoys reading, swimming, and to bike.", isCorrect: false },
    ],
  },
  {
    text: "What type of error is present in this sentence: 'Running down the street, the keys fell from his pocket'?",
    options: [
      { text: "Comma splice", isCorrect: false },
      { text: "Misplaced modifier", isCorrect: true },
      { text: "Subject-verb agreement", isCorrect: false },
      { text: "Run-on sentence", isCorrect: false },
    ],
  },
  {
    text: "Which word is the **gerund** in the sentence: 'Swimming is a great way to stay healthy'?",
    options: [
      { text: "Swimming", isCorrect: true },
      { text: "Is", isCorrect: false },
      { text: "Way", isCorrect: false },
      { text: "Healthy", isCorrect: false },
    ],
  },
  {
    text: "Choose the sentence with the correct **punctuation of an appositive**:",
    options: [
      { text: "My brother a doctor is moving to Canada.", isCorrect: false },
      { text: "My brother, a doctor, is moving to Canada.", isCorrect: true },
      { text: "My brother a doctor, is moving to Canada.", isCorrect: false },
      { text: "My brother a doctor is, moving to Canada.", isCorrect: false },
    ],
  },
  {
    text: "What is the **function of a semicolon** in a sentence?",
    options: [
      { text: "To separate items in a simple list", isCorrect: false },
      { text: "To connect closely related independent clauses", isCorrect: true },
      { text: "To show possession", isCorrect: false },
      { text: "To indicate a pause or break", isCorrect: false },
    ],
  },
  {
    text: "Which is the correct **active voice** sentence?",
    options: [
      { text: "The letter was written by Sarah.", isCorrect: false },
      { text: "The homework was completed by the student.", isCorrect: false },
      { text: "Sarah wrote the letter.", isCorrect: true },
      { text: "The document had been prepared by the assistant.", isCorrect: false },
    ],
  },
  {
    text: "Choose the sentence with correct **subject-verb agreement**:",
    options: [
      { text: "The committee have made their decision.", isCorrect: false },
      { text: "The committee has made its decision.", isCorrect: true },
      { text: "The committee have made its decision.", isCorrect: false },
      { text: "The committee has made their decision.", isCorrect: false },
    ],
  },
  {
    text: "Which sentence contains a **non-restrictive relative clause**?",
    options: [
      { text: "The car that I bought last week is red.", isCorrect: false },
      { text: "My brother, who lives in London, is a musician.", isCorrect: true },
      { text: "Students who study hard will pass.", isCorrect: false },
      { text: "The book that you gave me is on the table.", isCorrect: false },
    ],
  },
  {
    text: "Which is an example of a **metaphor**?",
    options: [
      { text: "He is as brave as a lion.", isCorrect: false },
      { text: "She runs like the wind.", isCorrect: false },
      { text: "The world is a stage.", isCorrect: true },
      { text: "He fought like a warrior.", isCorrect: false },
    ],
  },
  {
    text: "Which word is most appropriate in formal academic writing?",
    options: [
      { text: "Kids", isCorrect: false },
      { text: "Children", isCorrect: true },
      { text: "Guys", isCorrect: false },
      { text: "Folks", isCorrect: false },
    ],
  },
  {
    text: "What is the **root word** of 'unbelievable'?",
    options: [
      { text: "Un", isCorrect: false },
      { text: "Believe", isCorrect: true },
      { text: "Believable", isCorrect: false },
      { text: "Able", isCorrect: false },
    ],
  },
  {
    text: "Which of the following best demonstrates **cohesion** in a paragraph?",
    options: [
      { text: "Using transition words like 'however' and 'therefore'", isCorrect: true },
      { text: "Writing in passive voice", isCorrect: false },
      { text: "Using only simple sentences", isCorrect: false },
      { text: "Repeating the same word in each sentence", isCorrect: false },
    ],
  },
  {
    text: "Which of the following is an **abstract noun**?",
    options: [
      { text: "Freedom", isCorrect: true },
      { text: "Chair", isCorrect: false },
      { text: "Tree", isCorrect: false },
      { text: "Computer", isCorrect: false },
    ],
  },
  {
    text: "Which of these words is a **conjunctive adverb**?",
    options: [
      { text: "Although", isCorrect: false },
      { text: "However", isCorrect: true },
      { text: "Because", isCorrect: false },
      { text: "If", isCorrect: false },
    ],
  },
  {
    text: "What does the phrase **'once in a blue moon'** mean?",
    options: [
      { text: "Very frequently", isCorrect: false },
      { text: "Rarely", isCorrect: true },
      { text: "Exactly at midnight", isCorrect: false },
      { text: "Occasionally but regularly", isCorrect: false },
    ],
  },
];

module.exports = englishQuestions;
