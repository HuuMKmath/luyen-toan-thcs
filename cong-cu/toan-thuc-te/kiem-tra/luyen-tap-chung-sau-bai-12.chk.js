// Kiểm tra gói Toán thực tế bài Luyện tập chung (sau Bài 12), Toán 6: đọc lại số liệu, tìm ƯCLN, BCNN bằng cách duyệt.
const cd=(...a)=>{const o=[];for(let d=1;d<=Math.min(...a);d++)if(a.every(x=>x%d===0))o.push(d);return o;};
const G=(...a)=>Math.max(...cd(...a));
const Lc=(...a)=>{const M=Math.max(...a);for(let m=M;;m+=M)if(a.every(x=>m%x===0))return m;};
const num=s=>+String(s).replace(/\D/g,'');
const only=f=>(R,O)=>f(R)&&O.slice(1).every(o=>!f(o));
const CAN=['Giáp','Ất','Bính','Đinh','Mậu','Kỉ','Canh','Tân','Nhâm','Quý'],CHI=['Tí','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const cc=y=>{let c=0,h=0;for(let x=4;x<y;x++){c=(c+1)%10;h=(h+1)%12;}return CAN[c]+' '+CHI[h];};
module.exports={
 'Chạy bộ quanh sân':(u,U)=>{const [p,q,r]=U.rows(u.ctx).map(x=>num(U.txt(x[1]))),T=+U.txt(u.qs[3].stem).match(/trong (\d+) phút/)[1];let c=0;for(let s=1;s<=T*60;s++)if(s%p===0&&s%q===0&&s%r===0)c++;
   return [Lc(p,q),Lc(p,q)/p,Lc(p,q,r)/60,only(o=>num(o)===c)];},
 'Mua đồ dùng cho lớp':(u,U)=>{const m=U.txt(u.ctx).match(/mỗi hộp (\d+) chiếc; .*mỗi lốc (\d+) quyển .* có sẵn (\d+) chiếc thước/),p=+m[1],q=+m[2],c=+m[3],l=Lc(p,q),g=G(l,c);
   return [l,l/p,only(o=>num(o)===g),c/g];},
 'Lịch can chi':(u,U)=>{const m=U.txt(u.ctx).match(/Năm (\d+) là năm ([^.]+)\./),Y=+m[1],n=m[2];let p=1;while(cc(Y+p)!==cc(Y))p++;const y2=+U.txt(u.qs[1].stem).match(/Năm (\d+)/)[1],y3=+U.txt(u.qs[2].stem).match(/Năm (\d+)/)[1];let c=0;for(let y=2001;y<=2100;y++)if(cc(y)===n)c++;
   return [cc(Y)===n?p:NaN,only(o=>o===cc(y2)),only(o=>o===cc(y3)),c];},
 'Ngày hội đọc sách':(u,U)=>{const m=U.txt(u.ctx).match(/từ (\d+) đến (\d+) cuốn truyện\. Khi xếp thành các chồng (\d+) cuốn, (\d+) cuốn hay (\d+) cuốn thì đều thừa (\d+) cuốn/),H=[+m[3],+m[4],+m[5]],r=+m[6];const S=[];for(let x=+m[1];x<=+m[2];x++)if(H.every(h=>x%h===r))S.push(x);const N=S.length===1?S[0]:NaN;const d=+U.txt(u.qs[2].stem).match(/chồng (\d+) cuốn/)[1],k=+U.txt(u.qs[3].stem).match(/và (\d+) cuốn sách khoa học/)[1];
   return [Lc(...H),N,N%d,only(o=>num(o)===G(N-r,k))];}
};
