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
      de: "a) Tính A = " + F(2, "1 · 3") + " + " + F(2, "3 · 5") + " + " + F(2, "5 · 7") + " + … + " + F(2, "97 · 99") + ".<br>b) Tính B = " + F(1, "1 · 3") + " + " + F(1, "3 · 5") + " + " + F(1, "5 · 7") + " + … + " + F(1, "97 · 99") + ".",
      goi: "Thử: " + F(1, 1) + " − " + F(1, 3) + " = " + F(2, "1 · 3") + "; " + F(1, 3) + " − " + F(1, 5) + " = " + F(2, "3 · 5") + ". Mỗi số hạng của A là hiệu của hai phân số có tử 1.",
      hieu: { gt: "A, B là tổng của các phân số có mẫu là tích hai số lẻ liên tiếp, từ 1 · 3 đến 97 · 99.", kl: "Tính A và B.",
        hoi: [
          ["Mẫu của các số hạng có quy luật gì? A có bao nhiêu số hạng?", "Mẫu là tích hai số lẻ liên tiếp: 1 · 3, 3 · 5, …, 97 · 99. Thừa số đầu là 1, 3, 5, …, 97: có (97 − 1) : 2 + 1 = 49 số hạng."],
          ["Hai thừa số ở mẫu hơn kém nhau bao nhiêu? So với tử của A thì sao?", "Hơn kém nhau 2, đúng bằng tử của mỗi số hạng trong A. Đây là dấu hiệu để tách mỗi số hạng thành hiệu."]] },
      nguoc: [
      { ten: "Câu a", dich: "Tính A",
        sd: [["A = 1 − " + F(1, 99) + " (các số hạng ở giữa triệt tiêu)", [2, 3]], ["Viết mỗi số hạng " + F(2, "n · (n + 2)") + " = " + F(1, "n") + " − " + F(1, "n + 2"), [1]]],
        gt: "Hai thừa số ở mẫu hơn kém nhau 2, tử bằng 2",
        ket: "A = 1 − " + F(1, 3) + " + " + F(1, 3) + " − " + F(1, 5) + " + … + " + F(1, 97) + " − " + F(1, 99) + " = 1 − " + F(1, 99) + " = " + F(98, 99) + ".",
        buoc: [
        { hoi: "Cộng 49 phân số khác mẫu bằng cách quy đồng thì quá dài. Thử tính " + F(1, 1) + " − " + F(1, 3) + " và " + F(1, 3) + " − " + F(1, 5) + ": em thấy gì?",
          nho: F(1, "n") + " − " + F(1, "n + 2") + " = " + F("n + 2", "n · (n + 2)") + " − " + F("n", "n · (n + 2)") + ".",
          chon: [
            ["Ra đúng " + F(2, "1 · 3") + " và " + F(2, "3 · 5") + ": mỗi số hạng của A là hiệu hai phân số tử 1", true, "Đúng. Tổng quát: " + F(2, "n · (n + 2)") + " = " + F(1, "n") + " − " + F(1, "n + 2") + "."],
            ["Không liên quan gì đến A", false, "Hãy tính thật: " + F(1, 1) + " − " + F(1, 3) + " = " + F(2, 3) + " = " + F(2, "1 · 3") + "."]],
          dat: "Tách mỗi số hạng thành hiệu: " + F(2, "n · (n + 2)") + " = " + F(1, "n") + " − " + F(1, "n + 2") },
        { hoi: "Viết A thành tổng các hiệu đó. Các số hạng nào triệt tiêu nhau?",
          nho: "Hai số đối nhau có tổng bằng 0.",
          chon: [
            ["−" + F(1, 3) + " và +" + F(1, 3) + ", −" + F(1, 5) + " và +" + F(1, 5) + ", …; chỉ còn số đầu 1 và số cuối −" + F(1, 99), true, "Đúng. A = 1 − " + F(1, 99) + " = " + F(98, 99) + "."],
            ["Không có số nào triệt tiêu", false, "Viết ra vài số hạng: (1 − " + F(1, 3) + ") + (" + F(1, 3) + " − " + F(1, 5) + ") + …: −" + F(1, 3) + " và " + F(1, 3) + " là hai số đối nhau."]],
          dat: "A = 1 − " + F(1, 99) }] },
      { ten: "Câu b", dich: "Tính B",
        sd: [["B = A : 2", [4]], ["Mỗi số hạng của B bằng một nửa số hạng tương ứng của A", [4]]],
        gt: "Kết quả câu a",
        ket: "B = " + F(98, 99) + " : 2 = " + F(49, 99) + ".",
        buoc: [
        { hoi: "Tử của B là 1, không bằng hiệu hai thừa số ở mẫu (là 2). Liên hệ B với A thế nào?",
          nho: F(1, "n · (n + 2)") + " = " + F(1, 2) + " · " + F(2, "n · (n + 2)") + ".",
          chon: [
            ["Mỗi số hạng của B bằng " + F(1, 2) + " số hạng tương ứng của A, nên B = " + F(1, 2) + " · A", true, "Đúng (tính chất phân phối). B = " + F(1, 2) + " · " + F(98, 99) + " = " + F(49, 99) + "."],
            ["B = A vì cùng mẫu", false, "Tử khác nhau (1 và 2), nên B nhỏ hơn A."]],
          dat: "B = " + F(1, 2) + " · A" }] }],
      nhin: [
        ["Thử với tổng ngắn: " + F(2, "1 · 3") + " + " + F(2, "3 · 5") + " có bằng 1 − " + F(1, 5) + " không?", F(2, 3) + " + " + F(2, 15) + " = " + F(10, 15) + " + " + F(2, 15) + " = " + F(12, 15) + " = " + F(4, 5) + " = 1 − " + F(1, 5) + ". Đúng."],
        ["Tổng quát: tính " + F(3, "1 · 4") + " + " + F(3, "4 · 7") + " + … + " + F(3, "97 · 100") + ".", "Hai thừa số hơn kém 3, tử bằng 3, nên mỗi số hạng = " + F(1, "n") + " − " + F(1, "n + 3") + ". Tổng = 1 − " + F(1, 100) + " = " + F(99, 100) + "."]],
      steps: [
        "a) Với n là số tự nhiên khác 0: " + F(1, "n") + " − " + F(1, "n + 2") + " = " + F("n + 2 − n", "n · (n + 2)") + " = " + F(2, "n · (n + 2)") + ".",
        "Do đó A = " + F(2, "1 · 3") + " + " + F(2, "3 · 5") + " + … + " + F(2, "97 · 99") + " = (1 − " + F(1, 3) + ") + (" + F(1, 3) + " − " + F(1, 5) + ") + … + (" + F(1, 97) + " − " + F(1, 99) + ")",
        "= 1 − " + F(1, 99) + " = " + F(98, 99) + " (bỏ ngoặc, các cặp số đối triệt tiêu).",
        "b) B = " + F(1, "1 · 3") + " + " + F(1, "3 · 5") + " + … + " + F(1, "97 · 99") + " = " + F(1, 2) + " · (" + F(2, "1 · 3") + " + " + F(2, "3 · 5") + " + … + " + F(2, "97 · 99") + ") = " + F(1, 2) + " · A = " + F(1, 2) + " · " + F(98, 99) + " = " + F(49, 99) + "."
      ],
      dap: "A = " + F(98, 99) + "; B = " + F(49, 99) + "."
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Tìm số tự nhiên x (x ≥ 1), biết: " + F(1, "1 · 2") + " + " + F(1, "2 · 3") + " + " + F(1, "3 · 4") + " + … + " + F(1, "x · (x + 1)") + " = " + F(49, 50) + ".",
      goi: F(1, "n · (n + 1)") + " = " + F(1, "n") + " − " + F(1, "n + 1") + ". Rút gọn vế trái trước.",
      hieu: { gt: "Tổng các phân số " + F(1, "n · (n + 1)") + " với n từ 1 đến x bằng " + F(49, 50) + ".", kl: "Tìm x.",
        hoi: [
          ["x ở đâu trong đẳng thức? Có tìm được ngay không?", "x nằm ở số hạng cuối, số số hạng cũng phụ thuộc x. Phải rút gọn vế trái thành một biểu thức đơn giản chứa x."],
          ["Thử x = 1, x = 2: vế trái bằng bao nhiêu?", "x = 1: " + F(1, 2) + ". x = 2: " + F(1, 2) + " + " + F(1, 6) + " = " + F(2, 3) + ". Có vẻ vế trái bằng " + F("x", "x + 1") + "."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tìm x",
        sd: [["x + 1 = 50", [4]], [F(1, "x + 1") + " = " + F(1, 50), [3]], ["Vế trái = 1 − " + F(1, "x + 1"), [1, 2]]],
        gt: "Tổng có quy luật, bằng " + F(49, 50),
        ket: "1 − " + F(1, "x + 1") + " = " + F(49, 50) + " nên " + F(1, "x + 1") + " = " + F(1, 50) + ", x + 1 = 50, x = 49.",
        buoc: [
        { hoi: "Rút gọn vế trái bằng cách nào?",
          nho: F(1, "n") + " − " + F(1, "n + 1") + " = " + F(1, "n · (n + 1)") + ".",
          chon: [
            ["Tách mỗi số hạng thành hiệu rồi triệt tiêu: vế trái = 1 − " + F(1, "x + 1"), true, "Đúng. Giống bài tính tổng ở câu trên."],
            ["Quy đồng mẫu tất cả các số hạng", false, "Không biết có bao nhiêu số hạng (phụ thuộc x), không quy đồng được."]],
          dat: "Vế trái = 1 − " + F(1, "x + 1") },
        { hoi: "1 − " + F(1, "x + 1") + " = " + F(49, 50) + ". Tìm " + F(1, "x + 1") + " thế nào?",
          nho: "Số trừ = số bị trừ − hiệu.",
          chon: [
            [F(1, "x + 1") + " = 1 − " + F(49, 50) + " = " + F(1, 50), true, "Đúng. Hai phân số cùng tử 1 bằng nhau thì mẫu bằng nhau: x + 1 = 50."],
            [F(1, "x + 1") + " = " + F(49, 50) + " − 1", false, "Đó là số đối của kết quả đúng: x đứng ở số trừ."]],
          dat: F(1, "x + 1") + " = " + F(1, 50) }] }],
      nhin: [
        ["Thử lại với x = 49.", "Vế trái = 1 − " + F(1, 50) + " = " + F(49, 50) + ". Đúng."],
        ["Nếu vế phải là " + F(2023, 2024) + " thì x bằng bao nhiêu?", "1 − " + F(1, "x + 1") + " = " + F(2023, 2024) + ", x + 1 = 2024, x = 2023."]],
      steps: [
        "Với n là số tự nhiên khác 0: " + F(1, "n · (n + 1)") + " = " + F(1, "n") + " − " + F(1, "n + 1") + ".",
        "Vế trái = (1 − " + F(1, 2) + ") + (" + F(1, 2) + " − " + F(1, 3) + ") + … + (" + F(1, "x") + " − " + F(1, "x + 1") + ") = 1 − " + F(1, "x + 1") + ".",
        "Do đó 1 − " + F(1, "x + 1") + " = " + F(49, 50) + ", suy ra " + F(1, "x + 1") + " = 1 − " + F(49, 50) + " = " + F(1, 50) + ".",
        "Vậy x + 1 = 50, x = 49."
      ],
      dap: "x = 49.",
      mix: [1]
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Tính M = (" + F(1, 2) + " − 1) · (" + F(1, 3) + " − 1) · (" + F(1, 4) + " − 1) · … · (" + F(1, 100) + " − 1).",
      goi: "Tính từng thừa số: " + F(1, "k") + " − 1 = " + F("−(k − 1)", "k") + ". Đếm số thừa số âm để biết dấu.",
      hieu: { gt: "M là tích các thừa số (" + F(1, "k") + " − 1) với k từ 2 đến 100.", kl: "Tính M.",
        hoi: [
          ["M có bao nhiêu thừa số? Mỗi thừa số âm hay dương?", "k chạy từ 2 đến 100: có 99 thừa số. Mỗi thừa số " + F(1, "k") + " − 1 đều âm (vì " + F(1, "k") + " < 1)."],
          ["Tính ba thừa số đầu.", F(1, 2) + " − 1 = " + F("−1", 2) + "; " + F(1, 3) + " − 1 = " + F("−2", 3) + "; " + F(1, 4) + " − 1 = " + F("−3", 4) + "."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tính M",
        sd: [["Phần không dấu: " + F(1, 2) + " · " + F(2, 3) + " · … · " + F(99, 100) + " = " + F(1, 100), [3]], ["Dấu: 99 thừa số âm, tích âm", [2]], ["Mỗi thừa số = " + F("−(k − 1)", "k"), [1]]],
        gt: "Tích 99 thừa số có quy luật",
        ket: "M = −(" + F(1, 2) + " · " + F(2, 3) + " · " + F(3, 4) + " · … · " + F(99, 100) + ") = −" + F(1, 100) + ".",
        buoc: [
        { hoi: "Mỗi thừa số viết gọn lại thế nào?",
          nho: F(1, "k") + " − 1 = " + F(1, "k") + " − " + F("k", "k") + ".",
          chon: [
            [F(1, "k") + " − 1 = " + F("1 − k", "k") + ", tức là −" + F("k − 1", "k"), true, "Đúng: " + F("−1", 2) + ", " + F("−2", 3) + ", …, " + F("−99", 100) + "."],
            [F(1, "k") + " − 1 = " + F(0, "k") + " = 0", false, "Không trừ tử cho 1 rồi giữ mẫu: 1 = " + F("k", "k") + "."]],
          dat: "Thừa số thứ k là −" + F("k − 1", "k") },
        { hoi: "Tích có 99 thừa số âm. Dấu của M là gì?",
          nho: "Tích có số lẻ thừa số âm thì âm, số chẵn thừa số âm thì dương.",
          chon: [
            ["99 là số lẻ nên M âm", true, "Đúng. Còn lại tính phần không dấu."],
            ["Tích các số âm luôn dương", false, "Chỉ khi số thừa số âm là chẵn."]],
          dat: "M âm" },
        { hoi: "Tính " + F(1, 2) + " · " + F(2, 3) + " · " + F(3, 4) + " · … · " + F(99, 100) + " nhanh thế nào?",
          nho: "Nhân tử với tử, mẫu với mẫu; rút gọn các thừa số giống nhau ở tử và mẫu.",
          chon: [
            ["Tử 2 của phân số thứ hai rút gọn với mẫu 2 của phân số thứ nhất, …: chỉ còn " + F(1, 100), true, "Đúng. Tử là 1 · 2 · … · 99, mẫu là 2 · 3 · … · 100."],
            ["Nhân lần lượt từng phân số", false, "98 phép nhân, quá dài. Hãy nhìn tử và mẫu."]],
          dat: "Phần không dấu bằng " + F(1, 100) }] }],
      nhin: [
        ["Kiểm tra với tích ngắn: (" + F(1, 2) + " − 1) · (" + F(1, 3) + " − 1).", F("−1", 2) + " · " + F("−2", 3) + " = " + F(1, 3) + ": hai thừa số âm, tích dương, phần không dấu " + F(1, 3) + ". Khớp quy luật."],
        ["Nếu tích dừng ở (" + F(1, 101) + " − 1) thì kết quả là gì?", "100 thừa số âm nên tích dương: " + F(1, 101) + "."]],
      steps: [
        "Với k = 2, 3, …, 100: " + F(1, "k") + " − 1 = " + F("1 − k", "k") + " = −" + F("k − 1", "k") + ".",
        "M = (" + F(1, 2) + " − 1) · (" + F(1, 3) + " − 1) · … · (" + F(1, 100) + " − 1) = (" + F("−1", 2) + ") · (" + F("−2", 3) + ") · (" + F("−3", 4) + ") · … · (" + F("−99", 100) + "). Có 99 thừa số, đều âm; 99 là số lẻ nên M là số âm.",
        "M = −" + F("1 · 2 · 3 · … · 99", "2 · 3 · 4 · … · 100") + " = −" + F(1, 100) + "."
      ],
      dap: "M = " + F("−1", 100) + ".",
      loi: "Quên xét dấu, ra M = " + F(1, 100) + "."
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
