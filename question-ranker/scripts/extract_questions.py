from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader


QUESTION_RE = re.compile(r"^(Q\d+[A-Za-z]*)\s+(.*)$")
SECTION_RE = re.compile(r"^Section\s+\d+:\s+(.*)$", re.IGNORECASE)
FIELD_PREFIXES = ("Type ", "Required ", "Options ", "Scale ", "Condition ", "Note ")
LOGIC_PREFIXES = ("Logic ", "Conditional ", "Show only ")


def normalize_line(raw: str) -> str:
    cleaned = raw.replace("\uf0b7", "-").replace("â€¢", "-").replace("•", "-")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = re.sub(r"^\?\s+", "- ", cleaned)
    return cleaned


def normalize_question_text(text: str) -> str:
    return text[:-1].rstrip() + "?" if text.endswith("-") else text


def extract_lines(pdf_path: Path) -> list[str]:
    reader = PdfReader(str(pdf_path))
    lines: list[str] = []

    for page in reader.pages:
        text = page.extract_text() or ""
        for raw_line in text.splitlines():
            line = normalize_line(raw_line)
            if line:
                lines.append(line)

    return lines


def parse_questions(lines: list[str]) -> dict:
    title = "Questionnaire"
    section = "General"
    questions: list[dict] = []
    current: dict | None = None
    active_field: str | None = None

    for line in lines:
        if line.startswith("Opian Health / Link EMR - Specialty Center EMR Questionnaire"):
            title = line
            continue

        section_match = SECTION_RE.match(line)
        if section_match:
            section = section_match.group(1).strip()
            continue

        question_match = QUESTION_RE.match(line)
        if question_match:
            if current:
                questions.append(current)
            code, text = question_match.groups()
            current = {
                "id": code.lower(),
                "code": code,
                "section": section,
                "text": normalize_question_text(text.strip()),
                "type": "",
                "required": False,
                "options": [],
                "note": "",
                "order": len(questions) + 1,
            }
            active_field = "text"
            continue

        if not current:
            continue

        if line.startswith("Type "):
            current["type"] = line.removeprefix("Type ").strip()
            active_field = "type"
            continue

        if line.startswith("Required "):
            current["required"] = line.removeprefix("Required ").strip().lower() == "yes"
            active_field = "required"
            continue

        if line.startswith("Options "):
            option_text = line.removeprefix("Options ").strip(" -")
            if option_text:
                current["options"].append(option_text)
            active_field = "options"
            continue

        if line.startswith(LOGIC_PREFIXES):
            current["note"] = f'{current["note"]} {line}'.strip()
            active_field = "note"
            continue

        if line.startswith("Note "):
            current["note"] = line.removeprefix("Note ").strip()
            active_field = "note"
            continue

        if line.startswith("Scale "):
            scale_text = line.removeprefix("Scale ").strip()
            current["note"] = f'{current["note"]} Scale: {scale_text}'.strip()
            active_field = "note"
            continue

        if line.startswith("Condition "):
            condition_text = line.removeprefix("Condition ").strip()
            current["note"] = f'{current["note"]} Condition: {condition_text}'.strip()
            active_field = "note"
            continue

        if active_field == "options":
            if QUESTION_RE.match(line) or SECTION_RE.match(line) or line.startswith(FIELD_PREFIXES):
                continue
            current["options"].append(line.strip(" -"))
            continue

        if active_field == "note":
            current["note"] = f'{current["note"]} {line}'.strip()
            continue

        if active_field == "text":
            current["text"] = normalize_question_text(f'{current["text"]} {line}'.strip())

    if current:
        questions.append(current)

    return {
        "title": title,
        "source": "Generated from PDF questionnaire",
        "questions": questions,
    }


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python extract_questions.py <input.pdf> <output.json>")
        return 1

    input_path = Path(sys.argv[1]).expanduser()
    output_path = Path(sys.argv[2]).expanduser()

    lines = extract_lines(input_path)
    dataset = parse_questions(lines)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(dataset, indent=2), encoding="utf-8")
    print(f"Wrote {len(dataset['questions'])} questions to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
