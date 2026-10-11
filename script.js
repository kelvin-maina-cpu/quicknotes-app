const STORAGE_KEY = 'quicknotes-notes';
const VALID_CATEGORIES = new Set(['personal', 'work', 'study']);

const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');

let notes = loadNotes();
let searchTerm = '';

function isValidStoredNote(note) {
  return Boolean(
    note
      && typeof note === 'object'
      && typeof note.id === 'string'
      && typeof note.text === 'string'
      && typeof note.category === 'string'
      && VALID_CATEGORIES.has(note.category)
      && typeof note.createdAt === 'string'
      && note.text.trim().length > 0
      && note.text.length <= 200
  );
}

function loadNotes() {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isValidStoredNote);
  } catch {
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatCategoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function createNoteId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function updateNoteCount() {
  if (notes.length === 0) {
    noteCount.textContent = 'You have no notes yet.';
    return;
  }

  if (notes.length === 1) {
    noteCount.textContent = 'You have 1 note.';
    return;
  }

  noteCount.textContent = `You have ${notes.length} notes.`;
}

function render() {
  notesList.replaceChildren();

  const filteredNotes = searchTerm
    ? notes.filter((note) => note.text.toLowerCase().includes(searchTerm))
    : notes;

  if (searchTerm && filteredNotes.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'empty-state';
    emptyItem.textContent = 'No notes match your search.';
    notesList.append(emptyItem);
    updateNoteCount();
    return;
  }

  filteredNotes.forEach((note) => {
    const listItem = document.createElement('li');
    const card = document.createElement('article');
    card.className = `note-card category-${note.category}`;

    const noteText = document.createElement('p');
    noteText.textContent = note.text;

    const noteCategoryText = document.createElement('p');
    noteCategoryText.className = 'note-meta';
    noteCategoryText.textContent = `Category: ${formatCategoryLabel(note.category)}`;

    const noteDate = document.createElement('p');
    noteDate.className = 'note-meta';
    noteDate.textContent = `Created: ${note.createdAt}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'note-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.id = note.id;

    card.append(noteText, noteCategoryText, noteDate, deleteButton);
    listItem.append(card);
    notesList.append(listItem);
  });

  updateNoteCount();
}

function setError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  setError('');
}

function handleNoteSubmit(event) {
  event.preventDefault();

  const noteText = noteInput.value;
  const trimmedText = noteText.trim();

  if (trimmedText.length === 0) {
    setError('Please type a note first.');
    return;
  }

  if (noteText.length > 200) {
    setError('Notes must be 200 characters or fewer.');
    return;
  }

  const newNote = {
    id: createNoteId(),
    text: noteText,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  };

  notes = [...notes, newNote];
  saveNotes();
  noteForm.reset();
  noteInput.focus();
  clearError();
  render();
}

function handleNotesClick(event) {
  const deleteButton = event.target.closest('button[data-id]');
  if (!deleteButton) {
    return;
  }

  const noteId = deleteButton.dataset.id;
  notes = notes.filter((note) => note.id !== noteId);
  saveNotes();
  render();
}

function handleSearchInput(event) {
  searchTerm = event.target.value.trim().toLowerCase();
  render();
}

noteForm.addEventListener('submit', handleNoteSubmit);
notesList.addEventListener('click', handleNotesClick);
searchInput.addEventListener('input', handleSearchInput);

render();