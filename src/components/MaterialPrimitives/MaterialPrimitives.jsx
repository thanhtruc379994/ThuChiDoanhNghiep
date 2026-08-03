import { forwardRef } from 'react'
import {
  Box,
  Button as MuiButton,
  Checkbox,
  InputBase,
  NativeSelect,
  Paper,
  InputAdornment,
  TextField,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
} from '@mui/material'
import { Search } from '@mui/icons-material'

const containedPattern = /(action|download|add-|export-|submit|save|primary)/i

export const Button = forwardRef(function Button({ className = '', ...props }, ref) {
  const variant = props.type === 'submit' || containedPattern.test(className) ? 'contained' : 'outlined'
  return <MuiButton ref={ref} className={className} size="small" variant={variant} {...props} />
})

export const Input = forwardRef(function Input({ className = '', type, ...props }, ref) {
  if (type === 'checkbox') return <Checkbox disableRipple inputRef={ref} className={className} size="small" sx={{ width: 20, height: 20, p: 0 }} {...props} />
  const isSearch = typeof props.placeholder === 'string' && props.placeholder.toLocaleLowerCase('vi').includes('tìm kiếm')
  if (isSearch) return <TextField inputRef={ref} className={className} type={type} size="small" fullWidth slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" color="primary" /></InputAdornment> } }} {...props} />
  return <InputBase inputRef={ref} className={className} type={type} {...props} />
})

export const Textarea = forwardRef(function Textarea({ className = '', ...props }, ref) {
  return <TextField inputRef={ref} className={className} fullWidth size="small" multiline minRows={3} {...props} />
})

export const Select = forwardRef(function Select({ className = '', children, ...props }, ref) {
  return <NativeSelect ref={ref} className={className} {...props}>{children}</NativeSelect>
})

export function Main(props) { return <Box component="main" {...props} /> }
export function Section(props) { return <Paper component="section" {...props} /> }
export function Article(props) { return <Paper component="article" {...props} /> }
export function Header(props) { return <Box component="header" {...props} /> }
export function Footer(props) { return <Box component="footer" {...props} /> }
export function Label(props) { return <Box component="label" {...props} /> }
export function Fieldset(props) { return <Box component="fieldset" {...props} /> }
export function Table(props) { return <MuiTable {...props} /> }
export function TableHead(props) { return <MuiTableHead {...props} /> }
export function TableBody(props) { return <MuiTableBody {...props} /> }
export function TableRow(props) { return <MuiTableRow {...props} /> }
export function TableHeaderCell(props) { return <TableCell component="th" {...props} /> }
export function TableDataCell(props) { return <TableCell {...props} /> }
