module.exports={
'Thành tích chạy so với kỉ lục':(u,U)=>{const R=U.rows(u.ctx).map(r=>({n:U.txt(r[0]),v:U.num(r[1])}));const d=U.num(U.txt(u.qs[0].stem).match(/kỉ lục (\S+) giây/)[1]);
  const asc=R.slice().sort((a,b)=>a.v-b.v);return [-d,asc[0].n,R.filter(x=>x.v<0).length,asc.map(x=>x.n).join(', ')];},
'Mực nước sông so với mức báo động':(u,U)=>{const R=U.rows(u.ctx).map(r=>({n:U.txt(r[0]),v:U.num(r[1])}));const hi=R.reduce((a,b)=>b.v>a.v?b:a);
  const s3=U.txt(u.qs[2].stem),[,x,y]=s3.match(/cao hơn ngày (thứ \S+) nhưng thấp hơn ngày (thứ \S+?)\./);
  const vx=R.find(r=>r.n.toLowerCase()===x.toLowerCase()).v,vy=R.find(r=>r.n.toLowerCase()===y.toLowerCase()).v;
  const z=U.txt(u.qs[3].stem).match(/mực nước ngày (thứ \S+) nằm/)[1];const vz=R.find(r=>r.n.toLowerCase()===z.toLowerCase()).v;
  return [hi.n,R.filter(r=>r.v<0).length,(Rt,opts)=>{const v=U.num(Rt);return v>vx&&v<vy&&opts.slice(1).every(o=>{const w=U.num(o);return !(w>vx&&w<vy);});},Math.floor(vz)];}
};
