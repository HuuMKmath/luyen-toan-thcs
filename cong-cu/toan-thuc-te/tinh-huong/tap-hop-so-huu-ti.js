PISA.push(
 G(()=>{const names=['Hải','Long','Minh','Phúc','Quân'],v=[];
  while(v.length<5){const x=ri(1,30)*5/100*(RNG()<.5?-1:1);if(!v.some(y=>Math.abs(Math.abs(y)-Math.abs(x))<1e-9))v.push(rd(x,2));}
  const neg=v.filter(x=>x<0);if(neg.length<2||neg.length>3)throw 0;
  const p=names.map((n,i)=>({n,v:v[i]})),asc=p.slice().sort((a,b)=>a.v-b.v),d=rd(ri(1,20)/10,1);if(v.some(x=>Math.abs(Math.abs(x)-d)<1e-9))throw 0;
  const s=a=>a.map(x=>x.n).join(', ');
  return {title:'Thành tích chạy so với kỉ lục',ctx:P('Huấn luyện viên ghi thời gian chạy 100 m của năm vận động viên so với kỉ lục của câu lạc bộ: số dương nghĩa là chậm hơn kỉ lục, số âm nghĩa là nhanh hơn kỉ lục (đơn vị: giây).')+T(['Vận động viên','So với kỉ lục (giây)'],p.map(x=>[x.n,nm(x.v)])),qs:[
   A(`Vận động viên thứ sáu chạy nhanh hơn kỉ lục ${nm(d)} giây. Số ghi cho vận động viên này là bao nhiêu?`,-d,'giây',`Nhanh hơn kỉ lục được ghi bằng số âm, nên ghi là ${nm(-d)}. Đây là số đối của ${nm(d)}.`,'sd','TH'),
   M('Vận động viên nào chạy nhanh nhất?',asc[0].n,asc.slice(1,4).map(x=>[x.n,`${x.n} ghi ${nm(x.v)}, mà ${nm(x.v)} > ${nm(asc[0].v)}, nên chạy chậm hơn ${asc[0].n}.`]),`Chạy nhanh nhất là người có số ghi nhỏ nhất: ${nm(asc[0].v)}, đó là ${asc[0].n}.`,'ss','TH'),
   A('Có bao nhiêu vận động viên chạy nhanh hơn kỉ lục?',neg.length,'người',`Nhanh hơn kỉ lục là các số âm: ${neg.slice().sort((a,b)=>a-b).map(nm).join('; ')}. Có ${neg.length} người.`,'kn','TH'),
   M('Dãy nào sắp xếp các vận động viên từ nhanh nhất đến chậm nhất?',s(asc),[[s(asc.slice().reverse()),'Đây là thứ tự từ chậm nhất đến nhanh nhất.'],[s(p.slice().sort((a,b)=>Math.abs(a.v)-Math.abs(b.v))),'Dãy này so sánh phần số mà bỏ qua dấu "−". Số âm có phần số càng lớn thì càng nhỏ, tức là chạy càng nhanh.'],[s([asc[1],asc[0]].concat(asc.slice(2))),`Hai người đầu bị đổi chỗ: ${nm(asc[0].v)} < ${nm(asc[1].v)}.`]],`Sắp xếp tăng dần: ${asc.map(x=>nm(x.v)).join(' < ')}.`,'ss','VD')]};}),
 G(()=>{const days=['Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu'],dens=[2,4,5,10],q=[];
  while(q.length<5){const d=sel(dens),n=ri(-14,14)*(d===10?1:1);if(!n||n%d===0&&d!==10)continue;const g=gc(n,d),r=[n/g,d/g];if(r[1]===1)continue;if(q.some(x=>x[0]*r[1]===r[0]*x[1]))continue;if(Math.abs(r[0]/r[1])>3)continue;q.push(r);}
  const val=x=>x[0]/x[1];const neg=q.filter(x=>x[0]<0);if(neg.length<2||neg.length>3)throw 0;
  const show=q.map(x=>(RNG()<.5&&100%x[1]===0)?nm(val(x)):Fh(x[0],x[1]));if(!show.some(s=>s.includes('fr'))||show.every(s=>s.includes('fr')))throw 0;
  const p=days.map((n,i)=>({n,d:'ngày '+n.replace('Thứ','thứ'),q:q[i],s:show[i],v:val(q[i])})),asc=p.slice().sort((a,b)=>a.v-b.v),hi=asc[4];
  const i=ri(0,3),X=asc[i],Y=asc[i+1];if(Y.v-X.v<0.15)throw 0;
  const mid=rd((X.v+Y.v)/2,2);if(!(mid>X.v&&mid<Y.v)||Math.abs(mid*100-Math.round(mid*100))>1e-9)throw 0;
  const lo=rd(X.v-ri(2,8)/10,2),up=rd(Y.v+ri(2,8)/10,2),opp=rd(-mid,2);
  const outs=[[nm(lo),`${nm(lo)} < ${X.s}, nên mực nước này còn thấp hơn ${X.d}.`],[nm(up),`${nm(up)} > ${Y.s}, nên mực nước này còn cao hơn ${Y.d}.`]];
  if(!(opp>X.v&&opp<Y.v)&&Math.abs(opp-lo)>1e-9&&Math.abs(opp-up)>1e-9)outs.push([nm(opp),`${nm(opp)} không nằm giữa ${X.s} và ${Y.s}.`]);else outs.push([nm(rd(lo-0.5,2)),`Số này nhỏ hơn ${X.s}.`]);
  const Z=sel(p.filter(x=>Math.abs(x.v)>1&&!Number.isInteger(x.v)));if(!Z)throw 0;const fl=Math.floor(Z.v);
  return {title:'Mực nước sông so với mức báo động',ctx:P('Bảng sau ghi mực nước của một con sông so với mức báo động I trong năm ngày (đơn vị: m). Số âm nghĩa là mực nước thấp hơn mức báo động, số dương nghĩa là cao hơn mức báo động.')+T(['Ngày','So với mức báo động (m)'],p.map(x=>[x.n,x.s])),qs:[
   M('Ngày nào mực nước sông cao nhất?',hi.n,asc.slice(0,3).map(x=>[x.n,`${x.d[0].toUpperCase()+x.d.slice(1)} ghi ${x.s}, nhỏ hơn ${hi.s}.`]),`Đưa về cùng một dạng rồi so sánh: số lớn nhất là ${hi.s}, vào ${hi.d}.`,'ss','TH'),
   A('Có bao nhiêu ngày mực nước sông thấp hơn mức báo động?',neg.length,'ngày',`Thấp hơn mức báo động là các số hữu tỉ âm: ${p.filter(x=>x.v<0).map(x=>x.s).join('; ')}. Có ${neg.length} ngày.`,'kn','TH'),
   M(`Ngày thứ Bảy, mực nước cao hơn ${X.d} nhưng thấp hơn ${Y.d}. Số nào dưới đây có thể là mực nước ngày thứ Bảy (m)?`,nm(mid),outs,`Cần số x thỏa mãn ${X.s} < x < ${Y.s}, tức là ${nm(X.v)} < x < ${nm(Y.v)}. Chỉ có ${nm(mid)} thỏa mãn.`,'ss','VD'),
   A(`Trên trục số, điểm biểu diễn mực nước ${Z.d} nằm giữa hai số nguyên liên tiếp nào? Nhập số nguyên nhỏ hơn.`,fl,'',`${Z.s} = ${nm(Z.v)}, nằm giữa ${nm(fl)} và ${nm(fl+1)}. Số nguyên nhỏ hơn là ${nm(fl)}.`,'ts','VD')]};})
);
