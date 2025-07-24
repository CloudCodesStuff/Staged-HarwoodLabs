'use client';

import { Check, Edit3, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
}

export function EditableField({
  value,
  onChange,
  className,
  placeholder,
  multiline = false,
  disabled = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && e.metaKey && multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (disabled) {
    return <div className={className}>{value || placeholder}</div>;
  }

  if (isEditing) {
    const InputComponent = multiline ? Textarea : Input;

    return (
      <div className="flex items-start gap-2">
        <InputComponent
          className={cn(
            'flex-1',
            multiline ? 'min-h-[60px] resize-none' : 'h-8'
          )}
          onBlur={handleSave}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={inputRef as any}
          rows={multiline ? 3 : undefined}
          value={editValue}
        />
        <div className="mt-1 flex items-center gap-1">
          <button
            className="rounded p-1 text-green-600 transition-colors hover:bg-green-100"
            onClick={handleSave}
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            className="rounded p-1 text-red-600 transition-colors hover:bg-red-100"
            onClick={handleCancel}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative cursor-text transition-all duration-150',
        '-mx-2 -my-1 rounded px-2 py-1 hover:bg-gray-50',
        className
      )}
      onClick={() => setIsEditing(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={cn('block', !value && 'text-muted-foreground italic')}>
        {value || placeholder}
      </span>

      {isHovered && (
        <Edit3 className="-right-1 -top-1 absolute h-3 w-3 rounded border bg-white p-0.5 text-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100" />
      )}
    </div>
  );
}
