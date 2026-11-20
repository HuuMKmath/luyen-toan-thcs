module.exports={
'Gấp đôi tờ giấy':(u,U)=>{const d=U.num(U.txt(u.ctx).match(/dày (\S+) mm/)[1]);const m=U.ints(u.qs[0].stem)[0],n=U.ints(u.qs[1].stem)[0];const k=U.ints(u.qs[3].stem)[1];
  let L=1;for(let i=0;i<n;i++)L*=2;let L2=L;for(let i=0;i<k;i++)L2*=2;return [2**m,`2^${n}`,L*d,L2/L];},
'Quả bóng nảy':(u,U)=>{const c=U.txt(u.ctx);const h=+c.match(/độ cao (\d+) m/)[1];const [,a,b]=c.match(/bằng \((\d+)\/(\d+)\)/);const r=a/b;
  const n=U.ints(u.qs[1].stem)[0];const X=U.num(U.txt(u.qs[3].stem).match(/thấp hơn (\S+) m/)[1]);let x=h,j=0;do{x*=r;j++;}while(x>=X);
  return [h*r,`${h} · ((${a}/${b}))^${n}`,h*r*r*r,j];}
};
