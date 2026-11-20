module.exports={'Kho lạnh hạ nhiệt độ':(u,U)=>{const n=U.ints(u.ctx);const t0=n[0],h=n[1],t1=n[2];const d=t1-t0;const per=d/h;
  const k=U.ints(u.qs[2].stem)[0];const n4=U.ints(u.qs[3].stem);const T=n4[1];
  let x=t1,c=0;while(x>T){x+=per;c++;}if(x!==T)throw new Error('không tròn');
  return [d,per,nm(t0+per*k)+'°C',c];}};
const nm=x=>(x<0?'−':'')+Math.abs(x);
