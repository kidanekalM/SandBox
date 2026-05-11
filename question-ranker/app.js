const DATA_URL = "./data/questions.local.json";
const FALLBACK_DATA_URL = "./data/questions.template.json";
const STORAGE_KEY = "question-ranker-state-v1";

const elements = {
  datasetMeta: document.getElementById("dataset-meta"),
  roundList: document.getElementById("round-list"),
  activeRoundName: document.getElementById("active-round-name"),
  questionCount: document.getElementById("question-count"),
  ratedCount: document.getElementById("rated-count"),
  averageScore: document.getElementById("average-score"),
  questionList: document.getElementById("question-list"),
  sortMode: document.getElementById("sort-mode"),
  unratedOnly: document.getElementById("unrated-only"),
  scoreDefault: document.getElementById("score-default"),
  shortlistName: document.getElementById("shortlist-name"),
  thresholdScore: document.getElementById("threshold-score"),
  topLimit: document.getElementById("top-limit"),
  createShortlist: document.getElementById("create-shortlist"),
  exportRound: document.getElementById("export-round"),
  clearRoundScores: document.getElementById("clear-round-scores"),
  reloadData: document.getElementById("reload-data"),
  resetState: document.getElementById("reset-state"),
  roundTemplate: document.getElementById("round-template"),
  questionTemplate: document.getElementById("question-template"),
};

const state = {
  dataset: null,
  rounds: [],
  activeRoundId: null,
};

function safeScoreValue(value) {
  return Number.isFinite(value) ? value : null;
}

function buildInitialRound(dataset) {
  return {
    id: "round-1",
    name: "All questions",
    questionIds: dataset.questions.map((question) => question.id),
    scores: {},
    sourceRoundId: null,
    createdAt: new Date().toISOString(),
  };
}

function getQuestionMap() {
  return new Map(state.dataset.questions.map((question) => [question.id, question]));
}

function getRoundById(roundId) {
  return state.rounds.find((round) => round.id === roundId);
}

function getActiveRound() {
  return getRoundById(state.activeRoundId);
}

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      datasetSignature: state.dataset?.signature || null,
      rounds: state.rounds,
      activeRoundId: state.activeRoundId,
    }),
  );
}

async function loadDataset() {
  const sources = [DATA_URL, FALLBACK_DATA_URL];

  for (const source of sources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }

      const dataset = await response.json();
      dataset.signature = `${dataset.title || "dataset"}:${dataset.questions?.length || 0}`;
      return dataset;
    } catch {
      continue;
    }
  }

  throw new Error("No dataset file found.");
}

function initializeState(dataset) {
  state.dataset = dataset;

  const saved = getSavedState();
  if (saved && saved.datasetSignature === dataset.signature && Array.isArray(saved.rounds) && saved.rounds.length > 0) {
    state.rounds = saved.rounds;
    state.activeRoundId = saved.activeRoundId || saved.rounds[0].id;
    return;
  }

  const initialRound = buildInitialRound(dataset);
  state.rounds = [initialRound];
  state.activeRoundId = initialRound.id;
  saveState();
}

function getRoundStats(round) {
  const scoredValues = round.questionIds
    .map((questionId) => safeScoreValue(round.scores[questionId]))
    .filter((value) => value !== null);

  const total = round.questionIds.length;
  const rated = scoredValues.length;
  const average = rated ? scoredValues.reduce((sum, score) => sum + score, 0) / rated : 0;

  return { total, rated, average };
}

function setScore(roundId, questionId, score) {
  const round = getRoundById(roundId);
  if (!round) {
    return;
  }

  round.scores[questionId] = Number(score);
  saveState();
  render();
}

function sortQuestions(questions, round) {
  const sortMode = elements.sortMode.value;

  const scored = [...questions];
  scored.sort((left, right) => {
    const leftScore = safeScoreValue(round.scores[left.id]);
    const rightScore = safeScoreValue(round.scores[right.id]);

    if (sortMode === "score-desc") {
      return (rightScore ?? -1) - (leftScore ?? -1) || left.order - right.order;
    }

    if (sortMode === "score-asc") {
      return (leftScore ?? 99) - (rightScore ?? 99) || left.order - right.order;
    }

    if (sortMode === "section") {
      return left.section.localeCompare(right.section) || left.order - right.order;
    }

    return left.order - right.order;
  });

  if (elements.unratedOnly.checked) {
    return scored.filter((question) => safeScoreValue(round.scores[question.id]) === null);
  }

  return scored;
}

function renderRounds() {
  elements.roundList.innerHTML = "";

  state.rounds.forEach((round) => {
    const node = elements.roundTemplate.content.firstElementChild.cloneNode(true);
    const stats = getRoundStats(round);

    node.querySelector(".round-name").textContent = round.name;
    node.querySelector(".round-meta").textContent = `${stats.total} questions • ${stats.rated} rated`;
    node.classList.toggle("active", round.id === state.activeRoundId);
    node.addEventListener("click", () => {
      state.activeRoundId = round.id;
      saveState();
      render();
    });

    elements.roundList.appendChild(node);
  });
}

function renderDatasetMeta() {
  const dataset = state.dataset;
  elements.datasetMeta.textContent = `${dataset.title} • ${dataset.questions.length} questions`;
}

function renderStats(round) {
  const stats = getRoundStats(round);
  elements.activeRoundName.textContent = round.name;
  elements.questionCount.textContent = String(stats.total);
  elements.ratedCount.textContent = String(stats.rated);
  elements.averageScore.textContent = stats.average.toFixed(1);
}

