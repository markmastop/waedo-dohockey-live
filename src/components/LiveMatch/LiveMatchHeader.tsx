const LiveMatchHeader = () => {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div>
          <img
            src="/lovable-uploads/0eca3ff3-5e4a-4be9-881d-e839832a5b13.png"
            alt="We Do Hockey Logo"
            className="w-24 h-24 object-contain"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Live Match</h1>
          <p className="text-gray-600 mt-2">Real-time Updates</p>
        </div>
      </div>
      <p className="text-gray-600 text-lg">Follow your team's game in real-time</p>
    </div>
  );
};

export default LiveMatchHeader;
