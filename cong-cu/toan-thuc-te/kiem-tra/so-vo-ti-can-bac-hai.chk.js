const r=(x,k)=>{const m=10**k;return Math.round(x*m)/m;};
const fmt=x=>String(x).replace('.',',');
module.exports={
'Lát gạch sân trường':(u,U)=>{const c=U.txt(u.ctx);const S=+c.match(/diện tích (\d+) m/)[1],g=U.num(c.match(/cạnh (\S+) m\./)[1]);let k=0;while(k*k<S)k++;
  const T=+U.txt(u.qs[3].stem).match(/diện tích (\d+) m/)[1];return [k,4*k,(k*k)/(g*g),fmt(r(Math.sqrt(T),1))];},
'Tấm kính hình vuông':(u,U)=>{const S=+U.txt(u.ctx).match(/diện tích (\d+) dm/)[1];
  return [`√${S}, là một số vô tỉ`,r(Math.sqrt(S),1),Math.round(4*Math.sqrt(S)),4*S];}
};
