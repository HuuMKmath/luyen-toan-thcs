// Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng: tính lại đáp án từ số liệu trong tình huống
module.exports={
 'Ngôi nhà mái chữ A':(u,U)=>{const c=U.txt(u.ctx),w=+c.match(/rộng (\d+) m/)[1],L=+c.match(/AB = AC = (\d+) m/)[1],h=+c.match(/cao (\d+) m/)[1];
   if(Math.abs((w/2)**2+h*h-L*L)>1e-9)throw new Error('số liệu ngôi nhà không khớp nhau');
   return [(R)=>/trung trực của đoạn thẳng BC/.test(R),w*100/100,Math.sqrt(L*L-h*h),L+L+w];},
 'Trạm y tế cách đều hai thôn':(u,U)=>{const m=U.ints(u.qs[1].stem)[0],x=U.ints(u.qs[2].stem)[0],k=U.ints(u.qs[3].stem)[0];
   return [(R)=>/giao điểm của quốc lộ d với đường trung trực/i.test(R),m,180-x-x,(m+m)*k];},
 'Khung biển báo tam giác đều':(u,U)=>{const c=U.txt(u.ctx),a=+c.match(/dài (\d+) cm/)[1],L=+c.match(/dài (\d+) m\./)[1];let n=0;while((n+1)*3*a<=100*L)n++;
   return ['60°',a+a+a,n,60/2];},
 'Thang gấp chữ A':(u,U)=>{const c=U.txt(u.ctx),C=+c.match(/∠BAC = (\d+)°/)[1],d=+c.match(/BC = (\d+) dm/)[1],e=U.ints(u.qs[3].stem)[0];
   return [(R)=>/cân tại A/.test(R),(180-C)/2,d/2,(180-C)/2-(180-C-e)/2];}
};
