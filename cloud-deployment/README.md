# X-ray API Deployment Guide for Google Cloud Run

This guide walks you through deploying your X-ray fracture detection API on Google Cloud Run.

## Step-by-Step Deployment Instructions

### 1. Prepare Your Model

First, you need to copy your trained model into the deployment directory:

```bash
# Create a model directory in the cloud-deployment folder
mkdir model

# Copy your SavedModel from the original location to the deployment directory
# Replace with the actual path to your model
cp -r ../model-assets/DR_model/DN169_3View_with_weights_savedmodel/* ./model/
```

### 2. Set Up Google Cloud

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) if you haven't already
2. Initialize the Google Cloud SDK:
   ```bash
   gcloud init
   ```
3. Set your project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```
4. Enable required APIs:
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable run.googleapis.com
   ```

### 3. Build and Deploy

From the `cloud-deployment` directory:

```bash
# Build and deploy using Cloud Build
gcloud builds submit --config=cloudbuild.yaml
```

This will:
1. Build a Docker container with your API
2. Push it to Google Container Registry
3. Deploy it to Cloud Run

### 4. Update Your Website

Once deployed, update your FracturePrediction component to point to the deployed URL:

```javascript
// In FracturePrediction.jsx
const API_URL = 'https://xray-api-xxxx-xx.a.run.app'; // Replace with your Cloud Run URL

// Update fetch calls
const response = await fetch(`${API_URL}/predict`, {
  method: 'POST',
  body: formData,
});

// And the health check
useEffect(() => {
  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        cache: 'no-cache',
      });
      // Rest of the code...
    }
  };
});
```

## Cost Considerations

- Google Cloud Run charges only when your API is handling requests
- For the initial setup, consider using the [Google Cloud Free Tier](https://cloud.google.com/free)
- Set up budget alerts to monitor costs

## Security Notes

- The current CORS settings allow requests from any origin (`"*"`)
- In production, update this to only allow requests from your website domain
- Consider adding authentication for production use

## Troubleshooting

- Check Cloud Build logs: `gcloud builds list`
- View Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=xray-api"`
- Test locally with Docker: `docker build -t xray-api . && docker run -p 8080:8080 xray-api`
