// tính lại bằng phép chia dài viết lại độc lập
function longdiv(p,q){const I=Math.floor(p/q);let r=p%q;const pos=new Map(),d=[];while(r!==0&&!pos.has(r)){pos.set(r,d.length);r*=10;d.push(Math.floor(r/q));r%=q;}
  if(r===0)return d.length?I+','+d.join(''):''+I;const s=pos.get(r);return I+','+d.slice(0,s).join('')+'('+d.slice(s).join('')+')';}
const digit=(p,q,k)=>{const s=(p/q).toString();let r=p%q,x;for(let i=0;i<k;i++){r*=10;x=Math.floor(r/q);r%=q;}return x;};
const round=(p,q,k)=>{const m=10**k;const t=Math.floor(p*m/q),rem=(p*m)%q;return (2*rem>=q?t+1:t)/m;};
const finite=(p,q)=>{const g=(a,b)=>b?g(b,a%b):a;q/=g(p,q);for(const f of [2,5])while(q%f===0)q/=f;return q===1;};
module.exports={
'Cắt cuộn ruy băng':(u,U)=>{const [L,n]=U.ints(u.ctx);const R=longdiv(L,n);const per=R.match(/\((\d+)\)/)[1];const k=U.ints(u.qs[3].stem)[0];
  return [R,per.length,round(L,n,2),digit(L,n,k)];},
'Mua bút theo gói':(u,U)=>{const R=U.rows(u.ctx).map(r=>({L:U.txt(r[0]),c:+U.txt(r[1]),p:+U.txt(r[2])}));
  const f=R.filter(r=>finite(r.p,r.c));if(f.length!==1)throw new Error('số gói hữu hạn '+f.length);
  const pl=U.txt(u.qs[1].stem).match(/của gói (\S)/)[1];const X=R.find(r=>r.L===pl);
  let mn=R[0];R.forEach(r=>{if(r.p*mn.c<mn.p*r.c)mn=r;});
  return ['Gói '+f[0].L,longdiv(X.p,X.c)+' (nghìn đồng)',round(X.p,X.c,1),`Gói ${mn.L} (${mn.c} bút, ${mn.p} nghìn đồng)`];}
};
