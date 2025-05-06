import { NextRequest, NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs-node';
import sharp from 'sharp';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';

// Load the TensorFlow.js model
let model: tf.LayersModel | null = null;

async function loadModel() {
  if (!model) {
    try {
      // Replace with the path to your saved model
      model = await tf.loadLayersModel('file://./public/model/densenet169/model.json');
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
      throw new Error('Failed to load model');
    }
  }
  return model;
}

// Preprocess the image for the model
async function preprocessImage(imagePath: string): Promise<tf.Tensor> {
  // Resize to 224x224 (or whatever your model expects)
  const imageBuffer = await sharp(imagePath)
    .resize(224, 224)
    .grayscale() // Convert to grayscale if your model expects it
    .toBuffer();

  // Convert to tensor and normalize
  const tensor = tf.node.decodeImage(imageBuffer, 3);
  
  // Normalize to 0-1 range
  const normalized = tensor.div(tf.scalar(255));
  
  // Expand dimensions to match model input [batch, height, width, channels]
  const batched = normalized.expandDims(0);
  
  // Clean up the non-batched tensor
  tensor.dispose();
  
  return batched;
}

export async function POST(request: NextRequest) {
  try {
    // Load the model
    await loadModel();
    
    // Parse the form data
    const formData = await request.formData();
    const apFile = formData.get('ap') as File;
    const lateralFile = formData.get('lateral') as File;
    const obliqueFile = formData.get('oblique') as File;
    
    if (!apFile || !lateralFile || !obliqueFile) {
      return NextResponse.json(
        { error: 'All three X-ray views are required' },
        { status: 400 }
      );
    }

    // Save files temporarily
    const tempDir = tmpdir();
    const apPath = join(tempDir, `${uuidv4()}-ap.png`);
    const lateralPath = join(tempDir, `${uuidv4()}-lateral.png`);
    const obliquePath = join(tempDir, `${uuidv4()}-oblique.png`);
    
    await writeFile(apPath, Buffer.from(await apFile.arrayBuffer()));
    await writeFile(lateralPath, Buffer.from(await lateralFile.arrayBuffer()));
    await writeFile(obliquePath, Buffer.from(await obliqueFile.arrayBuffer()));
    
    // Preprocess the images
    const apTensor = await preprocessImage(apPath);
    const lateralTensor = await preprocessImage(lateralPath);
    const obliqueTensor = await preprocessImage(obliquePath);
    
    // Run predictions
    // Note: The actual implementation depends on how your model is designed to handle multiple views
    // This is a simplified example - you'll need to adapt it to your specific model
    
    // Option 1: If your model takes all three views as separate inputs
    const predictions = await model!.predict([apTensor, lateralTensor, obliqueTensor]) as tf.Tensor;
    
    // Option 2: If you need to process each view separately and combine results
    // const apPrediction = await model!.predict(apTensor) as tf.Tensor;
    // const lateralPrediction = await model!.predict(lateralTensor) as tf.Tensor;
    // const obliquePrediction = await model!.predict(obliqueTensor) as tf.Tensor;
    // const combinedPrediction = tf.concat([apPrediction, lateralPrediction, obliquePrediction], 1);
    
    // Extract the prediction results
    const predictionData = await predictions.data();
    
    // Clean up tensors
    apTensor.dispose();
    lateralTensor.dispose();
    obliqueTensor.dispose();
    predictions.dispose();
    
    // Format and return results
    // Note: Adjust indices based on your model's output format
    const hasFracture = predictionData[0] > 0.5;
    const needsReduction = hasFracture && predictionData[1] > 0.5;
    const confidence = hasFracture ? predictionData[0] : 1 - predictionData[0];
    
    return NextResponse.json({
      fracture: hasFracture,
      needsReduction: needsReduction,
      confidence: confidence,
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to process X-ray images' },
      { status: 500 }
    );
  }
}
