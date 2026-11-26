// Bài 18. Biểu đồ hình quạt tròn: tính lại đáp án từ số liệu trong tình huống (chữ trong đề và nhãn trên biểu đồ)
const pie=fig=>{const s=String(fig),n=[...s.matchAll(/<text class="lg"[^>]*>([^<]*)<\/text>/g)].map(x=>x[1].replace(/&amp;/g,'&')),p=[...s.matchAll(/<text class="pv"[^>]*>([^<]*)<\/text>/g)].map(x=>+x[1].replace('%','').replace(',','.'));
  if(Math.abs(p.reduce((a,b)=>a+b,0)-100)>1e-9)throw new Error('tổng tỉ lệ khác 100%');const o={};n.forEach((k,i)=>o[k]=p[i]);return o;};
const q2=s=>[...String(s).matchAll(/“([^”]+)”/g)].map(m=>m[1]);
module.exports={
 'Chi tiêu của gia đình':(u,U)=>{const P=pie(u.fig),c=U.txt(u.ctx),I=+c.match(/nhập (\d+) triệu/)[1],I2=+U.txt(u.qs[3].stem).match(/lên (\d+) triệu/)[1],mx=Object.keys(P).sort((a,b)=>P[b]-P[a])[0];
   return [mx,I*P['Học tập']/100,I*P['Tiết kiệm']/100*12,(I2-I)*P['Ăn uống']/100];},
 'Đồ uống ở căng tin':(u,U)=>{const P=pie(u.fig),M=U.num(U.txt(u.ctx).match(/Trường có ([\d .]+) học sinh/)[1]),a=q2(U.txt(u.qs[0].stem))[0],b=q2(U.txt(u.qs[1].stem))[0],d=q2(U.txt(u.qs[3].stem))[0];
   return [200*P[a]/100,M*P[b]/100,R=>/ngẫu nhiên ở tất cả các lớp/.test(R),300*P[d]/100];},
 'Phân loại rác thải':(u,U)=>{const P=pie(u.fig),W=+U.txt(u.ctx).match(/được (\d+) kg/)[1],g=+U.txt(u.qs[2].stem).match(/được (\d+) nghìn/)[1],h=P['Rác hữu cơ'];
   if(Object.values(P).some(v=>v>h))throw new Error('rác hữu cơ không lớn nhất');
   return [R=>h>=50?/từ một nửa/.test(R):/chưa đến một nửa/.test(R),W*P['Nhựa']/100,W*P['Giấy']/100*g,h/5];},
 'Kế hoạch ôn tập':(u,U)=>{const P=pie(u.fig),T=+U.txt(u.ctx).match(/trong (\d+) giờ/)[1],T2=+U.txt(u.qs[2].stem).match(/lên (\d+) giờ/)[1];
   return [T*P['Toán']/100,P['Toán']+P['Tiếng Anh'],(T2-T)*P['Ngữ văn']/100,(T*P['Toán']/100+2)/T*100];}
};
