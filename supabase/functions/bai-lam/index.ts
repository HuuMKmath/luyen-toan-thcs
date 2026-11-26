// Hàm máy chủ Supabase "bai-lam": học sinh đăng nhập bằng mã, nhận đề (không kèm đáp án), nộp bài để máy chủ chấm.
// Logic nằm ở xu-ly.js; tệp này chỉ nối với cơ sở dữ liệu thật và trả lời trình duyệt.
//
// Biến môi trường (Supabase tự có sẵn): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Tùy chọn: PHIEN_BI_MAT – khóa ký phiên học sinh (không đặt thì dùng khóa service_role).
// Tùy chọn: CHO_PHEP_TRANG – các địa chỉ trang được gọi hàm, cách nhau dấu phẩy.
import { createClient } from "npm:@supabase/supabase-js@2";
import { xuLy } from "./xu-ly.js";
import { xuLyCu } from "./tuong-thich.js";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});
const BI_MAT = Deno.env.get("PHIEN_BI_MAT") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CHO_PHEP = (Deno.env.get("CHO_PHEP_TRANG") || "").split(",").map(s => s.trim()).filter(Boolean);

let dsBaiNho: { luc: number; ds: any[] } | null = null;
const loiDb = (e: unknown) => { throw new Error("Lỗi cơ sở dữ liệu: " + JSON.stringify(e)); };

const db = {
  async demSai(phut: number) {
    const { count, error } = await sb.from("tra_ma_sai").select("id", { count: "exact", head: true })
      .gte("luc", new Date(Date.now() - phut * 60000).toISOString());
    if (error) loiDb(error);
    return count || 0;
  },
  async ghiSai() { await sb.from("tra_ma_sai").insert({}); },
  async timHocSinh(ma: string) {
    const { data, error } = await sb.from("hoc_sinh").select("id, ho_ten, ma_hs, goi").eq("ma_hs", ma).eq("dang_hoc", true).maybeSingle();
    if (error) loiDb(error);
    return data;
  },
  // Mọi lớp đang dùng của học sinh, lớp chính (thu_tu nhỏ nhất) đứng đầu
  async cacLop(hs: string) {
    const { data, error } = await sb.from("lop_hoc_sinh").select("thu_tu, lop!inner(ten, khoi, loai, dang_dung)")
      .eq("hoc_sinh_id", hs).eq("lop.dang_dung", true).order("thu_tu");
    if (error) loiDb(error);
    return (data || []).map((r: any) => r.lop);
  },
  async dsBai() {
    if (dsBaiNho && Date.now() - dsBaiNho.luc < 300000) return dsBaiNho.ds;
    const { data, error } = await sb.from("bai_hoc").select("id, khoi, tab_cu");
    if (error) loiDb(error);
    dsBaiNho = { luc: Date.now(), ds: data || [] };
    return dsBaiNho.ds;
  },
  async luotDaNop(hs: string) {
    const { data, error } = await sb.from("luot_lam").select("bai_id, loai, diem, diem_dang, bat_dau, nop_luc")
      .eq("hoc_sinh_id", hs).not("nop_luc", "is", null).in("loai", ["kt25", "kt5", "thu_thach"]);
    if (error) loiDb(error);
    return data || [];
  },
  async goiXong(hs: string) {
    const { data, error } = await sb.from("goi_xong").select("bai_id, goi").eq("hoc_sinh_id", hs);
    if (error) loiDb(error);
    return data || [];
  },
  async ghiGoiXong(hs: string, bai: string, goi: string) {
    const { error } = await sb.from("goi_xong").upsert({ hoc_sinh_id: hs, bai_id: bai, goi }, { onConflict: "hoc_sinh_id,bai_id,goi", ignoreDuplicates: true });
    if (error) loiDb(error);
  },
  async moBai() {
    const { data, error } = await sb.from("mo_bai").select("pham_vi, bai_id").eq("mo", true);
    if (error) loiDb(error);
    return data || [];
  },
  async docThuong(hs: string) {
    const { data, error } = await sb.from("thuong").select("*").eq("hoc_sinh_id", hs).maybeSingle();
    if (error) loiDb(error);
    return data;
  },
  async ghiThuong(hs: string, dong: Record<string, unknown>) {
    const { error } = await sb.from("thuong").upsert({ hoc_sinh_id: hs, ...dong }, { onConflict: "hoc_sinh_id" });
    if (error) loiDb(error);
  },
  async dsXepHang(khoi: number | null) {
    const { data, error } = await sb.rpc("ds_xep_hang", { p_khoi: khoi });
    if (error) loiDb(error);
    return data || [];
  },
  // Sổ điểm giáo viên: các lớp học sinh đang dùng (không kể lớp GV), kèm sĩ số
  async dsLopDay() {
    const { data, error } = await sb.from("lop").select("ten, khoi, lop_hoc_sinh(count)").eq("dang_dung", true).neq("loai", "gv").order("ten");
    if (error) loiDb(error);
    return (data || []).map((l: any) => ({ ten: l.ten, khoi: l.khoi, so: (l.lop_hoc_sinh && l.lop_hoc_sinh[0] && l.lop_hoc_sinh[0].count) || 0 }));
  },
  async dsBaiDayDu() {
    const { data, error } = await sb.from("bai_hoc").select("id, khoi, tieu_de, chuong, thu_tu").order("khoi").order("thu_tu");
    if (error) loiDb(error);
    return data || [];
  },
  async hsTrongLop(ten: string) {
    const { data, error } = await sb.from("lop_hoc_sinh").select("lop!inner(ten, dang_dung), hoc_sinh!inner(id, ho_ten, dang_hoc)")
      .eq("lop.ten", ten).eq("lop.dang_dung", true).eq("hoc_sinh.dang_hoc", true);
    if (error) loiDb(error);
    const thay: Record<string, boolean> = {};
    return (data || []).map((r: any) => r.hoc_sinh).filter((h: any) => !thay[h.id] && (thay[h.id] = true));
  },
  // Mọi lượt đã nộp của các học sinh (đọc từng trang 1000 dòng)
  async luotCuaHS(ids: string[]) {
    const out: any[] = [];
    for (let i = 0; i < ids.length; i += 100) {
      const nhom = ids.slice(i, i + 100);
      for (let tu = 0; ; tu += 1000) {
        const { data, error } = await sb.from("luot_lam").select("hoc_sinh_id, bai_id, loai, diem, nop_luc")
          .in("hoc_sinh_id", nhom).not("nop_luc", "is", null).in("loai", ["kt25", "kt5", "thu_thach"])
          .order("id").range(tu, tu + 999);
        if (error) loiDb(error);
        out.push(...(data || []));
        if (!data || data.length < 1000) break;
      }
    }
    return out;
  },
  async baiHoc(id: string) {
    const { data } = await sb.from("bai_hoc").select("id, khoi, da_mo").eq("id", String(id || "")).maybeSingle();
    return data;
  },
  async maDe(ma: string) {
    const { data } = await sb.from("ma_de").select("ma, bai_id, loai, mo_luc, dong_luc").eq("ma", ma).maybeSingle();
    return data;
  },
  async taoLuot(row: Record<string, unknown>) {
    const { data, error } = await sb.from("luot_lam").insert(row).select("id").single();
    if (error) loiDb(error);
    return data!.id;
  },
  async docLuot(id: string) {
    if (!/^[0-9a-f-]{36}$/.test(String(id || ""))) return null;
    const { data } = await sb.from("luot_lam").select("id, hoc_sinh_id, bai_id, cau_phat, bai_lam, bat_dau, nop_luc, gioi_han_giay").eq("id", id).maybeSingle();
    return data;
  },
  async capNhatLuot(id: string, patch: Record<string, unknown>) {
    const { error } = await sb.from("luot_lam").update(patch).eq("id", id);
    if (error) loiDb(error);
  },
};

