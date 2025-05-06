import os
import sys
import traceback
import platform
import tensorflow as tf
import tensorflowjs as tfjs
import importlib

# Set TensorFlow logging level to suppress excessive output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=no INFO, 2=no INFO/WARNING, 3=no INFO/WARNING/ERROR

def log_environment_info():
    """Log concise information about the Python environment and TensorFlow versions"""
    print("\n===== ENVIRONMENT INFORMATION =====")
    print(f"Python version: {sys.version.split()[0]}")
    print(f"TensorFlow version: {tf.__version__}")
    
    try:
        print(f"TensorFlow.js version: {tfjs.__version__}")
    except Exception as e:
        print(f"Error getting TensorFlow.js version: {str(e)}")
    
    # Check if tensorflow_decision_forests is installed
    try:
        tfdf = importlib.import_module('tensorflow_decision_forests')
        print(f"✓ TensorFlow Decision Forests version: {tfdf.__version__}")
    except ImportError:
        print("✗ tensorflow_decision_forests is NOT installed")
    except Exception as e:
        print(f"? Error checking tensorflow_decision_forests: {str(e)}")
    
    print("===================================\n")

def convert_keras_to_tfjs():
    try:
        log_environment_info()
        
        # Create the output directory if it doesn't exist
        output_dir = 'public/model/densenet169/'
        os.makedirs(output_dir, exist_ok=True)
        
        model_path = 'C:/Users/ldeve/CascadeProjects/windsurf-project/distal_radius_weights/DN169_3View.keras'
        print(f"Loading model from: {model_path}")
        
        # Check if model file exists
        if not os.path.exists(model_path):
            print(f"ERROR: Model file does not exist at {model_path}")
            return
            
        print("Starting model loading...")
        
        # Backup the stdout to suppress verbose output
        original_stdout = sys.stdout
        
        # Load your Keras model - suppress stdout to avoid JSON dumps
        try:
            # Redirect stdout to suppress verbose output
            sys.stdout = open(os.devnull, 'w')
            model = tf.keras.models.load_model(model_path, compile=False)
            # Restore stdout
            sys.stdout = original_stdout
            print("Model loaded successfully.")
        except Exception as load_error:
            # Restore stdout if error occurred
            sys.stdout = original_stdout
            print(f"Error loading model: {str(load_error)}")
            raise
        
        # Print basic model info without full summary
        print(f"Model info: Input shape={model.input_shape}, Output shape={model.output_shape}")
        print(f"Model contains {len(model.layers)} layers")
        
        # Save the model in TensorFlow.js format
        print(f"Converting model to TensorFlow.js format and saving to {output_dir}")
        print(f"Using converter function: tfjs.converters.save_keras_model")
        
        try:
            # Redirect stdout to suppress verbose output during conversion
            sys.stdout = open(os.devnull, 'w')
            tfjs.converters.save_keras_model(model, output_dir)
            # Restore stdout
            sys.stdout = original_stdout
            print("Model conversion successful!")
        except Exception as convert_error:
            # Restore stdout if error occurred
            sys.stdout = original_stdout
            print(f"Error during conversion: {str(convert_error)}")
            raise
        
        # Count files instead of listing them individually
        file_count = 0
        total_size_kb = 0
        for filename in os.listdir(output_dir):
            file_path = os.path.join(output_dir, filename)
            file_size = os.path.getsize(file_path) / 1024  # Size in KB
            file_count += 1
            total_size_kb += file_size
            
        print(f"\nCreated {file_count} files (total size: {total_size_kb:.2f} KB) in {output_dir}")
        print("Model conversion completed successfully!")
        
    except Exception as e:
        # Ensure stdout is restored in case of error
        if 'original_stdout' in locals():
            sys.stdout = original_stdout
            
        print(f"\n===== ERROR DETAILS =====")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        # Print only first few lines of traceback to avoid verbose output
        tb_lines = traceback.format_exc().split('\n')
        print("\nError traceback (condensed):")
        for line in tb_lines[:10]:  # Show only first 10 lines
            print(line)
        if len(tb_lines) > 10:
            print(f"... (and {len(tb_lines)-10} more lines)")
        print("========================\n")
        
if __name__ == "__main__":
    print("Starting model conversion process...")
    convert_keras_to_tfjs()
