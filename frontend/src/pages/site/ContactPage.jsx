import { useState } from 'react'
import { Link } from 'react-router-dom'
import { VAN_PHONG, DOI_NGU } from '../../data/listings'
import { useToast } from '../../context/ToastContext'
import SiteBanner from '../../components/site/SiteBanner'

export default function ContactPage() {
  const toast = useToast()
  const [form, setForm] = useState({ ten: '', sdt: '', email: '', nhuCau: 'thue', noiDung: '' })

  function gui(e) {
    e.preventDefault()
    toast.thanhCong('Đã nhận liên hệ. Bộ phận leasing sẽ phản hồi trong giờ làm việc.')
    setForm({ ten: '', sdt: '', email: '', nhuCau: 'thue', noiDung: '' })
  }

  return (
    <>
      <SiteBanner
        kicker="Leasing desk"
        title="Gặp chúng tôi tại Nguyễn Huệ."
        desc="Xem nhà, gửi căn vào quỹ, hoặc hỏi hợp đồng đang hiệu lực. Advisor xác nhận trong giờ hành chính."
        anh="/properties/office.jpg"
        compact
      />
      <div className="site-page">
        <div className="detail-grid">
          <form className="card" onSubmit={gui}>
            <p className="page-kicker">Enquire</p>
            <h3>Gửi yêu cầu</h3>
            <div className="form-grid">
              <div className="field">
                <label>Họ tên</label>
                <input required value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} />
              </div>
              <div className="field">
                <label>Điện thoại</label>
                <input required value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field field--full">
                <label>Nhu cầu</label>
                <select value={form.nhuCau} onChange={(e) => setForm({ ...form, nhuCau: e.target.value })}>
                  <option value="thue">Tôi muốn thuê</option>
                  <option value="chu">Tôi là chủ nhà</option>
                  <option value="cu-dan">Tôi là cư dân</option>
                </select>
              </div>
              <div className="field field--full">
                <label>Nội dung</label>
                <textarea rows={5} required value={form.noiDung} onChange={(e) => setForm({ ...form, noiDung: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn--gold" type="submit">Gửi liên hệ</button>
            </div>
          </form>
          <aside className="card">
            <h3>Văn phòng Nguyễn Huệ</h3>
            <dl className="kv">
              <dt>Địa chỉ</dt><dd>{VAN_PHONG.diaChi}</dd>
              <dt>Điện thoại</dt><dd>{VAN_PHONG.dienThoai}</dd>
              <dt>Email</dt><dd>{VAN_PHONG.email}</dd>
              <dt>Giờ làm</dt><dd>{VAN_PHONG.gio}</dd>
            </dl>
            <div className="map-frame">
              <iframe
                title="Bản đồ Maison Cư"
                src="https://maps.google.com/maps?q=27%20Nguyen%20Hue%20District%201%20Ho%20Chi%20Minh&t=&z=16&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
              />
            </div>
            <p className="muted" style={{ marginTop: 16 }}>Cư dân đã có tài khoản dùng cổng cư dân để xem hồ sơ thuê, thông báo và gửi concierge.</p>
          </aside>
        </div>
        <p className="page-kicker" style={{ marginTop: 48 }}>Advisors</p>
        <h2>Ai sẽ gọi lại cho bạn</h2>
        <div className="team-grid" style={{ marginTop: 18 }}>
          {DOI_NGU.map((p) => (
            <Link key={p.ten} to={`/doi-ngu/${p.id}`} className="team-card">
              <img src={p.anh} alt="" />
              <div>
                <h3>{p.ten}</h3>
                <p className="page-kicker">{p.chucVu}</p>
                <p className="muted">{p.khu}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
