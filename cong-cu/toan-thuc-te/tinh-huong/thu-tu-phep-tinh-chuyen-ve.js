PISA.push(
 G(()=>{const a=5*ri(14,24),b=5*ri(8,13),c=5*ri(10,16),p=ri(2,3),q=ri(1,3),r=ri(1,3),d=sel([10,15,20]);if(b>=a)throw 0;
  const tot=p*a+q*b+r*c,tue=p*(a-d)+q*(b-d)+r*c,e=sel([10,12,15]),x=ri(2,5),f=5*ri(2,10),Mm=tot+e*x+f;
  const ex=`${p} · ${a} + ${q} · ${b} + ${r} · ${c}`;
  return {title:'Đi xem phim',ctx:P(`Giá vé xem phim là ${a} nghìn đồng cho mỗi người lớn và ${b} nghìn đồng cho mỗi trẻ em. Mỗi phần bỏng ngô kèm nước giá ${c} nghìn đồng. Gia đình bạn Hà gồm ${p} người lớn và ${q} trẻ em đi xem phim và mua ${r} phần bỏng ngô kèm nước.`),qs:[
   M('Biểu thức nào tính tổng số tiền gia đình bạn Hà phải trả (nghìn đồng)?',ex,[[`(${p} + ${q}) · (${a} + ${b}) + ${r} · ${c}`,'Biểu thức này tính như thể mỗi người mua cả vé người lớn lẫn vé trẻ em.'],[`${p} · (${a} + ${q}) · ${b} + ${r} · ${c}`,'Đặt dấu ngoặc sai làm thay đổi thứ tự thực hiện phép tính.'],[`(${p} + ${q} + ${r}) · (${a} + ${b} + ${c})`,'Mỗi loại có số lượng và giá riêng, phải nhân từng cặp rồi mới cộng.']],`Tiền vé người lớn + tiền vé trẻ em + tiền bỏng ngô: ${ex}.`,'tt','TH'),
   A('Gia đình bạn Hà phải trả tất cả bao nhiêu nghìn đồng?',tot,'nghìn đồng',`Nhân trước, cộng sau: ${ex} = ${p*a} + ${q*b} + ${r*c} = ${tot}.`,'tt','TH'),
   A(`Vào thứ Ba, mỗi vé (cả người lớn và trẻ em) được giảm ${d} nghìn đồng, bỏng ngô không giảm giá. Nếu đi vào thứ Ba thì gia đình bạn Hà phải trả bao nhiêu nghìn đồng?`,tue,'nghìn đồng',`${p} · (${a} − ${d}) + ${q} · (${b} − ${d}) + ${r} · ${c} = ${p*(a-d)} + ${q*(b-d)} + ${r*c} = ${tue}. Làm phép tính trong ngoặc trước.`,'nn','VD'),
   A(`Một ngày thường, gia đình bạn Hà mang theo ${Mm} nghìn đồng. Sau khi mua vé và bỏng ngô như trên, Hà mua thêm một số chai nước, mỗi chai ${e} nghìn đồng, thì còn lại ${f} nghìn đồng. Hà đã mua bao nhiêu chai nước?`,x,'chai',`Gọi số chai nước là x. Ta có ${tot} + ${e} · x + ${f} = ${Mm}. Chuyển vế: ${e} · x = ${Mm} − ${tot} − ${f} = ${e*x}, nên x = ${e*x} : ${e} = ${x}.`,'cv','VD')]};}),
 G(()=>{const b=sel([20,25,30,40,50]),c=sel([10,20,25,30,50]),g=(x,y)=>y?g(y,x%y):x,L=b*(b+c)/g(b,b+c);
  const k=ri(1,6),need=L*k;if(need<400||need>3000)throw 0;const a=5*ri(10,60),Pr=a+need,w=ri(3,6);
  const x=need/b,y=need/(b+c);if(!Number.isInteger(x)||!Number.isInteger(y)||w>=x)throw 0;
  return {title:'Để dành tiền mua xe đạp',ctx:P(`Bạn Minh muốn mua một chiếc xe đạp giá ${Pr} nghìn đồng. Minh đã có sẵn ${a} nghìn đồng và mỗi tuần để dành thêm được ${b} nghìn đồng.`),qs:[
   A(`Sau ${w} tuần, Minh có tất cả bao nhiêu nghìn đồng?`,a+w*b,'nghìn đồng',`${a} + ${w} · ${b} = ${a} + ${w*b} = ${a+w*b}.`,'tt','TH'),
   M('Gọi x là số tuần Minh cần để dành để có vừa đủ tiền mua xe. Đẳng thức nào đúng?',`${a} + ${b} · x = ${Pr}`,[[`(${a} + ${b}) · x = ${Pr}`,`Số tiền có sẵn ${a} nghìn đồng chỉ tính một lần, không nhân với số tuần.`],[`${a} · x + ${b} = ${Pr}`,`Số tiền mỗi tuần để dành là ${b} nghìn đồng, nên ${b} mới nhân với số tuần.`],[`${b} · x − ${a} = ${Pr}`,'Số tiền có sẵn được cộng thêm vào, không bị trừ đi.']],`Tiền có sẵn + tiền để dành trong x tuần = giá xe: ${a} + ${b} · x = ${Pr}.`,'dt','TH'),
   A('Minh cần để dành trong bao nhiêu tuần thì vừa đủ tiền mua xe?',x,'tuần',`${a} + ${b} · x = ${Pr}. Chuyển vế: ${b} · x = ${Pr} − ${a} = ${need}, nên x = ${need} : ${b} = ${x}.`,'cv','VD'),
   A(`Nếu từ tuần đầu tiên, mỗi tuần Minh để dành thêm được ${c} nghìn đồng nữa (tức là ${b+c} nghìn đồng mỗi tuần) thì Minh cần để dành trong bao nhiêu tuần?`,y,'tuần',`${a} + ${b+c} · y = ${Pr}. Chuyển vế: ${b+c} · y = ${need}, nên y = ${need} : ${b+c} = ${y}.`,'cv','VD')]};})
);
