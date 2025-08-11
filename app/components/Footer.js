export default function Footer() {
  return (
    <footer className="bg-transparent mt-12">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">My Expiry</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Smart food waste prevention with AI-powered expiry tracking. Save money and reduce waste.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Features</h3>
            <div className="space-y-2">
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">AI Shelf Life Detection</a>
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">Receipt Scanning</a>
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">Expiry Alerts</a>
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">Waste Analytics</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">Food Storage Tips</a>
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">Recipe Suggestions</a>
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">Help & Support</a>
              <a href="#" className="block text-xs sm:text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs sm:text-sm text-gray-600">© 2025 My Expiry. All rights reserved.</p>
          <div className="flex space-x-3 mt-3 sm:mt-0">
            <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">Terms</a>
            <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}