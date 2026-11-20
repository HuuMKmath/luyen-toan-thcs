PISA.push(
 G(()=>{const q=sel([3,6,9,11]),p=ri(q+1,4*q);if(fin(p,q)||gc(p,q)!==1)throw 0;const o=dexp(p,q),R=dstr(o);if(o.per.length>2)throw 0;
  if(dexp(q,p).per.length>6)throw 0;const k=sel([2,3,5,6,7,8,10,11]),d=rd(ri(100,400)/100,2);const L=[{n:'A',t:Fh(p,q),v:p/q},{n:'B',t:'√'+k,v:Math.sqrt(k)},{n:'C',t:nm(d),v:d}];
  const vs=L.map(x=>x.v).sort((a,b)=>a-b);if(vs[1]-vs[0]<0.05||vs[2]-vs[1]<0.05)throw 0;
  const asc=L.slice().sort((a,b)=>a.v-b.v),s=a=>a.map(x=>'dây '+x.n).join(', '),sum=L[0].v+L[1].v+L[2].v;if(near5(sum,1))throw 0;
  const perms=[[0,2,1],[1,0,2],[2,1,0],[1,2,0],[2,0,1]].map(ix=>s(ix.map(i=>asc[i])));
  return {title:'Ba sợi dây',ctx:P(`Bạn Nam có ba sợi dây: dây A dài ${Fh(p,q)} m, dây B dài √${k} m và dây C dài ${nm(d)} m.`),qs:[
   M('Độ dài của dây nào là số vô tỉ?','Dây B',[['Dây A',`${Fh(p,q)} là số hữu tỉ, viết được dưới dạng số thập phân vô hạn tuần hoàn ${R}.`],['Dây C',`${nm(d)} là số thập phân hữu hạn, là số hữu tỉ.`],['Cả ba dây','Chỉ có √'+k+' là số vô tỉ vì '+k+' không phải là số chính phương.']],`${k} không phải là bình phương của số tự nhiên nào nên √${k} là số vô tỉ; hai độ dài kia là số hữu tỉ.`,'vt','TH'),
   M('Độ dài dây A viết dưới dạng số thập phân là',R,[[dstr({I:o.I,pre:(o.pre+o.per+o.per).slice(0,2),per:''}),'Đây là số thập phân hữu hạn; thực ra phép chia không bao giờ kết thúc.'],[dstr(dexp(q,p)),`Đây là kết quả của ${q} : ${p}, bị đảo tử và mẫu.`],[o.pre?dstr({I:o.I,pre:'',per:o.pre+o.per}):dstr({I:o.I,pre:o.per,per:String((+o.per[0]+1)%10)}),'Sai chu kì của số thập phân vô hạn tuần hoàn.']],`${p} : ${q} = ${R}.`,'tp','TH'),
   M('Sắp xếp ba sợi dây theo thứ tự từ ngắn đến dài.',s(asc),pk(perms,3).map(x=>[x,`So sánh lại: ${Fh(p,q)} = ${R}; √${k} ≈ ${nm(rd(Math.sqrt(k),3))}; ${nm(d)}.`]),`${Fh(p,q)} = ${R}; √${k} ≈ ${nm(rd(Math.sqrt(k),3))}; ${nm(d)}. Thứ tự tăng dần: ${asc.map(x=>x.t).join(' < ')}.`,'ss','VD'),
   A('Tổng độ dài ba sợi dây, làm tròn đến hàng phần mười, là bao nhiêu mét?',rd(sum,1),'m',`${R} + √${k} + ${nm(d)} ≈ ${nm(rd(p/q,4))} + ${nm(rd(Math.sqrt(k),4))} + ${nm(d)} ≈ ${nm(rd(sum,3))}... ≈ ${nm(rd(sum,1))} (m).`,'sr','VD')]};}),
 G(()=>{const names=['Bình','Cường','Dung','Giang'],base=ri(12,15);
  const a3=3*base+ri(1,2),oA=dexp(a3,3);   // dạng phân số mẫu 3
  const dg=ri(1,8),oB={I:base,pre:'',per:String(dg)};const vB=base+dg/9;
  const vC=rd(base+ri(10,95)/100,2);const pc=ri(1,9),pd=ri(0,9);if(pc===pd)throw 0;const oD={I:base,pre:String(pc),per:String(pd)},vD=base+pc/10+pd/90;
  const it=[{n:names[0],t:Fh(a3,3),v:a3/3,R:dstr(oA)},{n:names[1],t:dstr(oB),v:vB},{n:names[2],t:nm(vC),v:vC},{n:names[3],t:dstr(oD),v:vD}];
  const vv=it.map(x=>x.v).sort((x,y)=>x-y);for(let i=1;i<4;i++)if(vv[i]-vv[i-1]<0.008)throw 0;
  const fast=it.reduce((a,b)=>b.v<a.v?b:a),Y=sel([it[1],it[3]]);if(near5(Y.v,1))throw 0;
  const Tm=rd(base+ri(1,9)/10,1);if(it.some(x=>Math.abs(x.v-Tm)<0.008))throw 0;const under=it.filter(x=>x.v<Tm).length;if(!under||under===4)throw 0;
  return {title:'Thành tích chạy 100 m',ctx:P('Bảng sau ghi thời gian chạy 100 m của bốn bạn (đơn vị: giây).')+T(['Bạn','Thời gian (giây)'],it.map(x=>[x.n,x.t])),qs:[
   M(`Thời gian của bạn ${names[0]} viết dưới dạng số thập phân là`,dstr(oA),[[`${oA.I},${oA.per}`,'Đây là số thập phân hữu hạn; phép chia cho 3 này không bao giờ kết thúc.'],[`${oA.I+1},(${oA.per})`,`${a3} : 3 được ${oA.I} dư ${a3%3}, nên phần nguyên là ${oA.I}.`],[`${oA.I},(${(+oA.per+3)%10})`,`Chữ số lặp lại phải là ${oA.per}.`]],`${a3} : 3 = ${dstr(oA)}.`,'tp','TH'),
   A(`Làm tròn thời gian của bạn ${Y.n} đến hàng phần mười.`,rd(Y.v,1),'giây',`${Y.t} = ${Y.v.toFixed(4).replace('.',',')}... Chữ số hàng phần trăm là ${Math.floor(Y.v*100)%10} nên được ${nm(rd(Y.v,1))}.`,'tp','TH'),
   M('Bạn nào chạy nhanh nhất?',fast.n,it.filter(x=>x!==fast).map(x=>[x.n,`${x.t} = ${x.v.toFixed(3).replace('.',',')}... lớn hơn ${fast.t}, nên bạn ${x.n} chạy chậm hơn.`]),`Chạy nhanh nhất là bạn có thời gian ngắn nhất. Viết các số dưới dạng số thập phân rồi so sánh từng chữ số: nhỏ nhất là ${fast.t}${fast.R?` = ${fast.R}`:''}, của bạn ${fast.n}.`,'ss','VD'),
   A(`Có bao nhiêu bạn chạy 100 m hết ít hơn ${nm(Tm)} giây?`,under,'bạn',`Các thời gian nhỏ hơn ${nm(Tm)}: ${it.filter(x=>x.v<Tm).map(x=>x.t).join('; ')}. Có ${under} bạn.`,'ss','VD')]};})
);
