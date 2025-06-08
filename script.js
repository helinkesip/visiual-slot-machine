const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8,
};

const SYMBOL_VALUES = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2,
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    const allSame = symbols.every(s => s === symbols[0]);
    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const updateSlotDisplay = (rows) => {
  const slotsDiv = document.getElementById("slots");
  slotsDiv.innerHTML = "";
  for (let row of rows) {
    for (let symbol of row) {
      const div = document.createElement("div");
      div.classList.add("slot-cell");
      div.innerText = symbol;
      slotsDiv.appendChild(div);
    }
  }
};

document.getElementById("spinBtn").addEventListener("click", () => {
  const balanceInput = document.getElementById("balanceInput");
  const lines = parseInt(document.getElementById("linesInput").value);
  const bet = parseFloat(document.getElementById("betInput").value);
  const resultText = document.getElementById("resultText");

  let balance = parseFloat(balanceInput.value);
  if (isNaN(balance) || isNaN(bet) || isNaN(lines)) {
    resultText.innerText = "Invalid input!";
    return;
  }

  if (bet <= 0 || bet * lines > balance || lines < 1 || lines > 3) {
    resultText.innerText = "Invalid bet or number of lines!";
    return;
  }

  balance -= bet * lines;

  const reels = spin();
  const rows = transpose(reels);
  updateSlotDisplay(rows);

  const winnings = getWinnings(rows, bet, lines);
  balance += winnings;

  balanceInput.value = balance.toFixed(2);
  resultText.innerText = `You won $${winnings}`;
});
