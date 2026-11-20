PISA.push(
 G(()=>{const a=5*ri(4,12),b=5*ri(2,8),x=ri(8,30),y=ri(6,25),q=y*(-b),tot=x*a+q,y2=ri(10,30),need=Math.ceil(y2*b/a);
  if(a===b||y2*b%a===0)throw 0;
  const E=(p,r,s,t)=>`${p} · ${r} + ${s} · ${t}`;
  return {title:'Cửa hàng bán quần áo cuối mùa',ctx:P(`Một cửa hàng bán áo và quần. Mỗi chiếc áo bán ra cửa hàng lãi ${a} nghìn đồng. Quần được bán hạ giá nên mỗi chiếc quần bán ra cửa hàng lỗ ${b} nghìn đồng. Người ta ghi tiền lãi bằng số dương, tiền lỗ bằng số âm. Trong ngày, cửa hàng bán được ${x} chiếc áo và ${y} chiếc quần.`),qs:[
   A('Kết quả kinh doanh từ số quần bán được trong ngày là bao nhiêu nghìn đồng? (Nhập số âm nếu bị lỗ.)',q,'nghìn đồng',`Mỗi chiếc quần lỗ ${b} nghìn đồng, ghi là ${nm(-b)}. ${y} · (${nm(-b)}) = ${nm(q)}.`,'qt','TH'),
   M('Biểu thức nào cho biết kết quả kinh doanh của cửa hàng trong ngày (nghìn đồng)?',E(x,a,y,`(${nm(-b)})`),[[E(x,a,y,b),'Tiền lỗ phải ghi bằng số âm.'],[`(${x} + ${y}) · (${a} − ${b})`,'Số áo và số quần khác nhau nên không gộp chung như vậy được.'],[E(x,`(${nm(-b)})`,y,a),'Lãi đi với số áo, lỗ đi với số quần; biểu thức này đã đổi chỗ.']],`Kết quả = ${x} · ${a} + ${y} · (${nm(-b)}).`,'bt','TH'),
   A('Kết quả kinh doanh của cửa hàng trong ngày là bao nhiêu nghìn đồng? (Nhập số âm nếu bị lỗ.)',tot,'nghìn đồng',`${x} · ${a} + ${y} · (${nm(-b)}) = ${x*a} + (${nm(q)}) = ${nm(tot)}.`,'bt','VD'),
   A(`Hôm sau cửa hàng bán được ${y2} chiếc quần như vậy. Cửa hàng phải bán được ít nhất bao nhiêu chiếc áo để hôm đó không bị lỗ?`,need,'chiếc áo',`Tiền lỗ từ quần: ${y2} · (${nm(-b)}) = ${nm(-y2*b)}. Bán ${need-1} áo được ${(need-1)*a} < ${y2*b} nên vẫn lỗ; bán ${need} áo được ${need*a} ≥ ${y2*b}. Vậy cần ít nhất ${need} chiếc áo.`,'vd','VD')]};})
);
