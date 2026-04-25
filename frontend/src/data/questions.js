/**
 * Curated question bank for the Adaptive Learning System.
 * Each question has: id, topic, difficulty, question, options[], correctIndex, explanation
 */

export const TOPICS = [
  { id: 'mathematics', label: 'Mathematics', color: '#6366f1', desc: 'Algebra, geometry, and problem solving' },
  { id: 'science', label: 'Science', color: '#06b6d4', desc: 'Physics, chemistry, and biology' },
  { id: 'programming', label: 'Programming', color: '#8b5cf6', desc: 'Logic, algorithms, and coding concepts' },
  { id: 'general', label: 'General Knowledge', color: '#f59e0b', desc: 'World facts, history, and culture' },
];

const questions = [
  // ── MATHEMATICS: Easy ──
  { id: 'm1', topic: 'mathematics', difficulty: 'easy', question: 'What is 15 + 27?', options: ['42','40','43','41'], correctIndex: 0, explanation: '15 + 27 = 42' },
  { id: 'm2', topic: 'mathematics', difficulty: 'easy', question: 'What is 8 × 7?', options: ['54','56','58','52'], correctIndex: 1, explanation: '8 × 7 = 56' },
  { id: 'm3', topic: 'mathematics', difficulty: 'easy', question: 'What is 100 ÷ 4?', options: ['20','30','25','15'], correctIndex: 2, explanation: '100 ÷ 4 = 25' },
  { id: 'm4', topic: 'mathematics', difficulty: 'easy', question: 'What is the square root of 49?', options: ['6','8','9','7'], correctIndex: 3, explanation: '√49 = 7' },
  { id: 'm5', topic: 'mathematics', difficulty: 'easy', question: 'What is 3² + 4²?', options: ['25','20','12','7'], correctIndex: 0, explanation: '9 + 16 = 25. This is also a Pythagorean triple (3-4-5).' },

  // ── MATHEMATICS: Medium ──
  { id: 'm6', topic: 'mathematics', difficulty: 'medium', question: 'Solve: 2x + 5 = 17. What is x?', options: ['5','6','7','4'], correctIndex: 1, explanation: '2x = 12, so x = 6' },
  { id: 'm7', topic: 'mathematics', difficulty: 'medium', question: 'What is the area of a triangle with base 10 and height 6?', options: ['60','25','30','35'], correctIndex: 2, explanation: 'Area = ½ × base × height = ½ × 10 × 6 = 30' },
  { id: 'm8', topic: 'mathematics', difficulty: 'medium', question: 'What is 15% of 200?', options: ['25','35','20','30'], correctIndex: 3, explanation: '15% of 200 = 0.15 × 200 = 30' },
  { id: 'm9', topic: 'mathematics', difficulty: 'medium', question: 'What is the next number: 2, 6, 18, 54, ...?', options: ['108','162','72','216'], correctIndex: 1, explanation: 'Each term is multiplied by 3. 54 × 3 = 162' },
  { id: 'm10', topic: 'mathematics', difficulty: 'medium', question: 'If a circle has radius 7, what is its circumference? (use π ≈ 22/7)', options: ['44','42','48','38'], correctIndex: 0, explanation: 'C = 2πr = 2 × 22/7 × 7 = 44' },

  // ── MATHEMATICS: Hard ──
  { id: 'm11', topic: 'mathematics', difficulty: 'hard', question: 'What is the derivative of x³ + 2x² - 5x + 3?', options: ['3x² + 4x - 5','3x² + 2x - 5','x² + 4x - 5','3x² + 4x + 5'], correctIndex: 0, explanation: 'd/dx(x³) = 3x², d/dx(2x²) = 4x, d/dx(-5x) = -5, d/dx(3) = 0' },
  { id: 'm12', topic: 'mathematics', difficulty: 'hard', question: 'What is log₂(64)?', options: ['5','8','4','6'], correctIndex: 3, explanation: '2⁶ = 64, so log₂(64) = 6' },
  { id: 'm13', topic: 'mathematics', difficulty: 'hard', question: 'What is the value of the integral ∫(2x)dx from 0 to 3?', options: ['18','6','9','12'], correctIndex: 2, explanation: 'Integral is x². Evaluated from 0 to 3: 3² - 0² = 9' },
  { id: 'm14', topic: 'mathematics', difficulty: 'hard', question: 'What is the sum of the interior angles of a regular hexagon?', options: ['720°','540°','900°','1080°'], correctIndex: 0, explanation: 'Sum = (n-2) × 180°. For a hexagon (n=6), 4 × 180° = 720°.' },
  { id: 'm15', topic: 'mathematics', difficulty: 'hard', question: 'In a right triangle, if sin(θ) = 3/5, what is tan(θ)?', options: ['3/4','4/5','5/3','4/3'], correctIndex: 0, explanation: 'Opposite=3, Hypotenuse=5. By Pythagoras, Adjacent=4. tan(θ) = Opp/Adj = 3/4.' },

  // ── SCIENCE: Easy ──
  { id: 's1', topic: 'science', difficulty: 'easy', question: 'What planet is known as the Red Planet?', options: ['Venus','Jupiter','Mars','Saturn'], correctIndex: 2, explanation: 'Mars is red due to iron oxide on its surface.' },
  { id: 's2', topic: 'science', difficulty: 'easy', question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen','Carbon Dioxide','Nitrogen','Hydrogen'], correctIndex: 1, explanation: 'Plants use CO₂ for photosynthesis.' },
  { id: 's3', topic: 'science', difficulty: 'easy', question: 'What is the chemical symbol for water?', options: ['H2O','CO2','O2','NaCl'], correctIndex: 0, explanation: 'Water is composed of two Hydrogen atoms and one Oxygen atom.' },
  { id: 's4', topic: 'science', difficulty: 'easy', question: 'What is the hardest natural substance on Earth?', options: ['Gold','Iron','Diamond','Quartz'], correctIndex: 2, explanation: 'Diamond is the hardest known natural substance.' },
  { id: 's5', topic: 'science', difficulty: 'easy', question: 'Which organ pumps blood through the body?', options: ['Brain','Liver','Lungs','Heart'], correctIndex: 3, explanation: 'The heart acts as a pump for the circulatory system.' },

  // ── SCIENCE: Medium ──
  { id: 's6', topic: 'science', difficulty: 'medium', question: 'Which part of the cell contains genetic material?', options: ['Cytoplasm','Nucleus','Ribosome','Mitochondria'], correctIndex: 1, explanation: 'The nucleus houses the cell\'s DNA.' },
  { id: 's7', topic: 'science', difficulty: 'medium', question: 'What is Newton\'s second law of motion?', options: ['F = ma','E = mc²','F = mv','P = mv'], correctIndex: 0, explanation: 'Force equals mass times acceleration.' },
  { id: 's8', topic: 'science', difficulty: 'medium', question: 'What element has atomic number 6?', options: ['Nitrogen','Oxygen','Carbon','Boron'], correctIndex: 2, explanation: 'Carbon has 6 protons, giving it atomic number 6.' },
  { id: 's9', topic: 'science', difficulty: 'medium', question: 'What type of wave is sound?', options: ['Transverse','Electromagnetic','Longitudinal','Surface'], correctIndex: 2, explanation: 'Sound travels as longitudinal compression waves.' },
  { id: 's10', topic: 'science', difficulty: 'medium', question: 'What is the pH of pure water?', options: ['5','6','7','8'], correctIndex: 2, explanation: 'Pure water has a neutral pH of 7.' },

  // ── SCIENCE: Hard ──
  { id: 's11', topic: 'science', difficulty: 'hard', question: 'What is the Heisenberg Uncertainty Principle about?', options: ['Energy conservation','Position & momentum','Relativity','Wave-particle duality'], correctIndex: 1, explanation: 'You cannot simultaneously know both the exact position and momentum of a particle.' },
  { id: 's12', topic: 'science', difficulty: 'hard', question: 'What is the most abundant element in the universe?', options: ['Oxygen','Carbon','Helium','Hydrogen'], correctIndex: 3, explanation: 'Hydrogen makes up about 75% of all baryonic mass.' },
  { id: 's13', topic: 'science', difficulty: 'hard', question: 'What is the Krebs cycle also known as?', options: ['Calvin cycle','Citric acid cycle','Glycolysis','Electron transport'], correctIndex: 1, explanation: 'The Krebs cycle is also called the citric acid cycle or TCA cycle.' },
  { id: 's14', topic: 'science', difficulty: 'hard', question: 'What particle is exchanged in the strong nuclear force?', options: ['Photon','W boson','Gluon','Graviton'], correctIndex: 2, explanation: 'Gluons mediate the strong force between quarks.' },
  { id: 's15', topic: 'science', difficulty: 'hard', question: 'What is the speed of light in m/s (approx)?', options: ['3×10⁶','3×10⁸','3×10¹⁰','3×10⁴'], correctIndex: 1, explanation: 'Light speed ≈ 3 × 10⁸ m/s in vacuum.' },

  // ── PROGRAMMING: Easy ──
  { id: 'p1', topic: 'programming', difficulty: 'easy', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Language','Home Tool Markup Language'], correctIndex: 0, explanation: 'HTML = HyperText Markup Language' },
  { id: 'p2', topic: 'programming', difficulty: 'easy', question: 'Which symbol is used for single-line comments in JavaScript?', options: ['#','//','--','/*'], correctIndex: 1, explanation: '// starts a single-line comment in JavaScript.' },
  { id: 'p3', topic: 'programming', difficulty: 'easy', question: 'What does CSS stand for?', options: ['Computer Style Sheets','Cascading Style Sheets','Creative Style System','Coded Style Sheets'], correctIndex: 1, explanation: 'CSS = Cascading Style Sheets' },
  { id: 'p4', topic: 'programming', difficulty: 'easy', question: 'What is the output of: console.log(typeof 42)?', options: ['"integer"','"float"','"number"','"digit"'], correctIndex: 2, explanation: 'typeof 42 returns "number" in JavaScript.' },
  { id: 'p5', topic: 'programming', difficulty: 'easy', question: 'What tag is used for the largest heading in HTML?', options: ['<heading>','<h6>','<h1>','<head>'], correctIndex: 2, explanation: '<h1> is the largest heading element.' },

  // ── PROGRAMMING: Medium ──
  { id: 'p6', topic: 'programming', difficulty: 'medium', question: 'What is a closure in JavaScript?', options: ['A way to lock objects','A function with access to its outer scope','A tool to minify code','A loop ending early'], correctIndex: 1, explanation: 'A closure gives you access to an outer function\'s scope from an inner function.' },
  { id: 'p7', topic: 'programming', difficulty: 'medium', question: 'Which HTTP method is typically used to update existing data?', options: ['GET','POST','PUT','DELETE'], correctIndex: 2, explanation: 'PUT (or PATCH) is used to update existing resources.' },
  { id: 'p8', topic: 'programming', difficulty: 'medium', question: 'What does SQL stand for?', options: ['Structured Query Language','Simple Query Language','Standard Question Language','System Query Logic'], correctIndex: 0, explanation: 'SQL = Structured Query Language.' },
  { id: 'p9', topic: 'programming', difficulty: 'medium', question: 'What is the time complexity of binary search?', options: ['O(1)','O(n)','O(n log n)','O(log n)'], correctIndex: 3, explanation: 'Binary search halves the search space each step: O(log n).' },
  { id: 'p10', topic: 'programming', difficulty: 'medium', question: 'In Git, how do you save your changes to the local repository?', options: ['git push','git commit','git save','git add'], correctIndex: 1, explanation: 'git commit records changes to the repository.' },

  // ── PROGRAMMING: Hard ──
  { id: 'p11', topic: 'programming', difficulty: 'hard', question: 'What is the CAP theorem?', options: ['Consistency, Availability, Partition tolerance','Caching, API, Processing','Concurrency, Accuracy, Performance','Compute, Access, Protocol'], correctIndex: 0, explanation: 'A distributed system can only provide 2 of these 3 guarantees.' },
  { id: 'p12', topic: 'programming', difficulty: 'hard', question: 'Which design pattern restricts instantiation of a class to one object?', options: ['Factory','Observer','Singleton','Decorator'], correctIndex: 2, explanation: 'Singleton pattern ensures a class has only one instance.' },
  { id: 'p13', topic: 'programming', difficulty: 'hard', question: 'What is the Halting Problem?', options: ['Code that runs forever','Proving a program will eventually stop','Debugging infinite loops','OS process termination'], correctIndex: 1, explanation: 'It is the problem of determining if a program will finish running or run forever.' },
  { id: 'p14', topic: 'programming', difficulty: 'hard', question: 'What is tail call optimization?', options: ['Removing dead code','Executing from the end','Optimizing recursive function calls','Minifying CSS files'], correctIndex: 2, explanation: 'TCO avoids adding a new stack frame for a function call at the end of a function.' },
  { id: 'p15', topic: 'programming', difficulty: 'hard', question: 'In Rust, what feature guarantees memory safety without a garbage collector?', options: ['Pointers','Ownership system','Virtual Machine','Reference counting only'], correctIndex: 1, explanation: 'Rust uses an ownership system with rules checked at compile time.' },

  // ── GENERAL: Easy ──
  { id: 'g1', topic: 'general', difficulty: 'easy', question: 'What is the capital of France?', options: ['Berlin','Madrid','Rome','Paris'], correctIndex: 3, explanation: 'Paris is the capital and most populous city of France.' },
  { id: 'g2', topic: 'general', difficulty: 'easy', question: 'Which animal is known as the King of the Jungle?', options: ['Tiger','Lion','Elephant','Gorilla'], correctIndex: 1, explanation: 'The lion is culturally referred to as the king of the beasts.' },
  { id: 'g3', topic: 'general', difficulty: 'easy', question: 'How many continents are there on Earth?', options: ['5','6','7','8'], correctIndex: 2, explanation: 'There are 7 continents: Asia, Africa, NA, SA, Antarctica, Europe, Australia.' },
  { id: 'g4', topic: 'general', difficulty: 'easy', question: 'What is the largest ocean?', options: ['Atlantic','Indian','Arctic','Pacific'], correctIndex: 3, explanation: 'The Pacific Ocean is the largest and deepest.' },
  { id: 'g5', topic: 'general', difficulty: 'easy', question: 'Who wrote Romeo and Juliet?', options: ['Charles Dickens','William Shakespeare','Mark Twain','Jane Austen'], correctIndex: 1, explanation: 'Shakespeare wrote Romeo and Juliet.' },

  // ── GENERAL: Medium ──
  { id: 'g6', topic: 'general', difficulty: 'medium', question: 'In what year did World War II end?', options: ['1941','1945','1950','1939'], correctIndex: 1, explanation: 'WWII ended in 1945.' },
  { id: 'g7', topic: 'general', difficulty: 'medium', question: 'What is the tallest mountain in the world?', options: ['K2','Kangchenjunga','Mount Everest','Kilimanjaro'], correctIndex: 2, explanation: 'Mount Everest peaks at 8,848 meters above sea level.' },
  { id: 'g8', topic: 'general', difficulty: 'medium', question: 'Who painted the Mona Lisa?', options: ['Vincent van Gogh','Leonardo da Vinci','Pablo Picasso','Claude Monet'], correctIndex: 1, explanation: 'Leonardo da Vinci painted it in the early 16th century.' },
  { id: 'g9', topic: 'general', difficulty: 'medium', question: 'What currency is used in Japan?', options: ['Yuan','Won','Yen','Ringgit'], correctIndex: 2, explanation: 'The Japanese Yen (JPY) is the official currency.' },
  { id: 'g10', topic: 'general', difficulty: 'medium', question: 'Which planet is the hottest in our solar system?', options: ['Mercury','Venus','Mars','Jupiter'], correctIndex: 1, explanation: 'Venus is the hottest due to a dense, heat-trapping atmosphere.' },

  // ── GENERAL: Hard ──
  { id: 'g11', topic: 'general', difficulty: 'hard', question: 'Who was the first emperor of China?', options: ['Qin Shi Huang','Han Wudi','Sun Yat-sen','Kublai Khan'], correctIndex: 0, explanation: 'Qin Shi Huang unified China in 221 BC.' },
  { id: 'g12', topic: 'general', difficulty: 'hard', question: 'In which year did the Titanic sink?', options: ['1910','1912','1914','1918'], correctIndex: 1, explanation: 'The Titanic sank on April 15, 1912.' },
  { id: 'g13', topic: 'general', difficulty: 'hard', question: 'What is the rarest blood type?', options: ['O negative','B negative','AB negative','A positive'], correctIndex: 2, explanation: 'AB negative is present in less than 1% of the population.' },
  { id: 'g14', topic: 'general', difficulty: 'hard', question: 'What was the first artificial Earth satellite?', options: ['Apollo 11','Sputnik 1','Explorer 1','Vostok 1'], correctIndex: 1, explanation: 'The Soviet Union launched Sputnik 1 in 1957.' },
  { id: 'g15', topic: 'general', difficulty: 'hard', question: 'Which author wrote the epic poem "The Odyssey"?', options: ['Virgil','Homer','Sophocles','Ovid'], correctIndex: 1, explanation: 'Homer is credited with writing The Odyssey.' }
];

export default questions;
