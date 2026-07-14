export function StoryBlock({ story, attribution }: { story: string; attribution: string }) {
  return (
    <div className="mt-2 rounded border border-accent/30 bg-accent/5 p-4">
      <p className="text-sm italic">{story}</p>
      <p className="mt-2 text-xs text-ink/70">{attribution}</p>
    </div>
  )
}
