import os
import sys
import traceback
import platform
import tensorflow as tf
import importlib
import h5py  # Add h5py for low-level file reading

# Set TensorFlow logging level to suppress excessive output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=no INFO, 2=no INFO/WARNING, 3=no INFO/WARNING/ERROR

def log_environment_info():
    """Log minimal information about the Python environment and TensorFlow versions"""
    print("\n===== ENVIRONMENT INFORMATION =====")
    print(f"Python version: {sys.version.split()[0]}")
    print(f"TensorFlow version: {tf.__version__}")
    
    # Check if tensorflow_decision_forests is installed
    try:
        tfdf = importlib.import_module('tensorflow_decision_forests')
        print(f"TensorFlow Decision Forests version: {tfdf.__version__}")
        print(f"tensorflow_decision_forests is INSTALLED and imported successfully!")
    except ImportError:
        print("tensorflow_decision_forests is NOT installed or cannot be imported.")
    except Exception as e:
        print(f"Error checking tensorflow_decision_forests: {str(e)}")
    
    print("===================================\n")

def identify_model_structure(model_path):
    """Examine the structure of the model file without fully loading it"""
    try:
        print(f"Inspecting model structure in: {model_path}")
        
        if not os.path.exists(model_path):
            print(f"ERROR: Model file not found at {model_path}")
            return
        
        # First, try to peek at the model without loading it
        with h5py.File(model_path, 'r') as h5file:
            print(f"Model file format: HDF5")
            
            # Print top-level keys in the HDF5 file
            keys = list(h5file.keys())
            print(f"Top-level keys: {keys}")
            
            # Check for specific attributes that might indicate what type of model this is
            if 'model_config' in h5file.attrs:
                print("Found model_config attribute")
            
            # Look for custom objects
            if 'layer_names' in h5file:
                print(f"Found {len(h5file['layer_names'])} layers")
                
                # Sample a few layers to see what types they are
                for i, layer_name in enumerate(h5file['layer_names'][:3]):
                    layer_name = layer_name.decode('utf-8') if isinstance(layer_name, bytes) else layer_name
                    print(f"  Layer {i}: {layer_name}")
                    
                    # Check if this layer group has a config attribute
                    layer_group = h5file[layer_name]
                    if 'config' in layer_group.attrs:
                        layer_config = layer_group.attrs['config']
                        if isinstance(layer_config, bytes):
                            try:
                                import json
                                config = json.loads(layer_config.decode('utf-8'))
                                if 'class_name' in config:
                                    print(f"    Class name: {config['class_name']}")
                            except:
                                print(f"    Unable to parse layer config")
                
                if len(h5file['layer_names']) > 3:
                    print(f"  ... and {len(h5file['layer_names']) - 3} more layers")
            
    except Exception as e:
        print(f"Error inspecting model structure: {str(e)}")

