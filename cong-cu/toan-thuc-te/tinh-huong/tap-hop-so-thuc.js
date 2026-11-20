PISA.push(
 G(()=>{const PL=['A','B','C','D','E'],rt=sel([2,3,5]),sq={t:(RNG()<.5?'−':'')+'√'+rt,ir:1};sq.v=(sq.t[0]==='−'?-1:1)*Math.sqrt(rt);
  const ds=[];while(ds.length<4){const x=rd(ri(1,30)/10*(RNG()<.5?-1:1),1);if(!ds.some(y=>Math.abs(Math.abs(y)-Math.abs(x))<0.15)&&Math.abs(Math.abs(x)-Math.abs(sq.v))>0.15&&Math.abs(Math.abs(x)-1.5)>1e-9)ds.push(x);}
  const it=shuffle(ds.map(x=>({t:nm(x),v:x})).concat([sq])).map((x,i)=>({...x,L:PL[i]}));
  const negs=it.filter(x=>x.v<0&&!x.ir),pos=it.filter(x=>x.v>0&&!x.ir);if(!negs.length||!pos.length)throw 0;
  const X=sel(negs),Y=sel(pos),ok=it.filter(x=>Math.abs(x.v)<=1.5).length;if(ok===0||ok===5)throw 0;
  const far=it.reduce((a,b)=>Math.abs(b.v)>Math.abs(a.v)?b:a);
  const wr=shuffle(it.filter(x=>x!==far)).slice(0,3).map(x=>[`Gói ${x.L}`,x.ir?`|${x.t}| = √${rt} ≈ ${nm(rd(Math.sqrt(rt),2))}, nhỏ hơn |${far.t}|.`:`|${x.t}| = ${nm(Math.abs(x.v))}, nhỏ hơn |${far.t}|${far.ir?` = √${rt} ≈ ${nm(rd(Math.sqrt(rt),2))}`:''}.`]);
  return {title:'Kiểm tra khối lượng gói bánh',ctx:P('Mỗi gói bánh có khối lượng chuẩn là 200 g. Bảng sau ghi độ lệch so với khối lượng chuẩn của năm gói bánh (đơn vị: g): số dương nghĩa là nặng hơn, số âm nghĩa là nhẹ hơn khối lượng chuẩn.')+T(['Gói','Độ lệch (g)'],it.map(x=>[x.L,x.t])),qs:[
   A(`Giá trị tuyệt đối của độ lệch của gói ${X.L} là bao nhiêu?`,Math.abs(X.v),'g',`|${X.t}| = ${nm(Math.abs(X.v))}.`,'gt','TH'),
   A(`Gói ${Y.L} nặng bao nhiêu gam?`,rd(200+Y.v,1),'g',`200 + ${Y.t} = ${nm(rd(200+Y.v,1))} (g).`,'sr','TH'),
   A('Gói bánh đạt chuẩn nếu giá trị tuyệt đối của độ lệch không quá 1,5 g. Có bao nhiêu gói đạt chuẩn?',ok,'gói',`Giá trị tuyệt đối các độ lệch: ${it.map(x=>x.ir?`√${rt} ≈ ${nm(rd(Math.sqrt(rt),2))}`:nm(Math.abs(x.v))).join('; ')}. Có ${ok} số không lớn hơn 1,5.`,'gt','VD'),
   M('Gói nào có khối lượng lệch xa khối lượng chuẩn nhất?',`Gói ${far.L}`,wr,`Gói lệch xa nhất là gói có giá trị tuyệt đối của độ lệch lớn nhất: |${far.t}|${far.ir?` = √${rt} ≈ ${nm(rd(Math.sqrt(rt),2))}`:` = ${nm(Math.abs(far.v))}`}.`,'ss','VD')]};}),
 G(()=>{const names=['Trường học','Chợ','Bưu điện','Công viên','Thư viện'],rt=sel([2,3,5,7]);
  const vals=[];while(vals.length<4){const x=rd(ri(2,40)/10*(RNG()<.5?-1:1),1);if(!vals.some(y=>Math.abs(Math.abs(y)-Math.abs(x))<0.15)&&Math.abs(Math.abs(x)-Math.sqrt(rt))>0.15&&Math.abs(Math.abs(x)-2)>1e-9)vals.push(x);}
  const sq={t:'−√'+rt,v:-Math.sqrt(rt),ir:1},it=shuffle(vals.map(x=>({t:nm(x),v:x})).concat([sq])).map((x,i)=>({...x,n:names[i]}));
  const mk=it.find(x=>x.n==='Chợ');if(mk.ir||mk.v>=0)throw 0;
  const asc=it.slice().sort((a,b)=>a.v-b.v),far=it.reduce((a,b)=>Math.abs(b.v)>Math.abs(a.v)?b:a),cl=it.filter(x=>Math.abs(x.v)<=2).length;if(!cl||cl===5)throw 0;
  const A2=x=>x.ir?`√${rt} ≈ ${nm(rd(Math.sqrt(rt),2))}`:nm(Math.abs(x.v));
  const s=a=>a.map(x=>x.n).join(', ');
  const abs=s(it.slice().sort((a,b)=>Math.abs(a.v)-Math.abs(b.v)));
  return {title:'Các địa điểm trên một con đường thẳng',ctx:P('Một con đường thẳng chạy theo hướng tây – đông được coi như một trục số: nhà bạn Nam ở gốc O, chiều dương hướng về phía đông, đơn vị là ki-lô-mét. Bảng sau ghi số biểu diễn vị trí của một số địa điểm trên con đường.')+T(['Địa điểm','Vị trí (km)'],it.map(x=>[x.n,x.t])),qs:[
   A('Chợ cách nhà Nam bao nhiêu ki-lô-mét?',Math.abs(mk.v),'km',`Khoảng cách từ gốc O đến điểm ${mk.t} là |${mk.t}| = ${nm(Math.abs(mk.v))} (km).`,'gt','TH'),
   M('Địa điểm nào xa nhà Nam nhất?',far.n,shuffle(it.filter(x=>x!==far)).slice(0,3).map(x=>[x.n,`${x.n} cách nhà Nam |${x.t}| = ${A2(x)} km, gần hơn ${far.n} (${A2(far)} km).`]),`Khoảng cách đến nhà Nam là giá trị tuyệt đối của vị trí. Lớn nhất là ${A2(far)} km, đó là ${far.n.toLowerCase()}.`,'gt','TH'),
   A('Có bao nhiêu địa điểm trong bảng cách nhà Nam không quá 2 km?',cl,'địa điểm',`Khoảng cách các địa điểm: ${it.map(x=>`${x.n} ${A2(x)} km`).join('; ')}. Có ${cl} địa điểm cách không quá 2 km.`,'gt','VD'),
   M('Đi dọc con đường từ phía tây sang phía đông, ta lần lượt gặp các địa điểm theo thứ tự nào?',s(asc),[[s(asc.slice().reverse()),'Đây là thứ tự từ đông sang tây.'],[abs,'Đây là thứ tự từ gần nhà Nam đến xa nhà Nam, không phải từ tây sang đông.'],[s([asc[1],asc[0]].concat(asc.slice(2))),`Hai địa điểm đầu bị đổi chỗ: ${asc[0].t} < ${asc[1].t}.`]],`Từ tây sang đông là theo thứ tự tăng dần của số thực: ${asc.map(x=>x.t).join(' < ')}${it.some(x=>x.ir)?` (với −√${rt} ≈ ${nm(rd(-Math.sqrt(rt),2))})`:''}.`,'ss','VD')]};})
);
