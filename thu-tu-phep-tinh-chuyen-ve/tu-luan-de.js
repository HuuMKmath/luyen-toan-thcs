/* Bài tập tự luận – Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế (Toán 7, Kết nối tri thức).
   Chia theo dạng, mỗi dạng có phương pháp giải và bài tự luyện; mục Dành cho HSG riêng, giải theo 4 bước.
   Kiến thức dùng: Bài 1 đến Bài 4 và Toán 6. */
(function () {
  "use strict";
  var F = function (n, d) { return '<span class="fr"><span>' + n + "</span><span>" + d + "</span></span>"; };
  var P = function (b, e) { return b + "<sup>" + e + "</sup>"; };
  var Q = function (b, e) { return "(" + b + ")<sup>" + e + "</sup>"; };

  var ITEMS = [
    /* ===== Dạng 1. Tính giá trị biểu thức ===== */
    {
      id: "nb1", lv: "NB",
      de: "Tính: a) 2,5 − 0,5 · " + P(4, 2) + ";  b) " + F(3, 4) + " − " + F(1, 2) + " · " + Q("−2", 3) + ";  c) 12 : " + F("−3", 4) + " + 5.",
      goi: "Không có ngoặc: luỹ thừa trước, rồi nhân và chia, cuối cùng cộng và trừ.",
      steps: [
        "a) 2,5 − 0,5 · " + P(4, 2) + " = 2,5 − 0,5 · 16 = 2,5 − 8 = −5,5.",
        "b) " + F(3, 4) + " − " + F(1, 2) + " · " + Q("−2", 3) + " = " + F(3, 4) + " − " + F(1, 2) + " · (−8) = " + F(3, 4) + " − (−4) = " + F(3, 4) + " + 4 = " + F(19, 4) + ".",
        "c) 12 : " + F("−3", 4) + " + 5 = 12 · " + F(4, "−3") + " + 5 = −16 + 5 = −11."
      ],
      dap: "a) −5,5; b) " + F(19, 4) + "; c) −11.",
      loi: "Câu a làm 2,5 − 0,5 trước (ra 32); câu b tính " + Q("−2", 3) + " = 8 hoặc −6."
    },
    {
      id: "th1", lv: "TH",
      de: "Tính: a) [" + Q(F("−1", 2), 2) + " + " + F(3, 4) + "] : (−2) + 1;  b) 5 − {2 − [" + F(3, 2) + " − " + Q("1 − " + F(1, 2), 2) + "]}.",
      goi: "Làm trong ngoặc tròn ( ) trước, rồi ngoặc vuông [ ], rồi ngoặc nhọn { }. Trong mỗi ngoặc vẫn làm luỹ thừa trước.",
      pt: [
        { ten: "Câu a", dich: "[" + Q(F("−1", 2), 2) + " + " + F(3, 4) + "] : (−2) + 1", sd: [["Chia cho −2 rồi cộng 1", [2]], ["Tính trong ngoặc vuông: " + F(1, 4) + " + " + F(3, 4) + " = 1", [1]]], gt: "Thứ tự thực hiện phép tính" },
        { ten: "Câu b", dich: "5 − {2 − [" + F(3, 2) + " − " + Q("1 − " + F(1, 2), 2) + "]}", sd: [["Ngoặc nhọn: 2 − " + F(5, 4) + ", rồi 5 trừ kết quả", [5]], ["Ngoặc vuông: " + F(3, 2) + " − " + F(1, 4) + " = " + F(5, 4), [4]], ["Ngoặc tròn: " + Q(F(1, 2), 2) + " = " + F(1, 4), [3]]], gt: "Thứ tự ( ), [ ], { }" }],
      steps: [
        "a) [" + Q(F("−1", 2), 2) + " + " + F(3, 4) + "] : (−2) + 1 = (" + F(1, 4) + " + " + F(3, 4) + ") : (−2) + 1",
        "= 1 : (−2) + 1 = " + F("−1", 2) + " + 1 = " + F(1, 2) + ".",
        "b) 5 − {2 − [" + F(3, 2) + " − " + Q("1 − " + F(1, 2), 2) + "]} = 5 − {2 − [" + F(3, 2) + " − " + Q(F(1, 2), 2) + "]}",
        "= 5 − {2 − [" + F(3, 2) + " − " + F(1, 4) + "]} = 5 − {2 − " + F(5, 4) + "}",
        "= 5 − " + F(3, 4) + " = " + F(17, 4) + "."
      ],
      dap: "a) " + F(1, 2) + "; b) " + F(17, 4) + ".",
      loi: "Câu a cộng 1 trước rồi mới chia; câu b bỏ ngoặc sai dấu ở ngoặc nhọn.",
      mix: [3]
    },
    {
      id: "vd1", lv: "VD",
      de: "Tính B = " + Q(F("−1", 2), 3) + " · 16 − [2 − " + Q("0,75 + " + F(1, 4), 2) + "] : " + F(1, 2) + ".",
      goi: "B là hiệu của hai phần. Phần thứ hai có ngoặc vuông lồng ngoặc tròn: làm từ trong ra ngoài. 0,75 = " + F(3, 4) + ".",
      pt: [
        { ten: "Cả bài", dich: "Tính B", sd: [["B = (−2) − 2", [4]], ["Phần thứ hai: 1 : " + F(1, 2) + " = 2", [3]], ["Ngoặc tròn " + Q("0,75 + " + F(1, 4), 2) + " = 1; ngoặc vuông 2 − 1 = 1", [2]], ["Phần thứ nhất: " + F("−1", 8) + " · 16 = −2", [1]]], gt: "Biểu thức B" }],
      hieu: { gt: "B = " + Q(F("−1", 2), 3) + " · 16 − [2 − " + Q("0,75 + " + F(1, 4), 2) + "] : " + F(1, 2) + ".", kl: "Tính B.",
        hoi: [
          ["Dấu \"−\" ở giữa chia B thành hai phần nào? Phần nào phải làm trước?", "Phần một: " + Q(F("−1", 2), 3) + " · 16. Phần hai: [2 − " + Q("0,75 + " + F(1, 4), 2) + "] : " + F(1, 2) + ". Phép trừ ở giữa làm sau cùng; mỗi phần tính riêng trước."],
          ["Trong ngoặc tròn có hai số nào? Có gì đặc biệt?", "0,75 và " + F(1, 4) + ": cộng lại bằng 1, luỹ thừa của 1 vẫn là 1."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tính B",
        sd: [["B = (−2) − 2 = −4", [4]], ["Phần hai = 1 : " + F(1, 2) + " = 2", [3]], ["Ngoặc vuông: 2 − " + P(1, 2) + " = 1", [2]], ["Phần một = " + F("−1", 8) + " · 16 = −2", [1]]],
        gt: "Thứ tự thực hiện các phép tính",
        ket: "Phần một bằng −2, phần hai bằng 2, nên B = −2 − 2 = −4.",
        buoc: [
        { hoi: "Phép tính nào trong B làm sau cùng?",
          nho: "Không có ngoặc bao ngoài: luỹ thừa, rồi nhân chia, rồi cộng trừ.",
          chon: [
            ["Phép trừ ở giữa hai phần, nên cần tính phần một và phần hai trước", true, "Đúng. B = (phần một) − (phần hai)."],
            ["Phép chia cho " + F(1, 2) + " làm sau cùng", false, "Chia thuộc phần hai; nhân, chia làm trước phép trừ."]],
          dat: "Phần một và phần hai" },
        { hoi: "Tính phần một: " + Q(F("−1", 2), 3) + " · 16.",
          nho: "Luỹ thừa bậc lẻ của số âm là số âm.",
          chon: [
            [Q(F("−1", 2), 3) + " = " + F("−1", 8) + ", nên phần một = " + F("−1", 8) + " · 16 = −2", true, "Đúng."],
            [Q(F("−1", 2), 3) + " = " + F(1, 8), false, "Số mũ 3 lẻ nên kết quả âm."]],
          dat: "Phần một = −2" },
        { hoi: "Phần hai có ngoặc lồng nhau. Làm theo thứ tự nào?",
          nho: "Ngoặc tròn ( ) → ngoặc vuông [ ]; trong ngoặc vẫn làm luỹ thừa trước.",
          chon: [
            ["Ngoặc tròn: 0,75 + " + F(1, 4) + " = 1, bình phương được 1; ngoặc vuông: 2 − 1 = 1; rồi 1 : " + F(1, 2) + " = 2", true, "Đúng."],
            ["Lấy 2 − 0,75 trước", false, "Phải làm xong ngoặc tròn và luỹ thừa của nó trước."]],
          dat: "Phần hai = 2" }] }],
      nhin: [
        ["Thử lại bằng máy tính cầm tay (nhập đúng các dấu ngoặc).", "Máy cho −4. Đúng."],
        ["Nếu bỏ ngoặc vuông, viết B' = " + Q(F("−1", 2), 3) + " · 16 − 2 − " + Q("0,75 + " + F(1, 4), 2) + " : " + F(1, 2) + " thì kết quả thế nào?", "B' = −2 − 2 − 1 : " + F(1, 2) + " = −4 − 2 = −6, khác B: dấu ngoặc làm thay đổi thứ tự và kết quả."]],
      steps: [
        "B = " + Q(F("−1", 2), 3) + " · 16 − [2 − " + Q("0,75 + " + F(1, 4), 2) + "] : " + F(1, 2) + " = " + F("−1", 8) + " · 16 − [2 − " + Q(F(3, 4) + " + " + F(1, 4), 2) + "] : " + F(1, 2),
        "= −2 − [2 − " + P(1, 2) + "] : " + F(1, 2) + " = −2 − 1 : " + F(1, 2),
        "= −2 − 1 · 2 = −2 − 2",
        "= −4."
      ],
      dap: "B = −4.",
      loi: "Tính " + Q(F("−1", 2), 3) + " = " + F(1, 8) + " (ra B = 0); chia cho " + F(1, 2) + " mà lại nhân với " + F(1, 2) + ".",
      mix: [3]
    },

    /* ===== Dạng 2. Quy tắc chuyển vế, tìm x ===== */
    {
      id: "nb2", lv: "NB",
      de: "Tìm x, biết: a) x + 3,5 = 1,2;  b) x − " + F(2, 3) + " = " + F("−1", 6) + ";  c) " + F(5, 4) + " − x = " + F(1, 2) + ".",
      goi: "Chuyển một số hạng sang vế kia thì phải đổi dấu số hạng đó. Câu c: chuyển x sang vế phải hoặc chuyển " + F(5, 4) + " sang vế phải.",
      steps: [
        "a) x = 1,2 − 3,5 = −2,3.",
        "b) x = " + F("−1", 6) + " + " + F(2, 3) + " = " + F("−1", 6) + " + " + F(4, 6) + " = " + F(3, 6) + " = " + F(1, 2) + ".",
        "c) Chuyển x sang vế phải, " + F(1, 2) + " sang vế trái: " + F(5, 4) + " − " + F(1, 2) + " = x, nên x = " + F(3, 4) + "."
      ],
      dap: "a) x = −2,3; b) x = " + F(1, 2) + "; c) x = " + F(3, 4) + ".",
      loi: "Chuyển vế mà không đổi dấu (câu a ra x = 4,7); câu c ra x = " + F(1, 2) + " − " + F(5, 4) + " = " + F("−3", 4) + "."
    },
    {
      id: "th2", lv: "TH",
      de: "Tìm x, biết: a) 2x − " + F(1, 3) + " = " + F(5, 3) + ";  b) " + F(3, 4) + " + " + F(1, 2) + " · x = " + F("−1", 4) + ";  c) 1,5 − (x + " + F(2, 5) + ") = 0,3.",
      goi: "Chuyển các số không chứa x sang một vế, giữ phần chứa x ở vế kia; sau đó chia cho hệ số của x. Câu c: bỏ ngoặc trước.",
      pt: [
        { ten: "Câu a", dich: "Tìm x trong 2x − " + F(1, 3) + " = " + F(5, 3), sd: [["x = 2 : 2", [1]], ["Chuyển vế: 2x = " + F(5, 3) + " + " + F(1, 3), [1]]], gt: "Quy tắc chuyển vế" },
        { ten: "Câu b", dich: "Tìm x trong " + F(3, 4) + " + " + F(1, 2) + " · x = " + F("−1", 4), sd: [["x = −1 : " + F(1, 2), [3]], ["Chuyển vế: " + F(1, 2) + " · x = " + F("−1", 4) + " − " + F(3, 4) + " = −1", [2]]], gt: "Quy tắc chuyển vế" },
        { ten: "Câu c", dich: "Tìm x trong 1,5 − (x + " + F(2, 5) + ") = 0,3", sd: [["Chuyển vế rồi tìm x", [5]], ["Bỏ ngoặc: 1,5 − x − 0,4 = 0,3", [4]]], gt: "Quy tắc dấu ngoặc, quy tắc chuyển vế" }],
      steps: [
        "a) 2x = " + F(5, 3) + " + " + F(1, 3) + " = 2, nên x = 2 : 2 = 1.",
        "b) " + F(1, 2) + " · x = " + F("−1", 4) + " − " + F(3, 4) + " = −1.",
        "x = −1 : " + F(1, 2) + " = −2.",
        "c) Bỏ ngoặc: 1,5 − x − 0,4 = 0,3, tức là 1,1 − x = 0,3.",
        "Chuyển vế: 1,1 − 0,3 = x, nên x = 0,8."
      ],
      dap: "a) x = 1; b) x = −2; c) x = 0,8.",
      loi: "Câu b chia cho " + F(1, 2) + " trước khi chuyển " + F(3, 4) + "; câu c bỏ ngoặc thành 1,5 − x + 0,4."
    },
    {
      id: "vd2", lv: "VD",
      de: "Tìm x, biết: a) " + F(2, 3) + " · x − " + F(1, 2) + " = " + F(1, 4) + " · x + " + F(1, 6) + ";  b) 3 · " + Q("x − " + F(1, 3), 2) + " − " + F(1, 4) + " = " + F(1, 2) + ".",
      goi: "a) Chuyển các số hạng chứa x về một vế, các số về vế kia. b) Tìm " + Q("x − " + F(1, 3), 2) + " trước; bình phương bằng " + F(1, 4) + " có hai trường hợp.",
      pt: [
        { ten: "Câu a", dich: "Tìm x", sd: [["x = " + F(2, 3) + " : " + F(5, 12), [3]], ["(" + F(2, 3) + " − " + F(1, 4) + ") · x = " + F(1, 6) + " + " + F(1, 2), [2]], ["Chuyển " + F(1, 4) + " · x sang trái, −" + F(1, 2) + " sang phải", [1]]], gt: "x có ở cả hai vế" },
        { ten: "Câu b", dich: "Tìm x", sd: [["x − " + F(1, 3) + " = " + F(1, 2) + " hoặc x − " + F(1, 3) + " = " + F("−1", 2), [6, 7]], [Q("x − " + F(1, 3), 2) + " = " + F(1, 4), [5]], ["Chuyển vế: 3 · " + Q("x − " + F(1, 3), 2) + " = " + F(3, 4), [4]]], gt: "Biểu thức chứa luỹ thừa bậc hai" }],
      hieu: { gt: "a) " + F(2, 3) + " · x − " + F(1, 2) + " = " + F(1, 4) + " · x + " + F(1, 6) + ". b) 3 · " + Q("x − " + F(1, 3), 2) + " − " + F(1, 4) + " = " + F(1, 2) + ".", kl: "Tìm x.",
        hoi: [
          ["Câu a: x xuất hiện ở đâu? Khác gì các bài tìm x quen thuộc?", "x có ở cả hai vế. Phải gom các số hạng chứa x về cùng một vế."],
          ["Câu b: phần chứa x là gì? Nên coi phần nào là \"một khối\"?", "Phần chứa x là " + Q("x − " + F(1, 3), 2) + ". Coi cả khối đó như một số chưa biết, tìm nó trước."]] },
      nguoc: [
      { ten: "Câu a", dich: "Tìm x",
        sd: [["x = " + F(2, 3) + " : " + F(5, 12) + " = " + F(8, 5), [3]], [F(5, 12) + " · x = " + F(2, 3), [2]], ["Gom x về vế trái, số về vế phải", [1]]],
        gt: "Quy tắc chuyển vế",
        ket: F(2, 3) + " · x − " + F(1, 4) + " · x = " + F(1, 6) + " + " + F(1, 2) + ", tức " + F(5, 12) + " · x = " + F(2, 3) + ", x = " + F(8, 5) + ".",
        buoc: [
        { hoi: "Muốn tìm x, cần đưa đẳng thức về dạng nào?",
          nho: "Dạng a · x = b (a ≠ 0) thì x = b : a.",
          chon: [
            ["Dạng (một số) · x = (một số): gom mọi số hạng chứa x về một vế", true, "Đúng. Chuyển " + F(1, 4) + " · x sang trái, −" + F(1, 2) + " sang phải."],
            ["Chia cả hai vế cho x", false, "Chưa biết x có khác 0 không, và cũng không gom được."]],
          dat: "Đưa về dạng a · x = b" },
        { hoi: "Chuyển vế xong, vế trái là " + F(2, 3) + " · x − " + F(1, 4) + " · x. Viết gọn thế nào?",
          nho: "a · x − b · x = (a − b) · x.",
          chon: [
            ["(" + F(2, 3) + " − " + F(1, 4) + ") · x = " + F(5, 12) + " · x; vế phải " + F(1, 6) + " + " + F(1, 2) + " = " + F(2, 3), true, "Đúng. " + F(5, 12) + " · x = " + F(2, 3) + "."],
            [F(2, 3) + " · x − " + F(1, 4) + " · x = " + F(1, "−1") + " · x", false, "Trừ hai phân số phải quy đồng: " + F(8, 12) + " − " + F(3, 12) + " = " + F(5, 12) + "."]],
          dat: F(5, 12) + " · x = " + F(2, 3) }] },
      { ten: "Câu b", dich: "Tìm x",
        sd: [["x ∈ {" + F(5, 6) + "; " + F("−1", 6) + "}", [6, 7]], [Q("x − " + F(1, 3), 2) + " = " + F(1, 4), [5]], ["3 · " + Q("x − " + F(1, 3), 2) + " = " + F(3, 4), [4]]],
        gt: "Quy tắc chuyển vế; " + Q(F(1, 2), 2) + " = " + Q(F("−1", 2), 2) + " = " + F(1, 4),
        ket: "x − " + F(1, 3) + " = " + F(1, 2) + " hoặc x − " + F(1, 3) + " = " + F("−1", 2) + ", nên x ∈ {" + F(5, 6) + "; " + F("−1", 6) + "}" + ".",
        buoc: [
        { hoi: "Đầu tiên nên chuyển số nào sang vế phải?",
          nho: "Tách dần từ ngoài vào trong: phép tính làm sau cùng thì gỡ ra trước.",
          chon: [
            ["Chuyển −" + F(1, 4) + ": 3 · " + Q("x − " + F(1, 3), 2) + " = " + F(1, 2) + " + " + F(1, 4) + " = " + F(3, 4), true, "Đúng. Sau đó chia cho 3."],
            ["Chia cả hai vế cho 3 ngay", false, "Vế trái là một hiệu, phải chuyển −" + F(1, 4) + " trước rồi mới chia."]],
          dat: "3 · " + Q("x − " + F(1, 3), 2) + " = " + F(3, 4) },
        { hoi: Q("x − " + F(1, 3), 2) + " = " + F(1, 4) + ". Có mấy giá trị của x − " + F(1, 3) + "?",
          nho: "Bình phương của hai số đối nhau thì bằng nhau.",
          chon: [
            ["Hai giá trị: " + F(1, 2) + " và " + F("−1", 2), true, "Đúng. Từ đó x ∈ {" + F(5, 6) + "; " + F("−1", 6) + "}" + "."],
            ["Một giá trị " + F(1, 2), false, "Thiếu " + F("−1", 2) + ": " + Q(F("−1", 2), 2) + " cũng bằng " + F(1, 4) + "."]],
          dat: "x − " + F(1, 3) + " = " + F(1, 2) + " hoặc x − " + F(1, 3) + " = " + F("−1", 2) }] }],
      nhin: [
        ["Thử lại câu a với x = " + F(8, 5) + ".", "Vế trái: " + F(2, 3) + " · " + F(8, 5) + " − " + F(1, 2) + " = " + F(16, 15) + " − " + F(1, 2) + " = " + F(17, 30) + ". Vế phải: " + F(1, 4) + " · " + F(8, 5) + " + " + F(1, 6) + " = " + F(2, 5) + " + " + F(1, 6) + " = " + F(17, 30) + ". Đúng."],
        ["Thử lại câu b với x = " + F("−1", 6) + ".", F("−1", 6) + " − " + F(1, 3) + " = " + F("−1", 2) + "; 3 · " + F(1, 4) + " − " + F(1, 4) + " = " + F(1, 2) + ". Đúng."]],
      steps: [
        "a) Chuyển vế: " + F(2, 3) + " · x − " + F(1, 4) + " · x = " + F(1, 6) + " + " + F(1, 2) + ".",
        "(" + F(2, 3) + " − " + F(1, 4) + ") · x = " + F(2, 3) + ", tức là " + F(5, 12) + " · x = " + F(2, 3) + ".",
        "x = " + F(2, 3) + " : " + F(5, 12) + " = " + F(2, 3) + " · " + F(12, 5) + " = " + F(8, 5) + ".",
        "b) 3 · " + Q("x − " + F(1, 3), 2) + " = " + F(1, 2) + " + " + F(1, 4) + " = " + F(3, 4) + ".",
        Q("x − " + F(1, 3), 2) + " = " + F(3, 4) + " : 3 = " + F(1, 4) + ", nên x − " + F(1, 3) + " = " + F(1, 2) + " hoặc x − " + F(1, 3) + " = " + F("−1", 2) + ".",
        "x − " + F(1, 3) + " = " + F(1, 2) + " thì x = " + F(1, 2) + " + " + F(1, 3) + " = " + F(5, 6) + ".",
        "x − " + F(1, 3) + " = " + F("−1", 2) + " thì x = " + F("−1", 2) + " + " + F(1, 3) + " = " + F("−1", 6) + ". Vậy x ∈ {" + F(5, 6) + "; " + F("−1", 6) + "}" + "."
      ],
      dap: "a) x = " + F(8, 5) + "; b) x ∈ {" + F(5, 6) + "; " + F("−1", 6) + "}" + ".",
      loi: "Câu a chuyển " + F(1, 4) + " · x sang trái nhưng không đổi dấu; câu b bỏ sót giá trị âm.",
      mix: [3]
    },

    /* ===== Dạng 3. Bài toán thực tế ===== */
    {
      id: "vd3", lv: "VD",
      de: "Bác An mua một số ki-lô-gam táo giá 45 nghìn đồng/kg và 2,5 kg cam giá 32 nghìn đồng/kg. Bác trả tất cả 260 nghìn đồng. Hỏi bác An đã mua bao nhiêu ki-lô-gam táo?",
      goi: "Gọi x là số ki-lô-gam táo. Viết đẳng thức: tiền táo + tiền cam = 260.",
      pt: [
        { ten: "Cả bài", dich: "Số ki-lô-gam táo x", sd: [["x = 180 : 45", [4]], ["Chuyển vế: 45x = 260 − 80", [3]], ["Lập đẳng thức 45x + 80 = 260", [1, 2]]], gt: "Giá táo, khối lượng và giá cam, tổng tiền" }],
      hieu: { gt: "Táo 45 nghìn đồng/kg (chưa biết số kg); cam 2,5 kg, 32 nghìn đồng/kg; tổng tiền 260 nghìn đồng.", kl: "Số ki-lô-gam táo.",
        hoi: [
          ["Đại lượng nào chưa biết? Ta đặt nó là gì?", "Số ki-lô-gam táo chưa biết, gọi là x (kg), x > 0."],
          ["Tiền cam là bao nhiêu? Tiền táo viết thế nào theo x?", "Tiền cam: 2,5 · 32 = 80 (nghìn đồng). Tiền táo: 45 · x (nghìn đồng)."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tìm x (số ki-lô-gam táo)",
        sd: [["x = 180 : 45 = 4", [4]], ["45x = 260 − 80 = 180", [3]], ["Đẳng thức: 45x + 80 = 260", [1, 2]]],
        gt: "Tổng tiền 260 nghìn đồng",
        ket: "45x + 80 = 260, 45x = 180, x = 4. Bác An mua 4 kg táo.",
        buoc: [
        { hoi: "Thông tin nào giúp viết được một đẳng thức chứa x?",
          nho: "Đẳng thức là hệ thức A = B giữa hai biểu thức có cùng giá trị.",
          chon: [
            ["Tổng tiền: tiền táo + tiền cam = 260, tức 45 · x + 2,5 · 32 = 260", true, "Đúng. Tiền cam 2,5 · 32 = 80, nên 45x + 80 = 260."],
            ["45 + 32 = 260 − x", false, "45 và 32 là giá một ki-lô-gam, phải nhân với số ki-lô-gam."]],
          dat: "45x + 80 = 260" },
        { hoi: "Tìm x từ 45x + 80 = 260 thế nào?",
          nho: "Chuyển một số hạng sang vế kia thì đổi dấu.",
          chon: [
            ["Chuyển 80 sang phải: 45x = 260 − 80 = 180, x = 180 : 45 = 4", true, "Đúng."],
            ["45x = 260 + 80", false, "Chuyển +80 sang vế phải thì thành −80."]],
          dat: "45x = 180" }] }],
      nhin: [
        ["Thử lại: 4 kg táo và 2,5 kg cam hết bao nhiêu tiền?", "4 · 45 + 2,5 · 32 = 180 + 80 = 260 (nghìn đồng). Đúng."],
        ["Nếu bác trả 305 nghìn đồng thì mua bao nhiêu ki-lô-gam táo?", "45x = 305 − 80 = 225, x = 5 (kg)."]],
      steps: [
        "Gọi x (kg) là số ki-lô-gam táo bác An đã mua (x > 0).",
        "Tiền cam: 2,5 · 32 = 80 (nghìn đồng). Tiền táo: 45x (nghìn đồng). Ta có 45x + 80 = 260.",
        "Chuyển vế: 45x = 260 − 80 = 180.",
        "x = 180 : 45 = 4. Vậy bác An mua 4 kg táo."
      ],
      dap: "4 kg táo.",
      loi: "Viết 45x − 80 = 260 hoặc cộng 260 + 80."
    },
    {
      id: "vd4", lv: "VD",
      de: "Lúc 6 giờ sáng, nhiệt độ ở một thị trấn là −3,5 °C. Đến trưa nhiệt độ tăng thêm x °C. Từ trưa đến tối nhiệt độ giảm 4,2 °C, và lúc tối đo được −1,7 °C. Tìm x.",
      goi: "Nhiệt độ buổi tối = −3,5 + x − 4,2. Viết đẳng thức rồi dùng quy tắc chuyển vế.",
      pt: [
        { ten: "Cả bài", dich: "Tìm x", sd: [["Chuyển vế: x = −1,7 + 7,7", [3]], ["Thu gọn: x − 7,7 = −1,7", [2]], ["Đẳng thức: −3,5 + x − 4,2 = −1,7", [1]]], gt: "Nhiệt độ sáng, mức tăng, mức giảm, nhiệt độ tối" }],
      steps: [
        "Nhiệt độ buổi trưa: −3,5 + x (°C); buổi tối: −3,5 + x − 4,2 (°C). Ta có −3,5 + x − 4,2 = −1,7.",
        "Thu gọn vế trái: x − 7,7 = −1,7.",
        "Chuyển vế: x = −1,7 + 7,7 = 6."
      ],
      dap: "x = 6 (nhiệt độ tăng 6 °C).",
      loi: "Viết −3,5 − x − 4,2 (nhầm tăng thành giảm); cộng −3,5 + (−4,2) ra −0,7."
    },

    /* ===== Dành cho HSG ===== */
    {
      id: "hsg1", lv: "HSG",
      de: "Tìm x, biết: " + F("x + 1", 2023) + " + " + F("x + 2", 2022) + " + " + F("x + 3", 2021) + " = −3.",
      goi: "Chuyển −3 sang vế trái thành +3 = 1 + 1 + 1, cộng mỗi phân số với 1.",
      hieu: { gt: F("x + 1", 2023) + " + " + F("x + 2", 2022) + " + " + F("x + 3", 2021) + " = −3.", kl: "Tìm x.",
        hoi: [
          ["Có nên quy đồng ba mẫu 2023, 2022, 2021 không?", "Không: mẫu chung rất lớn. Cần tìm điểm chung của ba phân số."],
          ["Cộng tử với mẫu của mỗi phân số: x + 1 + 2023, x + 2 + 2022, x + 3 + 2021. Em thấy gì?", "Cả ba đều bằng x + 2024. Đây là dấu hiệu cộng thêm 1 vào mỗi phân số."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tìm x",
        sd: [["x + 2024 = 0 vì ngoặc thứ hai khác 0", [4]], ["(x + 2024) · (" + F(1, 2023) + " + " + F(1, 2022) + " + " + F(1, 2021) + ") = 0", [3]], ["Cộng 1 vào mỗi phân số: " + F("x + 1", 2023) + " + 1 = " + F("x + 2024", 2023) + ", …", [2]], ["Chuyển −3 sang vế trái thành 3 = 1 + 1 + 1", [1]]],
        gt: "Tổng mỗi tử và mẫu đều bằng x + 2024",
        ket: "Vì " + F(1, 2023) + " + " + F(1, 2022) + " + " + F(1, 2021) + " > 0 nên x + 2024 = 0, x = −2024.",
        buoc: [
        { hoi: "Ta muốn ba phân số có cùng tử. Làm sao để mỗi tử trở thành x + 2024?",
          nho: F("a", "b") + " + 1 = " + F("a + b", "b") + ".",
          chon: [
            ["Cộng mỗi phân số với 1: " + F("x + 1", 2023) + " + 1 = " + F("x + 2024", 2023) + ", tương tự với hai phân số kia", true, "Đúng. Cộng ba lần 1 thì vế phải cũng phải cộng 3: −3 + 3 = 0."],
            ["Nhân mỗi phân số với mẫu của nó", false, "Mỗi phân số nhân với một số khác nhau thì đẳng thức không còn đúng."]],
          dat: "Cộng 1 vào mỗi phân số (chuyển −3 sang trái)" },
        { hoi: "Sau khi cộng, đẳng thức là " + F("x + 2024", 2023) + " + " + F("x + 2024", 2022) + " + " + F("x + 2024", 2021) + " = 0. Làm gì tiếp?",
          nho: "a · b + a · c + a · d = a · (b + c + d). Tích bằng 0 khi có một thừa số bằng 0.",
          chon: [
            ["Đặt x + 2024 làm thừa số chung: (x + 2024) · (" + F(1, 2023) + " + " + F(1, 2022) + " + " + F(1, 2021) + ") = 0; ngoặc thứ hai dương nên x + 2024 = 0", true, "Đúng. x = −2024."],
            ["Quy đồng ba phân số", false, "Không cần: ba phân số có cùng tử, đặt tử chung ra ngoài là xong."]],
          dat: "(x + 2024) · (" + F(1, 2023) + " + " + F(1, 2022) + " + " + F(1, 2021) + ") = 0" }] }],
      nhin: [
        ["Thử lại với x = −2024.", F("−2023", 2023) + " + " + F("−2022", 2022) + " + " + F("−2021", 2021) + " = (−1) + (−1) + (−1) = −3. Đúng."],
        ["Bài tương tự: tìm x biết " + F("x − 1", 99) + " + " + F("x − 2", 98) + " + " + F("x − 3", 97) + " = 3.", "Trừ mỗi phân số đi 1: tử đều thành x − 100. Vậy x = 100."]],
      steps: [
        "Chuyển −3 sang vế trái: " + F("x + 1", 2023) + " + 1 + " + F("x + 2", 2022) + " + 1 + " + F("x + 3", 2021) + " + 1 = 0.",
        "Ta có " + F("x + 1", 2023) + " + 1 = " + F("x + 2024", 2023) + "; " + F("x + 2", 2022) + " + 1 = " + F("x + 2024", 2022) + "; " + F("x + 3", 2021) + " + 1 = " + F("x + 2024", 2021) + ".",
        "Do đó (x + 2024) · (" + F(1, 2023) + " + " + F(1, 2022) + " + " + F(1, 2021) + ") = 0.",
        "Vì " + F(1, 2023) + " + " + F(1, 2022) + " + " + F(1, 2021) + " > 0 nên x + 2024 = 0, x = −2024."
      ],
      dap: "x = −2024.",
      mix: [2]
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Tìm tất cả các cặp số nguyên (x; y) thoả mãn x · y + 2x − y = 5.",
      goi: "Viết vế trái thành tích: x · y + 2x = x · (y + 2). Trừ thêm (y + 2) ở cả hai vế để xuất hiện (x − 1) · (y + 2).",
      hieu: { gt: "x, y là số nguyên; x · y + 2x − y = 5.", kl: "Tìm mọi cặp (x; y).",
        hoi: [
          ["Một đẳng thức với hai số chưa biết thường có rất nhiều nghiệm. Điều kiện nào làm số nghiệm ít đi?", "x, y phải là số nguyên. Nếu viết được (biểu thức chứa x) · (biểu thức chứa y) = một số nguyên, thì mỗi thừa số là ước của số đó: chỉ có vài trường hợp."],
          ["Thử x = 2: tìm y.", "2y + 4 − y = 5, y = 1. Vậy (2; 1) là một cặp thoả mãn."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tìm các cặp (x; y)",
        sd: [["Xét bốn trường hợp tích hai số nguyên bằng 3", [3, 4]], ["(x − 1) · (y + 2) = 3", [2]], ["x · y + 2x − y − 2 = 5 − 2 (chuyển vế)", [1]]],
        gt: "x, y nguyên; x · y + 2x − y = 5",
        ket: "(x − 1; y + 2) ∈ {(1; 3), (3; 1), (−1; −3), (−3; −1)} cho (x; y) ∈ {(2; 1), (4; −1), (0; −5), (−2; −3)}.",
        buoc: [
        { hoi: "Vế trái có x · y + 2x. Đặt x chung thì được gì? Còn lại −y, làm sao ghép được?",
          nho: "a · b + a · c = a · (b + c).",
          chon: [
            ["x · y + 2x = x · (y + 2); viết −y = −(y + 2) + 2, nên vế trái = (x − 1) · (y + 2) + 2", true, "Đúng. Chuyển 2 sang vế phải: (x − 1) · (y + 2) = 3."],
            ["x · y + 2x − y = y · (x − 1) + 2x", false, "Cũng đúng nhưng chưa thành một tích: 2x còn lẻ ra. Cần ghép để mỗi phần có chung thừa số."]],
          dat: "(x − 1) · (y + 2) = 3" },
        { hoi: "Tích hai số nguyên bằng 3. Có những khả năng nào?",
          nho: "Các ước nguyên của 3 là 1, −1, 3, −3.",
          chon: [
            ["1 · 3; 3 · 1; (−1) · (−3); (−3) · (−1)", true, "Đúng. Mỗi khả năng cho một cặp (x; y)."],
            ["Chỉ 1 · 3 và 3 · 1", false, "Thiếu hai trường hợp số âm."]],
          dat: "x − 1 và y + 2 là ước của 3" }] }],
      nhin: [
        ["Thử lại bốn cặp.", "(2; 1): 2 + 4 − 1 = 5. (4; −1): −4 + 8 + 1 = 5. (0; −5): 0 + 0 + 5 = 5. (−2; −3): 6 − 4 + 3 = 5. Đều đúng."],
        ["Bài tương tự: tìm các số nguyên x, y với x · y − x + 2y = 7.", "x · (y − 1) + 2 · (y − 1) = 5, tức (x + 2) · (y − 1) = 5: (x; y) ∈ {(−1; 6), (3; 2), (−3; −4), (−7; 0)}."]],
      steps: [
        "x · y + 2x − y = 5 ⇒ x · (y + 2) − (y + 2) + 2 = 5 ⇒ x · (y + 2) − (y + 2) = 5 − 2 (chuyển vế).",
        "Do đó (x − 1) · (y + 2) = 3.",
        "x − 1 và y + 2 là các số nguyên có tích bằng 3, nên (x − 1; y + 2) là (1; 3), (3; 1), (−1; −3) hoặc (−3; −1).",
        "Tương ứng (x; y) = (2; 1), (4; −1), (0; −5), (−2; −3)."
      ],
      dap: "(x; y) ∈ {(2; 1); (4; −1); (0; −5); (−2; −3)}."
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Tìm số tự nhiên x, biết " + Q("x − 1", "x + 2") + " = " + Q("x − 1", "x + 4") + ".",
      goi: "Chuyển vế phải sang trái, đặt " + Q("x − 1", "x + 2") + " làm thừa số chung.",
      hieu: { gt: Q("x − 1", "x + 2") + " = " + Q("x − 1", "x + 4") + ", x ∈ ℕ.", kl: "Tìm x.",
        hoi: [
          ["Hai luỹ thừa có cùng cơ số x − 1, số mũ khác nhau mà vẫn bằng nhau. Cơ số nào có tính chất đó?", "Cơ số 0 (mọi luỹ thừa bậc khác 0 bằng 0), cơ số 1 (mọi luỹ thừa bằng 1) và cơ số −1 (hai số mũ cùng chẵn hoặc cùng lẻ). Ta cần lập luận chặt chẽ chứ không chỉ đoán."],
          ["Hai số mũ x + 2 và x + 4 hơn kém nhau bao nhiêu?", "Hơn kém 2: " + Q("x − 1", "x + 4") + " = " + Q("x − 1", "x + 2") + " · " + Q("x − 1", 2) + "."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tìm x",
        sd: [["x − 1 = 0, hoặc " + Q("x − 1", 2) + " = 1", [3, 4]], [Q("x − 1", "x + 2") + " · [1 − " + Q("x − 1", 2) + "] = 0", [2]], ["Chuyển vế: " + Q("x − 1", "x + 2") + " − " + Q("x − 1", "x + 4") + " = 0", [1]]],
        gt: Q("x − 1", "x + 4") + " = " + Q("x − 1", "x + 2") + " · " + Q("x − 1", 2),
        ket: "x − 1 = 0 cho x = 1; " + Q("x − 1", 2) + " = 1 cho x − 1 = 1 hoặc x − 1 = −1, tức x = 2 hoặc x = 0. Vậy x ∈ {0; 1; 2}.",
        buoc: [
        { hoi: "Đưa đẳng thức về dạng tích bằng 0 thế nào?",
          nho: P("a", "m + 2") + " = " + P("a", "m") + " · " + P("a", 2) + "; a − a · b = a · (1 − b).",
          chon: [
            ["Chuyển vế: " + Q("x − 1", "x + 2") + " − " + Q("x − 1", "x + 2") + " · " + Q("x − 1", 2) + " = 0, rồi đặt thừa số chung: " + Q("x − 1", "x + 2") + " · [1 − " + Q("x − 1", 2) + "] = 0", true, "Đúng. Tích bằng 0 khi một thừa số bằng 0."],
            ["Chia hai vế cho " + Q("x − 1", "x + 2"), false, "Có thể chia cho 0 (khi x = 1): làm mất nghiệm x = 1."]],
          dat: Q("x − 1", "x + 2") + " · [1 − " + Q("x − 1", 2) + "] = 0" },
        { hoi: "Xét từng thừa số bằng 0.",
          nho: P("a", "n") + " = 0 (n ≥ 1) khi a = 0. Bình phương bằng 1 khi số đó là 1 hoặc −1.",
          chon: [
            ["x − 1 = 0 cho x = 1; " + Q("x − 1", 2) + " = 1 cho x − 1 = 1 hoặc −1, tức x = 2 hoặc x = 0", true, "Đúng. Cả ba đều là số tự nhiên."],
            ["Chỉ x − 1 = 1", false, "Thiếu x − 1 = 0 và x − 1 = −1."]],
          dat: "x ∈ {0; 1; 2}" }] }],
      nhin: [
        ["Thử lại ba giá trị.", "x = 0: " + Q("−1", 2) + " = 1 và " + Q("−1", 4) + " = 1. x = 1: " + P(0, 3) + " = 0 = " + P(0, 5) + ". x = 2: " + P(1, 4) + " = 1 = " + P(1, 6) + ". Đều đúng."],
        ["Vì sao không được chia hai vế cho " + Q("x − 1", "x + 2") + " ngay từ đầu?", "Vì khi x = 1 số đó bằng 0, không chia được. Chia vội sẽ làm mất nghiệm x = 1."]],
      steps: [
        "Chuyển vế: " + Q("x − 1", "x + 2") + " − " + Q("x − 1", "x + 4") + " = 0, tức là " + Q("x − 1", "x + 2") + " − " + Q("x − 1", "x + 2") + " · " + Q("x − 1", 2) + " = 0.",
        "Đặt thừa số chung: " + Q("x − 1", "x + 2") + " · [1 − " + Q("x − 1", 2) + "] = 0.",
        "Trường hợp 1: " + Q("x − 1", "x + 2") + " = 0 thì x − 1 = 0, x = 1.",
        "Trường hợp 2: 1 − " + Q("x − 1", 2) + " = 0 thì " + Q("x − 1", 2) + " = 1, nên x − 1 = 1 hoặc x − 1 = −1, tức x = 2 hoặc x = 0.",
        "Vậy x ∈ {0; 1; 2}."
      ],
      dap: "x ∈ {0; 1; 2}.",
      loi: "Chia hai vế cho " + Q("x − 1", "x + 2") + " nên mất nghiệm x = 1; quên x − 1 = −1.",
      mix: [3]
    }
  ];

  window.TL_DATA = {
    bai: "tc7",
    ten: "Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế",
    items: ITEMS,
    dang: [
      { ten: "Tính giá trị biểu thức",
        pp: ["Biểu thức không có ngoặc: luỹ thừa → nhân và chia → cộng và trừ; các phép tính cùng bậc làm từ trái sang phải.",
             "Biểu thức có ngoặc: làm ngoặc tròn ( ) → ngoặc vuông [ ] → ngoặc nhọn { }.",
             "Tách biểu thức thành các phần nối bởi dấu cộng, trừ; tính từng phần rồi ghép lại.",
             "Quan sát để tính hợp lí: các số có tổng tròn, thừa số chung."],
        ids: ["nb1", "th1", "vd1"],
        tl: [
          ["Tính: 3 − 2 · " + Q(F("−1", 2), 2) + " + 0,5 : " + F(1, 4) + ".", "Luỹ thừa, rồi nhân và chia, rồi cộng và trừ.", "4,5."],
          ["Tính: [" + F(1, 3) + " − " + Q(F(1, 2) + " − 1", 2) + "] · 12.", "Trong ngoặc tròn trước, rồi luỹ thừa, rồi ngoặc vuông.", "1."]] },
      { ten: "Quy tắc chuyển vế, tìm x",
        pp: ["Có ngoặc thì bỏ ngoặc (đúng quy tắc dấu ngoặc) hoặc coi cả ngoặc là một khối.",
             "Chuyển các số hạng chứa x về một vế, các số hạng còn lại về vế kia; chuyển vế phải đổi dấu.",
             "Thu gọn về dạng a · x = b rồi tìm x = b : a (a ≠ 0).",
             "Khối có luỹ thừa bậc chẵn bằng một số dương: xét hai trường hợp (hai số đối nhau).",
             "Thử lại kết quả."],
        ids: ["nb2", "th2", "vd2"],
        tl: [
          ["Tìm x, biết x − 1,25 = " + F("−3", 4) + ".", "Chuyển −1,25 sang vế phải.", "x = 0,5."],
          ["Tìm x, biết " + F(3, 5) + " − 2x = −1.", "Chuyển " + F(3, 5) + " sang vế phải rồi chia cho −2.", "x = " + F(4, 5) + "."],
          ["Tìm x, biết " + F(1, 2) + " · x + 3 = " + F(1, 3) + " · x − 1.", "Gom các số hạng chứa x về vế trái.", "x = −24."]] },
      { ten: "Bài toán thực tế",
        pp: ["Gọi đại lượng chưa biết là x, nêu đơn vị và điều kiện.",
             "Dựa vào đề, viết một đẳng thức giữa các đại lượng (tổng tiền, nhiệt độ cuối, lượng còn lại, …).",
             "Dùng quy tắc chuyển vế để tìm x, rồi thử lại và trả lời đúng câu hỏi."],
        ids: ["vd3", "vd4"],
        tl: [
          ["Mẹ mua 3 hộp sữa cùng giá và một gói bánh giá 18,5 nghìn đồng, hết tất cả 77 nghìn đồng. Tính giá một hộp sữa.", "Gọi x là giá một hộp sữa: 3x + 18,5 = 77.", "19,5 nghìn đồng."],
          ["Một bể đang chứa 1,2 m³ nước. Mở vòi cho nước chảy vào bể, sau đó lấy ra 0,75 m³ thì trong bể còn 2,05 m³. Hỏi vòi đã chảy vào bể bao nhiêu mét khối nước?", "1,2 + x − 0,75 = 2,05.", "1,6 m³."]] }
    ],
    mau: { ids: ["vd1", "vd2", "vd3"], theoPhan: { tt: "vd1", nn: "vd1", dt: "vd2", cv: "vd2" } }
  };
})();
