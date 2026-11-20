PISA.push(
 G(()=>{const n=sel([4,5,6,8]),items=[['Thuê xe',10*ri(40,90)],['Đồ ăn',rd(ri(300,700)+sel([0,0.5]),1)],['Nước uống',rd(ri(60,150)+sel([0,0.5]),1)],['Vé tham quan',n*5*ri(6,12)]];
  const tot=rd(items.reduce((a,b)=>a+b[1],0),1),each=rd(tot/n,2);if(Math.abs(each*100-Math.round(each*100))>1e-6||Math.abs(tot/n-each)>1e-9)throw 0;
  const m=50*Math.floor(each/50);if(m<=0||each-m<1)throw 0;const more=rd(each-m,2);
  const L=items.map(x=>nm(x[1])).join(' + ');
  return {title:'Chia tiền chuyến dã ngoại',ctx:P(`Nhóm ${n} bạn đi dã ngoại và chia đều mọi khoản chi. Bảng sau ghi các khoản chi của cả nhóm (đơn vị: nghìn đồng).`)+T(['Khoản chi','Số tiền (nghìn đồng)'],items.map(x=>[x[0],nm(x[1])])),qs:[
   A('Tổng chi phí của cả nhóm là bao nhiêu nghìn đồng?',tot,'nghìn đồng',`${L} = ${nm(tot)}.`,'pt','TH'),
   A('Chia đều cho mọi bạn, mỗi bạn phải góp bao nhiêu nghìn đồng?',each,'nghìn đồng',`${nm(tot)} : ${n} = ${nm(each)}.`,'pt','VD'),
   M(`Trước chuyến đi, mỗi bạn đã đóng trước ${m} nghìn đồng. Biểu thức nào tính số tiền mỗi bạn còn phải góp thêm (nghìn đồng)?`,`(${L}) : ${n} − ${m}`,[[`${L} : ${n} − ${m}`,`Thiếu dấu ngoặc: phép chia làm trước nên chỉ có số cuối bị chia cho ${n}.`],[`(${L}) : (${n} − ${m})`,`Mỗi bạn góp tổng chi phí chia ${n} rồi mới trừ đi ${m}, không chia cho ${n} − ${m}.`],[`(${L} − ${m}) : ${n}`,`Mỗi bạn đã đóng ${m} nghìn đồng, nên cả nhóm đã đóng ${n} · ${m}, không phải ${m}.`]],`Số tiền mỗi bạn phải góp trừ đi số đã đóng trước: (${L}) : ${n} − ${m}.`,'tc','TH'),
   A(`Mỗi bạn còn phải góp thêm bao nhiêu nghìn đồng?`,more,'nghìn đồng',`(${L}) : ${n} − ${m} = ${nm(each)} − ${m} = ${nm(more)}.`,'tc','VD')]};}),
 G(()=>{const k=sel([2,3]),n=ri(8,12),mI=ri(6,10),pI=ri(2,mI-2),pw=(b,e)=>`${b}<sup>${e}</sup>`,cnt=j=>Math.pow(k,j-1);
  const s4=1+k+k*k+k*k*k;
  return {title:'Bàn cờ và hạt thóc',ctx:P(`Trên một bàn cờ, người ta đặt 1 hạt thóc vào ô thứ nhất. Từ ô thứ hai, số hạt thóc ở mỗi ô gấp ${k} lần số hạt thóc ở ô ngay trước nó.`),qs:[
   A('Ô thứ năm có bao nhiêu hạt thóc?',cnt(5),'hạt',`Ô thứ năm có ${pw(k,4)} = ${cnt(5)} hạt.`,'lt','TH'),
   M(`Số hạt thóc ở ô thứ ${n} được viết là`,pw(k,n-1),[[pw(k,n),`Ô thứ nhất có 1 = ${pw(k,0)} hạt, nên ô thứ ${n} có ${pw(k,n-1)} hạt, số mũ nhỏ hơn số thứ tự của ô một đơn vị.`],[`${k} · ${n-1}`,`Mỗi ô gấp ${k} lần ô trước nên phải nhân ${k} nhiều lần, tức là luỹ thừa, không phải ${k} · ${n-1}.`],[pw(n-1,k),'Cơ số và số mũ bị đổi chỗ.']],`Từ ô thứ nhất đến ô thứ ${n}, số hạt được nhân với ${k} tất cả ${n-1} lần: ${pw(k,n-1)}.`,'lt','TH'),
   A(`Số hạt thóc ở ô thứ ${mI} gấp bao nhiêu lần số hạt thóc ở ô thứ ${pI}?`,Math.pow(k,mI-pI),'lần',`${pw(k,mI-1)} : ${pw(k,pI-1)} = ${pw(k,mI-pI)} = ${Math.pow(k,mI-pI)}.`,'lt','VD'),
   A('Bốn ô đầu tiên có tất cả bao nhiêu hạt thóc?',s4,'hạt',`1 + ${k} + ${pw(k,2)} + ${pw(k,3)} = 1 + ${k} + ${k*k} + ${k*k*k} = ${s4}.`,'pt','VD')]};})
);
