# 📚 Reading History App

A Vue 3 application for tracking and visualizing your personal reading history. Built with modern web technologies and designed for a clean, responsive experience.

## 🛠️ Tech Stack

- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Chart.js + vue-chartjs** (Data visualization)
- **Axios** (HTTP requests)

## 🎯 Features

### 📖 Book List

- Display all books with cover images (via Open Library API)
- **Filtering**: Search by title/author, filter by year/format
- **Sorting**: Sort by year, title, or author (ascending/descending)
- **Responsive**: Works on desktop, tablet, and mobile
- **Visual badges**: Print/Audiobook format and re-read indicators

### ➕ Add Book

- Form to add new books to your collection
- Fields: title, author, year, month, format, re-read status, notes
- **In-memory storage**: New books persist during the session
- **Validation**: Required fields with error messages
- **Success feedback**: Confirmation when books are added

### 📊 Analytics

- **Yearly Chart**: Bar chart showing books read per year
- **Statistics**: Total books, re-reads, active years, unique authors
- **Interactive**: Hover tooltips on chart elements

## 🚀 Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open in browser**: http://localhost:3000

## 📂 Project Structure

```
src/
├── components/
│   ├── BookList.vue      # Main book display with filtering
│   ├── AddBookDialog.vue # Form for adding new books
│   └── YearlyChart.vue   # Chart.js visualization
├── composables/
│   └── useBooks.js       # Book data management
├── App.vue               # Main application layout
├── main.js               # Vue app entry point
└── style.css             # Tailwind CSS imports
```

## 📊 Data Format

Books are stored in `public/books.json` with this structure:

```json
{
  "title": "Book Title",
  "author": "Author Name",
  "year": 2024,
  "month": "January",
  "format": "print",
  "reread": false,
  "notes": "Optional notes"
}
```

## 🎨 Features in Detail

### Book Covers

- Automatically fetches covers from Open Library API
- Fallback placeholder for missing covers
- Lazy loading for performance

### Responsive Design

- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interface

### Data Persistence

- Original data loaded from JSON file
- New books stored in memory during session
- Combined view of original + added books

## 🔧 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Future Enhancements

- [ ] LocalStorage persistence for added books
- [ ] Export functionality (JSON/CSV)
- [ ] Book recommendations
- [ ] Reading goals and progress tracking
- [ ] More chart types (genres, reading pace)
- [ ] Dark mode toggle

---

Built with ❤️ using Vue 3 and modern web technologies.
