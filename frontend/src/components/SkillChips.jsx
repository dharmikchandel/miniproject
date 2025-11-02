import React from 'react';

function SkillChips({ skills, onChange }) {
  const all = [ 'react', 'node', 'express', 'typescript', 'golang', 'solidity', 'jest', 'kubernetes', 'aws', 'gcp', 'docker', 'mongodb', 'SQL' ];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
      {all.map(s => (
        <button
          key={s}
          onClick={() => {
            const set = new Set(skills);
            set.has(s) ? set.delete(s) : set.add(s);
            onChange(Array.from(set));
          }}
          className={`brutal-chip ${skills.includes(s) ? 'active' : ''}`}
        >
          {skills.includes(s) ? '✓ ' : ''}{s}
        </button>
      ))}
    </div>
  );
}

export default SkillChips;

