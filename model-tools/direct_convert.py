import sys
import os
import tensorflowjs as tfjs
import tensorflow as tf
import json

def convert_keras_to_tfjs_directly():
    print("Starting direct conversion from Keras to TensorFlow.js...")
    
    try:
        # Input and output paths
        input_model = 'C:/Users/ldeve/CascadeProjects/windsurf-project/distal_radius_weights/DN169_3View.keras'
        output_dir = '../public/model/densenet169/'
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"Loading model from: {input_model}")
        
        # Directly use the Keras model loader without compiling
        model = tf.keras.models.load_model(input_model, compile=False)
        
        print("Model loaded successfully.")
        print(f"Model info: Input shape={model.input_shape}, Output shape={model.output_shape}")
        
        # Use a direct conversion method that bypasses the normal flow
        # Directly use the tfjs.converters.save_keras_model function which has fewer dependencies
        print(f"Directly converting to TensorFlow.js format...")
        
        # Explicitly construct the path to the model.json output file
        model_json_path = os.path.join(output_dir, 'model.json')
        weights_path_prefix = os.path.join(output_dir, 'weights')
        
        # Convert to tfjs format
        model_json = tfjs.converters.keras_h5_conversion.save_keras_model(
            model, 
            output_dir,
            quantization_dtype=None,
            quantization_bytes=None
        )
        
        # Manually write the model.json file
        with open(model_json_path, 'w') as f:
            json.dump(model_json, f)
        
        print(f"\nConversion completed successfully!")
        print(f"Model saved to {output_dir}")
        
        # Verify files
        file_count = 0
        for file in os.listdir(output_dir):
            file_path = os.path.join(output_dir, file)
            file_size = os.path.getsize(file_path) / 1024  # Size in KB
            print(f"  - {file} ({file_size:.2f} KB)")
            file_count += 1
        
        print(f"\nFound {file_count} files in the output directory")
        
    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    convert_keras_to_tfjs_directly()
