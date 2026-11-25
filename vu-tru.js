/* Bản đồ vũ trụ cho trang Các bài (cac-bai/).
   Mỗi bài học là một thiên thể có thật; hai quỹ đạo Đại số và Hình học chạy song song.
   Bấm vào thiên thể: hiện bảng "Em có biết?" và "Góc toán học", kèm nút vào bài.

   Thêm bài mới: chỉ cần thêm thẻ <a class="lesson"> vào đúng chương như trước.
   - Nếu data-tab của bài có trong VT_KHOI[lớp].gan thì bài dùng thiên thể đó.
   - Nếu chưa có, bài tự nhận thiên thể tiếp theo còn trống trong VT_KHOI[lớp].kho (bài cuối chương nhận tàu/trạm).
   Muốn chọn thiên thể riêng: thêm một dòng vào "gan". Muốn thêm thiên thể: thêm vào VT_THIEN_THE.
   Lớp chưa có trong VT_KHOI thì trang Các bài vẫn hiện danh sách thẻ như cũ. */
(function () {
  'use strict';
  const NAM = new Date().getFullYear();
  const base = (a, b, c) => 'radial-gradient(circle at 32% 30%, ' + a + ', ' + b + ' 55%, ' + c + ' 100%)';
  const crater = 'radial-gradient(circle at 64% 34%, rgba(0,0,0,.26) 0 7%, transparent 8%), radial-gradient(circle at 38% 66%, rgba(0,0,0,.22) 0 9%, transparent 10%), radial-gradient(circle at 72% 70%, rgba(0,0,0,.2) 0 5%, transparent 6%), radial-gradient(circle at 30% 38%, rgba(0,0,0,.16) 0 4%, transparent 5%), ';

  /* ---- Thiên thể: tên, loại, hình vẽ (bg) hoặc tàu/trạm (tau), 3–4 thông tin, một ý toán học ---- */
  const T = {
    ceres: { ten: 'Ceres', loai: 'HÀNH TINH LÙN · VÀNH ĐAI TIỂU HÀNH TINH', co: 62,
      bg: 'radial-gradient(circle at 58% 42%, rgba(255,255,255,.95) 0 3%, transparent 4.5%), radial-gradient(circle at 62% 45%, rgba(255,255,255,.7) 0 1.5%, transparent 2.5%), ' + crater + base('#dcd9d5', '#7d7a76', '#2a2826'),
      tin: ['Ceres là thiên thể lớn nhất trong vành đai tiểu hành tinh nằm giữa Sao Hỏa và Sao Mộc.', 'Đường kính của Ceres khoảng 940 km.', 'Nhà thiên văn Giuseppe Piazzi phát hiện Ceres ngày 1/1/1801.', 'Những đốm sáng trong miệng hố Occator là các lớp muối khoáng.'],
      toan: 'Từ năm 1801 đến năm ' + NAM + ' là ' + NAM + ' − 1801 = ' + (NAM - 1801) + ' năm kể từ khi Ceres được tìm thấy.' },
    vesta: { ten: 'Vesta', loai: 'TIỂU HÀNH TINH', co: 58,
      bg: crater + base('#ece4d8', '#9a8f80', '#3a332a'),
      tin: ['Vesta là tiểu hành tinh lớn thứ hai trong vành đai, đường kính trung bình khoảng 525 km.', 'Ở cực nam có núi Rheasilvia cao khoảng 20 km, thuộc loại núi cao nhất Hệ Mặt Trời.', 'Tàu Dawn đã bay quanh Vesta trong các năm 2011–2012, rồi mới bay tiếp đến Ceres.'],
      toan: 'Đường kính Ceres hơn đường kính Vesta khoảng 940 − 525 = 415 km.' },
    io: { ten: 'Io', loai: 'VỆ TINH CỦA SAO MỘC', co: 70,
      bg: 'radial-gradient(circle at 40% 45%, rgba(60,30,10,.55) 0 5%, transparent 6%), radial-gradient(circle at 66% 62%, rgba(150,40,10,.5) 0 7%, transparent 8%), radial-gradient(circle at 34% 70%, rgba(120,60,10,.45) 0 4%, transparent 5%), radial-gradient(circle at 60% 30%, rgba(255,255,255,.35) 0 6%, transparent 9%), ' + base('#fff4b0', '#e3b13c', '#7a4a0a'),
      tin: ['Io là nơi có núi lửa hoạt động mạnh nhất Hệ Mặt Trời, với hàng trăm núi lửa.', 'Màu vàng, cam trên bề mặt là do lưu huỳnh từ núi lửa phun ra.', 'Io quay một vòng quanh Sao Mộc chỉ mất khoảng 42 giờ.', 'Năm 1610, Galileo phát hiện Io cùng với Europa, Ganymede và Callisto.'],
      toan: '42 giờ bằng 42 · 60 = 2 520 phút.' },
    europa: { ten: 'Europa', loai: 'VỆ TINH CỦA SAO MỘC', co: 66,
      bg: 'repeating-linear-gradient(35deg, transparent 0 9px, rgba(140,80,40,.35) 9px 10px), repeating-linear-gradient(-50deg, transparent 0 13px, rgba(140,80,40,.3) 13px 14px), ' + base('#fffaf0', '#e0d2b8', '#6e604a'),
      tin: ['Bề mặt Europa là một lớp băng phủ đầy vết nứt.', 'Dưới lớp băng có thể là một đại dương nước mặn.', 'Các nhà khoa học coi Europa là một nơi có thể tìm thấy sự sống ngoài Trái Đất.'],
      toan: 'Europa quay quanh Sao Mộc mất khoảng 3,5 ngày, gấp đôi thời gian của Io.' },
    ganymede: { ten: 'Ganymede', loai: 'VỆ TINH CỦA SAO MỘC', co: 90,
      bg: 'radial-gradient(ellipse 30% 22% at 38% 40%, rgba(80,65,50,.55) 0 60%, transparent 66%), radial-gradient(ellipse 20% 26% at 66% 64%, rgba(80,65,50,.45) 0 60%, transparent 66%), ' + base('#eee7dc', '#a89b88', '#3d362e'),
      tin: ['Ganymede là vệ tinh lớn nhất Hệ Mặt Trời, đường kính khoảng 5 268 km, lớn hơn cả Sao Thủy.', 'Đây là vệ tinh duy nhất đã biết có từ trường riêng.', 'Dưới lớp băng của Ganymede có thể có một đại dương nước mặn.'],
      toan: 'Trong thời gian Ganymede quay 1 vòng quanh Sao Mộc, Europa quay được 2 vòng và Io quay được 4 vòng.' },
    callisto: { ten: 'Callisto', loai: 'VỆ TINH CỦA SAO MỘC', co: 80,
      bg: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,.6) 0 3%, transparent 4%), radial-gradient(circle at 62% 30%, rgba(255,255,255,.5) 0 2.5%, transparent 3.5%), radial-gradient(circle at 55% 66%, rgba(255,255,255,.55) 0 3%, transparent 4%), radial-gradient(circle at 75% 52%, rgba(255,255,255,.4) 0 2%, transparent 3%), radial-gradient(circle at 40% 75%, rgba(255,255,255,.45) 0 2%, transparent 3%), ' + base('#9a8975', '#55473a', '#1c1712'),
      tin: ['Bề mặt Callisto chi chít hố va chạm, thuộc loại nhiều hố nhất Hệ Mặt Trời.', 'Callisto là vệ tinh lớn thứ ba Hệ Mặt Trời, sau Ganymede và Titan.', 'Callisto quay một vòng quanh Sao Mộc mất khoảng 16,7 ngày.'],
      toan: 'Nếu một vùng hình vuông trên Callisto có diện tích 400 km² thì cạnh của nó dài √400 = 20 km.' },
    titan: { ten: 'Titan', loai: 'VỆ TINH CỦA SAO THỔ', co: 86,
      bg: 'radial-gradient(circle at 50% 50%, transparent 58%, rgba(255,205,130,.5) 72%), ' + base('#ffd88a', '#d08a2e', '#5a3208'),
      tin: ['Titan là vệ tinh lớn nhất của Sao Thổ và lớn thứ hai Hệ Mặt Trời.', 'Đây là vệ tinh duy nhất có lớp khí quyển dày, chủ yếu là khí nitơ.', 'Trên Titan có hồ và biển, nhưng chứa metan, etan lỏng chứ không phải nước.', 'Năm 2005, tàu Huygens đã đáp xuống bề mặt Titan.'],
      toan: 'Bề mặt Titan lạnh khoảng −179 °C, thấp hơn nhiệt độ nước đóng băng (0 °C) tới 179 °C.' },
    enceladus: { ten: 'Enceladus', loai: 'VỆ TINH CỦA SAO THỔ', co: 60,
      bg: 'repeating-linear-gradient(115deg, transparent 0 10px, rgba(70,140,200,.32) 10px 12px), ' + base('#ffffff', '#cfe3f2', '#5a7a90'),
      tin: ['Enceladus phủ băng trắng, là một trong những thiên thể sáng nhất Hệ Mặt Trời.', 'Ở cực nam có những cột hơi nước và băng phun thẳng ra ngoài vũ trụ.', 'Đường kính của Enceladus chỉ khoảng 500 km.'],
      toan: 'Tàu Cassini đã bay xuyên qua các cột phun để thu thập dữ liệu, giống như cách em thu thập dữ liệu để trả lời một câu hỏi.' },
    pluto: { ten: 'Pluto', loai: 'HÀNH TINH LÙN · VÀNH ĐAI KUIPER', co: 78,
      bg: 'radial-gradient(ellipse 24% 20% at 62% 60%, #f8ecd8 0 60%, transparent 66%), radial-gradient(ellipse 14% 12% at 52% 54%, #f8ecd8 0 60%, transparent 66%), ' + base('#e9c9a4', '#a9744a', '#3c2412'),
      tin: ['Pluto được phát hiện năm 1930 và từng được coi là hành tinh thứ chín.', 'Năm 2006, Pluto được xếp lại thành hành tinh lùn.', 'Trên bề mặt Pluto có một vùng băng sáng hình trái tim rất lớn.', 'Một năm trên Pluto dài khoảng 248 năm Trái Đất.'],
      toan: 'Pluto được gọi là hành tinh trong 2006 − 1930 = 76 năm.' },
    charon: { ten: 'Charon', loai: 'VỆ TINH CỦA PLUTO', co: 64,
      bg: 'radial-gradient(ellipse 40% 16% at 50% 6%, rgba(120,50,30,.7) 0 60%, transparent 72%), ' + crater + base('#e4e4e6', '#9a9aa0', '#333338'),
      tin: ['Charon là vệ tinh lớn nhất của Pluto, đường kính khoảng một nửa đường kính Pluto.', 'Pluto và Charon luôn quay cùng một mặt vào nhau.', 'Vùng cực bắc của Charon có màu nâu đỏ.'],
      toan: 'Đường kính Pluto khoảng 2 377 km, của Charon khoảng 1 212 km: gần bằng một nửa.' },
    triton: { ten: 'Triton', loai: 'VỆ TINH CỦA SAO HẢI VƯƠNG', co: 70,
      bg: 'radial-gradient(ellipse 50% 30% at 50% 82%, rgba(255,210,210,.6) 0 55%, transparent 66%), ' + base('#eef3ff', '#b4c0d6', '#3b4458'),
      tin: ['Triton quay quanh Sao Hải Vương ngược chiều với chiều tự quay của hành tinh.', 'Đây là một trong những nơi lạnh nhất Hệ Mặt Trời, khoảng −235 °C.', 'Tàu Voyager 2 đã thấy những mạch phun khí nitơ trên Triton.'],
      toan: 'Triton (−235 °C) lạnh hơn Titan (−179 °C) là 56 °C.' },
    miranda: { ten: 'Miranda', loai: 'VỆ TINH CỦA SAO THIÊN VƯƠNG', co: 58,
      bg: 'repeating-linear-gradient(40deg, transparent 0 8px, rgba(0,0,0,.18) 8px 10px), ' + base('#e0e2e6', '#9095a0', '#30333a'),
      tin: ['Bề mặt Miranda trông như được ghép từ nhiều mảnh khác nhau.', 'Miranda có vách đá Verona Rupes, thuộc loại vách đá cao nhất Hệ Mặt Trời.', 'Tàu Voyager 2 chụp ảnh Miranda năm 1986.'],
      toan: 'Từ năm 1986 đến năm ' + NAM + ' là ' + (NAM - 1986) + ' năm kể từ lần duy nhất Miranda được chụp gần.' },
    eris: { ten: 'Eris', loai: 'HÀNH TINH LÙN', co: 66,
      bg: base('#ffffff', '#d6d6dc', '#55555e'),
      tin: ['Eris được phát hiện năm 2005, ở rất xa phía ngoài Pluto.', 'Việc tìm ra Eris khiến các nhà thiên văn xếp lại Pluto là hành tinh lùn năm 2006.', 'Eris nặng hơn Pluto một chút.'],
      toan: 'Một năm trên Eris dài khoảng 560 năm Trái Đất, hơn 2 lần một năm trên Pluto (248 năm).' },
    halley: { ten: 'Sao chổi Halley', loai: 'SAO CHỔI', co: 46, duoi: true,
      bg: crater + base('#d7dfee', '#6d7890', '#1e2433'),
      tin: ['Cứ khoảng 75–76 năm, sao chổi Halley lại quay về gần Trái Đất.', 'Lần gần nhất Halley xuất hiện là năm 1986, lần tới vào khoảng năm 2061.', 'Edmond Halley dùng tính toán để dự đoán đúng sao chổi này sẽ quay lại.'],
      toan: '1986 + 75 = 2061: năm sao chổi Halley được dự đoán sẽ quay lại.' },
    arrokoth: { ten: 'Arrokoth', loai: 'THIÊN THỂ VÀNH ĐAI KUIPER', co: 56,
      bg: crater + base('#f0aa82', '#a0502a', '#3a1a0a'),
      tin: ['Arrokoth trông như hai khối dẹt dính vào nhau, giống một người tuyết.', 'Đây là thiên thể xa nhất từng được tàu vũ trụ bay đến gần (tàu New Horizons, ngày 1/1/2019).', 'Arrokoth dài khoảng 36 km.'],
      toan: 'Đi bộ với vận tốc 4 km/h thì mất 36 : 4 = 9 giờ mới đi hết chiều dài của Arrokoth.' },
    /* Tàu và trạm: dùng cho Bài tập cuối chương */
    juno: { ten: 'Tàu thăm dò Juno', loai: 'TRẠM ÔN CHƯƠNG · TÀU THĂM DÒ', tau: '#f2c14e',
      tin: ['Juno được phóng tháng 8/2011 và đến Sao Mộc ngày 4/7/2016.', 'Juno chạy bằng ba tấm pin mặt trời lớn, mỗi tấm dài khoảng 9 m.', 'Trên tàu có ba hình nhân nhỏ bằng nhôm, một trong số đó là nhà thiên văn Galileo.'],
      toan: 'Từ tháng 8/2011 đến tháng 7/2016, Juno bay gần 5 năm mới tới Sao Mộc.' },
    cassini: { ten: 'Tàu thăm dò Cassini', loai: 'TRẠM ÔN CHƯƠNG · TÀU THĂM DÒ', tau: '#e8b04a',
      tin: ['Cassini bay quanh Sao Thổ từ năm 2004 đến năm 2017.', 'Tàu mang theo tàu đổ bộ Huygens và thả xuống Titan.', 'Ngày 15/9/2017, Cassini kết thúc nhiệm vụ bằng cách lao vào khí quyển Sao Thổ.'],
      toan: 'Cassini làm việc quanh Sao Thổ 2017 − 2004 = 13 năm.' },
    newhorizons: { ten: 'Tàu thăm dò New Horizons', loai: 'TRẠM ÔN CHƯƠNG · TÀU THĂM DÒ', tau: '#d9b45a',
      tin: ['New Horizons được phóng tháng 1/2006 và bay ngang Pluto ngày 14/7/2015.', 'Đây là tàu đầu tiên chụp được ảnh rõ nét bề mặt Pluto.', 'Năm 2019, tàu bay ngang Arrokoth ở vành đai Kuiper.'],
      toan: 'Từ đầu năm 2006 đến giữa năm 2015, tàu bay khoảng 9,5 năm mới tới Pluto.' },
    voyager1: { ten: 'Tàu Voyager 1', loai: 'TRẠM ÔN CHƯƠNG · TÀU THĂM DÒ', tau: '#c9a24a',
      tin: ['Voyager 1 được phóng năm 1977 và là vật thể do con người làm ra ở xa Trái Đất nhất.', 'Năm 2012, Voyager 1 bay ra khỏi vùng ảnh hưởng của gió Mặt Trời, vào không gian giữa các vì sao.', 'Tàu mang theo một đĩa vàng ghi âm thanh và hình ảnh về Trái Đất.'],
      toan: 'Đến năm ' + NAM + ', Voyager 1 đã bay ' + NAM + ' − 1977 = ' + (NAM - 1977) + ' năm.' },
    voyager2: { ten: 'Tàu Voyager 2', loai: 'TRẠM ÔN CHƯƠNG · TÀU THĂM DÒ', tau: '#c9a24a',
      tin: ['Voyager 2 là tàu duy nhất đã bay ngang cả Sao Thiên Vương (1986) và Sao Hải Vương (1989).', 'Voyager 2 được phóng năm 1977, trước Voyager 1 khoảng hai tuần.', 'Năm 2018, Voyager 2 cũng bay vào không gian giữa các vì sao.'],
      toan: 'Từ Sao Thiên Vương đến Sao Hải Vương, Voyager 2 bay mất 1989 − 1986 = 3 năm.' }
  };

  /* ---- Cấu hình từng lớp ---- */
  const VT_KHOI = {
    '7': {
      vung: 'Vành đai tiểu hành tinh và các mặt trăng khổng lồ',
      quyDao: [
        { k: 'ds', ten: 'Quỹ đạo Đại số', phu: 'Số và Đại số · Thống kê và Xác suất', mau: '#ffb36b',
          chuong: [['I', 'Số hữu tỉ'], ['II', 'Số thực'], ['V', 'Thu thập và biểu diễn dữ liệu'], ['VI', 'Tỉ lệ thức và đại lượng tỉ lệ'], ['VII', 'Biểu thức đại số và đa thức một biến'], ['VIII', 'Làm quen với biến cố và xác suất của biến cố']] },
        { k: 'hh', ten: 'Quỹ đạo Hình học', phu: 'Hình học và Đo lường', mau: '#7fd8ff',
          chuong: [['III', 'Góc và đường thẳng song song'], ['IV', 'Tam giác bằng nhau'], ['IX', 'Quan hệ giữa các yếu tố trong một tam giác'], ['X', 'Một số hình khối trong thực tiễn']] }
      ],
      gan: {
        '7 - Tập hợp các số hữu tỉ': 'ceres', '7 - Cộng, trừ, nhân, chia số hữu tỉ': 'vesta', '7 - Luỹ thừa của số hữu tỉ': 'io',
        '7 - Thứ tự phép tính và quy tắc chuyển vế': 'europa', '7 - Bài tập cuối chương I': 'juno',
        '7 - Số thập phân vô hạn tuần hoàn': 'ganymede', '7 - Số vô tỉ và căn bậc hai số học': 'callisto', '7 - Tập hợp các số thực': 'titan',
        '7 - Bài tập cuối chương II': 'cassini', '7 - Thu thập và phân loại dữ liệu': 'enceladus',
        '7 - Tam giác bằng nhau': 'pluto', '7 - Tam giác vuông bằng nhau': 'charon'
      },
      kho: ['triton', 'miranda', 'eris', 'halley', 'arrokoth'],
      khoTau: ['newhorizons', 'voyager1', 'voyager2']
    }
  };

  /* ---- Giao diện ---- */
  const CSS = `
.vt{position:relative;width:min(1200px,calc(100vw - 16px));left:50%;transform:translateX(-50%);margin-top:18px;border-radius:28px;overflow:hidden;background:#03050f;color:#e8ecff;font-family:'Be Vietnam Pro',system-ui,sans-serif;padding:24px clamp(12px,2.5vw,28px) 34px;box-sizing:border-box;isolation:isolate}
.vt *{box-sizing:border-box}
.vt-sky,.vt-sky2,.vt-sky3{position:absolute;inset:0;pointer-events:none;z-index:-1}
.vt-sky{background-image:radial-gradient(1px 1px at 23px 41px,#fff,transparent),radial-gradient(1px 1px at 141px 97px,#dfe6ff,transparent),radial-gradient(1px 1px at 233px 163px,#fff,transparent),radial-gradient(1px 1px at 77px 211px,#b9c6ff,transparent),radial-gradient(1px 1px at 301px 23px,#fff,transparent);background-size:340px 240px;opacity:.8}
.vt-sky2{background-image:radial-gradient(1.6px 1.6px at 60px 120px,#fff,transparent),radial-gradient(1.4px 1.4px at 380px 300px,#ffe9c2,transparent),radial-gradient(1.8px 1.8px at 520px 80px,#cfe8ff,transparent);background-size:640px 420px;animation:vt-tw 4s ease-in-out infinite alternate}
.vt-sky3{background-image:radial-gradient(2.4px 2.4px at 200px 260px,#fff,transparent),radial-gradient(2px 2px at 900px 140px,#bfe3ff,transparent);background-size:1100px 700px;animation:vt-tw 6s ease-in-out infinite alternate-reverse}
.vt-neb{position:absolute;border-radius:50%;pointer-events:none;z-index:-1;filter:blur(28px)}
.vt-giant{position:absolute;right:-90px;top:-150px;width:340px;height:340px;border-radius:50%;z-index:-1;background:radial-gradient(circle at 30% 70%,#c9a46a,#7a5428 55%,#2a1a08);box-shadow:inset 40px -30px 80px rgba(255,220,160,.25),0 0 80px 10px rgba(255,190,110,.18)}
@keyframes vt-tw{from{opacity:.35}to{opacity:1}}
@keyframes vt-halo{from{box-shadow:inset -14px -12px 26px rgba(0,0,0,.6),0 0 16px 5px rgba(255,214,120,.45)}to{box-shadow:inset -14px -12px 26px rgba(0,0,0,.6),0 0 34px 12px rgba(255,214,120,.75)}}
@keyframes vt-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.vt-head{display:flex;flex-direction:column;gap:4px;padding-right:120px}
.vt-head small{font-size:.8rem;font-weight:700;letter-spacing:.12em;color:#9fb4ff}
.vt-head b{font:800 clamp(1.5rem,4vw,2.2rem)/1.15 'Baloo 2','Be Vietnam Pro',sans-serif;color:#fff;text-shadow:0 0 22px rgba(140,160,255,.5)}
.vt-head span{font-size:.9rem;color:#c9d2ff}
.vt-legend{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:12px;font-size:.82rem;color:#c9d2ff}
.vt-legend span{display:flex;align-items:center;gap:6px}
.vt-legend i{width:12px;height:12px;border-radius:50%;display:inline-block}
.vt-tabs{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;padding:5px;margin-top:16px;border-radius:16px;background:rgba(12,17,52,.8);border:1px solid #34408a}
.vt-tabs button{font:700 .92rem 'Be Vietnam Pro',sans-serif;min-height:44px;border:0;border-radius:12px;background:transparent;color:#c9d2ff;cursor:pointer}
.vt-tabs button[aria-selected="true"]{background:var(--m);color:#071022}
.vt-lanes{display:flex;gap:28px;align-items:flex-start;margin-top:22px}
.vt-lane{flex:1 1 0;min-width:0}
.vt-lane>h3{display:flex;align-items:center;gap:12px;margin:0;font:800 1.45rem/1.2 'Baloo 2','Be Vietnam Pro',sans-serif;color:#fff}
.vt-lane>h3 small{display:block;font:500 .82rem 'Be Vietnam Pro',sans-serif;color:#c9d2ff}
.vt-sun{flex:none;width:50px;height:50px;border-radius:50%}
.vt-track{position:relative}
.vt-track svg.vt-path{position:absolute;inset:0;overflow:visible;pointer-events:none}
.vt-ch{position:absolute;left:0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;max-width:100%}
.vt-ch b{padding:5px 13px;border-radius:99px;font-size:.8rem;font-weight:800}
.vt-ch span{font-size:.92rem;font-weight:600;color:#dfe5ff}
.vt-nebula{position:absolute;left:4%;right:4%;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;font-size:.86rem;line-height:1.4;color:#cfe6ff;background:radial-gradient(closest-side,rgba(90,200,255,.28),rgba(120,90,255,.13) 60%,transparent)}
.vt-pl{position:absolute;display:flex;align-items:center;gap:16px;background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-align:left;transform:translateY(-50%)}
.vt-pl:focus-visible{outline:3px solid #ffd678;outline-offset:6px;border-radius:18px}
.vt-orb{position:relative;flex:none}
.vt-body{position:absolute;inset:0;border-radius:50%;transition:transform .25s}
.vt-pl:hover .vt-body,.vt-pl:focus-visible .vt-body{transform:scale(1.08)}
.vt-ring{position:absolute;left:50%;top:50%;border-radius:50%;border-top-color:transparent!important;transform:translate(-50%,-50%) rotate(-16deg)}
.vt-tail{position:absolute;right:60%;top:50%;width:150%;height:40%;transform:translateY(-50%);border-radius:50%;background:linear-gradient(270deg,rgba(200,225,255,.75),rgba(150,190,255,0));filter:blur(2px)}
.vt-badge{position:absolute;right:-4px;top:-6px;width:26px;height:26px;border-radius:50%;border:3px solid #03050f;display:flex;align-items:center;justify-content:center}
.vt-badge svg{width:13px;height:13px}
.vt-rocket{position:absolute;left:-28px;top:-24px;width:38px;height:38px;transform:rotate(35deg)}
.vt-lbl{display:flex;flex-direction:column;gap:2px;min-width:0;padding:9px 13px;border-radius:14px;background:rgba(8,12,38,.74);border:1px solid rgba(150,170,255,.22);backdrop-filter:blur(4px)}
.vt-lbl small{font-size:.7rem;font-weight:700;letter-spacing:.06em;color:#9fb4ff}
.vt-lbl b{font-size:.95rem;line-height:1.3;color:#fff}
.vt-lbl span{font-size:.8rem;line-height:1.35;color:#9ff0c4}
.vt-pl.now .vt-lbl{border-color:rgba(255,214,120,.7)}.vt-pl.now .vt-lbl span{color:#ffd678}
.vt-pl.done .vt-lbl{border-color:rgba(57,217,138,.45)}
.vt-pl.try .vt-lbl span{color:#ffc58a}
.vt-pl.open .vt-lbl span,.vt-pl.new .vt-lbl span{color:#c9d2ff}
.vt-pl.sel .vt-lbl{border-color:#ffd678;box-shadow:0 0 0 1px #ffd678}
.vt-foot{margin:8px 0 0;text-align:center;font-size:.8rem;color:#a9b3e6}
.vt-panel{position:fixed;z-index:60;right:20px;bottom:20px;width:380px;max-width:calc(100vw - 24px);max-height:calc(100vh - 40px);overflow-y:auto;padding:20px;border-radius:24px;background:rgba(9,13,42,.96);border:1px solid rgba(160,180,255,.35);box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 40px rgba(120,140,255,.18);color:#e8ecff;font-family:'Be Vietnam Pro',system-ui,sans-serif;animation:vt-in .3s ease-out;display:flex;flex-direction:column;gap:12px;box-sizing:border-box}
.vt-panel *{box-sizing:border-box}
.vt-ph{display:flex;align-items:center;gap:14px}
.vt-ph .vt-orb{width:84px;height:84px}
.vt-ph div{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.vt-ph small{font-size:.72rem;font-weight:700;letter-spacing:.07em;color:#9fb4ff}
.vt-ph h3{margin:0;font:800 1.45rem/1.15 'Baloo 2','Be Vietnam Pro',sans-serif;color:#fff}
.vt-ph span{font-size:.8rem;color:#c9d2ff}
.vt-x{flex:none;align-self:flex-start;width:44px;height:44px;border-radius:50%;border:1px solid #3a4580;background:transparent;color:#dfe5ff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.vt-x svg{width:18px;height:18px}
.vt-panel h4{margin:0;font-size:.82rem;color:#ffd678}
.vt-panel ul{margin:0;padding:0 0 0 18px;display:flex;flex-direction:column;gap:6px;font-size:.9rem;line-height:1.5}
.vt-panel li::marker{color:#ffd678}
.vt-math{padding:11px 13px;border-radius:14px;background:rgba(255,214,120,.08);border:1px solid rgba(255,214,120,.3);font-size:.86rem;line-height:1.5;color:#ffe7b0}
.vt-bai{display:flex;flex-direction:column;gap:4px;padding-top:12px;border-top:1px solid rgba(160,180,255,.2)}
.vt-bai b{font-size:.98rem;color:#fff}
.vt-bai p{margin:0;font-size:.84rem;line-height:1.45;color:#c9d2ff}
.vt-bai span{font-size:.84rem;color:#9ff0c4}
.vt-go{display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:14px;background:#ffd678;color:#1a1430!important;font-weight:800;font-size:.95rem;text-decoration:none}
.vt-go:focus-visible{outline:3px solid #fff;outline-offset:3px}
.vt-dim{position:fixed;inset:0;z-index:59;background:rgba(2,4,14,.55);display:none}
@media (max-width:820px){
  .vt-tabs{display:grid}
  .vt-lane{display:none}.vt-lane.on{display:block}
  .vt-lane>h3{display:none}
  .vt-panel{left:0;right:0;bottom:0;width:auto;max-width:none;max-height:78vh;border-radius:24px 24px 0 0;padding-bottom:calc(20px + env(safe-area-inset-bottom))}
  .vt-panel::before{content:"";align-self:center;width:44px;height:5px;border-radius:9px;background:#4a5494;margin:-8px 0 2px}
  .vt-dim.on{display:block}
  .vt-head{padding-right:70px}
  .vt-giant{width:200px;height:200px;right:-70px;top:-90px}
}
.vt.lite .vt-sky2,.vt.lite .vt-sky3{animation:none}
.vt.lite .vt-neb,.vt.lite .vt-tail{filter:none}
.vt.lite .vt-lbl,.vt-panel.lite{backdrop-filter:none}
.vt.lite .vt-body,.vt-panel.lite .vt-body{animation:none!important;transition:none}
.vt-panel.lite{animation:none}
@media (prefers-reduced-motion:reduce){.vt-sky2,.vt-sky3,.vt-body,.vt-panel{animation:none!important}.vt-body{transition:none}}
`;
  const SVG_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="#03120a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
  const SVG_TRY = '<svg viewBox="0 0 24 24" fill="none" stroke="#2a1200" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 7v6M12 17h.01"/></svg>';
  const SVG_ROCKET = '<svg class="vt-rocket" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c3 2 5 6 5 10l-2 4H9l-2-4c0-4 2-8 5-10z" fill="#f2f4ff" stroke="#8b95c9"/><circle cx="12" cy="9.5" r="2" fill="#3cc4f0"/><path d="M9 16l-3 3 1-5zM15 16l3 3-1-5z" fill="#ff6f61"/><path d="M10 17l2 6 2-6z" fill="#ffb547"/></svg>';
  const SVG_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const tauSVG = (c) => '<svg viewBox="0 0 80 80" width="100%" height="100%" aria-hidden="true" style="position:absolute;inset:0"><rect x="2" y="36" width="22" height="12" rx="2" fill="#2c5fa8" stroke="#9cc6ff"/><rect x="56" y="36" width="22" height="12" rx="2" fill="#2c5fa8" stroke="#9cc6ff"/><path d="M8 36v12M14 36v12M20 36v12M62 36v12M68 36v12M74 36v12" stroke="#9cc6ff" stroke-width=".8"/><rect x="24" y="40" width="32" height="4" fill="#c9d2e8"/><rect x="30" y="34" width="20" height="18" rx="3" fill="' + c + '" stroke="#fff3c4"/><path d="M22 24a18 9 0 0 0 36 0z" fill="#eef1f8" stroke="#9aa6c4"/><path d="M40 24v10M40 14v10" stroke="#c9d2e8" stroke-width="2"/><circle cx="40" cy="13" r="2.5" fill="#ffd678"/><path d="M36 52l-4 10M44 52l4 10" stroke="#c9d2e8" stroke-width="2"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  const shade = (s) => 'inset -' + Math.round(s * .2) + 'px -' + Math.round(s * .16) + 'px ' + Math.round(s * .35) + 'px rgba(0,0,0,.65), inset 3px 3px 8px rgba(255,255,255,.22)';
  function orbHTML(b, s, st) {
    let h = '<span class="vt-orb" style="width:' + s + 'px;height:' + s + 'px">';
    if (b.tau) h += tauSVG(b.tau);
    else {
      if (b.duoi) h += '<span class="vt-tail" aria-hidden="true"></span>';
      h += '<span class="vt-body" style="background:' + b.bg + ';box-shadow:' + shade(s) + (st === 'now' ? ';animation:vt-halo 1.8s ease-in-out infinite alternate' : '') + '"></span>';
      if (b.vanh) h += '<span class="vt-ring" style="width:' + Math.round(s * 1.9) + 'px;height:' + Math.round(s * .46) + 'px;border:' + Math.max(3, Math.round(s * .07)) + 'px solid rgba(230,210,160,.8)"></span>';
    }
    if (st === 'done') h += '<span class="vt-badge" style="background:#39d98a">' + SVG_OK + '</span>';
    if (st === 'try') h += '<span class="vt-badge" style="background:#ffb36b">' + SVG_TRY + '</span>';
    if (st === 'now') h += SVG_ROCKET;
    return h + '</span>';
  }

  function lite() {
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      const n = navigator, c = n.connection;
      if (c && c.saveData) return true;
      if (n.deviceMemory && n.deviceMemory <= 2) return true;
      if (n.hardwareConcurrency && n.hardwareConcurrency <= 4 && /Android|iPhone|iPad/i.test(n.userAgent)) return true;
    } catch (e) {}
    return false;
  }

  /* ---- Dựng bản đồ cho một section lớp ---- */
  function Map(sec, cfg) {
    this.sec = sec; this.cfg = cfg; this.prog = null; this.sel = null; this.tab = cfg.quyDao[0].k; this.lite = lite();
    this.read();
    sec.classList.add('vt-on');
    this.root = document.createElement('div');
    this.root.className = 'vt' + (this.lite ? ' lite' : '');
    sec.appendChild(this.root);
    this.draw();
    let t = 0, w = window.innerWidth;
    window.addEventListener('resize', () => { if (Math.abs(window.innerWidth - w) < 40) return; w = window.innerWidth; clearTimeout(t); t = setTimeout(() => this.draw(), 150); });
  }
  Map.prototype.read = function () {
    const cfg = this.cfg, dung = {}, bai = [];
    Object.keys(cfg.gan).forEach((k) => { dung[cfg.gan[k]] = 1; });
    let kho = cfg.kho.slice(), khoTau = cfg.khoTau.slice();
    const lay = (arr) => { while (arr.length) { const x = arr.shift(); if (!dung[x]) { dung[x] = 1; return x; } } return null; };
    [].forEach.call(this.sec.querySelectorAll('.chap'), (chap) => {
      const tag = (chap.querySelector('.tag') || {}).textContent || '';
      const so = (tag.match(/Chương\s+([IVXL]+)/) || [])[1] || '';
      [].forEach.call(chap.querySelectorAll('a.lesson[data-tab]'), (a) => {
        const tab = a.getAttribute('data-tab'), ten = (a.querySelector('h4') || {}).textContent || tab;
        const cuoi = /cuối chương/i.test(ten);
        let id = cfg.gan[tab] || lay(cuoi ? khoTau : kho) || lay(kho) || lay(khoTau);
        bai.push({ a, tab, ten, ds: (a.querySelector('.ds') || {}).textContent || '', href: a.getAttribute('href'), so, id, cuoi });
      });
    });
    this.bai = bai;
  };
  Map.prototype.setProg = function (o) { this.prog = o; this.draw(); };
  Map.prototype.state = function () {
    const o = this.prog, bai = o && o.bai;
    const st = {};
    this.bai.forEach((x) => {
      if (!o) { st[x.tab] = { s: 'open', note: 'Bấm để xem hành tinh và vào bài' }; return; }
      const k = bai && bai[x.tab];
      if (k) {
        const d = parseFloat(String(k.d).replace(',', '.')) || 0, vn = String(k.d).replace('.', ',');
        st[x.tab] = d >= 5 ? { s: 'done', note: 'Điểm cao nhất ' + vn + (k.y ? ' · cần ôn: ' + k.y : '') } : { s: 'try', note: 'Điểm cao nhất ' + vn + ' · ôn thêm để đạt từ 5 điểm' };
      } else st[x.tab] = { s: 'new', note: 'Chưa làm bài kiểm tra 25 phút' };
    });
    if (o) this.cfg.quyDao.forEach((q) => {
      const ds = q.chuong.map((c) => c[0]);
      const first = this.bai.filter((x) => ds.indexOf(x.so) >= 0).find((x) => st[x.tab].s !== 'done');
      if (first) { const v = st[first.tab]; v.now = true; v.note = 'Em đang ở đây · ' + v.note; }
    });
    return st;
  };
  Map.prototype.draw = function () {
    const cfg = this.cfg, st = this.state(), narrow = window.innerWidth <= 820;
    const logged = !!this.prog;
    let h = '<span class="vt-sky" aria-hidden="true"></span><span class="vt-sky2" aria-hidden="true"></span><span class="vt-sky3" aria-hidden="true"></span>' +
      '<span class="vt-neb" aria-hidden="true" style="left:-12%;top:300px;width:62%;height:800px;background:radial-gradient(closest-side,rgba(255,110,80,.2),rgba(170,60,140,.1) 55%,transparent)"></span>' +
      '<span class="vt-neb" aria-hidden="true" style="right:-14%;top:180px;width:64%;height:900px;background:radial-gradient(closest-side,rgba(40,170,255,.18),rgba(80,60,200,.1) 55%,transparent)"></span>' +
      '<span class="vt-giant" aria-hidden="true"></span>' +
      '<div class="vt-head"><small>BẢN ĐỒ VŨ TRỤ</small><b>' + esc(cfg.vung) + '</b><span>Mỗi bài học là một thiên thể có thật. Bấm vào để xem thông tin và bay đến bài.</span></div>' +
      '<div class="vt-legend">' + (logged ? '<span><i style="background:#39d98a"></i>Đã chinh phục (từ 5 điểm)</span><span><i style="background:#ffd678;box-shadow:0 0 8px 2px rgba(255,214,120,.7)"></i>Em đang ở đây</span><span><i style="background:#ffb36b"></i>Cần ôn thêm</span>' : '<span>Nhập mã học sinh ở trên để thấy tiến độ của em trên bản đồ.</span>') + '</div>' +
      '<div class="vt-tabs" role="tablist" aria-label="Chọn phân môn">' + cfg.quyDao.map((q) => '<button role="tab" type="button" data-q="' + q.k + '" aria-selected="' + (q.k === this.tab) + '" style="--m:' + q.mau + '">' + esc(q.ten) + '</button>').join('') + '</div>' +
      '<div class="vt-lanes">';
    cfg.quyDao.forEach((q) => {
      const xs = narrow ? [13, 36] : [16, 46];
      let y = 18, n = 0; const pts = []; let inner = '';
      const present = q.chuong.filter((c) => this.bai.some((x) => x.so === c[0]));
      const lastIdx = present.length ? q.chuong.indexOf(present[present.length - 1]) : -1;
      q.chuong.forEach((c, ci) => {
        const ls = this.bai.filter((x) => x.so === c[0]);
        if (!ls.length && ci > lastIdx) return;
        const col = q.mau;
        inner += '<div class="vt-ch" style="top:' + y + 'px"><b style="background:' + col + '26;color:' + col + ';border:1px solid ' + col + '66">Chương ' + c[0] + '</b><span>' + esc(c[1]) + '</span></div>';
        y += 58;
        if (!ls.length) { inner += '<div class="vt-nebula" style="top:' + (y - 6) + 'px" aria-hidden="true">Tinh vân đang hình thành<br>các thiên thể của chương này sẽ xuất hiện dần</div>'; y += 120; return; }
        ls.forEach((x) => {
          const b = T[x.id] || { ten: 'Thiên thể bí ẩn', loai: 'THIÊN THỂ', co: 60, bg: base('#e0e4ff', '#7a84c8', '#1c2050'), tin: [], toan: '' };
          const s = narrow ? Math.round((b.tau ? 80 : b.co) * .78) : (b.tau ? 84 : b.co), v = st[x.tab], cls = v.now ? 'now' : v.s;
          const xp = xs[n % 2], cy = y + 46; pts.push([xp, cy]);
          inner += '<button type="button" class="vt-pl ' + cls + (this.sel === x.tab ? ' sel' : '') + '" data-tab="' + esc(x.tab) + '" aria-haspopup="dialog" aria-label="' + esc(b.ten + '. ' + x.ten + '. ' + v.note) + '" style="left:calc(' + xp + '% - ' + s / 2 + 'px);top:' + cy + 'px;max-width:calc(' + (100 - xp) + '% + ' + s / 2 + 'px - 2px)">' +
            orbHTML(b, s, v.now ? 'now' : v.s) +
            '<span class="vt-lbl"><small>' + esc(b.ten.toUpperCase()) + '</small><b>' + esc(x.ten) + '</b><span>' + esc(v.note) + '</span></span></button>';
          y += narrow ? 128 : 142; n++;
        });
        y += 6;
      });
      if (lastIdx < q.chuong.length - 1) { inner += '<div class="vt-nebula" style="top:' + y + 'px" aria-hidden="true">Các chương tiếp theo<br>sẽ xuất hiện dần</div>'; y += 120; }
      let d = '';
      pts.forEach((p, i) => { if (!i) { d = 'M' + p[0] + ' ' + p[1]; return; } const a = pts[i - 1], m = (a[1] + p[1]) / 2; d += ' C' + a[0] + ' ' + m + ' ' + p[0] + ' ' + m + ' ' + p[0] + ' ' + p[1]; });
      const H = y + 10;
      const sun = q.k === 'ds' ? 'radial-gradient(circle at 38% 34%,#fff6d8,#ffb347 55%,#d0461a);box-shadow:0 0 30px 8px rgba(255,150,60,.5)' : 'radial-gradient(circle at 38% 34%,#eafcff,#5fd0ff 55%,#1d4fb0);box-shadow:0 0 30px 8px rgba(80,190,255,.5)';
      h += '<section class="vt-lane' + (q.k === this.tab ? ' on' : '') + '" data-q="' + q.k + '" aria-label="' + esc(q.ten) + '"><h3><span class="vt-sun" style="background:' + sun + '" aria-hidden="true"></span><span>' + esc(q.ten) + '<small>' + esc(q.phu) + '</small></span></h3>' +
        '<div class="vt-track" style="height:' + H + 'px"><svg class="vt-path" width="100%" height="' + H + '" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
        (d ? '<path d="' + d + '" fill="none" stroke="' + q.mau + '" stroke-width="10" stroke-linecap="round" opacity=".18" vector-effect="non-scaling-stroke"/><path d="' + d + '" fill="none" stroke="' + q.mau + '" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' : '') +
        '</svg>' + inner + '</div></section>';
    });
    h += '</div><p class="vt-foot">Hai quỹ đạo bay song song như thời khoá biểu: đi tiếp ở Đại số không phụ thuộc vào Hình học, và ngược lại.</p>';
    this.root.innerHTML = h;
    [].forEach.call(this.root.querySelectorAll('.vt-tabs button'), (btn) => {
      btn.onclick = () => { this.tab = btn.getAttribute('data-q'); this.draw(); const f = this.root.querySelector('.vt-tabs [data-q="' + this.tab + '"]'); if (f) f.focus(); };
    });
    [].forEach.call(this.root.querySelectorAll('.vt-pl'), (btn) => { btn.onclick = () => this.open(btn.getAttribute('data-tab'), btn); });
    if (this.sel) this.panel(false);
  };
  Map.prototype.open = function (tab, from) { this.sel = tab; this.from = from || null; this.draw(); this.panel(true); };
  Map.prototype.close = function () {
    this.sel = null;
    if (this.pn) { this.pn.remove(); this.pn = null; }
    if (this.dim) this.dim.classList.remove('on');
    const tab = this.lastTab; this.draw();
    const b = tab && this.root.querySelector('.vt-pl[data-tab="' + CSS_esc(tab) + '"]'); if (b) b.focus();
  };
  function CSS_esc(s) { return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/"/g, '\\"'); }
  Map.prototype.panel = function (focus) {
    const x = this.bai.find((z) => z.tab === this.sel); if (!x) return;
    this.lastTab = x.tab;
    const b = T[x.id] || { ten: 'Thiên thể bí ẩn', loai: 'THIÊN THỂ', bg: base('#e0e4ff', '#7a84c8', '#1c2050'), tin: [], toan: '' };
    const v = this.state()[x.tab];
    const q = this.cfg.quyDao.find((z) => z.chuong.some((c) => c[0] === x.so));
    const chName = q ? (q.chuong.find((c) => c[0] === x.so) || [])[1] : '';
    if (!this.dim) { this.dim = document.createElement('div'); this.dim.className = 'vt-dim'; this.dim.onclick = () => this.close(); document.body.appendChild(this.dim); }
    if (!this.pn) {
      this.pn = document.createElement('div'); this.pn.className = 'vt-panel' + (this.lite ? ' lite' : '');
      this.pn.setAttribute('role', 'dialog'); this.pn.setAttribute('aria-labelledby', 'vt-pt');
      this.pn.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.close(); });
      document.body.appendChild(this.pn);
    }
    this.dim.classList.add('on');
    const go = v.s === 'done' ? 'Bay lại để ôn bài này' : 'Bay đến thiên thể · vào bài học';
    this.pn.innerHTML = '<div class="vt-ph">' + orbHTML(Object.assign({}, b, { vanh: b.vanh }), 84, '') +
      '<div><small>' + esc(b.loai) + '</small><h3 id="vt-pt">' + esc(b.ten) + '</h3><span>Chương ' + esc(x.so) + (chName ? ' · ' + esc(chName) : '') + '</span></div>' +
      '<button type="button" class="vt-x" aria-label="Đóng">' + SVG_X + '</button></div>' +
      (b.tin.length ? '<h4>Em có biết?</h4><ul>' + b.tin.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>' : '') +
      (b.toan ? '<div class="vt-math"><b>Góc toán học:</b> ' + esc(b.toan) + '</div>' : '') +
      '<div class="vt-bai"><b>' + esc(x.ten) + '</b>' + (x.ds ? '<p>' + esc(x.ds) + '</p>' : '') + '<span style="color:' + (v.now ? '#ffd678' : v.s === 'try' ? '#ffc58a' : v.s === 'done' ? '#9ff0c4' : '#c9d2ff') + '">' + esc(v.note) + '</span></div>' +
      '<a class="vt-go" href="' + esc(x.href) + '">' + go + '</a>';
    this.pn.querySelector('.vt-x').onclick = () => this.close();
    if (focus) this.pn.querySelector('.vt-x').focus();
  };

  /* ---- Nối với trang Các bài ---- */
  const maps = {};
  function init() {
    if (!document.getElementById('vt-css')) { const s = document.createElement('style'); s.id = 'vt-css'; s.textContent = CSS; document.head.appendChild(s); }
    Object.keys(VT_KHOI).forEach((g) => {
      const sec = document.getElementById('lop-' + g);
      if (sec && sec.querySelector('a.lesson[data-tab]')) maps[g] = new Map(sec, VT_KHOI[g]);
    });
  }
  window.VT = {
    init: init,
    /* o: kết quả ?tiendo=1 (o.bai[tab] = {d,y,l,t}); null khi chưa đăng nhập */
    tienDo: function (o) { Object.keys(maps).forEach((g) => maps[g].setProg(o)); },
    _T: T, _K: VT_KHOI
  };
})();
