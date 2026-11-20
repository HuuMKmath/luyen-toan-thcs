function longdiv(p,q){const I=Math.floor(p/q);let r=p%q;const pos=new Map(),d=[];while(r!==0&&!pos.has(r)){pos.set(r,d.length);r*=10;d.push(Math.floor(r/q));r%=q;}
  if(r===0)return d.length?I+','+d.join(''):''+I;const s=pos.get(r);return I+','+d.slice(0,s).join('')+'('+d.slice(s).join('')+')';}
const r1=x=>Math.round(x*10)/10;
module.exports={
'Ba sợi dây':(u,U)=>{const c=U.txt(u.ctx);const [,p,q]=c.match(/dây A dài \((\d+)\/(\d+)\)/).map(Number);const k=+c.match(/√(\d+)/)[1];const d=U.num(c.match(/dây C dài (\S+) m/)[1]);
  const L=[['dây A',p/q],['dây B',Math.sqrt(k)],['dây C',d]].sort((a,b)=>a[1]-b[1]);
  return ['Dây B',longdiv(p,q),L.map(x=>x[0]).join(', '),r1(p/q+Math.sqrt(k)+d)];},
'Thành tích chạy 100 m':(u,U)=>{const R=U.rows(u.ctx).map(r=>({n:U.txt(r[0]),v:U.num(r[1]),t:U.txt(r[1])}));const [,a,b]=R[0].t.match(/\((\d+)\/(\d+)\)/).map(Number);
  const y=U.txt(u.qs[1].stem).match(/của bạn (\S+) đến/)[1];const Tm=U.num(U.txt(u.qs[3].stem).match(/ít hơn (\S+) giây/)[1]);
  const fast=R.reduce((x,z)=>z.v<x.v?z:x);return [longdiv(a,b),r1(R.find(r=>r.n===y).v),fast.n,R.filter(r=>r.v<Tm).length];}
};
