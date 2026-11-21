// Kiểm tra gói Toán thực tế bài Quan hệ chia hết và tính chất (Toán 6, Bài 8): đọc lại số liệu trong đề và bảng, tính lại đáp án.
const divs=n=>{const o=[];for(let d=1;d<=n;d++)if(n%d===0)o.push(d);return o;};
const nextMul=(x,b)=>{while(x%b)x++;return x;};
const mins=t=>{const k=t.match(/(\d+) giờ (\d+) phút/);return (+k[1]-6)*60+ +k[2];};
// lựa chọn đúng phải đúng, mọi lựa chọn sai phải sai
const only=f=>(R,O)=>f(R)&&O.slice(1).every(o=>!f(o));
module.exports={
 'Xếp ghế hội trường':(u,U)=>{const n=U.ints(u.ctx)[0],V={};U.rows(u.ctx).forEach(r=>V[U.txt(r[0])]=+U.txt(r[1]));const S=u.qs.map(q=>U.txt(q.stem));
   const y=S[1].match(/phương án (\w)/)[1],lh=U.ints(S[2]),x=S[3].match(/phương án (\w)/)[1];
   return [only(o=>n%V[o.slice(-1)]!==0),n/V[y],divs(n).filter(d=>d>=lh[0]&&d<=lh[1]).length,nextMul(n,V[x])-n];},
 'Đóng hộp bánh':(u,U)=>{const m=U.ints(U.txt(u.ctx).match(/mỗi hộp (\d+) chiếc/)[0])[0],R=U.rows(u.ctx),a=+U.txt(R[0][1]),b=+U.txt(R[1][1]);
   return [a/m,only(o=>o.startsWith('Không đóng vừa hết')&&a%m===0&&b%m!==0),(a+b)%m,(m-(a+b)%m)%m];},
 'Giờ xe buýt':(u,U)=>{const b=U.ints(U.txt(u.ctx).match(/cứ (\d+) phút/)[0])[0],S=u.qs.map(q=>U.txt(q.stem));const t=mins(S[3]);
   let c=0;for(let x=0;x<=120;x+=b)c++;
   return [only(o=>o===`Một bội của ${b}`),only(o=>mins(o)%b===0),c,nextMul(t,b)-t];},
 'Mua bút':(u,U)=>{const p=U.ints(U.txt(u.ctx).match(/giá (\d+) nghìn/)[0])[0],V={};U.rows(u.ctx).forEach(r=>V[U.txt(r[0])]=+U.txt(r[1]));const s=V['Bình']+V['Chi'];
   return [only(o=>o==='Không bạn nào'?Object.values(V).every(v=>v%p):V[o]%p===0),Math.floor(V['Bình']/p),
     only(o=>o.startsWith(`Dùng hết tiền được vì ${V['Bình']} + ${V['Chi']} = ${s}`)&&s%p===0),(V['An']+s)/p];}
};
