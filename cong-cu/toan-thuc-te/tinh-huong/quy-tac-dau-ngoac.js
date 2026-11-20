PISA.push(
 G(()=>{const a=sel([200,300,500]),x=ri(12,45),y=5*ri(14,30),z=5*ri(8,20),r=a-(x+y+z);if(r<=0)throw 0;
  const b=a+sel([50,100,150,200]),bk=r+x;
  return {title:'Mẹ đi chợ',ctx:P(`Mẹ mang theo ${a} nghìn đồng đi chợ. Mẹ mua rau hết ${x} nghìn đồng, thịt hết ${y} nghìn đồng và cá hết ${z} nghìn đồng.`),qs:[
   M('Biểu thức nào tính đúng số tiền mẹ còn lại (nghìn đồng)?',`${a} − (${x} + ${y} + ${z})`,[[`${a} − (${x} + ${y}) + ${z}`,'Tiền mua cá cũng phải trừ đi, không được cộng vào.'],[`${a} − ${x} + ${y} + ${z}`,'Đây là bỏ dấu ngoặc sai: trước ngoặc có dấu "−" thì phải đổi dấu mọi số hạng trong ngoặc.'],[`${a} + (${x} + ${y} + ${z})`,'Tiền đã tiêu làm số tiền giảm đi, phải trừ.']],`Số tiền còn lại bằng số tiền mang theo trừ đi tổng số tiền đã mua: ${a} − (${x} + ${y} + ${z}).`,'bn','TH'),
   A('Mẹ còn lại bao nhiêu nghìn đồng?',r,'nghìn đồng',`${a} − (${x} + ${y} + ${z}) = ${a} − ${x+y+z} = ${r}.`,'bn','TH'),
   A('Về nhà, mẹ thấy bó rau bị héo nên mang ra chợ đổi trả và được trả lại đủ tiền rau. Lúc này mẹ có bao nhiêu nghìn đồng?',bk,'nghìn đồng',`${a} − (${x} + ${y} + ${z}) + ${x} = ${a} − ${x} − ${y} − ${z} + ${x} = ${a} − ${y} − ${z} = ${bk}.`,'hl','VD'),
   A(`Hôm sau mẹ mang ${b} nghìn đồng đi chợ và mua đúng các món như hôm trước, giá không đổi (không đổi trả gì). Số tiền mẹ còn lại hôm sau nhiều hơn hôm trước bao nhiêu nghìn đồng?`,b-a,'nghìn đồng',`[${b} − (${x} + ${y} + ${z})] − [${a} − (${x} + ${y} + ${z})] = ${b} − ${a} = ${b-a}. Không cần tính số tiền còn lại của từng ngày.`,'hl','VD')]};}),
 G(()=>{const t=-ri(5,20),a=ri(2,9),b=ri(2,9),c=ri(2,9);if(a===b||b===c||a===c)throw 0;
  const t14=t-a+b-c,d=ri(-6,6);if(!d)throw 0;const s=t14+d;
  const br=x=>x<0?`(${nm(x)})`:nm(x);
  return {title:'Tủ bảo quản lạnh',ctx:P(`Lúc 8 giờ, nhiệt độ trong một tủ bảo quản là ${nm(t)}°C. Từ 8 giờ đến 10 giờ nhiệt độ giảm ${a}°C, từ 10 giờ đến 12 giờ nhiệt độ tăng ${b}°C, từ 12 giờ đến 14 giờ nhiệt độ giảm ${c}°C.`),qs:[
   M('Biểu thức nào cho biết nhiệt độ trong tủ lúc 14 giờ?',`${nm(t)} − (${a} − ${b} + ${c})`,[[`${nm(t)} − (${a} + ${b} + ${c})`,`Nhiệt độ có lúc tăng ${b}°C, nên trong ngoặc không thể cộng ${b}.`],[`${nm(t)} − (${a} − ${b} − ${c})`,`Bỏ ngoặc: ${nm(t)} − (${a} − ${b} − ${c}) = ${nm(t)} − ${a} + ${b} + ${c}, tức là nhiệt độ lại tăng ${c}°C.`],[`${nm(t)} + (${a} − ${b} + ${c})`,`Bỏ ngoặc ra được ${nm(t)} + ${a} − ${b} + ${c}: nhiệt độ tăng ${a}°C và tăng ${c}°C, ngược với đề bài.`]],`Nhiệt độ lúc 14 giờ là ${nm(t)} − ${a} + ${b} − ${c} = ${nm(t)} − (${a} − ${b} + ${c}).`,'dn','TH'),
   A('Nhiệt độ trong tủ lúc 14 giờ là bao nhiêu độ C?',t14,'°C',`${nm(t)} − (${a} − ${b} + ${c}) = ${nm(t)} − ${br(a-b+c)} = ${nm(t14)}.`,'bn','TH'),
   A('Nhiệt độ lúc 14 giờ thay đổi bao nhiêu độ C so với lúc 8 giờ? (Nhập số âm nếu nhiệt độ giảm.)',t14-t,'°C',`${nm(t14)} − ${br(t)} = ${nm(t14-t)}. Có thể tính nhanh: −${a} + ${b} − ${c} = ${nm(t14-t)}.`,'hl','VD'),
   A(`Lúc 16 giờ nhiệt độ trong tủ là ${nm(s)}°C. Từ 14 giờ đến 16 giờ nhiệt độ đã thay đổi bao nhiêu độ C? (Nhập số âm nếu nhiệt độ giảm.)`,d,'°C',`${nm(s)} − ${br(t14)} = ${nm(d)}.`,'hl','VD')]};})
);
