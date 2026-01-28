export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">システム概要</h1>

      {/* Introduction */}
      <section className="mb-12">
        <p className="text-slate-300 text-lg leading-relaxed">
          本システムは3種類のAI APIを連携させ、ニュースデータとSNSデータを統合分析することで選挙予測を生成します。
          以下にシステムアーキテクチャと処理フローを説明します。
        </p>
      </section>

      {/* Architecture Overview */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          title="マルチエージェント構成"
          description="3つのAI APIが異なるデータソースを担当"
        />
        <FeatureCard
          title="自動バッチ処理"
          description="Cronジョブで定期的にデータを更新"
        />
        <FeatureCard
          title="構造化出力"
          description="Zodスキーマによる型安全なJSON生成"
        />
      </section>

      {/* Technical Approach */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">技術的アプローチ</h2>
        <div className="space-y-6">
          <ReasonCard
            title="データソースの多様化"
            description="単一のデータソースに依存すると偏りが生じるため、ニュース記事（Perplexity経由）とSNS投稿（Grok経由）の2系統から情報を取得し、Geminiで統合処理を行います。"
          />
          <ReasonCard
            title="並列処理による効率化"
            description="47都道府県と11比例ブロックの分析を、p-limitライブラリで同時実行数を制御しながら並列処理します。これにより約177回のAPI呼び出しを効率的に実行します。"
          />
          <ReasonCard
            title="スキーマ検証による品質担保"
            description="Geminiの出力はZodスキーマで厳密に検証され、不正なJSONは再生成を要求します。これによりフロントエンドで型安全にデータを扱えます。"
          />
        </div>
      </section>

      {/* Data Pipeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">データパイプライン</h2>
        <p className="text-slate-400 mb-6">3段階のパイプラインで予測データを生成</p>

        <div className="space-y-6">
          <StepCard
            step={1}
            title="データ収集フェーズ"
            items={[
              "Perplexity API: ニュース記事と世論調査データを検索・要約",
              "Grok API: X(Twitter)の投稿データからセンチメント分析",
            ]}
          />
          <StepCard
            step={2}
            title="統合処理フェーズ"
            items={[
              "Gemini API: 2つのデータソースを統合し構造化JSONを生成",
              "矛盾検出時はニュースデータを優先するルールを適用",
            ]}
          />
          <StepCard
            step={3}
            title="永続化フェーズ"
            items={[
              "PostgreSQL (Prisma): 予測結果をデータベースに保存",
              "Next.js: ISRでページを再生成しキャッシュを更新",
            ]}
          />
        </div>
      </section>

      {/* AI Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">AIコンポーネント構成</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <AICard
            name="Perplexity"
            role="ニュース検索エンジン"
            description="Web検索とRAGを組み合わせたAPI。最新のニュース記事と世論調査を取得し、引用元付きで要約を返します。"
            color="#00a0e9"
          />
          <AICard
            name="Grok"
            role="SNS分析エンジン"
            description="X(Twitter)データに直接アクセス可能なAPI。政治関連の投稿からリアルタイムの世論傾向を抽出します。"
            color="#1DA1F2"
          />
          <AICard
            name="Gemini"
            role="統合・構造化エンジン"
            description="複数ソースの情報を統合し、Zodスキーマに準拠したJSONを生成。議席予測と確信度を出力します。"
            color="#8E75B2"
          />
        </div>
      </section>

      {/* Technical FAQ */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">技術的なFAQ</h2>
        <div className="space-y-4">
          <FAQItem
            question="API呼び出し回数はどのくらいですか？"
            answer="1回の更新サイクルで約177回（全国1 + 都道府県47 + 比例11、各3回のAPI呼び出し）。同時実行数は5に制限しています。"
          />
          <FAQItem
            question="確信度はどのように算出されますか？"
            answer="Geminiがデータの一貫性と情報量から判定します。複数ソースが一致すればhigh、情報が少なければlowを出力します。"
          />
          <FAQItem
            question="なぜ3つのAIを使い分けるのですか？"
            answer="各APIには得意分野があります。Perplexityはニュース検索、GrokはSNSアクセス、Geminiは構造化出力に優れています。"
          />
          <FAQItem
            question="データの更新頻度は？"
            answer="Vercel Cronで1日3回（6時、12時、18時 JST）自動実行されます。手動トリガーも可能です。"
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-slate-800/50 rounded-lg p-6">
        <p className="text-slate-400 text-sm">
          本システムの予測は統計的手法に基づく参考情報であり、実際の選挙結果を保証するものではありません。
        </p>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function ReasonCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  items,
}: {
  step: number;
  title: string;
  items: string[];
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
        {step}
      </div>
      <div>
        <h3 className="font-semibold mb-2">{title}</h3>
        <ul className="text-slate-400 space-y-1">
          {items.map((item, i) => (
            <li key={i} className="text-sm">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function AICard({
  name,
  role,
  description,
  color,
}: {
  name: string;
  role: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border-t-4" style={{ borderColor: color }}>
      <div className="text-sm text-slate-400 mb-1">{role}</div>
      <h3 className="font-semibold mb-2">{name}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h4 className="font-medium mb-2">{question}</h4>
      <p className="text-slate-400 text-sm">{answer}</p>
    </div>
  );
}
