import { useState } from 'react';

export default function XrayPrediction() {
  const [files, setFiles] = useState({
    ap: null,
    lat: null,
    ob: null
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (view) => (e) => {
    if (e.target.files[0]) {
      setFiles(prev => ({
        ...prev,
        [view]: e.target.files[0]
      }));
    }
  };

  const canSubmit = files.ap && files.lat && files.ob;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canSubmit) {
      setError("Please upload all three X-ray views");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const formData = new FormData();
      formData.append("ap", files.ap);
      formData.append("lat", files.lat);
      formData.append("ob", files.ob);

      // Replace with your actual API endpoint
      const apiUrl = "http://localhost:8000/predict";
      // For production: "https://api.yourdomain.com/predict"
      
      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPrediction(data.probability);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">X-ray Fracture Detection</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['ap', 'lat', 'ob'].map((view) => (
            <div key={view} className="border p-4 rounded">
              <label className="block text-blue-600 font-medium mb-2">
                {view.toUpperCase()} View
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(view)}
                className="block w-full mb-3 border border-gray-300 rounded p-2"
              />
              {files[view] && (
                <div className="mt-2">
                  <div className="bg-gray-100 p-2 rounded text-sm truncate">
                    {files[view].name}
                  </div>
                  <img
                    src={URL.createObjectURL(files[view])}
                    alt={`${view} preview`}
                    className="mt-2 w-full h-40 object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={`w-full py-3 px-4 rounded font-bold text-white 
            ${canSubmit && !loading
              ? "bg-blue-600 hover:bg-blue-800" 
              : "bg-gray-400 cursor-not-allowed"}`}
        >
          {loading ? "Processing..." : "Analyze X-rays"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {prediction !== null && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-blue-600">Analysis Result</h3>
          <div className="flex items-center justify-between">
            <span className="text-lg">Fracture Probability:</span>
            <span className={`text-2xl font-bold ${prediction > 0.5 ? 'text-red-600' : 'text-green-600'}`}>
              {(prediction * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
            <div 
              className={`h-4 rounded-full ${prediction > 0.5 ? 'bg-red-600' : 'bg-green-600'}`}
              style={{width: `${prediction * 100}%`}}
            ></div>
          </div>
          <p className="mt-4 text-gray-700">
            {prediction > 0.7 
              ? "High probability of fracture. Recommend further clinical evaluation."
              : prediction > 0.3
              ? "Moderate probability of fracture. Consider additional assessment."
              : "Low probability of fracture. Monitor for changes in symptoms."}
          </p>
        </div>
      )}
    </div>
  );
}
