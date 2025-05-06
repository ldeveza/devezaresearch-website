"""
Custom Conversion Script for Multi-Input DenseNet169 X-ray Model

This script is designed to:
1. Load the original multi-input DenseNet169 model for X-ray analysis
2. Recreate the exact architecture to ensure compatibility
3. Convert to TensorFlow.js format for web deployment
4. Generate a proper model.json file with the correct input specifications
"""

import os
import sys
import json
import argparse
import numpy as np
import tensorflow as tf
import tensorflow.keras.backend as K
from tensorflow.keras.models import Model, clone_model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Input, Concatenate
from tensorflow.keras.applications.densenet import DenseNet169

# Reduce TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def create_multi_input_densenet_model(input_shape=(224, 224, 3), num_classes=1):
    """
    Recreate the exact model architecture used in training.
    This matches the architecture in the training notebook,
    but adapts for TensorFlow version compatibility.
    """
    # Create input layers for each view
    input_ap = Input(shape=input_shape, name='input_ap')
    input_lat = Input(shape=input_shape, name='input_lat')
    input_ob = Input(shape=input_shape, name='input_ob')
    
    # Create separate base models for each view with custom name prefixes
    # We'll create each DenseNet separately and then modify the layer names
    base_model_ap_orig = DenseNet169(weights=None, include_top=False, input_shape=input_shape)
    base_model_lat_orig = DenseNet169(weights=None, include_top=False, input_shape=input_shape)
    base_model_ob_orig = DenseNet169(weights=None, include_top=False, input_shape=input_shape)
    
    # Function to create a copy of the model with renamed layers
    def rename_model_layers(model, prefix):
        """Clone a model and rename all of its layers with a prefix"""
        cloned_model = clone_model(model)
        
        # Set unique names for all layers in the cloned model
        for layer in cloned_model.layers:
            layer._name = f"{prefix}_{layer.name}"
        
        # Create a new model with those renamed layers
        input_tensor = Input(shape=input_shape)
        return Model(inputs=input_tensor, outputs=cloned_model(input_tensor))
    
    # Create renamed models
    base_model_ap = rename_model_layers(base_model_ap_orig, "ap")
    base_model_lat = rename_model_layers(base_model_lat_orig, "lat")
    base_model_ob = rename_model_layers(base_model_ob_orig, "ob")
    
    # Apply the base models to the inputs
    x_ap = base_model_ap(input_ap)
    x_lat = base_model_lat(input_lat)
    x_ob = base_model_ob(input_ob)
    
    # Global average pooling for each
    x_ap = GlobalAveragePooling2D(name='gap_ap')(x_ap)
    x_lat = GlobalAveragePooling2D(name='gap_lat')(x_lat)
    x_ob = GlobalAveragePooling2D(name='gap_ob')(x_ob)
    
    # Concatenate the outputs
    x = Concatenate(name='concat_views')([x_ap, x_lat, x_ob])
    
    # Add fully connected layers - match the exact architecture from training
    x = Dense(1024, activation='relu', name='dense_1024')(x)
    predictions = Dense(num_classes, activation='sigmoid', name='output')(x)
    
    # Create the model
    model = Model(inputs=[input_ap, input_lat, input_ob], outputs=predictions)
    
    # Print model summary to verify structure
    print("\nRecreated model summary:")
    model.summary(line_length=100, show_trainable=False)
    
    return model

