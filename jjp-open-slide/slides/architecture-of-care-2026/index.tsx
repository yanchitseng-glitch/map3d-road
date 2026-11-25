import { ImagePlaceholder, useSlidePageNumber, type DesignSystem, type Page, type SlideMeta } from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

// Authored from projects/jjp-annual-2026/brief.json. The six architectural
// image slots intentionally use official OpenSlide ImagePlaceholder controls.
const content = [
  {
    "layout": "cover",
    "title": "照護的建築",
    "body": "Architecture of Care\nJJP DESIGN ANNUAL 2026\n從醫療、長照到全齡共生的空間實踐"
  },
  {
    "layout": "essay",
    "title": "從塑山者到照護的建築",
    "blocks": [
      {
        "heading": "延續年度設計論述",
        "body": "從 2025「塑山者」對建築與環境的關注，轉向人在生命不同階段的健康、尊嚴與生活。"
      },
      {
        "heading": "本年度策展命題",
        "body": "不是醫院與長照作品的集合，而是透過 JJP 的實踐，探索照護如何成為一種建築態度。"
      }
    ]
  },
  {
    "layout": "essay",
    "title": "高齡社會的空間提問",
    "blocks": [
      {
        "heading": "需求正在改變",
        "body": "高齡化、慢性病照護、健康管理，以及家庭與社區支持模式，正在改變建築的使用情境。"
      },
      {
        "heading": "建築如何回應",
        "body": "從單一機能的設施，走向兼顧身體、日常、心理與社會關係的場所。"
      }
    ]
  },
  {
    "layout": "section",
    "title": "照護不只發生在醫院",
    "body": "Care extends beyond healthcare.\n從治療、健康促進到全齡生活與社會共融。"
  },
  {
    "layout": "evolution",
    "title": "照護的尺度",
    "stages": [
      {
        "heading": "身體",
        "body": "醫療照護與健康促進",
        "image": {
          "path": "assets/care-scale-body.png",
          "alt": "照護由中心的個人身體與醫療照護展開的圓形示意"
        }
      },
      {
        "heading": "生活",
        "body": "長照、全齡居住與日常支持",
        "image": {
          "path": "assets/care-scale-life.png",
          "alt": "由身體擴展至全齡日常生活的同心圓圖解"
        }
      },
      {
        "heading": "社會",
        "body": "社區連結與社會共融",
        "image": {
          "path": "assets/care-scale-society.png",
          "alt": "由個人到社會支持網絡的完整同心圓示意"
        }
      }
    ]
  },
  {
    "layout": "essay",
    "title": "JJP 的六種照護實踐",
    "blocks": [
      {
        "heading": "醫療與健康",
        "body": "北醫第一醫療大樓、佳里奇美醫院、門諾健康管理大樓。"
      },
      {
        "heading": "生活與共融",
        "body": "東基樂齡長照園區、三芝日勝生、育成社福永續庇護園區。"
      }
    ]
  },
  {
    "layout": "photography",
    "title": "北醫第一醫療大樓",
    "body": "醫療建築不只是治療的容器，也涉及城市介面、公共性與進出醫療空間的感受。",
    "image": {
      "path": "assets/tmu.jpg",
      "alt": "北醫第一醫療大樓實際專案圖像；待置入經授權素材",
      "caption": "TAIPEI MEDICAL UNIVERSITY｜素材待補"
    }
  },
  {
    "layout": "photography",
    "title": "佳里奇美醫院",
    "body": "以人、自然與光線的交織，探索醫療建築中明亮、可辨識且具有療癒感的公共空間。",
    "image": {
      "path": "assets/chimei.jpg",
      "alt": "佳里奇美醫院實際專案圖像；待置入經授權素材",
      "caption": "CHIMEI HOSPITAL｜素材待補"
    }
  },
  {
    "layout": "photography",
    "title": "門諾健康管理大樓",
    "body": "從疾病治療走向健康管理與預防，重新思考健康空間與日常生活的關係。",
    "image": {
      "path": "assets/mennonite.jpg",
      "alt": "門諾健康管理大樓實際專案圖像；待置入經授權素材",
      "caption": "MENNONITE HEALTH｜素材待補"
    }
  },
  {
    "layout": "photography",
    "title": "東基樂齡長照園區",
    "body": "將長照環境視為生活場所，關注高齡者的尊嚴、陪伴、日常節奏與空間感受。",
    "image": {
      "path": "assets/taitung-senior.jpg",
      "alt": "東基樂齡長照園區實際專案圖像；待置入經授權素材",
      "caption": "SENIOR LIVING｜素材待補"
    }
  },
  {
    "layout": "photography",
    "title": "三芝日勝生",
    "body": "全齡通用的居住環境，讓建築因應生命階段的改變；獎項正式名稱與資料待出版核對。",
    "image": {
      "path": "assets/sanzhi.jpg",
      "alt": "三芝日勝生實際專案圖像；待置入經授權素材",
      "caption": "UNIVERSAL HOUSING｜素材待補"
    }
  },
  {
    "layout": "photography",
    "title": "育成社福永續庇護園區",
    "body": "將社會支持與空間再利用結合，思考工作、陪伴、社區交流與永續構造。",
    "image": {
      "path": "assets/yucheng.jpg",
      "alt": "育成社福永續庇護園區實際專案圖像；待置入經授權素材",
      "caption": "SOCIAL INCLUSION｜素材待補"
    }
  },
  {
    "layout": "comparison",
    "title": "從作品提煉照護設計原則",
    "options": [
      "個體的照護",
      "群體的照護"
    ],
    "rows": [
      [
        "尊嚴 Dignity",
        "自主與安全感",
        "平等與可親近"
      ],
      [
        "連結 Connection",
        "家人與照護者",
        "社區與公共生活"
      ],
      [
        "自然 Nature",
        "採光與景觀",
        "戶外活動與生態"
      ],
      [
        "適應 Adaptability",
        "使用需求變化",
        "全齡與長期彈性"
      ]
    ]
  },
  {
    "layout": "essay",
    "title": "年刊編輯與資料募集",
    "blocks": [
      {
        "heading": "內容架構",
        "body": "年度主論述、專題訪談、六個作品案例、跨案例設計方法與照護空間圖解。"
      },
      {
        "heading": "必要素材",
        "body": "經授權的建築攝影與圖面、專案故事、可核對的成果資訊、人物與使用情境。"
      }
    ]
  },
  {
    "layout": "closing",
    "title": "建築，作為一種照護的實踐",
    "body": "Architecture as an Act of Care\n2026 JJP Design Annual｜策展提案初稿"
  }
] as const;

