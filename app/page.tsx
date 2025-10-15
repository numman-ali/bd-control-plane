export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            BD Control Plane
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl">
            Mission control for all your BD-tracked repositories.
            Visualize dependencies, track progress, and manage issues across your entire workspace.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">🗂️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Multi-Repo View</h3>
              <p className="text-sm text-slate-400">
                Aggregate and view issues from all your BD-tracked repositories in one place
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition-colors">
              <div className="text-4xl mb-4">🕸️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Dependency Graphs</h3>
              <p className="text-sm text-slate-400">
                Interactive visualization of issue dependencies and blockers
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 hover:border-green-500 transition-colors">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics & Kanban</h3>
              <p className="text-sm text-slate-400">
                Charts, metrics, and kanban boards to track your team's progress
              </p>
            </div>
          </div>

          <div className="mt-16 px-6 py-4 bg-slate-800/30 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-sm">
              🚧 <span className="text-white font-semibold">Under Construction</span> - Building the future of BD workflow management
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
