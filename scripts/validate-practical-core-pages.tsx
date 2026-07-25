import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "../src/app/page";
import LearningRoadmapPage from "../src/app/learning-roadmap/page";
import AssumptionsPage from "../src/app/assumptions/page";
import PlPage from "../src/app/pl-model/page";
import BsPage from "../src/app/bs-model/page";
import CfPage from "../src/app/cf-model/page";
import ThreeStatementsPage from "../src/app/three-statements/page";
import QualityPage from "../src/app/quality-standard/page";
import DownloadsPage from "../src/app/downloads/page";
import ExcelTemplatesPage from "../src/app/excel-templates/page";

const render = (page: () => React.ReactNode) => renderToStaticMarkup(createElement(page));
const home = render(HomePage);
const roadmap = render(LearningRoadmapPage);

for (const [name, markup] of [["home", home], ["roadmap", roadmap]] as const) {
  assert.match(markup, /東都精密工業株式会社/, `${name}: 共通案件名`);
  assert.match(markup, /08_東都精密工業_受領資料パック\.xlsx/, `${name}: 受領資料パック`);
  assert.match(markup, /09_東都精密工業_完成三表モデル\.xlsx/, `${name}: 完成モデル`);
}
assert.match(home, /資料受領から財務三表モデル完成まで/);
assert.equal((roadmap.match(/data-practical-stage="/g) ?? []).length, 8, "ロードマップは8工程");

const stagePages = [
  ["assumptions", render(AssumptionsPage), "前提条件一覧", "Downsideで売上高は減少"],
  ["pl", render(PlPage), "製品別売上高計画", "販売数量が7%増加"],
  ["bs", render(BsPage), "運転資本計算", "回転日数を55日から45日"],
  ["cf", render(CfPage), "資金余剰・不足額", "棚卸資産の増加を営業CFに加算"],
  ["three", render(ThreeStatementsPage), "統合財務三表モデル", "強制的に入れていない"],
  ["quality", render(QualityPage), "品質判定", "Not ready"],
] as const;

for (const [name, markup, output, review] of stagePages) {
  for (const expected of ["使用する受領資料", "この工程の成果物", "Excelでの実装", "確認項目", "レビュアーからの指摘例", output, review]) {
    assert.ok(markup.includes(expected), `${name}: 「${expected}」`);
  }
}

const quality = stagePages.at(-1)![1];
for (const term of ["Ready", "Ready with caveats", "Not ready", "Critical", "Major", "Minor", "指摘事項", "変更履歴"]) {
  assert.ok(quality.includes(term), `quality: ${term}`);
}

const downloads = render(DownloadsPage);
const excelTemplates = render(ExcelTemplatesPage);
for (const file of ["08_東都精密工業_受領資料パック.xlsx", "09_東都精密工業_完成三表モデル.xlsx"]) {
  assert.ok(downloads.includes(file), `downloads: ${file}`);
  assert.ok(downloads.includes(`/downloads/${file}`), `downloads href: ${file}`);
  assert.ok(excelTemplates.includes(`/downloads/${file}`), `excel templates href: ${file}`);
}

console.log("Practical core pages validation passed");
