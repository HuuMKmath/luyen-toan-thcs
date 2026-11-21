// Kiểm tra gói Toán thực tế Bài tập cuối chương II (Toán 6): đọc lại số liệu, tính lại bằng cách duyệt.
const cd=(...a)=>{const o=[];for(let d=1;d<=Math.min(...a);d++)if(a.every(x=>x%d===0))o.push(d);return o;};
const G=(...a)=>Math.max(...cd(...a));
const num=s=>+String(s).replace(/\D/g,'');
const only=f=>(R,O)=>f(R)&&O.slice(1).every(o=>!f(o));
const prime=n=>{if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
const pdiv=n=>{const o=[];for(let d=2;d<=n;d++)if(n%d===0&&prime(d))o.push(d);return o;};
const ndiv=n=>{let c=0;for(let d=1;d<=n;d++)if(n%d===0)c++;return c;};
const mon=(M,k)=>{let m=M;for(let i=0;i<k;i++)m=m===12?1:m+1;return m;};
const DAYS=['thứ Hai','thứ Ba','thứ Tư','thứ Năm','thứ Sáu','thứ Bảy','Chủ nhật'];
const firstCommon=P=>{let t=1;while(P.some(p=>t%p))t++;return t;};
module.exports={
 'Bảo dưỡng xe ô tô':(u,U)=>{const M=+U.txt(u.ctx).match(/Tháng (\d+) năm nay/)[1],P=U.rows(u.ctx).map(r=>+U.txt(r[1]).match(/^(\d+)/)[1]);const T=+U.txt(u.qs[3].stem).match(/Trong (\d+) tháng/)[1];
   return [firstCommon(P.slice(0,2)),firstCommon(P),only(o=>+((o.match(/Tháng (\d+)/)||[])[1])===mon(M,firstCommon(P))),Math.floor(T/P[0])];},
 'Bài toán cổ: đàn vịt':(u,U)=>{const N=+U.txt(u.ctx).match(/chưa đến (\d+) con/)[1];const C=U.rows(u.ctx).map(r=>{const m=+U.txt(r[0]).replace(/\D/g,''),t=U.txt(r[1]);let k;
     if(t==='vừa đủ')return v=>v%m===0;if(t==='chưa vừa')return v=>v%m!==0;if(k=t.match(/^thừa (\d+) con$/))return v=>v%m===+k[1];if(k=t.match(/^thiếu (\d+) con$/))return v=>(v+ +k[1])%m===0;return ()=>false;});
   const S=[];for(let v=1;v<N;v++)if(C.every(c=>c(v)))S.push(v);const x=S.length===1?S[0]:NaN;const m1=+U.txt(u.qs[0].stem).match(/chia cho (\d+) dư/)[1],k=+U.txt(u.qs[2].stem).match(/hàng (\d+) thì/)[1];
   return [only(o=>num(o)===x%m1),x,only(o=>o===(x%k?`Thừa ${x%k} con`:'Vừa đủ')),only(o=>num(o)===ndiv(x))];},
 'Hội khoẻ Phù Đổng':(u,U)=>{const m=U.txt(u.ctx).match(/chọn (\d+) học sinh nam và (\d+) học sinh nữ/),a=+m[1],b=+m[2],g=G(a,b),P=pdiv(g);
   return [g,cd(a,b).length-1,P.length,only(o=>num(o)===(a+b)/P[P.length-1])];},
 'Đội tình nguyện':(u,U)=>{const v=U.rows(u.ctx)[0].slice(1).map(x=>num(U.txt(x))),g=G(...v);const m=U.txt(u.ctx).match(/Nhóm A cứ (\d+) ngày đi phát quà một lần, nhóm B cứ (\d+) ngày một lần\. Hôm nay \((.+?)\)/);const t=firstCommon([+m[1],+m[2]]),s0=DAYS.indexOf(m[3]);
   return [g,only(o=>num(o)===v[1]/g),t,only(o=>o===DAYS[(s0+t)%7])];}
};
