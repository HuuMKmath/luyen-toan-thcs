module.exports={'Cửa hàng bán quần áo cuối mùa':(u,U)=>{const n=U.ints(u.ctx);const a=n[0],b=n[1],x=n[2],y=n[3];
  const y2=U.ints(u.qs[3].stem)[0];let k=0;while(k*a-y2*b<0)k++;
  return [-(y*b),`${x} · ${a} + ${y} · (−${b})`,x*a-y*b,k];}};
