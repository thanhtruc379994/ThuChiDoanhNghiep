import './ActionIcon.css'

const paths = {
  add: <><path d="M12 5v14M5 12h14" /></>,
  edit: <><path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" /><path d="m13.8 6.2 4 4" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /></>,
  print: <><path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" /><path d="M7 14h10v6H7zM17.5 12h.01" /></>,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
  attach: <path d="m9 12 5.5-5.5a3 3 0 0 1 4.2 4.2l-7.4 7.4a5 5 0 0 1-7.1-7.1l7.1-7.1" />,
}

export default function ActionIcon({ icon, label, tone = 'blue', onClick, className = '', type = 'button' }) {
  return (
    <button type={type} className={`ui-icon-button ui-icon-button--${tone} ${className}`} onClick={onClick} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">{paths[icon]}</svg>
    </button>
  )
}
