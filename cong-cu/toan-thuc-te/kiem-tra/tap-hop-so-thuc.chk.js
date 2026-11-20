module.exports={
'Kiểm tra khối lượng gói bánh':(u,U)=>{const R=U.rows(u.ctx).map(r=>({L:U.txt(r[0]),v:U.num(r[1])}));
  const X=U.txt(u.qs[0].stem).match(/của gói (\S)/)[1],Y=U.txt(u.qs[1].stem).match(/Gói (\S)/)[1];
  const far=R.reduce((a,b)=>Math.abs(b.v)>Math.abs(a.v)?b:a);
  return [Math.abs(R.find(r=>r.L===X).v),200+R.find(r=>r.L===Y).v,R.filter(r=>Math.abs(r.v)<=1.5).length,'Gói '+far.L];},
'Các địa điểm trên một con đường thẳng':(u,U)=>{const R=U.rows(u.ctx).map(r=>({n:U.txt(r[0]),v:U.num(r[1])}));
  const far=R.reduce((a,b)=>Math.abs(b.v)>Math.abs(a.v)?b:a);
  return [Math.abs(R.find(r=>r.n==='Chợ').v),far.n,R.filter(r=>Math.abs(r.v)<=2).length,R.slice().sort((a,b)=>a.v-b.v).map(r=>r.n).join(', ')];}
};
