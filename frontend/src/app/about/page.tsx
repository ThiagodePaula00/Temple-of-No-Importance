export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 leading-relaxed">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">About us</h1>
      
      <div className="mt-4 space-y-6 text-var(--muted-text-color) text-base sm:text-lg">
        <p className="indent-6">
          Welcome to <strong>Temple of No Importance</strong>.
        </p>

        <p className="indent-6">
          At its core, this is a <strong>philosophy</strong> blog. Because I consider it a personal blog, I don’t restrict myself to just writing about philosophy; I also like to talk about <strong>mathematics</strong>, <strong>psychology</strong>, <strong>science</strong>, or any related subject. There’s a thought associated with Plato, which I truly believe: “Knowledge is interdisciplinary.”
        </p>

        <p className="indent-6">
          I’m not any kind of professional; I just write to practice my skills and test my knowledge. Beyond that, I desire to express what I think, genuinely believing that I can bring at least some valuable idea to the table. Anyway, keep in mind that this is a place of epiphanies and experiments.
        </p>
      </div>
    </main>
  );
}