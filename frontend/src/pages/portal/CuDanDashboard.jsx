import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KhachApi, ThongBaoApi } from '../../api/services'
import { thongBaoLoi } from '../../api/client'
import { ngay, tien } from '../../utils/format'
import { Badge, Empty, PageHead } from '../../components/ui'
import { Icon } from '../../components/icons'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { VAN_PHONG } from '../../data/listings'

export default function CuDanDashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [hd, setHd] = useState(undefined)
  const [chuaDoc, setChuaDoc] = useState(0)

  useEffect(() => {
    KhachApi.hopDong()
      .then((r) => setHd(r.status === 204 ? null : r.data))
      .catch((e) => toast.loi(thongBaoLoi(e)))
    ThongBaoApi.chuaDoc()
      .then(({ data }) => setChuaDoc(data.soChuaDoc || 0))
      .catch(() => {})
  }, [toast])

  if (hd === undefined) return <div className="empty">Đang mở cổng cư dân…</div>

  return (
    <>
      <PageHead
        kicker="Resident portal"
        title={`Xin chào, ${user?.hoTen?.split(' ').slice(-1)[0] || 'cư dân'}`}
        desc="Hợp đồng, thông báo và liên hệ leasing desk — một bàn cho người đang ở."
      />

      <section className="portal-hero">
        <img src="/properties/living.jpg" alt="" />
        <div>
          <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>Maison Cư · Resident desk</p>
          {hd ? (
            <>
              <h2>Căn {hd.maPhong}</h2>
              <p>Hợp đồng {hd.maHopDong} · còn {hd.soNgayConLai ?? '—'} ngày</p>
              <div className="portal-hero__meta">
                <Badge nhom="hopDong" ma={hd.trangThai} />
                <span>{ngay(hd.ngayBatDau)} → {ngay(hd.ngayKetThuc)}</span>
                <strong>{tien(hd.giaThue)}/tháng</strong>
              </div>
            </>
          ) : (
            <>
              <h2>Chưa gắn căn đang thuê</h2>
              <p>Leasing desk sẽ liên hệ khi hợp đồng được kích hoạt. Hotline {VAN_PHONG.dienThoai}.</p>
            </>
          )}
        </div>
      </section>

      <div className="quick-grid">
        <Link to="/quan-ly/hop-dong-cua-toi" className="quick-card">
          <Icon name="file" />
          <strong>Hồ sơ thuê</strong>
          <span>Thời hạn, cọc, người ở cùng và dịch vụ.</span>
        </Link>
        <Link to="/quan-ly/thong-bao" className="quick-card">
          <Icon name="bell" />
          <strong>Thông báo</strong>
          <span>{chuaDoc > 0 ? `${chuaDoc} thư chưa đọc` : 'Không có thư mới từ desk.'}</span>
        </Link>
        <Link to="/quan-ly/ho-so" className="quick-card">
          <Icon name="user" />
          <strong>Hồ sơ thành viên</strong>
          <span>{user?.tenDangNhap} · khách thuê</span>
        </Link>
        <Link to="/quan-ly/ho-tro" className="quick-card">
          <Icon name="phone" />
          <strong>Gặp concierge</strong>
          <span>{VAN_PHONG.gio}</span>
        </Link>
      </div>

      <div className="detail-grid">
        <div className="card">
          <div className="card-head">
            <h3>Tình trạng lưu trú</h3>
            {hd && <Link to="/quan-ly/hop-dong-cua-toi" className="muted">Mở hồ sơ →</Link>}
          </div>
          {!hd ? (
            <Empty text="Chưa có hợp đồng hiệu lực trên tài khoản này." />
          ) : (
            <dl className="kv">
              <dt>Mã căn</dt><dd>{hd.maPhong}</dd>
              <dt>Giá thuê</dt><dd>{tien(hd.giaThue)}</dd>
              <dt>Tiền cọc</dt><dd>{tien(hd.tienCoc)}</dd>
              <dt>Người ở cùng</dt>
              <dd>{hd.nguoiOCung?.length ? hd.nguoiOCung.map((n) => n.hoTen).join(', ') : 'Chỉ mình bạn'}</dd>
              <dt>Dịch vụ</dt>
              <dd>{hd.dichVu?.length ? `${hd.dichVu.length} hạng mục` : 'Chưa gắn'}</dd>
            </dl>
          )}
        </div>
        <aside className="card">
          <p className="page-kicker">House rules</p>
          <h3>Việc cư dân hay cần</h3>
          <ul className="check-list">
            <li>Gia hạn: báo desk trước 60 ngày hết hạn</li>
            <li>Bảo trì: ghi vào thư hoặc gọi concierge</li>
            <li>Khách lưu trú đêm: thông báo quản lý tòa</li>
            <li>Đổi mật khẩu cổng trong mục bảo mật</li>
          </ul>
          <Link to="/quan-ly/doi-mat-khau" className="btn btn--ghost" style={{ marginTop: 16 }}>
            <Icon name="key" size={14} /> Đổi mật khẩu
          </Link>
        </aside>
      </div>
    </>
  )
}