export const design: DesignSystem = {
  palette: { bg: '#F4F2EB', text: '#242824', accent: '#566449' },
  fonts: {
    display: '"Noto Serif CJK TC", "Noto Serif TC", "Songti TC", serif',
    body: '"Noto Sans CJK TC", "Noto Sans TC", "PingFang TC", sans-serif',
  },
  typeScale: { hero: 148, body: 36 },
  radius: 0,
};
const c = { paper: '#F4F2EB', ink: '#242824', olive: '#566449', soft: '#8E9786', line: '#C4C8B9', pale: '#E6E8DE', faint: '#EDEEE8' };
const sans = 'var(--osd-font-body)';
const serif = 'var(--osd-font-display)';
const pageRoot: CSSProperties = {
  position: 'relative', width: '100%', height: '100%', background: 'var(--osd-bg)',
  color: 'var(--osd-text)', fontFamily: sans, overflow: 'hidden', boxSizing: 'border-box',
};

function Footer() {
  const { current, total } = useSlidePageNumber();
  return <div style={{ position:'absolute', left:120, bottom:55, right:120, borderTop:'1px solid '+c.line, paddingTop:22, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:21, letterSpacing:2.1, color:c.olive }}>
    <span>JJP · DESIGN ANNUAL 2026</span>
    <span>{String(current).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
  </div>;
}
function Frame({ eyebrow, children, dark=false }: { eyebrow: string; children: ReactNode; dark?: boolean }) {
  return <div style={{ ...pageRoot, background:dark?c.olive:'var(--osd-bg)', color:dark?c.paper:'var(--osd-text)' }}>
    <div style={{ position:'absolute', left:120, top:66, fontSize:22, letterSpacing:4, fontWeight:600, color:dark?'#F4F2EB':c.olive }}>{eyebrow}</div>
    <div style={{ position:'absolute', left:120, right:120, top:114, height:1, background:dark?'#A9B39D':c.line }} />
    {children}
    {!dark && <Footer />}
    {dark && <div style={{ position:'absolute', left:120,bottom:55,right:120,borderTop:'1px solid #A9B39D',paddingTop:22,fontSize:21,letterSpacing:2,color:c.paper }}>JJP · DESIGN ANNUAL 2026</div>}
  </div>;
}
function Head({ lines, size=100, color=c.ink }: {lines:readonly string[];size?:number;color?:string}) {
  return <h1 style={{fontFamily:serif,fontWeight:600,letterSpacing:'-0.055em',fontSize:size,lineHeight:1.3,margin:0,color}}>
    {lines.map((line,i)=><span key={i} data-jjp-line style={{display:'block',whiteSpace:'nowrap'}}>{line}</span>)}
  </h1>;
}
function CopyLines({lines,size=36,color=c.ink}: {lines:readonly string[],size?:number,color?:string}){
  return <p style={{margin:0,fontSize:size,lineHeight:1.72,letterSpacing:0.4,color}}>
    {lines.map((line,i)=><span key={i} data-jjp-line style={{display:'block',whiteSpace:'nowrap'}}>{line}</span>)}
  </p>;
}
const Mark = ({ text }: {text:string}) => <span style={{fontSize:22,letterSpacing:3,color:c.olive,fontWeight:600}}>{text}</span>;
const Cover:Page=()=> <Frame eyebrow="ANNUAL EDITORIAL PROPOSAL / 2026">
  <div style={{position:'absolute',left:124,top:260,width:1050,zIndex:2}}>
    <Mark text="ARCHITECTURE OF CARE" />
    <div style={{height:42}}/><Head lines={['照護的建築']} size={148}/>
    <div style={{width:180,height:4,background:c.olive,marginTop:56,marginBottom:45}}/>
    <CopyLines size={37} color={c.olive} lines={['從醫療、長照到全齡共生','的空間實踐']}/>
  </div>
  <div style={{position:'absolute',right:-178,top:180,width:890,height:890,border:'1px solid '+c.line,borderRadius:'50%'}}/>
  <div style={{position:'absolute',right:-40,top:322,width:610,height:610,border:'1px solid '+c.line,borderRadius:'50%'}}/>
  <div style={{position:'absolute',right:105,top:480,width:310,height:310,border:'2px solid '+c.olive,borderRadius:'50%'}}/>
  <div style={{position:'absolute',right:230,top:602,width:66,height:66,background:c.olive,borderRadius:'50%'}}/>
</Frame>;
type EssayText={heading:string;lines:readonly string[]};
function Essay({eyebrow,title,blocks}:{eyebrow:string,title:readonly string[],blocks:readonly [EssayText,EssayText]}){
  return <Frame eyebrow={eyebrow}>
    <div style={{position:'absolute',left:124,top:244,width:740}}><Head lines={title} size={91}/><div style={{height:4,width:110,background:c.olive,marginTop:58}}/></div>
    <div style={{position:'absolute',left:995,top:250,width:800}}>
      {blocks.map((b,i)=><div key={i} style={{paddingTop:24,borderTop:'1px solid '+c.line,marginBottom:78}}>
        <div style={{fontSize:27,color:c.olive,fontWeight:600,marginBottom:28,letterSpacing:3}}>{b.heading}</div>
        <CopyLines lines={b.lines} size={35}/>
      </div>)}
    </div>
  </Frame>;
}
function SectionPage(){return <Frame eyebrow="01 / EDITORIAL PERSPECTIVE" dark>
  <div style={{position:'absolute',left:120,top:284}}>
    <div style={{fontSize:28,letterSpacing:5,opacity:0.7,marginBottom:40}}>CARE BEYOND HEALTHCARE</div>
    <Head lines={['照護不只','發生在醫院']} size={119} color={c.paper}/>
    <div style={{fontSize:36,marginTop:66,lineHeight:1.8,color:'#E4E9DE'}}>從治療、健康促進，到全齡生活與社會共融。</div>
  </div>
  <div style={{position:'absolute',right:130,top:258,width:410,height:410,borderRadius:'50%',border:'2px solid #BAC5AF'}} />
  <div style={{position:'absolute',right:210,top:340,width:245,height:245,borderRadius:'50%',border:'2px solid #BAC5AF'}} />
  <div style={{position:'absolute',right:282,top:409,width:100,height:100,borderRadius:'50%',background:'#BAC5AF'}} />
</Frame>}
function Circle({level,label,caption}:{level:1|2|3,label:string,caption:string}){const radii=[82,140,198];return <div style={{width:510,display:'flex',flexDirection:'column',alignItems:'center'}}>
  <svg viewBox="0 0 480 480" width="440" height="440" role="img" aria-label={label+'照護尺度同心圓示意'}>
    {radii.slice(0,level).reverse().map((r,i)=><circle key={r} cx="240" cy="240" r={r} fill={i===0?'#DDE2D5':'none'} stroke={c.olive} strokeWidth={r===radii[level-1]?3:2}/>)}
    <circle cx="240" cy="240" r="31" fill={c.olive}/>
    <path d="M240 25V455M25 240H455" stroke={c.line} strokeWidth="1" strokeDasharray="4 12"/>
  </svg>
  <div style={{fontFamily:serif,fontSize:54,marginTop:5,color:c.ink}}>{label}</div>
  <div style={{fontSize:27,color:c.olive,marginTop:12}}>{caption}</div>
</div>}
function ScalePage(){return <Frame eyebrow="02 / CARE SCALES">
  <div style={{position:'absolute',left:120,top:198}}><Head lines={['照護的尺度']} size={92}/></div>
  <div style={{position:'absolute',left:135,top:392,width:1650,display:'flex',justifyContent:'space-between'}}>
    <Circle level={1} label="身體" caption="醫療照護・健康促進"/>
    <Circle level={2} label="生活" caption="長照與全齡日常"/>
    <Circle level={3} label="社會" caption="社區連結・社會共融"/>
  </div>
</Frame>}
const cases=[
  {name:'北醫第一醫療大樓',lines:['北醫第一','醫療大樓'],category:'01 / MEDICAL & CITY',caption:'TAIPEI MEDICAL UNIVERSITY',body:['醫療建築不只是治療的容器，','也涉及城市介面、公共性與','進出醫療空間的感受。'],hint:'北醫第一醫療大樓：請提供專案正式建築照片或設計透視圖'},
  {name:'佳里奇美醫院',lines:['佳里奇美醫院'],category:'02 / HEALING SPACE',caption:'CHIMEI HOSPITAL',body:['以人、自然與光線的交織，','探索明亮、可辨識並具有','療癒感的醫療公共空間。'],hint:'佳里奇美醫院：請提供正式入口或中庭設計透視圖'},
  {name:'門諾健康管理大樓',lines:['門諾健康','管理大樓'],category:'03 / HEALTH & PREVENTION',caption:'MENNONITE HEALTH',body:['從疾病治療走向健康管理，','以預防為導向重新思考','健康空間與日常生活的關係。'],hint:'門諾健康管理大樓：請提供正式外觀或健康管理空間照片'},
  {name:'東基樂齡長照園區',lines:['東基樂齡','長照園區'],category:'04 / SENIOR LIVING',caption:'TAITUNG SENIOR LIVING',body:['將長照環境視為生活場所，','關注高齡者的尊嚴與陪伴，','以及日常節奏與空間感受。'],hint:'東基樂齡長照園區：請提供木構造或生活空間照片'},
  {name:'三芝日勝生',lines:['三芝日勝生'],category:'05 / UNIVERSAL LIVING',caption:'UNIVERSAL HOUSING',body:['全齡通用的居住環境，','讓建築因應生命階段的改變。','獎項名稱及資料待出版核對。'],hint:'三芝日勝生：請提供全齡住宅實景或設計透視圖'},
  {name:'育成社福永續庇護園區',lines:['育成社福永續','庇護園區'],category:'06 / SOCIAL INCLUSION',caption:'YUCHENG SOCIAL WELFARE',body:['將社會支持與空間再利用結合，','思考工作、陪伴、社區交流，','以及永續構造的可能性。'],hint:'育成社福永續庇護園區：請提供高架橋下園區照片'},
] as const;
function MatrixPage(){return <Frame eyebrow="03 / PROJECT CURATION">
  <div style={{position:'absolute',left:124,top:198}}><Head lines={['JJP 的六種照護實踐']} size={88}/></div>
  <div style={{position:'absolute',left:124,top:434,right:124,display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:23}}>
    {cases.map((p,i)=><div key={p.name} style={{borderTop:'2px solid '+c.olive,background:i%2===0?c.faint:'transparent',height:200,padding:'24px 24px 0'}}>
      <div style={{fontSize:25,color:c.olive,letterSpacing:3,marginBottom:24}}>{String(i+1).padStart(2,'0')} / 06</div>
      <div style={{fontFamily:serif,fontSize:40,whiteSpace:'nowrap'}}>{p.name}</div>
      <div style={{fontSize:20,letterSpacing:2,color:c.soft,marginTop:19}}>{p.caption}</div>
    </div>)}
  </div>
</Frame>}
function CasePage({data}:{data:typeof cases[number]}){return <Frame eyebrow={data.category}>
  <div style={{position:'absolute',left:120,top:216,width:1030,height:630,background:c.pale,border:'1px solid '+c.line}}>
    <div style={{position:'absolute',inset:35,border:'1px dashed '+c.soft,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <ImagePlaceholder hint={data.hint} width={956} height={550}/>
    </div>
    <div style={{position:'absolute',left:38,bottom:-43,fontSize:20,letterSpacing:2,color:c.olive}}>PHOTO / RENDERING TO BE PROVIDED · JJP ORIGINAL ONLY</div>
  </div>
  <div style={{position:'absolute',left:1210,top:226,width:590}}>
    <Mark text={data.caption}/>
    <div style={{height:52}}/><Head lines={data.lines} size={69}/>
    <div style={{height:4,width:115,background:c.olive,marginTop:50,marginBottom:55}}/>
    <CopyLines lines={data.body} size={29}/>
    <div style={{marginTop:86,fontSize:23,color:c.olive,letterSpacing:3}}>IMAGE ASSET PENDING</div>
  </div>
</Frame>}
function PrinciplesPage(){return <Frame eyebrow="04 / DESIGN PRINCIPLES">
  <div style={{position:'absolute',left:124,top:190}}><Head lines={['從作品提煉','照護設計原則']} size={86}/></div>
  <div style={{position:'absolute',left:810,top:224,right:123}}>
    <div style={{display:'grid',gridTemplateColumns:'240px 1fr 1fr',borderTop:'2px solid '+c.olive,padding:'23px 0',gap:22,fontSize:26,color:c.olive}}>
      <div>PRINCIPLE</div><div>個體的照護</div><div>群體的照護</div>
    </div>
    {[
      ['尊嚴 Dignity','自主與安全感','平等與可親近'],
      ['連結 Connection','家人與照護者','社區與公共生活'],
      ['自然 Nature','採光與景觀','戶外活動與生態'],
      ['適應 Adaptability','使用需求變化','全齡與長期彈性']
    ].map((row,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'240px 1fr 1fr',gap:22,padding:'37px 0',borderTop:'1px solid '+c.line,fontSize:26,lineHeight:1.4}}>
      <div style={{color:c.olive,fontWeight:600}}>{row[0]}</div><div>{row[1]}</div><div>{row[2]}</div>
    </div>)}
  </div>
</Frame>}
function ClosingPage(){return <Frame eyebrow="2026 / JJP DESIGN ANNUAL" dark>
  <div style={{position:'absolute',left:120,top:294}}>
    <div style={{fontSize:26,letterSpacing:5,opacity:0.8,marginBottom:40}}>ARCHITECTURE AS AN ACT OF CARE</div>
    <Head lines={['建築，作為一種','照護的實踐']} size={111} color={c.paper}/>
    <div style={{fontSize:32,marginTop:65,color:'#E5EBDD'}}>照護的建築 · 策展提案初稿</div>
  </div>
  <div style={{position:'absolute',right:130,bottom:155,width:270,height:270,border:'2px solid #AFC1A8',borderRadius:'50%'}}/>
  <div style={{position:'absolute',right:211,bottom:237,width:105,height:105,background:'#AFC1A8',borderRadius:'50%'}}/>
</Frame>};

const P02:Page=()=> <Essay eyebrow="EDITORIAL / CONTINUITY" title={['從塑山者','到照護的建築']} blocks={[
  {heading:content[1].blocks[0].heading, lines:['從 2025「塑山者」對建築與環境','的關注，轉向人在生命不同階段','的健康、尊嚴與生活。']},
  {heading:content[1].blocks[1].heading, lines:['年刊不只是醫院與長照作品的集合，','而是透過 JJP 的實踐，探索照護','如何成為一種建築態度。']}
]}/>;
const P03:Page=()=> <Essay eyebrow="EDITORIAL / THE QUESTION" title={['高齡社會的','空間提問']} blocks={[
  {heading:content[2].blocks[0].heading, lines:['高齡化、慢性病照護與健康管理，','以及家庭和社區支持模式，','正改變建築的使用情境。']},
  {heading:content[2].blocks[1].heading, lines:['從單一機能的設施，走向兼顧','身體、日常、心理與社會關係','的場所。']}
]}/>;
const P14:Page=()=> <Essay eyebrow="05 / PUBLICATION ROADMAP" title={['年刊編輯','與資料募集']} blocks={[
  {heading:content[13].blocks[0].heading, lines:['年度主論述、專題訪談、六個案例，','並以跨案例設計方法與照護空間','圖解連結整本年刊。']},
  {heading:content[13].blocks[1].heading, lines:['經授權建築攝影及圖面、專案故事，','可核對的成果資訊，以及人物','與使用情境紀錄。']}
]}/>;
export const meta: SlideMeta = {
  title: '2026 JJP 設計年刊｜照護的建築',
  createdAt: '2026-11-25T14:50:03.438Z',
  theme: 'jjp-architecture',
};
export default [
  Cover, P02, P03, SectionPage, ScalePage, MatrixPage,
  ()=> <CasePage data={cases[0]}/>, ()=> <CasePage data={cases[1]}/>,
  ()=> <CasePage data={cases[2]}/>, ()=> <CasePage data={cases[3]}/>,
  ()=> <CasePage data={cases[4]}/>, ()=> <CasePage data={cases[5]}/>,
  PrinciplesPage, P14, ClosingPage,
] satisfies Page[];
