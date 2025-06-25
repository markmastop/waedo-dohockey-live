
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 mb-2">🏑 Field Hockey Live</h1>
          <p className="text-green-600">Follow your team's matches in real-time</p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-green-800">Welcome Parents!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Stay connected with your child's field hockey matches. Get live scores, 
              match updates, and never miss a moment of the action.
            </p>
            
            <Link to="/live-match" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                📱 Follow Live Match
              </Button>
            </Link>
            
            <div className="text-xs text-gray-500 text-center mt-4">
              <p>Get your match key from your coach to start following the game</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
