/* Bài tập tự luận – Bài tập cuối chương I (Toán 7, Kết nối tri thức).
   Chia theo dạng như Bài 16 (thầy chốt lại 27/11/2026), khai báo ở TL_DATA.dang; cuối mỗi dạng có bài tự luyện; mục Dành cho HSG riêng, giải theo 4 bước.
   Dùng kiến thức Bài 1 đến Bài 4 (số hữu tỉ, các phép tính, luỹ thừa, thứ tự thực hiện phép tính, quy tắc chuyển vế).
   Chưa học giá trị tuyệt đối, căn bậc hai.
   Mỗi bài: id, lv, de, goi, steps, dap, loi, mix (các bài trong chương được dùng); pt (phân tích ngược) cho bài Thông hiểu, Vận dụng;
   bài mẫu và bài HSG có hieu, nguoc, nhin (4 bước). */
(function () {
  "use strict";
  var F = function (n, d) { return '<span class="fr"><span>' + n + "</span><span>" + d + "</span></span>"; };
  var P = function (b, e) { return b + "<sup>" + e + "</sup>"; };
  var Q = function (b, e) { return "(" + b + ")<sup>" + e + "</sup>"; };

  var ITEMS = [
    /* ================= NHẬN BIẾT ================= */
    {
      id: "nb1", lv: "NB", mix: [1],
      de: "a) Tìm số đối của " + F("−2", 5) + " và của 1,3.<br>b) So sánh " + F("−3", 4) + " và −0,7.",
      goi: "Số đối: chỉ đổi dấu. So sánh: đưa hai số về cùng dạng số thập phân (hoặc cùng dạng phân số).",
      steps: [
        "a) Số đối của " + F("−2", 5) + " là " + F(2, 5) + "; số đối của 1,3 là −1,3.",
        "b) " + F("−3", 4) + " = −0,75. Hai số âm −0,75 và −0,7 có số đối 0,75 > 0,7, nên −0,75 < −0,7.",
        "Vậy " + F("−3", 4) + " < −0,7."
      ],
      dap: "a) " + F(2, 5) + "; −1,3. b) " + F("−3", 4) + " < −0,7.",
      loi: "Thấy 0,75 > 0,7 rồi kết luận luôn " + F("−3", 4) + " > −0,7 (quên đổi chiều với số âm)."
    },
    {
      id: "nb2", lv: "NB", mix: [2],
      de: "Tính:<br>a) " + F("−1", 2) + " + " + F(3, 4) + ";  b) 0,4 − " + F(7, 5) + ";  c) " + F("−2", 3) + " · " + F(9, 4) + ";  d) " + F("−5", 6) + " : " + F("−10", 3) + ".",
      goi: "Cộng, trừ: quy đồng mẫu (đổi số thập phân ra phân số). Nhân: tử nhân tử, mẫu nhân mẫu. Chia: nhân với số nghịch đảo.",
      steps: [
        "a) " + F("−1", 2) + " + " + F(3, 4) + " = " + F("−2", 4) + " + " + F(3, 4) + " = " + F(1, 4) + ".",
        "b) 0,4 − " + F(7, 5) + " = " + F(2, 5) + " − " + F(7, 5) + " = " + F("−5", 5) + " = −1.",
        "c) " + F("−2", 3) + " · " + F(9, 4) + " = " + F("(−2) · 9", "3 · 4") + " = " + F("−3", 2) + ".",
        "d) " + F("−5", 6) + " : " + F("−10", 3) + " = " + F("−5", 6) + " · " + F(3, "−10") + " = " + F(15, 60) + " = " + F(1, 4) + "."
      ],
      dap: "a) " + F(1, 4) + "; b) −1; c) " + F("−3", 2) + "; d) " + F(1, 4) + ".",
      loi: "Câu d nhân với " + F("−10", 3) + " thay vì nhân với số nghịch đảo " + F(3, "−10") + "."
    },
    {
      id: "nb3", lv: "NB", mix: [3],
      de: "Tính:<br>a) " + Q(F("−2", 3), 3) + ";  b) " + Q("1,5", 2) + ";  c) " + Q(F("−7", 9), 0) + ";  d) " + P(2, 5) + " : " + P(2, 3) + ".",
      goi: "Luỹ thừa của phân số: luỹ thừa tử và luỹ thừa mẫu. Mọi số khác 0 mũ 0 bằng 1. Chia hai luỹ thừa cùng cơ số: giữ cơ số, trừ số mũ.",
      steps: [
        "a) " + Q(F("−2", 3), 3) + " = " + F(Q("−2", 3), P(3, 3)) + " = " + F("−8", 27) + ".",
        "b) " + Q("1,5", 2) + " = 1,5 · 1,5 = 2,25.",
        "c) " + Q(F("−7", 9), 0) + " = 1.",
        "d) " + P(2, 5) + " : " + P(2, 3) + " = " + P(2, "5 − 3") + " = " + P(2, 2) + " = 4."
      ],
      dap: "a) " + F("−8", 27) + "; b) 2,25; c) 1; d) 4.",
      loi: "Tính " + Q("1,5", 2) + " = 3 (lấy cơ số nhân số mũ); ghi " + Q(F("−7", 9), 0) + " = 0."
    },

    /* ================= THÔNG HIỂU ================= */
    {
      id: "th1", lv: "TH", mix: [2, 3, 4],
      de: "Tính giá trị của biểu thức:<br>a) A = " + F(3, 4) + " − " + Q(F(1, 2), 2) + " · 2 + 1;<br>b) B = (−0,5 + " + F(3, 4) + ") : " + F(1, 8) + " − 3.",
      goi: "Thứ tự: trong ngoặc trước; rồi luỹ thừa; rồi nhân, chia; cuối cùng cộng, trừ từ trái sang phải.",
      pt: [
        { ten: "Câu a", dich: "Tính A", sd: [["Cộng, trừ từ trái sang phải", [2]], ["Tính luỹ thừa rồi phép nhân: " + Q(F(1, 2), 2) + " · 2", [1]]], gt: "Biểu thức có luỹ thừa, nhân, cộng, trừ" },
        { ten: "Câu b", dich: "Tính B", sd: [["Chia rồi trừ 3", [4]], ["Tính trong ngoặc: −0,5 + " + F(3, 4), [3]]], gt: "Biểu thức có ngoặc, chia, trừ" }],
      steps: [
        "a) A = " + F(3, 4) + " − " + Q(F(1, 2), 2) + " · 2 + 1 = " + F(3, 4) + " − " + F(1, 4) + " · 2 + 1 = " + F(3, 4) + " − " + F(1, 2) + " + 1",
        "= " + F(3, 4) + " − " + F(2, 4) + " + " + F(4, 4) + " = " + F(5, 4) + ".",
        "b) B = (−0,5 + " + F(3, 4) + ") : " + F(1, 8) + " − 3 = (" + F("−2", 4) + " + " + F(3, 4) + ") : " + F(1, 8) + " − 3 = " + F(1, 4) + " : " + F(1, 8) + " − 3",
        "= " + F(1, 4) + " · 8 − 3 = 2 − 3 = −1."
      ],
      dap: "A = " + F(5, 4) + "; B = −1.",
      loi: "Câu a làm từ trái sang phải: (" + F(3, 4) + " − " + F(1, 4) + ") · 2 + 1, sai thứ tự phép tính."
    },
    {
      id: "th2", lv: "TH", mix: [2],
      de: "Tính một cách hợp lí:<br>a) C = " + F(5, 7) + " · " + F(4, 9) + " + " + F(5, 7) + " · " + F(5, 9) + " − " + F(2, 7) + ";<br>b) D = (−0,25) · " + F("−7", 13) + " · 4.",
      goi: "a) Hai tích đầu có chung thừa số " + F(5, 7) + ": dùng tính chất phân phối. b) Đổi chỗ để nhân (−0,25) với 4 trước.",
      pt: [
        { ten: "Câu a", dich: "Tính C", sd: [["C = " + F(5, 7) + " − " + F(2, 7), [2]], ["Đặt " + F(5, 7) + " ra ngoài: " + F(5, 7) + " · (" + F(4, 9) + " + " + F(5, 9) + ") = " + F(5, 7) + " · 1", [1]]], gt: "Hai tích có chung thừa số " + F(5, 7) },
        { ten: "Câu b", dich: "Tính D", sd: [["Nhân (−1) với " + F("−7", 13), [4]], ["Tính (−0,25) · 4 = −1", [3]]], gt: "Có tích (−0,25) · 4 tròn" }],
      steps: [
        "a) C = " + F(5, 7) + " · " + F(4, 9) + " + " + F(5, 7) + " · " + F(5, 9) + " − " + F(2, 7) + " = " + F(5, 7) + " · (" + F(4, 9) + " + " + F(5, 9) + ") − " + F(2, 7) + " = " + F(5, 7) + " · 1 − " + F(2, 7),
        "= " + F(5, 7) + " − " + F(2, 7) + " = " + F(3, 7) + ".",
        "b) D = (−0,25) · " + F("−7", 13) + " · 4 = [(−0,25) · 4] · " + F("−7", 13) + " (tính chất giao hoán và kết hợp)",
        "= (−1) · " + F("−7", 13) + " = " + F(7, 13) + "."
      ],
      dap: "C = " + F(3, 7) + "; D = " + F(7, 13) + ".",
      loi: "Câu a đặt " + F(5, 7) + " ra ngoài cả số hạng " + F(2, 7) + " (không có thừa số chung)."
    },
    {
      id: "th3", lv: "TH", mix: [2, 4],
      de: "Tìm x, biết:<br>a) x + " + F(2, 3) + " = " + F(1, 2) + ";  b) " + F(3, 4) + " − 2x = " + F("−1", 4) + ";  c) " + F(2, 5) + "x − " + F(1, 2) + " = " + F(3, 10) + ".",
      goi: "Dùng quy tắc chuyển vế: chuyển số hạng sang vế kia thì đổi dấu; rồi tìm thừa số chưa biết.",
      pt: [
        { ten: "Câu b", dich: "Tìm x", sd: [["x = 1 : 2", [3]], ["Chuyển vế: 2x = " + F(3, 4) + " + " + F(1, 4), [2]]], gt: F(3, 4) + " − 2x = " + F("−1", 4) },
        { ten: "Câu c", dich: "Tìm x", sd: [["x = " + F(4, 5) + " : " + F(2, 5), [5]], ["Chuyển vế: " + F(2, 5) + "x = " + F(3, 10) + " + " + F(1, 2), [4]]], gt: F(2, 5) + "x − " + F(1, 2) + " = " + F(3, 10) }],
      steps: [
        "a) x = " + F(1, 2) + " − " + F(2, 3) + " = " + F(3, 6) + " − " + F(4, 6) + " = " + F("−1", 6) + ".",
        "b) " + F(3, 4) + " + " + F(1, 4) + " = 2x, tức là 2x = 1.",
        "x = 1 : 2 = " + F(1, 2) + ".",
        "c) " + F(2, 5) + "x = " + F(3, 10) + " + " + F(1, 2) + " = " + F(3, 10) + " + " + F(5, 10) + " = " + F(8, 10) + " = " + F(4, 5) + ".",
        "x = " + F(4, 5) + " : " + F(2, 5) + " = " + F(4, 5) + " · " + F(5, 2) + " = 2."
      ],
      dap: "a) x = " + F("−1", 6) + "; b) x = " + F(1, 2) + "; c) x = 2.",
      loi: "Chuyển " + F(2, 3) + " sang vế phải mà không đổi dấu; câu b ghi −2x = " + F("−1", 4) + " + " + F(3, 4) + " rồi quên dấu \"−\" của x."
    },

    /* ================= VẬN DỤNG ================= */
    {
      id: "vd1", lv: "VD", mix: [3],
      de: "a) Tính E = " + F(P(4, 5) + " · " + P(9, 4), "2 · " + P(6, 9)) + ".<br>b) Tìm số tự nhiên n, biết " + P(2, "n") + " · 4 = 128.",
      goi: "Viết mọi số về luỹ thừa của các số nguyên tố 2 và 3, rồi dùng quy tắc nhân, chia hai luỹ thừa cùng cơ số.",
      pt: [
        { ten: "Câu a", dich: "Tính E", sd: [["Chia hai luỹ thừa cùng cơ số: " + F(P(2, 10) + " · " + P(3, 8), P(2, 10) + " · " + P(3, 9)), [2, 3]], ["Viết 4<sup>5</sup> = 2<sup>10</sup>, 9<sup>4</sup> = 3<sup>8</sup>, 6<sup>9</sup> = 2<sup>9</sup> · 3<sup>9</sup>", [1]]], gt: "Các cơ số 4, 9, 6, 2 đều viết được qua 2 và 3" },
        { ten: "Câu b", dich: "Tìm n", sd: [["Hai luỹ thừa cùng cơ số 2 bằng nhau thì số mũ bằng nhau", [5]], ["Viết hai vế thành luỹ thừa cơ số 2: " + P(2, "n + 2") + " = " + P(2, 7), [4]]], gt: "4 = 2<sup>2</sup>, 128 = 2<sup>7</sup>" }],
      hieu: { gt: "E = " + F(P(4, 5) + " · " + P(9, 4), "2 · " + P(6, 9)) + "; " + P(2, "n") + " · 4 = 128 với n là số tự nhiên.", kl: "a) Tính E. b) Tìm n.",
        hoi: [
          ["Có nên tính 4<sup>5</sup>, 9<sup>4</sup>, 6<sup>9</sup> ra số rồi chia không?", "Không nên: 6<sup>9</sup> = 10 077 696, số rất lớn, dễ sai. Ta biến đổi luỹ thừa."],
          ["Các cơ số 4, 9, 6, 2 có chung điều gì?", "Đều viết được qua 2 và 3: 4 = 2<sup>2</sup>, 9 = 3<sup>2</sup>, 6 = 2 · 3."],
          ["Câu b: 4 và 128 viết dưới dạng luỹ thừa cơ số 2 như thế nào?", "4 = 2<sup>2</sup>, 128 = 2<sup>7</sup>."]] },
      nguoc: [
        { ten: "Câu a", dich: "Tính E",
          sd: [["Rút gọn tử và mẫu theo từng cơ số 2 và 3", [2, 3]], ["Viết mọi luỹ thừa về cơ số 2 và 3", [1]]],
          gt: "4 = 2<sup>2</sup>, 9 = 3<sup>2</sup>, 6 = 2 · 3",
          ket: "E = " + F(P(2, 10) + " · " + P(3, 8), P(2, 10) + " · " + P(3, 9)) + " = " + F(1, 3) + ".",
          buoc: [
            { hoi: "Viết tử 4<sup>5</sup> · 9<sup>4</sup> theo luỹ thừa của 2 và 3 thế nào?",
              nho: "Luỹ thừa của luỹ thừa: (x<sup>m</sup>)<sup>n</sup> = x<sup>m · n</sup>.",
              chon: [
                ["4<sup>5</sup> · 9<sup>4</sup> = 2<sup>10</sup> · 3<sup>8</sup>", true, "Đúng. 4<sup>5</sup> = (2<sup>2</sup>)<sup>5</sup> = 2<sup>10</sup>, 9<sup>4</sup> = (3<sup>2</sup>)<sup>4</sup> = 3<sup>8</sup>."],
                ["4<sup>5</sup> · 9<sup>4</sup> = 2<sup>7</sup> · 3<sup>6</sup>", false, "Đã cộng 2 + 5 và 2 + 4. Luỹ thừa của luỹ thừa thì nhân số mũ: 2 · 5 = 10, 2 · 4 = 8."]],
              dat: "Tử bằng 2<sup>10</sup> · 3<sup>8</sup>" },
            { hoi: "Mẫu 2 · 6<sup>9</sup> viết theo 2 và 3 thế nào?",
              nho: "Luỹ thừa của một tích: (x · y)<sup>n</sup> = x<sup>n</sup> · y<sup>n</sup>.",
              chon: [
                ["2 · 6<sup>9</sup> = 2 · 2<sup>9</sup> · 3<sup>9</sup> = 2<sup>10</sup> · 3<sup>9</sup>", true, "Đúng. Nhân 2 với 2<sup>9</sup> được 2<sup>10</sup>."],
                ["2 · 6<sup>9</sup> = 12<sup>9</sup>", false, "Chỉ nhân 2 với một lần 6, không nhân với cả luỹ thừa: 2 · 6<sup>9</sup> ≠ 12<sup>9</sup>."]],
              dat: "Mẫu bằng 2<sup>10</sup> · 3<sup>9</sup>" },
            { hoi: "Vậy E bằng bao nhiêu?",
              nho: "Chia theo từng cơ số: 2<sup>10</sup> : 2<sup>10</sup> = 1, 3<sup>8</sup> : 3<sup>9</sup>.",
              chon: [
                [F(1, 3), true, "Đúng. Tử và mẫu cùng có 2<sup>10</sup>; còn 3<sup>8</sup> so với 3<sup>9</sup> thì mẫu nhiều hơn một thừa số 3."],
                ["3", false, "Đã đảo tử và mẫu: thừa số 3 dư ra nằm ở mẫu, nên E = " + F(1, 3) + "."]],
              dat: "E = " + F(1, 3) }] },
        { ten: "Câu b", dich: "Tìm n",
          sd: [["So sánh số mũ hai vế", [5]], ["Viết hai vế thành luỹ thừa cơ số 2", [4]]],
          gt: "4 = 2<sup>2</sup>, 128 = 2<sup>7</sup>",
          ket: P(2, "n + 2") + " = " + P(2, 7) + " nên n + 2 = 7, n = 5.",
          buoc: [
            { hoi: "Viết vế trái " + P(2, "n") + " · 4 thành một luỹ thừa cơ số 2.",
              nho: "Nhân hai luỹ thừa cùng cơ số: cộng số mũ.",
              chon: [
                [P(2, "n") + " · 2<sup>2</sup> = " + P(2, "n + 2"), true, "Đúng."],
                [P(8, "n"), false, "Không nhân cơ số 2 với 4 như vậy được; 4 chỉ nhân một lần."]],
              dat: P(2, "n + 2") + " = 128 = " + P(2, 7) },
            { hoi: "Từ " + P(2, "n + 2") + " = " + P(2, 7) + " suy ra n bằng bao nhiêu?",
              nho: "Hai luỹ thừa cùng cơ số 2 bằng nhau thì số mũ bằng nhau.",
              chon: [
                ["n + 2 = 7, nên n = 5", true, "Đúng. Thử lại: 2<sup>5</sup> · 4 = 32 · 4 = 128."],
                ["n = 7", false, "Số mũ của vế trái là n + 2, không phải n."]],
              dat: "n = 5" }] }],
      nhin: [
        ["Thử lại câu b.", "2<sup>5</sup> · 4 = 32 · 4 = 128. Đúng."],
        ["Mẹo chung của câu a là gì?", "Khi các cơ số khác nhau nhưng cùng \"làm từ\" vài số nguyên tố, hãy đưa hết về luỹ thừa của các số đó rồi rút gọn theo từng cơ số."],
        ["Thử với bài tương tự: tính " + F(P(8, 3) + " · " + P(9, 2), P(6, 4) + " · 4") + ".", "= " + F(P(2, 9) + " · " + P(3, 4), P(2, 4) + " · " + P(3, 4) + " · " + P(2, 2)) + " = " + P(2, 3) + " = 8."]],
      steps: [
        "a) E = " + F(P(4, 5) + " · " + P(9, 4), "2 · " + P(6, 9)) + " = " + F(Q(P(2, 2), 5) + " · " + Q(P(3, 2), 4), "2 · " + P(2, 9) + " · " + P(3, 9)) + " = " + F(P(2, 10) + " · " + P(3, 8), "2 · " + P(2, 9) + " · " + P(3, 9)),
        "= " + F(P(2, 10) + " · " + P(3, 8), P(2, 10) + " · " + P(3, 9)),
        "= " + F(1, 3) + ".",
        "b) " + P(2, "n") + " · 2<sup>2</sup> = 2<sup>7</sup>, tức là " + P(2, "n + 2") + " = " + P(2, 7) + ".",
        "Suy ra n + 2 = 7, n = 5."
      ],
      dap: "a) E = " + F(1, 3) + ". b) n = 5.",
      loi: "Viết 4<sup>5</sup> = 2<sup>7</sup> (cộng số mũ thay vì nhân); câu b lấy luôn n = 7."
    },
    {
      id: "vd2", lv: "VD", mix: [2, 3, 4],
      de: "Tìm x, biết:<br>a) " + F(2, 3) + " − (x + " + F(1, 4) + ") = " + F(1, 6) + ";  b) " + Q("2x − 1", 3) + " = " + F("−8", 27) + ".",
      goi: "a) Bỏ ngoặc (hoặc coi x + " + F(1, 4) + " là số trừ) rồi chuyển vế. b) Tìm số có lập phương bằng " + F("−8", 27) + ".",
      pt: [
        { ten: "Câu a", dich: "Tìm x", sd: [["x = " + F(1, 2) + " − " + F(1, 4), [2]], ["Tìm số trừ: x + " + F(1, 4) + " = " + F(2, 3) + " − " + F(1, 6), [1]]], gt: F(2, 3) + " − (x + " + F(1, 4) + ") = " + F(1, 6) },
        { ten: "Câu b", dich: "Tìm x", sd: [["Giải 2x − 1 = " + F("−2", 3), [4, 5]], [F("−8", 27) + " = " + Q(F("−2", 3), 3), [3]]], gt: "Lập phương của 2x − 1 bằng " + F("−8", 27) }],
      hieu: { gt: F(2, 3) + " − (x + " + F(1, 4) + ") = " + F(1, 6) + "; " + Q("2x − 1", 3) + " = " + F("−8", 27) + ".", kl: "Tìm x trong mỗi câu.",
        hoi: [
          ["Câu a: biểu thức trong ngoặc đóng vai trò gì trong phép trừ?", "x + " + F(1, 4) + " là số trừ; số bị trừ là " + F(2, 3) + ", hiệu là " + F(1, 6) + "."],
          ["Câu b: biết " + Q("2x − 1", 3) + ", ta cần tìm gì trước?", "Tìm số 2x − 1: số mà lập phương bằng " + F("−8", 27) + "."]] },
      nguoc: [
        { ten: "Câu a", dich: "Tìm x",
          sd: [["Tìm x từ x + " + F(1, 4) + " = " + F(1, 2), [2]], ["Tìm số trừ x + " + F(1, 4), [1]]],
          gt: "Số bị trừ " + F(2, 3) + ", hiệu " + F(1, 6),
          ket: "x + " + F(1, 4) + " = " + F(1, 2) + ", x = " + F(1, 4) + ".",
          buoc: [
            { hoi: "Số trừ x + " + F(1, 4) + " bằng bao nhiêu?",
              nho: "Số trừ = Số bị trừ − Hiệu.",
              chon: [
                ["x + " + F(1, 4) + " = " + F(2, 3) + " − " + F(1, 6) + " = " + F(1, 2), true, "Đúng. " + F(4, 6) + " − " + F(1, 6) + " = " + F(3, 6) + " = " + F(1, 2) + "."],
                ["x + " + F(1, 4) + " = " + F(2, 3) + " + " + F(1, 6) + " = " + F(5, 6), false, "Đó là cách tìm số bị trừ. Ở đây cần tìm số trừ: lấy số bị trừ trừ hiệu."]],
              dat: "x + " + F(1, 4) + " = " + F(1, 2) },
            { hoi: "Từ x + " + F(1, 4) + " = " + F(1, 2) + ", tìm x.",
              nho: "Chuyển " + F(1, 4) + " sang vế phải, đổi dấu.",
              chon: [
                ["x = " + F(1, 2) + " − " + F(1, 4) + " = " + F(1, 4), true, "Đúng. Thử lại: " + F(2, 3) + " − " + F(1, 2) + " = " + F(1, 6) + "."],
                ["x = " + F(1, 2) + " + " + F(1, 4) + " = " + F(3, 4), false, "Chuyển vế phải đổi dấu: + " + F(1, 4) + " thành − " + F(1, 4) + "."]],
              dat: "x = " + F(1, 4) }] },
        { ten: "Câu b", dich: "Tìm x",
          sd: [["Giải 2x − 1 = " + F("−2", 3), [4, 5]], ["Viết " + F("−8", 27) + " thành lập phương", [3]]],
          gt: Q("2x − 1", 3) + " = " + F("−8", 27),
          ket: "2x − 1 = " + F("−2", 3) + ", 2x = " + F(1, 3) + ", x = " + F(1, 6) + ".",
          buoc: [
            { hoi: "Số nào có lập phương bằng " + F("−8", 27) + "?",
              nho: "Luỹ thừa bậc lẻ của một số âm là số âm; 2<sup>3</sup> = 8, 3<sup>3</sup> = 27.",
              chon: [
                [F("−2", 3) + ", vì " + Q(F("−2", 3), 3) + " = " + F("−8", 27), true, "Đúng. Lập phương giữ nguyên dấu, nên chỉ có một số là " + F("−2", 3) + "."],
                [F("−8", 9) + ", vì 27 : 3 = 9", false, "Lập phương không phải chia mẫu cho 3; ta cần số nhân với chính nó ba lần."],
                [F("−2", 3) + " hoặc " + F(2, 3), false, Q(F(2, 3), 3) + " = " + F(8, 27) + " là số dương, không bằng " + F("−8", 27) + "."]],
              dat: "2x − 1 = " + F("−2", 3) },
            { hoi: "Từ 2x − 1 = " + F("−2", 3) + ", tìm x.",
              nho: "Chuyển −1 sang vế phải, rồi chia cho 2.",
              chon: [
                ["2x = " + F("−2", 3) + " + 1 = " + F(1, 3) + ", x = " + F(1, 6), true, "Đúng. Thử lại: 2 · " + F(1, 6) + " − 1 = " + F("−2", 3) + "."],
                ["2x = " + F("−2", 3) + " − 1 = " + F("−5", 3) + ", x = " + F("−5", 6), false, "Chuyển −1 sang vế phải phải đổi thành +1."]],
              dat: "x = " + F(1, 6) }] }],
      nhin: [
        ["Thử lại câu a.", F(2, 3) + " − (" + F(1, 4) + " + " + F(1, 4) + ") = " + F(2, 3) + " − " + F(1, 2) + " = " + F(1, 6) + ". Đúng."],
        ["Vì sao câu b chỉ có một giá trị của x, còn bài kiểu " + Q("2x − 1", 2) + " = " + F(4, 9) + " lại có hai?", "Bình phương của hai số đối nhau bằng nhau (" + Q(F(2, 3), 2) + " = " + Q(F("−2", 3), 2) + "), còn lập phương giữ dấu nên mỗi lập phương ứng với đúng một số."],
        ["Thử bài tương tự: " + Q("3x + 1", 3) + " = −1.", "3x + 1 = −1, 3x = −2, x = " + F("−2", 3) + "."]],
      steps: [
        "a) x + " + F(1, 4) + " = " + F(2, 3) + " − " + F(1, 6) + " = " + F(4, 6) + " − " + F(1, 6) + " = " + F(1, 2) + ".",
        "x = " + F(1, 2) + " − " + F(1, 4) + " = " + F(1, 4) + ".",
        "b) Vì " + Q(F("−2", 3), 3) + " = " + F("−8", 27) + " nên 2x − 1 = " + F("−2", 3) + ".",
        "2x = " + F("−2", 3) + " + 1 = " + F(1, 3) + ".",
        "x = " + F(1, 3) + " : 2 = " + F(1, 6) + "."
      ],
      dap: "a) x = " + F(1, 4) + ". b) x = " + F(1, 6) + ".",
      loi: "Câu a bỏ ngoặc mà không đổi dấu số hạng " + F(1, 4) + "; câu b tìm thêm 2x − 1 = " + F(2, 3) + "."
    },
    {
      id: "vd3", lv: "VD", mix: [2, 4],
      de: "Một cửa hàng nhập 120 kg gạo. Ngày thứ nhất bán " + F(1, 4) + " số gạo, ngày thứ hai bán " + F(2, 3) + " số gạo còn lại, ngày thứ ba bán 0,4 số gạo còn lại sau ngày thứ hai. Hỏi cửa hàng còn bao nhiêu ki-lô-gam gạo?",
      goi: "Mỗi ngày tính theo số gạo CÒN LẠI của ngày trước, không phải theo 120 kg.",
      pt: [
        { ten: "Cả bài", dich: "Số gạo còn lại sau ba ngày", sd: [["Còn lại sau ngày ba = còn sau ngày hai − bán ngày ba", [3]], ["Còn lại sau ngày hai", [2]], ["Còn lại sau ngày một: 120 − 120 · " + F(1, 4), [1]]], gt: "120 kg; các phần bán " + F(1, 4) + ", " + F(2, 3) + ", 0,4 của số còn lại" }],
      hieu: { gt: "120 kg gạo. Ngày 1 bán " + F(1, 4) + " số gạo; ngày 2 bán " + F(2, 3) + " số còn lại; ngày 3 bán 0,4 số còn lại sau ngày 2.", kl: "Số gạo còn lại.",
        hoi: [
          ["\"" + F(2, 3) + " số gạo còn lại\" là " + F(2, 3) + " của bao nhiêu ki-lô-gam?", "Của số gạo còn sau ngày thứ nhất, không phải của 120 kg."],
          ["Muốn biết ngày thứ hai bán bao nhiêu, cần biết gì trước?", "Cần biết số gạo còn lại sau ngày thứ nhất."]] },
      nguoc: [
        { ten: "Cả bài", dich: "Số gạo còn lại sau ba ngày",
          sd: [["Ngày ba: bán 0,4 của số còn sau ngày hai", [3]], ["Ngày hai: bán " + F(2, 3) + " của số còn sau ngày một", [2]], ["Ngày một: bán " + F(1, 4) + " của 120 kg", [1]]],
          gt: "120 kg",
          ket: "Còn lại 30 − 12 = 18 (kg).",
          buoc: [
            { hoi: "Sau ngày thứ nhất còn bao nhiêu ki-lô-gam?",
              nho: "Tìm giá trị phân số của một số: 120 · " + F(1, 4) + ".",
              chon: [
                ["Bán 120 · " + F(1, 4) + " = 30 kg, còn 120 − 30 = 90 kg", true, "Đúng."],
                ["Còn 30 kg", false, "30 kg là số bán ngày thứ nhất, không phải số còn lại."]],
              dat: "Còn 90 kg sau ngày thứ nhất" },
            { hoi: "Sau ngày thứ hai còn bao nhiêu ki-lô-gam?",
              nho: "Ngày thứ hai bán " + F(2, 3) + " của 90 kg.",
              chon: [
                ["Bán 90 · " + F(2, 3) + " = 60 kg, còn 30 kg", true, "Đúng."],
                ["Bán 120 · " + F(2, 3) + " = 80 kg, còn 10 kg", false, "Phải tính " + F(2, 3) + " của số còn lại (90 kg), không phải của 120 kg."]],
              dat: "Còn 30 kg sau ngày thứ hai" },
            { hoi: "Sau ngày thứ ba còn bao nhiêu?",
              nho: "Ngày thứ ba bán 0,4 của 30 kg.",
              chon: [
                ["Bán 30 · 0,4 = 12 kg, còn 18 kg", true, "Đúng."],
                ["Còn 12 kg", false, "12 kg là số bán ngày thứ ba; còn lại 30 − 12 = 18 kg."]],
              dat: "Còn 18 kg" }] }],
      nhin: [
        ["Tính nhanh bằng phần còn lại mỗi ngày.", "Mỗi ngày còn lại " + F(3, 4) + ", " + F(1, 3) + ", 0,6 số trước đó: 120 · " + F(3, 4) + " · " + F(1, 3) + " · " + F(3, 5) + " = 18 (kg)."],
        ["Nếu ba ngày đều tính theo 120 kg thì sai thế nào?", "Bán 30 + 80 + 48 = 158 kg, nhiều hơn số gạo có: vô lí. Đó là dấu hiệu đã hiểu sai \"số còn lại\"."]],
      steps: [
        "Ngày thứ nhất bán 120 · " + F(1, 4) + " = 30 (kg), còn 120 − 30 = 90 (kg).",
        "Ngày thứ hai bán 90 · " + F(2, 3) + " = 60 (kg), còn 90 − 60 = 30 (kg).",
        "Ngày thứ ba bán 30 · 0,4 = 12 (kg), còn 30 − 12 = 18 (kg)."
      ],
      dap: "Cửa hàng còn 18 kg gạo.",
      loi: "Tính " + F(2, 3) + " và 0,4 theo 120 kg thay vì theo số gạo còn lại."
    },
    {
      id: "vd4", lv: "VD", mix: [1, 3],
      de: "a) So sánh " + Q("−0,5", 7) + " và " + Q(F("−1", 4), 3) + ".<br>b) Sắp xếp theo thứ tự tăng dần: " + F("−2", 3) + ";  " + Q(F("−2", 3), 2) + ";  " + Q(F("−2", 3), 3) + ";  0.",
      goi: "a) Đưa về cùng cơ số " + F("−1", 2) + " hoặc tính ra phân số. b) Xét dấu từng số trước, rồi so sánh các số cùng dấu.",
      pt: [
        { ten: "Câu a", dich: "So sánh hai luỹ thừa", sd: [["So sánh hai số âm " + F("−1", 128) + " và " + F("−1", 64), [2]], ["Tính " + Q("−0,5", 7) + " = " + F("−1", 128) + ", " + Q(F("−1", 4), 3) + " = " + F("−1", 64), [1]]], gt: "−0,5 = " + F("−1", 2) },
        { ten: "Câu b", dich: "Sắp xếp bốn số", sd: [["Ghép thứ tự số âm < 0 < số dương", [5]], ["So sánh hai số âm " + F("−2", 3) + " và " + F("−8", 27), [4]], ["Xét dấu: luỹ thừa bậc chẵn dương, bậc lẻ âm", [3]]], gt: "Cơ số " + F("−2", 3) + " âm" }],
      hieu: { gt: "a) " + Q("−0,5", 7) + " và " + Q(F("−1", 4), 3) + ". b) Bốn số " + F("−2", 3) + ", " + Q(F("−2", 3), 2) + ", " + Q(F("−2", 3), 3) + ", 0.", kl: "a) So sánh. b) Sắp xếp tăng dần.",
        hoi: [
          ["Câu a: hai số đó âm hay dương?", "Cơ số âm, số mũ lẻ (7 và 3), nên cả hai đều âm."],
          ["Câu b: số nào âm, số nào dương?", F("−2", 3) + " và " + Q(F("−2", 3), 3) + " âm (bậc lẻ); " + Q(F("−2", 3), 2) + " dương (bậc chẵn); 0 không âm không dương."]] },
      nguoc: [
        { ten: "Câu a", dich: "So sánh " + Q("−0,5", 7) + " và " + Q(F("−1", 4), 3),
          sd: [["So sánh hai số âm qua số đối", [2]], ["Tính ra phân số", [1]]],
          gt: "Cả hai số đều âm",
          ket: F(1, 128) + " < " + F(1, 64) + " nên " + F("−1", 128) + " > " + F("−1", 64) + ", tức là " + Q("−0,5", 7) + " > " + Q(F("−1", 4), 3) + ".",
          buoc: [
            { hoi: "Tính mỗi luỹ thừa dưới dạng phân số.",
              nho: "−0,5 = " + F("−1", 2) + "; 2<sup>7</sup> = 128, 4<sup>3</sup> = 64.",
              chon: [
                [Q("−0,5", 7) + " = " + F("−1", 128) + ", " + Q(F("−1", 4), 3) + " = " + F("−1", 64), true, "Đúng. Bậc lẻ nên giữ dấu \"−\"."],
                [Q("−0,5", 7) + " = " + F(1, 128) + ", " + Q(F("−1", 4), 3) + " = " + F(1, 64), false, "Luỹ thừa bậc lẻ của số âm là số âm."]],
              dat: F("−1", 128) + " và " + F("−1", 64) },
            { hoi: "So sánh " + F("−1", 128) + " và " + F("−1", 64) + ".",
              nho: "Hai số âm: số nào có số đối lớn hơn thì nhỏ hơn.",
              chon: [
                [F("−1", 128) + " > " + F("−1", 64), true, "Đúng. " + F(1, 128) + " < " + F(1, 64) + ", đổi chiều khi là số âm."],
                [F("−1", 128) + " < " + F("−1", 64) + " vì 128 > 64", false, "Quên rằng hai số đều âm: phải đổi chiều."]],
              dat: Q("−0,5", 7) + " > " + Q(F("−1", 4), 3) }] },
        { ten: "Câu b", dich: "Sắp xếp bốn số",
          sd: [["Ghép: hai số âm, rồi 0, rồi số dương", [5]], ["So sánh " + F("−2", 3) + " và " + F("−8", 27), [4]], ["Xét dấu từng số", [3]]],
          gt: "Cơ số " + F("−2", 3) + " âm",
          ket: F("−2", 3) + " < " + Q(F("−2", 3), 3) + " < 0 < " + Q(F("−2", 3), 2) + ".",
          buoc: [
            { hoi: "Tính " + Q(F("−2", 3), 2) + " và " + Q(F("−2", 3), 3) + ".",
              nho: "Bậc chẵn: dương; bậc lẻ: âm.",
              chon: [
                [F(4, 9) + " và " + F("−8", 27), true, "Đúng."],
                [F("−4", 9) + " và " + F("−8", 27), false, "Bình phương một số âm là số dương: " + Q(F("−2", 3), 2) + " = " + F(4, 9) + "."]],
              dat: F(4, 9) + " > 0; " + F("−2", 3) + " và " + F("−8", 27) + " là hai số âm" },
            { hoi: "So sánh hai số âm " + F("−2", 3) + " và " + F("−8", 27) + ".",
              nho: "Quy đồng: " + F("−2", 3) + " = " + F("−18", 27) + ".",
              chon: [
                [F("−18", 27) + " < " + F("−8", 27) + ", nên " + F("−2", 3) + " < " + Q(F("−2", 3), 3), true, "Đúng. Luỹ thừa bậc 3 của số nằm giữa −1 và 0 thì gần 0 hơn chính số đó."],
                [Q(F("−2", 3), 3) + " < " + F("−2", 3) + " vì số mũ lớn hơn", false, "Số mũ lớn hơn không có nghĩa là số nhỏ hơn; hãy quy đồng rồi so sánh."]],
              dat: F("−2", 3) + " < " + Q(F("−2", 3), 3) }] }],
      nhin: [
        ["Câu a còn cách nào khác?", "So sánh hai số đối: " + Q("0,5", 7) + " = " + Q(F(1, 2), 7) + " và " + Q(F(1, 4), 3) + " = " + Q(F(1, 2), 6) + ". Cơ số " + F(1, 2) + " nằm giữa 0 và 1, số mũ lớn hơn thì luỹ thừa nhỏ hơn: " + Q(F(1, 2), 7) + " < " + Q(F(1, 2), 6) + ". Đổi chiều: " + Q("−0,5", 7) + " > " + Q(F("−1", 4), 3) + "."],
        ["Nhận xét chung từ câu b?", "Với số x nằm giữa −1 và 0: x < x<sup>3</sup> < 0 < x<sup>2</sup>."]],
      steps: [
        "a) " + Q("−0,5", 7) + " = " + Q(F("−1", 2), 7) + " = " + F("−1", 128) + "; " + Q(F("−1", 4), 3) + " = " + F("−1", 64) + ".",
        "Vì " + F(1, 128) + " < " + F(1, 64) + " nên " + F("−1", 128) + " > " + F("−1", 64) + ". Vậy " + Q("−0,5", 7) + " > " + Q(F("−1", 4), 3) + ".",
        "b) " + Q(F("−2", 3), 2) + " = " + F(4, 9) + " > 0; " + Q(F("−2", 3), 3) + " = " + F("−8", 27) + " < 0; " + F("−2", 3) + " < 0.",
        F("−2", 3) + " = " + F("−18", 27) + " < " + F("−8", 27) + ".",
        "Vậy " + F("−2", 3) + " < " + Q(F("−2", 3), 3) + " < 0 < " + Q(F("−2", 3), 2) + "."
      ],
      dap: "a) " + Q("−0,5", 7) + " > " + Q(F("−1", 4), 3) + ". b) " + F("−2", 3) + ";  " + Q(F("−2", 3), 3) + ";  0;  " + Q(F("−2", 3), 2) + ".",
      loi: "Coi luỹ thừa có số mũ lớn hơn thì lớn hơn (hay nhỏ hơn) mà không xét dấu."
    },

    /* ================= DÀNH CHO HSG ================= */
    {
      id: "hsg1", lv: "HSG", mix: [2, 3, 4],
      de: "Tính A = " + "(1 − " + F(1, P(2, 2)) + ") · (1 − " + F(1, P(3, 2)) + ") · (1 − " + F(1, P(4, 2)) + ") · … · (1 − " + F(1, P(100, 2)) + ").",
      goi: "Tính từng thừa số: 1 − " + F(1, P("n", 2)) + " = " + F("(n − 1) · (n + 1)", "n · n") + ". Viết tích thành hai tích rồi rút gọn.",
      hieu: { gt: "A là tích của 99 thừa số dạng 1 − " + F(1, P("n", 2)) + " với n = 2, 3, …, 100.", kl: "Tính A.",
        hoi: [
          ["Tính thử ba thừa số đầu.", "1 − " + F(1, 4) + " = " + F(3, 4) + " = " + F("1 · 3", "2 · 2") + "; 1 − " + F(1, 9) + " = " + F(8, 9) + " = " + F("2 · 4", "3 · 3") + "; 1 − " + F(1, 16) + " = " + F(15, 16) + " = " + F("3 · 5", "4 · 4") + "."],
          ["Tử của thừa số thứ n có dạng gì?", "n<sup>2</sup> − 1 = (n − 1) · (n + 1): hai số đứng hai bên n."]] },
      nguoc: [
        { ten: "Cả bài", dich: "Tính A",
          sd: [["Tách A thành tích hai dãy rút gọn được", [2, 3]], ["Viết mỗi thừa số thành " + F("(n − 1) · (n + 1)", "n · n"), [1]]],
          gt: "1 − " + F(1, P("n", 2)) + " = " + F(P("n", 2) + " − 1", P("n", 2)),
          ket: "A = " + F(1, 100) + " · " + F(101, 2) + " = " + F(101, 200) + ".",
          buoc: [
            { hoi: "Thừa số 1 − " + F(1, P("n", 2)) + " viết lại thế nào cho dễ rút gọn?",
              nho: "n<sup>2</sup> − 1 = (n − 1) · (n + 1), chẳng hạn 3<sup>2</sup> − 1 = 8 = 2 · 4.",
              chon: [
                [F("(n − 1) · (n + 1)", "n · n"), true, "Đúng. Mỗi thừa số thành tích của hai phân số " + F("n − 1", "n") + " · " + F("n + 1", "n") + "."],
                [F("n − 1", P("n", 2)), false, "1 − " + F(1, P("n", 2)) + " = " + F(P("n", 2) + " − 1", P("n", 2)) + ", không phải " + F("n − 1", P("n", 2)) + "."]],
              dat: "1 − " + F(1, P("n", 2)) + " = " + F("n − 1", "n") + " · " + F("n + 1", "n") },
            { hoi: "Gom các phân số " + F("n − 1", "n") + " lại: " + F(1, 2) + " · " + F(2, 3) + " · … · " + F(99, 100) + " bằng bao nhiêu?",
              nho: "Tử của phân số này rút gọn với mẫu của phân số trước.",
              chon: [
                [F(1, 100), true, "Đúng. Chỉ còn tử đầu 1 và mẫu cuối 100."],
                [F(99, 100), false, "Các tử 2, 3, …, 99 đều rút gọn với mẫu, chỉ còn 1 ở tử."]],
              dat: "Dãy thứ nhất bằng " + F(1, 100) },
            { hoi: "Dãy còn lại " + F(3, 2) + " · " + F(4, 3) + " · … · " + F(101, 100) + " bằng bao nhiêu?",
              nho: "Tương tự: rút gọn tử với mẫu của phân số sau.",
              chon: [
                [F(101, 2), true, "Đúng. Còn tử cuối 101 và mẫu đầu 2."],
                [F(101, 100), false, "Mẫu 100 đã rút gọn với tử 100 của phân số trước; mẫu còn lại là 2."]],
              dat: "A = " + F(1, 100) + " · " + F(101, 2) + " = " + F(101, 200) }] }],
      nhin: [
        ["Kiểm tra với tích ngắn: (1 − " + F(1, 4) + ")(1 − " + F(1, 9) + ").", F(3, 4) + " · " + F(8, 9) + " = " + F(2, 3) + "; công thức cho " + F(1, 3) + " · " + F(4, 2) + " = " + F(2, 3) + ". Khớp."],
        ["Tổng quát với thừa số cuối 1 − " + F(1, P("m", 2)) + "?", "A = " + F(1, "m") + " · " + F("m + 1", 2) + " = " + F("m + 1", "2m") + "."]],
      steps: [
        "Với n ≥ 2: 1 − " + F(1, P("n", 2)) + " = " + F(P("n", 2) + " − 1", P("n", 2)) + " = " + F("(n − 1) · (n + 1)", "n · n") + ".",
        "A = (1 − " + F(1, P(2, 2)) + ") · (1 − " + F(1, P(3, 2)) + ") · … · (1 − " + F(1, P(100, 2)) + ") = " + F("1 · 3", "2 · 2") + " · " + F("2 · 4", "3 · 3") + " · " + F("3 · 5", "4 · 4") + " · … · " + F("99 · 101", "100 · 100") + " = " + F("1 · 2 · 3 · … · 99", "2 · 3 · 4 · … · 100") + " · " + F("3 · 4 · 5 · … · 101", "2 · 3 · 4 · … · 100") + ".",
        "A = " + F(1, 100) + " · " + F(101, 2) + " = " + F(101, 200) + "."
      ],
      dap: "A = " + F(101, 200) + "."
    },
    {
      id: "hsg2", lv: "HSG", mix: [2, 3],
      de: "Tìm các số hữu tỉ x, y, z, biết: x · y = " + F(1, 3) + ";  y · z = " + F("−2", 5) + ";  z · x = " + F("−3", 10) + ".",
      goi: "Nhân ba đẳng thức vế theo vế để được " + Q("x · y · z", 2) + ". Tìm x · y · z rồi chia cho từng tích hai số.",
      hieu: { gt: "xy = " + F(1, 3) + ", yz = " + F("−2", 5) + ", zx = " + F("−3", 10) + ".", kl: "Tìm x, y, z.",
        hoi: [
          ["Nhân ba vế trái với nhau được gì?", "(xy) · (yz) · (zx) = x<sup>2</sup> · y<sup>2</sup> · z<sup>2</sup> = " + Q("xyz", 2) + "."],
          ["Biết xyz và yz thì tìm x thế nào?", "x = (xyz) : (yz), vì yz ≠ 0."]] },
      nguoc: [
        { ten: "Cả bài", dich: "Tìm x, y, z",
          sd: [["x = xyz : yz, y = xyz : zx, z = xyz : xy", [3, 4]], ["Tìm xyz từ " + Q("xyz", 2), [2]], ["Nhân ba đẳng thức", [1]]],
          gt: "Ba tích hai số đã biết",
          ket: "Có hai bộ số (x; y; z) thoả mãn: (" + F("−1", 2) + "; " + F("−2", 3) + "; " + F(3, 5) + ") và (" + F(1, 2) + "; " + F(2, 3) + "; " + F("−3", 5) + ").",
          buoc: [
            { hoi: "Nhân ba đẳng thức vế theo vế, " + Q("xyz", 2) + " bằng bao nhiêu?",
              nho: "Nhân ba phân số: " + F(1, 3) + " · " + F("−2", 5) + " · " + F("−3", 10) + ".",
              chon: [
                [Q("xyz", 2) + " = " + F(6, 150) + " = " + F(1, 25), true, "Đúng. Hai thừa số âm nên tích dương."],
                [Q("xyz", 2) + " = " + F("−1", 25), false, "Có hai thừa số âm nên tích dương. Hơn nữa bình phương không thể âm."]],
              dat: Q("xyz", 2) + " = " + F(1, 25) },
            { hoi: "Từ " + Q("xyz", 2) + " = " + F(1, 25) + " suy ra xyz bằng bao nhiêu?",
              nho: "Hai số đối nhau có cùng bình phương.",
              chon: [
                ["xyz = " + F(1, 5) + " hoặc xyz = " + F("−1", 5), true, "Đúng. Phải xét cả hai trường hợp."],
                ["xyz = " + F(1, 5), false, "Còn " + Q(F("−1", 5), 2) + " = " + F(1, 25) + " nữa, đừng bỏ sót."]],
              dat: "xyz = " + F(1, 5) + " hoặc " + F("−1", 5) },
            { hoi: "Với xyz = " + F(1, 5) + ", tìm x, y, z.",
              nho: "x = xyz : yz; y = xyz : zx; z = xyz : xy.",
              chon: [
                ["x = " + F("−1", 2) + ", y = " + F("−2", 3) + ", z = " + F(3, 5), true, "Đúng. Thử lại: xy = " + F(1, 3) + ", yz = " + F("−2", 5) + ", zx = " + F("−3", 10) + "."],
                ["x = " + F(1, 2) + ", y = " + F(2, 3) + ", z = " + F(3, 5), false, "x = " + F(1, 5) + " : " + F("−2", 5) + " = " + F("−1", 2) + ", không phải " + F(1, 2) + "; thử lại zx sẽ thấy sai."]],
              dat: "(" + F("−1", 2) + "; " + F("−2", 3) + "; " + F(3, 5) + "); trường hợp xyz = " + F("−1", 5) + " cho các số đối: (" + F(1, 2) + "; " + F(2, 3) + "; " + F("−3", 5) + ")" }] }],
      nhin: [
        ["Vì sao trường hợp thứ hai cho đúng các số đối?", "Đổi dấu cả x, y, z thì mỗi tích hai số không đổi, nên (−x; −y; −z) cũng là nghiệm."],
        ["Thử bài tương tự: xy = 2, yz = 6, zx = 3.", Q("xyz", 2) + " = 36, xyz = 6 hoặc −6; được (1; 2; 3) hoặc (−1; −2; −3)."]],
      steps: [
        "Nhân ba đẳng thức: (xy)(yz)(zx) = " + F(1, 3) + " · " + F("−2", 5) + " · " + F("−3", 10) + ", tức là " + Q("xyz", 2) + " = " + F(6, 150) + " = " + F(1, 25) + ".",
        "Suy ra xyz = " + F(1, 5) + " hoặc xyz = " + F("−1", 5) + ".",
        "Với xyz = " + F(1, 5) + ": x = " + F(1, 5) + " : " + F("−2", 5) + " = " + F("−1", 2) + "; y = " + F(1, 5) + " : " + F("−3", 10) + " = " + F("−2", 3) + "; z = " + F(1, 5) + " : " + F(1, 3) + " = " + F(3, 5) + ".",
        "Với xyz = " + F("−1", 5) + ": x = " + F(1, 2) + "; y = " + F(2, 3) + "; z = " + F("−3", 5) + ".",
        "Thử lại: cả hai bộ số đều thoả mãn ba đẳng thức."
      ],
      dap: "Có hai bộ số (x; y; z) thoả mãn: (" + F("−1", 2) + "; " + F("−2", 3) + "; " + F(3, 5) + ") và (" + F(1, 2) + "; " + F(2, 3) + "; " + F("−3", 5) + ")."
    },
    {
      id: "hsg3", lv: "HSG", mix: [1, 2, 3],
      de: "Cho S = " + F(1, P(2, 2)) + " + " + F(1, P(3, 2)) + " + " + F(1, P(4, 2)) + " + … + " + F(1, P(100, 2)) + ". Chứng minh " + F(2, 5) + " < S < " + F(3, 4) + ".",
      goi: "Với n ≥ 2: " + F(1, "n · (n + 1)") + " < " + F(1, P("n", 2)) + " < " + F(1, "(n − 1) · n") + ", và " + F(1, "(n − 1) · n") + " = " + F(1, "n − 1") + " − " + F(1, "n") + ".",
      hieu: { gt: "S là tổng 99 phân số " + F(1, P("n", 2)) + " với n = 2, 3, …, 100.", kl: F(2, 5) + " < S < " + F(3, 4) + ".",
        hoi: [
          ["Có tính đúng S được không?", "Không có cách tính gọn. Ta chặn S giữa hai tổng tính được."],
          ["Tổng " + F(1, "1 · 2") + " + " + F(1, "2 · 3") + " + … tính thế nào?", "Mỗi số hạng " + F(1, "k(k + 1)") + " = " + F(1, "k") + " − " + F(1, "k + 1") + ", cộng lại các số ở giữa triệt tiêu nhau."]] },
      nguoc: [
        { ten: "Chặn trên", dich: "S < " + F(3, 4),
          sd: [["Tính tổng chặn trên", [3]], ["Giữ " + F(1, 4) + ", thay các số hạng từ " + F(1, P(3, 2)) + " bằng số lớn hơn", [2]]],
          gt: F(1, P("n", 2)) + " < " + F(1, "(n − 1) · n"),
          ket: "S < " + F(1, 4) + " + " + F(1, 2) + " − " + F(1, 100) + " < " + F(3, 4) + ".",
          buoc: [
            { hoi: "Nếu thay ngay từ số hạng đầu " + F(1, P(2, 2)) + " < " + F(1, "1 · 2") + " thì được S < bao nhiêu? Có đủ không?",
              nho: F(1, "1 · 2") + " + … + " + F(1, "99 · 100") + " = 1 − " + F(1, 100) + ".",
              chon: [
                ["S < 1 − " + F(1, 100) + ", chưa đủ để có S < " + F(3, 4), true, "Đúng. Chặn quá thô; nên giữ nguyên số hạng đầu " + F(1, 4) + " và chỉ thay từ " + F(1, 9) + " trở đi."],
                ["S < " + F(1, 2) + ", đủ rồi", false, "Tổng chặn trên bằng 1 − " + F(1, 100) + " = " + F(99, 100) + ", lớn hơn " + F(3, 4) + "."]],
              dat: "Giữ " + F(1, 4) + ", thay từ " + F(1, P(3, 2)) },
            { hoi: "Từ n = 3 đến 100: " + F(1, "2 · 3") + " + " + F(1, "3 · 4") + " + … + " + F(1, "99 · 100") + " bằng bao nhiêu?",
              nho: F(1, "k(k + 1)") + " = " + F(1, "k") + " − " + F(1, "k + 1") + ".",
              chon: [
                [F(1, 2) + " − " + F(1, 100), true, "Đúng. Nên S < " + F(1, 4) + " + " + F(1, 2) + " − " + F(1, 100) + " = " + F(3, 4) + " − " + F(1, 100) + " < " + F(3, 4) + "."],
                ["1 − " + F(1, 100), false, "Tổng bắt đầu từ " + F(1, "2 · 3") + " = " + F(1, 2) + " − " + F(1, 3) + ", nên số đầu là " + F(1, 2) + "."]],
              dat: "S < " + F(3, 4) }] },
        { ten: "Chặn dưới", dich: "S > " + F(2, 5),
          sd: [["Tính tổng chặn dưới", [5]], ["Thay mỗi số hạng bằng số nhỏ hơn " + F(1, "n(n + 1)"), [4]]],
          gt: F(1, P("n", 2)) + " > " + F(1, "n · (n + 1)"),
          ket: "S > " + F(1, 2) + " − " + F(1, 101) + " = " + F(99, 202) + " > " + F(2, 5) + ".",
          buoc: [
            { hoi: "Thay " + F(1, P("n", 2)) + " bằng " + F(1, "n(n + 1)") + " thì tổng bằng bao nhiêu?",
              nho: F(1, "2 · 3") + " + " + F(1, "3 · 4") + " + … + " + F(1, "100 · 101") + ".",
              chon: [
                [F(1, 2) + " − " + F(1, 101) + " = " + F(99, 202), true, "Đúng. Và " + F(99, 202) + " > " + F(2, 5) + " vì 99 · 5 = 495 > 404 = 2 · 202."],
                [F(1, 2) + " − " + F(1, 100), false, "Số hạng cuối là " + F(1, "100 · 101") + ", nên trừ " + F(1, 101) + "."]],
              dat: "S > " + F(99, 202) + " > " + F(2, 5) }] }],
      nhin: [
        ["Vì sao chặn trên phải giữ lại số hạng đầu?", "Thay " + F(1, 4) + " bằng " + F(1, 2) + " làm tổng tăng thêm " + F(1, 4) + ", quá nhiều. Giữ vài số hạng đầu thì chặn sát hơn."],
        ["Giá trị thật của S khoảng bao nhiêu?", "Khoảng 0,635, nằm giữa " + F(99, 202) + " ≈ 0,49 và " + F(3, 4) + " = 0,75."]],
      steps: [
        "Với n ≥ 2: (n − 1) · n < n<sup>2</sup> < n · (n + 1), nên " + F(1, "n · (n + 1)") + " < " + F(1, P("n", 2)) + " < " + F(1, "(n − 1) · n") + ".",
        "Chặn trên: S < " + F(1, 4) + " + " + F(1, "2 · 3") + " + " + F(1, "3 · 4") + " + … + " + F(1, "99 · 100") + ".",
        "Mà " + F(1, "2 · 3") + " + … + " + F(1, "99 · 100") + " = (" + F(1, 2) + " − " + F(1, 3) + ") + … + (" + F(1, 99) + " − " + F(1, 100) + ") = " + F(1, 2) + " − " + F(1, 100) + ". Do đó S < " + F(3, 4) + " − " + F(1, 100) + " < " + F(3, 4) + ".",
        "Chặn dưới: S > " + F(1, "2 · 3") + " + " + F(1, "3 · 4") + " + … + " + F(1, "100 · 101") + ".",
        "Tổng này bằng " + F(1, 2) + " − " + F(1, 101) + " = " + F(99, 202) + " > " + F(2, 5) + " (vì 99 · 5 = 495 > 404 = 2 · 202). Vậy " + F(2, 5) + " < S < " + F(3, 4) + "."
      ],
      dap: "Đã chứng minh " + F(2, 5) + " < S < " + F(3, 4) + "."
    }
  ];

  window.TL_DATA = {
    bai: "cc7",
    ten: "Bài tập cuối chương I",
    items: ITEMS,
    /* Chia theo dạng như Bài 16 (thầy chốt lại 27/11/2026). Mỗi dạng có phương pháp giải, bài xếp từ dễ đến khó,
       một bài mẫu giải theo 4 bước, bài tự luyện [đề, gợi ý, đáp số]. Bài HSG để riêng ở mục Dành cho HSG. */
    dang: [
      { ten: "Số đối, so sánh và sắp xếp số hữu tỉ",
        pp: ["Số đối của a là −a; số đối của " + F("a", "b") + " là " + F("−a", "b") + ".",
             "So sánh: đưa về cùng dạng (cùng mẫu dương hoặc cùng là số thập phân) rồi so sánh; số âm nhỏ hơn 0, 0 nhỏ hơn số dương.",
             "Với luỹ thừa: xét dấu trước (cơ số âm, số mũ chẵn thì dương, số mũ lẻ thì âm), rồi mới so sánh giá trị.",
             "Sắp xếp: chia thành nhóm số âm, số 0, số dương; so sánh trong từng nhóm."],
        ids: ["nb1", "vd4"],
        tl: [
          ["Sắp xếp theo thứ tự tăng dần: 0,3;  " + F("−1", 2) + ";  " + F(1, 4) + ";  −0,45.", "Hai số âm, hai số dương; đưa về số thập phân.", F("−1", 2) + ";  −0,45;  " + F(1, 4) + ";  0,3."],
          ["So sánh " + Q(F("−1", 2), 5) + " và " + Q(F("−1", 3), 4) + ".", "Xét dấu của mỗi luỹ thừa.", Q(F("−1", 2), 5) + " < " + Q(F("−1", 3), 4) + "."]] },
      { ten: "Thực hiện phép tính, luỹ thừa, tính hợp lí",
        pp: ["Thứ tự: trong ngoặc trước; luỹ thừa → nhân và chia → cộng và trừ.",
             "Số thập phân và phân số cùng có trong biểu thức: đổi về cùng một dạng.",
             "Luỹ thừa cùng cơ số: nhân thì cộng số mũ, chia thì trừ số mũ; luỹ thừa của luỹ thừa thì nhân số mũ.",
             "Biểu thức có luỹ thừa của 2, 3, 4, 6, 9: đưa về luỹ thừa của 2 và 3 rồi rút gọn.",
             "Tính hợp lí: dùng tính chất giao hoán, kết hợp, phân phối (đặt thừa số chung)."],
        ids: ["nb2", "nb3", "th1", "th2", "vd1"],
        tl: [
          ["Tính: a) " + F(2, 5) + " − " + F(3, 4) + ";  b) (−1,2) · " + F(5, 6) + ".", "a) Mẫu chung 20. b) −1,2 = " + F("−6", 5) + ".", "a) " + F("−7", 20) + ";  b) −1."],
          ["Viết dưới dạng một luỹ thừa: a) " + Q(F("−1", 3), 4) + " · " + Q(F("−1", 3), 3) + ";  b) " + P("0,6", 8) + " : " + P("0,6", 5) + ".", "Cùng cơ số: nhân thì cộng số mũ, chia thì trừ số mũ.", "a) " + Q(F("−1", 3), 7) + ";  b) " + P("0,6", 3) + "."],
          ["Tính hợp lí: " + F("−3", 8) + " · " + F(5, 11) + " − " + F(3, 8) + " · " + F(6, 11) + " + " + F(1, 8) + ".", "Đặt " + F("−3", 8) + " làm thừa số chung của hai tích đầu.", F("−1", 4) + "."],
          ["Tính " + F(P(2, 3) + " · " + P(9, 2), P(6, 3) + " · 3") + ".", "Đưa về luỹ thừa của 2 và 3.", "1."]] },
      { ten: "Tìm x",
        pp: ["Dùng quy tắc chuyển vế: chuyển một số hạng sang vế kia thì đổi dấu.",
             "Có ngoặc: coi cả ngoặc là một khối, tìm khối trước rồi tìm x.",
             "Khối có luỹ thừa: lập phương bằng một số thì khối bằng một số duy nhất; bình phương bằng một số dương thì có hai trường hợp (hai số đối nhau).",
             "Thử lại kết quả; nhiều giá trị thì viết x ∈ {…}."],
        ids: ["th3", "vd2"],
        tl: [
          ["Tìm x, biết " + F(1, 2) + " − 3x = " + F("−5", 2) + ".", "Chuyển vế: 3x = " + F(1, 2) + " + " + F(5, 2) + ".", "x = 1."],
          ["Tìm x, biết " + Q("x + " + F(1, 2), 2) + " = " + F(9, 16) + ".", "Hai số đối nhau có cùng bình phương.", "x ∈ {" + F(1, 4) + "; " + F("−5", 4) + "}" + "."]] },
      { ten: "Bài toán thực tế",
        pp: ["Đọc kĩ \"phân số của số nào\": của cả số lúc đầu hay của số còn lại.",
             "Tính lần lượt từng bước, ghi rõ đơn vị.",
             "Biết giá trị phân số của một số, muốn tìm số đó thì lấy giá trị chia cho phân số."],
        ids: ["vd3"],
        tl: [
          ["Lớp 7A có 40 học sinh. Số học sinh giỏi chiếm " + F(1, 4) + " số học sinh cả lớp, số học sinh khá bằng " + F(3, 5) + " số học sinh còn lại. Tính số học sinh khá.", "Số học sinh còn lại: 40 − 40 · " + F(1, 4) + ".", "18 học sinh."],
          ["Một bể đang chứa " + F(3, 5) + " thể tích. Bơm thêm " + F(1, 4) + " thể tích bể thì trong bể có 1,7 m³ nước. Tính thể tích bể.", "Phân số chỉ lượng nước sau khi bơm: " + F(3, 5) + " + " + F(1, 4) + ".", "2 m³."]] }
    ],
    /* Làm sai câu Vận dụng (theo phần kiến thức) → bài mẫu giải theo 4 bước.
       Câu hỏi của trang có thể mang khóa gốc của từng bài (ct, nh, ch, dn, tt, nc...) hoặc khóa chương (ss, pt, lt, tc). */
    mau: { ids: ["vd4", "vd1", "vd2", "vd3"], theoPhan: { ss: "vd4", kn: "vd4", pt: "vd3", ct: "vd3", nh: "vd3", ch: "vd3", lt: "vd1", dn: "vd1", nc: "vd1", tt: "vd1", tc: "vd2", cv: "vd2" } }
  };
})();
