import type { Metadata } from "next";
import Link from "next/link";
import { ArticleShell } from "@/components/article-shell";
import { PracticalCasePanel } from "@/components/PracticalCasePanel";

const canonical = "https://data-lab-23.github.io/financial-modeling-lab/three-statements";

export const metadata: Metadata = {
  title: "三表モデルの作り方｜PL・BS・CFをExcelで連動する",
  description: "三表モデルをExcelで作る手順を、PL、運転資本、固定資産、借入金、CF、期末現預金、BS一致の順に、具体的な数値とセル式で解説します。",
  alternates: { canonical },
  openGraph: {
    title: "三表モデルの作り方｜PL・BS・CFをExcelで連動する",
    description: "2026年3月期の数値例と完成Excelを使い、PL・BS・CFの連動順序、現預金接続、貸借一致まで確認する実務講座。",
    url: canonical,
    type: "article",
  },
};

const sections = [
  { id: "flow", label: "三表モデルの構築順序" },
  { id: "example", label: "2026年3月期の数値例" },
  { id: "excel-formulas", label: "Excelでの数式例" },
  { id: "checks", label: "確認項目とよくある誤り" },
  { id: "download", label: "完成Excel" },
];

export default function Page() {
  return (
    <ArticleShell
      no="03"
      href="/three-statements"
      title="三表モデルの作り方――PL・BS・CFをExcelで連動する"
      lead="三表モデルは、損益計算書、貸借対照表、キャッシュ・フロー計算書を別々に作るのではなく、事業計画から現預金までを一方向の参照で接続します。東都精密工業の数値例で、構築順序、Excel数式、貸借一致まで確認します。"
      sections={sections}
    >
      <PracticalCasePanel stageId="three-statements" />

      <h2 id="flow">三表モデルはPLから作り、現預金を経てBSを閉じる</h2>
      <p>
        最初に売上高、原価、人員、販売費及び一般管理費を予測し、PLを完成させます。次に売掛金、棚卸資産、買掛金、固定資産、借入金を補助計算で更新し、当期純利益と残高増減からCFを作ります。最後にCFで算出した期末現預金をBSへ戻します。
      </p>
      <ol>
        <li>数量×単価で売上高を予測する。</li>
        <li>材料費、人件費、その他製造費から売上原価を計算する。</li>
        <li>PLで当期純利益まで計算する。</li>
        <li>回転日数で売掛金、棚卸資産、買掛金を予測する。</li>
        <li>固定資産と借入金を期首＋増減＝期末で更新する。</li>
        <li>当期純利益から営業CF、投資CF、財務CFを計算する。</li>
        <li>期末現預金をBSへ接続し、資産と負債・純資産の差額を確認する。</li>
      </ol>
      <div className="formula">
        期末現預金 = 期首現預金 + 営業CF + 投資CF + 財務CF
      </div>

      <h2 id="example">2026年3月期の数値例</h2>
      <p>
        東都精密工業のBaseでは、2025年3月期の売上高10,000百万円を起点に、販売数量4.0%増、平均販売単価1.0%増を設定します。売上高からPL、運転資本、CF、BSへ流した結果は次のとおりです。
      </p>
      <div className="data-scroll">
        <table className="data-table min-w-[680px]">
          <caption className="sr-only">東都精密工業の2026年3月期三表連動例</caption>
          <thead>
            <tr><th scope="col">項目</th><th scope="col">2025年3月期</th><th scope="col">2026年3月期</th><th scope="col">主な計算根拠</th></tr>
          </thead>
          <tbody>
            <tr><td>売上高</td><td>10,000.0</td><td>10,504.0</td><td>販売数量×平均販売単価</td></tr>
            <tr><td>EBITDA</td><td>1,500.0</td><td>1,589.6</td><td>売上総利益－販管費（減価償却費除く）</td></tr>
            <tr><td>当期純利益</td><td>819.0</td><td>890.1</td><td>税引前当期純利益－法人税等</td></tr>
            <tr><td>営業CF</td><td>1,019.0</td><td>1,079.4</td><td>当期純利益＋減価償却費－運転資本増加</td></tr>
            <tr><td>期末現預金</td><td>600.0</td><td>679.4</td><td>期首現預金＋営業CF－設備投資－借入金返済</td></tr>
            <tr><td>資産合計</td><td>7,000.0</td><td>7,585.1</td><td>現預金＋運転資本＋固定資産＋その他資産</td></tr>
            <tr><td>負債・純資産合計</td><td>7,000.0</td><td>7,585.1</td><td>買掛金＋借入金＋その他負債＋純資産</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-[#607080]">単位：百万円。端数は表示上丸めています。</p>

      <h2 id="excel-formulas">Excelでの数式例</h2>
      <p>
        予測年度を横方向へコピーできるように、入力値は前提条件シートへ集約し、各補助計算からPL・BS・CFへリンクします。完成モデルの2026年3月期はC列です。
      </p>
      <div className="formula">
        06_売上高!C12 = C8*C9<br />
        09_運転資本!C8 = 12_PL!C8/365*05_前提条件!F11<br />
        14_CF!C12 = SUM(C8:C10)<br />
        14_CF!C20 = B20+C19<br />
        13_BS!C8 = 14_CF!C20<br />
        16_チェック!C8 = ABS(13_BS!C13-13_BS!C19)
      </div>
      <p>
        売掛金と棚卸資産の増加は営業CFの減少、買掛金の増加は営業CFの増加です。固定資産は期首帳簿価額＋設備投資－減価償却費、借入金は期首残高＋新規借入－返済で更新します。
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        <Link className="callout" href="/pl-model"><strong>PLモデルの作り方</strong><br /><span className="text-sm text-[#607080]">数量・単価、原価、人員から当期純利益を予測</span></Link>
        <Link className="callout" href="/bs-model"><strong>BSモデルの作り方</strong><br /><span className="text-sm text-[#607080]">運転資本、固定資産、借入金を更新</span></Link>
        <Link className="callout" href="/cf-model"><strong>CFモデルの作り方</strong><br /><span className="text-sm text-[#607080]">当期純利益から期末現預金へ接続</span></Link>
      </div>

      <h2 id="checks">三表モデルで起きやすい誤り</h2>
      <ul>
        <li><strong>差額を現預金へ加算する：</strong>貸借は一致しますが、原因を隠すため禁止します。</li>
        <li><strong>運転資本の符号が逆になる：</strong>売掛金・棚卸資産の増加は現金流出です。</li>
        <li><strong>減価償却費を二重に控除する：</strong>PLでは費用、CFでは非資金費用として加算します。</li>
        <li><strong>利益剰余金を据え置く：</strong>前期末利益剰余金へ当期純利益を加算し、配当を控除します。</li>
        <li><strong>借入金と支払利息が循環する：</strong>計算順序を定め、教育用モデルでは期首借入金で利息を計算します。</li>
      </ul>
      <p>
        最低限、貸借一致、CFとBSの現預金一致、固定資産、借入金、利益剰余金、予測期間の数式抜けを自動確認します。詳しい判定方法は
        <Link href="/quality-standard" className="font-bold text-[#147d73]">モデル品質基準と提出可否判定</Link>
        で確認できます。
      </p>

      <h2 id="download">完成三表モデルをExcelで確認する</h2>
      <p>
        受領資料から勘定科目を対応付ける練習には受領資料パック、数式の完成形を確認する場合は5年連動済みの完成モデルを使用してください。
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/downloads/08_東都精密工業_受領資料パック.xlsx" className="button secondary">受領資料パック.xlsx</Link>
        <Link href="/downloads/09_東都精密工業_完成三表モデル.xlsx" className="button green">完成三表モデル.xlsx</Link>
      </div>
    </ArticleShell>
  );
}
