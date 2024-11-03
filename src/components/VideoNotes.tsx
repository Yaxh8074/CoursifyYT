import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface VideoNotesProps {
  videoId: string;
  notes: Record<string, string>;
  onSaveNote: (videoId: string, note: string) => void;
}

export function VideoNotes({ videoId, notes, onSaveNote }: VideoNotesProps) {
  const [note, setNote] = useState(notes[videoId] || '');

  const handleSave = () => {
    onSaveNote(videoId, note);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-3">Notes</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] mb-3"
        placeholder="Add your notes here..."
      />
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Save className="w-4 h-4" />
        Save Notes
      </button>
    </div>
  );
}