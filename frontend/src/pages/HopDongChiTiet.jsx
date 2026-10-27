import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HopDongApi } from '../api/services'
import { thongBaoLoi } from '../api/client'
import { ngay, ngayGio, tien } from '../utils/format'
import { Actions, Badge, Field, Modal, PageHead } from '../components/ui'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function HopDongChiTiet() {
  const { id } = useParams()
  const toast = useToast()
  const { laNhanVien } = useAuth()
  const [hd, setHd] = useState(null)
  const [giaHan, setGiaHan] = useState(null)
  const [thanhLy, setThanhLy] = useState(null)
  const [dangGui, setDangGui] = useState(false)

  function tai() {
    HopDongApi.chiTiet(id).then((r) => setHd(r.data)).catch((e) => toast.loi(thongBaoLoi(e)))
  }
  useEffect(() => { tai() }, [id]) // eslint-disable-line

  async function guiGiaHan(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      await HopDongApi.giaHan(id, {
        ngayKetThucMoi: giaHan.ngayKetThucMoi,
        giaThueMoi: giaHan.giaThueMoi === '' ? null : Number(giaHan.giaThueMoi),
      })
      toast.thanhCong('Đã gia hạn hợp đồng')
      setGiaHan(null)
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  async function guiThanhLy(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      await HopDongApi.thanhLy(id, {
        tienKhauTru: Number(thanhLy.tienKhauTru),
        ghiChu: thanhLy.ghiChu || null,
      })
      toast.thanhCong('Đã thanh lý hợp đồng')
      setThanhLy(null)
      tai()
    } catch (err) {
      toast.loi(thongBaoLoi(err))
    } finally {
      setDangGui(false)
    }
  }

  if (!hd) return <div className="empty">Đang tải hợp đồng…</div>
  const hieuLuc = hd.trangThai === 'hieu_luc'

  return (
    <>
      <PageHead
        kicker={laNhanVien ? 'Lease file' : 'My lease'}
        title={hd.maHopDong}
        desc={<>{laNhanVien ? <Link to="/quan-ly/hop-dong">← Hợp đồng</Link> : 'Hợp đồng của bạn'} · Phòng {hd.maPhong} · tạo {ngayGio(hd.createdAt)}</>}
      >
        <div className="row-actions">
          <Badge nhom="hopDong" ma={hd.trangThai} />
          {laNhanVien && hieuLuc && (
            <>
              <button className="btn btn--ghost" onClick={() => setGiaHan({ ngayKetThucMoi: hd.ngayKetThuc, giaThueMoi: '' })}>Gia hạn</button>
              <button className="btn btn--warn" onClick={() => setThanhLy({ tienKhauTru: 0, ghiChu: '' })}>Thanh lý</button>
            </>
          )}
        </div>
      </PageHead>
      <div className="detail-grid">
        <div className="card">
          <dl className="kv">
            <dt>Khách đại diện</dt><dd>{hd.khachThue?.hoTen} · {hd.khachThue?.sdt}</dd>
            <dt>Người ở cùng</dt>
            <dd>{hd.nguoiOCung?.length ? hd.nguoiOCung.map((n) => n.hoTen).join(', ') : 'Không'}</dd>
            <dt>Thời hạn</dt><dd>{ngay(hd.ngayBatDau)} → {ngay(hd.ngayKetThuc)} ({hd.soNgayConLai ?? '—'} ngày)</dd>
            <dt>Giá thuê</dt><dd>{tien(hd.giaThue)}</dd>
            <dt>Tiền cọc</dt><dd>{tien(hd.tienCoc)}</dd>
            <dt>Công nợ</dt><dd>{tien(hd.congNo)}</dd>
            <dt>Thanh lý</dt><dd>{hd.ngayThanhLy ? `${ngay(hd.ngayThanhLy)} · khấu trừ ${tien(hd.tienKhauTru)} · hoàn ${tien(hd.tienHoanCoc)}` : '—'}</dd>
            <dt>Ghi chú</dt><dd>{hd.ghiChu || '—'}</dd>
          </dl>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Dịch vụ</h3>
          {!hd.dichVu?.length ? <p className="muted">Không gắn dịch vụ.</p> : (
            <table>
              <thead><tr><th>Tên</th><th>Đơn giá</th><th>SL</th></tr></thead>
              <tbody>
                {hd.dichVu.map((dv) => (
                  <tr key={dv.dichVuId}>
                    <td>{dv.tenDichVu}</td>
                    <td>{tien(dv.donGia)}/{dv.donVi}</td>
                    <td>{dv.soLuong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {giaHan && (
        <Modal title="Gia hạn hợp đồng" onClose={() => setGiaHan(null)}>
          <form onSubmit={guiGiaHan}>
            <div className="form-grid">
              <Field label="Ngày kết thúc mới"><input type="date" required value={giaHan.ngayKetThucMoi} onChange={(e) => setGiaHan({ ...giaHan, ngayKetThucMoi: e.target.value })} /></Field>
              <Field label="Giá thuê mới (tùy chọn)"><input type="number" min={0} value={giaHan.giaThueMoi} onChange={(e) => setGiaHan({ ...giaHan, giaThueMoi: e.target.value })} /></Field>
            </div>
            <Actions onClose={() => setGiaHan(null)} dangGui={dangGui} submitLabel="Gia hạn" />
          </form>
        </Modal>
      )}
      {thanhLy && (
        <Modal title="Thanh lý hợp đồng" onClose={() => setThanhLy(null)}>
          <form onSubmit={guiThanhLy}>
            <div className="form-grid">
              <Field label="Tiền khấu trừ"><input type="number" min={0} required value={thanhLy.tienKhauTru} onChange={(e) => setThanhLy({ ...thanhLy, tienKhauTru: e.target.value })} /></Field>
              <Field label="Ghi chú" full><textarea rows={3} value={thanhLy.ghiChu} onChange={(e) => setThanhLy({ ...thanhLy, ghiChu: e.target.value })} /></Field>
            </div>
            <Actions onClose={() => setThanhLy(null)} dangGui={dangGui} submitLabel="Xác nhận thanh lý" />
          </form>
        </Modal>
      )}
    </>
  )
}
