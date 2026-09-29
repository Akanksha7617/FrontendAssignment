import './Header.css';

export default function Header({ total = 0, openCount = 0 }) {
  return (
    <header className="header">
      <h1>Phoenix Malls <span>Global Map Experience</span></h1>
      {total > 0 && <p aria-live="polite">{openCount} of {total} malls open now</p>}
    </header>
  );
}