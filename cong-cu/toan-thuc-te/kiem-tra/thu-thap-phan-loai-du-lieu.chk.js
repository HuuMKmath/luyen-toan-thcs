module.exports={
'Môn thể thao yêu thích':(u,U)=>{const v=U.rows(u.ctx).map(r=>+U.txt(r[1]));let t=0;v.forEach(x=>t+=x);
  return ['Dữ liệu không là số, không thể sắp thứ tự',t,Math.max(...v)-Math.min(...v),(R)=>/ngẫu nhiên/.test(R)];},
'Thí nghiệm trồng cây đậu':(u,U)=>{const d=U.rows(u.ctx)[0].slice(1).map(c=>U.num(c));const bad=d.filter(x=>x<=0||x>=100);if(bad.length!==1)throw new Error('số giá trị lạ '+bad.length);
  const ok=d.filter(x=>!(x<=0||x>=100));const th=U.ints(u.qs[2].stem)[0];const s4=U.txt(u.qs[3].stem);const re=U.num(s4.match(/được (\S+) cm/)[1]),th2=+s4.match(/hơn (\d+) cm/)[1];
  return ['Chiều cao cây và số lá',String(bad[0]).replace('-','−'),ok.filter(x=>x>=th).length,ok.concat([re]).filter(x=>x>th2).length];}
};
