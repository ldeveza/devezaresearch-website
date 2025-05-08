# X-ray Fracture Detection Tool

This tool allows users to upload three views of distal radius X-rays (AP, Lateral, and Oblique) to detect fractures and determine if reduction is needed.

## Setup Instructions

1. Install the required dependencies:
   ```bash
   npm install @tensorflow/tfjs-node sharp uuid
   npm install --save-dev @types/uuid
   ```

2. Convert your Keras DenseNet169 model to TensorFlow.js format:
   ```bash
   # Install the TensorFlow.js converter
   pip install tensorflowjs

   # Convert your Keras model
   tensorflowjs_converter --input_format keras path/to/your/model.h5 public/model/densenet169/
   ```

3. Place the converted model files in the `public/model/densenet169/` directory.

## Model Structure

The current implementation expects a model with the following characteristics:

- Input: Three X-ray views (AP, Lateral, Oblique) as separate inputs
- Output: Two values:
  - Fracture detection (boolean/probability)
  - Reduction needed (boolean/probability)

You may need to modify the `route.ts` file based on your specific model structure:

- If your model takes a single input, you'll need to combine the images
- If your model has different output formats, adjust the prediction handling logic

## Additional Customization

- You can adjust the image preprocessing in the `preprocessImage` function to match your model's requirements
- Update the disclaimer text as needed for your specific use case
- Consider adding authentication if this tool is for restricted use

## Important Note

Remember that this is intended for research/educational purposes only, and not for clinical decision-making without proper medical oversight.
