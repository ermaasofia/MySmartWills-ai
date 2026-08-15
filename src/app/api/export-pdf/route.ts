import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { getSessionUser } from '@/lib/auth';
import { isAllowedOrigin } from '@/lib/validation';
import { getPlanData, upsertPlanData } from '@/lib/plan_data_v2';
import { extractFactsFromMessage } from '@/lib/extract-facts';
import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

// ---------- Multi-language Labels ----------
const LABELS: Record<string, Record<string, string>> = {
  en: {
    name: 'Name',
    gender: 'Gender',
    address: 'Address',
    birthdate: 'Date of Birth',
    phone: 'Phone Contact',
    email: 'Email',
    identity_number: 'Identity Number',
    title: 'Will Detail Preview',
    jurisdiction: 'Jurisdiction',
    religion: 'Religion',
    marital_status: 'Marital Status',
    dependents: 'Dependents',
    assets: 'Assets',
    liabilities: 'Liabilities',
    testator: 'Testator',
    beneficiary: 'Beneficiary',
    executor: 'Executor',
    guardian: 'Guardian',
    optional_asset: 'Optional Asset',
    asset_details: 'Asset Details',
    main_beneficiary: 'Main Beneficiary (Percentage)',
    substitute_beneficiary: 'Substitute Beneficiary (Percentage)',
    all_residue: 'All Residue',
    witness: 'Witness',
    relationship: 'Relationship',
    percentage: 'Percentage',
    generated: 'Preview generated on',
    not_specified: 'Not Specified',
    payment_summary: 'Payment Summary',
    will_package: 'Will Package',
    price: 'Price',
    voucher_discount: 'Voucher Discount',
    total_amount: 'TOTAL AMOUNT',
  },
  ms: {
    name: 'Nama',
    gender: 'Jantina',
    address: 'Alamat',
    birthdate: 'Tarikh Lahir',
    phone: 'Telefon',
    email: 'Emel',
    identity_number: 'Nombor Pengenalan',
    title: 'Helai Persediaan Perancangan Wasiat',
    jurisdiction: 'Juratdiksi',
    religion: 'Agama',
    marital_status: 'Status Perkahwinan',
    dependents: 'Tanggungan',
    assets: 'Aset',
    liabilities: 'Liabiliti',
    testator: 'Pewasiat',
    beneficiary: 'Penerima Manfaat',
    executor: 'Pelaksana',
    guardian: 'Penjaga',
    optional_asset: 'Aset Pilihan',
    asset_details: 'Butiran Aset',
    main_beneficiary: 'Penerima Manfaat Utama',
    substitute_beneficiary: 'Penerima Manfaat Pengganti',
    all_residue: 'Baki Harta',
    witness: 'Saksi',
    relationship: 'Hubungan',
    percentage: 'Peratusan',
    generated: 'Pratonton dijana pada',
    not_specified: 'Tidak Dinyatakan',
    payment_summary: 'Ringkasan Pembayaran',
    will_package: 'Pakej Wasiat',
    price: 'Harga',
    voucher_discount: 'Diskaun Voucher',
    total_amount: 'JUMLAH',
  },
  zh: {
    name: '姓名',
    gender: '性别',
    address: '地址',
    birthdate: '出生日期',
    phone: '联络电话',
    email: '电邮',
    identity_number: '身份证明号码',
    title: '遗嘱规划预备表',
    jurisdiction: '管辖法律',
    religion: '宗教',
    marital_status: '婚姻状况',
    dependents: '受抚养人',
    assets: '资产',
    liabilities: '负债',
    testator: '立遗嘱人',
    beneficiary: '受益人',
    executor: '执行人',
    guardian: '监护人',
    optional_asset: '可选资产',
    asset_details: '资产详情',
    main_beneficiary: '主要受益人',
    substitute_beneficiary: '后备受益人',
    all_residue: '剩余遗产',
    witness: '见证人',
    relationship: '关系',
    percentage: '份额比例',
    generated: '生成日期',
    not_specified: '未提供',
    payment_summary: '付款摘要',
    will_package: '遗嘱套餐',
    price: '价格',
    voucher_discount: '优惠券折扣',
    total_amount: '总计',
  },
};

