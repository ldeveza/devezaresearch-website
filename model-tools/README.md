# X-Ray Fracture Detection Model Conversion Tools

This directory contains tools for converting the DenseNet169 Keras model to TensorFlow.js format for use in the X-ray fracture detection web application.

## Directory Contents

- `simple_convert.py`: Two-step conversion script (recommended)
- `convert_model.py`: Direct conversion script
- `requirements.txt`: Required Python packages

## Setup Instructions

### 1. Create a Dedicated Environment

We recommend using a dedicated Python environment for the conversion process to avoid dependency conflicts. You can use conda or venv:

#### Using Conda (Recommended)

```bash
# Create a new conda environment
conda create -n tf-convert python=3.9
conda activate tf-convert

# Install requirements
pip install -r requirements.txt
```

#### Using venv

```bash
# Create a new virtual environment
python -m venv tf-convert-env
# Activate on Windows
tf-convert-env\Scripts\activate
# Install requirements
pip install -r requirements.txt
```

### 2. Model Location

Place the Keras model file at:
```
C:/Users/ldeve/CascadeProjects/windsurf-project/distal_radius_weights/DN169_3View.keras
```

### 3. Conversion Process

The conversion happens in two steps:

#### Step 1: Convert to SavedModel Format

Run the `simple_convert.py` script to convert the Keras model to TensorFlow SavedModel format:

```bash
python simple_convert.py
```

This will create a SavedModel in the `public/model/densenet169/` directory.

#### Step 2: Convert to TensorFlow.js Format

After the first step completes successfully, run the TensorFlow.js converter:

```bash
# Navigate to the project root
cd ..

# Convert the SavedModel to TensorFlow.js format
tensorflowjs_converter --input_format=tf_saved_model public/model/densenet169/ public/model/densenet169_web

# Copy the converted files back to the original directory
# On Windows:
xcopy /E /Y public\model\densenet169_web\* public\model\densenet169\
```

### 4. Verification

After both steps are complete, you should have the following files in the `public/model/densenet169/` directory:

- `model.json`: The model architecture and weights manifest
- Several `.bin` files: Binary files containing the model weights

## Troubleshooting

### Common Issues

1. **Missing Dependencies**:
   - Error: `ModuleNotFoundError: No module named 'tensorflow_decision_forests'`
   - Solution: Ensure you've installed all dependencies: `pip install -r requirements.txt`

2. **Memory Issues**:
   - Error: Memory-related errors during conversion
   - Solution: Close other applications to free up memory, or try on a machine with more RAM

3. **Model Loading Errors**:
   - Check that the model path is correct
   - Try loading with `compile=False` option

### Extended Logging

Both scripts have detailed logging to help diagnose issues. The output will show:

- Environment information (Python, TensorFlow versions)
- Model structure details
- Conversion progress
- Any errors that occur

## Usage in the Web Application

After successful conversion, the X-ray tool page is configured to load the model from `/model/densenet169/model.json` and perform predictions directly in the browser using TensorFlow.js.
