interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InputBar({ value, onChange }: InputBarProps) {
  return (
    <div className="input-bar">
      <input
        type="text"
        placeholder="Zoek of stel een vraag"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button className="plus-btn">+</button>
    </div>
  );
}
