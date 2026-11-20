module.exports={
'Chia tiền chuyến dã ngoại':(u,U)=>{const n=U.ints(u.ctx)[0];const v=U.rows(u.ctx).map(r=>U.num(r[1]));let t=0;v.forEach(x=>t+=Math.round(x*10));t/=10;
  const m=U.ints(u.qs[2].stem)[0];const L=U.rows(u.ctx).map(r=>U.txt(r[1])).join(' + ');return [t,t/n,`(${L}) : ${n} − ${m}`,t/n-m];},
'Bàn cờ và hạt thóc':(u,U)=>{const k=U.ints(u.ctx).slice(-1)[0];const n=U.ints(u.qs[1].stem)[0];const [a,b]=U.ints(u.qs[2].stem);
  const c=[1];for(let i=1;i<20;i++)c.push(c[i-1]*k);return [c[4],`${k}^${n-1}`,c[a-1]/c[b-1],c[0]+c[1]+c[2]+c[3]];}
};
