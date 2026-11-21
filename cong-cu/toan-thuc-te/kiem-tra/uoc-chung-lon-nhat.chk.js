// Kiểm tra gói Toán thực tế bài Ước chung. Ước chung lớn nhất (Toán 6, Bài 11): đọc lại số liệu, tìm ước chung bằng cách duyệt.
const dv=n=>{const o=[];for(let d=1;d<=n;d++)if(n%d===0)o.push(d);return o;};
const cd=(...a)=>dv(Math.min(...a)).filter(d=>a.every(x=>x%d===0));
const G=(...a)=>Math.max(...cd(...a));
const num=s=>+String(s).replace(/\D/g,'');
const only=f=>(R,O)=>f(R)&&O.slice(1).every(o=>!f(o));
module.exports={
 'Tiền vé tham quan':(u,U)=>{const A=U.rows(u.ctx).map(r=>num(U.txt(r[1]))),P=cd(...A).filter(d=>d>2),S=A.reduce((a,b)=>a+b,0),ok=P.filter(d=>S/d>=20&&S/d<=40);
   return [G(...A),only(o=>o.split(';').map(num).join()===P.join()),ok.length===1?ok[0]:NaN];},
 'Cắt thanh gỗ':(u,U)=>{const A=U.txt(u.ctx).match(/dài ([\d; ]+) \(dm\)/)[1].split(';').map(num),g=G(...A),d=+U.txt(u.qs[2].stem).match(/dài (\d+) dm/)[1];
   return [g,A.reduce((s,x)=>s+x/g,0),only(o=>o.startsWith('Được')&&A.every(x=>x%d===0))];},
 'Lát gạch phòng học':(u,U)=>{const R=U.rows(u.ctx),a=num(U.txt(R[0][1])),b=num(U.txt(R[1][1])),g=G(a,b),d=+U.txt(u.qs[3].stem).match(/cạnh (\d+) dm/)[1];
   return [(R0)=>R0.startsWith('Một ước chung'),g,(a/g)*(b/g),a%d===0&&b%d===0?(a/d)*(b/d):NaN];},
 'Túi quà Trung thu':(u,U)=>{const A=U.rows(u.ctx).map(r=>num(U.txt(r[1]))),g=G(...A),d=+U.txt(u.qs[2].stem).match(/thành (\d+) túi/)[1];
   return [g,A[1]/g,only(o=>o.startsWith('Không, vì')&&o.includes('không là ước chung')&&!A.every(x=>x%d===0))];}
};
