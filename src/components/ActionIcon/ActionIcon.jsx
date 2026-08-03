import { IconButton, Tooltip } from '@mui/material'
import { Add, AttachFile, DeleteOutlined, EditOutlined, FormatListBulleted, PrintOutlined } from '@mui/icons-material'

const icons = { add: Add, edit: EditOutlined, trash: DeleteOutlined, print: PrintOutlined, list: FormatListBulleted, attach: AttachFile }
const colors = { red: 'error', green: 'secondary', blue: 'primary', orange: 'warning' }

export default function ActionIcon({ icon, label, tone = 'blue', onClick, className = '', type = 'button' }) {
  const Icon = icons[icon] || EditOutlined
  return <Tooltip title={label}><IconButton type={type} className={className} onClick={onClick} aria-label={label} color={colors[tone] || 'primary'} size="small"><Icon fontSize="small" /></IconButton></Tooltip>
}
