module.exports={'Đội đồng diễn':(u,U)=>{const [L,H,a,b,c]=U.ints(u.ctx);let l=1;while(l%a||l%b||l%c)l++;
  const ok=[];for(let v=L;v<=H;v++)if(v%a===0&&v%b===0&&v%c===0)ok.push(v);if(ok.length!==1)throw new Error('khoảng có '+ok.length+' số');
  const d=U.ints(u.qs[3].stem)[0];
  return [l,(R,opts)=>{const v=+R;return v%a===0&&v%b===0&&v%c===0&&opts.slice(1).every(o=>+o%a||+o%b||+o%c);},ok[0],Math.floor(ok[0]/d)];}};
