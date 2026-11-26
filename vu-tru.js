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
    /* ---- Lớp 6: Hệ Mặt Trời. "Góc toán học" chỉ dùng kiến thức đã học đến bài đó ---- */
    sun: { ten: 'Mặt Trời', loai: 'NGÔI SAO', co: 96,
      bg: 'radial-gradient(circle at 50% 50%, #fffbe6 0 20%, transparent 60%), ' + base('#fff6c8', '#ffb627', '#e0560c'),
      tin: ['Mặt Trời là ngôi sao gần Trái Đất nhất.', 'Ánh sáng Mặt Trời đi đến Trái Đất mất khoảng 8 phút.', 'Mặt Trời lớn đến mức có thể chứa khoảng 1,3 triệu Trái Đất.'],
      toan: 'Tập hợp các hành tinh quay quanh Mặt Trời có 8 phần tử: Sao Thủy, Sao Kim, Trái Đất, Sao Hỏa, Sao Mộc, Sao Thổ, Sao Thiên Vương, Sao Hải Vương.' },
    mercury: { ten: 'Sao Thủy', loai: 'HÀNH TINH', co: 60,
      bg: crater + base('#e6e4e4', '#8f8c8c', '#2e2c2c'),
      tin: ['Sao Thủy là hành tinh nhỏ nhất và gần Mặt Trời nhất.', 'Một năm trên Sao Thủy chỉ dài 88 ngày Trái Đất.', 'Ban ngày nóng khoảng 430 °C, ban đêm lạnh tới khoảng 180 độ dưới 0 °C.'],
      toan: 'Trong số 88, chữ số 8 bên trái có giá trị 80, chữ số 8 bên phải có giá trị 8.' },
    venus: { ten: 'Sao Kim', loai: 'HÀNH TINH', co: 72,
      bg: 'repeating-linear-gradient(20deg, rgba(255,255,255,.14) 0 6px, transparent 6px 16px), ' + base('#fff3d0', '#e3bb76', '#7a4c16'),
      tin: ['Sao Kim là hành tinh nóng nhất, khoảng 465 °C, vì lớp khí dày giữ nhiệt.', 'Sao Kim tự quay ngược chiều với hầu hết các hành tinh khác.', 'Một ngày trên Sao Kim dài 243 ngày Trái Đất, còn một năm chỉ dài 225 ngày.'],
      toan: 'Vì 243 > 225 nên trên Sao Kim, một ngày dài hơn một năm!' },
    earth: { ten: 'Trái Đất', loai: 'HÀNH TINH', co: 76,
      bg: 'radial-gradient(ellipse 40% 8% at 50% 24%, rgba(255,255,255,.85) 0 50%, transparent 56%), radial-gradient(ellipse 34% 7% at 58% 80%, rgba(255,255,255,.75) 0 50%, transparent 56%), radial-gradient(ellipse 26% 18% at 34% 44%, #3f8f4a 0 62%, transparent 66%), radial-gradient(ellipse 18% 24% at 66% 60%, #7aa046 0 62%, transparent 66%), ' + base('#9ad6ff', '#2a6fd0', '#0a2a66'),
      tin: ['Trái Đất là hành tinh duy nhất đã biết có sự sống.', 'Khoảng 71% bề mặt Trái Đất được nước bao phủ.', 'Năm thường có 365 ngày, cứ 4 năm lại có một năm nhuận 366 ngày.'],
      toan: 'Bốn năm liên tiếp có 365 + 365 + 365 + 366 = 1 461 ngày.' },
    moon: { ten: 'Mặt Trăng', loai: 'VỆ TINH CỦA TRÁI ĐẤT', co: 62,
      bg: crater + base('#f4f4f4', '#a8a8ad', '#38383c'),
      tin: ['Mặt Trăng cách Trái Đất trung bình khoảng 384 400 km.', 'Mặt Trăng luôn quay một mặt về phía Trái Đất.', 'Đã có 12 người đặt chân lên Mặt Trăng, từ năm 1969 đến năm 1972.'],
      toan: 'Mặt Trăng quay quanh Trái Đất mất khoảng 27 ngày. Chia 365 cho 27 được 13, dư 14: một năm Mặt Trăng quay được hơn 13 vòng.' },
    mars: { ten: 'Sao Hỏa', loai: 'HÀNH TINH', co: 66,
      bg: 'radial-gradient(ellipse 30% 10% at 50% 7%, #fff 0 60%, transparent 66%), radial-gradient(ellipse 22% 12% at 60% 52%, rgba(90,20,5,.45) 0 60%, transparent 66%), radial-gradient(ellipse 16% 10% at 34% 66%, rgba(90,20,5,.35) 0 60%, transparent 66%), ' + base('#ffb48a', '#c1440e', '#4a1404'),
      tin: ['Màu đỏ của Sao Hỏa là do bụi đất chứa sắt bị gỉ.', 'Núi Olympus Mons trên Sao Hỏa cao khoảng 22 km, cao gấp hơn 2 lần đỉnh Everest.', 'Sao Hỏa có hai vệ tinh nhỏ: Phobos và Deimos.'],
      toan: 'Sao Hỏa cách Mặt Trời khoảng 228 000 000 km = 228 · 10⁶ km.' },
    phobos: { ten: 'Phobos', loai: 'VỆ TINH CỦA SAO HỎA', co: 50,
      bg: crater + base('#cbb8a6', '#7a6656', '#2a211a'),
      tin: ['Phobos là vệ tinh lớn hơn trong hai vệ tinh của Sao Hỏa, dài khoảng 27 km.', 'Phobos quay quanh Sao Hỏa mất chưa đến 8 giờ.', 'Phobos có hình dạng méo, giống một củ khoai tây.'],
      toan: 'Phobos dài khoảng 27 km, Deimos dài khoảng 15 km. Chiều dài trung bình của hai vệ tinh là (27 + 15) : 2 = 21 km.' },
    jupiter: { ten: 'Sao Mộc', loai: 'HÀNH TINH', co: 94,
      bg: 'radial-gradient(ellipse 15% 9% at 64% 62%, #c4512e 0 70%, transparent 76%), linear-gradient(180deg, #e8d3b0 0 12%, #c49a6c 12% 22%, #efe0c4 22% 34%, #a8714a 34% 44%, #ead6b5 44% 56%, #b5835a 56% 66%, #e6cfa8 66% 80%, #b98a62 80% 100%)',
      tin: ['Sao Mộc là hành tinh lớn nhất Hệ Mặt Trời.', 'Vết Đỏ Lớn là một cơn bão khổng lồ, rộng hơn cả Trái Đất.', 'Một ngày trên Sao Mộc chỉ dài khoảng 10 giờ.'],
      toan: 'Trong 30 giờ, Sao Mộc quay đúng 3 vòng vì 30 chia hết cho 10.' },
    saturn: { ten: 'Sao Thổ', loai: 'HÀNH TINH', co: 80, vanh: true,
      bg: 'linear-gradient(180deg, #f3e3b8 0 14%, #d9be82 14% 26%, #f1dfae 26% 40%, #caa86a 40% 52%, #efdca8 52% 68%, #c9a566 68% 82%, #e8d29c 82% 100%)',
      tin: ['Vành đai Sao Thổ được tạo bởi vô số mảnh băng và đá.', 'Sao Thổ nhẹ đến mức khối lượng riêng còn nhỏ hơn nước.', 'Đây là hành tinh có nhiều vệ tinh nhất Hệ Mặt Trời.'],
      toan: 'Sao Thổ cách Mặt Trời khoảng 1 430 triệu km. Số 1 430 chia hết cho cả 2 và 5 vì có chữ số tận cùng là 0.' },
    uranus: { ten: 'Sao Thiên Vương', loai: 'HÀNH TINH', co: 72,
      bg: base('#eaffff', '#9fe3ea', '#2a7280'),
      tin: ['Trục quay của Sao Thiên Vương nghiêng gần như nằm ngang, nên hành tinh như đang "lăn" quanh Mặt Trời.', 'Màu xanh nhạt là do khí metan trong khí quyển.', 'Một năm trên Sao Thiên Vương dài khoảng 84 năm Trái Đất.'],
      toan: 'Phân tích 84 ra thừa số nguyên tố: 84 = 2² · 3 · 7.' },
    neptune: { ten: 'Sao Hải Vương', loai: 'HÀNH TINH', co: 70,
      bg: 'radial-gradient(ellipse 14% 9% at 40% 56%, #14205e 0 70%, transparent 76%), radial-gradient(ellipse 30% 4% at 55% 30%, rgba(255,255,255,.4) 0 50%, transparent 56%), ' + base('#a8ccff', '#3a5fe0', '#0c1a5c'),
      tin: ['Sao Hải Vương là hành tinh xa Mặt Trời nhất.', 'Gió trên Sao Hải Vương mạnh nhất Hệ Mặt Trời, tới khoảng 2 000 km/h.', 'Năm 1846, người ta tìm ra Sao Hải Vương nhờ tính toán trên giấy trước khi nhìn thấy nó.'],
      toan: 'Một năm trên Sao Thiên Vương khoảng 84 năm, trên Sao Hải Vương khoảng 165 năm. ƯCLN(84, 165) = 3.' },
    titania: { ten: 'Titania', loai: 'VỆ TINH CỦA SAO THIÊN VƯƠNG', co: 60,
      bg: 'repeating-linear-gradient(60deg, transparent 0 11px, rgba(0,0,0,.15) 11px 13px), ' + crater + base('#e6e2de', '#a09890', '#3a3430'),
      tin: ['Titania là vệ tinh lớn nhất của Sao Thiên Vương, đường kính khoảng 1 578 km.', 'Nhà thiên văn William Herschel phát hiện Titania năm 1787.', 'Bề mặt Titania có những hẻm vực rất dài.'],
      toan: 'Nếu một vệ tinh quay một vòng hết 6 ngày, vệ tinh khác hết 9 ngày, cùng xuất phát từ một chỗ thì sau BCNN(6, 9) = 18 ngày chúng lại cùng về chỗ cũ.' },
    mimas: { ten: 'Mimas', loai: 'VỆ TINH CỦA SAO THỔ', co: 56,
      bg: 'radial-gradient(circle at 64% 42%, rgba(0,0,0,.35) 0 14%, rgba(255,255,255,.25) 15% 17%, transparent 18%), ' + crater + base('#f2f2f2', '#b0b0b4', '#3c3c42'),
      tin: ['Mimas là một vệ tinh nhỏ của Sao Thổ, đường kính khoảng 400 km.', 'Trên Mimas có hố va chạm Herschel rộng khoảng 140 km, bằng gần một phần ba đường kính vệ tinh.', 'Bề mặt Mimas rất lạnh, khoảng −200 °C.'],
      toan: 'Nhiệt độ khoảng 200 độ dưới 0 °C được viết bằng số nguyên âm: −200 °C.' },
    iapetus: { ten: 'Iapetus', loai: 'VỆ TINH CỦA SAO THỔ', co: 64,
      bg: 'linear-gradient(115deg, #2a211a 0 46%, transparent 52%), ' + base('#fbfaf6', '#c8c4ba', '#4a4640'),
      tin: ['Iapetus có hai nửa khác hẳn nhau: một nửa tối như than, một nửa sáng như tuyết.', 'Quanh xích đạo của Iapetus có một dải núi rất dài và cao.', 'Nhà thiên văn Giovanni Cassini phát hiện Iapetus năm 1671.'],
      toan: 'Từ năm 1671 đến năm ' + NAM + ' là ' + NAM + ' − 1671 = ' + (NAM - 1671) + ' năm.' },
    deimos: { ten: 'Deimos', loai: 'VỆ TINH CỦA SAO HỎA', co: 44,
      bg: crater + base('#d6c6b4', '#8a7664', '#2e241c'),
      tin: ['Deimos là vệ tinh nhỏ hơn của Sao Hỏa, dài khoảng 15 km.', 'Deimos quay quanh Sao Hỏa mất khoảng 30 giờ.', 'Bề mặt Deimos phủ một lớp bụi đá mịn nên trông khá nhẵn.'],
      toan: '30 − (24 + 6) = 0: Deimos quay một vòng mất khoảng 30 giờ, tức là một ngày 24 giờ và thêm 6 giờ.' },
    comet67p: { ten: 'Sao chổi 67P', loai: 'SAO CHỔI', co: 48, duoi: true,
      bg: crater + base('#bfbfc4', '#5c5c64', '#1a1a20'),
      tin: ['Sao chổi 67P có hình dạng giống một con vịt cao su, dài khoảng 4 km.', 'Ngày 12/11/2014, tàu đổ bộ Philae đáp xuống 67P: lần đầu tiên con người đưa tàu đáp xuống một sao chổi.', 'Tàu Rosetta đã bay khoảng 10 năm mới tới được sao chổi này.'],
      toan: '10 năm có khoảng 10 · 365 = 3 650 ngày.' },
    oberon: { ten: 'Oberon', loai: 'VỆ TINH CỦA SAO THIÊN VƯƠNG', co: 58,
      bg: crater + base('#d8cfc6', '#8e8278', '#2e2824'),
      tin: ['Oberon là vệ tinh lớn ở xa Sao Thiên Vương nhất.', 'Bề mặt Oberon chi chít hố va chạm.', 'William Herschel phát hiện Oberon năm 1787, cùng năm với Titania.'],
      toan: '1787 là số nguyên tố nên nó chỉ có hai ước tự nhiên là 1 và 1787.' },
    rhea: { ten: 'Rhea', loai: 'VỆ TINH CỦA SAO THỔ', co: 62,
      bg: crater + base('#f0efed', '#a8a6a2', '#3a3936'),
      tin: ['Rhea là vệ tinh lớn thứ hai của Sao Thổ, đường kính khoảng 1 527 km.', 'Bề mặt Rhea là băng và đá, phủ nhiều hố va chạm.', 'Giovanni Cassini phát hiện Rhea năm 1672.'],
      toan: 'Từ năm 1672 đến năm ' + NAM + ' là ' + (NAM - 1672) + ' năm.' },
    dione: { ten: 'Dione', loai: 'VỆ TINH CỦA SAO THỔ', co: 58,
      bg: 'repeating-linear-gradient(150deg, transparent 0 12px, rgba(255,255,255,.35) 12px 13px), ' + crater + base('#f1f0ee', '#a9a7a4', '#3b3a38'),
      tin: ['Dione là vệ tinh của Sao Thổ, đường kính khoảng 1 120 km.', 'Trên Dione có những vách băng sáng dài hàng trăm km.', 'Giovanni Cassini phát hiện Dione năm 1684.'],
      toan: 'Rhea được phát hiện năm 1672, Dione năm 1684: cách nhau 1684 − 1672 = 12 năm.' },
    ariel: { ten: 'Ariel', loai: 'VỆ TINH CỦA SAO THIÊN VƯƠNG', co: 56,
      bg: 'repeating-linear-gradient(80deg, transparent 0 10px, rgba(0,0,0,.14) 10px 12px), ' + base('#f4f4f6', '#b8b8c0', '#40404a'),
      tin: ['Ariel có bề mặt sáng nhất trong các vệ tinh lớn của Sao Thiên Vương.', 'Trên Ariel có nhiều thung lũng dài cắt ngang bề mặt.', 'William Lassell phát hiện Ariel năm 1851.'],
      toan: 'Từ năm 1851 đến năm ' + NAM + ' là ' + (NAM - 1851) + ' năm.' },
    umbriel: { ten: 'Umbriel', loai: 'VỆ TINH CỦA SAO THIÊN VƯƠNG', co: 56,
      bg: 'radial-gradient(circle at 50% 22%, rgba(255,255,255,.55) 0 7%, transparent 9%), ' + crater + base('#8a8a92', '#4c4c54', '#16161c'),
      tin: ['Umbriel là vệ tinh tối màu nhất trong các vệ tinh lớn của Sao Thiên Vương.', 'Trên Umbriel có hố Wunda với một vòng sáng, trông như một chiếc nhẫn.', 'William Lassell phát hiện Umbriel năm 1851, cùng năm với Ariel.'],
      toan: 'Năm 1851 có tổng các chữ số là 1 + 8 + 5 + 1 = 15.' },
    pallas: { ten: 'Pallas', loai: 'TIỂU HÀNH TINH', co: 54,
      bg: crater + base('#d4d0ca', '#86807a', '#2c2824'),
      tin: ['Pallas là thiên thể thứ hai được tìm thấy trong vành đai tiểu hành tinh, năm 1802.', 'Quỹ đạo của Pallas nghiêng nhiều so với quỹ đạo của các hành tinh.', 'Nhà thiên văn Heinrich Olbers phát hiện Pallas.'],
      toan: 'Ceres được tìm thấy năm 1801, Pallas năm 1802: chỉ cách nhau 1 năm.' },
    hubble: { ten: 'Kính viễn vọng Hubble', loai: 'TRẠM LUYỆN TẬP · KÍNH VIỄN VỌNG', tau: '#cfd6e6',
      tin: ['Hubble được phóng lên quỹ đạo ngày 24/4/1990.', 'Kính bay quanh Trái Đất ở độ cao khoảng 500 km.', 'Gương chính của Hubble rộng khoảng 2,4 m.'],
      toan: 'Số 1990 chia hết cho 2, cho 5 và cho 10 vì có chữ số tận cùng là 0.' },
    iss: { ten: 'Trạm Vũ trụ Quốc tế', loai: 'TRẠM ÔN CHƯƠNG', tau: '#dfe5f2',
      tin: ['Trạm bay quanh Trái Đất ở độ cao khoảng 400 km.', 'Mỗi vòng quanh Trái Đất mất khoảng 90 phút.', 'Có phi hành gia sống liên tục trên trạm từ năm 2000.'],
      toan: 'Một ngày có 24 · 60 = 1 440 phút; 1 440 : 90 = 16, nên trạm bay khoảng 16 vòng mỗi ngày.' },
    tiangong: { ten: 'Trạm Thiên Cung', loai: 'TRẠM LUYỆN TẬP', tau: '#e6e9f2',
      tin: ['Trạm Thiên Cung của Trung Quốc được hoàn thành năm 2022.', 'Trạm bay quanh Trái Đất ở độ cao khoảng 400 km.', 'Thường có 3 phi hành gia làm việc trên trạm.'],
      toan: 'Phân tích 2022 ra thừa số nguyên tố: 2022 = 2 · 3 · 337.' },
    apollo11: { ten: 'Tàu Apollo 11', loai: 'TRẠM ÔN CHƯƠNG', tau: '#e9e2d0',
      tin: ['Ngày 20/7/1969, Neil Armstrong và Buzz Aldrin là hai người đầu tiên đặt chân lên Mặt Trăng.', 'Phi hành gia thứ ba, Michael Collins, ở lại bay quanh Mặt Trăng trên tàu chỉ huy.', 'Các phi hành gia mang về Trái Đất đất đá của Mặt Trăng.'],
      toan: 'Phân tích 1969 ra thừa số nguyên tố: 1969 = 11 · 179.' },
    parker: { ten: 'Tàu Parker Solar Probe', loai: 'TRẠM LUYỆN TẬP · TÀU THĂM DÒ', tau: '#f0e4c8',
      tin: ['Tàu được phóng năm 2018 để bay sát Mặt Trời.', 'Đây là vật do con người làm ra bay nhanh nhất từ trước đến nay.', 'Tấm chắn nhiệt phía trước nóng khoảng 1 400 °C, nhưng các thiết bị phía sau vẫn mát.'],
      toan: 'Mặt trước tấm chắn khoảng 1 400 °C, phía sau khoảng 30 °C: chênh nhau 1 400 − 30 = 1 370 °C.' },
    perseverance: { ten: 'Xe tự hành Perseverance', loai: 'TRẠM LUYỆN TẬP · XE TỰ HÀNH', tau: '#e8e8ec',
      tin: ['Perseverance đáp xuống Sao Hỏa ngày 18/2/2021.', 'Xe mang theo trực thăng Ingenuity, chiếc trực thăng đầu tiên bay trên một hành tinh khác.', 'Xe thu thập mẫu đất đá để tìm dấu vết sự sống cổ xưa.'],
      toan: 'Ingenuity đã bay 72 lần. Số 72 là bội của 8 và của 9 vì 72 = 8 · 9.' },
    webb: { ten: 'Kính viễn vọng James Webb', loai: 'TRẠM ÔN CHƯƠNG · KÍNH VIỄN VỌNG', tau: '#f2c14e',
      tin: ['Kính được phóng lên vũ trụ ngày 25/12/2021.', 'Gương chính rộng 6,5 m, ghép từ 18 tấm hình lục giác.', 'Kính hoạt động cách Trái Đất khoảng 1,5 triệu km.'],
      toan: 'Mặt nóng của kính khoảng 85 °C, mặt lạnh khoảng −233 °C: chênh nhau 85 − (−233) = 318 °C.' },
    rosetta: { ten: 'Tàu Rosetta', loai: 'TRẠM ÔN TẬP · TÀU THĂM DÒ', tau: '#d9b45a',
      tin: ['Rosetta được phóng năm 2004 và đến sao chổi 67P năm 2014.', 'Rosetta thả tàu đổ bộ Philae xuống sao chổi.', 'Năm 2016, Rosetta kết thúc nhiệm vụ bằng cách đáp xuống chính sao chổi 67P.'],
      toan: 'Rosetta làm việc 2016 − 2004 = 12 năm.' },
    chandrayaan3: { ten: 'Tàu Chandrayaan-3', loai: 'TRẠM ÔN TẬP · TÀU ĐỔ BỘ', tau: '#e8c06a',
      tin: ['Chandrayaan-3 là tàu của Ấn Độ.', 'Ngày 23/8/2023, tàu đáp xuống gần cực nam của Mặt Trăng, lần đầu tiên có tàu đáp xuống vùng này.', 'Tàu mang theo một xe tự hành nhỏ để khám phá bề mặt.'],
      toan: 'Từ năm 2023 đến năm ' + NAM + ' là ' + (NAM - 2023) + ' năm.' },
    galileo: { ten: 'Tàu Galileo', loai: 'TRẠM ÔN TẬP · TÀU THĂM DÒ', tau: '#c9a24a',
      tin: ['Tàu Galileo được phóng năm 1989 và đến Sao Mộc năm 1995.', 'Đây là tàu đầu tiên bay quanh Sao Mộc.', 'Năm 2003, Galileo kết thúc nhiệm vụ bằng cách lao vào Sao Mộc.'],
      toan: 'Tàu bay 1995 − 1989 = 6 năm mới tới Sao Mộc.' },
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
    '6': {
      vung: 'Hệ Mặt Trời', giant: 'radial-gradient(circle at 30% 70%,#8fd0ff,#2a6fd0 55%,#0a2a66)',
      quyDao: [
        { k: 'ds', ten: 'Quỹ đạo Số học', phu: 'Số và Đại số · Thống kê và Xác suất', mau: '#ffb36b',
          chuong: [['I', 'Tập hợp các số tự nhiên'], ['II', 'Tính chia hết trong tập hợp các số tự nhiên'], ['III', 'Số nguyên'], ['VI', 'Phân số'], ['VII', 'Số thập phân'], ['IX', 'Dữ liệu và xác suất thực nghiệm']] },
        { k: 'hh', ten: 'Quỹ đạo Hình học', phu: 'Hình học và Đo lường', mau: '#7fd8ff',
          chuong: [['IV', 'Một số hình phẳng trong thực tiễn'], ['V', 'Tính đối xứng của hình phẳng trong tự nhiên'], ['VIII', 'Những hình hình học cơ bản']] }
      ],
      gan: {
        '6 - Tập hợp': 'sun', '6 - Cách ghi số tự nhiên': 'mercury', '6 - Thứ tự trong tập hợp các số tự nhiên': 'venus',
        '6 - Phép cộng và phép trừ số tự nhiên': 'earth', '6 - Phép nhân và phép chia số tự nhiên': 'moon', '6 - Luỹ thừa với số mũ tự nhiên': 'mars',
        '6 - Thứ tự thực hiện các phép tính': 'phobos', '6 - Bài tập cuối chương I': 'iss',
        '6 - Quan hệ chia hết và tính chất': 'jupiter', '6 - Dấu hiệu chia hết': 'saturn', '6 - Số nguyên tố': 'uranus',
        '6 - Luyện tập chung (sau Bài 10)': 'hubble', '6 - Ước chung. Ước chung lớn nhất': 'neptune', '6 - Bội chung, bội chung nhỏ nhất': 'titania',
        '6 - Luyện tập chung (sau Bài 12)': 'tiangong', '6 - Bài tập cuối chương II': 'apollo11',
        '6 - Tập hợp các số nguyên': 'mimas', '6 - Phép cộng và phép trừ số nguyên': 'iapetus', '6 - Quy tắc dấu ngoặc': 'deimos',
        '6 - Luyện tập chung (Chương III)': 'parker', '6 - Phép nhân số nguyên': 'comet67p', '6 - Phép chia hết, ước và bội': 'oberon',
        '6 - Luyện tập chung (sau Bài 17)': 'perseverance', '6 - Bài tập cuối chương III': 'webb'
      },
      kho: ['rhea', 'dione', 'ariel', 'umbriel', 'pallas'],
      khoTau: ['rosetta', 'chandrayaan3', 'galileo']
    },
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
.vt{position:relative;width:min(1200px,calc(100vw - 16px));left:50%;transform:translateX(-50%);margin-top:18px;border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#2a3f9e 0%,#24358a 35%,#2b2f86 70%,#3a2f8a 100%);color:#e8ecff;font-family:'Be Vietnam Pro',system-ui,sans-serif;padding:24px clamp(12px,2.5vw,28px) 34px;box-sizing:border-box;isolation:isolate}
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
.vt-tabs{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;padding:5px;margin-top:16px;border-radius:16px;background:rgba(16,24,72,.7);border:1px solid #5566b8}
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
.vt-badge{position:absolute;right:-4px;top:-6px;width:26px;height:26px;border-radius:50%;border:3px solid #24358a;display:flex;align-items:center;justify-content:center}
.vt-badge svg{width:13px;height:13px}
.vt-rocket{position:absolute;left:-28px;top:-24px;width:38px;height:38px;transform:rotate(35deg)}
.vt-lbl{display:flex;flex-direction:column;gap:2px;min-width:0;padding:9px 13px;border-radius:14px;background:rgba(16,24,72,.78);border:1px solid rgba(170,190,255,.35);backdrop-filter:blur(4px)}
.vt-lbl small{font-size:.7rem;font-weight:700;letter-spacing:.06em;color:#9fb4ff}
.vt-lbl b{font-size:.95rem;line-height:1.3;color:#fff}
.vt-lbl span{font-size:.8rem;line-height:1.35;color:#9ff0c4}
.vt-pl.now .vt-lbl{border-color:rgba(255,214,120,.7)}.vt-pl.now .vt-lbl span{color:#ffd678}
.vt-pl.done .vt-lbl{border-color:rgba(57,217,138,.45)}
.vt-pl.try .vt-lbl span{color:#ffc58a}
.vt-pl.open .vt-lbl span,.vt-pl.new .vt-lbl span{color:#c9d2ff}
.vt-pl.lock .vt-orb{filter:grayscale(.85) brightness(.75)}.vt-pl.lock .vt-lbl span{color:#c9d2ff}
.vt-panel .vt-go.lock{background:rgba(255,255,255,.14);color:#e6eaff!important;cursor:default;margin:0 0 10px;padding:8px 12px;text-align:center;font-weight:600;line-height:1.4}
.vt-pl.sel .vt-lbl{border-color:#ffd678;box-shadow:0 0 0 1px #ffd678}
.vt-foot{margin:8px 0 0;text-align:center;font-size:.8rem;color:#a9b3e6}
.vt-panel{position:fixed;z-index:60;right:20px;bottom:20px;width:380px;max-width:calc(100vw - 24px);max-height:calc(100vh - 40px);overflow-y:auto;padding:20px;border-radius:24px;background:rgba(30,44,118,.97);border:1px solid rgba(170,190,255,.45);box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 40px rgba(120,140,255,.18);color:#e8ecff;font-family:'Be Vietnam Pro',system-ui,sans-serif;animation:vt-in .3s ease-out;display:flex;flex-direction:column;gap:12px;box-sizing:border-box}
.vt-panel *{box-sizing:border-box}
.vt-ph{display:flex;align-items:center;gap:14px}
.vt-ph .vt-orb{width:84px;height:84px}
.vt-ph div{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.vt-ph small{font-size:.72rem;font-weight:700;letter-spacing:.07em;color:#9fb4ff}
.vt-ph h3{margin:0;font:800 1.45rem/1.15 'Baloo 2','Be Vietnam Pro',sans-serif;color:#fff}
.vt-ph span{font-size:.8rem;color:#c9d2ff}
.vt-x{flex:none;align-self:flex-start;width:44px;height:44px;border-radius:50%;border:1px solid #6a7bd0;background:transparent;color:#dfe5ff;cursor:pointer;display:flex;align-items:center;justify-content:center}
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
.vt-dim{position:fixed;inset:0;z-index:59;background:rgba(10,16,50,.45);display:none}
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
    if (st === 'lock') h += '<span class="vt-badge" style="background:#8a94c8" aria-hidden="true">🔒</span>';
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
        const cuoi = /cuối chương|luyện tập chung/i.test(ten);
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
      const kb = window.KB ? KB.xet(o, x.tab) : { mo: true };   // khóa bài theo thứ tự (khoa-bai.js)
      if (!kb.mo) st[x.tab] = { s: 'lock', note: 'Chưa mở · ' + KB.loiNhan(kb), kb };
    });
    if (o) this.cfg.quyDao.forEach((q) => {
      const ds = q.chuong.map((c) => c[0]);
      const first = this.bai.filter((x) => ds.indexOf(x.so) >= 0).find((x) => st[x.tab].s !== 'done' && st[x.tab].s !== 'lock');
      if (first) { const v = st[first.tab]; v.now = true; v.note = oDay(o) + ' · ' + v.note; }
    });
    return st;
  };
  // Mã giáo viên (lớp GV) không xưng "em"
  function oDay(o) { return o && /^\s*gv\s*$/i.test(String(o.c || '')) ? 'Đang ở đây' : 'Em đang ở đây'; }
  Map.prototype.draw = function () {
    const cfg = this.cfg, st = this.state(), narrow = window.innerWidth <= 820;
    const logged = !!this.prog;
    let h = '<span class="vt-sky" aria-hidden="true"></span><span class="vt-sky2" aria-hidden="true"></span><span class="vt-sky3" aria-hidden="true"></span>' +
      '<span class="vt-neb" aria-hidden="true" style="left:-12%;top:300px;width:62%;height:800px;background:radial-gradient(closest-side,rgba(255,140,110,.32),rgba(200,90,170,.18) 55%,transparent)"></span>' +
      '<span class="vt-neb" aria-hidden="true" style="right:-14%;top:180px;width:64%;height:900px;background:radial-gradient(closest-side,rgba(80,200,255,.32),rgba(120,100,240,.18) 55%,transparent)"></span>' +
      '<span class="vt-giant" aria-hidden="true"' + (cfg.giant ? ' style="background:' + cfg.giant + '"' : '') + '></span>' +
      '<div class="vt-head"><small>BẢN ĐỒ VŨ TRỤ</small><b>' + esc(cfg.vung) + '</b><span>Mỗi bài học là một thiên thể có thật. Bấm vào để xem thông tin và bay đến bài.</span></div>' +
      '<div class="vt-legend">' + (logged ? '<span><i style="background:#39d98a"></i>Đã chinh phục (từ 5 điểm)</span><span><i style="background:#ffd678;box-shadow:0 0 8px 2px rgba(255,214,120,.7)"></i>' + oDay(this.prog) + '</span><span><i style="background:#ffb36b"></i>Cần ôn thêm</span>' : '<span>Nhập mã học sinh ở trên để thấy tiến độ của em trên bản đồ.</span>') + '</div>' +
      '<div class="vt-tabs" role="tablist" aria-label="Chọn phân môn">' + cfg.quyDao.map((q) => '<button role="tab" type="button" data-q="' + q.k + '" aria-selected="' + (q.k === this.tab) + '" style="--m:' + q.mau + '">' + esc(q.ten) + '</button>').join('') + '</div>' +
      '<div class="vt-lanes">';
    cfg.quyDao.forEach((q) => {
      const xs = narrow ? [13, 36] : [16, 46];
      let y = 18, n = 0; const pts = []; let inner = '';
      const present = q.chuong.filter((c) => this.bai.some((x) => x.so === c[0]));
      const lastIdx = present.length ? q.chuong.indexOf(present[present.length - 1]) : 0;
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
      (v.s === 'lock' ? '<p class="vt-go lock" role="note">🔒 Chưa mở. Hoàn thành bài trước hoặc chờ thầy cô mở bài.</p>' + (v.kb && v.kb.url ? '<a class="vt-go" href="' + esc(v.kb.url) + '">Bay về bài trước</a>' : '')
        : '<a class="vt-go" href="' + esc(x.href) + '">' + go + '</a>');
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
