/* Bài tập tự luận – Bài 3. Luỹ thừa với số mũ tự nhiên của một số hữu tỉ (Toán 7, Kết nối tri thức).
   Chia theo dạng, mỗi dạng có phương pháp giải và bài tự luyện; mục Dành cho HSG riêng, giải theo 4 bước.
   Kiến thức dùng: Bài 1, Bài 2, Bài 3 (luỹ thừa, nhân chia hai luỹ thừa cùng cơ số, luỹ thừa của luỹ thừa, luỹ thừa của tích, thương) và Toán 6.
   Chưa học quy tắc chuyển vế (Bài 4): tìm x dùng quan hệ giữa các số trong phép tính. */
(function () {
  "use strict";
  var F = function (n, d) { return '<span class="fr"><span>' + n + "</span><span>" + d + "</span></span>"; };
  var P = function (b, e) { return b + "<sup>" + e + "</sup>"; };
  var Q = function (b, e) { return "(" + b + ")<sup>" + e + "</sup>"; };   // cơ số âm hoặc phân số đặt trong ngoặc

  var ITEMS = [
    /* ===== Dạng 1. Tính luỹ thừa, dấu của luỹ thừa ===== */
    {
      id: "nb1", lv: "NB",
      de: "Tính: a) " + Q(F("−2", 3), 3) + ";  b) " + Q("−0,5", 4) + ";  c) " + Q("1" + F(1, 2), 2) + ";  d) " + Q(F("−2025", 2026), 0) + ".",
      goi: "Luỹ thừa bậc n là tích của n thừa số bằng nhau. " + Q(F("a", "b"), "n") + " = " + F(P("a", "n"), P("b", "n")) + ". Quy ước x⁰ = 1 (x ≠ 0).",
      steps: [
        "a) " + Q(F("−2", 3), 3) + " = " + F(P("(−2)", 3), P(3, 3)) + " = " + F("−8", 27) + ".",
        "b) " + Q("−0,5", 4) + " = (−0,5) · (−0,5) · (−0,5) · (−0,5) = 0,0625.",
        "c) 1" + F(1, 2) + " = " + F(3, 2) + ", nên " + Q("1" + F(1, 2), 2) + " = " + Q(F(3, 2), 2) + " = " + F(9, 4) + ".",
        "d) " + Q(F("−2025", 2026), 0) + " = 1 (vì " + F("−2025", 2026) + " ≠ 0)."
      ],
      dap: "a) " + F("−8", 27) + "; b) 0,0625; c) " + F(9, 4) + "; d) 1.",
      loi: "Tính " + Q(F("−2", 3), 3) + " = " + F("−6", 9) + " (nhân với 3); câu c ra 1" + F(1, 4) + " (chỉ bình phương phần phân số); câu d ra 0."
    },
    {
      id: "th1", lv: "TH",
      de: "a) Tính và so sánh −" + P(3, 4) + " và " + Q("−3", 4) + ".<br>b) Không tính, cho biết mỗi số sau âm hay dương: " + Q(F("−2", 5), 7) + ";  " + Q("−0,3", 10) + ";  −" + Q(F(1, 2), 4) + ".<br>c) Tính " + Q("−1", 2025) + " + " + Q("−1", 2026) + ".",
      goi: "Luỹ thừa bậc chẵn của số âm là số dương, bậc lẻ của số âm là số âm. Dấu \"−\" đứng ngoài luỹ thừa thì không được nâng lên luỹ thừa.",
      pt: [
        { ten: "Câu a", dich: "So sánh −" + P(3, 4) + " và " + Q("−3", 4), sd: [["Tính từng số: −81 và 81", [1]]], gt: "Vị trí của dấu \"−\"" },
        { ten: "Câu b", dich: "Dấu của ba số", sd: [["Xét cơ số âm hay dương và số mũ chẵn hay lẻ", [2, 3]]], gt: "Quy tắc dấu của luỹ thừa" },
        { ten: "Câu c", dich: Q("−1", 2025) + " + " + Q("−1", 2026), sd: [["Số mũ lẻ cho −1, số mũ chẵn cho 1", [4]]], gt: "Cơ số −1" }],
      steps: [
        "a) −" + P(3, 4) + " = −(3 · 3 · 3 · 3) = −81; " + Q("−3", 4) + " = 81. Vậy −" + P(3, 4) + " < " + Q("−3", 4) + ".",
        "b) " + Q(F("−2", 5), 7) + ": cơ số âm, số mũ lẻ nên là số âm. " + Q("−0,3", 10) + ": cơ số âm, số mũ chẵn nên là số dương.",
        "−" + Q(F(1, 2), 4) + ": " + Q(F(1, 2), 4) + " dương, có dấu \"−\" đằng trước nên là số âm.",
        "c) " + Q("−1", 2025) + " = −1 (số mũ lẻ); " + Q("−1", 2026) + " = 1 (số mũ chẵn). Tổng: −1 + 1 = 0."
      ],
      dap: "a) −81 < 81. b) âm; dương; âm. c) 0.",
      loi: "Cho −" + P(3, 4) + " = 81 (nâng cả dấu \"−\" lên luỹ thừa)."
    },

    /* ===== Dạng 2. Viết dưới dạng một luỹ thừa ===== */
    {
      id: "nb2", lv: "NB",
      de: "Viết các biểu thức sau dưới dạng một luỹ thừa:<br>a) " + Q(F("−3", 4), 5) + " · " + Q(F("−3", 4), 2) + ";  b) " + P("0,2", 8) + " : " + P("0,2", 3) + ";  c) " + "[" + Q(F(2, 5), 3) + "]" + "<sup>4</sup>.",
      goi: "Nhân hai luỹ thừa cùng cơ số: cộng số mũ. Chia: trừ số mũ. Luỹ thừa của luỹ thừa: nhân số mũ.",
      steps: [
        "a) " + Q(F("−3", 4), 5) + " · " + Q(F("−3", 4), 2) + " = " + Q(F("−3", 4), "5 + 2") + " = " + Q(F("−3", 4), 7) + ".",
        "b) " + P("0,2", 8) + " : " + P("0,2", 3) + " = " + P("0,2", "8 − 3") + " = " + P("0,2", 5) + ".",
        "c) [" + Q(F(2, 5), 3) + "]<sup>4</sup> = " + Q(F(2, 5), "3 · 4") + " = " + Q(F(2, 5), 12) + "."
      ],
      dap: "a) " + Q(F("−3", 4), 7) + "; b) " + P("0,2", 5) + "; c) " + Q(F(2, 5), 12) + ".",
      loi: "Câu a nhân hai số mũ (ra số mũ 10); câu c cộng hai số mũ (ra số mũ 7)."
    },
    {
      id: "th2", lv: "TH",
      de: "Viết mỗi số sau dưới dạng luỹ thừa của một số hữu tỉ:<br>a) 4 · " + P(2, 5) + ";  b) " + P(27, 3) + " : " + P(9, 2) + ";  c) 0,125 · " + P("0,5", 4) + ".",
      goi: "Đưa về cùng cơ số: 4 = " + P(2, 2) + "; 27 = " + P(3, 3) + ", 9 = " + P(3, 2) + "; 0,125 = " + P("0,5", 3) + ".",
      pt: [
        { ten: "Câu a", dich: "4 · " + P(2, 5) + " dưới dạng luỹ thừa", sd: [["Nhân hai luỹ thừa cùng cơ số 2", [1]], ["Viết 4 = " + P(2, 2), [1]]], gt: "4 là luỹ thừa của 2" },
        { ten: "Câu b", dich: P(27, 3) + " : " + P(9, 2) + " dưới dạng luỹ thừa", sd: [["Chia hai luỹ thừa cùng cơ số 3", [3]], ["Viết " + P(27, 3) + " = " + P(3, 9) + ", " + P(9, 2) + " = " + P(3, 4), [2]]], gt: "27 và 9 là luỹ thừa của 3" },
        { ten: "Câu c", dich: "0,125 · " + P("0,5", 4) + " dưới dạng luỹ thừa", sd: [["Nhân hai luỹ thừa cùng cơ số 0,5", [4]], ["Viết 0,125 = " + P("0,5", 3), [4]]], gt: "0,5 · 0,5 · 0,5 = 0,125" }],
      steps: [
        "a) 4 · " + P(2, 5) + " = " + P(2, 2) + " · " + P(2, 5) + " = " + P(2, 7) + ".",
        "b) " + P(27, 3) + " = " + Q(P(3, 3), 3) + " = " + P(3, 9) + "; " + P(9, 2) + " = " + Q(P(3, 2), 2) + " = " + P(3, 4) + ".",
        P(27, 3) + " : " + P(9, 2) + " = " + P(3, 9) + " : " + P(3, 4) + " = " + P(3, 5) + ".",
        "c) 0,125 = " + P("0,5", 3) + ", nên 0,125 · " + P("0,5", 4) + " = " + P("0,5", 3) + " · " + P("0,5", 4) + " = " + P("0,5", 7) + "."
      ],
      dap: "a) " + P(2, 7) + "; b) " + P(3, 5) + "; c) " + P("0,5", 7) + ".",
      loi: "Câu b chia luôn cơ số: " + P(27, 3) + " : " + P(9, 2) + " = " + P(3, 1) + "; câu a ghi 4 · " + P(2, 5) + " = " + P(8, 5) + "."
    },
    {
      id: "vd1", lv: "VD",
      de: "a) Viết A = " + P(9, 4) + " · " + P(27, 3) + " : " + P(81, 2) + " dưới dạng luỹ thừa của 3.<br>b) Tính B = " + P("0,25", 3) + " · " + P(32, 2) + ".",
      goi: "a) 9 = " + P(3, 2) + ", 27 = " + P(3, 3) + ", 81 = " + P(3, 4) + ". b) 0,25 = " + F(1, 4) + " = " + F(1, P(2, 2)) + ", 32 = " + P(2, 5) + ".",
      pt: [
        { ten: "Câu a", dich: "A dưới dạng luỹ thừa của 3", sd: [["Nhân rồi chia các luỹ thừa cùng cơ số 3", [2]], ["Đưa từng số về luỹ thừa của 3", [1]]], gt: "9, 27, 81 là luỹ thừa của 3" },
        { ten: "Câu b", dich: "Tính B", sd: [["B = " + F(P(2, 10), P(2, 6)) + " = " + P(2, 4), [4]], ["Viết " + P("0,25", 3) + " = " + F(1, P(2, 6)) + ", " + P(32, 2) + " = " + P(2, 10), [3]]], gt: "0,25 = " + F(1, 4) + ", 32 = " + P(2, 5) }],
      hieu: { gt: "A = " + P(9, 4) + " · " + P(27, 3) + " : " + P(81, 2) + "; B = " + P("0,25", 3) + " · " + P(32, 2) + ".", kl: "a) A dưới dạng luỹ thừa của 3. b) Tính B.",
        hoi: [
          ["Ba số 9, 27, 81 có liên hệ gì với 3?", "Đều là luỹ thừa của 3: 9 = " + P(3, 2) + ", 27 = " + P(3, 3) + ", 81 = " + P(3, 4) + "."],
          ["Ở câu b, 0,25 và 32 liên quan đến số nào?", "0,25 = " + F(1, 4) + " và 4, 32 đều là luỹ thừa của 2."]] },
      nguoc: [
      { ten: "Câu a", dich: "A dưới dạng luỹ thừa của 3",
        sd: [["A = " + P(3, "8 + 9 − 8") + " = " + P(3, 9), [2]], [P(9, 4) + " = " + P(3, 8) + ", " + P(27, 3) + " = " + P(3, 9) + ", " + P(81, 2) + " = " + P(3, 8), [1]]],
        gt: "9, 27, 81 là luỹ thừa của 3",
        ket: "A = " + P(3, 8) + " · " + P(3, 9) + " : " + P(3, 8) + " = " + P(3, 9) + ".",
        buoc: [
        { hoi: "Các luỹ thừa trong A khác cơ số. Muốn nhân, chia được, cần làm gì trước?",
          nho: "Chỉ nhân, chia được theo quy tắc cộng, trừ số mũ khi hai luỹ thừa cùng cơ số.",
          chon: [
            ["Đưa cả ba luỹ thừa về cùng cơ số 3", true, "Đúng. Dùng (" + P("x", "m") + ")<sup>n</sup> = " + P("x", "m · n") + "."],
            ["Nhân các cơ số: 9 · 27 rồi chia cho 81", false, "Số mũ khác nhau (4, 3, 2) nên không gộp cơ số như vậy được."]],
          dat: "Đưa về cơ số 3" },
        { hoi: "Viết " + P(9, 4) + ", " + P(27, 3) + ", " + P(81, 2) + " thành luỹ thừa của 3.",
          nho: "Luỹ thừa của luỹ thừa: nhân hai số mũ.",
          chon: [
            [P(9, 4) + " = " + Q(P(3, 2), 4) + " = " + P(3, 8) + "; " + P(27, 3) + " = " + P(3, 9) + "; " + P(81, 2) + " = " + P(3, 8), true, "Đúng. Còn A = " + P(3, 8) + " · " + P(3, 9) + " : " + P(3, 8) + "."],
            [P(9, 4) + " = " + P(3, 6) + " (cộng 2 + 4)", false, "Luỹ thừa của luỹ thừa thì nhân số mũ: 2 · 4 = 8."]],
          dat: P(9, 4) + " = " + P(3, 8) + ", " + P(27, 3) + " = " + P(3, 9) + ", " + P(81, 2) + " = " + P(3, 8) }] },
      { ten: "Câu b", dich: "Tính B",
        sd: [["B = " + P(2, 10) + " : " + P(2, 6) + " = " + P(2, 4) + " = 16", [4]], [P("0,25", 3) + " = " + F(1, P(2, 6)) + ", " + P(32, 2) + " = " + P(2, 10), [3]]],
        gt: "0,25 = " + F(1, 4) + ", 32 = " + P(2, 5),
        ket: "B = " + F(1, P(2, 6)) + " · " + P(2, 10) + " = " + P(2, 4) + " = 16.",
        buoc: [
        { hoi: "Viết 0,25 thế nào để cùng \"họ\" với 32?",
          nho: "Luỹ thừa của một thương: " + Q(F("x", "y"), "n") + " = " + F(P("x", "n"), P("y", "n")) + ".",
          chon: [
            ["0,25 = " + F(1, 4) + ", nên " + P("0,25", 3) + " = " + F(1, P(4, 3)) + " = " + F(1, P(2, 6)), true, "Đúng. 32² = " + Q(P(2, 5), 2) + " = " + P(2, 10) + "."],
            ["Tính 0,25 · 32 = 8 rồi nâng lên luỹ thừa", false, "Hai số mũ khác nhau (3 và 2) nên không gộp thành một tích rồi luỹ thừa được."]],
          dat: P("0,25", 3) + " = " + F(1, P(2, 6)) }] }],
      nhin: [
        ["Kiểm tra câu a bằng máy tính cầm tay.", P(9, 4) + " · " + P(27, 3) + " : " + P(81, 2) + " = 6561 · 19683 : 6561 = 19683 = " + P(3, 9) + ". Đúng."],
        ["Câu b còn cách khác không?", "Tính thẳng: " + P("0,25", 3) + " = " + F(1, 64) + " và " + P(32, 2) + " = 1024, nên B = 1024 : 64 = 16. Cách đưa về luỹ thừa của 2 giúp không phải tính số lớn."]],
      steps: [
        "a) " + P(9, 4) + " = " + Q(P(3, 2), 4) + " = " + P(3, 8) + "; " + P(27, 3) + " = " + Q(P(3, 3), 3) + " = " + P(3, 9) + "; " + P(81, 2) + " = " + Q(P(3, 4), 2) + " = " + P(3, 8) + ".",
        "A = " + P(3, 8) + " · " + P(3, 9) + " : " + P(3, 8) + " = " + P(3, 17) + " : " + P(3, 8) + " = " + P(3, 9) + ".",
        "b) " + P("0,25", 3) + " = " + Q(F(1, 4), 3) + " = " + F(1, P(4, 3)) + " = " + F(1, P(2, 6)) + "; " + P(32, 2) + " = " + Q(P(2, 5), 2) + " = " + P(2, 10) + ".",
        "B = " + F(1, P(2, 6)) + " · " + P(2, 10) + " = " + F(P(2, 10), P(2, 6)) + " = " + P(2, 4) + " = 16."
      ],
      dap: "a) A = " + P(3, 9) + "; b) B = 16.",
      loi: "Viết " + P(9, 4) + " = " + P(3, 6) + " (cộng số mũ thay vì nhân)."
    },

    /* ===== Dạng 3. Tính giá trị biểu thức có luỹ thừa ===== */
    {
      id: "th3", lv: "TH",
      de: "Tính một cách hợp lí:<br>a) " + P("0,125", 3) + " · " + P(8, 3) + ";  b) " + P(45, 4) + " : " + P(15, 4) + ";  c) " + Q(F("−2", 5), 3) + " · " + Q(F(5, 2), 3) + ".",
      goi: "Hai luỹ thừa cùng số mũ: " + P("x", "n") + " · " + P("y", "n") + " = " + Q("x · y", "n") + "; " + P("x", "n") + " : " + P("y", "n") + " = " + Q("x : y", "n") + ".",
      pt: [
        { ten: "Câu a", dich: P("0,125", 3) + " · " + P(8, 3), sd: [["Gộp thành " + Q("0,125 · 8", 3) + " = " + P(1, 3), [1]]], gt: "Cùng số mũ 3" },
        { ten: "Câu b", dich: P(45, 4) + " : " + P(15, 4), sd: [["Gộp thành " + Q("45 : 15", 4) + " = " + P(3, 4), [2]]], gt: "Cùng số mũ 4" },
        { ten: "Câu c", dich: Q(F("−2", 5), 3) + " · " + Q(F(5, 2), 3), sd: [["Gộp thành " + Q(F("−2", 5) + " · " + F(5, 2), 3) + " = " + Q("−1", 3), [3]]], gt: "Cùng số mũ 3" }],
      steps: [
        "a) " + P("0,125", 3) + " · " + P(8, 3) + " = " + Q("0,125 · 8", 3) + " = " + P(1, 3) + " = 1.",
        "b) " + P(45, 4) + " : " + P(15, 4) + " = " + Q("45 : 15", 4) + " = " + P(3, 4) + " = 81.",
        "c) " + Q(F("−2", 5), 3) + " · " + Q(F(5, 2), 3) + " = " + Q(F("−2", 5) + " · " + F(5, 2), 3) + " = " + Q("−1", 3) + " = −1."
      ],
      dap: "a) 1; b) 81; c) −1.",
      loi: "Câu b chia số mũ: " + P(45, 4) + " : " + P(15, 4) + " = " + P(3, 1) + "; câu c quên dấu, ra 1."
    },
    {
      id: "vd2", lv: "VD",
      de: "Tính C = " + Q(F("−1", 3), 2) + " · " + P(3, 4) + " − " + P("0,4", 3) + " · " + Q(F(5, 2), 3) + " + " + P(2025, 0) + ".",
      goi: "Tách thành ba phần. " + Q(F("−1", 3), 2) + " = " + F(1, P(3, 2)) + "; 0,4 = " + F(2, 5) + ".",
      pt: [
        { ten: "Cả bài", dich: "Tính C", sd: [["C = 9 − 1 + 1", [4]], ["Tính ba phần: " + Q(F("−1", 3), 2) + " · " + P(3, 4) + " = 9; " + P("0,4", 3) + " · " + Q(F(5, 2), 3) + " = 1; " + P(2025, 0) + " = 1", [1, 2, 3]]], gt: "Biểu thức C" }],
      hieu: { gt: "C = " + Q(F("−1", 3), 2) + " · " + P(3, 4) + " − " + P("0,4", 3) + " · " + Q(F(5, 2), 3) + " + " + P(2025, 0) + ".", kl: "Tính C.",
        hoi: [
          ["C gồm mấy phần nối với nhau bằng dấu cộng, trừ?", "Ba phần: " + Q(F("−1", 3), 2) + " · " + P(3, 4) + ";  " + P("0,4", 3) + " · " + Q(F(5, 2), 3) + ";  " + P(2025, 0) + "."],
          ["Trong phần thứ hai, 0,4 và " + F(5, 2) + " có quan hệ gì?", "0,4 = " + F(2, 5) + " là nghịch đảo của " + F(5, 2) + ", tích của chúng bằng 1."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tính C",
        sd: [["C = 9 − 1 + 1 = 9", [4]], [P("0,4", 3) + " · " + Q(F(5, 2), 3) + " = " + Q(F(2, 5) + " · " + F(5, 2), 3) + " = 1", [2]], [Q(F("−1", 3), 2) + " · " + P(3, 4) + " = " + F(P(3, 4), P(3, 2)) + " = 9", [1]]],
        gt: "Biểu thức C",
        ket: "C = 9 − 1 + 1 = 9.",
        buoc: [
        { hoi: "Tính " + Q(F("−1", 3), 2) + " · " + P(3, 4) + " nhanh thế nào?",
          nho: "Luỹ thừa bậc chẵn của số âm là số dương. " + Q(F(1, 3), 2) + " = " + F(1, P(3, 2)) + ".",
          chon: [
            [Q(F("−1", 3), 2) + " = " + F(1, P(3, 2)) + ", nên tích = " + P(3, 4) + " : " + P(3, 2) + " = " + P(3, 2) + " = 9", true, "Đúng."],
            [Q(F("−1", 3), 2) + " = " + F("−1", 9) + " nên tích = −9", false, "Bình phương của số âm là số dương: " + Q(F("−1", 3), 2) + " = " + F(1, 9) + "."]],
          dat: Q(F("−1", 3), 2) + " · " + P(3, 4) + " = 9" },
        { hoi: "Phần " + P("0,4", 3) + " · " + Q(F(5, 2), 3) + ": hai luỹ thừa có gì chung?",
          nho: P("x", "n") + " · " + P("y", "n") + " = " + Q("x · y", "n") + ".",
          chon: [
            ["Cùng số mũ 3, và 0,4 · " + F(5, 2) + " = 1, nên tích = " + P(1, 3) + " = 1", true, "Đúng. Còn " + P(2025, 0) + " = 1."],
            ["Tính " + P("0,4", 3) + " = 0,064 và " + Q(F(5, 2), 3) + " = " + F(125, 8) + " rồi nhân", false, "Làm được nhưng dài; cùng số mũ thì gộp cơ số trước."]],
          dat: P("0,4", 3) + " · " + Q(F(5, 2), 3) + " = 1" }] }],
      nhin: [
        ["Kiểm tra phần thứ hai bằng cách tính thẳng.", "0,064 · " + F(125, 8) + " = " + F(8, 125) + " · " + F(125, 8) + " = 1. Đúng."],
        ["Nếu đổi " + P(2025, 0) + " thành " + P(0, 2025) + " thì C bằng bao nhiêu?", P(0, 2025) + " = 0 nên C = 9 − 1 + 0 = 8. Chú ý: " + P("x", 0) + " = 1 chỉ khi x ≠ 0, còn " + P(0, "n") + " = 0 (n ≥ 1)."]],
      steps: [
        Q(F("−1", 3), 2) + " · " + P(3, 4) + " = " + F(1, P(3, 2)) + " · " + P(3, 4) + " = " + P(3, 4) + " : " + P(3, 2) + " = " + P(3, 2) + " = 9.",
        P("0,4", 3) + " · " + Q(F(5, 2), 3) + " = " + Q(F(2, 5) + " · " + F(5, 2), 3) + " = " + P(1, 3) + " = 1.",
        P(2025, 0) + " = 1.",
        "C = 9 − 1 + 1 = 9."
      ],
      dap: "C = 9.",
      loi: "Cho " + P(2025, 0) + " = 0 hoặc = 2025; cho " + Q(F("−1", 3), 2) + " là số âm.",
      mix: [2]
    },

    /* ===== Dạng 4. Tìm x, so sánh luỹ thừa ===== */
    {
      id: "nb3", lv: "NB",
      de: "Tìm x, biết: a) " + P("x", 3) + " = " + F("−8", 27) + ";  b) x : " + Q(F("−1", 2), 3) + " = " + Q(F("−1", 2), 2) + ".",
      goi: "a) Viết " + F("−8", 27) + " thành lập phương của một số. b) Số bị chia = thương · số chia.",
      steps: [
        "a) " + F("−8", 27) + " = " + Q(F("−2", 3), 3) + ", nên " + P("x", 3) + " = " + Q(F("−2", 3), 3) + ", x = " + F("−2", 3) + ".",
        "b) x = " + Q(F("−1", 2), 2) + " · " + Q(F("−1", 2), 3) + " = " + Q(F("−1", 2), 5) + " = " + F("−1", 32) + "."
      ],
      dap: "a) x = " + F("−2", 3) + "; b) x = " + F("−1", 32) + ".",
      loi: "Câu a ra x = " + F(2, 3) + " (quên dấu); câu b chia thay vì nhân."
    },
    {
      id: "vd3", lv: "VD",
      de: "Tìm x, biết: a) " + Q("x − " + F(1, 2), 2) + " = " + F(1, 9) + ";  b) " + P(3, "x + 2") + " − " + P(3, "x") + " = 216.",
      goi: "a) Hai số có bình phương bằng " + F(1, 9) + " là " + F(1, 3) + " và " + F("−1", 3) + ". b) " + P(3, "x + 2") + " = " + P(3, "x") + " · 9; đặt " + P(3, "x") + " làm thừa số chung.",
      pt: [
        { ten: "Câu a", dich: "Tìm x trong " + Q("x − " + F(1, 2), 2) + " = " + F(1, 9), sd: [["Tìm x trong từng trường hợp", [2, 3]], ["x − " + F(1, 2) + " = " + F(1, 3) + " hoặc x − " + F(1, 2) + " = " + F("−1", 3), [1]]], gt: Q(F(1, 3), 2) + " = " + Q(F("−1", 3), 2) + " = " + F(1, 9) },
        { ten: "Câu b", dich: "Tìm x trong " + P(3, "x + 2") + " − " + P(3, "x") + " = 216", sd: [[P(3, "x") + " = 27 = " + P(3, 3), [5]], [P(3, "x") + " · (9 − 1) = 216", [4]]], gt: P(3, "x + 2") + " = " + P(3, "x") + " · " + P(3, 2) }],
      hieu: { gt: "a) " + Q("x − " + F(1, 2), 2) + " = " + F(1, 9) + ". b) " + P(3, "x + 2") + " − " + P(3, "x") + " = 216 (x là số tự nhiên).", kl: "Tìm x.",
        hoi: [
          ["Câu a: có bao nhiêu số có bình phương bằng " + F(1, 9) + "?", "Hai số: " + F(1, 3) + " và " + F("−1", 3) + " (bình phương của số âm cũng dương)."],
          ["Câu b: x nằm ở đâu? Hai luỹ thừa " + P(3, "x + 2") + " và " + P(3, "x") + " có liên hệ gì?", "x nằm ở số mũ. " + P(3, "x + 2") + " = " + P(3, "x") + " · " + P(3, 2) + " = 9 · " + P(3, "x") + "."]] },
      nguoc: [
      { ten: "Câu a", dich: Q("x − " + F(1, 2), 2) + " = " + F(1, 9),
        sd: [["x = " + F(5, 6) + " hoặc x = " + F(1, 6), [2, 3]], ["x − " + F(1, 2) + " = " + F(1, 3) + " hoặc x − " + F(1, 2) + " = " + F("−1", 3), [1]]],
        gt: F(1, 9) + " = " + Q(F(1, 3), 2) + " = " + Q(F("−1", 3), 2),
        ket: "x = " + F(1, 3) + " + " + F(1, 2) + " = " + F(5, 6) + " hoặc x = " + F("−1", 3) + " + " + F(1, 2) + " = " + F(1, 6) + ".",
        buoc: [
        { hoi: "Biểu thức trong ngoặc x − " + F(1, 2) + " phải bằng bao nhiêu?",
          nho: "Luỹ thừa bậc chẵn của hai số đối nhau thì bằng nhau.",
          chon: [
            ["x − " + F(1, 2) + " = " + F(1, 3) + " hoặc x − " + F(1, 2) + " = " + F("−1", 3), true, "Đúng. Đừng bỏ sót trường hợp số âm."],
            ["Chỉ x − " + F(1, 2) + " = " + F(1, 3), false, "Thiếu trường hợp " + F("−1", 3) + ": " + Q(F("−1", 3), 2) + " cũng bằng " + F(1, 9) + "."]],
          dat: "x − " + F(1, 2) + " = ± " + F(1, 3) }] },
      { ten: "Câu b", dich: P(3, "x + 2") + " − " + P(3, "x") + " = 216",
        sd: [[P(3, "x") + " = 27 = " + P(3, 3) + ", x = 3", [5]], [P(3, "x") + " · 8 = 216", [4]]],
        gt: P(3, "x + 2") + " = " + P(3, "x") + " · 9",
        ket: "8 · " + P(3, "x") + " = 216, " + P(3, "x") + " = 27 = " + P(3, 3) + ", x = 3.",
        buoc: [
        { hoi: "x ở số mũ của hai luỹ thừa khác nhau. Làm sao để chỉ còn một luỹ thừa chứa x?",
          nho: P("a", "m + n") + " = " + P("a", "m") + " · " + P("a", "n") + "; a · b − a · c = a · (b − c).",
          chon: [
            ["Viết " + P(3, "x + 2") + " = " + P(3, "x") + " · 9 rồi đặt " + P(3, "x") + " chung: " + P(3, "x") + " · (9 − 1) = 216", true, "Đúng. " + P(3, "x") + " · 8 = 216."],
            [P(3, "x + 2") + " − " + P(3, "x") + " = " + P(3, 2), false, "Không trừ hai luỹ thừa bằng cách trừ số mũ (chỉ phép chia mới trừ số mũ)."]],
          dat: P(3, "x") + " · 8 = 216" },
        { hoi: "Tìm x từ " + P(3, "x") + " · 8 = 216.",
          nho: "Hai luỹ thừa cùng cơ số (khác 0, khác 1, khác −1) bằng nhau thì số mũ bằng nhau.",
          chon: [
            [P(3, "x") + " = 216 : 8 = 27 = " + P(3, 3) + ", x = 3", true, "Đúng."],
            [P(3, "x") + " = 216 − 8", false, "8 là thừa số, phải chia chứ không trừ."]],
          dat: P(3, "x") + " = 27" }] }],
      nhin: [
        ["Thử lại câu b với x = 3.", P(3, 5) + " − " + P(3, 3) + " = 243 − 27 = 216. Đúng."],
        ["Thử lại câu a với x = " + F(1, 6) + ".", F(1, 6) + " − " + F(1, 2) + " = " + F("−1", 3) + ", " + Q(F("−1", 3), 2) + " = " + F(1, 9) + ". Đúng."],
        ["Bài tương tự: tìm x biết " + P(2, "x") + " + " + P(2, "x + 3") + " = 144.", P(2, "x") + " · (1 + 8) = 144, " + P(2, "x") + " = 16, x = 4."]],
      steps: [
        "a) " + F(1, 9) + " = " + Q(F(1, 3), 2) + " = " + Q(F("−1", 3), 2) + ", nên x − " + F(1, 2) + " = " + F(1, 3) + " hoặc x − " + F(1, 2) + " = " + F("−1", 3) + ".",
        "Nếu x − " + F(1, 2) + " = " + F(1, 3) + " thì x = " + F(1, 3) + " + " + F(1, 2) + " = " + F(5, 6) + ".",
        "Nếu x − " + F(1, 2) + " = " + F("−1", 3) + " thì x = " + F("−1", 3) + " + " + F(1, 2) + " = " + F(1, 6) + ". Vậy x = " + F(5, 6) + " hoặc x = " + F(1, 6) + ".",
        "b) " + P(3, "x + 2") + " − " + P(3, "x") + " = " + P(3, "x") + " · " + P(3, 2) + " − " + P(3, "x") + " = " + P(3, "x") + " · (9 − 1) = 8 · " + P(3, "x") + ". Do đó 8 · " + P(3, "x") + " = 216.",
        P(3, "x") + " = 216 : 8 = 27 = " + P(3, 3) + ", nên x = 3."
      ],
      dap: "a) x = " + F(5, 6) + " hoặc x = " + F(1, 6) + "; b) x = 3.",
      loi: "Câu a chỉ tìm một giá trị; câu b trừ số mũ: " + P(3, "x + 2") + " − " + P(3, "x") + " = " + P(3, 2) + "."
    },
    {
      id: "vd4", lv: "VD",
      de: "So sánh: a) " + P(2, 300) + " và " + P(3, 200) + ";  b) " + Q(F("−1", 16), 10) + " và " + Q(F("−1", 2), 50) + ".",
      goi: "a) Đưa về cùng số mũ 100. b) Hai số đều dương; đưa về cùng cơ số " + F(1, 2) + ".",
      pt: [
        { ten: "Câu a", dich: "So sánh " + P(2, 300) + " và " + P(3, 200), sd: [["So sánh " + P(8, 100) + " và " + P(9, 100), [2]], ["Viết " + P(2, 300) + " = " + P(8, 100) + ", " + P(3, 200) + " = " + P(9, 100), [1]]], gt: "300 = 3 · 100, 200 = 2 · 100" },
        { ten: "Câu b", dich: "So sánh " + Q(F("−1", 16), 10) + " và " + Q(F("−1", 2), 50), sd: [["So sánh " + Q(F(1, 2), 40) + " và " + Q(F(1, 2), 50), [4]], ["Hai số dương (số mũ chẵn); " + F(1, 16) + " = " + Q(F(1, 2), 4), [3]]], gt: "Số mũ 10 và 50 đều chẵn" }],
      steps: [
        "a) " + P(2, 300) + " = " + Q(P(2, 3), 100) + " = " + P(8, 100) + "; " + P(3, 200) + " = " + Q(P(3, 2), 100) + " = " + P(9, 100) + ".",
        "Vì 8 < 9 nên " + P(8, 100) + " < " + P(9, 100) + ", tức là " + P(2, 300) + " < " + P(3, 200) + ".",
        "b) Số mũ chẵn nên " + Q(F("−1", 16), 10) + " = " + Q(F(1, 16), 10) + " = " + Q(F(1, 2), 40) + ";  " + Q(F("−1", 2), 50) + " = " + Q(F(1, 2), 50) + ".",
        Q(F(1, 2), 50) + " = " + Q(F(1, 2), 40) + " · " + Q(F(1, 2), 10) + " mà " + Q(F(1, 2), 10) + " < 1, nên " + Q(F(1, 2), 50) + " < " + Q(F(1, 2), 40) + ". Vậy " + Q(F("−1", 16), 10) + " > " + Q(F("−1", 2), 50) + "."
      ],
      dap: "a) " + P(2, 300) + " < " + P(3, 200) + ". b) " + Q(F("−1", 16), 10) + " > " + Q(F("−1", 2), 50) + ".",
      loi: "Câu a so sánh số mũ (300 > 200) nên kết luận ngược; câu b nghĩ số mũ lớn hơn thì số lớn hơn (sai khi cơ số nhỏ hơn 1)."
    },

    /* ===== Dành cho HSG ===== */
    {
      id: "hsg1", lv: "HSG",
      de: "Tính A = " + F(P(4, 5) + " · " + P(9, 4) + " − 2 · " + P(6, 9), P(2, 10) + " · " + P(3, 8) + " + " + P(6, 8) + " · 20") + ".",
      goi: "Đưa mọi luỹ thừa về tích các luỹ thừa của 2 và 3. Tìm thừa số chung " + P(2, 10) + " · " + P(3, 8) + " ở cả tử và mẫu.",
      hieu: { gt: "A = " + F(P(4, 5) + " · " + P(9, 4) + " − 2 · " + P(6, 9), P(2, 10) + " · " + P(3, 8) + " + " + P(6, 8) + " · 20") + ".", kl: "Tính A.",
        hoi: [
          ["Các cơ số 4, 9, 6, 20 có thể viết qua những số nguyên tố nào?", "4 = " + P(2, 2) + ", 9 = " + P(3, 2) + ", 6 = 2 · 3, 20 = " + P(2, 2) + " · 5."],
          ["Có nên tính thẳng " + P(6, 9) + " và các luỹ thừa khác không?", "Không: số rất lớn (" + P(6, 9) + " = 10 077 696). Nên biến đổi để rút gọn."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tính A",
        sd: [["A = " + F("−2", 6) + " = " + F("−1", 3), [4]], ["Tử = " + P(2, 10) + " · " + P(3, 8) + " · (1 − 3); mẫu = " + P(2, 10) + " · " + P(3, 8) + " · (1 + 5)", [2, 3]], ["Viết mọi số hạng qua luỹ thừa của 2 và 3", [1]]],
        gt: "4 = " + P(2, 2) + ", 9 = " + P(3, 2) + ", 6 = 2 · 3, 20 = " + P(2, 2) + " · 5",
        ket: "A = " + F(P(2, 10) + " · " + P(3, 8) + " · (−2)", P(2, 10) + " · " + P(3, 8) + " · 6") + " = " + F("−2", 6) + " = " + F("−1", 3) + ".",
        buoc: [
        { hoi: "Muốn rút gọn được phân số, tử và mẫu cần có dạng gì?",
          nho: "Rút gọn phân số: chia cả tử và mẫu cho một thừa số chung.",
          chon: [
            ["Viết tử và mẫu thành tích có chung một thừa số", true, "Đúng. Vì tử, mẫu là hiệu, tổng, nên cần đặt thừa số chung."],
            ["Rút gọn " + P(4, 5) + " ở tử với " + P(2, 10) + " ở mẫu ngay", false, "Không rút gọn từng số hạng của một tổng, hiệu."]],
          dat: "Tử và mẫu có thừa số chung" },
        { hoi: "Viết từng số hạng qua luỹ thừa của 2 và 3.",
          nho: Q("x · y", "n") + " = " + P("x", "n") + " · " + P("y", "n") + "; " + Q(P("x", "m"), "n") + " = " + P("x", "m · n") + ".",
          chon: [
            [P(4, 5) + " · " + P(9, 4) + " = " + P(2, 10) + " · " + P(3, 8) + "; 2 · " + P(6, 9) + " = " + P(2, 10) + " · " + P(3, 9) + "; " + P(6, 8) + " · 20 = " + P(2, 10) + " · " + P(3, 8) + " · 5", true, "Đúng. Mọi số hạng đều có " + P(2, 10) + " · " + P(3, 8) + "."],
            ["2 · " + P(6, 9) + " = " + P(12, 9), false, "Chỉ nhân 2 với một thừa số: 2 · " + P(6, 9) + " = 2 · " + P(2, 9) + " · " + P(3, 9) + " = " + P(2, 10) + " · " + P(3, 9) + "."]],
          dat: "Mọi số hạng có thừa số " + P(2, 10) + " · " + P(3, 8) },
        { hoi: "Đặt " + P(2, 10) + " · " + P(3, 8) + " ra ngoài ở tử và mẫu, còn lại gì?",
          nho: "a · b − a · c = a · (b − c).",
          chon: [
            ["Tử: " + P(2, 10) + " · " + P(3, 8) + " · (1 − 3); mẫu: " + P(2, 10) + " · " + P(3, 8) + " · (1 + 5)", true, "Đúng. A = " + F("−2", 6) + " = " + F("−1", 3) + "."],
            ["Tử: " + P(2, 10) + " · " + P(3, 8) + " · (1 − 2)", false, P(3, 9) + " = " + P(3, 8) + " · 3, nên trong ngoặc là 1 − 3."]],
          dat: "Tử = " + P(2, 10) + " · " + P(3, 8) + " · (−2), mẫu = " + P(2, 10) + " · " + P(3, 8) + " · 6" }] }],
      nhin: [
        ["Kiểm tra bằng máy tính cầm tay (tính tử và mẫu).", "Tử = 1024 · 6561 − 2 · 10 077 696 = 6 718 464 − 20 155 392 = −13 436 928; mẫu = 6 718 464 + 1 679 616 · 20 = 40 310 784. Thương = " + F("−1", 3) + ". Đúng."],
        ["Bài tương tự: tính " + F(P(2, 12) + " · " + P(3, 5) + " − " + P(4, 6) + " · " + P(9, 2), Q("2<sup>2</sup> · 3", 6) + " + " + P(8, 4) + " · " + P(3, 5)) + ".", "Tử = " + P(2, 12) + " · " + P(3, 4) + " · (3 − 1); mẫu = " + P(2, 12) + " · " + P(3, 5) + " · (3 + 1). Kết quả " + F(1, 6) + "."]],
      steps: [
        "Tử: " + P(4, 5) + " · " + P(9, 4) + " = " + P(2, 10) + " · " + P(3, 8) + ";  2 · " + P(6, 9) + " = 2 · " + P(2, 9) + " · " + P(3, 9) + " = " + P(2, 10) + " · " + P(3, 9) + ".",
        "Tử = " + P(2, 10) + " · " + P(3, 8) + " − " + P(2, 10) + " · " + P(3, 9) + " = " + P(2, 10) + " · " + P(3, 8) + " · (1 − 3) = " + P(2, 10) + " · " + P(3, 8) + " · (−2).",
        "Mẫu: " + P(6, 8) + " · 20 = " + P(2, 8) + " · " + P(3, 8) + " · " + P(2, 2) + " · 5 = " + P(2, 10) + " · " + P(3, 8) + " · 5. Mẫu = " + P(2, 10) + " · " + P(3, 8) + " · (1 + 5) = " + P(2, 10) + " · " + P(3, 8) + " · 6.",
        "A = " + F(P(2, 10) + " · " + P(3, 8) + " · (−2)", P(2, 10) + " · " + P(3, 8) + " · 6") + " = " + F("−2", 6) + " = " + F("−1", 3) + "."
      ],
      dap: "A = " + F("−1", 3) + "."
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Cho S = " + F(1, 3) + " + " + F(1, P(3, 2)) + " + " + F(1, P(3, 3)) + " + … + " + F(1, P(3, 50)) + ".<br>a) Tính S.<br>b) Chứng minh S < " + F(1, 2) + ".",
      goi: "Nhân S với 3 rồi lấy 3S − S: các số hạng giống nhau triệt tiêu.",
      hieu: { gt: "S là tổng 50 số hạng, số hạng sau bằng " + F(1, 3) + " số hạng trước.", kl: "a) Tính S. b) S < " + F(1, 2) + ".",
        hoi: [
          ["Số hạng sau bằng số hạng trước nhân với bao nhiêu?", "Nhân với " + F(1, 3) + ". Ngược lại, nhân một số hạng với 3 thì được số hạng đứng trước nó."],
          ["3S gồm những số hạng nào?", "3S = 1 + " + F(1, 3) + " + " + F(1, P(3, 2)) + " + … + " + F(1, P(3, 49)) + ": gần giống S, chỉ khác số đầu và số cuối."]] },
      nguoc: [
      { ten: "Câu a", dich: "Tính S",
        sd: [["S = (1 − " + F(1, P(3, 50)) + ") : 2", [3]], ["2S = 3S − S = 1 − " + F(1, P(3, 50)), [2]], ["3S = 1 + " + F(1, 3) + " + … + " + F(1, P(3, 49)), [1]]],
        gt: "Các số hạng là luỹ thừa của " + F(1, 3),
        ket: "S = " + F("1 − " + F(1, P(3, 50)), 2) + " = " + F(1, 2) + " − " + F(1, "2 · " + P(3, 50)) + ".",
        buoc: [
        { hoi: "Có 50 số hạng khác mẫu. Thay vì quy đồng, ta nhân S với số nào để được một tổng \"gần giống\" S?",
          nho: "3 · " + F(1, P(3, "k")) + " = " + F(1, P(3, "k − 1")) + ".",
          chon: [
            ["Nhân với 3: 3S = 1 + " + F(1, 3) + " + … + " + F(1, P(3, 49)), true, "Đúng. 3S và S có chung 49 số hạng."],
            ["Nhân với " + F(1, 3), false, "Cũng được nhưng ra tổng lệch về phía số hạng nhỏ hơn; nhân với 3 gọn hơn."]],
          dat: "3S = 1 + " + F(1, 3) + " + … + " + F(1, P(3, 49)) },
        { hoi: "Lấy 3S − S. Các số hạng nào triệt tiêu, còn lại gì?",
          nho: "Quy tắc dấu ngoặc.",
          chon: [
            ["Các số hạng từ " + F(1, 3) + " đến " + F(1, P(3, 49)) + " triệt tiêu, còn 2S = 1 − " + F(1, P(3, 50)), true, "Đúng. Suy ra S = (1 − " + F(1, P(3, 50)) + ") : 2."],
            ["Còn 2S = 1", false, "Số hạng cuối " + F(1, P(3, 50)) + " của S không có trong 3S, nên không triệt tiêu."]],
          dat: "2S = 1 − " + F(1, P(3, 50)) }] },
      { ten: "Câu b", dich: "S < " + F(1, 2),
        sd: [["S = " + F(1, 2) + " − " + F(1, "2 · " + P(3, 50)) + " mà " + F(1, "2 · " + P(3, 50)) + " > 0", [4]]],
        gt: "Kết quả câu a",
        ket: "S bằng " + F(1, 2) + " trừ đi một số dương nên S < " + F(1, 2) + ".",
        buoc: [
        { hoi: "Từ S = (1 − " + F(1, P(3, 50)) + ") : 2, so S với " + F(1, 2) + " thế nào?",
          nho: "a − b < a khi b > 0.",
          chon: [
            ["S = " + F(1, 2) + " − " + F(1, "2 · " + P(3, 50)) + " < " + F(1, 2) + " vì số trừ dương", true, "Đúng."],
            ["Tính S ra số thập phân", false, P(3, 50) + " quá lớn để tính tay; chỉ cần dấu của phần bị trừ."]],
          dat: "S = " + F(1, 2) + " − (một số dương)" }] }],
      nhin: [
        ["Thử với tổng ngắn: " + F(1, 3) + " + " + F(1, 9) + " có bằng (1 − " + F(1, 9) + ") : 2 không?", F(1, 3) + " + " + F(1, 9) + " = " + F(4, 9) + "; (1 − " + F(1, 9) + ") : 2 = " + F(8, 9) + " : 2 = " + F(4, 9) + ". Đúng."],
        ["Tổng quát: tính 1 + 2 + " + P(2, 2) + " + … + " + P(2, 100) + ".", "Gọi T là tổng: 2T − T = " + P(2, 101) + " − 1, nên T = " + P(2, 101) + " − 1."]],
      steps: [
        "a) 3S = 3 · (" + F(1, 3) + " + " + F(1, P(3, 2)) + " + … + " + F(1, P(3, 50)) + ") = 1 + " + F(1, 3) + " + " + F(1, P(3, 2)) + " + … + " + F(1, P(3, 49)) + ".",
        "3S − S = (1 + " + F(1, 3) + " + … + " + F(1, P(3, 49)) + ") − (" + F(1, 3) + " + … + " + F(1, P(3, 49)) + " + " + F(1, P(3, 50)) + ") = 1 − " + F(1, P(3, 50)) + ".",
        "Do đó 2S = 1 − " + F(1, P(3, 50)) + ", S = " + F("1 − " + F(1, P(3, 50)), 2) + " = " + F(P(3, 50) + " − 1", "2 · " + P(3, 50)) + ".",
        "b) S = " + F(1, 2) + " − " + F(1, "2 · " + P(3, 50)) + ", mà " + F(1, "2 · " + P(3, 50)) + " > 0, nên S < " + F(1, 2) + "."
      ],
      dap: "a) S = " + F(P(3, 50) + " − 1", "2 · " + P(3, 50)) + ". b) S < " + F(1, 2) + ".",
      mix: [2]
    },
    {
      id: "hsg3", lv: "HSG",
      de: "a) Tìm số tự nhiên x, biết " + P(2, "x") + " + " + P(2, "x + 3") + " = 144.<br>b) Chứng minh " + P(8, 7) + " − " + P(2, 18) + " chia hết cho 14.",
      goi: "a) " + P(2, "x + 3") + " = " + P(2, "x") + " · 8. b) Viết " + P(8, 7) + " thành luỹ thừa của 2, rồi đặt thừa số chung; 14 = 2 · 7.",
      hieu: { gt: "a) " + P(2, "x") + " + " + P(2, "x + 3") + " = 144, x ∈ ℕ. b) Số " + P(8, 7) + " − " + P(2, 18) + ".", kl: "a) Tìm x. b) " + P(8, 7) + " − " + P(2, 18) + " chia hết cho 14.",
        hoi: [
          ["Câu b: có nên tính " + P(8, 7) + " và " + P(2, 18) + " ra rồi chia không?", "Tính được nhưng số lớn (" + P(8, 7) + " = 2 097 152). Cách hay hơn là viết hiệu thành tích có thừa số 14."],
          ["14 viết thành tích của hai số nguyên tố nào?", "14 = 2 · 7. Cần chỉ ra hiệu có thừa số 2 và thừa số 7."]] },
      nguoc: [
      { ten: "Câu a", dich: "Tìm x",
        sd: [[P(2, "x") + " = 16 = " + P(2, 4), [2]], [P(2, "x") + " · (1 + 8) = 144", [1]]],
        gt: P(2, "x + 3") + " = " + P(2, "x") + " · " + P(2, 3),
        ket: "9 · " + P(2, "x") + " = 144, " + P(2, "x") + " = 16 = " + P(2, 4) + ", x = 4.",
        buoc: [
        { hoi: "Làm sao để x chỉ còn ở một luỹ thừa?",
          nho: P("a", "m + n") + " = " + P("a", "m") + " · " + P("a", "n") + ".",
          chon: [
            ["Viết " + P(2, "x + 3") + " = 8 · " + P(2, "x") + ", đặt " + P(2, "x") + " chung: " + P(2, "x") + " · 9 = 144", true, "Đúng. " + P(2, "x") + " = 16."],
            [P(2, "x") + " + " + P(2, "x + 3") + " = " + P(2, "2x + 3"), false, "Cộng hai luỹ thừa không phải là cộng số mũ."]],
          dat: P(2, "x") + " · 9 = 144" }] },
      { ten: "Câu b", dich: P(8, 7) + " − " + P(2, 18) + " chia hết cho 14",
        sd: [["Hiệu = " + P(2, 17) + " · 14", [4]], ["Hiệu = " + P(2, 18) + " · (8 − 1) = " + P(2, 18) + " · 7", [3]], [P(8, 7) + " = " + P(2, 21) + " = " + P(2, 18) + " · 8", [3]]],
        gt: "8 = " + P(2, 3) + ", 14 = 2 · 7",
        ket: P(8, 7) + " − " + P(2, 18) + " = " + P(2, 18) + " · 7 = " + P(2, 17) + " · 14, chia hết cho 14.",
        buoc: [
        { hoi: "Muốn chứng minh một số chia hết cho 14, cách gọn là gì?",
          nho: "Nếu a = 14 · k (k là số tự nhiên) thì a chia hết cho 14.",
          chon: [
            ["Viết số đó thành tích có một thừa số là 14", true, "Đúng. Ta biến đổi hiệu thành tích."],
            ["Xét chữ số tận cùng", false, "Không có dấu hiệu chia hết cho 14 bằng chữ số tận cùng."]],
          dat: "Viết hiệu thành 14 · k" },
        { hoi: "Biến đổi " + P(8, 7) + " − " + P(2, 18) + " thành tích thế nào?",
          nho: Q(P("x", "m"), "n") + " = " + P("x", "m · n") + "; a · b − a = a · (b − 1).",
          chon: [
            [P(8, 7) + " = " + P(2, 21) + " = " + P(2, 18) + " · 8, nên hiệu = " + P(2, 18) + " · (8 − 1) = " + P(2, 18) + " · 7", true, "Đúng. " + P(2, 18) + " · 7 = " + P(2, 17) + " · 2 · 7 = " + P(2, 17) + " · 14."],
            [P(8, 7) + " − " + P(2, 18) + " = " + P(6, "−11"), false, "Không trừ cơ số và số mũ như vậy."]],
          dat: P(8, 7) + " − " + P(2, 18) + " = " + P(2, 18) + " · 7" }] }],
      nhin: [
        ["Thử lại câu a với x = 4.", P(2, 4) + " + " + P(2, 7) + " = 16 + 128 = 144. Đúng."],
        ["Câu b: hiệu còn chia hết cho số nào lớn hơn 14?", "Hiệu = " + P(2, 18) + " · 7 nên chia hết cho 7 · " + P(2, "k") + " với k ≤ 18, chẳng hạn chia hết cho 28, 56, 112."]],
      steps: [
        "a) " + P(2, "x") + " + " + P(2, "x + 3") + " = " + P(2, "x") + " + " + P(2, "x") + " · " + P(2, 3) + " = " + P(2, "x") + " · (1 + 8) = 9 · " + P(2, "x") + ".",
        "9 · " + P(2, "x") + " = 144 nên " + P(2, "x") + " = 144 : 9 = 16 = " + P(2, 4) + ". Vậy x = 4.",
        "b) " + P(8, 7) + " = " + Q(P(2, 3), 7) + " = " + P(2, 21) + ", nên " + P(8, 7) + " − " + P(2, 18) + " = " + P(2, 21) + " − " + P(2, 18) + " = " + P(2, 18) + " · (" + P(2, 3) + " − 1) = " + P(2, 18) + " · 7.",
        P(2, 18) + " · 7 = " + P(2, 17) + " · 2 · 7 = " + P(2, 17) + " · 14, chia hết cho 14."
      ],
      dap: "a) x = 4. b) " + P(8, 7) + " − " + P(2, 18) + " = " + P(2, 17) + " · 14 chia hết cho 14."
    }
  ];

  window.TL_DATA = {
    bai: "lt7",
    ten: "Bài 3. Luỹ thừa với số mũ tự nhiên của một số hữu tỉ",
    items: ITEMS,
    dang: [
      { ten: "Tính luỹ thừa, dấu của luỹ thừa",
        pp: ["Dùng định nghĩa: " + P("x", "n") + " là tích của n thừa số x; " + Q(F("a", "b"), "n") + " = " + F(P("a", "n"), P("b", "n")) + ". Quy ước " + P("x", 0) + " = 1 (x ≠ 0), " + P("x", 1) + " = x.",
             "Đổi hỗn số, số thập phân ra phân số (hoặc giữ số thập phân nếu dễ tính).",
             "Dấu: luỹ thừa bậc chẵn của số âm là số dương, bậc lẻ là số âm. Chú ý " + Q("−a", "n") + " khác −" + P("a", "n") + "."],
        ids: ["nb1", "th1"],
        tl: [
          ["Tính " + Q(F("−3", 2), 3) + " và " + Q("−0,2", 4) + ".", "Số mũ lẻ thì giữ dấu âm, số mũ chẵn thì ra số dương.", F("−27", 8) + " và 0,0016."],
          ["Tính " + Q("−1", 2023) + " · " + Q(F("−2", 3), 2) + ".", Q("−1", 2023) + " = −1.", F("−4", 9) + "."]] },
      { ten: "Viết dưới dạng một luỹ thừa",
        pp: ["Đưa các luỹ thừa về cùng cơ số (4 = " + P(2, 2) + ", 27 = " + P(3, 3) + ", 0,25 = " + F(1, 4) + ", …).",
             "Nhân: " + P("x", "m") + " · " + P("x", "n") + " = " + P("x", "m + n") + ". Chia: " + P("x", "m") + " : " + P("x", "n") + " = " + P("x", "m − n") + " (x ≠ 0, m ≥ n).",
             "Luỹ thừa của luỹ thừa: " + Q(P("x", "m"), "n") + " = " + P("x", "m · n") + ".",
             "Không cộng, trừ số mũ khi cộng, trừ hai luỹ thừa."],
        ids: ["nb2", "th2", "vd1"],
        tl: [
          ["Viết dưới dạng một luỹ thừa: " + Q(F("−1", 3), 4) + " · " + Q(F("−1", 3), 5) + ".", "Cùng cơ số, cộng số mũ.", Q(F("−1", 3), 9) + "."],
          ["Viết " + P(25, 4) + " · 125 dưới dạng luỹ thừa cơ số 5.", "25 = " + P(5, 2) + ", 125 = " + P(5, 3) + ".", P(5, 11) + "."]] },
      { ten: "Tính giá trị biểu thức có luỹ thừa",
        pp: ["Thứ tự: luỹ thừa trước, rồi nhân chia, rồi cộng trừ (trong ngoặc trước).",
             "Hai luỹ thừa cùng số mũ: " + P("x", "n") + " · " + P("y", "n") + " = " + Q("x · y", "n") + ", " + P("x", "n") + " : " + P("y", "n") + " = " + Q("x : y", "n") + "; tìm các cặp có tích hoặc thương là số tròn.",
             "Biểu thức dạng phân số có tổng, hiệu: phân tích ra luỹ thừa của các số nguyên tố, đặt thừa số chung rồi rút gọn."],
        ids: ["th3", "vd2"],
        tl: [
          ["Tính " + Q(F(1, 7), 5) + " · " + P(7, 5) + " + " + Q("−0,5", 2) + ".", "Cùng số mũ 5: gộp cơ số.", "1,25."],
          ["Tính " + P(72, 3) + " : " + P(24, 3) + ".", "Gộp: " + Q("72 : 24", 3) + ".", "27."]] },
      { ten: "Tìm x, so sánh luỹ thừa",
        pp: ["Tìm x ở cơ số: viết vế còn lại thành luỹ thừa cùng số mũ. Số mũ chẵn có hai trường hợp (hai số đối nhau).",
             "Tìm x ở số mũ: viết hai vế thành luỹ thừa cùng cơ số rồi cho hai số mũ bằng nhau; có tổng, hiệu thì đặt luỹ thừa chung.",
             "So sánh: đưa về cùng số mũ (so sánh cơ số) hoặc cùng cơ số (so sánh số mũ). Với cơ số dương nhỏ hơn 1, số mũ lớn hơn thì luỹ thừa nhỏ hơn."],
        ids: ["nb3", "vd3", "vd4"],
        tl: [
          ["Tìm x, biết " + Q("2x − 1", 3) + " = −27.", "−27 = " + Q("−3", 3) + ".", "x = −1."],
          ["Tìm số tự nhiên x, biết " + Q(F(2, 3), "x") + " = " + F(16, 81) + ".", F(16, 81) + " = " + Q(F(2, 3), 4) + ".", "x = 4."],
          ["So sánh " + P(3, 500) + " và " + P(7, 300) + ".", "Đưa về số mũ 100: " + P(243, 100) + " và " + P(343, 100) + ".", P(3, 500) + " < " + P(7, 300) + "."]] }
    ],
    mau: { ids: ["vd1", "vd2", "vd3"], theoPhan: { dn: "vd2", tt: "vd2", nc: "vd1", lt: "vd1" } }
  };
})();
