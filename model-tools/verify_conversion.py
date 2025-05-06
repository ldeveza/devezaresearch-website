"""
Verify SavedModel Conversion

This script verifies we can successfully convert the Keras model to SavedModel format.
It's designed to be minimal and focused on just the working part of the conversion.
"""

import os
import sys
import tensorflow as tf

# Set TensorFlow logging level to suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def verify_conversion():
    print("\n===== VERIFYING KERAS TO SAVEDMODEL CONVERSION =====\n")
    
    # Define paths - try to use model-assets folder if file exists there
    original_model_path = 'C:/Users/ldeve/CascadeProjects/windsurf-project/distal_radius_weights/DN169_3View.keras'
    model_assets_path = '../model-assets/original/DN169_3View.keras'
    
    # Check if model exists in model-assets folder
    if os.path.exists(model_assets_path):
        model_path = model_assets_path
        print(f"Using model from model-assets folder: {model_path}")
    else:
        model_path = original_model_path
        print(f"Using original model path: {model_path}")
    
    # Check if model file exists
    if not os.path.exists(model_path):
        print(f"ERROR: Model file not found at {model_path}")
        return False
    
    output_dir = '../public/model/densenet169/'
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        print(f"Loading model from: {model_path}")
        # Redirect stdout to suppress model summary
        original_stdout = sys.stdout
        sys.stdout = open(os.devnull, 'w')
        
        # Load the Keras model
        model = tf.keras.models.load_model(model_path, compile=False)
        
        # Restore stdout
        sys.stdout = original_stdout
        print("Model loaded successfully!")
        
        # Get basic model info
        print(f"Model info: Input shape={model.input_shape}, Output shape={model.output_shape}")
        
        # Save to SavedModel format
        print(f"Converting to SavedModel format in {output_dir}...")
        
        # Redirect stdout again
        sys.stdout = open(os.devnull, 'w')
        
        # Save the model
        tf.saved_model.save(model, output_dir)
        
        # Restore stdout
        sys.stdout = original_stdout
        print("Model saved to SavedModel format successfully!")
        
        # Verify files were created
        pb_file = os.path.join(output_dir, 'saved_model.pb')
        variables_dir = os.path.join(output_dir, 'variables')
        
        if os.path.exists(pb_file) and os.path.exists(variables_dir):
            pb_size = os.path.getsize(pb_file) / (1024 * 1024)  # Size in MB
            print(f"Verified SavedModel files created:")
            print(f"  - saved_model.pb: {pb_size:.2f} MB")
            print(f"  - variables/ directory: {os.path.exists(variables_dir)}")
            return True
        else:
            print("ERROR: Expected SavedModel files not found")
            return False
        
    except Exception as e:
        # Ensure stdout is restored
        if 'original_stdout' in locals() and sys.stdout != original_stdout:
            sys.stdout = original_stdout
            
        print(f"ERROR: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = verify_conversion()
    if success:
        print("\n✅ VERIFICATION SUCCESSFUL: Keras to SavedModel conversion works!")
    else:
        print("\n❌ VERIFICATION FAILED: Conversion encountered issues")
