# Question Ranker

Small browser app for iterative question selection:

- Load questions from `data/questions.local.json`
- Score the full questionnaire from `0` to `5`
- Create a shortlist using a score threshold and optional top-N cap
- Re-score each derived shortlist until you get the final set
- Export any round as JSON

## Keep questions out of git

Tracked:

- `data/questions.template.json`
- app code
- extraction script

Ignored:

- `data/questions.local.json`
- exported shortlist JSON files

## Generate local question data from the PDF

```powershell
python .\scripts\extract_questions.py "C:\Users\hp\Downloads\Telegram Desktop\Link_EMR_Specialty_Center_Questionnaire.pdf" .\data\questions.local.json
```

## Run locally

From the `question-ranker` folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.
