const TokenGridNoTasks: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center">
      <h2 className="text-xl font-bold text-muted-foreground mb-2">
        No tasks in this list...
      </h2>
      <p className="text-muted-foreground max-w-md">
        Create your first task in the list to your right.
      </p>
    </div>
  );
};

export default TokenGridNoTasks;
