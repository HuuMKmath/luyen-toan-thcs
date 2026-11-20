PISA.push(
 G(()=>{const names=['An','Bình','Chi','Dũng','Hà'],fl=pk([-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9],5);
  const neg=fl.filter(x=>x<0);if(neg.length<2||neg.length>3||!fl.some(x=>x>0))throw 0;
  const p=names.map((n,i)=>({n,f:fl[i]})),asc=p.slice().sort((a,b)=>a.f-b.f),lo=asc[0],hi=asc[4],k=ri(2,5);
  const between=hi.f-lo.f-1;
  return {title:'Các tầng của toà nhà',ctx:P('Trong một toà nhà, tầng trệt được ghi là tầng 0, các tầng phía trên ghi là 1; 2; 3; ..., các tầng hầm ghi là −1; −2; −3; ... (tầng −1 ở ngay dưới tầng trệt). Bảng sau cho biết năm bạn đang ở tầng nào.')+T(['Bạn','Tầng'],p.map(x=>[x.n,nm(x.f)])),qs:[
   A(`Bác bảo vệ đang ở tầng hầm thứ ${k} tính từ tầng trệt xuống. Tầng đó được ghi là số nào?`,-k,'',`Các tầng hầm từ trên xuống là −1; −2; −3; ... Tầng hầm thứ ${k} được ghi là ${nm(-k)}.`,'tt','TH'),
   M('Bạn nào đang ở tầng thấp nhất?',lo.n,asc.slice(1,4).map(x=>[x.n,`Bạn ${x.n} ở tầng ${nm(x.f)}, mà ${nm(x.f)} > ${nm(lo.f)}.`]),`Số nhỏ nhất trong bảng là ${nm(lo.f)} nên bạn ${lo.n} ở tầng thấp nhất.`,'ss','TH'),
   A('Có bao nhiêu bạn đang ở dưới tầng trệt?',neg.length,'bạn',`Ở dưới tầng trệt là các tầng ghi số nguyên âm: ${neg.slice().sort((a,b)=>a-b).map(nm).join('; ')}. Có ${neg.length} bạn.`,'na','TH'),
   A(`Thang máy chở bạn ${lo.n} đi thẳng từ tầng của bạn ${lo.n} lên tầng của bạn ${hi.n}. Không kể hai tầng đó, thang máy đi qua bao nhiêu tầng?`,between,'tầng',`Các số nguyên lớn hơn ${nm(lo.f)} và nhỏ hơn ${nm(hi.f)} là ${Array.from({length:between},(_,i)=>nm(lo.f+1+i)).join('; ')||'(không có)'}. Có ${between} tầng (nhớ kể cả tầng 0).`,'ss','VD')]};}),
 G(()=>{const st=['A','B','C','D','E'],v=[];
  while(v.length<5){const x=ri(-15,20);if(x&&!v.some(y=>Math.abs(y)===Math.abs(x)))v.push(x);}
  const neg=v.filter(x=>x<0);if(neg.length<2||neg.length>3)throw 0;
  const p=st.map((L,i)=>({L,n:'Cửa hàng '+L,v:v[i]})),asc=p.slice().sort((a,b)=>a.v-b.v),desc=asc.slice().reverse(),lo=asc[0];
  const k=ri(3,20);if(v.includes(-k))throw 0;
  const m=ri(2,14);if(v.includes(-m))throw 0;const big=v.filter(x=>x>-m).length;if(big===5||big===5-neg.length)throw 0;
  const s=a=>a.map(x=>x.L).join(', ');
  const right=s(desc),wAsc=s(asc),wAbs=s(p.slice().sort((a,b)=>Math.abs(b.v)-Math.abs(a.v))),wSw=s(desc.slice(0,3).concat([desc[4],desc[3]]));
  return {title:'Kết quả kinh doanh của các cửa hàng',ctx:P('Bảng sau ghi kết quả kinh doanh trong một tháng của năm cửa hàng. Số dương chỉ tiền lãi, số âm chỉ tiền lỗ (đơn vị: triệu đồng).')+T(['Cửa hàng','Kết quả (triệu đồng)'],p.map(x=>[x.L,nm(x.v)])),qs:[
   A(`Trong tháng đó, cửa hàng F bị lỗ ${k} triệu đồng. Kết quả kinh doanh của cửa hàng F được ghi là số nào?`,-k,'triệu đồng',`Tiền lỗ được ghi bằng số âm: lỗ ${k} triệu đồng ghi là ${nm(-k)}.`,'tt','TH'),
   M('Cửa hàng nào bị lỗ nhiều nhất?',lo.n,[[desc[0].n,`${desc[0].n} có kết quả ${nm(desc[0].v)}: đây là cửa hàng lãi nhiều nhất.`]].concat(asc.slice(1,4).filter(x=>x!==desc[0]).slice(0,2).map(x=>[x.n,`${x.n} có kết quả ${nm(x.v)} > ${nm(lo.v)}, nên lỗ ít hơn ${lo.n}${x.v>0?' (thực ra cửa hàng này có lãi)':''}.`])),`Lỗ nhiều nhất là cửa hàng có kết quả nhỏ nhất: ${nm(lo.v)} (triệu đồng), đó là ${lo.n}.`,'ss','TH'),
   A(`Có bao nhiêu cửa hàng có kết quả kinh doanh lớn hơn ${nm(-m)} triệu đồng?`,big,'cửa hàng',`Các kết quả lớn hơn ${nm(-m)} là ${v.filter(x=>x>-m).sort((a,b)=>a-b).map(nm).join('; ')}. Có ${big} cửa hàng (nhớ rằng mọi số dương đều lớn hơn số âm).`,'ss','VD'),
   M('Dãy nào sắp xếp các cửa hàng theo kết quả kinh doanh từ tốt nhất đến kém nhất?',right,[[wAsc,'Đây là thứ tự từ kém nhất đến tốt nhất.'],[wAbs,'Dãy này xếp theo phần số mà bỏ qua dấu "−". Lỗ càng nhiều thì kết quả càng kém.'],[wSw,`Hai cửa hàng cuối bị đổi chỗ: ${nm(asc[0].v)} < ${nm(asc[1].v)} nên ${asc[0].n} kém hơn ${asc[1].n}.`]],`Sắp xếp kết quả giảm dần: ${desc.map(x=>nm(x.v)).join(' > ')}.`,'ss','VD')]};})
);