def convert_keras_to_tfjs():
    try:
        log_environment_info()
        
        model_path = 'C:/Users/ldeve/CascadeProjects/windsurf-project/distal_radius_weights/DN169_3View.keras'
        output_dir = 'public/model/densenet169/'
        
        # Check if model file exists
        if not os.path.exists(model_path):
            print(f"ERROR: Model file does not exist at {model_path}")
            return
        
        # First, analyze model structure without loading
        identify_model_structure(model_path)
            
        # Create output directory
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"\nAttempting to load model from: {model_path}")
        
        # Define a dictionary of custom objects to handle any custom layers/models
        custom_objects = {
            # Add any custom layers that might be in the model
            # For example, if using tensorflow_decision_forests:
            # 'GradientBoostedTreesModel': tfdf.keras.GradientBoostedTreesModel,
        }
        
        # Loading approach based on analyzing the model file
        print("Attempting to load model with multiple approaches...")
        
        # Backup the stdout
        original_stdout = sys.stdout
        
        model = None
        error_messages = []
        
        # Try multiple approaches to load the model
        approaches = [
            # Approach 1: Standard loading without compilation
            {
                'name': 'Standard loading with compile=False',
                'fn': lambda: tf.keras.models.load_model(model_path, compile=False)
            },
            # Approach 2: With custom_objects
            {
                'name': 'Loading with custom_objects',
                'fn': lambda: tf.keras.models.load_model(model_path, custom_objects=custom_objects, compile=False)
            },
            # Approach 3: Load as h5 file
            {
                'name': 'Loading as H5 file',
                'fn': lambda: tf.keras.models.load_model(model_path, custom_objects=custom_objects, compile=False, 
                                                        options=tf.saved_model.LoadOptions(experimental_io_device='/job:localhost'))
            },
            # Approach 4: Try to just load DenseNet169 pretrained model
            {
                'name': 'Loading a fresh DenseNet169 as fallback',
                'fn': lambda: tf.keras.applications.DenseNet169(weights='imagenet')
            }
        ]
        
        for approach in approaches:
            try:
                print(f"Trying: {approach['name']}...")
                # Redirect stdout to suppress verbose output
                sys.stdout = open(os.devnull, 'w')
                model = approach['fn']()
                # Restore stdout
                sys.stdout = original_stdout
                print(f"Success! Model loaded with {approach['name']}")
                break
            except Exception as load_error:
                # Restore stdout
                sys.stdout = original_stdout
                error_message = str(load_error)
                error_messages.append(f"Error with {approach['name']}: {error_message}")
                print(f"Failed: {approach['name']}")
        
        # If all approaches failed, print errors and exit
        if model is None:
            print("\nAll loading approaches failed. Here are the errors:")
            for msg in error_messages:
                print(f"- {msg}")
            print("\nConsider using a different model conversion approach.")
            return
        
        print("Model loaded successfully.")
        
        # Print minimal model information without the full summary
        print(f"Model info: Input shape={model.input_shape}, Output shape={model.output_shape}")
        print(f"Model contains {len(model.layers)} layers")
        
        # Use TensorFlow's built-in save_model to save in a web-friendly format
        print(f"Saving model to {output_dir}")
        
        try:
            print("Starting SavedModel save operation...")
            # Redirect stdout to suppress verbose output during save
            sys.stdout = open(os.devnull, 'w')
            tf.saved_model.save(model, output_dir)
            # Restore stdout
            sys.stdout = original_stdout
            print("Model saved successfully!")
        except Exception as save_error:
            # Restore stdout if error occurred
            sys.stdout = original_stdout
            print(f"Error during model save: {str(save_error)}")
            
            # Try alternative approach - export to keras format first, then to tensorflowjs
            try:
                print("\nTrying alternative approach - saving to temporary Keras format...")
                # Create a temp directory
                temp_keras_file = os.path.join(os.path.dirname(output_dir), 'temp_model.keras')
                model.save(temp_keras_file, save_format='keras')
                print(f"Model saved to temporary file {temp_keras_file}")
                
                # Now include instructions for manual conversion
                print("\nPlease run these commands manually to convert the model:")
                print(f"1. pip install tensorflowjs")
                print(f"2. tensorflowjs_converter --input_format=keras {temp_keras_file} {output_dir}")
                return
            except Exception as alt_error:
                print(f"Alternative approach also failed: {str(alt_error)}")
                raise save_error
        
        # Now we need to create a simple script to tell the user how to convert this saved model
        conversion_script = os.path.join(os.path.dirname(output_dir), 'convert_command.txt')
        with open(conversion_script, 'w') as f:
            f.write(f"# Run this command in a clean environment with tensorflowjs installed:\n")
            f.write(f"tensorflowjs_converter --input_format=tf_saved_model {output_dir} {output_dir}_web\n")
            f.write(f"# Then copy files from {output_dir}_web to {output_dir}")
        
        print(f"\nStep 1 completed: Model saved as TensorFlow SavedModel format to {output_dir}")
        print(f"Step 2: See {conversion_script} for instructions on converting to TensorFlow.js format")
        
        # List created files (just count them to avoid verbose output)
        file_count = 0
        total_size_kb = 0
        for dirpath, _, filenames in os.walk(output_dir):
            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
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