function cors(req: Request) {
  const o = req.headers.get("origin") || "";
  const ok = !CHO_PHEP.length || CHO_PHEP.includes(o);
  return {
    "Access-Control-Allow-Origin": ok ? (o || "*") : CHO_PHEP[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const h = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: h });
  if (req.method !== "POST" && req.method !== "GET") return new Response("Chỉ nhận GET, POST", { status: 405, headers: h });
  let kq;
  try {
    if (req.method === "GET") {
      // Các trang gọi như gọi Google Sheet cũ: ?ma=…[&tiendo=1|&bxh=1]
      kq = await xuLyCu(Object.fromEntries(new URL(req.url).searchParams), { db });
    } else {
      const yc = JSON.parse(await req.text());          // trang cũ gửi dạng text/plain
      kq = yc && (yc.gm || yc.xg) ? await xuLyCu(yc, { db }) : await xuLy(yc, { db, bi_mat: BI_MAT });
    }
  } catch (e) {
    console.error(e);
    kq = { ok: false, err: 1, loi: "may_chu", thong_bao: "Máy chủ đang bận. Em thử lại sau ít phút nhé." };
  }
  if (typeof kq === "string") return new Response(kq, { headers: { ...h, "Content-Type": "text/plain; charset=utf-8" } });
  return new Response(JSON.stringify(kq), { headers: { ...h, "Content-Type": "application/json; charset=utf-8" } });
});
