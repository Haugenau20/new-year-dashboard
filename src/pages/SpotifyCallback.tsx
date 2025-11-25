import { useEffect, useState } from 'react';

interface SpotifyCallbackProps {
  onSuccess: (code: string) => void;
  onError: (error: string) => void;
}

export function SpotifyCallback({ onSuccess, onError }: SpotifyCallbackProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setStatus('error');
      onError(error);
      return;
    }

    if (code) {
      setStatus('success');
      onSuccess(code);
    } else {
      setStatus('error');
      onError('No authorization code received');
    }
  }, [onSuccess, onError]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {status === 'processing' && (
          <>
            <div className="spinner"></div>
            <h2>Connecting to Spotify...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <h2>✓ Connected!</h2>
            <p>Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h2>Connection Failed</h2>
            <p>Please try again</p>
          </>
        )}
      </div>
    </div>
  );
}
