import {
  LoopViz,
  ArrayViz,
  TwoPointerViz,
  SlidingWindowViz,
  RecursionViz,
  BinarySearchViz,
  SortingViz,
} from "../components/visualizers.jsx";

export default function Concepts() {
  return (
    <div className="fade-up">
      <h1 className="font-display text-3xl font-bold">Concepts</h1>
      <p className="text-[var(--color-ink-soft)] text-sm mt-2 mb-8 max-w-2xl leading-relaxed">
        Most of the 150 questions use one of these ideas. Play each animation,
        or step through until it clicks.
      </p>
      <div className="grid lg:grid-cols-2 gap-4">
        <LoopViz />
        <ArrayViz />
        <TwoPointerViz />
        <SlidingWindowViz />
        <RecursionViz />
        <BinarySearchViz />
        <SortingViz />
      </div>
    </div>
  );
}
