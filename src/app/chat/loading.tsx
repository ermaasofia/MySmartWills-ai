export default function ChatLoading() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading chat...</p>
      </div>
    </div>
  );
}
