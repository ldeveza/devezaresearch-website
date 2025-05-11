import FractureDetector from '../../components/FractureDetector';

export const metadata = {
  title: 'X-Ray Fracture Analysis',
  description: 'Analyze X-ray images for fracture detection using AI',
};

export default function AnalyzePage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">X-Ray Fracture Analysis</h1>
      <FractureDetector />
    </div>
  );
}
