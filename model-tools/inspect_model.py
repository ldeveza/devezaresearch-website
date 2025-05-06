"""
Inspect Keras Model File

This script tries several approaches to inspect a Keras model file
without fully loading it, to identify potential custom layers or
other issues that might prevent loading in different environments.
"""

import os
import sys
import h5py
import json
import tensorflow as tf

# Set TensorFlow logging level to suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

def inspect_h5_file(model_path):
    """Try to inspect the H5 file structure without loading the model"""
    print(f"\nInspecting H5 file structure: {model_path}")
    try:
        with h5py.File(model_path, 'r') as f:
            # Print top-level keys
            print("Top-level keys:", list(f.keys()))
            
            # Look for model_config attribute
            if 'model_config' in f.attrs:
                config_json = f.attrs['model_config']
                if isinstance(config_json, bytes):
                    config_json = config_json.decode('utf-8')
                
                config = json.loads(config_json)
                print("\nModel architecture type:", config.get('class_name', 'Unknown'))
                
                # Check for custom objects
                if 'config' in config and 'layers' in config['config']:
                    layer_types = {}
                    for layer in config['config']['layers']:
                        layer_class = layer.get('class_name', 'Unknown')
                        if layer_class not in layer_types:
                            layer_types[layer_class] = 0
                        layer_types[layer_class] += 1
                    
                    print("\nLayer types in model:")
                    for layer_type, count in layer_types.items():
                        print(f"  - {layer_type}: {count}")
                    
                    # Look for potential custom layers
                    standard_layers = {
                        'InputLayer', 'Dense', 'Dropout', 'Activation', 'BatchNormalization',
                        'Conv2D', 'MaxPooling2D', 'AveragePooling2D', 'GlobalAveragePooling2D',
                        'GlobalMaxPooling2D', 'Flatten', 'Reshape', 'Concatenate', 'Add',
                        'ZeroPadding2D', 'UpSampling2D', 'Lambda', 'ReLU', 'Softmax'
                    }
                    
                    custom_layers = [lt for lt in layer_types.keys() if lt not in standard_layers]
                    if custom_layers:
                        print("\nPotential custom layers found:")
                        for layer in custom_layers:
                            print(f"  - {layer}")
            
            # Check for custom functions in the model
            if 'optimizer_config' in f.attrs:
                print("\nOptimizer configuration found")
            
            if 'training_config' in f.attrs:
                config_json = f.attrs['training_config']
                if isinstance(config_json, bytes):
                    config_json = config_json.decode('utf-8')
                
                config = json.loads(config_json)
                if 'loss' in config:
                    print(f"\nLoss function: {config['loss']}")
                if 'metrics' in config:
                    print(f"Metrics: {config['metrics']}")
    
    except Exception as e:
        print(f"Error inspecting H5 file: {str(e)}")

def try_load_with_custom_objects(model_path):
    """Try loading the model with various custom object configurations"""
    print(f"\nAttempting to load model with custom objects: {model_path}")
    
    # List of custom objects to try
    custom_objects_list = [
        # Empty custom objects
        {},
        
        # Try with common custom layers
        {
            'FixedDropout': tf.keras.layers.Dropout,
            'CustomDense': tf.keras.layers.Dense
        },
        
        # Try with common custom losses
        {
            'custom_loss': tf.keras.losses.BinaryCrossentropy(),
            'dice_loss': tf.keras.losses.BinaryCrossentropy()
        },
        
        # Try with common custom metrics
        {
            'accuracy': tf.keras.metrics.BinaryAccuracy(),
            'f1_score': tf.keras.metrics.Precision()  # Just a placeholder
        },
        
        # Try with decision forests imports if available
        # This is just a placeholder, we'll check if these exist
        {}
    ]
    
    # Try to import tensorflow_decision_forests and add relevant objects
    try:
        import tensorflow_decision_forests as tfdf
        custom_objects_list.append({
            'GradientBoostedTreesModel': tfdf.keras.GradientBoostedTreesModel,
            'RandomForestModel': tfdf.keras.RandomForestModel
        })
        print("Added TensorFlow Decision Forests objects to try")
    except ImportError:
        print("TensorFlow Decision Forests not available")
    
    # Try each set of custom objects
    for i, custom_objects in enumerate(custom_objects_list):
        print(f"\nTry #{i+1} with {len(custom_objects)} custom objects")
        try:
            # Suppress detailed output
            original_stdout = sys.stdout
            sys.stdout = open(os.devnull, 'w')
            
            model = tf.keras.models.load_model(model_path, custom_objects=custom_objects, compile=False)
            
            # Restore stdout
            sys.stdout = original_stdout
            
            print(f"✓ Success! Model loaded with custom objects attempt #{i+1}")
            print(f"Model input shape: {model.input_shape}")
            print(f"Model output shape: {model.output_shape}")
            print(f"Model has {len(model.layers)} layers")
            
            # Print a few layer names
            print("First 5 layers:")
            for j, layer in enumerate(model.layers[:5]):
                print(f"  - {j}: {layer.name} ({type(layer).__name__})")
            
            return model
        except Exception as e:
            # Restore stdout
            if 'original_stdout' in locals():
                sys.stdout = original_stdout
            
            print(f"✗ Failed with error: {type(e).__name__}: {str(e)}")
    
    print("\nAll attempts to load the model with custom objects failed")
    return None

def main():
    # Define model path
    model_path = 'C:/Users/ldeve/CascadeProjects/windsurf-project/distal_radius_weights/DN169_3View.keras'
    
    if not os.path.exists(model_path):
        print(f"Error: Model file not found at {model_path}")
        return
    
    print(f"Inspecting model file: {model_path}")
    
    # Try to inspect the H5 file structure
    inspect_h5_file(model_path)
    
    # Try loading with various custom objects
    model = try_load_with_custom_objects(model_path)
    
    if model is not None:
        print("\n✅ Model inspection and loading successful!")
    else:
        print("\n❌ Unable to load the model")
        print("\nPossible solutions:")
        print("1. Check if the model was saved with custom layers or functions")
        print("2. Try loading the model in the same environment it was created in")
        print("3. Consider re-exporting the model as a standalone SavedModel")
        print("4. If applicable, install tensorflow_decision_forests with matching versions")

if __name__ == "__main__":
    main()
