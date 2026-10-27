import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KhachApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngay, tien } from '../utils/format'
import { Badge, Empty, PageHead } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { VAN_PHONG } from '../data/listings'

export default function HopDongCuaToi() {
  const toast = useToast()
  const [hd, setHd] = useState(undefined)

  useEffect(() => {
    KhachApi.hopDong()
      .then((r) => setHd(r.status === 204 ? null : r.data))
      .catch((e) => toast.loi(thongBaoLoi(e)))
  }, [toast])

  if (hd === undefined) return <div className="empty">Đang tải hồ sơ thuê…</div>
  if (!hd) {
    return (
      <>
        <PageHead kicker="My lease" title="Hồ sơ thuê" desc="Chưa có hợp đồng đang hiệu lực trên tài khoản này." />
        <div className="card">
          <Empty text="Leasing desk chưa gắn căn. Liên hệ concierge nếu bạn vừa ký." />
          <Link to="/quan-ly/ho-tro" className="btn btn--gold" style={{ margin: '0 auto 8px', display: 'flex', width: 'fit-content' }}>
            Gặp concierge
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHead kicker="Lease dossier" title={hd.maHopDong} desc={`Căn ${hd.maPhong} · Maison Cư resident file`}>
        <Badge nhom="hopDong" ma={hd.trangThai} />
      </PageHead>

      <section className="portal-hero">
        <img src="/properties/interior.jpg" alt="" />
        <div>
          <p className="page-kicker" style={{ color: 'var(--gold-2)' }}>{hd.maPhong}</p>
          <h2>{tien(hd.giaThue)} <span>/ tháng</span></h2>
          <p>{ngay(hd.ngayBatDau)} → {ngay(hd.ngayKetThuc)} · còn {hd.soNgayConLai ?? '—'} ngày</p>
        </div>
      </section>

      <div className="detail-grid">
        <div className="card">
          <h3>Điều khoản đang hiệu lực</h3>
          <dl className="kv">
            <dt>Thời hạn</dt><dd>{ngay(hd.ngayBatDau)} → {ngay(hd.ngayKetThuc)}</dd>
            <dt>Còn lại</dt><dd>{hd.soNgayConLai} ngày</dd>
            <dt>Giá thuê</dt><dd>{tien(hd.giaThue)}</dd>
            <dt>Tiền cọc</dt><dd>{tien(hd.tienCoc)}</dd>
            <dt>Người đại diện</dt><dd>{hd.khachThue?.hoTen || 'Bạn'}</dd>
            <dt>Người ở cùng</dt>
            <dd>{hd.nguoiOCung?.length ? hd.nguoiOCung.map((n) => n.hoTen).join(', ') : 'Không'}</dd>
            <dt>Ghi chú</dt><dd>{hd.ghiChu || '—'}</dd>
          </dl>
        </div>
        <div className="card">
          <h3>Dịch vụ gắn căn</h3>
          {!hd.dichVu?.length ? (
            <p className="muted">Không có dịch vụ gắn kèm.</p>
          ) : (
            <table className="spec-table">
              <tbody>
                {hd.dichVu.map((dv) => (
                  <tr key={dv.dichVuId}>
                    <th>{dv.tenDichVu}</th>
                    <td>{tien(dv.donGia)}/{dv.donVi} × {dv.soLuong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="muted" style={{ marginTop: 18 }}>
            Cần gia hạn hoặc bảo trì? Desk nhận việc trong {VAN_PHONG.gio}.
          </p>
          <Link to="/quan-ly/ho-tro" className="btn btn--ghost" style={{ marginTop: 8 }}>Mở concierge</Link>
        </div>
      </div>
    </>
  )
}
