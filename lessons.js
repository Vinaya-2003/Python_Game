// All teaching content lives here. To add a topic, add another key next to `loops`
// with the same shape (see README) — the interface in js/app.js does not change.
const fizz = n => Array.from({ length: n }, (_, i) => { i++; return i % 15 == 0 ? 'FizzBuzz' : i % 3 == 0 ? 'Fizz' : i % 5 == 0 ? 'Buzz' : String(i); });
window.LESSONS = { loops: {
  title: 'Python Loops', desc: 'Loops let a program repeat work without you copy-pasting code. Imagine writing "Hello" 100 times — a loop does it in two lines.',
  objectives: ['Repeat code with a <code>for</code> loop and <code>range()</code>', 'Loop over the items of a list', 'Repeat until something changes with a <code>while</code> loop', 'Control loops with <code>break</code> and <code>continue</code>'],
  learn: [
    { h: 'The for loop', p: 'A <code>for</code> loop is like a teacher calling roll: it takes each name in turn. <code>range(5)</code> gives the numbers 0, 1, 2, 3, 4 — it starts at 0 and stops <em>before</em> 5. The indented lines run once per number.', code: 'for i in range(5):\n    print("Step", i)' },
    { h: 'Looping over a list', p: 'You can loop over any collection. Each time round, <code>fruit</code> holds the next item.', code: 'fruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print("I like", fruit)' },
    { h: 'The while loop', p: 'Think of filling a bucket: keep pouring <em>while</em> it is not full. A <code>while</code> loop repeats as long as its condition is True. Something inside must change the condition, or the loop never ends!', code: 'water = 0\nwhile water < 3:\n    water += 1\n    print("Bucket has", water, "litres")\nprint("Full!")' },
    { h: 'break and continue', p: '<code>continue</code> skips to the next round. <code>break</code> leaves the loop completely. Predict the output before you run it!', code: 'for n in range(1, 10):\n    if n == 3:\n        continue   # skip 3\n    if n == 6:\n        break      # stop the loop\n    print(n)' }
  ],
  practice: [
    { id: 'p1', level: 'easy', title: 'Count to five', xp: 10, prompt: 'Use a <code>for</code> loop to print the numbers 1 to 5, one per line.', starter: '# Print 1 2 3 4 5, each on its own line\n',
      hints: ['Start with: for i in range(...):', 'range(5) starts at 0. Try range(1, 6).', 'Put print(i) inside the loop, indented.'], tests: [{ name: 'Prints 1 to 5', out: ['1', '2', '3', '4', '5'] }] },
    { id: 'p2', level: 'medium', title: 'Add them up', xp: 20, prompt: 'Complete the code so it prints the sum of all numbers from 1 up to <code>n</code> (including n).', starter: 'n = int(input("Sum up to: "))\ntotal = 0\nfor i in range(___):\n    total = ___\nprint(total)\n',
      hints: ['range(1, n) stops before n.', 'Use range(1, n + 1) to include n.', 'Each round, add i to total: total = total + i'], tests: [{ stdin: ['10'], out: ['55'] }, { stdin: ['1'], out: ['1'] }, { stdin: ['0'], out: ['0'] }] },
    { id: 'p3', level: 'hard', title: 'Fizz Buzz', xp: 30, prompt: 'Read <code>n</code>. For each number from 1 to n print <code>Fizz</code> if it divides by 3, <code>Buzz</code> if it divides by 5, <code>FizzBuzz</code> if both, otherwise the number.', starter: 'n = int(input())\n# loop from 1 to n and print the right thing each time\n',
      hints: ['i % 3 == 0 checks whether i divides by 3.', 'Check the "both" case first, or it will never be reached.', 'Use if i % 15 == 0 / elif i % 3 == 0 / elif i % 5 == 0 / else.'], tests: [{ stdin: ['5'], out: fizz(5) }, { stdin: ['15'], out: fizz(15) }, { stdin: ['1'], out: ['1'] }] }
  ],
  build: { id: 'b1', level: 'medium', title: 'Mini-project: Number Guessing Game', xp: 50,
    prompt: 'The secret number is 7. Use a <code>while</code> loop to keep asking for guesses. Print <code>Too low!</code> or <code>Too high!</code> for wrong guesses. When right, print <code>Correct! Guesses: N</code> (N = number of guesses) and stop. Type guesses in the Input box, one per line, e.g. 3, 9, 7.',
    starter: 'secret = 7   # tests use 7. After they pass, try: import random; secret = random.randint(1, 10)\nguesses = 0\n\nwhile True:\n    guess = int(input("Guess a number (1-10): "))\n    # 1. add 1 to guesses\n    # 2. too low? print("Too low!")  too high? print("Too high!")\n    # 3. correct? print("Correct! Guesses:", guesses) and stop the loop\n',
    hints: ['<code>break</code> leaves the loop immediately.', 'Compare guess with secret using if / elif / else.', 'Add 1 to guesses at the top of every round: guesses += 1'],
    tests: [{ stdin: ['3', '9', '7'], has: ['Too low!', 'Too high!', 'Correct! Guesses: 3'] }, { stdin: ['7'], has: ['Correct! Guesses: 1'] }, { stdin: ['10', '8', '7'], has: ['Too high!', 'Correct! Guesses: 3'] }] },
  freeStarter: '# Free play: write anything!\nfor i in range(3):\n    print("Hello from Python Lab", i)\n',
  skills: ['Repeating code with for and range()', 'Looping over lists', 'Using while loops with a stopping condition', 'Controlling loops with break and continue'],
  badge: { icon: '🔁', name: 'Loop Master' }, next: 'Next challenge: make the game random, limit it to 5 guesses, then try the Lists topic.'
} };
