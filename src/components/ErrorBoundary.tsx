import React from "react";

type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen grid place-items-center p-6 bg-[#fff8f0]">
          <div className="max-w-2xl w-full bg-white border rounded-xl shadow p-5">
            <h1 className="text-xl font-bold text-red-600 mb-2">Une erreur a planté l’affichage</h1>
            <pre className="text-sm whitespace-pre-wrap bg-gray-50 p-3 rounded border overflow-auto">
{String(this.state.error)}
            </pre>
            <p className="text-xs opacity-70 mt-3">
              Regarde le message ci-dessus : fichier + ligne indiquent l’origine.
            </p>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
