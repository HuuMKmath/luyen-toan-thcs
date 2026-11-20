module.exports={'Thẻ đi xe buýt':(u,U)=>{const n=U.ints(u.ctx);const s=n[0],f=n[1];const R=U.rows(u.ctx);const ch=R.map(r=>U.num(r[2].replace('+','')));
  const tr=R.map(r=>{const m=U.txt(r[1]).match(/Đi (\d+) lượt/);return m?+m[1]:0;});
  ch.forEach((c,i)=>{if(tr[i]&&c!==-tr[i]*f)throw new Error('bảng sai');});
  let b=s;ch.forEach(c=>b+=c);let k=0;while((k+1)*f<=b)k++;
  const sp=ch.filter(c=>c<0).map(c=>-c).join(' + '),m=ch[1];
  return [s+ch[0]+ch[1],`${s} − (${sp}) + ${m}`,b,k];}};
