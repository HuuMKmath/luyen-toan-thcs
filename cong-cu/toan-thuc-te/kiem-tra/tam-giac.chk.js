module.exports={'Khung cánh diều':(u,U)=>{const c=U.txt(u.ctx);const x=+c.match(/cùng dài (\d+) cm; hai/)[1],y=+c.match(/cùng dài (\d+) cm; thanh/)[1],al=+c.match(/CAD bằng (\d+)/)[1],be=+c.match(/ACB bằng (\d+)/)[1];
  const r=U.ints(u.qs[1].stem)[0];return [(R)=>/c\.c\.c/.test(R),r*(2*x+2*y),be,al/2];}};
