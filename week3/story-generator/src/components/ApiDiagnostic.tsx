import { useState } from 'react';
import axios from 'axios';

export default function ApiDiagnostic() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const API_BASE_URL = 'http://172.22.144.1:1234';
  
  const testApiConnection = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // Test the models endpoint
      console.log('Testing models endpoint...');
      const modelsResponse = await axios.get(`${API_BASE_URL}/v1/models`, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Models endpoint response:', modelsResponse.data);
      
      // Test a simple completion
      console.log('Testing completions endpoint...');
      const completionResponse = await axios.post(
        `${API_BASE_URL}/v1/completions`,
        {
          prompt: 'Hello, world!',
          max_tokens: 50,
          temperature: 0.7,
          stream: false
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Completions endpoint response:', completionResponse.data);
      
      setResult({
        models: modelsResponse.data,
        completion: completionResponse.data
      });
    } catch (err: any) {
      console.error('API test error:', err);
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`API error: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
        } else if (err.request) {
          setError(`Network error: No response received from ${API_BASE_URL}. Check if the server is accessible.`);
        } else {
          setError(`Request error: ${err.message}`);
        }
      } else {
        setError(`Unexpected error: ${err.message || String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">API Diagnostic</h2>
      
      <button
        onClick={testApiConnection}
        disabled={loading}
        className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md ${
          loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-semibold">Error:</p>
          <p className="whitespace-pre-wrap">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">✓ API connection successful!</p>
          
          <div className="mt-2">
            <p className="font-semibold">Available Models:</p>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-40">
              {JSON.stringify(result.models, null, 2)}
            </pre>
          </div>
          
          <div className="mt-4">
            <p className="font-semibold">Sample Completion:</p>
            <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-40">
              {JSON.stringify(result.completion, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
