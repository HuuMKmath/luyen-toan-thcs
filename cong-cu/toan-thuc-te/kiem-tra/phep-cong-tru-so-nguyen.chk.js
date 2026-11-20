module.exports={
'Thang máy của toà nhà':(u,U)=>{const c=U.txt(u.ctx);const s=U.num(c.match(/xuất phát từ tầng (\S+) rồi/)[1]);
  const mv=U.rows(u.ctx).map(r=>{const t=U.txt(r[1]);const k=+t.match(/\d+/)[0];return t.startsWith('Lên')?k:-k;});
  let p=s;const P=[s];mv.forEach(d=>{p+=d;P.push(p);});
  const sg=mv.map(d=>d>0?'+':'−');const ex=`${U.txt(c.match(/tầng (\S+) rồi/)[1])} ${sg[0]} ${Math.abs(mv[0])} ${sg[1]} ${Math.abs(mv[1])} ${sg[2]} ${Math.abs(mv[2])} ${sg[3]} ${Math.abs(mv[3])}`;
  return [P[1],ex,P[4],Math.max(...P)-Math.min(...P)];},
'Trò chơi tích điểm':(u,U)=>{const R=U.rows(u.ctx).map(r=>[U.num(r[1]),U.num(r[2])]);const X=R.map(r=>r[0]),D=R.map(r=>r[1]);
  let sx=0,sd=0;X.forEach(v=>sx+=v);D.forEach(v=>sd+=v);const m=U.num(U.txt(u.qs[3].stem).match(/ghi (\S+) điểm/)[1]);
  const ans=(sx>sd?'Đội Xanh':'Đội Đỏ')+', hơn '+Math.abs(sx-sd)+' điểm';
  // Xanh + y = Đỏ + m
  let y=-1000;while(sx+y!==sd+m)y++;
  return [X[0]+X[1],sd,ans,y];}
};
