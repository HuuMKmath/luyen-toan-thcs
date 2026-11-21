// Kiểm tra gói Toán thực tế bài Luyện tập chung sau Bài 10 (Toán 6): đọc lại số liệu trong đề và bảng, tính lại bằng phép chia thật.
const prime=n=>{if(n<2)return false;for(let d=2;d<n;d++)if(n%d===0)return false;return true;};
const dv=n=>{const o=[];for(let d=1;d<=n;d++)if(n%d===0)o.push(d);return o;};
const ds=s=>String(s).replace(/\D/g,'').split('').reduce((a,b)=>a+ +b,0);
const only=f=>(R,O)=>f(R)&&O.slice(1).every(o=>!f(o));
const pv=s=>s.split('·').map(t=>t.trim()).reduce((a,t)=>{const m=t.match(/^(\d+)(?:\^(\d+))?$/);return m?a*Math.pow(+m[1],+(m[2]||1)):NaN;},1);
const isPF=(s,n)=>{let prev=0;for(const t of s.split('·').map(x=>x.trim())){const m=t.match(/^(\d+)(?:\^(\d+))?$/);if(!m||!prime(+m[1])||+m[1]<=prev)return false;prev=+m[1];}return pv(s)===n;};
const num=s=>+String(s).replace(/\D/g,'');
module.exports={
 'Đóng thùng nước':(u,U)=>{const n=num(U.txt(u.ctx).match(/có ([\d ]+) chai/)[1]),V={};U.rows(u.ctx).forEach(r=>V[U.txt(r[0])]=+U.txt(r[1]));const good=Object.values(V).filter(b=>n%b===0);const L='Loại '+U.txt(u.qs[2].stem).match(/thùng loại (\w)/)[1];let x=n;while(x%V[L])x++;
   return [only(o=>n%V[o]===0),good.length===1?n/good[0]:NaN,x-n];},
 'Mã kiểm tra thẻ thư viện':(u,U)=>{const R=U.rows(u.ctx).map(r=>U.txt(r[1]));const D=[];for(let d=0;d<=9;d++){const s=R[3].replace('*',d);if(s[0]!=='0'&&ds(s)%9===0)D.push(d);}
   return [R.slice(0,3).filter(c=>ds(c)%9===0).length,D.length===1?D[0]:NaN,(R0)=>R0.startsWith('Có, vì mã chia hết cho 9')];},
 'Chia luống rau':(u,U)=>{const C=U.txt(u.ctx),n=+C.match(/có (\d+) cây/)[1],lo=+C.match(/từ (\d+) đến/)[1],hi=+C.match(/đến (\d+) cây/)[1];const p=dv(n).filter(d=>prime(d)&&d>2)[0];
   return [only(o=>isPF(o,n)),dv(n).filter(d=>d>=lo&&d<=hi).length,n/p];},
 'Quỹ lớp':(u,U)=>{const T=num(U.txt(u.ctx).match(/được tất cả ([\d ]+) nghìn/)[1]),S=dv(T).filter(d=>d>=30&&d<=45);
   return [only(o=>isPF(o,T)),S.length===1?S[0]:NaN,S.length===1?T/S[0]:NaN,only(o=>o.startsWith(ds(T)%9===0?'Được, vì tổng các chữ số':'Không, vì tổng các chữ số'))];}
};
