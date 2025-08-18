const TokenGridNoList: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      <h2 className="text-2xl font-bold text-muted-foreground mb-2">
        Welcome to Task Hive!
      </h2>
      <p className="text-muted-foreground max-w-md">
        Select a list from the header, or create a new list to get started.
      </p>
    </div>
  );
};

export default TokenGridNoList;
