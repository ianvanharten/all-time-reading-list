import re
import json
from collections import defaultdict
from datetime import datetime

# Load the Markdown file
with open("reading_list.md", "r", encoding="utf-8") as file:
    lines = file.readlines()

# Regular expressions to match headers and book entries
header_pattern = re.compile(r"^#{2,3} (.+)")
book_entry_pattern = re.compile(r"^- (.+?) -- (.+?)(?: \((.*?)\))?$")

# Function to parse date from section headers
def parse_date(header):
    try:
        dt = datetime.strptime(header, "%B %Y")
        return dt.year, dt.strftime("%B")
    except ValueError:
        match = re.match(r"(\d{4})", header)
        if match:
            return int(match.group(1)), None
    return None, None

# Parse lines into book records
books = []
current_year = None
current_month = None

for line in lines:
    line = line.strip()
    if not line:
        continue

    # Match date headers like "### March 2012"
    header_match = header_pattern.match(line)
    if header_match:
        current_year, current_month = parse_date(header_match.group(1))
        continue

    # Match book entries like "- Book Title -- Author Name"
    book_match = book_entry_pattern.match(line)
    if book_match:
        title = book_match.group(1).strip()
        author = book_match.group(2).strip()
        notes = book_match.group(3) or ""

        book = {
            "title": title,
            "author": author,
            "year": current_year,
            "month": current_month,
            "format": "audiobook" if "audiobook" in notes.lower() else "print",
            "reread": "(x2" in notes or "(x3" in notes or "(x4" in notes,
            "notes": notes
        }
        books.append(book)

# Save output to JSON
with open("book_list_parsed.json", "w", encoding="utf-8") as f:
    json.dump(books, f, indent=2)
