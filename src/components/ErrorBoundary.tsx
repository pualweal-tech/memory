import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
          <h2>出错了</h2>
          <p className="muted">{this.state.error.message}</p>
          <button type="button" className="btn btn-primary" onClick={() => location.assign('/')}>
            回到首页
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
