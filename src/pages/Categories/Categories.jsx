import {useState} from 'react'
import useIndexedDbState from '../../hooks/useIndexedDbState'
import ActionIcon from '../../components/ActionIcon/ActionIcon'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import NotificationBell from '../../components/NotificationBell/NotificationBell'
import './Categories.css'

const seedCategories = [
    {id: 1, name: 'Hợp Đồng', group: 'Doanh thu', icon: '$', internal: false},
    {id: 2, name: 'Thu SQTM', group: 'Doanh thu', icon: '▣', internal: false},
    {id: 3, name: 'Thu TGĐ', group: 'Doanh thu', icon: '▣', internal: true},
    {id: 4, name: 'Hoàn Ứng', group: 'Doanh thu', icon: '▤', internal: true},
    {id: 5, name: 'Hoạt Động Tài Chính', group: 'Doanh thu', icon: '↗', internal: false},
    {id: 6, name: 'Vay Giải Ngân', group: 'Doanh thu', icon: '▦', internal: true},
    {id: 7, name: 'Chi Lương', group: 'Chi phí', icon: '▣', internal: false},
    {id: 8, name: 'Chi Công Tác', group: 'Chi phí', icon: '✈', internal: false},
    {id: 9, name: 'Chi Thuê Văn Phòng', group: 'Chi phí', icon: '▦', internal: false},
    {id: 10, name: 'Chi Khác', group: 'Chi phí', icon: '▣', internal: false},
    {id: 11, name: 'Trả Lãi Vay Ngoài', group: 'Chi phí', icon: '◇', internal: false},
    {id: 12, name: 'Trả Lãi Vay Ngân Hàng', group: 'Chi phí', icon: '◇', internal: false},
    {id: 13, name: 'Thuế, Phí, Lệ Phí', group: 'Chi phí', icon: '▥', internal: false},
    {id: 14, name: 'Bảo Hiểm Xã Hội', group: 'Chi phí', icon: '▥', internal: false},
    {id: 15, name: 'Hợp Đồng', group: 'Chi phí', icon: '$', internal: false},
    {id: 16, name: 'Chi Dịch Vụ Văn Phòng', group: 'Chi phí', icon: '⌕', internal: false},
    {id: 17, name: 'Tạm Ứng', group: 'Chi phí', icon: '▤', internal: true},
    {id: 18, name: 'Vay Giải Ngân', group: 'Chi phí', icon: '▦', internal: true},
]

const iconOptions = ['$', '▣', '▤', '↗', '▦', '✈', '◇', '▥', '⌕']

function CategoryForm({category, defaultGroup, onClose, onSave}) {
    const [icon, setIcon] = useState(category?.icon || '$')
    const submit = (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        onSave({
            ...category,
            name: form.get('name'),
            group: form.get('group'),
            internal: form.get('internal') === 'on',
            icon,
        })
    }

    return (
        <div className="category-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <section className="category-modal" role="dialog" aria-modal="true">
                <header><h2>{category ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
                    <button type="button" onClick={onClose}>×</button>
                </header>
                <form onSubmit={submit}>
                    <label>Tên danh mục: <b>*</b><input name="name" required defaultValue={category?.name}
                                                        placeholder="Nhập tên danh mục"/></label>
                    <label>Loại danh mục: <b>*</b><select name="group" defaultValue={category?.group || defaultGroup}>
                        <option>Doanh thu</option>
                        <option>Chi phí</option>
                    </select></label>
                    <fieldset>
                        <legend>Biểu tượng:</legend>
                        <div className="category-icon-picker">{iconOptions.map((item) => <button type="button"
                                                                                                 className={icon === item ? 'selected' : ''}
                                                                                                 key={item}
                                                                                                 onClick={() => setIcon(item)}>{item}</button>)}</div>
                    </fieldset>
                    <label className="internal-check"><input type="checkbox" name="internal"
                                                             defaultChecked={category?.internal}/>
                        <span>Danh mục nội bộ</span></label>
                    <footer>
                        <button type="button" onClick={onClose}>Hủy</button>
                        <button type="submit">Lưu danh mục</button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

function CategorySection({categories, onEdit, onDelete}) {
    return (
        <section className="category-section">
            <div className="category-grid">
                {categories.map((category) => (
                    <article className="category-card" key={category.id}>
                        <span className="category-card__icon">{category.icon}</span>
                        <div className="category-card__name"><h3>{category.name}</h3>
                            <p>{category.group}</p>{category.internal &&
                                <em>{category.group === 'Doanh thu' ? 'Thu nội bộ' : 'Chi nội bộ'}</em>}</div>
                        <div className="category-card__actions"><ActionIcon icon="edit" label="Sửa danh mục"
                                                                            onClick={() => onEdit(category)}/><ActionIcon
                            icon="trash" tone="red" label="Xóa danh mục" onClick={() => onDelete(category)}/></div>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default function Categories() {
    const [categories, setCategories] = useIndexedDbState('categories', seedCategories)
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState(undefined)
    const [defaultGroup, setDefaultGroup] = useState('Doanh thu')
    const [pendingDelete, setPendingDelete] = useState(undefined)
    const [toast, setToast] = useState('')
    const [activeGroup, setActiveGroup] = useState('Doanh thu')

    const notify = (message) => {
        setToast(message)
        window.setTimeout(() => setToast(''), 2000)
    }

    const openAdd = (group = activeGroup) => {
        setEditing(undefined)
        setDefaultGroup(group)
        setFormOpen(true)
    }

    const save = (category) => {
        if (editing) setCategories(categories.map((item) => item.id === editing.id ? category : item))
        else setCategories([...categories, {...category, id: Date.now()}])
        setFormOpen(false)
        notify(editing ? 'Đã cập nhật danh mục' : 'Đã thêm danh mục')
    }

    const confirmDelete = () => {
        setCategories(categories.filter((item) => item.id !== pendingDelete.id))
        setPendingDelete(undefined)
        notify('Đã xóa danh mục')
    }

    return (
        <main className="categories-page">
            <header className="categories-header"><h2>Quản lý danh mục</h2>
                <div>
                    <button className="add-category" onClick={() => openAdd(activeGroup)}>＋ Thêm danh mục</button>
                    <NotificationBell className="categories-bell" count={15} />
                </div>
            </header>
            <div className="category-tabs" role="tablist" aria-label="Loại danh mục">
                {['Doanh thu', 'Chi phí'].map((group) => (
                    <button key={group} role="tab" aria-selected={activeGroup === group}
                            className={activeGroup === group ? 'active' : ''}
                            onClick={() => setActiveGroup(group)}>{group}</button>
                ))}
            </div>
            <CategorySection categories={categories.filter((item) => item.group === activeGroup)} onEdit={(item) => {
                setEditing(item);
                setFormOpen(true)
            }} onDelete={setPendingDelete}/>
            {formOpen && <CategoryForm category={editing} defaultGroup={defaultGroup} onClose={() => setFormOpen(false)}
                                       onSave={save}/>}
            {pendingDelete && <ConfirmDialog
                message={`Bạn có chắc muốn xóa danh mục “${pendingDelete.name}”? Thao tác này không thể hoàn tác.`}
                onCancel={() => setPendingDelete(undefined)} onConfirm={confirmDelete}/>}
            {toast && <div className="category-toast">{toast}</div>}
        </main>
    )
}
