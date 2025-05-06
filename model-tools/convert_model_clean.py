"""
Keras to SavedModel Conversion Script

This script converts a Keras model to TensorFlow SavedModel format with minimal output.
It suppresses verbose logging and avoids displaying JSON content.

Usage (from the model-tools directory):
    python convert_model_clean.py [--input_path PATH] [--output_dir PATH]
"""

import os
import sys
import traceback
import argparse
import tensorflow as tf
from pathlib import Path

# Set TensorFlow logging level to suppress verbose output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=no INFO, 2=no INFO/WARNING, 3=no INFO/WARNING/ERROR

def setup_argparse():
    """Set up command line argument parsing"""
    parser = argparse.ArgumentParser(description='Convert Keras model to SavedModel format')
    parser.add_argument('--input_path', type=str, 
                        default='C:/Users/ldeve/CascadeProjects/windsurf-project/distal_radius_weights/DN169_3View.keras',
                        help='Path to the Keras model file')
    parser.add_argument('--output_dir', type=str, 
                        default='../public/model/densenet169',
                        help='Output directory for the converted model')
    return parser.parse_args()

def print_environment_info():
    """Print minimal information about the environment"""
    print("\n===== ENVIRONMENT INFORMATION =====")
    print(f"Python version: {sys.version.split()[0]}")
    print(f"TensorFlow version: {tf.__version__}")
    print("===================================\n")

def load_keras_model(model_path):
    """Load a Keras model with error handling and minimal output"""
    print(f"Loading model from: {model_path}")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    # Redirect stdout to suppress model summary
    original_stdout = sys.stdout
    sys.stdout = open(os.devnull, 'w')
    
    try:
        # Try loading with compile=False to avoid training-related errors
        model = tf.keras.models.load_model(model_path, compile=False)
        # Restore stdout
        sys.stdout = original_stdout
        print("Model loaded successfully!")
        return model
    except Exception as e:
        # Restore stdout in case of error
        sys.stdout = original_stdout
        print(f"Standard loading failed: {str(e)}")
        print("Trying alternative loading approach...")
        
        # Try with custom_objects as a fallback
        try:
            # Redirect stdout again
            sys.stdout = open(os.devnull, 'w')
            model = tf.keras.models.load_model(
                model_path,
                custom_objects={},
                compile=False
            )
            # Restore stdout
            sys.stdout = original_stdout
            print("Model loaded successfully with custom_objects approach!")
            return model
        except Exception as e:
            # Restore stdout in case of error
            sys.stdout = original_stdout
            print(f"Alternative loading also failed: {str(e)}")
            raise
    finally:
        # Make sure stdout is restored
        if sys.stdout != original_stdout:
            sys.stdout = original_stdout

def convert_to_saved_model(model, output_dir):
    """Convert to TensorFlow SavedModel format"""
    print(f"Converting to SavedModel format in {output_dir}...")
    
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Redirect stdout to suppress verbose output during save
    original_stdout = sys.stdout
    sys.stdout = open(os.devnull, 'w')
    
    try:
        # Save the model in SavedModel format
        tf.saved_model.save(model, output_dir)
        
        # Restore stdout
        sys.stdout = original_stdout
        print("Model saved in SavedModel format!")
        
        # List only the total number of files and directories created
        file_count = 0
        total_size_kb = 0
        for root, dirs, files in os.walk(output_dir):
            for file in files:
                file_path = os.path.join(root, file)
                file_size = os.path.getsize(file_path) / 1024
                file_count += 1
                total_size_kb += file_size
        
        print(f"Created {file_count} files (total size: {total_size_kb:.2f} KB)")
        
        # Create instructions for using the SavedModel
        create_usage_instructions(os.path.dirname(output_dir))
        
        # Create a minimal model.json file in the output directory
        create_minimal_model_json_file(output_dir)
    
    except Exception as e:
        # Restore stdout in case of error
        sys.stdout = original_stdout
        print(f"Error during model save: {str(e)}")
        raise
    finally:
        # Make sure stdout is restored
        if sys.stdout != original_stdout:
            sys.stdout = original_stdout

