// 只从一条用户消息中提取事实，不调用 LLM，只用正则（方案B - 纯正则增强版）
export function extractFactsFromMessage(content: string) {
  const facts: Record<string, string | number> = {};
  const text = content.toLowerCase();
  const normalized = content.replace(/\s+/g, ' ').trim();

  const cleanValue = (value: string | undefined) =>
    value?.replace(/[\s,，。.;;]+$/g, '').trim();

  // ---- 用户资料（原有） ----
  // 姓名：增加“全名”、“本人姓名”、“full name”，并清洗常见称谓
  const nameMatch = normalized.match(
    /(?:\b(?:my\s+)?(?:full\s+)?name\s+(?:is|:)\s*|全名[：:]\s*|本人姓名[：:]\s*|姓名[：:]\s*|我(?:的)?名字(?:叫|是)|我叫|我是)[\s:：]*([^,，。.;;]+?)(?=\s*(?:,|，|\.|。|;|；|$|与|和|及|、))/i
  );
  if (nameMatch) {
    let name = cleanValue(nameMatch[1]);
    // 内联清洗称谓
    if (name) {
      name = name
        .replace(/\s*(?:先生|女士|小姐|博士|醫生|医生|教授|老師|老师|sir|madam|mr|mrs|ms|dr)\s*$/i, '')
        .replace(/^\s*(?:我叫|我是|姓名是|名字是)\s*/i, '')
        .trim();
    }
    if (name && name.length > 1) facts.user_name = name;
  }

  // 出生日期：增加更多格式（点号、英文月名、中文年月日、互换）
  const birthMatch = normalized.match(
    /(?:出生日期|生日|出生|date\s+of\s+birth|birthdate|dob|born\s+on|born)\s*(?:[：:]\s*|是\s*)?\s*(\d{4}[-\/.]\d{1,2}[-\/.]\d{1,2}|\d{1,2}[-\/.]\d{1,2}[-\/.]\d{4}|\d{4}年\d{1,2}月\d{1,2}日|\d{1,2}\s+[a-z]+\s+\d{4}|[a-z]+\s+\d{1,2},?\s+\d{4})/i
  );
  if (birthMatch) {
    let dateStr = birthMatch[1];
    // 内联处理英文月名
    const monthMap: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04',
      may: '05', jun: '06', jul: '07', aug: '08',
      sep: '09', oct: '10', nov: '11', dec: '12'
    };
    for (const [key, val] of Object.entries(monthMap)) {
      if (dateStr.toLowerCase().includes(key)) {
        const parts = dateStr.split(/\s*,\s*|\s+/);
        let day = '';
        const month = val;
        let year = '';
        for (const p of parts) {
          if (/^\d{1,2}$/.test(p)) day = p.padStart(2, '0');
          if (/^\d{4}$/.test(p)) year = p;
        }
        dateStr = `${year}-${month}-${day}`;
        break;
      }
    }
    if (dateStr.includes('年')) {
      dateStr = dateStr.replace(/年/, '-').replace(/月/, '-').replace(/日/, '');
    }
    if (dateStr.includes('.')) dateStr = dateStr.replace(/\./g, '/');
    const parts = dateStr.split(/[-\/]/);
    if (parts.length === 3) {
      const [a, b, c] = parts;
      if (a.length === 4 && b.length <= 2 && c.length <= 2) {
        dateStr = `${a}-${b.padStart(2,'0')}-${c.padStart(2,'0')}`;
      } else if (c.length === 4 && a.length <= 2 && b.length <= 2) {
        dateStr = `${c}-${a.padStart(2,'0')}-${b.padStart(2,'0')}`;
      }
    }
    facts.birthdate = dateStr;
  }

  // 电话：增加“手提”、“联络电话”、“联系电话”，支持括号、空格
  const phoneMatch = normalized.match(
    /(?:电话|手机|手提|phone(?:\s+number)?|mobile(?:\s+number)?|联络电话|联系电话)\s*(?:[：:]\s*|是\s*)?\s*((?:\+?\d{1,3}[\s\-]?)?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{4})/
  );
  if (phoneMatch) {
    const phone = phoneMatch[1].replace(/[\s\-()]/g, '');
    if (phone.length >= 7 && phone.length <= 15) facts.phone = phone;
  }

  // ---- 遗嘱相关（原有） ----
  // Religion：增加佛教、道教、印度教、犹太教、其他
  if (/\bmuslim\b|伊斯兰|穆斯林/.test(text)) facts.religion = 'Muslim';
  else if (/\bchristian\b|基督教|基督徒|天主教/.test(text)) facts.religion = 'Christian';
  else if (/\bbuddhism\b|佛教|佛/.test(text)) facts.religion = 'Buddhist';
  else if (/\bhindu\b|印度教/.test(text)) facts.religion = 'Hindu';
  else if (/\bjewish\b|犹太教/.test(text)) facts.religion = 'Jewish';
  else if (/\btaoism\b|道教/.test(text)) facts.religion = 'Taoist';
  else if (/\bnot\s+religious\b|non[- ]?religious|no\s+religion|atheist|不信教|无宗教|非宗教/.test(text)) facts.religion = 'Non-religious';
  else if (/\bother\b|其他/.test(text)) facts.religion = 'Other';

  // Marital status：增加离异、丧偶、分居、同居、民事结合
  if (/\bmarried\b|已婚/.test(text)) facts.marital_status = 'Married';
  else if (/\bsingle\b|未婚/.test(text)) facts.marital_status = 'Single';
  else if (/\bdivorc|离婚|离异/.test(text)) facts.marital_status = 'Divorced';
  else if (/\bwidow|丧偶/.test(text)) facts.marital_status = 'Widowed';
  else if (/\bseparated|分居/.test(text)) facts.marital_status = 'Separated';
  else if (/\bcohabiting|同居/.test(text)) facts.marital_status = 'Cohabiting';
  else if (/\bcivil\s+partnership|民事结合/.test(text)) facts.marital_status = 'Civil Partnership';

  // Dependents count：增加中文数字（一、二、三...）
  const depMatch = text.match(/(\d{1,2})\s*(?:dependents|children|child|kids?|people|person|个孩子|人|位|名|個)/);
  if (depMatch) {
    facts.dependents_count = Number(depMatch[1]);
  } else {
    const chineseNumMap: Record<string, number> = { '一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };
    for (const [key, val] of Object.entries(chineseNumMap)) {
      if (new RegExp(`${key}\\s*(?:个孩子|位|人|名|個|子女|孩子)`).test(text)) {
        facts.dependents_count = val;
        break;
      }
    }
  }

  // Dependents label
  const depLabelMatch = normalized.match(/dependents?\s*(?:[：:]\s*|是\s*)(.+?)(?=\s*(?:\.|,|，|、|。|$|\band\b))/i);
  if (depLabelMatch) {
    const label = cleanValue(depLabelMatch[1]);
    if (label && !/^\d+$/.test(label)) facts.dependents_label = label;
  }

  // Executor（原有只提取姓名，保留）
  const execMatch = normalized.match(/(?:executor|执行人|遗嘱执行人)\s*(?:[：:]\s*|是\s*|为\s*|指定\s*)(?:is\s+)?([a-z\u4e00-\u9fff\s\-]{1,40}?)(?=\s*(?:\.|,|，|、|。|\band\b|$))/i);
  if (execMatch) {
    let name = cleanValue(execMatch[1])?.split(/\band\b/)[0].trim();
    if (name) {
      // 内联清洗称谓
      name = name
        .replace(/\s*(?:先生|女士|小姐|博士|醫生|医生|教授|老師|老师|sir|madam|mr|mrs|ms|dr)\s*$/i, '')
        .trim();
    }
    if (name && name.length > 1) facts.executor_name = name;
  }

  // Guardian（原有只提取姓名，保留）
  const guardMatch = normalized.match(/(?:guardian|监护人|法定监护人)\s*(?:[：:]\s*|是\s*|为\s*|指定\s*)(?:is\s+)?([a-z\u4e00-\u9fff\s\-]{1,40}?)(?=\s*(?:\.|,|，|、|。|\band\b|$))/i);
  if (guardMatch) {
    let name = cleanValue(guardMatch[1])?.split(/\band\b/)[0].trim();
    if (name) {
      name = name
        .replace(/\s*(?:先生|女士|小姐|博士|醫生|医生|教授|老師|老师|sir|madam|mr|mrs|ms|dr)\s*$/i, '')
        .trim();
    }
    if (name && name.length > 1) facts.guardian_name = name;
  }

  const identityMatch = normalized.match(
  /(?:identity\s*(?:number|id)|id\s*number|nric|mykad|kad\s+pengenalan|passport(?:\s*number)?|hkid|身份证|身份證)\s*(?:[：:]|\bis\b|是)?\s*([A-Za-z0-9][A-Za-z0-9\-()（）]*)/i
);

if (identityMatch) {
  const identityNumber =
    cleanValue(identityMatch[1])?.replace(/[\s()（）]/g, '') || '';

  if (identityNumber) {
    facts.identity_number = identityNumber;

    if (/hkid|香港身份证|身份證/i.test(normalized)) {
      facts.identity_type = 'HKID';
      facts.identity_country = 'HK';
    } else if (/(?:nric|mykad|kad\s+pengenalan)/i.test(normalized)) {
      facts.identity_type = 'NRIC';
      facts.identity_country = 'MY';
    } else if (/passport/i.test(normalized)) {
      facts.identity_type = 'Passport';
    }
  }
}

  // 2. 资产（整体描述）：增加“我有”、“我拥有”、“我名下有”
  let assetText = '';
  const assetMatch = normalized.match(/(?:资产|assets?|财产|名下(?:资产|物业)|拥有的(?:资产|物业))\s*(?:[：:]\s*|包括|有|是|包含|为)\s*(.+?)(?=(?:负债|债务|受益人|执行人|监护人|$))/i);
  if (assetMatch) assetText = assetMatch[1];
  if (!assetText) {
    const haveMatch = normalized.match(/(?:我有|我拥有|我名下有|我持有|拥有)\s*(.+?)(?=(?:负债|债务|受益人|执行人|监护人|$))/i);
    if (haveMatch) {
      const candidate = haveMatch[1];
      if (!/(?:已婚|未婚|离婚|孩子|子女|受益人|执行人|监护人)/i.test(candidate)) {
        assetText = candidate;
      }
    }
  }
  if (assetText) {
    const assets = cleanValue(assetText);
    if (assets && assets.length > 1) facts.assets = assets;
  }

  // 3. 负债（整体描述）：增加“我欠了”、“欠银行”
  let liabilityText = '';
  const liabilityMatch = normalized.match(/(?:负债|债务|liabilit(?:y|ies)|欠款|所欠|按揭|贷款|借贷)\s*(?:[：:]\s*|包括|有|是|包含|为)?\s*(.+?)(?=(?:资产|受益人|执行人|监护人|$))/i);
  if (liabilityMatch) liabilityText = liabilityMatch[1];
  if (!liabilityText) {
    const oweMatch = normalized.match(/(?:我欠了|我还欠|我负债|欠银行|欠债)\s*(.+?)(?=(?:受益人|执行人|监护人|$))/i);
    if (oweMatch) liabilityText = oweMatch[1];
  }
  if (liabilityText) {
    const liabilities = cleanValue(liabilityText);
    if (liabilities && liabilities.length > 1) facts.liabilities = liabilities;
  }

  // 4. 受益人完整信息：支持多受益人拆分（取第一个），并内联处理关系、份额
  const benMatch = normalized.match(/(?:受益人|beneficiary|受益方|继承者|受惠人)\s*(?:[：:]\s*|是|有|为|包括|指定|委任)\s*(.+?)(?=(?:执行人|监护人|$))/i);
  if (benMatch) {
    const benRaw = cleanValue(benMatch[1]);
    if (benRaw) {
      // 拆分（取第一个）
      const firstBen = benRaw.split(/\s*(?:和|与|及|、|,|and|&)\s*/)[0];
      if (firstBen) {
        facts.beneficiary_raw = firstBen;
        // 姓名
        const nameInBen = firstBen.match(/([a-z\u4e00-\u9fff\s\-]{2,40})/i);
        if (nameInBen) {
          let name = cleanValue(nameInBen[1]);
          if (name) {
            name = name
              .replace(/\s*(?:先生|女士|小姐|博士|醫生|医生|教授|老師|老师|sir|madam|mr|mrs|ms|dr)\s*$/i, '')
              .trim();
          }
          if (name) facts.beneficiary_name = name;
        }
        // ID
        const idInBen = firstBen.match(/([a-zA-Z]\d{6}\s*[\(（]?\s*\d\s*[\)）]?)/);
        if (idInBen) {
          const id = cleanValue(idInBen[1])?.replace(/[\s()（）]/g, '');
          if (id) facts.beneficiary_id = id;
        }
        // 关系（内联映射）
        const relInBen = firstBen.match(/(?:关系|relationship|与.*?关系|系)\s*(?:[：:]\s*|是)?\s*(.+?)(?=(?:份额|%|$|，|,|的|，))/i);
        let relationship = '';
        if (relInBen) {
          relationship = cleanValue(relInBen[1]) || '';
          // 简单内联映射
          const relMap: Record<string, string> = {
            '老婆':'配偶', '老公':'配偶', '太太':'配偶', '妻子':'配偶', '丈夫':'配偶',
            '女朋友':'伴侣', '男朋友':'伴侣', '未婚妻':'未婚伴侣', '未婚夫':'未婚伴侣',
            '仔':'儿子', '囝':'儿子', '囡':'女儿', '儿子':'儿子', '女儿':'女儿',
            '阿仔':'儿子', '阿女':'女儿', '大佬':'兄弟', '细佬':'兄弟',
            '家姐':'姐妹', '阿妹':'姐妹', '哥哥':'兄弟', '弟弟':'兄弟',
            '姐姐':'姐妹', '妹妹':'姐妹', '爸爸':'父亲', '妈妈':'母亲',
            '父亲':'父亲', '母亲':'母亲', '老豆':'父亲', '老妈子':'母亲',
            '朋友':'朋友', '好友':'朋友', '兄弟':'兄弟', '姐妹':'姐妹'
          };
          for (const [key, val] of Object.entries(relMap)) {
            if (relationship.includes(key)) { relationship = val; break; }
          }
        } else {
          // 尝试从称谓推断
          const relMap: Record<string, string> = {
            '老婆':'配偶', '老公':'配偶', '太太':'配偶', '妻子':'配偶', '丈夫':'配偶',
            '仔':'儿子', '囝':'儿子', '囡':'女儿', '儿子':'儿子', '女儿':'女儿',
            '阿仔':'儿子', '阿女':'女儿', '大佬':'兄弟', '细佬':'兄弟',
            '家姐':'姐妹', '阿妹':'姐妹', '哥哥':'兄弟', '弟弟':'兄弟',
            '姐姐':'姐妹', '妹妹':'姐妹', '爸爸':'父亲', '妈妈':'母亲',
            '父亲':'父亲', '母亲':'母亲', '老豆':'父亲', '老妈子':'母亲'
          };
          for (const [key, val] of Object.entries(relMap)) {
            if (firstBen.includes(key)) { relationship = val; break; }
          }
        }
        if (relationship) facts.beneficiary_relationship = relationship;
        // 份额（支持 "全部"、"一半" 等）
        let shareVal: number | null = null;
        const sharePercent = firstBen.match(/(\d+)\s*%/);
        if (sharePercent) shareVal = Number(sharePercent[1]);
        else if (/(?:全部|所有|全数|全部份额)/i.test(firstBen)) shareVal = 100;
        else if (/一半/i.test(firstBen)) shareVal = 50;
        else if (/三分一|1\/3/i.test(firstBen)) shareVal = 33.33;
        else if (/四分一|1\/4/i.test(firstBen)) shareVal = 25;
        else if (/三分之二|2\/3/i.test(firstBen)) shareVal = 66.67;
        if (shareVal !== null) facts.beneficiary_share = Math.round(shareVal * 100) / 100;
      }
    }
  }

  // 5. 执行人完整信息（补充 ID 和关系）
  const execFullMatch = normalized.match(/(?:executor|执行人|遗嘱执行人)\s*(?:[：:]\s*|是|有|为|指定|委任|名叫)\s*(.+?)(?=(?:监护人|$))/i);
  if (execFullMatch) {
    const execText = cleanValue(execFullMatch[1]);
    if (execText) {
      facts.executor_raw = execText;
      const nameInExec = execText.match(/([a-z\u4e00-\u9fff\s\-]{2,40})/i);
      if (nameInExec) {
        let name = cleanValue(nameInExec[1]);
        if (name) {
          name = name
            .replace(/\s*(?:先生|女士|小姐|博士|醫生|医生|教授|老師|老师|sir|madam|mr|mrs|ms|dr)\s*$/i, '')
            .trim();
        }
        if (name) facts.executor_name = name;
      }
      const idInExec = execText.match(/([a-zA-Z]\d{6}\s*[\(（]?\s*\d\s*[\)）]?)/);
      if (idInExec) {
        const id = cleanValue(idInExec[1])?.replace(/[\s()（）]/g, '');
        if (id) facts.executor_id = id;
      }
      const relInExec = execText.match(/(?:关系|relationship|与.*?关系)\s*(?:[：:]\s*|是)?\s*(.+?)(?=$|，|,|的|和|与|及)/i);
      let relationship = '';
      if (relInExec) {
        relationship = cleanValue(relInExec[1]) || '';
        const relMap: Record<string, string> = {
          '老婆':'配偶', '老公':'配偶', '太太':'配偶', '妻子':'配偶', '丈夫':'配偶',
          '仔':'儿子', '囝':'儿子', '囡':'女儿', '儿子':'儿子', '女儿':'女儿',
          '阿仔':'儿子', '阿女':'女儿', '大佬':'兄弟', '细佬':'兄弟',
          '家姐':'姐妹', '阿妹':'姐妹', '哥哥':'兄弟', '弟弟':'兄弟',
          '姐姐':'姐妹', '妹妹':'姐妹', '爸爸':'父亲', '妈妈':'母亲',
          '父亲':'父亲', '母亲':'母亲', '老豆':'父亲', '老妈子':'母亲'
        };
        for (const [key, val] of Object.entries(relMap)) {
          if (relationship.includes(key)) { relationship = val; break; }
        }
      } else {
        const relMap: Record<string, string> = {
          '老婆':'配偶', '老公':'配偶', '太太':'配偶', '妻子':'配偶', '丈夫':'配偶',
          '仔':'儿子', '囝':'儿子', '囡':'女儿', '儿子':'儿子', '女儿':'女儿',
          '阿仔':'儿子', '阿女':'女儿', '大佬':'兄弟', '细佬':'兄弟',
          '家姐':'姐妹', '阿妹':'姐妹', '哥哥':'兄弟', '弟弟':'兄弟',
          '姐姐':'姐妹', '妹妹':'姐妹', '爸爸':'父亲', '妈妈':'母亲',
          '父亲':'父亲', '母亲':'母亲', '老豆':'父亲', '老妈子':'母亲'
        };
        for (const [key, val] of Object.entries(relMap)) {
          if (execText.includes(key)) { relationship = val; break; }
        }
      }
      if (relationship) facts.executor_relationship = relationship;
    }
  }

  // 6. 监护人完整信息（补充 ID 和关系）
  const guardFullMatch = normalized.match(/(?:guardian|监护人|法定监护人)\s*(?:[：:]\s*|是|有|为|指定|委任|名叫)\s*(.+?)(?=$)/i);
  if (guardFullMatch) {
    const guardText = cleanValue(guardFullMatch[1]);
    if (guardText) {
      facts.guardian_raw = guardText;
      const nameInGuard = guardText.match(/([a-z\u4e00-\u9fff\s\-]{2,40})/i);
      if (nameInGuard) {
        let name = cleanValue(nameInGuard[1]);
        if (name) {
          name = name
            .replace(/\s*(?:先生|女士|小姐|博士|醫生|医生|教授|老師|老师|sir|madam|mr|mrs|ms|dr)\s*$/i, '')
            .trim();
        }
        if (name) facts.guardian_name = name;
      }
      const idInGuard = guardText.match(/([a-zA-Z]\d{6}\s*[\(（]?\s*\d\s*[\)）]?)/);
      if (idInGuard) {
        const id = cleanValue(idInGuard[1])?.replace(/[\s()（）]/g, '');
        if (id) facts.guardian_id = id;
      }
      const relInGuard = guardText.match(/(?:关系|relationship|与.*?关系)\s*(?:[：:]\s*|是)?\s*(.+?)(?=$|，|,|的|和|与|及)/i);
      let relationship = '';
      if (relInGuard) {
        relationship = cleanValue(relInGuard[1]) || '';
        const relMap: Record<string, string> = {
          '老婆':'配偶', '老公':'配偶', '太太':'配偶', '妻子':'配偶', '丈夫':'配偶',
          '仔':'儿子', '囝':'儿子', '囡':'女儿', '儿子':'儿子', '女儿':'女儿',
          '阿仔':'儿子', '阿女':'女儿', '大佬':'兄弟', '细佬':'兄弟',
          '家姐':'姐妹', '阿妹':'姐妹', '哥哥':'兄弟', '弟弟':'兄弟',
          '姐姐':'姐妹', '妹妹':'姐妹', '爸爸':'父亲', '妈妈':'母亲',
          '父亲':'父亲', '母亲':'母亲', '老豆':'父亲', '老妈子':'母亲'
        };
        for (const [key, val] of Object.entries(relMap)) {
          if (relationship.includes(key)) { relationship = val; break; }
        }
      } else {
        const relMap: Record<string, string> = {
          '老婆':'配偶', '老公':'配偶', '太太':'配偶', '妻子':'配偶', '丈夫':'配偶',
          '仔':'儿子', '囝':'儿子', '囡':'女儿', '儿子':'儿子', '女儿':'女儿',
          '阿仔':'儿子', '阿女':'女儿', '大佬':'兄弟', '细佬':'兄弟',
          '家姐':'姐妹', '阿妹':'姐妹', '哥哥':'兄弟', '弟弟':'兄弟',
          '姐姐':'姐妹', '妹妹':'姐妹', '爸爸':'父亲', '妈妈':'母亲',
          '父亲':'父亲', '母亲':'母亲', '老豆':'父亲', '老妈子':'母亲'
        };
        for (const [key, val] of Object.entries(relMap)) {
          if (guardText.includes(key)) { relationship = val; break; }
        }
      }
      if (relationship) facts.guardian_relationship = relationship;
    }
  }

  return facts;
}