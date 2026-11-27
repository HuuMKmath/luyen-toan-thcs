/* Bài tập tự luận – Bài 1. Tập hợp các số hữu tỉ (Toán 7, Kết nối tri thức).
   Bài khái niệm: chia theo mức (Nhận biết, Thông hiểu, Vận dụng), cuối mỗi mức có bài tự luyện (tlMuc); mục Dành cho HSG riêng, giải theo 4 bước.
   Chỉ dùng kiến thức đã học đến Bài 1 (và Toán 6): chưa học cộng, trừ, nhân, chia số hữu tỉ, chưa học giá trị tuyệt đối.
   Mỗi bài: id, lv, de, goi, steps, dap, loi; pt (phân tích ngược) cho bài Thông hiểu, Vận dụng; bài mẫu và bài HSG có hieu, nguoc, nhin (4 bước).
   Hình trục số dùng hàm truc() của trang bài, chỉ gọi lúc hiện. */
(function () {
  "use strict";
  var F = function (n, d) { return '<span class="fr"><span>' + n + "</span><span>" + d + "</span></span>"; };
  var P = function (b, e) { return b + "<sup>" + e + "</sup>"; };
  var T = function (lo, hi, den, pts) { return typeof truc === "function" ? truc(lo, hi, den, pts) : ""; };

  var ITEMS = [
    /* ================= NHẬN BIẾT ================= */
    {
      id: "nb1", lv: "NB",
      de: "Viết các số sau dưới dạng phân số rồi giải thích vì sao chúng là số hữu tỉ:<br>a) −7;  b) 0,35;  c) −1,25;  d) 2" + F(3, 4) + ".",
      goi: "Số hữu tỉ là số viết được dưới dạng phân số " + F("a", "b") + " với a, b ∈ ℤ, b ≠ 0. Số thập phân: viết thành phân số có mẫu là 10, 100, … rồi rút gọn.",
      steps: [
        "a) −7 = " + F("−7", 1) + ".",
        "b) 0,35 = " + F(35, 100) + " = " + F(7, 20) + ".",
        "c) −1,25 = " + F("−125", 100) + " = " + F("−5", 4) + ".",
        "d) 2" + F(3, 4) + " = " + F("2 · 4 + 3", 4) + " = " + F(11, 4) + ".",
        "Mỗi số đều viết được dưới dạng phân số " + F("a", "b") + " với a, b là số nguyên, b ≠ 0, nên đều là số hữu tỉ."
      ],
      dap: "−7 = " + F("−7", 1) + "; 0,35 = " + F(7, 20) + "; −1,25 = " + F("−5", 4) + "; 2" + F(3, 4) + " = " + F(11, 4) + ". Cả bốn số đều là số hữu tỉ.",
      loi: "Quên dấu \"−\" khi đổi −1,25; đổi hỗn số 2" + F(3, 4) + " thành " + F(5, 4) + " (lấy 2 + 3)."
    },
    {
      id: "nb2", lv: "NB",
      de: "Tìm số đối của mỗi số hữu tỉ sau: a) " + F(2, 7) + ";  b) −0,6;  c) " + F("−5", 8) + ";  d) 0.",
      goi: "Số đối của a là −a: chỉ đổi dấu, không đảo tử và mẫu. Số đối của 0 là 0.",
      steps: [
        "a) Số đối của " + F(2, 7) + " là " + F("−2", 7) + ".",
        "b) Số đối của −0,6 là 0,6.",
        "c) Số đối của " + F("−5", 8) + " là " + F(5, 8) + ".",
        "d) Số đối của 0 là 0."
      ],
      dap: F("−2", 7) + "; 0,6; " + F(5, 8) + "; 0.",
      loi: "Nhầm số đối với số nghịch đảo: ghi số đối của " + F(2, 7) + " là " + F(7, 2) + "."
    },
    {
      id: "nb3", lv: "NB",
      de: "Biểu diễn các số hữu tỉ " + F(3, 4) + ";  " + F("−5", 4) + ";  −0,5 trên cùng một trục số.",
      goi: "Ba số đều viết được với mẫu 4 (−0,5 = " + F("−2", 4) + "). Chia đoạn thẳng đơn vị thành 4 phần bằng nhau, mỗi phần là một đơn vị mới.",
      fig: function () { return T(-2, 1, 4, { B: [-5, 4], C: [-2, 4], A: [3, 4] }); },
      steps: [
        "Viết −0,5 = " + F("−5", 10) + " = " + F("−2", 4) + ". Chia đoạn thẳng đơn vị (từ 0 đến 1) thành 4 đoạn bằng nhau, lấy một đoạn làm đơn vị mới (bằng " + F(1, 4) + " đơn vị cũ).",
        "Điểm A biểu diễn " + F(3, 4) + ": nằm sau gốc O, cách O 3 đơn vị mới.",
        "Điểm B biểu diễn " + F("−5", 4) + ": nằm trước gốc O, cách O 5 đơn vị mới.",
        "Điểm C biểu diễn −0,5 = " + F("−2", 4) + ": nằm trước gốc O, cách O 2 đơn vị mới (C là trung điểm của đoạn từ −1 đến 0)."
      ],
      dap: "A (" + F(3, 4) + ") sau O 3 đơn vị mới; B (" + F("−5", 4) + ") trước O 5 đơn vị mới; C (−0,5) trước O 2 đơn vị mới.",
      loi: "Đếm cả vạch O làm một đơn vị; đặt số âm về phía sau gốc O."
    },

    /* ================= THÔNG HIỂU ================= */
    {
      id: "th1", lv: "TH",
      de: "So sánh các cặp số hữu tỉ sau:<br>a) " + F("−3", 4) + " và " + F("−5", 6) + ";  b) " + F(2, "−5") + " và " + F("−3", 7) + ";  c) " + F(13, "−20") + " và −0,6.",
      goi: "Viết hai số dưới dạng phân số có cùng mẫu dương rồi so sánh hai tử. Mẫu âm thì đổi dấu cả tử và mẫu trước.",
      pt: [
        { ten: "Câu a", dich: "So sánh " + F("−3", 4) + " và " + F("−5", 6), sd: [["So sánh hai tử của hai phân số cùng mẫu dương", [2]], ["Quy đồng hai phân số với mẫu chung dương 12", [1]]], gt: "Hai phân số có mẫu dương 4 và 6" },
        { ten: "Câu b", dich: "So sánh " + F(2, "−5") + " và " + F("−3", 7), sd: [["Quy đồng mẫu 35 rồi so sánh hai tử", [4]], ["Đổi " + F(2, "−5") + " thành phân số có mẫu dương " + F("−2", 5), [3]]], gt: "Phân số " + F(2, "−5") + " có mẫu âm" },
        { ten: "Câu c", dich: "So sánh " + F(13, "−20") + " và −0,6", sd: [["Hai số cùng là số thập phân: so sánh −0,65 và −0,6", [6]], ["Đổi " + F(13, "−20") + " = " + F("−13", 20) + " = −0,65", [5]]], gt: "Mẫu 20 đổi được ra mẫu 100" }],
      steps: [
        "a) " + F("−3", 4) + " = " + F("−9", 12) + ";  " + F("−5", 6) + " = " + F("−10", 12) + ".",
        "Vì −9 > −10 nên " + F("−9", 12) + " > " + F("−10", 12) + ", tức là " + F("−3", 4) + " > " + F("−5", 6) + ".",
        "b) " + F(2, "−5") + " = " + F("−2", 5) + ".",
        F("−2", 5) + " = " + F("−14", 35) + ";  " + F("−3", 7) + " = " + F("−15", 35) + ". Vì −14 > −15 nên " + F(2, "−5") + " > " + F("−3", 7) + ".",
        "c) " + F(13, "−20") + " = " + F("−13", 20) + " = " + F("−65", 100) + " = −0,65.",
        "Vì 0,65 > 0,6 nên −0,65 < −0,6, tức là " + F(13, "−20") + " < −0,6."
      ],
      dap: "a) " + F("−3", 4) + " > " + F("−5", 6) + ". b) " + F(2, "−5") + " > " + F("−3", 7) + ". c) " + F(13, "−20") + " < −0,6.",
      loi: "Quy đồng với mẫu âm rồi so sánh tử (ra kết quả ngược); cho rằng −10 > −9."
    },
    {
      id: "th2", lv: "TH",
      de: "Sắp xếp các số hữu tỉ sau theo thứ tự tăng dần: −0,5;  " + F(3, 4) + ";  " + F("−2", 3) + ";  0;  1,2;  " + F("−5", 4) + ".",
      goi: "Chia thành ba nhóm: số âm, số 0, số dương. Trong mỗi nhóm, quy đồng mẫu (hoặc đổi ra số thập phân) để so sánh.",
      pt: [
        { ten: "Cả bài", dich: "Dãy tăng dần của sáu số", sd: [["Ghép: các số âm (tăng dần) < 0 < các số dương (tăng dần)", [4]], ["So sánh các số âm với nhau và các số dương với nhau", [2, 3]], ["Chia nhóm: số âm, số 0, số dương", [1]]], gt: "Sáu số đã cho" }],
      steps: [
        "Số âm: −0,5; " + F("−2", 3) + "; " + F("−5", 4) + ". Số dương: " + F(3, 4) + "; 1,2. Còn số 0.",
        "So sánh các số âm (mẫu chung 12): −0,5 = " + F("−6", 12) + ";  " + F("−2", 3) + " = " + F("−8", 12) + ";  " + F("−5", 4) + " = " + F("−15", 12) + ". Vì −15 < −8 < −6 nên " + F("−5", 4) + " < " + F("−2", 3) + " < −0,5.",
        "So sánh các số dương: " + F(3, 4) + " = 0,75 < 1,2.",
        "Số âm nhỏ hơn 0, số 0 nhỏ hơn số dương. Vậy: " + F("−5", 4) + " < " + F("−2", 3) + " < −0,5 < 0 < " + F(3, 4) + " < 1,2."
      ],
      dap: F("−5", 4) + ";  " + F("−2", 3) + ";  −0,5;  0;  " + F(3, 4) + ";  1,2.",
      loi: "Xếp các số âm theo phần không dấu: cho rằng −0,5 < " + F("−2", 3) + " < " + F("−5", 4) + "."
    },
    {
      id: "th3", lv: "TH",
      de: "Cho các số: " + F("−6", 8) + ";  " + F(9, "−12") + ";  −0,75;  " + F(3, 4) + ";  " + F(15, 20) + ".<br>a) Những số nào biểu diễn cùng một số hữu tỉ?<br>b) Hai nhóm số tìm được ở câu a có quan hệ gì với nhau? Trên trục số, các điểm biểu diễn chúng nằm thế nào so với gốc O?",
      goi: "Rút gọn mỗi phân số về phân số tối giản có mẫu dương; đổi −0,75 ra phân số.",
      pt: [
        { ten: "Câu a", dich: "Tìm các số bằng nhau", sd: [["Viết mỗi số dưới dạng phân số tối giản có mẫu dương rồi so sánh", [1, 2]]], gt: "Năm số đã cho" },
        { ten: "Câu b", dich: "Quan hệ giữa hai nhóm và vị trí trên trục số", sd: [["Hai số đối nhau: hai điểm nằm hai phía O, cách đều O", [4]], ["Nhận ra " + F("−3", 4) + " và " + F(3, 4) + " là hai số đối nhau", [3]]], gt: "Kết quả câu a" }],
      steps: [
        "a) " + F("−6", 8) + " = " + F("−3", 4) + ";  " + F(9, "−12") + " = " + F("−9", 12) + " = " + F("−3", 4) + ";  −0,75 = " + F("−75", 100) + " = " + F("−3", 4) + ".",
        F(15, 20) + " = " + F(3, 4) + ". Vậy " + F("−6", 8) + ", " + F(9, "−12") + ", −0,75 cùng biểu diễn số hữu tỉ " + F("−3", 4) + "; " + F(3, 4) + " và " + F(15, 20) + " cùng biểu diễn số hữu tỉ " + F(3, 4) + ".",
        "b) " + F("−3", 4) + " và " + F(3, 4) + " là hai số đối nhau.",
        "Điểm biểu diễn " + F("−3", 4) + " nằm trước gốc O, điểm biểu diễn " + F(3, 4) + " nằm sau gốc O, và hai điểm cùng cách O " + F(3, 4) + " đơn vị."
      ],
      dap: "a) Nhóm " + F("−3", 4) + ": " + F("−6", 8) + ", " + F(9, "−12") + ", −0,75; nhóm " + F(3, 4) + ": " + F(3, 4) + ", " + F(15, 20) + ". b) Hai số đối nhau; hai điểm nằm hai phía của O và cách đều O.",
      loi: "Cho " + F(9, "−12") + " là số dương (quên mẫu âm)."
    },

    /* ================= VẬN DỤNG ================= */
    {
      id: "vd1", lv: "VD",
      de: "Tìm tất cả các số nguyên x thoả mãn " + F("−11", 4) + " < x < " + F(7, 3) + ", rồi tính tổng của các số nguyên đó.",
      goi: "Tìm xem mỗi số " + F("−11", 4) + " và " + F(7, 3) + " nằm giữa hai số nguyên liên tiếp nào.",
      pt: [
        { ten: "Cả bài", dich: "Các số nguyên x và tổng của chúng", sd: [["Liệt kê các số nguyên từ −2 đến 2 rồi cộng (ghép các cặp số đối)", [3, 4]], ["Biết " + F("−11", 4) + " nằm giữa −3 và −2; " + F(7, 3) + " nằm giữa 2 và 3", [1, 2]]], gt: "Hai số " + F("−11", 4) + " và " + F(7, 3) }],
      steps: [
        F("−11", 4) + " = −2,75, nên −3 < " + F("−11", 4) + " < −2.",
        F(7, 3) + " = 2" + F(1, 3) + ", nên 2 < " + F(7, 3) + " < 3.",
        "Vậy các số nguyên x thoả mãn là: −2; −1; 0; 1; 2.",
        "Tổng: (−2) + 2 + (−1) + 1 + 0 = 0 (các cặp số đối có tổng bằng 0)."
      ],
      dap: "x ∈ {−2; −1; 0; 1; 2}; tổng bằng 0.",
      loi: "Lấy cả −3 (vì nghĩ −3 > −2,75) hoặc bỏ sót số 0."
    },
    {
      id: "vd2", lv: "VD",
      de: "Không quy đồng mẫu, hãy so sánh:<br>a) " + F(2023, 2024) + " và " + F(2024, 2025) + ";  b) " + F("−17", 35) + " và " + F("−43", 85) + ".",
      goi: "a) So sánh phần còn thiếu để mỗi phân số bằng 1. b) So sánh mỗi số với số trung gian " + F("−1", 2) + ".",
      pt: [
        { ten: "Câu a", dich: "So sánh " + F(2023, 2024) + " và " + F(2024, 2025), sd: [["Phân số nào thiếu nhiều hơn để bằng 1 thì nhỏ hơn", [2]], ["Phần bù đến 1: " + F(1, 2024) + " và " + F(1, 2025) + "; so sánh hai phân số cùng tử 1", [1]]], gt: "Hai phân số có tử nhỏ hơn mẫu đúng 1 đơn vị" },
        { ten: "Câu b", dich: "So sánh " + F("−17", 35) + " và " + F("−43", 85), sd: [["Dùng số trung gian: " + F("−17", 35) + " > " + F("−1", 2) + " > " + F("−43", 85), [5]], ["So sánh " + F(17, 35) + " và " + F(43, 85) + " với " + F(1, 2), [3, 4]]], gt: "17 · 2 = 34 < 35; 43 · 2 = 86 > 85" }],
      hieu: { gt: "Hai cặp số: " + F(2023, 2024) + " và " + F(2024, 2025) + "; " + F("−17", 35) + " và " + F("−43", 85) + ". Không được quy đồng mẫu.", kl: "So sánh từng cặp.",
        hoi: [
          ["Vì sao đề không cho quy đồng? Nếu quy đồng thì khó ở đâu?", "Mẫu chung rất lớn (2024 · 2025 hay 35 · 85 rút gọn còn 595), tính lâu và dễ sai. Ta cần một cách nhìn khác."],
          ["Câu a: tử và mẫu của mỗi phân số có gì đặc biệt?", "Mỗi tử kém mẫu đúng 1, nên mỗi phân số chỉ \"thiếu\" một phần nhỏ để bằng 1: " + F(2023, 2024) + " thiếu " + F(1, 2024) + ", " + F(2024, 2025) + " thiếu " + F(1, 2025) + "."],
          ["Câu b: " + F(17, 35) + " và " + F(43, 85) + " gần với số nào quen thuộc?", "Cả hai đều gần " + F(1, 2) + " (vì 35 và 85 gần gấp đôi 17 và 43)."]] },
      nguoc: [
      { ten: "Câu a", dich: "So sánh " + F(2023, 2024) + " và " + F(2024, 2025),
        sd: [["Phân số thiếu nhiều hơn để bằng 1 thì nhỏ hơn", [2]], ["So sánh hai phần thiếu " + F(1, 2024) + " và " + F(1, 2025), [1]]],
        gt: "Mỗi phân số có tử kém mẫu 1 đơn vị",
        ket: F(1, 2024) + " > " + F(1, 2025) + " nên " + F(2023, 2024) + " thiếu nhiều hơn để bằng 1, do đó " + F(2023, 2024) + " < " + F(2024, 2025) + ".",
        buoc: [
        { hoi: "Hai phân số đều nhỏ hơn 1. Mỗi phân số còn thiếu bao nhiêu để bằng 1?",
          nho: "1 = " + F(2024, 2024) + " = " + F(2025, 2025) + ".",
          chon: [
            [F(2023, 2024) + " thiếu " + F(1, 2024) + ", còn " + F(2024, 2025) + " thiếu " + F(1, 2025), true, "Đúng. Vì 2024 − 2023 = 1 và 2025 − 2024 = 1."],
            ["Cả hai đều thiếu 1", false, "Tử kém mẫu 1 đơn vị, nhưng phần thiếu là một phần của mẫu: " + F(1, 2024) + " và " + F(1, 2025) + ", không phải 1."]],
          dat: "Phần thiếu để bằng 1 của mỗi phân số: " + F(1, 2024) + " và " + F(1, 2025) },
        { hoi: "Hai phần thiếu " + F(1, 2024) + " và " + F(1, 2025) + ", phần nào lớn hơn? Từ đó phân số nào nhỏ hơn?",
          nho: "Hai phân số cùng tử dương: phân số nào có mẫu nhỏ hơn thì lớn hơn.",
          chon: [
            [F(1, 2024) + " > " + F(1, 2025) + ", nên " + F(2023, 2024) + " thiếu nhiều hơn, tức là " + F(2023, 2024) + " < " + F(2024, 2025), true, "Đúng. Phân số nào thiếu nhiều hơn thì còn xa 1 hơn, nên nhỏ hơn."],
            [F(1, 2024) + " < " + F(1, 2025) + " vì 2024 < 2025", false, "Với cùng tử 1, mẫu nhỏ hơn thì phân số lớn hơn: " + F(1, 2024) + " > " + F(1, 2025) + "."]],
          dat: F(1, 2024) + " > " + F(1, 2025) }] },
      { ten: "Câu b", dich: "So sánh " + F("−17", 35) + " và " + F("−43", 85),
        sd: [["Số trung gian " + F("−1", 2) + ": " + F("−17", 35) + " > " + F("−1", 2) + " > " + F("−43", 85), [5]], ["So sánh " + F(17, 35) + " và " + F(43, 85) + " với " + F(1, 2), [3, 4]]],
        gt: "17 · 2 = 34 < 35; 43 · 2 = 86 > 85",
        ket: F(17, 35) + " < " + F(1, 2) + " < " + F(43, 85) + ", nên khi đổi dấu: " + F("−17", 35) + " > " + F("−1", 2) + " > " + F("−43", 85) + ". Vậy " + F("−17", 35) + " > " + F("−43", 85) + ".",
        buoc: [
        { hoi: "Hai số đều âm. Ta nên so sánh hai số dương nào trước để dễ hơn?",
          nho: "Với hai số âm, số nào có số đối lớn hơn thì số đó nhỏ hơn.",
          chon: [
            ["So sánh hai số đối " + F(17, 35) + " và " + F(43, 85) + ", rồi đổi chiều", true, "Đúng. Làm với số dương quen hơn, cuối cùng nhớ đổi chiều."],
            ["Số nào có tử lớn hơn thì lớn hơn", false, "Hai phân số khác mẫu, không so sánh tử được. Hơn nữa hai số âm."]],
          dat: "So sánh " + F(17, 35) + " và " + F(43, 85) },
        { hoi: "Hai phân số " + F(17, 35) + " và " + F(43, 85) + " cùng gần số nào? So với số đó, mỗi phân số lớn hơn hay nhỏ hơn?",
          nho: "So sánh " + F("a", "b") + " với " + F(1, 2) + " (b > 0): so sánh 2a với b.",
          chon: [
            ["Cùng gần " + F(1, 2) + ": " + F(17, 35) + " < " + F(1, 2) + " (vì 34 < 35), " + F(43, 85) + " > " + F(1, 2) + " (vì 86 > 85)", true, "Đúng. " + F(1, 2) + " nằm giữa hai phân số, làm số trung gian."],
            ["Cùng gần 1, nên bằng nhau", false, "Hai phân số chỉ gần " + F(1, 2) + ", và \"gần\" không có nghĩa là bằng."]],
          dat: F(17, 35) + " < " + F(1, 2) + " < " + F(43, 85) }] }],
      nhin: [
        ["Kiểm tra lại câu a bằng số thập phân (máy tính cầm tay).", "Máy tính cầm tay hiện gần như cùng một số 0,99950… cho cả hai phân số, rất khó so sánh. Cách nhìn phần thiếu tiện hơn nhiều: " + F(1, 2024) + " > " + F(1, 2025) + "."],
        ["Tổng quát câu a: với n là số nguyên dương, so sánh " + F("n", "n + 1") + " và " + F("n + 1", "n + 2") + ".", "Phần thiếu là " + F(1, "n + 1") + " > " + F(1, "n + 2") + ", nên " + F("n", "n + 1") + " < " + F("n + 1", "n + 2") + ": tử kém mẫu 1, mẫu càng lớn thì phân số càng gần 1."],
        ["Thử dùng số trung gian cho cặp " + F(13, 27) + " và " + F(15, 29) + ".", "13 · 2 = 26 < 27 nên " + F(13, 27) + " < " + F(1, 2) + "; 15 · 2 = 30 > 29 nên " + F(15, 29) + " > " + F(1, 2) + ". Vậy " + F(13, 27) + " < " + F(15, 29) + "."]],
      steps: [
        "a) " + F(2023, 2024) + " thiếu " + F(1, 2024) + " để bằng 1; " + F(2024, 2025) + " thiếu " + F(1, 2025) + " để bằng 1.",
        "Vì " + F(1, 2024) + " > " + F(1, 2025) + " nên " + F(2023, 2024) + " < " + F(2024, 2025) + ".",
        "b) Ta có 17 · 2 = 34 < 35 nên " + F(17, 35) + " < " + F(1, 2) + ".",
        "43 · 2 = 86 > 85 nên " + F(43, 85) + " > " + F(1, 2) + ".",
        "Do đó " + F(17, 35) + " < " + F(1, 2) + " < " + F(43, 85) + ", suy ra " + F("−17", 35) + " > " + F("−1", 2) + " > " + F("−43", 85) + ". Vậy " + F("−17", 35) + " > " + F("−43", 85) + "."
      ],
      dap: "a) " + F(2023, 2024) + " < " + F(2024, 2025) + ". b) " + F("−17", 35) + " > " + F("−43", 85) + ".",
      loi: "Ở câu b quên đổi chiều khi chuyển từ số dương sang số âm."
    },
    {
      id: "vd3", lv: "VD",
      de: "Trên trục số, điểm M biểu diễn số hữu tỉ a, điểm N biểu diễn số đối của a. Biết M nằm trước gốc O và khoảng cách giữa hai điểm M, N bằng 3" + F(1, 2) + " đơn vị. Tìm a và biểu diễn M, N trên trục số.",
      goi: "Hai điểm biểu diễn hai số đối nhau nằm về hai phía của O và cách đều O.",
      fig: function () { return T(-2, 2, 4, { M: [-7, 4], N: [7, 4] }); },
      pt: [
        { ten: "Cả bài", dich: "Tìm a", sd: [["Biết M cách O bao nhiêu và M nằm phía nào của O", [3, 4]], ["OM = ON = MN : 2 vì O là trung điểm của MN", [2]], ["M, N nằm hai phía của O, cách đều O (hai số đối nhau)", [1]]], gt: "M trước O, MN = 3" + F(1, 2) + " đơn vị" }],
      hieu: { gt: "M biểu diễn a, N biểu diễn số đối của a; M nằm trước gốc O; MN = 3" + F(1, 2) + " đơn vị.", kl: "Tìm a.",
        hoi: [
          ["a là số dương hay số âm? Vì sao?", "M nằm trước gốc O nên a là số hữu tỉ âm."],
          ["Hai điểm biểu diễn hai số đối nhau có tính chất gì trên trục số?", "Nằm về hai phía khác nhau của O và cách đều O."]] },
      nguoc: [
      { ten: "Cả bài", dich: "Tìm a",
        sd: [["M cách O " + F(7, 4) + " đơn vị và nằm trước O", [3, 4]], ["OM = MN : 2", [2]], ["O nằm giữa M, N và OM = ON", [1]]],
        gt: "M trước O, N biểu diễn số đối của a, MN = 3" + F(1, 2) + " = " + F(7, 2),
        ket: "OM = " + F(7, 2) + " : 2 = " + F(7, 4) + " đơn vị, M nằm trước O nên a = " + F("−7", 4) + ".",
        buoc: [
        { hoi: "Muốn tìm a, ta cần biết những gì về điểm M?",
          nho: "Số hữu tỉ âm được biểu diễn bởi điểm nằm trước O; khoảng cách từ điểm đó đến O cho biết \"phần không dấu\" của số.",
          chon: [
            ["Cần biết M nằm phía nào của O (đã biết: trước O) và M cách O bao nhiêu đơn vị", true, "Đúng. Phía cho biết dấu, khoảng cách cho biết độ lớn."],
            ["Chỉ cần biết MN", false, "MN là khoảng cách giữa M và N, chưa phải khoảng cách từ M đến O."]],
          dat: "Khoảng cách OM" },
        { hoi: "Làm sao tính OM từ MN = 3" + F(1, 2) + "?",
          nho: "Hai điểm biểu diễn hai số đối nhau nằm hai phía của O và cách đều O.",
          chon: [
            ["O nằm giữa M và N, OM = ON, nên OM = MN : 2 = " + F(7, 2) + " : 2 = " + F(7, 4), true, "Đúng. O là trung điểm của đoạn MN."],
            ["OM = MN = 3" + F(1, 2), false, "N không trùng O: N nằm phía bên kia của O, nên OM chỉ bằng một nửa MN."]],
          dat: "OM = ON = MN : 2 (O là trung điểm của MN)" }] }],
      nhin: [
        ["Thử lại: số đối của " + F("−7", 4) + " là bao nhiêu, khoảng cách giữa hai điểm có đúng 3" + F(1, 2) + " không?", "Số đối là " + F(7, 4) + ". Hai điểm cách O mỗi điểm " + F(7, 4) + " đơn vị ở hai phía, nên cách nhau " + F(14, 4) + " = 3" + F(1, 2) + " đơn vị. Đúng."],
        ["Nếu đề không cho \"M nằm trước gốc O\" thì sao?", "Khi đó a có thể là " + F("−7", 4) + " hoặc " + F(7, 4) + ": cả hai đều cho MN = 3" + F(1, 2) + "."]],
      steps: [
        "N biểu diễn số đối của a nên M và N nằm về hai phía của gốc O và cách đều O, tức là O nằm giữa M và N, OM = ON.",
        "Do đó OM = MN : 2 = 3" + F(1, 2) + " : 2 = " + F(7, 2) + " : 2 = " + F(7, 4) + " (đơn vị).",
        "M nằm trước gốc O nên a là số hữu tỉ âm.",
        "Vậy a = " + F("−7", 4) + ". Điểm M cách O " + F(7, 4) + " = 1" + F(3, 4) + " đơn vị về phía trước, N cách O " + F(7, 4) + " đơn vị về phía sau (xem hình)."
      ],
      dap: "a = " + F("−7", 4) + ".",
      loi: "Lấy OM = MN = " + F(7, 2) + " nên ra a = " + F("−7", 2) + "; hoặc quên dấu âm."
    },
    {
      id: "vd4", lv: "VD",
      de: "Cho số hữu tỉ x = " + F("2a − 6", 5) + " (a là số nguyên). Tìm a để:<br>a) x = 0;  b) x là số hữu tỉ dương;  c) x = −2.",
      goi: "Mẫu 5 là số dương, nên dấu của x là dấu của tử 2a − 6.",
      pt: [
        { ten: "Câu a", dich: "x = 0", sd: [["Tử bằng 0: 2a − 6 = 0", [1]]], gt: "Mẫu 5 ≠ 0" },
        { ten: "Câu b", dich: "x là số hữu tỉ dương", sd: [["2a > 6, tức là a > 3", [3]], ["Tử dương: 2a − 6 > 0 (vì mẫu 5 dương)", [2]]], gt: "Mẫu 5 > 0" },
        { ten: "Câu c", dich: "x = −2", sd: [["Tìm a từ 2a − 6 = −10", [5]], ["Viết −2 = " + F("−10", 5) + " để so sánh hai tử", [4]]], gt: "Hai phân số cùng mẫu bằng nhau khi tử bằng nhau" }],
      hieu: { gt: "x = " + F("2a − 6", 5) + ", a là số nguyên.", kl: "Tìm a để x = 0; x dương; x = −2.",
        hoi: [
          ["Mẫu của x là số dương hay âm? Điều đó giúp gì?", "Mẫu 5 dương, nên x cùng dấu với tử 2a − 6: x dương khi tử dương, x = 0 khi tử bằng 0."],
          ["Thử a = 4 và a = 2 thì x bằng bao nhiêu?", "a = 4: x = " + F(2, 5) + " > 0. a = 2: x = " + F("−2", 5) + " < 0. Có vẻ ranh giới là a = 3."]] },
      nguoc: [
      { ten: "Câu b", dich: "x là số hữu tỉ dương",
        sd: [["2a > 6, tức là a > 3; a nguyên nên a ≥ 4", [3]], ["Tử 2a − 6 > 0", [2]]],
        gt: "x = " + F("2a − 6", 5) + ", mẫu 5 > 0, a nguyên",
        ket: "x dương khi 2a − 6 > 0, tức là 2a > 6, a > 3. Vì a là số nguyên nên a ∈ {4; 5; 6; …}.",
        buoc: [
        { hoi: "Phân số có mẫu dương. Khi nào phân số đó là số dương?",
          nho: "Phân số có tử và mẫu cùng dấu thì dương, khác dấu thì âm.",
          chon: [
            ["Khi tử dương: 2a − 6 > 0", true, "Đúng. Mẫu 5 dương nên chỉ cần tử dương."],
            ["Khi a dương", false, "Thử a = 1: tử 2 · 1 − 6 = −4 âm, x âm. a dương chưa đủ."]],
          dat: "2a − 6 > 0" },
        { hoi: "2a − 6 > 0 nghĩa là 2a so với 6 thế nào? Từ đó a thế nào?",
          nho: "Số nguyên m − 6 > 0 khi m > 6.",
          chon: [
            ["2a > 6, nên a > 3; a nguyên nên a = 4; 5; 6; …", true, "Đúng. a = 3 thì x = 0, không dương."],
            ["a ≥ 3", false, "a = 3 cho x = 0, mà 0 không là số hữu tỉ dương."]],
          dat: "2a > 6" }] }],
      nhin: [
        ["Thử lại câu c với a = −2.", "x = " + F("2 · (−2) − 6", 5) + " = " + F("−10", 5) + " = −2. Đúng."],
        ["Mở rộng: tìm a để x là số hữu tỉ âm.", "Tử âm: 2a − 6 < 0, 2a < 6, a < 3: a ∈ {2; 1; 0; −1; …}."]],
      steps: [
        "a) x = 0 khi tử 2a − 6 = 0, tức là 2a = 6, a = 3.",
        "b) Mẫu 5 > 0 nên x dương khi tử dương: 2a − 6 > 0.",
        "Tức là 2a > 6, a > 3. Vì a là số nguyên nên a ∈ {4; 5; 6; …}.",
        "c) −2 = " + F("−10", 5) + ". Hai phân số cùng mẫu 5 bằng nhau khi tử bằng nhau: 2a − 6 = −10.",
        "Suy ra 2a = −4, a = −2."
      ],
      dap: "a) a = 3. b) a là số nguyên lớn hơn 3. c) a = −2.",
      loi: "Câu b lấy cả a = 3 (khi đó x = 0)."
    },
    {
      id: "vd5", lv: "VD",
      de: "Nhiệt độ lúc 6 giờ sáng cùng một ngày ở bốn nơi là: Sa Pa −2,5 °C; Mẫu Sơn −3" + F(1, 4) + " °C; Đồng Văn " + F("−11", 4) + " °C; Tam Đảo 1,5 °C.<br>a) Nơi nào lạnh nhất, nơi nào ấm nhất?<br>b) Sắp xếp các nhiệt độ theo thứ tự từ thấp đến cao.<br>c) Trên trục số, điểm biểu diễn nhiệt độ nào gần gốc O nhất?",
      goi: "Đổi tất cả về số thập phân: −3" + F(1, 4) + " = −3,25; " + F("−11", 4) + " = −2,75.",
      pt: [
        { ten: "Cả bài", dich: "Thứ tự các nhiệt độ", sd: [["So sánh bốn số thập phân", [2, 3]], ["Đổi hỗn số, phân số ra số thập phân", [1]]], gt: "Bốn nhiệt độ đã cho" }],
      steps: [
        "Đổi: −3" + F(1, 4) + " = −3,25;  " + F("−11", 4) + " = −2,75.",
        "a) −3,25 < −2,75 < −2,5 < 1,5, nên Mẫu Sơn lạnh nhất, Tam Đảo ấm nhất.",
        "b) Từ thấp đến cao: Mẫu Sơn (−3" + F(1, 4) + " °C), Đồng Văn (" + F("−11", 4) + " °C), Sa Pa (−2,5 °C), Tam Đảo (1,5 °C).",
        "c) Khoảng cách đến O lần lượt là 3,25; 2,75; 2,5; 1,5 đơn vị. Nhỏ nhất là 1,5, nên điểm biểu diễn 1,5 (Tam Đảo) gần O nhất."
      ],
      dap: "a) Mẫu Sơn lạnh nhất, Tam Đảo ấm nhất. b) −3" + F(1, 4) + "; " + F("−11", 4) + "; −2,5; 1,5. c) 1,5 °C (Tam Đảo).",
      loi: "Cho −2,5 < −3,25 vì 2,5 < 3,25."
    },

    /* ================= DÀNH CHO HSG ================= */
    {
      id: "hsg1", lv: "HSG",
      de: "a) Cho a, b, m là các số nguyên dương và a < b. Chứng minh " + F("a", "b") + " < " + F("a + m", "b + m") + ".<br>b) Áp dụng, so sánh A = " + F(P(10, 11) + " − 1", P(10, 12) + " − 1") + " và B = " + F(P(10, 10) + " + 1", P(10, 11) + " + 1") + ".",
      goi: "a) Quy đồng hai phân số với mẫu chung b(b + m) rồi so sánh hai tử. b) A < 1; cộng thêm cùng một số vào tử và mẫu của A để được B.",
      hieu: { gt: "a, b, m nguyên dương, a < b. A = " + F(P(10, 11) + " − 1", P(10, 12) + " − 1") + ", B = " + F(P(10, 10) + " + 1", P(10, 11) + " + 1") + ".", kl: "a) " + F("a", "b") + " < " + F("a + m", "b + m") + ". b) So sánh A và B.",
        hoi: [
          ["Thử với số cụ thể: " + F(2, 3) + " và " + F("2 + 1", "3 + 1") + " = " + F(3, 4) + ", số nào lớn hơn?", F(2, 3) + " = " + F(8, 12) + " < " + F(9, 12) + " = " + F(3, 4) + ". Cộng cùng một số vào tử và mẫu, phân số nhỏ hơn 1 tăng lên."],
          ["Ở câu b, A lớn hơn hay nhỏ hơn 1? Tử và mẫu của B có liên hệ gì với tử và mẫu của A?", "Tử của A nhỏ hơn mẫu nên A < 1. Nhân tử và mẫu của B với 10: " + F(P(10, 11) + " + 10", P(10, 12) + " + 10") + ", tức là tử và mẫu của A cùng cộng thêm 11."]] },
      nguoc: [
      { ten: "Câu a", dich: F("a", "b") + " < " + F("a + m", "b + m"),
        sd: [["a · (b + m) < b · (a + m), tức là a · m < b · m", [2, 3]], ["Quy đồng với mẫu chung dương b · (b + m)", [1]]],
        gt: "a < b, m > 0",
        ket: "Quy đồng: hai tử là ab + am và ab + bm. Vì a < b và m > 0 nên am < bm, suy ra điều phải chứng minh.",
        buoc: [
        { hoi: "Hai phân số khác mẫu. Cách quen thuộc để so sánh chúng là gì?",
          nho: "Hai phân số cùng mẫu dương: phân số nào có tử lớn hơn thì lớn hơn.",
          chon: [
            ["Quy đồng với mẫu chung b · (b + m) (là số dương) rồi so sánh hai tử", true, "Đúng. Hai tử là a · (b + m) và b · (a + m)."],
            ["So sánh a với a + m và b với b + m", false, "Cả tử và mẫu cùng tăng, nên chỉ so sánh riêng tử hay riêng mẫu không kết luận được."]],
          dat: "Quy đồng mẫu b · (b + m)" },
        { hoi: "So sánh hai tử a · (b + m) = ab + am và b · (a + m) = ab + bm. Phần nào khác nhau?",
          nho: "Tính chất phân phối của phép nhân đối với phép cộng (số nguyên, Toán 6).",
          chon: [
            ["Chỉ khác am và bm; vì a < b, m > 0 nên am < bm", true, "Đúng. Nhân hai vế của a < b với số dương m thì thứ tự giữ nguyên."],
            ["ab + am lớn hơn vì a đứng trước", false, "Phải so sánh từng phần: hai tử cùng có ab, phần còn lại là am và bm."]],
          dat: "am < bm" }] },
      { ten: "Câu b", dich: "So sánh A và B",
        sd: [["B = " + F(P(10, 11) + " + 10", P(10, 12) + " + 10") + " là A với tử và mẫu cùng cộng thêm 11", [4, 5]], ["A < 1 (tử nhỏ hơn mẫu) nên áp dụng được câu a", [4]]],
        gt: "Câu a; " + P(10, 11) + " − 1 < " + P(10, 12) + " − 1",
        ket: "A < " + F(P(10, 11) + " − 1 + 11", P(10, 12) + " − 1 + 11") + " = " + F(P(10, 11) + " + 10", P(10, 12) + " + 10") + " = B.",
        buoc: [
        { hoi: "Muốn dùng câu a, cần viết B thành phân số có tử và mẫu là tử và mẫu của A cộng thêm cùng một số. Làm thế nào?",
          nho: "Nhân cả tử và mẫu của một phân số với cùng một số khác 0 thì được phân số bằng nó.",
          chon: [
            ["Nhân tử và mẫu của B với 10: B = " + F(P(10, 11) + " + 10", P(10, 12) + " + 10"), true, "Đúng. Tử: (" + P(10, 11) + " − 1) + 11; mẫu: (" + P(10, 12) + " − 1) + 11."],
            ["Chia tử và mẫu của A cho 10", false, P(10, 11) + " − 1 không chia hết cho 10, không làm được."]],
          dat: "B = " + F(P(10, 11) + " + 10", P(10, 12) + " + 10") }] }],
      nhin: [
        ["Kiểm tra với số nhỏ hơn: so sánh " + F(P(10, 2) + " − 1", P(10, 3) + " − 1") + " và " + F(P(10, 1) + " + 1", P(10, 2) + " + 1") + ".", F(99, 999) + " ≈ 0,0991 và " + F(11, 101) + " ≈ 0,1089. Đúng là số thứ nhất nhỏ hơn."],
        ["Câu a còn đúng không nếu a > b?", "Không. Khi a > b thì am > bm nên " + F("a", "b") + " > " + F("a + m", "b + m") + ": phân số lớn hơn 1 giảm khi cộng cùng một số vào tử và mẫu."]],
      steps: [
        "a) Quy đồng với mẫu chung b · (b + m) > 0: " + F("a", "b") + " = " + F("a · (b + m)", "b · (b + m)") + ";  " + F("a + m", "b + m") + " = " + F("b · (a + m)", "b · (b + m)") + ".",
        "Hai tử: a · (b + m) = ab + am và b · (a + m) = ab + bm.",
        "Vì a < b và m > 0 nên am < bm, suy ra ab + am < ab + bm. Vậy " + F("a", "b") + " < " + F("a + m", "b + m") + ".",
        "b) Tử của A nhỏ hơn mẫu nên áp dụng câu a với m = 11: A < " + F("(" + P(10, 11) + " − 1) + 11", "(" + P(10, 12) + " − 1) + 11") + " = " + F(P(10, 11) + " + 10", P(10, 12) + " + 10") + ".",
        F(P(10, 11) + " + 10", P(10, 12) + " + 10") + " = " + F("10 · (" + P(10, 10) + " + 1)", "10 · (" + P(10, 11) + " + 1)") + " = " + F(P(10, 10) + " + 1", P(10, 11) + " + 1") + " = B. Vậy A < B."
      ],
      dap: "a) Đã chứng minh. b) A < B."
    },
    {
      id: "hsg2", lv: "HSG",
      de: "Cho số hữu tỉ x = " + F("n + 7", "n + 2") + " với n là số nguyên, n ≠ −2.<br>a) Tìm tất cả các số nguyên n để x là số nguyên.<br>b) Với các giá trị đó, giá trị nào của n làm x là số nguyên âm?",
      goi: "x là số nguyên khi n + 7 chia hết cho n + 2. Viết n + 7 = (n + 2) + 5.",
      hieu: { gt: "x = " + F("n + 7", "n + 2") + ", n ∈ ℤ, n ≠ −2.", kl: "a) n để x ∈ ℤ. b) n để x là số nguyên âm.",
        hoi: [
          ["Khi nào một phân số " + F("a", "b") + " (a, b nguyên, b ≠ 0) bằng một số nguyên?", "Khi a chia hết cho b."],
          ["Thử n = 3: x bằng bao nhiêu? n = 0 thì sao?", "n = 3: x = " + F(10, 5) + " = 2, là số nguyên. n = 0: x = " + F(7, 2) + ", không là số nguyên."]] },
      nguoc: [
      { ten: "Câu a", dich: "n + 7 chia hết cho n + 2",
        sd: [["n + 2 là ước của 5: n + 2 ∈ {1; −1; 5; −5}", [3]], ["5 chia hết cho n + 2 (vì n + 7 = (n + 2) + 5)", [2]]],
        gt: "n + 2 chia hết cho n + 2",
        ket: "n + 2 ∈ {1; −1; 5; −5}, nên n ∈ {−1; −3; 3; −7}.",
        buoc: [
        { hoi: "Tử n + 7 và mẫu n + 2 cùng chứa n. Viết tử theo mẫu thế nào để n \"biến mất\"?",
          nho: "Nếu a chia hết cho m và b chia hết cho m thì a − b chia hết cho m (Toán 6).",
          chon: [
            ["n + 7 = (n + 2) + 5, mà n + 2 chia hết cho n + 2, nên cần 5 chia hết cho n + 2", true, "Đúng. Phần còn lại là số 5 không chứa n."],
            ["Cần 7 chia hết cho 2", false, "Không thể tách riêng tử và mẫu như vậy: n + 7 chia hết cho n + 2 không có nghĩa là 7 chia hết cho 2."]],
          dat: "5 chia hết cho n + 2" },
        { hoi: "5 chia hết cho n + 2 thì n + 2 là gì của 5? Liệt kê.",
          nho: "Các ước nguyên của 5 là 1; −1; 5; −5.",
          chon: [
            ["n + 2 ∈ {1; −1; 5; −5}", true, "Đúng. Nhớ lấy cả ước âm."],
            ["n + 2 ∈ {1; 5}", false, "Thiếu hai ước âm −1 và −5; n là số nguyên nên n + 2 có thể âm."]],
          dat: "n + 2 ∈ Ư(5)" }] }],
      nhin: [
        ["Thử lại bốn giá trị n.", "n = −1: x = " + F(6, 1) + " = 6; n = −3: x = " + F(4, "−1") + " = −4; n = 3: x = " + F(10, 5) + " = 2; n = −7: x = " + F(0, "−5") + " = 0. Đều là số nguyên."],
        ["Bài tương tự: tìm số nguyên n để " + F("2n + 7", "n + 2") + " là số nguyên.", "2n + 7 = 2 · (n + 2) + 3, nên n + 2 ∈ {1; −1; 3; −3}, n ∈ {−1; −3; 1; −5}."]],
      steps: [
        "a) x là số nguyên khi n + 7 chia hết cho n + 2.",
        "Ta có n + 7 = (n + 2) + 5. Vì n + 2 chia hết cho n + 2 nên n + 7 chia hết cho n + 2 khi và chỉ khi 5 chia hết cho n + 2.",
        "Do đó n + 2 ∈ {1; −1; 5; −5}, suy ra n ∈ {−1; −3; 3; −7}.",
        "b) Tính x: n = −1 thì x = 6; n = −3 thì x = " + F(4, "−1") + " = −4; n = 3 thì x = 2; n = −7 thì x = " + F(0, "−5") + " = 0.",
        "Chỉ có n = −3 cho x = −4 là số nguyên âm (x = 0 không là số âm)."
      ],
      dap: "a) n ∈ {−1; −3; 3; −7}. b) n = −3 (khi đó x = −4).",
      loi: "Chỉ lấy ước dương của 5; coi x = 0 là số âm."
    },
    {
      id: "hsg3", lv: "HSG",
      de: "a) Cho a, b, c, d là các số nguyên, b > 0, d > 0 và " + F("a", "b") + " < " + F("c", "d") + ". Chứng minh " + F("a", "b") + " < " + F("a + c", "b + d") + " < " + F("c", "d") + ".<br>b) Áp dụng, viết ba số hữu tỉ xen giữa " + F("−1", 3) + " và " + F("−1", 4) + ".",
      goi: "a) " + F("a", "b") + " < " + F("c", "d") + " khi và chỉ khi a · d < b · c (quy đồng với mẫu chung bd > 0). b) Áp dụng nhiều lần câu a.",
      hieu: { gt: "a, b, c, d nguyên, b > 0, d > 0, " + F("a", "b") + " < " + F("c", "d") + ".", kl: "a) " + F("a", "b") + " < " + F("a + c", "b + d") + " < " + F("c", "d") + ". b) Ba số xen giữa " + F("−1", 3) + " và " + F("−1", 4) + ".",
        hoi: [
          ["Thử với " + F(1, 3) + " < " + F(1, 2) + ": phân số " + F("1 + 1", "3 + 2") + " nằm ở đâu?", F(2, 5) + " = 0,4 nằm giữa 0,333… và 0,5."],
          ["Điều kiện " + F("a", "b") + " < " + F("c", "d") + " viết lại theo tử và mẫu thế nào?", "Quy đồng mẫu bd > 0: ad < bc."]] },
      nguoc: [
      { ten: "Câu a (vế trái)", dich: F("a", "b") + " < " + F("a + c", "b + d"),
        sd: [["a · (b + d) < b · (a + c), tức là ad < bc", [2]], ["Biết ad < bc (từ giả thiết)", [1]]],
        gt: F("a", "b") + " < " + F("c", "d") + ", b > 0, d > 0",
        ket: "a · (b + d) = ab + ad < ab + bc = b · (a + c), nên " + F("a", "b") + " < " + F("a + c", "b + d") + ". Vế phải chứng minh tương tự.",
        buoc: [
        { hoi: "Giả thiết " + F("a", "b") + " < " + F("c", "d") + " cho ta điều gì về các số nguyên a, b, c, d?",
          nho: "Quy đồng hai phân số có mẫu dương: so sánh các tử.",
          chon: [
            ["ad < bc (quy đồng với mẫu chung bd > 0)", true, "Đúng. Từ nay ta làm việc với các số nguyên, dễ hơn."],
            ["a < c và b < d", false, "Không đúng: " + F(1, 3) + " < " + F(1, 2) + " nhưng 3 > 2."]],
          dat: "ad < bc" },
        { hoi: "Để có " + F("a", "b") + " < " + F("a + c", "b + d") + ", cần so sánh hai số nguyên nào?",
          nho: "Mẫu chung b · (b + d) dương.",
          chon: [
            ["a · (b + d) và b · (a + c), tức là ab + ad và ab + bc", true, "Đúng. Hai số chỉ khác ad và bc, mà ad < bc."],
            ["a và a + c", false, "Mẫu cũng thay đổi, nên không so sánh riêng tử được."]],
          dat: "ab + ad < ab + bc" }] }],
      nhin: [
        ["Kiểm tra câu b bằng số thập phân.", "−0,333… < −0,3 < −0,2857… < −0,2727… < −0,25. Đúng thứ tự."],
        ["Giữa hai số hữu tỉ khác nhau có bao nhiêu số hữu tỉ?", "Áp dụng câu a mãi mãi: luôn tìm được số mới nằm giữa, nên có vô số số hữu tỉ xen giữa."]],
      steps: [
        "a) Vì b > 0, d > 0, quy đồng mẫu bd: " + F("a", "b") + " < " + F("c", "d") + " nên ad < bc.",
        "So sánh " + F("a", "b") + " và " + F("a + c", "b + d") + " (mẫu chung b · (b + d) > 0): a · (b + d) = ab + ad < ab + bc = b · (a + c). Vậy " + F("a", "b") + " < " + F("a + c", "b + d") + ".",
        "So sánh " + F("a + c", "b + d") + " và " + F("c", "d") + " (mẫu chung d · (b + d) > 0): (a + c) · d = ad + cd < bc + cd = c · (b + d). Vậy " + F("a + c", "b + d") + " < " + F("c", "d") + ".",
        "b) " + F("−1", 3) + " < " + F("−1", 4) + " nên " + F("−1", 3) + " < " + F("−1 + (−1)", "3 + 4") + " = " + F("−2", 7) + " < " + F("−1", 4) + ".",
        "Tiếp tục: " + F("−1", 3) + " < " + F("−3", 10) + " < " + F("−2", 7) + " (ghép " + F("−1", 3) + " với " + F("−2", 7) + ") và " + F("−2", 7) + " < " + F("−3", 11) + " < " + F("−1", 4) + " (ghép " + F("−2", 7) + " với " + F("−1", 4) + ").",
        "Vậy " + F("−1", 3) + " < " + F("−3", 10) + " < " + F("−2", 7) + " < " + F("−3", 11) + " < " + F("−1", 4) + "."
      ],
      dap: "a) Đã chứng minh. b) Chẳng hạn " + F("−3", 10) + ";  " + F("−2", 7) + ";  " + F("−3", 11) + "."
    }
  ];

  window.TL_DATA = {
    bai: "sh7",
    ten: "Bài 1. Tập hợp các số hữu tỉ",
    items: ITEMS,
    /* Bài khái niệm: chia theo mức (thầy duyệt 27/11/2026). Cuối mỗi mức có bài tự luyện: [đề, gợi ý, đáp số]. */
    tlMuc: {
      NB: [
        ["Viết các số −0,8;  3" + F(1, 5) + ";  −4 dưới dạng phân số.", "Số thập phân đổi ra phân số mẫu 10 rồi rút gọn; hỗn số: lấy phần nguyên nhân mẫu cộng tử.", "−0,8 = " + F("−4", 5) + ";  3" + F(1, 5) + " = " + F(16, 5) + ";  −4 = " + F("−4", 1) + "."],
        ["Tìm số đối của các số " + F("−3", 11) + ";  1,7;  " + F(5, "−6") + ".", "Chỉ đổi dấu. " + F(5, "−6") + " = " + F("−5", 6) + ".", F(3, 11) + ";  −1,7;  " + F(5, 6) + "."]],
      TH: [
        ["So sánh " + F("−5", 6) + " và " + F("−7", 9) + ".", "Quy đồng với mẫu chung 18.", F("−15", 18) + " < " + F("−14", 18) + ", nên " + F("−5", 6) + " < " + F("−7", 9) + "."],
        ["Sắp xếp theo thứ tự tăng dần: 0,3;  " + F("−1", 2) + ";  " + F(1, 4) + ";  −0,45.", "Đổi ra số thập phân: " + F("−1", 2) + " = −0,5; " + F(1, 4) + " = 0,25.", F("−1", 2) + ";  −0,45;  " + F(1, 4) + ";  0,3."]],
      VD: [
        ["Tìm các số nguyên x thoả mãn " + F("−9", 4) + " ≤ x < " + F(8, 5) + ".", F("−9", 4) + " = −2,25; " + F(8, 5) + " = 1,6.", "x ∈ {−2; −1; 0; 1}."],
        ["Không quy đồng, so sánh " + F("−19", 20) + " và " + F("−20", 21) + ".", "So sánh " + F(19, 20) + " và " + F(20, 21) + " qua phần thiếu để bằng 1, rồi đổi chiều.", F(19, 20) + " < " + F(20, 21) + ", nên " + F("−19", 20) + " > " + F("−20", 21) + "."],
        ["Điểm A trên trục số biểu diễn số hữu tỉ a nằm sau gốc O, cách điểm biểu diễn số đối của a là " + F(5, 3) + " đơn vị. Tìm a.", "Hai điểm cách đều O; khoảng cách từ A đến O bằng một nửa.", "a = " + F(5, 6) + "."]]
    },
    /* Làm sai câu Vận dụng (theo phần kiến thức của trang) → bài mẫu giải theo 4 bước. */
    mau: { ids: ["vd2", "vd3", "vd4"], theoPhan: { ss: "vd2", ts: "vd3", sd: "vd3", kn: "vd4" } }
  };
})();