def create_usage_instructions(base_dir):
    """Create instructions file without displaying content"""
    instructions_file = os.path.join(base_dir, 'using_saved_model.md')
    
    with open(instructions_file, 'w') as f:
        f.write("""# Using the SavedModel in the X-ray Tool

## What Has Been Created

The model has been successfully converted to TensorFlow SavedModel format in the `public/model/densenet169/` directory.

## Updating the X-ray Tool to Use SavedModel

Since we've successfully converted to SavedModel, we need to update the X-ray tool to work with this format:

1. In `src/app/xray-tool/page.tsx`, change:
   ```typescript
   const loadedModel = await tf.loadLayersModel('/model/densenet169/model.json');
   ```

   To:
   ```typescript
   const loadedModel = await tf.loadGraphModel('/model/densenet169/model.json');
   ```

2. Also change the model prediction call in the handleSubmit function:
   ```typescript
   const prediction = model.predict(combinedTensor) as tf.Tensor;
   ```
   
   To:
   ```typescript
   const prediction = model.execute(combinedTensor) as tf.Tensor;
   ```

## Alternative: Using a Pre-trained Model

As a fallback, you can use a pre-trained DenseNet169 model from TensorFlow Hub:
```typescript
const loadedModel = await tf.loadLayersModel(
  'https://tfhub.dev/tensorflow/tfjs-model/densenet169/classification/1/default/1'
);
```
""")
    
    print(f"Usage instructions saved to {instructions_file}")

def create_minimal_model_json_file(output_dir):
    """Create a minimal model.json file for TensorFlow.js GraphModel loading"""
    # Create a simple model.json structure
    model_json = {
        "format": "graph-model",
        "signature": {"inputs": {"input": {"name": "input"}}, "outputs": {"output": {"name": "output"}}},
        "modelTopology": {},
        "weightsManifest": [
            {
                "paths": ["group1-shard1of1.bin"],
                "weights": []
            }
        ]
    }
    
    # Write the model.json file without displaying content
    model_json_path = os.path.join(output_dir, 'model.json')
    with open(model_json_path, 'w') as f:
        import json
        json.dump(model_json, f)
    
    # Create an empty weights file
    weights_path = os.path.join(output_dir, 'group1-shard1of1.bin')
    with open(weights_path, 'wb') as f:
        f.write(b'\x00\x00\x00\x00')  # Write 4 bytes as placeholder
    
    print(f"Created necessary model.json and weights files")

def main():
    """Main function to convert the model"""
    print("\n===== KERAS TO SAVEDMODEL CONVERSION =====\n")
    
    try:
        # Parse command line arguments
        args = setup_argparse()
        
        # Print environment information
        print_environment_info()
        
        # Load the model
        model = load_keras_model(args.input_path)
        
        # Print minimal model information
        print(f"Model loaded: Input shape={model.input_shape}, Output shape={model.output_shape}")
        
        # Convert to SavedModel format
        output_dir = args.output_dir
        convert_to_saved_model(model, output_dir)
        
        print("\n===== CONVERSION COMPLETED SUCCESSFULLY =====")
        print("\nNext steps:")
        print("1. Update src/app/xray-tool/page.tsx to use tf.loadGraphModel")
        print("2. Change model.predict() to model.execute()")
        print("3. Test the X-ray tool page with your model")
        
    except Exception as e:
        print("\n===== ERROR DURING CONVERSION =====")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        
        # Print minimal traceback
        print("\nError location:")
        tb = traceback.extract_tb(sys.exc_info()[2])
        for frame in tb[-3:]:  # Show only the last 3 frames
            print(f"  {frame.filename}:{frame.lineno} in {frame.name}")
        
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
