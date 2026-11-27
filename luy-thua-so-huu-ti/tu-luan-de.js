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
        "b) " + P(27, 3) + " : " + P(9, 2) + " = " + Q(P(3, 3), 3) + " : " + Q(P(3, 2), 2),
        "= " + P(3, 9) + " : " + P(3, 4) + " = " + P(3, 5) + ".",
        "c) 0,125 · " + P("0,5", 4) + " = " + P("0,5", 3) + " · " + P("0,5", 4) + " = " + P("0,5", 7) + " (vì 0,125 = " + P("0,5", 3) + ")."
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
        "a) A = " + P(9, 4) + " · " + P(27, 3) + " : " + P(81, 2) + " = " + Q(P(3, 2), 4) + " · " + Q(P(3, 3), 3) + " : " + Q(P(3, 4), 2),
        "= " + P(3, 8) + " · " + P(3, 9) + " : " + P(3, 8) + " = " + P(3, 17) + " : " + P(3, 8) + " = " + P(3, 9) + ".",
        "b) B = " + P("0,25", 3) + " · " + P(32, 2) + " = " + Q(F(1, 4), 3) + " · " + Q(P(2, 5), 2) + " = " + F(1, P(2, 6)) + " · " + P(2, 10),
        "= " + F(P(2, 10), P(2, 6)) + " = " + P(2, 4) + " = 16."
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
        "C = " + Q(F("−1", 3), 2) + " · " + P(3, 4) + " − " + P("0,4", 3) + " · " + Q(F(5, 2), 3) + " + " + P(2025, 0) + " = " + F(1, P(3, 2)) + " · " + P(3, 4) + " − " + Q(F(2, 5), 3) + " · " + Q(F(5, 2), 3) + " + " + P(2025, 0),
        "= " + P(3, 2) + " − " + Q(F(2, 5) + " · " + F(5, 2), 3) + " + " + P(2025, 0),
        "= 9 − " + P(1, 3) + " + 1",
        "= 9 − 1 + 1 = 9."
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
        sd: [["x ∈ {" + F(5, 6) + "; " + F(1, 6) + "}", [2, 3]], ["x − " + F(1, 2) + " = " + F(1, 3) + " hoặc x − " + F(1, 2) + " = " + F("−1", 3), [1]]],
        gt: F(1, 9) + " = " + Q(F(1, 3), 2) + " = " + Q(F("−1", 3), 2),
        ket: "x = " + F(1, 3) + " + " + F(1, 2) + " = " + F(5, 6) + " hoặc x = " + F("−1", 3) + " + " + F(1, 2) + " = " + F(1, 6) + ".",
        buoc: [
        { hoi: "Biểu thức trong ngoặc x − " + F(1, 2) + " phải bằng bao nhiêu?",
          nho: "Luỹ thừa bậc chẵn của hai số đối nhau thì bằng nhau.",
          chon: [
            ["x − " + F(1, 2) + " = " + F(1, 3) + " hoặc x − " + F(1, 2) + " = " + F("−1", 3), true, "Đúng. Đừng bỏ sót trường hợp số âm."],
            ["Chỉ x − " + F(1, 2) + " = " + F(1, 3), false, "Thiếu trường hợp " + F("−1", 3) + ": " + Q(F("−1", 3), 2) + " cũng bằng " + F(1, 9) + "."]],
          dat: "x − " + F(1, 2) + " = " + F(1, 3) + " hoặc x − " + F(1, 2) + " = " + F("−1", 3) }] },
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
        "Nếu x − " + F(1, 2) + " = " + F("−1", 3) + " thì x = " + F("−1", 3) + " + " + F(1, 2) + " = " + F(1, 6) + ". Vậy x ∈ {" + F(5, 6) + "; " + F(1, 6) + "}" + ".",
        "b) " + P(3, "x + 2") + " − " + P(3, "x") + " = " + P(3, "x") + " · " + P(3, 2) + " − " + P(3, "x") + " = " + P(3, "x") + " · (9 − 1) = 8 · " + P(3, "x") + ". Do đó 8 · " + P(3, "x") + " = 216.",
        P(3, "x") + " = 216 : 8 = 27 = " + P(3, 3) + ", nên x = 3."
      ],
      dap: "a) x ∈ {" + F(5, 6) + "; " + F(1, 6) + "}" + "; b) x = 3.",
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
      de: "So sánh " + P(2, 332) + " và " + P(3, 223) + ".",
      goi: "Hai số khác cơ số, khác số mũ. So sánh với hai số trung gian " + P(2, 333) + " và " + P(3, 222) + ", rồi đưa về cùng số mũ 111.",
      hieu: { gt: "Hai luỹ thừa " + P(2, 332) + " và " + P(3, 223) + ".", kl: "So sánh hai số.",
        hoi: [
          ["Muốn so sánh hai luỹ thừa, em thường đưa về dạng nào?", "Cùng cơ số (so sánh số mũ) hoặc cùng số mũ (so sánh cơ số)."],
          ["332 và 223 có ước chung lớn hơn 1 không? Các số gần đó thì sao?", "ƯCLN(332, 223) = 1. Nhưng 333 = 3 · 111 và 222 = 2 · 111 có chung thừa số 111."]] },
      nguoc: [
      { ten: "So sánh", dich: "So sánh " + P(2, 332) + " và " + P(3, 223),
        sd: [[P(2, 332) + " < " + P(2, 333) + " = " + P(8, 111) + " < " + P(9, 111) + " = " + P(3, 222) + " < " + P(3, 223), [3]], [P(2, 333) + " = " + P(8, 111) + ", " + P(3, 222) + " = " + P(9, 111), [1, 2]]],
        gt: "333 = 3 · 111, 222 = 2 · 111",
        ket: P(2, 332) + " < " + P(3, 223) + ".",
        buoc: [
        { hoi: "Số mũ 332 và 223 không có ước chung lớn hơn 1. Làm sao để đưa về cùng số mũ?",
          nho: P("a", "m · n") + " = " + Q(P("a", "m"), "n") + ".",
          chon: [
            ["Dùng số trung gian: " + P(2, 332) + " < " + P(2, 333) + " và " + P(3, 223) + " > " + P(3, 222) + "; 333 và 222 cùng chia hết cho 111", true, "Đúng. " + P(2, 333) + " = " + Q(P(2, 3), 111) + " = " + P(8, 111) + ", " + P(3, 222) + " = " + Q(P(3, 2), 111) + " = " + P(9, 111) + "."],
            ["Chia cả hai số cho " + P(2, 223), false, P(3, 223) + " không chia hết cho 2; cách này không dẫn tới kết quả."]],
          dat: P(2, 333) + " = " + P(8, 111) + ", " + P(3, 222) + " = " + P(9, 111) },
        { hoi: "So sánh " + P(8, 111) + " và " + P(9, 111) + ", rồi ghép thành chuỗi bất đẳng thức.",
          nho: "Hai luỹ thừa cùng số mũ tự nhiên khác 0, cơ số dương: cơ số lớn hơn thì luỹ thừa lớn hơn.",
          chon: [
            [P(2, 332) + " < " + P(2, 333) + " = " + P(8, 111) + " < " + P(9, 111) + " = " + P(3, 222) + " < " + P(3, 223), true, "Đúng. Vậy " + P(2, 332) + " < " + P(3, 223) + "."],
            [P(2, 332) + " > " + P(3, 223) + " vì 332 > 223", false, "Cơ số khác nhau thì không so sánh được chỉ bằng số mũ: 2 < 3."]],
          dat: P(8, 111) + " < " + P(9, 111) }] }],
      nhin: [
        ["Vì sao chọn số trung gian " + P(2, 333) + " (lớn hơn " + P(2, 332) + ") mà không chọn " + P(2, 331) + "?", "Vì ta cần " + P(2, 332) + " nhỏ hơn một số, số đó lại nhỏ hơn " + P(3, 223) + ". Chọn số nhỏ hơn " + P(2, 332) + " thì không suy ra được gì."],
        ["Bài tương tự: so sánh " + P(5, 299) + " và " + P(3, 501) + ".", P(5, 299) + " < " + P(5, 300) + " = " + P(125, 100) + " < " + P(243, 100) + " = " + P(3, 500) + " < " + P(3, 501) + ". Vậy " + P(5, 299) + " < " + P(3, 501) + "."]],
      steps: [
        "Ta có " + P(2, 332) + " < " + P(2, 333) + " = " + P(2, "3 · 111") + " = " + Q(P(2, 3), 111) + " = " + P(8, 111) + ".",
        "Và " + P(3, 223) + " > " + P(3, 222) + " = " + P(3, "2 · 111") + " = " + Q(P(3, 2), 111) + " = " + P(9, 111) + ".",
        "Vì 8 < 9 nên " + P(8, 111) + " < " + P(9, 111) + ". Do đó " + P(2, 332) + " < " + P(8, 111) + " < " + P(9, 111) + " < " + P(3, 223) + ". Vậy " + P(2, 332) + " < " + P(3, 223) + "."
      ],
      dap: P(2, 332) + " < " + P(3, 223) + ".",
      loi: "Kết luận " + P(2, 332) + " > " + P(3, 223) + " vì số mũ lớn hơn; hoặc chọn số trung gian sai chiều."
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Tìm các số tự nhiên x, y biết: " + P(2, "x") + " + 624 = " + P(5, "y") + ".",
      goi: "Xét tính chẵn, lẻ của hai vế. " + P(5, "y") + " luôn là số lẻ.",
      hieu: { gt: "x, y là số tự nhiên, " + P(2, "x") + " + 624 = " + P(5, "y") + ".", kl: "Tìm x, y.",
        hoi: [
          ["Một đẳng thức mà có hai số chưa biết. Thử đoán: y nhỏ nhất bằng bao nhiêu thì " + P(5, "y") + " > 624?", P(5, 4) + " = 625 > 624, " + P(5, 3) + " = 125 < 624. Nên y ≥ 4."],
          [P(5, "y") + " là số chẵn hay lẻ? " + P(2, "x") + " thì sao?", P(5, "y") + " là tích các số lẻ nên lẻ. " + P(2, "x") + " chẵn khi x ≥ 1, bằng 1 khi x = 0."]] },
      nguoc: [
      { ten: "Tìm x, y", dich: "Tìm x, y",
        sd: [["x = 0, " + P(5, "y") + " = 625 = " + P(5, 4), [2, 3]], ["Nếu x ≥ 1 thì vế trái chẵn, vế phải lẻ: vô lí", [1]]],
        gt: P(5, "y") + " là số lẻ, 624 là số chẵn",
        ket: "(x; y) = (0; 4).",
        buoc: [
        { hoi: "Hai số chưa biết mà chỉ có một đẳng thức. Tính chất nào của hai vế giúp loại bớt trường hợp?",
          nho: "Tổng hai số chẵn là số chẵn; tích các số lẻ là số lẻ.",
          chon: [
            ["Tính chẵn, lẻ: " + P(5, "y") + " luôn lẻ; nếu x ≥ 1 thì " + P(2, "x") + " + 624 chẵn", true, "Đúng. Vậy x ≥ 1 không xảy ra, chỉ còn x = 0."],
            ["Thử lần lượt x = 1, 2, 3, …", false, "Thử mãi không hết; phải có lí do để dừng."]],
          dat: "x = 0" },
        { hoi: "Với x = 0, tìm y.",
          nho: P(2, 0) + " = 1.",
          chon: [
            [P(5, "y") + " = 1 + 624 = 625 = " + P(5, 4) + ", nên y = 4", true, "Đúng."],
            [P(5, "y") + " = 624", false, P(2, 0) + " = 1 chứ không phải 0."]],
          dat: P(5, "y") + " = 625" }] }],
      nhin: [
        ["Thử lại (x; y) = (0; 4).", P(2, 0) + " + 624 = 1 + 624 = 625 = " + P(5, 4) + ". Đúng."],
        ["Bài tương tự: tìm số tự nhiên x, y biết " + P(2, "x") + " + 242 = " + P(3, "y") + ".", "Nếu x ≥ 1 thì vế trái chẵn, vế phải lẻ: vô lí. Vậy x = 0, " + P(3, "y") + " = 243 = " + P(3, 5) + ", y = 5: (x; y) = (0; 5)."]],
      steps: [
        "Với mọi số tự nhiên y, " + P(5, "y") + " là số lẻ.",
        "Nếu x ≥ 1 thì " + P(2, "x") + " là số chẵn, 624 là số chẵn nên " + P(2, "x") + " + 624 là số chẵn, khác số lẻ " + P(5, "y") + ": vô lí. Do đó x = 0.",
        "Với x = 0: " + P(5, "y") + " = " + P(2, 0) + " + 624 = 1 + 624 = 625 = " + P(5, 4) + ", nên y = 4.",
        "Vậy (x; y) = (0; 4)."
      ],
      dap: "(x; y) = (0; 4).",
      loi: "Quên trường hợp x = 0; hoặc cho " + P(2, 0) + " = 0."
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Cho A = 3 + " + P(3, 2) + " + " + P(3, 3) + " + … + " + P(3, 102) + ".<br>a) Tìm số tự nhiên n biết 2A + 3 = " + P(3, "n") + ".<br>b) Chứng minh A chia hết cho 13.",
      goi: "a) Tính 3A rồi lấy 3A − A. b) Nhóm ba số hạng liên tiếp: 3 + " + P(3, 2) + " + " + P(3, 3) + " = 39 = 3 · 13.",
      hieu: { gt: "A = 3 + " + P(3, 2) + " + … + " + P(3, 102) + " (102 số hạng).", kl: "a) n để 2A + 3 = " + P(3, "n") + ". b) A chia hết cho 13.",
        hoi: [
          ["Nhân A với 3 thì được tổng nào? So với A có gì giống nhau?", "3A = " + P(3, 2) + " + " + P(3, 3) + " + … + " + P(3, 103) + ": giống A từ " + P(3, 2) + " đến " + P(3, 102) + "."],
          ["A có 102 số hạng. 102 chia hết cho những số nào nhỏ?", "102 = 2 · 51 = 3 · 34 = 6 · 17. Có thể nhóm 2, 3 hoặc 6 số hạng một."]] },
      nguoc: [
      { ten: "Câu a", dich: "Tìm n",
        sd: [["2A + 3 = " + P(3, 103) + ", nên n = 103", [2]], ["3A − A = " + P(3, 103) + " − 3", [1]]],
        gt: "A = 3 + " + P(3, 2) + " + … + " + P(3, 102),
        ket: "n = 103.",
        buoc: [
        { hoi: "Không cộng trực tiếp được 102 luỹ thừa. Làm sao rút gọn A?",
          nho: P(3, "k") + " · 3 = " + P(3, "k + 1") + ".",
          chon: [
            ["Tính 3A = " + P(3, 2) + " + … + " + P(3, 103) + " rồi lấy 3A − A: các số hạng chung triệt tiêu", true, "Đúng: 2A = " + P(3, 103) + " − 3."],
            ["Đặt 3 ra ngoài: A = 3 · (1 + 3 + … + " + P(3, 101) + ")", false, "Đúng nhưng trong ngoặc vẫn còn 102 số hạng; chưa rút gọn được."]],
          dat: "2A = " + P(3, 103) + " − 3" }] },
      { ten: "Câu b", dich: "A chia hết cho 13",
        sd: [["A = 13 · (3 + " + P(3, 4) + " + … + " + P(3, 100) + ")", [4]], ["Nhóm ba số hạng: " + P(3, "k") + " + " + P(3, "k + 1") + " + " + P(3, "k + 2") + " = " + P(3, "k") + " · 13", [3]]],
        gt: "1 + 3 + " + P(3, 2) + " = 13; 102 = 3 · 34",
        ket: "A là tổng 34 nhóm, mỗi nhóm chia hết cho 13.",
        buoc: [
        { hoi: "Muốn có thừa số 13, em nhóm các số hạng thế nào?",
          nho: "1 + 3 + 9 = 13.",
          chon: [
            ["Nhóm ba số hạng liên tiếp: (3 + " + P(3, 2) + " + " + P(3, 3) + ") + (" + P(3, 4) + " + " + P(3, 5) + " + " + P(3, 6) + ") + …; 102 số hạng vừa đủ 34 nhóm", true, "Đúng. Mỗi nhóm " + P(3, "k") + " · (1 + 3 + 9) = " + P(3, "k") + " · 13."],
            ["Nhóm hai số hạng liên tiếp", false, "Mỗi nhóm hai số hạng là " + P(3, "k") + " · 4: cho A chia hết cho 4, không phải 13."]],
          dat: "34 nhóm, mỗi nhóm " + P(3, "k") + " · 13" }] }],
      nhin: [
        ["Kiểm tra câu a với tổng ngắn: 3 + " + P(3, 2) + " + " + P(3, 3) + ".", "Tổng bằng 39; 2 · 39 + 3 = 81 = " + P(3, 4) + ". Đúng quy luật: số mũ cuối cộng thêm 1."],
        ["A còn chia hết cho số nào khác? Thử nhóm hai số hạng.", "3 + " + P(3, 2) + " = 12, mỗi nhóm hai số hạng là " + P(3, "k") + " · 4; 102 số hạng thành 51 nhóm, nên A chia hết cho 4 (và cho 12, 39)."]],
      steps: [
        "a) 3A = " + P(3, 2) + " + " + P(3, 3) + " + … + " + P(3, 102) + " + " + P(3, 103) + ".",
        "3A − A = (" + P(3, 2) + " + … + " + P(3, 103) + ") − (3 + " + P(3, 2) + " + … + " + P(3, 102) + ") = " + P(3, 103) + " − 3. Do đó 2A = " + P(3, 103) + " − 3, nên 2A + 3 = " + P(3, 103) + ". Vậy n = 103.",
        "b) A có 102 số hạng, 102 = 3 · 34. Nhóm ba số hạng liên tiếp: A = (3 + " + P(3, 2) + " + " + P(3, 3) + ") + (" + P(3, 4) + " + " + P(3, 5) + " + " + P(3, 6) + ") + … + (" + P(3, 100) + " + " + P(3, 101) + " + " + P(3, 102) + ").",
        "= 3 · (1 + 3 + 9) + " + P(3, 4) + " · (1 + 3 + 9) + … + " + P(3, 100) + " · (1 + 3 + 9) = 13 · (3 + " + P(3, 4) + " + … + " + P(3, 100) + "). Vậy A chia hết cho 13."
      ],
      dap: "a) n = 103. b) Đã chứng minh.",
      loi: "Viết 3A − A = " + P(3, 103) + " (quên trừ 3); hoặc nhóm hai số hạng rồi kết luận chia hết cho 13."
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
