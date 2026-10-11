# QuickNotes

QuickNotes is a lightweight browser note app for capturing short personal, work, and study reminders. It focuses on quick entry, readable timestamps, category-based styling, local persistence, and text search without requiring a backend.

## Features

- Add notes with Personal, Work, or Study categories.
- Reject empty notes and notes longer than 200 characters.
- Save notes in `localStorage` and restore them on refresh.
- Search notes case-insensitively by text.
- Delete individual notes without affecting the rest of the list.
- Show a live note count and a helpful empty-state message.

## Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/quicknotes-app.git
   cd quicknotes-app
   ```

2. Open the folder in VS Code.

3. Start a local web server. For example, use the Live Server extension in VS Code, or run any static server from the project root.

4. Open `index.html` in your browser through that local server.

## What I Learned

- Semantic HTML makes it easier to organize an app into clear sections without adding extra JavaScript complexity.
- `localStorage` works well for small client-only apps when the stored data is validated before use.
- Building the UI entirely with `createElement()` and `textContent` is a simple way to avoid injecting unsafe user content.