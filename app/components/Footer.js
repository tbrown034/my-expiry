export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">My Expiry</h3>
            <p className="text-sm text-gray-600">
              Smart grocery management to reduce food waste.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">Link 1</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">Link 2</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">Link 3</a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">Help Center</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">Contact Us</a>
              <a href="#" className="block text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-600">© 2025 My Expiry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}