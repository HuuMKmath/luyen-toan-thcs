/* Bài tập tự luận – Bài 2. Cộng, trừ, nhân, chia số hữu tỉ (Toán 7, Kết nối tri thức).
   Chia theo dạng (thầy duyệt 27/11/2026), mỗi dạng có phương pháp giải, bài xếp dễ → khó, cuối dạng có bài tự luyện; mục Dành cho HSG riêng, giải theo 4 bước.
   Chỉ dùng kiến thức đã học đến Bài 2 (và Toán 6): chưa học quy tắc chuyển vế (Bài 4), chưa học luỹ thừa của số hữu tỉ (Bài 3).
   Tìm x dùng quan hệ giữa các số trong phép tính (như Toán 6): số hạng = tổng − số hạng kia, thừa số = tích : thừa số kia, … */
(function () {
  "use strict";
  var F = function (n, d) { return '<span class="fr"><span>' + n + "</span><span>" + d + "</span></span>"; };

  var ITEMS = [
    /* ===== Dạng 1. Thực hiện phép tính ===== */
    {
      id: "nb1", lv: "NB",
      de: "Tính:<br>a) " + F("−3", 4) + " + " + F(5, 6) + ";  b) " + F(2, 5) + " − " + F("−3", 10) + ";  c) (−0,8) · " + F(5, 12) + ";  d) " + F("−6", 7) + " : " + F(3, 14) + ".",
      goi: "Cộng, trừ: quy đồng mẫu dương. Nhân: tử nhân tử, mẫu nhân mẫu. Chia: nhân với số nghịch đảo của số chia. Số thập phân thì đổi ra phân số.",
      steps: [
        "a) " + F("−3", 4) + " + " + F(5, 6) + " = " + F("−9", 12) + " + " + F(10, 12) + " = " + F(1, 12) + ".",
        "b) " + F(2, 5) + " − " + F("−3", 10) + " = " + F(4, 10) + " + " + F(3, 10) + " = " + F(7, 10) + ".",
        "c) (−0,8) · " + F(5, 12) + " = " + F("−4", 5) + " · " + F(5, 12) + " = " + F("−20", 60) + " = " + F("−1", 3) + ".",
        "d) " + F("−6", 7) + " : " + F(3, 14) + " = " + F("−6", 7) + " · " + F(14, 3) + " = " + F("−84", 21) + " = −4."
      ],
      dap: "a) " + F(1, 12) + "; b) " + F(7, 10) + "; c) " + F("−1", 3) + "; d) −4.",
      loi: "Cộng tử với tử, mẫu với mẫu (" + F("−3", 4) + " + " + F(5, 6) + " = " + F(2, 10) + "); khi chia lại đảo số bị chia."
    },
    {
      id: "th1", lv: "TH",
      de: "Tính:<br>a) (" + F("−2", 3) + " + " + F(3, 4) + ") · " + F("−6", 5) + ";  b) 1,25 : " + F("−5", 8) + " − " + F(1, 2) + ";  c) 3" + F(1, 2) + " · " + F("−4", 7) + " + 0,5.",
      goi: "Trong ngoặc trước; nhân, chia trước cộng, trừ sau. Đổi số thập phân, hỗn số ra phân số.",
      pt: [
        { ten: "Câu a", dich: "(" + F("−2", 3) + " + " + F(3, 4) + ") · " + F("−6", 5), sd: [["Nhân kết quả trong ngoặc với " + F("−6", 5), [2]], ["Tính trong ngoặc: quy đồng mẫu 12", [1]]], gt: "Biểu thức có ngoặc" },
        { ten: "Câu b", dich: "1,25 : " + F("−5", 8) + " − " + F(1, 2), sd: [["Trừ " + F(1, 2) + " sau cùng", [4]], ["Phép chia làm trước: 1,25 = " + F(5, 4) + ", nhân với nghịch đảo " + F(8, "−5"), [3]]], gt: "Chia trước, trừ sau" },
        { ten: "Câu c", dich: "3" + F(1, 2) + " · " + F("−4", 7) + " + 0,5", sd: [["Cộng 0,5 sau cùng", [6]], ["Đổi 3" + F(1, 2) + " = " + F(7, 2) + " rồi nhân", [5]]], gt: "Nhân trước, cộng sau" }],
      steps: [
        "a) (" + F("−2", 3) + " + " + F(3, 4) + ") · " + F("−6", 5) + " = (" + F("−8", 12) + " + " + F(9, 12) + ") · " + F("−6", 5) + " = " + F(1, 12) + " · " + F("−6", 5),
        "= " + F("−6", 60) + " = " + F("−1", 10) + ".",
        "b) 1,25 : " + F("−5", 8) + " − " + F(1, 2) + " = " + F(5, 4) + " · " + F(8, "−5") + " − " + F(1, 2),
        "= −2 − " + F(1, 2) + " = " + F("−5", 2) + ".",
        "c) 3" + F(1, 2) + " · " + F("−4", 7) + " + 0,5 = " + F(7, 2) + " · " + F("−4", 7) + " + 0,5",
        "= −2 + 0,5 = −1,5."
      ],
      dap: "a) " + F("−1", 10) + "; b) " + F("−5", 2) + "; c) −1,5.",
      loi: "Câu b làm phép trừ trước phép chia; câu c nhân hỗn số kiểu 3 · " + F("−4", 7) + " + " + F(1, 2) + " · " + F("−4", 7) + " nhưng quên một số hạng."
    },
    {
      id: "vd1", lv: "VD",
      de: "Cho A = (" + F(1, 3) + " − " + F(3, 4) + ") : (" + F(5, 6) + " − " + F(1, 2) + ") và B = (−0,75) · 1" + F(1, 3) + " − " + F(1, 4) + ".<br>a) Tính A và B.<br>b) Chứng tỏ A = B. Số A là số hữu tỉ âm hay dương?",
      goi: "A: tính từng ngoặc rồi chia. B: đổi −0,75 = " + F("−3", 4) + ", 1" + F(1, 3) + " = " + F(4, 3) + "; nhân trước, trừ sau.",
      pt: [
        { ten: "Câu a (tính A)", dich: "A = (" + F(1, 3) + " − " + F(3, 4) + ") : (" + F(5, 6) + " − " + F(1, 2) + ")", sd: [["Chia hai kết quả: nhân với nghịch đảo", [3]], ["Tính hai ngoặc: " + F("−5", 12) + " và " + F(1, 3), [1, 2]]], gt: "Biểu thức A" },
        { ten: "Câu a (tính B)", dich: "B = (−0,75) · 1" + F(1, 3) + " − " + F(1, 4), sd: [["Trừ " + F(1, 4) + " sau cùng", [5]], ["Nhân " + F("−3", 4) + " · " + F(4, 3) + " = −1", [4]]], gt: "Biểu thức B" },
        { ten: "Câu b", dich: "A = B và dấu của A", sd: [["So sánh hai kết quả " + F("−5", 4) + "; tử và mẫu khác dấu", [6]]], gt: "Kết quả câu a" }],
      hieu: { gt: "A = (" + F(1, 3) + " − " + F(3, 4) + ") : (" + F(5, 6) + " − " + F(1, 2) + "); B = (−0,75) · 1" + F(1, 3) + " − " + F(1, 4) + ".", kl: "a) Tính A, B. b) A = B; A âm hay dương?",
        hoi: [
          ["Trong A, phép tính nào phải làm trước?", "Hai phép trừ trong hai dấu ngoặc làm trước, phép chia làm sau."],
          ["Trong B có những loại số nào? Nên viết chúng thế nào?", "Số thập phân −0,75 và hỗn số 1" + F(1, 3) + ". Nên đổi cả hai ra phân số: " + F("−3", 4) + " và " + F(4, 3) + "."],
          ["Không tính, đoán xem A âm hay dương?", F(1, 3) + " < " + F(3, 4) + " nên ngoặc thứ nhất âm; " + F(5, 6) + " > " + F(1, 2) + " nên ngoặc thứ hai dương. Âm chia dương ra âm: A âm."]] },
      nguoc: [
      { ten: "Tính A", dich: "Tính A",
        sd: [["A = " + F("−5", 12) + " : " + F(1, 3) + " = " + F("−5", 12) + " · 3", [3]], ["Ngoặc thứ nhất = " + F("−5", 12) + "; ngoặc thứ hai = " + F(1, 3), [1, 2]]],
        gt: "Biểu thức A",
        ket: "A = " + F("−5", 12) + " · 3 = " + F("−5", 4) + ".",
        buoc: [
        { hoi: "A là thương của hai ngoặc. Muốn tính A, cần biết gì trước?",
          nho: "Biểu thức có dấu ngoặc: làm trong ngoặc trước.",
          chon: [
            ["Giá trị của từng ngoặc", true, "Đúng. Sau đó mới chia."],
            ["Chia từng số: " + F(1, 3) + " : " + F(5, 6) + " rồi " + F(3, 4) + " : " + F(1, 2), false, "Phép chia không \"chia vào\" từng số hạng của số chia như vậy. Phải tính trọn số chia trước."]],
          dat: "Hai ngoặc: " + F(1, 3) + " − " + F(3, 4) + " và " + F(5, 6) + " − " + F(1, 2) },
        { hoi: "Tính hai ngoặc thế nào?",
          nho: "Quy đồng mẫu dương rồi trừ hai tử.",
          chon: [
            [F(1, 3) + " − " + F(3, 4) + " = " + F(4, 12) + " − " + F(9, 12) + " = " + F("−5", 12) + "; " + F(5, 6) + " − " + F(1, 2) + " = " + F(5, 6) + " − " + F(3, 6) + " = " + F(1, 3), true, "Đúng. Giờ chỉ còn một phép chia."],
            [F(1, 3) + " − " + F(3, 4) + " = " + F("−2", "−1"), false, "Không trừ tử với tử, mẫu với mẫu."]],
          dat: "Hai ngoặc bằng " + F("−5", 12) + " và " + F(1, 3) },
        { hoi: "Chia " + F("−5", 12) + " cho " + F(1, 3) + " thế nào?",
          nho: "x : y = x · (nghịch đảo của y). Nghịch đảo của " + F(1, 3) + " là 3.",
          chon: [
            [F("−5", 12) + " · 3 = " + F("−15", 12) + " = " + F("−5", 4), true, "Đúng."],
            [F("−5", 12) + " · " + F(1, 3) + " = " + F("−5", 36), false, "Phải nhân với nghịch đảo của số chia, không nhân với chính số chia."]],
          dat: "A = " + F("−5", 12) + " · 3" }] },
      { ten: "Tính B và so sánh", dich: "Tính B, chứng tỏ A = B",
        sd: [["B = −1 − " + F(1, 4) + " = " + F("−5", 4), [5]], ["(−0,75) · 1" + F(1, 3) + " = " + F("−3", 4) + " · " + F(4, 3) + " = −1", [4]]],
        gt: "Biểu thức B, kết quả A = " + F("−5", 4),
        ket: "B = " + F("−5", 4) + " = A. A có tử âm, mẫu dương nên A là số hữu tỉ âm.",
        buoc: [
        { hoi: "Trong B, phép tính nào làm trước?",
          nho: "Nhân, chia trước; cộng, trừ sau.",
          chon: [
            ["Phép nhân (−0,75) · 1" + F(1, 3) + " làm trước, phép trừ " + F(1, 4) + " làm sau", true, "Đúng. " + F("−3", 4) + " · " + F(4, 3) + " = −1, rồi −1 − " + F(1, 4) + " = " + F("−5", 4) + "."],
            ["Tính 1" + F(1, 3) + " − " + F(1, 4) + " trước", false, "Không có dấu ngoặc nên phải nhân trước."]],
          dat: "(−0,75) · 1" + F(1, 3) + " = −1" }] }],
      nhin: [
        ["Kết quả có khớp với dự đoán A âm ở bước 1 không?", "Có: A = " + F("−5", 4) + " < 0."],
        ["Kiểm tra lại B bằng số thập phân.", "(−0,75) · 1,333… ≈ −1; −1 − 0,25 = −1,25 = " + F("−5", 4) + ". Đúng."],
        ["Vì sao (−0,75) · 1" + F(1, 3) + " ra số đẹp?", F("−3", 4) + " và " + F(4, 3) + " có tử và mẫu \"đổi chỗ\" cho nhau, nên tích bằng −1 (hai số này gần như nghịch đảo của nhau, chỉ khác dấu)."]],
      steps: [
        "a) A = (" + F(1, 3) + " − " + F(3, 4) + ") : (" + F(5, 6) + " − " + F(1, 2) + ") = (" + F(4, 12) + " − " + F(9, 12) + ") : (" + F(5, 6) + " − " + F(3, 6) + ")",
        "= " + F("−5", 12) + " : " + F(2, 6) + " = " + F("−5", 12) + " : " + F(1, 3),
        "= " + F("−5", 12) + " · 3 = " + F("−5", 4) + ".",
        "B = (−0,75) · 1" + F(1, 3) + " − " + F(1, 4) + " = " + F("−3", 4) + " · " + F(4, 3) + " − " + F(1, 4),
        "= −1 − " + F(1, 4) + " = " + F("−5", 4) + ".",
        "b) A = B = " + F("−5", 4) + ". Vì " + F("−5", 4) + " < 0 nên A là số hữu tỉ âm."
      ],
      dap: "A = B = " + F("−5", 4) + "; A là số hữu tỉ âm.",
      loi: "Chia cho " + F(1, 3) + " mà lại nhân với " + F(1, 3) + "; trong B trừ trước rồi mới nhân.",
      mix: [1]
    },

    /* ===== Dạng 2. Tính nhanh, tính hợp lí ===== */
    {
      id: "nb2", lv: "NB",
      de: "Tính một cách hợp lí:<br>a) " + F(2, 7) + " + " + F("−5", 9) + " + " + F(5, 7) + ";  b) " + F("−3", 8) + " · " + F(4, 11) + " + " + F("−3", 8) + " · " + F(7, 11) + ".",
      goi: "a) Đổi chỗ để nhóm hai phân số cùng mẫu 7. b) Đặt thừa số chung " + F("−3", 8) + " ra ngoài.",
      steps: [
        "a) " + F(2, 7) + " + " + F("−5", 9) + " + " + F(5, 7) + " = (" + F(2, 7) + " + " + F(5, 7) + ") + " + F("−5", 9) + " = 1 + " + F("−5", 9) + " = " + F(4, 9) + ".",
        "b) " + F("−3", 8) + " · " + F(4, 11) + " + " + F("−3", 8) + " · " + F(7, 11) + " = " + F("−3", 8) + " · (" + F(4, 11) + " + " + F(7, 11) + ") = " + F("−3", 8) + " · 1 = " + F("−3", 8) + "."
      ],
      dap: "a) " + F(4, 9) + "; b) " + F("−3", 8) + ".",
      loi: "Câu b tính từng tích rồi cộng, dễ sai và mất thời gian."
    },
    {
      id: "th2", lv: "TH",
      de: "Bỏ dấu ngoặc rồi tính:<br>a) (" + F(3, 5) + " − " + F(1, 4) + ") − (" + F(3, 5) + " + " + F(3, 4) + ");  b) " + F(7, 12) + " − (" + F(5, 12) + " − 1,5);  c) " + F("−2", 3) + " · 4,5 + " + F("−2", 3) + " · (−1,5).",
      goi: "Dấu \"−\" trước ngoặc: đổi dấu mọi số hạng trong ngoặc. Câu c: đặt " + F("−2", 3) + " ra ngoài.",
      pt: [
        { ten: "Câu a", dich: "Tính (" + F(3, 5) + " − " + F(1, 4) + ") − (" + F(3, 5) + " + " + F(3, 4) + ")", sd: [["Nhóm: (" + F(3, 5) + " − " + F(3, 5) + ") − (" + F(1, 4) + " + " + F(3, 4) + ")", [2]], ["Bỏ ngoặc, đổi dấu các số hạng của ngoặc thứ hai", [1]]], gt: "Quy tắc dấu ngoặc" },
        { ten: "Câu b", dich: "Tính " + F(7, 12) + " − (" + F(5, 12) + " − 1,5)", sd: [["Cộng " + F(1, 6) + " + 1,5", [4]], ["Bỏ ngoặc: " + F(7, 12) + " − " + F(5, 12) + " + 1,5", [3]]], gt: "Quy tắc dấu ngoặc" },
        { ten: "Câu c", dich: "Tính " + F("−2", 3) + " · 4,5 + " + F("−2", 3) + " · (−1,5)", sd: [["Tính " + F("−2", 3) + " · 3", [5]], ["Đặt " + F("−2", 3) + " ra ngoài: " + F("−2", 3) + " · (4,5 − 1,5)", [5]]], gt: "Tính chất phân phối" }],
      steps: [
        "a) (" + F(3, 5) + " − " + F(1, 4) + ") − (" + F(3, 5) + " + " + F(3, 4) + ") = " + F(3, 5) + " − " + F(1, 4) + " − " + F(3, 5) + " − " + F(3, 4) + ".",
        "= (" + F(3, 5) + " − " + F(3, 5) + ") − (" + F(1, 4) + " + " + F(3, 4) + ") = 0 − 1 = −1.",
        "b) " + F(7, 12) + " − (" + F(5, 12) + " − 1,5) = " + F(7, 12) + " − " + F(5, 12) + " + 1,5.",
        "= " + F(2, 12) + " + " + F(3, 2) + " = " + F(1, 6) + " + " + F(9, 6) + " = " + F(10, 6) + " = " + F(5, 3) + ".",
        "c) " + F("−2", 3) + " · 4,5 + " + F("−2", 3) + " · (−1,5) = " + F("−2", 3) + " · [4,5 + (−1,5)] = " + F("−2", 3) + " · 3 = −2."
      ],
      dap: "a) −1; b) " + F(5, 3) + "; c) −2.",
      loi: "Bỏ ngoặc có dấu \"−\" đằng trước nhưng chỉ đổi dấu số hạng đầu."
    },
    {
      id: "vd2", lv: "VD",
      de: "Tính một cách hợp lí: C = (" + F("−3", 4) + " + " + F(2, 5) + ") : " + F(3, 7) + " + (" + F(3, 5) + " + " + F("−1", 4) + ") : " + F(3, 7) + ".",
      goi: "Hai phép chia có cùng số chia " + F(3, 7) + ". Đổi chia thành nhân với " + F(7, 3) + " rồi đặt thừa số chung.",
      pt: [
        { ten: "Cả bài", dich: "Tính C", sd: [["C = [tổng hai ngoặc] · " + F(7, 3), [2, 3]], ["Đổi hai phép chia cho " + F(3, 7) + " thành nhân với " + F(7, 3), [1]]], gt: "Hai phép chia cùng số chia " + F(3, 7) }],
      hieu: { gt: "C = (" + F("−3", 4) + " + " + F(2, 5) + ") : " + F(3, 7) + " + (" + F(3, 5) + " + " + F("−1", 4) + ") : " + F(3, 7) + ".", kl: "Tính C một cách hợp lí.",
        hoi: [
          ["Hai số hạng của C có gì giống nhau?", "Cả hai đều là một tổng chia cho cùng số " + F(3, 7) + "."],
          ["Các số trong hai ngoặc có gì đặc biệt?", "Có " + F("−3", 4) + " và " + F("−1", 4) + " cùng mẫu 4; " + F(2, 5) + " và " + F(3, 5) + " cùng mẫu 5. Ghép lại có thể ra số tròn."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tính C",
        sd: [["C = 0 · " + F(7, 3) + " = 0", [3]], ["Tổng hai ngoặc = (" + F("−3", 4) + " + " + F("−1", 4) + ") + (" + F(2, 5) + " + " + F(3, 5) + ") = −1 + 1", [2]], ["C = [(" + F("−3", 4) + " + " + F(2, 5) + ") + (" + F(3, 5) + " + " + F("−1", 4) + ")] · " + F(7, 3), [1]]],
        gt: "Hai phép chia có cùng số chia " + F(3, 7),
        ket: "C = [(−1) + 1] · " + F(7, 3) + " = 0 · " + F(7, 3) + " = 0.",
        buoc: [
        { hoi: "Hai số hạng cùng chia cho " + F(3, 7) + ". Viết lại phép chia thế nào để dùng được tính chất phân phối?",
          nho: "Chia cho một số khác 0 là nhân với nghịch đảo của nó. a · c + b · c = (a + b) · c.",
          chon: [
            ["Chia cho " + F(3, 7) + " là nhân với " + F(7, 3) + ", nên C = [(" + F("−3", 4) + " + " + F(2, 5) + ") + (" + F(3, 5) + " + " + F("−1", 4) + ")] · " + F(7, 3), true, "Đúng. Chỉ còn tính tổng trong ngoặc vuông."],
            ["Tính từng ngoặc rồi chia riêng", false, "Làm được nhưng dài và dễ sai; đề yêu cầu tính hợp lí."]],
          dat: "C = [tổng hai ngoặc] · " + F(7, 3) },
        { hoi: "Tính tổng trong ngoặc vuông nhanh nhất thế nào?",
          nho: "Tính chất giao hoán và kết hợp của phép cộng.",
          chon: [
            ["Nhóm các số cùng mẫu: (" + F("−3", 4) + " + " + F("−1", 4) + ") + (" + F(2, 5) + " + " + F(3, 5) + ") = −1 + 1 = 0", true, "Đúng. Tổng bằng 0 nên C = 0."],
            ["Quy đồng cả bốn số với mẫu 20", false, "Cũng ra đúng nhưng không hợp lí: nhóm cùng mẫu nhanh hơn nhiều."]],
          dat: "Tổng trong ngoặc vuông bằng 0" }] }],
      nhin: [
        ["Kiểm tra bằng cách tính từng ngoặc.", F("−3", 4) + " + " + F(2, 5) + " = " + F("−7", 20) + "; " + F(3, 5) + " + " + F("−1", 4) + " = " + F(7, 20) + ". Hai số đối nhau, chia cùng " + F(3, 7) + " thì vẫn đối nhau, tổng bằng 0. Đúng."],
        ["Đổi số chia " + F(3, 7) + " thành số khác 0 bất kì thì C có đổi không?", "Không: C luôn bằng 0, vì tổng trong ngoặc vuông bằng 0."]],
      steps: [
        "C = (" + F("−3", 4) + " + " + F(2, 5) + ") : " + F(3, 7) + " + (" + F(3, 5) + " + " + F("−1", 4) + ") : " + F(3, 7) + " = (" + F("−3", 4) + " + " + F(2, 5) + ") · " + F(7, 3) + " + (" + F(3, 5) + " + " + F("−1", 4) + ") · " + F(7, 3) + " = [(" + F("−3", 4) + " + " + F(2, 5) + ") + (" + F(3, 5) + " + " + F("−1", 4) + ")] · " + F(7, 3) + ".",
        "Trong ngoặc vuông: [" + F("−3", 4) + " + " + F("−1", 4) + "] + [" + F(2, 5) + " + " + F(3, 5) + "] = (−1) + 1 = 0.",
        "C = 0 · " + F(7, 3) + " = 0."
      ],
      dap: "C = 0.",
      loi: "Đặt " + F(3, 7) + " ra ngoài thành [tổng] · " + F(3, 7) + " (quên đổi chia thành nhân với nghịch đảo)."
    },

    /* ===== Dạng 3. Tìm x ===== */
    {
      id: "nb3", lv: "NB",
      de: "Tìm x, biết:<br>a) x + " + F(2, 5) + " = " + F("−1", 3) + ";  b) x · " + F("−3", 4) + " = " + F(9, 8) + ".",
      goi: "Số hạng chưa biết = tổng − số hạng đã biết. Thừa số chưa biết = tích : thừa số đã biết.",
      steps: [
        "a) x = " + F("−1", 3) + " − " + F(2, 5) + " = " + F("−5", 15) + " − " + F(6, 15) + " = " + F("−11", 15) + ".",
        "b) x = " + F(9, 8) + " : " + F("−3", 4) + " = " + F(9, 8) + " · " + F(4, "−3") + " = " + F(36, "−24") + " = " + F("−3", 2) + "."
      ],
      dap: "a) x = " + F("−11", 15) + "; b) x = " + F("−3", 2) + ".",
      loi: "Câu a lấy " + F("−1", 3) + " + " + F(2, 5) + "; câu b lấy tích nhân với thừa số đã biết."
    },
    {
      id: "th3", lv: "TH",
      de: "Tìm x, biết:<br>a) " + F(3, 4) + " − x = " + F("−1", 6) + ";  b) x : 1,2 = " + F("−5", 6) + ";  c) " + F(2, 3) + " · x − " + F(1, 2) + " = " + F(1, 6) + ".",
      goi: "Số trừ = số bị trừ − hiệu; số bị chia = thương · số chia. Câu c: tìm " + F(2, 3) + " · x trước.",
      pt: [
        { ten: "Câu a", dich: "Tìm x trong " + F(3, 4) + " − x = " + F("−1", 6), sd: [["x là số trừ: x = " + F(3, 4) + " − " + F("−1", 6), [1]]], gt: "Quan hệ giữa số bị trừ, số trừ, hiệu" },
        { ten: "Câu b", dich: "Tìm x trong x : 1,2 = " + F("−5", 6), sd: [["x là số bị chia: x = " + F("−5", 6) + " · 1,2", [2]]], gt: "Quan hệ giữa số bị chia, số chia, thương" },
        { ten: "Câu c", dich: "Tìm x trong " + F(2, 3) + " · x − " + F(1, 2) + " = " + F(1, 6), sd: [["x = " + F(2, 3) + " : " + F(2, 3), [4]], ["Tìm " + F(2, 3) + " · x = " + F(1, 6) + " + " + F(1, 2) + " (số bị trừ)", [3]]], gt: "Biểu thức có hai phép tính chứa x" }],
      steps: [
        "a) x = " + F(3, 4) + " − " + F("−1", 6) + " = " + F(9, 12) + " + " + F(2, 12) + " = " + F(11, 12) + ".",
        "b) x = " + F("−5", 6) + " · 1,2 = " + F("−5", 6) + " · " + F(6, 5) + " = −1.",
        "c) " + F(2, 3) + " · x = " + F(1, 6) + " + " + F(1, 2) + " = " + F(1, 6) + " + " + F(3, 6) + " = " + F(4, 6) + " = " + F(2, 3) + ".",
        "x = " + F(2, 3) + " : " + F(2, 3) + " = 1."
      ],
      dap: "a) x = " + F(11, 12) + "; b) x = −1; c) x = 1.",
      loi: "Câu a ghi x = " + F("−1", 6) + " − " + F(3, 4) + "; câu c chia trước rồi mới cộng."
    },
    {
      id: "vd3", lv: "VD",
      de: "Tìm x, biết:<br>a) (2x − " + F(1, 3) + ") · (x + " + F(3, 4) + ") = 0;  b) " + F(1, 2) + " · x + " + F(2, 3) + " · x = " + F("−5", 9) + ".",
      goi: "a) Tích bằng 0 khi có một thừa số bằng 0. b) Đặt x làm thừa số chung: (" + F(1, 2) + " + " + F(2, 3) + ") · x.",
      pt: [
        { ten: "Câu a", dich: "Tìm x để tích bằng 0", sd: [["Giải 2x − " + F(1, 3) + " = 0 và x + " + F(3, 4) + " = 0", [2, 3]], ["Tích bằng 0 thì một trong hai thừa số bằng 0", [1]]], gt: "Tích hai thừa số bằng 0" },
        { ten: "Câu b", dich: "Tìm x trong " + F(1, 2) + " · x + " + F(2, 3) + " · x = " + F("−5", 9), sd: [["x = " + F("−5", 9) + " : " + F(7, 6), [5]], ["Đặt x chung: " + F(7, 6) + " · x = " + F("−5", 9), [4]]], gt: "Tính chất phân phối" }],
      hieu: { gt: "a) (2x − " + F(1, 3) + ") · (x + " + F(3, 4) + ") = 0. b) " + F(1, 2) + " · x + " + F(2, 3) + " · x = " + F("−5", 9) + ".", kl: "Tìm x.",
        hoi: [
          ["Câu a: vế trái là tổng, hiệu hay tích? Vế phải bằng bao nhiêu?", "Vế trái là tích của hai thừa số, vế phải bằng 0."],
          ["Câu b: x xuất hiện mấy lần? Có tìm ngay được x không?", "x xuất hiện hai lần, ở hai tích khác nhau, nên chưa dùng ngay quan hệ \"thừa số = tích : thừa số\" được. Cần gom x lại."]] },
      nguoc: [
      { ten: "Câu a", dich: "(2x − " + F(1, 3) + ") · (x + " + F(3, 4) + ") = 0",
        sd: [["x ∈ {" + F(1, 6) + "; " + F("−3", 4) + "}", [2, 3]], ["2x − " + F(1, 3) + " = 0 hoặc x + " + F(3, 4) + " = 0", [1]]],
        gt: "Tích bằng 0",
        ket: "x ∈ {" + F(1, 6) + "; " + F("−3", 4) + "}" + ".",
        buoc: [
        { hoi: "Một tích bằng 0 khi nào?",
          nho: "a · b = 0 khi a = 0 hoặc b = 0.",
          chon: [
            ["Khi 2x − " + F(1, 3) + " = 0 hoặc x + " + F(3, 4) + " = 0", true, "Đúng. Mỗi trường hợp là một bài tìm x đơn giản."],
            ["Khi cả hai thừa số cùng bằng 0", false, "Chỉ cần một thừa số bằng 0 là tích bằng 0."]],
          dat: "Một trong hai thừa số bằng 0" },
        { hoi: "Tìm x từ 2x − " + F(1, 3) + " = 0.",
          nho: "Số bị trừ = hiệu + số trừ.",
          chon: [
            ["2x = " + F(1, 3) + ", x = " + F(1, 3) + " : 2 = " + F(1, 6), true, "Đúng."],
            ["x = " + F(1, 3) + " − 2", false, "2x là 2 nhân x, không phải 2 cộng x."]],
          dat: "2x = " + F(1, 3) }] },
      { ten: "Câu b", dich: F(1, 2) + " · x + " + F(2, 3) + " · x = " + F("−5", 9),
        sd: [["x = " + F("−5", 9) + " : " + F(7, 6) + " = " + F("−10", 21), [5]], ["(" + F(1, 2) + " + " + F(2, 3) + ") · x = " + F("−5", 9) + ", tức " + F(7, 6) + " · x = " + F("−5", 9), [4]]],
        gt: "Tính chất phân phối",
        ket: "x = " + F("−5", 9) + " · " + F(6, 7) + " = " + F("−30", 63) + " = " + F("−10", 21) + ".",
        buoc: [
        { hoi: "Làm sao để x chỉ còn xuất hiện một lần?",
          nho: "a · x + b · x = (a + b) · x.",
          chon: [
            ["Đặt x làm thừa số chung: (" + F(1, 2) + " + " + F(2, 3) + ") · x = " + F(7, 6) + " · x", true, "Đúng. Còn " + F(7, 6) + " · x = " + F("−5", 9) + "."],
            ["Tìm x từ " + F(1, 2) + " · x = " + F("−5", 9) + " rồi tìm x từ " + F(2, 3) + " · x = " + F("−5", 9), false, "Vế phải là kết quả của cả tổng, không phải của từng tích."]],
          dat: F(7, 6) + " · x = " + F("−5", 9) }] }],
      nhin: [
        ["Thử lại câu b với x = " + F("−10", 21) + ".", F(1, 2) + " · " + F("−10", 21) + " = " + F("−5", 21) + "; " + F(2, 3) + " · " + F("−10", 21) + " = " + F("−20", 63) + ". Tổng: " + F("−15", 63) + " + " + F("−20", 63) + " = " + F("−35", 63) + " = " + F("−5", 9) + ". Đúng."],
        ["Câu a có mấy giá trị của x? Thử lại một giá trị.", "Hai giá trị. Với x = " + F("−3", 4) + ": thừa số thứ hai bằng 0 nên tích bằng 0. Đúng."]],
      steps: [
        "a) Tích bằng 0 nên 2x − " + F(1, 3) + " = 0 hoặc x + " + F(3, 4) + " = 0.",
        "Nếu 2x − " + F(1, 3) + " = 0 thì 2x = " + F(1, 3) + ", x = " + F(1, 3) + " : 2 = " + F(1, 6) + ".",
        "Nếu x + " + F(3, 4) + " = 0 thì x = 0 − " + F(3, 4) + " = " + F("−3", 4) + ". Vậy x ∈ {" + F(1, 6) + "; " + F("−3", 4) + "}" + ".",
        "b) (" + F(1, 2) + " + " + F(2, 3) + ") · x = " + F("−5", 9) + ", tức là " + F(7, 6) + " · x = " + F("−5", 9) + ".",
        "x = " + F("−5", 9) + " : " + F(7, 6) + " = " + F("−5", 9) + " · " + F(6, 7) + " = " + F("−30", 63) + " = " + F("−10", 21) + "."
      ],
      dap: "a) x ∈ {" + F(1, 6) + "; " + F("−3", 4) + "}" + "; b) x = " + F("−10", 21) + ".",
      loi: "Câu a chỉ tìm một giá trị của x; câu b cộng " + F(1, 2) + " + " + F(2, 3) + " = " + F(3, 5) + "."
    },

    /* ===== Dạng 4. Bài toán thực tế ===== */
    {
      id: "vd4", lv: "VD",
      de: "Một mảnh vườn hình chữ nhật có chiều dài 20 m, chiều rộng bằng " + F(3, 5) + " chiều dài. Người ta dành " + F(2, 5) + " diện tích vườn để trồng rau, " + F(1, 4) + " diện tích vườn để trồng hoa, phần còn lại làm lối đi. Tính diện tích lối đi.",
      goi: "Tính chiều rộng, diện tích vườn. Phần lối đi chiếm 1 − (" + F(2, 5) + " + " + F(1, 4) + ") diện tích vườn.",
      pt: [
        { ten: "Cả bài", dich: "Diện tích lối đi", sd: [["Lấy " + F(7, 20) + " của diện tích vườn", [4]], ["Lối đi chiếm 1 − (" + F(2, 5) + " + " + F(1, 4) + ") = " + F(7, 20) + " diện tích", [3]], ["Diện tích vườn = 20 · 12", [1, 2]]], gt: "Chiều dài 20 m, chiều rộng bằng " + F(3, 5) + " chiều dài" }],
      steps: [
        "Chiều rộng mảnh vườn: 20 · " + F(3, 5) + " = 12 (m).",
        "Diện tích mảnh vườn: 20 · 12 = 240 (m²).",
        "Phần lối đi chiếm: 1 − (" + F(2, 5) + " + " + F(1, 4) + ") = 1 − " + F(13, 20) + " = " + F(7, 20) + " (diện tích vườn).",
        "Diện tích lối đi: 240 · " + F(7, 20) + " = 84 (m²)."
      ],
      dap: "84 m².",
      loi: "Lấy 240 − " + F(2, 5) + " − " + F(1, 4) + " (trừ phân số khỏi diện tích); tính chiều rộng là 20 : " + F(3, 5) + "."
    },
    {
      id: "vd5", lv: "VD",
      de: "Một kho có 12,5 tấn gạo. Ngày thứ nhất kho xuất " + F(2, 5) + " số gạo. Ngày thứ hai kho xuất " + F(1, 3) + " số gạo còn lại sau ngày thứ nhất. Ngày thứ ba kho nhập thêm 1,75 tấn. Hỏi sau ba ngày kho có bao nhiêu tấn gạo?",
      goi: "\"Số gạo còn lại\" sau ngày thứ nhất là khác với số gạo lúc đầu. Tính lần lượt từng ngày.",
      pt: [
        { ten: "Cả bài", dich: "Số gạo sau ba ngày", sd: [["Cộng thêm 1,75 tấn", [5]], ["Số gạo còn sau ngày thứ hai: 7,5 − 2,5", [3, 4]], ["Số gạo còn sau ngày thứ nhất: 12,5 − 5", [1, 2]]], gt: "12,5 tấn; xuất " + F(2, 5) + "; xuất " + F(1, 3) + " số còn lại; nhập 1,75 tấn" }],
      steps: [
        "Ngày thứ nhất xuất: 12,5 · " + F(2, 5) + " = 5 (tấn).",
        "Còn lại sau ngày thứ nhất: 12,5 − 5 = 7,5 (tấn).",
        "Ngày thứ hai xuất: 7,5 · " + F(1, 3) + " = 2,5 (tấn).",
        "Còn lại sau ngày thứ hai: 7,5 − 2,5 = 5 (tấn).",
        "Sau ngày thứ ba: 5 + 1,75 = 6,75 (tấn)."
      ],
      dap: "6,75 tấn.",
      loi: "Ngày thứ hai lấy " + F(1, 3) + " của 12,5 tấn (số gạo lúc đầu)."
    },

    /* ===== Dành cho HSG ===== */
    {
      id: "hsg1", lv: "HSG",
      de: "Tính A = " + F(1, "1 · 2 · 3") + " + " + F(1, "2 · 3 · 4") + " + " + F(1, "3 · 4 · 5") + " + … + " + F(1, "98 · 99 · 100") + ".",
      goi: "Chứng minh " + F(2, "n · (n + 1) · (n + 2)") + " = " + F(1, "n · (n + 1)") + " − " + F(1, "(n + 1) · (n + 2)") + ", rồi tính 2A.",
      hieu: { gt: "A là tổng 98 phân số " + F(1, "n · (n + 1) · (n + 2)") + " với n = 1, 2, …, 98.", kl: "Tính A.",
        hoi: [
          ["Em đã tính tổng " + F(1, "1 · 2") + " + " + F(1, "2 · 3") + " + … + " + F(1, "99 · 100") + " thế nào?", "Viết mỗi số hạng thành hiệu: " + F(1, "n · (n + 1)") + " = " + F(1, "n") + " − " + F(1, "n + 1") + ", các số hạng ở giữa triệt tiêu, còn 1 − " + F(1, 100) + "."],
          ["Ở đây mẫu là tích ba số liên tiếp. Thử với n = 1: " + F(1, "1 · 2") + " − " + F(1, "2 · 3") + " bằng bao nhiêu?", F(1, 2) + " − " + F(1, 6) + " = " + F(2, 6) + " = " + F(2, "1 · 2 · 3") + ": gấp đôi số hạng đầu của A."]] },
      nguoc: [
      { ten: "Tính A", dich: "Tính A",
        sd: [["2A = " + F(1, "1 · 2") + " − " + F(1, "99 · 100"), [3, 4]], ["Mỗi số hạng của 2A là hiệu " + F(1, "n · (n + 1)") + " − " + F(1, "(n + 1) · (n + 2)"), [1, 2]]],
        gt: "Các mẫu là tích ba số tự nhiên liên tiếp",
        ket: "2A = " + F(1, 2) + " − " + F(1, 9900) + " = " + F(4949, 9900) + ", nên A = " + F(4949, 19800) + ".",
        buoc: [
        { hoi: "Muốn các số hạng triệt tiêu nhau, em viết " + F(2, "n · (n + 1) · (n + 2)") + " thành hiệu của hai phân số nào?",
          nho: F(1, "n · (n + 1)") + " − " + F(1, "(n + 1) · (n + 2)") + " = " + F("(n + 2) − n", "n · (n + 1) · (n + 2)") + ".",
          chon: [
            [F(1, "n · (n + 1)") + " − " + F(1, "(n + 1) · (n + 2)") + ": hiệu hai tử sau quy đồng là (n + 2) − n = 2", true, "Đúng. Vì vậy ta tính 2A thay cho A."],
            [F(1, "n") + " − " + F(1, "n + 2"), false, "Hiệu này bằng " + F(2, "n · (n + 2)") + ", thiếu thừa số n + 1 ở mẫu."]],
          dat: F(2, "n · (n + 1) · (n + 2)") + " = " + F(1, "n · (n + 1)") + " − " + F(1, "(n + 1) · (n + 2)") },
        { hoi: "Viết 2A thành tổng các hiệu. Sau khi triệt tiêu còn lại những số hạng nào?",
          nho: "Số hạng bị trừ của hiệu trước bằng số hạng đầu của hiệu sau.",
          chon: [
            ["Còn " + F(1, "1 · 2") + " − " + F(1, "99 · 100"), true, "Đúng: 2A = " + F(1, 2) + " − " + F(1, 9900) + "."],
            ["Còn " + F(1, "1 · 2") + " − " + F(1, "98 · 99"), false, "Số hạng cuối của A ứng với n = 98, nên số hạng bị trừ cuối cùng là " + F(1, "99 · 100") + "."]],
          dat: "2A = " + F(1, "1 · 2") + " − " + F(1, "99 · 100") }] }],
      nhin: [
        ["Kiểm tra công thức với tổng ngắn: " + F(1, "1 · 2 · 3") + " + " + F(1, "2 · 3 · 4") + ".", "Cộng trực tiếp: " + F(1, 6) + " + " + F(1, 24) + " = " + F(5, 24) + ". Theo cách trên: " + F(1, 2) + " · (" + F(1, 2) + " − " + F(1, 12) + ") = " + F(1, 2) + " · " + F(5, 12) + " = " + F(5, 24) + ". Khớp."],
        ["A lớn hơn hay nhỏ hơn " + F(1, 4) + "?", "2A = " + F(1, 2) + " − " + F(1, 9900) + " < " + F(1, 2) + " nên A < " + F(1, 4) + "."]],
      steps: [
        "Với mọi số tự nhiên n ≥ 1: " + F(1, "n · (n + 1)") + " − " + F(1, "(n + 1) · (n + 2)") + " = " + F("(n + 2) − n", "n · (n + 1) · (n + 2)") + " = " + F(2, "n · (n + 1) · (n + 2)") + ".",
        "Do đó 2A = " + F(2, "1 · 2 · 3") + " + " + F(2, "2 · 3 · 4") + " + … + " + F(2, "98 · 99 · 100") + " = (" + F(1, "1 · 2") + " − " + F(1, "2 · 3") + ") + (" + F(1, "2 · 3") + " − " + F(1, "3 · 4") + ") + … + (" + F(1, "98 · 99") + " − " + F(1, "99 · 100") + ").",
        "Các số hạng ở giữa triệt tiêu: 2A = " + F(1, "1 · 2") + " − " + F(1, "99 · 100") + " = " + F(1, 2) + " − " + F(1, 9900) + " = " + F(4950, 9900) + " − " + F(1, 9900) + " = " + F(4949, 9900) + ".",
        "Vậy A = " + F(4949, 9900) + " : 2 = " + F(4949, 19800) + "."
      ],
      dap: "A = " + F(4949, 19800) + ".",
      loi: "Viết " + F(1, "n · (n + 1) · (n + 2)") + " = " + F(1, "n") + " − " + F(1, "n + 2") + " (sai); hoặc quên chia 2 ở bước cuối."
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Chứng minh rằng: 1 − " + F(1, 2) + " + " + F(1, 3) + " − " + F(1, 4) + " + … + " + F(1, 99) + " − " + F(1, 100) + " = " + F(1, 51) + " + " + F(1, 52) + " + … + " + F(1, 100) + ".",
      goi: "Viết mỗi dấu trừ thành cộng rồi trừ hai lần: vế trái = (1 + " + F(1, 2) + " + … + " + F(1, 100) + ") − 2 · (" + F(1, 2) + " + " + F(1, 4) + " + … + " + F(1, 100) + ").",
      hieu: { gt: "Vế trái gồm 100 phân số " + F(1, "k") + " (k = 1, …, 100), dấu cộng ở k lẻ, dấu trừ ở k chẵn.", kl: "Vế trái = " + F(1, 51) + " + " + F(1, 52) + " + … + " + F(1, 100) + ".",
        hoi: [
          ["Có tính được riêng từng vế không?", "Không: mẫu chung quá lớn. Phải biến đổi vế trái thành vế phải."],
          ["Kiểm tra với ít số hạng: 1 − " + F(1, 2) + " + " + F(1, 3) + " − " + F(1, 4) + " có bằng " + F(1, 3) + " + " + F(1, 4) + " không?", "1 − " + F(1, 2) + " + " + F(1, 3) + " − " + F(1, 4) + " = " + F(7, 12) + " và " + F(1, 3) + " + " + F(1, 4) + " = " + F(7, 12) + ". Bằng nhau."]] },
      nguoc: [
      { ten: "Chứng minh", dich: "Vế trái = " + F(1, 51) + " + … + " + F(1, 100),
        sd: [["Vế trái = (1 + " + F(1, 2) + " + … + " + F(1, 100) + ") − (1 + " + F(1, 2) + " + … + " + F(1, 50) + ")", [2, 3]], ["Vế trái = (1 + " + F(1, 2) + " + … + " + F(1, 100) + ") − 2 · (" + F(1, 2) + " + " + F(1, 4) + " + … + " + F(1, 100) + ")", [1]]],
        gt: "Tổng có dấu xen kẽ",
        ket: "Hiệu còn lại đúng " + F(1, 51) + " + " + F(1, 52) + " + … + " + F(1, 100) + ".",
        buoc: [
        { hoi: "Vế phải chỉ có dấu cộng. Làm sao để vế trái cũng chỉ còn dấu cộng?",
          nho: "a − b = (a + b) − 2b.",
          chon: [
            ["Thêm và bớt các phân số có mẫu chẵn: vế trái = (1 + " + F(1, 2) + " + … + " + F(1, 100) + ") − 2 · (" + F(1, 2) + " + " + F(1, 4) + " + … + " + F(1, 100) + ")", true, "Đúng. Bây giờ chỉ còn hai tổng toàn dấu cộng."],
            ["Nhóm từng cặp: (1 − " + F(1, 2) + ") + (" + F(1, 3) + " − " + F(1, 4) + ") + …", false, "Được 50 phân số " + F(1, "k · (k + 1)") + " với k lẻ, nhưng không đưa về vế phải được."]],
          dat: "Vế trái = (1 + … + " + F(1, 100) + ") − 2 · (" + F(1, 2) + " + " + F(1, 4) + " + … + " + F(1, 100) + ")" },
        { hoi: "2 · (" + F(1, 2) + " + " + F(1, 4) + " + … + " + F(1, 100) + ") bằng tổng nào?",
          nho: "2 · " + F(1, "2k") + " = " + F(1, "k") + ".",
          chon: [
            ["1 + " + F(1, 2) + " + " + F(1, 3) + " + … + " + F(1, 50), true, "Đúng. Trừ đi thì còn " + F(1, 51) + " + … + " + F(1, 100) + "."],
            [F(1, 4) + " + " + F(1, 8) + " + … + " + F(1, 200), false, "Nhân với 2 thì mẫu chia đôi chứ không gấp đôi."]],
          dat: "2 · (" + F(1, 2) + " + … + " + F(1, 100) + ") = 1 + " + F(1, 2) + " + … + " + F(1, 50) }] }],
      nhin: [
        ["Kiểm tra với 6 số hạng: 1 − " + F(1, 2) + " + " + F(1, 3) + " − " + F(1, 4) + " + " + F(1, 5) + " − " + F(1, 6) + " = " + F(1, 4) + " + " + F(1, 5) + " + " + F(1, 6) + "?", "Vế trái = " + F(37, 60) + ", vế phải = " + F("15 + 12 + 10", 60) + " = " + F(37, 60) + ". Đúng."],
        ["Suy ra vế trái lớn hơn hay nhỏ hơn " + F(1, 2) + "?", "Vế phải có 50 phân số, mỗi phân số lớn hơn hoặc bằng " + F(1, 100) + " (chỉ " + F(1, 100) + " bằng), nên tổng lớn hơn 50 · " + F(1, 100) + " = " + F(1, 2) + "."]],
      steps: [
        "Vế trái = (1 + " + F(1, 2) + " + " + F(1, 3) + " + … + " + F(1, 100) + ") − 2 · (" + F(1, 2) + " + " + F(1, 4) + " + " + F(1, 6) + " + … + " + F(1, 100) + ").",
        "Mà 2 · (" + F(1, 2) + " + " + F(1, 4) + " + " + F(1, 6) + " + … + " + F(1, 100) + ") = 1 + " + F(1, 2) + " + " + F(1, 3) + " + … + " + F(1, 50) + ".",
        "Do đó vế trái = (1 + " + F(1, 2) + " + … + " + F(1, 50) + " + " + F(1, 51) + " + … + " + F(1, 100) + ") − (1 + " + F(1, 2) + " + … + " + F(1, 50) + ") = " + F(1, 51) + " + " + F(1, 52) + " + … + " + F(1, 100) + ". Đó là điều phải chứng minh."
      ],
      dap: "Đã chứng minh.",
      loi: "Nhân 2 với " + F(1, "2k") + " ra " + F(1, "4k") + "; hoặc chỉ thử vài số hạng rồi kết luận."
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Cho ba số hữu tỉ a, b, c khác 0 thoả mãn a + b + c = 0. Tính giá trị của biểu thức P = (1 + " + F("a", "b") + ") · (1 + " + F("b", "c") + ") · (1 + " + F("c", "a") + ").",
      goi: "Viết mỗi ngoặc thành một phân số: 1 + " + F("a", "b") + " = " + F("a + b", "b") + ", rồi dùng a + b = −c.",
      hieu: { gt: "a, b, c ≠ 0, a + b + c = 0.", kl: "Tính P.",
        hoi: [
          ["Thử với a = 1, b = 2, c = −3. P bằng bao nhiêu?", "P = (1 + " + F(1, 2) + ") · (1 + " + F(2, "−3") + ") · (1 + " + F("−3", 1) + ") = " + F(3, 2) + " · " + F(1, 3) + " · (−2) = −1."],
          ["Từ a + b + c = 0 suy ra a + b bằng gì?", "(a + b) + c = 0 nên a + b là số đối của c: a + b = −c; tương tự b + c = −a, c + a = −b."]] },
      nguoc: [
      { ten: "Tính P", dich: "Tính P",
        sd: [["P = " + F("−c", "b") + " · " + F("−a", "c") + " · " + F("−b", "a"), [2]], ["P = " + F("a + b", "b") + " · " + F("b + c", "c") + " · " + F("c + a", "a"), [1]]],
        gt: "a + b = −c, b + c = −a, c + a = −b",
        ket: "P = " + F("(−c) · (−a) · (−b)", "b · c · a") + " = −1.",
        buoc: [
        { hoi: "P có ba ngoặc dạng 1 + phân số. Biến đổi mỗi ngoặc thế nào để dùng được a + b + c = 0?",
          nho: "1 + " + F("a", "b") + " = " + F("b", "b") + " + " + F("a", "b") + ".",
          chon: [
            ["Quy đồng trong từng ngoặc: 1 + " + F("a", "b") + " = " + F("a + b", "b") + ", tương tự với hai ngoặc kia", true, "Đúng. Tử của mỗi ngoặc là tổng của hai trong ba số."],
            ["Nhân phá ngoặc, được 8 số hạng", false, "Làm được nhưng rất dài và dễ sai."]],
          dat: "P = " + F("a + b", "b") + " · " + F("b + c", "c") + " · " + F("c + a", "a") },
        { hoi: "Thay các tổng bằng gì?",
          nho: "Hai số có tổng bằng 0 là hai số đối nhau.",
          chon: [
            ["a + b = −c, b + c = −a, c + a = −b; P = " + F("−c", "b") + " · " + F("−a", "c") + " · " + F("−b", "a"), true, "Đúng. Tích có ba thừa số âm ở tử, a · b · c rút gọn với b · c · a, P = −1."],
            ["a + b = c", false, "(a + b) + c = 0 nên a + b là số đối của c: a + b = −c."]],
          dat: "a + b = −c, b + c = −a, c + a = −b" }] }],
      nhin: [
        ["Thử lại với a = 2, b = −5, c = 3.", "P = (1 − " + F(2, 5) + ") · (1 − " + F(5, 3) + ") · (1 + " + F(3, 2) + ") = " + F(3, 5) + " · " + F("−2", 3) + " · " + F(5, 2) + " = −1. Đúng."],
        ["Bài tương tự: với a, b, c như trên, tính Q = " + F("a + b", "c") + " + " + F("b + c", "a") + " + " + F("c + a", "b") + ".", "Q = " + F("−c", "c") + " + " + F("−a", "a") + " + " + F("−b", "b") + " = (−1) + (−1) + (−1) = −3."]],
      steps: [
        "P = " + F("b + a", "b") + " · " + F("c + b", "c") + " · " + F("a + c", "a") + ".",
        "Vì (a + b) + c = 0 nên a + b là số đối của c: a + b = −c; tương tự b + c = −a, c + a = −b. Do đó P = " + F("−c", "b") + " · " + F("−a", "c") + " · " + F("−b", "a") + " = " + F("−(a · b · c)", "a · b · c") + " = −1."
      ],
      dap: "P = −1.",
      loi: "Viết a + b = c (quên rằng a + b là số đối của c); hoặc chỉ thử một bộ số rồi kết luận."
    }
  ];

  window.TL_DATA = {
    bai: "ct7",
    ten: "Bài 2. Cộng, trừ, nhân, chia số hữu tỉ",
    items: ITEMS,
    dang: [
      { ten: "Thực hiện phép tính",
        pp: ["Viết các số hữu tỉ dưới dạng phân số (đổi số thập phân, hỗn số); mẫu âm thì đổi về mẫu dương.",
             "Cộng, trừ: quy đồng mẫu dương rồi cộng, trừ các tử, giữ nguyên mẫu. x − y = x + (−y).",
             "Nhân: tử nhân tử, mẫu nhân mẫu. Chia: x : y = x · " + F(1, "y") + " (y ≠ 0), chỉ đảo số chia.",
             "Thứ tự: trong ngoặc trước; nhân, chia trước; cộng, trừ sau. Rút gọn kết quả."],
        ids: ["nb1", "th1", "vd1"],
        tl: [
          ["Tính: a) " + F("−5", 6) + " + " + F(3, 8) + ";  b) (−1,5) · " + F(4, 9) + " : " + F("−2", 3) + ".", "a) Mẫu chung 24. b) Đổi −1,5 = " + F("−3", 2) + "; nhân, chia từ trái sang phải.", "a) " + F("−11", 24) + "; b) 1."],
          ["Tính A = (" + F(3, 4) + " − " + F(5, 6) + ") · " + F(12, 5) + ".", "Tính trong ngoặc trước (mẫu chung 12).", "A = " + F("−1", 5) + "."]] },
      { ten: "Tính nhanh, tính hợp lí",
        pp: ["Quan sát trước khi tính: tìm các số cùng mẫu, các số đối nhau, các tích có thừa số chung.",
             "Dùng tính chất giao hoán, kết hợp để nhóm các số cho ra số tròn (0, 1, −1, …).",
             "Dùng tính chất phân phối: a · b + a · c = a · (b + c); a · b − a · c = a · (b − c).",
             "Chia cho cùng một số: đổi thành nhân với nghịch đảo rồi đặt thừa số chung.",
             "Bỏ dấu ngoặc đúng quy tắc: dấu \"−\" đằng trước thì đổi dấu mọi số hạng trong ngoặc."],
        ids: ["nb2", "th2", "vd2"],
        tl: [
          ["Tính hợp lí: " + F(5, 13) + " + " + F("−7", 9) + " + " + F(8, 13) + " + " + F(7, 9) + ".", "Nhóm hai phân số mẫu 13 và hai số đối nhau.", "1."],
          ["Tính hợp lí: " + F("−4", 9) + " · " + F(13, 7) + " + " + F("−4", 9) + " · " + F(1, 7) + ".", "Đặt " + F("−4", 9) + " ra ngoài.", F("−8", 9) + "."]] },
      { ten: "Tìm x",
        pp: ["Xác định x là thành phần nào của phép tính (số hạng, số trừ, số bị trừ, thừa số, số bị chia, số chia).",
             "Dùng quan hệ: số hạng = tổng − số hạng kia; số bị trừ = hiệu + số trừ; số trừ = số bị trừ − hiệu; thừa số = tích : thừa số kia; số bị chia = thương · số chia; số chia = số bị chia : thương.",
             "Có nhiều phép tính: tìm dần từ ngoài vào trong.",
             "x xuất hiện nhiều lần: đặt x làm thừa số chung. Tích bằng 0: một trong các thừa số bằng 0.",
             "Thử lại kết quả vào đề bài."],
        ids: ["nb3", "th3", "vd3"],
        tl: [
          ["Tìm x, biết x − " + F(3, 4) + " = " + F("−5", 6) + ".", "x là số bị trừ: x = hiệu + số trừ.", "x = " + F("−1", 12) + "."],
          ["Tìm x, biết (x + " + F(1, 2) + ") · (" + F(3, 5) + " − x) = 0.", "Một trong hai thừa số bằng 0.", "x ∈ {" + F("−1", 2) + "; " + F(3, 5) + "}" + "."],
          ["Tìm x, biết " + F(2, 3) + " · x − " + F(1, 4) + " · x = " + F(5, 6) + ".", "Đặt x chung: (" + F(2, 3) + " − " + F(1, 4) + ") · x.", "x = 2."]] },
      { ten: "Bài toán thực tế",
        pp: ["Đọc kĩ đề: \"một phần của cái gì\" (của số lúc đầu hay của số còn lại).",
             "Tìm giá trị phân số của một số: lấy số đó nhân với phân số.",
             "Tính lần lượt từng bước, ghi rõ đơn vị; có thể tính phần còn lại bằng 1 − (tổng các phần).",
             "Trả lời đúng câu hỏi của đề."],
        ids: ["vd4", "vd5"],
        tl: [
          ["Một lớp có 40 học sinh. Có " + F(3, 8) + " số học sinh thích bóng đá, 0,25 số học sinh thích cầu lông, số còn lại thích bơi. Hỏi có bao nhiêu học sinh thích bơi?", "Tính số học sinh thích bóng đá, cầu lông rồi lấy 40 trừ đi.", "15 học sinh."],
          ["Một chai có 1,5 lít nước. Lần đầu rót ra " + F(2, 5) + " lượng nước trong chai, lần sau rót ra " + F(1, 3) + " lượng nước còn lại. Trong chai còn bao nhiêu lít nước?", "Lần sau tính theo lượng nước còn lại sau lần đầu.", "0,6 lít."]] }
    ],
    mau: { ids: ["vd1", "vd2", "vd3"], theoPhan: { ct: "vd1", nh: "vd1", ch: "vd3", tc: "vd2" } }
  };
})();
