// Kiểm tra gói Toán thực tế bài Số nguyên tố (Toán 6, Bài 10): đọc lại số liệu trong đề và bảng, kiểm tra bằng phép chia thử.
const prime=n=>{if(n<2)return false;for(let d=2;d<n;d++)if(n%d===0)return false;return true;};
const dv=n=>{const o=[];for(let d=1;d<=n;d++)if(n%d===0)o.push(d);return o;};
const only=f=>(R,O)=>f(R)&&O.slice(1).every(o=>!f(o));
const prodVal=s=>s.split('·').map(t=>t.trim()).reduce((a,t)=>{const m=t.match(/^(\d+)(?:\^(\d+))?$/);return m?a*Math.pow(+m[1],+(m[2]||1)):NaN;},1);
const isPF=(s,n)=>{let prev=0;for(const t of s.split('·').map(x=>x.trim())){const m=t.match(/^(\d+)(?:\^(\d+))?$/);if(!m||!prime(+m[1])||+m[1]<=prev)return false;prev=+m[1];}return prodVal(s)===n;};
module.exports={
 'Cắm hoa':(u,U)=>{const V={};U.rows(u.ctx).forEach(r=>V[U.txt(r[0])]=+U.txt(r[1]));const S=u.qs.map(q=>U.txt(q.stem));const d1=Object.keys(V).find(k=>S[1].includes(k)),d2=Object.keys(V).find(k=>S[2].includes(k));
   return [only(o=>prime(V[o])),dv(V[d1]).filter(x=>x>1&&x<V[d1]).length,dv(V[d2]).filter(prime).length];},
 'Đội tiêu binh':(u,U)=>{const R=U.rows(u.ctx),A=+U.txt(R[0][1])-1,B=+U.txt(R[1][1])-1;
   return [A,only(o=>isPF(o,A)),dv(A).length,only(o=>o===`Vì ${B} là số nguyên tố`&&prime(B))];},
 'Mật mã số nguyên tố':(u,U)=>{const R=U.rows(u.ctx),PM=R[0].slice(1).map(x=>+U.txt(x)),H=['A','B','C','D','E'],S=u.qs.map(q=>U.txt(q.stem));const code=s=>s.split(/, | và /).reduce((a,l)=>a*PM[H.indexOf(l)],1);
   const c3=+S[1].match(/có mã (\d+)/)[1];let x=+S[3].match(/^Mã (\d+)/)[1],k=0;for(let d=2;x>1;d++)while(x%d===0){x/=d;k++;}
   return [code(S[0].match(/nhóm chữ cái (.+) là số nào/)[1]),only(o=>code(o)===c3),(R0,O)=>R0.startsWith('Vì mỗi số chỉ có một cách phân tích'),k];},
 'Xếp gạch hình chữ nhật':(u,U)=>{const R=U.rows(u.ctx),n=+U.txt(R[0][1]),p=+U.txt(R[1][1]);
   return [only(o=>o==='Hộp 2'?prime(p)&&!prime(n):o==='Hộp 1'?prime(n)&&!prime(p):o==='Cả hai hộp'?prime(n)&&prime(p):!prime(n)&&!prime(p)),dv(n).filter(d=>d>1&&d*d<=n).length,dv(n+p).filter(prime).length];}
};
