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
      de: "Tìm x, biết: " + F("x + 1", 99) + " + " + F("x + 2", 98) + " + " + F("x + 3", 97) + " = " + F("x + 4", 96) + " + " + F("x + 5", 95) + " + " + F("x + 6", 94) + ".",
      goi: "Cộng thêm 1 vào mỗi phân số ở cả hai vế (tức là cộng 3 vào mỗi vế). Mọi tử đều thành x + 100.",
      hieu: { gt: F("x + 1", 99) + " + " + F("x + 2", 98) + " + " + F("x + 3", 97) + " = " + F("x + 4", 96) + " + " + F("x + 5", 95) + " + " + F("x + 6", 94) + ".", kl: "Tìm x.",
        hoi: [
          ["Cộng tử với mẫu của từng phân số. Em thấy gì?", "x + 1 + 99 = x + 2 + 98 = … = x + 6 + 94 = x + 100: sáu tổng bằng nhau."],
          ["Có nên quy đồng sáu mẫu 99, 98, 97, 96, 95, 94 không?", "Không: mẫu chung rất lớn. Cần làm cho các tử giống nhau rồi đặt thừa số chung."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tìm x",
        sd: [["x + 100 = 0 vì ngoặc khác 0", [4]], ["(x + 100) · (" + F(1, 99) + " + " + F(1, 98) + " + " + F(1, 97) + " − " + F(1, 96) + " − " + F(1, 95) + " − " + F(1, 94) + ") = 0", [3]], ["Cộng 1 vào mỗi phân số: " + F("x + 1", 99) + " + 1 = " + F("x + 100", 99) + ", …", [1, 2]]],
        gt: "Tổng tử và mẫu của mỗi phân số đều bằng x + 100",
        ket: "Ngoặc âm (khác 0) nên x + 100 = 0, x = −100.",
        buoc: [
        { hoi: "Làm sao để sáu phân số có cùng tử x + 100 mà đẳng thức vẫn đúng?",
          nho: F("a", "b") + " + 1 = " + F("a + b", "b") + ". Cộng cùng một số vào hai vế thì đẳng thức vẫn đúng.",
          chon: [
            ["Cộng 3 vào mỗi vế, chia thành cộng 1 vào từng phân số: " + F("x + 1", 99) + " + 1 = " + F("x + 100", 99) + ", …, " + F("x + 6", 94) + " + 1 = " + F("x + 100", 94), true, "Đúng. Mỗi vế có ba phân số nên cộng 3 vào mỗi vế."],
            ["Cộng 1 vào mỗi phân số ở vế trái, giữ nguyên vế phải", false, "Vế trái tăng 3 mà vế phải không đổi thì đẳng thức không còn đúng."]],
          dat: F("x + 100", 99) + " + " + F("x + 100", 98) + " + " + F("x + 100", 97) + " = " + F("x + 100", 96) + " + " + F("x + 100", 95) + " + " + F("x + 100", 94) },
        { hoi: "Chuyển vế phải sang vế trái rồi làm gì tiếp? Vì sao ngoặc khác 0?",
          nho: "Tích bằng 0 khi có một thừa số bằng 0. Hai phân số cùng tử dương: mẫu lớn hơn thì phân số nhỏ hơn.",
          chon: [
            ["Đặt x + 100 làm thừa số chung; " + F(1, 99) + " < " + F(1, 96) + ", " + F(1, 98) + " < " + F(1, 95) + ", " + F(1, 97) + " < " + F(1, 94) + " nên ngoặc âm, khác 0", true, "Đúng. Vậy x + 100 = 0, x = −100."],
            ["Chia hai vế cho x + 100 được " + F(1, 99) + " + " + F(1, 98) + " + " + F(1, 97) + " = " + F(1, 96) + " + " + F(1, 95) + " + " + F(1, 94), false, "Không được chia cho x + 100 khi chưa biết nó khác 0; và đẳng thức thu được sai, chính là dấu hiệu x + 100 = 0."]],
          dat: "(x + 100) · (" + F(1, 99) + " + " + F(1, 98) + " + " + F(1, 97) + " − " + F(1, 96) + " − " + F(1, 95) + " − " + F(1, 94) + ") = 0" }] }],
      nhin: [
        ["Thử lại với x = −100.", "Vế trái: " + F("−99", 99) + " + " + F("−98", 98) + " + " + F("−97", 97) + " = −3. Vế phải: " + F("−96", 96) + " + " + F("−95", 95) + " + " + F("−94", 94) + " = −3. Đúng."],
        ["Bài tương tự: tìm x biết " + F("x − 1", 2023) + " + " + F("x − 2", 2022) + " = " + F("x − 3", 2021) + " + " + F("x − 4", 2020) + ".", "Trừ 1 vào mỗi phân số (trừ 2 ở mỗi vế): mọi tử thành x − 2024, ngoặc " + F(1, 2023) + " + " + F(1, 2022) + " − " + F(1, 2021) + " − " + F(1, 2020) + " khác 0. Vậy x = 2024."]],
      steps: [
        "Cộng 3 vào mỗi vế: (" + F("x + 1", 99) + " + 1) + (" + F("x + 2", 98) + " + 1) + (" + F("x + 3", 97) + " + 1) = (" + F("x + 4", 96) + " + 1) + (" + F("x + 5", 95) + " + 1) + (" + F("x + 6", 94) + " + 1).",
        "Hay " + F("x + 100", 99) + " + " + F("x + 100", 98) + " + " + F("x + 100", 97) + " = " + F("x + 100", 96) + " + " + F("x + 100", 95) + " + " + F("x + 100", 94) + ".",
        "Chuyển vế: " + F("x + 100", 99) + " + " + F("x + 100", 98) + " + " + F("x + 100", 97) + " − " + F("x + 100", 96) + " − " + F("x + 100", 95) + " − " + F("x + 100", 94) + " = 0, tức là (x + 100) · (" + F(1, 99) + " + " + F(1, 98) + " + " + F(1, 97) + " − " + F(1, 96) + " − " + F(1, 95) + " − " + F(1, 94) + ") = 0.",
        "Vì " + F(1, 99) + " < " + F(1, 96) + ", " + F(1, 98) + " < " + F(1, 95) + ", " + F(1, 97) + " < " + F(1, 94) + " nên ngoặc thứ hai nhỏ hơn 0, khác 0. Do đó x + 100 = 0, x = −100."
      ],
      dap: "x = −100.",
      loi: "Chỉ cộng 1 vào các phân số ở một vế; hoặc chia hai vế cho x + 100.",
      mix: [2]
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Tìm các số nguyên x, y biết: " + F("x", 4) + " − " + F(1, "y") + " = " + F(1, 2) + ".",
      goi: "Chuyển vế để được " + F(1, "y") + " = " + F("x − 2", 4) + ", suy ra (x − 2) · y = 4.",
      hieu: { gt: "x, y là số nguyên, y ≠ 0, " + F("x", 4) + " − " + F(1, "y") + " = " + F(1, 2) + ".", kl: "Tìm các cặp (x; y).",
        hoi: [
          ["Một đẳng thức có hai số chưa biết. Ta dựa vào điều gì để tìm được?", "x, y là số nguyên: đưa về dạng tích hai số nguyên bằng một số đã biết, rồi xét các ước."],
          ["Hai phân số " + F("a", "b") + " = " + F("c", "d") + " (b, d ≠ 0) khi nào?", "Khi a · d = b · c."]] },
      nguoc: [
      { ten: "Tìm (x; y)", dich: "Tìm các cặp số nguyên (x; y)",
        sd: [["Xét các cặp ước (x − 2; y) có tích bằng 4", [3, 4]], ["(x − 2) · y = 4", [2]], [F(1, "y") + " = " + F("x − 2", 4), [1]]],
        gt: "x, y nguyên, y ≠ 0",
        ket: "(x; y) ∈ {(3; 4); (4; 2); (6; 1); (1; −4); (0; −2); (−2; −1)}.",
        buoc: [
        { hoi: "Đưa " + F(1, "y") + " về một vế. Vế còn lại bằng gì?",
          nho: "Quy tắc chuyển vế: chuyển một số hạng sang vế kia thì đổi dấu.",
          chon: [
            [F(1, "y") + " = " + F("x", 4) + " − " + F(1, 2) + " = " + F("x − 2", 4), true, "Đúng. Từ đó (x − 2) · y = 4."],
            [F(1, "y") + " = " + F("x", 4) + " + " + F(1, 2), false, "Chuyển " + F(1, "y") + " sang phải và " + F(1, 2) + " sang trái thì " + F(1, 2) + " đổi dấu: " + F("x", 4) + " − " + F(1, 2) + "."]],
          dat: "(x − 2) · y = 4" },
        { hoi: "(x − 2) · y = 4 với x − 2, y là số nguyên. Có bao nhiêu khả năng?",
          nho: "Các ước của 4 là ±1, ±2, ±4. Hai thừa số có tích dương thì cùng dấu.",
          chon: [
            ["Sáu cặp (x − 2; y): (1; 4), (2; 2), (4; 1), (−1; −4), (−2; −2), (−4; −1)", true, "Đúng. Mỗi cặp cho một giá trị x."],
            ["Ba cặp (1; 4), (2; 2), (4; 1)", false, "Thiếu ba cặp số âm: (−1) · (−4) = 4 cũng được."]],
          dat: "Sáu cặp ước của 4" }] }],
      nhin: [
        ["Thử lại cặp (−2; −1).", F("−2", 4) + " − " + F(1, "−1") + " = " + F("−1", 2) + " + 1 = " + F(1, 2) + ". Đúng."],
        ["Bài tương tự: tìm số nguyên x, y biết " + F("x", 3) + " − " + F(1, "y") + " = " + F(1, 3) + ".", F(1, "y") + " = " + F("x − 1", 3) + ", (x − 1) · y = 3: (x; y) ∈ {(2; 3); (4; 1); (0; −3); (−2; −1)}."]],
      steps: [
        "Điều kiện y ≠ 0. Chuyển vế: " + F(1, "y") + " = " + F("x", 4) + " − " + F(1, 2) + " = " + F("x", 4) + " − " + F(2, 4) + " = " + F("x − 2", 4) + ".",
        "Do đó (x − 2) · y = 1 · 4 = 4, với x − 2 và y là các số nguyên.",
        "Các cặp (x − 2; y) có tích bằng 4: (1; 4), (2; 2), (4; 1), (−1; −4), (−2; −2), (−4; −1).",
        "Suy ra x lần lượt bằng 3; 4; 6; 1; 0; −2. Vậy (x; y) ∈ {(3; 4); (4; 2); (6; 1); (1; −4); (0; −2); (−2; −1)}."
      ],
      dap: "(x; y) ∈ {(3; 4); (4; 2); (6; 1); (1; −4); (0; −2); (−2; −1)}.",
      loi: "Chỉ lấy các ước dương của 4; hoặc chuyển vế quên đổi dấu."
    },
    {
      id: "hsg3", lv: "HSG",
      de: "Tìm số tự nhiên x, biết: " + P(2, "x") + " + " + P(2, "x + 1") + " + " + P(2, "x + 2") + " + … + " + P(2, "x + 2015") + " = " + P(2, 2019) + " − 8.",
      goi: "Đặt " + P(2, "x") + " làm thừa số chung. Tính S = 1 + 2 + " + P(2, 2) + " + … + " + P(2, 2015) + " bằng cách lấy 2S − S.",
      hieu: { gt: "Vế trái gồm 2016 luỹ thừa của 2, số mũ từ x đến x + 2015.", kl: "Tìm x.",
        hoi: [
          ["Các số hạng ở vế trái có thừa số chung nào?", P(2, "x") + ": " + P(2, "x + k") + " = " + P(2, "x") + " · " + P(2, "k") + "."],
          ["Vế phải " + P(2, 2019) + " − 8 có viết được thành 8 nhân một số không?", P(2, 2019) + " − 8 = 8 · " + P(2, 2016) + " − 8 = 8 · (" + P(2, 2016) + " − 1)."]] },
      nguoc: [
      { ten: "Tìm x", dich: "Tìm x",
        sd: [[P(2, "x") + " = 8, x = 3", [4]], [P(2, "x") + " · (" + P(2, 2016) + " − 1) = 8 · (" + P(2, 2016) + " − 1)", [3]], ["S = 1 + 2 + … + " + P(2, 2015) + " = " + P(2, 2016) + " − 1", [2]], ["Vế trái = " + P(2, "x") + " · S", [1]]],
        gt: P(2, "x + k") + " = " + P(2, "x") + " · " + P(2, "k"),
        ket: "x = 3.",
        buoc: [
        { hoi: "Vế trái có 2016 số hạng. Rút gọn thế nào?",
          nho: P("a", "m + n") + " = " + P("a", "m") + " · " + P("a", "n") + "; a · b + a · c = a · (b + c).",
          chon: [
            ["Đặt " + P(2, "x") + " ra ngoài: vế trái = " + P(2, "x") + " · (1 + 2 + " + P(2, 2) + " + … + " + P(2, 2015) + ")", true, "Đúng. Còn phải tính tổng trong ngoặc."],
            ["Cộng số mũ: vế trái = " + P(2, "2016x + …"), false, "Số mũ chỉ cộng khi nhân các luỹ thừa cùng cơ số, không phải khi cộng."]],
          dat: "Vế trái = " + P(2, "x") + " · S" },
        { hoi: "Tính S = 1 + 2 + " + P(2, 2) + " + … + " + P(2, 2015) + ".",
          nho: "Nhân S với 2 rồi trừ đi S.",
          chon: [
            ["2S − S = " + P(2, 2016) + " − 1, nên S = " + P(2, 2016) + " − 1", true, "Đúng."],
            ["S = " + P(2, 2015) + " − 1", false, "Thử với tổng ngắn: 1 + 2 + 4 = 7 = " + P(2, 3) + " − 1, số mũ lớn hơn số mũ cuối 1 đơn vị."]],
          dat: "S = " + P(2, 2016) + " − 1" },
        { hoi: "Vậy " + P(2, "x") + " · (" + P(2, 2016) + " − 1) = " + P(2, 2019) + " − 8. Tìm x thế nào?",
          nho: P(2, 2019) + " = " + P(2, 3) + " · " + P(2, 2016) + ".",
          chon: [
            ["Viết vế phải = 8 · (" + P(2, 2016) + " − 1); hai vế có cùng thừa số " + P(2, 2016) + " − 1 khác 0 nên " + P(2, "x") + " = 8", true, "Đúng: x = 3."],
            [P(2, "x") + " = " + P(2, 2019) + " − 8 − (" + P(2, 2016) + " − 1)", false, "Vế trái là tích, không phải tổng; phải chia cho " + P(2, 2016) + " − 1."]],
          dat: P(2, "x") + " = 8" }] }],
      nhin: [
        ["Thử lại x = 3.", "Vế trái = " + P(2, 3) + " · (" + P(2, 2016) + " − 1) = " + P(2, 2019) + " − 8. Đúng."],
        ["Bài tương tự: tìm số tự nhiên x biết " + P(3, "x") + " + " + P(3, "x + 1") + " + " + P(3, "x + 2") + " = 117.", P(3, "x") + " · (1 + 3 + 9) = 13 · " + P(3, "x") + " = 117, nên " + P(3, "x") + " = 9, x = 2."]],
      steps: [
        "Vế trái = " + P(2, "x") + " · (1 + 2 + " + P(2, 2) + " + … + " + P(2, 2015) + "). Đặt S = 1 + 2 + " + P(2, 2) + " + … + " + P(2, 2015) + ".",
        "2S = 2 + " + P(2, 2) + " + … + " + P(2, 2016) + ", nên S = 2S − S = " + P(2, 2016) + " − 1.",
        "Vế phải = " + P(2, 2019) + " − 8 = " + P(2, 3) + " · " + P(2, 2016) + " − 8 = 8 · (" + P(2, 2016) + " − 1). Do đó " + P(2, "x") + " · (" + P(2, 2016) + " − 1) = 8 · (" + P(2, 2016) + " − 1).",
        "Vì " + P(2, 2016) + " − 1 ≠ 0 nên " + P(2, "x") + " = 8 = " + P(2, 3) + ", x = 3."
      ],
      dap: "x = 3.",
      loi: "Tính S = " + P(2, 2015) + " − 1 (sai số mũ); hoặc cộng các số mũ.",
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
