import json
import os

def create_model_json():
    """
    Creates a minimal model.json file that tells the x-ray tool 
    to use the tf.loadGraphModel format instead.
    """
    output_dir = '../public/model/densenet169/'
    
    # Make sure the directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Create a simple model.json file
    model_json = {
        "format": "graph-model",
        "generatedBy": "manual",
        "convertedBy": "manual",
        "modelTopology": {
            "node": []
        },
        "weightsManifest": [
            {
                "paths": ["group1-shard1of1.bin"],
                "weights": []
            }
        ]
    }
    
    # Write the model.json file
    model_json_path = os.path.join(output_dir, 'model.json')
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f, indent=2)
    
    # Create a dummy binary file
    dummy_file_path = os.path.join(output_dir, 'group1-shard1of1.bin')
    with open(dummy_file_path, 'wb') as f:
        f.write(b'\x00\x00\x00\x00')
    
    print(f"Created model.json file at {model_json_path}")
    print(f"Created dummy weights file at {dummy_file_path}")
    print("\nYou'll need to update the X-ray tool page to use:")
    print("  tf.loadGraphModel('/model/densenet169/model.json')")
    print("instead of:")
    print("  tf.loadLayersModel('/model/densenet169/model.json')")

if __name__ == "__main__":
    create_model_json()
