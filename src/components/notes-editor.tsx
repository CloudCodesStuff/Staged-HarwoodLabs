'use client';

import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  important: boolean;
}

interface NotesEditorProps {
  notes: Note[];
  onUpdate: (notes: Note[]) => void;
}

export function NotesEditor({ notes, onUpdate }: NotesEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const addNote = () => {
    if (!newNote.title.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date().toLocaleDateString(),
      important: false,
    };
    onUpdate([note, ...notes]);
    setNewNote({ title: '', content: '' });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    onUpdate(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteNote = (id: string) => {
    onUpdate(notes.filter((n) => n.id !== id));
  };

  const toggleImportant = (id: string) => {
    updateNote(id, { important: !notes.find((n) => n.id === id)?.important });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note */}
        <div className="space-y-3 rounded-lg border p-4">
          <Input
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            placeholder="Note title"
            value={newNote.title}
          />
          <Textarea
            onChange={(e) =>
              setNewNote({ ...newNote, content: e.target.value })
            }
            placeholder="Write your note here..."
            rows={3}
            value={newNote.content}
          />
          <Button disabled={!newNote.title.trim()} onClick={addNote} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div className="rounded-lg border p-4" key={note.id}>
              {editingId === note.id ? (
                <div className="space-y-3">
                  <Input
                    onChange={(e) =>
                      updateNote(note.id, { title: e.target.value })
                    }
                    value={note.title}
                  />
                  <Textarea
                    onChange={(e) =>
                      updateNote(note.id, { content: e.target.value })
                    }
                    rows={3}
                    value={note.content}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingId(null)} size="sm">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      size="sm"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{note.title}</h4>
                      {note.important && (
                        <Badge
                          className="bg-yellow-100 text-yellow-800"
                          variant="secondary"
                        >
                          Important
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="h-3 w-3" />
                      {note.createdAt}
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-700 text-sm">
                    {note.content}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setEditingId(note.id)}
                      size="sm"
                      variant="ghost"
                    >
                      Edit
                    </Button>
                    <Button
                      className={note.important ? 'text-yellow-600' : ''}
                      onClick={() => toggleImportant(note.id)}
                      size="sm"
                      variant="ghost"
                    >
                      {note.important ? 'Unmark' : 'Mark Important'}
                    </Button>
                    <Button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => deleteNote(note.id)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No notes yet. Add your first project note above.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
