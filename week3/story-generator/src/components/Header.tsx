export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Story Generator</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create characters and generate stories using LMStudio's local models
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Using Local Models
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
