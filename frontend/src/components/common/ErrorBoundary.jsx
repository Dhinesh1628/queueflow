import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('QueueFlow ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F6F0] dark:bg-[#1C1815] text-[#26221F] dark:text-[#FAF8F5] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#26201B] border border-[#E6E0D4] dark:border-[#3E342C] rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#B71C1C]/10 border border-[#B71C1C]/25 flex items-center justify-center text-[#B71C1C] dark:text-[#E57373] mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#26221F] dark:text-[#FAF8F5]">
                Application Interface Notice
              </h2>
              <p className="text-xs text-[#736A62] dark:text-[#C7BCB0] mt-1 leading-relaxed">
                An unexpected error occurred while rendering the page. Your underlying data in MongoDB is completely safe.
              </p>
            </div>

            {this.state.error?.message && (
              <pre className="p-3 bg-[#F8F6F0] dark:bg-[#1C1815] border border-[#E6E0D4] dark:border-[#3E342C] rounded-xl text-left text-[11px] font-mono text-[#B71C1C] dark:text-[#E57373] overflow-x-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8C532B] hover:bg-[#774421] text-white text-xs font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
