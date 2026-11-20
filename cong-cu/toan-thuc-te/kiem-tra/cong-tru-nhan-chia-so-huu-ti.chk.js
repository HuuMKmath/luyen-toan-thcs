const F=(a,b)=>{const g=(x,y)=>y?g(y,x%y):x;const k=g(a,b);return `(${a/k}/${b/k})`;};
module.exports={
'Mua trái cây':(u,U)=>{const R=U.rows(u.ctx).map(r=>({n:U.txt(r[0]),p:U.num(r[1]),w:U.num(r[2])}));let t=0;R.forEach(r=>t+=r.p*100*r.w);t/=100;
  const s3=U.txt(u.qs[2].stem),B=+s3.match(/người bán (\d+)/)[1];const s4=U.txt(u.qs[3].stem),M=U.num(s4.match(/có (\S+) nghìn/)[1]);
  const nmv=x=>String(x).replace('.',',');
  return [R[0].p*R[0].w,t,`${B} − (${R.map(r=>`${r.p} · ${nmv(r.w)}`).join(' + ')})`,M/R[0].p];},
'Đọc sách':(u,U)=>{const c=U.txt(u.ctx);const P=+c.match(/dày (\d+) trang/)[1];const fr=[...c.matchAll(/\((\d+)\/(\d+)\)/g)].map(m=>[+m[1],+m[2]]);
  const [a1,a2]=fr[0],[b1,b2]=fr[1];const d1=P*a1/a2,r1=P-d1,d2=r1*b1/b2;const left=P-d1-d2;
  return [d1,F(a2-a1,a2),d2,left/P];}
};
