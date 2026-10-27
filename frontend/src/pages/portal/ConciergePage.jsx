import { useState } from 'react'
import { PageHead } from '../../components/ui'
import { useToast } from '../../context/ToastContext'
import { VAN_PHONG, DOI_NGU } from '../../data/listings'

export default function ConciergePage() {
  const toast = useToast()
  const [form, setForm] = useState({ chuDe: 'bao-tri', noiDung: '' })

  function gui(e) {
    e.preventDefault()
    toast.thanhCong('Đã gửi tới resident manager. Desk sẽ phản hồi trong giờ hành chính.')
    setForm({ chuDe: 'bao-tri', noiDung: '' })
  }

  return (
    <>
      <PageHead
        kicker="Concierge"
        title="Gặp leasing desk"
        desc={`${VAN_PHONG.diaChi} · ${VAN_PHONG.gio}`}
      />
      <div className="detail-grid">
        <form className="card" onSubmit={gui}>
          <p className="page-kicker">Work order</p>
          <h3>Gửi yêu cầu nội bộ</h3>
          <p className="muted">Bảo trì, gia hạn, khách lưu trú hoặc giấy tờ tạm trú — không dùng form này cho việc khẩn cấp ngoài giờ.</p>
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div className="field field--full">
              <label>Chủ đề</label>
              <select value={form.chuDe} onChange={(e) => setForm({ ...form, chuDe: e.target.value })}>
                <option value="bao-tri">Bảo trì / sự cố căn</option>
                <option value="gia-han">Hỏi gia hạn hợp đồng</option>
                <option value="tam-tru">Giấy tờ tạm trú</option>
                <option value="khac">Việc khác</option>
              </select>
            </div>
            <div className="field field--full">
              <label>Nội dung</label>
              <textarea rows={5} required value={form.noiDung} onChange={(e) => setForm({ ...form, noiDung: e.target.value })} />
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn--gold" type="submit">Gửi desk</button>
          </div>
        </form>
        <aside className="card">
          <h3>Liên hệ trực tiếp</h3>
          <dl className="kv">
            <dt>Hotline</dt><dd>{VAN_PHONG.dienThoai}</dd>
            <dt>Email</dt><dd>{VAN_PHONG.email}</dd>
            <dt>Giờ</dt><dd>{VAN_PHONG.gio}</dd>
          </dl>
          <p className="page-kicker" style={{ marginTop: 22 }}>Resident manager</p>
          {DOI_NGU.filter((p) => p.chucVu.includes('Resident')).map((p) => (
            <article key={p.ten} className="mini-advisor">
              <img src={p.anh} alt="" />
              <div>
                <strong>{p.ten}</strong>
                <span>{p.chucVu}</span>
              </div>
            </article>
          ))}
        </aside>
      </div>
    </>
  )
}
