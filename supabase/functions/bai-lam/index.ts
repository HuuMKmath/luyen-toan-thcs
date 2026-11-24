// Hàm máy chủ Supabase "bai-lam": học sinh đăng nhập bằng mã, nhận đề (không kèm đáp án), nộp bài để máy chủ chấm.
// Logic nằm ở xu-ly.js; tệp này chỉ nối với cơ sở dữ liệu thật và trả lời trình duyệt.
//
// Biến môi trường (Supabase tự có sẵn): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
// Tùy chọn: PHIEN_BI_MAT – khóa ký phiên học sinh (không đặt thì dùng khóa service_role).
// Tùy chọn: CHO_PHEP_TRANG – các địa chỉ trang được gọi hàm, cách nhau dấu phẩy.
import { createClient } from "npm:@supabase/supabase-js@2";
import { xuLy } from "./xu-ly.js";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});
const BI_MAT = Deno.env.get("PHIEN_BI_MAT") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CHO_PHEP = (Deno.env.get("CHO_PHEP_TRANG") || "").split(",").map(s => s.trim()).filter(Boolean);

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
    const { data, error } = await sb.from("hoc_sinh").select("id, ho_ten, goi").eq("ma_hs", ma).eq("dang_hoc", true).maybeSingle();
    if (error) loiDb(error);
    return data;
  },
  async lopChinh(hs: string) {
    const { data, error } = await sb.from("lop_hoc_sinh").select("thu_tu, lop!inner(ten, khoi, loai, dang_dung)")
      .eq("hoc_sinh_id", hs).neq("lop.loai", "gv").order("thu_tu").limit(1);
    if (error) loiDb(error);
    return data && data[0] ? (data[0] as any).lop : null;
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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const h = cors(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: h });
  if (req.method !== "POST") return new Response("Chỉ nhận POST", { status: 405, headers: h });
  let kq;
  try {
    kq = await xuLy(await req.json(), { db, bi_mat: BI_MAT });
  } catch (e) {
    console.error(e);
    kq = { ok: false, loi: "may_chu", thong_bao: "Máy chủ đang bận. Em thử lại sau ít phút nhé." };
  }
  return new Response(JSON.stringify(kq), { headers: { ...h, "Content-Type": "application/json; charset=utf-8" } });
});
