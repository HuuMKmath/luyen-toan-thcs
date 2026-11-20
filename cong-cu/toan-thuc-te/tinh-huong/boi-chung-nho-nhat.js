PISA.push(
 G(()=>{const [a,b,c]=sel([[4,6,8],[6,8,10],[3,4,5],[4,5,6],[6,9,12],[8,10,12],[10,12,15],[5,6,8],[4,6,9]]);
  const g=(x,y)=>{while(y){const t=x%y;x=y;y=t;}return x;},l2=(x,y)=>x/g(x,y)*y,l=l2(l2(a,b),c);
  const k=ri(2,Math.max(2,Math.floor(300/l)));const n=l*k;if(n<40||n>300)throw 0;
  const d1=ri(1,l-1),d2=ri(0,l-1-d1);let L=n-d1,H=n+d2;
  const d=sel([7,9,11,13].filter(x=>n%x));if(!d)throw 0;
  const isC=v=>v%a===0&&v%b===0&&v%c===0;
  const right=sel([2*l,3*l]),cand=[a*b,a+b+c,l+a,l/2,a*b*c+a,b*c].filter(v=>Number.isInteger(v)&&v>0&&!isC(v)&&v!==right);
  const w=pk([...new Set(cand)],3);if(w.length<3)throw 0;
  const why=v=>{const no=[a,b,c].filter(x=>v%x);return `${v} không chia hết cho ${no.join(' và ')}, nên không xếp được hàng ${no.join(' hoặc ')} người.`;};
  return {title:'Đội đồng diễn',ctx:P(`Một đội đồng diễn của trường có từ ${L} đến ${H} người. Khi xếp thành hàng ${a} người, hàng ${b} người hay hàng ${c} người thì đều vừa đủ, không thừa ai.`),qs:[
   A(`Tìm BCNN(${a}, ${b}, ${c}).`,l,'',`Phân tích ra thừa số nguyên tố rồi lấy các thừa số chung và riêng với số mũ lớn nhất, được BCNN(${a}, ${b}, ${c}) = ${l}.`,'ts','TH'),
   M('Nếu chưa xét điều kiện số người từ '+L+' đến '+H+', số nào sau đây có thể là số người của đội?',''+right,w.map(v=>[''+v,why(v)]),`Số người của đội phải là bội chung của ${a}, ${b} và ${c}, tức là bội của ${l}. ${right} = ${l} · ${right/l}.`,'sy','VD'),
   A('Đội đồng diễn có bao nhiêu người?',n,'người',`Số người là bội của ${l} và nằm trong khoảng từ ${L} đến ${H}. Các bội của ${l}: ...; ${n-l}; ${n}; ${n+l}; ... Chỉ có ${n} thỏa mãn.`,'tt','VD'),
   A(`Nếu xếp đội thành các hàng ${d} người thì xếp được nhiều nhất bao nhiêu hàng đủ ${d} người?`,Math.floor(n/d),'hàng',`${n} = ${d} · ${Math.floor(n/d)} + ${n%d}. Xếp được ${Math.floor(n/d)} hàng đủ ${d} người, còn thừa ${n%d} người.`,'tt','VD')]};})
);
