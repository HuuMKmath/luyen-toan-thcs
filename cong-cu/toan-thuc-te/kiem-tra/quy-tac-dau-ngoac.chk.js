module.exports={
'Mẹ đi chợ':(u,U)=>{const n=U.ints(u.ctx);const [a,x,y,z]=n;const b=U.ints(u.qs[3].stem)[0];
  return [`${a} − (${x} + ${y} + ${z})`,a-x-y-z,a-y-z,(b-x-y-z)-(a-x-y-z)];},
'Tủ bảo quản lạnh':(u,U)=>{const n=U.ints(u.ctx);const t=n[1],a=n[4],b=n[7],c=n[10];const s=U.ints(u.qs[3].stem)[1];
  let T=t;T-=a;T+=b;T-=c;return [`${U.txt(u.ctx).match(/là (\S+)°C/)[1]} − (${a} − ${b} + ${c})`,T,T-t,s-T];}
};
