import { useRef } from 'react';
import '../../styles/components/search-box.css';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBox({ value, onChange, placeholder = 'Buscar suculentas…' }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="search-box">
      <span className="search-box__icon" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <line x1="13.5" y1="13.5" x2="18" y2="18" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        className="search-box__input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          className="search-box__clear"
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          type="button"
          aria-label="Limpiar búsqueda"
        >
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>
      )}
    </div>
  );
}