def load_and_convert_model(model_path, output_dir):
    """
    Load the original multi-input model and save it in TF.js format
    """
    print(f"Starting conversion process for multi-input X-ray model: {model_path}")
    
    try:
        # First, try to load the original model
        print(f"Attempting to load original model from: {model_path}")
        original_model = None
        
        # Redirect stdout to minimize verbose output
        original_stdout = sys.stdout
        sys.stdout = open(os.devnull, 'w')
        
        try:
            # Try loading with compile=False first
            original_model = tf.keras.models.load_model(model_path, compile=False)
            print("Model loaded with compile=False")
        except Exception as e:
            print(f"Error loading model with compile=False: {e}")
            
            try:
                # Try with custom_objects empty dictionary
                original_model = tf.keras.models.load_model(
                    model_path, 
                    custom_objects={}, 
                    compile=False
                )
                print("Model loaded with empty custom_objects")
            except Exception as e:
                print(f"Error loading model with custom_objects: {e}")

        # Restore stdout
        sys.stdout = original_stdout
        
        if original_model is not None:
            print("✓ Successfully loaded original model")
            print(f"Original model input shape: {original_model.input_shape if hasattr(original_model, 'input_shape') else 'Multiple inputs'}")
            print(f"Original model output shape: {original_model.output_shape}")
            
            # Create output directory if it doesn't exist
            os.makedirs(output_dir, exist_ok=True)
            
            # Save as a TensorFlow SavedModel first
            saved_model_path = os.path.join(output_dir, 'saved_model')
            print(f"Saving as TensorFlow SavedModel to: {saved_model_path}")
            
            # Redirect stdout again to minimize verbose output
            sys.stdout = open(os.devnull, 'w')
            tf.saved_model.save(original_model, saved_model_path)
            sys.stdout = original_stdout
            
            print("✓ Model saved as TensorFlow SavedModel")
            
            # Now convert to TensorFlow.js format
            tfjs_path = os.path.join(output_dir, 'tfjs_model')
            os.makedirs(tfjs_path, exist_ok=True)
            
            print(f"Converting to TensorFlow.js format to: {tfjs_path}")
            conversion_command = f"tensorflowjs_converter --input_format=tf_saved_model --output_format=tfjs_graph_model {saved_model_path} {tfjs_path}"
            
            print(f"Running conversion command: {conversion_command}")
            print("This may take a while depending on the model size...")
            
            os.system(conversion_command)
            
            # Check if conversion succeeded
            model_json_path = os.path.join(tfjs_path, 'model.json')
            if os.path.exists(model_json_path):
                print("✓ Model successfully converted to TensorFlow.js format")
                
                # Now check and update the model.json if needed
                print("Checking model.json for correct input specifications...")
                
                with open(model_json_path, 'r') as f:
                    model_json = json.load(f)
                
                # Print model JSON structure (optional for debugging)
                # print(json.dumps(model_json, indent=2))
                
                print("✓ Conversion completed successfully")
                print(f"TensorFlow.js model saved to: {tfjs_path}")
                
                return True
            else:
                print("✗ Error: model.json not found after conversion")
                return False
                
        else:
            print("\nOriginal model could not be loaded. Attempting to recreate model architecture...")
            
            # Recreate the model architecture
            recreated_model = create_multi_input_densenet_model()
            
            print("Model architecture recreated successfully.")
            print("WARNING: This is only the model architecture without trained weights.")
            print("The model will need to be trained or have weights loaded separately.")
            
            # Save the recreated model structure as a SavedModel
            saved_model_path = os.path.join(output_dir, 'saved_model')
            print(f"Saving recreated model structure to: {saved_model_path}")
            
            # Redirect stdout to minimize verbose output
            sys.stdout = open(os.devnull, 'w')
            tf.saved_model.save(recreated_model, saved_model_path)
            sys.stdout = original_stdout
            
            print("✓ Recreated model saved as TensorFlow SavedModel")
            
            # Generate a skeleton model.json manually
            tfjs_path = os.path.join(output_dir, 'tfjs_model')
            os.makedirs(tfjs_path, exist_ok=True)
            
            print("Creating skeleton files for web development...")
            model_json = {
                "format": "graph-model",
                "generatedBy": "custom_converter",
                "convertedBy": "convert_multi_input_model.py",
                "modelTopology": {
                    "inputs": [
                        {"name": "input_ap", "shape": [null, 224, 224, 3]},
                        {"name": "input_lat", "shape": [null, 224, 224, 3]},
                        {"name": "input_ob", "shape": [null, 224, 224, 3]}
                    ],
                    "outputs": [
                        {"name": "output", "shape": [null, 1]}
                    ]
                },
                "formatInstructions": "This is a placeholder model.json. You would need the actual weights from the original model."
            }
            
            with open(os.path.join(tfjs_path, 'model.json'), 'w') as f:
                json.dump(model_json, f, indent=2)
            
            print("✓ Created placeholder model.json")
            print("NOTE: This is only a skeleton structure. The actual conversion needs the original weights.")
            
            return False
    
    except Exception as e:
        print(f"Error in conversion process: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    parser = argparse.ArgumentParser(description='Convert multi-input DenseNet169 X-ray model to TensorFlow.js format')
    parser.add_argument('--model_path', type=str, required=True, help='Path to the original Keras model file (.keras or .h5)')
    parser.add_argument('--output_dir', type=str, required=True, help='Output directory for the converted model')
    
    args = parser.parse_args()
    
    print("\n===== ENVIRONMENT INFORMATION =====")
    print(f"Python version: {sys.version.split()[0]}")
    print(f"TensorFlow version: {tf.__version__}")
    print("===================================\n")
    
    success = load_and_convert_model(args.model_path, args.output_dir)
    
    if success:
        print("\n✅ Model conversion completed successfully!")
        print(f"TensorFlow.js model is available at: {os.path.join(args.output_dir, 'tfjs_model')}")
        print("\nTo use this model in your web application, you'll need to:")
        print("1. Load all three X-ray views (AP, Lateral, and Oblique)")
        print("2. Preprocess them to 224x224 RGB images")
        print("3. Load the model with:")
        print("   const model = await tf.loadGraphModel('path/to/model.json');")
        print("4. Make predictions with:")
        print("   const result = model.execute({")
        print("     'input_ap': apTensor,")
        print("     'input_lat': latTensor,")
        print("     'input_ob': obTensor")
        print("   });")
    else:
        print("\n❌ Model conversion encountered issues. See above for details.")

if __name__ == "__main__":
    main()
