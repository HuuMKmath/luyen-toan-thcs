module.exports={
'Các tầng của toà nhà':(u,U)=>{const R=U.rows(u.ctx).map(r=>({n:U.txt(r[0]),f:U.num(r[1])}));const s=u.qs.map(q=>U.txt(q.stem));
  const k=+s[0].match(/thứ (\d+)/)[1];let lo=R[0];R.forEach(x=>{if(x.f<lo.f)lo=x;});
  const [,x,y]=s[3].match(/của bạn (\S+) lên tầng của bạn (\S+?)\./);const fx=R.find(r=>r.n===x).f,fy=R.find(r=>r.n===y).f;let c=0;for(let z=fx+1;z<fy;z++)c++;
  return [0-k,lo.n,R.filter(r=>r.f<0).length,c];},
'Kết quả kinh doanh của các cửa hàng':(u,U)=>{const R=U.rows(u.ctx).map(r=>({n:U.txt(r[0]),v:U.num(r[1])}));const s=u.qs.map(q=>U.txt(q.stem));
  const k=+s[0].match(/lỗ (\d+) triệu/)[1],m=U.num(s[2].match(/hơn (\S+) triệu/)[1]);
  const lo=R.reduce((a,b)=>b.v<a.v?b:a);const ord=R.slice().sort((a,b)=>b.v-a.v).map(x=>x.n).join(', ');
  return [-k,'Cửa hàng '+lo.n,R.filter(x=>x.v>m).length,ord];}
};
