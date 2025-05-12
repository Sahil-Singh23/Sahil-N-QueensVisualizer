import { useState, useEffect } from "react";

export default function NQueensVisualizer() {
  const [boardSize, setBoardSize] = useState(8);
  const [board, setBoard] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [currentSolution, setCurrentSolution] = useState(0);
  const [speed, setSpeed] = useState(500); // milliseconds
  const [isAnimating, setIsAnimating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalQueens, setTotalQueens] = useState(0);

  // Initialize the board
  useEffect(() => {
    resetBoard();
  }, [boardSize]);

  const resetBoard = () => {
    // Create empty board
    const newBoard = Array(boardSize)
      .fill()
      .map(() => Array(boardSize).fill(0));
    setBoard(newBoard);
    setSolutions([]);
    setCurrentSolution(0);
    setSteps([]);
    setCurrentStep(0);
    setTotalQueens(0);
    setIsAnimating(false);
  };

  // Check if a position is safe for a queen
  const isSafe = (board, row, col) => {
    // Upper diagonal check
    let r = row;
    let c = col;
    while (r >= 0 && c >= 0) {
      if (board[r][c] === 1) return false;
      r--;
      c--;
    }

    // Same row check
    r = row;
    c = col;
    while (c >= 0) {
      if (board[r][c] === 1) return false;
      c--;
    }

    // Lower diagonal check
    r = row;
    c = col;
    while (c >= 0 && r < board.length) {
      if (board[r][c] === 1) return false;
      r++;
      c--;
    }

    return true;
  };

  // Solve N-Queens using backtracking
  const solveNQueens = () => {
    resetBoard();
    const allSolutions = [];
    const allSteps = [];

    const solve = (col, board) => {
      // Base case: If all queens are placed
      if (col >= boardSize) {
        const solution = board.map((row) => [...row]);
        allSolutions.push(solution);
        return;
      }

      // Try placing queen in all rows of this column
      for (let row = 0; row < boardSize; row++) {
        // Check if queen can be placed
        if (isSafe(board, row, col)) {
          board[row][col] = 1;
          allSteps.push({
            board: board.map((row) => [...row]),
            message: `Placed queen at position (${row + 1},${col + 1})`,
            type: "place",
          });
          solve(col + 1, board);
          board[row][col] = 0;
          allSteps.push({
            board: board.map((row) => [...row]),
            message: `Backtrack: Remove queen from (${row + 1},${col + 1})`,
            type: "remove",
          });
        }
      }
    };

    const emptyBoard = Array(boardSize)
      .fill()
      .map(() => Array(boardSize).fill(0));
    solve(0, emptyBoard);

    setSolutions(allSolutions);
    setSteps(allSteps);

    if (allSolutions.length > 0) {
      setBoard(allSolutions[0]);
      setCurrentSolution(0);
    } else {
      alert("No solutions found!");
    }

    return allSolutions.length;
  };

  // Animate the solving process
  const animateSolving = () => {
    if (steps.length === 0) {
      solveNQueens();
      return;
    }

    setIsAnimating(true);
    setCurrentStep(0);
    setTotalQueens(0);

    const animate = (step) => {
      if (step >= steps.length) {
        setIsAnimating(false);
        return;
      }

      setBoard(steps[step].board);
      setCurrentStep(step);

      // Count queens on the board
      const queensCount = steps[step].board
        .flat()
        .reduce((acc, cell) => acc + cell, 0);
      setTotalQueens(queensCount);

      setTimeout(() => {
        animate(step + 1);
      }, speed);
    };

    animate(0);
  };

  // Show next solution
  const nextSolution = () => {
    if (solutions.length === 0) return;
    const next = (currentSolution + 1) % solutions.length;
    setCurrentSolution(next);
    setBoard(solutions[next]);
  };

  // Show previous solution
  const prevSolution = () => {
    if (solutions.length === 0) return;
    const prev = (currentSolution - 1 + solutions.length) % solutions.length;
    setCurrentSolution(prev);
    setBoard(solutions[prev]);
  };

  return (
    <div className="flex flex-col items-center p-6 font-sans max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-green-800">
        N-Queens Visualizer
      </h1>

      <div className="flex items-center gap-6 mb-8 bg-white p-4 rounded-lg shadow w-full justify-center">
        <div>
          <label className="mr-2 font-medium text-gray-700">
            Board Size (N):
          </label>
          <input
            type="number"
            min="4"
            max="15"
            value={boardSize}
            onChange={(e) => setBoardSize(parseInt(e.target.value) || 4)}
            className="border border-gray-300 px-3 py-2 w-16 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isAnimating}
          />
        </div>

        <div className="flex items-center">
          <label className="mr-2 font-medium text-gray-700">
            Animation Speed:
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-32 accent-green-500"
            disabled={isAnimating}
          />
          <span className="ml-2 text-gray-700">{speed}ms</span>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={resetBoard}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition duration-300 shadow"
          disabled={isAnimating}
        >
          Reset
        </button>
        <button
          onClick={solveNQueens}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-300 shadow"
          disabled={isAnimating}
        >
          Find Solutions
        </button>
        <button
          onClick={animateSolving}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300 shadow"
          disabled={isAnimating}
        >
          {isAnimating ? "Animating..." : "Animate Solution"}
        </button>
      </div>

      {solutions.length > 0 && (
        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-gray-700">
            Solution {currentSolution + 1} of {solutions.length}
          </p>
          <div className="flex gap-4 mt-3">
            <button
              onClick={prevSolution}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition duration-300 shadow"
              disabled={isAnimating}
            >
              Previous
            </button>
            <button
              onClick={nextSolution}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition duration-300 shadow"
              disabled={isAnimating}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isAnimating && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm w-full max-w-lg">
          <p className="font-medium">
            Step {currentStep + 1} of {steps.length}
          </p>
          <p
            className={`mt-1 ${
              steps[currentStep]?.type === "place"
                ? "text-green-600"
                : "text-red-600"
            } font-medium`}
          >
            {steps[currentStep]?.message}
          </p>
          <p className="mt-1">Queens placed: {totalQueens}</p>
          <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div
        className="grid border border-gray-400 rounded-lg shadow-md overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gap: "1px",
          width: `${Math.min(600, boardSize * 50)}px`,
          height: `${Math.min(600, boardSize * 50)}px`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="flex items-center justify-center transition-all duration-300 queen-cell"
              style={{
                backgroundColor:
                  (rowIndex + colIndex) % 2 === 0 ? "#74330f" : "#ebcea5",
                width: `${Math.min(50, 600 / boardSize)}px`,
                height: `${Math.min(50, 600 / boardSize)}px`,
              }}
            >
              {cell === 1 && (
                <img
                  src={`${import.meta.env.BASE_URL}/chess1.png`}
                  alt="Chess Queen"
                  className="w-4/5 h-4/5 drop-shadow-lg"
                  style={{
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-8 text-center max-w-2xl bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-green-800">
          Algorithm Complexity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Time Complexity
            </h3>
            <p className="mb-2 text-gray-700">O(N!)</p>
            <p className="text-sm text-gray-600">
              For each column, we try each row, but with constraints that reduce
              viable options as we proceed.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">
              Space Complexity
            </h3>
            <p className="mb-2 text-gray-700">O(N²)</p>
            <p className="text-sm text-gray-600">
              We need an N×N board to represent the state, plus O(N) space for
              recursion stack.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="mt-6 text-sm text-gray-500">
            Solution Link:{" "}
            <a
              href="https://leetcode.com/problems/n-queens/solutions/6731830/backtracking-easy-to-understand-100-fast-jats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LeetCode N-Queens Backtracking Solution By SAHIL SINGH
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
