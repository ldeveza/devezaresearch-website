import io
import numpy as np
import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf

# --- load model in SavedModel format (no custom objects needed) ---
# Get the absolute path to this script's directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Path to the SavedModel directory
MODEL_PATH = os.path.join(SCRIPT_DIR, 'model')

print(f"Loading model from {MODEL_PATH}")
# Use tf.saved_model.load for models saved with tf.saved_model.save
saved_model = tf.saved_model.load(MODEL_PATH)
print("Model loaded successfully")

# Get the prediction function from the SavedModel
model = saved_model.signatures["serving_default"]

# Get input names from the signature
input_spec = model.structured_input_signature[1]
input_names = list(input_spec.keys())
print(f"Model has these input layer names: {input_names}")

# Map our standard names to the actual model input names
input_mapping = {}
if len(input_names) == 3:
    # Use the exact input names from the model
    input_mapping = {
        'ap': input_names[0],
        'lat': input_names[1],
        'ob': input_names[2]
    }
    print(f"Using input mapping: {input_mapping}")

# Create FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

def preprocess_image(file: UploadFile):
    try:
        img = Image.open(io.BytesIO(file.file.read())).convert('RGB')
        img = img.resize((224,224))
        arr = np.array(img, dtype=np.float32) / 255.0
        return arr
    except Exception as e:
        raise HTTPException(400, f"Can't parse image {file.filename}: {str(e)}")

@app.post("/predict")
async def predict(
    ap:  UploadFile = File(...),
    lat: UploadFile = File(...),
    ob:  UploadFile = File(...)
):
    # 1) Read & preprocess
    imgs = [preprocess_image(f) for f in (ap, lat, ob)]
    batch = [np.expand_dims(img, 0) for img in imgs]

    # 2) Run inference with SavedModel signature
    if input_mapping:
        # Use the mapped input names
        feed_dict = {
            input_mapping['ap']: tf.constant(batch[0], dtype=tf.float32),
            input_mapping['lat']: tf.constant(batch[1], dtype=tf.float32),
            input_mapping['ob']: tf.constant(batch[2], dtype=tf.float32)
        }
        result = model(**feed_dict)
    else:
        # Fallback to using the original input names
        result = model(
            input_ap=tf.constant(batch[0], dtype=tf.float32),
            input_lat=tf.constant(batch[1], dtype=tf.float32),
            input_ob=tf.constant(batch[2], dtype=tf.float32)
        )
    
    # Extract the prediction from the result dictionary
    # The output key is typically the name of the output tensor
    output_key = list(result.keys())[0]
    preds = result[output_key].numpy()
    prob = float(preds[0][0])
    return {"probability": prob}