// ---------- API Route Handler ----------
export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req.headers.get('origin'))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, locale = 'en' } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const lang = ['en', 'ms', 'zh'].includes(locale) ? locale : 'en';
    const t = LABELS[lang];

    // Verify session ownership via Supabase
    const supabase = await createClient();
    const { data: sessionRow } = await supabase
      .from('chat_sessions')
      .select('country_code')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (!sessionRow) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    const sessionCountryCode = sessionRow.country_code ?? 'MY';

    // Pre-export extraction from recent user messages
    try {
      const { data: recentMessages } = await supabase
        .from('chat_messages')
        .select('content')
        .eq('session_id', sessionId)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(10);

      if (Array.isArray(recentMessages)) {
        for (const m of recentMessages.reverse()) {
          try {
            const extracted = extractFactsFromMessage(m.content || '');
            if (extracted && Object.keys(extracted).length > 0) {
              await upsertPlanData(
                sessionId,
                user.id,
                sessionCountryCode,
                extracted as Record<string, unknown>
              );
            }
          } catch (err) {
            console.warn('extract-and-upsert failed:', err);
          }
        }
      }
    } catch (err) {
      console.warn('Pre-export extraction failed:', err);
    }

    const planData = await getPlanData(sessionId, user.id);
    if (!planData) {
      return NextResponse.json({ error: 'No plan data found' }, { status: 404 });
    }

    const pd = planData as Record<string, unknown>;

    // Read the background image and convert to Base64
    const imagePath = path.join(process.cwd(), 'public', 'smartwills-border.png');
    let borderDataUri = '';
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      borderDataUri = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    } catch (err) {
      console.warn('Could not load border image:', err);
    }

    const isProduction = process.env.NODE_ENV === 'production';
    let browser;
    if (isProduction) {
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      let executablePath: string | undefined;

      if (
        process.env.PUPPETEER_EXECUTABLE_PATH &&
        fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)
      ) {
        executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      } else if (process.platform === 'darwin') {
        const macPaths = [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta',
        ];
        executablePath = macPaths.find((p) => fs.existsSync(p));
      } else if (process.platform === 'win32') {
        const windowsPaths = [
          'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        ];
        executablePath = windowsPaths.find((p) => fs.existsSync(p));
      } else {
        const linuxPaths = [
          '/usr/bin/google-chrome',
          '/usr/bin/google-chrome-stable',
          '/usr/bin/chromium',
          '/usr/bin/chromium-browser',
        ];
        executablePath = linuxPaths.find((p) => fs.existsSync(p));
      }

      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }

    const page = await browser.newPage();

    // Build simple HTML
    const html = buildExportHtml(pd, t, lang, borderDataUri);
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="will-detail-preview-${sessionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildExportHtml(
  data: Record<string, unknown>,
  t: Record<string, string>,
  _locale: string,
  borderDataUri: string
): string {
  const NAME = 'smartwills-border.png';
  void NAME;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(t.title)}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { background: #fff; font-family: 'Times New Roman', Times, serif; font-size: 14pt; line-height: 1.6; color: #000; }
    body { margin: 0; background: transparent; }
    .smartwills-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; background-image: url('${borderDataUri}'); background-size: 100% 100%; background-repeat: no-repeat; pointer-events: none; }
    table.print-layout { width: 100%; border-collapse: collapse; border: none; }
    table.print-layout td, table.print-layout th { padding: 0; border: none; }
    .header-space { height: 55mm; }
    .footer-space { height: 45mm; }
    .content-cell { padding: 0 25mm; }
    .document-header { margin-bottom: 6mm; text-align: center; }
    .document-title { font-size: 18pt; font-weight: 700; }
    .important-notes { margin-bottom: 6mm; font-size: 12pt; }
    .section-title { margin-bottom: 3mm; padding: 2mm 0; border-top: 1.5px solid #222; border-bottom: 1.5px solid #222; text-align: center; font-size: 16pt; font-weight: 700; }
    .detail-row { display: grid; grid-template-columns: 60mm 4mm minmax(0, 1fr); column-gap: 2mm; margin-bottom: 3mm; font-size: 14pt; }
    .detail-label { font-weight: 600; }
    .detail-colon { text-align: center; }
    .detail-value { font-weight: 400; overflow-wrap: anywhere; }
    .page-footer { position: fixed; left: 0; right: 0; bottom: 38mm; text-align: center; font-size: 9pt; color: #555; z-index: 10; }
  </style>
</head>
<body>
  <div class="smartwills-bg"></div>
  <div class="page-footer">${escapeHtml(t.generated)} ${escapeHtml(new Date().toLocaleDateString())}</div>
  <table class="print-layout">
    <thead><tr><td><div class="header-space"></div></td></tr></thead>
    <tbody>
      <tr><td class="content-cell">
        <header class="document-header"><h1 class="document-title">${escapeHtml(t.title)}</h1></header>
        <div class="important-notes">
          <strong>Important Notes:</strong>
          <ol><li>Please review all details to confirm their accuracy.</li><li>This is a preview — <strong>NOT THE FINAL WILL</strong>.</li></ol>
        </div>
        <div class="section-title">${escapeHtml(t.testator)}</div>
        ${renderField(t.name, data.user_name || data.name)}
        ${renderField(t.identity_number, data.identity_number)}
        ${renderField(t.gender, data.gender)}
        ${renderField(t.birthdate, data.birthdate)}
        ${renderField(t.phone, data.phone)}
        ${renderField(t.email, data.email)}
        ${renderField(t.religion, data.religion)}
        ${renderField(t.marital_status, data.marital_status)}
      </td></tr>
    </tbody>
    <tfoot><tr><td><div class="footer-space"></div></td></tr></tfoot>
  </table>
</body>
</html>`;
}

function renderField(label: string, value: unknown): string {
  if (value === null || value === undefined || String(value).trim() === '') return '';
  return `<div class="detail-row"><div class="detail-label">${escapeHtml(label)}</div><div class="detail-colon">:</div><div class="detail-value">${escapeHtml(String(value))}</div>`;
}
