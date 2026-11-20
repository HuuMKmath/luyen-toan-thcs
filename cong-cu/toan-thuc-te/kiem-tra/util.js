// đọc lại đề: bỏ thẻ HTML, phân số thành a/b
const txt=s=>String(s).replace(/<span class="fr"><span>([^<]*)<\/span><span>([^<]*)<\/span><\/span>/g,'($1/$2)').replace(/<sup>([^<]*)<\/sup>/g,'^$1').replace(/<[^>]+>/g,'').replace(/&nbsp;| /g,' ').replace(/\s+/g,' ').trim();
// số kiểu Việt: −3,5 ; (3/4) ; √2 ; −√5
function num(s){s=txt(s).replace(/[−–]/g,'-').replace(/\s/g,'');
  let m=s.match(/^\(?(-?)\(?(-?\d+)\/(\d+)\)?\)?$/);if(m)return (m[1]?-1:1)*(+m[2])/(+m[3]);
  m=s.match(/^(-?)√(\d+(?:,\d+)?)$/);if(m)return (m[1]?-1:1)*Math.sqrt(+m[2].replace(',','.'));
  m=s.match(/^(-?)(\d+),(\d*)\((\d+)\)$/);if(m){const sg=m[1]?-1:1,I=+m[2],pre=m[3],per=m[4];return sg*(I+((+(pre+per)||0)-(+pre||0))/((Math.pow(10,per.length)-1)*Math.pow(10,pre.length)));}
  s=s.replace(/\./g,'').replace(',','.');const v=parseFloat(s);if(isNaN(v))throw new Error('không đọc được số: '+s);return v;}
function rows(ctx){const out=[];const tb=String(ctx).match(/<tbody>([\s\S]*?)<\/tbody>/);if(!tb)return out;
  for(const r of tb[1].split('</tr>')){const c=[...r.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(x=>x[1]);if(c.length)out.push(c);}return out;}
const ints=s=>(txt(s).replace(/[−–]/g,'-').match(/-?\d+(?:,\d+)?/g)||[]).map(x=>+x.replace(',','.'));
module.exports={txt,num,rows,ints};
