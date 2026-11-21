// Kiểm tra gói Toán thực tế bài Dấu hiệu chia hết (Toán 6, Bài 9): đọc lại số liệu trong đề và bảng, tính lại đáp án bằng phép chia thật.
const nextMul=(x,b)=>{while(x%b)x++;return x;};
const only=f=>(R,O)=>f(R)&&O.slice(1).every(o=>!f(o));
const dsum=n=>String(n).split('').reduce((a,b)=>a+ +b,0);
const ov=s=>String(s).replace(/<[^>]+>/g,'').replace(/[\s ]/g,'');
const star=(tpl,f)=>{const o=[];for(let d=0;d<=9;d++){const s=tpl.replace('*',d);if(s[0]!=='0'&&f(+s))o.push(d);}return o;};
module.exports={
 'Trồng cây trên bờ đất':(u,U)=>{const C=U.txt(u.ctx),L0=+C.match(/dài (\d+) m/)[1],V={};U.rows(u.ctx).forEach(r=>V[U.txt(r[0])]=+U.txt(r[1]));const S=u.qs.map(q=>U.txt(q.stem));
   const g=Object.keys(V).find(p=>S[1].includes(p.toLowerCase())),f=Object.keys(V).find(p=>S[2].includes(p.toLowerCase()));
   return [only(o=>L0%V[o]!==0),L0/V[g]+1,nextMul(L0,V[f])-L0];},
 'Xếp hàng đồng diễn':(u,U)=>{const n=+U.txt(u.ctx).match(/có (\d+) học sinh/)[1],V={};U.rows(u.ctx).forEach(r=>V[U.txt(r[0])]=+U.txt(r[1]));const S=u.qs.map(q=>U.txt(q.stem));const k=V['Cách '+S[3].match(/cách (\d)/)[1]];
   return [dsum(n),only(o=>{const z=o.match(/^(Cách \d) (không xếp được|xếp được)$/);const d=n%V[z[1]]===0;return z[2]==='xếp được'?d:!d;}),Object.values(V).filter(x=>n%x===0).length,nextMul(n,k)-n];},
 'Mật mã vali':(u,U)=>{const C=U.txt(u.ctx),mid=C.match(/dạng a(\d\d)b/)[1],k=+U.txt(U.rows(u.ctx)[2][1]).match(/(\d)$/)[1],S=u.qs.map(q=>U.txt(q.stem));const A=[];for(let a=1;a<=9;a++)if(+(`${a}${mid}0`)%k===0)A.push(a);
   const w=S[2].match(/dạng a(\d\d)b/)[1];let c=0;for(let a=1;a<=9;a++)for(let b=0;b<=9;b++){const x=+(`${a}${w}${b}`);if(x%15===0)c++;}
   return [only(o=>o==='0'),S[1].startsWith('Chữ số a')?A[0]:A.length,c];},
 'Hoá đơn bị mờ':(u,U)=>{const R=U.rows(u.ctx),p=+U.txt(R[0][1]),tpl=ov(R[0][2]),T2=+ov(R[1][2]);const D=star(tpl,x=>x%p===0);if(D.length!==1)throw new Error('không duy nhất');const T=+tpl.replace('*',D[0]);
   return [only(o=>{for(let n=100;n<2000;n++)if((p*n)%+o)return false;return true;}),D[0],T/p,(T+T2)%9];}
};
