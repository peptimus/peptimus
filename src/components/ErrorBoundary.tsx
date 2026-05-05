import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { children: ReactNode }
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-card border border-red-500/20 rounded-2xl p-8 text-center space-y-5">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest text-foreground mb-2">Something went wrong</h2>
              <p className="text-muted-foreground text-sm font-mono break-all">{this.state.error.message}</p>
            </div>
            <Button
              onClick={() => { this.setState({ error: null }); window.location.reload(); }}
              className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 uppercase tracking-widest font-bold"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reload
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