function renderQuestions(round) {
  const questionMap = getQuestionMap();
  const questions = round.questionIds.map((questionId) => questionMap.get(questionId)).filter(Boolean);
  const sortedQuestions = sortQuestions(questions, round);

  elements.questionList.innerHTML = "";
  if (!sortedQuestions.length) {
    elements.questionList.innerHTML = '<div class="empty-state">No questions match the current filter.</div>';
    return;
  }

  sortedQuestions.forEach((question) => {
    const node = elements.questionTemplate.content.firstElementChild.cloneNode(true);
    const storedScore = safeScoreValue(round.scores[question.id]);
    const displayScore = storedScore ?? "Unrated";
    const sliderScore = storedScore ?? Number(elements.scoreDefault.value);

    node.querySelector(".question-section").textContent = question.section || "Unsectioned";
    node.querySelector(".question-title").textContent = `${question.code} ${question.text}`;
    node.querySelector(".question-score-pill").textContent = `Score ${displayScore}`;

    const metaParts = [question.type];
    if (question.required) {
      metaParts.push("Required");
    }
    if (question.note) {
      metaParts.push(question.note);
    }
    node.querySelector(".question-meta").textContent = metaParts.filter(Boolean).join(" • ");

    const optionsList = node.querySelector(".question-options");
    if (question.options?.length) {
      question.options.forEach((option) => {
        const item = document.createElement("li");
        item.textContent = option;
        optionsList.appendChild(item);
      });
    } else {
      optionsList.remove();
    }

    const scoreInput = node.querySelector(".score-input");
    const scoreValue = node.querySelector(".score-value");
    scoreInput.value = String(sliderScore);
    scoreValue.textContent = String(displayScore);

    scoreInput.addEventListener("input", (event) => {
      const nextScore = Number(event.target.value);
      node.querySelector(".question-score-pill").textContent = `Score ${nextScore}`;
      scoreValue.textContent = String(nextScore);
    });

    scoreInput.addEventListener("change", (event) => {
      setScore(round.id, question.id, Number(event.target.value));
    });

    node.querySelectorAll(".score-buttons button").forEach((button) => {
      button.addEventListener("click", () => {
        const nextScore = Number(button.dataset.score);
        setScore(round.id, question.id, nextScore);
      });
    });

    elements.questionList.appendChild(node);
  });
}

function render() {
  const round = getActiveRound();
  if (!round) {
    return;
  }

  renderDatasetMeta();
  renderRounds();
  renderStats(round);
  renderQuestions(round);
}

function buildDerivedRoundName() {
  return elements.shortlistName.value.trim() || `Round ${state.rounds.length + 1} shortlist`;
}

function createShortlist() {
  const round = getActiveRound();
  const questionMap = getQuestionMap();
  const minimumScore = Number(elements.thresholdScore.value || 0);
  const topLimit = Number(elements.topLimit.value || 0);

  let questions = round.questionIds
    .map((questionId) => ({
      question: questionMap.get(questionId),
      score: safeScoreValue(round.scores[questionId]),
    }))
    .filter((entry) => entry.question && entry.score !== null && entry.score >= minimumScore)
    .sort((left, right) => right.score - left.score || left.question.order - right.question.order);

  if (topLimit > 0) {
    questions = questions.slice(0, topLimit);
  }

  if (!questions.length) {
    window.alert("No scored questions matched that shortlist rule.");
    return;
  }

  const nextRound = {
    id: `round-${state.rounds.length + 1}`,
    name: buildDerivedRoundName(),
    questionIds: questions.map((entry) => entry.question.id),
    scores: {},
    sourceRoundId: round.id,
    createdAt: new Date().toISOString(),
  };

  state.rounds.push(nextRound);
  state.activeRoundId = nextRound.id;
  elements.shortlistName.value = "";
  saveState();
  render();
}

function exportRound() {
  const round = getActiveRound();
  const questionMap = getQuestionMap();

  const payload = {
    datasetTitle: state.dataset.title,
    roundName: round.name,
    createdAt: new Date().toISOString(),
    questions: round.questionIds.map((questionId) => {
      const question = questionMap.get(questionId);
      return {
        id: question.id,
        code: question.code,
        section: question.section,
        text: question.text,
        score: safeScoreValue(round.scores[questionId]),
      };
    }),
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${round.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "question-list"}.export.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function clearRoundScores() {
  const round = getActiveRound();
  round.scores = {};
  saveState();
  render();
}

function resetAllState() {
  localStorage.removeItem(STORAGE_KEY);
  initializeState(state.dataset);
  render();
}

function bindEvents() {
  elements.sortMode.addEventListener("change", render);
  elements.unratedOnly.addEventListener("change", render);
  elements.createShortlist.addEventListener("click", createShortlist);
  elements.exportRound.addEventListener("click", exportRound);
  elements.clearRoundScores.addEventListener("click", clearRoundScores);
  elements.resetState.addEventListener("click", resetAllState);
  elements.reloadData.addEventListener("click", async () => {
    const dataset = await loadDataset();
    initializeState(dataset);
    render();
  });
}

async function start() {
  try {
    const dataset = await loadDataset();
    initializeState(dataset);
    bindEvents();
    render();
  } catch (error) {
    elements.questionList.innerHTML = `<div class="empty-state">${error.message} Generate <code>data/questions.local.json</code> first.</div>`;
  }
}

start();
